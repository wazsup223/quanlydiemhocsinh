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
include_once '../../models/student_reg.php';

$database = new Database();
$db = $database->getConnection();

$student_reg = new Student_reg($db);

$stmt = $student_reg->read();
$num = $stmt->rowCount();

$response = array(
    "status" => "success",
    "message" => "",
    "data" => array()
);

if ($num > 0) {
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        extract($row);

        $student_item = array(
            "id" => $id,
            "subject_id" => $subject_id,
            "student_id" => $student_id,
            "full_name" => $full_name,
            "credits" => $credits,
            "semester" => $semester,
            "academic_year" => $academic_year,
            "subject_name" => $subject_name,
            "created_at" => $created_at,
            "updated_at" => $updated_at,


        );

        array_push($response["data"], $student_item);
    }

    $response["message"] = "Lấy danh sách sinh viên tham gia môn học thành công";
    http_response_code(200);
} else {
    $response["status"] = "error";
    $response["message"] = "Không tìm thấy sinh viên tham gia môn học nào";
    http_response_code(404);
}

echo json_encode($response);
?>