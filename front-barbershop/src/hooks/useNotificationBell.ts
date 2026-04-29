import { useState, useEffect, useCallback } from "react";
import api from "../lib/api";
import type { NotificationResponse } from "../types/notification.types";

export function useNotificationBell() {
  const [notifications, setNotifications] = useState<NotificationResponse[]>(
    [],
  );
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchAll = useCallback(() => {
    api
      .get<NotificationResponse[]>("/api/notifications")
      .then((res) => {
        setNotifications(res.data.slice(0, 3));
        setUnreadCount(res.data.filter((n) => !n.read).length);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const markAsRead = (id: number) => {
    api.put(`/api/notifications/${id}/read`).then(() => {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    });
  };

  return { notifications, unreadCount, markAsRead };
}
