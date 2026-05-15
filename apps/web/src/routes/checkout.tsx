import { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate, useSearchParams } from "react-router";
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
  LucideMusic,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { trpc, trpcClient, queryClient } from "@/utils/trpc";
import { toast } from "sonner";

// Removed mock PROMOS

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { data: session } = authClient.useSession();
  const [ticketCount, setTicketCount] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<{
    code: string;
    type: "PERSENTASE" | "NOMINAL";
    value: number;
  } | null>(null);
  const [promoError, setPromoError] = useState("");
  const [isCheckingPromo, setIsCheckingPromo] = useState(false);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");

  const [searchParams] = useSearchParams();
  const eventId = searchParams.get("eventId");

  const { data: dbEvent, isLoading: eventLoading } = useQuery({
    ...trpc.event.event.getById.queryOptions({ eventId: eventId ?? "" }),
    enabled: !!eventId && eventId.length === 36,
  });

  const venueId = (dbEvent as any)?.venue_id;
  const { data: dbVenue } = useQuery({
    ...trpc.venue.venue.getById.queryOptions({ venueId: venueId ?? "" }),
    enabled: !!venueId,
  });
  const { data: dbSeats = [], isLoading: seatsLoading } = useQuery({
    ...trpc.venue.seat.listByVenueWithStatus.queryOptions({ venueId: venueId ?? "" }),
    enabled: !!venueId,
  });

  const seats = useMemo(() => {
    return (dbSeats as any[]).map((s) => ({
      id: s.seat_id,
      label: `${s.section} - Baris ${s.row_number}, No. ${s.seat_number}`,
      isTaken: s.is_assigned,
    }));
  }, [dbSeats]);

  const { data: dbCategories, isLoading: categoriesLoading } = useQuery(
    eventId && eventId.length === 36
      ? { ...trpc.ticket.category.listByEvent.queryOptions({ eventId }) }
      : { ...trpc.ticket.category.listAll.queryOptions() },
  );

  useEffect(() => {
    if (dbCategories && dbCategories.length > 0 && !selectedCategoryId) {
      setSelectedCategoryId(dbCategories[0].category_id);
    }
  }, [dbCategories, selectedCategoryId]);

  // Event Data from DB or fallback to Mock
  const event = {
    title: (dbEvent as any)?.event_title ?? "Memuat Event...",
    date: (dbEvent as any)?.event_datetime
      ? new Date((dbEvent as any).event_datetime).toLocaleDateString("id-ID", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "...",
    time: (dbEvent as any)?.event_datetime
      ? new Date((dbEvent as any).event_datetime).toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "...",
    location: dbVenue
      ? `${(dbVenue as any).venue_name}${(dbVenue as any).city ? `, ${(dbVenue as any).city}` : ""}`
      : "...",
    image:
      "https://images.unsplash.com/photo-1540039155733-d7696d4eb98b?q=80&w=800&auto=format&fit=crop",
  };

  // Real Categories from DB
  const categories = useMemo(() => {
    if (!dbCategories) return [];
    return (dbCategories as any[]).map((cat) => ({
      id: cat.category_id,
      name: cat.category_name,
      price: Number(cat.price),
      available: cat.quota > 0,
      quota: cat.quota,
    }));
  }, [dbCategories]);

  const currentCat = categories.find((c) => c.id === selectedCategoryId) ||
    categories[0] || { id: "", name: "", price: 0, available: false, quota: 0 };
  const isSeatingCategory =
    currentCat.name.toLowerCase().includes("seating") ||
    currentCat.name.toUpperCase().includes("CAT");
  const isReservedSeating = !!(dbVenue as any)?.reserved_seating;
  const showSeatSelection = isSeatingCategory && isReservedSeating;
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
      const foundData = found as any;
      const now = new Date();
      if (new Date(foundData.start_date) > now) {
        setPromoError("Kode promo belum berlaku.");
        setAppliedPromo(null);
        return;
      }
      if (new Date(foundData.end_date) < now) {
        setPromoError("Kode promo sudah kadaluarsa.");
        setAppliedPromo(null);
        return;
      }
      if (foundData.usage_count + ticketCount > foundData.usage_limit) {
        setPromoError(
          `Sisa kuota promo tidak mencukupi (Sisa: ${foundData.usage_limit - foundData.usage_count}).`,
        );
        setAppliedPromo(null);
        return;
      }

      setAppliedPromo({
        code: foundData.promo_code,
        type: foundData.discount_type === "PERCENTAGE" ? "PERSENTASE" : "NOMINAL",
        value: foundData.discount_value,
      });
    } catch (e) {
      setPromoError("Terjadi kesalahan saat memverifikasi promo.");
    } finally {
      setIsCheckingPromo(false);
    }
  };

  const handleToggleSeat = (seatId: string) => {
    const seat = seats.find((s) => s.id === seatId);
    if (!seat || seat.isTaken) return;
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
    if (!selectedCategoryId) {
      toast.error("Silakan pilih kategori tiket terlebih dahulu");
      return;
    }
    if (showSeatSelection && selectedSeats.length !== ticketCount) {
      toast.error(`Pilih ${ticketCount} kursi terlebih dahulu.`);
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
        categoryId: selectedCategoryId,
        seatIds: selectedSeats.length > 0 ? selectedSeats : undefined,
      });
      setCreatedOrderId((createdOrder as any).order_id as string);
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
            to="/event"
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
            <div className="w-full sm:w-32 h-32 object-cover bg-blue-600 rounded-2xl shadow-sm grid place-content-center">
              <LucideMusic />
            <div className="w-full sm:w-32 h-32 object-cover bg-blue-600 rounded-2xl shadow-sm grid place-content-center">
              <LucideMusic />
            </div>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categoriesLoading ? (
                  <div className="col-span-full py-8 text-center text-slate-400">
                    Memuat kategori tiket...
                  </div>
                ) : categories.length === 0 ? (
                  <div className="col-span-full py-8 text-center text-slate-400">
                    Tidak ada kategori tiket tersedia.
                  </div>
                ) : (
                  categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => cat.available && setSelectedCategoryId(cat.id)}
                      className={`relative p-4 rounded-xl border-2 text-left transition-all ${
                        selectedCategoryId === cat.id
                          ? "border-blue-500 bg-blue-500/10"
                          : cat.available
                            ? "border-slate-800 bg-slate-900/50 hover:border-slate-700"
                            : "border-slate-900 bg-slate-900/20 opacity-60 cursor-not-allowed"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span
                          className={`font-bold ${selectedCategoryId === cat.id ? "text-blue-400" : "text-white"}`}
                        >
                          {cat.name}
                        </span>
                        {selectedCategoryId === cat.id && (
                          <CheckCircle2 className="w-5 h-5 text-blue-500" />
                        )}
                      </div>
                      <div className="text-xl font-black text-white mb-1">
                        {formatRupiah(cat.price)}
                      </div>
                      <div className="text-xs text-slate-400">
                        {cat.available ? `Tersedia: ${cat.quota} tiket` : "Habis Terjual"}
                      </div>
                    </button>
                  ))
                )}
              </div>
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
          {showSeatSelection && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2 flex items-center gap-2">
                <Armchair className="text-blue-500" size={20} /> Pilih Kursi
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                Pilih {ticketCount} kursi. Abu-abu = terisi.
              </p>
              <div className="flex flex-col items-center gap-2">
                <div className="w-2/3 h-3 bg-slate-300 dark:bg-slate-700 rounded-b-lg mb-3 text-center text-[9px] font-bold text-slate-500 leading-3">
                  PANGGUNG
                </div>
                {seatsLoading ? (
                  <p className="text-sm text-slate-500 text-center w-full py-4">Memuat kursi...</p>
                ) : seats.length === 0 ? (
                  <p className="text-sm text-slate-500 text-center w-full py-4">
                    Tidak ada kursi tersedia.
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2 justify-center w-full">
                    {seats.map((s) => {
                      const isTaken = s.isTaken;
                      const isSelected = selectedSeats.includes(s.id);
                      return (
                        <button
                          key={s.id}
                          onClick={() => handleToggleSeat(s.id)}
                          disabled={isTaken}
                          title={s.label}
                          className={`px-3 py-1.5 rounded-md text-[10px] font-bold transition-all border ${
                            isTaken
                              ? "bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed border-transparent"
                              : isSelected
                                ? "bg-blue-600 text-white border-blue-700 shadow-md shadow-blue-500/30"
                                : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-400"
                          }`}
                        >
                          {s.label}
                        </button>
                      );
                    })}
                  </div>
                )}
                {selectedSeats.length > 0 && (
                  <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold mt-4 text-center w-full">
                    Kursi dipilih:{" "}
                    {selectedSeats
                      .map((id) => seats.find((s) => s.id === id)?.label)
                      .filter(Boolean)
                      .join(", ")}
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
                className="h-11 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center min-w-25"
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
