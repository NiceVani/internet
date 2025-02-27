document.addEventListener("DOMContentLoaded", function () {
    const reportForm = document.getElementById("reportForm");
    const equipmentSelect = document.getElementById("equipment");
    const roomSelect = document.getElementById("room");
    const computerSelect = document.getElementById("computer");
    const computerSection = document.getElementById("computer-section"); // ✅ div ครอบ <select>
    const detailsSelect = document.getElementById("details");
    const imageInput = document.getElementById("image");
    const previewImage = document.getElementById("preview");

    if (!reportForm || !equipmentSelect || !roomSelect || !detailsSelect || !imageInput || !previewImage) {
        console.error("❌ ไม่พบองค์ประกอบบางตัวในหน้าเว็บ");
        return;
    }

    // เมื่อมีการส่งฟอร์ม
    reportForm.addEventListener("submit", async function (event) {
        event.preventDefault();
    
        const equipment = equipmentSelect.value;
        const room = roomSelect.value;
        const details = detailsSelect.value;
        const additionalText = document.getElementById("additionalText").value || null;
        const fileInput = imageInput.files[0];
    
        if (!equipment || !room || !details) {
            alert("❌ กรุณากรอกข้อมูลให้ครบถ้วน");
            return;
        }
    
        try {
            // 1) getEquipmentId, getRoomId
            const equipmentId = await getEquipmentId(equipment);
            const roomId      = await getRoomId(room);
            if (!equipmentId || !roomId) {
                alert("❌ ไม่พบข้อมูลอุปกรณ์หรือห้องที่เลือก");
                return;
            }
    
            // 2) generateRepairNumber
            const repairNumber = await generateRepairNumber(roomId, equipmentId);
            const parts = repairNumber.split("-");
            const nextNumber = parts[parts.length - 1]; // ตัวท้าย
    
            // 3) เตรียมเวลา
            const repairDate = new Date().toISOString().slice(0, 19).replace("T", " ");
    
            // (ตัวแปรที่ใช้บันทึก path)
            let imagePath = "";
    
            // **สร้าง formData** แค่ 1 ครั้ง
            const formData = new FormData();

            // ✅ ถ้ามีไฟล์ => upload (POST /uploadReportImage)
            if (fileInput) {
                try {
                    formData.append("student_id", sessionUserId);
                    formData.append("repair_number", repairNumber);
                    formData.append("image", fileInput);
            
                    const uploadResponse = await fetch("http://localhost:3000/uploadReportImage", {
                        method: "POST",
                        body: formData
                    });
            
                    const uploadResult = await uploadResponse.json();
                    if (uploadResponse.ok && uploadResult.filePath) {
                        imagePath = uploadResult.filePath;
                        console.log("✅ อัปโหลดสำเร็จ:", imagePath);
                    } else {
                        alert("❌ เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ");
                        return;
                    }
                } catch (error) {
                    console.error("❌ Upload Error:", error);
                    alert("❌ ไม่สามารถอัปโหลดรูปภาพได้");
                    return;
                }
            }


    
            // ✅ อัปเดตการส่งข้อมูลให้รองรับ computer_id
            const reportData = {
                repair_number: repairNumber,
                repair_date: repairDate,
                student_id: sessionRole === "นิสิต" ? sessionUserId : null,
                teacher_id: sessionRole === "อาจารย์" ? sessionUserId : null,
                equipment_id: equipmentId,
                room_id: roomId,
                computer_id: equipmentSelect.value === "คอมพิวเตอร์" ? document.getElementById("computer").value : null, // ✅ เพิ่ม computer_id ถ้าเลือกคอมพิวเตอร์
                admin_id: null,
                damage: details,
                damage_details: additionalText,
                repair_status: "รอซ่อม",
                image_path: imagePath
            };
                        
            // ✅ ส่งข้อมูลไปยัง Backend
            const response = await fetch("http://localhost:3000/reportIssue", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(reportData)
            });
    
            if (response.ok) {
                alert("✅ รายงานปัญหาสำเร็จ!");
                window.location.reload();
            } else {
                alert("❌ เกิดข้อผิดพลาดในการแจ้งปัญหา");
            }
        } catch (error) {
            console.error("❌ Error:", error);
            alert("❌ เกิดข้อผิดพลาดในการส่งรายงาน");
        }
    });
    
    

    // อัปเดตตัวเลือก "รายละเอียดเพิ่มเติม" ตามอุปกรณ์ที่เลือก
    equipmentSelect.addEventListener("change", function () {
        const equipment = equipmentSelect.value;
        detailsSelect.innerHTML = '<option value="">-- กรุณาเลือก --</option>';
    
        const problems = {
            "สายไฟ": ["สายไฟชำรุด", "สายไฟขาด", "ปลั๊กไฟหลวม"],
            "เก้าอี้": ["ขาเก้าอี้หัก", "เบาะชำรุด", "พนักพิงหลุด"],
            "โต๊ะ": ["ขาโต๊ะหัก", "พื้นโต๊ะมีรอย", "โต๊ะโยก"],
            "จอคอมพิวเตอร์": ["หน้าจอไม่ติด", "จอมีรอยแตก", "ภาพไม่ชัด"],
            "โปรเจคเตอร์": ["โปรเจคเตอร์ไม่ติด", "ภาพเบลอ", "รีโมทไม่ทำงาน"],
            "ทีวี": ["ทีวีไม่ติด", "เสียงไม่ออก", "จอภาพไม่ชัด"],
            "เครื่องปรับอากาศ": ["ไม่มีความเย็น", "มีน้ำหยด", "เปิดไม่ติด"],
            "วิชวลไลเซอร์": ["เครื่องไม่ทำงาน", "แสงไม่ออก", "ภาพไม่ขึ้น"],
            "hub": ["พอร์ตไม่ทำงาน", "ไฟไม่ติด", "อุปกรณ์ไม่เชื่อมต่อ"],
            "router": ["ไม่มีสัญญาณ", "ไฟไม่ติด", "เชื่อมต่อช้า"],
            "switch": ["พอร์ตไม่ทำงาน", "อุปกรณ์ไม่ตอบสนอง", "ไฟสถานะไม่ขึ้น"],
            "พอยเตอร์": ["แบตเตอรี่หมด", "แสงไม่ออก", "ปุ่มกดเสีย"],
            "เมาส์": ["ปุ่มคลิกไม่ทำงาน", "ตัวชี้เมาส์ไม่ขยับ", "สายเมาส์ชำรุด"],
            "คีย์บอร์ด": ["ปุ่มกดไม่ติด", "ปุ่มบางตัวหลุด", "แสงไฟไม่ติด"],
            "ปลั๊กไฟ": ["ปลั๊กไฟชำรุด", "สายไฟหลวม", "ไฟไม่ออก"],
            "เสียงไมค์": ["ไมค์ไม่มีเสียง", "เสียงขาดหาย", "ไมค์ไม่เชื่อมต่อ"],
            "คอมพิวเตอร์": ["เครื่องไม่เปิด", "หน้าจอไม่แสดงผล", "คีย์บอร์ดหรือเมาส์ไม่ตอบสนอง", "จอฟ้า"]
        };
    
        // ✅ อัปเดตรายการรายละเอียดปัญหาตามอุปกรณ์ที่เลือก
        if (problems[equipment]) {
            problems[equipment].forEach(problem => {
                const option = document.createElement("option");
                option.value = problem;
                option.textContent = problem;
                detailsSelect.appendChild(option);
            });
        }
    
        // ✅ ถ้าเลือก "คอมพิวเตอร์" ให้แสดง <select> computer_id, ถ้าไม่ใช่ให้ซ่อน
        if (equipment === "คอมพิวเตอร์") {
            computerSection.style.display = "block"; // แสดง dropdown ของ computer_id
        } else {
            computerSection.style.display = "none"; // ซ่อน dropdown
            computerSelect.innerHTML = '<option value="">-- กรุณาเลือก --</option>'; // รีเซ็ตค่า
        }

        // ✅ เมื่อเลือกห้อง โหลดคอมพิวเตอร์ที่อยู่ในห้องนั้น (เฉพาะเมื่อเลือก "คอมพิวเตอร์")
        roomSelect.addEventListener("change", async function () {
            if (equipmentSelect.value !== "คอมพิวเตอร์") return; // ถ้าอุปกรณ์ไม่ใช่คอมพิวเตอร์ ให้ออกจากฟังก์ชัน

            const roomName = roomSelect.value;

            if (!roomName) {
                computerSelect.innerHTML = '<option value="">-- กรุณาเลือก --</option>';
                return;
            }

            try {
                // ดึง room_id จาก room_name
                const response = await fetch(`http://localhost:3000/getRoomId?name=${encodeURIComponent(roomName)}`);
                const data = await response.json();

                if (!response.ok || !data.room_id) {
                    console.error("❌ ไม่พบ room_id สำหรับห้องที่เลือก");
                    computerSelect.innerHTML = '<option value="">-- ไม่พบข้อมูล --</option>';
                    return;
                }

                const roomId = data.room_id;

                // ดึง computer_id สำหรับห้องที่เลือก
                const compResponse = await fetch(`http://localhost:3000/getComputersByRoom?room_id=${roomId}`);
                const compData = await compResponse.json();

                computerSelect.innerHTML = '<option value="">-- กรุณาเลือก --</option>';
                if (compData.computers.length === 0) {
                    computerSelect.innerHTML = '<option value="">-- ไม่มีคอมพิวเตอร์ในห้องนี้ --</option>';
                    return;
                }

                compData.computers.forEach((comp) => {
                    const option = document.createElement("option");
                    option.value = comp.computer_id;
                    option.textContent = `${comp.computer_id}`;
                    computerSelect.appendChild(option);
                });

            } catch (error) {
                console.error("❌ Error fetching computers:", error);
                computerSelect.innerHTML = '<option value="">-- เกิดข้อผิดพลาด --</option>';
            }
        });

    });
    

    // ฟังก์ชันแสดงตัวอย่างภาพที่อัปโหลด
    imageInput.addEventListener("change", function (event) {
        const file = event.target.files[0];

        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                previewImage.src = e.target.result;
                previewImage.style.display = "block";
            };
            reader.readAsDataURL(file);
        } else {
            previewImage.style.display = "none";
        }
    });

    // ฟังก์ชันดึงค่า equipment_id จากชื่ออุปกรณ์
    async function getEquipmentId(equipmentName) {
        try {
            console.log(`📌 ค้นหา equipment_id สำหรับ: ${equipmentName}`);
            const response = await fetch(`http://localhost:3000/getEquipmentId?name=${encodeURIComponent(equipmentName)}`);
            if (!response.ok) throw new Error("Equipment not found");
            const data = await response.json();
            console.log(`✅ Equipment ID: ${data.equipment_id}`);
            return data.equipment_id;
        } catch (error) {
            console.error("❌ Error fetching equipment ID:", error);
            return null;
        }
    }

    // ฟังก์ชันดึงค่า room_id จากชื่อห้อง
    async function getRoomId(roomName) {
        try {
            const response = await fetch(`http://localhost:3000/getRoomId?name=${encodeURIComponent(roomName)}`);
            if (!response.ok) throw new Error("Room not found");
            const data = await response.json();
            return data.room_id || null;
        } catch (error) {
            console.error("❌ Error fetching room ID:", error);
            return null;
        }
    }

    // ฟังก์ชันสร้าง repair_number เช่น 414-12-5
    async function generateRepairNumber(roomId, equipmentId) {
        try {
            // เรียก API /getLatestRepairNumber
            const response = await fetch(`http://localhost:3000/getLatestRepairNumber?room_id=${roomId}&equipment_id=${equipmentId}`);
            const data = await response.json();
            
            // ถ้าเคยมี latest_number อยู่แล้ว ให้ +1
            // ถ้าไม่เคยมีก็จะได้ 0 จาก backend => +1 = 1
            return `${roomId}-${equipmentId}-${(data.latest_number || 0) + 1}`;
        } catch (error) {
            console.error("❌ Error fetching latest repair number:", error);
            // fallback
            return `${roomId}-${equipmentId}-1`;
        }
    }
    

    // ฟังก์ชันออกจากระบบ (ตัวอย่าง)
    async function logout() {
        try {
            const response = await fetch("http://localhost:3000/logout", {
                method: "POST",
                credentials: "include"
            });
            if (response.ok) {
                alert("✅ ออกจากระบบสำเร็จ!");
                window.location.href = "login.html";
            } else {
                alert("❌ เกิดข้อผิดพลาดในการออกจากระบบ");
            }
        } catch (error) {
            console.error("❌ Error logging out:", error);
            alert("❌ เกิดข้อผิดพลาด กรุณาลองใหม่");
        }
    }

    // ผูกปุ่มออกจากระบบ
    const logoutButton = document.getElementById("logout-btn");
    if (logoutButton) {
        logoutButton.addEventListener("click", logout);
    }
});

