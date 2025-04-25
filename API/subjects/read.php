<?php
// Include files
require_once '../../cors.php';
require_once '../../config.php';
require_once '../../models/Subject.php';

try {
    $database = new Database();
    $db = $database->getConnection();

    $subject = new Subject($db);
    $stmt = $subject->read();
    $num = $stmt->rowCount();

    $response = array(
        "status" => "success",
        "message" => "",
        "data" => array()
    );

    if ($num > 0) {
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            extract($row);

            $subject_item = array(
                "id" => $id,
                "name" => $name,
                "code" => $code,
                "credits" => $credits,
                "department_id" => $department_id,
                "department_name" => $department_name,
                "created_at" => $created_at,
                "updated_at" => $updated_at
            );

            array_push($response["data"], $subject_item);
        }

        $response["message"] = "Lấy danh sách môn học thành công";
        http_response_code(200);
    } else {
        $response["status"] = "error";
        $response["message"] = "Không tìm thấy môn học nào";
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