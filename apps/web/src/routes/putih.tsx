// [REFACTOR] This is a dev/demo page that renders all auth components stacked.
// Similar to ds.tsx (Design System showcase). Kept for development convenience.

import Dashboard from "@/modules/auth/dashboard";
import Login from "@/modules/auth/login";
import Navbar from "@/modules/auth/navbar";
import Profile from "@/modules/auth/profile";
import Register from "@/modules/auth/register";
import UpdatePassword from "@/modules/auth/update-password";

export default function Putih() {
  return (
    <div className="w-full flex flex-col">
      <Dashboard />
      <Login />
      <Navbar />
      <Profile />
      <Register />
      <UpdatePassword />
    </div>
  );
}
