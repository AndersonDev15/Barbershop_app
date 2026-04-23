import { useState } from "react";
import { useParams } from "react-router-dom";
import type {
  CategoryResponse,
  SubCategoryResponse,
} from "../../types/cliente.types";
import { getSubcategories } from "../../detail/services/subcategoryApi";

interface ClienteServiceMenuProps {
  onBookNow?: () => void;
  categories?: CategoryResponse[];
}

export default function ClienteServiceMenu({
  onBookNow,
  categories = [],
}: ClienteServiceMenuProps) {
  const { id: barbershopId } = useParams<{ id: string }>();
  const [expandedIds, setExpandedIds] = useState<number[]>([]);
  const [subcategoriesCache, setSubcategoriesCache] = useState<
    Record<number, SubCategoryResponse[]>
  >({});
  const [loadingCategories, setLoadingCategories] = useState<
    Record<number, boolean>
  >({});

  const toggleCategory = async (categoryId: number) => {
    const isExpanded = expandedIds.includes(categoryId);

    if (isExpanded) {
      setExpandedIds(expandedIds.filter((id) => id !== categoryId));
    } else {
      setExpandedIds([...expandedIds, categoryId]);

      // Fetch subcategories if not in cache
      if (!subcategoriesCache[categoryId] && barbershopId) {
        setLoadingCategories((prev) => ({ ...prev, [categoryId]: true }));
        try {
          const subs = await getSubcategories(Number(barbershopId), categoryId);
          setSubcategoriesCache((prev) => ({ ...prev, [categoryId]: subs }));
        } catch (err) {
          console.error("Error fetching subcategories:", err);
        } finally {
          setLoadingCategories((prev) => ({ ...prev, [categoryId]: false }));
        }
      }
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getCategoryIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes("hair")) return "content_cut";
    if (n.includes("beard") || n.includes("shave")) return "face";
    if (n.includes("spa") || n.includes("treatment")) return "spa";
    return "brush";
  };

  return (
    <section className="space-y-10">
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl md:text-3xl font-headline font-extrabold tracking-tight text-on-surface">
            Service Menu
          </h2>
          {onBookNow && (
            <button
              onClick={onBookNow}
              className="bg-primary text-on-primary px-6 py-3 rounded-full font-bold text-sm shadow-[0_8px_24px_rgba(242,202,80,0.3)] hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">
                event_available
              </span>
              Book Now
            </button>
          )}
        </div>

        <div className="space-y-4">
          {categories.map((category) => {
            const isExpanded = expandedIds.includes(category.id);
            const services = subcategoriesCache[category.id] || [];
            const isLoading = loadingCategories[category.id];

            return (
              <div
                key={category.id}
                className="bg-surface-container rounded-lg overflow-hidden border border-outline-variant/5"
              >
                <button
                  onClick={() => toggleCategory(category.id)}
                  className="w-full flex justify-between items-center p-5 hover:bg-surface-bright transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary text-xl">
                        {getCategoryIcon(category.name)}
                      </span>
                    </div>
                    <div className="text-left">
                      <h3 className="text-base font-bold font-headline text-on-surface">
                        {category.name}
                      </h3>
                      <p className="text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-widest">
                        {category.description}
                      </p>
                    </div>
                  </div>
                  {isLoading ? (
                    <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full" />
                  ) : (
                    <span
                      className={`material-symbols-outlined text-on-surface-variant transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
                    >
                      expand_more
                    </span>
                  )}
                </button>

                {isExpanded && (
                  <div className="px-5 pb-5 pt-0 space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="h-px w-full bg-outline-variant/10 mb-4" />
                    {services.map((service) => (
                      <div
                        key={service.id}
                        className="flex justify-between items-center p-3 rounded-md hover:bg-surface-bright/50 transition-colors"
                      >
                        <div className="flex items-center gap-4 flex-1 min-w-0 pr-4">
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-on-surface">
                              {service.name}
                            </p>
                            <p className="text-xs text-on-surface-variant line-clamp-1">
                              {service.description}
                            </p>
                            <span className="text-[10px] font-bold text-primary/60 uppercase tracking-tighter">
                              {service.duration} MIN
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-black font-headline text-primary">
                            {formatCurrency(service.price)}
                          </span>
                        </div>
                      </div>
                    ))}
                    {services.length === 0 && !isLoading && (
                      <p className="text-center py-4 text-xs text-on-surface-variant italic">
                        No services available in this category.
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
