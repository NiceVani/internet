const express = require("express");
const connection = require("./db"); // นำเข้าการเชื่อมต่อฐานข้อมูล
const mysql = require("mysql2");
const fs = require("fs");
const cors = require("cors"); // เพิ่ม cors
const { error } = require("console");
const util = require("util");
const path = require("path");

const app = express();
app.use(express.json()); // รองรับ JSON request body
app.use(cors());
// 📌 ดึงข้อมูลจากตาราง (เปลี่ยน `rooms` เป็นชื่อตารางของคุณ)
app.get("/rooms", (req, res) => {
  connection.query("SELECT * FROM room", (err, results) => {
    if (err) {
      console.error("❌ เกิดข้อผิดพลาด:", err);
      res.status(500).send(err);
      return;
    }
    console.log("✅ ดึงข้อมูลสำเร็จ:", results);
    res.json(results);
  });
});

app.get("/brokendEquipment", (req, res) => {
  const sql = `
    SELECT e.equipment_name AS name , COUNT(eb.equipment_id) AS total
    FROM equipment_brokened AS eb
    JOIN equipment AS e ON e.equipment_id = eb.equipment_id
    GROUP BY eb.equipment_id 
    ORDER BY total DESC 
    LIMIT 3
  `;
  connection.query(sql, (err, results) => {
    if (err) {
      console.error("❌ เกิดข้อผิดพลาด:", err);
      res.status(500).send(err);
      return;
    }
    console.log("✅ ดึงข้อมูลสำเร็จ:", results);
    res.json(results);
  });
});

