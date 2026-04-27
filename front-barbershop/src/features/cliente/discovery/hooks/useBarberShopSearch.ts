import { useState, useEffect, useRef } from "react";
import { searchBarberShop } from "../services/discoveryApi";
import type { BarberShopResponse } from "../../types/cliente.types";

export function useBarberShopSearch() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<BarberShopResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const trimmed = query.trim();

    if (trimmed.length < 2) {
      setSuggestions([]);
      setError(null);
      return;
    }

    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(async () => {
      setIsLoading(true);
      setError(null);

      try {
        const results = await searchBarberShop(trimmed);
        // Normalize to array
        setSuggestions(Array.isArray(results) ? results : []);
      } catch (err: any) {
        if (err?.response?.status === 404) {
          setSuggestions([]); // ← no hay resultados, sin error
        } else {
          setError("No se pudo completar la búsqueda.");
        }
      } finally {
        setIsLoading(false);
      }
    }, 350);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [query]);

  const clearSuggestions = () => setSuggestions([]);

  return { query, setQuery, suggestions, isLoading, error, clearSuggestions };
}
