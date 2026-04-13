import { useState } from "react";

export default function SearchFilters({ allListings, mediator }) {
  const [filters, setFilters] = useState({
    location: "",
    make: "",
    maxPrice: "",
  });

  const handleChange = (e) => {
    const updatedFilters = {
      ...filters,
      [e.target.name]: e.target.value,
    };

    setFilters(updatedFilters);
    mediator.handleFiltersChanged(allListings, updatedFilters);
  };

  return (
    <div style={{ marginBottom: "20px", border: "1px solid gray", padding: "10px" }}>
      <h3>Search Filters</h3>

      <input
        name="location"
        placeholder="Location"
        value={filters.location}
        onChange={handleChange}
        style={{ marginRight: "10px" }}
      />

      <input
        name="make"
        placeholder="Make"
        value={filters.make}
        onChange={handleChange}
        style={{ marginRight: "10px" }}
      />

      <input
        name="maxPrice"
        placeholder="Max Price Per Day"
        value={filters.maxPrice}
        onChange={handleChange}
      />
    </div>
  );
}