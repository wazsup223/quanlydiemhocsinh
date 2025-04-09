<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once '../../config/database.php';
include_once '../../models/Instructor.php';

$database = new Database();
$db = $database->getConnection();

$instructor = new Instructor($db);

$stmt = $instructor->read();
$num = $stmt->rowCount();

$response = array(
    "status" => "success",
    "message" => "",
    "data" => array()
);

if($num > 0) {
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

    $response["message"] = "Lấy danh sách giảng viên thành công";
    http_response_code(200);
} else {
    $response["status"] = "error";
    $response["message"] = "Không tìm thấy giảng viên nào";
    http_response_code(404);
}

echo json_encode($response);
?> 