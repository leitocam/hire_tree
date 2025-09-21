import { useState } from "react";
import { LandingPage } from "./components/landing-page";
import { ApplicantDashboard } from "./components/applicant-dashboard";
import { CompanyDashboard } from "./components/company-dashboard";
import { EducationalDashboard } from "./components/educational-dashboard";
import {
  AuthProvider,
  useAuth,
} from "./components/auth-context";
import { Toaster } from "./components/ui/sonner";

type UserRole = "applicant" | "company" | "educational" | null;

function AppContent() {
  const { user, userRole } = useAuth();

  if (!user) {
    return <LandingPage />;
  }

  switch (userRole) {
    case "applicant":
      return <ApplicantDashboard />;
    case "company":
      return <CompanyDashboard />;
    case "educational":
      return <EducationalDashboard />;
    default:
      return <LandingPage />;
  }
}

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
        <AppContent />
        <Toaster />
      </div>
    </AuthProvider>
  );
}