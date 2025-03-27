// ✅ ใช้ SweetAlert แทน alert()
// ✅ ใช้ LocalStorage บันทึกข้อมูล
// ✅ แสดงตัวอย่างภาพ + ยืนยันข้อมูลก่อนส่ง

document.addEventListener("DOMContentLoaded", function () {
    const reportForm = document.getElementById("reportForm");
    const equipmentSelect = document.getElementById("equipment");
    const roomSelect = document.getElementById("room");
    const detailsSelect = document.getElementById("details");
    const imageInput = document.getElementById("image");
    const previewImage = document.getElementById("preview");
    const logoutButton = document.getElementById("logout-btn");

    if (!reportForm || !equipmentSelect || !roomSelect || !detailsSelect || !imageInput || !previewImage) {
        console.error("❌ ไม่พบองค์ประกอบบางตัวในหน้าเว็บ");
        return;
    }

    reportForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const equipment = equipmentSelect.value;
        const room = roomSelect.value;
        const details = detailsSelect.value;

        if (!equipment || !room || !details) {
            Swal.fire("กรอกข้อมูลไม่ครบ", "กรุณาเลือกอุปกรณ์ ห้อง และรายละเอียดปัญหา", "warning");
            return;
        }

        let imageData = "";
        if (imageInput.files.length > 0) {
            const file = imageInput.files[0];

            if (!file.type.startsWith("image/")) {
                Swal.fire("ไฟล์ไม่ถูกต้อง", "กรุณาอัปโหลดเฉพาะไฟล์รูปภาพ (JPEG, PNG, GIF)", "error");
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                Swal.fire("ไฟล์ใหญ่เกินไป", "กรุณาอัปโหลดรูปภาพที่มีขนาดไม่เกิน 5MB", "error");
                return;
            }

            const reader = new FileReader();
            reader.onload = function (e) {
                imageData = e.target.result;
                confirmBeforeSave(equipment, room, details, imageData);
            };
            reader.readAsDataURL(file);
        } else {
            confirmBeforeSave(equipment, room, details, imageData);
        }
    });

    function saveReport(equipment, room, details, imageData, additionalText) {
        let reports = JSON.parse(localStorage.getItem("reports")) || [];
        reports.push({
            equipment,
            room,
            details,
            additionalText,
            image: imageData,
            date: new Date().toLocaleString()
        });
        localStorage.setItem("reports", JSON.stringify(reports));

        Swal.fire({
            title: "รายงานปัญหาสำเร็จ!",
            text: "คุณต้องการกลับไปที่หน้าหลักหรือไม่?",
            icon: "success",
            showCancelButton: true,
            confirmButtonText: "กลับหน้าหลัก",
            cancelButtonText: "รายงานต่อ",
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = "home.html";
            } else {
                reportForm.reset();
                previewImage.style.display = "none";
            }
        });
    }

    function confirmBeforeSave(equipment, room, details, imageData) {
        const additionalText = document.getElementById("additionalText").value.trim() || "-";

        Swal.fire({
            title: "<strong>ยืนยันรายงานปัญหา?</strong>",
            icon: "warning",
            html: `
                <div style="text-align: center; font-size: 16px;">
                    <b>อุปกรณ์:</b> ${equipment}<br>
                    <b>ห้อง:</b> ${room}<br>
                    <b>รายละเอียด:</b> ${details}<br>
                    <b>ข้อความเพิ่มเติม:</b> ${additionalText}<br><br>
                    <span style="color: red;">หากยืนยันแล้วจะไม่สามารถเปลี่ยนแปลงได้</span>
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: "ยืนยัน",
            cancelButtonText: "ยกเลิก",
            confirmButtonColor: "#7c4dff",
            cancelButtonColor: "#616161",
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                saveReport(equipment, room, details, imageData, additionalText);
            }
        });
    }

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
            "คอมพิวเตอร์": ["เครื่องไม่เปิด", "หน้าจอไม่แสดงผล", "คีย์บอร์ดหรือเมาส์ไม่ตอบสนอง"]
        };

        if (problems[equipment]) {
            problems[equipment].forEach(problem => {
                const option = document.createElement("option");
                option.value = problem;
                option.textContent = problem;
                detailsSelect.appendChild(option);
            });
        } else {
            Swal.fire("ไม่มีข้อมูล", "ไม่มีปัญหาที่กำหนดไว้สำหรับอุปกรณ์นี้ กรุณากรอกรายละเอียดเพิ่มเติมในช่องหมายเหตุ", "info");
        }
    });

    imageInput.addEventListener("change", function (event) {
        const file = event.target.files[0];

        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                previewImage.src = e.target.result;
                previewImage.style.display = "block";
                previewImage.style.maxWidth = "300px";
                previewImage.style.maxHeight = "200px";
            };
            reader.readAsDataURL(file);
        } else {
            previewImage.style.display = "none";
        }
    });

    if (logoutButton) {
        logoutButton.addEventListener("click", async () => {
            try {
                const response = await fetch("http://localhost:3000/logout", {
                    method: "POST",
                    credentials: "include"
                });
                if (response.ok) {
                    Swal.fire("ออกจากระบบสำเร็จ", "", "success").then(() => {
                        window.location.href = "login.html";
                    });
                } else {
                    Swal.fire("เกิดข้อผิดพลาด", "กรุณาลองใหม่", "error");
                }
            } catch (error) {
                Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถติดต่อเซิร์ฟเวอร์ได้", "error");
            }
        });
    }
});
