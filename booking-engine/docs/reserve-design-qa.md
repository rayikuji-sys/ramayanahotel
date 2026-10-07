# Ramayana Reserve — pembaruan 5 Oktober 2026

## Tampilan dan interaksi

- Logo resmi lampiran disalin utuh ke `public/assets/ramayana-official.png`, tanpa mengubah gambar. Latar ivory menjaga keterbacaannya.
- Playfair Display dan Montserrat mengikuti website hotel. Ivory, gold, charcoal, dan hijau gelap digunakan untuk hierarki, CTA, dan status.
- Halaman pembuka memakai foto hotel yang tersedia; panel pencarian kaca, kartu kamar, ringkasan, dialog, dan workspace staf mendapat gaya konsisten.
- Animasi masuk ringan memakai IntersectionObserver. Preferensi reduced-motion dan tombol pengurangan animasi tetap dihormati.
- Navigasi ponsel memiliki kontrol buka/tutup, Escape, dan aria-expanded.

## Fungsi tambahan

- Favorit kamar tersimpan pada perangkat, divalidasi terhadap katalog.
- Filter tipe, favorit, ketersediaan, anggaran rata-rata tarif kamar saja per malam, dan pengurutan harga/luas. Reset menangani hasil kosong.
- Pilihan, harga dan paket tetap dihitung ulang oleh layanan booking.
- Dashboard staf: tanggal WITA, booking baru, pembayaran bersih per tanggal, kedatangan terkonfirmasi, antrean pembayaran, alokasi tujuh hari, tugas dan permintaan tindak lanjut.
- Dashboard menyebut batas data: maksimal 200 reservasi direct terbaru; grafik bukan okupansi hotel/OTA.
- Pencarian reservasi berdasarkan kode, tamu, email, perusahaan; filter status dan check-in; ekspor hasil CSV dengan escaping formula; detail kamar/tambahan/diskon dan tautan voucher.

## Verifikasi

- `npm test --prefix booking-engine`: 39/39 lulus, termasuk perhitungan budget, kapasitas, favorit, tanggal WITA, checkout eksklusif, filter reservasi dan CSV.
- `npm run build --prefix booking-engine`: validasi sintaks seluruh modul dan foto katalog.
- `npm run test:booking-integration`: lulus pada database terisolasi. Mencakup handoff website, proxy/aset/cookie, SSO staf, penolakan spoofing, sinkronisasi pengaturan/promo, idempotensi pemesanan, simulasi pembayaran, total admin, PDF internal/tamu.
- Browser desktop: favorit, gabungan filter yang menghasilkan keadaan kosong, reset, anggaran, akses staf melalui website, tanggal dashboard, pencarian/status, detail reservasi, dan CSV berisi dua hasil terkonfirmasi berhasil diperiksa. File CSV benar-benar terunduh (event pengunduhan alat otomatis mengalami timeout; verifikasi dilakukan pada file hasil).
- Browser lebar 390 px: menu, dashboard, kartu kamar, CTA lanjut, layanan tambahan, formulir tamu. Tidak ada overflow halaman horizontal pada tampilan yang diperiksa.
- Dekorasi Rp250.000 menambah total kamar Rp918.000 menjadi Rp1.168.000, konsisten pada langkah data tamu.

## Batas operasional

Ini aplikasi lokal satu hotel. Pembayaran masih simulator; PMS/OTA dan WhatsApp belum terhubung. Pembaruan tampilan ini tidak menjadikannya SaaS multi-tenant atau mengaktifkan transaksi nyata. Tidak ada data produksi, kontrak, atau kredensial provider baru yang dibuat.

Jalankan website dan engine bersama dari akar proyek dengan `npm run start` (build website harus tersedia), atau `npm run dev` untuk pengembangan. Halaman tamu: `/booking/#welcome`. Workspace staf: `/booking/admin`, menggunakan sesi `/admin` website.
