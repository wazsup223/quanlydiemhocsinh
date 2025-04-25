<?php
// Include files
require_once '../../cors.php';
require_once '../../config.php';
require_once '../../models/Instructor.php';

try {
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

    if ($num > 0) {
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            extract($row);

            // Tách chuỗi subjects thành mảng nếu có
            $subjects_array = isset($subjects) && !empty($subjects)
                ? explode(',', $subjects)
                : [];

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
                "instructor_name" => $first_name . ' ' . $last_name,
                "subjects" => $subjects_array,
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
} catch (Exception $e) {
    $response = array(
        "status" => "error",
        "message" => "Lỗi server: " . $e->getMessage(),
        "data" => array()
    );
    http_response_code(500);
    echo json_encode($response);
}
?>