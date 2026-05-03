import { useState } from "react";
import { Button } from "@wagyu-a5/ui/components/button";
import { Input } from "@wagyu-a5/ui/components/input";
import { Label } from "@wagyu-a5/ui/components/label";
import {
  Modal,
  ModalBody,
  ModalClose,
  ModalFooter,
  ModalHeader,
  ModalPopup,
  ModalTitle,
} from "@wagyu-a5/ui/components/modal";
import { Pencil } from "lucide-react";

interface UpdateTicketCategoryProps {
  categoryId?: string;
  currentName?: string;
  currentPrice?: number;
  currentQuota?: number;
  eventName?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function UpdateTicketCategory({
  currentName = "",
  currentPrice = 0,
  currentQuota = 0,
  eventName = "",
  open: controlledOpen,
  onOpenChange,
}: UpdateTicketCategoryProps) {
  const [internalOpen, setInternalOpen] = useState(false);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? (onOpenChange ?? (() => {})) : setInternalOpen;

  return (
    <Modal open={open} onOpenChange={setOpen}>
      {!isControlled && (
        <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setOpen(true)}>
          <Pencil className="h-3.5 w-3.5" />
          Edit
        </Button>
      )}
      <ModalPopup>
        <ModalHeader>
          <ModalTitle>Edit Kategori</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="update-tc-event">
                ACARA <span className="text-destructive">*</span>
              </Label>
              <Input
                id="update-tc-event"
                value={eventName}
                disabled
                className="bg-muted cursor-not-allowed opacity-70"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="update-tc-name">
                NAMA KATEGORI <span className="text-destructive">*</span>
              </Label>
              <Input
                id="update-tc-name"
                placeholder="cth. WVIP"
                defaultValue={currentName}
                maxLength={100}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="update-tc-price">
                  HARGA (RP) <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="update-tc-price"
                  type="number"
                  placeholder="750000"
                  defaultValue={currentPrice}
                  min={0}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="update-tc-quota">
                  KUOTA <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="update-tc-quota"
                  type="number"
                  placeholder="100"
                  defaultValue={currentQuota}
                  min={1}
                />
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <ModalClose asChild>
            <Button variant="outline">Batal</Button>
          </ModalClose>
          <Button>Simpan</Button>
        </ModalFooter>
      </ModalPopup>
    </Modal>
  );
}
