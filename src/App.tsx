import { useState, useEffect, useCallback, useMemo } from "react";

// ─────────────────────────────────────────────────────────────
// FONTS & GLOBAL STYLES
// ─────────────────────────────────────────────────────────────
(function init() {
  if (document.getElementById("ks-init")) return;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Lato:wght@300;400;700&family=Playfair+Display:wght@400;500;600;700&display=swap";
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
    @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.5; } }
    .ks-up { animation: fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) both; }
    .ks-in { animation: fadeIn 0.3s ease both; }
    .ks-input { background: transparent; border: none; border-bottom: 1px solid rgba(201,168,76,0.3); color: #fff; font-family: 'Lato', sans-serif; font-size: 14px; padding: 10px 2px; width: 100%; outline: none; letter-spacing: 0.03em; transition: border-color 0.2s; }
    .ks-input:focus { border-bottom-color: #c9a84c; }
    .ks-input::placeholder { color: rgba(255,255,255,0.3); }
    .ks-field { background: rgba(255,255,255,0.04); border: 1px solid rgba(201,168,76,0.18); color: #fff; font-family: 'Lato', sans-serif; font-size: 13px; padding: 9px 12px; width: 100%; outline: none; transition: border-color 0.2s; border-radius: 1px; letter-spacing: 0.02em; }
    .ks-field:focus { border-color: rgba(201,168,76,0.45); }
    .ks-field::placeholder { color: rgba(255,255,255,0.25); }
    .ks-field option { background: #26011e; }
    textarea.ks-field { resize: vertical; min-height: 72px; line-height: 1.55; }
    select.ks-field { cursor: pointer; appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23c9a84c' stroke-width='1.5' fill='none'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 10px center; padding-right: 30px; }
    .btn-gold { background: linear-gradient(135deg, #c9a84c, #e2c47a); border: none; color: #180013; font-family: 'Lato', sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; padding: 12px 28px; cursor: pointer; transition: opacity 0.2s, transform 0.15s; }
    .btn-gold:hover { opacity: 0.88; transform: translateY(-1px); }
    .btn-gold:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }
    .btn-ghost { background: transparent; border: 1px solid rgba(201,168,76,0.3); color: rgba(201,168,76,0.75); font-family: 'Lato', sans-serif; font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; padding: 9px 18px; cursor: pointer; transition: all 0.2s; }
    .btn-ghost:hover { border-color: #c9a84c; color: #c9a84c; }
    .btn-sm { background: transparent; border: 1px solid rgba(201,168,76,0.2); color: rgba(201,168,76,0.55); font-family: 'Lato', sans-serif; font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; padding: 5px 10px; cursor: pointer; transition: all 0.2s; white-space: nowrap; }
    .btn-sm:hover { border-color: rgba(201,168,76,0.5); color: rgba(201,168,76,0.9); }
    .btn-approve { background: rgba(100,180,100,0.1); border: 1px solid rgba(100,180,100,0.3); color: rgba(120,200,120,0.9); font-family:'Lato',sans-serif; font-size:10px; letter-spacing:0.1em; text-transform:uppercase; padding:5px 10px; cursor:pointer; transition:all 0.2s; }
    .btn-approve:hover { background: rgba(100,180,100,0.2); }
    .btn-revise { background: rgba(200,120,80,0.1); border: 1px solid rgba(200,120,80,0.3); color: rgba(220,140,100,0.9); font-family:'Lato',sans-serif; font-size:10px; letter-spacing:0.1em; text-transform:uppercase; padding:5px 10px; cursor:pointer; transition:all 0.2s; }
    .btn-revise:hover { background: rgba(200,120,80,0.2); }
    .btn-del { background: transparent; border: 1px solid rgba(201,100,100,0.25); color: rgba(201,100,100,0.6); font-family: 'Lato', sans-serif; font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase; padding: 5px 10px; cursor: pointer; transition: all 0.2s; }
    .btn-del:hover { border-color: rgba(201,100,100,0.6); color: rgba(201,100,100,0.9); }
    .nav-item { display: flex; align-items: center; gap: 9px; padding: 10px 20px 10px 18px; font-family: 'Lato', sans-serif; font-size: 11px; font-weight: 400; letter-spacing: 0.11em; text-transform: uppercase; color: rgba(255,255,255,0.4); cursor: pointer; transition: all 0.18s; border-left: 2px solid transparent; user-select: none; }
    .nav-item:hover { color: rgba(255,255,255,0.7); background: rgba(201,168,76,0.04); }
    .nav-item.active { color: #c9a84c; border-left-color: #c9a84c; background: rgba(201,168,76,0.07); }
    .modal-overlay { position: fixed; inset: 0; background: rgba(24,0,19,0.85); backdrop-filter: blur(6px); z-index: 200; display: flex; align-items: center; justify-content: center; padding: 16px; animation: fadeIn 0.2s ease; }
    .modal-box { background: #26011e; border: 1px solid rgba(201,168,76,0.22); width: 100%; max-width: 520px; max-height: 90vh; overflow-y: auto; padding: 28px 32px; animation: fadeUp 0.28s cubic-bezier(0.16,1,0.3,1); }
    .ks-table { width: 100%; border-collapse: collapse; }
    .ks-table th { font-family: 'Lato', sans-serif; font-size: 10px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: rgba(201,168,76,0.5); padding: 8px 12px 8px 0; text-align: left; border-bottom: 1px solid rgba(201,168,76,0.1); }
    .ks-table td { font-family: 'Lato', sans-serif; font-size: 13px; color: rgba(255,255,255,0.72); padding: 13px 12px 13px 0; border-bottom: 1px solid rgba(255,255,255,0.04); vertical-align: middle; }
    .ks-table tr:last-child td { border-bottom: none; }
    .ks-table tr:hover td { background: rgba(201,168,76,0.02); }
    .cal-cell { min-height: 90px; padding: 6px; border: 1px solid rgba(201,168,76,0.07); transition: background 0.15s; vertical-align: top; }
    .cal-cell.today { border-color: rgba(201,168,76,0.3); background: rgba(201,168,76,0.04); }
    .cal-cell.drag-over { background: rgba(201,168,76,0.1) !important; border-color: rgba(201,168,76,0.4) !important; }
    .cal-event { font-family:'Lato',sans-serif; font-size:10px; letter-spacing:0.04em; padding:3px 6px; margin-bottom:3px; cursor:pointer; border-radius:1px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; transition:opacity 0.15s; }
    .cal-event:hover { opacity:0.8; }
    .cal-event.dragging { opacity:0.4; }
    .tag-chip { display:inline-flex; align-items:center; gap:5px; background:rgba(201,168,76,0.1); border:1px solid rgba(201,168,76,0.2); color:rgba(201,168,76,0.85); font-family:'Lato',sans-serif; font-size:11px; padding:3px 10px; margin:3px; }
    .tag-chip .remove { cursor:pointer; opacity:0.6; font-size:13px; line-height:1; }
    .tag-chip .remove:hover { opacity:1; }
    .timeline-line { position:absolute; left:15px; top:0; bottom:0; width:1px; background:linear-gradient(180deg,transparent,rgba(201,168,76,0.25),transparent); }
    .msg-bubble { padding:10px 14px; margin-bottom:8px; max-width:80%; }
    .msg-bubble.mine { background:rgba(201,168,76,0.12); margin-left:auto; border:1px solid rgba(201,168,76,0.2); }
    .msg-bubble.theirs { background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.08); }
  `;
  document.head.appendChild(s);
})();

// ─────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────
const C = { bg:"#180013", surface:"#26011e", gold:"#c9a84c", goldL:"#e2c47a", goldBorder:"rgba(201,168,76,0.22)", white:"#ffffff", text:"rgba(255,255,255,0.88)", dim:"rgba(255,255,255,0.55)", muted:"rgba(255,255,255,0.35)" };
const TIERS = ["foundation","authority","influence","ghostwriting","coaching","editing"];
const TIER_LABELS = { foundation:"Foundation", authority:"Authority", influence:"Influence", ghostwriting:"Full Ghostwriting", coaching:"Book Coaching", editing:"Book Editing" };
const TIER_COLORS = { foundation:"#8a7a4c", authority:"#c9a84c", influence:"#e2c47a", ghostwriting:"#7a8aaf", coaching:"#7a9a8a", editing:"#9a8a7a" };
const CONTENT_STATUSES = ["In Progress","In Review","Published"];
const APPROVAL_STATUSES = ["Pending Approval","Approved","Revision Requested"];
const MILESTONE_STATUSES = ["Not Started","In Progress","Complete"];
const GOAL_TRAJECTORIES = ["on-track","ahead","needs-attention"];
const CHAPTER_STATUSES = ["Outline","Draft","Revision","Final"];
const CONTENT_TYPES = ["LinkedIn Post","LinkedIn Article","Newsletter","Forbes Article","Inc. Article","HBR Article","Fast Company Article","Other"];
const AI_PLATFORMS = ["ChatGPT","Perplexity","Google AI","Claude","Gemini"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const WEEKDAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const isBranding = t => ["foundation","authority","influence"].includes(t);
const isManuscript = t => ["ghostwriting","coaching","editing"].includes(t);
const hasAuthority = t => ["authority","influence"].includes(t);
const hasInfluence = t => t === "influence";
let _dragItem = null; // module-level drag state

// ─────────────────────────────────────────────────────────────
// DEFAULT DATA
// ─────────────────────────────────────────────────────────────
const DEFAULT_USERS = [
  { username:"mikaela", password:"kepler2024", role:"admin" },
  { username:"sarah.chen", password:"portal123", role:"client", clientId:"c1" },
  { username:"james.walker", password:"portal123", role:"client", clientId:"c2" },
  { username:"elena.russo", password:"portal123", role:"client", clientId:"c3" },
  { username:"david.park", password:"portal123", role:"client", clientId:"c4" },
];

const mkClient = (overrides) => ({
  contentCalendar:[], publicationLog:[],
  performanceReport:{ period:"", engagement:"", reach:"", placements:"", summary:"" },
  milestones:[], goals:[], chapters:[], estimatedCompletion:"", manuscriptNotes:"",
  meetings:[], documents:[], timelineEntries:[],
  linkedInStats:[],
  aiVisibility:{ score:0, lastUpdated:"", queries:[], suggestions:[] },
  brandVoice:{ toneWords:[], avoidWords:[], approvedTopics:[], guidelines:"", examplePosts:[] },
  ...overrides,
});

const DEFAULT_CLIENTS = [
  mkClient({
    id:"c1", name:"Sarah Chen", username:"sarah.chen", tier:"influence", joinDate:"2024-01-15",
    contentCalendar:[
      { id:"cc1", title:"The Art of Strategic Silence", type:"LinkedIn Article", status:"Published", approvalStatus:"Approved", revisionNotes:"", scheduledDate:"2024-03-01", link:"https://linkedin.com" },
      { id:"cc2", title:"Why Most Executives Fail at Thought Leadership", type:"Newsletter", status:"In Review", approvalStatus:"Pending Approval", revisionNotes:"", scheduledDate:"2024-03-10", link:"" },
      { id:"cc3", title:"The 5 Conversations That Built My Career", type:"LinkedIn Post", status:"In Progress", approvalStatus:"Pending Approval", revisionNotes:"", scheduledDate:"2024-03-18", link:"" },
      { id:"cc4", title:"Women Redefining Tech Leadership", type:"Forbes Article", status:"In Progress", approvalStatus:"Pending Approval", revisionNotes:"", scheduledDate:"2024-03-28", link:"" },
    ],
    publicationLog:[
      { id:"pl1", outlet:"Forbes", title:"The New Rules of Executive Presence", date:"2024-02-14", link:"https://forbes.com" },
      { id:"pl2", outlet:"Fast Company", title:"How to Build Influence Without Burning Out", date:"2024-01-28", link:"https://fastcompany.com" },
    ],
    performanceReport:{ period:"February 2024", engagement:"14.2K", reach:"89K", placements:"3", summary:"February marked a breakthrough month. Your Forbes placement drove a 340% spike in LinkedIn profile views. Newsletter open rate climbed to 58%—well above industry average." },
    milestones:[
      { id:"m1", name:"First Forbes Placement", status:"Complete", completionDate:"2024-02-14" },
      { id:"m2", name:"LinkedIn Followers: 10K", status:"Complete", completionDate:"2024-02-28" },
      { id:"m3", name:"Podcast Booked (Top 100)", status:"In Progress", completionDate:"" },
      { id:"m4", name:"Speaking Engagement Secured", status:"Not Started", completionDate:"" },
    ],
    goals:[
      { id:"g1", name:"3 Tier-1 Publications", period:"90day", progress:67, trajectory:"on-track" },
      { id:"g2", name:"LinkedIn: 15K Followers", period:"90day", progress:78, trajectory:"ahead" },
      { id:"g3", name:"Podcast Appearances: 5", period:"6month", progress:40, trajectory:"on-track" },
      { id:"g4", name:"Secure Speaking Fee: $10K+", period:"6month", progress:20, trajectory:"needs-attention" },
      { id:"g5", name:"Book Deal in Motion", period:"12month", progress:15, trajectory:"on-track" },
    ],
    meetings:[
      { id:"mt1", title:"Monthly Strategy Call", date:"2024-03-12", time:"10:00 AM", description:"Review February results and set March content priorities.", messages:[{ id:"msg1", from:"sarah.chen", text:"Can we move this to 11am? I have a conflict.", ts:"2024-03-10T09:00:00Z" }] },
      { id:"mt2", title:"Forbes Draft Review", date:"2024-03-25", time:"2:00 PM", description:"Walk through the draft for the tech leadership piece.", messages:[] },
    ],
    linkedInStats:[
      { id:"ls1", date:"2024-01-01", followers:8200, impressions:42000, profileViews:1800, engagementRate:"4.2", topPost:"The Quiet Power of Listening Leaders" },
      { id:"ls2", date:"2024-02-01", followers:10100, impressions:89000, profileViews:4200, engagementRate:"6.8", topPost:"Why Most Executives Fail at Thought Leadership" },
    ],
    aiVisibility:{ score:42, lastUpdated:"2024-03-01", queries:[
      { id:"q1", query:"Top women in tech leadership to follow", appears:true, platforms:["ChatGPT","Perplexity"], notes:"Appearing consistently in ChatGPT responses." },
      { id:"q2", query:"Executive presence thought leaders", appears:false, platforms:[], notes:"Not yet appearing. Target by Q3." },
      { id:"q3", query:"Best LinkedIn voices for executives", appears:true, platforms:["Perplexity"], notes:"Mentioned in Perplexity when asked about executive LinkedIn." },
    ], suggestions:["Publish 2 more HBR pieces to increase citation likelihood","Get quoted in at least 3 major tech publications this quarter","Increase podcast appearances — AI models surface frequent speakers"] },
    brandVoice:{ toneWords:["Authoritative","Warm","Precise","Strategic","Human"], avoidWords:["Hustle","Crushing it","Thought leader","Game-changer"], approvedTopics:["Executive Leadership","Women in Tech","Strategic Communication","Organizational Culture"], guidelines:"Sarah's voice balances authority with accessibility. She speaks from experience, not theory. No jargon, no buzzwords. Every piece should leave the reader with something actionable.", examplePosts:["The best meetings I've ever run had fewer slides and more silence.","Leadership isn't about having all the answers. It's about asking better questions."] },
    timelineEntries:[
      { id:"te1", date:"2024-01-10", type:"publication", title:"HBR Placement", description:"The Quiet Power of Listening Leaders published in Harvard Business Review." },
      { id:"te2", date:"2024-01-28", type:"publication", title:"Fast Company Feature", description:"How to Build Influence Without Burning Out." },
      { id:"te3", date:"2024-02-14", type:"milestone", title:"First Forbes Placement", description:"Milestone achieved — Forbes placement secured." },
      { id:"te4", date:"2024-02-28", type:"milestone", title:"LinkedIn: 10K Followers", description:"LinkedIn audience milestone hit." },
    ],
  }),
  mkClient({
    id:"c2", name:"James Walker", username:"james.walker", tier:"authority", joinDate:"2024-02-01",
    contentCalendar:[
      { id:"cc1", title:"The Founder's Guide to Delegation", type:"LinkedIn Article", status:"Published", approvalStatus:"Approved", revisionNotes:"", scheduledDate:"2024-03-05", link:"https://linkedin.com" },
      { id:"cc2", title:"Building Culture in a Remote-First World", type:"Newsletter", status:"In Progress", approvalStatus:"Pending Approval", revisionNotes:"", scheduledDate:"2024-03-14", link:"" },
    ],
    publicationLog:[
      { id:"pl1", outlet:"Inc.", title:"The Overlooked Skill Every Founder Needs", date:"2024-02-20", link:"https://inc.com" },
    ],
    performanceReport:{ period:"February 2024", engagement:"6.8K", reach:"42K", placements:"1", summary:"Solid first full month. The Inc. piece performed above expectations and has driven meaningful inbound to your LinkedIn." },
    milestones:[
      { id:"m1", name:"First Major Publication Placement", status:"Complete", completionDate:"2024-02-20" },
      { id:"m2", name:"LinkedIn Followers: 5K", status:"In Progress", completionDate:"" },
      { id:"m3", name:"Newsletter: 1K Subscribers", status:"Not Started", completionDate:"" },
    ],
    meetings:[
      { id:"mt1", title:"Onboarding Strategy Session", date:"2024-03-08", time:"9:00 AM", description:"Set 90-day content priorities and publication targets.", messages:[] },
    ],
    linkedInStats:[
      { id:"ls1", date:"2024-02-01", followers:3200, impressions:18000, profileViews:720, engagementRate:"3.1", topPost:"The Founder's Guide to Delegation" },
    ],
    brandVoice:{ toneWords:["Direct","Pragmatic","Honest","Energetic"], avoidWords:["Disruptive","Pivot","Synergy","Scale"], approvedTopics:["Founder Leadership","Remote Work","Company Culture","Delegation"], guidelines:"James speaks plainly and from the trenches. No theory — only what he's actually done.", examplePosts:[] },
  }),
  mkClient({
    id:"c3", name:"Elena Russo", username:"elena.russo", tier:"foundation", joinDate:"2024-02-15",
    contentCalendar:[
      { id:"cc1", title:"Five Lessons from 20 Years in Hospitality", type:"LinkedIn Article", status:"In Review", approvalStatus:"Pending Approval", revisionNotes:"", scheduledDate:"2024-03-10", link:"" },
    ],
    performanceReport:{ period:"February 2024", engagement:"—", reach:"—", placements:"0", summary:"First month focused on establishing your voice. Two strong pieces are in development." },
    meetings:[],
    brandVoice:{ toneWords:["Warm","Expert","Inviting","Grounded"], avoidWords:[], approvedTopics:["Hospitality","Guest Experience","Leadership"], guidelines:"Elena's voice reflects decades of experience in hospitality — warm but authoritative.", examplePosts:[] },
  }),
  mkClient({
    id:"c4", name:"David Park", username:"david.park", tier:"ghostwriting", joinDate:"2024-01-08",
    chapters:[
      { id:"ch1", title:"Prologue: The Problem with Perfect", status:"Final", notes:"Beautifully written. This is the hook that will keep readers turning pages.", dueDate:"2024-01-20" },
      { id:"ch2", title:"Chapter 1: Unlearning Success", status:"Final", notes:"Strong argument. Consider adding the Tokyo anecdote here.", dueDate:"2024-01-28" },
      { id:"ch3", title:"Chapter 2: The Architecture of Failure", status:"Revision", notes:"Section 3 needs tightening. Otherwise excellent.", dueDate:"2024-02-10" },
      { id:"ch4", title:"Chapter 3: When Systems Break People", status:"Draft", notes:"First draft strong. Awaiting your notes before revision.", dueDate:"2024-03-05" },
      { id:"ch5", title:"Chapter 4: The Recovery Blueprint", status:"Outline", notes:"Outline approved. Drafting begins next week.", dueDate:"2024-03-22" },
    ],
    estimatedCompletion:"May 2024",
    manuscriptNotes:"Overall trajectory is excellent. Your voice is compelling and distinctive.",
    meetings:[
      { id:"mt1", title:"Chapter 3 Review Call", date:"2024-03-15", time:"11:00 AM", description:"Walk through Chapter 3 draft together.", messages:[] },
    ],
    documents:[],
    brandVoice:{ toneWords:[], avoidWords:[], approvedTopics:[], guidelines:"", examplePosts:[] },
  }),
];

// ─────────────────────────────────────────────────────────────
// STORAGE (works in Claude artifact AND deployed)
// ─────────────────────────────────────────────────────────────
const store = {
  async get(key, fallback) {
    try {
      if (window.storage) {
        const r = await window.storage.get(key);
        return r ? JSON.parse(r.value) : fallback;
      }
      const val = localStorage.getItem(key);
      return val ? JSON.parse(val) : fallback;
    } catch { return fallback; }
  },
  async set(key, value) {
    try {
      if (window.storage) await window.storage.set(key, JSON.stringify(value));
      else localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  },
};
const uid = () => Math.random().toString(36).slice(2, 9);
const today = () => new Date().toISOString().split("T")[0];
const fmtDate = (d) => { if (!d) return "—"; const dt = new Date(d + "T00:00:00"); return dt.toLocaleDateString("en-US", { month:"short", day:"numeric", year:"numeric" }); };
const fmtTs = (ts) => { if (!ts) return ""; const d = new Date(ts); return d.toLocaleDateString("en-US",{month:"short",day:"numeric"}) + " · " + d.toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit"}); };

// ─────────────────────────────────────────────────────────────
// SHARED COMPONENTS
// ─────────────────────────────────────────────────────────────
function GoldRule({ my=20 }) { return <div style={{ height:1, background:`linear-gradient(90deg,transparent,${C.gold}44,transparent)`, margin:`${my}px 0` }} />; }

function SectionHeading({ icon, children, action }) {
  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
        {icon && <span style={{ color:C.gold, fontSize:14, opacity:0.7 }}>{icon}</span>}
        <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic", fontWeight:400, fontSize:22, color:C.goldL }}>{children}</h2>
      </div>
      {action}
    </div>
  );
}

function StatusBadge({ status }) {
  const map = { Published:{bg:"rgba(201,168,76,0.15)",c:C.gold}, "In Review":{bg:"rgba(226,196,122,0.1)",c:"#c4a855"}, "In Progress":{bg:"rgba(255,255,255,0.06)",c:"rgba(255,255,255,0.5)"}, Complete:{bg:"rgba(201,168,76,0.15)",c:C.gold}, "Not Started":{bg:"rgba(255,255,255,0.04)",c:"rgba(255,255,255,0.35)"}, Final:{bg:"rgba(201,168,76,0.15)",c:C.gold}, Revision:{bg:"rgba(226,164,90,0.12)",c:"#c99a55"}, Draft:{bg:"rgba(140,160,200,0.1)",c:"#8aa0c8"}, Outline:{bg:"rgba(255,255,255,0.04)",c:"rgba(255,255,255,0.35)"}, "Pending Approval":{bg:"rgba(180,150,80,0.1)",c:"#c9a84c"}, Approved:{bg:"rgba(100,180,100,0.12)",c:"#78c878"}, "Revision Requested":{bg:"rgba(200,100,80,0.12)",c:"#c87858"} };
  const s = map[status]||{bg:"rgba(255,255,255,0.05)",c:C.dim};
  return <span style={{ display:"inline-block", background:s.bg, color:s.c, fontFamily:"'Lato',sans-serif", fontSize:9, fontWeight:700, letterSpacing:"0.13em", textTransform:"uppercase", padding:"3px 8px" }}>{status}</span>;
}

function TierChip({ tier }) {
  const c = TIER_COLORS[tier]||C.gold;
  return <span style={{ background:`${c}18`, color:c, border:`1px solid ${c}40`, fontFamily:"'Lato',sans-serif", fontSize:9, fontWeight:700, letterSpacing:"0.13em", textTransform:"uppercase", padding:"3px 8px" }}>{TIER_LABELS[tier]||tier}</span>;
}

function Stat({ label, value, sub }) {
  return (
    <div style={{ flex:1, minWidth:90 }}>
      <div style={{ fontFamily:"'Playfair Display',serif", fontSize:30, fontWeight:600, color:C.gold, lineHeight:1 }}>{value}</div>
      <div style={{ fontFamily:"'Lato',sans-serif", fontSize:10, fontWeight:700, letterSpacing:"0.14em", textTransform:"uppercase", color:C.muted, marginTop:5 }}>{label}</div>
      {sub && <div style={{ fontFamily:"'Lato',sans-serif", fontSize:11, color:C.dim, marginTop:3 }}>{sub}</div>}
    </div>
  );
}

function ProgressBar({ value, trajectory }) {
  const tc = trajectory==="needs-attention"?"#c97a4a":C.gold;
  return (
    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
      <div style={{ flex:1, height:3, background:"rgba(201,168,76,0.1)", borderRadius:2, overflow:"hidden" }}>
        <div style={{ height:"100%", width:`${value}%`, background:`linear-gradient(90deg,${tc}88,${tc})`, borderRadius:2, transition:"width 0.8s cubic-bezier(0.16,1,0.3,1)" }} />
      </div>
      <span style={{ fontFamily:"'Playfair Display',serif", fontSize:12, color:tc, minWidth:32, textAlign:"right" }}>{value}%</span>
    </div>
  );
}

function TrajectoryTag({ trajectory }) {
  const map = { "on-track":{label:"On Track",c:"#7ab47a"}, ahead:{label:"Ahead",c:C.gold}, "needs-attention":{label:"Needs Attention",c:"#c97a4a"} };
  const t = map[trajectory]||{label:trajectory,c:C.dim};
  return <span style={{ fontFamily:"'Lato',sans-serif", fontSize:9, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:t.c }}>● {t.label}</span>;
}

function Modal({ title, onClose, children, wide }) {
  return (
    <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal-box" style={{ maxWidth:wide?700:520 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:24 }}>
          <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic", fontSize:20, color:C.goldL, fontWeight:400 }}>{title}</h3>
          <button onClick={onClose} style={{ background:"none", border:"none", color:C.muted, cursor:"pointer", fontSize:18, lineHeight:1, padding:"0 0 0 12px" }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function FormRow({ label, children }) {
  return (
    <div style={{ marginBottom:18 }}>
      <div style={{ fontFamily:"'Lato',sans-serif", fontSize:10, fontWeight:700, letterSpacing:"0.14em", textTransform:"uppercase", color:C.muted, marginBottom:7 }}>{label}</div>
      {children}
    </div>
  );
}

function EmptyState({ message }) {
  return <div style={{ textAlign:"center", padding:"48px 24px", color:C.muted, fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic", fontSize:17, opacity:0.7 }}>{message}</div>;
}

function Label({ children }) {
  return <div style={{ fontFamily:"'Lato',sans-serif", fontSize:10, fontWeight:700, letterSpacing:"0.15em", textTransform:"uppercase", color:C.muted, marginBottom:10 }}>{children}</div>;
}

// ─────────────────────────────────────────────────────────────
// TAG INPUT (for brand voice)
// ─────────────────────────────────────────────────────────────
function TagInput({ tags, onChange, placeholder }) {
  const [input, setInput] = useState("");
  const add = () => { const v = input.trim(); if (v && !tags.includes(v)) { onChange([...tags, v]); setInput(""); } };
  return (
    <div>
      <div style={{ display:"flex", flexWrap:"wrap", gap:0, marginBottom:8 }}>
        {tags.map(t => (
          <span key={t} className="tag-chip">{t}<span className="remove" onClick={()=>onChange(tags.filter(x=>x!==t))}>×</span></span>
        ))}
      </div>
      <div style={{ display:"flex", gap:8 }}>
        <input className="ks-field" value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"){e.preventDefault();add();}}} placeholder={placeholder||"Type and press Enter"} style={{ flex:1 }} />
        <button className="btn-sm" onClick={add}>Add</button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// CALENDAR VIEW
// ─────────────────────────────────────────────────────────────
function CalendarView({ client, isAdmin, session, onUpdate }) {
  const [curDate, setCurDate] = useState(new Date(2024, 2, 1));
  const [dragOver, setDragOver] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showAddMeeting, setShowAddMeeting] = useState(false);
  const [addMeetingDate, setAddMeetingDate] = useState("");
  const [newMsg, setNewMsg] = useState("");

  const year = curDate.getFullYear();
  const month = curDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month+1, 0).getDate();
  const todayStr = today();

  const grid = useMemo(() => {
    const days = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) days.push(d);
    while (days.length % 7 !== 0) days.push(null);
    return days;
  }, [year, month, firstDay, daysInMonth]);

  const dateStr = (d) => `${year}-${String(month+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;

  const eventsForDay = (d) => {
    if (!d) return { content:[], meetings:[] };
    const ds = dateStr(d);
    return {
      content: client.contentCalendar.filter(i => i.scheduledDate === ds),
      meetings: (client.meetings||[]).filter(m => m.date === ds),
    };
  };

  const handleDragStart = (e, type, id) => {
    if (!isAdmin) return;
    _dragItem = { type, id };
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDrop = (d) => {
    if (!_dragItem || !d || !isAdmin) return;
    const ds = dateStr(d);
    if (_dragItem.type === "content") {
      onUpdate({ ...client, contentCalendar: client.contentCalendar.map(i => i.id===_dragItem.id ? {...i, scheduledDate:ds} : i) });
    } else if (_dragItem.type === "meeting") {
      onUpdate({ ...client, meetings: (client.meetings||[]).map(m => m.id===_dragItem.id ? {...m, date:ds} : m) });
    }
    _dragItem = null;
    setDragOver(null);
  };

  const sendMessage = () => {
    if (!newMsg.trim() || !selectedEvent) return;
    const msg = { id:uid(), from:session.username, text:newMsg.trim(), ts:new Date().toISOString() };
    if (selectedEvent.type === "meeting") {
      const updated = { ...client, meetings: (client.meetings||[]).map(m => m.id===selectedEvent.data.id ? {...m, messages:[...(m.messages||[]), msg]} : m) };
      onUpdate(updated);
      setSelectedEvent({ ...selectedEvent, data:updated.meetings.find(m=>m.id===selectedEvent.data.id) });
    }
    setNewMsg("");
  };

  const statusColor = (s) => { if(s==="Published") return C.gold; if(s==="In Review") return "#c4a855"; return "rgba(255,255,255,0.4)"; };

  return (
    <div className="ks-up">
      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:24 }}>
        <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic", fontWeight:400, fontSize:22, color:C.goldL }}>
          {MONTHS[month]} {year}
        </h2>
        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          {isAdmin && <button className="btn-ghost" style={{ fontSize:10 }} onClick={()=>{setAddMeetingDate(today());setShowAddMeeting(true);}}>+ Meeting</button>}
          <button className="btn-sm" onClick={()=>setCurDate(new Date(year, month-1, 1))}>‹</button>
          <button className="btn-sm" onClick={()=>setCurDate(new Date(year, month+1, 1))}>›</button>
        </div>
      </div>

      {/* Legend */}
      <div style={{ display:"flex", gap:16, marginBottom:16, flexWrap:"wrap" }}>
        {[["Content",C.gold],["Meeting","#7a9aaf"]].map(([l,c])=>(
          <div key={l} style={{ display:"flex", alignItems:"center", gap:5 }}>
            <div style={{ width:8, height:8, background:c, opacity:0.7 }} />
            <span style={{ fontFamily:"'Lato',sans-serif", fontSize:10, color:C.muted, letterSpacing:"0.1em", textTransform:"uppercase" }}>{l}</span>
          </div>
        ))}
        {isAdmin && <span style={{ fontFamily:"'Lato',sans-serif", fontSize:10, color:C.muted, letterSpacing:"0.08em", fontStyle:"italic" }}>Drag events to reschedule</span>}
      </div>

      {/* Weekday headers */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(7, 1fr)", gap:1, marginBottom:1 }}>
        {WEEKDAYS.map(d=>(
          <div key={d} style={{ fontFamily:"'Lato',sans-serif", fontSize:10, fontWeight:700, letterSpacing:"0.14em", textTransform:"uppercase", color:C.muted, textAlign:"center", padding:"6px 0" }}>{d}</div>
        ))}
      </div>

      {/* Grid */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(7, 1fr)", gap:1 }}>
        {grid.map((d, i) => {
          const { content, meetings } = eventsForDay(d);
          const ds = d ? dateStr(d) : null;
          const isToday = ds === todayStr;
          const isDragOver = dragOver === ds;
          return (
            <div key={i} className={`cal-cell${isToday?" today":""}${isDragOver?" drag-over":""}`}
              onDragOver={e=>{if(isAdmin&&d){e.preventDefault();setDragOver(ds);}}}
              onDragLeave={()=>setDragOver(null)}
              onDrop={()=>{handleDrop(d);setDragOver(null);}}>
              {d && (
                <>
                  <div style={{ fontFamily:"'Playfair Display',serif", fontSize:12, color:isToday?C.gold:C.muted, marginBottom:4, fontWeight:isToday?600:400 }}>{d}</div>
                  {content.map(item=>(
                    <div key={item.id} className="cal-event" draggable={isAdmin}
                      onDragStart={e=>handleDragStart(e,"content",item.id)}
                      onClick={()=>setSelectedEvent({type:"content",data:item})}
                      style={{ background:`${statusColor(item.status)}18`, color:statusColor(item.status), border:`1px solid ${statusColor(item.status)}30` }}>
                      {item.title}
                    </div>
                  ))}
                  {meetings.map(m=>(
                    <div key={m.id} className="cal-event" draggable={isAdmin}
                      onDragStart={e=>handleDragStart(e,"meeting",m.id)}
                      onClick={()=>setSelectedEvent({type:"meeting",data:m})}
                      style={{ background:"rgba(122,154,175,0.15)", color:"#9abacf", border:"1px solid rgba(122,154,175,0.25)" }}>
                      ◷ {m.title}
                    </div>
                  ))}
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Event detail modal */}
      {selectedEvent && (
        <Modal title={selectedEvent.type==="meeting" ? "◷ "+selectedEvent.data.title : selectedEvent.data.title} onClose={()=>setSelectedEvent(null)}>
          {selectedEvent.type === "content" ? (
            <div>
              <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:16 }}>
                <StatusBadge status={selectedEvent.data.status} />
                <StatusBadge status={selectedEvent.data.approvalStatus||"Pending Approval"} />
              </div>
              <div style={{ fontFamily:"'Lato',sans-serif", fontSize:12, color:C.muted, marginBottom:8 }}>{selectedEvent.data.type} · {fmtDate(selectedEvent.data.scheduledDate)}</div>
              {selectedEvent.data.link && <a href={selectedEvent.data.link} target="_blank" rel="noreferrer" style={{ color:C.gold, fontSize:12, fontFamily:"'Lato',sans-serif" }}>View published piece →</a>}
              {selectedEvent.data.revisionNotes && (
                <div style={{ marginTop:16, padding:"12px 16px", background:"rgba(200,100,80,0.08)", border:"1px solid rgba(200,100,80,0.2)" }}>
                  <Label>Revision Notes</Label>
                  <div style={{ fontFamily:"'Lato',sans-serif", fontSize:13, color:C.dim, fontStyle:"italic" }}>{selectedEvent.data.revisionNotes}</div>
                </div>
              )}
            </div>
          ) : (
            <div>
              <div style={{ fontFamily:"'Lato',sans-serif", fontSize:12, color:C.muted, marginBottom:4 }}>{fmtDate(selectedEvent.data.date)} · {selectedEvent.data.time}</div>
              {selectedEvent.data.description && <div style={{ fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic", fontSize:16, color:C.dim, margin:"12px 0", lineHeight:1.6 }}>{selectedEvent.data.description}</div>}
              <GoldRule my={16} />
              <Label>Messages</Label>
              <div style={{ maxHeight:200, overflowY:"auto", marginBottom:12 }}>
                {(!selectedEvent.data.messages||selectedEvent.data.messages.length===0) && (
                  <div style={{ fontFamily:"'Lato',sans-serif", fontSize:12, color:C.muted, fontStyle:"italic", textAlign:"center", padding:"16px 0" }}>No messages yet.</div>
                )}
                {(selectedEvent.data.messages||[]).map(msg=>{
                  const mine = msg.from === session.username;
                  return (
                    <div key={msg.id} className={`msg-bubble ${mine?"mine":"theirs"}`}>
                      <div style={{ fontFamily:"'Lato',sans-serif", fontSize:11, color:mine?C.gold:"rgba(255,255,255,0.5)", marginBottom:4, fontWeight:700, letterSpacing:"0.06em" }}>{mine?"You":msg.from==="mikaela"?"Mikaela":msg.from}</div>
                      <div style={{ fontFamily:"'Lato',sans-serif", fontSize:13, color:C.text, lineHeight:1.5 }}>{msg.text}</div>
                      <div style={{ fontFamily:"'Lato',sans-serif", fontSize:10, color:C.muted, marginTop:4 }}>{fmtTs(msg.ts)}</div>
                    </div>
                  );
                })}
              </div>
              <div style={{ display:"flex", gap:8 }}>
                <input className="ks-field" value={newMsg} onChange={e=>setNewMsg(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")sendMessage();}} placeholder="Send a message…" style={{ flex:1 }} />
                <button className="btn-gold" onClick={sendMessage} style={{ padding:"9px 16px" }}>Send</button>
              </div>
            </div>
          )}
        </Modal>
      )}

      {/* Add meeting modal (admin) */}
      {showAddMeeting && isAdmin && (
        <AddMeetingModal date={addMeetingDate} onClose={()=>setShowAddMeeting(false)}
          onSave={m=>{ onUpdate({ ...client, meetings:[...(client.meetings||[]),m] }); setShowAddMeeting(false); }} />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// CONTENT VIEW (with approvals)
// ─────────────────────────────────────────────────────────────
function ContentView({ client, isAdmin, onUpdate }) {
  const [filter, setFilter] = useState("All");
  const [revisionModal, setRevisionModal] = useState(null);
  const [revNote, setRevNote] = useState("");

  const filters = ["All",...CONTENT_STATUSES,"Pending Approval","Revision Requested"];
  const items = filter==="All" ? client.contentCalendar : client.contentCalendar.filter(i=>i.status===filter||i.approvalStatus===filter);

  const updateItem = (id, patch) => onUpdate({ ...client, contentCalendar:client.contentCalendar.map(i=>i.id===id?{...i,...patch}:i) });

  return (
    <div className="ks-up">
      <SectionHeading icon="◈">Content Output</SectionHeading>
      {/* Stats */}
      <div style={{ display:"flex", gap:12, marginBottom:24, flexWrap:"wrap" }}>
        {CONTENT_STATUSES.map(s=>(
          <div key={s} style={{ flex:1, minWidth:80, background:C.surface, border:`1px solid ${C.goldBorder}`, padding:"14px 18px", textAlign:"center" }}>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:26, color:C.gold }}>{client.contentCalendar.filter(i=>i.status===s).length}</div>
            <div style={{ fontFamily:"'Lato',sans-serif", fontSize:10, fontWeight:700, letterSpacing:"0.13em", textTransform:"uppercase", color:C.muted, marginTop:4 }}>{s}</div>
          </div>
        ))}
        <div style={{ flex:1, minWidth:80, background:C.surface, border:`1px solid rgba(201,168,76,0.1)`, padding:"14px 18px", textAlign:"center" }}>
          <div style={{ fontFamily:"'Playfair Display',serif", fontSize:26, color:"#c9a84c88" }}>{client.contentCalendar.filter(i=>i.approvalStatus==="Pending Approval").length}</div>
          <div style={{ fontFamily:"'Lato',sans-serif", fontSize:10, fontWeight:700, letterSpacing:"0.13em", textTransform:"uppercase", color:C.muted, marginTop:4 }}>Awaiting Approval</div>
        </div>
      </div>

      {/* Filter tabs */}
      <div style={{ display:"flex", gap:0, borderBottom:`1px solid ${C.goldBorder}`, marginBottom:20, overflowX:"auto" }}>
        {["All","In Progress","In Review","Published","Pending Approval","Revision Requested"].map(f=>(
          <button key={f} onClick={()=>setFilter(f)} style={{ background:"none", border:"none", borderBottom:filter===f?`2px solid ${C.gold}`:"2px solid transparent", color:filter===f?C.gold:C.muted, fontFamily:"'Lato',sans-serif", fontSize:10, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", padding:"10px 14px", cursor:"pointer", whiteSpace:"nowrap", marginBottom:-1, transition:"color 0.2s" }}>{f}</button>
        ))}
      </div>

      {items.length===0 ? <EmptyState message="No content in this category." /> : (
        <div>
          {items.map(item=>(
            <div key={item.id} style={{ padding:"16px 0", borderBottom:`1px solid rgba(255,255,255,0.04)` }}>
              <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:16, flexWrap:"wrap" }}>
                <div style={{ flex:1 }}>
                  <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:17, color:C.text, marginBottom:5, fontWeight:400 }}>{item.title}</div>
                  <div style={{ display:"flex", gap:8, flexWrap:"wrap", alignItems:"center" }}>
                    <span style={{ fontFamily:"'Lato',sans-serif", fontSize:11, color:C.muted }}>{item.type}</span>
                    <span style={{ color:C.muted }}>·</span>
                    <span style={{ fontFamily:"'Lato',sans-serif", fontSize:11, color:C.muted }}>{fmtDate(item.scheduledDate)}</span>
                    <StatusBadge status={item.status} />
                    <StatusBadge status={item.approvalStatus||"Pending Approval"} />
                  </div>
                  {item.revisionNotes && (
                    <div style={{ marginTop:8, fontFamily:"'Lato',sans-serif", fontSize:12, color:"#c87858", fontStyle:"italic" }}>
                      Revision request: "{item.revisionNotes}"
                    </div>
                  )}
                </div>
                <div style={{ display:"flex", gap:6, flexShrink:0, flexWrap:"wrap" }}>
                  {item.link && <a href={item.link} target="_blank" rel="noreferrer" className="btn-sm" style={{ textDecoration:"none" }}>View</a>}
                  {!isAdmin && item.approvalStatus!=="Approved" && (
                    <>
                      <button className="btn-approve" onClick={()=>updateItem(item.id,{approvalStatus:"Approved",revisionNotes:""})}>Approve</button>
                      <button className="btn-revise" onClick={()=>{setRevisionModal(item);setRevNote("");}}>Request Revision</button>
                    </>
                  )}
                  {isAdmin && <span style={{ fontFamily:"'Lato',sans-serif", fontSize:10, color:C.muted, paddingTop:5 }}>Client approval: {item.approvalStatus||"Pending"}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {revisionModal && (
        <Modal title="Request Revision" onClose={()=>setRevisionModal(null)}>
          <div style={{ fontFamily:"'Lato',sans-serif", fontSize:13, color:C.dim, marginBottom:16 }}>"{revisionModal.title}"</div>
          <FormRow label="What needs to change?">
            <textarea className="ks-field" rows={3} value={revNote} onChange={e=>setRevNote(e.target.value)} placeholder="Describe the changes you'd like…" />
          </FormRow>
          <div style={{ display:"flex", gap:10 }}>
            <button className="btn-gold" onClick={()=>{updateItem(revisionModal.id,{approvalStatus:"Revision Requested",revisionNotes:revNote});setRevisionModal(null);}}>Submit</button>
            <button className="btn-ghost" onClick={()=>setRevisionModal(null)}>Cancel</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// PERFORMANCE VIEW (with LinkedIn)
// ─────────────────────────────────────────────────────────────
function PerformanceView({ client }) {
  const r = client.performanceReport;
  const stats = [...(client.linkedInStats||[])].sort((a,b)=>new Date(a.date)-new Date(b.date));
  const latest = stats[stats.length-1];
  const prev = stats[stats.length-2];

  const delta = (key) => {
    if (!latest||!prev) return null;
    const d = latest[key] - prev[key];
    return d > 0 ? `+${d.toLocaleString()}` : d.toString();
  };

  return (
    <div className="ks-up">
      <SectionHeading icon="◈">Performance</SectionHeading>
      {r.period && (
        <>
          <div style={{ fontFamily:"'Lato',sans-serif", fontSize:10, fontWeight:700, letterSpacing:"0.16em", textTransform:"uppercase", color:C.muted, marginBottom:20 }}>{r.period} Report</div>
          <div style={{ display:"flex", gap:24, flexWrap:"wrap", marginBottom:28 }}>
            <Stat label="Engagement" value={r.engagement||"—"} />
            <Stat label="Total Reach" value={r.reach||"—"} />
            <Stat label="Placements" value={r.placements||"0"} />
          </div>
          {r.summary && <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:18, fontWeight:300, color:C.text, lineHeight:1.75, fontStyle:"italic", marginBottom:28 }}>" {r.summary} "</div>}
          <GoldRule />
        </>
      )}

      {/* LinkedIn stats */}
      <SectionHeading icon="◈">LinkedIn Analytics</SectionHeading>
      {!latest ? <EmptyState message="LinkedIn stats will appear here once updated." /> : (
        <>
          <div style={{ fontFamily:"'Lato',sans-serif", fontSize:10, color:C.muted, letterSpacing:"0.1em", marginBottom:20 }}>Last updated: {fmtDate(latest.date)}</div>
          <div style={{ display:"flex", gap:16, flexWrap:"wrap", marginBottom:28 }}>
            <Stat label="Followers" value={latest.followers?.toLocaleString()} sub={delta("followers") ? <span style={{ color:Number(delta("followers"))>0?"#78c878":"#c87858", fontSize:11 }}>{delta("followers")} vs last month</span> : null} />
            <Stat label="Impressions" value={latest.impressions?.toLocaleString()} sub={delta("impressions") ? <span style={{ color:Number(delta("impressions"))>0?"#78c878":"#c87858", fontSize:11 }}>{delta("impressions")}</span> : null} />
            <Stat label="Profile Views" value={latest.profileViews?.toLocaleString()} />
            <Stat label="Eng. Rate" value={`${latest.engagementRate}%`} />
          </div>
          {latest.topPost && (
            <div style={{ padding:"14px 18px", background:"rgba(201,168,76,0.05)", border:`1px solid ${C.goldBorder}`, marginBottom:20 }}>
              <div style={{ fontFamily:"'Lato',sans-serif", fontSize:10, fontWeight:700, letterSpacing:"0.14em", textTransform:"uppercase", color:C.muted, marginBottom:6 }}>Top Performing Post</div>
              <div style={{ fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic", fontSize:16, color:C.text }}>"{latest.topPost}"</div>
            </div>
          )}
          {/* Mini chart — follower trend */}
          {stats.length > 1 && (
            <>
              <Label>Follower Growth</Label>
              <div style={{ display:"flex", alignItems:"flex-end", gap:6, height:60, marginBottom:8 }}>
                {stats.map((s,i)=>{
                  const max = Math.max(...stats.map(x=>x.followers));
                  const h = Math.round((s.followers/max)*50)+10;
                  return (
                    <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
                      <div style={{ width:"100%", height:h, background:`linear-gradient(180deg,${C.goldL}55,${C.gold}88)`, borderRadius:"1px 1px 0 0", transition:"height 0.5s" }} />
                      <div style={{ fontFamily:"'Lato',sans-serif", fontSize:9, color:C.muted, textAlign:"center" }}>{new Date(s.date).toLocaleDateString("en-US",{month:"short"})}</div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// PUBLICATION LOG
// ─────────────────────────────────────────────────────────────
function PublicationLogView({ client }) {
  const sorted = [...client.publicationLog].sort((a,b)=>new Date(b.date)-new Date(a.date));
  return (
    <div className="ks-up">
      <SectionHeading icon="◈">Publication Log</SectionHeading>
      {sorted.length===0 ? <EmptyState message="Placed articles will be logged here." /> : (
        <table className="ks-table">
          <thead><tr><th>Outlet</th><th>Title</th><th>Date</th><th>Link</th></tr></thead>
          <tbody>
            {sorted.map(p=>(
              <tr key={p.id}>
                <td style={{ color:C.gold, fontWeight:700, fontSize:12, whiteSpace:"nowrap" }}>{p.outlet}</td>
                <td style={{ color:C.text }}>{p.title}</td>
                <td style={{ color:C.muted, fontSize:12, whiteSpace:"nowrap" }}>{fmtDate(p.date)}</td>
                <td>{p.link?<a href={p.link} target="_blank" rel="noreferrer" style={{ color:C.gold, fontSize:12 }}>View →</a>:"—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// DOCUMENTS VIEW
// ─────────────────────────────────────────────────────────────
function DocumentsView({ client, session, onUpdate }) {
  const [uploading, setUploading] = useState(false);
  const [showAddLink, setShowAddLink] = useState(false);
  const [linkForm, setLinkForm] = useState({ name:"", link:"", notes:"" });
  const docs = client.documents || [];

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 500000) { alert("File must be under 500KB. For larger files, use the 'Add Link' option to share a Google Drive or Dropbox link."); return; }
    setUploading(true);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const doc = { id:uid(), name:file.name, size:Math.round(file.size/1024)+"KB", type:file.type, uploadedBy:session.username, uploadedAt:new Date().toISOString(), notes:"", data:ev.target.result };
      onUpdate({ ...client, documents:[...docs, doc] });
      setUploading(false);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleAddLink = () => {
    if (!linkForm.name||!linkForm.link) return;
    const doc = { id:uid(), name:linkForm.name, size:"Link", type:"link", uploadedBy:session.username, uploadedAt:new Date().toISOString(), notes:linkForm.notes, link:linkForm.link };
    onUpdate({ ...client, documents:[...docs, doc] });
    setLinkForm({ name:"", link:"", notes:"" });
    setShowAddLink(false);
  };

  const deleteDoc = (id) => onUpdate({ ...client, documents:docs.filter(d=>d.id!==id) });

  const downloadDoc = (doc) => {
    if (doc.link) { window.open(doc.link,"_blank"); return; }
    const a = document.createElement("a");
    a.href = doc.data;
    a.download = doc.name;
    a.click();
  };

  const mikaelaDocs = docs.filter(d=>d.uploadedBy==="mikaela");
  const clientDocs = docs.filter(d=>d.uploadedBy!=="mikaela");

  return (
    <div className="ks-up">
      <SectionHeading icon="◈" action={
        <div style={{ display:"flex", gap:8 }}>
          <label className="btn-ghost" style={{ cursor:"pointer", fontSize:10 }}>
            {uploading?"Uploading…":"+ Upload File"}
            <input type="file" style={{ display:"none" }} onChange={handleFileUpload} disabled={uploading} />
          </label>
          <button className="btn-ghost" style={{ fontSize:10 }} onClick={()=>setShowAddLink(true)}>+ Add Link</button>
        </div>
      }>Document Hub</SectionHeading>

      <div style={{ fontFamily:"'Lato',sans-serif", fontSize:11, color:C.muted, marginBottom:20, fontStyle:"italic" }}>
        Files under 500KB · For larger files, use the "Add Link" option to share via Google Drive or Dropbox
      </div>

      {/* From Mikaela */}
      <Label>From Mikaela</Label>
      {mikaelaDocs.length===0 ? <div style={{ fontFamily:"'Lato',sans-serif", fontSize:13, color:C.muted, fontStyle:"italic", marginBottom:24, padding:"12px 0" }}>No documents shared yet.</div> : (
        <div style={{ marginBottom:28 }}>
          {mikaelaDocs.map(doc=><DocRow key={doc.id} doc={doc} onDownload={()=>downloadDoc(doc)} onDelete={session.role==="admin"?()=>deleteDoc(doc.id):null} />)}
        </div>
      )}

      <GoldRule />

      {/* From Client */}
      <Label>Your Uploads</Label>
      {clientDocs.length===0 ? <div style={{ fontFamily:"'Lato',sans-serif", fontSize:13, color:C.muted, fontStyle:"italic", padding:"12px 0" }}>No documents uploaded yet.</div> : (
        <div>
          {clientDocs.map(doc=><DocRow key={doc.id} doc={doc} onDownload={()=>downloadDoc(doc)} onDelete={()=>deleteDoc(doc.id)} />)}
        </div>
      )}

      {showAddLink && (
        <Modal title="Add Document Link" onClose={()=>setShowAddLink(false)}>
          <FormRow label="Document Name"><input className="ks-field" value={linkForm.name} onChange={e=>setLinkForm(f=>({...f,name:e.target.value}))} placeholder="e.g. Brand Brief Q1 2024" /></FormRow>
          <FormRow label="URL (Google Drive, Dropbox, etc.)"><input className="ks-field" value={linkForm.link} onChange={e=>setLinkForm(f=>({...f,link:e.target.value}))} placeholder="https://drive.google.com/…" /></FormRow>
          <FormRow label="Notes (optional)"><input className="ks-field" value={linkForm.notes} onChange={e=>setLinkForm(f=>({...f,notes:e.target.value}))} placeholder="Brief description…" /></FormRow>
          <div style={{ display:"flex", gap:10, marginTop:8 }}>
            <button className="btn-gold" onClick={handleAddLink} disabled={!linkForm.name||!linkForm.link}>Add Link</button>
            <button className="btn-ghost" onClick={()=>setShowAddLink(false)}>Cancel</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function DocRow({ doc, onDownload, onDelete }) {
  const icon = doc.type==="link"?"🔗":doc.type?.startsWith("image")?"🖼":doc.type==="application/pdf"?"📄":"📎";
  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"12px 0", borderBottom:`1px solid rgba(255,255,255,0.04)`, gap:16 }}>
      <div style={{ flex:1 }}>
        <div style={{ fontFamily:"'Lato',sans-serif", fontSize:13, color:C.text }}>{icon} {doc.name}</div>
        <div style={{ fontFamily:"'Lato',sans-serif", fontSize:11, color:C.muted, marginTop:3 }}>{doc.size} · {fmtDate(doc.uploadedAt?.split("T")[0])} · {doc.uploadedBy==="mikaela"?"Mikaela":doc.uploadedBy}</div>
        {doc.notes && <div style={{ fontFamily:"'Lato',sans-serif", fontSize:11, color:C.dim, fontStyle:"italic", marginTop:2 }}>{doc.notes}</div>}
      </div>
      <div style={{ display:"flex", gap:6 }}>
        <button className="btn-sm" onClick={onDownload}>{doc.type==="link"?"Open":"Download"}</button>
        {onDelete && <button className="btn-del" onClick={onDelete}>Del</button>}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// RESULTS TIMELINE
// ─────────────────────────────────────────────────────────────
function TimelineView({ client }) {
  const typeConfig = { publication:{ icon:"◉", color:C.gold, label:"Publication" }, milestone:{ icon:"◆", color:C.goldL, label:"Milestone" }, "goal-hit":{ icon:"▲", color:"#78c878", label:"Goal Hit" }, note:{ icon:"◇", color:C.dim, label:"Note" } };

  // Auto-build from existing data + manual entries
  const autoEvents = [
    ...client.publicationLog.map(p=>({ id:"pub_"+p.id, date:p.date, type:"publication", title:`${p.outlet}: ${p.title}`, description:"" })),
    ...(client.milestones||[]).filter(m=>m.status==="Complete"&&m.completionDate).map(m=>({ id:"ms_"+m.id, date:m.completionDate, type:"milestone", title:m.name, description:"Milestone achieved." })),
    ...(client.timelineEntries||[]),
  ].sort((a,b)=>new Date(b.date)-new Date(a.date));

  return (
    <div className="ks-up">
      <SectionHeading icon="◈">Results Timeline</SectionHeading>
      {autoEvents.length===0 ? <EmptyState message="Your results will appear here as milestones are hit and pieces are published." /> : (
        <div style={{ position:"relative", paddingLeft:36 }}>
          <div className="timeline-line" />
          {autoEvents.map((ev,i)=>{
            const cfg = typeConfig[ev.type]||typeConfig.note;
            return (
              <div key={ev.id} className="ks-up" style={{ position:"relative", marginBottom:28, animationDelay:`${i*0.05}s` }}>
                <div style={{ position:"absolute", left:-22, top:4, width:14, height:14, borderRadius:"50%", background:cfg.color, border:`2px solid ${C.bg}`, display:"flex", alignItems:"center", justifyContent:"center" }} />
                <div style={{ padding:"14px 18px", background:C.surface, border:`1px solid ${C.goldBorder}` }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:5 }}>
                    <span style={{ fontFamily:"'Lato',sans-serif", fontSize:9, fontWeight:700, letterSpacing:"0.14em", textTransform:"uppercase", color:cfg.color }}>{cfg.label}</span>
                    <span style={{ fontFamily:"'Lato',sans-serif", fontSize:11, color:C.muted }}>{fmtDate(ev.date)}</span>
                  </div>
                  <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:18, color:C.text, fontWeight:400 }}>{ev.title}</div>
                  {ev.description && <div style={{ fontFamily:"'Lato',sans-serif", fontSize:12, color:C.dim, marginTop:5, fontStyle:"italic" }}>{ev.description}</div>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// AI VISIBILITY TRACKER
// ─────────────────────────────────────────────────────────────
function AIVisibilityView({ client }) {
  const av = client.aiVisibility || { score:0, lastUpdated:"", queries:[], suggestions:[] };
  const appearing = av.queries.filter(q=>q.appears).length;
  const total = av.queries.length;

  return (
    <div className="ks-up">
      <SectionHeading icon="◈">AI Visibility Tracker</SectionHeading>
      <div style={{ marginBottom:6, fontFamily:"'Lato',sans-serif", fontSize:11, color:C.muted, fontStyle:"italic" }}>
        Tracks how often you appear when AI tools are asked questions in your industry. Updated monthly by Mikaela.
      </div>
      {av.lastUpdated && <div style={{ fontFamily:"'Lato',sans-serif", fontSize:10, color:C.muted, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:20 }}>Last updated: {fmtDate(av.lastUpdated)}</div>}

      {/* Score */}
      <div style={{ display:"flex", gap:24, flexWrap:"wrap", marginBottom:28 }}>
        <Stat label="Visibility Score" value={av.score||"—"} />
        <Stat label="Queries Tracked" value={total||"—"} />
        <Stat label="Appearing In" value={total>0?`${appearing}/${total}`:"—"} />
      </div>

      {av.score > 0 && (
        <>
          <div style={{ marginBottom:24 }}>
            <Label>Overall Visibility</Label>
            <ProgressBar value={av.score} trajectory={av.score>=60?"ahead":av.score>=30?"on-track":"needs-attention"} />
          </div>
          <GoldRule />
        </>
      )}

      {/* Queries */}
      {av.queries.length > 0 && (
        <>
          <Label>Tracked Queries</Label>
          <div style={{ marginBottom:28 }}>
            {av.queries.map(q=>(
              <div key={q.id} style={{ padding:"14px 0", borderBottom:`1px solid rgba(255,255,255,0.04)` }}>
                <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:16 }}>
                  <div style={{ flex:1 }}>
                    <div style={{ fontFamily:"'Lato',sans-serif", fontSize:13, color:C.text, marginBottom:5 }}>"{q.query}"</div>
                    <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:q.notes?6:0 }}>
                      {q.appears ? (
                        q.platforms.map(p=><span key={p} style={{ background:"rgba(201,168,76,0.1)", color:C.gold, border:`1px solid rgba(201,168,76,0.2)`, fontFamily:"'Lato',sans-serif", fontSize:10, fontWeight:700, letterSpacing:"0.1em", padding:"2px 8px" }}>{p}</span>)
                      ) : (
                        <span style={{ fontFamily:"'Lato',sans-serif", fontSize:11, color:"rgba(200,100,80,0.7)" }}>Not yet appearing</span>
                      )}
                    </div>
                    {q.notes && <div style={{ fontFamily:"'Lato',sans-serif", fontSize:11, color:C.muted, fontStyle:"italic" }}>{q.notes}</div>}
                  </div>
                  <div style={{ fontSize:18 }}>{q.appears?"✓":"○"}</div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Suggestions */}
      {av.suggestions.length > 0 && (
        <>
          <GoldRule />
          <Label>Recommendations to Improve Visibility</Label>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {av.suggestions.map((s,i)=>(
              <div key={i} style={{ display:"flex", gap:12, padding:"12px 14px", background:"rgba(201,168,76,0.04)", border:`1px solid ${C.goldBorder}` }}>
                <span style={{ color:C.gold, fontSize:14, flexShrink:0 }}>→</span>
                <span style={{ fontFamily:"'Lato',sans-serif", fontSize:13, color:C.dim, lineHeight:1.5 }}>{s}</span>
              </div>
            ))}
          </div>
        </>
      )}
      {av.queries.length===0 && <EmptyState message="AI visibility tracking will appear here once set up." />}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// BRAND VOICE
// ─────────────────────────────────────────────────────────────
function BrandVoiceView({ client, isAdmin, onUpdate }) {
  const bv = client.brandVoice || { toneWords:[], avoidWords:[], approvedTopics:[], guidelines:"", examplePosts:[] };
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ ...bv });
  const [newPost, setNewPost] = useState("");

  const save = () => { onUpdate({ ...client, brandVoice:form }); setEditing(false); };

  return (
    <div className="ks-up">
      <SectionHeading icon="◈" action={isAdmin&&<button className="btn-ghost" onClick={()=>{setForm({...bv});setEditing(!editing);}} style={{ fontSize:10 }}>{editing?"Cancel":"Edit"}</button>}>Brand Voice</SectionHeading>

      {editing && isAdmin ? (
        <div>
          <FormRow label="Tone Words (how the writing should feel)">
            <TagInput tags={form.toneWords} onChange={v=>setForm(f=>({...f,toneWords:v}))} placeholder="e.g. Authoritative, Warm…" />
          </FormRow>
          <FormRow label="Words / Phrases to Avoid">
            <TagInput tags={form.avoidWords} onChange={v=>setForm(f=>({...f,avoidWords:v}))} placeholder="e.g. Hustle, Crushing it…" />
          </FormRow>
          <FormRow label="Approved Topics">
            <TagInput tags={form.approvedTopics} onChange={v=>setForm(f=>({...f,approvedTopics:v}))} placeholder="e.g. Leadership, Strategy…" />
          </FormRow>
          <FormRow label="Voice Guidelines">
            <textarea className="ks-field" rows={4} value={form.guidelines} onChange={e=>setForm(f=>({...f,guidelines:e.target.value}))} placeholder="Describe the voice, tone, style…" />
          </FormRow>
          <FormRow label="Example Posts">
            <div style={{ marginBottom:8 }}>
              {form.examplePosts.map((p,i)=>(
                <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:8, marginBottom:6 }}>
                  <div style={{ flex:1, fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic", fontSize:14, color:C.dim, padding:"8px 12px", background:"rgba(255,255,255,0.03)", border:`1px solid rgba(255,255,255,0.06)` }}>"{p}"</div>
                  <button className="btn-del" onClick={()=>setForm(f=>({...f,examplePosts:f.examplePosts.filter((_,j)=>j!==i)}))}>Del</button>
                </div>
              ))}
            </div>
            <div style={{ display:"flex", gap:8 }}>
              <input className="ks-field" value={newPost} onChange={e=>setNewPost(e.target.value)} placeholder="Add an example post…" style={{ flex:1 }} />
              <button className="btn-sm" onClick={()=>{if(newPost.trim()){setForm(f=>({...f,examplePosts:[...f.examplePosts,newPost.trim()]}));setNewPost("");}  }}>Add</button>
            </div>
          </FormRow>
          <button className="btn-gold" onClick={save}>Save Voice Guide</button>
        </div>
      ) : (
        <div>
          {!bv.guidelines && bv.toneWords.length===0 ? <EmptyState message="Brand voice guide will appear here." /> : (
            <>
              {bv.guidelines && (
                <div style={{ fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic", fontSize:18, color:C.dim, lineHeight:1.75, marginBottom:24 }}>
                  " {bv.guidelines} "
                </div>
              )}
              {bv.toneWords.length>0 && (
                <div style={{ marginBottom:20 }}>
                  <Label>Tone</Label>
                  <div>{bv.toneWords.map(t=><span key={t} className="tag-chip" style={{ cursor:"default" }}>{t}</span>)}</div>
                </div>
              )}
              {bv.avoidWords.length>0 && (
                <div style={{ marginBottom:20 }}>
                  <Label>Avoid</Label>
                  <div>{bv.avoidWords.map(t=><span key={t} style={{ display:"inline-block", background:"rgba(200,100,80,0.08)", color:"rgba(200,120,100,0.8)", border:"1px solid rgba(200,100,80,0.2)", fontFamily:"'Lato',sans-serif", fontSize:11, padding:"3px 10px", margin:"3px" }}>{t}</span>)}</div>
                </div>
              )}
              {bv.approvedTopics.length>0 && (
                <div style={{ marginBottom:20 }}>
                  <Label>Approved Topics</Label>
                  <div>{bv.approvedTopics.map(t=><span key={t} className="tag-chip" style={{ cursor:"default" }}>{t}</span>)}</div>
                </div>
              )}
              {bv.examplePosts.length>0 && (
                <div>
                  <GoldRule />
                  <Label>Example Posts</Label>
                  {bv.examplePosts.map((p,i)=>(
                    <div key={i} style={{ fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic", fontSize:16, color:C.dim, padding:"12px 16px", background:"rgba(255,255,255,0.02)", border:`1px solid rgba(255,255,255,0.06)`, marginBottom:8, lineHeight:1.6 }}>"{p}"</div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// MILESTONES
// ─────────────────────────────────────────────────────────────
function MilestonesView({ client }) {
  const order = { Complete:0, "In Progress":1, "Not Started":2 };
  const sorted = [...client.milestones].sort((a,b)=>order[a.status]-order[b.status]);
  return (
    <div className="ks-up">
      <SectionHeading icon="◈">Milestone Tracker</SectionHeading>
      {sorted.length===0 ? <EmptyState message="Milestones will appear here." /> : (
        sorted.map(m=>(
          <div key={m.id} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px 0", borderBottom:`1px solid rgba(255,255,255,0.04)`, gap:16 }}>
            <div style={{ display:"flex", alignItems:"center", gap:14, flex:1 }}>
              <div style={{ width:8, height:8, borderRadius:"50%", background:m.status==="Complete"?C.gold:m.status==="In Progress"?"#c9a84c88":"rgba(255,255,255,0.15)", flexShrink:0 }} />
              <div>
                <div style={{ fontFamily:"'Lato',sans-serif", fontSize:13, color:m.status==="Complete"?C.text:C.dim }}>{m.name}</div>
                {m.completionDate && <div style={{ fontFamily:"'Lato',sans-serif", fontSize:11, color:C.muted, marginTop:2 }}>Completed {fmtDate(m.completionDate)}</div>}
              </div>
            </div>
            <StatusBadge status={m.status} />
          </div>
        ))
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// BRAND ROADMAP
// ─────────────────────────────────────────────────────────────
function BrandRoadmapView({ client }) {
  const periods = [{ key:"90day", label:"90-Day Goals" },{ key:"6month", label:"6-Month Goals" },{ key:"12month", label:"12-Month Goals" }];
  return (
    <div className="ks-up">
      <SectionHeading icon="◈">Brand Roadmap</SectionHeading>
      {client.goals.length===0 ? <EmptyState message="Your brand roadmap will appear here." /> : (
        <div style={{ display:"flex", flexDirection:"column", gap:32 }}>
          {periods.map(({ key, label })=>{
            const goals = client.goals.filter(g=>g.period===key);
            if (!goals.length) return null;
            return (
              <div key={key}>
                <div style={{ fontFamily:"'Lato',sans-serif", fontSize:10, fontWeight:700, letterSpacing:"0.18em", textTransform:"uppercase", color:C.muted, marginBottom:16, paddingBottom:8, borderBottom:`1px solid ${C.goldBorder}` }}>{label}</div>
                <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
                  {goals.map(g=>(
                    <div key={g.id}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                        <span style={{ fontFamily:"'Lato',sans-serif", fontSize:13, color:C.text }}>{g.name}</span>
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

// ─────────────────────────────────────────────────────────────
// MANUSCRIPT
// ─────────────────────────────────────────────────────────────
function ManuscriptView({ client }) {
  const total = client.chapters.length;
  const finalCount = client.chapters.filter(c=>c.status==="Final").length;
  const revCount = client.chapters.filter(c=>c.status==="Revision").length;
  const draftCount = client.chapters.filter(c=>c.status==="Draft").length;
  const pct = total>0?Math.round(((finalCount+revCount*0.7+draftCount*0.3)/total)*100):0;
  return (
    <div className="ks-up">
      <SectionHeading icon="◈">Manuscript Tracker</SectionHeading>
      {total>0&&(
        <>
          <div style={{ display:"flex", gap:24, marginBottom:28, flexWrap:"wrap" }}>
            <Stat label="Total Chapters" value={total} />
            <Stat label="Finalized" value={finalCount} />
            <Stat label="Complete" value={`${pct}%`} />
            {client.estimatedCompletion&&<Stat label="Est. Completion" value={client.estimatedCompletion} />}
          </div>
          <ProgressBar value={pct} trajectory="on-track" />
          <GoldRule my={28} />
        </>
      )}
      {client.manuscriptNotes&&(
        <><div style={{ fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic", fontSize:17, color:C.dim, lineHeight:1.7, marginBottom:24 }}>" {client.manuscriptNotes} "</div><GoldRule my={0} /></>
      )}
      <div style={{ marginTop:24 }}>
        {client.chapters.length===0 ? <EmptyState message="Chapter details will appear here." /> : (
          <table className="ks-table">
            <thead><tr><th>Chapter</th><th>Status</th><th>Due</th><th>Notes</th></tr></thead>
            <tbody>
              {client.chapters.map(ch=>(
                <tr key={ch.id}>
                  <td style={{ color:C.text, fontFamily:"'Cormorant Garamond',serif", fontSize:15 }}>{ch.title}</td>
                  <td><StatusBadge status={ch.status} /></td>
                  <td style={{ color:C.muted, fontSize:12, whiteSpace:"nowrap" }}>{fmtDate(ch.dueDate)}</td>
                  <td style={{ color:C.dim, fontSize:12, fontStyle:"italic", maxWidth:200 }}>{ch.notes||"—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// ADMIN MODALS
// ─────────────────────────────────────────────────────────────
function AddMeetingModal({ date, onSave, onClose }) {
  const [form, setForm] = useState({ title:"", date:date||today(), time:"10:00 AM", description:"", messages:[] });
  const set = (k,v) => setForm(f=>({...f,[k]:v}));
  return (
    <Modal title="Schedule Meeting" onClose={onClose}>
      <FormRow label="Meeting Title"><input className="ks-field" value={form.title} onChange={e=>set("title",e.target.value)} placeholder="e.g. Monthly Strategy Call" /></FormRow>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
        <FormRow label="Date"><input className="ks-field" type="date" value={form.date} onChange={e=>set("date",e.target.value)} /></FormRow>
        <FormRow label="Time"><input className="ks-field" value={form.time} onChange={e=>set("time",e.target.value)} placeholder="10:00 AM" /></FormRow>
      </div>
      <FormRow label="Description / Agenda"><textarea className="ks-field" rows={3} value={form.description} onChange={e=>set("description",e.target.value)} placeholder="What will you cover?" /></FormRow>
      <div style={{ display:"flex", gap:10, marginTop:8 }}>
        <button className="btn-gold" onClick={()=>onSave({...form,id:uid()})} disabled={!form.title}>Add Meeting</button>
        <button className="btn-ghost" onClick={onClose}>Cancel</button>
      </div>
    </Modal>
  );
}

function ContentEntryModal({ entry, onSave, onClose }) {
  const [form, setForm] = useState(entry||{ title:"", type:"LinkedIn Post", status:"In Progress", approvalStatus:"Pending Approval", revisionNotes:"", scheduledDate:"", link:"" });
  const set = (k,v) => setForm(f=>({...f,[k]:v}));
  return (
    <Modal title={entry?"Edit Content Entry":"Add Content Entry"} onClose={onClose}>
      <FormRow label="Title"><input className="ks-field" value={form.title} onChange={e=>set("title",e.target.value)} placeholder="Content title" /></FormRow>
      <FormRow label="Type"><select className="ks-field" value={form.type} onChange={e=>set("type",e.target.value)}>{CONTENT_TYPES.map(t=><option key={t}>{t}</option>)}</select></FormRow>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
        <FormRow label="Status"><select className="ks-field" value={form.status} onChange={e=>set("status",e.target.value)}>{CONTENT_STATUSES.map(s=><option key={s}>{s}</option>)}</select></FormRow>
        <FormRow label="Approval"><select className="ks-field" value={form.approvalStatus} onChange={e=>set("approvalStatus",e.target.value)}>{APPROVAL_STATUSES.map(s=><option key={s}>{s}</option>)}</select></FormRow>
      </div>
      <FormRow label="Scheduled Date"><input className="ks-field" type="date" value={form.scheduledDate} onChange={e=>set("scheduledDate",e.target.value)} /></FormRow>
      <FormRow label="Link (optional)"><input className="ks-field" value={form.link} onChange={e=>set("link",e.target.value)} placeholder="https://…" /></FormRow>
      <div style={{ display:"flex", gap:10, marginTop:8 }}>
        <button className="btn-gold" onClick={()=>onSave({...form,id:form.id||uid()})}>Save Entry</button>
        <button className="btn-ghost" onClick={onClose}>Cancel</button>
      </div>
    </Modal>
  );
}

function PublicationModal({ entry, onSave, onClose }) {
  const [form, setForm] = useState(entry||{ outlet:"", title:"", date:"", link:"" });
  const set = (k,v) => setForm(f=>({...f,[k]:v}));
  return (
    <Modal title={entry?"Edit Publication":"Add Publication"} onClose={onClose}>
      <FormRow label="Outlet"><input className="ks-field" value={form.outlet} onChange={e=>set("outlet",e.target.value)} placeholder="Forbes, Inc., HBR…" /></FormRow>
      <FormRow label="Article Title"><input className="ks-field" value={form.title} onChange={e=>set("title",e.target.value)} placeholder="Article title" /></FormRow>
      <FormRow label="Date"><input className="ks-field" type="date" value={form.date} onChange={e=>set("date",e.target.value)} /></FormRow>
      <FormRow label="Link"><input className="ks-field" value={form.link} onChange={e=>set("link",e.target.value)} placeholder="https://…" /></FormRow>
      <div style={{ display:"flex", gap:10, marginTop:8 }}>
        <button className="btn-gold" onClick={()=>onSave({...form,id:form.id||uid()})}>Save</button>
        <button className="btn-ghost" onClick={onClose}>Cancel</button>
      </div>
    </Modal>
  );
}

function MilestoneModal({ entry, onSave, onClose }) {
  const [form, setForm] = useState(entry||{ name:"", status:"Not Started", completionDate:"" });
  const set = (k,v) => setForm(f=>({...f,[k]:v}));
  return (
    <Modal title={entry?"Edit Milestone":"Add Milestone"} onClose={onClose}>
      <FormRow label="Milestone Name"><input className="ks-field" value={form.name} onChange={e=>set("name",e.target.value)} placeholder="e.g. First Forbes Placement" /></FormRow>
      <FormRow label="Status"><select className="ks-field" value={form.status} onChange={e=>set("status",e.target.value)}>{MILESTONE_STATUSES.map(s=><option key={s}>{s}</option>)}</select></FormRow>
      <FormRow label="Completion Date"><input className="ks-field" type="date" value={form.completionDate} onChange={e=>set("completionDate",e.target.value)} /></FormRow>
      <div style={{ display:"flex", gap:10, marginTop:8 }}>
        <button className="btn-gold" onClick={()=>onSave({...form,id:form.id||uid()})}>Save</button>
        <button className="btn-ghost" onClick={onClose}>Cancel</button>
      </div>
    </Modal>
  );
}

function GoalModal({ entry, onSave, onClose }) {
  const [form, setForm] = useState(entry||{ name:"", period:"90day", progress:0, trajectory:"on-track" });
  const set = (k,v) => setForm(f=>({...f,[k]:v}));
  return (
    <Modal title={entry?"Edit Goal":"Add Goal"} onClose={onClose}>
      <FormRow label="Goal"><input className="ks-field" value={form.name} onChange={e=>set("name",e.target.value)} placeholder="e.g. LinkedIn: 15K Followers" /></FormRow>
      <FormRow label="Timeframe"><select className="ks-field" value={form.period} onChange={e=>set("period",e.target.value)}><option value="90day">90-Day</option><option value="6month">6-Month</option><option value="12month">12-Month</option></select></FormRow>
      <FormRow label={`Progress: ${form.progress}%`}><input type="range" min={0} max={100} value={form.progress} onChange={e=>set("progress",Number(e.target.value))} style={{ width:"100%", accentColor:C.gold }} /></FormRow>
      <FormRow label="Trajectory"><select className="ks-field" value={form.trajectory} onChange={e=>set("trajectory",e.target.value)}>{GOAL_TRAJECTORIES.map(t=><option key={t} value={t}>{t}</option>)}</select></FormRow>
      <div style={{ display:"flex", gap:10, marginTop:8 }}>
        <button className="btn-gold" onClick={()=>onSave({...form,id:form.id||uid()})}>Save</button>
        <button className="btn-ghost" onClick={onClose}>Cancel</button>
      </div>
    </Modal>
  );
}

function ChapterModal({ entry, onSave, onClose }) {
  const [form, setForm] = useState(entry||{ title:"", status:"Outline", notes:"", dueDate:"" });
  const set = (k,v) => setForm(f=>({...f,[k]:v}));
  return (
    <Modal title={entry?"Edit Chapter":"Add Chapter"} onClose={onClose}>
      <FormRow label="Chapter Title"><input className="ks-field" value={form.title} onChange={e=>set("title",e.target.value)} placeholder="e.g. Chapter 1: The Beginning" /></FormRow>
      <FormRow label="Status"><select className="ks-field" value={form.status} onChange={e=>set("status",e.target.value)}>{CHAPTER_STATUSES.map(s=><option key={s}>{s}</option>)}</select></FormRow>
      <FormRow label="Due Date"><input className="ks-field" type="date" value={form.dueDate} onChange={e=>set("dueDate",e.target.value)} /></FormRow>
      <FormRow label="Notes for Client"><textarea className="ks-field" value={form.notes} onChange={e=>set("notes",e.target.value)} placeholder="Notes visible to client…" /></FormRow>
      <div style={{ display:"flex", gap:10, marginTop:8 }}>
        <button className="btn-gold" onClick={()=>onSave({...form,id:form.id||uid()})}>Save</button>
        <button className="btn-ghost" onClick={onClose}>Cancel</button>
      </div>
    </Modal>
  );
}

function LinkedInStatsModal({ onSave, onClose }) {
  const [form, setForm] = useState({ date:today(), followers:"", impressions:"", profileViews:"", engagementRate:"", topPost:"" });
  const set = (k,v) => setForm(f=>({...f,[k]:v}));
  return (
    <Modal title="Update LinkedIn Stats" onClose={onClose}>
      <div style={{ fontFamily:"'Lato',sans-serif", fontSize:11, color:C.muted, marginBottom:20, fontStyle:"italic" }}>Pull these numbers from LinkedIn Analytics → export or view directly</div>
      <FormRow label="Date of Stats"><input className="ks-field" type="date" value={form.date} onChange={e=>set("date",e.target.value)} /></FormRow>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
        <FormRow label="Followers"><input className="ks-field" value={form.followers} onChange={e=>set("followers",e.target.value)} placeholder="10,200" /></FormRow>
        <FormRow label="Impressions"><input className="ks-field" value={form.impressions} onChange={e=>set("impressions",e.target.value)} placeholder="89,000" /></FormRow>
        <FormRow label="Profile Views"><input className="ks-field" value={form.profileViews} onChange={e=>set("profileViews",e.target.value)} placeholder="4,200" /></FormRow>
        <FormRow label="Engagement Rate %"><input className="ks-field" value={form.engagementRate} onChange={e=>set("engagementRate",e.target.value)} placeholder="6.8" /></FormRow>
      </div>
      <FormRow label="Top Performing Post"><input className="ks-field" value={form.topPost} onChange={e=>set("topPost",e.target.value)} placeholder="Post title or first line…" /></FormRow>
      <div style={{ display:"flex", gap:10, marginTop:8 }}>
        <button className="btn-gold" onClick={()=>onSave({...form,id:uid(),followers:Number(form.followers)||0,impressions:Number(form.impressions)||0,profileViews:Number(form.profileViews)||0})}>Save Stats</button>
        <button className="btn-ghost" onClick={onClose}>Cancel</button>
      </div>
    </Modal>
  );
}

function TimelineEntryModal({ onSave, onClose }) {
  const [form, setForm] = useState({ date:today(), type:"note", title:"", description:"" });
  const set = (k,v) => setForm(f=>({...f,[k]:v}));
  return (
    <Modal title="Add Timeline Entry" onClose={onClose}>
      <FormRow label="Date"><input className="ks-field" type="date" value={form.date} onChange={e=>set("date",e.target.value)} /></FormRow>
      <FormRow label="Type"><select className="ks-field" value={form.type} onChange={e=>set("type",e.target.value)}><option value="publication">Publication</option><option value="milestone">Milestone</option><option value="goal-hit">Goal Hit</option><option value="note">Note</option></select></FormRow>
      <FormRow label="Title"><input className="ks-field" value={form.title} onChange={e=>set("title",e.target.value)} placeholder="What happened?" /></FormRow>
      <FormRow label="Details (optional)"><textarea className="ks-field" rows={2} value={form.description} onChange={e=>set("description",e.target.value)} /></FormRow>
      <div style={{ display:"flex", gap:10, marginTop:8 }}>
        <button className="btn-gold" onClick={()=>onSave({...form,id:uid()})}>Add to Timeline</button>
        <button className="btn-ghost" onClick={onClose}>Cancel</button>
      </div>
    </Modal>
  );
}

function AIQueryModal({ entry, onSave, onClose }) {
  const [form, setForm] = useState(entry||{ query:"", appears:false, platforms:[], notes:"" });
  const set = (k,v) => setForm(f=>({...f,[k]:v}));
  const togglePlatform = (p) => { const ps = form.platforms.includes(p)?form.platforms.filter(x=>x!==p):[...form.platforms,p]; set("platforms",ps); };
  return (
    <Modal title={entry?"Edit Query":"Add Tracked Query"} onClose={onClose}>
      <FormRow label="Query (what someone might ask AI)"><input className="ks-field" value={form.query} onChange={e=>set("query",e.target.value)} placeholder='e.g. "Top women in tech to follow"' /></FormRow>
      <FormRow label="Appearing in Results?">
        <div style={{ display:"flex", gap:10 }}>
          {[true,false].map(v=>(
            <button key={String(v)} onClick={()=>set("appears",v)} className={form.appears===v?"btn-gold":"btn-ghost"} style={{ padding:"8px 16px", fontSize:11 }}>{v?"Yes":"Not Yet"}</button>
          ))}
        </div>
      </FormRow>
      {form.appears && (
        <FormRow label="Which Platforms?">
          <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
            {AI_PLATFORMS.map(p=>(
              <button key={p} onClick={()=>togglePlatform(p)} style={{ background:form.platforms.includes(p)?"rgba(201,168,76,0.15)":"transparent", border:`1px solid ${form.platforms.includes(p)?C.gold:"rgba(201,168,76,0.2)"}`, color:form.platforms.includes(p)?C.gold:C.muted, fontFamily:"'Lato',sans-serif", fontSize:11, padding:"6px 12px", cursor:"pointer", transition:"all 0.15s" }}>{p}</button>
            ))}
          </div>
        </FormRow>
      )}
      <FormRow label="Notes"><input className="ks-field" value={form.notes} onChange={e=>set("notes",e.target.value)} placeholder="Context or next steps…" /></FormRow>
      <div style={{ display:"flex", gap:10, marginTop:8 }}>
        <button className="btn-gold" onClick={()=>onSave({...form,id:form.id||uid()})}>Save</button>
        <button className="btn-ghost" onClick={onClose}>Cancel</button>
      </div>
    </Modal>
  );
}

function AddClientModal({ users, onSave, onClose }) {
  const [form, setForm] = useState({ name:"", username:"", password:"portal123", tier:"foundation" });
  const set = (k,v) => setForm(f=>({...f,[k]:v}));
  const exists = users.some(u=>u.username===form.username.toLowerCase().trim());
  return (
    <Modal title="Add New Client" onClose={onClose}>
      <FormRow label="Full Name"><input className="ks-field" value={form.name} onChange={e=>set("name",e.target.value)} placeholder="Client Name" /></FormRow>
      <FormRow label="Username">
        <input className="ks-field" value={form.username} onChange={e=>set("username",e.target.value.toLowerCase().replace(/\s/g,"."))} placeholder="first.last" />
        {exists&&<div style={{ color:"#c97070", fontSize:11, marginTop:4, fontFamily:"'Lato',sans-serif" }}>Username already exists</div>}
      </FormRow>
      <FormRow label="Password"><input className="ks-field" value={form.password} onChange={e=>set("password",e.target.value)} /></FormRow>
      <FormRow label="Service Tier"><select className="ks-field" value={form.tier} onChange={e=>set("tier",e.target.value)}>{TIERS.map(t=><option key={t} value={t}>{TIER_LABELS[t]}</option>)}</select></FormRow>
      <div style={{ display:"flex", gap:10, marginTop:8 }}>
        <button className="btn-gold" disabled={!form.name||!form.username||exists} onClick={()=>onSave(form)}>Add Client</button>
        <button className="btn-ghost" onClick={onClose}>Cancel</button>
      </div>
    </Modal>
  );
}

// ─────────────────────────────────────────────────────────────
// ADMIN CLIENT EDITOR
// ─────────────────────────────────────────────────────────────
function AdminClientEditor({ client, users, onUpdate, onBack }) {
  const [tab, setTab] = useState("content");
  const [modal, setModal] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [saved, setSaved] = useState(false);

  const update = useCallback((patch) => {
    onUpdate({ ...client, ...patch });
    setSaved(true); setTimeout(()=>setSaved(false),1800);
  }, [client, onUpdate]);

  const tabs = [
    { key:"content", label:"Content" },
    { key:"calendar", label:"Calendar" },
    { key:"report", label:"Report" },
    { key:"linkedin", label:"LinkedIn" },
    { key:"publications", label:"Publications" },
    ...(hasAuthority(client.tier)?[{ key:"milestones", label:"Milestones" }]:[]),
    ...(hasInfluence(client.tier)?[{ key:"goals", label:"Goals" },{ key:"ai", label:"AI Visibility" }]:[]),
    ...(isManuscript(client.tier)?[{ key:"manuscript", label:"Manuscript" }]:[]),
    { key:"timeline", label:"Timeline" },
    { key:"voice", label:"Brand Voice" },
    { key:"settings", label:"Settings" },
  ];

  // ── Content Tab ──
  const ContentTab = () => (
    <div>
      <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:16 }}>
        <button className="btn-ghost" onClick={()=>{setEditItem(null);setModal("content");}}>+ Add Entry</button>
      </div>
      {client.contentCalendar.length===0 ? <EmptyState message="No content entries yet." /> : (
        <table className="ks-table">
          <thead><tr><th>Title</th><th>Status</th><th>Approval</th><th>Date</th><th></th></tr></thead>
          <tbody>
            {client.contentCalendar.map(item=>(
              <tr key={item.id}>
                <td style={{ color:C.text, maxWidth:200 }}>{item.title}</td>
                <td><StatusBadge status={item.status} /></td>
                <td><StatusBadge status={item.approvalStatus||"Pending Approval"} /></td>
                <td style={{ color:C.muted, fontSize:12 }}>{fmtDate(item.scheduledDate)}</td>
                <td>
                  <div style={{ display:"flex", gap:6 }}>
                    <button className="btn-sm" onClick={()=>{setEditItem(item);setModal("content");}}>Edit</button>
                    <button className="btn-del" onClick={()=>update({ contentCalendar:client.contentCalendar.filter(i=>i.id!==item.id) })}>Del</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {modal==="content"&&<ContentEntryModal entry={editItem} onClose={()=>{setModal(null);setEditItem(null);}} onSave={s=>{update({ contentCalendar:editItem?client.contentCalendar.map(i=>i.id===s.id?s:i):[...client.contentCalendar,s] });setModal(null);setEditItem(null);}} />}
    </div>
  );

  // ── Calendar Tab ──
  const CalendarAdminTab = () => (
    <div>
      <CalendarView client={client} isAdmin={true} session={{ username:"mikaela", role:"admin" }} onUpdate={onUpdate} />
    </div>
  );

  // ── Report Tab ──
  const ReportTab = () => {
    const [form, setForm] = useState({ ...client.performanceReport });
    const set = (k,v) => setForm(f=>({...f,[k]:v}));
    return (
      <div>
        <FormRow label="Period"><input className="ks-field" value={form.period} onChange={e=>set("period",e.target.value)} placeholder="February 2024" /></FormRow>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12 }}>
          <FormRow label="Engagement"><input className="ks-field" value={form.engagement} onChange={e=>set("engagement",e.target.value)} placeholder="14.2K" /></FormRow>
          <FormRow label="Reach"><input className="ks-field" value={form.reach} onChange={e=>set("reach",e.target.value)} placeholder="89K" /></FormRow>
          <FormRow label="Placements"><input className="ks-field" value={form.placements} onChange={e=>set("placements",e.target.value)} placeholder="3" /></FormRow>
        </div>
        <FormRow label="Summary"><textarea className="ks-field" rows={5} value={form.summary} onChange={e=>set("summary",e.target.value)} placeholder="Monthly narrative for the client…" /></FormRow>
        <button className="btn-gold" onClick={()=>update({ performanceReport:form })}>Save Report</button>
      </div>
    );
  };

  // ── LinkedIn Tab ──
  const LinkedInTab = () => {
    const stats = [...(client.linkedInStats||[])].sort((a,b)=>new Date(b.date)-new Date(a.date));
    return (
      <div>
        <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:16 }}>
          <button className="btn-ghost" onClick={()=>setModal("linkedin")}>+ Update Stats</button>
        </div>
        {stats.length===0 ? <EmptyState message="No LinkedIn stats yet." /> : (
          <table className="ks-table">
            <thead><tr><th>Date</th><th>Followers</th><th>Impressions</th><th>Views</th><th>Eng %</th><th></th></tr></thead>
            <tbody>
              {stats.map(s=>(
                <tr key={s.id}>
                  <td style={{ color:C.muted, fontSize:12 }}>{fmtDate(s.date)}</td>
                  <td style={{ color:C.text }}>{s.followers?.toLocaleString()}</td>
                  <td style={{ color:C.text }}>{s.impressions?.toLocaleString()}</td>
                  <td style={{ color:C.text }}>{s.profileViews?.toLocaleString()}</td>
                  <td style={{ color:C.text }}>{s.engagementRate}%</td>
                  <td><button className="btn-del" onClick={()=>update({ linkedInStats:(client.linkedInStats||[]).filter(x=>x.id!==s.id) })}>Del</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {modal==="linkedin"&&<LinkedInStatsModal onClose={()=>setModal(null)} onSave={s=>{update({ linkedInStats:[...(client.linkedInStats||[]),s] });setModal(null);}} />}
      </div>
    );
  };

  // ── Publications Tab ──
  const PubsTab = () => (
    <div>
      <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:16 }}>
        <button className="btn-ghost" onClick={()=>{setEditItem(null);setModal("pub");}}>+ Add Publication</button>
      </div>
      {client.publicationLog.length===0 ? <EmptyState message="No publications yet." /> : (
        <table className="ks-table">
          <thead><tr><th>Outlet</th><th>Title</th><th>Date</th><th></th></tr></thead>
          <tbody>
            {client.publicationLog.map(p=>(
              <tr key={p.id}>
                <td style={{ color:C.gold, fontWeight:700, fontSize:12 }}>{p.outlet}</td>
                <td style={{ color:C.text }}>{p.title}</td>
                <td style={{ color:C.muted, fontSize:12 }}>{fmtDate(p.date)}</td>
                <td>
                  <div style={{ display:"flex", gap:6 }}>
                    <button className="btn-sm" onClick={()=>{setEditItem(p);setModal("pub");}}>Edit</button>
                    <button className="btn-del" onClick={()=>update({ publicationLog:client.publicationLog.filter(i=>i.id!==p.id) })}>Del</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {modal==="pub"&&<PublicationModal entry={editItem} onClose={()=>{setModal(null);setEditItem(null);}} onSave={s=>{update({ publicationLog:editItem?client.publicationLog.map(i=>i.id===s.id?s:i):[...client.publicationLog,s] });setModal(null);setEditItem(null);}} />}
    </div>
  );

  // ── Milestones Tab ──
  const MilestonesTab = () => (
    <div>
      <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:16 }}>
        <button className="btn-ghost" onClick={()=>{setEditItem(null);setModal("milestone");}}>+ Add Milestone</button>
      </div>
      {client.milestones.length===0 ? <EmptyState message="No milestones yet." /> : (
        <table className="ks-table">
          <thead><tr><th>Milestone</th><th>Status</th><th>Completed</th><th></th></tr></thead>
          <tbody>
            {client.milestones.map(m=>(
              <tr key={m.id}>
                <td style={{ color:C.text }}>{m.name}</td>
                <td><StatusBadge status={m.status} /></td>
                <td style={{ color:C.muted, fontSize:12 }}>{fmtDate(m.completionDate)}</td>
                <td>
                  <div style={{ display:"flex", gap:6 }}>
                    <button className="btn-sm" onClick={()=>{setEditItem(m);setModal("milestone");}}>Edit</button>
                    <button className="btn-del" onClick={()=>update({ milestones:client.milestones.filter(i=>i.id!==m.id) })}>Del</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {modal==="milestone"&&<MilestoneModal entry={editItem} onClose={()=>{setModal(null);setEditItem(null);}} onSave={s=>{update({ milestones:editItem?client.milestones.map(i=>i.id===s.id?s:i):[...client.milestones,s] });setModal(null);setEditItem(null);}} />}
    </div>
  );

  // ── Goals Tab ──
  const GoalsTab = () => (
    <div>
      <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:16 }}>
        <button className="btn-ghost" onClick={()=>{setEditItem(null);setModal("goal");}}>+ Add Goal</button>
      </div>
      {client.goals.length===0 ? <EmptyState message="No goals yet." /> : (
        <table className="ks-table">
          <thead><tr><th>Goal</th><th>Period</th><th>Progress</th><th>Trajectory</th><th></th></tr></thead>
          <tbody>
            {client.goals.map(g=>(
              <tr key={g.id}>
                <td style={{ color:C.text }}>{g.name}</td>
                <td style={{ color:C.muted, fontSize:12 }}>{g.period}</td>
                <td><span style={{ fontFamily:"'Playfair Display',serif", color:C.gold, fontSize:14 }}>{g.progress}%</span></td>
                <td><TrajectoryTag trajectory={g.trajectory} /></td>
                <td>
                  <div style={{ display:"flex", gap:6 }}>
                    <button className="btn-sm" onClick={()=>{setEditItem(g);setModal("goal");}}>Edit</button>
                    <button className="btn-del" onClick={()=>update({ goals:client.goals.filter(i=>i.id!==g.id) })}>Del</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {modal==="goal"&&<GoalModal entry={editItem} onClose={()=>{setModal(null);setEditItem(null);}} onSave={s=>{update({ goals:editItem?client.goals.map(i=>i.id===s.id?s:i):[...client.goals,s] });setModal(null);setEditItem(null);}} />}
    </div>
  );

  // ── AI Visibility Tab ──
  const AITab = () => {
    const av = client.aiVisibility || { score:0, lastUpdated:"", queries:[], suggestions:[] };
    const [score, setScore] = useState(av.score||0);
    const [suggestions, setSuggestions] = useState((av.suggestions||[]).join("\n"));
    return (
      <div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:20 }}>
          <FormRow label={`Visibility Score: ${score}/100`}>
            <input type="range" min={0} max={100} value={score} onChange={e=>setScore(Number(e.target.value))} style={{ width:"100%", accentColor:C.gold }} />
          </FormRow>
          <FormRow label="Last Updated"><input className="ks-field" type="date" defaultValue={av.lastUpdated} onChange={e=>update({ aiVisibility:{...av,lastUpdated:e.target.value} })} /></FormRow>
        </div>
        <FormRow label="Suggestions (one per line)">
          <textarea className="ks-field" rows={4} value={suggestions} onChange={e=>setSuggestions(e.target.value)} placeholder="Enter recommendations…" />
        </FormRow>
        <button className="btn-gold" onClick={()=>update({ aiVisibility:{...av,score,suggestions:suggestions.split("\n").filter(s=>s.trim())} })} style={{ marginBottom:24 }}>Save Score & Suggestions</button>
        <GoldRule />
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", margin:"20px 0 16px" }}>
          <Label>Tracked Queries</Label>
          <button className="btn-ghost" onClick={()=>{setEditItem(null);setModal("query");}}>+ Add Query</button>
        </div>
        {av.queries.length===0 ? <EmptyState message="No queries tracked yet." /> : (
          <table className="ks-table">
            <thead><tr><th>Query</th><th>Appears</th><th>Platforms</th><th></th></tr></thead>
            <tbody>
              {av.queries.map(q=>(
                <tr key={q.id}>
                  <td style={{ color:C.text, maxWidth:220 }}>"{q.query}"</td>
                  <td style={{ color:q.appears?"#78c878":"#c87858", fontSize:12 }}>{q.appears?"Yes":"No"}</td>
                  <td style={{ color:C.muted, fontSize:12 }}>{q.platforms.join(", ")||"—"}</td>
                  <td>
                    <div style={{ display:"flex", gap:6 }}>
                      <button className="btn-sm" onClick={()=>{setEditItem(q);setModal("query");}}>Edit</button>
                      <button className="btn-del" onClick={()=>update({ aiVisibility:{...av,queries:av.queries.filter(x=>x.id!==q.id)} })}>Del</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {modal==="query"&&<AIQueryModal entry={editItem} onClose={()=>{setModal(null);setEditItem(null);}} onSave={s=>{update({ aiVisibility:{...av,queries:editItem?av.queries.map(q=>q.id===s.id?s:q):[...av.queries,s]} });setModal(null);setEditItem(null);}} />}
      </div>
    );
  };

  // ── Manuscript Tab ──
  const ManuscriptTab = () => {
    const [mNotes, setMNotes] = useState(client.manuscriptNotes||"");
    const [mEst, setMEst] = useState(client.estimatedCompletion||"");
    return (
      <div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:4 }}>
          <FormRow label="Estimated Completion"><input className="ks-field" value={mEst} onChange={e=>setMEst(e.target.value)} placeholder="e.g. May 2024" /></FormRow>
        </div>
        <FormRow label="Overall Notes"><textarea className="ks-field" rows={3} value={mNotes} onChange={e=>setMNotes(e.target.value)} /></FormRow>
        <button className="btn-gold" onClick={()=>update({ manuscriptNotes:mNotes, estimatedCompletion:mEst })} style={{ marginBottom:24 }}>Save Notes</button>
        <GoldRule />
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", margin:"20px 0 16px" }}>
          <Label>Chapters</Label>
          <button className="btn-ghost" onClick={()=>{setEditItem(null);setModal("chapter");}}>+ Add Chapter</button>
        </div>
        {client.chapters.length===0 ? <EmptyState message="No chapters yet." /> : (
          <table className="ks-table">
            <thead><tr><th>Chapter</th><th>Status</th><th>Due</th><th></th></tr></thead>
            <tbody>
              {client.chapters.map(ch=>(
                <tr key={ch.id}>
                  <td style={{ color:C.text, fontFamily:"'Cormorant Garamond',serif", fontSize:15 }}>{ch.title}</td>
                  <td><StatusBadge status={ch.status} /></td>
                  <td style={{ color:C.muted, fontSize:12 }}>{fmtDate(ch.dueDate)}</td>
                  <td>
                    <div style={{ display:"flex", gap:6 }}>
                      <button className="btn-sm" onClick={()=>{setEditItem(ch);setModal("chapter");}}>Edit</button>
                      <button className="btn-del" onClick={()=>update({ chapters:client.chapters.filter(i=>i.id!==ch.id) })}>Del</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {modal==="chapter"&&<ChapterModal entry={editItem} onClose={()=>{setModal(null);setEditItem(null);}} onSave={s=>{update({ chapters:editItem?client.chapters.map(i=>i.id===s.id?s:i):[...client.chapters,s] });setModal(null);setEditItem(null);}} />}
      </div>
    );
  };

  // ── Timeline Tab ──
  const TimelineAdminTab = () => (
    <div>
      <div style={{ fontFamily:"'Lato',sans-serif", fontSize:11, color:C.muted, marginBottom:16, fontStyle:"italic" }}>Publications and completed milestones appear automatically. Add manual entries below.</div>
      <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:16 }}>
        <button className="btn-ghost" onClick={()=>setModal("timeline")}>+ Add Entry</button>
      </div>
      {(client.timelineEntries||[]).length===0 ? <EmptyState message="No manual entries yet." /> : (
        <table className="ks-table">
          <thead><tr><th>Date</th><th>Type</th><th>Title</th><th></th></tr></thead>
          <tbody>
            {[...(client.timelineEntries||[])].sort((a,b)=>new Date(b.date)-new Date(a.date)).map(e=>(
              <tr key={e.id}>
                <td style={{ color:C.muted, fontSize:12 }}>{fmtDate(e.date)}</td>
                <td style={{ color:C.muted, fontSize:11, textTransform:"capitalize" }}>{e.type}</td>
                <td style={{ color:C.text }}>{e.title}</td>
                <td><button className="btn-del" onClick={()=>update({ timelineEntries:(client.timelineEntries||[]).filter(x=>x.id!==e.id) })}>Del</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {modal==="timeline"&&<TimelineEntryModal onClose={()=>setModal(null)} onSave={s=>{update({ timelineEntries:[...(client.timelineEntries||[]),s] });setModal(null);}} />}
    </div>
  );

  // ── Brand Voice Tab ──
  const VoiceTab = () => <BrandVoiceView client={client} isAdmin={true} onUpdate={onUpdate} />;

  // ── Settings Tab ──
  const SettingsTab = () => {
    const [form, setForm] = useState({ name:client.name, tier:client.tier });
    const set = (k,v) => setForm(f=>({...f,[k]:v}));
    return (
      <div>
        <FormRow label="Client Name"><input className="ks-field" value={form.name} onChange={e=>set("name",e.target.value)} /></FormRow>
        <FormRow label="Service Tier"><select className="ks-field" value={form.tier} onChange={e=>set("tier",e.target.value)}>{TIERS.map(t=><option key={t} value={t}>{TIER_LABELS[t]}</option>)}</select></FormRow>
        <button className="btn-gold" onClick={()=>update({ name:form.name, tier:form.tier })}>Save Settings</button>
      </div>
    );
  };

  const tabContent = { content:<ContentTab/>, calendar:<CalendarAdminTab/>, report:<ReportTab/>, linkedin:<LinkedInTab/>, publications:<PubsTab/>, milestones:<MilestonesTab/>, goals:<GoalsTab/>, ai:<AITab/>, manuscript:<ManuscriptTab/>, timeline:<TimelineAdminTab/>, voice:<VoiceTab/>, settings:<SettingsTab/> };

  return (
    <div className="ks-in">
      <button onClick={onBack} style={{ background:"none", border:"none", color:C.muted, cursor:"pointer", fontFamily:"'Lato',sans-serif", fontSize:11, letterSpacing:"0.1em", textTransform:"uppercase", display:"flex", alignItems:"center", gap:6, marginBottom:28, padding:0 }}>← All Clients</button>
      <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:6 }}>
        <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic", fontSize:32, fontWeight:400, color:C.white }}>{client.name}</h1>
        <TierChip tier={client.tier} />
        {saved&&<span style={{ fontFamily:"'Lato',sans-serif", fontSize:10, color:C.gold, letterSpacing:"0.1em" }}>✓ Saved</span>}
      </div>
      <div style={{ fontFamily:"'Lato',sans-serif", fontSize:11, color:C.muted, marginBottom:24 }}>Client since {fmtDate(client.joinDate)} · @{client.username}</div>
      <GoldRule my={0} />
      <div style={{ display:"flex", gap:0, borderBottom:`1px solid ${C.goldBorder}`, marginBottom:28, overflowX:"auto" }}>
        {tabs.map(t=>(
          <button key={t.key} onClick={()=>setTab(t.key)} style={{ background:"none", border:"none", borderBottom:tab===t.key?`2px solid ${C.gold}`:"2px solid transparent", color:tab===t.key?C.gold:C.muted, fontFamily:"'Lato',sans-serif", fontSize:10, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", padding:"12px 14px", cursor:"pointer", whiteSpace:"nowrap", transition:"color 0.2s", marginBottom:-1 }}>{t.label}</button>
        ))}
      </div>
      {tabContent[tab]}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// CLIENT DASHBOARD
// ─────────────────────────────────────────────────────────────
function ClientDashboard({ client, session, onLogout, onUpdate }) {
  const [activeView, setActiveView] = useState("calendar");
  const branding = isBranding(client.tier);
  const manuscript = isManuscript(client.tier);
  const authority = hasAuthority(client.tier);
  const influence = hasInfluence(client.tier);

  const navItems = [
    { key:"calendar", label:"Calendar" },
    ...(branding?[{ key:"content", label:"Content" },{ key:"performance", label:"Performance" },{ key:"publications", label:"Publications" }]:[]),
    ...(authority?[{ key:"milestones", label:"Milestones" }]:[]),
    ...(influence?[{ key:"roadmap", label:"Brand Roadmap" },{ key:"ai", label:"AI Visibility" }]:[]),
    ...(manuscript?[{ key:"manuscript", label:"Manuscript" }]:[]),
    { key:"timeline", label:"Timeline" },
    { key:"documents", label:"Documents" },
    { key:"voice", label:"Brand Voice" },
  ];

  const renderView = () => {
    const props = { client, session, isAdmin:false, onUpdate };
    switch(activeView) {
      case "calendar": return <CalendarView {...props} />;
      case "content": return <ContentView {...props} />;
      case "performance": return <PerformanceView client={client} />;
      case "publications": return <PublicationLogView client={client} />;
      case "milestones": return <MilestonesView client={client} />;
      case "roadmap": return <BrandRoadmapView client={client} />;
      case "ai": return <AIVisibilityView client={client} />;
      case "manuscript": return <ManuscriptView client={client} />;
      case "timeline": return <TimelineView client={client} />;
      case "documents": return <DocumentsView client={client} session={session} onUpdate={onUpdate} />;
      case "voice": return <BrandVoiceView client={client} isAdmin={false} onUpdate={onUpdate} />;
      default: return null;
    }
  };

  return (
    <div style={{ display:"flex", minHeight:"100vh", background:C.bg }}>
      <div style={{ width:220, background:C.surface, borderRight:`1px solid ${C.goldBorder}`, display:"flex", flexDirection:"column", flexShrink:0, position:"sticky", top:0, height:"100vh", overflow:"hidden" }}>
        <div style={{ padding:"28px 20px 20px" }}>
          <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:10, letterSpacing:"0.3em", textTransform:"uppercase", color:C.muted, marginBottom:6 }}>Client Portal</div>
          <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:22, fontWeight:300, color:C.white, letterSpacing:"0.08em" }}>Kepler<span style={{ color:C.gold }}> Script</span></div>
        </div>
        <GoldRule my={0} />
        <div style={{ padding:"16px 20px 14px" }}>
          <div style={{ fontFamily:"'Lato',sans-serif", fontSize:11, color:C.text, fontWeight:700, marginBottom:8 }}>{client.name}</div>
          <TierChip tier={client.tier} />
        </div>
        <GoldRule my={0} />
        <nav style={{ flex:1, paddingTop:8, overflow:"auto" }}>
          {navItems.map(item=>(
            <div key={item.key} className={`nav-item ${activeView===item.key?"active":""}`} onClick={()=>setActiveView(item.key)}>{item.label}</div>
          ))}
        </nav>
        <div style={{ padding:"16px 20px", borderTop:`1px solid ${C.goldBorder}` }}>
          <button className="btn-ghost" onClick={onLogout} style={{ width:"100%", fontSize:10 }}>Sign Out</button>
        </div>
      </div>
      <div style={{ flex:1, overflow:"auto" }}>
        <div style={{ padding:"48px 52px", maxWidth:860 }}>{renderView()}</div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// ADMIN DASHBOARD
// ─────────────────────────────────────────────────────────────
function AdminDashboard({ clients, users, onUpdateClient, onAddClient, onLogout }) {
  const [view, setView] = useState("list");
  const [selectedId, setSelectedId] = useState(null);
  const [showAddClient, setShowAddClient] = useState(false);
  const selected = clients.find(c=>c.id===selectedId);

  const handleAddClient = (form) => {
    const id = `c_${uid()}`;
    onAddClient(mkClient({ id, name:form.name, username:form.username, tier:form.tier, joinDate:today() }), { username:form.username, password:form.password, role:"client", clientId:id });
    setShowAddClient(false);
  };

  return (
    <div style={{ display:"flex", minHeight:"100vh", background:C.bg }}>
      <div style={{ width:220, background:C.surface, borderRight:`1px solid ${C.goldBorder}`, display:"flex", flexDirection:"column", flexShrink:0, position:"sticky", top:0, height:"100vh" }}>
        <div style={{ padding:"28px 20px 20px" }}>
          <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:10, letterSpacing:"0.3em", textTransform:"uppercase", color:C.muted, marginBottom:6 }}>Admin Portal</div>
          <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:22, fontWeight:300, color:C.white, letterSpacing:"0.08em" }}>Kepler<span style={{ color:C.gold }}> Script</span></div>
        </div>
        <GoldRule my={0} />
        <div style={{ padding:"16px 20px 14px" }}>
          <div style={{ fontFamily:"'Lato',sans-serif", fontSize:11, color:C.text, fontWeight:700, marginBottom:8 }}>Mikaela Ashcroft</div>
          <span style={{ background:"rgba(201,168,76,0.1)", color:C.gold, border:`1px solid rgba(201,168,76,0.3)`, fontFamily:"'Lato',sans-serif", fontSize:9, fontWeight:700, letterSpacing:"0.14em", textTransform:"uppercase", padding:"3px 8px" }}>Admin</span>
        </div>
        <GoldRule my={0} />
        <nav style={{ flex:1, paddingTop:8 }}>
          <div className={`nav-item ${view==="list"?"active":""}`} onClick={()=>{setView("list");setSelectedId(null);}}>All Clients</div>
          <div style={{ padding:"6px 20px", fontFamily:"'Lato',sans-serif", fontSize:10, color:C.muted, letterSpacing:"0.08em" }}>{clients.length} active engagement{clients.length!==1?"s":""}</div>
        </nav>
        <div style={{ padding:"16px 20px", borderTop:`1px solid ${C.goldBorder}` }}>
          <button className="btn-ghost" onClick={onLogout} style={{ width:"100%", fontSize:10 }}>Sign Out</button>
        </div>
      </div>

      <div style={{ flex:1, overflow:"auto" }}>
        <div style={{ padding:"48px 52px", maxWidth:960 }}>
          {view==="list" && (
            <div className="ks-up">
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:32 }}>
                <div>
                  <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic", fontWeight:400, fontSize:34, color:C.white }}>Client Roster</h1>
                  <div style={{ fontFamily:"'Lato',sans-serif", fontSize:12, color:C.muted, marginTop:5 }}>{clients.length} active engagement{clients.length!==1?"s":""}</div>
                </div>
                <button className="btn-gold" onClick={()=>setShowAddClient(true)}>+ New Client</button>
              </div>
              <GoldRule my={0} />
              {clients.map(c=>(
                <div key={c.id} onClick={()=>{setSelectedId(c.id);setView("edit");}}
                  style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"20px 0", borderBottom:`1px solid rgba(255,255,255,0.04)`, cursor:"pointer", transition:"background 0.15s", paddingLeft:4 }}
                  onMouseEnter={e=>e.currentTarget.style.paddingLeft="8px"}
                  onMouseLeave={e=>e.currentTarget.style.paddingLeft="4px"}>
                  <div>
                    <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:20, color:C.white, fontWeight:400 }}>{c.name}</div>
                    <div style={{ fontFamily:"'Lato',sans-serif", fontSize:11, color:C.muted, marginTop:3 }}>@{c.username} · Since {fmtDate(c.joinDate)}</div>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:16 }}>
                    <TierChip tier={c.tier} />
                    <span style={{ color:C.muted, fontSize:16 }}>›</span>
                  </div>
                </div>
              ))}
            </div>
          )}
          {view==="edit" && selected && (
            <AdminClientEditor client={selected} users={users} onUpdate={onUpdateClient} onBack={()=>{setView("list");setSelectedId(null);}} />
          )}
        </div>
      </div>
      {showAddClient&&<AddClientModal users={users} onClose={()=>setShowAddClient(false)} onSave={handleAddClient} />}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// LOGIN
// ─────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setTimeout(()=>{
      const ok = onLogin(username.trim().toLowerCase(), password);
      if (!ok) setError("Invalid credentials. Please try again.");
      setLoading(false);
    }, 600);
  };

  return (
    <div style={{ minHeight:"100vh", background:C.bg, display:"flex", alignItems:"center", justifyContent:"center", padding:20, position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", width:600, height:600, borderRadius:"50%", border:"1px solid rgba(201,168,76,0.05)", top:"50%", left:"50%", transform:"translate(-50%,-50%)" }} />
      <div style={{ position:"absolute", width:400, height:400, borderRadius:"50%", border:"1px solid rgba(201,168,76,0.07)", top:"50%", left:"50%", transform:"translate(-50%,-50%)" }} />
      <div className="ks-up" style={{ width:"100%", maxWidth:380, textAlign:"center" }}>
        <div style={{ marginBottom:48 }}>
          <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:11, letterSpacing:"0.35em", textTransform:"uppercase", color:C.muted, marginBottom:12 }}>Client Portal</div>
          <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:42, fontWeight:300, color:C.white, letterSpacing:"0.1em", lineHeight:1 }}>Kepler<span style={{ color:C.gold }}> Script</span></div>
          <div style={{ height:1, background:`linear-gradient(90deg,transparent,${C.gold}60,transparent)`, marginTop:20 }} />
        </div>
        <form onSubmit={handleSubmit} style={{ textAlign:"left" }}>
          <div style={{ marginBottom:28 }}>
            <label style={{ display:"block", fontFamily:"'Lato',sans-serif", fontSize:10, fontWeight:700, letterSpacing:"0.16em", textTransform:"uppercase", color:C.muted, marginBottom:8 }}>Username</label>
            <input className="ks-input" type="text" value={username} onChange={e=>setUsername(e.target.value)} placeholder="your.name" autoComplete="username" />
          </div>
          <div style={{ marginBottom:36 }}>
            <label style={{ display:"block", fontFamily:"'Lato',sans-serif", fontSize:10, fontWeight:700, letterSpacing:"0.16em", textTransform:"uppercase", color:C.muted, marginBottom:8 }}>Password</label>
            <input className="ks-input" type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" autoComplete="current-password" />
          </div>
          {error&&<div style={{ fontFamily:"'Lato',sans-serif", fontSize:12, color:"#c97070", marginBottom:20, textAlign:"center" }}>{error}</div>}
          <button className="btn-gold" type="submit" style={{ width:"100%", opacity:loading?0.7:1 }} disabled={loading}>{loading?"Verifying…":"Enter Portal"}</button>
        </form>
        <div style={{ marginTop:40, fontFamily:"'Lato',sans-serif", fontSize:10, color:C.muted, letterSpacing:"0.08em" }}>Private access only · Kepler Script</div>
      </div>
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
  const [session, setSession] = useState(null);

  useEffect(()=>{
    (async()=>{
      const u = await store.get("ks-users-v2", DEFAULT_USERS);
      const c = await store.get("ks-clients-v2", DEFAULT_CLIENTS);
      setUsers(u); setClients(c); setLoading(false);
    })();
  },[]);

  useEffect(()=>{ if(users.length>0) store.set("ks-users-v2", users); },[users]);
  useEffect(()=>{ if(clients.length>0) store.set("ks-clients-v2", clients); },[clients]);

  const handleLogin = useCallback((username, password)=>{
    const user = users.find(u=>u.username===username&&u.password===password);
    if (!user) return false;
    setSession({ role:user.role, clientId:user.clientId, username:user.username });
    return true;
  },[users]);

  const handleUpdateClient = useCallback((updated)=>{
    setClients(prev=>prev.map(c=>c.id===updated.id?updated:c));
  },[]);

  const handleAddClient = useCallback((newClient, newUser)=>{
    setClients(prev=>[...prev, newClient]);
    setUsers(prev=>[...prev, newUser]);
  },[]);

  if (loading) return (
    <div style={{ minHeight:"100vh", background:C.bg, display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic", fontSize:22, color:`${C.gold}60` }}>Kepler Script</div>
    </div>
  );

  if (!session) return <LoginScreen onLogin={handleLogin} />;

  if (session.role==="admin") return <AdminDashboard clients={clients} users={users} onUpdateClient={handleUpdateClient} onAddClient={handleAddClient} onLogout={()=>setSession(null)} />;

  const clientData = clients.find(c=>c.id===session.clientId);
  if (!clientData) return <LoginScreen onLogin={handleLogin} />;

  const handleClientUpdate = (updated) => { handleUpdateClient(updated); };

  return <ClientDashboard client={clientData} session={session} onLogout={()=>setSession(null)} onUpdate={handleClientUpdate} />;
}

