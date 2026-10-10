# Bright Glass — 10 Oktober 2026

Revisi ini merespons umpan balik bahwa tampilan sebelumnya terlalu rata, redup, dan krem. Perubahan bukan hanya warna: halaman kamar memiliki komposisi baru dengan banner foto, panel reservasi kaca, strip layanan, kontrol koleksi, serta kartu kamar yang disusun ulang.

## Perubahan

- Latar putih dengan cahaya champagne dan biru abu-abu tipis, teks charcoal, garis putih, blur latar, dan bayangan berlapis. Foto tetap menggunakan aset hotel.
- Katalog kamar menampilkan Deluxe lebih dahulu; filter kategori, pengurutan harga terendah/kamar terluas, switch sarapan, harga dinamis, tautan detail, dan reservasi tetap interaktif.
- Galeri kamar tetap mendukung navigasi foto dan lightbox. Dua kartu pertama memuat foto sampul secara eager.
- Banner mobile dipadatkan agar daftar kamar lebih cepat terlihat. Elemen dekoratif dan copy berulang dikurangi pada layar kecil.
- Booking, portal tamu, Events, dan area staf menggunakan permukaan kaca yang lebih terang. Logo booking ditampilkan tanpa kotak gelap.
- Kamar/paket dari website ditampilkan sebagai “Pilihan Anda” sebelum pencarian tanggal. Ketersediaan tetap diperiksa ketika tanggal dipilih.
- Animasi masuk/hover dan switch tetap menghormati preferensi reduced motion.

## Batas lingkup

Hero video homepage dan mekanisme header awalnya tetap dipertahankan. Date picker hanya tersedia di booking engine. Perubahan ini tidak mengaktifkan payment provider, PMS, OTA, maupun deployment online.

## Pemeriksaan

Build produksi, TypeScript, lint, validasi aset/modul booking, dan tiga pengujian handoff website dijalankan. Screenshot dan pemeriksaan interaksi pada 320, 390, 768, dan 1440 piksel disimpan di `.local/glass-review/`. Laporan akhir browser berada di `report.json` pada folder tersebut.

Hasil akhir: 21 pemeriksaan browser lulus tanpa page error atau overflow horizontal dalam cakupan pengujian. Termasuk filter kategori, urutan harga/luas, handoff paket sarapan pada tanggal yang tersedia, pencarian tanggal, tampilan admin, dan verifikasi hero homepage. Ketika tanggal di luar stok sandbox dipilih, pesan tidak tersedia ditampilkan dan pilihan kamar tetap dipertahankan untuk pencarian ulang.

Preview: `http://localhost:4501/rooms` dan `http://localhost:4501/booking/`.
