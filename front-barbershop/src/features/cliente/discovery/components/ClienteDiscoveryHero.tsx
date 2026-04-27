import ClienteSearchBar from "./ClienteSearchBar";

export default function ClienteDiscoveryHero() {
  return (
    <section className="relative px-6 md:px-12 py-12 md:py-16 flex flex-col items-center text-center max-w-7xl mx-auto z-20">
      {/* Contenedor para los círculos decorativos con overflow-hidden */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 blur-[120px] rounded-full"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-tertiary/5 blur-[120px] rounded-full"></div>
      </div>
      
      <div className="relative z-10 w-full max-w-4xl">
        <span className="font-headline uppercase tracking-[0.3em] text-[9px] font-extrabold text-primary mb-3 block">
          Descubre tu Estilo
        </span>
        <h1 className="font-headline text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-on-surface tracking-tighter mb-4 leading-[1.1]">
          Encuentra la barbería perfecta <span className="text-primary italic">cerca de ti</span>
        </h1>
        <p className="font-body text-on-surface-variant/80 text-sm md:text-lg max-w-2xl mx-auto mb-8 md:mb-10 px-4 md:px-0">
          Explora, compara y reserva en segundos con los maestros del arte del afeitado.
        </p>
        
        <div className="w-full max-w-2xl mx-auto">
          <ClienteSearchBar variant="hero" />
        </div>
      </div>
    </section>
  );
}
