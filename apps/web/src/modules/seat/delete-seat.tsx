import { useState } from "react";
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
import { Trash2, Loader2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { trpcClient, trpc } from "@/utils/trpc";
import { toast } from "sonner";
import type { Seat } from "./types";

interface DeleteSeatProps {
  seat: Seat;
  venueId: string;
}

export default function DeleteSeat({ seat, venueId }: DeleteSeatProps) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: () => trpcClient.venue.seat.delete.mutate({ seatId: seat.seat_id }),
    onSuccess: () => {
      queryClient.invalidateQueries(
        trpc.venue.seat.listByVenueWithStatus.queryOptions({ venueId }),
      );
      toast.success(
        `Kursi ${seat.section} - Baris ${seat.row_number} No. ${seat.seat_number} berhasil dihapus`,
      );
      setOpen(false);
    },
    onError: (error) => {
      toast.error(error.message || "Gagal menghapus kursi");
    },
  });

  return (
    <Modal open={open} onOpenChange={setOpen}>
      <button
        className="p-1 text-gray-400 hover:text-red-500 disabled:opacity-30 disabled:cursor-not-allowed group relative transition-colors"
        disabled={seat.is_assigned}
        onClick={() => !seat.is_assigned && setOpen(true)}
      >
        {seat.is_assigned && (
          <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block w-64 p-2 bg-red-50 text-red-600 text-xs rounded-md shadow-lg z-50 text-left border border-red-100">
            Kursi ini sudah di-assign ke tiket dan tidak dapat dihapus. Hapus atau ubah tiket
            terlebih dahulu.
          </div>
        )}
        <Trash2 className="w-4 h-4" />
      </button>
      <ModalPopup>
        <ModalHeader>
          <ModalTitle className="text-red-500 font-bold text-lg">Hapus Kursi</ModalTitle>
        </ModalHeader>
        <ModalBody className="py-2">
          <p className="text-sm text-gray-600 dark:text-slate-400">
            Apakah Anda yakin ingin menghapus kursi{" "}
            <strong>
              {seat.section} - Baris {seat.row_number} No. {seat.seat_number}
            </strong>
            ? Tindakan ini tidak dapat dibatalkan.
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
            onClick={() => deleteMutation.mutate()}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Hapus
          </Button>
        </ModalFooter>
      </ModalPopup>
    </Modal>
  );
}
