// [REFACTOR] This is a dev/demo page that renders all auth components stacked.
// Similar to ds.tsx (Design System showcase). Kept for development convenience.

import Dashboard from "@/components/auth/dashboard";
import Login from "@/components/auth/login";
import Navbar from "@/components/auth/navbar";
import Profile from "@/components/auth/profile";
import Register from "@/components/auth/register";
import UpdatePassword from "@/components/auth/update-password";

export default function Putih() {
  return <div className="w-full flex flex-col">
    <Dashboard/>
    <Login/>
    <Navbar/>
    <Profile/>
    <Register/>
    <UpdatePassword/>
  </div>;
}
