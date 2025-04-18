<?php
class InstructorAssignment
{
    // Kết nối cơ sở dữ liệu và tên bảng
    private $conn;
    private $table_name = "instructor_assignments";

    // Thuộc tính của đối tượng
    public $subject_id;
    public $instructor_id;
    public $subject_name;
    public $instructor_first_name;
    public $instructor_last_name;
    public $department_name;
    public $created_at;
    public $updated_at;

    // Hàm khởi tạo với $db là kết nối cơ sở dữ liệu
    public function __construct($db)
    {
        $this->conn = $db;
    }

    // Đọc tất cả phân công giảng dạy
    public function read()
    {
        // Truy vấn chọn tất cả
        $query = "SELECT ia.*, 
                    s.name as subject_name,
                    i.first_name as instructor_first_name,
                    i.last_name as instructor_last_name,
                    d.name as department_name
                FROM " . $this->table_name . " ia
                LEFT JOIN subjects s ON ia.subject_id = s.id
                LEFT JOIN instructors i ON ia.instructor_id = i.id
                LEFT JOIN departments d ON i.department_id = d.id
                ORDER BY ia.created_at DESC";

        // Chuẩn bị câu truy vấn
        $stmt = $this->conn->prepare($query);

        // Thực thi truy vấn
        $stmt->execute();

        return $stmt;
    }

    // Đọc một phân công giảng dạy
    public function readOne()
    {
        // Truy vấn để đọc một bản ghi
        $query = "SELECT ia.*, 
                    s.name as subject_name,
                    i.first_name as instructor_first_name,
                    i.last_name as instructor_last_name,
                    d.name as department_name
                FROM " . $this->table_name . " ia
                LEFT JOIN subjects s ON ia.subject_id = s.id
                LEFT JOIN instructors i ON ia.instructor_id = i.id
                LEFT JOIN departments d ON i.department_id = d.id
                WHERE ia.subject_id = ? AND ia.instructor_id = ?
                LIMIT 0,1";

        // Chuẩn bị câu truy vấn
        $stmt = $this->conn->prepare($query);

        // Gán id của bản ghi cần đọc
        $stmt->bindParam(1, $this->subject_id);
        $stmt->bindParam(2, $this->instructor_id);

        // Thực thi truy vấn
        $stmt->execute();

        // Lấy dòng dữ liệu đã truy xuất
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        // Gán giá trị cho các thuộc tính của đối tượng
        if ($row) {
            $this->subject_id = $row['subject_id'];
            $this->instructor_id = $row['instructor_id'];
            $this->subject_name = $row['subject_name'];
            $this->instructor_first_name = $row['instructor_first_name'];
            $this->instructor_last_name = $row['instructor_last_name'];
            $this->department_name = $row['department_name'];
            $this->created_at = $row['created_at'];
            $this->updated_at = $row['updated_at'];
            return true;
        }
        return false;
    }

    // Tạo phân công giảng dạy mới
    public function create()
    {
        // Kiểm tra xem phân công đã tồn tại chưa
        if ($this->readOne()) {
            return false;
        }

        // Truy vấn tạo mới
        $query = "INSERT INTO " . $this->table_name . " 
                SET subject_id = :subject_id, instructor_id = :instructor_id";

        // Chuẩn bị truy vấn
        $stmt = $this->conn->prepare($query);

        // Làm sạch dữ liệu
        $this->subject_id = htmlspecialchars(strip_tags($this->subject_id));
        $this->instructor_id = htmlspecialchars(strip_tags($this->instructor_id));

        // Gán giá trị
        $stmt->bindParam(":subject_id", $this->subject_id);
        $stmt->bindParam(":instructor_id", $this->instructor_id);

        // Thực thi truy vấn
        if ($stmt->execute()) {
            return true;
        }
        return false;
    }

