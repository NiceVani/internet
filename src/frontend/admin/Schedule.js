async function fetchSchedule() {
    try {
        const scheduleDate = getScheduleDate(); // Function to get the selected schedule date
        const response = await fetch(`http://localhost:3001/data/room_schedule?date=${scheduleDate}`);
        const scheduleData = await response.json();

        const dayMapping = {
            'จันทร์': 1,
            'อังคาร': 2,
            'พุธ': 3,
            'พฤหัสบดี': 4,
            'ศุกร์': 5,
            'เสาร์': 6,
            'อาทิตย์': 7
        };

        // Set up the table and prepare cells
        for (let i = 1; i <= 7; i++) {
            for (let j = 2; j <= 14; j++) {
                const cell = document.querySelector(`tbody tr:nth-child(${i}) td:nth-child(${j})`);
                if (cell) {
                    cell.classList.add('status-cell');
                    cell.setAttribute('data-status', 'ว่าง'); // Default value
                    updateCellAppearance(cell);
                    cell.addEventListener('click', () => changeStatus(cell));
                }
            }
        }

        // Set roomsFilter based on HTML page
        let roomsFilter = getRoomFromPath();
        
        // Fill data from the database
        scheduleData
            .filter(item => item.room_id === roomsFilter)
            .forEach(item => {
                console.log('✅ Item found:', item);
                const dayIndex = dayMapping[item.week_day];
                const startHour = parseInt(item.start_time.split(':')[0], 10);
                const endHour = parseInt(item.end_time.split(':')[0], 10);

                for (let hour = startHour; hour < endHour; hour++) {
                    const cell = document.querySelector(`tbody tr:nth-child(${dayIndex}) td:nth-child(${hour - 8 + 2})`);
                    if (cell) {
                        cell.setAttribute('data-id', item.room_schedule_id || 'none');  // Use room_schedule_id
                        cell.setAttribute('data-status', item.room_status);
                        updateCellAppearance(cell);
                    } else {
                        console.warn(`⚠️ Cell not found for dayIndex: ${dayIndex}, hour: ${hour}`);
                    }
                }
            });
    } catch (error) {
        console.error('❌ Error fetching schedule:', error);
    }
}

// Function to change cell status
async function changeStatus(cell) {
    const statuses = ['ว่าง', 'มีเรียน', 'ไม่ว่าง', 'กำลังปรับปรุง'];
    let currentStatus = cell.getAttribute('data-status');
    let nextStatus = statuses[(statuses.indexOf(currentStatus) + 1) % statuses.length];

    cell.setAttribute('data-status', nextStatus);
    updateCellAppearance(cell);

    try {
        const scheduleId = cell.getAttribute('data-id');
        const day = cell.parentElement.rowIndex + 1; // Get day from row index
        const hour = cell.cellIndex + 8 - 1; // Get start time from column index
        const startTime = `${hour}:00:00`;
        const endTime = `${hour + 1}:00:00`;

        const roomsFilter = getRoomFromPath(); // Get room ID from URL path
        const scheduleDate = getScheduleDate(); // Get selected date

        const body = {
            roomId: roomsFilter,
            weekDay: getDayName(day),
            scheduleDate: scheduleDate,
            startTime: startTime,
            endTime: endTime,
            status: nextStatus
        };

        if (!scheduleId || scheduleId === 'none') {
            // 📌 Insert new record
            console.log('📝 Inserting new schedule record...');
            const response = await fetch('http://localhost:3001/insertSchedule', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });

            const result = await response.json();

            if (response.ok) {
                console.log('✅ New schedule record inserted!', result);
                cell.setAttribute('data-id', result.newScheduleId); // Update data-id with new ID
            } else {
                console.error('❌ Error inserting new schedule:', result.message);
                alert('เกิดข้อผิดพลาดในการเพิ่มข้อมูลใหม่');
            }
            return;
        }

        // 📌 Update existing record
        const updateResponse = await fetch('http://localhost:3001/updateScheduleStatus', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                scheduleId: scheduleId,
                status: nextStatus
            }),
        });

        if (updateResponse.ok) {
            console.log(`✅ อัปเดตสถานะเป็น "${nextStatus}" สำเร็จ!`);
        } else {
            console.error('❌ Error updating status');
            alert('เกิดข้อผิดพลาดในการอัปเดตสถานะ');
        }
    } catch (error) {
        console.error('❌ Error:', error);
        alert('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้');
    }
}

// Function to get day name based on index
function getDayName(dayIndex) {
    const days = ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์', 'อาทิตย์'];
    return days[dayIndex - 2];
}

// Function to get room ID from the path
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

// Function to get the selected schedule date
function getScheduleDate() {
    const dateInput = document.querySelector('#scheduleDateInput'); // Assuming you have an input field for the date
    return dateInput ? dateInput.value : new Date().toISOString().split('T')[0]; // Default to today's date if not set
}

// Function to update UI of cell based on status
function updateCellAppearance(cell) {
    const status = cell.getAttribute('data-status');
    cell.className = 'status-cell'; // Clear previous class
    switch (status) {
        case 'มีเรียน':
            cell.classList.add('status-occupied');
            cell.textContent = '📚 มีเรียน';
            break;
        case 'ไม่ว่าง':
            cell.classList.add('status-unavailable');
            cell.textContent = '🚫 ไม่ว่าง';
            break;
        case 'กำลังปรับปรุง':
            cell.classList.add('status-maintenance');
            cell.textContent = '🔧 กำลังปรับปรุง';
            break;
        case 'ว่าง':
            cell.classList.add('status-available');
            cell.textContent = '';
            break;
        default:
            cell.textContent = '-';
    }
}

// Fetch the schedule on DOM content loaded
document.addEventListener('DOMContentLoaded', fetchSchedule);
