# Penerapan referensi UI — 9 Oktober 2026

Implementasi ini melanjutkan `atelier-ui-implementation-2026-10-09.md`. Semua 17 gambar referensi telah dibuka dari lokasi Windows yang benar. Gambar digunakan sebagai acuan komposisi dan interaksi; foto, katalog, harga, dan data aplikasi tetap berasal dari sistem hotel.

## Pemetaan desain ke sistem

| Kelompok referensi | Halaman dan fungsi yang diterapkan |
| --- | --- |
| Menu, Rooms, Gallery, Facilities | Menu dengan foto dan navigasi; kartu kamar dua kolom, filter dan pilihan sarapan yang diteruskan ke booking; galeri kategori/grid/list/lightbox; tab foto fasilitas dan panel detail. |
| Dining, Hotel Info, Explore, Contact | Hero restoran dan kategori layanan; informasi/policy accordion; filter tempat sekitar dan peta setelah persetujuan; formulir inquiry dan metode kontak hotel. |
| Events, venues, packages, planner | Hero acara dengan pilihan kategori; filter peserta/layout, perbandingan dua venue; kartu paket dengan foto, detail dan perbandingan; planner menggunakan kapasitas data hotel. |
| Corporate, Government, Wedding, Gathering, Birthday, Manasik, Romantic, Ramadan, New Year | Halaman foto/form, pilihan konsep, tanggal, peserta, durasi atau waktu, kebutuhan kamar; data diteruskan ke formulir proposal yang terhubung ke API inquiry. |
| Event gallery, seasonal, site inspection, group stay, proposal | Alur yang sudah tersedia dipertahankan dan memakai tema bersama; formulir tetap memakai validasi serta penyimpanan backend. |
| Booking mobile: search, rooms, compare, extras | Form tanggal terlihat langsung di booking engine; penyesuaian check-out, jumlah tamu dan usia anak; harga paket dan pilihan kamar; kartu tambahan ringkas serta tombol lanjut/total pada mobile. |
| Guest data, payment, confirmation, booking access | Form dan validasi data tamu, pilihan metode sandbox, konfirmasi setelah status pembayaran simulasi terverifikasi, akses reservasi dan unduh PDF. |
| Portal summary, payments, extras, changes, documents | Lima tab; riwayat pembayaran; permintaan layanan termasuk nomor penerbangan/tanggal/waktu antar-jemput; permintaan perubahan; voucher, bukti pembayaran, dan ringkasan reservasi. |
| Admin overview, reservations, inventory, payments | Sidebar charcoal, pencarian reservasi, panel detail dari kanan; alokasi nomor kamar/catatan operasional tersimpan; kalender stok/harga yang mengisi form edit; detail pembayaran dari data aplikasi. |
| Guests, companies, promotions, tasks, groups | Direktori/profil dan riwayat reservasi; kartu promo membuka editor; papan tugas dengan filter departemen dan status tersimpan; akses ke workspace Events yang sudah tersedia. |
| Reports, integrations, settings, login | Filter laporan tanggal WITA, pembayaran/refund/neto dan ekspor CSV; status integrasi yang jujur; detail kontak hotel di pengaturan; login dengan foto dan kontrol tampilkan password. |
| Guest/internal documents | Header putih ringkas dengan logo hotel; format voucher/receipt/reservation; dokumen internal dan kontrol operasional, dengan autentikasi staf untuk data internal. |

## Batas yang dipertahankan

- Hero video homepage tidak diedit pada penerapan referensi ini; kedua file hero dibandingkan dengan hash awal pekerjaan.
- Pencarian tanggal menginap berada di booking engine. Homepage dan katalog kamar website tidak ditambahi date picker.
- Palet ivory, champagne, charcoal; komponen responsif, fokus keyboard, dan dukungan reduced motion tetap digunakan.
- Data pengujian berada di database lokal terpisah. Pengujian tidak melakukan pembayaran atau pengiriman email nyata.

## Validasi

- 50 pengujian website/backend/Events dan 46 pengujian booking engine lulus.
- Lint, build produksi Next.js, dan pemeriksaan modul/aset booking engine dijalankan setelah perubahan.
- Alur browser mencakup pemilihan kamar/paket dari website, tambahan, validasi data tamu, pembayaran sandbox, konfirmasi, PDF, lima tab portal, permintaan transfer dengan rincian penerbangan, tiga format dokumen tamu, dan 13 menu staf.
- Interaksi tambahan diperiksa: pencarian tanggal dengan anak, pencarian bantuan, handoff kebutuhan acara, dan penyimpanan nomor kamar/catatan dari panel reservasi.
- Bukti pemeriksaan browser dan screenshot lokal berada di `.local/reference-review/` dan `.local/atelier/`. Laporan JSON mencatat hasil dan ukuran layar yang diperiksa.
- Pemeriksaan akhir: 51 kombinasi halaman/viewport pada lebar 320, 390, 768, 1024, dan 1440 piksel, semuanya HTTP 200 tanpa page error atau overflow horizontal pada cakupan tersebut. Form booking pada 320 piksel diperbaiki dengan kolom yang dapat menyusut dan penghitung tamu bertumpuk. Hash hero tetap sama.
- 16 pemeriksaan tambahan mobile/tablet dan interaksi publik lulus; 24 langkah alur booking/portal/admin lulus. Build produksi, lint, serta pemeriksaan 45 modul JavaScript, delapan kategori kamar dan aset katalog berhasil. Laporan gabungan terakhir: `.local/atelier/production-final.json`.

## Batas operasional

Ini belum merupakan deployment produksi. Pembayaran masih sandbox, dan koneksi PMS/OTA/payment provider belum aktif. Workspace Events website dan reservasi booking engine tetap memiliki model data masing-masing; tautan antar-workspace bukan klaim sinkronisasi CRM lintas sistem. SSO maupun tautan login email baru tidak ditambahkan. Grafik laporan memakai transaksi yang tersedia, bukan angka okupansi atau channel buatan dari mockup.

Pratinjau build lokal untuk pemeriksaan ini: `http://localhost:4501`. URL localhost hanya dapat dibuka pada komputer yang menjalankan server, bukan sebagai link online untuk ponsel lain.
