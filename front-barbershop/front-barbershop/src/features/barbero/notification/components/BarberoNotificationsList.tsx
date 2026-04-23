import type { Notification } from "../../types/barbero.types";
import BarberoNotificationItem from "./BarberoNotificationItem";

interface BarberoNotificationsListProps {
  todayNotifications: Notification[];
  yesterdayNotifications: Notification[];
  onMarkRead: (id: string) => void;
}

export default function BarberoNotificationsList({
  todayNotifications,
  yesterdayNotifications,
  onMarkRead,
}: BarberoNotificationsListProps) {
  return (
    <div className="space-y-8">
      {/* Grupo "Today" */}
      <div className="mb-8">
        <h3 className="text-sm text-on-surface-variant font-semibold mb-4 px-2">
          Today
        </h3>
        <div className="space-y-3">
          {todayNotifications.map((n) => (
            <BarberoNotificationItem
              key={n.id}
              notification={n}
              onMarkRead={onMarkRead}
            />
          ))}
          {todayNotifications.length === 0 && (
            <p className="text-sm text-on-surface-variant/50 italic px-2">
              No new notifications today.
            </p>
          )}
        </div>
      </div>

      {/* Grupo "Yesterday" */}
      <div>
        <h3 className="text-sm text-on-surface-variant font-semibold mb-4 px-2">
          Yesterday
        </h3>
        <div className="space-y-3 opacity-80">
          {yesterdayNotifications.map((n) => (
            <BarberoNotificationItem
              key={n.id}
              notification={n}
              onMarkRead={onMarkRead}
            />
          ))}
          {yesterdayNotifications.length === 0 && (
            <p className="text-sm text-on-surface-variant/50 italic px-2">
              No notifications from yesterday.
            </p>
          )}
        </div>
      </div>

      {/* Botón "View older notifications" */}
      <div className="mt-12 flex justify-center">
        <button className="text-primary font-bold flex items-center gap-2 hover:underline transition-all text-sm group">
          <span>View older notifications</span>
          <span className="material-symbols-outlined group-hover:translate-y-0.5 transition-transform">
            keyboard_arrow_down
          </span>
        </button>
      </div>
    </div>
  );
}
