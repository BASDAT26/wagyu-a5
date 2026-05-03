import { useState } from "react";
import { Input } from "@wagyu-a5/ui/components/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@wagyu-a5/ui/components/card";
import { Chip } from "@wagyu-a5/ui/components/chip";
import { Search } from "lucide-react";

import CreateTicketCategory from "./create-ticket-category";
import UpdateTicketCategory from "./update-ticket-category";
import DeleteTicketCategory from "./delete-ticket-category";

// ── Dummy Event data ──────────────────────────────────────────────
const EVENTS = [
  { event_id: "e1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b01", event_name: "K-Pop Night Festival" },
  { event_id: "f2b3c4d5-e6f7-4a8b-9c0d-1e2f3a4b5c02", event_name: "Indie Vibes Concert" },
  { event_id: "a3c4d5e6-f7a8-4b9c-0d1e-2f3a4b5c6d03", event_name: "Rock Legends Live" },
  { event_id: "b4d5e6f7-a8b9-4c0d-1e2f-3a4b5c6d7e04", event_name: "Hip-Hop & Hipdut Fest" },
  { event_id: "c5d6e7f8-b9c0-4d1e-2f3a-4b5c6d7e8f05", event_name: "Pop Superstars Night" },
  { event_id: "d6e7f8a9-c0d1-4e2f-3a4b-5c6d7e8f9a06", event_name: "Summer Music Carnival" },
];

// ── Dummy Ticket Category data — sorted by event_name then category_name ASC ──
const TICKET_CATEGORIES = [
  {
    category_id: "b8d9e0f1-a2b3-4c4d-5e6f-000000000108",
    category_name: "Regular",
    quota: 450,
    price: 650000,
    event_id: "b4d5e6f7-a8b9-4c0d-1e2f-3a4b5c6d7e04",
    event_name: "Hip-Hop & Hipdut Fest",
  },
  {
    category_id: "a7c8d9e0-f1a2-4b3c-4d5e-000000000107",
    category_name: "VIP",
    quota: 90,
    price: 1100000,
    event_id: "b4d5e6f7-a8b9-4c0d-1e2f-3a4b5c6d7e04",
    event_name: "Hip-Hop & Hipdut Fest",
  },
  {
    category_id: "b4c5d6e7-a8b9-4c0d-1e2f-000000000114",
    category_name: "Economy",
    quota: 800,
    price: 400000,
    event_id: "f2b3c4d5-e6f7-4a8b-9c0d-1e2f3a4b5c02",
    event_name: "Indie Vibes Concert",
  },
  {
    category_id: "d4f5a6b7-c8d9-4e0f-1a2b-000000000104",
    category_name: "Regular",
    quota: 400,
    price: 600000,
    event_id: "f2b3c4d5-e6f7-4a8b-9c0d-1e2f3a4b5c02",
    event_name: "Indie Vibes Concert",
  },
  {
    category_id: "c3e4f5a6-b7c8-4d9e-0f1a-000000000103",
    category_name: "VIP",
    quota: 80,
    price: 1200000,
    event_id: "f2b3c4d5-e6f7-4a8b-9c0d-1e2f3a4b5c02",
    event_name: "Indie Vibes Concert",
  },
  {
    category_id: "b2d3e4f5-a6b7-4c8d-9e0f-000000000102",
    category_name: "Regular",
    quota: 500,
    price: 750000,
    event_id: "e1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b01",
    event_name: "K-Pop Night Festival",
  },
  {
    category_id: "a1c2d3e4-f5a6-4b7c-8d9e-000000000101",
    category_name: "VIP",
    quota: 100,
    price: 1500000,
    event_id: "e1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b01",
    event_name: "K-Pop Night Festival",
  },
  {
    category_id: "a3b4c5d6-f7a8-4b9c-0d1e-000000000113",
    category_name: "VVIP",
    quota: 50,
    price: 2500000,
    event_id: "e1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b01",
    event_name: "K-Pop Night Festival",
  },
  {
    category_id: "d0f1a2b3-c4d5-4e6f-7a8b-000000000110",
    category_name: "Regular",
    quota: 700,
    price: 900000,
    event_id: "c5d6e7f8-b9c0-4d1e-2f3a-4b5c6d7e8f05",
    event_name: "Pop Superstars Night",
  },
  {
    category_id: "c9e0f1a2-b3c4-4d5e-6f7a-000000000109",
    category_name: "VIP",
    quota: 150,
    price: 2000000,
    event_id: "c5d6e7f8-b9c0-4d1e-2f3a-4b5c6d7e8f05",
    event_name: "Pop Superstars Night",
  },
  {
    category_id: "f6b7c8d9-e0f1-4a2b-3c4d-000000000106",
    category_name: "Regular",
    quota: 600,
    price: 700000,
    event_id: "a3c4d5e6-f7a8-4b9c-0d1e-2f3a4b5c6d03",
    event_name: "Rock Legends Live",
  },
  {
    category_id: "e5a6b7c8-d9e0-4f1a-2b3c-000000000105",
    category_name: "VIP",
    quota: 120,
    price: 1300000,
    event_id: "a3c4d5e6-f7a8-4b9c-0d1e-2f3a4b5c6d03",
    event_name: "Rock Legends Live",
  },
  {
    category_id: "f2b3c4d5-e6f7-4a8b-9c0d-000000000112",
    category_name: "Regular",
    quota: 550,
    price: 800000,
    event_id: "d6e7f8a9-c0d1-4e2f-3a4b-5c6d7e8f9a06",
    event_name: "Summer Music Carnival",
  },
  {
    category_id: "e1a2b3c4-d5e6-4f7a-8b9c-000000000111",
    category_name: "VIP",
    quota: 110,
    price: 1400000,
    event_id: "d6e7f8a9-c0d1-4e2f-3a4b-5c6d7e8f9a06",
    event_name: "Summer Music Carnival",
  },
];

