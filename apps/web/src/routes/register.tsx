import RegisterComponent from "@/components/auth/register";
import Navbar from "@/components/Navbar";

export default function RegisterRoute() {
  return (
    <>
      <Navbar role="guest" />
      <RegisterComponent />
    </>
  );
}
