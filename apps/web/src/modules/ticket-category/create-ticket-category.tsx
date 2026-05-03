import { useState } from "react";
import { Button } from "@wagyu-a5/ui/components/button";
import { Input } from "@wagyu-a5/ui/components/input";
import { Label } from "@wagyu-a5/ui/components/label";
import {
  Modal,
  ModalBody,
  ModalClose,
  ModalFooter,
  ModalHeader,
  ModalPopup,
  ModalTitle,
  ModalTrigger,
} from "@wagyu-a5/ui/components/modal";
import { Plus } from "lucide-react";

interface Event {
  event_id: string;
  event_name: string;
}

interface CreateTicketCategoryProps {
  events: Event[];
}

export default function CreateTicketCategory({ events }: CreateTicketCategoryProps) {
  const [open, setOpen] = useState(false);

  return (
    <Modal open={open} onOpenChange={setOpen}>
      <ModalTrigger asChild>
        <Button>
          <Plus className="h-4 w-4" />
          Tambah Kategori
        </Button>
      </ModalTrigger>
      <ModalPopup>
        <ModalHeader>
          <ModalTitle>Tambah Kategori Baru</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="create-tc-event">
                ACARA <span className="text-destructive">*</span>
              </Label>
              <select
                id="create-tc-event"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                defaultValue=""
              >
                <option value="" disabled>
                  Pilih acara...
                </option>
                {events.map((event) => (
                  <option key={event.event_id} value={event.event_id}>
                    {event.event_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-tc-name">
                NAMA KATEGORI <span className="text-destructive">*</span>
              </Label>
              <Input id="create-tc-name" placeholder="cth. WVIP" maxLength={100} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="create-tc-price">
                  HARGA (RP) <span className="text-destructive">*</span>
                </Label>
                <Input id="create-tc-price" type="number" placeholder="750000" min={0} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="create-tc-quota">
                  KUOTA <span className="text-destructive">*</span>
                </Label>
                <Input id="create-tc-quota" type="number" placeholder="100" min={1} />
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <ModalClose asChild>
            <Button variant="outline">Batal</Button>
          </ModalClose>
          <Button>Tambah</Button>
        </ModalFooter>
      </ModalPopup>
    </Modal>
  );
}
