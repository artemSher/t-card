import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { C, F } from "@/data/mockData";
import { Icon } from "@/components/icons/Icons";
import { useApp } from "@/context/AppContext";

const NAV_ITEMS = [
  { path: "/employee", label: "Главная", Icon: Icon.Home },
  { path: "/employee/vacancies", label: "Вакансии", Icon: Icon.Search },
  { path: "/employee/applications", label: "Отклики", Icon: Icon.Briefcase },
  { path: "/employee/development", label: "Развитие", Icon: Icon.Award },
  { path: "/employee/profile", label: "Профиль", Icon: Icon.User },
  { path: "/employee/settings", label: "Настройки", Icon: Icon.Settings },
];

const PAGE_TITLES: Record<string, string> = {
  "/employee": "Главная",
  "/employee/vacancies": "Вакансии",
  "/employee/applications": "Мои отклики",
  "/employee/profile": "Профиль",
  "/employee/settings": "Настройки",
  "/employee/search": "Поиск вакансий",
  "/employee/competence": "Профиль компетенций",
  "/employee/assessments": "Оценка",
  "/employee/development": "Развитие и обучение",
  "/employee/resumes": "Мои резюме",
  "/employee/certificates": "Сертификаты",
};

export function EmployeeSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useApp();

  return (
    <aside style={{
      width: 240, flexShrink: 0, height: "100vh", position: "sticky", top: 0,
      background: "white", borderRight: `1px solid ${C.border}`,
      display: "flex", flexDirection: "column", padding: "28px 16px",
      boxShadow: "2px 0 20px rgba(0,0,0,0.03)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 36, paddingLeft: 8, cursor: "pointer" }}
        onClick={() => navigate("/employee")}>
        <div style={{
          width: 40, height: 40, background: C.green, borderRadius: 12,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <span style={{ fontSize: 20 }}>🔧</span>
        </div>
        <div>
          <div style={{ fontFamily: F.bold, fontSize: 18, color: C.text, letterSpacing: "-0.3px" }}>Т-Card</div>
          <div style={{ fontFamily: F.regular, fontSize: 11, color: C.sub }}>Работа на предприятиях</div>
        </div>
      </div>

      <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {NAV_ITEMS.map(({ path, label, Icon: NavIcon }) => {
          const active = location.pathname === path ||
            (path !== "/employee" && location.pathname.startsWith(path));
          return (
            <button key={path} onClick={() => navigate(path)} style={{
              display: "flex", alignItems: "center", gap: 12, padding: "11px 14px",
              borderRadius: 14, border: "none", cursor: "pointer", textAlign: "left",
              transition: "all 0.15s",
              background: active ? `${C.green}14` : "transparent",
              color: active ? C.green : C.sub,
            }}
              onMouseOver={e => { if (!active) e.currentTarget.style.background = "#f7f7f7"; }}
              onMouseOut={e => { if (!active) e.currentTarget.style.background = "transparent"; }}
            >
              <NavIcon active={active} />
              <span style={{
                fontFamily: active ? F.semi : F.regular, fontSize: 14,
                color: active ? C.green : C.muted,
              }}>{label}</span>
            </button>
          );
        })}
      </nav>

      <div style={{ flex: 1 }} />

      <button onClick={logout} style={{
        display: "flex", alignItems: "center", gap: 10, padding: "10px 14px",
        borderRadius: 14, border: "none", cursor: "pointer",
        background: "transparent", color: C.sub, marginBottom: 12,
      }}
        onMouseOver={e => (e.currentTarget.style.background = "#f7f7f7")}
        onMouseOut={e => (e.currentTarget.style.background = "transparent")}
      >
        <Icon.Logout size={18} />
        <span style={{ fontFamily: F.regular, fontSize: 14, color: C.muted }}>Выйти</span>
      </button>

      <div style={{
        background: C.bg, borderRadius: 16, padding: "12px 14px",
        display: "flex", alignItems: "center", gap: 10, border: `1px solid ${C.border}`,
      }}>
        <div style={{
          width: 38, height: 38, borderRadius: "50%", background: `${C.green}20`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: F.semi, fontSize: 14, color: C.green,
        }}>
          {user.name.charAt(0)}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: F.semi, fontSize: 13, color: C.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {user.name}
          </div>
          <div style={{ fontFamily: F.regular, fontSize: 11, color: C.sub }}>
            {user.specialty} · {user.grade} разряд
          </div>
        </div>
      </div>
    </aside>
  );
}

export function EmployeeTopBar() {
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
        <button onClick={() => navigate("/employee/search")} style={{
          background: C.bg, border: `1px solid ${C.border}`, borderRadius: 20,
          display: "flex", alignItems: "center", gap: 10, padding: "8px 18px",
          cursor: "pointer", width: 260,
        }}>
          <Icon.Search />
          <span style={{ fontFamily: F.regular, fontSize: 14, color: C.sub }}>Специальность, разряд...</span>
        </button>
        <button onClick={() => navigate("/employee/notifications")} style={{ background: "none", border: "none", cursor: "pointer", position: "relative" }}>
          <Icon.Bell />
          <span style={{
            position: "absolute", top: -2, right: -2, background: C.red, color: "white",
            fontSize: 10, borderRadius: 10, padding: "1px 5px", fontFamily: F.semi,
          }}>2</span>
        </button>
        <div onClick={() => navigate("/employee/profile")} style={{
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

export function EmployeeMobileTabBar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div style={{
      position: "fixed", bottom: 0, left: 0, right: 0,
      background: "rgba(255,255,255,0.88)", backdropFilter: "blur(12px)",
      borderTop: `1px solid ${C.border}`, display: "flex", zIndex: 50,
      paddingBottom: "env(safe-area-inset-bottom, 0px)",
    }}>
      {NAV_ITEMS.map(({ path, label, Icon: I }) => {
        const active = location.pathname === path ||
          (path !== "/employee" && location.pathname.startsWith(path));
        return (
          <button key={path} onClick={() => navigate(path)} style={{
            flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
            gap: 4, padding: "8px 4px 10px", border: "none", background: "none", cursor: "pointer",
          }}>
            <I active={active} />
            <span style={{ fontFamily: F.regular, fontSize: 10, color: active ? C.green : C.sub }}>
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export function EmployeeMobileHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useApp();
  const title = PAGE_TITLES[location.pathname] ?? "Т-Card";

  return (
    <div style={{
      background: "white", borderBottom: `1px solid ${C.border}`,
      padding: "16px 16px 12px", display: "flex", alignItems: "center", justifyContent: "space-between",
    }}>
      <div style={{ fontFamily: F.semi, fontSize: 18, color: C.text }}>{title}</div>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <button onClick={() => navigate("/employee/search")} style={{ background: "none", border: "none", cursor: "pointer" }}>
          <Icon.Search />
        </button>
        <button onClick={() => navigate("/employee/notifications")} style={{ background: "none", border: "none", cursor: "pointer", position: "relative" }}>
          <Icon.Bell />
          <span style={{
            position: "absolute", top: -2, right: -2, background: C.red, color: "white",
            fontSize: 10, borderRadius: 10, padding: "1px 5px", fontFamily: F.semi,
          }}>2</span>
        </button>
        <div onClick={() => navigate("/employee/profile")} style={{
          width: 34, height: 34, borderRadius: "50%", background: `${C.green}20`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: F.semi, fontSize: 13, color: C.green, cursor: "pointer",
        }}>
          {user.name.charAt(0)}
        </div>
      </div>
    </div>
  );
}

// ─── Layout wrapper ──────────────────────────────────────────────────────────
export function EmployeeLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Desktop */}
      <div style={{ minHeight: "100vh", background: C.bg }}
        className="hidden md:flex">
        <EmployeeSidebar />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
          <EmployeeTopBar />
          <main style={{ flex: 1, padding: "28px 32px", maxWidth: 1200, width: "100%", margin: "0 auto" }}>
            {children}
          </main>
        </div>
      </div>

      {/* Mobile */}
      <div className="md:hidden" style={{ background: C.bg, minHeight: "100vh" }}>
        <EmployeeMobileHeader />
        <div style={{ padding: "16px 16px 90px" }}>
          {children}
        </div>
        <EmployeeMobileTabBar />
      </div>
    </>
  );
}
