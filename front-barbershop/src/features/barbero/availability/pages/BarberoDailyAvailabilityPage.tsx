import { useState } from "react";
import BarberoSidebar from "../../common/components/BarberoSidebar";
import BarberoTopBar from "../../common/components/BarberoTopBar";
import BarberoAvailabilityView from "../components/BarberoAvailabilityView";
import { useBarberAvailability } from "../../../../hooks/useBarberAvailability";

export default function BarberoDailyAvailabilityPage() {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  const { data, loading, error } = useBarberAvailability(selectedDate);

  return (
    <div className="flex h-screen overflow-hidden bg-surface text-on-surface">
      <BarberoSidebar />
      <div className="flex flex-col flex-1 overflow-hidden w-full min-w-0">
        <BarberoTopBar />

        {/* Contenido */}
        <main className="flex-1 overflow-y-auto bg-surface-dim p-4 sm:p-6 md:p-8 lg:p-10 custom-scrollbar">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <BarberoAvailabilityView
              data={data}
              loading={loading}
              error={error}
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
