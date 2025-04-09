<? header("Access-Control-Allow-Origin: *"); // Cho phép mọi domain truy cập
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Nếu là preflight OPTIONS request, trả về 200 OK luôn
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Kết nối database và xử lý xóa học sinh
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
        $response["message"] = "Không thể xóa sinh viên, có thể do lỗi trong cơ sở dữ liệu.";
        http_response_code(503); // Lỗi server khi không thể xóa
    }
} else {
    $response["status"] = "error";
    $response["message"] = "Dữ liệu không đầy đủ, ID học sinh không được cung cấp.";
    http_response_code(400); // Lỗi khi thiếu ID
}

echo json_encode($response);
?>