document.addEventListener("DOMContentLoaded", () => {
  fetchUserInfo();
  fetchRoomStatus();
  fetchRoomTypeIcon();
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

    if (!response.ok) {
      throw new Error("Session expired");
    }

    const userSession = await response.json();
    console.log("✅ ข้อมูลผู้ใช้ที่ได้จาก API:", userSession);

    if (userSession && userSession.data) {
      if (userSession.role === "นิสิต") {
        sessionUserId = userSession.data.student_id;
        sessionRole = "นิสิต";
      } else if (userSession.role === "อาจารย์") {
        sessionUserId = userSession.data.teacher_id; // ✅ ใช้ teacher_id
        sessionRole = "อาจารย์";
      } else {
        alert("❌ ไม่สามารถระบุประเภทบัญชีได้");
        window.location.href = "login.html";
      }
    } else {
      alert("❌ กรุณาเข้าสู่ระบบใหม่");
      window.location.href = "login.html";
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
    // ตรวจสอบว่าเป็นห้องพิเศษหรือไม่
    if (roomElement.dataset.special === "true") {
      // เรียกใช้ SweetAlert สำหรับห้อง 212
      Swal.fire({
        title: "ห้อง SC2-" + roomName,
        text: "ขออภัย ห้องนี้ไม่สามารถจองผ่านระบบได้ กรุณาติดต่อเจ้าหน้าที่",
        icon: "info",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "ตกลง",
      });
      return; // หยุดการทำงานของฟังก์ชันนี้
    }

    localStorage.setItem("selectedRoom", roomName);
    window.location.href = `Schedule.html?room=${encodeURIComponent(roomName)}`;
  });
}

// ✅ ดึงสถานะห้องจากฐานข้อมูล
async function fetchRoomStatus() {
  try {
    const response = await fetch("http://localhost:3000/rooms");
    if (!response.ok) throw new Error("Failed to fetch room data");

    const rooms = await response.json();
    console.log("✅ ห้องที่ดึงมา:", rooms);

    const allRoomElements = document.querySelectorAll(".room");

    allRoomElements.forEach((roomElement) => {
      const roomId = roomElement.dataset.room;
      if (!roomId) return;

      const roomData = rooms.find((r) => r.room_id === roomId);
      if (!roomData) return;

      let statusElement = roomElement.querySelector(".status");
      if (!statusElement) {
        statusElement = document.createElement("div");
        statusElement.classList.add("status");
        roomElement.appendChild(statusElement);
      }

      if (roomData.room_status.trim() === "เปิดการใช้งาน") {
        statusElement.textContent = "ว่าง";
        statusElement.classList.remove("not");
        roomElement.style.backgroundColor = "#8e8e8e";
        roomElement.classList.add("available");
        roomElement.classList.remove("disabled-room", "no-data");
        roomElement.style.cursor = "pointer";
      } else {
        statusElement.textContent = "ไม่ว่าง";
        statusElement.classList.add("not");
        roomElement.classList.add("disabled-room");
        roomElement.classList.remove("available", "no-data");
        roomElement.style.backgroundColor = "#8e8e8e";
        roomElement.style.cursor = "not-allowed";
      }
    });
  } catch (error) {
    console.error("❌ Error loading room status:", error);
  }
}

// ✅ ดึงไอคอนประเภทห้อง
async function fetchRoomTypeIcon() {
  try {
    const response = await fetch("http://localhost:3000/roomdetail");
    if (!response.ok) throw new Error("ไม่สามารถดึงข้อมูล room type ได้");

    const rooms = await response.json();
    console.log("📦 Room type data:", rooms);

    const typeIcons = {
      ห้องเลคเชอร์: "fas fa-chalkboard-teacher",
      ห้องปฏิบัติการ: "fas fa-laptop-code",
      ห้องปฎิบัติการ: "fas fa-laptop-code", // รองรับคำสะกดผิดด้วย
      "co-working space": "fas fa-users",
      "studio room": "fas fa-video",
      ห้องค้นคว้า: "fas fa-book",
    };

    rooms.forEach((room) => {
      const roomId = room.room_id?.trim(); // ตัดช่องว่าง
      const normalizedType = room.room_type?.trim().toLowerCase();

      const roomElement = document.querySelector(
        `.room[data-room="${roomId}"]`
      );
      const iconClass = typeIcons[normalizedType];

      if (roomElement && iconClass) {
        const icon = document.createElement("i");
        icon.className = `${iconClass} room-type-icon`;
        roomElement.classList.add("has-icon");
        roomElement.appendChild(icon);
      } else {
        console.warn("⛔ ไม่พบ room หรือ icon:", roomId, room.room_type);
      }
    });
  } catch (err) {
    console.error("❌ Failed to load room type icons:", err);
  }
}
