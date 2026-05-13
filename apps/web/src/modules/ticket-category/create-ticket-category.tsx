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
  ModalTrigger,
} from "@wagyu-a5/ui/components/modal";
import { Plus, Loader2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { trpcClient, trpc } from "@/utils/trpc";
import { toast } from "sonner";

export default function CreateTicketCategory() {
  const [open, setOpen] = useState(false);
  const [eventId, setEventId] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [price, setPrice] = useState("");
  const [quota, setQuota] = useState("");
  const queryClient = useQueryClient();

  const { data: events = [] } = useQuery(trpc.event.event.list.queryOptions());

  const createMutation = useMutation({
    mutationFn: (data: {
      categoryName: string;
      quota: number;
      price: number;
      eventId: string;
    }) => trpcClient.ticket.category.create.mutate(data),
    onSuccess: () => {
      queryClient.invalidateQueries(trpc.ticket.category.listAll.queryOptions());
      toast.success("Kategori tiket berhasil ditambahkan");
      resetForm();
      setOpen(false);
    },
    onError: (error) => {
      toast.error(error.message || "Gagal menambahkan kategori tiket");
    },
  });

  function resetForm() {
    setEventId("");
    setCategoryName("");
    setPrice("");
    setQuota("");
  }

  function handleSubmit() {
    if (!eventId || !categoryName || !price || !quota) {
      toast.error("Semua field harus diisi");
      return;
    }
    createMutation.mutate({
      categoryName,
      quota: Number(quota),
      price: Number(price),
      eventId,
    });
  }

  return (
    <Modal open={open} onOpenChange={setOpen}>
      <ModalTrigger asChild>
        <Button>
          <Plus className="h-4 w-4" />
          Tambah Kategori
        </Button>
      </ModalTrigger>
      <ModalPopup>
        <ModalHeader>
          <ModalTitle>Tambah Kategori Baru</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="create-tc-event">
                ACARA <span className="text-destructive">*</span>
              </Label>
              <select
                id="create-tc-event"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={eventId}
                onChange={(e) => setEventId(e.target.value)}
              >
                <option value="" disabled>
                  Pilih acara...
                </option>
                {(events as { event_id: string; event_title: string }[]).map((event) => (
                  <option key={event.event_id} value={event.event_id}>
                    {event.event_title}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-tc-name">
                NAMA KATEGORI <span className="text-destructive">*</span>
              </Label>
              <Input
                id="create-tc-name"
                placeholder="cth. WVIP"
                maxLength={100}
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="create-tc-price">
                  HARGA (RP) <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="create-tc-price"
                  type="number"
                  placeholder="750000"
                  min={0}
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="create-tc-quota">
                  KUOTA <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="create-tc-quota"
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
          <Button onClick={handleSubmit} disabled={createMutation.isPending}>
            {createMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Tambah
          </Button>
        </ModalFooter>
      </ModalPopup>
    </Modal>
  );
}
