import { useState } from "react";
import { Tag, Ticket, Percent, Activity, Search, X, Calendar, Edit3, Trash2, Plus } from "lucide-react";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const STATS = [
  { label: "Total Promo", value: "3", icon: Ticket },
  { label: "Total Penggunaan", value: "144x", icon: Activity },
  { label: "Tipe Persentase", value: "2", icon: Percent },
];

const PROMOS = [
  {
    id: "p1",
    code: "TIKTAK20",
    type: "PERSENTASE",
    value: "20%",
    start: "2024-01-01",
    end: "2024-12-31",
    usage: "45 / 100",
  },
  {
    id: "p2",
    code: "HEMAT50K",
    type: "NOMINAL",
    value: "Rp 50,000",
    start: "2024-01-01",
    end: "2024-12-31",
    usage: "12 / 50",
  },
  {
    id: "p3",
    code: "NEWUSER30",
    type: "PERSENTASE",
    value: "30%",
    start: "2024-03-01",
    end: "2024-06-30",
    usage: "87 / 200",
  },
];

// ─── Type Badge ───────────────────────────────────────────────────────────────

function TypeBadge({ type }: { type: string }) {
  if (type === "PERSENTASE") {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
        PERSENTASE
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
      NOMINAL
    </span>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CreatePromotion() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  return (
    <div className="w-full space-y-6 p-6">
      
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Manajemen Promosi</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Kelola kode promo dan kampanye diskon</p>
        </div>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-colors"
        >
          <Plus size={16} strokeWidth={3} />
          Buat Promo
        </button>
      </div>

      {/* ── Stats cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {STATS.map(({ label, value }) => (
          <div
            key={label}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm px-6 py-5 space-y-1"
          >
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
            <p className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">{value}</p>
          </div>
        ))}
      </div>

      {/* ── Search & Filter ── */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Cari kode promo..."
            className="w-full pl-9 pr-4 h-10 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          />
        </div>
        <div className="relative">
          <select className="h-10 pl-4 pr-10 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm appearance-none focus:outline-none">
            <option>Semua Tipe</option>
            <option>Persentase</option>
            <option>Nominal</option>
          </select>
          <svg className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="grid grid-cols-[2fr_1.5fr_1.5fr_1.5fr_1.5fr_1fr_auto] gap-4 px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          {["KODE PROMO", "TIPE", "NILAI DISKON", "MULAI", "BERAKHIR", "PENGGUNAAN", ""].map((h) => (
            <span key={h} className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              {h}
            </span>
          ))}
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {PROMOS.map((row) => (
            <div key={row.id} className="grid grid-cols-[2fr_1.5fr_1.5fr_1.5fr_1.5fr_1fr_auto] gap-4 items-center px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-md">
                  <Ticket size={14} />
                </div>
                <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">{row.code}</span>
              </div>
              <div><TypeBadge type={row.type} /></div>
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{row.value}</span>
              <span className="text-sm text-slate-500 dark:text-slate-400">{row.start}</span>
              <span className="text-sm text-slate-500 dark:text-slate-400">{row.end}</span>
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">{row.usage}</span>
              <div className="flex items-center gap-1">
                <button onClick={() => setIsUpdateOpen(true)} className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors">
                  <Edit3 size={16} />
                </button>
                <button onClick={() => setIsDeleteOpen(true)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-md transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Create / Update Modal ── */}
      {(isCreateOpen || isUpdateOpen) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {isCreateOpen ? "Buat Promo Baru" : "Update Promo"}
              </h3>
              <button onClick={() => { setIsCreateOpen(false); setIsUpdateOpen(false); }} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Kode Promo */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Kode Promo</label>
                <input type="text" placeholder="CTH. TIKTAK20" defaultValue={isUpdateOpen ? "TIKTAK20" : ""} className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 font-mono" />
              </div>

              {/* Tipe Diskon */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tipe Diskon</label>
                <div className="relative">
                  <select className="w-full h-10 pl-3 pr-8 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/30">
                    <option>Persentase (%)</option>
                    <option>Nominal (Rp)</option>
                  </select>
                  <svg className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
                </div>
              </div>

              {/* Nilai Diskon */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nilai Diskon</label>
                <input type="text" placeholder="cth. 20" defaultValue={isUpdateOpen ? "20" : ""} className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30" />
              </div>

              {/* Tanggal */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tanggal Mulai</label>
                  <div className="relative">
                    <input type="date" defaultValue={isUpdateOpen ? "2024-01-01" : ""} className="w-full h-10 pl-3 pr-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-slate-600 dark:text-slate-300 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full" />
                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tanggal Berakhir</label>
                  <div className="relative">
                    <input type="date" defaultValue={isUpdateOpen ? "2024-12-31" : ""} className="w-full h-10 pl-3 pr-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-slate-600 dark:text-slate-300 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full" />
                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                  </div>
                </div>
              </div>

              {/* Batas Penggunaan */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Batas Penggunaan</label>
                <input type="number" min="1" defaultValue={isUpdateOpen ? 100 : 1} className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30" />
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <button onClick={() => { setIsCreateOpen(false); setIsUpdateOpen(false); }} className="flex-1 h-11 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                Batal
              </button>
              <button onClick={() => { setIsCreateOpen(false); setIsUpdateOpen(false); }} className="flex-1 h-11 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold transition-colors shadow-sm">
                {isCreateOpen ? "Buat" : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Modal ── */}
      {isDeleteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-red-600">Hapus Promo</h3>
              <button onClick={() => setIsDeleteOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
              Apakah Anda yakin ingin menghapus kode promo ini? Tindakan ini tidak dapat dibatalkan.
            </p>

            <div className="flex justify-end gap-3">
              <button onClick={() => setIsDeleteOpen(false)} className="px-5 h-10 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                Batal
              </button>
              <button onClick={() => setIsDeleteOpen(false)} className="px-5 h-10 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-colors shadow-sm">
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
