// server.js
const express = require("express");
const session = require("express-session"); // ใช้ express-session
const connection = require("./db"); // นำเข้าการเชื่อมต่อฐานข้อมูล
const cors = require("cors");
const { Server } = require("socket.io");
const http = require("http");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }, // อนุญาตให้เชื่อมต่อจากทุกที่
});

// ✅ Middleware ตั้งแต่บนสุด
app.use(express.json()); // รองรับ JSON request body
app.use(
  cors({
    origin: "http://localhost:5501", // เปลี่ยนเป็นพอร์ตของ Frontend
    credentials: true, // ต้องเปิดเพื่อให้เบราว์เซอร์ส่ง Cookie
  })
);

// ✅ ตั้งค่า Session
app.use(
  session({
    secret: "supersecretkey",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // ใช้ false สำหรับ HTTP
      httpOnly: true,
      sameSite: "lax",
      maxAge: 3600000, // 1 ชั่วโมง
    },
  })
);

// ✅ API ล็อกอิน
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const [users] = await connection
      .promise()
      .query(
        "SELECT * FROM Users_accounts WHERE Username = ? AND Password = ?",
        [username, password]
      );

    if (users.length === 0) {
      return res
        .status(401)
        .json({ error: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" });
    }

    const user = users[0];

    // ค้นหาในตาราง Student_information
    const [studentResults] = await connection
      .promise()
      .query("SELECT * FROM Student_information WHERE Student_ID = ?", [
        user.Username,
      ]);

    if (studentResults.length > 0) {
      req.session.user = { role: "นิสิต", data: studentResults[0] };
      req.session.save((err) => {
        if (err) {
          console.error("❌ เกิดข้อผิดพลาดในการบันทึกเซสชัน:", err);
          return res.status(500).json({ error: "บันทึกเซสชันล้มเหลว" });
        }
        console.log("✅ เซสชันนิสิตถูกบันทึก:", req.session);
        res.cookie("connect.sid", req.sessionID, {
          httpOnly: true,
          sameSite: "lax",
        });
        return res.json({ success: true, role: "นิสิต" });
      });
      return;
    }

    // ค้นหาในตาราง Teacher_information
    const [teacherResults] = await connection
      .promise()
      .query("SELECT * FROM Teacher_information WHERE Teacher_ID = ?", [
        user.Username,
      ]);

    if (teacherResults.length > 0) {
      req.session.user = { role: "อาจารย์", data: teacherResults[0] };
      req.session.save((err) => {
        if (err) {
          console.error("❌ เกิดข้อผิดพลาดในการบันทึกเซสชัน:", err);
          return res.status(500).json({ error: "บันทึกเซสชันล้มเหลว" });
        }
        console.log("✅ เซสชันอาจารย์ถูกบันทึก:", req.session);
        res.cookie("connect.sid", req.sessionID, {
          httpOnly: true,
          sameSite: "lax",
        });
        return res.json({ success: true, role: "อาจารย์" });
      });
      return;
    }

    res.status(404).json({ error: "ไม่พบข้อมูลผู้ใช้" });
  } catch (err) {
    console.error("❌ เกิดข้อผิดพลาด:", err);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูล" });
  }
});

// ✅ API เช็คเซสชัน
app.get("/session", (req, res) => {
  console.log("📌 ตรวจสอบเซสชันจาก API:", req.session);
  if (req.session.user) {
    return res.json(req.session.user);
  } else {
    return res.status(401).json({ error: "ไม่ได้ล็อกอิน" });
  }
});

// ✅ API ล็อกเอาต์ -> ล้าง Session
app.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({ success: true });
  });
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:5501",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

// 📌 Endpoint: /getSchedule
app.get("/getSchedule", async (req, res) => {
  try {
    const [results] = await connection
      .promise()
      .query("SELECT * FROM Rooms_schedule_time");
    console.log("✅ ดึงข้อมูลตารางเรียนสำเร็จ:", results.length);
    res.json(results);
  } catch (err) {
    console.error("❌ เกิดข้อผิดพลาดในการดึงตารางเรียน:", err);
    res.status(500).json({ error: "ดึงข้อมูลตารางเรียนล้มเหลว" });
  }
});

