import { useEffect, useState } from "react";
import listingService from "../services/listingService";
import api from "../api/axios";

export default function UpdateListingPricePage() {
  const [listings, setListings] = useState([]);
  const [messages, setMessages] = useState({});

  useEffect(() => {
    const loadListings = async () => {
      try {
        const result = await listingService.getAll();
        setListings(result.listings);
      } catch (err) {
        console.error(err);
      }
    };

    loadListings();
  }, []);

  const handlePriceChange = (id, value) => {
    setListings((prev) =>
      prev.map((listing) =>
        listing.id === id ? { ...listing, pricePerDay: value } : listing
      )
    );
  };

  const handleSave = async (listing) => {
    try {
      const { data } = await api.put(`/listings/${listing.id}`, {
        pricePerDay: listing.pricePerDay,
      });

      setMessages((prev) => ({
        ...prev,
        [listing.id]: `${data.message}`,
      }));
    } catch (err) {
      setMessages((prev) => ({
        ...prev,
        [listing.id]:
          err?.response?.data?.message || "Failed to update listing",
      }));
    }
  };

  return (
    <div>
      <h1>Update Listing Prices</h1>

      {listings.length === 0 ? (
        <p>No listings available.</p>
      ) : (
        listings.map((listing) => (
          <div
            key={listing.id}
            style={{ border: "1px solid gray", padding: "10px", marginBottom: "10px" }}
          >
            <h3>
              {listing.year} {listing.make} {listing.model}
            </h3>
            <p>Current price: ${listing.pricePerDay}/day</p>

            <input
              type="number"
              value={listing.pricePerDay}
              onChange={(e) => handlePriceChange(listing.id, e.target.value)}
            />

            <button onClick={() => handleSave(listing)} style={{ marginLeft: "10px" }}>
              Save Price
            </button>

            <p>{messages[listing.id]}</p>
          </div>
        ))
      )}
    </div>
  );
}