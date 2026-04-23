import { useState } from "react";
import api from "../../../../lib/api";
import type {
  ReservationResponse,
  PaymentMethod,
  PaymentResponse,
} from "../../types/cliente.types";

interface ClientePaymentModalProps {
  isOpen: boolean;
  reservation: ReservationResponse | null;
  onClose: () => void;
  onSuccess: (payment: PaymentResponse, reservationId: number) => void;
}

export default function ClientePaymentModal({
  isOpen,
  reservation,
  onClose,
  onSuccess,
}: ClientePaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("EFECTIVO");
  const [tip, setTip] = useState<number>(0);
  const [notes, setNotes] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PaymentResponse | null>(null);

  if (!isOpen || !reservation) return null;

  const handleClose = () => {
    setPaymentMethod("EFECTIVO");
    setTip(0);
    setNotes("");
    setIsLoading(false);
    setError(null);
    setResult(null);
    onClose();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    })
      .format(amount)
      .replace(/\s/g, "");
  };

  const totalPrice = reservation.totalPrice + (Number(tip) || 0);

  const handleConfirmPayment = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.post(
        `/api/client/reservations/${reservation.id}/pay`,
        {
          paymentMethod,
          tip: Number(tip) || 0,
          notes: notes.trim() || "Sin notas",
        },
      );
      setResult(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al procesar el pago");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
        onClick={handleClose}
      />
      <div className="fixed inset-0 flex items-center justify-center z-[101] p-4 pointer-events-none">
        <div className="bg-surface-container-lowest w-full max-w-md rounded-3xl shadow-2xl border border-outline-variant/10 overflow-hidden pointer-events-auto animate-in zoom-in-95 duration-200">
          {!result ? (
            <div className="p-6 space-y-6">
              <header className="flex items-center justify-between">
                <h3 className="text-xl font-headline font-black text-on-surface uppercase italic tracking-tight">
                  Procesar Pago
                </h3>
                <button
                  onClick={handleClose}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-surface-container-highest hover:bg-surface-bright text-on-surface transition-all"
                >
                  <span className="material-symbols-outlined text-sm">
                    close
                  </span>
                </button>
              </header>

              {/* Resumen */}
              <div className="p-4 bg-surface-container rounded-2xl border border-outline-variant/5 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">
                    Barbero
                  </span>
                  <span className="text-sm font-bold text-on-surface">
                    {reservation.barber}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">
                    Fecha
                  </span>
                  <span className="text-sm font-bold text-on-surface">
                    {reservation.date}
                  </span>
                </div>
                <div className="h-px bg-outline-variant/10" />
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">
                    Precio Base
                  </span>
                  <span className="text-sm font-black text-primary">
                    {formatCurrency(reservation.totalPrice)}
                  </span>
                </div>
              </div>

              {/* Método de Pago */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest block px-1">
                  Método de Pago
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {(["EFECTIVO", "TRANSFERENCIA"] as PaymentMethod[]).map(
                    (method) => (
                      <button
                        key={method}
                        onClick={() => setPaymentMethod(method)}
                        className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                          paymentMethod === method
                            ? "bg-primary text-on-primary border-primary shadow-lg shadow-primary/20"
                            : "bg-surface-container-highest text-on-surface-variant border-transparent hover:border-outline-variant/20"
                        }`}
                      >
                        {method}
                      </button>
                    ),
                  )}
                </div>
              </div>

              {/* Propina y Notas */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest block px-1">
                    Propina (COP)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={tip}
                    onChange={(e) =>
                      setTip(Math.max(0, parseInt(e.target.value) || 0))
                    }
                    className="w-full bg-surface-container-highest border border-outline-variant/10 rounded-xl px-4 py-3 text-sm font-bold text-on-surface focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest block px-1">
                    Notas
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Opcional..."
                    className="w-full bg-surface-container-highest border border-outline-variant/10 rounded-xl px-4 py-3 text-sm font-bold text-on-surface focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
              </div>

              {/* Total */}
              <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 flex justify-between items-center">
                <span className="text-sm font-black text-on-surface uppercase tracking-widest">
                  Total a pagar
                </span>
                <span className="text-2xl font-black text-primary">
                  {formatCurrency(totalPrice)}
                </span>
              </div>

              {error && (
                <div className="p-3 bg-error/10 border border-error/20 rounded-xl">
                  <p className="text-xs font-bold text-error text-center">
                    {error}
                  </p>
                </div>
              )}

              <button
                onClick={handleConfirmPayment}
                disabled={isLoading}
                className="w-full py-4 rounded-2xl bg-primary text-on-primary text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin" />
                ) : (
                  <>
                    {error ? "Reintentar Pago" : "Confirmar Pago"}
                    <span className="material-symbols-outlined text-sm">
                      {error ? "refresh" : "payments"}
                    </span>
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="p-8 text-center space-y-6">
              <div className="w-20 h-20 bg-tertiary/10 rounded-full flex items-center justify-center mx-auto text-tertiary">
                <span className="material-symbols-outlined text-4xl">
                  check_circle
                </span>
              </div>
              <div className="space-y-2">
                <h4 className="text-2xl font-headline font-black text-on-surface uppercase italic">
                  ¡Pago Exitoso!
                </h4>
                <p className="text-sm text-on-surface-variant font-medium">
                  Tu transacción ha sido procesada correctamente.
                </p>
              </div>

              <div className="p-4 bg-surface-container rounded-2xl border border-outline-variant/5 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">
                    Código
                  </span>
                  <span className="text-sm font-black text-primary">
                    {result.transactionCode}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">
                    Estado
                  </span>
                  <div className="px-3 py-1 bg-tertiary/10 text-tertiary text-[10px] font-black uppercase rounded-full border border-tertiary/20">
                    {result.paymentStatus}
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  onSuccess(result, reservation.id);
                  handleClose();
                }}
                className="w-full py-4 rounded-2xl bg-surface-container-highest text-on-surface text-xs font-black uppercase tracking-[0.2em] hover:bg-surface-bright transition-all"
              >
                Cerrar
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
