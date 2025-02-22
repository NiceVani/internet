const express = require('express');
const connection = require('./db'); // นำเข้าการเชื่อมต่อฐานข้อมูล
const mysql = require('mysql2');
const cors = require('cors');  // เพิ่ม cors


const app = express();
app.use(express.json()); // รองรับ JSON request body
app.use(cors());
// 📌 ดึงข้อมูลจากตาราง (เปลี่ยน `rooms` เป็นชื่อตารางของคุณ)
app.get('/rooms', (req, res) => {
    connection.query('SELECT * FROM Equipments_list_brokened', (err, results) => {
        if (err) {
            console.error('❌ เกิดข้อผิดพลาด:', err);
            res.status(500).send(err);
            return;
        }
        console.log('✅ ดึงข้อมูลสำเร็จ:', results);
        res.json(results);
    });
});
app.get('/brokendEquipment', (req, res) => {
    connection.query('SELECT b.Equipments_ID, (SELECT Equipments_name FROM Equipments_list_information WHERE Equipments_ID = b.Equipments_ID) AS Equipments_name, COUNT(*) AS count FROM Equipments_list_brokened b GROUP BY b.Equipments_ID ORDER BY count DESC LIMIT 3;', (err, results) => {
        if (err) {
            console.error('❌ เกิดข้อผิดพลาด:', err);
            res.status(500).send(err);
            return;
        }
        console.log('✅ ดึงข้อมูลสำเร็จ:', results);
        res.json(results);
    });
});
app.get('/borrowEquipment', (req, res) => {
    connection.query('SELECT b.Equipments_ID, (SELECT Equipments_name FROM Equipments_list_information WHERE Equipments_ID = b.Equipments_ID) AS Equipments_name, COUNT(*) AS count FROM Equipments_list_requests b GROUP BY Equipments_ID ORDER BY count DESC LIMIT 3;', (err, results) => {
        if (err) {
            console.error('❌ เกิดข้อผิดพลาด:', err);
            res.status(500).send(err);
            return;
        }
        console.log('✅ ดึงข้อมูลสำเร็จ:', results);
        res.json(results);
    });
});
app.get('/mostroomalldata', (req, res) => {
    const query = "WITH RoomUsage AS (SELECT rr.Rooms_ID, s.Department, COUNT(*) AS UsageCount FROM Rooms_list_requests rr JOIN Student_information s ON rr.Identify_ID = s.Student_ID WHERE s.Department IN ('วิทยาการคอมพิวเตอร์', 'เทคโนโลยีสารสนเทศ') GROUP BY rr.Rooms_ID, s.Department) SELECT ru.Rooms_ID AS Room, COALESCE(SUM(CASE WHEN ru.Department = 'วิทยาการคอมพิวเตอร์' THEN ru.UsageCount END), 0) AS cs, COALESCE(SUM(CASE WHEN ru.Department = 'เทคโนโลยีสารสนเทศ' THEN ru.UsageCount END), 0) AS it, SUM(ru.UsageCount) AS total FROM RoomUsage ru GROUP BY ru.Rooms_ID ORDER BY total DESC;"
    connection.query(query, (err, results) => {
        if (err) {
            console.error('❌ เกิดข้อผิดพลาด:', err);
            res.status(500).send(err);
            return;
        }
        console.log('✅ ดึงข้อมูลสำเร็จ:', results);
        res.json(results);
    });
});
app.get('/daysroom', (req, res) => {
    const query = "WITH DailyBookings AS (SELECT DAYOFWEEK(rr.Used_date) AS DayOfWeek,SUM(CASE WHEN s.Department = 'วิทยาการคอมพิวเตอร์' THEN 1 ELSE 0 END) AS CS_Count,SUM(CASE WHEN s.Department = 'เทคโนโลยีสารสนเทศ' THEN 1 ELSE 0 END) AS IT_Count FROM Rooms_list_requests rr JOIN Student_information s ON rr.Identify_ID = s.Student_ID WHERE s.Department IN ('วิทยาการคอมพิวเตอร์', 'เทคโนโลยีสารสนเทศ') GROUP BY DAYOFWEEK(rr.Used_date))SELECT CASE WHEN db.DayOfWeek = 1 THEN 'อาทิตย์' WHEN db.DayOfWeek = 2 THEN 'จันทร์' WHEN db.DayOfWeek = 3 THEN 'อังคาร' WHEN db.DayOfWeek = 4 THEN 'พุธ' WHEN db.DayOfWeek = 5 THEN 'พฤหัสบดี' WHEN db.DayOfWeek = 6 THEN 'ศุกร์' WHEN db.DayOfWeek = 7 THEN 'เสาร์' END AS DayName,db.CS_Count AS Cs,db.IT_Count AS It,(db.CS_Count + db.IT_Count) AS TotalCount FROM DailyBookings db ORDER BY db.DayOfWeek;"
    connection.query(query, (err, results) => {
        if (err) {
            console.error('❌ เกิดข้อผิดพลาด:', err);
            res.status(500).send(err);
            return;
        }
        console.log('✅ ดึงข้อมูลสำเร็จ:', results);
        res.json(results);
    });
});
app.get('/detailsdaysroom', (req, res) => {
    const query = "SELECT 'รวมทั้งหมด' AS DayName, SUM(db.CS_Count) AS Cs, SUM(db.IT_Count) AS It, SUM(db.CS_Count + db.IT_Count) AS TotalCount FROM (SELECT DAYOFWEEK(rr.Used_date) AS DayOfWeek, SUM(CASE WHEN s.Department = 'วิทยาการคอมพิวเตอร์' THEN 1 ELSE 0 END) AS CS_Count, SUM(CASE WHEN s.Department = 'เทคโนโลยีสารสนเทศ' THEN 1 ELSE 0 END) AS IT_Count FROM Rooms_list_requests rr JOIN Student_information s ON rr.Identify_ID = s.Student_ID WHERE s.Department IN ('วิทยาการคอมพิวเตอร์', 'เทคโนโลยีสารสนเทศ') GROUP BY DAYOFWEEK(rr.Used_date)) db;"
    connection.query(query, (err, results) => {
        if (err) {
            console.error('❌ เกิดข้อผิดพลาด:', err);
            res.status(500).send(err);
            return;
        }
        console.log('✅ ดึงข้อมูลสำเร็จ:', results);
        res.json(results);
    });
});
app.get('/useralldata', (req, res) => {
    const query = "SELECT si.Name, si.Student_ID,si.Phone_number,si.email, COUNT(rlr.Identify_ID) AS Status FROM Rooms_list_requests rlr JOIN Student_information si ON rlr.Identify_ID = si.Student_ID GROUP BY si.Student_ID ORDER BY Status DESC LIMIT 3;"
    connection.query(query, (err, results) => {
        if (err) {
            console.error('❌ เกิดข้อผิดพลาด:', err);
            res.status(500).send(err);
            return;
        }
        console.log('✅ ดึงข้อมูลสำเร็จ:', results);
        res.json(results);
    });
});


