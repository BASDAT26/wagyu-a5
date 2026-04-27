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
import { SquarePen } from "lucide-react";

export default function UpdateSeat() {
  const [open, setOpen] = useState(false);

  return (
    <Modal open={open} onOpenChange={setOpen}>
      <ModalTrigger asChild>
        <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
           <SquarePen className="w-4 h-4" />
        </button>
      </ModalTrigger>
      <ModalContent className="max-w-md rounded-2xl">
        <ModalHeader>
          <ModalTitle className="font-bold text-lg">Edit Kursi</ModalTitle>
        </ModalHeader>
        <ModalBody className="space-y-4 py-2">
          <div className="space-y-2">
            <Label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Venue</Label>
            <select className="flex h-10 w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              <option value="jcc">Jakarta Convention Center</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Section</Label>
            <Input defaultValue="WVIP" className="rounded-xl h-10" />
          </div>
          <div className="flex gap-4">
            <div className="space-y-2 flex-1">
              <Label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Baris</Label>
              <Input defaultValue="A" className="rounded-xl h-10" />
            </div>
            <div className="space-y-2 flex-1">
              <Label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">No. Kursi</Label>
              <Input defaultValue="2" className="rounded-xl h-10" />
            </div>
          </div>
        </ModalBody>
        <ModalFooter className="flex w-full gap-3 mt-4 sm:space-x-0">
          <ModalClose asChild>
            <Button variant="outline" className="flex-1 rounded-xl h-10 border-gray-200 text-gray-700 font-medium hover:bg-gray-50">
              Batal
            </Button>
          </ModalClose>
          <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-10 font-medium" onClick={() => setOpen(false)}>
            Simpan
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
