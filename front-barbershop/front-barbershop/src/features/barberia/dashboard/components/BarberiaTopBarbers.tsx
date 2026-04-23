import type { DashboardData } from "../../types/dashboard.types";

interface BarberiaTopBarbersProps {
  data: DashboardData["topBarbers"];
}

export default function BarberiaTopBarbers({ data }: BarberiaTopBarbersProps) {
  // Función para obtener iniciales
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="bg-surface-container rounded-2xl p-8">
      <header className="flex items-center justify-between mb-8">
        <span className="text-[10px] uppercase tracking-[0.2em] text-primary font-bold">
          Top Performing Barbers
        </span>
        <button className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors flex items-center gap-2">
          View All Staff
          <span className="material-symbols-outlined text-sm">
            chevron_right
          </span>
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {data.map((barber, index) => {
          const rank = index + 1;
          const isTop = rank === 1;
          const initials = getInitials(barber.barberName);

          return (
            <div
              key={barber.barberId}
              className={`rounded-2xl p-6 flex items-center justify-between relative overflow-hidden transition-all ${
                isTop
                  ? "bg-surface-container-high border-l-4 border-primary shadow-lg"
                  : "bg-surface-container-low hover:bg-surface-container-high"
              }`}
            >
              {isTop && (
                <span className="material-symbols-outlined absolute top-0 right-0 p-4 opacity-10 text-4xl text-primary">
                  workspace_premium
                </span>
              )}

              <div className="flex items-center gap-4">
                <div className="relative">
                  <div
                    className={`w-14 h-14 rounded-full flex items-center justify-center text-base font-bold ${
                      isTop
                        ? "bg-surface-container-highest border-2 border-primary/40 text-primary"
                        : "bg-surface-container-highest border-2 border-surface-container-highest text-on-surface-variant"
                    }`}
                  >
                    {initials}
                  </div>
                  <div
                    className={`absolute -top-1 -left-1 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black ${
                      isTop
                        ? "bg-primary text-on-primary"
                        : "bg-surface-container-highest text-on-surface"
                    }`}
                  >
                    {rank}
                  </div>
                </div>
                <div>
                  <h4 className="font-headline font-bold text-lg text-on-surface">
                    {barber.barberName}
                  </h4>
                  <p
                    className={`text-[9px] font-bold uppercase tracking-widest ${
                      isTop ? "text-tertiary" : "text-on-surface-variant"
                    }`}
                  >
                    {isTop ? "Top Performer" : "Active Barber"}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="font-headline font-extrabold text-2xl text-primary">
                  ${barber.income.toLocaleString()}
                </p>
                <p className="text-[9px] uppercase tracking-widest text-on-surface-variant font-bold">
                  This Month
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
