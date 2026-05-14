import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@wagyu-a5/ui/components/card";
import { Button } from "@wagyu-a5/ui/components/button";
import { Input } from "@wagyu-a5/ui/components/input";
import { Loader2, TicketCheck, Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { trpc } from "@/utils/trpc";

function formatRupiah(value: number): string {
  return `Rp ${value.toLocaleString("id-ID")}`;
}

// Cari event_id berdasarkan nama event (case-insensitive)
function findEventId(
  events: { event_id: string; event_title: string }[],
  searchTerm: string
): string | null {
  const match = events.find(
    (e) => e.event_title.toLowerCase() === searchTerm.toLowerCase()
  );
  return match ? match.event_id : null;
}

export default function TicketCategoryQuota() {
  const [searchInput, setSearchInput] = useState("");
  const [searchedEventId, setSearchedEventId] = useState("");

  const { data: events = [] } = useQuery(trpc.event.event.list.queryOptions());
  const eventList = events as { event_id: string; event_title: string }[];

  const { data: quotaData = [], isLoading, error } = useQuery({
    ...trpc.ticket.category.getQuotaByEvent.queryOptions({ eventId: searchedEventId }),
    enabled: searchedEventId !== "",
  });

  const [searchError, setSearchError] = useState("");

  const handleSearch = () => {
    setSearchError("");

    if (!searchInput.trim()) {
      setSearchError("Masukkan nama event terlebih dahulu.");
      setSearchedEventId("");
      return;
    }

    // Cari event berdasarkan nama (case-insensitive)
    const foundId = findEventId(eventList, searchInput.trim());

    if (foundId) {
      setSearchedEventId(foundId);
    } else {
      // Kalau nama event gak ditemukan, coba anggap sebagai UUID langsung
      // supaya SP bisa return error "Event dengan ID ... tidak ditemukan."
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (uuidRegex.test(searchInput.trim())) {
        setSearchedEventId(searchInput.trim());
      } else {
        setSearchError(
          `Event "${searchInput}" tidak ditemukan. Coba ketik nama event dengan tepat, atau masukkan UUID event secara langsung.`
        );
        setSearchedEventId("");
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <TicketCheck className="h-5 w-5 text-primary" />
          <div>
            <CardTitle>Sisa Kuota Tiket per Event</CardTitle>
            <CardDescription>
              Masukkan nama event atau UUID untuk melihat ketersediaan tiket (data dari Stored Procedure)
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Search Input */}
        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="quota-event-search"
              placeholder="Ketik nama event atau UUID event..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="pl-9"
            />
          </div>
          <Button onClick={handleSearch}>
            Cari Kuota
          </Button>
        </div>

        {/* Daftar event (hint) */}
        {eventList.length > 0 && !searchedEventId && !searchError && (
          <div className="mb-4">
            <p className="text-xs text-muted-foreground mb-2">Event yang tersedia:</p>
            <div className="flex flex-wrap gap-1.5">
              {eventList.map((event) => (
                <button
                  key={event.event_id}
                  className="text-xs px-2.5 py-1 rounded-full border border-input bg-muted/50 hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
                  onClick={() => {
                    setSearchInput(event.event_title);
                    setSearchedEventId(event.event_id);
                    setSearchError("");
                  }}
                >
                  {event.event_title}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Search Error (frontend) */}
        {searchError && (
          <div className="rounded-md border border-amber-500/50 bg-amber-500/10 p-4 mb-4">
            <p className="text-sm font-medium text-amber-700 dark:text-amber-400">{searchError}</p>
          </div>
        )}

        {/* Results */}
        {searchedEventId && isLoading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
          </div>
        )}

        {/* Error dari Stored Procedure */}
        {searchedEventId && error && (
          <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4">
            <p className="text-sm font-medium text-destructive">{error.message}</p>
          </div>
        )}

        {searchedEventId && !isLoading && !error && quotaData.length === 0 && (
          <p className="text-sm text-muted-foreground py-4">Tidak ada kategori tiket untuk event ini.</p>
        )}

        {searchedEventId && !isLoading && !error && quotaData.length > 0 && (
          <div className="overflow-x-auto rounded-md border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-4 py-3 text-left font-semibold uppercase tracking-wider text-xs text-muted-foreground">
                    Kategori
                  </th>
                  <th className="px-4 py-3 text-left font-semibold uppercase tracking-wider text-xs text-muted-foreground">
                    Harga
                  </th>
                  <th className="px-4 py-3 text-left font-semibold uppercase tracking-wider text-xs text-muted-foreground">
                    Kuota Awal
                  </th>
                  <th className="px-4 py-3 text-left font-semibold uppercase tracking-wider text-xs text-muted-foreground">
                    Terjual
                  </th>
                  <th className="px-4 py-3 text-left font-semibold uppercase tracking-wider text-xs text-muted-foreground">
                    Sisa
                  </th>
                </tr>
              </thead>
              <tbody>
                {quotaData.map((row: any) => (
                  <tr
                    key={row.category_id}
                    className="border-b last:border-b-0 hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-4 py-4 font-semibold">{row.category_name}</td>
                    <td className="px-4 py-4 font-medium text-indigo-600 dark:text-indigo-400">
                      {formatRupiah(Number(row.price))}
                    </td>
                    <td className="px-4 py-4 text-muted-foreground">{row.quota}</td>
                    <td className="px-4 py-4 text-muted-foreground">{Number(row.sold)}</td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          Number(row.remaining) > 0
                            ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                            : "bg-red-500/10 text-red-700 dark:text-red-400"
                        }`}
                      >
                        {Number(row.remaining)} tiket
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
