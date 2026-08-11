import React from "react";
import { C, F } from "@/data/mockData";

// ─── Button ──────────────────────────────────────────────────────────────────
export function GreenBtn({ label, onClick, full, disabled, icon }: {
  label: string; onClick?: () => void; full?: boolean; disabled?: boolean; icon?: React.ReactNode;
}) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      background: disabled ? C.gray : C.green, color: "white", fontFamily: F.regular, fontSize: 14,
      borderRadius: 20, padding: "9px 18px", border: "none", cursor: disabled ? "not-allowed" : "pointer",
      width: full ? "100%" : undefined, transition: "opacity 0.15s",
      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
      opacity: disabled ? 0.6 : 1,
    }}
      onMouseOver={e => !disabled && (e.currentTarget.style.opacity = "0.88")}
      onMouseOut={e => !disabled && (e.currentTarget.style.opacity = "1")}
    >{label}{icon}</button>
  );
}

export function OutlineBtn({ label, onClick, full, icon }: {
  label: string; onClick?: () => void; full?: boolean; icon?: React.ReactNode;
}) {
  return (
    <button onClick={onClick} style={{
      background: "white", color: C.muted, fontFamily: F.regular, fontSize: 14,
      borderRadius: 20, padding: "9px 18px", border: `1px solid ${C.border}`,
      cursor: "pointer", transition: "background 0.15s",
      width: full ? "100%" : undefined,
      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
    }}
      onMouseOver={e => (e.currentTarget.style.background = "#f7f7f7")}
      onMouseOut={e => (e.currentTarget.style.background = "white")}
    >{label}{icon}</button>
  );
}

export function DarkBtn({ label, onClick, full }: {
  label: string; onClick?: () => void; full?: boolean;
}) {
  return (
    <button onClick={onClick} style={{
      background: C.text, color: "white", fontFamily: F.regular, fontSize: 14,
      borderRadius: 20, padding: "10px 24px", border: "none", cursor: "pointer",
      width: full ? "100%" : undefined, transition: "opacity 0.15s",
    }}
      onMouseOver={e => (e.currentTarget.style.opacity = "0.88")}
      onMouseOut={e => (e.currentTarget.style.opacity = "1")}
    >{label}</button>
  );
}

// ─── Card ────────────────────────────────────────────────────────────────────
export function Card({ children, style, onClick, active }: {
  children: React.ReactNode; style?: React.CSSProperties; onClick?: () => void; active?: boolean;
}) {
  return (
    <div onClick={onClick} style={{
      background: C.card, border: active ? `2px solid ${C.green}` : `1px solid ${C.border}`,
      borderRadius: 20, padding: 20, boxShadow: "0 0 32px rgba(0,0,0,0.02)",
      cursor: onClick ? "pointer" : undefined, ...style,
    }}>{children}</div>
  );
}

// ─── Chip ────────────────────────────────────────────────────────────────────
export function Chip({ label, color, active, onClick }: {
  label: string; color?: string; active?: boolean; onClick?: () => void;
}) {
  return (
    <span onClick={onClick} style={{
      background: active ? (color ?? C.green) : (color ? `${color}18` : C.chip),
      color: active ? "white" : (color ?? C.muted),
      fontFamily: F.regular, fontSize: 11, borderRadius: 20, padding: "4px 12px",
      whiteSpace: "nowrap", cursor: onClick ? "pointer" : undefined,
      transition: "all 0.15s", userSelect: "none",
    }}>{label}</span>
  );
}

// ─── StatusBadge ─────────────────────────────────────────────────────────────
export function StatusBadge({ label, color }: { label: string; color: string }) {
  return (
    <span style={{
      background: `${color}18`, color, fontFamily: F.regular, fontSize: 12,
      borderRadius: 20, padding: "4px 12px", whiteSpace: "nowrap",
    }}>{label}</span>
  );
}

// ─── Input ───────────────────────────────────────────────────────────────────
export function Input({ label, value, onChange, placeholder, type, error }: {
  label?: string; value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string; error?: string;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {label && <label style={{ fontFamily: F.regular, fontSize: 13, color: C.sub }}>{label}</label>}
      <input
        type={type ?? "text"} value={value} placeholder={placeholder} onChange={e => onChange(e.target.value)}
        style={{
          background: "white", border: `1px solid ${error ? C.red : C.border}`, borderRadius: 14,
          padding: "12px 16px", fontFamily: F.regular, fontSize: 15, color: C.text,
          outline: "none", transition: "border-color 0.15s",
        }}
      />
      {error && <span style={{ fontFamily: F.regular, fontSize: 12, color: C.red }}>{error}</span>}
    </div>
  );
}

