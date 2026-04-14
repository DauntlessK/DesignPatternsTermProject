// Page: SearchPage - search and browse listings with filters and details
import { useEffect, useMemo, useState } from "react";
import listingService from "../services/listingService";
import SearchMediator from "../SearchMediator";
import SearchFilters from "../components/SearchFilters";
import SearchResults from "../components/SearchResults";
import SelectedListingDetails from "../components/SelectedListingDetails";

export default function SearchPage() {
  const [allListings, setAllListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [selectedListing, setSelectedListing] = useState(null);

  const mediator = useMemo(() => {
    return new SearchMediator(setFilteredListings, setSelectedListing);
  }, []);

  useEffect(() => {
    const loadListings = async () => {
      try {
        const result = await listingService.getAll();
        setAllListings(result.listings);
        setFilteredListings(result.listings);
      } catch (err) {
        console.error(err);
      }
    };

    loadListings();
  }, []);

  return (
    <div>
      <h1>Search Cars</h1>

      <SearchFilters allListings={allListings} mediator={mediator} />

      <div style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>
        <div style={{ flex: 2 }}>
          <SearchResults listings={filteredListings} mediator={mediator} />
        </div>

        <div style={{ flex: 1 }}>
          <SelectedListingDetails listing={selectedListing} />
        </div>
      </div>
    </div>
  );
}