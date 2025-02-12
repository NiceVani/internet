SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";
SET NAMES 'utf8mb4' COLLATE 'utf8mb4_unicode_ci';

USE easyroom;

--
-- Database: `easyroom`
--

-- --------------------------------------------------------

--
-- Table structure for table `Admin_information`
--

CREATE TABLE `Admin_information` (
  `Admin_ID` varchar(8) NOT NULL,
  `Name` varchar(100) NOT NULL,
  `Department` varchar(100) NOT NULL,
  `Faculty` varchar(100) NOT NULL,
  `Email` varchar(100) NOT NULL,
  `Phone_number` varchar(10) NOT NULL,
  `Status` enum('ผู้ดูแลห้อง') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `Admin_information`
--

INSERT INTO `Admin_information` (`Admin_ID`, `Name`, `Department`, `Faculty`, `Email`, `Phone_number`, `Status`) VALUES
('ADCS5624', 'นายธราศักดิ์ ชุนกองฮอง', 'วิทยาการคอมพิวเตอร์', 'คณะวิทยาศาสตร์', 'tharasak@nu.ac.th', '0865423654', 'ผู้ดูแลห้อง'),
('ADCS7823', 'นายยุทธพงษ์ คงถาวร', 'วิทยาการคอมพิวเตอร์', 'คณะวิทยาศาสตร์', 'yutthapong@nu.ac.th', '0562314598', 'ผู้ดูแลห้อง');

-- --------------------------------------------------------

--
-- Table structure for table `Computer_list_requests`
--

CREATE TABLE `Computer_list_requests` (
  `Rooms_requests_ID` int NOT NULL,
  `Computer_ID` int NOT NULL,
  `Rooms_ID` varchar(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `Computer_list_requests`
--

INSERT INTO `Computer_list_requests` (`Rooms_requests_ID`, `Computer_ID`, `Rooms_ID`) VALUES
(25, 1, '307'),
(26, 1, '307'),
(27, 1, '307'),
(28, 1, '307'),
(29, 1, '307'),
(30, 1, '307'),
(31, 1, '307'),
(32, 1, '307'),
(25, 2, '307'),
(26, 2, '307'),
(27, 2, '307'),
(28, 2, '307'),
(29, 2, '307'),
(30, 2, '307'),
(31, 2, '307'),
(32, 2, '307'),
(25, 3, '307'),
(26, 3, '307'),
(27, 3, '307'),
(28, 3, '307'),
(29, 3, '307'),
(30, 3, '307'),
(31, 3, '307'),
(32, 3, '307'),
(25, 4, '307'),
(26, 4, '307'),
(27, 4, '307'),
(28, 4, '307'),
(29, 4, '307'),
(30, 4, '307'),
(31, 4, '307'),
(32, 4, '307'),
(25, 5, '307'),
(26, 5, '307'),
(27, 5, '307'),
(28, 5, '307'),
(29, 5, '307'),
(30, 5, '307'),
(31, 5, '307'),
(32, 5, '307'),
(25, 6, '307'),
(26, 6, '307'),
(27, 6, '307'),
(28, 6, '307'),
(29, 6, '307'),
(30, 6, '307'),
(31, 6, '307'),
(32, 6, '307'),
(25, 7, '307'),
(26, 7, '307'),
(27, 7, '307'),
(28, 7, '307'),
(29, 7, '307'),
(30, 7, '307'),
(31, 7, '307'),
(32, 7, '307'),
(25, 8, '307'),
(26, 8, '307'),
(27, 8, '307'),
(28, 8, '307'),
(29, 8, '307'),
(30, 8, '307'),
(31, 8, '307'),
(32, 8, '307'),
(25, 9, '307'),
(26, 9, '307'),
(27, 9, '307'),
(28, 9, '307'),
(29, 9, '307'),
(30, 9, '307'),
(31, 9, '307'),
(32, 9, '307'),
(26, 11, '307'),
(27, 11, '307'),
(28, 11, '307'),
(29, 11, '307'),
(30, 11, '307'),
(31, 11, '307'),
(32, 11, '307'),
(26, 12, '307'),
(27, 12, '307'),
(28, 12, '307'),
(29, 12, '307'),
(30, 12, '307'),
(31, 12, '307'),
(26, 13, '307'),
(27, 13, '307'),
(28, 13, '307'),
(29, 13, '307'),
(30, 13, '307'),
(31, 13, '307'),
(26, 14, '307'),
(27, 14, '307'),
(28, 14, '307'),
(29, 14, '307'),
(30, 14, '307'),
(31, 14, '307'),
(26, 15, '307'),
(27, 15, '307'),
(28, 15, '307'),
(29, 15, '307'),
(30, 15, '307'),
(31, 15, '307'),
(26, 16, '307'),
(27, 16, '307'),
(28, 16, '307'),
(29, 16, '307'),
(30, 16, '307'),
(31, 16, '307'),
(28, 17, '307'),
(29, 17, '307'),
(30, 17, '307'),
(31, 17, '307'),
(28, 18, '307'),
(29, 18, '307'),
(30, 18, '307'),
(31, 18, '307'),
(28, 19, '307'),
(29, 19, '307'),
(30, 19, '307'),
(31, 19, '307'),
(28, 20, '307'),
(29, 20, '307'),
(30, 20, '307'),
(31, 20, '307'),
(28, 21, '307'),
(29, 21, '307'),
(30, 21, '307'),
(31, 21, '307'),
(29, 22, '307'),
(30, 22, '307'),
(31, 22, '307'),
(29, 23, '307'),
(30, 23, '307'),
(31, 23, '307'),
(29, 24, '307'),
(30, 24, '307'),
(31, 24, '307'),
(29, 26, '307'),
(30, 26, '307'),
(31, 26, '307'),
(29, 27, '307'),
(30, 27, '307'),
(31, 27, '307'),
(29, 28, '307'),
(30, 28, '307'),
(31, 28, '307'),
(29, 29, '307'),
(30, 29, '307'),
(31, 29, '307'),
(29, 30, '307'),
(30, 30, '307'),
(31, 30, '307'),
(29, 31, '307'),
(30, 31, '307'),
(31, 31, '307');

-- --------------------------------------------------------

--
-- Table structure for table `Equipments_list_brokened`
--

CREATE TABLE `Equipments_list_brokened` (
  `Repair_numbers` varchar(12) NOT NULL,
  `Repair_date` datetime NOT NULL,
  `Identify_ID` varchar(8) NOT NULL,
  `Rooms_ID` varchar(6) NOT NULL,
  `Equipments_ID` int NOT NULL,
  `Admin_ID` varchar(100) DEFAULT NULL,
  `Repair_status` enum('รอซ่อม','รับเรื่องแล้ว','กำลังจัดซื้อ','กำลังซ่อม','ซ่อมสำเร็จ') NOT NULL,
  `Damaged_details` enum('สายไฟชำรุด','สายไฟขาด','ปลั๊กไฟหลวม','ขาเก้าอี้หัก','เบาะชำรุด','พนักพิงหลุด','ขาโต๊ะหัก','พื้นโต๊ะมีรอย','โต๊ะโยก','หน้าจอไม่ติด','จอมีรอยแตก','ภาพไม่ชัด','โปรเจคเตอร์ไม่ติด','ภาพเบลอ','รีโมทไม่ทำงาน','ทีวีไม่ติด','เสียงไม่ออก','จอภาพไม่ชัด','ไม่มีความเย็น','มีน้ำหยด','เปิดไม่ติด','เครื่องไม่ทำงาน','ภาพไม่ออก','ภาพไม่ขึ้น','พอร์ตไม่ทำงาน','ไฟไม่ติด','อุปกรณ์ไม่เชื่อมต่อ','ไม่มีสัญญาณ','เชื่อมต่อช้า','อุปกรณ์ไม่ตอบสนอง','ไฟสถานะไม่ขึ้น','แบตเตอรี่หมด','ไฟไม่ออก','ปุ่มกดเสีย','ปุ่มคลิกไม่ทำงาน','ตัวชี้เมาส์ไม่ขยับ','สายเมาส์ชำรุด','ปุ่มกดไม่ติด','ปุ่มบางตัวหลุด','แสงไฟไม่ติด','ปลั๊กไฟชำรุด','สายไฟหลวม','ไมค์ไม่มีเสียง','เสียงขาดหาย','ไมค์ไม่เชื่อมต่อ','เครื่องเปิดไม่ติด','เครื่องมีอาการจอฟ้า (Your PC ran into a problem)','คีย์บอร์ดหรือเมาส์ไม่ตอบสนอง') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `Equipments_list_brokened`
--

INSERT INTO `Equipments_list_brokened` (`Repair_numbers`, `Repair_date`, `Identify_ID`, `Rooms_ID`, `Equipments_ID`, `Admin_ID`, `Repair_status`, `Damaged_details`) VALUES
('212-001001', '2025-01-15 10:00:00', '65312994', '212', 17, 'ADCS7823', 'รับเรื่องแล้ว', 'เครื่องเปิดไม่ติด'),
('307-001002', '2025-01-16 14:30:00', '65312997', '307', 17, 'ADCS5624', 'กำลังซ่อม', 'เครื่องมีอาการจอฟ้า (Your PC ran into a problem)'),
('307-001003', '2025-01-17 09:45:00', '65313000', '307', 17, 'ADCS5624', 'รอซ่อม', 'คีย์บอร์ดหรือเมาส์ไม่ตอบสนอง'),
('307-001006', '2025-01-19 11:10:00', '65312994', '307', 17, 'ADCS7823', 'ซ่อมสำเร็จ', 'เครื่องมีอาการจอฟ้า (Your PC ran into a problem)'),
('308-002001', '2025-01-17 09:45:00', '65312997', '308', 12, 'ADCS5624', 'รอซ่อม', 'ภาพเบลอ'),
('311-001004', '2025-01-18 13:20:00', '65313005', '311', 17, 'ADCS7823', 'กำลังจัดซื้อ', 'เครื่องมีอาการจอฟ้า (Your PC ran into a problem)'),
('311-001005', '2025-01-19 11:10:00', '65312994', '311', 17, 'ADCS7823', 'ซ่อมสำเร็จ', 'คีย์บอร์ดหรือเมาส์ไม่ตอบสนอง'),
('311-004001', '2025-01-18 13:20:00', '65312997', '311', 2, 'ADCS7823', 'กำลังจัดซื้อ', 'ขาเก้าอี้หัก');

-- --------------------------------------------------------

--
-- Table structure for table `Equipments_list_information`
--

CREATE TABLE `Equipments_list_information` (
  `Equipments_ID` int NOT NULL,
  `Equipments_name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `Equipments_list_information`
--

INSERT INTO `Equipments_list_information` (`Equipments_ID`, `Equipments_name`) VALUES
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

-- --------------------------------------------------------

--
-- Table structure for table `Equipments_list_requests`
--

CREATE TABLE `Equipments_list_requests` (
  `Rooms_requests_ID` int NOT NULL,
  `Equipments_ID` int NOT NULL,
  `Rooms_ID` varchar(6) NOT NULL,
  `Equipments_amount` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `Equipments_list_requests`
--

INSERT INTO `Equipments_list_requests` (`Rooms_requests_ID`, `Equipments_ID`, `Rooms_ID`, `Equipments_amount`) VALUES
(25, 12, '307', 1),
(25, 15, '307', 3),
(29, 12, '307', 1),
(29, 13, '307', 3),
(29, 15, '307', 5);

-- --------------------------------------------------------

--
-- Table structure for table `Executive_information`
--

CREATE TABLE `Executive_information` (
  `Executive_ID` varchar(8) NOT NULL,
  `Name` varchar(100) NOT NULL,
  `Department` varchar(100) NOT NULL,
  `Faculty` varchar(100) NOT NULL,
  `Email` varchar(100) NOT NULL,
  `Phone_number` varchar(10) NOT NULL,
  `Status` enum('ผู้บริหาร') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `Executive_information`
--

INSERT INTO `Executive_information` (`Executive_ID`, `Name`, `Department`, `Faculty`, `Email`, `Phone_number`, `Status`) VALUES
('CSB25645', 'วุฒิพงศ์ เรือนทอง', 'วิทยาการคอมพิวเตอร์', 'คณะวิทยาศาสตร์', 'wuttipong@nu.ac.th', '0568951223', 'ผู้บริหาร');

-- --------------------------------------------------------

--
-- Table structure for table `Manage_computers`
--

CREATE TABLE `Manage_computers` (
  `Computer_ID` int NOT NULL,
  `Rooms_ID` varchar(6) NOT NULL,
  `Computer_status` enum('ใช้งานได้','ใช้งานไม่ได้') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `Manage_computers`
--

INSERT INTO `Manage_computers` (`Computer_ID`, `Rooms_ID`, `Computer_status`) VALUES
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
(80, '307', 'ใช้งานได้');

-- --------------------------------------------------------

--
-- Table structure for table `Manage_equipments`
--

CREATE TABLE `Manage_equipments` (
  `Equipments_ID` int NOT NULL,
  `Rooms_ID` varchar(6) NOT NULL,
  `Equipments_amount` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `Manage_equipments`
--

INSERT INTO `Manage_equipments` (`Equipments_ID`, `Rooms_ID`, `Equipments_amount`) VALUES
(2, '212', 10),
(2, '311', 10),
(10, '308', 5),
(11, '308', 5),
(12, '212', 2),
(12, '307', 2),
(13, '307', 10),
(13, '308', 10),
(14, '307', 7),
(14, '308', 7),
(15, '212', 5),
(15, '307', 5),
(15, '308', 5),
(15, '311', 5);

-- --------------------------------------------------------

--
-- Table structure for table `Name_list_requests_rooms`
--

CREATE TABLE `Name_list_requests_rooms` (
  `Rooms_requests_ID` int NOT NULL,
  `Identify_ID` varchar(8) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `Name_list_requests_rooms`
--

INSERT INTO `Name_list_requests_rooms` (`Rooms_requests_ID`, `Identify_ID`) VALUES
(17, '64312995'),
(17, '64312998'),
(17, '64313001'),
(17, '64313005'),
(17, '64313012'),
(17, '65312994'),
(17, '65312997'),
(18, '65312997'),
(18, '65313000'),
(18, '65313003'),
(18, '65313006'),
(19, '65313003'),
(19, '65313009'),
(19, '66312993'),
(19, '66312996'),
(19, '66313004'),
(20, '65313006'),
(20, '66313007'),
(20, '66313010'),
(20, '67312999');

-- --------------------------------------------------------

--
-- Table structure for table `Rooms_list_information`
--

CREATE TABLE `Rooms_list_information` (
  `Rooms_ID` varchar(6) NOT NULL,
  `Rooms_name` varchar(10) NOT NULL,
  `Floors` enum('2','3','4') NOT NULL,
  `Room_types` enum('ห้องเลคเชอร์','ห้องปฏิบัติการ','Co-working space','Studio Room') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `Rooms_list_information`
--

INSERT INTO `Rooms_list_information` (`Rooms_ID`, `Rooms_name`, `Floors`, `Room_types`) VALUES
('212', 'SC2-212', '2', 'ห้องเลคเชอร์'),
('307', 'SC2-307', '3', 'ห้องปฏิบัติการ'),
('308', 'SC2-308', '3', 'ห้องปฏิบัติการ'),
('311', 'SC2-311', '3', 'Co-working space'),
('313', 'SC2-313', '3', 'ห้องปฏิบัติการ'),
('313-1', 'SC2-313-1', '3', 'ห้องปฏิบัติการ'),
('407', 'SC2-407', '4', 'ห้องเลคเชอร์'),
('411', 'SC2-411', '4', 'Studio Room'),
('414', 'SC2-414', '4', 'ห้องปฏิบัติการ');

-- --------------------------------------------------------

--
-- Table structure for table `Rooms_list_requests`
--

CREATE TABLE `Rooms_list_requests` (
  `Rooms_requests_ID` int NOT NULL,
  `Submitted_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `Rooms_ID` varchar(6) NOT NULL,
  `Used_date` date NOT NULL,
  `Identify_ID` varchar(8) NOT NULL,
  `Start_time` time NOT NULL,
  `End_time` time NOT NULL,
  `Reason` enum('ขอใช้ห้องเพื่อติวหนังสือ','ขอใช้ห้องเพื่อประชุมงานกลุ่ม','ขอใช้ห้องเพื่อจัดกิจกรรมเสริมความรู้') NOT NULL,
  `Requests_status` enum('รอดำเนินการ','รออนุมัติ','อนุมัติ','ไม่อนุมัติ') NOT NULL,
  `Requests_types` enum('ในเวลา','นอกเวลา') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `Rooms_list_requests`
--

INSERT INTO `Rooms_list_requests` (`Rooms_requests_ID`, `Submitted_time`, `Rooms_ID`, `Used_date`, `Identify_ID`, `Start_time`, `End_time`, `Reason`, `Requests_status`, `Requests_types`) VALUES
(1, '2025-01-20 09:00:00', '212', '2025-01-20', '65312994', '08:00:00', '10:00:00', 'ขอใช้ห้องเพื่อติวหนังสือ', 'อนุมัติ', 'ในเวลา'),
(2, '2025-01-20 06:30:00', '307', '2025-01-20', '64312995', '08:00:00', '10:00:00', 'ขอใช้ห้องเพื่อประชุมงานกลุ่ม', 'อนุมัติ', 'ในเวลา'),
(3, '2025-01-20 09:30:00', '307', '2025-01-21', '65312997', '10:00:00', '12:00:00', 'ขอใช้ห้องเพื่อประชุมงานกลุ่ม', 'อนุมัติ', 'ในเวลา'),
(4, '2025-01-20 09:35:00', '308', '2025-01-22', '65312997', '15:00:00', '17:00:00', 'ขอใช้ห้องเพื่อจัดกิจกรรมเสริมความรู้', 'อนุมัติ', 'ในเวลา'),
(5, '2025-01-21 09:00:00', '212', '2025-01-22', '65312994', '17:00:00', '22:00:00', 'ขอใช้ห้องเพื่อติวหนังสือ', 'อนุมัติ', 'นอกเวลา'),
(6, '2025-01-21 09:36:00', '307', '2025-01-23', '64312995', '18:00:00', '22:00:00', 'ขอใช้ห้องเพื่อประชุมงานกลุ่ม', 'อนุมัติ', 'นอกเวลา'),
(7, '2025-01-22 09:40:00', '307', '2025-01-24', '65313000', '17:00:00', '20:00:00', 'ขอใช้ห้องเพื่อประชุมงานกลุ่ม', 'อนุมัติ', 'นอกเวลา'),
(8, '2025-01-23 09:45:00', '308', '2025-01-24', '65313003', '17:00:00', '19:00:00', 'ขอใช้ห้องเพื่อจัดกิจกรรมเสริมความรู้', 'อนุมัติ', 'นอกเวลา'),
(9, '2025-01-23 10:00:00', '212', '2025-01-24', '65313006', '17:00:00', '20:00:00', 'ขอใช้ห้องเพื่อจัดกิจกรรมเสริมความรู้', 'ไม่อนุมัติ', 'นอกเวลา'),
(10, '2025-01-23 10:20:00', '308', '2025-01-24', '65313009', '18:00:00', '21:00:00', 'ขอใช้ห้องเพื่อประชุมงานกลุ่ม', 'ไม่อนุมัติ', 'นอกเวลา'),
(11, '2025-01-24 10:25:00', '311', '2025-01-27', '66312993', '19:00:00', '22:00:00', 'ขอใช้ห้องเพื่อติวหนังสือ', 'ไม่อนุมัติ', 'นอกเวลา'),
(12, '2025-01-24 10:30:00', '407', '2025-01-27', '66312996', '17:00:00', '21:00:00', 'ขอใช้ห้องเพื่อจัดกิจกรรมเสริมความรู้', 'ไม่อนุมัติ', 'นอกเวลา'),
(13, '2025-01-24 10:32:00', '307', '2025-01-27', '66313004', '08:00:00', '10:00:00', 'ขอใช้ห้องเพื่อจัดกิจกรรมเสริมความรู้', 'ไม่อนุมัติ', 'ในเวลา'),
(14, '2025-01-24 11:35:00', '308', '2025-01-27', '66313007', '08:00:00', '10:00:00', 'ขอใช้ห้องเพื่อประชุมงานกลุ่ม', 'ไม่อนุมัติ', 'ในเวลา'),
(15, '2025-01-25 11:38:00', '311', '2025-01-28', '66313010', '13:00:00', '17:00:00', 'ขอใช้ห้องเพื่อติวหนังสือ', 'ไม่อนุมัติ', 'ในเวลา'),
(16, '2025-01-25 11:41:00', '407', '2025-01-28', '67312999', '13:00:00', '15:00:00', 'ขอใช้ห้องเพื่อจัดกิจกรรมเสริมความรู้', 'ไม่อนุมัติ', 'ในเวลา'),
(17, '2025-01-26 12:00:00', '307', '2025-01-29', '65312997', '17:00:00', '22:00:00', 'ขอใช้ห้องเพื่อติวหนังสือ', 'รอดำเนินการ', 'นอกเวลา'),
(18, '2025-01-26 12:30:00', '311', '2025-01-29', '65313000', '18:00:00', '21:00:00', 'ขอใช้ห้องเพื่อประชุมงานกลุ่ม', 'รอดำเนินการ', 'นอกเวลา'),
(19, '2025-01-27 12:35:00', '311', '2025-01-30', '65313003', '19:00:00', '21:00:00', 'ขอใช้ห้องเพื่อจัดกิจกรรมเสริมความรู้', 'รอดำเนินการ', 'นอกเวลา'),
(20, '2025-01-27 12:30:00', '407', '2025-01-30', '65313006', '20:00:00', '22:00:00', 'ขอใช้ห้องเพื่อประชุมงานกลุ่ม', 'รอดำเนินการ', 'นอกเวลา'),
(21, '2025-01-28 13:00:00', '308', '2025-01-31', '65313009', '17:00:00', '22:00:00', 'ขอใช้ห้องเพื่อติวหนังสือ', 'รออนุมัติ', 'นอกเวลา'),
(22, '2025-01-28 13:30:00', '311', '2025-01-31', '66312993', '17:00:00', '21:00:00', 'ขอใช้ห้องเพื่อประชุมงานกลุ่ม', 'รออนุมัติ', 'นอกเวลา'),
(23, '2025-01-29 14:35:00', '311', '2025-02-03', '66312996', '19:00:00', '21:00:00', 'ขอใช้ห้องเพื่อจัดกิจกรรมเสริมความรู้', 'รออนุมัติ', 'นอกเวลา'),
(24, '2025-01-30 15:30:00', '407', '2025-02-03', '66313004', '20:00:00', '22:00:00', 'ขอใช้ห้องเพื่อประชุมงานกลุ่ม', 'รออนุมัติ', 'นอกเวลา'),
(25, '2025-02-08 09:00:00', '307', '2025-02-10', '65312994', '08:00:00', '10:00:00', 'ขอใช้ห้องเพื่อติวหนังสือ', 'อนุมัติ', 'ในเวลา'),
(26, '2025-02-08 10:30:00', '307', '2025-02-11', '64312995', '08:00:00', '10:00:00', 'ขอใช้ห้องเพื่อประชุมงานกลุ่ม', 'อนุมัติ', 'ในเวลา'),
(27, '2025-02-09 10:35:00', '307', '2025-02-12', '65312997', '10:00:00', '12:00:00', 'ขอใช้ห้องเพื่อประชุมงานกลุ่ม', 'อนุมัติ', 'ในเวลา'),
(28, '2025-02-12 09:35:00', '307', '2025-02-14', '65312997', '13:00:00', '15:00:00', 'ขอใช้ห้องเพื่อจัดกิจกรรมเสริมความรู้', 'อนุมัติ', 'ในเวลา'),
(29, '2025-02-10 09:00:00', '307', '2025-02-10', '65312994', '17:00:00', '22:00:00', 'ขอใช้ห้องเพื่อติวหนังสือ', 'รอดำเนินการ', 'นอกเวลา'),
(30, '2025-02-10 10:30:00', '307', '2025-02-11', '64312995', '18:00:00', '20:00:00', 'ขอใช้ห้องเพื่อประชุมงานกลุ่ม', 'รอดำเนินการ', 'นอกเวลา'),
(31, '2025-02-11 10:35:00', '307', '2025-02-12', '65312997', '17:00:00', '21:00:00', 'ขอใช้ห้องเพื่อประชุมงานกลุ่ม', 'รอดำเนินการ', 'นอกเวลา'),
(32, '2025-02-11 00:22:00', '307', '2025-02-14', '65312997', '19:00:00', '22:00:00', 'ขอใช้ห้องเพื่อจัดกิจกรรมเสริมความรู้', 'รอดำเนินการ', 'นอกเวลา');

-- --------------------------------------------------------

--
-- Table structure for table `Rooms_schedule_time`
--

CREATE TABLE `Rooms_schedule_time` (
  `Schedule_time_ID` int NOT NULL,
  `Rooms_ID` varchar(6) NOT NULL,
  `Week_days` enum('จันทร์','อังคาร','พุธ','พฤหัสบดี','ศุกร์','เสาร์','อาทิตย์') DEFAULT NULL,
  `Start_time` time NOT NULL,
  `End_time` time NOT NULL,
  `Rooms_status` enum('มีเรียน','ว่าง','ไม่ว่าง','กำลังปรับปรุง') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `Rooms_schedule_time`
--

INSERT INTO `Rooms_schedule_time` (`Schedule_time_ID`, `Rooms_ID`, `Week_days`, `Start_time`, `End_time`, `Rooms_status`) VALUES
(1, '307', 'จันทร์', '10:00:00', '11:00:00', 'มีเรียน'),
(2, '307', 'จันทร์', '11:00:00', '12:00:00', 'มีเรียน'),
(3, '307', 'จันทร์', '13:00:00', '14:00:00', 'มีเรียน'),
(4, '307', 'จันทร์', '14:00:00', '15:00:00', 'มีเรียน'),
(5, '307', 'จันทร์', '15:00:00', '16:00:00', 'มีเรียน'),
(6, '307', 'จันทร์', '16:00:00', '17:00:00', 'มีเรียน'),
(7, '307', 'อังคาร', '08:00:00', '09:00:00', 'มีเรียน'),
(8, '307', 'อังคาร', '09:00:00', '10:00:00', 'มีเรียน'),
(9, '307', 'อังคาร', '13:00:00', '14:00:00', 'มีเรียน'),
(10, '307', 'อังคาร', '14:00:00', '15:00:00', 'มีเรียน'),
(11, '307', 'อังคาร', '15:00:00', '16:00:00', 'มีเรียน'),
(12, '307', 'อังคาร', '16:00:00', '17:00:00', 'มีเรียน'),
(13, '307', 'พุธ', '08:00:00', '09:00:00', 'มีเรียน'),
(14, '307', 'พุธ', '09:00:00', '10:00:00', 'มีเรียน'),
(15, '307', 'พุธ', '10:00:00', '11:00:00', 'มีเรียน'),
(16, '307', 'พุธ', '11:00:00', '12:00:00', 'มีเรียน'),
(17, '307', 'พุธ', '13:00:00', '14:00:00', 'มีเรียน'),
(18, '307', 'พุธ', '14:00:00', '15:00:00', 'มีเรียน'),
(19, '307', 'พุธ', '15:00:00', '16:00:00', 'มีเรียน'),
(20, '307', 'พุธ', '16:00:00', '17:00:00', 'มีเรียน'),
(21, '307', 'พฤหัสบดี', '08:00:00', '09:00:00', 'มีเรียน'),
(22, '307', 'พฤหัสบดี', '09:00:00', '10:00:00', 'มีเรียน'),
(23, '307', 'พฤหัสบดี', '10:00:00', '11:00:00', 'มีเรียน'),
(24, '307', 'พฤหัสบดี', '11:00:00', '12:00:00', 'มีเรียน'),
(25, '307', 'พฤหัสบดี', '13:00:00', '14:00:00', 'มีเรียน'),
(26, '307', 'พฤหัสบดี', '14:00:00', '15:00:00', 'มีเรียน'),
(27, '307', 'พฤหัสบดี', '15:00:00', '16:00:00', 'มีเรียน'),
(28, '307', 'พฤหัสบดี', '16:00:00', '17:00:00', 'มีเรียน'),
(29, '307', 'ศุกร์', '10:00:00', '11:00:00', 'มีเรียน'),
(30, '307', 'ศุกร์', '11:00:00', '12:00:00', 'มีเรียน'),
(31, '307', 'ศุกร์', '15:00:00', '16:00:00', 'มีเรียน'),
(32, '307', 'ศุกร์', '16:00:00', '17:00:00', 'มีเรียน');

-- --------------------------------------------------------

--
-- Table structure for table `Student_information`
--

CREATE TABLE `Student_information` (
  `Student_ID` varchar(8) NOT NULL,
  `Name` varchar(100) NOT NULL,
  `Department` varchar(100) NOT NULL,
  `Faculty` varchar(100) NOT NULL,
  `Study_year` int NOT NULL,
  `Degree` enum('ปริญญาตรี','ปริญญาโท','ปริญญาเอก') NOT NULL,
  `Email` varchar(100) NOT NULL,
  `Phone_number` varchar(10) NOT NULL,
  `Status` enum('นิสิต') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `Student_information`
--

INSERT INTO `Student_information` (`Student_ID`, `Name`, `Department`, `Faculty`, `Study_year`, `Degree`, `Email`, `Phone_number`, `Status`) VALUES
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

-- --------------------------------------------------------

--
-- Table structure for table `Teacher_information`
--

CREATE TABLE `Teacher_information` (
  `Teacher_ID` varchar(8) NOT NULL,
  `Name` varchar(100) NOT NULL,
  `Department` varchar(100) NOT NULL,
  `Faculty` varchar(100) NOT NULL,
  `Email` varchar(100) NOT NULL,
  `Phone_number` varchar(10) NOT NULL,
  `Status` enum('อาจารย์') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `Teacher_information`
--

INSERT INTO `Teacher_information` (`Teacher_ID`, `Name`, `Department`, `Faculty`, `Email`, `Phone_number`, `Status`) VALUES
('CS653129', 'สมชาย พันธ์ดี', 'วิทยาการคอมพิวเตอร์', 'คณะวิทยาศาสตร์', 'somchai.p.teacher@example.com', '0912345678', 'อาจารย์'),
('CS663129', 'อภิชาติ สุขสม', 'วิทยาการคอมพิวเตอร์', 'คณะวิทยาศาสตร์', 'apichat.s.teacher@example.com', '0915678901', 'อาจารย์'),
('CS673129', 'เมธาวี จันทรา', 'วิทยาการคอมพิวเตอร์', 'คณะวิทยาศาสตร์', 'methawi.c.teacher@example.com', '0918901234', 'อาจารย์'),
('CS673131', 'อรพรรณ แสงสุริยะ', 'วิทยาการคอมพิวเตอร์', 'คณะวิทยาศาสตร์', 'orapan.s.teacher@example.com', '0921234567', 'อาจารย์'),
('DS653129', 'สมหญิง รุ่งโรจน์', 'วิทยาการข้อมูล', 'คณะวิทยาศาสตร์', 'somhun.r.teacher@example.com', '0913456789', 'อาจารย์'),
('DS663129', 'นภัสวรรณ บัวทอง', 'วิทยาการข้อมูล', 'คณะวิทยาศาสตร์', 'napatsawan.b.teacher@example.com', '0916789012', 'อาจารย์'),
('DS673130', 'ธนากร สุดใจ', 'วิทยาการข้อมูล', 'คณะวิทยาศาสตร์', 'thanakorn.s.teacher@example.com', '0919012345', 'อาจารย์'),
('IT653129', 'สุกานดา ศรีประเสริฐ', 'เทคโนโลยีสารสนเทศ', 'คณะวิทยาศาสตร์', 'sukanda.s.teacher@example.com', '0914567890', 'อาจารย์'),
('IT663129', 'เกรียงไกร วิชชุภักดี', 'เทคโนโลยีสารสนเทศ', 'คณะวิทยาศาสตร์', 'kriengkhai.w.teacher@example.com', '0917890123', 'อาจารย์'),
('IT673130', 'พิมพ์ชนก ลีลาชัย', 'เทคโนโลยีสารสนเทศ', 'คณะวิทยาศาสตร์', 'phimchanok.l.teacher@example.com', '0920123456', 'อาจารย์');

-- --------------------------------------------------------

--
-- Table structure for table `Users_accounts`
--

CREATE TABLE `Users_accounts` (
  `Username` varchar(8) NOT NULL,
  `Password` varchar(255) NOT NULL,
  `Role` enum('ผู้ดูแลห้อง','อาจารย์','นิสิต','ผู้บริหาร') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `Users_accounts`
--

INSERT INTO `Users_accounts` (`Username`, `Password`, `Role`) VALUES
('64312995', '1234', 'นิสิต'),
('65312994', '1234', 'นิสิต'),
('65312997', '1234', 'นิสิต'),
('ADCS5624', '1234', 'ผู้ดูแลห้อง'),
('ADCS7823', '1234', 'ผู้ดูแลห้อง'),
('CS653129', '1234', 'อาจารย์'),
('CS663129', '1234', 'อาจารย์'),
('CS673129', '1234', 'อาจารย์'),
('CSB25645', '1234', 'ผู้บริหาร');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Admin_information`
--
ALTER TABLE `Admin_information`
  ADD PRIMARY KEY (`Admin_ID`);

--
-- Indexes for table `Computer_list_requests`
--
ALTER TABLE `Computer_list_requests`
  ADD PRIMARY KEY (`Rooms_requests_ID`,`Computer_ID`),
  ADD KEY `Computer_ID` (`Computer_ID`,`Rooms_ID`);

--
-- Indexes for table `Equipments_list_brokened`
--
ALTER TABLE `Equipments_list_brokened`
  ADD PRIMARY KEY (`Repair_numbers`),
  ADD KEY `Rooms_ID` (`Rooms_ID`),
  ADD KEY `Equipments_ID` (`Equipments_ID`),
  ADD KEY `Admin_ID` (`Admin_ID`);

--
-- Indexes for table `Equipments_list_information`
--
ALTER TABLE `Equipments_list_information`
  ADD PRIMARY KEY (`Equipments_ID`);

--
-- Indexes for table `Equipments_list_requests`
--
ALTER TABLE `Equipments_list_requests`
  ADD PRIMARY KEY (`Rooms_requests_ID`,`Equipments_ID`),
  ADD KEY `Equipments_ID` (`Equipments_ID`,`Rooms_ID`);

--
-- Indexes for table `Executive_information`
--
ALTER TABLE `Executive_information`
  ADD PRIMARY KEY (`Executive_ID`);

--
-- Indexes for table `Manage_computers`
--
ALTER TABLE `Manage_computers`
  ADD PRIMARY KEY (`Computer_ID`,`Rooms_ID`),
  ADD KEY `Rooms_ID` (`Rooms_ID`);

--
-- Indexes for table `Manage_equipments`
--
ALTER TABLE `Manage_equipments`
  ADD PRIMARY KEY (`Equipments_ID`,`Rooms_ID`),
  ADD KEY `Rooms_ID` (`Rooms_ID`);

--
-- Indexes for table `Name_list_requests_rooms`
--
ALTER TABLE `Name_list_requests_rooms`
  ADD PRIMARY KEY (`Rooms_requests_ID`,`Identify_ID`);

--
-- Indexes for table `Rooms_list_information`
--
ALTER TABLE `Rooms_list_information`
  ADD PRIMARY KEY (`Rooms_ID`);

--
-- Indexes for table `Rooms_list_requests`
--
ALTER TABLE `Rooms_list_requests`
  ADD PRIMARY KEY (`Rooms_requests_ID`),
  ADD KEY `Rooms_ID` (`Rooms_ID`);

--
-- Indexes for table `Rooms_schedule_time`
--
ALTER TABLE `Rooms_schedule_time`
  ADD PRIMARY KEY (`Schedule_time_ID`),
  ADD KEY `Rooms_ID` (`Rooms_ID`);

--
-- Indexes for table `Student_information`
--
ALTER TABLE `Student_information`
  ADD PRIMARY KEY (`Student_ID`);

--
-- Indexes for table `Teacher_information`
--
ALTER TABLE `Teacher_information`
  ADD PRIMARY KEY (`Teacher_ID`);

--
-- Indexes for table `Users_accounts`
--
ALTER TABLE `Users_accounts`
  ADD PRIMARY KEY (`Username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Equipments_list_information`
--
ALTER TABLE `Equipments_list_information`
  MODIFY `Equipments_ID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `Rooms_list_requests`
--
ALTER TABLE `Rooms_list_requests`
  MODIFY `Rooms_requests_ID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT for table `Rooms_schedule_time`
--
ALTER TABLE `Rooms_schedule_time`
  MODIFY `Schedule_time_ID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `Computer_list_requests`
--
ALTER TABLE `Computer_list_requests`
  ADD CONSTRAINT `Computer_list_requests_ibfk_1` FOREIGN KEY (`Rooms_requests_ID`) REFERENCES `Rooms_list_requests` (`Rooms_requests_ID`),
  ADD CONSTRAINT `Computer_list_requests_ibfk_2` FOREIGN KEY (`Computer_ID`,`Rooms_ID`) REFERENCES `Manage_computers` (`Computer_ID`, `Rooms_ID`);

--
-- Constraints for table `Equipments_list_brokened`
--
ALTER TABLE `Equipments_list_brokened`
  ADD CONSTRAINT `Equipments_list_brokened_ibfk_1` FOREIGN KEY (`Rooms_ID`) REFERENCES `Rooms_list_information` (`Rooms_ID`),
  ADD CONSTRAINT `Equipments_list_brokened_ibfk_2` FOREIGN KEY (`Equipments_ID`) REFERENCES `Equipments_list_information` (`Equipments_ID`),
  ADD CONSTRAINT `Equipments_list_brokened_ibfk_3` FOREIGN KEY (`Admin_ID`) REFERENCES `Admin_information` (`Admin_ID`);

--
-- Constraints for table `Equipments_list_requests`
--
ALTER TABLE `Equipments_list_requests`
  ADD CONSTRAINT `Equipments_list_requests_ibfk_1` FOREIGN KEY (`Rooms_requests_ID`) REFERENCES `Rooms_list_requests` (`Rooms_requests_ID`),
  ADD CONSTRAINT `Equipments_list_requests_ibfk_2` FOREIGN KEY (`Equipments_ID`,`Rooms_ID`) REFERENCES `Manage_equipments` (`Equipments_ID`, `Rooms_ID`);

--
-- Constraints for table `Manage_computers`
--
ALTER TABLE `Manage_computers`
  ADD CONSTRAINT `Manage_computers_ibfk_1` FOREIGN KEY (`Rooms_ID`) REFERENCES `Rooms_list_information` (`Rooms_ID`);

--
-- Constraints for table `Manage_equipments`
--
ALTER TABLE `Manage_equipments`
  ADD CONSTRAINT `Manage_equipments_ibfk_1` FOREIGN KEY (`Equipments_ID`) REFERENCES `Equipments_list_information` (`Equipments_ID`),
  ADD CONSTRAINT `Manage_equipments_ibfk_2` FOREIGN KEY (`Rooms_ID`) REFERENCES `Rooms_list_information` (`Rooms_ID`);

--
-- Constraints for table `Name_list_requests_rooms`
--
ALTER TABLE `Name_list_requests_rooms`
  ADD CONSTRAINT `Name_list_requests_rooms_ibfk_1` FOREIGN KEY (`Rooms_requests_ID`) REFERENCES `Rooms_list_requests` (`Rooms_requests_ID`);

--
-- Constraints for table `Rooms_list_requests`
--
ALTER TABLE `Rooms_list_requests`
  ADD CONSTRAINT `Rooms_list_requests_ibfk_1` FOREIGN KEY (`Rooms_ID`) REFERENCES `Rooms_list_information` (`Rooms_ID`);

--
-- Constraints for table `Rooms_schedule_time`
--
ALTER TABLE `Rooms_schedule_time`
  ADD CONSTRAINT `Rooms_schedule_time_ibfk_1` FOREIGN KEY (`Rooms_ID`) REFERENCES `Rooms_list_information` (`Rooms_ID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
