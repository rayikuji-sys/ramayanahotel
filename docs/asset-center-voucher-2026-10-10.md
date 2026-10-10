# Pusat Aset dan voucher Ramayana

## Penggunaan

Masuk ke `/admin`, pilih **Pusat Aset**, atau buka `/admin?section=assets`.
Cari aset atau filter Logo, Foto & gambar, Video, dan Dokumen. Pilih **Ganti aset**, unggah berkas, periksa pratinjau dan daftar lokasi, lalu **Simpan pengganti**. Unggahan belum dipublikasikan saat masih dalam pratinjau. Halaman yang dibuka atau dimuat ulang akan memakai versi terbaru. Tab yang sudah terbuka tidak dipaksa memuat ulang.

**Pulihkan versi** dapat mengembalikan berkas asli atau versi unggahan sebelumnya. Penggantian hanya berlaku pada lokasi yang ditampilkan; logo Ramayana menghubungkan website, booking engine, voucher PDF dan voucher notifikasi baru. Dokumen notifikasi lama tetap mempertahankan snapshot historisnya.

Saat ini katalog menemukan 205 kelompok media lokal dari `public/media` dan `booking-engine/public/assets`. File dengan basename sama di kedua sistem dikelompokkan, dan tiga nama logo dihubungkan secara eksplisit. Ikon komponen, font kode, serta URL eksternal bukan unggahan media di katalog ini.

## Penyimpanan dan integrasi

- `lib/asset-store.mjs` menyimpan berkas immutable, binding dan riwayat di SQLite. Direktori bawaan adalah `assets` di sebelah `HOTEL_DB_PATH`, atau `data/assets`. Override dengan `HOTEL_ASSET_DIR` absolut yang sama untuk website, booking server dan worker email.
- Simpan dan backup **seluruh direktori aset**, termasuk SQLite/WAL dan berkas unggahannya. Berkas sumber proyek tidak ditimpa. Riwayat tidak dipangkas otomatis.
- Endpoint admin memerlukan sesi website dan pemeriksaan Origin. `If-Match` menolak editor yang menggunakan versi kedaluwarsa. Gambar didekode dan dinormalisasi ke PNG; SVG unggahan ditolak. Batas gambar/PDF 12 MB, video 60 MB. Validasi video memeriksa container; staf tetap perlu memeriksa pemutaran pratinjau.
- `/media/*` diarahkan sebelum public files ke registry. Next Image memakai derivative WebP berdasarkan versi melalui custom loader. Aset booking memakai registry yang sama; byte ranges mendukung video. Cache harus melakukan revalidasi.
- Tata letak homepage dan perilaku video hero tidak diubah.

**Batas deployment:** fitur ini memerlukan proses Node dengan filesystem persisten bersama. Deployment Vercel serverless yang memakai disk sementara belum dapat menjamin persistensi unggahan maupun SQLite; perlu object storage dan database persisten sebelum dipakai sebagai layanan online produksi. Implementasi saat ini diverifikasi pada server lokal terpadu.

## Voucher

Voucher baru memakai logo Ramayana, tipografi hotel, kartu referensi charcoal dan aksen champagne. Referensi OTA dipakai untuk kelengkapan informasi, bukan identitas visual atau data tamunya. Informasi meliputi tamu/pemesan, waktu pemesanan WITA, tanggal dan jam menginap, penghuni, kamar/paket, tambahan, metode pembayaran, total, pembayaran bersih, sisa tagihan, permintaan, dan kebijakan snapshot reservasi.

PDF standar satu halaman; pemesanan panjang berlanjut ke halaman berikutnya. Kontak pribadi hanya ditambahkan pada salinan internal. Sistem tetap sandbox, sehingga voucher menampilkan status simulasi dengan jelas. PDF diterbitkan melalui endpoint reservasi yang dilindungi sesi; contoh desain memakai data sintetis.

## Verifikasi

- Build Next dan pemeriksaan lint berhasil; pemeriksaan modul booking berhasil.
- Uji registry memeriksa penggantian lintas sistem, cache gambar, konflik versi, pemulihan, path tidak valid, berkas invalid, HEAD, ETag dan byte range.
- Browser memeriksa unggah/pratinjau/pemulihan melalui UI, akses tanpa login, Origin asing, konflik versi, unduhan PDF reservasi, serta overflow pada desktop, 320, 390 dan 768 px.
- Contoh PDF standar dan fixture 10 kamar dirender dan diperiksa; teks berada di dalam halaman.
