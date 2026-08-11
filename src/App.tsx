import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AppProvider, useApp } from "@/context/AppContext";
import { EmployeeLayout } from "@/components/layout/EmployeeLayout";
import { EmployerLayout } from "@/components/layout/EmployerLayout";

// Auth
import { RoleSelection, EmployeeLogin, PhoneInputPage, CodeVerificationPage } from "@/pages/employee/Auth";
import { EmployerLogin, EmployerPhoneInput, EmployerCodeVerification } from "@/pages/employer/Auth";

// Employee pages
import { EmployeeHome } from "@/pages/employee/Home";
import { VacancyList, VacancyDetail } from "@/pages/employee/Vacancies";
import { ApplicationList, ApplicationDetail } from "@/pages/employee/Applications";
import { SearchPage } from "@/pages/employee/Search";
import { CompetenceProfile } from "@/pages/employee/Competence";
import { AssessmentList, AssessmentDetail } from "@/pages/employee/Assessments";
import { DevelopmentPage } from "@/pages/employee/Development";
import { ResumeList, ResumeEditor } from "@/pages/employee/Resumes";
import { NotificationsPage, SettingsPage } from "@/pages/employee/Settings";
import { EmployeeProfile } from "@/pages/employee/Profile";

// Employer pages
import { EmployerHome } from "@/pages/employer/Home";
import { EmployerVacancyList, EmployerVacancyDetail, EmployerVacancyEditor } from "@/pages/employer/Vacancies";
import { CandidateList, CandidateDetail } from "@/pages/employer/Candidates";
import { EmployerApplicationList, EmployerApplicationDetail } from "@/pages/employer/Applications";
import { AnalyticsPage } from "@/pages/employer/Analytics";
import { CompanyProfile } from "@/pages/employer/Company";
import { EmployerNotificationsPage, EmployerSettingsPage } from "@/pages/employer/Settings";

// ─── Guard: redirect to login if not authenticated ───────────────────────────
function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, role } = useApp();
  if (!isAuthenticated) return <Navigate to="/employee/login" replace />;
  if (role === "employer") return <Navigate to="/employer" replace />;
  return <>{children}</>;
}

// ─── Guard: redirect to home if already authenticated ────────────────────────
function RedirectIfAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useApp();
  if (isAuthenticated) return <Navigate to="/employee" replace />;
  return <>{children}</>;
}

// ─── Employer guard ──────────────────────────────────────────────────────────
function RequireEmployerAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, role } = useApp();
  if (!isAuthenticated) return <Navigate to="/employer/login" replace />;
  if (role !== "employer") return <Navigate to="/employee" replace />;
  return <>{children}</>;
}

function RedirectIfEmployerAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, role } = useApp();
  if (isAuthenticated && role === "employer") return <Navigate to="/employer" replace />;
  return <>{children}</>;
}

// ─── Employee routes ──────────────────────────────────────────────────────────
function EmployeeRoutes() {
  return (
    <RequireAuth>
      <EmployeeLayout>
        <Routes>
          <Route index element={<EmployeeHome />} />
          <Route path="vacancies" element={<VacancyList />} />
          <Route path="vacancies/:id" element={<VacancyDetail />} />
          <Route path="applications" element={<ApplicationList />} />
          <Route path="applications/:id" element={<ApplicationDetail />} />
          <Route path="profile" element={<EmployeeProfile />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="competence" element={<CompetenceProfile />} />
          <Route path="assessments" element={<AssessmentList />} />
          <Route path="assessments/:id" element={<AssessmentDetail />} />
          <Route path="development" element={<DevelopmentPage />} />
          <Route path="resumes" element={<ResumeList />} />
          <Route path="resumes/new" element={<ResumeEditor />} />
          <Route path="resumes/:id" element={<ResumeEditor />} />
          <Route path="certificates" element={<DevelopmentPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Routes>
      </EmployeeLayout>
    </RequireAuth>
  );
}

// ─── App ─────────────────────────────────────────────────────────────────────
function AppInner() {
  return (
    <Routes>
      {/* Root → role selection */}
      <Route path="/" element={<RoleSelection />} />

      {/* Employee auth */}
      <Route path="/employee/login" element={<RedirectIfAuth><EmployeeLogin /></RedirectIfAuth>} />
      <Route path="/employee/phone" element={<RedirectIfAuth><PhoneInputPage /></RedirectIfAuth>} />
      <Route path="/employee/code" element={<RedirectIfAuth><CodeVerificationPage /></RedirectIfAuth>} />

      {/* Employee app */}
      <Route path="/employee/*" element={<EmployeeRoutes />} />

      {/* Employer auth */}
      <Route path="/employer/login" element={<RedirectIfEmployerAuth><EmployerLogin /></RedirectIfEmployerAuth>} />
      <Route path="/employer/phone" element={<RedirectIfEmployerAuth><EmployerPhoneInput /></RedirectIfEmployerAuth>} />
      <Route path="/employer/code" element={<RedirectIfEmployerAuth><EmployerCodeVerification /></RedirectIfEmployerAuth>} />

      {/* Employer app */}
      <Route path="/employer/*" element={
        <RequireEmployerAuth>
          <EmployerLayout>
            <Routes>
              <Route index element={<EmployerHome />} />
              <Route path="vacancies" element={<EmployerVacancyList />} />
              <Route path="vacancies/new" element={<EmployerVacancyEditor />} />
              <Route path="vacancies/:id" element={<EmployerVacancyDetail />} />
              <Route path="vacancies/:id/edit" element={<EmployerVacancyEditor />} />
              <Route path="candidates" element={<CandidateList />} />
              <Route path="candidates/:id" element={<CandidateDetail />} />
              <Route path="applications" element={<EmployerApplicationList />} />
              <Route path="applications/:id" element={<EmployerApplicationDetail />} />
              <Route path="analytics" element={<AnalyticsPage />} />
              <Route path="company" element={<CompanyProfile />} />
              <Route path="notifications" element={<EmployerNotificationsPage />} />
              <Route path="settings" element={<EmployerSettingsPage />} />
            </Routes>
          </EmployerLayout>
        </RequireEmployerAuth>
      } />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  );
}
