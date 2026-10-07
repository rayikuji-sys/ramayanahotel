# Events: tujuan proposal dan bukti pengisian

Setiap permintaan disimpan ke database dan dapat dibuka melalui Admin → Guest requests → event. Notifikasi ditujukan ke **ramayanahotelmksr@gmail.com**; salinan bukti dikirim ke alamat email tamu. Permintaan lama tetap tersedia, tetapi tidak mempunyai bukti digital yang dibuat oleh fitur baru ini.

## Mengaktifkan email

Salin pengaturan SMTP dari `.env.example` ke `.env.local`, lalu isi akun pengirim, sandi aplikasi SMTP, dan alamat pengirim yang diizinkan penyedia email. Jangan mengirim sandi lewat chat atau memasukkannya ke Git. Akun pengirim boleh berbeda dengan alamat penerima hotel.

Untuk Gmail, akun pengirim perlu mengizinkan autentikasi SMTP dengan sandi aplikasi sesuai kebijakan akun Google. Jika tidak tersedia, gunakan penyedia SMTP hotel. Port 465 memakai `SMTP_SECURE=true`; port 587 memakai `SMTP_SECURE=false` untuk STARTTLS. TLS tetap diverifikasi.

Isi `APP_URL` dengan domain HTTPS website yang dapat diakses tamu saat situs dipublikasikan. `http://localhost:3001` hanya cocok untuk uji lokal pada komputer yang menjalankan server.

Restart server setelah mengubah konfigurasi. Buka permintaan pada admin: bagian **Bukti & notifikasi** menampilkan penerima, status, dan jumlah percobaan. Setelah konfigurasi aktif, tekan **Kirim ulang email yang belum terkirim** untuk permintaan yang masih menunggu. Email yang sudah berstatus terkirim tidak dikirim ulang oleh tombol ini.

## Arti status

- Menunggu: data tersimpan, pengiriman belum dimulai (termasuk ketika SMTP belum diisi).
- Sedang dikirim: percobaan SMTP berlangsung.
- Diterima server email: penyedia SMTP menerima pesan; pengiriman ke inbox/spam tetap ditentukan penyedia penerima.
- Gagal: data tetap tersimpan; periksa konfigurasi dan coba kembali melalui admin.

Tidak ada scheduler otomatis untuk mengulang pesan gagal. Staf melakukan pengiriman ulang melalui dashboard. Koneksi terputus tepat setelah SMTP menerima pesan dapat menyebabkan pengiriman ganda saat dicoba kembali; Message-ID stabil membantu pelacakan, bukan jaminan deduplikasi penyedia email.

## Bukti tamu

Halaman sukses menyediakan nomor referensi, tautan bukti lengkap, unduhan HTML, dan cetak/simpan PDF melalui dialog browser. Bukti berisi detail acara, kontak, kebutuhan, budget, kamar/kunjungan, nama TOR, serta gambar layout. TOR tetap hanya dapat diunduh staf yang login.

Tautan bukti menggunakan token acak, tidak diindeks, tidak dicache, dan berlaku 90 hari. Siapa pun yang memiliki tautan dapat membacanya; perlakukan sebagai tautan pribadi. Penghapusan permintaan di admin juga menghapus bukti dan status pengirimannya. Bukti bukan konfirmasi booking atau harga.
