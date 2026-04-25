import CreateOrder from "@/components/BIRU/create-order";
import CreatePromotion from "@/components/BIRU/create-promotion";
import DeleteOrder from "@/components/BIRU/delete-order";
import DeletePromotion from "@/components/BIRU/delete-promotion";
import ReadOrder from "@/components/BIRU/read-order";
import ReadPromotion from "@/components/BIRU/read-promotion";
import UpdateOrder from "@/components/BIRU/update-order";
import UpdatePromotion from "@/components/BIRU/update-promotion";

export default function Biru() {
  return (
    <div className="w-full flex flex-col">
      <CreateOrder />
      <UpdateOrder />
      <DeleteOrder />
      <ReadOrder />
      <CreatePromotion />
      <UpdatePromotion />
      <DeletePromotion />
      <ReadPromotion />
    </div>
  );
}
