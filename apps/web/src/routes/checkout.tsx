import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { MapPin, Calendar, Clock, Ticket, CheckCircle2, ChevronLeft, ShieldCheck, CreditCard } from "lucide-react";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const [ticketCount, setTicketCount] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("CAT1");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Mock Event Data
  const event = {
    title: "Konser Sheila On 7 - Tunggu Aku Di Jakarta",
    date: "Sabtu, 24 Agustus 2024",
    time: "19:00 WIB",
    location: "Gelora Bung Karno, Jakarta",
    image: "https://images.unsplash.com/photo-1540039155733-d7696d4eb98b?q=80&w=800&auto=format&fit=crop",
  };

  // Mock Categories
  const categories = [
    { id: "FEST", name: "Festival (Standing)", price: 500000, available: true },
    { id: "CAT2", name: "CAT 2 (Seating)", price: 850000, available: true },
    { id: "CAT1", name: "CAT 1 (Seating)", price: 1200000, available: true },
    { id: "VIP", name: "VIP (Seating + Merch)", price: 2500000, available: false },
  ];

  const currentCat = categories.find(c => c.id === selectedCategory) || categories[0];
  const subtotal = currentCat.price * ticketCount;
  const adminFee = 25000;
  const total = subtotal + adminFee;

  function formatRupiah(amount: number) {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(amount);
  }

  const handleCheckout = () => {
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      // Simulate redirect to order list after 3s
      setTimeout(() => {
        navigate("/order");
      }, 3000);
    }, 1500);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl max-w-md w-full animate-in zoom-in-95 duration-500">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} />
          </div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 mb-2">Order Berhasil Dibuat!</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8">
            Terima kasih telah memesan tiket. ID Order Anda adalah <span className="font-mono font-bold text-slate-700 dark:text-slate-300">ORD-006</span>.
          </p>
          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl text-left space-y-2 mb-8">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Status Pembayaran</span>
              <span className="font-bold text-amber-600 bg-amber-100 px-2 py-0.5 rounded-md">PENDING</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Total Tagihan</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{formatRupiah(total)}</span>
            </div>
          </div>
          <p className="text-sm text-slate-400 animate-pulse">Mengalihkan ke halaman daftar order...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      {/* Navbar Minimalist */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center gap-4">
          <Link to="/cari-event" className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors">
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
            <img src={event.image} alt={event.title} className="w-full sm:w-32 h-32 object-cover rounded-2xl shadow-sm" />
            <div className="space-y-3 flex-1 text-center sm:text-left">
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 leading-tight">{event.title}</h2>
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
                    ${!cat.available ? "opacity-50 cursor-not-allowed bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800"
                      : selectedCategory === cat.id
                        ? "border-blue-500 bg-blue-50/50 dark:bg-blue-900/10 shadow-md shadow-blue-500/10 cursor-pointer"
                        : "border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-800 cursor-pointer"
                    }`}
                >
                  <div>
                    <h4 className={`font-bold ${selectedCategory === cat.id ? "text-blue-700 dark:text-blue-400" : "text-slate-700 dark:text-slate-200"}`}>
                      {cat.name}
                    </h4>
                    <p className="text-sm text-slate-500 mt-0.5">{cat.available ? "Tersedia" : "Habis Terjual"}</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-black ${selectedCategory === cat.id ? "text-blue-700 dark:text-blue-400" : "text-slate-800 dark:text-slate-100"}`}>
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
                <span className="w-8 text-center font-black text-xl text-slate-800 dark:text-slate-100">{ticketCount}</span>
                <button
                  onClick={() => setTicketCount(Math.min(5, ticketCount + 1))}
                  className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>
            <p className="text-xs text-slate-400 mt-3 text-right">Maksimal 5 tiket per transaksi.</p>
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
                  <p className="font-semibold text-slate-700 dark:text-slate-200">{currentCat.name}</p>
                  <p className="text-slate-500 mt-1">{ticketCount}x {formatRupiah(currentCat.price)}</p>
                </div>
                <span className="font-bold text-slate-800 dark:text-slate-100">{formatRupiah(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Biaya Layanan</span>
                <span className="font-bold text-slate-800 dark:text-slate-100">{formatRupiah(adminFee)}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-700 mb-8 flex justify-between items-center">
              <span className="text-slate-500 font-medium">Total Pembayaran</span>
              <span className="text-2xl font-black text-blue-600 dark:text-blue-400">{formatRupiah(total)}</span>
            </div>

            <button
              onClick={handleCheckout}
              disabled={isSubmitting}
              className={`w-full py-4 rounded-2xl font-black text-white shadow-lg transition-all flex items-center justify-center gap-2
                ${isSubmitting ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 shadow-blue-500/30 hover:shadow-blue-500/50"}`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Memproses Order...
                </>
              ) : "Lanjut ke Pembayaran"}
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
