<script setup>
// Mengimpor fungsi reaktif dan computed dari Vue
import { ref, computed } from "vue";

// Mengimpor data stok, kategori, dan UPBJJ dari JSON
import { stokList, kategoriList, upbjjList } from "../data";

// Mengimpor komponen modal detail bahan ajar
import StockDetailModal from "../components/stock/StockDetailModal.vue";

// Mengimpor fungsi formatting Rupiah
import { formatRupiah } from "../utils/formatter";

// Menyimpan kata kunci pencarian pengguna
const searchQuery = ref("");

// Menyimpan filter UPBJJ yang dipilih
const selectedUpbjj = ref("");

// Menyimpan filter kategori yang dipilih
const selectedKategori = ref("");

// Menyimpan pilihan pengurutan data
const selectedSort = ref("");

// Menyimpan data bahan ajar yang sedang dibuka pada modal
const selectedItem = ref(null);

// Menyimpan nomor halaman aktif
const currentPage = ref(1);

// Menyimpan jumlah baris data yang ditampilkan dalam satu halaman
const perPage = ref(5);

// Menyediakan pilihan jumlah data yang dapat ditampilkan pengguna
const pageSizeOptions = [3, 5, 10, 25, 50];

// Menghitung jumlah halaman berdasarkan jumlah data dan pilihan pengguna
const totalPages = computed(() => {
  return Math.ceil(filteredStock.value.length / perPage.value);
});

// Menghitung jumlah seluruh bahan ajar
const totalBahanAjar = computed(() => {
  return stokList.length;
});

// Menghitung total seluruh persediaan
const totalStok = computed(() => {
  return stokList.reduce((total, item) => {
    return total + item.qty;
  }, 0);
});

// Menghitung jumlah bahan ajar yang stoknya menipis
const totalStokMenipis = computed(() => {
  return stokList.filter((item) => {
    return item.qty <= item.safety;
  }).length;
});

// Menghitung jumlah bahan ajar dengan stok aman
const totalStokAman = computed(() => {
  return stokList.filter((item) => {
    return item.qty > item.safety * 1.5;
  }).length;
});

// Memproses pencarian, filter, dan pengurutan data
const filteredStock = computed(() => {
  // Membuat salinan array agar data sumber tidak berubah
  let result = [...stokList];

  // Mengubah kata kunci menjadi huruf kecil
  const keyword = searchQuery.value.toLowerCase().trim();

  // Memfilter data berdasarkan kode atau judul
  if (keyword) {
    result = result.filter((item) => {
      return (
        item.kode.toLowerCase().includes(keyword) ||
        item.judul.toLowerCase().includes(keyword)
      );
    });
  }

  // Memfilter data berdasarkan UPBJJ
  if (selectedUpbjj.value) {
    result = result.filter((item) => {
      return item.upbjj === selectedUpbjj.value;
    });
  }

  // Memfilter data berdasarkan kategori
  if (selectedKategori.value) {
    result = result.filter((item) => {
      return item.kategori === selectedKategori.value;
    });
  }

  // Mengurutkan data berdasarkan pilihan pengguna
  switch (selectedSort.value) {
    // Mengurutkan harga dari terendah
    case "harga_asc":
      result.sort((a, b) => a.harga - b.harga);
      break;

    // Mengurutkan harga dari tertinggi
    case "harga_desc":
      result.sort((a, b) => b.harga - a.harga);
      break;

    // Mengurutkan stok dari terendah
    case "stok_asc":
      result.sort((a, b) => a.qty - b.qty);
      break;

    // Mengurutkan stok dari tertinggi
    case "stok_desc":
      result.sort((a, b) => b.qty - a.qty);
      break;
  }

  // Mengembalikan hasil pencarian dan filter
  return result;
});

// // Menghitung jumlah halaman berdasarkan hasil filter
// const totalPages = computed(() => {
//   return Math.ceil(filteredStock.value.length / perPage)
// })

