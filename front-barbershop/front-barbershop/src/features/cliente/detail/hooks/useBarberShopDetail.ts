import { useState, useEffect } from "react";
import { getBarberShopFull } from "../services/detailApi";
import type { BarberShopFullResponse } from "../../types/cliente.types";

export function useBarberShopDetail(id: number | null) {
  const [data, setData] = useState<BarberShopFullResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id === null || isNaN(id)) return;

    const abortController = new AbortController();

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await getBarberShopFull(id);
        setData(result);
      } catch (err: any) {
        if (err.name === 'CanceledError' || err.name === 'AbortError') return;
        console.error("Error fetching barbershop detail:", err);
        setError("No se pudo cargar la barbería.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    return () => {
      abortController.abort();
    };
  }, [id]);

  return { data, isLoading, error };
}
