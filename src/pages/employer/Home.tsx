import React from "react";
import { useNavigate } from "react-router-dom";
import { C, F, MOCK_EMPLOYER_VACANCIES, MOCK_EMPLOYER_APPLICATIONS, MOCK_ANALYTICS, MOCK_COMPANY } from "@/data/mockData";
import { Icon } from "@/components/icons/Icons";
import { Card, GreenBtn, OutlineBtn, StatusBadge, SectionHeader, KPITile, ProgressBar } from "@/components/ui";
import { useApp } from "@/context/AppContext";

export function EmployerHome() {
  const navigate = useNavigate();
  const { user } = useApp();

  const activeVacancies = MOCK_EMPLOYER_VACANCIES.filter(v => v.active);
  const newApplications = MOCK_EMPLOYER_APPLICATIONS.filter(a => a.status === "pending");
  const interviewApps = MOCK_EMPLOYER_APPLICATIONS.filter(a => a.status === "interview");
  const totalViews = MOCK_EMPLOYER_VACANCIES.reduce((s, v) => s + v.views, 0);
  const totalResponses = MOCK_EMPLOYER_VACANCIES.reduce((s, v) => s + v.responses, 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Приветствие */}
      <div>
        <div style={{ fontFamily: F.regular, fontSize: 14, color: C.sub, marginBottom: 4 }}>
          {new Date().toLocaleDateString("ru-RU", { weekday: "long", day: "numeric", month: "long" })}
        </div>
        <div style={{ fontFamily: F.bold, fontSize: 26, color: C.text, letterSpacing: "-0.5px" }}>
          Здравствуйте, {user.name.split(" ")[0]}!
        </div>
      </div>

      {/* KPI */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12 }}>
        <KPITile value={String(activeVacancies.length)} label="Активных вакансий" color={C.green} />
        <KPITile value={String(newApplications.length)} label="Новых откликов" color={C.amber} />
        <KPITile value={String(interviewApps.length)} label="На собеседовании" color={C.blue} />
        <KPITile value={String(totalViews)} label="Просмотров за неделю" />
      </div>

      {/* Быстрые действия */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <GreenBtn label="Создать вакансию" icon={<Icon.Plus size={18} />} onClick={() => navigate("/employer/vacancies/new")} />
        <OutlineBtn label="Искать кандидатов" icon={<Icon.Search size={18} />} onClick={() => navigate("/employer/candidates")} />
        <OutlineBtn label="Аналитика" icon={<Icon.Chart size={18} />} onClick={() => navigate("/employer/analytics")} />
      </div>

      {/* Новые отклики */}
      <section>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div style={{ fontFamily: F.semi, fontSize: 18, color: C.text }}>Новые отклики</div>
          <button onClick={() => navigate("/employer/applications")} style={{
            background: "none", border: "none", cursor: "pointer",
            fontFamily: F.regular, fontSize: 14, color: C.green,
          }}>Все</button>
        </div>
        {newApplications.length === 0 ? (
          <Card style={{ textAlign: "center", padding: 32 }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>📭</div>
            <div style={{ fontFamily: F.regular, fontSize: 14, color: C.sub }}>Нет новых откликов</div>
          </Card>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {newApplications.map(app => (
              <Card key={app.id} onClick={() => navigate(`/employer/applications/${app.id}`)}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontFamily: F.semi, fontSize: 16, color: C.text }}>{app.candidateName}</span>
                      {app.candidateGradeConfirmed && <Icon.Verified size={16} />}
                    </div>
                    <div style={{ fontFamily: F.regular, fontSize: 13, color: C.sub, marginTop: 4 }}>
                      {app.vacancyTitle} · {app.candidateExperience}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontFamily: F.bold, fontSize: 20, color: app.matchPercent >= 85 ? C.green : C.amber }}>
                      {app.matchPercent}%
                    </div>
                    <div style={{ fontFamily: F.regular, fontSize: 11, color: C.sub }}>совпадение</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <span style={{ fontFamily: F.regular, fontSize: 13, color: C.sub }}>
                    {app.candidateGrade > 0 ? `${app.candidateGrade} разряд` : "Без разряда"} · {app.candidateCity}
                  </span>
                  <StatusBadge label="Новый" color={C.amber} />
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Активные вакансии */}
      <section>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div style={{ fontFamily: F.semi, fontSize: 18, color: C.text }}>Активные вакансии</div>
          <button onClick={() => navigate("/employer/vacancies")} style={{
            background: "none", border: "none", cursor: "pointer",
            fontFamily: F.regular, fontSize: 14, color: C.green,
          }}>Все</button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {activeVacancies.map(v => (
            <Card key={v.id} onClick={() => navigate(`/employer/vacancies/${v.id}`)}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontFamily: F.semi, fontSize: 16, color: C.text }}>{v.title}</div>
                  <div style={{ fontFamily: F.regular, fontSize: 13, color: C.sub, marginTop: 4 }}>
                    {v.department} · {v.shift}
                  </div>
                </div>
                <StatusBadge label="Активна" color={C.green} />
              </div>
              <div style={{ display: "flex", gap: 20, marginTop: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <Icon.Search size={16} />
                  <span style={{ fontFamily: F.regular, fontSize: 13, color: C.sub }}>{v.views}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <Icon.Folder size={16} />
                  <span style={{ fontFamily: F.regular, fontSize: 13, color: C.sub }}>{v.responses}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <Icon.Wallet size={16} />
                  <span style={{ fontFamily: F.regular, fontSize: 13, color: C.sub }}>
                    ₽ {v.salaryFrom.toLocaleString()} – {v.salaryTo.toLocaleString()}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* График просмотров (простой) */}
      <Card>
        <SectionHeader title="Просмотры и отклики за неделю" />
        <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 120, padding: "0 4px" }}>
          {MOCK_ANALYTICS.viewsByDay.map(d => {
            const maxViews = Math.max(...MOCK_ANALYTICS.viewsByDay.map(x => x.views));
            const h = (d.views / maxViews) * 100;
            return (
              <div key={d.day} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <div style={{ fontFamily: F.regular, fontSize: 10, color: C.sub }}>{d.views}</div>
                <div style={{
                  width: "100%", height: `${h}%`, background: C.green, borderRadius: "4px 4px 0 0",
                  minHeight: 4, opacity: 0.85,
                }} />
                <div style={{ fontFamily: F.regular, fontSize: 10, color: C.sub }}>{d.day}</div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Баннер компании */}
      <Card style={{ background: `linear-gradient(135deg, #1a3a5c 0%, #2d5a87 100%)`, border: "none" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{
            width: 56, height: 56, background: "rgba(255,255,255,0.15)", borderRadius: 14,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Icon.Building size={28} color="#ffffff" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontFamily: F.semi, fontSize: 18, color: "white" }}>{MOCK_COMPANY.name}</span>
              {MOCK_COMPANY.verified && <Icon.Verified size={18} />}
            </div>
            <div style={{ fontFamily: F.regular, fontSize: 13, color: "rgba(255,255,255,0.8)", marginTop: 4 }}>
              {MOCK_COMPANY.industry} · Рейтинг {MOCK_COMPANY.rating}
            </div>
          </div>
          <button onClick={() => navigate("/employer/company")} style={{
            background: "rgba(255,255,255,0.2)", border: "none", borderRadius: 12,
            padding: "10px 16px", cursor: "pointer", color: "white",
            fontFamily: F.regular, fontSize: 13,
          }}>Профиль</button>
        </div>
      </Card>
    </div>
  );
}
