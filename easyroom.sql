SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = 'Asia/Bangkok';
SET NAMES 'utf8mb4' COLLATE 'utf8mb4_unicode_ci';

USE easyroom;

-- สำหรับ login

CREATE TABLE `user` (
  `username`  varchar(8) NOT NULL,
  `password`  varchar(255) NOT NULL,
  `role`      enum('ผู้ดูแลห้อง','อาจารย์','นิสิต','ผู้บริหาร') NOT NULL,

  PRIMARY KEY (`username`)

) ENGINE=InnoDB 
  DEFAULT CHARSET=utf8mb4 
  COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table `Users_accounts`
INSERT INTO `user`
(`username`, `password`, `role`)
VALUES
('64312995','1234','นิสิต'),
('65312994','1234','นิสิต'),
('65312997','1234','นิสิต'),
('ADCS5624','1234','ผู้ดูแลห้อง'),
('ADCS7823','1234','ผู้ดูแลห้อง'),
('CS653129','1234','อาจารย์'),
('CS663129','1234','อาจารย์'),
('CS673129','1234','อาจารย์');

-- END table: user

-- --------------------------------------------------------
-- Table structure for w `student`
-- --------------------------------------------------------
CREATE TABLE `student` (
  `student_id`   varchar(8)  NOT NULL,
  `full_name`    varchar(100) NOT NULL,
  `department`   varchar(100) NOT NULL,
  `faculty`      varchar(100) NOT NULL,
  `study_year`   int NOT NULL,
  `degree`       enum('ปริญญาตรี','ปริญญาโท','ปริญญาเอก') NOT NULL,
  `email`        varchar(100) NOT NULL,
  `phone_number` varchar(10)  NOT NULL,
  `role`       enum('นิสิต') NOT NULL,

  PRIMARY KEY (`student_id`)

) ENGINE=InnoDB 
  DEFAULT CHARSET=utf8mb4 
  COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table `student`
INSERT INTO `student` (`student_id`, `full_name`, `department`, `faculty`, `study_year`, `degree`, `email`, `phone_number`, `role`) VALUES
('64312995', 'สุกานดา ศรีประเสริฐ', 'เทคโนโลยีสารสนเทศ', 'คณะวิทยาศาสตร์', 4, 'ปริญญาตรี', 'sukanda.s@example.com', '0814567890', 'นิสิต'),
('64312998', 'เกรียงไกร วิชชุภักดี', 'เทคโนโลยีสารสนเทศ', 'คณะวิทยาศาสตร์', 4, 'ปริญญาตรี', 'kriengkhai.w@example.com', '0817890123', 'นิสิต'),
('64313001', 'พิมพ์ชนก ลีลาชัย', 'เทคโนโลยีสารสนเทศ', 'คณะวิทยาศาสตร์', 4, 'ปริญญาตรี', 'phimchanok.l@example.com', '0820123456', 'นิสิต'),
('64313005', 'รติพร บุญส่ง', 'วิทยาการคอมพิวเตอร์', 'คณะวิทยาศาสตร์', 4, 'ปริญญาตรี', 'ratiporn.b@example.com', '0824567890', 'นิสิต'),
('64313012', 'กิตติพงษ์ กองแก้ว', 'วิทยาการข้อมูล', 'คณะวิทยาศาสตร์', 4, 'ปริญญาตรี', 'kittipong.k@example.com', '0831234567', 'นิสิต'),
('65312994', 'สมหญิง รุ่งโรจน์', 'วิทยาการข้อมูล', 'คณะวิทยาศาสตร์', 3, 'ปริญญาตรี', 'somhun.r@example.com', '0813456789', 'นิสิต'),
('65312997', 'นภัสวรรณ บัวทอง', 'วิทยาการข้อมูล', 'คณะวิทยาศาสตร์', 3, 'ปริญญาตรี', 'napatsawan.b@example.com', '0816789012', 'นิสิต'),
('65313000', 'ธนากร สุดใจ', 'วิทยาการข้อมูล', 'คณะวิทยาศาสตร์', 3, 'ปริญญาตรี', 'thanakorn.s@example.com', '0819012345', 'นิสิต'),
('65313003', 'ปิยาพร มั่นคง', 'วิทยาการข้อมูล', 'คณะวิทยาศาสตร์', 3, 'ปริญญาตรี', 'piyaporn.m@example.com', '0822345678', 'นิสิต'),
('65313006', 'ดวงใจ กาญจนารักษ์', 'วิทยาการข้อมูล', 'คณะวิทยาศาสตร์', 3, 'ปริญญาตรี', 'duangjai.k@example.com', '0825678901', 'นิสิต'),
('65313009', 'ศิริรัตน์ สมบัติ', 'วิทยาการข้อมูล', 'คณะวิทยาศาสตร์', 3, 'ปริญญาตรี', 'sirirat.s@example.com', '0828901234', 'นิสิต'),
('66312993', 'สมชาย พันธ์ดี', 'วิทยาการคอมพิวเตอร์', 'คณะวิทยาศาสตร์', 2, 'ปริญญาตรี', 'somchai.p@example.com', '0812345678', 'นิสิต'),
('66312996', 'อภิชาติ สุขสม', 'วิทยาการคอมพิวเตอร์', 'คณะวิทยาศาสตร์', 2, 'ปริญญาตรี', 'apichat.s@example.com', '0815678901', 'นิสิต'),
('66313004', 'วัชรินทร์ ศรีนวล', 'เทคโนโลยีสารสนเทศ', 'คณะวิทยาศาสตร์', 2, 'ปริญญาตรี', 'watcharin.s@example.com', '0823456789', 'นิสิต'),
('66313007', 'ธนภัทร พานิช', 'เทคโนโลยีสารสนเทศ', 'คณะวิทยาศาสตร์', 2, 'ปริญญาตรี', 'thanapat.p@example.com', '0826789012', 'นิสิต'),
('66313010', 'อมรเทพ ไชยวัฒน์', 'เทคโนโลยีสารสนเทศ', 'คณะวิทยาศาสตร์', 2, 'ปริญญาตรี', 'amorntep.c@example.com', '0829012345', 'นิสิต'),
('67312999', 'เมธาวี จันทรา', 'วิทยาการคอมพิวเตอร์', 'คณะวิทยาศาสตร์', 1, 'ปริญญาตรี', 'methawi.c@example.com', '0818901234', 'นิสิต'),
('67313002', 'อรพรรณ แสงสุริยะ', 'วิทยาการคอมพิวเตอร์', 'คณะวิทยาศาสตร์', 1, 'ปริญญาตรี', 'orapan.s@example.com', '0821234567', 'นิสิต'),
('67313008', 'พุฒิพงษ์ เพ็ชรชม', 'วิทยาการคอมพิวเตอร์', 'คณะวิทยาศาสตร์', 1, 'ปริญญาตรี', 'puttipong.p@example.com', '0827890123', 'นิสิต'),
('67313011', 'บุญช่วย ศรีสวัสดิ์', 'วิทยาการคอมพิวเตอร์', 'คณะวิทยาศาสตร์', 1, 'ปริญญาตรี', 'bunchuai.s@example.com', '0830123456', 'นิสิต');

