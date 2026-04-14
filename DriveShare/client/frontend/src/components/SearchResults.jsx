// Component: SearchResults - shows a list of search results and selection handling
import { Link } from "react-router-dom";
import placeholderImage from "../assets/placeholder-car.jpg";

const PLACEHOLDER_IMAGE = placeholderImage;

export default function SearchResults({ listings, mediator }) {
  if (listings.length === 0) {
    return <p>No matching listings found.</p>;
  }

  return (
    <div>
      <h3>Search Results</h3>

      {listings.map((listing) => (
        <div key={listing.id} className="card">
          <div
            onClick={() => mediator.handleListingSelected(listing)}
            style={{ cursor: "pointer" }}
          >
            <img
              src={listing.imageUrl && listing.imageUrl.trim() ? listing.imageUrl : PLACEHOLDER_IMAGE}
              alt={`${listing.year} ${listing.make} ${listing.model}`}
              style={{
                width: "100%",
                maxWidth: "300px",
                height: "200px",
                objectFit: "cover",
                display: "block",
                marginBottom: "10px",
                border: "1px solid #ccc",
              }}
            />

            <h4>
              {listing.year} {listing.make} {listing.model}
            </h4>
            <p>Location: {listing.pickupLocation}</p>
            <p>Price: ${listing.pricePerDay}/day</p>
            <p>Type: {listing.carType}</p>
          </div>

          <Link to={`/book/${listing.id}`}>Book this car</Link>
        </div>
      ))}
    </div>
  );
}