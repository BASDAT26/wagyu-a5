import { useState } from "react";
import ReadTicketCategory from "@/modules/ticket-category/read-ticket-category";
import Navbar from "@/components/Navbar";

export default function TicketCategory() {
  const [isAdmin, setIsAdmin] = useState(true);

  return (
    <>
      <Navbar role={isAdmin ? "admin" : "customer"} />
      <ReadTicketCategory isAdmin={isAdmin} onToggleAdmin={setIsAdmin} />
    </>
  );
}
