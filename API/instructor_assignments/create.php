<?php
// Headers
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods,Authorization,X-Requested-With');

include_once '../../config/database.php';
include_once '../../models/InstructorAssignment.php';
include_once '../../models/Instructor.php';

// Khởi tạo kết nối cơ sở dữ liệu
$database = new Database();
$db = $database->getConnection();

// Khởi tạo đối tượng phân công
$assignment = new InstructorAssignment($db);

// Lấy dữ liệu từ request
$data = json_decode(file_get_contents("php://input"));

// Kiểm tra dữ liệu đầu vào
if(!empty($data->subject_id) && !empty($data->instructor_id)) {
    
    // Kiểm tra giảng viên tồn tại
    $instructor = new Instructor($db);
    $instructor->id = $data->instructor_id;
    if(!$instructor->readOne()) {
        http_response_code(400);
        echo json_encode([
            "status" => "error",
            "message" => "Giảng viên không tồn tại",
            "data" => null
        ]);
        exit();
    }

    // Kiểm tra môn học tồn tại bằng truy vấn SQL trực tiếp
    $query = "SELECT id FROM subjects WHERE id = ?";
    $stmt = $db->prepare($query);
    $stmt->bindParam(1, $data->subject_id);
    $stmt->execute();
    
    if($stmt->rowCount() == 0) {
        http_response_code(400);
        echo json_encode([
            "status" => "error",
            "message" => "Môn học không tồn tại",
            "data" => null
        ]);
        exit();
    }

    // Kiểm tra giảng viên và môn học có cùng khoa không
    $query = "SELECT i.department_id as instructor_dept, s.department_id as subject_dept 
              FROM instructors i, subjects s 
              WHERE i.id = ? AND s.id = ?";
    $stmt = $db->prepare($query);
    $stmt->bindParam(1, $data->instructor_id);
    $stmt->bindParam(2, $data->subject_id);
    $stmt->execute();
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    if(!$row) {
        http_response_code(400);
        echo json_encode(array(
            "message" => "Không tìm thấy giảng viên hoặc môn học.",
            "error" => "instructor_or_subject_not_found"
        ));
        exit();
    }

    if($row['instructor_dept'] != $row['subject_dept']) {
        http_response_code(400);
        echo json_encode(array(
            "message" => "Giảng viên và môn học phải thuộc cùng một khoa.",
            "error" => "different_departments"
        ));
        exit();
    }

    // Kiểm tra phân công đã tồn tại chưa
    $query = "SELECT * FROM instructor_assignments WHERE subject_id = ? AND instructor_id = ?";
    $stmt = $db->prepare($query);
    $stmt->bindParam(1, $data->subject_id);
    $stmt->bindParam(2, $data->instructor_id);
    $stmt->execute();
    
    if($stmt->rowCount() > 0) {
        http_response_code(200);
        echo json_encode([
            "status" => "success",
            "message" => "Phân công giảng dạy đã tồn tại",
            "data" => null
        ]);
        exit();
    }

    // Gán các thuộc tính cho phân công
    $assignment->subject_id = $data->subject_id;
    $assignment->instructor_id = $data->instructor_id;

    // Tạo phân công mới
    if($assignment->create()) {
        // Lấy thông tin chi tiết về phân công vừa tạo
        $query = "SELECT ia.*, s.name as subject_name, 
                  CONCAT(i.first_name, ' ', i.last_name) as instructor_name
                  FROM instructor_assignments ia
                  JOIN subjects s ON ia.subject_id = s.id
                  JOIN instructors i ON ia.instructor_id = i.id
                  WHERE ia.subject_id = ? AND ia.instructor_id = ?";
        $stmt = $db->prepare($query);
        $stmt->bindParam(1, $data->subject_id);
        $stmt->bindParam(2, $data->instructor_id);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        http_response_code(200);
        echo json_encode([
            "status" => "success",
            "message" => "Tạo phân công giảng dạy thành công",
            "data" => [
                "subject_id" => $row['subject_id'],
                "instructor_id" => $row['instructor_id'],
                "subject_name" => $row['subject_name'],
                "instructor_name" => $row['instructor_name'],
                "created_at" => $row['created_at'],
                "updated_at" => $row['updated_at']
            ]
        ]);
    } else {
        http_response_code(200);
        echo json_encode([
            "status" => "success",
            "message" => "Phân công giảng dạy đã tồn tại",
            "data" => null
        ]);
    }
} else {
    http_response_code(400);
    echo json_encode([
        "status" => "error",
        "message" => "Dữ liệu không đầy đủ",
        "data" => null
    ]);
}
?> 