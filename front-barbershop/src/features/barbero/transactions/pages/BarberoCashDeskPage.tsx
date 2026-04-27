import { useState, useEffect, useCallback } from "react";
import BarberoSidebar from "../../common/components/BarberoSidebar";
import BarberoTopBar from "../../common/components/BarberoTopBar";
import BarberoCashDeskHeader from "../components/BarberoCashDeskHeader";
import BarberoTransactionsList from "../components/BarberoTransactionsList";
import type { TransactionResponse } from "../../types/barbero.types";
import api from "../../../../lib/api";

export default function BarberoCashDeskPage() {
  const [transactions, setTransactions] = useState<TransactionResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalRevenue, setTotalRevenue] = useState(0);

  const [toast, setToast] = useState<{ visible: boolean; message: string }>({
    visible: false,
    message: "",
  });

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/barber/transactions/today");
      const data: TransactionResponse[] = response.data;

      const STATUS_ORDER: Record<string, number> = {
        EN_PROCESO: 0,
        PENDIENTE: 1,
        PAGADO: 2,
        RECHAZADO: 3,
        REEMBOLSADO: 4,
      };

      const sortedData = [...data].sort((a, b) => {
        const statusDiff =
          STATUS_ORDER[a.paymentStatus] - STATUS_ORDER[b.paymentStatus];
        if (statusDiff !== 0) return statusDiff;
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      });

      setTransactions(sortedData);

      // Solo suma las transacciones efectivamente pagadas
      const revenue = data
        .filter((item) => item.paymentStatus === "PAGADO")
        .reduce((sum, item) => sum + (item.totalAmount || 0), 0);

      setTotalRevenue(revenue);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      showToast("Error cargando transacciones");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  function showToast(message: string) {
    setToast({ visible: true, message });
    setTimeout(() => setToast({ visible: false, message: "" }), 3000);
  }

  async function handleComplete(id: number) {
    try {
      await api.patch(`/api/barber/transactions/${id}/complete`);

      // Actualiza localmente el estado a PAGADO y registra la fecha de pago
      setTransactions((prev) =>
        prev.map((t) =>
          t.id === id
            ? {
                ...t,
                paymentStatus: "PAGADO",
                paymentDate: new Date().toISOString(),
              }
            : t,
        ),
      );

      // Recalcula el revenue sumando solo PAGADO
      setTransactions((prev) => {
        const revenue = prev
          .filter((t) => t.paymentStatus === "PAGADO")
          .reduce((sum, t) => sum + (t.totalAmount || 0), 0);
        setTotalRevenue(revenue);
        return prev;
      });

      showToast("Pago confirmado");
    } catch (error) {
      console.error("Error completing transaction:", error);
      showToast("Error confirmando el pago");
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-surface text-on-surface">
      <BarberoSidebar />
      <div className="flex flex-col flex-1 overflow-hidden w-full min-w-0">
        <BarberoTopBar />

        {/* Contenido */}
        <main className="flex-1 overflow-y-auto bg-surface-dim p-4 sm:p-6 md:p-8 lg:p-10 custom-scrollbar">
          <BarberoCashDeskHeader
            totalTransactions={transactions.length}
            totalAmount={formatCurrency(totalRevenue)}
          />
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <BarberoTransactionsList
              transactions={transactions}
              onComplete={handleComplete}
            />
          )}
        </main>
      </div>

      {/* Toast */}
      {toast.visible && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] bg-primary text-on-primary px-8 py-4 rounded-xl font-bold shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-8 fade-in duration-500">
          <span
            className="material-symbols-outlined"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            check_circle
          </span>
          <span className="text-sm uppercase tracking-widest">
            {toast.message}
          </span>
        </div>
      )}
    </div>
  );
}
