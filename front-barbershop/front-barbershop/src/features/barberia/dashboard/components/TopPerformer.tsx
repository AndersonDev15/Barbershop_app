import Avatar from "../../../../components/ui/Avatar";
import type { Barber } from "../../types/dashboard.types";

interface TopPerformerProps {
  barber: Barber;
}

export default function TopPerformer({ barber }: TopPerformerProps) {
  return (
    <div className="bg-[#201f1f] p-6 rounded-xl border border-[#f2ca50]/20 shadow-xl relative overflow-hidden">
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-3">
          <span className="material-symbols-outlined text-[#f2ca50] text-sm">
            workspace_premium
          </span>
          <span className="text-[10px] uppercase tracking-widest font-bold text-[#f2ca50]">
            Top Performer
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Avatar name={barber.name} size="lg" />
          <div>
            <h4 className="font-['Manrope'] font-bold text-lg">
              {barber.name}
            </h4>
            <p className="text-[#d0c5af] text-xs">{barber.role}</p>
          </div>
        </div>
      </div>
      <span className="absolute -right-4 -bottom-4 material-symbols-outlined text-[#f2ca50]/5 text-8xl">
        content_cut
      </span>
    </div>
  );
}
