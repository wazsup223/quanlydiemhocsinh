<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../../config.php';
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
$academic_year = isset($_GET['academic_year']) ? $_GET['academic_year'] : '';

$response = array(
    "status" => "success",
    "message" => "",
    "data" => []
);

if (!empty($academic_year)) {
    $stmt = $student->readByAcademicYear($academic_year);
    $num = $stmt->rowCount();
    if ($num > 0) {
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            extract($row);

            $student_item = array(
                "id" => $id,
                "first_name" => $first_name,
                "last_name" => $last_name,
                "email" => $email,
                "address" => $address,
                "birth_day" => $birth_day,
                "phone" => $phone,
                "gender" => $gender,
                "academic_year" => $academic_year,
                "class_name" => $class_name,          // <-- từ bảng c
                "department_name" => $department_name // <-- từ bảng d





            );

            array_push($response["data"], $student_item);
        }

        /*if ($num > 0) {
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                $response["data"][] = $row; // Thêm dữ liệu vào mảng lấy hết tất cả các dữ liệu
            }*/

        $response["message"] = "Lấy danh sách sinh viên theo năm học thành công";
        http_response_code(200);
    } else {
        $response["status"] = "error";
        $response["message"] = "Không tìm thấy sinh viên theo năm học này";
        http_response_code(404);
    }
} else {
    $response["status"] = "error";
    $response["message"] = "Dữ liệu không đầy đủ";
    http_response_code(400);
}

echo json_encode($response);

?>