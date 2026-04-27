import { useNearbyShops } from "../hooks/useNearbyShops";
import ClienteShopCard from "./ClienteShopCard";

export default function ClienteFeaturedShops() {
  const { shops, city, isLoading, error } = useNearbyShops();

  if (isLoading) {
    return (
      <section className="px-6 md:px-12 py-12 max-w-7xl mx-auto">
        <div className="mb-10">
          <div className="h-3 w-24 bg-surface-container-highest rounded animate-pulse mb-3" />
          <div className="h-8 w-64 bg-surface-container-highest rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-surface-container-low rounded-2xl h-[360px] animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="px-6 md:px-12 py-12 max-w-7xl mx-auto">
        <div className="flex flex-col items-center justify-center py-20 bg-surface-container-low rounded-3xl border border-outline-variant/5">
          <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mb-6 text-error">
            <span className="material-symbols-outlined text-3xl">location_off</span>
          </div>
          <h3 className="text-xl font-headline font-black text-on-surface uppercase italic mb-2">
            Ubicación necesaria
          </h3>
          <p className="text-on-surface-variant text-sm text-center max-w-xs px-4">
            {error}
          </p>
        </div>
      </section>
    );
  }

  if (shops.length === 0) {
    return (
      <section className="px-6 md:px-12 py-12 max-w-7xl mx-auto">
        <div className="mb-10">
          <span className="font-headline uppercase tracking-[0.2em] text-[10px] font-bold text-primary mb-2 block">
            Barberías en {city}
          </span>
          <h2 className="font-headline text-3xl font-extrabold text-on-surface italic uppercase tracking-tight">
            No encontramos barberías
          </h2>
        </div>
        <div className="flex flex-col items-center justify-center py-20 bg-surface-container-low rounded-3xl border border-outline-variant/5">
          <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center mb-6 text-on-surface-variant/40">
            <span className="material-symbols-outlined text-3xl">search_off</span>
          </div>
          <p className="text-on-surface-variant text-sm text-center max-w-xs px-4">
            No encontramos barberías disponibles en {city} en este momento.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="px-4 md:px-12 py-10 md:py-12 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 md:mb-10 gap-4">
        <div>
          <span className="font-headline uppercase tracking-[0.2em] text-[10px] font-bold text-primary mb-2 block">
            {city ? `Barberías en ${city}` : "Barberías destacadas"}
          </span>
          <h2 className="font-headline text-2xl md:text-3xl font-extrabold text-on-surface italic uppercase tracking-tight">
            Descubre tu estilo
          </h2>
        </div>
        <button className="text-primary font-label font-black text-[10px] uppercase tracking-widest hover:opacity-80 transition-opacity flex items-center gap-2 group">
          Ver todas <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
        </button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
        {shops.map((shop) => (
          <ClienteShopCard key={shop.id} shop={shop} />
        ))}
      </div>
    </section>
  );
}
