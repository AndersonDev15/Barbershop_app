import { Navigate } from "react-router-dom";
import { useAuthStore } from "../features/auth/authStore";

export default function HomePage() {
  const { isAuthenticated, isLoading, user } = useAuthStore();

  // ⛔ Mientras valida sesión
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-on-surface">
        <span>Cargando...</span>
      </div>
    );
  }

  // 🔥 SI YA HAY SESIÓN → REDIRIGE
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

  // 👇 Si NO hay sesión → muestra login normal
  return (
    <div className="min-h-screen bg-background text-on-surface flex items-center justify-center">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-headline font-extrabold text-primary">
          Barber App
        </h1>

        <p className="text-on-surface-variant max-w-md mx-auto">
          Book premium grooming experiences with the best barbers near you.
        </p>

        <button
          onClick={() => {
            window.location.href = `${
              import.meta.env.VITE_BFF_URL ?? "http://127.0.0.1:8090"
            }/oauth2/authorization/barberia-client`;
          }}
          className="px-8 py-4 bg-primary text-on-primary rounded-full font-bold hover:scale-105 active:scale-95 transition-all"
        >
          Login
        </button>
      </div>
    </div>
  );
}
