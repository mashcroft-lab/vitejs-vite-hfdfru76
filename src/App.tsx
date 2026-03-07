import { useState, useEffect, useCallback, useRef } from "react";

// ─────────────────────────────────────────────────────────────
// GLOBAL STYLES & FONTS
// ─────────────────────────────────────────────────────────────
(function init() {
  if (document.getElementById("ks-init")) return;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href =
    "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Lato:wght@300;400;700&family=Playfair+Display:wght@400;500;600;700&display=swap";
  document.head.appendChild(link);

  const s = document.createElement("style");
  s.id = "ks-init";
  s.textContent = `
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html, body, #root { height: 100%; background: #180013; }
    ::-webkit-scrollbar { width: 4px; height: 4px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: rgba(201,168,76,0.25); border-radius: 2px; }

    @keyframes fadeUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
    @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
    @keyframes spinK { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }

    .ks-up { animation: fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) both; }
    .ks-in { animation: fadeIn 0.3s ease both; }

    .ks-input {
      background: transparent; border: none;
      border-bottom: 1px solid rgba(201,168,76,0.3);
      color: #fff; font-family: 'Lato', sans-serif; font-size: 14px;
      padding: 10px 2px; width: 100%; outline: none;
      letter-spacing: 0.03em; transition: border-color 0.2s;
    }
    .ks-input:focus { border-bottom-color: #c9a84c; }
    .ks-input::placeholder { color: rgba(255,255,255,0.3); }

    .ks-field {
      background: rgba(255,255,255,0.04); border: 1px solid rgba(201,168,76,0.18);
      color: #fff; font-family: 'Lato', sans-serif; font-size: 13px;
      padding: 9px 12px; width: 100%; outline: none;
      transition: border-color 0.2s; border-radius: 1px;
      letter-spacing: 0.02em;
    }
    .ks-field:focus { border-color: rgba(201,168,76,0.45); }
    .ks-field::placeholder { color: rgba(255,255,255,0.25); }
    .ks-field option { background: #26011e; }

    textarea.ks-field { resize: vertical; min-height: 72px; line-height: 1.55; }
    select.ks-field { cursor: pointer; appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23c9a84c' stroke-width='1.5' fill='none'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 10px center; padding-right: 30px; }

    .btn-gold {
      background: linear-gradient(135deg, #c9a84c, #e2c47a); border: none;
      color: #180013; font-family: 'Lato', sans-serif; font-size: 11px;
      font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase;
      padding: 12px 28px; cursor: pointer; transition: opacity 0.2s, transform 0.15s;
    }
    .btn-gold:hover { opacity: 0.88; transform: translateY(-1px); }
    .btn-gold:active { transform: translateY(0); opacity: 1; }

    .btn-ghost {
      background: transparent; border: 1px solid rgba(201,168,76,0.3);
      color: rgba(201,168,76,0.75); font-family: 'Lato', sans-serif;
      font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase;
      padding: 9px 18px; cursor: pointer; transition: all 0.2s;
    }
    .btn-ghost:hover { border-color: #c9a84c; color: #c9a84c; }

    .btn-sm {
      background: transparent; border: 1px solid rgba(201,168,76,0.2);
      color: rgba(201,168,76,0.55); font-family: 'Lato', sans-serif;
      font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase;
      padding: 5px 10px; cursor: pointer; transition: all 0.2s; white-space: nowrap;
    }
    .btn-sm:hover { border-color: rgba(201,168,76,0.5); color: rgba(201,168,76,0.9); }

    .btn-del {
      background: transparent; border: 1px solid rgba(201,100,100,0.25);
      color: rgba(201,100,100,0.6); font-family: 'Lato', sans-serif;
      font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase;
      padding: 5px 10px; cursor: pointer; transition: all 0.2s;
    }
    .btn-del:hover { border-color: rgba(201,100,100,0.6); color: rgba(201,100,100,0.9); }

    .nav-item {
      display: flex; align-items: center; gap: 9px;
      padding: 10px 20px 10px 18px;
      font-family: 'Lato', sans-serif; font-size: 11px;
      font-weight: 400; letter-spacing: 0.11em; text-transform: uppercase;
      color: rgba(255,255,255,0.4); cursor: pointer;
      transition: all 0.18s; border-left: 2px solid transparent;
      user-select: none;
    }
    .nav-item:hover { color: rgba(255,255,255,0.7); background: rgba(201,168,76,0.04); }
    .nav-item.active { color: #c9a84c; border-left-color: #c9a84c; background: rgba(201,168,76,0.07); }

    .modal-overlay {
      position: fixed; inset: 0; background: rgba(24,0,19,0.82);
      backdrop-filter: blur(6px); z-index: 200;
      display: flex; align-items: center; justify-content: center;
      padding: 16px; animation: fadeIn 0.2s ease;
    }
    .modal-box {
      background: #26011e; border: 1px solid rgba(201,168,76,0.22);
      width: 100%; max-width: 500px; max-height: 90vh; overflow-y: auto;
      padding: 28px 32px; animation: fadeUp 0.28s cubic-bezier(0.16,1,0.3,1);
    }

    .ks-table { width: 100%; border-collapse: collapse; }
    .ks-table th {
      font-family: 'Lato', sans-serif; font-size: 10px; font-weight: 700;
      letter-spacing: 0.15em; text-transform: uppercase;
      color: rgba(201,168,76,0.5); padding: 8px 12px 8px 0;
      text-align: left; border-bottom: 1px solid rgba(201,168,76,0.1);
    }
    .ks-table td {
      font-family: 'Lato', sans-serif; font-size: 13px;
      color: rgba(255,255,255,0.72); padding: 13px 12px 13px 0;
      border-bottom: 1px solid rgba(255,255,255,0.04); vertical-align: middle;
    }
    .ks-table tr:last-child td { border-bottom: none; }
    .ks-table tr:hover td { background: rgba(201,168,76,0.025); }

    .grain::after {
      content: ''; position: absolute; inset: 0; pointer-events: none;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
      opacity: 0.4; border-radius: inherit;
    }

    @media (max-width: 720px) {
      .sidebar-desktop { display: none !important; }
      .content-padded { padding: 20px 16px !important; }
    }
  `;
  document.head.appendChild(s);
})();

// ─────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────
const C = {
  bg: "#180013",
  surface: "#26011e",
  surface2: "#2c011f",
  gold: "#c9a84c",
  goldL: "#e2c47a",
  goldDim: "rgba(201,168,76,0.15)",
  goldBorder: "rgba(201,168,76,0.22)",
  white: "#ffffff",
  text: "rgba(255,255,255,0.88)",
  dim: "rgba(255,255,255,0.55)",
  muted: "rgba(255,255,255,0.35)",
};

const TIERS = ["foundation", "authority", "influence", "ghostwriting", "coaching", "editing"];
const TIER_LABELS = {
  foundation: "Foundation",
  authority: "Authority",
  influence: "Influence",
  ghostwriting: "Full Ghostwriting",
  coaching: "Book Coaching",
  editing: "Book Editing",
};
const TIER_COLORS = {
  foundation: "#8a7a4c",
  authority: "#c9a84c",
  influence: "#e2c47a",
  ghostwriting: "#7a8aaf",
  coaching: "#7a9a8a",
  editing: "#9a8a7a",
};

const isBranding = (t) => ["foundation", "authority", "influence"].includes(t);
const isManuscript = (t) => ["ghostwriting", "coaching", "editing"].includes(t);
const hasAuthority = (t) => ["authority", "influence"].includes(t);
const hasInfluence = (t) => t === "influence";

const CONTENT_STATUSES = ["In Progress", "In Review", "Published"];
const MILESTONE_STATUSES = ["Not Started", "In Progress", "Complete"];
const GOAL_TRAJECTORIES = ["on-track", "ahead", "needs-attention"];
const CHAPTER_STATUSES = ["Outline", "Draft", "Revision", "Final"];
const CONTENT_TYPES = ["LinkedIn Post", "LinkedIn Article", "Newsletter", "Forbes Article", "Inc. Article", "HBR Article", "Fast Company Article", "Other"];

