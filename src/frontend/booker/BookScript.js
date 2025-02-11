document.addEventListener("DOMContentLoaded", function () {
    // ค้นหา elements ที่เกี่ยวข้องกับปุ่มชั้นและแผนผัง
    const floorButtons = document.querySelectorAll('.floor-btn');
    const floorPlans = document.querySelectorAll('.floor-plan');

    // ฟังก์ชันสำหรับโหลดข้อมูลของแผนผังชั้นจากไฟล์
    function loadFloorData(floorId, file) {
        const floorElement = document.getElementById(floorId);
        floorElement.innerHTML = "<p>Loading...</p>";

        fetch(file)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.text();
            })
            .then(html => {
                floorElement.innerHTML = html;
                attachRoomClickEvents();
            })
            .catch(error => {
                console.error('Error loading data:', error);
                floorElement.innerHTML = "<p>Failed to load floor data.</p>";
            });
    }

    // ฟังก์ชันสำหรับเพิ่ม event listeners ให้กับห้องทุกห้องที่คลิกได้
    function attachRoomClickEvents() {
        document.querySelectorAll('.room').forEach(room => {
            room.addEventListener('click', (event) => {
                const roomName = event.target.getAttribute('value');
                localStorage.setItem('selectedRoom', roomName);
                window.location.href = `schedule.html?room=${encodeURIComponent(roomName)}`;
            });
        });
    }

    // เพิ่ม event listeners ให้กับปุ่มชั้น
    floorButtons.forEach(button => {
        button.addEventListener('click', () => {
            floorButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            floorPlans.forEach(plan => plan.classList.remove('active'));

            const floorId = button.getAttribute('data-floor');
            const file = button.getAttribute('data-file');

            document.getElementById(floorId).classList.add('active');
            loadFloorData(floorId, file);
        });
    });

    // ✅ เริ่มโหลดข้อมูลสำหรับชั้น 2 โดยเริ่มจาก 'floor2.html'
    loadFloorData('floor2', 'floor2.html');

    // ✅ โหลดข้อมูลเซสชันผู้ใช้เมื่อหน้าเว็บโหลด
    fetchUserInfo();
});

// ✅ ฟังก์ชันดึงข้อมูลเซสชันผู้ใช้
async function fetchUserInfo() {
    try {
        console.log("🔄 กำลังโหลดข้อมูลเซสชัน...");
        const response = await fetch("http://localhost:3000/session", {
            method: "GET",
            credentials: "include"
        });

        console.log("📡 API ตอบกลับ:", response.status);
        if (!response.ok) {
            throw new Error("Session expired");
        }

        const userSession = await response.json();
        console.log("✅ ข้อมูลผู้ใช้ที่ได้จาก API:", userSession); // เช็คโครงสร้างข้อมูล

        // ตรวจสอบว่า userSession มี key 'data' และ 'role' หรือไม่
        if (!userSession.data || !userSession.role) {
            throw new Error("ข้อมูลเซสชันไม่ถูกต้อง");
        }

        // ตรวจสอบสิทธิ์ผู้ใช้
        if (userSession.role !== "นิสิต") {
            alert("คุณไม่มีสิทธิ์เข้าถึงหน้านี้");
            window.location.href = "login.html";
            return;
        }

        // อัปเดตชื่อผู้ใช้ในหน้าเว็บ (ถ้ามี element นั้น)
        const userNameElement = document.getElementById("user-name");
        if (userNameElement) {
            userNameElement.textContent = userSession.data.Name || "ไม่ระบุชื่อ";
        }
    } catch (error) {
        console.error("❌ เกิดข้อผิดพลาดในการโหลดข้อมูลเซสชัน:", error);
        alert("เกิดข้อผิดพลาด กรุณาเข้าสู่ระบบใหม่");
        window.location.href = "login.html";
    }
}

// ✅ ฟังก์ชันออกจากระบบ
async function logout() {
    try {
        const response = await fetch("http://localhost:3000/logout", {
            method: "POST",
            credentials: "include"
        });

        if (response.ok) {
            alert("ออกจากระบบสำเร็จ");
            window.location.href = "login.html";
        } else {
            alert("เกิดข้อผิดพลาดในการออกจากระบบ");
        }
    } catch (error) {
        console.error("❌ ไม่สามารถออกจากระบบได้:", error);
        alert("เกิดข้อผิดพลาด กรุณาลองใหม่");
    }
}
