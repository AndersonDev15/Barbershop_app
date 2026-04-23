import ClienteSidebar from "../../common/components/ClienteSidebar";
import ClienteTopBar from "../../common/components/ClienteTopBar";
import ClienteDiscoveryHero from "../components/ClienteDiscoveryHero";
import ClienteFeaturedShops from "../components/ClienteFeaturedShops";

export default function ClienteDiscoveryPage() {
  return (
    <div className="flex h-screen overflow-hidden bg-surface text-on-surface">
      <ClienteSidebar />
      <div className="flex flex-col flex-1 overflow-hidden w-full min-w-0">
        <ClienteTopBar />

        <main className="flex-1 overflow-y-auto bg-surface-dim">
          <div className="pt-8">
            <ClienteDiscoveryHero />
            <ClienteFeaturedShops />
          </div>

          <footer className="w-full border-t border-outline-variant/10 bg-[#0e0e0e] mt-24">
            <div className="flex flex-col md:flex-row justify-between items-center px-12 py-8 w-full gap-4">
              <p className="font-body text-xs uppercase tracking-widest text-on-surface-variant/30">
                © 2024 The Midnight Atelier. All Rights Reserved.
              </p>
              <div className="flex gap-8">
                <a
                  className="font-body text-xs uppercase tracking-widest text-on-surface-variant/30 hover:text-primary transition-colors"
                  href="#"
                >
                  Privacy Policy
                </a>
                <a
                  className="font-body text-xs uppercase tracking-widest text-on-surface-variant/30 hover:text-primary transition-colors"
                  href="#"
                >
                  Terms of Service
                </a>
                <a
                  className="font-body text-xs uppercase tracking-widest text-on-surface-variant/30 hover:text-primary transition-colors"
                  href="#"
                >
                  Contact
                </a>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
