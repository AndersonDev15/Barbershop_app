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
        <div className="absolute bottom-4 left-4 right-4 p-4 bg-surface-container-lowest/80 backdrop-blur-xl rounded-lg flex flex-col md:flex-row items-center justify-between gap-4 z-[1000]">
          <div>
            <h4 className="text-xl font-headline font-extrabold text-on-surface">
              Location
            </h4>
            <p className="text-on-surface-variant text-sm mt-1">
              {fullAddress || "Dirección no disponible"}
            </p>
          </div>

          <a
            href={`https://www.openstreetmap.org/search?query=${encodeURIComponent(fullAddress)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-primary-container text-on-primary px-5 py-2.5 rounded-full font-bold text-sm hover:scale-[1.02] transition-transform"
          >
            Directions
          </a>
        </div>
      </div>

      {/* Stats column */}
      <div className="lg:col-span-4 flex flex-col gap-6">
        <div className="bg-surface-container-high p-6 rounded-lg flex-1 border border-outline-variant/5">
          <p className="text-on-surface-variant text-xs uppercase tracking-widest mb-2">
            Available Today
          </p>
          <p
            className={`text-2xl font-headline font-bold ${openNow ? "text-tertiary" : "text-on-surface-variant"}`}
          >
            {schedulesText}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <div
              className={`w-2 h-2 rounded-full ${openNow ? "bg-tertiary shadow-[0_0_8px_#3de1fc]" : "bg-on-surface-variant"}`}
            />
            <span
              className={`text-sm font-medium ${openNow ? "text-tertiary" : "text-on-surface-variant"}`}
            >
              {openNow ? "Currently Open" : "Currently Closed"}
            </span>
          </div>
        </div>

        <div className="bg-surface-container-high p-6 rounded-lg flex-1 border border-outline-variant/5">
          <p className="text-on-surface-variant text-xs uppercase tracking-widest mb-3">
            Appointments
          </p>
          <p className="text-on-surface text-sm leading-relaxed">
            Fastest available today at{" "}
            <span className="text-primary font-bold">14:30</span> with Enzo R.
          </p>
          <button className="text-sm text-primary font-bold flex items-center gap-1 mt-4 hover:underline">
            View All Slots{" "}
            <span className="material-symbols-outlined text-sm">
              arrow_forward
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