document.addEventListener("DOMContentLoaded", async function () {
    await fetchUserInfo();
});

let sessionUserId = null;

async function fetchUserInfo() {
    try {
        console.log("🔄 กำลังโหลดข้อมูลเซสชัน...");
        const response = await fetch("http://localhost:3000/session", {
            method: "GET",
            credentials: "include"
        });

        if (!response.ok) {
            throw new Error("Session expired");
        }

        const userSession = await response.json();
        console.log("✅ ข้อมูลผู้ใช้ที่ได้จาก API:", userSession);

        if (userSession && userSession.data) {
            if (userSession.role === "นิสิต") {
                sessionUserId = userSession.data.student_id;
                sessionRole = "นิสิต";
            } else if (userSession.role === "อาจารย์") {
                sessionUserId = userSession.data.teacher_id;  // ✅ ใช้ teacher_id
                sessionRole = "อาจารย์";
            } else {
                alert("❌ ไม่สามารถระบุประเภทบัญชีได้");
                window.location.href = "login.html";
            }
        } else {
            alert("❌ กรุณาเข้าสู่ระบบใหม่");
            window.location.href = "login.html";
        }
    } catch (error) {
        console.error("❌ เกิดข้อผิดพลาดในการโหลดข้อมูลเซสชัน:", error);
        alert("เกิดข้อผิดพลาด กรุณาเข้าสู่ระบบใหม่");
        window.location.href = "login.html";
    }
}


