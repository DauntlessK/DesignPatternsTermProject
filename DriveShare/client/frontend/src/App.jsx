import { Routes, Route, Link } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CreateListingPage from "./pages/CreateListingPage";
import ListingsPage from "./pages/ListingsPage";
import ManageListingsPage from "./pages/ManageListingsPage";
import SearchPage from "./pages/SearchPage";
import BookListingPage from "./pages/BookListingPage";
import MyBookingsPage from "./pages/MyBookingsPage";
import NotificationsPage from "./pages/NotificationsPage";

import { useAuth } from "./context/AuthContext";
import logo from "./assets/logo.png";

function HomePage() {
  return (
    <div className="container">
      <div className="card" style={{ textAlign: "center", padding: "40px" }}>
        <h1>DriveShare</h1>
        <p style={{ fontSize: "18px", marginTop: "10px" }}>
          Rent cars directly from owners. Simple, fast, and flexible.
        </p>
      </div>
    </div>
  );
}

export default function App() {
  const { user, logout, loading } = useAuth();

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <nav className="navbar">
        <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          
          {/* LEFT: Logo */}
          <div style={{ display: "flex", alignItems: "center" }}>
            <img src={logo} alt="logo" style={{ height: "40px", marginRight: "10px" }} />
            <strong>DriveShare</strong>
          </div>

          {/* CENTER: Links */}
          <div className="nav-links">
            <Link to="/">Home</Link>

            {!user && (
              <>
                <Link to="/login">Login</Link>
                <Link to="/search">Search</Link>
              </>
            )}

            {user?.role === "owner" && (
              <>
                <Link to="/create-listing" style={{ marginRight: "10px" }}>Create Listing</Link>
                <Link to="/manage-listings" style={{ marginRight: "10px" }}>Manage Listings</Link>
                <Link to="/search" style={{ marginRight: "10px" }}>Search</Link>
                <Link to="/my-bookings" style={{ marginRight: "10px" }}>My Bookings</Link>
              </>
            )}

            {user?.role === "renter" && (
              <>
                <Link to="/search">Search</Link>
                <Link to="/my-bookings">My Bookings</Link>
                <Link to="/notifications">Notifications</Link>
              </>
            )}
          </div>

          {/* RIGHT: User */}
          <div>
            {user && (
              <>
                <span style={{ marginRight: "10px" }}>
                  {user.name}
                </span>
                <button className="button" onClick={logout}>Logout</button>
              </>
            )}
          </div>

        </div>
      </nav>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/listings" element={<ListingsPage />} />
        <Route path="/create-listing" element={<CreateListingPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/book/:id" element={<BookListingPage />} />
        <Route path="/my-bookings" element={<MyBookingsPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/manage-listings" element={<ManageListingsPage />} />

      </Routes>
    </div>
  );
}