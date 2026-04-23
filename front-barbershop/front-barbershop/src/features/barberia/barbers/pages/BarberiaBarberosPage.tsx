import { useState, useEffect, useCallback, useRef } from "react";
import Sidebar from "../../common/components/Sidebar";
import Topbar from "../../common/components/Topbar";
import Avatar from "../../../../components/ui/Avatar";
import ChangeStatusModal from "../components/ChangeStatusModal";
import EditCommissionModal from "../components/EditCommissionModal";
import AddBarberModal from "../components/AddBarberModal";
import BarberDetailPanel from "../components/BarberDetailPanel";
import api from "../../../../lib/api";
import type {
  BarberItem,
  BarberStatus,
  PageResponse,
  BarberAvailability,
} from "../../types/barbers.types";

export default function BarberiaBarberosPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<BarberStatus | "all">("all");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // API States
  const [barbers, setBarbers] = useState<BarberItem[]>([]);
  const [pageData, setPageData] = useState<{
    totalPages: number;
    totalElements: number;
    number: number;
    first: boolean;
    last: boolean;
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal action loading/error states
  const [statusLoading, setStatusLoading] = useState(false);
  const [commissionLoading, setCommissionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const fetchBarbers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get<PageResponse<BarberItem>>(
        `/api/barbershop/barbers`,
        {
          params: {
            page: currentPage,
            size: 4,
            status: activeFilter === "all" ? undefined : activeFilter,
            search: debouncedSearch || undefined,
          },
        },
      );
      setBarbers(response.data.content);
      const { content, ...pagination } = response.data;
      setPageData(pagination);
    } catch (err: any) {
      console.error("Error fetching barbers:", err);
      setError(
        err.response?.data?.message ||
          "Failed to load barbers. Please try again later.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, activeFilter, debouncedSearch]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(0);
  }, [activeFilter, debouncedSearch]);

  // Fetch when page or filters change
  useEffect(() => {
    fetchBarbers();
  }, [fetchBarbers]);

  const [statusModal, setStatusModal] = useState<{
    isOpen: boolean;
    barberId: number;
    currentStatus: BarberStatus;
    barberName: string;
  }>({
    isOpen: false,
    barberId: 0,
    currentStatus: "ACTIVO",
    barberName: "",
  });

  const [editModal, setEditModal] = useState<{
    isOpen: boolean;
    barberId: number;
    barberName: string;
    barberRole: string;
    currentCommission: number;
  }>({
    isOpen: false,
    barberId: 0,
    barberName: "",
    barberRole: "",
    currentCommission: 50,
  });

  const [detailPanel, setDetailPanel] = useState<{
    isOpen: boolean;
    barber: BarberItem | null;
  }>({ isOpen: false, barber: null });

  const [availabilityModal, setAvailabilityModal] = useState<{
    isOpen: boolean;
    data: BarberAvailability | null;
    isLoading: boolean;
  }>({ isOpen: false, data: null, isLoading: false });

  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const [addModal, setAddModal] = useState(false);

  // Client-side filtering as a backup/immediate feedback
  const filteredBarbers = barbers.filter((barber) => {
    const fullName = `${barber.firstName} ${barber.lastName}`.toLowerCase();
    const matchesSearch =
      fullName.includes(searchQuery.toLowerCase()) ||
      barber.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      activeFilter === "all" || barber.status === activeFilter;

    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: BarberStatus) => {
    switch (status) {
      case "ACTIVO":
        return "bg-[#4ade80]";
      case "VACACIONES":
        return "bg-[#facc15]";
      case "INACTIVO":
        return "bg-[#9ca3af]";
      default:
        return "bg-neutral";
    }
  };

  const getStatusLabel = (status: BarberStatus) => {
    switch (status) {
      case "ACTIVO":
        return "Active";
      case "VACACIONES":
        return "On Vacation";
      case "INACTIVO":
        return "Inactive";
    }
  };

  const getStatusBadgeClass = (status: BarberStatus) => {
    switch (status) {
      case "ACTIVO":
        return "bg-success/10 text-success border-success/20";
      case "VACACIONES":
        return "bg-warning/10 text-warning border-warning/20";
      case "INACTIVO":
        return "bg-neutral/10 text-neutral border-neutral/20";
    }
  };

  const handleStatusChange = async (newStatus: BarberStatus) => {
    setStatusLoading(true);
    setActionError(null);
    try {
      let endpoint = "";
      if (newStatus === "ACTIVO")
        endpoint = `/api/barbershop/${statusModal.barberId}/activate`;
      else if (newStatus === "INACTIVO")
        endpoint = `/api/barbershop/${statusModal.barberId}/desactivate`;
      else if (newStatus === "VACACIONES")
        endpoint = `/api/barbershop/${statusModal.barberId}/vacation`;

      await api.patch(endpoint);
      setStatusModal((prev) => ({ ...prev, isOpen: false }));
      await fetchBarbers();
    } catch (err: any) {
      console.error("Error changing status:", err);
      setActionError(
        err.response?.data?.message || "Failed to update status. Try again.",
      );
    } finally {
      setStatusLoading(false);
    }
  };

  const handleCommissionUpdate = async (newCommission: number) => {
    setCommissionLoading(true);
    setActionError(null);
    try {
      const decimalCommission = newCommission / 100;
      await api.patch(`/api/barbershop/${editModal.barberId}/commission`, {
        newCommission: decimalCommission,
      });
      setEditModal((prev) => ({ ...prev, isOpen: false }));
      await fetchBarbers();
    } catch (err: any) {
      console.error("Error updating commission:", err);
      setActionError(
        err.response?.data?.message ||
          "Failed to update commission. Try again.",
      );
    } finally {
      setCommissionLoading(false);
    }
  };

  const fetchAvailability = async (barberId: number) => {
    setAvailabilityModal((prev) => ({
      ...prev,
      isOpen: true,
      isLoading: true,
    }));
    try {
      const { data } = await api.get<BarberAvailability>(
        `/api/barbershop/barber/${barberId}/availability`,
      );
      setAvailabilityModal((prev) => ({ ...prev, data, isLoading: false }));
    } catch (err: any) {
      console.error("Error fetching availability:", err);
      setActionError(
        err.response?.data?.message || "Failed to fetch availability.",
      );
      setAvailabilityModal((prev) => ({
        ...prev,
        isOpen: false,
        isLoading: false,
      }));
    }
  };

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        openMenuId !== null
      ) {
        setOpenMenuId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openMenuId]);

  return (
    <div className="flex h-screen overflow-hidden bg-surface text-on-surface font-['Inter'] selection:bg-[#f2ca50]/30">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex flex-col flex-1 overflow-hidden w-full min-w-0">
        <Topbar
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          pageTitle="Barbers"
        />

        <main className="flex-1 overflow-y-auto bg-surface-dim p-4 md:p-8 max-w-[1600px] mx-auto w-full space-y-8">
          <div className="max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div>
                <h2 className="font-['Manrope'] font-extrabold text-5xl tracking-tighter mb-2">
                  The Artisans
                </h2>
                <p className="text-[#99907c] font-medium">
                  Manage your elite grooming team and schedules.
                </p>
              </div>
              <button
                onClick={() => setAddModal(true)}
                className="bg-[#f2ca50] text-[#3c2f00] px-8 py-4 rounded-full font-bold flex items-center gap-3 hover:shadow-[0_0_30px_rgba(242,202,80,0.3)] hover:-translate-y-0.5 transition-all active:scale-95 group w-fit"
              >
                <span className="material-symbols-outlined text-xl group-hover:rotate-90 transition-transform">
                  add
                </span>
                Add New Barber
              </button>
            </div>

            {/* Action error banner */}
            {actionError && (
              <div className="mb-6 flex items-center gap-3 p-4 bg-error/10 border border-error/20 rounded-2xl text-error text-sm font-bold">
                <span className="material-symbols-outlined">error</span>
                {actionError}
                <button
                  onClick={() => setActionError(null)}
                  className="ml-auto material-symbols-outlined text-error/60 hover:text-error"
                >
                  close
                </button>
              </div>
            )}

            {/* Toolbar: Search & Filter */}
            <div className="flex flex-wrap items-center gap-4 mb-8">
              <div className="relative flex-1 min-w-[300px] group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#99907c] group-focus-within:text-[#f2ca50] transition-colors">
                  search
                </span>
                <input
                  className="w-full bg-[#131313] border border-[#4d4635]/20 rounded-2xl py-4 pl-12 pr-4 text-sm focus:ring-2 focus:ring-[#f2ca50]/20 focus:border-[#f2ca50]/40 outline-none transition-all placeholder:text-[#99907c]/50 text-[#e5e2e1]"
                  placeholder="Search by name, specialty, or email..."
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2 bg-[#131313] border border-[#4d4635]/20 p-1.5 rounded-2xl overflow-x-auto no-scrollbar">
                {(["all", "ACTIVO", "VACACIONES", "INACTIVO"] as const).map(
                  (filter) => (
                    <button
                      key={filter}
                      onClick={() => setActiveFilter(filter)}
                      className={`px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
                        activeFilter === filter
                          ? "bg-[#2a2a2a] text-[#f2ca50] shadow-sm"
                          : "text-[#99907c] hover:text-[#e5e2e1] hover:bg-[#1c1b1b]"
                      }`}
                    >
                      {filter === "all"
                        ? "All"
                        : filter === "ACTIVO"
                          ? "Active"
                          : filter === "VACACIONES"
                            ? "On Vacation"
                            : "Inactive"}
                    </button>
                  ),
                )}
              </div>
              <button className="p-4 bg-[#131313] border border-[#4d4635]/20 rounded-2xl text-[#99907c] hover:text-[#e5e2e1] transition-colors">
                <span className="material-symbols-outlined">tune</span>
              </button>
            </div>

            {/* Barber Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {isLoading ? (
                <div className="col-span-full flex flex-col items-center justify-center py-20 gap-4">
                  <span className="material-symbols-outlined text-5xl text-primary animate-spin">
                    progress_activity
                  </span>
                  <p className="text-on-surface-variant font-bold uppercase tracking-widest text-sm">
                    Loading artisans...
                  </p>
                </div>
              ) : error ? (
                <div className="col-span-full flex flex-col items-center justify-center py-20 gap-4">
                  <span className="material-symbols-outlined text-5xl text-error">
                    error
                  </span>
                  <p className="text-error font-bold text-center max-w-md">
                    {error}
                  </p>
                  <button
                    onClick={fetchBarbers}
                    className="mt-4 px-6 py-2 bg-surface-container rounded-full text-primary font-bold hover:bg-surface-container-high transition-colors"
                  >
                    Retry
                  </button>
                </div>
              ) : filteredBarbers.length > 0 ? (
                filteredBarbers.map((barber, index) => (
                  <div
                    key={barber.barberId}
                    className="bg-surface-container rounded-lg p-6 group hover:bg-surface-container-high transition-all duration-500 relative overflow-hidden flex flex-col items-center text-center"
                  >
                    {/* Overflow Menu */}
                    <div className="absolute top-4 right-4 z-20">
                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuId(
                              openMenuId === barber.barberId
                                ? null
                                : barber.barberId,
                            );
                          }}
                          className="p-1 text-on-surface/40 hover:text-on-surface focus:outline-none transition-colors"
                        >
                          <span className="material-symbols-outlined">
                            more_vert
                          </span>
                        </button>
                        {openMenuId === barber.barberId && (
                          <div
                            ref={menuRef}
                            className="absolute right-0 mt-1 w-44 bg-surface-container-highest rounded-xl shadow-2xl border border-outline-variant/10 z-30 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
                          >
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setDetailPanel({ isOpen: true, barber });
                              }}
                              className="w-full px-4 py-2.5 flex items-center gap-3 text-xs font-bold text-on-surface hover:bg-primary/10 transition-colors"
                            >
                              <span className="material-symbols-outlined text-base">
                                visibility
                              </span>
                              Details
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditModal({
                                  isOpen: true,
                                  barberId: barber.barberId,
                                  barberName: `${barber.firstName} ${barber.lastName}`,
                                  barberRole: "Artisan",
                                  currentCommission: barber.commission * 100,
                                });
                              }}
                              className="w-full px-4 py-2.5 flex items-center gap-3 text-xs font-bold text-on-surface hover:bg-primary/10 transition-colors"
                            >
                              <span className="material-symbols-outlined text-base">
                                edit
                              </span>
                              Edit
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setStatusModal({
                                  isOpen: true,
                                  barberId: barber.barberId,
                                  currentStatus: barber.status,
                                  barberName: `${barber.firstName} ${barber.lastName}`,
                                });
                              }}
                              className="w-full px-4 py-2.5 flex items-center gap-3 text-xs font-bold text-on-surface hover:bg-primary/10 transition-colors border-t border-outline-variant/10"
                            >
                              <span className="material-symbols-outlined text-base">
                                toggle_on
                              </span>
                              Change Status
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Avatar and Status Dot */}
                    <div className="relative mb-4">
                      <div className="grayscale group-hover:grayscale-0 transition-all duration-700">
                        <Avatar
                          name={`${barber.firstName} ${barber.lastName}`}
                          size="lg"
                        />
                      </div>
                      <div
                        className={`absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full border-[3px] border-surface-container group-hover:border-surface-container-high transition-colors ${getStatusColor(barber.status)}`}
                      ></div>
                    </div>

                    {/* Info */}
                    <div className="mb-6">
                      <h3 className="text-xl font-bold text-on-surface leading-tight">
                        {barber.firstName} {barber.lastName[0]}.
                      </h3>
                      <div className="flex flex-col items-center gap-1 mt-1">
                        <span className="text-[10px] text-primary font-bold lowercase tracking-wider">
                          {barber.email}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="w-1 h-1 rounded-full bg-outline-variant/40"></span>
                          <span className="text-[9px] uppercase font-bold tracking-widest text-on-surface-variant">
                            {getStatusLabel(barber.status)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Availability Button */}
                    <button
                      onClick={() => fetchAvailability(barber.barberId)}
                      className="inline-flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-[0.2em] px-6 py-2.5 rounded-full border-2 border-primary/20 bg-primary/5 hover:bg-primary hover:text-on-primary transition-all duration-300"
                    >
                      <span className="material-symbols-outlined text-sm">
                        event_available
                      </span>
                      Availability
                    </button>

                    {/* Decorative Icon */}
                    <span className="absolute -bottom-6 -right-6 opacity-[0.03] text-6xl material-symbols-outlined pointer-events-none">
                      {index % 2 === 0 ? "content_cut" : "architecture"}
                    </span>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-20 bg-[#1c1b1b]/20 rounded-2xl border border-[#4d4635]/10">
                  <p className="text-[#99907c] font-medium">
                    No artisans found matching your criteria.
                  </p>
                </div>
              )}
            </div>

            {/* Footer / Pagination */}
            {pageData && (
              <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-6 border-t border-[#4d4635]/10 pt-8">
                <p className="text-xs font-bold text-[#99907c] tracking-wide uppercase">
                  SHOWING {barbers.length} OF {pageData.totalElements} ELITE
                  ARTISANS
                </p>
                <div className="flex items-center gap-2">
                  <button
                    disabled={pageData.first}
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#1c1b1b] border border-[#4d4635]/10 text-[#99907c] hover:text-[#f2ca50] transition-all active:scale-95 disabled:opacity-30 disabled:pointer-events-none"
                  >
                    <span className="material-symbols-outlined">
                      chevron_left
                    </span>
                  </button>

                  {Array.from({ length: pageData.totalPages }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i)}
                      className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold transition-all ${
                        currentPage === i
                          ? "bg-[#f2ca50] text-[#3c2f00] shadow-lg shadow-[#f2ca50]/20"
                          : "bg-[#1c1b1b] border border-[#4d4635]/10 text-[#99907c] hover:text-[#f2ca50]"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button
                    disabled={pageData.last}
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#1c1b1b] border border-[#4d4635]/10 text-[#99907c] hover:text-[#f2ca50] transition-all active:scale-95 disabled:opacity-30 disabled:pointer-events-none"
                  >
                    <span className="material-symbols-outlined">
                      chevron_right
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* FIX 2 & 3: modales reciben isLoading para deshabilitar botón mientras ejecuta */}
      <ChangeStatusModal
        isOpen={statusModal.isOpen}
        onClose={() => {
          if (!statusLoading)
            setStatusModal((prev) => ({ ...prev, isOpen: false }));
        }}
        currentStatus={statusModal.currentStatus}
        barberName={statusModal.barberName}
        onConfirm={handleStatusChange}
        isLoading={statusLoading}
      />

      <EditCommissionModal
        isOpen={editModal.isOpen}
        onClose={() => {
          if (!commissionLoading)
            setEditModal((prev) => ({ ...prev, isOpen: false }));
        }}
        barberName={editModal.barberName}
        barberRole={editModal.barberRole}
        currentCommission={editModal.currentCommission}
        onSave={handleCommissionUpdate}
        isLoading={commissionLoading}
      />

      <BarberDetailPanel
        isOpen={detailPanel.isOpen}
        onClose={() => setDetailPanel((prev) => ({ ...prev, isOpen: false }))}
        barber={detailPanel.barber}
      />

      <AddBarberModal
        isOpen={addModal}
        onClose={() => setAddModal(false)}
        onSubmit={(data) => {
          console.log("New barber", data);
          setAddModal(false);
        }}
      />

      {/* Availability Modal */}
      {availabilityModal.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() =>
              setAvailabilityModal((prev) => ({ ...prev, isOpen: false }))
            }
          />
          <div className="relative w-full max-w-md bg-surface-container rounded-2xl shadow-2xl border border-outline-variant/10 overflow-hidden animate-in zoom-in-95 duration-300">
            <header className="p-6 border-b border-outline-variant/10 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-on-surface">
                  Availability
                </h3>
                <p className="text-xs text-on-surface-variant font-medium">
                  {availabilityModal.data?.barberName} •{" "}
                  {availabilityModal.data?.date}
                </p>
              </div>
              <button
                onClick={() =>
                  setAvailabilityModal((prev) => ({ ...prev, isOpen: false }))
                }
                className="p-2 rounded-full hover:bg-surface-container-highest transition-colors text-on-surface/40 hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </header>

            <div className="p-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
              {availabilityModal.isLoading ? (
                <div className="flex flex-col items-center justify-center py-10 gap-3">
                  <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                    Fetching slots...
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  {availabilityModal.data?.allSlots.map((slot, i) => (
                    <div
                      key={i}
                      className={`py-2 rounded-lg text-center text-xs font-bold border transition-all ${
                        slot.status === "DISPONIBLE"
                          ? "bg-tertiary/5 border-tertiary/20 text-tertiary"
                          : "bg-surface-container-highest border-transparent text-on-surface-variant/40 line-through opacity-50"
                      }`}
                    >
                      {slot.time}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <footer className="p-4 bg-surface-container-low border-t border-outline-variant/10 flex justify-end">
              <button
                onClick={() =>
                  setAvailabilityModal((prev) => ({ ...prev, isOpen: false }))
                }
                className="px-6 py-2 rounded-full bg-surface-container-highest text-on-surface text-xs font-bold hover:bg-surface-bright transition-colors"
              >
                Close
              </button>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
}
