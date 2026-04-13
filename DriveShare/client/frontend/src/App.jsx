import { Routes, Route, Link } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import CreateListingPage from "./pages/CreateListingPage";
import ListingsPage from "./pages/ListingsPage";
import SearchPage from "./pages/SearchPage";
import BookListingPage from "./pages/BookListingPage";
import MyBookingsPage from "./pages/MyBookingsPage";
import { useAuth } from "./context/AuthContext";

function HomePage() {
  return <h2>Welcome to DriveShare</h2>;
}

export default function App() {
  const { user, logout, loading } = useAuth();

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <nav style={{ marginBottom: "20px" }}>
        <Link to="/" style={{ marginRight: "10px" }}>Home</Link>
        <Link to="/register" style={{ marginRight: "10px" }}>Register</Link>
        <Link to="/login" style={{ marginRight: "10px" }}>Login</Link>
        <Link to="/create-listing" style={{ marginRight: "10px" }}>Create Listing</Link>
        <Link to="/search" style={{ marginRight: "10px" }}>Search</Link>
        <Link to="/my-bookings" style={{ marginRight: "10px" }}>My Bookings</Link>

        {user && (
          <>
            <span style={{ marginRight: "10px" }}>
              Logged in as: {user.name} ({user.role})
            </span>
            <button onClick={logout}>Logout</button>
          </>
        )}
      </nav>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/listings" element={<ListingsPage />} />
        <Route path="/create-listing" element={<CreateListingPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/book/:id" element={<BookListingPage />} />
        <Route path="/my-bookings" element={<MyBookingsPage />} />
      </Routes>
    </div>
  );
}