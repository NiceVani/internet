// server.js
const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
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

// ===============================
// Middleware
// ===============================
app.use(express.json()); // รองรับ JSON request body
app.use(
  cors({
    origin: ["http://localhost:5501", "http://localhost:3000"], // เพิ่ม origin ที่ใช้
    credentials: true,
  })
);

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(
//   cors({
//     origin: "http://localhost:5501",
//     credentials: true,
//     allowedHeaders: ["Content-Type", "Authorization"],
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//   })
// );
// ===============================
// ตั้งค่า Session
// ===============================
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

// ===============================
// API ล็อกอิน
// ===============================
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const [users] = await connection
      .promise()
      .query("SELECT * FROM user WHERE username = ? AND password = ?", [
        username,
        password,
      ]);

    if (users.length === 0) {
      return res
        .status(401)
        .json({ error: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" });
    }

    const user = users[0];

    // ค้นหาในตาราง student
    const [studentResults] = await connection
      .promise()
      .query("SELECT * FROM student WHERE student_id = ?", [user.username]);

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
      .query("SELECT * FROM teacher WHERE teacher_id = ?", [user.username]);

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

// ===============================
// API เช็คเซสชัน
// ===============================
app.get("/session", (req, res) => {
  console.log("📌 ตรวจสอบเซสชันจาก API:", req.session);

  if (req.session.user) {
    const { role, data } = req.session.user;
    let userId = data.student_id || data.teacher_id || null;

    if (!userId) {
      return res.status(401).json({ error: "ไม่พบข้อมูลผู้ใช้" });
    }

    res.json({
      role: role,
      data: {
        user_id: userId,
        student_id: data.student_id || null,
        teacher_id: data.teacher_id || null,
        phone_number: data.phone_number,
        full_name: data.full_name,
        faculty: data.faculty,
        department: data.department,
        study_year: data.study_year || (role === "อาจารย์" ? "N/A" : null), // แก้ให้ถูกต้อง
      },
    });
  } else {
    return res.status(401).json({ error: "ไม่ได้ล็อกอิน" });
  }
});
// ===============================
// API ล็อกเอาต์ -> ล้าง Session
// ===============================
app.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({ success: true });
  });
});

// ===============================
// ดึงข้อมูลตารางเรียน
// ===============================
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

// ===============================
// ดึงรายการจองห้องทั้งหมด
// ===============================
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

// ===============================
// ดึงข้อมูลคอมพิวเตอร์
// ===============================
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

