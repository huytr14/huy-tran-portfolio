import React, { useEffect, useMemo, useState } from "react";

/* ---------- Types ---------- */
interface Project {
  title: string;
  year: string;
  description: string;
  tags: string[];
  github?: string;
  store?: string;
  live?: string;
  url?: string;
}
interface ExperienceItem {
  role: string;
  company: string;
  period: string;
  urls?: string[];
  bullets: string[];
}
interface Certificate {
  title: string;
  issuer?: string;
  year?: string;
  desc?: string;
}

// =============================================
// Pixel Portfolio – Single-Page Landing (React)
// - TailwindCSS utilities
// - Keyboard nav (↑/↓/Enter)
// - Theme switcher (Settings)
// - Retro terminal panel (About / Projects / Contact)
// - Pixel mini‑game + AskMeChat + Skills/Experience/Certificates tabs
// =============================================

// ---- Quick Personalization ---------------------------------
const PROFILE = {
  name: "Tran Gia Huy",
  handle: "Huy Tran Portfolio",
  title: "Software Engineer",
  location: "Ho Chi Minh City, VN",
  email: "tghuy140104@gmail.com",
  github: "https://github.com/huytr14",
  linkedin: "https://linkedin.com/in/tghuy14",
  tagline: "Code. Create.",
};

const PROJECTS: Project[] = [
  {
    title: "Pizza App (Flutter + Firebase) – Team Lead",
    year: "2025",
    description:
      "Food ordering app with menu browsing, customization, auth, cart, and receipt. Led a 3-member team; offline-first mindset with Firestore.",
    tags: ["Flutter", "Firebase", "Auth", "Cart", "Offline-first"],
    github: "",             // điền link nếu có
    store: "",              // điền link nếu đã publish
  },
  {
    title: "Student Management Portal (React + Node)",
    year: "2024",
    description:
      "Academic portal for courses, schedules, and grades. REST APIs (Node.js), React front-end state management, Agile collaboration.",
    tags: ["React", "Node", "REST", "MongoDB"],
    github: "",             // điền link repo nếu có
    live: "",               // demo nếu có
  },
];

// ---- Resume Data --------------------------------------------
const SKILLS = {
  languages: ["TypeScript", "JavaScript", "Dart", "Python"],
  frontend: ["React", "TailwindCSS", "Vite", "Next.js"],
  backend: ["Node", "Express", "REST", "MongoDB", "PostgreSQL"],
  mobile: ["Flutter", "Firebase"],
  tooling: ["Git", "CI/CD", "Vercel", "Docker (basic)"],
  domain: ["SEO", "JSON-LD", "Core Web Vitals", "Odoo 16"],
};

const EXPERIENCE: ExperienceItem[] = [
  {
    role: "Marketing Online Intern",
    company: "Thanh An AutoCare",
    period: "07/2025 – 09/2025",
    urls: [
      "https://thanhanautocare.com",
      "https://camerahanhtrinhxeoto.vn",
    ],

    bullets: [
      "Optimized on-page SEO and internal linking for automotive product pages.",
      "Applied AI-assisted workflows for keyword clustering, content outlines, and performance tracking.",
      "Monitored Google Search Console & analytics metrics to propose engagement improvements.",
    ],
  },
];

const CERTIFICATES: Certificate[] = [
  {
    title: "TOEIC 520 (Listening & Reading)",
    issuer: "ETS",
    year: "2022",
    desc: "Demonstrates English proficiency for workplace communication.",
  },
  {
    title: "Google IT Automation with Python",
    issuer: "Google / Coursera",
    year: "2025",
    desc: "Python scripting, Git, troubleshooting, and automation workflows.",
  },
];

// ---- Color Themes -------------------------------------------
const THEMES = {
  violet: {
    name: "Violet Retro",
    bg: "#1b1230",
    paper: "#231437",
    ink: "#d7c7ff",
    dim: "#9f93c9",
    accent: "#00ffa2",
  },
  midnight: {
    name: "Midnight Neon",
    bg: "#090d12",
    paper: "#0f172a",
    ink: "#d2d6dc",
    dim: "#94a3b8",
    accent: "#22d3ee",
  },
  amber: {
    name: "Amber Terminal",
    bg: "#0b0b0b",
    paper: "#101010",
    ink: "#ffe8b0",
    dim: "#bfae86",
    accent: "#ffcc00",
  },
  jade: {
    name: "Jade Mono",
    bg: "#0c1412",
    paper: "#0f211b",
    ink: "#d6f5ea",
    dim: "#9adac5",
    accent: "#00ffa2",
  },
};

