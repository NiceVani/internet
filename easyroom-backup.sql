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
  CONSTRAINT `student_pkey` PRIMARY KEY (`student_id`)
) ENGINE=InnoDB 
  DEFAULT CHARSET=utf8mb4 
  COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table `student`
INSERT INTO `student`
(`student_id`, `full_name`, `department`, `faculty`, `study_year`, `degree`, `email`, `phone_number`, `role`)
VALUES
('64312995','สุกานดา ศรีประเสริฐ','เทคโนโลยีสารสนเทศ','คณะวิทยาศาสตร์',4,'ปริญญาตรี','sukanda.s@example.com','0814567890','นิสิต'),
('64312998','เกรียงไกร วิชชุภักดี','เทคโนโลยีสารสนเทศ','คณะวิทยาศาสตร์',4,'ปริญญาตรี','kriengkhai.w@example.com','0817890123','นิสิต'),
('64313001','พิมพ์ชนก ลีลาชัย','เทคโนโลยีสารสนเทศ','คณะวิทยาศาสตร์',4,'ปริญญาตรี','phimchanok.l@example.com','0820123456','นิสิต'),
('64313005','รติพร บุญส่ง','วิทยาการคอมพิวเตอร์','คณะวิทยาศาสตร์',4,'ปริญญาตรี','ratiporn.b@example.com','0824567890','นิสิต'),
('64313012','กิตติพงษ์ กองแก้ว','วิทยาการข้อมูล','คณะวิทยาศาสตร์',4,'ปริญญาตรี','kittipong.k@example.com','0831234567','นิสิต'),
('65312994','สมหญิง รุ่งโรจน์','วิทยาการข้อมูล','คณะวิทยาศาสตร์',3,'ปริญญาตรี','somhun.r@example.com','0813456789','นิสิต'),
('65312997','นภัสวรรณ บัวทอง','วิทยาการข้อมูล','คณะวิทยาศาสตร์',3,'ปริญญาตรี','napatsawan.b@example.com','0816789012','นิสิต'),
('65313000','ธนากร สุดใจ','วิทยาการข้อมูล','คณะวิทยาศาสตร์',3,'ปริญญาตรี','thanakorn.s@example.com','0819012345','นิสิต'),
('65313003','ปิยาพร มั่นคง','วิทยาการข้อมูล','คณะวิทยาศาสตร์',3,'ปริญญาตรี','piyaporn.m@example.com','0822345678','นิสิต'),
('65313006','ดวงใจ กาญจนารักษ์','วิทยาการข้อมูล','คณะวิทยาศาสตร์',3,'ปริญญาตรี','duangjai.k@example.com','0825678901','นิสิต'),
('65313009','ศิริรัตน์ สมบัติ','วิทยาการข้อมูล','คณะวิทยาศาสตร์',3,'ปริญญาตรี','sirirat.s@example.com','0828901234','นิสิต'),
('66312993','สมชาย พันธ์ดี','วิทยาการคอมพิวเตอร์','คณะวิทยาศาสตร์',2,'ปริญญาตรี','somchai.p@example.com','0812345678','นิสิต'),
('66312996','อภิชาติ สุขสม','วิทยาการคอมพิวเตอร์','คณะวิทยาศาสตร์',2,'ปริญญาตรี','apichat.s@example.com','0815678901','นิสิต'),
('66313004','วัชรินทร์ ศรีนวล','เทคโนโลยีสารสนเทศ','คณะวิทยาศาสตร์',2,'ปริญญาตรี','watcharin.s@example.com','0823456789','นิสิต'),
('66313007','ธนภัทร พานิช','เทคโนโลยีสารสนเทศ','คณะวิทยาศาสตร์',2,'ปริญญาตรี','thanapat.p@example.com','0826789012','นิสิต'),
('66313010','อมรเทพ ไชยวัฒน์','เทคโนโลยีสารสนเทศ','คณะวิทยาศาสตร์',2,'ปริญญาตรี','amorntep.c@example.com','0829012345','นิสิต'),
('67312999','เมธาวี จันทรา','วิทยาการคอมพิวเตอร์','คณะวิทยาศาสตร์',1,'ปริญญาตรี','methawi.c@example.com','0818901234','นิสิต'),
('67313002','อรพรรณ แสงสุริยะ','วิทยาการคอมพิวเตอร์','คณะวิทยาศาสตร์',1,'ปริญญาตรี','orapan.s@example.com','0821234567','นิสิต'),
('67313008','พุฒิพงษ์ เพ็ชรชม','วิทยาการคอมพิวเตอร์','คณะวิทยาศาสตร์',1,'ปริญญาตรี','puttipong.p@example.com','0827890123','นิสิต'),
('67313011','บุญช่วย ศรีสวัสดิ์','วิทยาการคอมพิวเตอร์','คณะวิทยาศาสตร์',1,'ปริญญาตรี','bunchuai.s@example.com','0830123456','นิสิต');

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
  CONSTRAINT `teacher_pkey` PRIMARY KEY (`teacher_id`)
) ENGINE=InnoDB 
  DEFAULT CHARSET=utf8mb4 
  COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table `teacher`
