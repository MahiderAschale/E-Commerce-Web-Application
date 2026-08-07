import { Address } from "../types/address";
import { Button } from "@/components/ui/button";

interface Props {
  address: Address;
  onEdit: () => void;
  onDelete: () => void;
  onDefault: () => void;
}

export default function AddressCard({
  address,
  onEdit,
  onDelete,
  onDefault,
}: Props) {
  return (
    <div className="border rounded-lg p-5 shadow-sm bg-white">

      {address.isDefault && (
        <span className="text-green-600 font-semibold">
          Default Address
        </span>
      )}

      <h2 className="text-xl font-bold mt-2">
        {address.fullName}
      </h2>

      <p>{address.phone}</p>

      <p>
        {address.country}, {address.city}
      </p>

      <p>{address.subCity}</p>

      {address.woreda && <p>Woreda: {address.woreda}</p>}

      {address.houseNumber && (
        <p>House No: {address.houseNumber}</p>
      )}

      <div className="flex gap-2 mt-5">

        <Button onClick={onEdit}>
          Edit
        </Button>

        <Button
          variant="outline"
          onClick={onDefault}
        >
          Set Default
        </Button>

        <Button
          variant="destructive"
          onClick={onDelete}
        >
          Delete
        </Button>

      </div>
    </div>
  );
}