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
  let startOfWeek = new Date(date);
  let dayOfWeek = startOfWeek.getDay(); // 0=อาทิตย์,1=จันทร์,...6=เสาร์
  let diff = startOfWeek.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
  startOfWeek.setDate(diff);
  return startOfWeek;
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
async function fetchSchedule() {
  try {
    // ดึงข้อมูล "มีเรียน" จาก /getSchedule
    const response = await fetch("http://localhost:3000/getSchedule");
    const data = await response.json();

    // ดึงข้อมูลการจอง (อนุมัติแล้ว)
    const bookingResponse = await fetch(
      "http://localhost:3000/Rooms_list_requests"
    );
    let bookings = await bookingResponse.json();

    // กรองเฉพาะการจองที่อนุมัติ
    bookings = bookings.filter((b) => b.Requests_status === "อนุมัติ");

    console.log("Schedule Data:", data);
    console.log("Approved Bookings:", bookings);

    // เลือก <tbody>
    const tbody = document.querySelector("tbody");
    if (!tbody) {
      console.error("Table body (tbody) not found!");
      return;
    }

    // getStartOfWeek(วันนี้)
    const startOfWeek = getStartOfWeek(new Date());

    /********************************
     * สร้างตาราง (days x timeSlots)
     ********************************/
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
                  // สิ้นสุดของช่อง
                  const endSlot = timeSlots[i + 1] || addOneHour(startSlot);

                  // หาใน data ว่าเป็น "มีเรียน" ไหม
                  const isClass = data.some(
                    (d) =>
                      d.Week_days?.trim() === day && d.Start_time === startSlot
                  );

                  // หาใน bookings ว่าเป็น "จองแล้ว" ไหม
                  const isBooked = bookings.some((b) => {
                    // เช็ควัน
                    // แปลง b.Used_date => dd/mm/yyyy
                    const bookingDate = new Date(b.Used_date);
                    const bookingFormatted = getFormattedDate(bookingDate);
                    if (bookingFormatted !== formattedDate) return false;
                    // เช็คว่า slot นี้ (startSlot-endSlot) ซ้อนกับ b.Start_time-b.End_time ไหม
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

                  // จัดสี + ข้อความ
                  if (isClass) {
                    return `<td class="class-time">มีเรียน</td>`;
                  } else if (isBooked) {
                    return `<td class="booked-time">จองแล้ว</td>`;
                  } else {
                    return `<td class="available" onclick="toggleSelection(this)">
                              <!-- ช่องว่าง (เลือกได้) -->
                            </td>`;
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

  // สร้างโครงตารางอย่างง่าย (days x timeSlots)
  tbody.innerHTML = days
    .map((day, index) => {
      const currentDate = new Date(startOfWeek);
      currentDate.setDate(startOfWeek.getDate() + index);

      const formattedDate = getFormattedDate(currentDate);
      const isWeekend = index === 5 || index === 6;

      return `
          <tr>
            <td data-day="${index}" class="${isWeekend ? "disabled" : ""}">
              ${day} (${formattedDate})
            </td>
            ${timeSlots
              .map(() => {
                return `<td class="available" ${
                  isWeekend ? "disabled" : ""
                }></td>`;
              })
              .join("")}
          </tr>
        `;
    })
    .join("");

  // เรียก fetchSchedule() เพื่อแทนค่าที่เป็น "มีเรียน" หรือ "จองแล้ว"
  await fetchSchedule();
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
  const startOfWeek = getStartOfWeek(selectedDate);

  const tableRows = document.querySelectorAll("#schedule-table tbody tr");
  tableRows.forEach((row) => {
    const dayCell = row.querySelector("td");
    if (!dayCell) return;

    const dayIndex = parseInt(dayCell.dataset.day);
    if (isNaN(dayIndex)) return;

    const dateInRow = new Date(startOfWeek);
    dateInRow.setDate(startOfWeek.getDate() + dayIndex);

    if (getFormattedDate(dateInRow) === getFormattedDate(selectedDate)) {
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

  // สมมติว่าเลือกในวันเดียว
  let selectedTimes = [];
  let selectedDay = null;
  let selectedDate = null;

  selectedCells.forEach((cell) => {
    const row = cell.closest("tr");
    const dayCell = row.querySelector("td");
    // "จันทร์ (14/02/2568)"
    console.log(dayCell.textContent);
    const [dayName, dateStr] = dayCell.textContent.trim().split(/\s+/);
    console.log("dayName:", dayName);
    console.log("dateStr:", dateStr);

    // dateStr => "(14/02/2568)" เอาวงเล็บออก
    const dateOnly = dateStr.replace(/[()]/g, "");

    // แปลงวันที่จาก dd/mm/yyyy เป็น yyyy-mm-dd
    const [day, month, year] = dateOnly.split("/");

    // แปลงปี พ.ศ. เป็น ค.ศ. โดยการลบ 543
    const yearInAD = parseInt(year) - 543;

    // สร้างวันที่ในรูปแบบ yyyy-mm-dd
    selectedDate = `${yearInAD}-${month}-${day}`;

    if (!selectedDay) {
      selectedDay = dayName;
    }

    // index ของเซลล์
    const cellIndex = Array.from(row.children).indexOf(cell);
    // timeSlots[cellIndex-1] => เวลาเริ่มต้น
    selectedTimes.push(timeSlots[cellIndex - 1]);
  });

  selectedTimes.sort();

  // แสดงค่า selectedDay, selectedDate, selectedTimes ก่อนส่ง
  console.log("Selected Day:", selectedDay);
  console.log("Selected Date:", selectedDate); // วันที่ในรูปแบบ yyyy-mm-dd
  console.log("Selected Times:", selectedTimes);

  // สมมติ room เป็นค่าคงที่หรือดึงจาก URL/หน้า
  const urlParams = new URLSearchParams(window.location.search);
  const roomId = urlParams.get("room") || "212";

  // สร้างพารามิเตอร์ส่งไปหน้าอื่น
  const queryParams = new URLSearchParams({
    date: selectedDate,
    room: roomId,
    startTime: selectedTimes[0],
    endTime: selectedTimes[selectedTimes.length - 1],
  });
  console.log(selectedTimes[0]);
  // แสดงค่าพารามิเตอร์ที่จะส่งผ่าน URL
  console.log("Query Parameters to Send:", queryParams.toString());

  // ไปหน้า nextPage.html
  window.location.href = `nextPage.html?${queryParams.toString()}`;
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
});

function toggleSelection(cell) {
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

  // ตรวจสอบว่ามี cell อื่นในแถวเดียวกันที่ checked อยู่หรือไม่ (เพื่อไม่ให้เลือกข้ามช่วง)
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

  // toggle คลาส checked
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
