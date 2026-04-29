import { useState, useEffect, useCallback } from "react";
import api from "../lib/api";
import type { NotificationResponse } from "../types/notification.types";

export function useNotifications() {
  const [notifications, setNotifications] = useState<NotificationResponse[]>(
    [],
  );
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(() => {
    setLoading(true);

    api
      .get<NotificationResponse[]>("/api/notifications")
      .then((res) => setNotifications(res.data))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const markAsRead = (id: number) => {
    api.put(`/api/notifications/${id}/read`).then(() => {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
      );
    });
  };

  const markAllAsRead = () => {
    api.put("/api/notifications/read-all").then(() => {
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    });
  };

  return { notifications, loading, markAsRead, markAllAsRead };
}
