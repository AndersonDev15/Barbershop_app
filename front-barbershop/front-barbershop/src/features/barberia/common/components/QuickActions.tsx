interface QuickActionsProps {
  onAddBarber?: () => void;
  onUploadImages?: () => void;
  onCreateCategory?: () => void;
}

export default function QuickActions({ onAddBarber, onUploadImages, onCreateCategory }: QuickActionsProps) {
  const actions = [
    { icon: "person_add", label: "Add Barber", onClick: onAddBarber },
    { icon: "category", label: "Create Category", onClick: onCreateCategory },
    { icon: "add_circle", label: "New Appt" },
    { icon: "upload_file", label: "Upload Images", onClick: onUploadImages },
  ];

  return (
    <div className="bg-[#201f1f] p-6 rounded-xl shadow-xl">
      <h3 className="font-['Manrope'] font-bold mb-6 text-[#e5e2e1]">
        Quick Actions
      </h3>
      <div className="grid grid-cols-2 gap-4">
        {actions.map((action) => (
          <button
            key={action.label}
            onClick={action.onClick}
            className="flex flex-col items-center justify-center gap-3 p-4 bg-[#1c1b1b] rounded-xl hover:bg-[#3a3939] transition-all active:scale-95 group"
          >
            <div className="w-10 h-10 rounded-full bg-[#f2ca50]/10 flex items-center justify-center group-hover:bg-[#f2ca50] group-hover:text-[#1c1b1b] transition-colors text-[#e5e2e1]">
              <span className="material-symbols-outlined">
                {action.icon}
              </span>
            </div>
            <span className="text-xs font-semibold text-center">
              {action.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