-- END table: student

-- --------------------------------------------------------
-- Table structure for table `teacher`
-- --------------------------------------------------------
CREATE TABLE `teacher` (
  `teacher_id`   varchar(8)  NOT NULL,
  `full_name`    varchar(100) NOT NULL,
  `department`   varchar(100) NOT NULL,
  `faculty`      varchar(100) NOT NULL,
  `email`        varchar(100) NOT NULL,
  `phone_number` varchar(10)  NOT NULL,
  `role`       enum('อาจารย์') NOT NULL,

  PRIMARY KEY (`teacher_id`)

) ENGINE=InnoDB 
  DEFAULT CHARSET=utf8mb4 
  COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table `teacher`
INSERT INTO `teacher` (`teacher_id`, `full_name`, `department`, `faculty`, `email`, `phone_number`, `role`) VALUES
('CS653129', 'สมชาย พันธ์ดี', 'วิทยาการคอมพิวเตอร์', 'คณะวิทยาศาสตร์', 'somchai.p.teacher@example.com', '0912345678', 'อาจารย์'),
('CS663129', 'อภิชาติ สุขสม', 'วิทยาการคอมพิวเตอร์', 'คณะวิทยาศาสตร์', 'apichat.s.teacher@example.com', '0915678901', 'อาจารย์'),
('CS673129', 'เมธาวี จันทรา', 'วิทยาการคอมพิวเตอร์', 'คณะวิทยาศาสตร์', 'methawi.c.teacher@example.com', '0918901234', 'อาจารย์'),
('CS673131', 'อรพรรณ แสงสุริยะ', 'วิทยาการคอมพิวเตอร์', 'คณะวิทยาศาสตร์', 'orapan.s.teacher@example.com', '0921234567', 'อาจารย์'),
('DS653129', 'สมหญิง รุ่งโรจน์', 'วิทยาการข้อมูล', 'คณะวิทยาศาสตร์', 'somhun.r.teacher@example.com', '0913456789', 'อาจารย์'),
('DS663129', 'นภัสวรรณ บัวทอง', 'วิทยาการข้อมูล', 'คณะวิทยาศาสตร์', 'napatsawan.b.teacher@example.com', '0916789012', 'อาจารย์'),
('DS673130', 'อาร์ม เพื่อน', 'วิทยาการข้อมูล', 'คณะวิทยาศาสตร์', 'thanakorn.s.teacher@example.com', '0919012345', 'อาจารย์'),
('IT653129', 'สุกานดา ศรีประเสริฐ', 'เทคโนโลยีสารสนเทศ', 'คณะวิทยาศาสตร์', 'sukanda.s.teacher@example.com', '0914567890', 'อาจารย์'),
('IT663129', 'เกรียงไกร วิชชุภักดี', 'เทคโนโลยีสารสนเทศ', 'คณะวิทยาศาสตร์', 'kriengkhai.w.teacher@example.com', '0917890123', 'อาจารย์'),
('IT673130', 'พิมพ์ชนก ลีลาชัย', 'เทคโนโลยีสารสนเทศ', 'คณะวิทยาศาสตร์', 'phimchanok.l.teacher@example.com', '0920123456', 'อาจารย์');

-- END table: teacher

-- --------------------------------------------------------
-- Table structure for table `admin`
-- --------------------------------------------------------
CREATE TABLE `admin` (
  `admin_id`      varchar(8)      NOT NULL,
  `full_name`     varchar(100)    NOT NULL,
  `department`    varchar(100)    NOT NULL,
  `faculty`       varchar(100)    NOT NULL,
  `email`         varchar(100)    NOT NULL,
  `phone_number`  varchar(10)     NOT NULL,
  `role`        enum('ผู้ดูแลห้อง') NOT NULL,

  PRIMARY KEY (`admin_id`)

) ENGINE=InnoDB 
  DEFAULT CHARSET=utf8mb4 
  COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table `admin`
INSERT INTO `admin` 
(`admin_id`, `full_name`, `department`, `faculty`, `email`, `phone_number`, `role`) VALUES
('ADCS5624', 'นายธราศักดิ์ ชุนกองฮอง', 'วิทยาการคอมพิวเตอร์', 'คณะวิทยาศาสตร์', 'tharasak@nu.ac.th', '0865423654', 'ผู้ดูแลห้อง'),
('ADCS7823', 'นายยุทธพงษ์ คงถาวร', 'วิทยาการคอมพิวเตอร์', 'คณะวิทยาศาสตร์', 'yutthapong@nu.ac.th', '0562314598', 'ผู้ดูแลห้อง');

-- END table: admin

-- --------------------------------------------------------
-- Table structure for table `executive`
-- --------------------------------------------------------
CREATE TABLE `executive` (
  `executive_id`  varchar(8)   NOT NULL,
  `full_name`          varchar(100) NOT NULL,
  `department`    varchar(100) NOT NULL,
  `faculty`       varchar(100) NOT NULL,
  `email`         varchar(100) NOT NULL,
  `phone_number`  varchar(10)  NOT NULL,
  `role`        enum('ผู้บริหาร') NOT NULL,

  PRIMARY KEY (`executive_id`)

) ENGINE=InnoDB 
  DEFAULT CHARSET=utf8mb4 
  COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table `executive`
