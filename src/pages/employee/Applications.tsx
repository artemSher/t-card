import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { C, F, APPLICATION_STATUS_LABELS, APPLICATION_STATUS_COLORS } from "@/data/mockData";
import { Icon } from "@/components/icons/Icons";
import { Card, GreenBtn, OutlineBtn, Chip, EmptyState, StatusBadge } from "@/components/ui";
import { useApp } from "@/context/AppContext";
import type { ApplicationStatus } from "@/types";

const STATUS_FILTERS: { id: ApplicationStatus | "all"; label: string }[] = [
  { id: "all", label: "Все" },
  { id: "pending", label: "Ожидание" },
  { id: "invitation", label: "Приглашение" },
  { id: "interview", label: "Собеседование" },
  { id: "rejected", label: "Отклонено" },
];

export function ApplicationList() {
  const navigate = useNavigate();
  const { applications } = useApp();
  const [filter, setFilter] = useState<ApplicationStatus | "all">("all");

  const filtered = filter === "all" ? applications : applications.filter(a => a.status === filter);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Фильтры */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {STATUS_FILTERS.map(f => (
          <Chip
            key={f.id}
            label={f.label}
            active={filter === f.id}
            onClick={() => setFilter(f.id)}
          />
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon="📭"
          title="Откликов пока нет"
          subtitle="Найдите вакансию по своему разряду и допускам — отклик займёт один шаг, резюме уже готово"
          action={<GreenBtn label="Найти вакансию" onClick={() => navigate("/employee/vacancies")} />}
        />
      ) : (
        <>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {filtered.map(app => (
              <Card key={app.id} onClick={() => navigate(`/employee/applications/${app.id}`)}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                  <div>
                    <div style={{ fontFamily: F.semi, fontSize: 16, color: C.text, marginBottom: 4 }}>{app.vacancyTitle}</div>
                    <div style={{ fontFamily: F.regular, fontSize: 13, color: C.sub }}>{app.company}</div>
                  </div>
                  <StatusBadge label={APPLICATION_STATUS_LABELS[app.status]} color={APPLICATION_STATUS_COLORS[app.status]} />
                </div>
                <div style={{ fontFamily: F.regular, fontSize: 12, color: C.sub }}>{app.date}</div>
              </Card>
            ))}
          </div>
          <OutlineBtn label="Сформировать документ PDF" full icon={<Icon.Download size={16} />} />
        </>
      )}
    </div>
  );
}

export function ApplicationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { applications } = useApp();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    { id: 1, from: "employer", text: "Здравствуйте! Спасибо за отклик. Подходящее время для собеседования?", time: "10:30" },
    { id: 2, from: "me", text: "Добрый день! Удобно в четверг после 14:00", time: "10:45" },
  ]);

  const app = applications.find(a => a.id === Number(id));

  if (!app) {
    return <EmptyState icon="🔍" title="Отклик не найден" subtitle="Возможно, данные были удалены" />;
  }

  function sendMessage() {
    if (!message.trim()) return;
    setMessages(prev => [...prev, {
      id: Date.now(), from: "me", text: message, time: new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" }),
    }]);
    setMessage("");
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <button onClick={() => navigate("/employee/applications")} style={{
        background: "none", border: "none", cursor: "pointer",
        display: "flex", alignItems: "center", gap: 6, color: C.sub, alignSelf: "flex-start",
      }}>
        <Icon.ChevronLeft size={18} />
        <span style={{ fontFamily: F.regular, fontSize: 14 }}>К откликам</span>
      </button>

      {/* Шапка */}
      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
          <div>
            <div style={{ fontFamily: F.semi, fontSize: 20, color: C.text, marginBottom: 6 }}>{app.vacancyTitle}</div>
            <div style={{ fontFamily: F.regular, fontSize: 14, color: C.sub }}>{app.company}</div>
          </div>
          <StatusBadge label={APPLICATION_STATUS_LABELS[app.status]} color={APPLICATION_STATUS_COLORS[app.status]} />
        </div>
        <div style={{ fontFamily: F.regular, fontSize: 13, color: C.sub }}>Отклик отправлен: {app.date}</div>
      </Card>

      {/* Этапы */}
      <Card>
        <div style={{ fontFamily: F.semi, fontSize: 16, color: C.text, marginBottom: 16 }}>Этапы прохождения</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {app.stages.map((stage, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{
                width: 28, height: 28, borderRadius: "50%",
                background: stage.done ? C.green : C.border,
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                {stage.done ? <Icon.Check size={14} color="white" /> : <span style={{ fontSize: 12, color: C.sub }}>{i + 1}</span>}
              </div>
              <div>
                <div style={{ fontFamily: F.regular, fontSize: 14, color: stage.done ? C.text : C.sub }}>{stage.name}</div>
                {stage.date && <div style={{ fontFamily: F.regular, fontSize: 12, color: C.sub }}>{stage.date}</div>}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Диалог */}
      <Card>
        <div style={{ fontFamily: F.semi, fontSize: 16, color: C.text, marginBottom: 16 }}>Диалог с работодателем</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16, maxHeight: 300, overflowY: "auto" }}>
          {messages.map(m => (
            <div key={m.id} style={{
              display: "flex", justifyContent: m.from === "me" ? "flex-end" : "flex-start",
            }}>
              <div style={{
                background: m.from === "me" ? C.green : C.bg,
                color: m.from === "me" ? "white" : C.text,
                borderRadius: 16, padding: "10px 16px", maxWidth: "75%",
                fontFamily: F.regular, fontSize: 14, lineHeight: "20px",
              }}>
                {m.text}
                <div style={{
                  fontSize: 10, marginTop: 4, opacity: 0.6,
                  textAlign: m.from === "me" ? "right" : "left",
                }}>{m.time}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            value={message}
            onChange={e => setMessage(e.target.value)}
            onKeyDown={e => e.key === "Enter" && sendMessage()}
            placeholder="Сообщение..."
            style={{
              flex: 1, background: C.bg, border: `1px solid ${C.border}`, borderRadius: 16,
              padding: "10px 16px", fontFamily: F.regular, fontSize: 14, color: C.text,
              outline: "none",
            }}
          />
          <button onClick={sendMessage} style={{
            background: C.green, border: "none", borderRadius: 16, width: 44, height: 44,
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Icon.Send size={18} color="white" />
          </button>
        </div>
      </Card>
    </div>
  );
}
