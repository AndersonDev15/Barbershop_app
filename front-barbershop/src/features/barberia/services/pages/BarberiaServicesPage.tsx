import { useState, useEffect } from "react";
import Sidebar from "../../common/components/Sidebar";
import Topbar from "../../common/components/Topbar";
import CreateCategoryModal from "../components/CreateCategoryModal";
import CreateServiceModal from "../components/CreateServiceModal";
import api from "../../../../lib/api";
import type {
  CategoryWithSubs,
  SubCategoryResponse,
} from "../../types/services.types";

const colorMap: Record<string, { icon: string; badge: string; dot: string }> = {
  primary: {
    icon: "bg-[#f2ca50]/10 text-[#f2ca50]",
    badge: "bg-[#f2ca50]/20 text-[#f2ca50]",
    dot: "bg-[#f2ca50]",
  },
  tertiary: {
    icon: "bg-[#3de1fc]/10 text-[#3de1fc]",
    badge: "bg-[#3de1fc]/20 text-[#3de1fc]",
    dot: "bg-[#3de1fc]",
  },
  gold: {
    icon: "bg-[#d4af37]/10 text-[#d4af37]",
    badge: "bg-[#d4af37]/20 text-[#d4af37]",
    dot: "bg-[#d4af37]",
  },
};

