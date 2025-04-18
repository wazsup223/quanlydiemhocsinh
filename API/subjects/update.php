<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: PUT, POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Trả về 200 OK cho preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include_once '../../config.php';
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

if (
    !empty($data->id) && !empty($data->name) && !empty($data->credits) && !empty($data->semester) &&
    !empty($data->process_percentage) && !empty($data->midterm_percentage) && !empty($data->final_percentage) &&
    !empty($data->department_id) && isset($data->created_at) && !empty($data->updated_at)
) {

    $subject->id = $data->id;
    $subject->name = $data->name;
    $subject->credits = $data->credits;
    $subject->semester = $data->semester;
    $subject->process_percentage = $data->process_percentage;
    $subject->midterm_percentage = $data->midterm_percentage;
    $subject->final_percentage = $data->final_percentage;
    $subject->department_id = $data->department_id;
    $subject->created_at = $data->created_at;
    $subject->updated_at = $data->updated_at;


    if ($subject->update()) {
        $response["message"] = "Cập nhật thông tin giảng viên thành công";
        $response["data"] = array(
            "id" => $subject->id,
            "name" => $subject->name,
            "credits" => $subject->credits,
            "process_percentage" => $subject->process_percentage,
            "midterm_percentage" => $subject->midterm_percentage,
            "final_percentage" => $subject->final_percentage,
            "department_id" => $subject->department_id,
            "created_at" => $subject->created_at,
            "updated_at" => $subject->updated_at,

        );
        http_response_code(200);
    } else {
        $response["status"] = "error";
        $response["message"] = "Không thể cập nhật thông tin môn học";
        http_response_code(503);
    }
} else {
    $response["status"] = "error";
    $response["message"] = "Dữ liệu không đầy đủ";
    http_response_code(400);
}

echo json_encode($response);
?>