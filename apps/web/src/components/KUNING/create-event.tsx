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
  ModalDescription,
} from "@wagyu-a5/ui/components/modal";
import { useState } from "react";
import { Chip } from "@wagyu-a5/ui/components/chip";
import { Plus, X, ChevronDown } from "lucide-react";

interface TicketCategory {
  name: string;
  price: string;
  quantity: string;
}

const dummyArtists = [
  "Fourtwenty",
  "Hindia",
  "Tulus",
  "Nadin Amizah",
  "Pamungkas",
  "Raisa",
];

const dummyVenues = [
  { id: "1", name: "Jakarta Convention Center" },
  { id: "2", name: "Taman Impian Jayakarta" },
  { id: "3", name: "Bandung Hall Center" },
];

export default function CreateEvent() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ticketCategories, setTicketCategories] = useState<TicketCategory[]>([
    { name: "Regular", price: "100000", quantity: "100" },
  ]);

  const addCategory = () => {
    setTicketCategories([
      ...ticketCategories,
      { name: "", price: "", quantity: "" },
    ]);
  };

  const removeCategory = (index: number) => {
    setTicketCategories(ticketCategories.filter((_, i) => i !== index));
  };

  const updateCategory = (
    index: number,
    field: keyof TicketCategory,
    value: string
  ) => {
    const updated = [...ticketCategories];
    updated[index] = { ...updated[index], [field]: value };
    setTicketCategories(updated);
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
                      {dummyVenues.map((v) => (
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
                    {dummyArtists.map((artist) => (
                      <Chip key={artist} variant="outline" size="sm">
                        {artist}
                      </Chip>
                    ))}
                  </div>
                </div>
              </div>

              {/* ===== RIGHT COLUMN ===== */}
              <div className="space-y-4">
                {/* Ticket Categories */}
                <div>
                  <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Kategori Tiket (TICKET_CATEGORY)
                  </Label>
                  <div className="space-y-2 mt-1">
                    {ticketCategories.map((cat, index) => (
                      <div key={index} className="space-y-1.5">
                        <div className="flex items-center gap-1.5">
                          <Input
                            id={`input-cat-name-${index}`}
                            type="text"
                            placeholder="Nama kategori"
                            value={cat.name}
                            onChange={(e) =>
                              updateCategory(index, "name", e.target.value)
                            }
                            className="flex-1"
                          />
                          <button
                            type="button"
                            onClick={() => removeCategory(index)}
                            className="shrink-0 p-1 rounded-full text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            aria-label="Remove category"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="grid grid-cols-2 gap-1.5">
                          <Input
                            id={`input-cat-price-${index}`}
                            type="number"
                            placeholder="Harga"
                            value={cat.price}
                            onChange={(e) =>
                              updateCategory(index, "price", e.target.value)
                            }
                          />
                          <Input
                            id={`input-cat-qty-${index}`}
                            type="number"
                            placeholder="Jumlah"
                            value={cat.quantity}
                            onChange={(e) =>
                              updateCategory(index, "quantity", e.target.value)
                            }
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={addCategory}
                    className="mt-2 text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 transition-colors"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Tambah Kategori
                  </button>
                </div>

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
