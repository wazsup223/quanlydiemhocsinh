<?
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");



// Nếu là preflight OPTIONS request, trả về 200 OK luôn
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
include_once '../../config.php';
include_once '../../models/students.php';

$database = new Database();
$db = $database->getConnection();

$student = new Student($db);

$data = json_decode(file_get_contents("php://input"));

$response = array(
    "status" => "success",
    "message" => "",
    "data" => null
);

if (!empty($data->id)) {
    $student->id = $data->id;

    if ($student->delete()) {
        $response["message"] = "Xóa sinh viên thành công";
        $response["data"] = array("id" => $student->id);
        http_response_code(200);
    } else {
        $response["status"] = "error";
        $response["message"] = "Không thể xóa sinh viên";
        http_response_code(503);
    }
} else {
    $response["status"] = "error";
    $response["message"] = "Dữ liệu không đầy đủ";
    http_response_code(400);
}
echo json_encode($response);

// Lấy ID từ URL (?id=GV001) hoặc từ JSON body
/*$id = isset($_GET['id']) ? $_GET['id'] : null;
$student->id = $id;

// Thực hiện xóa sinh viên
if ($student->delete()) {
    http_response_code(200);
    $response["status"] = "success";
    $response["message"] = "Xóa sinh viên thành công";
    $response["data"] = ["id" => $student->id];
} else {
    http_response_code(404);
    $response["message"] = "Không tìm thấy sinh viên để xóa";
}


echo json_encode($response);*/
?>