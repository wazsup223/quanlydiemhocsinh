<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once '../../config/database.php';
include_once '../../models/departments.php';

$database = new Database();
$db = $database->getConnection();

$departments = new Departments($db);

$stmt = $departments->read();
$num = $stmt->rowCount();

$response = array(
    "status" => "success",
    "message" => "",
    "data" => array()
);

if ($num > 0) {
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        extract($row);

        $departments_item = array(
            "id" => $id,
            "symbol" => $symbol,
            "name" => $name,
            "created_at" => $created_at,
            "updated_at" => $updated_at
        );

        array_push($response["data"], $departments_item);
    }

    $response["message"] = "Lấy danh sách khoa thành công";
    http_response_code(200);
} else {
    $response["status"] = "error";
    $response["message"] = "Không tìm thấy khoa nào";
    http_response_code(404);
}

echo json_encode($response);
?>