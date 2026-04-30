import ReadArtist from "@/components/HIJAU/read-artist";
import ReadTicketCategory from "@/components/HIJAU/read-ticket-category";

export default function Hijau() {
  return (
    <div className="w-full flex flex-col gap-12 p-6 max-w-6xl mx-auto">
      <ReadArtist />
      <ReadTicketCategory />
    </div>
  );
}
