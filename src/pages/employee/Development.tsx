import React from "react";
import { useNavigate } from "react-router-dom";
import { C, F, MOCK_TRACKS, MOCK_CERTIFICATES } from "@/data/mockData";
import { Icon } from "@/components/icons/Icons";
import { Card, GreenBtn, OutlineBtn, Chip, SectionHeader, ProgressBar, StatusBadge, EmptyState } from "@/components/ui";

export function DevelopmentPage() {
  const navigate = useNavigate();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Треки развития */}
      <section>
        <SectionHeader title="Треки развития" subtitle="Индивидуальные планы роста компетенций" />
        {MOCK_TRACKS.length === 0 ? (
          <EmptyState icon="📈" title="Нет активных треков" subtitle="Трек развития назначает работодатель или вы можете создать его сами" />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {MOCK_TRACKS.map(track => (
              <Card key={track.id}>
                {/* Заголовок */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                  <div>
                    <div style={{ fontFamily: F.semi, fontSize: 17, color: C.text }}>{track.goal}</div>
                    <div style={{ fontFamily: F.regular, fontSize: 13, color: C.sub, marginTop: 4 }}>
                      Дедлайн: {track.deadline}
                    </div>
                  </div>
                  {track.assignedByEmployer && <StatusBadge label="От работодателя" color={C.blue} />}
                </div>

                {/* Прогресс */}
                <div style={{ marginBottom: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontFamily: F.regular, fontSize: 13, color: C.sub }}>Прогресс</span>
                    <span style={{ fontFamily: F.semi, fontSize: 13, color: C.green }}>{track.progress}%</span>
                  </div>
                  <ProgressBar value={track.progress} />
                </div>

                {/* Контрольные точки */}
                <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 16 }}>
                  {track.checkpoints.map((cp, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{
                        width: 28, height: 28, borderRadius: "50%",
                        background: cp.status === "done" ? C.green : cp.status === "reminder" ? `${C.amber}20` : C.border,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0,
                      }}>
                        {cp.status === "done" && <Icon.Check size={14} color="white" />}
                        {cp.status === "reminder" && <Icon.Clock size={14} color={C.amber} />}
                        {cp.status === "planned" && <span style={{ fontSize: 11, color: C.sub }}>{i + 1}</span>}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{
                          fontFamily: F.regular, fontSize: 14,
                          color: cp.status === "done" ? C.text : cp.status === "reminder" ? C.amber : C.sub,
                        }}>{cp.name}</div>
                        {cp.date && <div style={{ fontFamily: F.regular, fontSize: 12, color: C.sub }}>{cp.date}</div>}
                      </div>
                      {cp.status === "reminder" && <StatusBadge label="Напоминание" color={C.amber} />}
                    </div>
                  ))}
                </div>

                {/* Рекомендованные программы */}
                <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 16 }}>
                  <div style={{ fontFamily: F.semi, fontSize: 14, color: C.text, marginBottom: 12 }}>Рекомендованные программы</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {track.recommendedPrograms.map(prog => (
                      <div key={prog.id} style={{
                        background: C.bg, borderRadius: 14, padding: "14px 16px",
                      }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                          <div>
                            <div style={{ fontFamily: F.semi, fontSize: 14, color: C.text }}>{prog.title}</div>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                              <span style={{ fontFamily: F.regular, fontSize: 12, color: C.sub }}>{prog.duration}</span>
                              <span style={{ fontFamily: F.regular, fontSize: 12, color: C.sub }}>·</span>
                              <span style={{ fontFamily: F.regular, fontSize: 12, color: C.sub }}>{prog.format}</span>
                            </div>
                          </div>
                          {prog.paidByEmployer && <Chip label="Оплачивает работодатель" color={C.green} />}
                        </div>
                        {prog.modulesProgress !== undefined && prog.modulesTotal && (
                          <div>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                              <span style={{ fontFamily: F.regular, fontSize: 12, color: C.sub }}>
                                {prog.modulesProgress} из {prog.modulesTotal} модулей
                              </span>
                              <span style={{ fontFamily: F.regular, fontSize: 12, color: C.green }}>
                                {Math.round((prog.modulesProgress / prog.modulesTotal) * 100)}%
                              </span>
                            </div>
                            <ProgressBar value={(prog.modulesProgress / prog.modulesTotal) * 100} height={4} />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Сертификаты */}
      <section>
        <SectionHeader title="Сертификаты" subtitle="Документы о пройденных программах" />
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {MOCK_CERTIFICATES.map(cert => (
            <Card key={cert.id}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{
                  width: 44, height: 44, background: `${C.green}14`, borderRadius: 12,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Icon.Award size={22} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: F.semi, fontSize: 15, color: C.text }}>{cert.title}</div>
                  <div style={{ fontFamily: F.regular, fontSize: 12, color: C.sub }}>
                    Выдан: {cert.issueDate}
                    {cert.expiryDate !== "permanent" && ` · Действует до: ${cert.expiryDate}`}
                    {cert.expiryDate === "permanent" && " · Бессрочно"}
                  </div>
                </div>
                <button style={{
                  background: C.bg, border: `1px solid ${C.border}`, borderRadius: 12,
                  width: 40, height: 40, cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Icon.Download size={18} />
                </button>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
