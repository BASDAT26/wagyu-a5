import { useState } from "react";
import ReadArtist from "@/modules/artist/read-artist";
import Navbar from "@/components/Navbar";

export default function ArtistPage() {
  const [isAdmin, setIsAdmin] = useState(true);

  return (
    <>
      <Navbar role={isAdmin ? "admin" : "customer"} />
      <ReadArtist isAdmin={isAdmin} onToggleAdmin={setIsAdmin} />
    </>
  );
}