// ---- Helpers -------------------------------------------------
const useKeyboardMenu = (items: string[], onSelect: (val: string) => void) => {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") setIndex((i) => (i + 1) % items.length);
      if (e.key === "ArrowUp") setIndex((i) => (i - 1 + items.length) % items.length);
      if (e.key === "Enter") onSelect(items[index]);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [items, index, onSelect]);
  return { index, setIndex };
};

// ---- Tiny Pixel Components ---------------------------------
const PixelCat: React.FC = () => (
  <div className="flex items-end gap-1 text-[var(--ink)]">
    <div className="w-3 h-3 bg-[var(--ink)]" />
    <div className="w-4 h-3 bg-[var(--ink)]" />
    <div className="w-1 h-1 bg-[var(--bg)]" />
    <span className="text-xs ml-1 opacity-70">=^._.^=</span>
  </div>
);

const Poster: React.FC<{ title: string; subtitle?: string }> = ({ title, subtitle }) => (
  <div className="px-3 py-2 border border-[var(--ink-dim)] text-[var(--ink)] text-xs uppercase tracking-widest">
    <div className="font-bold">{title}</div>
    {subtitle && <div className="opacity-70">{subtitle}</div>}
  </div>
);

// ---- Ask-Me Chat (About-Me Q&A with local rules + API hook) ----
/**
 * AskMeChat
 * - Users ask questions about you; bot replies using local facts (PROFILE, PROJECTS)
 * - Optional API hook: set USE_BACKEND=true and set API_URL to your endpoint
 * - Persists history in localStorage("askme_chat")
 */
const USE_BACKEND = true;
const API_URL = "/api/ask"; // on Vercel this will call the serverless function at /api/ask

const AskMeChat: React.FC = () => {
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  // Safe init for SSR: avoid accessing localStorage during module evaluation
  const [msgs, setMsgs] = useState<{role:'user'|'bot'; text:string}[]>(() => {
    if (typeof window === "undefined") return [];
    try { return JSON.parse(localStorage.getItem('askme_chat') || '[]'); } catch { return []; }
  });
  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem('askme_chat', JSON.stringify(msgs));
  }, [msgs]);

  const localAnswer = (q: string): string => {
    const s = q.toLowerCase();
    if (/\b(name|who are you|tên)\b/.test(s)) return `I'm ${PROFILE.name}. People call me ${PROFILE.handle}.`;
    if (/(where|ở đâu|location|based)/.test(s)) return `I'm based in ${PROFILE.location}.`;
    if (/(email|contact|liên hệ)/.test(s)) return `Reach me at ${PROFILE.email}.`;
    if (/(skills?|tech|stack|kỹ năng)/.test(s)) return `I work with TypeScript/React, Node/Express, Flutter/Firebase, PostgreSQL & MongoDB. I also optimize SEO (JSON-LD, CWV).`;
    if (/(project|dự án|portfolio)/.test(s)) return `Some highlights: ${PROJECTS.map(p=>p.title+" ("+p.year+")").slice(0,3).join('; ')}.`;
    if (/(seo|ai)/.test(s)) return `Yes — I build SEO automations and experiment with AI-assisted content and tooling.`;
    if (/odoo/.test(s)) return `I work with Odoo 16 modules (Sales/Inventory/HR) and custom flows.`;
    if (/(certificate|chứng chỉ|toeic|coursera|google)/.test(s)) return `Certificates: TOEIC 835 (ETS, 2024); Google IT Automation with Python (Google/Coursera, 2023).`;
    return `Good question! I can talk about skills, projects, SEO/AI, Odoo, certificates, or how to contact me.`;
  };

  const ask = async () => {
    const q = input.trim(); if (!q) return; setInput("");
    setMsgs(m => [...m, {role:'user', text:q}]);
    setBusy(true);
    try {
      let answer = localAnswer(q);
      if (USE_BACKEND) {
        const r = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            question: q,
            profile: PROFILE,
            projects: PROJECTS,
            experience: EXPERIENCE,
            certificates: CERTIFICATES,
          }),
        });
         if (r.ok) { const j = await r.json(); if (j?.answer) answer = j.answer; }
       }
      setMsgs(m => [...m, {role:'bot', text:answer}]);
    } catch (e) {
      setMsgs(m => [...m, {role:'bot', text:"(Oops) Something went wrong. Try again."}]);
    } finally { setBusy(false); }
  };

  return (
    // responsive chat (min/max + clamp)
    <div
      className="relative h-auto min-h-[180px] md:min-h-[220px] lg:min-h-[320px] max-h-[60vh] border border-[var(--ink-dim)] p-2 flex flex-col"
      style={{ minHeight: "clamp(180px, 28vh, 360px)", maxHeight: "60vh" }}
    >
      <div className="flex-1 overflow-auto space-y-1 pr-1">
        {msgs.length===0 && (
          <div className="text-[10px] text-[var(--ink-dim)]">Ask me anything about my skills, projects, or contact info.</div>
        )}
        {msgs.map((m, i) => (
          <div key={i} className={`text-[12px] ${m.role==='user'?'text-[var(--accent)]':'text-[var(--ink)]'}`}>
            <span className="opacity-70">{m.role==='user'?'>':'•'}</span> {m.text}
          </div>
        ))}
      </div>
      <div className="mt-2 flex items-center gap-2">
        <input
          className="flex-1 bg-transparent border border-[var(--ink-dim)] px-2 py-1 text-sm outline-none"
          placeholder="Type your question about me..."
          value={input}
          onChange={(e)=>setInput(e.target.value)}
          onKeyDown={(e)=>{ if (e.key==='Enter' && !busy) ask(); }}
        />
        <button onClick={ask} disabled={busy} className="px-3 py-1 bg-[var(--accent)] text-black text-sm font-bold disabled:opacity-60">Ask</button>
      </div>
    </div>
  );
};

