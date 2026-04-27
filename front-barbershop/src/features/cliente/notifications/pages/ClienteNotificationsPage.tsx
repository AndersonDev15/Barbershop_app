import ClienteSidebar from "../../common/components/ClienteSidebar";
import ClienteTopBar from "../../common/components/ClienteTopBar";
import ClienteNotificationsList from "../components/ClienteNotificationsList";
import { useNotifications } from "../../../../hooks/useNotifications";
import { useMemo } from "react";
import type { ClienteNotification } from "../../types/cliente.types";
import {
  getNotificationMeta,
  formatNotificationTime,
} from "../../../../utils/notificationMapper";

export default function ClienteNotificationsPage() {
  const {
    notifications: rawNotifications,
    loading,
    markAsRead,
    markAllAsRead,
  } = useNotifications();

  const mapped: ClienteNotification[] = rawNotifications.map((n) => {
    const meta = getNotificationMeta(n.type);
    return {
      id: n.id.toString(),
      title: n.title,
      description: n.message,
      time: formatNotificationTime(n.createdAt),
      category: meta.clienteCategory,
      isRead: n.read,
      isNew: !n.read,
      actionLabel: "",
      icon: meta.icon,
      accentColor: meta.accentColor,
    };
  });

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-surface">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-surface text-on-surface">
      <ClienteSidebar />
      <div className="flex flex-col flex-1 overflow-hidden w-full min-w-0">
        <ClienteTopBar />
        <main className="flex-1 overflow-y-auto bg-surface-dim p-4 sm:p-6 md:p-8 lg:p-10 custom-scrollbar">
          <ClienteNotificationsList
            notifications={mapped}
            onMarkRead={(id) => markAsRead(Number(id))}
            onMarkAllRead={markAllAsRead}
          />
        </main>
      </div>
    </div>
  );
}
