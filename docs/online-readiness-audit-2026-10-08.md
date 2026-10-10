# Audit kesiapan online — 8 Oktober 2026

## Keputusan

**Belum layak untuk operasional reservasi dan pembayaran nyata.** Alur inti dapat dipakai untuk uji coba terbatas dengan data fiktif setelah persoalan keamanan dan deployment ditangani. Lulus build dan tes bukan bukti bahwa aplikasi sudah siap dipublikasikan untuk tamu umum.

Audit dilakukan terhadap commit `ce1fbfbf8b7cb0058406772e33656efc81217207`. Source aplikasi tidak diubah dalam audit ini. Pengujian HTTP, browser, dan perubahan harga menggunakan database baru yang terisolasi dari database hotel. Tidak ada pembayaran atau email nyata dikirim.

## Hasil verifikasi

| Pemeriksaan | Hasil aktual |
| --- | --- |
| `npm run lint` | Lulus, exit 0 |
| `npm run typecheck` | Lulus, exit 0 |
| `npm test` | 50 lulus, 0 gagal |
| `npm run test:booking` | 39 lulus, 0 gagal |
| `npm run build` | Lulus, Next.js 16.3.5 |
| `npm --prefix booking-engine run build` | Lulus; 37 modul, 8 kategori kamar, aset katalog tersedia |
| `npm run test:booking-integration` | Lulus: pilihan website, proxy, cookie, SSO staf, penolakan pemalsuan akses, pengaturan/promo booking, idempotensi, pembayaran simulasi, total admin, PDF tamu/internal |
| `npm audit --omit=dev --json` | 4 paket terdampak: 1 critical, 2 high, 1 moderate |
| Audit dependency booking engine | 0 advisori dilaporkan; bukan jaminan bebas kerentanan |
| HTTP lokal | 11 halaman memberikan 200; API admin website dan booking menolak tanpa login dengan 401 |
| Browser Microsoft Edge headless | 9 halaman pada lebar 390 dan 1440 px; 18 kunjungan berhasil, tanpa exception JavaScript, overflow horizontal, atau gambar rusak yang terdeteksi |
| Secret/database dalam daftar file Git | Tidak ditemukan `.env`, `.env.local`, `.env.production`, `.db`, `.sqlite`, `.local`, atau lampiran chat pada daftar tracked yang diperiksa |
| Vercel | CLI dapat membaca daftar proyek; belum ada proyek Ramayana atau URL produksi Ramayana pada daftar akun yang diperiksa |
| Docker | Daemon tersedia; image dasar `node:22-bookworm-slim` belum tersedia lokal; build/run container belum diverifikasi dalam audit ini |

Halaman browser: `/`, `/rooms`, `/booking`, `/booking/packages`, `/booking/group`, `/booking/manage`, `/booking/help`, `/admin`, `/booking/admin`. Admin diperiksa menggunakan sesi staf pada database uji. Ini bukan pengujian setiap tombol, setiap keadaan checkout, setiap peran, atau setiap kombinasi perangkat.

Browser mencatat 401 yang memang diharapkan saat portal tamu mencari sesi reservasi yang belum ada. Satu resource 404 terlihat pada kunjungan awal booking mobile; URL resource belum diidentifikasi, sehingga tidak dinyatakan bebas error resource. Tidak ada klaim Core Web Vitals atau hasil uji beban internet. Waktu HTTP localhost bukan ukuran kecepatan situs dari HP melalui internet.

## Temuan yang menghalangi peluncuran

### 1. P1 — Pembayaran dan inventory masih simulasi

`booking-engine/server.mjs:10` menolak mode selain `sandbox`. Health endpoint mengembalikan:

```json
{"mode":"sandbox","inventory":"isolated-sandbox-allotment","payment":"local-simulator","pms":"unconfigured","notifications":"preview-only"}
```

Endpoint `sandbox/settle` menyelesaikan pembayaran simulasi atas permintaan pemegang sesi reservasi, bukan berdasarkan verifikasi payment gateway. Seed mengalokasikan 2 kamar per tipe per malam selama 180 hari; ini bukan stok nyata dari FO/OTA. Jangan menghapus label sandbox atau membuka mode live sebelum adapter pembayaran dan sumber inventory nyata tersedia serta diuji.

Sumber: `booking-engine/server.mjs:49`, `booking-engine/scripts/seed.mjs`, `booking-engine/public/app.js:149`.

### 2. P1 — Harga website dan booking belum memakai sumber yang sama

Reproduksi pada database uji: menyimpan harga Deluxe King melalui API admin website berhasil (HTTP 200), dari Rp349.000 menjadi Rp361.345. Pembacaan ulang admin website menunjukkan Rp361.345, tetapi katalog booking tetap Rp349.000.