/**
 * Mini game: PIXEL DODGE
 * - Move the ship left/right (A/D or ◄/►)
 * - Avoid falling blocks, collect triangles for score
 * - Auto-pauses when tab hidden; persists high-score in localStorage
 */
const MiniDodgeGame: React.FC = () => {
  const ref = React.useRef<HTMLCanvasElement | null>(null);
  const [running, setRunning] = useState(false);
  const [score, setScore] = useState(0);
  // safe init for SSR / tsc: don't access localStorage on server
  const [hi, setHi] = useState<number>(() => {
    if (typeof window === "undefined") return 0;
    return Number(localStorage.getItem("pd_hi") || 0);
  });

  useEffect(() => {
    const canvas = ref.current!; if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    // make canvas internal pixel size match CSS size * DPR and draw using CSS coordinates
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const DPR = window.devicePixelRatio || 1;
      canvas.width = Math.max(1, Math.floor(rect.width * DPR));
      canvas.height = Math.max(1, Math.floor(rect.height * DPR));
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      // set transform so drawing commands use CSS pixels
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      return { w: rect.width, h: rect.height };
    };

    let raf = 0, last = 0;
    let { w: W, h: H } = resizeCanvas();

    // update sizes on window resize
    const onResize = () => { const wh = resizeCanvas(); W = wh.w; H = wh.h; };
    window.addEventListener("resize", onResize);

    const ship = { x: W - 40, y: H - 18, w: 12, h: 8, vx: 0 } as any;
    const keys = new Set<string>();
    const blocks: { x: number; y: number; w: number; h: number; v: number; bad: boolean }[] = [];

    const spawn = () => {
      const bad = Math.random() < 0.7;
      const w = bad ? 10 + Math.random() * 20 : 6;
      blocks.push({ x: Math.random() * Math.max(10, W - w), y: -10, w, h: bad ? 8 + Math.random() * 10 : 6, v: 28 + Math.random() * 40, bad });
    };

    let acc = 0;
    const collide = (a: any, b: any) => !(a.x + a.w < b.x || b.x + b.w < a.x || a.y + a.h < b.y || b.y + b.h < a.y);

    const step = (ms: number) => {
      const dt = Math.min(0.033, (ms - last) / 1000 || 0); last = ms; if (!running) { raf = requestAnimationFrame(step); return; }
      acc += dt;
      ship.vx = (keys.has("ArrowLeft") || keys.has("a")) ? -85 : (keys.has("ArrowRight") || keys.has("d")) ? 85 : 0;
      ship.x = Math.max(2, Math.min(W - ship.w - 2, ship.x + ship.vx * dt));

      if (blocks.length < 24 && acc > 0.08) { spawn(); acc = 0; }

      for (let i = blocks.length - 1; i >= 0; i--) { const b = blocks[i]; b.y += b.v * dt; if (b.y > H + 20) blocks.splice(i, 1); }

      blocks.forEach((b, i) => {
        if (collide(ship, b)) {
          if (b.bad) {
            setHi((prev) => { const n = Math.max(prev, score); localStorage.setItem("pd_hi", String(n)); return n; });
            setScore(0); ship.x = W - 40; blocks.splice(0, blocks.length); setRunning(false);
          } else {
            setScore((s) => s + 1); blocks.splice(i, 1);
          }
        }
      });

      ctx.clearRect(0, 0, W, H);

      blocks.forEach((b) => {
        ctx.fillStyle = b.bad
          ? getComputedStyle(document.documentElement).getPropertyValue("--ink")
          : getComputedStyle(document.documentElement).getPropertyValue("--accent");
        if (b.bad) ctx.fillRect(b.x, b.y, b.w, b.h);
        else { ctx.beginPath(); ctx.moveTo(b.x, b.y + b.h); ctx.lineTo(b.x + b.w / 2, b.y); ctx.lineTo(b.x + b.w, b.y + b.h); ctx.closePath(); ctx.fill(); }
      });

      ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue("--ink");
      ctx.fillRect(ship.x, ship.y, ship.w, ship.h);
      ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue("--accent");
      ctx.beginPath(); ctx.moveTo(ship.x + ship.w / 2, ship.y + ship.h); ctx.lineTo(ship.x + ship.w / 2 - 4, ship.y + ship.h + 8); ctx.lineTo(ship.x + ship.w / 2 + 4, ship.y + ship.h + 8); ctx.closePath(); ctx.fill();

      raf = requestAnimationFrame(step);
    };

    const down = (e: KeyboardEvent) => { keys.add(e.key); };
    const up = (e: KeyboardEvent) => { keys.delete(e.key); };
    const vis = () => { if (document.hidden) setRunning(false); };

    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    document.addEventListener("visibilitychange", vis);
    raf = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      document.removeEventListener("visibilitychange", vis);
      window.removeEventListener("resize", onResize);
    };
  }, [running, score, hi]);

  return (
    <div
      className="relative h-auto min-h-[140px] md:min-h-[180px] lg:min-h-[260px] max-h-[55vh]"
      style={{ minHeight: "clamp(140px, 22vh, 320px)", maxHeight: "55vh" }}
    >
      <canvas ref={ref} className="w-full h-full block" />
      {/* Score panel */}
      <div className="absolute left-2 top-2 px-2 py-1 border border-[var(--ink-dim)] bg-[var(--paper)]/30 backdrop-blur-[1px] text-[10px]">
        <span className="mr-3">score <b>{score}</b></span>
        <span>hi {Math.max(hi, score)}</span>
      </div>
      <div className="absolute inset-x-0 bottom-1 flex items-center justify-between px-2 text-[10px] text-[var(--ink-dim)]">
        <span>◄ ► / A D to move</span>
        <span>avoid ■ collect ▽</span>
      </div>
      {!running && (
        <button onClick={() => setRunning(true)} className="absolute inset-0 m-auto h-8 w-24 bg-[var(--accent)] text-black font-bold">
          START
        </button>
      )}
    </div>
  );
};

