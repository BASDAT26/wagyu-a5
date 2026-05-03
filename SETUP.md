# 🚀 Setup Guide — wagyu-a5

Panduan lengkap untuk menjalankan project ini dari nol, cocok untuk yang **belum pernah pakai Node.js** sebelumnya.

---

## 📋 Daftar Isi

1. [Install Git](#1--install-git)
2. [Install Node.js](#2--install-nodejs)
3. [Install pnpm](#3--install-pnpm)
4. [Install PostgreSQL](#4--install-postgresql)
5. [Clone Repository](#5--clone-repository)
6. [Setup Environment Variables](#6--setup-environment-variables)
7. [Install Dependencies](#7--install-dependencies)
8. [Setup Database](#8--setup-database)
9. [Jalankan Project](#9--jalankan-project)
10. [Troubleshooting](#10--troubleshooting)

---

## 1. 📥 Install Git

Git digunakan untuk meng-clone dan mengelola source code.

### Windows

1. Download Git dari [https://git-scm.com/downloads/win](https://git-scm.com/downloads/win)
2. Jalankan installer, ikuti langkah-langkah default (klik **Next** terus sampai **Install**)
3. Verifikasi instalasi — buka **Terminal / PowerShell** lalu ketik:
   ```bash
   git --version
   ```
   Jika muncul versi (misal `git version 2.47.x`), berarti berhasil.

### macOS

```bash
# Git biasanya sudah terinstall. Cek dulu:
git --version

# Jika belum ada, install via Homebrew:
brew install git
```

---

## 2. 📦 Install Node.js

Node.js adalah runtime JavaScript yang dibutuhkan untuk menjalankan project ini.

> **⚠️ PENTING:** Install Node.js versi **LTS** (bukan Current).

### Windows

1. Buka [https://nodejs.org](https://nodejs.org)
2. Klik tombol **LTS** (misal `22.x.x LTS`)
3. Jalankan installer, centang semua opsi default
4. **Restart terminal** setelah install selesai
5. Verifikasi:
   ```bash
   node --version
   npm --version
   ```
   Pastikan keduanya menampilkan nomor versi.

### macOS

```bash
# Via Homebrew:
brew install node@22
```

### Alternatif (Semua OS) — Menggunakan nvm

```bash
# Install nvm (Node Version Manager):
# Windows: download dari https://github.com/coreybutler/nvm-windows/releases
# macOS/Linux:
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash

# Setelah install nvm, restart terminal, lalu:
nvm install --lts
nvm use --lts
```

---

## 3. 📦 Install pnpm

Project ini menggunakan **pnpm** sebagai package manager (bukan npm atau yarn).

> **ℹ️** Versi yang digunakan: `pnpm@10.28.0`

```bash
# Install pnpm secara global via npm:
npm install -g pnpm@10.28.0
```

Verifikasi:

```bash
pnpm --version
# Harus menampilkan 10.28.0
```

---

## 4. 🐘 Install PostgreSQL

Project ini menggunakan **PostgreSQL** sebagai database.

### Opsi A: Install Lokal

#### Windows

1. Download dari [https://www.postgresql.org/download/windows/](https://www.postgresql.org/download/windows/)
2. Jalankan installer
3. **Catat** username, password, dan port yang kamu set (default: `postgres` / `postgres` / `5432`)
4. Pastikan service PostgreSQL berjalan

#### macOS

```bash
brew install postgresql@16
brew services start postgresql@16
```

### Opsi B: Pakai Cloud Database (Neon — Gratis)

Jika tidak mau install PostgreSQL secara lokal, bisa pakai **Neon** (gratis):

1. Buka [https://neon.tech](https://neon.tech)
2. Buat akun & buat project baru
3. Copy **connection string** yang diberikan (formatnya: `postgresql://user:password@host/dbname?sslmode=require`)
4. Gunakan connection string ini di langkah berikutnya

---

## 5. 📂 Clone Repository

```bash
# Clone repo dari GitHub:
git clone https://github.com/BASDAT26/wagyu-a5.git

# Masuk ke folder project:
cd wagyu-a5
```

### Pindah ke Branch yang Benar

```bash
# Pastikan kamu bekerja di branch dev:
git checkout dev

# Atau jika kamu punya branch sendiri (misal feat/kuning):
git checkout feat/kuning
```

---

## 6. ⚙️ Setup Environment Variables

Project ini membutuhkan file `.env` di **root folder** untuk menyimpan konfigurasi.

1. Buat file `.env` di root project (`wagyu-a5/.env`)
2. Isi dengan konten berikut:

```env
# Database
# Ganti dengan connection string PostgreSQL kamu
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/mydb?schema=public

# Authentication
# Generate secret: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
BETTER_AUTH_SECRET=ganti_dengan_random_string_minimal_32_karakter

# Auth Service URL
BETTER_AUTH_URL=http://localhost:3000

# CORS Origin
CORS_ORIGIN=http://localhost:5173;http://localhost:4983

# Environment
NODE_ENV=development

# Web App Server URL
VITE_SERVER_URL=http://localhost:3000
```

### Penjelasan Variabel

| Variabel             | Deskripsi                                             |
| -------------------- | ----------------------------------------------------- |
| `DATABASE_URL`       | Connection string ke database PostgreSQL kamu         |
| `BETTER_AUTH_SECRET` | Secret key untuk authentication (minimal 32 karakter) |
| `BETTER_AUTH_URL`    | URL dimana backend server berjalan                    |
| `CORS_ORIGIN`        | URL frontend yang diperbolehkan mengakses API         |
| `NODE_ENV`           | Mode environment (`development` saat develop)         |
| `VITE_SERVER_URL`    | URL backend yang diakses frontend                     |

### Generate Auth Secret

Jalankan perintah ini di terminal untuk generate secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy hasilnya dan paste ke `BETTER_AUTH_SECRET`.

---

## 7. 📦 Install Dependencies

```bash
# Dari root folder project (wagyu-a5/):
pnpm install
```

> Proses ini akan menginstall semua dependencies untuk **semua** apps dan packages dalam monorepo.
> Bisa memakan waktu beberapa menit tergantung koneksi internet.

---

## 8. 🗄️ Setup Database

Pastikan PostgreSQL sudah berjalan dan `DATABASE_URL` di file `.env` sudah benar.

```bash
# Push schema ke database (membuat tabel-tabel yang dibutuhkan):
pnpm run db:push
```

Jika berhasil, tabel-tabel akan terbuat di database kamu.

### (Opsional) Buka Database Studio

Untuk melihat isi database secara visual:

```bash
pnpm run db:studio
```

---

## 9. ▶️ Jalankan Project

### Jalankan Semua (Frontend + Backend)

```bash
pnpm run dev
```

Setelah beberapa detik, buka browser:

- **Frontend (Web):** [http://localhost:5173](http://localhost:5173)
- **Backend (API):** [http://localhost:3000](http://localhost:3000)

### Jalankan Satu-Satu (Opsional)

```bash
# Hanya frontend:
pnpm run dev:web

# Hanya backend:
pnpm run dev:server
```

---

## 10. 🛠️ Troubleshooting

### ❌ `pnpm: command not found`

pnpm belum terinstall. Jalankan:

```bash
npm install -g pnpm@10.28.0
```

### ❌ `node: command not found`

Node.js belum terinstall atau terminal belum di-restart setelah install.

### ❌ Error saat `pnpm install` — "ERR_PNPM_UNSUPPORTED_ENGINE"

Versi Node.js kamu mungkin terlalu lama. Update ke versi LTS terbaru.

### ❌ Error `DATABASE_URL` / koneksi database gagal

- Pastikan PostgreSQL sudah berjalan
- Cek kembali format connection string di `.env`
- Untuk lokal: `postgresql://postgres:PASSWORD@localhost:5432/NAMA_DB`

### ❌ Error `BETTER_AUTH_SECRET` terlalu pendek

Secret harus minimal 32 karakter. Generate ulang dengan:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### ❌ Port sudah dipakai (EADDRINUSE)

Ada proses lain yang menggunakan port 3000 atau 5173. Matikan proses tersebut atau ubah port.

### ❌ `db:push` gagal

- Pastikan PostgreSQL berjalan
- Pastikan database yang dituju sudah ada (buat dulu jika belum)
- Untuk membuat database di PostgreSQL:

  ```bash
  # Masuk ke psql
  psql -U postgres

  # Buat database baru
  CREATE DATABASE mydb;
  ```

---

## 📁 Struktur Project

```
wagyu-a5/
├── apps/
│   ├── web/         # Frontend (React + React Router + TailwindCSS)
│   └── server/      # Backend API (Hono + tRPC)
├── packages/
│   ├── ui/          # Komponen UI bersama (shadcn/ui)
│   ├── api/         # Business logic & API layer
│   ├── auth/        # Konfigurasi authentication
│   ├── db/          # Database schema & queries (Drizzle ORM)
│   ├── env/         # Validasi environment variables
│   └── config/      # Shared configurations
├── .env             # Environment variables (JANGAN di-commit!)
├── package.json     # Root package config
├── pnpm-workspace.yaml
└── turbo.json       # Turborepo config
```

---

## 📜 Perintah-Perintah Penting

| Perintah               | Fungsi                                   |
| ---------------------- | ---------------------------------------- |
| `pnpm run dev`         | Jalankan semua apps (frontend + backend) |
| `pnpm run dev:web`     | Jalankan hanya frontend                  |
| `pnpm run dev:server`  | Jalankan hanya backend                   |
| `pnpm run build`       | Build semua apps untuk production        |
| `pnpm run db:push`     | Push schema ke database                  |
| `pnpm run db:studio`   | Buka database studio (GUI)               |
| `pnpm run db:generate` | Generate database types                  |
| `pnpm run db:migrate`  | Jalankan database migrations             |
| `pnpm run check-types` | Cek TypeScript types                     |

---

## 🔀 Workflow Git

```bash
# 1. Pastikan kamu di branch yang benar
git checkout feat/kuning   # ganti sesuai branch kamu

# 2. Ambil perubahan terbaru
git pull origin dev

# 3. Setelah selesai coding, commit & push
git add .
git commit -m "feat: deskripsi perubahan"
git push origin feat/kuning

# 4. Buat Pull Request di GitHub ke branch "dev"
```

---

> 💡 **Tips:** Jika ada masalah yang tidak bisa diselesaikan, coba hapus `node_modules` dan install ulang:
>
> ```bash
> # Windows (PowerShell):
> Remove-Item -Recurse -Force node_modules
> pnpm install
> ```