Website menampilkan `room.details.rate` dari database CMS; booking memakai tabel `rooms` dan `inventory` sendiri. Handoff kamar/tanggal/paket berhasil, tetapi tidak berarti perubahan harga, stok, publikasi kamar, dan kebijakan sudah tersinkron otomatis.

Perbaikan: tentukan satu sumber harga dan ketersediaan. Website harus membaca harga yang berlaku dari layanan booking; perubahan tarif harus tercermin di website dan checkout, sambil mempertahankan snapshot harga reservasi lama.

Sumber: `components/hotel/room-collection.tsx:60`, `app/api/admin/route.ts`, `lib/db.ts`, `booking-engine/domain/store.mjs`, `booking-engine/scripts/seed.mjs`.

### 3. P1 — Rate limit booking memblokir tamu lain

`throttle()` menggunakan `req.socket.remoteAddress`. Semua permintaan yang diteruskan website datang dari loopback yang sama. Akibatnya, kuota 80 POST/menit dipakai bersama semua tamu; kuota login juga berbagi alamat tersebut.

Reproduksi pada proses uji: setelah satu permintaan awal, dari 82 POST berikutnya sebanyak 79 diterima dan 3 ditolak dengan 429 dalam kurang dari 2 detik. Klien baru tanpa cookie dan dengan identitas forwarded berbeda juga mendapat 429.

Perbaikan: gunakan identitas klien yang ditetapkan proxy tepercaya, batasi tamu/staf secara terpisah, dan tetap tolak header identitas yang dipalsukan pengguna. Uji dua klien independen dan batas per akun/IP. Jangan langsung mempercayai seluruh `X-Forwarded-For`.

Sumber: `booking-engine/server.mjs:19`, `app/booking/[[...path]]/route.ts:18`, `lib/security.ts`.

### 4. P1 — Paket dengan advisori keamanan belum diperbarui

Audit registry melaporkan:

| Paket | Tingkat tertinggi | Catatan |
| --- | --- | --- |
| `next` 16.3.5 | Critical | Tujuh advisori, termasuk `next/og`, cache poisoning, dan SSRF Image Optimization; rentang perbaikan terakhir yang dilaporkan audit adalah 16.3.8 |
| `sharp` | High | Versi terdampak di bawah 0.35.5 |
| `source-map-js` | High | Versi terdampak di bawah 1.2.2 |
| `baseline-browser-mapping` | Moderate | Versi terdampak di bawah 2.11.0 |

**Tidak ada eksploitasi yang dibuktikan dalam audit ini.** Advisori kritis Next.js mensyaratkan pemakaian Node `ImageResponse` dengan nilai SVG yang dikendalikan penyerang. Pencarian source aplikasi tidak menemukan `ImageResponse` atau `next/og`, sehingga advisori tersebut tidak boleh disamakan dengan bukti bahwa aplikasi ini dapat dieksploitasi melalui jalur itu. Tetap perbarui dependency dan lockfile, lalu ulangi build serta tes regresi sebelum publikasi.

