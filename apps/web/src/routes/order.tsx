import CreateOrder from "@/components/order/create-order";
import Navbar from "@/components/Navbar";

export default function OrderPage() {
  return (
    <>
      <Navbar role="customer" />
      <CreateOrder />
    </>
  );
}
