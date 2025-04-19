<?php
// Các header cần thiết
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: *");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include_once '../../config.php';
include_once '../../models/InstructorAssignment.php';

// Lấy kết nối cơ sở dữ liệu
$database = new Database();
$db = $database->getConnection();

// Khởi tạo đối tượng phân công giảng dạy
$instructor_assignment = new InstructorAssignment($db);

// Lấy dữ liệu đã gửi
$data = json_decode(file_get_contents("php://input"));

// Kiểm tra dữ liệu không được trống
if (!empty($data->subject_id)) {
    // Truy vấn phân công giảng dạy
    $stmt = $instructor_assignment->readBySubject($data->subject_id);
    $num = $stmt->rowCount();

    // Kiểm tra nếu tìm thấy nhiều hơn 0 bản ghi
    if ($num > 0) {
        // Mảng phân công giảng dạy
        $instructor_assignments_arr = array();
        $instructor_assignments_arr["records"] = array();

        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            extract($row);

            $instructor_assignment_item = array(
                "subject_id" => $subject_id,
                "subject_name" => $subject_name,
                "instructor_id" => $instructor_id,
                "instructor_name" => $instructor_first_name . " " . $instructor_last_name,
                "created_at" => $created_at,
                "updated_at" => $updated_at
            );

            array_push($instructor_assignments_arr["records"], $instructor_assignment_item);
        }

        // Đặt mã phản hồi - 200 OK
        http_response_code(200);

        // Thông báo cho người dùng
        echo json_encode(array(
            "status" => "success",
            "message" => "Đã tìm thấy " . $num . " giảng viên được phân công cho môn học này",
            "data" => $instructor_assignments_arr
        ));
    } else {
        // Đặt mã phản hồi - 404 Không tìm thấy
        http_response_code(404);

        // Thông báo cho người dùng không tìm thấy phân công giảng dạy
        echo json_encode(array(
            "status" => "error",
            "message" => "Không tìm thấy giảng viên nào được phân công cho môn học này"
        ));
    }
} else {
    // Đặt mã phản hồi - 400 Yêu cầu không hợp lệ
    http_response_code(400);

    // Thông báo cho người dùng
    echo json_encode(array(
        "status" => "error",
        "message" => "Vui lòng cung cấp ID môn học"
    ));
}
?>