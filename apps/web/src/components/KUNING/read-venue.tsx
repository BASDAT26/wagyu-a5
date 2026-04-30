import { Button } from "@wagyu-a5/ui/components/button";
import { Input } from "@wagyu-a5/ui/components/input";
import { Card, CardContent } from "@wagyu-a5/ui/components/card";
import {
  Search,
  Plus,
  MapPin,
  Armchair,
  Pencil,
  Trash2,
  Building2,
  ChevronDown,
} from "lucide-react";
import type { Venue } from "./interface";
import CreateVenue from "./create-venue";
import UpdateVenue from "./update-venue";
import DeleteVenue from "./delete-venue";

const dummyVenues: Venue[] = [
  {
    id: "1",
    name: "Jakarta Convention Center",
    capacity: 1000,
    city: "Jakarta",
    address: "Jl. Gatot Subroto No.1, Jakarta",
    hasReservedSeating: true,
  },
  {
    id: "2",
    name: "Taman Impian Jayakarta",
    capacity: 500,
    city: "Jakarta Utara",
    address: "Jl. Lodan Timur No.7, Jakarta Utara",
    hasReservedSeating: false,
  },
  {
    id: "3",
    name: "Bandung Hall Center",
    capacity: 800,
    city: "Bandung",
    address: "Jl. Asia Afrika, Bandung",
    hasReservedSeating: true,
  },
];

export default function ReadVenue() {
  const totalVenue = dummyVenues.length;
  const reservedSeatingCount = dummyVenues.filter(
    (v) => v.hasReservedSeating,
  ).length;
  const totalCapacity = dummyVenues.reduce((sum, v) => sum + v.capacity, 0);

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
          <CreateVenue/>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-6">
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
                Reserved Seating
              </p>
              <p className="text-3xl font-bold text-slate-900 dark:text-slate-50 mt-1">
                {reservedSeatingCount}
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
          />
        </div>
        <div className="relative">
          <select
            id="filter-city"
            className="appearance-none h-10 rounded-md border border-input bg-background px-3 pr-8 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 cursor-pointer"
          >
            <option value="all">Semua Kota</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
        </div>
        <div className="relative">
          <select
            id="filter-seating"
            className="appearance-none h-10 rounded-md border border-input bg-background px-3 pr-8 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 cursor-pointer"
          >
            <option value="all">Semua Tipe Seating</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
        </div>
      </div>

      <div className="space-y-4">
        {dummyVenues.map((venue) => (
          <Card key={venue.id} className="overflow-hidden">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="shrink-0 mt-0.5 h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-slate-900 dark:text-slate-50">
                      {venue.name}
                    </h3>
                    <div className="flex items-center gap-1 mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                      <MapPin className="h-3.5 w-3.5" />
                      <span>{venue.address}</span>
                    </div>
                  </div>
                </div>

                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ${
                    venue.hasReservedSeating
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                      : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  }`}
                >
                  <Armchair className="h-3.5 w-3.5" />
                  {venue.hasReservedSeating
                    ? "Reserved Seating"
                    : "Free Seating"}
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

              <div className="mt-4 ml-13 flex items-center gap-2">
                <UpdateVenue/>
                <DeleteVenue/>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
