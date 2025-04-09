<?php
// Headers
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET');
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
if(!empty($data->instructor_id)) {
    
    // Kiểm tra giảng viên tồn tại
    $instructor = new Instructor($db);
    $instructor->id = $data->instructor_id;
    if(!$instructor->readOne()) {
        http_response_code(404);
        echo json_encode([
            "status" => "error",
            "message" => "Không tìm thấy giảng viên",
            "data" => null
        ]);
        exit();
    }

    // Gán ID giảng viên cho phân công
    $assignment->instructor_id = $data->instructor_id;

    // Đọc danh sách phân công theo giảng viên
    $stmt = $assignment->readByInstructor($data->instructor_id);
    if($stmt) {
        http_response_code(200);
        echo json_encode([
            "status" => "success",
            "message" => "Lấy danh sách phân công thành công",
            "data" => [
                "records" => $stmt->fetchAll(PDO::FETCH_ASSOC)
            ]
        ]);
    } else {
        http_response_code(404);
        echo json_encode([
            "status" => "error",
            "message" => "Không tìm thấy phân công nào",
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