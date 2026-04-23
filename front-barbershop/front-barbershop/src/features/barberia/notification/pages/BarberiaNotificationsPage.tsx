import { useState } from "react";
import Sidebar from "../../common/components/Sidebar";
import Topbar from "../../common/components/Topbar";
import BarberoNotificationsHeader from "../../../barbero/notification/components/BarberoNotificationsHeader";
import BarberoNotificationsList from "../../../barbero/notification/components/BarberoNotificationsList";
import { useNotifications } from "../../../../hooks/useNotifications";
import type { Notification } from "../../../barbero/types/barbero.types";
import {
  getNotificationMeta,
  formatNotificationTime,
  isToday,
} from "../../../../utils/notificationMapper";

export default function BarberiaNotificationsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const {
    notifications: rawNotifications,
    loading,
    markAsRead,
    markAllAsRead,
  } = useNotifications();

  const mapped: Notification[] = [...rawNotifications]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .map((n) => {
      const meta = getNotificationMeta(n.type);
      return {
        id: n.id.toString(),
        title: n.title,
        description: n.message,
        time: formatNotificationTime(n.createdAt),
        category: meta.category,
        isRead: n.read,
        isNew: !n.read,
        icon: meta.icon,
        accentColor: meta.accentColor,
      };
    });

  const todayNotifications = mapped.filter((n) =>
    isToday(
      rawNotifications.find((r) => r.id.toString() === n.id)?.createdAt ?? "",
    ),
  );
  const yesterdayNotifications = mapped.filter(
    (n) =>
      !isToday(
        rawNotifications.find((r) => r.id.toString() === n.id)?.createdAt ?? "",
      ),
  );

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#131313]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#f2ca50]"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#131313] text-[#d0c5af]">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex flex-col flex-1 overflow-hidden w-full min-w-0">
        <Topbar
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen(true)}
          pageTitle="Notifications"
        />

        {/* Contenido */}
        <main className="flex-1 overflow-y-auto bg-[#131313] p-4 md:p-8 lg:p-10">
          <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            <BarberoNotificationsHeader onMarkAllRead={markAllAsRead} />
            <BarberoNotificationsList
              todayNotifications={todayNotifications}
              yesterdayNotifications={yesterdayNotifications}
              onMarkRead={(id) => markAsRead(Number(id))}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