async function logout() {
    try {
        console.log("🔄 กำลังออกจากระบบ...");
        const response = await fetch("http://localhost:3000/logout", {
            method: "POST",
            credentials: "include"
        });
        if (response.ok) {
            console.log("✅ ออกจากระบบสำเร็จ");
            alert("ออกจากระบบสำเร็จ");
            window.location.href = "login.html";
        } else {
            console.error("❌ เกิดข้อผิดพลาดในการออกจากระบบ");
            alert("เกิดข้อผิดพลาดในการออกจากระบบ กรุณาลองใหม่");
        }
    } catch (error) {
        console.error("❌ ไม่สามารถออกจากระบบได้:", error);
        alert("เกิดข้อผิดพลาด กรุณาลองใหม่");
    }
}

async function getEquipmentId(equipmentName) {
    try {
        console.log(`📌 ค้นหา equipment_id สำหรับ: ${equipmentName}`);
        const response = await fetch(`http://localhost:3000/getEquipmentId?name=${encodeURIComponent(equipmentName)}`);
        if (!response.ok) throw new Error("Equipment not found");
        const data = await response.json();
        console.log(`✅ Equipment ID: ${data.equipment_id}`);
        return data.equipment_id;
    } catch (error) {
        console.error("❌ Error fetching equipment ID:", error);
        return null;
    }
}

