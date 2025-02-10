async function fetchRoom() {
    try {
        const [rooms, studentResponse, equipmentsResponse] = await Promise.all([
            fetch('http://localhost:3000/data/Rooms_list_requests'),
            fetch('http://localhost:3000/data/Student_information'),
            fetch('http://localhost:3000/data/Equipments_list_information')
        ]);

        const roomsData = await rooms.json();
        const studentData = await studentResponse.json();
        const equipmentsData = await equipmentsResponse.json();

        // ตรวจสอบว่าอยู่หน้าไหน
        let statusFilter = '';

        if (window.location.pathname.includes('user_approve.html')) {
            statusFilter = 'อนุมัติ';
        } else if (window.location.pathname.includes('user_notapprove.html')) {
            statusFilter = 'ไม่อนุมัติ';
        }

        // คัดกรองตามสถานะที่กำหนด
        const mergedData = roomsData
            .filter(row => row.Requests_status === statusFilter) // ป้องกัน statusFilter เป็น undefined
            .map(row => {
                const student = studentData.find(s => s.Student_ID === row.Identify_ID) || {};
                const equipment = equipmentsData.find(e => e.Equipments_ID === row.Equipments_ID) || {};
                return {
                    ...row,
                    email: student.Email || '-',
                    studentName: student.Name || '-',
                };
            });


        const tableBody = document.getElementById('rooms');
        tableBody.innerHTML = ''; // ล้างข้อมูลเก่า

        mergedData.forEach(row => {
            tableBody.insertAdjacentHTML("beforeend", `
                <tr>
                  <td class="text-center">${new Date(row.Submitted_time).toLocaleDateString()}</td>
                  <td class="text-center">${row.studentName}</td>
                  <td class="text-center">${row.email}</td>
                  <td class="text-center">${row.Rooms_ID || '-'}</td>
                  <td class="text-center">
                    ${getDayOfWeek(row.Used_date) + ', ' + new Date(row.Used_date).toLocaleDateString()}<br>
                    ${row.Start_time.slice(0, 5) + ' - ' + row.End_time.slice(0, 5) || '-'}<br>
                    ${'(' + row.Requests_types + ')' || '-'}
                  </td>
                  <td class="text-center">${row.Reason || '-'}</td>
                  <td class="text-center">${row.Requests_status || '-'}</td>
                </tr>
            `);
        });
    } catch (error) {
        console.error('❌ Error fetching data:', error);
    }
}


function getDayOfWeek(dateString) {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const date = new Date(dateString);
    return days[date.getDay()];  // getDay() คืนค่าเป็นเลข 0-6 (0 = Sunday, 1 = Monday, ...)
  }

// เรียกใRoom() เมื่อโหลดหนRoom();
fetchRoom();