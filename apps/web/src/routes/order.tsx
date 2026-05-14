

import CreateOrder from "@/modules/order/create-order";
import Navbar from "@/components/Navbar";
import { authClient } from "@/lib/auth-client";
import type { Role } from "@/data/type";

export default function OrderPage() {
  const { data: session } = authClient.useSession();
  const role = (session?.user as { role?: string })?.role ?? "CUSTOMER";

  return (
    <>
      <CreateOrder role={role as Role} />
    </>
  );
}
