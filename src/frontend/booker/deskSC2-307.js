/********************************
 * 1) ตัวแปรสำหรับเก็บหมายเลขเก้าอี้ที่ถูกเลือก
 ********************************/
let selectedDesks = new Set();

/********************************
 * 2) ฟังก์ชัน loadDesks()
 *    - ดึงข้อมูลจาก endpoint "Manage_computers"
 *    - สร้าง element สำหรับเก้าอี้ใน grid
 ********************************/
async function loadDesks() {
  try {
    const response = await fetch("http://localhost:3000/Manage_computers");
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const desks = await response.json();
    const deskGrid = document.getElementById("deskGrid");
    deskGrid.innerHTML = ""; // ล้างข้อมูลเก่าออกก่อน

    desks.forEach((desk) => {
      const deskDiv = document.createElement("div");
      deskDiv.classList.add("desk");

      // เช็คสถานะของคอมพิวเตอร์
      if (desk.Computer_status === "ใช้งานได้") {
        deskDiv.classList.add("usable");
      } else {
        deskDiv.classList.add("damaged"); // ถ้าไม่ใช้งานได้ ให้ใช้คลาส 'damaged'
      }

      deskDiv.textContent = `Com ${desk.Computer_ID}`;
      deskDiv.dataset.id = desk.Computer_ID; // เก็บ ID ไว้ใน data attribute

      // เมื่อคลิกเลือกเก้าอี้ ให้เรียก toggleDesk()
      deskDiv.onclick = () => toggleDesk(deskDiv);
      deskGrid.appendChild(deskDiv);
    });
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการโหลดข้อมูล:", error);
  }
}

/********************************
 * 3) ฟังก์ชัน toggleDesk(desk)
 *    - เมื่อคลิกเก้าอี้ หากไม่ใช่ 'damaged'
 *      ให้ toggle คลาส "checked" และอัปเดต selectedDesks
 ********************************/
function toggleDesk(desk) {
  if (!desk.classList.contains("damaged")) {
    desk.classList.toggle("selected"); // ใช้คลาส .selected แทนการเปลี่ยนสีโดยตรง
    const deskId = desk.dataset.id;

    if (desk.classList.contains("selected")) {
      selectedDesks.add(deskId); // เพิ่มโต๊ะที่ถูกเลือก
    } else {
      selectedDesks.delete(deskId); // ลบโต๊ะที่ยกเลิกการเลือก
    }
  }
}

/********************************
 * 4) ฟังก์ชัน loadEquipments()
 *    - ดึงข้อมูลอุปกรณ์จาก endpoint /getEquipments?room=307
 *    - สร้าง element สำหรับแสดงรายการอุปกรณ์ใน container ที่มี id "equipmentContainer"
 ********************************/
async function loadEquipments() {
  try {
    const response = await fetch(
      "http://localhost:3000/getEquipments?room=307"
    );
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const equipments = await response.json();
    const equipmentContainer = document.getElementById("equipmentContainer");
    equipmentContainer.innerHTML = ""; // ล้างข้อมูลเก่า

    equipments.forEach((equipment) => {
      const equipmentDiv = document.createElement("div");
      equipmentDiv.classList.add("equipment-item");

      // แสดงชื่ออุปกรณ์และจำนวน (เช่น "เก้าอี้ (10)")
      equipmentDiv.textContent = `${equipment.Equipments_name} (${equipment.Equipments_amount})`;
      equipmentDiv.dataset.id = equipment.Equipments_ID;

      // สร้าง input สำหรับให้ผู้ใช้กรอกจำนวนที่จะยืม
      const input = document.createElement("input");
      input.type = "number";
      input.min = "0";
      input.value = "0";
      // กำหนด max ตามจำนวนที่มีในฐานข้อมูล
      input.max = equipment.Equipments_amount;
      input.dataset.id = equipment.Equipments_ID;

      // สร้าง container สำหรับแสดงทั้ง label และ input
      const itemContainer = document.createElement("div");
      itemContainer.classList.add("borrow-item");
      const label = document.createElement("label");
      label.textContent = `${equipment.Equipments_name}:`;
      itemContainer.appendChild(label);
      itemContainer.appendChild(input);

      equipmentContainer.appendChild(itemContainer);
    });
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการโหลดอุปกรณ์:", error);
  }
}

/********************************
 * 5) ฟังก์ชัน submitSelection()
 *    - ส่งข้อมูลการเลือกเก้าอี้และอุปกรณ์ไปแสดงใน console
 ********************************/
