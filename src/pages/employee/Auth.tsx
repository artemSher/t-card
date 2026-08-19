import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { C, F, SPECIALTIES, GRADES, EXPERIENCE_OPTIONS, TEST_ACCOUNTS } from "@/data/mockData";
import { Icon } from "@/components/icons/Icons";
import { GreenBtn, OutlineBtn, Input } from "@/components/ui";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { useApp } from "@/context/AppContext";
import type { User } from "@/types";

// ─── Выбор роли ──────────────────────────────────────────────────────────────
export function RoleSelection() {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: "100vh",
      background: `linear-gradient(160deg, #0ea877 0%, #00b88a 40%, #009972 100%)`,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: "24px 20px", position: "relative", overflow: "hidden",
    }}>
      {/* Декоративные круги — текстура */}
      <div style={{ position: "absolute", right: -180, top: -180, width: 520, height: 520, borderRadius: "50%", border: "100px solid rgba(255,255,255,0.05)" }} />
      <div style={{ position: "absolute", left: -120, bottom: -120, width: 380, height: 380, borderRadius: "50%", border: "80px solid rgba(255,255,255,0.04)" }} />
      <div style={{ position: "absolute", right: 80, bottom: 60, width: 140, height: 140, borderRadius: "50%", border: "35px solid rgba(255,255,255,0.03)" }} />
      <div style={{ position: "absolute", left: 100, top: 120, width: 90, height: 90, borderRadius: "50%", border: "25px solid rgba(255,255,255,0.03)" }} />

      {/* Контент */}
      <div style={{ position: "relative", textAlign: "center", maxWidth: 640, width: "100%" }}>
        {/* Название */}
        <div style={{
          fontFamily: F.bold, fontSize: 52, color: "white", letterSpacing: "-1.2px",
          marginBottom: 16,
        }}>
          Т-Card
        </div>

        {/* Описание */}
        <div style={{
          fontFamily: F.regular, fontSize: 19, color: "rgba(255,255,255,0.9)",
          lineHeight: "30px", marginBottom: 12, maxWidth: 520, margin: "0 auto 12px",
        }}>
          Платформа для подбора, оценки и развития рабочих и инженерных кадров на промышленных предприятиях
        </div>

        {/* Подзаголовок */}
        <div style={{
          fontFamily: F.regular, fontSize: 15, color: "rgba(255,255,255,0.65)",
          lineHeight: "24px", marginBottom: 44, maxWidth: 460, margin: "0 auto 44px",
        }}>
          Подбор по разряду, допускам и сменности. Резюме с подтверждёнными навыками. Оценка квалификации и развитие.
        </div>

        {/* Кнопки */}
        <div style={{
          display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap",
        }}>
          <button
            onClick={() => navigate("/employee/login")}
            style={{
              background: "white", color: C.green, fontFamily: F.semi, fontSize: 17,
              borderRadius: 22, padding: "18px 44px", border: "none", cursor: "pointer",
              boxShadow: "0 8px 28px rgba(0,0,0,0.18)",
              transition: "transform 0.15s, box-shadow 0.15s",
              display: "flex", alignItems: "center", gap: 10,
            }}
            onMouseOver={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 36px rgba(0,0,0,0.22)"; }}
            onMouseOut={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(0,0,0,0.18)"; }}
          >
            <Icon.User active size={22} />
            Я соискатель
          </button>

          <button
            onClick={() => navigate("/employer/login")}
            style={{
              background: "transparent", color: "white", fontFamily: F.semi, fontSize: 17,
              borderRadius: 22, padding: "18px 44px", border: "2px solid rgba(255,255,255,0.4)",
              cursor: "pointer", backdropFilter: "blur(8px)",
              transition: "transform 0.15s, border-color 0.15s, background 0.15s",
              display: "flex", alignItems: "center", gap: 10,
            }}
            onMouseOver={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.borderColor = "white"; e.currentTarget.style.background = "rgba(255,255,255,0.08)"; }}
            onMouseOut={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.4)"; e.currentTarget.style.background = "transparent"; }}
          >
            <Icon.Building active size={22} />
            Я работодатель
          </button>
        </div>

        {/* Низ — статистика */}
        <div style={{
          display: "flex", gap: 40, justifyContent: "center", marginTop: 56,
          flexWrap: "wrap",
        }}>
          <div>
            <div style={{ fontFamily: F.bold, fontSize: 28, color: "white" }}>1 200+</div>
            <div style={{ fontFamily: F.regular, fontSize: 13, color: "rgba(255,255,255,0.6)" }}>вакансий</div>
          </div>
          <div>
            <div style={{ fontFamily: F.bold, fontSize: 28, color: "white" }}>3 500+</div>
            <div style={{ fontFamily: F.regular, fontSize: 13, color: "rgba(255,255,255,0.6)" }}>соискателей</div>
          </div>
          <div>
            <div style={{ fontFamily: F.bold, fontSize: 28, color: "white" }}>80+</div>
            <div style={{ fontFamily: F.regular, fontSize: 13, color: "rgba(255,255,255,0.6)" }}>предприятий</div>
          </div>
        </div>
      </div>

      {/* Копирайт */}
      <div style={{
        position: "absolute", bottom: 20, left: 0, right: 0, textAlign: "center",
        fontFamily: F.regular, fontSize: 13, color: "rgba(255,255,255,0.45)",
      }}>
        © 2025 Т-Card. Все права защищены.
      </div>
    </div>
  );
}

