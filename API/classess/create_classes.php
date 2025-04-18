<?php
// Cho phép truy cập từ các domain khác (phục vụ CORS)
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: *");

// Xử lý request OPTIONS (tiền xử lý của trình duyệt)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Include kết nối DB và model
include_once '../../config.php';
include_once '../../models/classes.php';

// Kết nối DB
$database = new Database();
$db = $database->getConnection();

$classes = new Classes($db);

// Nhận và decode dữ liệu JSON
$data = json_decode(file_get_contents("php://input"));

$response = [
    "status" => "success",
    "message" => "",
    "data" => null
];

// Kiểm tra dữ liệu đầu vào (id có thể để null nếu AUTO_INCREMENT)
if (
    !empty($data->name) &&
    !empty($data->max_students) &&
    !empty($data->department_id) &&
    !empty($data->host_instructor_id) &&
    !empty($data->created_at) &&
    !empty($data->updated_at)
) {
    $classes->id = isset($data->id) ? $data->id : null;
    $classes->name = $data->name;
    $classes->max_students = $data->max_students;
    $classes->department_id = $data->department_id;
    $classes->host_instructor_id = $data->host_instructor_id;
    $classes->created_at = $data->created_at;
    $classes->updated_at = $data->updated_at;

    if ($classes->create()) {
        $response["message"] = "Thêm lớp học thành công";
        $response["data"] = [
            "id" => $classes->id,
            "name" => $classes->name,
            "max_students" => $classes->max_students,
            "department_id" => $classes->department_id,
            "host_instructor_id" => $classes->host_instructor_id,
            "created_at" => $classes->created_at,
            "updated_at" => $classes->updated_at
        ];
        http_response_code(201);
    } else {
        $response["status"] = "error";
        $response["message"] = "Không thể thêm lớp học";
        http_response_code(503);
    }
} else {
    $response["status"] = "error";
    $response["message"] = "Dữ liệu không đầy đủ";
    http_response_code(400);
}

echo json_encode($response);
?>