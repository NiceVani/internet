<?php
// ตั้งค่าการเชื่อมต่อฐานข้อมูล
include('db_connect.php');
?>
<!DOCTYPE html>
<html lang="th">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>แบบบันทึกขอใช้ห้องในเวลา</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body {
            font-family: "TH SarabunPSK", sans-serif;
            font-size: 16px;
            /* ลดขนาดฟอนต์ */
            background-color: #f9f9f9;
        }

        .form-title {
            text-align: center;
            font-weight: bold;
            font-size: 20px;
            /* ลดขนาดหัวข้อ */
            margin-bottom: 15px;
        }

        .form-label {
            font-weight: bold;
            font-size: 16px;
            /* ลดขนาด label */
        }

        input[readonly],
        select {
            background-color: #e9ecef;
            border: 1px solid #ced4da;
            border-radius: 4px;
            font-size: 14px;
            /* ลดขนาดฟอนต์ใน input และ select */
            padding: 5px;
            /* ลด padding */
            height: auto;
            /* ลดความสูง */
        }

        .table {
            margin-top: 5px;
            /* ลดระยะห่าง */
        }

        .table th {
            background-color: #f2f2f2;
            text-align: center;
            vertical-align: middle;
            font-size: 14px;
            /* ลดขนาดฟอนต์ใน header */
            border: 1px solid #dee2e6;
            padding: 5px;
            /* ลด padding */
        }

        .table td {
            padding: 5px;
            /* ลด padding ในเซลล์ */
            text-align: center;
            vertical-align: middle;
            border: 1px solid #dee2e6;
            height: 30px;
            /* ลดความสูงของแถว */
            font-size: 14px;
            /* ลดขนาดตัวอักษร */
        }

        .table td span {
            display: inline-block;
            width: 100%;
            background-color: transparent;
            text-align: center;
        }

        .row-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 15px;
            /* ลดระยะห่าง */
        }

        h5 {
            font-weight: bold;
            font-size: 16px;
            /* ลดขนาด h5 */
            margin: 0;
        }

        .btn-add {
            font-size: 20px;
            /* ลดขนาดไอคอนปุ่ม */
            color: #6a1b9a;
            background: none;
            border: none;
            cursor: pointer;
        }

        .btn-add:hover {
            color: #ff5722;
        }

        .menu-icon {
            cursor: pointer;
            color: #6a1b9a;
            font-size: 20px;
            /* ลดขนาดเมนูไอคอน */
            position: absolute;
            top: 15px;
            left: 15px;
        }

        .btn-confirm {
            background-color: #ff5722;
            color: white;
            font-size: 16px;
            /* ลดขนาดปุ่ม */
            border: none;
            padding: 8px 15px;
            /* ลด padding */
        }

        .btn-confirm:hover {
            background-color: #e64a19;
        }

        .textarea-container {
            margin-top: 15px;
            /* ลดระยะห่าง */
        }

        .textarea-container label {
            font-size: 16px;
            /* ลดขนาด label */
        }

        .textarea-row {
            display: flex;
            align-items: flex-start;
            gap: 10px;
        }

        .textarea-row textarea {
            flex: 1;
            /* ให้ textarea ใช้พื้นที่ที่เหลืออยู่ */
            max-width: calc(100% - 120px);
            /* ลดขนาดเพื่อให้เหลือที่สำหรับปุ่ม */
            height: 50px;
            /* ลดความสูง */
        }

        .textarea-row .btn-confirm {
            flex-shrink: 0;
            margin-top: 0;
            margin-left: auto;
        }

        .note {
            font-size: 14px;
            /* ลดขนาดหมายเหตุ */
            color: gray;
            margin-top: 10px;
            /* ลดระยะห่าง */
            text-align: center;
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
            /* ลด padding ใน sidebar */
            transition: left 0.3s ease;
            z-index: 1000;
        }

        .sidebar.active {
            left: 0;
        }

        .sidebar h4 {
            color: white;
            font-size: 18px;
            /* ลดขนาดฟอนต์ใน sidebar */
            margin-bottom: 15px;
            /* ลดระยะห่าง */
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
        <div class="radio-container">
            <h4>ประเภทการจอง</h4>
            <label>
                <input type="radio" name="booking-type" value="นอกเวลา">
                นอกเวลา
            </label><br>
            <label>
                <input type="radio" name="booking-type" value="ในเวลา" checked>
                ในเวลา
            </label>
        </div>
    </div>
    <script>
        // ฟังก์ชันเปลี่ยนหน้า
        document.getElementById('outOfTime').addEventListener('change', function() {
            if (this.checked) {
                // เปลี่ยนหน้าไปยังไฟล์อื่น
                window.location.href = 'TimeOut3.php'; // ชื่อไฟล์หรือ URL ที่ต้องการ
            }
        });

        document.getElementById('inTime').addEventListener('change', function() {
            if (this.checked) {
                // กลับไปหน้าเดิมหรือหน้าที่เกี่ยวข้อง
                window.location.href = 'in_time_booking.html'; // ชื่อไฟล์หรือ URL ที่ต้องการ
            }
        });
    </script>



    <!-- Overlay -->
    <div class="overlay" id="overlay" onclick="toggleSidebar()"></div>

    <div class="container mt-4">
        <h4 class="form-title">แบบบันทึกขอใช้ห้องในเวลา</h4>
        <form>
            <div class="row mb-3">
                <div class="col-md-6">
                    <label class="form-label">ชื่อ-นามสกุล</label>
                    <input type="text" class="form-control" placeholder="นาย ปัญญากร ทิมจันทึก" value="นาย ปัญญากร ทิมจันทึก" readonly>
                </div>
                <div class="col-md-6">
                    <label class="form-label">รหัสนิสิต</label>
                    <input type="text" class="form-control" placeholder="65312993" value="65312993" readonly>
                </div>
            </div>
            <div class="row mb-3">
                <div class="col-md-4">
                    <label class="form-label">ชั้นปี</label>
                    <select class="form-select">
                        <option selected>1</option>
                        <option value="1">2</option>
                        <option value="2">3</option>
                        <option value="4">4</option>
                    </select>
                </div>
                <div class="col-md-4">
                    <label class="form-label">เบอร์โทร</label>
                    <input type="text" class="form-control" placeholder="0967543321" value="0967543321" readonly>
                </div>
                <div class="col-md-4">
                    <label class="form-label">วัน</label>
                    <select class="form-select">
                        <option selected>จันทร์</option>
                        <option value="อังคาร">อังคาร</option>
                        <option value="พุธ">พุธ</option>
                        <option value="พฤหัสบดี">พฤหัสบดี</option>
                        <option value="ศุกร์">ศุกร์</option>
                    </select>
                </div>
            </div>
            <div class="row-header">
                <h5>รายละเอียดการจอง</h5>
            </div>
            <table class="table table-bordered">
                <thead>
                    <tr>
                        <th>ประเภทห้อง</th>
                        <th>ห้องที่จอง</th>
                        <th>เวลาที่จอง</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><span>ห้องปฏิบัติการ</span></td>
                        <td><span>SC2-308</span></td>
                        <td><span>8.00-17.00 น.</span></td>
                    </tr>
                </tbody>
            </table>
            <h5 class="mt-4">รายละเอียดการยืม</h5>
            <table class="table table-bordered">
                <thead>
                    <tr>
                        <th>ชื่ออุปกรณ์</th>
                        <th>ห้องที่จอง</th>
                        <th>จำนวน</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>พอยเตอร์</td>
                        <td>SC2-308</td>
                        <td>1</td>
                    </tr>
                    <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                </tbody>
            </table>
            <div class="textarea-container">
                <label class="form-label">ความประสงค์การใช้ห้อง</label>
                <div class="textarea-row">
                    <textarea class="form-control" rows="3"></textarea>
                    <button class="btn-confirm" type="button" onclick="window.location.href='home.php'">ยืนยัน</button>
                </div>
            </div>
            <p class="note">หมายเหตุ: การจองขอใช้ห้องภายใต้การดูแลของภาควิชาวิทยาการคอมพิวเตอร์ฯ คณะวิทยาศาสตร์ มหาวิทยาลัยนเรศวร วันจันทร์ ถึง ศุกร์ เวลา 8.00 - 17.00 น. ยกเว้นวันหยุดนักขัตฤกษ์</p>
        </form>
    </div>

    <script>
        // ตรวจจับการเปลี่ยนสถานะของ Radio Button
        document.querySelectorAll('input[name="booking-type"]').forEach(function(radio) {
            radio.addEventListener('change', function() {
                if (this.value === 'นอกเวลา') {
                    // เมื่อเลือก "นอกเวลา" ให้ไปที่ TimeOut2.html
                    window.location.href = './TimeOut2Teacher.php';
                } else if (this.value === 'ในเวลา') {
                    // เมื่อเลือก "ในเวลา" ให้ไปที่ TimeIn.html
                    window.location.href = './TimeIn.php';
                }
            });
        });

        function toggleSidebar() {
            const sidebar = document.getElementById('sidebar');
            const overlay = document.getElementById('overlay');
            sidebar.classList.toggle('active');
            overlay.classList.toggle('active');
        }
    </script>

</body>

</html>