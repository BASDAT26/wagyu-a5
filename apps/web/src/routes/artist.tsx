import { useState } from "react";
import ReadArtist from "@/components/artist/read-artist";
import Navbar from "@/components/Navbar";

export default function Artist() {
  const [isAdmin, setIsAdmin] = useState(true);

  return (
    <>
      <Navbar role={isAdmin ? "admin" : "customer"} />
      <ReadArtist isAdmin={isAdmin} onToggleAdmin={setIsAdmin} />
    </>
  );
}
