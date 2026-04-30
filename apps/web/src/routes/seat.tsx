import { useState } from "react";
import ReadSeat from "@/components/MERAH/read-seat";
import Header from "@/components/header";

type Role = "customer" | "admin" | "organizer";

export default function Seat() {
  const [role, setRole] = useState<Role>("customer");

  return (
    <div className="w-full min-h-screen bg-background">
      <Header role={role} />
      <ReadSeat role={role} onRoleChange={setRole} />
    </div>
  );
}