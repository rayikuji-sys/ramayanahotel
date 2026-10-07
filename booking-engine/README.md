# Ramayana Booking Engine — local sandbox

Aplikasi mandiri di folder booking-engine, terhubung dengan tombol reservasi website melalui `/book`. Database booking tetap terpisah dari database website. **Belum untuk reservasi tamu nyata.** Status implementasi dan backlog ada di [checkpoint](docs/checkpoint.md).

## Menjalankan di Windows

Node.js 22.13+ diperlukan (diverifikasi memakai Node 22). Tidak perlu npm install: semua dependency server adalah modul bawaan Node. Peringatan experimental SQLite pada Node 22 bukan kegagalan startup.

```powershell
cd C:\projects\ramayana-web\booking-engine
npm.cmd run seed
npm.cmd start
```

Buka http://127.0.0.1:3003/. Website utama tetap di port 3001. Biarkan terminal server terbuka; Ctrl+C menghentikan server pada terminal itu. Untuk pengembangan gunakan npm.cmd run dev.

Seed mengisi katalog 8 kategori dan allotment contoh 180 hari. INSERT OR IGNORE mempertahankan tarif, stok terpakai, serta transaksi yang sudah ada. Jalankan lagi untuk menambah tanggal mendatang. Sumber katalog dan tarif adalah snapshot, bukan ketersediaan hotel langsung.

## Uji alur tamu

1. Cari tanggal besok atau sesudahnya, pilih 1–5 kamar. Paket harga berbeda memakai stok yang sama.
2. Coba perbandingan 2 kamar dan galeri foto. Pilih kamar saja atau sarapan.
3. Opsional: kode SANDBOX10 (contoh diskon 10%); layanan tambahan hanya permintaan, belum ditagih.
4. Isi nama/email/telepon **data uji**, lalu setujui kebijakan simulasi. Stok ditahan 15 menit saat checkout.
5. Pilih simulasi pembayaran gagal atau berhasil. Tidak memakai uang, kartu, rekening, Midtrans, atau layanan luar.
6. Setelah berhasil, lihat voucher; halaman voucher menyediakan cetak / Save as PDF browser. Belum ada unduhan PDF server.
7. Kelola reservasi melalui cookie pribadi. Simpan referensi dan kunci akses dari portal untuk membuka di browser lain. Jangan bagikan kunci atau letakkan dalam URL.
8. Pembatalan sebelum tanggal check-in mengembalikan stok; pembayaran menjadi permintaan refund menunggu Finance. Perubahan tanggal saat ini hanya menghasilkan estimasi dan permintaan, belum memindahkan booking.

Data tersimpan dalam data/booking-sandbox.sqlite, termasuk setelah restart. Pilihan pencarian non-PII disimpan di browser; data tamu tidak disimpan di localStorage. Draft tamu bertahan di memori ketika tombol Back digunakan, tetapi hilang jika halaman direfresh sebelum reservasi tersimpan.

## Membuat akun staf

Tidak ada akun/password admin bawaan. Dari PowerShell terpisah:

```powershell
cd C:\projects\ramayana-web\booking-engine
$env:BOOKING_ADMIN_EMAIL = Read-Host 'Email staf'
$bookingPassword = Read-Host 'Password baru, minimal 14 karakter' -AsSecureString
$env:BOOKING_ADMIN_PASSWORD = [System.Net.NetworkCredential]::new('', $bookingPassword).Password
$env:BOOKING_ADMIN_ROLE = 'Admin'
npm.cmd run admin:create
Remove-Item Env:BOOKING_ADMIN_PASSWORD
Remove-Variable bookingPassword
```

Login di http://127.0.0.1:3003/admin. Peran: Admin, Manager, FO, Sales, Finance. Jangan kirim password ke chat. Email harus unik; command tidak mengubah akun lama. MFA dan manajemen pengguna melalui UI masih tertunda.

## Konfigurasi

.env.example adalah contoh, **tidak dimuat otomatis** oleh npm start. Atur environment di terminal, atau salin ke .env milik booking lalu jalankan node --env-file=.env server.mjs. Jangan gunakan .env website utama.

| Variabel | Default / perilaku |
|---|---|
| BOOKING_PORT | 3003; binding hanya 127.0.0.1 |
| BOOKING_MODE | sandbox; nilai lain ditolak |
| BOOKING_DB | data/booking-sandbox.sqlite; path wajib di folder booking |
| BOOKING_ADMIN_EMAIL/PASSWORD/ROLE | hanya bootstrap akun melalui script admin |

Variabel Midtrans pada contoh belum dikonsumsi adapter. Mengisinya tidak mengaktifkan pembayaran provider.

## Pemeriksaan dan worker

```powershell
npm.cmd run build
npm.cmd test
npm.cmd run baseline:verify
```

Build memeriksa sintaks modul dan keberadaan aset katalog, bukan membangun website Next.js. Tes memakai database terpisah dan server HTTP lokal port 3034; jangan menjalankan dua suite bersamaan pada port yang sama.

Worker di server berjalan setiap 15 detik. npm.cmd run worker menjalankan worker mandiri bila diperlukan. Outbox dicatat menjadi **local capture**, bukan email/WhatsApp terkirim.

## Troubleshooting

- PowerShell menolak npm.ps1: gunakan npm.cmd, tidak perlu mengubah execution policy.
- EADDRINUSE: buka URL 3003 terlebih dahulu; server mungkin sudah berjalan. Periksa Get-NetTCPConnection -LocalPort 3003 -State Listen dan identitas proses. Jangan menghentikan semua proses Node; port 3001 milik website utama.
- QUOTE_EXPIRED / HOLD_EXPIRED: kembali ke pencarian dan perbarui pilihan/harga. Booking terkonfirmasi tetap dapat dibuka melalui Kelola reservasi.
- Kamar tidak tersedia pada tanggal jauh: seed 180 hari; periksa allotment, stop-sell, dan minimum stay.
- Email tidak diterima: belum dikirim; lihat Integrations → local capture. Alamat hotel dari proyek lama tidak otomatis dikonfigurasi pada aplikasi mandiri ini.

Lanjut: [arsitektur/API](docs/architecture.md), [operasi](docs/runbook.md), [visual](docs/visual-alignment.md), [motion](docs/motion-spec.md), [QA](docs/qa-report.md), [rencana sambungan website](docs/website-integration-plan.md).

