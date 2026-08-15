import React from "react";
import { useNavigate } from "react-router-dom";
import { C, F } from "@/data/mockData";
import { Icon } from "@/components/icons/Icons";
import logoSvg from "@/assets/logo.svg";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  backTo?: string;
  accent?: "green" | "blue";
}

export function AuthLayout({ children, title, subtitle, backTo, accent = "green" }: AuthLayoutProps) {
  const navigate = useNavigate();
  const accentColor = accent === "green" ? C.green : "#1a3a5c";
  const gradientFrom = accent === "green" ? "#0ea877" : "#1a3a5c";
  const gradientTo = accent === "green" ? "#00c99a" : "#2d5a87";
  const emoji = accent === "green" ? "🔧" : "🏢";
  const features = accent === "green"
    ? [
        { icon: "🎯", text: "Подбор по разряду, допускам и сменности" },
        { icon: "📄", text: "Резюме с подтверждёнными навыками" },
        { icon: "🏆", text: "Оценка квалификации и развитие" },
      ]
    : [
        { icon: "👥", text: "Подбор рабочих и инженерных кадров" },
        { icon: "📊", text: "Оценка и развитие сотрудников" },
        { icon: "🏭", text: "Работа с производственными предприятиями" },
      ];

  return (
    <div style={{ minHeight: "100vh", display: "flex" }}>
      {/* Левая часть — брендинг */}
      <div
        className="hidden lg:flex"
        style={{
          flex: "1 1 50%",
          background: `linear-gradient(160deg, ${gradientFrom} 0%, ${gradientTo} 100%)`,
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "48px 56px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Текстура — декоративные круги */}
        <div style={{
          position: "absolute", right: -120, top: -120, width: 400, height: 400,
          borderRadius: "50%", border: "80px solid rgba(255,255,255,0.05)",
        }} />
        <div style={{
          position: "absolute", left: -80, bottom: -80, width: 300, height: 300,
          borderRadius: "50%", border: "60px solid rgba(255,255,255,0.04)",
        }} />
        <div style={{
          position: "absolute", right: 60, bottom: 120, width: 120, height: 120,
          borderRadius: "50%", border: "30px solid rgba(255,255,255,0.03)",
        }} />

        {/* Логотип */}
        <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 14 }}>
          <img src={logoSvg} alt="Т-Card" style={{ width: 52, height: 52, borderRadius: 16, boxShadow: "0 8px 24px rgba(0,0,0,0.15)" }} />
          <div>
            <div style={{ fontFamily: F.bold, fontSize: 22, color: "white", letterSpacing: "-0.5px" }}>Т-Card</div>
            <div style={{ fontFamily: F.regular, fontSize: 12, color: "rgba(255,255,255,0.7)" }}>
              {accent === "green" ? "Для соискателей" : "Для предприятий"}
            </div>
          </div>
        </div>

        {/* Центр — заголовок и текст */}
        <div style={{ position: "relative", maxWidth: 440 }}>
          <div style={{
            display: "inline-block", background: "rgba(255,255,255,0.15)", color: "white",
            fontFamily: F.regular, fontSize: 13, borderRadius: 20, padding: "6px 18px",
            marginBottom: 24, backdropFilter: "blur(8px)",
          }}>
            {accent === "green" ? "Бесплатно для соискателей" : "Т-Card для бизнеса"}
          </div>

          <div style={{
            fontFamily: F.bold, fontSize: 40, color: "white", letterSpacing: "-1px",
            lineHeight: "48px", marginBottom: 20,
          }}>
            {accent === "green"
              ? "Работа на промышленных предприятиях"
              : "Кадры для промышленных предприятий"}
          </div>

          <div style={{
            fontFamily: F.regular, fontSize: 17, color: "rgba(255,255,255,0.82)",
            lineHeight: "28px", marginBottom: 36,
          }}>
            {accent === "green"
              ? "Найдите работу по своей специальности, разряду и допускам. Создайте резюме, проходите оценки и развивайтесь."
              : "Подбор, оценка и развитие рабочих и инженерных кадров в едином контуре. Управляйте вакансиями и кандидатами."}
          </div>

          {/* Преимущества */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {features.map((f, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{
                  width: 40, height: 40, background: "rgba(255,255,255,0.12)", borderRadius: 12,
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  backdropFilter: "blur(8px)",
                }}>
                  <span style={{ fontSize: 20 }}>{f.icon}</span>
                </div>
                <span style={{ fontFamily: F.regular, fontSize: 15, color: "rgba(255,255,255,0.88)" }}>
                  {f.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Низ — копирайт */}
        <div style={{ position: "relative", fontFamily: F.regular, fontSize: 13, color: "rgba(255,255,255,0.5)" }}>
          © 2025 Т-Card. Все права защищены.
        </div>
      </div>

      {/* Правая часть — форма */}
      <div
        style={{
          flex: "1 1 50%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: C.bg,
          padding: "40px 24px",
          minHeight: "100vh",
        }}
      >
        <div style={{ maxWidth: 440, width: "100%" }}>
          {/* Мобильный логотип (виден только на маленьких экранах) */}
          <div className="lg:hidden" style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
            <img src={logoSvg} alt="Т-Card" style={{ width: 44, height: 44, borderRadius: 14 }} />
            <div style={{ fontFamily: F.bold, fontSize: 20, color: C.text }}>Т-Card</div>
          </div>

          {/* Кнопка "Назад" */}
          {backTo && (
            <button
              onClick={() => navigate(backTo)}
              style={{
                background: "none", border: "none", cursor: "pointer", marginBottom: 28,
                display: "flex", alignItems: "center", gap: 6, color: C.sub,
              }}
            >
              <Icon.ChevronLeft size={18} />
              <span style={{ fontFamily: F.regular, fontSize: 14 }}>Назад</span>
            </button>
          )}

          {/* Заголовок */}
          <div style={{ marginBottom: 28 }}>
            <div style={{
              fontFamily: F.bold, fontSize: 28, color: C.text, letterSpacing: "-0.5px", marginBottom: 10,
            }}>
              {title}
            </div>
            <div style={{ fontFamily: F.regular, fontSize: 15, color: C.sub, lineHeight: "24px" }}>
              {subtitle}
            </div>
          </div>

          {/* Контент формы */}
          {children}
        </div>
      </div>
    </div>
  );
}
