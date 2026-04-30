import SignInForm from "@/components/sign-in-form";
import Header from "@/components/header";

export default function Login() {
  return (
    <>
      <Header role="guest" />
      <SignInForm />
    </>
  );
}
