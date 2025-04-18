<?php
class Grade
{
    private $conn;
    private $table_name = "grades";

    public $id;
    public $process_score;
    public $midterm_score;
    public $final_score;
    public $subject_id;
    public $student_id;
    public $by_instructor_id;
    public $created_at;
    public $updated_at;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    // ĐỌC DANH SÁCH ĐIỂM (READ)
    public function read()
    {
        $query = "SELECT g.*, 
                  s.first_name as student_first_name, 
                  s.last_name as student_last_name,
               CONCAT( s.first_name,' ',s.last_name) AS full_name,
                  sub.name as subject_name,
                  i.first_name as instructor_first_name,
                  i.last_name as instructor_last_name
              FROM " . $this->table_name . " g
              LEFT JOIN students s ON g.student_id = s.id
              LEFT JOIN subjects sub ON g.subject_id = sub.id
              LEFT JOIN instructors i ON g.by_instructor_id = i.id
              ORDER BY g.id
             ";

        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    // ĐỌC DANH SÁCH ĐIỂM THEO GIẢNG VIÊN
    public function readByInstructor($instructor_id)
    {
        $query = "SELECT g.*, 
                  s.first_name as student_first_name, 
                  s.last_name as student_last_name,
                  sub.name as subject_name,
                  i.first_name as instructor_first_name,
                  i.last_name as instructor_last_name
              FROM " . $this->table_name . " g
              LEFT JOIN students s ON g.student_id = s.id
              LEFT JOIN subjects sub ON g.subject_id = sub.id
              LEFT JOIN instructors i ON g.by_instructor_id = i.id
              WHERE g.by_instructor_id = :instructor_id
              ORDER BY g.id
             ";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":instructor_id", $instructor_id);
        $stmt->execute();
        return $stmt;
    }

    // THÊM DANH SÁCH ĐIỂM (CREATED)
    public function create()
    {
        $query = "INSERT INTO " . $this->table_name . "
            SET
                process_score = :process_score,
                midterm_score = :midterm_score,
                final_score = :final_score,
                subject_id = :subject_id,
                student_id = :student_id,
                by_instructor_id = :by_instructor_id,
                created_at = NOW(),
                updated_at = NOW()";

        $stmt = $this->conn->prepare($query);

        // Làm sạch dữ liệu đầu vào
        $this->process_score = htmlspecialchars(strip_tags($this->process_score));
        $this->midterm_score = htmlspecialchars(strip_tags($this->midterm_score));
        $this->final_score = htmlspecialchars(strip_tags($this->final_score));
        $this->subject_id = htmlspecialchars(strip_tags($this->subject_id));
        $this->student_id = htmlspecialchars(strip_tags($this->student_id));
        $this->by_instructor_id = htmlspecialchars(strip_tags($this->by_instructor_id));

        // Bind dữ liệu vào câu lệnh SQL
        $stmt->bindParam(":process_score", $this->process_score);
        $stmt->bindParam(":midterm_score", $this->midterm_score);
        $stmt->bindParam(":final_score", $this->final_score);
        $stmt->bindParam(":subject_id", $this->subject_id);
        $stmt->bindParam(":student_id", $this->student_id);
        $stmt->bindParam(":by_instructor_id", $this->by_instructor_id);

        if ($stmt->execute()) {
            return true;
        }
        return false;
    }
    //  XÓA DANH SÁCH ĐIỂM (CREATED)
    public function delete()
    {
        $query = "DELETE FROM " . $this->table_name . " WHERE id = :id";
        $stmt = $this->conn->prepare($query);

        // Làm sạch dữ liệu
        $this->id = htmlspecialchars(strip_tags($this->id));

        // Bind ID
        $stmt->bindParam(":id", $this->id);

        // Thực thi truy vấn
        if ($stmt->execute()) {
            return true;
        }
        return false;
    }
    // CẬP NHẬT DANH SÁCH ĐIỂM (CREATED)
    public function update()
    {
        $query = "UPDATE " . $this->table_name . "
               SET
                   process_score = :process_score,
                   midterm_score = :midterm_score,
                   final_score = :final_score,
                   subject_id = :subject_id,
                   student_id = :student_id,
                   by_instructor_id = :by_instructor_id,
                   updated_at = NOW()
               WHERE id = :id";

        $stmt = $this->conn->prepare($query);

        // Làm sạch dữ liệu
        $this->id = htmlspecialchars(strip_tags($this->id));
        $this->process_score = htmlspecialchars(strip_tags($this->process_score));
        $this->midterm_score = htmlspecialchars(strip_tags($this->midterm_score));
        $this->final_score = htmlspecialchars(strip_tags($this->final_score));
        $this->subject_id = htmlspecialchars(strip_tags($this->subject_id));
        $this->student_id = htmlspecialchars(strip_tags($this->student_id));
        $this->by_instructor_id = htmlspecialchars(strip_tags($this->by_instructor_id));

        // Bind các giá trị
        $stmt->bindParam(":id", $this->id);
        $stmt->bindParam(":process_score", $this->process_score);
        $stmt->bindParam(":midterm_score", $this->midterm_score);
        $stmt->bindParam(":final_score", $this->final_score);
        $stmt->bindParam(":subject_id", $this->subject_id);
        $stmt->bindParam(":student_id", $this->student_id);
        $stmt->bindParam(":by_instructor_id", $this->by_instructor_id);

        if ($stmt->execute()) {
            return true;
        }
        return false;
    }
}
?>