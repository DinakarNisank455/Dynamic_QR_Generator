document.addEventListener('DOMContentLoaded', function () {
    const select = document.getElementById('upi-select');
    const newUpiForm = document.getElementById('new-upi-form');
    const qrContainer = document.getElementById('qr-code');
    const upiNameDisplay = document.getElementById('upi-name');

    function loadUpiIds() {
        const storedUpiIds = JSON.parse(localStorage.getItem('upiIds')) || [];
        select.innerHTML = `<option value="" disabled selected>Select a UPI ID</option>
                            <option value="add_new">+ Add New UPI ID</option>`;

        storedUpiIds.forEach(entry => {
            const option = document.createElement('option');
            option.value = entry.upiId;
            option.textContent = `${entry.name} (${entry.upiId})`;
            option.setAttribute("data-name", entry.name);
            select.appendChild(option);
        });
    }

    select.addEventListener('change', function () {
        if (this.value === "add_new") {
            newUpiForm.style.display = 'block';
        } else {
            newUpiForm.style.display = 'none';
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

    document.getElementById('generate-btn').addEventListener('click', function () {
        const upiId = select.value;
        const selectedOption = select.options[select.selectedIndex];
        const name = selectedOption.getAttribute('data-name') || '';
        const amount = document.getElementById('amount').value;

        if (!upiId || !amount) {
            alert("Please select a UPI ID and enter an amount.");
            return;
        }

        // Generate UPI string with amount
        const upiString = `upi://pay?pa=${upiId}&am=${amount}&cu=INR`;

        // Clear old QR code and generate a new one
        qrContainer.innerHTML = "";
        new QRCode(qrContainer, upiString);

        // Display payee name
        upiNameDisplay.textContent = `Payee: ${name}`;
    });

    loadUpiIds();
});
