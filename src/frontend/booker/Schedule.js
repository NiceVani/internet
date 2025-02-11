/********************************
 * 1) ตัวแปร days, timeSlots
 ********************************/
const days = [
  "จันทร์",
  "อังคาร",
  "พุธ",
  "พฤหัสบดี",
  "ศุกร์",
  "เสาร์",
  "อาทิตย์",
];

const timeSlots = [
  "08:00:00",
  "09:00:00",
  "10:00:00",
  "11:00:00",
  "12:00:00",
  "13:00:00",
  "14:00:00",
  "15:00:00",
  "16:00:00",
  "17:00:00",
  "18:00:00",
  "19:00:00",
  "20:00:00",
];

/********************************
 * 2) ฟังก์ชัน getStartOfWeek(date)
 *    - หา "วันจันทร์" ของสัปดาห์
 ********************************/
function getStartOfWeek(date) {
  const selectedDate = new Date(date);
  const dayOfWeek = selectedDate.getDay(); // ค่าของวัน (0 = อาทิตย์, 1 = จันทร์, ..., 6 = เสาร์)

  // ถ้าวันอาทิตย์ (0) ต้องเลื่อนกลับไปวันจันทร์ของสัปดาห์ก่อนหน้า
  const startOfWeek = new Date(selectedDate);
  startOfWeek.setDate(
    selectedDate.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1)
  );

  return startOfWeek; // คืนค่าวันจันทร์ของสัปดาห์ที่เลือก
}

/********************************
 * 3) getFormattedDate(date)
 *    - แปลงเป็น dd/mm/yyyy (ปีพ.ศ.)
 ********************************/
function getFormattedDate(date) {
  const dayOfMonth = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear() + 543;
  return `${dayOfMonth}/${month}/${year}`;
}

/********************************
 * 4) addOneHour(time)
 *    - เพิ่มเวลา 1 ชม. (HH:MM:SS)
 ********************************/
function addOneHour(time) {
  const timePattern = /^\d{2}:\d{2}:\d{2}$/;
  if (!timePattern.test(time)) {
    throw new Error("รูปแบบเวลาไม่ถูกต้อง ควรเป็น HH:MM:SS");
  }
  const [hour, minute, second] = time.split(":").map(Number);
  const date = new Date();
  date.setHours(hour, minute, second);
  date.setHours(date.getHours() + 1);
  return date.toTimeString().slice(0, 8);
}

/********************************
 * 5) showAlert(message)
 *    - popup สีแดงแจ้งเตือน 3 วิ
 ********************************/
function showAlert(message) {
  const alertDiv = document.createElement("div");
  alertDiv.style.position = "fixed";
  alertDiv.style.top = "20px";
  alertDiv.style.left = "50%";
  alertDiv.style.transform = "translateX(-50%)";
  alertDiv.style.backgroundColor = "#f44336";
  alertDiv.style.color = "white";
  alertDiv.style.padding = "10px 20px";
  alertDiv.style.fontSize = "16px";
  alertDiv.style.borderRadius = "5px";
  alertDiv.textContent = message;

  document.body.appendChild(alertDiv);

  setTimeout(() => {
    alertDiv.remove();
  }, 3000);
}

/********************************
 * 6) fetchSchedule()
 *    - ดึงข้อมูลการเรียน + การจอง
 *    - แสดงผลใน <tbody>
 ********************************/
