
<script setup>
// Mengimpor ref dan computed dari Vue.
import { ref, computed } from 'vue'

// Mengimpor data tracking dari file JSON.
import { trackingList } from '../data'

// Mengimpor fungsi format tanggal dan Rupiah.
import { formatRupiah, formatTanggal } from '../utils/formatter'

// Mengubah struktur data tracking menjadi array dengan properti nomorDO.
// Nomor DO pada JSON merupakan key objek, bukan properti biasa.
const semuaTracking = computed(() => {
  return trackingList.map(item => {
    const [nomorDO, detail] = Object.entries(item)[0]

    // Menggabungkan nomor DO dengan detail pengiriman.
    return {
      nomorDO,
      ...detail
    }
  })
})

// Menghapus data tracking duplikat berdasarkan nomor DO.
const daftarTracking = computed(() => {
  const dataUnik = new Map()

  semuaTracking.value.forEach(item => {
    // Hanya menyimpan satu data untuk setiap nomor DO.
    if (!dataUnik.has(item.nomorDO)) {
      dataUnik.set(item.nomorDO, item)
    }
  })

  return Array.from(dataUnik.values())
})

// Menyimpan kata kunci pencarian.
const searchQuery = ref('')

// Menyimpan nomor DO yang sedang dipilih.
const selectedDO = ref('')

// Memfilter data berdasarkan nomor DO, nama, atau NIM.
const hasilPencarian = computed(() => {
  const keyword = searchQuery.value.trim().toLowerCase()

  // Menampilkan seluruh data jika pencarian kosong.
  if (!keyword) {
    return daftarTracking.value
  }

  // Mencari data berdasarkan beberapa kolom.
  return daftarTracking.value.filter(item => {
    return (
      item.nomorDO.toLowerCase().includes(keyword) ||
      String(item.nama || '').toLowerCase().includes(keyword) ||
      String(item.nim || '').toLowerCase().includes(keyword)
    )
  })
})

// Mengambil detail tracking yang dipilih.
const trackingTerpilih = computed(() => {
  return daftarTracking.value.find(item => {
    return item.nomorDO === selectedDO.value
  }) || null
})

// Mengambil riwayat perjalanan dari data tracking.
const riwayatPerjalanan = computed(() => {
  return trackingTerpilih.value?.perjalanan || []
})

// Memilih pengiriman dari daftar.
const pilihTracking = (nomorDO) => {
  selectedDO.value = nomorDO
}

// Memproses pencarian pengiriman.
const cariTracking = () => {
  // Mengambil hasil pencarian pertama jika tersedia.
  if (hasilPencarian.value.length > 0) {
    pilihTracking(hasilPencarian.value[0].nomorDO)
  } else {
    // Mengosongkan detail jika data tidak ditemukan.
    selectedDO.value = ''
  }
}

// Mengubah warna badge sesuai status pengiriman.
const getStatusClass = (status) => {
  const value = String(status || '').toLowerCase()

  if (value.includes('diterima') || value.includes('terkirim')) {
    return 'tracking-status-success'
  }

  if (value.includes('perjalanan')) {
    return 'tracking-status-info'
  }

  if (value.includes('proses')) {
    return 'tracking-status-warning'
  }

  return 'tracking-status-default'
}
</script>