// ---- Panels --------------------------------------------------
const About: React.FC = () => (
  <div>
    <div className="text-[var(--ink-dim)] uppercase text-xs mb-2 tracking-wider">
      ABOUT ME
    </div>

    <p className="leading-relaxed text-lg">
      I’m a <b>Software Engineer</b> passionate about building clean, maintainable web
      and mobile apps. My focus is on <b>TypeScript, React, and Flutter</b> for front-end
      and <b>Node.js / Express</b> for back-end development.  
      I love designing modular architectures, improving developer experience, and
      experimenting with <b>AI-assisted</b> workflows to boost productivity.
    </p>

    <p className="leading-relaxed text-lg mt-2">
      Recently, I’ve worked on full-stack projects involving Firebase, REST APIs,
      and MongoDB. I enjoy solving complex UI logic, optimizing app performance, and
      creating seamless user experiences.
    </p>

    <ul className="mt-4 grid grid-cols-2 gap-2 text-sm">
      <li className="opacity-80">TypeScript / React</li>
      <li className="opacity-80">Node / Express</li>
      <li className="opacity-80">Flutter / Firebase</li>
      <li className="opacity-80">PostgreSQL / MongoDB</li>
      <li className="opacity-80">TailwindCSS / Vite</li>
      <li className="opacity-80">REST / JSON / API Design</li>
    </ul>
  </div>
);