// Mengambil data sesuai halaman dan jumlah baris yang dipilih
const paginatedStock = computed(() => {
  // Jika pengguna memilih semua data, tampilkan seluruh hasil filter
  if (perPage.value === "all") {
    return filteredStock.value;
  }

  // Menghitung posisi awal data
  const start = (currentPage.value - 1) * perPage.value;

  // Mengambil data sesuai batas halaman
  return filteredStock.value.slice(start, start + perPage.value);
});

// Menghitung posisi awal data yang ditampilkan
const startRecord = computed(() => {
  return filteredStock.value.length === 0
    ? 0
    : (currentPage.value - 1) * perPage + 1;
});

// Menghitung posisi akhir data yang sedang ditampilkan
const endRecord = computed(() => {
  // Jika pilihan semua data, kembalikan jumlah seluruh hasil filter
  if (perPage.value === "all") {
    return filteredStock.value.length;
  }

  // Menghitung posisi akhir berdasarkan jumlah data per halaman
  return Math.min(
    currentPage.value * perPage.value,
    filteredStock.value.length,
  );
});

// Menentukan status persediaan berdasarkan jumlah stok
const getStockStatus = (item) => {
  // Jika stok kurang dari atau sama dengan safety stock
  if (item.qty <= item.safety) {
    return "Menipis";
  }

  // Jika stok berada pada batas perhatian
  if (item.qty <= item.safety * 1.5) {
    return "Perlu Perhatian";
  }

  // Jika stok berada di atas batas perhatian
  return "Aman";
};

// Menentukan warna badge berdasarkan status persediaan
const getStockBadge = (item) => {
  // Badge merah untuk stok menipis
  if (item.qty <= item.safety) {
    return "bg-danger";
  }

  // Badge kuning untuk stok perlu perhatian
  if (item.qty <= item.safety * 1.5) {
    return "bg-warning text-dark";
  }

  // Badge hijau untuk stok aman
  return "bg-success";
};

// Membuka modal detail bahan ajar
const showDetail = (item) => {
  selectedItem.value = item;
};

// Menutup modal detail bahan ajar
const closeDetail = () => {
  selectedItem.value = null;
};

// Mengatur perpindahan halaman
const changePage = (page) => {
  // Memastikan halaman yang dipilih valid
  if (page < 1 || page > totalPages.value) {
    return;
  }

  // Mengubah nomor halaman aktif
  currentPage.value = page;
};

// Menghapus seluruh pencarian dan filter
const resetFilter = () => {
  searchQuery.value = "";
  selectedUpbjj.value = "";
  selectedKategori.value = "";
  selectedSort.value = "";
  currentPage.value = 1;
};
</script>

