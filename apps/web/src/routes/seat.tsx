import { useState } from "react";
import ReadSeat from "@/components/seat/read-seat";
import Navbar from "@/components/Navbar";

type Role = "customer" | "admin" | "organizer";

export default function Seat() {
  const [role, setRole] = useState<Role>("customer");

  return (
    <div className="w-full min-h-screen bg-background">
      <Navbar role={role} />
      <ReadSeat role={role} onRoleChange={setRole} />
    </div>
  );
}
