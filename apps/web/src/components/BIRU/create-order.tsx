import { useState } from "react";
import { Tag, Ticket, ShoppingCart, Clock, CheckCircle, XCircle, TrendingUp, X } from "lucide-react";// ─── Mock Data ────────────────────────────────────────────────────────────────

const STATS = [
  { label: "Total Order", value: "4", icon: ShoppingCart, color: "text-slate-600" },
  { label: "Lunas", value: "2", icon: CheckCircle, color: "text-green-500" },
  { label: "Pending", value: "1", icon: Clock, color: "text-amber-500" },
  { label: "Total Revenue", value: "Rp 1.350.000", icon: TrendingUp, color: "text-blue-500" },
];

const ORDERS = [
  {
    id: "ord_001",
    customer: "Budi Santoso",
    initial: "B",
    date: "2024-04-10 14:32",
    status: "LUNAS",
    total: "Rp 1.200.000",
  },
  {
    id: "ord_002",
    customer: "Budi Santoso",
    initial: "B",
    date: "2024-04-11 09:15",
    status: "LUNAS",
    total: "Rp 150.000",
  },
  {
    id: "ord_003",
    customer: "Siti Rahayu",
    initial: "S",
    date: "2024-04-12 18:44",
    status: "PENDING",
    total: "Rp 1.500.000",
  },
  {
    id: "ord_004",
    customer: "Siti Rahayu",
    initial: "S",
    date: "2024-04-13 11:00",
    status: "DIBATALKAN",
    total: "Rp 700.000",
  },
];

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; className: string; icon: React.ReactNode }> = {
    LUNAS: {
      label: "Lunas",
      className: "text-green-600 bg-green-50 border-green-200 ring-1 ring-green-200",
      icon: <CheckCircle size={11} />,
    },
    PENDING: {
      label: "Pending",
      className: "text-amber-600 bg-amber-50 border-amber-200 ring-1 ring-amber-200",
      icon: <Clock size={11} />,
    },
    DIBATALKAN: {
      label: "Dibatalkan",
      className: "text-red-500 bg-red-50 border-red-200 ring-1 ring-red-200",
      icon: <XCircle size={11} />,
    },
  };
  const c = config[status] ?? {
    label: status,
    className: "text-slate-500 bg-slate-50 border-slate-200",
    icon: null,
  };
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${c.className}`}
    >
      {c.icon}
      {c.label}
    </span>
  );
}

// ─── Avatar ───────────────────────────────────────────────────────────────────

function Avatar({ initial }: { initial: string }) {
  return (
    <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-[11px] font-bold shrink-0">
      {initial}
    </span>
  );
}

// ─── Icon Buttons ─────────────────────────────────────────────────────────────

function ActionButtons({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
  return (
    <div className="flex items-center gap-1.5">
      {/* Edit */}
      <button
        type="button"
        onClick={onEdit}
        className="h-7 w-7 flex items-center justify-center rounded-md border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        title="Edit"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
      </button>
      {/* Delete */}
      <button
        type="button"
        onClick={onDelete}
        className="h-7 w-7 flex items-center justify-center rounded-md border border-slate-200 dark:border-slate-700 text-slate-400 hover:bg-red-50 hover:text-red-500 hover:border-red-200 dark:hover:bg-red-950 transition-colors"
        title="Hapus"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6l-1 14H6L5 6" />
          <path d="M10 11v6M14 11v6" />
          <path d="M9 6V4h6v2" />
        </svg>
      </button>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CreateOrder() {
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  return (
    <div className="w-full space-y-5 p-6">

      {/* ── Stats cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm px-5 py-4 space-y-1"
          >
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">{label}</p>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* ── Search & Filter ── */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Cari ID atau pelanggan..."
            readOnly
            className="w-full pl-9 pr-4 h-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-700 dark:text-slate-300 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 shadow-sm"
          />
        </div>

        {/* Status filter */}
        <div className="relative">
          <select
            disabled
            className="h-9 pl-3 pr-8 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-700 dark:text-slate-300 appearance-none shadow-sm cursor-default focus:outline-none"
          >
            <option>Semua Status</option>
          </select>
          <svg
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            width="13" height="13" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>

        {/* Spacer */}
        <div className="flex-1 hidden sm:block" />

        {/* Buat Order button */}
        <button
          type="button"
          className="inline-flex items-center gap-2 h-9 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-sm transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Buat Order
        </button>
      </div>

      {/* ── Table ── */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        {/* Table header */}
        <div className="grid grid-cols-[1fr_2fr_2fr_1.5fr_1.5fr_auto] gap-4 px-5 py-3 border-b border-slate-100 dark:border-slate-800">
          {["ORDER ID", "PELANGGAN", "TANGGAL", "STATUS", "TOTAL", ""].map((h) => (
            <span key={h} className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              {h}
            </span>
          ))}
        </div>

        {/* Table rows */}
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {ORDERS.map((row) => (
            <div
              key={row.id}
              className="grid grid-cols-[1fr_2fr_2fr_1.5fr_1.5fr_auto] gap-4 items-center px-5 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
            >
              {/* Order ID */}
              <span className="text-sm font-mono text-slate-500 dark:text-slate-400">{row.id}</span>

              {/* Customer */}
              <div className="flex items-center gap-2">
                <Avatar initial={row.initial} />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">
                  {row.customer}
                </span>
              </div>

              {/* Date */}
              <span className="text-sm text-slate-500 dark:text-slate-400">{row.date}</span>

              {/* Status */}
              <StatusBadge status={row.status} />

              {/* Total */}
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                {row.total}
              </span>

              {/* Actions */}
              <ActionButtons 
                onEdit={() => {
                  setSelectedOrderId(row.id);
                  setIsUpdateOpen(true);
                }}
                onDelete={() => {
                  setSelectedOrderId(row.id);
                  setIsDeleteOpen(true);
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ── Info badge ── */}
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <Tag size={12} />
        <span>Menampilkan 4 dari 4 order · Use Case: C — Create Order (Customer)</span>
      </div>

      {/* ── Update Modal ── */}
      {isUpdateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Update Status Order</h3>
              <button onClick={() => setIsUpdateOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>
            
            <div className="space-y-4">
              <p className="font-mono text-sm text-slate-500">{selectedOrderId}</p>
              
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Payment Status
                </label>
                <div className="relative">
                  <select className="w-full h-10 pl-3 pr-8 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/30">
                    <option>Lunas</option>
                    <option>Pending</option>
                    <option>Dibatalkan</option>
                  </select>
                  <svg className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <button onClick={() => setIsUpdateOpen(false)} className="flex-1 h-10 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                Batal
              </button>
              <button onClick={() => setIsUpdateOpen(false)} className="flex-1 h-10 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors">
                Update
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
              <h3 className="text-lg font-bold text-red-600">Hapus Order</h3>
              <button onClick={() => setIsDeleteOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>
            
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
              Apakah Anda yakin ingin menghapus catatan order ini? Tindakan ini tidak dapat dibatalkan.
            </p>

            <div className="flex items-center justify-end gap-3">
              <button onClick={() => setIsDeleteOpen(false)} className="px-4 h-10 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                Batal
              </button>
              <button onClick={() => setIsDeleteOpen(false)} className="px-4 h-10 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors">
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
