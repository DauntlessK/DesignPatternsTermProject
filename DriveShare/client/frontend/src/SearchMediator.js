class SearchMediator {
  constructor(setFilteredListings, setSelectedListing) {
    this.setFilteredListings = setFilteredListings;
    this.setSelectedListing = setSelectedListing;
  }

  handleFiltersChanged(allListings, filters) {
    const filtered = allListings.filter((listing) => {
      const matchesLocation =
        !filters.location ||
        listing.pickupLocation.toLowerCase().includes(filters.location.toLowerCase());

      const matchesMake =
        !filters.make ||
        listing.make.toLowerCase().includes(filters.make.toLowerCase());

      const matchesMaxPrice =
        !filters.maxPrice ||
        Number(listing.pricePerDay) <= Number(filters.maxPrice);

      return matchesLocation && matchesMake && matchesMaxPrice;
    });

    this.setFilteredListings(filtered);
    this.setSelectedListing(null);
  }

  handleListingSelected(listing) {
    this.setSelectedListing(listing);
  }
}

export default SearchMediator;