<template>
  <div class="stock-page">
    <!-- HEADER HALAMAN STOK -->
    <div class="page-heading mb-4">
      <div>
        <h4>Stok Bahan Ajar</h4>
        <p>Kelola dan pantau persediaan bahan ajar Universitas Terbuka.</p>
      </div>

      <div class="heading-icon">
        <i class="bi bi-box-seam"></i>
      </div>
    </div>

    <!-- RINGKASAN DATA STOK -->
    <div class="row g-3 mb-4">
      <!-- Total jenis bahan ajar -->
      <div class="col-md-4">
        <div class="stock-stat-card">
          <div class="stat-icon blue">
            <i class="bi bi-book"></i>
          </div>

          <div>
            <small>Jenis Bahan Ajar</small>
            <h4>{{ totalBahanAjar }}</h4>
          </div>
        </div>
      </div>

      <!-- Total persediaan -->
      <div class="col-md-4">
        <div class="stock-stat-card">
          <div class="stat-icon green">
            <i class="bi bi-boxes"></i>
          </div>

          <div>
            <small>Total Persediaan</small>
            <h4>{{ totalStok }}</h4>
          </div>
        </div>
      </div>

      <!-- Total stok menipis -->
      <div class="col-md-4">
        <div class="stock-stat-card">
          <div class="stat-icon red">
            <i class="bi bi-exclamation-triangle"></i>
          </div>

          <div>
            <small>Stok Menipis</small>
            <h4>{{ totalStokMenipis }}</h4>
          </div>
        </div>
      </div>
    </div>

    <!-- PANEL TABEL STOK -->
    <div class="stock-panel">
      <!-- HEADER PANEL -->
      <div class="stock-panel-header">
        <div>
          <h5>Daftar Persediaan Bahan Ajar</h5>
          <small>Informasi lengkap seluruh persediaan</small>
        </div>

        <span class="total-badge"> {{ filteredStock.length }} Data </span>
      </div>

      <!-- BAGIAN FILTER DAN PENCARIAN -->
      <div class="filter-section">
        <!-- Pilihan jumlah data per halaman -->
        <div class="filter-item">
          <label for="pageSize">Tampilkan</label>

          <!-- v-model menghubungkan pilihan dengan jumlah data per halaman -->
          <select
            id="pageSize"
            v-model="perPage"
            class="form-select"
            @change="currentPage = 1"
          >
            <!-- Menampilkan pilihan jumlah data menggunakan v-for -->
            <option v-for="size in pageSizeOptions" :key="size" :value="size">
              {{ size }} Data
            </option>

            <!-- Pilihan untuk menampilkan seluruh data -->
            <option value="all">Semua</option>
          </select>
        </div>
        <!-- Pencarian berdasarkan kode dan judul -->
        <div class="filter-search">
          <label for="searchStock">Cari Bahan Ajar</label>

          <div class="search-input">
            <i class="bi bi-search"></i>

            <!-- v-model menghubungkan input dengan searchQuery -->
            <input
              id="searchStock"
              type="text"
              v-model="searchQuery"
              placeholder="Masukkan kode atau judul..."
              class="form-control"
              @keyup.enter="currentPage = 1"
            />
          </div>
        </div>

        <!-- Filter UPBJJ -->
        <div class="filter-item">
          <label for="filterUpbjj">UPBJJ</label>

          <select id="filterUpbjj" v-model="selectedUpbjj" class="form-select">
            <option value="">Semua UPBJJ</option>

            <!-- Menampilkan pilihan UPBJJ menggunakan v-for -->
            <option
              v-for="(upbjj, index) in upbjjList"
              :key="index"
              :value="upbjj"
            >
              {{ upbjj }}
            </option>
          </select>
        </div>

        <!-- Filter kategori -->
        <div class="filter-item">
          <label for="filterKategori">Kategori</label>

          <select
            id="filterKategori"
            v-model="selectedKategori"
            class="form-select"
          >
            <option value="">Semua Kategori</option>

            <!-- Menampilkan pilihan kategori menggunakan v-for -->
            <option
              v-for="(kategori, index) in kategoriList"
              :key="index"
              :value="kategori"
            >
              {{ kategori }}
            </option>
          </select>
        </div>

        <!-- Pengurutan data -->
        <div class="filter-item">
          <label for="sortStock">Urutkan</label>

          <select id="sortStock" v-model="selectedSort" class="form-select">
            <option value="">Default</option>
            <option value="harga_asc">Harga Terendah</option>
            <option value="harga_desc">Harga Tertinggi</option>
            <option value="stok_asc">Stok Terendah</option>
            <option value="stok_desc">Stok Tertinggi</option>
          </select>
        </div>

        <!-- Tombol reset filter -->
        <div class="filter-reset">
          <label>&nbsp;</label>

          <button
            type="button"
            class="btn btn-outline-secondary"
            @click="resetFilter"
          >
            <i class="bi bi-arrow-counterclockwise"></i>
            Reset
          </button>
        </div>
      </div>

      <!-- TABEL DATA STOK -->
      <div class="table-responsive">
        <table class="table stock-table align-middle">
          <thead>
            <tr>
              <th>No.</th>
              <th>Kode</th>
              <th>Judul Bahan Ajar</th>
              <th>Kategori</th>
              <th>UPBJJ</th>
              <th>Lokasi Rak</th>
              <th>Harga</th>
              <th>Stok</th>
              <th>Safety</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>

          <tbody>
            <!-- Menampilkan daftar stok menggunakan v-for -->
            <tr v-for="(item, index) in paginatedStock" :key="item.kode">
              <!-- Nomor urut mengikuti halaman aktif -->
              <td>
                {{
                  perPage === "all"
                    ? index + 1
                    : (currentPage - 1) * perPage + index + 1
                }}
              </td>

              <td class="fw-semibold">
                {{ item.kode }}
              </td>

              <td class="stock-title">
                {{ item.judul }}
              </td>

              <td>{{ item.kategori }}</td>

              <td>{{ item.upbjj }}</td>

              <td>{{ item.lokasiRak }}</td>

              <!-- Formatting harga menggunakan helper function -->
              <td class="price-column">
                {{ formatRupiah(item.harga) }}
              </td>

              <td class="fw-bold">
                {{ item.qty }}
              </td>

              <td>{{ item.safety }}</td>

              <!-- Menampilkan status stok dengan conditional -->
              <td>
                <span class="badge" :class="getStockBadge(item)">
                  {{ getStockStatus(item) }}
                </span>
              </td>

              <!-- Tombol untuk membuka modal detail -->
              <td>
                <button
                  type="button"
                  class="btn btn-detail"
                  @click="showDetail(item)"
                  title="Lihat detail"
                >
                  <i class="bi bi-eye"></i>
                </button>
              </td>
            </tr>

            <!-- Kondisi jika hasil pencarian tidak ditemukan -->
            <tr v-if="filteredStock.length === 0">
              <td colspan="11" class="empty-result">
                <i class="bi bi-search"></i>
                <p>Data bahan ajar tidak ditemukan.</p>
                <small>Coba ubah kata kunci atau filter pencarian.</small>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- BAGIAN PAGINATION -->
      <div class="pagination-section">
        <small>
          Menampilkan {{ startRecord }} - {{ endRecord }} dari
          {{ filteredStock.length }} data
        </small>

        <div class="pagination-buttons">
          <!-- Tombol halaman sebelumnya -->
          <button
            type="button"
            class="page-button"
            :disabled="currentPage === 1"
            @click="changePage(currentPage - 1)"
          >
            <i class="bi bi-chevron-left"></i>
          </button>

          <!-- Nomor halaman -->
          <button
            v-for="page in totalPages"
            :key="page"
            type="button"
            class="page-button"
            :class="{ active: currentPage === page }"
            @click="changePage(page)"
          >
            {{ page }}
          </button>

          <!-- Tombol halaman berikutnya -->
          <button
            type="button"
            class="page-button"
            :disabled="currentPage === totalPages || totalPages === 0"
            @click="changePage(currentPage + 1)"
          >
            <i class="bi bi-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Menampilkan modal detail jika bahan ajar dipilih -->
    <StockDetailModal
      v-if="selectedItem"
      :item="selectedItem"
      @close="closeDetail"
    />
  </div>
