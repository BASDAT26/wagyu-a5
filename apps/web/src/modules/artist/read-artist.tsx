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
import { Search, Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useQuery } from "@tanstack/react-query";
import { trpc } from "@/utils/trpc";

import CreateArtist from "./create-artist";
import UpdateArtist from "./update-artist";
import DeleteArtist from "./delete-artist";


const GENRE_CHIP_VARIANT: Record<
  string,
  "default" | "secondary" | "destructive" | "success" | "warning" | "outline"
> = {
  "K-Pop": "default",
  "K-Hiphop": "outline",
  "Indie Pop": "success",
  Rock: "destructive",
  Pop: "warning",
  "Hip-dut": "outline",
};

// Custom className overrides for genres that need non-standard colors
const GENRE_CHIP_CLASS: Record<string, string> = {
  "K-Hiphop":
    "bg-purple-500/10 text-purple-700 border-purple-500/20 hover:bg-purple-500/20 dark:text-purple-400",
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
  const { data: session } = authClient.useSession();
  const role = (session?.user as { role?: string })?.role;
  const isAdmin = role === "ADMIN";

  const [search, setSearch] = useState("");
  const [genreFilter, setGenreFilter] = useState("");
  const [view, setView] = useState<"table" | "list">("list");

  const { data: artists = [], isLoading } = useQuery(trpc.event.artist.list.queryOptions());

  const filteredArtists = artists.filter((artist) => {
    const genre = artist.genre || "Lainnya";
    const matchesSearch =
      artist.name.toLowerCase().includes(search.toLowerCase()) ||
      genre.toLowerCase().includes(search.toLowerCase());
    const matchesGenre = genreFilter === "" || genre === genreFilter;
    return matchesSearch && matchesGenre;
  });

  const uniqueGenres = Array.from(new Set(artists.map((a) => a.genre || "Lainnya"))).sort();
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
            <p className="text-3xl font-bold mt-1">{artists.length}</p>
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
            <p className="text-3xl font-bold mt-1">{artists.length}</p>
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
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
            </div>
          ) : (
            <>
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
                      Nama
                    </th>
                    <th className="px-4 py-3 text-left font-semibold uppercase tracking-wider text-xs text-muted-foreground">
                      Genre
                    </th>
                    {isAdmin && (
                      <th className="px-4 py-3 text-right font-semibold uppercase tracking-wider text-xs text-muted-foreground">
                        Aksi
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {filteredArtists.map((artist, index) => (
                    <tr
                      key={artist.artist_id}
                      className="border-b last:border-b-0 hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-4 py-4 text-muted-foreground font-medium">{index + 1}</td>
                      <td className="px-4 py-4 font-mono text-xs text-muted-foreground">{artist.artist_id}</td>
                      <td className="px-4 py-4 font-semibold">
                        <div className="flex items-center gap-3">
                          <ArtistAvatar name={artist.name} />
                          {artist.name}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <Chip
                          size="sm"
                          variant={GENRE_CHIP_VARIANT[artist.genre] ?? "default"}
                          className={`${GENRE_CHIP_CLASS[artist.genre] ?? ""}`}
                        >
                          {artist.genre}
                        </Chip>
                      </td>
                      {isAdmin && (
                        <td className="px-4 py-4">
                          <div className="flex items-center justify-end gap-1">
                            <UpdateArtist
                              artistId={artist.artist_id}
                              currentName={artist.name}
                              currentGenre={artist.genre}
                            />
                            <DeleteArtist artistId={artist.artist_id} artistName={artist.name} />
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredArtists.length === 0 && (
                <div className="py-8 text-center text-muted-foreground">
                  Tidak ada artis yang ditemukan.
                </div>
              )}
            </div>
          )}

          {/* ── List / Card View ───────────────────────────────── */}
          {view === "list" && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredArtists.map((artist) => (
                  <Card key={artist.artist_id} className="relative overflow-hidden">
                    <CardContent className="pt-5 pb-5">
                      <div className="flex items-center gap-3">
                        <ArtistAvatar name={artist.name} />
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] font-mono text-muted-foreground truncate mb-0.5" title={artist.artist_id}>
                            {artist.artist_id}
                          </p>
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
                            <DeleteArtist artistId={artist.artist_id} artistName={artist.name} />
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
            </>
          )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