Referensi: [advisori Next.js](https://github.com/advisories/GHSA-vcvr-r3jv-pc5j), [advisori sharp](https://github.com/advisories/GHSA-wq5f-xc86-pv6w). Jumlah 4 adalah jumlah paket terdampak menurut metadata npm, bukan jumlah seluruh advisori.

### 5. P1 — Arsitektur saat ini belum cocok untuk deployment Vercel langsung

Website memakai SQLite lokal. Booking memakai SQLite kedua, proses HTTP pada loopback, worker interval, serta file kunci bridge yang harus persisten. `scripts/run-hotel.mjs` menjalankan dua proses ini. Upload repository atau login Vercel tidak menyediakan backend dan penyimpanan persisten tersebut.

Vercel menjelaskan bahwa file SQLite lokal tidak menyediakan persistensi bersama yang diperlukan pada Functions: [dokumentasi Vercel](https://vercel.com/kb/guide/is-sqlite-supported-in-vercel). Menaruh database pada `/tmp` tidak menyelesaikan masalah.

Pilihan implementasi:

- Jalur dengan perubahan paling sedikit: jalankan kedua layanan dalam satu container/VM dengan disk persisten, HTTPS, backup, dan pengawasan proses. SQLite dapat tetap digunakan pada satu instance yang dikelola dengan benar.
- Jika Vercel tetap menjadi target utama: pindahkan penyimpanan ke database cloud yang persisten dan adaptasi API/worker ke lingkungan hostingnya, atau tempatkan backend persisten pada layanan cloud terpisah. Kunci bridge, sesi, file lampiran, job, dan transaksi stok ikut perlu disesuaikan; memindahkan tampilan saja tidak cukup.

Koneksi MCP bukan penghalang deployment; CLI sudah terautentikasi. Belum ada deployment hotel baru yang dibuat dalam audit ini.

## Temuan lanjutan

### P2 — Cookie booking belum mengikuti konfigurasi secure secara konsisten

Uji terhadap listener HTTP internal dengan `COOKIE_SECURE=true` menghasilkan cookie booking tanpa atribut `Secure`, meskipun sudah `HttpOnly`, `SameSite=Strict`, dan `Path=/booking`. Proxy menambahkan `Secure` hanya berdasarkan `request.url` berprotokol HTTPS; tidak memakai flag `COOKIE_SECURE` atau origin publik yang dipercaya seperti login website.

Dampaknya bergantung pada konfigurasi terminasi TLS/reverse proxy. Tetapkan aturan secure yang konsisten berdasarkan konfigurasi server tepercaya dan uji response cookie melalui domain HTTPS sebenarnya. Audit ini belum menguji domain HTTPS produksi.

Sumber: `app/booking/[[...path]]/route.ts:35`, `app/api/admin/login/route.ts`, `.env.production.example`.

### P2 — Beberapa menu belum menyelesaikan proses operasional

- Perubahan tanggal menghasilkan permintaan `pending`; UI pembayaran menampilkan permintaan tersebut, tetapi jalur persetujuan yang menerapkan perubahan tanggal/inventory belum tersedia.
- Refund hanya mencatat transaksi simulasi; belum melakukan refund uang ke provider.
- Groups & Events menerima inquiry; kontrak perusahaan dan room block belum diaktifkan.
- Email memiliki template dan mekanisme SMTP, tetapi mode uji yang diperiksa masih `preview-only`; pengiriman nyata dan deliverability belum diuji. WhatsApp belum terhubung.
- Ringkasan okupansi memakai maksimal 200 reservasi terakhir dan sudah diberi keterangan di UI; tidak bisa dianggap laporan seluruh inventory hotel.

Sumber: `booking-engine/domain/booking.mjs:58`, `booking-engine/public/app.js:146`, `booking-engine/public/app.js:148`, `booking-engine/public/staff-workspace.js:11`.

### Operasional dan cakupan yang masih belum dibuktikan

Tes backup/restore database booking lulus. Belum ada bukti backup terjadwal ke lokasi terpisah dan pemulihan gabungan database website, booking, lampiran, serta kunci bridge pada host produksi. Monitoring uptime, log terpusat, HTTPS/domain, uji beban, aksesibilitas menyeluruh, seluruh menu dan seluruh langkah checkout browser, serta container produksi masih memerlukan verifikasi. Script `test:e2e` tercantum, tetapi tidak ditemukan konfigurasi Playwright atau suite e2e yang tracked; audit browser kali ini menggunakan harness lokal tersendiri.

UI yang diperiksa menampilkan logo hotel, warna krem/hijau, kartu membulat, dan menu responsif. Audit ini tidak menyatakan desain identik dengan seluruh mockup referensi atau seluruh animasi telah lolos pengujian aksesibilitas.

## Urutan penyelesaian

1. Tutup temuan dependency, rate limit, secure cookie, dan sinkronisasi sumber harga.
2. Siapkan staging online dengan penyimpanan persisten; verifikasi login, handoff, restart, sesi, backup/restore, dan reservasi dari perangkat di jaringan berbeda.
3. Integrasikan payment gateway di sandbox provider, lalu inventory hotel, proses perubahan/refund, serta notifikasi yang disetujui.
4. Jalankan uji penerimaan staf, beban, HTTPS, monitoring, dan pemulihan data sebelum membuka transaksi nyata.

## File dan perubahan

Dua commit terakhir sebelum audit hanya berisi dokumentasi deployment dan aturan mengabaikan lampiran privat. Instalasi CLI/plugin/MCP Vercel berada pada lingkungan pengguna, bukan perbaikan fitur aplikasi. Perubahan aplikasi lama sudah berada dalam commit impor awal; audit ini tidak mengklaim membuat perubahan UI atau backend tersebut.

File tracked baru dalam audit ini adalah laporan ini. Harness, database uji, JSON hasil, dan screenshot berada di direktori privat yang diabaikan Git. Bukti lokal: `.local/online-readiness/results.json`, `.local/online-readiness/-booking-390.png`, `.local/online-readiness/-booking-1440.png`, dan `.local/online-readiness/-booking-admin-1440.png`. Perbaikan temuan di atas belum diterapkan.
