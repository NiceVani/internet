async function fetchSchedule() {
    try {
        const response = await fetch(`http://localhost:3001/data/Rooms_schedule_time`);
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

        // ตั้งค่าตารางและเตรียมเซลล์
        for (let i = 1; i <= 7; i++) {
            for (let j = 2; j <= 14; j++) {
                const cell = document.querySelector(`tbody tr:nth-child(${i}) td:nth-child(${j})`);
                if (cell) {
                    cell.classList.add('status-cell');
                    cell.setAttribute('data-status', 'ว่าง'); // ค่าเริ่มต้น
                    updateCellAppearance(cell);
                    cell.addEventListener('click', () => changeStatus(cell));
                }
            }
        }

        // กำหนดค่า roomsFilter ตามหน้า HTML
        let roomsFilter = getRoomFromPath();
        
        // เติมข้อมูลจากฐานข้อมูล
        scheduleData
    .filter(item => item.Rooms_ID === roomsFilter)
    .forEach(item => {
        console.log('✅ Item found:', item);
        const dayIndex = dayMapping[item.Week_days];
        const startHour = parseInt(item.Start_time.split(':')[0], 10);
        const endHour = parseInt(item.End_time.split(':')[0], 10);

        for (let hour = startHour; hour < endHour; hour++) {
            const cell = document.querySelector(`tbody tr:nth-child(${dayIndex}) td:nth-child(${hour - 8 + 2})`);
            if (cell) {
                cell.setAttribute('data-id', item.Schedule_time_ID || 'none');  // Use Schedule_time_ID
                cell.setAttribute('data-status', item.Rooms_status);
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

// 🛠️ ฟังก์ชันเปลี่ยนสถานะ
async function changeStatus(cell) {
    const statuses = ['ว่าง', 'มีเรียน', 'ไม่ว่าง', 'กำลังปรับปรุง'];
    let currentStatus = cell.getAttribute('data-status');
    let nextStatus = statuses[(statuses.indexOf(currentStatus) + 1) % statuses.length];

    cell.setAttribute('data-status', nextStatus);
    updateCellAppearance(cell);

    try {
        const scheduleId = cell.getAttribute('data-id');
        const day = cell.parentElement.rowIndex + 1; // ดึงชื่อวันจาก row index
        const hour = cell.cellIndex + 8 - 1; // ดึงช่วงเวลา (Start_time) จาก column index
        const startTime = `${hour}:00:00`;
        const endTime = `${hour + 1}:00:00`;

        const roomsFilter = getRoomFromPath(); // ดึง Rooms_ID จาก URL path

        if (!scheduleId || scheduleId === 'none') {
            // 📌 Insert ข้อมูลใหม่
            console.log('📝 Inserting new schedule record...');
            const response = await fetch('http://localhost:3001/insertSchedule', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    roomId: roomsFilter,
                    day: getDayName(day),
                    startTime: startTime,
                    endTime: endTime,
                    status: nextStatus
                }),
            });

            const result = await response.json();

            if (response.ok) {
                console.log('✅ New schedule record inserted!', result);
                cell.setAttribute('data-id', result.newScheduleId); // อัปเดต data-id ด้วย ID ใหม่
            } else {
                console.error('❌ Error inserting new schedule:', result.message);
                alert('เกิดข้อผิดพลาดในการเพิ่มข้อมูลใหม่');
            }
            return;
        }

        // 📌 Update ข้อมูลที่มีอยู่
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

function getDayName(dayIndex) {
    const days = ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์', 'อาทิตย์'];
    return days[dayIndex - 2];
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

// 🎨 ฟังก์ชันอัปเดต UI ของเซลล์ตามสถานะ
function updateCellAppearance(cell) {
    const status = cell.getAttribute('data-status');
    cell.className = 'status-cell'; // ล้าง class เดิม
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

document.addEventListener('DOMContentLoaded', fetchSchedule);