INSERT INTO `teacher`
(`teacher_id`, `full_name`, `department`, `faculty`, `email`, `phone_number`, `role`)
VALUES
('CS653129','สมชาย พันธ์ดี','วิทยาการคอมพิวเตอร์','คณะวิทยาศาสตร์','somchai.p.teacher@example.com','0912345678','อาจารย์'),
('CS663129','อภิชาติ สุขสม','วิทยาการคอมพิวเตอร์','คณะวิทยาศาสตร์','apichat.s.teacher@example.com','0915678901','อาจารย์'),
('CS673129','เมธาวี จันทรา','วิทยาการคอมพิวเตอร์','คณะวิทยาศาสตร์','methawi.c.teacher@example.com','0918901234','อาจารย์'),
('CS673131','อรพรรณ แสงสุริยะ','วิทยาการคอมพิวเตอร์','คณะวิทยาศาสตร์','orapan.s.teacher@example.com','0921234567','อาจารย์'),
('DS653129','สมหญิง รุ่งโรจน์','วิทยาการข้อมูล','คณะวิทยาศาสตร์','somhun.r.teacher@example.com','0913456789','อาจารย์'),
('DS663129','นภัสวรรณ บัวทอง','วิทยาการข้อมูล','คณะวิทยาศาสตร์','napatsawan.b.teacher@example.com','0916789012','อาจารย์'),
('DS673130','ธนากร สุดใจ','วิทยาการข้อมูล','คณะวิทยาศาสตร์','thanakorn.s.teacher@example.com','0919012345','อาจารย์'),
('IT653129','สุกานดา ศรีประเสริฐ','เทคโนโลยีสารสนเทศ','คณะวิทยาศาสตร์','sukanda.s.teacher@example.com','0914567890','อาจารย์'),
('IT663129','เกรียงไกร วิชชุภักดี','เทคโนโลยีสารสนเทศ','คณะวิทยาศาสตร์','kriengkhai.w.teacher@example.com','0917890123','อาจารย์'),
('IT673130','พิมพ์ชนก ลีลาชัย','เทคโนโลยีสารสนเทศ','คณะวิทยาศาสตร์','phimchanok.l.teacher@example.com','0920123456','อาจารย์');

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
  CONSTRAINT `admin_pkey` PRIMARY KEY (`admin_id`)
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
  CONSTRAINT `executive_pkey` PRIMARY KEY (`executive_id`)
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
-- Table structure for table `equipment`
-- --------------------------------------------------------
CREATE TABLE `equipment` (
  `equipment_id`   int          NOT NULL AUTO_INCREMENT,
  `equipment_name` varchar(100) NOT NULL,
  CONSTRAINT `equipment_pkey` PRIMARY KEY (`equipment_id`)
) ENGINE=InnoDB 
  DEFAULT CHARSET=utf8mb4 
  COLLATE=utf8mb4_0900_ai_ci
  AUTO_INCREMENT=18;

