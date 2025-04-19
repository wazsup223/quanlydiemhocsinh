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

if (
    !empty($data->process_score) && !empty($data->midterm_score) && !empty($data->final_score) &&
    !empty($data->subject_id) && !empty($data->student_id) && !empty($data->by_instructor_id)
) {

    $grade->process_score = $data->process_score;
    $grade->midterm_score = $data->midterm_score;
    $grade->final_score = $data->final_score;
    $grade->subject_id = $data->subject_id;
    $grade->student_id = $data->student_id;
    $grade->by_instructor_id = $data->by_instructor_id;

    if ($grade->create()) {
        $response["message"] = "Thêm điểm thành công";
        $response["data"] = array(
            "process_score" => $grade->process_score,
            "midterm_score" => $grade->midterm_score,
            "final_score" => $grade->final_score,
            "subject_id" => $grade->subject_id,
            "student_id" => $grade->student_id,
            "by_instructor_id" => $grade->by_instructor_id,
            "created_at" => date("Y-m-d H:i:s")
        );
        http_response_code(201);
    } else {
        $response["status"] = "error";
        $response["message"] = "Không thể thêm điểm";
        http_response_code(503);
    }
} else {
    $response["status"] = "error";
    $response["message"] = "Dữ liệu không đầy đủ";
    http_response_code(400);
}

echo json_encode($response);
?>