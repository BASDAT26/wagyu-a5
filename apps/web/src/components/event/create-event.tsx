// [REFACTOR] Cleaned up:
// - Removed unused ModalDescription import
// - Replaced inline TicketCategory interface → shared types.ts
// - Replaced inline dummyArtists/dummyVenues → shared data/mock.ts
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
import { Plus, ChevronDown } from "lucide-react";
import { MOCK_ARTISTS, MOCK_VENUES } from "@/data/mock";
import type { TicketCategoryForm } from "./types";
import TicketCategoryEditor from "./ticket-category-editor";

export default function CreateEvent() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ticketCategories, setTicketCategories] = useState<TicketCategoryForm[]>([
    { name: "Regular", price: "100000", quantity: "100" },
  ]);

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
                  <Label htmlFor="input-event-title" className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Judul Acara (EVENT_TITLE)
                  </Label>
                  <Input
                    id="input-event-title"
                    type="text"
                    placeholder="cth. Konser Melodi Senja"
                  />
                </div>

                {/* Date & Time */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="input-date" className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Tanggal (DATE)
                    </Label>
                    <Input id="input-date" type="date" />
                  </div>
                  <div>
                    <Label htmlFor="input-time" className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Waktu (TIME)
                    </Label>
                    <Input id="input-time" type="time" />
                  </div>
                </div>

                {/* Venue Select */}
                <div>
                  <Label htmlFor="select-venue" className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Venue (VENUE_ID)
                  </Label>
                  <div className="relative">
                    <select
                      id="select-venue"
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
                      <Chip key={artist} variant="outline" size="sm">
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
                  idPrefix="input"
                />

                {/* Description */}
                <div>
                  <Label htmlFor="input-description" className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Deskripsi
                  </Label>
                  <Textarea
                    id="input-description"
                    placeholder="Deskripsi acara..."
                    className="min-h-25"
                  />
                </div>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <ModalClose asChild>
              <Button variant="outline">Batal</Button>
            </ModalClose>
            <Button>Buat Acara</Button>
          </ModalFooter>
        </ModalPopup>
      </Modal>
    </div>
  );
}
