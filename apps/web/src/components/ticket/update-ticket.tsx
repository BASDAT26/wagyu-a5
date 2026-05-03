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
import { Label } from "@wagyu-a5/ui/components/label";
import { Edit, Check } from "lucide-react";

export default function UpdateTicket() {
  const [open, setOpen] = useState(false);

  return (
    <Modal open={open} onOpenChange={setOpen}>
      <ModalTrigger asChild>
        <Button variant="outline" className="rounded-lg h-9 px-3 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 gap-2">
          <Edit className="w-4 h-4 text-slate-400" />
          Update
        </Button>
      </ModalTrigger>
      <ModalContent className="max-w-md rounded-2xl dark:bg-slate-900 dark:border-slate-800">
        <ModalHeader>
          <ModalTitle className="font-bold text-lg dark:text-slate-50">Update Tiket</ModalTitle>
        </ModalHeader>
        <ModalBody className="space-y-4 py-2">
          <div className="space-y-2">
            <Label className="text-[11px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Kode Tiket</Label>
            <div className="flex h-10 w-full items-center rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 px-3 text-sm font-bold text-slate-900 dark:text-slate-50">
              TTK-EVT001-VIP-001
            </div>
          </div>
          
          <div className="space-y-2">
            <Label className="text-[11px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Status</Label>
            <select className="flex h-10 w-full items-center justify-between rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="valid">Valid</option>
              <option value="terpakai">Terpakai</option>
              <option value="batal">Batal</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label className="text-[11px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
              Kursi <span className="text-slate-400 dark:text-slate-500 font-normal lowercase">(opsional)</span>
            </Label>
            <select className="flex h-10 w-full items-center justify-between rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="tanpa-kursi">Tanpa Kursi</option>
              <option value="current" selected>VIP — Baris B, No. 1 (Saat Ini)</option>
              <option value="available-1">VIP — Baris B, No. 2</option>
              <option value="available-2">VIP — Baris B, No. 3</option>
            </select>
          </div>
        </ModalBody>
        <ModalFooter className="flex w-full gap-3 mt-4 sm:space-x-0">
          <ModalClose asChild>
            <Button variant="outline" className="flex-1 rounded-xl h-10 border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300 font-medium hover:bg-gray-50 dark:hover:bg-slate-800">
              Batal
            </Button>
          </ModalClose>
          <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-10 font-medium gap-2" onClick={() => setOpen(false)}>
            <Check className="w-4 h-4" />
            Simpan
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
