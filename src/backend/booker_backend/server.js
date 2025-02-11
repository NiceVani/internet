const express = require("express");
const session = require("express-session"); // ✅ ใช้ express-session
const connection = require("./db"); // นำเข้าการเชื่อมต่อฐานข้อมูล
const cors = require("cors");
const { Server } = require("socket.io");
const http = require("http");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }, // อนุญาตให้เชื่อมต่อจากทุกที่
});

// ✅ Middleware ควรอยู่ข้างบนสุด
app.use(express.json()); // รองรับ JSON request body
// ✅ ปรับ CORS ให้รองรับ Cookie และ Credentials
app.use(cors({
    origin: "http://localhost:5501",  // ✅ เปลี่ยนเป็นพอร์ตของ Frontend
    credentials: true  // ✅ ต้องเปิดเพื่อให้เบราว์เซอร์ส่ง Cookie
}));

// ✅ ตั้งค่า Session
app.use(session({
    secret: "supersecretkey",
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,  // ❌ ต้องเป็น false ถ้าใช้ HTTP (true เฉพาะ HTTPS)
        httpOnly: true,
        sameSite: "lax",  // ✅ เปลี่ยนเป็น "lax" หรือ "none" ถ้าใช้ HTTPS
        maxAge: 3600000  // ✅ อายุ 1 ชั่วโมง
    }
}));