app.get('/room_request', (req, res) => {
    connection.query('SELECT * FROM room_request', (err, results) => {
        if (err) {
            console.error('❌ Error:', err);
            res.status(500).send(err);
            return;
        }
        console.log('✅ ดึงข้อมูลสำเร็จจาก Rooms_list_requests:', results);
        res.json(results);
    });
});


app.get('/student', (req, res) => {
    connection.query('SELECT * FROM student', (err, results) => {
        if (err) {
            console.error('❌ Error:', err);
            res.status(500).send(err);
            return;
        }
        console.log('✅ ดึงข้อมูลสำเร็จจาก Student_information:', results);
        res.json(results);
    });
});

app.get('/teacher', (req, res) => {
    connection.query('SELECT * FROM teacher', (err, results) => {
        if (err) {
            console.error('❌ Error:', err);
            res.status(500).send(err);
            return;
        }
        console.log('✅ ดึงข้อมูลสำเร็จจาก Teacher_information:', results);
        res.json(results);
    });
});




app.get('/user', (req, res) => {
    const query = "SELECT si.Name, si.Student_ID,si.Phone_number,si.email, COUNT(rlr.Identify_ID) AS Status FROM Rooms_list_requests rlr JOIN Student_information si ON rlr.Identify_ID = si.Student_ID GROUP BY si.Student_ID ORDER BY Status DESC ;"
    connection.query(query, (err, results) => {
        if (err) {
            console.error('❌ เกิดข้อผิดพลาด:', err);
            res.status(500).send(err);
            return;
        }
        console.log('✅ ดึงข้อมูลสำเร็จ:', results);
        res.json(results);
    });
});



