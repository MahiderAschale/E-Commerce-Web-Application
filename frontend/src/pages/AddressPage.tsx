import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAddresses,
  createAddress,
  deleteAddress,
  setDefaultAddress,
} from "../services/address.service";
import AddressCard from "../component/AddressCard";
import Navbar from "@/component/Navbar";

export default function AddressPage() {
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null
  );

  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    country: "",
    city: "",
    subCity: "",
    woreda: "",
    houseNumber: "",
    isDefault: false,
  });

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const res = await getAddresses();

      setAddresses(res.data);

      // Automatically select the default address
      const defaultAddress = res.data.find(
        (address: any) => address.isDefault
      );

      if (defaultAddress) {
        setSelectedAddressId(defaultAddress.id);
      }
    } catch (error) {
      console.error("Failed to load addresses:", error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value, checked, type } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const res = await createAddress(form);

      // Add newly created address to the selected address
      if (res.data?.id) {
        setSelectedAddressId(res.data.id);
      }

      // Refresh saved addresses
      await fetchAddresses();

      // Keep the newly created address selected
      if (res.data?.id) {
        setSelectedAddressId(res.data.id);
      }

      // Reset form
      setForm({
        fullName: "",
        phone: "",
        country: "",
        city: "",
        subCity: "",
        woreda: "",
        houseNumber: "",
        isDefault: false,
      });
    } catch (error) {
      console.error("Failed to create address:", error);
    }
  };

  const handleContinueToCheckout = () => {
    if (!selectedAddressId) {
      alert("Please select a shipping address.");
      return;
    }

    navigate("/checkout", {
      state: {
        addressId: selectedAddressId,
      },
    });
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteAddress(id);

      // If deleted address was selected, clear selection
      if (selectedAddressId === id) {
        setSelectedAddressId(null);
      }

      await fetchAddresses();
    } catch (error) {
      console.error("Failed to delete address:", error);
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await setDefaultAddress(id);

      setSelectedAddressId(id);

      await fetchAddresses();
    } catch (error) {
      console.error("Failed to set default address:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="container mx-auto px-6 py-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black">
            My Addresses
          </h1>

          <p className="text-gray-500 mt-2">
            Manage your shipping and billing addresses.
          </p>
        </div>

        {/* Add Address Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-10">

          <h2 className="text-xl font-semibold text-black mb-6">
            Add New Address
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            <input
              name="fullName"
              placeholder="Full Name"
              value={form.fullName}
              onChange={handleChange}
              className="h-11 rounded-lg border border-gray-200 bg-gray-100 px-4 text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
            />

            <input
              name="phone"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleChange}
              className="h-11 rounded-lg border border-gray-200 bg-gray-100 px-4 text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
            />

            <input
              name="country"
              placeholder="Country"
              value={form.country}
              onChange={handleChange}
              className="h-11 rounded-lg border border-gray-200 bg-gray-100 px-4 text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
            />

            <input
              name="city"
              placeholder="City"
              value={form.city}
              onChange={handleChange}
              className="h-11 rounded-lg border border-gray-200 bg-gray-100 px-4 text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
            />

            <input
              name="subCity"
              placeholder="Sub City"
              value={form.subCity}
              onChange={handleChange}
              className="h-11 rounded-lg border border-gray-200 bg-gray-100 px-4 text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
            />

            <input
              name="woreda"
              placeholder="Woreda"
              value={form.woreda}
              onChange={handleChange}
              className="h-11 rounded-lg border border-gray-200 bg-gray-100 px-4 text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
            />

            <input
              name="houseNumber"
              placeholder="House Number"
              value={form.houseNumber}
              onChange={handleChange}
              className="h-11 rounded-lg border border-gray-200 bg-gray-100 px-4 text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
            />

            <div className="flex items-center">
              <label className="flex items-center gap-3 text-black font-medium cursor-pointer">
                <input
                  type="checkbox"
                  name="isDefault"
                  checked={form.isDefault}
                  onChange={handleChange}
                  className="w-4 h-4 rounded"
                />
                Make this my default address
              </label>
            </div>

          </div>

          <button
            onClick={handleSubmit}
            className="mt-8 h-11 px-8 rounded-lg bg-black text-white font-medium hover:bg-gray-900 transition"
          >
            Save Address
          </button>

        </div>

        {/* Saved Addresses */}
        <div>

          <h2 className="text-2xl font-bold text-black mb-6">
            Saved Addresses
          </h2>

          <div className="grid grid-cols-1 text-black md:grid-cols-2 gap-6">

            {addresses.map((address) => (
              <div
                key={address.id}
                onClick={() => setSelectedAddressId(address.id)}
                className={`cursor-pointer rounded-xl transition ${
                  selectedAddressId === address.id
                    ? "ring-2 ring-black"
                    : ""
                }`}
              >
                <AddressCard
                  address={address}
                  onDelete={() => handleDelete(address.id)}
                  onDefault={() => handleSetDefault(address.id)}
                  onEdit={() => {}}
                />
              </div>
            ))}

          </div>

        </div>

        {/* Continue to Checkout */}
        {addresses.length > 0 && (
          <div className="mt-10 flex justify-end">
            <button
              onClick={handleContinueToCheckout}
              disabled={!selectedAddressId}
              className="h-11 px-8 rounded-lg bg-black text-white font-medium hover:bg-gray-900 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Continue to Checkout
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
