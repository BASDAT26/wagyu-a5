import { useState } from "react";
import { Users, Calendar, TrendingUp, Ticket, MapPin, Percent, ArrowUpRight, Music, Theater, Mic2, Star, ChevronRight, ShieldAlert, User, Briefcase } from "lucide-react";

type Role = "Admin" | "Organizer" | "Customer";

export default function DashboardPage() {
  const [role, setRole] = useState<Role>("Admin");

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20 p-6 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* --- Role Simulator --- */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <ShieldAlert size={18} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">Simulasi Role Dashboard</h2>
              <p className="text-xs text-slate-500">Pilih role untuk melihat tampilan spesifik.</p>
            </div>
          </div>
          <div className="flex gap-2 bg-slate-50 dark:bg-slate-800/50 p-1 rounded-xl shadow-inner border border-slate-200 dark:border-slate-700">
            {(["Admin", "Organizer", "Customer"] as Role[]).map(r => (
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
            <div className="bg-[#2A3441] rounded-[20px] p-8 text-white flex justify-between items-center shadow-lg">
              <div>
                <p className="text-sm text-slate-400 mb-1 font-medium">Administrator</p>
                <h1 className="text-3xl font-bold mb-2">System Console</h1>
                <p className="text-sm text-slate-400">Pantau dan kelola platform TikTakTuk</p>
              </div>
              <button className="bg-white text-slate-900 hover:bg-slate-100 px-6 py-2.5 rounded-full font-bold text-sm shadow-sm transition-colors">
                Promosi
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Total Pengguna</p>
                  <p className="text-2xl font-black text-slate-800 mb-1">2,543</p>
                  <p className="text-xs text-slate-500 font-medium">Pengguna aktif</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                  <Users size={20} />
                </div>
              </div>
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Total Acara</p>
                  <p className="text-2xl font-black text-slate-800 mb-1">156</p>
                  <p className="text-xs text-slate-500 font-medium">Bulan ini</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <Calendar size={20} />
                </div>
              </div>
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Omzet Platform</p>
                  <p className="text-2xl font-black text-slate-800 mb-1">Rp 52.4M</p>
                  <p className="text-xs text-slate-500 font-medium">Gross volume</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                  <TrendingUp size={20} />
                </div>
              </div>
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Promosi Aktif</p>
                  <p className="text-2xl font-black text-slate-800 mb-1">3</p>
                  <p className="text-xs text-slate-500 font-medium">Running campaigns</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
                  <Ticket size={20} />
                </div>
              </div>
            </div>

            {/* Modules */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Venue */}
              <div className="bg-white rounded-[20px] p-6 border border-slate-200 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-slate-800">Infrastruktur Venue</h3>
                  <ArrowUpRight size={18} className="text-slate-400" />
                </div>
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500 font-medium">Total Venue Terdaftar</span>
                    <span className="font-bold text-slate-800">3 Lokasi</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500 font-medium">Reserved Seating</span>
                    <span className="font-bold text-slate-800">2 Venue</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500 font-medium">Kapasitas Terbesar</span>
                    <span className="font-bold text-slate-800">1,000 Kursi</span>
                  </div>
                </div>
                <button className="w-full py-3 rounded-xl border border-slate-200 font-bold text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                  Kelola Venue
                </button>
              </div>

              {/* Marketing */}
              <div className="bg-white rounded-[20px] p-6 border border-slate-200 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-slate-800">Marketing & Promosi</h3>
                  <ArrowUpRight size={18} className="text-slate-400" />
                </div>
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500 font-medium">Promo Persentase</span>
                    <span className="font-bold text-slate-800">1 Aktif</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500 font-medium">Promo Potongan Nominal</span>
                    <span className="font-bold text-slate-800">1 Aktif</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500 font-medium">Total Penggunaan</span>
                    <span className="font-bold text-slate-800">57 Kali</span>
                  </div>
                </div>
                <button className="w-full py-3 rounded-xl border border-slate-200 font-bold text-sm text-slate-700 hover:bg-slate-50 transition-colors">
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
            <div className="bg-[#1A1F2B] rounded-[20px] p-8 text-white flex justify-between items-center shadow-lg">
              <div>
                <p className="text-sm text-slate-400 mb-1 font-medium">Dashboard Penyelenggara</p>
                <h1 className="text-3xl font-bold mb-2">Andi Wijaya</h1>
                <p className="text-sm text-slate-400">Kelola 3 acara aktif Anda</p>
              </div>
              <div className="flex gap-3">
                <button className="bg-white text-slate-900 hover:bg-slate-100 px-6 py-2.5 rounded-full font-bold text-sm shadow-sm transition-colors">
                  Kelola Acara
                </button>
                <button className="bg-white/10 text-white hover:bg-white/20 px-6 py-2.5 rounded-full font-bold text-sm transition-colors">
                  Venue
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Acara Aktif</p>
                  <p className="text-2xl font-black text-slate-800 mb-1">3</p>
                  <p className="text-xs text-slate-500 font-medium">Dalam koordinasi</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                  <Calendar size={20} />
                </div>
              </div>
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Tiket Terjual</p>
                  <p className="text-2xl font-black text-slate-800 mb-1">1,243</p>
                  <p className="text-xs text-slate-500 font-medium">Total terjual</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <Ticket size={20} />
                </div>
              </div>
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Revenue</p>
                  <p className="text-2xl font-black text-slate-800 mb-1">Rp 4.8M</p>
                  <p className="text-xs text-slate-500 font-medium">Bulan ini</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                  <TrendingUp size={20} />
                </div>
              </div>
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Venue Mitra</p>
                  <p className="text-2xl font-black text-slate-800 mb-1">3</p>
                  <p className="text-xs text-slate-500 font-medium">Lokasi aktif</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
                  <MapPin size={20} />
                </div>
              </div>
            </div>

            {/* List Acara */}
            <div className="bg-white rounded-[20px] p-6 border border-slate-200 shadow-sm">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="font-bold text-slate-800">Performa Acara</h3>
                  <p className="text-sm text-slate-500">Status acara yang Anda kelola</p>
                </div>
                <button className="text-sm font-bold text-blue-600 hover:text-blue-700">Lihat Semua</button>
              </div>

              <div className="divide-y divide-slate-100">
                {[
                  { title: "Konser Melodi Senja", sold: "85%", loc: "Jakarta Convention Center" },
                  { title: "Festival Seni Budaya", sold: "85%", loc: "Taman Impian Jayakarta" },
                  { title: "Malam Akustik Bandung", sold: "85%", loc: "Bandung Hall Center" },
                ].map((item, idx) => (
                  <div key={idx} className="py-4 flex justify-between items-center group cursor-pointer hover:bg-slate-50 -mx-6 px-6 transition-colors">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-slate-800">{item.title}</h4>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-black tracking-wider bg-emerald-100 text-emerald-700">LIVE</span>
                      </div>
                      <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
                        <span className="flex items-center gap-1 text-emerald-600"><TrendingUp size={12} /> {item.sold} terjual</span>
                        <span className="flex items-center gap-1"><MapPin size={12} /> {item.loc}</span>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-slate-400 group-hover:text-blue-600 transition-colors" />
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
            <div className="bg-[#2563EB] rounded-[20px] p-8 text-white flex justify-between items-center shadow-lg shadow-blue-500/20">
              <div>
                <p className="text-sm text-blue-100 mb-1 font-medium">Selamat datang kembali</p>
                <h1 className="text-3xl font-bold mb-2">Budi Santoso</h1>
                <p className="text-sm text-blue-100">3 acara menarik menunggu Anda</p>
              </div>
              <button className="bg-white text-blue-600 hover:bg-slate-50 px-6 py-2.5 rounded-full font-bold text-sm shadow-sm transition-colors">
                Cari Tiket
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Tiket Aktif</p>
                  <p className="text-2xl font-black text-slate-800 mb-1">2</p>
                  <p className="text-xs text-slate-500 font-medium">Siap digunakan</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                  <Ticket size={20} />
                </div>
              </div>
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Acara Diikuti</p>
                  <p className="text-2xl font-black text-slate-800 mb-1">12</p>
                  <p className="text-xs text-slate-500 font-medium">Total pengalaman</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <Calendar size={20} />
                </div>
              </div>
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Kode Promo</p>
                  <p className="text-2xl font-black text-slate-800 mb-1">3</p>
                  <p className="text-xs text-slate-500 font-medium">Tersedia untuk Anda</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                  <TrendingUp size={20} />
                </div>
              </div>
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Total Belanja</p>
                  <p className="text-2xl font-black text-slate-800 mb-1">Rp 1.6M</p>
                  <p className="text-xs text-slate-500 font-medium">Bulan ini</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
                  <Music size={20} />
                </div>
              </div>
            </div>

            {/* List Acara */}
            <div className="bg-white rounded-[20px] p-6 border border-slate-200 shadow-sm">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="font-bold text-slate-800">Tiket Mendatang</h3>
                  <p className="text-sm text-slate-500">Tiket pertunjukan yang akan datang</p>
                </div>
                <button className="text-sm font-bold text-blue-600 hover:text-blue-700">Lihat Semua</button>
              </div>

              <div className="divide-y divide-slate-100">
                {[
                  { title: "Konser Melodi Senja", tag: "WVIP", date: "15 Mei 2024", loc: "Jakarta Convention Center" },
                  { title: "Festival Seni Budaya", tag: "GENERAL", date: "22 Mei 2024", loc: "Taman Impian Jayakarta" },
                ].map((item, idx) => (
                  <div key={idx} className="py-4 flex justify-between items-center group cursor-pointer hover:bg-slate-50 -mx-6 px-6 transition-colors">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-slate-800">{item.title}</h4>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-black tracking-wider bg-blue-100 text-blue-700">{item.tag}</span>
                      </div>
                      <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
                        <span className="flex items-center gap-1"><Calendar size={12} /> {item.date}</span>
                        <span className="flex items-center gap-1"><MapPin size={12} /> {item.loc}</span>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-slate-400 group-hover:text-blue-600 transition-colors" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
