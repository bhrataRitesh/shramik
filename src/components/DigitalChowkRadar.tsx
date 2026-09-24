"use client";

import React, { useState } from "react";
import {
  LayoutGrid,
  MapPin,
  Search,
  Check,
} from "lucide-react";
import WorkerCard from "@/components/WorkerCard";
import { TRADE_CATEGORIES, ShramikData } from "@/lib/mockData";

interface DigitalChowkRadarProps {
  shramiks: ShramikData[];
  selectedCategory: string;
  onSelectCategory: (catId: string) => void;
  availableOnly: boolean;
  onToggleAvailableOnly: () => void;
  onBookEscrow: (shramik: ShramikData) => void;
  onOpenEShramModal: () => void;
  onOpenVoiceModal: () => void;
}

export default function DigitalChowkRadar({
  shramiks,
  selectedCategory,
  onSelectCategory,
  availableOnly,
  onToggleAvailableOnly,
  onBookEscrow,
  onOpenEShramModal,
  onOpenVoiceModal,
}: DigitalChowkRadarProps) {
  const [viewMode, setViewMode] = useState<"grid" | "radar">("grid");
  const [activeRadarWorker, setActiveRadarWorker] = useState<ShramikData | null>(null);

  return (
    <section id="chowk" className="py-10 sm:py-14 max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
      {/* Calm Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-left">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Available Artisans
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Browse verified local tradesmen and construction crews ready for work.
          </p>
        </div>

        {/* Calm View Switcher & Availability Filter */}
        <div className="flex items-center gap-2">
          {/* Available Today Filter */}
          <button
            onClick={onToggleAvailableOnly}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium border transition ${
              availableOnly
                ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30 font-semibold"
                : "bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                availableOnly ? "bg-emerald-400" : "bg-slate-500"
              }`}
            />
            <span>Available Today</span>
          </button>

          {/* Grid vs Map Toggle */}
          <div className="p-1 rounded-xl bg-slate-900 border border-slate-800 flex items-center">
            <button
              onClick={() => setViewMode("grid")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition ${
                viewMode === "grid"
                  ? "bg-slate-800 text-white font-semibold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Grid</span>
            </button>
            <button
              onClick={() => setViewMode("radar")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition ${
                viewMode === "radar"
                  ? "bg-slate-800 text-white font-semibold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Radar Map</span>
            </button>
          </div>
        </div>
      </div>

      {/* Trade Category Tabs - Clean, Uncluttered Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {TRADE_CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors shrink-0 ${
                isActive
                  ? "bg-amber-500 text-slate-950 font-bold"
                  : "bg-slate-900 text-slate-400 hover:bg-slate-850 hover:text-slate-200 border border-slate-800/80"
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* VIEW 1: Grid Cards */}
      {viewMode === "grid" && (
        <div>
          {shramiks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {shramiks.map((worker) => (
                <WorkerCard
                  key={worker._id}
                  shramik={worker}
                  onBookEscrow={onBookEscrow}
                  onOpenEShramModal={onOpenEShramModal}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 px-4 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                <Search className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white">No artisans match your criteria</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Try broadening your trade filter, increasing search radius, or speak your requirement with Voice AI.
              </p>
              <button
                onClick={onOpenVoiceModal}
                className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-semibold text-xs transition"
              >
                Speak Requirement
              </button>
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: Proximity Radar Simulation Map */}
      {viewMode === "radar" && (
        <div className="bg-slate-900/70 p-6 rounded-2xl border border-slate-800 relative overflow-hidden space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 text-left">
            <div>
              <h3 className="text-sm font-semibold text-white">
                Proximity Radar View
              </h3>
              <p className="text-xs text-slate-400">
                Live location of active workers around your area
              </p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 font-medium">
              {shramiks.length} active nearby
            </span>
          </div>

          {/* Calm Radar Visual Map */}
          <div className="relative w-full h-[360px] sm:h-[400px] rounded-xl bg-slate-950 border border-slate-800/80 overflow-hidden flex items-center justify-center">
            {/* Soft Concentric Distance Rings */}
            <div className="absolute w-[120px] h-[120px] rounded-full border border-slate-800" />
            <div className="absolute w-[220px] h-[220px] rounded-full border border-slate-800/80" />
            <div className="absolute w-[320px] h-[320px] rounded-full border border-slate-800/60" />

            {/* User Center Pin */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-md ring-4 ring-blue-500/20">
                <MapPin className="w-3 h-3" />
              </div>
              <span className="mt-1 text-[10px] font-semibold text-blue-400 bg-slate-900/90 px-2 py-0.5 rounded-full border border-slate-800">
                You
              </span>
            </div>

            {/* Worker Pin Dots Distributed Around Center */}
            {shramiks.slice(0, 8).map((worker, index) => {
              const angle = (index * (360 / Math.min(shramiks.length, 8)) * Math.PI) / 180;
              const radius = 60 + (index % 3) * 50;
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;

              const isSelected = activeRadarWorker?._id === worker._id;

              return (
                <div
                  key={worker._id}
                  style={{
                    transform: `translate(${x}px, ${y}px)`,
                  }}
                  onClick={() => setActiveRadarWorker(worker)}
                  className={`absolute z-20 cursor-pointer group transition-transform ${
                    isSelected ? "scale-115 z-30" : "hover:scale-110"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow-md transition ${
                      isSelected
                        ? "bg-amber-500 text-slate-950 ring-4 ring-amber-500/30"
                        : "bg-slate-900 text-amber-400 border border-slate-700 hover:border-amber-400"
                    }`}
                  >
                    {(worker.name || worker.title || "W")[0].toUpperCase()}
                  </div>

                  {/* Tooltip */}
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-slate-950/90 text-white text-[10px] font-medium border border-slate-800 whitespace-nowrap shadow-md opacity-80 group-hover:opacity-100 transition">
                    ₹{worker.price}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Active Worker Preview Card */}
          {activeRadarWorker && (
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-base">
                  {(activeRadarWorker.name || activeRadarWorker.title || "S")[0].toUpperCase()}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">{activeRadarWorker.name || activeRadarWorker.title}</h4>
                  <p className="text-xs text-slate-400">
                    {activeRadarWorker.title} • {activeRadarWorker.locality}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <span className="text-sm font-bold text-white">₹{activeRadarWorker.price} / day</span>
                <button
                  onClick={() => onBookEscrow(activeRadarWorker)}
                  className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs"
                >
                  Book Escrow
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