    // Xóa phân công giảng dạy
    public function delete($subject_id, $instructor_id)
    {
        $query = "DELETE FROM instructor_assignments WHERE subject_id = :subject_id AND instructor_id = :instructor_id";

        // Chuẩn bị câu lệnh SQL
        $stmt = $this->conn->prepare($query);

        // Gắn giá trị vào tham số
        $stmt->bindParam(':subject_id', $subject_id);
        $stmt->bindParam(':instructor_id', $instructor_id);

        // Thực thi câu lệnh và trả về kết quả
        if ($stmt->execute()) {
            return true;
        }
        return false;
    }

    // Đọc phân công giảng dạy theo môn học
    public function readBySubject($subject_id)
    {
        // Truy vấn để đọc các bản ghi
        $query = "SELECT ia.*, 
                    s.name as subject_name,
                    i.first_name as instructor_first_name,
                    i.last_name as instructor_last_name,
                    d.name as department_name
                FROM " . $this->table_name . " ia
                LEFT JOIN subjects s ON ia.subject_id = s.id
                LEFT JOIN instructors i ON ia.instructor_id = i.id
                LEFT JOIN departments d ON i.department_id = d.id
                WHERE ia.subject_id = ?
                ORDER BY ia.created_at DESC";

        // Chuẩn bị câu truy vấn
        $stmt = $this->conn->prepare($query);

        // Gán id của bản ghi cần đọc
        $stmt->bindParam(1, $subject_id);

        // Thực thi truy vấn
        $stmt->execute();

        return $stmt;
    }

    // Đọc phân công giảng dạy theo giảng viên
    public function readByInstructor($instructor_id)
    {
        // Truy vấn để đọc các bản ghi
        $query = "SELECT ia.*, 
                    s.name as subject_name,
                    i.first_name as instructor_first_name,
                    i.last_name as instructor_last_name,
                    d.name as department_name
                FROM " . $this->table_name . " ia
                LEFT JOIN subjects s ON ia.subject_id = s.id
                LEFT JOIN instructors i ON ia.instructor_id = i.id
                LEFT JOIN departments d ON i.department_id = d.id
                WHERE ia.instructor_id = ?
                ORDER BY ia.created_at DESC";

        // Chuẩn bị câu truy vấn
        $stmt = $this->conn->prepare($query);

        // Gán id của bản ghi cần đọc
        $stmt->bindParam(1, $instructor_id);

        // Thực thi truy vấn
        $stmt->execute();

        // Kiểm tra xem có kết quả không
        if ($stmt->rowCount() > 0) {
            return $stmt;
        }
        return false;
    }
    // Cập nhật phân công giảng dạy
    public function update($old_subject_id, $old_instructor_id)
    {
        // Kiểm tra xem bản ghi cũ có tồn tại không
        $queryCheck = "SELECT * FROM " . $this->table_name . " 
                   WHERE subject_id = ? AND instructor_id = ?";
        $stmtCheck = $this->conn->prepare($queryCheck);
        $stmtCheck->bindParam(1, $old_subject_id);
        $stmtCheck->bindParam(2, $old_instructor_id);
        $stmtCheck->execute();

        if ($stmtCheck->rowCount() == 0) {
            return false; // Bản ghi không tồn tại
        }

        // Truy vấn cập nhật bản ghi
        $query = "UPDATE " . $this->table_name . "
              SET subject_id = :subject_id, instructor_id = :instructor_id
              WHERE subject_id = :old_subject_id AND instructor_id = :old_instructor_id";

        // Chuẩn bị truy vấn
        $stmt = $this->conn->prepare($query);

        // Làm sạch dữ liệu
        $this->subject_id = htmlspecialchars(strip_tags($this->subject_id));
        $this->instructor_id = htmlspecialchars(strip_tags($this->instructor_id));
        $old_subject_id = htmlspecialchars(strip_tags($old_subject_id));
        $old_instructor_id = htmlspecialchars(strip_tags($old_instructor_id));

        // Gán giá trị
        $stmt->bindParam(':subject_id', $this->subject_id);
        $stmt->bindParam(':instructor_id', $this->instructor_id);
        $stmt->bindParam(':old_subject_id', $old_subject_id);
        $stmt->bindParam(':old_instructor_id', $old_instructor_id);

        // Thực thi truy vấn
        if ($stmt->execute()) {
            return true;
        }

        return false;
    }

}
?>