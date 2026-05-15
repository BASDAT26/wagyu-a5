import { Button } from "@wagyu-a5/ui/components/button";
import { Input } from "@wagyu-a5/ui/components/input";
import { Card, CardContent } from "@wagyu-a5/ui/components/card";
import { Chip } from "@wagyu-a5/ui/components/chip";
import { Search, Heart, Calendar, MapPin, ChevronDown, Music, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { trpc } from "@/utils/trpc";
import { authClient } from "@/lib/auth-client";
import { useState, useMemo } from "react";
import { Link } from "react-router";
import CreateEvent from "./create-event";
import UpdateEvent from "./update-event";
import type { Event, VenueOption, EventArtist } from "./types";

export default function EventModule() {
  const { data: events = [], isLoading } = useQuery(trpc.event.event.list.queryOptions());
  const { data: venues = [] } = useQuery(trpc.venue.venue.list.queryOptions());
  const { data: artists = [] } = useQuery(trpc.event.artist.list.queryOptions());
  const { data: allCategories = [] } = useQuery(trpc.ticket.category.listAll.queryOptions());

  const { data: session } = authClient.useSession();
  const role = (session?.user as { role?: string })?.role;
  const canModify = role === "ADMIN" || role === "ORGANIZER";

  const [search, setSearch] = useState("");
  const [venueFilter, setVenueFilter] = useState("all");

  // Build a venue lookup map
  const venueMap = useMemo(() => {
    const map = new Map<string, VenueOption>();
    for (const v of venues as VenueOption[]) {
      map.set(v.venue_id, v);
    }
    return map;
  }, [venues]);

  // Unique venue names for the filter dropdown
  const venueNames = useMemo(() => {
    return Array.from(new Set((venues as VenueOption[]).map((v) => v.venue_name))).sort();
  }, [venues]);

  const minPriceMap = useMemo(() => {
    const map = new Map<string, number>();
    for (const cat of allCategories as any[]) {
      const price = Number(cat.price);
      if (!map.has(cat.tevent_id) || price < map.get(cat.tevent_id)!) {
        map.set(cat.tevent_id, price);
      }
    }
    return map;
  }, [allCategories]);

  // Filter events
  const filtered = useMemo(() => {
    return (events as Event[]).filter((ev) => {
      const q = search.toLowerCase();
      const venue = venueMap.get(ev.venue_id);
      const matchesSearch =
        !q ||
        ev.event_title.toLowerCase().includes(q) ||
        (venue?.venue_name.toLowerCase().includes(q) ?? false);
      const matchesVenue = venueFilter === "all" || venue?.venue_name === venueFilter;
      return matchesSearch && matchesVenue;
    });
  }, [events, search, venueFilter, venueMap]);

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4 space-y-6">
      {/* Header */}
      <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Jelajahi Acara</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Temukan acara terbaik dan beli tiket favorit Anda
            </p>
          </div>
          {canModify && <CreateEvent />}
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            id="search-event"
            type="text"
            placeholder="Cari acara atau venue..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="relative">
          <select
            id="filter-venue"
            value={venueFilter}
            onChange={(e) => setVenueFilter(e.target.value)}
            className="appearance-none h-10 rounded-md border border-input bg-background px-3 pr-8 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 cursor-pointer"
          >
            <option value="all">Semua Venue</option>
            {venueNames.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* Event Cards */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-slate-500">
          <Music className="h-12 w-12 mx-auto mb-3 text-slate-300" />
          <p className="font-medium">Tidak ada acara ditemukan</p>
          <p className="text-sm mt-1">Coba ubah filter atau kata kunci pencarian</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((event) => {
            const venue = venueMap.get(event.venue_id);
            const dt = new Date(event.event_datetime);
            const dateStr = dt.toLocaleDateString("id-ID", {
              year: "numeric",
              month: "short",
              day: "numeric",
            });
            const timeStr = dt.toLocaleTimeString("id-ID", {
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <EventCard
                key={event.event_id}
                event={event}
                venueName={venue?.venue_name ?? "—"}
                venueCity={venue?.city ?? ""}
                dateStr={dateStr}
                timeStr={timeStr}
                minPrice={minPriceMap.get(event.event_id) ?? null}
                canModify={canModify}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

/** Individual event card — fetches its own artists */
function EventCard({
  event,
  venueName,
  venueCity,
  dateStr,
  timeStr,
  minPrice,
  canModify,
}: {
  event: Event;
  venueName: string;
  venueCity: string;
  dateStr: string;
  timeStr: string;
  minPrice: number | null;
  canModify: boolean;
}) {
  const { data: eventArtists = [] } = useQuery(
    trpc.event.eventArtist.listByEvent.queryOptions({ eventId: event.event_id }),
  );

  return (
    <Card className="overflow-hidden flex flex-col group hover:shadow-lg transition-shadow duration-300">
      {/* Card Header — Gradient with Icon */}
      <div className="relative h-36 bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
        <Music className="h-10 w-10 text-white drop-shadow-md" />
        <button
          className="absolute top-3 right-3 p-1.5 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/40 transition-colors"
          aria-label="Favorite"
        >
          <Heart className="h-4 w-4" />
        </button>
      </div>

      {/* Card Body */}
      <CardContent className="p-4 flex flex-col flex-1 gap-2.5">
        <h3 className="text-base font-semibold text-slate-900 dark:text-slate-50 leading-tight">
          {event.event_title}
        </h3>

        {/* Artist Chips */}
        {eventArtists.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {eventArtists.map((ea: EventArtist) => (
              <Chip key={ea.artist_id} variant="outline" size="sm">
                {ea.artist_name}
              </Chip>
            ))}
          </div>
        )}

        {/* Date & Time */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
          <Calendar className="h-3.5 w-3.5 shrink-0" />
          <span>
            {dateStr} · {timeStr}
          </span>
        </div>

        {/* Venue */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          <span>
            {venueName}
            {venueCity ? `, ${venueCity}` : ""}
          </span>
        </div>

        {/* Price */}
        {minPrice !== null && (
          <div className="mt-1">
            <span className="text-xs text-slate-500 dark:text-slate-400">Mulai dari </span>
            <span className="font-bold text-slate-900 dark:text-slate-50 text-sm">
              {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(minPrice)}
            </span>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 items-center justify-center mt-auto">
          {!canModify && (
            <Button className="w-full" asChild>
              <Link to={`/checkout?eventId=${event.event_id}`}>Beli Tiket</Link>
            </Button>
          )}
          {canModify && <UpdateEvent event={event} />}
        </div>
      </CardContent>
    </Card>
  );
}
