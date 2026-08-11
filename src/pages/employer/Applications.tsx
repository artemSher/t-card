import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { C, F, MOCK_EMPLOYER_APPLICATIONS, APPLICATION_STATUS_LABELS, APPLICATION_STATUS_COLORS } from "@/data/mockData";
import { Icon } from "@/components/icons/Icons";
import { Card, GreenBtn, OutlineBtn, StatusBadge, EmptyState, SectionHeader, Chip, ProgressBar } from "@/components/ui";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import type { ApplicationStatus } from "@/types";
import type { EmployerApplication } from "@/data/mockData";

const STATUS_FILTERS: { key: ApplicationStatus | "all"; label: string }[] = [
  { key: "all", label: "Все" },
  { key: "pending", label: "Новые" },
  { key: "invitation", label: "Приглашённые" },
  { key: "interview", label: "Собеседование" },
  { key: "offer", label: "Оффер" },
  { key: "rejected", label: "Отклонённые" },
];

// ─── Список откликов ─────────────────────────────────────────────────────────
export function EmployerApplicationList() {
  const navigate = useNavigate();
  const [apps, setApps] = useLocalStorage<EmployerApplication[]>("tcard:employer:applications", MOCK_EMPLOYER_APPLICATIONS);
  const [filter, setFilter] = useState<ApplicationStatus | "all">("all");

  const filtered = filter === "all" ? apps : apps.filter(a => a.status === filter);

  function updateStatus(id: number, status: ApplicationStatus) {
    setApps(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ fontFamily: F.bold, fontSize: 24, color: C.text }}>Отклики</div>

      {/* Фильтры */}
      <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
        {STATUS_FILTERS.map(f => {
          const count = f.key === "all" ? apps.length : apps.filter(a => a.status === f.key).length;
          return (
            <button key={f.key} onClick={() => setFilter(f.key)} style={{
              padding: "8px 16px", borderRadius: 20, border: "none", cursor: "pointer",
              background: filter === f.key ? C.green : C.chip,
              color: filter === f.key ? "white" : C.text,
              fontFamily: F.regular, fontSize: 14, whiteSpace: "nowrap",
              display: "flex", alignItems: "center", gap: 6,
            }}>
              {f.label}
              <span style={{
                background: filter === f.key ? "rgba(255,255,255,0.3)" : C.border,
                borderRadius: 10, padding: "1px 8px", fontSize: 12,
              }}>{count}</span>
            </button>
          );
        })}
      </div>

      {/* Список */}
      {filtered.length === 0 ? (
        <EmptyState icon="📭" title="Нет откликов" subtitle="Отклики кандидатов на ваши вакансии появятся здесь" />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {filtered.map(app => (
            <Card key={app.id} onClick={() => navigate(`/employer/applications/${app.id}`)}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontFamily: F.semi, fontSize: 16, color: C.text }}>{app.candidateName}</span>
                    {app.candidateGradeConfirmed && <Icon.Verified size={16} />}
                  </div>
                  <div style={{ fontFamily: F.regular, fontSize: 13, color: C.sub, marginTop: 4 }}>
                    {app.vacancyTitle} · {app.candidateExperience} · {app.candidateCity}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontFamily: F.bold, fontSize: 18, color: app.matchPercent >= 85 ? C.green : C.amber }}>
                    {app.matchPercent}%
                  </div>
                  <StatusBadge
                    label={APPLICATION_STATUS_LABELS[app.status]}
                    color={APPLICATION_STATUS_COLORS[app.status]}
                  />
                </div>
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {app.candidateGrade > 0 && <Chip label={`${app.candidateGrade} разряд`} />}
                {app.admissions.slice(0, 2).map(a => <Chip key={a} label={a} />)}
                {app.admissions.length > 2 && <Chip label={`+${app.admissions.length - 2}`} />}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Детали отклика ──────────────────────────────────────────────────────────
export function EmployerApplicationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [apps, setApps] = useLocalStorage<EmployerApplication[]>("tcard:employer:applications", MOCK_EMPLOYER_APPLICATIONS);
  const app = apps.find(a => a.id === Number(id));

  if (!app) {
    return <EmptyState icon="🔍" title="Отклик не найден" subtitle="Возможно, данные были удалены" />;
  }

  function updateStatus(status: ApplicationStatus) {
    setApps(prev => prev.map(a => a.id === app!.id ? { ...a, status } : a));
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <button onClick={() => navigate("/employer/applications")} style={{
        background: "none", border: "none", cursor: "pointer",
        display: "flex", alignItems: "center", gap: 6, color: C.sub, alignSelf: "flex-start",
      }}>
        <Icon.ChevronLeft size={18} />
        <span style={{ fontFamily: F.regular, fontSize: 14 }}>К откликам</span>
      </button>

      {/* Шапка */}
      <Card>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
          <div style={{
            width: 56, height: 56, borderRadius: "50%", background: "#1a3a5c",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: F.bold, fontSize: 20, color: "white",
          }}>{app.candidateName.charAt(0)}</div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontFamily: F.semi, fontSize: 18, color: C.text }}>{app.candidateName}</span>
              {app.candidateGradeConfirmed && <Icon.Verified size={16} />}
            </div>
            <div style={{ fontFamily: F.regular, fontSize: 13, color: C.sub, marginTop: 4 }}>
              {app.vacancyTitle} · {app.date}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: F.bold, fontSize: 24, color: app.matchPercent >= 85 ? C.green : C.amber }}>
              {app.matchPercent}%
            </div>
            <div style={{ fontFamily: F.regular, fontSize: 11, color: C.sub }}>совпадение</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
          <div style={{ flex: 1, background: C.bg, borderRadius: 12, padding: 12 }}>
            <div style={{ fontFamily: F.regular, fontSize: 12, color: C.sub }}>Разряд</div>
            <div style={{ fontFamily: F.semi, fontSize: 16, color: C.text }}>
              {app.candidateGrade > 0 ? `${app.candidateGrade} разряд` : "Без разряда"}
            </div>
          </div>
          <div style={{ flex: 1, background: C.bg, borderRadius: 12, padding: 12 }}>
            <div style={{ fontFamily: F.regular, fontSize: 12, color: C.sub }}>Опыт</div>
            <div style={{ fontFamily: F.semi, fontSize: 16, color: C.text }}>{app.candidateExperience}</div>
          </div>
          <div style={{ flex: 1, background: C.bg, borderRadius: 12, padding: 12 }}>
            <div style={{ fontFamily: F.regular, fontSize: 12, color: C.sub }}>Город</div>
            <div style={{ fontFamily: F.semi, fontSize: 16, color: C.text }}>{app.candidateCity}</div>
          </div>
        </div>

        <StatusBadge
          label={APPLICATION_STATUS_LABELS[app.status]}
          color={APPLICATION_STATUS_COLORS[app.status]}
        />
      </Card>

      {/* Результаты оценок */}
      <Card>
        <SectionHeader title="Результаты оценок" />
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {app.assessments.map(a => (
            <div key={a.name}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontFamily: F.regular, fontSize: 14, color: C.text }}>{a.name}</span>
                <span style={{ fontFamily: F.semi, fontSize: 14, color: a.score >= 80 ? C.green : C.amber }}>{a.score}</span>
              </div>
              <ProgressBar value={a.score} color={a.score >= 80 ? C.green : C.amber} />
            </div>
          ))}
        </div>
      </Card>

      {/* Допуски */}
      <Card>
        <SectionHeader title="Допуски" />
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {app.admissions.map(a => <Chip key={a} label={a} color={C.green} />)}
        </div>
      </Card>

      {/* Действия */}
      <Card>
        <SectionHeader title="Действия" />
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {app.status === "pending" && (
            <>
              <GreenBtn label="Пригласить на собеседование" full icon={<Icon.Send size={16} />} onClick={() => updateStatus("invitation")} />
              <OutlineBtn label="Отклонить" full onClick={() => updateStatus("rejected")} />
            </>
          )}
          {app.status === "invitation" && (
            <>
              <GreenBtn label="Назначить собеседование" full icon={<Icon.Calendar size={16} />} onClick={() => updateStatus("interview")} />
              <OutlineBtn label="Отклонить" full onClick={() => updateStatus("rejected")} />
            </>
          )}
          {app.status === "interview" && (
            <>
              <GreenBtn label="Сделать оффер" full icon={<Icon.CheckCircle size={16} />} onClick={() => updateStatus("offer")} />
              <OutlineBtn label="Отклонить" full onClick={() => updateStatus("rejected")} />
            </>
          )}
          {app.status === "rejected" && (
            <OutlineBtn label="Вернуть в работу" full onClick={() => updateStatus("pending")} />
          )}
          {app.status === "offer" && (
            <div style={{
              background: `${C.green}10`, borderRadius: 14, padding: "14px 16px",
              display: "flex", alignItems: "center", gap: 10,
            }}>
              <Icon.CheckCircle size={20} color={C.green} />
              <span style={{ fontFamily: F.regular, fontSize: 14, color: C.green }}>Оффер отправлен кандидату</span>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
