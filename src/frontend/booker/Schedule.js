const days = ["จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์", "อาทิตย์"];
const timeSlots = [
    "08.00-09.00", "09.00-10.00", "10.00-11.00", "11.00-12.00",
    "12.00-13.00", "13.00-14.00", "14.00-15.00", "15.00-16.00",
    "16.00-17.00", "17.00-18.00", "18.00-19.00", "19.00-20.00",
    "20.00-21.00"
];

async function fetchSchedule() {
    try {
        const response = await fetch("http://localhost:3000/getSchedule");
        const data = await response.json();
        const tbody = document.querySelector("tbody");
        tbody.innerHTML = days.map(day => {
            return `<tr>
                <td>${day}</td>
                ${timeSlots.map(slot => {
                const cellData = data.find(d => d.day === day && d.time_slot === slot);
                const cellClass = cellData?.status === "มีการเรียนการสอน" ? "disabled" : "";
                return `<td class="${cellClass}" onclick="toggleSelection(this)">${cellData?.status || ""}</td>`;
            }).join("")}
            </tr>`;
        }).join("");
    } catch (error) {
        console.error("Error fetching schedule:", error);
    }
}

document.addEventListener("DOMContentLoaded", fetchSchedule);
const socket = io("http://localhost:3000");
socket.on("booking_update", fetchSchedule);

console.log("Hello")

async function confirmBooking() {
    const selectedCells = document.querySelectorAll(".checked");
    if (selectedCells.length === 0) return alert("กรุณาเลือกช่วงเวลาที่ต้องการจอง!");

    // เก็บช่วงเวลาที่เลือกในรูปแบบของ array
    const bookings = Array.from(selectedCells).map(cell => {
        const row = cell.parentElement;
        return timeSlots[Array.from(row.children).indexOf(cell) - 1]; // ดึงช่วงเวลา
    });
    console.log("Selected time slots:", bookings);

    // เปลี่ยน array เป็น string โดยใช้เครื่องหมายจุลภาค
    const timeSlotsString = bookings.join(",");

    // try {
    //     const response = await fetch("http://localhost:3000/book", {
    //         method: "POST",
    //         headers: { "Content-Type": "application/json" },
    //         body: JSON.stringify({ time_slots: timeSlotsString }) // ส่งข้อมูลช่วงเวลา
    //     });

    //     const data = await response.json();
    //     alert(data.message);
    //     fetchSchedule();
    // } catch (error) {
    //     console.error("Error booking room:", error);
    // }
}


function toggleSelection(cell) {
    if (!cell.classList.contains("disabled")) {
        cell.classList.toggle("checked");

        // เพิ่มหรือเอาไอคอน checkmark
        if (cell.classList.contains("checked")) {
            cell.innerHTML = '<i class="fas fa-check"></i>';  // เพิ่มไอคอน checkmark
        } else {
            cell.innerHTML = '';  // เอาไอคอนออกเมื่อยกเลิกการติ้ก
        }
    }
}

