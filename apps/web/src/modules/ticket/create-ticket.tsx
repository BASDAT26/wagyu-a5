import { useState } from "react";
import {
  Modal,
  ModalPopup,
  ModalHeader,
  ModalTitle,
  ModalBody,
  ModalFooter,
  ModalTrigger,
  ModalClose,
} from "@wagyu-a5/ui/components/modal";
import { Button } from "@wagyu-a5/ui/components/button";
import { Input } from "@wagyu-a5/ui/components/input";
import { Label } from "@wagyu-a5/ui/components/label";
import { Plus, Loader2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { trpcClient, trpc } from "@/utils/trpc";
import { toast } from "sonner";

export default function CreateTicket() {
  const [open, setOpen] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [seatId, setSeatId] = useState("");
  const queryClient = useQueryClient();

  const { data: orders = [] } = useQuery(trpc.order.order.list.queryOptions());
  const { data: categories = [] } = useQuery(trpc.ticket.category.listAll.queryOptions());

  // Get available seats from the venue of the selected category's event
  const selectedCategory = (categories as any[]).find((c: any) => c.category_id === categoryId);
  const selectedEvent = selectedCategory?.tevent_id;

  const { data: events = [] } = useQuery(trpc.event.event.list.queryOptions());
  const event = (events as any[]).find((e: any) => e.event_id === selectedEvent);
  const venueId = event?.venue_id;

  const { data: seats = [] } = useQuery({
    ...trpc.venue.seat.listByVenueWithStatus.queryOptions({ venueId: venueId ?? "" }),
    enabled: !!venueId,
  });

  const availableSeats = (seats as any[]).filter((s: any) => !s.is_assigned);

  const createMutation = useMutation({
    mutationFn: (data: { categoryId: string; orderId: string; seatId?: string }) =>
      trpcClient.ticket.ticket.create.mutate(data),
    onSuccess: () => {
      queryClient.invalidateQueries(trpc.ticket.ticket.listForCurrentUser.queryOptions());
      if (venueId) {
        queryClient.invalidateQueries(
          trpc.venue.seat.listByVenueWithStatus.queryOptions({ venueId }),
        );
      }
      toast.success("Tiket berhasil dibuat");
      resetForm();
      setOpen(false);
    },
    onError: (error) => {
      toast.error(error.message || "Gagal membuat tiket");
    },
  });

  function resetForm() {
    setOrderId("");
    setCategoryId("");
    setSeatId("");
  }

  function handleSubmit() {
    if (!orderId || !categoryId) {
      toast.error("Order dan Kategori harus diisi");
      return;
    }
    createMutation.mutate({
      categoryId,
      orderId,
      seatId: seatId || undefined,
    });
  }

  return (
    <Modal open={open} onOpenChange={setOpen}>
      <ModalTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-4 py-2 h-auto text-sm font-medium">
          <Plus className="h-4 w-4" />
          Tambah Tiket
        </Button>
      </ModalTrigger>
      <ModalPopup>
        <ModalHeader>
          <ModalTitle className="font-bold text-lg dark:text-slate-50">
            Tambah Tiket Baru
          </ModalTitle>
        </ModalHeader>
        <ModalBody className="space-y-4 py-2">
          <div className="space-y-2">
            <Label className="text-[11px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
              Order <span className="text-destructive">*</span>
            </Label>
            <select
              className="flex h-10 w-full items-center justify-between rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
            >
              <option value="">Pilih Order...</option>
              {(orders as any[]).map((o: any) => (
                <option key={o.order_id} value={o.order_id}>
                  {o.order_id.substring(0, 8)}... — {o.payment_status}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label className="text-[11px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
              Kategori Tiket <span className="text-destructive">*</span>
            </Label>
            <select
              className="flex h-10 w-full items-center justify-between rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={categoryId}
              onChange={(e) => {
                setCategoryId(e.target.value);
                setSeatId("");
              }}
            >
              <option value="">Pilih Kategori...</option>
              {(categories as any[]).map((c: any) => (
                <option key={c.category_id} value={c.category_id}>
                  {c.category_name} — {c.event_name} — Rp {Number(c.price).toLocaleString("id-ID")}{" "}
                  ({c.quota} sisa)
                </option>
              ))}
            </select>
          </div>

          {venueId && availableSeats.length > 0 && (
            <div className="space-y-2">
              <Label className="text-[11px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                Kursi{" "}
                <span className="text-slate-400 dark:text-slate-500 font-normal lowercase">
                  (opsional — reserved seating)
                </span>
              </Label>
              <select
                className="flex h-10 w-full items-center justify-between rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={seatId}
                onChange={(e) => setSeatId(e.target.value)}
              >
                <option value="">Tanpa Kursi</option>
                {availableSeats.map((s: any) => (
                  <option key={s.seat_id} value={s.seat_id}>
                    {s.section} — Baris {s.row_number}, No. {s.seat_number}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="space-y-2">
            <Label className="text-[11px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
              Kode Tiket
            </Label>
            <Input
              value="Auto-generate saat dibuat"
              disabled
              className="rounded-xl h-10 bg-slate-50 dark:bg-slate-900/50 text-slate-500 cursor-not-allowed"
            />
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
            disabled={createMutation.isPending}
          >
            {createMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Buat Tiket
          </Button>
        </ModalFooter>
      </ModalPopup>
    </Modal>
  );
}
