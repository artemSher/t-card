import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { C, F, SPECIALTIES, ADMISSIONS, SHIFTS, GRADES } from "@/data/mockData";
import { Icon } from "@/components/icons/Icons";
import { Card, GreenBtn, OutlineBtn, StatusBadge, EmptyState, SectionHeader, Chip, ProgressBar } from "@/components/ui";
import type { Candidate } from "@/types";

const MOCK_CANDIDATES: Candidate[] = [
  {
    id: 1, name: "Иван Петров", specialty: "Оператор ЧПУ", grade: 5, gradeConfirmed: true,
    city: "Екатеринбург", experience: "6 лет", matchPercent: 95,
    admissions: ["Электробезопасность II", "Работы на высоте"], shift: "2/2",
    description: "Опыт работы на станках ЧПУ Haas и Fanuc. Наладка многоосевых станков, чтение G-кода. Работал в серийном производстве 6 лет.",
    assessments: [
      { name: "Наладка оборудования", score: 95 },
      { name: "Чтение чертежей", score: 88 },
      { name: "Охрана труда", score: 96 },
    ],
  },
  {
    id: 2, name: "Сергей Волков", specialty: "Сварщик", grade: 4, gradeConfirmed: true,
    city: "Челябинск", experience: "4 года", matchPercent: 82,
    admissions: ["Электробезопасность III", "Газорезательные работы"], shift: "Вахта",
    description: "Сварщик 4 разряда. Опыт ручной дуговой и полуавтоматической сварки. Работал на монтаже металлоконструкций.",
    assessments: [
      { name: "Сварка металлоконструкций", score: 85 },
      { name: "Чтение чертежей", score: 78 },
      { name: "Охрана труда", score: 88 },
    ],
  },
  {
    id: 3, name: "Дмитрий Соколов", specialty: "Наладчик оборудования", grade: 5, gradeConfirmed: true,
    city: "Екатеринбург", experience: "8 лет", matchPercent: 91,
    admissions: ["Электробезопасность III", "Промышленная безопасность"], shift: "5/2",
    description: "Наладчик КИПиА. Опыт работы с PLC Siemens, Schneider Electric. Программирование и пусконаладка автоматизированных линий.",
    assessments: [
      { name: "Наладка оборудования", score: 97 },
      { name: "Чтение кинематических схем", score: 94 },
      { name: "Охрана труда", score: 95 },
    ],
  },
  {
    id: 4, name: "Алексей Морозов", specialty: "Электромонтёр", grade: 4, gradeConfirmed: false,
    city: "Екатеринбург", experience: "3 года", matchPercent: 74,
    admissions: ["Электробезопасность II"], shift: "5/2",
    assessments: [
      { name: "Электрооборудование", score: 82 },
      { name: "Измерительные приборы", score: 70 },
      { name: "Охрана труда", score: 85 },
    ],
  },
  {
    id: 5, name: "Максим Кузнецов", specialty: "Токарь", grade: 4, gradeConfirmed: true,
    city: "Нижний Тагил", experience: "5 лет", matchPercent: 80,
    admissions: ["Электробезопасность II"], shift: "2/2",
    assessments: [
      { name: "Токарная обработка", score: 88 },
      { name: "Чтение чертежей", score: 82 },
      { name: "Охрана труда", score: 75 },
    ],
  },
  {
    id: 6, name: "Павел Лебедев", specialty: "Слесарь-монтажник", grade: 3, gradeConfirmed: true,
    city: "Пермь", experience: "2 года", matchPercent: 68,
    admissions: ["Работы на высоте", "Стропальщик"], shift: "2/2",
    assessments: [
      { name: "Монтаж оборудования", score: 72 },
      { name: "Чтение чертежей", score: 65 },
      { name: "Охрана труда", score: 80 },
    ],
  },
];

