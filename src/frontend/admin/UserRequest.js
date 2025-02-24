async function fetchRoom() {
    try {
        // Fetch data from APIs
        const [roomsResponse, studentsResponse, teachersResponse, roomsIDResponse, participantResponse, equipmentReqResponse, equipmentResponse] = await Promise.all([
            fetch('http://localhost:3001/data/room_request'),
            fetch('http://localhost:3001/data/student'),
            fetch('http://localhost:3001/data/teacher'),
            fetch('http://localhost:3001/data/room'),
            fetch('http://localhost:3001/data/room_request_participant'),
            fetch('http://localhost:3001/data/room_request_equipment'),
            fetch('http://localhost:3001/data/equipment'),
        ]);

        // Convert responses to JSON
        const roomsData = await roomsResponse.json();
        const studentsData = await studentsResponse.json();
        const teachersData = await teachersResponse.json();
        const roomIDData = await roomsIDResponse.json();
        const participantData = await participantResponse.json();
        const equipmentReqData = await equipmentReqResponse.json();
        const equipmentData = await equipmentResponse.json();

        console.log("📌 Rooms:", roomsData);
        console.log("📌 Students:", studentsData);
        console.log("📌 Teachers:", teachersData);
        console.log("📌 Participants:", participantData);

        // Get current page to filter data by status
        let statusFilter = '';
        if (window.location.pathname.includes('user_approve.html')) {
            statusFilter = 'อนุมัติ';
        } else if (window.location.pathname.includes('user_notapprove.html')) {
            statusFilter = 'ไม่อนุมัติ';
        }

        console.log("Current statusFilter:", statusFilter);

        // ✅ Filter rooms based on status
        const filteredData = roomsData.filter(room => !statusFilter || room.request_status === statusFilter);

        // ✅ Count participants per room_request_id
        const participantCountMap = participantData.reduce((acc, participant) => {
            acc[participant.room_request_id] = (acc[participant.room_request_id] || 0) + 1;
            return acc;
        }, {});

        console.log("📌 Participants count:", participantCountMap);

        // ✅ Merge data
        const mergedData = filteredData.map(room => {
            const student = studentsData.find(s => s.student_id === room.student_id) || {};
            const teacher = teachersData.find(t => t.teacher_id === room.teacher_id) || {};
            const roomInfo = roomIDData.find(r => r.room_id === room.room_id) || {};

            // ✅ Filter equipment requests for this room_request_id
            const equipmentReqs = equipmentReqData.filter(e => e.room_request_id === room.room_request_id) || [];

            // ✅ Get equipment details with quantities
            const equipmentDetails = equipmentReqs.map(eq => {
                const equipment = equipmentData.find(ed => ed.equipment_id === eq.equipment_id);
                return equipment ? `${equipment.equipment_name} (${eq.request_quantity})` : '-';
            }).join(', ');

            // ✅ ค้นหารายชื่อผู้เข้าร่วมทั้งหมดที่มี room_request_id เดียวกัน
            const participants = participantData
                .filter(p => p.room_request_id === room.room_request_id)
                .map(p => {
                const student = studentsData.find(s => s.student_id === p.student_id)?.full_name;
                const teacher = teachersData.find(t => t.teacher_id === p.teacher_id)?.full_name;
                return student || teacher || '-';
            })
            .join(', ');            

            return {
                room_request_id: room.room_request_id,
                used_date: room.used_date,
                detail_request_reason: room.detail_request_reason,
                submitted_time: room.submitted_time,
                start_time: room.start_time,
                end_time: room.end_time,
                request_type: room.request_type,
                request_reason: room.request_reason,
                request_status: room.request_status,
                document_path: room.document_path,
                person_name: student.full_name || teacher.full_name || '-',
                email: student.email || teacher.email || '-',
                roomN: roomInfo.room_name || '-',
                participantCount: participantCountMap[room.room_request_id] || 0, // ✅ Count participants
                equipment: equipmentReqs.map(eq => eq.equipment_id).join(', ') || '-', // ✅ Equipment IDs
                equipmentName: equipmentDetails || '-', // ✅ Display equipment name with quantity
                participantNames: participants || '-', // ✅ รายชื่อผู้เข้าร่วมทั้งหมด
            };
        });

        console.log("✅ Merged data:", mergedData);

        // ✅ Render table
        const tableBody = document.getElementById('rooms');
        tableBody.innerHTML = '';

        mergedData.forEach(row => {
            tableBody.innerHTML += `
                <tr>  
                    <td class="text-center">${new Date(row.used_date).toLocaleDateString()}</td>
                    <td class="text-center">${row.person_name}</td> 
                    <td class="text-center">${row.email}</td>
                    <td class="text-center">${row.roomN}</td>
                    <td class="text-center">${row.participantCount} คน</td>
                    <td class="text-center">
                        ${getDayOfWeek(row.used_date) + ' ' + new Date(row.used_date).toLocaleDateString()}<br>
                        ${row.start_time.slice(0, 5) + ' - ' + row.end_time.slice(0, 5)}<br>
                        (${row.request_type})
                    </td>
                    <td class="text-center">
                        <button class="btn btn-primary btn-sm detail-btn" 
                            data-bs-toggle="modal" data-bs-target="#detailModal"
                            data-date="${new Date(row.submitted_time).toLocaleDateString("th-TH")}"
                            data-name="${row.person_name}"
                            data-email="${row.email}"
                            data-room="${row.roomN}"
                            data-used_date="${new Date(row.used_date).toLocaleDateString("th-TH")}"
                            data-time="${row.start_time.slice(0, 5)} - ${row.end_time.slice(0, 5)}"
                            data-equipment="${row.equipmentName}"
                            data-document="${row.document_path || '-'}"
                            data-reason-detail="${row.detail_request_reason || '-'}"
                            data-reason="${row.request_reason || '-'}"
                            data-participants="${row.participantNames}">
                            แสดงรายละเอียด
                        </button><br>
                        <a href="${row.document_path || '#'}" target="_blank">เปิดเอกสาร</a>
                    </td>
                    <td class="text-center">${row.request_reason || '-'}</td>
                    <td class="text-center">${row.request_status || '-'}</td>
                </tr>
            `;
        });

    } catch (error) {
        console.error('❌ Error fetching data:', error);
    }
}

// ✅ Convert date to weekday name
function getDayOfWeek(dateString) {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const date = new Date(dateString);
    return days[date.getDay()];
}

// ✅ Fetch room data
fetchRoom();

// ✅ Handle modal data
document.addEventListener("click", function (event) {
    if (event.target.classList.contains("detail-btn")) {
        document.getElementById("modal-date").textContent = event.target.getAttribute("data-date");
        document.getElementById("modal-name").textContent = event.target.getAttribute("data-name");
        document.getElementById("modal-email").textContent = event.target.getAttribute("data-email");
        document.getElementById("modal-room").textContent = event.target.getAttribute("data-room");
        document.getElementById("modal-used_date").textContent = event.target.getAttribute("data-used_date");
        document.getElementById("modal-time").textContent = event.target.getAttribute("data-time");
        document.getElementById("modal-equipment").textContent = event.target.getAttribute("data-equipment");
        document.getElementById("modal-document").textContent = event.target.getAttribute("data-document");
        document.getElementById("modal-reason").textContent = event.target.getAttribute("data-reason");
        document.getElementById("modal-reason-detail").textContent = event.target.getAttribute("data-reason-detail");
        document.getElementById("modal-data-participant-names").textContent = event.target.getAttribute("data-participants");
    }
});