// ─────────────────────────────────────────────────────────────
// DEFAULT DATA
// ─────────────────────────────────────────────────────────────
const DEFAULT_USERS = [
  { username: "mikaela", password: "kepler2024", role: "admin" },
  { username: "sarah.chen", password: "portal123", role: "client", clientId: "c1" },
  { username: "james.walker", password: "portal123", role: "client", clientId: "c2" },
  { username: "elena.russo", password: "portal123", role: "client", clientId: "c3" },
  { username: "david.park", password: "portal123", role: "client", clientId: "c4" },
];

const DEFAULT_CLIENTS = [
  {
    id: "c1", name: "Sarah Chen", username: "sarah.chen",
    tier: "influence", joinDate: "2024-01-15",
    contentCalendar: [
      { id: "cc1", title: "The Art of Strategic Silence", type: "LinkedIn Article", status: "Published", scheduledDate: "2024-03-01", link: "https://linkedin.com" },
      { id: "cc2", title: "Why Most Executives Fail at Thought Leadership", type: "Newsletter", status: "In Review", scheduledDate: "2024-03-10", link: "" },
      { id: "cc3", title: "The 5 Conversations That Built My Career", type: "LinkedIn Post", status: "In Progress", scheduledDate: "2024-03-18", link: "" },
      { id: "cc4", title: "Women Redefining Tech Leadership", type: "Forbes Article", status: "In Progress", scheduledDate: "2024-03-28", link: "" },
    ],
    publicationLog: [
      { id: "pl1", outlet: "Forbes", title: "The New Rules of Executive Presence", date: "2024-02-14", link: "https://forbes.com" },
      { id: "pl2", outlet: "Fast Company", title: "How to Build Influence Without Burning Out", date: "2024-01-28", link: "https://fastcompany.com" },
      { id: "pl3", outlet: "Harvard Business Review", title: "The Quiet Power of Listening Leaders", date: "2024-01-10", link: "https://hbr.org" },
    ],
    performanceReport: {
      period: "February 2024",
      engagement: "14.2K", reach: "89K", placements: "3",
      summary: "February marked a breakthrough month. Your Forbes placement drove a 340% spike in LinkedIn profile views, and the HBR piece continues to circulate in executive circles. Newsletter open rate climbed to 58%—well above industry average. Momentum is building exactly as planned.",
    },
    milestones: [
      { id: "m1", name: "First Forbes Placement", status: "Complete", completionDate: "2024-02-14" },
      { id: "m2", name: "LinkedIn Followers: 10K", status: "Complete", completionDate: "2024-02-28" },
      { id: "m3", name: "Podcast Booked (Top 100)", status: "In Progress", completionDate: "" },
      { id: "m4", name: "Speaking Engagement Secured", status: "Not Started", completionDate: "" },
      { id: "m5", name: "HBR Placement", status: "Complete", completionDate: "2024-01-10" },
    ],
    goals: [
      { id: "g1", name: "3 Tier-1 Publications", period: "90day", progress: 67, trajectory: "on-track" },
      { id: "g2", name: "LinkedIn: 15K Followers", period: "90day", progress: 78, trajectory: "ahead" },
      { id: "g3", name: "Podcast Appearances: 5", period: "6month", progress: 40, trajectory: "on-track" },
      { id: "g4", name: "Secure Speaking Fee: $10K+", period: "6month", progress: 20, trajectory: "needs-attention" },
      { id: "g5", name: "Book Deal in Motion", period: "12month", progress: 15, trajectory: "on-track" },
      { id: "g6", name: "Brand Revenue Attribution: 30%", period: "12month", progress: 10, trajectory: "on-track" },
    ],
    chapters: [], estimatedCompletion: "", manuscriptNotes: "",
  },
  {
    id: "c2", name: "James Walker", username: "james.walker",
    tier: "authority", joinDate: "2024-02-01",
    contentCalendar: [
      { id: "cc1", title: "The Founder's Guide to Delegation", type: "LinkedIn Article", status: "Published", scheduledDate: "2024-03-05", link: "https://linkedin.com" },
      { id: "cc2", title: "Building Culture in a Remote-First World", type: "Newsletter", status: "In Progress", scheduledDate: "2024-03-14", link: "" },
      { id: "cc3", title: "Why I Almost Quit My Own Company", type: "LinkedIn Post", status: "In Progress", scheduledDate: "2024-03-20", link: "" },
    ],
    publicationLog: [
      { id: "pl1", outlet: "Inc.", title: "The Overlooked Skill Every Founder Needs", date: "2024-02-20", link: "https://inc.com" },
    ],
    performanceReport: {
      period: "February 2024",
      engagement: "6.8K", reach: "42K", placements: "1",
      summary: "Solid first full month. The Inc. piece performed above expectations and has driven meaningful inbound to your LinkedIn. Your authentic voice is resonating—the delegation post outperformed boosted content from competitors in your space. Foundation is strong.",
    },
    milestones: [
      { id: "m1", name: "First Major Publication Placement", status: "Complete", completionDate: "2024-02-20" },
      { id: "m2", name: "LinkedIn Followers: 5K", status: "In Progress", completionDate: "" },
      { id: "m3", name: "Newsletter: 1K Subscribers", status: "Not Started", completionDate: "" },
      { id: "m4", name: "Speaking Inquiry Received", status: "Not Started", completionDate: "" },
    ],
    goals: [], chapters: [], estimatedCompletion: "", manuscriptNotes: "",
  },
  {
    id: "c3", name: "Elena Russo", username: "elena.russo",
    tier: "foundation", joinDate: "2024-02-15",
    contentCalendar: [
      { id: "cc1", title: "Five Lessons from 20 Years in Hospitality", type: "LinkedIn Article", status: "In Review", scheduledDate: "2024-03-10", link: "" },
      { id: "cc2", title: "The Guest Experience Economy", type: "LinkedIn Post", status: "In Progress", scheduledDate: "2024-03-18", link: "" },
    ],
    publicationLog: [],
    performanceReport: {
      period: "February 2024",
      engagement: "—", reach: "—", placements: "0",
      summary: "First month focused on establishing your voice and content foundation. Two strong pieces are in development—your perspective on guest experience is genuinely distinctive. First publication target is set for March.",
    },
    milestones: [], goals: [], chapters: [], estimatedCompletion: "", manuscriptNotes: "",
  },
  {
    id: "c4", name: "David Park", username: "david.park",
    tier: "ghostwriting", joinDate: "2024-01-08",
    contentCalendar: [], publicationLog: [],
    performanceReport: { period: "", engagement: "", reach: "", placements: "", summary: "" },
    milestones: [], goals: [],
    chapters: [
      { id: "ch1", title: "Prologue: The Problem with Perfect", status: "Final", notes: "Beautifully written. This is the hook that will keep readers turning pages.", dueDate: "2024-01-20" },
      { id: "ch2", title: "Chapter 1: Unlearning Success", status: "Final", notes: "Strong argument. Consider adding the Tokyo anecdote here.", dueDate: "2024-01-28" },
      { id: "ch3", title: "Chapter 2: The Architecture of Failure", status: "Revision", notes: "Section 3 needs tightening. Otherwise excellent.", dueDate: "2024-02-10" },
      { id: "ch4", title: "Chapter 3: When Systems Break People", status: "Draft", notes: "First draft strong. Awaiting your notes before revision.", dueDate: "2024-03-05" },
      { id: "ch5", title: "Chapter 4: The Recovery Blueprint", status: "Outline", notes: "Outline approved. Drafting begins next week.", dueDate: "2024-03-22" },
      { id: "ch6", title: "Chapter 5: Building Forward", status: "Outline", notes: "", dueDate: "2024-04-08" },
      { id: "ch7", title: "Epilogue: The Life You Actually Want", status: "Outline", notes: "", dueDate: "2024-04-22" },
    ],
    estimatedCompletion: "May 2024",
    manuscriptNotes: "Overall trajectory is excellent. Your voice is compelling and distinctive. Current focus: deepening Chapter 3 and ensuring the emotional arc carries through to the conclusion.",
  },
];

