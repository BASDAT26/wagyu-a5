import { useState } from "react";
import { Button } from "@wagyu-a5/ui/components/button";
import { Input } from "@wagyu-a5/ui/components/input";
import { Label } from "@wagyu-a5/ui/components/label";
import {
  Modal,
  ModalBody,
  ModalClose,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalPopup,
  ModalTitle,
  ModalTrigger,
} from "@wagyu-a5/ui/components/modal";
import { Plus } from "lucide-react";

export default function CreateArtist() {
  const [open, setOpen] = useState(false);

  return (
    <Modal open={open} onOpenChange={setOpen}>
      <ModalTrigger asChild>
        <Button>
          <Plus className="h-4 w-4" />
          Tambah Artis
        </Button>
      </ModalTrigger>
      <ModalPopup>
        <ModalHeader>
          <ModalTitle>Tambah Artis Baru</ModalTitle>
          <ModalDescription>
            Isi data artis yang ingin ditambahkan ke platform.
          </ModalDescription>
        </ModalHeader>
        <ModalBody>
          <div className="space-y-2">
            <Label htmlFor="create-artist-name">Nama Artis</Label>
            <Input
              id="create-artist-name"
              placeholder="Masukkan nama artis..."
              maxLength={100}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="create-artist-genre">Genre</Label>
            <Input
              id="create-artist-genre"
              placeholder="Masukkan genre..."
              maxLength={100}
            />
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
  );
}
