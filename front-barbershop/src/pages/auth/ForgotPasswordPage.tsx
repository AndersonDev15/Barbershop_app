import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../lib/api";

type Step = 1 | 2 | 3;

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSendOTP = async () => {
    if (!email) {
      setError("Por favor ingresa tu email");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await api.post("/api/auth/forgot-password", { email });
      setStep(2);
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al enviar el código");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp) {
      setError("Por favor ingresa el código de verificación");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await api.post("/api/auth/verify-otp", { email, otp });
      setStep(3);
    } catch (err: any) {
      setError(err.response?.data?.message || "Código inválido o expirado");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!password || !confirmPassword) {
      setError("Por favor completa todos los campos");
      return;
    }
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }
    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await api.post("/api/auth/reset-password", {
        email,
        otp,
        newPassword: password,
      });
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al restablecer la contraseña");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-surface text-on-surface font-['Inter'] relative overflow-hidden">
      {/* Background Decoration */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-1/4 -left-1/4 w-[1000px] h-[1000px] bg-primary/5 rounded-full blur-[120px]"></div>
        <div className="absolute -bottom-1/4 -right-1/4 w-[800px] h-[800px] bg-tertiary/5 rounded-full blur-[120px]"></div>
      </div>

      {/* Brand Name */}
      <div className="mb-12 text-center animate-in fade-in duration-700">
        <h1 className="text-3xl font-black tracking-tighter text-primary font-headline">
          BarberOS
        </h1>
        <p className="text-[10px] uppercase tracking-[0.3em] text-on-surface-variant/60 font-bold mt-2">
          Security Center
        </p>
      </div>

      <div className="w-full max-w-md bg-surface-container rounded-[1rem] p-8 md:p-12 shadow-2xl relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {!success ? (
          <div className="flex flex-col gap-8">
            {/* Step Indicator */}
            <div className="flex justify-between items-center px-4 mb-2">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center flex-1 last:flex-none">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 ${
                      step === s
                        ? "bg-primary text-on-primary shadow-lg shadow-primary/20 scale-110"
                        : step > s
                        ? "bg-primary/20 text-primary"
                        : "bg-surface-container-highest text-on-surface-variant/40"
                    }`}
                  >
                    {step > s ? (
                      <span className="material-symbols-outlined text-sm">check</span>
                    ) : (
                      s
                    )}
                  </div>
                  {s < 3 && (
                    <div
                      className={`h-px flex-1 mx-2 transition-all duration-500 ${
                        step > s ? "bg-primary/50" : "bg-surface-container-highest"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Header */}
            <div className="space-y-2 text-center">
              <h2 className="text-2xl font-extrabold font-headline text-on-surface tracking-tight">
                {step === 1 && "Recuperar cuenta"}
                {step === 2 && "Verificar código"}
                {step === 3 && "Nueva contraseña"}
              </h2>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                {step === 1 && "Ingresa tu email para recibir un código de recuperación."}
                {step === 2 && `Hemos enviado un código a ${email}.`}
                {step === 3 && "Crea una nueva contraseña segura para tu cuenta."}
              </p>
            </div>

            {/* Form */}
            <div className="flex flex-col gap-5">
              {step === 1 && (
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant ml-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-surface-container-high border-none text-on-surface rounded-full px-6 py-4 focus:ring-2 focus:ring-primary placeholder:text-neutral-600 transition-all outline-none"
                    placeholder="julian.ross@atelier.com"
                  />
                </div>
              )}

              {step === 2 && (
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant ml-1">
                    Código de verificación
                  </label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="bg-surface-container-high border-none text-on-surface rounded-full px-6 py-4 focus:ring-2 focus:ring-primary placeholder:text-neutral-600 transition-all outline-none text-center tracking-[1em] font-bold"
                    placeholder="000000"
                    maxLength={6}
                  />
                  <button
                    onClick={() => {
                      setStep(1);
                      setOtp("");
                      setError(null);
                    }}
                    className="text-xs text-primary hover:underline mt-2 w-fit ml-1"
                  >
                    ← Volver
                  </button>
                </div>
              )}

              {step === 3 && (
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant ml-1">
                      Nueva contraseña
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-surface-container-high border-none text-on-surface rounded-full px-6 py-4 focus:ring-2 focus:ring-primary placeholder:text-neutral-600 transition-all outline-none"
                      placeholder="••••••••••••"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant ml-1">
                      Confirmar contraseña
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="bg-surface-container-high border-none text-on-surface rounded-full px-6 py-4 focus:ring-2 focus:ring-primary placeholder:text-neutral-600 transition-all outline-none"
                      placeholder="••••••••••••"
                    />
                  </div>
                  <button
                    onClick={() => {
                      setStep(2);
                      setPassword("");
                      setConfirmPassword("");
                      setError(null);
                    }}
                    className="text-xs text-primary hover:underline mt-1 w-fit ml-1"
                  >
                    ← Volver
                  </button>
                </div>
              )}

              {error && (
                <p className="text-error text-xs font-bold text-center px-4 animate-in fade-in slide-in-from-top-2">
                  {error}
                </p>
              )}

              <button
                disabled={loading}
                onClick={
                  step === 1 ? handleSendOTP : step === 2 ? handleVerifyOTP : handleResetPassword
                }
                className="w-full bg-primary text-on-primary font-bold font-headline py-4 rounded-full text-lg hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-3 disabled:opacity-50 disabled:pointer-events-none mt-2"
              >
                {loading && (
                  <div className="w-5 h-5 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin" />
                )}
                {step === 1 && "Enviar código"}
                {step === 2 && "Verificar código"}
                {step === 3 && "Cambiar contraseña"}
              </button>
            </div>

            <div className="text-center">
              <Link
                to="/login"
                className="text-xs text-on-surface-variant hover:text-primary transition-colors"
              >
                Volver al login
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center py-4 animate-in fade-in zoom-in duration-500">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-8">
              <span
                className="material-symbols-outlined text-5xl"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                verified
              </span>
            </div>
            <h2 className="text-3xl font-extrabold font-headline text-on-surface mb-4 tracking-tight">
              ¡Contraseña cambiada!
            </h2>
            <p className="text-on-surface-variant text-sm mb-10 leading-relaxed">
              Tu contraseña ha sido actualizada correctamente. Ya puedes iniciar sesión con tus
              nuevas credenciales.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="w-full bg-primary text-on-primary font-bold font-headline py-4 rounded-full text-lg hover:scale-[1.05] active:scale-95 transition-all shadow-xl shadow-primary/20"
            >
              Ir al Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
