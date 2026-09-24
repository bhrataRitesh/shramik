"use client";

import React, { createContext, useContext, useState } from "react";

export type Language = "en";

export const DICTIONARY: { [key: string]: string } = {
  // Brand & Tagline
  app_name: "Shramik",
  app_subtitle: "Digital Labor Marketplace",
  tagline: "Connecting Skills with Opportunities. Zero Middlemen, 100% Escrow Protection.",
  hero_desc:
    "Directly hire verified local masons, carpenters, electricians, painters, plumbers, and construction crews. Guaranteed daily wage security with Escrow UPI and verified e-Shram & Aadhaar credentials.",
  ai_chowk_badge: "India's First AI-Powered Digital Labor Marketplace",
  live_chowk_badge: "Digital Chowk: 140+ Workers Online",

  // Role Switcher
  mode_hirer: "Hirer Mode",
  mode_labourer: "Labourer Mode",
  switch_to_hirer: "Switch to Hirer Mode",
  switch_to_labourer: "Switch to Labourer Mode",

  // Nav Actions
  nav_language: "English",
  nav_eshram: "e-Shram Verify",
  nav_voice_profile: "AI Voice Profile",
  nav_post_job: "Hire / Post Job",
  nav_login: "Login / Sign Up",
  nav_logout: "Logout",
  nav_my_jobs: "My Bookings",
  nav_wallet: "Wallet",

  // Search & Filter
  search_placeholder: "Search artisans or trades (e.g. Mason, Electrician, Painter, Plumber...)",
  radius_3km: "Within 3 km",
  radius_5km: "Within 5 km",
  radius_10km: "Within 10 km",
  radius_25km: "Entire City (25 km)",
  quick_voice_prompt: "Trouble typing? Tap the mic and speak — 'Need 2 painters tomorrow'",
  start_speaking: "Start Voice",
  btn_hire_now: "Hire Workers Now",
  btn_join_worker: "Join as Artisan",

  // Trust Pillars
  pillar_escrow_title: "100% Escrow Wage Guarantee",
  pillar_escrow_desc:
    "Employer deposits wages into secure escrow upfront. Instant transfer to worker bank/UPI once site OTP is verified.",
  pillar_verify_title: "e-Shram & Aadhaar Verified",
  pillar_verify_desc:
    "Artisans certified with official 12-digit e-Shram UAN and Aadhaar KYC badges for verified trustworthiness.",
  pillar_direct_title: "Direct Connect • 0% Commission",
  pillar_direct_desc:
    "Connect straight via phone call or WhatsApp with zero broker cuts. Instant digital wage slips.",

  // Chowk Section
  chowk_live_badge: "Live Digital Labour Chowk (Virtual Naka)",
  chowk_heading: "Nearby Verified Artisans & Crews",
  chowk_subtitle:
    "Browse available workers by proximity, skills, and daily rates just like a physical morning labor market.",
  filter_available_today: "Available Today Only",
  view_grid: "Grid View",
  view_radar: "Radar Map",

  // Worker Card
  badge_master: "Master Artisan",
  badge_available: "Available Today",
  badge_crew: "Crew",
  card_experience: "yrs experience",
  card_daily_wage: "Daily Wage:",
  card_per_day: "/ Day",
  card_escrow_secured: "Escrow Secured",
  card_call: "Call",
  card_chat: "Chat",
  card_book_escrow: "Book Escrow",
  card_distance_away: "km away",
  no_workers_found: "No Artisans Found",
  no_workers_desc:
    "No workers match the selected filters. Reset filters or speak your requirement using voice AI.",

  // Radar
  radar_title: "📍 Live Chowk Radar Map (Interactive Proximity)",
  radar_subtitle: "Real-time presence of active workers around your location",
  radar_you: "Your Location",
  radar_pins_active: "pins active",

  // Labourer Dashboard (Worker Mode)
  labourer_heading: "Artisan Control Center",
  labourer_standby_label: "Today's Morning Standby Status:",
  labourer_available_now:
    "🟢 You are AVAILABLE on the live Chowk! Nearby employers can dispatch gigs to you.",
  labourer_offline:
    "⚪ You are OFFLINE. Toggle ON to receive instant morning job offers.",
  wallet_balance_title: "Secured Escrow Wallet Balance:",
  wallet_withdraw_upi: "Instant UPI Payout",
  incoming_job_alert: "⚡ Urgent Job Alert! (Incoming Dispatch)",
  countdown_seconds: "sec remaining to accept",
  btn_accept_job: "Accept Job",
  btn_decline_job: "Decline",
  enter_checkin_otp: "Enter Employer's 4-digit Site Check-in OTP:",
  btn_verify_checkin: "Verify Check-in & Start Work",
  active_jobs_title: "Current Active Gigs",

  // Hirer Dashboard
  hirer_heading: "Employer Management Center",
  hirer_hired_workers: "Your Booked Artisans & Crews",
  otp_to_give_worker: "Check-in OTP for worker upon arrival:",
  btn_release_escrow: "Work Complete • Release Escrow Wage",
  btn_rate_worker: "Leave Review",

  // Modals - Escrow & Razorpay
  escrow_modal_title: "100% Escrow Guaranteed",
  escrow_modal_subtitle:
    "Daily wages remain securely held in escrow. Released only upon OTP site check-in & your completion verification.",
  razorpay_gateway_badge: "Razorpay Secured UPI Escrow",
  days_needed: "Number of Days:",
  employer_name: "Employer Name:",
  employer_phone: "Mobile Phone:",
  site_address: "Work Site Address:",
  total_escrow_deposit: "Total Escrow Deposit:",
  platform_fee_zero: "Shramik Platform Fee: 0% Free",
  btn_proceed_razorpay: "Pay with Razorpay UPI Escrow",

  // Modals - Voice AI
  voice_modal_badge: "Vernacular Voice AI Assistant",
  voice_modal_title: "Create Your Digital Profile by Speaking",
  voice_modal_desc:
    "No typing required. Speak naturally about your trade, experience, and daily rates — AI will format your visiting card automatically.",
  mic_listening: "🔴 Listening... Speak now (tap mic to stop)",
  mic_tap_start: "Tap microphone to start speaking",
  transcribed_label: "Transcribed Speech:",
  btn_generate_profile: "Generate Artisan Profile",
  btn_publish_profile: "Publish to Digital Chowk",

  // Modals - e-Shram
  eshram_title: "Government e-Shram Card Verification",
  eshram_desc:
    "e-Shram is India's official unorganized worker registry. Verified workers receive higher ranking and official trust badges on Shramik.",
  eshram_input_label: "Enter your 12-digit e-Shram UAN:",
  btn_verify_eshram: "Verify & Claim Trust Badge",

  // Modals - Phone Auth (Twilio OTP)
  auth_modal_title: "Quick Phone OTP Authentication",
  auth_enter_phone: "Enter 10-digit Mobile Number:",
  btn_send_otp: "Send Twilio SMS OTP",
  auth_enter_otp: "Enter 6-digit OTP received via SMS:",
  btn_confirm_login: "Verify OTP & Continue",

  // Footer & Welfare
  footer_helpline: "National Labour Helpline (Govt of India): 14434 (Toll-Free)",
  footer_official_portal: "Official e-Shram Portal",
  footer_rights_reserved: "All rights reserved. Dedicated to the dignity of skilled labor.",
};

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const language: Language = "en";

  const toggleLanguage = () => {};
  const setLanguage = () => {};

  const t = (key: string): string => {
    return DICTIONARY[key] || key;
  };

  return (
    <LanguageContext.Provider
      value={{ language, toggleLanguage, setLanguage, t }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

export default LanguageContext;
