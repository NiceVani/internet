const express = require('express');
const connection = require('./db'); // Import database connection
const cors = require('cors');
const path = require('path');
const fs = require("fs");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const { Server } = require("socket.io");
const http = require("http");

const util = require('util');

const app = express();
app.use(express.json());
app.use(cors({
    origin: ["http://127.0.0.1:5500", "http://localhost:5500", "http://localhost:8080", "http://localhost:5501"], // 👈 เปลี่ยนจาก '*' เป็น origin ของ frontend
    credentials: true // ✅ อนุญาตให้ส่งคุกกี้ไปกับคำขอ
}));

app.set("trust proxy", 1); // ✅ ให้ Express เชื่อว่ามี Proxy (เช่น Chrome DevTools)
const MemoryStore = require('memorystore')(session); // ใช้ MemoryStore หรือ Redis สำหรับการเก็บเซสชัน

app.use(
    session({
        secret: "supersecretkey",
        resave: false,
        saveUninitialized: false,
        store: new MemoryStore({ checkPeriod: 86400000 }),  // ใช้ MemoryStore เก็บเซสชัน
        cookie: {
            secure: false, // ถ้าใช้ HTTPS ให้เปลี่ยนเป็น true
            httpOnly: true,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 1 สัปดาห์
        },
    })
);

const query = util.promisify(connection.query).bind(connection);

const allowedTables = [
    'admin', 'computer_management', 'equipment',
    'equipment_management', 'executive', 'room',
    'room_request', 'room_request_computer', 'room_request_equipment',
    'room_request_participant', 'room_schedule', 'room_type',
    'student', 'admin', 'user', 'equipment_brokened', 'teacher'
];

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

        const [adminResults] = await connection
            .promise()
            .query("SELECT * FROM admin WHERE admin_id = ?", [user.username]);

        if (adminResults.length > 0) {
            req.session.user = { role: "ผู้ดูแลห้อง", data: adminResults[0] };
            req.session.save((err) => {
                if (err) {
                    console.error("❌ เกิดข้อผิดพลาดในการบันทึกเซสชัน:", err);
                    return res.status(500).json({ error: "บันทึกเซสชันล้มเหลว" });
                }
                console.log("✅ เซสชันผู้ดูแลห้องถูกบันทึก:", req.session);
                res.cookie("connect.sid", req.sessionID, {
                    httpOnly: true,
                    sameSite: "lax",
                });
                return res.json({ success: true, role: "ผู้ดูแลห้อง" });
            });
            return;
        }

        res.status(404).json({ error: "ไม่พบข้อมูลผู้ใช้" });
    } catch (err) {
        console.error("❌ เกิดข้อผิดพลาด:", err);
        res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูล" });
    }
});

// API สำหรับตรวจสอบเซสชัน
app.get("/session", (req, res) => {
    console.log("📌 ตรวจสอบเซสชันจาก API:", req.session);  // Log ค่า session

    if (req.session.user) {
        const { role, data } = req.session.user;
        let userId = data.admin_id || null;

        if (!userId) {
            return res.status(401).json({ error: "ไม่พบข้อมูลผู้ใช้" });
        }

        res.json({
            role: role,
            data: {
                user_id: userId,
                admin_id: data.admin_id || null,
                admin_id: data.admin_id || null,
                full_name: data.full_name,
                faculty: data.faculty,
                department: data.department,
            },
        });
    } else {
        return res.status(401).json({ error: "ไม่ได้ล็อกอิน" });
    }
});

app.post("/logout", (req, res) => {
    req.session.destroy(() => {
        res.json({ success: true });
    });
});

app.get('/data/:table', async (req, res) => {
    const { table } = req.params;

    if (!allowedTables.includes(table)) {
        return res.status(400).json({ error: 'Invalid table name' });
    }

    try {
        const results = await query('SELECT * FROM ??', [table]);
        console.log(`✅ Data retrieved from ${table}:`, results.length, 'rows');
        res.json(results);
    } catch (err) {
        console.error(`❌ Error fetching data from ${table}:`, err);
        res.status(500).json({ error: 'Database query failed' });
    }
});

