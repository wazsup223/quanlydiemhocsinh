<?php
// Headers
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods,Authorization,X-Requested-With');

// Bao gồm các file cần thiết
include_once '../../config/database.php';
include_once '../../models/InstructorAssignment.php';

// Khởi tạo kết nối cơ sở dữ liệu
$database = new Database();
$db = $database->getConnection();

// Khởi tạo đối tượng phân công
$assignment = new InstructorAssignment($db);

// Lấy dữ liệu từ request
$data = json_decode(file_get_contents("php://input"));

// Kiểm tra dữ liệu đầu vào
if(!empty($data->subject_id) && !empty($data->instructor_id)) {
    $assignment->subject_id = $data->subject_id;
    $assignment->instructor_id = $data->instructor_id;

    // Lấy thông tin phân công
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

    if(!$row) {
        http_response_code(404);
        echo json_encode([
            "status" => "error",
            "message" => "Không tìm thấy phân công giảng dạy",
            "data" => null
        ]);
        exit();
    }

    http_response_code(200);
    echo json_encode([
        "status" => "success",
        "message" => "Lấy thông tin phân công giảng dạy thành công",
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
    http_response_code(400);
    echo json_encode([
        "status" => "error",
        "message" => "Dữ liệu không đầy đủ",
        "data" => null
    ]);
}
?> 