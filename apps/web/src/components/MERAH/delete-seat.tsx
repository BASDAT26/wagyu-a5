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

export default function DeleteSeat({ isAssigned = false }: { isAssigned?: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <Modal open={open} onOpenChange={setOpen}>
      <ModalTrigger asChild>
        <button
          className="p-1 text-gray-400 hover:text-red-500 disabled:opacity-30 disabled:cursor-not-allowed group relative transition-colors"
          disabled={isAssigned}
        >
          {isAssigned && (
            <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block w-64 p-2 bg-red-50 text-red-600 text-xs rounded-md shadow-lg z-50 text-left border border-red-100">
              Kursi ini sudah di-assign ke tiket dan tidak dapat dihapus. Hapus atau ubah tiket terlebih dahulu.
            </div>
          )}
          <Trash2 className="w-4 h-4" />
        </button>
      </ModalTrigger>
      <ModalContent className="max-w-md rounded-2xl dark:bg-slate-900 dark:border-slate-800">
        <ModalHeader>
          <ModalTitle className="text-red-500 font-bold text-lg">Hapus Kursi</ModalTitle>
        </ModalHeader>
        <ModalBody className="py-2">
          <p className="text-sm text-gray-600 dark:text-slate-400">
            Apakah Anda yakin ingin menghapus kursi ini? Tindakan ini tidak dapat dibatalkan.
          </p>
        </ModalBody>
        <ModalFooter className="flex w-full justify-end gap-3 mt-4 sm:space-x-0">
          <ModalClose asChild>
            <Button variant="outline" className="rounded-xl px-6 h-10 border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300 font-medium hover:bg-gray-50 dark:hover:bg-slate-800">
              Batal
            </Button>
          </ModalClose>
          <Button variant="destructive" className="bg-red-500 hover:bg-red-600 text-white rounded-xl px-6 h-10 font-medium" onClick={() => setOpen(false)}>
            Hapus
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
