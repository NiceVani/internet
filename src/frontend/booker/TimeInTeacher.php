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
            background-color: #f9f9f9;
        }

        .form-title {
            text-align: center;
            font-weight: bold;
            font-size: 20px;
            margin-bottom: 15px;
        }

        .form-label {
            font-weight: bold;
            font-size: 16px;
        }

        input[readonly],
        select {
            background-color: #e9ecef;
            border: 1px solid #ced4da;
            border-radius: 4px;
            font-size: 14px;
            padding: 5px;
            height: auto;
        }

        .table {
            margin-top: 5px;
        }

        .modal {
            display: none;
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 300px;
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            z-index: 1001;
            padding: 20px;
            text-align: center;
        }

        .modal.active {
            display: block;
        }

        .table th {
            background-color: #f2f2f2;
            text-align: center;
            vertical-align: middle;
            font-size: 14px;
            border: 1px solid #dee2e6;
            padding: 5px;
        }

        .table td {
            padding: 5px;
            text-align: center;
            vertical-align: middle;
            border: 1px solid #dee2e6;
            height: 30px;
            font-size: 14px;
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
        }

        h5 {
            font-weight: bold;
            font-size: 16px;
            margin: 0;
        }

        .btn-add {
            font-size: 20px;
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
            position: absolute;
            top: 15px;
            left: 15px;
        }

        .btn-confirm {
            background-color: #ff5722;
            color: white;
            font-size: 16px;
            border: none;
            padding: 8px 15px;
        }

        .btn-confirm:hover {
            background-color: #e64a19;
        }

        .textarea-container {
            margin-top: 15px;
        }

        .textarea-container label {
            font-size: 16px;
        }

        .textarea-row {
            display: flex;
            align-items: flex-start;
            gap: 10px;
        }

        .textarea-row textarea {
            flex: 1;
            max-width: calc(100% - 120px);
            height: 50px;
        }

        .textarea-row .btn-confirm {
            flex-shrink: 0;
            margin-top: 0;
            margin-left: auto;
        }

        .note {
            font-size: 14px;
            color: gray;
            margin-top: 10px;
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

    <!-- Overlay -->
    <div class="overlay" id="overlay" onclick="closeSidebarOrModal()"></div>

    <!-- Modal -->
    <div class="modal" id="modal">
        <h5>ยืมอุปกรณ์ ห้อง SC2-308</h5>
        <table class="table table-bordered">
            <thead>
                <tr>
                    <th>ชื่ออุปกรณ์</th>
                    <th>จำนวน</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>สาย console</td>
                    <td><input type="number" min="0" class="form-control form-control-sm" value="0"></td>
                </tr>
                <tr>
                    <td>สาย lan cat5</td>
                    <td><input type="number" min="0" class="form-control form-control-sm" value="0"></td>
                </tr>
                <tr>
                    <td>สาย crossover</td>
                    <td><input type="number" min="0" class="form-control form-control-sm" value="0"></td>
                </tr>
                <tr>
                    <td>hub</td>
                    <td><input type="number" min="0" class="form-control form-control-sm" value="0"></td>
                </tr>
                <tr>
                    <td>router</td>
                    <td><input type="number" min="0" class="form-control form-control-sm" value="1"></td>
                </tr>
                <tr>
                    <td>switch</td>
                    <td><input type="number" min="0" class="form-control form-control-sm" value="2"></td>
                </tr>
                <tr>
                    <td>อื่นๆ</td>
                    <td><input type="number" min="0" class="form-control form-control-sm" value="0"></td>
                </tr>
            </tbody>
        </table>
        <button type="button" class="btn-confirm" onclick="saveData()">บันทึก</button>
    </div>

    <script>
        function toggleSidebar() {
            const sidebar = document.getElementById('sidebar');
            const overlay = document.getElementById('overlay');
            sidebar.classList.toggle('active');
            overlay.classList.add('active');
        }

        function openModal() {
            const modal = document.getElementById('modal');
            const overlay = document.getElementById('overlay');
            modal.classList.add('active');
            overlay.classList.add('active');
        }

        function closeSidebarOrModal() {
            const sidebar = document.getElementById('sidebar');
            const modal = document.getElementById('modal');
            const overlay = document.getElementById('overlay');

            if (sidebar.classList.contains('active')) {
                sidebar.classList.remove('active');
            }

            if (modal.classList.contains('active')) {
                modal.classList.remove('active');
            }

            overlay.classList.remove('active');
        }

        function saveData() {
            const modal = document.getElementById('modal');
            const rows = document.querySelectorAll('#modal tbody tr');
            const tableBody = document.querySelector('.table.table-bordered:nth-of-type(2) tbody');

            rows.forEach((row) => {
                const equipmentName = row.cells[0].innerText;
                const equipmentQty = parseInt(row.cells[1].querySelector('input').value);

                let existingRow = Array.from(tableBody.rows).find(r => r.cells[0].innerText === equipmentName);

                if (equipmentQty > 0) {
                    if (existingRow) {
                        existingRow.cells[2].innerText = equipmentQty;
                    } else {
                        const newRow = document.createElement('tr');

                        const nameCell = document.createElement('td');
                        nameCell.innerText = equipmentName;
                        newRow.appendChild(nameCell);

                        const roomCell = document.createElement('td');
                        roomCell.innerText = 'SC2-308';
                        newRow.appendChild(roomCell);

                        const qtyCell = document.createElement('td');
                        qtyCell.innerText = equipmentQty;
                        newRow.appendChild(qtyCell);

                        tableBody.appendChild(newRow);
                    }
                } else if (existingRow) {
                    tableBody.removeChild(existingRow);
                }
            });

            modal.classList.remove('active');
            closeSidebarOrModal();
        }

        // เพิ่มฟังก์ชันตรวจจับการเปลี่ยนของ Radio Button
        document.querySelectorAll('input[name="booking-type"]').forEach(function(radio) {
            radio.addEventListener('change', function() {
                if (this.value === 'นอกเวลา') {
                    // เมื่อเลือก "นอกเวลา" ให้ไปที่ TimeOut2Teacher.html
                    window.location.href = './TimeOut2Teacher.php';
                } else if (this.value === 'ในเวลา') {
                    // เมื่อเลือก "ในเวลา" ให้คงอยู่ในหน้านี้
                    window.location.href = './TimeInTeacher.php';
                }
            });
        });
    </script>


    <div class="container mt-4">
        <h4 class="form-title">แบบบันทึกขอใช้ห้องในเวลา</h4>
        <form>
            <div class="row mb-3">
                <div class="col-md-6">
                    <label class="form-label">ชื่อ-นามสกุล</label>
                    <input type="text" class="form-control" placeholder="นาย ปัญญากร ทิมจันทึก" value="นาย สมศักดิ์ ใจเย็น" readonly>
                </div>

            </div>
            <div class="row mb-3">
                <div class="col-md-4">
                    <label class="form-label">เบอร์โทร</label>
                    <input type="text" class="form-control" placeholder="0967543321" value="0968514566" readonly>
                </div>
                <div class="col-md-4">
                    <label class="form-label">จำนวนนิสิต</label>
                    <input type="number" min="0" class="form-control" placeholder="ระบุจำนวนนิสิต">
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
                        <th>วันที่จอง</th>
                        <th>เวลาที่จอง</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><span>ห้องปฏิบัติการ</span></td>
                        <td><span>SC2-308</span></td>
                        <td><span>22/12/2024</span></td>
                        <td><span>08.00-15.00</span></td>
                    </tr>
                </tbody>
            </table>
            <div class="row-header">
                <h5 class="mt-4">รายละเอียดการยืม</h5>
                <button type="button" class="btn-add" onclick="openModal()">+</button>
            </div>
            <table class="table table-bordered">
                <thead>
                    <tr>
                        <th>ชื่ออุปกรณ์</th>
                        <th>ห้องที่จอง</th>
                        <th>จำนวน</th>
                    </tr>
                </thead>
                <tbody>
                </tbody>
            </table>
            <div class="textarea-container">
                <label class="form-label">ความประสงค์การใช้ห้อง</label>
                <div class="textarea-row">
                    <textarea class="form-control" rows="3"></textarea>
                    <button type="submit" class="btn btn-confirm">ยืนยัน</button>
                </div>
            </div>
            <p class="note">หมายเหตุ: การจองขอใช้ห้องภายใต้การดูแลของภาควิชาวิทยาการคอมพิวเตอร์ฯ คณะวิทยาศาสตร์ มหาวิทยาลัยนเรศวร วันจันทร์ ถึง ศุกร์ เวลา 8.00 - 17.00 น. ยกเว้นวันหยุดนักขัตฤกษ์</p>
        </form>
    </div>
</body>

</html>