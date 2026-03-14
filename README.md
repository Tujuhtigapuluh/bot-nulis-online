# Bot Nulis Online (Text to Handwriting) ✍️

Aplikasi web sederhana berbasis React dan Vite untuk mengubah teks ketikan menjadi gambar tulisan tangan di atas "kertas folio". Sangat cocok untuk mengotomatisasi tugas tulisan tangan, lengkap dengan dukungan penulisan rumus matematika!

## Fitur Unggulan

- **Text to Handwriting**: Mengubah teks biasa menjadi tulisan tangan otomatis.
- **Berbagai Pilihan Font**: Mendukung berbagai Google Fonts gaya tulisan tangan (Kalam, Caveat, Indie Flower, dll).
- **Kustomisasi Lengkap**: Ubah ukuran font, jarak baris, margin, tingkat "kekacauan" (roughness), warna tinta, dan warna garis buku.
- **Identitas Header Kustom**: Tambahkan/hapus kolom label Nama, NIM, Mata Kuliah di bagian atas kertas.
- **Dukungan Rumus Matematika**: Menggunakan KaTeX, Anda bisa mengetik rumus matematika dengan syntax `$$...$$` (Misalnya: `$$\frac{1}{2}$$`).
- **Export Resolusi Tinggi**: Download hasil karya sebagai gambar `PNG` bersih berkualitas tinggi tanpa perlu screenshot layar.

## Cara Menjalankan di Komputer Lokal

1. Pastikan Anda sudah menginstal [Node.js](https://nodejs.org/).
2. Buka terminal/command prompt, navigasi ke direktori project.
3. Jalankan perintah instalasi:
   ```bash
   npm install
   ```
4. Jalankan server pengembangan lokal:
   ```bash
   npm run dev
   ```
5. Buka link `http://localhost:5173` di browser Anda.

---

## Cara Upload ke GitHub Pages (Solusi Anti Blank Putih)

Sering kali mendeploy project **Vite + React** ke GitHub Pages menghasilkan **halaman putih kosong (blank screen)** karena masalah path aset `/` bawaan Vite yang tidak mengenali nama repository. 

Untuk memastikan deployment berjalan sempurna, di repositori ini telah ditambahkan **GitHub Actions Workflow** (`.github/workflows/deploy.yml`) yang secara otomatis menyetel path `base` dengan nama repository Anda (sehingga file CSS & JS dapat dimuat dengan baik).

**Ikuti langkah ini untuk mengaktifkannya di GitHub:**

1. **Upload project ke GitHub:** Buat repository baru di GitHub, lalu commit dan push project ini ke branch `main`.
2. Buka halaman Repository Anda di GitHub.
3. Pergi ke tab **Settings** > lalu klik **Pages** di menu sebelah kiri.
4. Pada bagian **Build and deployment**, perhatikan opsi **Source**.
5. Ubah opsi dropdown **Source** dari "Deploy from a branch" menjadi **"GitHub Actions"**.
6. Selesai! Setiap kali Anda melakukan *push* ke branch `main`, GitHub Actions akan otomatis melakukan *build* aplikasi ini (lengkap dengan konfigurasi base path yang benar) dan menampilkannya di GitHub Pages tanpa error layar putih.

*(Proses deploy bisa dilihat di tab **Actions** pada repository Anda. Setelah indikatornya hijau/selesai, klik link URL yang diberikan untuk melihat website).*
