import React, { createContext, useContext, useCallback } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { DEFAULT_SETTINGS, DEFAULT_USER, MOCK_APPLICATIONS, MOCK_RESUMES, MOCK_SAVED_SEARCHES } from "@/data/mockData";
import type { Role, User, AppSettings, Application, Resume, SavedSearch } from "@/types";

interface AppContextValue {
  role: Role | null;
  setRole: (r: Role | null) => void;
  isAuthenticated: boolean;
  setAuthenticated: (v: boolean) => void;
  user: User;
  setUser: (u: User) => void;
  settings: AppSettings;
  setSettings: (s: AppSettings | ((prev: AppSettings) => AppSettings)) => void;
  bookmarks: number[];
  toggleBookmark: (id: number) => void;
  applications: Application[];
  addApplication: (a: Application) => void;
  removeApplication: (id: number) => void;
  resumes: Resume[];
  addResume: (r: Resume) => void;
  updateResume: (r: Resume) => void;
  savedSearches: SavedSearch[];
  addSavedSearch: (s: SavedSearch) => void;
  toggleSavedSearchNotifications: (id: number) => void;
  logout: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useLocalStorage<Role | null>("tcard:role", null);
  const [isAuthenticated, setAuthenticated] = useLocalStorage<boolean>("tcard:auth", false);
  const [user, setUser] = useLocalStorage<User>("tcard:user", DEFAULT_USER);
  const [settings, setSettings] = useLocalStorage<AppSettings>("tcard:settings", DEFAULT_SETTINGS);
  const [bookmarks, setBookmarks] = useLocalStorage<number[]>("tcard:bookmarks", [1, 3]);
  const [applications, setApplications] = useLocalStorage<Application[]>("tcard:applications:v2", MOCK_APPLICATIONS);
  const [resumes, setResumes] = useLocalStorage<Resume[]>("tcard:resumes", MOCK_RESUMES);
  const [savedSearches, setSavedSearches] = useLocalStorage<SavedSearch[]>("tcard:savedSearches", MOCK_SAVED_SEARCHES);

  const toggleBookmark = useCallback((id: number) => {
    setBookmarks(prev => prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]);
  }, [setBookmarks]);

  const addApplication = useCallback((a: Application) => {
    setApplications(prev => [a, ...prev]);
  }, [setApplications]);

  const removeApplication = useCallback((id: number) => {
    setApplications(prev => prev.filter(a => a.id !== id));
  }, [setApplications]);

  const addResume = useCallback((r: Resume) => {
    setResumes(prev => [...prev, r]);
  }, [setResumes]);

  const updateResume = useCallback((r: Resume) => {
    setResumes(prev => prev.map(item => item.id === r.id ? r : item));
  }, [setResumes]);

  const addSavedSearch = useCallback((s: SavedSearch) => {
    setSavedSearches(prev => [...prev, s]);
  }, [setSavedSearches]);

  const toggleSavedSearchNotifications = useCallback((id: number) => {
    setSavedSearches(prev => prev.map(s => s.id === id ? { ...s, notifications: !s.notifications } : s));
  }, [setSavedSearches]);

  const logout = useCallback(() => {
    setRole(null);
    setAuthenticated(false);
  }, [setRole, setAuthenticated]);

  return (
    <AppContext.Provider value={{
      role, setRole,
      isAuthenticated, setAuthenticated,
      user, setUser,
      settings, setSettings,
      bookmarks, toggleBookmark,
      applications, addApplication, removeApplication,
      resumes, addResume, updateResume,
      savedSearches, addSavedSearch, toggleSavedSearchNotifications,
      logout,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
