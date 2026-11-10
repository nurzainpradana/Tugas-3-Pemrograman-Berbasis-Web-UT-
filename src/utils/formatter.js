// Fungsi untuk mengubah angka menjadi format mata uang Rupiah
export const formatRupiah = (value) => {
  // Memastikan nilai yang diterima berupa angka
  const amount = Number(value) || 0;

  // Mengembalikan nilai dalam format Rupiah
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Fungsi untuk mengubah tanggal menjadi format Indonesia
export const formatTanggal = (value) => {
  // Mengembalikan tanda strip jika tanggal kosong
  if (!value) return "-";

  // Mengubah string tanggal menjadi objek Date
  const date = new Date(value);

  // Memastikan tanggal valid
  if (Number.isNaN(date.getTime())) return "-";

  // Mengembalikan tanggal dalam format Indonesia
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
};
/** 
 * fungsi formatRupiah() nantinya akan digunakan untuk menampilkan harga bahan ajar, 
 * sedangkan formatTanggal() dapat digunakan pada halaman tracking.
 */