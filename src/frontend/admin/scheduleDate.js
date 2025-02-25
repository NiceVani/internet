document.addEventListener('DOMContentLoaded', async () => {
    const roomId = getRoomFromPath(); // Get room ID from the URL
    document.getElementById('room').value = roomId; // Set the selected room (if dropdown exists)

    await fetchAndDisplaySchedule(roomId); // Fetch and display data when the page loads
});

document.getElementById('date-filter-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const startDate = document.getElementById('start_date').value;
    const endDate = document.getElementById('end_date').value;
    const searchDate = document.getElementById('search_date').value;
    const roomId = getRoomFromPath(); // Auto-detect room from URL

    await fetchAndDisplaySchedule(roomId, startDate, endDate, searchDate);
});

async function fetchAndDisplaySchedule(roomId, startDate = '', endDate = '', searchDate = '') {
    try {
        const queryParams = new URLSearchParams({
            start_date: startDate,
            end_date: endDate,
            search_date: searchDate,
            room_id: roomId
        });

        const response = await fetch(`http://localhost:3001/data/room_schedule?${queryParams.toString()}`);
        const scheduleData = await response.json();

        const tableBody = document.getElementById('schedule-table-body');
        tableBody.innerHTML = ''; // Clear existing data

        // Days of the week
        const daysOfWeek = ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์', 'อาทิตย์'];

        // Initialize an empty schedule for each day
        const weeklySchedule = daysOfWeek.map(day => ({
            day,
            slots: Array(14).fill(null) // 14 slots from 08:00 - 21:00
        }));

        // Populate the schedule based on fetched data
        scheduleData.forEach(item => {
            const dayIndex = daysOfWeek.indexOf(item.week_day);
            const startHour = parseInt(item.start_time.split(':')[0]) - 8;
            const endHour = parseInt(item.end_time.split(':')[0]) - 8;

            for (let hour = startHour; hour < endHour; hour++) {
                weeklySchedule[dayIndex].slots[hour] = item.room_status;
            }
        });

        // Populate the table
        weeklySchedule.forEach(day => {
            const row = document.createElement('tr');
            const dayCell = document.createElement('td');
            dayCell.textContent = day.day;
            row.appendChild(dayCell);

            day.slots.forEach(slot => {
                const cell = document.createElement('td');
                cell.textContent = slot ? slot : ''; // Show status or empty if null
                row.appendChild(cell);
            });

            tableBody.appendChild(row);
        });

        // If no data found, show a message
        if (scheduleData.length === 0) {
            const row = document.createElement('tr');
            const cell = document.createElement('td');
            cell.colSpan = 15;
            cell.textContent = 'ไม่มีข้อมูลสำหรับช่วงวันที่ที่เลือก';
            row.appendChild(cell);
            tableBody.appendChild(row);
        }
    } catch (error) {
        console.error('Error fetching schedule:', error);
    }
}

function getRoomFromPath() {
    const pathname = window.location.pathname;
    if (pathname.includes('Schedule307.html')) return '307';
    if (pathname.includes('Schedule308.html')) return '308';
    if (pathname.includes('Schedule414.html')) return '414';
    if (pathname.includes('Schedule407.html')) return '407';
    if (pathname.includes('Schedule411.html')) return '411';
    if (pathname.includes('Schedule415.html')) return '415';
    if (pathname.includes('Schedule314.html')) return '314';
    if (pathname.includes('Schedule313-1.html')) return '313-1';
    if (pathname.includes('Schedule313.html')) return '313';
    if (pathname.includes('Schedule211.html')) return '211';
    if (pathname.includes('Schedule212.html')) return '212';
    if (pathname.includes('Schedule311.html')) return '311';
    return '';
}