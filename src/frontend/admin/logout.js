async function logout() {
    try {
        const response = await fetch("http://localhost:3001/logout", {
            method: "POST",
            credentials: "include"
        });

        if (response.ok) {
            alert("ออกจากระบบสำเร็จ");
            window.location.href = "login.html";
        } else {
            alert("เกิดข้อผิดพลาดในการออกจากระบบ");
        }
    } catch (error) {
        console.error("❌ ไม่สามารถออกจากระบบได้:", error);
        alert("เกิดข้อผิดพลาด กรุณาลองใหม่");
    }
}

// ✅ เพิ่ม Event Listener ให้ปุ่ม Logout ทำงานได้
document.getElementById("logout-button").addEventListener("click", logout);

// ✅ โหลดข้อมูลเซสชันเมื่อหน้าเว็บโหลด
window.onload = fetchUserInfo;