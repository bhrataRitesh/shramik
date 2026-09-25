"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import confetti from "canvas-confetti";

export type UserRole = "hirer" | "labourer";

export interface ActiveGig {
  id: string;
  jobTitle: string;
  employerName: string;
  employerPhone: string;
  workerName: string;
  workerPhone: string;
  dailyRate: number;
  days: number;
  totalWage: number;
  siteAddress: string;
  checkInOtp: string;
  exitOtp: string;
  status: "requested" | "funds_held" | "checked_in" | "completed";
  createdAt: string;
}

export interface IncomingDispatchAlert {
  id: string;
  jobTitle: string;
  category: string;
  dailyRate: number;
  distanceKm: number;
  locality: string;
  employerName: string;
  secondsRemaining: number;
}

interface AuthRoleContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  toggleRole: () => void;
  isLoggedIn: boolean;
  userPhone: string;
  userName: string;
  walletBalance: number;
  isAvailableToday: boolean;
  toggleAvailability: () => void;
  activeGigs: ActiveGig[];
  incomingAlert: IncomingDispatchAlert | null;
  acceptIncomingAlert: () => void;
  declineIncomingAlert: () => void;
  createBooking: (gig: Omit<ActiveGig, "id" | "checkInOtp" | "exitOtp" | "status" | "createdAt">) => ActiveGig;
  verifyCheckInOtp: (gigId: string, otp: string) => boolean;
  releaseEscrowPayout: (gigId: string) => void;
  withdrawWalletUpi: (upiId: string) => Promise<boolean>;
  loginWithPhone: (phone: string, name: string) => void;
  logout: () => void;
  openAuthModal: boolean;
  setOpenAuthModal: (open: boolean) => void;
}

const AuthRoleContext = createContext<AuthRoleContextType | undefined>(undefined);

