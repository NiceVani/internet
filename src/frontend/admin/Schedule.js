async function fetchSchedule() {
    try {
        const roomsFilter = getRoomFromPath(); // ✅ ดึง roomId จาก URL
        const response = await fetch(`http://localhost:3001/data/room_schedule?roomId=${roomsFilter}`);
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

        const reverseDayMapping = {
            1: 'วันจันทร์',
            2: 'วันอังคาร',
            3: 'วันพุธ',
            4: 'วันพฤหัสบดี',
            5: 'วันศุกร์',
            6: 'วันเสาร์',
            7: 'วันอาทิตย์'
        };

        const tableBody = document.querySelector('tbody');

        // ✅ ใส่ชื่อวันให้ทุกแถว
        Array.from(tableBody.rows).forEach((row, index) => {
            const firstCell = row.insertCell(0);
            firstCell.textContent = reverseDayMapping[index + 1] || '';
            firstCell.className = 'text-center fw-bold';
        });

        // ✅ ตั้งค่า cell ที่ไม่มีข้อมูล
        for (let row of tableBody.rows) {
            for (let cell of Array.from(row.cells).slice(1)) {
                if (!cell.hasAttribute('data-status')) {
                    cell.setAttribute('data-status', 'ว่าง');
                    cell.setAttribute('data-id', 'none');
                    updateCellAppearance(cell);
                    cell.onclick = () => changeStatus(cell);
                }
            }
        }

        // ✅ เติมข้อมูลจาก backend
        scheduleData
            .filter(item => item.room_id == roomsFilter)
            .forEach(item => {
                const rawDay = item.week_day || '';
                const dayIndex = dayMapping[rawDay.replace('วัน', '').trim()];
                if (!dayIndex) {
                    console.warn(`⚠️ ไม่รู้จักชื่อวัน: ${item.week_day}`);
                    return;
                }

                const startHour = parseInt(item.start_time.split(':')[0], 10);
                const endHour = parseInt(item.end_time.split(':')[0], 10);

                const row = tableBody.rows[dayIndex - 1]; // ✅ ตรงแถวแน่นอน
                if (!row) return;

                for (let hour = startHour; hour < endHour; hour++) {
                    const cell = row.cells[hour - 8 + 1]; // ✅ offset +1 เพราะ cell[0] คือชื่อวัน
                    if (cell) {
                        cell.setAttribute('data-id', item.room_schedule_id || 'none');
                        cell.setAttribute('data-status', item.room_status);
                        updateCellAppearance(cell);
                        cell.onclick = () => changeStatus(cell);
                    }
                }
            });

    } catch (error) {
        console.error('❌ Error fetching schedule:', error);
    }
}


async function changeStatus(cell) {
    const statuses = ['ว่าง', 'มีเรียน', 'ไม่ว่าง', 'กำลังปรับปรุง'];

    let currentStatus = (cell.getAttribute('data-status') || '').trim();
    let currentIndex = statuses.indexOf(currentStatus);
    if (currentIndex === -1) currentIndex = 0;

    let nextStatus = statuses[(currentIndex + 1) % statuses.length];
    const scheduleId = cell.getAttribute('data-id');
    const hour = cell.cellIndex + 8 - 1;
    const startTime = `${hour}:00:00`;
    const endTime = `${hour + 1}:00:00`;
    const roomsFilter = getRoomFromPath();
    const row = cell.parentElement;
    const weekDayText = row.cells[0].textContent.replace('วัน', '').trim();

    console.log('📌 cell clicked:', {
        id: scheduleId,
        current: currentStatus,
        next: nextStatus,
        day: weekDayText,
        time: `${startTime} - ${endTime}`
    });

    // ✅ อัปเดต cell UI ก่อนเสมอ
    cell.setAttribute('data-status', nextStatus);
    updateCellAppearance(cell);

    try {
        // ✅ ถ้ายังไม่มี scheduleId (new cell)
        if (!scheduleId || scheduleId === 'none') {
            if (nextStatus === 'ว่าง') {
                console.log('🛑 ข้าม insert: สถานะ "ว่าง" ไม่ต้องบันทึก DB');
                return;
            }

            console.log('📝 Inserting new schedule record...');
            const dataToSend = {
                roomId: roomsFilter,
                weekDay: weekDayText,
                scheduleDate: null,
                startTime: startTime,
                endTime: endTime,
                status: nextStatus
            };

            const response = await fetch('http://localhost:3001/insertSchedule', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSend)
            });

            const result = await response.json();
            if (response.ok) {
                console.log('✅ Inserted schedule:', result);
                cell.setAttribute('data-id', result.newScheduleId);
            } else {
                console.error('❌ Insert error:', result.message);
                alert('เกิดข้อผิดพลาดในการเพิ่มข้อมูลใหม่');
            }
            return;
        }

        // ✅ ถ้าเปลี่ยนเป็น "ว่าง" → ลบข้อมูลออกจาก DB
        if (nextStatus === 'ว่าง') {
            console.log('🗑 ลบข้อมูล schedule ออกจาก DB');
            const deleteResponse = await fetch('http://localhost:3001/deleteSchedule', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ scheduleId })
            });

            if (deleteResponse.ok) {
                console.log('✅ ลบ schedule สำเร็จ');
                cell.setAttribute('data-id', 'none'); // รีเซ็ต id
            } else {
                console.error('❌ Error deleting schedule');
                alert('เกิดข้อผิดพลาดในการลบข้อมูล');
            }
            return;
        }

        // ✅ ถ้าสถานะเดิม = สถานะใหม่ → ไม่ต้อง update
        if (currentStatus === nextStatus) {
            console.log('⚠️ สถานะเหมือนเดิม ไม่ต้องอัปเดต DB');
            return;
        }

        // ✅ UPDATE
        const updateResponse = await fetch('http://localhost:3001/updateScheduleStatus', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                scheduleId: scheduleId,
                status: nextStatus
            })
        });

        if (updateResponse.ok) {
            console.log(`✅ อัปเดตสถานะ "${nextStatus}" สำเร็จ`);
        } else {
            console.error('❌ Error updating schedule status');
            alert('เกิดข้อผิดพลาดในการอัปเดตสถานะ');
        }
    } catch (error) {
        console.error('❌ Network error:', error);
        alert('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้');
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

function updateCellAppearance(cell) {
    const status = cell.getAttribute('data-status');
    cell.className = 'status-cell';
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

document.addEventListener("DOMContentLoaded", fetchSchedule);