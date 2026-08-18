import React from "react";
import { useNavigate } from "react-router-dom";
import { C, F } from "@/data/mockData";
import { Card, StatusBadge, EmptyState, SectionHeader } from "@/components/ui";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import type { AssignedAssessment } from "@/data/mockData";

export function EmployerAssessmentsPage() {
  const navigate = useNavigate();
  const [assessments] = useLocalStorage<AssignedAssessment[]>("tcard:employer:assignedAssessments", []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ fontFamily: F.bold, fontSize: 24, color: C.text }}>Тестирование</div>
      <div style={{ fontFamily: F.regular, fontSize: 14, color: C.sub }}>
        Тестовые задания, назначенные кандидатам между рассмотрением и собеседованием. Это необязательный инструмент оценки.
      </div>

      {assessments.length === 0 ? (
        <EmptyState
          icon="📝"
          title="Нет назначенных тестов"
          subtitle="Назначьте тестовое задание кандидату со страницы отклика, между этапами «Рассмотрение» и «Собеседование»"
        />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {assessments.map(a => (
            <Card key={a.id} onClick={() => navigate(`/employer/applications/${a.applicationId}`)}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <div>
                  <div style={{ fontFamily: F.semi, fontSize: 16, color: C.text }}>{a.candidateName}</div>
                  <div style={{ fontFamily: F.regular, fontSize: 13, color: C.sub, marginTop: 4 }}>{a.vacancyTitle}</div>
                </div>
                <StatusBadge
                  label={a.status === "completed" ? "Пройден" : a.status === "expired" ? "Истёк" : "Назначен"}
                  color={a.status === "completed" ? C.green : a.status === "expired" ? C.red : C.amber}
                />
              </div>
              <div style={{ fontFamily: F.regular, fontSize: 14, color: C.text, marginBottom: 4 }}>{a.title}</div>
              <div style={{ fontFamily: F.regular, fontSize: 12, color: C.sub }}>
                {a.duration} · Срок: {a.deadline}
                {a.status === "completed" && a.score !== undefined ? ` · Результат: ${a.score}` : ""}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
