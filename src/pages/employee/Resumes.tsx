import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { C, F, SPECIALTIES, SHIFTS } from "@/data/mockData";
import { Icon } from "@/components/icons/Icons";
import { Card, GreenBtn, OutlineBtn, Chip, Input, Select, EmptyState, SuccessScreen, StatusBadge, SectionHeader, KPITile, Toggle } from "@/components/ui";
import { useApp } from "@/context/AppContext";
import type { Resume } from "@/types";

export function ResumeList() {
  const navigate = useNavigate();
  const { resumes } = useApp();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {resumes.length === 0 ? (
        <EmptyState
          icon="📄"
          title="Резюме пока нет"
          subtitle="Создайте резюме за пару минут — укажите специальность, разряд и допуски"
          action={<GreenBtn label="Создать резюме" onClick={() => navigate("/employee/resumes/new")} />}
        />
      ) : (
        <>
          {/* KPI */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
            <KPITile value={String(resumes.reduce((s, r) => s + r.stats.views, 0))} label="Просмотры" />
            <KPITile value={String(resumes.reduce((s, r) => s + r.stats.responses, 0))} label="Отклики" />
            <KPITile value={String(resumes.reduce((s, r) => s + r.stats.favorites, 0))} label="В избранном" />
          </div>

          {/* Список */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {resumes.map(r => (
              <Card key={r.id}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                  <div>
                    <div style={{ fontFamily: F.semi, fontSize: 17, color: C.text }}>{r.specialty}</div>
                    <div style={{ fontFamily: F.regular, fontSize: 13, color: C.sub, marginTop: 4 }}>
                      {r.experience} · {r.city}
                    </div>
                  </div>
                  <StatusBadge label={r.active ? "Активно" : "Скрыто"} color={r.active ? C.green : C.gray} />
                </div>
                <div style={{ fontFamily: F.regular, fontSize: 15, color: C.text, marginBottom: 12 }}>
                  ₽ {r.salaryFrom.toLocaleString()} – {r.salaryTo.toLocaleString()}
                  <span style={{ color: C.green }}>/месяц</span>
                </div>
                <div style={{ display: "flex", gap: 16, marginBottom: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <Icon.Search size={16} />
                    <span style={{ fontFamily: F.regular, fontSize: 13, color: C.sub }}>{r.stats.views}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <Icon.Briefcase size={16} />
                    <span style={{ fontFamily: F.regular, fontSize: 13, color: C.sub }}>{r.stats.responses}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <Icon.Bookmark size={16} />
                    <span style={{ fontFamily: F.regular, fontSize: 13, color: C.sub }}>{r.stats.favorites}</span>
                  </div>
                </div>
                <div style={{ fontFamily: F.regular, fontSize: 12, color: C.sub, marginBottom: 12 }}>
                  Обновлено: {r.updatedAt}
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <OutlineBtn label="Редактировать" onClick={() => navigate(`/employee/resumes/${r.id}`)} />
                  <OutlineBtn label="Поднять в поиске" icon={<Icon.ChevronRight size={14} />} />
                </div>
              </Card>
            ))}
          </div>

          <GreenBtn label="Создать резюме" full onClick={() => navigate("/employee/resumes/new")} icon={<Icon.Plus size={18} />} />
        </>
      )}
    </div>
  );
}

export function ResumeEditor() {
  const navigate = useNavigate();
  const { addResume, resumes } = useApp();
  const [specialty, setSpecialty] = useState(SPECIALTIES[0]);
  const [experience, setExperience] = useState("");
  const [salaryFrom, setSalaryFrom] = useState("");
  const [salaryTo, setSalaryTo] = useState("");
  const [city, setCity] = useState("Екатеринбург");
  const [shift, setShift] = useState(SHIFTS[0]);
  const [active, setActive] = useState(true);
  const [saved, setSaved] = useState(false);

  function handleSave() {
    if (!specialty || !experience || !salaryFrom || !salaryTo) return;
    addResume({
      id: Date.now(),
      specialty,
      experience: `Опыт ${experience} ${experience === "1" ? "год" : "лет"}`,
      salaryFrom: Number(salaryFrom),
      salaryTo: Number(salaryTo),
      city,
      active,
      updatedAt: new Date().toLocaleString("ru-RU"),
      stats: { favorites: 0, responses: 0, views: 0 },
    });
    setSaved(true);
  }

  if (saved) {
    return (
      <SuccessScreen
        title="Резюме создано"
        subtitle="Теперь работодатели видят ваш профиль компетенций в поиске"
        buttonText="К резюме"
        onButton={() => navigate("/employee/resumes")}
      />
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <button onClick={() => navigate("/employee/resumes")} style={{
        background: "none", border: "none", cursor: "pointer",
        display: "flex", alignItems: "center", gap: 6, color: C.sub, alignSelf: "flex-start",
      }}>
        <Icon.ChevronLeft size={18} />
        <span style={{ fontFamily: F.regular, fontSize: 14 }}>К резюме</span>
      </button>

      <div style={{ fontFamily: F.bold, fontSize: 24, color: C.text, letterSpacing: "-0.4px" }}>
        Создание резюме
      </div>

      <Card>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Select label="Специальность" value={specialty} onChange={setSpecialty}
            options={SPECIALTIES.map(s => ({ value: s, label: s }))} />
          <Input label="Опыт (лет)" value={experience} onChange={setExperience} placeholder="Например: 5" type="number" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Input label="Зарплата от" value={salaryFrom} onChange={setSalaryFrom} placeholder="80000" type="number" />
            <Input label="Зарплата до" value={salaryTo} onChange={setSalaryTo} placeholder="120000" type="number" />
          </div>
          <Input label="Город" value={city} onChange={setCity} placeholder="Екатеринбург" />
          <Select label="Сменность" value={shift} onChange={setShift}
            options={SHIFTS.map(s => ({ value: s, label: s }))} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0" }}>
            <div>
              <div style={{ fontFamily: F.semi, fontSize: 14, color: C.text }}>Активное резюме</div>
              <div style={{ fontFamily: F.regular, fontSize: 12, color: C.sub }}>Видно работодателям в поиске</div>
            </div>
            <Toggle checked={active} onChange={setActive} />
          </div>
        </div>
      </Card>

      <GreenBtn label="Сохранить" full onClick={handleSave} disabled={!specialty || !experience || !salaryFrom || !salaryTo} />
    </div>
  );
}
