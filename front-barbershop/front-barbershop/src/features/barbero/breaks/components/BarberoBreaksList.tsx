import type { Break } from "../../types/barbero.types";
import BarberoBreakItem from "./BarberoBreakItem";

interface BarberoBreaksListProps {
  breaks: Break[];
  onDelete: (id: string) => void;
}

export default function BarberoBreaksList({
  breaks,
  onDelete,
}: BarberoBreaksListProps) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className="flex items-center gap-4 py-4">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-outline-variant/20 to-transparent" />
        <span className="text-xs font-black uppercase tracking-widest text-on-surface-variant">
          Scheduled Breaks
        </span>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-outline-variant/20 to-transparent" />
      </div>

      <div className="grid grid-cols-1 gap-4 md:gap-6 mt-4">
        {breaks.map((breakItem) => (
          <BarberoBreakItem
            key={breakItem.id}
            breakItem={breakItem}
            onDelete={onDelete}
          />
        ))}
      </div>

      {breaks.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-on-surface-variant">
          <span className="material-symbols-outlined text-5xl mb-4 opacity-20">
            coffee
          </span>
          <p className="text-sm uppercase tracking-widest font-bold opacity-40">
            No breaks scheduled.
          </p>
        </div>
      )}
    </div>
  );
}
