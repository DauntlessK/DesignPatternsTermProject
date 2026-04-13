import { useState } from "react";
import messageService from "../services/messageService";

export default function BookingMessageBox({ bookingId }) {
  const [messageText, setMessageText] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  const handleSend = async () => {
    try {
      const result = await messageService.sendBookingMessage(bookingId, messageText);
      setStatusMessage(`${result.message}`);
      setMessageText("");
    } catch (err) {
      setStatusMessage(
        err?.response?.data?.message || "Failed to send message"
      );
    }
  };

  return (
    <div style={{ marginTop: "15px" }}>
      <label style={{ display: "block", marginBottom: "6px" }}>
        Send Message
      </label>

      <textarea
        value={messageText}
        onChange={(e) => setMessageText(e.target.value)}
        placeholder="Type your message here..."
        rows={3}
      />

      <button className="button" onClick={handleSend}>
        Send
      </button>

      <p>{statusMessage}</p>
    </div>
  );
}