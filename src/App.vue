
<script setup>
// Mengimpor layout utama aplikasi
import AppLayout from './components/layout/AppLayout.vue'
</script>

<template>
  <!-- Menggunakan layout utama sebagai kerangka aplikasi -->
  <AppLayout>

    <!-- Menampilkan halaman sesuai URL yang sedang dibuka -->
    <RouterView />

  </AppLayout>
</template>