async function fetchSchedule(selectedDate) {
  try {
    // หาวันจันทร์ของสัปดาห์ที่เลือก
    const startOfWeek = getStartOfWeek(new Date(selectedDate));

    // ดึงข้อมูล "มีเรียน" และ "จองแล้ว"
    const response = await fetch("http://localhost:3000/getSchedule");
    const data = await response.json();

    const bookingResponse = await fetch(
      "http://localhost:3000/Rooms_list_requests"
    );
    let bookings = await bookingResponse.json();
    bookings = bookings.filter((b) => b.Requests_status === "อนุมัติ");

    console.log("Schedule Data:", data);
    console.log("Approved Bookings:", bookings);

    // เลือก <tbody>
    const tbody = document.querySelector("tbody");
    if (!tbody) {
      console.error("Table body (tbody) not found!");
      return;
    }

    // **สร้างตารางให้ตรงกับสัปดาห์ที่เลือก**
    tbody.innerHTML = days
      .map((day, index) => {
        let currentDate = new Date(startOfWeek);
        currentDate.setDate(startOfWeek.getDate() + index);
        const formattedDate = getFormattedDate(currentDate);

        return `
            <tr>
              <td data-day="${index}">
                ${day} (${formattedDate})
              </td>
              ${timeSlots
                .map((startSlot, i) => {
                  const endSlot = timeSlots[i + 1] || addOneHour(startSlot);
                  const isClass = data.some(
                    (d) =>
                      d.Week_days?.trim() === day && d.Start_time === startSlot
                  );

                  const isBooked = bookings.some((b) => {
                    const bookingDate = new Date(b.Used_date);
                    const bookingFormatted = getFormattedDate(bookingDate);
                    if (bookingFormatted !== formattedDate) return false;

                    const slotStartTime = parseInt(
                      startSlot.replace(":", ""),
                      10
                    );
                    const slotEndTime = parseInt(endSlot.replace(":", ""), 10);
                    const bookingStartTime = parseInt(
                      b.Start_time.replace(":", ""),
                      10
                    );
                    const bookingEndTime = parseInt(
                      b.End_time.replace(":", ""),
                      10
                    );

                    return (
                      slotStartTime < bookingEndTime &&
                      slotEndTime > bookingStartTime
                    );
                  });

                  if (isClass) {
                    return `<td class="class-time">มีเรียน</td>`;
                  } else if (isBooked) {
                    return `<td class="booked-time">จองแล้ว</td>`;
                  } else {
                    return `<td class="available" onclick="toggleSelection(this)"></td>`;
                  }
                })
                .join("")}
            </tr>`;
      })
      .join("");
  } catch (error) {
    console.error("Error fetching schedule:", error);
  }
}

/********************************
 * 7) updateTableForSelectedDate(date)
 *    - เมื่อ user เปลี่ยน date
 *    - สร้างตารางโครง + เรียก fetchSchedule()
 ********************************/
async function updateTableForSelectedDate(date) {
  const selectedDate = new Date(date);
  const startOfWeek = getStartOfWeek(selectedDate);

  const tbody = document.querySelector("tbody");
  if (!tbody) return;

  // **สร้างโครงสร้างของตารางให้ตรงกับสัปดาห์ที่เลือก**
  tbody.innerHTML = days
    .map((day, index) => {
      const currentDate = new Date(startOfWeek);
      currentDate.setDate(startOfWeek.getDate() + index);
      const formattedDate = getFormattedDate(currentDate);
      const isWeekend = index === 5 || index === 6;

      return `
        <tr class="${
          formattedDate === getFormattedDate(selectedDate) ? "highlight" : ""
        }">
          <td data-day="${index}" class="${isWeekend ? "disabled" : ""}">
            ${day} (${formattedDate})  
          </td>
          ${timeSlots
            .map(
              () => `<td class="available" ${isWeekend ? "disabled" : ""}></td>`
            )
            .join("")}
        </tr>
      `;
    })
    .join("");

  // โหลดข้อมูลของสัปดาห์ที่เลือก
  await fetchSchedule(date);

  // ไฮไลต์วันปัจจุบันที่เลือก
  highlightDay(date);
}

/********************************
 * 8) toggleSelection(cell)
 *    - เมื่อคลิกเซลล์ จะเลือก (checked)
 *    - ไม่ให้เลือกข้ามช่วงต่อเนื่อง
 ********************************/
function toggleSelection(cell) {
  // ถ้าเป็น class-time หรือ booked-time => เตือน
  if (
    cell.classList.contains("class-time") ||
    cell.classList.contains("booked-time")
  ) {
    showAlert("ช่วงเวลานี้ไม่ว่าง!");
    return;
  }

  // ตรวจสอบว่ามี cell อื่นในแถวเดียวกันที่ checked อยู่ไหม
  const row = cell.parentElement;
  const selectedCells = row.querySelectorAll(".checked");

  if (selectedCells.length > 0) {
    // index ของ cell ล่าสุด
    const cellIndex = Array.from(row.children).indexOf(cell);
    // index ของ cells ที่เลือกก่อนหน้า
    const selectedIndexes = Array.from(selectedCells).map((c) =>
      Array.from(row.children).indexOf(c)
    );

    selectedIndexes.sort((a, b) => a - b);
    // ถ้าห่างกันมากกว่า 1 => คือข้าม
    if (Math.abs(cellIndex - selectedIndexes[selectedIndexes.length - 1]) > 1) {
      showAlert("ไม่สามารถเลือกข้ามช่วงเวลาได้!");
      return;
    }
  }

  // toggle
  cell.classList.toggle("checked");
  if (cell.classList.contains("checked")) {
    cell.innerHTML = '<i class="fas fa-check"></i>';
  } else {
    cell.innerHTML = "";
  }
}