-- Dumping data for table `equipment`
INSERT INTO `equipment`
(`equipment_id`, `equipment_name`) VALUES
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
-- Table structure for table `room_type`
-- --------------------------------------------------------
CREATE TABLE `room_type` (
  `room_type_id` int NOT NULL AUTO_INCREMENT,
  `type_name`     enum('ห้องเลคเชอร์', 'ห้องปฎิบัติการ', 'Co-working Space', 'Studio Room') NOT NULL,
  CONSTRAINT `room_type_pkey` PRIMARY KEY (`room_type_id`)
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
  CONSTRAINT `room_pkey` PRIMARY KEY (`room_id`),
  CONSTRAINT `room_room_type_id_fkey`
    FOREIGN KEY (`room_type_id`) REFERENCES `room_type` (`room_type_id`),
  INDEX `room_room_type_id_idx` (`room_type_id`)
) ENGINE=InnoDB 
  DEFAULT CHARSET=utf8mb4 
  COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table `room`
INSERT INTO `room`
(`room_id`, `room_name`, `floor`, `room_status`, `room_type_id`)
VALUES
('212', 'SC2-212', '2', 'ปิดการใช้งาน', 1),
('307', 'SC2-307', '3', 'เปิดการใช้งาน', 2),
('308', 'SC2-308', '3', 'ปิดการใช้งาน', 2),
('311', 'SC2-311', '3', 'ปิดการใช้งาน', 3),
('313', 'SC2-313', '3', 'ปิดการใช้งาน', 2),
('313-1','SC2-313-1','3', 'ปิดการใช้งาน', 2),
('407', 'SC2-407', '4', 'ปิดการใช้งาน', 1),
('411', 'SC2-411', '4', 'ปิดการใช้งาน', 4),
('414', 'SC2-414', '4', 'เปิดการใช้งาน', 2);

-- END table: room

-- --------------------------------------------------------
-- Table structure for table `equipment_management`
-- --------------------------------------------------------
CREATE TABLE `equipment_management` (
  `equipment_id`    int        NOT NULL,
  `room_id`         varchar(6) NOT NULL,
  `stock_quantity` int       NOT NULL,
  CONSTRAINT `equipment_management_pkey` PRIMARY KEY (`equipment_id`,`room_id`),
  CONSTRAINT `equipment_management_equipment_id_fkey`
    FOREIGN KEY (`equipment_id`) REFERENCES `equipment` (`equipment_id`),
  CONSTRAINT `equipment_management_room_id_fkey`
    FOREIGN KEY (`room_id`) REFERENCES `room` (`room_id`),
  INDEX `equipment_management_equipment_id_idx` (`equipment_id`),
  INDEX `equipment_management_room_id_idx` (`room_id`)
) ENGINE=InnoDB 
  DEFAULT CHARSET=utf8mb4 
  COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table `equipment_management`
INSERT INTO `equipment_management`
(`equipment_id`, `room_id`, `stock_quantity`)
VALUES
(2, '212', 10),
(12, '212', 2),
(15, '212', 5),
(12, '307', 2),
(13, '307', 10),
(14, '307', 7),
(15, '307', 5),
(10, '308', 5),
(11, '308', 5),
(13, '308', 10),
(14, '308', 7),
(15, '308', 5),
(2, '311', 10),
(15, '311', 5),
(15, '414', 5),
(12, '414', 2),
(13, '414', 5),
(14, '414', 5);

-- END table: equipment_management

