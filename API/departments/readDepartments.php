<?php
// Include files
require_once '../../cors.php';
require_once '../../config.php';
require_once '../../models/Department.php';

try {
    $database = new Database();
    $db = $database->getConnection();

    $department = new Department($db);
    $stmt = $department->read();
    $num = $stmt->rowCount();

    $response = array(
        "status" => "success",
        "message" => "",
        "data" => array()
    );

    if ($num > 0) {
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            extract($row);

            $department_item = array(
                "id" => $id,
                "name" => $name,
                "description" => $description,
                "created_at" => $created_at,
                "updated_at" => $updated_at
            );

            array_push($response["data"], $department_item);
        }

        $response["message"] = "Lấy danh sách khoa thành công";
        http_response_code(200);
    } else {
        $response["status"] = "error";
        $response["message"] = "Không tìm thấy khoa nào";
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