/********************************
 * 9) highlightDay(date)
 *    - ใส่คลาส .highlight ให้แถวที่ตรงกับ date
 ********************************/
function highlightDay(date) {
  const selectedDate = new Date(date);
  const formattedSelectedDate = getFormattedDate(selectedDate);

  document.querySelectorAll("#schedule-table tbody tr").forEach((row) => {
    const dayCell = row.querySelector("td");
    if (!dayCell) return;

    const dayIndex = parseInt(dayCell.dataset.day);
    if (isNaN(dayIndex)) return;

    const startOfWeek = getStartOfWeek(selectedDate);
    const dateInRow = new Date(startOfWeek);
    dateInRow.setDate(startOfWeek.getDate() + dayIndex);

    if (getFormattedDate(dateInRow) === formattedSelectedDate) {
      row.classList.add("highlight");
    } else {
      row.classList.remove("highlight");
    }
  });
}

/********************************
 * 10) confirmBooking()
 *    - กดปุ่ม "ยืนยัน"
 *    - เอาวันที่, room, startTime, endTime
 *    - ส่งไปหน้าอื่นผ่าน URL
 ********************************/
function confirmBooking() {
  const selectedCells = document.querySelectorAll("td.checked");
  if (selectedCells.length === 0) {
    showAlert("กรุณาเลือกช่วงเวลาที่ต้องการจอง!");
    return;
  }

  // ตรวจสอบว่า cell ที่เลือกมาจากแถวเดียวกันเท่านั้น
  const rowSet = new Set();
  selectedCells.forEach((cell) => rowSet.add(cell.parentElement));
  if (rowSet.size > 1) {
    showAlert("ไม่สามารถเลือกเวลาข้ามวันได้!");
    return;
  }

  // สมมติว่าทุก cell ที่เลือกมาจากแถวเดียวกัน
  const row = selectedCells[0].parentElement;
  const dayCell = row.querySelector("td");
  // ตัวอย่าง textContent: "จันทร์ (14/02/2568)"
  const text = dayCell.textContent.trim();

  // ใช้ Regular Expression จับชื่อวันและวันที่ในวงเล็บ
  const matched = text.match(/^(.*?)\s*\((.*?)\)$/);
  let selectedDay, selectedDate;
  if (matched) {
    selectedDay = matched[1]; // เช่น "จันทร์"
    const dateOnly = matched[2]; // เช่น "14/02/2568"
    // แปลงจาก dd/mm/พ.ศ. เป็น yyyy-mm-dd (เปลี่ยนปีพ.ศ.เป็น ค.ศ.)
    const [d, m, y] = dateOnly.split("/");
    const yearInAD = parseInt(y) - 543;
    selectedDate = `${yearInAD}-${m}-${d}`;
  } else {
    console.error("รูปแบบวันไม่ตรงกับที่คาดไว้:", text);
    return;
  }

  // เก็บ index ของ cell ที่เลือก (ในแต่ละแถว ค่า index เริ่มที่ 0 สำหรับคอลัมน์แรกที่แสดงวัน)
  let selectedIndices = [];
  selectedCells.forEach((cell) => {
    const cellIndex = Array.from(row.children).indexOf(cell);
    selectedIndices.push(cellIndex);
  });
  selectedIndices.sort((a, b) => a - b);
  const startIndex = selectedIndices[0]; // คอลัมน์ที่เริ่ม (cellIndex ในแถว)
  const endIndex = selectedIndices[selectedIndices.length - 1]; // คอลัมน์ที่สิ้นสุด

  // เนื่องจากคอลัมน์แรกใน row เป็นชื่อวัน
  // index ของ timeslot = cellIndex - 1
  const startTime = timeSlots[startIndex - 1];
  let endTime;
  if (endIndex < row.children.length - 1) {
    // หากมี cell ถัดไปใน row ให้ใช้ค่าของ cell ถัดไปใน timeslot arrayเป็นเวลา end
    endTime = timeSlots[endIndex];
  } else {
    // ถ้า cell ที่เลือกเป็น cell สุดท้าย ให้ใช้ addOneHour กับค่า start time ของ cell นั้น
    endTime = addOneHour(timeSlots[endIndex - 1]);
  }

  console.log("Selected Day:", selectedDay);
  console.log("Selected Date:", selectedDate); // รูปแบบ yyyy-mm-dd
  console.log("Start Time:", startTime);
  console.log("End Time:", endTime);

  // ตัวอย่าง: สร้างพารามิเตอร์ส่งไปหน้าอื่น
  const urlParams = new URLSearchParams({
    date: selectedDate,
    room: "307", // สมมติห้อง 307
    startTime: startTime,
    endTime: endTime,
  });
  console.log("Query Parameters to Send:", urlParams.toString());

  // ส่งข้อมูลไปหน้า nextPage.html (ถ้าต้องการ)
  // window.location.href = `nextPage.html?${urlParams.toString()}`;
}