-- --------------------------------------------------------
-- Table structure for table `computer_management`
-- --------------------------------------------------------
CREATE TABLE `computer_management` (
  `computer_id`      int         NOT NULL,
  `room_id`         varchar(6)  NOT NULL,
  `computer_status`  enum('ใช้งานได้','ใช้งานไม่ได้') NOT NULL,
  CONSTRAINT `computer_management_pkey` PRIMARY KEY (`computer_id`,`room_id`),
  CONSTRAINT `computer_management_room_id_fkey`
    FOREIGN KEY (`room_id`) REFERENCES `room` (`room_id`),
  INDEX `computer_management_room_id_idx` (`room_id`)
) ENGINE=InnoDB 
  DEFAULT CHARSET=utf8mb4 
  COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table `computer_management`
INSERT INTO `computer_management`
(`computer_id`, `room_id`, `computer_status`)
VALUES
(1, '307', 'ใช้งานได้'),
(2, '307', 'ใช้งานได้'),
(3, '307', 'ใช้งานได้'),
(4, '307', 'ใช้งานได้'),
(5, '307', 'ใช้งานได้'),
(6, '307', 'ใช้งานได้'),
(7, '307', 'ใช้งานได้'),
(8, '307', 'ใช้งานได้'),
(9, '307', 'ใช้งานได้'),
(10, '307', 'ใช้งานไม่ได้'),
(11, '307', 'ใช้งานได้'),
(12, '307', 'ใช้งานได้'),
(13, '307', 'ใช้งานได้'),
(14, '307', 'ใช้งานได้'),
(15, '307', 'ใช้งานได้'),
(16, '307', 'ใช้งานได้'),
(17, '307', 'ใช้งานได้'),
(18, '307', 'ใช้งานได้'),
(19, '307', 'ใช้งานได้'),
(20, '307', 'ใช้งานได้'),
(21, '307', 'ใช้งานได้'),
(22, '307', 'ใช้งานได้'),
(23, '307', 'ใช้งานได้'),
(24, '307', 'ใช้งานได้'),
(25, '307', 'ใช้งานไม่ได้'),
(26, '307', 'ใช้งานได้'),
(27, '307', 'ใช้งานได้'),
(28, '307', 'ใช้งานได้'),
(29, '307', 'ใช้งานได้'),
(30, '307', 'ใช้งานได้'),
(31, '307', 'ใช้งานได้'),
(32, '307', 'ใช้งานได้'),
(33, '307', 'ใช้งานได้'),
(34, '307', 'ใช้งานได้'),
(35, '307', 'ใช้งานได้'),
(36, '307', 'ใช้งานได้'),
(37, '307', 'ใช้งานได้'),
(38, '307', 'ใช้งานได้'),
(39, '307', 'ใช้งานได้'),
(40, '307', 'ใช้งานได้'),
(41, '307', 'ใช้งานได้'),
(42, '307', 'ใช้งานได้'),
(43, '307', 'ใช้งานได้'),
(44, '307', 'ใช้งานได้'),
(45, '307', 'ใช้งานได้'),
(46, '307', 'ใช้งานได้'),
(47, '307', 'ใช้งานได้'),
(48, '307', 'ใช้งานได้'),
(49, '307', 'ใช้งานได้'),
(50, '307', 'ใช้งานได้'),
(51, '307', 'ใช้งานได้'),
(52, '307', 'ใช้งานได้'),
(53, '307', 'ใช้งานได้'),
(54, '307', 'ใช้งานได้'),
(55, '307', 'ใช้งานได้'),
(56, '307', 'ใช้งานได้'),
(57, '307', 'ใช้งานได้'),
(58, '307', 'ใช้งานได้'),
(59, '307', 'ใช้งานได้'),
(60, '307', 'ใช้งานได้'),
(61, '307', 'ใช้งานได้'),
(62, '307', 'ใช้งานได้'),
(63, '307', 'ใช้งานได้'),
(64, '307', 'ใช้งานได้'),
(65, '307', 'ใช้งานได้'),
(66, '307', 'ใช้งานได้'),
(67, '307', 'ใช้งานได้'),
(68, '307', 'ใช้งานได้'),
(69, '307', 'ใช้งานได้'),
(70, '307', 'ใช้งานได้'),
(71, '307', 'ใช้งานได้'),
(72, '307', 'ใช้งานได้'),
(73, '307', 'ใช้งานได้'),
(74, '307', 'ใช้งานได้'),
(75, '307', 'ใช้งานได้'),
(76, '307', 'ใช้งานได้'),
(77, '307', 'ใช้งานได้'),
(78, '307', 'ใช้งานได้'),
(79, '307', 'ใช้งานไม่ได้'),
(80, '307', 'ใช้งานได้')

