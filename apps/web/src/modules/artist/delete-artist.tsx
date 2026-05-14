import { useState } from "react";
import { Button } from "@wagyu-a5/ui/components/button";
import {
  Modal,
  ModalBody,
  ModalClose,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalPopup,
  ModalTitle,
} from "@wagyu-a5/ui/components/modal";
import { Trash2, Loader2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { trpcClient, trpc } from "@/utils/trpc";
import { toast } from "sonner";

interface DeleteArtistProps {
  artistName?: string;
  artistId?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function DeleteArtist({
  artistName = "artis ini",
  artistId,
  open: controlledOpen,
  onOpenChange,
}: DeleteArtistProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const queryClient = useQueryClient();

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? (onOpenChange ?? (() => {})) : setInternalOpen;

  const deleteMutation = useMutation({
    mutationFn: (data: { artistId: string }) => trpcClient.event.artist.delete.mutate(data),
    onSuccess: () => {
      queryClient.invalidateQueries(trpc.event.artist.list.queryOptions());
      toast.success("Artis berhasil dihapus");
      setOpen(false);
    },
    onError: (error) => {
      toast.error(error.message || "Gagal menghapus artis");
    },
  });

  const handleDelete = () => {
    if (!artistId) return;
    deleteMutation.mutate({ artistId });
  };

  return (
    <Modal open={open} onOpenChange={setOpen}>
      {!isControlled && (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-destructive hover:text-destructive"
          onClick={() => setOpen(true)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
      <ModalPopup>
        <ModalHeader>
          <ModalTitle>Hapus Artis</ModalTitle>
          <ModalDescription>
            Apakah kamu yakin ingin menghapus <strong>{artistName}</strong>?
          </ModalDescription>
        </ModalHeader>
        <ModalBody>
          <p className="text-sm text-muted-foreground">
            Data artis yang dihapus tidak dapat dikembalikan. Semua data terkait artis ini juga akan
            ikut terhapus.
          </p>
        </ModalBody>
        <ModalFooter>
          <ModalClose asChild>
            <Button variant="outline">Batal</Button>
          </ModalClose>
          <Button variant="destructive" onClick={handleDelete} disabled={deleteMutation.isPending}>
            {deleteMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Hapus
          </Button>
        </ModalFooter>
      </ModalPopup>
    </Modal>
  );
}
