import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { C, F } from "@/data/mockData";
import { Icon } from "@/components/icons/Icons";
import { GreenBtn, OutlineBtn, Input } from "@/components/ui";
import { useApp } from "@/context/AppContext";

// ─── Выбор роли ──────────────────────────────────────────────────────────────
export function RoleSelection() {
  const navigate = useNavigate();
  const { setRole, setAuthenticated } = useApp();

  return (
    <div style={{
      minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center",
      padding: 20,
    }}>
      <div style={{ maxWidth: 440, width: "100%" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{
            width: 72, height: 72, background: C.green, borderRadius: 20,
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            marginBottom: 20,
          }}>
            <span style={{ fontSize: 36 }}>🔧</span>
          </div>
          <div style={{ fontFamily: F.bold, fontSize: 32, color: C.text, letterSpacing: "-0.6px", marginBottom: 8 }}>
            Т-Card
          </div>
          <div style={{ fontFamily: F.regular, fontSize: 16, color: C.sub, lineHeight: "24px" }}>
            Выберите формат входа
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {/* Сотрудник */}
          <div onClick={() => { setRole("employee"); setAuthenticated(true); navigate("/employee"); }} style={{
            background: "white", border: `1px solid ${C.border}`, borderRadius: 20, padding: 24,
            cursor: "pointer", transition: "border-color 0.15s",
          }}
            onMouseOver={(e) => e.currentTarget.style.borderColor = C.green}
            onMouseOut={(e) => e.currentTarget.style.borderColor = C.border}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 12 }}>
              <div style={{
                width: 48, height: 48, background: `${C.green}14`, borderRadius: 14,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Icon.User active size={24} />
              </div>
              <div>
                <div style={{ fontFamily: F.semi, fontSize: 18, color: C.text }}>Для соискателей</div>
                <div style={{ fontFamily: F.regular, fontSize: 13, color: C.sub }}>Бесплатно для соискателей</div>
              </div>
            </div>
            <div style={{ fontFamily: F.regular, fontSize: 14, color: C.sub, lineHeight: "22px" }}>
              Работа на промышленных предприятиях: подбор по разряду, допускам и сменности
            </div>
          </div>

          {/* Работодатель */}
          <div onClick={() => { setRole("employer"); setAuthenticated(true); navigate("/employer"); }} style={{
            background: "white", border: `1px solid ${C.border}`, borderRadius: 20, padding: 24,
            cursor: "pointer", transition: "border-color 0.15s",
          }}
            onMouseOver={(e) => e.currentTarget.style.borderColor = C.green}
            onMouseOut={(e) => e.currentTarget.style.borderColor = C.border}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 12 }}>
              <div style={{
                width: 48, height: 48, background: `${C.green}14`, borderRadius: 14,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Icon.Building active size={24} />
              </div>
              <div>
                <div style={{ fontFamily: F.semi, fontSize: 18, color: C.text }}>Для работодателей</div>
                <div style={{ fontFamily: F.regular, fontSize: 13, color: C.sub }}>Т-Card для предприятий</div>
              </div>
            </div>
            <div style={{ fontFamily: F.regular, fontSize: 14, color: C.sub, lineHeight: "22px" }}>
              Подбор, оценка и развитие рабочих и инженерных кадров в едином контуре
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Заставка сотрудника ─────────────────────────────────────────────────────
export function EmployeeLogin() {
  const navigate = useNavigate();
  const { setAuthenticated } = useApp();

  return (
    <div style={{
      minHeight: "100vh", background: `linear-gradient(135deg, ${C.green} 0%, #00c99a 100%)`,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: 20, position: "relative", overflow: "hidden",
    }}>
      {/* Декоративные круги */}
      <div style={{ position: "absolute", right: -60, top: -60, width: 300, height: 300, borderRadius: "50%", border: "70px solid rgba(255,255,255,0.06)" }} />
      <div style={{ position: "absolute", left: -40, bottom: -40, width: 200, height: 200, borderRadius: "50%", border: "50px solid rgba(255,255,255,0.04)" }} />

      <div style={{ position: "relative", textAlign: "center", maxWidth: 400 }}>
        <div style={{
          width: 80, height: 80, background: "white", borderRadius: 24,
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          marginBottom: 24, boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
        }}>
          <span style={{ fontSize: 40 }}>🔧</span>
        </div>

        <div style={{
          display: "inline-block", background: "rgba(255,255,255,0.2)", color: "white",
          fontFamily: F.regular, fontSize: 13, borderRadius: 20, padding: "5px 16px",
          marginBottom: 16,
        }}>
          Бесплатно для соискателей
        </div>

        <div style={{ fontFamily: F.bold, fontSize: 36, color: "white", letterSpacing: "-0.8px", marginBottom: 12 }}>
          Т-Card
        </div>
        <div style={{ fontFamily: F.regular, fontSize: 16, color: "rgba(255,255,255,0.85)", lineHeight: "26px", marginBottom: 32 }}>
          Работа на промышленных предприятиях: подбор по разряду, допускам и сменности
        </div>

        <button onClick={() => navigate("/employee/phone")} style={{
          background: "white", color: C.green, fontFamily: F.semi, fontSize: 16,
          borderRadius: 20, padding: "14px 40px", border: "none", cursor: "pointer",
          boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
        }}>Авторизация</button>
      </div>
    </div>
  );
}

// ─── Ввод телефона ───────────────────────────────────────────────────────────
export function PhoneInputPage() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("+7 ");
  const [error, setError] = useState("");

  function handleContinue() {
    if (phone.replace(/\D/g, "").length < 11) {
      setError("Введите корректный номер телефона");
      return;
    }
    setError("");
    navigate("/employee/code");
  }

  return (
    <div style={{
      minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center",
      padding: 20,
    }}>
      <div style={{ maxWidth: 400, width: "100%" }}>
        <button onClick={() => navigate("/employee/login")} style={{
          background: "none", border: "none", cursor: "pointer", marginBottom: 24,
          display: "flex", alignItems: "center", gap: 6, color: C.sub,
        }}>
          <Icon.ChevronLeft size={18} />
          <span style={{ fontFamily: F.regular, fontSize: 14 }}>Назад</span>
        </button>

        <div style={{ marginBottom: 28 }}>
          <div style={{ fontFamily: F.bold, fontSize: 28, color: C.text, letterSpacing: "-0.5px", marginBottom: 10 }}>
            Вход
          </div>
          <div style={{ fontFamily: F.regular, fontSize: 15, color: C.sub, lineHeight: "24px" }}>
            Введите номер телефона — мы отправим код подтверждения
          </div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <Input
            label="Номер телефона"
            value={phone}
            onChange={setPhone}
            placeholder="+7 XXX XXX-XX-XX"
            type="tel"
            error={error}
          />
        </div>

        <GreenBtn label="Продолжить" full onClick={handleContinue} />
      </div>
    </div>
  );
}

// ─── Код подтверждения ───────────────────────────────────────────────────────
export function CodeVerificationPage() {
  const navigate = useNavigate();
  const { setAuthenticated } = useApp();
  const [digits, setDigits] = useState(["", "", "", "", ""]);
  const [error, setError] = useState("");
  const [attempts, setAttempts] = useState(5);
  const [timer, setTimer] = useState(32);

  React.useEffect(() => {
    if (timer > 0) {
      const t = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [timer]);

  function handleChange(index: number, value: string) {
    if (value.length > 1) return;
    const newDigits = [...digits];
    newDigits[index] = value;
    setDigits(newDigits);
    setError("");
    if (value && index < 4) {
      const next = document.getElementById(`code-${index + 1}`);
      next?.focus();
    }
  }

  function handleVerify() {
    const code = digits.join("");
    if (code.length < 5) {
      setError("Введите все 5 цифр кода");
      return;
    }
    // Демо-режим: любой код из 5 цифр принимается
    if (code === "00000") {
      setAttempts(a => a - 1);
      setError(`Неверный код. Осталось ${attempts - 1} попыток из 5. Проверьте SMS или запросите код заново`);
      return;
    }
    setAuthenticated(true);
    navigate("/employee");
  }

  return (
    <div style={{
      minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center",
      padding: 20,
    }}>
      <div style={{ maxWidth: 400, width: "100%" }}>
        <button onClick={() => navigate("/employee/phone")} style={{
          background: "none", border: "none", cursor: "pointer", marginBottom: 24,
          display: "flex", alignItems: "center", gap: 6, color: C.sub,
        }}>
          <Icon.ChevronLeft size={18} />
          <span style={{ fontFamily: F.regular, fontSize: 14 }}>Назад</span>
        </button>

        <div style={{ marginBottom: 28 }}>
          <div style={{ fontFamily: F.bold, fontSize: 28, color: C.text, letterSpacing: "-0.5px", marginBottom: 10 }}>
            Верификация
          </div>
          <div style={{ fontFamily: F.regular, fontSize: 15, color: C.sub, lineHeight: "24px" }}>
            Код отправлен на номер +7 XXX XXX-XX-XX
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, marginBottom: 20, justifyContent: "center" }}>
          {digits.map((d, i) => (
            <input
              key={i} id={`code-${i}`} value={d}
              onChange={e => handleChange(i, e.target.value.replace(/\D/g, ""))}
              maxLength={1}
              style={{
                width: 52, height: 60, textAlign: "center",
                background: "white", border: `2px solid ${error ? C.red : d ? C.green : C.border}`,
                borderRadius: 14, fontFamily: F.bold, fontSize: 24, color: C.text,
                outline: "none", transition: "border-color 0.15s",
              }}
            />
          ))}
        </div>

        {error && (
          <div style={{
            background: `${C.red}10`, borderRadius: 14, padding: "12px 16px",
            marginBottom: 20, display: "flex", alignItems: "center", gap: 10,
          }}>
            <Icon.AlertTriangle size={20} color={C.red} />
            <span style={{ fontFamily: F.regular, fontSize: 13, color: C.red, lineHeight: "20px" }}>{error}</span>
          </div>
        )}

        <GreenBtn label="Продолжить" full onClick={handleVerify} />

        <div style={{ textAlign: "center", marginTop: 20 }}>
          {timer > 0 ? (
            <span style={{ fontFamily: F.regular, fontSize: 14, color: C.sub }}>
              Повторная отправка через 00:{timer.toString().padStart(2, "0")}
            </span>
          ) : (
            <button onClick={() => setTimer(32)} style={{
              background: "none", border: "none", cursor: "pointer",
              fontFamily: F.regular, fontSize: 14, color: C.green,
            }}>Отправить код заново</button>
          )}
        </div>
      </div>
    </div>
  );
}