// 📌 Endpoint: /Rooms_list_requests
app.get("/Rooms_list_requests", (req, res) => {
  connection.query("SELECT * FROM Rooms_list_requests", (err, results) => {
    if (err) {
      console.error("❌ Error:", err);
      res.status(500).send(err);
      return;
    }
    console.log("✅ ดึงข้อมูลการจองห้องสำเร็จ:", results.length);
    res.json(results);
  });
});

// 📌 Endpoint: /Manage_computers
app.get("/Manage_computers", (req, res) => {
  connection.query("SELECT * FROM Manage_computers", (err, results) => {
    if (err) {
      console.error("❌ Error:", err);
      res.status(500).send(err);
      return;
    }
    console.log("✅ ดึงข้อมูลคอมพิวเตอร์สำเร็จ:", results.length);
    res.json(results);
  });
});

// 📌 Endpoint: /getEquipments?room=307
app.get("/getEquipments", async (req, res) => {
  try {
    const room = req.query.room;
    if (!room) {
      return res.status(400).json({ error: "Missing room parameter" });
    }
    const [results] = await connection.promise().query(
      `SELECT m.Equipments_ID, m.Equipments_amount, e.Equipments_name 
         FROM Manage_equipments m 
         JOIN Equipments_list_information e ON m.Equipments_ID = e.Equipments_ID 
         WHERE m.Rooms_ID = ?`,
      [room]
    );
    console.log("✅ ดึงข้อมูลอุปกรณ์สำเร็จ:", results.length);
    res.json(results);
  } catch (err) {
    console.error("❌ เกิดข้อผิดพลาดในการดึงข้อมูลอุปกรณ์:", err);
    res.status(500).json({ error: "ดึงข้อมูลอุปกรณ์ล้มเหลว" });
  }
});

// ★ ปรับปรุง /roomdetail endpoint ให้รวมฟิลด์ Room_types ★
app.get("/roomdetail", (req, res) => {
  const query =
    "SELECT rli.Rooms_name AS Name, rli.Floors, rli.Rooms_ID, rli.Room_types, SUM(CASE WHEN rlr.Requests_status = 'อนุมัติ' THEN 1 ELSE 0 END) AS Approved_Count FROM Rooms_list_information rli LEFT JOIN Rooms_list_requests rlr ON rli.Rooms_ID = rlr.Rooms_ID GROUP BY rli.Rooms_ID, rli.Rooms_name, rli.Floors, rli.Room_types ORDER BY Approved_Count DESC;";
  connection.query(query, (err, results) => {
    if (err) {
      console.error("❌ เกิดข้อผิดพลาด:", err);
      res.status(500).send(err);
      return;
    }
    console.log("✅ ดึงข้อมูลห้องสำเร็จ:", results);
    res.json(results);
  });
});

// Endpoint: /data/Student_information
app.get("/data/Student_information", (req, res) => {
  connection.query("SELECT * FROM Student_information", (err, results) => {
    if (err) {
      console.error("❌ Error:", err);
      res.status(500).send(err);
      return;
    }
    console.log("✅ ดึงข้อมูลสำเร็จจาก Student_information:", results);
    res.json(results);
  });
});

// Endpoint: /data/Teacher_information
app.get("/data/Teacher_information", (req, res) => {
  connection.query("SELECT * FROM Teacher_information", (err, results) => {
    if (err) {
      console.error("❌ Error:", err);
      res.status(500).send(err);
      return;
    }
    console.log("✅ ดึงข้อมูลสำเร็จจาก Teacher_information:", results);
    res.json(results);
  });
});

// 📌 Endpoint: /user - ดึงข้อมูลผู้ใช้ (นิสิต)
app.get("/user", (req, res) => {
  const query =
    "SELECT si.Name, si.Student_ID, si.Department, si.Phone_number, si.Faculty, si.Study_year, si.email, COUNT(rlr.Identify_ID) AS Status FROM Rooms_list_requests rlr JOIN Student_information si ON rlr.Identify_ID = si.Student_ID GROUP BY si.Student_ID ORDER BY Status DESC;";
  connection.query(query, (err, results) => {
    if (err) {
      console.error("❌ เกิดข้อผิดพลาด:", err);
      res.status(500).send(err);
      return;
    }
    console.log("✅ ดึงข้อมูลผู้ใช้สำเร็จ:", results);
    res.json(results);
  });
});