INSERT INTO `executive`
(`executive_id`, `full_name`, `department`, `faculty`, `email`, `phone_number`, `role`)
VALUES
('CSB25645', 'วุฒิพงศ์ เรือนทอง', 'วิทยาการคอมพิวเตอร์', 'คณะวิทยาศาสตร์', 'wuttipong@nu.ac.th', '0568951223', 'ผู้บริหาร');

-- END table: executive


-- --------------------------------------------------------
-- Table structure for table `room_type`
-- --------------------------------------------------------
CREATE TABLE `room_type` (
  `room_type_id` int NOT NULL AUTO_INCREMENT,
  `type_name`     enum('ห้องเลคเชอร์', 'ห้องปฎิบัติการ', 'Co-working Space', 'Studio Room') NOT NULL,

  PRIMARY KEY (`room_type_id`)

) ENGINE=InnoDB 
  DEFAULT CHARSET=utf8mb4 
  COLLATE=utf8mb4_0900_ai_ci
  AUTO_INCREMENT=5;

-- Dumping data for table `room_type`
INSERT INTO `room_type`
(`room_type_id`, `type_name`)
VALUES
(1, 'ห้องเลคเชอร์'),
(2, 'ห้องปฎิบัติการ'),
(3, 'Co-working Space'),
(4, 'Studio Room');

-- END table: room_type

-- --------------------------------------------------------
-- Table structure for table `room`
-- --------------------------------------------------------
CREATE TABLE `room` (
  `room_id`   varchar(6)  NOT NULL,
  `room_name` varchar(10) NOT NULL,
  `floor`     enum('2','3','4') NOT NULL,
  `room_status` enum('เปิดการใช้งาน', 'ปิดการใช้งาน') NOT NULL,
  `room_type_id` int NOT NULL,

  PRIMARY KEY (`room_id`),
  FOREIGN KEY (`room_type_id`) REFERENCES `room_type` (`room_type_id`)

) ENGINE=InnoDB 
  DEFAULT CHARSET=utf8mb4 
  COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table `room`
INSERT INTO `room` (`room_id`, `room_name`, `floor`, `room_status`, `room_type_id`) VALUES
('212', 'SC2-212', '2', 'ปิดการใช้งาน', 1),
('307', 'SC2-307', '3', 'เปิดการใช้งาน', 2),
('308', 'SC2-308', '3', 'ปิดการใช้งาน', 2),
('311', 'SC2-311', '3', 'ปิดการใช้งาน', 3),
('313', 'SC2-313', '3', 'ปิดการใช้งาน', 2),
('313-1', 'SC2-313-1', '3', 'ปิดการใช้งาน', 2),
('407', 'SC2-407', '4', 'ปิดการใช้งาน', 1),
('411', 'SC2-411', '4', 'เปิดการใช้งาน', 4),
('414', 'SC2-414', '4', 'เปิดการใช้งาน', 2);

-- END table: room

-- --------------------------------------------------------
-- Table structure for table `room_schedule`
-- --------------------------------------------------------
CREATE TABLE `room_schedule` (
  `room_schedule_id` int NOT NULL AUTO_INCREMENT,
  `room_id`         varchar(6)  NOT NULL,
  `week_day`        enum('จันทร์','อังคาร','พุธ','พฤหัสบดี','ศุกร์','เสาร์','อาทิตย์') DEFAULT NULL,
  `schedule_date`   date NULL,
  `start_time`       time        NOT NULL,
  `end_time`         time        NOT NULL,
  `room_status`     enum('มีเรียน','ว่าง','ไม่ว่าง','กำลังปรับปรุง') DEFAULT NULL,
  
  PRIMARY KEY (`room_schedule_id`),
  FOREIGN KEY (`room_id`) REFERENCES `room` (`room_id`)

) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_0900_ai_ci
  AUTO_INCREMENT=86;

