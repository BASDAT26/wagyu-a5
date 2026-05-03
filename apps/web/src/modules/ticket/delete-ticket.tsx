import { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalBody,
  ModalFooter,
  ModalTrigger,
  ModalClose,
} from "@wagyu-a5/ui/components/modal";
import { Button } from "@wagyu-a5/ui/components/button";
import { Trash2 } from "lucide-react";

export default function DeleteTicket() {
  const [open, setOpen] = useState(false);

  return (
    <Modal open={open} onOpenChange={setOpen}>
      <ModalTrigger asChild>
        <Button
          variant="outline"
          className="rounded-lg h-9 px-3 border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 font-medium hover:bg-red-50 dark:hover:bg-red-900/20 gap-2"
        >
          <Trash2 className="w-4 h-4" />
          Hapus
        </Button>
      </ModalTrigger>
      <ModalContent className="max-w-md rounded-2xl dark:bg-slate-900 dark:border-slate-800">
        <ModalHeader>
          <ModalTitle className="text-red-500 font-bold text-lg">Hapus Tiket</ModalTitle>
        </ModalHeader>
        <ModalBody className="py-2">
          <p className="text-sm text-gray-600 dark:text-slate-400">
            Apakah Anda yakin ingin menghapus tiket ini? Relasi kursi akan dilepaskan. Tindakan ini
            tidak dapat dibatalkan.
          </p>
        </ModalBody>
        <ModalFooter className="flex w-full justify-end gap-3 mt-4 sm:space-x-0">
          <ModalClose asChild>
            <Button
              variant="outline"
              className="rounded-xl px-6 h-10 border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300 font-medium hover:bg-gray-50 dark:hover:bg-slate-800"
            >
              Batal
            </Button>
          </ModalClose>
          <Button
            variant="destructive"
            className="bg-red-500 hover:bg-red-600 text-white rounded-xl px-6 h-10 font-medium"
            onClick={() => setOpen(false)}
          >
            Hapus
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
