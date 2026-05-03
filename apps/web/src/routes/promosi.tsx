import CreatePromotion from "@/modules/promotion/create-promotion";
import Navbar from "@/components/Navbar";

export default function PromosiPage() {
  return (
    <>
      <Navbar role="customer" />
      <CreatePromotion />
    </>
  );
}
