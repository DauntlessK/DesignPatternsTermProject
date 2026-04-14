// Page: BookListingPage - view details for a listing and book or watch it
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import listingService from "../services/listingService";
import BookingForm from "../components/BookingForm";
import WatchListingForm from "../components/WatchListingForm";

export default function BookListingPage() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadListing = async () => {
      try {
        const result = await listingService.getById(id);
        setListing(result.listing);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load listing");
      }
    };

    loadListing();
  }, [id]);

  if (error) return <p>{error}</p>;
  if (!listing) return <p>Loading listing...</p>;

  return (
    <div>
      <h1>Book Listing</h1>

      <div style={{ marginBottom: "20px", border: "1px solid gray", padding: "10px" }}>
        <h2>
          {listing.year} {listing.make} {listing.model}
        </h2>
        <p>Mileage: {listing.mileage}</p>
        <p>Location: {listing.pickupLocation}</p>
        <p>Price: ${listing.pricePerDay}/day</p>
        <p>Description: {listing.description}</p>
        <p>Owner: {listing.owner?.name}</p>
      </div>

      <BookingForm listing={listing} />
      <WatchListingForm listing={listing} />
    </div>
  );
}