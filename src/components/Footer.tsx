"use client";

import React from "react";
import Link from "next/link";
import { PhoneCall, ExternalLink } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 text-slate-400 text-xs text-left">
      {/* Subtle Support & Helpline Bar */}
      <div className="border-b border-slate-800/60 bg-slate-900/40 py-3">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div className="flex items-center gap-2 text-slate-300 font-medium">
            <PhoneCall className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>National Labour Helpline: 14434 (Toll-Free)</span>
          </div>
          <a
            href="https://eshram.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-slate-400 hover:text-emerald-400 transition"
          >
            <span>Official e-Shram Portal</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-sm">
                S
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                Shramik<span className="text-amber-500">.</span>
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed text-xs">
              Direct, transparent connection between homeowners, contractors, and local skilled artisans. Zero middleman deductions.
            </p>
          </div>

          {/* Popular Trades */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200">Trades</h4>
            <ul className="space-y-1.5 text-slate-400 text-xs">
              <li><Link href="/#chowk" className="hover:text-amber-400 transition">Masons &amp; Tile Fitters</Link></li>
              <li><Link href="/#chowk" className="hover:text-amber-400 transition">Electricians &amp; Wiremen</Link></li>
              <li><Link href="/#chowk" className="hover:text-amber-400 transition">Carpenters &amp; Woodwork</Link></li>
              <li><Link href="/#chowk" className="hover:text-amber-400 transition">Painters &amp; Polishers</Link></li>
              <li><Link href="/#chowk" className="hover:text-amber-400 transition">Plumbers &amp; Sanitary</Link></li>
            </ul>
          </div>

          {/* Welfare Schemes */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200">Worker Welfare</h4>
            <ul className="space-y-1.5 text-slate-400 text-xs">
              <li>
                <a href="https://eshram.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition inline-flex items-center gap-1">
                  e-Shram Registration <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </li>
              <li>
                <a href="https://www.myscheme.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition inline-flex items-center gap-1">
                  PM Suraksha Bima (PMSBY) <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </li>
              <li>
                <a href="https://www.myscheme.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition inline-flex items-center gap-1">
                  PM Shram Yogi Maandhan <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </li>
            </ul>
          </div>

          {/* Trust & Peace of Mind */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200">Trust &amp; Escrow</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Wages stay held securely until site check-in and job satisfaction. Transparent dispute protection for both parties.
            </p>
            <div className="pt-1">
              <a href="mailto:support@shramik.org" className="text-slate-300 hover:text-amber-400 font-medium transition text-xs">
                support@shramik.org
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 mt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} Shramik. All rights reserved.</p>
          <p className="text-slate-400">Secure Escrow • Direct Contact • Zero Middlemen</p>
        </div>
      </div>
    </footer>
  );
}
