<?php
// Bật error reporting để dễ debug
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Load environment variables
$envFile = __DIR__ . '/.env';
if (file_exists($envFile)) {
    $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos($line, '=') !== false && strpos($line, '#') !== 0) {
            list($key, $value) = explode('=', $line, 2);
            $_ENV[trim($key)] = trim($value);
        }
    }
}

// CORS configuration
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

class Database
{
    private $host;
    private $db_name;
    private $username;
    private $password;
    public $conn;

    public function __construct()
    {
        // Sử dụng biến môi trường hoặc giá trị mặc định
        $this->host = $_ENV['DB_HOST'] ?? 'dpg-d01kejje5dus73b9pkig-a.singapore-postgres.render.com';
        $this->db_name = $_ENV['DB_NAME'] ?? 'diemsv_nicy';
        $this->username = $_ENV['DB_USER'] ?? 'minh';
        $this->password = $_ENV['DB_PASS'] ?? 'DyokP4cDfu56PXmA9oARSCSkCPnExvFc';
    }

    public function getConnection()
    {
        $this->conn = null;

        try {
            $dsn = "pgsql:host=" . $this->host . ";port=5432;dbname=" . $this->db_name;
            $this->conn = new PDO(
                $dsn,
                $this->username,
                $this->password,
                array(
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_EMULATE_PREPARES => false,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
                )
            );
            return $this->conn;
        } catch (PDOException $exception) {
            error_log("Lỗi kết nối database: " . $exception->getMessage());
            throw new Exception("Không thể kết nối đến database. Vui lòng kiểm tra lại cấu hình.");
        }
    }
}

// Database configuration
define('DB_HOST', 'dpg-cp4k0p8l6cac73b0q0tg-a.oregon-postgres.render.com');
define('DB_NAME', 'diemsv_3h0d');
define('DB_USER', 'diemsv_3h0d_user');
define('DB_PASS', '8QJ4QJ4QJ4QJ4QJ4QJ4QJ4QJ4QJ4QJ4');

// API configuration
define('API_BASE_URL', 'https://quanlydiembe.onrender.com/API');
?>