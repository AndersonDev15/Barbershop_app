import React, { useState, useEffect } from "react";

interface CreateServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoryId: number;
  categoryName: string;
  onSubmit: (data: {
    name: string;
    description: string;
    duration: number;
    price: number;
  }) => void;
}

const CreateServiceModal: React.FC<CreateServiceModalProps> = ({
  isOpen,
  onClose,
  categoryId,
  categoryName,
  onSubmit,
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState(45);
  const [price, setPrice] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setName("");
      setDescription("");
      setDuration(45);
      setPrice(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCreate = () => {
    if (name.trim()) {
      onSubmit({ name, description, duration, price });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-lg max-h-[90vh] bg-[#201f1f] rounded-lg shadow-[0px_24px_48px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden border border-white/5">
        {/* Header */}
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-3 mb-2">
            <span className="material-symbols-outlined text-[#3de1fc] text-sm">
              add_circle
            </span>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#d0c5af]">
              Add Subcategory
            </span>
          </div>
          <h2 className="text-2xl font-black font-['Manrope'] text-[#e5e2e1]">
            Create Service
          </h2>
          <p className="text-sm text-[#d0c5af] mt-1">
            Adding to:{" "}
            <span className="text-[#f2ca50] font-bold">{categoryName}</span>
          </p>
        </div>

        {/* Body (scrollable) */}
        <div className="p-6 space-y-8 overflow-y-auto flex-1">
          {/* Group: Basic Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-1 h-4 bg-[#f2ca50] rounded-full"></div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#d0c5af]">
                Basic Info
              </span>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#d0c5af] px-1">
                  Service Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Chemical Treatments"
                  className="w-full bg-[#2a2a2a] border-none rounded-full px-5 py-3 text-[#e5e2e1] focus:ring-2 focus:ring-[#f2ca50] outline-none transition-all placeholder:text-[#d0c5af]/30"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#d0c5af] px-1">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Service details..."
                  rows={2}
                  className="w-full bg-[#2a2a2a] border-none rounded-lg px-5 py-3 text-[#e5e2e1] focus:ring-2 focus:ring-[#f2ca50] outline-none transition-all resize-none placeholder:text-[#d0c5af]/30"
                />
              </div>
            </div>
          </div>

          {/* Group: Service Details */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-1 h-4 bg-[#f2ca50] rounded-full"></div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#d0c5af]">
                Service Details
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#d0c5af] px-1">
                  Duration (Min)
                </label>
                <div className="relative">
                  <select
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full bg-[#2a2a2a] border-none rounded-full px-5 py-3 text-[#e5e2e1] focus:ring-2 focus:ring-[#f2ca50] outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option value={15}>15 min</option>
                    <option value={30}>30 min</option>
                    <option value={45}>45 min</option>
                    <option value={60}>60 min</option>
                    <option value={90}>90 min</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#d0c5af]">
                    expand_more
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#d0c5af] px-1">
                  Price
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#d0c5af] font-bold">
                    $
                  </span>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    onFocus={(e) => e.target.select()}
                    className="w-full bg-[#2a2a2a] border-none rounded-full pl-9 pr-5 py-3 text-[#e5e2e1] focus:ring-2 focus:ring-[#f2ca50] outline-none transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-[#1c1b1b] flex flex-col sm:flex-row-reverse gap-3">
          <button
            onClick={handleCreate}
            className="flex-1 bg-[#f2ca50] text-[#3c2f00] font-bold rounded-full px-6 py-3 flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            Create Service
            <span className="material-symbols-outlined text-sm">
              arrow_forward
            </span>
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-[#353534] text-[#e5e2e1] font-bold rounded-full px-6 py-3 hover:bg-[#3a3939] active:scale-95 transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateServiceModal;
