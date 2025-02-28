const express = require("express");
const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");
const db = require("./db"); // สมมติว่ามีการตั้งค่าการเชื่อมต่อฐานข้อมูลไว้แล้ว

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ตัวอย่างเส้นทางเก็บไฟล์ PDF ที่จะให้ดาวน์โหลด
app.use(
  express.static(path.join(__dirname, "..", "storage", "booking_document"))
);

/**
 * API สร้างไฟล์ PDF สำหรับ Room Request ที่เจาะจงผ่าน roomRequestId
 */
app.post("/generate-pdf", async (req, res) => {
  try {
    const { roomRequestId } = req.body;
    if (!roomRequestId) {
      return res.status(400).json({ error: "roomRequestId is required" });
    }

    // 1) ดึงข้อมูลการจองจากตาราง room_request ตาม roomRequestId
    const [rowsRequest] = await db.query(
      "SELECT * FROM room_request WHERE room_request_id = ?",
      [roomRequestId]
    );
    if (!rowsRequest.length) {
      return res
        .status(404)
        .json({
          error: "ไม่พบข้อมูลการจอง (room_request) ตาม roomRequestId นี้",
        });
    }
    const roomRequest = rowsRequest[0];

    // 2) ดึงข้อมูลผู้มีส่วนร่วม (ผู้ขอใช้ + ผู้เข้าร่วม) จาก room_request_participant
    //    โดย Join กับ student และ teacher เพื่อให้ได้ชื่อ, สาขา, ชั้นปี ฯลฯ
    //    ORDER BY role DESC เพื่อให้ "ผู้ขอใช้" อยู่บรรทัดแรก ๆ
    const [participants] = await db.query(
      `
      SELECT
        rrp.room_request_participant_id,
        rrp.room_request_id,
        rrp.student_id,
        rrp.teacher_id,
        rrp.role,
        COALESCE(s.full_name, t.full_name) AS full_name,
        COALESCE(s.department, t.department) AS department,
        s.study_year,
        s.degree,
        s.phone_number,
        s.email AS student_email,
        t.email AS teacher_email,
        t.role AS teacher_role
      FROM room_request_participant rrp
      LEFT JOIN student s ON rrp.student_id = s.student_id
      LEFT JOIN teacher t ON rrp.teacher_id = t.teacher_id
      WHERE rrp.room_request_id = ?
      ORDER BY
        CASE
          WHEN rrp.role = 'ผู้ขอใช้' THEN 0
          ELSE 1
        END,
        rrp.room_request_participant_id
      `,
      [roomRequestId]
    );

    if (participants.length === 0) {
      return res
        .status(404)
        .json({
          error:
            "ไม่พบข้อมูลผู้ขอใช้หรือผู้เข้าร่วมใน room_request_participant",
        });
    }

    // แยกผู้ขอใช้ (requester) ออกจากผู้เข้าร่วม (attendees)
    const requester = participants.find((p) => p.role === "ผู้ขอใช้");
    const attendees = participants.filter((p) => p.role !== "ผู้ขอใช้");

    if (!requester) {
      return res
        .status(404)
        .json({
          error:
            "ไม่พบผู้ขอใช้ (role = 'ผู้ขอใช้') ใน room_request_participant",
        });
    }

    // 3) เตรียมไฟล์ PDF
    // สร้างโฟลเดอร์ปลายทาง หากยังไม่มี
    const outputDir = path.join(__dirname, "..", "storage", "booking_document");
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // ตั้งชื่อไฟล์ PDF ตาม roomRequestId
    const outputFilePath = path.join(outputDir, `booking_${roomRequestId}.pdf`);

    // สร้าง PDFDocument
    const doc = new PDFDocument({ margin: 30 });
    const writeStream = fs.createWriteStream(outputFilePath);
    doc.pipe(writeStream);

    // ถ้ามีฟอนต์ THSarabunNew ให้ลงทะเบียนใช้งาน
    // (ต้องมีไฟล์ THSarabunNew.ttf ในโปรเจกต์)
    const fontPath = path.join(__dirname, "THSarabunNew.ttf");
    if (fs.existsSync(fontPath)) {
      doc.registerFont("THSarabunNew", fontPath);
      doc.font("THSarabunNew");
    }

    // ใส่โลโก้/ตราครุฑ
    const logoPath = path.join(__dirname, "garuda.jpg");
    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, 30, 10, { width: 50 });
    }

    doc.fontSize(24).text("บันทึกข้อความ", { align: "center" }).moveDown();
    doc.fontSize(16).text("ส่วนราชการ มหาวิทยาลัยนเรศวร..คณะวิทยาศาสตร์..ภาควิชาวิทยาการคอมพิวเตอร์ฯ โทร.3262-3.............",50 );
    doc.fontSize(16).text( "ที่ อว.060304.06/...................................." );
    doc.fontSize(16).text(  "วันที่ ..........11 ก.พ. 2568................................. "   );
    doc.fontSize(16).text(  "เรื่อง ขอใช้ห้อง SC2-311......................................................",{ align: "left" });
    doc.text("เรียน หัวหน้าภาควิชาวิทยาการคอมพิวเตอร์และเทคโนโลยีสารสนเทศ ");

    // 4) พิมพ์ข้อมูลผู้ขอใช้ (requester)
    // หากเป็น student_id != null ก็ถือว่าเป็นนิสิต
    // ถ้าเป็น teacher_id != null ก็ถือว่าเป็นอาจารย์
    let requesterType = "";
    let requesterDepartment = requester.department || "";
    let requesterName = requester.full_name || "";
    let requesterYear = requester.study_year || "";
    let requesterStudentID = requester.student_id || "";
    let requesterPhone = requester.phone_number || "";

    // เช็คว่าเป็นนิสิตหรืออาจารย์
    if (requester.student_id) {
      requesterType = `นิสิตระดับ ${
        requester.degree || "ปริญญาตรี"
      } ชั้นปีที่ ${requester.study_year || "-"}`;
    } else if (requester.teacher_id) {
      requesterType = `อาจารย์ประจำภาควิชา ${requesterDepartment}`;
    }

    doc.fontSize(16).text(`ข้าพเจ้า ${requesterName}  มีความประสงค์ขอใช้ห้อง ${roomRequest.room_id}`,100 );
    doc.text(`รหัสนิสิต...........${requesterStudentID}........... สาขาวิชา....${requesterDepartment}.........ชั้นปีที่...${requesterYear}.....`,50);
  
      doc.text(
        "พร้อมทั้งด้วยนิสิตอื่นๆ ที่มีความประสงค์ใช้ห้องดังกล่าว โดยมีรายชื่อดังต่อไปนี้"
      );
      doc.moveDown(0.1);

    // วัน-เวลา ตามที่จอง
    // แปลงวันที่หากต้องการรูปแบบไทย
    const usedDate = roomRequest.used_date
      ? new Date(roomRequest.used_date).toLocaleDateString("th-TH", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "-";

    // ฟังก์ชันช่วยวาดเส้น Cell
    const drawCell = (x, y, width, height) => {
      doc.rect(x, y, width, height).stroke();
    };

    // กำหนดตำแหน่งและความกว้างคอลัมน์ในตาราง
    const startX = doc.x;
    let startY = doc.y;
    const cellWidths = [40, 80, 150, 100,120,50];
    const cellHeight = 25;

    // หัวตาราง
    const drawTableHeader = (y) => {
      const headers = [
        "ลำดับ",
        "รหัสนิสิต",
        "ชื่อ - นามสกุล",
        "ระดับการศึกษา",
        "สาขา",
        "ชั้นปี",
      ];
      let x = startX;
      headers.forEach((header, i) => {
        drawCell(x, y, cellWidths[i], cellHeight);
        doc.text(header, x + 5, y + 5);
        x += cellWidths[i];
      });
    };

    // แสดงแต่ละแถว
    const drawTableRow = (y, rowData) => {
      let x = startX;
      rowData.forEach((data, i) => {
        drawCell(x, y, cellWidths[i], cellHeight);
        // ตกแต่งให้ข้อความไม่ทับขอบ
        doc.text(data, x + 5, y + 5, { width: cellWidths[i] - 10 });
        x += cellWidths[i];
      });
    };

    // วาด header
    drawTableHeader(startY);
    let currentY = startY + cellHeight;

    // เติมข้อมูลในตาราง
    attendees.forEach((person, index) => {
      console.log("Row Data:", person); 
      // ตรวจสอบว่าเป็นนิสิตหรืออาจารย์
      //const isStudent = !!person.student_id;
      //const isTeacher = !!person.teacher_id;
      //let roleText = isStudent ? "นิสิต" : isTeacher ? "อาจารย์" : "";
      const studentID = person.student_id || "-";
      const fullName = person.full_name || "-";
      const Degree = person.degree || "-";
      const dept = person.department || "-";
      const year = person.study_year || "-";


      drawTableRow(currentY, [
        (index + 1).toString(),
        studentID,
        fullName,
        Degree,
        dept,
        year,

      ]);
      currentY += cellHeight;
    });

    doc.moveDown(2);

    // ส่วนท้าย ลงชื่อ

     // เพิ่มส่วนท้าย
  doc.moveDown(1);
  doc
    .moveTo(startX, currentY + 10)
    .lineTo(550, currentY + 10)
    .stroke();
  doc.text(
    `มีความประสงค์ขอใช้ห้อง SC2-${roomRequest.room_id}............เพื่อใช้ในการ......เพื่อวัตถุประสงค์: .....${roomRequest.request_reason}....${roomRequest.detail_request_reason
    ? " (" + roomRequest.detail_request_reason + ")"
    : ""}......`,
    startX,
    currentY + 15
  );
  doc.text(
    `ในวันที่......${usedDate}.......ตั้งแต่เวลา...${roomRequest.start_time}..น. ถึงเวลา.....${roomRequest.end_time}..น.`
  );
  doc.text(
    `โดยมีข้าพเจ้า.......${requesterName}...................เป็นผู้รับผิดชอบ เปิด-ปิด ห้องดังกล่าว `
  );
  doc.text(
    `เบอร์ติดต่อ โทร..........${requesterPhone}...........................`
  );
  doc.moveDown();
  doc.text("จึงเรียนมาเพื่อโปรดพิจารณาอนุมัติ", 150);
  doc.text(`..........${requesterName}..................นิสิตผู้ขอใช้`, {
    align: "right",
  });
  doc.text(`(......${requesterName}.......)`, { align: "right" });
  doc.text("เรียน หัวหน้าภาควิชาวิทยาการคอมพิวเตอร์ฯ", 50);
  doc.text("จึงเรียนมาเพื่อโปรดพิจารณา", 70);

    // จบการสร้าง PDF
    doc.end();

    // รอให้ writeStream เขียนไฟล์เสร็จแล้วค่อยตอบกลับ
    writeStream.on("finish", () => {
      return res.json({
        message: "สร้างไฟล์ PDF เรียบร้อย",
        downloadUrl: `/booking_document/${path.basename(outputFilePath)}`, // ไว้ให้ Frontend ดาวน์โหลด
      });
    });

    writeStream.on("error", (err) => {
      return res.status(500).json({
        error: "ไม่สามารถสร้างไฟล์ PDF ได้",
        details: err.message,
      });
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
