import { useState, useEffect, useMemo } from "react";
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
import { Plus, Loader2, ChevronDown } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { trpcClient, trpc } from "@/utils/trpc";
import { toast } from "sonner";
import type { Venue } from "../venue/types";

interface CreateSeatProps {
  venueId: string;
}

export default function CreateSeat({ venueId }: CreateSeatProps) {
  const [open, setOpen] = useState(false);
  const [selectedVenueId, setSelectedVenueId] = useState("");
  const [section, setSection] = useState("");
  const [rowNumber, setRowNumber] = useState("");
  const [seatNumber, setSeatNumber] = useState("");
  const queryClient = useQueryClient();

  const { data: venueList = [] } = useQuery(trpc.venue.venue.list.queryOptions());

  const reservedVenues = useMemo(
    () => (venueList as Venue[]).filter((v) => v.reserved_seating),
    [venueList],
  );

  useEffect(() => {
    if (selectedVenueId) return;
    const initial = reservedVenues.find((v) => v.venue_id === venueId) ?? reservedVenues[0];
    if (initial) {
      setSelectedVenueId(initial.venue_id);
    }
  }, [reservedVenues, selectedVenueId, venueId]);

  const createMutation = useMutation({
    mutationFn: (data: {
      section: string;
      seatNumber: string;
      rowNumber: string;
      venueId: string;
    }) => trpcClient.venue.seat.create.mutate(data),
    onSuccess: () => {
      queryClient.invalidateQueries(
        trpc.venue.seat.listByVenueWithStatus.queryOptions({ venueId: selectedVenueId }),
      );
      toast.success("Kursi berhasil ditambahkan");
      resetForm();
      setOpen(false);
    },
    onError: (error) => {
      toast.error(error.message || "Gagal menambahkan kursi");
    },
  });

  function resetForm() {
    setSection("");
    setRowNumber("");
    setSeatNumber("");
  }

  function handleSubmit() {
    if (!section || !rowNumber || !seatNumber) {
      toast.error("Semua field harus diisi");
      return;
    }
    if (!selectedVenueId) {
      toast.error("Pilih venue reserved seating terlebih dahulu");
      return;
    }
    createMutation.mutate({
      section,
      seatNumber,
      rowNumber,
      venueId: selectedVenueId,
    });
  }

  return (
    <Modal open={open} onOpenChange={setOpen}>
      <ModalTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-4 py-2 h-auto text-sm font-medium">
          <Plus className="h-4 w-4" />
          Tambah Kursi
        </Button>
      </ModalTrigger>
      <ModalPopup>
        <ModalHeader>
          <ModalTitle className="font-bold text-lg">Tambah Kursi Baru</ModalTitle>
        </ModalHeader>
        <ModalBody className="space-y-4 py-2">
          <div className="space-y-2">
            <Label className="text-[11px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
              Venue (Reserved Seating)
            </Label>
            <div className="relative">
              <select
                value={selectedVenueId}
                onChange={(e) => setSelectedVenueId(e.target.value)}
                className="w-full appearance-none h-10 rounded-xl border border-input bg-background px-3 pr-8 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 cursor-pointer"
              >
                <option value="" disabled>
                  Pilih venue...
                </option>
                {reservedVenues.map((venue) => (
                  <option key={venue.venue_id} value={venue.venue_id}>
                    {venue.venue_name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            </div>
            {reservedVenues.length === 0 && (
              <p className="text-xs text-slate-400">Belum ada venue dengan reserved seating.</p>
            )}
          </div>
          <div className="space-y-2">
            <Label className="text-[11px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
              Section
            </Label>
            <Input
              placeholder="cth. WVIP"
              className="rounded-xl h-10"
              value={section}
              onChange={(e) => setSection(e.target.value)}
            />
          </div>
          <div className="flex gap-4">
            <div className="space-y-2 flex-1">
              <Label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                Baris
              </Label>
              <Input
                placeholder="cth. A"
                className="rounded-xl h-10"
                value={rowNumber}
                onChange={(e) => setRowNumber(e.target.value)}
              />
            </div>
            <div className="space-y-2 flex-1">
              <Label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                No. Kursi
              </Label>
              <Input
                placeholder="cth. 1"
                className="rounded-xl h-10"
                value={seatNumber}
                onChange={(e) => setSeatNumber(e.target.value)}
              />
            </div>
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
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white rounded-xl h-10 font-medium"
            onClick={handleSubmit}
            disabled={createMutation.isPending}
          >
            {createMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Tambah
          </Button>
        </ModalFooter>
      </ModalPopup>
    </Modal>
  );
}
