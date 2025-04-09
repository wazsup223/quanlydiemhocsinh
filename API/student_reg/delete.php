<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: DELETE");
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

if (!empty($data->id)) {
    $student_reg->id = $data->id;

    if ($student_reg->delete()) {
        $response["message"] = "Xóa sinh viên tham gia môn học thành công";
        $response["data"] = array("id" => $student_reg->id);
        http_response_code(200);
    } else {
        $response["status"] = "error";
        $response["message"] = "Không thể xóa sinh viên tham gia môn học";
        http_response_code(503);
    }
} else {
    $response["status"] = "error";
    $response["message"] = "Dữ liệu không đầy đủ";
    http_response_code(400);
}
echo json_encode($response);

// Lấy ID từ URL (?id=GV001) hoặc từ JSON body
/*$id = isset($_GET['id']) ? $_GET['id'] : null;
$student_reg->id = $id;

// Thực hiện xóa sinh viên
if ($student_reg->delete()) {
    http_response_code(200);
    $response["status"] = "success";
    $response["message"] = "Xóa sinh viên tham gia môn học thành công";
    $response["data"] = ["id" => $student_reg->id];
} else {
    http_response_code(404);
    $response["message"] = "Không tìm thấy sinh viên để xóa";
}


echo json_encode($response);*/
?>