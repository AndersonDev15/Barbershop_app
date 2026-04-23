import type { TransactionResponse } from "../../types/barbero.types";
import BarberoTransactionCard from "./BarberoTransactionCard";

interface BarberoTransactionsListProps {
  transactions: TransactionResponse[];
  onComplete: (id: number) => void;
}

export default function BarberoTransactionsList({
  transactions,
  onComplete,
}: BarberoTransactionsListProps) {
  return (
    <div className="space-y-3 pb-8">
      {transactions.map((transaction) => (
        <BarberoTransactionCard
          key={transaction.id}
          transaction={transaction}
          onComplete={onComplete}
        />
      ))}

      {transactions.length === 0 && (
        <div className="bg-surface-container/30 border border-dashed border-outline-variant/20 rounded-xl p-20 flex flex-col items-center justify-center text-center">
          <span className="material-symbols-outlined text-6xl text-on-surface-variant/20 mb-4">
            receipt_long
          </span>
          <p className="text-on-surface-variant font-medium uppercase tracking-widest text-xs">
            No transactions found for today.
          </p>
        </div>
      )}
    </div>
  );
}
