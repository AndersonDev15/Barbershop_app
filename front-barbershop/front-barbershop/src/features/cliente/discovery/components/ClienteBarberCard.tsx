import type { Barber } from "../../types/cliente.types";

interface ClienteBarberCardProps {
  barber: Barber;
  onAvailability: (barber: Barber) => void;
}

export default function ClienteBarberCard({
  barber,
  onAvailability,
}: ClienteBarberCardProps) {
  return (
    <div className="flex-shrink-0 w-40 group cursor-pointer">
      {/* Avatar placeholder */}
      <div className="relative h-52 rounded-lg overflow-hidden mb-2.5 bg-surface-container-high">
        {/* Iniciales */}
        <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-primary font-headline group-hover:scale-110 transition-transform duration-500">
          {barber.initials}
        </div>

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />

        {/* Badge rol */}
        <div className="absolute bottom-2.5 left-2.5 text-primary font-bold text-[9px] tracking-widest uppercase">
          {barber.role}
        </div>
      </div>

      {/* Info */}
      <h5 className="text-sm font-bold font-headline text-on-surface">
        {barber.name}
      </h5>
      <p className="text-on-surface-variant text-[11px] leading-tight truncate">
        {barber.specialty}
      </p>

      {/* Botón disponibilidad */}
      <button
        onClick={() => onAvailability(barber)}
        className="w-full mt-2 py-1.5 px-3 border border-outline-variant rounded-full text-[9px] font-bold uppercase tracking-widest text-on-surface hover:bg-surface-bright hover:border-primary transition-all active:scale-95"
      >
        Availability
      </button>
    </div>
  );
}
