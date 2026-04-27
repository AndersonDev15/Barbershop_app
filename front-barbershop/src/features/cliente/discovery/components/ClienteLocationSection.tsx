import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface ClienteLocationSectionProps {
  address?: string;
  city?: string;
  department?: string;
  todaySchedules?: string[];
  openNow?: boolean;
}

// Fix del ícono por defecto de Leaflet con Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function ClienteLocationSection({
  address,
  city,
  department,
  todaySchedules = [],
  openNow = false,
}: ClienteLocationSectionProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  const fullAddress = [address, city, department].filter(Boolean).join(", ");

  const schedulesText =
    todaySchedules.length > 0
      ? todaySchedules.join("  |  ")
      : "Sin horario hoy";

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Coordenadas por defecto (Colombia centro) mientras geocodifica
    const defaultCoords: [number, number] = [4.5709, -74.2973];

    const map = L.map(mapRef.current, {
      zoomControl: true,
      scrollWheelZoom: false,
    }).setView(defaultCoords, 5);

    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
      {
        attribution: '© <a href="https://carto.com/">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 19,
      },
    ).addTo(map);

    mapInstanceRef.current = map;

    // Geocodificar la dirección con Nominatim
    if (fullAddress) {
      fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(fullAddress)}&format=json&limit=1`,
        { headers: { "Accept-Language": "es" } },
      )
        .then((res) => res.json())
        .then((results) => {
          if (results.length > 0) {
            const { lat, lon } = results[0];
            const coords: [number, number] = [parseFloat(lat), parseFloat(lon)];
            map.setView(coords, 16);
            L.marker(coords)
              .addTo(map)
              .bindPopup(
                `<strong>${address}</strong><br/>${city}, ${department}`,
              )
              .openPopup();
          }
        })
        .catch(console.error);
    }

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [fullAddress]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Mapa real */}
      <div className="lg:col-span-8 rounded-lg overflow-hidden relative min-h-[300px] md:min-h-[400px]">
        <div
          ref={mapRef}
          className="w-full h-full min-h-[300px] md:min-h-[400px]"
        />

        {/* Card inferior sobre el mapa */}
        <div className="absolute bottom-4 left-4 right-4 p-4 bg-surface-container-lowest/80 backdrop-blur-xl rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4 z-[1000]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined">location_on</span>
            </div>
            <div>
              <p className="text-xs font-black text-on-surface uppercase tracking-widest">
                Our Location
              </p>
              <p className="text-[10px] text-on-surface-variant font-bold uppercase truncate max-w-[150px] sm:max-w-none">
                {address}
              </p>
            </div>
          </div>
          <button
            onClick={() =>
              window.open(
                `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`,
                "_blank",
              )
            }
            className="w-full sm:w-auto px-6 py-2 bg-primary text-on-primary rounded-full text-[10px] font-black uppercase tracking-widest hover:brightness-110 transition-all"
          >
            Get Directions
          </button>
        </div>
      </div>

      {/* Info lateral */}
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/10">
          <h3 className="text-lg font-headline font-black text-on-surface uppercase tracking-tight mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">
              schedule
            </span>
            Hours
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-on-surface-variant uppercase">
                Today
              </span>
              <span
                className={`text-[10px] font-black uppercase tracking-widest ${openNow ? "text-tertiary" : "text-error"}`}
              >
                {openNow ? "Open Now" : "Closed"}
              </span>
            </div>
            <p className="text-sm font-bold text-on-surface leading-relaxed">
              {schedulesText}
            </p>
          </div>
        </div>

        <div className="bg-primary/5 p-6 rounded-2xl border border-primary/10">
          <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2">
            Contact Us
          </h3>
          <p className="text-sm font-bold text-on-surface">
            ¿Tienes alguna pregunta sobre nuestros servicios o ubicación?
          </p>
          <button className="mt-4 w-full py-3 border-2 border-primary text-primary rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-on-primary transition-all">
            Call Atelier
          </button>
        </div>
      </div>
    </div>
  );
}
