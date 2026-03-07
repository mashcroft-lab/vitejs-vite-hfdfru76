import { useState, useEffect, useCallback, useMemo, useRef } from "react";

// ─────────────────────────────────────────────────────────────
// FONTS & GLOBAL STYLES
// ─────────────────────────────────────────────────────────────
(function init() {
  if (document.getElementById("ks-v3")) return;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Lato:wght@300;400;700&family=Playfair+Display:wght@400;500;600;700&display=swap";
  document.head.appendChild(link);
  const s = document.createElement("style");
  s.id = "ks-v3";
  s.textContent = `
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html, body, #root { height: 100%; background: #180013; }
    ::-webkit-scrollbar { width: 4px; height: 4px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: rgba(201,168,76,0.3); border-radius: 2px; }
    @keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
    @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
    @keyframes spin { to { transform: rotate(360deg); } }
    .ks-up { animation: fadeUp 0.45s cubic-bezier(0.16,1,0.3,1) both; }
    .ks-in { animation: fadeIn 0.25s ease both; }

    .ks-input { background: transparent; border: none; border-bottom: 1px solid rgba(201,168,76,0.3); color: #fff; font-family:'Lato',sans-serif; font-size:14px; padding:10px 2px; width:100%; outline:none; letter-spacing:0.03em; transition:border-color 0.2s; }
    .ks-input:focus { border-bottom-color: #c9a84c; }
    .ks-input::placeholder { color: rgba(255,255,255,0.35); }

    .ks-field { background: rgba(255,255,255,0.05); border: 1px solid rgba(201,168,76,0.2); color: #fff; font-family:'Lato',sans-serif; font-size:13px; padding:9px 12px; width:100%; outline:none; transition:border-color 0.2s; border-radius:1px; }
    .ks-field:focus { border-color: rgba(201,168,76,0.5); }
    .ks-field::placeholder { color: rgba(255,255,255,0.3); }
    .ks-field option { background:#26011e; }
    textarea.ks-field { resize:vertical; min-height:80px; line-height:1.6; }
    select.ks-field { cursor:pointer; appearance:none; background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23c9a84c' stroke-width='1.5' fill='none'/%3E%3C/svg%3E"); background-repeat:no-repeat; background-position:right 10px center; padding-right:30px; }

    .btn-gold { background:linear-gradient(135deg,#c9a84c,#e2c47a); border:none; color:#180013; font-family:'Lato',sans-serif; font-size:11px; font-weight:700; letter-spacing:0.14em; text-transform:uppercase; padding:12px 28px; cursor:pointer; transition:opacity 0.2s, transform 0.15s; display:inline-block; }
    .btn-gold:hover { opacity:0.88; transform:translateY(-1px); }
    .btn-gold:disabled { opacity:0.35; cursor:not-allowed; transform:none; }

    .btn-ghost { background:transparent; border:1px solid rgba(201,168,76,0.3); color:rgba(201,168,76,0.8); font-family:'Lato',sans-serif; font-size:11px; letter-spacing:0.1em; text-transform:uppercase; padding:9px 18px; cursor:pointer; transition:all 0.2s; }
    .btn-ghost:hover { border-color:#c9a84c; color:#c9a84c; background:rgba(201,168,76,0.05); }

    .btn-sm { background:transparent; border:1px solid rgba(201,168,76,0.22); color:rgba(255,255,255,0.6); font-family:'Lato',sans-serif; font-size:10px; letter-spacing:0.09em; text-transform:uppercase; padding:5px 11px; cursor:pointer; transition:all 0.2s; white-space:nowrap; }
    .btn-sm:hover { border-color:rgba(201,168,76,0.55); color:#fff; }

    .btn-approve { background:rgba(100,180,100,0.1); border:1px solid rgba(100,180,100,0.35); color:rgba(140,210,140,0.95); font-family:'Lato',sans-serif; font-size:10px; letter-spacing:0.1em; text-transform:uppercase; padding:5px 11px; cursor:pointer; transition:all 0.2s; }
    .btn-approve:hover { background:rgba(100,180,100,0.2); }
    .btn-revise { background:rgba(200,120,80,0.1); border:1px solid rgba(200,120,80,0.35); color:rgba(230,150,110,0.95); font-family:'Lato',sans-serif; font-size:10px; letter-spacing:0.1em; text-transform:uppercase; padding:5px 11px; cursor:pointer; transition:all 0.2s; }
    .btn-revise:hover { background:rgba(200,120,80,0.2); }
    .btn-del { background:transparent; border:1px solid rgba(210,100,100,0.28); color:rgba(210,110,110,0.7); font-family:'Lato',sans-serif; font-size:10px; letter-spacing:0.08em; text-transform:uppercase; padding:5px 11px; cursor:pointer; transition:all 0.2s; }
    .btn-del:hover { border-color:rgba(210,100,100,0.6); color:rgba(220,130,130,0.95); }

    .nav-item { display:flex; align-items:center; gap:9px; padding:10px 20px 10px 18px; font-family:'Lato',sans-serif; font-size:11px; font-weight:400; letter-spacing:0.11em; text-transform:uppercase; color:rgba(255,255,255,0.5); cursor:pointer; transition:all 0.18s; border-left:2px solid transparent; user-select:none; }
    .nav-item:hover { color:rgba(255,255,255,0.85); background:rgba(201,168,76,0.05); }
    .nav-item.active { color:#c9a84c; border-left-color:#c9a84c; background:rgba(201,168,76,0.08); }
    .nav-section { padding:14px 20px 5px; font-family:'Lato',sans-serif; font-size:9px; font-weight:700; letter-spacing:0.2em; text-transform:uppercase; color:rgba(255,255,255,0.25); }

    .modal-overlay { position:fixed; inset:0; background:rgba(24,0,19,0.88); backdrop-filter:blur(8px); z-index:200; display:flex; align-items:center; justify-content:center; padding:16px; animation:fadeIn 0.2s ease; }
    .modal-box { background:#26011e; border:1px solid rgba(201,168,76,0.25); width:100%; max-width:520px; max-height:90vh; overflow-y:auto; padding:30px 34px; animation:fadeUp 0.28s cubic-bezier(0.16,1,0.3,1); }

    .ks-table { width:100%; border-collapse:collapse; }
    .ks-table th { font-family:'Lato',sans-serif; font-size:10px; font-weight:700; letter-spacing:0.15em; text-transform:uppercase; color:rgba(201,168,76,0.55); padding:8px 12px 8px 0; text-align:left; border-bottom:1px solid rgba(201,168,76,0.12); }
    .ks-table td { font-family:'Lato',sans-serif; font-size:13px; color:rgba(255,255,255,0.88); padding:12px 12px 12px 0; border-bottom:1px solid rgba(255,255,255,0.05); vertical-align:middle; }
    .ks-table tr:last-child td { border-bottom:none; }
    .ks-table tr:hover td { background:rgba(201,168,76,0.03); }

    /* Calendar */
    .cal-grid { display:grid; grid-template-columns:repeat(7,1fr); gap:1px; background:rgba(201,168,76,0.08); }
    .cal-cell { background:#180013; min-height:100px; padding:6px; vertical-align:top; transition:background 0.15s; position:relative; }
    .cal-cell.other-month { background:#130010; }
    .cal-cell.today { background:#1e0018; outline:1px solid rgba(201,168,76,0.35); outline-offset:-1px; }
    .cal-cell.drag-over { background:rgba(201,168,76,0.1) !important; }
    .cal-event { font-family:'Lato',sans-serif; font-size:10px; letter-spacing:0.03em; padding:3px 7px; margin-bottom:3px; cursor:pointer; border-radius:1px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; transition:opacity 0.15s; display:block; width:100%; text-align:left; border:none; }
    .cal-event:hover { opacity:0.78; }
    .cal-day-num { font-family:'Playfair Display',serif; font-size:12px; margin-bottom:5px; display:block; }

    /* Tags */
    .tag { display:inline-flex; align-items:center; gap:5px; background:rgba(201,168,76,0.1); border:1px solid rgba(201,168,76,0.22); color:rgba(255,255,255,0.85); font-family:'Lato',sans-serif; font-size:11px; padding:3px 10px; margin:2px; }
    .tag-avoid { background:rgba(200,90,80,0.08); border-color:rgba(200,90,80,0.25); color:rgba(230,150,140,0.9); }
    .tag-remove { cursor:pointer; color:rgba(255,255,255,0.4); font-size:14px; line-height:1; margin-left:2px; }
    .tag-remove:hover { color:rgba(255,255,255,0.9); }

    /* Timeline */
    .tl-dot { position:absolute; left:-23px; top:6px; width:14px; height:14px; border-radius:50%; border:2px solid #180013; }
    .tl-line { position:absolute; left:6px; top:0; bottom:0; width:1px; background:linear-gradient(180deg,transparent 0%,rgba(201,168,76,0.3) 15%,rgba(201,168,76,0.3) 85%,transparent 100%); }

    /* Messages */
    .msg { padding:10px 14px; margin-bottom:8px; max-width:82%; border-radius:1px; }
    .msg.mine { background:rgba(201,168,76,0.12); border:1px solid rgba(201,168,76,0.22); margin-left:auto; }
    .msg.theirs { background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.09); }

    /* AI loader */
    .ai-spin { width:18px; height:18px; border:2px solid rgba(201,168,76,0.2); border-top-color:#c9a84c; border-radius:50%; animation:spin 0.8s linear infinite; display:inline-block; vertical-align:middle; }

    /* Tone slider */
    input[type=range] { -webkit-appearance:none; appearance:none; height:3px; border-radius:2px; background:rgba(201,168,76,0.15); outline:none; width:100%; }
    input[type=range]::-webkit-slider-thumb { -webkit-appearance:none; width:14px; height:14px; border-radius:50%; background:#c9a84c; cursor:pointer; border:2px solid #180013; }
    input[type=range]::-moz-range-thumb { width:14px; height:14px; border-radius:50%; background:#c9a84c; cursor:pointer; border:2px solid #180013; }

    /* Explore board */
    .explore-card { background:rgba(255,255,255,0.04); border:1px solid rgba(201,168,76,0.15); padding:16px; margin-bottom:10px; transition:border-color 0.2s; }
    .explore-card:hover { border-color:rgba(201,168,76,0.3); }

    /* Upload zone */
    .upload-zone { border:1px dashed rgba(201,168,76,0.3); padding:28px; text-align:center; cursor:pointer; transition:all 0.2s; background:rgba(201,168,76,0.02); }
    .upload-zone:hover { border-color:rgba(201,168,76,0.6); background:rgba(201,168,76,0.06); }

    @media (max-width:768px) {
      .sidebar { position:fixed !important; left:0; top:0; height:100vh; transform:translateX(-100%); transition:transform 0.28s cubic-bezier(0.16,1,0.3,1); z-index:150; }
      .sidebar.mob-open { transform:translateX(0); }
      .mob-overlay { display:block !important; }
      .main-content { padding:20px 16px !important; }
      .mob-menu-btn { display:flex !important; }
    }
    .mob-menu-btn { display:none; align-items:center; justify-content:center; width:36px; height:36px; background:rgba(201,168,76,0.08); border:1px solid rgba(201,168,76,0.2); cursor:pointer; color:#c9a84c; font-size:16px; position:fixed; top:16px; left:16px; z-index:140; }
  `;
  document.head.appendChild(s);
})();

// ─────────────────────────────────────────────────────────────
// CONSTANTS & HELPERS
// ─────────────────────────────────────────────────────────────
const C = {
  bg:"#180013", surface:"#26011e", surface2:"#2c0020",
  gold:"#c9a84c", goldL:"#e2c47a", goldBorder:"rgba(201,168,76,0.22)",
  white:"#ffffff", text:"#ffffff", dim:"rgba(255,255,255,0.82)", muted:"rgba(255,255,255,0.58)",
};

const TIERS = ["foundation","authority","influence","ghostwriting","coaching","editing"];
const TIER_LABELS = { foundation:"Foundation",authority:"Authority",influence:"Influence",ghostwriting:"Full Ghostwriting",coaching:"Book Coaching",editing:"Book Editing" };
const TIER_COLORS = { foundation:"#8a7a4c",authority:"#c9a84c",influence:"#e2c47a",ghostwriting:"#7a8aaf",coaching:"#7a9a8a",editing:"#9a8a7a" };
const CONTENT_STATUSES = ["In Progress","In Review","Published"];
const APPROVAL_STATUSES = ["Pending Approval","Approved","Revision Requested"];
const MILESTONE_STATUSES = ["Not Started","In Progress","Complete"];
const GOAL_TRAJECTORIES = ["on-track","ahead","needs-attention"];
const CHAPTER_STATUSES = ["Outline","Draft","Revision","Final"];
const CONTENT_TYPES = ["LinkedIn Post","LinkedIn Article","Newsletter","Forbes Article","Inc. Article","HBR Article","Fast Company Article","Podcast Feature","Speaking Recap","Other"];
const AI_PLATFORMS = ["ChatGPT","Perplexity","Google AI","Claude","Gemini"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const WEEKDAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

const isBranding = t => ["foundation","authority","influence"].includes(t);
const isManuscript = t => ["ghostwriting","coaching","editing"].includes(t);
const hasAuthority = t => ["authority","influence"].includes(t);
const hasInfluence = t => t === "influence";

const uid = () => Math.random().toString(36).slice(2,9);
const todayStr = () => new Date().toISOString().split("T")[0];
const fmtDate = d => { if(!d) return "—"; try { const dt=new Date(d+"T12:00:00"); return dt.toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}); } catch{ return d; } };
const fmtTs = ts => { if(!ts) return ""; const d=new Date(ts); return d.toLocaleDateString("en-US",{month:"short",day:"numeric"})+" · "+d.toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit"}); };

let _drag = null; // drag state

// ─────────────────────────────────────────────────────────────
// STORAGE
// ─────────────────────────────────────────────────────────────
const store = {
  async get(key, fallback) {
    try {
      if (window.storage) { const r = await window.storage.get(key); return r ? JSON.parse(r.value) : fallback; }
      const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback;
    } catch { return fallback; }
  },
  async set(key, value) {
    try {
      if (window.storage) await window.storage.set(key, JSON.stringify(value));
      else localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  },
};

// ─────────────────────────────────────────────────────────────
// CLAUDE API (White Space Finder)
// ─────────────────────────────────────────────────────────────
async function callClaude(prompt, apiKey) {
  const headers = { "Content-Type":"application/json" };
  if (apiKey) headers["x-api-key"] = apiKey;
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method:"POST", headers,
    body: JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:1000, messages:[{ role:"user", content:prompt }] }),
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  const data = await res.json();
  return data.content?.[0]?.text || "";
}

// ─────────────────────────────────────────────────────────────
// DEFAULT DATA
// ─────────────────────────────────────────────────────────────
const mkClient = o => ({
  contentCalendar:[], publicationLog:[], meetings:[],
  performanceReport:{ period:"",engagement:"",reach:"",placements:"",summary:"" },
  milestones:[], chapters:[], estimatedCompletion:"", manuscriptNotes:"",
  strategyMap:{ phases:[
    { id:"p1", name:"Foundation", description:"Establish your voice, launch core content, build initial audience.", outcomes:["Consistent posting cadence","First 3 publications","Clear content pillars"], status:"active" },
    { id:"p2", name:"Authority", description:"Secure marquee placements, grow audience to authority-level.", outcomes:["5+ Tier-1 publications","Speaking inquiries","Newsletter growth"], status:"upcoming" },
    { id:"p3", name:"Influence", description:"Become the definitive voice in your space.", outcomes:["Book or course launch","Keynote bookings","Revenue attribution"], status:"future" },
  ], goals:[] },
  linkedInStats:[],
  aiVisibility:{ score:0, lastUpdated:"", queries:[], suggestions:[] },
  brandVoice:{ toneWords:[], avoidWords:[], approvedTopics:[], guidelines:"", examplePosts:[], toneProfile:{ formalCasual:50, boldMeasured:50, personalProfessional:50 }, exploreIdeas:[], whiteSpaceCache:null },
  documents:[], timelineEntries:[],
  directMessages:[],
  adminNotes:"",
  welcomeMessage:"",
  mediaPlaybook:{ sections:[] },
  ...o,
});

const DEFAULT_USERS = [
  { username:"mikaela", password:"kepler2024", role:"admin" },
  { username:"sarah.chen", password:"portal123", role:"client", clientId:"c1" },
  { username:"james.walker", password:"portal123", role:"client", clientId:"c2" },
  { username:"elena.russo", password:"portal123", role:"client", clientId:"c3" },
  { username:"david.park", password:"portal123", role:"client", clientId:"c4" },
];

