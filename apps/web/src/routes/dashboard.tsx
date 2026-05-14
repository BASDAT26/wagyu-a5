import {
  Users,
  Calendar,
  TrendingUp,
  Ticket,
  MapPin,
  ArrowUpRight,
  Music,
  ChevronRight,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import { trpc } from "@/utils/trpc";
import { Button } from "@wagyu-a5/ui/components/button";
import { Link } from "react-router";

export default function DashboardPage() {
  const { data: session, isPending } = authClient.useSession();
  const role = session?.user?.role;
  const dashboardQuery = useQuery({
    ...trpc.dashboard.summary.queryOptions(),
    enabled: !isPending && !!session,
  });
  const dashboard = dashboardQuery.data as DashboardSummary | undefined;

  if (isPending || dashboardQuery.isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20 p-6 font-sans">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white dark:bg-slate-900 rounded-[24px] p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
              Loading dashboard...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (dashboardQuery.isError) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20 p-6 font-sans">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white dark:bg-slate-900 rounded-[24px] p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
              Gagal memuat dashboard. Coba lagi nanti.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const adminData = dashboard?.role === "ADMIN" ? dashboard : undefined;
  const organizerData = dashboard?.role === "ORGANIZER" ? dashboard : undefined;
  const customerData = dashboard?.role === "CUSTOMER" ? dashboard : undefined;

  return (
    <div className="min-h-screen pb-20 p-6 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* =========================================
            ADMIN DASHBOARD 
        ========================================= */}
        {role === "ADMIN" && <AdminDashboard data={adminData} />}

        {/* =========================================
            ORGANIZER DASHBOARD 
        ========================================= */}
        {role === "ORGANIZER" && <OrganizerDashboard data={organizerData} />}

        {/* =========================================
            CUSTOMER DASHBOARD 
        ========================================= */}
        {role === "CUSTOMER" && <CustomerDashboard data={customerData} />}
      </div>
    </div>
  );
}

function AdminDashboard({ data }: { data?: AdminSummary }) {
  const displayName = data?.user?.displayName ?? "Administrator";
  const stats = data?.stats ?? {
    totalUsers: 0,
    totalEvents: 0,
    platformRevenue: 0,
    activePromotions: 0,
    totalVenues: 0,
    reservedVenues: 0,
    maxVenueCapacity: 0,
    promoPercentageCount: 0,
    promoNominalCount: 0,
    promoTotalUsage: 0,
  };

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
      <div className="bg-[#2A3441] dark:bg-[#1E2530] rounded-[24px] p-8 sm:p-10 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 shadow-xl shadow-slate-200/50 dark:shadow-none">
        <div>
          <p className="text-sm text-slate-400 mb-1 font-semibold tracking-wide">Administrator</p>
          <h1 className="text-3xl font-black mb-2 tracking-tight">{displayName}</h1>
          <p className="text-sm text-slate-300">Pantau dan kelola platform TikTakTuk</p>
        </div>
        <Link to={"/promotion"}>
          <Button>Promosi</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-4xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex items-start justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
              Total Pengguna
            </p>
            <p className="text-2xl font-black text-slate-800 dark:text-slate-100 mb-1">
              {formatNumber(stats.totalUsers)}
            </p>
            <p className="text-[13px] text-slate-500 dark:text-slate-400 font-medium">
              Pengguna aktif
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <Users size={24} />
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-4xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex items-start justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
              Total Acara
            </p>
            <p className="text-2xl font-black text-slate-800 dark:text-slate-100 mb-1">
              {formatNumber(stats.totalEvents)}
            </p>
            <p className="text-[13px] text-slate-500 dark:text-slate-400 font-medium">Bulan ini</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <Calendar size={24} />
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-4xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex items-start justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
              Omzet Platform
            </p>
            <p className="text-2xl font-black text-slate-800 dark:text-slate-100 mb-1">
              {formatCurrency(stats.platformRevenue)}
            </p>
            <p className="text-[13px] text-slate-500 dark:text-slate-400 font-medium">
              Gross volume
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 dark:text-purple-400">
            <TrendingUp size={24} />
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-4xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex items-start justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
              Promosi Aktif
            </p>
            <p className="text-2xl font-black text-slate-800 dark:text-slate-100 mb-1">
              {formatNumber(stats.activePromotions)}
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-[24px] p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
              Infrastruktur Venue
            </h3>
            <ArrowUpRight size={20} className="text-slate-400 dark:text-slate-500" />
          </div>
          <div className="space-y-5 mb-10">
            <div className="flex justify-between items-center text-[15px]">
              <span className="text-slate-500 dark:text-slate-400 font-medium">
                Total Venue Terdaftar
              </span>
              <span className="font-bold text-slate-800 dark:text-slate-100">
                {formatNumber(stats.totalVenues)} Lokasi
              </span>
            </div>
            <div className="flex justify-between items-center text-[15px]">
              <span className="text-slate-500 dark:text-slate-400 font-medium">
                Reserved Seating
              </span>
              <span className="font-bold text-slate-800 dark:text-slate-100">
                {formatNumber(stats.reservedVenues)} Venue
              </span>
            </div>
            <div className="flex justify-between items-center text-[15px]">
              <span className="text-slate-500 dark:text-slate-400 font-medium">
                Kapasitas Terbesar
              </span>
              <span className="font-bold text-slate-800 dark:text-slate-100">
                {formatNumber(stats.maxVenueCapacity)} Kursi
              </span>
            </div>
          </div>
          <Link to={"/venue"}>
            <button className="w-full py-3.5 rounded-xl border-2 border-slate-100 dark:border-slate-800 font-bold text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              Kelola Venue
            </button>
          </Link>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-[24px] p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
              Marketing & Promosi
            </h3>
            <ArrowUpRight size={20} className="text-slate-400 dark:text-slate-500" />
          </div>
          <div className="space-y-5 mb-10">
            <div className="flex justify-between items-center text-[15px]">
              <span className="text-slate-500 dark:text-slate-400 font-medium">
                Promo Persentase
              </span>
              <span className="font-bold text-slate-800 dark:text-slate-100">
                {formatNumber(stats.promoPercentageCount)} Aktif
              </span>
            </div>
            <div className="flex justify-between items-center text-[15px]">
              <span className="text-slate-500 dark:text-slate-400 font-medium">
                Promo Potongan Nominal
              </span>
              <span className="font-bold text-slate-800 dark:text-slate-100">
                {formatNumber(stats.promoNominalCount)} Aktif
              </span>
            </div>
            <div className="flex justify-between items-center text-[15px]">
              <span className="text-slate-500 dark:text-slate-400 font-medium">
                Total Penggunaan
              </span>
              <span className="font-bold text-slate-800 dark:text-slate-100">
                {formatNumber(stats.promoTotalUsage)} Kali
              </span>
            </div>
          </div>
          <Link to={"/promotion"}>
            <button className="w-full py-3.5 rounded-xl border-2 border-slate-100 dark:border-slate-800 font-bold text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              Kelola Promosi
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

function OrganizerDashboard({ data }: { data?: OrganizerSummary }) {
  const displayName = data?.user?.displayName ?? "Organizer";
  const stats = data?.stats ?? {
    activeEvents: 0,
    ticketsSold: 0,
    revenue: 0,
    venuePartners: 0,
  };
  const events = data?.events ?? [];

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
      <div className="bg-[#1A1F2B] dark:bg-[#12161E] rounded-[24px] p-8 sm:p-10 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 shadow-xl shadow-slate-200/50 dark:shadow-none">
        <div>
          <p className="text-sm text-slate-400 mb-1 font-semibold tracking-wide">
            Dashboard Penyelenggara
          </p>
          <h1 className="text-3xl font-black mb-2 tracking-tight">{displayName}</h1>
          <p className="text-sm text-slate-400">Kelola 3 acara aktif Anda</p>
        </div>
        <div className="flex gap-3">
          <Link to={"/event"}>
            <Button>Kelola Acara</Button>
          </Link>
          <Link to={"/venue"}>
            <Button variant={"secondary"}>Venue</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-4xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex items-start justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
              Acara Aktif
            </p>
            <p className="text-2xl font-black text-slate-800 dark:text-slate-100 mb-1">
              {formatNumber(stats.activeEvents)}
            </p>
            <p className="text-[13px] text-slate-500 dark:text-slate-400 font-medium">
              Dalam koordinasi
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <Calendar size={24} />
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-4xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex items-start justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
              Tiket Terjual
            </p>
            <p className="text-2xl font-black text-slate-800 dark:text-slate-100 mb-1">
              {formatNumber(stats.ticketsSold)}
            </p>
            <p className="text-[13px] text-slate-500 dark:text-slate-400 font-medium">
              Total terjual
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <Ticket size={24} />
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-4xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex items-start justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
              Revenue
            </p>
            <p className="text-2xl font-black text-slate-800 dark:text-slate-100 mb-1">
              {formatCurrency(stats.revenue)}
            </p>
            <p className="text-[13px] text-slate-500 dark:text-slate-400 font-medium">Bulan ini</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 dark:text-purple-400">
            <TrendingUp size={24} />
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-4xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex items-start justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
              Venue Mitra
            </p>
            <p className="text-2xl font-black text-slate-800 dark:text-slate-100 mb-1">
              {formatNumber(stats.venuePartners)}
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

      <div className="bg-white dark:bg-slate-900 rounded-[24px] p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex justify-between items-start mb-6 border-b border-slate-100 dark:border-slate-800 pb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Performa Acara</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Status acara yang Anda kelola
            </p>
          </div>
          <Link to={"/event"}>
            <Button variant={"link"} className="text-blue-500">
              Lihat Semua
            </Button>
          </Link>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {events.length === 0 ? (
            <div className="py-6 text-sm text-slate-500 dark:text-slate-400">
              Belum ada acara untuk ditampilkan.
            </div>
          ) : (
            events.map((item, idx) => (
              <div
                key={`${item.title}-${idx}`}
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
                      <TrendingUp size={14} /> {item.soldPercent}% terjual
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin size={14} /> {item.location}
                    </span>
                  </div>
                </div>
                <ChevronRight
                  size={18}
                  className="text-slate-400 group-hover:text-blue-600 transition-colors"
                />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function CustomerDashboard({ data }: { data?: CustomerSummary }) {
  const displayName = data?.user?.displayName ?? "Pelanggan";
  const stats = data?.stats ?? {
    activeTickets: 0,
    eventsJoined: 0,
    availablePromos: 0,
    totalSpend: 0,
  };
  const upcomingTickets = data?.upcomingTickets ?? [];

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
      <div className="bg-[#2563EB] dark:bg-blue-700 rounded-[24px] p-8 sm:p-10 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 shadow-xl shadow-blue-500/20 dark:shadow-none">
        <div>
          <p className="text-sm text-blue-100 mb-1 font-medium tracking-wide">
            Selamat datang kembali
          </p>
          <h1 className="text-3xl font-black mb-2 tracking-tight">{displayName}</h1>
          <p className="text-sm text-blue-100">3 acara menarik menunggu Anda</p>
        </div>
        <Link to={"/event"}>
          <Button>Cari Tiket</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-4xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex items-start justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
              Tiket Aktif
            </p>
            <p className="text-2xl font-black text-slate-800 dark:text-slate-100 mb-1">
              {formatNumber(stats.activeTickets)}
            </p>
            <p className="text-[13px] text-slate-500 dark:text-slate-400 font-medium">
              Siap digunakan
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <Ticket size={24} />
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-4xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex items-start justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
              Acara Diikuti
            </p>
            <p className="text-2xl font-black text-slate-800 dark:text-slate-100 mb-1">
              {formatNumber(stats.eventsJoined)}
            </p>
            <p className="text-[13px] text-slate-500 dark:text-slate-400 font-medium">
              Total pengalaman
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <Calendar size={24} />
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-4xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex items-start justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
              Kode Promo
            </p>
            <p className="text-2xl font-black text-slate-800 dark:text-slate-100 mb-1">
              {formatNumber(stats.availablePromos)}
            </p>
            <p className="text-[13px] text-slate-500 dark:text-slate-400 font-medium">
              Tersedia untuk Anda
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 dark:text-purple-400">
            <TrendingUp size={24} />
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-4xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex items-start justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
              Total Belanja
            </p>
            <p className="text-2xl font-black text-slate-800 dark:text-slate-100 mb-1">
              {formatCurrency(stats.totalSpend)}
            </p>
            <p className="text-[13px] text-slate-500 dark:text-slate-400 font-medium">Bulan ini</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-orange-600 dark:text-orange-400">
            <Music size={24} />
          </div>
        </div>
      </div>

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
          <Link to={"/ticket"}>
            <Button variant={"link"} className="text-blue-500">
              Lihat Semua
            </Button>
          </Link>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {upcomingTickets.length === 0 ? (
            <div className="py-6 text-sm text-slate-500 dark:text-slate-400">
              Belum ada tiket mendatang.
            </div>
          ) : (
            upcomingTickets.map((item, idx) => (
              <div
                key={`${item.title}-${idx}`}
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
                      <Calendar size={14} /> {formatDate(item.date)}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin size={14} /> {item.location}
                    </span>
                  </div>
                </div>
                <ChevronRight
                  size={18}
                  className="text-slate-400 group-hover:text-blue-600 transition-colors"
                />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

type AdminSummary = {
  role: "ADMIN";
  user: DashboardUser;
  stats: {
    totalUsers: number;
    totalEvents: number;
    platformRevenue: number;
    activePromotions: number;
    totalVenues: number;
    reservedVenues: number;
    maxVenueCapacity: number;
    promoPercentageCount: number;
    promoNominalCount: number;
    promoTotalUsage: number;
  };
};

type OrganizerSummary = {
  role: "ORGANIZER";
  user: DashboardUser;
  stats: {
    activeEvents: number;
    ticketsSold: number;
    revenue: number;
    venuePartners: number;
  };
  events: Array<{
    title: string;
    soldPercent: number;
    location: string;
  }>;
};

type CustomerSummary = {
  role: "CUSTOMER";
  user: DashboardUser;
  stats: {
    activeTickets: number;
    eventsJoined: number;
    availablePromos: number;
    totalSpend: number;
  };
  upcomingTickets: Array<{
    title: string;
    tag: string;
    date: string;
    location: string;
  }>;
};

type DashboardSummary = AdminSummary | OrganizerSummary | CustomerSummary;

type DashboardUser = {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "ORGANIZER" | "CUSTOMER";
  displayName: string;
};

const currencyFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

function formatCurrency(value: number) {
  return currencyFormatter.format(value);
}

function formatNumber(value: number) {
  return value.toLocaleString("id-ID");
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
