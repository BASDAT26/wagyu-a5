import { useState, useMemo } from "react";
import CreateTicket from "./create-ticket";
import UpdateTicket from "./update-ticket";
import DeleteTicket from "./delete-ticket";
import { Button } from "@wagyu-a5/ui/components/button";
import { Card, CardContent } from "@wagyu-a5/ui/components/card";
import { Input } from "@wagyu-a5/ui/components/input";
import { Chip } from "@wagyu-a5/ui/components/chip";
import { Search, QrCode, Download, Share2, Calendar, MapPin, Ticket } from "lucide-react";

// Mock Data
const ALL_TICKETS = [
  {
    id: "aa11aa11-0001-4aaa-aaaa-aaaaaaaa0001",
    code: "TCK-0001",
    event: "K-Pop Night Festival",
    status: "VALID",
    category: "VIP",
    jadwal: "2026-06-10 19:00",
    lokasi: "Stadion Utama GBK",
    harga: "Rp 1,500,000",
    kursi: "A-1",
    order: "11111111-aaaa-4aaa-aaaa-aaaaaaaa0001",
    pelanggan: "Budi Santoso",
    customerId: "cust_001",
  },
  {
    id: "aa11aa11-0002-4aaa-aaaa-aaaaaaaa0002",
    code: "TCK-0002",
    event: "K-Pop Night Festival",
    status: "VALID",
    category: "Regular",
    jadwal: "2026-06-10 19:00",
    lokasi: "Stadion Utama GBK",
    harga: "Rp 750,000",
    kursi: "A-2",
    order: "11111111-aaaa-4aaa-aaaa-aaaaaaaa0002",
    pelanggan: "Budi Santoso",
    customerId: "cust_001",
  },
  {
    id: "aa11aa11-0003-4aaa-aaaa-aaaaaaaa0003",
    code: "TCK-0003",
    event: "Indie Vibes Concert",
    status: "TERPAKAI",
    category: "VIP",
    jadwal: "2026-06-15 20:00",
    lokasi: "Istora Senayan",
    harga: "Rp 1,200,000",
    kursi: "B-1",
    order: "11111111-aaaa-4aaa-aaaa-aaaaaaaa0003",
    pelanggan: "Budi Santoso",
    customerId: "cust_001",
  },
  {
    id: "aa11aa11-0004-4aaa-aaaa-aaaaaaaa0004",
    code: "TCK-0004",
    event: "Rock Legends Live",
    status: "VALID",
    category: "Regular",
    jadwal: "2026-06-20 18:30",
    lokasi: "Jakarta International Velodrome",
    harga: "Rp 700,000",
    kursi: "C-5",
    order: "11111111-aaaa-4aaa-aaaa-aaaaaaaa0004",
    pelanggan: "Budi Santoso",
    customerId: "cust_001",
  },
  {
    id: "aa11aa11-0005-4aaa-aaaa-aaaaaaaa0005",
    code: "TCK-0005",
    event: "Hip-Hop & Hipdut Fest",
    status: "VALID",
    category: "VIP",
    jadwal: "2026-06-25 19:30",
    lokasi: "Jakarta International Expo",
    harga: "Rp 1,100,000",
    kursi: "D-2",
    order: "11111111-aaaa-4aaa-aaaa-aaaaaaaa0005",
    pelanggan: "Budi Santoso",
    customerId: "cust_001",
  },
  {
    id: "aa11aa11-0006-4aaa-aaaa-aaaaaaaa0006",
    code: "TCK-0006",
    event: "Pop Superstars Night",
    status: "VALID",
    category: "Regular",
    jadwal: "2026-07-01 20:00",
    lokasi: "Jakarta Convention Center",
    harga: "Rp 900,000",
    kursi: "E-10",
    order: "11111111-aaaa-4aaa-aaaa-aaaaaaaa0006",
    pelanggan: "Budi Santoso",
    customerId: "cust_001",
  },
];

