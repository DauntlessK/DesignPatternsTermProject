class CarListingBuilder {
  constructor() {
    this.listing = {};
  }

  setOwner(owner) {
    this.listing.owner = owner;
    return this;
  }

  setMake(make) {
    this.listing.make = make;
    return this;
  }

  setModel(model) {
    this.listing.model = model;
    return this;
  }

  setYear(year) {
    this.listing.year = year;
    return this;
  }

  setMileage(mileage) {
    this.listing.mileage = mileage;
    return this;
  }

  setPickupLocation(pickupLocation) {
    this.listing.pickupLocation = pickupLocation;
    return this;
  }

  setPricePerDay(pricePerDay) {
    this.listing.pricePerDay = pricePerDay;
    return this;
  }

  setDescription(description) {
    this.listing.description = description;
    return this;
  }

  setCarType(carType) {
  this.listing.carType = carType;
  return this;
}

setIsActive(isActive) {
  this.listing.isActive = isActive;
  return this;
}

setImageUrl(imageUrl) {
  this.listing.imageUrl = imageUrl;
  return this;
}

  build() {
    return { ...this.listing };
  }
}

module.exports = CarListingBuilder;