app.post('/updateStatus', async (req, res) => {
    const { requestId, status, rejectReason, detailRejectReason } = req.body;

    // ✅ ดึง admin_id จาก session (ไม่ต้องส่งมาจาก frontend)
    const admin_id = req.session?.user?.data?.admin_id;

    if (!admin_id) {
        return res.status(403).json({ message: "ไม่ได้เข้าสู่ระบบในฐานะผู้ดูแล" });
    }

    try {
        // ดึงประเภทคำขอ (ในเวลา/นอกเวลา)
        const [request] = await query(`SELECT request_type FROM room_request WHERE room_request_id = ?`, [requestId]);

        if (!request) {
            return res.status(404).json({ message: "ไม่พบรายการที่ต้องการอัปเดต" });
        }

        // กำหนดสถานะสุดท้ายตามประเภทเวลา
        let finalStatus = status;
        if (status === "อนุมัติ" || status === "รออนุมัติ") {
            finalStatus = request.request_type === "ในเวลา" ? "อนุมัติ" : "รออนุมัติ";
        }

        let sql, params;

        if (finalStatus === "ไม่อนุมัติ") {
            sql = `
                UPDATE room_request 
                SET request_status = ?, reject_reason = ?, detail_reject_reason = ?, admin_id = ?
                WHERE room_request_id = ?
            `;
            params = [finalStatus, rejectReason, detailRejectReason, admin_id, requestId];
        } else {
            sql = `
                UPDATE room_request 
                SET request_status = ?, admin_id = ?
                WHERE room_request_id = ?
            `;
            params = [finalStatus, admin_id, requestId];
        }

        const result = await query(sql, params);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "ไม่พบรายการที่ต้องการอัปเดต" });
        }

        console.log(`✅ สถานะ '${finalStatus}' ถูกอัปเดตโดย admin_id: ${admin_id}`);
        res.json({ message: "สถานะอัปเดตเรียบร้อย", updatedStatus: finalStatus });

    } catch (error) {
        console.error("❌ Database error:", error);
        res.status(500).json({ message: "เกิดข้อผิดพลาดในการอัปเดตสถานะ", error: error.message });
    }
});



// Endpoint to insert a new schedule
app.post('/insertSchedule', async (req, res) => {
    const { roomId, weekDay, scheduleDate, startTime, endTime, status } = req.body;

    try {
        const sql = `INSERT INTO room_schedule (room_id, week_day, schedule_date, start_time, end_time, room_status) VALUES (?, ?, ?, ?, ?, ?)`;
        const params = [roomId, weekDay, scheduleDate, startTime, endTime, status];

        const result = await query(sql, params);

        console.log(`✅ New schedule record inserted with ID: ${result.insertId}`);
        res.json({ message: "New schedule record created", newScheduleId: result.insertId });
    } catch (error) {
        console.error("❌ Database error:", error);
        res.status(500).json({ message: "Error creating new schedule record", error: error.message });
    }
});

