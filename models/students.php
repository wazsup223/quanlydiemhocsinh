<?php
class Student
{
    private $conn;
    private $table_name = "students";
    public $id;
    public $first_name;
    public $last_name;
    public $email;
    public $address;
    public $birth_day;
    public $phone;
    public $gender;
    public $academic_year;
    public $class_id;

    public $department_id;
    public $created_at;
    public $updated_at;
    public function __construct($db)
    {
        $this->conn = $db;
    }
    // Lấy tất cả sinh viên
    public function read()
    {

        $query = "SELECT 
        s.*, 
        d.name as department_name, 
        c.name as class_name
      FROM " . $this->table_name . " s
      LEFT JOIN departments d ON s.department_id = d.id
      LEFT JOIN classes c ON s.class_id = c.id
      ORDER BY s.id";

        $stmt = $this->conn->prepare($query);

        $stmt->execute();

        return $stmt;
    }
    // Lấy sinh viên theo mã
    public function readOne()
    {
        $sql = "SELECT * FROM students WHERE id = :id";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(":id", $this->id, PDO::PARAM_STR); // Dùng PARAM_STR nếu ID là chuỗi

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
            $this->academic_year = $row['academic_year'];
            $this->class_id = $row['class_id'];
            $this->department_id = $row['department_id'];
            return true;
        }
        return false;
    }
    public function create()
    {
        $query = "INSERT INTO " . $this->table_name . " 
        (id, first_name, last_name, email, address, birth_day, phone, gender, academic_year, class_id, department_id, created_at, updated_at) 
        VALUES 
        (:id, :first_name, :last_name, :email, :address, :birth_day, :phone, :gender, :academic_year, :class_id, :department_id, :created_at, :updated_at)";

        $stmt = $this->conn->prepare($query);

        // Bind dữ liệu
        $stmt->bindParam(':id', $this->id);
        $stmt->bindParam(':first_name', $this->first_name);
        $stmt->bindParam(':last_name', $this->last_name);
        $stmt->bindParam(':email', $this->email);
        $stmt->bindParam(':address', $this->address);
        $stmt->bindParam(':birth_day', $this->birth_day);
        $stmt->bindParam(':phone', $this->phone);
        $stmt->bindParam(':gender', $this->gender);
        $stmt->bindParam(':academic_year', $this->academic_year);
        $stmt->bindParam(':class_id', $this->class_id);
        $stmt->bindParam(':department_id', $this->department_id);
        $stmt->bindParam(':created_at', $this->created_at);
        $stmt->bindParam(':updated_at', $this->updated_at);

        // Thực thi truy vấn
        if ($stmt->execute()) {
            return true;
        }

        // Ghi log lỗi nếu cần
        // error_log(print_r($stmt->errorInfo(), true));

        return false;
    }
    //update
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
                    academic_year = :academic_year,
                    class_id = :class_id,
                    department_id = :department_id,
                    created_at= :created_at,
                    updated_at= :updated_at
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
        $this->academic_year = htmlspecialchars(strip_tags($this->academic_year));
        $this->class_id = htmlspecialchars(strip_tags($this->class_id));
        $this->department_id = htmlspecialchars(strip_tags($this->department_id));
        $this->created_at = htmlspecialchars(strip_tags($this->created_at));
        $this->updated_at = htmlspecialchars(strip_tags($this->updated_at));

        // Bind các giá trị
        $stmt->bindParam(":id", $this->id);
        $stmt->bindParam(":first_name", $this->first_name);
        $stmt->bindParam(":last_name", $this->last_name);
        $stmt->bindParam(":email", $this->email);
        $stmt->bindParam(":address", $this->address);
        $stmt->bindParam(":birth_day", $this->birth_day);
        $stmt->bindParam(":phone", $this->phone);
        $stmt->bindParam(":gender", $this->gender);
        $stmt->bindParam(":academic_year", $this->academic_year);
        $stmt->bindParam(":class_id", $this->class_id);
        $stmt->bindParam(":department_id", $this->department_id);
        $stmt->bindParam(":created_at", $this->created_at);
        $stmt->bindParam(":updated_at", $this->updated_at);

        if ($stmt->execute()) {
            return true;
        }
        return false;
    }
    // Xóa sinh viên
    /*public function delete()
    {
        $query = "DELETE FROM " . $this->table_name . " WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $this->id = htmlspecialchars(strip_tags($this->id));
        $stmt->bindParam(1, $this->id);

        if ($stmt->execute()) {
            return true;
        }
        return false;
    }*/
    public function delete()
    {
        // Kiểm tra xem ID có được thiết lập không
        if (empty($this->id)) {
            return false;
        }

        try {
            $query = "DELETE FROM students WHERE id = :id";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(":id", $this->id, PDO::PARAM_STR);

            $stmt->execute();

            // Kiểm tra có bao nhiêu dòng bị ảnh hưởng (xóa thành công nếu > 0)
            return $stmt->rowCount() > 0;
        } catch (PDOException $e) {
            // Ghi log lỗi nếu cần (không echo trực tiếp ra API production)
            error_log("Lỗi xóa sinh viên: " . $e->getMessage());
            return false;
        }
    }

    // Lấy sinh viên theo khoa
    public function readByDepartment($department_id)
    {
        $query = $query = "SELECT s.*, c.name as class_name, d.name as department_name 
        FROM " . $this->table_name . " s
        LEFT JOIN departments d ON s.department_id = d.id
        LEFT JOIN classes c ON s.class_id = c.id
                  WHERE s.department_id = ?
                  ORDER BY s.id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $department_id);
        $stmt->execute();
        return $stmt;
    }

    // Lấy sinh viên theo lớp
    public function readByClass($class_id)
    {
        $query = $query = "SELECT s.*, c.name as class_name, d.name as department_name 
        FROM " . $this->table_name . " s
        LEFT JOIN departments d ON s.department_id = d.id
        LEFT JOIN classes c ON s.class_id = c.id
                  WHERE s.class_id = ?
                  ORDER BY s.id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $class_id);
        $stmt->execute();
        return $stmt;
    }
    // Lấy sinh viên theo năm học
    public function readByAcademicYear($academic_year)
    {
        $query = "SELECT s.*, c.name as class_name, d.name as department_name 
          FROM " . $this->table_name . " s
          LEFT JOIN departments d ON s.department_id = d.id
          LEFT JOIN classes c ON s.class_id = c.id
          WHERE s.academic_year = ?
          ORDER BY s.id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $academic_year);
        $stmt->execute();
        return $stmt;
    }

    ////lays sinh viên trong 1 lớp cảu classs
    public function readByClassId($class_id)
    {
        $query = "SELECT * FROM students WHERE class_id = :class_id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":class_id", $class_id);
        $stmt->execute();
        return $stmt;
    }
}
?>