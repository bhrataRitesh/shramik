"use client";

import React from "react";
import Image from "next/image";
import {
  Star,
  ShieldCheck,
  MapPin,
  Phone,
  Briefcase,
  MessageCircle,
} from "lucide-react";
import { ShramikData } from "@/lib/mockData";

interface WorkerCardProps {
  shramik: ShramikData;
  onBookEscrow: (shramik: ShramikData) => void;
  onOpenEShramModal: () => void;
}

export default function WorkerCard({
  shramik,
  onBookEscrow,
  onOpenEShramModal,
}: WorkerCardProps) {
  const displayImage =
    shramik.image && shramik.image.length > 0
      ? shramik.image[0].url
      : "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80";

  return (
    <div className="bg-slate-900/80 rounded-2xl border border-slate-800/80 hover:border-slate-700 hover:shadow-lg transition-all flex flex-col justify-between overflow-hidden text-left group">
      {/* Calm Photo Area */}
      <div className="relative">
        <div className="relative h-44 w-full overflow-hidden bg-slate-950">
          <Image
            src={displayImage}
            alt={shramik.name || shramik.title}
            fill
            className="object-cover group-hover:scale-102 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent" />

          {/* Discreet Verification Pill */}
          {shramik.eShramVerified && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenEShramModal();
              }}
              className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950/85 backdrop-blur-md text-emerald-400 text-xs font-medium border border-emerald-500/25 hover:bg-slate-900 transition"
              title="Verified on India e-Shram Portal"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>e-Shram Verified</span>
            </button>
          )}

          {/* Availability Pill */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950/85 backdrop-blur-md text-xs font-medium text-slate-300 border border-slate-800">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Available</span>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3.5">
        <div className="space-y-2">
          {/* Worker Name & Trade */}
          <div>
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-base font-semibold text-white group-hover:text-amber-400 transition-colors line-clamp-1">
                {shramik.name || shramik.title}
              </h3>
              <div className="flex items-center gap-1 text-xs font-semibold text-amber-400 shrink-0">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{shramik.rating || 4.9}</span>
                <span className="text-slate-400 text-[11px] font-normal">
                  ({shramik.completedJobs || 18})
                </span>
              </div>
            </div>

            <p className="text-xs font-medium text-slate-400 flex items-center gap-1.5 mt-0.5">
              <span>{shramik.title}</span>
              <span>•</span>
              <span>{shramik.experienceYears} yrs experience</span>
            </p>
          </div>

          {/* Location */}
          <div className="flex items-center gap-1 text-xs text-slate-400">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">
              {shramik.locality || shramik.city}
              {shramik.distanceKm ? ` (${shramik.distanceKm} km away)` : ""}
            </span>
          </div>

          {/* Clean Muted Skill Chips */}
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {shramik.skills &&
              shramik.skills.slice(0, 3).map((skill, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md bg-slate-800 text-[11px] text-slate-300"
                >
                  {skill}
                </span>
              ))}
          </div>
        </div>

        {/* Pricing & Simple Actions */}
        <div className="pt-3 border-t border-slate-800/80 space-y-3">
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-[11px] text-slate-400 block">Daily Wage</span>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-bold text-white">₹{shramik.price || shramik.dailyWageRate}</span>
                <span className="text-xs text-slate-400">/ day</span>
              </div>
            </div>
            <span className="text-[11px] text-slate-400 flex items-center gap-1 bg-slate-800/50 px-2 py-1 rounded-md">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>Escrow Protected</span>
            </span>
          </div>

          {/* Two Clean Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <a
              href={`tel:${shramik.phone}`}
              className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-medium border border-slate-700/60 transition"
              title="Call directly"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>Call</span>
            </a>

            <button
              onClick={() => onBookEscrow(shramik)}
              className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-semibold shadow-sm transition"
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Book Escrow</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
