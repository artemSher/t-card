import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { C, F } from "@/data/mockData";
import { Icon } from "@/components/icons/Icons";
import { GreenBtn, OutlineBtn, Input, SuccessScreen } from "@/components/ui";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { useApp } from "@/context/AppContext";

const EMPLOYER_TEST_ACCOUNTS = [
  { id: "emp-1", name: "ООО «ПромТех Решения»", label: "Машиностроение · Екатеринбург" },
  { id: "emp-2", name: "АО «УралМаш»", label: "Тяжёлое машиностроение · Екатеринбург" },
  { id: "emp-3", name: "ООО «СтальКонструкция»", label: "Металлообработка · Челябинск" },
];

// ─── Заставка работодателя ───────────────────────────────────────────────────
export function EmployerLogin() {
  const navigate = useNavigate();
  const { setRole, setAuthenticated } = useApp();

  function quickLogin() {
    setRole("employer");
    setAuthenticated(true);
    navigate("/employer");
  }

  return (
    <AuthLayout
      title="Вход для работодателя"
      subtitle="Войдите в аккаунт или зарегистрируйте новую компанию"
      accent="green"
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <button onClick={() => navigate("/employer/phone")} style={{
          background: C.green, color: "white", fontFamily: F.semi, fontSize: 16,
          borderRadius: 20, padding: "16px 40px", border: "none", cursor: "pointer",
          boxShadow: "0 4px 16px rgba(14,168,119,0.25)",
          transition: "transform 0.1s",
        }}
          onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-1px)"}
          onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}
        >Авторизация</button>

        <button onClick={() => navigate("/employer/register")} style={{
          background: "white", color: C.text, fontFamily: F.regular, fontSize: 15,
          borderRadius: 20, padding: "14px 28px", border: `1px solid ${C.border}`,
          cursor: "pointer",
        }}>Регистрация новой компании</button>
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
          {EMPLOYER_TEST_ACCOUNTS.map((acc) => (
            <button
              key={acc.id}
              onClick={quickLogin}
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
                  {acc.label}
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

// ─── Ввод телефона ───────────────────────────────────────────────────────────
export function EmployerPhoneInput() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("+7 ");
  const [error, setError] = useState("");

  function handleContinue() {
    if (phone.replace(/\D/g, "").length < 11) {
      setError("Введите корректный номер телефона");
      return;
    }
    setError("");
    navigate("/employer/code");
  }

  return (
    <AuthLayout
      title="Вход для работодателя"
      subtitle="Введите номер телефона — мы отправим код подтверждения"
      backTo="/employer/login"
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
export function EmployerCodeVerification() {
  const navigate = useNavigate();
  const { setAuthenticated, setRole } = useApp();
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
      const next = document.getElementById(`emp-code-${index + 1}`);
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
    setRole("employer");
    setAuthenticated(true);
    navigate("/employer");
  }

  return (
    <AuthLayout
      title="Верификация"
      subtitle="Код отправлен на номер +7 XXX XXX-XX-XX"
      backTo="/employer/phone"
      accent="green"
    >
      <div style={{ display: "flex", gap: 10, marginBottom: 20, justifyContent: "center" }}>
        {digits.map((d, i) => (
          <input
            key={i} id={`emp-code-${i}`} value={d}
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

// ─── Регистрация работодателя (шаг 1: данные компании) ──────────────────────
export function EmployerRegister() {
  const navigate = useNavigate();
  const [companyName, setCompanyName] = useState("");
  const [inn, setInn] = useState("");
  const [industry, setIndustry] = useState("");
  const [address, setAddress] = useState("");
  const [contactName, setContactName] = useState("");
  const [phone, setPhone] = useState("+7 ");
  const [error, setError] = useState("");

  function handleContinue() {
    if (!companyName.trim() || !inn.trim() || !contactName.trim()) {
      setError("Заполните обязательные поля: название компании, ИНН, контактное лицо");
      return;
    }
    if (inn.replace(/\D/g, "").length < 10) {
      setError("Введите корректный ИНН (10 или 12 цифр)");
      return;
    }
    setError("");
    navigate("/employer/register/code");
  }

  return (
    <AuthLayout
      title="Регистрация компании"
      subtitle="Заполните данные организации. После проверки реквизитов вы получите доступ к платформе."
      backTo="/employer/login"
      accent="green"
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Input label="Название компании *" value={companyName} onChange={setCompanyName} placeholder="ООО «ПромТех Решения»" />
        <Input label="ИНН *" value={inn} onChange={setInn} placeholder="6678001234" type="tel" />
        <Input label="Отрасль" value={industry} onChange={setIndustry} placeholder="Машиностроение" />
        <Input label="Адрес" value={address} onChange={setAddress} placeholder="г. Екатеринбург, ул. Промышленная, 15" />
        <Input label="Контактное лицо *" value={contactName} onChange={setContactName} placeholder="Иванов Иван Иванович" />
        <Input label="Телефон *" value={phone} onChange={setPhone} placeholder="+7 XXX XXX-XX-XX" type="tel" />

        {error && (
          <div style={{
            background: `${C.red}10`, borderRadius: 14, padding: "12px 16px",
            display: "flex", alignItems: "center", gap: 10,
          }}>
            <Icon.AlertTriangle size={20} color={C.red} />
            <span style={{ fontFamily: F.regular, fontSize: 13, color: C.red, lineHeight: "20px" }}>{error}</span>
          </div>
        )}

        <GreenBtn label="Продолжить" full onClick={handleContinue} />
      </div>
    </AuthLayout>
  );
}

// ─── Регистрация (шаг 2: код подтверждения телефона) ──────────────────────────
export function EmployerRegisterCode() {
  const navigate = useNavigate();
  const { setRole, setAuthenticated } = useApp();
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
      const next = document.getElementById(`emp-reg-code-${index + 1}`);
      next?.focus();
    }
  }

  function handleVerify() {
    const code = digits.join("");
    if (code.length < 5) {
      setError("Введите все 5 цифр кода");
      return;
    }
    setRole("employer");
    setAuthenticated(true);
    navigate("/employer/verification/pending");
  }

  return (
    <AuthLayout
      title="Подтверждение телефона"
      subtitle="Код отправлен на номер +7 XXX XXX-XX-XX"
      backTo="/employer/register"
      accent="green"
    >
      <div style={{ display: "flex", gap: 10, marginBottom: 20, justifyContent: "center" }}>
        {digits.map((d, i) => (
          <input
            key={i} id={`emp-reg-code-${i}`} value={d}
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

      <GreenBtn label="Подтвердить" full onClick={handleVerify} />

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

// ─── Верификация компании: ожидание проверки ─────────────────────────────────
export function EmployerVerificationPending() {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center",
      padding: 20,
    }}>
      <div style={{ maxWidth: 420, width: "100%", textAlign: "center" }}>
        <div style={{
          width: 80, height: 80, borderRadius: "50%", background: `${C.amber}18`,
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 24px",
        }}>
          <Icon.Clock size={40} color={C.amber} />
        </div>
        <div style={{ fontFamily: F.bold, fontSize: 24, color: C.text, marginBottom: 12 }}>
          Компания на проверке
        </div>
        <div style={{ fontFamily: F.regular, fontSize: 15, color: C.sub, lineHeight: "24px", marginBottom: 28 }}>
          Мы проверяем реквизиты вашей компании. Обычно это занимает 1–2 рабочих дня.
          Вы получите уведомление, когда проверка будет завершена.
        </div>
        <div style={{
          background: "white", border: `1px solid ${C.border}`, borderRadius: 20, padding: 20,
          textAlign: "left", marginBottom: 24,
        }}>
          <div style={{ fontFamily: F.semi, fontSize: 15, color: C.text, marginBottom: 12 }}>
            Что проверяем:
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Icon.CheckCircle size={18} color={C.green} />
              <span style={{ fontFamily: F.regular, fontSize: 14, color: C.text }}>ИНН в базе ФНС</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Icon.CheckCircle size={18} color={C.green} />
              <span style={{ fontFamily: F.regular, fontSize: 14, color: C.text }}>Реквизиты организации</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Icon.CheckCircle size={18} color={C.green} />
              <span style={{ fontFamily: F.regular, fontSize: 14, color: C.text }}>Контактные данные</span>
            </div>
          </div>
        </div>
        <GreenBtn label="Перейти в личный кабинет" full onClick={() => navigate("/employer")} />
      </div>
    </div>
  );
}

// ─── Верификация компании: подтверждено ──────────────────────────────────────
export function EmployerVerificationSuccess() {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center",
      padding: 20,
    }}>
      <SuccessScreen
        title="Компания верифицирована"
        subtitle="Ваша компания успешно прошла проверку. Теперь вы можете публиковать вакансии и искать кандидатов."
        buttonText="Перейти к работе"
        onButton={() => navigate("/employer")}
      />
    </div>
  );
}
