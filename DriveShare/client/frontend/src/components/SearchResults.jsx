import { Link } from "react-router-dom";

export default function SearchResults({ listings, mediator }) {
  if (listings.length === 0) {
    return <p>No matching listings found.</p>;
  }

  return (
    <div>
      <h3>Search Results</h3>

      {listings.map((listing) => (
        <div
          key={listing.id}
          style={{
            border: "1px solid gray",
            padding: "10px",
            marginBottom: "10px",
          }}
        >
          <div
            onClick={() => mediator.handleListingSelected(listing)}
            style={{ cursor: "pointer" }}
          >
            <h4>
              {listing.year} {listing.make} {listing.model}
            </h4>
            <p>Location: {listing.pickupLocation}</p>
            <p>Price: ${listing.pricePerDay}/day</p>
          </div>

          <Link to={`/book/${listing.id}`}>Book this car</Link>
        </div>
      ))}
    </div>
  );
}