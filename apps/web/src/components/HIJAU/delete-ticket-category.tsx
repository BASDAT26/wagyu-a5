import { useState } from "react";
import { Button } from "@wagyu-a5/ui/components/button";
import {
  Modal,
  ModalBody,
  ModalClose,
  ModalFooter,
  ModalHeader,
  ModalPopup,
  ModalTitle,
  ModalDescription,
} from "@wagyu-a5/ui/components/modal";
import { Trash2 } from "lucide-react";

interface DeleteTicketCategoryProps {
  categoryId?: string;
  categoryName?: string;
  eventName?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function DeleteTicketCategory({
  categoryId = "",
  categoryName = "kategori ini",
  eventName = "",
  open: controlledOpen,
  onOpenChange,
}: DeleteTicketCategoryProps) {
  const [internalOpen, setInternalOpen] = useState(false);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? (onOpenChange ?? (() => {})) : setInternalOpen;

  return (
    <Modal open={open} onOpenChange={setOpen}>
      {!isControlled && (
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive"
          onClick={() => setOpen(true)}
        >
          <Trash2 className="h-3.5 w-3.5" />
          Hapus
        </Button>
      )}
      <ModalPopup>
        <ModalHeader>
          <ModalTitle>Hapus Kategori Tiket</ModalTitle>
          <ModalDescription>
            Apakah kamu yakin ingin menghapus kategori tiket ini?
          </ModalDescription>
        </ModalHeader>
        <ModalBody>
          <div className="rounded-md border border-destructive/20 bg-destructive/5 p-4 space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground font-medium w-32">Event Name:</span>
              <span className="font-semibold">{eventName}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground font-medium w-32">Category Name:</span>
              <span className="font-semibold">{categoryName}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground font-medium w-32">Category ID:</span>
              <span className="font-mono text-xs">{categoryId}</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-3">
            Data kategori tiket yang dihapus tidak dapat dikembalikan.
          </p>
        </ModalBody>
        <ModalFooter>
          <ModalClose asChild>
            <Button variant="outline">Cancel</Button>
          </ModalClose>
          <Button variant="destructive">Confirm Deletion</Button>
        </ModalFooter>
      </ModalPopup>
    </Modal>
  );
}