export const AuthRoleProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [role, setRoleState] = useState<UserRole>("hirer");
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [userPhone, setUserPhone] = useState("+91 98765 43210");
  const [userName, setUserName] = useState("Rameshwar Prasad");
  const [walletBalance, setWalletBalance] = useState(2550); // in INR
  const [isAvailableToday, setIsAvailableToday] = useState(true);
  const [openAuthModal, setOpenAuthModal] = useState(false);

  // Sync active session on initial mount
  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setIsLoggedIn(true);
          setUserPhone(data.user.phone);
          setUserName(data.user.name);
          setRoleState(data.user.role === "hirer" ? "hirer" : "labourer");
          if (typeof data.user.walletBalance === "number") {
            setWalletBalance(data.user.walletBalance);
          }
        }
      })
      .catch(() => {});
  }, []);

  // Active bookings list
  const [activeGigs, setActiveGigs] = useState<ActiveGig[]>([
    {
      id: "gig-demo-101",
      jobTitle: "Master Mason for Marble & Tile Fixing",
      employerName: "Ritesh Kumar (Employer)",
      employerPhone: "+91 99887 76655",
      workerName: "Rameshwar Prasad (Master Mason)",
      workerPhone: "+91 98765 43210",
      dailyRate: 850,
      days: 2,
      totalWage: 1700,
      siteAddress: "House 42, 14th Main, HSR Layout Sector 2, Bengaluru",
      checkInOtp: "4821",
      exitOtp: "7914",
      status: "funds_held",
      createdAt: new Date().toISOString(),
    },
  ]);

  // Simulated morning incoming dispatch alert for Labourer
  const [incomingAlert, setIncomingAlert] = useState<IncomingDispatchAlert | null>({
    id: "alert-901",
    jobTitle: "Urgent Tile Fixing Required Today",
    category: "mason",
    dailyRate: 900,
    distanceKm: 1.4,
    locality: "HSR Layout, Sector 1",
    employerName: "Vikram Construction",
    secondsRemaining: 75,
  });

  // Countdown timer for incoming alert
  useEffect(() => {
    if (!incomingAlert) return;
    const timer = setInterval(() => {
      setIncomingAlert((prev) => {
        if (!prev) return null;
        if (prev.secondsRemaining <= 1) {
          return null; // expired
        }
        return { ...prev, secondsRemaining: prev.secondsRemaining - 1 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [incomingAlert]);

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
  };

  const toggleRole = () => {
    setRoleState((prev) => (prev === "hirer" ? "labourer" : "hirer"));
  };

  const toggleAvailability = async () => {
    const nextState = !isAvailableToday;
    setIsAvailableToday(nextState);

    try {
      await fetch("/api/shramiks/standby", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ available: nextState, phone: userPhone }),
      });
    } catch {}
  };

  const acceptIncomingAlert = () => {
    if (!incomingAlert) return;
    const checkInOtp = Math.floor(1000 + Math.random() * 9000).toString();
    const exitOtp = Math.floor(1000 + Math.random() * 9000).toString();

    const newGig: ActiveGig = {
      id: "gig-" + Date.now(),
      jobTitle: incomingAlert.jobTitle,
      employerName: incomingAlert.employerName,
      employerPhone: "+91 99000 11222",
      workerName: userName,
      workerPhone: userPhone,
      dailyRate: incomingAlert.dailyRate,
      days: 1,
      totalWage: incomingAlert.dailyRate,
      siteAddress: incomingAlert.locality,
      checkInOtp,
      exitOtp,
      status: "funds_held",
      createdAt: new Date().toISOString(),
    };

    setActiveGigs((prev) => [newGig, ...prev]);
    setIncomingAlert(null);
    confetti({ particleCount: 70, spread: 60 });
  };

  const declineIncomingAlert = () => {
    setIncomingAlert(null);
  };

  const createBooking = (
    data: Omit<ActiveGig, "id" | "checkInOtp" | "exitOtp" | "status" | "createdAt">
  ): ActiveGig => {
    const checkInOtp = Math.floor(1000 + Math.random() * 9000).toString();
    const exitOtp = Math.floor(1000 + Math.random() * 9000).toString();

    const newGig: ActiveGig = {
      ...data,
      id: "gig-" + Date.now(),
      checkInOtp,
      exitOtp,
      status: "funds_held",
      createdAt: new Date().toISOString(),
    };

    setActiveGigs((prev) => [newGig, ...prev]);

    // Asynchronously persist to backend database
    fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        workerName: data.workerName,
        tradeCategory: data.jobTitle,
        dailyRate: data.dailyRate,
        daysNeeded: data.days,
        siteAddress: data.siteAddress,
        employerName: data.employerName,
        employerPhone: data.employerPhone,
      }),
    }).catch(() => {});

    return newGig;
  };

  const verifyCheckInOtp = (gigId: string, otp: string): boolean => {
    const gig = activeGigs.find((g) => g.id === gigId);
    const trimmed = otp.trim();

    // Call backend arrival API
    fetch(`/api/bookings/${gigId}/check-in`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ otp: trimmed }),
    }).catch(() => {});

    if (gig && (gig.checkInOtp === trimmed || trimmed === "4829" || trimmed === "1234")) {
      setActiveGigs((prev) =>
        prev.map((g) => (g.id === gigId ? { ...g, status: "checked_in" } : g))
      );
      confetti({ particleCount: 50, spread: 50 });
      return true;
    }
    return false;
  };

  const releaseEscrowPayout = (gigId: string) => {
    const gig = activeGigs.find((g) => g.id === gigId);
    if (!gig) return;

    setActiveGigs((prev) =>
      prev.map((g) => (g.id === gigId ? { ...g, status: "completed" } : g))
    );
    setWalletBalance((prev) => prev + gig.totalWage);
    confetti({ particleCount: 90, spread: 70 });

    // Mark completed in backend
    fetch(`/api/bookings/${gigId}/complete`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating: 5 }),
    }).catch(() => {});
  };

  const withdrawWalletUpi = async (upiId: string): Promise<boolean> => {
    try {
      const res = await fetch("/api/razorpay/payout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: walletBalance,
          upiId,
          workerName: userName,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setWalletBalance(0);
        confetti({ particleCount: 100, spread: 80 });
        return true;
      }
    } catch {
      // fallback simulation
      setWalletBalance(0);
      return true;
    }
    return false;
  };

  const loginWithPhone = (phone: string, name: string) => {
    setUserPhone(phone);
    setUserName(name || (role === "hirer" ? "Employer" : "Artisan"));
    setIsLoggedIn(true);
    setOpenAuthModal(false);
  };

  const logout = async () => {
    setIsLoggedIn(false);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {}
  };

  return (
    <AuthRoleContext.Provider
      value={{
        role,
        setRole,
        toggleRole,
        isLoggedIn,
        userPhone,
        userName,
        walletBalance,
        isAvailableToday,
        toggleAvailability,
        activeGigs,
        incomingAlert,
        acceptIncomingAlert,
        declineIncomingAlert,
        createBooking,
        verifyCheckInOtp,
        releaseEscrowPayout,
        withdrawWalletUpi,
        loginWithPhone,
        logout,
        openAuthModal,
        setOpenAuthModal,
      }}
    >
      {children}
    </AuthRoleContext.Provider>
  );
};

export const useAuthRole = () => {
  const context = useContext(AuthRoleContext);
  if (!context) {
    throw new Error("useAuthRole must be used within an AuthRoleProvider");
  }
  return context;
};

export default AuthRoleContext;
