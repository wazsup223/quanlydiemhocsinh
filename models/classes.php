<?php
class classes
{
    private $conn;
    private $table_name = "classes";
    public $id;
    public $name;
    public $max_students;
    public $department_id;
    public $host_instructor_id;
    public $created_at;
    public $updated_at;
    public function __construct($db)
    {
        $this->conn = $db;
    }
    // Lấy tất cả lớp học
    public function read()
    {

        $query = "SELECT s.*
        FROM " . $this->table_name . " s
        LEFT JOIN departments d ON s.department_id = d.id
        ORDER BY s.id";
        $stmt = $this->conn->prepare($query);

        $stmt->execute();
        return $stmt;
    }
    // Lấy lớp học theo mã
    public function readOne()
    {
        $sql = "SELECT * FROM classes WHERE id = :id";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(":id", $this->id, PDO::PARAM_INT);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);


        if ($row) {
            $this->name = $row['name'];
            $this->max_students = $row['max_students'];
            $this->department_id = $row['department_id'];
            $this->host_instructor_id = $row['host_instructor_id'];
            $this->created_at = $row['created_at'];
            $this->updated_at = $row['updated_at'];
            return true;
        }
        return false;
    }
    // Thêm lớp học
    public function create()
    {
        $query = "INSERT INTO " . $this->table_name . "
                SET
                    id = :id,
                    name = :name,
                    max_students = :max_students,
                    department_id = :department_id,
                    host_instructor_id = :host_instructor_id,
                    created_at= :created_at,
                    updated_at= :updated_at";

     
        $stmt = $this->conn->prepare($query);

        // Làm sạch dữ liệu
        $this->id = htmlspecialchars(strip_tags($this->id));
        $this->name = htmlspecialchars(strip_tags($this->name));
        $this->max_students = htmlspecialchars(strip_tags($this->max_students));
        $this->department_id = htmlspecialchars(strip_tags($this->department_id));
        $this->host_instructor_id = htmlspecialchars(strip_tags($this->host_instructor_id));
        $this->created_at = htmlspecialchars(strip_tags($this->created_at));
        $this->updated_at = htmlspecialchars(strip_tags($this->updated_at));


        // Bind các giá trị
        $stmt->bindParam(":id", $this->id);
        $stmt->bindParam(":name", $this->name);
        $stmt->bindParam(":max_students", $this->max_students);
        $stmt->bindParam(":department_id", $this->department_id);
        $stmt->bindParam(":host_instructor_id", $this->host_instructor_id);
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
                    name = :name,
                    max_students = :max_students,
                    department_id = :department_id,
                    host_instructor_id = :host_instructor_id,
                    created_at= :created_at,
                    updated_at= :updated_at
                WHERE id = :id";

        $stmt = $this->conn->prepare($query);

        // Làm sạch dữ liệu
        $this->id = htmlspecialchars(strip_tags($this->id));
        $this->name = htmlspecialchars(strip_tags($this->name));
        $this->max_students = htmlspecialchars(strip_tags($this->max_students));
        $this->department_id = htmlspecialchars(strip_tags($this->department_id));
        $this->host_instructor_id = htmlspecialchars(strip_tags($this->host_instructor_id));
        $this->created_at = htmlspecialchars(strip_tags($this->created_at));
        $this->updated_at = htmlspecialchars(strip_tags($this->updated_at));

        // Bind các giá trị
        $stmt->bindParam(":id", $this->id);
        $stmt->bindParam(":name", $this->name);
        $stmt->bindParam(":max_students", $this->max_students);
        $stmt->bindParam(":department_id", $this->department_id);
        $stmt->bindParam(":host_instructor_id", $this->host_instructor_id);
        $stmt->bindParam(":created_at", $this->created_at);
        $stmt->bindParam(":updated_at", $this->updated_at);

        if ($stmt->execute()) {
            return true;
        }
        return false;
    }
    // Xóa lớp học

    public function delete()
    {
        $query = "DELETE FROM classes WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id", $this->id, PDO::PARAM_STR);

        if ($stmt->execute()) {
            return $stmt->rowCount() > 0; // Kiểm tra có xóa được không
        }
        return false;
    }

}
?>