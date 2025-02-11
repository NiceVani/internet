<?php
// ตั้งค่าการเชื่อมต่อฐานข้อมูล
include('db_connect.php');

// Handle form submission for borrowing equipment
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $console = $_POST['console'];
    $cat5 = $_POST['cat5'];
    $crossover = $_POST['crossover'];
    $hub = $_POST['hub'];
    $router = $_POST['router'];
    $switch = $_POST['switch'];
    $pointer = $_POST['pointer'];

    // Insert borrowed items into the database or perform any other necessary action
    // Example query (make sure your table structure matches)
    $sql = "INSERT INTO borrow_items (console, cat5, crossover, hub, router, switch, pointer) 
            VALUES ('$console', '$cat5', '$crossover', '$hub', '$router', '$switch', '$pointer')";

    if ($conn->query($sql) === TRUE) {
        echo "บันทึกข้อมูลการยืมอุปกรณ์สำเร็จ";
    } else {
        echo "เกิดข้อผิดพลาดในการบันทึกข้อมูล: " . $conn->error;
    }
}

?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0"> <!-- ทำให้หน้าเว็บปรับขนาดเหมาะสมกับอุปกรณ์ -->
    <title>Room SC2-308</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            /* ฟอนต์ที่ใช้ */
            margin: 0;
            /* ไม่มีระยะขอบ */
            padding: 0;
            /* ไม่มีระยะห่าง */
            background-color: #ffffff;
            /* สีพื้นหลัง */
            min-height: 100vh;
            /* ความสูงขั้นต่ำเต็มหน้าจอ */
        }

        .header {
            background-color: #E54715;
            /* สีพื้นหลังของแถบหัวข้อ */
            color: white;
            /* สีข้อความ */
            padding: 30px;
            /* ระยะห่างภายใน */
            text-align: left;
            /* จัดข้อความชิดซ้าย */
            font-size: 20px;
            /* ขนาดตัวอักษร */
            font-weight: bold;
            /* ตัวอักษรหนา */
            display: flex;
            /* ใช้ Flexbox เพื่อจัดตำแหน่ง */
            justify-content: space-between;
            /* เว้นระยะห่างระหว่างองค์ประกอบ */
            align-items: center;
            /* จัดตำแหน่งให้อยู่ตรงกลาง */
            position: relative;
            /* ทำให้สามารถใช้ตำแหน่งแบบ relative กับองค์ประกอบภายใน */
        }

        .header h1 {
            margin: 5px;
            /* ระยะห่างภายนอก */
            font-size: 30px;
            /* ขนาดตัวอักษร */
            right: 10px;
            /* ระยะห่างจากด้านขวา */
            position: absolute;
            /* ใช้ตำแหน่ง absolute */
            top: 30px;
            /* ระยะห่างจากด้านบน */
        }

        .header h2 {
            margin: 5px;
            font-size: 30px;
            position: absolute;
            top: 30px;
            /* ระยะห่างจากด้านบน */
            left: 100px;
            /* ระยะห่างจากด้านซ้าย */
        }

        /* การตั้งค่าปุ่มย้อนกลับ */
        .back-button {
            background-color: transparent;
            /* พื้นหลังโปร่งใส */
            color: #000000;
            /* สีตัวอักษร */
            border: none;
            /* ไม่มีเส้นขอบ */
            font-size: 36px;
            /* ขนาดตัวอักษร */
            cursor: pointer;
            /* เปลี่ยนเคอร์เซอร์เมื่อชี้ */
            padding: 0;
            /* ไม่มีระยะห่างภายใน */
            margin: 0;
            /* ไม่มีระยะห่างภายนอก */
            border-radius: 5px;
            /* มุมมน */
            align-self: flex-start;
            /* จัดให้อยู่ด้านบน */
        }

        .back-button:hover {
            background-color: #f5c6cb;
            /* เปลี่ยนสีพื้นหลังเมื่อวางเมาส์ */
        }

        /* ส่วนของ legend แสดงคำอธิบายสี */
        .legend {
            display: flex;
            /* ใช้ Flexbox */
            align-items: center;
            /* จัดให้อยู่ตรงกลาง */
            gap: 15px;
            /* ระยะห่างระหว่างองค์ประกอบ */
            margin-bottom: 0px;
            /* ไม่มีระยะห่างด้านล่าง */
            padding: 5px;
            /* ระยะห่างภายใน */
        }

        .legend div {
            display: flex;
            align-items: center;
            gap: 15px;
            margin-bottom: 0px;
        }

        /* กำหนดสีของกล่อง legend */
        .legend .box {
            width: 20px;
            /* ความกว้าง */
            height: 20px;
            /* ความสูง */
        }

        .legend .red {
            background-color: red;
            /* สีแดง */
        }

        .legend .green {
            background-color: green;
            /* สีเขียว */
        }

        /* การจัดตำแหน่งโครงสร้าง */
        .container {
            display: flex;
            /* ใช้ Flexbox */
            padding: 20px;
            /* ระยะห่างภายใน */
            gap: 20px;
            /* ระยะห่างระหว่างองค์ประกอบ */
        }

        /* การตั้งค่ารูปแบบของตาราง desks */
        .grid {
            display: grid;
            /* ใช้ Grid Layout */
            grid-template-columns: repeat(4, 1fr);
            /* กำหนดให้มี 4 คอลัมน์ */
            gap: 30px;
            /* ระยะห่างระหว่าง desks */
            flex: 3;
            /* ขยายส่วน grid */
        }

        /* รูปแบบ desk แต่ละอัน */
        .desk {
            width: 120px;
            height: 120px;
            background-color: green;
            /* สีพื้นหลัง */
            border-radius: 4px;
            /* มุมมน */
            display: flex;
            /* ใช้ Flexbox */
            justify-content: center;
            /* จัดให้อยู่ตรงกลาง */
            align-items: center;
            /* จัดให้อยู่ตรงกลาง */
            cursor: pointer;
            /* เปลี่ยนเคอร์เซอร์เมื่อชี้ */
            color: white;
            /* สีตัวอักษร */
            font-size: 40px;
            /* ขนาดตัวอักษร */
        }

        .desk.damaged {
            background-color: red;
            /* สีแดงสำหรับ damaged */
            cursor: not-allowed;
            /* เปลี่ยนเคอร์เซอร์เป็นไม่อนุญาต */
        }

        .desk.checked {
            background-color: rgb(0, 255, 0);
            /* สีเขียวอ่อนเมื่อเลือก */
            color: black;
            /* สีตัวอักษร */
        }

        /* ส่วนยืมอุปกรณ์ */
        .borrow-section {
            flex: 1;
            /* ขยายตามเนื้อที่ */
            background-color: #dcd0bc;
            /* สีพื้นหลัง */
            padding: 20px;
            /* ระยะห่างภายใน */
            border-radius: 8px;
            /* มุมมน */
        }

        .borrow-section h3 {
            margin-top: 0;
            font-size: 20px;
        }

        /* ส่วนรายการยืมอุปกรณ์ */
        .borrow-item {
            display: flex;
            /* ใช้ Flexbox */
            align-items: center;
            justify-content: space-between;
            /* จัดระยะห่างระหว่างป้ายกับช่องกรอก */
            margin-bottom: 10px;
            /* ระยะห่างด้านล่าง */
        }

        .borrow-item label {
            font-size: 16px;
            /* ขนาดตัวอักษร */
        }

        /* รูปแบบช่องกรอกจำนวน */
        .borrow-item input[type="number"] {
            width: 50px;
            padding: 5px;
            border: none;
            border-radius: 4px;
            background-color: #ffffff;
            color: #d2d2d2;
            text-align: center;
        }

        /* ปุ่มยืนยัน */
        .confirm-button {
            background-color: #E54715;
            /* สีพื้นหลัง */
            color: white;
            /* สีตัวอักษร */
            border: none;
            /* ไม่มีเส้นขอบ */
            padding: 10px 20px;
            /* ระยะห่างภายใน */
            font-size: 16px;
            /* ขนาดตัวอักษร */
            border-radius: 4px;
            /* มุมมน */
            cursor: pointer;
            /* เปลี่ยนเคอร์เซอร์เมื่อชี้ */
            position: absolute;
            bottom: 20px;
            right: 20px;
        }
    </style>
