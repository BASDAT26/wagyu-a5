import { Button } from "@wagyu-a5/ui/components/button";
import { Input } from "@wagyu-a5/ui/components/input";
import { Textarea } from "@wagyu-a5/ui/components/textarea";
import { Label } from "@wagyu-a5/ui/components/label";
import { Checkbox } from "@wagyu-a5/ui/components/checkbox";
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
import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { trpcClient, trpc } from "@/utils/trpc";
import { toast } from "sonner";

export default function CreateVenue() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [venueName, setVenueName] = useState("");
  const [capacity, setCapacity] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [reservedSeating, setReservedSeating] = useState(false);
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data: {
      venueName: string;
      capacity: number;
      address: string;
      city: string;
      reservedSeating: boolean;
    }) => trpcClient.venue.venue.create.mutate(data),
    onSuccess: () => {
      queryClient.invalidateQueries(trpc.venue.venue.list.queryOptions());
      toast.success("Venue berhasil ditambahkan");
      resetForm();
      setIsModalOpen(false);
    },
    onError: (error) => {
      toast.error(error.message || "Gagal menambahkan venue");
    },
  });

  function resetForm() {
    setVenueName("");
    setCapacity("");
    setCity("");
    setAddress("");
    setReservedSeating(false);
  }

  function handleSubmit() {
    if (!venueName || !capacity || !city || !address) {
      toast.error("Semua field harus diisi");
      return;
    }
    createMutation.mutate({
      venueName,
      capacity: Number(capacity),
      address,
      city,
      reservedSeating,
    });
  }

  return (
    <div>
      <Modal open={isModalOpen} onOpenChange={setIsModalOpen}>
        <ModalTrigger asChild>
          <Button>
            <Plus className="h-4 w-4" />
            Tambah Venue
          </Button>
        </ModalTrigger>
        <ModalPopup>
          <ModalHeader>
            <ModalTitle>Tambah Venue Baru</ModalTitle>
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
              <div className="flex items-center gap-2">
                <Checkbox
                  id="input-reserved-seating"
                  checked={reservedSeating}
                  onCheckedChange={(value) => setReservedSeating(value === true)}
                />
                <Label htmlFor="input-reserved-seating">
                  Has Reserved Seating
                </Label>
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
    </div>
  );
}
