<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once '../../config.php';
include_once '../../models/grades.php';

$database = new Database();
$db = $database->getConnection();

$grade = new Grade($db);

$stmt = $grade->read();
$num = $stmt->rowCount();

$response = array(
    "status" => "success",
    "message" => "",
    "data" => array()
);

if ($num > 0) {
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        extract($row);

        $grade_item = array(
            "id" => $id,
            "process_score" => $process_score,
            "midterm_score" => $midterm_score,
            "final_score" => $final_score,
            "subject_id" => $subject_id,
            "student_id" => $student_id,
            "by_instructor_id" => $by_instructor_id,
            "student_name" => $student_first_name . ' ' . $student_last_name,
            "subject_name" => $subject_name,
            "instructor_name" => $instructor_first_name . ' ' . $instructor_last_name,
            "created_at" => $created_at,
            "updated_at" => $updated_at
        );

        array_push($response["data"], $grade_item);
    }

    $response["message"] = "Lấy danh sách điểm thành công";
    http_response_code(200);
} else {
    $response["status"] = "error";
    $response["message"] = "Không tìm thấy điểm nào";
    http_response_code(404);
}

echo json_encode($response);
?>