interface BarberoCashDeskHeaderProps {
  totalTransactions: number;
  totalAmount: string;
}

export default function BarberoCashDeskHeader({
  totalTransactions,
  totalAmount,
}: BarberoCashDeskHeaderProps) {
  const today = new Date();
  
  function formatLongDate(date: Date): string {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  function formatShortMonthDay(date: Date): string {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  }

  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 md:mb-12">
      {/* Columna izquierda */}
      <div className="flex flex-col md:flex-row md:items-center gap-6">
        {/* Títulos */}
        <div>
          <p className="font-label text-sm uppercase tracking-[0.3em] text-primary font-bold mb-2">
            Daily Revenue
          </p>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-on-surface">
            Cash Desk - {formatShortMonthDay(today)}
          </h2>
          <p className="text-on-surface-variant mt-2 text-lg">
            {formatLongDate(today)}
          </p>
        </div>
      </div>

      {/* Columna derecha */}
      <div className="flex gap-4 self-start lg:self-end">
        <div className="bg-surface-container-low px-6 py-4 rounded-lg flex flex-col items-end border border-outline-variant/5">
          <span className="text-on-surface-variant text-xs uppercase tracking-widest">
            Transactions
          </span>
          <span className="text-3xl font-black text-on-surface">
            {totalTransactions}
          </span>
        </div>
        <div className="bg-surface-container-low px-6 py-4 rounded-lg flex flex-col items-end border-l-4 border-primary shadow-lg shadow-primary/5">
          <span className="text-on-surface-variant text-xs uppercase tracking-widest">
            Total Revenue
          </span>
          <span className="text-3xl font-black text-primary">
            {totalAmount}
          </span>
        </div>
      </div>
    </div>
  );
}