-- Dumping data for table `room_schedule`
INSERT INTO `room_schedule` (`room_schedule_id`, `room_id`, `week_day`, `schedule_date`, `start_time`, `end_time`, `room_status`) VALUES
(1, '307', 'จันทร์', NULL, '10:00:00', '11:00:00', 'มีเรียน'),
(2, '307', 'จันทร์', NULL, '11:00:00', '12:00:00', 'มีเรียน'),
(3, '307', 'จันทร์', NULL, '13:00:00', '14:00:00', 'มีเรียน'),
(4, '307', 'จันทร์', NULL, '14:00:00', '15:00:00', 'มีเรียน'),
(5, '307', 'จันทร์', NULL, '15:00:00', '16:00:00', 'มีเรียน'),
(6, '307', 'จันทร์', NULL, '16:00:00', '17:00:00', 'มีเรียน'),
(7, '307', 'อังคาร', NULL, '08:00:00', '09:00:00', 'มีเรียน'),
(8, '307', 'อังคาร', NULL, '09:00:00', '10:00:00', 'มีเรียน'),
(9, '307', 'อังคาร', NULL, '13:00:00', '14:00:00', 'มีเรียน'),
(10, '307', 'อังคาร', NULL, '14:00:00', '15:00:00', 'มีเรียน'),
(11, '307', 'อังคาร', NULL, '15:00:00', '16:00:00', 'มีเรียน'),
(12, '307', 'อังคาร', NULL, '16:00:00', '17:00:00', 'มีเรียน'),
(13, '307', 'พุธ', NULL, '08:00:00', '09:00:00', 'มีเรียน'),
(14, '307', 'พุธ', NULL, '09:00:00', '10:00:00', 'มีเรียน'),
(15, '307', 'พุธ', NULL, '10:00:00', '11:00:00', 'มีเรียน'),
(16, '307', 'พุธ', NULL, '11:00:00', '12:00:00', 'มีเรียน'),
(17, '307', 'พุธ', NULL, '13:00:00', '14:00:00', 'มีเรียน'),
(18, '307', 'พุธ', NULL, '14:00:00', '15:00:00', 'มีเรียน'),
(19, '307', 'พุธ', NULL, '15:00:00', '16:00:00', 'มีเรียน'),
(20, '307', 'พุธ', NULL, '16:00:00', '17:00:00', 'มีเรียน'),
(21, '307', 'พฤหัสบดี', NULL, '08:00:00', '09:00:00', 'มีเรียน'),
(22, '307', 'พฤหัสบดี', NULL, '09:00:00', '10:00:00', 'มีเรียน'),
(23, '307', 'พฤหัสบดี', NULL, '10:00:00', '11:00:00', 'มีเรียน'),
(24, '307', 'พฤหัสบดี', NULL, '11:00:00', '12:00:00', 'มีเรียน'),
(25, '307', 'พฤหัสบดี', NULL, '13:00:00', '14:00:00', 'มีเรียน'),
(26, '307', 'พฤหัสบดี', NULL, '14:00:00', '15:00:00', 'มีเรียน'),
(27, '307', 'พฤหัสบดี', NULL, '15:00:00', '16:00:00', 'มีเรียน'),
(28, '307', 'พฤหัสบดี', NULL, '16:00:00', '17:00:00', 'มีเรียน'),
(29, '307', 'ศุกร์', NULL, '10:00:00', '11:00:00', 'มีเรียน'),
(30, '307', 'ศุกร์', NULL, '11:00:00', '12:00:00', 'มีเรียน'),
(31, '307', 'ศุกร์', NULL, '15:00:00', '16:00:00', 'มีเรียน'),
(32, '307', 'ศุกร์', NULL, '16:00:00', '17:00:00', 'มีเรียน'),
(33, '307', 'อังคาร', '2025-02-25', '10:00:00', '11:00:00', 'กำลังปรับปรุง'),
(34, '307', 'อังคาร', '2025-02-25', '11:00:00', '12:00:00', 'กำลังปรับปรุง'),
(35, '307', 'ศุกร์', '2025-02-28', '08:00:00', '09:00:00', 'กำลังปรับปรุง'),
(36, '307', 'ศุกร์', '2025-02-28', '09:00:00', '10:00:00', 'กำลังปรับปรุง'),
(37, '414', 'จันทร์', NULL, '10:00:00', '11:00:00', 'มีเรียน'),
(38, '414', 'จันทร์', NULL, '11:00:00', '12:00:00', 'มีเรียน'),
(39, '414', 'อังคาร', NULL, '13:00:00', '14:00:00', 'มีเรียน'),
(40, '414', 'อังคาร', NULL, '14:00:00', '15:00:00', 'มีเรียน'),
(41, '414', 'อังคาร', NULL, '15:00:00', '16:00:00', 'มีเรียน'),
(42, '414', 'อังคาร', NULL, '16:00:00', '17:00:00', 'มีเรียน'),
(43, '414', 'พุธ', NULL, '08:00:00', '09:00:00', 'มีเรียน'),
(44, '414', 'พุธ', NULL, '09:00:00', '10:00:00', 'มีเรียน'),
(45, '414', 'พุธ', NULL, '10:00:00', '11:00:00', 'มีเรียน'),
(46, '414', 'พุธ', NULL, '11:00:00', '12:00:00', 'มีเรียน'),
(47, '414', 'พุธ', NULL, '13:00:00', '14:00:00', 'มีเรียน'),
(48, '414', 'พุธ', NULL, '14:00:00', '15:00:00', 'มีเรียน'),
(49, '414', 'พุธ', NULL, '15:00:00', '16:00:00', 'มีเรียน'),
(50, '414', 'พุธ', NULL, '16:00:00', '17:00:00', 'มีเรียน'),
(51, '414', 'พฤหัสบดี', NULL, '08:00:00', '09:00:00', 'มีเรียน'),
(52, '414', 'พฤหัสบดี', NULL, '09:00:00', '10:00:00', 'มีเรียน'),
(53, '414', 'พฤหัสบดี', NULL, '10:00:00', '11:00:00', 'มีเรียน'),
(54, '414', 'พฤหัสบดี', NULL, '11:00:00', '12:00:00', 'มีเรียน'),
(55, '414', 'พฤหัสบดี', NULL, '13:00:00', '14:00:00', 'มีเรียน'),
(56, '414', 'พฤหัสบดี', NULL, '14:00:00', '15:00:00', 'มีเรียน'),
(57, '414', 'พฤหัสบดี', NULL, '15:00:00', '16:00:00', 'มีเรียน'),
(58, '414', 'พฤหัสบดี', NULL, '16:00:00', '17:00:00', 'มีเรียน'),
(59, '414', 'ศุกร์', NULL, '08:00:00', '09:00:00', 'มีเรียน'),
(60, '414', 'ศุกร์', NULL, '09:00:00', '10:00:00', 'มีเรียน'),
(61, '414', 'ศุกร์', NULL, '10:00:00', '11:00:00', 'มีเรียน'),
(62, '414', 'ศุกร์', NULL, '11:00:00', '12:00:00', 'มีเรียน'),
(63, '414', 'ศุกร์', NULL, '13:00:00', '14:00:00', 'มีเรียน'),
(64, '414', 'ศุกร์', NULL, '14:00:00', '15:00:00', 'มีเรียน'),
(65, '414', 'ศุกร์', NULL, '15:00:00', '16:00:00', 'มีเรียน'),
(66, '414', 'ศุกร์', NULL, '16:00:00', '17:00:00', 'มีเรียน'),
(67, '414', 'จันทร์', '2025-02-24', '10:00:00', '11:00:00', 'กำลังปรับปรุง'),
(68, '414', 'จันทร์', '2025-02-24', '11:00:00', '12:00:00', 'กำลังปรับปรุง'),
(69, '414', 'อังคาร', '2025-02-25', '12:00:00', '13:00:00', 'กำลังปรับปรุง'),
(86, '414', 'เสาร์', '2025-02-25', '15:00:00', '16:00:00', 'ว่าง'),
(87, '414', 'เสาร์', '2025-02-25', '16:00:00', '17:00:00', 'ว่าง'),
(88, '307', 'เสาร์', '2025-02-25', '16:00:00', '17:00:00', 'ว่าง'),
(89, '307', 'อังคาร', '2025-02-25', '18:00:00', '19:00:00', 'กำลังปรับปรุง'),
(90, '307', 'พุธ', '2025-02-25', '18:00:00', '19:00:00', 'กำลังปรับปรุง'),
(91, '307', 'เสาร์', '2025-02-25', '18:00:00', '19:00:00', 'กำลังปรับปรุง'),
(92, '307', 'พฤหัสบดี', '2025-02-25', '18:00:00', '19:00:00', 'กำลังปรับปรุง'),
(93, '307', 'ศุกร์', '2025-02-25', '18:00:00', '19:00:00', 'กำลังปรับปรุง'),
(94, '308', 'พฤหัสบดี', '2025-02-25', '13:00:00', '14:00:00', 'กำลังปรับปรุง'),
(95, '308', 'พฤหัสบดี', '2025-02-25', '14:00:00', '15:00:00', 'กำลังปรับปรุง'),
(96, '308', 'พฤหัสบดี', '2025-02-25', '15:00:00', '16:00:00', 'กำลังปรับปรุง');

