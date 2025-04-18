<?php
// Cho phép mọi domain truy cập (CORS)
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Nếu là preflight (OPTIONS), trả về 200 OK
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Kết nối CSDL và model
include_once '../../config.php';
include_once '../../models/students.php';

$database = new Database();
$db = $database->getConnection();

$student = new Student($db);

// Nhận dữ liệu JSON từ frontend
$data = json_decode(file_get_contents("php://input"));

$response = [
    "status" => "success",
    "message" => "",
    "data" => null
];

// Kiểm tra có ID không
if (!empty($data->id)) {
    $student->id = $data->id;

    if ($student->delete()) {
        $response["message"] = "Xóa sinh viên thành công";
        $response["data"] = ["id" => $student->id];
        http_response_code(200);
    } else {
        $response["status"] = "error";
        $response["message"] = "Không thể xóa sinh viên. Có thể sinh viên không tồn tại hoặc bị ràng buộc khoá ngoại.";
        http_response_code(503);
    }
} else {
    $response["status"] = "error";
    $response["message"] = "Thiếu ID sinh viên.";
    http_response_code(400);
}

echo json_encode($response);
?>