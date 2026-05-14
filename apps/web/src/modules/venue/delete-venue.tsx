import { Button } from "@wagyu-a5/ui/components/button";
import {
  Modal,
  ModalTrigger,
  ModalPopup,
  ModalBody,
  ModalFooter,
  ModalClose,
  ModalHeader,
  ModalTitle,
} from "@wagyu-a5/ui/components/modal";
import { Trash2, Loader2 } from "lucide-react";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { trpcClient, trpc } from "@/utils/trpc";
import { toast } from "sonner";
import type { Venue } from "./types";

interface DeleteVenueProps {
  venue: Venue;
}

export default function DeleteVenue({ venue }: DeleteVenueProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: () => trpcClient.venue.venue.delete.mutate({ venueId: venue.venue_id }),
    onSuccess: () => {
      queryClient.invalidateQueries(trpc.venue.venue.list.queryOptions());
      toast.success(`Venue "${venue.venue_name}" berhasil dihapus`);
      setIsModalOpen(false);
    },
    onError: (error) => {
      toast.error(error.message || "Gagal menghapus venue");
    },
  });

  return (
    <div>
      <Modal open={isModalOpen} onOpenChange={setIsModalOpen}>
        <ModalTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Hapus
          </Button>
        </ModalTrigger>
        <ModalPopup>
          <ModalHeader>
            <ModalTitle className="text-red-500">Hapus Venue</ModalTitle>
          </ModalHeader>
          <ModalBody>
            <p className="text-muted-foreground">
              Apakah Anda yakin ingin menghapus venue <strong>{venue.venue_name}</strong>? Tindakan
              ini tidak dapat dibatalkan.
            </p>
          </ModalBody>
          <ModalFooter>
            <ModalClose asChild>
              <Button variant="outline">Batal</Button>
            </ModalClose>
            <Button
              variant="destructive"
              onClick={() => deleteMutation.mutate()}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Hapus
            </Button>
          </ModalFooter>
        </ModalPopup>
      </Modal>
    </div>
  );
}
