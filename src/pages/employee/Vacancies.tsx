import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { C, F, MOCK_VACANCIES, CATEGORIES, SPECIALTIES } from "@/data/mockData";
import { Icon } from "@/components/icons/Icons";
import { Card, GreenBtn, OutlineBtn, Chip, SectionHeader, EmptyState, SuccessScreen, StatusBadge } from "@/components/ui";
import { useApp } from "@/context/AppContext";

// ─── Список вакансий ─────────────────────────────────────────────────────────
export function VacancyList() {
  const navigate = useNavigate();
  const { bookmarks, toggleBookmark } = useApp();
  const [category, setCategory] = useState<string | null>(null);

  const filtered = category
    ? MOCK_VACANCIES.filter(v => v.category === category)
    : MOCK_VACANCIES;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Поиск */}
      <button onClick={() => navigate("/employee/search")} style={{
        background: "white", border: `1px solid ${C.border}`, borderRadius: 20,
        display: "flex", alignItems: "center", gap: 12, padding: "14px 20px",
        boxShadow: "0 0 64px rgba(0,0,0,0.02)", cursor: "pointer", textAlign: "left",
      }}>
        <Icon.Search active />
        <span style={{ fontFamily: F.regular, fontSize: 15, color: C.sub }}>Специальность, разряд, предприятие</span>
      </button>

      {/* Категории */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {CATEGORIES.map(cat => (
          <Chip key={cat} label={cat} active={category === cat} onClick={() => setCategory(category === cat ? null : cat)} />
        ))}
      </div>

      {/* Популярные */}
      <section>
        <SectionHeader title="Популярные специальности" />
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {SPECIALTIES.map(s => (
            <button key={s} onClick={() => navigate(`/employee/search?q=${encodeURIComponent(s)}`)} style={{
              background: "white", border: `1px solid ${C.border}`, borderRadius: 20,
              padding: "10px 18px", fontFamily: F.regular, fontSize: 14, color: C.muted,
              cursor: "pointer", transition: "border-color 0.15s",
            }}
              onMouseOver={e => e.currentTarget.style.borderColor = C.green}
              onMouseOut={e => e.currentTarget.style.borderColor = C.border}
            >{s}</button>
          ))}
        </div>
      </section>

      {/* Подобранные вакансии */}
      <section>
        <SectionHeader title="Подобранные вакансии" subtitle={`${filtered.length} вакансий`} />
        {filtered.length === 0 ? (
          <EmptyState icon="📭" title="Вакансий не найдено" subtitle="Попробуйте изменить категорию или сбросить фильтры" />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {filtered.map(job => (
              <Card key={job.id} onClick={() => navigate(`/employee/vacancies/${job.id}`)}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                  <div>
                    <div style={{ fontFamily: F.semi, fontSize: 16, color: C.text, lineHeight: "22px" }}>{job.title}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
                      <span style={{ fontFamily: F.regular, fontSize: 13, color: C.sub }}>{job.company}</span>
                      {job.rating && (
                        <>
                          <Icon.Star />
                          <span style={{ fontFamily: F.regular, fontSize: 12, color: C.sub }}>{job.rating} · {job.reviewsCount} отзывов</span>
                        </>
                      )}
                    </div>
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
                <div style={{ fontFamily: F.regular, fontSize: 15, color: C.text, marginBottom: 10 }}>
                  ₽ {job.salaryFrom.toLocaleString()} – {job.salaryTo.toLocaleString()}
                  <span style={{ color: C.green }}>/месяц</span>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {job.isITR ? (
                    <>
                      {job.itrRequirements?.map(req => <Chip key={req} label={req} color={C.green} />)}
                      <Chip label={job.shift} />
                    </>
                  ) : (
                    <>
                      <Chip label={`${job.grade} разряд`} color={C.green} />
                      <Chip label={job.shift} />
                      {job.admissions.slice(0, 2).map(a => <Chip key={a} label={a} />)}
                    </>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

// ─── Карточка вакансии ───────────────────────────────────────────────────────
export function VacancyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { bookmarks, toggleBookmark, resumes, applications, addApplication } = useApp();
  const [applied, setApplied] = useState(false);
  const [selectedResume, setSelectedResume] = useState(resumes.find(r => r.active)?.id ?? resumes[0]?.id);

  const job = MOCK_VACANCIES.find(v => v.id === Number(id));

  if (!job) {
    return <EmptyState icon="🔍" title="Вакансия не найдена" subtitle="Возможно, она была снята с публикации" />;
  }

  const alreadyApplied = applications.some(a => a.vacancyId === job.id);

  function handleApply() {
    if (alreadyApplied || applied) return;
    setApplied(true);
    addApplication({
      id: Date.now(),
      vacancyId: job!.id,
      vacancyTitle: job!.title,
      company: job!.company,
      date: new Date().toLocaleDateString("ru-RU"),
      status: "pending",
      stages: [
        { name: "Отклик отправлен", date: new Date().toLocaleDateString("ru-RU"), done: true },
        { name: "Скрининг", date: "", done: false },
        { name: "Собеседование", date: "", done: false },
      ],
    });
  }

  if (applied) {
    return (
      <SuccessScreen
        title="Отклик отправлен"
        subtitle="Работодатель увидит ваш профиль компетенций и резюме"
        buttonText="К вакансиям"
        onButton={() => navigate("/employee/vacancies")}
      />
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <button onClick={() => navigate("/employee/vacancies")} style={{
        background: "none", border: "none", cursor: "pointer",
        display: "flex", alignItems: "center", gap: 6, color: C.sub, alignSelf: "flex-start",
      }}>
        <Icon.ChevronLeft size={18} />
        <span style={{ fontFamily: F.regular, fontSize: 14 }}>К списку</span>
      </button>

      {/* Заголовок */}
      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
          <div>
            <div style={{ fontFamily: F.semi, fontSize: 22, color: C.text, lineHeight: "28px", marginBottom: 6 }}>{job.title}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontFamily: F.regular, fontSize: 14, color: C.sub }}>{job.company}</span>
              <Icon.Verified />
            </div>
          </div>
          <button onClick={() => toggleBookmark(job.id)} style={{
            background: "none", border: "none", cursor: "pointer", padding: 4,
          }}>
            <Icon.Bookmark active={bookmarks.includes(job.id)} size={24} />
          </button>
        </div>

        {/* Плитки */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
          <div style={{ background: C.bg, borderRadius: 14, padding: "14px 16px" }}>
            <div style={{ fontFamily: F.regular, fontSize: 12, color: C.sub, marginBottom: 4 }}>Зарплата</div>
            <div style={{ fontFamily: F.semi, fontSize: 16, color: C.text }}>
              ₽ {job.salaryFrom.toLocaleString()} – {job.salaryTo.toLocaleString()}
            </div>
          </div>
          <div style={{ background: C.bg, borderRadius: 14, padding: "14px 16px" }}>
            <div style={{ fontFamily: F.regular, fontSize: 12, color: C.sub, marginBottom: 4 }}>Стаж</div>
            <div style={{ fontFamily: F.semi, fontSize: 16, color: C.text }}>{job.experience}</div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 4 }}>
          <Icon.Location />
          <span style={{ fontFamily: F.regular, fontSize: 14, color: C.green }}>{job.city}</span>
        </div>
        <div style={{ fontFamily: F.regular, fontSize: 14, color: C.sub }}>{job.department}</div>
      </Card>

      {/* Компания */}
      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontFamily: F.semi, fontSize: 17, color: C.text, marginBottom: 6 }}>{job.company}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              {[...Array(5)].map((_, i) => <Icon.Star key={i} />)}
              <span style={{ fontFamily: F.regular, fontSize: 13, color: C.sub, marginLeft: 4 }}>
                {job.rating} · {job.reviewsCount} отзывов
              </span>
            </div>
          </div>
          <button onClick={() => navigate(`/employee/vacancies?company=${encodeURIComponent(job.company)}`)} style={{
            background: C.bg, border: `1px solid ${C.border}`, borderRadius: 16,
            padding: "8px 16px", cursor: "pointer", fontFamily: F.regular, fontSize: 13, color: C.muted,
          }}>Отзывы</button>
        </div>
      </Card>

      {/* Требования */}
      <Card>
        <div style={{ fontFamily: F.semi, fontSize: 16, color: C.text, marginBottom: 14 }}>Требования</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {job.isITR ? (
            <>
              {job.itrRequirements?.map((req: string) => <Chip key={req} label={req} color={C.green} />)}
              <Chip label={job.shift} color={C.blue} />
              <Chip label={job.department} />
            </>
          ) : (
            <>
              <Chip label={`${job.grade} разряд`} color={C.green} />
              <Chip label={job.shift} color={C.blue} />
              {job.admissions.map(a => <Chip key={a} label={a} />)}
              <Chip label={job.department} />
            </>
          )}
        </div>
      </Card>

      {/* Описание */}
      <Card>
        <div style={{ fontFamily: F.semi, fontSize: 16, color: C.text, marginBottom: 12 }}>Описание</div>
        <div style={{ fontFamily: F.regular, fontSize: 14, color: C.muted, lineHeight: "22px" }}>
          {job.description}
        </div>
      </Card>

      {/* Резюме для отклика */}
      <Card>
        <div style={{ fontFamily: F.semi, fontSize: 16, color: C.text, marginBottom: 14 }}>Резюме для отклика</div>
        {resumes.map(r => (
          <div key={r.id} onClick={() => setSelectedResume(r.id)} style={{
            background: selectedResume === r.id ? `${C.green}08` : C.bg,
            border: selectedResume === r.id ? `2px solid ${C.green}` : `1px solid ${C.border}`,
            borderRadius: 14, padding: "14px 16px", marginBottom: 8, cursor: "pointer",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontFamily: F.semi, fontSize: 15, color: C.text }}>{r.specialty}</div>
                <div style={{ fontFamily: F.regular, fontSize: 13, color: C.sub }}>
                  {r.experience} · ₽ {r.salaryFrom.toLocaleString()}–{r.salaryTo.toLocaleString()}
                </div>
              </div>
              {r.active && <StatusBadge label="Активно" color={C.green} />}
            </div>
          </div>
        ))}
      </Card>

      {/* Кнопка отклика */}
      {alreadyApplied ? (
        <Card style={{ textAlign: "center", padding: 24 }}>
          <Icon.CheckCircle size={32} />
          <div style={{ fontFamily: F.semi, fontSize: 16, color: C.text, marginTop: 8 }}>Вы уже откликнулись</div>
          <div style={{ fontFamily: F.regular, fontSize: 13, color: C.sub, marginTop: 4 }}>
            Статус отклика можно проверить в разделе «Отклики»
          </div>
          <GreenBtn label="К откликам" onClick={() => navigate("/employee/applications")} />
        </Card>
      ) : (
        <GreenBtn label="Откликнуться" full onClick={handleApply} />
      )}
    </div>
  );
}
