<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: *");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include_once '../../config.php';

$database = new Database();
$db = $database->getConnection();

$response = array(
    "status" => "success",
    "message" => "",
    "data" => []
);

try {
    $query = "
        SELECT sr.student_id, sr.subject_id,
               s.first_name, s.last_name,
               sub.name AS subject_name
        FROM student_registrations sr
        JOIN students s ON sr.student_id = s.id
        JOIN subjects sub ON sr.subject_id = sub.id
        LEFT JOIN grades g ON sr.student_id = g.student_id AND sr.subject_id = g.subject_id
        WHERE g.id IS NULL
    ";

    $stmt = $db->prepare($query);
    $stmt->execute();

    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
    $response["data"] = $result;
    http_response_code(200);
} catch (Exception $e) {
    $response["status"] = "error";
    $response["message"] = "Lỗi truy vấn: " . $e->getMessage();
    http_response_code(500);
}

echo json_encode($response);
?>