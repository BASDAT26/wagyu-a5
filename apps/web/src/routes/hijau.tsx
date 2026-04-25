import CreateArtist from "@/components/HIJAU/create-artist";
import CreateTicketCategory from "@/components/HIJAU/create-ticket-category";
import DeleteArtist from "@/components/HIJAU/delete-artist";
import DeleteTicketCategory from "@/components/HIJAU/delete-ticket-category";
import ReadArtist from "@/components/HIJAU/read-artist";
import ReadTicketCategory from "@/components/HIJAU/read-ticket-category";
import UpdateArtist from "@/components/HIJAU/update-artist";
import UpdateTicketCategory from "@/components/HIJAU/update-ticket-category";

export default function Hijau() {
  return (
    <div className="w-full flex flex-col">
      <CreateArtist />
      <UpdateArtist />
      <DeleteArtist />
      <ReadArtist />
      <CreateTicketCategory />
      <UpdateTicketCategory />
      <DeleteTicketCategory />
      <ReadTicketCategory />
    </div>
  );
}
