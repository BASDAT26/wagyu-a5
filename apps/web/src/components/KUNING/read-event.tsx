import { Button } from "@wagyu-a5/ui/components/button";
import { Input } from "@wagyu-a5/ui/components/input";
import { Card, CardContent } from "@wagyu-a5/ui/components/card";
import { Chip } from "@wagyu-a5/ui/components/chip";
import {
  Search,
  Heart,
  Calendar,
  MapPin,
  DollarSign,
  ChevronDown,
  Music,
  Palette,
  Guitar,
} from "lucide-react";
import CreateEvent from "./create-event";
import UpdateEvent from "./update-event";

interface TicketCategory {
  name: string;
  price: number;
  quantity: number;
}

interface EventItem {
  id: string;
  title: string;
  date: string;
  time: string;
  venueName: string;
  venueCity: string;
  artists: string[];
  ticketCategories: TicketCategory[];
  icon: "music" | "palette" | "guitar";
}

const dummyEvents: EventItem[] = [
  {
    id: "1",
    title: "Konser Melodi Senja",
    date: "2024-05-15",
    time: "19:00",
    venueName: "Jakarta Convention Center",
    venueCity: "Jakarta",
    artists: ["Fourtwenty", "Hindia"],
    ticketCategories: [
      { name: "WVIP", price: 1500000, quantity: 50 },
      { name: "VIP", price: 750000, quantity: 150 },
      { name: "Category 1", price: 450000, quantity: 300 },
      { name: "Category 2", price: 250000, quantity: 500 },
    ],
    icon: "music",
  },
  {
    id: "2",
    title: "Festival Seni Budaya",
    date: "2024-05-22",
    time: "10:00",
    venueName: "Taman Impian Jayakarta",
    venueCity: "Jakarta Utara",
    artists: ["Tulus"],
    ticketCategories: [
      { name: "General Admission", price: 150000, quantity: 1000 },
    ],
    icon: "palette",
  },
  {
    id: "3",
    title: "Malam Akustik Bandung",
    date: "2024-06-10",
    time: "18:00",
    venueName: "Bandung Hall Center",
    venueCity: "Bandung",
    artists: ["Pamungkas", "Nadin Amizah"],
    ticketCategories: [
      { name: "WVIP", price: 1200000, quantity: 30 },
      { name: "VIP", price: 600000, quantity: 100 },
      { name: "Regular", price: 350000, quantity: 500 },
    ],
    icon: "guitar",
  },
];

const allVenues = [
  "Jakarta Convention Center",
  "Taman Impian Jayakarta",
  "Bandung Hall Center",
];
const allArtists = [
  "Fourtwenty",
  "Hindia",
  "Tulus",
  "Nadin Amizah",
  "Pamungkas",
  "Raisa",
];

function getLowestPrice(categories: TicketCategory[]): number {
  return Math.min(...categories.map((c) => c.price));
}

function EventIcon({ type }: { type: "music" | "palette" | "guitar" }) {
  const iconClass = "h-10 w-10 text-white drop-shadow-md";
  switch (type) {
    case "music":
      return <Music className={iconClass} />;
    case "palette":
      return <Palette className={iconClass} />;
    case "guitar":
      return <Guitar className={iconClass} />;
  }
}

export default function ReadEvent() {
  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4 space-y-6">
      {/* Header */}
      <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
              Jelajahi Acara
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Temukan acara terbaik dan beli tiket favorit Anda
            </p>
          </div>
          <CreateEvent />
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            id="search-event"
            type="text"
            placeholder="Cari acara atau artis..."
            className="pl-10"
          />
        </div>
        <div className="relative">
          <select
            id="filter-venue"
            className="appearance-none h-10 rounded-md border border-input bg-background px-3 pr-8 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 cursor-pointer"
          >
            <option value="all">Semua Venue</option>
            {allVenues.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
        </div>
        <div className="relative">
          <select
            id="filter-artist"
            className="appearance-none h-10 rounded-md border border-input bg-background px-3 pr-8 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 cursor-pointer"
          >
            <option value="all">Semua Artis</option>
            {allArtists.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* Event Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {dummyEvents.map((event) => (
          <Card
            key={event.id}
            className="overflow-hidden flex flex-col group hover:shadow-lg transition-shadow duration-300"
          >
            {/* Card Header — Gradient with Icon */}
            <div className="relative h-36 bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <EventIcon type={event.icon} />
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
                {event.title}
              </h3>

              {/* Artist Chips */}
              <div className="flex flex-wrap gap-1">
                {event.artists.map((artist) => (
                  <Chip key={artist} variant="outline" size="sm">
                    {artist}
                  </Chip>
                ))}
              </div>

              {/* Date & Time */}
              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                <Calendar className="h-3.5 w-3.5 shrink-0" />
                <span>
                  {event.date} · {event.time}
                </span>
              </div>

              {/* Venue */}
              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                <span>
                  {event.venueName}, {event.venueCity}
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-1.5 text-xs font-semibold text-green-600 dark:text-green-400">
                <DollarSign className="h-3.5 w-3.5 shrink-0" />
                <span>
                  Mulai Rp{" "}
                  {getLowestPrice(event.ticketCategories).toLocaleString()}
                </span>
              </div>

              {/* Ticket Category Chips */}
              <div className="flex flex-wrap gap-1 mt-auto">
                {event.ticketCategories.map((cat) => (
                  <Chip key={cat.name} variant="outline" size="sm">
                    {cat.name}
                  </Chip>
                ))}
              </div>

              {/* Buy Button */}
              <div className="flex gap-2 items-center justify-center">
                <Button className="w-full">Beli Tiket</Button>
                <UpdateEvent />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
