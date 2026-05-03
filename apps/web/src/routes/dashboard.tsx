import { useState } from "react";
import {
  Users,
  Calendar,
  TrendingUp,
  Ticket,
  MapPin,
  Percent,
  ArrowUpRight,
  Music,
  Theater,
  Mic2,
  Star,
  ChevronRight,
  ShieldAlert,
  User,
  Briefcase,
} from "lucide-react";
import Navbar from "@/components/Navbar";

type Role = "Admin" | "Organizer" | "Customer";

export default function DashboardPage() {
  const [role, setRole] = useState<Role>("Admin");

  const headerRole = role.toLowerCase() as "admin" | "organizer" | "customer";

  return (
    <>
      <Navbar role={headerRole} />
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20 p-6 font-sans">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* --- Role Simulator --- */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-[20px] border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm mb-8">
            <div className="flex items-center gap-3 pl-2">
              <div className="p-2.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl">
                <ShieldAlert size={18} />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                  Simulasi Role Dashboard
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Pilih role untuk melihat tampilan spesifik.
                </p>
              </div>
            </div>
            <div className="flex gap-2 bg-slate-50 dark:bg-slate-800/50 p-1.5 rounded-xl shadow-inner border border-slate-200 dark:border-slate-700">
              {(["Admin", "Organizer", "Customer"] as Role[]).map((r) => (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${
                    role === r
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-slate-600 hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-700"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* =========================================
            ADMIN DASHBOARD 
        ========================================= */}
          {role === "Admin" && (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
              {/* Header */}
              <div className="bg-[#2A3441] dark:bg-[#1E2530] rounded-[24px] p-8 sm:p-10 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 shadow-xl shadow-slate-200/50 dark:shadow-none">
                <div>
                  <p className="text-sm text-slate-400 mb-1 font-semibold tracking-wide">
                    Administrator
                  </p>
                  <h1 className="text-3xl font-black mb-2 tracking-tight">
                    System Console
                  </h1>
                  <p className="text-sm text-slate-300">
                    Pantau dan kelola platform TikTakTuk
                  </p>
                </div>
                <button className="bg-white text-slate-900 hover:bg-slate-100 px-6 py-3 rounded-xl font-bold text-sm shadow-sm transition-colors">
                  Promosi
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-slate-900 rounded-[20px] p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex items-start justify-between">
                  <div>
                    <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
                      Total Pengguna
                    </p>
                    <p className="text-2xl font-black text-slate-800 dark:text-slate-100 mb-1">
                      2,543
                    </p>
                    <p className="text-[13px] text-slate-500 dark:text-slate-400 font-medium">
                      Pengguna aktif
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                    <Users size={24} />
                  </div>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-[20px] p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex items-start justify-between">
                  <div>
                    <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
                      Total Acara
                    </p>
                    <p className="text-2xl font-black text-slate-800 dark:text-slate-100 mb-1">
                      156
                    </p>
                    <p className="text-[13px] text-slate-500 dark:text-slate-400 font-medium">
                      Bulan ini
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <Calendar size={24} />
                  </div>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-[20px] p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex items-start justify-between">
                  <div>
                    <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
                      Omzet Platform
                    </p>
                    <p className="text-2xl font-black text-slate-800 dark:text-slate-100 mb-1">
                      Rp 52.4M
                    </p>
                    <p className="text-[13px] text-slate-500 dark:text-slate-400 font-medium">
                      Gross volume
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 dark:text-purple-400">
                    <TrendingUp size={24} />
                  </div>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-[20px] p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex items-start justify-between">
                  <div>
                    <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
                      Promosi Aktif
                    </p>
                    <p className="text-2xl font-black text-slate-800 dark:text-slate-100 mb-1">
                      3
                    </p>
                    <p className="text-[13px] text-slate-500 dark:text-slate-400 font-medium">
                      Running campaigns
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-orange-600 dark:text-orange-400">
                    <Ticket size={24} />
                  </div>
                </div>
              </div>

              {/* Modules */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Venue */}
                <div className="bg-white dark:bg-slate-900 rounded-[24px] p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                      Infrastruktur Venue
                    </h3>
                    <ArrowUpRight
                      size={20}
                      className="text-slate-400 dark:text-slate-500"
                    />
                  </div>
                  <div className="space-y-5 mb-10">
                    <div className="flex justify-between items-center text-[15px]">
                      <span className="text-slate-500 dark:text-slate-400 font-medium">
                        Total Venue Terdaftar
                      </span>
                      <span className="font-bold text-slate-800 dark:text-slate-100">
                        3 Lokasi
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-[15px]">
                      <span className="text-slate-500 dark:text-slate-400 font-medium">
                        Reserved Seating
                      </span>
                      <span className="font-bold text-slate-800 dark:text-slate-100">
                        2 Venue
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-[15px]">
                      <span className="text-slate-500 dark:text-slate-400 font-medium">
                        Kapasitas Terbesar
                      </span>
                      <span className="font-bold text-slate-800 dark:text-slate-100">
                        1,000 Kursi
                      </span>
                    </div>
                  </div>
                  <button className="w-full py-3.5 rounded-xl border-2 border-slate-100 dark:border-slate-800 font-bold text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    Kelola Venue
                  </button>
                </div>

                {/* Marketing */}
                <div className="bg-white dark:bg-slate-900 rounded-[24px] p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                      Marketing & Promosi
                    </h3>
                    <ArrowUpRight
                      size={20}
                      className="text-slate-400 dark:text-slate-500"
                    />
                  </div>
                  <div className="space-y-5 mb-10">
                    <div className="flex justify-between items-center text-[15px]">
                      <span className="text-slate-500 dark:text-slate-400 font-medium">
                        Promo Persentase
                      </span>
                      <span className="font-bold text-slate-800 dark:text-slate-100">
                        1 Aktif
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-[15px]">
                      <span className="text-slate-500 dark:text-slate-400 font-medium">
                        Promo Potongan Nominal
                      </span>
                      <span className="font-bold text-slate-800 dark:text-slate-100">
                        1 Aktif
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-[15px]">
                      <span className="text-slate-500 dark:text-slate-400 font-medium">
                        Total Penggunaan
                      </span>
                      <span className="font-bold text-slate-800 dark:text-slate-100">
                        57 Kali
                      </span>
                    </div>
                  </div>
                  <button className="w-full py-3.5 rounded-xl border-2 border-slate-100 dark:border-slate-800 font-bold text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    Kelola Promosi
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* =========================================
            ORGANIZER DASHBOARD 
        ========================================= */}
          {role === "Organizer" && (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
              {/* Header */}
              <div className="bg-[#1A1F2B] dark:bg-[#12161E] rounded-[24px] p-8 sm:p-10 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 shadow-xl shadow-slate-200/50 dark:shadow-none">
                <div>
                  <p className="text-sm text-slate-400 mb-1 font-semibold tracking-wide">
                    Dashboard Penyelenggara
                  </p>
                  <h1 className="text-3xl font-black mb-2 tracking-tight">
                    Andi Wijaya
                  </h1>
                  <p className="text-sm text-slate-400">
                    Kelola 3 acara aktif Anda
                  </p>
                </div>
                <div className="flex gap-3">
                  <button className="bg-white text-slate-900 hover:bg-slate-100 px-6 py-3 rounded-xl font-bold text-sm shadow-sm transition-colors">
                    Kelola Acara
                  </button>
                  <button className="bg-white/10 text-white hover:bg-white/20 px-6 py-3 rounded-xl font-bold text-sm transition-colors border border-white/10">
                    Venue
                  </button>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-slate-900 rounded-[20px] p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex items-start justify-between">
                  <div>
                    <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
                      Acara Aktif
                    </p>
                    <p className="text-2xl font-black text-slate-800 dark:text-slate-100 mb-1">
                      3
                    </p>
                    <p className="text-[13px] text-slate-500 dark:text-slate-400 font-medium">
                      Dalam koordinasi
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                    <Calendar size={24} />
                  </div>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-[20px] p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex items-start justify-between">
                  <div>
                    <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
                      Tiket Terjual
                    </p>
                    <p className="text-2xl font-black text-slate-800 dark:text-slate-100 mb-1">
                      1,243
                    </p>
                    <p className="text-[13px] text-slate-500 dark:text-slate-400 font-medium">
                      Total terjual
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <Ticket size={24} />
                  </div>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-[20px] p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex items-start justify-between">
                  <div>
                    <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
                      Revenue
                    </p>
                    <p className="text-2xl font-black text-slate-800 dark:text-slate-100 mb-1">
                      Rp 4.8M
                    </p>
                    <p className="text-[13px] text-slate-500 dark:text-slate-400 font-medium">
                      Bulan ini
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 dark:text-purple-400">
                    <TrendingUp size={24} />
                  </div>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-[20px] p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex items-start justify-between">
                  <div>
                    <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
                      Venue Mitra
                    </p>
                    <p className="text-2xl font-black text-slate-800 dark:text-slate-100 mb-1">
                      3
                    </p>
                    <p className="text-[13px] text-slate-500 dark:text-slate-400 font-medium">
                      Lokasi aktif
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-orange-600 dark:text-orange-400">
                    <MapPin size={24} />
                  </div>
                </div>
              </div>

              {/* List Acara */}
              <div className="bg-white dark:bg-slate-900 rounded-[24px] p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex justify-between items-start mb-6 border-b border-slate-100 dark:border-slate-800 pb-6">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                      Performa Acara
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      Status acara yang Anda kelola
                    </p>
                  </div>
                  <button className="text-sm font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                    Lihat Semua
                  </button>
                </div>

                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {[
                    {
                      title: "Konser Melodi Senja",
                      sold: "85%",
                      loc: "Jakarta Convention Center",
                    },
                    {
                      title: "Festival Seni Budaya",
                      sold: "85%",
                      loc: "Taman Impian Jayakarta",
                    },
                    {
                      title: "Malam Akustik Bandung",
                      sold: "85%",
                      loc: "Bandung Hall Center",
                    },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="py-5 flex justify-between items-center group cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 -mx-8 px-8 transition-colors"
                    >
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-[15px] font-bold text-slate-800 dark:text-slate-100">
                            {item.title}
                          </h4>
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-black tracking-wider bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">
                            LIVE
                          </span>
                        </div>
                        <div className="flex items-center gap-5 text-xs font-medium text-slate-500 dark:text-slate-400">
                          <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                            <TrendingUp size={14} /> {item.sold} terjual
                          </span>
                          <span className="flex items-center gap-1.5">
                            <MapPin size={14} /> {item.loc}
                          </span>
                        </div>
                      </div>
                      <ChevronRight
                        size={18}
                        className="text-slate-400 group-hover:text-blue-600 transition-colors"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* =========================================
            CUSTOMER DASHBOARD 
        ========================================= */}
          {role === "Customer" && (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
              {/* Header */}
              <div className="bg-[#2563EB] dark:bg-blue-700 rounded-[24px] p-8 sm:p-10 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 shadow-xl shadow-blue-500/20 dark:shadow-none">
                <div>
                  <p className="text-sm text-blue-100 mb-1 font-medium tracking-wide">
                    Selamat datang kembali
                  </p>
                  <h1 className="text-3xl font-black mb-2 tracking-tight">
                    Budi Santoso
                  </h1>
                  <p className="text-sm text-blue-100">
                    3 acara menarik menunggu Anda
                  </p>
                </div>
                <button className="bg-white text-blue-600 hover:bg-slate-50 px-6 py-3 rounded-xl font-bold text-sm shadow-sm transition-colors">
                  Cari Tiket
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-slate-900 rounded-[20px] p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex items-start justify-between">
                  <div>
                    <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
                      Tiket Aktif
                    </p>
                    <p className="text-2xl font-black text-slate-800 dark:text-slate-100 mb-1">
                      2
                    </p>
                    <p className="text-[13px] text-slate-500 dark:text-slate-400 font-medium">
                      Siap digunakan
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                    <Ticket size={24} />
                  </div>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-[20px] p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex items-start justify-between">
                  <div>
                    <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
                      Acara Diikuti
                    </p>
                    <p className="text-2xl font-black text-slate-800 dark:text-slate-100 mb-1">
                      12
                    </p>
                    <p className="text-[13px] text-slate-500 dark:text-slate-400 font-medium">
                      Total pengalaman
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <Calendar size={24} />
                  </div>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-[20px] p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex items-start justify-between">
                  <div>
                    <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
                      Kode Promo
                    </p>
                    <p className="text-2xl font-black text-slate-800 dark:text-slate-100 mb-1">
                      3
                    </p>
                    <p className="text-[13px] text-slate-500 dark:text-slate-400 font-medium">
                      Tersedia untuk Anda
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 dark:text-purple-400">
                    <TrendingUp size={24} />
                  </div>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-[20px] p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex items-start justify-between">
                  <div>
                    <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
                      Total Belanja
                    </p>
                    <p className="text-2xl font-black text-slate-800 dark:text-slate-100 mb-1">
                      Rp 1.6M
                    </p>
                    <p className="text-[13px] text-slate-500 dark:text-slate-400 font-medium">
                      Bulan ini
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-orange-600 dark:text-orange-400">
                    <Music size={24} />
                  </div>
                </div>
              </div>

              {/* List Acara */}
              <div className="bg-white dark:bg-slate-900 rounded-[24px] p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex justify-between items-start mb-6 border-b border-slate-100 dark:border-slate-800 pb-6">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                      Tiket Mendatang
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      Tiket pertunjukan yang akan datang
                    </p>
                  </div>
                  <button className="text-sm font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                    Lihat Semua
                  </button>
                </div>

                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {[
                    {
                      title: "Konser Melodi Senja",
                      tag: "WVIP",
                      date: "15 Mei 2024",
                      loc: "Jakarta Convention Center",
                    },
                    {
                      title: "Festival Seni Budaya",
                      tag: "GENERAL",
                      date: "22 Mei 2024",
                      loc: "Taman Impian Jayakarta",
                    },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="py-5 flex justify-between items-center group cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 -mx-8 px-8 transition-colors"
                    >
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-[15px] font-bold text-slate-800 dark:text-slate-100">
                            {item.title}
                          </h4>
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-black tracking-wider bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                            {item.tag}
                          </span>
                        </div>
                        <div className="flex items-center gap-5 text-xs font-medium text-slate-500 dark:text-slate-400">
                          <span className="flex items-center gap-1.5">
                            <Calendar size={14} /> {item.date}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <MapPin size={14} /> {item.loc}
                          </span>
                        </div>
                      </div>
                      <ChevronRight
                        size={18}
                        className="text-slate-400 group-hover:text-blue-600 transition-colors"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
