function gen() {
    let roomRequestId = document.getElementById("room_request_id").value;
    if (!roomRequestId) {
        alert("กรุณากรอก Room Request ID");
        return;
    }
  
    fetch("http://localhost:3000/generate-pdf", { // ✅ ต้องเป็น HTTP POST
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomRequestId: roomRequestId })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            document.getElementById("message").innerText = "สร้าง PDF สำเร็จ!";
            window.open(data.filePath, "_blank");  // เปิดไฟล์ PDF
        } else {
            alert("เกิดข้อผิดพลาด: " + data.error);
        }
    })
    .catch(error => console.error("Error:", error));
  }
  