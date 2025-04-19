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

$data = json_decode(file_get_contents("php://input"));

$response = array(
    "status" => "success",
    "message" => "",
    "data" => null
);

if (!empty($data->id)) {
    $departments->id = $data->id;

    if ($departments->delete()) {
        $response["message"] = "Xóa khoa thành công";
        $response["data"] = array("id" => $departments->id);
        http_response_code(200);
    } else {
        $response["status"] = "error";
        $response["message"] = "Không thể xóa khoa";
        http_response_code(503);
    }
} else {
    $response["status"] = "error";
    $response["message"] = "Dữ liệu không đầy đủ";
    http_response_code(400);
}
echo json_encode($response);

?>