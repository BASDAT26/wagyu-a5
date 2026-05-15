import ReadTicketCategory from "@/modules/ticket-category/read-ticket-category";
import { authClient } from "@/lib/auth-client";

export default function TicketCategoryPage() {
  const { data: session } = authClient.useSession();
  const role = (session?.user as { role?: string })?.role ?? "CUSTOMER";

  return (
    <div className="space-y-6">
      <ReadTicketCategory />
    </div>
  );
}
