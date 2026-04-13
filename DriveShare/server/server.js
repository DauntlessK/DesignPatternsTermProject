const express = require("express");
const cors = require("cors");
const sessionManager = require("./SessionManager");
const CarListingBuilder = require("./CarListingBuilder");

const app = express();

app.use(cors());
app.use(express.json());

const users = [
  {
    id: 1,
    name: "Owner Admin",
    email: "owner@driveshare.com",
    password: "owner123",
    role: "owner",
    securityQuestions: [
      { question: "Favorite color?", answer: "blue" },
      { question: "First car?", answer: "ford" },
      { question: "Birth city?", answer: "detroit" },
    ],
  },
  {
    id: 2,
    name: "Test Renter",
    email: "renter@driveshare.com",
    password: "renter123",
    role: "renter",
    securityQuestions: [
      { question: "Favorite color?", answer: "green" },
      { question: "First pet?", answer: "max" },
      { question: "Birth city?", answer: "chicago" },
    ],
  },
];

const listings = [];
const bookings = [];
const watchRequests = [];
const notifications = [];

// Route: GET / - Root
app.get("/", (req, res) => {
  res.send("DriveShare API");
});

// Route: GET /api/health - Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Route: POST /api/auth/register - Register new user
app.post("/api/auth/register", (req, res) => {
  const { name, email, password, role, securityQuestions } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  if (!securityQuestions || securityQuestions.length !== 3) {
    return res.status(400).json({ message: "You must provide 3 security questions." });
  }

  const existingUser = users.find((u) => u.email === email);
  if (existingUser) {
    return res.status(400).json({ message: "Email already registered." });
  }

  const newUser = {
    id: Math.max(...users.map((u) => u.id), 0) + 1,
    name,
    email,
    password,
    role,
    securityQuestions,
  };

  users.push(newUser);

  res.status(201).json({
    message: "Registration successful.",
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    },
  });
});

// Route: POST /api/auth/login - User login
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;

  const user = users.find((u) => u.email === email && u.password === password);

  if (!user) {
    return res.status(401).json({ message: "Invalid email or password." });
  }

  sessionManager.login({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  });

  res.json({
    message: "Login successful.",
    user: sessionManager.getCurrentUser(),
  });
});

// Route: POST /api/auth/logout - User logout
app.post("/api/auth/logout", (req, res) => {
  sessionManager.logout();
  res.json({ message: "Logged out successfully." });
});

// Route: GET /api/auth/me - Get current authenticated user
app.get("/api/auth/me", (req, res) => {
  const user = sessionManager.getCurrentUser();

  if (!user) {
    return res.status(401).json({ message: "Not logged in." });
  }

  res.json({ user });
});

// Route: POST /api/listings - Create a new listing (owners only)
app.post("/api/listings", (req, res) => {
  const currentUser = sessionManager.getCurrentUser();

  if (!currentUser) {
    return res.status(401).json({ message: "You must be logged in." });
  }

  if (currentUser.role !== "owner") {
    return res.status(403).json({ message: "Only owners can create listings." });
  }

  const {
    make,
    model,
    year,
    mileage,
    pickupLocation,
    pricePerDay,
    description,
    carType,
    imageUrl,
  } = req.body;

  if (!make || !model || !year || !mileage || !pickupLocation || !pricePerDay || !carType) {
    return res.status(400).json({ message: "Missing required listing fields." });
 }

  const listing = new CarListingBuilder()
  .setOwner({
    id: currentUser.id,
    name: currentUser.name,
    email: currentUser.email,
  })
  .setMake(make)
  .setModel(model)
  .setYear(year)
  .setMileage(mileage)
  .setPickupLocation(pickupLocation)
  .setPricePerDay(pricePerDay)
  .setCarType(carType)
  .setImageUrl(imageUrl || "")
  .setDescription(description || "")
  .setIsActive(true)
  .build();

  listing.id = listings.length + 1;
  listings.push(listing);

  res.status(201).json({
    message: "Listing created successfully.",
    listing,
  });
});

// Route: GET /api/listings - List all listings (optionally include inactive)
app.get("/api/listings", (req, res) => {
  const includeInactive = req.query.includeInactive === "true";
  const visibleListings = includeInactive
    ? listings
    : listings.filter((listing) => listing.isActive !== false);

  res.json({ listings: visibleListings });
});

