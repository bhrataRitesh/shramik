"use client";

import React from "react";
import {
  Search,
  Mic,
  MapPin,
  ShieldCheck,
  Lock,
  PhoneCall,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface HeroSectionProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  radiusKm: number;
  onRadiusChange: (r: number) => void;
  onOpenVoiceModal: () => void;
  onOpenPostJobModal: () => void;
  totalWorkers: number;
  onSelectQuickTrade?: (trade: string) => void;
}

export default function HeroSection({
  searchQuery,
  onSearchChange,
  radiusKm,
  onRadiusChange,
  onOpenVoiceModal,
  totalWorkers,
  onSelectQuickTrade,
}: HeroSectionProps) {
  const { t } = useLanguage();

  const QUICK_TRADES = [
    { label: "Masons", id: "mason" },
    { label: "Electricians", id: "electrician" },
    { label: "Carpenters", id: "carpenter" },
    { label: "Painters", id: "painter" },
    { label: "Plumbers", id: "plumber" },
  ];

  return (
    <section className="relative pt-12 pb-16 sm:pt-20 sm:pb-24 border-b border-slate-800/60 bg-gradient-to-b from-slate-950 via-slate-900/40 to-slate-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-8">
        {/* Subtle, calm title & subtitle */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>{totalWorkers} Verified Artisans Available Today</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Find trusted local artisans,{" "}
            <span className="text-amber-400 font-black">effortlessly.</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Connect directly with verified masons, electricians, carpenters, and painters. 
            Protected by secure escrow wage payments and verified government credentials.
          </p>
        </div>

        {/* Clean, Unified Search Box */}
        <div className="max-w-2xl mx-auto">
          <div className="p-2 sm:p-2.5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col sm:flex-row items-center gap-2">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search by trade or skill (e.g. Mason, Electrician)..."
                className="w-full pl-10 pr-4 py-2.5 bg-transparent text-white placeholder-slate-400 text-sm focus:outline-none"
              />
            </div>

            {/* Radius Selector */}
            <div className="flex items-center gap-1.5 w-full sm:w-auto px-2 sm:px-0">
              <div className="relative w-full sm:w-auto">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-amber-400" />
                <select
                  value={radiusKm}
                  onChange={(e) => onRadiusChange(Number(e.target.value))}
                  className="w-full sm:w-auto pl-8 pr-6 py-2 bg-slate-800/90 text-slate-200 text-xs font-medium rounded-xl border border-slate-700/60 focus:outline-none focus:border-amber-400 transition cursor-pointer appearance-none"
                >
                  <option value={3}>Within 3 km</option>
                  <option value={5}>Within 5 km</option>
                  <option value={10}>Within 10 km</option>
                  <option value={25}>Within 25 km</option>
                </select>
              </div>

              {/* Voice Search Button */}
              <button
                onClick={onOpenVoiceModal}
                title="Speak to Search (Voice Assistant)"
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700/60 transition active:scale-95 flex items-center justify-center shrink-0"
              >
                <Mic className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Trade Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
            <span className="text-xs text-slate-400 font-medium mr-1">Popular:</span>
            {QUICK_TRADES.map((trade) => (
              <button
                key={trade.id}
                onClick={() => {
                  if (onSelectQuickTrade) onSelectQuickTrade(trade.id);
                  onSearchChange(trade.label);
                }}
                className="px-3 py-1 rounded-full bg-slate-900/80 hover:bg-slate-800 text-xs font-medium text-slate-300 border border-slate-800/80 hover:text-white transition"
              >
                {trade.label}
              </button>
            ))}
          </div>
        </div>

        {/* Calm Value Reassurances */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>Escrow Wage Guarantee</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>e-Shram Verified Profiles</span>
          </div>
          <div className="flex items-center gap-2">
            <PhoneCall className="w-3.5 h-3.5 text-blue-400" />
            <span>Direct Call &amp; WhatsApp</span>
          </div>
        </div>
      </div>
    </section>
  );
}
