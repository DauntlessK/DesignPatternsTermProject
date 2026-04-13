import { useState } from "react";
import listingService from "../services/listingService";

export default function CarListingForm() {
  const [form, setForm] = useState({
    make: "",
    model: "",
    carType: "Car",
    year: "",
    mileage: "",
    pickupLocation: "",
    pricePerDay: "",
    description: "",
    imageUrl: ""
  });

  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await listingService.create(form);
      setMessage(`Listing created: ${result.listing.year} ${result.listing.make} ${result.listing.model}`);
      setForm({
        make: "",
        model: "",
        year: "",
        mileage: "",
        pickupLocation: "",
        pricePerDay: "",
        description: "",
      });
    } catch (err) {
      setMessage(err?.response?.data?.message || "Failed to create listing");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Make"
        value={form.make}
        onChange={(e) => setForm({ ...form, make: e.target.value })}
      />
      <input
        placeholder="Model"
        value={form.model}
        onChange={(e) => setForm({ ...form, model: e.target.value })}
      />
      <select
        value={form.carType}
        onChange={(e) => setForm({ ...form, carType: e.target.value })}
      >
        <option value="Car">Car</option>
        <option value="SUV">SUV</option>
        <option value="Truck">Truck</option>
      </select>
      <input
        placeholder="Year"
        value={form.year}
        onChange={(e) => setForm({ ...form, year: e.target.value })}
      />
      <input
        placeholder="Mileage"
        value={form.mileage}
        onChange={(e) => setForm({ ...form, mileage: e.target.value })}
      />
      <input
        placeholder="Pickup Location"
        value={form.pickupLocation}
        onChange={(e) => setForm({ ...form, pickupLocation: e.target.value })}
      />
      <input
        placeholder="Price Per Day"
        value={form.pricePerDay}
        onChange={(e) => setForm({ ...form, pricePerDay: e.target.value })}
      />
      <textarea
        placeholder="Description"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />
      <input
        placeholder="Image URL (optional)"
        value={form.imageUrl}
        onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
      />
      <button type="submit" className="button">Create Listing</button>
      <p>{message}</p>
    </form>
  );
}