-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1:3306
-- Thời gian đã tạo: Th4 16, 2025 lúc 07:08 AM
-- Phiên bản máy phục vụ: 8.0.31
-- Phiên bản PHP: 8.0.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `diemsv`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `classes`
--

DROP TABLE IF EXISTS `classes`;
CREATE TABLE IF NOT EXISTS `classes` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `max_students` int NOT NULL,
  `department_id` bigint NOT NULL,
  `host_instructor_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_class_name_dept` (`name`,`department_id`),
  KEY `fk_class_department` (`department_id`),
  KEY `fk_class_instructor` (`host_instructor_id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `classes`
--

INSERT INTO `classes` (`id`, `name`, `max_students`, `department_id`, `host_instructor_id`, `created_at`, `updated_at`) VALUES
(1, 'D20_TH06', 50, 1, 'GV001', '2025-03-30 11:52:22', '2025-04-12 00:25:12'),
(3, 'D21_KT01', 40, 2, 'GV003', '2025-03-30 11:52:22', '2025-04-12 00:25:48'),
(4, 'D21_KT02', 40, 2, 'GV004', '2025-03-30 11:52:22', '2025-04-12 00:25:59'),
(5, 'D21_NN', 40, 3, 'GV005', '2025-03-30 11:52:22', '2025-04-12 00:26:13'),
(7, 'D22_TH', 50, 1, 'GV001', '2025-03-30 11:52:22', '2025-04-12 00:26:25'),
(10, 'D20_BTNN', 10, 3, 'GV001', '2025-04-11 23:47:53', '2025-04-12 00:26:42'),
(11, 'D22_TCKT', 12, 2, 'GV202', '2025-04-11 23:58:23', '2025-04-12 00:26:57');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `departments`
--

DROP TABLE IF EXISTS `departments`;
CREATE TABLE IF NOT EXISTS `departments` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `symbol` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `departments`
--

INSERT INTO `departments` (`id`, `symbol`, `name`, `created_at`, `updated_at`) VALUES
(1, 'CNTT', 'Khoa Công nghệ thông tin', '2025-03-30 11:52:22', '2025-03-30 11:52:22'),
(2, 'KT', 'Khoa Kinh tế', '2025-03-30 11:52:22', '2025-03-30 11:52:22'),
(3, 'NN', 'Khoa Ngoại ngữ', '2025-03-30 11:52:22', '2025-03-30 11:52:22'),
(4, 'CK', 'Khoa Cơ khí', '2025-03-30 11:52:22', '2025-03-30 11:52:22'),
(5, 'DDT', 'Khoa Điện - Điện tử', '2025-03-30 11:52:22', '2025-03-30 11:52:22'),
(6, 'TPC', 'Khoa Thực Phẩm Cao', '2025-03-30 11:52:22', '2025-04-12 22:08:22'),
(7, 'SWIM', 'SWIMING', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(10, 'MATH', 'TOÁN', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(14, 'LOG', 'LOGITEC1', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(15, 'HTR', 'HISTORY II', '2025-04-13 05:09:09', '2025-04-13 05:09:26');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `grades`
--

DROP TABLE IF EXISTS `grades`;
CREATE TABLE IF NOT EXISTS `grades` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `process_score` decimal(5,2) DEFAULT NULL,
  `midterm_score` decimal(5,2) DEFAULT NULL,
  `final_score` decimal(5,2) DEFAULT NULL,
  `subject_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `student_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `by_instructor_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_grade_student_subject` (`student_id`,`subject_id`),
  KEY `fk_grade_instructor` (`by_instructor_id`),
  KEY `fk_grade_subject` (`subject_id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `grades`
--

INSERT INTO `grades` (`id`, `process_score`, `midterm_score`, `final_score`, `subject_id`, `student_id`, `by_instructor_id`, `created_at`, `updated_at`) VALUES
(6, '7.00', '8.00', '7.50', 'CSDL01', 'DH52004489', 'GV002', '2025-04-02 06:08:43', '2025-04-15 10:51:03'),
(7, '10.00', '9.00', '9.00', 'ENG01', 'DH52004312', 'GV005', '2025-04-02 06:10:10', '2025-04-11 13:02:35'),
(11, '10.00', '10.00', '10.00', 'DA', 'DH52004312', 'GV202', '2025-04-15 15:46:32', '2025-04-15 15:46:32'),
(14, '6.00', '7.00', '9.00', 'CHKT01', 'DH5201111111', 'GV007', '2025-04-16 05:53:24', '2025-04-16 05:53:24'),
(15, '9.00', '9.00', '9.00', 'MD01', 'DH520111222', 'GV100', '2025-04-16 05:59:56', '2025-04-16 05:59:56');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `instructors`
--

DROP TABLE IF EXISTS `instructors`;
CREATE TABLE IF NOT EXISTS `instructors` (
  `id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `first_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `birth_day` date NOT NULL,
  `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `gender` tinyint(1) NOT NULL,
  `degree` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `department_id` bigint NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_instructor_email` (`email`),
  UNIQUE KEY `uk_instructor_phone` (`phone`),
  KEY `fk_instructor_department` (`department_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `instructors`
--

INSERT INTO `instructors` (`id`, `first_name`, `last_name`, `email`, `address`, `birth_day`, `phone`, `gender`, `degree`, `department_id`, `created_at`, `updated_at`) VALUES
('GV001', 'Nguyễn', 'Văn bbbb', 'bbbb@gmail.com', 'Số 1 Đại Cồ Việt, Hai Bà Trưng, Hà Nội', '1980-01-01', '0123456789', 0, 'Tiến sĩ', 1, '2025-03-30 11:52:22', '2025-04-13 13:19:57'),
('GV002', 'Trần', 'Thị B', 'thib@example.com', 'Số 2 Tạ Quang Bửu, Hai Bà Trưng, Hà Nội', '1982-03-15', '0123456790', 0, 'Thạc sĩ', 1, '2025-03-30 11:52:22', '2025-03-30 11:52:22'),
('GV003', 'Lê', 'Văn C', 'vanc@example.com', 'Số 96 Định Công, Hoàng Mai, Hà Nội', '1975-12-20', '0123456791', 1, 'Tiến sĩ', 2, '2025-03-30 11:52:22', '2025-03-30 11:52:22'),
('GV004', 'Phạm', 'Thị D', 'thid@example.com', 'Số 235 Hoàng Quốc Việt, Cầu Giấy, Hà Nội', '1985-06-25', '0123456792', 0, 'Thạc sĩ', 2, '2025-03-30 11:52:22', '2025-03-30 11:52:22'),
('GV005', 'Hoàng', 'Văn E', 'vane@example.com', 'Số 1 Giải Phóng, Hai Bà Trưng, Hà Nội', '1978-09-10', '0123456793', 1, 'Tiến sĩ', 3, '2025-03-30 11:52:22', '2025-03-30 11:52:22'),
('GV007', 'Vũ', 'Văn G', 'vang@example.com', 'Số 58 Lê Thanh Nghị, Hai Bà Trưng, Hà Nội', '1976-04-05', '0123456795', 1, 'Tiến sĩ', 4, '2025-03-30 11:52:22', '2025-03-30 11:52:22'),
('GV100', 'TRẦN', 'Mạch Điện', 'md@gmail.com', 'Huyện Bù Đốp', '1987-06-02', '0900876527', 0, 'Giáo Sư', 5, '2025-04-16 05:59:00', '2025-04-16 05:59:00'),
('GV202', 'Lâm', 'Trần Vũ', 'tranvu@example.com', 'Số 200 Lê Thanh Nghị, Hai Bà Trưng, Hà Nội', '1984-08-18', '0965765861', 0, 'Thạc sĩ', 2, '2025-03-31 14:20:16', '2025-03-31 14:21:37'),
('GV293', 'TRẦN', 'Thịnh ', 'TT@gmail.com', 'Huyện Bù Đốp', '2000-02-02', '+84965765861', 0, 'Thạc Sĩ', 3, '2025-04-13 13:52:17', '2025-04-13 13:52:39');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `instructor_assignments`
--

DROP TABLE IF EXISTS `instructor_assignments`;
CREATE TABLE IF NOT EXISTS `instructor_assignments` (
  `subject_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `instructor_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`subject_id`,`instructor_id`),
  KEY `fk_assignment_instructor` (`instructor_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `instructor_assignments`
--

INSERT INTO `instructor_assignments` (`subject_id`, `instructor_id`, `created_at`, `updated_at`) VALUES
('CHKT01', 'GV007', '2025-04-16 05:42:49', '2025-04-16 05:42:49'),
('CSDL01', 'GV007', '2025-03-30 11:52:22', '2025-04-16 04:44:55'),
('DA', 'GV001', '2025-03-30 11:52:22', '2025-04-16 04:45:20'),
('ENG01', 'GV005', '2025-03-30 11:52:22', '2025-03-30 11:52:22'),
('JAVA01', 'GV002', '2025-03-30 11:52:22', '2025-03-30 11:52:22'),
('MD01', 'GV100', '2025-04-16 05:59:13', '2025-04-16 05:59:13');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `students`
--

DROP TABLE IF EXISTS `students`;
CREATE TABLE IF NOT EXISTS `students` (
  `id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `first_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `birth_day` date NOT NULL,
  `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `gender` tinyint(1) NOT NULL,
  `academic_year` int NOT NULL,
  `class_id` bigint DEFAULT NULL,
  `department_id` bigint NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_student_email` (`email`),
  UNIQUE KEY `uk_student_phone` (`phone`),
  KEY `fk_student_class` (`class_id`),
  KEY `fk_student_department` (`department_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `students`
--

INSERT INTO `students` (`id`, `first_name`, `last_name`, `email`, `address`, `birth_day`, `phone`, `gender`, `academic_year`, `class_id`, `department_id`, `created_at`, `updated_at`) VALUES
('dh02996772', 'TRẦN', 'THÁI TUẤN', 'emalimoi@gmail.com', 'NHA BE', '2002-10-02', '0989689630', 1, 2024, 4, 1, '2025-04-09 10:38:40', '2025-04-09 10:38:40'),
('dh52003232', 'lâm', 'vũ', 'vu0916449261@gmail.com', 'Huyện Bù Đốp', '2002-02-01', '0916449529', 0, 2024, 3, 1, '2025-04-09 10:36:38', '2025-04-09 10:36:38'),
('DH52004312', 'Nguyễn', 'Trần Lâm Vũ ', 'vuntl@example.com', 'Bình Phước', '2002-06-05', '0988934568', 0, 2020, 1, 1, '2025-03-30 11:52:22', '2025-03-30 11:52:22'),
('DH52004489', 'Nguyễn', 'HỒNG THIÊN ', 'HTHIEN@example.com', 'Bình Phước', '2002-06-05', '0902934568', 0, 2020, 1, 1, '0000-00-00 00:00:00', '2025-04-11 21:03:50'),
('DH5201111111', 'Nguyen', 'Vũ', 'vu0965765861@gmail.com', 'Huyện Bù Đốp', '2002-05-06', '+84965765861', 0, 2024, 5, 3, '0000-00-00 00:00:00', '2025-04-09 09:31:22'),
('DH520111222', 'navigate', 'nvigatetest', 'nvigatetest@gmail.com', 'Huyện Bù Đốp', '2003-01-02', '0900283345', 1, 2025, 1, 1, '2025-04-10 05:36:42', '2025-04-10 05:36:42'),
('DH52106879', 'Thúi', 'Vi', 'DH52106879@gmail.com', 'quận 8', '2003-03-02', '0702039211', 1, 2024, 1, 1, '0000-00-00 00:00:00', '2025-04-09 10:54:25');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `student_registrations`
--

DROP TABLE IF EXISTS `student_registrations`;
CREATE TABLE IF NOT EXISTS `student_registrations` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `subject_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `student_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_student_subject` (`student_id`,`subject_id`),
  KEY `fk_registration_subject` (`subject_id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `student_registrations`
--

INSERT INTO `student_registrations` (`id`, `subject_id`, `student_id`, `created_at`, `updated_at`) VALUES
(6, 'DA', 'DH52004312', '2025-03-30 11:52:22', '2025-03-30 11:52:22'),
(8, 'CHKT01', 'DH5201111111', '2025-03-30 11:52:22', '2025-03-30 11:52:22'),
(16, 'DA', 'DH520111222', '2025-04-15 08:19:17', '2025-04-15 08:19:17'),
(20, 'ENG01', 'DH52004489', '2025-04-15 22:35:52', '2025-04-15 22:35:52'),
(21, 'MD01', 'DH520111222', '2025-04-15 22:55:15', '2025-04-15 22:55:15'),
(22, 'KTCB', 'DH52106879', '2025-04-15 23:02:03', '2025-04-15 23:02:03');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `subjects`
--

DROP TABLE IF EXISTS `subjects`;
CREATE TABLE IF NOT EXISTS `subjects` (
  `id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `semester` int NOT NULL,
  `credits` smallint NOT NULL,
  `process_percentage` smallint NOT NULL,
  `midterm_percentage` smallint NOT NULL,
  `final_percentage` smallint NOT NULL,
  `department_id` bigint NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_subject_department` (`department_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `subjects`
--

INSERT INTO `subjects` (`id`, `name`, `semester`, `credits`, `process_percentage`, `midterm_percentage`, `final_percentage`, `department_id`, `created_at`, `updated_at`) VALUES
('CHKT01', 'Cơ học kỹ thuật', 2, 2, 20, 30, 50, 4, '2025-03-30 11:52:22', '2025-04-15 12:47:34'),
('CSDL01', 'Cơ sở dữ liệu', 1, 3, 20, 30, 50, 1, '2025-03-30 11:52:22', '2025-04-15 12:47:44'),
('DA', 'Đồ án', 2, 5, 20, 30, 50, 1, '2025-04-15 06:03:25', '2025-04-15 06:03:25'),
('ENG01', 'Tiếng Anh cơ bản', 1, 3, 20, 30, 50, 3, '2025-03-30 11:52:22', '2025-04-15 12:47:50'),
('ENG2', 'Tiếng Anh 2', 2, 2, 20, 30, 50, 3, '2025-04-11 08:16:39', '2025-04-15 12:48:01'),
('JAVA01', 'Lập trình Java', 1, 3, 20, 30, 50, 1, '2025-03-30 11:52:22', '2025-04-15 12:48:09'),
('KTCB', 'Kinh tế cơ bản', 1, 2, 20, 30, 50, 2, '2025-04-15 23:01:53', '2025-04-15 23:01:53'),
('KTLT', 'Ky thuật lập trình', 1, 2, 20, 30, 50, 1, '2025-04-11 08:18:40', '2025-04-15 12:48:13'),
('MD01', 'Mạch điện', 1, 3, 20, 30, 50, 5, '2025-03-30 11:52:22', '2025-04-15 12:48:18');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `first_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `username` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`id`, `first_name`, `last_name`, `username`, `password`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'Admin', 'System', 'admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '2025-03-30 11:52:22', '2025-03-30 11:52:22', NULL),
(2, 'User', 'Test', 'user', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '2025-03-30 11:52:22', '2025-03-30 11:52:22', NULL);

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `classes`
--
ALTER TABLE `classes`
  ADD CONSTRAINT `fk_class_department` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_class_instructor` FOREIGN KEY (`host_instructor_id`) REFERENCES `instructors` (`id`) ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `grades`
--
ALTER TABLE `grades`
  ADD CONSTRAINT `fk_grade_instructor` FOREIGN KEY (`by_instructor_id`) REFERENCES `instructors` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_grade_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_grade_subject` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `instructors`
--
ALTER TABLE `instructors`
  ADD CONSTRAINT `fk_instructor_department` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `instructor_assignments`
--
ALTER TABLE `instructor_assignments`
  ADD CONSTRAINT `fk_assignment_instructor` FOREIGN KEY (`instructor_id`) REFERENCES `instructors` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_assignment_subject` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `students`
--
ALTER TABLE `students`
  ADD CONSTRAINT `fk_student_class` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_student_department` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `student_registrations`
--
ALTER TABLE `student_registrations`
  ADD CONSTRAINT `fk_registration_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_registration_subject` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `subjects`
--
ALTER TABLE `subjects`
  ADD CONSTRAINT `fk_subject_department` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
