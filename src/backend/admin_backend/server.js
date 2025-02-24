const express = require('express');
const connection = require('./db'); // Import database connection
const cors = require('cors');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors()); // Allow frontend to access API

/*app.use("/booking_documents", express.static(path.join(__dirname, "../../shared/booking_documents/")));

app.get("/", (req, res) => {
  res.send(`
    <table border="1">
      <tr>
        <td class="text-center">
          <a href="../../shared/booking_documents/booking_document.pdf" target="_blank">เปิดเอกสาร</a>
        </td>
      </tr>
    </table>
  `);
});*/

app.listen(3000, () => console.log("Server running at http://localhost:3001"));

// 📌 Whitelist allowed tables to prevent SQL injection
const allowedTables = [
    'admin', 'computer_management', 'equipment',
    'equipment_management', 'executive', 'room',
    'room_request', 'room_request_computer', 'room_request_equipment', 
    'room_request_participant','room_schedule', 'room_type', 
    'student', 'teacher', 'user'
];


// 📌 Dynamic Route for fetching any table data
app.get('/data/:table', (req, res) => {
    const { table } = req.params;

    // Check if requested table is in allowed list
    if (!allowedTables.includes(table)) {
        return res.status(400).json({ error: 'Invalid table name' });
    }

    const sql = `SELECT * FROM ??`; // `??` prevents SQL injection
    connection.query(sql, [table], (err, results) => {
        if (err) {
            console.error(`❌ Error fetching data from ${table}:`, err);
            return res.status(500).json({ error: 'Database query failed' });
        }
        console.log(`✅ Data retrieved from ${table}:`, results.length, 'rows');
        res.json(results);
    });
});

/*app.post('/updateStatus', (req, res) => {
    const { requestId, status } = req.body;

    const sql = 'UPDATE Rooms_list_requests SET Requests_status = ? WHERE Rooms_requests_ID = ?';

    connection.query(sql, [status, requestId], (err, results) => {
        if (err) {
            console.error('❌ Error updating status:', err);
            return res.status(500).json({ message: 'Failed to update status' });
        }

        if (results.affectedRows === 0) {
            // ถ้าไม่มีแถวไหนถูกอัปเดต แสดงว่า requestId อาจไม่ถูกต้อง
            return res.status(404).json({ message: 'Request ID not found' });
        }

        console.log(`✅ Status updated for Request ID ${requestId}: ${status}`);
        res.status(200).json({ message: 'Status updated successfully' });
    });
});

app.post('/updateScheduleStatus', (req, res) => {
    const { scheduleId, status } = req.body;
    console.log('📢 Incoming request:', req.body); // เช็กข้อมูลที่ได้รับจาก Client

    if (!scheduleId || !status) {
        return res.status(400).json({ message: 'Missing scheduleId or status' });
    }

    const query = 'UPDATE Rooms_schedule_time SET Rooms_status = ? WHERE Schedule_time_ID = ?';

    connection.query(query, [status, scheduleId], (err, result) => {
        if (err) {
            console.error('❌ Database error:', err);
            return res.status(500).json({ message: 'Failed to update status', error: err.message });
        }

        if (result.affectedRows > 0) {
            console.log(`✅ Status updated for Schedule_time_ID ${scheduleId}: ${status}`);
            res.status(200).json({ message: 'Status updated successfully' });
        } else {
            console.warn(`⚠️ No rows updated for Schedule_time_ID ${scheduleId}`);
            res.status(404).json({ message: 'Schedule ID not found' });
        }
    });
});

app.post('/insertSchedule', (req, res) => {
    const { roomId, day, startTime, endTime, status } = req.body;

    if (!roomId || !day || !startTime || !endTime || !status) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    const query = `
        INSERT INTO Rooms_schedule_time (Rooms_ID, Week_days, Start_time, End_time, Rooms_status)
        VALUES (?, ?, ?, ?, ?)
    `;

    connection.query(query, [roomId, day, startTime, endTime, status], (err, result) => {
        if (err) {
            console.error('❌ Error inserting new schedule:', err);
            return res.status(500).json({ message: 'Failed to insert new schedule' });
        }

        res.status(200).json({ message: 'New schedule inserted', newScheduleId: result.insertId });
    });
});*/

// 📌 Start Server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});