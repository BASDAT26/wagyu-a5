// [REFACTOR] This is a dev/demo page that renders all auth components stacked.
// Similar to ds.tsx (Design System showcase). Kept for development convenience.

import Dashboard from "@/modules/auth/dashboard";
import UpdatePassword from "@/modules/auth/update-password";

export default function Putih() {
  return (
    <div className="w-full flex flex-col">
      <Dashboard />
      <UpdatePassword />
    </div>
  );
}
