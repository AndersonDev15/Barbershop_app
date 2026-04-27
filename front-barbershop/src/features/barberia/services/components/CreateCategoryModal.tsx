import React, { useState, useEffect } from "react";

interface CreateCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; description: string }) => void;
}

const CreateCategoryModal: React.FC<CreateCategoryModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (isOpen) {
      setName("");
      setDescription("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCreate = () => {
    if (name.trim()) {
      onSubmit({ name, description });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md max-h-[85vh] bg-[#1c1b1b] rounded-lg shadow-[0px_24px_48px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-5 pt-5 pb-3 flex justify-between items-center">
          <h2 className="text-xl font-black font-['Manrope'] tracking-tight text-[#e5e2e1]">
            Create Category
          </h2>
          <button
            onClick={onClose}
            className="text-[#d0c5af] hover:text-[#f2ca50] transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="px-5 pb-5 flex-1 overflow-y-auto space-y-5">
          {/* Name */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-[#d0c5af]">
              Category Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#2a2a2a] rounded-lg py-3 px-4 text-sm text-[#e5e2e1] placeholder:text-[#b7b4b4] focus:ring-2 focus:ring-[#f2ca50] outline-none"
              placeholder="e.g. Chemical Treatments"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-[#d0c5af]">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#2a2a2a] rounded-lg py-3 px-4 text-sm text-[#e5e2e1] placeholder:text-[#b7b4b4] focus:ring-2 focus:ring-[#f2ca50] resize-none outline-none"
              placeholder="Describe the services..."
              rows={2}
            />
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-2 pt-1">
            <button
              onClick={handleCreate}
              className="flex-1 bg-[#f2ca50] text-[#3c2f00] font-bold py-2.5 rounded-full text-xs flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">
                check
              </span>
              Create
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-[#353534] text-[#e5e2e1] font-bold py-2.5 rounded-full text-xs hover:bg-[#3a3939] active:scale-95 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#131313] px-5 py-2.5 flex items-center gap-2">
          <span
            className="material-symbols-outlined text-[#3de1fc] text-xs"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            info
          </span>
          <p className="text-[10px] text-[#d0c5af]">
            Categories update instantly across the system.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreateCategoryModal;