// ─────────────────────────────────────────────────────────────
// STORAGE
// ─────────────────────────────────────────────────────────────
const store = {
  async get(key, fallback) {
    try {
      const val = localStorage.getItem(key);
      return val ? JSON.parse(val) : fallback;
    } catch { return fallback; }
  },
  async set(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
  },
};

const uid = () => Math.random().toString(36).slice(2, 9);

// ─────────────────────────────────────────────────────────────
// SMALL SHARED COMPONENTS
// ─────────────────────────────────────────────────────────────
function GoldRule({ my = 20 }) {
  return <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${C.gold}44, transparent)`, margin: `${my}px 0` }} />;
}

function SectionHeading({ icon, children, action }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {icon && <span style={{ color: C.gold, fontSize: 14, opacity: 0.7 }}>{icon}</span>}
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontWeight: 400, fontSize: 22, color: C.goldL, letterSpacing: "0.02em" }}>{children}</h2>
      </div>
      {action}
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    Published: { bg: "rgba(201,168,76,0.15)", color: C.gold },
    "In Review": { bg: "rgba(226,196,122,0.1)", color: "#c4a855" },
    "In Progress": { bg: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)" },
    Complete: { bg: "rgba(201,168,76,0.15)", color: C.gold },
    "Not Started": { bg: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.35)" },
    Final: { bg: "rgba(201,168,76,0.15)", color: C.gold },
    Revision: { bg: "rgba(226,164,90,0.12)", color: "#c99a55" },
    Draft: { bg: "rgba(140,160,200,0.1)", color: "#8aa0c8" },
    Outline: { bg: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.35)" },
  };
  const style = map[status] || { bg: "rgba(255,255,255,0.05)", color: C.dim };
  return (
    <span style={{ display: "inline-block", background: style.bg, color: style.color, fontFamily: "'Lato', sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: "0.13em", textTransform: "uppercase", padding: "3px 8px" }}>
      {status}
    </span>
  );
}

function TierChip({ tier }) {
  const color = TIER_COLORS[tier] || C.gold;
  return (
    <span style={{ background: `${color}18`, color, border: `1px solid ${color}40`, fontFamily: "'Lato', sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: "0.13em", textTransform: "uppercase", padding: "3px 8px" }}>
      {TIER_LABELS[tier] || tier}
    </span>
  );
}

function Stat({ label, value }) {
  return (
    <div style={{ flex: 1, minWidth: 100 }}>
      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 600, color: C.gold, lineHeight: 1 }}>{value}</div>
      <div style={{ fontFamily: "'Lato', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: C.muted, marginTop: 6 }}>{label}</div>
    </div>
  );
}

function ProgressBar({ value, trajectory }) {
  const tc = trajectory === "ahead" ? "#c9a84c" : trajectory === "needs-attention" ? "#c97a4a" : "#c9a84c";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ flex: 1, height: 3, background: "rgba(201,168,76,0.1)", borderRadius: 2, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${value}%`, background: `linear-gradient(90deg, ${tc}88, ${tc})`, borderRadius: 2, transition: "width 0.8s cubic-bezier(0.16,1,0.3,1)" }} />
      </div>
      <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 12, color: tc, minWidth: 32, textAlign: "right" }}>{value}%</span>
    </div>
  );
}

function TrajectoryTag({ trajectory }) {
  const map = {
    "on-track": { label: "On Track", color: "#7ab47a" },
    "ahead": { label: "Ahead", color: C.gold },
    "needs-attention": { label: "Needs Attention", color: "#c97a4a" },
  };
  const t = map[trajectory] || { label: trajectory, color: C.dim };
  return <span style={{ fontFamily: "'Lato', sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: t.color }}>● {t.label}</span>;
}

function Modal({ title, onClose, children }) {
  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
          <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 20, color: C.goldL, fontWeight: 400 }}>{title}</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 18, lineHeight: 1, padding: "0 0 0 12px" }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function FormRow({ label, children }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ fontFamily: "'Lato', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: C.muted, marginBottom: 7 }}>{label}</div>
      {children}
    </div>
  );
}

