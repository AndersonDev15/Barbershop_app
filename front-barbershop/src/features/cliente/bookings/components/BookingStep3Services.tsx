import { createPortal } from "react-dom";

interface Barber {
  id: string;
  name: string;
  role: string;
  image: string;
}

interface Service {
  id: string;
  name: string;
  description: string;
  duration: number; // in minutes
  price: number;
  icon: string;
  category: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onBack: () => void;
  onNext: () => void;
  onToggleService: (service: Service) => void;
  selectedBarber: Barber | null;
  selectedDate: string;
  selectedTime: string;
  selectedServices: Service[];
}

export default function BookingStep3Services({
  isOpen,
  onClose,
  onBack,
  onNext,
  onToggleService,
  selectedBarber,
  selectedDate,
  selectedTime,
  selectedServices: initialSelectedServices,
}: Props) {
  const services: Service[] = [
    {
      id: "h1",
      name: "The Atelier Signature",
      description:
        "Precision cut, shampoo, scalp massage, and bespoke styling with premium pomade.",
      duration: 45,
      price: 65,
      icon: "content_cut",
      category: "Haircuts",
    },
    {
      id: "h2",
      name: "Classic Fade",
      description:
        "Skin fade or taper with expert blending and sharp line-up finish.",
      duration: 30,
      price: 45,
      icon: "style",
      category: "Haircuts",
    },
    {
      id: "h3",
      name: "Young Gentleman",
      description:
        "Premium cut for those under 12. Quality grooming for the next generation.",
      duration: 30,
      price: 35,
      icon: "face_6",
      category: "Haircuts",
    },
    {
      id: "s1",
      name: "Hot Towel Shave",
      description:
        "Traditional straight razor shave with pre-shave oil and three steam towels.",
      duration: 40,
      price: 50,
      icon: "cut",
      category: "Shaves & Beard",
    },
    {
      id: "s2",
      name: "Beard Sculpt",
      description:
        "Complete reshaping and line-up with oil treatment and cold towel finish.",
      duration: 25,
      price: 30,
      icon: "draw",
      category: "Shaves & Beard",
    },
  ];

  const categories = Array.from(new Set(services.map((s) => s.category)));

  const toggleService = (service: Service) => {
    onToggleService(service);
  };

  const totalDuration = initialSelectedServices.reduce(
    (acc, s) => acc + s.duration,
    0,
  );
  const totalPrice = initialSelectedServices.reduce(
    (acc, s) => acc + s.price,
    0,
  );

  const formatDuration = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    if (h === 0) return `${m} min`;
    return `${h}h ${m > 0 ? `${m}m` : ""}`;
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
      {/* Modal Container */}
      <div className="bg-surface-container-lowest w-full max-w-4xl max-h-[90vh] rounded-lg shadow-[0px_24px_48px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden border border-outline-variant/10">
        {/* Modal Header: COMPACTED */}
        <header className="px-8 py-6 flex flex-col gap-4 border-b border-outline-variant/5">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <span className="text-primary font-bold text-[10px] tracking-[0.2em] uppercase bg-primary/10 px-2 py-1 rounded">
                Step 3 / 4
              </span>
              <h2 className="font-headline text-2xl font-bold text-on-surface">
                Select Services
              </h2>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center hover:bg-surface-bright transition-colors"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>

          {/* Breadcrumb Context: COMPACTED CHIPS */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-surface-container-low rounded-full border border-outline-variant/10">
              <span className="material-symbols-outlined text-[14px] text-tertiary">
                person
              </span>
              <span className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">
                {selectedBarber?.name || "No barber"}
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-surface-container-low rounded-full border border-outline-variant/10">
              <span className="material-symbols-outlined text-[14px] text-on-surface-variant">
                calendar_today
              </span>
              <span className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">
                {selectedDate}
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-surface-container-low rounded-full border border-outline-variant/10">
              <span className="material-symbols-outlined text-[14px] text-on-surface-variant">
                schedule
              </span>
              <span className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">
                {selectedTime}
              </span>
            </div>
          </div>
        </header>

        {/* Modal Content (Scrollable) */}
        <div className="flex-1 overflow-y-auto px-8 py-6 custom-scrollbar bg-background/20">
          {categories.map((category) => (
            <section key={category} className="mb-10">
              <div className="flex items-center gap-4 mb-6">
                <h3 className="text-on-surface-variant font-headline text-sm font-bold uppercase tracking-widest">
                  {category}
                </h3>
                <div className="h-[1px] flex-1 bg-outline-variant/20"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services
                  .filter((s) => s.category === category)
                  .map((service) => {
                    const isSelected = initialSelectedServices.some(
                      (s) => s.id === service.id,
                    );
                    return (
                      <div
                        key={service.id}
                        onClick={() => toggleService(service)}
                        className={`relative group cursor-pointer p-6 rounded-lg transition-all border-2 
                          ${
                            isSelected
                              ? "bg-surface-container-high border-primary shadow-lg"
                              : "bg-surface-container border-transparent hover:border-surface-bright"
                          }`}
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div
                            className={`p-2 rounded-lg transition-colors ${isSelected ? "bg-primary/10" : "bg-surface-container-highest group-hover:bg-surface-bright"}`}
                          >
                            <span
                              className={`material-symbols-outlined ${isSelected ? "text-primary" : "text-on-surface-variant"}`}
                            >
                              {service.icon}
                            </span>
                          </div>
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center transition-all border-2 
                            ${isSelected ? "bg-primary border-primary" : "border-outline-variant group-hover:border-primary"}`}
                          >
                            {isSelected && (
                              <span className="material-symbols-outlined text-[16px] text-on-primary font-bold">
                                check
                              </span>
                            )}
                          </div>
                        </div>
                        <h4 className="text-lg font-bold text-on-surface mb-1">
                          {service.name}
                        </h4>
                        <p className="text-on-surface-variant text-sm mb-6 line-clamp-2">
                          {service.description}
                        </p>
                        <div className="flex justify-between items-center pt-4 border-t border-outline-variant/10">
                          <span className="text-xs font-medium text-on-surface-variant uppercase tracking-tighter">
                            {service.duration} min
                          </span>
                          <span
                            className={`text-xl font-headline font-extrabold ${isSelected ? "text-primary" : "text-on-surface"}`}
                          >
                            ${service.price.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </section>
          ))}
        </div>

        {/* Modal Footer */}
        <footer className="p-8 pt-4 border-t border-outline-variant/10 bg-surface-container-low flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">
                Total Duration
              </span>
              <span className="text-lg font-bold">
                {formatDuration(totalDuration)}
              </span>
            </div>
            <div className="w-[1px] h-8 bg-outline-variant/30"></div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">
                Estimated Total
              </span>
              <span className="text-2xl font-headline font-extrabold text-primary">
                ${totalPrice.toFixed(2)}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <button
              onClick={onBack}
              className="flex-1 md:flex-none px-8 py-4 rounded-full font-bold text-on-surface hover:bg-surface-container-highest transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[20px]">
                arrow_back
              </span>
              Back
            </button>
            <button
              disabled={initialSelectedServices.length === 0}
              onClick={onNext}
              className={`flex-1 md:flex-none px-10 py-4 rounded-full font-bold transition-all flex items-center justify-center gap-2
                ${
                  initialSelectedServices.length > 0
                    ? "bg-primary text-on-primary hover:scale-[1.02] active:scale-95 shadow-[0_8px_20px_rgba(242,202,80,0.25)]"
                    : "bg-surface-container-highest text-on-surface-variant cursor-not-allowed opacity-50"
                }`}
            >
              Review Booking
              <span className="material-symbols-outlined text-[20px]">
                arrow_forward
              </span>
            </button>
          </div>
        </footer>
      </div>
    </div>,
    document.body,
  );
}
