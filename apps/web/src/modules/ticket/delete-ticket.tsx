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
import type { TicketEnriched } from "./types";

interface DeleteTicketProps {
  ticket: TicketEnriched;
}

export default function DeleteTicket({ ticket }: DeleteTicketProps) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: () => trpcClient.ticket.ticket.delete.mutate({ ticketId: ticket.ticket_id }),
    onSuccess: () => {
      queryClient.invalidateQueries(trpc.ticket.ticket.listForCurrentUser.queryOptions());
      toast.success(`Tiket "${ticket.ticket_code}" berhasil dihapus`);
      setOpen(false);
    },
    onError: (error) => {
      toast.error(error.message || "Gagal menghapus tiket");
    },
  });

  return (
    <Modal open={open} onOpenChange={setOpen}>
      <Button
        variant="outline"
        className="rounded-lg h-9 px-3 border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 font-medium hover:bg-red-50 dark:hover:bg-red-900/20 gap-2"
        onClick={() => setOpen(true)}
      >
        <Trash2 className="w-4 h-4" />
        Hapus
      </Button>
      <ModalPopup>
        <ModalHeader>
          <ModalTitle className="text-red-500 font-bold text-lg">Hapus Tiket</ModalTitle>
        </ModalHeader>
        <ModalBody className="py-2">
          <p className="text-sm text-gray-600 dark:text-slate-400">
            Apakah Anda yakin ingin menghapus tiket <strong>{ticket.ticket_code}</strong> untuk
            event <strong>{ticket.event_title}</strong>? Relasi kursi akan dilepaskan. Tindakan ini
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
