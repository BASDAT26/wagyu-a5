import { useState, useEffect } from "react";
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
import { Pencil, Loader2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { trpcClient, trpc } from "@/utils/trpc";
import { toast } from "sonner";
import type { TicketCategory } from "./types";

interface UpdateTicketCategoryProps {
  category: TicketCategory;
}

export default function UpdateTicketCategory({ category }: UpdateTicketCategoryProps) {
  const [open, setOpen] = useState(false);
  const [categoryName, setCategoryName] = useState(category.category_name);
  const [price, setPrice] = useState(String(category.price));
  const [quota, setQuota] = useState(String(category.quota));
  const queryClient = useQueryClient();

  useEffect(() => {
    setCategoryName(category.category_name);
    setPrice(String(category.price));
    setQuota(String(category.quota));
  }, [category]);

  const updateMutation = useMutation({
    mutationFn: (data: {
      categoryId: string;
      categoryName?: string;
      quota?: number;
      price?: number;
    }) => trpcClient.ticket.category.update.mutate(data),
    onSuccess: () => {
      queryClient.invalidateQueries(trpc.ticket.category.listAll.queryOptions());
      toast.success("Kategori tiket berhasil diperbarui");
      setOpen(false);
    },
    onError: (error) => {
      toast.error(error.message || "Gagal memperbarui kategori tiket");
    },
  });

  function handleSubmit() {
    if (!categoryName || !price || !quota) {
      toast.error("Semua field harus diisi");
      return;
    }
    updateMutation.mutate({
      categoryId: category.category_id,
      categoryName,
      quota: Number(quota),
      price: Number(price),
    });
  }

  return (
    <Modal open={open} onOpenChange={setOpen}>
      <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setOpen(true)}>
        <Pencil className="h-3.5 w-3.5" />
        Edit
      </Button>
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
                value={category.event_name ?? "-"}
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
                maxLength={100}
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
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
                  min={0}
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
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
                  min={1}
                  value={quota}
                  onChange={(e) => setQuota(e.target.value)}
                />
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <ModalClose asChild>
            <Button variant="outline">Batal</Button>
          </ModalClose>
          <Button onClick={handleSubmit} disabled={updateMutation.isPending}>
            {updateMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Simpan
          </Button>
        </ModalFooter>
      </ModalPopup>
    </Modal>
  );
}
