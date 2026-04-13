import { useEffect, useState } from "react";
import bookingService from "../services/bookingService";

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const result = await bookingService.getMyBookings();
        setBookings(result.bookings);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load bookings");
      }
    };

    loadBookings();
  }, []);

  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>My Bookings</h1>

      {bookings.length === 0 ? (
        <p>No bookings yet.</p>
      ) : (
        bookings.map((booking) => (
          <div
            key={booking.id}
            style={{ border: "1px solid gray", padding: "10px", marginBottom: "10px" }}
          >
            <h3>{booking.listingSummary}</h3>
            <p>Start Date: {booking.startDate}</p>
            <p>End Date: {booking.endDate}</p>
            <p>Total: ${booking.totalPrice}</p>
            <p>Status: {booking.status}</p>
            <p>Renter: {booking.renter?.name}</p>
            <p>Owner: {booking.owner?.name}</p>
          </div>
        ))
      )}
    </div>
  );
}