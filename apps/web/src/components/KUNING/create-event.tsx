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

export default function CreateEvent() {
  const [isModalOpen, setIsModalOpen] = useState(false); 
  return (
    <div>
      <Modal open={isModalOpen} onOpenChange={setIsModalOpen}>
        <ModalTrigger asChild>
          <Button>Open Basic Modal</Button>
        </ModalTrigger>
        <ModalPopup>
          <ModalHeader>
            <ModalTitle>Basic Modal</ModalTitle>
            <ModalDescription>This is a simple modal dialog</ModalDescription>
          </ModalHeader>
          <ModalBody>
            <p>Modal content goes here. You can put any content inside.</p>
          </ModalBody>
          <ModalFooter>
            <ModalClose>
              <Button variant="outline">Close</Button>
            </ModalClose>
            <Button>Action</Button>
          </ModalFooter>
        </ModalPopup>
      </Modal>
    </div>
  );
}
