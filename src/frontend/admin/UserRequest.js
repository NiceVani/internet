async function fetchRoom() {
    try {
        // Fetch data from APIs
        const [roomsResponse, studentsResponse, teachersResponse, roomsIDResponse, participantResponse, equipmentReqResponse, equipmentResponse, executiveResponse, adminResponse] = await Promise.all([
            fetch('http://localhost:3001/data/room_request'),
            fetch('http://localhost:3001/data/student'),
            fetch('http://localhost:3001/data/teacher'),
            fetch('http://localhost:3001/data/room'),
            fetch('http://localhost:3001/data/room_request_participant'),
            fetch('http://localhost:3001/data/room_request_equipment'),
            fetch('http://localhost:3001/data/equipment'),
            fetch('http://localhost:3001/data/executive'),
            fetch('http://localhost:3001/data/admin'),
        ]);

        // Convert responses to JSON
        const adminData = await adminResponse.json();
        const roomsData = await roomsResponse.json();
        const studentsData = await studentsResponse.json();
        const teachersData = await teachersResponse.json();
        const roomIDData = await roomsIDResponse.json();
        const participantData = await participantResponse.json();
        const equipmentReqData = await equipmentReqResponse.json();
        const equipmentData = await equipmentResponse.json();
        const executiveData = await executiveResponse.json();

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
            const admin = adminData.find(a => a.admin_id === room.admin_id) || {};
            const executive = executiveData.find(ex => ex.executive_id === room.executive_id) || {};


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
                approved_by_name: admin.full_name || '-',
                approved_by_ex: executive.full_name || '-',
                room_request_id: room.room_request_id,
                used_date: room.used_date,
                detail_request_reason: room.detail_request_reason,
                submitted_time: room.submitted_time,
                start_time: room.start_time,
                end_time: room.end_time,
                request_type: room.request_type,
                request_reason: room.request_reason,
                reject_reason: room.reject_reason,
                detail_reject_reason: room.detail_reject_reason,
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
        // 🔽 เรียง mergedData ตาม dropdown (sorttime)
        const sortDropdown = document.getElementById("sorttime");
        const sortOption = sortDropdown ? sortDropdown.value : '';

        console.log("🌀 sortOption จาก dropdown:", sortOption);

        // เทียบแค่วันที่ ไม่รวมเวลา
        mergedData.sort((a, b) => {
            const dateA = new Date(a.used_date).setHours(0, 0, 0, 0);
            const dateB = new Date(b.used_date).setHours(0, 0, 0, 0);

            if (sortOption === 'newest') return dateB - dateA;
            if (sortOption === 'oldest') return dateA - dateB;
            return 0; // ถ้าไม่เลือกอะไรเลย
        });

        // ✅ Render table
        const tableBody = document.getElementById('rooms');
        tableBody.innerHTML = '';

        mergedData.forEach(row => {
            tableBody.innerHTML += `
                <tr>  
                    <td class="text-center">${new Date(row.submitted_time).toLocaleDateString("th-TH")}</td>
                    <td class="text-center">${row.person_name}</td> 
                    <td class="text-center">${row.email}</td>
                    <td class="text-center">${row.roomN}</td>
                    <td class="text-center">${row.participantCount} คน</td>
                    <td class="text-center">
                                ${formatThaiShortDate(row.used_date)}<br>
                                ${row.start_time.slice(0, 5)} - ${row.end_time.slice(0, 5)}<br>
                                (${row.request_type})
                            </td>
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
                            data-reject="${row.reject_reason || '-'}"
                            data-reject-detail="${row.detail_reject_reason || '-'}"
                            data-participants="${row.participantNames}"
                            data-approvedby="${row.approved_by_name}"
                            data-approvedby_ex="${row.approved_by_ex}">
                            แสดงรายละเอียด
                        </button><br>
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
function formatThaiShortDate(dateString) {
    const date = new Date(dateString);
    const days = ["อา.", "จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส."];
    const dayName = days[date.getDay()];
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear() + 543;
    return `${dayName} ${day}/${month}/${year}`;
}
// ✅ Fetch room data
fetchRoom();
// 🔁 โหลดใหม่เมื่อเปลี่ยน dropdown sorttime
document.addEventListener("DOMContentLoaded", () => {
    const sortDropdown = document.getElementById("sorttime");
    if (sortDropdown) {
        sortDropdown.addEventListener("change", fetchRoom);
    }
});

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

        document.getElementById("modal-reason").textContent = event.target.getAttribute("data-reason");
        document.getElementById("modal-reason-detail").textContent = event.target.getAttribute("data-reason-detail");
        document.getElementById("modal-data-participant-names").textContent = event.target.getAttribute("data-participants");
        document.getElementById("modal-data-reject").textContent = event.target.getAttribute("data-reject");
        document.getElementById("modal-data-reject-detail").textContent = event.target.getAttribute("data-reject-detail");
        document.getElementById("modal-approved-by").textContent = event.target.getAttribute("data-approvedby");
        document.getElementById("modal-approved-by_ex").textContent = event.target.getAttribute("data-approvedby_ex");

    }
});