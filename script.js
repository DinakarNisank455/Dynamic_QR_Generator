document.addEventListener('DOMContentLoaded', function () {
    const select = document.getElementById('upi-select');
    const newUpiForm = document.getElementById('new-upi-form');
    const amountContainer = document.getElementById('amount-container');
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
            amountContainer.style.display = 'none';  // Hide amount input
        } else {
            newUpiForm.style.display = 'none';
            amountContainer.style.display = 'block'; // Show amount input
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
        amountContainer.style.display = 'block'; // Show amount input again
    });

    document.getElementById('generate-btn').addEventListener('click', function () {
        const upiId = select.value;
        if (!upiId || upiId === "add_new") {
            alert("Please select a valid UPI ID.");
            return;
        }

        const selectedOption = select.options[select.selectedIndex];
        const name = selectedOption.getAttribute('data-name') || '';

        const amount = document.getElementById('amount').value;
        if (!amount || isNaN(amount) || amount <= 0) {
            alert("Please enter a valid amount.");
            return;
        }

        // Generate UPI string with amount
        const upiString = `upi://pay?pa=${upiId}&am=${amount}&cu=INR`;

        // Clear old QR code and generate a new one
        qrContainer.innerHTML = "";
        new QRCode(qrContainer, {
            text: upiString,
            width: 200,
            height: 200
        });

        // Display payee name
        upiNameDisplay.textContent = `Payee: ${name}`;
    });

    loadUpiIds();
});
