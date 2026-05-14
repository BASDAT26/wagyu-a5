import { useState } from "react";
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
  ModalTrigger,
} from "@wagyu-a5/ui/components/modal";
import { Plus, Loader2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { trpcClient, trpc } from "@/utils/trpc";
import { toast } from "sonner";

export default function CreateArtist() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [genre, setGenre] = useState("");
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data: { name: string; genre?: string }) => trpcClient.event.artist.create.mutate(data),
    onSuccess: () => {
      queryClient.invalidateQueries(trpc.event.artist.list.queryOptions());
      toast.success("Artis berhasil ditambahkan");
      setName("");
      setGenre("");
      setOpen(false);
    },
    onError: (error) => {
      toast.error(error.message || "Gagal menambahkan artis");
    },
  });

  const handleSubmit = () => {
    if (!name.trim()) {
      toast.error("Nama artis harus diisi");
      return;
    }
    createMutation.mutate({ name, genre: genre || undefined });
  };

  return (
    <Modal open={open} onOpenChange={setOpen}>
      <ModalTrigger asChild>
        <Button>
          <Plus className="h-4 w-4" />
          Tambah Artis
        </Button>
      </ModalTrigger>
      <ModalPopup>
        <ModalHeader>
          <ModalTitle>Tambah Artis Baru</ModalTitle>
          <ModalDescription>Isi data artis yang ingin ditambahkan ke platform.</ModalDescription>
        </ModalHeader>
        <ModalBody>
          <div className="space-y-2">
            <Label htmlFor="create-artist-name">Nama Artis <span className="text-destructive">*</span></Label>
            <Input
              id="create-artist-name"
              placeholder="Masukkan nama artis..."
              maxLength={100}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="create-artist-genre">Genre</Label>
            <Input
              id="create-artist-genre"
              placeholder="Masukkan genre..."
              maxLength={100}
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <ModalClose asChild>
            <Button variant="outline">Batal</Button>
          </ModalClose>
          <Button onClick={handleSubmit} disabled={createMutation.isPending}>
            {createMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Simpan
          </Button>
        </ModalFooter>
      </ModalPopup>
    </Modal>
  );
}
