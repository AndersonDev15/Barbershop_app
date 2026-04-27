import { Navigate } from "react-router-dom";
import { useAuthStore } from "../features/auth/authStore";
import type { UserRole } from "../features/auth/authStore";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

export default function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuthStore();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#131313]">
        <span className="text-[#d0c5af]">Cargando...</span>
      </div>
    );
  }

  // 🔥 AQUÍ ESTÁ EL FIX
  if (!isAuthenticated || !user) {
    return <Navigate to="/" replace />;
  }

  const hasAccess = allowedRoles.some((role) => user.roles.includes(role));

  if (!hasAccess) {
    if (user.roles.includes("ROLE_CLIENTE"))
      return <Navigate to="/cliente/discovery" replace />;
    if (user.roles.includes("ROLE_BARBERO"))
      return <Navigate to="/barbero/dashboard" replace />;
    if (user.roles.includes("ROLE_BARBERIA"))
      return <Navigate to="/barberia/home" replace />;
  }

  return <>{children}</>;
}
