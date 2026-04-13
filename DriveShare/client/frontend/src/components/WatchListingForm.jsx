import { useState } from "react";
import watchService from "../services/watchService";

export default function WatchListingForm({ listing }) {
  const [targetMaxPrice, setTargetMaxPrice] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await watchService.createWatch({
        listingId: listing.id,
        targetMaxPrice,
      });
      setMessage(`${result.message}`);
    } catch (err) {
      setMessage(err?.response?.data?.message || "Failed to watch listing");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ border: "1px solid gray", padding: "10px", marginTop: "20px" }}>
      <h3>Watch This Car</h3>
      <p>Get notified if this listing meets your target price.</p>

      <input
        type="number"
        placeholder="Target max price"
        value={targetMaxPrice}
        onChange={(e) => setTargetMaxPrice(e.target.value)}
      />

      <button type="submit" style={{ marginLeft: "10px" }} className="button">
        Watch
      </button>

      <p>{message}</p>
    </form>
  );
}