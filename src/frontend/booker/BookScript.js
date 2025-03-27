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
          credentials: "include"
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
              sessionUserId = userSession.data.teacher_id;  // ✅ ใช้ teacher_id
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

    localStorage.setItem("selectedRoom", roomName);
    window.location.href = `Schedule.html?room=${encodeURIComponent(roomName)}`;
  });
}

// ✅ ฟังก์ชันออกจากระบบ
window.addEventListener("DOMContentLoaded", async () => {
  // try {
  //   const res = await fetch("http://localhost:3000/getRoomStatus");
  //   const rooms = await res.json();

  //   const roomElements = document.querySelectorAll(".room");

  //   roomElements.forEach((el) => {
  //     const roomName = el.textContent.trim().replace(/\s/g, "");
  //     const match = rooms.find(
  //       (r) => r.room_name.replace(/\s/g, "") === roomName
  //     );

  //     if (match) {
  //       // เคลียร์ class เดิมก่อน
  //       el.classList.remove("available", "disabled-room", "no-data");

  //       if (match.room_status === "ว่าง") {
  //         el.classList.add("available");
  //         const status = document.createElement("div");
  //         status.classList.add("status-label");
  //         status.textContent = "ว่าง";
  //         el.appendChild(status);
  //       } else {
  //         el.classList.add("disabled-room");
  //         const status = document.createElement("div");
  //         status.classList.add("status-label");
  //         status.textContent = "ไม่ว่าง";
  //         el.appendChild(status);
  //       }
  //     } else {
  //       // ถ้าไม่พบห้องในฐานข้อมูล ให้ถือว่าไม่มีข้อมูล
  //       el.classList.add("no-data");
  //     }
  //   });
  // } catch (err) {
  //   console.error("❌ โหลดข้อมูลห้องล้มเหลว:", err);
  // }
});

// ✅ ฟังก์ชันดึงสถานะห้องจากฐานข้อมูล
async function fetchRoomStatus() {
  try {
    const response = await fetch("http://localhost:3000/getRoomStatus");
    if (!response.ok) throw new Error("Failed to fetch room data");

    const rooms = await response.json();
    console.log("✅ ห้องที่ดึงมา:", rooms);

    const allRoomElements = document.querySelectorAll(".room");

    allRoomElements.forEach(roomElement => {
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
        const status = roomData.room_status.trim();
      
        if (status === "เปิดการใช้งาน") {
          roomElement.classList.add("available");
          roomElement.classList.remove("disabled-room", "no-data");
          statusElement.textContent = "ว่าง";
          roomElement.style.cursor = "pointer";
        } else if (status === "ปิดการใช้งาน") {
          roomElement.classList.add("disabled-room");
          roomElement.classList.remove("available", "no-data");
          statusElement.textContent = "ไม่ว่าง";
          roomElement.style.cursor = "not-allowed";
          roomElement.style.pointerEvents = "none";
        } else {
          roomElement.classList.add("no-data");
          roomElement.classList.remove("available", "disabled-room");
          statusElement.textContent = "";
          roomElement.style.cursor = "not-allowed";
          roomElement.style.pointerEvents = "none"; 
        }
      } else {
        roomElement.classList.add("no-data");
        roomElement.classList.remove("available", "disabled-room");
        statusElement.textContent = "";
        roomElement.style.cursor = "not-allowed";
        roomElement.style.pointerEvents = "none"; 
      }
      
      
    });
  } catch (error) {
    console.error("❌ Error loading room status:", error);
  }
}