-- 414
(1, '414', 'ใช้งานไม่ได้'),
(2, '414', 'ใช้งานไม่ได้'),
(3, '414', 'ใช้งานไม่ได้'),
(4, '414', 'ใช้งานได้'),
(5, '414', 'ใช้งานได้'),
(6, '414', 'ใช้งานได้'),
(7, '414', 'ใช้งานได้'),
(8, '414', 'ใช้งานได้'),
(9, '414', 'ใช้งานได้'),
(10, '414', 'ใช้งานไม่ได้'),
(11, '414', 'ใช้งานได้'),
(12, '414', 'ใช้งานได้'),
(13, '414', 'ใช้งานได้'),
(14, '414', 'ใช้งานได้'),
(15, '414', 'ใช้งานได้'),
(16, '414', 'ใช้งานได้'),
(17, '414', 'ใช้งานได้'),
(18, '414', 'ใช้งานได้'),
(19, '414', 'ใช้งานได้'),
(20, '414', 'ใช้งานได้'),
(21, '414', 'ใช้งานได้'),
(22, '414', 'ใช้งานได้'),
(23, '414', 'ใช้งานได้'),
(24, '414', 'ใช้งานได้'),
(25, '414', 'ใช้งานไม่ได้'),
(26, '414', 'ใช้งานได้'),
(27, '414', 'ใช้งานได้'),
(28, '414', 'ใช้งานได้'),
(29, '414', 'ใช้งานได้'),
(30, '414', 'ใช้งานได้'),
(31, '414', 'ใช้งานได้'),
(32, '414', 'ใช้งานได้'),
(33, '414', 'ใช้งานได้'),
(34, '414', 'ใช้งานได้'),
(35, '414', 'ใช้งานได้'),
(36, '414', 'ใช้งานได้'),
(37, '414', 'ใช้งานได้'),
(38, '414', 'ใช้งานได้'),
(39, '414', 'ใช้งานได้'),
(40, '414', 'ใช้งานได้'),
(41, '414', 'ใช้งานได้'),
(42, '414', 'ใช้งานได้'),
(43, '414', 'ใช้งานได้'),
(44, '414', 'ใช้งานได้'),
(45, '414', 'ใช้งานได้'),
(46, '414', 'ใช้งานได้'),
(47, '414', 'ใช้งานไม่ได้'),
(48, '414', 'ใช้งานได้'),
(49, '414', 'ใช้งานได้'),
(50, '414', 'ใช้งานได้'),
(51, '414', 'ใช้งานได้'),
(52, '414', 'ใช้งานได้'),
(53, '414', 'ใช้งานได้'),
(54, '414', 'ใช้งานได้'),
(55, '414', 'ใช้งานได้'),
(56, '414', 'ใช้งานได้'),
(57, '414', 'ใช้งานได้'),
(58, '414', 'ใช้งานได้'),
(59, '414', 'ใช้งานได้'),
(60, '414', 'ใช้งานไม่ได้'),
(61, '414', 'ใช้งานได้'),
(62, '414', 'ใช้งานได้'),
(63, '414', 'ใช้งานได้'),
(64, '414', 'ใช้งานได้'),
(65, '414', 'ใช้งานได้'),
(66, '414', 'ใช้งานได้'),
(67, '414', 'ใช้งานได้'),
(68, '414', 'ใช้งานได้'),
(69, '414', 'ใช้งานได้'),
(70, '414', 'ใช้งานได้'),
(71, '414', 'ใช้งานได้'),
(72, '414', 'ใช้งานได้'),
(73, '414', 'ใช้งานได้'),
(74, '414', 'ใช้งานได้'),
(75, '414', 'ใช้งานได้'),
(76, '414', 'ใช้งานได้'),
(77, '414', 'ใช้งานไม่ได้'),
(78, '414', 'ใช้งานไม่ได้'),
(79, '414', 'ใช้งานไม่ได้'),
(80, '414', 'ใช้งานได้');