// Route: GET /api/listings/:id - Get listing details by id
app.get("/api/listings/:id", (req, res) => {
  const listingId = Number(req.params.id);
  const listing = listings.find((l) => l.id === listingId);

  if (!listing) {
    return res.status(404).json({ message: "Listing not found." });
  }

  res.json({ listing });
});

function attachWatcher(listingId, watcher) {
  watchRequests.push({
    id: watchRequests.length + 1,
    listingId,
    watcher,
  });
}

function notifyWatchers(listing) {
  const relevantWatches = watchRequests.filter(
    (watch) => watch.listingId === listing.id
  );

  relevantWatches.forEach((watch) => {
    if (Number(listing.pricePerDay) <= Number(watch.watcher.targetMaxPrice)) {
      notifications.push({
        id: notifications.length + 1,
        userId: watch.watcher.userId,
        message: `${listing.year} ${listing.make} ${listing.model} is now available at $${listing.pricePerDay}/day, which matches your watch target.`,
        listingId: listing.id,
      });
    }
  });
}

// overlap helper
function hasOverlap(newStart, newEnd, existingBookingsForListing) {
  return existingBookingsForListing.some((booking) => {
    if (booking.status !== "CONFIRMED") return false;

    const existingStart = new Date(booking.startDate);
    existingStart.setHours(8, 0, 0, 0);

    const existingEnd = new Date(booking.endDate);
    existingEnd.setHours(20, 0, 0, 0);

    return newStart < existingEnd && newEnd > existingStart;
  });
}

// Route: POST /api/bookings - Create a booking (renters only)
app.post("/api/bookings", (req, res) => {
  const currentUser = sessionManager.getCurrentUser();

  if (!currentUser) {
    return res.status(401).json({ message: "You must be logged in." });
  }

  if (currentUser.role !== "renter") {
    return res.status(403).json({ message: "Only renters can make bookings." });
  }

  const { listingId, startDate, endDate } = req.body;

  if (!listingId || !startDate || !endDate) {
    return res.status(400).json({ message: "Missing booking fields." });
  }

  const listing = listings.find((l) => l.id === Number(listingId));
  if (!listing) {
    return res.status(404).json({ message: "Listing not found." });
  }

  const start = new Date(startDate);
  start.setHours(8, 0, 0, 0);

  const end = new Date(endDate);
  end.setHours(20, 0, 0, 0);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return res.status(400).json({ message: "Invalid start or end date." });
  }

  if (end < start) {
    return res.status(400).json({ message: "End date must be the same day or after the start date." });
  }

  const bookingsForListing = bookings.filter(
    (b) => b.listingId === Number(listingId)
  );

  if (hasOverlap(start, end, bookingsForListing)) {
    return res.status(400).json({
      message: "This car is already booked for overlapping dates.",
    });
  }

  const msPerDay = 1000 * 60 * 60 * 24;
  const days = Math.floor((new Date(endDate) - new Date(startDate)) / msPerDay) + 1;
  const totalPrice = days * Number(listing.pricePerDay);

  const booking = {
    id: bookings.length + 1,
    listingId: Number(listingId),
    listingSummary: `${listing.year} ${listing.make} ${listing.model}`,
    renter: {
        id: currentUser.id,
        name: currentUser.name,
        email: currentUser.email,
    },
    owner: listing.owner,
    startDate,
    endDate,
    totalPrice,
    status: "PENDING",
    isPaid: false,
};

  bookings.push(booking);

  res.status(201).json({
    message: "Booking created successfully.",
    booking,
  });
});

// Route: GET /api/bookings - Get bookings for current user
app.get("/api/bookings", (req, res) => {
  const currentUser = sessionManager.getCurrentUser();

  if (!currentUser) {
    return res.status(401).json({ message: "You must be logged in." });
  }

  let filteredBookings = [];

  if (currentUser.role === "renter") {
    filteredBookings = bookings.filter((b) => b.renter.id === currentUser.id);
  } else if (currentUser.role === "owner") {
    filteredBookings = bookings.filter((b) => b.owner.id === currentUser.id);
  }

  res.json({ bookings: filteredBookings });
});

