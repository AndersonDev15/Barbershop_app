import React from "react";

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  checked,
  onChange,
  disabled = false,
}) => {
  return (
    <button
      onClick={() => !disabled && onChange(!checked)}
      className={`
        relative w-14 h-8 rounded-full transition-all duration-300
        ${checked ? "bg-green-500/80" : "bg-[#2a2a2a]"}
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
      `}
    >
      <span
        className={`
          absolute top-1 left-1 w-6 h-6 rounded-full bg-white
          shadow-md transform transition-all duration-300
          ${checked ? "translate-x-6" : "translate-x-0"}
        `}
      />
    </button>
  );
};

export default ToggleSwitch;
