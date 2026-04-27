import { useState, useEffect, useCallback } from "react";
import api from "../../../../lib/api";
import type { BarberShopResponse } from "../../types/cliente.types";

export function useNearbyShops() {
  const [shops, setShops] = useState<BarberShopResponse[]>([]);
  const [city, setCity] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchShops = useCallback(async (detectedCity: string, page: number) => {
    setIsLoading(true);
    try {
      const { data } = await api.get("/api/client/barbershops", {
        params: { city: detectedCity, size: 8, page },
      });
      setShops(data.content || []);
      setTotalPages(data.totalPages || 0);
    } catch (err) {
      setError("No pudimos cargar las barberías cercanas.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocalización no soportada por tu navegador");
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const geoRes = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
          );
          const geoData = await geoRes.json();
          const detectedCity =
            geoData.address.city ??
            geoData.address.town ??
            geoData.address.county ??
            "Tu ubicación";

          setCity(detectedCity);
          await fetchShops(detectedCity, 0);
        } catch (err) {
          setError("No pudimos cargar las barberías cercanas.");
          setIsLoading(false);
        }
      },
      () => {
        setError("Activa la ubicación para ver barberías cercanas");
        setIsLoading(false);
      },
    );
  }, [fetchShops]);

  useEffect(() => {
    if (city) fetchShops(city, currentPage);
  }, [currentPage, city, fetchShops]);

  return {
    shops,
    city,
    isLoading,
    error,
    currentPage,
    totalPages,
    setCurrentPage,
  };
}
