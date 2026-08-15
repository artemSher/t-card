import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { C, F, MOCK_VACANCIES, POPULAR_SPECIALTIES, MOCK_SEARCH_HISTORY, ADMISSIONS, SHIFTS, GRADES, SPECIALTIES, ITR_SPECIALTIES, DIRECTIONS } from "@/data/mockData";
import { Icon } from "@/components/icons/Icons";
import { Card, GreenBtn, OutlineBtn, Chip, EmptyState, SuccessScreen, SectionHeader } from "@/components/ui";
import { useApp } from "@/context/AppContext";
import { useLocalStorage } from "@/hooks/useLocalStorage";

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { bookmarks, toggleBookmark, addSavedSearch } = useApp();
  const initialQuery = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(initialQuery);
  const [searched, setSearched] = useState(!!initialQuery);
  const [showFilters, setShowFilters] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [history, setHistory] = useLocalStorage<{ id: number; query: string; date: string }[]>("tcard:searchHistory", MOCK_SEARCH_HISTORY);

  // Фильтры
  const [filterGrade, setFilterGrade] = useState<number | null>(null);
  const [filterShift, setFilterShift] = useState<string | null>(null);
  const [filterAdmission, setFilterAdmission] = useState<string | null>(null);
  const [filterSpecialty, setFilterSpecialty] = useState<string | null>(null);
  const [filterDirection, setFilterDirection] = useState<string | null>(null);
  const [filterItr, setFilterItr] = useState<string | null>(null);

  function doSearch(q: string) {
    setQuery(q);
    setSearched(true);
    setSearchParams(q ? { q } : {});
    if (q.trim()) {
      setHistory(prev => [{ id: Date.now(), query: q, date: new Date().toLocaleDateString("ru-RU") }, ...prev.filter(h => h.query !== q)].slice(0, 10));
    }
  }

  function clearHistory() {
    setHistory([]);
  }

  function saveSearch() {
    if (!query.trim()) return;
    addSavedSearch({
      id: Date.now(),
      query,
      criteria: [
        filterSpecialty && filterSpecialty,
        filterGrade && `${filterGrade} разряд+`,
        filterShift,
        filterAdmission,
      ].filter(Boolean).join(", ") || query,
      notifications: true,
    });
    setShowSaveSuccess(true);
  }

  const filtered = MOCK_VACANCIES.filter(v => {
    if (query && !v.title.toLowerCase().includes(query.toLowerCase()) &&
        !v.company.toLowerCase().includes(query.toLowerCase()) &&
        !v.category.toLowerCase().includes(query.toLowerCase())) return false;
    if (filterGrade && !v.isITR && v.grade < filterGrade) return false;
    if (filterShift && v.shift !== filterShift) return false;
    if (filterAdmission && !v.admissions.includes(filterAdmission)) return false;
    if (filterSpecialty && !v.title.includes(filterSpecialty)) return false;
    if (filterDirection && !v.category.includes(filterDirection)) return false;
    if (filterItr && v.isITR && !v.title.includes(filterItr)) return false;
    return true;
  });

  if (showSaveSuccess) {
    return (
      <SuccessScreen
        title="Запрос сохранён"
        subtitle={`Новые вакансии по запросу «${query}» будут приходить в уведомления`}
        buttonText="К поиску"
        onButton={() => setShowSaveSuccess(false)}
      />
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Поиск */}
      <div style={{ display: "flex", gap: 10 }}>
        <div style={{
          flex: 1, background: "white", border: `1px solid ${C.border}`, borderRadius: 20,
          display: "flex", alignItems: "center", gap: 12, padding: "14px 20px",
          boxShadow: "0 0 64px rgba(0,0,0,0.02)",
        }}>
          <Icon.Search active />
          <input value={query} onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === "Enter" && query.trim() && doSearch(query)}
            placeholder="Специальность, разряд, предприятие"
            style={{
              flex: 1, border: "none", outline: "none", fontFamily: F.regular,
              fontSize: 15, color: C.text, background: "transparent",
            }} />
          {query && <button onClick={() => { setQuery(""); setSearched(false); setSearchParams({}); }} style={{
            background: "none", border: "none", cursor: "pointer", color: C.sub, fontSize: 18,
          }}>×</button>}
        </div>
        <button onClick={() => setShowFilters(!showFilters)} style={{
          background: "white", border: `1px solid ${showFilters ? C.green : C.border}`, borderRadius: 20,
          width: 52, height: 52, display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", flexShrink: 0,
        }}><Icon.Filter /></button>
      </div>

      {/* Фильтры */}
      {showFilters && (
        <Card>
          <div style={{ fontFamily: F.semi, fontSize: 16, color: C.text, marginBottom: 14 }}>Фильтры</div>

          <div style={{ marginBottom: 14 }}>
            <div style={{ fontFamily: F.regular, fontSize: 13, color: C.sub, marginBottom: 8 }}>Направление</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {DIRECTIONS.map(d => (
                <Chip key={d} label={d} active={filterDirection === d} onClick={() => setFilterDirection(filterDirection === d ? null : d)} />
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 14 }}>
            <div style={{ fontFamily: F.regular, fontSize: 13, color: C.sub, marginBottom: 8 }}>Профессия</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {SPECIALTIES.map(s => (
                <Chip key={s} label={s} active={filterSpecialty === s} onClick={() => setFilterSpecialty(filterSpecialty === s ? null : s)} />
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 14 }}>
            <div style={{ fontFamily: F.regular, fontSize: 13, color: C.sub, marginBottom: 8 }}>ИТР</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {ITR_SPECIALTIES.map(s => (
                <Chip key={s} label={s} active={filterItr === s} onClick={() => setFilterItr(filterItr === s ? null : s)} />
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 14 }}>
            <div style={{ fontFamily: F.regular, fontSize: 13, color: C.sub, marginBottom: 8 }}>Разряд от</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {GRADES.map(g => (
                <Chip key={g} label={`${g}+`} active={filterGrade === g} onClick={() => setFilterGrade(filterGrade === g ? null : g)} />
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 14 }}>
            <div style={{ fontFamily: F.regular, fontSize: 13, color: C.sub, marginBottom: 8 }}>Сменность</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {SHIFTS.map(s => (
                <Chip key={s} label={s} active={filterShift === s} onClick={() => setFilterShift(filterShift === s ? null : s)} />
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 14 }}>
            <div style={{ fontFamily: F.regular, fontSize: 13, color: C.sub, marginBottom: 8 }}>Допуски</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {ADMISSIONS.map(a => (
                <Chip key={a} label={a} active={filterAdmission === a} onClick={() => setFilterAdmission(filterAdmission === a ? null : a)} />
              ))}
            </div>
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <OutlineBtn label="Сбросить" onClick={() => { setFilterGrade(null); setFilterShift(null); setFilterAdmission(null); setFilterSpecialty(null); setFilterDirection(null); setFilterItr(null); }} />
            <GreenBtn label="Применить" onClick={() => doSearch(query)} />
          </div>
        </Card>
      )}

      {!searched ? (
        <>
          {/* История запросов */}
          <section>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div style={{ fontFamily: F.semi, fontSize: 16, color: C.text }}>История запросов</div>
              {history.length > 0 && (
                <button onClick={clearHistory} style={{
                  background: "none", border: "none", cursor: "pointer",
                  fontFamily: F.regular, fontSize: 13, color: C.sub,
                }}>Очистить</button>
              )}
            </div>
            {history.length === 0 ? (
              <div style={{ background: "white", border: `1px solid ${C.border}`, borderRadius: 20, padding: 24, textAlign: "center" }}>
                <div style={{ fontSize: 40, marginBottom: 8 }}>🕐</div>
                <div style={{ fontFamily: F.semi, fontSize: 15, color: C.text, marginBottom: 4 }}>История пуста</div>
                <div style={{ fontFamily: F.regular, fontSize: 13, color: C.sub, lineHeight: "20px" }}>
                  Начните поиск по специальности, разряду или предприятию — запросы сохранятся здесь
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {history.map(h => (
                  <button key={h.id} onClick={() => doSearch(h.query)} style={{
                    background: "white", border: `1px solid ${C.border}`, borderRadius: 14,
                    padding: "12px 16px", cursor: "pointer", textAlign: "left",
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                  }}>
                    <span style={{ fontFamily: F.regular, fontSize: 14, color: C.muted }}>{h.query}</span>
                    <span style={{ fontFamily: F.regular, fontSize: 12, color: C.sub }}>{h.date}</span>
                  </button>
                ))}
              </div>
            )}
          </section>

          {/* Популярные специальности */}
          <section>
            <SectionHeader title="Популярные специальности" />
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {POPULAR_SPECIALTIES.map(s => (
                <button key={s} onClick={() => doSearch(s)} style={{
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
        </>
      ) : (
        <>
          {/* Результаты */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontFamily: F.regular, fontSize: 14, color: C.sub }}>
              Найдено {filtered.length} вакансий
            </span>
            <div style={{ display: "flex", gap: 8 }}>
              <OutlineBtn label="Сохранить запрос" onClick={saveSearch} icon={<Icon.Bookmark size={16} />} />
            </div>
          </div>

          {filtered.length === 0 ? (
            <EmptyState
              icon="🔍"
              title="Ничего не найдено"
              subtitle="Попробуйте снизить требования к разряду или расширить географию"
              action={<GreenBtn label="Сбросить фильтры" onClick={() => { setFilterGrade(null); setFilterShift(null); setFilterAdmission(null); setFilterSpecialty(null); setFilterDirection(null); setFilterItr(null); doSearch(""); }} />}
            />
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {filtered.map(job => (
                <Card key={job.id} onClick={() => navigate(`/employee/vacancies/${job.id}`)}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                    <div>
                      <div style={{ fontFamily: F.semi, fontSize: 16, color: C.text }}>{job.title}</div>
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
                  </div>
                  <div style={{ fontFamily: F.regular, fontSize: 15, color: C.text, marginBottom: 10 }}>
                    ₽ {job.salaryFrom.toLocaleString()} – {job.salaryTo.toLocaleString()}
                    <span style={{ color: C.green }}>/месяц</span>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {!job.isITR && <Chip label={`${job.grade} разряд`} color={C.green} />}
                    {job.isITR && <Chip label="ИТР" color={C.blue} />}
                    <Chip label={job.shift} />
                    {job.admissions.slice(0, 2).map(a => <Chip key={a} label={a} />)}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
