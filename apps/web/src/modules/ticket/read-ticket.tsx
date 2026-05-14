import { useState, useMemo } from "react";
import CreateTicket from "./create-ticket";
import UpdateTicket from "./update-ticket";
import DeleteTicket from "./delete-ticket";
import { Card, CardContent } from "@wagyu-a5/ui/components/card";
import { Input } from "@wagyu-a5/ui/components/input";
import { Chip } from "@wagyu-a5/ui/components/chip";
import { Search, QrCode, Download, Share2, Calendar, MapPin, Ticket, Loader2 } from "lucide-react";
import { Button } from "@wagyu-a5/ui/components/button";
import { useQuery } from "@tanstack/react-query";
import { trpc } from "@/utils/trpc";
import { authClient } from "@/lib/auth-client";
import type { TicketEnriched } from "./types";

function formatRupiah(value: number): string {
  return `Rp ${value.toLocaleString("id-ID")}`;
}

function formatDate(datetime: string): string {
  try {
    return new Date(datetime).toLocaleString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return datetime;
  }
}

function getStatusChip(status: string) {
  switch (status) {
    case "VALID":
      return (
        <Chip
          variant="success"
          className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800/50 font-bold tracking-wide h-5 text-[10px]"
        >
          VALID
        </Chip>
      );
    case "TERPAKAI":
      return (
        <Chip
          variant="warning"
          className="bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-800/50 font-bold tracking-wide h-5 text-[10px]"
        >
          TERPAKAI
        </Chip>
      );
    case "BATAL":
      return (
        <Chip
          variant="destructive"
          className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border-red-100 dark:border-red-800/50 font-bold tracking-wide h-5 text-[10px]"
        >
          BATAL
        </Chip>
      );
    default:
      return <Chip className="font-bold tracking-wide h-5 text-[10px]">{status}</Chip>;
  }
}

export default function ReadTicket() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const { data: session } = authClient.useSession();
  const role = (session?.user as { role?: string })?.role;
  const isAdmin = role === "ADMIN";
  const isCustomer = role === "CUSTOMER";
  const canCreate = role === "ADMIN" || role === "ORGANIZER";
  const canModify = role === "ADMIN";

  const { data: tickets = [], isLoading } = useQuery(
    trpc.ticket.ticket.listForCurrentUser.queryOptions(),
  );

  const visibleTickets = useMemo(() => {
    let filtered = tickets as TicketEnriched[];
    
    if (statusFilter !== "ALL") {
      filtered = filtered.filter((t) => t.status === statusFilter);
    }
    
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.ticket_code.toLowerCase().includes(q) ||
          t.event_title.toLowerCase().includes(q) ||
          t.customer_name.toLowerCase().includes(q),
      );
    }
    return filtered;
  }, [tickets, search, statusFilter]);

  const total = visibleTickets.length;
  const validCount = visibleTickets.filter((t) => t.status === "VALID").length;
  const usedCount = visibleTickets.filter((t) => t.status === "TERPAKAI").length;

  return (
    <div className="w-full max-w-5xl mx-auto py-8 space-y-6 px-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            {isCustomer ? "Tiket Saya" : "Manajemen Tiket"}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {isCustomer
              ? "Kelola dan akses tiket pertunjukan Anda"
              : "Kelola tiket: tambah, ubah status, dan hapus tiket"}
          </p>
        </div>
        {canCreate && <CreateTicket />}
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
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="relative w-full sm:w-80 shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
          <Input
            placeholder="Cari kode tiket, acara, atau pelanggan..."
            className="pl-9 rounded-xl border-slate-200 dark:border-slate-800"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl w-full sm:w-auto overflow-x-auto shrink-0">
          {["ALL", "VALID", "TERPAKAI", "BATAL"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap flex-1 sm:flex-none ${
                statusFilter === status
                  ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-50 shadow-sm"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              }`}
            >
              {status === "ALL" ? "Semua" : status}
            </button>
          ))}
        </div>
      </div>

      {/* Ticket List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
        </div>
      ) : (
        <div className="space-y-4">
          {visibleTickets.map((ticket) => (
            <Card
              key={ticket.ticket_id}
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
                      {getStatusChip(ticket.status)}
                      <Chip className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-800/50 font-bold tracking-wide h-5 text-[10px]">
                        {ticket.category_name}
                      </Chip>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50">
                      {ticket.event_title}
                    </h3>
                    <p className="text-sm font-mono text-slate-400 dark:text-slate-500">
                      {ticket.ticket_code}
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
                      {formatDate(ticket.event_datetime)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
                      Lokasi
                    </p>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-200 flex items-center gap-1.5 truncate">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {ticket.venue_name}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
                      Kursi
                    </p>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                      {ticket.section
                        ? `${ticket.section} - ${ticket.row_number}-${ticket.seat_number}`
                        : "Tanpa Kursi"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
                      Harga
                    </p>
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-50">
                      {formatRupiah(ticket.price)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
                      Order
                    </p>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-200 font-mono text-xs">
                      {ticket.order_id.substring(0, 8)}...
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
                      Pelanggan
                    </p>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                      {ticket.customer_name}
                    </p>
                  </div>
                </div>

                {/* Actions Bottom */}
                <div className="mt-6 flex items-center gap-3">
                  {isCustomer ? (
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
                  ) : canModify ? (
                    <>
                      <UpdateTicket ticket={ticket} />
                      <DeleteTicket ticket={ticket} />
                    </>
                  ) : null}
                </div>
              </CardContent>

              {/* Right Side / QR Box (Only Customer) */}
              {isCustomer && (
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
      )}
    </div>
  );
}
