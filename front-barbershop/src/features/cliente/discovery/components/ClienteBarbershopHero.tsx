import type { BarberShopResponse } from "../../types/cliente.types";

interface ClienteBarbershopHeroProps {
  data: BarberShopResponse;
}

export default function ClienteBarbershopHero({
  data,
}: ClienteBarbershopHeroProps) {
  const { name, coverImageUrl, openNow, todaySchedules } = data;

  const schedulesText =
    todaySchedules && todaySchedules.length > 0
      ? todaySchedules.join("  |  ")
      : "Sin horario hoy";

  return (
    <div className="relative h-[200px] md:h-[280px] rounded-2xl overflow-hidden shadow-2xl group">
      {/* Fondo: Imagen o Placeholder */}
      {coverImageUrl ? (
        <img
          src={coverImageUrl}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-surface-container-high via-surface-container-highest to-black/40" />
      )}

      {/* Overlay gradiente */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

      {/* Ícono decorativo si no hay imagen */}
      {!coverImageUrl && (
        <span className="material-symbols-outlined text-[100px] text-primary/10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none">
          content_cut
        </span>
      )}

      {/* Info bottom left */}
      <div className="absolute bottom-4 md:bottom-6 left-4 md:left-8 right-4 md:right-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-headline font-black text-white tracking-tighter italic">
            {name}
          </h1>
        </div>

        {/* Action Quick Info - Mapeado con datos reales */}
        <div className="flex items-center gap-3 md:gap-4 bg-white/5 backdrop-blur-xl p-3 md:p-4 rounded-xl border border-white/10 self-start md:self-auto">
          <div className="flex flex-col">
            <span className="text-[8px] md:text-[9px] font-black text-primary uppercase tracking-[0.2em]">
              Available Today
            </span>
            <span className="text-[10px] md:text-xs font-bold text-white uppercase tracking-widest">
              {schedulesText}
            </span>
          </div>
          <div className="w-px h-6 md:h-8 bg-white/10" />
          <div className="flex flex-col items-end">
            <span
              className={`text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] ${openNow ? "text-tertiary" : "text-on-surface-variant"}`}
            >
              {openNow ? "Currently Open" : "Currently Closed"}
            </span>
            <span className="material-symbols-outlined text-primary text-xs md:text-sm">
              {openNow ? "verified" : "block"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
