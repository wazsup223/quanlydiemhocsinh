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
include_once '../../models/users.php';

$database = new Database();
$db = $database->getConnection();

$users = new Users($db);

$stmt = $users->read();
$num = $stmt->rowCount();

$response = array(
    "status" => "success",
    "message" => "",
    "data" => array()
);

if($num > 0) {
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        extract($row);

        $users_item = array(
            "id" => $id,
            "first_name" => $first_name,
            "last_name" => $last_name,
            "username" => $username,
            "password" => $password,
            "created_at" => $created_at,
            "updated_at" => $updated_at
            
        );

        array_push($response["data"], $users_item);
    }

    $response["message"] = "Lấy danh sách người dùng thành công";
    http_response_code(200);
} else {
    $response["status"] = "error";
    $response["message"] = "Không tìm thấy người dùng nào";
    http_response_code(404);
}

echo json_encode($response);
?>