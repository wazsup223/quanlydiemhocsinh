<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../../config/database.php';
include_once '../../models/students.php';

$database = new Database();
$db = $database->getConnection();

$student = new Student($db);

$data = json_decode(file_get_contents("php://input"));

$response = array(
    "status" => "success",
    "message" => "",
    "data" => array()
);


// Lấy ID từ URL 
$class_id = isset($_GET['class_id']) ? $_GET['class_id'] : '';

$response = array(
    "status" => "success",
    "message" => "",
    "data" => []
);

if (!empty($class_id)) {
    $stmt = $student->readByClass($class_id);
    $num = $stmt->rowCount();

    if ($num > 0) {
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $response["data"][] = $row; // Thêm dữ liệu vào mảng
        }

        $response["message"] = "Lấy danh sách sinh viên theo lớp thành công";
        http_response_code(200);
    } else {
        $response["status"] = "error";
        $response["message"] = "Không tìm thấy sinh viên theo lớp này";
        http_response_code(404);
    }
} else {
    $response["status"] = "error";
    $response["message"] = "Dữ liệu không đầy đủ";
    http_response_code(400);
}

echo json_encode($response);

?>