export default function BarberiaServicesPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCreateCategoryOpen, setIsCreateCategoryOpen] = useState(false);
  const [serviceModal, setServiceModal] = useState<{
    isOpen: boolean;
    categoryId: number;
    categoryName: string;
  }>({
    isOpen: false,
    categoryId: 0,
    categoryName: "",
  });

  // API States
  const [categories, setCategories] = useState<CategoryWithSubs[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get<CategoryWithSubs[]>(
        "/api/barbershop/services",
      );
      setCategories(
        response.data.map((cat) => ({
          ...cat,
          subcategories: [],
          expanded: false,
          loadingServices: false,
        })),
      );
    } catch (err: any) {
      console.error("Error fetching categories:", err);
      setError(
        err.response?.data?.message ||
          "Failed to load categories. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch subcategories when expanding a category
  const toggleExpanded = async (id: number) => {
    const category = categories.find((c) => c.id === id);
    if (!category) return;

    // If already expanded, just collapse
    if (category.expanded) {
      setCategories((prev) =>
        prev.map((c) => (c.id === id ? { ...c, expanded: false } : c)),
      );
      return;
    }

    // If subcategories already loaded, just expand
    if (category.subcategories.length > 0) {
      setCategories((prev) =>
        prev.map((c) => (c.id === id ? { ...c, expanded: true } : c)),
      );
      return;
    }

    // Fetch subcategories
    setCategories((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, expanded: true, loadingServices: true } : c,
      ),
    );

    try {
      const response = await api.get<SubCategoryResponse[]>(
        `/api/barbershop/services/${id}/subcategory`,
      );
      setCategories((prev) =>
        prev.map((c) =>
          c.id === id
            ? { ...c, subcategories: response.data, loadingServices: false }
            : c,
        ),
      );
    } catch (err) {
      console.error("Error fetching subcategories:", err);
      setCategories((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, expanded: false, loadingServices: false } : c,
        ),
      );
    }
  };

  // Toggle category active status
  const toggleActive = async (id: number) => {
    const category = categories.find((c) => c.id === id);
    if (!category) return;

    const newStatus = category.status === "ACTIVO" ? "INACTIVO" : "ACTIVO";
    const endpoint =
      newStatus === "ACTIVO"
        ? `/api/barbershop/services/${id}/activate`
        : `/api/barbershop/services/${id}/desactivate`;

    try {
      await api.patch(endpoint);
      setCategories((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c)),
      );
    } catch (err) {
      console.error("Error toggling category status:", err);
    }
  };

  // Create category
  const handleCreateCategory = async (data: {
    name: string;
    description: string;
  }) => {
    try {
      const response = await api.post("/api/barbershop/services", data);
      const newCategory: CategoryWithSubs = {
        ...response.data,
        subcategories: [],
        expanded: false,
        loadingServices: false,
      };
      setCategories((prev) => [...prev, newCategory]);
      setIsCreateCategoryOpen(false);
    } catch (err) {
      console.error("Error creating category:", err);
    }
  };

  // Create service
  const handleCreateService = async (data: {
    name: string;
    description: string;
    duration: number;
    price: number;
  }) => {
    try {
      const response = await api.post<SubCategoryResponse>(
        `/api/barbershop/services/${serviceModal.categoryId}/subcategory`,
        data,
      );
      setCategories((prev) =>
        prev.map((c) =>
          c.id === serviceModal.categoryId
            ? { ...c, subcategories: [...c.subcategories, response.data] }
            : c,
        ),
      );
      setServiceModal((prev) => ({ ...prev, isOpen: false }));
    } catch (err) {
      console.error("Error creating service:", err);
    }
  };

  // Stats calculations
  const totalCategories = categories.length;
  const activeServices = categories
    .filter((c) => c.status === "ACTIVO")
    .reduce((acc, c) => acc + c.subcategories.length, 0);
  const allPrices = categories.flatMap((c) =>
    c.subcategories.map((s) => s.price),
  );
  const avgPrice =
    allPrices.length > 0
      ? allPrices.reduce((a, b) => a + b, 0) / allPrices.length
      : 0;

  const getCategoryColor = (index: number) => {
    const colors = ["primary", "tertiary", "gold"];
    return colors[index % 3];
  };

  const getCategoryIcon = (index: number) => {
    const icons = ["content_cut", "face_retouching_natural", "spa"];
    return icons[index % 3];
  };

  if (isLoading) {
    return (
      <div className="flex h-screen overflow-hidden bg-surface text-on-surface">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        <div className="flex flex-col flex-1 overflow-hidden w-full min-w-0">
          <Topbar
            isOpen={isSidebarOpen}
            onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
            pageTitle="Services"
          />
          <main className="flex-1 overflow-y-auto bg-surface-dim p-4 md:p-8 max-w-[1600px] mx-auto w-full space-y-8">
            <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
              <span className="material-symbols-outlined text-5xl text-primary animate-spin">
                progress_activity
              </span>
              <p className="text-on-surface-variant font-bold uppercase tracking-widest text-sm">
                Loading services...
              </p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen overflow-hidden bg-surface text-on-surface">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        <div className="flex flex-col flex-1 overflow-hidden w-full min-w-0">
          <Topbar
            isOpen={isSidebarOpen}
            onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
            pageTitle="Services"
          />
          <main className="flex-1 overflow-y-auto bg-surface-dim p-4 md:p-8 max-w-[1600px] mx-auto w-full space-y-8">
            <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
              <span className="material-symbols-outlined text-5xl text-error">
                error
              </span>
              <p className="text-red-400 font-bold text-center max-w-md">
                {error}
              </p>
              <button
                onClick={fetchCategories}
                className="mt-4 px-6 py-2 bg-surface-container rounded-full text-primary font-bold hover:bg-surface-container-high transition-colors"
              >
                Retry
              </button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-surface text-on-surface">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex flex-col flex-1 overflow-hidden w-full min-w-0">
        <Topbar
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          pageTitle="Services"
        />

        <main className="flex-1 overflow-y-auto bg-surface-dim p-4 md:p-8 max-w-[1600px] mx-auto w-full space-y-8">
          <section className="flex-1 p-0 md:p-4">
            {/* Header */}
            <div className="flex flex-col mb-8 md:mb-12">
              <div className="flex flex-col md:flex-row md:items-center justify-between w-full gap-6">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#f2ca50] mb-2">
                    Service Architecture
                  </p>
                  <h2 className="text-3xl md:text-5xl font-extrabold text-[#e5e2e1] tracking-tighter font-['Manrope']">
                    Categories
                  </h2>
                </div>
                <button
                  onClick={() => setIsCreateCategoryOpen(true)}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#f2ca50] text-[#3c2f00] font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-[#f2ca50]/10"
                >
                  <span className="material-symbols-outlined text-lg">
                    category
                  </span>
                  Add Category
                </button>
              </div>
            </div>

            {/* Categories Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
              {categories.map((cat, index) => {
                const colorKey = getCategoryColor(index);
                const colors = colorMap[colorKey];
                const icon = getCategoryIcon(index);

                return (
                  <div
                    key={cat.id}
                    className={`bg-[#1c1b1b] rounded-xl border border-white/5 flex flex-col transition-all ${
                      cat.status === "INACTIVO" ? "opacity-60" : ""
                    }`}
                  >
                    {/* Card Header */}
                    <div className="flex items-center justify-between p-6 pb-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`h-11 w-11 rounded-2xl flex items-center justify-center ${colors.icon}`}
                        >
                          <span
                            className="material-symbols-outlined text-xl"
                            style={{ fontVariationSettings: "'FILL' 1" }}
                          >
                            {icon}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-[#e5e2e1] font-['Manrope']">
                            {cat.name}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span
                              className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${colors.badge}`}
                            >
                              {cat.status === "ACTIVO" ? "Active" : "Inactive"}
                            </span>
                            <button
                              onClick={() => toggleActive(cat.id)}
                              className="text-[10px] font-black uppercase tracking-widest text-[#99907c] hover:text-[#f2ca50] transition-colors"
                            >
                              ·{" "}
                              {cat.status === "ACTIVO"
                                ? "Deactivate"
                                : "Activate"}
                            </button>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleExpanded(cat.id)}
                        className="h-9 w-9 rounded-lg flex items-center justify-center text-[#99907c] hover:bg-[#2a2a2a] transition-all"
                      >
                        <span className="material-symbols-outlined transition-transform duration-300">
                          {cat.loadingServices ? (
                            <span className="animate-spin">
                              progress_activity
                            </span>
                          ) : (
                            "expand_more"
                          )}
                        </span>
                      </button>
                    </div>

                    {/* Services list — collapsible */}
                    {cat.expanded && (
                      <div className="px-6 pb-6 flex flex-col gap-3">
                        {cat.loadingServices ? (
                          <div className="flex items-center justify-center py-8">
                            <span className="material-symbols-outlined text-3xl text-[#f2ca50] animate-spin">
                              progress_activity
                            </span>
                          </div>
                        ) : (
                          <>
                            {cat.subcategories.map((sub) => (
                              <div
                                key={sub.id}
                                className="flex items-center justify-between p-4 bg-[#131313] rounded-lg border border-white/5 hover:bg-[#201f1f] transition-all cursor-pointer"
                              >
                                <div>
                                  <p className="text-[10px] uppercase tracking-widest text-[#99907c] mb-0.5">
                                    {sub.description.length > 8
                                      ? sub.description.substring(0, 8) + "..."
                                      : sub.description}
                                  </p>
                                  <p className="text-sm font-semibold text-[#e5e2e1] font-['Manrope']">
                                    {sub.name}
                                  </p>
                                  <p className="text-xs text-[#99907c] mt-0.5">
                                    {sub.duration} min
                                  </p>
                                </div>
                                <p className="font-bold text-[#f2ca50] font-['Manrope'] text-base">
                                  ${sub.price.toLocaleString("es-CO")}
                                </p>
                              </div>
                            ))}

                            {/* New service button */}
                            <button
                              onClick={() =>
                                setServiceModal({
                                  isOpen: true,
                                  categoryId: cat.id,
                                  categoryName: cat.name,
                                })
                              }
                              className="w-full mt-1 py-3 rounded-xl border border-dashed border-[#4d4635]/30 text-[#99907c] text-xs font-bold uppercase tracking-widest hover:border-[#f2ca50]/50 hover:text-[#f2ca50] transition-all"
                            >
                              + New {cat.name} Service
                            </button>
                          </>
                        )}
                      </div>
                    )}

                    {/* Collapsed summary */}
                    {!cat.expanded && (
                      <div className="px-6 pb-5">
                        <p className="text-xs text-[#99907c]">
                          {cat.subcategories.length} services
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Empty State */}
            {categories.length === 0 && (
              <div className="mt-12 mb-4">
                <div className="relative overflow-hidden rounded-xl bg-[#0e0e0e] border border-dashed border-[#4d4635]/20 p-12 md:p-16 flex flex-col items-center justify-center text-center">
                  <div className="absolute inset-0 opacity-10 pointer-events-none bg-gradient-to-br from-[#f2ca50]/20 to-transparent" />
                  <div className="relative z-10">
                    <div className="h-20 w-20 rounded-full bg-[#2a2a2a] flex items-center justify-center mb-6 mx-auto">
                      <span className="material-symbols-outlined text-4xl text-[#353534]">
                        inventory_2
                      </span>
                    </div>
                    <h4 className="text-2xl font-bold text-[#d0c5af] mb-3 font-['Manrope']">
                      Expanding Your Atelier?
                    </h4>
                    <p className="text-[#99907c] max-w-md mx-auto mb-8 text-sm">
                      Create your first service category to define the grooming
                      experience. Categories help organize your schedule and
                      online booking for clients.
                    </p>
                    <button
                      onClick={() => setIsCreateCategoryOpen(true)}
                      className="px-8 py-4 rounded-full border-2 border-[#f2ca50] text-[#f2ca50] font-bold hover:bg-[#f2ca50] hover:text-[#3c2f00] transition-all"
                    >
                      Define New Category
                    </button>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* Stats Footer */}
          <footer className="mt-auto px-8 py-6 bg-[#1c1b1b]/50 backdrop-blur-md border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-wrap gap-8 md:gap-12 justify-center">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-widest text-[#99907c]">
                  Total Categories
                </span>
                <span className="text-xl font-extrabold text-[#e5e2e1] font-['Manrope']">
                  {totalCategories.toString().padStart(2, "0")}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-widest text-[#99907c]">
                  Active Services
                </span>
                <span className="text-xl font-extrabold text-[#e5e2e1] font-['Manrope']">
                  {activeServices.toString().padStart(2, "0")}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-widest text-[#99907c]">
                  Avg. Service Price
                </span>
                <span className="text-xl font-extrabold text-[#f2ca50] font-['Manrope']">
                  {avgPrice > 0 ? `$${avgPrice.toLocaleString("es-CO")}` : "$—"}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs text-[#99907c] italic">
                All changes are saved automatically
              </span>
              <div className="h-2 w-2 rounded-full bg-[#3de1fc] shadow-[0_0_8px_rgba(61,225,252,0.6)]"></div>
            </div>
          </footer>
        </main>
      </div>

      <CreateCategoryModal
        isOpen={isCreateCategoryOpen}
        onClose={() => setIsCreateCategoryOpen(false)}
        onSubmit={handleCreateCategory}
      />

      <CreateServiceModal
        isOpen={serviceModal.isOpen}
        onClose={() => setServiceModal((prev) => ({ ...prev, isOpen: false }))}
        categoryId={serviceModal.categoryId}
        categoryName={serviceModal.categoryName}
        onSubmit={handleCreateService}
      />
    </div>
  );
}
