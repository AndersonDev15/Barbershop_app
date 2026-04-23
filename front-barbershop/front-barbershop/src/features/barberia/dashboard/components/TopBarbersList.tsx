import Avatar from "../../../../components/ui/Avatar";
import type { Barber } from "../../types/dashboard.types";

interface TopBarbersListProps {
  barbers: Barber[];
}

export default function TopBarbersList({ barbers }: TopBarbersListProps) {
  return (
    <div className="bg-[#201f1f] p-8 rounded-xl shadow-xl">
      <div className="flex justify-between items-center mb-8">
        <h3 className="font-['Manrope'] text-xl font-bold">Top Barbers</h3>
        <button className="text-[#f2ca50] text-xs font-bold uppercase tracking-widest">
          View All
        </button>
      </div>
      <div className="space-y-4">
        {barbers.map((barber, idx) => (
          <div
            key={barber.id}
            className={`flex items-center justify-between p-4 rounded-xl transition-colors ${
              idx === 0
                ? "bg-[#f2ca50]/5 border border-[#f2ca50]/10 hover:bg-[#f2ca50]/10"
                : "hover:bg-[#2a2a2a]"
            }`}
          >
            <div className="flex items-center gap-4">
              <span
                className={`font-['Manrope'] font-black text-2xl w-8 ${idx === 0 ? "text-[#f2ca50]/30" : "text-[#d0c5af]/20"}`}
              >
                #{idx + 1}
              </span>
              <Avatar name={barber.name} size="lg" />
              <div>
                <h5 className="font-bold">{barber.name}</h5>
                <p className="text-xs text-[#d0c5af]">
                  {barber.appointments} appointments
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className={`font-bold ${idx === 0 ? "text-[#f2ca50]" : ""}`}>
                {barber.revenue}
              </p>
              <p className="text-[10px] text-[#d0c5af] uppercase">Revenue</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
