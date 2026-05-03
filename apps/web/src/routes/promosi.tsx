import CreatePromotion from "@/modules/promotion/create-promotion";
import Navbar from "@/components/Navbar";

export default function PromotionPage() {
  return (
    <>
      <Navbar role="CUSTOMER" />
      <CreatePromotion />
    </>
  );
}
