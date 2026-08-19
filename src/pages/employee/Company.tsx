import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { C, F, MOCK_VACANCIES, MOCK_COMPANY } from "@/data/mockData";
import { Icon } from "@/components/icons/Icons";
import { Card, Chip, EmptyState, SectionHeader } from "@/components/ui";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import type { Company } from "@/types";

export function CompanyProfilePage() {
  const { name } = useParams();
  const navigate = useNavigate();
  const companyName = decodeURIComponent(name ?? "");
  const [employerCompany] = useLocalStorage<Company>("tcard:employer:company", MOCK_COMPANY);

  const vacancies = MOCK_VACANCIES.filter(v => v.company === companyName);

  if (vacancies.length === 0) {
    return <EmptyState icon="🔍" title="Компания не найдена" subtitle="Возможно, данные были удалены" />;
  }

  const { rating, reviewsCount, city } = vacancies[0];
  const description = employerCompany.name === companyName ? employerCompany.description : undefined;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <button onClick={() => navigate(-1)} style={{
        background: "none", border: "none", cursor: "pointer",
        display: "flex", alignItems: "center", gap: 6, color: C.sub, alignSelf: "flex-start",
      }}>
        <Icon.ChevronLeft size={18} />
        <span style={{ fontFamily: F.regular, fontSize: 14 }}>Назад</span>
      </button>

      {/* Шапка компании */}
      <Card>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
          <div style={{
            width: 64, height: 64, borderRadius: 16, background: "#1a3a5c",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: F.bold, fontSize: 24, color: "white", flexShrink: 0,
          }}>{companyName.charAt(0)}</div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontFamily: F.semi, fontSize: 20, color: C.text }}>{companyName}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 4 }}>
              {[...Array(5)].map((_, i) => <Icon.Star key={i} />)}
              <span style={{ fontFamily: F.regular, fontSize: 13, color: C.sub, marginLeft: 4 }}>
                {rating} · {reviewsCount} отзывов
              </span>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <Icon.Location />
          <span style={{ fontFamily: F.regular, fontSize: 14, color: C.green }}>{city}</span>
        </div>
      </Card>

      {/* Описание компании */}
      {description && (
        <Card>
          <SectionHeader title="О компании" />
          <div style={{ fontFamily: F.regular, fontSize: 14, color: C.muted, lineHeight: "22px" }}>
            {description}
          </div>
        </Card>
      )}

      {/* Открытые вакансии */}
      <Card>
        <SectionHeader title="Открытые вакансии" subtitle={`${vacancies.length} вакансий`} />
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {vacancies.map(job => (
            <div key={job.id} onClick={() => navigate(`/employee/vacancies/${job.id}`)} style={{
              background: C.bg, borderRadius: 14, padding: "14px 16px", cursor: "pointer",
            }}>
              <div style={{ fontFamily: F.semi, fontSize: 15, color: C.text, marginBottom: 6 }}>{job.title}</div>
              <div style={{ fontFamily: F.regular, fontSize: 13, color: C.sub, marginBottom: 8 }}>
                {job.city} · {job.shift}
              </div>
              <div style={{ fontFamily: F.regular, fontSize: 14, color: C.text, marginBottom: 8 }}>
                ₽ {job.salaryFrom.toLocaleString()} – {job.salaryTo.toLocaleString()}
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {job.isITR ? (
                  job.itrRequirements?.slice(0, 3).map(req => <Chip key={req} label={req} />)
                ) : (
                  <>
                    <Chip label={`${job.grade} разряд`} />
                    {job.admissions.slice(0, 2).map(a => <Chip key={a} label={a} />)}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
