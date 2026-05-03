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
} from "@wagyu-a5/ui/components/modal";
import { Pencil } from "lucide-react";

interface UpdateArtistProps {
  artistId?: string;
  currentName?: string;
  currentGenre?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function UpdateArtist({
  currentName = "",
  currentGenre = "",
  open: controlledOpen,
  onOpenChange,
}: UpdateArtistProps) {
  const [internalOpen, setInternalOpen] = useState(false);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? (onOpenChange ?? (() => {})) : setInternalOpen;

  return (
    <Modal open={open} onOpenChange={setOpen}>
      {!isControlled && (
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setOpen(true)}>
          <Pencil className="h-4 w-4" />
        </Button>
      )}
      <ModalPopup>
        <ModalHeader>
          <ModalTitle>Edit Artis</ModalTitle>
          <ModalDescription>Ubah data artis yang sudah terdaftar.</ModalDescription>
        </ModalHeader>
        <ModalBody>
          <div className="space-y-2">
            <Label htmlFor="update-artist-name">Nama Artis</Label>
            <Input
              id="update-artist-name"
              placeholder="Masukkan nama artis..."
              defaultValue={currentName}
              maxLength={100}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="update-artist-genre">Genre</Label>
            <Input
              id="update-artist-genre"
              placeholder="Masukkan genre..."
              defaultValue={currentGenre}
              maxLength={100}
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <ModalClose asChild>
            <Button variant="outline">Batal</Button>
          </ModalClose>
          <Button>Simpan Perubahan</Button>
        </ModalFooter>
      </ModalPopup>
    </Modal>
  );
}
