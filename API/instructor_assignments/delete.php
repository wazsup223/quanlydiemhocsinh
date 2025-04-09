<?php
// Headers
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: DELETE');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods,Authorization,X-Requested-With');

include_once '../../config/database.php';
include_once '../../models/InstructorAssignment.php';
include_once '../../models/Instructor.php';

// Khởi tạo kết nối cơ sở dữ liệu
$database = new Database();
$db = $database->getConnection();

// Lấy ID từ URL
$id = isset($_GET['id']) ? $_GET['id'] : die();

// Kiểm tra phân công có tồn tại không
$query = "SELECT ia.*, s.name as subject_name, 
          CONCAT(i.first_name, ' ', i.last_name) as instructor_name
          FROM instructor_assignments ia
          JOIN subjects s ON ia.subject_id = s.id
          JOIN instructors i ON ia.instructor_id = i.id
          WHERE ia.id = ?";
$stmt = $db->prepare($query);
$stmt->bindParam(1, $id);
$stmt->execute();

if($stmt->rowCount() > 0) {
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    
    // Xóa phân công
    $query = "DELETE FROM instructor_assignments WHERE id = ?";
    $stmt = $db->prepare($query);
    $stmt->bindParam(1, $id);
    
    if($stmt->execute()) {
        http_response_code(200);
        echo json_encode([
            "status" => "success",
            "message" => "Xóa phân công giảng dạy thành công",
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
            "message" => "Không thể xóa phân công giảng dạy",
            "data" => null
        ]);
    }
} else {
    http_response_code(404);
    echo json_encode([
        "status" => "error",
        "message" => "Không tìm thấy phân công giảng dạy",
        "data" => null
    ]);
}
?> 