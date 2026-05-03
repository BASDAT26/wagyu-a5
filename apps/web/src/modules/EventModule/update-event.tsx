// [REFACTOR] Cleaned up:
// - Removed unused ModalDescription import
// - Replaced inline TicketCategory interface → shared types.ts
// - Replaced inline allArtists/dummyVenues → shared data/mock.ts
// - Replaced inline ticket category form → shared TicketCategoryEditor

import { Button } from "@wagyu-a5/ui/components/button";
import { Input } from "@wagyu-a5/ui/components/input";
import { Textarea } from "@wagyu-a5/ui/components/textarea";
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
import { ChevronDown, Pencil } from "lucide-react";
import { MOCK_ARTISTS, MOCK_VENUES } from "@/data/mock";
import type { TicketCategoryForm } from "./types";
import TicketCategoryEditor from "./ticket-category-editor";

export default function UpdateEvent() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Pre-filled dummy data for editing
  const [title, setTitle] = useState("Konser Melodi Senja");
  const [date, setDate] = useState("2024-05-15");
  const [time, setTime] = useState("19:00");
  const [venueId, setVenueId] = useState("1");
  const [selectedArtists, setSelectedArtists] = useState<string[]>(["Fourtwenty", "Hindia"]);
  const [ticketCategories, setTicketCategories] = useState<TicketCategoryForm[]>([
    { name: "WVIP", price: "1500000", quantity: "50" },
    { name: "VIP", price: "750000", quantity: "150" },
    { name: "Category 1", price: "450000", quantity: "300" },
    { name: "Category 2", price: "250000", quantity: "500" },
  ]);
  const [description, setDescription] = useState(
    "Nikmati suasana senja dengan alunan musik indie yang menenangkan.",
  );

  const toggleArtist = (artist: string) => {
    setSelectedArtists((prev) =>
      prev.includes(artist) ? prev.filter((a) => a !== artist) : [...prev, artist],
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
                      {MOCK_VENUES.map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                {/* Artists */}
                <div>
                  <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Artis (EVENT_ARTIST)
                  </Label>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {MOCK_ARTISTS.map((artist) => (
                      <Chip
                        key={artist}
                        variant={selectedArtists.includes(artist) ? "default" : "outline"}
                        size="sm"
                        className="cursor-pointer"
                        onClick={() => toggleArtist(artist)}
                      >
                        {artist}
                      </Chip>
                    ))}
                  </div>
                </div>
              </div>

              {/* ===== RIGHT COLUMN ===== */}
              <div className="space-y-4">
                {/* Ticket Categories — now a shared component */}
                <TicketCategoryEditor
                  categories={ticketCategories}
                  onChange={setTicketCategories}
                  idPrefix="edit"
                />

                {/* Description */}
                <div>
                  <Label
                    htmlFor="edit-description"
                    className="text-xs font-semibold uppercase tracking-wider text-slate-500"
                  >
                    Deskripsi
                  </Label>
                  <Textarea
                    id="edit-description"
                    placeholder="Deskripsi acara..."
                    className="min-h-25"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <ModalClose asChild>
              <Button variant="outline">Batal</Button>
            </ModalClose>
            <Button>Simpan</Button>
          </ModalFooter>
        </ModalPopup>
      </Modal>
    </div>
  );
}
