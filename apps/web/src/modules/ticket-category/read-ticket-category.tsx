import { useState, useMemo } from "react";
import { Input } from "@wagyu-a5/ui/components/input";
import { Card, CardContent, CardHeader } from "@wagyu-a5/ui/components/card";
import { Search, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { trpc } from "@/utils/trpc";
import { authClient } from "@/lib/auth-client";

import CreateTicketCategory from "./create-ticket-category";
import UpdateTicketCategory from "./update-ticket-category";
import DeleteTicketCategory from "./delete-ticket-category";
import type { TicketCategory } from "./types";

// ── Helpers ────────────────────────────────────────────────────────
function formatRupiah(value: number): string {
  return `Rp ${value.toLocaleString("id-ID")}`;
}

// ── Component ─────────────────────────────────────────────────────
export default function ReadTicketCategory() {
  const { data: session } = authClient.useSession();
  const role = (session?.user as { role?: string })?.role;
  const isAdmin = role === "ADMIN" || role === "ORGANIZER";

  const [search, setSearch] = useState("");
  const [eventFilter, setEventFilter] = useState("");
  const [view, setView] = useState<"table" | "list">("table");

  const { data: categories = [], isLoading } = useQuery(
    trpc.ticket.category.listAll.queryOptions(),
  );

  const { data: events = [] } = useQuery(trpc.event.event.list.queryOptions());

  // Filter logic
  const filtered = useMemo(() => {
    return (categories as TicketCategory[]).filter((tc) => {
      const matchesSearch =
        tc.category_name.toLowerCase().includes(search.toLowerCase()) ||
        (tc.event_name ?? "").toLowerCase().includes(search.toLowerCase());
      const matchesEvent = eventFilter === "" || tc.tevent_id === eventFilter;
      return matchesSearch && matchesEvent;
    });
  }, [categories, search, eventFilter]);

  // Stats
  const totalCategories = filtered.length;
  const totalQuota = filtered.reduce((sum, tc) => sum + tc.quota, 0);
  const highestPrice = filtered.length ? Math.max(...filtered.map((tc) => tc.price)) : 0;
  const lowestPrice = filtered.length ? Math.min(...filtered.map((tc) => tc.price)) : 0;

  return (
    <div className="w-full space-y-6 gap-12 p-6 max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Kategori Tiket</h1>
          <p className="text-sm text-muted-foreground">Kelola kategori dan harga tiket per acara</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Tambah Kategori — only visible for Admin/Organizer */}
          {isAdmin && <CreateTicketCategory />}
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
            <p className="text-3xl font-bold mt-1">{totalQuota.toLocaleString("id-ID")}</p>
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
              {(events as { event_id: string; event_title: string }[]).map((event) => (
                <option key={event.event_id} value={event.event_id}>
                  {event.event_title}
                </option>
              ))}
            </select>
          </div>

          {/* Count + View Toggle */}
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">{filtered.length} kategori ditemukan</p>
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
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
            </div>
          ) : (
            <>
              {/* ── Table View ─────────────────────────────────────── */}
              {view === "table" && (
                <div className="overflow-x-auto rounded-md border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="px-4 py-3 text-left font-semibold uppercase tracking-wider text-xs text-muted-foreground w-12">
                          No
                        </th>
                        <th className="px-4 py-3 text-left font-semibold uppercase tracking-wider text-xs text-muted-foreground">
                          ID
                        </th>
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
                      {filtered.map((tc, index) => (
                        <tr
                          key={tc.category_id}
                          className="border-b last:border-b-0 hover:bg-muted/30 transition-colors"
                        >
                          <td className="px-4 py-4 text-muted-foreground font-medium">
                            {index + 1}
                          </td>
                          <td className="px-4 py-4 font-mono text-xs text-muted-foreground">
                            {tc.category_id}
                          </td>
                          <td className="px-4 py-4 font-semibold">{tc.category_name}</td>
                          <td className="px-4 py-4 text-muted-foreground">
                            {tc.event_name ?? "-"}
                          </td>
                          <td className="px-4 py-4 font-medium text-indigo-600 dark:text-indigo-400">
                            {formatRupiah(tc.price)}
                          </td>
                          <td className="px-4 py-4 text-muted-foreground">{tc.quota} tiket</td>
                          {isAdmin && (
                            <td className="px-4 py-4">
                              <div className="flex items-center gap-2">
                                <UpdateTicketCategory category={tc} />
                                <DeleteTicketCategory category={tc} />
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
                          <div className="min-w-0 flex-1">
                            <p
                              className="text-[10px] font-mono text-muted-foreground truncate mb-0.5"
                              title={tc.category_id}
                            >
                              {tc.category_id}
                            </p>
                            <p className="font-semibold truncate">{tc.category_name}</p>
                            <p className="text-xs text-muted-foreground truncate mt-0.5">
                              {tc.event_name ?? "-"}
                            </p>
                          </div>
                          {isAdmin && (
                            <div className="flex items-center gap-2 shrink-0">
                              <UpdateTicketCategory category={tc} />
                              <DeleteTicketCategory category={tc} />
                            </div>
                          )}
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium text-indigo-600 dark:text-indigo-400">
                            {formatRupiah(tc.price)}
                          </span>
                          <span className="text-muted-foreground">{tc.quota} tiket</span>
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
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