const DEFAULT_CLIENTS = [
  mkClient({ id:"c1", name:"Sarah Chen", username:"sarah.chen", tier:"influence", joinDate:"2026-01-15",
    contentCalendar:[
      { id:"cc1",title:"The Art of Strategic Silence",type:"LinkedIn Article",status:"Published",approvalStatus:"Approved",revisionNotes:"",scheduledDate:"2026-03-01",link:"https://linkedin.com" },
      { id:"cc2",title:"Why Most Executives Fail at Thought Leadership",type:"Newsletter",status:"In Review",approvalStatus:"Pending Approval",revisionNotes:"",scheduledDate:"2026-03-10",link:"" },
      { id:"cc3",title:"The 5 Conversations That Built My Career",type:"LinkedIn Post",status:"In Progress",approvalStatus:"Pending Approval",revisionNotes:"",scheduledDate:"2026-03-18",link:"" },
      { id:"cc4",title:"Women Redefining Tech Leadership",type:"Forbes Article",status:"In Progress",approvalStatus:"Pending Approval",revisionNotes:"",scheduledDate:"2026-03-28",link:"" },
    ],
    publicationLog:[
      { id:"pl1",outlet:"Forbes",title:"The New Rules of Executive Presence",date:"2026-02-14",link:"https://forbes.com" },
      { id:"pl2",outlet:"Fast Company",title:"How to Build Influence Without Burning Out",date:"2026-01-28",link:"https://fastcompany.com" },
      { id:"pl3",outlet:"Harvard Business Review",title:"The Quiet Power of Listening Leaders",date:"2026-01-10",link:"https://hbr.org" },
    ],
    performanceReport:{ period:"February 2024",engagement:"14.2K",reach:"89K",placements:"3",summary:"February marked a breakthrough month. Your Forbes placement drove a 340% spike in LinkedIn profile views. Newsletter open rate climbed to 58%—well above industry average. Momentum is building exactly as planned." },
    milestones:[
      { id:"m1",name:"First Forbes Placement",status:"Complete",completionDate:"2026-02-14" },
      { id:"m2",name:"LinkedIn Followers: 10K",status:"Complete",completionDate:"2026-02-28" },
      { id:"m3",name:"Podcast Booked (Top 100)",status:"In Progress",completionDate:"" },
      { id:"m4",name:"Speaking Engagement Secured",status:"Not Started",completionDate:"" },
    ],
    meetings:[
      { id:"mt1",title:"Monthly Strategy Call",date:"2026-03-12",time:"10:00 AM",description:"Review February results and set March content priorities.",agenda:"Review Forbes performance data · Set Q2 content priorities · Discuss podcast strategy",messages:[{ id:"msg1",from:"sarah.chen",text:"Can we move this to 11am? I have a conflict.",ts:"2026-03-10T09:00:00Z" }] },
      { id:"mt2",title:"Forbes Draft Review",date:"2026-03-25",time:"2:00 PM",description:"Walk through the draft for the tech leadership piece.",agenda:"Read-through of draft · Revision priorities · Timeline to submission",messages:[] },
    ],
    linkedInStats:[
      { id:"ls1",date:"2026-01-01",followers:8200,impressions:42000,profileViews:1800,engagementRate:"4.2",topPost:"The Quiet Power of Listening Leaders" },
      { id:"ls2",date:"2026-02-01",followers:10100,impressions:89000,profileViews:4200,engagementRate:"6.8",topPost:"Why Most Executives Fail at Thought Leadership" },
    ],
    aiVisibility:{ score:42,lastUpdated:"2026-03-01",queries:[
      { id:"q1",query:"Top women in tech leadership to follow",appears:true,platforms:["ChatGPT","Perplexity"],notes:"Appearing consistently in ChatGPT responses." },
      { id:"q2",query:"Executive presence thought leaders",appears:false,platforms:[],notes:"Not yet appearing. Target by Q3." },
      { id:"q3",query:"Best LinkedIn voices for executives",appears:true,platforms:["Perplexity"],notes:"Mentioned in Perplexity when asked about executive LinkedIn." },
    ],suggestions:["Publish 2 more HBR pieces to increase citation likelihood","Get quoted in at least 3 major tech publications this quarter","Increase podcast appearances — AI models surface frequent speakers"] },
    strategyMap:{ goals:[
      { id:"g1",name:"3 Tier-1 Publications",period:"90day",progress:100,trajectory:"ahead" },
      { id:"g2",name:"LinkedIn: 15K Followers",period:"90day",progress:78,trajectory:"ahead" },
      { id:"g3",name:"Podcast Appearances: 5",period:"6month",progress:40,trajectory:"on-track" },
      { id:"g4",name:"Secure Speaking Fee: $10K+",period:"6month",progress:20,trajectory:"needs-attention" },
      { id:"g5",name:"Book Deal in Motion",period:"12month",progress:15,trajectory:"on-track" },
    ], phases:[
      { id:"p1",name:"Foundation",description:"Establish voice, launch core content, build initial audience.",outcomes:["Consistent posting cadence","First 3 publications","Clear content pillars"],status:"complete" },
      { id:"p2",name:"Authority",description:"Secure marquee placements, grow audience to authority-level.",outcomes:["5+ Tier-1 publications","Speaking inquiries","Newsletter growth"],status:"active" },
      { id:"p3",name:"Influence",description:"Become the definitive voice in your space.",outcomes:["Book or course launch","Keynote bookings","Revenue attribution"],status:"upcoming" },
    ]},
    brandVoice:{ toneWords:["Authoritative","Warm","Precise","Strategic","Human"],avoidWords:["Hustle","Crushing it","Thought leader","Game-changer"],approvedTopics:["Executive Leadership","Women in Tech","Strategic Communication","Organizational Culture"],guidelines:"Sarah's voice balances authority with accessibility. She speaks from experience, not theory. No jargon, no buzzwords. Every piece should leave the reader with something actionable.",examplePosts:["The best meetings I've ever run had fewer slides and more silence.","Leadership isn't about having all the answers. It's about asking better questions."],toneProfile:{ formalCasual:38,boldMeasured:65,personalProfessional:55 },exploreIdeas:[
      { id:"ei1",idea:"The psychology of executive decision fatigue",response:"This is strong — connects your leadership lens to neuroscience. Let's develop an HBR angle.",ts:"2026-03-01",hasResponse:true },
      { id:"ei2",idea:"What if we talked about the meetings I've actually walked out of?",response:"",ts:"2026-03-08",hasResponse:false },
    ],whiteSpaceCache:null },
    timelineEntries:[
      { id:"te1",date:"2026-01-10",type:"publication",title:"HBR Placement",description:"The Quiet Power of Listening Leaders published in Harvard Business Review." },
      { id:"te2",date:"2026-02-14",type:"milestone",title:"First Forbes Placement",description:"Milestone achieved." },
      { id:"te3",date:"2026-02-28",type:"milestone",title:"LinkedIn: 10K Followers",description:"LinkedIn audience milestone hit." },
    ],
    welcomeMessage:"Sarah — you're in an exceptional position right now. The Forbes placement has opened doors we're going to move through deliberately and strategically. Everything we do this quarter is building toward a level of authority that speaks for itself. I'm glad to be in your corner.",
    adminNotes:"Very responsive, prefers direct feedback. Forbes piece got 3x expected traffic. Mention podcast angle on next call — she's been hinting at it. Birthday in April.",
    directMessages:[
      { id:"dm1",from:"mikaela",text:"Sarah — just wanted to flag that the Forbes piece is already outperforming our projections. You should be really proud. I'll have the full numbers ready for our call on the 12th.",ts:"2026-03-02T10:30:00Z" },
      { id:"dm2",from:"sarah.chen",text:"That's incredible! I've had three people reach out already. Can't wait to discuss.",ts:"2026-03-02T11:15:00Z" },
    ],
    mediaPlaybook:{ sections:[
      { id:"mp1",title:"If a journalist or producer contacts you",content:"Forward the inquiry to me before responding to anything. I'll assess the outlet, the angle, and whether it aligns with where we're taking your brand. A quick response of 'Let me check my schedule and get back to you shortly' buys us 24 hours without closing the door." },
      { id:"mp2",title:"How to handle comments on your content",content:"For positive engagement: a brief, genuine reply goes a long way. For criticism or trolling: do not engage. Screenshot and send to me if it feels targeted. Your silence is never weakness — it's strategy.\n\nFor questions you don't know how to answer: 'Great question — I'll be sharing more on this soon' is always appropriate." },
      { id:"mp3",title:"What to say if someone asks who writes your content",content:"The honest and professional answer: 'I work with a strategic writing partner who helps me articulate my thinking.' You've lived every idea in every piece. The collaboration is real. You are never misrepresenting yourself." },
      { id:"mp4",title:"TV, broadcast media, and major publishing negotiations",content:"Major media appearances and publisher negotiations are handled through Kepler Script's partner network — specialists who operate at that level every day.\n\nIf any of these opportunities arise, come to me first. I will connect you with the right people and make sure you walk in fully prepared. You will never be navigating that alone." },
    ]},
  }),
  mkClient({ id:"c2", name:"James Walker", username:"james.walker", tier:"authority", joinDate:"2026-02-01",
    contentCalendar:[
      { id:"cc1",title:"The Founder's Guide to Delegation",type:"LinkedIn Article",status:"Published",approvalStatus:"Approved",revisionNotes:"",scheduledDate:"2026-03-05",link:"https://linkedin.com" },
      { id:"cc2",title:"Building Culture in a Remote-First World",type:"Newsletter",status:"In Progress",approvalStatus:"Pending Approval",revisionNotes:"",scheduledDate:"2026-03-14",link:"" },
    ],
    publicationLog:[{ id:"pl1",outlet:"Inc.",title:"The Overlooked Skill Every Founder Needs",date:"2026-02-20",link:"https://inc.com" }],
    performanceReport:{ period:"February 2024",engagement:"6.8K",reach:"42K",placements:"1",summary:"Solid first full month. The Inc. piece performed above expectations and has driven meaningful inbound to your LinkedIn." },
    milestones:[
      { id:"m1",name:"First Major Publication Placement",status:"Complete",completionDate:"2026-02-20" },
      { id:"m2",name:"LinkedIn Followers: 5K",status:"In Progress",completionDate:"" },
      { id:"m3",name:"Newsletter: 1K Subscribers",status:"Not Started",completionDate:"" },
    ],
    meetings:[{ id:"mt1",title:"Strategy Session",date:"2026-03-08",time:"9:00 AM",description:"Set 90-day content priorities.",agenda:"Review Inc. results · 90-day content calendar · Newsletter launch timeline",messages:[] }],
    linkedInStats:[{ id:"ls1",date:"2026-02-01",followers:3200,impressions:18000,profileViews:720,engagementRate:"3.1",topPost:"The Founder's Guide to Delegation" }],
    brandVoice:{ toneWords:["Direct","Pragmatic","Honest","Energetic"],avoidWords:["Disruptive","Pivot","Synergy"],approvedTopics:["Founder Leadership","Remote Work","Company Culture"],guidelines:"James speaks plainly and from the trenches. No theory — only what he's actually done.",examplePosts:[],toneProfile:{ formalCasual:30,boldMeasured:72,personalProfessional:45 },exploreIdeas:[],whiteSpaceCache:null },
    welcomeMessage:"James — the Inc. piece was a strong start and exactly the kind of credibility signal we build everything else on. We're just getting started.",
    adminNotes:"Founder energy, moves fast. Prefers bullet-point feedback. Skeptical of 'brand' language — frame everything around outcomes and revenue. Follow up on newsletter idea.",
    directMessages:[],
    mediaPlaybook:{ sections:[
      { id:"mp1",title:"If a journalist contacts you",content:"Send me the email before replying. I'll advise on whether to engage and how to position the conversation. Never agree to an interview without looping me in first." },
      { id:"mp2",title:"Publishing, TV, and major media",content:"Large-scale media and publisher conversations go through Kepler Script's partner network. Come to me first — I'll make sure the right people are involved and that you're fully prepared before any significant conversation." },
    ]},
  }),
  mkClient({ id:"c3", name:"Elena Russo", username:"elena.russo", tier:"foundation", joinDate:"2026-02-15",
    contentCalendar:[{ id:"cc1",title:"Five Lessons from 20 Years in Hospitality",type:"LinkedIn Article",status:"In Review",approvalStatus:"Pending Approval",revisionNotes:"",scheduledDate:"2026-03-10",link:"" }],
    performanceReport:{ period:"February 2024",engagement:"—",reach:"—",placements:"0",summary:"First month focused on establishing your voice. Two strong pieces are in development." },
    brandVoice:{ toneWords:["Warm","Expert","Inviting","Grounded"],avoidWords:[],approvedTopics:["Hospitality","Guest Experience","Leadership"],guidelines:"Elena's voice reflects decades of experience — warm but authoritative.",examplePosts:[],toneProfile:{ formalCasual:55,boldMeasured:45,personalProfessional:60 },exploreIdeas:[],whiteSpaceCache:null },
  }),
  mkClient({ id:"c4", name:"David Park", username:"david.park", tier:"ghostwriting", joinDate:"2026-01-08",
    chapters:[
      { id:"ch1",title:"Prologue: The Problem with Perfect",status:"Final",notes:"Beautifully written. This is the hook.",dueDate:"2026-01-20" },
      { id:"ch2",title:"Chapter 1: Unlearning Success",status:"Final",notes:"Strong argument.",dueDate:"2026-01-28" },
      { id:"ch3",title:"Chapter 2: The Architecture of Failure",status:"Revision",notes:"Section 3 needs tightening.",dueDate:"2026-02-10" },
      { id:"ch4",title:"Chapter 3: When Systems Break People",status:"Draft",notes:"First draft strong. Awaiting your notes.",dueDate:"2026-03-05" },
      { id:"ch5",title:"Chapter 4: The Recovery Blueprint",status:"Outline",notes:"Outline approved.",dueDate:"2026-03-22" },
    ],
    estimatedCompletion:"May 2024",
    manuscriptNotes:"Overall trajectory is excellent. Your voice is compelling and distinctive.",
    meetings:[{ id:"mt1",title:"Chapter 3 Review Call",date:"2026-03-15",time:"11:00 AM",description:"Walk through Chapter 3 draft together.",messages:[] }],
    brandVoice:{ toneWords:[],avoidWords:[],approvedTopics:[],guidelines:"",examplePosts:[],toneProfile:{ formalCasual:50,boldMeasured:50,personalProfessional:50 },exploreIdeas:[],whiteSpaceCache:null },
  }),
];

// ─────────────────────────────────────────────────────────────
// SHARED UI COMPONENTS
// ─────────────────────────────────────────────────────────────
function GoldRule({ my=20 }) { return <div style={{ height:1,background:`linear-gradient(90deg,transparent,${C.gold}44,transparent)`,margin:`${my}px 0` }} />; }

