import api from "../lib/api";
import { useState, useEffect } from "react";
import type { BarberDashboardResponse } from "../types/barberDashboard";

export function useBarberDashboard() {
  const [data, setData] = useState<BarberDashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<BarberDashboardResponse>("/api/barber/dashboard")
      .then((res) => setData(res.data))
      .catch(() => setError("No se pudo cargar el dashboard"))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}
