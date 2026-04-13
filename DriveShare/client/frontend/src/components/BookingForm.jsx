import { useState } from "react";
import bookingService from "../services/bookingService";

export default function BookingForm({ listing }) {
  const [form, setForm] = useState({
    startDate: "",
    endDate: "",
  });

  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await bookingService.create({
        listingId: listing.id,
        startDate: form.startDate,
        endDate: form.endDate,
      });

      setMessage(
        `Booking confirmed. Total: $${result.booking.totalPrice}`
      );
    } catch (err) {
      setMessage(
        err?.response?.data?.message || "Failed to create booking"
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ border: "1px solid gray", padding: "10px" }}>
      <h3>Book This Car</h3>

      <p style={{ fontStyle: "italic", fontSize: "0.9rem" }}>
        Pickup is 8:00 AM on the first day booked, and return is
        required by 8:00 PM on the last day booked.
      </p>

      <label>Start Date</label>
      <br />
      <input
        type="date"
        value={form.startDate}
        onChange={(e) =>
          setForm({ ...form, startDate: e.target.value })
        }
      />

      <br />
      <br />

      <label>End Date</label>
      <br />
      <input
        type="date"
        value={form.endDate}
        onChange={(e) =>
          setForm({ ...form, endDate: e.target.value })
        }
      />

      <br />
      <br />

      <button type="submit">Confirm Booking</button>
      <p>{message}</p>
    </form>
  );
}