function EmptyState({ message }) {
  return (
    <div style={{ textAlign: "center", padding: "48px 24px", color: C.muted, fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 17, opacity: 0.7 }}>
      {message}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// LOGIN SCREEN
// ─────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setTimeout(() => {
      const result = onLogin(username.trim().toLowerCase(), password);
      if (!result) setError("Invalid credentials. Please try again.");
      setLoading(false);
    }, 600);
  };

  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, position: "relative", overflow: "hidden" }}>
      {/* Atmospheric rings */}
      <div style={{ position: "absolute", width: 600, height: 600, borderRadius: "50%", border: "1px solid rgba(201,168,76,0.05)", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }} />
      <div style={{ position: "absolute", width: 400, height: 400, borderRadius: "50%", border: "1px solid rgba(201,168,76,0.07)", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }} />

      <div className="ks-up" style={{ width: "100%", maxWidth: 380, textAlign: "center" }}>
        {/* Logo */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 11, fontWeight: 400, letterSpacing: "0.35em", textTransform: "uppercase", color: C.muted, marginBottom: 12 }}>Client Portal</div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 40, fontWeight: 300, color: C.white, letterSpacing: "0.12em", lineHeight: 1 }}>
            Kepler<span style={{ color: C.gold }}> Script</span>
          </div>
          <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${C.gold}60, transparent)`, marginTop: 20 }} />
        </div>

        <form onSubmit={handleLogin} style={{ textAlign: "left" }}>
          <div style={{ marginBottom: 28 }}>
            <label style={{ display: "block", fontFamily: "'Lato', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: C.muted, marginBottom: 8 }}>Username</label>
            <input className="ks-input" type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="your.name" autoComplete="username" />
          </div>
          <div style={{ marginBottom: 36 }}>
            <label style={{ display: "block", fontFamily: "'Lato', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: C.muted, marginBottom: 8 }}>Password</label>
            <input className="ks-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" autoComplete="current-password" />
          </div>
          {error && <div style={{ fontFamily: "'Lato', sans-serif", fontSize: 12, color: "#c97070", marginBottom: 20, textAlign: "center", letterSpacing: "0.04em" }}>{error}</div>}
          <button className="btn-gold" type="submit" style={{ width: "100%", opacity: loading ? 0.7 : 1 }} disabled={loading}>
            {loading ? "Verifying…" : "Enter Portal"}
          </button>
        </form>

        <div style={{ marginTop: 40, fontFamily: "'Lato', sans-serif", fontSize: 10, color: C.muted, letterSpacing: "0.08em" }}>
          Private access only · Kepler Script
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// CLIENT VIEWS
// ─────────────────────────────────────────────────────────────
function ContentCalendarView({ client }) {
  const sorted = [...client.contentCalendar].sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate));
  return (
    <div className="ks-up">
      <SectionHeading icon="◈">Content Calendar</SectionHeading>
      {sorted.length === 0 ? <EmptyState message="No content scheduled yet." /> : (
        <div style={{ overflowX: "auto" }}>
          <table className="ks-table">
            <thead><tr>
              <th>Title</th><th>Type</th><th>Status</th><th>Scheduled</th><th>Link</th>
            </tr></thead>
            <tbody>
              {sorted.map(item => (
                <tr key={item.id}>
                  <td style={{ color: C.text, maxWidth: 260 }}>{item.title}</td>
                  <td style={{ color: C.muted, fontSize: 12 }}>{item.type}</td>
                  <td><StatusBadge status={item.status} /></td>
                  <td style={{ color: C.muted, fontSize: 12, whiteSpace: "nowrap" }}>{item.scheduledDate || "—"}</td>
                  <td>{item.link ? <a href={item.link} target="_blank" rel="noreferrer" style={{ color: C.gold, fontSize: 12, fontFamily: "'Lato', sans-serif" }}>View →</a> : <span style={{ color: C.muted, fontSize: 12 }}>—</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function ContentOutputView({ client }) {
  const byStatus = CONTENT_STATUSES.map(s => ({ status: s, items: client.contentCalendar.filter(i => i.status === s) }));
  return (
    <div className="ks-up">
      <SectionHeading icon="◈">Content Output</SectionHeading>
      <div style={{ display: "flex", gap: 12, marginBottom: 28, flexWrap: "wrap" }}>
        {byStatus.map(({ status, items }) => (
          <div key={status} style={{ flex: 1, minWidth: 100, background: C.surface, border: `1px solid ${C.goldBorder}`, padding: "16px 20px", textAlign: "center" }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: C.gold, fontWeight: 500 }}>{items.length}</div>
            <div style={{ fontFamily: "'Lato', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: C.muted, marginTop: 5 }}>{status}</div>
          </div>
        ))}
      </div>
      {client.contentCalendar.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {client.contentCalendar.map(item => (
            <div key={item.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 0", borderBottom: `1px solid rgba(255,255,255,0.04)`, gap: 16 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "'Lato', sans-serif", fontSize: 13, color: C.text }}>{item.title}</div>
                <div style={{ fontFamily: "'Lato', sans-serif", fontSize: 11, color: C.muted, marginTop: 3 }}>{item.type}</div>
              </div>
              <StatusBadge status={item.status} />
            </div>
          ))}
        </div>
      )}
      {client.contentCalendar.length === 0 && <EmptyState message="Content output will appear here." />}
    </div>
  );
}

function PerformanceView({ client }) {
  const r = client.performanceReport;
  return (
    <div className="ks-up">
      <SectionHeading icon="◈">Performance Report</SectionHeading>
      {r.period ? (
        <>
          <div style={{ fontFamily: "'Lato', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: C.muted, marginBottom: 24 }}>{r.period}</div>
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap", marginBottom: 32 }}>
            <Stat label="Engagement" value={r.engagement || "—"} />
            <Stat label="Total Reach" value={r.reach || "—"} />
            <Stat label="Placements" value={r.placements || "0"} />
          </div>
          <GoldRule />
          {r.summary && (
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 300, color: C.text, lineHeight: 1.75, letterSpacing: "0.01em", fontStyle: "italic" }}>
              " {r.summary} "
            </div>
          )}
        </>
      ) : <EmptyState message="Your first performance report will appear here." />}
    </div>
  );
}

function PublicationLogView({ client }) {
  const sorted = [...client.publicationLog].sort((a, b) => new Date(b.date) - new Date(a.date));
  return (
    <div className="ks-up">
      <SectionHeading icon="◈">Publication Log</SectionHeading>
      {sorted.length === 0 ? <EmptyState message="Placed articles will be logged here." /> : (
        <div style={{ overflowX: "auto" }}>
          <table className="ks-table">
            <thead><tr><th>Outlet</th><th>Title</th><th>Date</th><th>Link</th></tr></thead>
            <tbody>
              {sorted.map(p => (
                <tr key={p.id}>
                  <td style={{ color: C.gold, fontWeight: 700, fontSize: 12, whiteSpace: "nowrap" }}>{p.outlet}</td>
                  <td style={{ color: C.text }}>{p.title}</td>
                  <td style={{ color: C.muted, fontSize: 12, whiteSpace: "nowrap" }}>{p.date}</td>
                  <td>{p.link ? <a href={p.link} target="_blank" rel="noreferrer" style={{ color: C.gold, fontSize: 12 }}>View →</a> : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function MilestonesView({ client }) {
  const order = { Complete: 0, "In Progress": 1, "Not Started": 2 };
  const sorted = [...client.milestones].sort((a, b) => order[a.status] - order[b.status]);
  return (
    <div className="ks-up">
      <SectionHeading icon="◈">Milestone Tracker</SectionHeading>
      {sorted.length === 0 ? <EmptyState message="Milestones will appear here." /> : (
        <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {sorted.map(m => (
            <div key={m.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 0", borderBottom: `1px solid rgba(255,255,255,0.04)`, gap: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, flex: 1 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: m.status === "Complete" ? C.gold : m.status === "In Progress" ? "#c9a84c88" : "rgba(255,255,255,0.15)", flexShrink: 0 }} />
                <div>
                  <div style={{ fontFamily: "'Lato', sans-serif", fontSize: 13, color: m.status === "Complete" ? C.text : C.dim }}>{m.name}</div>
                  {m.completionDate && <div style={{ fontFamily: "'Lato', sans-serif", fontSize: 11, color: C.muted, marginTop: 2 }}>Completed {m.completionDate}</div>}
                </div>
              </div>
              <StatusBadge status={m.status} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function BrandRoadmapView({ client }) {
  const periods = [
    { key: "90day", label: "90-Day Goals" },
    { key: "6month", label: "6-Month Goals" },
    { key: "12month", label: "12-Month Goals" },
  ];
  return (
    <div className="ks-up">
      <SectionHeading icon="◈">Brand Roadmap</SectionHeading>
      {client.goals.length === 0 ? <EmptyState message="Your brand roadmap will appear here." /> : (
        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          {periods.map(({ key, label }) => {
            const goals = client.goals.filter(g => g.period === key);
            if (!goals.length) return null;
            return (
              <div key={key}>
                <div style={{ fontFamily: "'Lato', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: C.muted, marginBottom: 16, paddingBottom: 8, borderBottom: `1px solid ${C.goldBorder}` }}>{label}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                  {goals.map(g => (
                    <div key={g.id}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                        <span style={{ fontFamily: "'Lato', sans-serif", fontSize: 13, color: C.text }}>{g.name}</span>
                        <TrajectoryTag trajectory={g.trajectory} />
                      </div>
                      <ProgressBar value={g.progress} trajectory={g.trajectory} />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ManuscriptView({ client }) {
  const total = client.chapters.length;
  const finalCount = client.chapters.filter(c => c.status === "Final").length;
  const revisionCount = client.chapters.filter(c => c.status === "Revision").length;
  const draftCount = client.chapters.filter(c => c.status === "Draft").length;
  const progressPct = total > 0 ? Math.round(((finalCount + revisionCount * 0.7 + draftCount * 0.3) / total) * 100) : 0;

  return (
    <div className="ks-up">
      <SectionHeading icon="◈">Manuscript Tracker</SectionHeading>
      {total > 0 && (
        <>
          <div style={{ display: "flex", gap: 24, marginBottom: 28, flexWrap: "wrap" }}>
            <Stat label="Total Chapters" value={total} />
            <Stat label="Finalized" value={finalCount} />
            <Stat label="Complete" value={`${progressPct}%`} />
            {client.estimatedCompletion && <Stat label="Est. Completion" value={client.estimatedCompletion} />}
          </div>
          <div style={{ marginBottom: 8 }}><div style={{ fontFamily: "'Lato', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: C.muted, marginBottom: 8 }}>Overall Progress</div></div>
          <ProgressBar value={progressPct} trajectory="on-track" />
          <GoldRule my={28} />
        </>
      )}
      {client.manuscriptNotes && (
        <>
          <div style={{ fontFamily: "'Lato', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: C.muted, marginBottom: 12 }}>Notes from Mikaela</div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 17, color: C.dim, lineHeight: 1.7, marginBottom: 28 }}>
            " {client.manuscriptNotes} "
          </div>
          <GoldRule my={0} />
        </>
      )}
      <div style={{ marginTop: 24 }}>
        {client.chapters.length === 0 ? <EmptyState message="Chapter details will appear here." /> : (
          <div style={{ overflowX: "auto" }}>
            <table className="ks-table">
              <thead><tr><th>Chapter</th><th>Status</th><th>Due</th><th>Notes</th></tr></thead>
              <tbody>
                {client.chapters.map(ch => (
                  <tr key={ch.id}>
                    <td style={{ color: C.text, fontFamily: "'Cormorant Garamond', serif", fontSize: 15 }}>{ch.title}</td>
                    <td><StatusBadge status={ch.status} /></td>
                    <td style={{ color: C.muted, fontSize: 12, whiteSpace: "nowrap" }}>{ch.dueDate || "—"}</td>
                    <td style={{ color: C.dim, fontSize: 12, fontStyle: "italic", maxWidth: 220 }}>{ch.notes || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// CLIENT DASHBOARD
// ─────────────────────────────────────────────────────────────
function ClientDashboard({ client, onLogout }) {
  const [activeView, setActiveView] = useState("calendar");
  const [menuOpen, setMenuOpen] = useState(false);

  const branding = isBranding(client.tier);
  const manuscript = isManuscript(client.tier);
  const authority = hasAuthority(client.tier);
  const influence = hasInfluence(client.tier);

  const navItems = [
    ...(branding ? [
      { key: "calendar", label: "Calendar" },
      { key: "output", label: "Content Output" },
      { key: "performance", label: "Performance" },
      { key: "publications", label: "Publications" },
    ] : []),
    ...(authority ? [{ key: "milestones", label: "Milestones" }] : []),
    ...(influence ? [{ key: "roadmap", label: "Brand Roadmap" }] : []),
    ...(manuscript ? [{ key: "manuscript", label: "Manuscript" }] : []),
  ];

  const renderView = () => {
    if (activeView === "calendar") return <ContentCalendarView client={client} />;
    if (activeView === "output") return <ContentOutputView client={client} />;
    if (activeView === "performance") return <PerformanceView client={client} />;
    if (activeView === "publications") return <PublicationLogView client={client} />;
    if (activeView === "milestones") return <MilestonesView client={client} />;
    if (activeView === "roadmap") return <BrandRoadmapView client={client} />;
    if (activeView === "manuscript") return <ManuscriptView client={client} />;
    return null;
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: C.bg }}>
      {/* Sidebar */}
      <div className="sidebar-desktop" style={{ width: 220, background: C.surface, borderRight: `1px solid ${C.goldBorder}`, display: "flex", flexDirection: "column", flexShrink: 0, position: "sticky", top: 0, height: "100vh", overflow: "hidden" }}>
        <div style={{ padding: "28px 20px 20px" }}>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 10, fontWeight: 400, letterSpacing: "0.3em", textTransform: "uppercase", color: C.muted, marginBottom: 6 }}>Client Portal</div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 300, color: C.white, letterSpacing: "0.08em" }}>Kepler<span style={{ color: C.gold }}> Script</span></div>
        </div>
        <GoldRule my={0} />
        <div style={{ padding: "16px 0 8px" }}>
          <div style={{ padding: "0 20px 12px", fontFamily: "'Lato', sans-serif", fontSize: 11, color: C.text, fontWeight: 700 }}>{client.name}</div>
          <div style={{ padding: "0 20px 14px" }}><TierChip tier={client.tier} /></div>
        </div>
        <GoldRule my={0} />
        <nav style={{ flex: 1, paddingTop: 8, overflow: "auto" }}>
          {navItems.map(item => (
            <div key={item.key} className={`nav-item ${activeView === item.key ? "active" : ""}`} onClick={() => setActiveView(item.key)}>
              {item.label}
            </div>
          ))}
        </nav>
        <div style={{ padding: "16px 20px", borderTop: `1px solid ${C.goldBorder}` }}>
          <button className="btn-ghost" onClick={onLogout} style={{ width: "100%", fontSize: 10 }}>Sign Out</button>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, overflow: "auto" }}>
        {/* Top bar mobile */}
        <div style={{ display: "none", padding: "16px 16px 0", justifyContent: "space-between", alignItems: "center" }} className="mobile-topbar">
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, color: C.white }}>Kepler <span style={{ color: C.gold }}>Script</span></div>
          <button className="btn-ghost" onClick={onLogout} style={{ fontSize: 10 }}>Sign Out</button>
        </div>
        {/* Mobile nav pills */}
        <div style={{ padding: "0 16px", display: "none", overflowX: "auto", gap: 8, paddingTop: 16 }}>
          {navItems.map(item => (
            <button key={item.key} onClick={() => setActiveView(item.key)} style={{ background: activeView === item.key ? C.goldDim : "transparent", border: `1px solid ${activeView === item.key ? C.gold : C.goldBorder}`, color: activeView === item.key ? C.gold : C.dim, fontFamily: "'Lato', sans-serif", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", padding: "7px 14px", cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0 }}>
              {item.label}
            </button>
          ))}
        </div>
        <div className="content-padded" style={{ padding: "48px 52px", maxWidth: 820 }}>
          {renderView()}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// ADMIN MODALS
// ─────────────────────────────────────────────────────────────
function ContentEntryModal({ entry, onSave, onClose }) {
  const [form, setForm] = useState(entry || { title: "", type: "LinkedIn Post", status: "In Progress", scheduledDate: "", link: "" });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  return (
    <Modal title={entry ? "Edit Content Entry" : "Add Content Entry"} onClose={onClose}>
      <FormRow label="Title"><input className="ks-field" value={form.title} onChange={e => set("title", e.target.value)} placeholder="Content title" /></FormRow>
      <FormRow label="Type"><select className="ks-field" value={form.type} onChange={e => set("type", e.target.value)}>{CONTENT_TYPES.map(t => <option key={t}>{t}</option>)}</select></FormRow>
      <FormRow label="Status"><select className="ks-field" value={form.status} onChange={e => set("status", e.target.value)}>{CONTENT_STATUSES.map(s => <option key={s}>{s}</option>)}</select></FormRow>
      <FormRow label="Scheduled Date"><input className="ks-field" type="date" value={form.scheduledDate} onChange={e => set("scheduledDate", e.target.value)} /></FormRow>
      <FormRow label="Link (optional)"><input className="ks-field" value={form.link} onChange={e => set("link", e.target.value)} placeholder="https://…" /></FormRow>
      <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
        <button className="btn-gold" onClick={() => onSave({ ...form, id: form.id || uid() })}>Save Entry</button>
        <button className="btn-ghost" onClick={onClose}>Cancel</button>
      </div>
    </Modal>
  );
}

function PublicationModal({ entry, onSave, onClose }) {
  const [form, setForm] = useState(entry || { outlet: "", title: "", date: "", link: "" });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  return (
    <Modal title={entry ? "Edit Publication" : "Add Publication"} onClose={onClose}>
      <FormRow label="Outlet"><input className="ks-field" value={form.outlet} onChange={e => set("outlet", e.target.value)} placeholder="Forbes, Inc., HBR…" /></FormRow>
      <FormRow label="Article Title"><input className="ks-field" value={form.title} onChange={e => set("title", e.target.value)} placeholder="Article title" /></FormRow>
      <FormRow label="Publication Date"><input className="ks-field" type="date" value={form.date} onChange={e => set("date", e.target.value)} /></FormRow>
      <FormRow label="Link"><input className="ks-field" value={form.link} onChange={e => set("link", e.target.value)} placeholder="https://…" /></FormRow>
      <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
        <button className="btn-gold" onClick={() => onSave({ ...form, id: form.id || uid() })}>Save</button>
        <button className="btn-ghost" onClick={onClose}>Cancel</button>
      </div>
    </Modal>
  );
}

function MilestoneModal({ entry, onSave, onClose }) {
  const [form, setForm] = useState(entry || { name: "", status: "Not Started", completionDate: "" });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  return (
    <Modal title={entry ? "Edit Milestone" : "Add Milestone"} onClose={onClose}>
      <FormRow label="Milestone Name"><input className="ks-field" value={form.name} onChange={e => set("name", e.target.value)} placeholder="e.g. First Forbes Placement" /></FormRow>
      <FormRow label="Status"><select className="ks-field" value={form.status} onChange={e => set("status", e.target.value)}>{MILESTONE_STATUSES.map(s => <option key={s}>{s}</option>)}</select></FormRow>
      <FormRow label="Completion Date (if complete)"><input className="ks-field" type="date" value={form.completionDate} onChange={e => set("completionDate", e.target.value)} /></FormRow>
      <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
        <button className="btn-gold" onClick={() => onSave({ ...form, id: form.id || uid() })}>Save</button>
        <button className="btn-ghost" onClick={onClose}>Cancel</button>
      </div>
    </Modal>
  );
}

function GoalModal({ entry, onSave, onClose }) {
  const [form, setForm] = useState(entry || { name: "", period: "90day", progress: 0, trajectory: "on-track" });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  return (
    <Modal title={entry ? "Edit Goal" : "Add Goal"} onClose={onClose}>
      <FormRow label="Goal Name"><input className="ks-field" value={form.name} onChange={e => set("name", e.target.value)} placeholder="e.g. LinkedIn: 15K Followers" /></FormRow>
      <FormRow label="Timeframe">
        <select className="ks-field" value={form.period} onChange={e => set("period", e.target.value)}>
          <option value="90day">90-Day</option>
          <option value="6month">6-Month</option>
          <option value="12month">12-Month</option>
        </select>
      </FormRow>
      <FormRow label={`Progress: ${form.progress}%`}>
        <input type="range" min={0} max={100} value={form.progress} onChange={e => set("progress", Number(e.target.value))} style={{ width: "100%", accentColor: C.gold }} />
      </FormRow>
      <FormRow label="Trajectory">
        <select className="ks-field" value={form.trajectory} onChange={e => set("trajectory", e.target.value)}>
          {GOAL_TRAJECTORIES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </FormRow>
      <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
        <button className="btn-gold" onClick={() => onSave({ ...form, id: form.id || uid() })}>Save</button>
        <button className="btn-ghost" onClick={onClose}>Cancel</button>
      </div>
    </Modal>
  );
}

function ChapterModal({ entry, onSave, onClose }) {
  const [form, setForm] = useState(entry || { title: "", status: "Outline", notes: "", dueDate: "" });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  return (
    <Modal title={entry ? "Edit Chapter" : "Add Chapter"} onClose={onClose}>
      <FormRow label="Chapter Title"><input className="ks-field" value={form.title} onChange={e => set("title", e.target.value)} placeholder="e.g. Chapter 1: The Beginning" /></FormRow>
      <FormRow label="Status"><select className="ks-field" value={form.status} onChange={e => set("status", e.target.value)}>{CHAPTER_STATUSES.map(s => <option key={s}>{s}</option>)}</select></FormRow>
      <FormRow label="Due Date"><input className="ks-field" type="date" value={form.dueDate} onChange={e => set("dueDate", e.target.value)} /></FormRow>
      <FormRow label="Notes for Client"><textarea className="ks-field" value={form.notes} onChange={e => set("notes", e.target.value)} placeholder="Notes visible to client…" /></FormRow>
      <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
        <button className="btn-gold" onClick={() => onSave({ ...form, id: form.id || uid() })}>Save</button>
        <button className="btn-ghost" onClick={onClose}>Cancel</button>
      </div>
    </Modal>
  );
}

function AddClientModal({ users, onSave, onClose }) {
  const [form, setForm] = useState({ name: "", username: "", password: "portal123", tier: "foundation" });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const usernameExists = users.some(u => u.username === form.username.toLowerCase().trim());
  return (
    <Modal title="Add New Client" onClose={onClose}>
      <FormRow label="Full Name"><input className="ks-field" value={form.name} onChange={e => set("name", e.target.value)} placeholder="Client Name" /></FormRow>
      <FormRow label="Username">
        <input className="ks-field" value={form.username} onChange={e => set("username", e.target.value.toLowerCase().replace(/\s/g, "."))} placeholder="first.last" />
        {usernameExists && <div style={{ color: "#c97070", fontSize: 11, marginTop: 4, fontFamily: "'Lato', sans-serif" }}>Username already exists</div>}
      </FormRow>
      <FormRow label="Password"><input className="ks-field" value={form.password} onChange={e => set("password", e.target.value)} /></FormRow>
      <FormRow label="Service Tier">
        <select className="ks-field" value={form.tier} onChange={e => set("tier", e.target.value)}>
          {TIERS.map(t => <option key={t} value={t}>{TIER_LABELS[t]}</option>)}
        </select>
      </FormRow>
      <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
        <button className="btn-gold" disabled={!form.name || !form.username || usernameExists} onClick={() => onSave(form)}>Add Client</button>
        <button className="btn-ghost" onClick={onClose}>Cancel</button>
      </div>
    </Modal>
  );
}

// ─────────────────────────────────────────────────────────────
// ADMIN CLIENT EDITOR
// ─────────────────────────────────────────────────────────────
function AdminClientEditor({ client, users, onUpdate, onBack }) {
  const [activeTab, setActiveTab] = useState("content");
  const [modal, setModal] = useState(null);
  const [editItem, setEditItem] = useState(null);

  const tabs = [
    { key: "content", label: "Content" },
    { key: "report", label: "Report" },
    { key: "publications", label: "Publications" },
    ...(hasAuthority(client.tier) ? [{ key: "milestones", label: "Milestones" }] : []),
    ...(hasInfluence(client.tier) ? [{ key: "goals", label: "Goals" }] : []),
    ...(isManuscript(client.tier) ? [{ key: "manuscript", label: "Manuscript" }] : []),
    { key: "settings", label: "Settings" },
  ];

  const update = (patch) => onUpdate({ ...client, ...patch });

  // ── Content Calendar ──
  const ContentTab = () => (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
        <button className="btn-ghost" onClick={() => { setEditItem(null); setModal("content"); }}>+ Add Entry</button>
      </div>
      {client.contentCalendar.length === 0 ? <EmptyState message="No content entries yet." /> : (
        <table className="ks-table">
          <thead><tr><th>Title</th><th>Type</th><th>Status</th><th>Date</th><th></th></tr></thead>
          <tbody>
            {client.contentCalendar.map(item => (
              <tr key={item.id}>
                <td style={{ color: C.text, maxWidth: 200 }}>{item.title}</td>
                <td style={{ color: C.muted, fontSize: 12 }}>{item.type}</td>
                <td><StatusBadge status={item.status} /></td>
                <td style={{ color: C.muted, fontSize: 12 }}>{item.scheduledDate}</td>
                <td>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button className="btn-sm" onClick={() => { setEditItem(item); setModal("content"); }}>Edit</button>
                    <button className="btn-del" onClick={() => update({ contentCalendar: client.contentCalendar.filter(i => i.id !== item.id) })}>Del</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {modal === "content" && (
        <ContentEntryModal entry={editItem} onClose={() => { setModal(null); setEditItem(null); }}
          onSave={saved => { update({ contentCalendar: editItem ? client.contentCalendar.map(i => i.id === saved.id ? saved : i) : [...client.contentCalendar, saved] }); setModal(null); setEditItem(null); }} />
      )}
    </div>
  );

  // ── Performance Report ──
  const ReportTab = () => {
    const r = client.performanceReport;
    const [form, setForm] = useState({ ...r });
    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
    return (
      <div>
        <FormRow label="Reporting Period"><input className="ks-field" value={form.period} onChange={e => set("period", e.target.value)} placeholder="e.g. February 2024" /></FormRow>
        <div style={{ display: "flex", gap: 12, marginBottom: 18, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 100 }}><FormRow label="Engagement"><input className="ks-field" value={form.engagement} onChange={e => set("engagement", e.target.value)} placeholder="14.2K" /></FormRow></div>
          <div style={{ flex: 1, minWidth: 100 }}><FormRow label="Reach"><input className="ks-field" value={form.reach} onChange={e => set("reach", e.target.value)} placeholder="89K" /></FormRow></div>
          <div style={{ flex: 1, minWidth: 80 }}><FormRow label="Placements"><input className="ks-field" value={form.placements} onChange={e => set("placements", e.target.value)} placeholder="3" /></FormRow></div>
        </div>
        <FormRow label="Summary"><textarea className="ks-field" rows={5} value={form.summary} onChange={e => set("summary", e.target.value)} placeholder="Monthly narrative for the client…" /></FormRow>
        <button className="btn-gold" onClick={() => update({ performanceReport: form })}>Save Report</button>
      </div>
    );
  };

  // ── Publications ──
  const PubsTab = () => (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
        <button className="btn-ghost" onClick={() => { setEditItem(null); setModal("pub"); }}>+ Add Publication</button>
      </div>
      {client.publicationLog.length === 0 ? <EmptyState message="No publications logged." /> : (
        <table className="ks-table">
          <thead><tr><th>Outlet</th><th>Title</th><th>Date</th><th></th></tr></thead>
          <tbody>
            {client.publicationLog.map(p => (
              <tr key={p.id}>
                <td style={{ color: C.gold, fontWeight: 700, fontSize: 12 }}>{p.outlet}</td>
                <td style={{ color: C.text }}>{p.title}</td>
                <td style={{ color: C.muted, fontSize: 12 }}>{p.date}</td>
                <td>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button className="btn-sm" onClick={() => { setEditItem(p); setModal("pub"); }}>Edit</button>
                    <button className="btn-del" onClick={() => update({ publicationLog: client.publicationLog.filter(i => i.id !== p.id) })}>Del</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {modal === "pub" && (
        <PublicationModal entry={editItem} onClose={() => { setModal(null); setEditItem(null); }}
          onSave={saved => { update({ publicationLog: editItem ? client.publicationLog.map(i => i.id === saved.id ? saved : i) : [...client.publicationLog, saved] }); setModal(null); setEditItem(null); }} />
      )}
    </div>
  );

  // ── Milestones ──
  const MilestonesTab = () => (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
        <button className="btn-ghost" onClick={() => { setEditItem(null); setModal("milestone"); }}>+ Add Milestone</button>
      </div>
      {client.milestones.length === 0 ? <EmptyState message="No milestones yet." /> : (
        <table className="ks-table">
          <thead><tr><th>Milestone</th><th>Status</th><th>Completed</th><th></th></tr></thead>
          <tbody>
            {client.milestones.map(m => (
              <tr key={m.id}>
                <td style={{ color: C.text }}>{m.name}</td>
                <td><StatusBadge status={m.status} /></td>
                <td style={{ color: C.muted, fontSize: 12 }}>{m.completionDate || "—"}</td>
                <td>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button className="btn-sm" onClick={() => { setEditItem(m); setModal("milestone"); }}>Edit</button>
                    <button className="btn-del" onClick={() => update({ milestones: client.milestones.filter(i => i.id !== m.id) })}>Del</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {modal === "milestone" && (
        <MilestoneModal entry={editItem} onClose={() => { setModal(null); setEditItem(null); }}
          onSave={saved => { update({ milestones: editItem ? client.milestones.map(i => i.id === saved.id ? saved : i) : [...client.milestones, saved] }); setModal(null); setEditItem(null); }} />
      )}
    </div>
  );

  // ── Goals ──
  const GoalsTab = () => (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
        <button className="btn-ghost" onClick={() => { setEditItem(null); setModal("goal"); }}>+ Add Goal</button>
      </div>
      {client.goals.length === 0 ? <EmptyState message="No goals yet." /> : (
        <table className="ks-table">
          <thead><tr><th>Goal</th><th>Period</th><th>Progress</th><th>Trajectory</th><th></th></tr></thead>
          <tbody>
            {client.goals.map(g => (
              <tr key={g.id}>
                <td style={{ color: C.text }}>{g.name}</td>
                <td style={{ color: C.muted, fontSize: 12 }}>{g.period}</td>
                <td><span style={{ fontFamily: "'Playfair Display', serif", color: C.gold, fontSize: 14 }}>{g.progress}%</span></td>
                <td><TrajectoryTag trajectory={g.trajectory} /></td>
                <td>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button className="btn-sm" onClick={() => { setEditItem(g); setModal("goal"); }}>Edit</button>
                    <button className="btn-del" onClick={() => update({ goals: client.goals.filter(i => i.id !== g.id) })}>Del</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {modal === "goal" && (
        <GoalModal entry={editItem} onClose={() => { setModal(null); setEditItem(null); }}
          onSave={saved => { update({ goals: editItem ? client.goals.map(i => i.id === saved.id ? saved : i) : [...client.goals, saved] }); setModal(null); setEditItem(null); }} />
      )}
    </div>
  );

  // ── Manuscript ──
  const ManuscriptTab = () => {
    const [mNotes, setMNotes] = useState(client.manuscriptNotes || "");
    const [mEst, setMEst] = useState(client.estimatedCompletion || "");
    return (
      <div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
          <FormRow label="Estimated Completion"><input className="ks-field" value={mEst} onChange={e => setMEst(e.target.value)} placeholder="e.g. May 2024" /></FormRow>
        </div>
        <FormRow label="Overall Notes for Client"><textarea className="ks-field" rows={3} value={mNotes} onChange={e => setMNotes(e.target.value)} placeholder="Notes visible to client…" /></FormRow>
        <button className="btn-gold" onClick={() => update({ manuscriptNotes: mNotes, estimatedCompletion: mEst })} style={{ marginBottom: 28 }}>Save Notes</button>
        <GoldRule />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "20px 0 16px" }}>
          <div style={{ fontFamily: "'Lato', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: C.muted }}>Chapters</div>
          <button className="btn-ghost" onClick={() => { setEditItem(null); setModal("chapter"); }}>+ Add Chapter</button>
        </div>
        {client.chapters.length === 0 ? <EmptyState message="No chapters yet." /> : (
          <table className="ks-table">
            <thead><tr><th>Chapter</th><th>Status</th><th>Due</th><th></th></tr></thead>
            <tbody>
              {client.chapters.map(ch => (
                <tr key={ch.id}>
                  <td style={{ color: C.text, fontFamily: "'Cormorant Garamond', serif", fontSize: 15 }}>{ch.title}</td>
                  <td><StatusBadge status={ch.status} /></td>
                  <td style={{ color: C.muted, fontSize: 12 }}>{ch.dueDate || "—"}</td>
                  <td>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button className="btn-sm" onClick={() => { setEditItem(ch); setModal("chapter"); }}>Edit</button>
                      <button className="btn-del" onClick={() => update({ chapters: client.chapters.filter(i => i.id !== ch.id) })}>Del</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {modal === "chapter" && (
          <ChapterModal entry={editItem} onClose={() => { setModal(null); setEditItem(null); }}
            onSave={saved => { update({ chapters: editItem ? client.chapters.map(i => i.id === saved.id ? saved : i) : [...client.chapters, saved] }); setModal(null); setEditItem(null); }} />
        )}
      </div>
    );
  };

  // ── Settings ──
  const SettingsTab = () => {
    const userForClient = users.find(u => u.clientId === client.id);
    const [form, setForm] = useState({ name: client.name, tier: client.tier, username: userForClient?.username || "" });
    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
    return (
      <div>
        <FormRow label="Client Name"><input className="ks-field" value={form.name} onChange={e => set("name", e.target.value)} /></FormRow>
        <FormRow label="Service Tier">
          <select className="ks-field" value={form.tier} onChange={e => set("tier", e.target.value)}>
            {TIERS.map(t => <option key={t} value={t}>{TIER_LABELS[t]}</option>)}
          </select>
        </FormRow>
        <button className="btn-gold" onClick={() => update({ name: form.name, tier: form.tier })}>Save Settings</button>
      </div>
    );
  };

  return (
    <div className="ks-in">
      <button onClick={onBack} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontFamily: "'Lato', sans-serif", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", display: "flex", alignItems: "center", gap: 6, marginBottom: 28, padding: 0 }}>
        ← All Clients
      </button>
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 6 }}>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 32, fontWeight: 400, color: C.white }}>{client.name}</h1>
        <TierChip tier={client.tier} />
      </div>
      <div style={{ fontFamily: "'Lato', sans-serif", fontSize: 11, color: C.muted, letterSpacing: "0.08em", marginBottom: 28 }}>Client since {client.joinDate}</div>
      <GoldRule my={0} />
      {/* Tabs */}
      <div style={{ display: "flex", gap: 0, borderBottom: `1px solid ${C.goldBorder}`, marginBottom: 28, overflowX: "auto" }}>
        {tabs.map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)} style={{ background: "none", border: "none", borderBottom: activeTab === t.key ? `2px solid ${C.gold}` : "2px solid transparent", color: activeTab === t.key ? C.gold : C.muted, fontFamily: "'Lato', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", padding: "12px 16px", cursor: "pointer", whiteSpace: "nowrap", transition: "color 0.2s", marginBottom: -1 }}>
            {t.label}
          </button>
        ))}
      </div>
      {activeTab === "content" && <ContentTab />}
      {activeTab === "report" && <ReportTab />}
      {activeTab === "publications" && <PubsTab />}
      {activeTab === "milestones" && <MilestonesTab />}
      {activeTab === "goals" && <GoalsTab />}
      {activeTab === "manuscript" && <ManuscriptTab />}
      {activeTab === "settings" && <SettingsTab />}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// ADMIN DASHBOARD
// ─────────────────────────────────────────────────────────────
function AdminDashboard({ clients, users, onUpdateClient, onAddClient, onLogout }) {
  const [view, setView] = useState("list");
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [showAddClient, setShowAddClient] = useState(false);
  const [saveIndicator, setSaveIndicator] = useState(false);

  const selectedClient = clients.find(c => c.id === selectedClientId);

  const handleUpdate = useCallback((updated) => {
    onUpdateClient(updated);
    setSaveIndicator(true);
    setTimeout(() => setSaveIndicator(false), 1800);
  }, [onUpdateClient]);

  const handleAddClient = (form) => {
    const newClientId = `c_${uid()}`;
    const newClient = {
      id: newClientId, name: form.name, username: form.username,
      tier: form.tier, joinDate: new Date().toISOString().split("T")[0],
      contentCalendar: [], publicationLog: [],
      performanceReport: { period: "", engagement: "", reach: "", placements: "", summary: "" },
      milestones: [], goals: [], chapters: [], estimatedCompletion: "", manuscriptNotes: "",
    };
    onAddClient(newClient, { username: form.username, password: form.password, role: "client", clientId: newClientId });
    setShowAddClient(false);
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: C.bg }}>
      {/* Sidebar */}
      <div className="sidebar-desktop" style={{ width: 220, background: C.surface, borderRight: `1px solid ${C.goldBorder}`, display: "flex", flexDirection: "column", flexShrink: 0, position: "sticky", top: 0, height: "100vh" }}>
        <div style={{ padding: "28px 20px 20px" }}>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 10, fontWeight: 400, letterSpacing: "0.3em", textTransform: "uppercase", color: C.muted, marginBottom: 6 }}>Admin Portal</div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 300, color: C.white, letterSpacing: "0.08em" }}>Kepler<span style={{ color: C.gold }}> Script</span></div>
        </div>
        <GoldRule my={0} />
        <div style={{ padding: "16px 0 8px" }}>
          <div style={{ padding: "0 20px 8px", fontFamily: "'Lato', sans-serif", fontSize: 11, color: C.text, fontWeight: 700 }}>Mikaela Ashcroft</div>
          <div style={{ padding: "0 20px 14px" }}>
            <span style={{ background: "rgba(201,168,76,0.1)", color: C.gold, border: `1px solid rgba(201,168,76,0.3)`, fontFamily: "'Lato', sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", padding: "3px 8px" }}>Admin</span>
          </div>
        </div>
        <GoldRule my={0} />
        <nav style={{ flex: 1, paddingTop: 8 }}>
          <div className={`nav-item ${view === "list" ? "active" : ""}`} onClick={() => { setView("list"); setSelectedClientId(null); }}>All Clients</div>
          <div className="nav-item" style={{ opacity: 0.4, cursor: "default", fontSize: 10 }}>— {clients.length} active</div>
        </nav>
        <div style={{ padding: "16px 20px", borderTop: `1px solid ${C.goldBorder}` }}>
          {saveIndicator && <div style={{ fontFamily: "'Lato', sans-serif", fontSize: 10, color: C.gold, letterSpacing: "0.1em", textAlign: "center", marginBottom: 10 }}>✓ Saved</div>}
          <button className="btn-ghost" onClick={onLogout} style={{ width: "100%", fontSize: 10 }}>Sign Out</button>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, overflow: "auto" }}>
        <div className="content-padded" style={{ padding: "48px 52px", maxWidth: 900 }}>
          {view === "list" && (
            <div className="ks-up">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
                <div>
                  <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontWeight: 400, fontSize: 34, color: C.white, letterSpacing: "0.02em" }}>Client Roster</h1>
                  <div style={{ fontFamily: "'Lato', sans-serif", fontSize: 12, color: C.muted, marginTop: 5 }}>{clients.length} active engagement{clients.length !== 1 ? "s" : ""}</div>
                </div>
                <button className="btn-gold" onClick={() => setShowAddClient(true)}>+ New Client</button>
              </div>
              <GoldRule my={0} />
              <div style={{ marginTop: 8 }}>
                {clients.map(c => (
                  <div key={c.id} onClick={() => { setSelectedClientId(c.id); setView("edit"); }}
                    style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 0", borderBottom: `1px solid rgba(255,255,255,0.04)`, cursor: "pointer", transition: "background 0.15s" }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(201,168,76,0.03)"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    <div>
                      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, color: C.white, fontWeight: 400, letterSpacing: "0.02em" }}>{c.name}</div>
                      <div style={{ fontFamily: "'Lato', sans-serif", fontSize: 11, color: C.muted, marginTop: 4 }}>@{c.username} · Since {c.joinDate}</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                      <TierChip tier={c.tier} />
                      <span style={{ color: C.muted, fontSize: 16 }}>›</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {view === "edit" && selectedClient && (
            <AdminClientEditor
              client={selectedClient}
              users={users}
              onUpdate={handleUpdate}
              onBack={() => { setView("list"); setSelectedClientId(null); }}
            />
          )}
        </div>
      </div>

      {showAddClient && (
        <AddClientModal users={users} onClose={() => setShowAddClient(false)} onSave={handleAddClient} />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// APP ROOT
// ─────────────────────────────────────────────────────────────
export default function App() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [clients, setClients] = useState([]);
  const [session, setSession] = useState(null); // { role, clientId? }

  // Load from storage
  useEffect(() => {
    (async () => {
      const u = await store.get("ks-users", DEFAULT_USERS);
      const c = await store.get("ks-clients", DEFAULT_CLIENTS);
      setUsers(u);
      setClients(c);
      setLoading(false);
    })();
  }, []);

  // Persist users
  useEffect(() => {
    if (users.length > 0) store.set("ks-users", users);
  }, [users]);

  // Persist clients
  useEffect(() => {
    if (clients.length > 0) store.set("ks-clients", clients);
  }, [clients]);

  const handleLogin = useCallback((username, password) => {
    const user = users.find(u => u.username === username && u.password === password);
    if (!user) return false;
    setSession({ role: user.role, clientId: user.clientId });
    return true;
  }, [users]);

  const handleLogout = () => setSession(null);

  const handleUpdateClient = useCallback((updated) => {
    setClients(prev => prev.map(c => c.id === updated.id ? updated : c));
  }, []);

  const handleAddClient = useCallback((newClient, newUser) => {
    setClients(prev => [...prev, newClient]);
    setUsers(prev => [...prev, newUser]);
  }, []);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 22, color: `${C.gold}60`, letterSpacing: "0.1em" }}>
          Kepler Script
        </div>
      </div>
    );
  }

  if (!session) return <LoginScreen onLogin={handleLogin} />;

  if (session.role === "admin") {
    return <AdminDashboard clients={clients} users={users} onUpdateClient={handleUpdateClient} onAddClient={handleAddClient} onLogout={handleLogout} />;
  }

  const clientData = clients.find(c => c.id === session.clientId);
  if (!clientData) return <LoginScreen onLogin={handleLogin} />;
  return <ClientDashboard client={clientData} onLogout={handleLogout} />;
}
