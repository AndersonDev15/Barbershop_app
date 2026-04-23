import axios from "axios";

// Todo pasa por el BFF — nunca llames directo a :8080 ni :9000
const api = axios.create({
  baseURL: import.meta.env.VITE_BFF_URL ?? "http://127.0.0.1:8090",
  headers: {
    "Content-Type": "application/json",
  },
  // Esto es lo más importante: envía la cookie de sesión en cada request
  withCredentials: true,
});

// ─── Response interceptor ────────────────────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const data = error.response?.data;

    // 1. Sesión expirada → login
    if (status === 401) {
      window.location.href = "/";
      return Promise.reject(error);
    }

    // 2. Barbería inactiva (nuevo)
    if (status === 400 && data?.errors?.[0]?.error === "BUSINESS_MISTAKE") {
      window.dispatchEvent(
        new CustomEvent("barberia:inactive", {
          detail: {
            message: data?.message ?? "Tu barbería está inactiva.",
          },
        }),
      );
    }

    return Promise.reject(error);
  },
);

export default api;
