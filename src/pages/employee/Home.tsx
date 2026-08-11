import React from "react";
import { useNavigate } from "react-router-dom";
import { C, F, MOCK_VACANCIES, MOCK_ASSESSMENTS } from "@/data/mockData";
import { Icon } from "@/components/icons/Icons";
import { Card, GreenBtn, OutlineBtn, Chip, SectionHeader } from "@/components/ui";
import { useApp } from "@/context/AppContext";

export function EmployeeHome() {
  const navigate = useNavigate();
  const { user, bookmarks, toggleBookmark } = useApp();
  const assignedAssessments = MOCK_ASSESSMENTS.filter(a => a.status === "assigned");
  const recommendedJobs = MOCK_VACANCIES.slice(0, 4);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Приветствие */}
      <div>
        <div style={{ fontFamily: F.bold, fontSize: 26, color: C.text, letterSpacing: "-0.5px" }}>
          Здравствуйте, {user.name.split(" ")[0]}!
        </div>
        <div style={{ fontFamily: F.regular, fontSize: 15, color: C.sub, marginTop: 4 }}>
          {user.specialty} · {user.grade} разряд
        </div>
      </div>

      {/* Быстрые действия */}
      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={() => navigate("/employee/notifications")} style={{
          flex: 1, background: "white", border: `1px solid ${C.border}`, borderRadius: 20,
          display: "flex", alignItems: "center", gap: 10, padding: "14px 18px",
          cursor: "pointer", boxShadow: "0 0 32px rgba(0,0,0,0.02)",
        }}>
          <Icon.Bell />
          <span style={{ fontFamily: F.regular, fontSize: 14, color: C.muted }}>Уведомления</span>
          <span style={{
            background: C.red, color: "white", fontSize: 11, borderRadius: 10,
            padding: "2px 8px", fontFamily: F.semi,
          }}>2</span>
        </button>
        <button onClick={() => navigate("/employee/resumes")} style={{
          flex: 1, background: "white", border: `1px solid ${C.border}`, borderRadius: 20,
          display: "flex", alignItems: "center", gap: 10, padding: "14px 18px",
          cursor: "pointer", boxShadow: "0 0 32px rgba(0,0,0,0.02)",
        }}>
          <Icon.Folder />
          <span style={{ fontFamily: F.regular, fontSize: 14, color: C.muted }}>Резюме</span>
        </button>
      </div>

      {/* Ближайшее событие */}
      <Card active>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 12 }}>
          <div style={{
            width: 44, height: 44, background: `${C.green}14`, borderRadius: 12,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Icon.Calendar size={22} />
          </div>
          <div>
            <div style={{ fontFamily: F.semi, fontSize: 16, color: C.text }}>Собеседование</div>
            <div style={{ fontFamily: F.regular, fontSize: 13, color: C.sub }}>22 января 2025, 14:00</div>
          </div>
        </div>
        <div style={{ fontFamily: F.regular, fontSize: 14, color: C.muted, marginBottom: 14 }}>
          ПромТех Решения — Оператор ЧПУ
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <GreenBtn label="Подготовиться" onClick={() => navigate("/employee/applications/1")} />
          <OutlineBtn label="Перенести" />
        </div>
      </Card>

      {/* Приглашение к оценке */}
      {assignedAssessments.length > 0 && (
        <Card style={{ border: `2px solid ${C.amber}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 12 }}>
            <div style={{
              width: 44, height: 44, background: `${C.amber}18`, borderRadius: 12,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Icon.Award size={22} color={C.amber} />
            </div>
            <div>
              <div style={{ fontFamily: F.semi, fontSize: 16, color: C.text }}>Назначена оценка компетенций</div>
              <div style={{ fontFamily: F.regular, fontSize: 13, color: C.sub }}>
                {assignedAssessments[0].title} · Срок: {assignedAssessments[0].deadline}
              </div>
            </div>
          </div>
          <GreenBtn label="Пройти оценку" onClick={() => navigate("/employee/assessments")} />
        </Card>
      )}

      {/* Подобранные вакансии */}
      <section>
        <SectionHeader
          title="Подобранные вакансии"
          subtitle="Основаны на вашем разряде и допусках"
          action={<button onClick={() => navigate("/employee/vacancies")} style={{
            fontFamily: F.regular, fontSize: 14, color: C.green,
            background: "none", border: "none", cursor: "pointer",
          }}>Все</button>}
        />
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {recommendedJobs.map(job => (
            <Card key={job.id} onClick={() => navigate(`/employee/vacancies/${job.id}`)}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <div>
                  <div style={{ fontFamily: F.semi, fontSize: 16, color: C.text, lineHeight: "22px" }}>{job.title}</div>
                  <div style={{ fontFamily: F.regular, fontSize: 13, color: C.sub }}>{job.company}</div>
                </div>
                <button onClick={(e) => { e.stopPropagation(); toggleBookmark(job.id); }} style={{
                  background: "none", border: "none", cursor: "pointer", padding: 2,
                }}>
                  <Icon.Bookmark active={bookmarks.includes(job.id)} />
                </button>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 8 }}>
                <Icon.Location />
                <span style={{ fontFamily: F.regular, fontSize: 14, color: C.green }}>{job.city}</span>
                <span style={{ fontFamily: F.regular, fontSize: 13, color: C.sub, marginLeft: 8 }}>{job.experience}</span>
              </div>
              <div style={{ fontFamily: F.regular, fontSize: 15, color: C.text }}>
                ₽ {job.salaryFrom.toLocaleString()} – {job.salaryTo.toLocaleString()}
                <span style={{ color: C.green }}>/месяц</span>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
                <Chip label={`${job.grade} разряд`} color={C.green} />
                <Chip label={job.shift} />
                {job.admissions.slice(0, 2).map(a => <Chip key={a} label={a} />)}
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Баннер помощи */}
      <div style={{
        background: `linear-gradient(135deg, ${C.blue} 0%, #4a9eff 100%)`,
        borderRadius: 24, padding: "28px 32px", display: "flex",
        alignItems: "center", justifyContent: "space-between",
      }}>
        <div>
          <div style={{ fontFamily: F.bold, fontSize: 20, color: "white", marginBottom: 6 }}>
            Нужна помощь с работой?
          </div>
          <div style={{ fontFamily: F.regular, fontSize: 14, color: "rgba(255,255,255,0.82)", marginBottom: 16 }}>
            Запишитесь на консультацию с карьерным специалистом
          </div>
          <button style={{
            background: "white", color: C.blue, fontFamily: F.semi, fontSize: 14,
            borderRadius: 20, padding: "10px 22px", border: "none", cursor: "pointer",
          }}>Записаться на консультацию</button>
        </div>
        <div style={{ fontSize: 48 }}>📋</div>
      </div>
    </div>
  );
}
