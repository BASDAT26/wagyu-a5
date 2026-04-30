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

import CreateArtist from "./create-artist";
import UpdateArtist from "./update-artist";
import DeleteArtist from "./delete-artist";

// Data from SQL INSERT — sorted by name ascending
const ARTISTS = [
  { artist_id: "c9e3a4f5-b6d7-4c8e-0f1a-2b3c4d5e6f03", name: "Cortis", genre: "K-Hiphop" },
  { artist_id: "e1a5c6b7-d8f9-4e0a-2b3c-4d5e6f7a8b05", name: "Dewa 19", genre: "Rock" },
  { artist_id: "d0f4b5a6-c7e8-4d9f-1a2b-3c4d5e6f7a04", name: "Hindia", genre: "Indie Pop" },
  { artist_id: "a3c7e8d9-f0b1-4a2c-4d5e-6f7a8b9c0d07", name: "Jennie", genre: "K-Pop" },
  { artist_id: "b8d2f3e4-a5c6-4b7d-9e0f-1a2b3c4d5e02", name: "Lngshot", genre: "K-Hiphop" },
  { artist_id: "a7c1e2d3-f4b5-4a6c-8d9e-0f1a2b3c4d01", name: "Seventeen", genre: "K-Pop" },
  { artist_id: "f2b6d7c8-e9a0-4f1b-3c4d-5e6f7a8b9c06", name: "Taylor Swift", genre: "Pop" },
  { artist_id: "b4d8f9e0-a1c2-4b3d-5e6f-7a8b9c0d1e08", name: "Tenxi", genre: "Hip-dut" },
];

const GENRE_CHIP_VARIANT: Record<string, "default" | "secondary" | "destructive" | "success" | "warning" | "outline"> = {
  "K-Pop": "default",
  "K-Hiphop": "outline",
  "Indie Pop": "success",
  "Rock": "destructive",
  "Pop": "warning",
  "Hip-dut": "outline",
};

// Custom className overrides for genres that need non-standard colors
const GENRE_CHIP_CLASS: Record<string, string> = {
  "K-Hiphop": "bg-purple-500/10 text-purple-700 border-purple-500/20 hover:bg-purple-500/20 dark:text-purple-400",
};

function ArtistAvatar({ name }: { name: string }) {
  const initial = name.charAt(0).toUpperCase();
  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600 text-white text-sm font-bold shrink-0">
      {initial}
    </div>
  );
}

export default function ReadArtist() {
  const [isAdmin, setIsAdmin] = useState(true);
  const [search, setSearch] = useState("");
  const [genreFilter, setGenreFilter] = useState("");
  const [view, setView] = useState<"table" | "list">("list");

  const filteredArtists = ARTISTS.filter((artist) => {
    const matchesSearch =
      artist.name.toLowerCase().includes(search.toLowerCase()) ||
      artist.genre.toLowerCase().includes(search.toLowerCase());
    const matchesGenre = genreFilter === "" || artist.genre === genreFilter;
    return matchesSearch && matchesGenre;
  });

  const uniqueGenres = Array.from(new Set(ARTISTS.map((a) => a.genre))).sort();
  const numUniqueGenres = uniqueGenres.length;

  return (
    <div className="w-full space-y-6 gap-12 p-6 max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Daftar Artist</h1>
          <p className="text-sm text-muted-foreground">
            Daftar artist yang terdaftar pada sistem TikTakTuk
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
            {isAdmin ? "Admin" : "Non-Admin"} (klik untuk toggle)
          </Chip>

          {/* Tambah Artist — only visible for Admin */}
          {isAdmin && <CreateArtist />}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Total Artis
            </p>
            <p className="text-3xl font-bold mt-1">{ARTISTS.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Genre
            </p>
            <p className="text-3xl font-bold mt-1">{numUniqueGenres}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Tampil di Event
            </p>
            <p className="text-3xl font-bold mt-1">{ARTISTS.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Artist Grid Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Tabel Artist</CardTitle>
              <CardDescription>
                {isAdmin
                  ? "Anda login sebagai Admin — dapat mengelola data artist."
                  : "Anda login sebagai non-Admin — hanya dapat melihat data."}
              </CardDescription>
            </div>
            {/* View Toggle */}
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
          {/* Search, Filter & Count */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 w-full sm:w-auto">
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

              {/* Genre Filter */}
              <select
                id="filter-genre"
                value={genreFilter}
                onChange={(e) => setGenreFilter(e.target.value)}
                className="flex h-10 w-full sm:w-48 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="">Semua Genre</option>
                {uniqueGenres.map((genre) => (
                  <option key={genre} value={genre}>
                    {genre}
                  </option>
                ))}
              </select>
            </div>

            <p className="text-sm text-muted-foreground whitespace-nowrap">
              {filteredArtists.length} artis ditemukan
            </p>
          </div>

          {/* 3-column Card Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredArtists.map((artist) => (
              <Card key={artist.artist_id} className="relative overflow-hidden">
                <CardContent className="pt-5 pb-5">
                  <div className="flex items-center gap-3">
                    <ArtistAvatar name={artist.name} />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{artist.name}</p>
                      <Chip
                        size="sm"
                        variant={GENRE_CHIP_VARIANT[artist.genre] ?? "default"}
                        className={`mt-1 ${GENRE_CHIP_CLASS[artist.genre] ?? ""}`}
                      >
                        {artist.genre}
                      </Chip>
                    </div>
                    {isAdmin && (
                      <div className="flex items-center gap-0.5 shrink-0">
                        <UpdateArtist
                          artistId={artist.artist_id}
                          currentName={artist.name}
                          currentGenre={artist.genre}
                        />
                        <DeleteArtist
                          artistId={artist.artist_id}
                          artistName={artist.name}
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredArtists.length === 0 && (
            <div className="py-8 text-center text-muted-foreground">
              Tidak ada artis yang ditemukan.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
