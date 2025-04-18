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
include_once '../../models/subjects.php';

$database = new Database();
$db = $database->getConnection();

$subject = new Subject($db);

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
        "message" => "Thiếu mã môn học",
        "data" => null
    ]);
    exit;
}

$subject->id = $id;

// Nếu tìm thấy mon học 
if ($subject->readOne()) {
    $response["message"] = "Lấy thông tin mon học thành công";
    $response["data"] = [
        "id" => $subject->id,
        "name" => $subject->name,
        "credits" => $subject->credits,
        "semester" => $subject->semester,
        "process_percentage" => $subject->process_percentage,
        "midterm_percentage" => $subject->midterm_percentage,
        "final_percentage" => $subject->final_percentage,

        "created_at" => $subject->created_at,
        "class_id" => $subject->updated_at,
        "department_id" => $subject->department_id
    ];

    http_response_code(200);
} else {
    $response["status"] = "error";
    $response["message"] = "Không tìm thấy môn học";
    http_response_code(404);
}

echo json_encode($response);
?>