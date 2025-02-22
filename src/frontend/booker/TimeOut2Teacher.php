<?php
// ตั้งค่าการเชื่อมต่อฐานข้อมูล
include('db_connect.php');
?>
<!DOCTYPE html>
<html lang="th">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>แบบบันทึกขอใช้ห้องนอกเวลา</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body {
            font-family: "TH SarabunPSK", sans-serif;
            font-size: 16px;
            background-color: #f9f9f9;
        }

        .form-title {
            text-align: center;
            font-weight: bold;
            font-size: 20px;
            margin-bottom: 15px;
        }

        .btn-simple {
            font-size: 14px;
            background-color: #f2f2f2;
            border: 1px solid #ccc;
            border-radius: 5px;
            padding: 8px 15px;
            margin-right: 10px;
            margin-bottom: 15px;
            cursor: pointer;
        }

        .btn-simple:hover {
            background-color: #e2e2e2;
        }

        .input-group {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-top: 15px;
        }

        .input-group input {
            flex: 1;
            border: 1px solid #ccc;
            border-radius: 5px;
            padding: 8px;
        }

        .btn-upload {
            font-size: 14px;
            background-color: #f2f2f2;
            border: 1px solid #ccc;
            border-radius: 5px;
            padding: 8px 15px;
            cursor: pointer;
        }

        .btn-upload:hover {
            background-color: #e2e2e2;
        }

        .btn-confirm {
            background-color: #ff5722;
            color: white;
            font-size: 16px;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            margin-top: 20px;
            cursor: pointer;
        }

        .btn-confirm:hover {
            background-color: #e64a19;
        }

        .menu-icon {
            cursor: pointer;
            color: #6a1b9a;
            font-size: 24px;
            position: absolute;
            top: 15px;
            left: 15px;
        }

        .sidebar {
            position: fixed;
            top: 0;
            left: -250px;
            width: 250px;
            height: 100%;
            background-color: #ff5722;
            color: white;
            padding: 15px;
            transition: left 0.3s ease;
            z-index: 1000;
        }

        .sidebar.active {
            left: 0;
        }

        .sidebar h4 {
            color: white;
            font-size: 18px;
            margin-bottom: 15px;
        }

        .overlay {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 999;
        }

        .overlay.active {
            display: block;
        }
    </style>
</head>

<body>
    <!-- ปุ่มสามขีด -->
    <div class="menu-icon" onclick="toggleSidebar()">&#9776;</div>

    <!-- Sidebar -->
    <div class="sidebar" id="sidebar">
        <h4>ประเภทการจอง</h4>
        <label>
            <input type="radio" name="booking-type" value="นอกเวลา" onchange="updateStatus('นอกเวลา')" checked>
            นอกเวลา
        </label><br>
        <label>
            <input type="radio" name="booking-type" value="ในเวลา" onchange="updateStatus('ในเวลา')">
            ในเวลา
        </label>
    </div>

    <!-- Overlay -->
    <div class="overlay" id="overlay" onclick="toggleSidebar()"></div>

    <!-- Content -->
    <div class="container mt-4">
        <h4 class="form-title">แบบบันทึกขอใช้ห้องนอกเวลา</h4>

        <!-- ส่วนเพิ่ม -->
        <div class="d-flex flex-wrap mb-3">
            <button class="btn-simple">Download เอกสาร</button>
            <!-- ลิงก์ไปยังไฟล์ 'TimeInTeacher.html' ในเครื่อง -->
            <a href="TimeOut3Teacher.php"><button class="btn-simple" id="bookingButton">กรอกเอกสารการจองนอกเวลาออนไลน์</button></a>
        </div>
        <div class=" input-group">
            <input type="file" id="fileInput">
        </div>
        <button type="button" class="btn-confirm" onclick="window.location.href='home.php'">ยืนยัน</button>
    </div>

    <script>
        function toggleSidebar() {
            const sidebar = document.getElementById('sidebar');
            const overlay = document.getElementById('overlay');
            sidebar.classList.toggle('active');
            overlay.classList.toggle('active');
        }

        function updateStatus(selected) {
            console.log(`สถานะ: ${selected}`);
            // เพิ่มฟังก์ชันเปลี่ยนหน้าเมื่อเลือก "ในเวลา"
            if (selected === 'ในเวลา') {
                window.location.href = './TimeInTeacher.php';
            }
        }
        document.getElementById("bookingButton").addEventListener("click", function() {
            window.location.href = './TimeOut3.php';
        });
    </script>
</body>

</html>