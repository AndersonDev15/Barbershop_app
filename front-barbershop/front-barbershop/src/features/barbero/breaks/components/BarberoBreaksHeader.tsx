interface BarberoBreaksHeaderProps {
  onCreateBreak: () => void;
}

export default function BarberoBreaksHeader({
  onCreateBreak,
}: BarberoBreaksHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
      <div className="animate-in fade-in slide-in-from-left-4 duration-700">
        <span className="text-tertiary font-bold tracking-[0.2em] uppercase text-xs">
          Management Module
        </span>
        <h1 className="text-2xl md:text-3xl font-extrabold text-on-surface tracking-tighter mt-2 font-headline">
          Breaks Management
        </h1>
        <p className="text-on-surface-variant mt-4 max-w-md text-sm">
          Schedule your downtime to ensure consistent performance.
        </p>
      </div>

      <button
        onClick={onCreateBreak}
        className="flex items-center gap-3 bg-primary text-on-primary px-5 py-2.5 text-sm rounded-full font-bold hover:shadow-[0_0_30px_rgba(242,202,80,0.3)] transition-all active:scale-95 animate-in fade-in slide-in-from-right-4 duration-700"
      >
        <span className="material-symbols-outlined">add_circle</span>
        Create New Break
      </button>
    </div>
  );
}
