import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { C, F, MOCK_EMPLOYER_VACANCIES, SPECIALTIES, CATEGORIES, ADMISSIONS, SHIFTS, GRADES, MOCK_COMPANY } from "@/data/mockData";
import { Icon } from "@/components/icons/Icons";
import { Card, GreenBtn, OutlineBtn, StatusBadge, EmptyState, SectionHeader, Input, Select, Chip, Toggle, SuccessScreen } from "@/components/ui";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import type { Vacancy } from "@/types";

// ─── Список вакансий ─────────────────────────────────────────────────────────
export function EmployerVacancyList() {
  const navigate = useNavigate();
  const [vacancies, setVacancies] = useLocalStorage<Vacancy[]>("tcard:employer:vacancies", MOCK_EMPLOYER_VACANCIES);
  const [filter, setFilter] = useState<"all" | "active" | "archived">("all");

  const filtered = vacancies.filter(v => {
    if (filter === "active") return v.active;
    if (filter === "archived") return !v.active;
    return true;
  });

  function toggleActive(id: number) {
    setVacancies(prev => prev.map(v => v.id === id ? { ...v, active: !v.active } : v));
  }

  function deleteVacancy(id: number) {
    setVacancies(prev => prev.filter(v => v.id !== id));
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontFamily: F.bold, fontSize: 24, color: C.text }}>Вакансии</div>
        <GreenBtn label="Создать" icon={<Icon.Plus size={18} />} onClick={() => navigate("/employer/vacancies/new")} />
      </div>

      {/* Фильтры */}
      <div style={{ display: "flex", gap: 8 }}>
        {[
          { key: "all", label: "Все" },
          { key: "active", label: "Активные" },
          { key: "archived", label: "Архив" },
        ].map(f => (
          <button key={f.key} onClick={() => setFilter(f.key as typeof filter)} style={{
            padding: "8px 16px", borderRadius: 20, border: "none", cursor: "pointer",
            background: filter === f.key ? C.green : C.chip,
            color: filter === f.key ? "white" : C.text,
            fontFamily: F.regular, fontSize: 14, transition: "all 0.15s",
          }}>{f.label}</button>
        ))}
      </div>

      {/* Список */}
      {filtered.length === 0 ? (
        <EmptyState
          icon="📋"
          title="Нет вакансий"
          subtitle="Создайте первую вакансию, чтобы получать отклики от кандидатов"
          action={<GreenBtn label="Создать вакансию" onClick={() => navigate("/employer/vacancies/new")} />}
        />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {filtered.map(v => (
            <Card key={v.id}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <div onClick={() => navigate(`/employer/vacancies/${v.id}`)} style={{ cursor: "pointer", flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontFamily: F.semi, fontSize: 17, color: C.text }}>{v.title}</span>
                    <StatusBadge label={v.active ? "Активна" : "В архиве"} color={v.active ? C.green : C.gray} />
                  </div>
                  <div style={{ fontFamily: F.regular, fontSize: 13, color: C.sub, marginTop: 4 }}>
                    {v.department} · {v.shift} · {v.city}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontFamily: F.semi, fontSize: 15, color: C.text }}>
                    ₽ {v.salaryFrom.toLocaleString()} – {v.salaryTo.toLocaleString()}
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", gap: 20, marginBottom: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <Icon.Search size={16} />
                  <span style={{ fontFamily: F.regular, fontSize: 13, color: C.sub }}>{v.views}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <Icon.Folder size={16} />
                  <span style={{ fontFamily: F.regular, fontSize: 13, color: C.sub }}>{v.responses}</span>
                </div>
                {v.grade > 0 && (
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <Icon.Wrench size={16} />
                    <span style={{ fontFamily: F.regular, fontSize: 13, color: C.sub }}>{v.grade} разряд</span>
                  </div>
                )}
              </div>

              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {v.admissions.map(a => <Chip key={a} label={a} />)}
              </div>

              <div style={{ display: "flex", gap: 8, marginTop: 14, borderTop: `1px solid ${C.border}`, paddingTop: 14 }}>
                <OutlineBtn label={v.active ? "В архив" : "Активировать"} onClick={() => toggleActive(v.id)} />
                <OutlineBtn label="Редактировать" onClick={() => navigate(`/employer/vacancies/${v.id}/edit`)} />
                <button onClick={() => deleteVacancy(v.id)} style={{
                  background: "none", border: "none", cursor: "pointer", padding: "10px 16px",
                  fontFamily: F.regular, fontSize: 14, color: C.red,
                }}>Удалить</button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Детали вакансии ─────────────────────────────────────────────────────────
export function EmployerVacancyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vacancies] = useLocalStorage<Vacancy[]>("tcard:employer:vacancies", MOCK_EMPLOYER_VACANCIES);
  const vacancy = vacancies.find(v => v.id === Number(id));

  if (!vacancy) {
    return <EmptyState icon="🔍" title="Вакансия не найдена" subtitle="Возможно, она была удалена" />;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <button onClick={() => navigate("/employer/vacancies")} style={{
        background: "none", border: "none", cursor: "pointer",
        display: "flex", alignItems: "center", gap: 6, color: C.sub, alignSelf: "flex-start",
      }}>
        <Icon.ChevronLeft size={18} />
        <span style={{ fontFamily: F.regular, fontSize: 14 }}>К вакансиям</span>
      </button>

      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontFamily: F.bold, fontSize: 22, color: C.text }}>{vacancy.title}</span>
              <StatusBadge label={vacancy.active ? "Активна" : "В архиве"} color={vacancy.active ? C.green : C.gray} />
            </div>
            <div style={{ fontFamily: F.regular, fontSize: 14, color: C.sub, marginTop: 6 }}>
              {vacancy.department} · {vacancy.city} · {vacancy.shift}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: F.bold, fontSize: 18, color: C.green }}>
              ₽ {vacancy.salaryFrom.toLocaleString()} – {vacancy.salaryTo.toLocaleString()}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 24, marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Icon.Search size={18} />
            <span style={{ fontFamily: F.regular, fontSize: 14, color: C.sub }}>{vacancy.views} просмотров</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Icon.Folder size={18} />
            <span style={{ fontFamily: F.regular, fontSize: 14, color: C.sub }}>{vacancy.responses} откликов</span>
          </div>
        </div>

        <div style={{ fontFamily: F.regular, fontSize: 15, color: C.text, lineHeight: "24px", marginBottom: 16 }}>
          {vacancy.description}
        </div>

        <SectionHeader title="Требования" />
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Icon.Check size={16} color={C.green} />
            <span style={{ fontFamily: F.regular, fontSize: 14, color: C.text }}>{vacancy.experience}</span>
          </div>
          {vacancy.grade > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Icon.Check size={16} color={C.green} />
              <span style={{ fontFamily: F.regular, fontSize: 14, color: C.text }}>{vacancy.grade} разряд</span>
            </div>
          )}
        </div>

        <SectionHeader title="Допуски" />
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
          {vacancy.admissions.map(a => <Chip key={a} label={a} color={C.green} />)}
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <OutlineBtn label="Редактировать" onClick={() => navigate(`/employer/vacancies/${vacancy.id}/edit`)} />
          <OutlineBtn label="Кандидаты" onClick={() => navigate("/employer/candidates")} />
        </div>
      </Card>
    </div>
  );
}

