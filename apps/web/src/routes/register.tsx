import RegisterComponent from "@/components/auth/register";
import Header from "@/components/header";

export default function RegisterRoute() {
  return <>
    <Header role="guest" />
    <RegisterComponent />
  </>;
}
