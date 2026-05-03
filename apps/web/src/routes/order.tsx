import CreateOrder from "@/components/order/create-order";
import Header from "@/components/header";

export default function OrderPage() {
  return (
    <>
      <Header role="customer" />
      <CreateOrder />
    </>
  );
}
