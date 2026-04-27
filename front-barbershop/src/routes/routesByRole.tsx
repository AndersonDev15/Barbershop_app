import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { useAuthStore } from "../features/auth/authStore";
import api from "../lib/api";

export default function RouteByRole() {
  const { isAuthenticated, user } = useAuthStore();
  const checkAuth = useAuthStore((s) => s.checkAuth);

  const location = useLocation();

  const [authChecked, setAuthChecked] = useState(false);
  const [checkingOnboarding, setCheckingOnboarding] = useState(false);
  const [barbershopExists, setBarbershopExists] = useState<boolean | null>(
    null,
  );
  const [clientInitialized, setClientInitialized] = useState(false);

  const calledRef = useRef(false);
  const clientInitCalledRef = useRef(false); // 🆕

  // 🔹 Validar sesión
  useEffect(() => {
    if (calledRef.current) return;
    calledRef.current = true;

    checkAuth().finally(() => setAuthChecked(true));
  }, []);

  // 🔹 Validar onboarding barbería
  useEffect(() => {
    if (!authChecked) return;
    if (!user?.roles.includes("ROLE_BARBERIA")) return;

    setCheckingOnboarding(true);

    api
      .get("/api/barbershop/my/exists")
      .then((res) => setBarbershopExists(res.data.exists))
      .catch(() => setBarbershopExists(false))
      .finally(() => setCheckingOnboarding(false));
  }, [authChecked, user]);

  // 🔹 Inicializar cliente
  useEffect(() => {
    if (!authChecked) return;
    if (!user?.roles.includes("ROLE_CLIENTE")) return;
    if (clientInitCalledRef.current) return; // 🛡️ una sola vez
    clientInitCalledRef.current = true;

    api
      .post("/api/client/init")
      .catch((err) => console.error("client/init error:", err))
      .finally(() => setClientInitialized(true));
  }, [authChecked, user]);

  const isClientRole = user?.roles.includes("ROLE_CLIENTE");
  const isBarberiaRole = user?.roles.includes("ROLE_BARBERIA");

  if (
    !authChecked ||
    checkingOnboarding ||
    (isClientRole && authChecked && !clientInitialized)
  ) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#131313]">
        <span className="text-[#d0c5af]">Cargando...</span>
      </div>
    );
  }

  const pendingToken = sessionStorage.getItem("pendingInvitationToken");

  if (
    isAuthenticated &&
    pendingToken &&
    !location.pathname.startsWith("/invitations")
  ) {
    return <Navigate to={`/invitations/${pendingToken}`} replace />;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/" replace />;
  }

  if (isBarberiaRole) {
    if (barbershopExists === false)
      return <Navigate to="/barberia/onboarding" replace />;
    if (barbershopExists === true)
      return <Navigate to="/barberia/home" replace />;
    return null;
  }

  if (user.roles.includes("ROLE_BARBERO")) {
    return <Navigate to="/barbero/dashboard" replace />;
  }

  if (user.roles.includes("ROLE_CLIENTE")) {
    return <Navigate to="/cliente/discovery" replace />;
  }

  return <Navigate to="/" replace />;
}
