// ฟังก์ชันสำหรับดึงค่า room จาก URL
function getRoomIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get("room");
}

// ดึงค่า roomId แล้วแสดงผล
document.addEventListener("DOMContentLoaded", function () {
    const roomId = getRoomIdFromURL();
    console.log(roomId);
    if (roomId) {
        // แสดงชื่อห้อง โดยไม่เพิ่ม SC- เพื่อให้ตรงกับฐานข้อมูล
        document.getElementById("roomTitle").innerText = `รายละเอียดห้อง: ${roomId}`;

        // เรียกฟังก์ชันดึงข้อมูลอุปกรณ์ โดยใช้ roomId ที่ถูกต้อง
        fetchEquipmentData(roomId);
    } else {
        // ถ้าไม่พบ roomId ใน URL จะแสดงข้อความผิดพลาด
        document.getElementById("roomTitle").innerText = "ไม่พบข้อมูลห้องใน URL";
        console.error("❌ ไม่พบ room_id ใน URL");
    }
});

// ฟังก์ชันดึงข้อมูลอุปกรณ์จาก API
function fetchEquipmentData(roomId) {
    if (!roomId) {
        console.error("❌ ไม่พบ roomId สำหรับการโหลดข้อมูลอุปกรณ์");
        return;  // หยุดการทำงานหากไม่มี roomId
    }

    fetch(`http://localhost:3001/getEquipments?room=${roomId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const equipmentContainer = document.getElementById("equipmentContainer");
            equipmentContainer.innerHTML = ""; // ล้างข้อมูลเก่า

            if (data.length === 0) {
                equipmentContainer.innerHTML = "<p>ไม่มีอุปกรณ์ในห้องนี้</p>";
                return;
            }

            data.forEach(equipment => {
                const item = document.createElement("div");
                item.textContent = `${equipment.equipment_name} - คงเหลือ ${equipment.stock_quantity}`;
                equipmentContainer.appendChild(item);
            });
        })
        .catch(error => {
            console.error("❌ เกิดข้อผิดพลาดในการโหลดอุปกรณ์:", error);
        });
}
