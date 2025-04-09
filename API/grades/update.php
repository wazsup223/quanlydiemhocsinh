<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: PUT");
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

if (!empty($data->id) && isset($data->process_score) && isset($data->midterm_score) &&
    isset($data->final_score) && !empty($data->subject_id) && !empty($data->student_id) &&
    !empty($data->by_instructor_id)) {
    
    $grade->id = $data->id;
    $grade->process_score = $data->process_score;
    $grade->midterm_score = $data->midterm_score;
    $grade->final_score = $data->final_score;
    $grade->subject_id = $data->subject_id;
    $grade->student_id = $data->student_id;
    $grade->by_instructor_id = $data->by_instructor_id;

    if ($grade->update()) {
        $response["message"] = "Cập nhật điểm thành công";
        $response["data"] = array(
            "id" => $grade->id,
            "process_score" => $grade->process_score,
            "midterm_score" => $grade->midterm_score,
            "final_score" => $grade->final_score,
            "subject_id" => $grade->subject_id,
            "student_id" => $grade->student_id,
            "by_instructor_id" => $grade->by_instructor_id
        );
        http_response_code(200);
    } else {
        $response["status"] = "error";
        $response["message"] = "Không thể cập nhật điểm";
        http_response_code(503);
    }
} else {
    $response["status"] = "error";
    $response["message"] = "Dữ liệu không đầy đủ";
    http_response_code(400);
}

echo json_encode($response);
?>
