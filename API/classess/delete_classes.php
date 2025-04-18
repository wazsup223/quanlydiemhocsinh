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
include_once '../../models/classes.php';

$database = new Database();
$db = $database->getConnection();

$classes = new Classes($db);

// Nhận và giải mã JSON đầu vào
$data = json_decode(file_get_contents("php://input"));

$response = [
    "status" => "error", // Mặc định là lỗi
    "message" => "Đã xảy ra lỗi không xác định.",
    "data" => null
];

if (!empty($data->id)) {
    $classes->id = $data->id;

    try {
        if ($classes->delete()) {
            $response["status"] = "success";
            $response["message"] = "Xóa lớp học thành công";
            $response["data"] = ["id" => $classes->id];
            http_response_code(200);
        } else {
            $response["message"] = "Không thể xóa lớp học. Có thể do lớp còn chứa sinh viên.";
            http_response_code(409); // Conflict
        }
    } catch (PDOException $e) {
        // Lỗi ràng buộc khóa ngoại
        if ($e->getCode() == 23000) {
            $response["message"] = "Lớp học không thể xóa vì có sinh viên đang theo học.";
            http_response_code(409); // Conflict
        } else {
            $response["message"] = "Lỗi cơ sở dữ liệu: " . $e->getMessage();
            http_response_code(500); // Internal Server Error
        }
    }
} else {
    $response["message"] = "Thiếu ID lớp cần xóa.";
    http_response_code(400); // Bad Request
}

echo json_encode($response);