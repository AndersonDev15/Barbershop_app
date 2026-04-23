import type { NotificationType } from "../types/notification.types";
import type { NotificationCategory } from "../features/barbero/types/barbero.types";
import type { ClienteNotificationCategory } from "../features/cliente/types/cliente.types";

export function getNotificationMeta(type: NotificationType): {
  icon: string;
  accentColor: "primary" | "tertiary" | "error" | "muted";
  category: NotificationCategory;
  clienteCategory: ClienteNotificationCategory;
} {
  switch (type) {
    case "PAYMENT_CONFIRMED":
      return {
        icon: "payments",
        accentColor: "primary",
        category: "transaction",
        clienteCategory: "payment_confirmed",
      };
    case "APPOINTMENT_SCHEDULED":
      return {
        icon: "event_available",
        accentColor: "tertiary",
        category: "calendar",
        clienteCategory: "reservation_confirmed",
      };
    case "APPOINTMENT_CANCELLED":
      return {
        icon: "event_busy",
        accentColor: "error",
        category: "cancellation",
        clienteCategory: "reservation_cancelled",
      };
    case "APPOINTMENT_REMINDER":
      return {
        icon: "alarm",
        accentColor: "tertiary",
        category: "calendar",
        clienteCategory: "reservation_confirmed",
      };
    case "INVITATION_RECEIVED":
      return {
        icon: "mail",
        accentColor: "primary",
        category: "transaction",
        clienteCategory: "promotion",
      };
    default:
      return {
        icon: "notifications",
        accentColor: "muted",
        category: "calendar",
        clienteCategory: "promotion",
      };
  }
}

export function formatNotificationTime(createdAt: string): string {
  const date = new Date(createdAt);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);

  if (diffMins < 1) return "Ahora";
  if (diffMins < 60) return `Hace ${diffMins} min`;
  if (diffHours < 24)
    return date.toLocaleTimeString("es-CO", {
      hour: "2-digit",
      minute: "2-digit",
    });
  return date.toLocaleDateString("es-CO", { day: "numeric", month: "short" });
}

export function isToday(createdAt: string): boolean {
  const date = new Date(createdAt);
  const now = new Date();
  return date.toDateString() === now.toDateString();
}