app.get("/borrowEquipment", (req, res) => {
  connection.query(
    `SELECT  rrm.equipment_id,e.equipment_name as name ,SUM(rrm.request_quantity) as total FROM room_request_equipment as rrm
LEFT JOIN equipment as e ON e.equipment_id = rrm.equipment_id
LEFT JOIN room as r ON r.room_id = rrm.room_id
GROUP BY rrm.equipment_id,e.equipment_name
ORDER BY total DESC LIMIT 3 ;`,
    (err, results) => {
      if (err) {
        console.error("❌ เกิดข้อผิดพลาด:", err);
        res.status(500).send(err);
        return;
      }
      console.log("✅ ดึงข้อมูลสำเร็จ:", results);
      res.json(results);
    }
  );
});
app.get("/mostroomalldata", (req, res) => {
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
    WHERE rr.request_status = 'อนุมัติ'
    GROUP BY rr.room_id, COALESCE(s.department, t.department)
) AS subquery
GROUP BY room_id
ORDER BY room_id;


`;
  connection.query(query, (err, results) => {
    if (err) {
      console.error("❌ เกิดข้อผิดพลาด:", err);
      res.status(500).send(err);
      return;
    }
    console.log("✅ ดึงข้อมูลสำเร็จ:", results);
    res.json(results);
  });
});
app.get("/daysroomday", (req, res) => {
  const query = `SELECT 
    DAYNAME(rr.used_date) AS time,  -- ชื่อวัน
    COUNT(rr.room_request_id) AS total_requests  -- นับจำนวนคำขอใช้ห้อง
FROM room_request AS rr
LEFT JOIN student AS s ON rr.student_id = s.student_id
LEFT JOIN teacher AS t ON rr.teacher_id = t.teacher_id
WHERE rr.request_status = 'อนุมัติ'
GROUP BY time
ORDER BY FIELD(time, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday');
`;
  connection.query(query, (err, results) => {
    if (err) {
      console.error("❌ เกิดข้อผิดพลาด:", err);
      res.status(500).send(err);
      return;
    }
    console.log("✅ ดึงข้อมูลสำเร็จ:", results);
    res.json(results);
  });
});
app.get("/daysroomweek", (req, res) => {
  const query = `SELECT 
    WEEK(rr.used_date, 1) AS time,  -- นับสัปดาห์โดยเริ่มจากวันอาทิตย์
    COUNT(rr.room_request_id) AS total_requests  -- นับจำนวนคำขอใช้ห้องในแต่ละสัปดาห์
FROM room_request AS rr
LEFT JOIN student AS s ON rr.student_id = s.student_id
LEFT JOIN teacher AS t ON rr.teacher_id = t.teacher_id
WHERE WEEK(rr.used_date, 1) BETWEEN 1 AND 48  -- กรองเฉพาะสัปดาห์ที่ 1-48
AND rr.request_status = 'อนุมัติ'
GROUP BY time
ORDER BY time;

`;
  connection.query(query, (err, results) => {
    if (err) {
      console.error("❌ เกิดข้อผิดพลาด:", err);
      res.status(500).send(err);
      return;
    }
    console.log("✅ ดึงข้อมูลสำเร็จ:", results);
    res.json(results);
  });
});
app.get("/daysroommount", (req, res) => {
  const query = `SELECT 
    MONTH(rr.used_date) AS time,  -- นับเดือนจากวันที่ใช้ห้อง
    COUNT(rr.room_request_id) AS total_requests  -- นับจำนวนคำขอใช้ห้องในแต่ละเดือน
FROM room_request AS rr
LEFT JOIN student AS s ON rr.student_id = s.student_id
LEFT JOIN teacher AS t ON rr.teacher_id = t.teacher_id
WHERE MONTH(rr.used_date) BETWEEN 1 AND 12
AND rr.request_status = 'อนุมัติ'  -- กรองเฉพาะเดือนที่ 1-12
GROUP BY time
ORDER BY time;

`;
  connection.query(query, (err, results) => {
    if (err) {
      console.error("❌ เกิดข้อผิดพลาด:", err);
      res.status(500).send(err);
      return;
    }
    console.log("✅ ดึงข้อมูลสำเร็จ:", results);
    res.json(results);
  });
});
app.get("/daysroomyear", (req, res) => {
  const query = `SELECT 
    YEAR(rr.used_date) AS time,  -- นับปีจากวันที่ใช้ห้อง
    COUNT(rr.room_request_id) AS total_requests  -- นับจำนวนคำขอใช้ห้องในแต่ละปี
FROM room_request AS rr
LEFT JOIN student AS s ON rr.student_id = s.student_id
LEFT JOIN teacher AS t ON rr.teacher_id = t.teacher_id
WHERE YEAR(rr.used_date) BETWEEN 2020 AND 2025 
AND rr.request_status = 'อนุมัติ' -- กรองช่วงปีที่ต้องการ
GROUP BY time
ORDER BY time;

`;
  connection.query(query, (err, results) => {
    if (err) {
      console.error("❌ เกิดข้อผิดพลาด:", err);
      res.status(500).send(err);
      return;
    }
    console.log("✅ ดึงข้อมูลสำเร็จ:", results);
    res.json(results);
  });
});
app.get("/detailsdaysroom", (req, res) => {
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
`;
  connection.query(query, (err, results) => {
    if (err) {
      console.error("❌ เกิดข้อผิดพลาด:", err);
      res.status(500).send(err);
      return;
    }
    console.log("✅ ดึงข้อมูลสำเร็จ:", results);
    res.json(results);
  });
});
app.get("/useralldata", (req, res) => {
  const query = `SELECT 
    COALESCE(s.full_name, t.full_name) AS name,
    COUNT(rr.room_request_id) AS stat
FROM room_request AS rr
LEFT JOIN student AS s ON rr.student_id = s.student_id
LEFT JOIN teacher AS t ON rr.teacher_id = t.teacher_id
GROUP BY name
ORDER BY stat DESC LIMIT 3 ;
`;
  connection.query(query, (err, results) => {
    if (err) {
      console.error("❌ เกิดข้อผิดพลาด:", err);
      res.status(500).send(err);
      return;
    }
    console.log("✅ ดึงข้อมูลสำเร็จ:", results);
    res.json(results);
  });
});

app.get("/room_request", (req, res) => {
  connection.query(
    "SELECT * FROM room_request ORDER BY submitted_time ASC",
    (err, results) => {
      if (err) {
        console.error("❌ Error:", err);
        res.status(500).send(err);
        return;
      }
      console.log("✅ ดึงข้อมูลสำเร็จจาก Rooms_list_requests:", results);
      res.json(results);
    }
  );
});

app.get("/student", (req, res) => {
  connection.query("SELECT * FROM student", (err, results) => {
    if (err) {
      console.error("❌ Error:", err);
      res.status(500).send(err);
      return;
    }
    console.log("✅ ดึงข้อมูลสำเร็จจาก Student_information:", results);
    res.json(results);
  });
});

