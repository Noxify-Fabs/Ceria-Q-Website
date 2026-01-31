# Buku Cerita Anak Islam - Website PKM

Website buku cerita digital interaktif untuk anak SD dengan tema pendidikan Islam dan akhlak mulia.

## 📋 Deskripsi

Proyek ini adalah website edukasi anak yang menampilkan buku cerita interaktif dengan:
- Tampilan profesional dan ramah anak
- Navigasi visual yang mudah dipahami
- Audio dan video streaming
- Responsive design untuk semua perangkat

## 🚀 Fitur Utama

### 📱 Interface Islami
- Warna hijau emas yang identik dengan Islam
- Font besar dan mudah dibaca (Fredoka)
- Ikon islami dan minim teks
- Animasi halus dan menyenangkan

### 📖 Struktur Cerita Islami
- **Pelajaran 1**: Kejujuran adalah Kunci Surga (5 halaman) - Kisah Ubay
- **Pelajaran 2**: Kasih Sayang Sesama Muslim (5 halaman) - Kisah Lala
- Total 10 halaman dengan nilai-nilai akhlak mulia

### 🎵 Media Islami
- Audio doa dan zikir untuk setiap halaman
- Video pembelajaran nilai-nilai Islam
- Ilustrasi emoji islami yang menarik
- Progress bar untuk tracking pembacaan

### 🎨 Desain Islami
- Layout bertingkat dengan tema Islam
- Warna hijau emas yang elegan
- Responsive design
- Smooth scrolling dengan nuansa islami

## 📁 Struktur Folder

```
project/
├── index.html              # Landing page utama
├── story.html              # Halaman membaca cerita
├── css/
│   └── style.css           # Stylesheet lengkap
├── js/
│   ├── data.js             # Data cerita dan konfigurasi
│   └── script.js           # Fungsionalitas JavaScript
├── assets/
│   └── images/             # Gambar dan ilustrasi
└── README.md               # Dokumentasi
```

## 🛠 Teknologi

- **HTML5**: Semantic markup
- **CSS3**: Flexbox, Grid, Animasi
- **JavaScript**: Vanilla JS (tanpa framework)
- **Font**: Google Fonts (Fredoka)
- **Media**: Google Drive (audio), YouTube (video)

## 📱 Cara Penggunaan

### 1. Akses Website
- Buka `index.html` di browser
- Atau scan QR Code yang mengarah ke website

### 2. Memilih Cerita
- Klik card "Bagian 1" atau "Bagian 2"
- Akan otomatis membuka halaman cerita

### 3. Membaca Cerita
- Gunakan tombol ⬅️ ➡️ untuk navigasi
- Klik 🎵 untuk audio narasi
- Klik 🎥 untuk video animasi
- Gunakan keyboard arrow keys untuk navigasi cepat

### 4. Fitur Keyboard
- **Arrow Left**: Halaman sebelumnya
- **Arrow Right**: Halaman selanjutnya
- **Escape**: Tutup modal audio/video

## 🎯 Target Pengguna

- **Usia**: 6-12 tahun (SD)
- **Gender**: Semua gender
- **Device**: Desktop, Tablet, Mobile
- **Fokus**: Pendidikan karakter Islam

## 🌟 Nilai Islam yang Diterapkan

1. **Kejujuran**: Menanamkan pentingnya kejujuran dalam kehidupan
2. **Kasih Sayang**: Mengajarkan cinta kepada sesama Muslim
3. **Doa & Zikir**: Membiasakan anak berdoa dan berzikir
4. **Persaudaraan**: Memperkuat ukhuwah Islamiyah
5. **Bersedekah**: Menanamkan kebiasaan berbagi

## 🌟 Prinsip IMK & Pendidikan Islam

1. **Visibility**: Progress bar dan indikator pembelajaran
2. **Consistency**: Tema islami konsisten di seluruh website
3. **Recognition > Recall**: Ikon islami lebih dominan dari teks
4. **Error prevention**: Tidak ada interaksi yang membingungkan anak
5. **Aesthetic**: Desain bersih dengan nuansa Islam yang elegan

## 🔧 Konfigurasi Media

### Audio (Google Drive)
1. Upload file audio doa ke Google Drive
2. Set sharing ke "Anyone with the link"
3. Ganti `YOUR_AUDIO_ID_X` di `data.js` dengan file ID
4. Format: `https://drive.google.com/uc?export=download&id=FILE_ID`

### Video (YouTube)
1. Upload video animasi zikir ke YouTube (Unlisted)
2. Ganti `YOUR_VIDEO_ID_X` di `data.js` dengan video ID
3. Format: `https://www.youtube.com/embed/VIDEO_ID`

### Gambar (Lokal)
1. Ilustrasi emoji sudah disimpan lokal di assets/images/
2. Gambar SVG untuk optimasi loading
3. Tidak perlu upload ke external service

## 📱 Responsive Design

Website ini dioptimalkan untuk:
- **Desktop**: 1200px+ dengan layout penuh
- **Tablet**: 768px-1199px dengan layout adapted
- **Mobile**: <768px dengan layout stacked

## 🚀 Deployment

### Local Development
1. Clone atau download repository
2. Buka `index.html` di browser
3. Tidak perlu installasi atau build process

### Production Deployment
1. Upload semua file ke web server
2. Pastikan struktur folder tetap sama
3. Test semua links dan media streaming

## 🐛 Troubleshooting

### Audio/Video Tidak Berfungsi
- Check URL streaming di `data.js`
- Pastikan file sudah di-upload dengan benar
- Test di berbagai browser

### Layout Rusak
- Pastikan semua file CSS ter-load
- Check responsive breakpoints
- Test di berbagai ukuran layar

### JavaScript Error
- Check browser console untuk error details
- Pastikan semua file JS ter-load dengan benar
- Verify function calls di HTML

## 📄 Lisensi

Proyek ini dibuat untuk keperluan PKM (Program Kreativitas Mahasiswa).

## 👥 Tim Pengembang

- **Web Developer & UI/UX Designer**: Tim PKM
- **Target Audience**: Anak SD Muslim Indonesia
- **Purpose**: Edukasi karakter Islam yang menyenangkan
- **Theme**: Pendidikan akhlak mulia melalui cerita interaktif

---

🕌 **Selamat menikmati petualangan menanamkan nilai-nilai Islam!** 🌟
