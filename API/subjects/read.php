<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once '../../config/database.php';
include_once '../../models/subjects.php';

$database = new Database();
$db = $database->getConnection();

$subject = new Subject($db);

$stmt = $subject->read();
$num = $stmt->rowCount();

$response = array(
    "status" => "success",
    "message" => "",
    "data" => array()
);

if($num > 0) {
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        extract($row);

        $subjects_item = array(
            "id" => $id,
            "name" => $name,
            "credits" => $credits,
            "process_percentage" => $process_percentage,
            "midterm_percentage" => $midterm_percentage,
            "final_percentage" => $final_percentage,
            "department_id" => $department_id,
            "created_at" => $created_at,
            "updated_at" => $updated_at
        );

        array_push($response["data"], $subjects_item);
    }

    $response["message"] = "Lấy danh sách môn học thành công";
    http_response_code(200);
} else {
    $response["status"] = "error";
    $response["message"] = "Không tìm thấy môn học nào";
    http_response_code(404);
}

echo json_encode($response);
?> 