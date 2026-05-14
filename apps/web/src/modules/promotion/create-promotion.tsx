import { useState, useMemo, useEffect } from "react";
import {
  Ticket,
  Percent,
  Activity,
  Search,
  X,
  Calendar,
  Edit3,
  Trash2,
  Plus,
  Filter,
  ChevronDown,
  ShieldAlert,
  User,
  AlertCircle,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { trpcClient, trpc } from "@/utils/trpc";
import { toast } from "sonner";

// --- Types ---
type Role = "ADMIN" | "CUSTOMER";
type DiscountType = "PERSENTASE" | "NOMINAL";

interface Promotion {
  id: string;
  code: string;
  type: DiscountType;
  value: number;
  startDate: string;
  endDate: string;
  usageLimit: number;
  usageCount: number;
}

// --- Mock Data ---
const INITIAL_PROMOS: Promotion[] = [];

// --- Helper Components ---
function TypeBadge({ type }: { type: DiscountType }) {
  if (type === "PERSENTASE") {
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-black tracking-wider bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
        PERSENTASE
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-black tracking-wider bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border border-orange-200 dark:border-orange-800">
      NOMINAL
    </span>
  );
}

function formatValue(type: DiscountType, value: number) {
  if (type === "PERSENTASE") return `${value}%`;
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
}

// --- Main Component ---
export default function PromotionList({ role = "CUSTOMER" }: { role?: Role }) {
  const queryClient = useQueryClient();
  const { data: serverPromos = [], isLoading } = useQuery(trpc.order.promotion.list.queryOptions());

  const promos: Promotion[] = useMemo(() => {
    return serverPromos.map((p: any) => ({
      id: p.promotion_id,
      code: p.promo_code,
      type: (p.discount_type === "PERCENTAGE" ? "PERSENTASE" : "NOMINAL") as DiscountType,
      value: p.discount_value,
      startDate: new Date(p.start_date).toISOString().split('T')[0],
      endDate: new Date(p.end_date).toISOString().split('T')[0],
      usageLimit: p.usage_limit,
      usageCount: p.usage_count || 0,
    }));
  }, [serverPromos]);

  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("Semua");

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedPromo, setSelectedPromo] = useState<Promotion | null>(null);
  const [modalMode, setModalMode] = useState<"create" | "update">("create");

  // Form States & Validation
  const [formData, setFormData] = useState<Partial<Promotion>>({});
  const [errorMsg, setErrorMsg] = useState("");

  const createMutation = useMutation({
    mutationFn: (data: any) => trpcClient.order.promotion.create.mutate(data),
    onSuccess: () => {
      queryClient.invalidateQueries(trpc.order.promotion.list.queryOptions());
      toast.success("Promo berhasil dibuat");
      setIsModalOpen(false);
    },
    onError: (error) => {
      setErrorMsg(error.message || "Gagal membuat promo");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => trpcClient.order.promotion.update.mutate(data),
    onSuccess: () => {
      queryClient.invalidateQueries(trpc.order.promotion.list.queryOptions());
      toast.success("Promo berhasil diupdate");
      setIsModalOpen(false);
    },
    onError: (error) => {
      setErrorMsg(error.message || "Gagal mengupdate promo");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => trpcClient.order.promotion.delete.mutate({ promotionId: id }),
    onSuccess: () => {
      queryClient.invalidateQueries(trpc.order.promotion.list.queryOptions());
      toast.success("Promo berhasil dihapus");
      setIsDeleteOpen(false);
    },
    onError: (error) => {
      toast.error(error.message || "Gagal menghapus promo");
    },
  });

  // Derived Filters
  const filteredPromos = useMemo(() => {
    let result = [...promos];
    if (searchQuery) {
      result = result.filter((p) => p.code.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    if (typeFilter !== "Semua") {
      result = result.filter((p) => p.type === typeFilter.toUpperCase());
    }
    return result;
  }, [promos, searchQuery, typeFilter]);

  // Derived Stats
  const stats = useMemo(() => {
    const totalPromo = filteredPromos.length;
    const totalUsage = filteredPromos.reduce((acc, p) => acc + p.usageCount, 0);
    const totalPersentase = filteredPromos.filter((p) => p.type === "PERSENTASE").length;

    return [
      { label: "Total Promo", value: totalPromo, icon: Ticket, color: "text-blue-500" },
      {
        label: "Total Penggunaan",
        value: `${totalUsage}x`,
        icon: Activity,
        color: "text-emerald-500",
      },
      { label: "Tipe Persentase", value: totalPersentase, icon: Percent, color: "text-purple-500" },
    ];
  }, [filteredPromos]);

  // Actions
  const handleOpenCreate = () => {
    setModalMode("create");
    setFormData({ type: "PERSENTASE", usageCount: 0 });
    setErrorMsg("");
    setIsModalOpen(true);
  };

  const handleOpenUpdate = (promo: Promotion) => {
    setModalMode("update");
    setFormData({ ...promo });
    setErrorMsg("");
    setSelectedPromo(promo);
    setIsModalOpen(true);
  };

  const handleSavePromo = () => {
    // Validations
    if (!formData.code || formData.code.trim() === "")
      return setErrorMsg("Kode promo wajib diisi.");
    if (!formData.value || Number(formData.value) <= 0)
      return setErrorMsg("Nilai diskon harus lebih dari 0.");
    if (!formData.startDate) return setErrorMsg("Tanggal mulai wajib diisi.");
    if (!formData.endDate) return setErrorMsg("Tanggal berakhir wajib diisi.");
    if (new Date(formData.endDate) < new Date(formData.startDate))
      return setErrorMsg("Tanggal berakhir tidak valid (sebelum tanggal mulai).");
    if (!formData.usageLimit || Number(formData.usageLimit) <= 0)
      return setErrorMsg("Batas penggunaan harus bilangan bulat positif.");

    // Unique Check for Create
    if (
      modalMode === "create" &&
      promos.some((p) => p.code.toLowerCase() === formData.code?.toLowerCase())
    ) {
      return setErrorMsg("Kode promo sudah ada, gunakan kode unik lainnya.");
    }

    // Unique Check for Update
    if (
      modalMode === "update" &&
      promos.some(
        (p) => p.code.toLowerCase() === formData.code?.toLowerCase() && p.id !== selectedPromo?.id,
      )
    ) {
      return setErrorMsg("Kode promo sudah digunakan oleh promo lain.");
    }

    if (modalMode === "create") {
      createMutation.mutate({
        promoCode: formData.code.toUpperCase(),
        discountType: formData.type === "PERSENTASE" ? "PERCENTAGE" : "NOMINAL",
        discountValue: Number(formData.value),
        startDate: formData.startDate,
        endDate: formData.endDate,
        usageLimit: Number(formData.usageLimit),
      });
    } else {
      updateMutation.mutate({
        promotionId: selectedPromo!.id,
        promoCode: formData.code!.toUpperCase(),
        discountType: formData.type === "PERSENTASE" ? "PERCENTAGE" : "NOMINAL",
        discountValue: Number(formData.value),
        startDate: formData.startDate!,
        endDate: formData.endDate!,
        usageLimit: Number(formData.usageLimit),
      });
    }
  };

  const handleDelete = () => {
    if (selectedPromo) {
      deleteMutation.mutate(selectedPromo.id);
    }
  };

  return (
    <div className="w-full space-y-6 p-6 max-w-7xl mx-auto">

      {/* --- Header --- */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100">
            Manajemen Promosi
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Kelola kode promo dan kampanye diskon untuk pelanggan.
          </p>
        </div>
        {role === "ADMIN" && (
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-md shadow-blue-500/20 transition-all"
          >
            <Plus size={18} strokeWidth={3} />
            Buat Promo Baru
          </button>
        )}
      </div>

      {/* --- Stats --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map(({ label, value, icon: Icon, color }, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm px-6 py-5 flex items-center justify-between group hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
          >
            <div className="space-y-1">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                {label}
              </p>
              <p className="text-3xl font-black text-slate-800 dark:text-slate-100">{value}</p>
            </div>
            <div
              className={`p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 ${color} group-hover:scale-110 transition-transform`}
            >
              <Icon size={28} />
            </div>
          </div>
        ))}
      </div>

      {/* --- Filters --- */}
      <div className="flex flex-col sm:flex-row gap-3 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Cari kode promo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
          />
        </div>
        <div className="relative w-full sm:w-auto">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Filter size={14} className="text-slate-400" />
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="h-10 pl-9 pr-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-medium appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/30 cursor-pointer w-full"
          >
            <option value="Semua">Semua Tipe Diskon</option>
            <option value="Persentase">Persentase</option>
            <option value="Nominal">Nominal</option>
          </select>
          <ChevronDown
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            size={16}
          />
        </div>
      </div>

      {/* --- Table --- */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <div className="min-w-225">
            <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr_1fr_1fr_auto] gap-4 px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
              {[
                "KODE PROMO",
                "TIPE DISKON",
                "NILAI",
                "TGL MULAI",
                "TGL BERAKHIR",
                "PENGGUNAAN",
                role === "ADMIN" ? "AKSI" : "",
              ].map((h, i) => (
                <span
                  key={i}
                  className="text-[11px] font-bold text-slate-400 uppercase tracking-widest"
                >
                  {h}
                </span>
              ))}
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {isLoading ? (
                <div className="px-6 py-12 flex items-center justify-center text-slate-400">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : filteredPromos.length > 0 ? (
                filteredPromos.map((row) => (
                  <div
                    key={row.id}
                    className="grid grid-cols-[1.5fr_1fr_1fr_1fr_1fr_1fr_auto] gap-4 items-center px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
                        <Ticket size={16} />
                      </div>
                      <span className="font-mono font-bold text-slate-800 dark:text-slate-200 text-sm">
                        {row.code}
                      </span>
                    </div>

                    <div>
                      <TypeBadge type={row.type} />
                    </div>

                    <span className="text-sm font-black text-slate-700 dark:text-slate-300">
                      {formatValue(row.type, row.value)}
                    </span>

                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                      {row.startDate}
                    </span>
                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                      {row.endDate}
                    </span>

                    <div className="flex items-center gap-2">
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
                        <div
                          className="bg-blue-500 h-1.5 rounded-full"
                          style={{
                            width: `${Math.min(100, (row.usageCount / row.usageLimit) * 100)}%`,
                          }}
                        ></div>
                      </div>
                      <span className="text-xs font-bold text-slate-600 dark:text-slate-400 whitespace-nowrap">
                        {row.usageCount} / {row.usageLimit}
                      </span>
                    </div>

                    <div className="w-20 flex justify-end">
                      {role === "ADMIN" && (
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleOpenUpdate(row)}
                            className="p-1.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-md transition-colors border border-transparent hover:border-blue-200 dark:hover:border-blue-800"
                            title="Edit Promo"
                          >
                            <Edit3 size={16} />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedPromo(row);
                              setIsDeleteOpen(true);
                            }}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-md transition-colors border border-transparent hover:border-red-200 dark:hover:border-red-800"
                            title="Hapus Promo"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-6 py-12 flex flex-col items-center justify-center text-slate-400">
                  <Ticket size={32} className="text-slate-300 dark:text-slate-600 mb-3" />
                  <p className="text-sm font-medium">Tidak ada promo yang ditemukan.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* --- CUD Modal (Admin Only) --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-black text-slate-800 dark:text-slate-100">
                {modalMode === "create" ? "Buat Promo Baru" : "Update Promo"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-full transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex gap-2 items-start text-red-600 dark:text-red-400 text-sm">
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                <span className="font-medium">{errorMsg}</span>
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Kode Promo
                </label>
                <input
                  type="text"
                  value={formData.code || ""}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="CTH. TIKTAK20"
                  className="w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-sm font-mono focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 transition-colors uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    Tipe Diskon
                  </label>
                  <div className="relative">
                    <select
                      value={formData.type}
                      onChange={(e) =>
                        setFormData({ ...formData, type: e.target.value as DiscountType })
                      }
                      className="w-full h-11 pl-4 pr-8 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-sm font-medium appearance-none focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
                    >
                      <option value="PERSENTASE">Persentase (%)</option>
                      <option value="NOMINAL">Nominal (Rp)</option>
                    </select>
                    <ChevronDown
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
                      size={16}
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    Nilai Diskon
                  </label>
                  <input
                    type="number"
                    value={formData.value || ""}
                    onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
                    placeholder={formData.type === "PERSENTASE" ? "cth. 20" : "cth. 50000"}
                    className="w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    Tanggal Mulai
                  </label>
                  <input
                    type="date"
                    value={formData.startDate || ""}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-sm font-medium focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    Tanggal Berakhir
                  </label>
                  <input
                    type="date"
                    value={formData.endDate || ""}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-sm font-medium focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Batas Maksimal Penggunaan
                </label>
                <input
                  type="number"
                  value={formData.usageLimit || ""}
                  onChange={(e) => setFormData({ ...formData, usageLimit: Number(e.target.value) })}
                  placeholder="Jumlah kuota promo"
                  className="w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
                />
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 h-11 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleSavePromo}
                disabled={createMutation.isPending || updateMutation.isPending}
                className="flex-1 h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center"
              >
                {createMutation.isPending || updateMutation.isPending ? "Menyimpan..." : modalMode === "create" ? "Buat Promo" : "Simpan Perubahan"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- Delete Confirm Modal --- */}
      {isDeleteOpen && selectedPromo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-200 dark:border-slate-800 text-center animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldAlert size={28} />
            </div>

            <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 mb-2">
              Hapus Promo?
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
              Apakah Anda yakin ingin menghapus promo{" "}
              <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                {selectedPromo.code}
              </span>{" "}
              secara permanen?
            </p>

            <div className="flex flex-col gap-2">
              <button
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
                className="w-full h-11 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-bold shadow-lg shadow-red-500/30 transition-all flex items-center justify-center"
              >
                {deleteMutation.isPending ? "Menghapus..." : "Ya, Hapus Promo"}
              </button>
              <button
                onClick={() => setIsDeleteOpen(false)}
                className="w-full h-11 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
