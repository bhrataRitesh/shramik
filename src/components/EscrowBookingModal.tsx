"use client";

import React, { useState } from "react";
import {
  X,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  Share2,
} from "lucide-react";
import confetti from "canvas-confetti";
import { ShramikData } from "@/lib/mockData";
import { useLanguage } from "@/context/LanguageContext";
import { useAuthRole } from "@/context/AuthRoleContext";
import RazorpayModal from "@/components/RazorpayModal";

interface EscrowBookingModalProps {
  shramik: ShramikData | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function EscrowBookingModal({
  shramik,
  isOpen,
  onClose,
}: EscrowBookingModalProps) {
  const { t } = useLanguage();
  const { createBooking } = useAuthRole();

  const [step, setStep] = useState<"details" | "confirmed">("details");
  const [days, setDays] = useState(1);
  const [employerName, setEmployerName] = useState("Ritesh Kumar");
  const [employerPhone, setEmployerPhone] = useState("+91 98765 43210");
  const [siteAddress, setSiteAddress] = useState("House 42, HSR Layout, Sector 2, Bengaluru");
  const [otpCode, setOtpCode] = useState("");
  const [razorpayOpen, setRazorpayOpen] = useState(false);

  if (!isOpen || !shramik) return null;

  const totalWage = (shramik.price || shramik.dailyWageRate) * days;
  const platformFee = 0;
  const totalPayable = totalWage + platformFee;

  const handleStartPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!employerName || !employerPhone || !siteAddress) {
      alert("Please fill in all booking details.");
      return;
    }
    setRazorpayOpen(true);
  };

  const handlePaymentSuccess = () => {
    setRazorpayOpen(false);

    const created = createBooking({
      jobTitle: shramik.title,
      employerName,
      employerPhone,
      workerName: shramik.name || shramik.title,
      workerPhone: shramik.phone,
      dailyRate: shramik.price,
      days,
      totalWage: totalPayable,
      siteAddress,
    });

    setOtpCode(created.checkInOtp);
    setStep("confirmed");
    confetti({ particleCount: 60, spread: 60 });
  };

  const handleReset = () => {
    setStep("details");
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="relative w-full max-w-md p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl space-y-5 max-h-[92vh] overflow-y-auto">
          {/* Close */}
          <button
            onClick={handleReset}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800/80 transition"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Step 1: Details */}
          {step === "details" && (
            <form onSubmit={handleStartPayment} className="space-y-4 text-left">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-800 text-emerald-400 text-xs font-medium">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>100% Escrow Protected</span>
                </div>
                <h2 className="text-xl font-bold text-white">
                  Hire {shramik.name || shramik.title}
                </h2>
                <p className="text-xs text-slate-400">
                  Wages are held securely in escrow. Released upon worker check-in and job satisfaction.
                </p>
              </div>

              {/* Worker summary chip */}
              <div className="p-3 rounded-xl bg-slate-850 border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400 block">Trade:</span>
                  <span className="font-semibold text-white">{shramik.title}</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 block">Daily Rate:</span>
                  <span className="font-bold text-amber-400">₹{shramik.price} / day</span>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Number of Days:
                  </label>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 5, 7].map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setDays(d)}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-medium border transition ${
                          days === d
                            ? "bg-slate-800 text-white border-amber-400 font-semibold"
                            : "bg-slate-850 text-slate-400 border-slate-800 hover:text-slate-200"
                        }`}
                      >
                        {d} {d === 1 ? "day" : "days"}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Employer Name:
                  </label>
                  <input
                    type="text"
                    required
                    value={employerName}
                    onChange={(e) => setEmployerName(e.target.value)}
                    placeholder="Enter employer name..."
                    className="w-full p-2.5 bg-slate-800 text-white text-xs rounded-xl border border-slate-700 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Mobile Phone:
                  </label>
                  <input
                    type="tel"
                    required
                    value={employerPhone}
                    onChange={(e) => setEmployerPhone(e.target.value)}
                    placeholder="10-digit mobile number..."
                    className="w-full p-2.5 bg-slate-800 text-white text-xs rounded-xl border border-slate-700 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Work Site Address:
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={siteAddress}
                    onChange={(e) => setSiteAddress(e.target.value)}
                    placeholder="Work site address and nearby landmark..."
                    className="w-full p-2.5 bg-slate-800 text-white text-xs rounded-xl border border-slate-700 focus:outline-none focus:border-amber-400 resize-none"
                  />
                </div>
              </div>

              {/* Total Calculation */}
              <div className="p-3 rounded-xl bg-slate-850 border border-slate-800 space-y-1.5 text-xs text-slate-300">
                <div className="flex justify-between">
                  <span>Wage ({days} {days === 1 ? "day" : "days"} × ₹{shramik.price}):</span>
                  <span className="font-semibold text-white">₹{totalWage}</span>
                </div>
                <div className="flex justify-between text-emerald-400">
                  <span>Platform Fee:</span>
                  <span>₹0 (Free)</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-white pt-1.5 border-t border-slate-800">
                  <span>Total Escrow Deposit:</span>
                  <span className="text-amber-400">₹{totalPayable}</span>
                </div>
              </div>

              {/* Proceed */}
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-sm transition flex items-center justify-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Deposit ₹{totalPayable} into Escrow</span>
              </button>
            </form>
          )}

          {/* Step 2: Confirmed with Check-In OTP */}
          {step === "confirmed" && (
            <div className="space-y-4 text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>

              <div className="space-y-1">
                <h2 className="text-lg font-bold text-white">
                  Escrow Deposit Confirmed
                </h2>
                <p className="text-xs text-slate-400">
                  Funds are secured in escrow. The artisan has received the job notification.
                </p>
              </div>

              {/* OTP Box */}
              <div className="p-4 rounded-xl bg-slate-850 border border-slate-800 text-left space-y-1">
                <span className="text-[11px] font-medium text-slate-400">
                  Site Check-in OTP for Worker:
                </span>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold font-mono tracking-widest text-amber-400">{otpCode}</span>
                  <span className="text-[11px] text-slate-400 max-w-[180px] leading-tight">
                    Share this code with the worker when they arrive at site.
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    alert(
                      `Digital Wage Slip shared!\nEmployer: ${employerName}\nArtisan: ${shramik.name || shramik.title}\nAmount: ₹${totalPayable}\nCheck-in OTP: ${otpCode}`
                    )
                  }
                  className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs flex items-center justify-center gap-1.5 border border-slate-700 transition"
                >
                  <Share2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Share Receipt</span>
                </button>
                <button
                  onClick={handleReset}
                  className="flex-1 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition"
                >
                  View Bookings
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Razorpay Gateway Modal */}
      <RazorpayModal
        isOpen={razorpayOpen}
        onClose={() => setRazorpayOpen(false)}
        amount={totalPayable}
        workerName={shramik.name || shramik.title}
        onSuccess={handlePaymentSuccess}
      />
    </>
  );
}
