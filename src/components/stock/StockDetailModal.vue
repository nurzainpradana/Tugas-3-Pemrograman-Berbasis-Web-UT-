<script setup>
// Mengimpor fungsi computed dari Vue
import { computed } from "vue";

// Mengimpor fungsi formatting harga Rupiah
import { formatRupiah } from "../../utils/formatter";

// Mendefinisikan property yang diterima dari komponen induk
const props = defineProps({
  // Data bahan ajar yang akan ditampilkan
  item: {
    type: Object,
    default: null,
  },
});

// Mendefinisikan event untuk menutup modal
const emit = defineEmits(["close"]);

// Menentukan status stok berdasarkan safety stock
const stockStatus = computed(() => {
  // Mengembalikan status kosong jika tidak ada data
  if (!props.item) return "-";

  // Memeriksa apakah stok berada di bawah safety stock
  if (props.item.qty <= props.item.safety) {
    return "Menipis";
  }

  // Memeriksa apakah stok perlu mendapat perhatian
  if (props.item.qty <= props.item.safety * 1.5) {
    return "Perlu Perhatian";
  }

  // Mengembalikan status aman
  return "Aman";
});
</script>

<template>
  <!-- Modal hanya ditampilkan jika data bahan ajar tersedia -->
  <div
    v-if="item"
    class="modal-backdrop-custom"
    @click.self="emit('close')"
    @keyup.esc="emit('close')"
  >
    <!-- Kotak utama modal -->
    <div class="stock-modal">
      <!-- Header modal -->
      <div class="modal-header-custom">
        <div>
          <h5>Detail Bahan Ajar</h5>
          <small>Informasi lengkap persediaan</small>
        </div>

        <!-- Tombol untuk menutup modal -->
        <button
          type="button"
          class="btn-close"
          aria-label="Tutup"
          @click="emit('close')"
        ></button>
      </div>

      <!-- Isi modal -->
      <div class="modal-body-custom">
        <!-- Informasi identitas bahan ajar -->
        <div class="detail-heading">
          <div class="detail-icon">
            <i class="bi bi-book"></i>
          </div>

          <div>
            <h6>{{ item.judul }}</h6>
            <small>{{ item.kode }}</small>
          </div>
        </div>

        <!-- Daftar informasi bahan ajar -->
        <div class="detail-grid">
          <div class="detail-field">
            <label>Kategori</label>
            <strong>{{ item.kategori }}</strong>
          </div>

          <div class="detail-field">
            <label>UPBJJ</label>
            <strong>{{ item.upbjj }}</strong>
          </div>

          <div class="detail-field">
            <label>Lokasi Rak</label>
            <strong>{{ item.lokasiRak }}</strong>
          </div>

          <div class="detail-field">
            <label>Harga</label>
            <strong>{{ formatRupiah(item.harga) }}</strong>
          </div>

          <div class="detail-field">
            <label>Jumlah Stok</label>
            <strong>{{ item.qty }} unit</strong>
          </div>

          <div class="detail-field">
            <label>Safety Stock</label>
            <strong>{{ item.safety }} unit</strong>
          </div>

          <div class="detail-field">
            <label>Status Persediaan</label>
            <strong>{{ stockStatus }}</strong>
          </div>
        </div>

        <!-- Menampilkan catatan khusus bahan ajar -->
        <div class="detail-note">
          <label>Catatan Bahan Ajar</label>

          <!-- Menampilkan HTML dari sumber JSON lokal -->
          <p v-html="item.catatanHTML"></p>
        </div>
      </div>

      <!-- Footer modal -->
      <div class="modal-footer-custom">
        <button type="button" class="btn btn-secondary" @click="emit('close')">
          Tutup
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Membuat lapisan gelap di belakang modal */
.modal-backdrop-custom {
  position: fixed;
  inset: 0;
  z-index: 1050;
  background: rgba(20, 35, 48, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 15px;
}

/* Mengatur kotak modal */
.stock-modal {
  width: 100%;
  max-width: 600px;
  background: #ffffff;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 15px 45px rgba(0, 0, 0, 0.15);
}

/* Header modal */
.modal-header-custom,
.modal-footer-custom {
  padding: 18px 22px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #e8edf0;
}

.modal-header-custom h5 {
  color: #3a5a73;
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 4px;
}

.modal-header-custom small {
  color: #84929e;
  font-size: 11px;
}

/* Isi modal */
.modal-body-custom {
  padding: 22px;
}

/* Identitas bahan ajar */
.detail-heading {
  display: flex;
  align-items: center;
  gap: 13px;
  margin-bottom: 22px;
}

.detail-icon {
  width: 48px;
  height: 48px;
  background: #eaf1f5;
  color: #3a5a73;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
}

.detail-heading h6 {
  color: #3a5a73;
  font-weight: 700;
  margin-bottom: 4px;
}

.detail-heading small {
  color: #84929e;
}

/* Grid detail bahan ajar */
.detail-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

.detail-field {
  background: #f7f9fa;
  border-radius: 8px;
  padding: 12px;
}

.detail-field label,
.detail-note label {
  display: block;
  color: #84929e;
  font-size: 11px;
  margin-bottom: 6px;
}

.detail-field strong {
  color: #3a5a73;
  font-size: 12px;
}

/* Catatan bahan ajar */
.detail-note {
  background: #f7f9fa;
  padding: 14px;
  border-radius: 8px;
  margin-top: 18px;
}

.detail-note p {
  color: #52697b;
  font-size: 12px;
  margin-bottom: 0;
}

/* Footer modal */
.modal-footer-custom {
  justify-content: flex-end;
  border-top: 1px solid #e8edf0;
  border-bottom: none;
}

@media (max-width: 480px) {
  .detail-grid {
    grid-template-columns: 1fr;
  }
}
</style>
