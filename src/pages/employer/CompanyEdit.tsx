import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { C, F, MOCK_COMPANY } from "@/data/mockData";
import { Icon } from "@/components/icons/Icons";
import { Card, GreenBtn, OutlineBtn, SectionHeader, Input, SuccessScreen, TextArea } from "@/components/ui";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import type { Company } from "@/types";

export function CompanyEdit() {
  const navigate = useNavigate();
  const [company, setCompany] = useLocalStorage<Company>("tcard:employer:company", MOCK_COMPANY);
  const [name, setName] = useState(company.name);
  const [inn, setInn] = useState(company.inn);
  const [industry, setIndustry] = useState(company.industry);
  const [address, setAddress] = useState(company.address);
  const [description, setDescription] = useState(company.description ?? "");
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setCompany(prev => ({ ...prev, name, inn, industry, address, description }));
    setSaved(true);
  }

  if (saved) {
    return (
      <div style={{ padding: 20 }}>
        <SuccessScreen
          title="Профиль обновлён"
          subtitle="Изменения сохранены и отображаются в карточке компании."
          buttonText="Вернуться к профилю"
          onButton={() => navigate("/employer/company")}
        />
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <button onClick={() => navigate("/employer/company")} style={{
        background: "none", border: "none", cursor: "pointer",
        display: "flex", alignItems: "center", gap: 6, color: C.sub, alignSelf: "flex-start",
      }}>
        <Icon.ChevronLeft size={18} />
        <span style={{ fontFamily: F.regular, fontSize: 14 }}>Назад</span>
      </button>

      <div style={{ fontFamily: F.bold, fontSize: 24, color: C.text }}>Редактировать профиль</div>

      <Card>
        <SectionHeader title="Основные данные" />
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Input label="Название компании" value={name} onChange={setName} placeholder="Название" />
          <Input label="ИНН" value={inn} onChange={setInn} placeholder="ИНН" type="tel" />
          <Input label="Отрасль" value={industry} onChange={setIndustry} placeholder="Отрасль" />
          <Input label="Адрес" value={address} onChange={setAddress} placeholder="Адрес" />
          <TextArea label="Описание компании" value={description} onChange={setDescription} placeholder="Расскажите о вашей компании: чем занимаетесь, сколько лет на рынке, какие ценности разделяете..." rows={5} />
        </div>
      </Card>

      <div style={{ display: "flex", gap: 10 }}>
        <GreenBtn label="Сохранить" full onClick={handleSave} disabled={!name.trim()} />
        <OutlineBtn label="Отмена" onClick={() => navigate("/employer/company")} />
      </div>
    </div>
  );
}
