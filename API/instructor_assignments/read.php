<?php
// Các header cần thiết
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// Bao gồm các file cơ sở dữ liệu và đối tượng
include_once '../../config/database.php';
include_once '../../models/InstructorAssignment.php';

// Khởi tạo cơ sở dữ liệu và đối tượng phân công giảng dạy
$database = new Database();
$db = $database->getConnection();

$instructor_assignment = new InstructorAssignment($db);

// Truy vấn phân công giảng dạy
$stmt = $instructor_assignment->read();
$num = $stmt->rowCount();

// Kiểm tra nếu tìm thấy nhiều hơn 0 bản ghi
if($num > 0) {
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
        "message" => "Found " . $num . " instructor assignments.",
        "data" => $instructor_assignments_arr
    ));
} else {
    // Đặt mã phản hồi - 404 Không tìm thấy
    http_response_code(404);

    // Thông báo cho người dùng không tìm thấy phân công giảng dạy
    echo json_encode(array(
        "status" => "error",
        "message" => "No instructor assignments found."
    ));
}
?> 