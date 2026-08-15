import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { C, F, MOCK_EMPLOYER_VACANCIES, SPECIALTIES, CATEGORIES, ADMISSIONS, SHIFTS, GRADES, MOCK_COMPANY, VACANCY_STATUS_LABELS, VACANCY_STATUS_COLORS, PUBLICATION_CHANNELS, MOCK_VACANCY_TEMPLATES } from "@/data/mockData";
import { Icon } from "@/components/icons/Icons";
import { Card, GreenBtn, OutlineBtn, StatusBadge, EmptyState, SectionHeader, Input, Select, Chip, Toggle, SuccessScreen } from "@/components/ui";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import type { Vacancy, VacancyStatus, PublicationChannel, VacancyTemplate } from "@/types";

// ─── Список вакансий ─────────────────────────────────────────────────────────
export function EmployerVacancyList() {
  const navigate = useNavigate();
  const [vacancies, setVacancies] = useLocalStorage<Vacancy[]>("tcard:employer:vacancies", MOCK_EMPLOYER_VACANCIES);
  const [templates, setTemplates] = useLocalStorage<VacancyTemplate[]>("tcard:employer:templates", MOCK_VACANCY_TEMPLATES);
  const [filter, setFilter] = useState<VacancyStatus | "all">("all");
  const [showTemplates, setShowTemplates] = useState(false);

  const getStatus = (v: Vacancy): VacancyStatus => v.vacancyStatus ?? (v.active ? "active" : "closed");

  const filtered = filter === "all" ? vacancies : vacancies.filter(v => getStatus(v) === filter);

  function updateVacancyStatus(id: number, status: VacancyStatus) {
    setVacancies(prev => prev.map(v => v.id === id ? {
      ...v,
      vacancyStatus: status,
      active: status === "active",
    } : v));
  }

  function deleteVacancy(id: number) {
    setVacancies(prev => prev.filter(v => v.id !== id));
  }

  function createFromTemplate(t: VacancyTemplate) {
    const newId = Date.now();
    const newVacancy: Vacancy = {
      id: newId,
      company: MOCK_COMPANY.name,
      title: t.title, city: t.city, category: t.category,
      salaryFrom: t.salaryFrom, salaryTo: t.salaryTo,
      experience: t.experience, grade: t.grade, shift: t.shift,
      department: t.department, description: t.description,
      admissions: t.admissions, active: false,
      vacancyStatus: "draft",
      channels: PUBLICATION_CHANNELS.map(c => ({ id: c.id, name: c.name, enabled: false })),
      templateId: t.id,
      date: new Date().toLocaleDateString("ru-RU"),
      views: 0, responses: 0,
      rating: MOCK_COMPANY.rating, reviewsCount: MOCK_COMPANY.reviewsCount,
    };
    setVacancies(prev => [...prev, newVacancy]);
    setShowTemplates(false);
    navigate(`/employer/vacancies/${newId}/edit`);
  }

  function deleteTemplate(id: number) {
    setTemplates(prev => prev.filter(t => t.id !== id));
  }

  const STATUS_TABS: { key: VacancyStatus | "all"; label: string }[] = [
    { key: "all", label: "Все" },
    { key: "draft", label: "Черновики" },
    { key: "active", label: "Активные" },
    { key: "paused", label: "Пауза" },
    { key: "closed", label: "Закрытые" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontFamily: F.bold, fontSize: 24, color: C.text }}>Вакансии</div>
        <div style={{ display: "flex", gap: 8 }}>
          <OutlineBtn label="Шаблоны" icon={<Icon.Folder size={16} />} onClick={() => setShowTemplates(true)} />
          <GreenBtn label="Создать" icon={<Icon.Plus size={18} />} onClick={() => navigate("/employer/vacancies/new")} />
        </div>
      </div>

      {/* Фильтры */}
      <div style={{ display: "flex", gap: 8 }}>
        {STATUS_TABS.map(t => (
          <button key={t.key} onClick={() => setFilter(t.key)} style={{
            padding: "8px 16px", borderRadius: 20, border: "none", cursor: "pointer",
            background: filter === t.key ? C.green : C.bg,
            color: filter === t.key ? "white" : C.sub,
            fontFamily: F.regular, fontSize: 14,
            transition: "all 0.2s",
          }}>{t.label}</button>
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
                    <StatusBadge label={VACANCY_STATUS_LABELS[getStatus(v)]} color={VACANCY_STATUS_COLORS[getStatus(v)]} />
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

              {/* Каналы публикации */}
              {v.channels && v.channels.some(ch => ch.enabled) && (
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 10 }}>
                  {v.channels.filter(ch => ch.enabled).map(ch => (
                    <span key={ch.id} style={{
                      fontSize: 11, fontFamily: F.regular, color: C.sub,
                      background: C.bg, padding: "4px 10px", borderRadius: 8,
                    }}>{ch.name}</span>
                  ))}
                </div>
              )}

              <div style={{ display: "flex", gap: 8, marginTop: 14, borderTop: `1px solid ${C.border}`, paddingTop: 14, flexWrap: "wrap" }}>
                {/* Quick status switchers */}
                {getStatus(v) !== "active" && (
                  <OutlineBtn label="Активировать" onClick={() => updateVacancyStatus(v.id, "active")} />
                )}
                {getStatus(v) === "active" && (
                  <OutlineBtn label="Пауза" onClick={() => updateVacancyStatus(v.id, "paused")} />
                )}
                {getStatus(v) !== "closed" && (
                  <OutlineBtn label="Закрыть" onClick={() => updateVacancyStatus(v.id, "closed")} />
                )}
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

      {/* Модальное окно шаблонов */}
      {showTemplates && (
        <div onClick={() => setShowTemplates(false)} style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.4)", zIndex: 1000,
          display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            background: "white", borderRadius: 20, maxWidth: 560, width: "100%",
            maxHeight: "80vh", overflow: "auto", padding: 24,
            display: "flex", flexDirection: "column", gap: 16,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontFamily: F.bold, fontSize: 20, color: C.text }}>Шаблоны вакансий</span>
              <button onClick={() => setShowTemplates(false)} style={{
                background: "none", border: "none", cursor: "pointer",
                fontSize: 20, color: C.sub,
              }}>×</button>
            </div>
            <div style={{ fontFamily: F.regular, fontSize: 14, color: C.sub }}>
              Выберите шаблон для быстрого создания вакансии
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {templates.length === 0 ? (
                <div style={{ textAlign: "center", padding: 24, fontFamily: F.regular, fontSize: 14, color: C.sub }}>
                  Нет сохранённых шаблонов
                </div>
              ) : templates.map(t => (
                <div key={t.id} style={{
                  border: `1px solid ${C.border}`, borderRadius: 14, padding: 16,
                  display: "flex", flexDirection: "column", gap: 8,
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <div style={{ fontFamily: F.semi, fontSize: 16, color: C.text }}>{t.title}</div>
                      <div style={{ fontFamily: F.regular, fontSize: 13, color: C.sub, marginTop: 4 }}>
                        {t.category} · {t.city} · {t.shift}
                      </div>
                    </div>
                    <div style={{ fontFamily: F.semi, fontSize: 14, color: C.green }}>
                      ₽ {t.salaryFrom.toLocaleString()} – {t.salaryTo.toLocaleString()}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {t.admissions.map(a => (
                      <span key={a} style={{
                        fontSize: 11, fontFamily: F.regular, color: C.sub,
                        background: C.bg, padding: "3px 8px", borderRadius: 8,
                      }}>{a}</span>
                    ))}
                  </div>
                  <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                    <GreenBtn label="Создать из шаблона" onClick={() => createFromTemplate(t)} />
                    <button onClick={() => deleteTemplate(t.id)} style={{
                      background: "none", border: "none", cursor: "pointer",
                      padding: "10px 16px", fontFamily: F.regular, fontSize: 14, color: C.red,
                    }}>Удалить</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Детали вакансии ─────────────────────────────────────────────────────────
export function EmployerVacancyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vacancies, setVacancies] = useLocalStorage<Vacancy[]>("tcard:employer:vacancies", MOCK_EMPLOYER_VACANCIES);
  const vacancy = vacancies.find(v => v.id === Number(id));

  if (!vacancy) {
    return <EmptyState icon="🔍" title="Вакансия не найдена" subtitle="Возможно, она была удалена" />;
  }

  const getStatus = (): VacancyStatus => vacancy.vacancyStatus ?? (vacancy.active ? "active" : "closed");

  function updateStatus(status: VacancyStatus) {
    setVacancies(prev => prev.map(v => v.id === vacancy!.id ? {
      ...v, vacancyStatus: status, active: status === "active",
    } : v));
  }

  function toggleChannel(channelId: string) {
    setVacancies(prev => prev.map(v => {
      if (v.id !== vacancy!.id) return v;
      const channels = v.channels ? v.channels.map(ch =>
        ch.id === channelId
          ? { ...ch, enabled: !ch.enabled, publishedAt: !ch.enabled ? new Date().toLocaleDateString("ru-RU") : undefined }
          : ch
      ) : [];
      return { ...v, channels };
    }));
  }

  const STATUS_BUTTONS: { key: VacancyStatus; label: string }[] = [
    { key: "draft", label: "Черновик" },
    { key: "active", label: "Активна" },
    { key: "paused", label: "Пауза" },
    { key: "closed", label: "Закрыта" },
  ];

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
              <StatusBadge label={VACANCY_STATUS_LABELS[getStatus()]} color={VACANCY_STATUS_COLORS[getStatus()]} />
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

      {/* Статус вакансии */}
      <Card>
        <SectionHeader title="Статус вакансии" />
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {STATUS_BUTTONS.map(s => (
            <button key={s.key} onClick={() => updateStatus(s.key)} style={{
              padding: "10px 20px", borderRadius: 20, border: "none", cursor: "pointer",
              background: getStatus() === s.key ? VACANCY_STATUS_COLORS[s.key] : C.bg,
              color: getStatus() === s.key ? "white" : C.sub,
              fontFamily: F.regular, fontSize: 14,
              transition: "all 0.2s",
            }}>{s.label}</button>
          ))}
        </div>
      </Card>

      {/* Модуль публикации */}
      <Card>
        <SectionHeader title="Публикация" />
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {(vacancy.channels ?? PUBLICATION_CHANNELS.map(c => ({ id: c.id, name: c.name, enabled: false } as PublicationChannel))).map(ch => (
            <div key={ch.id} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "12px 14px", background: C.bg, borderRadius: 12,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <Toggle checked={ch.enabled} onChange={() => toggleChannel(ch.id)} />
                <div>
                  <div style={{ fontFamily: F.semi, fontSize: 14, color: C.text }}>{ch.name}</div>
                  {ch.publishedAt && (
                    <div style={{ fontFamily: F.regular, fontSize: 12, color: C.sub }}>
                      Опубликовано: {ch.publishedAt}
                    </div>
                  )}
                </div>
              </div>
              {ch.enabled ? (
                <span style={{ fontFamily: F.regular, fontSize: 12, color: C.green }}>Активно</span>
              ) : (
                <span style={{ fontFamily: F.regular, fontSize: 12, color: C.sub }}>Выключено</span>
              )}
            </div>
          ))}
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
  const [templates, setTemplates] = useLocalStorage<VacancyTemplate[]>("tcard:employer:templates", MOCK_VACANCY_TEMPLATES);
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
  const [vacancyStatus, setVacancyStatus] = useState<VacancyStatus>(existing?.vacancyStatus ?? "draft");
  const [channels, setChannels] = useState<PublicationChannel[]>(
    existing?.channels ?? PUBLICATION_CHANNELS.map(c => ({ id: c.id, name: c.name, enabled: c.id === "platform" }))
  );
  const [saved, setSaved] = useState(false);
  const [savedAsTemplate, setSavedAsTemplate] = useState(false);

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
      admissions, active: vacancyStatus === "active",
      vacancyStatus,
      channels,
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

  function saveAsTemplate() {
    if (!title || !salaryFrom || !salaryTo || !description) return;
    const newTemplate: VacancyTemplate = {
      id: Date.now(),
      title, category, city,
      salaryFrom: Number(salaryFrom),
      salaryTo: Number(salaryTo),
      experience, grade: Number(grade), shift, department, description,
      admissions,
      createdAt: new Date().toLocaleDateString("ru-RU"),
    };
    setTemplates(prev => [...prev, newTemplate]);
    setSavedAsTemplate(true);
  }

  if (savedAsTemplate) {
    return (
      <SuccessScreen
        title="Шаблон сохранён"
        subtitle="Вы сможете использовать его для быстрого создания вакансий"
        buttonText="К вакансиям"
        onButton={() => navigate("/employer/vacancies")}
      />
    );
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
            options={["Менее 1 года", "1-3 года", "3-6 лет", "6+ лет"].map(e => ({ value: e, label: e }))} />
          <Select label="Разряд (0 — не требуется)" value={grade} onChange={setGrade}
            options={["0", "2", "3", "4", "5", "6"].map(g => ({ value: g, label: g === "0" ? "Не требуется" : `${g} разряд` }))} />
          <Select label="Сменность" value={shift} onChange={setShift}
            options={SHIFTS.map(s => ({ value: s, label: s }))} />
          <Input label="Подразделение" value={department} onChange={setDepartment} placeholder="Введите название подразделения" />

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

          {/* Статус вакансии */}
          <div>
            <div style={{ fontFamily: F.semi, fontSize: 14, color: C.text, marginBottom: 10 }}>Статус вакансии</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {(["draft", "active", "paused"] as VacancyStatus[]).map(s => (
                <button key={s} onClick={() => setVacancyStatus(s)} style={{
                  padding: "8px 16px", borderRadius: 20, border: "none", cursor: "pointer",
                  background: vacancyStatus === s ? VACANCY_STATUS_COLORS[s] : C.bg,
                  color: vacancyStatus === s ? "white" : C.sub,
                  fontFamily: F.regular, fontSize: 13,
                }}>{VACANCY_STATUS_LABELS[s]}</button>
              ))}
            </div>
          </div>

        </div>
      </Card>

      <div style={{ display: "flex", gap: 10 }}>
        <GreenBtn label="Сохранить" full onClick={handleSave} disabled={!title || !salaryFrom || !salaryTo || !description} />
        <OutlineBtn label="Сохранить как шаблон" onClick={saveAsTemplate} />
      </div>
    </div>
  );
}
