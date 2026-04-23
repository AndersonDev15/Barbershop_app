import { useEffect } from "react";
import { useAuthStore } from "./authStore";

export default function AuthInitializer() {
  const checkAuth = useAuthStore((s) => s.checkAuth);

  useEffect(() => {
    checkAuth(); // 👈 usa TU lógica existente
  }, []);

  return null;
}
