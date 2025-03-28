document.addEventListener("DOMContentLoaded", function () {
  const reportForm = document.getElementById("reportForm");
  const equipmentSelect = document.getElementById("equipment");
  const roomSelect = document.getElementById("room");
  const detailsSelect = document.getElementById("details");
  const imageInput = document.getElementById("image");
  const previewImage = document.getElementById("preview");
  const computerSection = document.getElementById("computer-section");
  const computerSelect = document.getElementById("computer");

  if (
    !reportForm ||
    !equipmentSelect ||
    !roomSelect ||
    !detailsSelect ||
    !imageInput ||
    !previewImage ||
    !computerSection ||
    !computerSelect
  ) {
    console.error("❌ ไม่พบองค์ประกอบบางตัวในหน้าเว็บ");
    return;
  }

  // แก้ไขส่วนการส่งข้อมูลไปยัง API ในฟังก์ชัน submit ของแบบฟอร์ม
  reportForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const equipment = equipmentSelect.value;
    const room = roomSelect.value;
    const details = detailsSelect.value;
    const additionalText =
      document.getElementById("additionalText").value || null;
    const fileInput = imageInput.files[0];

    // เก็บค่า computer_id (ถ้ามีการเลือก)
    let computerId = null;
    if (equipment === "คอมพิวเตอร์") {
      computerId = document.getElementById("computer").value || null;
      // ไม่บังคับเลือกคอมพิวเตอร์
    }

    if (!equipment || !room || !details) {
      alert("❌ กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    try {
      // 1) getEquipmentId, getRoomId
      const equipmentId = await getEquipmentId(equipment);
      const roomId = await getRoomId(room);
      if (!equipmentId || !roomId) {
        alert("❌ ไม่พบข้อมูลอุปกรณ์หรือห้องที่เลือก");
        return;
      }

      // 2) ดึงข้อมูลเซสชัน เพื่อระบุบทบาทผู้ใช้ที่ถูกต้อง
      const sessionResponse = await fetch("http://localhost:3000/session", {
        method: "GET",
        credentials: "include",
      });

      if (!sessionResponse.ok) {
        alert("❌ กรุณาเข้าสู่ระบบใหม่");
        window.location.href = "login.html";
        return;
      }

      const sessionData = await sessionResponse.json();
      const userRole = sessionData.role;
      const userId =
        userRole === "นิสิต"
          ? sessionData.data.student_id
          : sessionData.data.teacher_id;

      if (!userId) {
        alert("❌ ไม่พบข้อมูลผู้ใช้");
        window.location.href = "login.html";
        return;
      }

      console.log(`✅ ผู้ใช้: ${userRole}, ID: ${userId}`);

      // 3) generateRepairNumber
      const repairNumber = await generateRepairNumber(roomId, equipmentId);
      const parts = repairNumber.split("-");
      const nextNumber = parts[parts.length - 1]; // ตัวท้าย

      // 4) เตรียมเวลา
      const repairDate = new Date()
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");

      // (ตัวแปรที่ใช้บันทึก path)
      let imagePath = "";

      // **สร้าง formData** แค่ 1 ครั้ง
      const formData = new FormData();
      // ถ้ามีไฟล์ => ใส่ลง formData

      // ใส่ฟิลด์ sessionUserId, nextNumber
      formData.append("sessionUserId", userId);
      formData.append("nextNumber", nextNumber);

      if (fileInput) {
        formData.append("image", fileInput);
      }

      // 5) ถ้ามี fileInput => upload (POST /uploadReportImage)
      if (fileInput) {
        const uploadResponse = await fetch(
          "http://localhost:3000/uploadReportImage",
          {
            method: "POST",
            body: formData,
          }
        );

        const uploadResult = await uploadResponse.json();
        if (uploadResponse.ok && uploadResult.filePath) {
          // เช่น "/storage/equipment_img/64312995_4.jpg"
          imagePath = uploadResult.filePath;
        } else {
          alert("❌ เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ");
          return;
        }
      }

      // 6) หลังอัปโหลดเสร็จ => ส่งข้อมูลบันทึกลงตาราง (แก้ไขการส่ง student_id/teacher_id)
      const reportData = {
        repair_number: repairNumber,
        repair_date: repairDate,
        student_id: userRole === "นิสิต" ? userId : null,
        teacher_id: userRole === "อาจารย์" ? userId : null,
        equipment_id: equipmentId,
        room_id: roomId,
        computer_id: equipment === "คอมพิวเตอร์" ? computerId : null, // เพิ่มการส่ง computer_id
        damage: details,
        damage_details: additionalText,
        repair_status: "รอซ่อม",
        image_path: imagePath,
      };

      console.log("📋 ข้อมูลที่ส่งไป API:", reportData);

      const response = await fetch("http://localhost:3000/reportIssue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reportData),
      });

      if (response.ok) {
        // สร้างข้อความแสดงเครื่องคอมพิวเตอร์ (ถ้ามี)
        let computerText = "";
        if (computerId) {
          computerText = `<p><strong>🖥️ คอมพิวเตอร์:</strong> เครื่องที่ ${computerId}</p>`;
        }

        Swal.fire({
          title: "รายงานปัญหาสำเร็จ!",
          html: `
          <div style="text-align: center;">
            <p><strong>📍 ห้อง:</strong> ${room}</p>
            <p><strong>🛠 อุปกรณ์:</strong> ${equipment}</p>
            ${computerText}
            <p><strong>📋 รายละเอียด:</strong> ${details}</p>
            ${
              additionalText
                ? `<p><strong>📝 เพิ่มเติม:</strong> ${additionalText}</p>`
                : ""
            }
            <p style="color: red; font-weight: bold;">* การรายงานนี้ไม่สามารถเปลี่ยนแปลงได้</p>
          </div>
        `,
          icon: "success",
          confirmButtonText: "ตกลง",
        }).then(() => {
          window.location.reload();
        });
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

    // แสดงหรือซ่อนส่วนเลือกคอมพิวเตอร์
    const computerSection = document.getElementById("computer-section");
    if (equipment === "คอมพิวเตอร์") {
      computerSection.style.display = "block";
      // เรียกข้อมูลคอมพิวเตอร์ในห้องที่เลือก
      loadComputersInRoom();
    } else {
      computerSection.style.display = "none";
    }

    const problems = {
      สายไฟ: ["สายไฟชำรุด", "สายไฟขาด", "ปลั๊กไฟหลวม"],
      เก้าอี้: ["ขาเก้าอี้หัก", "เบาะชำรุด", "พนักพิงหลุด"],
      โต๊ะ: ["ขาโต๊ะหัก", "พื้นโต๊ะมีรอย", "โต๊ะโยก"],
      จอคอมพิวเตอร์: ["หน้าจอไม่ติด", "จอมีรอยแตก", "ภาพไม่ชัด"],
      โปรเจคเตอร์: ["โปรเจคเตอร์ไม่ติด", "ภาพเบลอ", "รีโมทไม่ทำงาน"],
      ทีวี: ["ทีวีไม่ติด", "เสียงไม่ออก", "จอภาพไม่ชัด"],
      เครื่องปรับอากาศ: ["ไม่มีความเย็น", "มีน้ำหยด", "เปิดไม่ติด"],
      วิชวลไลเซอร์: ["เครื่องไม่ทำงาน", "แสงไม่ออก", "ภาพไม่ขึ้น"],
      hub: ["พอร์ตไม่ทำงาน", "ไฟไม่ติด", "อุปกรณ์ไม่เชื่อมต่อ"],
      router: ["ไม่มีสัญญาณ", "ไฟไม่ติด", "เชื่อมต่อช้า"],
      switch: ["พอร์ตไม่ทำงาน", "อุปกรณ์ไม่ตอบสนอง", "ไฟสถานะไม่ขึ้น"],
      พอยเตอร์: ["แบตเตอรี่หมด", "แสงไม่ออก", "ปุ่มกดเสีย"],
      เมาส์: ["ปุ่มคลิกไม่ทำงาน", "ตัวชี้เมาส์ไม่ขยับ", "สายเมาส์ชำรุด"],
      คีย์บอร์ด: ["ปุ่มกดไม่ติด", "ปุ่มบางตัวหลุด", "แสงไฟไม่ติด"],
      ปลั๊กไฟ: ["ปลั๊กไฟชำรุด", "สายไฟหลวม", "ไฟไม่ออก"],
      เสียงไมค์: ["ไมค์ไม่มีเสียง", "เสียงขาดหาย", "ไมค์ไม่เชื่อมต่อ"],
      คอมพิวเตอร์: [
        "เครื่องไม่เปิด",
        "หน้าจอไม่แสดงผล",
        "คีย์บอร์ดหรือเมาส์ไม่ตอบสนอง",
        "จอฟ้า",
      ],
    };

    if (problems[equipment]) {
      problems[equipment].forEach((problem) => {
        const option = document.createElement("option");
        option.value = problem;
        option.textContent = problem;
        detailsSelect.appendChild(option);
      });
    }
  });

  // เพิ่มฟังก์ชันโหลดข้อมูลคอมพิวเตอร์ตามห้อง
  async function loadComputersInRoom() {
    const roomSelect = document.getElementById("room");
    const computerSelect = document.getElementById("computer");
    const selectedRoom = roomSelect.value;

    if (!selectedRoom) {
      console.warn("❌ ไม่ได้เลือกห้อง");
      return;
    }

    try {
      // ดึง room_id จากชื่อห้อง
      const roomIdResponse = await fetch(
        `http://localhost:3000/getRoomId?name=${encodeURIComponent(
          selectedRoom
        )}`
      );

      if (!roomIdResponse.ok) {
        throw new Error("ไม่พบข้อมูลห้อง");
      }

      const roomData = await roomIdResponse.json();
      const roomId = roomData.room_id;

      // ดึงข้อมูลคอมพิวเตอร์ในห้องนั้น
      const computersResponse = await fetch(
        `http://localhost:3000/getComputersByRoom?room_id=${roomId}`
      );

      if (!computersResponse.ok) {
        throw new Error("ไม่สามารถดึงข้อมูลคอมพิวเตอร์ได้");
      }

      const computersData = await computersResponse.json();

      // รีเซ็ตตัวเลือกคอมพิวเตอร์
      computerSelect.innerHTML = '<option value="">-- กรุณาเลือก --</option>';

      // เพิ่มตัวเลือกคอมพิวเตอร์
      if (computersData.computers && computersData.computers.length > 0) {
        computersData.computers.forEach((computer) => {
          const option = document.createElement("option");
          option.value = computer.computer_id;
          option.textContent = `คอมพิวเตอร์ #${computer.computer_id}`;
          computerSelect.appendChild(option);
        });
        console.log(
          `✅ โหลดข้อมูลคอมพิวเตอร์สำเร็จ: ${computersData.computers.length} เครื่อง`
        );
      } else {
        console.log("⚠️ ไม่พบคอมพิวเตอร์ให้เลือก (ระบุในข้อความเพิ่มเติม)");
        const option = document.createElement("option");
        option.value = "";
        option.textContent =
          "ไม่พบคอมพิวเตอร์ให้เลือก (ระบุในข้อความเพิ่มเติม)";
        computerSelect.appendChild(option);
      }
    } catch (error) {
      console.error("❌ เกิดข้อผิดพลาดในการโหลดข้อมูลคอมพิวเตอร์:", error);
    }
  }

  // เมื่อเปลี่ยนห้องและกำลังเลือกคอมพิวเตอร์ ให้โหลดข้อมูลคอมพิวเตอร์ใหม่
  roomSelect.addEventListener("change", function () {
    if (equipmentSelect.value === "คอมพิวเตอร์") {
      loadComputersInRoom();
    }
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
      const response = await fetch(
        `http://localhost:3000/getEquipmentId?name=${encodeURIComponent(
          equipmentName
        )}`
      );
      if (!response.ok) throw new Error("Equipment not found");
      const data = await response.json();
      console.log(`✅ Equipment ID: ${data.equipment_id}`);
      return data.equipment_id;
    } catch (error) {
      console.error("❌ Error fetching equipment ID:", error);
      return null;
    }
  }

  // เพิ่มฟังก์ชันโหลดข้อมูลคอมพิวเตอร์ตามห้อง
  // เพิ่มฟังก์ชันโหลดข้อมูลคอมพิวเตอร์ตามห้อง
  async function loadComputersInRoom() {
    const roomSelect = document.getElementById("room");
    const computerSelect = document.getElementById("computer");
    const selectedRoom = roomSelect.value;

    if (!selectedRoom) {
      console.warn("❌ ไม่ได้เลือกห้อง");
      return;
    }

    try {
      // ดึง room_id จากชื่อห้อง
      const roomIdResponse = await fetch(
        `http://localhost:3000/getRoomId?name=${encodeURIComponent(
          selectedRoom
        )}`
      );

      if (!roomIdResponse.ok) {
        throw new Error("ไม่พบข้อมูลห้อง");
      }

      const roomData = await roomIdResponse.json();
      const roomId = roomData.room_id;

      // ใช้ API /getComputersByRoom เพื่อดึงข้อมูลคอมพิวเตอร์ในห้องที่เลือก
      const computersResponse = await fetch(
        `http://localhost:3000/getComputersByRoom?room_id=${roomId}`
      );

      if (!computersResponse.ok) {
        throw new Error("ไม่สามารถดึงข้อมูลคอมพิวเตอร์ได้");
      }

      const computersData = await computersResponse.json();

      // รีเซ็ตตัวเลือกคอมพิวเตอร์
      computerSelect.innerHTML =
        '<option value="">-- กรุณาเลือกเครื่องคอมพิวเตอร์ --</option>';

      // เพิ่มตัวเลือกคอมพิวเตอร์
      if (computersData.computers && computersData.computers.length > 0) {
        // เรียงลำดับ computer_id
        computersData.computers.sort((a, b) => a.computer_id - b.computer_id);

        computersData.computers.forEach((computer) => {
          const option = document.createElement("option");
          option.value = computer.computer_id;
          option.textContent = `คอมพิวเตอร์ #${computer.computer_id}`;
          computerSelect.appendChild(option);
        });

        console.log(
          `✅ โหลดข้อมูลคอมพิวเตอร์สำเร็จ: ${computersData.computers.length} เครื่อง`
        );
      } else {
        console.log("⚠️ ไม่พบคอมพิวเตอร์ให้เลือก (ระบุในข้อความเพิ่มเติม)");
        const option = document.createElement("option");
        option.value = "";
        option.textContent =
          "ไม่พบคอมพิวเตอร์ให้เลือก (ระบุในข้อความเพิ่มเติม)";
        computerSelect.appendChild(option);
      }
    } catch (error) {
      console.error("❌ เกิดข้อผิดพลาดในการโหลดข้อมูลคอมพิวเตอร์:", error);
    }
  }

  // ฟังก์ชันดึงค่า room_id จากชื่อห้อง
  async function getRoomId(roomName) {
    try {
      const response = await fetch(
        `http://localhost:3000/getRoomId?name=${encodeURIComponent(roomName)}`
      );
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
      const response = await fetch(
        `http://localhost:3000/getLatestRepairNumber?room_id=${roomId}&equipment_id=${equipmentId}`
      );
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
        credentials: "include",
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

// ประกาศตัวแปรเพิ่มเติม
let sessionUserId = null;
let userRole = null; // เพิ่มตัวแปร userRole เพื่อเก็บบทบาทผู้ใช้

async function fetchUserInfo() {
  try {
    console.log("🔄 กำลังโหลดข้อมูลเซสชัน...");
    const response = await fetch("http://localhost:3000/session", {
      method: "GET",
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error("Session expired");
    }
    const userSession = await response.json();
    console.log("✅ ข้อมูลผู้ใช้ที่ได้จาก API:", userSession);

    // ถ้ามีข้อมูล userSession.data จึงค่อยนำมาเก็บในตัวแปร sessionUserId
    if (userSession && userSession.data) {
      // เก็บบทบาทผู้ใช้
      userRole = userSession.role;

      // เก็บ ID ของผู้ใช้ตามบทบาท
      sessionUserId =
        userRole === "นิสิต"
          ? userSession.data.student_id
          : userSession.data.teacher_id;

      console.log(`👤 ผู้ใช้งานระบบ: ${userRole}, ID: ${sessionUserId}`);
    } else {
      alert("กรุณาเข้าสู่ระบบใหม่");
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
      credentials: "include",
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
    const response = await fetch(
      `http://localhost:3000/getEquipmentId?name=${encodeURIComponent(
        equipmentName
      )}`
    );
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
    const response = await fetch(
      `http://localhost:3000/getRoomId?name=${encodeURIComponent(roomName)}`
    );
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
    const response = await fetch(
      `http://localhost:3000/getLatestRepairNumber?room_id=${roomId}&equipment_id=${equipmentId}`
    );
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
      credentials: "include",
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
