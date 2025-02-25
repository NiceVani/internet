document.addEventListener("DOMContentLoaded", () => {
  fetchUserInfo();
  fetchRoomStatus();
  attachRoomClickEvents();
});

// ✅ ฟังก์ชันดึงข้อมูลเซสชันผู้ใช้
async function fetchUserInfo() {
  try {
    console.log("🔄 กำลังโหลดข้อมูลเซสชัน...");
    const response = await fetch("http://localhost:3000/session", {
      method: "GET",
      credentials: "include",
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

async function logout() {
  try {
    const response = await fetch("http://localhost:3000/logout", {
      method: "POST",
      credentials: "include",
    });

    if (!response.ok) throw new Error("เกิดข้อผิดพลาดในการออกจากระบบ");

    alert("ออกจากระบบสำเร็จ");
    redirectToLogin();
  } catch (error) {
    console.error("❌ ไม่สามารถออกจากระบบได้:", error);
    alert("เกิดข้อผิดพลาด กรุณาลองใหม่");
  }
}

// ✅ ฟังก์ชันเปลี่ยนหน้าไป login.html
function redirectToLogin() {
  window.location.href = "login.html";
}

// ✅ ฟังก์ชันอัปเดตชื่อผู้ใช้
function updateUserName(name) {
  const userNameElement = document.getElementById("user-name");
  if (userNameElement) {
    userNameElement.textContent = name || "ไม่ระบุชื่อ";
  }
}

// ✅ ฟังก์ชันแนบ event กับปุ่มห้องเรียน
function attachRoomClickEvents() {
  document.addEventListener("click", (event) => {
    const roomElement = event.target.closest(".room"); // เช็คว่าคลิกที่ .room หรือไม่
    if (!roomElement) return;

    const roomName = roomElement.dataset.room; // ดึงค่า room จาก data-room
    if (!roomName) return;

    localStorage.setItem("selectedRoom", roomName);
    window.location.href = `Schedule.html?room=${encodeURIComponent(roomName)}`;
  });
}

// ✅ ฟังก์ชันออกจากระบบ

// ✅ ฟังก์ชันดึงสถานะห้องจากฐานข้อมูล
async function fetchRoomStatus() {
  try {
    const response = await fetch("http://localhost:3000/getRoomStatus");
    if (!response.ok) throw new Error("Failed to fetch room data");

    const rooms = await response.json();
    console.log("✅ ห้องที่ดึงมา:", rooms);

    const allRoomElements = document.querySelectorAll(".room");

    allRoomElements.forEach((roomElement) => {
      const roomId = roomElement.dataset.room;
      if (!roomId) return;

      // 🔹 ค้นหาห้องจากฐานข้อมูล
      const roomData = rooms.find((r) => r.room_id === roomId);

      let statusElement = roomElement.querySelector(".status-label");
      if (!statusElement) {
        statusElement = document.createElement("div");
        statusElement.classList.add("status-label");
        roomElement.appendChild(statusElement);
      }

      if (roomData) {
        // ✅ ห้องมีข้อมูลในฐานข้อมูล
        if (roomData.room_status.trim() === "เปิดการใช้งาน") {
          roomElement.classList.add("available");
          roomElement.classList.remove("disabled-room", "no-data");
          statusElement.textContent = "ว่าง";
          statusElement.style.backgroundColor = "green";
          roomElement.style.backgroundColor = "#5cb85c"; // 🟢 สีเขียว
          roomElement.style.cursor = "pointer";
        } else {
          roomElement.classList.add("disabled-room");
          roomElement.classList.remove("available", "no-data");
          statusElement.textContent = "ไม่ว่าง";
          statusElement.style.backgroundColor = "red"; // ❌ สีแดงเฉพาะป้าย
          roomElement.style.backgroundColor = "#8e8e8e"; // ⚫ เทาสำหรับห้อง
          roomElement.style.cursor = "not-allowed";
        }
      } else {
        // ❌ ห้องไม่มีข้อมูล → พื้นหลังแดง ไม่มีข้อความ
        roomElement.classList.add("no-data");
        roomElement.classList.remove("available", "disabled-room");
        roomElement.style.backgroundColor = "#ff0000"; // 🔴 สีแดงทั้งห้อง
        statusElement.textContent = ""; // ไม่แสดงข้อความใดๆ
      }
    });
  } catch (error) {
    console.error("❌ Error loading room status:", error);
  }
}
