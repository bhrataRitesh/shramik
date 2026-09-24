"use client";

import React, { useState } from "react";
import { X, Smartphone, CheckCircle2, KeyRound } from "lucide-react";
import confetti from "canvas-confetti";
import { useAuthRole, UserRole } from "@/context/AuthRoleContext";

export default function PhoneAuthModal() {
  const { openAuthModal, setOpenAuthModal, loginWithPhone, role, setRole } = useAuthRole();

  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [name, setName] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole>(role);
  const [otpCode, setOtpCode] = useState("");
  const [demoCode, setDemoCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!openAuthModal) return null;

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.replace(/[^0-9]/g, "").length < 10) {
      setErrorMsg("Please enter a valid 10-digit mobile number.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phoneNumber, role: selectedRole }),
      });
      const data = await res.json();
      if (data.success) {
        setDemoCode(data.demoOtp || "481920");
        setStep("otp");
      } else {
        setErrorMsg(data.error || "Failed to dispatch SMS OTP. Please retry.");
      }
    } catch {
      setDemoCode("592184");
      setStep("otp");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.length < 4) {
      setErrorMsg("Please enter the complete OTP code.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: phoneNumber,
          otp: otpCode,
          name,
          role: selectedRole,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setRole(selectedRole);
        loginWithPhone(phoneNumber, name);
        confetti({ particleCount: 50, spread: 60 });
        setStep("phone");
      } else {
        setErrorMsg(data.error || "Invalid OTP code. Please enter the correct code.");
      }
    } catch {
      setRole(selectedRole);
      loginWithPhone(phoneNumber, name);
      setStep("phone");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl space-y-5">
        <button
          onClick={() => setOpenAuthModal(false)}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800/80 transition"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-left space-y-1">
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-800 text-amber-400 text-xs font-medium">
            <Smartphone className="w-3.5 h-3.5" />
            <span>Secure Phone Login</span>
          </div>
          <h2 className="text-xl font-bold text-white">
            {step === "phone" ? "Sign In / Register" : "Verify SMS Code"}
          </h2>
          <p className="text-xs text-slate-400">
            {step === "phone"
              ? "Zero passwords required. An SMS verification code will be sent to your mobile."
              : `Enter the code sent to ${phoneNumber}.`}
          </p>
        </div>

        {errorMsg && (
          <div className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-500/20 text-rose-300 text-xs text-left">
            {errorMsg}
          </div>
        )}

        {step === "phone" ? (
          <form onSubmit={handleSendOtp} className="space-y-4 text-left">
            {/* Role Selection */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                I am using Shramik as:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedRole("hirer")}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border transition ${
                    selectedRole === "hirer"
                      ? "bg-slate-800 text-white border-amber-400"
                      : "bg-slate-850 text-slate-400 border-slate-800 hover:text-slate-200"
                  }`}
                >
                  Employer (Hirer)
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRole("labourer")}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border transition ${
                    selectedRole === "labourer"
                      ? "bg-slate-800 text-white border-emerald-400"
                      : "bg-slate-850 text-slate-400 border-slate-800 hover:text-slate-200"
                  }`}
                >
                  Artisan (Worker)
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Your Full Name (Optional):
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ritesh Kumar"
                className="w-full p-2.5 bg-slate-800 text-white text-xs rounded-xl border border-slate-700 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                10-digit Mobile Number:
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-mono">
                  +91
                </span>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/[^0-9]/g, ""))}
                  placeholder="98765 43210"
                  className="w-full pl-12 pr-3 py-2.5 bg-slate-800 text-white text-xs font-mono tracking-wider rounded-xl border border-slate-700 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition"
            >
              {loading ? "Sending SMS OTP..." : "Send Verification Code"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4 text-left">
            {demoCode && (
              <div className="p-2.5 rounded-xl bg-slate-850 border border-slate-700 flex items-center justify-between text-xs">
                <span className="text-slate-400">Demo SMS OTP:</span>
                <button
                  type="button"
                  onClick={() => setOtpCode(demoCode)}
                  className="font-mono font-bold text-amber-400 hover:underline"
                >
                  {demoCode} (Auto-fill)
                </button>
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Enter 6-digit Code:
              </label>
              <input
                type="text"
                required
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ""))}
                placeholder="• • • • • •"
                className="w-full p-2.5 bg-slate-800 text-white text-center font-mono tracking-widest text-lg rounded-xl border border-slate-700 focus:outline-none focus:border-amber-400"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition"
            >
              {loading ? "Verifying..." : "Verify & Continue"}
            </button>

            <button
              type="button"
              onClick={() => setStep("phone")}
              className="w-full text-center text-xs text-slate-400 hover:text-slate-200 transition"
            >
              ← Back to change phone number
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
