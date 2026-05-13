import { useState } from "react";
import { Button } from "@wagyu-a5/ui/components/button";
import {
  Modal,
  ModalBody,
  ModalClose,
  ModalFooter,
  ModalHeader,
  ModalPopup,
  ModalTitle,
  ModalDescription,
} from "@wagyu-a5/ui/components/modal";
import { Trash2, Loader2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { trpcClient, trpc } from "@/utils/trpc";
import { toast } from "sonner";
import type { TicketCategory } from "./types";

interface DeleteTicketCategoryProps {
  category: TicketCategory;
}

export default function DeleteTicketCategory({ category }: DeleteTicketCategoryProps) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: () =>
      trpcClient.ticket.category.delete.mutate({ categoryId: category.category_id }),
    onSuccess: () => {
      queryClient.invalidateQueries(trpc.ticket.category.listAll.queryOptions());
      toast.success(`Kategori "${category.category_name}" berhasil dihapus`);
      setOpen(false);
    },
    onError: (error) => {
      toast.error(error.message || "Gagal menghapus kategori tiket");
    },
  });

  return (
    <Modal open={open} onOpenChange={setOpen}>
      <Button
        variant="outline"
        size="sm"
        className="gap-1.5 text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive"
        onClick={() => setOpen(true)}
      >
        <Trash2 className="h-3.5 w-3.5" />
        Hapus
      </Button>
      <ModalPopup>
        <ModalHeader>
          <ModalTitle>Hapus Kategori Tiket</ModalTitle>
          <ModalDescription>Apakah kamu yakin ingin menghapus kategori tiket ini?</ModalDescription>
        </ModalHeader>
        <ModalBody>
          <div className="rounded-md border border-destructive/20 bg-destructive/5 p-4 space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground font-medium w-32">Event Name:</span>
              <span className="font-semibold">{category.event_name ?? "-"}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground font-medium w-32">Category Name:</span>
              <span className="font-semibold">{category.category_name}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground font-medium w-32">Category ID:</span>
              <span className="font-mono text-xs">{category.category_id}</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-3">
            Data kategori tiket yang dihapus tidak dapat dikembalikan.
          </p>
        </ModalBody>
        <ModalFooter>
          <ModalClose asChild>
            <Button variant="outline">Cancel</Button>
          </ModalClose>
          <Button
            variant="destructive"
            onClick={() => deleteMutation.mutate()}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Confirm Deletion
          </Button>
        </ModalFooter>
      </ModalPopup>
    </Modal>
  );
}
