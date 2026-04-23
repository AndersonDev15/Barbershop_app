interface BarberoAvailabilityMetricsProps {
  onBlockAfternoon?: () => void;
}

export default function BarberoAvailabilityMetrics({
  onBlockAfternoon,
}: BarberoAvailabilityMetricsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
      {/* Utilization Card */}
      <div className="bg-surface-container/80 backdrop-blur-3xl p-10 rounded-lg border border-outline-variant/10 flex flex-col justify-between min-h-[300px]">
        <div>
          <span className="text-primary material-symbols-outlined text-4xl mb-6">
            analytics
          </span>
          <h3 className="font-headline text-3xl font-extrabold text-on-surface leading-tight mb-4">
            Monday's Utilization
          </h3>
          <p className="text-on-surface-variant text-sm leading-relaxed max-w-xs">
            You are currently at 85% capacity for today. Only 3 slots remain in
            the afternoon session.
          </p>
        </div>
        <div className="mt-8">
          <div className="flex justify-between items-end mb-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
              Occupancy Rate
            </span>
            <span className="text-xl font-headline font-bold text-on-surface">
              85%
            </span>
          </div>
          <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
            <div className="h-full bg-primary w-[85%] rounded-full shadow-[0_0_15px_rgba(242,202,80,0.4)] transition-all duration-1000"></div>
          </div>
        </div>
      </div>

      {/* Bulk Action Card */}
      <div className="bg-surface-container p-10 rounded-lg border border-outline-variant/10 flex flex-col justify-center items-center text-center">
        <div className="w-20 h-20 bg-surface-container-highest rounded-full flex items-center justify-center mb-6">
          <span className="material-symbols-outlined text-on-surface-variant text-4xl">
            event_busy
          </span>
        </div>
        <h4 className="font-headline text-xl font-bold text-on-surface mb-2">
          Want to block the afternoon?
        </h4>
        <p className="text-on-surface-variant text-sm mb-8">
          Quickly mark all remaining slots from 2 PM onwards as unavailable.
        </p>
        <button
          className="w-full py-4 border border-outline-variant/30 rounded-full text-on-surface font-bold hover:bg-surface-bright transition-colors uppercase tracking-widest text-[10px]"
          onClick={onBlockAfternoon}
        >
          Bulk Action: Block Afternoon
        </button>
      </div>
    </div>
  );
}
