# Menjalankan website dan booking Ramayana

## Akses

- Website: http://localhost:3001
- Booking: http://localhost:3001/booking
- Login staf: http://localhost:3001/admin
- Workspace booking: http://localhost:3001/booking/admin

Login melalui admin website menggunakan akun yang sudah dibuat. Setelah login, menu reservasi, stok, pembayaran, tambahan, dan laporan membuka workspace booking tanpa login kedua. Akun staf booking mandiri tetap tersedia untuk peran FO/Finance.

Kredensial awal tersimpan secara lokal di `.local/admin-access.txt`. Jangan mempublikasikan file ini. `npm.cmd run admin:create` hanya membuat akun jika belum ada; perintah ini tidak mengganti sandi akun yang sudah ada.

## Satu perintah untuk dua layanan

Dari `C:\projects\ramayana-web`:

```powershell
npm.cmd run dev
```

Perintah tersebut menyalakan booking internal pada port 3003, memeriksa kesehatannya, lalu menjalankan website pada port 3001. Layanan booking sehat yang sudah berjalan akan digunakan kembali. Jangan membuka dua proses website pada port yang sama.

Untuk pemakaian lokal tanpa kompilasi saat membuka halaman:

```powershell
# Hentikan proses dev dengan Ctrl+C dahulu.
npm.cmd run build
npm.cmd run start
```

Biarkan terminal proses server berjalan. Menutup semua proses server membuat localhost tidak dapat diakses. Port khusus tersedia lewat `HOTEL_PORT` dan `BOOKING_PORT`; keduanya harus berbeda.

Instalasi baru membutuhkan `npm.cmd install` dan `npm.cmd --prefix booking-engine install`. Gunakan Node.js 22.13 atau lebih baru.

## Sinkronisasi

- Tombol `/book` meneruskan kamar, paket, tanggal, jumlah dewasa, dan bahasa ke `/booking` pada origin yang sama.
- Aset, API, cookie tamu, voucher, dan workspace staf menggunakan awalan `/booking`.
- Stok dan harga akhir dihitung backend. Pilihan tidak tersedia tidak diganti diam-diam.
- Paket sarapan Junior Suite dan Ramayana Suite menggunakan tambahan Rp100.000 untuk dua tamu, sesuai paket website. Kamar lain memakai tambahan Rp55.000 per tamu yang dikenai biaya. Tarif malam dapat diubah melalui stok dan harga; reservasi lama menyimpan harga saat dipesan.
- Tarif sementara berlaku 10 menit. Checkout memperbarui tarif yang kedaluwarsa dan meminta pemeriksaan ulang bila total berubah. Data form tetap ada selama proses ini.
- Dashboard website mengambil reservasi dan pembayaran dari booking engine, bukan angka demo tetap. Hitungan daftar reservasi mencakup maksimal 200 reservasi terbaru; buku transaksi mencakup seluruh transaksi.
- Permintaan website/Events tetap tersedia di workspace website. Inquiry grup booking tersimpan di menu Groups booking.

Biarkan `BOOKING_ENGINE_URL` tidak diatur untuk integrasi lokal. Variabel itu hanya untuk tujuan booking terpisah yang sengaja dikonfigurasi. Kunci penghubung staf di `.local/booking-bridge.key` bersifat server-only; header dari browser tidak dipercaya.

## Pengujian

```powershell
npm.cmd run lint
npm.cmd run typecheck
npm.cmd test
npm.cmd run test:booking
npm.cmd --prefix booking-engine run build
npm.cmd run build
npm.cmd run test:booking-integration
```

Tes integrasi memulai launcher pada port kosong dan database terpisah, memeriksa pengalihan website, sesi staf, penolakan header palsu, harga/promo, reservasi, pembayaran simulasi, dashboard, dan PDF. Tes membersihkan proses/database buatannya sendiri dan tidak menghentikan layanan pengguna.

Uji browser lokal juga mencakup pemilihan paket, tambahan, data tamu, pembayaran gagal lalu berhasil, konfirmasi, kelola booking, dan tampilan lebar 390 piksel. Bukti tampilan tersimpan di `outputs/booking-mobile.png`.

## Batas penggunaan saat ini

Ini **sandbox lokal**, belum sistem penjualan hotel live. QRIS/VA/kartu/dompet digital memakai simulator; tidak menagih uang. Allotment belum terhubung PMS/channel manager/OTA. Email berstatus preview sampai SMTP dikonfigurasi. Operasi produksi memerlukan koneksi provider pembayaran dan webhook terverifikasi, stok hotel yang disahkan, HTTPS/hosting, serta konfigurasi pengiriman yang sesuai. Jangan menampilkan konfirmasi simulasi sebagai reservasi hotel nyata.