// 📌 Endpoint: /userTeacher - ดึงข้อมูลอาจารย์
app.get("/userTeacher", async (req, res) => {
  try {
    const [results] = await connection
      .promise()
      .query("SELECT * FROM Teacher_information");
    console.log("✅ ดึงข้อมูลอาจารย์สำเร็จ:", results.length);
    res.json(results);
  } catch (err) {
    console.error("❌ เกิดข้อผิดพลาด:", err);
    res.status(500).json({ error: "ดึงข้อมูลล้มเหลว" });
  }
});

// 📌 Endpoint: /userAccount - ดึงข้อมูลบัญชีผู้ใช้
app.get("/userAccount", async (req, res) => {
  try {
    const [results] = await connection
      .promise()
      .query("SELECT * FROM Users_accounts;");
    console.log("✅ ดึงข้อมูลบัญชีผู้ใช้สำเร็จ:", results.length);
    res.json(results);
  } catch (err) {
    console.error("❌ เกิดข้อผิดพลาด:", err);
    res.status(500).json({ error: "ดึงข้อมูลล้มเหลว" });
  }
});

// 📌 Endpoint: /userBookings/:studentId
app.get("/userBookings/:studentId", async (req, res) => {
  const { studentId } = req.params;
  console.log("🎯 studentId ที่รับมา:", studentId);
  try {
    const [results] = await connection.promise().query(
      `SELECT 
         rlr.Rooms_requests_ID, 
         rlr.Rooms_ID, 
         rli.Rooms_name, 
         rlr.Used_date, 
         rlr.Start_time, 
         rlr.End_time, 
         rlr.Requests_status, 
         rlr.Requests_types
       FROM Rooms_list_requests rlr
       JOIN Rooms_list_information rli ON rlr.Rooms_ID = rli.Rooms_ID
       WHERE rlr.Identify_ID = ?`,
      [studentId]
    );
    console.log(`✅ ดึงข้อมูลการจองของ ${studentId} สำเร็จ:`, results);
    res.json(results);
  } catch (err) {
    console.error("❌ เกิดข้อผิดพลาด:", err);
    res.status(500).json({ error: "ดึงข้อมูลล้มเหลว" });
  }
});

// 📌 Endpoint: /cancelBooking/:requestId
app.delete("/cancelBooking/:requestId", async (req, res) => {
  const { requestId } = req.params;
  console.log(`🛑 กำลังพยายามลบการจอง ID: ${requestId}`);
  try {
    const [rows] = await connection
      .promise()
      .query(
        "SELECT * FROM Rooms_list_requests WHERE Rooms_requests_ID = ? AND Requests_status = 'รอดำเนินการ'",
        [requestId]
      );
    console.log("🔍 ค้นหาข้อมูล:", rows);
    if (rows.length === 0) {
      console.log("❌ ไม่มีข้อมูลการจองที่สามารถลบได้");
      return res.status(400).json({ error: "ไม่มีข้อมูลการจองที่สามารถลบได้" });
    }
    await connection
      .promise()
      .query("DELETE FROM Rooms_list_requests WHERE Rooms_requests_ID = ?", [
        requestId,
      ]);
    console.log(`✅ ลบข้อมูลสำเร็จ! ID: ${requestId}`);
    res.json({ success: true, message: "ยกเลิกการจองสำเร็จ!" });
  } catch (err) {
    console.error("❌ ERROR:", err);
    res.status(500).json({ error: "ลบข้อมูลล้มเหลว" });
  }
});

