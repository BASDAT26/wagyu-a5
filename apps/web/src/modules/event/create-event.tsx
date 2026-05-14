import { Button } from "@wagyu-a5/ui/components/button";
import { Input } from "@wagyu-a5/ui/components/input";
import { Label } from "@wagyu-a5/ui/components/label";
import {
  Modal,
  ModalTrigger,
  ModalPopup,
  ModalBody,
  ModalFooter,
  ModalClose,
  ModalHeader,
  ModalTitle,
} from "@wagyu-a5/ui/components/modal";
import { useState } from "react";
import { Chip } from "@wagyu-a5/ui/components/chip";
import { Plus, ChevronDown, Loader2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { trpcClient, trpc } from "@/utils/trpc";
import { toast } from "sonner";
import type { VenueOption, Artist } from "./types";

export default function CreateEvent() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [venueId, setVenueId] = useState("");
  const [selectedArtistIds, setSelectedArtistIds] = useState<string[]>([]);
  const queryClient = useQueryClient();

  // Fetch venues and artists from the backend
  const { data: venues = [] } = useQuery(trpc.venue.venue.list.queryOptions());
  const { data: artists = [] } = useQuery(trpc.event.artist.list.queryOptions());

  const createEventMutation = useMutation({
    mutationFn: (data: { eventDatetime: string; eventTitle: string; venueId: string }) =>
      trpcClient.event.event.create.mutate(data),
    onSuccess: async (newEvent) => {
      // Link selected artists to the newly created event
      for (const artistId of selectedArtistIds) {
        await trpcClient.event.eventArtist.create.mutate({
          eventId: newEvent.event_id,
          artistId,
        });
      }
      queryClient.invalidateQueries(trpc.event.event.list.queryOptions());
      toast.success("Acara berhasil dibuat");
      resetForm();
      setIsModalOpen(false);
    },
    onError: (error) => {
      toast.error(error.message || "Gagal membuat acara");
    },
  });

  function resetForm() {
    setTitle("");
    setDate("");
    setTime("");
    setVenueId("");
    setSelectedArtistIds([]);
  }

  function handleSubmit() {
    if (!title || !date || !time || !venueId) {
      toast.error("Semua field wajib harus diisi");
      return;
    }
    const eventDatetime = new Date(`${date}T${time}:00`).toISOString();
    createEventMutation.mutate({
      eventDatetime,
      eventTitle: title,
      venueId,
    });
  }

  const toggleArtist = (artistId: string) => {
    setSelectedArtistIds((prev) =>
      prev.includes(artistId) ? prev.filter((id) => id !== artistId) : [...prev, artistId],
    );
  };

  return (
    <div>
      <Modal open={isModalOpen} onOpenChange={setIsModalOpen}>
        <ModalTrigger asChild>
          <Button>
            <Plus className="h-4 w-4" />
            Buat Acara
          </Button>
        </ModalTrigger>
        <ModalPopup className="max-w-2xl">
          <ModalHeader>
            <ModalTitle>Buat Acara Baru</ModalTitle>
          </ModalHeader>
          <ModalBody>
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
              {/* ===== LEFT COLUMN ===== */}
              <div className="space-y-4">
                {/* Event Title */}
                <div>
                  <Label
                    htmlFor="input-event-title"
                    className="text-xs font-semibold uppercase tracking-wider text-slate-500"
                  >
                    Judul Acara (EVENT_TITLE)
                  </Label>
                  <Input
                    id="input-event-title"
                    type="text"
                    placeholder="cth. Konser Melodi Senja"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                {/* Date & Time */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label
                      htmlFor="input-date"
                      className="text-xs font-semibold uppercase tracking-wider text-slate-500"
                    >
                      Tanggal (DATE)
                    </Label>
                    <Input
                      id="input-date"
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="input-time"
                      className="text-xs font-semibold uppercase tracking-wider text-slate-500"
                    >
                      Waktu (TIME)
                    </Label>
                    <Input
                      id="input-time"
                      type="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                    />
                  </div>
                </div>

                {/* Venue Select */}
                <div>
                  <Label
                    htmlFor="select-venue"
                    className="text-xs font-semibold uppercase tracking-wider text-slate-500"
                  >
                    Venue (VENUE_ID)
                  </Label>
                  <div className="relative">
                    <select
                      id="select-venue"
                      value={venueId}
                      onChange={(e) => setVenueId(e.target.value)}
                      className="w-full appearance-none h-10 rounded-md border border-input bg-background px-3 pr-8 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 cursor-pointer"
                    >
                      <option value="">Pilih Venue...</option>
                      {venues.map((v: VenueOption) => (
                        <option key={v.venue_id} value={v.venue_id}>
                          {v.venue_name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* ===== RIGHT COLUMN ===== */}
              <div className="space-y-4">
                {/* Artists */}
                <div>
                  <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Artis (EVENT_ARTIST)
                  </Label>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {artists.map((artist: Artist) => (
                      <Chip
                        key={artist.artist_id}
                        variant={
                          selectedArtistIds.includes(artist.artist_id) ? "default" : "outline"
                        }
                        size="sm"
                        className="cursor-pointer"
                        onClick={() => toggleArtist(artist.artist_id)}
                      >
                        {artist.name}
                      </Chip>
                    ))}
                    {artists.length === 0 && (
                      <p className="text-xs text-slate-400">Belum ada artis terdaftar</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <ModalClose asChild>
              <Button variant="outline">Batal</Button>
            </ModalClose>
            <Button onClick={handleSubmit} disabled={createEventMutation.isPending}>
              {createEventMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Buat Acara
            </Button>
          </ModalFooter>
        </ModalPopup>
      </Modal>
    </div>
  );
}
