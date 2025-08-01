import csv
from datetime import datetime
from flask import Flask, request, jsonify, send_from_directory, send_file
import requests
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Data terakhir dari sensor
data_store = {"temperature": None, "humidity": None}

def get_last_csv_row(filename):
    try:
        with open(filename, 'r', encoding='utf-8') as f:
            lines = [line.strip() for line in f if line.strip()]  # hanya baris yang tidak kosong
            if len(lines) > 1:
                return lines[-1].split(';')
    except Exception:
        pass
    return None

@app.route('/update', methods=['POST'])
def update_data():
    global data_store
    data = request.get_json()
    data_store = data
    now = datetime.now()
    waktu = now.strftime('%H:%M:%S')
    jam = now.hour
    timestamp = now.isoformat()
    suhu = data.get('temperature')
    kelembapan = data.get('humidity')
    file_exists = os.path.isfile('data_log.csv')
    # Cek apakah sudah ada data pada waktu ini
    if (jam == 8 or jam == 20) and now.minute == 0:
        last_row = get_last_csv_row('data_log.csv')
        # last_row: [timestamp, Waktu, Kelembapan, Suhu]
        if last_row:
            last_time = last_row[1]  # kolom 'Waktu'
            last_date = last_row[0][:10]  # tanggal dari timestamp
            today = now.strftime('%Y-%m-%d')
            # Jika sudah ada data pada waktu dan tanggal yang sama, jangan simpan lagi
            if last_time == waktu and last_date == today:
                return jsonify({"status": "duplicate"})
        with open('data_log.csv', 'a', newline='') as f:
            writer = csv.writer(f, delimiter=';')
            if not file_exists or f.tell() == 0:
                writer.writerow(['timestamp', 'Waktu', 'Kelembapan (%)', 'Suhu (°C)'])
            writer.writerow([timestamp, waktu, kelembapan, suhu])
    return jsonify({"status": "success"})

@app.route('/data', methods=['GET'])
def get_data():
    # Jika data_store sudah ada data, pakai itu
    if data_store["temperature"] is not None and data_store["humidity"] is not None:
        return jsonify(data_store)
    # Jika belum, coba baca data terakhir dari data_log.csv
    last_row = get_last_csv_row('data_log.csv')
    if last_row:
        # last_row: [timestamp, Waktu, Kelembapan, Suhu]
        try:
            humidity = float(last_row[2])
            temperature = float(last_row[3])
            return jsonify({"temperature": temperature, "humidity": humidity})
        except Exception:
            pass
    # Jika tetap gagal, return null
    return jsonify({"temperature": None, "humidity": None})

@app.route('/export')
def export_data():
    return send_file('data_log.csv', as_attachment=True)

@app.route('/')
def index():
    return send_from_directory('web/html', 'index.html')

@app.route('/<path:filename>')
def static_files(filename):
    return send_from_directory('web', filename)

@app.route('/history')
def history():
    date = request.args.get('date')
    data = []
    if date:
        try:
            with open('data_log.csv', 'r', encoding='utf-8') as f:
                reader = csv.DictReader(f, delimiter=';')
                for row in reader:
                    if row['timestamp'].startswith(date):
                        data.append({
                            'timestamp': row['timestamp'],
                            'Waktu': row['Waktu'],
                            'humidity': float(row['Kelembapan (%)']),
                            'temperature': float(row['Suhu (°C)'])
                        })
        except Exception as e:
            return jsonify({'error': str(e)})
    return jsonify(data)

@app.route('/html/<path:filename>')
def html_files(filename):
    return send_from_directory('web/html', filename)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)