</head>

<body>
    <!-- โครงสร้าง HTML สำหรับหน้าหลัก -->
    <div class="header">
        <!-- ปุ่มย้อนกลับ -->
        <button class="back-button" onclick="window.location.href='Schedule.php';">&#8592;</button>
        <h2>ห้อง SC2-308</h2>
        <h1>ห้องฏิบัติการคอมพิวเตอร์ (CISCO)</h1>
    </div>

    <div class="desks-section">
        <div class="legend">
            <div class="box red"></div> อุปกรณ์ชำรุดเสียหาย
            <div class="box green"></div> ใช้งานได้
        </div>
    </div>

    <div class="container">

        <div class="grid">
            <!-- Example desks -->
            <div class="desk available" onclick="toggleDesk(this)"></div>
            <div class="desk available" onclick="toggleDesk(this)"></div>
            <div class="desk damaged"></div>
            <div class="desk available" onclick="toggleDesk(this)"></div>
            <div class="desk damaged"></div>
            <div class="desk available" onclick="toggleDesk(this)"></div>
            <div class="desk available" onclick="toggleDesk(this)"></div>
            <div class="desk available" onclick="toggleDesk(this)"></div>
            <div class="desk available" onclick="toggleDesk(this)"></div>
            <div class="desk available" onclick="toggleDesk(this)"></div>
            <div class="desk available" onclick="toggleDesk(this)"></div>
            <div class="desk available" onclick="toggleDesk(this)"></div>
        </div>

        <div class="borrow-section">
            <h3>ยืมอุปกรณ์</h3>
            <div class="borrow-item">
                <label for="console">สาย console:</label>
                <input type="number" id="console" value="0" min="0">
            </div>
            <div class="borrow-item">
                <label for="cat5">สาย lan cat5:</label>
                <input type="number" id="cat5" value="0" min="0">
            </div>
            <div class="borrow-item">
                <label for="crossover">สาย crossover:</label>
                <input type="number" id="crossover" value="0" min="0">
            </div>
            <div class="borrow-item">
                <label for="hub">Hub:</label>
                <input type="number" id="hub" value="0" min="0">
            </div>
            <div class="borrow-item">
                <label for="router">Router:</label>
                <input type="number" id="router" value="0" min="0">
            </div>
            <div class="borrow-item">
                <label for="switch">Switch:</label>
                <input type="number" id="switch" value="0" min="0">
            </div>
            <div class="borrow-item microphone">
                <label for="pointer">พอยเตอร์ :</label>
                <input type="number" id="pointer" value="0" min="0">
            </div>

            <button class="confirm-button" onclick="window.location.href='TimeIn.php'">ยืนยัน</button>

            <script>
                function toggleDesk(desk) {
                    if (!desk.classList.contains('damaged')) {
                        desk.classList.toggle('checked');
                        desk.textContent = desk.classList.contains('checked') ? '\u2713' : '';
                    }
                }
            </script>
        </div>
    </div>
</body>

</html>