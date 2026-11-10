
// Mengimpor fungsi untuk membuat aplikasi Vue.
import { createApp } from 'vue'

// Mengimpor Bootstrap CSS.
import 'bootstrap/dist/css/bootstrap.min.css'

// Mengimpor Bootstrap Icons.
import 'bootstrap-icons/font/bootstrap-icons.css'

// Mengimpor Bootstrap JavaScript.
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

// Mengimpor CSS utama dashboard SITTA.
import './assets/css/style.css'

// Mengimpor komponen utama aplikasi.
import App from './App.vue'

// Mengimpor konfigurasi Vue Router.
import router from './router'

// Membuat instance aplikasi Vue.
const app = createApp(App)

// Mengaktifkan Vue Router.
app.use(router)

// Menampilkan aplikasi pada elemen HTML dengan ID app.
app.mount('#app')
