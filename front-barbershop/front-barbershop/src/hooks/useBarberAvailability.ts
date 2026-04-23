import { useState, useEffect } from "react";
import axios from "axios";

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
        const response = await axios.get<BarberAvailabilityResponse>(
          "http://127.0.0.1:8090/api/barber/availability",
          {
            params: { date },
            withCredentials: true,
          }
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
