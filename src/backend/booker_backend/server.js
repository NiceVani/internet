const express = require("express");
const connection = require("./db"); // นำเข้าการเชื่อมต่อฐานข้อมูล
const cors = require("cors");
const { Server } = require("socket.io");
const http = require("http");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*" } // อนุญาตให้เชื่อมต่อจากทุกที่
});



app.use(express.json()); // รองรับ JSON request body
app.use(cors()); // อนุญาตให้เว็บอื่นเรียกใช้ API ได้

// 📌 ดึงข้อมูลตารางเรียน
app.get("/getSchedule", async (req, res) => {
    try {
        // คิวรีข้อมูลจากตาราง Schedule_time
        const [results] = await connection.promise().query("SELECT * FROM Schedule_time");

        console.log("✅ ดึงข้อมูลสำเร็จ:", results.length);
        res.json(results); // ส่งข้อมูลกลับไปในรูปแบบ JSON
    } catch (err) {
        console.error("❌ เกิดข้อผิดพลาด:", err);
        res.status(500).json({ error: "ดึงข้อมูลล้มเหลว" });
    }
});


// 📌 จองห้องเรียน
// app.post("/book", async (req, res) => {
//     const { user_id, room_id, date, time_slot } = req.body;

//     try {
//         // ตรวจสอบว่าช่วงเวลานี้ถูกจองแล้วหรือไม่
//         const [exists] = await connection.promise().query(
//             "SELECT * FROM bookings WHERE room_id = ? AND date = ? AND time_slot = ?",
//             [room_id, date, time_slot]
//         );

//         if (exists.length > 0) return res.status(400).json({ message: "❌ ช่วงเวลานี้ถูกจองแล้ว" });

//         // ถ้าไม่ถูกจอง -> ทำการเพิ่มข้อมูลการจองลงฐานข้อมูล
//         await connection.promise().query(
//             "INSERT INTO bookings (user_id, room_id, date, time_slot, status) VALUES (?, ?, ?, ?, 'รอการยืนยัน')",
//             [user_id, room_id, date, time_slot]
//         );

//         // แจ้งเตือนให้ผู้ใช้ทุกคนเห็นการอัปเดตแบบเรียลไทม์
//         io.emit("booking_update", { room_id, time_slot });

//         res.json({ message: "✅ จองสำเร็จ กำลังรอการยืนยัน" });
//     } catch (err) {
//         console.error("❌ เกิดข้อผิดพลาด:", err);
//         res.status(500).json({ error: "การจองล้มเหลว" });
//     }
// });

// 📌 WebSocket แจ้งเตือนการจองแบบเรียลไทม์
// io.on('connection', (socket) => {
//     console.log('a user connected');
//     socket.on('disconnect', () => {
//         console.log('user disconnected');
//     });
// });



