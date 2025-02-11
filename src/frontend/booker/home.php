<?php
// เริ่มต้นเซสชั่น
session_start();
// ตั้งค่าการเชื่อมต่อฐานข้อมูล
include('db_connect.php');

// ตรวจสอบว่า session มีข้อมูลผู้ใช้หรือไม่
if (!isset($_SESSION['user_id'])) {
    header('Location: login.php'); // ถ้ายังไม่ได้ล็อกอิน, รีไดเร็กต์ไปที่หน้า login
    exit();
}

// ดึงข้อมูลผู้ใช้งานจาก session
$user_id = $_SESSION['user_id'];
$user_query = "SELECT * FROM users WHERE id = $user_id";
$user_result = $conn->query($user_query);
$user = $user_result->fetch_assoc();

// ดึงข้อมูลการจองของผู้ใช้งาน
$reservations_query = "SELECT reservations.*, rooms.room_name FROM reservations 
                      INNER JOIN rooms ON reservations.room_id = rooms.id 
                      WHERE reservations.user_id = $user_id";
$reservations_result = $conn->query($reservations_query);
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EasyRoom Reservation System - หน้าหลัก</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f9f9f9;
            margin: 0;
            padding: 0;
        }

        .header {
            background-color: #e54715;
            color: white;
            padding: 15px 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .header-title {
            font-size: 24px;
            font-weight: bold;
        }

        .nav a {
            color: white;
            text-decoration: none;
            margin: 0 15px;
            font-size: 16px;
        }

        .nav a:hover {
            text-decoration: underline;
        }

        .nav a.active {
            font-weight: bold;
            text-decoration: underline;
        }

        .user-info {
            background-color: #ffffff;
            margin: 20px auto;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            max-width: 800px;
            display: flex;
            align-items: center;
        }

        .user-avatar {
            font-size: 50px;
            margin-right: 20px;
        }

        .user-details div {
            margin-bottom: 8px;
        }

        .booking-section {
            background-color: #8e44ad;
            color: white;
            margin: 20px auto;
            padding: 20px;
            border-radius: 10px;
            max-width: 800px;
        }

        .booking-section h3 {
            margin-top: 0;
            font-size: 20px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            background-color: white;
            color: black;
            border-radius: 8px;
            overflow: hidden;
        }

        table th,
        table td {
            text-align: left;
            padding: 10px;
        }

        table th {
            background-color: #dcdde1;
            color: #2c3e50;
        }

        table tr:nth-child(even) {
            background-color: #f2f2f2;
        }

        .status {
            color: green;
            font-weight: bold;
        }

        .cancel-btn {
            background-color: red;
            color: white;
            border: none;
            padding: 5px 10px;
            border-radius: 5px;
            cursor: pointer;
        }

        .cancel-btn:hover {
            background-color: darkred;
        }
    </style>
</head>

<body>
    <!-- Header -->
    <div class="header">
        <div class="header-title">EasyRoom Reservation System</div>
        <div class="nav">
            <a href="home.php" class="active">หน้าหลัก</a>
            <a href="booking.php">จองห้อง</a>
            <a href="repost.php">รายงาน</a>
        </div>
    </div>

    <!-- User Information Section -->
    <div class="user-info">
        <div class="user-avatar">😊</div>
        <div class="user-details">
            <div>ชื่อ นามสกุล: <?php echo $user['full_name']; ?></div>
            <div>รหัสนิสิต: <?php echo $user['id_number']; ?></div>
            <div>ชั้นปี: <?php echo $user['year']; ?></div>
            <div>สาขา: <?php echo $user['major']; ?></div>
        </div>
    </div>


    <!-- Booking Details -->
    <div class="booking-section">
        <h3>รายละเอียดการจอง</h3>
        <table>
            <thead>
                <tr>
                    <th>ประเภท</th>
                    <th>ห้องที่จอง</th>
                    <th>เวลาที่จอง</th>
                    <th>สถานะการจอง</th>
                </tr>
            </thead>
            <tbody>
                <?php while ($reservation = $reservations_result->fetch_assoc()) { ?>
                    <tr>
                        <td>ห้องปฏิบัติการ</td>
                        <td><?php echo $reservation['room_name']; ?></td>
                        <td>
                            <?php echo date('H:i', strtotime($reservation['start_time'])) . " - " . date('H:i', strtotime($reservation['end_time'])); ?>
                        </td>
                        <td>
                            <span id="status_<?php echo $reservation['id']; ?>" class="status">รอการอนุมัติ</span>
                            <button id="cancelBtn_<?php echo $reservation['id']; ?>" class="cancel-btn" onclick="cancelReservation(<?php echo $reservation['id']; ?>)">ยกเลิก</button>
                        </td>


                    </tr>
                <?php } ?>
            </tbody>
        </table>
    </div>

    <script>
        function cancelReservation(reservationId) {
            if (confirm('คุณต้องการยกเลิกการจองนี้หรือไม่?')) {
                // เปลี่ยนสถานะเป็น "ยกเลิก"
                var statusCell = document.getElementById('status_' + reservationId);
                statusCell.innerHTML = 'ยกเลิก'; // เปลี่ยนข้อความ
                statusCell.style.color = 'red'; // เปลี่ยนสีเป็นแดง

                // ปิดการใช้งานปุ่ม "ยกเลิก"
                var cancelButton = document.getElementById('cancelBtn_' + reservationId);
                cancelButton.disabled = true; // ปิดปุ่ม
            }
        }
    </script>


</body>

</html>