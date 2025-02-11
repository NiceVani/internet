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

        .table th,
        .table td {
            text-align: center;
            vertical-align: middle;
        }

        .table td {
            font-size: 14px;
        }

        .form-container {
            margin-top: 20px;
        }

        .textarea-container {
            margin-top: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .textarea-container textarea {
            width: 80%;
            /* ช่องกรอกข้อความให้กว้างขึ้น */
            margin-right: 10px;
        }

        /* สไตล์หมายเหตุ */
        .note {
            font-size: 14px;
            color: gray;
            text-align: center;
            margin-top: 30px;
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

        <!-- ฟอร์มข้อมูลส่วนตัว -->
        <div class="form-container">
            <div class="row mb-3">
                <div class="col-md-4">
                    <label class="form-label">ชื่อ-นามสกุล</label>
                    <input type="text" class="form-control" value="นาย ปัญญากร ทิมจันทึก" readonly>
                </div>
                <div class="col-md-4">
                    <label class="form-label">รหัสนิสิต</label>
                    <input type="text" class="form-control" value="65312993" readonly>
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
                    <input type="text" class="form-control" value="0967543321" readonly>
                </div>
                <div class="col-md-4">
                    <label class="form-label">วัน</label>
                    <select class="form-select">
                        <option selected>จันทร์</option>
                        <option value="อังคาร">อังคาร</option>
                        <option value="พุธ">พุธ</option>
                        <option value="พฤหัสบดี">พฤหัสบดี</option>
                        <option value="ศุกร์">ศุกร์</option>
                        <option value="เสาร์">เสาร์</option>
                        <option value="อาทิตย์">อาทิตย์</option>
                    </select>
                </div>
            </div>
        </div>

        <!-- ตารางรายชื่อสมาชิก -->
        <h5 class="mt-4">รายชื่อสมาชิก</h5>
        <table class="table table-bordered">
            <thead>
                <tr>
                    <th>รหัสนิสิต</th>
                    <th>ชื่อ-นามสกุล</th>
                    <th>
                        <button type="button" class="btn-simple" onclick="addRow()">+</button>
                    </th>
                </tr>
            </thead>
            <tbody id="members-table-body">
                <tr>
                    <td><input type="text" class="form-control" placeholder="กรอกรหัสนิสิต" pattern="\d*" title="กรุณากรอกเฉพาะตัวเลข"></td>
                    <td><input type="text" class="form-control" placeholder="กรอกชื่อ-นามสกุล"></td>
                    <td><button type="button" class="btn btn-danger" onclick="deleteRow(this)">ลบ</button></td>
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

        <!-- ฟอร์มเวลา -->
        <div class="form-group mb-3">
            <label class="form-label">เวลา</label>
            <div class="d-flex">
                <input type="time" class="form-control" id="start-time" value="09:00">
                <span class="mx-2">ถึง</span>
                <input type="time" class="form-control" id="end-time" value="17:00">
            </div>
        </div>

        <!-- ฟอร์มความคิดเห็น -->
        <div class="textarea-container">
            <label class="form-label">ความประสงค์การใช้ห้อง</label>
            <textarea class="form-control" rows="3" placeholder=""></textarea>
            <!-- ปุ่มยืนยันจะอยู่ขวา -->
            <button class="btn-confirm" type="button" onclick="window.location.href='TimeOut2Teacher.php'">ยืนยัน</button>
        </div>

        <!-- หมายเหตุ -->
        <p class="note">การจองขอใช้ห้องภายใต้การดูแลของภาควิชาวิทยาการคอมพิวเตอร์ฯ คณะวิทยาศาสตร์ มหาวิทยาลัยนเรศวร วันเสาร์ ถึง อาทิตย์ เวลา 8.00-21.00 น.</p>
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
                window.location.href = 'TimeIn.php';
            }
        }

        function reloadPage() {
            location.reload(); // รีเฟรชหน้า
        }

        function addRow() {
            const tableBody = document.getElementById('members-table-body');
            const newRow = document.createElement('tr');
            newRow.innerHTML = `
                <td><input type="text" class="form-control" placeholder="กรอกรหัสนิสิต" pattern="\d*" title="กรุณากรอกเฉพาะตัวเลข"></td>
                <td><input type="text" class="form-control" placeholder="กรอกชื่อ-นามสกุล"></td>
                <td><button type="button" class="btn btn-danger" onclick="deleteRow(this)">ลบ</button></td>
            `;
            tableBody.appendChild(newRow);
        }

        function deleteRow(button) {
            const row = button.closest('tr'); // หาตำแหน่งแถวที่กดปุ่ม
            row.remove(); // ลบแถวนั้นออก
        }
    </script>
</body>

</html>