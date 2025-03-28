let selectedDesks = new Set();

async function loadDesks() {
  try {
    const response = await fetch("http://localhost:3001/data/computer_management");
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
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการโหลดข้อมูล:", error);
  }
}

async function toggleDesk(desk) {
  // ตรวจสอบว่าเครื่องเสียหรือไม่
  const isDamaged = desk.classList.contains("damaged");

  // ถ้าคอมพิวเตอร์ไม่เสีย (สีเขียว) หรือเสีย (สีแดง)
  if (isDamaged || desk.classList.contains("usable")) {
    // เปลี่ยนสถานะใน UI
    desk.classList.toggle("selected");

    const deskId = desk.dataset.id;
    const roomId = desk.dataset.room;

    console.log('Sending request to update computer status');
    console.log('computer_id:', deskId);
    console.log('room_id:', roomId);

    // ตรวจสอบสถานะปัจจุบันของคอมพิวเตอร์
    let currentStatus = desk.classList.contains("selected") ? 'ใช้งานได้' : 'ใช้งานไม่ได้';

    // หากสถานะเป็น "ใช้งานได้" ให้เปลี่ยนเป็น "ใช้งานไม่ได้" และกลับกัน
    if (currentStatus === 'ใช้งานได้') {
      currentStatus = 'ใช้งานไม่ได้';
    } else {
      currentStatus = 'ใช้งานได้';
    }

    // อัพเดตสถานะของคอมพิวเตอร์
    try {
      const response = await fetch('http://localhost:3001/updateComputerStatus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          computer_id: deskId,
          room_id: roomId,
          computer_status: currentStatus
        })
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`HTTP error! Status: ${response.status}, ${errorMessage}`);
      }

      // ถ้าสถานะเป็น "ใช้งานได้" จะเพิ่ม ID ไปใน selectedDesks
      if (currentStatus === 'ใช้งานได้') {
        selectedDesks.add(deskId);
        desk.classList.remove("damaged");
        desk.classList.add("usable");
      } else {
        selectedDesks.delete(deskId);
        desk.classList.remove("usable");
        desk.classList.add("damaged");
      }

    } catch (error) {
      console.error("Error updating computer status:", error);
      alert(`เกิดข้อผิดพลาดในการอัปเดตสถานะคอมพิวเตอร์: ${error.message}`);
      // รีเซ็ต UI หากเกิดข้อผิดพลาด
      desk.classList.toggle("selected");
    }
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const roomId = urlParams.get("room");
  console.log("🔍 ค่า roomId ที่ดึงได้:", roomId);

  if (!roomId) {
    console.error("❌ ไม่พบ roomId ใน URL");
    return;
  }
});

async function loadEquipments() {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const room = urlParams.get("room");

    if (!room) {
      throw new Error("❌ ไม่พบ room ใน URL");
    }

    const response = await fetch(`http://localhost:3001/getEquipments?room=${room}`);
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

      // ✅ สร้าง input field ให้พิมพ์จำนวนได้
      const input = document.createElement("input");
      input.type = "number";
      input.value = parseInt(equipment.stock_quantity, 10);
      input.min = 0;
      
      itemContainer.appendChild(input);

      // ✅ อัปเดตจำนวนเมื่อผู้ใช้กด Enter หรือออกจากช่อง
      input.addEventListener("change", async () => {
        const newQuantity = parseInt(input.value, 10);

        // ตรวจสอบค่าที่ป้อนเข้ามา
        if (isNaN(newQuantity) || newQuantity < 0) {
          alert("❌ กรุณากรอกจำนวนที่ถูกต้อง!");
          input.value = equipment.stock_quantity; // รีเซ็ตค่า
          return;
        }

        await updateEquipmentStock(equipment.equipment_id, room, newQuantity);
      });

      equipmentContainer.appendChild(itemContainer);
    });
  } catch (error) {
    console.error("❌ เกิดข้อผิดพลาดในการโหลดอุปกรณ์:", error);
  }
}

async function updateEquipmentStock(equipmentId, roomId, newQuantity) {
  try {
    console.log("🔄 กำลังอัปเดตอุปกรณ์:", { equipmentId, roomId, newQuantity });

    const response = await fetch("http://localhost:3001/updateEquipmentStock", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        equipment_id: equipmentId,
        room_id: roomId,
        new_quantity: newQuantity,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log("✅ อัปเดตอุปกรณ์สำเร็จ:", data);

    // ✅ โหลดข้อมูลอุปกรณ์ใหม่เพื่อให้ค่าถูกต้อง
    await loadEquipments();

  } catch (error) {
    console.error("❌ เกิดข้อผิดพลาดในการอัปเดตอุปกรณ์:", error);
  }
}

// เรียกใช้งานฟังก์ชันเมื่อหน้าเว็บโหลดเสร็จ
document.addEventListener("DOMContentLoaded", loadEquipments);

document.addEventListener("DOMContentLoaded", () => {
  loadDesks();
  loadEquipments();

  const roomId = new URLSearchParams(window.location.search).get("room");
  console.log(roomId);

  if (roomId) {
    document.getElementById("room-name").textContent = `ห้อง: SC2-${roomId}`;
    // สำหรับทำปุ่มย้อนกลับไปหน้า Schedule
    document.getElementById("back-btn").href = `Schedule.html?room=${roomId}`;
    console.log(`Loading schedule for room SC2-${roomId}`);
  }
});

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