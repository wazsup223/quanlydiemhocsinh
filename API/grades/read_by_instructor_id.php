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

// Lấy ID giảng viên từ URL
$instructor_id = isset($_GET['instructor_id']) ? $_GET['instructor_id'] : '';

$response = array(
    "status" => "success",
    "message" => "",
    "data" => array()
);

if (!empty($instructor_id)) {
    $stmt = $grade->readByInstructor($instructor_id);
    $num = $stmt->rowCount();

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

        $response["message"] = "Lấy danh sách điểm theo giảng viên thành công";
        http_response_code(200);
    } else {
        $response["status"] = "error";
        $response["message"] = "Không tìm thấy điểm nào của giảng viên này";
        http_response_code(404);
    }
} else {
    $response["status"] = "error";
    $response["message"] = "Dữ liệu không đầy đủ";
    http_response_code(400);
}

echo json_encode($response);
?>