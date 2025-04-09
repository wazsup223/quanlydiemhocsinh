<?php
class Subject
{
    private $conn;
    private $table_name = "subjects";
    public $id;
    public $name;
    public $credits;
    public $process_percentage;
    public $midterm_percentage;
    public $final_percentage;
    public $department_id;
    public $created_at;
    public $updated_at;
    public function __construct($db)
    {
        $this->conn = $db;
    }
    // Lấy tất cả môn học
    public function read()
    {

        $query = "SELECT s.*
              FROM " . $this->table_name . " s
              ORDER BY s.id
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
                    name = :name,
                    credits = :credits,
                    process_percentage = :process_percentage,
                    midterm_percentage = :midterm_percentage,
                    final_percentage = :final_percentage,
                    department_id = :department_id,
                    created_at = :created_at,
                    updated_at = :updated_at";

        $stmt = $this->conn->prepare($query);

        // Làm sạch dữ liệu
        $this->id = htmlspecialchars(strip_tags($this->id));
        $this->name = htmlspecialchars(strip_tags($this->name));
        $this->credits = htmlspecialchars(strip_tags($this->credits));
        $this->process_percentage = htmlspecialchars(strip_tags($this->process_percentage));
        $this->midterm_percentage = htmlspecialchars(strip_tags($this->midterm_percentage));
        $this->final_percentage = htmlspecialchars(strip_tags($this->final_percentage));
        $this->department_id = htmlspecialchars(strip_tags($this->department_id));
        $this->created_at = htmlspecialchars(strip_tags($this->created_at));
        $this->updated_at = htmlspecialchars(strip_tags($this->updated_at));
        
        

        // Bind các giá trị
        $stmt->bindParam(":id", $this->id);
        $stmt->bindParam(":name", $this->name);
        $stmt->bindParam(":credits", $this->credits);
        $stmt->bindParam(":process_percentage", $this->process_percentage);
        $stmt->bindParam(":midterm_percentage", $this->midterm_percentage);
        $stmt->bindParam(":final_percentage", $this->final_percentage);
        $stmt->bindParam(":department_id", $this->department_id);
        $stmt->bindParam(":created_at", $this->created_at);
        $stmt->bindParam(":updated_at", $this->updated_at);

        if ($stmt->execute()) {
            return true;
        }
        return false;
    }
    public function update()
    {
        $query = "UPDATE " . $this->table_name . "
                SET
                    name = :name,
                    credits = :credits,
                    process_percentage = :process_percentage,
                    midterm_percentage = :midterm_percentage,
                    final_percentage = :final_percentage,
                    department_id = :department_id,
                    created_at = :created_at,
                    updated_at = :updated_at
                    
                WHERE id = :id";

        $stmt = $this->conn->prepare($query);

        // Làm sạch dữ liệu
        $this->id = htmlspecialchars(strip_tags($this->id));
        $this->name = htmlspecialchars(strip_tags($this->name));
        $this->credits = htmlspecialchars(strip_tags($this->credits));
        $this->process_percentage = htmlspecialchars(strip_tags($this->process_percentage));
        $this->midterm_percentage = htmlspecialchars(strip_tags($this->midterm_percentage));
        $this->final_percentage = htmlspecialchars(strip_tags($this->final_percentage));
        $this->department_id = htmlspecialchars(strip_tags($this->department_id));
        $this->created_at = htmlspecialchars(strip_tags($this->created_at));
        $this->updated_at = htmlspecialchars(strip_tags($this->updated_at));

        // Bind các giá trị
        $stmt->bindParam(":id", $this->id);
        $stmt->bindParam(":name", $this->name);
        $stmt->bindParam(":credits", $this->credits);
        $stmt->bindParam(":process_percentage", $this->process_percentage);
        $stmt->bindParam(":midterm_percentage", $this->midterm_percentage);
        $stmt->bindParam(":final_percentage", $this->final_percentage);
        $stmt->bindParam(":department_id", $this->department_id);
        $stmt->bindParam(":created_at", $this->created_at);
        $stmt->bindParam(":updated_at", $this->updated_at);

        if ($stmt->execute()) {
            return true;
        }
        return false;
    }
    public function delete()
    {
        $query = "DELETE FROM subjects WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id", $this->id, PDO::PARAM_STR);

        if ($stmt->execute()) {
            return $stmt->rowCount() > 0; // Kiểm tra có xóa được không
        }
        return false;
    }

}
?>