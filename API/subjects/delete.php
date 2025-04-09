<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: DELETE");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../../config/database.php';
include_once '../../models/subjects.php';

$database = new Database();
$db = $database->getConnection();

$subject = new Subject($db);

$data = json_decode(file_get_contents("php://input"));

$response = array(
    "status" => "success",
    "message" => "",
    "data" => null
);

if(!empty($data->id)) {
    $subject->id = $data->id;

    if($subject->delete()) {
        $response["message"] = "Xóa môn học thành công";
        $response["data"] = array("id" => $subject->id);
        http_response_code(200);
    } else {
        $response["status"] = "error";
        $response["message"] = "Không thể xóa môn học";
        http_response_code(503);
    }
} else {
    $response["status"] = "error";
    $response["message"] = "Dữ liệu không đầy đủ";
    http_response_code(400);
}

echo json_encode($response);
?> 