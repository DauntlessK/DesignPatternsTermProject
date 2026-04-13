import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import listingService from "../services/listingService";

export default function ListingsPage() {
  const [listings, setListings] = useState([]);

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

  return (
    <div>
      <h1>All Listings</h1>

      {listings.length === 0 ? (
        <p>No listings yet.</p>
      ) : (
        listings.map((listing) => (
          <div
            key={listing.id}
            style={{ border: "1px solid gray", padding: "10px", marginBottom: "10px" }}
          >
            <h3>
              {listing.year} {listing.make} {listing.model}
            </h3>
            <p>Mileage: {listing.mileage}</p>
            <p>Location: {listing.pickupLocation}</p>
            <p>Price: ${listing.pricePerDay}/day</p>
            <p>Description: {listing.description}</p>
            <p>Owner: {listing.owner?.name}</p>

            <Link to={`/book/${listing.id}`}>Book this car</Link>
          </div>
        ))
      )}
    </div>
  );
}