<template>
  <div class="tracking-page">

    <!-- Judul halaman tracking -->
    <div class="page-heading mb-4">
      <div>
        <h3 class="fw-bold mb-1">Tracking Pengiriman</h3>
        <p class="text-muted mb-0">
          Pantau status dan riwayat pengiriman bahan ajar.
        </p>
      </div>
    </div>

    <!-- Form pencarian pengiriman -->
    <div class="card dashboard-card mb-4">
      <div class="card-body p-4">

        <h5 class="fw-bold mb-2">Cari Pengiriman</h5>

        <p class="text-muted small">
          Masukkan nomor DO, nama penerima, atau NIM.
        </p>

        <form @submit.prevent="cariTracking">
          <div class="input-group">
            <span class="input-group-text bg-white">
              <i class="bi bi-search"></i>
            </span>

            <input
              type="text"
              class="form-control"
              v-model.trim="searchQuery"
              placeholder="Contoh: DO2025-0001"
            >

            <button type="submit" class="btn btn-primary">
              Cari
            </button>
          </div>
        </form>

      </div>
    </div>

    <!-- Daftar pengiriman -->
    <div class="card dashboard-card mb-4">
      <div class="card-header bg-white border-0 pt-4 px-4">
        <h5 class="fw-bold mb-0">Daftar Pengiriman</h5>
      </div>

      <div class="card-body px-4">

        <!-- Menampilkan daftar pengiriman jika tersedia -->
        <div v-if="hasilPencarian.length > 0" class="tracking-list">

          <button
            v-for="(item, index) in hasilPencarian"
            :key="item.nomorDO"
            type="button"
            class="tracking-list-item"
            :class="{
              'tracking-list-active': selectedDO === item.nomorDO
            }"
            @click="pilihTracking(item.nomorDO)"
          >

            <!-- Ikon pengiriman -->
            <div class="tracking-list-icon">
              <i class="bi bi-box-seam"></i>
            </div>

            <!-- Informasi penerima dan nomor DO -->
            <div class="flex-grow-1 text-start">
              <div class="fw-bold">
                {{ item.nomorDO }}
              </div>

              <small class="text-muted">
                {{ item.nama }} | NIM: {{ item.nim }}
              </small>
            </div>

            <!-- Status pengiriman -->
            <span
              class="tracking-status-badge"
              :class="getStatusClass(item.status)"
            >
              {{ item.status }}
            </span>

            <i class="bi bi-chevron-right ms-2"></i>

          </button>

        </div>

        <!-- Pesan ketika data tidak ditemukan -->
        <div v-else class="tracking-empty">
          <i class="bi bi-search"></i>
          <h6 class="fw-bold mt-3">Data Tidak Ditemukan</h6>
          <p class="text-muted small mb-0">
            Periksa kembali nomor DO, nama, atau NIM.
          </p>
        </div>

      </div>
    </div>

    <!-- Detail pengiriman ditampilkan setelah memilih data -->
    <div v-if="trackingTerpilih" class="row g-4">

      <!-- Informasi transaksi -->
      <div class="col-lg-5">
        <div class="card dashboard-card h-100">

          <div class="card-header bg-white border-0 pt-4 px-4">
            <h5 class="fw-bold mb-0">Detail Pengiriman</h5>
          </div>

          <div class="card-body p-4">

            <!-- Menampilkan nomor DO -->
            <div class="tracking-detail-number">
              <small class="text-muted">Nomor Delivery Order</small>
              <h5 class="fw-bold text-primary mb-0">
                {{ trackingTerpilih.nomorDO }}
              </h5>
            </div>

            <hr>

            <!-- Menampilkan identitas penerima -->
            <div class="tracking-detail-row">
              <span>Nama Penerima</span>
              <strong>{{ trackingTerpilih.nama }}</strong>
            </div>

            <div class="tracking-detail-row">
              <span>NIM</span>
              <strong>{{ trackingTerpilih.nim }}</strong>
            </div>

            <!-- Menampilkan tanggal pengiriman -->
            <div class="tracking-detail-row">
              <span>Tanggal Kirim</span>
              <strong>
                {{ formatTanggal(trackingTerpilih.tanggalKirim) }}
              </strong>
            </div>

            <!-- Menampilkan informasi paket -->
            <div class="tracking-detail-row">
              <span>Kode Paket</span>
              <strong>{{ trackingTerpilih.paket }}</strong>
            </div>

            <!-- Menampilkan jasa ekspedisi -->
            <div class="tracking-detail-row">
              <span>Ekspedisi</span>
              <strong>{{ trackingTerpilih.ekspedisi }}</strong>
            </div>

            <!-- Menampilkan total pembayaran -->
            <div class="tracking-detail-row">
              <span>Total Pembayaran</span>
              <strong class="text-primary">
                {{ formatRupiah(trackingTerpilih.total) }}
              </strong>
            </div>

            <!-- Menampilkan status pengiriman -->
            <div class="mt-4">
              <small class="text-muted d-block mb-2">
                Status Pengiriman
              </small>

              <span
                class="tracking-status-badge"
                :class="getStatusClass(trackingTerpilih.status)"
              >
                {{ trackingTerpilih.status }}
              </span>
            </div>

          </div>
        </div>
      </div>

      <!-- Riwayat perjalanan -->
      <div class="col-lg-7">
        <div class="card dashboard-card h-100">

          <div class="card-header bg-white border-0 pt-4 px-4">
            <h5 class="fw-bold mb-1">Riwayat Perjalanan</h5>

            <p class="text-muted small mb-0">
              Informasi tahapan pengiriman paket.
            </p>
          </div>

          <div class="card-body p-4">

            <!-- Menampilkan timeline jika riwayat tersedia -->
            <div
              v-if="riwayatPerjalanan.length > 0"
              class="tracking-timeline"
            >

              <div
                v-for="(riwayat, index) in riwayatPerjalanan"
                :key="index"
                class="tracking-timeline-item"
              >

                <!-- Ikon tahapan pengiriman -->
                <div class="tracking-timeline-marker">
                  <i class="bi bi-check-lg"></i>
                </div>

                <!-- Informasi riwayat pengiriman -->
                <div class="tracking-timeline-content">

                  <strong>
                    {{ riwayat.keterangan }}
                  </strong>

                  <p class="text-muted small mt-2 mb-1">
                    {{ formatTanggal(riwayat.waktu) }}
                  </p>

                </div>

              </div>

            </div>

            <!-- Pesan jika riwayat belum tersedia -->
            <div v-else class="tracking-empty">
              <i class="bi bi-clock-history"></i>
              <p class="text-muted mt-2 mb-0">
                Riwayat perjalanan belum tersedia.
              </p>
            </div>

          </div>
        </div>
      </div>

    </div>

    <!-- Tampilan awal sebelum memilih pengiriman -->
    <div
      v-else-if="hasilPencarian.length > 0"
      class="tracking-empty"
    >
      <i class="bi bi-box-seam"></i>

      <h6 class="fw-bold mt-3">Pilih Pengiriman</h6>

      <p class="text-muted small mb-0">
        Pilih salah satu nomor DO untuk melihat detail pengiriman.
      </p>
    </div>

  </div>
</template>
