<?php
// Header cho phép truy cập API từ bên ngoài
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: *");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Kết nối database và include model
include_once '../../config.php';
include_once '../../models/InstructorAssignment.php';

// Khởi tạo kết nối database
$database = new Database();
$db = $database->getConnection();

// Khởi tạo đối tượng InstructorAssignment
$assignment = new InstructorAssignment($db);

// Lấy dữ liệu JSON từ request body
$data = json_decode(file_get_contents("php://input"));

// Kiểm tra dữ liệu đầu vào
if (
    isset($data->old_subject_id) &&
    isset($data->old_instructor_id) &&
    isset($data->new_subject_id) &&
    isset($data->new_instructor_id)
) {
    // Gán dữ liệu mới vào đối tượng
    $assignment->subject_id = $data->new_subject_id;
    $assignment->instructor_id = $data->new_instructor_id;

    // Gọi hàm update với subject_id và instructor_id cũ
    if ($assignment->update($data->old_subject_id, $data->old_instructor_id)) {
        echo json_encode(["message" => "Phân công giảng dạy đã được cập nhật."]);
    } else {
        echo json_encode(["message" => "Không thể cập nhật phân công hoặc phân công không tồn tại."]);
    }
} else {
    // Trường hợp thiếu dữ liệu
    http_response_code(400);
    echo json_encode(["message" => "Dữ liệu không đầy đủ."]);
}