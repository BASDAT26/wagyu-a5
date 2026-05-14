import ReadTicketCategory from "@/modules/ticket-category/read-ticket-category";
import TicketCategoryQuota from "@/modules/ticket-category/ticket-category-quota";
import { authClient } from "@/lib/auth-client";

export default function TicketCategoryPage() {
  const { data: session } = authClient.useSession();
  const role = (session?.user as { role?: string })?.role ?? "CUSTOMER";

  return (
    <div className="space-y-6">
      <ReadTicketCategory />
      <div className="max-w-6xl mx-auto px-6 pb-6">
        <TicketCategoryQuota />
      </div>
    </div>
  );
}
