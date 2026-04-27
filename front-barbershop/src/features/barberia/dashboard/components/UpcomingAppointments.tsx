import Avatar from "../../../../components/ui/Avatar";
import StatusBadge from "../../../../components/ui/StatusBadge";
import type { Appointment } from "../../types/dashboard.types";

interface UpcomingAppointmentsProps {
  appointments: Appointment[];
}

export default function UpcomingAppointments({
  appointments,
}: UpcomingAppointmentsProps) {
  return (
    <div className="bg-[#201f1f] p-8 rounded-xl shadow-xl">
      <div className="flex justify-between items-center mb-8">
        <h3 className="font-['Manrope'] text-xl font-bold">Upcoming</h3>
        <button className="text-[#f2ca50] text-xs font-bold uppercase tracking-widest">
          Schedule
        </button>
      </div>
      <div className="space-y-4">
        {appointments.map((appt) => (
          <div
            key={appt.id}
            className="flex items-center justify-between p-4 bg-[#1c1b1b] rounded-xl hover:bg-[#3a3939] transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-4">
              <Avatar name={appt.clientName} size="lg" />
              <div>
                <h5 className="font-bold group-hover:text-[#f2ca50] transition-colors">
                  {appt.clientName}
                </h5>
                <p className="text-xs text-[#d0c5af]">{appt.service}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden md:block">
                <p className="font-medium text-sm">{appt.time}</p>
                <p className="text-[10px] text-[#d0c5af] uppercase">
                  w/ {appt.barber}
                </p>
              </div>
              <StatusBadge status={appt.status} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