app.get("/teacher", (req, res) => {
  connection.query("SELECT * FROM teacher", (err, results) => {
    if (err) {
      console.error("❌ Error:", err);
      res.status(500).send(err);
      return;
    }
    console.log("✅ ดึงข้อมูลสำเร็จจาก Teacher_information:", results);
    res.json(results);
  });
});

app.get("/equipment_brokened", (req, res) => {
  connection.query("SELECT * FROM equipment_brokened", (err, results) => {
    if (err) {
      console.error("❌ Error:", err);
      res.status(500).send(err);
      return;
    }
    console.log("✅ ดึงข้อมูลสำเร็จจาก equipment_brokened:", results);
    res.json(results);
  });
});

app.get("/equipment", (req, res) => {
  connection.query("SELECT * FROM equipment", (err, results) => {
    if (err) {
      console.error("❌ Error:", err);
      res.status(500).send(err);
      return;
    }
    console.log("✅ ดึงข้อมูลสำเร็จจาก equipment:", results);
    res.json(results);
  });
});

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

app.get("/room_request_participant", (req, res) => {
  connection.query("SELECT * FROM room_request_participant", (err, results) => {
    if (err) {
      console.error("❌ Error:", err);
      res.status(500).send(err);
      return;
    }
    console.log("✅ ดึงข้อมูลสำเร็จจาก room_request_participant:", results);
    res.json(results);
  });
});

app.get("/user", (req, res) => {
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
            r.room_name AS room,
            COUNT(*) AS stat
        FROM room_request AS rr
        LEFT JOIN student AS s ON rr.student_id = s.student_id
        LEFT JOIN teacher AS t ON rr.teacher_id = t.teacher_id
        LEFT JOIN room AS r ON r.room_id = rr.room_id
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

app.get("/roomdetail", (req, res) => {
  const query =
    "SELECT rli.Rooms_name AS Name,rli.Floors, rli.Rooms_ID, SUM(CASE WHEN rlr.Requests_status = 'อนุมัติ' THEN 1 ELSE 0 END) AS Approved_Count FROM Rooms_list_information rli LEFT JOIN Rooms_list_requests rlr ON rli.Rooms_ID = rlr.Rooms_ID GROUP BY rli.Rooms_ID, rli.Rooms_name, rli.Floors ORDER BY Approved_Count;";
  connection.query(query, (err, results) => {
    if (err) {
      console.error("❌ เกิดข้อผิดพลาด:", err);
      res.status(500).send(err);
      return;
    }
    console.log("✅ ดึงข้อมูลสำเร็จ:", results);
    res.json(results);
  });
});

app.post("/updateStatus", (req, res) => {
  const { requestId, status } = req.body;

  const sql =
    "UPDATE room_request SET request_status = ? WHERE room_request_id = ?";

  connection.query(sql, [status, requestId], (err, results) => {
    if (err) {
      console.error("❌ Error updating status:", err);
      return res.status(500).json({ message: "Failed to update status" });
    }

    if (results.affectedRows === 0) {
      // ถ้าไม่มีแถวไหนถูกอัปเดต แสดงว่า requestId อาจไม่ถูกต้อง
      return res.status(404).json({ message: "Request ID not found" });
    }

    console.log(`✅ Status updated for Request ID ${requestId}: ${status}`);
    res.status(200).json({ message: "Status updated successfully" });
  });
});

app.get("/TableBorrowEquipment", (req, res) => {
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
      console.error("❌ Error:", err);
      res.status(500).send(err);
      return;
    }
    console.log("✅ ดึงข้อมูลสำเร็จจาก TableBorrowEquipment:", results);
    res.json(results);
  });
});

