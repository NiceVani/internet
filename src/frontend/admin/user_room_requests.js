async function fetchData() {
    try {
        // Fetch room requests and student data
        const [roomsResponse, studentsResponse] = await Promise.all([
            fetch('http://localhost:3000/data/Rooms_list_requests'),
            fetch('http://localhost:3000/data/Student_information')
        ]);

        const roomsData = await roomsResponse.json();
        const studentsData = await studentsResponse.json();

        const filteredData = roomsData.filter(row => 
            row.Requests_status === 'รออนุมัติ' || row.Requests_status === 'รอดำเนินการ'
        );
        
        const mergedData = filteredData.map(room => {
            const student = studentsData.find(s => s.Student_ID === room.Identify_ID) || {};
            return {
                ...room,
                email: student.Email || '-',
                Name: student.Name || '-',
            };
        });

        console.log("✅ ข้อมูลที่รวมกันแล้ว:", mergedData);

        const tableBody = document.getElementById('reservation-table');
        tableBody.innerHTML = '';

        mergedData.forEach(row => {
            tableBody.innerHTML += `
                <tr>  
                    <td class="text-center">${new Date(row.Used_date).toLocaleDateString()}</td>
                    <td class="text-center">${row.Name}</td>
                    <td class="text-center">${row.email}</td>
                    <td class="text-center">${row.Rooms_ID}</td>
                    <td class="text-center">
                        ${getDayOfWeek(row.Used_date) + ' ' + new Date(row.Used_date).toLocaleDateString()}<br>
                        ${row.Start_time.slice(0, 5) + ' - ' + row.End_time.slice(0, 5)}<br>
                        ${'(' + row.Requests_types + ')'}
                    </td>
                    <td class="text-center">${row.Document}</td>
                    <td class="text-center">${row.Reason}</td>
                    <td class="text-center">
                        ${
                            row.Requests_status === 'รออนุมัติ'
                                ? '<span class="badge bg-warning">รออนุมัติ</span>'
                                : `
                                    <button class="btn btn-success btn-sm" onclick="updateStatus(${row.Rooms_requests_ID}, 'รออนุมัติ')">✅ อนุมัติ</button>
                                    <button class="btn btn-danger btn-sm" onclick="updateStatus(${row.Rooms_requests_ID}, 'ไม่อนุมัติ')">❌ ไม่อนุมัติ</button>
                                  `
                        }
                    </td>
                </tr>
            `;
        });
        

    } catch (error) {
        console.error('❌ Error fetching data:', error);
    }
}

// Function to update status
async function updateStatus(requestId, newStatus) {
    try {
        const response = await fetch('http://localhost:3000/updateStatus', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ requestId, status: newStatus }),
        });

        if (response.ok) {
            alert(`อัปเดตสถานะเป็น "${newStatus}" สำเร็จ!`);
            fetchData(); // โหลดข้อมูลใหม่หลังอัปเดตสถานะ
        } else {
            const error = await response.json();
            console.error("❌ Error:", error.message);
            alert("เกิดข้อผิดพลาดในการอัปเดตสถานะ");
        }
    } catch (error) {
        console.error("❌ Error updating status:", error);
        alert("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
    }
}

document.addEventListener("DOMContentLoaded", fetchData);

document.getElementById('detailModal').addEventListener('show.bs.modal', function (event) {
    const button = event.relatedTarget;
    document.getElementById('modal-date').textContent = button.getAttribute('data-date');
    document.getElementById('modal-name').textContent = button.getAttribute('data-name');
    document.getElementById('modal-email').textContent = button.getAttribute('data-email');
    document.getElementById('modal-room').textContent = button.getAttribute('data-room');
    document.getElementById('modal-time').textContent = button.getAttribute('data-time');
    document.getElementById('modal-reason').textContent = button.getAttribute('data-reason');
});

// Function to get the day of the week
function getDayOfWeek(dateString) {
    const days = ["อา.", "จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส."];
    const date = new Date(dateString);
    return days[date.getDay()];  // Returns 0-6 (0 = Sunday, 1 = Monday, ...)
}
