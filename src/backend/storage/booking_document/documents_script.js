const PDFDocument = require("pdfkit");
const fs = require("fs");
// สร้างเอกสาร PDF
const doc = new PDFDocument({ margin: 30 });
let studentData = {
  name: "สมหญิง รุ่งโรจน์",
  studentID: "12345678",
  major: "COMSCI",
  year: "ปีที่ 3",
  room: " 307 ",
  date: "12",
  month: "กุมภาพันธ์",
  century: "2025",
  timein: " 13.00 ",
  timeout: " 15.00 ",
};
let names = [
  "ปัญญากร ทิมจันทึก",
  "วงศธร กรกกรัมย์",
  "จิรยุทธ หวังทรัพย์",
  "สมชาย ทองดี",
  "สมสวย จริงนะ",
];
let studentIDs = ["65311109", "65314409", "65388950", "67388905", "66315589"];
let years = ["3", "3", "3", "1", "2"]; // เก็บข้อมูลชั้นปี

// ลงทะเบียนฟอนต์ภาษาไทย
doc.registerFont("THSarabunNew", "./THSarabunNew.ttf");

// ตั้งค่าเริ่มต้นเป็นฟอนต์ภาษาไทย
doc.font("THSarabunNew");

// บันทึกไฟล์ PDF
doc.pipe(fs.createWriteStream("booking_document.pdf"));

// เพิ่มโลโก้ที่มุมบนซ้าย
doc.image("garuda.jpg", 30, 10, { width: 50 });
doc.moveDown();

// ฟังก์ชันวาดเซลล์ (ต้องอยู่ก่อนการใช้งาน)
const drawCell = (x, y, width, height) => {
  doc.rect(x, y, width, height).stroke();
};

// เพิ่มส่วนหัวของเอกสาร
doc.fontSize(24).text("บันทึกข้อความ", { align: "center" });
doc
  .fontSize(16)
  .text(
    "ส่วนราชการ มหาวิทยาลัยนเรศวร..คณะวิทยาศาสตร์..ภาควิชาวิทยาการคอมพิวเตอร์ฯ โทร.3262-3.............",
    50
  );
doc
  .fontSize(16)
  .text(
    "ที่ อว.060304.06/........................................................................................................................................................",
    { continued: true }
  );
doc
  .fontSize(16)
  .text(
    "วันที่ ..........11 ก.พ. 2568....................................................................................................................่............................. "
  );
doc
  .fontSize(16)
  .text(
    "เรื่อง ขอใช้ห้อง SC2-311................................................................................................................................",
    { align: "left" }
  );
doc.text("เรียน หัวหน้าภาควิชาวิทยาการคอมพิวเตอร์และเทคโนโลยีสารสนเทศ ");
doc.text(
  `ข้าพเจ้า ${studentData.name}................. เป็นนิสิตระดับ ปริญญาตรี `,
  100
);
doc.text(
  `รหัสนิสิต......... ${studentData.studentID}............... สาขาวิชา....... ${studentData.major}........ชั้นปีที่.... ${studentData.year}....`,
  50
);
doc.text(
  "พร้อมทั้งด้วยนิสิตอื่นๆ ที่มีความประสงค์ใช้ห้องดังกล่าว โดยมีรายชื่อดังต่อไปนี้"
);
doc.moveDown(0.1);

// ตั้งค่าความกว้างและความสูงของเซลล์
const startX = 50;
const startY = doc.y;
const cellWidths = [30, 100, 150, 100, 100, 50];
const cellHeight = 25;

// ฟังก์ชันวาดหัวตาราง
const drawTableHeader = (y) => {
  const headers = [
    "ลำดับ",
    "รหัสนิสิต",
    "ชื่อ-นามสกุล",
    "ระดับการศึกษา",
    "สาขาวิชา",
    "ชั้นปีที่",
  ];
  let x = startX;
  headers.forEach((header, index) => {
    drawCell(x, y, cellWidths[index], cellHeight);
    doc.text(header, x + 5, y + 5);
    x += cellWidths[index];
  });
};

// ฟังก์ชันวาดแถวในตาราง
const drawTableRow = (y, rowData) => {
  let x = startX;
  rowData.forEach((data, index) => {
    drawCell(x, y, cellWidths[index], cellHeight);
    doc.text(data, x + 5, y + 5);
    x += cellWidths[index];
  });
};

// วาดหัวตาราง
drawTableHeader(startY);

// วาดแถวข้อมูลจาก array names และ studentIDs
let currentY = startY + cellHeight;
names.forEach((name, index) => {
  const rowData = [
    `${index + 1}`, // ลำดับ
    studentIDs[index], // รหัสนิสิต
    name, // ชื่อ-นามสกุล
    "(✓) ตรี ( ) โท ( ) เอก", // ระดับการศึกษา
    "(✓) COMSCI ( ) IT", // สาขาวิชา
    years[index], // ชั้นปีที่
  ];
  drawTableRow(currentY, rowData);
  currentY += cellHeight;
});

// เพิ่มส่วนท้าย
doc.moveDown(1);
doc
  .moveTo(startX, currentY + 10)
  .lineTo(550, currentY + 10)
  .stroke();
doc.text(
  `มีความประสงค์ขอใช้ห้อง SC2-${studentData.room}............เพื่อใช้ในการ..................................................................`,
  startX,
  currentY + 15
);
doc.text(
  "มีความประสงค์ขอใช้ห้อง SC2-............................................เพื่อใช้ในการ..................................................................",
  startX,
  currentY + 15
);
doc.text(
  `ในวันที่......${studentData.date}.......เดือน........${studentData.month}........ปี...${studentData.century}......ตั้งแต่เวลา...${studentData.timein}..น. ถึงเวลา.....${studentData.timeout}..น.`
);
doc.text(
  `โดยมีข้าพเจ้า.......${studentData.name}.......................................................................................................เป็นผู้รับผิดชอบ เปิด-ปิด ห้องดังกล่าว `
);
doc.text(
  `เบอร์ติดต่อ โทร...........0568512113............................................................`
);
doc.moveDown();
doc.text("จึงเรียนมาเพื่อโปรดพิจารณาอนุมัติ", 150);
doc.text(`..........${studentData.name}..................นิสิตผู้ขอใช้`, {
  align: "right",
});
doc.text(`(......${studentData.name}.......)`, { align: "right" });
doc.text("เรียน หัวหน้าภาควิชาวิทยาการคอมพิวเตอร์ฯ", 50);
doc.text("จึงเรียนมาเพื่อโปรดพิจารณา", 70);

// ปิดไฟล์ PDF
doc.end();
