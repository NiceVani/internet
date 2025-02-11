const express = require("express");
const connection = require("./db"); // นำเข้าการเชื่อมต่อฐานข้อมูลของคุณ
const cors = require("cors");
const { Server } = require("socket.io");
const http = require("http");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }, // อนุญาตให้เชื่อมต่อจากทุกที่
});

app.use(express.json());
app.use(cors());

// ==============================
// Endpoint: /getSchedule
// ดึงข้อมูลตารางเรียนจาก Rooms_schedule_time
// ==============================
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

// ==============================
// Endpoint: /Rooms_list_requests
// ดึงข้อมูลการจองห้องจาก Rooms_list_requests
// ==============================
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

// ==============================
// Endpoint: /Manage_computers
// ดึงข้อมูลคอมพิวเตอร์จาก Manage_computers (สำหรับเก้าอี้)
// ==============================
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

// ==============================
// Endpoint: /getEquipments?room=307
// ดึงข้อมูลอุปกรณ์จาก Manage_equipments join กับ Equipments_list_information
// ==============================
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

// ==============================
// WebSocket สำหรับการอัปเดตเรียลไทม์ (ถ้ามี)
// ==============================
io.on("connection", (socket) => {
  console.log("A user connected via WebSocket");
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// ==============================
// เริ่มเซิร์ฟเวอร์
// ==============================
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
