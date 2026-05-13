import { useState, useEffect } from "react";
import {
  Modal,
  ModalPopup,
  ModalHeader,
  ModalTitle,
  ModalBody,
  ModalFooter,
  ModalClose,
} from "@wagyu-a5/ui/components/modal";
import { Button } from "@wagyu-a5/ui/components/button";
import { Input } from "@wagyu-a5/ui/components/input";
import { Label } from "@wagyu-a5/ui/components/label";
import { SquarePen, Loader2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { trpcClient, trpc } from "@/utils/trpc";
import { toast } from "sonner";
import type { Seat } from "./types";

interface UpdateSeatProps {
  seat: Seat;
  venueId: string;
}

export default function UpdateSeat({ seat, venueId }: UpdateSeatProps) {
  const [open, setOpen] = useState(false);
  const [section, setSection] = useState(seat.section);
  const [rowNumber, setRowNumber] = useState(seat.row_number);
  const [seatNumber, setSeatNumber] = useState(seat.seat_number);
  const queryClient = useQueryClient();

  useEffect(() => {
    setSection(seat.section);
    setRowNumber(seat.row_number);
    setSeatNumber(seat.seat_number);
  }, [seat]);

  const updateMutation = useMutation({
    mutationFn: (data: {
      seatId: string;
      section?: string;
      seatNumber?: string;
      rowNumber?: string;
    }) => trpcClient.venue.seat.update.mutate(data),
    onSuccess: () => {
      queryClient.invalidateQueries(
        trpc.venue.seat.listByVenueWithStatus.queryOptions({ venueId }),
      );
      toast.success("Kursi berhasil diperbarui");
      setOpen(false);
    },
    onError: (error) => {
      toast.error(error.message || "Gagal memperbarui kursi");
    },
  });

  function handleSubmit() {
    if (!section || !rowNumber || !seatNumber) {
      toast.error("Semua field harus diisi");
      return;
    }
    updateMutation.mutate({
      seatId: seat.seat_id,
      section,
      seatNumber,
      rowNumber,
    });
  }

  return (
    <Modal open={open} onOpenChange={setOpen}>
      <button
        className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
        onClick={() => setOpen(true)}
      >
        <SquarePen className="w-4 h-4" />
      </button>
      <ModalPopup>
        <ModalHeader>
          <ModalTitle className="font-bold text-lg">Edit Kursi</ModalTitle>
        </ModalHeader>
        <ModalBody className="space-y-4 py-2">
          <div className="space-y-2">
            <Label className="text-[11px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
              Section
            </Label>
            <Input
              className="rounded-xl h-10"
              value={section}
              onChange={(e) => setSection(e.target.value)}
            />
          </div>
          <div className="flex gap-4">
            <div className="space-y-2 flex-1">
              <Label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                Baris
              </Label>
              <Input
                className="rounded-xl h-10"
                value={rowNumber}
                onChange={(e) => setRowNumber(e.target.value)}
              />
            </div>
            <div className="space-y-2 flex-1">
              <Label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                No. Kursi
              </Label>
              <Input
                className="rounded-xl h-10"
                value={seatNumber}
                onChange={(e) => setSeatNumber(e.target.value)}
              />
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
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-10 font-medium"
            onClick={handleSubmit}
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Simpan
          </Button>
        </ModalFooter>
      </ModalPopup>
    </Modal>
  );
}
