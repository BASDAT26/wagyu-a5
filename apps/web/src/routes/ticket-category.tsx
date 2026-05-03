import { useState } from "react";
import ReadTicketCategory from "@/components/ticket-category/read-ticket-category";
import Header from "@/components/header";

export default function TicketCategory() {
  const [isAdmin, setIsAdmin] = useState(true);

  return (
    <>
      <Header role={isAdmin ? "admin" : "customer"} />
      <ReadTicketCategory isAdmin={isAdmin} onToggleAdmin={setIsAdmin} />
    </>
  );
}