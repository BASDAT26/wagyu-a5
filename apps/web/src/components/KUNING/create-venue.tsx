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
import { Plus } from "lucide-react";

export default function CreateVenue() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div>
      <Modal open={isModalOpen} onOpenChange={setIsModalOpen}>
        <ModalTrigger asChild>
          <Button>
            <Plus className="h-4 w-4" />
            Tambah Venue
          </Button>
        </ModalTrigger>
        <ModalPopup>
          <ModalHeader>
            <ModalTitle>Tambah Venue Baru</ModalTitle>
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
                />
              </div>
              <div className="grid w-full gap-4 grid-cols-2">
                <div>
                  <Label htmlFor="input-capacity">KAPASITAS (CAPACITY)</Label>
                  <Input id="input-capacity" type="number" placeholder="1000" />
                </div>
                <div>
                  <Label htmlFor="input-city">KOTA (CITY)</Label>
                  <Input id="input-city" type="text" placeholder="Jakarta" />
                </div>
              </div>
              <div>
                <Label htmlFor="input-address">ALAMAT (ADDRESS)</Label>
                <Textarea
                  id="input-address"
                  placeholder="Jl. Gatot Subroto No.1"
                />
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="check-seat" />
                <Label htmlFor="check-seat">Has Reserved Seating</Label>
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
    </div>
  );
}
