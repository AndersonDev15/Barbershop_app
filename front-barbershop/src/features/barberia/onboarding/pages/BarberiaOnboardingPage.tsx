import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../../lib/api";

export default function BarberiaOnboardingPage() {
  const navigate = useNavigate();
  const [shopName, setShopName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    if (!shopName || !address || !phone) {
      setError("Please fill in all fields.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post("/api/barbershop", {
        barberShopName: shopName,
        address,
        phone,
      });

      if (response.status === 201) {
        navigate("/barberia/home");
      }
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        "Error al crear la barbería. Intenta de nuevo.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="font-body text-on-surface flex items-center justify-center min-h-screen p-6 bg-surface-container-lowest relative overflow-hidden">
      {/* Glows decorativos */}
      <div className="fixed top-0 right-0 w-1/2 h-1/2 bg-primary/5 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="fixed bottom-0 left-0 w-2/5 h-2/5 bg-tertiary/5 blur-[100px] rounded-full pointer-events-none -z-10" />

      <main className="w-full max-w-xl">
        {/* Card principal */}
        <div className="bg-gradient-to-br from-surface-container to-surface-dim rounded-lg p-8 md:p-12 shadow-[0_24px_48px_rgba(0,0,0,0.6)] relative overflow-hidden border border-outline-variant/10">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-2 text-primary">
              <span className="material-symbols-outlined text-3xl">
                content_cut
              </span>
              <span className="font-headline font-extrabold text-xl tracking-tighter text-on-surface uppercase">
                The Midnight Atelier
              </span>
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="font-headline font-extrabold text-2xl md:text-3xl text-on-surface mb-2 tracking-tight">
              Complete your barbershop setup
            </h1>
            <p className="text-on-surface-variant text-xs uppercase tracking-[0.2em] font-medium">
              Add your business details to get started
            </p>
          </div>

          {/* Campos */}
          <div className="space-y-5">
            {/* Barbershop Name */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-widest text-on-surface-variant ml-1">
                Barbershop Name
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40 text-sm">
                  storefront
                </span>
                <input
                  className="w-full bg-surface-container-lowest border-none rounded-full py-3.5 pl-11 pr-5 text-on-surface text-sm placeholder:text-on-surface-variant/30 focus:ring-2 focus:ring-primary/50 transition-all outline-none"
                  placeholder="e.g. The Silver Blade"
                  type="text"
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                />
              </div>
            </div>

            {/* Address */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-widest text-on-surface-variant ml-1">
                Address
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40 text-sm">
                  location_on
                </span>
                <input
                  className="w-full bg-surface-container-lowest border-none rounded-full py-3.5 pl-11 pr-5 text-on-surface text-sm placeholder:text-on-surface-variant/30 focus:ring-2 focus:ring-primary/50 transition-all outline-none"
                  placeholder="Street, City, Zip Code"
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-widest text-on-surface-variant ml-1">
                Phone Number
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40 text-sm">
                  call
                </span>
                <input
                  className="w-full bg-surface-container-lowest border-none rounded-full py-3.5 pl-11 pr-5 text-on-surface text-sm placeholder:text-on-surface-variant/30 focus:ring-2 focus:ring-primary/50 transition-all outline-none"
                  placeholder="+1 (555) 000-0000"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            {/* Botón submit */}
            <div className="pt-2">
              {error && (
                <p className="text-error text-xs text-center mb-4">{error}</p>
              )}
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary-container text-on-primary font-headline font-bold text-base py-4 rounded-full transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-sm">
                      progress_activity
                    </span>
                    Creating...
                  </>
                ) : (
                  <>
                    Save and Continue
                    <span className="material-symbols-outlined text-sm">
                      arrow_forward
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Divider decorativo */}
          <div className="mt-10 flex items-center justify-center gap-4 opacity-30">
            <div className="h-px flex-1 bg-outline-variant" />
            <span className="material-symbols-outlined text-base">brush</span>
            <div className="h-px flex-1 bg-outline-variant" />
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-8 text-center space-y-3">
          <p className="text-[10px] uppercase tracking-[0.3em] text-on-surface-variant/40">
            © 2026 BarberOS. All rights reserved.
          </p>
          <div className="flex justify-center gap-6">
            <a
              className="text-[10px] uppercase tracking-widest text-on-surface-variant/60 hover:text-primary transition-colors"
              href="#"
            >
              Privacy Policy
            </a>
            <a
              className="text-[10px] uppercase tracking-widest text-on-surface-variant/60 hover:text-primary transition-colors"
              href="#"
            >
              Terms of Service
            </a>
          </div>
        </footer>
      </main>
    </div>
  );
}
