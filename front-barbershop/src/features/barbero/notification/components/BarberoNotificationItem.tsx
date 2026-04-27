import type { Notification } from "../../types/barbero.types";

interface BarberoNotificationItemProps {
  notification: Notification;
  onMarkRead: (id: string) => void;
}

export default function BarberoNotificationItem({
  notification,
  onMarkRead,
}: BarberoNotificationItemProps) {
  const {
    id,
    title,
    description,
    time,
    category,
    isRead,
    isNew,
    icon,
    accentColor,
  } = notification;

  const getAccentStyles = () => {
    if (isRead) return "bg-surface-container-highest text-on-surface-variant";
    switch (accentColor) {
      case "primary":
        return "bg-primary-container/20 text-primary";
      case "tertiary":
        return "bg-tertiary/20 text-tertiary";
      case "error":
        return "bg-error-container/10 text-error";
      case "muted":
      default:
        return "bg-surface-container-highest text-on-surface-variant";
    }
  };

  const getHoverTitleColor = () => {
    if (isRead) return "text-on-surface";
    switch (accentColor) {
      case "tertiary":
        return "group-hover:text-tertiary";
      case "primary":
      default:
        return "group-hover:text-primary";
    }
  };

  if (!isRead) {
    return (
      <div
        onClick={() => onMarkRead(id)}
        className="group flex items-start gap-4 p-5 md:p-6 bg-surface-container-high rounded-lg hover:bg-surface-bright transition-all cursor-pointer relative overflow-hidden"
      >
        {/* Barra izquierda */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />

        {/* Ícono container */}
        <div
          className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center flex-shrink-0 ${getAccentStyles()}`}
        >
          <span className="material-symbols-outlined text-xl md:text-2xl">
            {icon}
          </span>
        </div>

        {/* Contenido */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-1 gap-2">
            <h4
              className={`text-base md:text-lg font-bold text-on-surface transition-colors ${getHoverTitleColor()}`}
            >
              {title}
            </h4>
            <span className="text-xs text-on-surface-variant font-medium whitespace-nowrap">
              {time}
            </span>
          </div>
          <p className="text-on-surface-variant text-sm leading-relaxed">
            {description}
          </p>

          <div className="mt-3 flex flex-wrap gap-2 items-center">
            <span
              className={`bg-surface-container-highest text-[10px] uppercase tracking-wider font-bold px-3 py-1 rounded-full ${
                accentColor === "primary"
                  ? "text-primary"
                  : accentColor === "tertiary"
                    ? "text-tertiary"
                    : accentColor === "error"
                      ? "text-error"
                      : "text-on-surface-variant"
              }`}
            >
              {category}
            </span>

            {isNew && (
              <span className="bg-tertiary/10 text-tertiary text-[10px] uppercase tracking-wider font-bold px-3 py-1 rounded-full flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-tertiary" />
                New
              </span>
            )}

            {accentColor === "primary" && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onMarkRead(id);
                }}
                className="ml-auto border border-primary text-primary hover:bg-primary hover:text-on-primary text-[10px] uppercase tracking-wider font-bold px-3 py-1 rounded-full transition-all flex items-center gap-1.5 active:scale-95"
              >
                <span className="material-symbols-outlined text-xs">
                  check_circle
                </span>
                Mark as Completed
              </button>
            )}
          </div>
        </div>

        {/* Dot indicador */}
        <div className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_8px_rgba(242,202,80,0.6)] self-center ml-2 flex-shrink-0" />
      </div>
    );
  }

  // Item leído
  return (
    <div className="group flex items-start gap-4 p-5 md:p-6 bg-surface-container-low rounded-lg hover:bg-surface-container transition-all cursor-pointer border border-transparent hover:border-outline-variant/10">
      {/* Ícono container */}
      <div className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center flex-shrink-0 bg-surface-container-highest text-on-surface-variant">
        <span className="material-symbols-outlined text-xl md:text-2xl">
          {icon}
        </span>
      </div>

      {/* Contenido */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start mb-1 gap-2">
          <h4 className="text-base md:text-lg font-bold text-on-surface">
            {title}
          </h4>
          <span className="text-xs text-on-surface-variant font-medium whitespace-nowrap">
            {time}
          </span>
        </div>
        <p className="text-on-surface-variant text-sm leading-relaxed">
          {description}
        </p>

        <div className="mt-3 flex flex-wrap gap-2 items-center">
          <span className="bg-surface-container-highest text-[10px] uppercase tracking-wider font-bold px-3 py-1 rounded-full text-on-surface-variant">
            {category}
          </span>
        </div>
      </div>
    </div>
  );
}
