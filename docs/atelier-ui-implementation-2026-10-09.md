# Penerapan UI Ramayana — 9 Oktober 2026

Tampilan website, booking engine, area staf, dan dokumen reservasi menggunakan palet ivory, champagne, dan charcoal, dengan permukaan kaca, tipografi Montserrat/Playfair, serta logo resmi hotel. Perubahan diterapkan pada alur dan data aplikasi yang sudah tersedia.

## Batasan desain yang dipertahankan

- Hero video homepage tetap sesuai kondisi sebelum pekerjaan ini. SHA-256 kedua file `scroll-hero` cocok dengan snapshot awal pekerjaan.
- Header awal homepage tetap transparan dengan logo, Menu, dan Reserve.
- Form pencarian check-in/check-out tetap di booking engine. Tidak ada input tanggal pada homepage.
- Aset foto/video hotel tetap digunakan; mockup tidak dijadikan gambar halaman yang tidak interaktif.

## Perubahan utama

- Token warna bersama untuk website dan booking engine; tema lama bernuansa hijau diganti warna batu/champagne.
- Halaman publik dan Events, navigasi, kartu, formulir, area admin, serta login diselaraskan.
- Kamar/paket, perbandingan, tambahan, data tamu, pembayaran, konfirmasi, dan portal reservasi mengikuti tema yang sama.
- Tombol lanjut dan total pada mobile tetap terlihat di tahap tambahan, data tamu, dan pembayaran. Tombol ini meneruskan tindakan formulir asli, termasuk validasi, status sibuk, dan status nonaktif.
- Kalender stok/harga dapat dipilih untuk mengisi formulir edit. Masalah kolom tabel menutupi sel pada mobile diperbaiki.
- Papan tugas berdasarkan status, pencarian tugas/tamu, dan ringkasan pembayaran menggunakan data aktual aplikasi.
- Form Corporate & Events mengumpulkan rincian kebutuhan dan menyimpannya melalui API inquiry yang tersedia.
- Voucher tamu, Booking Order, dan Kontrol Reservasi menggunakan tema serta logo hotel. Dokumen kontrol menampilkan penugasan kamar, catatan operasional, tugas departemen, dan settlement manual yang tersimpan.
- Aset voucher kini berfungsi melalui `/booking` maupun server engine langsung. Lampiran email tetap mandiri dengan CSS/logo tertanam. Akses dokumen internal tetap memerlukan autentikasi staf.

## Validasi

Berhasil dijalankan selama pekerjaan ini:

- `npm run lint`
- `npm test` — 50 pengujian website/backend/Events/planner.
- `npm run test:booking` — 39 pengujian sebelum penambahan empat pengujian dokumen.
- `node --test booking-engine/tests/documents.test.mjs booking-engine/tests/notifications.test.mjs` — 10 pengujian lulus setelah perubahan dokumen terakhir.
- `npm run build` — build produksi Next.js berhasil.
- `npm --prefix booking-engine run build` — validasi modul, katalog, dan aset berhasil setelah perubahan terakhir.
- `git diff --check`.

Pemeriksaan browser menggunakan Microsoft Edge headless pada server produksi lokal:

- 51 kombinasi halaman/viewport pada lebar 320, 390, 768, 1024, dan 1440 piksel. Mencakup 35 rute berbeda; seluruh respons 200, tanpa page error JavaScript atau overflow horizontal pada pemeriksaan tersebut.
- Tinggi hero homepage sesuai viewport 900 piksel, header awal transparan, dan tidak ada input tanggal.
- Alur website → kamar/paket terpilih → tambahan → validasi data tamu → pembayaran simulasi → konfirmasi → PDF. Pilihan dari website tetap diteruskan.
- Lima panel kelola reservasi dan 13 menu staf diperiksa; pembaruan status tugas tersimpan dan pilihan kalender mengisi formulir.
- Enam pemeriksaan visual voucher/dokumen pada mobile dan desktop setelah perbaikan jalur aset: logo, font, CSS, dan tombol cetak berfungsi; dokumen kontrol tanpa sesi staf ditolak dengan 401.

Hasil lokal dan screenshot tersimpan di `.local/atelier/`. Data pengujian memakai database terpisah dari data operasional.

## Batas penggunaan

Ini adalah penerapan desain dan perbaikan alur pada lingkungan sandbox yang ada. Pembayaran masih simulasi; PMS/OTA dan provider settlement belum terhubung. Perubahan ini tidak mengaktifkan transaksi hotel nyata atau melakukan deployment online. Kelulusan pemeriksaan di atas tidak berarti seluruh kemungkinan kesalahan produksi sudah tereliminasi.

Untuk menjalankan aplikasi dengan konfigurasi proyek: `npm run dev`, atau `npm run build` lalu `npm start`. Runner proyek menyalakan website dan booking engine bersama.
