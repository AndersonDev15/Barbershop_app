import { useState, useCallback, useEffect } from "react";
import api from "../../../../lib/api";
import type {
  BarberResponse,
  CategoryResponse,
  SubCategoryResponse,
  AvailabilitySearchResponse,
  ReservationResponse,
} from "../../types/cliente.types";

interface ClienteBookingWizardProps {
  isOpen: boolean;
  onClose: () => void;
  barbershopId: number;
  barbers: BarberResponse[];
  services: CategoryResponse[];
}

export default function ClienteBookingWizard({
  isOpen,
  onClose,
  barbershopId,
  barbers,
  services,
}: ClienteBookingWizardProps) {
  const [step, setStep] = useState(1);

  // Form State
  const [selectedBarber, setSelectedBarber] = useState<BarberResponse | null>(
    null,
  );
  const [selectedSubcategories, setSelectedSubcategories] = useState<number[]>(
    [],
  );
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedSlot, setSelectedSlot] = useState<string>("");

  // API Data & Loading
  const [subcategoriesCache] = useState<Map<number, SubCategoryResponse[]>>(
    new Map(),
  );
  const [expandedCategories, setExpandedIds] = useState<number[]>([]);
  const [loadingSubcategories, setLoadingSubcategories] = useState<
    Record<number, boolean>
  >({});

  const [availabilityData, setAvailabilityData] =
    useState<AvailabilitySearchResponse | null>(null);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [slotsError, setSlotsError] = useState<string | null>(null);

  const [isConfirming, setIsConfirming] = useState(false);
  const [reservationResult, setReservationResult] =
    useState<ReservationResponse | null>(null);
  const [confirmError, setConfirmError] = useState<string | null>(null);

  // Helpers
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const resetWizard = useCallback(() => {
    setStep(1);
    setSelectedBarber(null);
    setSelectedSubcategories([]);
    setSelectedDate("");
    setSelectedSlot("");
    setAvailabilityData(null);
    setReservationResult(null);
    setConfirmError(null);
    setSlotsError(null);
  }, []);

  const handleClose = () => {
    onClose();
    setTimeout(resetWizard, 300);
  };

  // Step 2 Logic: Fetch Subcategories
  const toggleCategory = async (categoryId: number) => {
    if (expandedCategories.includes(categoryId)) {
      setExpandedIds(expandedCategories.filter((id) => id !== categoryId));
      return;
    }

    setExpandedIds([...expandedCategories, categoryId]);

    if (!subcategoriesCache.has(categoryId)) {
      setLoadingSubcategories((prev) => ({ ...prev, [categoryId]: true }));
      try {
        const response = await api.get<SubCategoryResponse[]>(
          `/client/barbershops/${barbershopId}/services/${categoryId}/subcategories`,
        );
        subcategoriesCache.set(categoryId, response.data);
      } catch (err) {
        console.error("Error fetching subcategories:", err);
      } finally {
        setLoadingSubcategories((prev) => ({ ...prev, [categoryId]: false }));
      }
    }
  };

  const toggleSubcategory = (id: number) => {
    setSelectedSubcategories((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  // Step 3 Logic: Search Availability
  const fetchAvailability = async (date: string) => {
    if (!selectedBarber || selectedSubcategories.length === 0 || !date) return;

    setIsLoadingSlots(true);
    setSlotsError(null);
    setSelectedSlot("");
    try {
      const response = await api.post<AvailabilitySearchResponse>(
        "/api/client/availability/search",
        {
          barberId: selectedBarber.barberId,
          subcategoryIds: selectedSubcategories,
          date: date,
        },
      );
      setAvailabilityData(response.data);
    } catch (err) {
      setSlotsError("No se pudo obtener la disponibilidad.");
    } finally {
      setIsLoadingSlots(false);
    }
  };

  useEffect(() => {
    if (step === 3 && selectedDate) {
      fetchAvailability(selectedDate);
    }
  }, [step, selectedDate]);

  // Step 4 Logic: Confirm Reservation
  const handleConfirm = async () => {
    if (
      !selectedBarber ||
      !selectedDate ||
      !selectedSlot ||
      selectedSubcategories.length === 0
    )
      return;

    setIsConfirming(true);
    setConfirmError(null);
    try {
      const response = await api.post<ReservationResponse>(
        "/api/client/reservations",
        {
          barberId: selectedBarber.barberId,
          date: selectedDate,
          startTime: selectedSlot,
          subcategoryIds: selectedSubcategories,
        },
      );
      setReservationResult(response.data);
    } catch (err) {
      setConfirmError("Error al confirmar la reserva. Intenta de nuevo.");
    } finally {
      setIsConfirming(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
      <div className="w-full max-w-2xl bg-surface-container-lowest rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <header className="px-8 py-6 border-b border-outline-variant/10 flex items-center justify-between bg-surface-container-low">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant">
                Step {step} of 4
              </span>
            </div>
            <h2 className="text-xl font-headline font-black text-on-surface uppercase tracking-tight">
              {step === 1 && "Choose your Barber"}
              {step === 2 && "Select Services"}
              {step === 3 && "Pick Date & Time"}
              {step === 4 && "Review & Confirm"}
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="w-10 h-10 rounded-full hover:bg-surface-container-highest transition-colors flex items-center justify-center text-on-surface-variant"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {/* STEP 1: BARBER SELECTION */}
          {step === 1 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {barbers.map((barber) => {
                const isSelected = selectedBarber?.barberId === barber.barberId;
                const initials =
                  `${barber.firstName[0]}${barber.lastName[0]}`.toUpperCase();
                return (
                  <button
                    key={barber.barberId}
                    onClick={() => setSelectedBarber(barber)}
                    className={`p-4 rounded-2xl border-2 transition-all flex items-center gap-4 text-left ${
                      isSelected
                        ? "border-primary bg-primary/5 shadow-lg shadow-primary/5"
                        : "border-outline-variant/10 hover:border-primary/30 bg-surface-container-low"
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${isSelected ? "bg-primary text-on-primary" : "bg-surface-container-highest text-primary"}`}
                    >
                      {initials}
                    </div>
                    <div>
                      <p className="font-bold text-on-surface">
                        {barber.firstName} {barber.lastName}
                      </p>
                      <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">
                        {barber.status}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* STEP 2: SERVICES SELECTION */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="flex justify-between items-center px-2">
                <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                  {selectedSubcategories.length} selected
                </span>
              </div>
              {services.map((category) => {
                const isExpanded = expandedCategories.includes(category.id);
                const subs = subcategoriesCache.get(category.id) || [];
                const isLoading = loadingSubcategories[category.id];
                return (
                  <div
                    key={category.id}
                    className="bg-surface-container-low rounded-2xl border border-outline-variant/10 overflow-hidden"
                  >
                    <button
                      onClick={() => toggleCategory(category.id)}
                      className="w-full p-5 flex items-center justify-between hover:bg-surface-container-high transition-colors"
                    >
                      <span className="font-bold text-on-surface">
                        {category.name}
                      </span>
                      {isLoading ? (
                        <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
                      ) : (
                        <span
                          className={`material-symbols-outlined transition-transform ${isExpanded ? "rotate-180" : ""}`}
                        >
                          expand_more
                        </span>
                      )}
                    </button>
                    {isExpanded && (
                      <div className="px-5 pb-5 space-y-3 animate-in fade-in slide-in-from-top-1">
                        {subs.map((sub) => (
                          <label
                            key={sub.id}
                            className="flex items-center justify-between p-3 rounded-xl hover:bg-surface-container-highest transition-colors cursor-pointer group"
                          >
                            <div className="flex items-center gap-3">
                              <input
                                type="checkbox"
                                checked={selectedSubcategories.includes(sub.id)}
                                onChange={() => toggleSubcategory(sub.id)}
                                className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary"
                              />
                              <div>
                                <p className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors">
                                  {sub.name}
                                </p>
                                <span className="text-[10px] font-bold text-on-surface-variant/60 uppercase">
                                  {sub.duration} min
                                </span>
                              </div>
                            </div>
                            <span className="font-black text-primary text-sm">
                              {formatCurrency(sub.price)}
                            </span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* STEP 3: DATE & TIME */}
          {step === 3 && (
            <div className="space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-primary uppercase tracking-[0.2em] ml-1">
                  Select Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full bg-surface-container-high border-2 border-outline-variant/10 rounded-2xl px-6 py-4 text-on-surface focus:border-primary/50 outline-none transition-all"
                />
              </div>

              {isLoadingSlots ? (
                <div className="flex flex-col items-center py-12 gap-4">
                  <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full" />
                  <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                    Finding available slots...
                  </p>
                </div>
              ) : slotsError ? (
                <div className="text-center py-12 text-error text-sm font-bold uppercase">
                  {slotsError}
                </div>
              ) : (
                availabilityData && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                      {availabilityData.slots.map((slot, i) => {
                        const isBlocked =
                          slot.status === "OCUPADO" ||
                          slot.status === "NO_DISPONIBLE" ||
                          slot.status === "NO DISPONIBLE";
                        const isSelected = selectedSlot === slot.time;
                        return (
                          <button
                            key={i}
                            disabled={isBlocked}
                            onClick={() => setSelectedSlot(slot.time)}
                            className={`py-3 rounded-xl text-xs font-black transition-all ${
                              isSelected
                                ? "bg-primary text-on-primary shadow-lg shadow-primary/20 scale-105"
                                : isBlocked
                                  ? "bg-surface-container-highest text-on-surface-variant/30 opacity-40 cursor-not-allowed"
                                  : "bg-surface-container-high text-on-surface hover:border-primary/50 border border-outline-variant/10"
                            }`}
                          >
                            {slot.time}
                          </button>
                        );
                      })}
                    </div>
                    <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 flex justify-between items-center">
                      <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">
                        Est. Duration & Price
                      </span>
                      <div className="text-right">
                        <p className="text-lg font-black text-primary leading-none">
                          {formatCurrency(availabilityData.totalPrice)}
                        </p>
                        <p className="text-[9px] font-bold text-on-surface-variant/60 uppercase">
                          {availabilityData.totalDuration} MIN TOTAL
                        </p>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          )}

          {/* STEP 4: SUMMARY OR RESULT */}
          {step === 4 && (
            <div className="space-y-6">
              {!reservationResult ? (
                <>
                  <div className="bg-surface-container-low rounded-3xl p-6 border border-outline-variant/10 space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-primary text-on-primary flex items-center justify-center text-xl font-black">
                        {selectedBarber?.firstName[0]}
                        {selectedBarber?.lastName[0]}
                      </div>
                      <div>
                        <p className="text-xs font-black text-primary uppercase tracking-widest">
                          Master Barber
                        </p>
                        <p className="text-lg font-black text-on-surface">
                          {selectedBarber?.firstName} {selectedBarber?.lastName}
                        </p>
                      </div>
                    </div>

                    <div className="h-px bg-outline-variant/10" />

                    <div className="space-y-3">
                      {availabilityData?.selectedServices.map((s) => (
                        <div
                          key={s.id}
                          className="flex justify-between items-center text-sm"
                        >
                          <span className="text-on-surface-variant font-medium">
                            {s.name}
                          </span>
                          <span className="font-bold text-on-surface">
                            {formatCurrency(s.price)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="h-px bg-outline-variant/10" />

                    <div className="flex justify-between items-end">
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">
                          Scheduled For
                        </p>
                        <p className="text-sm font-bold text-on-surface">
                          {selectedDate} @ {selectedSlot}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-black text-primary">
                          {formatCurrency(availabilityData?.totalPrice || 0)}
                        </p>
                        <p className="text-[9px] font-bold text-on-surface-variant uppercase">
                          {availabilityData?.totalDuration} MIN TOTAL
                        </p>
                      </div>
                    </div>
                  </div>

                  {confirmError && (
                    <p className="text-error text-[10px] font-bold uppercase text-center tracking-widest">
                      {confirmError}
                    </p>
                  )}
                </>
              ) : (
                <div className="text-center py-8 space-y-6 animate-in zoom-in-95 duration-500">
                  <div className="w-20 h-20 bg-tertiary/10 text-tertiary rounded-full flex items-center justify-center mx-auto">
                    <span className="material-symbols-outlined text-5xl">
                      check_circle
                    </span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-on-surface uppercase tracking-tight">
                      Booking Confirmed!
                    </h3>
                    <p className="text-on-surface-variant mt-2">
                      Your reservation #
                      <span className="text-primary font-bold">
                        {reservationResult.id}
                      </span>{" "}
                      has been successfully scheduled.
                    </p>
                  </div>
                  <div className="p-4 bg-surface-container-high rounded-2xl inline-block px-8">
                    <span className="text-[10px] font-black text-tertiary uppercase tracking-widest">
                      Status: {reservationResult.status}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="px-3 sm:px-8 py-4 sm:py-6 border-t border-outline-variant/10 bg-surface-container-low flex flex-col gap-3 w-full overflow-hidden shrink-0">
          {!reservationResult ? (
            <>
              {step > 1 && (
                <button
                  disabled={isConfirming}
                  onClick={() => {
                    if (step === 3) {
                      setSelectedDate("");
                      setSelectedSlot("");
                      setAvailabilityData(null);
                    }
                    if (step === 2) setSelectedSubcategories([]);
                    setStep(step - 1);
                  }}
                  className="w-full py-3 rounded-2xl border-2 border-outline-variant/10 font-black uppercase tracking-wider text-on-surface-variant hover:bg-surface-container-highest transition-all order-2 text-[10px] sm:text-xs"
                >
                  Back
                </button>
              )}

              {step < 4 ? (
                <button
                  onClick={() => setStep(step + 1)}
                  disabled={
                    (step === 1 && !selectedBarber) ||
                    (step === 2 && selectedSubcategories.length === 0) ||
                    (step === 3 &&
                      (!selectedDate || !selectedSlot || isLoadingSlots))
                  }
                  className="w-full py-3 rounded-2xl bg-primary text-on-primary font-black uppercase tracking-wider hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none shadow-xl shadow-primary/20 order-1 text-[10px] sm:text-xs"
                >
                  Continue
                </button>
              ) : (
                <button
                  onClick={handleConfirm}
                  disabled={isConfirming}
                  className="w-full py-3 rounded-2xl bg-primary text-on-primary font-black uppercase tracking-wider hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none shadow-xl shadow-primary/20 flex items-center justify-center gap-2 order-1 text-[10px] sm:text-xs"
                >
                  {isConfirming ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-on-primary border-t-transparent rounded-full" />
                      Confirming...
                    </>
                  ) : (
                    "Confirm & Pay"
                  )}
                </button>
              )}
            </>
          ) : (
            <button
              onClick={handleClose}
              className="w-full py-3 rounded-2xl bg-on-surface text-surface font-black uppercase tracking-widest hover:bg-on-surface/90 transition-all text-[10px] sm:text-xs"
            >
              Done
            </button>
          )}
        </footer>
      </div>
    </div>
  );
}
