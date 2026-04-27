import BarberoAvailabilitySlot from "./BarberoAvailabilitySlot";

interface SlotData {
  time: string;
  status: "available" | "occupied" | "not-available";
  clientName?: string;
  isCurrent?: boolean;
}

interface BarberoAvailabilityHourGroupProps {
  hour: string;
  slots: SlotData[];
}

export default function BarberoAvailabilityHourGroup({
  hour,
  slots,
}: BarberoAvailabilityHourGroupProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-4 px-4">
        <span className="text-xs font-black uppercase tracking-[0.2em] text-on-surface-variant/40">
          {hour} Cluster
        </span>
        <div className="h-px flex-1 bg-outline-variant/10"></div>
      </div>
      <div className="grid gap-3">
        {slots.map((slot) => (
          <BarberoAvailabilitySlot
            key={slot.time}
            time={slot.time}
            status={slot.status}
            clientName={slot.clientName}
            isCurrent={slot.isCurrent}
          />
        ))}
      </div>
    </section>
  );
}
