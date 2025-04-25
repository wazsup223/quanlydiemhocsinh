<?php
// Cấu hình CORS như đã đề cập
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include_once '../../config.php';
include_once '../../models/students.php';

$database = new Database();
$db = $database->getConnection();

$students = new Student($db);

// Lấy id từ query string
$class_id = isset($_GET['id']) ? intval($_GET['id']) : 0;

$response = [
    "status" => "success",
    "message" => "",
    "data" => [],
];

if ($class_id > 0) {
    $stmt = $students->readByClassId($class_id); // cần viết hàm getByClassId trong model
    $data = [];

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $data[] = $row;
    }

    $response["data"] = $data;
    $response["message"] = "Lấy danh sách sinh viên thành công";
    http_response_code(200);
} else {
    $response["status"] = "error";
    $response["message"] = "Thiếu hoặc sai tham số class_id";
    http_response_code(400);
}

echo json_encode($response);