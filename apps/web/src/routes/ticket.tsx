import { useState } from "react";
import ReadTicket from "@/components/ticket/read-ticket";
import Navbar from "@/components/Navbar";

type Role = "admin" | "customer";

export default function Ticket() {
  const [role, setRole] = useState<Role>("customer");

  return (
    <div className="w-full min-h-screen bg-background">
      <Navbar role={role} />
      <ReadTicket role={role} onRoleChange={setRole} />
    </div>
  );
}