/********************************
 * 11) DOMContentLoaded
 *    - ตั้ง datePicker = วันนี้
 *    - updateTableForSelectedDate(formattedDate)
 *    - highlightDay(formattedDate)
 ********************************/
document.addEventListener("DOMContentLoaded", async function () {
  try {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
    const day = currentDate.getDate().toString().padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;
    document.getElementById("date-picker").value = formattedDate;

    await updateTableForSelectedDate(formattedDate);
    highlightDay(formattedDate);
  } catch (error) {
    console.error("เกิดข้อผิดพลาดขณะโหลดตาราง: ", error);
  }

  // ดึงชื่อห้องจาก URL
  const urlParams = new URLSearchParams(window.location.search);
  const roomName = urlParams.get("room");

  if (roomName) {
    document.getElementById("room-name").textContent = `ห้อง: SC2-${roomName}`;
    loadScheduleForRoom(roomName);
  } else {
    console.error("No room specified!");
  }

  function loadScheduleForRoom(roomName) {
    // ฟังก์ชันโหลดข้อมูลตารางเวลาของห้องที่เลือก
    console.log(`Loading schedule for ${roomName}`);
  }
  // หรือปรับใช้ roomName ใน fetchSchedule() ถ้าต้องการแยกห้อง

  // ✅ เพิ่ม Event Listener ให้ date-picker เมื่อมีการเปลี่ยนแปลง
  document
    .getElementById("date-picker")
    .addEventListener("change", async (event) => {
      const selectedDate = event.target.value;
      await updateTableForSelectedDate(selectedDate);
    });
});

function toggleSelection(cell) {
  // ตรวจสอบว่า cell ที่ถูกคลิกอยู่ในแถวเดียวกับ cell ที่เลือกไปแล้วหรือไม่
  const allCheckedCells = document.querySelectorAll("td.checked");
  if (allCheckedCells.length > 0) {
    // นำ row ของ cell แรกที่ถูกเลือกมาเปรียบเทียบ
    const firstRow = allCheckedCells[0].parentElement;
    const currentRow = cell.parentElement;
    if (firstRow !== currentRow) {
      showAlert("ไม่สามารถเลือกช่วงเวลาข้ามวันได้!");
      return;
    }
  }

  // ดึงข้อมูลของวันจากแถว (ใช้ data-day)
  const dayCell = cell.closest("tr").querySelector("td");
  const dayIndex = dayCell.dataset.day;

  // ตรวจสอบหากเป็นวันเสาร์ (5) หรือวันอาทิตย์ (6)
  if (dayIndex === "5" || dayIndex === "6") {
    showAlert("ไม่สามารถเลือกวันเสาร์หรืออาทิตย์ได้!");
    return; // หยุดการทำงานของฟังก์ชัน
  }

  // หากเซลล์เป็น "class-time" หรือ "booked-time" (มีเรียนหรือจองแล้ว)
  if (
    cell.classList.contains("class-time") ||
    cell.classList.contains("booked-time")
  ) {
    showAlert("ช่วงเวลานี้ไม่ว่าง!");
    return;
  }

  // ตรวจสอบว่ามี cell อื่นในแถวเดียวกันที่เลือกอยู่หรือไม่ (เพื่อไม่ให้เลือกข้ามช่วงในวันเดียว)
  const row = cell.parentElement;
  const selectedCells = row.querySelectorAll(".checked");
  if (selectedCells.length > 0) {
    const cellIndex = Array.from(row.children).indexOf(cell);
    const selectedIndexes = Array.from(selectedCells).map((c) =>
      Array.from(row.children).indexOf(c)
    );
    selectedIndexes.sort((a, b) => a - b);
    if (Math.abs(cellIndex - selectedIndexes[selectedIndexes.length - 1]) > 1) {
      showAlert("ไม่สามารถเลือกข้ามช่วงเวลาได้!");
      return;
    }
  }

  // toggle การเลือก cell
  cell.classList.toggle("checked");
  if (cell.classList.contains("checked")) {
    cell.innerHTML = '<i class="fas fa-check"></i>';
  } else {
    cell.innerHTML = "";
  }
}

/********************************
 * 12) WebSocket
 ********************************/
const socket = io("http://localhost:3000");
socket.on("connect", () => {
  console.log("WebSocket connected!");
});
socket.on("booking_update", fetchSchedule);
