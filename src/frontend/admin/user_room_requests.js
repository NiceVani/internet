async function fetchData() {
    try {
        // ดึงข้อมูลจาก API
        const [roomsResponse, studentsResponse, teachersResponse, roomsIDResponse, participantResponse, equipmentReqResponse, equipmentResponse] = await Promise.all([
            fetch('http://localhost:3001/data/room_request'),
            fetch('http://localhost:3001/data/student'),
            fetch('http://localhost:3001/data/teacher'),
            fetch('http://localhost:3001/data/room'),
            fetch('http://localhost:3001/data/room_request_participant'),
            fetch('http://localhost:3001/data/room_request_equipment'),
            fetch('http://localhost:3001/data/equipment'),
        ]);

        const roomsData = await roomsResponse.json();
        const studentsData = await studentsResponse.json();
        const teachersData = await teachersResponse.json();
        const roomIDData = await roomsIDResponse.json();
        const participantData = await participantResponse.json();
        const equipmentReqData = await equipmentReqResponse.json();
        const equipmentData = await equipmentResponse.json();

        console.log("📌 ห้องที่ขอใช้:", roomsData);
        console.log("📌 นักศึกษา:", studentsData);
        console.log("📌 อาจารย์:", teachersData);

        // 📌 ตรวจสอบหน้าเว็บที่กำลังเปิด
        let timeFilter = null; // "นอกเวลา" หรือ "ในเวลา"
        if (window.location.pathname.includes('user_requests_OutTime')) {
            timeFilter = 'นอกเวลา';
        } else if (window.location.pathname.includes('user_requests_InTime')) {
            timeFilter = 'ในเวลา';
        }

        console.log("📌 Time Filter:", timeFilter);

        // คัดกรองเฉพาะข้อมูลที่มีสถานะ "รออนุมัติ" หรือ "รอดำเนินการ" + ตรวจสอบเวลา
        const filteredData = roomsData.filter(row =>
            (row.request_status === 'รออนุมัติ' || row.request_status === 'รอดำเนินการ') &&
            (timeFilter ? row.request_type === timeFilter : true) // ✅ ตรวจสอบประเภทเวลา
        );

        console.log("✅ ข้อมูลหลังจากคัดกรอง:", filteredData);

        // ✅ สร้าง object เพื่อนับจำนวนผู้เข้าร่วมที่มี room_request_id ซ้ำกัน
        const participantCountMap = participantData.reduce((acc, participant) => {
            acc[participant.room_request_id] = (acc[participant.room_request_id] || 0) + 1;
            return acc;
        }, {});



        console.log("📌 จำนวนผู้เข้าร่วมต่อ room_request_id:", participantCountMap);


        // รวมข้อมูลนักเรียนและอาจารย์ให้อยู่ในคอลัมน์เดียว
        const mergedData = filteredData.map(room => {
            const student = studentsData.find(s => s.student_id === room.student_id) || {};
            const teacher = teachersData.find(t => t.teacher_id === room.teacher_id) || {};
            const roomInfo = roomIDData.find(r => r.room_id === room.room_id) || {};

            // ✅ Filter the equipment requests for this room_request_id
            const equipmentReqs = equipmentReqData.filter(e => e.room_request_id === room.room_request_id);

            // ✅ Extract equipment names with quantities
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


        console.log("✅ ข้อมูลที่รวมกันแล้ว:", mergedData);

        // แสดงผลข้อมูลในตาราง
        const tableBody = document.getElementById('reservation-table');
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
                            data-equipment ="${row.equipmentName}"
                            data-document="${row.document_path || '-'}"
                            data-reason-detail="${row.detail_request_reason || '-'}"
                            data-reason="${row.request_reason || '-'}"
                            data-participants="${row.participantNames}">
                            แสดงรายละเอียด
                        </button><br>
                        <a href="${row.document_path || '#'}" target="_blank">เปิดเอกสาร</a>
                    </td>
                    <td class="text-center">${row.request_reason || '-'}</td>
                    <td class="text-center">
                        ${row.request_status === 'รออนุมัติ'
                            ? `
                        <button class="btn btn-success btn-sm" onclick="updateStatus(${row.room_request_id}, 'รอดำเนินการ')">
                                    ✅ อนุมัติ
                                </button>
                            <button class="btn btn-danger btn-sm" onclick="openRejectModal(${row.room_request_id})">
                            ❌ ไม่อนุมัติ
                            </button>
        `
                    : `<span class="badge bg-warning">${row.request_status}</span>`
                }
                </td>

                </tr>
            `;
        });


    } catch (error) {
        console.error('❌ Error fetching data:', error);
    }
}

// อัปเดตสถานะการจอง
async function updateStatus(requestId, newStatus) {
    try {
        const response = await fetch('http://localhost:3001/updateStatus', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ requestId, status: newStatus }),
        });

        if (response.ok) {
            alert(`อัปเดตสถานะเป็น "${newStatus}" สำเร็จ!`);
            fetchData(); // โหลดข้อมูลใหม่
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

async function submitReject() {
    const requestId = document.getElementById("rejectRequestId").value;
    const rejectReason = document.getElementById("rejectReason").value;
    const detailRejectReason = document.getElementById("rejectDetail").value;

    try {
        const response = await fetch('http://localhost:3001/updateStatus', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                requestId, 
                status: "ไม่อนุมัติ", 
                rejectReason, 
                detailRejectReason 
            }),
        });

        if (response.ok) {
            alert("ปฏิเสธคำขอเรียบร้อย!");
            fetchData(); // โหลดข้อมูลใหม่
            bootstrap.Modal.getInstance(document.getElementById("rejectModal")).hide(); // ปิด Modal
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

// โหลดข้อมูลเมื่อหน้าเว็บโหลดเสร็จ
document.addEventListener("DOMContentLoaded", fetchData);

document.addEventListener("click", function (event) {
    if (event.target.classList.contains("detail-btn")) {
        // ดึงค่าจาก data-attribute ที่แนบมากับปุ่ม
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

function openRejectModal(requestId) {
    document.getElementById("rejectRequestId").value = requestId;
    new bootstrap.Modal(document.getElementById("rejectModal")).show();
}

// ฟังก์ชันแปลงวันที่เป็นวันในสัปดาห์
function getDayOfWeek(dateString) {
    const days = ["อา.", "จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส."];
    const date = new Date(dateString);
    return days[date.getDay()];
}
