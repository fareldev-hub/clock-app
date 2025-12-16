Preview : https://fareldev-hub.github.io/clock-app/

Clock App

Aplikasi web sederhana berbasis **HTML, CSS & JavaScript** dengan fitur-fitur berikut:

- Jam lokal (realtime sesuai zona waktu pengguna)  
- Alarm — atur jam & menit lewat dropdown `<select>`  
- Stopwatch — fungsi Start / Stop / Reset  
- Jam dunia — pilih kota dan tampilkan waktu lokal kota tersebut  

---
```markdown# 
## 📂 Struktur Proyek

clock-app/
│
├── src/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
└── README.md
```

- `index.html` — file HTML utama  
- `style.css` — styling & tampilan  
- `script.js` — logika JavaScript untuk jam, alarm, stopwatch, jam dunia  
- `README.md` — dokumentasi proyek  

---

## 🚀 Cara Menjalankan

1. Clone atau download repositori:
   ```bash
   git clone https://github.com/fareldev-hub/clock-app.git
   ```

2. Masuk ke folder proyek:

   ```bash
   cd clock-app
   ```
3. Buka file `src/index.html` di browser (klik ganda atau via `Live Server` di IDE).

---

## 🛠 Fitur & Penjelasan

### Jam Lokal

Menampilkan jam di komputer pengguna secara realtime, juga zona waktunya.

### Alarm

* Pilih jam & menit melalui dropdown `<select>`
* Bila jam & menit itu tercapai, akan berbunyi suara alarm dan muncul *alert*

### Stopwatch

* Terdapat tombol **Start**, **Stop**, dan **Reset**
* Hitungan waktu dalam format `HH:MM:SS`

### Jam Dunia

* Terdapat dropdown pilihan kota (misalnya: Jakarta, Tokyo, London, New York, Sydney)
* Menampilkan waktu kota tersebut realtime

---

## 🎨 Desain & Tampilan

* Background dengan gradien dan elemen transparan (effect glassmorphism)
* Navigasi menggunakan navbar dengan tombol
* Hanya satu konten (jam lokal / alarm / stopwatch / jam dunia) yang tampil tiap waktu

---

---

## 📜 Lisensi

Proyek ini bersifat terbuka (open source) dan bebas digunakan untuk keperluan pembelajaran atau pengembangan sendiri.
Silakan modifikasi sesuai kebutuhan.

---

## ✏️ Kontribusi

Kalau kamu ingin menambah fitur (misalnya: mode gelap/terang, pilihan ringtone, notifikasi push), silakan fork dan kirim PR.
Jangan lupa tulis dokumentasi perubahanmu di README juga.

---


[1]: https://github.com/fareldev-hub/clock-app "GitHub - fareldev-hub/clock-app"
