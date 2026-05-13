import { useState, useMemo } from "react";
import CreateSeat from "./create-seat";
import UpdateSeat from "./update-seat";
import DeleteSeat from "./delete-seat";
import { Card, CardContent } from "@wagyu-a5/ui/components/card";
import { Input } from "@wagyu-a5/ui/components/input";
import { Chip } from "@wagyu-a5/ui/components/chip";
import { Search, XCircle, CheckCircle2, Loader2, ChevronDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { trpc } from "@/utils/trpc";
import { authClient } from "@/lib/auth-client";
import type { Seat } from "./types";
import type { Venue } from "../venue/types";

export default function ReadSeat() {
  const [search, setSearch] = useState("");
  const [selectedVenueId, setSelectedVenueId] = useState<string>("");

  const { data: session } = authClient.useSession();
  const role = (session?.user as { role?: string })?.role;
  const canModify = role === "ADMIN" || role === "ORGANIZER";

  const { data: venues = [] } = useQuery(trpc.venue.venue.list.queryOptions());

  // Auto-select first venue if none selected
  const venueId = selectedVenueId || (venues.length > 0 ? (venues[0] as Venue).venue_id : "");

  const { data: seats = [], isLoading } = useQuery({
    ...trpc.venue.seat.listByVenueWithStatus.queryOptions({ venueId }),
    enabled: !!venueId,
  });

  const filteredSeats = useMemo(() => {
    return (seats as Seat[]).filter((seat) => {
      const query = search.toLowerCase();
      return (
        seat.section.toLowerCase().includes(query) ||
        seat.row_number.toLowerCase().includes(query) ||
        seat.seat_number.toLowerCase().includes(query)
      );
    });
  }, [seats, search]);

  const totalKursi = (seats as Seat[]).length;
  const terisi = (seats as Seat[]).filter((s) => s.is_assigned).length;
  const tersedia = totalKursi - terisi;

  const selectedVenueName = venues.find((v: Venue) => v.venue_id === venueId)?.venue_name ?? "";

  return (
    <div className="w-full max-w-6xl mx-auto py-8 space-y-6 px-4">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            Manajemen Kursi
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Kelola kursi dan denah tempat duduk venue
          </p>
        </div>
        <div className="flex items-center gap-4">
          {canModify && venueId && <CreateSeat venueId={venueId} />}
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="rounded-xl border-slate-100 dark:border-slate-800 shadow-sm">
          <CardContent className="p-6">
            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
              Total Kursi
            </p>
            <p className="text-3xl font-bold text-slate-800 dark:text-slate-100">{totalKursi}</p>
          </CardContent>
        </Card>
        <Card className="rounded-xl border-slate-100 dark:border-slate-800 shadow-sm">
          <CardContent className="p-6">
            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
              Tersedia
            </p>
            <p className="text-3xl font-bold text-slate-800 dark:text-slate-100">{tersedia}</p>
          </CardContent>
        </Card>
        <Card className="rounded-xl border-slate-100 dark:border-slate-800 shadow-sm">
          <CardContent className="p-6">
            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
              Terisi
            </p>
            <p className="text-3xl font-bold text-slate-800 dark:text-slate-100">{terisi}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
          <Input
            placeholder="Cari section, baris, atau nomor..."
            className="pl-9 rounded-xl border-slate-200 dark:border-slate-800"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="relative w-full sm:w-64">
          <select
            id="filter-venue"
            value={venueId}
            onChange={(e) => setSelectedVenueId(e.target.value)}
            className="appearance-none h-10 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 pr-8 py-2 text-sm text-slate-600 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="" disabled>
              Pilih Venue...
            </option>
            {(venues as Venue[]).map((v) => (
              <option key={v.venue_id} value={v.venue_id}>
                {v.venue_name}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
        </div>
      ) : !venueId ? (
        <div className="text-center py-12 text-slate-500 dark:text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
          Pilih venue untuk melihat daftar kursi.
        </div>
      ) : (
        <Card className="rounded-xl border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  <th className="px-6 py-4 font-bold">Section</th>
                  <th className="px-6 py-4 font-bold">Baris</th>
                  <th className="px-6 py-4 font-bold">No. Kursi</th>
                  <th className="px-6 py-4 font-bold">Venue</th>
                  <th className="px-6 py-4 font-bold">Status</th>
                  {canModify && <th className="px-6 py-4 font-bold text-right">Aksi</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                {filteredSeats.map((seat) => (
                  <tr
                    key={seat.seat_id}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-slate-700 dark:text-slate-200">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M4 10v4h16v-4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2z"></path>
                            <path d="M4 14v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4"></path>
                            <path d="M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4"></path>
                          </svg>
                        </div>
                        {seat.section}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                      {seat.row_number}
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                      {seat.seat_number}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
                          <path d="M9 22v-4h6v4"></path>
                          <path d="M8 6h.01"></path>
                          <path d="M16 6h.01"></path>
                          <path d="M12 6h.01"></path>
                          <path d="M12 10h.01"></path>
                          <path d="M12 14h.01"></path>
                          <path d="M16 10h.01"></path>
                          <path d="M16 14h.01"></path>
                          <path d="M8 10h.01"></path>
                          <path d="M8 14h.01"></path>
                        </svg>
                        {selectedVenueName}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {seat.is_assigned ? (
                        <Chip
                          variant="warning"
                          className="bg-orange-50 text-orange-600 border-orange-100 hover:bg-orange-100 font-bold tracking-wide"
                          icon={<XCircle className="w-3 h-3" />}
                        >
                          TERISI
                        </Chip>
                      ) : (
                        <Chip
                          variant="success"
                          className="bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100 font-bold tracking-wide"
                          icon={<CheckCircle2 className="w-3 h-3" />}
                        >
                          TERSEDIA
                        </Chip>
                      )}
                    </td>
                    {canModify && (
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <UpdateSeat seat={seat} venueId={venueId} />
                          <DeleteSeat seat={seat} venueId={venueId} />
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
                {filteredSeats.length === 0 && (
                  <tr>
                    <td
                      colSpan={canModify ? 6 : 5}
                      className="px-6 py-12 text-center text-slate-500 dark:text-slate-400"
                    >
                      Tidak ada kursi yang ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
