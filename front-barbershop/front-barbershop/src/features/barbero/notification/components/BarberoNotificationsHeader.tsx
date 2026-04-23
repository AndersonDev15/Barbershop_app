interface BarberoNotificationsHeaderProps {
  onMarkAllRead: () => void;
}

export default function BarberoNotificationsHeader({
  onMarkAllRead,
}: BarberoNotificationsHeaderProps) {
  return (
    <div className="flex items-end justify-between mb-10">
      {/* Izquierda */}
      <div>
        <span className="text-xs uppercase tracking-[0.2em] text-primary mb-2 font-bold block">
          History & Updates
        </span>
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-on-surface font-headline">
          Notifications
        </h1>
      </div>

      {/* Derecha */}
      <button
        onClick={onMarkAllRead}
        className="flex items-center gap-2 bg-surface-container-highest text-on-surface px-4 md:px-6 py-3 rounded-full hover:bg-surface-bright transition-all active:scale-95 text-sm font-medium shadow-sm"
      >
        <span className="material-symbols-outlined text-xl">done_all</span>
        <span className="hidden md:inline">Mark all as read</span>
        <span className="md:hidden">Mark all</span>
      </button>
    </div>
  );
}
