"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  Zap,
  Banknote,
  Clock,
  MapPin,
  ArrowUpRight,
  Phone,
  CheckCircle,
} from "lucide-react";
import { useAuthRole } from "@/context/AuthRoleContext";

export default function LabourerDashboard() {
  const {
    userName,
    walletBalance,
    isAvailableToday,
    toggleAvailability,
    activeGigs,
    incomingAlert,
    acceptIncomingAlert,
    declineIncomingAlert,
    verifyCheckInOtp,
    withdrawWalletUpi,
  } = useAuthRole();

  const [otpInputs, setOtpInputs] = useState<{ [gigId: string]: string }>({});
  const [upiWithdrawModal, setUpiWithdrawModal] = useState(false);
  const [upiVpa, setUpiVpa] = useState("9876543210@paytm");
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [otpError, setOtpError] = useState<{ [gigId: string]: string }>({});

  const handleOtpChange = (gigId: string, val: string) => {
    setOtpInputs((prev) => ({ ...prev, [gigId]: val.replace(/[^0-9]/g, "") }));
    setOtpError((prev) => ({ ...prev, [gigId]: "" }));
  };

  const handleVerifyOtp = (gigId: string) => {
    const val = otpInputs[gigId] || "";
    const success = verifyCheckInOtp(gigId, val);
    if (!success) {
      setOtpError((prev) => ({
        ...prev,
        [gigId]: "Invalid OTP. Please ask the employer for the 4-digit site check-in code.",
      }));
    }
  };

  const handleWithdraw = async () => {
    if (!upiVpa) return;
    setIsWithdrawing(true);
    await withdrawWalletUpi(upiVpa);
    setIsWithdrawing(false);
    setUpiWithdrawModal(false);
  };

  return (
    <div className="space-y-6 text-left">
      {/* Top Banner: Standby Toggle */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1.5 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-medium">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Artisan Control Center</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            Welcome, {userName}
          </h2>
          <p className="text-xs text-slate-400 max-w-lg">
            {isAvailableToday
              ? "You are currently online. Nearby employers can dispatch gigs directly to your phone."
              : "You are currently offline. Turn standby ON to receive morning gig offers."}
          </p>
        </div>

        {/* Calm Standby Toggle Button */}
        <div className="shrink-0 flex flex-col items-center md:items-end gap-1.5">
          <button
            onClick={toggleAvailability}
            className={`px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition ${
              isAvailableToday
                ? "bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400"
                : "bg-slate-800 text-slate-300 hover:bg-slate-750 border border-slate-700"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isAvailableToday ? "bg-slate-950" : "bg-slate-500"
              }`}
            />
            <span>{isAvailableToday ? "Standby: Available" : "Standby: Offline"}</span>
          </button>
          <span className="text-[11px] text-slate-400">Peak hours: 7:00 AM – 10:00 AM</span>
        </div>
      </div>

      {/* Calm Incoming Dispatch Alert (No flashing) */}
      {incomingAlert && (
        <div className="p-5 rounded-2xl bg-slate-900 border border-amber-500/40 space-y-3">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center md:text-left">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-400 text-xs font-semibold">
                  New Job Offer
                </span>
                <span className="text-xs text-slate-400">
                  {incomingAlert.secondsRemaining}s to respond
                </span>
              </div>
              <h3 className="text-base font-bold text-white">
                {incomingAlert.jobTitle}
              </h3>
              <p className="text-xs text-slate-400 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>
                  {incomingAlert.locality} ({incomingAlert.distanceKm} km away) • Employer: {incomingAlert.employerName}
                </span>
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <span className="text-xs text-slate-400 block">Wage Offer:</span>
                <span className="text-base font-bold text-emerald-400">₹{incomingAlert.dailyRate} / day</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={acceptIncomingAlert}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition"
                >
                  Accept Job
                </button>
                <button
                  onClick={declineIncomingAlert}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition"
                >
                  Decline
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grid: Wallet & Active Gigs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Wallet & Earnings */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Banknote className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-semibold text-slate-200">Secured Escrow Wallet</h3>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-medium">
                Protected
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-3xl font-bold text-white">₹{walletBalance}</span>
              <p className="text-xs text-slate-400">
                Credited directly from escrow to your wallet upon site completion.
              </p>
            </div>

            {/* Payout CTA */}
            <button
              onClick={() => setUpiWithdrawModal(true)}
              disabled={walletBalance <= 0}
              className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-slate-950 font-bold text-xs transition flex items-center justify-center gap-1.5"
            >
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>Instant UPI Payout</span>
            </button>
          </div>

          {/* Micro-Insurance Status */}
          <div className="p-3.5 rounded-xl bg-slate-850 border border-slate-800 space-y-1 text-xs">
            <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Accidental Workplace Insurance: Active</span>
            </div>
            <p className="text-[11px] text-slate-400">
              ₹2,00,000 coverage on active gigs authorized under PM Suraksha Bima.
            </p>
          </div>
        </div>

        {/* Right 2 cols: Active Gigs & Site Check-in */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs font-semibold text-slate-200">Active Bookings</h3>
            </div>
            <span className="text-xs text-slate-400">{activeGigs.length} assigned</span>
          </div>

          <div className="space-y-3">
            {activeGigs.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                No active gigs at this moment. Keep Standby ON to receive dispatches.
              </div>
            ) : (
              activeGigs.map((gig) => (
                <div
                  key={gig.id}
                  className="p-4 rounded-xl bg-slate-850 border border-slate-800 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-semibold text-white">{gig.jobTitle}</h4>
                      <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-amber-400" />
                        <span>{gig.siteAddress}</span>
                      </p>
                    </div>
                    <div className="text-left sm:text-right">
                      <span className="text-sm font-bold text-amber-400">
                        ₹{gig.totalWage}
                      </span>
                      <span className="text-[11px] text-emerald-400 block font-medium">
                        ✓ In Escrow
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400">Employer:</span>
                      <span className="font-medium text-white">{gig.employerName}</span>
                      <a
                        href={`tel:${gig.employerPhone}`}
                        className="p-1 rounded bg-slate-800 text-emerald-400 hover:bg-slate-700"
                      >
                        <Phone className="w-3 h-3" />
                      </a>
                    </div>

                    {/* Status Indicator */}
                    <div>
                      {gig.status === "funds_held" && (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            maxLength={4}
                            value={otpInputs[gig.id] || ""}
                            onChange={(e) => handleOtpChange(gig.id, e.target.value)}
                            placeholder="4-digit OTP"
                            className="w-24 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-xs text-center text-white"
                          />
                          <button
                            onClick={() => handleVerifyOtp(gig.id)}
                            className="px-3 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs"
                          >
                            Verify Check-in
                          </button>
                        </div>
                      )}

                      {gig.status === "checked_in" && (
                        <span className="px-2.5 py-0.5 rounded-full bg-blue-500/15 text-blue-300 font-medium text-xs flex items-center gap-1">
                          <CheckCircle className="w-3 h-3 text-blue-400" />
                          <span>Work in Progress</span>
                        </span>
                      )}

                      {gig.status === "completed" && (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 font-medium text-xs flex items-center gap-1">
                          <CheckCircle className="w-3 h-3 text-emerald-400" />
                          <span>Completed • Wage Disbursed</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {otpError[gig.id] && (
                    <p className="text-xs text-rose-400 pt-1">{otpError[gig.id]}</p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* UPI Withdrawal Modal */}
      {upiWithdrawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-sm p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 text-left">
            <h3 className="text-base font-bold text-white">Instant UPI Payout</h3>
            <p className="text-xs text-slate-400">
              Transfer your secured wage earnings directly to your UPI ID or linked bank account.
            </p>

            <div className="space-y-1">
              <label className="text-xs text-slate-300 font-medium">Your UPI ID (VPA):</label>
              <input
                type="text"
                value={upiVpa}
                onChange={(e) => setUpiVpa(e.target.value)}
                placeholder="e.g. 9876543210@paytm"
                className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={handleWithdraw}
                disabled={isWithdrawing}
                className="flex-1 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs"
              >
                {isWithdrawing ? "Processing..." : `Transfer ₹${walletBalance}`}
              </button>
              <button
                onClick={() => setUpiWithdrawModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
