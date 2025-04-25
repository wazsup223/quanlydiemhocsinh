<?php
// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Allow from specific origin
$allowed_origin = 'https://quanlydiemhocsinhstu.netlify.app';

// Remove any existing CORS headers
header_remove('Access-Control-Allow-Origin');
header_remove('Access-Control-Allow-Credentials');
header_remove('Access-Control-Max-Age');
header_remove('Access-Control-Allow-Methods');
header_remove('Access-Control-Allow-Headers');
header_remove('Content-Type');
header_remove('Vary');

// Set CORS headers
header("Access-Control-Allow-Origin: $allowed_origin");
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Max-Age: 86400');    // cache for 1 day
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Origin, Accept');
header('Content-Type: application/json; charset=UTF-8');
header('Vary: Origin');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

// Set error handler to return JSON
set_error_handler(function($errno, $errstr, $errfile, $errline) {
    $response = array(
        "status" => "error",
        "message" => "Server error: $errstr",
        "data" => array()
    );
    http_response_code(500);
    echo json_encode($response);
    exit(1);
});

// Set exception handler to return JSON
set_exception_handler(function($exception) {
    $response = array(
        "status" => "error",
        "message" => "Server error: " . $exception->getMessage(),
        "data" => array()
    );
    http_response_code(500);
    echo json_encode($response);
    exit(1);
});
?> 