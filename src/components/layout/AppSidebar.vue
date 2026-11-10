
<template>
  <!-- Sidebar utama aplikasi -->
  <aside class="sidebar">

    <!-- Identitas aplikasi -->
    <div class="sidebar-brand">
      <div class="brand-icon">
        <i class="bi bi-book-half"></i>
      </div>

      <div>
        <h5>SITTA</h5>
        <small>Universitas Terbuka</small>
      </div>
    </div>

    <!-- Judul kelompok menu -->
    <div class="sidebar-label">MENU UTAMA</div>

    <!-- Navigasi menggunakan Vue Router -->
    <nav class="sidebar-menu">

      <!-- Menu Dashboard -->
      <RouterLink
        to="/"
        class="menu-item"
        exact-active-class="active"
      >
        <i class="bi bi-grid-1x2"></i>
        <span>Dashboard</span>
      </RouterLink>

      <!-- Menu Stok Bahan Ajar -->
      <RouterLink
        to="/stok"
        class="menu-item"
        active-class="active"
      >
        <i class="bi bi-box-seam"></i>
        <span>Stok Bahan Ajar</span>
      </RouterLink>

      <!-- Menu Pemesanan -->
      <RouterLink
        to="/pemesanan"
        class="menu-item"
        active-class="active"
      >
        <i class="bi bi-cart3"></i>
        <span>Pemesanan</span>
      </RouterLink>

      <!-- Menu Tracking Pengiriman -->
      <RouterLink
        to="/tracking"
        class="menu-item"
        active-class="active"
      >
        <i class="bi bi-truck"></i>
        <span>Tracking Pengiriman</span>
      </RouterLink>

    </nav>

    <!-- Informasi administrator -->
    <div class="sidebar-footer">
      <div class="user-avatar">AD</div>

      <div>
        <strong>Administrator</strong>
        <small>Admin SITTA</small>
      </div>

      <i class="bi bi-three-dots ms-auto"></i>
    </div>

  </aside>
</template>
