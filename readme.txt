# About SIPADU

SIPADU (Sistem Pemanen Air dari Udara) adalah sebuah sistem monitoring berbasis IoT yang dirancang untuk memantau suhu dan kelembapan udara secara real-time menggunakan sensor DHT22 dan ESP32. Data yang dikumpulkan dapat diakses melalui web monitoring dan juga melalui bot Telegram, sehingga pengguna dapat memantau kondisi lingkungan secara mudah dan fleksibel, baik dari komputer maupun perangkat mobile.

---------------------------------------------------------------
# DHT22 Monitoring Humidity & Temperature (SIPADU)
## Struktur Folder
- `arduino/` : berisi kode untuk ESP32 yang membaca sensor DHT22 dan mengirim data ke server Flask.
- `web/` : berisi file web untuk monitoring suhu & kelembapan secara real-time.
  - `monitor.html` : halaman utama monitoring.
  - `monitor.css` : style/tampilan web monitoring.
  - `monitor.js` : script untuk mengambil data dari server dan update tampilan web.
- `app.py` : server Flask untuk menerima data dari ESP32, menyediakan API untuk web, dan serve file statis.
- `telegram_polling.py` : script polling untuk bot Telegram agar bisa membalas perintah /start, /humidity, /temperature.
- `readme.txt` : file catatan ini.

---

## Cara Instalasi & Penggunaan

### 1. Jalankan Server Flask
- Pastikan Python sudah terinstall.
- Install dependency Flask dan requests:
  ```bash
  pip install flask requests
  ```
- Jalankan server Flask:
  ```bash
  python app.py
  ```
- Akses web monitoring di browser:
  - `http://localhost:5000/` (dari komputer lokal)
  - `http://<IP-komputer>:5000/` (dari HP/laptop lain di jaringan yang sama)

### 2. Jalankan Bot Telegram (Polling)
- Jalankan script polling di terminal lain:
  ```bash
  python telegram_polling.py
  ```
- Bot akan membalas perintah `/start`, `/humidity`, `/temperature` sesuai data terakhir dari server Flask.
- Tidak perlu webhook/ngrok, cukup polling.

### 3. Kirim Data dari ESP32
- Upload kode di folder `arduino/` ke ESP32.
- Pastikan ESP32 dan server Flask berada di jaringan WiFi yang sama.
- ESP32 akan mengirim data ke endpoint `/update` Flask secara periodik.

### 4. Penjelasan File
- **monitor.html** : Tampilan utama monitoring suhu & kelembapan.
- **monitor.css** : Style tampilan web.
- **monitor.js** : Mengambil data dari server (`/data`) dan update tampilan setiap 5 detik.
- **app.py** :
  - `/update` : menerima data POST dari ESP32.
  - `/data` : menyediakan data suhu & kelembapan untuk web/Telegram.
  - `/` dan `/<filename>` : serve file web statis.
- **telegram_polling.py** :
  - Polling ke Telegram API untuk membaca perintah dari user.
  - Mengambil data dari server Flask dan membalas ke Telegram.

### 5. Catatan Penting
- Jalankan Flask dan polling Telegram di terminal terpisah.
- Pastikan semua file web ada di folder `web/`.
- Untuk akses dari HP/laptop lain, gunakan IP address komputer yang menjalankan Flask.
- Jika ingin menambah fitur (grafik, alarm, dsb), modifikasi file web atau script Python sesuai kebutuhan.

---

Selamat menggunakan SIPADU (Sistem Pemanen Air dari Udara)!