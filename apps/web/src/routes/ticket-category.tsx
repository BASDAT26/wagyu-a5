import { useState } from "react";
import ReadTicketCategory from "@/modules/ticket-category/read-ticket-category";
import Navbar from "@/components/Navbar";

export default function TicketCategoryPage() {
  const [isAdmin, setIsAdmin] = useState(true);

  return (
    <>
      <Navbar role={isAdmin ? "ADMIN" : "CUSTOMER"} />
      <ReadTicketCategory isAdmin={isAdmin} onToggleAdmin={setIsAdmin} />
    </>
  );
}
