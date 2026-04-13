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
    <div>
      <h1>Notifications</h1>

      {notifications.length === 0 ? (
        <p>No notifications yet.</p>
      ) : (
        notifications.map((notification) => (
          <div
            key={notification.id}
            style={{ border: "1px solid gray", padding: "10px", marginBottom: "10px" }}
          >
            <p>{notification.message}</p>
          </div>
        ))
      )}
    </div>
  );
}