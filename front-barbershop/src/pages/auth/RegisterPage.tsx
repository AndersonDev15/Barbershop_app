import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../lib/api"; // ajusta la ruta según donde tengas tu api.ts

type Role = "CLIENTE" | "BARBERO" | "BARBERIA";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    password: "",
  });
  const [role, setRole] = useState<Role>("CLIENTE");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateEmail = (email: string) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    // Basic Validation
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.phone ||
      !formData.email ||
      !formData.password
    ) {
      setError("Todos los campos son requeridos.");
      return;
    }

    if (!validateEmail(formData.email)) {
      setError("Email debe tener un formato válido.");
      return;
    }

    if (formData.password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    setLoading(true);

    try {
      await api.post("/api/auth/register", {
        ...formData,
        role,
      });

      setSuccess(true);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Ocurrió un error al registrar el usuario.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 sm:p-12 overflow-x-hidden bg-[#131313] text-[#e5e2e1] font-['Inter']">
      {/* TopAppBar Mock for Brand Context */}
      <header className="flex justify-center items-center w-full py-8 fixed top-0 bg-transparent z-20">
        <div className="text-2xl font-black tracking-tighter text-[#f2ca50] font-['Manrope']">
          BarberOS
        </div>
      </header>

      <main className="w-full max-w-4xl mt-20 mb-20 relative z-10">
        {/* Main Form Container */}
        <div className="bg-[#1c1b1b] rounded-[1rem] p-8 md:p-12 shadow-2xl relative overflow-hidden group min-h-[500px] flex items-center">
          {/* Decorative Accent */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#f2ca50]/5 rounded-full blur-3xl -mr-32 -mt-32"></div>

          <div className="flex flex-col gap-8 relative z-10 w-full">
            {!success ? (
              <>
                {/* Header */}
                <div className="space-y-2">
                  <span className="text-[14px] uppercase tracking-widest text-[#f2ca50] font-['Manrope'] font-bold">
                    Join the Craft
                  </span>
                  <h1 className="text-4xl md:text-5xl font-extrabold font-['Manrope'] text-[#e5e2e1] tracking-tight">
                    Create Account
                  </h1>
                </div>

                <form
                  onSubmit={handleSubmit}
                  className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6"
                >
                  {/* First Name */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-[#d0c5af] font-['Inter']">
                      First Name
                    </label>
                    <input
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="bg-[#2a2a2a] border-none text-[#e5e2e1] rounded-full px-6 py-4 focus:ring-2 focus:ring-[#f2ca50] placeholder:text-neutral-600 transition-all outline-none"
                      placeholder="Julian"
                      type="text"
                    />
                  </div>

                  {/* Last Name */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-[#d0c5af] font-['Inter']">
                      Last Name
                    </label>
                    <input
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="bg-[#2a2a2a] border-none text-[#e5e2e1] rounded-full px-6 py-4 focus:ring-2 focus:ring-[#f2ca50] placeholder:text-neutral-600 transition-all outline-none"
                      placeholder="Ross"
                      type="text"
                    />
                  </div>

                  {/* Phone */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-[#d0c5af] font-['Inter']">
                      Phone
                    </label>
                    <input
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="bg-[#2a2a2a] border-none text-[#e5e2e1] rounded-full px-6 py-4 focus:ring-2 focus:ring-[#f2ca50] placeholder:text-neutral-600 transition-all outline-none"
                      placeholder="+1 (555) 000-0000"
                      type="tel"
                    />
                  </div>

                  {/* Email */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-[#d0c5af] font-['Inter']">
                      Email
                    </label>
                    <input
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="bg-[#2a2a2a] border-none text-[#e5e2e1] rounded-full px-6 py-4 focus:ring-2 focus:ring-[#f2ca50] placeholder:text-neutral-600 transition-all outline-none"
                      placeholder="julian.ross@atelier.com"
                      type="email"
                    />
                  </div>

                  {/* Password */}
                  <div className="flex flex-col gap-2 md:col-span-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-[#d0c5af] font-['Inter']">
                      Password
                    </label>
                    <div className="relative group">
                      <input
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full bg-[#2a2a2a] border-none text-[#e5e2e1] rounded-full px-6 py-4 focus:ring-2 focus:ring-[#f2ca50] placeholder:text-neutral-600 transition-all outline-none"
                        placeholder="••••••••••••"
                        type={showPassword ? "text" : "password"}
                      />
                      <button
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-6 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-[#f2ca50] transition-colors"
                        type="button"
                      >
                        <span className="material-symbols-outlined">
                          {showPassword ? "visibility_off" : "visibility"}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Role Selection Section */}
                  <div className="md:col-span-2 pt-4">
                    <label className="text-xs font-semibold uppercase tracking-wider text-[#d0c5af] font-['Inter'] block mb-4">
                      Choose Your Path
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Client Role */}
                      <label className="cursor-pointer group/card">
                        <input
                          checked={role === "CLIENTE"}
                          onChange={() => setRole("CLIENTE")}
                          className="peer hidden"
                          name="role"
                          type="radio"
                        />
                        <div className="h-full p-6 bg-[#201f1f] rounded-[1rem] border-2 border-transparent peer-checked:border-[#f2ca50] peer-checked:bg-[#3a3939] transition-all flex flex-col gap-3">
                          <div className="flex justify-between items-start">
                            <div className="w-10 h-10 rounded-full bg-[#f2ca50]/10 flex items-center justify-center text-[#f2ca50]">
                              <span className="material-symbols-outlined">
                                person
                              </span>
                            </div>
                            <div
                              className={`w-4 h-4 rounded-full border-2 border-[#99907c] ${
                                role === "CLIENTE" ? "bg-[#f2ca50]" : ""
                              }`}
                            ></div>
                          </div>
                          <div className="mt-2">
                            <div className="font-bold text-[#e5e2e1] font-['Manrope'] uppercase text-sm tracking-wide">
                              CLIENT
                            </div>
                            <p className="text-xs text-[#d0c5af] mt-1 leading-relaxed">
                              Book services and manage reservations in seconds.
                            </p>
                          </div>
                        </div>
                      </label>

                      {/* Barber Role */}
                      <label className="cursor-pointer group/card">
                        <input
                          checked={role === "BARBERO"}
                          onChange={() => setRole("BARBERO")}
                          className="peer hidden"
                          name="role"
                          type="radio"
                        />
                        <div className="h-full p-6 bg-[#201f1f] rounded-[1rem] border-2 border-transparent peer-checked:border-[#3de1fc] peer-checked:bg-[#3a3939] transition-all flex flex-col gap-3">
                          <div className="flex justify-between items-start">
                            <div className="w-10 h-10 rounded-full bg-[#3de1fc]/10 flex items-center justify-center text-[#3de1fc]">
                              <span className="material-symbols-outlined">
                                content_cut
                              </span>
                            </div>
                            <div
                              className={`w-4 h-4 rounded-full border-2 border-[#99907c] ${
                                role === "BARBERO" ? "bg-[#3de1fc]" : ""
                              }`}
                            ></div>
                          </div>
                          <div className="mt-2">
                            <div className="font-bold text-[#e5e2e1] font-['Manrope'] uppercase text-sm tracking-wide">
                              BARBER
                            </div>
                            <p className="text-xs text-[#d0c5af] mt-1 leading-relaxed">
                              Manage your daily chair, clients, and
                              availability.
                            </p>
                          </div>
                        </div>
                      </label>

                      {/* Barbershop Role */}
                      <label className="cursor-pointer group/card">
                        <input
                          checked={role === "BARBERIA"}
                          onChange={() => setRole("BARBERIA")}
                          className="peer hidden"
                          name="role"
                          type="radio"
                        />
                        <div className="h-full p-6 bg-[#201f1f] rounded-[1rem] border-2 border-transparent peer-checked:border-[#d4af37] peer-checked:bg-[#3a3939] transition-all flex flex-col gap-3">
                          <div className="flex justify-between items-start">
                            <div className="w-10 h-10 rounded-full bg-[#d4af37]/10 flex items-center justify-center text-[#d4af37]">
                              <span className="material-symbols-outlined">
                                storefront
                              </span>
                            </div>
                            <div
                              className={`w-4 h-4 rounded-full border-2 border-[#99907c] ${
                                role === "BARBERIA" ? "bg-[#d4af37]" : ""
                              }`}
                            ></div>
                          </div>
                          <div className="mt-2">
                            <div className="font-bold text-[#e5e2e1] font-['Manrope'] uppercase text-sm tracking-wide">
                              BARBERSHOP
                            </div>
                            <p className="text-xs text-[#d0c5af] mt-1 leading-relaxed">
                              Oversee multiple barbers, services, and revenue.
                            </p>
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Action Area */}
                  <div className="md:col-span-2 pt-6 flex flex-col gap-4">
                    {error && (
                      <div className="text-red-400 text-xs font-bold text-center animate-shake">
                        {error}
                      </div>
                    )}
                    <button
                      disabled={loading}
                      className="w-full bg-[#f2ca50] text-[#3c2f00] font-bold font-['Manrope'] py-5 rounded-full text-lg hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-[#f2ca50]/20 disabled:opacity-50 disabled:pointer-events-none"
                      type="submit"
                    >
                      {loading ? "Creating account..." : "Create Account"}
                    </button>
                    <p className="text-center text-xs text-[#d0c5af]">
                      Already have an account?{" "}
                      <Link
                        to="/login"
                        className="text-[#f2ca50] hover:underline underline-offset-4"
                      >
                        Sign in to the Atelier
                      </Link>
                    </p>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex flex-col items-center text-center py-8 animate-in fade-in zoom-in duration-500">
                <div className="w-24 h-24 rounded-full bg-[#f2ca50]/10 flex items-center justify-center text-[#f2ca50] mb-8">
                  <span
                    className="material-symbols-outlined text-6xl"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    mark_email_read
                  </span>
                </div>
                <h2 className="text-3xl md:text-4xl font-extrabold font-['Manrope'] text-[#e5e2e1] mb-4">
                  Account Created Successfully
                </h2>
                <p className="text-[#d0c5af] text-lg max-w-md mb-2">
                  We've sent a verification email to{" "}
                  <span className="text-[#f2ca50] font-bold">
                    {formData.email}
                  </span>
                  .
                </p>
                <p className="text-[#d0c5af] text-sm max-w-md mb-8 leading-relaxed">
                  Please check your inbox and activate your account before
                  signing in.
                </p>
                <div className="p-4 bg-[#2a2a2a] rounded-2xl border border-white/5 mb-10">
                  <p className="text-xs text-[#d0c5af]/60 font-medium">
                    Didn't receive the email? Check your spam folder.
                  </p>
                </div>
                <button
                  onClick={() => navigate("/login")}
                  className="w-full max-w-xs bg-[#f2ca50] text-[#3c2f00] font-bold font-['Manrope'] py-4 rounded-full text-lg hover:scale-[1.05] active:scale-95 transition-all shadow-xl shadow-[#f2ca50]/20"
                >
                  Go to Login
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Success Toast - Removed since we have the success card */}
      </main>

      {/* Footer Mock */}
      <footer className="flex flex-col md:flex-row justify-between items-center w-full px-12 py-8 gap-4 mt-auto relative z-10">
        <div className="text-sm font-bold text-neutral-500 font-['Manrope'] uppercase tracking-widest">
          BarberOS
        </div>
        <div className="flex gap-8">
          <a
            className="text-neutral-500 hover:text-[#f2ca50] transition-all text-xs font-['Inter']"
            href="#"
          >
            Privacy Policy
          </a>
          <a
            className="text-neutral-500 hover:text-[#f2ca50] transition-all text-xs font-['Inter']"
            href="#"
          >
            Terms of Service
          </a>
          <a
            className="text-neutral-500 hover:text-[#f2ca50] transition-all text-xs font-['Inter']"
            href="#"
          >
            Support
          </a>
        </div>
        <div className="text-xs font-['Inter'] text-neutral-600">
          © 2026 BarberOS. All rights reserved.
        </div>
      </footer>

      {/* Background Decoration */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-1/4 -left-1/4 w-[1000px] h-[1000px] bg-[#f2ca50]/5 rounded-full blur-[120px]"></div>
        <div className="absolute -bottom-1/4 -right-1/4 w-[800px] h-[800px] bg-[#3de1fc]/5 rounded-full blur-[120px]"></div>
      </div>
    </div>
  );
}
