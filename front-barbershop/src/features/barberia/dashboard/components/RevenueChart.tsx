import type { ChartBarData } from "../../types/dashboard.types";

interface RevenueChartProps {
  chartBars: ChartBarData[];
}

export default function RevenueChart({ chartBars }: RevenueChartProps) {
  return (
    <div className="lg:col-span-2 bg-[#201f1f] p-8 rounded-xl shadow-xl">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h3 className="font-['Manrope'] text-xl font-bold mb-1">
            Revenue Trends
          </h3>
          <p className="text-[#d0c5af] text-sm">
            Performance across the last 7 days
          </p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#f2ca50]"></div>
            <span className="text-xs text-[#d0c5af]">Revenue</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#3de1fc]"></div>
            <span className="text-xs text-[#d0c5af]">Volume</span>
          </div>
        </div>
      </div>

      <div className="h-64 flex items-end justify-between gap-4 relative">
        {/* Grid lines */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-5">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="border-t border-[#e5e2e1] w-full" />
          ))}
        </div>

        {chartBars.map((bar) => (
          <div
            key={bar.day}
            className="flex-1 flex flex-col items-center gap-2 group cursor-pointer"
          >
            <div
              className={`w-full rounded-t-lg transition-colors ${bar.active ? "bg-[#f2ca50]" : "bg-[#353534] group-hover:bg-[#f2ca50]/50"}`}
              style={{ height: `${bar.height}px` }}
            />
            <span className="text-[10px] text-[#d0c5af] uppercase">
              {bar.day}
            </span>
          </div>
        ))}

        {/* Línea SVG de volumen */}
        <svg
          className="absolute inset-0 h-full w-full pointer-events-none"
          preserveAspectRatio="none"
        >
          <path
            d="M0,180 Q80,120 160,160 T320,100 T480,140 T640,80 T800,110"
            fill="none"
            stroke="#3de1fc"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
}
