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

$data = json_decode(file_get_contents("php://input"));

$response = array(
    "status" => "success",
    "message" => "",
    "data" => array()
);

if (!empty($data->student_id)) {
    $stmt = $student_reg->readByStudent($data->student_id);
    $num = $stmt->rowCount();

    if ($num > 0) {
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            extract($row);

            $student_reg_item = array(
                "id" => $id,
                "subject_id" => $subject_id,
                "student_id" => $student_id,
                "created_at" => $created_at,
                "updated_at" => $updated_at
            );

            array_push($response["data"], $student_reg_item);
        }

        $response["message"] = "Lấy danh sách sinh viên tham gia môn học theo mã sv thành công";
        http_response_code(200);
    } else {
        $response["status"] = "error";
        $response["message"] = "Không tìm thấy sinh viên tham gia môn học theo mã sv";
        http_response_code(404);
    }
} else {
    $response["status"] = "error";
    $response["message"] = "Dữ liệu không đầy đủ";
    http_response_code(400);
}

echo json_encode($response);
?>