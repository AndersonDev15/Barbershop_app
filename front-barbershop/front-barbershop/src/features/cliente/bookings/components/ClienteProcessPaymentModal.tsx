import { useState, useRef, useEffect } from "react";

interface ClienteProcessPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  reservationNumber: string;
  barberName: string;
  total: string;
}

export default function ClienteProcessPaymentModal({
  isOpen,
  onClose,
  reservationNumber,
  barberName,
  total,
}: ClienteProcessPaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<"EFECTIVO" | "CARD">(
    "EFECTIVO",
  );
  const [tip, setTip] = useState("");
  const [notes, setNotes] = useState("");
  const [showToast, setShowToast] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClick);
    }
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isOpen, onClose]);

  function handleConfirm() {
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      onClose();
    }, 2500);
  }

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
        {/* Glows decorativos */}
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-tertiary/10 rounded-full blur-[120px] pointer-events-none" />

        {/* Modal */}
        <div
          ref={modalRef}
          className="relative w-full max-w-lg bg-surface-container-high rounded-lg shadow-[0px_24px_48px_rgba(0,0,0,0.5)] overflow-hidden max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="p-4 pb-2">
            <div className="flex items-center gap-3 mb-1">
              <span className="material-symbols-outlined text-primary text-sm">
                payments
              </span>
              <span className="text-xs uppercase tracking-[0.2em] text-on-surface-variant font-semibold">
                Financial Transaction
              </span>
            </div>
            <h1 className="font-headline text-lg font-extrabold tracking-tight text-on-surface">
              Complete Payment
            </h1>
            <p className="text-on-surface-variant mt-0.5 text-sm font-medium">
              Reservation #{reservationNumber}
            </p>
          </div>

          {/* Body */}
          <div className="px-6 pb-4 space-y-4 overflow-y-auto flex-1">
            {/* Payment Method + Total */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Payment Method */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-on-surface-variant ml-1 uppercase tracking-widest">
                  Payment Method
                </label>
                <div className="relative">
                  <select
                    value={paymentMethod}
                    onChange={(e) =>
                      setPaymentMethod(e.target.value as "EFECTIVO" | "CARD")
                    }
                    className="w-full appearance-none bg-surface-container-highest border-none rounded-full py-2.5 px-4 text-on-surface text-sm font-medium focus:ring-2 focus:ring-primary/50 transition-all cursor-pointer outline-none"
                  >
                    <option value="EFECTIVO">Efectivo</option>
                    <option value="CARD">Credit / Debit Card</option>
                  </select>
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant">
                    <span className="material-symbols-outlined text-sm">
                      expand_more
                    </span>
                  </div>
                </div>
              </div>

              {/* Total */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-on-surface-variant ml-1 uppercase tracking-widest">
                  Total Amount
                </label>
                <div className="bg-surface-container-low rounded-full py-2.5 px-4 flex items-center justify-between border border-outline-variant/10">
                  <span className="text-on-surface-variant text-sm font-medium">
                    Balance due
                  </span>
                  <span className="text-primary font-headline text-base font-bold">
                    {total}
                  </span>
                </div>
              </div>
            </div>

            {/* Tip */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-on-surface-variant ml-1 uppercase tracking-widest">
                Gratuity (Optional)
              </label>
              <div className="relative">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-on-surface-variant font-bold text-sm">
                  $
                </span>
                <input
                  className="w-full bg-surface-container rounded-full py-2.5 pl-10 pr-5 border-none text-on-surface text-sm placeholder:text-on-surface-variant/40 focus:ring-2 focus:ring-primary/50 transition-all outline-none"
                  placeholder="Add a tip..."
                  type="number"
                  value={tip}
                  onChange={(e) => setTip(e.target.value)}
                />
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-on-surface-variant ml-1 uppercase tracking-widest">
                Additional Notes
              </label>
              <textarea
                className="w-full bg-surface-container rounded-lg p-3 border-none text-on-surface text-sm placeholder:text-on-surface-variant/40 focus:ring-2 focus:ring-primary/50 transition-all resize-none outline-none"
                placeholder="Add a note..."
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-surface-container rounded-lg p-3 flex flex-col items-center justify-center text-center">
                <span
                  className="material-symbols-outlined text-tertiary text-base mb-1"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  schedule
                </span>
                <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                  Service Time
                </p>
                <p className="font-headline text-xs font-bold mt-0.5">45 Min</p>
              </div>
              <div className="bg-surface-container rounded-lg p-3 flex flex-col items-center justify-center text-center">
                <span
                  className="material-symbols-outlined text-primary text-base mb-1"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  content_cut
                </span>
                <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                  Specialist
                </p>
                <p className="font-headline text-xs font-bold mt-0.5 truncate w-full">
                  {barberName}
                </p>
              </div>
              <div className="bg-surface-container rounded-lg p-3 flex flex-col items-center justify-center text-center">
                <span
                  className="material-symbols-outlined text-on-surface-variant text-base mb-1"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  chair
                </span>
                <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                  Station
                </p>
                <p className="font-headline text-xs font-bold mt-0.5">No. 04</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-4 pb-4 flex flex-col sm:flex-row-reverse gap-3">
            <button
              onClick={handleConfirm}
              className="flex-1 bg-primary text-on-primary font-headline font-bold py-3 rounded-full hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-primary/10 text-sm"
            >
              Confirm Payment
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-surface-container-highest text-on-surface font-headline font-bold py-3 rounded-full hover:bg-surface-bright active:scale-95 transition-all text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

      {/* Toast */}
      {showToast && (
        <div className="fixed bottom-8 right-8 z-[110]">
          <div className="flex items-center gap-3 pl-2 pr-6 py-2 rounded-full shadow-[0px_24px_48px_rgba(0,0,0,0.5)] border border-outline-variant/20 bg-surface-container/80 backdrop-blur-xl">
            <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center shadow-lg shadow-primary/20 flex-shrink-0">
              <span
                className="material-symbols-outlined text-on-primary text-lg"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                check_circle
              </span>
            </div>
            <div>
              <p className="text-on-surface font-headline font-bold text-sm">
                Payment successful
              </p>
              <p className="text-on-surface-variant text-[10px] font-medium leading-none mt-0.5">
                Receipt sent to client
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
