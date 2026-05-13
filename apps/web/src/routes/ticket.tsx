import ReadTicket from "@/modules/ticket/read-ticket";
import { authClient } from "@/lib/auth-client";

export default function TicketPage() {
  const { data: session } = authClient.useSession();
  const role = (session?.user as { role?: string })?.role ?? "CUSTOMER";

  return (
    <div className="w-full min-h-screen bg-background">
      <ReadTicket />
    </div>
  );
}
