const express = require('express');
const connection = require('./db'); // Import database connection
const cors = require('cors');
const path = require('path');
const fs = require("fs");

const util = require('util');

const app = express();
app.use(express.json());
app.use(cors()); // Allow frontend to access API

const query = util.promisify(connection.query).bind(connection);

const allowedTables = [
    'admin', 'computer_management', 'equipment',
    'equipment_management', 'executive', 'room',
    'room_request', 'room_request_computer', 'room_request_equipment',
    'room_request_participant', 'room_schedule', 'room_type',
    'student', 'teacher', 'user', 'equipment_brokened'
];

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

    try {
        let sql;
        let params;

        if (status === "ไม่อนุมัติ") {
            sql = `UPDATE room_request SET request_status = ?, reject_reason = ?, detail_reject_reason = ? WHERE room_request_id = ?`;
            params = [status, rejectReason, detailRejectReason, requestId];
        } else {
            sql = `UPDATE room_request SET request_status = ? WHERE room_request_id = ?`;
            params = [status, requestId];
        }

        const result = await query(sql, params);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "ไม่พบรายการที่ต้องการอัปเดต" });
        }

        console.log(`✅ สถานะอัปเดตสำเร็จ: ${status}`);
        res.json({ message: "สถานะอัปเดตเรียบร้อย", updatedStatus: status });
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

    try {
        const sql = `UPDATE equipment_brokened SET repair_status = ? WHERE repair_number = ?`;
        const params = [new_status, repair_id];

        const result = await query(sql, params);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "ไม่พบรายการที่ต้องการอัปเดต" });
        }

        console.log(`✅ สถานะของแจ้งซ่อม ${repair_id} อัปเดตเป็น: ${new_status}`);
        res.json({ message: "สถานะอัปเดตเรียบร้อย", updatedStatus: new_status });

    } catch (error) {
        console.error("❌ Database error:", error);
        res.status(500).json({ message: "เกิดข้อผิดพลาดในการอัปเดตสถานะ", error: error.message });
    }
});

app.get("/image/:filename", async(req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, "../storage/equipment_img", filename);

    if (fs.existsSync(filePath)) {
        res.setHeader("Content-Type", "image/jpeg");
        res.sendFile(filePath);
    } else {
        res.status(404).json({ error: "File not found" });
    }
});


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
