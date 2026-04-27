import type { BarberResponse } from "../../types/cliente.types";

interface ClienteBarberDetailPanelProps {
  barber: BarberResponse | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ClienteBarberDetailPanel({
  barber,
  isOpen,
  onClose,
}: ClienteBarberDetailPanelProps) {
  if (!isOpen || !barber) return null;

  const fullName = `${barber.firstName} ${barber.lastName}`;
  const initials = `${barber.firstName[0] || ""}${barber.lastName[0] || ""}`.toUpperCase();
  const isActive = barber.status === "ACTIVO";

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90]"
        onClick={onClose}
      />

      {/* Panel */}
      <aside className="fixed right-0 top-0 h-screen w-full md:w-[480px] bg-surface-container-lowest z-[95] flex flex-col shadow-[0px_24px_48px_rgba(0,0,0,0.5)] border-l border-outline-variant/10">
        <div className="flex-shrink-0">
          {/* Header */}
          <header className="p-6 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <button
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-highest hover:bg-surface-bright text-on-surface transition-all active:scale-95"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                  isActive ? "bg-tertiary/10 text-tertiary border border-tertiary/20" : "bg-on-surface-variant/10 text-on-surface-variant"
                }`}>
                  {barber.status}
                </span>
              </div>
            </div>

            <div className="flex flex-col items-center text-center gap-4 mt-4">
              <div className="w-24 h-24 rounded-3xl bg-surface-container-high border-2 border-primary/20 flex items-center justify-center text-3xl font-black text-primary font-headline shadow-xl shadow-primary/5">
                {initials}
              </div>
              <div>
                <h3 className="text-2xl font-headline font-black tracking-tight text-on-surface">
                  {fullName}
                </h3>
                <p className="text-primary text-xs font-bold uppercase tracking-[0.2em] mt-1">
                  Master Barber
                </p>
              </div>
            </div>
          </header>
        </div>

        {/* Info Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-8 custom-scrollbar">
          <div className="h-px w-full bg-outline-variant/10" />
          
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-sm">contact_page</span>
              <h4 className="text-xs uppercase tracking-[0.2em] text-on-surface-variant font-bold font-label">Contact Information</h4>
            </div>

            <div className="grid gap-4">
              <div className="p-4 bg-surface-container rounded-2xl border border-outline-variant/5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface-variant">
                  <span className="material-symbols-outlined text-xl">mail</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-on-surface-variant/50 uppercase tracking-widest">Email Address</span>
                  <span className="text-sm font-bold text-on-surface">{barber.email}</span>
                </div>
              </div>

              <div className="p-4 bg-surface-container rounded-2xl border border-outline-variant/5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface-variant">
                  <span className="material-symbols-outlined text-xl">call</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-on-surface-variant/50 uppercase tracking-widest">Phone Number</span>
                  <span className="text-sm font-bold text-on-surface">{barber.phone}</span>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-sm">verified</span>
              <h4 className="text-xs uppercase tracking-[0.2em] text-on-surface-variant font-bold font-label">Expertise</h4>
            </div>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Expert in precision fades, traditional straight razor shaves, and modern hair styling. With years of experience delivering top-tier grooming services.
            </p>
          </section>
        </div>

        {/* Footer Action */}
        <div className="p-6 mt-auto border-t border-outline-variant/10 bg-surface-container-lowest">
          <button
            onClick={onClose}
            className="w-full py-4 bg-primary text-on-primary font-black uppercase tracking-[0.2em] rounded-xl shadow-lg shadow-primary/20 hover:brightness-110 active:scale-[0.98] transition-all"
          >
            Close Profile
          </button>
        </div>
      </aside>
    </>
  );
}
