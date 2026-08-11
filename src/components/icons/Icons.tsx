import React from "react";
import { C } from "@/data/mockData";

type IconProps = { active?: boolean; size?: number; color?: string };

export const Icon = {
  Home: ({ active, size = 20 }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <path d="M3 9.5L10 3l7 6.5V18H13v-5H7v5H3V9.5z"
        fill={active ? C.green : C.sub} opacity={active ? 1 : 0.6} />
      <path d="M3 9.5L10 3l7 6.5" stroke={active ? C.green : C.sub}
        strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Search: ({ active, size = 20 }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <circle cx="9" cy="9" r="6" fill={active ? C.green : C.sub} opacity="0.25"
        stroke={active ? C.green : C.sub} strokeWidth="1.5" />
      <path d="M13.5 13.5L17 17" stroke={active ? C.green : C.sub}
        strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  Bookmark: ({ active, size = 20 }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <path fillRule="evenodd" clipRule="evenodd"
        d="M5 3C4.45 3 4 3.45 4 4V17.5L10 13.7l6 3.8V4c0-.55-.45-1-1-1H5z"
        fill={active ? C.green : C.sub} opacity={active ? 0.8 : 0.4} />
      <path d="M7.5 8h5" stroke={active ? C.green : C.sub}
        strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  ),
  Briefcase: ({ active, size = 20 }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <path d="M2 8.5A2 2 0 014 6.5h12a2 2 0 012 2v2H2V8.5z"
        fill={active ? C.green : C.sub} />
      <path d="M2 10.5h16v5.5a2 2 0 01-2 2H4a2 2 0 01-2-2V10.5z"
        fill={active ? C.green : C.sub} opacity="0.35" />
      <path d="M7.5 6.5V5a1.5 1.5 0 011.5-1.5h2A1.5 1.5 0 0112.5 5v1.5"
        stroke={active ? C.green : C.sub} strokeWidth="1.4" />
    </svg>
  ),
  User: ({ active, size = 20 }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="7" r="3.5" fill={active ? C.green : C.sub} opacity="0.4"
        stroke={active ? C.green : C.sub} strokeWidth="1.4" />
      <path d="M3.5 17.5c0-3.038 2.91-5.5 6.5-5.5s6.5 2.462 6.5 5.5"
        stroke={active ? C.green : C.sub} strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  ),
  Bell: ({ size = 22 }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 22 22" fill="none">
      <path fillRule="evenodd" clipRule="evenodd"
        d="M11 2a6.5 6.5 0 00-6.5 6.5V13L3 16h16l-1.5-3V8.5A6.5 6.5 0 0011 2z"
        fill={C.green} opacity="0.25" stroke={C.green} strokeWidth="1.3" />
      <path d="M9 18a2 2 0 004 0" stroke={C.green} strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  ),
  Filter: ({ size = 20 }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <path d="M3 5h14M5.5 10h9M8 15h4" stroke={C.green}
        strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  ),
  ChevronRight: ({ size = 16, color }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M6 4l4 4-4 4" stroke={color ?? C.sub} strokeWidth="1.5"
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  ChevronDown: ({ size = 16, color }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M4 6l4 4 4-4" stroke={color ?? C.muted} strokeWidth="1.5"
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  ChevronLeft: ({ size = 16, color }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M10 4l-4 4 4 4" stroke={color ?? C.sub} strokeWidth="1.5"
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Plus: ({ size = 22 }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 22 22" fill="none">
      <circle cx="11" cy="11" r="9" fill={C.green} opacity="0.2" />
      <path d="M7 11h8M11 7v8" stroke={C.green} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  Verified: ({ size = 14 }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="7" r="7" fill={C.green} />
      <path d="M4 7l2.5 2.5L10 5" stroke="white"
        strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Link: ({ size = 18 }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none">
      <path d="M7 11L12 6M9.5 6h2.5v2.5" stroke="white"
        strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.5 6.5H5A2 2 0 003 8.5V13A2 2 0 005 15h4.5a2 2 0 002-2v-1.5"
        stroke="white" opacity="0.5" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  ),
  Star: ({ size = 13 }: IconProps) => <span style={{ color: "#F59E0B", fontSize: size }}>★</span>,
  Dot: ({ color }: IconProps) => (
    <div style={{ width: 7, height: 7, borderRadius: "50%", background: color ?? C.green, flexShrink: 0 }} />
  ),
  Location: ({ size = 14 }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
      <path fillRule="evenodd" clipRule="evenodd"
        d="M7 1a4.5 4.5 0 00-4.5 4.5c0 3 4.5 7.5 4.5 7.5s4.5-4.5 4.5-7.5A4.5 4.5 0 007 1z"
        fill={C.green} opacity="0.3" />
      <circle cx="7" cy="5.5" r="1.5" fill={C.green} />
    </svg>
  ),
  Users: ({ size = 18 }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none">
      <circle cx="7" cy="6" r="3" fill={C.green} opacity="0.3"
        stroke={C.green} strokeWidth="1.2" />
      <path d="M1.5 16c0-2.76 2.46-5 5.5-5" stroke={C.green}
        strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="13" cy="7" r="2" fill={C.green} opacity="0.3"
        stroke={C.green} strokeWidth="1.2" />
      <path d="M9.5 16c0-2.21 1.57-4 3.5-4s3.5 1.79 3.5 4"
        fill={C.green} opacity="0.3" />
    </svg>
  ),
  Settings: ({ size = 18 }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none">
      <path d="M3 4.5h12M3 9h12M3 13.5h12" stroke={C.green}
        strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="6" cy="4.5" r="1.8" fill="white" stroke={C.green} strokeWidth="1.2" />
      <circle cx="12" cy="9" r="1.8" fill="white" stroke={C.green} strokeWidth="1.2" />
      <circle cx="6" cy="13.5" r="1.8" fill="white" stroke={C.green} strokeWidth="1.2" />
    </svg>
  ),
  AddUser: ({ size = 18 }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none">
      <circle cx="7" cy="6" r="3" fill={C.green} opacity="0.3"
        stroke={C.green} strokeWidth="1.2" />
      <path d="M1.5 16c0-2.76 2.46-5 5.5-5" stroke={C.green}
        strokeWidth="1.2" strokeLinecap="round" />
      <path d="M13 9v5M10.5 11.5h5" stroke={C.green}
        strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  ),
  Folder: ({ size = 20, color }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <path d="M2 5a1 1 0 011-1h5l2 2h7a1 1 0 011 1v8a1 1 0 01-1 1H3a1 1 0 01-1-1V5z"
        fill={color ?? C.green} opacity="0.2" stroke={color ?? C.green} strokeWidth="1.3" />
    </svg>
  ),
  Chart: ({ size = 20 }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <path d="M3 17V8M8 17V4M13 17v-6M18 17V11" stroke={C.green}
        strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  Building: ({ size = 20, active, color }: IconProps) => {
    const c = color ?? (active ? C.green : C.sub);
    return (
      <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
        <rect x="3" y="3" width="14" height="15" rx="2" fill={`${c}33`}
          stroke={c} strokeWidth="1.3" />
        <path d="M6 7h3M11 7h3M6 10h3M11 10h3M6 13h3M11 13h3" stroke={c}
          strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    );
  },
  Check: ({ size = 16, color }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M3 8l3.5 3.5L13 5" stroke={color ?? C.green} strokeWidth="1.8"
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  CheckCircle: ({ size = 20, color }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="9" fill={(color ?? C.green) + "18"} />
      <path d="M6 10l2.5 2.5L14 7" stroke={color ?? C.green} strokeWidth="1.8"
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Close: ({ size = 18, color }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none">
      <path d="M5 5l8 8M13 5L5 13" stroke={color ?? C.sub} strokeWidth="1.5"
        strokeLinecap="round" />
    </svg>
  ),
  Clock: ({ size = 16, color }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6.5" stroke={color ?? C.sub} strokeWidth="1.3" />
      <path d="M8 4.5V8l2.5 1.5" stroke={color ?? C.sub} strokeWidth="1.3"
        strokeLinecap="round" />
    </svg>
  ),
  Calendar: ({ size = 18, color }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none">
      <rect x="2.5" y="3.5" width="13" height="12" rx="2" stroke={color ?? C.green}
        strokeWidth="1.3" fill={color ?? C.green} opacity="0.1" />
      <path d="M2.5 7h13M5.5 2v3M12.5 2v3" stroke={color ?? C.green}
        strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  ),
  Award: ({ size = 20, color }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="8" r="5" fill={(color ?? C.green) + "20"} stroke={color ?? C.green} strokeWidth="1.3" />
      <path d="M7 12.5L6 18l4-2 4 2-1-5.5" stroke={color ?? C.green} strokeWidth="1.3"
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  BookOpen: ({ size = 20, color }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <path d="M3 4.5A1.5 1.5 0 014.5 3H9v14H4.5A1.5 1.5 0 013 15.5v-11z"
        fill={(color ?? C.green) + "15"} stroke={color ?? C.green} strokeWidth="1.3" />
      <path d="M17 4.5A1.5 1.5 0 0015.5 3H11v14h4.5a1.5 1.5 0 001.5-1.5v-11z"
        fill={(color ?? C.green) + "15"} stroke={color ?? C.green} strokeWidth="1.3" />
    </svg>
  ),
  Chat: ({ size = 20, color }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <path d="M3 5a2 2 0 012-2h10a2 2 0 012 2v7a2 2 0 01-2 2H8l-4 3.5V14H5a2 2 0 01-2-2V5z"
        fill={(color ?? C.green) + "18"} stroke={color ?? C.green} strokeWidth="1.3" />
    </svg>
  ),
  Shield: ({ size = 20, color }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <path d="M10 2L3 5v5c0 4 3 7 7 8 4-1 7-4 7-8V5l-7-3z"
        fill={(color ?? C.green) + "15"} stroke={color ?? C.green} strokeWidth="1.3" />
      <path d="M7 10l2 2 4-4" stroke={color ?? C.green} strokeWidth="1.5"
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Download: ({ size = 18, color }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none">
      <path d="M9 2v9M5 8l4 4 4-4M3 15h12" stroke={color ?? C.green}
        strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Send: ({ size = 18, color }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none">
      <path d="M2 9l14-6-6 14-2-5-6-3z" fill={color ?? C.green} opacity="0.2"
        stroke={color ?? C.green} strokeWidth="1.3" strokeLinejoin="round" />
    </svg>
  ),
  Phone: ({ size = 20, color }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <path d="M5 2a2 2 0 00-2 2c0 7 6 13 13 13a2 2 0 002-2v-2.5a1 1 0 00-.8-1l-3-.6a1 1 0 00-1 .4l-.7 1a10 10 0 01-4.5-4.5l1-.7a1 1 0 00.4-1L8.5 2.8A1 1 0 007.5 2H5z"
        fill={color ?? C.green} opacity="0.2" stroke={color ?? C.green} strokeWidth="1.3" />
    </svg>
  ),
  Lock: ({ size = 18, color }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none">
      <rect x="3.5" y="8" width="11" height="8" rx="2" fill={(color ?? C.green) + "15"}
        stroke={color ?? C.green} strokeWidth="1.3" />
      <path d="M6 8V6a3 3 0 016 0v2" stroke={color ?? C.green} strokeWidth="1.3" />
    </svg>
  ),
  AlertTriangle: ({ size = 20, color }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <path d="M10 2L1 17h18L10 2z" fill={(color ?? C.amber) + "18"}
        stroke={color ?? C.amber} strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M10 8v4M10 14v.5" stroke={color ?? C.amber} strokeWidth="1.5"
        strokeLinecap="round" />
    </svg>
  ),
  Logout: ({ size = 18, color }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none">
      <path d="M7 3H4a1 1 0 00-1 1v10a1 1 0 001 1h3" stroke={color ?? C.sub}
        strokeWidth="1.3" strokeLinecap="round" />
      <path d="M11 5l4 4-4 4M15 9H7" stroke={color ?? C.sub}
        strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  MoreHorizontal: ({ size = 20, color }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <circle cx="5" cy="10" r="1.5" fill={color ?? C.sub} />
      <circle cx="10" cy="10" r="1.5" fill={color ?? C.sub} />
      <circle cx="15" cy="10" r="1.5" fill={color ?? C.sub} />
    </svg>
  ),
  Wrench: ({ size = 20, color }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <path d="M14 2a4 4 0 00-3.5 6L3 15.5 4.5 17 12 9.5A4 4 0 0014 2z"
        fill={(color ?? C.green) + "18"} stroke={color ?? C.green} strokeWidth="1.3" />
    </svg>
  ),
  Wallet: ({ size = 20, color }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <rect x="2.5" y="5" width="15" height="11" rx="2.5" fill={(color ?? C.green) + "15"}
        stroke={color ?? C.green} strokeWidth="1.3" />
      <path d="M13 10h3" stroke={color ?? C.green} strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="14.5" cy="10.5" r="1" fill={color ?? C.green} />
    </svg>
  ),
};

export type IconType = keyof typeof Icon;
