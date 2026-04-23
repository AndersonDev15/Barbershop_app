import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useBarberShopSearch } from "../hooks/useBarberShopSearch";
import type { BarberShopResponse } from "../../types/cliente.types";

interface ClienteSearchBarProps {
  variant?: "hero" | "navbar";
}

export default function ClienteSearchBar({
  variant = "hero",
}: ClienteSearchBarProps) {
  const isNavbar = variant === "navbar";
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const blurTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { query, setQuery, suggestions, isLoading, error, clearSuggestions } =
    useBarberShopSearch();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (shop: BarberShopResponse) => {
    if (blurTimeoutRef.current) clearTimeout(blurTimeoutRef.current);
    setQuery(shop.name);
    setShowSuggestions(false);
    clearSuggestions();
    navigate(`/cliente/barbershop/${shop.id}`);
  };

  const handleBlur = () => {
    blurTimeoutRef.current = setTimeout(() => {
      setShowSuggestions(false);
    }, 150);
  };

  const highlightText = (text: string, highlight: string) => {
    if (!highlight.trim()) return text;
    const parts = text.split(new RegExp(`(${highlight})`, "gi"));
    return (
      <span>
        {parts.map((part, i) =>
          part.toLowerCase() === highlight.toLowerCase() ? (
            <span key={i} className="text-primary font-bold">
              {part}
            </span>
          ) : (
            part
          ),
        )}
      </span>
    );
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      <div
        className={`
        w-full transition-all duration-300 flex items-center group
        ${
          isNavbar
            ? "max-w-md bg-surface-container-low/50 p-1 rounded-full border border-outline-variant/10 focus-within:border-primary/30 focus-within:bg-surface-container-low"
            : "max-w-3xl mx-auto bg-surface-container-low p-2 rounded-full border border-outline-variant/10 shadow-2xl focus-within:border-primary/30"
        }
      `}
      >
        <div
          className={`flex-1 flex items-center ${isNavbar ? "px-4" : "px-6"}`}
        >
          {isLoading ? (
            <span
              className={`material-symbols-outlined text-primary animate-spin ${isNavbar ? "text-lg mr-2" : "text-xl mr-4"}`}
            >
              progress_activity
            </span>
          ) : (
            <span
              className={`
              material-symbols-outlined text-outline group-focus-within:text-primary transition-colors
              ${isNavbar ? "text-lg mr-2" : "text-xl mr-4"}
            `}
            >
              search
            </span>
          )}
          <input
            className={`
              bg-transparent border-none focus:ring-0 text-on-surface placeholder:text-on-surface-variant/40 w-full outline-none
              ${isNavbar ? "py-1.5 text-sm" : "py-4 text-lg"}
            `}
            placeholder={
              isNavbar
                ? "Buscar..."
                : "Buscar barberías por nombre o ubicación..."
            }
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => query.length >= 2 && setShowSuggestions(true)}
            onBlur={handleBlur}
          />
        </div>
        <button
          className={`
          bg-primary text-on-primary rounded-full font-headline font-bold uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all
          ${isNavbar ? "px-4 py-1.5 text-[10px]" : "px-6 md:px-10 py-3 md:py-4 text-xs md:sm"}
        `}
        >
          {isNavbar ? "Ir" : "Explorar"}
        </button>
      </div>

      {/* Error Message */}
      {error && !isLoading && query.length >= 2 && (
        <div className="absolute left-0 right-0 mt-2 px-6 py-3 bg-error/10 border border-error/20 rounded-2xl z-[110] animate-in fade-in slide-in-from-top-1">
          <p className="text-error text-xs font-bold uppercase tracking-widest">
            {error}
          </p>
        </div>
      )}

      {/* Dropdown de Sugerencias Real */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          className={`
          absolute left-0 right-0 mt-2 bg-surface-container-high border border-outline-variant/15 rounded-2xl shadow-2xl z-[110] overflow-hidden animate-in fade-in zoom-in-95 duration-200
          ${isNavbar ? "max-w-md mx-auto md:mx-0" : "max-w-3xl mx-auto"}
        `}
        >
          <div className="max-h-[300px] overflow-y-auto no-scrollbar py-2">
            {suggestions.map((shop) => (
              <button
                key={shop.id}
                onMouseDown={(e) => e.preventDefault()} // Prevent blur before click
                onClick={() => handleSelect(shop)}
                className="w-full text-left px-6 py-4 hover:bg-surface-bright transition-colors flex items-center justify-between gap-4 group"
              >
                <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                  <span className="text-on-surface font-headline font-bold text-sm group-hover:text-primary transition-colors truncate">
                    {highlightText(shop.name, query)}
                  </span>
                  <span className="text-on-surface-variant text-[11px] truncate">
                    {highlightText(shop.address, query)}
                  </span>
                </div>

                <div
                  className={`shrink-0 px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-widest ${shop.openNow ? "bg-tertiary/10 text-tertiary" : "bg-on-surface-variant/10 text-on-surface-variant"}`}
                >
                  {shop.openNow ? "Abierto ahora" : "Cerrado"}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
