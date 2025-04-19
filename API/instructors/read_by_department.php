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
include_once '../../models/Instructor.php';

$database = new Database();
$db = $database->getConnection();

$instructor = new Instructor($db);

$data = json_decode(file_get_contents("php://input"));

$response = array(
    "status" => "success",
    "message" => "",
    "data" => array()
);

if (!empty($data->department_id)) {
    $stmt = $instructor->readByDepartment($data->department_id);
    $num = $stmt->rowCount();

    if ($num > 0) {
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            extract($row);

            $instructor_item = array(
                "id" => $id,
                "first_name" => $first_name,
                "last_name" => $last_name,
                "email" => $email,
                "address" => $address,
                "birth_day" => $birth_day,
                "phone" => $phone,
                "gender" => $gender,
                "degree" => $degree,
                "department_id" => $department_id,
                "department_name" => $department_name,
                "created_at" => $created_at,
                "updated_at" => $updated_at
            );

            array_push($response["data"], $instructor_item);
        }

        $response["message"] = "Lấy danh sách giảng viên theo khoa thành công";
        http_response_code(200);
    } else {
        $response["status"] = "error";
        $response["message"] = "Không tìm thấy giảng viên nào trong khoa này";
        http_response_code(404);
    }
} else {
    $response["status"] = "error";
    $response["message"] = "Dữ liệu không đầy đủ";
    http_response_code(400);
}

echo json_encode($response);
?>