</template>

<style scoped>
/* Header halaman */
.page-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-heading h4 {
  color: #3a5a73;
  font-weight: 700;
  font-size: 21px;
  margin-bottom: 5px;
}

.page-heading p {
  color: #84929e;
  font-size: 12px;
  margin: 0;
}

.heading-icon {
  width: 45px;
  height: 45px;
  background: #eaf1f5;
  color: #3a5a73;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  font-size: 21px;
}

/* Kartu ringkasan */
.stock-stat-card {
  display: flex;
  align-items: center;
  gap: 15px;
  background: white;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #e8edf0;
}

.stat-icon {
  width: 45px;
  height: 45px;
  min-width: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  font-size: 20px;
}

.stat-icon.blue {
  background: #eaf1f5;
  color: #3a5a73;
}

.stat-icon.green {
  background: #e8f5ec;
  color: #198754;
}

.stat-icon.red {
  background: #fce8e8;
  color: #c0392b;
}

.stock-stat-card small {
  color: #84929e;
  font-size: 11px;
}

.stock-stat-card h4 {
  color: #3a5a73;
  font-weight: 700;
  margin: 3px 0 0;
}

/* Panel utama */
.stock-panel {
  background: white;
  border: 1px solid #e8edf0;
  border-radius: 12px;
  padding: 22px;
}

