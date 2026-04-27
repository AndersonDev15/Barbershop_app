import axios from "axios";
import { useState, useEffect } from "react";
import type { BarberDashboardResponse } from "../types/barberDashboard";

export function useBarberDashboard() {
  const [data, setData] = useState<BarberDashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get<BarberDashboardResponse>(
        "http://127.0.0.1:8090/api/barber/dashboard",
        {
          withCredentials: true,
        },
      )
      .then((res) => setData(res.data))
      .catch(() => setError("No se pudo cargar el dashboard"))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}
