import { useState, useEffect } from "react";
import api from "../lib/api";

export interface AvailabilitySlot {
  time: string;
  status: "DISPONIBLE" | "OCUPADO" | "NO_DISPONIBLE" | string;
  clientName?: string;
}

export interface BarberAvailabilityResponse {
  barberId: number;
  barberName: string;
  date: string;
  allSlots: AvailabilitySlot[];
}

export function useBarberAvailability(date?: string) {
  const [data, setData] = useState<BarberAvailabilityResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAvailability = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await api.get<BarberAvailabilityResponse>(
          "/api/barber/availability",
          {
            params: { date },
          },
        );

        setData(response.data);
      } catch (err) {
        setError("No se pudo cargar la disponibilidad");
        console.error("Error fetching availability:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailability();
  }, [date]);

  return { data, loading, error };
}
