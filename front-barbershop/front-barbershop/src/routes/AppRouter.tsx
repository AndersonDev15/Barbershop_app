import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "../features/auth/authStore";
import type { UserRole } from "../features/auth/authStore";
import RouteByRole from "./routesByRole";
import HomePage from "../pages/HomePage";

import BarberiaHomePage from "../features/barberia/dashboard/pages/BarberiaHomePage";
import BarberiaBarberosPage from "../features/barberia/barbers/pages/BarberiaBarberosPage";
import BarberiaServicesPage from "../features/barberia/services/pages/BarberiaServicesPage";
import BarberiaSchedulePage from "../features/barberia/scheduled/pages/BarberiaSchedulePage";
import BarberiaOnboardingPage from "../features/barberia/onboarding/pages/BarberiaOnboardingPage";
import BarberiaNotificationsPage from "../features/barberia/notification/pages/BarberiaNotificationsPage";

import BarberoDashboardPage from "../features/barbero/dashboard/pages/BarberoDashboardPage";
import BarberoTodayAppointmentsPage from "../features/barbero/appointments/pages/BarberoTodayAppointmentsPage";
import BarberoDailyAvailabilityPage from "../features/barbero/availability/pages/BarberoDailyAvailabilityPage";
import BarberoBreaksPage from "../features/barbero/breaks/pages/BarberoBreaksPage";
import BarberoCashDeskPage from "../features/barbero/transactions/pages/BarberoCashDeskPage";
import BarberoNotificationsPage from "../features/barbero/notification/pages/BarberoNotificationsPage";
import BarberoInvitacionPage from "../features/barbero/invitation/pages/BarberoInvitacionPage";

import ClienteDiscoveryPage from "../features/cliente/discovery/pages/ClienteDiscoveryPage";
import ClienteBarbershopDetailPage from "../features/cliente/discovery/pages/ClienteBarbershopDetailPage";
import ClienteReservationsPage from "../features/cliente/appointments/pages/ClienteReservationsPage";
import ClienteNotificationsPage from "../features/cliente/notifications/pages/ClienteNotificationsPage";

// ─── ProtectedRoute ───────────────────────────────────────────────────────────
interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuthStore();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#131313]">
        <span className="text-[#d0c5af]">Cargando...</span>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <>{children}</>;
  }

  const hasAccess = allowedRoles.some((role) => user.roles.includes(role));
  if (!hasAccess) {
    if (user.roles.includes("ROLE_CLIENTE"))
      return <Navigate to="/cliente/discovery" replace />;
    if (user.roles.includes("ROLE_BARBERO"))
      return <Navigate to="/barbero/dashboard" replace />;
    if (user.roles.includes("ROLE_BARBERIA"))
      return <Navigate to="/barberia/home" replace />;
    return (
      <div className="flex items-center justify-center h-screen bg-[#131313]">
        <span className="text-[#d0c5af]">No tienes acceso a esta página.</span>
      </div>
    );
  }

  return <>{children}</>;
}

// ─── Routes_ — sin checkAuth aquí, lo maneja RouteByRole ─────────────────────
function Routes_() {
  return (
    <Routes>
      {/* Públicas */}
      <Route path="/" element={<HomePage />} />
      <Route path="/auth/callback" element={<RouteByRole />} />

      {/* ── BARBERÍA ── */}
      <Route
        path="/barberia/onboarding"
        element={
          <ProtectedRoute allowedRoles={["ROLE_BARBERIA"]}>
            <BarberiaOnboardingPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/barberia/home"
        element={
          <ProtectedRoute allowedRoles={["ROLE_BARBERIA"]}>
            <BarberiaHomePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/barberia/barberos"
        element={
          <ProtectedRoute allowedRoles={["ROLE_BARBERIA"]}>
            <BarberiaBarberosPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/barberia/servicios"
        element={
          <ProtectedRoute allowedRoles={["ROLE_BARBERIA"]}>
            <BarberiaServicesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/barberia/agenda"
        element={
          <ProtectedRoute allowedRoles={["ROLE_BARBERIA"]}>
            <BarberiaSchedulePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/barberia/notifications"
        element={
          <ProtectedRoute allowedRoles={["ROLE_BARBERIA"]}>
            <BarberiaNotificationsPage />
          </ProtectedRoute>
        }
      />

      {/* ── BARBERO ── */}
      <Route path="/invitations/:token" element={<BarberoInvitacionPage />} />
      <Route
        path="/barbero/dashboard"
        element={
          <ProtectedRoute allowedRoles={["ROLE_BARBERO"]}>
            <BarberoDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/barbero/appointments/today"
        element={
          <ProtectedRoute allowedRoles={["ROLE_BARBERO"]}>
            <BarberoTodayAppointmentsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/barbero/cash-desk"
        element={
          <ProtectedRoute allowedRoles={["ROLE_BARBERO"]}>
            <BarberoCashDeskPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/barbero/availability"
        element={
          <ProtectedRoute allowedRoles={["ROLE_BARBERO"]}>
            <BarberoDailyAvailabilityPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/barbero/breaks"
        element={
          <ProtectedRoute allowedRoles={["ROLE_BARBERO"]}>
            <BarberoBreaksPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/barbero/notifications"
        element={
          <ProtectedRoute allowedRoles={["ROLE_BARBERO"]}>
            <BarberoNotificationsPage />
          </ProtectedRoute>
        }
      />

      {/* ── CLIENTE ── */}
      <Route
        path="/cliente"
        element={<Navigate to="/cliente/discovery" replace />}
      />
      <Route
        path="/cliente/discovery"
        element={
          <ProtectedRoute allowedRoles={["ROLE_CLIENTE"]}>
            <ClienteDiscoveryPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/cliente/barbershop/:id"
        element={
          <ProtectedRoute allowedRoles={["ROLE_CLIENTE"]}>
            <ClienteBarbershopDetailPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/cliente/appoinments"
        element={
          <ProtectedRoute allowedRoles={["ROLE_CLIENTE"]}>
            <ClienteReservationsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/cliente/notifications"
        element={
          <ProtectedRoute allowedRoles={["ROLE_CLIENTE"]}>
            <ClienteNotificationsPage />
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes_ />
    </BrowserRouter>
  );
}
