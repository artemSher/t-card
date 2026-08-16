import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { C, F, MOCK_NOTIFICATIONS, MOCK_SECURITY_LOG, MOCK_SAVED_SEARCHES } from "@/data/mockData";
import { Icon } from "@/components/icons/Icons";
import { Card, GreenBtn, OutlineBtn, Chip, Input, Toggle, SectionHeader, StatusBadge, EmptyState } from "@/components/ui";
import { useApp } from "@/context/AppContext";
import { useLocalStorage } from "@/hooks/useLocalStorage";

// ─── Уведомления ─────────────────────────────────────────────────────────────
export function NotificationsPage() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useLocalStorage("tcard:notifications", MOCK_NOTIFICATIONS);

  function markRead(id: number) {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }

  function markAllRead() {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }

  const today = notifications.filter(n => n.dateGroup === "today");
  const yesterday = notifications.filter(n => n.dateGroup === "yesterday");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontFamily: F.bold, fontSize: 22, color: C.text }}>Уведомления</div>
        <button onClick={markAllRead} style={{
          background: "none", border: "none", cursor: "pointer",
          fontFamily: F.regular, fontSize: 14, color: C.green,
        }}>Прочитать все</button>
      </div>

      {today.length > 0 && (
        <section>
          <div style={{ fontFamily: F.semi, fontSize: 14, color: C.sub, marginBottom: 10 }}>Сегодня</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {today.map(n => (
              <Card key={n.id} onClick={() => markRead(n.id)} style={{
                border: n.read ? `1px solid ${C.border}` : `2px solid ${C.green}`,
                padding: 16,
              }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  {!n.read && <Icon.Dot />}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: F.regular, fontSize: 14, color: C.text, lineHeight: "20px" }}>{n.text}</div>
                    <div style={{ fontFamily: F.regular, fontSize: 12, color: C.sub, marginTop: 4 }}>{n.time}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      {yesterday.length > 0 && (
        <section>
          <div style={{ fontFamily: F.semi, fontSize: 14, color: C.sub, marginBottom: 10 }}>Вчера</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {yesterday.map(n => (
              <Card key={n.id} onClick={() => markRead(n.id)} style={{ padding: 16 }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: F.regular, fontSize: 14, color: C.text, lineHeight: "20px" }}>{n.text}</div>
                    <div style={{ fontFamily: F.regular, fontSize: 12, color: C.sub, marginTop: 4 }}>{n.time}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      {notifications.length === 0 && (
        <EmptyState icon="🔔" title="Нет уведомлений" subtitle="Новые отклики, приглашения и оценки будут показаны здесь" />
      )}
    </div>
  );
}

// ─── Настройки ───────────────────────────────────────────────────────────────
export function SettingsPage() {
  const navigate = useNavigate();
  const { settings, setSettings, user, setUser, savedSearches, toggleSavedSearchNotifications, logout } = useApp();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ fontFamily: F.bold, fontSize: 22, color: C.text }}>Настройки</div>

      {/* Профиль */}
      <Card>
        <SectionHeader title="Профиль" />
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Input label="Имя" value={user.name} onChange={v => setUser({ ...user, name: v })} />
          <Input label="Телефон" value={settings.phone} onChange={v => setSettings({ ...settings, phone: v })} type="tel" />
          <Input label="Email" value={settings.email} onChange={v => setSettings({ ...settings, email: v })} type="email" />
        </div>
      </Card>

      {/* Безопасность */}
      <Card>
        <SectionHeader title="Безопасность" />
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontFamily: F.semi, fontSize: 14, color: C.text }}>ПИН-код</div>
              <div style={{ fontFamily: F.regular, fontSize: 12, color: C.sub }}>Дополнительная защита при входе</div>
            </div>
            <Toggle checked={settings.pinEnabled} onChange={v => setSettings({ ...settings, pinEnabled: v })} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontFamily: F.semi, fontSize: 14, color: C.text }}>Face ID</div>
              <div style={{ fontFamily: F.regular, fontSize: 12, color: C.sub }}>Вход по лицу</div>
            </div>
            <Toggle checked={settings.faceIdEnabled} onChange={v => setSettings({ ...settings, faceIdEnabled: v })} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontFamily: F.semi, fontSize: 14, color: C.text }}>Touch ID</div>
              <div style={{ fontFamily: F.regular, fontSize: 12, color: C.sub }}>Вход по отпечатку</div>
            </div>
            <Toggle checked={settings.touchIdEnabled} onChange={v => setSettings({ ...settings, touchIdEnabled: v })} />
          </div>
        </div>
      </Card>

      {/* Уведомления */}
      <Card>
        <SectionHeader title="Уведомления" />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontFamily: F.semi, fontSize: 14, color: C.text }}>Push-уведомления</div>
            <div style={{ fontFamily: F.regular, fontSize: 12, color: C.sub }}>Отклики, приглашения, оценки</div>
          </div>
          <Toggle checked={settings.notificationsEnabled} onChange={v => setSettings({ ...settings, notificationsEnabled: v })} />
        </div>
      </Card>

      {/* Сохранённые поиски */}
      <Card>
        <SectionHeader title="Сохранённые поиски" />
        {savedSearches.length === 0 ? (
          <div style={{ fontFamily: F.regular, fontSize: 14, color: C.sub, textAlign: "center", padding: 16 }}>
            Нет сохранённых запросов
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {savedSearches.map(s => (
              <div key={s.id} style={{
                background: C.bg, borderRadius: 14, padding: "12px 16px",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <span style={{ fontFamily: F.semi, fontSize: 14, color: C.text }}>{s.query}</span>
                  <Toggle checked={s.notifications} onChange={() => toggleSavedSearchNotifications(s.id)} />
                </div>
                <div style={{ fontFamily: F.regular, fontSize: 12, color: C.sub }}>{s.criteria}</div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Журнал безопасности */}
      <Card>
        <SectionHeader title="Журнал безопасности" />
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {MOCK_SECURITY_LOG.map(log => (
            <div key={log.id} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "10px 0", borderBottom: `1px solid ${C.border}`,
            }}>
              <div>
                <div style={{ fontFamily: F.regular, fontSize: 14, color: C.text }}>{log.event}</div>
                <div style={{ fontFamily: F.regular, fontSize: 12, color: C.sub }}>{log.author}</div>
              </div>
              <span style={{ fontFamily: F.regular, fontSize: 12, color: C.sub }}>{log.time}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Выход */}
      <button onClick={logout} style={{
        background: "white", border: `1px solid ${C.border}`, borderRadius: 20,
        padding: "14px 20px", cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
        fontFamily: F.regular, fontSize: 15, color: C.red,
      }}>
        <Icon.Logout size={18} color={C.red} />
        Выйти из аккаунта
      </button>

      {/* Сохранить изменения */}
      <GreenBtn label="Сохранить изменения" full onClick={() => navigate("/employee")} />
    </div>
  );
}
