import { useEffect, useState } from "react";

export default function ErrorToast() {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      setMessage((e as CustomEvent).detail.message);
      setTimeout(() => setMessage(null), 4000);
    };
    window.addEventListener("app:error", handler);
    return () => window.removeEventListener("app:error", handler);
  }, []);

  if (!message) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] animate-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-center gap-3 bg-[#1c1b1b] border border-error/20 text-error px-6 py-4 rounded-2xl shadow-2xl shadow-black/50">
        <span className="material-symbols-outlined text-error">error</span>
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-error/70 mb-0.5">
            Error
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
