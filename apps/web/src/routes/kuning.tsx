import CreateEvent from "@/components/KUNING/create-event";
import CreateVenue from "@/components/KUNING/create-venue";
import DeleteVenue from "@/components/KUNING/delete-venue";
import ReadEvent from "@/components/KUNING/read-event";
import ReadVenue from "@/components/KUNING/read-venue";
import UpdateEvent from "@/components/KUNING/update-event";
import UpdateVenue from "@/components/KUNING/update-venue";

export default function Kuning() {
  return (
    <div className="w-full flex flex-col">
      <CreateEvent />
      <ReadEvent />
      <UpdateEvent />
      <CreateVenue />
      <ReadVenue />
      <UpdateVenue />
      <DeleteVenue/>
    </div>
  );
}