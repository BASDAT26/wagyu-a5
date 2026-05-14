import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router";
import {
  MapPin,
  Calendar,
  Clock,
  Ticket,
  CheckCircle2,
  ChevronLeft,
  ShieldCheck,
  CreditCard,
  Tag,
  Armchair,
  AlertCircle,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { trpc, trpcClient, queryClient } from "@/utils/trpc";
import { toast } from "sonner";

// Removed mock PROMOS

// --- Mock Seats (6x8 grid) ---
const TOTAL_ROWS = 6;
const SEATS_PER_ROW = 8;
const TAKEN_SEATS = new Set([
  "A3",
  "A4",
  "B2",
  "B5",
  "C1",
  "C6",
  "D3",
  "D4",
  "D7",
  "E2",
  "F5",
  "F6",
]);

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { data: session } = authClient.useSession();
  const [ticketCount, setTicketCount] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("CAT1");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<{code: string, type: "PERSENTASE" | "NOMINAL", value: number} | null>(null);
  const [promoError, setPromoError] = useState("");
  const [isCheckingPromo, setIsCheckingPromo] = useState(false);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);

  // Mock Event Data
  const event = {
    title: "Konser Sheila On 7 - Tunggu Aku Di Jakarta",
    date: "Sabtu, 24 Agustus 2024",
    time: "19:00 WIB",
    location: "Gelora Bung Karno, Jakarta",
    image:
      "https://images.unsplash.com/photo-1540039155733-d7696d4eb98b?q=80&w=800&auto=format&fit=crop",
  };

  // Mock Categories
  const categories = [
    { id: "FEST", name: "Festival (Standing)", price: 500000, available: true },
    { id: "CAT2", name: "CAT 2 (Seating)", price: 850000, available: true },
    { id: "CAT1", name: "CAT 1 (Seating)", price: 1200000, available: true },
    {
      id: "VIP",
      name: "VIP (Seating + Merch)",
      price: 2500000,
      available: false,
    },
  ];

  const currentCat = categories.find((c) => c.id === selectedCategory) || categories[0];
  const isSeatingCategory = currentCat.id !== "FEST";
  const subtotal = currentCat.price * ticketCount;
  const adminFee = 25000;

  const discount = useMemo(() => {
    if (!appliedPromo) return 0;
    if (appliedPromo.type === "PERSENTASE")
      return Math.floor((subtotal * appliedPromo.value) / 100);
    return Math.min(appliedPromo.value, subtotal);
  }, [appliedPromo, subtotal]);

  const total = subtotal - discount + adminFee;

  const handleApplyPromo = async () => {
    setPromoError("");
    const code = promoCode.toUpperCase().trim();
    if (!code) {
      setPromoError("Masukkan kode promo.");
      return;
    }
    
    setIsCheckingPromo(true);
    try {
      const found = await trpcClient.order.promotion.getByCode.query({ promoCode: code });
      
      if (!found) {
        setPromoError("Kode promo tidak valid atau tidak ditemukan.");
        setAppliedPromo(null);
        return;
      }
      
      // Date validations
      const now = new Date();
      if (new Date(found.start_date) > now) {
        setPromoError("Kode promo belum berlaku.");
        setAppliedPromo(null);
        return;
      }
      if (new Date(found.end_date) < now) {
        setPromoError("Kode promo sudah kadaluarsa.");
        setAppliedPromo(null);
        return;
      }
      if (found.usage_count + ticketCount > found.usage_limit) {
        setPromoError(`Sisa kuota promo tidak mencukupi (Sisa: ${found.usage_limit - found.usage_count}).`);
        setAppliedPromo(null);
        return;
      }

      setAppliedPromo({
        code: found.promo_code,
        type: found.discount_type === "PERCENTAGE" ? "PERSENTASE" : "NOMINAL",
        value: found.discount_value
      });
    } catch (e) {
      setPromoError("Terjadi kesalahan saat memverifikasi promo.");
    } finally {
      setIsCheckingPromo(false);
    }
  };

  const handleToggleSeat = (seatId: string) => {
    if (TAKEN_SEATS.has(seatId)) return;
    setSelectedSeats((prev) => {
      if (prev.includes(seatId)) return prev.filter((s) => s !== seatId);
      if (prev.length >= ticketCount) return prev;
      return [...prev, seatId];
    });
  };

  function formatRupiah(amount: number) {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  }

  const orderCode = createdOrderId?.slice(0, 8).toUpperCase() ?? "--------";
  const customerName = session?.user?.name ?? "Customer";
  const handleCheckout = async () => {
    if (!session?.user?.id) {
      toast.error("Silakan login terlebih dahulu.");
      return;
    }
    setIsSubmitting(true);
    try {
      const createdOrder = await trpcClient.order.order.createForCurrentUser.mutate({
        orderDate: new Date().toISOString(),
        paymentStatus: "PENDING",
        totalAmount: total,
        promoCode: appliedPromo?.code,
        ticketCount: ticketCount,
      });
      setCreatedOrderId(createdOrder.order_id as string);
      await queryClient.invalidateQueries(trpc.order.order.listForCurrentUser.queryOptions());
      setIsSuccess(true);
      setTimeout(() => {
        navigate("/order");
      }, 3000);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Gagal membuat order";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl max-w-md w-full animate-in zoom-in-95 duration-500">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} />
          </div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 mb-2">
            Order Berhasil Dibuat!
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8">
            Terima kasih, <span className="font-semibold">{customerName}</span>! ID Order Anda
            adalah{" "}
            <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
              ORD-{orderCode}
            </span>
            .
          </p>
          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl text-left space-y-2 mb-8">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Status Pembayaran</span>
              <span className="font-bold text-amber-600 bg-amber-100 px-2 py-0.5 rounded-md">
                PENDING
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Total Tagihan</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {formatRupiah(total)}
              </span>
            </div>
          </div>
          <p className="text-sm text-slate-400 animate-pulse">
            Mengalihkan ke halaman daftar order...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      {/* Navbar Minimalist */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center gap-4">
          <Link
            to="/cari-event"
            className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
          >
            <ChevronLeft size={20} />
          </Link>
          <h1 className="text-lg font-bold text-slate-800 dark:text-slate-100">Checkout Tiket</h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 mt-4">
        {/* Left Column: Form & Selection */}
        <div className="lg:col-span-7 space-y-8">
          {/* Event Summary */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row gap-6 items-center sm:items-start">
            <img
              src={event.image}
              alt={event.title}
              className="w-full sm:w-32 h-32 object-cover rounded-2xl shadow-sm"
            />
            <div className="space-y-3 flex-1 text-center sm:text-left">
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 leading-tight">
                {event.title}
              </h2>
              <div className="space-y-1.5 text-sm font-medium text-slate-500 dark:text-slate-400">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <Calendar size={14} className="text-blue-500" /> {event.date}
                </div>
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <Clock size={14} className="text-amber-500" /> {event.time}
                </div>
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <MapPin size={14} className="text-rose-500" /> {event.location}
                </div>
              </div>
            </div>
          </div>

          {/* Ticket Selection */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
              <Ticket className="text-blue-500" size={20} /> Pilih Kategori Tiket
            </h3>

            <div className="space-y-3">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  onClick={() => cat.available && setSelectedCategory(cat.id)}
                  className={`p-4 rounded-2xl border-2 transition-all flex items-center justify-between
                    ${
                      !cat.available
                        ? "opacity-50 cursor-not-allowed bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800"
                        : selectedCategory === cat.id
                          ? "border-blue-500 bg-blue-50/50 dark:bg-blue-900/10 shadow-md shadow-blue-500/10 cursor-pointer"
                          : "border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-800 cursor-pointer"
                    }`}
                >
                  <div>
                    <h4
                      className={`font-bold ${selectedCategory === cat.id ? "text-blue-700 dark:text-blue-400" : "text-slate-700 dark:text-slate-200"}`}
                    >
                      {cat.name}
                    </h4>
                    <p className="text-sm text-slate-500 mt-0.5">
                      {cat.available ? "Tersedia" : "Habis Terjual"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-black ${selectedCategory === cat.id ? "text-blue-700 dark:text-blue-400" : "text-slate-800 dark:text-slate-100"}`}
                    >
                      {formatRupiah(cat.price)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Quantity */}
            <div className="mt-8 flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
              <span className="font-bold text-slate-700 dark:text-slate-200">Jumlah Tiket</span>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setTicketCount(Math.max(1, ticketCount - 1))}
                  className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center"
                >
                  -
                </button>
                <span className="w-8 text-center font-black text-xl text-slate-800 dark:text-slate-100">
                  {ticketCount}
                </span>
                <button
                  onClick={() => setTicketCount(Math.min(10, ticketCount + 1))}
                  className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>
            <p className="text-xs text-slate-400 mt-3 text-right">
              Maksimal 10 tiket per transaksi.
            </p>
          </div>

          {/* Seat Selection (Optional) */}
          {isSeatingCategory && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2 flex items-center gap-2">
                <Armchair className="text-blue-500" size={20} /> Pilih Kursi (Opsional)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                Pilih hingga {ticketCount} kursi. Abu-abu = terisi.
              </p>
              <div className="flex flex-col items-center gap-2">
                <div className="w-2/3 h-3 bg-slate-300 dark:bg-slate-700 rounded-b-lg mb-3 text-center text-[9px] font-bold text-slate-500 leading-3">
                  PANGGUNG
                </div>
                {Array.from({ length: TOTAL_ROWS }, (_, r) => {
                  const rowLabel = String.fromCharCode(65 + r);
                  return (
                    <div key={rowLabel} className="flex items-center gap-1.5">
                      <span className="w-5 text-[10px] font-bold text-slate-400 text-right">
                        {rowLabel}
                      </span>
                      {Array.from({ length: SEATS_PER_ROW }, (_, s) => {
                        const seatId = `${rowLabel}${s + 1}`;
                        const isTaken = TAKEN_SEATS.has(seatId);
                        const isSelected = selectedSeats.includes(seatId);
                        return (
                          <button
                            key={seatId}
                            onClick={() => handleToggleSeat(seatId)}
                            disabled={isTaken}
                            title={seatId}
                            className={`w-8 h-8 rounded-md text-[10px] font-bold transition-all border ${
                              isTaken
                                ? "bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed border-transparent"
                                : isSelected
                                  ? "bg-blue-600 text-white border-blue-700 shadow-md shadow-blue-500/30"
                                  : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-400"
                            }`}
                          >
                            {s + 1}
                          </button>
                        );
                      })}
                    </div>
                  );
                })}
                {selectedSeats.length > 0 && (
                  <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold mt-2">
                    Kursi dipilih: {selectedSeats.sort().join(", ")}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Promo Code */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
              <Tag className="text-emerald-500" size={20} /> Kode Promo (Opsional)
            </h3>
            <div className="flex gap-3">
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                placeholder="Masukkan kode promo"
                className="flex-1 h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
              />
              <button
                onClick={handleApplyPromo}
                disabled={isCheckingPromo}
                className="h-11 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center min-w-[100px]"
              >
                {isCheckingPromo ? "Mengecek..." : "Terapkan"}
              </button>
            </div>
            {promoError && (
              <div className="mt-3 flex items-center gap-2 text-red-500 text-sm">
                <AlertCircle size={14} /> {promoError}
              </div>
            )}
            {appliedPromo && !promoError && (
              <div className="mt-3 p-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-700 dark:text-emerald-400 text-sm font-medium">
                ✓ Promo <span className="font-mono font-bold">{appliedPromo.code}</span> berhasil
                diterapkan! Diskon{" "}
                {appliedPromo.type === "PERSENTASE"
                  ? `${appliedPromo.value}%`
                  : formatRupiah(appliedPromo.value)}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-5">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl sticky top-24">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2">
              <CreditCard className="text-blue-500" size={20} /> Ringkasan Pesanan
            </h3>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-start text-sm">
                <div>
                  <p className="font-semibold text-slate-700 dark:text-slate-200">
                    {currentCat.name}
                  </p>
                  <p className="text-slate-500 mt-1">
                    {ticketCount}x {formatRupiah(currentCat.price)}
                  </p>
                </div>
                <span className="font-bold text-slate-800 dark:text-slate-100">
                  {formatRupiah(subtotal)}
                </span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                    Diskon ({appliedPromo?.code})
                  </span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    -{formatRupiah(discount)}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Biaya Layanan</span>
                <span className="font-bold text-slate-800 dark:text-slate-100">
                  {formatRupiah(adminFee)}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-700 mb-8 flex justify-between items-center">
              <span className="text-slate-500 font-medium">Total Pembayaran</span>
              <span className="text-2xl font-black text-blue-600 dark:text-blue-400">
                {formatRupiah(total)}
              </span>
            </div>

            <button
              onClick={handleCheckout}
              disabled={isSubmitting}
              className={`w-full py-4 rounded-2xl font-black text-white shadow-lg transition-all flex items-center justify-center gap-2
                ${isSubmitting ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 shadow-blue-500/30 hover:shadow-blue-500/50"}`}
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Memproses Order...
                </>
              ) : (
                "Lanjut ke Pembayaran"
              )}
            </button>

            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400">
              <ShieldCheck size={14} className="text-emerald-500" />
              Transaksi aman dan terenkripsi.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
