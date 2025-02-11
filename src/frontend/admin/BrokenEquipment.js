async function fetchData() {
    try {
        const [brokenResponse, studentResponse, equipmentsResponse, adminResponse] = await Promise.all([
            fetch('http://localhost:3001/data/Equipments_list_brokened'),
            fetch('http://localhost:3001/data/Student_information'),
            fetch('http://localhost:3001/data/Equipments_list_information'),
            fetch('http://localhost:3001/data/Admin_information')
        ]);

        const brokenData = await brokenResponse.json();
        const studentData = await studentResponse.json();
        const equipmentsData = await equipmentsResponse.json();
        const adminData = await adminResponse.json();

        // ตรวจสอบว่าอยู่หน้าไหน
        let statusFilter = [];

        if (window.location.pathname.includes('request_crash_equipments.html')) {
            statusFilter = ['รอซ่อม'];
        } else if (window.location.pathname.includes('wait.html')) {
            statusFilter = ['รับเรื่องแล้ว', 'กำลังซ่อม', 'กำลังจัดซื้อ']; // เพิ่มหลายเงื่อนไข
        } else if (window.location.pathname.includes('success.html')) {
            statusFilter = ['ซ่อมสำเร็จ'];
        }

        // คัดกรองตามสถานะที่กำหนด
        const mergedData = brokenData.filter(row => statusFilter.includes(row.Repair_status)) // 🔥 กรองข้อมูลตามหน้า
            .map(row => {
                try {
                    const student = studentData.find(s => s.Student_ID === row.Identify_ID) || {};
                    const equipment = equipmentsData.find(e => e.Equipments_ID === row.Equipments_ID) || {};
                    const admin = adminData.find(a => a.Admin_ID === row.Admin_ID) || {};

                    return {
                        ...row,
                        email: student.Email || '-',
                        studentName: student.Name || '-',
                        equipmentName: equipment.Equipments_name || '-',
                        equipmentType: equipment.Equipments_Type || '-',
                        admin: admin.Name || '-',
                    };
                } catch (error) {
                    console.error("❌ Error mapping row:", row, error);
                    return row; // คืนค่าเดิมถ้ามีปัญหา
                }
            });

        console.log("✅ Merged Data:", mergedData);


        const tableBody = document.getElementById('equipment-table');
        tableBody.innerHTML = mergedData.map(row => `
    <tr>
        <td class="text-center">${new Date(row.Repair_date).toLocaleDateString()}</td>
        <td class="text-center">${row.Repair_numbers}</td>
        <td class="text-center">${row.studentName || '-'}</td>
        <td class="text-center">${row.email || '-'}</td>
        <td class="text-center">${row.Repair_status}</td>
        <td class="text-center">${row.Rooms_ID || '-'}</td>
        <td class="text-center">${row.equipmentName || '-'}</td>
        <td class="text-center">${row.admin || '-'}</td>
        <td class="text-center">
            <button type="button" class="btn btn-info btn-sm" data-bs-toggle="modal" data-bs-target="#detailModal"
                data-date="${new Date(row.Repair_date).toLocaleDateString()}"
                data-id="${row.Repair_numbers}"
                data-reporter="${row.studentName || '-'}"
                data-email="${row.email}"
                data-status="${row.Repair_status}"
                data-room="${row.Rooms_ID || '-'}"
                data-item="${row.equipmentName || '-'}"
                data-receiver="${row.admin || '-'}"
                data-detail="${row.Damaged_details || '-'}">
                รายละเอียด
            </button>
        </td>
    </tr>
`).join(""); // 🔥 รวมเป็น String เดียว
    } catch (error) {
        console.error('❌ Error fetching data:', error);
    }
}

// เรียกใช้ fetchData() เมื่อโหลดหน้า
fetchData();  