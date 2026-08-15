import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  C, F, MOCK_EMPLOYER_APPLICATIONS,
  APPLICATION_STATUS_LABELS, APPLICATION_STATUS_COLORS,
  INTERVIEW_FORMAT_LABELS, INTERVIEW_STATUS_LABELS, INTERVIEW_STATUS_COLORS,
  TIMELINE_EVENT_LABELS,
} from "@/data/mockData";
import { Icon } from "@/components/icons/Icons";
import { Card, GreenBtn, OutlineBtn, StatusBadge, EmptyState, SectionHeader, Chip, ProgressBar, Input, Select } from "@/components/ui";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import type { ApplicationStatus, InterviewFormat, InterviewStatus, TimelineEvent } from "@/types";
import type { EmployerApplication } from "@/data/mockData";

const STATUS_FILTERS: { key: ApplicationStatus | "all"; label: string }[] = [
  { key: "all", label: "Все" },
  { key: "pending", label: "Ожидание" },
  { key: "interview", label: "Собеседование" },
  { key: "rejected", label: "Отказ" },
  { key: "hired", label: "Нанятые" },
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

  // Interview form state
  const [showInterviewForm, setShowInterviewForm] = useState(false);
  const [intDate, setIntDate] = useState(app?.interview?.date ?? "");
  const [intTime, setIntTime] = useState(app?.interview?.time ?? "");
  const [intFormat, setIntFormat] = useState<InterviewFormat>(app?.interview?.format ?? "offline");
  const [intAddress, setIntAddress] = useState(app?.interview?.address ?? "");
  const [intComment, setIntComment] = useState(app?.interview?.comment ?? "");

  // Offer form state — removed

  // Chat state
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ author: "employer" | "candidate"; text: string; time: string }[]>([]);
  const [chatInput, setChatInput] = useState("");

  if (!app) {
    return <EmptyState icon="🔍" title="Отклик не найден" subtitle="Возможно, данные были удалены" />;
  }

  function updateApp(updater: (a: EmployerApplication) => EmployerApplication) {
    setApps(prev => prev.map(a => a.id === app!.id ? updater(a) : a));
  }

  function updateStatus(status: ApplicationStatus) {
    const eventType: TimelineEvent["type"] = status === "rejected" ? "rejected" : status === "hired" ? "hired" : "status_changed";
    const eventComment = status === "invitation" ? "Приглашение на собеседование"
      : status === "interview" ? "Собеседование назначено"
      : status === "hired" ? "Кандидат нанят"
      : status === "rejected" ? "Отклонено"
      : "Возвращён в работу";
    updateApp(a => ({
      ...a,
      status,
      timeline: [...a.timeline, {
        id: Date.now(),
        type: eventType,
        author: "Анна Смирнова",
        timestamp: new Date().toLocaleString("ru-RU"),
        comment: eventComment,
      }],
    }));
    if (status === "invitation") {
      setShowChat(true);
      setChatMessages([{ author: "employer", text: "Здравствуйте! Приглашаем вас на собеседование.", time: new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" }) }]);
    }
  }

  function scheduleInterview() {
    if (!intDate || !intTime) return;
    updateApp(a => ({
      ...a,
      status: "interview",
      interview: {
        date: intDate, time: intTime, format: intFormat,
        address: intAddress, comment: intComment, status: "scheduled",
      },
      timeline: [...a.timeline, {
        id: Date.now(),
        type: "interview_scheduled",
        author: "Анна Смирнова",
        timestamp: new Date().toLocaleString("ru-RU"),
        comment: `Назначено собеседование на ${intDate} ${intTime} (${INTERVIEW_FORMAT_LABELS[intFormat].toLowerCase()})`,
      }],
    }));
    setShowInterviewForm(false);
  }

  function updateInterviewStatus(status: InterviewStatus) {
    const eventType: TimelineEvent["type"] =
      status === "confirmed" ? "interview_confirmed"
      : status === "rescheduled" ? "interview_rescheduled"
      : status === "no_show" ? "interview_no_show"
      : status === "cancelled" ? "interview_cancelled"
      : "interview_completed";
    const label = INTERVIEW_STATUS_LABELS[status];
    updateApp(a => ({
      ...a,
      interview: a.interview ? { ...a.interview, status } : a.interview,
      timeline: [...a.timeline, {
        id: Date.now(),
        type: eventType,
        author: "Анна Смирнова",
        timestamp: new Date().toLocaleString("ru-RU"),
        comment: `Статус собеседования: ${label.toLowerCase()}`,
      }],
    }));
  }

  function sendChatMessage() {
    if (!chatInput.trim()) return;
    const time = new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
    setChatMessages(prev => [...prev, { author: "employer", text: chatInput.trim(), time }]);
    setChatInput("");
  }

  const interview = app.interview;

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

      {/* Собеседование */}
      {interview && !showInterviewForm && (
        <Card>
          <SectionHeader
            title="Собеседование"
            action={
              <button onClick={() => { setShowInterviewForm(true); }} style={{
                background: "none", border: "none", cursor: "pointer",
                color: C.green, fontFamily: F.regular, fontSize: 14,
              }}>Перенести</button>
            }
          />
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Icon.Calendar size={20} color={C.green} />
              <div>
                <div style={{ fontFamily: F.semi, fontSize: 15, color: C.text }}>{interview.date} в {interview.time}</div>
                <div style={{ fontFamily: F.regular, fontSize: 13, color: C.sub }}>{INTERVIEW_FORMAT_LABELS[interview.format]}</div>
              </div>
            </div>
            {interview.address && (
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <Icon.Location size={20} color={C.sub} />
                <span style={{ fontFamily: F.regular, fontSize: 14, color: C.text }}>{interview.address}</span>
              </div>
            )}
            {interview.comment && (
              <div style={{
                background: C.bg, borderRadius: 12, padding: "12px 14px",
                fontFamily: F.regular, fontSize: 14, color: C.muted,
              }}>{interview.comment}</div>
            )}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
              <StatusBadge
                label={INTERVIEW_STATUS_LABELS[interview.status]}
                color={INTERVIEW_STATUS_COLORS[interview.status]}
              />
            </div>

            {/* Кнопки статусов собеседования */}
            {interview.status !== "completed" && interview.status !== "cancelled" && (
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
                <button onClick={() => updateInterviewStatus("confirmed")} style={{
                  padding: "8px 16px", borderRadius: 20, border: "none", cursor: "pointer",
                  background: `${C.green}15`, color: C.green,
                  fontFamily: F.regular, fontSize: 13,
                }}>Подтверждено</button>
                <button onClick={() => { setShowInterviewForm(true); }} style={{
                  padding: "8px 16px", borderRadius: 20, border: "none", cursor: "pointer",
                  background: `${C.amber}15`, color: C.amber,
                  fontFamily: F.regular, fontSize: 13,
                }}>Перенести</button>
                <button onClick={() => updateInterviewStatus("no_show")} style={{
                  padding: "8px 16px", borderRadius: 20, border: "none", cursor: "pointer",
                  background: `${C.red}15`, color: C.red,
                  fontFamily: F.regular, fontSize: 13,
                }}>Не явился</button>
                <button onClick={() => updateInterviewStatus("cancelled")} style={{
                  padding: "8px 16px", borderRadius: 20, border: "none", cursor: "pointer",
                  background: `${C.gray}15`, color: C.gray,
                  fontFamily: F.regular, fontSize: 13,
                }}>Отмена</button>
                <button onClick={() => updateInterviewStatus("completed")} style={{
                  padding: "8px 16px", borderRadius: 20, border: "none", cursor: "pointer",
                  background: `${C.green}15`, color: C.green,
                  fontFamily: F.regular, fontSize: 13,
                }}>Завершено</button>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Форма планирования собеседования */}
      {showInterviewForm && (
        <Card>
          <SectionHeader title={interview ? "Перенос собеседования" : "Назначить собеседование"} />
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Input label="Дата" value={intDate} onChange={setIntDate} placeholder="22 января 2025" />
              <Input label="Время" value={intTime} onChange={setIntTime} placeholder="14:00" />
            </div>
            <Select
              label="Формат"
              value={intFormat}
              onChange={(v) => setIntFormat(v as InterviewFormat)}
              options={(Object.keys(INTERVIEW_FORMAT_LABELS) as InterviewFormat[]).map(k => ({
                value: k, label: INTERVIEW_FORMAT_LABELS[k],
              }))}
            />
            <Input label="Адрес / ссылка" value={intAddress} onChange={setIntAddress} placeholder="ул. Промышленная, 15, переговорная №3" />
            <div>
              <div style={{ fontFamily: F.semi, fontSize: 14, color: C.text, marginBottom: 8 }}>Комментарий кандидату</div>
              <textarea
                value={intComment} onChange={e => setIntComment(e.target.value)}
                placeholder="Возьмите паспорт и удостоверение"
                style={{
                  width: "100%", minHeight: 80, padding: "14px 16px",
                  background: C.bg, border: `1px solid ${C.border}`, borderRadius: 14,
                  fontFamily: F.regular, fontSize: 15, color: C.text, resize: "vertical",
                  outline: "none",
                }}
              />
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <GreenBtn label={interview ? "Перенести" : "Назначить"} full onClick={scheduleInterview} disabled={!intDate || !intTime} />
              <OutlineBtn label="Отмена" onClick={() => setShowInterviewForm(false)} />
            </div>
          </div>
        </Card>
      )}

      {/* Чат с кандидатом */}
      {showChat && (
        <Card>
          <SectionHeader
            title="Чат с кандидатом"
            action={
              <button onClick={() => setShowChat(false)} style={{
                background: "none", border: "none", cursor: "pointer",
                color: C.sub, fontFamily: F.regular, fontSize: 14,
              }}>Закрыть</button>
            }
          />
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ maxHeight: 300, overflowY: "auto", display: "flex", flexDirection: "column", gap: 8, padding: "4px 0" }}>
              {chatMessages.map((msg, i) => (
                <div key={i} style={{
                  alignSelf: msg.author === "employer" ? "flex-end" : "flex-start",
                  maxWidth: "80%",
                }}>
                  <div style={{
                    background: msg.author === "employer" ? C.green : C.bg,
                    color: msg.author === "employer" ? "white" : C.text,
                    borderRadius: 14, padding: "10px 14px",
                    fontFamily: F.regular, fontSize: 14,
                  }}>{msg.text}</div>
                  <div style={{ fontFamily: F.regular, fontSize: 11, color: C.sub, marginTop: 2, textAlign: msg.author === "employer" ? "right" : "left" }}>{msg.time}</div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") sendChatMessage(); }}
                placeholder="Введите сообщение..."
                style={{
                  flex: 1, padding: "12px 16px", background: C.bg,
                  border: `1px solid ${C.border}`, borderRadius: 14,
                  fontFamily: F.regular, fontSize: 15, color: C.text, outline: "none",
                }}
              />
              <GreenBtn label="Отправить" onClick={sendChatMessage} disabled={!chatInput.trim()} />
            </div>
          </div>
        </Card>
      )}

      {/* Таймлайн событий */}
      <Card>
        <SectionHeader title="История событий" />
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {[...app.timeline].reverse().map((evt, idx) => (
            <div key={evt.id} style={{
              display: "flex", gap: 12, paddingBottom: idx < app.timeline.length - 1 ? 16 : 0,
              position: "relative",
            }}>
              {/* Vertical line */}
              {idx < app.timeline.length - 1 && (
                <div style={{
                  position: "absolute", left: 7, top: 24, bottom: 0,
                  width: 2, background: C.border,
                }} />
              )}
              {/* Dot */}
              <div style={{
                width: 16, height: 16, borderRadius: "50%", flexShrink: 0,
                background: evt.type === "rejected" ? C.red
                  : evt.type === "interview_no_show" ? C.red
                  : evt.type === "interview_cancelled" ? C.gray
                  : evt.type === "hired" ? C.green
                  : evt.type === "interview_completed" ? C.green
                  : evt.type === "interview_confirmed" ? C.green
                  : C.blue,
                marginTop: 4, zIndex: 1,
                border: `3px solid ${C.card}`,
                boxShadow: `0 0 0 2px ${C.border}`,
              }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: F.semi, fontSize: 14, color: C.text }}>
                  {TIMELINE_EVENT_LABELS[evt.type] ?? evt.type}
                </div>
                {evt.comment && (
                  <div style={{ fontFamily: F.regular, fontSize: 13, color: C.muted, marginTop: 2 }}>
                    {evt.comment}
                  </div>
                )}
                <div style={{ fontFamily: F.regular, fontSize: 12, color: C.sub, marginTop: 4 }}>
                  {evt.author} · {evt.timestamp}
                </div>
              </div>
            </div>
          ))}
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
          {app.status === "invitation" && !interview && (
            <>
              <GreenBtn label="Назначить собеседование" full icon={<Icon.Calendar size={16} />} onClick={() => setShowInterviewForm(true)} />
              <OutlineBtn label="Отклонить" full onClick={() => updateStatus("rejected")} />
            </>
          )}
          {app.status === "invitation" && interview && (
            <>
              <GreenBtn label="Перейти к собеседованию" full icon={<Icon.Calendar size={16} />} onClick={() => updateStatus("interview")} />
              <OutlineBtn label="Отклонить" full onClick={() => updateStatus("rejected")} />
            </>
          )}
          {app.status === "interview" && !interview && (
            <>
              <GreenBtn label="Назначить собеседование" full icon={<Icon.Calendar size={16} />} onClick={() => setShowInterviewForm(true)} />
              <OutlineBtn label="Отклонить" full onClick={() => updateStatus("rejected")} />
            </>
          )}
          {app.status === "interview" && interview && (
            <>
              <GreenBtn label="Нанять" full icon={<Icon.CheckCircle size={16} />} onClick={() => updateStatus("hired")} />
              <OutlineBtn label="Отклонить" full onClick={() => updateStatus("rejected")} />
            </>
          )}
          {app.status === "rejected" && (
            <OutlineBtn label="Вернуть в работу" full onClick={() => updateStatus("pending")} />
          )}
          {app.status === "hired" && (
            <div style={{
              background: `${C.green}10`, borderRadius: 14, padding: "14px 16px",
              display: "flex", alignItems: "center", gap: 10,
            }}>
              <Icon.CheckCircle size={20} color={C.green} />
              <span style={{ fontFamily: F.regular, fontSize: 14, color: C.green }}>Кандидат нанят</span>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
