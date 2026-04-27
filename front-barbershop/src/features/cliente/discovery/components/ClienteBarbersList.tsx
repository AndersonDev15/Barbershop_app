import { useState } from "react";
import type { BarberResponse, Barber } from "../../types/cliente.types";
import ClienteBarberCard from "./ClienteBarberCard";

interface ClienteBarbersListProps {
  barbers: BarberResponse[];
  onAvailability: (barber: Barber) => void;
}

export default function ClienteBarbersList({
  barbers,
  onAvailability,
}: ClienteBarbersListProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 4;

  const totalPages = Math.ceil(barbers.length / itemsPerPage);
  const currentBarbers = barbers.slice(
    currentPage * itemsPerPage,
    currentPage * itemsPerPage + itemsPerPage
  );

  const handlePrev = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if ((currentPage + 1) * itemsPerPage < barbers.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <section>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-6 md:mb-8 gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-headline font-extrabold tracking-tight text-on-surface">
            Meet Our Masters
          </h2>
          <p className="text-on-surface-variant text-xs md:text-sm mt-0.5 font-medium">
            Precision and style from the best in the city.
          </p>
        </div>
        <div className="flex gap-2 self-end sm:self-auto">
          <button
            onClick={handlePrev}
            disabled={currentPage === 0}
            className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center text-on-surface-variant hover:text-primary hover:border-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed active:scale-90"
          >
            <span className="material-symbols-outlined text-sm">
              chevron_left
            </span>
          </button>
          <button
            onClick={handleNext}
            disabled={(currentPage + 1) * itemsPerPage >= barbers.length}
            className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center text-on-surface-variant hover:text-primary hover:border-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed active:scale-90"
          >
            <span className="material-symbols-outlined text-sm">
              chevron_right
            </span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 min-h-[280px]">
        {currentBarbers.map((b) => {
          // Map BarberResponse to UI Barber type for ClienteBarberCard
          const uiBarber: Barber = {
            id: String(b.barberId),
            name: `${b.firstName} ${b.lastName}`,
            role: b.status === "ACTIVO" ? "Active" : "Inactive",
            specialty: "Master Barber", // Default placeholder
            initials: `${b.firstName[0] || ''}${b.lastName[0] || ''}`.toUpperCase()
          };

          return (
            <ClienteBarberCard
              key={uiBarber.id}
              barber={uiBarber}
              onAvailability={onAvailability}
            />
          );
        })}
        
        {barbers.length === 0 && (
           <div className="col-span-full py-12 bg-surface-container/30 rounded-2xl flex flex-col items-center justify-center border border-dashed border-outline-variant/20">
              <span className="material-symbols-outlined text-4xl text-on-surface-variant/20 mb-3">person_off</span>
              <p className="text-on-surface-variant font-bold uppercase tracking-widest text-[10px]">No barbers available yet</p>
           </div>
        )}
      </div>
      
      {/* Pagination Indicators */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-1.5 mt-6">
          {Array.from({ length: totalPages }).map((_, i) => (
            <div 
              key={i} 
              className={`h-1 rounded-full transition-all duration-300 ${i === currentPage ? 'w-6 bg-primary' : 'w-2 bg-outline-variant/30'}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
