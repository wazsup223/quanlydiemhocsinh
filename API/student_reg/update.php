<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: PUT");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../../config/database.php';
include_once '../../models/student_reg.php';

$database = new Database();
$db = $database->getConnection();

$student_reg = new Student_reg($db);

$data = json_decode(file_get_contents("php://input"));

$response = array(
    "status" => "success",
    "message" => "",
    "data" => null
);

if (
    !empty($data->id) && !empty($data->subject_id) && !empty($data->student_id) &&
    !empty($data->created_at) && !empty($data->updated_at)
) {

    $student_reg->id = $data->id;
    $student_reg->subject_id = $data->subject_id;
    $student_reg->student_id = $data->student_id;
    $student_reg->created_at = $data->created_at;
    $student_reg->updated_at = $data->updated_at;

    if ($student_reg->update()) {
        $response["message"] = "Cập nhật thông tin sinh viên tham gia môn học thành công";
        $response["data"] = array(
            "id" => $student_reg->id,
            "subject_id" => $student_reg->subject_id,
            "student_id" => $student_reg->student_id,
            "created_at" => $student_reg->created_at,
            "updated_at" => $student_reg->updated_at
        );
        http_response_code(200);
    } else {
        $response["status"] = "error";
        $response["message"] = "Không thể cập nhật thông tin sinh viên tham gia môn học";
        http_response_code(503);
    }
} else {
    $response["status"] = "error";
    $response["message"] = "Dữ liệu không đầy đủ";
    http_response_code(400);
}

echo json_encode($response);
?>