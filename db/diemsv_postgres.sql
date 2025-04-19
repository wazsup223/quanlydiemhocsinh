-- PostgreSQL database dump
-- Converted from MySQL to PostgreSQL

-- Drop existing tables if they exist
DROP TABLE IF EXISTS student_registrations CASCADE;
DROP TABLE IF EXISTS grades CASCADE;
DROP TABLE IF EXISTS instructor_assignments CASCADE;
DROP TABLE IF EXISTS students CASCADE;
DROP TABLE IF EXISTS instructors CASCADE;
DROP TABLE IF EXISTS classes CASCADE;
DROP TABLE IF EXISTS subjects CASCADE;
DROP TABLE IF EXISTS departments CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create departments table
CREATE TABLE departments (
    id SERIAL PRIMARY KEY,
    symbol VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- Create instructors table
CREATE TABLE instructors (
    id VARCHAR(50) PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    address VARCHAR(255) NOT NULL,
    birth_day DATE NOT NULL,
    phone VARCHAR(20) NOT NULL UNIQUE,
    gender SMALLINT NOT NULL,
    degree VARCHAR(100) NOT NULL,
    department_id INTEGER REFERENCES departments(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create classes table
CREATE TABLE classes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    max_students INTEGER NOT NULL,
    department_id INTEGER REFERENCES departments(id),
    host_instructor_id VARCHAR(50) REFERENCES instructors(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (name, department_id)
);

-- Create students table
CREATE TABLE students (
    id VARCHAR(50) PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    address VARCHAR(255) NOT NULL,
    birth_day DATE NOT NULL,
    phone VARCHAR(20) NOT NULL UNIQUE,
    gender SMALLINT NOT NULL,
    academic_year INTEGER NOT NULL,
    class_id INTEGER REFERENCES classes(id),
    department_id INTEGER REFERENCES departments(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create subjects table
CREATE TABLE subjects (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    semester INTEGER NOT NULL,
    credits SMALLINT NOT NULL,
    process_percentage SMALLINT NOT NULL,
    midterm_percentage SMALLINT NOT NULL,
    final_percentage SMALLINT NOT NULL,
    department_id INTEGER REFERENCES departments(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create instructor_assignments table
CREATE TABLE instructor_assignments (
    subject_id VARCHAR(50) REFERENCES subjects(id),
    instructor_id VARCHAR(50) REFERENCES instructors(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (subject_id, instructor_id)
);

-- Create grades table
CREATE TABLE grades (
    id SERIAL PRIMARY KEY,
    process_score DECIMAL(5,2),
    midterm_score DECIMAL(5,2),
    final_score DECIMAL(5,2),
    subject_id VARCHAR(50) REFERENCES subjects(id),
    student_id VARCHAR(50) REFERENCES students(id),
    by_instructor_id VARCHAR(50) REFERENCES instructors(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (student_id, subject_id)
);

-- Create student_registrations table
CREATE TABLE student_registrations (
    id SERIAL PRIMARY KEY,
    subject_id VARCHAR(50) REFERENCES subjects(id),
    student_id VARCHAR(50) REFERENCES students(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (student_id, subject_id)
);

-- Insert data into departments
INSERT INTO departments (symbol, name) VALUES
('CNTT', 'Khoa Công nghệ thông tin'),
('KT', 'Khoa Kinh tế'),
('NN', 'Khoa Ngoại ngữ'),
('CK', 'Khoa Cơ khí'),
('DDT', 'Khoa Điện - Điện tử'),
('TPC', 'Khoa Thực Phẩm Cao'),
('SWIM', 'SWIMING'),
('MATH', 'TOÁN'),
('LOG', 'LOGITEC1'),
('HTR', 'HISTORY II');

-- Insert data into users
INSERT INTO users (first_name, last_name, username, password) VALUES
('Admin', 'System', 'admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
('User', 'Test', 'user', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');

-- Insert data into instructors
INSERT INTO instructors (id, first_name, last_name, email, address, birth_day, phone, gender, degree, department_id) VALUES
('GV001', 'Nguyễn', 'Văn bbbb', 'bbbb@gmail.com', 'Số 1 Đại Cồ Việt, Hai Bà Trưng, Hà Nội', '1980-01-01', '0123456789', 0, 'Tiến sĩ', 1),
('GV002', 'Trần', 'Thị B', 'thib@example.com', 'Số 2 Tạ Quang Bửu, Hai Bà Trưng, Hà Nội', '1982-03-15', '0123456790', 0, 'Thạc sĩ', 1),
('GV003', 'Lê', 'Văn C', 'vanc@example.com', 'Số 96 Định Công, Hoàng Mai, Hà Nội', '1975-12-20', '0123456791', 1, 'Tiến sĩ', 2),
('GV004', 'Phạm', 'Thị D', 'thid@example.com', 'Số 235 Hoàng Quốc Việt, Cầu Giấy, Hà Nội', '1985-06-25', '0123456792', 0, 'Thạc sĩ', 2),
('GV005', 'Hoàng', 'Văn E', 'vane@example.com', 'Số 1 Giải Phóng, Hai Bà Trưng, Hà Nội', '1978-09-10', '0123456793', 1, 'Tiến sĩ', 3),
('GV007', 'Vũ', 'Văn G', 'vang@example.com', 'Số 58 Lê Thanh Nghị, Hai Bà Trưng, Hà Nội', '1976-04-05', '0123456795', 1, 'Tiến sĩ', 4),
('GV100', 'TRẦN', 'Mạch Điện', 'md@gmail.com', 'Huyện Bù Đốp', '1987-06-02', '0900876527', 0, 'Giáo Sư', 5),
('GV202', 'Lâm', 'Trần Vũ', 'tranvu@example.com', 'Số 200 Lê Thanh Nghị, Hai Bà Trưng, Hà Nội', '1984-08-18', '0965765861', 0, 'Thạc sĩ', 2),
('GV293', 'TRẦN', 'Thịnh ', 'TT@gmail.com', 'Huyện Bù Đốp', '2000-02-02', '+84965765861', 0, 'Thạc Sĩ', 3);

-- Insert data into classes
INSERT INTO classes (name, max_students, department_id, host_instructor_id) VALUES
('D20_TH06', 50, 1, 'GV001'),
('D21_KT01', 40, 2, 'GV003'),
('D21_KT02', 40, 2, 'GV004'),
('D21_NN', 40, 3, 'GV005'),
('D22_TH', 50, 1, 'GV001'),
('D20_BTNN', 10, 3, 'GV001'),
('D22_TCKT', 12, 2, 'GV202');

-- Insert data into students
INSERT INTO students (id, first_name, last_name, email, address, birth_day, phone, gender, academic_year, class_id, department_id) VALUES
('dh02996772', 'TRẦN', 'THÁI TUẤN', 'emalimoi@gmail.com', 'NHA BE', '2002-10-02', '0989689630', 1, 2024, 4, 1),
('dh52003232', 'lâm', 'vũ', 'vu0916449261@gmail.com', 'Huyện Bù Đốp', '2002-02-01', '0916449529', 0, 2024, 3, 1),
('DH52004312', 'Nguyễn', 'Trần Lâm Vũ ', 'vuntl@example.com', 'Bình Phước', '2002-06-05', '0988934568', 0, 2020, 1, 1),
('DH52004489', 'Nguyễn', 'HỒNG THIÊN ', 'HTHIEN@example.com', 'Bình Phước', '2002-06-05', '0902934568', 0, 2020, 1, 1),
('DH5201111111', 'Nguyen', 'Vũ', 'vu0965765861@gmail.com', 'Huyện Bù Đốp', '2002-05-06', '+84965765861', 0, 2024, 5, 3),
('DH520111222', 'navigate', 'nvigatetest', 'nvigatetest@gmail.com', 'Huyện Bù Đốp', '2003-01-02', '0900283345', 1, 2025, 1, 1),
('DH52106879', 'Thúi', 'Vi', 'DH52106879@gmail.com', 'quận 8', '2003-03-02', '0702039211', 1, 2024, 1, 1);

-- Insert data into subjects
INSERT INTO subjects (id, name, semester, credits, process_percentage, midterm_percentage, final_percentage, department_id) VALUES
('CHKT01', 'Cơ học kỹ thuật', 2, 2, 20, 30, 50, 4),
('CSDL01', 'Cơ sở dữ liệu', 1, 3, 20, 30, 50, 1),
('DA', 'Đồ án', 2, 5, 20, 30, 50, 1),
('ENG01', 'Tiếng Anh cơ bản', 1, 3, 20, 30, 50, 3),
('ENG2', 'Tiếng Anh 2', 2, 2, 20, 30, 50, 3),
('JAVA01', 'Lập trình Java', 1, 3, 20, 30, 50, 1),
('KTCB', 'Kinh tế cơ bản', 1, 2, 20, 30, 50, 2),
('KTLT', 'Ky thuật lập trình', 1, 2, 20, 30, 50, 1),
('MD01', 'Mạch điện', 1, 3, 20, 30, 50, 5);

-- Insert data into instructor_assignments
INSERT INTO instructor_assignments (subject_id, instructor_id) VALUES
('CHKT01', 'GV007'),
('CSDL01', 'GV007'),
('DA', 'GV001'),
('ENG01', 'GV005'),
('JAVA01', 'GV002'),
('MD01', 'GV100');

-- Insert data into grades
INSERT INTO grades (process_score, midterm_score, final_score, subject_id, student_id, by_instructor_id) VALUES
(7.00, 8.00, 7.50, 'CSDL01', 'DH52004489', 'GV002'),
(10.00, 9.00, 9.00, 'ENG01', 'DH52004312', 'GV005'),
(10.00, 10.00, 10.00, 'DA', 'DH52004312', 'GV202'),
(6.00, 7.00, 9.00, 'CHKT01', 'DH5201111111', 'GV007'),
(9.00, 9.00, 9.00, 'MD01', 'DH520111222', 'GV100');

-- Insert data into student_registrations
INSERT INTO student_registrations (subject_id, student_id) VALUES
('DA', 'DH52004312'),
('CHKT01', 'DH5201111111'),
('DA', 'DH520111222'),
('ENG01', 'DH52004489'),
('MD01', 'DH520111222'),
('KTCB', 'DH52106879'); 