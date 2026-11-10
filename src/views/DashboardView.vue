
<script setup>
// Mengimpor computed untuk membuat perhitungan otomatis
import { computed } from 'vue'

// Mengimpor komponen kartu ringkasan
import SummaryCard from '../components/dashboard/SummaryCard.vue'

// Mengimpor data dari file JSON
import {
  stokList,
  paketList,
  trackingList
} from '../data'

// Menghitung jumlah jenis bahan ajar
const totalBahanAjar = computed(() => {
  return stokList.length
})

// Menghitung total seluruh kuantitas stok
const totalStok = computed(() => {
  return stokList.reduce((total, item) => {
    return total + item.qty
  }, 0)
})

// Menghitung jumlah paket bahan ajar
const totalPaket = computed(() => {
  return paketList.length
})

// Menghitung jumlah data tracking
const totalTracking = computed(() => {
  return trackingList.length
})

// Mengambil bahan ajar yang jumlah stoknya
// berada di bawah atau sama dengan safety stock
const lowStockList = computed(() => {
  return stokList.filter(item => {
    return item.qty <= item.safety
  })
})

// Menghitung jumlah stok yang masih aman
const safeStockCount = computed(() => {
  return stokList.filter(item => {
    return item.qty > item.safety
  }).length
})

// Mengambil tiga data stok pertama untuk ringkasan dashboard
const recentStockList = computed(() => {
  return stokList.slice(0, 3)
})

// Menentukan status stok berdasarkan jumlah dan safety stock
const getStockStatus = (item) => {
  if (item.qty <= item.safety) {
    return 'Menipis'
  } else if (item.qty <= item.safety * 1.5) {
    return 'Perlu Perhatian'
  } else {
    return 'Aman'
  }
}

// Menentukan warna badge berdasarkan status stok
const getStockBadge = (item) => {
  if (item.qty <= item.safety) {
    return 'danger'
  } else if (item.qty <= item.safety * 1.5) {
    return 'warning'
  } else {
    return 'success'
  }
}
</script>

