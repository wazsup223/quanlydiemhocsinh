<?php
class Student_reg
{
    private $conn;
    private $table_name = "student_registrations";
    public $id;
    public $subject_id;
    public $student_id;
    public $created_at;
    public $updated_at;
    public function __construct($db)
    {
        $this->conn = $db;
    }
    // Lấy tất cả sinh viên đăng ký
    public function read()
    {
        $query = "SELECT 
                e.*, 
                s.first_name, 
                s.last_name, 
               CONCAT( s.first_name,' ',s.last_name) AS full_name,
                s.academic_year, 
                sub.name AS subject_name, 
                sub.semester,
                sub.credits
              FROM student_registrations e
              LEFT JOIN students s ON e.student_id = s.id
              LEFT JOIN subjects sub ON e.subject_id = sub.id
              ORDER BY e.id";

        $stmt = $this->conn->prepare($query);
        $stmt->execute();

        return $stmt;
    }


    // create
    public function create()
    {
        $query = "INSERT INTO " . $this->table_name . "
                SET
                 
                    subject_id = :subject_id,
                    student_id = :student_id,
                    
                    created_at = :created_at,
                    updated_at = :updated_at";



        $stmt = $this->conn->prepare($query);

        // Làm sạch dữ liệu

        $this->subject_id = htmlspecialchars(strip_tags($this->subject_id));
        $this->student_id = htmlspecialchars(strip_tags($this->student_id));
        $this->created_at = htmlspecialchars(strip_tags($this->created_at));
        $this->updated_at = htmlspecialchars(strip_tags($this->updated_at));
        // $this->created_at = date('Y-m-d H:i:s');
        //$this->updated_at = date('Y-m-d H:i:s');


        // Bind các giá trị

        $stmt->bindParam(":subject_id", $this->subject_id);
        $stmt->bindParam(":student_id", $this->student_id);
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
                    subject_id = :subject_id,
                    student_id = :student_id,
                    
                    created_at = :created_at,
                    updated_at = :updated_at
                WHERE id = :id";

        $stmt = $this->conn->prepare($query);

        // Làm sạch dữ liệu
        $this->id = htmlspecialchars(strip_tags($this->id));
        $this->subject_id = htmlspecialchars(strip_tags($this->subject_id));
        $this->student_id = htmlspecialchars(strip_tags($this->student_id));
        $this->created_at = htmlspecialchars(strip_tags($this->created_at));
        $this->updated_at = htmlspecialchars(strip_tags($this->updated_at));

        // Bind các giá trị
        $stmt->bindParam(":id", $this->id);
        $stmt->bindParam(":subject_id", $this->subject_id);
        $stmt->bindParam(":student_id", $this->student_id);
        $stmt->bindParam(":created_at", $this->created_at);
        $stmt->bindParam(":updated_at", $this->updated_at);

        if ($stmt->execute()) {
            return true;
        }
        return false;
    }
    // Xóa sinh viên tham gia môn học
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

    //delete
    public function delete()
    {
        $query = "DELETE FROM student_registrations WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id", $this->id, PDO::PARAM_STR);

        if ($stmt->execute()) {
            return $stmt->rowCount() > 0; // Kiểm tra có xóa được không
        }
        return false;
    }
    // Lấy sinh viên tham gia môn học theo mã
    public function readBySubject($subject_id)
    {
        $query = "SELECT i.*, s.first_name, s.last_name, sub.name as subject_name 
                 FROM " . $this->table_name . " i
                 LEFT JOIN students s ON i.student_id = s.id
                 LEFT JOIN subjects sub ON i.subject_id = sub.id
                 WHERE i.subject_id = ?
                 ORDER BY i.id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $subject_id);
        $stmt->execute();
        return $stmt;
    }
    // Lấy sinh viên tham gia môn học theo mã sv
    public function readByStudent($student_id)
    {
        $query = "SELECT i.*, s.first_name, s.last_name, sub.name as subject_name 
                  FROM " . $this->table_name . " i
                  LEFT JOIN students s ON i.student_id = s.id
                  LEFT JOIN subjects sub ON i.subject_id = sub.id
                  WHERE i.student_id = ?
                  ORDER BY i.id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $student_id);
        $stmt->execute();
        return $stmt;
    }

}
?>