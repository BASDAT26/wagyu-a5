import { useState } from "react";
import { Button } from "@wagyu-a5/ui/components/button";
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
import { Trash2 } from "lucide-react";

interface DeleteArtistProps {
  artistName?: string;
  artistId?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function DeleteArtist({
  artistName = "artis ini",
  open: controlledOpen,
  onOpenChange,
}: DeleteArtistProps) {
  const [internalOpen, setInternalOpen] = useState(false);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? (onOpenChange ?? (() => {})) : setInternalOpen;

  return (
    <Modal open={open} onOpenChange={setOpen}>
      {!isControlled && (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-destructive hover:text-destructive"
          onClick={() => setOpen(true)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
      <ModalPopup>
        <ModalHeader>
          <ModalTitle>Hapus Artis</ModalTitle>
          <ModalDescription>
            Apakah kamu yakin ingin menghapus <strong>{artistName}</strong>?
          </ModalDescription>
        </ModalHeader>
        <ModalBody>
          <p className="text-sm text-muted-foreground">
            Data artis yang dihapus tidak dapat dikembalikan. Semua data terkait artis ini juga akan
            ikut terhapus.
          </p>
        </ModalBody>
        <ModalFooter>
          <ModalClose asChild>
            <Button variant="outline">Batal</Button>
          </ModalClose>
          <Button variant="destructive">Hapus</Button>
        </ModalFooter>
      </ModalPopup>
    </Modal>
  );
}
