import CreateSeat from "@/components/MERAH/create-seat";
import CreateTicket from "@/components/MERAH/create-ticket";
import DeleteSeat from "@/components/MERAH/delete-seat";
import DeleteTicket from "@/components/MERAH/delete-ticket";
import ReadSeat from "@/components/MERAH/read-seat";
import ReadTicket from "@/components/MERAH/read-ticket";
import UpdateSeat from "@/components/MERAH/update-seat";
import UpdateTicket from "@/components/MERAH/update-ticket";

export default function Merah() {
  return (
    <div className="w-full flex flex-col">
      <CreateSeat />
      <UpdateSeat />
      <DeleteSeat />
      <ReadSeat />
      <CreateTicket />
      <UpdateTicket />
      <DeleteTicket />
      <ReadTicket />
    </div>
  );
}
