<script setup>
// Mengimpor ref untuk membuat data reaktif.
import { ref, computed, watch } from "vue";

// Mengimpor data referensi dari file JSON.
import { upbjjList, paketList, stokList, pengirimanList } from "../data";

// Mengimpor fungsi format mata uang Rupiah.
import { formatRupiah } from "../utils/formatter";

// Menyimpan daftar pesanan yang dibuat selama aplikasi berjalan.
const daftarPesanan = ref([]);

// Menyimpan data form pemesanan.
const form = ref({
  jenisPesanan: "satuan",
  kodePilihan: "",
  jumlah: 1,
  nama: "",
  nim: "",
  email: "",
  upbjj: "",
  alamat: "",
  kodePengiriman: "REG",
});

// Menyimpan pesan kesalahan validasi.
const errors = ref({});

// Menyimpan status keberhasilan pemesanan.
const pesananBerhasil = ref(false);

/* Menyimpan status apakah kursor sedang berada di informasi bahan ajar. */
const isItemHovered = ref(false);

/* Menangani event ketika mouse memasuki informasi bahan ajar. */
const handleMouseEnter = () => {
  isItemHovered.value = true;
};

/* Menangani event ketika mouse meninggalkan informasi bahan ajar. */
const handleMouseLeave = () => {
  isItemHovered.value = false;
};

/* Menangani tombol Enter pada input nama untuk memindahkan fokus. */
const handleEnterKey = (event) => {
  event.target.blur();
};
// Menyimpan nomor pesanan terakhir.
const nomorPesanan = ref("");

// Menyimpan tarif pengiriman simulasi.
// Tarif ini bukan berasal dari data JSON.
const tarifPengiriman = {
  REG: 15000,
  EXP: 30000,
};

// Mengambil data pilihan sesuai jenis pesanan.
const pilihanPesanan = computed(() => {
  if (form.value.jenisPesanan === "paket") {
    return paketList;
  }

  return stokList;
});

// Mengambil informasi bahan ajar atau paket yang dipilih.
const itemTerpilih = computed(() => {
  return (
    pilihanPesanan.value.find((item) => {
      return item.kode === form.value.kodePilihan;
    }) || null
  );
});

// Menghitung harga satuan atau harga paket.
const hargaSatuan = computed(() => {
  if (!itemTerpilih.value) return 0;

  return Number(itemTerpilih.value.harga || 0);
});

// Menghitung subtotal pesanan.
const subtotal = computed(() => {
  return hargaSatuan.value * Number(form.value.jumlah || 0);
});

// Menghitung ongkos kirim.
const ongkosKirim = computed(() => {
  return tarifPengiriman[form.value.kodePengiriman] || 0;
});

// Menghitung total pembayaran.
const totalPembayaran = computed(() => {
  return subtotal.value + ongkosKirim.value;
});

// Menentukan batas jumlah berdasarkan stok untuk pesanan satuan.
const batasStok = computed(() => {
  if (form.value.jenisPesanan !== "satuan" || !itemTerpilih.value) {
    return 999;
  }

  return Number(itemTerpilih.value.qty || 0);
});

// Mengawasi perubahan jenis pesanan.
// Pilihan sebelumnya akan direset ketika jenis pesanan berubah.
watch(
  () => form.value.jenisPesanan,
  () => {
    form.value.kodePilihan = "";
    form.value.jumlah = 1;
    errors.value.kodePilihan = "";
  },
);

// Mengawasi perubahan pilihan bahan ajar.
// Jumlah pesanan akan kembali menjadi satu ketika item berubah.
watch(
  () => form.value.kodePilihan,
  () => {
    form.value.jumlah = 1;
    errors.value.kodePilihan = "";
  },
);

// Mengawasi jumlah pesanan agar tidak melebihi stok tersedia.
watch(
  () => form.value.jumlah,
  (jumlah) => {
    if (form.value.jenisPesanan === "satuan" && itemTerpilih.value) {
      if (Number(jumlah) > batasStok.value) {
        form.value.jumlah = batasStok.value;
      }
    }

    if (Number(jumlah) < 1) {
      form.value.jumlah = 1;
    }
  },
);

// Mengambil nama pilihan berdasarkan kode.
const namaPilihan = computed(() => {
  if (!itemTerpilih.value) return "-";

  return itemTerpilih.value.nama || itemTerpilih.value.judul || "-";
});

