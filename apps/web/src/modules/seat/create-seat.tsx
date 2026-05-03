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
import { Input } from "@wagyu-a5/ui/components/input";
import { Label } from "@wagyu-a5/ui/components/label";

export default function CreateSeat() {
  const [open, setOpen] = useState(false);

  return (
    <Modal open={open} onOpenChange={setOpen}>
      <ModalTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-4 py-2 h-auto text-sm font-medium">
          + Tambah Kursi
        </Button>
      </ModalTrigger>
      <ModalContent className="max-w-md rounded-2xl">
        <ModalHeader>
          <ModalTitle className="font-bold text-lg">Tambah Kursi Baru</ModalTitle>
        </ModalHeader>
        <ModalBody className="space-y-4 py-2">
          <div className="space-y-2">
            <Label className="text-[11px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
              Venue
            </Label>
            <select className="flex h-10 w-full items-center justify-between rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="jcc">Jakarta Convention Center</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              Section
            </Label>
            <Input placeholder="cth. WVIP" className="rounded-xl h-10" />
          </div>
          <div className="flex gap-4">
            <div className="space-y-2 flex-1">
              <Label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                Baris
              </Label>
              <Input placeholder="cth. A" className="rounded-xl h-10" />
            </div>
            <div className="space-y-2 flex-1">
              <Label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                No. Kursi
              </Label>
              <Input placeholder="cth. 1" className="rounded-xl h-10" />
            </div>
          </div>
        </ModalBody>
        <ModalFooter className="flex w-full gap-3 mt-4 sm:space-x-0">
          <ModalClose asChild>
            <Button
              variant="outline"
              className="flex-1 rounded-xl h-10 border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300 font-medium hover:bg-gray-50 dark:hover:bg-slate-800"
            >
              Batal
            </Button>
          </ModalClose>
          <Button
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white rounded-xl h-10 font-medium"
            onClick={() => setOpen(false)}
          >
            Tambah
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
