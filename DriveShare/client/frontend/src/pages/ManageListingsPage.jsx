import { useEffect, useState } from "react";
import listingService from "../services/listingService";
import api from "../api/axios";

export default function ManageListingsPage() {
  const [listings, setListings] = useState([]);
  const [messages, setMessages] = useState({});

  const loadListings = async () => {
    try {
      const result = await listingService.getAll(true);
      setListings(result.listings);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadListings();
  }, []);

  const handlePriceChange = (id, value) => {
    setListings((prev) =>
      prev.map((listing) =>
        listing.id === id ? { ...listing, pricePerDay: value } : listing
      )
    );
  };

  const handleSavePrice = async (listing) => {
    try {
      const { data } = await api.put(`/listings/${listing.id}`, {
        pricePerDay: listing.pricePerDay,
      });

      setMessages((prev) => ({
        ...prev,
        [listing.id]: `${data.message}`,
      }));

      loadListings();
    } catch (err) {
      setMessages((prev) => ({
        ...prev,
        [listing.id]:
          err?.response?.data?.message || "Failed to update price",
      }));
    }
  };

  const handleToggleActive = async (id) => {
    try {
      const result = await listingService.toggleActive(id);

      setMessages((prev) => ({
        ...prev,
        [id]: `${result.message}`,
      }));

      loadListings();
    } catch (err) {
      setMessages((prev) => ({
        ...prev,
        [id]:
          err?.response?.data?.message || "Failed to update listing status",
      }));
    }
  };

  return (
    <div className="container">
      <h1>Manage Listings</h1>

      {listings.length === 0 ? (
        <p>No listings yet.</p>
      ) : (
        listings.map((listing) => (
          <div key={listing.id} className="card">
            <h3>
              {listing.year} {listing.make} {listing.model}
            </h3>

            <p>Status: {listing.isActive ? "Active" : "Inactive"}</p>
            <p>Type: {listing.carType}</p>
            <p>Location: {listing.pickupLocation}</p>

            <label style={{ display: "block", marginBottom: "6px" }}>
              Price Per Day
            </label>
            <input
              type="number"
              value={listing.pricePerDay}
              onChange={(e) => handlePriceChange(listing.id, e.target.value)}
              style={{ maxWidth: "220px" }}
            />

            <div style={{ marginTop: "12px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <button className="button" onClick={() => handleSavePrice(listing)}>
                Save Price
              </button>

              <button className="button" onClick={() => handleToggleActive(listing.id)}>
                {listing.isActive ? "Deactivate" : "Reactivate"}
              </button>
            </div>

            <p style={{ marginTop: "12px" }}>{messages[listing.id]}</p>
          </div>
        ))
      )}
    </div>
  );
}