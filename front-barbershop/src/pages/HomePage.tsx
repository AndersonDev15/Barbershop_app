import { useState, useEffect } from "react";
import { Navigate, Link } from "react-router-dom";
import { useAuthStore } from "../features/auth/authStore";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "../components/LanguageSwitcher";
export default function HomePage() {
  const { t } = useTranslation();
  const { isAuthenticated, isLoading, user } = useAuthStore();
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    // Enable smooth scroll on html element
    document.documentElement.classList.add("scroll-smooth");

    const handleScroll = () => {
      if (window.scrollY > 500) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      document.documentElement.classList.remove("scroll-smooth");
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLogin = () => {
    const baseUrl = import.meta.env.VITE_BFF_URL;

    if (!baseUrl) {
      throw new Error("VITE_BFF_URL no está definida");
    }

    window.location.href = `${baseUrl}/oauth2/authorization/barberia-client`;
  };

  // Mientras valida sesión
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface text-on-surface">
        <span className="animate-pulse">{t("landing.loading")}</span>
      </div>
    );
  }

  //  SI YA HAY SESIÓN → REDIRIGE
  if (isAuthenticated && user) {
    if (user.roles.includes("ROLE_BARBERIA")) {
      return <Navigate to="/barberia/home" replace />;
    }

    if (user.roles.includes("ROLE_BARBERO")) {
      return <Navigate to="/barbero/dashboard" replace />;
    }

    if (user.roles.includes("ROLE_CLIENTE")) {
      return <Navigate to="/cliente/discovery" replace />;
    }
  }

  // Si NO hay sesión → muestra la landing page completa
  return (
    <div className="min-h-screen bg-surface text-on-surface selection:bg-primary selection:text-on-primary">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-surface/80 backdrop-blur-md border-b border-outline-variant">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-headline font-bold text-on-surface">
                Barber<span className="text-primary">OS</span>
              </span>
            </div>

            {/* Links Centered */}
            <div className="hidden md:flex space-x-8 items-center">
              <a
                href="#inicio"
                className="text-sm font-body text-on-surface-variant hover:text-primary transition-colors"
              >
                {t("landing.nav.inicio")}
              </a>
              <a
                href="#como-funciona"
                className="text-sm font-body text-on-surface-variant hover:text-primary transition-colors"
              >
                {t("landing.nav.comoFunciona")}
              </a>
              <a
                href="#roles"
                className="text-sm font-body text-on-surface-variant hover:text-primary transition-colors"
              >
                {t("landing.nav.roles")}
              </a>
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
              <button
                onClick={handleLogin}
                className="hidden sm:block px-4 py-2 text-sm font-body text-on-surface hover:text-primary transition-colors"
              >
                {t("landing.nav.iniciarSesion")}
              </button>
              <button
                onClick={handleLogin}
                className="px-5 py-2 bg-primary text-on-primary rounded-full text-sm font-bold hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all active:scale-95"
              >
                {t("landing.nav.registrarBarberia")}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        id="inicio"
        className="relative pt-32 pb-20 overflow-hidden bg-surface"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-5xl md:text-6xl font-headline font-bold leading-tight">
                {t("landing.hero.titulo1")} <br />
                <span className="bg-gradient-to-r from-primary to-on-surface-variant bg-clip-text text-transparent">
                  {t("landing.hero.titulo2")}
                </span>
              </h1>
              <p className="text-xl text-on-surface-variant font-body max-w-lg leading-relaxed">
                {t("landing.hero.subtitulo")}
              </p>
              <button
                onClick={handleLogin}
                className="px-8 py-4 bg-primary text-on-primary rounded-full text-lg font-bold hover:scale-105 active:scale-95 transition-all shadow-lg"
              >
                {t("landing.hero.cta")}
              </button>
            </div>

            {/* Dashboard Mockup */}
            <div className="relative">
              <div className="bg-surface-container-low rounded-2xl border border-outline-variant shadow-2xl overflow-hidden aspect-video p-4">
                <div className="flex items-center space-x-2 mb-6 border-b border-outline-variant pb-4">
                  <div className="w-3 h-3 rounded-full bg-error/50"></div>
                  <div className="w-3 h-3 rounded-full bg-primary-container/50"></div>
                  <div className="w-3 h-3 rounded-full bg-primary/50"></div>
                  <div className="ml-4 h-4 w-32 bg-surface-container rounded-full"></div>
                </div>
                <div className="grid grid-cols-12 gap-4 h-full">
                  <div className="col-span-3 space-y-3">
                    <div className="h-8 w-full bg-primary/20 rounded-lg"></div>
                    <div className="h-8 w-full bg-surface-container rounded-lg"></div>
                    <div className="h-8 w-full bg-surface-container rounded-lg"></div>
                  </div>
                  <div className="col-span-9 space-y-4">
                    <div className="grid grid-cols-3 gap-3">
                      <div className="h-20 bg-surface-container rounded-xl border border-outline-variant"></div>
                      <div className="h-20 bg-surface-container rounded-xl border border-outline-variant"></div>
                      <div className="h-20 bg-surface-container rounded-xl border border-outline-variant"></div>
                    </div>
                    <div className="h-40 bg-surface-container rounded-xl border border-outline-variant flex items-end p-4 space-x-2">
                      <div className="w-full bg-primary/20 h-[30%] rounded-t"></div>
                      <div className="w-full bg-primary/40 h-[60%] rounded-t"></div>
                      <div className="w-full bg-primary/60 h-[45%] rounded-t"></div>
                      <div className="w-full bg-primary/80 h-[80%] rounded-t"></div>
                      <div className="w-full bg-primary h-[55%] rounded-t"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-surface-container-lowest/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-headline font-bold mb-16">
            {t("landing.features.titulo")}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: "group" },
              { icon: "event_available" },
              { icon: "mail" },
              { icon: "payments" },
              { icon: "analytics" },
              { icon: "schedule" },
            ].map((f, i) => (
              <div
                key={i}
                className="p-8 bg-surface-container-low rounded-3xl border border-outline-variant hover:border-primary/50 transition-colors text-left group"
              >
                <span className="material-symbols-outlined text-primary text-3xl mb-6 block group-hover:scale-110 transition-transform">
                  {f.icon}
                </span>
                <h3 className="text-xl font-headline font-bold mb-3">
                  {t(`landing.features.items.${i}.titulo`)}
                </h3>
                <p className="text-on-surface-variant font-body leading-relaxed">
                  {t(`landing.features.items.${i}.desc`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="como-funciona" className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-primary font-bold tracking-widest text-xs uppercase mb-4 block">
            {t("landing.howItWorks.etiqueta")}
          </span>
          <h2 className="text-3xl md:text-4xl font-headline font-bold mb-20">
            {t("landing.howItWorks.titulo")}
          </h2>

          <div className="relative grid md:grid-cols-3 gap-12">
            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-[2px] border-t-2 border-dashed border-primary/30 z-0"></div>

            {[
              { step: "1", icon: "store" },
              { step: "2", icon: "person_add" },
              { step: "3", icon: "calendar_month" },
            ].map((s, i) => (
              <div key={i} className="relative z-10 space-y-6 group">
                <div className="w-24 h-24 rounded-full bg-surface-container-low border border-outline-variant flex items-center justify-center mx-auto group-hover:border-primary transition-colors">
                  <span className="material-symbols-outlined text-primary text-4xl">
                    {s.icon}
                  </span>
                </div>
                <h3 className="text-xl font-headline font-bold">
                  {t(`landing.howItWorks.pasos.${i}.titulo`)}
                </h3>
                <p className="text-on-surface-variant font-body leading-relaxed max-w-[280px] mx-auto">
                  {t(`landing.howItWorks.pasos.${i}.desc`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section id="roles" className="py-24 bg-surface-container-lowest/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-headline font-bold mb-4">
            {t("landing.rolesSection.titulo")}
          </h2>
          <p className="text-on-surface-variant mb-16">
            {t("landing.rolesSection.subtitulo")}
          </p>

          <div className="grid lg:grid-cols-3 gap-8">
            {["dueno", "barbero", "cliente"].map((rol) => (
              <div
                key={rol}
                className="bg-surface-container-low rounded-3xl border border-outline-variant overflow-hidden flex flex-col h-full hover:border-primary/50 transition-colors"
              >
                <div className="h-2 bg-primary"></div>
                <div className="p-8 flex-grow text-left">
                  <h3 className="text-2xl font-headline font-bold mb-6">
                    {t(`landing.rolesSection.${rol}.titulo`)}
                  </h3>
                  <ul className="space-y-4">
                    {[0, 1, 2].map((i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="material-symbols-outlined text-primary text-sm mt-1">
                          check_circle
                        </span>
                        <span className="text-on-surface-variant font-body">
                          {t(`landing.rolesSection.${rol}.items.${i}`)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-surface border-y border-outline-variant">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-headline font-bold">
            {t("landing.cta.titulo")}
          </h2>
          <p className="text-xl text-on-surface-variant font-body">
            {t("landing.cta.subtitulo")}
          </p>
          <button
            onClick={handleLogin}
            className="px-10 py-5 bg-primary text-on-primary rounded-full text-xl font-bold hover:scale-105 transition-all shadow-xl"
          >
            {t("landing.cta.boton")}
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 bg-surface-container-lowest">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 border-b border-outline-variant pb-12">
            <div className="space-y-4">
              <span className="text-3xl font-headline font-bold text-primary">
                BarberOS
              </span>
              <p className="text-on-surface-variant font-body">
                {t("landing.footer.slogan")}
              </p>
            </div>
            <div className="flex flex-wrap gap-8 text-sm font-body text-on-surface-variant">
              <a href="#" className="hover:text-primary transition-colors">
                {t("landing.footer.privacidad")}
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                {t("landing.footer.terminos")}
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                {t("landing.footer.soporte")}
              </a>
            </div>
          </div>
          <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-body text-on-surface-variant/60">
            <p>{t("landing.footer.copyright")}</p>
          </div>
        </div>
      </footer>

      {/* Scroll to top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`fixed bottom-8 right-8 w-14 h-14 bg-primary text-on-primary rounded-full flex items-center justify-center shadow-2xl z-50 transition-all duration-300 ${
          showScrollTop
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10 pointer-events-none"
        }`}
      >
        <span className="material-symbols-outlined text-3xl">arrow_upward</span>
      </button>
    </div>
  );
}
