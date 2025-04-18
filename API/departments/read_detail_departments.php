<?php
// Cho phép truy cập từ mọi nguồn và định dạng dữ liệu trả về là JSON
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// Kết nối cơ sở dữ liệu và gọi model
include_once("../../config.php");
include_once("../../models/Instructor.php");

// Khởi tạo kết nối
$database = new Database();
$db = $database->getConnection();

// Lấy department_id từ URL
$department_id = isset($_GET['department_id']) ? $_GET['department_id'] : null;

if (!$department_id) {
    echo json_encode([
        "status" => "error",
        "message" => "Thiếu mã khoa (department_id)"
    ]);
    exit();
}

// Khởi tạo đối tượng Instructor
$instructor = new Instructor($db);

// Gọi phương thức lấy giảng viên theo khoa
$stmt = $instructor->readByDepartmentdetail($department_id);
$num = $stmt->rowCount();

if ($num > 0) {
    $instructors = [];

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        extract($row);

        $instructors[] = [
            "id" => $id,
            "first_name" => $first_name,
            "last_name" => $last_name,
            "email" => $email,
            "address" => $address,
            "birth_day" => $birth_day,
            "phone" => $phone,
            "gender" => $gender,
            "degree" => $degree,
            "department_id" => $department_id
        ];
    }

    echo json_encode([
        "status" => "success",
        "data" => $instructors
    ]);
} else {
    echo json_encode([
        "status" => "success",
        "data" => []
    ]);
}
?>