// ─── Заставка сотрудника ─────────────────────────────────────────────────────
export function EmployeeLogin() {
  const navigate = useNavigate();
  const { setRole, setAuthenticated, setUser } = useApp();

  function quickLogin(account: typeof TEST_ACCOUNTS[0]) {
    setUser({
      name: account.name,
      phone: account.phone,
      role: "employee",
      specialty: account.specialty,
      grade: account.grade,
      city: account.city,
      about: account.about,
    });
    setRole("employee");
    setAuthenticated(true);
    navigate("/employee");
  }

  return (
    <AuthLayout
      title="Добро пожаловать"
      subtitle="Войдите в аккаунт или зарегистрируйтесь — это бесплатно"
      accent="green"
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <button onClick={() => navigate("/employee/phone")} style={{
          background: C.green, color: "white", fontFamily: F.semi, fontSize: 16,
          borderRadius: 20, padding: "16px 40px", border: "none", cursor: "pointer",
          boxShadow: "0 4px 16px rgba(14,168,119,0.25)",
          transition: "transform 0.1s",
        }}
          onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-1px)"}
          onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}
        >Авторизация</button>

        <button onClick={() => navigate("/employee/register")} style={{
          background: "white", color: C.text, fontFamily: F.regular, fontSize: 15,
          borderRadius: 20, padding: "14px 28px", border: `1px solid ${C.border}`,
          cursor: "pointer",
        }}>Регистрация</button>
      </div>

      <div style={{
        marginTop: 32, paddingTop: 24, borderTop: `1px solid ${C.border}`,
      }}>
        <div style={{
          fontFamily: F.semi, fontSize: 13, color: C.sub, marginBottom: 14,
          display: "flex", alignItems: "center", gap: 8,
        }}>
          <span style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            width: 18, height: 18, borderRadius: "50%", background: `${C.green}14`,
            fontSize: 10, color: C.green,
          }}>✓</span>
          Тестовые аккаунты — быстрый вход
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {TEST_ACCOUNTS.map((acc) => (
            <button
              key={acc.id}
              onClick={() => quickLogin(acc)}
              style={{
                background: "white", border: `1px solid ${C.border}`, borderRadius: 14,
                padding: "12px 16px", cursor: "pointer", textAlign: "left",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                transition: "border-color 0.15s, background 0.15s",
              }}
              onMouseOver={(e) => { e.currentTarget.style.borderColor = C.green; e.currentTarget.style.background = `${C.green}06`; }}
              onMouseOut={(e) => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = "white"; }}
            >
              <div>
                <div style={{ fontFamily: F.semi, fontSize: 14, color: C.text }}>{acc.name}</div>
                <div style={{ fontFamily: F.regular, fontSize: 12, color: C.sub, marginTop: 2 }}>
                  {acc.label} · {acc.city}
                </div>
              </div>
              <Icon.ChevronRight size={18} />
            </button>
          ))}
        </div>
      </div>
    </AuthLayout>
  );
}

// ─── Регистрация соискателя — Шаг 1: Имя и телефон ───────────────────────────
export function EmployeeRegister() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("+7 ");
  const [error, setError] = useState("");

  function handleContinue() {
    if (!name.trim()) {
      setError("Введите имя и фамилию");
      return;
    }
    if (phone.replace(/\D/g, "").length < 11) {
      setError("Введите корректный номер телефона");
      return;
    }
    setError("");
    navigate("/employee/register/code");
  }

  return (
    <AuthLayout
      title="Регистрация"
      subtitle="Создайте аккаунт соискателя — это займёт пару минут"
      backTo="/employee/login"
      accent="green"
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <Input
          label="Имя и фамилия"
          value={name}
          onChange={setName}
          placeholder="Иван Петров"
          error={error && !name.trim() ? error : ""}
        />

        <Input
          label="Номер телефона"
          value={phone}
          onChange={setPhone}
          placeholder="+7 XXX XXX-XX-XX"
          type="tel"
          error={error && phone.replace(/\D/g, "").length < 11 ? error : ""}
        />

        <GreenBtn label="Продолжить" full onClick={handleContinue} />
      </div>
    </AuthLayout>
  );
}