const Projects: React.FC = () => (
  <div>
    <div className="text-[var(--ink-dim)] uppercase text-xs mb-4 tracking-wider">Projects</div>
    <div className="space-y-4">
      {PROJECTS.map((p) => (
        <a key={p.title} href={p.url} className="block group border border-[var(--ink-dim)] p-3 hover:border-[var(--accent)]">
          <div className="flex items-start justify-between">
            <h3 className="font-bold group-hover:text-[var(--accent)]">{p.title}</h3>
            <span className="text-xs text-[var(--ink-dim)]">{p.year}</span>
          </div>
          <p className="text-sm opacity-90 mt-1">{p.description}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {p.tags.map((t) => (
              <span key={t} className="text-[10px] px-2 py-[2px] border border-[var(--ink-dim)]">{t}</span>
            ))}
          </div>
        </a>
      ))}
    </div>
  </div>
);

const Skills: React.FC = () => (
  <div>
    <div className="text-[var(--ink-dim)] uppercase text-xs mb-4 tracking-wider">Skills</div>
    <div className="grid sm:grid-cols-2 gap-3 text-sm">
      <div>
        <div className="text-[var(--ink-dim)] text-xs uppercase">Languages</div>
        <div className="flex flex-wrap gap-2 mt-1">{SKILLS.languages.map((s)=> <span key={s} className="text-[10px] px-2 py-[2px] border border-[var(--ink-dim)]">{s}</span>)}</div>
      </div>
      <div>
        <div className="text-[var(--ink-dim)] text-xs uppercase">Frontend</div>
        <div className="flex flex-wrap gap-2 mt-1">{SKILLS.frontend.map((s)=> <span key={s} className="text-[10px] px-2 py-[2px] border border-[var(--ink-dim)]">{s}</span>)}</div>
      </div>
      <div>
        <div className="text-[var(--ink-dim)] text-xs uppercase">Backend</div>
        <div className="flex flex-wrap gap-2 mt-1">{SKILLS.backend.map((s)=> <span key={s} className="text-[10px] px-2 py-[2px] border border-[var(--ink-dim)]">{s}</span>)}</div>
      </div>
      <div>
        <div className="text-[var(--ink-dim)] text-xs uppercase">Mobile</div>
        <div className="flex flex-wrap gap-2 mt-1">{SKILLS.mobile.map((s)=> <span key={s} className="text-[10px] px-2 py-[2px] border border-[var(--ink-dim)]">{s}</span>)}</div>
      </div>
      <div>
        <div className="text-[var(--ink-dim)] text-xs uppercase">Tooling</div>
        <div className="flex flex-wrap gap-2 mt-1">{SKILLS.tooling.map((s)=> <span key={s} className="text-[10px] px-2 py-[2px] border border-[var(--ink-dim)]">{s}</span>)}</div>
      </div>
      <div>
        <div className="text-[var(--ink-dim)] text-xs uppercase">Domain</div>
        <div className="flex flex-wrap gap-2 mt-1">{SKILLS.domain.map((s)=> <span key={s} className="text-[10px] px-2 py-[2px] border border-[var(--ink-dim)]">{s}</span>)}</div>
      </div>
    </div>
  </div>
);