// ─── Select ──────────────────────────────────────────────────────────────────
export function Select({ label, value, onChange, options }: {
  label?: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[];
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {label && <label style={{ fontFamily: F.regular, fontSize: 13, color: C.sub }}>{label}</label>}
      <select value={value} onChange={e => onChange(e.target.value)} style={{
        background: "white", border: `1px solid ${C.border}`, borderRadius: 14,
        padding: "12px 16px", fontFamily: F.regular, fontSize: 15, color: C.text,
        outline: "none", cursor: "pointer",
      }}>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

// ─── ProgressBar ─────────────────────────────────────────────────────────────
export function ProgressBar({ value, color, height }: { value: number; color?: string; height?: number }) {
  return (
    <div style={{
      background: C.border, borderRadius: 10, height: height ?? 6, overflow: "hidden",
    }}>
      <div style={{
        background: color ?? C.green, height: "100%", borderRadius: 10,
        transition: "width 0.3s", width: `${value}%`,
      }} />
    </div>
  );
}

// ─── EmptyState ──────────────────────────────────────────────────────────────
export function EmptyState({ icon, title, subtitle, action }: {
  icon: React.ReactNode; title: string; subtitle: string; action?: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 40, gap: 16 }}>
      <div style={{ fontSize: 64 }}>{icon}</div>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontFamily: F.bold, fontSize: 22, color: C.text, letterSpacing: "-0.4px", marginBottom: 8 }}>
          {title}
        </div>
        <div style={{ fontFamily: F.regular, fontSize: 15, color: C.sub, lineHeight: "24px", maxWidth: 400, margin: "0 auto" }}>
          {subtitle}
        </div>
      </div>
      {action}
    </div>
  );
}

// ─── Toggle ──────────────────────────────────────────────────────────────────
export function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!checked)} style={{
      width: 44, height: 26, borderRadius: 13, border: "none", cursor: "pointer",
      background: checked ? C.green : C.border, transition: "background 0.2s",
      position: "relative", flexShrink: 0,
    }}>
      <div style={{
        width: 22, height: 22, borderRadius: "50%", background: "white",
        position: "absolute", top: 2, left: checked ? 20 : 2,
        transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
      }} />
    </button>
  );
}

// ─── SectionHeader ───────────────────────────────────────────────────────────
export function SectionHeader({ title, subtitle, action }: {
  title: string; subtitle?: string; action?: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 14 }}>
      <div>
        <div style={{ fontFamily: F.semi, fontSize: 18, color: C.text }}>{title}</div>
        {subtitle && <div style={{ fontFamily: F.regular, fontSize: 13, color: C.sub, marginTop: 2 }}>{subtitle}</div>}
      </div>
      {action}
    </div>
  );
}

// ─── KPI Tile ────────────────────────────────────────────────────────────────
export function KPITile({ value, label, color }: { value: string; label: string; color?: string }) {
  return (
    <Card style={{ textAlign: "center", padding: "20px 12px" }}>
      <div style={{ fontFamily: F.bold, fontSize: 32, color: color ?? C.text, letterSpacing: "-0.5px" }}>{value}</div>
      <div style={{ fontFamily: F.regular, fontSize: 13, color: C.sub, marginTop: 4 }}>{label}</div>
    </Card>
  );
}

// ─── SuccessScreen ───────────────────────────────────────────────────────────
export function SuccessScreen({ title, subtitle, buttonText, onButton }: {
  title: string; subtitle: string; buttonText?: string; onButton?: () => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 60, gap: 20 }}>
      <div style={{
        width: 80, height: 80, borderRadius: "50%", background: `${C.green}18`,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <circle cx="20" cy="20" r="20" fill={C.green} />
          <path d="M12 20l5 5L28 14" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontFamily: F.bold, fontSize: 24, color: C.text, marginBottom: 8 }}>{title}</div>
        <div style={{ fontFamily: F.regular, fontSize: 15, color: C.sub, lineHeight: "24px", maxWidth: 380, margin: "0 auto" }}>
          {subtitle}
        </div>
      </div>
      {buttonText && onButton && <GreenBtn label={buttonText} onClick={onButton} />}
    </div>
  );
}
