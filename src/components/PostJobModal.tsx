"use client";

import React, { useState } from "react";
import { X, PlusCircle, CheckCircle2 } from "lucide-react";
import confetti from "canvas-confetti";
import { TRADE_CATEGORIES } from "@/lib/mockData";

interface PostJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJobPosted?: (job: Record<string, unknown>) => void;
}

export default function PostJobModal({
  isOpen,
  onClose,
  onJobPosted,
}: PostJobModalProps) {
  const [title, setTitle] = useState("");
  const [tradeCategory, setTradeCategory] = useState("mason");
  const [workersNeeded, setWorkersNeeded] = useState(2);
  const [wageOffered, setWageOffered] = useState(800);
  const [siteAddress, setSiteAddress] = useState("");
  const [employerPhone, setEmployerPhone] = useState("+91 98765 43210");
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !siteAddress || !employerPhone) {
      alert("Please fill in all required job fields.");
      return;
    }

    const newJob = {
      id: "job-" + Date.now(),
      title,
      tradeCategory,
      workersNeeded,
      wageOffered,
      siteAddress,
      employerPhone,
      status: "broadcasted",
      createdAt: new Date().toISOString(),
    };

    setIsSuccess(true);
    confetti({ particleCount: 50, spread: 60 });
    if (onJobPosted) onJobPosted(newJob);

    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1500);
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

        <div className="text-left space-y-1">
          <h2 className="text-xl font-bold text-white">
            Post a Requirement
          </h2>
          <p className="text-xs text-slate-400">
            Nearby verified artisans within your radius will receive instant alerts.
          </p>
        </div>

        {!isSuccess ? (
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Requirement Title:
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Need 2 Masons for brickwork and plastering"
                className="w-full p-2.5 bg-slate-800 text-white text-xs sm:text-sm rounded-xl border border-slate-700 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Trade:
                </label>
                <select
                  value={tradeCategory}
                  onChange={(e) => setTradeCategory(e.target.value)}
                  className="w-full p-2.5 bg-slate-800 text-slate-200 text-xs rounded-xl border border-slate-700 focus:outline-none focus:border-amber-400 cursor-pointer"
                >
                  {TRADE_CATEGORIES.filter((c) => c.id !== "all").map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Workers Needed:
                </label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={workersNeeded}
                  onChange={(e) => setWorkersNeeded(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-800 text-white text-xs rounded-xl border border-slate-700 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Offered Wage (₹/day):
                </label>
                <input
                  type="number"
                  step={50}
                  value={wageOffered}
                  onChange={(e) => setWageOffered(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-800 text-white text-xs rounded-xl border border-slate-700 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Employer Mobile:
                </label>
                <input
                  type="tel"
                  required
                  value={employerPhone}
                  onChange={(e) => setEmployerPhone(e.target.value)}
                  placeholder="10-digit mobile"
                  className="w-full p-2.5 bg-slate-800 text-white text-xs rounded-xl border border-slate-700 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Work Site Address &amp; Landmark:
              </label>
              <textarea
                required
                rows={2}
                value={siteAddress}
                onChange={(e) => setSiteAddress(e.target.value)}
                placeholder="e.g. 14th Main, Sector 4, HSR Layout, Bengaluru"
                className="w-full p-2.5 bg-slate-800 text-white text-xs rounded-xl border border-slate-700 focus:outline-none focus:border-amber-400 resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition"
            >
              Broadcast Requirement
            </button>
          </form>
        ) : (
          <div className="p-4 rounded-xl bg-slate-850 border border-emerald-500/30 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <h3 className="text-sm font-bold text-white">Broadcast Active</h3>
            <p className="text-xs text-slate-400">
              Your requirement has been dispatched to available local workers.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