// Memeriksa kelengkapan data form.
const validasiForm = () => {
  // Mengosongkan pesan kesalahan sebelumnya.
  errors.value = {};

  // Memeriksa nama pemesan.
  if (!form.value.nama.trim()) {
    errors.value.nama = "Nama pemesan wajib diisi.";
  }

  // Memeriksa NIM.
  if (!form.value.nim.trim()) {
    errors.value.nim = "NIM wajib diisi.";
  }

  // Memeriksa email.
  if (!form.value.email.trim()) {
    errors.value.email = "Email wajib diisi.";
  }

  // Memeriksa UPBJJ.
  if (!form.value.upbjj) {
    errors.value.upbjj = "Silakan pilih UPBJJ.";
  }

  // Memeriksa alamat pengiriman.
  if (!form.value.alamat.trim()) {
    errors.value.alamat = "Alamat pengiriman wajib diisi.";
  }

  // Memeriksa pilihan bahan ajar.
  if (!form.value.kodePilihan) {
    errors.value.kodePilihan = "Silakan pilih bahan ajar.";
  }

  // Memeriksa jumlah pesanan.
  if (Number(form.value.jumlah) < 1) {
    errors.value.jumlah = "Jumlah pesanan minimal satu.";
  }

  // Memeriksa ketersediaan stok untuk pesanan satuan.
  if (
    form.value.jenisPesanan === "satuan" &&
    itemTerpilih.value &&
    Number(form.value.jumlah) > batasStok.value
  ) {
    errors.value.jumlah = "Jumlah melebihi stok tersedia.";
  }

  // Mengembalikan status validasi.
  return Object.keys(errors.value).length === 0;
};

// Memproses pesanan ketika form dikirim.
const prosesPesanan = () => {
  // Menghentikan proses jika validasi gagal.
  if (!validasiForm()) return;

  // Membuat nomor pesanan sederhana.
  const nomorUrut = String(daftarPesanan.value.length + 1).padStart(4, "0");
  nomorPesanan.value = `DO2026-${nomorUrut}`;

  // Menyimpan salinan data pesanan.
  const pesananBaru = {
    nomor: nomorPesanan.value,
    tanggal: new Date().toISOString().slice(0, 10),
    nama: form.value.nama,
    nim: form.value.nim,
    email: form.value.email,
    upbjj: form.value.upbjj,
    alamat: form.value.alamat,
    jenisPesanan: form.value.jenisPesanan,
    kodePilihan: form.value.kodePilihan,
    namaPilihan: namaPilihan.value,
    jumlah: Number(form.value.jumlah),
    pengiriman: form.value.kodePengiriman,
    subtotal: subtotal.value,
    ongkosKirim: ongkosKirim.value,
    total: totalPembayaran.value,
  };

  // Menambahkan pesanan ke daftar pesanan lokal.
  daftarPesanan.value.push(pesananBaru);

  // Menampilkan informasi pesanan berhasil.
  pesananBerhasil.value = true;
};

// Menutup informasi pesanan berhasil.
const tutupBerhasil = () => {
  pesananBerhasil.value = false;
};

// Mengosongkan form pemesanan.
const resetForm = () => {
  form.value = {
    jenisPesanan: "satuan",
    kodePilihan: "",
    jumlah: 1,
    nama: "",
    nim: "",
    email: "",
    upbjj: "",
    alamat: "",
    kodePengiriman: "REG",
  };

  // Menghapus seluruh pesan kesalahan.
  errors.value = {};
};
</script>