// Endpoint to update existing schedule status
app.post('/updateScheduleStatus', async (req, res) => {
    const { scheduleId, status } = req.body;

    try {
        const sql = `UPDATE room_schedule SET room_status = ? WHERE room_schedule_id = ?`;
        const params = [status, scheduleId];

        const result = await query(sql, params);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Schedule record not found" });
        }

        console.log(`✅ Schedule status updated to: ${status}`);
        res.json({ message: "Schedule status updated successfully", updatedStatus: status });
    } catch (error) {
        console.error("❌ Database error:", error);
        res.status(500).json({ message: "Error updating schedule status", error: error.message });
    }
});
app.post('/deleteSchedule', async (req, res) => {
    const { scheduleId } = req.body;
    if (!scheduleId) {
        return res.status(400).json({ error: 'Missing scheduleId' });
    }

    try {
        const sql = "DELETE FROM room_schedule WHERE room_schedule_id = ?";
        const result = await query(sql, [scheduleId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Schedule not found' });
        }

        console.log('✅ ลบ schedule_id ${scheduleId} สำเร็จ');
        res.json({ success: true, deletedId: scheduleId });
    } catch (error) {
        console.error('❌ Error deleting schedule:', error);
        res.status(500).json({ error: 'Failed to delete schedule' });
    }
});
// Get schedule data by date range and room ID
app.get('/data/room_schedule', async (req, res) => {
    const { start_date, end_date, search_date, roomId } = req.query;

    // Check if roomId is provided
    if (!roomId) {
        return res.status(400).json({ error: 'Missing roomId parameter' });
    }

    try {
        let sql = `SELECT * FROM room_schedule WHERE room_id = ?`;
        const params = [roomId];

        // Apply date range filter if provided
        if (start_date && end_date) {
            sql += ` AND schedule_date BETWEEN ? AND ?`;
            params.push(start_date, end_date);
        } else if (search_date) { // If a specific date is selected
            sql += ` AND schedule_date = ?`;
            params.push(search_date);
        }

        const results = await query(sql, params);

        console.log(`✅ Schedule data retrieved for room ID ${roomId}:`, results.length, 'rows');
        res.json(results);
    } catch (err) {
        console.error(`❌ Error fetching room schedule:`, err);
        res.status(500).json({ error: 'Database query failed' });
    }
});

app.get('/data/equipment_brokened', async (req, res) => {
    try {
        const results = await query('SELECT * FROM equipment_brokened');
        console.log("✅ Retrieved Data Sample:", results.slice(0, 5)); // แสดงข้อมูลตัวอย่าง 5 รายการ
        res.json(results);
    } catch (err) {
        console.error('❌ Error fetching equipment_brokened:', err);
        res.status(500).json({ error: 'Database query failed' });
    }
});

app.post('/updateEquipmentStatus', async (req, res) => {
    const { repair_id, new_status } = req.body;

    if (!req.session.user || req.session.user.role !== "ผู้ดูแลห้อง") {
        return res.status(403).json({ error: "ไม่มีสิทธิ์เข้าถึง" });
    }

    const admin_id = req.session.user.data.admin_id; // ดึง admin_id จาก session

    try {
        const sql = `UPDATE equipment_brokened 
                     SET repair_status = ?, admin_id = ? 
                     WHERE repair_number = ?`;
        const params = [new_status, admin_id, repair_id];

        const result = await query(sql, params);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "ไม่พบรายการที่ต้องการอัปเดต" });
        }

        console.log(`✅ สถานะของแจ้งซ่อม ${repair_id} อัปเดตเป็น: ${new_status} โดย Admin: ${admin_id}`);
        res.json({ message: "สถานะอัปเดตเรียบร้อย", updatedStatus: new_status });

    } catch (error) {
        console.error("❌ Database error:", error);
        res.status(500).json({ message: "เกิดข้อผิดพลาดในการอัปเดตสถานะ", error: error.message });
    }
});

app.get("/image/:filename", async (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, "../storage/equipment_img", filename);

    if (fs.existsSync(filePath)) {
        res.setHeader("Content-Type", "image/jpeg");
        res.sendFile(filePath);
    } else {
        res.status(404).json({ error: "File not found" });
    }
});

app.get('/data/equipment_management', async (req, res) => {
    const { room } = req.query;

    if (!room) {
        return res.status(400).json({ error: '❌ Room parameter is required' });
    }

    try {
        // ใช้ JOIN รวมตารางและกรองเฉพาะ room_id ที่ระบุ
        const results = await query(`
            SELECT 
                em.room_id,
                em.equipment_id,
                e.equipment_name,
                em.stock_quantity
            FROM equipment_management em
            JOIN equipment e ON em.equipment_id = e.equipment_id
            WHERE em.room_id = ?`,
            [room]
        );

        res.json(results);
    } catch (err) {
        console.error('❌ Error fetching equipment:', err);
        res.status(500).json({ error: 'Database query failed' });
    }
});

app.get('/getEquipments', async (req, res) => {
    const { room } = req.query;

    if (!room) {
        return res.status(400).json({ error: 'Room parameter is required' });
    }

    try {
        const results = await query(`
            SELECT e.equipment_id, e.equipment_name, em.stock_quantity 
            FROM equipment_management em 
            JOIN equipment e ON em.equipment_id = e.equipment_id 
            WHERE em.room_id = ?`, [room]);

        if (results.length === 0) {
            return res.status(404).json({ error: 'ไม่พบอุปกรณ์ในห้องนี้' });
        }

        res.json(results);
    } catch (err) {
        console.error('❌ Error fetching equipment:', err);
        res.status(500).json({ error: 'Database query failed' });
    }
});

