const mysql = require("mysql2/promise");
require("dotenv").config(); // โหลดค่าจาก .env

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: "easyroom",
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10, // กำหนดจำนวน Connection สูงสุด
  queueLimit: 0,
  ssl: process.env.SSL_CA === "true" ? { rejectUnauthorized: true } : false, // ปิด SSL ถ้าไม่ได้ใช้
});

module.exports = pool; // ✅ export เป็น pool