const Experience: React.FC = () => (
  <div>
    <div className="text-[var(--ink-dim)] uppercase text-xs mb-4 tracking-wider">Experience</div>
    <div className="space-y-3">
      {EXPERIENCE.map((e) => (
        <div key={e.role + e.company} className="p-3 border border-[var(--ink-dim)]">
          <div className="flex items-start justify-between">
            <div className="font-semibold">{e.role} · <span className="opacity-90">{e.company}</span></div>
            <div className="text-xs text-[var(--ink-dim)]">{e.period}</div>
          </div>
          <ul className="mt-1 list-disc list-inside text-sm opacity-90">
            {e.bullets.map((b, i) => <li key={i}>{b}</li>)}
          </ul>

          {/* Hiển thị links nếu có */}
          {Array.isArray((e as any).urls) && (e as any).urls.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {(e as any).urls.map((u: string, i: number) => (
                <a
                  key={i}
                  href={u}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[10px] px-2 py-[4px] border border-[var(--ink-dim)] rounded text-[var(--ink)] underline"
                >
                  {u.replace(/^https?:\/\//, "")}
                </a>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
);

const Certificates: React.FC = () => (
  <div>
    <div className="text-[var(--ink-dim)] uppercase text-xs mb-4 tracking-wider">Certificates</div>
    <div className="space-y-3">
      {CERTIFICATES.map((c)=> (
        <div key={c.title} className="p-3 border border-[var(--ink-dim)]">
          <div className="flex items-start justify-between">
            <div className="font-semibold">{c.title} <span className="opacity-60 text-xs">· {c.issuer}</span></div>
            <div className="text-xs text-[var(--ink-dim)]">{c.year}</div>
          </div>
          <div className="text-sm opacity-90 mt-1">{c.desc}</div>
        </div>
      ))}
    </div>
  </div>
);

const Contact: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<null | "sent" | "error">(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setStatus("error");
      return;
    }
    setSending(true);
    setStatus(null);
    try {
      const r = await fetch("/api/send-contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message, origin: window.location.href }),
      });
      if (r.ok) {
        setStatus("sent");
        setName(""); setEmail(""); setMessage("");
      } else {
        setStatus("error");
        console.error(await r.text());
      }
    } catch (err) {
      console.error(err);
      setStatus("error");
    } finally {
      setSending(false);
    }
  };

  return (
    <div>
      <div className="text-[var(--ink-dim)] uppercase text-xs mb-3 tracking-wider">Contact</div>
      <form onSubmit={onSubmit} className="grid gap-3 max-w-md">
        <input value={name} onChange={(e)=>setName(e.target.value)} className="bg-transparent border border-[var(--ink-dim)] p-2 outline-none" placeholder="Your name" />
        <input value={email} onChange={(e)=>setEmail(e.target.value)} type="email" className="bg-transparent border border-[var(--ink-dim)] p-2 outline-none" placeholder="Email" />
        <textarea value={message} onChange={(e)=>setMessage(e.target.value)} className="bg-transparent border border-[var(--ink-dim)] p-2 h-28 outline-none" placeholder="Message" />
        <button type="submit" disabled={sending} className="justify-self-start px-3 py-2 bg-[var(--accent)] text-black font-bold">
          {sending ? "Sending…" : "Send"}
        </button>
        {status === "sent" && <div className="text-sm text-[var(--accent)]">Message sent — thank you.</div>}
        {status === "error" && <div className="text-sm text-red-400">Failed to send. Please try again later.</div>}
      </form>
      <p className="text-xs text-[var(--ink-dim)] mt-3">Or email me directly: <a className="underline" href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a></p>
    </div>
  );
};

const Settings: React.FC<{ themeKey: keyof typeof THEMES; setThemeKey: (k: keyof typeof THEMES) => void; }> = ({ themeKey, setThemeKey }) => (
  <div>
    <div className="text-[var(--ink-dim)] uppercase text-xs mb-3 tracking-wider">Settings</div>
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {Object.entries(THEMES).map(([key, t]: [string, { name: string; bg: string; paper: string; ink: string; dim: string; accent: string }]) => (
        <button
          key={key}
          onClick={() => setThemeKey(key as keyof typeof THEMES)}
          className={`p-3 border text-left ${themeKey === key ? "border-[var(--accent)]" : "border-[var(--ink-dim)]"}`}
        >
          <div className="flex items-center gap-2">
            <span className="inline-block w-4 h-4" style={{ background: t.accent }} />
            <span className="font-semibold">{t.name}</span>
          </div>
          <div className="mt-2 flex gap-1">
            <span className="w-6 h-4" style={{ background: t.bg }} />
            <span className="w-6 h-4" style={{ background: t.paper }} />
            <span className="w-6 h-4" style={{ background: t.ink }} />
          </div>
        </button>
      ))}
    </div>
  </div>
);

// ---- Style Injector (pixel vibe & variables) ----------------
const StyleInjector: React.FC = () => (
  <style>{`
    :root {
      --bg: ${THEMES.violet.bg};
      --paper: ${THEMES.violet.paper};
      --ink: ${THEMES.violet.ink};
      --ink-dim: ${THEMES.violet.dim};
      --accent: ${THEMES.violet.accent};
      --accent-dim: ${THEMES.violet.accent}55;
    }
    * { box-sizing: border-box; }
    body { color: var(--ink); }
  `}</style>
);

// ---- Main ----------------------------------------------------
export default function App() {
  const [themeKey, setThemeKey] = useState<keyof typeof THEMES>("violet");
  const theme = THEMES[themeKey];

  const [tab, setTab] = useState<"ABOUT" | "PROJECTS" | "SKILLS" | "EXPERIENCE" | "CERTIFICATES" | "CONTACT" | "SETTINGS">("ABOUT");
  const menuItems = useMemo(() => ["ABOUT", "PROJECTS", "SKILLS", "EXPERIENCE", "CERTIFICATES", "CONTACT", "SETTINGS"], []);
  const { index, setIndex } = useKeyboardMenu(menuItems, (val) => setTab(val as any));

  // CSS variables for theme
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--bg", theme.bg);
    root.style.setProperty("--paper", theme.paper);
    root.style.setProperty("--ink", theme.ink);
    root.style.setProperty("--ink-dim", theme.dim);
    root.style.setProperty("--accent", theme.accent);
    root.style.setProperty("--accent-dim", theme.accent + "55");
  }, [theme]);

  // set browser tab title
  useEffect(() => {
    if (typeof document !== "undefined") document.title = PROFILE.handle;
  }, []);

  // ---- Smoke tests (run once in browser) --------------------
  useEffect(() => {
    try {
      const asserts: Array<[boolean, string]> = [
        [typeof (AskMeChat as any) === "function", "AskMeChat defined"],
        [typeof (MiniDodgeGame as any) === "function", "MiniDodgeGame defined"],
        [typeof (Skills as any) === "function", "Skills defined"],
        [typeof (Experience as any) === "function", "Experience defined"],
        [typeof (Certificates as any) === "function", "Certificates defined"],
        [CERTIFICATES.some(c => /TOEIC/i.test(c.title)), "TOEIC present"],
        [CERTIFICATES.some(c => /Automation/i.test(c.title)), "Google Automation present"],
      ];
      const failed = asserts.filter(([ok]) => !ok).map(([, msg]) => msg);
      if (failed.length) throw new Error("Smoke tests failed: " + failed.join(", "));
      console.debug("[smoke] components defined ✓");
    } catch (e) {
      console.error("[smoke] test failed:", e);
    }
  }, []);

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      {/* Top frame */}
      <div className="h-1 w-full bg-[var(--ink)] opacity-20" />

      {/* Content (auto height, align to top) */}
      <div className="w-full max-w-7xl mx-auto px-4 lg:px-8 py-6 grid items-start grid-cols-1 lg:grid-cols-[1.25fr_0.95fr] gap-6">
        {/* Left: Pixel Room */}
        <section className="relative border border-[var(--ink-dim)] p-4 lg:p-6 bg-[var(--paper)] shadow-[0_0_0_2px_var(--paper)] min-h-0 overflow-auto">
          {/* window */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[var(--ink-dim)] text-[10px] uppercase tracking-widest">{PROFILE.tagline}</div>
            </div>
            <div className="text-[var(--ink-dim)] text-[10px]">{PROFILE.location}</div>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-4">
            <div className="col-span-2 space-y-4">
              {/* window view becomes chat */}
              <AskMeChat />

              {/* desk (game) */}
              <div className="relative border border-[var(--ink-dim)] p-3">
                <MiniDodgeGame />
              </div>

              {/* posters */}
              <div className="grid grid-cols-3 gap-2">
                <Poster title="Python"  />
                <Poster title="JavaScript"/>
                <Poster title="Flutter" subtitle="Mobile" />
              </div>
            </div>

            {/* Profile card */}
            <div className="col-span-1 border border-[var(--ink-dim)] p-4 flex flex-col justify-between min-h-0">
              <div>
                <div className="text-[var(--ink-dim)] text-xs uppercase">portfolio</div>
                <h1 className="text-2xl font-black text-[var(--ink)] leading-tight mt-1">{PROFILE.name}</h1>
                <p className="text-[var(--ink-dim)] text-sm mt-1">{PROFILE.title}</p>
                <p className="text-[var(--ink)] text-xs mt-3 opacity-90">Building modern web & mobile experiences powered by AI.</p>
              </div>
              <div className="pt-4 space-y-2 text-sm">
                <a className="block underline text-[var(--ink)]/90" href={PROFILE.github}>GitHub</a>
                <a className="block underline text-[var(--ink)]/90" href={PROFILE.linkedin}>LinkedIn</a>
                <a className="block underline text-[var(--ink)]/90 break-words max-w-full" href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a>

                {/* Download CV button - put cv.pdf into /public (Vite) */}
                <div className="mt-3">
                  <a
                    href="/CV_Tran_Gia_Huy.pdf"
                    download="CV_Tran_Gia_Huy.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Download CV_Tran_Gia_Huy.pdf (PDF)"
                    className="inline-block px-3 py-2 bg-[var(--accent)] text-black font-semibold text-sm rounded"
                  >
                    Download CV
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Right: Terminal Panel */}
        <section className="relative border border-[var(--ink-dim)] bg-[var(--paper)] shadow-[0_0_0_2px_var(--paper)] min-h-0 overflow-auto">
          {/* title bar */}
          <div className="flex items-center gap-2 px-3 py-2 border-b border-[var(--ink-dim)]">
            <div className="w-2 h-2 rounded-sm bg-[var(--accent)] shadow-[0_0_8px_var(--accent)]" />
            <div className="text-[var(--ink-dim)] text-xs">{PROFILE.handle}</div>
            <div className="ml-auto text-[10px] text-[var(--ink-dim)]">↑/↓ to navigate • Enter ▶</div>
          </div>

          <div className="grid grid-cols-[160px_1fr]">
            {/* menu */}
            <nav className="border-r border-[var(--ink-dim)] p-3">
              {menuItems.map((m, i) => (
                <button
                  key={m}
                  onClick={() => { setTab(m as any); setIndex(i); }}
                  className={`block w-full text-left px-2 py-1 text-sm tracking-wider uppercase transition ${i === index ? "bg-[var(--accent)] text-black font-bold" : "text-[var(--ink)] hover:bg-[var(--ink)]/10"}`}
                >
                  {m}
                </button>
              ))}
            </nav>

            {/* content */}
            <div className="p-4 lg:p-6 text-[var(--ink)]">
              {tab === "ABOUT" && <About />}
              {tab === "PROJECTS" && <Projects />}
              {tab === "SKILLS" && <Skills />}
              {tab === "EXPERIENCE" && <Experience />}
              {tab === "CERTIFICATES" && <Certificates />}
              {tab === "CONTACT" && <Contact />}
              {tab === "SETTINGS" && <Settings themeKey={themeKey} setThemeKey={setThemeKey} />}
            </div>
          </div>

          {/* status bar */}
          <div className="border-t border-[var(--ink-dim)] px-3 py-2 text-[10px] text-[var(--ink-dim)] flex items-center gap-3">
            <span className="flex items-center gap-2"><PixelCat /> tran-gia-huy portfolio v1.0</span>
            <span className="ml-auto">{PROFILE.handle}</span>
          </div>
        </section>
      </div>

      {/* Bottom frame */}
      <div className="h-1 w-full bg-[var(--ink)] opacity-20" />

      <StyleInjector />
    </div>
  );
}
