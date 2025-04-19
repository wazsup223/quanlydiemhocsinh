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
include_once '../../models/students.php';

$database = new Database();
$db = $database->getConnection();

$student = new Student($db);

$response = array(
    "status" => "success",
    "message" => "",
    "data" => null
);

// Lấy ID từ query string
$id = isset($_GET['id']) ? $_GET['id'] : null;

if (!$id) {
    http_response_code(400);
    echo json_encode([
        "status" => "error",
        "message" => "Thiếu mã sinh viên",
        "data" => null
    ]);
    exit;
}

$student->id = $id;

// Nếu tìm thấy sinh viên
if ($student->readOne()) {
    $response["message"] = "Lấy thông tin sinh viên thành công";
    $response["data"] = [
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
        "department_id" => $student->department_id
    ];

    http_response_code(200);
} else {
    $response["status"] = "error";
    $response["message"] = "Không tìm thấy sinh viên";
    http_response_code(404);
}

echo json_encode($response);
?>