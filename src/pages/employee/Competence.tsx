import React from "react";
import { useNavigate } from "react-router-dom";
import { C, F, MOCK_CERTIFICATES, MOCK_TRACKS } from "@/data/mockData";
import { Icon } from "@/components/icons/Icons";
import { Card, GreenBtn, OutlineBtn, Chip, SectionHeader, ProgressBar, KPITile, StatusBadge } from "@/components/ui";
import { useApp } from "@/context/AppContext";

export function CompetenceProfile() {
  const navigate = useNavigate();
  const { user } = useApp();

  const competencies = [
    { name: "Наладка оборудования", score: 92, confirmed: true },
    { name: "Чтение чертежей", score: 78, confirmed: true },
    { name: "Программирование ЧПУ", score: 85, confirmed: true },
    { name: "Охрана труда", score: 96, confirmed: true },
    { name: "Контроль качества", score: 70, confirmed: false },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Шапка профиля */}
      <Card>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
          <div style={{
            width: 64, height: 64, borderRadius: "50%", background: `${C.green}20`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: F.bold, fontSize: 24, color: C.green,
          }}>{user.name.charAt(0)}</div>
          <div>
            <div style={{ fontFamily: F.semi, fontSize: 20, color: C.text }}>{user.name}</div>
            <div style={{ fontFamily: F.regular, fontSize: 14, color: C.sub }}>
              {user.specialty} · {user.grade} разряд · {user.city}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <OutlineBtn label="Редактировать" onClick={() => navigate("/employee/settings")} />
          <OutlineBtn label="Мои резюме" onClick={() => navigate("/employee/resumes")} />
        </div>
      </Card>

      {/* KPI */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
        <KPITile value={String(user.grade)} label="Подтверждённый разряд" color={C.green} />
        <KPITile value="4" label="Пройденные оценки" />
        <KPITile value="87" label="Средний балл" />
      </div>

      {/* Компетенции */}
      <Card>
        <SectionHeader title="Компетенции" subtitle="Оценены по результатам тестов и производственных кейсов" />
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {competencies.map(c => (
            <div key={c.name}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontFamily: F.regular, fontSize: 14, color: C.text }}>{c.name}</span>
                  {c.confirmed && <Icon.Verified />}
                </div>
                <span style={{ fontFamily: F.semi, fontSize: 14, color: c.score >= 80 ? C.green : C.amber }}>{c.score}</span>
              </div>
              <ProgressBar value={c.score} color={c.score >= 80 ? C.green : C.amber} />
            </div>
          ))}
        </div>
      </Card>

      {/* Допуски */}
      <Card>
        <SectionHeader title="Допуски" />
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          <Chip label="Электробезопасность II" color={C.green} />
          <Chip label="Работы на высоте" color={C.green} />
          <Chip label="Стропальщик" color={C.green} />
        </div>
      </Card>

      {/* Сертификаты */}
      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div style={{ fontFamily: F.semi, fontSize: 16, color: C.text }}>Сертификаты</div>
          <button onClick={() => navigate("/employee/certificates")} style={{
            fontFamily: F.regular, fontSize: 14, color: C.green,
            background: "none", border: "none", cursor: "pointer",
          }}>Все</button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {MOCK_CERTIFICATES.map(cert => (
            <div key={cert.id} style={{
              display: "flex", alignItems: "center", gap: 12, padding: "12px 16px",
              background: C.bg, borderRadius: 14,
            }}>
              <Icon.Award size={20} />
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: F.semi, fontSize: 14, color: C.text }}>{cert.title}</div>
                <div style={{ fontFamily: F.regular, fontSize: 12, color: C.sub }}>
                  Выдан: {cert.issueDate}
                  {cert.expiryDate !== "permanent" && ` · Действует до: ${cert.expiryDate}`}
                  {cert.expiryDate === "permanent" && " · Бессрочно"}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Трек развития */}
      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div style={{ fontFamily: F.semi, fontSize: 16, color: C.text }}>Трек развития</div>
          <button onClick={() => navigate("/employee/development")} style={{
            fontFamily: F.regular, fontSize: 14, color: C.green,
            background: "none", border: "none", cursor: "pointer",
          }}>Все</button>
        </div>
        {MOCK_TRACKS.map(track => (
          <div key={track.id}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <span style={{ fontFamily: F.semi, fontSize: 14, color: C.text }}>{track.goal}</span>
              {track.assignedByEmployer && <StatusBadge label="От работодателя" color={C.blue} />}
            </div>
            <ProgressBar value={track.progress} />
            <div style={{ fontFamily: F.regular, fontSize: 12, color: C.sub, marginTop: 6 }}>
              Дедлайн: {track.deadline}
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}
