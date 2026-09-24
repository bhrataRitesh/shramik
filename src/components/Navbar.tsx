"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  PlusCircle,
  Menu,
  X,
  User,
  LogOut,
  Briefcase,
  HardHat,
  Smartphone,
  Mic,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useAuthRole } from "@/context/AuthRoleContext";

interface NavbarProps {
  onOpenVoiceModal: () => void;
  onOpenPostJobModal: () => void;
  onOpenEShramModal: () => void;
}

export default function Navbar({
  onOpenVoiceModal,
  onOpenPostJobModal,
  onOpenEShramModal,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useLanguage();
  const {
    role,
    toggleRole,
    isLoggedIn,
    userName,
    setOpenAuthModal,
    logout,
  } = useAuthRole();

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/90 backdrop-blur-md border-b border-slate-800/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-lg group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
                S
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xl font-bold tracking-tight text-white">
                  Shramik<span className="text-amber-500">.</span>
                </span>
                <span className="text-[11px] text-slate-400 -mt-1 hidden sm:inline">
                  Verified Local Artisans
                </span>
              </div>
            </Link>
          </div>

          {/* Calm Mode Switcher (Hirer vs Artisan) */}
          <div className="hidden md:flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800">
            <button
              onClick={() => role !== "hirer" && toggleRole()}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
                role === "hirer"
                  ? "bg-slate-800 text-white font-semibold shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Briefcase className="w-3.5 h-3.5 text-amber-400" />
              <span>Hire Workers</span>
            </button>
            <button
              onClick={() => role !== "labourer" && toggleRole()}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
                role === "labourer"
                  ? "bg-slate-800 text-white font-semibold shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <HardHat className="w-3.5 h-3.5 text-emerald-400" />
              <span>Artisan Mode</span>
            </button>
          </div>

          {/* Right Action Controls */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={onOpenVoiceModal}
              title="Voice Profile Assistant"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-900 transition"
            >
              <Mic className="w-3.5 h-3.5 text-amber-400" />
              <span>Voice AI</span>
            </button>

            <button
              onClick={onOpenEShramModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-900 transition"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>e-Shram Verify</span>
            </button>

            {role === "hirer" && (
              <button
                onClick={onOpenPostJobModal}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-xs font-semibold transition"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Post Job</span>
              </button>
            )}

            {isLoggedIn ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
                <span className="text-xs font-medium text-slate-300 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900">
                  <User className="w-3 h-3 text-amber-400" />
                  {userName}
                </span>
                <button
                  onClick={logout}
                  className="p-1.5 text-slate-400 hover:text-rose-400 transition"
                  title="Logout"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setOpenAuthModal(true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs border border-slate-800 transition"
              >
                <Smartphone className="w-3.5 h-3.5 text-amber-400" />
                <span>Sign In</span>
              </button>
            )}
          </div>

          {/* Mobile Hamburger */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={onOpenVoiceModal}
              className="p-2 rounded-lg text-amber-400 hover:bg-slate-900"
            >
              <Mic className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-300 hover:bg-slate-900"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="sm:hidden py-4 border-t border-slate-800 space-y-3 text-left">
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-900 rounded-xl">
              <button
                onClick={() => {
                  if (role !== "hirer") toggleRole();
                  setMobileMenuOpen(false);
                }}
                className={`py-2 text-xs font-medium rounded-lg text-center ${
                  role === "hirer" ? "bg-slate-800 text-white" : "text-slate-400"
                }`}
              >
                Hire Workers
              </button>
              <button
                onClick={() => {
                  if (role !== "labourer") toggleRole();
                  setMobileMenuOpen(false);
                }}
                className={`py-2 text-xs font-medium rounded-lg text-center ${
                  role === "labourer" ? "bg-slate-800 text-white" : "text-slate-400"
                }`}
              >
                Artisan Mode
              </button>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenVoiceModal();
                }}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-slate-300 hover:bg-slate-900 text-left"
              >
                <Mic className="w-4 h-4 text-amber-400" />
                <span>Voice Profile Generator</span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenEShramModal();
                }}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-slate-300 hover:bg-slate-900 text-left"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Verify e-Shram Card</span>
              </button>

              {role === "hirer" && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenPostJobModal();
                  }}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-amber-300 bg-amber-500/10 text-left"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Post a Job Requirement</span>
                </button>
              )}

              {isLoggedIn ? (
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-rose-400 hover:bg-slate-900 text-left"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out ({userName})</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    setOpenAuthModal(true);
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-white bg-slate-900 text-left font-medium"
                >
                  <Smartphone className="w-4 h-4 text-amber-400" />
                  <span>Sign In with Phone</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
