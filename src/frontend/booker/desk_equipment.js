/********************************
 * 1) ตัวแปรสำหรับเก็บหมายเลขเก้าอี้ที่ถูกเลือก
 ********************************/
let selectedDesks = new Set();

/********************************
 * 2) ฟังก์ชัน loadDesks()
 *    - ดึงข้อมูลจาก endpoint "computer_management"
 *    - สร้าง element สำหรับเก้าอี้ใน grid พร้อมจัดกลุ่มเป็นแถวและเพิ่ม checkbox เลือกทั้งแถว
 ********************************/

async function loadDesks() {
  try {
    const response = await fetch("http://localhost:3000/computer_management");
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const desks = await response.json();

    // ดึงค่า room จาก URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const room = urlParams.get("room");
    console.log("Room:", room);

    // กรองข้อมูลเฉพาะคอมพิวเตอร์ที่อยู่ในห้องที่เลือก
    const filteredDesks = desks.filter((desk) => desk.room_id === room);

    // กำหนดแพทเทิร์นสำหรับแถว: 4-3-4 (รวม 11 เครื่องต่อแถว)
    const pattern = [3, 4, 3];

    const deskGrid = document.getElementById("deskGrid");
    deskGrid.innerHTML = ""; // ล้างข้อมูลเก่า

    let index = 0;
    while (index < filteredDesks.length) {
      // สร้าง container สำหรับแต่ละแถว
      const rowDiv = document.createElement("div");
      rowDiv.classList.add("desk-row");

      // สร้าง checkbox สำหรับเลือกทั้งแถว
      const rowCheckbox = document.createElement("input");
      rowCheckbox.type = "checkbox";
      rowCheckbox.classList.add("row-select");
      // เก็บ desk element ทั้งหมดในแถวไว้ใน array เพื่อใช้กับ row checkbox
      let rowDeskElements = [];

      rowCheckbox.addEventListener("change", function () {
        rowDeskElements.forEach((deskElem) => {
          if (deskElem && !deskElem.classList.contains("damaged")) {
            if (
              rowCheckbox.checked &&
              !deskElem.classList.contains("selected")
            ) {
              deskElem.classList.add("selected");
              selectedDesks.add(deskElem.dataset.id);
            } else if (
              !rowCheckbox.checked &&
              deskElem.classList.contains("selected")
            ) {
              deskElem.classList.remove("selected");
              selectedDesks.delete(deskElem.dataset.id);
            }
          }
        });
      });
      rowDiv.appendChild(rowCheckbox);

      // สำหรับแต่ละส่วนในแพทเทิร์น (4-3-4)
      pattern.forEach((segCount, segIndex) => {
        // สร้าง container สำหรับ segment นี้ เพื่อเป็นช่องว่าง (gap) ระหว่างส่วน
        const segContainer = document.createElement("div");
        segContainer.classList.add("desk-segment");
        // กำหนด margin-right เป็น gap (ยกเว้นส่วนสุดท้าย)
        if (segIndex < pattern.length - 1) {
          segContainer.style.marginRight = "50px";
        }

        // ดึงคอมพิวเตอร์สำหรับ segment นี้ (ถ้าจำนวนที่เหลือไม่พอจะครบ segCount ก็จะใช้ที่มีอยู่)
        const segmentDesks = filteredDesks.slice(index, index + segCount);
        index += segCount;

        segmentDesks.forEach((desk) => {
          const deskDiv = document.createElement("div");
          deskDiv.classList.add("desk");
          // เก็บ room_id และ id ไว้ใน data attribute
          deskDiv.dataset.room = desk.room_id;
          deskDiv.dataset.id = desk.computer_id;
          // ตั้งค่า innerHTML ให้แสดงไอคอนและหมายเลขคอมพิวเตอร์
          deskDiv.innerHTML = `<span class="computer-icon">🖥️</span><span class="computer-id">${desk.computer_id}</span>`;

          if (desk.computer_status === "ใช้งานได้") {
            deskDiv.classList.add("usable");
          } else {
            deskDiv.classList.add("damaged");
          }

          // เมื่อคลิกเลือกคอมพิวเตอร์ ให้เรียก toggleDesk()
          deskDiv.onclick = () => toggleDesk(deskDiv);

          segContainer.appendChild(deskDiv);
          rowDeskElements.push(deskDiv);
        });

        rowDiv.appendChild(segContainer);
      });

      deskGrid.appendChild(rowDiv);
    }

    // ตั้งค่า event listener สำหรับ select all checkbox (เหมือนเดิม)
    const selectAllCheckbox = document.getElementById("selectAllCheckbox");
    selectAllCheckbox.addEventListener("change", function () {
      const allDesks = document.querySelectorAll(".desk");
      allDesks.forEach((deskElem) => {
        if (!deskElem.classList.contains("damaged")) {
          if (
            selectAllCheckbox.checked &&
            !deskElem.classList.contains("selected")
          ) {
            deskElem.classList.add("selected");
            selectedDesks.add(deskElem.dataset.id);
          } else if (
            !selectAllCheckbox.checked &&
            deskElem.classList.contains("selected")
          ) {
            deskElem.classList.remove("selected");
            selectedDesks.delete(deskElem.dataset.id);
          }
        }
      });
      // ปรับสถานะของ row checkboxesให้สอดคล้อง
      const rowCheckboxes = document.querySelectorAll(".row-select");
      rowCheckboxes.forEach((checkbox) => {
        checkbox.checked = selectAllCheckbox.checked;
      });
    });
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการโหลดข้อมูล:", error);
  }
}

