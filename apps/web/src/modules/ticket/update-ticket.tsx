import { useState, useEffect } from "react";
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
import { Label } from "@wagyu-a5/ui/components/label";
import { Edit, Check, Loader2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { trpcClient, trpc } from "@/utils/trpc";
import { toast } from "sonner";
import type { TicketEnriched } from "./types";

interface UpdateTicketProps {
  ticket: TicketEnriched;
}

export default function UpdateTicket({ ticket }: UpdateTicketProps) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState(ticket.status);
  const queryClient = useQueryClient();

  const { data: events = [] } = useQuery(trpc.event.event.list.queryOptions());
  const event = (events as any[]).find((e: any) => e.event_id === ticket.event_id);
  const venueId = event?.venue_id;

  const { data: seats = [] } = useQuery({
    ...trpc.venue.seat.listByVenueWithStatus.queryOptions({ venueId: venueId ?? "" }),
    enabled: !!venueId,
  });

  const { data: currentSeatRelations } = useQuery({
    ...trpc.ticket.hasRelationship.listByTicket.queryOptions({ ticketId: ticket.ticket_id }),
  });
  
  const currentSeatId = currentSeatRelations?.[0]?.seat_id;
  const [seatId, setSeatId] = useState<string>("");

  useEffect(() => {
    if (currentSeatId !== undefined && seatId === "") {
      setSeatId(currentSeatId || "none");
    }
  }, [currentSeatId, seatId]);

  const availableAndCurrentSeats = (seats as any[]).filter(
    (s: any) => !s.is_assigned || s.seat_id === currentSeatId
  );

  const updateMutation = useMutation({
    mutationFn: (data: { ticketId: string; status: "VALID" | "TERPAKAI" | "BATAL"; seatId?: string | null }) =>
      trpcClient.ticket.ticket.updateStatus.mutate(data),
    onSuccess: () => {
      queryClient.invalidateQueries(trpc.ticket.ticket.listForCurrentUser.queryOptions());
      if (venueId) {
        queryClient.invalidateQueries(trpc.venue.seat.listByVenueWithStatus.queryOptions({ venueId }));
      }
      toast.success("Status tiket berhasil diperbarui");
      setOpen(false);
    },
    onError: (error) => {
      toast.error(error.message || "Gagal memperbarui tiket");
    },
  });

  function handleSubmit() {
    updateMutation.mutate({
      ticketId: ticket.ticket_id,
      status: status as "VALID" | "TERPAKAI" | "BATAL",
      seatId: seatId === "none" || seatId === "" ? null : seatId,
    });
  }

  return (
    <Modal open={open} onOpenChange={setOpen}>
      <Button
        variant="outline"
        className="rounded-lg h-9 px-3 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 gap-2"
        onClick={() => setOpen(true)}
      >
        <Edit className="w-4 h-4 text-slate-400" />
        Update
      </Button>
      <ModalPopup>
        <ModalHeader>
          <ModalTitle className="font-bold text-lg dark:text-slate-50">Update Tiket</ModalTitle>
        </ModalHeader>
        <ModalBody className="space-y-4 py-2">
          <div className="space-y-2">
            <Label className="text-[11px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
              Kode Tiket
            </Label>
            <div className="flex h-10 w-full items-center rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 px-3 text-sm font-bold text-slate-900 dark:text-slate-50">
              {ticket.ticket_code}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[11px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
              Event
            </Label>
            <div className="flex h-10 w-full items-center rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 px-3 text-sm text-slate-600 dark:text-slate-300">
              {ticket.event_title}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[11px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
              Status
            </Label>
            <select
              className="flex h-10 w-full items-center justify-between rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="VALID">Valid</option>
              <option value="TERPAKAI">Terpakai</option>
              <option value="BATAL">Batal</option>
            </select>
          </div>

          {venueId && availableAndCurrentSeats.length > 0 && (
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
                <option value="none">Tanpa Kursi</option>
                {availableAndCurrentSeats.map((s: any) => (
                  <option key={s.seat_id} value={s.seat_id}>
                    {s.section} — Baris {s.row_number}, No. {s.seat_number}
                  </option>
                ))}
              </select>
            </div>
          )}
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
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-10 font-medium gap-2"
            onClick={handleSubmit}
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Check className="w-4 h-4" />
            )}
            Simpan
          </Button>
        </ModalFooter>
      </ModalPopup>
    </Modal>
  );
}
