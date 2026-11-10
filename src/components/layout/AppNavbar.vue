 <script setup>
// Mengimpor useRoute untuk membaca informasi halaman aktif
import { useRoute } from 'vue-router'

// Mengambil informasi route yang sedang aktif
const route = useRoute()
</script>

<template>
  <!-- Navbar bagian atas -->
  <header class="top-navbar">

    <!-- Judul halaman mengikuti metadata Vue Router -->
    <div>
      <h5 class="page-title">
        {{ route.meta.title }}
      </h5>

      <small class="text-muted">
        Sistem Informasi Tiras dan Transaksi Bahan Ajar
      </small>
    </div>

    <!-- Bagian aksi dan profil pengguna -->
    <div class="navbar-actions">

      <!-- Tombol notifikasi -->
      <button class="btn-icon">
        <i class="bi bi-bell"></i>
      </button>

      <!-- Garis pemisah -->
      <div class="navbar-divider"></div>

      <!-- Informasi profil administrator -->
      <div class="profile-info">
        <div class="profile-avatar">AD</div>

        <div>
          <strong>Administrator</strong>
          <small>Admin</small>
        </div>
      </div>

    </div>
  </header>
</template>
