import ReadVenue from "@/modules/venue/read-venue";
import Navbar from "@/components/Navbar";

export default function Venue() {
  return (
    <>
      <Navbar role="organizer" />
      <ReadVenue />
    </>
  );
}
