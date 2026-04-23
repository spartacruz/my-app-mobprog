# Ringkasan Sistem

## 1) Sistem ini tentang apa
Aplikasi mobile berbasis Expo (React Native) untuk tugas kelompok. Fungsinya utama:
- Menampilkan halaman Home yang merangkum tugas mingguan kelompok.
- Menyediakan daftar profil anggota dan detail profil (termasuk video YouTube).
- Menyediakan kalkulator bangun datar/ruang sederhana.
- Menyediakan menu Quesioner dan Polling (implementasi masih placeholder).

## 2) Implementasi saat ini
- Teknologi: Expo + React Native + Expo Router (file-based routing).
- Navigasi: Tab bar untuk Home dan Explore, plus Stack untuk modal dan halaman lain.
- Home: menautkan ke Profile, Kalkulator, Quesioner/Polling.
- Profil: daftar kartu anggota -> detail profil berdasarkan parameter `id`.
- Detail profil: data statis di file, menampilkan informasi, hobi, dan embed YouTube lewat WebView.
- Kalkulator: 4 layar terpisah untuk menghitung luas/volume dengan input numeric sederhana.
- Quesioner/Polling: baru berupa menu dan dua file placeholder berisi instruksi (belum ada UI/logic).

## 3) Struktur sistem
- app/                : rute utama (Expo Router)
	- _layout.tsx       : konfigurasi Stack, tema, status bar
	- (tabs)/_layout.tsx: konfigurasi Tab navigator
	- (tabs)/index.tsx  : Home
	- (tabs)/explore.tsx: Explore (template)
	- hitung/           : fitur kalkulator (menu + 4 layar)
	- profiles/         : fitur profil (list + detail)
	- quesioner/        : menu quesioner/polling (placeholder)
- components/         : komponen UI reusable (ThemedText, ParallaxScrollView, dll)
- constants/theme.ts  : warna dan font
- hooks/              : hook tema dan skema warna
- assets/             : gambar statis

## 4) Mini diagram alur
```
User
	|
	v
Tabs: Home / Explore
	|
	+--> Home
	|      |
	|      +--> /profiles -> list -> /profiles/[id] (detail + YouTube)
	|      |
	|      +--> /hitung -> menu -> /hitung/{segitiga|tabung|kotak|lingkaran}
	|      |
	|      +--> /quesioner -> menu -> /quesioner/{quesioner|polling} (placeholder)
	|
	+--> Explore (template/penjelasan)
```
