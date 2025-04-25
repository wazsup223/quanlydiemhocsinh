<?php
// Allow from specific origin
$allowed_origin = 'https://quanlydiemhocsinhstu.netlify.app';

// Set CORS headers
header("Access-Control-Allow-Origin: $allowed_origin");
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Max-Age: 86400');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Origin, Accept');
header('Content-Type: application/json; charset=UTF-8');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

// Include the requested file
$request_uri = $_SERVER['REQUEST_URI'];
$api_path = '/API/';
$file_path = substr($request_uri, strpos($request_uri, $api_path) + strlen($api_path));

if (file_exists($file_path)) {
    include $file_path;
} else {
    http_response_code(404);
    echo json_encode([
        'status' => 'error',
        'message' => 'API endpoint not found'
    ]);
}
?> 