export default function ReadTicket({
  role: propRole,
  onRoleChange,
}: {
  role?: "ADMIN" | "CUSTOMER";
  onRoleChange?: (role: "ADMIN" | "CUSTOMER") => void;
} = {}) {
  const [internalRole, setInternalRole] = useState<"ADMIN" | "CUSTOMER">("CUSTOMER");
  const [search, setSearch] = useState("");

  const role = propRole || internalRole;
  const setRole = onRoleChange || setInternalRole;

  // Role-based filtering
  const visibleTickets = useMemo(() => {
    let tickets = ALL_TICKETS;
    // Customer can only see their own tickets
    if (role === "CUSTOMER") {
      tickets = tickets.filter((t) => t.customerId === "cust_001");
    }

    // Search filter
    if (search) {
      const q = search.toLowerCase();
      tickets = tickets.filter(
        (t) => t.code.toLowerCase().includes(q) || t.event.toLowerCase().includes(q),
      );
    }
    return tickets;
  }, [role, search]);

  const total = visibleTickets.length;
  const validCount = visibleTickets.filter((t) => t.status === "VALID").length;
  const usedCount = visibleTickets.filter((t) => t.status === "TERPAKAI").length;

  return (
    <div className="w-full max-w-5xl mx-auto py-8 space-y-6">
      {/* Role Toggle for demonstration */}
      <div className="flex items-center justify-end gap-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl mb-4">
        <span className="text-xs font-medium text-yellow-800 dark:text-yellow-200">
          Current Role View:
        </span>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as "ADMIN" | "CUSTOMER")}
          className="text-sm border-none bg-transparent font-bold text-yellow-900 dark:text-yellow-100 focus:ring-0 outline-none cursor-pointer"
        >
          <option value="CUSTOMER">Customer (Budi Santoso)</option>
          <option value="ADMIN">Admin / Organizer</option>
        </select>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            {role === "CUSTOMER" ? "Tiket Saya" : "Manajemen Tiket"}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {role === "CUSTOMER"
              ? "Kelola dan akses tiket pertunjukan Anda"
              : "Kelola tiket: tambah, ubah status, dan hapus tiket"}
          </p>
        </div>
        {role === "ADMIN" && <CreateTicket />}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="rounded-xl border-slate-100 dark:border-slate-800 shadow-sm">
          <CardContent className="p-6">
            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
              Total Tiket
            </p>
            <p className="text-3xl font-bold text-slate-800 dark:text-slate-100">{total}</p>
          </CardContent>
        </Card>
        <Card className="rounded-xl border-slate-100 dark:border-slate-800 shadow-sm">
          <CardContent className="p-6">
            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
              Valid
            </p>
            <p className="text-3xl font-bold text-slate-800 dark:text-slate-100">{validCount}</p>
          </CardContent>
        </Card>
        <Card className="rounded-xl border-slate-100 dark:border-slate-800 shadow-sm">
          <CardContent className="p-6">
            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
              Terpakai
            </p>
            <p className="text-3xl font-bold text-slate-800 dark:text-slate-100">{usedCount}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
          <Input
            placeholder="Cari kode tiket atau nama acara..."
            className="pl-9 rounded-xl border-slate-200 dark:border-slate-800"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select className="h-10 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-600 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-48">
          <option value="">Semua Status</option>
          <option value="valid">Valid</option>
          <option value="terpakai">Terpakai</option>
        </select>
      </div>

      {/* Ticket List */}
      <div className="space-y-4">
        {visibleTickets.map((ticket) => (
          <Card
            key={ticket.id}
            className="rounded-xl border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col sm:flex-row"
          >
            <CardContent className="p-6 flex-1">
              {/* Top Row: Icon, Status, Title */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
                  <Ticket className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Chip
                      variant="success"
                      className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800/50 font-bold tracking-wide h-5 text-[10px]"
                    >
                      {ticket.status}
                    </Chip>
                    <Chip className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-800/50 font-bold tracking-wide h-5 text-[10px]">
                      {ticket.category}
                    </Chip>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50">
                    {ticket.event}
                  </h3>
                  <p className="text-sm font-mono text-slate-400 dark:text-slate-500">
                    {ticket.code}
                  </p>
                </div>
              </div>

              {/* Grid Details */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-8 mt-6">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
                    Jadwal
                  </p>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {ticket.jadwal}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
                    Lokasi
                  </p>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200 flex items-center gap-1.5 truncate">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {ticket.lokasi}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
                    Kursi
                  </p>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    {ticket.kursi}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
                    Harga
                  </p>
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-50">
                    {ticket.harga}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
                    Order
                  </p>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    {ticket.order}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
                    Pelanggan
                  </p>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    {ticket.pelanggan}
                  </p>
                </div>
              </div>

              {/* Actions Bottom */}
              <div className="mt-6 flex items-center gap-3">
                {role === "CUSTOMER" ? (
                  <>
                    <Button className="bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 text-white rounded-lg h-9 px-4 font-medium gap-2">
                      <QrCode className="w-4 h-4" />
                      Tampilkan QR
                    </Button>
                    <Button
                      variant="outline"
                      className="rounded-lg h-9 w-9 p-0 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      className="rounded-lg h-9 w-9 p-0 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                    >
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </>
                ) : (
                  <>
                    <UpdateTicket />
                    <DeleteTicket />
                  </>
                )}
              </div>
            </CardContent>

            {/* Right Side / QR Box (Only Customer) */}
            {role === "CUSTOMER" && (
              <div className="w-full sm:w-48 bg-slate-50 dark:bg-slate-800/30 border-t sm:border-t-0 sm:border-l border-slate-100 dark:border-slate-800 p-6 flex flex-col items-center justify-center shrink-0">
                <div className="w-24 h-24 bg-white dark:bg-slate-100 rounded-lg shadow-sm border border-slate-200 flex items-center justify-center mb-3">
                  <QrCode className="w-16 h-16 text-slate-900" />
                </div>
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                  Scan Entry
                </p>
              </div>
            )}
          </Card>
        ))}

        {visibleTickets.length === 0 && (
          <div className="text-center py-12 text-slate-500 dark:text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
            Tidak ada tiket yang ditemukan.
          </div>
        )}
      </div>
    </div>
  );
}
