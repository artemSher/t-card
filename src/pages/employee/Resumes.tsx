import React, { useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { C, F, SHIFTS, GRADES, ADMISSIONS, EXPERIENCE_OPTIONS, EDUCATION_OPTIONS } from "@/data/mockData";
import { Icon } from "@/components/icons/Icons";
import { Card, GreenBtn, OutlineBtn, Chip, Input, Select, EmptyState, SuccessScreen, StatusBadge, SectionHeader, KPITile, Toggle } from "@/components/ui";
import { useApp } from "@/context/AppContext";
import type { Resume } from "@/types";

export function ResumeList() {
  const navigate = useNavigate();
  const { resumes, updateResume } = useApp();
  const [filter, setFilter] = useState<"active" | "hidden" | "all">("all");
  const [raisedId, setRaisedId] = useState<number | null>(null);

  const filtered = useMemo(() => {
    if (filter === "active") return resumes.filter(r => r.active);
    if (filter === "hidden") return resumes.filter(r => !r.active);
    return resumes;
  }, [resumes, filter]);

  function handleRaise(id: number) {
    setRaisedId(id);
    updateResume({ ...resumes.find(r => r.id === id)!, updatedAt: new Date().toLocaleString("ru-RU") });
    setTimeout(() => setRaisedId(null), 2000);
  }

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

          {/* Фильтры */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            <Chip label="Все" active={filter === "all"} onClick={() => setFilter("all")} />
            <Chip label="Активные" active={filter === "active"} onClick={() => setFilter("active")} />
            <Chip label="Скрытые" active={filter === "hidden"} onClick={() => setFilter("hidden")} />
          </div>

          {/* Список */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {filtered.map(r => (
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
                {r.grade && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
                    <Chip label={`${r.grade} разряд`} color={C.green} />
                    {r.admissions?.slice(0, 2).map(a => <Chip key={a} label={a} />)}
                    {r.education && <Chip label={r.education} />}
                  </div>
                )}
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
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <OutlineBtn label="Редактировать" onClick={() => navigate(`/employee/resumes/${r.id}`)} />
                  <OutlineBtn label="Поднять в поиске" icon={<Icon.ChevronRight size={14} />} onClick={() => handleRaise(r.id)} />
                  <OutlineBtn label="PDF" icon={<Icon.Download size={14} />} onClick={() => window.print()} />
                </div>
                {raisedId === r.id && (
                  <div style={{ marginTop: 10, padding: "10px 14px", background: `${C.green}10`, borderRadius: 12, fontFamily: F.regular, fontSize: 13, color: C.green }}>
                    ✓ Резюме поднято в поиске
                  </div>
                )}
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
  const { id } = useParams();
  const navigate = useNavigate();
  const { addResume, updateResume, resumes } = useApp();
  const existing = id ? resumes.find(r => r.id === Number(id)) : undefined;
  const isEdit = !!existing;

  const [specialty, setSpecialty] = useState(existing?.specialty ?? "");
  const [experience, setExperience] = useState(existing?.experience ?? EXPERIENCE_OPTIONS[0]);
  const [salaryFrom, setSalaryFrom] = useState(existing ? String(existing.salaryFrom) : "");
  const [salaryTo, setSalaryTo] = useState(existing ? String(existing.salaryTo) : "");
  const [city, setCity] = useState(existing?.city ?? "Екатеринбург");
  const [shift, setShift] = useState(existing?.shift ?? SHIFTS[0]);
  const [active, setActive] = useState(existing?.active ?? true);
  const [about, setAbout] = useState(existing?.about ?? "");
  const [grade, setGrade] = useState(existing?.grade ?? GRADES[0]);
  const [education, setEducation] = useState(existing?.education ?? EDUCATION_OPTIONS[0]);
  const [selectedAdmissions, setSelectedAdmissions] = useState<string[]>(existing?.admissions ?? []);
  const [saved, setSaved] = useState(false);

  function toggleAdmission(a: string) {
    setSelectedAdmissions(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]);
  }

  function handleSave() {
    if (!specialty || !salaryFrom || !salaryTo) return;
    const resume: Resume = {
      id: existing?.id ?? Date.now(),
      specialty,
      experience,
      salaryFrom: Number(salaryFrom),
      salaryTo: Number(salaryTo),
      city,
      active,
      shift,
      updatedAt: new Date().toLocaleString("ru-RU"),
      about: about || undefined,
      grade,
      education,
      admissions: selectedAdmissions.length ? selectedAdmissions : undefined,
      stats: existing?.stats ?? { favorites: 0, responses: 0, views: 0 },
    };
    if (isEdit) {
      updateResume(resume);
    } else {
      addResume(resume);
    }
    setSaved(true);
  }

  if (saved) {
    return (
      <SuccessScreen
        title={isEdit ? "Резюме обновлено" : "Резюме создано"}
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
        {isEdit ? "Редактирование резюме" : "Создание резюме"}
      </div>

      <Card>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Input label="Специальность" value={specialty} onChange={setSpecialty} placeholder="Введите специальность" />
          <Select label="Опыт" value={experience} onChange={setExperience}
            options={EXPERIENCE_OPTIONS.map(e => ({ value: e, label: e }))} />
          <Select label="Разряд" value={String(grade)} onChange={v => setGrade(Number(v))}
            options={GRADES.map(g => ({ value: String(g), label: `${g} разряд` }))} />
          <Select label="Образование" value={education} onChange={setEducation}
            options={EDUCATION_OPTIONS.map(e => ({ value: e, label: e }))} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Input label="Зарплата от" value={salaryFrom} onChange={setSalaryFrom} placeholder="80000" type="number" />
            <Input label="Зарплата до" value={salaryTo} onChange={setSalaryTo} placeholder="120000" type="number" />
          </div>
          <Input label="Город" value={city} onChange={setCity} placeholder="Екатеринбург" />
          <Select label="Сменность" value={shift} onChange={setShift}
            options={SHIFTS.map(s => ({ value: s, label: s }))} />

          {/* Допуски */}
          <div>
            <div style={{ fontFamily: F.semi, fontSize: 14, color: C.text, marginBottom: 10 }}>Допуски</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {ADMISSIONS.map(a => (
                <Chip key={a} label={a} active={selectedAdmissions.includes(a)} onClick={() => toggleAdmission(a)} />
              ))}
            </div>
          </div>

          {/* О себе */}
          <div>
            <div style={{ fontFamily: F.semi, fontSize: 14, color: C.text, marginBottom: 10 }}>О себе</div>
            <textarea
              value={about}
              onChange={e => setAbout(e.target.value)}
              placeholder="Расскажите о своём опыте, навыках и достижениях..."
              style={{
                width: "100%", minHeight: 100, background: C.bg, border: `1px solid ${C.border}`,
                borderRadius: 14, padding: "12px 16px", fontFamily: F.regular, fontSize: 14,
                color: C.text, outline: "none", resize: "vertical",
              }}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0" }}>
            <div>
              <div style={{ fontFamily: F.semi, fontSize: 14, color: C.text }}>Активное резюме</div>
              <div style={{ fontFamily: F.regular, fontSize: 12, color: C.sub }}>Видно работодателям в поиске</div>
            </div>
            <Toggle checked={active} onChange={setActive} />
          </div>
        </div>
      </Card>

      <GreenBtn label="Сохранить" full onClick={handleSave} disabled={!specialty || !salaryFrom || !salaryTo} />
    </div>
  );
}
