import { useEffect, useState } from "react";
import bookingService from "../services/bookingService";
import paymentService from "../services/paymentService";
import { useAuth } from "../context/AuthContext";

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");
  const [messages, setMessages] = useState({});
  const { user } = useAuth();

  const loadBookings = async () => {
    try {
      const result = await bookingService.getMyBookings();
      setBookings(result.bookings);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load bookings");
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handlePay = async (bookingId) => {
    try {
      const result = await paymentService.payBooking(bookingId);

      setMessages((prev) => ({
        ...prev,
        [bookingId]: `${result.message}`,
      }));

      loadBookings();
    } catch (err) {
      setMessages((prev) => ({
        ...prev,
        [bookingId]:
          err?.response?.data?.message || "Payment failed",
      }));
    }
  };

  const handleConfirm = async (bookingId) => {
    try {
      const result = await bookingService.confirmBooking(bookingId);

      setMessages((prev) => ({
        ...prev,
        [bookingId]: `${result.message}`,
      }));

      loadBookings();
    } catch (err) {
      setMessages((prev) => ({
        ...prev,
        [bookingId]:
          err?.response?.data?.message || "Failed to confirm booking",
      }));
    }
  };

  const handleDeny = async (bookingId) => {
    try {
      const result = await bookingService.denyBooking(bookingId);

      setMessages((prev) => ({
        ...prev,
        [bookingId]: `${result.message}`,
      }));

      loadBookings();
    } catch (err) {
      setMessages((prev) => ({
        ...prev,
        [bookingId]:
          err?.response?.data?.message || "Failed to deny booking",
      }));
    }
  };

  if (error) return <p>{error}</p>;

  return (
    <div className="container">
      <h1>My Bookings</h1>

      {bookings.length === 0 ? (
        <p>No bookings yet.</p>
      ) : (
        bookings.map((booking) => (
          <div key={booking.id} className="card">
            <h3>{booking.listingSummary}</h3>
            <p>Start Date: {booking.startDate}</p>
            <p>End Date: {booking.endDate}</p>
            <p>Total: ${booking.totalPrice}</p>
            <p>Status: {booking.status}</p>

            {user?.role === "renter" && (
              <>
                <p>
                  Payment Status: {booking.isPaid ? "Paid" : "Unpaid"}
                </p>

                {booking.status === "CONFIRMED" && !booking.isPaid && (
                  <button
                    className="button"
                    onClick={() => handlePay(booking.id)}
                  >
                    Pay ${booking.totalPrice}
                  </button>
                )}

                {booking.status === "PENDING" && (
                  <p>Waiting for owner approval.</p>
                )}

                {booking.status === "DENIED" && (
                  <p>This booking was denied.</p>
                )}
              </>
            )}

            {user?.role === "owner" && (
              <>
                <p>
                  Payment Status: {booking.isPaid ? "Paid" : "Not Paid Yet"}
                </p>

                {booking.status === "PENDING" && (
                  <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                    <button
                      className="button"
                      onClick={() => handleConfirm(booking.id)}
                    >
                      Confirm Booking
                    </button>

                    <button
                      className="button"
                      onClick={() => handleDeny(booking.id)}
                    >
                      Deny Booking
                    </button>
                  </div>
                )}
              </>
            )}

            <p>{messages[booking.id]}</p>
          </div>
        ))
      )}
    </div>
  );
}