import { Button } from "@wagyu-a5/ui/components/button";
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
import { Trash2 } from "lucide-react";
import { useState } from "react";

export default function DeleteVenue() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div>
      <Modal open={isModalOpen} onOpenChange={setIsModalOpen}>
        <ModalTrigger asChild>
          <Button variant="ghost" size="sm" className="gap-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20">
            <Trash2 className="h-3.5 w-3.5" />
            Hapus
          </Button>
        </ModalTrigger>
        <ModalPopup>
          <ModalHeader>
            <ModalTitle className="text-red-500">Hapus Venue</ModalTitle>
          </ModalHeader>
          <ModalBody>
            <p className="text-muted-foreground">
              Apakah Anda yakin ingin menghapus venue ini? Tindakan ini tidak
              dapat dibatalkan.
            </p>
          </ModalBody>
          <ModalFooter>
            <ModalClose asChild>
              <Button variant="outline">Batal</Button>
            </ModalClose>
            <Button>Hapus</Button>
          </ModalFooter>
        </ModalPopup>
      </Modal>
    </div>
  );
}
