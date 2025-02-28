-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: easyroom-dev-panyakorn-easyroom-db.h.aivencloud.com:18123
-- Generation Time: Feb 24, 2025 at 02:10 PM
-- Server version: 8.0.35
-- PHP Version: 8.2.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `easyroom`
--

-- --------------------------------------------------------

--
-- Table structure for table `room_request_participant`
--

CREATE TABLE `room_request_participant` (
  `room_request_participant_id` int NOT NULL,
  `room_request_id` int NOT NULL,
  `student_id` varchar(8) DEFAULT NULL,
  `teacher_id` varchar(8) DEFAULT NULL,
  `role` enum('ผู้ขอใช้','ผู้เข้าร่วม') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `room_request_participant`
--

INSERT INTO `room_request_participant` (`room_request_participant_id`, `room_request_id`, `student_id`, `teacher_id`, `role`) VALUES
(1067, 1, NULL, 'CS673129', 'ผู้ขอใช้'),
(1068, 2, '64312995', NULL, 'ผู้ขอใช้'),
(1069, 3, '65312994', NULL, 'ผู้ขอใช้'),
(1070, 4, NULL, 'CS663129', 'ผู้ขอใช้'),
(1071, 5, '65312994', NULL, 'ผู้ขอใช้'),
(1072, 5, '66313010', NULL, 'ผู้เข้าร่วม'),
(1073, 5, '67313011', NULL, 'ผู้เข้าร่วม'),
(1074, 6, NULL, 'CS663129', 'ผู้ขอใช้'),
(1075, 7, '65312997', NULL, 'ผู้ขอใช้'),
(1076, 8, NULL, 'CS663129', 'ผู้ขอใช้'),
(1077, 9, NULL, 'CS673129', 'ผู้ขอใช้'),
(1078, 10, NULL, 'CS653129', 'ผู้ขอใช้'),
(1079, 11, NULL, 'CS653129', 'ผู้ขอใช้'),
(1080, 12, '65312997', NULL, 'ผู้ขอใช้'),
(1081, 12, '67313002', NULL, 'ผู้เข้าร่วม'),
(1082, 12, '65313009', NULL, 'ผู้เข้าร่วม'),
(1083, 12, '65313000', NULL, 'ผู้เข้าร่วม'),
(1084, 12, '66313007', NULL, 'ผู้เข้าร่วม'),
(1085, 12, '66312993', NULL, 'ผู้เข้าร่วม'),
(1086, 13, NULL, 'CS673129', 'ผู้ขอใช้'),
(1087, 14, '64312995', NULL, 'ผู้ขอใช้'),
(1088, 14, '67313008', NULL, 'ผู้เข้าร่วม'),
(1089, 14, '66312996', NULL, 'ผู้เข้าร่วม'),
(1090, 14, '66313010', NULL, 'ผู้เข้าร่วม'),
(1091, 14, '66313010', NULL, 'ผู้เข้าร่วม'),
(1092, 14, '66313004', NULL, 'ผู้เข้าร่วม'),
(1093, 14, '64313001', NULL, 'ผู้เข้าร่วม'),
(1094, 15, NULL, 'CS663129', 'ผู้ขอใช้'),
(1095, 16, NULL, 'CS663129', 'ผู้ขอใช้'),
(1096, 17, '64312995', NULL, 'ผู้ขอใช้'),
(1097, 17, '66313010', NULL, 'ผู้เข้าร่วม'),
(1098, 17, '65313000', NULL, 'ผู้เข้าร่วม'),
(1099, 17, '66313010', NULL, 'ผู้เข้าร่วม'),
(1100, 17, '65313006', NULL, 'ผู้เข้าร่วม'),
(1101, 17, '64313001', NULL, 'ผู้เข้าร่วม'),
(1102, 17, '65313006', NULL, 'ผู้เข้าร่วม'),
(1103, 18, NULL, 'CS673129', 'ผู้ขอใช้'),
(1104, 19, '65312994', NULL, 'ผู้ขอใช้'),
(1105, 19, '64312995', NULL, 'ผู้เข้าร่วม'),
(1106, 19, '64313005', NULL, 'ผู้เข้าร่วม'),
(1107, 19, '66313007', NULL, 'ผู้เข้าร่วม'),
(1108, 19, '64313001', NULL, 'ผู้เข้าร่วม'),
(1109, 19, '66312996', NULL, 'ผู้เข้าร่วม'),
(1110, 19, '65313009', NULL, 'ผู้เข้าร่วม'),
(1111, 20, '65312997', NULL, 'ผู้ขอใช้'),
(1112, 20, '67313011', NULL, 'ผู้เข้าร่วม'),
(1113, 20, '66312996', NULL, 'ผู้เข้าร่วม'),
(1114, 21, '65312997', NULL, 'ผู้ขอใช้'),
(1115, 21, '64312998', NULL, 'ผู้เข้าร่วม'),
(1116, 21, '66313010', NULL, 'ผู้เข้าร่วม'),
(1117, 21, '65313009', NULL, 'ผู้เข้าร่วม'),
(1118, 21, '66313007', NULL, 'ผู้เข้าร่วม'),
(1119, 21, '67313011', NULL, 'ผู้เข้าร่วม'),
(1120, 21, '66313007', NULL, 'ผู้เข้าร่วม'),
(1121, 21, '65312994', NULL, 'ผู้เข้าร่วม'),
(1122, 22, '65312997', NULL, 'ผู้ขอใช้'),
(1123, 22, '67313002', NULL, 'ผู้เข้าร่วม'),
(1124, 23, '65312994', NULL, 'ผู้ขอใช้'),
(1125, 23, '64313012', NULL, 'ผู้เข้าร่วม'),
(1126, 23, '66312996', NULL, 'ผู้เข้าร่วม'),
(1127, 23, '65313009', NULL, 'ผู้เข้าร่วม'),
(1128, 23, '67313002', NULL, 'ผู้เข้าร่วม'),
(1129, 24, '65312994', NULL, 'ผู้ขอใช้'),
(1130, 24, '64313012', NULL, 'ผู้เข้าร่วม'),
(1131, 25, NULL, 'CS653129', 'ผู้ขอใช้'),
(1132, 26, '65312997', NULL, 'ผู้ขอใช้'),
(1133, 26, '64313001', NULL, 'ผู้เข้าร่วม'),
(1134, 26, '66313004', NULL, 'ผู้เข้าร่วม'),
(1135, 26, '66313007', NULL, 'ผู้เข้าร่วม'),
(1136, 26, '64313012', NULL, 'ผู้เข้าร่วม'),
(1137, 26, '64312995', NULL, 'ผู้เข้าร่วม'),
(1138, 26, '65313000', NULL, 'ผู้เข้าร่วม'),
(1139, 27, '64312995', NULL, 'ผู้ขอใช้'),
(1140, 28, '65312997', NULL, 'ผู้ขอใช้'),
(1141, 28, '64313012', NULL, 'ผู้เข้าร่วม'),
(1142, 28, '67312999', NULL, 'ผู้เข้าร่วม'),
(1143, 28, '65313009', NULL, 'ผู้เข้าร่วม'),
(1144, 28, '65313009', NULL, 'ผู้เข้าร่วม'),
(1145, 29, '64312995', NULL, 'ผู้ขอใช้'),
(1146, 30, '65312997', NULL, 'ผู้ขอใช้'),
(1147, 30, '65313003', NULL, 'ผู้เข้าร่วม'),
(1148, 30, '64313001', NULL, 'ผู้เข้าร่วม'),
(1149, 30, '66312993', NULL, 'ผู้เข้าร่วม'),
(1150, 30, '67312999', NULL, 'ผู้เข้าร่วม'),
(1151, 30, '66312996', NULL, 'ผู้เข้าร่วม'),
(1152, 31, '65312994', NULL, 'ผู้ขอใช้'),
(1153, 31, '66313007', NULL, 'ผู้เข้าร่วม'),
(1154, 31, '64313001', NULL, 'ผู้เข้าร่วม'),
(1155, 31, '67313002', NULL, 'ผู้เข้าร่วม'),
(1156, 32, '64312995', NULL, 'ผู้ขอใช้'),
(1157, 32, '66313007', NULL, 'ผู้เข้าร่วม'),
(1158, 33, '64312995', NULL, 'ผู้ขอใช้'),
(1159, 33, '65312994', NULL, 'ผู้เข้าร่วม'),
(1160, 33, '64313005', NULL, 'ผู้เข้าร่วม'),
(1161, 33, '67313002', NULL, 'ผู้เข้าร่วม'),
(1162, 33, '66312996', NULL, 'ผู้เข้าร่วม'),
(1163, 33, '65313000', NULL, 'ผู้เข้าร่วม'),
(1164, 33, '64313012', NULL, 'ผู้เข้าร่วม'),
(1165, 33, '66313010', NULL, 'ผู้เข้าร่วม'),
(1166, 34, NULL, 'CS673129', 'ผู้ขอใช้'),
(1167, 35, '64312995', NULL, 'ผู้ขอใช้'),
(1168, 35, '67312999', NULL, 'ผู้เข้าร่วม'),
(1169, 35, '65313003', NULL, 'ผู้เข้าร่วม'),
(1170, 35, '65313009', NULL, 'ผู้เข้าร่วม'),
(1171, 35, '64313001', NULL, 'ผู้เข้าร่วม'),
(1172, 36, '64312995', NULL, 'ผู้ขอใช้'),
(1173, 36, '67312999', NULL, 'ผู้เข้าร่วม'),
(1174, 37, NULL, 'CS673129', 'ผู้ขอใช้'),
(1175, 38, '65312997', NULL, 'ผู้ขอใช้'),
(1176, 38, '64312998', NULL, 'ผู้เข้าร่วม'),
(1177, 38, '65313009', NULL, 'ผู้เข้าร่วม'),
(1178, 38, '64313005', NULL, 'ผู้เข้าร่วม'),
(1179, 38, '65313009', NULL, 'ผู้เข้าร่วม'),
(1180, 39, '64312995', NULL, 'ผู้ขอใช้'),
(1181, 40, '65312994', NULL, 'ผู้ขอใช้'),
(1182, 40, '64312995', NULL, 'ผู้เข้าร่วม'),
(1183, 40, '65313000', NULL, 'ผู้เข้าร่วม'),
(1184, 40, '66312993', NULL, 'ผู้เข้าร่วม'),
(1185, 40, '66312993', NULL, 'ผู้เข้าร่วม'),
(1186, 40, '66312996', NULL, 'ผู้เข้าร่วม'),
(1187, 41, '65312994', NULL, 'ผู้ขอใช้'),
(1188, 41, '64312998', NULL, 'ผู้เข้าร่วม'),
(1189, 42, NULL, 'CS673129', 'ผู้ขอใช้'),
(1190, 43, NULL, 'CS673129', 'ผู้ขอใช้'),
(1191, 44, NULL, 'CS663129', 'ผู้ขอใช้'),
(1192, 45, '65312994', NULL, 'ผู้ขอใช้'),
(1193, 46, NULL, 'CS653129', 'ผู้ขอใช้'),
(1194, 47, '65312994', NULL, 'ผู้ขอใช้'),
(1195, 47, '66312993', NULL, 'ผู้เข้าร่วม'),
(1196, 47, '64313005', NULL, 'ผู้เข้าร่วม'),
(1197, 48, NULL, 'CS653129', 'ผู้ขอใช้'),
(1198, 49, '65312994', NULL, 'ผู้ขอใช้'),
(1199, 49, '67313008', NULL, 'ผู้เข้าร่วม'),
(1200, 49, '65313000', NULL, 'ผู้เข้าร่วม'),
(1201, 49, '67313011', NULL, 'ผู้เข้าร่วม'),
(1202, 50, '64312995', NULL, 'ผู้ขอใช้'),
(1203, 50, '67312999', NULL, 'ผู้เข้าร่วม'),
(1204, 50, '66313010', NULL, 'ผู้เข้าร่วม'),
(1205, 50, '65312994', NULL, 'ผู้เข้าร่วม'),
(1206, 51, NULL, 'CS673129', 'ผู้ขอใช้'),
(1207, 52, '65312994', NULL, 'ผู้ขอใช้'),
(1208, 53, '64312995', NULL, 'ผู้ขอใช้'),
(1209, 53, '64313001', NULL, 'ผู้เข้าร่วม'),
(1210, 53, '64313012', NULL, 'ผู้เข้าร่วม'),
(1211, 53, '67313002', NULL, 'ผู้เข้าร่วม'),
(1212, 53, '65312994', NULL, 'ผู้เข้าร่วม'),
(1213, 53, '65313003', NULL, 'ผู้เข้าร่วม'),
(1214, 53, '67313008', NULL, 'ผู้เข้าร่วม'),
(1215, 54, '65312994', NULL, 'ผู้ขอใช้'),
(1216, 54, '67313008', NULL, 'ผู้เข้าร่วม'),
(1217, 54, '65313000', NULL, 'ผู้เข้าร่วม'),
(1218, 54, '66312993', NULL, 'ผู้เข้าร่วม'),
(1219, 54, '65313000', NULL, 'ผู้เข้าร่วม'),
(1220, 54, '65313006', NULL, 'ผู้เข้าร่วม'),
(1221, 55, '64312995', NULL, 'ผู้ขอใช้'),
(1222, 55, '65313009', NULL, 'ผู้เข้าร่วม'),
(1223, 55, '64312998', NULL, 'ผู้เข้าร่วม'),
(1224, 56, NULL, 'CS653129', 'ผู้ขอใช้'),
(1225, 57, '65312997', NULL, 'ผู้ขอใช้'),
(1226, 57, '65313003', NULL, 'ผู้เข้าร่วม'),
(1227, 57, '66313010', NULL, 'ผู้เข้าร่วม'),
(1228, 57, '65313003', NULL, 'ผู้เข้าร่วม'),
(1229, 57, '65312994', NULL, 'ผู้เข้าร่วม'),
(1230, 58, NULL, 'CS663129', 'ผู้ขอใช้'),
(1231, 59, '65312994', NULL, 'ผู้ขอใช้'),
(1232, 59, '65313000', NULL, 'ผู้เข้าร่วม'),
(1233, 59, '65313009', NULL, 'ผู้เข้าร่วม'),
(1234, 59, '65313003', NULL, 'ผู้เข้าร่วม'),
(1235, 60, '64312995', NULL, 'ผู้ขอใช้'),
(1236, 60, '64313005', NULL, 'ผู้เข้าร่วม'),
(1237, 60, '65313000', NULL, 'ผู้เข้าร่วม'),
(1238, 61, '64312995', NULL, 'ผู้ขอใช้'),
(1239, 61, '64313001', NULL, 'ผู้เข้าร่วม'),
(1240, 61, '65312997', NULL, 'ผู้เข้าร่วม'),
(1241, 61, '65312997', NULL, 'ผู้เข้าร่วม'),
(1242, 62, NULL, 'CS673129', 'ผู้ขอใช้'),
(1243, 63, NULL, 'CS653129', 'ผู้ขอใช้'),
(1244, 64, NULL, 'CS673129', 'ผู้ขอใช้'),
(1245, 65, NULL, 'CS673129', 'ผู้ขอใช้'),
(1246, 66, NULL, 'CS673129', 'ผู้ขอใช้'),
(1247, 67, '64312995', NULL, 'ผู้ขอใช้'),
(1248, 68, '65312994', NULL, 'ผู้ขอใช้'),
(1249, 69, '64312995', NULL, 'ผู้ขอใช้'),
(1250, 69, '65312994', NULL, 'ผู้เข้าร่วม'),
(1251, 69, '67312999', NULL, 'ผู้เข้าร่วม'),
(1252, 69, '64312998', NULL, 'ผู้เข้าร่วม'),
(1253, 69, '64313001', NULL, 'ผู้เข้าร่วม'),
(1254, 69, '65313003', NULL, 'ผู้เข้าร่วม'),
(1255, 69, '67312999', NULL, 'ผู้เข้าร่วม'),
(1256, 69, '66313004', NULL, 'ผู้เข้าร่วม'),
(1257, 70, NULL, 'CS673129', 'ผู้ขอใช้'),
(1258, 71, NULL, 'CS663129', 'ผู้ขอใช้'),
(1259, 72, '65312994', NULL, 'ผู้ขอใช้'),
(1260, 72, '66313004', NULL, 'ผู้เข้าร่วม'),
(1261, 72, '66313007', NULL, 'ผู้เข้าร่วม'),
(1262, 72, '66312993', NULL, 'ผู้เข้าร่วม'),
(1263, 72, '66313007', NULL, 'ผู้เข้าร่วม'),
(1264, 72, '67312999', NULL, 'ผู้เข้าร่วม'),
(1265, 72, '66312993', NULL, 'ผู้เข้าร่วม'),
(1266, 73, '64312995', NULL, 'ผู้ขอใช้'),
(1267, 73, '65313000', NULL, 'ผู้เข้าร่วม'),
(1268, 73, '65312994', NULL, 'ผู้เข้าร่วม'),
(1269, 73, '66313010', NULL, 'ผู้เข้าร่วม'),
(1270, 74, NULL, 'CS663129', 'ผู้ขอใช้'),
(1271, 75, '65312997', NULL, 'ผู้ขอใช้'),
(1272, 75, '65313009', NULL, 'ผู้เข้าร่วม'),
(1273, 75, '64312998', NULL, 'ผู้เข้าร่วม'),
(1274, 75, '65312994', NULL, 'ผู้เข้าร่วม'),
(1275, 75, '67313002', NULL, 'ผู้เข้าร่วม'),
(1276, 75, '66312993', NULL, 'ผู้เข้าร่วม'),
(1277, 76, '65312997', NULL, 'ผู้ขอใช้'),
(1278, 77, '64312995', NULL, 'ผู้ขอใช้'),
(1279, 78, NULL, 'CS663129', 'ผู้ขอใช้'),
(1280, 79, '64312995', NULL, 'ผู้ขอใช้'),
(1281, 79, '67313002', NULL, 'ผู้เข้าร่วม'),
(1282, 79, '65313000', NULL, 'ผู้เข้าร่วม'),
(1283, 79, '66312993', NULL, 'ผู้เข้าร่วม'),
(1284, 80, NULL, 'CS663129', 'ผู้ขอใช้'),
(1285, 81, NULL, 'CS663129', 'ผู้ขอใช้'),
(1286, 82, '64312995', NULL, 'ผู้ขอใช้'),
(1287, 82, '64313012', NULL, 'ผู้เข้าร่วม'),
(1288, 82, '64313012', NULL, 'ผู้เข้าร่วม'),
(1289, 82, '66313004', NULL, 'ผู้เข้าร่วม'),
(1290, 82, '66313010', NULL, 'ผู้เข้าร่วม'),
(1291, 82, '66313007', NULL, 'ผู้เข้าร่วม'),
(1292, 83, '64312995', NULL, 'ผู้ขอใช้'),
(1293, 83, '66313007', NULL, 'ผู้เข้าร่วม'),
(1294, 83, '66312996', NULL, 'ผู้เข้าร่วม'),
(1295, 83, '64313005', NULL, 'ผู้เข้าร่วม'),
(1296, 83, '64312998', NULL, 'ผู้เข้าร่วม'),
(1297, 83, '66313004', NULL, 'ผู้เข้าร่วม'),
(1298, 83, '67312999', NULL, 'ผู้เข้าร่วม'),
(1299, 84, NULL, 'CS653129', 'ผู้ขอใช้'),
(1300, 85, '65312997', NULL, 'ผู้ขอใช้'),
(1301, 85, '64313001', NULL, 'ผู้เข้าร่วม'),
(1302, 85, '66313007', NULL, 'ผู้เข้าร่วม'),
(1303, 85, '67313011', NULL, 'ผู้เข้าร่วม'),
(1304, 85, '66312993', NULL, 'ผู้เข้าร่วม'),
(1305, 85, '67313008', NULL, 'ผู้เข้าร่วม'),
(1306, 86, '65312994', NULL, 'ผู้ขอใช้'),
(1307, 86, '64313012', NULL, 'ผู้เข้าร่วม'),
(1308, 86, '67313002', NULL, 'ผู้เข้าร่วม'),
(1309, 86, '66313007', NULL, 'ผู้เข้าร่วม'),
(1310, 86, '64313005', NULL, 'ผู้เข้าร่วม'),
(1311, 86, '65312997', NULL, 'ผู้เข้าร่วม'),
(1312, 86, '66313010', NULL, 'ผู้เข้าร่วม'),
(1313, 87, NULL, 'CS673129', 'ผู้ขอใช้'),
(1314, 88, NULL, 'CS653129', 'ผู้ขอใช้'),
(1315, 89, '65312994', NULL, 'ผู้ขอใช้'),
(1316, 89, '67312999', NULL, 'ผู้เข้าร่วม'),
(1317, 89, '65313003', NULL, 'ผู้เข้าร่วม'),
(1318, 89, '66312996', NULL, 'ผู้เข้าร่วม'),
(1319, 89, '67313011', NULL, 'ผู้เข้าร่วม'),
(1320, 89, '64313001', NULL, 'ผู้เข้าร่วม'),
(1321, 89, '65313003', NULL, 'ผู้เข้าร่วม'),
(1322, 89, '66313010', NULL, 'ผู้เข้าร่วม'),
(1323, 90, '64312995', NULL, 'ผู้ขอใช้'),
(1324, 91, '64312995', NULL, 'ผู้ขอใช้'),
(1325, 91, '65312997', NULL, 'ผู้เข้าร่วม'),
(1326, 91, '65313003', NULL, 'ผู้เข้าร่วม'),
(1327, 91, '64313005', NULL, 'ผู้เข้าร่วม'),
(1328, 92, '65312997', NULL, 'ผู้ขอใช้'),
(1329, 93, NULL, 'CS653129', 'ผู้ขอใช้'),
(1330, 94, '64312995', NULL, 'ผู้ขอใช้'),
(1331, 95, NULL, 'CS673129', 'ผู้ขอใช้'),
(1332, 96, '65312997', NULL, 'ผู้ขอใช้'),
(1333, 96, '66312993', NULL, 'ผู้เข้าร่วม'),
(1334, 96, '64313005', NULL, 'ผู้เข้าร่วม'),
(1335, 96, '64312998', NULL, 'ผู้เข้าร่วม'),
(1336, 96, '67313011', NULL, 'ผู้เข้าร่วม'),
(1337, 96, '65313003', NULL, 'ผู้เข้าร่วม'),
(1338, 96, '67313011', NULL, 'ผู้เข้าร่วม'),
(1339, 96, '66313007', NULL, 'ผู้เข้าร่วม'),
(1340, 97, NULL, 'CS653129', 'ผู้ขอใช้'),
(1341, 98, '64312995', NULL, 'ผู้ขอใช้'),
(1342, 98, '66313007', NULL, 'ผู้เข้าร่วม'),
(1343, 98, '67312999', NULL, 'ผู้เข้าร่วม'),
(1344, 98, '65312994', NULL, 'ผู้เข้าร่วม'),
(1345, 98, '66312993', NULL, 'ผู้เข้าร่วม'),
(1346, 98, '64313001', NULL, 'ผู้เข้าร่วม'),
(1347, 99, NULL, 'CS673129', 'ผู้ขอใช้'),
(1348, 100, '65312994', NULL, 'ผู้ขอใช้'),
(1349, 100, '67313002', NULL, 'ผู้เข้าร่วม'),
(1350, 100, '64313005', NULL, 'ผู้เข้าร่วม'),
(1351, 101, NULL, 'CS653129', 'ผู้ขอใช้'),
(1352, 102, NULL, 'CS663129', 'ผู้ขอใช้'),
(1353, 103, '64312995', NULL, 'ผู้ขอใช้'),
(1354, 103, '64313005', NULL, 'ผู้เข้าร่วม'),
(1355, 103, '65312997', NULL, 'ผู้เข้าร่วม'),
(1356, 103, '65313000', NULL, 'ผู้เข้าร่วม'),
(1357, 103, '65313006', NULL, 'ผู้เข้าร่วม'),
(1358, 103, '64313012', NULL, 'ผู้เข้าร่วม'),
(1359, 103, '64312998', NULL, 'ผู้เข้าร่วม'),
(1360, 103, '65313006', NULL, 'ผู้เข้าร่วม'),
(1361, 104, '65312997', NULL, 'ผู้ขอใช้'),
(1362, 104, '66313010', NULL, 'ผู้เข้าร่วม'),
(1363, 104, '67313011', NULL, 'ผู้เข้าร่วม'),
(1364, 104, '67313002', NULL, 'ผู้เข้าร่วม'),
(1365, 105, NULL, 'CS673129', 'ผู้ขอใช้'),
(1366, 106, NULL, 'CS653129', 'ผู้ขอใช้'),
(1367, 107, NULL, 'CS653129', 'ผู้ขอใช้'),
(1368, 108, '65312997', NULL, 'ผู้ขอใช้'),
(1369, 108, '66313010', NULL, 'ผู้เข้าร่วม'),
(1370, 109, NULL, 'CS663129', 'ผู้ขอใช้'),
(1371, 110, NULL, 'CS673129', 'ผู้ขอใช้'),
(1372, 111, NULL, 'CS663129', 'ผู้ขอใช้'),
(1373, 112, '64312995', NULL, 'ผู้ขอใช้'),
(1374, 112, '65313000', NULL, 'ผู้เข้าร่วม'),
(1375, 112, '65313006', NULL, 'ผู้เข้าร่วม'),
(1376, 112, '66312996', NULL, 'ผู้เข้าร่วม'),
(1377, 112, '67313008', NULL, 'ผู้เข้าร่วม'),
(1378, 112, '64313005', NULL, 'ผู้เข้าร่วม'),
(1379, 112, '66313007', NULL, 'ผู้เข้าร่วม'),
(1380, 112, '65312994', NULL, 'ผู้เข้าร่วม'),
(1381, 113, NULL, 'CS653129', 'ผู้ขอใช้'),
(1382, 114, NULL, 'CS653129', 'ผู้ขอใช้'),
(1383, 115, '65312997', NULL, 'ผู้ขอใช้'),
(1384, 115, '65313003', NULL, 'ผู้เข้าร่วม'),
(1385, 115, '66313010', NULL, 'ผู้เข้าร่วม'),
(1386, 115, '64312995', NULL, 'ผู้เข้าร่วม'),
(1387, 116, '65312994', NULL, 'ผู้ขอใช้'),
(1388, 116, '65312997', NULL, 'ผู้เข้าร่วม'),
(1389, 116, '65313003', NULL, 'ผู้เข้าร่วม'),
(1390, 116, '66312993', NULL, 'ผู้เข้าร่วม'),
(1391, 116, '66312996', NULL, 'ผู้เข้าร่วม'),
(1392, 117, '65312994', NULL, 'ผู้ขอใช้'),
(1393, 117, '65313006', NULL, 'ผู้เข้าร่วม'),
(1394, 117, '64313005', NULL, 'ผู้เข้าร่วม'),
(1395, 117, '67312999', NULL, 'ผู้เข้าร่วม'),
(1396, 117, '66313004', NULL, 'ผู้เข้าร่วม'),
(1397, 117, '66312996', NULL, 'ผู้เข้าร่วม'),
(1398, 118, '64312995', NULL, 'ผู้ขอใช้'),
(1399, 118, '65312994', NULL, 'ผู้เข้าร่วม'),
(1400, 119, NULL, 'CS663129', 'ผู้ขอใช้'),
(1401, 120, NULL, 'CS653129', 'ผู้ขอใช้'),
(1402, 121, '64312995', NULL, 'ผู้ขอใช้'),
(1403, 121, '67313011', NULL, 'ผู้เข้าร่วม'),
(1404, 121, '64312998', NULL, 'ผู้เข้าร่วม'),
(1405, 122, NULL, 'CS673129', 'ผู้ขอใช้'),
(1406, 123, NULL, 'CS673129', 'ผู้ขอใช้'),
(1407, 124, '65312994', NULL, 'ผู้ขอใช้'),
(1408, 124, '64312995', NULL, 'ผู้เข้าร่วม'),
(1409, 124, '64313001', NULL, 'ผู้เข้าร่วม'),
(1410, 125, NULL, 'CS673129', 'ผู้ขอใช้'),
(1411, 126, '64312995', NULL, 'ผู้ขอใช้'),
(1412, 126, '67313011', NULL, 'ผู้เข้าร่วม'),
(1413, 126, '66312996', NULL, 'ผู้เข้าร่วม'),
(1414, 127, '64312995', NULL, 'ผู้ขอใช้'),
(1415, 127, '67313011', NULL, 'ผู้เข้าร่วม'),
(1416, 128, NULL, 'CS673129', 'ผู้ขอใช้'),
(1417, 129, NULL, 'CS663129', 'ผู้ขอใช้'),
(1418, 130, NULL, 'CS653129', 'ผู้ขอใช้'),
(1419, 131, '64312995', NULL, 'ผู้ขอใช้'),
(1420, 132, '64312995', NULL, 'ผู้ขอใช้'),
(1421, 132, '67313002', NULL, 'ผู้เข้าร่วม'),
(1422, 132, '66313007', NULL, 'ผู้เข้าร่วม'),
(1423, 132, '65312994', NULL, 'ผู้เข้าร่วม'),
(1424, 132, '64313012', NULL, 'ผู้เข้าร่วม'),
(1425, 133, NULL, 'CS673129', 'ผู้ขอใช้'),
(1426, 134, NULL, 'CS663129', 'ผู้ขอใช้'),
(1427, 135, '65312997', NULL, 'ผู้ขอใช้'),
(1428, 136, NULL, 'CS653129', 'ผู้ขอใช้'),
(1429, 137, '64312995', NULL, 'ผู้ขอใช้'),
(1430, 137, '64312998', NULL, 'ผู้เข้าร่วม'),
(1431, 137, '65312997', NULL, 'ผู้เข้าร่วม'),
(1432, 137, '64313005', NULL, 'ผู้เข้าร่วม'),
(1433, 137, '65313009', NULL, 'ผู้เข้าร่วม'),
(1434, 137, '67313008', NULL, 'ผู้เข้าร่วม'),
(1435, 138, NULL, 'CS653129', 'ผู้ขอใช้'),
(1436, 139, NULL, 'CS673129', 'ผู้ขอใช้'),
(1437, 140, NULL, 'CS673129', 'ผู้ขอใช้'),
(1438, 141, '65312994', NULL, 'ผู้ขอใช้'),
(1439, 142, NULL, 'CS653129', 'ผู้ขอใช้'),
(1440, 143, '65312997', NULL, 'ผู้ขอใช้'),
(1441, 143, '64312998', NULL, 'ผู้เข้าร่วม'),
(1442, 143, '64313012', NULL, 'ผู้เข้าร่วม'),
(1443, 143, '65313009', NULL, 'ผู้เข้าร่วม'),
(1444, 144, NULL, 'CS663129', 'ผู้ขอใช้'),
(1445, 145, '65312997', NULL, 'ผู้ขอใช้'),
(1446, 146, NULL, 'CS653129', 'ผู้ขอใช้'),
(1447, 147, NULL, 'CS653129', 'ผู้ขอใช้'),
(1448, 148, NULL, 'CS653129', 'ผู้ขอใช้'),
(1449, 149, '65312994', NULL, 'ผู้ขอใช้'),
(1450, 149, '64313005', NULL, 'ผู้เข้าร่วม'),
(1451, 149, '65312997', NULL, 'ผู้เข้าร่วม'),
(1452, 149, '66312996', NULL, 'ผู้เข้าร่วม'),
(1453, 149, '67312999', NULL, 'ผู้เข้าร่วม'),
(1454, 149, '67313011', NULL, 'ผู้เข้าร่วม'),
(1455, 149, '67313002', NULL, 'ผู้เข้าร่วม'),
(1456, 150, NULL, 'CS673129', 'ผู้ขอใช้'),
(1457, 151, NULL, 'CS663129', 'ผู้ขอใช้'),
(1458, 152, '64312995', NULL, 'ผู้ขอใช้'),
(1459, 152, '65313003', NULL, 'ผู้เข้าร่วม'),
(1460, 152, '64312998', NULL, 'ผู้เข้าร่วม'),
(1461, 152, '64313012', NULL, 'ผู้เข้าร่วม'),
(1462, 152, '65312994', NULL, 'ผู้เข้าร่วม'),
(1463, 152, '65313000', NULL, 'ผู้เข้าร่วม'),
(1464, 152, '66313004', NULL, 'ผู้เข้าร่วม'),
(1465, 152, '65313000', NULL, 'ผู้เข้าร่วม'),
(1466, 153, '65312994', NULL, 'ผู้ขอใช้'),
(1467, 153, '66312993', NULL, 'ผู้เข้าร่วม'),
(1468, 153, '64313005', NULL, 'ผู้เข้าร่วม'),
(1469, 153, '67312999', NULL, 'ผู้เข้าร่วม'),
(1470, 154, '64312995', NULL, 'ผู้ขอใช้'),
(1471, 154, '64313005', NULL, 'ผู้เข้าร่วม'),
(1472, 154, '66313010', NULL, 'ผู้เข้าร่วม'),
(1473, 154, '66312993', NULL, 'ผู้เข้าร่วม'),
(1474, 154, '67313011', NULL, 'ผู้เข้าร่วม'),
(1475, 155, '65312994', NULL, 'ผู้ขอใช้'),
(1476, 156, NULL, 'CS673129', 'ผู้ขอใช้'),
(1477, 157, '65312994', NULL, 'ผู้ขอใช้'),
(1478, 158, '65312994', NULL, 'ผู้ขอใช้'),
(1479, 158, '66312993', NULL, 'ผู้เข้าร่วม'),
(1480, 158, '67312999', NULL, 'ผู้เข้าร่วม'),
(1481, 158, '66313004', NULL, 'ผู้เข้าร่วม'),
(1482, 159, NULL, 'CS653129', 'ผู้ขอใช้'),
(1483, 160, NULL, 'CS663129', 'ผู้ขอใช้'),
(1484, 161, NULL, 'CS673129', 'ผู้ขอใช้'),
(1485, 162, NULL, 'CS653129', 'ผู้ขอใช้'),
(1486, 163, '65312997', NULL, 'ผู้ขอใช้'),
(1487, 163, '66313010', NULL, 'ผู้เข้าร่วม'),
(1488, 163, '65313006', NULL, 'ผู้เข้าร่วม'),
(1489, 163, '64313012', NULL, 'ผู้เข้าร่วม'),
(1490, 163, '65313009', NULL, 'ผู้เข้าร่วม'),
(1491, 163, '64312998', NULL, 'ผู้เข้าร่วม'),
(1492, 163, '65313003', NULL, 'ผู้เข้าร่วม'),
(1493, 163, '65313006', NULL, 'ผู้เข้าร่วม'),
(1494, 164, '64312995', NULL, 'ผู้ขอใช้'),
(1495, 164, '65312994', NULL, 'ผู้เข้าร่วม'),
(1496, 164, '65313006', NULL, 'ผู้เข้าร่วม'),
(1497, 164, '65313006', NULL, 'ผู้เข้าร่วม'),
(1498, 165, NULL, 'CS673129', 'ผู้ขอใช้'),
(1499, 166, '65312997', NULL, 'ผู้ขอใช้'),
(1500, 166, '66313007', NULL, 'ผู้เข้าร่วม'),
(1501, 167, NULL, 'CS673129', 'ผู้ขอใช้'),
(1502, 168, '64312995', NULL, 'ผู้ขอใช้'),
(1503, 168, '67313002', NULL, 'ผู้เข้าร่วม'),
(1504, 168, '65313003', NULL, 'ผู้เข้าร่วม'),
(1505, 168, '66313004', NULL, 'ผู้เข้าร่วม'),
(1506, 168, '67313011', NULL, 'ผู้เข้าร่วม'),
(1507, 168, '67313008', NULL, 'ผู้เข้าร่วม'),
(1508, 168, '65313000', NULL, 'ผู้เข้าร่วม'),
(1509, 169, NULL, 'CS663129', 'ผู้ขอใช้'),
(1510, 170, '64312995', NULL, 'ผู้ขอใช้'),
(1511, 170, '65313000', NULL, 'ผู้เข้าร่วม'),
(1512, 170, '66313010', NULL, 'ผู้เข้าร่วม'),
(1513, 170, '66313010', NULL, 'ผู้เข้าร่วม'),
(1514, 170, '66313010', NULL, 'ผู้เข้าร่วม'),
(1515, 170, '65313003', NULL, 'ผู้เข้าร่วม'),
(1516, 171, '64312995', NULL, 'ผู้ขอใช้'),
(1517, 171, '65312994', NULL, 'ผู้เข้าร่วม'),
(1518, 171, '67313011', NULL, 'ผู้เข้าร่วม'),
(1519, 172, NULL, 'CS663129', 'ผู้ขอใช้'),
(1520, 173, NULL, 'CS673129', 'ผู้ขอใช้'),
(1521, 174, NULL, 'CS673129', 'ผู้ขอใช้'),
(1522, 175, '65312997', NULL, 'ผู้ขอใช้'),
(1523, 175, '64312995', NULL, 'ผู้เข้าร่วม'),
(1524, 176, '65312994', NULL, 'ผู้ขอใช้'),
(1525, 177, NULL, 'CS653129', 'ผู้ขอใช้'),
(1526, 178, '64312995', NULL, 'ผู้ขอใช้'),
(1527, 178, '65313000', NULL, 'ผู้เข้าร่วม'),
(1528, 178, '66313010', NULL, 'ผู้เข้าร่วม'),
(1529, 178, '64313012', NULL, 'ผู้เข้าร่วม'),
(1530, 178, '66312996', NULL, 'ผู้เข้าร่วม'),
(1531, 179, '65312997', NULL, 'ผู้ขอใช้'),
(1532, 179, '65313006', NULL, 'ผู้เข้าร่วม'),
(1533, 180, NULL, 'CS663129', 'ผู้ขอใช้'),
(1534, 181, NULL, 'CS673129', 'ผู้ขอใช้'),
(1535, 182, NULL, 'CS653129', 'ผู้ขอใช้'),
(1536, 183, '65312997', NULL, 'ผู้ขอใช้'),
(1537, 183, '66313007', NULL, 'ผู้เข้าร่วม'),
(1538, 183, '64313012', NULL, 'ผู้เข้าร่วม'),
(1539, 183, '66312993', NULL, 'ผู้เข้าร่วม'),
(1540, 184, '64312995', NULL, 'ผู้ขอใช้'),
(1541, 184, '67312999', NULL, 'ผู้เข้าร่วม'),
(1542, 184, '65312994', NULL, 'ผู้เข้าร่วม'),
(1543, 184, '66312993', NULL, 'ผู้เข้าร่วม'),
(1544, 184, '67313008', NULL, 'ผู้เข้าร่วม'),
(1545, 184, '65312994', NULL, 'ผู้เข้าร่วม'),
(1546, 184, '67313002', NULL, 'ผู้เข้าร่วม'),
(1547, 184, '64313001', NULL, 'ผู้เข้าร่วม'),
(1548, 185, '64312995', NULL, 'ผู้ขอใช้'),
(1549, 185, '64313001', NULL, 'ผู้เข้าร่วม'),
(1550, 185, '67313002', NULL, 'ผู้เข้าร่วม'),
(1551, 185, '65312997', NULL, 'ผู้เข้าร่วม'),
(1552, 186, NULL, 'CS673129', 'ผู้ขอใช้'),
(1553, 187, NULL, 'CS653129', 'ผู้ขอใช้'),
(1554, 188, '65312994', NULL, 'ผู้ขอใช้'),
(1555, 188, '65313006', NULL, 'ผู้เข้าร่วม'),
(1556, 188, '64312995', NULL, 'ผู้เข้าร่วม'),
(1557, 188, '64313005', NULL, 'ผู้เข้าร่วม'),
(1558, 188, '65312997', NULL, 'ผู้เข้าร่วม'),
(1559, 188, '67313011', NULL, 'ผู้เข้าร่วม'),
(1560, 189, '65312994', NULL, 'ผู้ขอใช้'),
(1561, 189, '65313000', NULL, 'ผู้เข้าร่วม'),
(1562, 189, '65312997', NULL, 'ผู้เข้าร่วม'),
(1563, 189, '65313006', NULL, 'ผู้เข้าร่วม'),
(1564, 189, '65312997', NULL, 'ผู้เข้าร่วม'),
(1565, 189, '65312997', NULL, 'ผู้เข้าร่วม'),
(1566, 189, '67313008', NULL, 'ผู้เข้าร่วม'),
(1567, 190, NULL, 'CS663129', 'ผู้ขอใช้'),
(1568, 191, '64312995', NULL, 'ผู้ขอใช้'),
(1569, 191, '65313003', NULL, 'ผู้เข้าร่วม'),
(1570, 191, '65312997', NULL, 'ผู้เข้าร่วม'),
(1571, 191, '67313011', NULL, 'ผู้เข้าร่วม'),
(1572, 191, '66313010', NULL, 'ผู้เข้าร่วม'),
(1573, 191, '64313012', NULL, 'ผู้เข้าร่วม'),
(1574, 191, '65313000', NULL, 'ผู้เข้าร่วม'),
(1575, 191, '66313004', NULL, 'ผู้เข้าร่วม'),
(1576, 192, NULL, 'CS673129', 'ผู้ขอใช้'),
(1577, 193, NULL, 'CS673129', 'ผู้ขอใช้'),
(1578, 194, '64312995', NULL, 'ผู้ขอใช้'),
(1579, 194, '67312999', NULL, 'ผู้เข้าร่วม'),
(1580, 194, '65313003', NULL, 'ผู้เข้าร่วม'),
(1581, 195, '64312995', NULL, 'ผู้ขอใช้'),
(1582, 195, '66312996', NULL, 'ผู้เข้าร่วม'),
(1583, 195, '64313012', NULL, 'ผู้เข้าร่วม'),
(1584, 195, '64312998', NULL, 'ผู้เข้าร่วม'),
(1585, 195, '67312999', NULL, 'ผู้เข้าร่วม'),
(1586, 196, NULL, 'CS663129', 'ผู้ขอใช้'),
(1587, 197, '65312997', NULL, 'ผู้ขอใช้'),
(1588, 197, '64313001', NULL, 'ผู้เข้าร่วม'),
(1589, 198, '65312997', NULL, 'ผู้ขอใช้'),
(1590, 198, '67313008', NULL, 'ผู้เข้าร่วม'),
(1591, 198, '64313005', NULL, 'ผู้เข้าร่วม'),
(1592, 198, '66313007', NULL, 'ผู้เข้าร่วม'),
(1593, 198, '64312995', NULL, 'ผู้เข้าร่วม'),
(1594, 198, '65313006', NULL, 'ผู้เข้าร่วม'),
(1595, 198, '66313010', NULL, 'ผู้เข้าร่วม'),
(1596, 199, NULL, 'CS663129', 'ผู้ขอใช้'),
(1597, 200, '64312995', NULL, 'ผู้ขอใช้'),
(1598, 200, '67313011', NULL, 'ผู้เข้าร่วม'),
(1599, 200, '66313004', NULL, 'ผู้เข้าร่วม'),
(1600, 200, '67313011', NULL, 'ผู้เข้าร่วม'),
(1601, 201, NULL, 'CS653129', 'ผู้ขอใช้'),
(1602, 202, NULL, 'CS653129', 'ผู้ขอใช้'),
(1603, 203, '64312995', NULL, 'ผู้ขอใช้'),
(1604, 203, '65312994', NULL, 'ผู้เข้าร่วม'),
(1605, 203, '66313004', NULL, 'ผู้เข้าร่วม'),
(1606, 203, '65312997', NULL, 'ผู้เข้าร่วม'),
(1607, 203, '66313004', NULL, 'ผู้เข้าร่วม'),
(1608, 203, '66312996', NULL, 'ผู้เข้าร่วม'),
(1609, 203, '64312998', NULL, 'ผู้เข้าร่วม'),
(1610, 204, '65312994', NULL, 'ผู้ขอใช้'),
(1611, 204, '65313000', NULL, 'ผู้เข้าร่วม'),
(1612, 204, '66312993', NULL, 'ผู้เข้าร่วม'),
(1613, 204, '64313001', NULL, 'ผู้เข้าร่วม'),
(1614, 204, '66313007', NULL, 'ผู้เข้าร่วม'),
(1615, 205, '65312994', NULL, 'ผู้ขอใช้'),
(1616, 205, '66313007', NULL, 'ผู้เข้าร่วม'),
(1617, 205, '65313006', NULL, 'ผู้เข้าร่วม'),
(1618, 206, NULL, 'CS653129', 'ผู้ขอใช้'),
(1619, 207, NULL, 'CS673129', 'ผู้ขอใช้');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `room_request_participant`
--
ALTER TABLE `room_request_participant`
  ADD PRIMARY KEY (`room_request_participant_id`),
  ADD KEY `room_request_participant_room_request_id_idx` (`room_request_id`),
  ADD KEY `room_request_participant_student_id_idx` (`student_id`),
  ADD KEY `room_request_participant_teacher_id_idx` (`teacher_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `room_request_participant`
--
ALTER TABLE `room_request_participant`
  MODIFY `room_request_participant_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1620;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `room_request_participant`
--
ALTER TABLE `room_request_participant`
  ADD CONSTRAINT `room_request_participant_room_request_id_fkey` FOREIGN KEY (`room_request_id`) REFERENCES `room_request` (`room_request_id`),
  ADD CONSTRAINT `room_request_participant_student_id_fkey` FOREIGN KEY (`student_id`) REFERENCES `student` (`student_id`),
  ADD CONSTRAINT `room_request_participant_teacher_id_fkey` FOREIGN KEY (`teacher_id`) REFERENCES `teacher` (`teacher_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
