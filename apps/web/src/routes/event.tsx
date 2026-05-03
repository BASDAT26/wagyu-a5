import ReadEvent from "@/modules/event/read-event";
import Navbar from "@/components/Navbar";

export default function Event() {
  return (
    <>
      <Navbar role="organizer" />
      <ReadEvent />
    </>
  );
}
