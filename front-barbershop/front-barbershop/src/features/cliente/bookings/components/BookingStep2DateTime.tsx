import { createPortal } from "react-dom";

interface Barber {
  id: string;
  name: string;
  role: string;
  image: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onBack: () => void;
  onNext: () => void;
  onSelectDate: (date: string) => void;
  onSelectTime: (time: string) => void;
  selectedBarber: Barber | null;
  selectedDate: string;
  selectedTime: string;
}

export default function BookingStep2DateTime({
  isOpen,
  onClose,
  onBack,
  onNext,
  onSelectDate,
  onSelectTime,
  selectedBarber,
  selectedDate,
  selectedTime,
}: Props) {
  // Datos de ejemplo para las fechas (Octubre 2023 según el HTML)
  const dates = [
    { day: "MON", date: "23", full: "2023-10-23" },
    { day: "TUE", date: "24", full: "2023-10-24" },
    { day: "WED", date: "25", full: "2023-10-25" },
    { day: "THU", date: "26", full: "2023-10-26" },
    { day: "FRI", date: "27", full: "2023-10-27" },
    { day: "SAT", date: "28", full: "2023-10-28" },
  ];

  // Datos de ejemplo para las horas
  const timeSlots = [
    "09:00",
    "09:15",
    "09:30",
    "09:45",
    "10:00",
    "10:15",
    "10:30",
    "11:00",
    "11:15",
    "11:30",
    "12:45",
    "13:15",
  ];

  if (!isOpen) return null;

  const isNextEnabled = selectedDate && selectedTime;

  // Formatear la fecha seleccionada para el footer
  const getFormattedSelection = () => {
    if (!selectedDate || !selectedTime) return "";
    const dateObj = dates.find((d) => d.full === selectedDate);
    if (!dateObj) return `${selectedDate} • ${selectedTime}`;
    return `${dateObj.day}, ${dateObj.date} OCT • ${selectedTime}`;
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
      {/* Booking Modal */}
      <div className="w-full max-w-2xl bg-surface-container-lowest rounded-lg shadow-[0px_24px_48px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden border border-outline-variant/10 max-h-[90vh]">
        {/* Modal Header: Title and Close Button (STAY STATIC) */}
        <div className="p-8 pb-4">
          <div className="flex justify-between items-start">
            <div>
              <span className="inline-block px-3 py-1 bg-surface-container-highest text-primary font-headline text-xs font-bold tracking-widest rounded-full mb-2 uppercase">
                2 / 4: SELECT DATE & TIME
              </span>
              <h2 className="text-3xl font-headline font-extrabold tracking-tight text-on-surface">
                Pick Your Window
              </h2>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-highest text-on-surface hover:bg-surface-bright transition-colors"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-8 py-4">
          {/* Selection Context (NOW INSIDE SCROLLABLE AREA) */}
          {selectedBarber && (
            <div className="flex items-center gap-3 p-3 bg-surface-container-low rounded-full w-fit mb-8">
              <img
                alt={selectedBarber.name}
                className="w-6 h-6 rounded-full object-cover"
                src={selectedBarber.image}
              />
              <span className="text-xs font-semibold text-on-surface-variant">
                Selected Barber:{" "}
                <span className="text-on-surface">{selectedBarber.name}</span>
              </span>
            </div>
          )}

          {/* Date Picker Section */}
          <div className="mb-8">
            <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-on-surface-variant mb-4">
              OCTOBER 2023
            </label>
            <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
              {dates.map((item) => {
                const isSelected = selectedDate === item.full;
                return (
                  <button
                    key={item.full}
                    onClick={() => onSelectDate(item.full)}
                    className={`flex-shrink-0 w-16 h-20 flex flex-col items-center justify-center rounded-lg transition-all border-2
                      ${
                        isSelected
                          ? "bg-surface-container-high text-primary border-primary ring-2 ring-primary ring-inset"
                          : "bg-surface-container-low text-on-surface-variant border-transparent hover:border-outline-variant/30"
                      }`}
                  >
                    <span className="text-xs font-medium">{item.day}</span>
                    <span className="text-xl font-headline font-bold">
                      {item.date}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time Slots Section */}
          <div className="mb-4">
            <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-on-surface-variant mb-4">
              AVAILABLE SLOTS
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {timeSlots.map((time) => {
                const isSelected = selectedTime === time;
                return (
                <button
                  key={time}
                  onClick={() => onSelectTime(time)}
                  className={`py-3 px-4 rounded-full text-sm font-semibold transition-all
                    ${
                      isSelected
                        ? "bg-primary text-on-primary font-extrabold shadow-[0_0_20px_rgba(242,202,80,0.3)]"
                        : "bg-surface-container-high text-on-surface hover:bg-surface-bright"
                    }`}
                >
                  {time}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modal Footer: Navigation (STAY STATIC) */}
      <div className="p-8 bg-surface-container-low flex items-center justify-between">
        <button
          onClick={onBack}
          className="px-8 py-4 rounded-full bg-surface-container-highest text-on-surface font-headline font-bold text-sm hover:bg-surface-bright transition-all flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Back
        </button>

        <div className="flex items-center gap-6">
          {isNextEnabled && (
            <div className="text-right hidden sm:block">
              <div className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">
                SELECTED
              </div>
              <div className="text-sm font-headline font-black text-primary uppercase">
                {getFormattedSelection()}
              </div>
            </div>
          )}

          <button
            disabled={!isNextEnabled}
            onClick={onNext}
            className={`px-10 py-4 rounded-full font-headline font-black text-sm transition-all flex items-center gap-2
              ${
                isNextEnabled
                  ? "bg-primary text-on-primary hover:scale-105 active:scale-95 shadow-lg shadow-primary/20"
                  : "bg-surface-container-highest text-on-surface-variant cursor-not-allowed opacity-50"
              }`}
          >
            Next Step
            <span className="material-symbols-outlined text-sm">
              arrow_forward
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>,
  document.body,
);
}