-- END table: room_schedule

-- --------------------------------------------------------
-- Table structure for table `equipment`
-- --------------------------------------------------------
CREATE TABLE `equipment` (
  `equipment_id`   int          NOT NULL AUTO_INCREMENT,
  `equipment_name` varchar(100) NOT NULL,

  PRIMARY KEY (`equipment_id`)

) ENGINE=InnoDB 
  DEFAULT CHARSET=utf8mb4 
  COLLATE=utf8mb4_0900_ai_ci
  AUTO_INCREMENT=18;

-- Dumping data for table `equipment`
INSERT INTO `equipment` (`equipment_id`, `equipment_name`) VALUES
(1, 'สายไฟ'),
(2, 'เก้าอี้'),
(3, 'โต๊ะ'),
(4, 'จอคอมพิวเตอร์'),
(5, 'โปรเจคเตอร์'),
(6, 'ทีวี'),
(7, 'เครื่องปรับอากาศ'),
(8, 'วิชวลไลเซอร์'),
(9, 'Hub'),
(10, 'Router'),
(11, 'Switch'),
(12, 'พอยเตอร์'),
(13, 'เม้าส์'),
(14, 'คีย์บอร์ด'),
(15, 'ปลั๊กไฟ'),
(16, 'เสียงไมค์'),
(17, 'คอมพิวเตอร์');

-- END table: equipment

-- --------------------------------------------------------
-- Table structure for table `equipment_management`
-- --------------------------------------------------------
CREATE TABLE `equipment_management` (
  `equipment_id`    int        NOT NULL,
  `room_id`         varchar(6) NOT NULL,
  `stock_quantity` int       NOT NULL,

  PRIMARY KEY (`equipment_id`,`room_id`),
  FOREIGN KEY (`equipment_id`) REFERENCES `equipment` (`equipment_id`),
  FOREIGN KEY (`room_id`) REFERENCES `room` (`room_id`)
 
) ENGINE=InnoDB 
  DEFAULT CHARSET=utf8mb4 
  COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table `equipment_management`
INSERT INTO `equipment_management` (`equipment_id`, `room_id`, `stock_quantity`) VALUES
(2, '212', 10),
(2, '311', 10),
(10, '308', 5),
(11, '308', 5),
(12, '212', 2),
(12, '307', 2),
(12, '414', 3),
(13, '307', 10),
(13, '308', 10),
(13, '414', 5),
(14, '307', 7),
(14, '308', 7),
(14, '414', 5),
(15, '212', 5),
(15, '307', 5),
(15, '308', 5),
(15, '311', 5),
(15, '414', 5);

-- END table: equipment_management

-- --------------------------------------------------------
-- Table structure for table `computer_management`
-- --------------------------------------------------------
CREATE TABLE `computer_management` (
  `computer_id`      int         NOT NULL,
  `room_id`         varchar(6)  NOT NULL,
  `computer_status`  enum('ใช้งานได้','ใช้งานไม่ได้') NOT NULL,

  PRIMARY KEY (`computer_id`, `room_id`),
  FOREIGN KEY (`room_id`) REFERENCES `room` (`room_id`)
  
) ENGINE=InnoDB 
  DEFAULT CHARSET=utf8mb4 
  COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table `computer_management`
