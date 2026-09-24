"use client";

import React, { useState, useEffect, useMemo } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import DigitalChowkRadar from "@/components/DigitalChowkRadar";
import LabourerDashboard from "@/components/LabourerDashboard";
import HirerDashboard from "@/components/HirerDashboard";
import VoiceAssistantModal from "@/components/VoiceAssistantModal";
import EscrowBookingModal from "@/components/EscrowBookingModal";
import EShramBadgeModal from "@/components/EShramBadgeModal";
import PostJobModal from "@/components/PostJobModal";
import PhoneAuthModal from "@/components/PhoneAuthModal";
import Footer from "@/components/Footer";
import { MOCK_SHRAMIKS, ShramikData } from "@/lib/mockData";
import { useAuthRole } from "@/context/AuthRoleContext";
import { useLanguage } from "@/context/LanguageContext";
import {
  Briefcase,
  HardHat,
  ArrowRight,
} from "lucide-react";

export default function HomePage() {
  const { role, setRole } = useAuthRole();
  const { t } = useLanguage();

  const [shramiks, setShramiks] = useState<ShramikData[]>(MOCK_SHRAMIKS);
  const [searchQuery, setSearchQuery] = useState("");
  const [radiusKm, setRadiusKm] = useState(5);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [availableOnly, setAvailableOnly] = useState(false);

  // Active view tab for Hirer mode: "chowk" vs "bookings"
  const [hirerActiveTab, setHirerActiveTab] = useState<"chowk" | "bookings">("chowk");

  // Modals state
  const [voiceModalOpen, setVoiceModalOpen] = useState(false);
  const [eShramModalOpen, setEShramModalOpen] = useState(false);
  const [postJobModalOpen, setPostJobModalOpen] = useState(false);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedWorkerForEscrow, setSelectedWorkerForEscrow] = useState<ShramikData | null>(null);

  // Fetch from API on initial load
  useEffect(() => {
    async function loadShramiks() {
      try {
        const res = await fetch("/api/shramiks");
        const json = await res.json();
        if (json.success && json.data && json.data.length > 0) {
          setShramiks(json.data);
        }
      } catch (err) {
        console.warn("Using offline mock data:", err);
      }
    }
    loadShramiks();
  }, []);

  // Filtered workers
  const filteredShramiks = useMemo(() => {
    return shramiks.filter((worker) => {
      if (selectedCategory !== "all") {
        if (worker.tradeCategory.toLowerCase() !== selectedCategory.toLowerCase()) {
          return false;
        }
      }

      if (availableOnly && !worker.isAvailableToday) {
        return false;
      }

      if (searchQuery.trim().length > 0) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = worker.title?.toLowerCase().includes(q);
        const matchesName = worker.name?.toLowerCase().includes(q);
        const matchesDesc = worker.description?.toLowerCase().includes(q);
        const matchesSkill = worker.skills?.some((s) => s.toLowerCase().includes(q));
        const matchesLocality = worker.locality?.toLowerCase().includes(q);

        if (!matchesTitle && !matchesName && !matchesDesc && !matchesSkill && !matchesLocality) {
          return false;
        }
      }

      if (worker.distanceKm && worker.distanceKm > radiusKm) {
        return false;
      }

      return true;
    });
  }, [shramiks, selectedCategory, availableOnly, searchQuery, radiusKm]);

  const handleOpenBooking = (worker: ShramikData) => {
    setSelectedWorkerForEscrow(worker);
    setBookingModalOpen(true);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleProfileCreated = (parsed: any) => {
    const newWorker: ShramikData = {
      _id: "shramik-" + Date.now(),
      title: parsed.suggestedTitle,
      name: "Voice Verified Artisan",
      tradeCategory: parsed.tradeCategory,
      skills: parsed.skills || ["General Labor"],
      phone: "+91 98000 00000",
      image: [
        {
          url: "https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=600&q=80",
          filename: "new_worker",
        },
      ],
      price: parsed.dailyWageRate,
      dailyWageRate: parsed.dailyWageRate,
      hourlyRate: Math.round(parsed.dailyWageRate / 8),
      experienceYears: parsed.experienceYears,
      description: parsed.summary,
      location: { type: "Point", coordinates: [77.5946, 12.9716] },
      city: "Bengaluru",
      locality: "Indiranagar, Sector 1 (1.2 km away)",
      address: "Nearby Site",
      distanceKm: 1.2,
      isAvailableToday: true,
      eShramVerified: true,
      aadhaarVerified: true,
      skillCertified: true,
      tier: "verified",
      rating: 5.0,
      totalReviews: 1,
      completedJobs: 1,
      crewSize: 1,
    };

    setShramiks((prev) => [newWorker, ...prev]);
    setSelectedCategory(parsed.tradeCategory);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-amber-500 selection:text-slate-950">
      {/* Navigation */}
      <Navbar
        onOpenVoiceModal={() => setVoiceModalOpen(true)}
        onOpenPostJobModal={() => setPostJobModalOpen(true)}
        onOpenEShramModal={() => setEShramModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* PERSPECTIVE 1: LABOURER (WORKER) MODE */}
        {role === "labourer" ? (
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
            <LabourerDashboard />
          </div>
        ) : (
          /* PERSPECTIVE 2: HIRER (EMPLOYER) MODE */
          <div>
            {/* Hero Section */}
            <HeroSection
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              radiusKm={radiusKm}
              onRadiusChange={setRadiusKm}
              onOpenVoiceModal={() => setVoiceModalOpen(true)}
              onOpenPostJobModal={() => setPostJobModalOpen(true)}
              totalWorkers={filteredShramiks.length}
              onSelectQuickTrade={(cat) => setSelectedCategory(cat)}
            />

            {/* Sub-navigation: Only simple Discover / Bookings switcher */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 flex justify-end">
              <div className="inline-flex p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-medium">
                <button
                  onClick={() => setHirerActiveTab("chowk")}
                  className={`px-3 py-1.5 rounded-lg transition ${
                    hirerActiveTab === "chowk"
                      ? "bg-slate-800 text-white font-semibold"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Browse Artisans
                </button>
                <button
                  onClick={() => setHirerActiveTab("bookings")}
                  className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                    hirerActiveTab === "bookings"
                      ? "bg-slate-800 text-white font-semibold"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>My Bookings</span>
                </button>
              </div>
            </div>

            {/* Sub-view rendering */}
            {hirerActiveTab === "chowk" ? (
              <DigitalChowkRadar
                shramiks={filteredShramiks}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                availableOnly={availableOnly}
                onToggleAvailableOnly={() => setAvailableOnly(!availableOnly)}
                onBookEscrow={handleOpenBooking}
                onOpenEShramModal={() => setEShramModalOpen(true)}
                onOpenVoiceModal={() => setVoiceModalOpen(true)}
              />
            ) : (
              <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
                <HirerDashboard />
              </div>
            )}

            {/* How Shramik Works - Peaceful, Clean Steps */}
            <section className="py-16 border-t border-slate-850 bg-slate-900/30">
              <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-10">
                <div className="text-center space-y-2 max-w-xl mx-auto">
                  <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                    How it works
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400">
                    A transparent, secure process designed for peace of mind.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 text-left">
                  <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-2.5">
                    <span className="text-xs font-bold text-amber-400 block">Step 01</span>
                    <h3 className="text-sm font-semibold text-white">Find or Speak</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Search trades or speak naturally using voice to find verified artisans nearby.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-2.5">
                    <span className="text-xs font-bold text-emerald-400 block">Step 02</span>
                    <h3 className="text-sm font-semibold text-white">Direct Connect</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Talk directly with zero middleman commissions to agree on daily schedule.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-2.5">
                    <span className="text-xs font-bold text-blue-400 block">Step 03</span>
                    <h3 className="text-sm font-semibold text-white">Escrow &amp; Check-in</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Wages are deposited safely into escrow and verified upon arrival with a 4-digit site OTP.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-2.5">
                    <span className="text-xs font-bold text-purple-400 block">Step 04</span>
                    <h3 className="text-sm font-semibold text-white">Instant Payout</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      When work finishes satisfactorily, release wages instantly to the artisan&apos;s UPI.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* MODALS */}
      <VoiceAssistantModal
        isOpen={voiceModalOpen}
        onClose={() => setVoiceModalOpen(false)}
        onProfileCreated={handleProfileCreated}
      />

      <EscrowBookingModal
        shramik={selectedWorkerForEscrow}
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
      />

      <EShramBadgeModal
        isOpen={eShramModalOpen}
        onClose={() => setEShramModalOpen(false)}
      />

      <PostJobModal
        isOpen={postJobModalOpen}
        onClose={() => setPostJobModalOpen(false)}
        onJobPosted={(job) => {
          console.log("Job broadcasted:", job);
        }}
      />

      <PhoneAuthModal />
    </div>
  );
}
