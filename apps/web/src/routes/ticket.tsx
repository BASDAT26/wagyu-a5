import { useState } from "react";
import ReadTicket from "@/modules/ticket/read-ticket";
import Navbar from "@/components/Navbar";

type Role = "ADMIN" | "CUSTOMER";

export default function TicketPage() {
  const [role, setRole] = useState<Role>("CUSTOMER");

  return (
    <div className="w-full min-h-screen bg-background">
      <Navbar role={role} />
      <ReadTicket role={role} onRoleChange={setRole} />
    </div>
  );
}