// Endpoint: /getEquipmentInformation
app.get("/getEquipmentInformation", async (req, res) => {
  try {
    const [results] = await connection
      .promise()
      .query("SELECT * FROM Equipments_list_information");
    console.log(
      "✅ ดึงข้อมูล Equipments_list_information สำเร็จ:",
      results.length
    );
    res.json(results);
  } catch (err) {
    console.error("เกิดข้อผิดพลาดในการดึงข้อมูลอุปกรณ์:", err);
    res.status(500).json({ error: "ดึงข้อมูลอุปกรณ์ล้มเหลว" });
  }
});

app.get("/getBrokenEquipments", async (req, res) => {
  if (!req.session.user || !req.session.user.data.Student_ID) {
    return res.status(401).json({ error: "กรุณาเข้าสู่ระบบ" });
  }

  const studentId = req.session.user.data.Student_ID;

  try {
    const query = `
    SELECT 
    DATE_FORMAT(eb.Repair_date, '%Y-%m-%d %H:%i:%s') AS Repair_date, 
    ei.Equipments_name, 
    eb.Damaged_details, 
    eb.Rooms_ID, 
    ai.Name AS Admin_Name,
    eb.Repair_status
    FROM Equipments_list_brokened eb
    JOIN Equipments_list_information ei ON eb.Equipments_ID = ei.Equipments_ID
    JOIN Admin_information ai ON eb.Admin_ID = ai.Admin_ID
    WHERE eb.Identify_ID = ?  
    ORDER BY eb.Repair_date DESC;
    `;

    const [results] = await connection.promise().query(query, [studentId]);
    res.json(results);
  } catch (err) {
    console.error("❌ เกิดข้อผิดพลาดในการดึงข้อมูล:", err);
    res.status(500).json({ error: "ดึงข้อมูลล้มเหลว" });
  }
});

app.get("/getRoomInfo", async (req, res) => {
  const roomID = req.query.room;
  if (!roomID) {
    return res.status(400).json({ error: "❌ ต้องระบุ room ID" });
  }

  try {
    const [results] = await connection
      .promise()
      .query(
        "SELECT Room_types, Rooms_name FROM Rooms_list_information WHERE Rooms_ID = ?",
        [roomID]
      );

    if (results.length === 0) {
      return res.status(404).json({ error: "❌ ไม่พบข้อมูลห้อง" });
    }

    res.json(results);
  } catch (err) {
    console.error("❌ เกิดข้อผิดพลาด:", err);
    res.status(500).json({ error: "ดึงข้อมูลล้มเหลว" });
  }
});

app.get("/getEquipmentsByIds", async (req, res) => {
  let ids = req.query.ids;

  if (!ids) {
    return res.status(400).json({ error: "❌ ต้องระบุ Equipments_ID" });
  }

  ids = ids.split(",").map((id) => id.trim()); // ✅ แปลงเป็น Array และลบช่องว่าง

  console.log("📌 ค่าที่รับจาก Frontend:", ids); // ✅ Debug ค่าที่ส่งมา

  try {
    // ✅ ใช้ `IN (?)` เพื่อค้นหาหลายอุปกรณ์
    const [results] = await connection
      .promise()
      .query(
        `SELECT Equipments_ID, Equipments_name FROM Equipments_list_information WHERE Equipments_ID IN (${ids
          .map(() => "?")
          .join(",")})`,
        ids
      );

    console.log("📌 ผลลัพธ์จาก Database:", results); // ✅ Debug ข้อมูลที่ได้จากฐานข้อมูล

    if (results.length === 0) {
      return res.status(404).json({ error: "❌ ไม่พบข้อมูลอุปกรณ์" });
    }

    res.json(results);
  } catch (err) {
    console.error("❌ เกิดข้อผิดพลาด:", err);
    res.status(500).json({ error: "ดึงข้อมูลล้มเหลว" });
  }
});

