import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import type { InvitationDetailsResponse } from "../../types/invitacion.types";
import { useAuthStore } from "../../../auth/authStore";

export default function BarberoInvitacionPage() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuthStore();

  const [data, setData] = useState<InvitationDetailsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorType, setErrorType] = useState<"403" | "404" | "generic" | null>(
    null,
  );
  const [decision, setDecision] = useState<"accepted" | "declined" | null>(
    null,
  );

  useEffect(() => {
    if (!token) return;
    if (isLoading) return;

    if (!isAuthenticated) {
      // ✅ Guardar token solo para este flujo
      sessionStorage.setItem("pendingInvitationToken", token);

      window.location.href =
        "http://127.0.0.1:8090/oauth2/authorization/barberia-client";

      return;
    }

    // ✅ Ya autenticado → eliminar token (evita loops)
    sessionStorage.removeItem("pendingInvitationToken");

    axios
      .get<InvitationDetailsResponse>(
        `http://127.0.0.1:8090/api/barber/invitations/${token}`,
        { withCredentials: true },
      )
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        if (err.response?.status === 403) setErrorType("403");
        else if (err.response?.status === 404) setErrorType("404");
        else setErrorType("generic");

        setLoading(false);
      });
  }, [token, isAuthenticated, isLoading]);

  const handleAccept = () => {
    if (!token) return;
    axios
      .post(
        `http://127.0.0.1:8090/api/barber/invitations/${token}/accept`,
        {},
        { withCredentials: true },
      )
      .then(() => {
        setDecision("accepted");
        setTimeout(() => {
          navigate("/barbero/dashboard");
        }, 2000);
      })
      .catch(() => {
        alert("No se pudo aceptar la invitación");
      });
  };

  const handleReject = () => {
    if (!token) return;
    axios
      .post(
        `http://127.0.0.1:8090/api/barber/invitations/${token}/reject`,
        {},
        { withCredentials: true },
      )
      .then(() => {
        setDecision("declined");
      })
      .catch(() => {
        alert("No se pudo rechazar la invitación");
      });
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#131313]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (errorType) {
    const is403 = errorType === "403";
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-[#131313]">
        <div className="max-w-md w-full bg-surface-container p-10 rounded-lg text-center shadow-2xl border border-outline-variant/10">
          <div className="w-20 h-20 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-error text-5xl">
              {is403 ? "block" : "error"}
            </span>
          </div>
          <h2 className="text-2xl font-headline font-extrabold text-on-surface mb-2">
            {is403 ? "Acceso Denegado" : "Error"}
          </h2>
          <p className="text-on-surface-variant text-sm leading-relaxed mb-8">
            {is403
              ? "Esta invitación es solo para barberos registrados."
              : errorType === "404"
                ? "Invitación no encontrada o token inválido."
                : "Ocurrió un error al cargar la invitación."}
          </p>
          <button
            onClick={() => navigate("/")}
            className="w-full bg-primary text-on-primary font-headline font-extrabold py-4 rounded-full hover:bg-primary-container transition-all active:scale-95"
          >
            VOLVER AL INICIO
          </button>
        </div>
      </div>
    );
  }

  if (decision === "accepted") {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-[#131313]">
        <div className="max-w-md w-full bg-surface-container p-10 rounded-lg text-center shadow-2xl border border-outline-variant/10 animate-in fade-in zoom-in duration-500">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-primary text-5xl">
              check_circle
            </span>
          </div>
          <h2 className="text-2xl font-headline font-extrabold text-on-surface mb-2">
            Welcome to the Team!
          </h2>
          <p className="text-on-surface-variant text-sm leading-relaxed mb-8">
            You have successfully accepted the invitation to join{" "}
            <span className="text-primary font-bold">
              {data?.barberShopName}
            </span>
            . Our team will contact you shortly with the next steps.
          </p>
          <button
            onClick={() => navigate("/barbero/dashboard")}
            className="w-full bg-primary text-on-primary font-headline font-extrabold py-4 rounded-full hover:bg-primary-container transition-all active:scale-95"
          >
            GO TO DASHBOARD
          </button>
        </div>
      </div>
    );
  }

  if (decision === "declined") {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-[#131313]">
        <div className="max-w-md w-full bg-surface-container p-10 rounded-lg text-center shadow-2xl border border-outline-variant/10 animate-in fade-in zoom-in duration-500">
          <div className="w-20 h-20 bg-outline/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-outline text-5xl">
              cancel
            </span>
          </div>
          <h2 className="text-2xl font-headline font-extrabold text-on-surface mb-2">
            Invitation Declined
          </h2>
          <p className="text-on-surface-variant text-sm leading-relaxed mb-8">
            The partnership invitation has been declined. If this was a mistake,
            please contact the shop administrator.
          </p>
          <button
            onClick={() => setDecision(null)}
            className="text-primary font-bold hover:underline transition-all"
          >
            Review invitation again
          </button>
        </div>
      </div>
    );
  }

  const isExpired = data ? new Date(data.expiresAt) < new Date() : false;
  const formattedExpiresAt = data
    ? new Date(data.expiresAt).toLocaleDateString("es-CO", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#131313] font-body">
      <div className="max-w-md w-full animate-in fade-in slide-in-from-bottom-4 duration-1000">
        {/* Main Invitation Card */}
        <div className="bg-surface-container rounded-lg overflow-hidden relative shadow-[0px_24px_48px_rgba(0,0,0,0.5)] border border-outline-variant/10 bg-gradient-to-br from-primary/5 to-transparent">
          {/* Branding Header */}
          <div className="p-8 pb-0 text-center">
            <span className="text-primary font-headline font-bold text-[10px] uppercase tracking-[0.3em] mb-4 block">
              New Partnership Invitation
            </span>
            <h1 className="text-primary font-headline font-black italic tracking-tighter text-3xl mb-1">
              {data?.barberShopName}
            </h1>
            <p className="text-on-surface-variant font-medium text-sm">
              Grooming & Lifestyle Collective
            </p>
          </div>

          {/* Image Placeholder Section */}
          <div className="p-8">
            <div className="w-full h-48 rounded-lg overflow-hidden bg-surface-container-high mb-8 flex items-center justify-center group relative">
              <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <span className="material-symbols-outlined text-[#f2ca50] text-6xl mix-blend-luminosity group-hover:mix-blend-normal transition-all duration-700">
                content_cut
              </span>
            </div>

            {/* Invitation Details Grid */}
            <div className="space-y-6">
              {/* Address Section */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center shrink-0 border border-white/5">
                  <span className="material-symbols-outlined text-primary text-xl">
                    location_on
                  </span>
                </div>
                <div>
                  <p className="text-on-surface-variant text-[10px] uppercase font-bold tracking-widest mb-1">
                    Location
                  </p>
                  <p className="text-on-surface text-sm leading-relaxed">
                    {data?.barberShopAddress.split(", ").slice(0, 2).join(", ")}
                    <br />
                    {data?.barberShopAddress.split(", ").slice(2).join(", ")}
                  </p>
                </div>
              </div>

              {/* Financial & ID Section */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-surface-container-low p-4 rounded-lg border border-white/5 transition-colors hover:bg-surface-container-high">
                  <p className="text-on-surface-variant text-[10px] uppercase font-bold tracking-widest mb-1">
                    Commission
                  </p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-primary font-headline font-extrabold text-2xl">
                      {data?.commission}
                    </span>
                    <span className="text-primary/70 font-headline font-bold text-sm">
                      %
                    </span>
                  </div>
                </div>
                <div className="bg-surface-container-low p-4 rounded-lg border border-white/5 transition-colors hover:bg-surface-container-high">
                  <p className="text-on-surface-variant text-[10px] uppercase font-bold tracking-widest mb-1">
                    Barber ID
                  </p>
                  <p className="text-on-surface font-bold text-lg tracking-tight">
                    {data?.documentNumber}
                  </p>
                </div>
              </div>

              {/* Expiration */}
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-tertiary text-sm">
                    event
                  </span>
                  <span className="text-on-surface-variant text-[11px] font-medium uppercase tracking-wider">
                    Contract expires
                  </span>
                </div>
                <span className="text-on-surface text-xs font-bold font-headline tracking-wider">
                  {formattedExpiresAt}
                </span>
              </div>

              {/* Separator */}
              <div className="h-px w-full bg-gradient-to-r from-transparent via-outline-variant/20 to-transparent"></div>

              {/* Expired State */}
              {isExpired && (
                <div className="bg-error-container/20 border border-error/20 p-4 rounded-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                  <span className="material-symbols-outlined text-error">
                    warning
                  </span>
                  <p className="text-error text-sm font-medium">
                    This invitation has expired
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col gap-3 pt-4">
                <button
                  onClick={handleAccept}
                  disabled={isExpired}
                  className={`w-full font-headline font-extrabold py-4 rounded-full flex items-center justify-center gap-2 transition-all shadow-lg ${
                    isExpired
                      ? "bg-surface-container-highest text-on-surface/30 cursor-not-allowed"
                      : "bg-primary text-on-primary hover:bg-primary-container active:scale-95 shadow-primary/20"
                  }`}
                >
                  <span>ACCEPT INVITATION</span>
                  <span className="material-symbols-outlined text-xl">
                    arrow_forward
                  </span>
                </button>
                <button
                  onClick={handleReject}
                  className="w-full bg-transparent text-on-surface-variant font-headline font-bold py-3 rounded-full hover:bg-surface-bright active:scale-95 transition-all text-[10px] tracking-[0.2em] uppercase"
                >
                  DECLINE PARTNERSHIP
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Texture */}
          <div className="h-1.5 w-full bg-gradient-to-r from-[#d4af37] via-[#f2ca50] to-[#d4af37]"></div>
        </div>

        {/* Footer Help */}
        <p className="text-center mt-8 text-on-surface-variant/40 text-[10px] tracking-widest uppercase">
          Having trouble? Contact support at{" "}
          <span className="text-on-surface-variant/60 underline cursor-pointer hover:text-primary transition-colors lowercase">
            support@midnightatelier.com
          </span>
        </p>
      </div>
    </div>
  );
}