function submitSelection() {
  const selectedDeskArray = Array.from(selectedDesks);

  // ดึงข้อมูลจาก input ในแต่ละ .borrow-item
  const equipmentInputs = document.querySelectorAll(".borrow-item input");
  const selectedEquipments = [];
  equipmentInputs.forEach((input) => {
      const value = parseInt(input.value);
      if (value > 0) {
          selectedEquipments.push({
              id: input.dataset.id,
              amount: value,
          });
      }
  });

  console.log("โต๊ะที่เลือก:", selectedDeskArray);
  console.log("อุปกรณ์ที่เลือก:", selectedEquipments);

  // ✅ ดึงค่า startTime จาก URL
  const urlParams = new URLSearchParams(window.location.search);
  const startTime = urlParams.get("startTime"); // ได้ค่าเป็น "08:00:00"

  if (!startTime) {
      alert("⚠️ ไม่พบค่า startTime ใน URL!");
      return;
  }

  // ✅ แปลง startTime เป็นตัวเลขชั่วโมง
  const hour = parseInt(startTime.split(":")[0], 10); // แปลง "08:00:00" → 8

  let targetPage = "";

  // 🕗 เช็คช่วงเวลา
  if (hour >= 8 && hour < 16) {
      targetPage = "TimeIn.html"; // **ในเวลา**
  } else if (hour >= 17 && hour <= 20) {
      targetPage = "TimeOut3.html"; // **นอกเวลา**
  } else {
      alert("⏳ ระบบเปิดให้จองเฉพาะ 08:00-16:00 และ 17:00-20:00 เท่านั้น");
      return;
  }

  // ✅ ส่งข้อมูลที่เลือกไปยังหน้าใหม่ผ่าน URL
  const newUrlParams = new URLSearchParams({
      room: "307",
      desks: selectedDeskArray.join(","),
      equipments: selectedEquipments.map((e) => `${e.id}:${e.amount}`).join(","),
  });

  console.log("🔗 กำลังเปลี่ยนไปที่:", targetPage + "?" + newUrlParams.toString());
  window.location.href = `${targetPage}?${newUrlParams.toString()}`;


  //   alert(
  //     "โต๊ะที่เลือก: " +
  //       selectedDeskArray.join(", ") +
  //       "\n" +
  //       "อุปกรณ์ที่เลือก: " +
  //       selectedEquipments.map((e) => `ID: ${e.id} (x${e.amount})`).join(", ")
  //   );

  // หากต้องการส่งข้อมูลผ่าน URL (ตัวอย่าง)
  //   const urlParams = new URLSearchParams({
  //     room: "307",
  //     desks: selectedDeskArray.join(","),
  //     equipments: selectedEquipments.map((e) => `${e.id}:${e.amount}`).join(","),
  //   });
  //   console.log("Query Parameters to Send:", urlParams.toString());
  //   window.location.href = `nextPage.html?${urlParams.toString()}`;
}

/********************************
 * 6) เรียกใช้โค้ดเมื่อหน้าโหลดเสร็จ
 ********************************/
document.addEventListener("DOMContentLoaded", () => {
  loadDesks();
  loadEquipments();

  // ผูกปุ่ม "ยืนยัน" ให้เรียก submitSelection()
  const confirmButton = document.querySelector(".confirm-button");
  if (confirmButton) {
    confirmButton.addEventListener("click", submitSelection);
  }
});

document.addEventListener("DOMContentLoaded", async function () {
  await fetchUserInfo();
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
      console.log("✅ ข้อมูลผู้ใช้ที่ได้จาก API:", userSession);

      // ตรวจสอบว่า userSession มีข้อมูลที่ถูกต้อง
      if (!userSession || !userSession.data) {
          alert("กรุณาเข้าสู่ระบบใหม่");
          window.location.href = "login.html";
          return;
      }

      // ✅ ถ้าไม่มี `id="user-name"` ให้ข้ามไปเลย (ไม่แสดง warning)
      const userNameElement = document.getElementById("user-name");
      if (userNameElement) {
          userNameElement.textContent = userSession.data.Name;
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

// เรียก loadDesks() ซ้ำ (ถ้าต้องการ reload เมื่อมีการเปลี่ยนแปลง)
loadDesks();
function checkTimePeriod() {
  const now = new Date();
  const hour = now.getHours();

  if (hour >= 8 && hour < 16) {
      return "ในเวลา"; // 🕗 08:00 - 16:00
  } else if (hour >= 17 && hour <= 20) {
      return "นอกเวลา"; // 🌙 17:00 - 20:00
  } else {
      return "⏳ อยู่นอกช่วงที่กำหนด (ไม่ได้เปิดให้จอง)";
  }
}

// 🔥 ตัวอย่างการใช้งาน
console.log("📌 สถานะเวลา:", checkTimePeriod());

// ถ้ามีการอัปเดตแบบเรียลไทม์ผ่าน WebSocket (ถ้ามี)
//const socket = io("http://localhost:3000");
//socket.on("connect", () => {
//  console.log("WebSocket connected!");
//});
//socket.on("booking_update", () => {
//  loadDesks();
//  loadEquipments();
//});
