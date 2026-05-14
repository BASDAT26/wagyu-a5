import { useState, useEffect } from "react";
import { Button } from "@wagyu-a5/ui/components/button";
import { Input } from "@wagyu-a5/ui/components/input";
import { Label } from "@wagyu-a5/ui/components/label";
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
import { Pencil, Loader2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { trpcClient, trpc } from "@/utils/trpc";
import { toast } from "sonner";

interface UpdateArtistProps {
  artistId?: string;
  currentName?: string;
  currentGenre?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function UpdateArtist({
  artistId,
  currentName = "",
  currentGenre = "",
  open: controlledOpen,
  onOpenChange,
}: UpdateArtistProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [name, setName] = useState(currentName);
  const [genre, setGenre] = useState(currentGenre);
  const queryClient = useQueryClient();

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? (onOpenChange ?? (() => {})) : setInternalOpen;

  useEffect(() => {
    if (open) {
      setName(currentName);
      setGenre(currentGenre);
    }
  }, [open, currentName, currentGenre]);

  const updateMutation = useMutation({
    mutationFn: (data: { artistId: string; name?: string; genre?: string }) =>
      trpcClient.event.artist.update.mutate(data),
    onSuccess: () => {
      queryClient.invalidateQueries(trpc.event.artist.list.queryOptions());
      toast.success("Artis berhasil diperbarui");
      setOpen(false);
    },
    onError: (error) => {
      toast.error(error.message || "Gagal memperbarui artis");
    },
  });

  const handleSubmit = () => {
    if (!artistId) return;
    if (!name.trim()) {
      toast.error("Nama artis harus diisi");
      return;
    }
    updateMutation.mutate({ artistId, name, genre: genre || undefined });
  };

  return (
    <Modal open={open} onOpenChange={setOpen}>
      {!isControlled && (
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setOpen(true)}>
          <Pencil className="h-4 w-4" />
        </Button>
      )}
      <ModalPopup>
        <ModalHeader>
          <ModalTitle>Edit Artis</ModalTitle>
          <ModalDescription>Ubah data artis yang sudah terdaftar.</ModalDescription>
        </ModalHeader>
        <ModalBody>
          <div className="space-y-2">
            <Label htmlFor={`update-artist-name-${artistId}`}>Nama Artis <span className="text-destructive">*</span></Label>
            <Input
              id={`update-artist-name-${artistId}`}
              placeholder="Masukkan nama artis..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={100}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`update-artist-genre-${artistId}`}>Genre</Label>
            <Input
              id={`update-artist-genre-${artistId}`}
              placeholder="Masukkan genre..."
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              maxLength={100}
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <ModalClose asChild>
            <Button variant="outline">Batal</Button>
          </ModalClose>
          <Button onClick={handleSubmit} disabled={updateMutation.isPending}>
            {updateMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Simpan Perubahan
          </Button>
        </ModalFooter>
      </ModalPopup>
    </Modal>
  );
}