app.get('/roomdetail', (req, res) => {
    const query = "SELECT rli.Rooms_name AS Name,rli.Floors, rli.Rooms_ID, SUM(CASE WHEN rlr.Requests_status = 'อนุมัติ' THEN 1 ELSE 0 END) AS Approved_Count FROM Rooms_list_information rli LEFT JOIN Rooms_list_requests rlr ON rli.Rooms_ID = rlr.Rooms_ID GROUP BY rli.Rooms_ID, rli.Rooms_name, rli.Floors ORDER BY Approved_Count;"
    connection.query(query, (err, results) => {
        if (err) {
            console.error('❌ เกิดข้อผิดพลาด:', err);
            res.status(500).send(err);
            return;
        }
        console.log('✅ ดึงข้อมูลสำเร็จ:', results);
        res.json(results);
    });
});





app.post('/updateStatus', (req, res) => {
    const { requestId, status } = req.body;

    const sql = 'UPDATE room_request SET requests_status = ? WHERE rooms_request_id = ?';

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


app.get('/TableBorrowEquipment', (req, res) => {
    connection.query('SELECT e.Equipments_name AS equipmentname, r.Rooms_name AS roomname, e.Equipments_amount, COUNT(er.Rooms_requests_ID) AS total_borrowed_times FROM Equipments_list_requests er JOIN Equipments_list_information e ON er.Equipments_ID = e.Equipments_ID JOIN Rooms_list_requests rr ON er.Rooms_requests_ID = rr.Rooms_requests_ID JOIN Rooms_list_information r ON rr.Rooms_ID = r.Rooms_ID GROUP BY e.Equipments_name, r.Rooms_name, e.Equipments_amount ORDER BY e.Equipments_name, r.Rooms_name;', (err, results) => {
        if (err) {
            console.error('❌ Error:', err);
            res.status(500).send(err);
            return;
        }
        console.log('✅ ดึงข้อมูลสำเร็จจาก Teacher_information:', results);
        res.json(results);
    });
});

app.get('/TableRoomListRequest', (req, res) => {
    connection.query(`SELECT DATE_FORMAT(r.Used_date, "%Y-%m-%d") AS Date,
        CONCAT(r.start_time,"-", r.end_time) AS Time , r.Rooms_ID AS ห้อง, COALESCE(s.Name, t.Name) AS Name, COALESCE(s.email, t.email) AS Email, COALESCE(s.Status, t.Status) AS Status FROM Rooms_list_requests r LEFT JOIN Student_information s ON r.Identify_ID = s.Student_ID LEFT JOIN Teacher_information t ON r.Identify_ID = t.Teacher_ID ORDER BY r.Used_date, r.start_time; `,
        (err, results) => {
            if (err) {
                console.error('❌ Error:', err);
                res.status(500).send(err);
                return;
            }
            console.log('✅ ดึงข้อมูลสำเร็จจาก Teacher_information:', results);
            res.json(results);
        });
});

app.get('/TableRoomBooked', (req, res) => {
    connection.query(`SELECT 
    rli.Rooms_name AS Room,
    rli.Floors AS Floor,
    rli.Rooms_ID AS RoomID,
    rli.Room_types AS RoomType,
    COUNT(rlr.Rooms_ID) AS Total_Book
FROM Rooms_list_information rli
LEFT JOIN Rooms_list_requests rlr 
    ON rli.Rooms_ID = rlr.Rooms_ID 
    AND rlr.Requests_status = 'อนุมัติ'
GROUP BY rli.Rooms_ID
HAVING COUNT(rlr.Rooms_ID) > 0
ORDER BY Total_Book DESC;
`,
        (err, results) => {
            if (err) {
                console.error('❌ Error:', err);
                res.status(500).send(err);
                return;
            }
            console.log('✅ ดึงข้อมูลสำเร็จจาก Teacher_information:', results);
            res.json(results);
        });
});


app.get('/TableBrokenEqipment', (req, res) => {
    connection.query(`SELECT 
    eli.Equipments_name AS EquipmentName,
    rli.Rooms_name AS Room,
    eli.Equipments_amount AS TotalEquipment,
    COUNT(elb.Equipments_ID) AS TotalBrokened,
    (eli.Equipments_amount - COUNT(elb.Equipments_ID)) AS Balance
FROM Equipments_list_information eli
LEFT JOIN Equipments_list_brokened elb ON eli.Equipments_ID = elb.Equipments_ID
LEFT JOIN Rooms_list_information rli ON elb.Rooms_ID = rli.Rooms_ID
WHERE rli.Rooms_name IS NOT NULL
GROUP BY eli.Equipments_name, rli.Rooms_name, eli.Equipments_amount;
;
 `,
        (err, results) => {
            if (err) {
                console.error('❌ Error:', err);
                res.status(500).send(err);
                return;
            }
            console.log('✅ ดึงข้อมูลสำเร็จจาก Teacher_information:', results);
            res.json(results);
        });
});

app.get('/DataEquipment', (req, res) => {
    connection.query(`
       SELECT 
    eli.Equipments_name AS EquipmentName,  -- ชื่ออุปกรณ์
    rli.Rooms_name AS Room,  -- ห้องที่ขออุปกรณ์ไป (แทน Rooms_requests_ID ด้วย Rooms_name)
    eli.Equipments_amount,  -- จำนวนอุปกรณ์ทั้งหมด
    COALESCE(elb.BrokenedEquipment, 0) AS BrokenedEquipment,  -- อุปกรณ์ที่เสีย
    (eli.Equipments_amount - COALESCE(elb.BrokenedEquipment, 0)) AS Balance,  -- คำนวณ Balance
    COALESCE(SUM(elr.Equipments_amount), 0) AS BorrowAmount  -- จำนวนที่ถูกยืม
FROM Equipments_list_information eli
LEFT JOIN Equipments_list_requests elr 
    ON eli.Equipments_ID = elr.Equipments_ID  -- เชื่อมข้อมูลอุปกรณ์ที่ถูกขอไป
LEFT JOIN Rooms_list_requests rlr  
    ON elr.Rooms_requests_ID = rlr.Rooms_requests_ID  -- ใช้ Rooms_request_ID เพื่อหาห้องที่ขอยืมไป
LEFT JOIN Rooms_list_information rli  
    ON rlr.Rooms_ID = rli.Rooms_ID  -- ใช้ Rooms_ID เชื่อมกับ Rooms_list_information เพื่อดึงชื่อห้อง
LEFT JOIN (
    SELECT Equipments_ID, COUNT(*) AS BrokenedEquipment   
    FROM Equipments_list_brokened
    GROUP BY Equipments_ID
) elb ON eli.Equipments_ID = elb.Equipments_ID  
GROUP BY eli.Equipments_name, rli.Rooms_name, eli.Equipments_amount, elb.BrokenedEquipment;

`,
        (err, results) => {
            if (err) {
                console.error('❌ Error:', err);
                res.status(500).send(err);
                return;
            }
            console.log('✅ ดึงข้อมูลสำเร็จจาก Teacher_information:', results);
            res.json(results);
        });
});
// 📌 เริ่มเซิร์ฟเวอร์
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});