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
        "SELECT * FROM user WHERE username = ? AND password = ?",
        [username, password]
      );

    if (users.length === 0) {
      return res
        .status(401)
        .json({ error: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" });
    }

    const user = users[0];

    // ค้นหาในตาราง student
    const [studentResults] = await connection
      .promise()
      .query("SELECT * FROM student WHERE student_id = ?", [
        user.username,
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

    // ค้นหาในตาราง teacher
    const [teacherResults] = await connection
      .promise()
      .query("SELECT * FROM teacher WHERE teacher_id = ?", [
        user.username,
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
    const { role, data } = req.session.user;
    res.json({
      role: role,
      data: {
        user_id: data.student_id || data.teacher_id, // ใช้ student_id ถ้าเป็นนิสิต, ใช้ teacher_id ถ้าเป็นอาจารย์
        student_id: data.student_id || null, // เพิ่ม student_id
        teacher_id: data.teacher_id || null, // เพิ่ม teacher_id
        full_name: data.full_name,
        faculty: data.faculty,
        department: data.department,
        study_year: data.study_year || "N/A", // อาจารย์ไม่มี study_year
      },
    });
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
      .query("SELECT * FROM room_schedule");
    console.log("✅ ดึงข้อมูลตารางเรียนสำเร็จ:", results.length);
    res.json(results);
  } catch (err) {
    console.error("❌ เกิดข้อผิดพลาดในการดึงตารางเรียน:", err);
    res.status(500).json({ error: "ดึงข้อมูลตารางเรียนล้มเหลว" });
  }
});

// 📌 Endpoint: /room_request
app.get("/room_request", (req, res) => {
  connection.query("SELECT * FROM room_request", (err, results) => {
    if (err) {
      console.error("❌ Error:", err);
      res.status(500).send(err);
      return;
    }
    console.log("✅ ดึงข้อมูลการจองห้องสำเร็จ:", results.length);
    res.json(results);
  });
});

// 📌 Endpoint: /computer_management
app.get("/computer_management", (req, res) => {
  connection.query("SELECT * FROM computer_management", (err, results) => {
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
      `SELECT m.equipment_id, m.request_quantity, e.equipment_name 
         FROM equipment_management m 
         JOIN equipment e ON m.equipment_id = e.equipment_id 
         WHERE m.room_id = ?`,
      [room]
    );
    console.log("✅ ดึงข้อมูลอุปกรณ์สำเร็จ:", results.length);
    res.json(results);
  } catch (err) {
    console.error("❌ เกิดข้อผิดพลาดในการดึงข้อมูลอุปกรณ์:", err);
    res.status(500).json({ error: "ดึงข้อมูลอุปกรณ์ล้มเหลว" });
  }
});

// ★ ปรับปรุง /roomdetail endpoint ให้รวมฟิลด์ room_name ★
app.get("/roomdetail", (req, res) => {
  const query =
    "SELECT rli.room_name AS full_name, rli.floor, rli.room_id, rli.room_name, SUM(CASE WHEN rlr.request_status = 'อนุมัติ' THEN 1 ELSE 0 END) AS Approved_Count FROM room rli LEFT JOIN room_request rlr ON rli.room_id = rlr.room_id GROUP BY rli.room_id, rli.room_name, rli.floor, rli.room_name ORDER BY Approved_Count DESC;";
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

// Endpoint: /data/student
app.get("/data/student", (req, res) => {
  connection.query("SELECT * FROM student", (err, results) => {
    if (err) {
      console.error("❌ Error:", err);
      res.status(500).send(err);
      return;
    }
    console.log("✅ ดึงข้อมูลสำเร็จจาก student:", results);
    res.json(results);
  });
});

// Endpoint: /data/teacher
app.get("/data/teacher", (req, res) => {
  connection.query("SELECT * FROM teacher", (err, results) => {
    if (err) {
      console.error("❌ Error:", err);
      res.status(500).send(err);
      return;
    }
    console.log("✅ ดึงข้อมูลสำเร็จจาก teacher:", results);
    res.json(results);
  });
});

// 📌 Endpoint: /user - ดึงข้อมูลผู้ใช้ (นิสิตและอาจารย์)
app.get("/user", (req, res) => {
  const query = `
    SELECT 
      si.full_name, 
      si.student_id AS user_id, 
      si.department, 
      si.phone_number, 
      si.faculty, 
      si.study_year, 
      si.email, 
      COUNT(rlr.student_id) AS Status 
    FROM room_request rlr 
    JOIN student si ON rlr.student_id = si.student_id 
    GROUP BY si.student_id 
    ORDER BY Status DESC;
  `;
  
  connection.query(query, (err, studentResults) => {
    if (err) {
      console.error("❌ เกิดข้อผิดพลาด (นิสิต):", err);
      res.status(500).send(err);
      return;
    }

    console.log("✅ ดึงข้อมูลนิสิตสำเร็จ:", studentResults);

    // 📌 คิวรีข้อมูลอาจารย์เพิ่มเติม
    const teacherQuery = `
      SELECT 
        ti.full_name, 
        ti.teacher_id AS user_id, 
        ti.department, 
        ti.phone_number, 
        ti.faculty, 
        NULL AS study_year,  -- อาจารย์ไม่มี study_year
        ti.email, 
        COUNT(rlr.teacher_id) AS Status 
      FROM room_request rlr 
      JOIN teacher ti ON rlr.teacher_id = ti.teacher_id 
      GROUP BY ti.teacher_id 
      ORDER BY Status DESC;
    `;

    connection.query(teacherQuery, (err, teacherResults) => {
      if (err) {
        console.error("❌ เกิดข้อผิดพลาด (อาจารย์):", err);
        res.status(500).send(err);
        return;
      }

      console.log("✅ ดึงข้อมูลอาจารย์สำเร็จ:", teacherResults);

      // รวมข้อมูล นิสิต + อาจารย์ แล้วส่งกลับ
      const allUsers = [...studentResults, ...teacherResults];
      res.json(allUsers);
    });
  });
});


// 📌 Endpoint: /userTeacher - ดึงข้อมูลอาจารย์
app.get("/userTeacher", async (req, res) => {
  try {
    const [results] = await connection
      .promise()
      .query("SELECT * FROM teacher");
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
      .query("SELECT * FROM user;");
    console.log("✅ ดึงข้อมูลบัญชีผู้ใช้สำเร็จ:", results.length);
    res.json(results);
  } catch (err) {
    console.error("❌ เกิดข้อผิดพลาด:", err);
    res.status(500).json({ error: "ดึงข้อมูลล้มเหลว" });
  }
});

app.get("/userBookings/:userId", async (req, res) => {
  const { userId } = req.params;
  console.log("🎯 userId ที่รับมา:", userId);

  try {
    // ✅ ตั้งค่า time_zone เป็น GMT+7 (Asia/Bangkok) ก่อน Query
    await connection.promise().query("SET time_zone = '+07:00'");

    // ตรวจสอบว่าผู้ใช้นี้เป็น "นิสิต" หรือ "อาจารย์"
    const [userResults] = await connection.promise().query(
      "SELECT role FROM user WHERE username = ?",
      [userId]
    );

    if (userResults.length === 0) {
      return res.status(404).json({ error: "ไม่พบผู้ใช้ในระบบ" });
    }

    const userRole = userResults[0].role;
    console.log(`👤 ผู้ใช้ ${userId} มีบทบาทเป็น: ${userRole}`);

    let query = "";
    let values = [];

    if (userRole === "นิสิต") {
      // คิวรีข้อมูลการจองของนิสิต
      query = `
        SELECT 
          rlr.room_request_id, 
          rlr.room_id, 
          rli.room_name, 
          CONVERT_TZ(rlr.used_date, '+00:00', '+07:00') AS Used_date, 
          rlr.start_time, 
          rlr.end_time, 
          rlr.request_status, 
          rlr.request_type
        FROM room_request rlr
        JOIN room rli ON rlr.room_id = rli.room_id
        JOIN room_type rt ON rt.room_type_id = rli.room_type_id
        JOIN student s ON rlr.student_id = s.student_id
        WHERE s.student_id = ?`;
      values = [userId];
    } else if (userRole === "อาจารย์") {
      // คิวรีข้อมูลการจองของอาจารย์
      query = `
        SELECT 
          rlr.room_request_id, 
          rlr.room_id, 
          rli.room_name, 
          CONVERT_TZ(rlr.used_date, '+00:00', '+07:00') AS Used_date, 
          rlr.start_time, 
          rlr.end_time, 
          rlr.request_status, 
          rlr.request_type
        FROM room_request rlr
        JOIN room rli ON rlr.room_id = rli.room_id
        JOIN room_type rt ON rt.room_type_id = rli.room_type_id
        JOIN teacher t ON rlr.teacher_id = t.teacher_id
        WHERE t.teacher_id = ?`;
      values = [userId];
    } else {
      return res.status(400).json({ error: "บทบาทไม่ถูกต้อง" });
    }

    // ดึงข้อมูลตามเงื่อนไขที่กำหนด
    const [results] = await connection.promise().query(query, values);
    console.log(`✅ ดึงข้อมูลการจองของ ${userId} สำเร็จ:`, results);

    res.json(results);
  } catch (err) {
    console.error("❌ เกิดข้อผิดพลาด:", err);
    res.status(500).json({ error: "ดึงข้อมูลล้มเหลว" });
  }
});


// 📌 Endpoint: /cancelBooking/:requestId
app.delete("/cancelBooking/:requestId", async (req, res) => {
  const { requestId } = req.params;
  console.log(`🛑 กำลังยกเลิกการจอง ID: ${requestId}`);

  try {
    // ✅ ตรวจสอบ requestId ที่รับเข้ามา
    if (!requestId) {
      console.log("❌ requestId ไม่ถูกต้อง");
      return res.status(400).json({ error: "requestId ไม่ถูกต้อง" });
    }

    // ✅ ตรวจสอบว่ามีการจองที่ตรงกับ requestId หรือไม่
    const [checkResult] = await connection.promise().query(
      "SELECT * FROM room_request WHERE room_request_id = ?",
      [requestId]
    );
    console.log("🔍 ข้อมูลที่ค้นหา:", checkResult);

    if (checkResult.length === 0) {
      console.log("❌ ไม่พบข้อมูลการจองที่สามารถยกเลิกได้");
      return res.status(404).json({ error: "ไม่พบการจองนี้ในระบบ" });
    }

    // ✅ อัปเดต request_status เป็น "ยกเลิกการจอง"
    const [updateResult] = await connection.promise().query(
      `UPDATE room_request
       SET request_status = 'ยกเลิกการจอง'
       WHERE room_request_id = ?`,
      [requestId]
    );

    console.log("🔄 อัปเดตสถานะ:", updateResult);

    if (updateResult.affectedRows === 0) {
      console.log("❌ ไม่สามารถอัปเดตสถานะการจองได้");
      return res.status(400).json({ error: "ไม่สามารถยกเลิกการจองได้" });
    }

    console.log(`✅ อัปเดตสถานะเป็น 'ยกเลิกการจอง' สำเร็จ! ID: ${requestId}`);
    res.json({ success: true, message: "ยกเลิกการจองสำเร็จ!" });

  } catch (err) {
    console.error("❌ ERROR:", err);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการยกเลิกการจอง" });
  }
});



// Endpoint: /getEquipmentInformation
app.get("/getEquipmentInformation", async (req, res) => {
  try {
    const [results] = await connection
      .promise()
      .query("SELECT * FROM equipment");
    console.log(
      "✅ ดึงข้อมูล equipment สำเร็จ:",
      results.length
    );
    res.json(results);
  } catch (err) {
    console.error("เกิดข้อผิดพลาดในการดึงข้อมูลอุปกรณ์:", err);
    res.status(500).json({ error: "ดึงข้อมูลอุปกรณ์ล้มเหลว" });
  }
});

app.get("/getBrokenEquipments", async (req, res) => {
  if (!req.session.user || !req.session.user.data) {
    return res.status(401).json({ error: "กรุณาเข้าสู่ระบบ" });
  }

  const { role, data } = req.session.user;
  let userId = null;
  let query = "";
  let values = [];

  if (role === "นิสิต") {
    userId = data.student_id;
    query = `
      SELECT 
        DATE_FORMAT(eb.Repair_date, '%Y-%m-%d %H:%i:%s') AS Repair_date, 
        ei.equipment_name, 
        eb.Damaged_details, 
        eb.room_id, 
        ai.full_name AS Admin_Name,
        eb.Repair_status
      FROM Equipments_list_brokened eb
      JOIN equipment ei ON eb.equipment_id = ei.equipment_id
      JOIN Admin_information ai ON eb.Admin_ID = ai.Admin_ID
      WHERE eb.student_id = ?  
      ORDER BY eb.Repair_date DESC;
    `;
    values = [userId];
  } else if (role === "อาจารย์") {
    userId = data.teacher_id;
    query = `
      SELECT 
        DATE_FORMAT(eb.Repair_date, '%Y-%m-%d %H:%i:%s') AS Repair_date, 
        ei.equipment_name, 
        eb.Damaged_details, 
        eb.room_id, 
        ai.full_name AS Admin_Name,
        eb.Repair_status
      FROM Equipments_list_brokened eb
      JOIN equipment ei ON eb.equipment_id = ei.equipment_id
      JOIN Admin_information ai ON eb.Admin_ID = ai.Admin_ID
      WHERE eb.teacher_id = ?  
      ORDER BY eb.Repair_date DESC;
    `;
    values = [userId];
  } else {
    return res.status(400).json({ error: "บทบาทไม่ถูกต้อง" });
  }

  try {
    const [results] = await connection.promise().query(query, values);
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
        "SELECT room_name, room_name FROM room WHERE room_id = ?",
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
    return res.status(400).json({ error: "❌ ต้องระบุ equipment_id" });
  }

  ids = ids.split(",").map((id) => id.trim()); // ✅ แปลงเป็น Array และลบช่องว่าง

  console.log("📌 ค่าที่รับจาก Frontend:", ids); // ✅ Debug ค่าที่ส่งมา

  try {
    // ✅ ใช้ `IN (?)` เพื่อค้นหาหลายอุปกรณ์
    const [results] = await connection
      .promise()
      .query(
        `SELECT equipment_id, equipment_name FROM equipment WHERE equipment_id IN (${ids
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
    start_time,
    end_time,
    request_reason,
    request_type,
  } = req.body;

  // ✅ ตรวจสอบเซสชัน
  if (!req.session.user || !req.session.user.data) {
    return res.status(401).json({ error: "กรุณาเข้าสู่ระบบ" });
  }

  const { role, data } = req.session.user;
  let userId = null;
  let identifyColumn = null;

  if (role === "นิสิต") {
    userId = data.student_id;
    identifyColumn = "student_id"; // ใช้ student_id สำหรับนิสิต
  } else if (role === "อาจารย์") {
    userId = data.teacher_id;
    identifyColumn = "teacher_id"; // ใช้ teacher_id สำหรับอาจารย์
  } else {
    return res.status(400).json({ error: "บทบาทไม่ถูกต้อง" });
  }

  if (!room_id || !used_date || !start_time || !end_time || !request_reason || !request_type) {
    return res.status(400).json({ error: "กรุณากรอกข้อมูลให้ครบถ้วน" });
  }

  try {
    // ✅ เพิ่มข้อมูลการจองห้อง
    const query = `
          INSERT INTO room_request 
          (room_id, used_date, ${identifyColumn}, start_time, end_time, request_reason, request_status, request_type) 
          VALUES (?, ?, ?, ?, ?, ?, 'รอดำเนินการ', ?);
      `;
    await connection
      .promise()
      .query(query, [
        room_id,
        used_date,
        userId,
        start_time,
        end_time,
        request_reason,
        request_type,
      ]);

    console.log(
      `✅ เพิ่มข้อมูลการจองห้องสำเร็จ: ห้อง ${room_id} โดย ${role} ID ${userId}`
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
    start_time,
    end_time,
    request_reason,
    request_type,
    members,
  } = req.body;

  // ✅ ตรวจสอบเซสชัน
  if (!req.session.user || !req.session.user.data) {
    return res.status(401).json({ error: "กรุณาเข้าสู่ระบบ" });
  }

  const { role, data } = req.session.user;
  let userId = null;
  let identifyColumn = null;

  if (role === "นิสิต") {
    userId = data.student_id;
    identifyColumn = "student_id"; // ใช้ student_id สำหรับนิสิต
  } else if (role === "อาจารย์") {
    userId = data.teacher_id;
    identifyColumn = "teacher_id"; // ใช้ teacher_id สำหรับอาจารย์
  } else {
    return res.status(400).json({ error: "บทบาทไม่ถูกต้อง" });
  }

  if (!room_id || !used_date || !start_time || !end_time || !request_reason || !request_type) {
    return res.status(400).json({ error: "กรุณากรอกข้อมูลให้ครบถ้วน" });
  }

  const connectionPromise = connection.promise();

  try {
    // ✅ เริ่ม Transaction
    await connectionPromise.beginTransaction();

    // ✅ เพิ่มข้อมูลการจองห้องนอกเวลา
    const insertBookingQuery = `
      INSERT INTO room_request 
      (room_id, used_date, ${identifyColumn}, start_time, end_time, request_reason, request_status, request_type) 
      VALUES (?, ?, ?, ?, ?, ?, 'รอดำเนินการ', ?);
    `;
    const [result] = await connectionPromise.query(insertBookingQuery, [
      room_id,
      used_date,
      userId,
      start_time,
      end_time,
      request_reason,
      request_type,
    ]);

    const bookingId = result.insertId; // ได้ `room_request_id` ที่เพิ่มใหม่

    // ✅ เพิ่มสมาชิกที่เข้าร่วมการจอง (ถ้ามี)
    if (members && members.length > 0) {
      const insertMembersQuery = `
        INSERT INTO Room_booking_members (room_request_id, ${identifyColumn}) 
        VALUES ?;
      `;

      const memberValues = members.map((member) => [bookingId, member]);

      await connectionPromise.query(insertMembersQuery, [memberValues]);
    }

    // ✅ Commit Transaction
    await connectionPromise.commit();

    console.log(
      `✅ เพิ่มข้อมูลการจองห้องนอกเวลาสำเร็จ: ห้อง ${room_id} โดย ${role} ID ${userId}`
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