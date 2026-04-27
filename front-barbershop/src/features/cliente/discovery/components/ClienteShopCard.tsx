import { useNavigate } from "react-router-dom";
import type { BarberShopResponse } from "../../types/cliente.types";

interface ClienteShopCardProps {
  shop: BarberShopResponse;
}

export default function ClienteShopCard({ shop }: ClienteShopCardProps) {
  const navigate = useNavigate();
  const { id, name, address, openNow, todaySchedules, coverImageUrl } = shop;

  return (
    <div 
      onClick={() => navigate(`/cliente/barbershop/${id}`)}
      className="group bg-surface-container-low rounded-2xl overflow-hidden transition-all hover:bg-surface-container shadow-lg cursor-pointer border border-outline-variant/5 hover:border-primary/20"
    >
      <div className="aspect-[16/9] overflow-hidden relative">
        {coverImageUrl ? (
          <img 
            src={coverImageUrl} 
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-surface-container-highest flex items-center justify-center">
            <span className="material-symbols-outlined text-4xl text-on-surface-variant/20">image</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>
        
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
            openNow 
              ? "bg-tertiary/10 text-tertiary border-tertiary/20" 
              : "bg-error/10 text-error border-error/20"
          }`}>
            {openNow ? "Abierto" : "Cerrado"}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="font-headline text-xl font-bold text-on-surface tracking-tight group-hover:text-primary transition-colors mb-2">
          {name}
        </h3>
        
        <p className="font-body text-xs text-on-surface-variant mb-4 flex items-center gap-1.5">
          <span className="material-symbols-outlined text-sm text-primary">location_on</span>
          {address}
        </p>
        
        <div className="flex flex-col gap-1.5 mb-6">
          <div className="flex items-center gap-1.5 text-[10px] font-black text-on-surface-variant/60 uppercase tracking-widest">
            <span className="material-symbols-outlined text-xs">schedule</span>
            Hoy
          </div>
          {todaySchedules && todaySchedules.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {todaySchedules.map((schedule, idx) => (
                <span key={idx} className="text-[10px] font-bold text-on-surface bg-surface-container-highest px-2 py-0.5 rounded">
                  {schedule}
                </span>
              ))}
            </div>
          ) : (
            <span className="text-[10px] font-bold text-on-surface-variant/40">Sin horario disponible</span>
          )}
        </div>
        
        <div className="flex items-center justify-end">
          <button className="text-primary text-[10px] font-black uppercase tracking-widest hover:opacity-80 transition-opacity flex items-center gap-2 group/btn">
            Ver barbería
            <span className="material-symbols-outlined text-xs transition-transform group-hover/btn:translate-x-1">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
}
