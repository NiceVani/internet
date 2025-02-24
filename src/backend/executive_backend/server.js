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
    connection.query(`SELECT  rrm.equipment_id,e.equipment_name as name ,SUM(rrm.request_quantity) as total FROM room_request_equipment as rrm
LEFT JOIN equipment as e ON e.equipment_id = rrm.equipment_id
LEFT JOIN room as r ON r.room_id = rrm.room_id
GROUP BY rrm.equipment_id,e.equipment_name
ORDER BY total DESC LIMIT 3 ;`, (err, results) => {
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
    const query = `SELECT 
    room_id,
    SUM(cs_count) AS cs_count,
    SUM(it_count) AS it_count,
    SUM(total_count) AS total_count
FROM (
    SELECT 
        rr.room_id,
        SUM(CASE WHEN COALESCE(s.department, t.department) = 'วิทยาการคอมพิวเตอร์' THEN 1 ELSE 0 END) AS cs_count,
        SUM(CASE WHEN COALESCE(s.department, t.department) = 'เทคโนโลยีสารสนเทศ' THEN 1 ELSE 0 END) AS it_count,
        COUNT(rr.student_id) + COUNT(rr.teacher_id) AS total_count
    FROM room_request AS rr
    LEFT JOIN student AS s ON rr.student_id = s.student_id
    LEFT JOIN teacher AS t ON rr.teacher_id = t.teacher_id
    GROUP BY rr.room_id, COALESCE(s.department, t.department)
) AS subquery
GROUP BY room_id
ORDER BY room_id;


`
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
    const query = `SELECT 
    DAYNAME(rr.used_date) AS day_of_week,  -- แปลงเป็นชื่อวัน (Monday, Tuesday, ...)
        SUM(CASE WHEN COALESCE(s.department, t.department) = 'วิทยาการคอมพิวเตอร์' THEN 1 ELSE 0 END) AS cs_count,
        SUM(CASE WHEN COALESCE(s.department, t.department) = 'เทคโนโลยีสารสนเทศ' THEN 1 ELSE 0 END) AS it_count
FROM room_request AS rr
LEFT JOIN student AS s ON rr.student_id = s.student_id
LEFT JOIN teacher AS t ON rr.teacher_id = t.teacher_id
GROUP BY day_of_week
ORDER BY FIELD(day_of_week, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday');`
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
    const query = `SELECT 
        SUM(CASE WHEN COALESCE(s.department, t.department) = 'วิทยาการคอมพิวเตอร์' THEN 1 ELSE 0 END) AS cs_count,
        SUM(CASE WHEN COALESCE(s.department, t.department) = 'เทคโนโลยีสารสนเทศ' THEN 1 ELSE 0 END) AS it_count,
        SUM(
        	  CASE WHEN COALESCE(s.department, t.department) = 'วิทยาการคอมพิวเตอร์' THEN 1 ELSE 0 END+
             CASE WHEN COALESCE(s.department, t.department) = 'เทคโนโลยีสารสนเทศ' THEN 1 ELSE 0 END
        ) AS total_count
FROM room_request AS rr
LEFT JOIN student AS s ON rr.student_id = s.student_id
LEFT JOIN teacher AS t ON rr.teacher_id = t.teacher_id;
`
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
    const query = `SELECT 
    COALESCE(s.full_name, t.full_name) AS name,
    COUNT(rr.room_request_id) AS stat
FROM room_request AS rr
LEFT JOIN student AS s ON rr.student_id = s.student_id
LEFT JOIN teacher AS t ON rr.teacher_id = t.teacher_id
GROUP BY name
ORDER BY stat DESC LIMIT 3 ;
`
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
    const sortType = req.query.sort || "most"; // ค่าเริ่มต้นเป็น "most"

    let orderBy = "stat DESC"; // เรียงจากจองบ่อยสุด
    let limit = ""; // ค่า limit

    if (sortType === "latest") {
        orderBy = "MAX(rr.room_request_id) DESC"; // เรียงจาก ID ล่าสุด
        limit = "LIMIT 10";
    } else if (sortType === "oldest") {
        orderBy = "MIN(rr.room_request_id) ASC"; // เรียงจาก ID เก่าสุด
        limit = "LIMIT 10";
    }

    const query = `
        SELECT 
            COALESCE(s.full_name, t.full_name) AS name,
            COALESCE(s.student_id, t.teacher_id) AS id,
            COALESCE(s.phone_number, t.phone_number) AS phone_number,
            COALESCE(s.email, t.email) AS email,
            COALESCE(s.role, t.role) AS role,
            rr.room_id AS room,
            COUNT(*) AS stat
        FROM room_request AS rr
        LEFT JOIN student AS s ON rr.student_id = s.student_id
        LEFT JOIN teacher AS t ON rr.teacher_id = t.teacher_id
        GROUP BY name, id, phone_number, email, role, room
        ORDER BY ${orderBy}
        ${limit};`; // ใส่ LIMIT แยกออกมา

    connection.query(query, (err, results) => {
        if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({ error: "Database query failed" });
        }
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


app.get('/TableBorrowEquipment', (req, res) => {
    const { equipment } = req.query; // รับค่าที่เลือกจาก dropdown
    let query = `
        SELECT 
            e.equipment_name AS name, 
            r.room_name AS room, 
            MAX(eq.stock_quantity) AS stock,  
            SUM(rre.request_quantity) AS total,
            rr.request_status
        FROM room_request_equipment AS rre
        LEFT JOIN equipment AS e ON rre.equipment_id = e.equipment_id
        LEFT JOIN room AS r ON rre.room_id = r.room_id
        LEFT JOIN equipment_management AS eq ON rre.equipment_id = eq.equipment_id
        LEFT JOIN room_request AS rr ON rr.room_request_id = rre.room_request_id
        WHERE rr.request_status = 'อนุมัติ'
    `;

    // เพิ่มเงื่อนไขกรองอุปกรณ์ที่เลือก (ถ้ามี)
    if (equipment) {
        query += ` AND e.equipment_name = ?`;
    }

    query += ` GROUP BY rre.room_id, rre.equipment_id, e.equipment_name, r.room_name, rr.request_status`;

    connection.query(query, equipment ? [equipment] : [], (err, results) => {
        if (err) {
            console.error('❌ Error:', err);
            res.status(500).send(err);
            return;
        }
        console.log('✅ ดึงข้อมูลสำเร็จจาก TableBorrowEquipment:', results);
        res.json(results);
    });
});


app.get('/TableRoomListRequest', (req, res) => {
    const { role, room, dateFilter } = req.query;

    let whereClause = [];

    // 📌 เงื่อนไขกรอง role (อาจารย์ / นิสิต)
    if (role && role !== "all") {
        whereClause.push(`COALESCE(s.role, t.role) = '${role}'`);
    }

    // 📌 เงื่อนไขกรองห้อง (เช่น SC2-211)
    if (room && room !== "allroom") {
        whereClause.push(`r.room_name = '${room}'`);
    }

    // 📌 เงื่อนไขกรองวันที่ (วัน/เดือน/ปี)
    let dateFormat = "DATE_FORMAT(rr.used_date, '%d/%m/%Y')"; // Default: วัน/เดือน/ปี
    if (dateFilter === "months") {
        dateFormat = "DATE_FORMAT(rr.used_date, '%m/%Y')"; // เดือน/ปี
    } else if (dateFilter === "years") {
        dateFormat = "DATE_FORMAT(rr.used_date, '%Y')"; // ปี
    }

    // 🛠 สร้างคำสั่ง SQL ตามเงื่อนไขที่เลือก
    const sql = `
        SELECT 
            ${dateFormat} as date,
            CONCAT_WS('-', rr.start_time, rr.end_time) as time,
            r.room_name as room,
            COALESCE(s.full_name, t.full_name) as name,
            COALESCE(s.email, t.email) as email,
            COALESCE(s.role, t.role) as role
        FROM room_request as rr
        LEFT JOIN room as r ON r.room_id = rr.room_id
        LEFT JOIN student AS s ON s.student_id = rr.student_id
        LEFT JOIN teacher AS t ON t.teacher_id = rr.teacher_id
        ${whereClause.length > 0 ? "WHERE " + whereClause.join(" AND ") : ""}
        ORDER BY rr.used_date DESC;
    `;

    // 📌 Query ข้อมูลจาก Database
    connection.query(sql, (err, results) => {
        if (err) {
            console.error("❌ Error:", err);
            res.status(500).send(err);
            return;
        }
        console.log("✅ ดึงข้อมูลสำเร็จ:", results);
        res.json(results);
    });
});




app.get("/TableRoomBooked", async (req, res) => {
    let roomName = req.query.room || "allroom"; 
    console.log("API Received Request for Room:", roomName); // Debug

    let sql = `
        SELECT 
            r.room_name,
            r.floor,
            r.room_id,
            rt.type_name,
            COUNT(rr.room_id) AS total 
        FROM room_request AS rr 
        JOIN room AS r ON rr.room_id = r.room_id
        JOIN room_type AS rt ON r.room_type_id = rt.room_type_id
    `;

    let params = [];

    // เพิ่มเงื่อนไขถ้าเลือกห้องใดห้องหนึ่ง
    if (roomName !== "allroom") {
        sql += ` WHERE r.room_name = ?`;
        params.push(roomName);
    }

    sql += ` GROUP BY r.room_name, r.floor, r.room_id, rt.type_name ORDER BY total DESC;`;

    connection.query(sql, params, (error, results) => {
        if (error) {
            console.error("Error fetching room data:", error);
            res.status(500).send("Internal Server Error");
        } else {
            console.log("Raw Database Response:", results); // Debug ค่าที่ได้จาก DB
            res.json(results); // ส่งค่ากลับไปให้ frontend
        }
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