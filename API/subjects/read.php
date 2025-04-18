<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
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

$stmt = $subject->read();
$num = $stmt->rowCount();

$response = array(
    "status" => "success",
    "message" => "",
    "data" => array()
);

if ($num > 0) {
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        extract($row);

        $subjects_item = array(
            "id" => $id,
            "name" => $name,
            "credits" => $credits,
            "semester" => $semester,
            "process_percentage" => $process_percentage,
            "midterm_percentage" => $midterm_percentage,
            "final_percentage" => $final_percentage,
            "department_id" => $department_id,
            "department_name" => $department_name,
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