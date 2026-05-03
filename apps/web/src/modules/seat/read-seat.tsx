import { useState, useMemo } from "react";
import CreateSeat from "./create-seat";
import UpdateSeat from "./update-seat";
import DeleteSeat from "./delete-seat";
import { Card, CardContent } from "@wagyu-a5/ui/components/card";
import { Input } from "@wagyu-a5/ui/components/input";
import { Chip } from "@wagyu-a5/ui/components/chip";
import { Search, XCircle, CheckCircle2 } from "lucide-react";
import type { Role } from "@/data/type";

// Mock Data
const MOCK_SEATS = [
  {
    id: "s1a2b3c4-0001-4aaa-aaaa-aaaaaaaa0001",
    section: "WVIP",
    baris: "A",
    noKursi: "1",
    venue: "Jakarta Convention Center",
    venueId: "v1a2b3c4-d5e6-4a7b-8c9d-000000000001",
    isAssigned: true,
  },
  {
    id: "s1a2b3c4-0002-4aaa-aaaa-aaaaaaaa0002",
    section: "WVIP",
    baris: "A",
    noKursi: "2",
    venue: "Jakarta Convention Center",
    venueId: "v1a2b3c4-d5e6-4a7b-8c9d-000000000001",
    isAssigned: false,
  },
  {
    id: "s1a2b3c4-0003-4aaa-aaaa-aaaaaaaa0003",
    section: "WVIP",
    baris: "A",
    noKursi: "3",
    venue: "Jakarta Convention Center",
    venueId: "v1a2b3c4-d5e6-4a7b-8c9d-000000000001",
    isAssigned: false,
  },
  {
    id: "s1a2b3c4-0004-4aaa-aaaa-aaaaaaaa0004",
    section: "VIP",
    baris: "B",
    noKursi: "1",
    venue: "Jakarta Convention Center",
    venueId: "v1a2b3c4-d5e6-4a7b-8c9d-000000000001",
    isAssigned: true,
  },
  {
    id: "s1a2b3c4-0005-4aaa-aaaa-aaaaaaaa0005",
    section: "VIP",
    baris: "B",
    noKursi: "2",
    venue: "Jakarta Convention Center",
    venueId: "v1a2b3c4-d5e6-4a7b-8c9d-000000000001",
    isAssigned: true,
  },
  {
    id: "s1a2b3c4-0006-4aaa-aaaa-aaaaaaaa0006",
    section: "VIP",
    baris: "B",
    noKursi: "3",
    venue: "Jakarta Convention Center",
    venueId: "v1a2b3c4-d5e6-4a7b-8c9d-000000000001",
    isAssigned: false,
  },
  {
    id: "s1a2b3c4-0007-4aaa-aaaa-aaaaaaaa0007",
    section: "Category 1",
    baris: "C",
    noKursi: "1",
    venue: "Jakarta Convention Center",
    venueId: "v1a2b3c4-d5e6-4a7b-8c9d-000000000001",
    isAssigned: false,
  },
];

export default function ReadSeat({
  role: propRole,
  onRoleChange,
}: { role?: Role; onRoleChange?: (role: Role) => void } = {}) {
  const [search, setSearch] = useState("");
  const [internalRole, setInternalRole] = useState<Role>("CUSTOMER");

  const role = propRole || internalRole;
  const setRole = onRoleChange || setInternalRole;

  const filteredSeats = useMemo(() => {
    return MOCK_SEATS.filter((seat) => {
      const query = search.toLowerCase();
      return (
        seat.section.toLowerCase().includes(query) ||
        seat.baris.toLowerCase().includes(query) ||
        seat.noKursi.toLowerCase().includes(query) ||
        seat.venue.toLowerCase().includes(query)
      );
    });
  }, [search]);

  // For the stat cards, we calculate based on the overall MOCK_SEATS
  // (In a real app, these stats might come from backend aggregates)
  const totalKursi = MOCK_SEATS.length;
  const terisi = MOCK_SEATS.filter((s) => s.isAssigned).length;
  const tersedia = totalKursi - terisi;

  return (
    <div className="w-full max-w-6xl mx-auto py-8 space-y-6">
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
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as Role)}
            className="h-10 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-600 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="CUSTOMER">View as: Customer</option>
            <option value="ADMIN">View as: Admin</option>
            <option value="ORGANIZER">View as: Organizer</option>
          </select>
          {role !== "CUSTOMER" && <CreateSeat />}
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
        <select className="h-10 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-600 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-48">
          <option value="">Semua Venue</option>
          <option value="jcc">Jakarta Convention Center</option>
        </select>
      </div>

      {/* Table */}
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
                {role !== "CUSTOMER" && <th className="px-6 py-4 font-bold text-right">Aksi</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
              {filteredSeats.map((seat) => (
                <tr
                  key={seat.id}
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
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{seat.baris}</td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{seat.noKursi}</td>
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
                      {seat.venue}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {seat.isAssigned ? (
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
                  {role !== "CUSTOMER" && (
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <UpdateSeat />
                        <DeleteSeat isAssigned={seat.isAssigned} />
                      </div>
                    </td>
                  )}
                </tr>
              ))}
              {filteredSeats.length === 0 && (
                <tr>
                  <td
                    colSpan={role !== "CUSTOMER" ? 6 : 5}
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
    </div>
  );
}
