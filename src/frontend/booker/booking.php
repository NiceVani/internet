<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EasyRoom Reservation System - จองห้อง</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f9f9f9;
        }

        /* Header */
        .header {
            background-color: #e54715;
            padding: 15px;
            color: white;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .header-title {
            font-size: 20px;
            font-weight: bold;
        }

        .nav {
            display: flex;
            gap: 20px;
        }

        .nav a {
            color: white;
            text-decoration: none;
            font-size: 16px;
        }

        .nav a:hover {
            text-decoration: underline;
        }

        .nav a.active {
            font-weight: bold;
            text-decoration: underline;
        }

        /* Content */
        .content {
            padding: 20px;
            text-align: center;
        }

        .floor-selector {
            margin-bottom: 20px;
        }

        .floor-selector button {
            background-color: #a569bd;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 4px;
            cursor: pointer;
            margin: 5px;
        }

        .floor-selector button.active {
            background-color: #6c3483;
        }

        .floor-selector button:hover {
            background-color: #512e5f;
        }

        .floor-plan {
            display: none;
            position: relative;
        }

        .floor-plan.active {
            display: block;
        }
    </style>
</head>

<body>
    <!-- Header -->
    <div class="header">
        <div class="header-title">EasyRoom Reservation System</div>
        <div class="nav">
            <a href="home.php">หน้าหลัก</a>
            <a href="booking.php" class="active">จองห้อง</a>
            <a href="repost.php">รายงาน</a>
        </div>
    </div>

    <!-- Content -->
    <div class="content">
        <div class="floor-selector">
            <button class="floor-btn active" data-floor="floor2" data-file="Floor2.php">ชั้น 2</button>
            <button class="floor-btn" data-floor="floor3" data-file="Floor3.php">ชั้น 3</button>
            <button class="floor-btn" data-floor="floor4" data-file="Floor4.php">ชั้น 4</button>
        </div>

        <div id="floor2" class="floor-plan active"><?php include('Floor2.php'); ?></div>
        <div id="floor3" class="floor-plan"><?php include('Floor3.php'); ?></div>
        <div id="floor4" class="floor-plan"><?php include('Floor4.php'); ?></div>
    </div>

    <script>
        const floorButtons = document.querySelectorAll('.floor-btn');
        const floorPlans = document.querySelectorAll('.floor-plan');

        // Handle floor button click
        floorButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons
                floorButtons.forEach(btn => btn.classList.remove('active'));
                // Add active class to the clicked button
                button.classList.add('active');

                // Hide all floor plans
                floorPlans.forEach(plan => plan.classList.remove('active'));
                // Show the selected floor plan
                const floorId = button.getAttribute('data-floor');
                const file = button.getAttribute('data-file');
                document.getElementById(floorId).classList.add('active');

                // Dynamically load the selected floor's content via PHP includes
                fetch(file)
                    .then(response => response.text())
                    .then(html => {
                        document.getElementById(floorId).innerHTML = html;
                    });
            });
        });
    </script>
</body>

</html>