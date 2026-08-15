import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { C, F, MOCK_ASSESSMENTS } from "@/data/mockData";
import { Icon } from "@/components/icons/Icons";
import { Card, GreenBtn, OutlineBtn, Chip, EmptyState, ProgressBar, SuccessScreen, StatusBadge, SectionHeader } from "@/components/ui";
import type { Assessment, AssessmentQuestion } from "@/types";

// ─── Список оценок ───────────────────────────────────────────────────────────
export function AssessmentList() {
  const navigate = useNavigate();
  const assigned = MOCK_ASSESSMENTS.filter(a => a.status === "assigned");
  const completed = MOCK_ASSESSMENTS.filter(a => a.status === "completed");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Назначенные */}
      <section>
        <SectionHeader title="Назначенные оценки" subtitle="Пройдите в срок, чтобы подтвердить или повысить разряд" />
        {assigned.length === 0 ? (
          <EmptyState icon="✅" title="Нет назначенных оценок" subtitle="Новые оценки появятся здесь, когда работодатель их назначит" />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {assigned.map(a => (
              <Card key={a.id} onClick={() => navigate(`/employee/assessments/${a.id}`)} active>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                  <div>
                    <div style={{ fontFamily: F.semi, fontSize: 16, color: C.text }}>{a.title}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                      <Icon.Clock size={14} />
                      <span style={{ fontFamily: F.regular, fontSize: 13, color: C.sub }}>{a.duration}</span>
                    </div>
                  </div>
                  <StatusBadge label="Назначена" color={C.amber} />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <Icon.Calendar size={16} color={C.amber} />
                  <span style={{ fontFamily: F.regular, fontSize: 13, color: C.amber }}>Срок: {a.deadline}</span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Пройденные */}
      <section>
        <SectionHeader title="Пройденные оценки" />
        {completed.length === 0 ? (
          <EmptyState icon="📋" title="Нет пройденных оценок" subtitle="Результаты тестов и кейсов появятся здесь" />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {completed.map(a => (
              <Card key={a.id} onClick={() => navigate(`/employee/assessments/${a.id}`)}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                  <div>
                    <div style={{ fontFamily: F.semi, fontSize: 16, color: C.text }}>{a.title}</div>
                    <div style={{ fontFamily: F.regular, fontSize: 13, color: C.sub, marginTop: 4 }}>
                      Подтверждён {a.confirmedGrade} разряд
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontFamily: F.bold, fontSize: 24, color: C.green }}>{a.score}</div>
                    <div style={{ fontFamily: F.regular, fontSize: 11, color: C.sub }}>баллов</div>
                  </div>
                </div>
                {a.weakZone && (
                  <div style={{
                    background: `${C.amber}10`, borderRadius: 12, padding: "10px 14px",
                    display: "flex", alignItems: "center", gap: 8,
                  }}>
                    <Icon.AlertTriangle size={16} color={C.amber} />
                    <span style={{ fontFamily: F.regular, fontSize: 13, color: C.amber }}>
                      Зона роста: {a.weakZone}
                    </span>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

// ─── Прохождение теста / результат ───────────────────────────────────────────
export function AssessmentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const assessment = MOCK_ASSESSMENTS.find(a => a.id === Number(id));

  const [phase, setPhase] = useState<"intro" | "test" | "result">(
    assessment?.status === "completed" ? "result" : "intro"
  );
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);

  if (!assessment) {
    return <EmptyState icon="🔍" title="Оценка не найдена" subtitle="Возможно, данные были удалены" />;
  }

  // ─── Result ────────────────────────────────────────────────────────────────
  if (phase === "result" || assessment.status === "completed") {
    const score = assessment.score ?? (() => {
      if (!assessment.questions) return 0;
      const correct = answers.filter((a, i) => a === assessment.questions![i].correctIndex).length;
      return Math.round((correct / assessment.questions.length) * 100);
    })();

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <button onClick={() => navigate("/employee/assessments")} style={{
          background: "none", border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", gap: 6, color: C.sub, alignSelf: "flex-start",
        }}>
          <Icon.ChevronLeft size={18} />
          <span style={{ fontFamily: F.regular, fontSize: 14 }}>К оценкам</span>
        </button>

        <Card style={{ textAlign: "center", padding: 32 }}>
          <div style={{
            width: 80, height: 80, borderRadius: "50%", background: `${C.green}18`,
            display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 16,
          }}>
            <span style={{ fontFamily: F.bold, fontSize: 32, color: C.green }}>{score}</span>
          </div>
          <div style={{ fontFamily: F.bold, fontSize: 22, color: C.text, marginBottom: 8 }}>
            {score >= 80 ? "Оценка пройдена" : "Зона роста"}
          </div>
          <div style={{ fontFamily: F.regular, fontSize: 15, color: C.sub, lineHeight: "22px", marginBottom: 16 }}>
            {assessment.confirmedGrade
              ? `Подтверждён ${assessment.confirmedGrade} разряд`
              : score >= 80
                ? "Результат выше проходного порога. Разряд будет подтверждён после проверки."
                : "Результат ниже проходного порога. Рекомендуем подготовиться и пройти заново."}
          </div>
          <StatusBadge
            label={score >= 80 ? "Успешно" : "Требуется подготовка"}
            color={score >= 80 ? C.green : C.amber}
          />
        </Card>

        {/* Темы */}
        {assessment.topics && (
          <Card>
            <SectionHeader title="Результаты по темам" />
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {assessment.topics.map(t => (
                <div key={t.name}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontFamily: F.regular, fontSize: 14, color: C.text }}>{t.name}</span>
                    <span style={{ fontFamily: F.semi, fontSize: 14, color: t.score >= 80 ? C.green : C.amber }}>{t.score}</span>
                  </div>
                  <ProgressBar value={t.score} color={t.score >= 80 ? C.green : C.amber} />
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Зона роста */}
        {assessment.weakZone && (
          <Card style={{ border: `2px solid ${C.amber}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <Icon.AlertTriangle size={22} color={C.amber} />
              <div>
                <div style={{ fontFamily: F.semi, fontSize: 15, color: C.text }}>Зона роста: {assessment.weakZone}</div>
                <div style={{ fontFamily: F.regular, fontSize: 13, color: C.sub }}>
                  Рекомендуем программу обучения для закрепления навыка
                </div>
              </div>
            </div>
            <GreenBtn label="К программам обучения" onClick={() => navigate("/employee/development")} />
          </Card>
        )}

        <div style={{ display: "flex", gap: 8 }}>
          <OutlineBtn label="Скачать PDF" full icon={<Icon.Download size={16} />} onClick={() => window.print()} />
          <OutlineBtn label="Поделиться" icon={<Icon.Link size={16} />} onClick={() => {
            if (navigator.share) {
              navigator.share({ title: assessment.title, text: `Мой результат: ${score} баллов` });
            } else {
              navigator.clipboard?.writeText(`Мой результат по оценке «${assessment.title}»: ${score} баллов`);
            }
          }} />
        </div>
      </div>
    );
  }

  // ─── Intro ─────────────────────────────────────────────────────────────────
  if (phase === "intro") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <button onClick={() => navigate("/employee/assessments")} style={{
          background: "none", border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", gap: 6, color: C.sub, alignSelf: "flex-start",
        }}>
          <Icon.ChevronLeft size={18} />
          <span style={{ fontFamily: F.regular, fontSize: 14 }}>К оценкам</span>
        </button>

        <Card>
          <div style={{ fontFamily: F.semi, fontSize: 20, color: C.text, marginBottom: 12 }}>{assessment.title}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Icon.Clock size={18} />
              <span style={{ fontFamily: F.regular, fontSize: 14, color: C.muted }}>Длительность: {assessment.duration}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Icon.Calendar size={18} color={C.amber} />
              <span style={{ fontFamily: F.regular, fontSize: 14, color: C.muted }}>Срок сдачи: {assessment.deadline}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Icon.CheckCircle size={18} />
              <span style={{ fontFamily: F.regular, fontSize: 14, color: C.muted }}>
                Проходной порог: 80 баллов
              </span>
            </div>
          </div>
          <div style={{
            background: `${C.blue}10`, borderRadius: 14, padding: "14px 16px",
            marginBottom: 20, display: "flex", alignItems: "flex-start", gap: 10,
          }}>
            <Icon.AlertTriangle size={18} color={C.blue} />
            <span style={{ fontFamily: F.regular, fontSize: 13, color: C.muted, lineHeight: "20px" }}>
              Тест можно пройти один раз. Убедитесь, что у вас стабильное соединение и достаточно времени.
            </span>
          </div>
          <GreenBtn label="Начать оценку" full onClick={() => setPhase("test")} />
        </Card>
      </div>
    );
  }

  // ─── Test ──────────────────────────────────────────────────────────────────
  const questions = assessment.questions ?? [];

  // Guard: case-type assessment with no questions
  if (questions.length === 0) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <button onClick={() => navigate("/employee/assessments")} style={{
          background: "none", border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", gap: 6, color: C.sub, alignSelf: "flex-start",
        }}>
          <Icon.ChevronLeft size={18} />
          <span style={{ fontFamily: F.regular, fontSize: 14 }}>К оценкам</span>
        </button>

        <Card>
          <div style={{ fontFamily: F.semi, fontSize: 20, color: C.text, marginBottom: 12 }}>{assessment.title}</div>
          <div style={{
            background: `${C.blue}10`, borderRadius: 14, padding: "16px 18px",
            marginBottom: 20, display: "flex", alignItems: "flex-start", gap: 10,
          }}>
            <Icon.AlertTriangle size={18} color={C.blue} />
            <span style={{ fontFamily: F.regular, fontSize: 14, color: C.muted, lineHeight: "22px" }}>
              Это производственный кейс. Описание задания и материалы будут предоставлены работодателем. Свяжитесь с HR-специалистом для получения подробной информации.
            </span>
          </div>
          <GreenBtn label="К оценкам" full onClick={() => navigate("/employee/assessments")} />
        </Card>
      </div>
    );
  }

  const q = questions[currentQ];

  function nextQuestion() {
    if (selected === null) return;
    const newAnswers = [...answers, selected];
    setAnswers(newAnswers);
    setSelected(null);
    if (currentQ + 1 < questions.length) {
      setCurrentQ(currentQ + 1);
    } else {
      setPhase("result");
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Прогресс */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontFamily: F.regular, fontSize: 14, color: C.sub }}>
            Вопрос {currentQ + 1} из {questions.length}
          </span>
          <span style={{ fontFamily: F.regular, fontSize: 14, color: C.green }}>
            {Math.round(((currentQ) / questions.length) * 100)}%
          </span>
        </div>
        <ProgressBar value={(currentQ / questions.length) * 100} />
      </div>

      {/* Вопрос */}
      <Card>
        <div style={{ fontFamily: F.semi, fontSize: 18, color: C.text, lineHeight: "26px", marginBottom: 20 }}>
          {q.text}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {q.options.map((opt, i) => (
            <button key={i} onClick={() => setSelected(i)} style={{
              background: selected === i ? `${C.green}08` : C.bg,
              border: selected === i ? `2px solid ${C.green}` : `1px solid ${C.border}`,
              borderRadius: 14, padding: "14px 18px", cursor: "pointer", textAlign: "left",
              transition: "all 0.15s",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{
                  width: 24, height: 24, borderRadius: "50%",
                  border: selected === i ? `2px solid ${C.green}` : `2px solid ${C.border}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}>
                  {selected === i && <div style={{ width: 12, height: 12, borderRadius: "50%", background: C.green }} />}
                </div>
                <span style={{ fontFamily: F.regular, fontSize: 15, color: C.text }}>{opt}</span>
              </div>
            </button>
          ))}
        </div>
      </Card>

      <div style={{ display: "flex", gap: 8 }}>
        <OutlineBtn label="Пропустить" onClick={() => { setSelected(-1); nextQuestion(); }} />
        <GreenBtn label={currentQ + 1 < questions.length ? "Далее" : "Завершить"} onClick={nextQuestion} disabled={selected === null} />
      </div>
    </div>
  );
}
