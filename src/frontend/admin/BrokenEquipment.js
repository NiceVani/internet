async function fetchData() {
    try {
        // ✅ ดึงข้อมูลจากทุกตารางที่เกี่ยวข้อง
        const [brokenResponse, studentResponse, teachersResponse, equipmentsResponse, adminResponse] = await Promise.all([
            fetch('http://localhost:3001/data/equipment_brokened'),
            fetch('http://localhost:3001/data/student'),
            fetch('http://localhost:3001/data/teacher'),
            fetch('http://localhost:3001/data/equipment'),
            fetch('http://localhost:3001/data/admin')
        ]);

        const brokenData = await brokenResponse.json();
        const studentData = await studentResponse.json();
        const teachersData = await teachersResponse.json();
        const equipmentsData = await equipmentsResponse.json();
        const adminData = await adminResponse.json();

        console.log("✅ Data Loaded:", { brokenData, studentData, teachersData, equipmentsData, adminData });

        // ✅ ตรวจสอบว่าอยู่หน้าไหน
        let statusFilter = [];
        let isWaitingPage = false;
        if (window.location.pathname.includes('request_crash_equipments.html')) {
            statusFilter = ['รอซ่อม'];
            isWaitingPage = true;
        } else if (window.location.pathname.includes('wait.html')) {
            statusFilter = ['รับเรื่องแล้ว', 'กำลังจัดซื้อ', 'กำลังซ่อม']; // ✅ หน้ากำลังดำเนินการ
        } else if (window.location.pathname.includes('success.html')) {
            statusFilter = ['ซ่อมสำเร็จ'];
        }

        // ✅ คัดกรองตามสถานะ และรวมข้อมูลจากหลายตาราง
        const mergedData = brokenData
            .filter(row => statusFilter.includes(row.repair_status))
            .map(row => {
                try {
                    const student = studentData.find(s => s.student_id === row.student_id) || {};
                    const teacher = teachersData.find(t => t.teacher_id === row.teacher_id) || {};
                    const equipment = equipmentsData.find(e => e.equipment_id === row.equipment_id) || {};
                    const admin = adminData.find(a => a.admin_id === row.admin_id) || {};

                    return {
                        ...row,
                        repairDate: row.repair_date ? new Date(row.repair_date).toLocaleDateString('th-TH') : '-',
                        email: student?.email || teacher?.email || '-',
                        person_name: student?.full_name || teacher?.full_name || '-',
                        equipmentName: equipment?.equipment_name || '-',
                        equipmentType: equipment?.equipment_type || '-',
                        admin: admin?.full_name || '-',
                        damageDetails: row?.damage_details || '-',
                        imagePath: row?.image_path ? `http://localhost:3001/image/${row.image_path}` : null // ✅ เชื่อม `image_path`
                    };
                } catch (error) {
                    console.error("❌ Error mapping row:", row, error);
                    return row;
                }
            });

        console.log("✅ Merged Data:", mergedData);

        // ✅ อัปเดตตาราง
        const tableBody = document.getElementById('equipment-table');
        tableBody.innerHTML = mergedData.map(row => `
            <tr>
                <td class="text-center">${row.repairDate}</td>
                <td class="text-center">${row.repair_number}</td>
                <td class="text-center">${row.person_name}</td>
                <td class="text-center">${row.email}</td>
                <td class="text-center">
                    ${isWaitingPage ? `
                    <button class="btn btn-warning btn-sm update-status-btn" data-id="${row.repair_number}">รับเรื่อง</button>
                    ` : `
                    <select class="form-select status-dropdown" data-id="${row.repair_number}">
                            <option value="รับเรื่องแล้ว" ${row.repair_status === 'รับเรื่องแล้ว' ? 'selected' : ''}>รับเรื่องแล้ว</option>
                            <option value="กำลังจัดซื้อ" ${row.repair_status === 'กำลังจัดซื้อ' ? 'selected' : ''}>กำลังจัดซื้อ</option>
                            <option value="กำลังซ่อม" ${row.repair_status === 'กำลังซ่อม' ? 'selected' : ''}>กำลังซ่อม</option>
                            <option value="ซ่อมสำเร็จ" ${row.repair_status === 'ซ่อมสำเร็จ' ? 'selected' : ''}>ซ่อมสำเร็จ</option>
                    </select>
                    `}
                </td>
                <td class="text-center">${row.room_id || '-'}</td>
                <td class="text-center">${row.equipmentName}</td>
                <td class="text-center">${row.admin}</td>
                <td class="text-center">
                    <button type="button" class="btn btn-info btn-sm detail-btn" data-bs-toggle="modal" data-bs-target="#detailModal"
                        data-date="${row.repairDate}"
                        data-id="${row.repair_number}"
                        data-reporter="${row.person_name}"
                        data-email="${row.email}"
                        data-status="${row.repair_status}"
                        data-room="${row.room_id || '-'}"
                        data-item="${row.equipmentName}"
                        data-receiver="${row.admin}"
                        data-detail="${row.damageDetails}"
                        data-image="${row.imagePath || ''}">
                        รายละเอียด
                    </button>
                </td>
                </td>
            </tr>
        `).join("");

        // ✅ Event Listener ให้ปุ่ม "รายละเอียด" เปิด Modal พร้อมข้อมูล
        document.querySelectorAll(".detail-btn").forEach(button => {
            button.addEventListener("click", function () {
                document.getElementById("modal-date").textContent = this.getAttribute("data-date");
                document.getElementById("modal-id").textContent = this.getAttribute("data-id");
                document.getElementById("modal-reporter").textContent = this.getAttribute("data-reporter");
                document.getElementById("modal-email").textContent = this.getAttribute("data-email");
                document.getElementById("modal-status").textContent = this.getAttribute("data-status");
                document.getElementById("modal-room").textContent = this.getAttribute("data-room");
                document.getElementById("modal-item").textContent = this.getAttribute("data-item");
                document.getElementById("modal-receiver").textContent = this.getAttribute("data-receiver");
                document.getElementById("modal-detail").textContent = this.getAttribute("data-detail");

                // ✅ อัปเดตรูปภาพใน Modal
                const imageUrl = this.getAttribute("data-image");
                const modalImage = document.getElementById("modal-image");
                if (imageUrl) {
                    modalImage.src = imageUrl;
                    modalImage.style.display = "block"; // แสดงรูป
                } else {
                    modalImage.style.display = "none"; // ซ่อนถ้าไม่มีรูป
                }
            });
        });

    } catch (error) {
        console.error('❌ Error fetching data:', error);
    }
}