// app.get('/brokendEquipment', (req, res) => {
//     connection.query('SELECT b.Equipments_ID, (SELECT Equipments_name FROM Equipments_list_information WHERE Equipments_ID = b.Equipments_ID) AS Equipments_name, COUNT(*) AS count FROM Equipments_list_brokened b GROUP BY b.Equipments_ID ORDER BY count DESC LIMIT 3;', (err, results) => {
//         if (err) {
//             console.error('❌ เกิดข้อผิดพลาด:', err);
//             res.status(500).send(err);
//             return;
//         }
//         console.log('✅ ดึงข้อมูลสำเร็จ:', results);
//         res.json(results);
//     });
// });
// app.get('/borrowEquipment', (req, res) => {
//     connection.query('SELECT b.Equipments_ID, (SELECT Equipments_name FROM Equipments_list_information WHERE Equipments_ID = b.Equipments_ID) AS Equipments_name, COUNT(*) AS count FROM Equipments_list_requests b GROUP BY Equipments_ID ORDER BY count DESC LIMIT 3;', (err, results) => {
//         if (err) {
//             console.error('❌ เกิดข้อผิดพลาด:', err);
//             res.status(500).send(err);
//             return;
//         }
//         console.log('✅ ดึงข้อมูลสำเร็จ:', results);
//         res.json(results);
//     });
// });
// app.get('/mostroomalldata', (req, res) => {
//     const query ="SELECT rlr.Rooms_ID AS room,rlr.Identify_ID AS id,SUM(CASE WHEN si.Department = 'วิทยาการคอมพิวเตอร์' THEN 1 ELSE 0 END) AS cs,SUM(CASE WHEN si.Department = 'เทคโนโลยีสารสนเทศ' THEN 1 ELSE 0 END) AS it, COUNT(*) AS count FROM Rooms_list_requests rlr LEFT JOIN Student_information si ON rlr.Identify_ID = si.Student_ID GROUP BY rlr.Rooms_ID, rlr.Identify_ID;"
//     connection.query( query,(err, results) => {
//         if (err) {
//             console.error('❌ เกิดข้อผิดพลาด:', err);
//             res.status(500).send(err);
//             return;
//         }
//         console.log('✅ ดึงข้อมูลสำเร็จ:', results);
//         res.json(results);
//     });
// });
// app.get('/daysroom', (req, res) => {
//     const query ="SELECT rlr.Rooms_ID AS room,rlr.Identify_ID AS id,SUM(CASE WHEN si.Department = 'วิทยาการคอมพิวเตอร์' THEN 1 ELSE 0 END) AS cs,SUM(CASE WHEN si.Department = 'เทคโนโลยีสารสนเทศ' THEN 1 ELSE 0 END) AS it,COUNT(*) AS count,CASE WHEN DAYOFWEEK(rlr.Used_Date) = 1 THEN 'อาทิตย์'WHEN DAYOFWEEK(rlr.Used_Date) = 2 THEN 'จันทร์'WHEN DAYOFWEEK(rlr.Used_Date) = 3 THEN 'อังคาร'WHEN DAYOFWEEK(rlr.Used_Date) = 4 THEN 'พุธ'WHEN DAYOFWEEK(rlr.Used_Date) = 5 THEN 'พฤหัสบดี'WHEN DAYOFWEEK(rlr.Used_Date) = 6 THEN 'ศุกร์'WHEN DAYOFWEEK(rlr.Used_Date) = 7 THEN 'เสาร์' END AS day_of_week FROM Rooms_list_requests rlr LEFT JOIN Student_information si ON rlr.Identify_ID = si.Student_ID GROUP BY   rlr.Rooms_ID, rlr.Identify_ID, day_of_week;"
//     connection.query( query,(err, results) => {
//         if (err) {
//             console.error('❌ เกิดข้อผิดพลาด:', err);
//             res.status(500).send(err);
//             return;
//         }
//         console.log('✅ ดึงข้อมูลสำเร็จ:', results);
//         res.json(results);
//     });
// });
// app.get('/useralldata', (req, res) => {
//     const query ="SELECT si.Name, si.Student_ID,si.Phone_number,si.email, COUNT(rlr.Identify_ID) AS Status FROM Rooms_list_requests rlr JOIN Student_information si ON rlr.Identify_ID = si.Student_ID GROUP BY si.Student_ID ORDER BY Status DESC LIMIT 3;"
//     connection.query( query,(err, results) => {
//         if (err) {
//             console.error('❌ เกิดข้อผิดพลาด:', err);
//             res.status(500).send(err);
//             return;
//         }
//         console.log('✅ ดึงข้อมูลสำเร็จ:', results);
//         res.json(results);
//     });
// });

// app.get('/user', (req, res) => {
//     const query ="SELECT si.Name, si.Student_ID,si.Phone_number,si.email, COUNT(rlr.Identify_ID) AS Status FROM Rooms_list_requests rlr JOIN Student_information si ON rlr.Identify_ID = si.Student_ID GROUP BY si.Student_ID ORDER BY Status DESC ;"
//     connection.query( query,(err, results) => {
//         if (err) {
//             console.error('❌ เกิดข้อผิดพลาด:', err);
//             res.status(500).send(err);
//             return;
//         }
//         console.log('✅ ดึงข้อมูลสำเร็จ:', results);
//         res.json(results);
//     });
// });
// app.get('/roomdetail', (req, res) => {
//     const query ="SELECT rli.Rooms_name AS Name,rli.Floors, rli.Rooms_ID, SUM(CASE WHEN rlr.Requests_status = 'อนุมัติ' THEN 1 ELSE 0 END) AS Approved_Count FROM Rooms_list_information rli LEFT JOIN Rooms_list_requests rlr ON rli.Rooms_ID = rlr.Rooms_ID GROUP BY rli.Rooms_ID, rli.Rooms_name, rli.Floors ORDER BY Approved_Count DESC;"
//     connection.query( query,(err, results) => {
//         if (err) {
//             console.error('❌ เกิดข้อผิดพลาด:', err);
//             res.status(500).send(err);
//             return;
//         }
//         console.log('✅ ดึงข้อมูลสำเร็จ:', results);
//         res.json(results);
//     });
// });

// app.get('/Rooms_list_requests', (req, res) => {
//     connection.query('SELECT * FROM Rooms_list_requests', (err, results) => {
//         if (err) {
//             console.error('❌ Error:', err);
//             res.status(500).send(err);
//             return;
//         }
//         console.log('✅ ดึงข้อมูลสำเร็จจาก Rooms_list_requests:', results);
//         res.json(results);
//     });
// });


// app.get('/data/Student_information', (req, res) => {
//     connection.query('SELECT * FROM Student_information', (err, results) => {
//         if (err) {
//             console.error('❌ Error:', err);
//             res.status(500).send(err);
//             return;
//         }
//         console.log('✅ ดึงข้อมูลสำเร็จจาก Student_information:', results);
//         res.json(results);
//     });
// });

// app.get('/data/Teacher_information', (req, res) => {
//     connection.query('SELECT * FROM Teacher_information', (err, results) => {
//         if (err) {
//             console.error('❌ Error:', err);
//             res.status(500).send(err);
//             return;
//         }
//         console.log('✅ ดึงข้อมูลสำเร็จจาก Teacher_information:', results);
//         res.json(results);
//     });
// });
// 📌 เริ่มเซิร์ฟเวอร์
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
