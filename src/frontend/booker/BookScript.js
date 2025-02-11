document.addEventListener("DOMContentLoaded", function () {
    // ค้นหา elements ที่เกี่ยวข้องกับปุ่มชั้นและแผนผัง
    const floorButtons = document.querySelectorAll('.floor-btn');
    const floorPlans = document.querySelectorAll('.floor-plan');

    // ฟังก์ชันสำหรับโหลดข้อมูลของแผนผังชั้นจากไฟล์
    function loadFloorData(floorId, file) {
        // ค้นหา element ที่ใช้แสดงแผนผังของชั้น
        const floorElement = document.getElementById(floorId);
        
        // แสดงข้อความว่า "กำลังโหลด..." ขณะที่กำลังโหลดข้อมูล
        floorElement.innerHTML = "<p>Loading...</p>";
        
        // ดึงข้อมูล HTML จากไฟล์ที่กำหนด
        fetch(file)
            .then(response => {
                // ถ้าการตอบกลับไม่สมบูรณ์ (เกิดข้อผิดพลาด HTTP)
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.text(); // ถ้าผลลัพธ์ถูกต้องให้แปลงเป็นข้อความ
            })
            .then(html => {
                floorElement.innerHTML = html; // แสดงผลข้อมูลแผนผังที่โหลดมา
                attachRoomClickEvents(); // เพิ่ม event listeners สำหรับห้องที่คลิก
            })
            .catch(error => {
                // ถ้ามีข้อผิดพลาดในการโหลดข้อมูล
                console.error('Error loading data:', error);
                floorElement.innerHTML = "<p>Failed to load floor data.</p>"; // แสดงข้อความข้อผิดพลาด
            });
    }

    // ฟังก์ชันสำหรับเพิ่ม event listeners ให้กับห้องทุกห้องที่คลิกได้
    function attachRoomClickEvents() {
        document.querySelectorAll('.room').forEach(room => {
            room.addEventListener('click', (event) => {
                // ดึงชื่อห้องจาก attribute 'value' ของ element ที่ถูกคลิก
                const roomName = event.target.getAttribute('value');
                
                // เก็บชื่อห้องใน localStorage เพื่อใช้ในหน้าอื่น
                localStorage.setItem('selectedRoom', roomName);
                
                // เปลี่ยนหน้าไปยัง schedule.html และส่งชื่อห้องผ่าน URL
                window.location.href = `schedule.html?room=${encodeURIComponent(roomName)}`;
            });
        });
    }

    // เพิ่ม event listeners ให้กับปุ่มชั้น
    floorButtons.forEach(button => {
        button.addEventListener('click', () => {
            // ลบ class 'active' จากทุกปุ่มชั้น
            floorButtons.forEach(btn => btn.classList.remove('active'));
            // เพิ่ม class 'active' ให้กับปุ่มที่ถูกคลิก
            button.classList.add('active');
            
            // ลบ class 'active' จากแผนผังทั้งหมด
            floorPlans.forEach(plan => plan.classList.remove('active'));

            // ดึงข้อมูล 'data-floor' และ 'data-file' จากปุ่มที่คลิก
            const floorId = button.getAttribute('data-floor');
            const file = button.getAttribute('data-file');
            
            // เพิ่ม class 'active' ให้กับแผนผังชั้นที่เกี่ยวข้อง
            document.getElementById(floorId).classList.add('active');
            
            // โหลดข้อมูลแผนผังจากไฟล์ที่กำหนด
            loadFloorData(floorId, file);
        });
    });

    // เริ่มโหลดข้อมูลสำหรับชั้น 2 โดยเริ่มจาก 'floor2.html'
    loadFloorData('floor2', 'floor2.html');
});