-- END table: computer_management

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
  CONSTRAINT `room_schedule_pkey` PRIMARY KEY (`room_schedule_id`),
  CONSTRAINT `room_schedule_room_id_fkey`
    FOREIGN KEY (`room_id`) REFERENCES `room` (`room_id`),
  INDEX `room_schedule_room_id_idx` (`room_id`)
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

(33, '307', 'อังคาร', '2025-02-25', '10:00:00', '12:00:00', 'กำลังปรับปรุง'),
(34, '307', 'พุธ', '2025-02-26', '09:00:00', '10:00:00', 'กำลังปรับปรุง'),
(35, '307', 'ศุกร์', '2025-02-28', '08:00:00', '10:00:00', 'กำลังปรับปรุง'),

(54, '414', 'จันทร์', NULL, '10:00:00', '11:00:00', 'มีเรียน'),
(55, '414', 'จันทร์', NULL, '11:00:00', '12:00:00', 'มีเรียน'),
(56, '414', 'อังคาร', NULL, '13:00:00', '14:00:00', 'มีเรียน'),
(57, '414', 'อังคาร', NULL, '14:00:00', '15:00:00', 'มีเรียน'),
(58, '414', 'อังคาร', NULL, '15:00:00', '16:00:00', 'มีเรียน'),
(59, '414', 'อังคาร', NULL, '16:00:00', '17:00:00', 'มีเรียน'),
(60, '414', 'พุธ', NULL, '08:00:00', '09:00:00', 'มีเรียน'),
(61, '414', 'พุธ', NULL, '09:00:00', '10:00:00', 'มีเรียน'),
(62, '414', 'พุธ', NULL, '10:00:00', '11:00:00', 'มีเรียน'),
(63, '414', 'พุธ', NULL, '11:00:00', '12:00:00', 'มีเรียน'),
(64, '414', 'พุธ', NULL, '13:00:00', '14:00:00', 'มีเรียน'),
(65, '414', 'พุธ', NULL, '14:00:00', '15:00:00', 'มีเรียน'),
(66, '414', 'พุธ', NULL, '15:00:00', '16:00:00', 'มีเรียน'),
(67, '414', 'พุธ', NULL, '16:00:00', '17:00:00', 'มีเรียน'),
(68, '414', 'พฤหัสบดี', NULL, '08:00:00', '09:00:00', 'มีเรียน'),
(69, '414', 'พฤหัสบดี', NULL, '09:00:00', '10:00:00', 'มีเรียน'),
(70, '414', 'พฤหัสบดี', NULL, '10:00:00', '11:00:00', 'มีเรียน'),
(71, '414', 'พฤหัสบดี', NULL, '11:00:00', '12:00:00', 'มีเรียน'),
(72, '414', 'พฤหัสบดี', NULL, '13:00:00', '14:00:00', 'มีเรียน'),
(73, '414', 'พฤหัสบดี', NULL, '14:00:00', '15:00:00', 'มีเรียน'),
(74, '414', 'พฤหัสบดี', NULL, '15:00:00', '16:00:00', 'มีเรียน'),
(75, '414', 'พฤหัสบดี', NULL, '16:00:00', '17:00:00', 'มีเรียน'),
(76, '414', 'ศุกร์', NULL, '08:00:00', '09:00:00', 'มีเรียน'),
(77, '414', 'ศุกร์', NULL, '09:00:00', '10:00:00', 'มีเรียน'),
(78, '414', 'ศุกร์', NULL, '10:00:00', '11:00:00', 'มีเรียน'),
(79, '414', 'ศุกร์', NULL, '11:00:00', '12:00:00', 'มีเรียน'),
(80, '414', 'ศุกร์', NULL, '13:00:00', '14:00:00', 'มีเรียน'),
(81, '414', 'ศุกร์', NULL, '14:00:00', '15:00:00', 'มีเรียน'),
(82, '414', 'ศุกร์', NULL, '15:00:00', '16:00:00', 'มีเรียน'),
(83, '414', 'ศุกร์', NULL, '16:00:00', '17:00:00', 'มีเรียน'),