INSERT INTO `computer_management` (`computer_id`, `room_id`, `computer_status`) VALUES
(1, '307', 'ใช้งานได้'),
(1, '414', 'ใช้งานไม่ได้'),
(2, '307', 'ใช้งานได้'),
(2, '414', 'ใช้งานไม่ได้'),
(3, '307', 'ใช้งานได้'),
(3, '414', 'ใช้งานไม่ได้'),
(4, '307', 'ใช้งานได้'),
(4, '414', 'ใช้งานไม่ได้'),
(5, '307', 'ใช้งานได้'),
(5, '414', 'ใช้งานได้'),
(6, '307', 'ใช้งานได้'),
(6, '414', 'ใช้งานได้'),
(7, '307', 'ใช้งานได้'),
(7, '414', 'ใช้งานได้'),
(8, '307', 'ใช้งานได้'),
(8, '414', 'ใช้งานได้'),
(9, '307', 'ใช้งานได้'),
(9, '414', 'ใช้งานได้'),
(10, '307', 'ใช้งานไม่ได้'),
(10, '414', 'ใช้งานไม่ได้'),
(11, '307', 'ใช้งานได้'),
(11, '414', 'ใช้งานได้'),
(12, '307', 'ใช้งานได้'),
(12, '414', 'ใช้งานได้'),
(13, '307', 'ใช้งานได้'),
(13, '414', 'ใช้งานได้'),
(14, '307', 'ใช้งานได้'),
(14, '414', 'ใช้งานได้'),
(15, '307', 'ใช้งานได้'),
(15, '414', 'ใช้งานได้'),
(16, '307', 'ใช้งานได้'),
(16, '414', 'ใช้งานได้'),
(17, '307', 'ใช้งานได้'),
(17, '414', 'ใช้งานได้'),
(18, '307', 'ใช้งานได้'),
(18, '414', 'ใช้งานได้'),
(19, '307', 'ใช้งานได้'),
(19, '414', 'ใช้งานได้'),
(20, '307', 'ใช้งานได้'),
(20, '414', 'ใช้งานได้'),
(21, '307', 'ใช้งานได้'),
(21, '414', 'ใช้งานได้'),
(22, '307', 'ใช้งานได้'),
(22, '414', 'ใช้งานได้'),
(23, '307', 'ใช้งานได้'),
(23, '414', 'ใช้งานได้'),
(24, '307', 'ใช้งานได้'),
(24, '414', 'ใช้งานได้'),
(25, '307', 'ใช้งานไม่ได้'),
(25, '414', 'ใช้งานไม่ได้'),
(26, '307', 'ใช้งานได้'),
(26, '414', 'ใช้งานได้'),
(27, '307', 'ใช้งานได้'),
(27, '414', 'ใช้งานได้'),
(28, '307', 'ใช้งานได้'),
(28, '414', 'ใช้งานได้'),
(29, '307', 'ใช้งานได้'),
(29, '414', 'ใช้งานได้'),
(30, '307', 'ใช้งานได้'),
(30, '414', 'ใช้งานได้'),
(31, '307', 'ใช้งานได้'),
(31, '414', 'ใช้งานได้'),
(32, '307', 'ใช้งานได้'),
(32, '414', 'ใช้งานได้'),
(33, '307', 'ใช้งานได้'),
(33, '414', 'ใช้งานได้'),
(34, '307', 'ใช้งานได้'),
(34, '414', 'ใช้งานได้'),
(35, '307', 'ใช้งานได้'),
(35, '414', 'ใช้งานได้'),
(36, '307', 'ใช้งานได้'),
(36, '414', 'ใช้งานได้'),
(37, '307', 'ใช้งานได้'),
(37, '414', 'ใช้งานได้'),
(38, '307', 'ใช้งานได้'),
(38, '414', 'ใช้งานได้'),
(39, '307', 'ใช้งานได้'),
(39, '414', 'ใช้งานได้'),
(40, '307', 'ใช้งานได้'),
(40, '414', 'ใช้งานได้'),
(41, '307', 'ใช้งานได้'),
(41, '414', 'ใช้งานได้'),
(42, '307', 'ใช้งานได้'),
(42, '414', 'ใช้งานได้'),
(43, '307', 'ใช้งานได้'),
(43, '414', 'ใช้งานได้'),
(44, '307', 'ใช้งานได้'),
(44, '414', 'ใช้งานได้'),
(45, '307', 'ใช้งานได้'),
(45, '414', 'ใช้งานได้'),
(46, '307', 'ใช้งานได้'),
(46, '414', 'ใช้งานได้'),
(47, '307', 'ใช้งานได้'),
(47, '414', 'ใช้งานไม่ได้'),
(48, '307', 'ใช้งานได้'),
(48, '414', 'ใช้งานได้'),
(49, '307', 'ใช้งานได้'),
(49, '414', 'ใช้งานได้'),
(50, '307', 'ใช้งานได้'),
(50, '414', 'ใช้งานได้'),
(51, '307', 'ใช้งานได้'),
(51, '414', 'ใช้งานได้'),
(52, '307', 'ใช้งานได้'),
(52, '414', 'ใช้งานได้'),
(53, '307', 'ใช้งานได้'),
(53, '414', 'ใช้งานได้'),
(54, '307', 'ใช้งานได้'),
(54, '414', 'ใช้งานได้'),
(55, '307', 'ใช้งานได้'),
(55, '414', 'ใช้งานได้'),
(56, '307', 'ใช้งานได้'),
(56, '414', 'ใช้งานได้'),
(57, '307', 'ใช้งานได้'),
(57, '414', 'ใช้งานได้'),
(58, '307', 'ใช้งานได้'),
(58, '414', 'ใช้งานได้'),
(59, '307', 'ใช้งานได้'),
(59, '414', 'ใช้งานได้'),
(60, '307', 'ใช้งานได้'),
(60, '414', 'ใช้งานไม่ได้'),
(61, '307', 'ใช้งานได้'),
(61, '414', 'ใช้งานได้'),
(62, '307', 'ใช้งานได้'),
(62, '414', 'ใช้งานได้'),
(63, '307', 'ใช้งานได้'),
(63, '414', 'ใช้งานได้'),
(64, '307', 'ใช้งานได้'),
(64, '414', 'ใช้งานได้'),
(65, '307', 'ใช้งานได้'),
(65, '414', 'ใช้งานได้'),
(66, '307', 'ใช้งานได้'),
(66, '414', 'ใช้งานได้'),
(67, '307', 'ใช้งานได้'),
(67, '414', 'ใช้งานได้'),
(68, '307', 'ใช้งานได้'),
(68, '414', 'ใช้งานได้'),
(69, '307', 'ใช้งานได้'),
(69, '414', 'ใช้งานได้'),
(70, '307', 'ใช้งานได้'),
(70, '414', 'ใช้งานได้'),
(71, '307', 'ใช้งานได้'),
(71, '414', 'ใช้งานได้'),
(72, '307', 'ใช้งานได้'),
(72, '414', 'ใช้งานได้'),
(73, '307', 'ใช้งานได้'),
(73, '414', 'ใช้งานได้'),
(74, '307', 'ใช้งานได้'),
(74, '414', 'ใช้งานได้'),
(75, '307', 'ใช้งานได้'),
(75, '414', 'ใช้งานได้'),
(76, '307', 'ใช้งานได้'),
(76, '414', 'ใช้งานได้'),
(77, '307', 'ใช้งานได้'),
(77, '414', 'ใช้งานไม่ได้'),
(78, '307', 'ใช้งานได้'),
(78, '414', 'ใช้งานไม่ได้'),
(79, '307', 'ใช้งานไม่ได้'),
(79, '414', 'ใช้งานไม่ได้'),
(80, '307', 'ใช้งานได้'),
(80, '414', 'ใช้งานได้');


-- END table: computer_management