app.post('/updateComputerStatus', async (req, res) => {
    const { computer_id, room_id, computer_status } = req.body;

    console.log('Received update request:', { computer_id, room_id, computer_status });

    try {
        // สร้าง query เพื่ออัปเดตสถานะคอมพิวเตอร์
        const query = 'UPDATE computer_management SET computer_status = ? WHERE computer_id = ? AND room_id = ?';
        console.log('Running query:', query);

        // Use connection.query instead of db.query
        connection.query(query, [computer_status, computer_id, room_id], (error, result) => {
            if (error) {
                console.error('❌ Error executing query:', error);
                return res.status(500).json({ error: 'Failed to update status' });
            }

            if (result.affectedRows > 0) {
                console.log('Update successful');
                res.status(200).json({ message: 'Updated successfully' });
            } else {
                console.error('❌ No matching records found');
                res.status(404).json({ error: 'Computer not found' });
            }
        });
    } catch (error) {
        console.error('❌ Error in server processing:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post("/updateEquipmentStock", async (req, res) => {
    try {
        const { equipment_id, room_id, new_quantity } = req.body;
        console.log("🛠️ รับคำขออัปเดตอุปกรณ์:", req.body);

        if (!equipment_id || !room_id || new_quantity === undefined) {
            console.log("❌ ข้อมูลไม่ครบถ้วน!");
            return res.status(400).json({ error: "ข้อมูลไม่ครบถ้วน!" });
        }

        // ตรวจสอบค่าก่อนอัปเดต
        console.log(`📌 UPDATE equipment_management SET stock_quantity = ${new_quantity} WHERE equipment_id = ${equipment_id} AND room_id = ${room_id}`);

        // ใช้ db ที่นำเข้าไว้ (ควรใช้ mysql2/promise)
        const updateQuery = `
            UPDATE equipment_management
            SET stock_quantity = ?
            WHERE equipment_id = ? AND room_id = ?
        `;

        const [result] = await connection.promise().query(updateQuery, [new_quantity, equipment_id, room_id]);

        if (result.affectedRows === 0) {
            console.log("❌ ไม่พบอุปกรณ์ในฐานข้อมูล!");
            return res.status(404).json({ error: "ไม่พบอุปกรณ์ที่ต้องการอัปเดต" });
        }

        console.log("✅ อัปเดตสำเร็จ!", result);
        res.json({ message: "✅ อัปเดตจำนวนอุปกรณ์เรียบร้อย" });
    } catch (error) {
        console.error("❌ Error in updateEquipmentStock:", error);
        res.status(500).json({ error: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" });
    }
});

app.post("/updateRoomStatus", async (req, res) => {
    const { room_name, room_status } = req.body;

    if (!room_name || !room_status) {
        return res.status(400).json({ message: "กรุณาระบุชื่อห้องและสถานะ" });
    }

    try {
        const sql = `UPDATE room SET room_status = ? WHERE room_name = ?`;
        const result = await query(sql, [room_status, room_name]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "ไม่พบห้องที่ต้องการอัปเดต" });
        }

        console.log(`✅ ห้อง ${room_name} ถูกอัปเดตเป็น '${room_status}'`);
        res.json({ message: "อัปเดตสำเร็จ" });
    } catch (error) {
        console.error("❌ Database error:", error);
        res.status(500).json({ message: "เกิดข้อผิดพลาด", error: error.message });
    }
});
app.get("/getRoomStatuses", async (req, res) => {
    try {
      const results = await query("SELECT room_name, room_status FROM room");
      res.json(results);
    } catch (err) {
      console.error("❌ Error fetching room statuses:", err);
      res.status(500).json({ message: "Database error" });
    }
  });
  
  app.post("/updateRoomStatus", async (req, res) => {
    const { room_name, room_status } = req.body;
  
    if (!room_name || !room_status) {
        return res.status(400).json({ message: "กรุณาระบุชื่อห้องและสถานะ" });
    }
  
    try {
        const sql = `UPDATE room SET room_status = ? WHERE room_name = ?`;
        const result = await query(sql, [room_status, room_name]);
  
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "ไม่พบห้องที่ต้องการอัปเดต" });
        }
  
        console.log(`✅ ห้อง ${room_name} ถูกอัปเดตเป็น '${room_status}'`);
        res.json({ message: "อัปเดตสำเร็จ" });
    } catch (error) {
        console.error("❌ Database error:", error);
        res.status(500).json({ message: "เกิดข้อผิดพลาด", error: error.message });
    }
  });
  

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});