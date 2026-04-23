import type { ClienteNotification } from "../../types/cliente.types";

interface ClienteNotificationItemProps {
  notification: ClienteNotification;
  onMarkRead: (id: string) => void;
}

export default function ClienteNotificationItem({
  notification,
  onMarkRead,
}: ClienteNotificationItemProps) {
  const {
    id,
    title,
    description,
    time,
    isRead,
    isNew,
    actionLabel,
    icon,
    accentColor,
  } = notification;

  const getAccentColorClass = () => {
    switch (accentColor) {
      case "tertiary":
        return "bg-tertiary";
      case "primary":
        return "bg-primary";
      case "error":
        return "bg-error";
      case "muted":
        return "bg-outline-variant";
      default:
        return "bg-outline-variant";
    }
  };

  const getIconContainerClass = () => {
    if (isRead) return "bg-surface-container-highest text-on-surface-variant";
    switch (accentColor) {
      case "tertiary":
      case "primary":
        return "bg-primary-container/20 text-primary";
      case "error":
        return "bg-error-container/10 text-error";
      case "muted":
        return "bg-surface-container-highest text-on-surface-variant";
      default:
        return "bg-surface-container-highest text-on-surface-variant";
    }
  };

  if (!isRead) {
    return (
      <div
        onClick={() => onMarkRead(id)}
        className="group relative bg-surface-container-high hover:bg-surface-bright p-5 md:p-6 rounded-lg transition-all duration-300 overflow-hidden flex flex-col md:flex-row gap-5 items-start cursor-pointer"
      >
        {/* Barra izquierda */}
        <div
          className={`absolute top-0 left-0 w-1.5 h-full ${getAccentColorClass()}`}
        />

        {/* Ícono container */}
        <div className={`p-3 rounded-full flex-shrink-0 ${getIconContainerClass()}`}>
          <span
            className="material-symbols-outlined text-2xl"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            {icon}
          </span>
        </div>

        {/* Contenido */}
        <div className="flex-1 space-y-1.5 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h4 className="text-base font-bold font-headline text-on-surface">
              {title}
            </h4>
            {isNew && (
              <span className="text-xs font-medium text-tertiary bg-tertiary/10 px-3 py-1 rounded-full uppercase tracking-widest">
                New
              </span>
            )}
          </div>
          <p className="text-on-surface-variant text-sm leading-relaxed">
            {description}
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-outline">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">schedule</span>
              {time}
            </span>
            {actionLabel && (
              <button className="ml-auto bg-surface-container-highest text-on-surface px-4 py-1.5 rounded-full hover:bg-surface-bright transition-colors font-semibold text-xs">
                {actionLabel}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Item leído
  return (
    <div className="group relative bg-surface-container hover:bg-surface-container-high p-5 md:p-6 rounded-lg transition-all duration-300 opacity-80 flex flex-col md:flex-row gap-5 items-start">
      {/* Ícono container */}
      <div className="bg-surface-container-highest text-on-surface-variant p-3 rounded-full flex-shrink-0">
        <span className="material-symbols-outlined text-2xl">{icon}</span>
      </div>

      {/* Contenido */}
      <div className="flex-1 space-y-1.5 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <h4 className="text-base font-bold font-headline text-on-surface">
            {title}
          </h4>
          <span className="text-xs font-medium text-outline-variant uppercase tracking-widest">
            Read
          </span>
        </div>
        <p className="text-on-surface-variant text-sm leading-relaxed">
          {description}
        </p>
        <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-outline">
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">schedule</span>
            {time}
          </span>
          {actionLabel && (
            <button className="ml-auto bg-surface-container-highest text-on-surface px-4 py-1.5 rounded-full hover:bg-surface-bright transition-colors font-semibold text-xs">
              {actionLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
