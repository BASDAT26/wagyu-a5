import ReadEvent from "@/components/event/read-event";
import Navbar from "@/components/Navbar";

export default function Event() {
  return (
    <>
      <Navbar role="organizer" />
      <ReadEvent />
    </>
  );
}
