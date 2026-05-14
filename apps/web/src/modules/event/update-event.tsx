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
import { useState, useEffect } from "react";
import { Chip } from "@wagyu-a5/ui/components/chip";
import { ChevronDown, Pencil, Loader2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { trpcClient, trpc } from "@/utils/trpc";
import { toast } from "sonner";
import type { Event, VenueOption, Artist, EventArtist } from "./types";

interface UpdateEventProps {
  event: Event;
}

export default function UpdateEvent({ event }: UpdateEventProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState(event.event_title);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [venueId, setVenueId] = useState(event.venue_id);
  const [selectedArtistIds, setSelectedArtistIds] = useState<string[]>([]);
  const queryClient = useQueryClient();

  const pad2 = (value: number) => String(value).padStart(2, "0");
  const toLocalDateInput = (dt: Date) =>
    `${dt.getFullYear()}-${pad2(dt.getMonth() + 1)}-${pad2(dt.getDate())}`;
  const toLocalTimeInput = (dt: Date) => `${pad2(dt.getHours())}:${pad2(dt.getMinutes())}`;
  const isValidUuid = (value: string) =>
    /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/.test(
      value,
    );
  const isValidEventId = isValidUuid(event.event_id);

  // Parse event_datetime into date and time fields
  useEffect(() => {
    const dt = new Date(event.event_datetime);
    setTitle(event.event_title);
    setDate(toLocalDateInput(dt));
    setTime(toLocalTimeInput(dt));
    setVenueId(event.venue_id);
  }, [event]);

  // Fetch venues, artists, and current event-artists from backend
  const { data: venues = [] } = useQuery(trpc.venue.venue.list.queryOptions());
  const { data: artists = [] } = useQuery(trpc.event.artist.list.queryOptions());
  const eventArtistsQuery = useQuery({
    ...trpc.event.eventArtist.listByEvent.queryOptions({ eventId: event.event_id }),
    enabled: isValidEventId,
  });
  const eventArtists = eventArtistsQuery.data;

  // Sync selected artists when eventArtists data arrives
  useEffect(() => {
    if (!eventArtists) return;
    const nextIds = eventArtists.map((ea: EventArtist) => ea.artist_id);
    setSelectedArtistIds((prev) =>
      prev.length === nextIds.length && prev.every((id, i) => id === nextIds[i])
        ? prev
        : nextIds,
    );
  }, [eventArtists]);

  const updateEventMutation = useMutation({
    mutationFn: async (data: {
      eventId: string;
      eventDatetime?: string;
      eventTitle?: string;
      venueId?: string;
    }) => {
      await trpcClient.event.event.update.mutate(data);

      // Sync event artists: remove deselected, add newly selected
      const currentEventArtists = await trpcClient.event.eventArtist.listByEvent.query({
        eventId: data.eventId,
      });
      const currentIds = currentEventArtists.map((ea: EventArtist) => ea.artist_id);
      const toRemove = currentIds.filter((id: string) => !selectedArtistIds.includes(id));
      const toAdd = selectedArtistIds.filter((id) => !currentIds.includes(id));

      await Promise.all(
        toRemove.map((artistId) =>
          trpcClient.event.eventArtist.delete.mutate({
            eventId: data.eventId,
            artistId,
          }),
        ),
      );
      await Promise.all(
        toAdd.map((artistId) =>
          trpcClient.event.eventArtist.create.mutate({
            eventId: data.eventId,
            artistId,
          }),
        ),
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(trpc.event.event.list.queryOptions());
      queryClient.invalidateQueries(
        trpc.event.eventArtist.listByEvent.queryOptions({ eventId: event.event_id }),
      );
      toast.success("Acara berhasil diperbarui");
      setIsModalOpen(false);
    },
    onError: (error) => {
      toast.error(error.message || "Gagal memperbarui acara");
    },
  });

  function handleSubmit() {
    if (!title || !date || !time || !venueId) {
      toast.error("Semua field wajib harus diisi");
      return;
    }
    if (!isValidEventId) {
      toast.error("Event ID tidak valid");
      return;
    }
    const eventDatetime = new Date(`${date}T${time}:00`).toISOString();
    updateEventMutation.mutate({
      eventId: event.event_id,
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
          <Button variant="outline" size="sm" className="gap-1.5">
            <Pencil className="h-3.5 w-3.5" />
            Edit
          </Button>
        </ModalTrigger>
        <ModalPopup className="max-w-2xl">
          <ModalHeader>
            <ModalTitle>Edit Acara</ModalTitle>
          </ModalHeader>
          <ModalBody>
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
              {/* ===== LEFT COLUMN ===== */}
              <div className="space-y-4">
                {/* Event Title */}
                <div>
                  <Label
                    htmlFor="edit-event-title"
                    className="text-xs font-semibold uppercase tracking-wider text-slate-500"
                  >
                    Judul Acara (EVENT_TITLE)
                  </Label>
                  <Input
                    id="edit-event-title"
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
                      htmlFor="edit-date"
                      className="text-xs font-semibold uppercase tracking-wider text-slate-500"
                    >
                      Tanggal (DATE)
                    </Label>
                    <Input
                      id="edit-date"
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="edit-time"
                      className="text-xs font-semibold uppercase tracking-wider text-slate-500"
                    >
                      Waktu (TIME)
                    </Label>
                    <Input
                      id="edit-time"
                      type="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                    />
                  </div>
                </div>

                {/* Venue Select */}
                <div>
                  <Label
                    htmlFor="edit-venue"
                    className="text-xs font-semibold uppercase tracking-wider text-slate-500"
                  >
                    Venue (VENUE_ID)
                  </Label>
                  <div className="relative">
                    <select
                      id="edit-venue"
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
                        variant={selectedArtistIds.includes(artist.artist_id) ? "default" : "outline"}
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
            <Button onClick={handleSubmit} disabled={updateEventMutation.isPending}>
              {updateEventMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Simpan
            </Button>
          </ModalFooter>
        </ModalPopup>
      </Modal>
    </div>
  );
}
