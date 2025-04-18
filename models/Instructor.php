<?php
class Instructor
{
    private $conn;
    private $table_name = "instructors";

    public $id;
    public $first_name;
    public $last_name;
    public $email;
    public $address;
    public $birth_day;
    public $phone;
    public $gender;
    public $degree;
    public $department_id;

    public $department_name;
    public $created_at;
    public $updated_at;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    // Lấy tất cả giảng viên
    /*public function read()
    {
        $query = "SELECT i.*, d.name as department_name 
                 FROM " . $this->table_name . " i
                 LEFT JOIN departments d ON i.department_id = d.id
                 
                 ORDER BY i.id";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }*/
    // new 16/4
    public function read()
    {
        $query = "SELECT i.*, d.name as department_name,
                     GROUP_CONCAT(ta.subject_id) as subjects
              FROM " . $this->table_name . " i
              LEFT JOIN departments d ON i.department_id = d.id
              LEFT JOIN instructor_assignments ta ON i.id = ta.instructor_id
              GROUP BY i.id
              ORDER BY i.id";

        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }


    // Lấy giảng viên theo mã
    public function readOne()
    {
        $query = "SELECT i.*, d.name as department_name 
                 FROM " . $this->table_name . " i
                 LEFT JOIN departments d ON i.department_id = d.id
                 WHERE i.id = ? LIMIT 0,1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->id);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($row) {
            $this->first_name = $row['first_name'];
            $this->last_name = $row['last_name'];
            $this->email = $row['email'];
            $this->address = $row['address'];
            $this->birth_day = $row['birth_day'];
            $this->phone = $row['phone'];
            $this->gender = $row['gender'];
            $this->degree = $row['degree'];
            $this->department_id = $row['department_id'];
            return true;
        }
        return false;
    }

    // Thêm giảng viên mới
    public function create()
    {
        $query = "INSERT INTO " . $this->table_name . "
                SET
                    id = :id,
                    first_name = :first_name,
                    last_name = :last_name,
                    email = :email,
                    address = :address,
                    birth_day = :birth_day,
                    phone = :phone,
                    gender = :gender,
                    degree = :degree,
                    department_id = :department_id";

        $stmt = $this->conn->prepare($query);

        // Làm sạch dữ liệu
        $this->id = htmlspecialchars(strip_tags($this->id));
        $this->first_name = htmlspecialchars(strip_tags($this->first_name));
        $this->last_name = htmlspecialchars(strip_tags($this->last_name));
        $this->email = htmlspecialchars(strip_tags($this->email));
        $this->address = htmlspecialchars(strip_tags($this->address));
        $this->birth_day = htmlspecialchars(strip_tags($this->birth_day));
        $this->phone = htmlspecialchars(strip_tags($this->phone));
        $this->gender = htmlspecialchars(strip_tags($this->gender));
        $this->degree = htmlspecialchars(strip_tags($this->degree));
        $this->department_id = htmlspecialchars(strip_tags($this->department_id));

        // Bind các giá trị
        $stmt->bindParam(":id", $this->id);
        $stmt->bindParam(":first_name", $this->first_name);
        $stmt->bindParam(":last_name", $this->last_name);
        $stmt->bindParam(":email", $this->email);
        $stmt->bindParam(":address", $this->address);
        $stmt->bindParam(":birth_day", $this->birth_day);
        $stmt->bindParam(":phone", $this->phone);
        $stmt->bindParam(":gender", $this->gender);
        $stmt->bindParam(":degree", $this->degree);
        $stmt->bindParam(":department_id", $this->department_id);

        if ($stmt->execute()) {
            return true;
        }
        return false;
    }

    // Cập nhật thông tin giảng viên
    public function update()
    {
        $query = "UPDATE " . $this->table_name . "
                SET
                    first_name = :first_name,
                    last_name = :last_name,
                    email = :email,
                    address = :address,
                    birth_day = :birth_day,
                    phone = :phone,
                    gender = :gender,
                    degree = :degree,
                    department_id = :department_id
                WHERE id = :id";

        $stmt = $this->conn->prepare($query);

        // Làm sạch dữ liệu
        $this->id = htmlspecialchars(strip_tags($this->id));
        $this->first_name = htmlspecialchars(strip_tags($this->first_name));
        $this->last_name = htmlspecialchars(strip_tags($this->last_name));
        $this->email = htmlspecialchars(strip_tags($this->email));
        $this->address = htmlspecialchars(strip_tags($this->address));
        $this->birth_day = htmlspecialchars(strip_tags($this->birth_day));
        $this->phone = htmlspecialchars(strip_tags($this->phone));
        $this->gender = htmlspecialchars(strip_tags($this->gender));
        $this->degree = htmlspecialchars(strip_tags($this->degree));
        $this->department_id = htmlspecialchars(strip_tags($this->department_id));

        // Bind các giá trị
        $stmt->bindParam(":id", $this->id);
        $stmt->bindParam(":first_name", $this->first_name);
        $stmt->bindParam(":last_name", $this->last_name);
        $stmt->bindParam(":email", $this->email);
        $stmt->bindParam(":address", $this->address);
        $stmt->bindParam(":birth_day", $this->birth_day);
        $stmt->bindParam(":phone", $this->phone);
        $stmt->bindParam(":gender", $this->gender);
        $stmt->bindParam(":degree", $this->degree);
        $stmt->bindParam(":department_id", $this->department_id);

        if ($stmt->execute()) {
            return true;
        }
        return false;
    }

    // Xóa giảng viên
    public function delete()
    {
        $query = "DELETE FROM " . $this->table_name . " WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $this->id = htmlspecialchars(strip_tags($this->id));
        $stmt->bindParam(1, $this->id);

        if ($stmt->execute()) {
            return true;
        }
        return false;
    }

    // Lấy danh sách giảng viên theo khoa
    public function readByDepartment($department_id)
    {
        $query = "SELECT i.*, d.name as department_name 
                 FROM " . $this->table_name . " i
                 LEFT JOIN departments d ON i.department_id = d.id
                 WHERE i.department_id = ?
                 ORDER BY i.id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $department_id);
        $stmt->execute();
        return $stmt;
    }

    /// lấy cho detail department
    public function readByDepartmentdetail($department_id)
    {
        $query = "SELECT * FROM " . $this->table_name . " WHERE department_id = :department_id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":department_id", $department_id);
        $stmt->execute();

        return $stmt;
    }
}
?>