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

// Lấy dữ liệu từ body request
$data = json_decode(file_get_contents("php://input"));

$response = array(
    "status" => "success",
    "message" => "",
    "data" => null
);

// Kiểm tra xem các trường cần thiết có tồn tại không
if (
    !empty($data->symbol) && !empty($data->name)
) {
    // Không cần gán id, created_at, và updated_at vì chúng sẽ được tự động xử lý bởi cơ sở dữ liệu
    $departments->symbol = $data->symbol;
    $departments->name = $data->name;
    $departments->created_at = $data->created_at;

    // Thêm khoa vào cơ sở dữ liệu
    if ($departments->create()) {


        // Trả về thông tin khoa đã được thêm
        $response["message"] = "Thêm khoa thành công";
        $response["data"] = array(
            "id" => $departments->id, // id mới tạo
            "symbol" => $departments->symbol,
            "name" => $departments->name,
            "created_at" => date('Y-m-d H:i:s')
        );
        http_response_code(201);
    } else {
        // Nếu không thể thêm khoa, trả về lỗi
        $response["status"] = "error";
        $response["message"] = "Không thể thêm khoa";
        http_response_code(503);
    }
} else {
    // Trường hợp dữ liệu không đầy đủ
    $response["status"] = "error";
    $response["message"] = "Dữ liệu không đầy đủ";
    http_response_code(400);
}

// Trả về phản hồi dạng JSON
echo json_encode($response);
?>