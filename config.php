<?php
// Bật error reporting để dễ debug
error_reporting(E_ALL);
ini_set('display_errors', 1);

class Database
{
    private $host = "localhost";
    private $db_name = "quanlydiemhs2";
    private $username = "root";
    private $password = "";
    public $conn;

    public function getConnection()
    {
        $this->conn = null;

        try {
            $this->conn = new PDO(
                "mysql:host=" . $this->host . ";dbname=" . $this->db_name,
                $this->username,
                $this->password,
                array(PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION)
            );
            $this->conn->exec("set names utf8");
            return $this->conn;
        } catch (PDOException $exception) {
            error_log("Lỗi kết nối database: " . $exception->getMessage());
            throw new Exception("Không thể kết nối đến database. Vui lòng kiểm tra lại cấu hình.");
        }
    }
}
?>