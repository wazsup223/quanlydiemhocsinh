<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: DELETE");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../../config/database.php';
include_once '../../models/grades.php';

$database = new Database();
$db = $database->getConnection();

$grade = new Grade($db);

$data = json_decode(file_get_contents("php://input"));

$response = array(
    "status" => "success",
    "message" => "",
    "data" => null
);

if (!empty($data->id)) {
    $grade->id = $data->id;

    if ($grade->delete()) {
        $response["message"] = "Xóa điểm thành công";
        $response["data"] = array("id" => $grade->id);
        http_response_code(200);
    } else {
        $response["status"] = "error";
        $response["message"] = "Không thể xóa điểm";
        http_response_code(503);
    }
} else {
    $response["status"] = "error";
    $response["message"] = "Thiếu ID";
    http_response_code(400);
}

echo json_encode($response);
?>
