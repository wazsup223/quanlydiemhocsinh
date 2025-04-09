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
    "data" => null
);

if (!empty($data->id)) {
    $student->id = $data->id;
    $student->readOne();

    if ($student->first_name != null) {
        $response["data"] = array(
            "id" => $student->id,
            "first_name" => $student->first_name,
            "last_name" => $student->last_name,
            "email" => $student->email,
            "address" => $student->address,
            "birth_day" => $student->birth_day,
            "phone" => $student->phone,
            "gender" => $student->gender,
            "academic_year" => $student->academic_year,
            "class_id" => $student->class_id,
            "department_id" => $student->department_id
        );
        $response["message"] = "Lấy thông tin sinh viên thành công";
        http_response_code(200);
    } else {
        $response["status"] = "error";
        $response["message"] = "Không tìm thấy sinh viên";
        http_response_code(404);
    }
} else {
    $response["status"] = "error";
    $response["message"] = "Dữ liệu không đầy đủ";
    http_response_code(400);
}

echo json_encode($response);
/*
// Lấy ID từ URL (?id=GV001) hoặc từ JSON body
$id = isset($_GET['id']) ? $_GET['id'] : null;

if (!$id) {
    http_response_code(400);
    echo json_encode(["error" => "Thiếu mã sinh viên"]);
    exit;
}

// Tạo đối tượng Instructor
$student = new Student($db);
$student->id = $id;

// Lấy thông tin SINH viên
if ($student->readOne()) {
    echo json_encode([
        "id" => $student->id,
        "first_name" => $student->first_name,
        "last_name" => $student->last_name,
        "email" => $student->email,
        "address" => $student->address,
        "birth_day" => $student->birth_day,
        "phone" => $student->phone,
        "gender" => $student->gender,
        "academic_year" => $student->academic_year,
        "class_id" => $student->class_id,
        "department_id" => $student->department_id
    ]);
} else {
    http_response_code(404);
    echo json_encode(["error" => "Không tìm thấy sinh viên"]);
}
*/
?>