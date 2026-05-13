import { Button } from "@wagyu-a5/ui/components/button";
import { Input } from "@wagyu-a5/ui/components/input";
import { Textarea } from "@wagyu-a5/ui/components/textarea";
import { Label } from "@wagyu-a5/ui/components/label";
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
import { useState, useEffect } from "react";
import { Pencil, Loader2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { trpcClient, trpc } from "@/utils/trpc";
import { toast } from "sonner";
import type { Venue } from "./types";

interface UpdateVenueProps {
  venue: Venue;
}

export default function UpdateVenue({ venue }: UpdateVenueProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [venueName, setVenueName] = useState(venue.venue_name);
  const [capacity, setCapacity] = useState(String(venue.capacity));
  const [city, setCity] = useState(venue.city);
  const [address, setAddress] = useState(venue.address);
  const queryClient = useQueryClient();

  // Sync form when venue prop changes
  useEffect(() => {
    setVenueName(venue.venue_name);
    setCapacity(String(venue.capacity));
    setCity(venue.city);
    setAddress(venue.address);
  }, [venue]);

  const updateMutation = useMutation({
    mutationFn: (data: {
      venueId: string;
      venueName?: string;
      capacity?: number;
      address?: string;
      city?: string;
    }) => trpcClient.venue.venue.update.mutate(data),
    onSuccess: () => {
      queryClient.invalidateQueries(trpc.venue.venue.list.queryOptions());
      toast.success("Venue berhasil diperbarui");
      setIsModalOpen(false);
    },
    onError: (error) => {
      toast.error(error.message || "Gagal memperbarui venue");
    },
  });

  function handleSubmit() {
    if (!venueName || !capacity || !city || !address) {
      toast.error("Semua field harus diisi");
      return;
    }
    updateMutation.mutate({
      venueId: venue.venue_id,
      venueName,
      capacity: Number(capacity),
      address,
      city,
    });
  }

  return (
    <div>
      <Modal open={isModalOpen} onOpenChange={setIsModalOpen}>
        <ModalTrigger asChild>
          <Button variant="outline" size="sm" className="gap-1.5">
            <Pencil className="h-3.5 w-3.5" />
            Edit
          </Button>
        </ModalTrigger>
        <ModalPopup>
          <ModalHeader>
            <ModalTitle>Edit Venue</ModalTitle>
          </ModalHeader>
          <ModalBody>
            <div className="space-y-2 w-full">
              <div>
                <Label htmlFor="input-venue-name">NAMA VENUE (VENUE_NAME)</Label>
                <Input
                  id="input-venue-name"
                  type="text"
                  placeholder="cth. Jakarta Convention Center"
                  value={venueName}
                  onChange={(e) => setVenueName(e.target.value)}
                />
              </div>
              <div className="grid w-full gap-4 grid-cols-2">
                <div>
                  <Label htmlFor="input-capacity">KAPASITAS (CAPACITY)</Label>
                  <Input
                    id="input-capacity"
                    type="number"
                    placeholder="1000"
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="input-city">KOTA (CITY)</Label>
                  <Input
                    id="input-city"
                    type="text"
                    placeholder="Jakarta"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="input-address">ALAMAT (ADDRESS)</Label>
                <Textarea
                  id="input-address"
                  placeholder="Jl. Gatot Subroto No.1"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
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
    </div>
  );
}