// ✅ ดึงข้อมูล Admin จาก Session
async function getAdminSession() {
    try {
        const response = await fetch('http://localhost:3001/session/admin');
        const admin = await response.json();
        return admin; // ค่าที่ได้ { admin_id: "A001", admin_name: "Admin Name" }
    } catch (error) {
        console.error("❌ Error fetching admin session:", error);
        return null;
    }
}

// ✅ ฟังก์ชันอัปเดตสถานะเมื่อกดปุ่ม "รับเรื่อง"
async function updateStatus(repairNumber) {
    try {
        const response = await fetch("http://localhost:3001/session", { credentials: "include" });
        const admin = await response.json();
        
        if (!admin.data.admin_id) {
            alert("ไม่สามารถดึงข้อมูล Admin ได้");
            return;
        }

        const updateResponse = await fetch("http://localhost:3001/updateEquipmentStatus", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                repair_id: repairNumber,
                new_status: "รับเรื่องแล้ว",
                admin_id: admin.data.admin_id  // ✅ เพิ่มตรงนี้
            }),
            credentials: "include"
        });

        if (updateResponse.ok) {
            alert("อัปเดตสถานะสำเร็จ!");
            fetchData(); // โหลดข้อมูลใหม่
        } else {
            alert("เกิดข้อผิดพลาดในการอัปเดตสถานะ");
        }
    } catch (error) {
        console.error("❌ Error updating status:", error);
    }
}


// ✅ เพิ่ม Event Listener ให้ปุ่ม "รับเรื่อง"
document.addEventListener("click", function(event) {
    if (event.target.classList.contains("update-status-btn")) {
        const repairNumber = event.target.dataset.id;
        updateStatus(repairNumber);
    }
});

document.addEventListener("change", async function (event) {
    if (event.target.classList.contains("status-dropdown")) {
        const repairId = event.target.getAttribute("data-id"); // ดึง repair_number
        const newStatus = event.target.value; // ดึงค่าสถานะใหม่

        try {
            const response = await fetch("http://localhost:3001/updateEquipmentStatus", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    repair_id: repairId,
                    new_status: newStatus
                }),
                credentials: "include"
            });

            if (response.ok) {
                alert("✅ อัปเดตสถานะสำเร็จ!");
                fetchData(); // โหลดข้อมูลใหม่เพื่ออัปเดตตาราง
            } else {
                alert("❌ เกิดข้อผิดพลาดในการอัปเดตสถานะ");
            }
        } catch (error) {
            console.error("❌ Error updating status:", error);
        }
    }
});

// 🚀 เรียกใช้งาน fetchData() เมื่อโหลดหน้า
fetchData();