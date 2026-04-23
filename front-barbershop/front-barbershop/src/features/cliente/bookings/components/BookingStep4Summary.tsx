import { createPortal } from "react-dom";

interface Barber {
  id: string;
  name: string;
  role: string;
  image: string;
}

interface Service {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  icon: string;
  category: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onBack: () => void;
  onConfirm: () => void;
  selectedBarber: Barber | null;
  selectedDate: string;
  selectedTime: string;
  selectedServices: Service[];
}

export default function BookingStep4Summary({
  isOpen,
  onClose,
  onBack,
  onConfirm,
  selectedBarber,
  selectedDate,
  selectedTime,
  selectedServices,
}: Props) {
  const totalPrice = selectedServices.reduce((acc, s) => acc + s.price, 0);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-6">
      {/* Summary Modal */}
      <div className="relative w-full max-w-xl bg-surface-container-low rounded-lg shadow-[0px_24px_48px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden border border-outline-variant/10 max-h-[90vh]">
        {/* Step Indicator & Header: STAY STATIC */}
        <div className="px-8 pt-8 pb-4 flex justify-between items-center flex-shrink-0">
          <div className="flex flex-col">
            <span className="text-primary font-bold tracking-widest text-[10px] uppercase">
              Step 4 / 4
            </span>
            <h2 className="font-headline text-2xl font-bold text-on-surface">
              Review Summary
            </h2>
          </div>
          <button
            onClick={onClose}
            className="bg-surface-container-highest p-2 rounded-full cursor-pointer hover:bg-surface-bright transition-colors text-on-surface-variant"
          >
            <span className="material-symbols-outlined block">close</span>
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div className="px-8 pb-8 space-y-6 overflow-y-auto custom-scrollbar flex-1">
          {/* Summary Card */}
          <div className="bg-surface-container-high rounded-lg p-6 space-y-8">
            {/* Barber & Date Row */}
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-primary/20">
                  <img
                    className="w-full h-full object-cover"
                    alt={selectedBarber?.name || "Barber"}
                    src={selectedBarber?.image}
                  />
                </div>
                <div>
                  <p className="text-[10px] text-on-surface-variant font-medium uppercase tracking-tighter">
                    Your Professional
                  </p>
                  <h3 className="font-headline text-lg font-bold text-on-surface">
                    {selectedBarber?.name}
                  </h3>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-on-surface-variant font-medium uppercase tracking-tighter">
                  Schedule
                </p>
                <p className="font-body font-semibold text-on-surface text-sm">
                  {selectedDate}
                </p>
                <p className="text-primary font-bold text-lg leading-tight">
                  {selectedTime}
                </p>
              </div>
            </div>

            {/* Services List */}
            <div className="space-y-4">
              {selectedServices.map((service) => (
                <div
                  key={service.id}
                  className="flex justify-between items-center"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-tertiary shadow-[0_0_8px_rgba(61,225,252,0.4)]"></div>
                    <span className="font-medium text-on-surface text-sm">
                      {service.name}
                    </span>
                  </div>
                  <span className="font-headline font-bold text-on-surface">
                    ${service.price.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Total Section */}
            <div className="pt-6 border-t border-outline-variant/10 flex justify-between items-end">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">
                  Final Investment
                </p>
                <span className="text-tertiary-fixed-dim text-[11px] font-medium flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">
                    verified
                  </span>
                  Professional Master Barber rate
                </span>
              </div>
              <div className="text-right">
                <span className="block text-[10px] text-on-surface-variant font-medium uppercase tracking-wider">
                  Total
                </span>
                <span className="font-headline text-4xl font-extrabold text-primary tracking-tight">
                  ${totalPrice.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-4 pt-4">
            <button
              onClick={onConfirm}
              className="w-full bg-primary hover:bg-primary/90 text-on-primary font-bold py-5 rounded-full transition-all flex items-center justify-center gap-2 group shadow-lg shadow-primary/10 active:scale-95"
            >
              Confirm Booking
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </button>
            <div className="flex justify-center">
              <button
                onClick={onBack}
                className="text-on-surface-variant hover:text-primary text-sm font-medium transition-colors flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">
                  chevron_left
                </span>
                Back to Services
              </button>
            </div>
          </div>

          {/* Info Note */}
          <div className="bg-surface-container-highest/30 rounded-full py-3 px-6 text-center border border-outline-variant/5">
            <p className="text-[10px] text-on-surface-variant flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-[16px] text-tertiary">
                info
              </span>
              Confirming will trigger a secure reservation.
            </p>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
