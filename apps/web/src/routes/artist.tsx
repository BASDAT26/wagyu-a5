import { useState } from "react";
import ReadArtist from "@/components/HIJAU/read-artist";
import Header from "@/components/header";

export default function Artist() {
  const [isAdmin, setIsAdmin] = useState(true);

  return (
    <>
      <Header role={isAdmin ? "admin" : "customer"} />
      <ReadArtist isAdmin={isAdmin} onToggleAdmin={setIsAdmin} />
    </>
  );
}