// Page: NotificationsPage - shows current user's notifications
import { useEffect, useState } from "react";
import notificationService from "../services/notificationService";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const result = await notificationService.getAll();
        setNotifications(result.notifications);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load notifications");
      }
    };

    loadNotifications();
  }, []);

  if (error) return <p>{error}</p>;

  return (
    <div className="container">
      <h1>Notifications</h1>

      {notifications.length === 0 ? (
        <p>No notifications yet.</p>
      ) : (
        notifications.map((notification) => (
          <div
            key={notification.id}
            className="card"
          >
            <p style={{ marginBottom: "8px" }}>{notification.message}</p>
            <p style={{ fontSize: "0.9rem", color: "#6b7280" }}>
              {notification.createdAt || "No timestamp"}
            </p>
          </div>
        ))
      )}
    </div>
  );
}