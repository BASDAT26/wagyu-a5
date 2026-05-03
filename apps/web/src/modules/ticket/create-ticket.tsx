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

export default function CreateTicket() {
  const [open, setOpen] = useState(false);
  const [hasReservedSeating, setHasReservedSeating] = useState(false); // Toggle for demonstration

  return (
    <Modal open={open} onOpenChange={setOpen}>
      <ModalTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-4 py-2 h-auto text-sm font-medium">
          + Tambah Tiket
        </Button>
      </ModalTrigger>
      <ModalContent className="max-w-md rounded-2xl dark:bg-slate-900 dark:border-slate-800">
        <ModalHeader>
          <ModalTitle className="font-bold text-lg dark:text-slate-50">Tambah Tiket Baru</ModalTitle>
        </ModalHeader>
        <ModalBody className="space-y-4 py-2">
          {/* Mock toggle for reserved seating demonstration */}
          <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-800">
            <Label htmlFor="mock-reserved" className="text-xs cursor-pointer dark:text-slate-300">
              [Preview Mode] Use Reserved Seating Venue?
            </Label>
            <input 
              type="checkbox" 
              id="mock-reserved" 
              className="rounded text-blue-600"
              checked={hasReservedSeating}
              onChange={(e) => setHasReservedSeating(e.target.checked)}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-[11px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Order</Label>
            <select className="flex h-10 w-full items-center justify-between rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Pilih Order...</option>
              <option value="1">ord_001 — Budi Santoso — Konser Melodi Senja</option>
              <option value="2">ord_002 — Budi Santoso — Festival Seni Budaya</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <Label className="text-[11px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Kategori Tiket</Label>
            <select className="flex h-10 w-full items-center justify-between rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Pilih Kategori...</option>
              <option value="vip">VIP — Rp 750,000 (3/150)</option>
              <option value="ga">General Admission — Rp 150,000 (1/500)</option>
              <option value="full" disabled>VVIP — Rp 1,500,000 (50/50) - Penuh</option>
            </select>
          </div>

          {hasReservedSeating && (
            <div className="space-y-2">
              <Label className="text-[11px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                Kursi <span className="text-slate-400 dark:text-slate-500 font-normal lowercase">(opsional — reserved seating)</span>
              </Label>
              <select className="flex h-10 w-full items-center justify-between rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Pilih Kursi...</option>
                <option value="1">Category 1 — Baris C, No. 1</option>
              </select>
            </div>
          )}

          <div className="space-y-2">
            <Label className="text-[11px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Kode Tiket</Label>
            <div className="flex h-10 w-full items-center rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 px-3 text-sm text-slate-400 dark:text-slate-500 font-mono">
              Auto-generate saat dibuat
            </div>
          </div>
        </ModalBody>
        <ModalFooter className="flex w-full gap-3 mt-4 sm:space-x-0">
          <ModalClose asChild>
            <Button variant="outline" className="flex-1 rounded-xl h-10 border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300 font-medium hover:bg-gray-50 dark:hover:bg-slate-800">
              Batal
            </Button>
          </ModalClose>
          <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-10 font-medium" onClick={() => setOpen(false)}>
            Buat Tiket
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
