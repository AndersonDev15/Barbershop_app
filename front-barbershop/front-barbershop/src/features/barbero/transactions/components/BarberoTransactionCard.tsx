import type { TransactionResponse } from "../../types/barbero.types";

interface BarberoTransactionCardProps {
  transaction: TransactionResponse;
  onComplete: (id: number) => void;
}

export default function BarberoTransactionCard({
  transaction,
  onComplete,
}: BarberoTransactionCardProps) {
  const {
    id,
    transactionCode,
    totalAmount,
    tip,
    paymentMethod,
    paymentStatus,
    paymentDate,
    createdAt,
    notes,
  } = transaction;

  const isPaid = paymentStatus === "PAGADO";
  const isPending = paymentStatus === "PENDIENTE";
  const isInProcess = paymentStatus === "EN_PROCESO";
  const isRefunded = paymentStatus === "REEMBOLSADO";
  const isRejected = paymentStatus === "RECHAZADO";

  const isActive = isPending || isInProcess;

  const formatTime = (dateStr: string | null) => {
    if (!dateStr) return "--:--";
    return new Date(dateStr).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div
      className={`group relative p-5 rounded-lg transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-3 ${
        isActive
          ? "bg-surface-container hover:translate-x-2"
          : "bg-surface-container-lowest opacity-70"
      }`}
    >
      {/* Columna izquierda */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
        {/* Hora */}
        <div className="flex flex-col min-w-0 md:min-w-[80px]">
          <span
            className={`text-xl font-black leading-none ${
              isActive ? "text-on-surface" : "text-on-surface-variant"
            }`}
          >
            {formatTime(paymentDate ?? createdAt)}
          </span>
          <span className="text-[10px] font-medium text-on-surface-variant tracking-widest uppercase mt-1 truncate">
            {transactionCode}
          </span>
        </div>

        {/* Divider */}
        <div className="h-8 w-[1px] bg-outline-variant/30 hidden md:block"></div>

        {/* Info Pago */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-base font-bold text-on-surface">
              {formatCurrency(totalAmount)}
            </span>
            {tip > 0 && (
              <span className="text-xs font-medium text-primary">
                + {formatCurrency(tip)} tip
              </span>
            )}
          </div>
          {paymentMethod ? (
            <span className="text-xs text-on-surface-variant flex items-center gap-1">
              <span className="material-symbols-outlined text-xs">
                {paymentMethod === "EFECTIVO" ? "payments" : "account_balance"}
              </span>
              {paymentMethod}
            </span>
          ) : (
            <span className="text-xs text-on-surface-variant/50 italic">
              Método pendiente
            </span>
          )}
          {notes && (
            <span className="text-xs italic text-on-surface-variant/70 mt-1 max-w-xs truncate">
              "{notes}"
            </span>
          )}
        </div>
      </div>

      {/* Columna derecha */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Status badges */}
        {isPending && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary-container/50 whitespace-nowrap">
            <span className="w-2 h-2 rounded-full bg-on-surface-variant"></span>
            <span className="text-on-surface-variant text-xs font-bold uppercase tracking-widest">
              Pendiente
            </span>
          </div>
        )}
        {isInProcess && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary-container border border-secondary/20 whitespace-nowrap">
            <span
              className="material-symbols-outlined text-secondary text-xs"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              schedule
            </span>
            <span className="text-secondary text-xs font-bold uppercase tracking-widest">
              En proceso
            </span>
          </div>
        )}
        {isPaid && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 whitespace-nowrap">
            <span
              className="material-symbols-outlined text-primary text-xs"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              check_circle
            </span>
            <span className="text-primary text-xs font-bold uppercase tracking-widest">
              Pagado
            </span>
          </div>
        )}
        {isRefunded && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-tertiary/10 border border-tertiary/20 whitespace-nowrap">
            <span className="text-tertiary text-xs font-bold uppercase tracking-widest">
              Reembolsado
            </span>
          </div>
        )}
        {isRejected && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-error/10 border border-error/20 whitespace-nowrap">
            <span className="text-error text-xs font-bold uppercase tracking-widest">
              Rechazado
            </span>
          </div>
        )}

        {/* Botón de acción */}
        <div className="flex flex-1 md:flex-none items-center gap-2">
          {isActive && (
            <button
              onClick={() => onComplete(id)}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-primary text-on-primary text-xs font-bold uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-primary/10 hover:brightness-110 whitespace-nowrap"
            >
              <span className="material-symbols-outlined text-sm">
                payments
              </span>
              Confirmar pago
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
