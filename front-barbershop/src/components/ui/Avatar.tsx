interface AvatarProps {
  name: string;
  size?: "sm" | "md" | "lg" | "xl";
  src?: string;
}

export default function Avatar({ name, size = "md", src }: AvatarProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const sizeClass = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-sm",
    xl: "w-40 h-40 text-2xl",
  };
  return (
    <div
      className={`${sizeClass[size]} rounded-lg bg-[#f2ca50]/20 border border-[#f2ca50]/30 flex items-center justify-center font-bold text-[#f2ca50] shrink-0 overflow-hidden`}
    >
      {src ? (
        <img src={src} alt={name} className="w-full h-full object-cover" />
      ) : (
        initials
      )}
    </div>
  );
}
