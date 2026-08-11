import React from "react";
import { C, F, MOCK_ANALYTICS } from "@/data/mockData";
import { Icon } from "@/components/icons/Icons";
import { Card, SectionHeader, KPITile, ProgressBar, Chip } from "@/components/ui";

export function AnalyticsPage() {
  const { viewsByDay, topVacancies, funnel, sources } = MOCK_ANALYTICS;
  const totalViews = viewsByDay.reduce((s, d) => s + d.views, 0);
  const totalResponses = viewsByDay.reduce((s, d) => s + d.responses, 0);
  const conversion = ((totalResponses / totalViews) * 100).toFixed(1);
  const maxViews = Math.max(...viewsByDay.map(d => d.views));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ fontFamily: F.bold, fontSize: 24, color: C.text }}>Аналитика</div>

      {/* KPI */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12 }}>
        <KPITile value={String(totalViews)} label="Просмотры за неделю" color={C.blue} />
        <KPITile value={String(totalResponses)} label="Отклики за неделю" color={C.green} />
        <KPITile value={`${conversion}%`} label="Конверсия" color={C.amber} />
        <KPITile value="3" label="Оффера" />
      </div>

      {/* График просмотров и откликов */}
      <Card>
        <SectionHeader title="Просмотры и отклики" subtitle="За последние 7 дней" />
        <div style={{ display: "flex", alignItems: "flex-end", gap: 12, height: 160, padding: "0 8px" }}>
          {viewsByDay.map(d => {
            const viewH = (d.views / maxViews) * 100;
            const respH = (d.responses / Math.max(...viewsByDay.map(x => x.responses)) * 100);
            return (
              <div key={d.day} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <div style={{ display: "flex", gap: 3, alignItems: "flex-end", height: 110 }}>
                  <div style={{
                    width: 14, height: `${viewH}%`, background: C.blue, borderRadius: "3px 3px 0 0",
                    minHeight: 4, opacity: 0.85,
                  }} title={`${d.views} просмотров`} />
                  <div style={{
                    width: 14, height: `${respH}%`, background: C.green, borderRadius: "3px 3px 0 0",
                    minHeight: 4, opacity: 0.85,
                  }} title={`${d.responses} откликов`} />
                </div>
                <div style={{ fontFamily: F.regular, fontSize: 10, color: C.sub }}>{d.day}</div>
              </div>
            );
          })}
        </div>
        <div style={{ display: "flex", gap: 16, marginTop: 12, justifyContent: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 12, height: 12, background: C.blue, borderRadius: 3 }} />
            <span style={{ fontFamily: F.regular, fontSize: 12, color: C.sub }}>Просмотры</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 12, height: 12, background: C.green, borderRadius: 3 }} />
            <span style={{ fontFamily: F.regular, fontSize: 12, color: C.sub }}>Отклики</span>
          </div>
        </div>
      </Card>

      {/* Воронка */}
      <Card>
        <SectionHeader title="Воронка найма" />
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {funnel.map((stage, i) => {
            const prevCount = i > 0 ? funnel[i - 1].count : stage.count;
            const width = (stage.count / funnel[0].count) * 100;
            const dropOff = i > 0 ? (((prevCount - stage.count) / prevCount) * 100).toFixed(0) : null;
            return (
              <div key={stage.stage}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontFamily: F.regular, fontSize: 14, color: C.text }}>{stage.stage}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {dropOff && <span style={{ fontFamily: F.regular, fontSize: 12, color: C.sub }}>-{dropOff}%</span>}
                    <span style={{ fontFamily: F.semi, fontSize: 14, color: C.text }}>{stage.count}</span>
                  </div>
                </div>
                <div style={{ background: C.border, borderRadius: 6, height: 12, overflow: "hidden" }}>
                  <div style={{
                    width: `${width}%`, height: "100%",
                    background: i === 0 ? C.blue : i === funnel.length - 1 ? C.green : `${C.blue}aa`,
                    borderRadius: 6, transition: "width 0.3s",
                  }} />
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Топ вакансий */}
      <Card>
        <SectionHeader title="Эффективность вакансий" />
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {topVacancies.map(v => (
            <div key={v.title} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "12px 0", borderBottom: `1px solid ${C.border}`,
            }}>
              <div>
                <div style={{ fontFamily: F.semi, fontSize: 14, color: C.text }}>{v.title}</div>
                <div style={{ display: "flex", gap: 12, marginTop: 4 }}>
                  <span style={{ fontFamily: F.regular, fontSize: 12, color: C.sub }}>
                    {v.views} просмотров
                  </span>
                  <span style={{ fontFamily: F.regular, fontSize: 12, color: C.sub }}>
                    {v.responses} откликов
                  </span>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontFamily: F.bold, fontSize: 18, color: C.green }}>{v.conversion}%</div>
                <div style={{ fontFamily: F.regular, fontSize: 11, color: C.sub }}>конверсия</div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Источники */}
      <Card>
        <SectionHeader title="Источники откликов" />
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {sources.map(s => (
            <div key={s.name}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontFamily: F.regular, fontSize: 14, color: C.text }}>{s.name}</span>
                <span style={{ fontFamily: F.semi, fontSize: 14, color: C.text }}>{s.percent}%</span>
              </div>
              <ProgressBar value={s.percent} color={C.blue} />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
