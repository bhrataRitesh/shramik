"use client";

import React, { useState } from "react";
import {
  MapPin,
  Phone,
  Lock,
  CheckCircle,
} from "lucide-react";
import { useAuthRole } from "@/context/AuthRoleContext";

export default function HirerDashboard() {
  const { activeGigs, releaseEscrowPayout } = useAuthRole();

  const [ratingModalGigId, setRatingModalGigId] = useState<string | null>(null);
  const [ratingValue, setRatingValue] = useState(5);
  const [ratingSubmitted, setRatingSubmitted] = useState<{ [gigId: string]: boolean }>({});

  const handleRelease = (gigId: string) => {
    releaseEscrowPayout(gigId);
    setRatingModalGigId(gigId);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (ratingModalGigId) {
      setRatingSubmitted((prev) => ({ ...prev, [ratingModalGigId]: true }));
      setRatingModalGigId(null);
    }
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-medium mb-1">
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>Employer Management</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            Your Bookings
          </h2>
          <p className="text-xs text-slate-400">
            Escrow-protected bookings, arrival check-in verification, and completion sign-offs.
          </p>
        </div>
        <span className="text-xs px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
          Total Bookings: <strong className="text-white">{activeGigs.length}</strong>
        </span>
      </div>

      <div className="space-y-4">
        {activeGigs.length === 0 ? (
          <div className="text-center py-12 p-6 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-2">
            <h3 className="text-base font-semibold text-white">No active bookings yet</h3>
            <p className="text-xs text-slate-400">
              Browse available local artisans to book with 100% Escrow Protection.
            </p>
          </div>
        ) : (
          activeGigs.map((gig) => (
            <div
              key={gig.id}
              className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                <div>
                  <h3 className="text-sm font-semibold text-white">{gig.jobTitle}</h3>
                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    <span>{gig.siteAddress}</span>
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <span className="text-base font-bold text-amber-400">₹{gig.totalWage}</span>
                  <span className="text-[11px] text-emerald-400 block font-medium">
                    ✓ Held in Razorpay Escrow
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="space-y-1">
                  <span className="text-slate-400 block">Artisan:</span>
                  <span className="font-semibold text-white text-sm">{gig.workerName}</span>
                  <div>
                    <a
                      href={`tel:${gig.workerPhone}`}
                      className="inline-flex items-center gap-1 text-[11px] text-emerald-400 hover:underline"
                    >
                      <Phone className="w-3 h-3" /> {gig.workerPhone}
                    </a>
                  </div>
                </div>

                {/* Check-in OTP for arrival */}
                <div className="p-3 rounded-xl bg-slate-850 border border-slate-800 space-y-1">
                  <span className="text-[11px] text-slate-400 block font-medium">
                    Worker Check-in OTP:
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold font-mono tracking-widest text-amber-400">
                      {gig.checkInOtp}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      (Share upon worker arrival)
                    </span>
                  </div>
                </div>

                {/* Status & Escrow Release */}
                <div className="flex flex-col justify-center space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Status:</span>
                    {gig.status === "funds_held" && (
                      <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 font-medium">
                        Awaiting Arrival
                      </span>
                    )}
                    {gig.status === "checked_in" && (
                      <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 font-medium">
                        Work in Progress
                      </span>
                    )}
                    {gig.status === "completed" && (
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-medium">
                        Completed
                      </span>
                    )}
                  </div>

                  {gig.status !== "completed" ? (
                    <button
                      onClick={() => handleRelease(gig.id)}
                      className="w-full py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition"
                    >
                      Work Complete • Release Escrow
                    </button>
                  ) : (
                    <div className="flex items-center justify-center gap-1 text-emerald-400 text-xs font-medium py-1">
                      <CheckCircle className="w-4 h-4" />
                      <span>Wages Disbursed to Worker</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Review Modal */}
      {ratingModalGigId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-sm p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 text-left">
            <h3 className="text-base font-bold text-white">Rate &amp; Review Artisan</h3>
            <p className="text-xs text-slate-400">
              Escrow payment released. How was the quality of work performed today?
            </p>

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div className="flex justify-center gap-2 py-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRatingValue(star)}
                    className={`text-2xl transition ${
                      star <= ratingValue ? "text-amber-400" : "text-slate-600"
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
                >
                  Submit Review
                </button>
                <button
                  type="button"
                  onClick={() => setRatingModalGigId(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
                >
                  Skip
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