// ✅ API ล็อกอิน
app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        const [users] = await connection.promise().query(
            "SELECT * FROM Users_accounts WHERE Username = ? AND Password = ?",
            [username, password]
        );

        if (users.length === 0) {
            return res.status(401).json({ error: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" });
        }

        const user = users[0];

        // ✅ ค้นหาในตาราง Student หรือ Teacher
        const [studentResults] = await connection.promise().query(
            "SELECT * FROM Student_information WHERE Student_ID = ?",
            [user.Username]
        );

        if (studentResults.length > 0) {
            req.session.user = { role: "นิสิต", data: studentResults[0] };
            req.session.save((err) => {
                if (err) {
                    console.error("❌ เกิดข้อผิดพลาดในการบันทึกเซสชัน:", err);
                    return res.status(500).json({ error: "บันทึกเซสชันล้มเหลว" });
                }
                console.log("✅ เซสชันนิสิตถูกบันทึก:", req.session);
                res.cookie("connect.sid", req.sessionID, { httpOnly: true, sameSite: "lax" }); // ✅ ส่ง Cookie กลับ
                return res.json({ success: true, role: "นิสิต" });
            });
            return;
        }

        const [teacherResults] = await connection.promise().query(
            "SELECT * FROM Teacher_information WHERE Teacher_ID = ?",
            [user.Username]
        );

        if (teacherResults.length > 0) {
            req.session.user = { role: "อาจารย์", data: teacherResults[0] };
            req.session.save((err) => {
                if (err) {
                    console.error("❌ เกิดข้อผิดพลาดในการบันทึกเซสชัน:", err);
                    return res.status(500).json({ error: "บันทึกเซสชันล้มเหลว" });
                }
                console.log("✅ เซสชันอาจารย์ถูกบันทึก:", req.session);
                res.cookie("connect.sid", req.sessionID, { httpOnly: true, sameSite: "lax" }); // ✅ ส่ง Cookie กลับ
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
        return res.json(req.session.user);
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
app.use(cors({
    origin: "http://localhost:5501",  // ✅ เปลี่ยนเป็นพอร์ตของ Frontend
    credentials: true,  // ✅ ต้องเปิดเพื่อให้เบราว์เซอร์ส่ง Cookie
    allowedHeaders: ["Content-Type", "Authorization"],  // ✅ อนุญาต Headers ที่ใช้
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]  // ✅ อนุญาต Methods ที่ต้องใช้
}));



// 📌 ดึงข้อมูลตารางเรียน
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

app.get("/userDetails/:username", async (req, res) => {
    const { username } = req.params;

    try {
        // ค้นหาในตาราง Student_information
        const [studentResults] = await connection.promise().query(
            "SELECT * FROM Student_information WHERE Student_ID = ?",
            [username]
        );

        if (studentResults.length > 0) {
            console.log("✅ พบข้อมูลนิสิต:", studentResults[0]);
            return res.json({ role: "นิสิต", data: studentResults[0] });
        }

        // ค้นหาในตาราง Teacher_information
        const [teacherResults] = await connection.promise().query(
            "SELECT * FROM Teacher_information WHERE Teacher_ID = ?",
            [username]
        );

        if (teacherResults.length > 0) {
            console.log("✅ พบข้อมูลอาจารย์:", teacherResults[0]);
            return res.json({ role: "อาจารย์", data: teacherResults[0] });
        }

        // ถ้าไม่พบข้อมูล
        res.status(404).json({ error: "ไม่พบข้อมูลผู้ใช้" });

    } catch (err) {
        console.error("❌ เกิดข้อผิดพลาด:", err);
        res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูล" });
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



app.get("/getBrokenEquipments", async (req, res) => {
    if (!req.session.user || !req.session.user.data.Student_ID) {
        return res.status(401).json({ error: "กรุณาเข้าสู่ระบบ" });
    }

    const studentId = req.session.user.data.Student_ID;

    try {
        const query = `
            SELECT 
                DATE_FORMAT(eb.Repair_date, '%Y-%m-%d %H:%i:%s') AS Repair_date, 
                ei.Equipments_name, 
                eb.Damaged_details, 
                eb.Rooms_ID, 
                ai.Name AS Admin_Name,
                eb.Repair_status
            FROM Equipments_list_brokened eb
            JOIN Equipments_list_information ei ON eb.Equipments_ID = ei.Equipments_ID
            JOIN Admin_information ai ON eb.Admin_ID = ai.Admin_ID
            WHERE eb.Identify_ID = ?  
            ORDER BY eb.Repair_date DESC;
        `;

        const [results] = await connection.promise().query(query, [studentId]);
        res.json(results);
    } catch (err) {
        console.error("❌ เกิดข้อผิดพลาดในการดึงข้อมูล:", err);
        res.status(500).json({ error: "ดึงข้อมูลล้มเหลว" });
    }
});




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

app.get('/user', (req, res) => {
    const query = "SELECT si.Name, si.Student_ID, si.Department ,si.Phone_number ,si.Faculty, si.Study_year, si.Phone_number, si.email, COUNT(rlr.Identify_ID) AS Status FROM Rooms_list_requests rlr JOIN Student_information si ON rlr.Identify_ID = si.Student_ID GROUP BY si.Student_ID ORDER BY Status DESC;";
     connection.query( query,(err, results) => {
         if (err) {
             console.error('❌ เกิดข้อผิดพลาด:', err);
             res.status(500).send(err);
             return;
         }
         console.log('✅ ดึงข้อมูลสำเร็จ:', results);
         res.json(results);
     });
 });


 //Userของอาจารย์
 app.get("/userTeacher", async (req, res) => {
    try {
        // คิวรีข้อมูลจากตาราง Schedule_time
        const [results] = await connection.promise().query("SELECT * FROM Teacher_information");

        console.log("✅ ดึงข้อมูลสำเร็จ:", results.length);
        res.json(results); // ส่งข้อมูลกลับไปในรูปแบบ JSON
    } catch (err) {
        console.error("❌ เกิดข้อผิดพลาด:", err);
        res.status(500).json({ error: "ดึงข้อมูลล้มเหลว" });
    }
});

//Login
app.get("/userAccount", async (req, res) => {
    try {
        // ดึงข้อมูลจากตาราง Users_accounts รวม Student_ID
        const [results] = await connection.promise().query(
            "SELECT * FROM Users_accounts;"
        );

        console.log("✅ ดึงข้อมูลบัญชีผู้ใช้สำเร็จ:", results.length);
        res.json(results); // ส่งข้อมูลกลับไปในรูปแบบ JSON
    } catch (err) {
        console.error("❌ เกิดข้อผิดพลาด:", err);
        res.status(500).json({ error: "ดึงข้อมูลล้มเหลว" });
    }
});

 
app.get('/roomdetail', (req, res) => {
     const query ="SELECT rli.Rooms_name AS Name,rli.Floors, rli.Rooms_ID, SUM(CASE WHEN rlr.Requests_status = 'อนุมัติ' THEN 1 ELSE 0 END) AS Approved_Count FROM Rooms_list_information rli LEFT JOIN Rooms_list_requests rlr ON rli.Rooms_ID = rlr.Rooms_ID GROUP BY rli.Rooms_ID, rli.Rooms_name, rli.Floors ORDER BY Approved_Count DESC;"
     connection.query( query,(err, results) => {
         if (err) {
             console.error('❌ เกิดข้อผิดพลาด:', err);
             res.status(500).send(err);
             return;
         }
         console.log('✅ ดึงข้อมูลสำเร็จ:', results);
         res.json(results);
    });
 });

app.get('/Rooms_list_requests', (req, res) => {
     connection.query('SELECT * FROM Rooms_list_requests', (err, results) => {
         if (err) {
             console.error('❌ Error:', err);
             res.status(500).send(err);
             return;
         }
         console.log('✅ ดึงข้อมูลสำเร็จจาก Rooms_list_requests:', results);
         res.json(results);
     });
 });


 app.get('/data/Student_information', (req, res) => {
     connection.query('SELECT * FROM Student_information', (err, results) => {
         if (err) {
            console.error('❌ Error:', err);
             res.status(500).send(err);
             return;
         }
         console.log('✅ ดึงข้อมูลสำเร็จจาก Student_information:', results);
         res.json(results);
     });
 });

 app.get('/data/Teacher_information', (req, res) => {
     connection.query('SELECT * FROM Teacher_information', (err, results) => {
         if (err) {
             console.error('❌ Error:', err);
             res.status(500).send(err);
             return;
         }
         console.log('✅ ดึงข้อมูลสำเร็จจาก Teacher_information:', results);
         res.json(results);
     });
 });



//ดึงเฉพาะข้อมูลผู้ที่ล็อคอินอยู่
// ✅ API ดึงข้อมูลการจองของผู้ใช้ พร้อมรวมข้อมูลห้อง
app.get("/userBookings/:studentId", async (req, res) => {
    const { studentId } = req.params;

    console.log("🎯 studentId ที่รับมา:", studentId);

    try {
        const [results] = await connection.promise().query(
            `SELECT 
                rlr.Rooms_requests_ID, 
                rlr.Rooms_ID, 
                rli.Rooms_name, 
                rlr.Used_date, 
                rlr.Start_time, 
                rlr.End_time, 
                rlr.Requests_status, 
                rlr.Requests_types
             FROM Rooms_list_requests rlr
             JOIN Rooms_list_information rli ON rlr.Rooms_ID = rli.Rooms_ID
             WHERE rlr.Identify_ID = ?`, 
            [studentId]
        );

        console.log(`✅ ดึงข้อมูลการจองของ ${studentId} สำเร็จ:`, results);
        res.json(results);
    } catch (err) {
        console.error("❌ เกิดข้อผิดพลาด:", err);
        res.status(500).json({ error: "ดึงข้อมูลล้มเหลว" });
    }
});
// ✅ API ยกเลิกการจอง (เฉพาะสถานะ "รอดำเนินการ")
// ✅ API ลบการจอง (เฉพาะที่สถานะเป็น "รอดำเนินการ" เท่านั้น)
app.delete("/cancelBooking/:requestId", async (req, res) => {
    const { requestId } = req.params;
    console.log(`🛑 กำลังพยายามลบการจอง ID: ${requestId}`);

    try {
        // ตรวจสอบว่ามีข้อมูลอยู่จริง
        const [rows] = await connection.promise().query(
            "SELECT * FROM Rooms_list_requests WHERE Rooms_requests_ID = ? AND Requests_status = 'รอดำเนินการ'",
            [requestId]
        );

        console.log("🔍 ค้นหาข้อมูล:", rows);

        if (rows.length === 0) {
            console.log("❌ ไม่มีข้อมูลการจองที่สามารถลบได้");
            return res.status(400).json({ error: "ไม่มีข้อมูลการจองที่สามารถลบได้" });
        }

        // ลบข้อมูลออกจากฐานข้อมูล
        await connection.promise().query(
            "DELETE FROM Rooms_list_requests WHERE Rooms_requests_ID = ?",
            [requestId]
        );

        console.log(`✅ ลบข้อมูลสำเร็จ! ID: ${requestId}`);
        res.json({ success: true, message: "ยกเลิกการจองสำเร็จ!" });
    } catch (err) {
        console.error("❌ ERROR:", err);
        res.status(500).json({ error: "ลบข้อมูลล้มเหลว" });
    }
});

// ตัวอย่างการตั้งค่า route สำหรับการลบการจอง
app.delete("/cancelBooking/:id", async (req, res) => {
    const requestId = req.params.id;  // รับค่าจาก URL (requestId)
    try {
        const query = `DELETE FROM booking_table WHERE Rooms_requests_ID = ?`; // แก้ไขชื่อ table ตามที่คุณใช้
        const result = await db.promise().query(query, [requestId]);
        
        if (result[0].affectedRows > 0) {
            res.status(200).json({ message: "ยกเลิกการจองสำเร็จ" });
        } else {
            res.status(404).json({ error: "ไม่พบการจองที่ต้องการลบ" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "ลบข้อมูลล้มเหลว" });
    }
});






// ✅ เริ่มเซิร์ฟเวอร์
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
})