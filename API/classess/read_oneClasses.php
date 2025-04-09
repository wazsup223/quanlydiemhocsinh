<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../../config/database.php';
include_once '../../models/classes.php';

$database = new Database();
$db = $database->getConnection();

$classes = new Classes($db);

$data = json_decode(file_get_contents("php://input"));

$response = array(
    "status" => "success",
    "message" => "",
    "data" => null
);

if (!empty($data->id)) {
    $classes->id = $data->id;
    $classes->readOne();

    if ($classes->name != null) {
        $response["data"] = array(
            "id" => $classes->id,
            "name" => $classes->name,
            "max_students" => $classes->max_students,
            "department_id" => $classes->department_id,
            "host_instructor_id" => $classes->host_instructor_id
        );
        $response["message"] = "Lấy thông tin lớp học thành công";
        http_response_code(200);
    } else {
        $response["status"] = "error";
        $response["message"] = "Không tìm thấy lớp học";
        http_response_code(404);
    }
} else {
    $response["status"] = "error";
    $response["message"] = "Dữ liệu không đầy đủ";
    http_response_code(400);
}

echo json_encode($response);

?>