CREATE TABLE `room_request` (
  `room_request_id` int NOT NULL,
  `submitted_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `room_id` varchar(6) NOT NULL,
  `student_id` varchar(8) DEFAULT NULL,
  `teacher_id` varchar(8) DEFAULT NULL,
  `used_date` date NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `request_type` enum('ในเวลา','นอกเวลา') NOT NULL,
  `admin_id` varchar(8) DEFAULT NULL,
  `executive_id` varchar(8) DEFAULT NULL,

  `request_reason` enum(
        'ขอใช้ห้องเพื่อติวหนังสือ',
        'ขอใช้ห้องเพื่อทำงาน',
        'ขอใช้ห้องเพื่อทำวิจัย',
        'ขอใช้ห้องเพื่อจัดกิจกรรมเสริมความรู้',
        'ขอใช้ห้องเพื่อกิจกรรมชมรม',
        'ขอใช้ห้องเพื่อเรียนออนไลน์',
        'ขอใช้ห้องเพื่อถ่ายทำวิดีโอ',
        'ขอใช้ห้องเพื่อวัตถุประสงค์อื่น ๆ') NOT NULL,

  `detail_request_reason` varchar(255) DEFAULT NULL,
  `reject_reason` enum(
        'จำนวนคนใช้ห้องน้อยเกินไป',
        'เหตุผลในการขอใช้ห้องไม่สมเหตุสมผล',
        'คำขอซ้ำซ้อน',
        'ห้องมีการบำรุงรักษาหรือติดตั้งอุปกรณ์ใหม่',
        'มีการใช้ห้องผิดประเภท',
        'มีคำขออื่นถูกอนุมัติแล้ว') DEFAULT NULL,

  `detail_reject_reason` varchar(255) DEFAULT NULL,
  `request_status` enum('รอดำเนินการ','รออนุมัติ','อนุมัติ','ไม่อนุมัติ') NOT NULL,

  PRIMARY KEY (`room_request_id`),
  FOREIGN KEY (`room_id`) REFERENCES `room` (`room_id`),
  FOREIGN KEY (`student_id`) REFERENCES `student` (`student_id`),
  FOREIGN KEY (`teacher_id`) REFERENCES `teacher` (`teacher_id`),
  FOREIGN KEY (`admin_id`) REFERENCES `admin` (`admin_id`),
  FOREIGN KEY (`executive_id`) REFERENCES `executive` (`executive_id`)

) ENGINE=InnoDB 
  DEFAULT CHARSET=utf8mb4 
  COLLATE=utf8mb4_0900_ai_ci;

-- END table: room_request

-- --------------------------------------------------------
-- Table structure for table `room_request_participant`
-- --------------------------------------------------------
CREATE TABLE `room_request_participant` (
  `room_request_participant_id` int NOT NULL AUTO_INCREMENT,
  `room_request_id` int NOT NULL,
  `student_id`       varchar(8) NULL,
  `teacher_id`       varchar(8) NULL,
  `role`          enum('ผู้ขอใช้', 'ผู้เข้าร่วม') NOT NULL,

  PRIMARY KEY (`room_request_participant_id`),
  FOREIGN KEY (`room_request_id`) REFERENCES `room_request` (`room_request_id`),
  FOREIGN KEY (`student_id`) REFERENCES `student` (`student_id`),
  FOREIGN KEY (`teacher_id`) REFERENCES `teacher` (`teacher_id`)

 
) ENGINE=InnoDB 
  DEFAULT CHARSET=utf8mb4 
  COLLATE=utf8mb4_0900_ai_ci;

-- END table: room_request_participant

-- --------------------------------------------------------
-- Table structure for table `room_request_equipment`
-- --------------------------------------------------------
CREATE TABLE `room_request_equipment` (
  `room_request_id` int NOT NULL,
  `equipment_id`     int NOT NULL,
  `request_quantity` int NOT NULL,
  `room_id`          varchar(6) NOT NULL,

  PRIMARY KEY (`room_request_id`,`equipment_id`),
  FOREIGN KEY (`room_request_id`) REFERENCES `room_request` (`room_request_id`),
  FOREIGN KEY (`equipment_id`) REFERENCES `equipment` (`equipment_id`),
  FOREIGN KEY (`room_id`) REFERENCES `room` (`room_id`),
  FOREIGN KEY (`equipment_id`, `room_id`) REFERENCES `equipment_management` (`equipment_id`, `room_id`)

) ENGINE=InnoDB 
  DEFAULT CHARSET=utf8mb4 
  COLLATE=utf8mb4_0900_ai_ci;

  -- --------------------------------------------------------
-- Table structure for table `room_request_computer`
-- --------------------------------------------------------
CREATE TABLE `room_request_computer` (
  `room_request_id` int        NOT NULL,
  `computer_id`       int        NOT NULL,
  `room_id`          varchar(6) NOT NULL,

  PRIMARY KEY (`room_request_id`,`computer_id`),
  FOREIGN KEY (`computer_id`, `room_id`) REFERENCES `computer_management` (`computer_id`, `room_id`),
  FOREIGN KEY (`room_request_id`) REFERENCES `room_request` (`room_request_id`),
  FOREIGN KEY (`room_id`) REFERENCES `room` (`room_id`)

) ENGINE=InnoDB 
  DEFAULT CHARSET=utf8mb4 
  COLLATE=utf8mb4_0900_ai_ci;

-- END table: room_request_computer

CREATE TABLE `equipment_brokened` (
  `repair_number` varchar(20) NOT NULL,
  `repair_date` datetime NOT NULL,
  `student_id` varchar(8) DEFAULT NULL,
  `teacher_id` varchar(8) DEFAULT NULL,
  `room_id` varchar(6) NOT NULL,
  `equipment_id` int NOT NULL,
  `computer_id` int DEFAULT NULL,
  `admin_id` varchar(8) DEFAULT NULL,
  `repair_status` enum('รอซ่อม','รับเรื่องแล้ว','กำลังจัดซื้อ','กำลังซ่อม','ซ่อมสำเร็จ') NOT NULL,
  `damage` enum('สายไฟชำรุด','สายไฟขาด','ปลั๊กไฟหลวม','ขาเก้าอี้หัก','เบาะชำรุด','พนักพิงหลุด','ขาโต๊ะหัก','พื้นโต๊ะมีรอย','โต๊ะโยก','หน้าจอไม่ติด','จอมีรอยแตก','ภาพไม่ชัด','โปรเจคเตอร์ไม่ติด','ภาพเบลอ','รีโมทไม่ทำงาน','ทีวีไม่ติด','เสียงไม่ออก','จอภาพไม่ชัด','ไม่มีความเย็น','มีน้ำหยด','เปิดไม่ติด','เครื่องไม่ทำงาน','ภาพไม่ขึ้น','พอร์ตไม่ทำงาน','ไฟไม่ติด','อุปกรณ์ไม่เชื่อมต่อ','ไม่มีสัญญาณ','เชื่อมต่อช้า','อุปกรณ์ไม่ตอบสนอง','ไฟสถานะไม่ขึ้น','แบตเตอรี่หมด','แสงไม่ออก','ปุ่มกดเสีย','ปุ่มคลิกไม่ทำงาน','ตัวชี้เมาส์ไม่ขยับ','สายเมาส์ชำรุด','ปุ่มกดไม่ติด','ปุ่มบางตัวหลุด','แสงไฟไม่ติด','ปลั๊กไฟชำรุด','สายไฟหลวม','ไฟไม่ออก','ไมค์ไม่มีเสียง','เสียงขาดหาย','ไมค์ไม่เชื่อมต่อ','เครื่องไม่เปิด','หน้าจอไม่แสดงผล','คีย์บอร์ดหรือเมาส์ไม่ตอบสนอง','จอฟ้า') NOT NULL,
  `damage_details` varchar(250) DEFAULT NULL,
  `image_path` varchar(250) NOT NULL,

  PRIMARY KEY (`repair_number`),
  FOREIGN KEY (`student_id`) REFERENCES `student` (`student_id`),
  FOREIGN KEY (`teacher_id`) REFERENCES `teacher` (`teacher_id`),
  FOREIGN KEY (`room_id`) REFERENCES `room` (`room_id`),
  FOREIGN KEY (`equipment_id`) REFERENCES `equipment` (`equipment_id`),
  FOREIGN KEY (`computer_id`) REFERENCES `computer_management` (`computer_id`),
  FOREIGN KEY (`admin_id`) REFERENCES `admin` (`admin_id`)

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `equipment_brokened`
--

INSERT INTO `equipment_brokened` (`repair_number`, `repair_date`, `student_id`, `teacher_id`, `room_id`, `equipment_id`, `computer_id`, `admin_id`, `repair_status`, `damage`, `damage_details`, `image_path`) VALUES
('212-3-14', '2025-02-28 22:44:28', '64312995', NULL, '212', 3, NULL, 'ADCS5624', 'ซ่อมสำเร็จ', 'ขาโต๊ะหัก', 'ขาโต้ะหัก 1 ข้าง', '64312995_14.jpg'),
('307-15-9', '2025-02-25 15:00:00', '65312997', NULL, '307', 15, NULL, NULL, 'กำลังซ่อม', 'ปลั๊กไฟชำรุด', 'เสียบแล้วปลั๊กไหม้', '65312997_9.jpg'),
('307-4-5', '2025-02-21 11:00:00', '65312994', NULL, '307', 4, NULL, 'ADCS5624', 'รับเรื่องแล้ว', 'จอมีรอยแตก', 'หน้าจอมีรอยโดนกระแทก', '65312994_5.jpg'),
('307-4-8', '2025-02-24 14:00:00', '65312997', NULL, '307', 4, NULL, NULL, 'ซ่อมสำเร็จ', 'จอมีรอยแตก', 'หน้าจอเป็นรอยขาดๆ', '65312997_8.jpg'),
('307-7-4', '2025-02-20 10:00:00', '65312994', NULL, '307', 7, NULL, NULL, 'รับเรื่องแล้ว', 'ไม่มีความเย็น', 'ลองปรับอุณหภูมิลงแล้วแต่ยังไม่เย็น', '65312994_4.jpg'),
('308-4-15', '2025-02-28 22:48:06', '64312995', NULL, '308', 4, NULL, 'ADCS5624', 'รับเรื่องแล้ว', 'จอมีรอยแตก', 'มีอุบัติเหตุในห้องทำให้ค้อนมาโดนจอ', '64312995_15.jpg'),
('308-4-16', '2025-02-28 22:56:54', '65312997', NULL, '308', 4, NULL, NULL, 'รอซ่อม', 'ภาพไม่ชัด', 'ภาพพิกเซล ทำให้ใช้งานยาก', '65312997_16.jpg'),
('414-12-1', '2025-02-17 07:00:00', '64312995', NULL, '414', 12, NULL, NULL, 'รอซ่อม', 'แสงไม่ออก', 'กดปุ่มแล้วแสงเลเซอร์ไม่ออก แต่ว่าแบตเตอรี่ยังไม่หมดเช็คแล้ว', '64312995_1.jpg'),
('414-17-17', '2025-02-28 23:00:12', '65312994', NULL, '414', 17, NULL, NULL, 'รอซ่อม', 'คีย์บอร์ดหรือเมาส์ไม่ตอบสนอง', 'โต้ะไม่แข็งแรงจนทำให้ เครื่องคอมพิวเตอร์ตกลงมา', '65312994_11.jpg'),
('414-17-2', '2025-02-18 08:00:00', '64312995', NULL, '414', 17, 2, NULL, 'รอซ่อม', 'จอฟ้า', 'มีอาการจอฟ้าเปิด ปิด ไม่ขึ้น', '64312995_2.jpg'),
('414-17-6', '2025-02-22 12:00:00', '65312994', NULL, '414', 17, 2, NULL, 'รอซ่อม', 'จอฟ้า', 'เปิดคอมไม่ขึ้น', '65312994_6.jpg'),
('414-17-7', '2025-02-23 13:00:00', '65312997', NULL, '414', 17, 2, NULL, 'รอซ่อม', 'จอฟ้า', 'คอมจอฟ้าเปิดไม่ติด', '65312997_7.jpg'),
('414-2-3', '2025-02-19 09:00:00', '64312995', NULL, '414', 2, NULL, NULL, 'รอซ่อม', 'เบาะชำรุด', 'เบาะเอนเก้าอี้หัก', '64312995_3.jpg');

-- --------------------------------------------------------

COMMIT;