<template>
  <div class="dashboard-page">

    <!-- BAGIAN HEADER DASHBOARD -->
    <div class="dashboard-header mb-4">
      <div>
        <h4 class="fw-bold">Dashboard</h4>

        <!-- Menampilkan teks menggunakan v-text -->
        <p
          class="text-muted mb-0"
          v-text="'Ringkasan informasi persediaan dan transaksi bahan ajar.'"
        ></p>
      </div>

      <div class="dashboard-date">
        <i class="bi bi-calendar3"></i>
        Sistem Informasi SITTA
      </div>
    </div>

    <!-- BAGIAN KARTU RINGKASAN -->
    <div class="row g-3">

      <!-- Kartu total bahan ajar -->
      <div class="col-md-6 col-xl-3">
        <SummaryCard
          title="Total Bahan Ajar"
          :value="totalBahanAjar"
          icon="bi bi-book"
          description="Jenis bahan ajar terdaftar"
          color="#EAF1F5"
        />
      </div>

      <!-- Kartu total stok -->
      <div class="col-md-6 col-xl-3">
        <SummaryCard
          title="Total Persediaan"
          :value="totalStok"
          icon="bi bi-box-seam"
          description="Jumlah seluruh stok"
          color="#F0F2E9"
        />
      </div>

      <!-- Kartu jumlah paket -->
      <div class="col-md-6 col-xl-3">
        <SummaryCard
          title="Paket Bahan Ajar"
          :value="totalPaket"
          icon="bi bi-collection"
          description="Paket tersedia"
          color="#F3EEE5"
        />
      </div>

      <!-- Kartu jumlah tracking -->
      <div class="col-md-6 col-xl-3">
        <SummaryCard
          title="Data Tracking"
          :value="totalTracking"
          icon="bi bi-truck"
          description="Data pengiriman tersedia"
          color="#EAF1F5"
        />
      </div>

    </div>

    <!-- BAGIAN INFORMASI STOK -->
    <div class="row g-3 mt-2">

      <!-- Kartu stok menipis -->
      <div class="col-lg-8">
        <div class="dashboard-panel h-100">

          <div class="panel-header">
            <div>
              <h5>Perhatian Persediaan</h5>
              <small>Informasi bahan ajar berdasarkan safety stock</small>
            </div>

            <!-- Menampilkan jumlah stok menipis -->
            <span class="count-badge">
              {{ lowStockList.length }} Item
            </span>
          </div>

          <!-- Kondisi jika terdapat stok menipis -->
          <div v-if="lowStockList.length > 0">

            <div
              v-for="(item, index) in lowStockList"
              :key="item.kode"
              class="alert-stock-item"
            >
              <div class="stock-number">
                {{ index + 1 }}
              </div>

              <div class="stock-detail">
                <strong>{{ item.judul }}</strong>
                <small>
                  {{ item.kode }} · {{ item.upbjj }}
                </small>
              </div>

              <div class="stock-quantity">
                <strong>{{ item.qty }}</strong>
                <small>Safety: {{ item.safety }}</small>
              </div>

              <span class="badge bg-danger">
                Menipis
              </span>
            </div>

          </div>

          <!-- Kondisi jika tidak ada stok menipis -->
          <div v-else class="empty-stock">
            <i class="bi bi-check-circle"></i>
            <p>Tidak ada bahan ajar dengan stok menipis.</p>
          </div>

        </div>
      </div>

      <!-- Kartu status persediaan -->
      <div class="col-lg-4">
        <div class="dashboard-panel h-100">

          <div class="panel-header">
            <div>
              <h5>Status Persediaan</h5>
              <small>Ringkasan kondisi stok</small>
            </div>
          </div>

          <div class="stock-summary">

            <!-- Informasi stok aman -->
            <div class="summary-status">
              <span class="status-dot bg-success"></span>
              <span>Stok Aman</span>
              <strong>{{ safeStockCount }}</strong>
            </div>

            <!-- Informasi stok menipis -->
            <div class="summary-status">
              <span class="status-dot bg-danger"></span>
              <span>Stok Menipis</span>
              <strong>{{ lowStockList.length }}</strong>
            </div>

          </div>

          <!-- v-show digunakan untuk menampilkan peringatan -->
          <div
            v-show="lowStockList.length > 0"
            class="stock-warning"
          >
            <i class="bi bi-exclamation-triangle"></i>
            Terdapat bahan ajar yang perlu segera diperhatikan.
          </div>

          <!-- Contoh conditional menggunakan v-if, v-else-if, v-else -->
          <div class="mt-3">
            <div
              v-if="lowStockList.length >= 2"
              class="status-message danger-message"
            >
              Kondisi persediaan perlu mendapat perhatian.
            </div>

            <div
              v-else-if="lowStockList.length === 1"
              class="status-message warning-message"
            >
              Terdapat satu bahan ajar dengan stok menipis.
            </div>

            <div
              v-else
              class="status-message success-message"
            >
              Seluruh persediaan berada di atas safety stock.
            </div>
          </div>

        </div>
      </div>

    </div>

    <!-- BAGIAN TABEL RINGKASAN STOK -->
    <div class="dashboard-panel mt-4">

      <div class="panel-header">
        <div>
          <h5>Ringkasan Stok Bahan Ajar</h5>
          <small>Informasi persediaan bahan ajar terbaru</small>
        </div>

        <RouterLink to="/stok" class="view-all">
          Lihat Semua
          <i class="bi bi-arrow-right"></i>
        </RouterLink>
      </div>

      <!-- Tabel data bahan ajar -->
      <div class="table-responsive">
        <table class="table dashboard-table align-middle">

          <thead>
            <tr>
              <th>No.</th>
              <th>Kode</th>
              <th>Judul Bahan Ajar</th>
              <th>UPBJJ</th>
              <th>Lokasi Rak</th>
              <th>Stok</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>

            <!-- Menampilkan data menggunakan v-for -->
            <tr
              v-for="(item, index) in recentStockList"
              :key="item.kode"
            >
              <td>{{ index + 1 }}</td>
              <td class="fw-semibold">{{ item.kode }}</td>
              <td>{{ item.judul }}</td>
              <td>{{ item.upbjj }}</td>
              <td>{{ item.lokasiRak }}</td>
              <td class="fw-semibold">{{ item.qty }}</td>

              <!-- Conditional untuk menentukan badge status -->
              <td>
                <span
                  class="badge"
                  :class="'bg-' + getStockBadge(item)"
                >
                  {{ getStockStatus(item) }}
                </span>
              </td>
            </tr>

            <!-- Ditampilkan jika data kosong -->
            <tr v-if="recentStockList.length === 0">
              <td colspan="7" class="text-center text-muted py-4">
                Data bahan ajar belum tersedia.
              </td>
            </tr>

          </tbody>
        </table>
      </div>

    </div>

    <!-- BAGIAN CATATAN BAHAN AJAR -->
    <div class="dashboard-panel mt-4">

      <div class="panel-header">
        <div>
          <h5>Catatan Bahan Ajar</h5>
          <small>Informasi khusus dari data persediaan</small>
        </div>
      </div>

      <div class="row g-3">

        <!-- Menampilkan catatan dengan v-for -->
        <div
          v-for="item in stokList"
          :key="item.kode"
          class="col-md-6"
        >
          <div class="note-item">
            <strong>{{ item.judul }}</strong>

            <!-- Menampilkan konten HTML dari JSON -->
            <p
              class="mb-0 mt-2"
              v-html="item.catatanHTML"
            ></p>
          </div>
        </div>

      </div>

    </div>

  </div>