function SectionHeading({ children, action, sub }) {
  return (
    <div style={{ display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:22 }}>
      <div>
        <h2 style={{ fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic",fontWeight:400,fontSize:24,color:C.goldL,letterSpacing:"0.01em" }}>{children}</h2>
        {sub && <div style={{ fontFamily:"'Lato',sans-serif",fontSize:12,color:C.muted,marginTop:4 }}>{sub}</div>}
      </div>
      {action && <div style={{ flexShrink:0,marginTop:4 }}>{action}</div>}
    </div>
  );
}

function StatusBadge({ status }) {
  const map = { Published:{bg:"rgba(201,168,76,0.15)",c:C.gold},"In Review":{bg:"rgba(226,196,122,0.1)",c:"#d4b860"},"In Progress":{bg:"rgba(255,255,255,0.07)",c:"rgba(255,255,255,0.65)"},Complete:{bg:"rgba(100,180,100,0.12)",c:"#82d082"},"Not Started":{bg:"rgba(255,255,255,0.05)",c:"rgba(255,255,255,0.45)"},Final:{bg:"rgba(201,168,76,0.15)",c:C.gold},Revision:{bg:"rgba(226,164,90,0.12)",c:"#c99a55"},Draft:{bg:"rgba(140,160,200,0.1)",c:"#8aa0c8"},Outline:{bg:"rgba(255,255,255,0.05)",c:"rgba(255,255,255,0.5)"},"Pending Approval":{bg:"rgba(180,150,80,0.1)",c:"#c9a84c"},Approved:{bg:"rgba(100,180,100,0.12)",c:"#82d082"},"Revision Requested":{bg:"rgba(200,100,80,0.12)",c:"#d88860"} };
  const s = map[status]||{bg:"rgba(255,255,255,0.06)",c:C.dim};
  return <span style={{ display:"inline-block",background:s.bg,color:s.c,fontFamily:"'Lato',sans-serif",fontSize:9,fontWeight:700,letterSpacing:"0.13em",textTransform:"uppercase",padding:"3px 8px" }}>{status}</span>;
}

function TierChip({ tier }) {
  const c = TIER_COLORS[tier]||C.gold;
  return <span style={{ background:`${c}18`,color:c,border:`1px solid ${c}40`,fontFamily:"'Lato',sans-serif",fontSize:9,fontWeight:700,letterSpacing:"0.13em",textTransform:"uppercase",padding:"3px 8px" }}>{TIER_LABELS[tier]||tier}</span>;
}

function Stat({ label, value, sub }) {
  return (
    <div style={{ flex:1,minWidth:90 }}>
      <div style={{ fontFamily:"'Playfair Display',serif",fontSize:30,fontWeight:600,color:C.gold,lineHeight:1 }}>{value}</div>
      <div style={{ fontFamily:"'Lato',sans-serif",fontSize:10,fontWeight:700,letterSpacing:"0.14em",textTransform:"uppercase",color:C.muted,marginTop:5 }}>{label}</div>
      {sub && <div style={{ marginTop:3 }}>{sub}</div>}
    </div>
  );
}

function ProgressBar({ value, trajectory }) {
  const tc = trajectory==="needs-attention"?"#c97a4a":trajectory==="ahead"?"#e2c47a":C.gold;
  return (
    <div style={{ display:"flex",alignItems:"center",gap:10 }}>
      <div style={{ flex:1,height:3,background:"rgba(201,168,76,0.1)",borderRadius:2,overflow:"hidden" }}>
        <div style={{ height:"100%",width:`${Math.min(100,value)}%`,background:`linear-gradient(90deg,${tc}88,${tc})`,borderRadius:2,transition:"width 0.8s cubic-bezier(0.16,1,0.3,1)" }} />
      </div>
      <span style={{ fontFamily:"'Playfair Display',serif",fontSize:12,color:tc,minWidth:32,textAlign:"right" }}>{value}%</span>
    </div>
  );
}

function TrajectoryTag({ trajectory }) {
  const map = { "on-track":{label:"On Track",c:"#7ab47a"},ahead:{label:"Ahead",c:C.goldL},"needs-attention":{label:"Needs Attention",c:"#c97a4a"} };
  const t = map[trajectory]||{label:trajectory,c:C.dim};
  return <span style={{ fontFamily:"'Lato',sans-serif",fontSize:9,fontWeight:700,letterSpacing:"0.11em",textTransform:"uppercase",color:t.c }}>● {t.label}</span>;
}

function Modal({ title, onClose, children, wide }) {
  return (
    <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal-box" style={{ maxWidth:wide?720:520 }}>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:26 }}>
          <h3 style={{ fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic",fontSize:21,color:C.goldL,fontWeight:400 }}>{title}</h3>
          <button onClick={onClose} style={{ background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:18,lineHeight:1,padding:"0 0 0 14px" }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function FormRow({ label, children, hint }) {
  return (
    <div style={{ marginBottom:18 }}>
      <div style={{ fontFamily:"'Lato',sans-serif",fontSize:10,fontWeight:700,letterSpacing:"0.14em",textTransform:"uppercase",color:C.muted,marginBottom:7 }}>{label}</div>
      {hint && <div style={{ fontFamily:"'Lato',sans-serif",fontSize:11,color:"rgba(255,255,255,0.4)",marginBottom:6,fontStyle:"italic" }}>{hint}</div>}
      {children}
    </div>
  );
}

function EmptyState({ message, icon }) {
  return (
    <div style={{ textAlign:"center",padding:"52px 24px" }}>
      {icon && <div style={{ fontSize:28,marginBottom:12,opacity:0.3 }}>{icon}</div>}
      <div style={{ fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic",fontSize:17,color:C.muted,opacity:0.8 }}>{message}</div>
    </div>
  );
}

function Label({ children, small }) {
  return <div style={{ fontFamily:"'Lato',sans-serif",fontSize:small?9:10,fontWeight:700,letterSpacing:"0.15em",textTransform:"uppercase",color:C.muted,marginBottom:10 }}>{children}</div>;
}

function TagInput({ tags, onChange, placeholder, avoid }) {
  const [val, setVal] = useState("");
  const add = () => { const v=val.trim(); if(v&&!tags.includes(v)){onChange([...tags,v]);setVal("");} };
  return (
    <div>
      <div style={{ display:"flex",flexWrap:"wrap",gap:0,marginBottom:tags.length?8:0 }}>
        {tags.map(t=>(
          <span key={t} className={`tag ${avoid?"tag-avoid":""}`}>{t}<span className="tag-remove" onClick={()=>onChange(tags.filter(x=>x!==t))}>×</span></span>
        ))}
      </div>
      <div style={{ display:"flex",gap:8 }}>
        <input className="ks-field" value={val} onChange={e=>setVal(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"){e.preventDefault();add();}}} placeholder={placeholder||"Type and press Enter"} style={{ flex:1 }} />
        <button className="btn-sm" onClick={add}>Add</button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// SIDEBAR COMPONENT (shared admin + client)
// ─────────────────────────────────────────────────────────────
function Sidebar({ logo, name, badge, navSections, onLogout, savedIndicator, mobileOpen, onMobileClose }) {
  return (
    <>
      {mobileOpen&&<div onClick={onMobileClose} style={{ position:"fixed",inset:0,background:"rgba(24,0,19,0.7)",zIndex:149 }} className="mob-overlay"/>}
      <div className={`sidebar${mobileOpen?" mob-open":""}`} style={{ width:230,background:C.surface,borderRight:`1px solid ${C.goldBorder}`,display:"flex",flexDirection:"column",flexShrink:0,position:"sticky",top:0,height:"100vh",overflow:"hidden",zIndex:150 }}>
        <div style={{ padding:"28px 20px 20px" }}>
          <div style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:10,letterSpacing:"0.3em",textTransform:"uppercase",color:C.muted,marginBottom:7 }}>{logo}</div>
          <div style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontWeight:300,color:C.white,letterSpacing:"0.08em" }}>Kepler<span style={{ color:C.gold }}> Script</span></div>
        </div>
        <GoldRule my={0} />
        <div style={{ padding:"14px 20px 14px" }}>
          <div style={{ fontFamily:"'Lato',sans-serif",fontSize:12,color:C.white,fontWeight:700,marginBottom:7 }}>{name}</div>
          {badge}
        </div>
        <GoldRule my={0} />
        <nav style={{ flex:1,paddingTop:6,overflowY:"auto" }}>
          {navSections.map((section,si)=>(
            <div key={si}>
              {section.label && <div className="nav-section">{section.label}</div>}
              {section.items.map(item=>(
                <div key={item.key} className={`nav-item ${item.active?"active":""}`} onClick={()=>{ item.onClick(); onMobileClose&&onMobileClose(); }}>
                  {item.icon && <span style={{ fontSize:12,opacity:0.7 }}>{item.icon}</span>}
                  {item.label}
                  {item.badge && <span style={{ marginLeft:"auto",background:"rgba(201,168,76,0.18)",color:C.gold,fontSize:9,fontWeight:700,padding:"1px 6px",borderRadius:8 }}>{item.badge}</span>}
                </div>
              ))}
            </div>
          ))}
        </nav>
        <div style={{ padding:"14px 20px",borderTop:`1px solid ${C.goldBorder}` }}>
          {savedIndicator && <div style={{ fontFamily:"'Lato',sans-serif",fontSize:10,color:C.gold,letterSpacing:"0.1em",textAlign:"center",marginBottom:10 }}>✓ Saved</div>}
          <button className="btn-ghost" onClick={onLogout} style={{ width:"100%",fontSize:10 }}>Sign Out</button>
        </div>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// CALENDAR VIEW
// ─────────────────────────────────────────────────────────────
function CalendarView({ client, isAdmin, session, onUpdate }) {
  const [curDate, setCurDate] = useState(() => { const d=new Date(); return new Date(d.getFullYear(),d.getMonth(),1); });
  const [dragOver, setDragOver] = useState(null);
  const [selected, setSelected] = useState(null);
  const [showAddMeeting, setShowAddMeeting] = useState(false);
  const [newMsg, setNewMsg] = useState("");

  const year = curDate.getFullYear();
  const month = curDate.getMonth();
  const firstDay = new Date(year,month,1).getDay();
  const daysInMonth = new Date(year,month+1,0).getDate();
  const today = todayStr();

  const cells = useMemo(()=>{
    const arr=[];
    for(let i=0;i<firstDay;i++) arr.push(null);
    for(let d=1;d<=daysInMonth;d++) arr.push(d);
    while(arr.length%7!==0) arr.push(null);
    return arr;
  },[year,month,firstDay,daysInMonth]);

  const ds = d => d ? `${year}-${String(month+1).padStart(2,"0")}-${String(d).padStart(2,"0")}` : null;

  const evForDay = d => ({
    content: client.contentCalendar.filter(i=>i.scheduledDate===ds(d)),
    meetings: (client.meetings||[]).filter(m=>m.date===ds(d)),
    milestones: isAdmin ? (client.milestones||[]).filter(m=>m.completionDate===ds(d)) : [],
  });

  const statusColor = s => s==="Published"?C.gold:s==="In Review"?"#d4b860":"rgba(255,255,255,0.5)";

  const handleDrop = d => {
    if(!_drag||!d||!isAdmin) return;
    const dateStr = ds(d);
    if(_drag.type==="content") onUpdate({...client,contentCalendar:client.contentCalendar.map(i=>i.id===_drag.id?{...i,scheduledDate:dateStr}:i)});
    else if(_drag.type==="milestone") onUpdate({...client,milestones:(client.milestones||[]).map(m=>m.id===_drag.id?{...m,completionDate:dateStr}:m)});
    else onUpdate({...client,meetings:(client.meetings||[]).map(m=>m.id===_drag.id?{...m,date:dateStr}:m)});
    _drag=null; setDragOver(null);
  };

  const sendMsg = () => {
    if(!newMsg.trim()||!selected||selected.type!=="meeting") return;
    const msg={id:uid(),from:session.username,text:newMsg.trim(),ts:new Date().toISOString()};
    const updated={...client,meetings:(client.meetings||[]).map(m=>m.id===selected.data.id?{...m,messages:[...(m.messages||[]),msg]}:m)};
    onUpdate(updated);
    setSelected({...selected,data:updated.meetings.find(m=>m.id===selected.data.id)});
    setNewMsg("");
  };

  return (
    <div className="ks-up">
      <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20 }}>
        <h2 style={{ fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic",fontWeight:400,fontSize:24,color:C.goldL }}>{MONTHS[month]} {year}</h2>
        <div style={{ display:"flex",gap:8,alignItems:"center" }}>
          {isAdmin && <button className="btn-ghost" style={{ fontSize:10 }} onClick={()=>setShowAddMeeting(true)}>+ Meeting</button>}
          <button className="btn-sm" onClick={()=>setCurDate(new Date(year,month-1,1))}>‹</button>
          <button className="btn-sm" onClick={()=>setCurDate(new Date(year,month+1,1))}>›</button>
        </div>
      </div>
      <div style={{ display:"flex",gap:16,marginBottom:14,flexWrap:"wrap" }}>
        {[["Content",C.gold],["Meeting","#7a9aaf"],...(isAdmin?[["Milestone","#82d082"]]:[])] .map(([l,c])=>(
          <div key={l} style={{ display:"flex",alignItems:"center",gap:6 }}>
            <div style={{ width:8,height:8,background:c,opacity:0.8 }} />
            <span style={{ fontFamily:"'Lato',sans-serif",fontSize:10,color:C.muted,letterSpacing:"0.1em",textTransform:"uppercase" }}>{l}</span>
          </div>
        ))}
        {isAdmin && <span style={{ fontFamily:"'Lato',sans-serif",fontSize:10,color:C.muted,fontStyle:"italic" }}>· Drag to reschedule</span>}
      </div>
      {/* Weekday headers */}
      <div style={{ display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:1,marginBottom:1 }}>
        {WEEKDAYS.map(d=>(
          <div key={d} style={{ fontFamily:"'Lato',sans-serif",fontSize:10,fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",color:C.muted,textAlign:"center",padding:"7px 0",background:C.surface }} />
        ))}
        {WEEKDAYS.map(d=>(
          <div key={d+"h"} style={{ fontFamily:"'Lato',sans-serif",fontSize:10,fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",color:C.muted,textAlign:"center",padding:"7px 0",marginTop:-32 }}>{d}</div>
        ))}
      </div>
      {/* Grid */}
      <div className="cal-grid">
        {cells.map((d,i)=>{
          const dateStr=ds(d);
          const isToday=dateStr===today;
          const isDragOver=dragOver===dateStr;
          const {content,meetings,milestones}=d?evForDay(d):{content:[],meetings:[],milestones:[]};
          return (
            <div key={i} className={`cal-cell${!d?" other-month":""}${isToday?" today":""}${isDragOver?" drag-over":""}`}
              onDragOver={e=>{if(isAdmin&&d){e.preventDefault();setDragOver(dateStr);}}}
              onDragLeave={()=>setDragOver(null)}
              onDrop={()=>handleDrop(d)}>
              {d && <>
                <span className="cal-day-num" style={{ color:isToday?C.gold:C.muted,fontWeight:isToday?600:400 }}>{d}</span>
                {content.map(item=>(
                  <button key={item.id} className="cal-event" draggable={isAdmin}
                    onDragStart={e=>{_drag={type:"content",id:item.id};e.dataTransfer.effectAllowed="move";}}
                    onClick={()=>setSelected({type:"content",data:item})}
                    style={{ background:`${statusColor(item.status)}15`,color:statusColor(item.status),border:`1px solid ${statusColor(item.status)}30` }}>
                    {item.title}
                  </button>
                ))}
                {meetings.map(m=>(
                  <button key={m.id} className="cal-event" draggable={isAdmin}
                    onDragStart={e=>{_drag={type:"meeting",id:m.id};e.dataTransfer.effectAllowed="move";}}
                    onClick={()=>setSelected({type:"meeting",data:m})}
                    style={{ background:"rgba(122,154,175,0.14)",color:"#9abacf",border:"1px solid rgba(122,154,175,0.25)" }}>
                    ◷ {m.title}
                  </button>
                ))}
                {milestones.map(m=>(
                  <button key={m.id} className="cal-event" draggable={true}
                    onDragStart={e=>{_drag={type:"milestone",id:m.id};e.dataTransfer.effectAllowed="move";}}
                    onClick={()=>setSelected({type:"milestone",data:m})}
                    style={{ background:"rgba(130,208,130,0.1)",color:"#82d082",border:"1px solid rgba(130,208,130,0.22)" }}>
                    ◆ {m.name}
                  </button>
                ))}
              </>}
            </div>
          );
        })}
      </div>

      {selected && (
        <Modal title={selected.type==="meeting"?"◷ "+selected.data.title:selected.type==="milestone"?"◆ "+selected.data.name:selected.data.title} onClose={()=>setSelected(null)}>
          {selected.type==="content" ? (
            <div>
              <div style={{ display:"flex",gap:8,marginBottom:14 }}><StatusBadge status={selected.data.status}/><StatusBadge status={selected.data.approvalStatus||"Pending Approval"}/></div>
              <div style={{ fontFamily:"'Lato',sans-serif",fontSize:12,color:C.muted,marginBottom:8 }}>{selected.data.type} · {fmtDate(selected.data.scheduledDate)}</div>
              {selected.data.link&&<a href={selected.data.link} target="_blank" rel="noreferrer" style={{ color:C.gold,fontSize:12,fontFamily:"'Lato',sans-serif" }}>View published piece →</a>}
              {selected.data.imageUrl&&isBranding(client.tier)&&<div style={{ marginTop:12 }}><img src={selected.data.imageUrl} alt="Content visual" style={{ maxWidth:"100%",maxHeight:260,objectFit:"contain",border:`1px solid ${C.goldBorder}` }} onError={e=>{e.target.style.display="none";}} /></div>}
              {selected.data.body&&<div style={{ marginTop:14,fontFamily:"'Lato',sans-serif",fontSize:13,color:C.dim,lineHeight:1.75,whiteSpace:"pre-wrap",padding:"14px 16px",background:"rgba(255,255,255,0.03)",border:`1px solid rgba(255,255,255,0.07)`,maxHeight:280,overflowY:"auto" }}>{selected.data.body}</div>}
              {selected.data.revisionNotes&&<div style={{ marginTop:14,padding:"12px 14px",background:"rgba(200,100,80,0.08)",border:"1px solid rgba(200,100,80,0.2)",fontFamily:"'Lato',sans-serif",fontSize:13,color:"#d88860",fontStyle:"italic" }}>"{selected.data.revisionNotes}"</div>}
            </div>
          ) : selected.type==="milestone" ? (
            <div>
              <div style={{ display:"flex",gap:8,marginBottom:14 }}><StatusBadge status={selected.data.status}/></div>
              <div style={{ fontFamily:"'Lato',sans-serif",fontSize:12,color:C.muted,marginBottom:8 }}>
                {selected.data.status==="Complete"?"Completed:":"Target date:"} {fmtDate(selected.data.completionDate)||"—"}
              </div>
              {isAdmin&&<div style={{ fontFamily:"'Lato',sans-serif",fontSize:11,color:C.muted,fontStyle:"italic",marginTop:12 }}>Drag on the calendar to reschedule this milestone.</div>}
            </div>
          ) : (
            <div>
              <div style={{ fontFamily:"'Lato',sans-serif",fontSize:12,color:C.muted,marginBottom:5 }}>{fmtDate(selected.data.date)} · {selected.data.time}</div>
              {selected.data.description&&<div style={{ fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic",fontSize:16,color:C.dim,margin:"12px 0",lineHeight:1.65 }}>{selected.data.description}</div>}
              {selected.data.agenda&&<>
                <div style={{ padding:"12px 16px",background:"rgba(201,168,76,0.05)",border:`1px solid rgba(201,168,76,0.15)`,marginBottom:12 }}>
                  <div style={{ fontFamily:"'Lato',sans-serif",fontSize:10,fontWeight:700,letterSpacing:"0.14em",textTransform:"uppercase",color:C.gold,marginBottom:8 }}>Agenda</div>
                  {selected.data.agenda.split("·").map((item,i)=>item.trim()&&<div key={i} style={{ fontFamily:"'Lato',sans-serif",fontSize:12,color:C.dim,marginBottom:4 }}>→ {item.trim()}</div>)}
                </div>
              </>}
              <GoldRule my={16}/>
              <Label>Messages</Label>
              <div style={{ maxHeight:220,overflowY:"auto",marginBottom:12 }}>
                {!(selected.data.messages?.length) && <div style={{ fontFamily:"'Lato',sans-serif",fontSize:12,color:C.muted,textAlign:"center",padding:"16px 0",fontStyle:"italic" }}>No messages yet.</div>}
                {(selected.data.messages||[]).map(msg=>{
                  const mine=msg.from===session.username;
                  return (
                    <div key={msg.id} className={`msg ${mine?"mine":"theirs"}`}>
                      <div style={{ fontFamily:"'Lato',sans-serif",fontSize:11,color:mine?C.gold:"rgba(255,255,255,0.55)",marginBottom:4,fontWeight:700,letterSpacing:"0.06em" }}>{mine?"You":msg.from==="mikaela"?"Mikaela":msg.from}</div>
                      <div style={{ fontFamily:"'Lato',sans-serif",fontSize:13,color:C.text,lineHeight:1.5 }}>{msg.text}</div>
                      <div style={{ fontFamily:"'Lato',sans-serif",fontSize:10,color:C.muted,marginTop:5 }}>{fmtTs(msg.ts)}</div>
                    </div>
                  );
                })}
              </div>
              <div style={{ display:"flex",gap:8 }}>
                <input className="ks-field" value={newMsg} onChange={e=>setNewMsg(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")sendMsg();}} placeholder="Send a message…" style={{ flex:1 }}/>
                <button className="btn-gold" onClick={sendMsg} style={{ padding:"9px 16px" }}>Send</button>
              </div>
            </div>
          )}
        </Modal>
      )}
      {showAddMeeting&&isAdmin&&(
        <MeetingModal onClose={()=>setShowAddMeeting(false)} onSave={m=>{onUpdate({...client,meetings:[...(client.meetings||[]),m]});setShowAddMeeting(false);}}/>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// HOME VIEW (client dashboard)
// ─────────────────────────────────────────────────────────────
function HomeView({ client, session, onUpdate, newSince, onNavigate }) {
  const pending=client.contentCalendar.filter(i=>i.approvalStatus==="Pending Approval").length;
  const unread=(client.directMessages||[]).filter(m=>m.from!==session.username&&m.from==="mikaela").length;
  const recentWins=[...client.publicationLog].sort((a,b)=>new Date(b.date)-new Date(a.date)).slice(0,3);
  const nextMeeting=[...(client.meetings||[])].filter(m=>m.date>=todayStr()).sort((a,b)=>a.date.localeCompare(b.date))[0];
  const hasNewItems=newSince.content>0||newSince.docs>0||newSince.messages>0;
  return (
    <div className="ks-up">
      {/* Welcome message */}
      {client.welcomeMessage&&(
        <div style={{ padding:"28px 32px",background:`linear-gradient(135deg,rgba(201,168,76,0.07),rgba(201,168,76,0.03))`,border:`1px solid rgba(201,168,76,0.2)`,marginBottom:32,position:"relative" }}>
          <div style={{ fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic",fontWeight:300,fontSize:20,color:C.dim,lineHeight:1.8,marginBottom:14 }}>"{client.welcomeMessage}"</div>
          <div style={{ fontFamily:"'Lato',sans-serif",fontSize:11,fontWeight:700,letterSpacing:"0.14em",textTransform:"uppercase",color:C.gold }}>— Mikaela</div>
        </div>
      )}
      {/* Since last visit */}
      {hasNewItems&&(
        <div style={{ display:"flex",gap:10,alignItems:"center",padding:"12px 18px",background:"rgba(130,208,130,0.05)",border:"1px solid rgba(130,208,130,0.2)",marginBottom:28,flexWrap:"wrap" }}>
          <span style={{ fontFamily:"'Lato',sans-serif",fontSize:11,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:"#82d082" }}>Since your last visit —</span>
          {newSince.content>0&&<span style={{ fontFamily:"'Lato',sans-serif",fontSize:12,color:C.dim }}>{newSince.content} new content piece{newSince.content>1?"s":""}</span>}
          {newSince.docs>0&&<span style={{ fontFamily:"'Lato',sans-serif",fontSize:12,color:C.dim }}>{newSince.docs} new document{newSince.docs>1?"s":""}</span>}
          {newSince.messages>0&&<span style={{ fontFamily:"'Lato',sans-serif",fontSize:12,color:C.dim }}>{newSince.messages} new message{newSince.messages>1?"s":""}</span>}
        </div>
      )}
      {/* Action items */}
      {(pending>0||unread>0)&&(
        <div style={{ marginBottom:32 }}>
          <Label>Action Required</Label>
          <div style={{ display:"flex",gap:10,flexWrap:"wrap" }}>
            {pending>0&&<button onClick={()=>onNavigate("content")} style={{ display:"flex",alignItems:"center",gap:10,padding:"14px 20px",background:"rgba(201,168,76,0.08)",border:`1px solid rgba(201,168,76,0.25)`,cursor:"pointer",flex:1,minWidth:180,textAlign:"left" }}>
              <span style={{ fontFamily:"'Playfair Display',serif",fontSize:26,color:C.gold,lineHeight:1 }}>{pending}</span>
              <div><div style={{ fontFamily:"'Lato',sans-serif",fontSize:11,fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",color:C.gold }}>Awaiting Approval</div><div style={{ fontFamily:"'Lato',sans-serif",fontSize:11,color:C.muted,marginTop:2 }}>Review content →</div></div>
            </button>}
            {unread>0&&<button onClick={()=>onNavigate("messages")} style={{ display:"flex",alignItems:"center",gap:10,padding:"14px 20px",background:"rgba(130,208,130,0.06)",border:"1px solid rgba(130,208,130,0.2)",cursor:"pointer",flex:1,minWidth:180,textAlign:"left" }}>
              <span style={{ fontFamily:"'Playfair Display',serif",fontSize:26,color:"#82d082",lineHeight:1 }}>{unread}</span>
              <div><div style={{ fontFamily:"'Lato',sans-serif",fontSize:11,fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",color:"#82d082" }}>New Message{unread>1?"s":""}</div><div style={{ fontFamily:"'Lato',sans-serif",fontSize:11,color:C.muted,marginTop:2 }}>From Mikaela →</div></div>
            </button>}
          </div>
        </div>
      )}
      {/* Next meeting */}
      {nextMeeting&&(
        <div style={{ marginBottom:32 }}>
          <Label>Next Meeting</Label>
          <div onClick={()=>onNavigate("calendar")} style={{ padding:"16px 20px",background:C.surface,border:`1px solid ${C.goldBorder}`,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between",gap:16 }}>
            <div>
              <div style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:19,color:C.text,marginBottom:4 }}>{nextMeeting.title}</div>
              <div style={{ fontFamily:"'Lato',sans-serif",fontSize:11,color:C.muted }}>{fmtDate(nextMeeting.date)} · {nextMeeting.time}</div>
              {nextMeeting.agenda&&<div style={{ fontFamily:"'Lato',sans-serif",fontSize:11,color:C.dim,marginTop:5 }}>Agenda: {nextMeeting.agenda.split("·")[0].trim()}{nextMeeting.agenda.includes("·")?" …":""}</div>}
            </div>
            <span style={{ color:C.gold,fontSize:20 }}>◷</span>
          </div>
        </div>
      )}
      <GoldRule/>
      {/* Recent wins */}
      {recentWins.length>0&&(
        <div style={{ marginTop:28 }}>
          <Label>Recent Wins</Label>
          {recentWins.map(p=>(
            <div key={p.id} style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 0",borderBottom:`1px solid rgba(255,255,255,0.05)` }}>
              <div>
                <span style={{ fontFamily:"'Lato',sans-serif",fontSize:11,fontWeight:700,color:C.gold,marginRight:10 }}>{p.outlet}</span>
                <span style={{ fontFamily:"'Lato',sans-serif",fontSize:13,color:C.dim }}>{p.title}</span>
              </div>
              <span style={{ fontFamily:"'Lato',sans-serif",fontSize:11,color:C.muted,whiteSpace:"nowrap",marginLeft:12 }}>{fmtDate(p.date)}</span>
            </div>
          ))}
        </div>
      )}
      {!client.welcomeMessage&&!nextMeeting&&recentWins.length===0&&pending===0&&(
        <EmptyState message="Your portal home will fill in as your engagement gets underway." icon="◈"/>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// DIRECT MESSAGES VIEW
// ─────────────────────────────────────────────────────────────
function DirectMessagesView({ client, session, onUpdate }) {
  const [newMsg,setNewMsg]=useState("");
  const msgs=client.directMessages||[];
  const endRef=useRef(null);
  useEffect(()=>{ endRef.current?.scrollIntoView({behavior:"smooth"}); },[msgs.length]);
  const send=()=>{
    if(!newMsg.trim()) return;
    const msg={id:uid(),from:session.username,text:newMsg.trim(),ts:new Date().toISOString()};
    onUpdate({...client,directMessages:[...msgs,msg]});
    setNewMsg("");
  };
  const isAdmin=session.role==="admin";
  return (
    <div className="ks-up">
      <SectionHeading sub={isAdmin?"Your direct line with "+client.name:"Your direct line with Mikaela"}>Messages</SectionHeading>
      <div style={{ minHeight:300,maxHeight:520,overflowY:"auto",marginBottom:16,display:"flex",flexDirection:"column",gap:0 }}>
        {msgs.length===0&&<EmptyState message="This is your private message thread. Start a conversation." icon="◇"/>}
        {msgs.map(msg=>{
          const mine=msg.from===session.username;
          return (
            <div key={msg.id} className={`msg ${mine?"mine":"theirs"}`}>
              <div style={{ fontFamily:"'Lato',sans-serif",fontSize:11,color:mine?C.gold:"rgba(255,255,255,0.55)",marginBottom:4,fontWeight:700,letterSpacing:"0.06em" }}>{mine?"You":msg.from==="mikaela"?"Mikaela":client.name}</div>
              <div style={{ fontFamily:"'Lato',sans-serif",fontSize:13,color:C.text,lineHeight:1.6 }}>{msg.text}</div>
              <div style={{ fontFamily:"'Lato',sans-serif",fontSize:10,color:C.muted,marginTop:5 }}>{fmtTs(msg.ts)}</div>
            </div>
          );
        })}
        <div ref={endRef}/>
      </div>
      <div style={{ display:"flex",gap:8 }}>
        <textarea className="ks-field" value={newMsg} onChange={e=>setNewMsg(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();}}} placeholder="Write a message… (Enter to send, Shift+Enter for new line)" style={{ flex:1,resize:"none",minHeight:48 }} rows={2}/>
        <button className="btn-gold" onClick={send} style={{ padding:"10px 18px",alignSelf:"flex-end" }}>Send</button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// MEDIA PLAYBOOK VIEW (client-read)
// ─────────────────────────────────────────────────────────────
function MediaPlaybookView({ client }) {
  const pb=client.mediaPlaybook||{sections:[]};
  const [open,setOpen]=useState({});
  const toggle=id=>setOpen(p=>({...p,[id]:!p[id]}));
  return (
    <div className="ks-up">
      <SectionHeading sub="Your guide to navigating media situations — know exactly what to do when it matters">Media Playbook</SectionHeading>
      {pb.sections.length===0?(
        <EmptyState message="Your Media Playbook will be built out by Mikaela. It covers how to handle journalist inquiries, content questions, and anything that comes up in the public eye." icon="◎"/>
      ):(
        <div>
          <div style={{ fontFamily:"'Lato',sans-serif",fontSize:13,color:C.dim,lineHeight:1.7,marginBottom:28,fontStyle:"italic" }}>
            When something unexpected comes up — a journalist, a comment, an opportunity — this is your first reference. When in doubt, contact Mikaela before responding.
          </div>
          {pb.sections.map(s=>(
            <div key={s.id} style={{ marginBottom:10,border:`1px solid ${open[s.id]?C.goldBorder:"rgba(255,255,255,0.07)"}`,transition:"border-color 0.2s" }}>
              <button onClick={()=>toggle(s.id)} style={{ width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"18px 22px",background:"none",border:"none",cursor:"pointer",textAlign:"left" }}>
                <span style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:18,color:open[s.id]?C.goldL:C.text,fontWeight:400,transition:"color 0.2s" }}>{s.title}</span>
                <span style={{ color:C.gold,fontSize:14,marginLeft:16,flexShrink:0,transform:open[s.id]?"rotate(90deg)":"none",transition:"transform 0.2s" }}>›</span>
              </button>
              {open[s.id]&&(
                <div className="ks-in" style={{ padding:"0 22px 22px" }}>
                  <GoldRule my={0}/>
                  <div style={{ fontFamily:"'Lato',sans-serif",fontSize:13,color:C.dim,lineHeight:1.8,whiteSpace:"pre-wrap",marginTop:16 }}>{s.content}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// CONTENT VIEW
// ─────────────────────────────────────────────────────────────
function ContentView({ client, isAdmin, onUpdate }) {
  const [filter,setFilter]=useState("All");
  const [revModal,setRevModal]=useState(null);
  const [revNote,setRevNote]=useState("");
  const [expanded,setExpanded]=useState({});
  const toggleExpand=id=>setExpanded(p=>({...p,[id]:!p[id]}));
  const isFoundation=client.tier==="foundation";
  const items=filter==="All"?client.contentCalendar:client.contentCalendar.filter(i=>i.status===filter||i.approvalStatus===filter);
  const updateItem=(id,patch)=>onUpdate({...client,contentCalendar:client.contentCalendar.map(i=>i.id===id?{...i,...patch}:i)});
  const pendingCount=client.contentCalendar.filter(i=>i.approvalStatus==="Pending Approval").length;
  return (
    <div className="ks-up">
      <SectionHeading>Content Output</SectionHeading>
      <div style={{ display:"flex",gap:10,marginBottom:24,flexWrap:"wrap" }}>
        {CONTENT_STATUSES.map(s=>(
          <div key={s} style={{ flex:1,minWidth:80,background:C.surface,border:`1px solid ${C.goldBorder}`,padding:"14px 16px",textAlign:"center" }}>
            <div style={{ fontFamily:"'Playfair Display',serif",fontSize:26,color:C.gold }}>{client.contentCalendar.filter(i=>i.status===s).length}</div>
            <div style={{ fontFamily:"'Lato',sans-serif",fontSize:10,fontWeight:700,letterSpacing:"0.13em",textTransform:"uppercase",color:C.muted,marginTop:4 }}>{s}</div>
          </div>
        ))}
        {pendingCount>0&&(
          <div style={{ flex:1,minWidth:80,background:C.surface,border:"1px solid rgba(201,168,76,0.1)",padding:"14px 16px",textAlign:"center" }}>
            <div style={{ fontFamily:"'Playfair Display',serif",fontSize:26,color:"#c9a84c88" }}>{pendingCount}</div>
            <div style={{ fontFamily:"'Lato',sans-serif",fontSize:10,fontWeight:700,letterSpacing:"0.13em",textTransform:"uppercase",color:C.muted,marginTop:4 }}>Awaiting Approval</div>
          </div>
        )}
      </div>
      <div style={{ display:"flex",gap:0,borderBottom:`1px solid ${C.goldBorder}`,marginBottom:22,overflowX:"auto" }}>
        {["All",...CONTENT_STATUSES,"Pending Approval","Revision Requested"].map(f=>(
          <button key={f} onClick={()=>setFilter(f)} style={{ background:"none",border:"none",borderBottom:filter===f?`2px solid ${C.gold}`:"2px solid transparent",color:filter===f?C.gold:C.muted,fontFamily:"'Lato',sans-serif",fontSize:10,fontWeight:700,letterSpacing:"0.11em",textTransform:"uppercase",padding:"10px 13px",cursor:"pointer",whiteSpace:"nowrap",marginBottom:-1,transition:"color 0.2s" }}>{f}</button>
        ))}
      </div>
      {items.length===0?<EmptyState message="No content in this category." icon="◈"/>:(
        items.map(item=>(
          <div key={item.id} style={{ padding:"16px 0",borderBottom:`1px solid rgba(255,255,255,0.05)` }}>
            <div style={{ display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:16,flexWrap:"wrap" }}>
              <div style={{ flex:1 }}>
                <div style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:18,color:C.text,marginBottom:6 }}>{item.title}</div>
                <div style={{ display:"flex",gap:8,flexWrap:"wrap",alignItems:"center" }}>
                  <span style={{ fontFamily:"'Lato',sans-serif",fontSize:11,color:C.muted }}>{item.type}</span>
                  <span style={{ color:C.muted }}>·</span>
                  <span style={{ fontFamily:"'Lato',sans-serif",fontSize:11,color:C.muted }}>{fmtDate(item.scheduledDate)}</span>
                  <StatusBadge status={item.status}/>
                  <StatusBadge status={item.approvalStatus||"Pending Approval"}/>
                </div>
                {item.revisionNotes&&<div style={{ marginTop:8,fontFamily:"'Lato',sans-serif",fontSize:12,color:"#d88860",fontStyle:"italic" }}>Revision: "{item.revisionNotes}"</div>}
              </div>
              <div style={{ display:"flex",gap:6,flexShrink:0,flexWrap:"wrap",alignItems:"center" }}>
                {item.link&&<a href={item.link} target="_blank" rel="noreferrer" className="btn-sm" style={{ textDecoration:"none" }}>View</a>}
                {item.body&&<button className="btn-sm" onClick={()=>toggleExpand(item.id)}>{expanded[item.id]?"Hide ↑":"Read ↓"}</button>}
                {!isAdmin&&!isFoundation&&item.approvalStatus!=="Approved"&&<><button className="btn-approve" onClick={()=>updateItem(item.id,{approvalStatus:"Approved",revisionNotes:""})}>Approve</button><button className="btn-revise" onClick={()=>{setRevModal(item);setRevNote("");}}>Revision</button></>}
              </div>
            </div>
            {expanded[item.id]&&(
              <div className="ks-in" style={{ marginTop:16 }}>
                {item.imageUrl&&isBranding(client.tier)&&(
                  <div style={{ marginBottom:14 }}>
                    <img src={item.imageUrl} alt="Content visual" style={{ maxWidth:"100%",maxHeight:320,objectFit:"contain",border:`1px solid ${C.goldBorder}`,display:"block" }}
                      onError={e=>{e.target.style.display="none";}}/>
                  </div>
                )}
                {item.body&&(
                  <div style={{ fontFamily:"'Lato',sans-serif",fontSize:13,color:C.dim,lineHeight:1.75,whiteSpace:"pre-wrap",padding:"18px 20px",background:"rgba(255,255,255,0.03)",border:`1px solid rgba(255,255,255,0.07)`,borderRadius:1 }}>
                    {item.body}
                  </div>
                )}
              </div>
            )}
          </div>
        ))
      )}
      {revModal&&(
        <Modal title="Request Revision" onClose={()=>setRevModal(null)}>
          <div style={{ fontFamily:"'Lato',sans-serif",fontSize:13,color:C.dim,marginBottom:16 }}>"{revModal.title}"</div>
          <FormRow label="What needs to change?"><textarea className="ks-field" rows={3} value={revNote} onChange={e=>setRevNote(e.target.value)} placeholder="Describe the changes you'd like…"/></FormRow>
          <div style={{ display:"flex",gap:10 }}>
            <button className="btn-gold" onClick={()=>{updateItem(revModal.id,{approvalStatus:"Revision Requested",revisionNotes:revNote});setRevModal(null);}}>Submit</button>
            <button className="btn-ghost" onClick={()=>setRevModal(null)}>Cancel</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// PERFORMANCE VIEW
// ─────────────────────────────────────────────────────────────
function PerformanceView({ client }) {
  const r=client.performanceReport;
  const stats=[...(client.linkedInStats||[])].sort((a,b)=>new Date(a.date)-new Date(b.date));
  const latest=stats[stats.length-1];
  const prev=stats[stats.length-2];
  const delta=key=>{if(!latest||!prev)return null;const d=latest[key]-prev[key];return d>0?`+${d.toLocaleString()}`:d.toString();};
  return (
    <div className="ks-up">
      <SectionHeading>Performance</SectionHeading>
      {r.period&&<>
        <div style={{ fontFamily:"'Lato',sans-serif",fontSize:10,fontWeight:700,letterSpacing:"0.16em",textTransform:"uppercase",color:C.muted,marginBottom:18 }}>{r.period} Report</div>
        <div style={{ display:"flex",gap:24,flexWrap:"wrap",marginBottom:24 }}>
          <Stat label="Engagement" value={r.engagement||"—"}/>
          <Stat label="Total Reach" value={r.reach||"—"}/>
          <Stat label="Placements" value={r.placements||"0"}/>
        </div>
        {r.summary&&<div style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:18,fontWeight:300,color:C.dim,lineHeight:1.75,fontStyle:"italic",marginBottom:28 }}>" {r.summary} "</div>}
        <GoldRule/>
      </>}
      <SectionHeading sub="Updated manually from LinkedIn Analytics">LinkedIn Analytics</SectionHeading>
      {!latest?<EmptyState message="LinkedIn stats will appear here once updated." icon="📊"/>:<>
        <div style={{ fontFamily:"'Lato',sans-serif",fontSize:10,color:C.muted,marginBottom:18 }}>Last updated: {fmtDate(latest.date)}</div>
        <div style={{ display:"flex",gap:16,flexWrap:"wrap",marginBottom:24 }}>
          <Stat label="Followers" value={latest.followers?.toLocaleString()} sub={delta("followers")&&<span style={{ color:Number((delta("followers")||"0").replace("+",""))>0?"#82d082":"#c97a4a",fontSize:11,fontFamily:"'Lato',sans-serif" }}>{delta("followers")} vs last month</span>}/>
          <Stat label="Impressions" value={latest.impressions?.toLocaleString()}/>
          <Stat label="Profile Views" value={latest.profileViews?.toLocaleString()}/>
          <Stat label="Engagement" value={`${latest.engagementRate}%`}/>
        </div>
        {latest.topPost&&<div style={{ padding:"14px 18px",background:"rgba(201,168,76,0.05)",border:`1px solid ${C.goldBorder}`,marginBottom:20 }}><Label>Top Performing Post</Label><div style={{ fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic",fontSize:16,color:C.text }}>"{latest.topPost}"</div></div>}
        {stats.length>1&&<>
          <Label>Follower Growth</Label>
          <div style={{ display:"flex",alignItems:"flex-end",gap:4,height:64,marginBottom:8,paddingBottom:4 }}>
            {stats.map((s,i)=>{
              const max=Math.max(...stats.map(x=>x.followers));
              const h=Math.round((s.followers/max)*50)+8;
              return <div key={i} style={{ flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3 }}>
                <div style={{ width:"100%",height:h,background:`linear-gradient(180deg,${C.goldL}55,${C.gold}88)`,borderRadius:"1px 1px 0 0",transition:"height 0.6s" }}/>
                <div style={{ fontFamily:"'Lato',sans-serif",fontSize:9,color:C.muted,textAlign:"center" }}>{new Date(s.date).toLocaleDateString("en-US",{month:"short"})}</div>
              </div>;
            })}
          </div>
        </>}
      </>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// PUBLICATION WINS
// ─────────────────────────────────────────────────────────────
function PublicationWinsView({ client }) {
  const sorted=[...client.publicationLog].sort((a,b)=>new Date(b.date)-new Date(a.date));
  return (
    <div className="ks-up">
      <SectionHeading sub="Every placed piece, logged as a permanent record of your work">Publication Wins</SectionHeading>
      {sorted.length===0?<EmptyState message="Your first placed article will appear here." icon="◉"/>:(
        <table className="ks-table">
          <thead><tr><th>Outlet</th><th>Title</th><th>Date</th><th></th></tr></thead>
          <tbody>{sorted.map(p=>(
            <tr key={p.id}>
              <td style={{ color:C.gold,fontWeight:700,fontSize:12,whiteSpace:"nowrap" }}>{p.outlet}</td>
              <td>{p.title}</td>
              <td style={{ color:C.muted,fontSize:12,whiteSpace:"nowrap" }}>{fmtDate(p.date)}</td>
              <td>{p.link?<a href={p.link} target="_blank" rel="noreferrer" style={{ color:C.gold,fontSize:12 }}>View →</a>:"—"}</td>
            </tr>
          ))}</tbody>
        </table>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// MILESTONES
// ─────────────────────────────────────────────────────────────
function MilestonesView({ client }) {
  const order={ Complete:0,"In Progress":1,"Not Started":2 };
  const sorted=[...client.milestones].sort((a,b)=>order[a.status]-order[b.status]);
  return (
    <div className="ks-up">
      <SectionHeading>Milestone Tracker</SectionHeading>
      {sorted.length===0?<EmptyState message="Milestones will appear here." icon="◆"/>:sorted.map(m=>(
        <div key={m.id} style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"16px 0",borderBottom:`1px solid rgba(255,255,255,0.05)`,gap:16 }}>
          <div style={{ display:"flex",alignItems:"center",gap:14,flex:1 }}>
            <div style={{ width:8,height:8,borderRadius:"50%",background:m.status==="Complete"?C.gold:m.status==="In Progress"?"#c9a84c88":"rgba(255,255,255,0.18)",flexShrink:0 }}/>
            <div>
              <div style={{ fontFamily:"'Lato',sans-serif",fontSize:13,color:m.status==="Complete"?C.text:C.dim }}>{m.name}</div>
              {m.completionDate&&<div style={{ fontFamily:"'Lato',sans-serif",fontSize:11,color:C.muted,marginTop:2 }}>Completed {fmtDate(m.completionDate)}</div>}
            </div>
          </div>
          <StatusBadge status={m.status}/>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// STRATEGY MAP (replaces Brand Roadmap)
// ─────────────────────────────────────────────────────────────
function StrategyMapView({ client }) {
  const sm=client.strategyMap||{phases:[],goals:[]};
  const phases=sm.phases||[];
  const goals=sm.goals||[];
  const phaseStatus={ complete:{c:C.gold,label:"Complete",dot:"●"},active:{c:"#82d082",label:"Active",dot:"◉"},upcoming:{c:C.muted,label:"Upcoming",dot:"○"},future:{c:"rgba(255,255,255,0.25)",label:"Future",dot:"○"} };
  const periods=[{key:"90day",label:"90-Day Goals"},{key:"6month",label:"6-Month Goals"},{key:"12month",label:"12-Month Goals"}];
  return (
    <div className="ks-up">
      <SectionHeading sub="Your brand trajectory — three phases, one clear direction">Strategy Map</SectionHeading>
      {/* Phase arc */}
      {phases.length>0&&<>
        <div style={{ display:"flex",gap:1,marginBottom:28 }}>
          {phases.map((phase,i)=>{
            const cfg=phaseStatus[phase.status]||phaseStatus.future;
            const isActive=phase.status==="active";
            return (
              <div key={phase.id} style={{ flex:1,background:isActive?"rgba(130,208,130,0.06)":i===0&&phase.status==="complete"?"rgba(201,168,76,0.06)":"rgba(255,255,255,0.02)",border:`1px solid ${isActive?"rgba(130,208,130,0.25)":phase.status==="complete"?C.goldBorder:"rgba(255,255,255,0.07)"}`,padding:"18px 16px",position:"relative" }}>
                <div style={{ fontFamily:"'Lato',sans-serif",fontSize:9,fontWeight:700,letterSpacing:"0.15em",textTransform:"uppercase",color:cfg.c,marginBottom:8 }}>{cfg.dot} {phase.name}</div>
                <div style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:15,color:C.dim,lineHeight:1.55,marginBottom:12 }}>{phase.description}</div>
                {phase.outcomes?.map((o,oi)=><div key={oi} style={{ fontFamily:"'Lato',sans-serif",fontSize:11,color:C.muted,marginBottom:3 }}>→ {o}</div>)}
              </div>
            );
          })}
        </div>
        <GoldRule/>
      </>}
      {/* Goals */}
      {goals.length===0?<EmptyState message="Brand goals will appear here." icon="▲"/>:(
        <div style={{ display:"flex",flexDirection:"column",gap:28 }}>
          {periods.map(({key,label})=>{
            const gs=goals.filter(g=>g.period===key);
            if(!gs.length) return null;
            return <div key={key}>
              <div style={{ fontFamily:"'Lato',sans-serif",fontSize:10,fontWeight:700,letterSpacing:"0.18em",textTransform:"uppercase",color:C.muted,marginBottom:16,paddingBottom:8,borderBottom:`1px solid ${C.goldBorder}` }}>{label}</div>
              {gs.map(g=><div key={g.id} style={{ marginBottom:18 }}>
                <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8 }}>
                  <span style={{ fontFamily:"'Lato',sans-serif",fontSize:13,color:C.text }}>{g.name}</span>
                  <TrajectoryTag trajectory={g.trajectory}/>
                </div>
                <ProgressBar value={g.progress} trajectory={g.trajectory}/>
              </div>)}
            </div>;
          })}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// AI VISIBILITY
// ─────────────────────────────────────────────────────────────
function AIVisibilityView({ client }) {
  const av=client.aiVisibility||{score:0,lastUpdated:"",queries:[],suggestions:[]};
  const appearing=av.queries.filter(q=>q.appears).length;
  return (
    <div className="ks-up">
      <SectionHeading sub="How often you appear when AI tools answer questions in your industry">AI Visibility Tracker</SectionHeading>
      {av.lastUpdated&&<div style={{ fontFamily:"'Lato',sans-serif",fontSize:10,color:C.muted,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:20 }}>Last updated: {fmtDate(av.lastUpdated)}</div>}
      <div style={{ display:"flex",gap:24,flexWrap:"wrap",marginBottom:av.score?24:0 }}>
        <Stat label="Visibility Score" value={av.score||"—"}/>
        <Stat label="Queries Tracked" value={av.queries.length||"—"}/>
        <Stat label="Appearing In" value={av.queries.length>0?`${appearing}/${av.queries.length}`:"—"}/>
      </div>
      {av.score>0&&<><div style={{ marginBottom:24 }}><ProgressBar value={av.score} trajectory={av.score>=60?"ahead":av.score>=30?"on-track":"needs-attention"}/></div><GoldRule/></>}
      {av.queries.length>0&&<>
        <Label>Tracked Queries</Label>
        {av.queries.map(q=>(
          <div key={q.id} style={{ padding:"14px 0",borderBottom:`1px solid rgba(255,255,255,0.05)` }}>
            <div style={{ display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:16 }}>
              <div style={{ flex:1 }}>
                <div style={{ fontFamily:"'Lato',sans-serif",fontSize:13,color:C.text,marginBottom:6 }}>"{q.query}"</div>
                <div style={{ display:"flex",gap:6,flexWrap:"wrap",marginBottom:q.notes?5:0 }}>
                  {q.appears?q.platforms.map(p=><span key={p} style={{ background:"rgba(201,168,76,0.1)",color:C.gold,border:`1px solid rgba(201,168,76,0.22)`,fontFamily:"'Lato',sans-serif",fontSize:10,fontWeight:700,letterSpacing:"0.1em",padding:"2px 8px" }}>{p}</span>):<span style={{ fontFamily:"'Lato',sans-serif",fontSize:11,color:"rgba(200,100,80,0.8)" }}>Not yet appearing</span>}
                </div>
                {q.notes&&<div style={{ fontFamily:"'Lato',sans-serif",fontSize:11,color:C.muted,fontStyle:"italic" }}>{q.notes}</div>}
              </div>
              <div style={{ fontSize:18,color:q.appears?"#82d082":"rgba(255,255,255,0.25)" }}>{q.appears?"✓":"○"}</div>
            </div>
          </div>
        ))}
        <div style={{ marginTop:24 }}/>
      </>}
      {av.suggestions.length>0&&<>
        <GoldRule/>
        <Label>Recommendations</Label>
        {av.suggestions.map((s,i)=>(
          <div key={i} style={{ display:"flex",gap:12,padding:"12px 14px",background:"rgba(201,168,76,0.04)",border:`1px solid ${C.goldBorder}`,marginBottom:8 }}>
            <span style={{ color:C.gold,fontSize:13,flexShrink:0 }}>→</span>
            <span style={{ fontFamily:"'Lato',sans-serif",fontSize:13,color:C.dim,lineHeight:1.55 }}>{s}</span>
          </div>
        ))}
      </>}
      {av.queries.length===0&&<EmptyState message="AI visibility tracking will appear here once set up by Mikaela." icon="◎"/>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// BRAND VOICE (interactive)
// ─────────────────────────────────────────────────────────────
function BrandVoiceView({ client, isAdmin, onUpdate, apiKey }) {
  const bv=client.brandVoice||{toneWords:[],avoidWords:[],approvedTopics:[],guidelines:"",examplePosts:[],toneProfile:{formalCasual:50,boldMeasured:50,personalProfessional:50},exploreIdeas:[],whiteSpaceCache:null};
  const [tab,setTab]=useState("voice");
  const [editing,setEditing]=useState(false);
  const [form,setForm]=useState({...bv});
  const [newPost,setNewPost]=useState("");
  const [newIdea,setNewIdea]=useState("");
  const [replyId,setReplyId]=useState(null);
  const [replyText,setReplyText]=useState("");
  const [wsIndustry,setWsIndustry]=useState("");
  const [wsNiche,setWsNiche]=useState("");
  const [wsLoading,setWsLoading]=useState(false);
  const [wsResult,setWsResult]=useState(bv.whiteSpaceCache||null);
  const [wsError,setWsError]=useState("");

  const save=()=>{ onUpdate({...client,brandVoice:form}); setEditing(false); };

  const addExploreIdea=()=>{
    if(!newIdea.trim()) return;
    const idea={id:uid(),idea:newIdea.trim(),response:"",ts:new Date().toISOString(),hasResponse:false};
    onUpdate({...client,brandVoice:{...bv,exploreIdeas:[...(bv.exploreIdeas||[]),idea]}});
    setNewIdea("");
  };

  const submitReply=(ideaId)=>{
    if(!replyText.trim()) return;
    onUpdate({...client,brandVoice:{...bv,exploreIdeas:(bv.exploreIdeas||[]).map(i=>i.id===ideaId?{...i,response:replyText,hasResponse:true}:i)}});
    setReplyId(null); setReplyText("");
  };

  const deleteIdea=id=>onUpdate({...client,brandVoice:{...bv,exploreIdeas:(bv.exploreIdeas||[]).filter(i=>i.id!==id)}});

  const runWhiteSpace=async()=>{
    if(!wsIndustry.trim()) return;
    setWsLoading(true); setWsError(""); setWsResult(null);
    const prompt=`You are a brand strategist and ghostwriter. A client works in: "${wsIndustry}"${wsNiche?`, specifically in the niche: "${wsNiche}"`:""}.\n\nAnalyze this space and identify:\n1. OVERSATURATED angles (what everyone is writing about — the noise)\n2. WHITE SPACE opportunities (underexplored angles that could build a distinctive brand voice)\n3. CONTRARIAN takes worth exploring\n4. EMERGING conversations that aren't crowded yet\n\nRespond in this exact JSON format with no other text:\n{\n  "oversaturated": ["angle1","angle2","angle3","angle4","angle5"],\n  "whiteSpace": [{"angle":"...","why":"..."},{"angle":"...","why":"..."},{"angle":"...","why":"..."},{"angle":"...","why":"..."}],\n  "contrarian": ["take1","take2","take3"],\n  "emerging": ["topic1","topic2","topic3"]\n}`;
    try {
      const text=await callClaude(prompt,apiKey);
      const clean=text.replace(/```json|```/g,"").trim();
      const data=JSON.parse(clean);
      setWsResult(data);
      onUpdate({...client,brandVoice:{...bv,whiteSpaceCache:data}});
    } catch(e) {
      setWsError("Unable to generate analysis. If running on your deployed site, you may need to add your Anthropic API key in Settings.");
    }
    setWsLoading(false);
  };

  const TONE_AXES=[
    { key:"formalCasual", left:"Formal", right:"Casual" },
    { key:"boldMeasured", left:"Measured", right:"Bold" },
    { key:"personalProfessional", left:"Professional", right:"Personal" },
  ];

  const voiceTabs=[{key:"voice",label:"Voice Profile"},{key:"explore",label:"Topics to Explore"},...((isAdmin||hasInfluence(client.tier))?[{key:"whitespace",label:"White Space Finder"}]:[]),{key:"tone",label:"Tone Calibration"}];

  return (
    <div className="ks-up">
      <SectionHeading>Brand Voice</SectionHeading>
      <div style={{ display:"flex",gap:0,borderBottom:`1px solid ${C.goldBorder}`,marginBottom:24,overflowX:"auto" }}>
        {voiceTabs.map(t=>(
          <button key={t.key} onClick={()=>setTab(t.key)} style={{ background:"none",border:"none",borderBottom:tab===t.key?`2px solid ${C.gold}`:"2px solid transparent",color:tab===t.key?C.gold:C.muted,fontFamily:"'Lato',sans-serif",fontSize:10,fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",padding:"10px 14px",cursor:"pointer",whiteSpace:"nowrap",marginBottom:-1,transition:"color 0.2s" }}>{t.label}{t.key==="explore"&&(bv.exploreIdeas||[]).filter(i=>!i.hasResponse).length>0&&<span style={{ marginLeft:6,background:"rgba(201,168,76,0.2)",color:C.gold,fontSize:9,fontWeight:700,padding:"1px 5px",borderRadius:8 }}>{(bv.exploreIdeas||[]).filter(i=>!i.hasResponse).length}</span>}</button>
        ))}
      </div>

      {/* VOICE PROFILE */}
      {tab==="voice"&&(
        <div>
          {editing&&isAdmin?(
            <div>
              <FormRow label="Tone Words — how the writing should feel"><TagInput tags={form.toneWords||[]} onChange={v=>setForm(f=>({...f,toneWords:v}))} placeholder="e.g. Authoritative, Warm…"/></FormRow>
              <FormRow label="Words & Phrases to Avoid"><TagInput tags={form.avoidWords||[]} onChange={v=>setForm(f=>({...f,avoidWords:v}))} placeholder="e.g. Hustle, Game-changer…" avoid/></FormRow>
              <FormRow label="Approved Topics"><TagInput tags={form.approvedTopics||[]} onChange={v=>setForm(f=>({...f,approvedTopics:v}))} placeholder="e.g. Leadership, Strategy…"/></FormRow>
              <FormRow label="Voice Guidelines"><textarea className="ks-field" rows={4} value={form.guidelines||""} onChange={e=>setForm(f=>({...f,guidelines:e.target.value}))} placeholder="Describe the voice, tone, and style…"/></FormRow>
              <FormRow label="Example Posts">
                {(form.examplePosts||[]).map((p,i)=>(
                  <div key={i} style={{ display:"flex",gap:8,marginBottom:6 }}>
                    <div style={{ flex:1,fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic",fontSize:14,color:C.dim,padding:"8px 12px",background:"rgba(255,255,255,0.03)",border:`1px solid rgba(255,255,255,0.07)` }}>"{p}"</div>
                    <button className="btn-del" onClick={()=>setForm(f=>({...f,examplePosts:f.examplePosts.filter((_,j)=>j!==i)}))}>Del</button>
                  </div>
                ))}
                <div style={{ display:"flex",gap:8,marginTop:4 }}>
                  <input className="ks-field" value={newPost} onChange={e=>setNewPost(e.target.value)} placeholder="Add an example post…" style={{ flex:1 }} onKeyDown={e=>{if(e.key==="Enter"&&newPost.trim()){setForm(f=>({...f,examplePosts:[...(f.examplePosts||[]),newPost.trim()]}));setNewPost("");}}}/>
                  <button className="btn-sm" onClick={()=>{if(newPost.trim()){setForm(f=>({...f,examplePosts:[...(f.examplePosts||[]),newPost.trim()]}));setNewPost("");}}}>Add</button>
                </div>
              </FormRow>
              <div style={{ display:"flex",gap:10 }}>
                <button className="btn-gold" onClick={save}>Save Voice Guide</button>
                <button className="btn-ghost" onClick={()=>setEditing(false)}>Cancel</button>
              </div>
            </div>
          ):(
            <div>
              {isAdmin&&<div style={{ display:"flex",justifyContent:"flex-end",marginBottom:16 }}><button className="btn-ghost" onClick={()=>{setForm({...bv});setEditing(true);}}>Edit Voice Guide</button></div>}
              {!bv.guidelines&&!(bv.toneWords?.length)?<EmptyState message="Brand voice guide will appear here once set up." icon="◇"/>:(
                <>
                  {bv.guidelines&&<div style={{ fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic",fontSize:18,color:C.dim,lineHeight:1.75,marginBottom:24 }}>" {bv.guidelines} "</div>}
                  {bv.toneWords?.length>0&&<div style={{ marginBottom:18 }}><Label>Tone</Label><div>{bv.toneWords.map(t=><span key={t} className="tag" style={{ cursor:"default" }}>{t}</span>)}</div></div>}
                  {bv.avoidWords?.length>0&&<div style={{ marginBottom:18 }}><Label>Avoid</Label><div>{bv.avoidWords.map(t=><span key={t} className="tag tag-avoid" style={{ cursor:"default" }}>{t}</span>)}</div></div>}
                  {bv.approvedTopics?.length>0&&<div style={{ marginBottom:18 }}><Label>Approved Topics</Label><div>{bv.approvedTopics.map(t=><span key={t} className="tag" style={{ cursor:"default" }}>{t}</span>)}</div></div>}
                  {bv.examplePosts?.length>0&&<><GoldRule/><Label>Example Posts</Label>{bv.examplePosts.map((p,i)=><div key={i} style={{ fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic",fontSize:16,color:C.dim,padding:"12px 16px",background:"rgba(255,255,255,0.02)",border:`1px solid rgba(255,255,255,0.06)`,marginBottom:8,lineHeight:1.65 }}>"{p}"</div>)}</>}
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* TOPICS TO EXPLORE */}
      {tab==="explore"&&(
        <div>
          <div style={{ fontFamily:"'Lato',sans-serif",fontSize:13,color:C.dim,lineHeight:1.65,marginBottom:22 }}>
            Drop ideas, angles, and questions you want to explore in your writing. {isAdmin?"Respond to client ideas below.":"Mikaela will respond with her thoughts."}
          </div>
          <div style={{ display:"flex",gap:8,marginBottom:28 }}>
            <input className="ks-field" value={newIdea} onChange={e=>setNewIdea(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")addExploreIdea();}} placeholder="What are you curious about exploring?…" style={{ flex:1 }}/>
            <button className="btn-gold" onClick={addExploreIdea} style={{ padding:"9px 18px" }}>Add</button>
          </div>
          {!(bv.exploreIdeas?.length)?<EmptyState message="Ideas you want to explore will appear here." icon="◇"/>:(
            [...(bv.exploreIdeas||[])].reverse().map(item=>(
              <div key={item.id} className="explore-card">
                <div style={{ display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:12,marginBottom:item.hasResponse||isAdmin?10:0 }}>
                  <div>
                    <div style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:17,color:C.text,lineHeight:1.5 }}>"{item.idea}"</div>
                    <div style={{ fontFamily:"'Lato',sans-serif",fontSize:10,color:C.muted,marginTop:5 }}>{fmtTs(item.ts)}</div>
                  </div>
                  <div style={{ display:"flex",gap:6,flexShrink:0 }}>
                    {isAdmin&&!item.hasResponse&&replyId!==item.id&&<button className="btn-sm" onClick={()=>{setReplyId(item.id);setReplyText("");}}>Respond</button>}
                    {isAdmin&&<button className="btn-del" onClick={()=>deleteIdea(item.id)}>Del</button>}
                  </div>
                </div>
                {item.hasResponse&&<div style={{ padding:"10px 14px",background:"rgba(201,168,76,0.06)",border:`1px solid rgba(201,168,76,0.18)`,marginTop:8 }}>
                  <div style={{ fontFamily:"'Lato',sans-serif",fontSize:10,fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",color:C.gold,marginBottom:5 }}>Mikaela</div>
                  <div style={{ fontFamily:"'Lato',sans-serif",fontSize:13,color:C.dim,lineHeight:1.6 }}>{item.response}</div>
                </div>}
                {replyId===item.id&&isAdmin&&(
                  <div style={{ marginTop:10 }}>
                    <textarea className="ks-field" rows={2} value={replyText} onChange={e=>setReplyText(e.target.value)} placeholder="Your response…"/>
                    <div style={{ display:"flex",gap:8,marginTop:8 }}>
                      <button className="btn-gold" onClick={()=>submitReply(item.id)} style={{ padding:"8px 18px" }}>Send Response</button>
                      <button className="btn-ghost" onClick={()=>setReplyId(null)}>Cancel</button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* WHITE SPACE FINDER */}
      {tab==="whitespace"&&(
        <div>
          <div style={{ fontFamily:"'Lato',sans-serif",fontSize:13,color:C.dim,lineHeight:1.65,marginBottom:22 }}>
            Discover what's oversaturated in your industry and where the real opportunities for a distinctive brand voice live. Powered by AI.
          </div>
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16 }}>
            <FormRow label="Your Industry"><input className="ks-field" value={wsIndustry} onChange={e=>setWsIndustry(e.target.value)} placeholder="e.g. Executive Leadership, Tech, Finance…"/></FormRow>
            <FormRow label="Your Niche (optional)"><input className="ks-field" value={wsNiche} onChange={e=>setWsNiche(e.target.value)} placeholder="e.g. Women in Tech, Startup Founders…"/></FormRow>
          </div>
          <button className="btn-gold" onClick={runWhiteSpace} disabled={wsLoading||!wsIndustry.trim()} style={{ marginBottom:wsError?12:wsResult?28:0 }}>
            {wsLoading?<span><span className="ai-spin"/> &nbsp;Analyzing…</span>:"Find White Space"}
          </button>
          {wsError&&<div style={{ fontFamily:"'Lato',sans-serif",fontSize:12,color:"#c97a4a",marginTop:12,padding:"10px 14px",background:"rgba(200,100,80,0.06)",border:"1px solid rgba(200,100,80,0.2)" }}>{wsError}</div>}
          {wsResult&&!wsLoading&&(
            <div className="ks-in">
              <GoldRule my={24}/>
              <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16 }}>
                <div style={{ padding:"18px",background:"rgba(200,80,80,0.05)",border:"1px solid rgba(200,80,80,0.15)" }}>
                  <Label>Oversaturated — The Noise</Label>
                  {(wsResult.oversaturated||[]).map((s,i)=><div key={i} style={{ fontFamily:"'Lato',sans-serif",fontSize:12,color:"rgba(230,150,140,0.85)",padding:"5px 0",borderBottom:i<wsResult.oversaturated.length-1?"1px solid rgba(200,80,80,0.1)":"none" }}>✕ {s}</div>)}
                </div>
                <div style={{ padding:"18px",background:"rgba(100,180,100,0.05)",border:"1px solid rgba(100,180,100,0.15)" }}>
                  <Label>Emerging Conversations</Label>
                  {(wsResult.emerging||[]).map((s,i)=><div key={i} style={{ fontFamily:"'Lato',sans-serif",fontSize:12,color:"rgba(140,210,140,0.85)",padding:"5px 0",borderBottom:i<wsResult.emerging.length-1?"1px solid rgba(100,180,100,0.1)":"none" }}>↗ {s}</div>)}
                </div>
              </div>
              <div style={{ padding:"18px",background:"rgba(201,168,76,0.04)",border:`1px solid ${C.goldBorder}`,marginBottom:14 }}>
                <Label>White Space Opportunities</Label>
                {(wsResult.whiteSpace||[]).map((ws,i)=><div key={i} style={{ marginBottom:14,paddingBottom:14,borderBottom:i<wsResult.whiteSpace.length-1?`1px solid rgba(201,168,76,0.1)`:"none" }}>
                  <div style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:17,color:C.text,marginBottom:4 }}>{ws.angle}</div>
                  <div style={{ fontFamily:"'Lato',sans-serif",fontSize:12,color:C.muted,lineHeight:1.55 }}>{ws.why}</div>
                </div>)}
              </div>
              <div style={{ padding:"18px",background:"rgba(255,255,255,0.03)",border:`1px solid rgba(255,255,255,0.08)` }}>
                <Label>Contrarian Takes Worth Exploring</Label>
                {(wsResult.contrarian||[]).map((s,i)=><div key={i} style={{ fontFamily:"'Lato',sans-serif",fontSize:12,color:C.dim,padding:"5px 0",borderBottom:i<wsResult.contrarian.length-1?"1px solid rgba(255,255,255,0.05)":"none" }}>⟳ {s}</div>)}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TONE CALIBRATION */}
      {tab==="tone"&&(
        <div>
          <div style={{ fontFamily:"'Lato',sans-serif",fontSize:13,color:C.dim,lineHeight:1.65,marginBottom:24 }}>
            {isAdmin?"Calibrate how the client perceives their voice. Use this to spot misalignments between how they see themselves and how they write.":"Rate where you feel your voice naturally sits. This helps us write content that feels authentically you."}
          </div>
          {TONE_AXES.map(axis=>{
            const val=(bv.toneProfile||{})[axis.key]??50;
            return (
              <div key={axis.key} style={{ marginBottom:28 }}>
                <div style={{ display:"flex",justifyContent:"space-between",marginBottom:10 }}>
                  <span style={{ fontFamily:"'Lato',sans-serif",fontSize:12,color:val<40?C.gold:C.muted,letterSpacing:"0.06em",fontWeight:val<40?700:400 }}>{axis.left}</span>
                  <span style={{ fontFamily:"'Playfair Display',serif",fontSize:13,color:C.gold }}>{val}</span>
                  <span style={{ fontFamily:"'Lato',sans-serif",fontSize:12,color:val>60?C.gold:C.muted,letterSpacing:"0.06em",fontWeight:val>60?700:400 }}>{axis.right}</span>
                </div>
                <input type="range" min={0} max={100} value={val}
                  onChange={e=>onUpdate({...client,brandVoice:{...bv,toneProfile:{...(bv.toneProfile||{}),[axis.key]:Number(e.target.value)}}})}
                  style={{ background:`linear-gradient(to right, ${C.gold} 0%, ${C.gold} ${val}%, rgba(201,168,76,0.15) ${val}%, rgba(201,168,76,0.15) 100%)` }}
                />
              </div>
            );
          })}
          <GoldRule/>
          <div style={{ fontFamily:"'Lato',sans-serif",fontSize:12,color:C.muted,fontStyle:"italic",lineHeight:1.6 }}>
            Calibration is saved automatically. When Mikaela's sense of your voice differs from yours on any axis, that's a productive conversation to have — it usually reveals something important.
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// DOCUMENTS VIEW
// ─────────────────────────────────────────────────────────────
function DocumentsView({ client, session, onUpdate }) {
  const docs=client.documents||[];
  const [showLinkModal,setShowLinkModal]=useState(false);
  const [linkForm,setLinkForm]=useState({name:"",link:"",notes:""});
  const [uploading,setUploading]=useState(false);
  const [dragOverZone,setDragOverZone]=useState(false);
  const fileRef=useRef(null);

  const processFile=file=>{
    if(!file) return;
    if(file.size>750000){ alert("File must be under 750KB for direct upload.\nFor larger files, use 'Add External Link' to share a Google Drive or Dropbox link."); return; }
    setUploading(true);
    const reader=new FileReader();
    reader.onload=ev=>{
      const doc={id:uid(),name:file.name,size:Math.round(file.size/1024)+"KB",type:file.type,uploadedBy:session.username,uploadedAt:new Date().toISOString(),notes:"",data:ev.target.result};
      onUpdate({...client,documents:[...docs,doc]});
      setUploading(false);
    };
    reader.onerror=()=>{ alert("Error reading file."); setUploading(false); };
    reader.readAsDataURL(file);
  };

  const handleFileInput=e=>{ processFile(e.target.files[0]); e.target.value=""; };

  const handleDrop=e=>{
    e.preventDefault(); setDragOverZone(false);
    const file=e.dataTransfer.files[0];
    if(file) processFile(file);
  };

  const addLink=()=>{
    if(!linkForm.name||!linkForm.link) return;
    const doc={id:uid(),name:linkForm.name,size:"External Link",type:"link",uploadedBy:session.username,uploadedAt:new Date().toISOString(),notes:linkForm.notes,link:linkForm.link};
    onUpdate({...client,documents:[...docs,doc]});
    setLinkForm({name:"",link:"",notes:""});
    setShowLinkModal(false);
  };

  const deleteDoc=id=>onUpdate({...client,documents:docs.filter(d=>d.id!==id)});
  const openDoc=doc=>{ if(doc.link){window.open(doc.link,"_blank");}else{const a=document.createElement("a");a.href=doc.data;a.download=doc.name;a.click();} };

  const mikaelaDocs=docs.filter(d=>d.uploadedBy==="mikaela");
  const clientDocs=docs.filter(d=>d.uploadedBy!=="mikaela");
  const fileIcon=t=>t==="link"?"🔗":t?.startsWith("image")?"🖼":t==="application/pdf"?"📄":t?.includes("word")?"📝":"📎";

  return (
    <div className="ks-up">
      <SectionHeading sub="Shared files, briefs, and resources">Document Hub</SectionHeading>
      {/* Upload zone */}
      <div className={`upload-zone${dragOverZone?" drag-over":""}`}
        onDragOver={e=>{e.preventDefault();setDragOverZone(true);}}
        onDragLeave={()=>setDragOverZone(false)}
        onDrop={handleDrop}
        onClick={()=>fileRef.current?.click()}
        style={{ marginBottom:16 }}>
        <input ref={fileRef} type="file" style={{ display:"none" }} onChange={handleFileInput} disabled={uploading}/>
        <div style={{ fontSize:24,marginBottom:8,opacity:0.5 }}>⬆</div>
        <div style={{ fontFamily:"'Lato',sans-serif",fontSize:13,color:C.muted,marginBottom:4 }}>{uploading?"Uploading…":"Click to upload or drag & drop"}</div>
        <div style={{ fontFamily:"'Lato',sans-serif",fontSize:11,color:"rgba(255,255,255,0.3)" }}>Files up to 750KB · PDF, Word, images, text</div>
      </div>
      <div style={{ display:"flex",justifyContent:"flex-end",marginBottom:24 }}>
        <button className="btn-ghost" onClick={()=>setShowLinkModal(true)} style={{ fontSize:10 }}>+ Add External Link</button>
      </div>
      <Label>From Mikaela</Label>
      {mikaelaDocs.length===0?<div style={{ fontFamily:"'Lato',sans-serif",fontSize:13,color:C.muted,fontStyle:"italic",marginBottom:24,padding:"10px 0" }}>No documents shared yet.</div>:(
        <div style={{ marginBottom:24 }}>{mikaelaDocs.map(doc=><DocRow key={doc.id} doc={doc} icon={fileIcon(doc.type)} onOpen={()=>openDoc(doc)} onDelete={session.role==="admin"?()=>deleteDoc(doc.id):null}/>)}</div>
      )}
      <GoldRule/>
      <div style={{ marginTop:20 }}><Label>Your Uploads</Label></div>
      {clientDocs.length===0?<div style={{ fontFamily:"'Lato',sans-serif",fontSize:13,color:C.muted,fontStyle:"italic",padding:"10px 0" }}>No documents uploaded yet.</div>:(
        clientDocs.map(doc=><DocRow key={doc.id} doc={doc} icon={fileIcon(doc.type)} onOpen={()=>openDoc(doc)} onDelete={()=>deleteDoc(doc.id)}/>)
      )}
      {showLinkModal&&(
        <Modal title="Add External Link" onClose={()=>setShowLinkModal(false)}>
          <FormRow label="Document Name" hint="What should the file be called?"><input className="ks-field" value={linkForm.name} onChange={e=>setLinkForm(f=>({...f,name:e.target.value}))} placeholder="e.g. Brand Brief Q1 2024"/></FormRow>
          <FormRow label="URL" hint="Google Drive, Dropbox, Notion, or any link"><input className="ks-field" value={linkForm.link} onChange={e=>setLinkForm(f=>({...f,link:e.target.value}))} placeholder="https://…"/></FormRow>
          <FormRow label="Notes (optional)"><input className="ks-field" value={linkForm.notes} onChange={e=>setLinkForm(f=>({...f,notes:e.target.value}))} placeholder="Brief description…"/></FormRow>
          <div style={{ display:"flex",gap:10,marginTop:8 }}>
            <button className="btn-gold" onClick={addLink} disabled={!linkForm.name||!linkForm.link}>Add Link</button>
            <button className="btn-ghost" onClick={()=>setShowLinkModal(false)}>Cancel</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function DocRow({ doc, icon, onOpen, onDelete }) {
  return (
    <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 0",borderBottom:`1px solid rgba(255,255,255,0.05)`,gap:16 }}>
      <div style={{ flex:1 }}>
        <div style={{ fontFamily:"'Lato',sans-serif",fontSize:13,color:C.text }}>{icon} {doc.name}</div>
        <div style={{ fontFamily:"'Lato',sans-serif",fontSize:11,color:C.muted,marginTop:3 }}>{doc.size} · {fmtDate(doc.uploadedAt?.split("T")[0])} · {doc.uploadedBy==="mikaela"?"Mikaela":doc.uploadedBy}</div>
        {doc.notes&&<div style={{ fontFamily:"'Lato',sans-serif",fontSize:11,color:C.dim,fontStyle:"italic",marginTop:2 }}>{doc.notes}</div>}
      </div>
      <div style={{ display:"flex",gap:6 }}>
        <button className="btn-sm" onClick={onOpen}>{doc.type==="link"?"Open":"Download"}</button>
        {onDelete&&<button className="btn-del" onClick={onDelete}>Del</button>}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// RESULTS TIMELINE
// ─────────────────────────────────────────────────────────────
function TimelineView({ client }) {
  const typeCfg={ publication:{c:C.gold,label:"Publication",dot:"◉"},milestone:{c:C.goldL,label:"Milestone",dot:"◆"},"goal-hit":{c:"#82d082",label:"Goal Hit",dot:"▲"},note:{c:C.muted,label:"Note",dot:"◇"} };
  const events=[
    ...client.publicationLog.map(p=>({id:"pub_"+p.id,date:p.date,type:"publication",title:`${p.outlet}: ${p.title}`,description:""})),
    ...(client.milestones||[]).filter(m=>m.status==="Complete"&&m.completionDate).map(m=>({id:"ms_"+m.id,date:m.completionDate,type:"milestone",title:m.name,description:"Milestone achieved."})),
    ...(client.timelineEntries||[]),
  ].sort((a,b)=>new Date(b.date)-new Date(a.date));
  return (
    <div className="ks-up">
      <SectionHeading sub="Every win, placement, and milestone — a permanent record of momentum">Results Timeline</SectionHeading>
      {events.length===0?<EmptyState message="Your results will accumulate here as milestones are hit and pieces are placed." icon="◉"/>:(
        <div style={{ position:"relative",paddingLeft:38 }}>
          <div className="tl-line"/>
          {events.map((ev,i)=>{
            const cfg=typeCfg[ev.type]||typeCfg.note;
            return (
              <div key={ev.id} className="ks-up" style={{ position:"relative",marginBottom:24,animationDelay:`${i*0.04}s` }}>
                <div className="tl-dot" style={{ background:cfg.c,left:-22 }}/>
                <div style={{ padding:"14px 18px",background:C.surface,border:`1px solid ${C.goldBorder}` }}>
                  <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:6 }}>
                    <span style={{ fontFamily:"'Lato',sans-serif",fontSize:9,fontWeight:700,letterSpacing:"0.14em",textTransform:"uppercase",color:cfg.c }}>{cfg.dot} {cfg.label}</span>
                    <span style={{ fontFamily:"'Lato',sans-serif",fontSize:11,color:C.muted }}>{fmtDate(ev.date)}</span>
                  </div>
                  <div style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:19,color:C.text,fontWeight:400 }}>{ev.title}</div>
                  {ev.description&&<div style={{ fontFamily:"'Lato',sans-serif",fontSize:12,color:C.dim,marginTop:5,fontStyle:"italic" }}>{ev.description}</div>}
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
  const total=client.chapters.length;
  const final=client.chapters.filter(c=>c.status==="Final").length;
  const rev=client.chapters.filter(c=>c.status==="Revision").length;
  const draft=client.chapters.filter(c=>c.status==="Draft").length;
  const pct=total>0?Math.round(((final+rev*0.7+draft*0.3)/total)*100):0;
  return (
    <div className="ks-up">
      <SectionHeading>Manuscript Tracker</SectionHeading>
      {total>0&&<>
        <div style={{ display:"flex",gap:24,marginBottom:24,flexWrap:"wrap" }}>
          <Stat label="Total Chapters" value={total}/>
          <Stat label="Finalized" value={final}/>
          <Stat label="Complete" value={`${pct}%`}/>
          {client.estimatedCompletion&&<Stat label="Est. Completion" value={client.estimatedCompletion}/>}
        </div>
        <ProgressBar value={pct} trajectory="on-track"/>
        <GoldRule my={28}/>
      </>}
      {client.manuscriptNotes&&<><div style={{ fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic",fontSize:18,color:C.dim,lineHeight:1.75,marginBottom:24 }}>" {client.manuscriptNotes} "</div><GoldRule my={0}/></>}
      <div style={{ marginTop:22 }}>
        {!total?<EmptyState message="Chapter details will appear here." icon="📖"/>:(
          <table className="ks-table">
            <thead><tr><th>Chapter</th><th>Status</th><th>Due</th><th>Notes</th></tr></thead>
            <tbody>{client.chapters.map(ch=>(
              <tr key={ch.id}>
                <td style={{ color:C.text,fontFamily:"'Cormorant Garamond',serif",fontSize:15 }}>{ch.title}</td>
                <td><StatusBadge status={ch.status}/></td>
                <td style={{ color:C.muted,fontSize:12,whiteSpace:"nowrap" }}>{fmtDate(ch.dueDate)}</td>
                <td style={{ color:C.dim,fontSize:12,fontStyle:"italic",maxWidth:200 }}>{ch.notes||"—"}</td>
              </tr>
            ))}</tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// ADMIN MODALS
// ─────────────────────────────────────────────────────────────
function MeetingModal({ entry, onSave, onClose }) {
  const [form,setForm]=useState(entry||{title:"",date:todayStr(),time:"10:00 AM",description:"",agenda:"",messages:[]});
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));
  return (
    <Modal title="Schedule Meeting" onClose={onClose}>
      <FormRow label="Title"><input className="ks-field" value={form.title} onChange={e=>set("title",e.target.value)} placeholder="e.g. Monthly Strategy Call"/></FormRow>
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12 }}>
        <FormRow label="Date"><input className="ks-field" type="date" value={form.date} onChange={e=>set("date",e.target.value)}/></FormRow>
        <FormRow label="Time"><input className="ks-field" value={form.time} onChange={e=>set("time",e.target.value)} placeholder="10:00 AM"/></FormRow>
      </div>
      <FormRow label="Description / Overview"><textarea className="ks-field" rows={2} value={form.description} onChange={e=>set("description",e.target.value)} placeholder="What will you cover?"/></FormRow>
      <FormRow label="Agenda / Talking Points" hint="Visible to client — they can reference this before the call"><textarea className="ks-field" rows={3} value={form.agenda||""} onChange={e=>set("agenda",e.target.value)} placeholder="e.g. Review February results · Set Q2 content priorities · Discuss podcast strategy"/></FormRow>
      <div style={{ display:"flex",gap:10,marginTop:8 }}><button className="btn-gold" onClick={()=>onSave({...form,id:form.id||uid()})} disabled={!form.title}>Save</button><button className="btn-ghost" onClick={onClose}>Cancel</button></div>
    </Modal>
  );
}

function ContentModal({ entry, onSave, onClose }) {
  const [form,setForm]=useState(entry||{title:"",type:"LinkedIn Post",status:"In Progress",approvalStatus:"Pending Approval",revisionNotes:"",scheduledDate:"",link:"",body:"",imageUrl:""});
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));
  return (
    <Modal title={entry?"Edit Content":"Add Content"} onClose={onClose} wide>
      <FormRow label="Title"><input className="ks-field" value={form.title} onChange={e=>set("title",e.target.value)} placeholder="Content title"/></FormRow>
      <FormRow label="Type"><select className="ks-field" value={form.type} onChange={e=>set("type",e.target.value)}>{CONTENT_TYPES.map(t=><option key={t}>{t}</option>)}</select></FormRow>
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12 }}>
        <FormRow label="Status"><select className="ks-field" value={form.status} onChange={e=>set("status",e.target.value)}>{CONTENT_STATUSES.map(s=><option key={s}>{s}</option>)}</select></FormRow>
        <FormRow label="Approval"><select className="ks-field" value={form.approvalStatus} onChange={e=>set("approvalStatus",e.target.value)}>{APPROVAL_STATUSES.map(s=><option key={s}>{s}</option>)}</select></FormRow>
      </div>
      <FormRow label="Scheduled Date"><input className="ks-field" type="date" value={form.scheduledDate} onChange={e=>set("scheduledDate",e.target.value)}/></FormRow>
      <FormRow label="Published Link (optional)"><input className="ks-field" value={form.link} onChange={e=>set("link",e.target.value)} placeholder="https://…"/></FormRow>
      <FormRow label="Image URL (optional)" hint="Link to a hosted image — Google Drive, Dropbox, Imgur, etc."><input className="ks-field" value={form.imageUrl||""} onChange={e=>set("imageUrl",e.target.value)} placeholder="https://…"/></FormRow>
      <FormRow label="Content Body" hint="Full post, article, or newsletter — clients will see a Read button to expand this"><textarea className="ks-field" rows={10} value={form.body||""} onChange={e=>set("body",e.target.value)} placeholder="Paste the full post or article text here…"/></FormRow>
      <div style={{ display:"flex",gap:10,marginTop:8 }}><button className="btn-gold" onClick={()=>onSave({...form,id:form.id||uid()})}>Save</button><button className="btn-ghost" onClick={onClose}>Cancel</button></div>
    </Modal>
  );
}

function PublicationModal({ entry, onSave, onClose }) {
  const [form,setForm]=useState(entry||{outlet:"",title:"",date:"",link:""});
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));
  return (
    <Modal title={entry?"Edit Publication":"Add Publication Win"} onClose={onClose}>
      <FormRow label="Outlet"><input className="ks-field" value={form.outlet} onChange={e=>set("outlet",e.target.value)} placeholder="Forbes, Inc., HBR…"/></FormRow>
      <FormRow label="Article Title"><input className="ks-field" value={form.title} onChange={e=>set("title",e.target.value)} placeholder="Article title"/></FormRow>
      <FormRow label="Date"><input className="ks-field" type="date" value={form.date} onChange={e=>set("date",e.target.value)}/></FormRow>
      <FormRow label="Link"><input className="ks-field" value={form.link} onChange={e=>set("link",e.target.value)} placeholder="https://…"/></FormRow>
      <div style={{ display:"flex",gap:10,marginTop:8 }}><button className="btn-gold" onClick={()=>onSave({...form,id:form.id||uid()})}>Save</button><button className="btn-ghost" onClick={onClose}>Cancel</button></div>
    </Modal>
  );
}

function MilestoneModal({ entry, onSave, onClose }) {
  const [form,setForm]=useState(entry||{name:"",status:"Not Started",completionDate:""});
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));
  return (
    <Modal title={entry?"Edit Milestone":"Add Milestone"} onClose={onClose}>
      <FormRow label="Milestone Name"><input className="ks-field" value={form.name} onChange={e=>set("name",e.target.value)} placeholder="e.g. First Forbes Placement"/></FormRow>
      <FormRow label="Status"><select className="ks-field" value={form.status} onChange={e=>set("status",e.target.value)}>{MILESTONE_STATUSES.map(s=><option key={s}>{s}</option>)}</select></FormRow>
      <FormRow label="Completion Date"><input className="ks-field" type="date" value={form.completionDate} onChange={e=>set("completionDate",e.target.value)}/></FormRow>
      <div style={{ display:"flex",gap:10,marginTop:8 }}><button className="btn-gold" onClick={()=>onSave({...form,id:form.id||uid()})}>Save</button><button className="btn-ghost" onClick={onClose}>Cancel</button></div>
    </Modal>
  );
}

function GoalModal({ entry, onSave, onClose }) {
  const [form,setForm]=useState(entry||{name:"",period:"90day",progress:0,trajectory:"on-track"});
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));
  return (
    <Modal title={entry?"Edit Goal":"Add Goal"} onClose={onClose}>
      <FormRow label="Goal"><input className="ks-field" value={form.name} onChange={e=>set("name",e.target.value)} placeholder="e.g. LinkedIn: 15K Followers"/></FormRow>
      <FormRow label="Timeframe"><select className="ks-field" value={form.period} onChange={e=>set("period",e.target.value)}><option value="90day">90-Day</option><option value="6month">6-Month</option><option value="12month">12-Month</option></select></FormRow>
      <FormRow label={`Progress: ${form.progress}%`}><input type="range" min={0} max={100} value={form.progress} onChange={e=>set("progress",Number(e.target.value))}/></FormRow>
      <FormRow label="Trajectory"><select className="ks-field" value={form.trajectory} onChange={e=>set("trajectory",e.target.value)}>{GOAL_TRAJECTORIES.map(t=><option key={t} value={t}>{t}</option>)}</select></FormRow>
      <div style={{ display:"flex",gap:10,marginTop:8 }}><button className="btn-gold" onClick={()=>onSave({...form,id:form.id||uid()})}>Save</button><button className="btn-ghost" onClick={onClose}>Cancel</button></div>
    </Modal>
  );
}

function ChapterModal({ entry, onSave, onClose }) {
  const [form,setForm]=useState(entry||{title:"",status:"Outline",notes:"",dueDate:""});
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));
  return (
    <Modal title={entry?"Edit Chapter":"Add Chapter"} onClose={onClose}>
      <FormRow label="Chapter Title"><input className="ks-field" value={form.title} onChange={e=>set("title",e.target.value)} placeholder="e.g. Chapter 1: The Beginning"/></FormRow>
      <FormRow label="Status"><select className="ks-field" value={form.status} onChange={e=>set("status",e.target.value)}>{CHAPTER_STATUSES.map(s=><option key={s}>{s}</option>)}</select></FormRow>
      <FormRow label="Due Date"><input className="ks-field" type="date" value={form.dueDate} onChange={e=>set("dueDate",e.target.value)}/></FormRow>
      <FormRow label="Notes for Client"><textarea className="ks-field" value={form.notes} onChange={e=>set("notes",e.target.value)} placeholder="Notes visible to client…"/></FormRow>
      <div style={{ display:"flex",gap:10,marginTop:8 }}><button className="btn-gold" onClick={()=>onSave({...form,id:form.id||uid()})}>Save</button><button className="btn-ghost" onClick={onClose}>Cancel</button></div>
    </Modal>
  );
}

function LinkedInModal({ onSave, onClose }) {
  const [form,setForm]=useState({date:todayStr(),followers:"",impressions:"",profileViews:"",engagementRate:"",topPost:""});
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));
  return (
    <Modal title="Update LinkedIn Stats" onClose={onClose}>
      <div style={{ fontFamily:"'Lato',sans-serif",fontSize:11,color:C.muted,marginBottom:18,fontStyle:"italic" }}>Pull these numbers from LinkedIn Analytics — takes about 2 minutes.</div>
      <FormRow label="Date of Stats"><input className="ks-field" type="date" value={form.date} onChange={e=>set("date",e.target.value)}/></FormRow>
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12 }}>
        <FormRow label="Followers"><input className="ks-field" value={form.followers} onChange={e=>set("followers",e.target.value)} placeholder="10,200"/></FormRow>
        <FormRow label="Impressions"><input className="ks-field" value={form.impressions} onChange={e=>set("impressions",e.target.value)} placeholder="89,000"/></FormRow>
        <FormRow label="Profile Views"><input className="ks-field" value={form.profileViews} onChange={e=>set("profileViews",e.target.value)} placeholder="4,200"/></FormRow>
        <FormRow label="Engagement Rate %"><input className="ks-field" value={form.engagementRate} onChange={e=>set("engagementRate",e.target.value)} placeholder="6.8"/></FormRow>
      </div>
      <FormRow label="Top Performing Post"><input className="ks-field" value={form.topPost} onChange={e=>set("topPost",e.target.value)} placeholder="Post title or first line…"/></FormRow>
      <div style={{ display:"flex",gap:10,marginTop:8 }}><button className="btn-gold" onClick={()=>onSave({...form,id:uid(),followers:Number(form.followers)||0,impressions:Number(form.impressions)||0,profileViews:Number(form.profileViews)||0})}>Save Stats</button><button className="btn-ghost" onClick={onClose}>Cancel</button></div>
    </Modal>
  );
}

function AIQueryModal({ entry, onSave, onClose }) {
  const [form,setForm]=useState(entry||{query:"",appears:false,platforms:[],notes:""});
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));
  const toggleP=p=>set("platforms",form.platforms.includes(p)?form.platforms.filter(x=>x!==p):[...form.platforms,p]);
  return (
    <Modal title={entry?"Edit Query":"Add Tracked Query"} onClose={onClose}>
      <FormRow label='Query (what someone might ask AI)'><input className="ks-field" value={form.query} onChange={e=>set("query",e.target.value)} placeholder='"Top women in tech to follow"'/></FormRow>
      <FormRow label="Appearing?">
        <div style={{ display:"flex",gap:10 }}>
          {[true,false].map(v=><button key={String(v)} onClick={()=>set("appears",v)} className={form.appears===v?"btn-gold":"btn-ghost"} style={{ padding:"8px 18px",fontSize:11 }}>{v?"Yes":"Not Yet"}</button>)}
        </div>
      </FormRow>
      {form.appears&&<FormRow label="Which Platforms?"><div style={{ display:"flex",gap:8,flexWrap:"wrap" }}>{AI_PLATFORMS.map(p=><button key={p} onClick={()=>toggleP(p)} style={{ background:form.platforms.includes(p)?"rgba(201,168,76,0.15)":"transparent",border:`1px solid ${form.platforms.includes(p)?C.gold:"rgba(201,168,76,0.2)"}`,color:form.platforms.includes(p)?C.gold:C.muted,fontFamily:"'Lato',sans-serif",fontSize:11,padding:"6px 12px",cursor:"pointer",transition:"all 0.15s" }}>{p}</button>)}</div></FormRow>}
      <FormRow label="Notes"><input className="ks-field" value={form.notes} onChange={e=>set("notes",e.target.value)} placeholder="Context or next steps…"/></FormRow>
      <div style={{ display:"flex",gap:10,marginTop:8 }}><button className="btn-gold" onClick={()=>onSave({...form,id:form.id||uid()})}>Save</button><button className="btn-ghost" onClick={onClose}>Cancel</button></div>
    </Modal>
  );
}

function TimelineEntryModal({ onSave, onClose }) {
  const [form,setForm]=useState({date:todayStr(),type:"note",title:"",description:""});
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));
  return (
    <Modal title="Add Timeline Entry" onClose={onClose}>
      <FormRow label="Date"><input className="ks-field" type="date" value={form.date} onChange={e=>set("date",e.target.value)}/></FormRow>
      <FormRow label="Type"><select className="ks-field" value={form.type} onChange={e=>set("type",e.target.value)}><option value="publication">Publication</option><option value="milestone">Milestone</option><option value="goal-hit">Goal Hit</option><option value="note">Note</option></select></FormRow>
      <FormRow label="Title"><input className="ks-field" value={form.title} onChange={e=>set("title",e.target.value)} placeholder="What happened?"/></FormRow>
      <FormRow label="Details (optional)"><textarea className="ks-field" rows={2} value={form.description} onChange={e=>set("description",e.target.value)}/></FormRow>
      <div style={{ display:"flex",gap:10,marginTop:8 }}><button className="btn-gold" onClick={()=>onSave({...form,id:uid()})}>Add</button><button className="btn-ghost" onClick={onClose}>Cancel</button></div>
    </Modal>
  );
}

function AddClientModal({ users, onSave, onClose }) {
  const [form,setForm]=useState({name:"",username:"",password:"portal123",tier:"foundation"});
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));
  const exists=users.some(u=>u.username===form.username.toLowerCase().trim());
  return (
    <Modal title="Add New Client" onClose={onClose}>
      <FormRow label="Full Name"><input className="ks-field" value={form.name} onChange={e=>set("name",e.target.value)} placeholder="Client Name"/></FormRow>
      <FormRow label="Username"><input className="ks-field" value={form.username} onChange={e=>set("username",e.target.value.toLowerCase().replace(/\s/g,"."))} placeholder="first.last"/>{exists&&<div style={{ color:"#c97070",fontSize:11,marginTop:4,fontFamily:"'Lato',sans-serif" }}>Username already exists</div>}</FormRow>
      <FormRow label="Password"><input className="ks-field" value={form.password} onChange={e=>set("password",e.target.value)}/></FormRow>
      <FormRow label="Service Tier"><select className="ks-field" value={form.tier} onChange={e=>set("tier",e.target.value)}>{TIERS.map(t=><option key={t} value={t}>{TIER_LABELS[t]}</option>)}</select></FormRow>
      <div style={{ display:"flex",gap:10,marginTop:8 }}><button className="btn-gold" disabled={!form.name||!form.username||exists} onClick={()=>onSave(form)}>Add Client</button><button className="btn-ghost" onClick={onClose}>Cancel</button></div>
    </Modal>
  );
}

// ─────────────────────────────────────────────────────────────
// ADMIN CLIENT EDITOR
// ─────────────────────────────────────────────────────────────
function AdminClientEditor({ client, users, onUpdate, activeSection, onSectionChange, apiKey }) {
  const [modal,setModal]=useState(null);
  const [editItem,setEditItem]=useState(null);
  const [saved,setSaved]=useState(false);

  const update=useCallback(patch=>{
    onUpdate({...client,...patch});
    setSaved(true); setTimeout(()=>setSaved(false),1800);
  },[client,onUpdate]);

  // ── Content ──
  const ContentSection=()=>(
    <div>
      <div style={{ display:"flex",justifyContent:"flex-end",marginBottom:16 }}><button className="btn-ghost" onClick={()=>{setEditItem(null);setModal("content");}}>+ Add Entry</button></div>
      {!client.contentCalendar.length?<EmptyState message="No content entries yet." icon="◈"/>:(
        <table className="ks-table">
          <thead><tr><th>Title</th><th>Status</th><th>Approval</th><th>Date</th><th></th></tr></thead>
          <tbody>{client.contentCalendar.map(item=>(
            <tr key={item.id}>
              <td style={{ maxWidth:200 }}>{item.title}</td>
              <td><StatusBadge status={item.status}/></td>
              <td><StatusBadge status={item.approvalStatus||"Pending Approval"}/></td>
              <td style={{ color:C.muted,fontSize:12 }}>{fmtDate(item.scheduledDate)}</td>
              <td><div style={{ display:"flex",gap:6 }}><button className="btn-sm" onClick={()=>{setEditItem(item);setModal("content");}}>Edit</button><button className="btn-del" onClick={()=>update({contentCalendar:client.contentCalendar.filter(i=>i.id!==item.id)})}>Del</button></div></td>
            </tr>
          ))}</tbody>
        </table>
      )}
      {modal==="content"&&<ContentModal entry={editItem} onClose={()=>{setModal(null);setEditItem(null);}} onSave={s=>{update({contentCalendar:editItem?client.contentCalendar.map(i=>i.id===s.id?s:i):[...client.contentCalendar,s]});setModal(null);setEditItem(null);}}/>}
    </div>
  );

  // ── Calendar ──
  const CalendarSection=()=><CalendarView client={client} isAdmin={true} session={{ username:"mikaela",role:"admin" }} onUpdate={onUpdate}/>;

  // ── Report ──
  const ReportSection=()=>{
    const [form,setForm]=useState({...client.performanceReport});
    const set=(k,v)=>setForm(f=>({...f,[k]:v}));
    return (
      <div>
        <FormRow label="Period"><input className="ks-field" value={form.period} onChange={e=>set("period",e.target.value)} placeholder="February 2024"/></FormRow>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12 }}>
          <FormRow label="Engagement"><input className="ks-field" value={form.engagement} onChange={e=>set("engagement",e.target.value)} placeholder="14.2K"/></FormRow>
          <FormRow label="Reach"><input className="ks-field" value={form.reach} onChange={e=>set("reach",e.target.value)} placeholder="89K"/></FormRow>
          <FormRow label="Placements"><input className="ks-field" value={form.placements} onChange={e=>set("placements",e.target.value)} placeholder="3"/></FormRow>
        </div>
        <FormRow label="Summary"><textarea className="ks-field" rows={5} value={form.summary} onChange={e=>set("summary",e.target.value)}/></FormRow>
        <button className="btn-gold" onClick={()=>update({performanceReport:form})}>Save Report</button>
      </div>
    );
  };

  // ── LinkedIn ──
  const LinkedInSection=()=>{
    const stats=[...(client.linkedInStats||[])].sort((a,b)=>new Date(b.date)-new Date(a.date));
    return (
      <div>
        <div style={{ display:"flex",justifyContent:"flex-end",marginBottom:16 }}><button className="btn-ghost" onClick={()=>setModal("linkedin")}>+ Update Stats</button></div>
        {!stats.length?<EmptyState message="No LinkedIn stats yet." icon="📊"/>:(
          <table className="ks-table">
            <thead><tr><th>Date</th><th>Followers</th><th>Impressions</th><th>Views</th><th>Eng %</th><th></th></tr></thead>
            <tbody>{stats.map(s=>(
              <tr key={s.id}>
                <td style={{ color:C.muted,fontSize:12 }}>{fmtDate(s.date)}</td>
                <td>{s.followers?.toLocaleString()}</td>
                <td>{s.impressions?.toLocaleString()}</td>
                <td>{s.profileViews?.toLocaleString()}</td>
                <td>{s.engagementRate}%</td>
                <td><button className="btn-del" onClick={()=>update({linkedInStats:(client.linkedInStats||[]).filter(x=>x.id!==s.id)})}>Del</button></td>
              </tr>
            ))}</tbody>
          </table>
        )}
        {modal==="linkedin"&&<LinkedInModal onClose={()=>setModal(null)} onSave={s=>{update({linkedInStats:[...(client.linkedInStats||[]),s]});setModal(null);}}/>}
      </div>
    );
  };

  // ── Publications ──
  const PubsSection=()=>(
    <div>
      <div style={{ display:"flex",justifyContent:"flex-end",marginBottom:16 }}><button className="btn-ghost" onClick={()=>{setEditItem(null);setModal("pub");}}>+ Add Publication Win</button></div>
      {!client.publicationLog.length?<EmptyState message="No publications yet." icon="◉"/>:(
        <table className="ks-table">
          <thead><tr><th>Outlet</th><th>Title</th><th>Date</th><th></th></tr></thead>
          <tbody>{client.publicationLog.map(p=>(
            <tr key={p.id}>
              <td style={{ color:C.gold,fontWeight:700,fontSize:12 }}>{p.outlet}</td>
              <td>{p.title}</td>
              <td style={{ color:C.muted,fontSize:12 }}>{fmtDate(p.date)}</td>
              <td><div style={{ display:"flex",gap:6 }}><button className="btn-sm" onClick={()=>{setEditItem(p);setModal("pub");}}>Edit</button><button className="btn-del" onClick={()=>update({publicationLog:client.publicationLog.filter(i=>i.id!==p.id)})}>Del</button></div></td>
            </tr>
          ))}</tbody>
        </table>
      )}
      {modal==="pub"&&<PublicationModal entry={editItem} onClose={()=>{setModal(null);setEditItem(null);}} onSave={s=>{update({publicationLog:editItem?client.publicationLog.map(i=>i.id===s.id?s:i):[...client.publicationLog,s]});setModal(null);setEditItem(null);}}/>}
    </div>
  );

  // ── Milestones ──
  const MilestonesSection=()=>(
    <div>
      <div style={{ display:"flex",justifyContent:"flex-end",marginBottom:16 }}><button className="btn-ghost" onClick={()=>{setEditItem(null);setModal("milestone");}}>+ Add Milestone</button></div>
      {!client.milestones.length?<EmptyState message="No milestones yet."/>:(
        <table className="ks-table">
          <thead><tr><th>Milestone</th><th>Status</th><th>Completed</th><th></th></tr></thead>
          <tbody>{client.milestones.map(m=>(
            <tr key={m.id}>
              <td>{m.name}</td><td><StatusBadge status={m.status}/></td>
              <td style={{ color:C.muted,fontSize:12 }}>{fmtDate(m.completionDate)}</td>
              <td><div style={{ display:"flex",gap:6 }}><button className="btn-sm" onClick={()=>{setEditItem(m);setModal("milestone");}}>Edit</button><button className="btn-del" onClick={()=>update({milestones:client.milestones.filter(i=>i.id!==m.id)})}>Del</button></div></td>
            </tr>
          ))}</tbody>
        </table>
      )}
      {modal==="milestone"&&<MilestoneModal entry={editItem} onClose={()=>{setModal(null);setEditItem(null);}} onSave={s=>{update({milestones:editItem?client.milestones.map(i=>i.id===s.id?s:i):[...client.milestones,s]});setModal(null);setEditItem(null);}}/>}
    </div>
  );

  // ── Strategy Map ──
  const StrategySection=()=>{
    const sm=client.strategyMap||{phases:[],goals:[]};
    return (
      <div>
        <div style={{ fontFamily:"'Lato',sans-serif",fontSize:11,color:C.muted,marginBottom:20,fontStyle:"italic" }}>Edit the three phases below, then add goals with progress tracking.</div>
        {sm.phases?.map((phase,i)=>{
          const statusOptions=[{v:"complete",l:"Complete"},{v:"active",l:"Active"},{v:"upcoming",l:"Upcoming"},{v:"future",l:"Future"}];
          return (
            <div key={phase.id} style={{ padding:"16px",background:"rgba(255,255,255,0.03)",border:`1px solid rgba(255,255,255,0.07)`,marginBottom:10 }}>
              <div style={{ display:"grid",gridTemplateColumns:"1fr auto",gap:12,marginBottom:10 }}>
                <input className="ks-field" value={phase.name} onChange={e=>update({strategyMap:{...sm,phases:sm.phases.map((p,j)=>j===i?{...p,name:e.target.value}:p)}})} placeholder="Phase name"/>
                <select className="ks-field" value={phase.status} onChange={e=>update({strategyMap:{...sm,phases:sm.phases.map((p,j)=>j===i?{...p,status:e.target.value}:p)}})} style={{ width:120 }}>
                  {statusOptions.map(o=><option key={o.v} value={o.v}>{o.l}</option>)}
                </select>
              </div>
              <textarea className="ks-field" rows={2} value={phase.description} onChange={e=>update({strategyMap:{...sm,phases:sm.phases.map((p,j)=>j===i?{...p,description:e.target.value}:p)}})} placeholder="Phase description…"/>
            </div>
          );
        })}
        <GoldRule my={20}/>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16 }}>
          <Label>Goals</Label>
          <button className="btn-ghost" onClick={()=>{setEditItem(null);setModal("goal");}}>+ Add Goal</button>
        </div>
        {!(sm.goals?.length)?<EmptyState message="No goals yet."/>:(
          <table className="ks-table">
            <thead><tr><th>Goal</th><th>Period</th><th>Progress</th><th>Trajectory</th><th></th></tr></thead>
            <tbody>{sm.goals.map(g=>(
              <tr key={g.id}>
                <td>{g.name}</td>
                <td style={{ color:C.muted,fontSize:12 }}>{g.period}</td>
                <td><span style={{ fontFamily:"'Playfair Display',serif",color:C.gold,fontSize:14 }}>{g.progress}%</span></td>
                <td><TrajectoryTag trajectory={g.trajectory}/></td>
                <td><div style={{ display:"flex",gap:6 }}><button className="btn-sm" onClick={()=>{setEditItem(g);setModal("goal");}}>Edit</button><button className="btn-del" onClick={()=>update({strategyMap:{...sm,goals:sm.goals.filter(x=>x.id!==g.id)}})}>Del</button></div></td>
              </tr>
            ))}</tbody>
          </table>
        )}
        {modal==="goal"&&<GoalModal entry={editItem} onClose={()=>{setModal(null);setEditItem(null);}} onSave={s=>{update({strategyMap:{...sm,goals:editItem?sm.goals.map(x=>x.id===s.id?s:x):[...(sm.goals||[]),s]}});setModal(null);setEditItem(null);}}/>}
      </div>
    );
  };

  // ── AI Visibility ──
  const AISection=()=>{
    const av=client.aiVisibility||{score:0,lastUpdated:"",queries:[],suggestions:[]};
    const [score,setScore]=useState(av.score||0);
    const [sugg,setSugg]=useState((av.suggestions||[]).join("\n"));
    return (
      <div>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:20 }}>
          <FormRow label={`Visibility Score: ${score}/100`}><input type="range" min={0} max={100} value={score} onChange={e=>setScore(Number(e.target.value))}/></FormRow>
          <FormRow label="Last Updated"><input className="ks-field" type="date" defaultValue={av.lastUpdated} onChange={e=>update({aiVisibility:{...av,lastUpdated:e.target.value}})}/></FormRow>
        </div>
        <FormRow label="Recommendations (one per line)"><textarea className="ks-field" rows={4} value={sugg} onChange={e=>setSugg(e.target.value)}/></FormRow>
        <button className="btn-gold" onClick={()=>update({aiVisibility:{...av,score,suggestions:sugg.split("\n").filter(s=>s.trim())}})} style={{ marginBottom:24 }}>Save</button>
        <GoldRule/>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",margin:"20px 0 16px" }}>
          <Label>Tracked Queries</Label>
          <button className="btn-ghost" onClick={()=>{setEditItem(null);setModal("query");}}>+ Add Query</button>
        </div>
        {!av.queries?.length?<EmptyState message="No queries tracked yet."/>:(
          <table className="ks-table">
            <thead><tr><th>Query</th><th>Appears</th><th>Platforms</th><th></th></tr></thead>
            <tbody>{av.queries.map(q=>(
              <tr key={q.id}>
                <td style={{ maxWidth:220 }}>"{q.query}"</td>
                <td style={{ color:q.appears?"#82d082":"#c97a4a",fontSize:12 }}>{q.appears?"Yes":"No"}</td>
                <td style={{ color:C.muted,fontSize:12 }}>{q.platforms?.join(", ")||"—"}</td>
                <td><div style={{ display:"flex",gap:6 }}><button className="btn-sm" onClick={()=>{setEditItem(q);setModal("query");}}>Edit</button><button className="btn-del" onClick={()=>update({aiVisibility:{...av,queries:av.queries.filter(x=>x.id!==q.id)}})}>Del</button></div></td>
              </tr>
            ))}</tbody>
          </table>
        )}
        {modal==="query"&&<AIQueryModal entry={editItem} onClose={()=>{setModal(null);setEditItem(null);}} onSave={s=>{update({aiVisibility:{...av,queries:editItem?av.queries.map(q=>q.id===s.id?s:q):[...(av.queries||[]),s]}});setModal(null);setEditItem(null);}}/>}
      </div>
    );
  };

  // ── Manuscript ──
  const ManuscriptSection=()=>{
    const [mNotes,setMNotes]=useState(client.manuscriptNotes||"");
    const [mEst,setMEst]=useState(client.estimatedCompletion||"");
    return (
      <div>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:4 }}>
          <FormRow label="Estimated Completion"><input className="ks-field" value={mEst} onChange={e=>setMEst(e.target.value)} placeholder="e.g. May 2024"/></FormRow>
        </div>
        <FormRow label="Overall Notes"><textarea className="ks-field" rows={3} value={mNotes} onChange={e=>setMNotes(e.target.value)}/></FormRow>
        <button className="btn-gold" onClick={()=>update({manuscriptNotes:mNotes,estimatedCompletion:mEst})} style={{ marginBottom:24 }}>Save Notes</button>
        <GoldRule/>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",margin:"20px 0 16px" }}>
          <Label>Chapters</Label>
          <button className="btn-ghost" onClick={()=>{setEditItem(null);setModal("chapter");}}>+ Add Chapter</button>
        </div>
        {!client.chapters?.length?<EmptyState message="No chapters yet."/>:(
          <table className="ks-table">
            <thead><tr><th>Chapter</th><th>Status</th><th>Due</th><th></th></tr></thead>
            <tbody>{client.chapters.map(ch=>(
              <tr key={ch.id}>
                <td style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:15 }}>{ch.title}</td>
                <td><StatusBadge status={ch.status}/></td>
                <td style={{ color:C.muted,fontSize:12 }}>{fmtDate(ch.dueDate)}</td>
                <td><div style={{ display:"flex",gap:6 }}><button className="btn-sm" onClick={()=>{setEditItem(ch);setModal("chapter");}}>Edit</button><button className="btn-del" onClick={()=>update({chapters:client.chapters.filter(i=>i.id!==ch.id)})}>Del</button></div></td>
              </tr>
            ))}</tbody>
          </table>
        )}
        {modal==="chapter"&&<ChapterModal entry={editItem} onClose={()=>{setModal(null);setEditItem(null);}} onSave={s=>{update({chapters:editItem?client.chapters.map(i=>i.id===s.id?s:i):[...(client.chapters||[]),s]});setModal(null);setEditItem(null);}}/>}
      </div>
    );
  };

  // ── Timeline ──
  const TimelineSection=()=>(
    <div>
      <div style={{ fontFamily:"'Lato',sans-serif",fontSize:11,color:C.muted,marginBottom:16,fontStyle:"italic" }}>Publications and milestones appear automatically. Add manual highlights below.</div>
      <div style={{ display:"flex",justifyContent:"flex-end",marginBottom:16 }}><button className="btn-ghost" onClick={()=>setModal("timeline")}>+ Add Entry</button></div>
      {!(client.timelineEntries?.length)?<EmptyState message="No manual entries yet."/>:(
        <table className="ks-table">
          <thead><tr><th>Date</th><th>Type</th><th>Title</th><th></th></tr></thead>
          <tbody>{[...(client.timelineEntries||[])].sort((a,b)=>new Date(b.date)-new Date(a.date)).map(e=>(
            <tr key={e.id}>
              <td style={{ color:C.muted,fontSize:12 }}>{fmtDate(e.date)}</td>
              <td style={{ color:C.muted,fontSize:11,textTransform:"capitalize" }}>{e.type}</td>
              <td>{e.title}</td>
              <td><button className="btn-del" onClick={()=>update({timelineEntries:(client.timelineEntries||[]).filter(x=>x.id!==e.id)})}>Del</button></td>
            </tr>
          ))}</tbody>
        </table>
      )}
      {modal==="timeline"&&<TimelineEntryModal onClose={()=>setModal(null)} onSave={s=>{update({timelineEntries:[...(client.timelineEntries||[]),s]});setModal(null);}}/>}
    </div>
  );

  // ── Admin Notes ──
  const AdminNotesSection=()=>{
    const [notes,setNotes]=useState(client.adminNotes||"");
    return (
      <div>
        <div style={{ fontFamily:"'Lato',sans-serif",fontSize:11,color:C.muted,marginBottom:18,fontStyle:"italic" }}>Private notes — only visible to you. Never shown to the client.</div>
        <FormRow label="Notes"><textarea className="ks-field" rows={10} value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Relationship context, things to remember before calls, personal details, strategic observations…"/></FormRow>
        <button className="btn-gold" onClick={()=>update({adminNotes:notes})}>Save Notes</button>
      </div>
    );
  };

  // ── Direct Messages ──
  const MessagesSection=()=><DirectMessagesView client={client} session={{ username:"mikaela",role:"admin" }} onUpdate={onUpdate}/>;

  // ── Media Playbook (admin edit) ──
  const PlaybookSection=()=>{
    const pb=client.mediaPlaybook||{sections:[]};
    const [editSec,setEditSec]=useState(null);
    const [form,setForm]=useState({title:"",content:""});
    const openEdit=s=>{ setEditSec(s?.id||"new"); setForm(s?{title:s.title,content:s.content}:{title:"",content:""}); };
    const saveSec=()=>{
      if(!form.title.trim()) return;
      const s={...form,id:editSec==="new"?uid():editSec};
      const sections=editSec==="new"?[...pb.sections,s]:pb.sections.map(x=>x.id===editSec?s:x);
      update({mediaPlaybook:{...pb,sections}});
      setEditSec(null);
    };
    return (
      <div>
        <div style={{ fontFamily:"'Lato',sans-serif",fontSize:11,color:C.muted,marginBottom:16,fontStyle:"italic" }}>Write guidance for your client to reference when media situations arise. They see this in an accordion — each section expands on click.</div>
        <div style={{ display:"flex",justifyContent:"flex-end",marginBottom:20 }}><button className="btn-ghost" onClick={()=>openEdit(null)}>+ Add Section</button></div>
        {!pb.sections.length?<EmptyState message="No playbook sections yet." icon="◎"/>:(
          pb.sections.map(s=>(
            <div key={s.id} style={{ padding:"14px 18px",background:C.surface,border:`1px solid ${C.goldBorder}`,marginBottom:8,display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:16 }}>
              <div style={{ flex:1 }}>
                <div style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:17,color:C.text,marginBottom:4 }}>{s.title}</div>
                <div style={{ fontFamily:"'Lato',sans-serif",fontSize:12,color:C.muted,lineHeight:1.55,whiteSpace:"pre-wrap" }}>{s.content.length>120?s.content.slice(0,120)+"…":s.content}</div>
              </div>
              <div style={{ display:"flex",gap:6,flexShrink:0 }}>
                <button className="btn-sm" onClick={()=>openEdit(s)}>Edit</button>
                <button className="btn-del" onClick={()=>update({mediaPlaybook:{...pb,sections:pb.sections.filter(x=>x.id!==s.id)}})}>Del</button>
              </div>
            </div>
          ))
        )}
        {editSec&&(
          <Modal title={editSec==="new"?"Add Playbook Section":"Edit Playbook Section"} onClose={()=>setEditSec(null)} wide>
            <FormRow label="Section Title"><input className="ks-field" value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} placeholder="e.g. If a journalist contacts you"/></FormRow>
            <FormRow label="Guidance" hint="Write clearly and directly. The client will read this under pressure."><textarea className="ks-field" rows={10} value={form.content} onChange={e=>setForm(f=>({...f,content:e.target.value}))} placeholder="What should they do? What should they say?"/></FormRow>
            <div style={{ display:"flex",gap:10,marginTop:8 }}><button className="btn-gold" onClick={saveSec} disabled={!form.title.trim()}>Save</button><button className="btn-ghost" onClick={()=>setEditSec(null)}>Cancel</button></div>
          </Modal>
        )}
      </div>
    );
  };

  // ── Welcome Message ──
  const WelcomeSection=()=>{
    const [msg,setMsg]=useState(client.welcomeMessage||"");
    return (
      <div>
        <div style={{ fontFamily:"'Lato',sans-serif",fontSize:11,color:C.muted,marginBottom:18,fontStyle:"italic" }}>This message appears at the top of the client's home screen. Make it personal.</div>
        <FormRow label="Welcome Message" hint="Write in first person. The portal signs it '— Mikaela' automatically."><textarea className="ks-field" rows={5} value={msg} onChange={e=>setMsg(e.target.value)} placeholder="Write something personal and specific to this client's journey…"/></FormRow>
        {msg&&<div style={{ padding:"16px 20px",background:"rgba(201,168,76,0.05)",border:`1px solid rgba(201,168,76,0.15)`,marginBottom:18 }}>
          <div style={{ fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic",fontSize:17,color:C.dim,lineHeight:1.8 }}>"{msg}"</div>
          <div style={{ fontFamily:"'Lato',sans-serif",fontSize:11,fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",color:C.gold,marginTop:10 }}>— Mikaela</div>
        </div>}
        <button className="btn-gold" onClick={()=>update({welcomeMessage:msg})}>Save Message</button>
      </div>
    );
  };

  // ── Settings ──
  const SettingsSection=()=>{
    const [form,setForm]=useState({name:client.name,tier:client.tier});
    const set=(k,v)=>setForm(f=>({...f,[k]:v}));
    return (
      <div>
        <FormRow label="Client Name"><input className="ks-field" value={form.name} onChange={e=>set("name",e.target.value)}/></FormRow>
        <FormRow label="Service Tier"><select className="ks-field" value={form.tier} onChange={e=>set("tier",e.target.value)}>{TIERS.map(t=><option key={t} value={t}>{TIER_LABELS[t]}</option>)}</select></FormRow>
        <button className="btn-gold" onClick={()=>update({name:form.name,tier:form.tier})}>Save Settings</button>
      </div>
    );
  };

  const sections={ content:<ContentSection/>,calendar:<CalendarSection/>,report:<ReportSection/>,linkedin:<LinkedInSection/>,publications:<PubsSection/>,milestones:<MilestonesSection/>,strategy:<StrategySection/>,ai:<AISection/>,manuscript:<ManuscriptSection/>,timeline:<TimelineSection/>,voice:<BrandVoiceView client={client} isAdmin={true} onUpdate={onUpdate} apiKey={apiKey}/>,documents:<DocumentsView client={client} session={{ username:"mikaela",role:"admin" }} onUpdate={onUpdate}/>,messages:<MessagesSection/>,playbook:<PlaybookSection/>,welcome:<WelcomeSection/>,notes:<AdminNotesSection/>,settings:<SettingsSection/> };

  return (
    <div className="ks-in" style={{ padding:"44px 52px",maxWidth:880 }}>
      <div style={{ display:"flex",alignItems:"center",gap:16,marginBottom:5 }}>
        <h1 style={{ fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic",fontSize:32,fontWeight:400,color:C.white }}>{client.name}</h1>
        <TierChip tier={client.tier}/>
        {saved&&<span style={{ fontFamily:"'Lato',sans-serif",fontSize:10,color:C.gold,letterSpacing:"0.1em" }}>✓ Saved</span>}
      </div>
      <div style={{ fontFamily:"'Lato',sans-serif",fontSize:11,color:C.muted,marginBottom:28 }}>@{client.username} · Since {fmtDate(client.joinDate)}</div>
      <GoldRule my={0}/>
      <div style={{ marginTop:28 }}>{sections[activeSection]||<ContentSection/>}</div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// CLIENT DASHBOARD
// ─────────────────────────────────────────────────────────────
function ClientDashboard({ client, session, onLogout, onUpdate, apiKey }) {
  const [view,setView]=useState("home");
  const [mobOpen,setMobOpen]=useState(false);
  const [newSince,setNewSince]=useState({content:0,docs:0,messages:0});
  const branding=isBranding(client.tier);
  const manuscript=isManuscript(client.tier);
  const authority=hasAuthority(client.tier);
  const influence=hasInfluence(client.tier);

  useEffect(()=>{
    try {
      const key=`ks-lastvisit-${client.id}`;
      const last=localStorage.getItem(key);
      if(last){
        const t=new Date(last);
        const nc=client.contentCalendar.filter(i=>i.addedAt&&new Date(i.addedAt)>t).length;
        const nd=(client.documents||[]).filter(d=>d.uploadedBy==="mikaela"&&d.uploadedAt&&new Date(d.uploadedAt)>t).length;
        const nm=(client.directMessages||[]).filter(m=>m.from==="mikaela"&&new Date(m.ts)>t).length;
        setNewSince({content:nc,docs:nd,messages:nm});
      }
      localStorage.setItem(key,new Date().toISOString());
    } catch{}
  },[]);

  const pendingApprovals=client.contentCalendar.filter(i=>i.approvalStatus==="Pending Approval").length;
  const unreadMessages=(client.meetings||[]).reduce((n,m)=>(m.messages||[]).filter(msg=>msg.from!==session.username).length>0?n+1:n,0);
  const newDirectMsgs=(client.directMessages||[]).filter(m=>m.from==="mikaela").length;
  const unansweredIdeas=((client.brandVoice?.exploreIdeas)||[]).filter(i=>!i.hasResponse).length;

  const navSections=[
    { items:[
      { key:"home",label:"Home",icon:"◈",active:view==="home",onClick:()=>setView("home") },
      { key:"messages",label:"Messages",icon:"◇",active:view==="messages",onClick:()=>setView("messages"),badge:newSince.messages>0?newSince.messages:null },
      { key:"calendar",label:"Calendar",icon:"◷",active:view==="calendar",onClick:()=>setView("calendar"),badge:unreadMessages||null },
    ]},
    ...(branding?[{ label:"Content",items:[
      { key:"content",label:"Content",icon:"◈",active:view==="content",onClick:()=>setView("content"),badge:pendingApprovals||null },
      { key:"performance",label:"Performance",active:view==="performance",onClick:()=>setView("performance") },
      { key:"publications",label:"Publication Wins",active:view==="publications",onClick:()=>setView("publications") },
    ]}]:[]),
    ...(authority?[{ label:"Brand",items:[
      { key:"milestones",label:"Milestones",active:view==="milestones",onClick:()=>setView("milestones") },
      ...(influence?[
        { key:"strategy",label:"Strategy Map",active:view==="strategy",onClick:()=>setView("strategy") },
        { key:"ai",label:"AI Visibility",active:view==="ai",onClick:()=>setView("ai") },
      ]:[]),
    ]}]:[]),
    ...(manuscript?[{ label:"Manuscript",items:[{ key:"manuscript",label:"Manuscript",active:view==="manuscript",onClick:()=>setView("manuscript") }]}]:[]),
    { label:"Your Space",items:[
      { key:"voice",label:"Brand Voice",icon:"◇",active:view==="voice",onClick:()=>setView("voice"),badge:unansweredIdeas||null },
      { key:"playbook",label:"Media Playbook",active:view==="playbook",onClick:()=>setView("playbook") },
      { key:"timeline",label:"Results Timeline",active:view==="timeline",onClick:()=>setView("timeline") },
      { key:"documents",label:"Documents",active:view==="documents",onClick:()=>setView("documents") },
    ]},
  ];

  const renderView=()=>{
    const p={client,session,isAdmin:false,onUpdate,apiKey};
    switch(view){
      case "home": return <HomeView client={client} session={session} onUpdate={onUpdate} newSince={newSince} onNavigate={setView}/>;
      case "messages": return <DirectMessagesView client={client} session={session} onUpdate={onUpdate}/>;
      case "calendar": return <CalendarView {...p}/>;
      case "content": return <ContentView {...p}/>;
      case "performance": return <PerformanceView client={client}/>;
      case "publications": return <PublicationWinsView client={client}/>;
      case "milestones": return <MilestonesView client={client}/>;
      case "strategy": return <StrategyMapView client={client}/>;
      case "ai": return <AIVisibilityView client={client}/>;
      case "manuscript": return <ManuscriptView client={client}/>;
      case "voice": return <BrandVoiceView {...p}/>;
      case "playbook": return <MediaPlaybookView client={client}/>;
      case "timeline": return <TimelineView client={client}/>;
      case "documents": return <DocumentsView {...p}/>;
      default: return null;
    }
  };

  return (
    <div style={{ display:"flex",minHeight:"100vh",background:C.bg }}>
      <button className="mob-menu-btn" onClick={()=>setMobOpen(true)}>☰</button>
      <Sidebar logo="Client Portal" name={client.name} badge={<TierChip tier={client.tier}/>} navSections={navSections} onLogout={onLogout} mobileOpen={mobOpen} onMobileClose={()=>setMobOpen(false)}/>
      <div style={{ flex:1,overflow:"auto" }}>
        <div style={{ padding:"44px 52px",maxWidth:860 }}>{renderView()}</div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// ADMIN DASHBOARD
// ─────────────────────────────────────────────────────────────
function AdminDashboard({ clients, users, onUpdateClient, onAddClient, onLogout }) {
  const [selectedId,setSelectedId]=useState(null);
  const [activeSection,setActiveSection]=useState("content");
  const [showAddClient,setShowAddClient]=useState(false);
  const [apiKey,setApiKey]=useState(()=>{ try{ return localStorage.getItem("ks-api-key")||""; }catch{return "";} });
  const [showApiKey,setShowApiKey]=useState(false);
  const selected=clients.find(c=>c.id===selectedId);
  const [saved,setSaved]=useState(false);

  const handleUpdateClient=useCallback(updated=>{
    onUpdateClient(updated);
    setSaved(true); setTimeout(()=>setSaved(false),1800);
  },[onUpdateClient]);

  const handleAddClient=form=>{
    const id=`c_${uid()}`;
    onAddClient(mkClient({id,name:form.name,username:form.username,tier:form.tier,joinDate:todayStr()}),{username:form.username,password:form.password,role:"client",clientId:id});
    setShowAddClient(false);
  };

  const saveApiKey=k=>{ setApiKey(k); try{ localStorage.setItem("ks-api-key",k); }catch{} };

  // Admin nav sections
  const clientSections=(c)=>{
    const b=isBranding(c.tier), m=isManuscript(c.tier), a=hasAuthority(c.tier), inf=hasInfluence(c.tier);
    const ns=[
      { items:[{ key:"content",label:"Content",active:activeSection==="content",onClick:()=>setActiveSection("content") },{ key:"calendar",label:"Calendar",active:activeSection==="calendar",onClick:()=>setActiveSection("calendar") }] },
      { label:"Reports",items:[
        { key:"report",label:"Performance Report",active:activeSection==="report",onClick:()=>setActiveSection("report") },
        ...(b?[{ key:"linkedin",label:"LinkedIn Stats",active:activeSection==="linkedin",onClick:()=>setActiveSection("linkedin") }]:[]),
        { key:"publications",label:"Publications",active:activeSection==="publications",onClick:()=>setActiveSection("publications") },
      ]},
      ...(a?[{ label:"Brand",items:[
        { key:"milestones",label:"Milestones",active:activeSection==="milestones",onClick:()=>setActiveSection("milestones") },
        { key:"strategy",label:"Strategy Map",active:activeSection==="strategy",onClick:()=>setActiveSection("strategy") },
        ...(inf?[{ key:"ai",label:"AI Visibility",active:activeSection==="ai",onClick:()=>setActiveSection("ai") }]:[]),
      ]}]:[]),
      ...(m?[{ label:"Manuscript",items:[{ key:"manuscript",label:"Manuscript",active:activeSection==="manuscript",onClick:()=>setActiveSection("manuscript") }]}]:[]),
      { label:"Resources",items:[
        { key:"voice",label:"Brand Voice",active:activeSection==="voice",onClick:()=>setActiveSection("voice") },
        { key:"playbook",label:"Media Playbook",active:activeSection==="playbook",onClick:()=>setActiveSection("playbook") },
        { key:"timeline",label:"Timeline",active:activeSection==="timeline",onClick:()=>setActiveSection("timeline") },
        { key:"documents",label:"Documents",active:activeSection==="documents",onClick:()=>setActiveSection("documents") },
      ]},
      { label:"Communication",items:[
        { key:"messages",label:"Direct Messages",active:activeSection==="messages",onClick:()=>setActiveSection("messages") },
      ]},
      { label:"Admin",items:[
        { key:"welcome",label:"Welcome Message",active:activeSection==="welcome",onClick:()=>setActiveSection("welcome") },
        { key:"notes",label:"Private Notes",active:activeSection==="notes",onClick:()=>setActiveSection("notes") },
        { key:"settings",label:"Settings",active:activeSection==="settings",onClick:()=>setActiveSection("settings") },
      ]},
    ];
    return ns;
  };

  const rosterNavSections=[
    { items:[
      { key:"roster",label:"Client Roster",icon:"◈",active:!selectedId,onClick:()=>{ setSelectedId(null); },badge:clients.length||null },
    ]},
    { label:"Settings",items:[
      { key:"apikey",label:"AI Settings",active:showApiKey,onClick:()=>setShowApiKey(v=>!v) },
    ]},
  ];

  return (
    <div style={{ display:"flex",minHeight:"100vh",background:C.bg }}>
      {/* SIDEBAR */}
      <button className="mob-menu-btn" onClick={()=>document.querySelector('.sidebar')?.classList.toggle('mob-open')}>☰</button>
      <Sidebar
        logo="Admin Portal"
        name="Mikaela Ashcroft"
        badge={<span style={{ background:"rgba(201,168,76,0.1)",color:C.gold,border:`1px solid rgba(201,168,76,0.3)`,fontFamily:"'Lato',sans-serif",fontSize:9,fontWeight:700,letterSpacing:"0.14em",textTransform:"uppercase",padding:"3px 8px" }}>Admin</span>}
        navSections={selectedId&&selected ? [
          { items:[{ key:"back",label:"← All Clients",active:false,onClick:()=>{ setSelectedId(null); setShowApiKey(false); } }] },
          { label:selected.name, items:[] },
          ...clientSections(selected),
        ] : rosterNavSections}
        onLogout={onLogout}
        savedIndicator={saved}
      />

      {/* MAIN */}
      <div style={{ flex:1,overflow:"auto" }}>
        {!selectedId && (
          <div style={{ padding:"44px 52px",maxWidth:900 }}>
            {showApiKey ? (
              <div className="ks-up">
                <SectionHeading sub="Required for the AI White Space Finder feature in Brand Voice">AI Settings</SectionHeading>
                <FormRow label="Anthropic API Key" hint="Your API key is stored locally in the browser and never sent anywhere except Anthropic's servers.">
                  <input className="ks-field" type="password" value={apiKey} onChange={e=>saveApiKey(e.target.value)} placeholder="sk-ant-…"/>
                </FormRow>
                <div style={{ fontFamily:"'Lato',sans-serif",fontSize:12,color:C.muted,lineHeight:1.65,marginTop:8 }}>
                  Get your API key at <a href="https://console.anthropic.com" target="_blank" rel="noreferrer" style={{ color:C.gold }}>console.anthropic.com</a>. The White Space Finder works automatically in the Claude.ai artifact environment without a key.
                </div>
              </div>
            ) : (
              <div className="ks-up">
                <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:32 }}>
                  <div>
                    <h1 style={{ fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic",fontWeight:400,fontSize:34,color:C.white }}>Client Roster</h1>
                    <div style={{ fontFamily:"'Lato',sans-serif",fontSize:12,color:C.muted,marginTop:5 }}>{clients.length} active engagement{clients.length!==1?"s":""}</div>
                  </div>
                  <button className="btn-gold" onClick={()=>setShowAddClient(true)}>+ New Client</button>
                </div>
                <GoldRule my={0}/>
                {clients.map(c=>{
                  const pending=c.contentCalendar.filter(i=>i.approvalStatus==="Pending Approval").length;
                  return (
                    <div key={c.id} onClick={()=>{ setSelectedId(c.id); setActiveSection("content"); setShowApiKey(false); }}
                      style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"20px 0",borderBottom:`1px solid rgba(255,255,255,0.05)`,cursor:"pointer",transition:"padding 0.2s" }}
                      onMouseEnter={e=>e.currentTarget.style.paddingLeft="8px"}
                      onMouseLeave={e=>e.currentTarget.style.paddingLeft="0"}>
                      <div>
                        <div style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:21,color:C.white,fontWeight:400 }}>{c.name}</div>
                        <div style={{ fontFamily:"'Lato',sans-serif",fontSize:11,color:C.muted,marginTop:3 }}>@{c.username} · Since {fmtDate(c.joinDate)}</div>
                      </div>
                      <div style={{ display:"flex",alignItems:"center",gap:12 }}>
                        {pending>0&&<span style={{ background:"rgba(201,168,76,0.15)",color:C.gold,fontFamily:"'Lato',sans-serif",fontSize:10,fontWeight:700,padding:"3px 10px",letterSpacing:"0.08em" }}>{pending} pending</span>}
                        <TierChip tier={c.tier}/>
                        <span style={{ color:C.muted,fontSize:16 }}>›</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
        {selectedId && selected && (
          <AdminClientEditor client={selected} users={users} onUpdate={handleUpdateClient} activeSection={activeSection} onSectionChange={setActiveSection} apiKey={apiKey}/>
        )}
      </div>
      {showAddClient&&<AddClientModal users={users} onClose={()=>setShowAddClient(false)} onSave={handleAddClient}/>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// LOGIN
// ─────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [username,setUsername]=useState("");
  const [password,setPassword]=useState("");
  const [error,setError]=useState("");
  const [loading,setLoading]=useState(false);
  const submit=e=>{ e.preventDefault(); setLoading(true); setError(""); setTimeout(()=>{ if(!onLogin(username.trim().toLowerCase(),password)) setError("Invalid credentials. Please try again."); setLoading(false); },600); };
  return (
    <div style={{ minHeight:"100vh",background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",padding:20,position:"relative",overflow:"hidden" }}>
      <div style={{ position:"absolute",width:600,height:600,borderRadius:"50%",border:"1px solid rgba(201,168,76,0.05)",top:"50%",left:"50%",transform:"translate(-50%,-50%)" }}/>
      <div style={{ position:"absolute",width:380,height:380,borderRadius:"50%",border:"1px solid rgba(201,168,76,0.07)",top:"50%",left:"50%",transform:"translate(-50%,-50%)" }}/>
      <div className="ks-up" style={{ width:"100%",maxWidth:380,textAlign:"center" }}>
        <div style={{ marginBottom:48 }}>
          <div style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:11,letterSpacing:"0.35em",textTransform:"uppercase",color:C.muted,marginBottom:12 }}>Client Portal</div>
          <div style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:44,fontWeight:300,color:C.white,letterSpacing:"0.1em",lineHeight:1 }}>Kepler<span style={{ color:C.gold }}> Script</span></div>
          <div style={{ height:1,background:`linear-gradient(90deg,transparent,${C.gold}60,transparent)`,marginTop:20 }}/>
        </div>
        <form onSubmit={submit} style={{ textAlign:"left" }}>
          <div style={{ marginBottom:28 }}>
            <label style={{ display:"block",fontFamily:"'Lato',sans-serif",fontSize:10,fontWeight:700,letterSpacing:"0.16em",textTransform:"uppercase",color:C.muted,marginBottom:8 }}>Username</label>
            <input className="ks-input" type="text" value={username} onChange={e=>setUsername(e.target.value)} placeholder="your.name" autoComplete="username"/>
          </div>
          <div style={{ marginBottom:36 }}>
            <label style={{ display:"block",fontFamily:"'Lato',sans-serif",fontSize:10,fontWeight:700,letterSpacing:"0.16em",textTransform:"uppercase",color:C.muted,marginBottom:8 }}>Password</label>
            <input className="ks-input" type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" autoComplete="current-password"/>
          </div>
          {error&&<div style={{ fontFamily:"'Lato',sans-serif",fontSize:12,color:"#c97070",marginBottom:20,textAlign:"center" }}>{error}</div>}
          <button className="btn-gold" type="submit" style={{ width:"100%",opacity:loading?0.7:1 }} disabled={loading}>{loading?"Verifying…":"Enter Portal"}</button>
        </form>
        <div style={{ marginTop:40,fontFamily:"'Lato',sans-serif",fontSize:10,color:C.muted,letterSpacing:"0.08em" }}>Private access only · Kepler Script</div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// APP ROOT
// ─────────────────────────────────────────────────────────────
export default function App() {
  const [loading,setLoading]=useState(true);
  const [users,setUsers]=useState([]);
  const [clients,setClients]=useState([]);
  const [session,setSession]=useState(null);
  const apiKey=useRef("");

  useEffect(()=>{
    (async()=>{
      const u=await store.get("ks-users-v3",DEFAULT_USERS);
      const c=await store.get("ks-clients-v3",DEFAULT_CLIENTS);
      setUsers(u); setClients(c); setLoading(false);
      try{ apiKey.current=localStorage.getItem("ks-api-key")||""; }catch{}
    })();
  },[]);

  useEffect(()=>{ if(users.length>0) store.set("ks-users-v3",users); },[users]);
  useEffect(()=>{ if(clients.length>0) store.set("ks-clients-v3",clients); },[clients]);

  const handleLogin=useCallback((username,password)=>{
    const user=users.find(u=>u.username===username&&u.password===password);
    if(!user) return false;
    setSession({role:user.role,clientId:user.clientId,username:user.username});
    return true;
  },[users]);

  const handleUpdateClient=useCallback(updated=>setClients(prev=>prev.map(c=>c.id===updated.id?updated:c)),[]);
  const handleAddClient=useCallback((nc,nu)=>{ setClients(prev=>[...prev,nc]); setUsers(prev=>[...prev,nu]); },[]);

  if(loading) return (
    <div style={{ minHeight:"100vh",background:C.bg,display:"flex",alignItems:"center",justifyContent:"center" }}>
      <div style={{ fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic",fontSize:22,color:`${C.gold}55` }}>Kepler Script</div>
    </div>
  );

  if(!session) return <LoginScreen onLogin={handleLogin}/>;
  if(session.role==="admin") return <AdminDashboard clients={clients} users={users} onUpdateClient={handleUpdateClient} onAddClient={handleAddClient} onLogout={()=>setSession(null)}/>;

  const clientData=clients.find(c=>c.id===session.clientId);
  if(!clientData) return <LoginScreen onLogin={handleLogin}/>;

  return <ClientDashboard client={clientData} session={session} onLogout={()=>setSession(null)} onUpdate={handleUpdateClient} apiKey={apiKey.current}/>;
}
