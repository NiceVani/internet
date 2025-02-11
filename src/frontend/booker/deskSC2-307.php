<?php
// ตั้งค่าการเชื่อมต่อฐานข้อมูล
include('db_connect.php');

$result = $conn->query("SELECT * FROM desk_status");
$desks = [];
while ($row = $result->fetch_assoc()) {
    $desks[] = $row;
}
echo json_encode($desks);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);

    $console = $data['console'] ?? 0;
    $cat5 = $data['cat5'] ?? 0;
    $crossover = $data['crossover'] ?? 0;
    $hub = $data['hub'] ?? 0;
    $router = $data['router'] ?? 0;
    $switch = $data['switch'] ?? 0;
    $pointer = $data['pointer'] ?? 0;

    $stmt = $conn->prepare("INSERT INTO borrow_items (console, cat5, crossover, hub, router, switch, pointer) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("iiiiiii", $console, $cat5, $crossover, $hub, $router, $switch, $pointer);

    if ($stmt->execute()) {
        echo "การยืมอุปกรณ์สำเร็จ";
    } else {
        echo "เกิดข้อผิดพลาด: " . $conn->error;
    }
    $stmt->close();
}

$conn->close();
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Room SC2-308</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #ffffff;
            min-height: 100vh;
        }

        .header {
            background-color: #E54715;
            color: white;
            padding: 20px;
            text-align: left;
            font-size: 24px;
            font-weight: bold;
        }

        .grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 10px;
            padding: 20px;
        }

        .desk {
            width: 100px;
            height: 100px;
            background-color: green;
            border-radius: 4px;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            color: white;
        }

        .desk.damaged {
            background-color: red;
            cursor: not-allowed;
        }

        .desk.checked {
            background-color: lightgreen;
            color: black;
        }

        .borrow-section {
            margin: 20px;
            background-color: #f4f4f4;
            padding: 20px;
            border-radius: 8px;
        }

        .borrow-section h3 {
            margin-top: 0;
        }

        .borrow-item {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
        }

        .borrow-item input {
            width: 50px;
            text-align: center;
        }

        .confirm-button {
            background-color: #E54715;
            color: white;
            border: none;
            padding: 10px 20px;
            cursor: pointer;
            border-radius: 4px;
        }
    </style>
</head>

<body>
    <div class="header">
        <button class="back-button" onclick="window.location.href='Schedule.php';">&#8592; </button>
        <h2>ห้อง SC2-307</h2>
        <h1>ห้องฏิบัติการคอมพิวเตอร์</h1>
    </div>
    <div class="container">
        <div class="desks-section">
            <div class="legend">
                <div class="box red"></div> อุปกรณ์ชำรุดเสียหาย
                <div class="box green"></div> ใช้งานได้
            </div>
            <div class="grid">
                <div class="column-group group-1" id="group-1"></div>
                <div class="column-group group-2" id="group-2"></div>
                <div class="column-group group-3" id="group-3"></div>
            </div>
        </div>

        <div class="borrow-section">
            <h3>ยืมอุปกรณ์</h3>
            <div class="borrow-item">
                <label>สาย console:</label>
                <input type="number" id="console" value="0" min="0">
            </div>
            <div class="borrow-item">
                <label>สาย cat5:</label>
                <input type="number" id="cat5" value="0" min="0">
            </div>
            <div class="borrow-item">
                <label>สาย crossover:</label>
                <input type="number" id="crossover" value="0" min="0">
            </div>
            <div class="borrow-item">
                <label>Hub:</label>
                <input type="number" id="hub" value="0" min="0">
            </div>
            <div class="borrow-item">
                <label>Router:</label>
                <input type="number" id="router" value="0" min="0">
            </div>
            <div class="borrow-item">
                <label>Switch:</label>
                <input type="number" id="switch" value="0" min="0">
            </div>
            <div class="borrow-item">
                <label>พอยเตอร์:</label>
                <input type="number" id="pointer" value="0" min="0">
            </div>
            <button class="confirm-button" onclick="submitBorrow()">ยืนยัน</button>
        </div>

        <script>
            async function loadDesks() {
                const response = await fetch('fetch_desks.php');
                const desks = await response.json();
                const deskGrid = document.getElementById('deskGrid');
                desks.forEach(desk => {
                    const deskDiv = document.createElement('div');
                    deskDiv.classList.add('desk', desk.status);
                    deskDiv.onclick = () => toggleDesk(deskDiv);
                    deskGrid.appendChild(deskDiv);
                });
            }

            function toggleDesk(desk) {
                if (!desk.classList.contains('damaged')) {
                    desk.classList.toggle('checked');
                }
            }

            async function submitBorrow() {
                const data = {
                    console: document.getElementById('console').value,
                    cat5: document.getElementById('cat5').value,
                    crossover: document.getElementById('crossover').value,
                    hub: document.getElementById('hub').value,
                    router: document.getElementById('router').value,
                    switch: document.getElementById('switch').value,
                    pointer: document.getElementById('pointer').value,
                };

                const response = await fetch('submit_borrow.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });
                const result = await response.text();
                alert(result);
            }

            loadDesks();
        </script>
</body>

</html>