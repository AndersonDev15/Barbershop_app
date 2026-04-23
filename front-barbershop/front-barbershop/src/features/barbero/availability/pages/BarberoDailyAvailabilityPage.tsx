import { useState } from "react";
import BarberoSidebar from "../../common/components/BarberoSidebar";
import BarberoTopBar from "../../common/components/BarberoTopBar";
import BarberoAvailabilityView from "../components/BarberoAvailabilityView";
import BarberoBlockAfternoonModal from "../components/BarberoBlockAfternoonModal";
import { useBarberAvailability } from "../../../../hooks/useBarberAvailability";

export default function BarberoDailyAvailabilityPage() {
  const [isBlockOpen, setIsBlockOpen] = useState(false);
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
        <main className="flex-1 overflow-y-auto bg-surface-dim p-4 pt-6 md:p-8 lg:p-10">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <BarberoAvailabilityView
              data={data}
              loading={loading}
              error={error}
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
              onBlockAfternoon={() => setIsBlockOpen(true)}
            />
          </div>
        </main>
      </div>

      <BarberoBlockAfternoonModal
        isOpen={isBlockOpen}
        onClose={() => setIsBlockOpen(false)}
        onConfirm={() => {
          console.log("block afternoon");
          setIsBlockOpen(false);
        }}
      />
    </div>
  );
}
