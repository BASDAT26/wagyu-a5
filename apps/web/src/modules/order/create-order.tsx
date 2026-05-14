import { useState, useMemo } from "react";
import {
  Tag,
  ShoppingCart,
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
  X,
  Filter,
  Search,
  ChevronDown,
  User,
  ShieldAlert,
  Building2,
} from "lucide-react";
import type { Role } from "@/data/type";
import { Link } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { trpcClient, trpc } from "@/utils/trpc";
import { toast } from "sonner";

// --- Types ---
type OrderStatus = "PAID" | "PENDING" | "CANCELLED";

interface Order {
  id: string;
  customer: string;
  initial: string;
  date: string; // ISO or YYYY-MM-DD HH:mm for sorting
  status: OrderStatus;
  total: number;
}

// --- Empty Data Init ---
const INITIAL_ORDERS: Order[] = [];

// --- Helper Functions ---
function formatRupiah(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

// --- Sub-components ---

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; className: string; icon: React.ReactNode }> = {
    PAID: {
      label: "Paid",
      className: "text-green-600 bg-green-50 border-green-200 ring-1 ring-green-200",
      icon: <CheckCircle size={11} />,
    },
    PENDING: {
      label: "Pending",
      className: "text-amber-600 bg-amber-50 border-amber-200 ring-1 ring-amber-200",
      icon: <Clock size={11} />,
    },
    CANCELLED: {
      label: "Cancelled",
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

function Avatar({ initial }: { initial: string }) {
  return (
    <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-[11px] font-bold shrink-0">
      {initial}
    </span>
  );
}

function ActionButtons({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
  return (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        onClick={onEdit}
        className="h-7 w-7 flex items-center justify-center rounded-md border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        title="Edit Status"
      >
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
      </button>
      <button
        type="button"
        onClick={onDelete}
        className="h-7 w-7 flex items-center justify-center rounded-md border border-slate-200 dark:border-slate-700 text-slate-400 hover:bg-red-50 hover:text-red-500 hover:border-red-200 dark:hover:bg-red-950 transition-colors"
        title="Hapus Order"
      >
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6l-1 14H6L5 6" />
          <path d="M10 11v6M14 11v6" />
          <path d="M9 6V4h6v2" />
        </svg>
      </button>
    </div>
  );
}

// --- Main Component ---
export default function OrderList({ role = "CUSTOMER" }: { role?: Role }) {
  // Visual CRUD States
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("Semua");

  const queryClient = useQueryClient();
  const { data: serverOrders = [], isLoading } = useQuery(trpc.order.order.listForCurrentUser.queryOptions());

  const orders: Order[] = useMemo(() => {
    return serverOrders.map((o: any) => ({
      id: o.order_id,
      customer: o.customer_name || "Unknown",
      initial: (o.customer_name || "U")[0].toUpperCase(),
      date: new Date(o.order_date).toLocaleString("id-ID", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      status: (o.payment_status?.toUpperCase() || "PENDING") as OrderStatus,
      total: o.total_amount,
    }));
  }, [serverOrders]);

  // Modal States
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updateStatusVal, setUpdateStatusVal] = useState<OrderStatus>("PAID");

  const updateMutation = useMutation({
    mutationFn: (data: { orderId: string; paymentStatus: string }) =>
      trpcClient.order.order.update.mutate(data),
    onSuccess: () => {
      queryClient.invalidateQueries(trpc.order.order.listForCurrentUser.queryOptions());
      toast.success("Status order berhasil diupdate");
      setIsUpdateOpen(false);
    },
    onError: (error) => {
      toast.error(error.message || "Gagal mengupdate order");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (orderId: string) => trpcClient.order.order.delete.mutate({ orderId }),
    onSuccess: () => {
      queryClient.invalidateQueries(trpc.order.order.listForCurrentUser.queryOptions());
      toast.success("Order berhasil dihapus");
      setIsDeleteOpen(false);
    },
    onError: (error) => {
      toast.error(error.message || "Gagal menghapus order");
    },
  });

  // Filter & Sort Logic
  const filteredOrders = useMemo(() => {
    let result = [...orders];

    // Simulate Role Filtering
    if (role === "CUSTOMER") {
      // Hanya lihat order Budi
      result = result.filter((o) => o.customer.includes("Budi"));
    } else if (role === "ORGANIZER") {
      // Simulate organizer seeing only partial orders
      result = result.filter((o) => o.total > 500000);
    }

    // Search Filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (o) => o.id.toLowerCase().includes(q) || o.customer.toLowerCase().includes(q),
      );
    }

    // Status Filter
    if (statusFilter !== "Semua") {
      result = result.filter((o) => o.status === statusFilter.toUpperCase());
    }

    // Default Sorting (Descending by Date)
    result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return result;
  }, [orders, role, searchQuery, statusFilter]);

  // Derived Stats
  const stats = useMemo(() => {
    const totalOrder = filteredOrders.length;
    const lunasCount = filteredOrders.filter((o) => o.status === "PAID").length;
    const pendingCount = filteredOrders.filter((o) => o.status === "PENDING").length;
    const totalRevenue = filteredOrders
      .filter((o) => o.status === "PAID")
      .reduce((sum, o) => sum + o.total, 0);

    return [
      {
        label: "Total Order",
        value: totalOrder.toString(),
        icon: ShoppingCart,
        color: "text-slate-600 dark:text-slate-300",
      },
      { label: "Paid", value: lunasCount.toString(), icon: CheckCircle, color: "text-green-500" },
      { label: "Pending", value: pendingCount.toString(), icon: Clock, color: "text-amber-500" },
      // Hanya Admin & Organizer yang melihat revenue
      ...(role !== "CUSTOMER"
        ? [
            {
              label: "Total Revenue",
              value: formatRupiah(totalRevenue),
              icon: TrendingUp,
              color: "text-blue-600 dark:text-blue-400",
            },
          ]
        : []),
    ];
  }, [filteredOrders, role]);

  // Actions
  const handleUpdateStatus = () => {
    if (selectedOrder) {
      updateMutation.mutate({
        orderId: selectedOrder.id,
        paymentStatus: updateStatusVal,
      });
    }
  };

  const handleDelete = () => {
    if (selectedOrder) {
      deleteMutation.mutate(selectedOrder.id);
    }
  };

  return (
    <div className="w-full space-y-6 p-6 max-w-7xl mx-auto">

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100">Daftar Order</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Kelola dan pantau seluruh transaksi pemesanan tiket.
          </p>
        </div>
        {role === "CUSTOMER" && (
          <Link to="/checkout" className="inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-md shadow-blue-500/20 transition-all">
            <ShoppingCart size={16} />
            Beli Tiket Baru
          </Link>
        )}
      </div>

      {/* --- Stats cards --- */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color }, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm px-5 py-4 space-y-3 relative overflow-hidden group hover:border-blue-200 dark:hover:border-blue-900 transition-colors"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Icon size={48} className={color.split(" ")[0]} />
            </div>
            <div className="flex items-center gap-2 relative z-10">
              <div className={`p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 ${color}`}>
                <Icon size={14} />
              </div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{label}</p>
            </div>
            <p className={`text-2xl font-black relative z-10 ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* --- Controls --- */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between bg-slate-50 dark:bg-slate-900/50 p-3 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="relative flex-1 max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Cari ID Order atau nama pelanggan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 shadow-sm transition-all"
          />
        </div>

        <div className="relative w-full sm:w-auto">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Filter size={14} className="text-slate-400" />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 pl-9 pr-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-medium text-slate-700 dark:text-slate-200 appearance-none shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 cursor-pointer w-full"
          >
            <option value="Semua">Semua Status</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <ChevronDown
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            size={16}
          />
        </div>
      </div>

      {/* --- Table --- */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Table header */}
            <div className="grid grid-cols-[1.2fr_2fr_1.5fr_1fr_1.5fr_auto] gap-4 px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
              {[
                "ORDER ID",
                "PELANGGAN",
                "TANGGAL",
                "STATUS",
                "TOTAL",
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

            {/* Table rows */}
            <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {isLoading ? (
                <div className="px-6 py-12 flex items-center justify-center text-slate-400">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : filteredOrders.length > 0 ? (
                filteredOrders.map((row) => (
                  <div
                    key={row.id}
                    className="grid grid-cols-[1.2fr_2fr_1.5fr_1fr_1.5fr_auto] gap-4 items-center px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <span className="text-sm font-mono font-medium text-slate-600 dark:text-slate-300">
                      {row.id.slice(0, 13)}...
                    </span>

                    <div className="flex items-center gap-3">
                      <Avatar initial={row.initial} />
                      <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
                        {row.customer}
                      </span>
                    </div>

                    <span className="text-sm text-slate-500 dark:text-slate-400">{row.date}</span>

                    <div>
                      <StatusBadge status={row.status} />
                    </div>

                    <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
                      {formatRupiah(row.total)}
                    </span>

                    <div className="w-[80px] flex justify-end">
                      {role === "ADMIN" && (
                        <ActionButtons
                          onEdit={() => {
                            setSelectedOrder(row);
                            setUpdateStatusVal(row.status);
                            setIsUpdateOpen(true);
                          }}
                          onDelete={() => {
                            setSelectedOrder(row);
                            setIsDeleteOpen(true);
                          }}
                        />
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-6 py-12 flex flex-col items-center justify-center text-slate-400">
                  <div className="h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3">
                    <Search size={24} className="text-slate-300 dark:text-slate-600" />
                  </div>
                  <p className="text-sm font-medium">Tidak ada order yang ditemukan.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* --- Update Modal --- */}
      {isUpdateOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-black text-slate-800 dark:text-slate-100">
                Update Status Order
              </h3>
              <button
                onClick={() => setIsUpdateOpen(false)}
                className="text-slate-400 hover:text-slate-600 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-full transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-5 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
              <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 pb-3">
                <span className="text-xs font-bold text-slate-500 uppercase">Order ID</span>
                <span className="font-mono text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {selectedOrder.id}
                </span>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Ubah Status Pembayaran
                </label>
                <div className="relative">
                  <select
                    value={updateStatusVal}
                    onChange={(e) => setUpdateStatusVal(e.target.value as OrderStatus)}
                    className="w-full h-11 pl-4 pr-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/30 shadow-sm appearance-none cursor-pointer"
                  >
                    <option value="PAID">Paid</option>
                    <option value="PENDING">Pending</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                  <ChevronDown
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
                    size={16}
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <button
                onClick={() => setIsUpdateOpen(false)}
                className="flex-1 h-11 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleUpdateStatus}
                disabled={updateMutation.isPending}
                className="flex-1 h-11 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center"
              >
                {updateMutation.isPending ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- Delete Modal --- */}
      {isDeleteOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-200 dark:border-slate-800 text-center animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldAlert size={28} />
            </div>

            <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 mb-2">
              Hapus Order?
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
              Anda yakin ingin menghapus order{" "}
              <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                {selectedOrder.id}
              </span>{" "}
              secara permanen? Data ini tidak dapat dikembalikan.
            </p>

            <div className="flex flex-col gap-2">
              <button
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
                className="w-full h-11 rounded-xl bg-red-600 text-white text-sm font-bold hover:bg-red-700 shadow-lg shadow-red-500/30 transition-all flex items-center justify-center"
              >
                {deleteMutation.isPending ? "Menghapus..." : "Ya, Hapus Order"}
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
