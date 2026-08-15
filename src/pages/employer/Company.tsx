import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { C, F, MOCK_COMPANY } from "@/data/mockData";
import { Icon } from "@/components/icons/Icons";
import { Card, GreenBtn, OutlineBtn, SectionHeader, Chip, KPITile, Input } from "@/components/ui";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import type { Company } from "@/types";

export function CompanyProfile() {
  const navigate = useNavigate();
  const [company, setCompany] = useLocalStorage<Company>("tcard:employer:company", MOCK_COMPANY);
  const [showAddDept, setShowAddDept] = useState(false);
  const [newDept, setNewDept] = useState("");

  function addDepartment() {
    if (!newDept.trim()) return;
    setCompany(prev => ({ ...prev, departments: [...prev.departments, newDept.trim()] }));
    setNewDept("");
    setShowAddDept(false);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ fontFamily: F.bold, fontSize: 24, color: C.text }}>Компания</div>

      {/* Шапка компании */}
      <Card style={{ background: `linear-gradient(135deg, #1a3a5c 0%, #2d5a87 100%)`, border: "none" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
          <div style={{
            width: 72, height: 72, background: "rgba(255,255,255,0.15)", borderRadius: 18,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Icon.Building size={36} color="#ffffff" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontFamily: F.bold, fontSize: 22, color: "white" }}>{MOCK_COMPANY.name}</span>
              {MOCK_COMPANY.verified && <Icon.Verified size={20} />}
            </div>
            <div style={{ fontFamily: F.regular, fontSize: 14, color: "rgba(255,255,255,0.8)", marginTop: 4 }}>
              {company.industry}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 24 }}>
          <div>
            <div style={{ fontFamily: F.bold, fontSize: 20, color: "white" }}>{company.rating}</div>
            <div style={{ fontFamily: F.regular, fontSize: 12, color: "rgba(255,255,255,0.7)" }}>Рейтинг</div>
          </div>
          <div>
            <div style={{ fontFamily: F.bold, fontSize: 20, color: "white" }}>{company.reviewsCount}</div>
            <div style={{ fontFamily: F.regular, fontSize: 12, color: "rgba(255,255,255,0.7)" }}>Отзывов</div>
          </div>
        </div>
      </Card>

      {/* KPI */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12 }}>
        <KPITile value="3" label="Активных вакансий" color={C.green} />
        <KPITile value="31" label="Откликов" color={C.amber} />
        <KPITile value="523" label="Просмотров" color={C.blue} />
        <KPITile value="3" label="Наймов" color={C.green} />
      </div>

      {/* Информация */}
      <Card>
        <SectionHeader title="Реквизиты" />
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontFamily: F.regular, fontSize: 14, color: C.sub }}>ИНН</span>
            <span style={{ fontFamily: F.semi, fontSize: 14, color: C.text }}>{company.inn}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontFamily: F.regular, fontSize: 14, color: C.sub }}>Отрасль</span>
            <span style={{ fontFamily: F.semi, fontSize: 14, color: C.text }}>{company.industry}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontFamily: F.regular, fontSize: 14, color: C.sub }}>Адрес</span>
            <span style={{ fontFamily: F.semi, fontSize: 14, color: C.text, textAlign: "right" }}>{company.address}</span>
          </div>
        </div>
      </Card>

      {/* Подразделения */}
      <Card>
        <SectionHeader title="Подразделения" subtitle="Используются при создании вакансий" />
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {company.departments.map(d => (
            <div key={d} onClick={() => navigate(`/employer/vacancies?dept=${encodeURIComponent(d)}`)} style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "12px 16px", background: C.bg, borderRadius: 14,
              cursor: "pointer", transition: "background 0.15s",
            }}>
              <Icon.Folder size={20} />
              <span style={{ fontFamily: F.regular, fontSize: 14, color: C.text }}>{d}</span>
              <div style={{ marginLeft: "auto" }}><Icon.ChevronRight size={16} color={C.sub} /></div>
            </div>
          ))}
        </div>
        {showAddDept && (
          <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
            <Input value={newDept} onChange={setNewDept} placeholder="Название подразделения" />
            <GreenBtn label="Добавить" onClick={addDepartment} disabled={!newDept.trim()} />
          </div>
        )}
        <div style={{ marginTop: 14 }}>
          <OutlineBtn label="Добавить подразделение" icon={<Icon.Plus size={16} />} onClick={() => setShowAddDept(!showAddDept)} />
        </div>
      </Card>

      {/* Верификация */}
      <Card>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{
            width: 48, height: 48, background: `${C.green}14`, borderRadius: 12,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Icon.Verified size={24} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: F.semi, fontSize: 15, color: C.text }}>Компания верифицирована</div>
            <div style={{ fontFamily: F.regular, fontSize: 13, color: C.sub }}>
              Подтверждены реквизиты и право деятельности
            </div>
          </div>
          <Icon.CheckCircle size={24} color={C.green} />
        </div>
      </Card>

      <div style={{ display: "flex", gap: 8 }}>
        <OutlineBtn label="Редактировать профиль" full onClick={() => navigate("/employer/company/edit")} />
        <OutlineBtn label="Документы" icon={<Icon.Download size={16} />} />
      </div>
    </div>
  );
}
