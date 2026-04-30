import { useState } from "react";
import ReadTicket from "@/components/MERAH/read-ticket";
import Header from "@/components/header";

type Role = "admin" | "customer";

export default function Ticket() {
  const [role, setRole] = useState<Role>("customer");

  return (
    <div className="w-full min-h-screen bg-background">
      <Header role={role} />
      <ReadTicket role={role} onRoleChange={setRole} />
    </div>
  );
}