</template>

<style scoped>
/* Mengatur bagian header dashboard */
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 15px;
}

.dashboard-header h4 {
  color: #3a5a73;
  font-size: 21px;
  margin-bottom: 5px;
}

.dashboard-header p {
  font-size: 12px;
}

.dashboard-date {
  color: #6d93ab;
  background: #ffffff;
  border: 1px solid #e8edf0;
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 12px;
}

/* Mengatur panel dashboard */
.dashboard-panel {
  background: #ffffff;
  border: 1px solid #e8edf0;
  border-radius: 12px;
  padding: 22px;
}

/* Mengatur header setiap panel */
.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 20px;
}

.panel-header h5 {
  color: #3a5a73;
  font-size: 15px;
  font-weight: 700;
  margin-bottom: 4px;
}

.panel-header small {
  color: #84929e;
  font-size: 11px;
}

/* Mengatur badge jumlah */
.count-badge {
  background: #fce8e8;
  color: #c0392b;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
}

/* Mengatur setiap baris informasi stok menipis */
.alert-stock-item {
  display: flex;
  align-items: center;
  gap: 13px;
  padding: 13px 0;
  border-bottom: 1px solid #edf0f2;
}

.alert-stock-item:last-child {
  border-bottom: none;
}

/* Nomor urut stok */
.stock-number {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  background: #fce8e8;
  color: #c0392b;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 12px;
}

/* Informasi nama bahan ajar */
.stock-detail {
  flex: 1;
  min-width: 0;
}

.stock-detail strong,
.stock-quantity strong {
  display: block;
  color: #3a5a73;
  font-size: 12px;
}

.stock-detail small,
.stock-quantity small {
  color: #84929e;
  font-size: 10px;
}

/* Informasi kuantitas stok */
.stock-quantity {
  text-align: right;
}

/* Kondisi stok kosong */
.empty-stock {
  padding: 30px 10px;
  text-align: center;
  color: #84929e;
}

.empty-stock i {
  color: #198754;
  font-size: 30px;
}

.empty-stock p {
  margin-top: 10px;
  font-size: 12px;
}

/* Ringkasan status stok */
.stock-summary {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.summary-status {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #52697b;
  font-size: 12px;
}

.summary-status strong {
  margin-left: auto;
  color: #3a5a73;
  font-size: 16px;
}

/* Lingkaran indikator status */
.status-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
}

/* Peringatan stok */
.stock-warning {
  background: #fff5e5;
  color: #946200;
  padding: 12px;
  border-radius: 8px;
  margin-top: 20px;
  font-size: 11px;
  line-height: 1.6;
}

/* Pesan status persediaan */
.status-message {
  border-radius: 8px;
  padding: 10px;
  font-size: 11px;
  line-height: 1.5;
}

.danger-message {
  background: #fce8e8;
  color: #c0392b;
}

.warning-message {
  background: #fff5e5;
  color: #946200;
}

.success-message {
  background: #e8f5ec;
  color: #198754;
}

/* Tautan lihat semua */
.view-all {
  color: #3a5a73;
  font-size: 11px;
  text-decoration: none;
  font-weight: 600;
}

.view-all:hover {
  color: #6d93ab;
}

/* Tabel dashboard */
.dashboard-table {
  font-size: 11px;
  margin-bottom: 0;
  white-space: nowrap;
}

.dashboard-table thead th {
  background: #f7f9fa;
  color: #6d7f8d;
  font-weight: 600;
  border-bottom: 1px solid #e8edf0;
  padding: 13px 12px;
}

.dashboard-table tbody td {
  color: #52697b;
  padding: 13px 12px;
}

/* Catatan bahan ajar */
.note-item {
  background: #f7f9fa;
  border: 1px solid #edf0f2;
  border-radius: 8px;
  padding: 14px;
  color: #52697b;
  font-size: 12px;
}

.note-item strong {
  color: #3a5a73;
}

.note-item p {
  color: #84929e;
  font-size: 11px;
}

/* Penyesuaian layar kecil */
@media (max-width: 576px) {
  .dashboard-panel {
    padding: 15px;
  }

  .alert-stock-item {
    flex-wrap: wrap;
  }

  .stock-detail {
    min-width: 120px;
  }
}
</style>