// ─── Регистрация соискателя — Шаг 2: Код подтверждения ───────────────────────
export function EmployeeRegisterCode() {
  const navigate = useNavigate();
  const [digits, setDigits] = useState(["", "", "", "", ""]);
  const [error, setError] = useState("");
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
      const next = document.getElementById(`reg-code-${index + 1}`);
      next?.focus();
    }
  }

  function handleVerify() {
    const code = digits.join("");
    if (code.length < 5) {
      setError("Введите все 5 цифр кода");
      return;
    }
    navigate("/employee/register/profile");
  }

  return (
    <AuthLayout
      title="Подтверждение телефона"
      subtitle="Код отправлен на номер +7 XXX XXX-XX-XX"
      backTo="/employee/register"
      accent="green"
    >
      <div style={{ display: "flex", gap: 10, marginBottom: 20, justifyContent: "center" }}>
        {digits.map((d, i) => (
          <input
            key={i} id={`reg-code-${i}`} value={d}
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
    </AuthLayout>
  );
}

// ─── Регистрация соискателя — Шаг 3: Профиль ────────────────────────────────
export function EmployeeRegisterProfile() {
  const navigate = useNavigate();
  const { setRole, setAuthenticated, setUser } = useApp();
  const [name, setName] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [grade, setGrade] = useState<number | null>(null);
  const [experience, setExperience] = useState<string | null>(null);
  const [city, setCity] = useState("");
  const [error, setError] = useState("");

  function handleFinish() {
    if (!name.trim()) {
      setError("Введите имя и фамилию");
      return;
    }
    if (!specialty.trim()) {
      setError("Укажите специальность");
      return;
    }
    setError("");
    const newUser: User = {
      name: name.trim(),
      phone: "+7 999 000-00-00",
      role: "employee",
      specialty: specialty.trim(),
      grade: grade ?? undefined,
      city: city.trim() || undefined,
    };
    setUser(newUser);
    setRole("employee");
    setAuthenticated(true);
    navigate("/employee");
  }

  return (
    <AuthLayout
      title="Профиль соискателя"
      subtitle="Заполните данные — работодатели найдут вас по специальности и разряду"
      backTo="/employee/register/code"
      accent="green"
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <Input
          label="Имя и фамилия"
          value={name}
          onChange={setName}
          placeholder="Иван Петров"
          error={error && !name.trim() ? error : ""}
        />

        <div>
          <Input
            label="Специальность"
            value={specialty}
            onChange={setSpecialty}
            placeholder="Например: Оператор ЧПУ"
            error={error && !specialty.trim() ? error : ""}
          />
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
            {SPECIALTIES.slice(0, 6).map(s => (
              <button key={s} onClick={() => setSpecialty(s)} style={{
                background: specialty === s ? `${C.green}10` : "white",
                border: `1px solid ${specialty === s ? C.green : C.border}`,
                borderRadius: 16, padding: "6px 14px", cursor: "pointer",
                fontFamily: F.regular, fontSize: 13,
                color: specialty === s ? C.green : C.sub,
              }}>{s}</button>
            ))}
          </div>
        </div>

        <div>
          <div style={{ fontFamily: F.regular, fontSize: 13, color: C.sub, marginBottom: 8 }}>Разряд</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {GRADES.map(g => (
              <button key={g} onClick={() => setGrade(grade === g ? null : g)} style={{
                background: grade === g ? `${C.green}10` : "white",
                border: `1px solid ${grade === g ? C.green : C.border}`,
                borderRadius: 16, padding: "8px 16px", cursor: "pointer",
                fontFamily: F.regular, fontSize: 14,
                color: grade === g ? C.green : C.sub,
              }}>{g}</button>
            ))}
          </div>
        </div>

        <div>
          <div style={{ fontFamily: F.regular, fontSize: 13, color: C.sub, marginBottom: 8 }}>Опыт работы</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {EXPERIENCE_OPTIONS.map(exp => (
              <button key={exp} onClick={() => setExperience(experience === exp ? null : exp)} style={{
                background: experience === exp ? `${C.green}10` : "white",
                border: `1px solid ${experience === exp ? C.green : C.border}`,
                borderRadius: 16, padding: "8px 16px", cursor: "pointer",
                fontFamily: F.regular, fontSize: 13,
                color: experience === exp ? C.green : C.sub,
              }}>{exp}</button>
            ))}
          </div>
        </div>

        <Input
          label="Город"
          value={city}
          onChange={setCity}
          placeholder="Екатеринбург"
        />

        <GreenBtn label="Завершить регистрацию" full onClick={handleFinish} />
      </div>
    </AuthLayout>
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
    <AuthLayout
      title="Вход"
      subtitle="Введите номер телефона — мы отправим код подтверждения"
      backTo="/employee/login"
      accent="green"
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <Input
          label="Номер телефона"
          value={phone}
          onChange={setPhone}
          placeholder="+7 XXX XXX-XX-XX"
          type="tel"
          error={error}
        />

        <GreenBtn label="Продолжить" full onClick={handleContinue} />
      </div>
    </AuthLayout>
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
    if (code === "00000") {
      setAttempts(a => a - 1);
      setError(`Неверный код. Осталось ${attempts - 1} попыток из 5. Проверьте SMS или запросите код заново`);
      return;
    }
    setAuthenticated(true);
    navigate("/employee");
  }

  return (
    <AuthLayout
      title="Верификация"
      subtitle="Код отправлен на номер +7 XXX XXX-XX-XX"
      backTo="/employee/phone"
      accent="green"
    >
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
    </AuthLayout>
  );
}
