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
import { Checkbox } from "@wagyu-a5/ui/components/checkbox";
import { Pencil } from "lucide-react";
import type { Venue } from "../interface";

export default function UpdateVenue() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dummyVenue: Venue = {
    id: "1",
    name: "Stadion GBK",
    capacity: 1000,
    city: "Jakarta",
    address: "Jl. Merdeka Barat",
    hasReservedSeating: true,
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
        <ModalPopup>
          <ModalHeader>
            <ModalTitle>Edit Venue</ModalTitle>
          </ModalHeader>
          <ModalBody>
            <div className="space-y-2 w-full">
              <div>
                <Label htmlFor="input-venue-name">
                  NAMA VENUE (VENUE_NAME)
                </Label>
                <Input
                  id="input-venue-name"
                  type="text"
                  placeholder="cth. Jakarta Convention Center"
                  value={dummyVenue.name}
                />
              </div>
              <div className="grid w-full gap-4 grid-cols-2">
                <div>
                  <Label htmlFor="input-capacity">KAPASITAS (CAPACITY)</Label>
                  <Input
                    id="input-capacity"
                    type="number"
                    placeholder="1000"
                    value={dummyVenue.capacity}
                  />
                </div>
                <div>
                  <Label htmlFor="input-city">KOTA (CITY)</Label>
                  <Input
                    id="input-city"
                    type="text"
                    placeholder="Jakarta"
                    value={dummyVenue.city}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="input-address">ALAMAT (ADDRESS)</Label>
                <Textarea
                  id="input-address"
                  placeholder="Jl. Gatot Subroto No.1"
                  value={dummyVenue.address}
                />
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="check-seat"
                  checked={dummyVenue.hasReservedSeating}
                />
                <Label htmlFor="check-seat">Has Reserved Seating</Label>
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
