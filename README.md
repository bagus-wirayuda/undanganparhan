# Undangan pernikahan Lili & Parhan

Undangan web statis yang berfokus pada layar ponsel. Buka `index.html` langsung di browser; tidak memerlukan instalasi, proses build, atau server. Untuk membagikan undangan, unggah seluruh isi folder ke hosting statis.

## Nama tamu melalui tautan

Tambahkan parameter `to` pada alamat undangan:

```text
https://alamat-undangan-anda.com/?to=Bpk.%20Bagus%20Wirayuda
```

Nama pada sampul otomatis berubah menjadi **Bpk. Bagus Wirayuda**. Parameter `nama` juga didukung. Tanpa parameter, nama yang tampil adalah **Tamu Istimewa**. Gunakan `%20` untuk spasi atau buat nama dengan `encodeURIComponent()` bila menyusun tautan lewat kode. Nama ditampilkan sebagai teks biasa untuk menjaga keamanan.

## Informasi acara

- **Mempelai:** Sulis Saputri (Lili) dan M. Parhan Pawis (Parhan).
- **Akad:** Minggu, 25 Oktober 2026, pukul 11.00 WITA.
- **Alamat:** Panjang Selatan, Desa Labbo, Kec. Tompobulu, Kab. Bantaeng.
- **Orang tua perempuan:** Diana dan Jufri.
- **Orang tua laki-laki:** Alm. Ibu Hamdana Hafid dan Bapak Bohari.

Tombol lokasi membuka pencarian alamat Google Maps. Titik koordinat khusus tidak dibuat karena belum diberikan. Berkas kalender menyimpan waktu akad yang tepat, tanpa mengarang waktu selesai.

## Isi dan pengaturan

- `index.html`: teks, urutan bagian, dan struktur undangan.
- `style.css`: warna, tampilan mobile, dekorasi, dan animasi pembukaan.
- `script.js`: nama tamu, transisi, hitung mundur, kalender, salin alamat dan rekening, galeri foto, musik, dan navigasi.
- `assets/`: ilustrasi dan aset visual undangan.
- `assets/moment-01.webp`, `assets/moment-02.webp`, dan `assets/moment-03.webp`: tiga foto pada galeri. Tekan foto untuk melihat ukuran penuh; gunakan tombol sebelumnya/berikutnya atau tombol panah keyboard, lalu Escape untuk menutup.

Jika tanggal acara diganti, sesuaikan teks dalam HTML, `weddingDate` pada JavaScript, dan nilai `DTSTART` kalender. Waktu sekarang menggunakan WITA (`+08:00`); tanggal akad dalam kalender adalah `20261025T030000Z` (25 Oktober 2026, pukul 11.00 WITA).

## Tanda kasih

Bagian tanda kasih memuat rekening **SeaBank 901891764225**, atas nama **M. Parhan Pawis**. Tombol salin menyalin nomor rekening tanpa spasi. Jika rekening diubah, perbarui teks dalam HTML dan nomor pada penanganan tombol `#copy-account` di `script.js`.

Musik adalah komposisi instrumental orisinal yang dibangkitkan oleh browser, tanpa berkas musik pihak ketiga. Musik hanya diputar setelah tamu menekan tombol musik. Animasi menghormati pengaturan pengurangan gerakan perangkat.

Tombol berbagi dapat digunakan setelah situs diunggah ke hosting. Tautan yang dibagikan mempertahankan nama tamu pada URL. Undangan tidak memiliki layanan RSVP atau penyimpanan data tamu.

## Versi satu file

`Undangan-Lili-Parhan.html` berisi seluruh CSS, JavaScript, font, dan ilustrasi di dalam satu file. Klik dua kali untuk membukanya. File ini dapat dipindahkan tanpa folder aset. Tombol peta tetap membutuhkan internet.

Contoh nama tamu lokal: tambahkan `?to=Bpk.%20Bagus%20Wirayuda` setelah `.html` pada bilah alamat browser. Saat diunggah, gunakan `https://alamat-anda.com/?to=Bpk.%20Bagus%20Wirayuda` untuk versi index, atau `https://alamat-anda.com/Undangan-Lili-Parhan.html?to=Bpk.%20Bagus%20Wirayuda` untuk versi satu file.

`Undangan-Lili-Parhan.zip` berisi file statis siap unggah (`index.html`, `style.css`, `script.js`, folder `assets`, dan panduan). Ekstrak terlebih dahulu jika ingin membuka versi folder. Tidak ada proses build atau instalasi.

Ilustrasi asli dan rincian pembuatannya tersimpan di folder aset pada proyek. Paket ZIP memakai gambar WebP yang lebih ringan. Background merupakan render bergaya 3D dengan gerakan lapisan dan transisi CSS 3D; karakter tetap ilustrasi 2D tanpa wajah.