(84, '414', 'จันทร์', '2025-02-24', '10:00:00', '12:00:00', 'กำลังปรับปรุง'),
(85, '414', 'อังคาร', '2025-02-25', '12:00:00', '13:00:00', 'กำลังปรับปรุง');

-- END table: room_schedule

-- --------------------------------------------------------
-- Table structure for table `room_request`
-- --------------------------------------------------------

CREATE TABLE `room_request` (
  `room_request_id` int NOT NULL AUTO_INCREMENT,
  `submitted_time`    datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `room_id`          varchar(6) NOT NULL,
  `student_id`        varchar(8)  NULL,
  `teacher_id`        varchar(8)  NULL,
  `used_date`         date       NOT NULL,
  `start_time`        time       NOT NULL,
  `end_time`          time       NOT NULL,
  `request_type`  enum('ในเวลา','นอกเวลา') NOT NULL,

  `request_reason` enum(
    'ขอใช้ห้องเพื่อติวหนังสือ',
    'ขอใช้ห้องเพื่อทำงาน',
    'ขอใช้ห้องเพื่อทำวิจัย',
    'ขอใช้ห้องเพื่อจัดกิจกรรมเสริมความรู้',
    'ขอใช้ห้องเพื่อกิจกรรมชมรม',
    'ขอใช้ห้องเพื่อเรียนออนไลน์',
    'ขอใช้ห้องเพื่อถ่ายทำวิดีโอ',
    'ขอใช้ห้องเพื่อวัตถุประสงค์อื่น ๆ'
  ) NOT NULL,
  `detail_request_reason` varchar(255) NULL,

  `reject_reason` enum(    
    'จำนวนคนใช้ห้องน้อยเกินไป',
    'เหตุผลในการขอใช้ห้องไม่สมเหตุสมผล',
    'คำขอซ้ำซ้อน',
    'ห้องมีการบำรุงรักษาหรือติดตั้งอุปกรณ์ใหม่',
    'มีการใช้ห้องผิดประเภท'
  ) NULL,
  `detail_reject_reason` varchar(255) NULL,
  
  `request_status` enum('รอดำเนินการ','รออนุมัติ','อนุมัติ','ไม่อนุมัติ') NOT NULL,
  `document_path` varchar(255) NULL,
  CONSTRAINT `room_request_pkey` PRIMARY KEY (`room_request_id`),
  CONSTRAINT `room_request_room_id_fkey`
    FOREIGN KEY (`room_id`) REFERENCES `room` (`room_id`),
  CONSTRAINT `room_request_student_id_fkey`
    FOREIGN KEY (`student_id`) REFERENCES `student` (`student_id`),
  CONSTRAINT `room_request_teacher_id_fkey`
    FOREIGN KEY (`teacher_id`) REFERENCES `teacher` (`teacher_id`),

  INDEX `room_request_room_id_idx` (`room_id`),
  INDEX `room_request_student_id_idx` (`student_id`),
  INDEX `room_request_teacher_id_idx` (`teacher_id`)
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
  CONSTRAINT `room_request_participant_pkey` PRIMARY KEY (`room_request_participant_id`),
  CONSTRAINT `room_request_participant_room_request_id_fkey`
    FOREIGN KEY (`room_request_id`) REFERENCES `room_request` (`room_request_id`),
  CONSTRAINT `room_request_participant_student_id_fkey` 
    FOREIGN KEY (`student_id`) REFERENCES `student` (`student_id`),
  CONSTRAINT `room_request_participant_teacher_id_fkey` 
    FOREIGN KEY (`teacher_id`) REFERENCES `teacher` (`teacher_id`),

  INDEX `room_request_participant_room_request_id_idx` (`room_request_id`),
  INDEX `room_request_participant_student_id_idx` (`student_id`),
  INDEX `room_request_participant_teacher_id_idx` (`teacher_id`)
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
  CONSTRAINT `room_request_equipment_pkey` PRIMARY KEY (`room_request_id`,`equipment_id`),
  
  CONSTRAINT `room_request_equipment_room_request_id_fkey`
    FOREIGN KEY (`room_request_id`) REFERENCES `room_request` (`room_request_id`),

  CONSTRAINT `room_request_equipment_equipment_id_fkey`
    FOREIGN KEY (`equipment_id`) REFERENCES `equipment` (`equipment_id`),

  CONSTRAINT `room_request_equipment_room_id_fkey`
    FOREIGN KEY (`room_id`) REFERENCES `room` (`room_id`),
    
  CONSTRAINT `room_request_equipment_equipment_id_room_id_fkey`
    FOREIGN KEY (`equipment_id`, `room_id`) REFERENCES `equipment_management` (`equipment_id`, `room_id`),

 INDEX `room_request_equipment_equipment_id_room_id_idx` (`equipment_id`, `room_id`),
 INDEX `room_request_equipment_room_request_id_idx` (`room_request_id`),
 INDEX `room_request_equipment_equipment_id_idx` (`equipment_id`),
 INDEX `room_request_equipment_room_id_idx` (`room_id`)
) ENGINE=InnoDB 
  DEFAULT CHARSET=utf8mb4 
  COLLATE=utf8mb4_0900_ai_ci;

