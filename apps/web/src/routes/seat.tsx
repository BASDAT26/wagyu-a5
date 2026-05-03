import { useState } from "react";
import ReadSeat from "@/modules/seat/read-seat";
import Navbar from "@/components/Navbar";
import type { Role } from "@/data/type";

export default function SeatPage() {
  const [role, setRole] = useState<Role>("CUSTOMER");

  return (
    <div className="w-full min-h-screen bg-background">
      <Navbar role={role} />
      <ReadSeat role={role} onRoleChange={setRole} />
    </div>
  );
}
