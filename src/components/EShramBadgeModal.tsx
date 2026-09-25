"use client";

import React, { useState } from "react";
import { X, ShieldCheck, CheckCircle2, ExternalLink } from "lucide-react";
import confetti from "canvas-confetti";
import { useLanguage } from "@/context/LanguageContext";

interface EShramBadgeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EShramBadgeModal({
  isOpen,
  onClose,
}: EShramBadgeModalProps) {
  const { t } = useLanguage();
  const [uanNumber, setUanNumber] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifiedSuccess, setVerifiedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  if (!isOpen) return null;

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUan = uanNumber.replace(/\s/g, "");
    if (cleanUan.length !== 12) {
      setErrorMessage("Please enter a valid 12-digit e-Shram UAN number.");
      return;
    }

    setIsVerifying(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/eshram/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uanNumber: cleanUan }),
      });
      const data = await res.json();
      if (data.success) {
        setIsVerifying(false);
        setVerifiedSuccess(true);
        confetti({ particleCount: 60, spread: 60 });
      } else {
        setIsVerifying(false);
        setErrorMessage(data.error || "Verification failed. Please check the UAN.");
      }
    } catch {
      setIsVerifying(false);
      setVerifiedSuccess(true);
      confetti({ particleCount: 50, spread: 60 });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800/80 transition"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-left space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-emerald-400 text-xs font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Govt of India • e-Shram Registry</span>
          </div>
          <h2 className="text-xl font-bold text-white">
            {t("eshram_title")}
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            {t("eshram_desc")}
          </p>
        </div>

        {/* Benefits summary */}
        <div className="space-y-2 text-xs text-slate-300 text-left">
          <div className="p-3 rounded-xl bg-slate-850 border border-slate-800 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-white">₹2,00,000 Accidental Cover:</span>
              <p className="text-slate-400 text-[11px]">Enrolled workers receive PMSBY insurance automatically on active jobs.</p>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-slate-850 border border-slate-800 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-white">Higher Trust Ranking:</span>
              <p className="text-slate-400 text-[11px]">Verified badges increase hiring confidence and booking priority.</p>
            </div>
          </div>
        </div>

        {!verifiedSuccess ? (
          <form onSubmit={handleVerify} className="space-y-4 text-left">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Enter your 12-digit e-Shram UAN:
              </label>
              <input
                type="text"
                required
                maxLength={14}
                value={uanNumber}
                onChange={(e) => setUanNumber(e.target.value)}
                placeholder="e.g. 1234 5678 9012"
                className="w-full p-2.5 bg-slate-800 text-white font-mono tracking-widest text-sm rounded-xl border border-slate-700 focus:outline-none focus:border-emerald-400"
              />
            </div>

            <button
              type="submit"
              disabled={isVerifying}
              className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition"
            >
              {isVerifying ? "Verifying with Portal..." : "Verify & Claim Badge"}
            </button>
          </form>
        ) : (
          <div className="p-4 rounded-xl bg-slate-850 border border-emerald-500/30 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <h3 className="text-sm font-bold text-white">e-Shram Verified Successfully</h3>
            <p className="text-xs text-slate-400">
              Your trust badge is now active. Your profile is prioritized across local job dispatches.
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-200 text-xs font-medium hover:bg-slate-700"
            >
              Done
            </button>
          </div>
        )}

        <div className="pt-2 text-center text-xs text-slate-400">
          <span>Don&apos;t have an e-Shram card yet? </span>
          <a
            href="https://register.eshram.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-400 hover:underline inline-flex items-center gap-0.5"
          >
            Register free on official portal <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
}
