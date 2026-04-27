import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ClienteSidebar from "../../common/components/ClienteSidebar";
import ClienteTopBar from "../../common/components/ClienteTopBar";
import ClienteBarbershopHero from "../components/ClienteBarbershopHero";
import ClienteLocationSection from "../components/ClienteLocationSection";
import ClienteBarbersList from "../components/ClienteBarbersList";
import ClienteServiceMenu from "../components/ClienteServiceMenu";
import ClienteBookingWizard from "../../bookings/components/ClienteBookingWizard";
import ClienteBarberDetailPanel from "../../detail/components/ClienteBarberDetailPanel";
import { useBarberShopDetail } from "../../detail/hooks/useBarberShopDetail";
import type { BarberResponse } from "../../types/cliente.types";

export default function ClienteBarbershopDetailPage() {
  const { id } = useParams<{ id: string }>();
  const barbershopId = id ? Number(id) : null;
  const { data, isLoading, error } = useBarberShopDetail(barbershopId);

  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [detailPanel, setDetailPanel] = useState<{
    isOpen: boolean;
    barber: BarberResponse | null;
  }>({ isOpen: false, barber: null });

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-surface">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <p className="text-on-surface-variant font-bold uppercase tracking-widest text-xs">
            Cargando barbería...
          </p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex h-screen items-center justify-center bg-surface">
        <div className="text-center max-w-md px-6">
          <span className="material-symbols-outlined text-error text-6xl mb-4">
            error
          </span>
          <h2 className="text-2xl font-headline font-extrabold text-on-surface mb-2">
            Oops!
          </h2>
          <p className="text-on-surface-variant mb-6">
            {error || "No pudimos encontrar la barbería solicitada."}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-primary text-on-primary font-bold rounded-full"
          >
            REINTENTAR
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-surface text-on-surface">
      <ClienteSidebar />
      <div className="flex flex-col flex-1 overflow-hidden w-full min-w-0">
        <ClienteTopBar />
        <main className="flex-1 overflow-y-auto bg-surface-dim p-4 sm:p-6 md:p-8 lg:p-12 space-y-8 md:space-y-10 custom-scrollbar">
          <ClienteBarbershopHero data={data.info} />
          <ClienteLocationSection
            address={data.info.address}
            todaySchedules={data.info.todaySchedules}
            openNow={data.info.openNow}
          />
          <ClienteBarbersList
            barbers={data.barbers}
            onAvailability={(barber) => {
              // Convert UI barber back to BFF barber or just use the BFF barber directly
              const bffBarber = data.barbers.find(
                (b) => String(b.barberId) === barber.id,
              );
              if (bffBarber) {
                setDetailPanel({ isOpen: true, barber: bffBarber });
              }
            }}
          />
          <ClienteServiceMenu
            categories={data.services}
            onBookNow={() => setIsBookingOpen(true)}
          />

          <footer className="pb-8 pt-6 border-t border-outline-variant/5 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
            <p className="text-[10px] md:text-xs text-on-surface-variant uppercase tracking-widest">
              © 2026 BarberOS. All Rights Reserved.
            </p>
            <div className="flex gap-6">
              <a
                className="text-[10px] md:text-xs text-on-surface-variant uppercase tracking-widest hover:text-primary transition-colors"
                href="#"
              >
                Privacy Policy
              </a>
              <a
                className="text-[10px] md:text-xs text-on-surface-variant uppercase tracking-widest hover:text-primary transition-colors"
                href="#"
              >
                Terms of Service
              </a>
            </div>
          </footer>
        </main>
      </div>

      <ClienteBookingWizard
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        barbershopId={barbershopId!}
        barbers={data.barbers}
        services={data.services}
      />

      <ClienteBarberDetailPanel
        isOpen={detailPanel.isOpen}
        barber={detailPanel.barber}
        onClose={() => setDetailPanel({ isOpen: false, barber: null })}
      />
    </div>
  );
}
