import ReadSeat from "@/modules/seat/read-seat";
import { authClient } from "@/lib/auth-client";

export default function SeatPage() {
  const { data: session } = authClient.useSession();
  const role = (session?.user as { role?: string })?.role ?? "CUSTOMER";

  return (
    <div className="w-full min-h-screen bg-background">
      <ReadSeat />
    </div>
  );
}