app.get("/TableRoomListRequest", (req, res) => {
  // 🛠 สร้างคำสั่ง SQL ตามเงื่อนไขที่เลือก
  const sql = `
        SELECT 
            DATE_FORMAT(rr.used_date, '%Y/%m/%d') as date,
            CONCAT_WS('-', rr.start_time, rr.end_time) as time,
            r.room_name as room,
            COALESCE(s.full_name, t.full_name) as name,
            COALESCE(s.email, t.email) as email,
            COALESCE(s.role, t.role) as role
        FROM room_request as rr
        LEFT JOIN room as r ON r.room_id = rr.room_id
        LEFT JOIN student AS s ON s.student_id = rr.student_id
        LEFT JOIN teacher AS t ON t.teacher_id = rr.teacher_id
        ORDER BY rr.used_date DESC, rr.end_time DESC;
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
        WHERE rr.request_status = 'อนุมัติ'
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

app.get("/TableBrokenEqipment", (req, res) => {
  connection.query(
    `SELECT
    e.equipment_name as name,
    r.room_name as room,
    em.stock_quantity as totalequipment,
    COUNT(*) as totalbrokend,
    (em.stock_quantity - COUNT(*)) as balance
FROM equipment_brokened as eb
LEFT JOIN equipment as e ON e.equipment_id = eb.equipment_id
LEFT JOIN room as r ON eb.room_id = r.room_id
LEFT JOIN equipment_management as em ON em.equipment_id = eb.equipment_id
GROUP BY e.equipment_name, r.room_name, em.stock_quantity
ORDER BY r.room_name, e.equipment_name;

 `,
    (err, results) => {
      if (err) {
        console.error("❌ Error:", err);
        res.status(500).send(err);
        return;
      }
      console.log("✅ ดึงข้อมูลสำเร็จจาก Teacher_information:", results);
      res.json(results);
    }
  );
});

app.get("/DataEquipment", (req, res) => {
  connection.query(
    `SELECT 
    name, 
    room, 
    SUM(totalequipment) AS totalequipment, 
    SUM(totalborrow) AS totalborrow, 
    SUM(totalbrokend) AS totalbrokend, 
    (SUM(totalequipment) - SUM(totalbrokend)) AS balance
FROM (
    -- ตารางอุปกรณ์ชำรุด
    SELECT
        e.equipment_name AS name,
        r.room_name AS room,
        COALESCE(em.stock_quantity, 0) AS totalequipment,
        0 AS totalborrow, -- ไม่มีการยืมในชุดข้อมูลนี้
        COUNT(eb.equipment_id) AS totalbrokend,
        0 AS balance -- กำหนดเป็น 0 เพราะคำนวณ balance ทีหลัง
    FROM equipment_brokened AS eb
    LEFT JOIN equipment AS e ON e.equipment_id = eb.equipment_id
    LEFT JOIN equipment_management AS em ON em.equipment_id = eb.equipment_id
    LEFT JOIN room AS r ON em.room_id = r.room_id -- เชื่อมกับ room จาก equipment_management
    GROUP BY e.equipment_name, r.room_name, em.stock_quantity

    UNION ALL

    -- ตารางอุปกรณ์ที่ถูกยืม
    SELECT 
        e.equipment_name AS name, 
        r.room_name AS room, 
        COALESCE(MAX(em.stock_quantity), 0) AS totalequipment,  
        COALESCE(SUM(rre.request_quantity), 0) AS totalborrow,
        0 AS totalbrokend, -- ไม่มีการชำรุดในชุดข้อมูลนี้
        0 AS balance -- กำหนดเป็น 0 เพราะคำนวณ balance ทีหลัง
    FROM room_request_equipment AS rre
    LEFT JOIN equipment AS e ON rre.equipment_id = e.equipment_id
    LEFT JOIN equipment_management AS em ON rre.equipment_id = em.equipment_id
    LEFT JOIN room AS r ON em.room_id = r.room_id -- ดึงชื่อห้องจาก equipment_management
    LEFT JOIN room_request AS rr ON rr.room_request_id = rre.room_request_id
    WHERE rr.request_status = 'อนุมัติ'
    GROUP BY e.equipment_name, r.room_name, em.stock_quantity
) AS combined
GROUP BY name, room;

`,
    (err, results) => {
      if (err) {
        console.error("❌ Error:", err);
        res.status(500).send(err);
        return;
      }
      console.log("✅ ดึงข้อมูลสำเร็จจาก Teacher_information:", results);
      res.json(results);
    }
  );
});

app.get("/mostreport", (req, res) => {
  const query = `SELECT 
    COALESCE(s.full_name, t.full_name) AS name,
    COALESCE(s.student_id,t.teacher_id) as id,
    COUNT(eb.equipment_id) AS stat
FROM equipment_brokened AS eb
LEFT JOIN student AS s ON eb.student_id = s.student_id
LEFT JOIN teacher AS t ON eb.teacher_id = t.teacher_id
GROUP BY name,id
ORDER BY stat DESC LIMIT 3 ;
`;
  connection.query(query, (err, results) => {
    if (err) {
      console.error("❌ เกิดข้อผิดพลาด:", err);
      res.status(500).send(err);
      return;
    }
    console.log("✅ ดึงข้อมูลสำเร็จ:", results);
    res.json(results);
  });
});

app.get("/reportTable", (req, res) => {
  const query = `SELECT
	COALESCE(s.student_id,t.teacher_id) as id,
    COALESCE(s.full_name,t.full_name) as name,
    COALESCE(s.email,t.email) as email,
    COUNT(COALESCE(s.student_id,t.teacher_id)) as stat ,
    COALESCE(s.role,t.role) as role
FROM equipment_brokened as eb
LEFT JOIN student as s on s.student_id = eb.student_id
LEFT JOIN teacher as t  on t.teacher_id = eb.teacher_id
GROUP BY id,name,email,role ;
`;
  connection.query(query, (err, results) => {
    if (err) {
      console.error("❌ เกิดข้อผิดพลาด:", err);
      res.status(500).send(err);
      return;
    }
    console.log("✅ ดึงข้อมูลสำเร็จ:", results);
    res.json(results);
  });
});

//box 1
app.get("/box1", (req, res) => {
  const query = `SELECT  
    r.room_name AS name, 
    COUNT(rr.room_id) AS room_count,
    ROUND((COUNT(rr.room_id) * 100.0) / (SELECT COUNT(*) FROM room_request), 2) AS percentage
FROM room_request AS rr
JOIN room AS r ON r.room_id = rr.room_id
GROUP BY name
ORDER BY percentage DESC ;
 ;
`;
  connection.query(query, (err, results) => {
    if (err) {
      console.error("❌ เกิดข้อผิดพลาด:", err);
      res.status(500).send(err);
      return;
    }
    console.log("✅ ดึงข้อมูลสำเร็จ:", results);
    res.json(results);
  });
});

//box 2
app.get("/box2", (req, res) => {
  const query = `SELECT  
    e.equipment_name AS name, 
    COUNT(eb.equipment_id) AS equipment_count,
    ROUND((COUNT(eb.equipment_id) * 100.0) / (SELECT COUNT(*) FROM equipment_brokened), 2) AS percentage
FROM equipment_brokened AS eb
JOIN equipment AS e ON e.equipment_id = eb.equipment_id
GROUP BY name
ORDER BY percentage DESC ;

`;
  connection.query(query, (err, results) => {
    if (err) {
      console.error("❌ เกิดข้อผิดพลาด:", err);
      res.status(500).send(err);
      return;
    }
    console.log("✅ ดึงข้อมูลสำเร็จ:", results);
    res.json(results);
  });
});

//box3
app.get("/box3", (req, res) => {
  const query = `SELECT  
    CONCAT(rr.start_time ,'-',rr.end_time) as time,
    COUNT(*) AS count_time,
    (COUNT(*) * 100.0 / (SELECT COUNT(*) FROM room_request)) AS percentage
FROM room_request AS rr
GROUP BY time
ORDER BY count_time DESC;`;
  connection.query(query, (err, results) => {
    if (err) {
      console.error("❌ เกิดข้อผิดพลาด:", err);
      res.status(500).send(err);
      return;
    }
    console.log("✅ ดึงข้อมูลสำเร็จ:", results);
    res.json(results);
  });
});
//box 4
app.get("/box4", (req, res) => {
  const query = `SELECT 
    COALESCE(s.department, t.department) AS name,
    COUNT(*) AS d_count,
    ROUND((COUNT(*) * 100.0) / (SELECT COUNT(*) FROM room_request), 2) AS percentage
FROM room_request AS rr
LEFT JOIN student AS s ON s.student_id = rr.student_id
LEFT JOIN teacher AS t ON t.teacher_id = rr.teacher_id
GROUP BY name
ORDER BY percentage DESC;


`;
  connection.query(query, (err, results) => {
    if (err) {
      console.error("❌ เกิดข้อผิดพลาด:", err);
      res.status(500).send(err);
      return;
    }
    console.log("✅ ดึงข้อมูลสำเร็จ:", results);
    res.json(results);
  });
});

app.get("/box42", (req, res) => {
  const query = `SELECT 
    COALESCE(s.department, t.department) AS name,
    COUNT(*) AS d_count

FROM room_request AS rr
LEFT JOIN student AS s ON s.student_id = rr.student_id
LEFT JOIN teacher AS t ON t.teacher_id = rr.teacher_id
WHERE rr.request_status = 'อนุมัติ'
GROUP BY name
ORDER BY name
;


`;
  connection.query(query, (err, results) => {
    if (err) {
      console.error("❌ เกิดข้อผิดพลาด:", err);
      res.status(500).send(err);
      return;
    }
    console.log("✅ ดึงข้อมูลสำเร็จ:", results);
    res.json(results);
  });
});

app.get("/detailsPop", (req, res) => {
  const query = `
                    SELECT
                        rrp.room_request_id as requestID,
                        r.room_name as roombooking,
                        concat(rr.start_time,'-',rr.end_time) as timebooking,
                        COALESCE(s.full_name,t.full_name) as name,
                        COALESCE(s.student_id,t.teacher_id) as id,
                        COALESCE(s.email,t.email) as email,
                        COALESCE(s.phone_number,t.phone_number) as phone_number,
                        COALESCE(s.department,t.department) as department,
                        rr.request_reason as bookingreason,
                        rr.detail_request_reason as detailbookingreason,
                        rrp.role as role
                    FROM room_request_participant as rrp
                    LEFT JOIN room_request as rr on rr.room_request_id = rrp.room_request_id
                    LEFT JOIN teacher as t on t.teacher_id = COALESCE(rrp.teacher_id,rr.teacher_id)
                    LEFT JOIN student as s on s.student_id = COALESCE(rrp.student_id,rr.student_id)
                    LEFT JOIN room as r on r.room_id = rr.room_id
                    WHERE rrp.role
                    ORDER BY requestID
                    ;
                    `;
  connection.query(query, (err, results) => {
    if (err) {
      console.error("❌ เกิดข้อผิดพลาด:", err);
      res.status(500).send(err);
      return;
    }
    console.log("✅ ดึงข้อมูลสำเร็จ:", results);
    res.json(results);
  });
});

app.get("/equipment_brokened", (req, res) => {
  connection.query("SELECT * FROM equipment_brokened", (err, results) => {
    if (err) {
      console.error("❌ Error:", err);
      res.status(500).send(err);
      return;
    }
    console.log("✅ ดึงข้อมูลสำเร็จจาก quipment_brokened:", results);
    res.json(results);
  });
});

// ดึงข้อมูลเหตุผลไม่อนุมัติ
// ดึงรายการ ENUM จากคอลัมน์ reject_reason
app.get("/RejectReasons", (req, res) => {
  const query = `SHOW COLUMNS FROM room_request LIKE 'reject_reason'`;

  connection.query(query, (err, results) => {
    if (err) {
      console.error("❌ ดึงข้อมูล ENUM ไม่สำเร็จ:", err);
      return res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูล" });
    }

    // แปลง ENUM จากข้อมูลดิบ
    const enumString = results[0].Type; // ตัวอย่าง: "enum('เอกสารไม่ครบ','ห้องไม่ว่าง','เวลาซ้ำซ้อน')"
    const enumValues = enumString
      .match(/'([^']+)'/g)
      .map((value) => value.replace(/'/g, ""));

    res.json(enumValues);
  });
});

// บันทึกเหตุผลที่ไม่อนุมัติ
app.post("/submitRejection", (req, res) => {
  const { room_request_id, reject_reason, detail_reject_reason } = req.body;

  const query = `
        UPDATE room_request 
        SET reject_reason = ?, detail_reject_reason = ? 
        WHERE room_request_id = ?
    `;

  connection.query(
    query,
    [reject_reason, detail_reject_reason || "", room_request_id],
    (err) => {
      if (err) {
        console.error("❌ บันทึกข้อมูลไม่สำเร็จ:", err);
        return res.status(500).json({ error: "บันทึกข้อมูลไม่สำเร็จ" });
      }
      res.json({ message: "✅ บันทึกเหตุผลการไม่อนุมัติสำเร็จ" });
    }
  );
});

// 📌 เริ่มเซิร์ฟเวอร์
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
