<?php
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
?> 