// ── Helpers ────────────────────────────────────────────────────────
function formatRupiah(value: number): string {
  return `Rp ${value.toLocaleString("id-ID")}`;
}

// ── Component ─────────────────────────────────────────────────────
export default function ReadTicketCategory({ isAdmin: propIsAdmin, onToggleAdmin }: { isAdmin?: boolean; onToggleAdmin?: (v: boolean) => void } = {}) {
  const [internalIsAdmin, setInternalIsAdmin] = useState(true);
  const isAdmin = propIsAdmin !== undefined ? propIsAdmin : internalIsAdmin;
  const setIsAdmin = onToggleAdmin || setInternalIsAdmin;
  const [search, setSearch] = useState("");
  const [eventFilter, setEventFilter] = useState("");
  const [view, setView] = useState<"table" | "list">("table");

  // Filter logic
  const filtered = TICKET_CATEGORIES.filter((tc) => {
    const matchesSearch =
      tc.category_name.toLowerCase().includes(search.toLowerCase()) ||
      tc.event_name.toLowerCase().includes(search.toLowerCase());
    const matchesEvent = eventFilter === "" || tc.event_id === eventFilter;
    return matchesSearch && matchesEvent;
  });

  // Stats
  const totalCategories = filtered.length;
  const totalQuota = filtered.reduce((sum, tc) => sum + tc.quota, 0);
  const highestPrice = filtered.length
    ? Math.max(...filtered.map((tc) => tc.price))
    : 0;
  const lowestPrice = filtered.length
    ? Math.min(...filtered.map((tc) => tc.price))
    : 0;

  return (
    <div className="w-full space-y-6 gap-12 p-6 max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Kategori Tiket</h1>
          <p className="text-sm text-muted-foreground">
            Kelola kategori dan harga tiket per acara
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Role toggle for demo */}
          <Chip
            size="sm"
            variant={isAdmin ? "destructive" : "default"}
            className="cursor-pointer select-none"
            onClick={() => setIsAdmin(!isAdmin)}
          >
            {isAdmin ? "Admin" : "Customer"} (klik untuk toggle)
          </Chip>

          {/* Tambah Kategori — only visible for Admin */}
          {isAdmin && <CreateTicketCategory events={EVENTS} />}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Total Kategori
            </p>
            <p className="text-3xl font-bold mt-1">{totalCategories}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Total Kuota
            </p>
            <p className="text-3xl font-bold mt-1">
              {totalQuota.toLocaleString("id-ID")}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Harga Terendah
            </p>
            <p className="text-3xl font-bold mt-1">{formatRupiah(lowestPrice)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Harga Tertinggi
            </p>
            <p className="text-3xl font-bold mt-1">{formatRupiah(highestPrice)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Table Card */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            {/* Search */}
            <div className="relative max-w-sm w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="search-ticket-category"
                placeholder="Cari kategori..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Event Filter */}
            <select
              id="filter-event"
              value={eventFilter}
              onChange={(e) => setEventFilter(e.target.value)}
              className="flex h-10 w-full sm:w-56 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="">Semua Acara</option>
              {EVENTS.map((event) => (
                <option key={event.event_id} value={event.event_id}>
                  {event.event_name}
                </option>
              ))}
            </select>
          </div>

          {/* Count + View Toggle */}
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              {filtered.length} kategori ditemukan
            </p>
            <div className="flex items-center rounded-md border border-input overflow-hidden">
              <button
                onClick={() => setView("table")}
                className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                  view === "table"
                    ? "bg-primary text-primary-foreground"
                    : "bg-background text-muted-foreground hover:bg-muted"
                }`}
              >
                Tabel
              </button>
              <button
                onClick={() => setView("list")}
                className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                  view === "list"
                    ? "bg-primary text-primary-foreground"
                    : "bg-background text-muted-foreground hover:bg-muted"
                }`}
              >
                Daftar
              </button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* ── Table View ─────────────────────────────────────── */}
          {view === "table" && (
            <div className="overflow-x-auto rounded-md border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="px-4 py-3 text-left font-semibold uppercase tracking-wider text-xs text-muted-foreground">
                      Kategori
                    </th>
                    <th className="px-4 py-3 text-left font-semibold uppercase tracking-wider text-xs text-muted-foreground">
                      Acara
                    </th>
                    <th className="px-4 py-3 text-left font-semibold uppercase tracking-wider text-xs text-muted-foreground">
                      Harga
                    </th>
                    <th className="px-4 py-3 text-left font-semibold uppercase tracking-wider text-xs text-muted-foreground">
                      Kuota
                    </th>
                    {isAdmin && (
                      <th className="px-4 py-3 text-left font-semibold uppercase tracking-wider text-xs text-muted-foreground">
                        Aksi
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((tc) => (
                    <tr
                      key={tc.category_id}
                      className="border-b last:border-b-0 hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-4 py-4 font-semibold">
                        {tc.category_name}
                      </td>
                      <td className="px-4 py-4 text-muted-foreground">
                        {tc.event_name}
                      </td>
                      <td className="px-4 py-4 font-medium text-indigo-600 dark:text-indigo-400">
                        {formatRupiah(tc.price)}
                      </td>
                      <td className="px-4 py-4 text-muted-foreground">
                        {tc.quota} tiket
                      </td>
                      {isAdmin && (
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <UpdateTicketCategory
                              categoryId={tc.category_id}
                              currentName={tc.category_name}
                              currentPrice={tc.price}
                              currentQuota={tc.quota}
                              eventName={tc.event_name}
                            />
                            <DeleteTicketCategory
                              categoryId={tc.category_id}
                              categoryName={tc.category_name}
                              eventName={tc.event_name}
                            />
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>

              {filtered.length === 0 && (
                <div className="py-8 text-center text-muted-foreground">
                  Tidak ada kategori tiket yang ditemukan.
                </div>
              )}
            </div>
          )}

          {/* ── List / Card View ───────────────────────────────── */}
          {view === "list" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((tc) => (
                <Card key={tc.category_id} className="relative overflow-hidden">
                  <CardContent className="pt-5 pb-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="min-w-0">
                        <p className="font-semibold truncate">
                          {tc.category_name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {tc.event_name}
                        </p>
                      </div>
                      {isAdmin && (
                        <div className="flex items-center gap-2 shrink-0">
                          <UpdateTicketCategory
                            categoryId={tc.category_id}
                            currentName={tc.category_name}
                            currentPrice={tc.price}
                            currentQuota={tc.quota}
                            eventName={tc.event_name}
                          />
                          <DeleteTicketCategory
                            categoryId={tc.category_id}
                            categoryName={tc.category_name}
                            eventName={tc.event_name}
                          />
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-indigo-600 dark:text-indigo-400">
                        {formatRupiah(tc.price)}
                      </span>
                      <span className="text-muted-foreground">
                        {tc.quota} tiket
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {filtered.length === 0 && (
                <div className="col-span-full py-8 text-center text-muted-foreground">
                  Tidak ada kategori tiket yang ditemukan.
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
