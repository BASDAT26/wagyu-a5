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
  ModalDescription,
} from "@wagyu-a5/ui/components/modal";
import { useState } from "react";

export default function DeleteVenue() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  return (
    <div>
      <Modal open={isModalOpen} onOpenChange={setIsModalOpen}>
        <ModalTrigger asChild>
          <Button>Delete Venue</Button>
        </ModalTrigger>
        <ModalPopup>
          <ModalHeader>
            <ModalTitle className="text-red-500">Hapus Venue</ModalTitle>
          </ModalHeader>
          <ModalBody>
            <p className="text-muted-foreground">Apakah Anda yakin ingin menghapus venue ini? Tindakan ini tidak dapat dibatalkan.</p>
          </ModalBody>
          <ModalFooter>
            <ModalClose>
              <Button variant="outline">Batal</Button>
            </ModalClose>
            <Button>Hapus</Button>
          </ModalFooter>
        </ModalPopup>
      </Modal>
    </div>
  );
}
