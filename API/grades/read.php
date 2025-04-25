<?php
include_once '../../cors.php';
include_once '../../config.php';
include_once '../../models/Grade.php';

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
            "student_id" => $student_id,
            "student_name" => $student_name,
            "subject_id" => $subject_id,
            "subject_name" => $subject_name,
            "process_score" => $process_score,
            "midterm_score" => $midterm_score,
            "final_score" => $final_score,
            "total_score" => $total_score,
            "letter_grade" => $letter_grade,
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