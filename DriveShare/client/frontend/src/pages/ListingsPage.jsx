// Page: ListingsPage - displays all available car listings
import { Link } from "react-router-dom";
import placeholderImage from "../assets/placeholder-car.jpg";

const PLACEHOLDER_IMAGE = placeholderImage;

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

            <h3>
              {listing.year} {listing.make} {listing.model}
            </h3>
            <p>Type: {listing.carType}</p>
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