// ===============================
// ดึง ID ของอุปกรณ์จากชื่อ (getEquipmentId)
// ===============================
app.get("/getEquipmentId", (req, res) => {
  const { name } = req.query;
  if (!name) {
    return res.status(400).json({ error: "Missing 'name' in request query" });
  }
  console.log("📌 Searching for equipment:", name);

  connection.query(
    "SELECT equipment_id FROM equipment WHERE equipment_name = ? LIMIT 1",
    [name],
    (error, results) => {
      if (error) {
        console.error("❌ Error fetching equipment:", error);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      if (results.length > 0) {
        res.json({ equipment_id: results[0].equipment_id });
      } else {
        res.status(404).json({ error: "ไม่พบอุปกรณ์" });
      }
    }
  );
});

// ===============================
// ตัวอย่างทดสอบ HEX (testEquipment)
// ===============================
app.get("/testEquipment", async (req, res) => {
  let { name } = req.query;
  name = name.trim();

  try {
    const [rows] = await connection.query(
      "SELECT HEX(equipment_name) FROM equipment WHERE BINARY equipment_name = ?",
      [name]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "ไม่พบอุปกรณ์", nameSent: name });
    }
    res.json({ hexValue: rows[0] });
  } catch (error) {
    console.error("Error fetching equipment:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// 📌 Endpoint: /getEquipments?room=?
app.get("/getEquipments", async (req, res) => {
  try {
    const room = req.query.room;
    if (!room) {
      return res.status(400).json({ error: "Missing room parameter" });
    }
    const [results] = await connection.promise().query(
      `SELECT m.equipment_id, m.stock_quantity, e.equipment_name
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

// ===============================
// roomdetail (รวมฟิลด์ room_name)
// ===============================
app.get("/roomdetail", (req, res) => {
  const query = `
    SELECT
      rli.room_name AS full_name,
      rli.floor,
      rli.room_id,
      rli.room_name,
      rt.type_name AS room_type, --
      SUM(CASE WHEN rlr.request_status = 'อนุมัติ' THEN 1 ELSE 0 END) AS Approved_Count
    FROM room rli
    LEFT JOIN room_request rlr ON rli.room_id = rlr.room_id
    LEFT JOIN room_type rt ON rli.room_type_id = rt.room_type_id -- 
    GROUP BY rli.room_id, rli.room_name, rli.floor, rli.room_name
    ORDER BY Approved_Count DESC;
  `;

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

// ===============================
// ดึงข้อมูล student
// ===============================
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

// ===============================
// ดึงข้อมูล teacher
// ===============================
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

// ===============================
// ดึงข้อมูล user (นิสิต + อาจารย์)
// ===============================
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

    // ดึงข้อมูลอาจารย์
    const teacherQuery = `
      SELECT 
        ti.full_name, 
        ti.teacher_id AS user_id, 
        ti.department, 
        ti.phone_number, 
        ti.faculty, 
        NULL AS study_year,
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

      // รวมข้อมูล นิสิต + อาจารย์
      const allUsers = [...studentResults, ...teacherResults];
      res.json(allUsers);
    });
  });
});

// ===============================
// ดึงข้อมูลอาจารย์ทั้งหมด
// ===============================
app.get("/userTeacher", async (req, res) => {
  try {
    const [results] = await connection.promise().query("SELECT * FROM teacher");
    console.log("✅ ดึงข้อมูลอาจารย์สำเร็จ:", results.length);
    res.json(results);
  } catch (err) {
    console.error("❌ เกิดข้อผิดพลาด:", err);
    res.status(500).json({ error: "ดึงข้อมูลล้มเหลว" });
  }
});

// ===============================
// ดึงข้อมูลบัญชี user ทั้งหมด
// ===============================
app.get("/userAccount", async (req, res) => {
  try {
    const [results] = await connection.promise().query("SELECT * FROM user;");
    console.log("✅ ดึงข้อมูลบัญชีผู้ใช้สำเร็จ:", results.length);
    res.json(results);
  } catch (err) {
    console.error("❌ เกิดข้อผิดพลาด:", err);
    res.status(500).json({ error: "ดึงข้อมูลล้มเหลว" });
  }
});

// ===============================
// ดึงข้อมูลการจองของผู้ใช้แต่ละคน (นิสิต/อาจารย์)
// ===============================
app.get("/userBookings/:userId", async (req, res) => {
  const { userId } = req.params;
  console.log("🎯 userId ที่รับมา:", userId);

  try {
    await connection.promise().query("SET time_zone = '+07:00'");

    // ตรวจสอบ role ของ user
    const [userResults] = await connection
      .promise()
      .query("SELECT role FROM user WHERE username = ?", [userId]);

    if (userResults.length === 0) {
      return res.status(404).json({ error: "ไม่พบผู้ใช้ในระบบ" });
    }

    const userRole = userResults[0].role;
    console.log(`👤 ผู้ใช้ ${userId} มีบทบาทเป็น: ${userRole}`);

    let query = "";
    let values = [];

    if (userRole === "นิสิต") {
      query = `
        SELECT 
          rlr.room_request_id, 
          rlr.room_id, 
          rli.room_name,  
          CONVERT_TZ(rlr.submitted_time, '+00:00', '+07:00') AS Submitted_date, 
          CONVERT_TZ(rlr.used_date, '+00:00', '+07:00') AS Used_date, 
          rlr.start_time, 
          rlr.end_time, 
          rlr.request_status, 
          rlr.request_type,
          rlr.reject_reason,
          rlr.detail_reject_reason,
          ad.full_name AS admin_name,
          ex.full_name AS executive_name

        FROM room_request rlr
        JOIN room rli ON rlr.room_id = rli.room_id
        JOIN room_type rt ON rt.room_type_id = rli.room_type_id
        JOIN student s ON rlr.student_id = s.student_id
        LEFT JOIN admin ad ON rlr.admin_id = ad.admin_id
        LEFT JOIN executive ex ON rlr.executive_id = ex.executive_id
        WHERE s.student_id = ?
      `;
      values = [userId];
    } else if (userRole === "อาจารย์") {
      query = `
        SELECT 
          rlr.room_request_id, 
          rlr.room_id, 
          rli.room_name, 
          CONVERT_TZ(rlr.submitted_time, '+00:00', '+07:00') AS Submitted_date, 
          CONVERT_TZ(rlr.used_date, '+00:00', '+07:00') AS Used_date, 
          rlr.start_time, 
          rlr.end_time, 
          rlr.request_status, 
          rlr.request_type,
          rlr.reject_reason,
          rlr.detail_reject_reason,
          ad.full_name AS admin_name,
          ex.full_name AS executive_name

        FROM room_request rlr
        JOIN room rli ON rlr.room_id = rli.room_id
        JOIN room_type rt ON rt.room_type_id = rli.room_type_id
        JOIN teacher t ON rlr.teacher_id = t.teacher_id
        LEFT JOIN admin ad ON rlr.admin_id = ad.admin_id
        LEFT JOIN executive ex ON rlr.executive_id = ex.executive_id
        WHERE t.teacher_id = ?
      `;
      values = [userId];
    } else {
      return res.status(400).json({ error: "บทบาทไม่ถูกต้อง" });
    }

    const [results] = await connection.promise().query(query, values);
    console.log(`✅ ดึงข้อมูลการจองของ ${userId} สำเร็จ:`, results);

    res.json(results);
  } catch (err) {
    console.error("❌ เกิดข้อผิดพลาด:", err);
    res.status(500).json({ error: "ดึงข้อมูลล้มเหลว" });
  }
});

// ===============================
// ยกเลิกการจอง
// ===============================
app.delete("/cancelBooking/:requestId", async (req, res) => {
  const { requestId } = req.params;
  console.log(`🛑 กำลังยกเลิกการจอง ID: ${requestId}`);

  try {
    if (!requestId) {
      console.log("❌ requestId ไม่ถูกต้อง");
      return res.status(400).json({ error: "requestId ไม่ถูกต้อง" });
    }

    // เช็คว่ามีการจองตาม requestId จริงหรือไม่
    const [checkResult] = await connection
      .promise()
      .query("SELECT * FROM room_request WHERE room_request_id = ?", [
        requestId,
      ]);
    console.log("🔍 ข้อมูลที่ค้นหา:", checkResult);

    if (checkResult.length === 0) {
      console.log("❌ ไม่พบข้อมูลการจองที่สามารถยกเลิกได้");
      return res.status(404).json({ error: "ไม่พบการจองนี้ในระบบ" });
    }

    // อัปเดตสถานะเป็น "ยกเลิกการจอง"
    const [updateResult] = await connection.promise().query(
      `
      UPDATE room_request
      SET request_status = 'ยกเลิกการจอง'
      WHERE room_request_id = ?
    `,
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

// ===============================
// ดึงข้อมูล Equipment ทั้งหมด
// ===============================
app.get("/getEquipmentInformation", async (req, res) => {
  try {
    const [results] = await connection
      .promise()
      .query("SELECT * FROM equipment");
    console.log("✅ ดึงข้อมูล equipment สำเร็จ:", results.length);
    res.json(results);
  } catch (err) {
    console.error("เกิดข้อผิดพลาดในการดึงข้อมูลอุปกรณ์:", err);
    res.status(500).json({ error: "ดึงข้อมูลอุปกรณ์ล้มเหลว" });
  }
});

// ===============================
// ดึงข้อมูลอุปกรณ์ที่เสีย (ของผู้ใช้แต่ละคน)
// ===============================
app.get("/getBrokenEquipments", async (req, res) => {
  console.log("🔍 DEBUG: ตรวจสอบเซสชัน", req.session);

  if (!req.session.user || !req.session.user.data) {
    return res.status(401).json({ error: "กรุณาเข้าสู่ระบบ" });
  }

  const { role, data } = req.session.user;
  let userId = null;
  let query = "";
  let values = [];

  if (role === "นิสิต") {
    userId = data.student_id;
    console.log("🎯 ดึงข้อมูลแจ้งซ่อมของนิสิต student_id:", userId);

    query = `
          SELECT 
              DATE_FORMAT(eb.repair_date, '%Y-%m-%d %H:%i:%s') AS repair_date, 
              ei.equipment_name, 
              eb.damage_details, 
              eb.room_id, 
              CASE 
                  WHEN eb.admin_id IS NULL THEN 'รอผู้รับแจ้งซ่อม' 
                  ELSE ai.full_name 
              END AS Admin_Name, 
              eb.repair_status,
              eb.image_path,
              eb.repair_number,
              damage
          FROM equipment_brokened eb
          LEFT JOIN equipment ei ON eb.equipment_id = ei.equipment_id
          LEFT JOIN admin ai ON eb.admin_id = ai.admin_id
          WHERE eb.student_id = ?
          ORDER BY eb.repair_date DESC;
      `;
    values = [userId];
  } else if (role === "อาจารย์") {
    userId = data.teacher_id;
    console.log("🎯 ดึงข้อมูลแจ้งซ่อมของอาจารย์ teacher_id:", userId);

    query = `
          SELECT 
              DATE_FORMAT(eb.repair_date, '%Y-%m-%d %H:%i:%s') AS repair_date, 
              ei.equipment_name, 
              eb.damage_details, 
              eb.room_id, 
              CASE 
                  WHEN eb.admin_id IS NULL THEN 'รอผู้รับแจ้งซ่อม' 
                  ELSE ai.full_name 
              END AS Admin_Name, 
              eb.repair_status
              eb.image_path,
              eb.repair_number,
              damage
          FROM equipment_brokened eb
          LEFT JOIN equipment ei ON eb.equipment_id = ei.equipment_id
          LEFT JOIN admin ai ON eb.admin_id = ai.admin_id
          WHERE eb.teacher_id = ?
          ORDER BY eb.repair_date DESC;
      `;
    values = [userId];
  } else {
    return res.status(400).json({ error: "บทบาทไม่ถูกต้อง" });
  }

  try {
    console.log("🚀 รัน SQL Query:", query);
    console.log("📌 ค่าที่ใช้ใน Query:", values);

    const [results] = await connection.promise().query(query, values);
    console.log("✅ ข้อมูลที่ดึงจากฐานข้อมูล:", results);

    res.json(results);
  } catch (err) {
    console.error("❌ เกิดข้อผิดพลาดในการดึงข้อมูล:", err);
    res.status(500).json({ error: "ดึงข้อมูลล้มเหลว" });
  }
});

// ===============================
// ดึง room_id จาก room_name
// ===============================
app.get("/getRoomId", async (req, res) => {
  const { name } = req.query;
  try {
    console.log(`📌 กำลังค้นหา room_id สำหรับห้อง: '${name}'`);

    if (!name) {
      console.error("❌ ไม่ได้รับค่าห้อง (name)");
      return res.status(400).json({ error: "Missing 'name' in request query" });
    }

    const [rows] = await connection
      .promise()
      .execute("SELECT room_id FROM room WHERE room_name = ?", [name]);

    console.log("🔹 ผลลัพธ์จากฐานข้อมูล:", rows);
    if (rows.length > 0) {
      console.log(`✅ พบ room_id: ${rows[0].room_id}`);
      res.json({ room_id: rows[0].room_id });
    } else {
      console.warn(`⚠️ ไม่พบห้อง '${name}' ในฐานข้อมูล`);
      res.status(404).json({ error: "Room not found" });
    }
  } catch (error) {
    console.error("❌ Error fetching room ID:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
});

// ===============================
// ดึงข้อมูลอุปกรณ์หลายชิ้นผ่าน IDs
// ===============================
app.get("/getEquipmentsByIds", async (req, res) => {
  let ids = req.query.ids;

  if (!ids) {
    return res.status(400).json({ error: "❌ ต้องระบุ equipment_id" });
  }

  ids = ids.split(",").map((id) => id.trim()); // แปลงเป็น Array และลบช่องว่าง

  console.log("📌 ค่าที่รับจาก Frontend:", ids);

  try {
    const [results] = await connection.promise().query(
      `SELECT equipment_id, equipment_name 
         FROM equipment 
         WHERE equipment_id IN (${ids.map(() => "?").join(",")})`,
      ids
    );

    console.log("📌 ผลลัพธ์จาก Database:", results);
    if (results.length === 0) {
      return res.status(404).json({ error: "❌ ไม่พบข้อมูลอุปกรณ์" });
    }
    res.json(results);
  } catch (err) {
    console.error("❌ เกิดข้อผิดพลาด:", err);
    res.status(500).json({ error: "ดึงข้อมูลล้มเหลว" });
  }
});

// ===============================
// WebSocket สำหรับการอัปเดตเรียลไทม์
// ===============================
io.on("connection", (socket) => {
  console.log("A user connected via WebSocket");
  socket.on("triggerBookingUpdate", () => {
    io.emit("booking_update", { message: "ข้อมูลการจองได้รับการอัปเดต" });
  });
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// ===============================
// จองห้อง (ในเวลาปกติ) ไม่น่าได้ใช้แล้ว
// ===============================
app.post("/bookRoom", async (req, res) => {
  const {
    room_id,
    used_date,
    start_time,
    end_time,
    request_reason,
    request_type,
  } = req.body;

  if (!req.session.user || !req.session.user.data) {
    return res.status(401).json({ error: "กรุณาเข้าสู่ระบบ" });
  }

  const { role, data } = req.session.user;
  let userId = null;
  let identifyColumn = null;

  if (role === "นิสิต") {
    userId = data.student_id;
    identifyColumn = "student_id";
  } else if (role === "อาจารย์") {
    userId = data.teacher_id;
    identifyColumn = "teacher_id";
  } else {
    return res.status(400).json({ error: "บทบาทไม่ถูกต้อง" });
  }

  if (
    !room_id ||
    !used_date ||
    !start_time ||
    !end_time ||
    !request_reason ||
    !request_type
  ) {
    return res.status(400).json({ error: "กรุณากรอกข้อมูลให้ครบถ้วน" });
  }

  try {
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

// ===============================
// จองห้อง (นอกเวลา) + สมาชิก ไม่น่าได้ใช้แล้ว
// ===============================
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

  if (!req.session.user || !req.session.user.data) {
    return res.status(401).json({ error: "กรุณาเข้าสู่ระบบ" });
  }

  const { role, data } = req.session.user;
  let userId = null;
  let identifyColumn = null;

  if (role === "นิสิต") {
    userId = data.student_id;
    identifyColumn = "student_id";
  } else if (role === "อาจารย์") {
    userId = data.teacher_id;
    identifyColumn = "teacher_id";
  } else {
    return res.status(400).json({ error: "บทบาทไม่ถูกต้อง" });
  }

  if (
    !room_id ||
    !used_date ||
    !start_time ||
    !end_time ||
    !request_reason ||
    !request_type
  ) {
    return res.status(400).json({ error: "กรุณากรอกข้อมูลให้ครบถ้วน" });
  }

  const connectionPromise = connection.promise();

  try {
    await connectionPromise.beginTransaction();

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

    const bookingId = result.insertId; // room_request_id ใหม่

    // เพิ่มสมาชิกที่ร่วมจอง (ถ้ามี)
    if (members && members.length > 0) {
      const insertMembersQuery = `
        INSERT INTO Room_booking_members (room_request_id, ${identifyColumn})
        VALUES ?;
      `;
      const memberValues = members.map((member) => [bookingId, member]);
      await connectionPromise.query(insertMembersQuery, [memberValues]);
    }

    await connectionPromise.commit();
    console.log(
      `✅ เพิ่มข้อมูลการจองห้องนอกเวลาสำเร็จ: ห้อง ${room_id} โดย ${role} ID ${userId}`
    );
    res.json({ success: true, message: "จองห้องสำเร็จ" });

    io.emit("booking_update", { message: "มีการจองห้องนอกเวลาใหม่" });
  } catch (err) {
    await connectionPromise.rollback();
    console.error("❌ เกิดข้อผิดพลาดในการเพิ่มข้อมูล:", err);
    res.status(500).json({ error: "บันทึกข้อมูลล้มเหลว" });
  }
});

// ===============================
// getLatestRepairNumber
// ===============================
app.get("/getLatestRepairNumber", async (req, res) => {
  try {
    // สมมติไม่ต้องมีเงื่อนไขใด ๆ
    const sql = "SELECT repair_number FROM equipment_brokened";
    const [rows] = await connection.promise().query(sql);

    if (rows.length === 0) {
      return res.json({ latest_number: 0 });
    } else {
      let maxNum = 0;
      rows.forEach((row) => {
        const parts = row.repair_number.split("-");
        const lastString = parts[parts.length - 1];
        const num = parseInt(lastString, 10);
        if (!isNaN(num) && num > maxNum) {
          maxNum = num;
        }
      });
      return res.json({ latest_number: maxNum });
    }
  } catch (error) {
    console.error("❌ Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// ===============================
// ดึงข้อมูลห้องทั้งหมด (room_name, room_status)
// ===============================
app.get("/rooms", async (req, res) => {
  try {
    const [results] = await connection
      .promise()
      .query("SELECT room_id, room_name, room_status FROM room");
    res.json(results);
  } catch (err) {
    console.error("❌ เกิดข้อผิดพลาดในการดึงข้อมูลห้อง:", err);
    res.status(500).json({ error: "ไม่สามารถดึงข้อมูลห้องได้" });
  }
});

// ===============================
// จัดการอัปโหลดรูป (multer) + API
// ===============================

// โฟลเดอร์เก็บไฟล์อัปโหลด
const uploadDir = path.join(__dirname, "../storage/equipment_img");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const userId = req.body.sessionUserId; // 65312994
    const nextNum = req.body.nextNumber; // 1
    const ext = path.extname(file.originalname).toLowerCase();

    if (!userId || !nextNum) {
      return cb(null, "equip_" + Date.now() + ext);
    }

    // สร้างชื่อไฟล์ => "65312994_1.jpg"
    const finalName = `${userId}_${nextNum}${ext}`;
    cb(null, finalName);
  },
});

// ตรวจสอบว่าเป็นไฟล์รูปภาพหรือไม่
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extName = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimeType = allowedTypes.test(file.mimetype);

  if (extName && mimeType) {
    return cb(null, true);
  } else {
    return cb(
      new Error("❌ อัปโหลดได้เฉพาะไฟล์รูปภาพเท่านั้น (jpeg, jpg, png, gif)")
    );
  }
};

// ตั้งค่า Multer Middleware
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // จำกัดขนาดไฟล์ 5MB
});

////// ✅ Route สำหรับดึงรูปภาพ  ///////
app.get("/image/:filename", (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, "../storage/equipment_img", filename);

  if (fs.existsSync(filePath)) {
    res.setHeader("Content-Type", "image/jpeg");
    res.sendFile(filePath);
  } else {
    res.status(404).json({ error: "File not found" });
  }
});

// API อัปโหลดไฟล์รูป
app.post("/uploadReportImage", upload.single("image"), (req, res) => {
  try {
    console.log("📌 ตรวจสอบไฟล์ที่ได้รับ:", req.file);
    console.log("📌 ค่า req.body:", req.body);

    if (!req.file) {
      console.log("❌ ไม่พบไฟล์ที่อัปโหลด");
      return res
        .status(400)
        .json({ error: "❌ กรุณาเลือกไฟล์ที่ต้องการอัปโหลด" });
    }

    console.log("✅ ไฟล์ที่อัปโหลดสำเร็จ:", req.file.filename);
    res.json({
      message: "✅ อัปโหลดไฟล์สำเร็จ",
      filePath: `/storage/equipment_img/${req.file.filename}`,
    });
  } catch (err) {
    console.error("❌ เกิดข้อผิดพลาดในการอัปโหลด:", err);
    res.status(500).json({ error: "❌ เกิดข้อผิดพลาดในการอัปโหลด" });
  }
});

// ให้ Express ให้บริการไฟล์รูปจากโฟลเดอร์ storage/equipment_img
app.use("/storage/equipment_img", express.static(uploadDir));

// ===============================
// บันทึกการรายงานปัญหา (reportIssue)
// ===============================
app.post("/reportIssue", async (req, res) => {
  try {
    let {
      repair_number,
      repair_date,
      student_id,
      teacher_id,
      room_id,
      equipment_id,
      computer_id, // เพิ่มการรับ computer_id
      damage,
      damage_details,
      repair_status,
      image_path,
    } = req.body;

    console.log("📌 Debug: ค่า request ที่รับมา:", req.body);

    if (
      !repair_number ||
      !room_id ||
      !equipment_id ||
      (!student_id && !teacher_id)
    ) {
      console.error("❌ ข้อมูลที่ส่งมาไม่ครบ!");
      return res
        .status(400)
        .json({ error: "ข้อมูลไม่ครบ กรุณากรอกข้อมูลให้ครบถ้วน" });
    }

    let repairDate = new Date(repair_date);
    repairDate.setHours(repairDate.getHours() + 14);
    let repair_date_formatted = repairDate
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");

    let lastNumber = repair_number.split("-").pop();
    let new_image_filename = `${student_id || teacher_id}_${lastNumber}.jpg`;

    console.log("✅ ค่าที่จะบันทึกลง DB:", {
      repair_number,
      repair_date_formatted,
      student_id,
      teacher_id,
      room_id,
      equipment_id,
      computer_id, // ข้อมูล computer_id
      new_image_filename,
    });

    const sql = `
      INSERT INTO equipment_brokened (
        repair_number, repair_date, student_id, teacher_id, room_id, equipment_id, computer_id, admin_id, damage, damage_details, image_path, repair_status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      repair_number,
      repair_date_formatted,
      student_id || null,
      teacher_id || null,
      room_id,
      equipment_id,
      computer_id || null, // ใส่ computer_id ในคำสั่ง SQL
      null,
      damage,
      damage_details || null,
      new_image_filename,
      repair_status || "รอซ่อม",
    ];

    await connection.promise().query(sql, values);
    console.log("✅ Insert สำเร็จ:", repair_number);

    res.json({
      message: "✅ รายงานปัญหาสำเร็จ!",
      image_path: new_image_filename,
    });
  } catch (err) {
    console.error("❌ เกิดข้อผิดพลาดใน /reportIssue:", err);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการบันทึกข้อมูล" });
  }
});

app.get("/getComputersByRoom", async (req, res) => {
  const { room_id } = req.query;

  if (!room_id) {
    return res.status(400).json({ error: "กรุณาระบุ room_id" });
  }

  try {
    const [results] = await connection
      .promise()
      .query("SELECT computer_id FROM computer_management WHERE room_id = ?", [
        room_id,
      ]);

    if (results.length === 0) {
      return res.json({ computers: [] }); // ถ้าไม่มีคอมพิวเตอร์ในห้องนี้
    }

    res.json({ computers: results });
  } catch (err) {
    console.error("❌ เกิดข้อผิดพลาดในการดึงข้อมูลคอมพิวเตอร์:", err);
    res.status(500).json({ error: "ดึงข้อมูลล้มเหลว" });
  }
});
//////////////////////////////////////////////////////////////////-TimeIn,TimeInTeacher,TimeOut
// API นี้จะทำการบันทึกข้อมูลลงฐานข้อมูล หน้า TimeIn,TimeOut นิสิต อาจารย์
app.post("/submitBookingA", async (req, res) => {
  if (!req.session.user || !req.session.user.data) {
    return res.status(401).json({ error: "กรุณาเข้าสู่ระบบ" });
  }

  const { role, data } = req.session.user;
  let userId = role === "นิสิต" ? data.student_id : data.teacher_id;

  if (!userId) {
    return res.status(400).json({ error: "ไม่พบรหัสผู้ใช้" });
  }

  const {
    room_id,
    used_date,
    start_time,
    end_time,
    request_type,
    request_reason,
    detail_request_reason,
    desks,
    equipments,
  } = req.body;

  if (
    !room_id ||
    !used_date ||
    !start_time ||
    !end_time ||
    !request_type ||
    !request_reason
  ) {
    return res.status(400).json({ error: "กรุณากรอกข้อมูลให้ครบถ้วน" });
  }

  const connectionPromise = connection.promise();

  try {
    // ✅ เริ่ม Transaction
    await connectionPromise.beginTransaction();

    // ✅ ค้นหา room_request_id ล่าสุด และเพิ่มค่าใหม่
    const [lastRequest] = await connectionPromise.query(
      "SELECT MAX(room_request_id) AS last_id FROM room_request"
    );
    const newRequestId = (lastRequest[0].last_id || 0) + 1;

    // ✅ เวลาที่กดยืนยัน (บวก 7 ชั่วโมงเป็น GMT+7)
    const submitted_time = new Date();
    submitted_time.setHours(submitted_time.getHours() + 7);
    const formattedSubmittedTime = submitted_time
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");

    const requestStatus = "รอดำเนินการ";

    console.log("📌 ข้อมูลที่กำลังจะบันทึก:", {
      room_request_id: newRequestId,
      submitted_time: formattedSubmittedTime,
      room_id,
      student_id: role === "นิสิต" ? userId : null,
      teacher_id: role === "อาจารย์" ? userId : null,
      used_date,
      start_time,
      end_time,
      request_type,
      request_reason,
      detail_request_reason,
      desks,
      equipments,
      request_status: requestStatus,
    });

    // ✅ เพิ่มข้อมูลลงตาราง room_request
    await connectionPromise.query(
      `INSERT INTO room_request 
          (room_request_id, submitted_time, room_id, student_id, teacher_id, used_date, 
          start_time, end_time, request_type, request_reason, detail_request_reason, 
          reject_reason, detail_reject_reason, request_status) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL, NULL, ?)`,
      [
        newRequestId,
        formattedSubmittedTime,
        room_id,
        role === "นิสิต" ? userId : null,
        role === "อาจารย์" ? userId : null,
        used_date,
        start_time,
        end_time,
        request_type,
        request_reason,
        detail_request_reason,
        requestStatus,
      ]
    );

    // ✅ เพิ่มข้อมูลลงตาราง room_request_participant
    const [lastParticipant] = await connectionPromise.query(
      "SELECT MAX(room_request_participant_id) AS last_id FROM room_request_participant"
    );
    const newParticipantId = (lastParticipant[0].last_id || 0) + 1;

    await connectionPromise.query(
      `INSERT INTO room_request_participant 
          (room_request_participant_id, room_request_id, student_id, teacher_id, role) 
          VALUES (?, ?, ?, ?, ?)`,
      [
        newParticipantId,
        newRequestId,
        role === "นิสิต" ? userId : null,
        role === "อาจารย์" ? userId : null,
        "ผู้ขอใช้",
      ]
    );

    console.log(
      `✅ เพิ่มข้อมูลลง room_request_participant สำเร็จ ID: ${newParticipantId}`
    );

    // ✅ บันทึกโต๊ะคอมพิวเตอร์ที่เลือก (ถ้ามี)
    if (desks && desks.length > 0) {
      console.log(`🖥️ กำลังเพิ่มโต๊ะคอมพิวเตอร์: ${desks.join(", ")}`);

      const deskArray = Array.isArray(desks)
        ? desks
        : desks.split(",").map(Number);
      const deskValues = deskArray.map((computer_id) => [
        newRequestId,
        computer_id,
        room_id,
      ]);

      await connectionPromise.query(
        `INSERT INTO room_request_computer (room_request_id, computer_id, room_id) VALUES ?`,
        [deskValues]
      );

      console.log(`✅ บันทึกโต๊ะคอมสำเร็จ: ${deskArray.join(", ")}`);
    }

    // ✅ บันทึกอุปกรณ์ที่เลือก (ถ้ามี)
    if (equipments && equipments.length > 0) {
      console.log(`🛠️ กำลังเพิ่มอุปกรณ์: ${equipments}`);

      const equipmentArray = equipments.split(",").map((item) => {
        const [equipment_id, quantity] = item.split(":").map(Number);
        return [newRequestId, equipment_id, quantity, room_id];
      });

      await connectionPromise.query(
        `INSERT INTO room_request_equipment (room_request_id, equipment_id, request_quantity, room_id) VALUES ?`,
        [equipmentArray]
      );

      console.log(`✅ บันทึกอุปกรณ์สำเร็จ: ${equipments}`);
    }

    // ✅ ถ้าทุกอย่างสำเร็จ ให้ Commit Transaction
    await connectionPromise.commit();
    console.log(`✅ บันทึกข้อมูลจองสำเร็จ ID: ${newRequestId}`);
    res.json({ success: true, message: "จองห้องสำเร็จ!" });
  } catch (err) {
    // ❌ ถ้ามีข้อผิดพลาด Rollback Transaction
    await connectionPromise.rollback();
    console.error("❌ เกิดข้อผิดพลาดในการบันทึกข้อมูล:", err);
    res.status(500).json({ error: "บันทึกข้อมูลล้มเหลว" });
  }
});

//////////////////////////////////////////////////////////////////

// API นี้จะทำการบันทึกข้อมูลลงฐานข้อมูล หน้า TimeIn,TimeOut นิสิต อาจารย์
app.post("/submitBooking", async (req, res) => {
  if (!req.session.user || !req.session.user.data) {
    return res.status(401).json({ error: "กรุณาเข้าสู่ระบบ" });
  }

  const { role, data } = req.session.user;
  let userId = role === "นิสิต" ? data.student_id : data.teacher_id;

  if (!userId) {
    return res.status(400).json({ error: "ไม่พบรหัสผู้ใช้" });
  }

  const {
    room_id,
    used_date,
    start_time,
    end_time,
    request_type,
    request_reason,
    detail_request_reason,
    desks,
    equipments,
    members,
  } = req.body; // ✅ เพิ่ม members มาด้วย

  if (!room_id || !used_date || !start_time || !end_time) {
    return res.status(400).json({ error: "กรุณากรอกข้อมูลให้ครบถ้วน" });
  }

  // ✅ ป้องกัน `request_type` และ `request_reason` เป็น `undefined`
  const requestType = request_type || "ไม่ระบุ";
  const requestReason = request_reason || "ไม่ระบุ";

  const connectionPromise = connection.promise();

  try {
    // ✅ เริ่ม Transaction
    await connectionPromise.beginTransaction();

    // ✅ ค้นหา room_request_id ล่าสุด และเพิ่มค่าใหม่
    const [lastRequest] = await connectionPromise.query(
      "SELECT MAX(room_request_id) AS last_id FROM room_request"
    );
    const newRequestId = (lastRequest[0].last_id || 0) + 1;

    // ✅ เวลาที่กดยืนยัน (บวก 7 ชั่วโมงเป็น GMT+7)
    const submitted_time = new Date();
    submitted_time.setHours(submitted_time.getHours() + 7);
    const formattedSubmittedTime = submitted_time
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");

    const requestStatus = "รอดำเนินการ";

    console.log("📌 ข้อมูลที่กำลังจะบันทึก:", {
      room_request_id: newRequestId,
      members, // ✅ Debug ดูค่าของ members
    });

    // ✅ เพิ่มข้อมูลลงตาราง room_request
    await connectionPromise.query(
      `INSERT INTO room_request 
          (room_request_id, submitted_time, room_id, student_id, teacher_id, used_date, 
          start_time, end_time, request_type, request_reason, detail_request_reason, 
          reject_reason, detail_reject_reason, request_status) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL, NULL, ?)`,
      [
        newRequestId,
        formattedSubmittedTime,
        room_id,
        role === "นิสิต" ? userId : null,
        role === "อาจารย์" ? userId : null,
        used_date,
        start_time,
        end_time,
        request_type,
        request_reason,
        detail_request_reason,
        requestStatus,
      ]
    );

    // ✅ เพิ่มข้อมูลลงตาราง room_request_participant สำหรับผู้ขอใช้
    const [lastParticipant] = await connectionPromise.query(
      "SELECT MAX(room_request_participant_id) AS last_id FROM room_request_participant"
    );
    let newParticipantId = (lastParticipant[0].last_id || 0) + 1;

    await connectionPromise.query(
      `INSERT INTO room_request_participant 
          (room_request_participant_id, room_request_id, student_id, teacher_id, role) 
          VALUES (?, ?, ?, ?, ?)`,
      [
        newParticipantId,
        newRequestId,
        role === "นิสิต" ? userId : null,
        role === "อาจารย์" ? userId : null,
        "ผู้ขอใช้",
      ]
    );

    console.log(
      `✅ เพิ่มข้อมูลผู้ขอใช้ลง room_request_participant สำเร็จ ID: ${newParticipantId}`
    );

    // ✅ เพิ่มสมาชิกที่เข้าร่วม (ถ้ามี)
    if (Array.isArray(members) && members.length > 0) {
      console.log(`👥 กำลังเพิ่มสมาชิก ${members.length} คน`);

      // ✅ ตรวจสอบค่าของ `members` ให้แน่ใจว่าเป็น Array ของรหัสนิสิตจริงๆ
      const validMembers = members.filter(
        (member) => typeof member === "string" && member.trim() !== ""
      );

      if (validMembers.length > 0) {
        const memberValues = validMembers.map((memberId) => {
          newParticipantId++;
          return [
            newParticipantId,
            newRequestId,
            memberId,
            null,
            "ผู้เข้าร่วม",
          ];
        });

        await connectionPromise.query(
          `INSERT INTO room_request_participant 
                  (room_request_participant_id, room_request_id, student_id, teacher_id, role) 
                  VALUES ?`,
          [memberValues]
        );

        console.log(`✅ บันทึกสมาชิกสำเร็จ: ${validMembers.join(", ")}`);
      }
    }
    // ✅ บันทึกโต๊ะคอมพิวเตอร์ที่เลือก (ถ้ามี)
    // ✅ บันทึกโต๊ะคอมพิวเตอร์ที่เลือก (ถ้ามี)
    if (Array.isArray(desks) && desks.length > 0) {
      console.log(`🖥️ กำลังเพิ่มโต๊ะคอมพิวเตอร์: ${desks.join(", ")}`);

      const deskValues = desks.map((computer_id) => [
        newRequestId,
        computer_id,
        room_id,
      ]);

      await connectionPromise.query(
        `INSERT INTO room_request_computer (room_request_id, computer_id, room_id) VALUES ?`,
        [deskValues]
      );

      console.log(`✅ บันทึกโต๊ะคอมสำเร็จ: ${desks.join(", ")}`);
    } else {
      console.log("⚠️ ไม่มีโต๊ะคอมพิวเตอร์ที่เลือก");
    }

    // ✅ บันทึกอุปกรณ์ที่เลือก (ถ้ามี)
    if (typeof equipments === "string" && equipments.trim() !== "") {
      console.log(`🛠️ กำลังเพิ่มอุปกรณ์: ${equipments}`);

      const equipmentArray = equipments.split(",").map((item) => {
        const [equipment_id, quantity] = item.split(":").map(Number);
        return [newRequestId, equipment_id, quantity, room_id];
      });

      if (equipmentArray.length > 0) {
        await connectionPromise.query(
          `INSERT INTO room_request_equipment (room_request_id, equipment_id, request_quantity, room_id) VALUES ?`,
          [equipmentArray]
        );

        console.log(`✅ บันทึกอุปกรณ์สำเร็จ: ${equipments}`);
      } else {
        console.log("⚠️ ไม่มีอุปกรณ์ที่เลือก");
      }
    }

    // ✅ ถ้าทุกอย่างสำเร็จ ให้ Commit Transaction
    await connectionPromise.commit();
    console.log(`✅ บันทึกข้อมูลจองสำเร็จ ID: ${newRequestId}`);
    res.json({ success: true, message: "จองห้องสำเร็จ!" });
  } catch (err) {
    // ❌ ถ้ามีข้อผิดพลาด Rollback Transaction
    await connectionPromise.rollback();
    console.error("❌ เกิดข้อผิดพลาดในการบันทึกข้อมูล:", err);
    res.status(500).json({ error: "บันทึกข้อมูลล้มเหลว" });
  }
});

// ✅ API ดึงสถานะห้อง
app.get("/getRoomStatus", async (req, res) => {
  try {
    console.log("🔄 กำลังดึงข้อมูลสถานะห้อง...");

    // ตรวจสอบตาราง room ว่ามี field `room_status` หรือไม่
    const [rooms] = await connection
      .promise()
      .query("SELECT room_id, room_name, room_status FROM room");

    console.log("✅ ข้อมูลห้องที่ดึงมา:", rooms); // ตรวจสอบข้อมูลที่ดึงมา
    res.json(rooms);
  } catch (err) {
    console.error("❌ Error fetching room status:", err);
    res.status(500).json({ error: "ดึงสถานะล้มเหลว", details: err.message });
  }
});

// ===============================
// เริ่มเซิร์ฟเวอร์
// ===============================
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
