import CreatePromotion from "@/modules/promotion/create-promotion";
import { authClient } from "@/lib/auth-client";
import type { Role } from "@/data/type";

export default function PromotionPage() {
  const { data: session } = authClient.useSession();
  const role = (session?.user as { role?: string })?.role ?? "CUSTOMER";

  return <CreatePromotion role={role as Role} />;
}
