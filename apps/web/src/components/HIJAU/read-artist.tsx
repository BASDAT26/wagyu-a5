import { useState } from "react";
import { Button } from "@wagyu-a5/ui/components/button";
import { Input } from "@wagyu-a5/ui/components/input";
import {
  Card,
  CardContent,
} from "@wagyu-a5/ui/components/card";
import { Chip } from "@wagyu-a5/ui/components/chip";
import { Search } from "lucide-react";

import CreateArtist from "./create-artist";
import UpdateArtist from "./update-artist";
import DeleteArtist from "./delete-artist";

const DUMMY_ARTISTS = [
  { id: "1", name: "Fourtwnty", genre: "Indie Folk" },
  { id: "2", name: "Hindia", genre: "Indie Pop" },
  { id: "3", name: "Tulus", genre: "Pop" },
  { id: "4", name: "Nadin Amizah", genre: "Folk" },
  { id: "5", name: "Pamungkas", genre: "Singer-Songwriter" },
  { id: "6", name: "Raisa", genre: "R&B / Pop" },
];

const GENRE_CHIP_VARIANT: Record<string, "default" | "secondary" | "destructive" | "success" | "warning" | "outline"> = {
  "Indie Folk": "default",
  "Indie Pop": "default",
  "Pop": "destructive",
  "Folk": "success",
  "Singer-Songwriter": "warning",
  "R&B / Pop": "destructive",
};

function ArtistAvatar({ name }: { name: string }) {
  return (
    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold shrink-0">
      {name.charAt(0).toUpperCase()}
    </div>
  );
}

export default function ReadArtist() {
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"table" | "list">("list");

  const filteredArtists = DUMMY_ARTISTS.filter(
    (artist) =>
      artist.name.toLowerCase().includes(search.toLowerCase()) ||
      artist.genre.toLowerCase().includes(search.toLowerCase()),
  );

  const uniqueGenres = new Set(DUMMY_ARTISTS.map((a) => a.genre)).size;

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Daftar Artis</h1>
          <p className="text-sm text-muted-foreground">
            Kelola artis yang ada di platform TikTakTuk
          </p>
        </div>
        <CreateArtist />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Total Artis
            </p>
            <p className="text-3xl font-bold mt-1">{DUMMY_ARTISTS.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Genre
            </p>
            <p className="text-3xl font-bold mt-1">{uniqueGenres}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Tampil di Event
            </p>
            <p className="text-3xl font-bold mt-1">{DUMMY_ARTISTS.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Table Section */}
      <Card>
        <CardContent className="pt-6">
          {/* Table Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Tabel Artis</h2>
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

          {/* Search & Count */}
          <div className="flex items-center justify-between mb-4 gap-4">
            <div className="relative max-w-sm w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="search-artist"
                placeholder="Cari nama atau genre..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <p className="text-sm text-muted-foreground whitespace-nowrap">
              {filteredArtists.length} artis ditemukan
            </p>
          </div>

          {/* Column Headers */}
          <div className="grid grid-cols-[1fr_1fr_auto] items-center px-4 pb-2 border-b">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Artis
            </p>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Genre
            </p>
            <div className="w-20" />
          </div>

          {/* Artist Rows */}
          <div className="divide-y">
            {filteredArtists.map((artist) => (
              <div
                key={artist.id}
                className="grid grid-cols-[1fr_1fr_auto] items-center px-4 py-3 hover:bg-muted/50 transition-colors"
              >
                {/* Artist Info */}
                <div className="flex items-center gap-3">
                  <ArtistAvatar name={artist.name} />
                  <span className="font-medium">{artist.name}</span>
                </div>

                {/* Genre Chip */}
                <div>
                  <Chip
                    size="sm"
                    variant={GENRE_CHIP_VARIANT[artist.genre] ?? "default"}
                  >
                    {artist.genre.toUpperCase()}
                  </Chip>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1">
                  <UpdateArtist
                    artistId={artist.id}
                    currentName={artist.name}
                    currentGenre={artist.genre}
                  />
                  <DeleteArtist
                    artistId={artist.id}
                    artistName={artist.name}
                  />
                </div>
              </div>
            ))}

            {filteredArtists.length === 0 && (
              <div className="py-8 text-center text-muted-foreground">
                Tidak ada artis yang ditemukan.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