// 📌 WebSocket สำหรับการอัปเดตเรียลไทม์
io.on("connection", (socket) => {
  console.log("A user connected via WebSocket");
  socket.on("triggerBookingUpdate", () => {
    io.emit("booking_update", { message: "ข้อมูลการจองได้รับการอัปเดต" });
  });
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// 📌 Endpoint: /bookRoom - เพิ่มข้อมูลการจองห้อง
app.post("/bookRoom", async (req, res) => {
  const {
    room_id,
    used_date,
    student_id,
    start_time,
    end_time,
    reason,
    request_type,
  } = req.body;

  if (
    !room_id ||
    !used_date ||
    !student_id ||
    !start_time ||
    !end_time ||
    !reason ||
    !request_type
  ) {
    return res.status(400).json({ error: "กรุณากรอกข้อมูลให้ครบถ้วน" });
  }

  try {
    const query = `
          INSERT INTO Rooms_list_requests 
          (Rooms_ID, Used_date, Identify_ID, Start_time, End_time, Reason, Requests_status, Requests_types) 
          VALUES (?, ?, ?, ?, ?, ?, 'รอดำเนินการ', ?);
      `;
    await connection
      .promise()
      .query(query, [
        room_id,
        used_date,
        student_id,
        start_time,
        end_time,
        reason,
        request_type,
      ]);

    console.log(
      `✅ เพิ่มข้อมูลการจองห้องสำเร็จ: ห้อง ${room_id} โดย ${student_id}`
    );
    res.json({ success: true, message: "จองห้องสำเร็จ" });

    // แจ้งเตือนผ่าน WebSocket
    io.emit("booking_update", { message: "มีการจองห้องใหม่" });
  } catch (err) {
    console.error("❌ เกิดข้อผิดพลาดในการเพิ่มข้อมูล:", err);
    res.status(500).json({ error: "บันทึกข้อมูลล้มเหลว" });
  }
});

// 📌 Endpoint: /bookRoomOut - เพิ่มข้อมูลการจองห้องนอกเวลา
app.post("/bookRoomOut", async (req, res) => {
  const {
    room_id,
    used_date,
    student_id,
    start_time,
    end_time,
    reason,
    request_type,
    members,
  } = req.body;

  if (
    !room_id ||
    !used_date ||
    !student_id ||
    !start_time ||
    !end_time ||
    !reason ||
    !request_type
  ) {
    return res.status(400).json({ error: "กรุณากรอกข้อมูลให้ครบถ้วน" });
  }

  const connectionPromise = connection.promise();

  try {
    // ✅ เริ่ม Transaction
    await connectionPromise.beginTransaction();

    // ✅ เพิ่มข้อมูลการจองห้องนอกเวลา
    const insertBookingQuery = `
      INSERT INTO Rooms_list_requests 
      (Rooms_ID, Used_date, Identify_ID, Start_time, End_time, Reason, Requests_status, Requests_types) 
      VALUES (?, ?, ?, ?, ?, ?, 'รอดำเนินการ', ?);
    `;
    const [result] = await connectionPromise.query(insertBookingQuery, [
      room_id,
      used_date,
      student_id,
      start_time,
      end_time,
      reason,
      request_type,
    ]);

    const bookingId = result.insertId; // ได้ `Rooms_requests_ID` ที่เพิ่มใหม่

    // ✅ เพิ่มสมาชิกที่เข้าร่วมการจอง (ถ้ามี)
    if (members && members.length > 0) {
      const insertMembersQuery = `
        INSERT INTO Room_booking_members (Rooms_requests_ID, Student_ID) 
        VALUES ?;
      `;

      const memberValues = members.map((member) => [bookingId, member]);

      await connectionPromise.query(insertMembersQuery, [memberValues]);
    }

    // ✅ Commit Transaction
    await connectionPromise.commit();

    console.log(
      `✅ เพิ่มข้อมูลการจองห้องนอกเวลาสำเร็จ: ห้อง ${room_id} โดย ${student_id}`
    );
    res.json({ success: true, message: "จองห้องสำเร็จ" });

    // แจ้งเตือนผ่าน WebSocket
    io.emit("booking_update", { message: "มีการจองห้องนอกเวลาใหม่" });
  } catch (err) {
    // ❌ Rollback Transaction ถ้าเกิดข้อผิดพลาด
    await connectionPromise.rollback();
    console.error("❌ เกิดข้อผิดพลาดในการเพิ่มข้อมูล:", err);
    res.status(500).json({ error: "บันทึกข้อมูลล้มเหลว" });
  }
});

// ✅ เริ่มเซิร์ฟเวอร์
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
