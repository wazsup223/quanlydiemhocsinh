<?php

// ===== Xử lý CORS =====
header("Access-Control-Allow-Origin: *"); // hoặc http://localhost:3000 nếu muốn giới hạn
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Trả về 200 OK cho preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// ===== Gọi các file cần thiết =====
include_once '../../config.php';
include_once '../../models/students.php';

$database = new Database();
$db = $database->getConnection();
$student = new Student($db);

// ===== Nhận dữ liệu =====
$data = json_decode(file_get_contents("php://input"));

$response = array(
    "status" => "success",
    "message" => "",
    "data" => null
);

// ===== Kiểm tra dữ liệu bắt buộc =====
if (
    !empty($data->id) && !empty($data->first_name) && !empty($data->last_name) &&
    !empty($data->email) && !empty($data->address) && !empty($data->birth_day) &&
    !empty($data->phone) && isset($data->gender) && !empty($data->academic_year) &&
    !empty($data->class_id) && !empty($data->department_id)
) {
    // Gán dữ liệu
    $student->id = $data->id;
    $student->first_name = $data->first_name;
    $student->last_name = $data->last_name;
    $student->email = $data->email;
    $student->address = $data->address;
    $student->birth_day = $data->birth_day;
    $student->phone = $data->phone;
    $student->gender = $data->gender;
    $student->academic_year = $data->academic_year;
    $student->class_id = $data->class_id;
    $student->department_id = $data->department_id;
    $student->updated_at = date('Y-m-d H:i:s');

    // Gọi hàm cập nhật
    if ($student->update()) {
        $response["message"] = "Cập nhật thông tin sinh viên thành công";
        $response["data"] = array(
            "id" => $student->id,
            "first_name" => $student->first_name,
            "last_name" => $student->last_name,
            "email" => $student->email,
            "address" => $student->address,
            "birth_day" => $student->birth_day,
            "phone" => $student->phone,
            "gender" => $student->gender,
            "academic_year" => $student->academic_year,
            "class_id" => $student->class_id,
            "department_id" => $student->department_id,
            "updated_at" => $student->updated_at
        );
        http_response_code(200);
    } else {
        $response["status"] = "error";
        $response["message"] = "Không thể cập nhật thông tin sinh viên";
        http_response_code(503);
    }
} else {
    $response["status"] = "error";
    $response["message"] = "Dữ liệu không đầy đủ";
    http_response_code(400);
}

// ===== Trả JSON về client =====
echo json_encode($response);
?>