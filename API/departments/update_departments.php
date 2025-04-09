<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: PUT");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../../config/database.php';
include_once '../../models/departments.php';

$database = new Database();
$db = $database->getConnection();

$departments = new Departments($db);

$data = json_decode(file_get_contents("php://input"));

$response = array(
    "status" => "success",
    "message" => "",
    "data" => null
);

if (
    !empty($data->id) && !empty($data->symbol) && !empty($data->name) &&
    !empty($data->created_at) && !empty($data->updated_at)
) {

    $departments->id = $data->id;
    $departments->symbol = $data->symbol;
    $departments->name = $data->name;
    $departments->created_at = $data->created_at;
    $departments->updated_at = $data->updated_at;

    if ($departments->update()) {
        $response["message"] = "Cập nhật thông tin khoa thành công";
        $response["data"] = array(
            "id" => $departments->id,
            "symbol" => $departments->symbol,
            "name" => $departments->name,
            "created_at" => $departments->created_at,
            "updated_at" => $departments->updated_at
        );
        http_response_code(200);
    } else {
        $response["status"] = "error";
        $response["message"] = "Không thể cập nhật thông tin khoa";
        http_response_code(503);
    }
} else {
    $response["status"] = "error";
    $response["message"] = "Dữ liệu không đầy đủ";
    http_response_code(400);
}

echo json_encode($response);
?>