// ─── Создание / редактирование вакансии ──────────────────────────────────────
export function EmployerVacancyEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vacancies, setVacancies] = useLocalStorage<Vacancy[]>("tcard:employer:vacancies", MOCK_EMPLOYER_VACANCIES);
  const existing = id ? vacancies.find(v => v.id === Number(id)) : undefined;

  const [title, setTitle] = useState(existing?.title ?? "");
  const [category, setCategory] = useState(existing?.category ?? CATEGORIES[0]);
  const [city, setCity] = useState(existing?.city ?? "Екатеринбург");
  const [salaryFrom, setSalaryFrom] = useState(existing ? String(existing.salaryFrom) : "");
  const [salaryTo, setSalaryTo] = useState(existing ? String(existing.salaryTo) : "");
  const [experience, setExperience] = useState(existing?.experience ?? "Опыт 1 год");
  const [grade, setGrade] = useState(existing ? String(existing.grade) : "0");
  const [shift, setShift] = useState(existing?.shift ?? SHIFTS[0]);
  const [department, setDepartment] = useState(existing?.department ?? MOCK_COMPANY.departments[0]);
  const [description, setDescription] = useState(existing?.description ?? "");
  const [admissions, setAdmissions] = useState<string[]>(existing?.admissions ?? []);
  const [active, setActive] = useState(existing?.active ?? true);
  const [saved, setSaved] = useState(false);

  function toggleAdmission(a: string) {
    setAdmissions(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]);
  }

  function handleSave() {
    if (!title || !salaryFrom || !salaryTo || !description) return;
    const newVacancy: Vacancy = {
      id: existing?.id ?? Date.now(),
      company: MOCK_COMPANY.name,
      title, city, category,
      salaryFrom: Number(salaryFrom),
      salaryTo: Number(salaryTo),
      experience, grade: Number(grade), shift, department, description,
      admissions, active,
      date: new Date().toLocaleDateString("ru-RU"),
      views: existing?.views ?? 0,
      responses: existing?.responses ?? 0,
      rating: MOCK_COMPANY.rating,
      reviewsCount: MOCK_COMPANY.reviewsCount,
    };
    if (existing) {
      setVacancies(prev => prev.map(v => v.id === existing.id ? newVacancy : v));
    } else {
      setVacancies(prev => [...prev, newVacancy]);
    }
    setSaved(true);
  }

  if (saved) {
    return (
      <SuccessScreen
        title={existing ? "Вакансия обновлена" : "Вакансия создана"}
        subtitle="Кандидаты увидят её в поиске и смогут откликнуться"
        buttonText="К вакансиям"
        onButton={() => navigate("/employer/vacancies")}
      />
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <button onClick={() => navigate("/employer/vacancies")} style={{
        background: "none", border: "none", cursor: "pointer",
        display: "flex", alignItems: "center", gap: 6, color: C.sub, alignSelf: "flex-start",
      }}>
        <Icon.ChevronLeft size={18} />
        <span style={{ fontFamily: F.regular, fontSize: 14 }}>К вакансиям</span>
      </button>

      <div style={{ fontFamily: F.bold, fontSize: 24, color: C.text }}>
        {existing ? "Редактирование вакансии" : "Новая вакансия"}
      </div>

      <Card>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Input label="Название должности" value={title} onChange={setTitle} placeholder="Например: Оператор ЧПУ" />
          <Select label="Категория" value={category} onChange={setCategory}
            options={CATEGORIES.map(c => ({ value: c, label: c }))} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Input label="Зарплата от" value={salaryFrom} onChange={setSalaryFrom} placeholder="80000" type="number" />
            <Input label="Зарплата до" value={salaryTo} onChange={setSalaryTo} placeholder="120000" type="number" />
          </div>
          <Input label="Город" value={city} onChange={setCity} />
          <Select label="Опыт работы" value={experience} onChange={setExperience}
            options={["Без опыта", "Опыт 1 год", "Опыт 2 года", "Опыт 3 года", "Опыт 5 лет"].map(e => ({ value: e, label: e }))} />
          <Select label="Разряд (0 — не требуется)" value={grade} onChange={setGrade}
            options={["0", "2", "3", "4", "5", "6"].map(g => ({ value: g, label: g === "0" ? "Не требуется" : `${g} разряд` }))} />
          <Select label="Сменность" value={shift} onChange={setShift}
            options={SHIFTS.map(s => ({ value: s, label: s }))} />
          <Select label="Подразделение" value={department} onChange={setDepartment}
            options={MOCK_COMPANY.departments.map(d => ({ value: d, label: d }))} />

          <div>
            <div style={{ fontFamily: F.semi, fontSize: 14, color: C.text, marginBottom: 10 }}>Допуски</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {ADMISSIONS.map(a => (
                <button key={a} onClick={() => toggleAdmission(a)} style={{
                  padding: "8px 14px", borderRadius: 20, border: "none", cursor: "pointer",
                  background: admissions.includes(a) ? `${C.green}15` : C.chip,
                  color: admissions.includes(a) ? C.green : C.text,
                  fontFamily: F.regular, fontSize: 13, transition: "all 0.15s",
                }}>{a}</button>
              ))}
            </div>
          </div>

          <div>
            <div style={{ fontFamily: F.semi, fontSize: 14, color: C.text, marginBottom: 8 }}>Описание</div>
            <textarea
              value={description} onChange={e => setDescription(e.target.value)}
              placeholder="Опишите обязанности и условия работы"
              style={{
                width: "100%", minHeight: 120, padding: "14px 16px",
                background: C.bg, border: `1px solid ${C.border}`, borderRadius: 14,
                fontFamily: F.regular, fontSize: 15, color: C.text, resize: "vertical",
                outline: "none",
              }}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0" }}>
            <div>
              <div style={{ fontFamily: F.semi, fontSize: 14, color: C.text }}>Активная вакансия</div>
              <div style={{ fontFamily: F.regular, fontSize: 12, color: C.sub }}>Видна кандидатам в поиске</div>
            </div>
            <Toggle checked={active} onChange={setActive} />
          </div>
        </div>
      </Card>

      <GreenBtn label="Сохранить" full onClick={handleSave} disabled={!title || !salaryFrom || !salaryTo || !description} />
    </div>
  );
}
