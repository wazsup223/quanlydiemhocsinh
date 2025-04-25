<?php
include_once '../../cors.php';
include_once '../../config.php';
include_once '../../models/Student.php';

$database = new Database();
$db = $database->getConnection();

$student = new Student($db);

$stmt = $student->read();
$num = $stmt->rowCount();

$response = array(
    "status" => "success",
    "message" => "",
    "data" => array()
);

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
            "class_id" => $class_id,
            "class_name" => $class_name,
            "department_name" => $department_name,
            "department_id" => $department_id,
            "created_at" => $created_at,
            "updated_at" => $updated_at
        );

        array_push($response["data"], $student_item);
    }

    $response["message"] = "Lấy danh sách sinh viên thành công";
    http_response_code(200);
} else {
    $response["status"] = "error";
    $response["message"] = "Không tìm thấy sinh viên nào";
    http_response_code(404);
}

echo json_encode($response);
?>