<template>
  <div class="order-page">
    <!-- Judul halaman pemesanan -->
    <div class="page-heading mb-4">
      <div>
        <h3 class="fw-bold mb-1">Pemesanan Bahan Ajar</h3>
        <p class="text-muted mb-0">
          Formulir pemesanan bahan ajar Universitas Terbuka.
        </p>
      </div>
    </div>

    <div class="row g-4">
      <!-- Kolom formulir pemesanan -->
      <div class="col-lg-8">
        <div class="card dashboard-card">
          <div class="card-header bg-white border-0 pt-4 px-4">
            <h5 class="fw-bold mb-1">Informasi Pemesanan</h5>
            <p class="text-muted small mb-0">
              Lengkapi informasi berikut untuk membuat pesanan.
            </p>
          </div>

          <div class="card-body p-4">
            <form @submit.prevent="prosesPesanan">
              <!-- Pilihan jenis pesanan -->
              <div class="mb-4">
                <label class="form-label fw-semibold"> Jenis Pesanan </label>

                <div class="d-flex gap-3 flex-wrap">
                  <label class="order-type-option">
                    <input
                      type="radio"
                      v-model="form.jenisPesanan"
                      value="satuan"
                    />
                    <span>Bahan Ajar Satuan</span>
                  </label>

                  <label class="order-type-option">
                    <input
                      type="radio"
                      v-model="form.jenisPesanan"
                      value="paket"
                    />
                    <span>Paket Bahan Ajar</span>
                  </label>
                </div>
              </div>

              <!-- Pilihan bahan ajar atau paket -->
              <div class="mb-3">
                <label class="form-label fw-semibold">
                  {{
                    form.jenisPesanan === "paket"
                      ? "Pilih Paket"
                      : "Pilih Bahan Ajar"
                  }}
                </label>

                <select
                  class="form-select"
                  v-model="form.kodePilihan"
                  :class="{ 'is-invalid': errors.kodePilihan }"
                >
                  <option value="">-- Pilih --</option>

                  <option
                    v-for="item in pilihanPesanan"
                    :key="item.kode"
                    :value="item.kode"
                  >
                    {{ item.kode }} -
                    {{ item.nama || item.judul }}
                  </option>
                </select>

                <div class="invalid-feedback">
                  {{ errors.kodePilihan }}
                </div>
              </div>

              <!-- Informasi bahan ajar yang dipilih -->
              <!--
                @mouseenter menjalankan handleMouseEnter.
                @mouseleave menjalankan handleMouseLeave.
                :class mengubah class CSS berdasarkan kondisi isItemHovered.
            -->
              <div
                v-if="itemTerpilih"
                class="selected-item-info mb-3"
                :class="{ 'selected-item-hover': isItemHovered }"
                @mouseenter="handleMouseEnter"
                @mouseleave="handleMouseLeave"
              >
                <div class="d-flex justify-content-between">
                  <div>
                    <div class="fw-bold">{{ namaPilihan }}</div>
                    <small class="text-muted">
                      {{ itemTerpilih.kode }}
                    </small>
                  </div>

                  <div class="text-end">
                    <div class="fw-bold text-primary">
                      {{ formatRupiah(hargaSatuan) }}
                    </div>

                    <small
                      v-if="form.jenisPesanan === 'satuan'"
                      class="text-muted"
                    >
                      Stok: {{ itemTerpilih.qty }}
                    </small>
                  </div>
                </div>
              </div>

              <!-- Jumlah pesanan -->
              <div class="mb-4">
                <label class="form-label fw-semibold"> Jumlah Pesanan </label>

                <input
                  type="number"
                  class="form-control"
                  v-model.number="form.jumlah"
                  min="1"
                  :max="batasStok"
                  :class="{ 'is-invalid': errors.jumlah }"
                />

                <div class="invalid-feedback">
                  {{ errors.jumlah }}
                </div>

                <small
                  v-if="form.jenisPesanan === 'satuan' && itemTerpilih"
                  class="text-muted"
                >
                  Maksimal pemesanan {{ batasStok }} unit.
                </small>
              </div>

              <hr class="my-4" />

              <!-- Informasi pemesan -->
              <h6 class="fw-bold mb-3">Data Pemesan</h6>

              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label">Nama Lengkap</label>
                  <input
                    type="text"
                    class="form-control"
                    v-model.trim="form.nama"
                    :class="{ 'is-invalid': errors.nama }"
                    placeholder="Masukkan nama lengkap"
                    @keyup.enter="handleEnterKey"
                  />
                  <div class="invalid-feedback">{{ errors.nama }}</div>
                </div>

                <div class="col-md-6">
                  <label class="form-label">NIM</label>
                  <input
                    type="text"
                    class="form-control"
                    v-model.trim="form.nim"
                    :class="{ 'is-invalid': errors.nim }"
                    placeholder="Masukkan NIM"
                  />
                  <div class="invalid-feedback">{{ errors.nim }}</div>
                </div>

                <div class="col-12">
                  <label class="form-label">Email</label>
                  <input
                    type="email"
                    class="form-control"
                    v-model.trim="form.email"
                    :class="{ 'is-invalid': errors.email }"
                    placeholder="nama@email.com"
                  />
                  <div class="invalid-feedback">{{ errors.email }}</div>
                </div>

                <div class="col-md-6">
                  <label class="form-label">UPBJJ</label>
                  <select
                    class="form-select"
                    v-model="form.upbjj"
                    :class="{ 'is-invalid': errors.upbjj }"
                  >
                    <option value="">-- Pilih UPBJJ --</option>

                    <option
                      v-for="upbjj in upbjjList"
                      :key="upbjj"
                      :value="upbjj"
                    >
                      {{ upbjj }}
                    </option>
                  </select>
                  <div class="invalid-feedback">{{ errors.upbjj }}</div>
                </div>

                <div class="col-md-6">
                  <label class="form-label">Jasa Pengiriman</label>
                  <select class="form-select" v-model="form.kodePengiriman">
                    <option
                      v-for="pengiriman in pengirimanList"
                      :key="pengiriman.kode"
                      :value="pengiriman.kode"
                    >
                      {{ pengiriman.nama }}
                    </option>
                  </select>
                </div>

                <div class="col-12">
                  <label class="form-label">Alamat Pengiriman</label>
                  <textarea
                    class="form-control"
                    rows="3"
                    v-model.trim="form.alamat"
                    :class="{ 'is-invalid': errors.alamat }"
                    placeholder="Masukkan alamat lengkap"
                  ></textarea>
                  <div class="invalid-feedback">{{ errors.alamat }}</div>
                </div>
              </div>

              <!-- Tombol aksi form -->
              <div class="d-flex justify-content-end gap-2 mt-4">
                <button type="button" class="btn btn-light" @click="resetForm">
                  <i class="bi bi-arrow-counterclockwise me-1"></i>
                  Reset
                </button>

                <button
                  type="submit"
                  class="btn btn-primary"
                  :disabled="!itemTerpilih"
                >
                  <i class="bi bi-check-circle me-1"></i>
                  Buat Pesanan
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Kolom ringkasan pembayaran -->
      <div class="col-lg-4">
        <div class="card dashboard-card order-summary-card">
          <div class="card-header bg-white border-0 pt-4 px-4">
            <h5 class="fw-bold mb-0">Ringkasan Pesanan</h5>
          </div>

          <div class="card-body p-4">
            <div class="summary-line">
              <span>Jenis Pesanan</span>
              <strong>
                {{ form.jenisPesanan === "paket" ? "Paket" : "Satuan" }}
              </strong>
            </div>

            <div class="summary-line">
              <span>Nama Bahan Ajar</span>
              <strong class="text-end">
                {{ namaPilihan }}
              </strong>
            </div>

            <div class="summary-line">
              <span>Jumlah</span>
              <strong>{{ form.jumlah }}</strong>
            </div>

            <div class="summary-line">
              <span>Subtotal</span>
              <strong>{{ formatRupiah(subtotal) }}</strong>
            </div>

            <div class="summary-line">
              <span>Ongkos Kirim</span>
              <strong>{{ formatRupiah(ongkosKirim) }}</strong>
            </div>

            <hr />

            <div class="summary-total">
              <span>Total Pembayaran</span>
              <h4 class="fw-bold text-primary mb-0">
                {{ formatRupiah(totalPembayaran) }}
              </h4>
            </div>

            <!-- Informasi tarif pengiriman simulasi -->
            <div class="alert alert-info small mt-4 mb-0">
              <i class="bi bi-info-circle me-1"></i>
              Ongkos kirim pada aplikasi ini menggunakan tarif simulasi.
            </div>
          </div>
        </div>

        <!-- Informasi jumlah pesanan yang dibuat -->
        <div class="card dashboard-card mt-3">
          <div class="card-body p-4">
            <div class="d-flex align-items-center gap-3">
              <div class="summary-icon">
                <i class="bi bi-cart-check"></i>
              </div>

              <div>
                <div class="text-muted small">Pesanan dibuat</div>
                <h4 class="fw-bold mb-0">
                  {{ daftarPesanan.length }}
                </h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Notifikasi pesanan berhasil -->
    <div
      v-if="pesananBerhasil"
      class="order-success-overlay"
      @click.self="tutupBerhasil"
      @keydown.esc.window="tutupBerhasil"
    >
      <div class="order-success-modal">
        <div class="success-icon">
          <i class="bi bi-check-lg"></i>
        </div>

        <h5 class="fw-bold">Pesanan Berhasil Dibuat</h5>

        <p class="text-muted">
          Nomor pesanan:
          <strong>{{ nomorPesanan }}</strong>
        </p>

        <p class="small text-muted">
          Total pembayaran {{ formatRupiah(totalPembayaran) }}
        </p>

        <button class="btn btn-primary w-100" @click="tutupBerhasil">
          Selesai
        </button>
      </div>
    </div>
  </div>
</template>
