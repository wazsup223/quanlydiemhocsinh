<?php
class departments
{
    private $conn;
    private $table_name = "departments";
    public $id;
    public $symbol;
    public $name;
    public $created_at;
    public $updated_at;
    public function __construct($db)
    {
        $this->conn = $db;
    }
    // Lấy tất cả khoa
    public function read()
    {

        $query = "SELECT d.*, COUNT(c.id) AS total_classes
          FROM departments d
          LEFT JOIN classes c ON d.id = c.department_id
          GROUP BY d.id
          ORDER BY d.id";

        $stmt = $this->conn->prepare($query);

        $stmt->execute();
        return $stmt;
    }
    // Lấy khoa theo mã
    public function readOne()
    {
        $sql = "SELECT * FROM departments WHERE id = :id";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(":id", $this->id, PDO::PARAM_INT);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);


        if ($row) {
            $this->symbol = $row['symbol'];
            $this->name = $row['name'];
            $this->created_at = $row['created_at'];
            $this->updated_at = $row['updated_at'];
            return true;
        }
        return false;
    }
    // Thêm khoa
    public function create()
    {
        $query = "INSERT INTO " . $this->table_name . "
                SET
                    id = :id,
                    symbol = :symbol,
                    name = :name,
                    created_at= :created_at,
                    updated_at= :updated_at";


        $stmt = $this->conn->prepare($query);

        // Làm sạch dữ liệu
        $this->id = htmlspecialchars(strip_tags($this->id));
        $this->symbol = htmlspecialchars(strip_tags($this->symbol));
        $this->name = htmlspecialchars(strip_tags($this->name));
        $this->created_at = htmlspecialchars(strip_tags($this->created_at));
        $this->updated_at = htmlspecialchars(strip_tags($this->updated_at));

        // Bind các giá trị
        $stmt->bindParam(":id", $this->id);
        $stmt->bindParam(":symbol", $this->symbol);
        $stmt->bindParam(":name", $this->name);
        $stmt->bindParam(":created_at", $this->created_at);
        $stmt->bindParam(":updated_at", $this->updated_at);
        if ($stmt->execute()) {
            return true;
        }
        return false;
    }

    //update
    public function update()
    {
        $query = "UPDATE " . $this->table_name . "
                SET
                    id = :id,
                    symbol = :symbol,
                    name = :name,
                    created_at= :created_at,
                    updated_at= :updated_at
                WHERE id = :id";

        $stmt = $this->conn->prepare($query);

        // Làm sạch dữ liệu
        $this->id = htmlspecialchars(strip_tags($this->id));
        $this->symbol = htmlspecialchars(strip_tags($this->symbol));
        $this->name = htmlspecialchars(strip_tags($this->name));
        $this->created_at = htmlspecialchars(strip_tags($this->created_at));
        $this->updated_at = htmlspecialchars(strip_tags($this->updated_at));

        // Bind các giá trị
        $stmt->bindParam(":id", $this->id);
        $stmt->bindParam(":symbol", $this->symbol);
        $stmt->bindParam(":name", $this->name);
        $stmt->bindParam(":created_at", $this->created_at);
        $stmt->bindParam(":updated_at", $this->updated_at);

        if ($stmt->execute()) {
            return true;
        }
        return false;
    }
    // Xóa khoa

    public function delete()
    {
        $query = "DELETE FROM departments WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id", $this->id, PDO::PARAM_STR);

        if ($stmt->execute()) {
            return $stmt->rowCount() > 0; // Kiểm tra có xóa được không
        }
        return false;
    }

}
?>