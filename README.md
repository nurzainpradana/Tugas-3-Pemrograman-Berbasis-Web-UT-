# SITTA – Sistem Informasi Tiras dan Transaksi Bahan Ajar

SITTA (Sistem Informasi Tiras dan Transaksi Bahan Ajar) merupakan aplikasi berbasis web yang dikembangkan untuk membantu pengelolaan informasi stok, pemesanan, dan tracking pengiriman bahan ajar Universitas Terbuka.

Aplikasi ini dikembangkan menggunakan **Vue.js 3** dengan **Vite** sebagai bagian dari pemenuhan Tugas Praktik 3 mata kuliah Pemrograman Web.

## 📌 Fitur Aplikasi

### 1. Dashboard
- Menampilkan ringkasan jumlah jenis bahan ajar.
- Menampilkan total stok bahan ajar.
- Menampilkan jumlah paket bahan ajar.
- Menampilkan informasi tracking pengiriman.
- Menampilkan peringatan bahan ajar dengan stok rendah.

### 2. Stok Bahan Ajar
- Menampilkan daftar bahan ajar.
- Pencarian berdasarkan kode dan nama bahan ajar.
- Filter berdasarkan UPBJJ dan kategori.
- Pengurutan data berdasarkan pilihan pengguna.
- Pagination dengan pilihan jumlah data per halaman.
- Menampilkan detail bahan ajar.
- Menampilkan informasi jumlah stok dan batas safety stock.

### 3. Pemesanan Bahan Ajar
- Pemesanan bahan ajar secara satuan.
- Pemesanan berdasarkan paket bahan ajar.
- Pengisian data pemesan.
- Pemilihan UPBJJ.
- Pemilihan jasa pengiriman.
- Perhitungan subtotal, ongkos kirim, dan total pembayaran.
- Validasi formulir pemesanan.
- Notifikasi ketika pesanan berhasil dibuat.

### 4. Tracking Pengiriman
- Pencarian pengiriman berdasarkan nomor DO, nama penerima, atau NIM.
- Menampilkan informasi penerima.
- Menampilkan status pengiriman.
- Menampilkan informasi ekspedisi dan paket.
- Menampilkan riwayat perjalanan pengiriman dalam bentuk timeline.

## 🛠️ Teknologi yang Digunakan

| Teknologi | Kegunaan |
|---|---|
| Vue.js 3 | Framework JavaScript untuk membangun antarmuka aplikasi |
| Vite | Development server dan build tool |
| JavaScript | Bahasa pemrograman aplikasi |
| Bootstrap 5 | Framework CSS untuk desain responsif |
| Bootstrap Icons | Penyedia ikon aplikasi |
| Vue Router | Pengelolaan navigasi antarhalaman |
| JSON | Penyimpanan data simulasi bahan ajar |

## 📂 Struktur Folder

```text
sitta-vue/
├── public/
├── src/
│   ├── assets/
│   │   └── css/
│   │       └── style.css
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppSidebar.vue
│   │   │   ├── AppNavbar.vue
│   │   │   └── AppLayout.vue
│   │   ├── dashboard/
│   │   │   └── SummaryCard.vue
│   │   └── stock/
│   │       └── StockDetailModal.vue
│   ├── data/
│   │   ├── dataBahanAjar.json
│   │   └── index.js
│   ├── router/
│   │   └── index.js
│   ├── utils/
│   │   └── formatter.js
│   ├── views/
│   │   ├── DashboardView.vue
│   │   ├── StockView.vue
│   │   ├── OrderView.vue
│   │   └── TrackingView.vue
│   ├── App.vue
│   └── main.js
├── index.html
├── package.json
└── vite.config.js
```

## ⚙️ Instalasi dan Menjalankan Aplikasi

Pastikan perangkat sudah memiliki:
- Node.js
- npm
- Git

### 1. Clone Repository

```bash
# Mengunduh repository SITTA dari GitHub.
git clone https://github.com/USERNAME/sitta-vue.git

# Masuk ke direktori proyek.
cd sitta-vue
```

Ganti `USERNAME` dengan username GitHub pemilik repository.

### 2. Install Dependencies

```bash
# Menginstal seluruh dependencies yang tercantum dalam package.json.
npm install
```

### 3. Menjalankan Development Server

```bash
# Menjalankan aplikasi dalam mode development.
npm run dev
```

### 4. Membuka Aplikasi

Buka alamat lokal yang ditampilkan oleh Vite pada terminal, biasanya:

```text
http://localhost:5173
```

### 5. Build untuk Production

```bash
