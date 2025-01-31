from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os

app = Flask(__name__)
CORS(app)

UPI_DATA_FILE = "upi_data.json"

# Load UPI IDs from file
def load_upi_data():
    if os.path.exists(UPI_DATA_FILE):
        with open(UPI_DATA_FILE, "r") as file:
            return json.load(file)
    return []

# Save UPI IDs to file
def save_upi_data(data):
    with open(UPI_DATA_FILE, "w") as file:
        json.dump(data, file, indent=4)

@app.route('/get_upi_ids', methods=['GET'])
def get_upi_ids():
    upi_data = load_upi_data()
    return jsonify(upi_data)

@app.route('/add_upi_id', methods=['POST'])
def add_upi_id():
    data = request.json
    upi_id = data.get('upiId')
    name = data.get('name')

    if not upi_id or not name:
        return jsonify({'error': 'Missing fields'}), 400

    upi_data = load_upi_data()
    if any(entry['upiId'] == upi_id for entry in upi_data):
        return jsonify({'error': 'UPI ID already exists'}), 400

    upi_data.append({"upiId": upi_id, "name": name})
    save_upi_data(upi_data)
    return jsonify({'message': 'UPI ID added successfully'})

if __name__ == '__main__':
    if not os.path.exists(UPI_DATA_FILE):
        save_upi_data([])  # Initialize empty file
    app.run(debug=True)
