/**
 * Supaya setiap halaman tidak perlu melakukan import JSON secara berulang dengan penulisan yang berbeda-beda.
 * 
 * jika ingin mengambil data stok pada halaman tertentu, cukup menggunakan:
 * Import { stokList } from '@/data'
 */
// Mengimpor seluruh data dari file JSON
import dataBahanAjar from './dataBahanAjar.json'

// Mengekspor data utama agar dapat digunakan oleh komponen Vue
export const dataSITTA = dataBahanAjar

// Mengekspor daftar UPBJJ
export const upbjjList = dataBahanAjar.upbjjList

// Mengekspor daftar kategori bahan ajar
export const kategoriList = dataBahanAjar.kategoriList

// Mengekspor pilihan metode pengiriman
export const pengirimanList = dataBahanAjar.pengirimanList

// Mengekspor daftar paket bahan ajar
export const paketList = dataBahanAjar.paket

// Mengekspor daftar stok bahan ajar
export const stokList = dataBahanAjar.stok

// Mengekspor data tracking pengiriman
export const trackingList = dataBahanAjar.tracking
