import CreatePromotion from "@/modules/promotion/create-promotion";
import Navbar from "@/components/Navbar";
import { authClient } from "@/lib/auth-client";

export default function PromotionPage() {
  const { data: session } = authClient.useSession();
  const role = (session?.user as { role?: string })?.role ?? "CUSTOMER";

  return (
    <>
      <CreatePromotion role={role as "ADMIN" | "CUSTOMER"} />
    </>
  );
}
