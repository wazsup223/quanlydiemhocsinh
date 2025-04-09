<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: PUT");
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

if (
    !empty($data->id) && !empty($data->name) && !empty($data->max_students) &&
    !empty($data->department_id) && !empty($data->host_instructor_id) &&
    !empty($data->created_at) && !empty($data->updated_at)
) {

    $classes->id = $data->id;
    $classes->name = $data->name;
    $classes->max_students = $data->max_students;
    $classes->department_id = $data->department_id;
    $classes->host_instructor_id = $data->host_instructor_id;
    $classes->created_at = $data->created_at;
    $classes->updated_at = $data->updated_at;

    if ($classes->update()) {
        $response["message"] = "Cập nhật thông tin lớp học thành công";
        $response["data"] = array(
           "id" => $classes->id,
            "name" => $classes->name,
            "max_students" => $classes->max_students,
            "department_id" => $classes->department_id,
            "host_instructor_id" => $classes->host_instructor_id,
            "created_at" => $classes->created_at,
            "updated_at" => $classes->updated_at
        );
        http_response_code(200);
    } else {
        $response["status"] = "error";
        $response["message"] = "Không thể cập nhật thông tin lớp học";
        http_response_code(503);
    }
} else {
    $response["status"] = "error";
    $response["message"] = "Dữ liệu không đầy đủ";
    http_response_code(400);
}

echo json_encode($response);
?>