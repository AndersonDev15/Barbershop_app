import { useState } from "react";
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
  onNext: (barber: Barber) => void;
  selectedBarberId: string | null;
}

export default function ClienteBookingStep1Barber({
  isOpen,
  onClose,
  onNext,
  selectedBarberId: initialSelectedBarberId,
}: Props) {
  const [selectedBarberId, setSelectedBarberId] = useState<string | null>(
    initialSelectedBarberId,
  );

  const barbers: Barber[] = [
    {
      id: "1",
      name: "Marcus Thorne",
      role: "Art Director",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCDu3j2c-23733ovGdia2EdjFXK3tO_-5YyAczt3CD8v5lMhg5bWRMFcfDe5FGhJbUZ00T0WnJd_r_Vr2kIMvj3PjJ0OaKXSH1jKJrnBOBUCfuGInxk8qkrz8Kl74lzGd1RKMGm8U_O33UrVwCF854v7LjO8Jz7OyQyT1mjLV5rhC-A7fXdIKEqXw8ZjbPYymhMeFOcBn0jeSR9AUDftoG2FgryIMFLsY8Xe43TW8HUhDm_1NmvhBuELdfNnIG1Op8c2WDEGZK7g4VT",
    },
    {
      id: "2",
      name: "Elias Vance",
      role: "Senior Barber",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDw7Bzo2XBldpJvGSsJgMzegYz7LLb-n4pFPCwTse6bx0Rqi-v95eHbdyGfVqPLG9m9GcsEjUqhmC3mXX9_gBOZYVmq8tTgMWuvFgCsTPiM4Zy5iqoqNxcU2Y7NKaAnyBfUYz-VGwo5WJMNZITunYhXPiZniaZGYPnbuEj6mLmdEB5YvFp8jBoUrj5xZuz1nijzQ0uYJ1OWLN2qwgozSpJ4NSLRM1mlAmP0MjmcTfHrsIfpnslO5tKjx3UlK08wyzLytMEzzAemdpxo",
    },
    {
      id: "3",
      name: "Julian Reed",
      role: "Senior Barber",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6BlpWmUe1nzSlkJQoWB6fQIOoyJpI1IU3zKXSmUsgRVP1SUMIns9nLTriBJJohAfm34IbtRuPcy1EiOi3yjPTsGWNt5SRnatAdxR-jTT90i9nFqKliX33rlwk2hQzQFoAv7LEcK_2HDdKa5JS06koNotnGH_6TYSGjJZvTTup9RU2Ya3kc9iymmnW",
    },
    {
      id: "4",
      name: "Adrian Hayes",
      role: "Master Artisan",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuA84wa-Ap4XTaqr-RHVre5V1ERxm-K8LRo1D_GmR0vy5j7AtUEIBBjBNuGQN9dpI_6Pp_whN_vYA788CqSEJrnshizh4ZicxC1IXl4982C62xaUB_VIkh4oDXYY5YnBo_V4hnJRzYJJwRglWHTBvbCocmAALNn-DTnD8xx3K8p-ZzSBS_8Xgx2HajVeO8AYalQuyP5cpUZg09iCpcEhNDdnkfXZWzxUiX7_wOTrMB93m-gd_ALvZP0ddDRan8OAnxF_g1KAY_ESVzq6",
    },
  ];

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
      {/* Step 1: Select Barber Modal */}
      <div className="w-full max-w-2xl bg-surface-container-lowest rounded-lg overflow-hidden shadow-[0px_24px_48px_rgba(0,0,0,0.5)] flex flex-col max-h-[90vh]">
        {/* Modal Header (STAY STATIC) */}
        <div className="p-8 pb-4">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-primary mb-2 block">
                Step 1 / 4: Select Barber
              </span>
              <h2 className="text-3xl font-headline font-extrabold text-on-surface">
                Book Your Session
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-on-surface-variant hover:text-on-surface transition-colors"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>

        {/* Content Area: Barber Grid (SCROLLABLE) */}
        <div className="flex-1 overflow-y-auto p-8 pt-4 custom-scrollbar">
          <p className="text-on-surface-variant text-sm leading-relaxed max-w-md mb-6">
            Choose your preferred master barber for a premium grooming
            experience. Each artisan brings a unique signature to their craft.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {barbers.map((barber) => {
              const isSelected = selectedBarberId === barber.id;
              return (
                <button
                  key={barber.id}
                  onClick={() => setSelectedBarberId(barber.id)}
                  className={`relative group flex items-center gap-4 p-5 rounded-lg transition-all text-left border-2 
                    ${
                      isSelected
                        ? "bg-surface-container-high border-primary ring-2 ring-primary"
                        : "bg-surface-container-low border-transparent hover:bg-surface-container-high hover:border-outline-variant/30"
                    }`}
                >
                  <div
                    className={`relative w-16 h-16 rounded-full overflow-hidden shrink-0 border-2 transition-all 
                    ${isSelected ? "border-primary" : "border-transparent"}`}
                  >
                    <img
                      alt={barber.name}
                      className={`w-full h-full object-cover transition-all 
                        ${!isSelected ? "grayscale group-hover:grayscale-0" : "grayscale-0"}`}
                      src={barber.image}
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-headline font-bold text-on-surface">
                      {barber.name}
                    </h3>
                    <p className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold">
                      {barber.role}
                    </p>
                  </div>

                  {isSelected && (
                    <div className="absolute top-4 right-4 bg-primary text-on-primary rounded-full w-6 h-6 flex items-center justify-center animate-in zoom-in duration-200">
                      <span
                        className="material-symbols-outlined text-sm"
                        style={{ fontVariationSettings: "'wght' 700" }}
                      >
                        check
                      </span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Availability Note */}
          <div className="mt-8 p-6 rounded-lg bg-surface-container border border-outline-variant/10 flex items-center gap-4">
            <span className="material-symbols-outlined text-tertiary">
              info
            </span>
            <p className="text-xs text-on-surface-variant italic">
              Senior barbers and Art Directors may have limited availability for
              same-day walk-ins. Pre-booking is recommended.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-8 bg-surface-container-low flex justify-between items-center gap-4">
          <button
            onClick={onClose}
            className="px-8 py-3 rounded-full text-on-surface hover:bg-surface-container-highest transition-all font-semibold"
          >
            Cancel
          </button>
          <button
            disabled={!selectedBarberId}
            onClick={() => {
              const barber = barbers.find((b) => b.id === selectedBarberId);
              if (barber) onNext(barber);
            }}
            className={`px-12 py-3 rounded-full font-bold shadow-lg transition-all flex items-center gap-2 
              ${
                selectedBarberId
                  ? "bg-primary text-on-primary shadow-primary/20 hover:scale-105 active:scale-95"
                  : "bg-surface-container-highest text-on-surface-variant cursor-not-allowed opacity-50"
              }`}
          >
            Next
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
