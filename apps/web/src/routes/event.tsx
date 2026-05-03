import ReadEvent from "@/modules/event/read-event";
import Navbar from "@/components/Navbar";

export default function EventPage() {
  return (
    <>
      <Navbar role="organizer" />
      <ReadEvent />
    </>
  );
}
