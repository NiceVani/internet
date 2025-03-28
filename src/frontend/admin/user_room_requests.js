async function getCurrentAdmin() {
    try {
        const res = await fetch("http://localhost:3001/session", {
            credentials: "include",
        });

        if (!res.ok) throw new Error("ไม่สามารถตรวจสอบ session ได้");

        const data = await res.json();
        return data.data.admin_id;
    } catch (err) {
        console.error("❌ ไม่สามารถดึง session admin:", err);
        return null;
    }
}


function isOverlap(a, b) {
    const aStart = new Date(`${a.used_date}T${a.start_time}`);
    const aEnd = new Date(`${a.used_date}T${a.end_time}`);
    const bStart = new Date(`${b.used_date}T${b.start_time}`);
    const bEnd = new Date(`${b.used_date}T${b.end_time}`);

    return a.room_id === b.room_id &&
           a.used_date === b.used_date &&
           aStart < bEnd &&
           aEnd > bStart;
}

async function fetchData() {
    console.log("🚀 เรียกใช้ fetchData()");

    try {
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

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // ✅ เพิ่มตรงนี้: ตรวจหน้าปัจจุบัน แล้วกรอง "ในเวลา / นอกเวลา"
        let timeFilter = null;
        if (window.location.pathname.includes("user_requests_InTime")) {
            timeFilter = "ในเวลา";
        } else if (window.location.pathname.includes("user_requests_OutTime")) {
            timeFilter = "นอกเวลา";
        }

        const filteredData = roomsData.filter(row => {
            if (row.request_status !== 'รอดำเนินการ') return false;

            // ✅ ใช้ตัวกรองประเภทเวลา
            if (timeFilter && row.request_type !== timeFilter) return false;

            const usedDate = new Date(row.used_date);
            usedDate.setHours(0, 0, 0, 0);
            if (usedDate < today) return false;

            return true;
        });

        const participantCountMap = participantData.reduce((acc, participant) => {
            acc[participant.room_request_id] = (acc[participant.room_request_id] || 0) + 1;
            return acc;
        }, {});

        let mergedData = filteredData.map(room => {
            const student = studentsData.find(s => s.student_id === room.student_id) || {};
            const teacher = teachersData.find(t => t.teacher_id === room.teacher_id) || {};
            const roomInfo = roomIDData.find(r => r.room_id === room.room_id) || {};

            const equipmentReqs = equipmentReqData.filter(e => e.room_request_id === room.room_request_id);
            const equipmentDetails = equipmentReqs.map(eq => {
                const equipment = equipmentData.find(ed => ed.equipment_id === eq.equipment_id);
                return equipment ? `${equipment.equipment_name} (${eq.request_quantity})` : '-';
            }).join(', ');

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
                person_name: student.full_name || teacher.full_name || '-',
                email: student.email || teacher.email || '-',
                roomN: roomInfo.room_name || '-',
                participantCount: participantCountMap[room.room_request_id] || 0,
                equipment: equipmentReqs.map(eq => eq.equipment_id).join(', ') || '-',
                equipmentName: equipmentDetails || '-',
                participantNames: participants || '-',
                room_id: room.room_id,

            };
        });

        const sortDropdown = document.getElementById("sorttime");
        const sortOption = sortDropdown ? sortDropdown.value : '';
        
        // ✅ Sort mergedData ตามตัวเลือก dropdown
        mergedData.sort((a, b) => {
            const dateA = new Date(a.used_date);
            const dateB = new Date(b.used_date);
        
            if (sortOption === 'newest') {
                return dateB - dateA;
            } else if (sortOption === 'oldest') {
                return dateA - dateB;
            } else if (sortOption === 'overlay') {
                if (a.roomN !== b.roomN) {
                    return a.roomN.localeCompare(b.roomN);
                }
                return dateA - dateB;
            }
            return dateA - dateB;
        });
        
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
                        ${formatThaiShortDate(row.used_date)}<br>
                        ${row.start_time.slice(0, 5)} - ${row.end_time.slice(0, 5)}<br>
                        (${row.request_type})
                    </td>
                    <td class="text-center">
                        <button class="btn btn-primary btn-sm detail-btn" 
                            data-bs-toggle="modal" data-bs-target="#detailModal"
                            data-date="${new Date(row.submitted_time).toLocaleDateString("th-TH")}"
                            data-name="${row.person_name}"
                            data-email="${row.email}"
                            data-room="${row.roomN}"
                            data-used_date="${row.used_date}"
                            data-time="${row.start_time.slice(0, 5)} - ${row.end_time.slice(0, 5)}"
                            data-equipment="${row.equipmentName}"
                            data-reason-detail="${row.detail_request_reason || '-'}"
                            data-reason="${row.request_reason || '-'}"
                            data-participants="${row.participantNames}">
                            แสดงรายละเอียด
                        </button>
                    </td>
                    <td class="text-center">${row.request_reason || '-'}</td>
                    <td class="text-center">
                        <div class="d-grid gap-2">
                            <button class="btn btn-success btn-sm w-100"
                                onclick="updateStatus(${row.room_request_id}, '${row.request_type}')">
                                ✅ อนุมัติ
                            </button>
                            <button class="btn btn-danger btn-sm w-100"
                                onclick="openRejectModal(${row.room_request_id})">
                                ❌ ไม่อนุมัติ
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        });

    } catch (error) {
        console.error('❌ Error fetching data:', error);
    }
}



