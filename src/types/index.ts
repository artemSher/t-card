export type Role = "employee" | "employer";

export type EmployeeTab =
  | "home"
  | "vacancies"
  | "applications"
  | "profile"
  | "settings";

export type EmployerTab =
  | "home"
  | "vacancies"
  | "candidates"
  | "applications"
  | "analytics"
  | "company"
  | "settings";

// ─── Vacancy ────────────────────────────────────────────────────────────────
export interface Vacancy {
  id: number;
  company: string;
  companyLogo?: string;
  title: string;
  city: string;
  salaryFrom: number;
  salaryTo: number;
  experience: string;
  grade: number;
  admissions: string[];
  shift: string;
  department: string;
  description: string;
  date: string;
  views: number;
  responses: number;
  active: boolean;
  category: string;
  rating?: number;
  reviewsCount?: number;
}

// ─── Candidate ──────────────────────────────────────────────────────────────
export interface Candidate {
  id: number;
  name: string;
  specialty: string;
  grade: number;
  gradeConfirmed: boolean;
  city: string;
  experience: string;
  matchPercent: number;
  admissions: string[];
  shift: string;
  assessments: AssessmentTopic[];
}

export interface AssessmentTopic {
  name: string;
  score: number;
}

// ─── Application (отклик) ───────────────────────────────────────────────────
export type ApplicationStatus =
  | "pending"
  | "invitation"
  | "interview"
  | "rejected"
  | "offer";

export interface Application {
  id: number;
  vacancyId: number;
  vacancyTitle: string;
  company: string;
  companyLogo?: string;
  date: string;
  status: ApplicationStatus;
  stages: { name: string; date: string; done: boolean }[];
}

// ─── Assessment (оценка) ────────────────────────────────────────────────────
export type AssessmentStatus = "assigned" | "completed" | "expired";

export interface Assessment {
  id: number;
  title: string;
  type: "test" | "case" | "simulation";
  duration: string;
  deadline: string;
  status: AssessmentStatus;
  score?: number;
  confirmedGrade?: number;
  topics?: AssessmentTopic[];
  weakZone?: string;
  questions?: AssessmentQuestion[];
}

export interface AssessmentQuestion {
  id: number;
  text: string;
  options: string[];
  correctIndex: number;
}

// ─── Development track ──────────────────────────────────────────────────────
export interface DevelopmentTrack {
  id: number;
  goal: string;
  progress: number;
  assignedByEmployer: boolean;
  deadline: string;
  checkpoints: {
    name: string;
    status: "done" | "reminder" | "planned";
    date: string;
  }[];
  recommendedPrograms: LearningProgram[];
}

export interface LearningProgram {
  id: number;
  title: string;
  duration: string;
  format: string;
  paidByEmployer: boolean;
  modulesProgress?: number;
  modulesTotal?: number;
}

// ─── Certificate ────────────────────────────────────────────────────────────
export interface Certificate {
  id: number;
  title: string;
  issueDate: string;
  expiryDate: string | "permanent";
}

// ─── Resume ─────────────────────────────────────────────────────────────────
export interface Resume {
  id: number;
  specialty: string;
  experience: string;
  salaryFrom: number;
  salaryTo: number;
  city: string;
  active: boolean;
  updatedAt: string;
  stats: {
    favorites: number;
    responses: number;
    views: number;
  };
}

// ─── Notification ───────────────────────────────────────────────────────────
export type NotificationType =
  | "new_response"
  | "assessment_completed"
  | "candidate_rejected"
  | "subscription"
  | "interview"
  | "invitation";

export interface AppNotification {
  id: number;
  type: NotificationType;
  text: string;
  time: string;
  dateGroup: "today" | "yesterday";
  read: boolean;
}

// ─── Search history ─────────────────────────────────────────────────────────
export interface SearchHistoryItem {
  id: number;
  query: string;
  date: string;
}

// ─── Saved search ───────────────────────────────────────────────────────────
export interface SavedSearch {
  id: number;
  query: string;
  criteria: string;
  notifications: boolean;
}

// ─── Settings ───────────────────────────────────────────────────────────────
export interface AppSettings {
  pinEnabled: boolean;
  faceIdEnabled: boolean;
  touchIdEnabled: boolean;
  notificationsEnabled: boolean;
  phone: string;
  email: string;
  name: string;
}

// ─── Company ────────────────────────────────────────────────────────────────
export interface Company {
  name: string;
  inn: string;
  industry: string;
  size: string;
  address: string;
  departments: string[];
  verified: boolean;
  rating: number;
  reviewsCount: number;
}

// ─── User ───────────────────────────────────────────────────────────────────
export interface User {
  name: string;
  phone: string;
  role: Role;
  specialty?: string;
  grade?: number;
  city?: string;
  photo?: string;
}
