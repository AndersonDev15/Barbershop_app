import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../../lib/api";

type Status = "loading" | "success" | "error";

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<Status>("loading");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const hasFired = useRef(false); // ← bloquea el segundo disparo

  useEffect(() => {
    if (hasFired.current) return; // ← StrictMode monta dos veces, solo dejamos pasar una
    hasFired.current = true;

    const token = searchParams.get("token");

    if (!token) {
      setStatus("error");
      setErrorMessage("No verification token found in the URL.");
      return;
    }

    const verifyEmail = async () => {
      try {
        await api.get(`/api/auth/verify-email?token=${token}`);
        setStatus("success");
      } catch (err: any) {
        setStatus("error");
        setErrorMessage(
          err.response?.data?.message ||
            "This link is invalid or has already expired. Please register again.",
        );
      }
    };

    verifyEmail();
  }, [searchParams]);
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#131313] text-[#e5e2e1] font-['Inter'] relative overflow-hidden">
      {/* Background Decoration */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-1/4 -left-1/4 w-[1000px] h-[1000px] bg-[#f2ca50]/5 rounded-full blur-[120px]"></div>
        <div className="absolute -bottom-1/4 -right-1/4 w-[800px] h-[800px] bg-[#3de1fc]/5 rounded-full blur-[120px]"></div>
      </div>

      {/* Brand Name */}
      <div className="mb-12 text-center animate-in fade-in duration-700">
        <h1 className="text-3xl font-black tracking-tighter text-[#f2ca50] font-['Manrope']">
          BarberOS
        </h1>
        <p className="text-[10px] uppercase tracking-[0.3em] text-[#d0c5af]/60 font-bold mt-2">
          Executive Grooming
        </p>
      </div>

      <div className="w-full max-w-md bg-[#201f1f] rounded-[1rem] p-8 md:p-12 shadow-2xl relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {status === "loading" && (
          <div className="flex flex-col items-center py-8">
            <div className="w-16 h-16 border-4 border-[#f2ca50]/20 border-t-[#f2ca50] rounded-full animate-spin mb-6"></div>
            <p className="text-[#d0c5af] font-medium animate-pulse">
              Verifying your email...
            </p>
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-col items-center text-center py-4">
            <div className="w-20 h-20 rounded-full bg-[#f2ca50]/10 flex items-center justify-center text-[#f2ca50] mb-8">
              <span
                className="material-symbols-outlined text-5xl"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                check_circle
              </span>
            </div>
            <h2 className="text-3xl font-extrabold font-['Manrope'] text-[#e5e2e1] mb-4 tracking-tight">
              Email Verified!
            </h2>
            <p className="text-[#d0c5af] text-sm mb-10 leading-relaxed">
              Your account is now active. You can sign in and start using the
              platform.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="w-full bg-[#f2ca50] text-[#3c2f00] font-bold font-['Manrope'] py-4 rounded-full text-lg hover:scale-[1.05] active:scale-95 transition-all shadow-xl shadow-[#f2ca50]/20"
            >
              Go to Login
            </button>
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center text-center py-4">
            <div className="w-20 h-20 rounded-full bg-[#ffb4ab]/10 flex items-center justify-center text-[#ffb4ab] mb-8">
              <span
                className="material-symbols-outlined text-5xl"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                error
              </span>
            </div>
            <h2 className="text-3xl font-extrabold font-['Manrope'] text-[#e5e2e1] mb-4 tracking-tight">
              Verification Failed
            </h2>
            <p className="text-[#d0c5af] text-sm mb-10 leading-relaxed">
              {errorMessage}
            </p>
            <button
              onClick={() => navigate("/register")}
              className="w-full bg-[#ffb4ab] text-[#690005] font-bold font-['Manrope'] py-4 rounded-full text-lg hover:scale-[1.05] active:scale-95 transition-all shadow-xl shadow-[#ffb4ab]/20"
            >
              Back to Register
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
