const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',      // ถ้าใช้ Docker อาจต้องใช้ 'host.docker.internal'
    user: 'easyroomteam',          // ชื่อผู้ใช้ MySQL (ค่าเริ่มต้นของ XAMPP/Docker คือ 'root')
    password: '1234',          // รหัสผ่าน (ค่าเริ่มต้นของ XAMPP ว่างเปล่า)
    database: 'easyroom', // ชื่อฐานข้อมูล
    port: 9906          // พอร์ต MySQL (ค่าเริ่มต้นคือ 3306)
});

// ตรวจสอบการเชื่อมต่อ
connection.connect((err) => {
    if (err) {
        console.error('❌ ไม่สามารถเชื่อมต่อกับฐานข้อมูล:', err);
        return;
    }
    console.log('✅ เชื่อมต่อฐานข้อมูล easyroom_test สำเร็จ!');
});

module.exports = connection;