// Route: POST /api/watch - Add a watch request for a listing (renters only)
app.post("/api/watch", (req, res) => {
  const currentUser = sessionManager.getCurrentUser();

  if (!currentUser) {
    return res.status(401).json({ message: "You must be logged in." });
  }

  if (currentUser.role !== "renter") {
    return res.status(403).json({ message: "Only renters can watch listings." });
  }

  const { listingId, targetMaxPrice } = req.body;

  if (!listingId || !targetMaxPrice) {
    return res.status(400).json({ message: "Missing watch request fields." });
  }

  const listing = listings.find((l) => l.id === Number(listingId));
  if (!listing) {
    return res.status(404).json({ message: "Listing not found." });
  }

  const existingWatch = watchRequests.find(
    (w) =>
      w.listingId === Number(listingId) &&
      w.watcher.userId === currentUser.id
  );

  if (existingWatch) {
    return res.status(400).json({ message: "You are already watching this listing." });
  }

  attachWatcher(Number(listingId), {
    userId: currentUser.id,
    userName: currentUser.name,
    userEmail: currentUser.email,
    targetMaxPrice,
  });

  res.status(201).json({ message: "Watch added successfully." });
});

// Route: GET /api/notifications - Get notifications for current user
app.get("/api/notifications", (req, res) => {
  const currentUser = sessionManager.getCurrentUser();

  if (!currentUser) {
    return res.status(401).json({ message: "You must be logged in." });
  }

  const userNotifications = notifications.filter(
    (n) => n.userId === currentUser.id
  );

  res.json({ notifications: userNotifications });
});

// Route: PUT /api/listings/:id - Update listing (owners only)
app.put("/api/listings/:id", (req, res) => {
  const currentUser = sessionManager.getCurrentUser();

  if (!currentUser) {
    return res.status(401).json({ message: "You must be logged in." });
  }

  if (currentUser.role !== "owner") {
    return res.status(403).json({ message: "Only owners can update listings." });
  }

  const listingId = Number(req.params.id);
  const listing = listings.find((l) => l.id === listingId);

  if (!listing) {
    return res.status(404).json({ message: "Listing not found." });
  }

  if (listing.owner.id !== currentUser.id) {
    return res.status(403).json({ message: "You can only edit your own listings." });
  }

  const { pricePerDay } = req.body;

  if (!pricePerDay) {
    return res.status(400).json({ message: "Price is required." });
  }

  listing.pricePerDay = pricePerDay;

  notifyWatchers(listing);

  res.json({
    message: "Listing updated successfully.",
    listing,
  });
});

// Route: PUT /api/listings/:id/toggle-active - Toggle listing active status (owners only)
app.put("/api/listings/:id/toggle-active", (req, res) => {
  const currentUser = sessionManager.getCurrentUser();

  if (!currentUser) {
    return res.status(401).json({ message: "You must be logged in." });
  }

  if (currentUser.role !== "owner") {
    return res.status(403).json({ message: "Only owners can change listing status." });
  }

  const listingId = Number(req.params.id);
  const listing = listings.find((l) => l.id === listingId);

  if (!listing) {
    return res.status(404).json({ message: "Listing not found." });
  }

  if (listing.owner.id !== currentUser.id) {
    return res.status(403).json({ message: "You can only manage your own listings." });
  }

  listing.isActive = !listing.isActive;

  res.json({
    message: listing.isActive
      ? "Listing reactivated successfully."
      : "Listing deactivated successfully.",
    listing,
  });
});

// Route: PUT /api/bookings/:id/pay - Mark booking as paid (renters only)
app.put("/api/bookings/:id/pay", (req, res) => {
  const currentUser = sessionManager.getCurrentUser();

  if (!currentUser) {
    return res.status(401).json({ message: "You must be logged in." });
  }

  if (currentUser.role !== "renter") {
    return res.status(403).json({ message: "Only renters can make payments." });
  }

  const bookingId = Number(req.params.id);
  const booking = bookings.find((b) => b.id === bookingId);

  if (!booking) {
    return res.status(404).json({ message: "Booking not found." });
  }

  if (booking.renter.id !== currentUser.id) {
    return res.status(403).json({ message: "You can only pay for your own bookings." });
  }

  if (booking.isPaid) {
    return res.status(400).json({ message: "This booking has already been paid." });
  }

  booking.isPaid = true;

  res.json({
    message: "Payment completed successfully.",
    booking,
  });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});