export function CandidateList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [grade, setGrade] = useState("");
  const [shift, setShift] = useState("");
  const [admission, setAdmission] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = MOCK_CANDIDATES.filter(c => {
    if (search && !c.name.toLowerCase().includes(search.toLowerCase()) &&
        !c.specialty.toLowerCase().includes(search.toLowerCase())) return false;
    if (specialty && c.specialty !== specialty) return false;
    if (grade && c.grade !== Number(grade)) return false;
    if (shift && c.shift !== shift) return false;
    if (admission && !c.admissions.includes(admission)) return false;
    return true;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ fontFamily: F.bold, fontSize: 24, color: C.text }}>Кандидаты</div>

      {/* Поиск */}
      <div style={{ display: "flex", gap: 8 }}>
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Имя или специальность"
          style={{
            flex: 1, padding: "12px 16px", background: "white",
            border: `1px solid ${C.border}`, borderRadius: 14,
            fontFamily: F.regular, fontSize: 15, color: C.text, outline: "none",
          }}
        />
        <button onClick={() => setShowFilters(!showFilters)} style={{
          width: 48, height: 48, borderRadius: 14, border: `1px solid ${C.border}`,
          background: "white", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Icon.Filter size={20} />
        </button>
      </div>

      {/* Фильтры */}
      {showFilters && (
        <Card>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <div style={{ fontFamily: F.semi, fontSize: 13, color: C.sub, marginBottom: 8 }}>Специальность</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                <button onClick={() => setSpecialty("")} style={{
                  padding: "6px 12px", borderRadius: 20, border: "none", cursor: "pointer",
                  background: !specialty ? C.green : C.chip, color: !specialty ? "white" : C.text,
                  fontFamily: F.regular, fontSize: 13,
                }}>Все</button>
                {SPECIALTIES.map(s => (
                  <button key={s} onClick={() => setSpecialty(s)} style={{
                    padding: "6px 12px", borderRadius: 20, border: "none", cursor: "pointer",
                    background: specialty === s ? C.green : C.chip, color: specialty === s ? "white" : C.text,
                    fontFamily: F.regular, fontSize: 13,
                  }}>{s}</button>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontFamily: F.semi, fontSize: 13, color: C.sub, marginBottom: 8 }}>Разряд</div>
              <div style={{ display: "flex", gap: 6 }}>
                <button onClick={() => setGrade("")} style={{
                  padding: "6px 12px", borderRadius: 20, border: "none", cursor: "pointer",
                  background: !grade ? C.green : C.chip, color: !grade ? "white" : C.text,
                  fontFamily: F.regular, fontSize: 13,
                }}>Все</button>
                {GRADES.map(g => (
                  <button key={g} onClick={() => setGrade(String(g))} style={{
                    padding: "6px 12px", borderRadius: 20, border: "none", cursor: "pointer",
                    background: grade === String(g) ? C.green : C.chip, color: grade === String(g) ? "white" : C.text,
                    fontFamily: F.regular, fontSize: 13,
                  }}>{g}</button>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontFamily: F.semi, fontSize: 13, color: C.sub, marginBottom: 8 }}>Сменность</div>
              <div style={{ display: "flex", gap: 6 }}>
                <button onClick={() => setShift("")} style={{
                  padding: "6px 12px", borderRadius: 20, border: "none", cursor: "pointer",
                  background: !shift ? C.green : C.chip, color: !shift ? "white" : C.text,
                  fontFamily: F.regular, fontSize: 13,
                }}>Все</button>
                {SHIFTS.map(s => (
                  <button key={s} onClick={() => setShift(s)} style={{
                    padding: "6px 12px", borderRadius: 20, border: "none", cursor: "pointer",
                    background: shift === s ? C.green : C.chip, color: shift === s ? "white" : C.text,
                    fontFamily: F.regular, fontSize: 13,
                  }}>{s}</button>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontFamily: F.semi, fontSize: 13, color: C.sub, marginBottom: 8 }}>Допуски</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                <button onClick={() => setAdmission("")} style={{
                  padding: "6px 12px", borderRadius: 20, border: "none", cursor: "pointer",
                  background: !admission ? C.green : C.chip, color: !admission ? "white" : C.text,
                  fontFamily: F.regular, fontSize: 13,
                }}>Все</button>
                {ADMISSIONS.map(a => (
                  <button key={a} onClick={() => setAdmission(a)} style={{
                    padding: "6px 12px", borderRadius: 20, border: "none", cursor: "pointer",
                    background: admission === a ? C.green : C.chip, color: admission === a ? "white" : C.text,
                    fontFamily: F.regular, fontSize: 13,
                  }}>{a}</button>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Результаты */}
      <div style={{ fontFamily: F.regular, fontSize: 14, color: C.sub }}>
        Найдено: {filtered.length}
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon="🔍" title="Кандидаты не найдены" subtitle="Измените параметры поиска или фильтры" />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {filtered.map(c => (
            <Card key={c.id} onClick={() => navigate(`/employer/candidates/${c.id}`)}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontFamily: F.semi, fontSize: 16, color: C.text }}>{c.name}</span>
                  </div>
                  <div style={{ fontFamily: F.regular, fontSize: 13, color: C.sub, marginTop: 4 }}>
                    {c.specialty} · {c.grade} разряд · {c.experience} · {c.city}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontFamily: F.bold, fontSize: 20, color: c.matchPercent >= 85 ? C.green : C.amber }}>
                    {c.matchPercent}%
                  </div>
                  <div style={{ fontFamily: F.regular, fontSize: 11, color: C.sub }}>совпадение</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 8 }}>
                {c.admissions.map(a => <Chip key={a} label={a} />)}
              </div>
              {c.description && (
                <div style={{
                  fontFamily: F.regular, fontSize: 13, color: C.sub, marginTop: 10,
                  lineHeight: "20px", overflow: "hidden", textOverflow: "ellipsis",
                  display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
                }}>{c.description}</div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export function CandidateDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invited, setInvited] = useState(false);
  const [favorited, setFavorited] = useState(false);
  const candidate = MOCK_CANDIDATES.find(c => c.id === Number(id));

  if (!candidate) {
    return <EmptyState icon="🔍" title="Кандидат не найден" subtitle="Возможно, данные были удалены" />;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <button onClick={() => navigate("/employer/candidates")} style={{
        background: "none", border: "none", cursor: "pointer",
        display: "flex", alignItems: "center", gap: 6, color: C.sub, alignSelf: "flex-start",
      }}>
        <Icon.ChevronLeft size={18} />
        <span style={{ fontFamily: F.regular, fontSize: 14 }}>К кандидатам</span>
      </button>

      {/* Шапка */}
      <Card>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
          <div style={{
            width: 64, height: 64, borderRadius: "50%", background: "#1a3a5c",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: F.bold, fontSize: 24, color: "white",
          }}>{candidate.name.charAt(0)}</div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontFamily: F.semi, fontSize: 20, color: C.text }}>{candidate.name}</span>
            </div>
            <div style={{ fontFamily: F.regular, fontSize: 14, color: C.sub, marginTop: 4 }}>
              {candidate.specialty} · {candidate.grade} разряд · {candidate.city}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: F.bold, fontSize: 28, color: candidate.matchPercent >= 85 ? C.green : C.amber }}>
              {candidate.matchPercent}%
            </div>
            <div style={{ fontFamily: F.regular, fontSize: 12, color: C.sub }}>совпадение</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <GreenBtn label={invited ? "Приглашено" : "Пригласить"} icon={<Icon.Send size={16} />} onClick={() => setInvited(true)} disabled={invited} />
          <OutlineBtn label={favorited ? "В избранном" : "В избранное"} icon={<Icon.Bookmark size={16} />} onClick={() => setFavorited(!favorited)} active={favorited} />
        </div>
      </Card>

      {/* Описание */}
      {candidate.description && (
        <Card>
          <SectionHeader title="О кандидате" />
          <div style={{ fontFamily: F.regular, fontSize: 15, color: C.text, lineHeight: "22px" }}>
            {candidate.description}
          </div>
        </Card>
      )}

      {/* Опыт */}
      <Card>
        <SectionHeader title="Опыт работы" />
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Icon.Briefcase size={20} />
          <span style={{ fontFamily: F.regular, fontSize: 15, color: C.text }}>{candidate.experience}</span>
        </div>
      </Card>

      {/* Оценки */}
      <Card>
        <SectionHeader title="Результаты оценок" />
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {candidate.assessments.map(a => (
            <div key={a.name}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontFamily: F.regular, fontSize: 14, color: C.text }}>{a.name}</span>
                <span style={{ fontFamily: F.semi, fontSize: 14, color: a.score >= 80 ? C.green : C.amber }}>{a.score}</span>
              </div>
              <ProgressBar value={a.score} color={a.score >= 80 ? C.green : C.amber} />
            </div>
          ))}
        </div>
      </Card>

      {/* Допуски */}
      <Card>
        <SectionHeader title="Допуски" />
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {candidate.admissions.map(a => <Chip key={a} label={a} color={C.green} />)}
        </div>
      </Card>

      {/* Сменность */}
      <Card>
        <SectionHeader title="Предпочтительная сменность" />
        <Chip label={candidate.shift} color={C.blue} />
      </Card>
    </div>
  );
}
