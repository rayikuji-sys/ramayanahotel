# Audit awal — 1 Oktober 2026

Website: Next.js 16.3.5, React 19.2.6, TypeScript, npm, Node 22; repository Git tidak tersedia. Baseline SHA-256 446 file dicatat sebelum implementasi. Runtime/cache, secrets, dan database aktif dikecualikan dari hashing; booking tidak membuka database website.

Berkas yang dibaca: AGENTS.md, package.json, tsconfig.json, app/layout.tsx, globals.css, hotel.css, refinement.css, luxury.css, components/hotel/room-collection.tsx, inquiry-form.tsx, lib/booking.ts, hotel-profile.ts, room-gallery.ts, photo-catalog.ts, curated-room-photos.ts. Import snapshot juga membaca katalog supplemental/meeting yang diimpor modul foto, tanpa menjalankan website.

Reservasi aktual menggunakan ContactReservationProvider dan POST /api/inquiries, berupa inquiry, bukan reservasi terkonfirmasi. Tidak ditemukan adapter PMS pada jalur reservasi tersebut. Katalog profil mencatat 8 kategori, total 77 kamar. Tarif profil bersifat promosi dan subject to confirmation. Kapasitas penghuni dan kebijakan komersial lengkap belum disetujui.

Keputusan: aplikasi JavaScript ESM mandiri, Node built-in HTTP/SQLite dan browser ES modules, tanpa dependency runtime baru. Bahasa sama dengan website, tanpa menambah Next instance/build/dependency pada website. SQLite WAL + BEGIN IMMEDIATE + conditional updates + constraints untuk sandbox satu host; PostgreSQL tetap kandidat deployment multi-instance. Bukan keputusan bahwa SQLite sinkron dengan PMS/OTA.

Otoritas sandbox: 2 kamar/tipe/tanggal, 180 hari; tidak berasal dari stok live. Harga dasar snapshot profil; breakfast Rp55.000 sebagai contoh konfigurasi; usia anak, promo SANDBOX10, kapasitas, serta pembatalan adalah aturan uji yang jelas dilabeli sandbox. Semua live mode ditolak server.

Integrasi website hanya usulan URL mandiri; source, konfigurasi, lockfile, dependency, dan DB website tidak diubah. Snapshot aset bukan sinkronisasi otomatis.

Dokumentasi API yang diperiksa: https://nodejs.org/api/sqlite.html (hanya API yang tersedia Node22: DatabaseSync, prepare, exec; tidak memakai API khusus Node26); https://docs.midtrans.com/docs/https-notification-webhooks. Midtrans belum diaktifkan dan simulator lokal tidak diklaim sebagai sandbox merchant Midtrans.
