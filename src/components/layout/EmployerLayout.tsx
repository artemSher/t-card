import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { C, F } from "@/data/mockData";
import { Icon } from "@/components/icons/Icons";
import { useApp } from "@/context/AppContext";

const NAV_ITEMS = [
  { path: "/employer", label: "Главная", icon: Icon.Home },
  { path: "/employer/vacancies", label: "Вакансии", icon: Icon.Briefcase },
  { path: "/employer/candidates", label: "Кандидаты", icon: Icon.AddUser },
  { path: "/employer/applications", label: "Отклики", icon: Icon.Folder },
  { path: "/employer/assessments", label: "Тестирование", icon: Icon.Award },
  { path: "/employer/analytics", label: "Аналитика", icon: Icon.Chart },
  { path: "/employer/company", label: "Компания", icon: Icon.Building },
];

const MOBILE_TABS = [
  { path: "/employer", label: "Главная", icon: Icon.Home },
  { path: "/employer/vacancies", label: "Вакансии", icon: Icon.Briefcase },
  { path: "/employer/candidates", label: "Кандидаты", icon: Icon.AddUser },
  { path: "/employer/applications", label: "Отклики", icon: Icon.Folder },
  { path: "/employer/settings", label: "Ещё", icon: Icon.Settings },
];

const PAGE_TITLES: Record<string, string> = {
  "/employer": "Главная",
  "/employer/vacancies": "Вакансии",
  "/employer/candidates": "Кандидаты",
  "/employer/applications": "Отклики",
  "/employer/assessments": "Тестирование",
  "/employer/analytics": "Аналитика",
  "/employer/company": "Компания",
  "/employer/settings": "Настройки",
  "/employer/notifications": "Уведомления",
};

function EmployerSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useApp();

  return (
    <aside style={{
      width: 240, flexShrink: 0, height: "100vh", position: "sticky", top: 0,
      background: "white", borderRight: `1px solid ${C.border}`,
      display: "flex", flexDirection: "column", padding: "28px 16px",
      boxShadow: "2px 0 20px rgba(0,0,0,0.03)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 36, paddingLeft: 8, cursor: "pointer" }}
        onClick={() => navigate("/employer")}>
        <div style={{
          width: 40, height: 40, background: C.green, borderRadius: 12,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <span style={{ fontSize: 20 }}>🏢</span>
        </div>
        <div>
          <div style={{ fontFamily: F.bold, fontSize: 18, color: C.text, letterSpacing: "-0.3px" }}>Т-Card</div>
          <div style={{ fontFamily: F.regular, fontSize: 11, color: C.sub }}>Для предприятий</div>
        </div>
      </div>

      <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {NAV_ITEMS.map(item => {
          const active = location.pathname === item.path ||
            (item.path !== "/employer" && location.pathname.startsWith(item.path));
          return (
            <button key={item.path} onClick={() => navigate(item.path)} style={{
              display: "flex", alignItems: "center", gap: 12, padding: "11px 14px",
              borderRadius: 14, border: "none", cursor: "pointer", textAlign: "left",
              transition: "all 0.15s",
              background: active ? `${C.green}14` : "transparent",
              color: active ? C.green : C.sub,
            }}
              onMouseOver={e => { if (!active) e.currentTarget.style.background = "#f7f7f7"; }}
              onMouseOut={e => { if (!active) e.currentTarget.style.background = "transparent"; }}
            >
              <item.icon size={20} color={active ? C.green : C.sub} />
              <span style={{
                fontFamily: active ? F.semi : F.regular, fontSize: 14,
                color: active ? C.green : C.muted,
              }}>{item.label}</span>
            </button>
          );
        })}
      </nav>
      <div style={{ flex: 1 }} />

      <div style={{
        background: C.bg, borderRadius: 16, padding: "12px 14px",
        display: "flex", alignItems: "center", gap: 10, border: `1px solid ${C.border}`,
      }}>
        <div style={{
          width: 38, height: 38, borderRadius: "50%", background: "#1a3a5c",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: F.semi, fontSize: 14, color: "white",
        }}>
          {user.name.charAt(0)}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: F.semi, fontSize: 13, color: C.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {user.name}
          </div>
          <div style={{ fontFamily: F.regular, fontSize: 11, color: C.sub }}>HR-менеджер</div>
        </div>
        <button onClick={() => navigate("/employer/settings")} style={{ background: "none", border: "none", cursor: "pointer" }}>
          <Icon.Settings />
        </button>
      </div>
    </aside>
  );
}

function EmployerTopBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useApp();
  const title = PAGE_TITLES[location.pathname] ?? "Т-Card";

  return (
    <header style={{
      height: 64, borderBottom: `1px solid ${C.border}`, background: "white",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 32px", position: "sticky", top: 0, zIndex: 10,
      boxShadow: "0 1px 12px rgba(0,0,0,0.04)",
    }}>
      <div style={{ fontFamily: F.semi, fontSize: 20, color: C.text, letterSpacing: "-0.4px" }}>
        {title}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <button onClick={() => navigate("/employer/notifications")} style={{ background: "none", border: "none", cursor: "pointer", position: "relative" }}>
          <Icon.Bell />
        </button>
        <div onClick={() => navigate("/employer/settings")} style={{
          width: 38, height: 38, borderRadius: "50%", background: `${C.green}20`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: F.semi, fontSize: 14, color: C.green, cursor: "pointer",
        }}>
          {user.name.charAt(0)}
        </div>
      </div>
    </header>
  );
}

function EmployerMobileTabBar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav style={{
      position: "fixed", bottom: 0, left: 0, right: 0,
      background: "rgba(255,255,255,0.88)", backdropFilter: "blur(12px)",
      borderTop: `1px solid ${C.border}`, display: "flex", zIndex: 50,
      paddingBottom: "env(safe-area-inset-bottom, 0px)",
    }}>
      {MOBILE_TABS.map(tab => {
        const active = location.pathname === tab.path ||
          (tab.path !== "/employer" && location.pathname.startsWith(tab.path));
        return (
          <button key={tab.path} onClick={() => navigate(tab.path)} style={{
            flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
            gap: 4, padding: "8px 4px 10px", border: "none", background: "none", cursor: "pointer",
          }}>
            <tab.icon size={22} color={active ? C.green : C.sub} />
            <span style={{ fontFamily: F.regular, fontSize: 10, color: active ? C.green : C.sub }}>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

function EmployerMobileHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const title = PAGE_TITLES[location.pathname] ?? "Т-Card";

  return (
    <header style={{
      background: "white", borderBottom: `1px solid ${C.border}`,
      padding: "16px 16px 12px", display: "flex", alignItems: "center", justifyContent: "space-between",
    }}>
      <div style={{ fontFamily: F.semi, fontSize: 18, color: C.text }}>{title}</div>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <button onClick={() => navigate("/employer/notifications")} style={{ background: "none", border: "none", cursor: "pointer" }}>
          <Icon.Bell />
        </button>
        <button onClick={() => navigate("/employer/settings")} style={{ background: "none", border: "none", cursor: "pointer" }}>
          <Icon.Settings />
        </button>
      </div>
    </header>
  );
}

export function EmployerLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Desktop */}
      <div style={{ minHeight: "100vh", background: C.bg }}
        className="hidden md:flex">
        <EmployerSidebar />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
          <EmployerTopBar />
          <main style={{ flex: 1, padding: "28px 32px", maxWidth: 1200, width: "100%", margin: "0 auto" }}>
            {children}
          </main>
        </div>
      </div>

      {/* Mobile */}
      <div className="md:hidden" style={{ background: C.bg, minHeight: "100vh" }}>
        <EmployerMobileHeader />
        <div style={{ padding: "16px 16px 90px" }}>
          {children}
        </div>
        <EmployerMobileTabBar />
      </div>
    </>
  );
}
