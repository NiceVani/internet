<?php
// ตั้งค่าการเชื่อมต่อฐานข้อมูล
include('db_connect.php');
?>
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>EasyRoom Reservation System - รายงานปัญหา</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      font-family: Arial, sans-serif;
    }

    body {
      background-color: #ffffff;
      color: #000000;
    }

    header {
      background-color: #e54715;
      color: #ffffff;
      padding: 10px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    header h1 {
      font-size: 24px;
    }

    nav a {
      color: #ffffff;
      margin-left: 15px;
      text-decoration: none;
      font-size: 18px;
    }

    .container {
      margin: 20px;
      max-width: 800px;
    }

    .form-section {
      margin-bottom: 20px;
    }

    .form-section label {
      display: block;
      font-weight: bold;
      margin-bottom: 8px;
    }

    .form-section select,
    .form-section textarea {
      width: 100%;
      padding: 8px;
      margin-bottom: 10px;
      border: 1px solid #ccc;
      border-radius: 4px;
    }

    .form-section textarea {
      resize: none;
      height: 80px;
    }

    .upload-section {
      text-align: center;
      margin: 20px 0;
      color: #ccc;
    }

    button {
      background-color: #e54715;
      color: #ffffff;
      border: none;
      padding: 10px 20px;
      font-size: 16px;
      cursor: pointer;
      border-radius: 4px;
    }

    button:hover {
      background-color: #c63c12;
    }

    .uploaded-image {
      margin-top: 20px;
      text-align: center;
    }

    .uploaded-image img {
      max-width: 100%;
      height: auto;
      border: 1px solid #ccc;
      border-radius: 4px;
    }
  </style>
</head>

<body>
  <header>
    <h1>EasyRoom Reservation System</h1>
    <nav>
      <a href="home.php">หน้าหลัก</a>
      <a href="booking.php">จองห้อง</a>
      <a href="repost.php">รายงาน</a>
    </nav>
  </header>

  <div class="container">
    <h2>รายงานปัญหา</h2>

    <form action="report_issue.php" method="POST" enctype="multipart/form-data">
      <div class="upload-section">
        <p>อัปโหลดรูปภาพ</p>
        <input type="file" name="image" accept="image/*" onchange="previewImage(event)">
      </div>

      <!-- การแสดงภาพที่ถูกเลือก -->
      <div class="uploaded-image">
        <img id="preview" src="#" alt="Preview Image" style="display: none;">
      </div>

      <div class="form-section">
        <label for="equipment">ชื่ออุปกรณ์</label>
        <select id="equipment" name="equipment">
          <option value="สายไฟ">สายไฟ</option>
          <option value="เก้าอี้">เก้าอี้</option>
          <option value="โต๊ะ">โต๊ะ</option>
          <option value="จอคอมพิวเตอร์">จอคอมพิวเตอร์</option>
          <option value="โปรเจคเตอร์">โปรเจคเตอร์</option>
          <option value="ทีวี">ทีวี</option>
          <option value="เครื่องปรับอากาศ">เครื่องปรับอากาศ</option>
          <option value="วิชวลไลเซอร์">วิชวลไลเซอร์</option>
          <option value="hub">hub</option>
          <option value="router">router</option>
          <option value="switch">switch</option>
          <option value="พอยเตอร์">พอยเตอร์</option>
          <option value="เมาส์">เมาส์</option>
          <option value="คีย์บอร์ด">คีย์บอร์ด</option>
          <option value="ปลั๊กไฟ">ปลั๊กไฟ</option>
          <option value="เสียงไมค์">เสียงไมค์</option>
          <option value="คอมพิวเตอร์">คอมพิวเตอร์</option>
        </select>

        <label for="room">ห้อง</label>
        <select id="room" name="room">
          <option value="SC2-211">SC2-211</option>
          <option value="SC2-212">SC2-212</option>
          <option value="SC2-307">SC2-307</option>
          <option value="SC2-308">SC2-308</option>
          <option value="SC2-311">SC2-311</option>
          <option value="SC2-313">SC2-313</option>
          <option value="SC2-313-1">SC2-313-1</option>
          <option value="SC2-314">SC2-314</option>
          <option value="SC2-407">SC2-407</option>
          <option value="SC2-411">SC2-411</option>
          <option value="SC2-414">SC2-414</option>
        </select>

        <label for="details">รายละเอียดเพิ่มเติม</label>
        <textarea id="details" name="details" placeholder="สาย HDMI เกิดความเสียหายเนื่องจากเกิดอุบัติเหตุ"></textarea>
      </div>

      <button type="button" onclick="window.location.href='home.php'">ยืนยัน</button>
    </form>

    <?php
    // report_issue.php
    if ($_SERVER['REQUEST_METHOD'] == 'POST') {
      $equipment = $_POST['equipment'];
      $room = $_POST['room'];
      $details = $_POST['details'];

      // เชื่อมต่อฐานข้อมูล
      $conn = new mysqli('localhost', 'root', '', 'EasyRoom');

      // ตรวจสอบการเชื่อมต่อ
      if ($conn->connect_error) {
        die('Connection failed: ' . $conn->connect_error);
      }

      // ตรวจสอบการอัปโหลดไฟล์
      if (isset($_FILES['image']) && $_FILES['image']['error'] == 0) {
        $file_tmp = $_FILES['image']['tmp_name'];
        $file_name = $_FILES['image']['name'];
        $file_size = $_FILES['image']['size'];
        $file_type = $_FILES['image']['type'];

        // กำหนดโฟลเดอร์ที่เก็บไฟล์
        $upload_dir = 'uploads/'; // โฟลเดอร์สำหรับเก็บไฟล์ที่อัปโหลด
        $upload_file = $upload_dir . basename($file_name);

        // ตรวจสอบขนาดไฟล์ (ไม่เกิน 2MB)
        if ($file_size > 2 * 1024 * 1024) {
          echo "<script>alert('ขอโทษครับ ขนาดไฟล์เกิน 2MB'); window.history.back();</script>";
          exit();
        }

        // ตรวจสอบชนิดของไฟล์ (ให้รับเฉพาะไฟล์รูปภาพ)
        $allowed_types = ['image/jpeg', 'image/png', 'image/gif'];
        if (!in_array($file_type, $allowed_types)) {
          echo "<script>alert('ขอโทษครับ รองรับเฉพาะไฟล์รูปภาพ'); window.history.back();</script>";
          exit();
        }

        // ย้ายไฟล์ไปยังโฟลเดอร์ที่กำหนด
        if (move_uploaded_file($file_tmp, $upload_file)) {
          $image_path = $upload_file; // เก็บเส้นทางของไฟล์ที่อัปโหลด

          // บันทึกข้อมูลลงฐานข้อมูล
          $stmt = $conn->prepare("INSERT INTO issue_reports (equipment, room, details, image_path, created_at) VALUES (?, ?, ?, ?, NOW())");
          $stmt->bind_param('ssss', $equipment, $room, $details, $image_path);

          if ($stmt->execute()) {
            echo "<script>alert('รายงานปัญหาเรียบร้อยแล้ว!'); window.location.href = 'home.php';</script>";
          } else {
            echo "<script>alert('เกิดข้อผิดพลาด! กรุณาลองใหม่อีกครั้ง'); window.history.back();</script>";
          }

          $stmt->close();
        } else {
          echo "<script>alert('เกิดข้อผิดพลาดในการอัปโหลดไฟล์'); window.history.back();</script>";
        }
      }
      $conn->close();
    }
    ?>
  </div>

  <script>
    function previewImage(event) {
      var reader = new FileReader();
      reader.onload = function() {
        var output = document.getElementById('preview');
        output.src = reader.result;
        output.style.display = 'block'; // แสดงภาพที่อัปโหลด
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  </script>
</body>

</html>