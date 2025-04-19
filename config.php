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
                array(PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION)
            );
            return $this->conn;
        } catch (PDOException $exception) {
            error_log("Lỗi kết nối database: " . $exception->getMessage());
            throw new Exception("Không thể kết nối đến database. Vui lòng kiểm tra lại cấu hình.");
        }
    }
}
?>