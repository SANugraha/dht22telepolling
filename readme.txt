# SIPADU (Sistem Pemanen Air dari Udara)

SIPADU adalah sistem monitoring suhu & kelembapan udara berbasis IoT yang terintegrasi dengan web (Vercel), backend Python (Railway), ESP32 (DHT22), dan bot Telegram. Sistem ini memudahkan pemantauan kondisi lingkungan secara real-time dari mana saja.

---

## Struktur Folder
- `arduino/` : Kode ESP32 untuk membaca sensor DHT22 dan mengirim data ke backend Railway.
- `web/` : File web statis (HTML, CSS, JS) untuk monitoring suhu & kelembapan.
  - `html/` : Halaman web (landing, monitor, about).
  - `css/` : Style halaman web.
  - `js/` : Script frontend (fetch data dari backend, update chart, dsb).
- `app.py` : Backend Flask (API) untuk menerima data dari ESP32, menyediakan data ke web & Telegram, serta ekspor data CSV.
- `telegram_polling.py` : Script polling bot Telegram untuk membalas perintah /start, /humidity, /temperature.
- `data_log.csv` : Log data suhu & kelembapan.
- `readme.txt` : Dokumentasi ini.

---

## Alur Sistem SIPADU
1. **ESP32 + DHT22** membaca suhu & kelembapan, lalu mengirim data ke backend Railway (`/update`).
2. **Backend Flask (Railway)** menyimpan data terbaru dan menyediakan API (`/data`, `/export`, dsb).
3. **Frontend Web (Vercel)** mengambil data dari backend Railway dan menampilkan monitoring real-time.
4. **Bot Telegram** polling ke backend untuk membalas perintah user dengan data terbaru.

---

## Cara Deploy & Penggunaan

### 1. Deploy Backend (Flask) ke Railway
- Pastikan file `requirements.txt` berisi: `flask`, `flask-cors`, `requests`, `gunicorn`.
- (Opsional) Tambahkan `Procfile` dengan isi: `web: gunicorn app:app`
- Push ke GitHub, deploy ke Railway, dan pastikan endpoint API (misal `/data`, `/update`) bisa diakses publik.

### 2. Deploy Frontend ke Vercel
- Upload seluruh folder `web/` ke Vercel (bisa lewat GitHub).
- Update semua URL API di file JS (misal `monitor.js`) agar mengarah ke backend Railway.
- Deploy dan akses web monitoring dari domain Vercel.

### 3. Setting ESP32
- Upload kode di `arduino/` ke ESP32.
- Ganti `serverUrl` di kode menjadi URL backend Railway (`https://xxx.up.railway.app/update`).
- Pastikan ESP32 terhubung ke WiFi dengan akses internet.

### 4. Bot Telegram
- Jalankan `telegram_polling.py` di server/PC yang bisa mengakses backend Railway.
- Bot akan membalas perintah `/start`, `/humidity`, `/temperature` dengan data terbaru.

---

## Penjelasan File Utama
- **app.py** :
  - `/update` : Menerima data POST dari ESP32.
  - `/data` : Menyediakan data suhu & kelembapan (JSON) untuk web/Telegram.
  - `/export` : Download data log CSV.
  - Serve file web statis.
- **monitor.js** :
  - Fetch data dari backend Railway (`/data`).
  - Update tampilan dashboard dan chart secara realtime.
- **monitor.html** :
  - Halaman utama monitoring suhu & kelembapan.
- **telegram_polling.py** :
  - Polling ke Telegram API, membalas perintah user dengan data dari backend.
- **data_log.csv** :
  - Log data suhu & kelembapan yang diterima backend.

---

## Catatan Penting
- Semua request API di frontend **harus diarahkan ke backend Railway**.
- Jika ada error CORS, pastikan `flask-cors` sudah diaktifkan di backend.
- Untuk ekspor data, link export di web harus mengarah ke backend Railway.
- Jika ingin menambah fitur (grafik, notifikasi, dsb), modifikasi file web atau script Python sesuai kebutuhan.

---

Selamat menggunakan SIPADU! Untuk pertanyaan atau pengembangan lebih lanjut, silakan hubungi tim pengembang.