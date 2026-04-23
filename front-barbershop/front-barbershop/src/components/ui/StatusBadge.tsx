import type { Appointment } from "../../features/barberia/types/dashboard.types";

interface StatusBadgeProps {
  status: Appointment["status"];
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const map = {
    in_chair: "bg-[#3de1fc]/10 text-[#3de1fc]",
    confirmed: "bg-[#f2ca50]/10 text-[#f2ca50]",
    pending: "bg-white/10 text-[#d0c5af]",
  };
  const label = {
    in_chair: "In Chair",
    confirmed: "Confirmed",
    pending: "Pending",
  };
  return (
    <span
      className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${map[status]}`}
    >
      {label[status]}
    </span>
  );
}
