function calculateStatement() {
    const name = document.getElementById('studentName').value;
    const course = document.getElementById('courseName').value;
    const totalFee = parseFloat(document.getElementById('totalFee').value) || 0;
    const amountPaid = parseFloat(document.getElementById('amountPaid').value) || 0;

    if (!name || !course || totalFee <= 0) {
        alert("Please enter the student name, course, and total fee.");
        return;
    }

    const balance = totalFee - amountPaid;
    let statusColor = balance <= 0 ? "green" : "#e67e22";
    let paymentStatus = balance <= 0 ? "FULLY PAID" : "BALANCE OUTSTANDING";

    const outputDiv = document.getElementById('output');
    outputDiv.style.display = "block";
    outputDiv.innerHTML = `
        <h3>Fee Statement Summary</h3>
        <p><strong>Student:</strong> ${name}</p>
        <p><strong>Course:</strong> ${course}</p>
        <hr>
        <p><strong>Total Fee Required:</strong> ${totalFee.toLocaleString()}</p>
        <p><strong>Total Amount Paid:</strong> ${amountPaid.toLocaleString()}</p>
        <p><strong>Remaining Balance:</strong> <span style="color: ${statusColor}; font-weight: bold;">${balance.toLocaleString()}</span></p>
        <p><strong>Status:</strong> <strong style="color: ${statusColor};">${paymentStatus}</strong></p>
    `;
}