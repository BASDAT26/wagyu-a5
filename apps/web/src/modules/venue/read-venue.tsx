import { Input } from "@wagyu-a5/ui/components/input";
import { Card, CardContent } from "@wagyu-a5/ui/components/card";
import { Search, MapPin, Armchair, Building2, ChevronDown, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { trpc } from "@/utils/trpc";
import { authClient } from "@/lib/auth-client";
import { useState, useMemo } from "react";
import CreateVenue from "./create-venue";
import UpdateVenue from "./update-venue";
import DeleteVenue from "./delete-venue";
import type { Venue } from "./types";

export default function ReadVenue() {
  const { data: venues = [], isLoading } = useQuery(trpc.venue.venue.list.queryOptions());
  const { data: session } = authClient.useSession();
  const role = (session?.user as { role?: string })?.role;
  const canModify = role === "ADMIN" || role === "ORGANIZER";

  const [search, setSearch] = useState("");
  const [cityFilter, setCityFilter] = useState("all");

  const cities = useMemo(() => {
    const set = new Set(venues.map((v: Venue) => v.city));
    return Array.from(set).sort();
  }, [venues]);

  const filtered = useMemo(() => {
    return venues.filter((v: Venue) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !q || v.venue_name.toLowerCase().includes(q) || v.address.toLowerCase().includes(q);
      const matchesCity = cityFilter === "all" || v.city === cityFilter;
      return matchesSearch && matchesCity;
    });
  }, [venues, search, cityFilter]);

  const totalVenue = venues.length;
  const totalCapacity = venues.reduce((sum: number, v: Venue) => sum + v.capacity, 0);

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4 space-y-6">
      <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
              Manajemen Venue
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Kelola lokasi pertunjukan dan kapasitas tempat duduk
            </p>
          </div>
          {canModify && <CreateVenue />}
        </div>

        <div className="grid grid-cols-2 gap-4 mt-6">
          <Card className="bg-white dark:bg-slate-800">
            <CardContent className="p-4">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Total Venue
              </p>
              <p className="text-3xl font-bold text-slate-900 dark:text-slate-50 mt-1">
                {totalVenue}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-white dark:bg-slate-800">
            <CardContent className="p-4">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Total Kapasitas
              </p>
              <p className="text-3xl font-bold text-slate-900 dark:text-slate-50 mt-1">
                {totalCapacity.toLocaleString()}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            id="search-venue"
            type="text"
            placeholder="Cari nama atau alamat..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="relative">
          <select
            id="filter-city"
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            className="appearance-none h-10 rounded-md border border-input bg-background px-3 pr-8 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 cursor-pointer"
          >
            <option value="all">Semua Kota</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-slate-500">
          <Building2 className="h-12 w-12 mx-auto mb-3 text-slate-300" />
          <p className="font-medium">Tidak ada venue ditemukan</p>
          <p className="text-sm mt-1">Coba ubah filter atau kata kunci pencarian</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((venue: Venue) => (
            <Card key={venue.venue_id} className="overflow-hidden">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="shrink-0 mt-0.5 h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-slate-900 dark:text-slate-50">
                        {venue.venue_name}
                      </h3>
                      <div className="flex items-center gap-1 mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                        <MapPin className="h-3.5 w-3.5" />
                        <span>{venue.address}</span>
                      </div>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                    {venue.city}
                  </span>
                </div>

                <div className="mt-4 ml-13">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Kapasitas
                  </p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Armchair className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                    <span className="text-sm font-bold text-slate-900 dark:text-slate-50">
                      {venue.capacity.toLocaleString()} Kursi
                    </span>
                  </div>
                </div>

                {canModify && (
                  <div className="mt-4 ml-13 flex items-center gap-2">
                    <UpdateVenue venue={venue} />
                    <DeleteVenue venue={venue} />
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
