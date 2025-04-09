<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: PUT");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../../config/database.php';
include_once '../../models/users.php';

$database = new Database();
$db = $database->getConnection();

$users = new Users($db);

$data = json_decode(file_get_contents("php://input"));

$response = array(
    "status" => "success",
    "message" => "",
    "data" => null
);

if(!empty($data->id) && !empty($data->first_name) && !empty($data->last_name) && 
   !empty($data->username) && !empty($data->password) && isset($data->created_at) && !empty($data->updated_at) 
   ) {
    
    $users->id = $data->id;
    $users->first_name = $data->first_name;
    $users->last_name = $data->last_name;
    $users->username = $data->username;
    $users->password = $data->password;
    $users->created_at = $data->created_at;
    $users->updated_at = $data->updated_at;
    
    

    if($users->update()) {
        $response["message"] = "Cập nhật thông tin người dùng thành công";
        $response["data"] = array(
            "id" => $users->id,
            "first_name" => $users->first_name,
            "last_name" => $users->last_name,
            "username" => $users->username,
            "password" => $users->password,
            "created_at" => $users->created_at,
            "updated_at" => $users->updated_at
            
           
        );
        http_response_code(200);
    } else {
        $response["status"] = "error";
        $response["message"] = "Không thể cập nhật thông tin người dùng";
        http_response_code(503);
    }
} else {
    $response["status"] = "error";
    $response["message"] = "Dữ liệu không đầy đủ";
    http_response_code(400);
}

echo json_encode($response);
?> 