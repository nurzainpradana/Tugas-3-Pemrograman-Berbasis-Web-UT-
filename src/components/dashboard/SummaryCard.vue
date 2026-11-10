<script setup>
// Mendefinisikan property yang diterima dari komponen induk
defineProps({
  // Judul atau nama informasi kartu
  title: {
    type: String,
    required: true,
  },

  // Nilai angka yang ditampilkan pada kartu
  value: {
    type: [String, Number],
    required: true,
  },

  // Nama ikon Bootstrap Icons
  icon: {
    type: String,
    required: true,
  },

  // Keterangan tambahan pada kartu
  description: {
    type: String,
    default: "",
  },

  // Warna latar belakang ikon
  color: {
    type: String,
    default: "#EAF1F5",
  },
});
</script>

<template>
  <!-- Komponen kartu ringkasan dashboard -->
  <div class="summary-card">
    <!-- Area ikon kartu -->
    <div class="summary-icon" :style="{ backgroundColor: color }">
      <i :class="icon"></i>
    </div>

    <!-- Area informasi kartu -->
    <div class="summary-info">
      <p>{{ title }}</p>

      <!-- Menampilkan nilai menggunakan v-text -->
      <h3 v-text="value"></h3>

      <!-- Menampilkan keterangan tambahan -->
      <small>{{ description }}</small>
    </div>
  </div>
</template>

<style scoped>
/**
defineProps() untuk menerima data dari komponen induk.

Artinya, kita cukup membuat satu komponen SummaryCard.vue, kemudian menggunakannya berkali-kali dengan nilai yang berbeda.
penerapan Vue Component dan Property.
*/

/* Mengatur tampilan utama kartu */
.summary-card {
  background: #ffffff;
  border: 1px solid #e8edf0;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  min-height: 120px;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}

/* Efek ketika kartu disentuh mouse */
.summary-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 18px rgba(58, 90, 115, 0.08);
}

/* Mengatur ikon */
.summary-icon {
  width: 48px;
  height: 48px;
  min-width: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3a5a73;
  font-size: 21px;
}

/* Mengatur teks judul */
.summary-info p {
  font-size: 12px;
  color: #84929e;
  margin-bottom: 5px;
}

/* Mengatur nilai utama */
.summary-info h3 {
  font-size: 25px;
  font-weight: 700;
  color: #3a5a73;
  margin-bottom: 3px;
}

/* Mengatur keterangan tambahan */
.summary-info small {
  font-size: 10px;
  color: #84929e;
}
</style>