/********************************
 * 3) ฟังก์ชัน toggleDesk(desk)
 *    - เมื่อคลิกเก้าอี้ หากไม่ใช่ 'damaged'
 *      ให้ toggle คลาส "selected" และอัปเดต selectedDesks
 ********************************/
function toggleDesk(desk) {
  if (!desk.classList.contains("damaged")) {
    desk.classList.toggle("selected");
    const deskId = desk.dataset.id;

    if (desk.classList.contains("selected")) {
      selectedDesks.add(deskId);
    } else {
      selectedDesks.delete(deskId);
    }
  }
}

/********************************
 * 4) ฟังก์ชัน loadEquipments()
 *    - ดึงข้อมูลอุปกรณ์จาก endpoint /getEquipments?room=307
 *    - สร้าง element สำหรับแสดงรายการอุปกรณ์ใน container ที่มี id "equipmentContainer"
 *    - เพิ่มปุ่มเพิ่ม/ลด จำนวนให้ใช้งานง่ายขึ้น
 ********************************/
async function loadEquipments() {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const room = urlParams.get("room");
    const response = await fetch(
      `http://localhost:3000/getEquipments?room=${room}`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const equipments = await response.json();
    const equipmentContainer = document.getElementById("equipmentContainer");
    equipmentContainer.innerHTML = ""; // ล้างข้อมูลเก่า

    equipments.forEach((equipment) => {
      const itemContainer = document.createElement("div");
      itemContainer.classList.add("borrow-item");

      const label = document.createElement("label");
      label.textContent = `${equipment.equipment_name} (คงเหลือ ${equipment.stock_quantity}):`;
      itemContainer.appendChild(label);

      // สร้างปุ่มลด
      const minusBtn = document.createElement("button");
      minusBtn.textContent = "-";
      minusBtn.addEventListener("click", () => {
        let currentVal = parseInt(input.value);
        if (currentVal > 0) {
          input.value = currentVal - 1;
        }
      });
      itemContainer.appendChild(minusBtn);

      // สร้าง input สำหรับจำนวนที่จะยืม
      const input = document.createElement("input");
      input.type = "number";
      input.min = "0";
      input.value = "0";
      input.max = equipment.stock_quantity;
      input.dataset.id = equipment.equipment_id;
      itemContainer.appendChild(input);

      // สร้างปุ่มเพิ่ม
      const plusBtn = document.createElement("button");
      plusBtn.textContent = "+";
      plusBtn.addEventListener("click", () => {
        let currentVal = parseInt(input.value);
        if (currentVal < equipment.stock_quantity) {
          input.value = currentVal + 1;
        }
      });
      itemContainer.appendChild(plusBtn);

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

  // ดึงค่า startTime จาก URL
  const urlParams = new URLSearchParams(window.location.search);
  const startTime = urlParams.get("startTime");
  if (!startTime) {
    alert("⚠️ ไม่พบค่า startTime ใน URL!");
    return;
  }
  const hour = parseInt(startTime.split(":")[0], 10);
  let targetPage = "";
  if (hour >= 8 && hour < 16) {
    targetPage = "TimeIn.html";
  } else if (hour >= 17 && hour <= 20) {
    targetPage = "TimeOut.html";
  } else {
    alert("⏳ ระบบเปิดให้จองเฉพาะ 08:00-16:00 และ 17:00-20:00 เท่านั้น");
    return;
  }

  const date = urlParams.get("date");
  const room = urlParams.get("room");
  const endTime = urlParams.get("endTime");

  const newUrlParams = new URLSearchParams({
    room: room,
    date: date,
    startTime: startTime,
    endTime: endTime,
    desks: selectedDeskArray.join(","),
    equipments: selectedEquipments.map((e) => `${e.id}:${e.amount}`).join(","),
  });

  console.log(
    "🔗 กำลังเปลี่ยนไปที่:",
    targetPage + "?" + newUrlParams.toString()
  );
  window.location.href = `${targetPage}?${newUrlParams.toString()}`;
}

/********************************
 * 6) เรียกใช้โค้ดเมื่อหน้าโหลดเสร็จ
 ********************************/
document.addEventListener("DOMContentLoaded", () => {
  loadDesks();
  loadEquipments();

  const roomId = new URLSearchParams(window.location.search).get("room");

  if (roomId) {
    document.getElementById("room-name").textContent = `ห้อง: SC2-${roomId}`;
    // สำหรับทำปุ่มย้อนกลับไปหน้า Schedule
    document.getElementById("back-btn").href = `Schedule.html?room=${roomId}`;
    console.log(`Loading schedule for room SC2-${roomId}`);
  }
});

document.addEventListener("DOMContentLoaded", async function () {
  await fetchUserInfo();
});

// ฟังก์ชันดึงข้อมูลเซสชันผู้ใช้
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
    console.log("✅ ข้อมูลผู้ใช้ที่ได้จาก API:", userSession);

    if (!userSession || !userSession.data) {
      alert("กรุณาเข้าสู่ระบบใหม่");
      window.location.href = "login.html";
      return;
    }

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

// ฟังก์ชันออกจากระบบ
async function logout() {
  try {
    const response = await fetch("http://localhost:3000/logout", {
      method: "POST",
      credentials: "include",
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

// ฟังก์ชันตรวจสอบช่วงเวลา
function checkTimePeriod() {
  const now = new Date();
  const hour = now.getHours();

  if (hour >= 8 && hour < 16) {
    return "ในเวลา";
  } else if (hour >= 17 && hour <= 20) {
    return "นอกเวลา";
  } else {
    return "⏳ อยู่นอกช่วงที่กำหนด (ไม่ได้เปิดให้จอง)";
  }
}

console.log("📌 สถานะเวลา:", checkTimePeriod());
