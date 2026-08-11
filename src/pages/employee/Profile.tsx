import React from "react";
import { useNavigate } from "react-router-dom";
import { C, F } from "@/data/mockData";
import { Icon } from "@/components/icons/Icons";
import { Card, GreenBtn, OutlineBtn, SectionHeader, Chip } from "@/components/ui";
import { useApp } from "@/context/AppContext";

export function EmployeeProfile() {
  const navigate = useNavigate();
  const { user, resumes } = useApp();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Шапка профиля */}
      <Card>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{
            width: 72, height: 72, borderRadius: "50%", background: `${C.green}20`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: F.semi, fontSize: 28, color: C.green,
          }}>
            {user.name.charAt(0)}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: F.bold, fontSize: 22, color: C.text, letterSpacing: "-0.4px" }}>{user.name}</div>
            <div style={{ fontFamily: F.regular, fontSize: 14, color: C.sub, marginTop: 4 }}>
              {(user.specialty ?? "Специальность не указана")} {user.grade ? `· ${user.grade} разряд` : ""} {user.city ? `· ${user.city}` : ""}
            </div>
          </div>
          <OutlineBtn label="Редактировать" onClick={() => navigate("/employee/settings")}/>
        </div>
      </Card>

      {/* Быстрые действия */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <GreenBtn label="Обновить резюме" onClick={() => navigate(resumes.length ? `/employee/resumes/${resumes[0].id}` : "/employee/resumes/new")} />
        <OutlineBtn label="Мои отклики" onClick={() => navigate("/employee/applications")}/>
        <OutlineBtn label="Оценка" onClick={() => navigate("/employee/assessments")} />
      </div>

      {/* Резюме */}
      <Card>
        <SectionHeader title="Мои резюме" action={
          <button onClick={() => navigate("/employee/resumes")} style={{ background: "none", border: "none", cursor: "pointer", color: C.green, fontFamily: F.regular, fontSize: 14 }}>Все</button>
        }/>
        {resumes.length === 0 ? (
          <div style={{ fontFamily: F.regular, fontSize: 14, color: C.sub }}>У вас пока нет резюме. Создайте первое — это займет 2–3 минуты.</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {resumes.slice(0, 2).map(r => (
              <div key={r.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontFamily: F.semi, fontSize: 15, color: C.text }}>{r.specialty}</div>
                  <div style={{ fontFamily: F.regular, fontSize: 13, color: C.sub, marginTop: 2 }}>
                    {r.experience} · ₽ {r.salaryFrom.toLocaleString()} – {r.salaryTo.toLocaleString()} · {r.city}
                  </div>
                </div>
                <Chip label={r.active ? "Активно" : "Скрыто"} color={r.active ? C.green : C.gray} />
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Подсказки */}
      <Card>
        <SectionHeader title="Советы по профилю" />
        <ul style={{ margin: 0, paddingLeft: 18, color: C.sub }}>
          <li style={{ marginBottom: 6, fontFamily: F.regular, fontSize: 14 }}>Заполните специальность и разряд — так работодатели быстрее вас найдут</li>
          <li style={{ marginBottom: 6, fontFamily: F.regular, fontSize: 14 }}>Добавьте опыт и желаемую зарплату в резюме</li>
          <li style={{ fontFamily: F.regular, fontSize: 14 }}>Пройдите оценку, чтобы подтвердить квалификацию</li>
        </ul>
      </Card>
    </div>
  );
}
