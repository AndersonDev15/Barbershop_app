import type { ClienteNotification } from "../../types/cliente.types";
import ClienteNotificationItem from "./ClienteNotificationItem";

interface ClienteNotificationsListProps {
  notifications: ClienteNotification[];
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
}

export default function ClienteNotificationsList({
  notifications,
  onMarkRead,
  onMarkAllRead,
}: ClienteNotificationsListProps) {
  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-20 h-20 bg-surface-container-low rounded-full flex items-center justify-center mb-5">
          <span
            className="material-symbols-outlined text-4xl text-outline-variant"
            style={{ fontVariationSettings: "'wght' 200" }}
          >
            notifications_off
          </span>
        </div>
        <h3 className="text-xl font-bold font-headline text-on-surface-variant">
          No notifications yet
        </h3>
        <p className="text-outline mt-2 text-sm max-w-xs">
          We'll alert you here when your grooming experience has updates.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div className="flex flex-col">
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-on-surface-variant mb-2">
            Account Activity
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold font-headline text-on-surface tracking-tighter">
            Notifications
          </h2>
        </div>

        <button
          onClick={onMarkAllRead}
          className="bg-surface-container-highest text-on-surface hover:bg-surface-bright px-6 py-3 rounded-full text-sm font-semibold flex items-center gap-2 active:scale-95 transition-all shadow-sm"
        >
          <span className="material-symbols-outlined text-base">done_all</span>
          Mark all as read
        </button>
      </header>

      <div className="space-y-4">
        {notifications.map((notification) => (
          <ClienteNotificationItem
            key={notification.id}
            notification={notification}
            onMarkRead={onMarkRead}
          />
        ))}
      </div>
    </div>
  );
}
