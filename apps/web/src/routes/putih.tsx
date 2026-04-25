import Dashboard from "@/components/PUTIH/dashboard";
import Login from "@/components/PUTIH/login";
import Navbar from "@/components/PUTIH/navbar";
import Profile from "@/components/PUTIH/profile";
import Register from "@/components/PUTIH/register";
import UpdatePassword from "@/components/PUTIH/update-password";

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
