export interface BogorCommodity {
  id: number;
  no: number;
  name: string;
  category: string;
  subCategory: string;
  price: number;
  unit: string;
  svg: string;
  featuredHero: boolean;
  isPrimaryStaple: boolean;
  url: string;
  change?: number;
  heroPos?: { top?: string; left?: string; right?: string; bottom?: string; rotate?: string };
}

export const BOGOR_COMMODITIES: BogorCommodity[] = [
  { id: 1, no: 1, name: "Beras Termurah", category: "BERAS & POKOK", subCategory: "BERAS", price: 12500, unit: "kg", svg: "rice", featuredHero: false, isPrimaryStaple: false, url: "https://pasarpakuanjaya.co.id/komoditi/detail/46" },
  { id: 2, no: 2, name: "Beras Medium", category: "BERAS & POKOK", subCategory: "BERAS", price: 13500, unit: "kg", svg: "rice", featuredHero: true, isPrimaryStaple: true, url: "https://pasarpakuanjaya.co.id/komoditas/index/view-all", heroPos: {"top":"13%","left":"4%"} },
  { id: 3, no: 3, name: "Beras Premium", category: "BERAS & POKOK", subCategory: "BERAS", price: 16000, unit: "kg", svg: "rice", featuredHero: false, isPrimaryStaple: false, url: "https://pasarpakuanjaya.co.id/komoditas/index/view-all" },
  { id: 11, no: 11, name: "Jagung Pipilan", category: "BERAS & POKOK", subCategory: "JAGUNG", price: 8000, unit: "kg", svg: "rice", featuredHero: false, isPrimaryStaple: false, url: "https://pasarpakuanjaya.co.id/komoditas/index/view-all" },
  { id: 12, no: 12, name: "Kedelai Biji Kering", category: "BERAS & POKOK", subCategory: "KEDELAI", price: 13000, unit: "kg", svg: "rice", featuredHero: false, isPrimaryStaple: false, url: "https://pasarpakuanjaya.co.id/komoditas/index/view-all" },
  { id: 13, no: 13, name: "Tempe Besar", category: "BERAS & POKOK", subCategory: "KEDELAI", price: 8000, unit: "papan", svg: "rice", featuredHero: false, isPrimaryStaple: false, url: "https://pasarpakuanjaya.co.id/komoditas/index/view-all" },
  { id: 14, no: 14, name: "Tempe Kecil", category: "BERAS & POKOK", subCategory: "KEDELAI", price: 6000, unit: "papan", svg: "rice", featuredHero: false, isPrimaryStaple: false, url: "https://pasarpakuanjaya.co.id/komoditas/index/view-all" },
  { id: 8, no: 8, name: "Minyak Goreng Kemasan", category: "MINYAK & GULA", subCategory: "MINYAK", price: 16000, unit: "liter", svg: "oil", featuredHero: false, isPrimaryStaple: true, url: "https://pasarpakuanjaya.co.id/komoditas/index/view-all" },
  { id: 9, no: 9, name: "Minyak Goreng Kemasan Premium", category: "MINYAK & GULA", subCategory: "MINYAK", price: 22000, unit: "liter", svg: "oil", featuredHero: false, isPrimaryStaple: false, url: "https://pasarpakuanjaya.co.id/komoditas/index/view-all" },
  { id: 10, no: 10, name: "Minyak Goreng Curah", category: "MINYAK & GULA", subCategory: "MINYAK", price: 22000, unit: "liter", svg: "oil", featuredHero: false, isPrimaryStaple: false, url: "https://pasarpakuanjaya.co.id/komoditas/index/view-all" },
  { id: 15, no: 15, name: "Susu Kental Manis (SKM)", category: "MINYAK & GULA", subCategory: "SUSU", price: 11000, unit: "kaleng", svg: "oil", featuredHero: false, isPrimaryStaple: false, url: "https://pasarpakuanjaya.co.id/komoditas/index/view-all" },
  { id: 48, no: 48, name: "Gula Pasir Lokal / Curah", category: "MINYAK & GULA", subCategory: "GULA", price: 18500, unit: "kg", svg: "oil", featuredHero: false, isPrimaryStaple: false, url: "https://pasarpakuanjaya.co.id/komoditas/index/view-all" },
  { id: 49, no: 49, name: "Gula Kemasan", category: "MINYAK & GULA", subCategory: "GULA", price: 16000, unit: "kg", svg: "oil", featuredHero: false, isPrimaryStaple: false, url: "https://pasarpakuanjaya.co.id/komoditas/index/view-all" },
  { id: 50, no: 50, name: "Tepung Terigu", category: "MINYAK & GULA", subCategory: "BARANG LAINNYA", price: 12000, unit: "kg", svg: "rice", featuredHero: false, isPrimaryStaple: false, url: "https://pasarpakuanjaya.co.id/komoditas/index/view-all" },
  { id: 51, no: 51, name: "Mentega", category: "MINYAK & GULA", subCategory: "BARANG LAINNYA", price: 18000, unit: "bungkus", svg: "oil", featuredHero: false, isPrimaryStaple: false, url: "https://pasarpakuanjaya.co.id/komoditas/index/view-all" },
  { id: 52, no: 52, name: "Garam Beryodium", category: "MINYAK & GULA", subCategory: "GARAM", price: 1500, unit: "bungkus", svg: "oil", featuredHero: false, isPrimaryStaple: false, url: "https://pasarpakuanjaya.co.id/komoditas/index/view-all" },
  { id: 16, no: 16, name: "Bawang Merah", category: "SAYURAN", subCategory: "SAYURAN", price: 35000, unit: "kg", svg: "shallot", featuredHero: true, isPrimaryStaple: true, url: "https://pasarpakuanjaya.co.id/komoditi/detail/64", heroPos: {"top":"13%","right":"4%"} },
  { id: 17, no: 17, name: "Bawang Putih", category: "SAYURAN", subCategory: "SAYURAN", price: 35000, unit: "kg", svg: "garlic", featuredHero: false, isPrimaryStaple: false, url: "https://pasarpakuanjaya.co.id/komoditas/index/view-all" },
  { id: 18, no: 18, name: "Bawang Putih Kating", category: "SAYURAN", subCategory: "SAYURAN", price: 40000, unit: "kg", svg: "garlic", featuredHero: false, isPrimaryStaple: false, url: "https://pasarpakuanjaya.co.id/komoditas/index/view-all" },
  { id: 19, no: 19, name: "Cabe Merah Keriting", category: "SAYURAN", subCategory: "SAYURAN", price: 80000, unit: "kg", svg: "chili", featuredHero: false, isPrimaryStaple: false, url: "https://pasarpakuanjaya.co.id/komoditas/index/view-all" },
  { id: 20, no: 20, name: "Cabe Merah Teropong", category: "SAYURAN", subCategory: "SAYURAN", price: 35000, unit: "kg", svg: "chili", featuredHero: false, isPrimaryStaple: false, url: "https://pasarpakuanjaya.co.id/komoditas/index/view-all" },
  { id: 21, no: 21, name: "Cabe Rawit Merah", category: "SAYURAN", subCategory: "SAYURAN", price: 80000, unit: "kg", svg: "chili", featuredHero: true, isPrimaryStaple: true, url: "https://pasarpakuanjaya.co.id/komoditi/detail/69/pasar/4", heroPos: {"top":"42%","left":"3%"} },
  { id: 22, no: 22, name: "Cabe Rawit Hijau", category: "SAYURAN", subCategory: "SAYURAN", price: 50000, unit: "kg", svg: "greenChili", featuredHero: false, isPrimaryStaple: false, url: "https://pasarpakuanjaya.co.id/komoditas/index/view-all" },
  { id: 23, no: 23, name: "Bayam", category: "SAYURAN", subCategory: "SAYURAN", price: 3000, unit: "ikat", svg: "leafy", featuredHero: true, isPrimaryStaple: false, url: "https://pasarpakuanjaya.co.id/komoditas/index/view-all", heroPos: {"bottom":"13%","left":"5%"} },
  { id: 24, no: 24, name: "Kangkung", category: "SAYURAN", subCategory: "SAYURAN", price: 3000, unit: "ikat", svg: "leafy", featuredHero: false, isPrimaryStaple: false, url: "https://pasarpakuanjaya.co.id/komoditas/index/view-all" },
  { id: 25, no: 25, name: "Kol", category: "SAYURAN", subCategory: "SAYURAN", price: 11000, unit: "kg", svg: "leafy", featuredHero: false, isPrimaryStaple: false, url: "https://pasarpakuanjaya.co.id/komoditas/index/view-all" },
  { id: 26, no: 26, name: "Sawi Putih", category: "SAYURAN", subCategory: "SAYURAN", price: 10000, unit: "kg", svg: "leafy", featuredHero: false, isPrimaryStaple: false, url: "https://pasarpakuanjaya.co.id/komoditas/index/view-all" },
  { id: 27, no: 27, name: "Sawi Hijau", category: "SAYURAN", subCategory: "SAYURAN", price: 10000, unit: "kg", svg: "leafy", featuredHero: false, isPrimaryStaple: false, url: "https://pasarpakuanjaya.co.id/komoditas/index/view-all" },
  { id: 28, no: 28, name: "Buncis", category: "SAYURAN", subCategory: "SAYURAN", price: 20000, unit: "kg", svg: "leafy", featuredHero: false, isPrimaryStaple: false, url: "https://pasarpakuanjaya.co.id/komoditas/index/view-all" },
  { id: 29, no: 29, name: "Kacang Panjang", category: "SAYURAN", subCategory: "SAYURAN", price: 14000, unit: "kg", svg: "leafy", featuredHero: false, isPrimaryStaple: false, url: "https://pasarpakuanjaya.co.id/komoditas/index/view-all" },
  { id: 30, no: 30, name: "Wortel", category: "SAYURAN", subCategory: "SAYURAN", price: 8000, unit: "kg", svg: "carrot", featuredHero: true, isPrimaryStaple: false, url: "https://pasarpakuanjaya.co.id/komoditi/detail/78/pasar/4", heroPos: {"top":"42%","right":"3%"} },
  { id: 31, no: 31, name: "Ketimun", category: "SAYURAN", subCategory: "SAYURAN", price: 10000, unit: "kg", svg: "leafy", featuredHero: false, isPrimaryStaple: false, url: "https://pasarpakuanjaya.co.id/komoditas/index/view-all" },
  { id: 32, no: 32, name: "Toge", category: "SAYURAN", subCategory: "SAYURAN", price: 12000, unit: "kg", svg: "leafy", featuredHero: false, isPrimaryStaple: false, url: "https://pasarpakuanjaya.co.id/komoditas/index/view-all" },
  { id: 33, no: 33, name: "Labu Siam", category: "SAYURAN", subCategory: "SAYURAN", price: 12000, unit: "kg", svg: "leafy", featuredHero: false, isPrimaryStaple: false, url: "https://pasarpakuanjaya.co.id/komoditas/index/view-all" },
  { id: 34, no: 34, name: "Nangka Muda", category: "SAYURAN", subCategory: "SAYURAN", price: 15000, unit: "kg", svg: "fruit", featuredHero: false, isPrimaryStaple: false, url: "https://pasarpakuanjaya.co.id/komoditas/index/view-all" },
  { id: 35, no: 35, name: "Jengkol", category: "SAYURAN", subCategory: "SAYURAN", price: 40000, unit: "kg", svg: "shallot", featuredHero: false, isPrimaryStaple: false, url: "https://pasarpakuanjaya.co.id/komoditas/index/view-all" },
  { id: 36, no: 36, name: "Daun Singkong", category: "SAYURAN", subCategory: "SAYURAN", price: 2000, unit: "ikat", svg: "leafy", featuredHero: false, isPrimaryStaple: false, url: "https://pasarpakuanjaya.co.id/komoditas/index/view-all" },
  { id: 39, no: 39, name: "Cabe Hijau", category: "SAYURAN", subCategory: "SAYURAN", price: 45000, unit: "kg", svg: "greenChili", featuredHero: false, isPrimaryStaple: false, url: "https://pasarpakuanjaya.co.id/komoditas/index/view-all" },
  { id: 40, no: 40, name: "Bawang Bombay", category: "SAYURAN", subCategory: "SAYURAN", price: 35000, unit: "kg", svg: "shallot", featuredHero: false, isPrimaryStaple: false, url: "https://pasarpakuanjaya.co.id/komoditas/index/view-all" },
  { id: 41, no: 41, name: "Tomat", category: "SAYURAN", subCategory: "SAYURAN", price: 30000, unit: "kg", svg: "tomato", featuredHero: true, isPrimaryStaple: false, url: "https://pasarpakuanjaya.co.id/komoditas/index/view-all", heroPos: {"bottom":"13%","right":"5%"} },
  { id: 42, no: 42, name: "Tomat Kecil", category: "SAYURAN", subCategory: "SAYURAN", price: 30000, unit: "kg", svg: "tomato", featuredHero: false, isPrimaryStaple: false, url: "https://pasarpakuanjaya.co.id/komoditas/index/view-all" },
  { id: 43, no: 43, name: "Daging Sapi Murni", category: "DAGING & TELUR", subCategory: "DAGING", price: 150000, unit: "kg", svg: "meat", featuredHero: false, isPrimaryStaple: true, url: "https://pasarpakuanjaya.co.id/komoditas/index/view-all" },
  { id: 44, no: 44, name: "Daging Ayam", category: "DAGING & TELUR", subCategory: "DAGING", price: 42000, unit: "kg", svg: "meat", featuredHero: false, isPrimaryStaple: false, url: "https://pasarpakuanjaya.co.id/komoditas/index/view-all" },
  { id: 45, no: 45, name: "Daging Ayam Kampung", category: "DAGING & TELUR", subCategory: "DAGING", price: 70000, unit: "ekor", svg: "meat", featuredHero: false, isPrimaryStaple: false, url: "https://pasarpakuanjaya.co.id/komoditas/index/view-all" },
  { id: 46, no: 46, name: "Telur Ayam Ras", category: "DAGING & TELUR", subCategory: "TELUR", price: 24000, unit: "kg", svg: "egg", featuredHero: false, isPrimaryStaple: false, url: "https://pasarpakuanjaya.co.id/komoditas/index/view-all" },
  { id: 47, no: 47, name: "Telur Ayam Kampung", category: "DAGING & TELUR", subCategory: "TELUR", price: 2000, unit: "butir", svg: "egg", featuredHero: false, isPrimaryStaple: false, url: "https://pasarpakuanjaya.co.id/komoditas/index/view-all" },
  { id: 53, no: 53, name: "Jeruk", category: "BUAH", subCategory: "BUAH", price: 20000, unit: "kg", svg: "fruit", featuredHero: false, isPrimaryStaple: false, url: "https://pasarpakuanjaya.co.id/komoditas/index/view-all" },
  { id: 54, no: 54, name: "Pisang Ambon", category: "BUAH", subCategory: "BUAH", price: 25000, unit: "sisir", svg: "fruit", featuredHero: false, isPrimaryStaple: false, url: "https://pasarpakuanjaya.co.id/komoditas/index/view-all" },
  { id: 55, no: 55, name: "Pepaya", category: "BUAH", subCategory: "BUAH", price: 13000, unit: "buah", svg: "fruit", featuredHero: false, isPrimaryStaple: false, url: "https://pasarpakuanjaya.co.id/komoditas/index/view-all" },
  { id: 56, no: 56, name: "Semangka", category: "BUAH", subCategory: "BUAH", price: 10000, unit: "kg", svg: "fruit", featuredHero: false, isPrimaryStaple: false, url: "https://pasarpakuanjaya.co.id/komoditas/index/view-all" },
  { id: 57, no: 57, name: "Ikan Kembung", category: "IKAN SEGAR", subCategory: "Ikan Segar", price: 50000, unit: "kg", svg: "fish", featuredHero: false, isPrimaryStaple: false, url: "https://pasarpakuanjaya.co.id/komoditas/index/view-all" },
  { id: 58, no: 58, name: "Ikan Tuna", category: "IKAN SEGAR", subCategory: "Ikan Segar", price: 60000, unit: "kg", svg: "fish", featuredHero: false, isPrimaryStaple: false, url: "https://pasarpakuanjaya.co.id/komoditas/index/view-all" },
  { id: 59, no: 59, name: "Ikan Tongkol", category: "IKAN SEGAR", subCategory: "Ikan Segar", price: 25000, unit: "kg", svg: "fish", featuredHero: false, isPrimaryStaple: false, url: "https://pasarpakuanjaya.co.id/komoditas/index/view-all" },
];
