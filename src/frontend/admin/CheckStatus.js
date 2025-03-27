async function checkSession() {
  try {
      console.log("🔄 Checking session...");
      const response = await fetch("http://localhost:3001/session", {
          method: "GET",
          credentials: "include" // ✅ ต้องใส่เพื่อให้ส่งคุกกี้
      });

      console.log("📡 Response Status:", response.status);
      if (!response.ok) {
          throw new Error("Session expired or unauthorized");
      }

      const data = await response.json();
      console.log("✅ Session Data:", data);
  } catch (error) {
      console.error("❌ Session error:", error);
      alert("เกิดข้อผิดพลาด กรุณาเข้าสู่ระบบใหม่");
      window.location.href = "login.html";
  }
}

// ✅ เรียกใช้เมื่อล็อกอินเสร็จแล้ว
checkSession();