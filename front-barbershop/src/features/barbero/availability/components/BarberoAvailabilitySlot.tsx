interface BarberoAvailabilitySlotProps {
  time: string;
  status: "available" | "occupied" | "not-available";
  clientName?: string;
  isCurrent?: boolean;
  onToggleAvailability?: () => void;
}

export default function BarberoAvailabilitySlot({
  time,
  status,
  clientName,
  isCurrent,
  onToggleAvailability,
}: BarberoAvailabilitySlotProps) {
  if (isCurrent) {
    return (
      <div className="relative bg-surface-container flex items-center justify-between p-6 md:p-8 rounded-lg ring-2 ring-primary/30 shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
        <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-1.5 h-12 bg-primary rounded-full blur-[2px]"></div>
        <div className="flex items-center gap-8">
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">
              Current Slot
            </span>
            <span className="font-headline text-3xl font-extrabold text-on-surface">
              {time}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-8">
          <div className="flex -space-x-3">
            <div className="w-10 h-10 rounded-full border-2 border-surface-container bg-surface-container-high flex items-center justify-center text-[10px] font-bold text-primary">
              JD
            </div>
            <div className="w-10 h-10 rounded-full border-2 border-surface-container bg-surface-bright flex items-center justify-center text-[10px] font-bold text-on-surface">
              +3
            </div>
          </div>
          <button
            onClick={onToggleAvailability}
            className="relative inline-flex h-7 w-12 items-center rounded-full bg-primary transition-colors"
          >
            <span className="inline-block h-5 w-5 translate-x-6 transform rounded-full bg-on-primary transition duration-200 shadow-sm"></span>
          </button>
        </div>
      </div>
    );
  }

  if (status === "occupied") {
    return (
      <div className="bg-surface-container-highest flex items-center justify-between p-6 rounded-lg border-l-4 border-tertiary shadow-xl">
        <div className="flex items-center gap-8">
          <span className="font-headline text-2xl font-light text-on-surface">
            {time}
          </span>
          <div className="flex items-center gap-2 px-3 py-1 bg-tertiary/10 rounded-full">
            <span className="w-2 h-2 rounded-full bg-tertiary"></span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-tertiary">
              Occupied
            </span>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="text-xs text-on-surface-variant uppercase font-bold tracking-tighter">
              Booked
            </p>
            <p className="font-headline text-lg font-bold text-on-surface">
              {clientName}
            </p>
          </div>
          <div className="h-10 w-10 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant">
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              lock
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (status === "not-available") {
    return (
      <div className="bg-surface-container-low/50 opacity-60 flex items-center justify-between p-6 rounded-lg border border-outline-variant/10">
        <div className="flex items-center gap-8">
          <span className="font-headline text-2xl font-light text-on-surface-variant">
            {time}
          </span>
          <div className="flex items-center gap-2 px-3 py-1 bg-surface-container-lowest rounded-full">
            <span className="w-2 h-2 rounded-full bg-on-surface-variant/30"></span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/50">
              Not Available
            </span>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <span className="text-xs text-on-surface-variant/40 font-medium italic">
            Personal Break
          </span>
          <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-surface-variant transition-colors">
            <span className="inline-block h-4 w-4 translate-x-1 transform rounded-full bg-on-surface-variant/50 transition duration-200"></span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="group bg-surface-container flex items-center justify-between p-6 rounded-lg transition-all duration-300 hover:bg-surface-container-high hover:translate-x-1">
      <div className="flex items-center gap-8">
        <span className="font-headline text-2xl font-light text-on-surface/80">
          {time}
        </span>
        <div className="flex items-center gap-2 px-3 py-1 bg-surface-container-highest rounded-full">
          <span className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(242,202,80,0.5)]"></span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
            Available
          </span>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <span className="text-xs text-on-surface-variant font-medium opacity-0 group-hover:opacity-100 transition-opacity">
          Accepting Bookings
        </span>
        <button
          onClick={onToggleAvailability}
          className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary transition-colors p-1"
        >
          <span className="absolute left-1 right-1 ml-auto h-4 w-4 rounded-full bg-on-primary transition duration-200"></span>
        </button>
      </div>
    </div>
  );
}
