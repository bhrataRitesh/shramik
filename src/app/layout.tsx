import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import { AuthRoleProvider } from "@/context/AuthRoleContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Shramik 2.0 | Digital Labor Marketplace & On-Demand Skilled Artisans",
  description:
    "Shramik connects verified daily-wage laborers, masons, carpenters, electricians, painters, and construction crews directly with employers. 100% Escrow wage security, e-Shram UAN verification, Twilio OTP authentication, and voice AI.",
  keywords: [
    "Shramik",
    "Digital Labor Marketplace",
    "Daily Wage Workers",
    "Mason",
    "Painter",
    "Electrician",
    "Carpenter",
    "Contractor",
    "Construction Crews",
    "e-Shram",
    "Escrow Wage Security",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans bg-slate-950 text-slate-100 antialiased selection:bg-amber-500 selection:text-slate-950">
        <LanguageProvider>
          <AuthRoleProvider>{children}</AuthRoleProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