-- END table: room_request_equipment

-- --------------------------------------------------------
-- Table structure for table `room_request_computer`
-- --------------------------------------------------------
CREATE TABLE `room_request_computer` (
  `room_request_id` int        NOT NULL,
  `computer_id`       int        NOT NULL,
  `room_id`          varchar(6) NOT NULL,

  CONSTRAINT `room_request_computer_pkey` PRIMARY KEY (`room_request_id`,`computer_id`),

  CONSTRAINT `room_request_computer_computer_id_room_id_fkey`
    FOREIGN KEY (`computer_id`, `room_id`) REFERENCES `computer_management` (`computer_id`, `room_id`),

  CONSTRAINT `room_request_computer_room_request_id_fkey`
    FOREIGN KEY (`room_request_id`) REFERENCES `room_request` (`room_request_id`),

  CONSTRAINT `room_request_computer_room_id_fkey`
    FOREIGN KEY (`room_id`) REFERENCES `room` (`room_id`),

  
  INDEX `room_request_computer_computer_id_room_id_idx` (`computer_id`, `room_id`),
  INDEX `room_request_computer_room_request_id_idx` (`room_request_id`),
  INDEX `room_request_computer_computer_id_idx` (`computer_id`),
  INDEX `room_request_computer_room_id_idx` (`room_id`)
) ENGINE=InnoDB 
  DEFAULT CHARSET=utf8mb4 
  COLLATE=utf8mb4_0900_ai_ci;

-- END table: room_request_computer

COMMIT;