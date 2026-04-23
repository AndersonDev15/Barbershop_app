import { useEffect, useState } from "react";

export default function InactiveBarberiaToast() {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      const msg = (e as CustomEvent).detail.message;
      setMessage(msg);

      setTimeout(() => setMessage(null), 4000);
    };

    window.addEventListener("barberia:inactive", handler);
    return () => window.removeEventListener("barberia:inactive", handler);
  }, []);

  if (!message) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] animate-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-center gap-3 bg-[#1c1b1b] border border-red-500/20 text-red-400 px-6 py-4 rounded-2xl shadow-2xl shadow-black/50">
        <span className="material-symbols-outlined text-red-400">
          store_mall_directory
        </span>

        <div>
          <p className="text-xs font-black uppercase tracking-widest text-red-400/70 mb-0.5">
            Barbería inactiva
          </p>
          <p className="text-sm font-semibold text-[#e5e2e1]">{message}</p>
        </div>

        <button
          onClick={() => setMessage(null)}
          className="ml-4 text-[#99907c] hover:text-[#e5e2e1]"
        >
          <span className="material-symbols-outlined text-sm">close</span>
        </button>
      </div>
    </div>
  );
}
