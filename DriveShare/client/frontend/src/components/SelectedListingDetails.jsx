export default function SelectedListingDetails({ listing }) {
  if (!listing) {
    return (
      <div style={{ border: "1px solid gray", padding: "10px" }}>
        <h3>Selected Listing</h3>
        <p>Select a car to see more details.</p>
      </div>
    );
  }

  return (
    <div style={{ border: "1px solid gray", padding: "10px" }}>
      <h3>Selected Listing</h3>
      <h4>
        {listing.year} {listing.make} {listing.model}
      </h4>
      <p>Mileage: {listing.mileage}</p>
      <p>Location: {listing.pickupLocation}</p>
      <p>Price: ${listing.pricePerDay}/day</p>
      <p>Description: {listing.description || "No description provided."}</p>
      <p>Owner: {listing.owner?.name}</p>
    </div>
  );
}