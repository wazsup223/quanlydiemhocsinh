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
include_once '../../models/departments.php';

$database = new Database();
$db = $database->getConnection();

$departments = new Departments($db);

$response = array(
    "status" => "success",
    "message" => "",
    "data" => null
);

// Lấy tham số từ query string (GET)
if (isset($_GET['id']) && !empty($_GET['id'])) {
    $departments->id = $_GET['id']; // Lấy id từ URL query string
    $departments->readOne();

    if ($departments->name != null) {
        $response["data"] = array(
            "id" => $departments->id,
            "symbol" => $departments->symbol,
            "name" => $departments->name,
            "created_at" => $departments->created_at,
            "updated_at" => $departments->updated_at
        );
        $response["message"] = "Lấy thông tin khoa thành công";
        http_response_code(200);
    } else {
        $response["status"] = "error";
        $response["message"] = "Không tìm thấy khoa";
        http_response_code(404);
    }
} else {
    $response["status"] = "error";
    $response["message"] = "Dữ liệu không đầy đủ";
    http_response_code(400);
}

echo json_encode($response);
?>