async function getRoomId(roomName) {
    try {
        const response = await fetch(`http://localhost:3000/getRoomId?name=${encodeURIComponent(roomName)}`);
        if (!response.ok) throw new Error("Room not found");
        const data = await response.json();
        return data.room_id || null;
    } catch (error) {
        console.error("❌ Error fetching room ID:", error);
        return null;
    }
}

async function generateRepairNumber(roomId, equipmentId) {
    try {
        const response = await fetch(`http://localhost:3000/getLatestRepairNumber?room_id=${roomId}&equipment_id=${equipmentId}`);
        const data = await response.json();
        return `${roomId}-${equipmentId}-${(data.latest_number || 0) + 1}`;
    } catch (error) {
        console.error("❌ Error fetching latest repair number:", error);
        return `${roomId}-${equipmentId}-1`;
    }
}

async function logout() {
    try {
        console.log("🔄 กำลังออกจากระบบ...");
        const response = await fetch("http://localhost:3000/logout", {
            method: "POST",
            credentials: "include"
        });
        if (response.ok) {
            console.log("✅ ออกจากระบบสำเร็จ");
            alert("ออกจากระบบสำเร็จ");
            window.location.href = "login.html";
        } else {
            console.error("❌ เกิดข้อผิดพลาดในการออกจากระบบ");
            alert("เกิดข้อผิดพลาดในการออกจากระบบ กรุณาลองใหม่");
        }
    } catch (error) {
        console.error("❌ ไม่สามารถออกจากระบบได้:", error);
        alert("เกิดข้อผิดพลาด กรุณาลองใหม่");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const logoutButton = document.getElementById("logout-btn");
    if (logoutButton) {
        logoutButton.addEventListener("click", logout);
    }
});
