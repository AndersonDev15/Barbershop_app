interface BarberoEngagementMetricsProps {
  workedHours?: { totalAppointments: number; hours: string };
}

export default function BarberoEngagementMetrics({
  workedHours,
}: BarberoEngagementMetricsProps) {
  const metrics = [
    {
      label: "Total Appointments",
      value: workedHours ? workedHours.totalAppointments.toString() : "128",
      icon: "calendar_month",
    },
    {
      label: "Hours Worked",
      value: workedHours ? workedHours.hours : "156h",
      subtext: "November Total",
      icon: "timer",
    },
  ];

  return (
    <div className="mt-8">
      <h2 className="text-xl md:text-2xl font-headline font-bold mb-6 text-on-surface">
        Engagement Metrics
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mt-6">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="h-40 md:h-48 bg-surface-container-low p-5 md:p-6 rounded-lg flex flex-col justify-between group hover:bg-surface-container transition-all duration-300"
          >
            <div className="flex justify-between items-start">
              <span className="material-symbols-outlined text-primary-container text-xl md:text-2xl opacity-50 group-hover:opacity-100 transition-opacity">
                {metric.icon}
              </span>
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-primary">
                {metric.label}
              </p>
              <div className="text-3xl md:text-4xl font-headline font-bold mt-2 md:mt-4 text-on-surface">
                {metric.value}
              </div>
              {metric.subtext && (
                <p className="text-[8px] md:text-[10px] font-medium text-on-surface-variant mt-1 md:mt-2 uppercase tracking-tighter">
                  {metric.subtext}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