// Event สำหรับ dropdown
document.addEventListener("DOMContentLoaded", () => {
    if (window.location.pathname.includes("user_approve.html")) {
        fetchData();

        const approveSortDropdown = document.getElementById("approve-page-sort-date");
        if (approveSortDropdown) {
            approveSortDropdown.addEventListener("change", fetchData);
        }
    } else {
        fetchData();

        const sortDropdown = document.getElementById("sorttime");
        if (sortDropdown) {
            sortDropdown.addEventListener("change", fetchData);
        }
    }
});

function openRejectModal(requestId) {
    document.getElementById("rejectRequestId").value = requestId;
    new bootstrap.Modal(document.getElementById("rejectModal")).show();
}

function formatThaiShortDate(dateString) {
    const date = new Date(dateString);
    const days = ["อา.", "จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส."];
    const dayName = days[date.getDay()];
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear() + 543;
    return `${dayName} ${day}/${month}/${year}`;
}

// อัปเดตสถานะการจอง
async function updateStatus(requestId, requestType) {
    try {
        // ✅ ตรวจสอบ request_type เพื่อกำหนดสถานะที่ถูกต้อง
        const newStatus = requestType === "ในเวลา" ? "อนุมัติ" : "รออนุมัติ";

        const response = await fetch('http://localhost:3001/updateStatus', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include", // ✅ สำคัญ!
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

    const admin_id = await getCurrentAdmin();

    if (!admin_id) {
        alert("กรุณาเข้าสู่ระบบก่อนดำเนินการ");
        return;
    }

    try {
        const response = await fetch('http://localhost:3001/updateStatus', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
                requestId,
                status: "ไม่อนุมัติ",
                rejectReason,
                detailRejectReason,
                admin_id
            }),
        });

        if (response.ok) {
            alert("ปฏิเสธคำขอเรียบร้อย!");
            fetchData();
            bootstrap.Modal.getInstance(document.getElementById("rejectModal")).hide();
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
        // ส่วนเพิ่มเติม ถ้า modal มีช่องอื่น
        const modalReject = document.getElementById("modal-data-reject");
        if (modalReject) {
            modalReject.textContent = event.target.getAttribute("data-reject") || "-";
        }
        const modalRejectDetail = document.getElementById("modal-data-reject-detail");
        if (modalRejectDetail) {
            modalRejectDetail.textContent = event.target.getAttribute("data-reject-detail") || "-";
        }
        const modalAdmin = document.getElementById("modal-approved-by");
        if (modalAdmin) {
            modalAdmin.textContent = event.target.getAttribute("data-approvedby") || "-";
        }
        const modalExec = document.getElementById("modal-approved-by_ex");
        if (modalExec) {
            modalExec.textContent = event.target.getAttribute("data-approvedby_ex") || "-";
        }
    }
});