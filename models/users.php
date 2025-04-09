<?php
class Users
{
    private $conn;
    private $table_name = "users";
    public $id;
    public $first_name;
    public $last_name;
    public $username;
    public $password;
    public $created_at;
    public $updated_at;
    public $delete_at;
    public function __construct($db)
    {
        $this->conn = $db;
    }
    // Lấy tất cả môn học
    public function read()
    {

        $query = "SELECT u.*
              FROM " . $this->table_name . " u
              ORDER BY u.id
             ";

        $stmt = $this->conn->prepare($query);

        $stmt->execute();

        return $stmt;
    }
    public function create()
    {
        $query = "INSERT INTO " . $this->table_name . "
                SET
                    id = :id,
                    first_name = :first_name,
                    last_name = :last_name,
                    username = :username,
                    password = :password,
                    created_at = :created_at,
                    updated_at = :updated_at
                    "
                    ;

        $stmt = $this->conn->prepare($query);

        // Làm sạch dữ liệu
        $this->id = htmlspecialchars(strip_tags($this->id));
        $this->first_name = htmlspecialchars(strip_tags($this->first_name));
        $this->last_name = htmlspecialchars(strip_tags($this->last_name));
        $this->username = htmlspecialchars(strip_tags($this->username));
        $this->password = htmlspecialchars(strip_tags($this->password));
        $this->created_at = htmlspecialchars(strip_tags($this->created_at));
        $this->updated_at = htmlspecialchars(strip_tags($this->updated_at));
        //$this->deleted_at = htmlspecialchars(strip_tags($this->deleted_at));
        

        // Bind các giá trị
        $stmt->bindParam(":id", $this->id);
        $stmt->bindParam(":first_name", $this->first_name);
        $stmt->bindParam(":last_name", $this->last_name);
        $stmt->bindParam(":username", $this->username);
        $stmt->bindParam(":password", $this->password);
        $stmt->bindParam(":created_at", $this->created_at);
        $stmt->bindParam(":updated_at", $this->updated_at);
        //$stmt->bindParam(":deleted_at", $this->deleted_at);

        if ($stmt->execute()) {
            return true;
        }
        return false;
    }
    public function update()
    {
        $query = "UPDATE " . $this->table_name . "
                SET
                    first_name = :first_name,
                    last_name = :last_name,
                    username = :username,
                    password = :password,
                    created_at = :created_at,
                    updated_at = :updated_at
                    
                    
                WHERE id = :id";

        $stmt = $this->conn->prepare($query);

        // Làm sạch dữ liệu
        $this->id = htmlspecialchars(strip_tags($this->id));
        $this->first_name = htmlspecialchars(strip_tags($this->first_name));
        $this->last_name = htmlspecialchars(strip_tags($this->last_name));
        $this->username = htmlspecialchars(strip_tags($this->username));
        $this->password = htmlspecialchars(strip_tags($this->password));
        $this->created_at = htmlspecialchars(strip_tags($this->created_at));
        $this->updated_at = htmlspecialchars(strip_tags($this->updated_at));
        //$this->deleted_at = htmlspecialchars(strip_tags($this->deleted_at));

        // Bind các giá trị
        $stmt->bindParam(":id", $this->id);
        $stmt->bindParam(":first_name", $this->first_name);
        $stmt->bindParam(":last_name", $this->last_name);
        $stmt->bindParam(":username", $this->username);
        $stmt->bindParam(":password", $this->password);
        $stmt->bindParam(":created_at", $this->created_at);
        $stmt->bindParam(":updated_at", $this->updated_at);
        

        if ($stmt->execute()) {
            return true;
        }
        return false;
    }
    public function delete()
    {
        $query = "DELETE FROM users WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id", $this->id, PDO::PARAM_STR);

        if ($stmt->execute()) {
            return $stmt->rowCount() > 0; // Kiểm tra có xóa được không
        }
        return false;
    }

}
?>