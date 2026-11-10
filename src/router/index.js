// Mengimpor fungsi untuk membuat router dan menentukan jenis navigasi
import { createRouter, createWebHistory } from "vue-router";

// Mengimpor seluruh halaman aplikasi
import DashboardView from "../views/DashboardView.vue";
import StockView from "../views/StockView.vue";
import OrderView from "../views/OrderView.vue";
import TrackingView from "../views/TrackingView.vue";

// Mendefinisikan daftar halaman dan alamat URL aplikasi
const routes = [
  {
    path: "/",
    name: "Dashboard",
    component: DashboardView,
    meta: { title: "Dashboard" },
  },
  {
    path: "/stok",
    name: "Stock",
    component: StockView,
    meta: { title: "Stok Bahan Ajar" },
  },
  {
    path: "/pemesanan",
    name: "Order",
    component: OrderView,
    meta: { title: "Pemesanan Bahan Ajar" },
  },
  {
    path: "/tracking",
    name: "Tracking",
    component: TrackingView,
    meta: { title: "Tracking Pengiriman" },
  },
];

// Membuat instance Vue Router menggunakan HTML5 History Mode
const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Mengekspor router agar dapat digunakan oleh aplikasi utama
export default router;

/**
createRouter() membuat konfigurasi navigasi.

createWebHistory() membuat URL halaman tanpa tanda pagar.

routes berisi daftar halaman yang tersedia.

component menentukan file Vue yang ditampilkan.

meta.title menyimpan judul halaman yang nantinya digunakan Navbar.
 */
