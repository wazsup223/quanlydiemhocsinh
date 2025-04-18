<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: *");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include_once '../../config.php';
include_once '../../models/student_reg.php';

$database = new Database();
$db = $database->getConnection();

$student_reg = new Student_reg($db);

$data = json_decode(file_get_contents("php://input"));

$response = array(
    "status" => "success",
    "message" => "",
    "data" => null
);

// Kiểm tra dữ liệu gửi đi
if (
    !empty($data->subject_id) && !empty($data->student_id)

) {
    // Gán giá trị cho các trường cần thiết
    $student_reg->subject_id = $data->subject_id;
    $student_reg->student_id = $data->student_id;
    $student_reg->created_at = date('Y-m-d H:i:s'); // Gán thời gian tạo mới
    $student_reg->updated_at = date('Y-m-d H:i:s');// Gán thời gian cập nhật

    // Thực hiện thêm mới vào cơ sở dữ liệu
    if ($student_reg->create()) {
        $response["message"] = "Thêm sinh viên tham gia môn học thành công";
        $response["data"] = array(
            "subject_id" => $student_reg->subject_id,
            "student_id" => $student_reg->student_id,
            "created_at" => $student_reg->created_at,
            "updated_at" => $student_reg->updated_at
        );
        http_response_code(201); // Thành công, tạo mới
    } else {
        $response["status"] = "error";
        $response["message"] = "Không thể thêm sinh viên tham gia môn học";
        http_response_code(503); // Lỗi server
    }
} else {
    $response["status"] = "error";
    $response["message"] = "Dữ liệu không đầy đủ";
    http_response_code(400); // Lỗi dữ liệu không hợp lệ
}

echo json_encode($response);
?>