.stock-panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 22px;
}

.stock-panel-header h5 {
  color: #3a5a73;
  font-size: 15px;
  font-weight: 700;
  margin-bottom: 4px;
}

.stock-panel-header small {
  color: #84929e;
  font-size: 11px;
}

.total-badge {
  background: #eaf1f5;
  color: #3a5a73;
  padding: 7px 12px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
}

/* Area pencarian dan filter */
.filter-section {
  display: grid;
  grid-template-columns: 0.8fr 2fr 1fr 1fr 1.2fr auto;
  gap: 12px;
  align-items: end;
  margin-bottom: 22px;
}

.filter-section label {
  display: block;
  font-size: 11px;
  font-weight: 600;
  color: #52697b;
  margin-bottom: 7px;
}

.search-input {
  position: relative;
}

.search-input i {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #84929e;
}

.search-input input {
  padding-left: 35px;
}

.filter-section .form-control,
.filter-section .form-select {
  min-height: 39px;
  border-color: #e1e8ec;
  border-radius: 7px;
  font-size: 11px;
  color: #52697b;
}

.filter-section .form-control:focus,
.filter-section .form-select:focus {
  border-color: #6d93ab;
  box-shadow: 0 0 0 3px rgba(109, 147, 171, 0.12);
}

.filter-reset button {
  min-height: 39px;
  font-size: 11px;
}

/* Tabel stok */
.stock-table {
  font-size: 11px;
  white-space: nowrap;
  margin-bottom: 0;
}

.stock-table thead th {
  background: #f5f8fa;
  color: #6d7f8d;
  font-weight: 600;
  padding: 14px 12px;
  border-bottom: 1px solid #e8edf0;
}

.stock-table tbody td {
  color: #52697b;
  padding: 13px 12px;
  border-bottom: 1px solid #edf0f2;
}

.stock-title {
  font-weight: 600;
  color: #3a5a73 !important;
}

.price-column {
  font-weight: 600;
}

/* Tombol detail */
.btn-detail {
  width: 32px;
  height: 32px;
  background: #eaf1f5;
  color: #3a5a73;
  border: none;
  border-radius: 7px;
}

.btn-detail:hover {
  background: #3a5a73;
  color: white;
}

/* Hasil pencarian kosong */
.empty-result {
  text-align: center;
  padding: 45px 15px !important;
  color: #84929e !important;
}

.empty-result i {
  font-size: 28px;
}

.empty-result p {
  margin: 10px 0 3px;
  font-weight: 600;
}

.empty-result small {
  font-size: 10px;
}

/* Pagination */
.pagination-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
  padding-top: 20px;
}

.pagination-section small {
  color: #84929e;
  font-size: 11px;
}

.pagination-buttons {
  display: flex;
  gap: 5px;
}

.page-button {
  min-width: 30px;
  height: 30px;
  background: white;
  border: 1px solid #e1e8ec;
  color: #52697b;
  border-radius: 6px;
  font-size: 11px;
}

.page-button.active {
  background: #3a5a73;
  color: white;
  border-color: #3a5a73;
}

.page-button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

@media (max-width: 992px) {
  .filter-section {
    grid-template-columns: repeat(2, 1fr);
  }

  .filter-search {
    grid-column: span 2;
  }
}

@media (max-width: 576px) {
  .stock-panel {
    padding: 15px;
  }

  .filter-section {
    grid-template-columns: 1fr;
  }

  .filter-search {
    grid-column: auto;
  }

  .pagination-section {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
