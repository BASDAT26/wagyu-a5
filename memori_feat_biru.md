# Memori Konteks: Modul Promotion & Order (Feat/Biru)

File ini menyimpan rangkuman konteks, arsitektur, dan logika-logika khusus yang telah kita kerjakan untuk fitur **Manajemen Promosi** dan **Pemesanan (Order)** agar mudah dilanjutkan atau di-*debug* di masa mendatang tanpa perlu mencari ulang konteksnya.

## 1. Frontend (UI & Integrasi)

### A. Modul Promosi (`apps/web/src/modules/promotion/create-promotion.tsx`)
- **Tujuan**: Halaman CRUD (Create, Read, Update, Delete) untuk daftar promosi.
- **Akses**: Fungsi Create, Update, dan Delete **sangat dibatasi** hanya untuk *role* `ADMIN`. *Role* lain (`CUSTOMER`, `ORGANIZER`) hanya bisa melihat tabel data saja. Prop `role` diumpankan dari `routes/promotion.tsx` dengan membaca `authClient.useSession()`.
- **Performa**: Kelas `backdrop-blur-sm` dan beberapa animasi (*fade-in*, dll) pada modal *overlay* telah **dihapus** untuk meningkatkan performa rendering saat modal CUD dibuka.

### B. Modul Order (`apps/web/src/modules/order/create-order.tsx`)
- **Tujuan**: Menampilkan *dashboard* atau daftar seluruh pesanan (order) bagi Admin/Pelanggan.
- **Fitur Status**:
  - Terdapat 4 status pesanan utama: `PAID`, `PENDING`, `CANCELLED`, dan tambahan terbaru: `REFUNDED`.
  - Warna badge dibedakan: *Hijau* (Paid), *Kuning* (Pending), *Merah* (Cancelled), *Ungu* (Refunded).
- **Aksi Admin**: Admin dapat mengubah status secara manual (melalui tombol Edit) atau menghapus secara permanen (melalui tombol Delete).

### C. Alur Pemesanan Tiket
- **Navigasi**: Pengguna dapat mencari event melalui **Halaman Cari Event** (`/cari-event`).
- **Pilihan Event**: Di halaman cari event, pengguna memilih event dan mengklik **"Beli Tiket"** yang mengarahkan ke halaman **Checkout** (`/checkout`).
- **Validasi Promo & Kategori**:
  1. Validasi Promo: Mengecek `usage_limit` vs `usage_count`.
  2. Validasi Kategori: Mengecek sisa `quota` tiket pada kategori yang dipilih.
- **Data Aktual**: Menggunakan data kategori tiket asli dari database (`trpc.ticket.category.listAll`) menggantikan data *mock*.
- **Submit Order**: Mengirimkan `promoCode`, `ticketCount`, dan `categoryId` (UUID) ke backend.

---

## 2. Backend & Logika Database (`packages/api/src/routers/order.router.ts`)

Semua *routing* terkait pesanan dan promo digabung ke dalam satu router besar: `orderRouter` yang mencakup 3 sub-router: `order`, `promotion`, dan `orderPromotion` (junction table).

### A. Order Router (`orderRouter_`)
- **Penciptaan (`createForCurrentUser`)**: 
  - Menyimpan data ke `tiktaktuk.orders`.
  - **Manajemen Promo**: Jika memakai promo, menambah `usage_count` dan mencatat di `order_promotion`.
  - **Manajemen Tiket & Kuota**:
    1. Memvalidasi ketersediaan `quota` pada `ticket_category`.
    2. Mengurangi `quota` kategori tiket sesuai jumlah pesanan.
    3. **Mencetak Tiket Fisik**: Membuat baris data baru di tabel `tiktaktuk.ticket` sebanyak `ticketCount` dengan kode unik (format: `TCK-XXXX`).
- **Penghapusan (`delete`)**:
  - Mencegah error *Foreign Key* dengan menghapus referensi di `order_promotion` dan `ticket` fisik lebih dulu.
  - **Refund Kuota Tiket**: Menambahkan kembali sisa `quota` pada `ticket_category` berdasarkan jumlah tiket yang dihapus.
  - **Refund Kuota Promo**: Menurunkan (mengurangi) nilai `usage_count` di tabel promosi sebagai bentuk *refund* kuota. Logika SQL akan otomatis mendeteksi jumlah tiket sebagai nominal pengurangan.

### B. Promotion Router (`promotionRouter`)
- **Penghapusan (`delete`)**:
  - Diberikan **Cascade Manual**. Jika Admin memutuskan menghapus kode promosi secara sepihak dari sistem, maka:
    1. Sistem mencari seluruh order yang pernah memakai promo ini.
    2. Jika order masih `PENDING`, statusnya diubah menjadi `CANCELLED`.
    3. Jika order sudah `PAID`, statusnya diubah menjadi `REFUNDED`.
    4. Menghapus referensi junction di `order_promotion` agar tidak bentrok FK.
    5. Menghapus promo dari database.

---

## 3. Database Schema Mapping
- Tabel **orders**: Menyimpan pesanan utama.
- Tabel **promotion**: Menyimpan diskon/promo (memiliki batas kuota `usage_limit` dan kuota berjalan `usage_count`).
- Tabel **order_promotion**: Merupakan *junction table* (Many-to-Many) yang menghubungkan `order_id` dengan `promotion_id`. Hal ini yang membuat *foreign key cascading* dilakukan secara eksplisit pada *backend router*.
