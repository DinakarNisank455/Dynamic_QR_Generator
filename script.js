document.addEventListener('DOMContentLoaded', function () {
    const select = document.getElementById('upi-select');
    const newUpiForm = document.getElementById('new-upi-form');
    const qrContainer = document.getElementById('qr-container');

    function loadUpiIds() {
        const storedUpiIds = JSON.parse(localStorage.getItem('upiIds')) || [];
        select.innerHTML = `<option value="" disabled selected>Select a UPI ID</option>
                            <option value="add_new">+ Add New UPI ID</option>`;

        storedUpiIds.forEach(entry => {
            const option = document.createElement('option');
            option.value = entry.upiId;
            option.textContent = `${entry.name} (${entry.upiId})`;
            select.appendChild(option);
        });
    }

    select.addEventListener('change', function () {
        if (this.value === "add_new") {
            newUpiForm.style.display = 'block';
        } else {
            newUpiForm.style.display = 'none';
            generateQrCode(this.value);
        }
    });

    document.getElementById('save-upi').addEventListener('click', function () {
        const newUpiId = document.getElementById('new-upi-id').value;
        const newName = document.getElementById('new-name').value;

        if (!newUpiId || !newName) {
            alert("Please enter UPI ID and Name.");
            return;
        }

        const storedUpiIds = JSON.parse(localStorage.getItem('upiIds')) || [];
        storedUpiIds.push({ upiId: newUpiId, name: newName });
        localStorage.setItem('upiIds', JSON.stringify(storedUpiIds));

        alert("UPI ID saved successfully!");
        loadUpiIds();
        newUpiForm.style.display = 'none';
    });

    function generateQrCode(upiId) {
        qrContainer.innerHTML = `<img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=${upiId}" alt="QR Code">
                                 <p>${upiId}</p>`;
    }

    loadUpiIds();
});
