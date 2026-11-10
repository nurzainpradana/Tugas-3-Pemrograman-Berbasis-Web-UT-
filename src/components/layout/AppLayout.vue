
<script setup>
//import: Memanggil komponen Sidebar dan Navbar.
import AppSidebar from './AppSidebar.vue'
import AppNavbar from './AppNavbar.vue'

/**
<AppSidebar />: Menampilkan menu navigasi.
<AppNavbar />: Menampilkan header aplikasi.

<slot />: Menyediakan tempat untuk konten halaman yang nantinya berubah sesuai menu.
 */
</script>

<template>
  <div class="app-container">
    <AppSidebar />

    <main class="main-content">
      <AppNavbar />

      <section class="content-wrapper">
        <slot />
      </section>
    </main>
  </div>
  
</template>

