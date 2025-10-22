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

/* ---------- i18n ---------- */
type Lang = "en" | "vi";

const I18N: Record<Lang, Record<string, string>> = {
  en: {
    ABOUT: "ABOUT",
    PROJECTS: "PROJECTS",
    SKILLS: "SKILLS",
    EXPERIENCE: "EXPERIENCE",
    CERTIFICATES: "CERTIFICATES",
    CONTACT: "CONTACT",
    SETTINGS: "SETTINGS",

    ABOUT_ME: "ABOUT ME",
    PROJECTS_H: "Projects",
    SKILLS_H: "Skills",
    EXPERIENCE_H: "Experience",
    CERTIFICATES_H: "Certificates",
    CONTACT_H: "Contact",
    SETTINGS_H: "Settings",
    PORTFOLIO: "portfolio",

    ASK_PLACEHOLDER: "Type your question about me...",
    ASK_BTN: "Ask",
    START_BTN: "START",

    NAME: "Name",
    EMAIL: "Email",
    PHONE: "Phone",
    FACEBOOK: "Facebook",
    LOCATION: "Location",
    GITHUB: "GitHub",
    LINKEDIN: "LinkedIn",
    DOWNLOAD_CV: "Download CV",

    LANGUAGE: "Language",
    ENGLISH: "English",
    VIETNAMESE: "Vietnamese",

    // New keys for descriptions
    TAGLINE: "Code. Create.",
    SOFTWARE_ENGINEER_TITLE: "Software Engineer",
    PROFILE_CARD_DESCRIPTION: "Building modern web & mobile experiences powered by AI.",
    ABOUT_P1: "I’m a <b>Software Engineer</b> passionate about building clean, maintainable web and mobile apps. My focus is on <b>TypeScript, React, and Flutter</b> for front-end and <b>Node.js / Express</b> for back-end development. I love designing modular architectures, improving developer experience, and experimenting with <b>AI-assisted</b> workflows to boost productivity.",
    ABOUT_P2: "Recently, I’ve worked on full-stack projects involving <b>Firebase, REST APIs, and MongoDB</b>. I enjoy solving complex UI logic, optimizing app performance, and creating seamless user experiences.",

    // New keys for AskMeChat local answers
    ASK_NAME_PREFIX: "I'm",
    ASK_NAME_SUFFIX: "People call me",
    ASK_LOCATION_PREFIX: "I'm based in",
    ASK_EMAIL_PREFIX: "Reach me at",
    ASK_SKILLS_DESC: "I work with TypeScript/React, Node/Express, Flutter/Firebase, PostgreSQL & MongoDB. I also optimize SEO (JSON-LD, CWV).",
    ASK_PROJECTS_HIGHLIGHTS_PREFIX: "Some highlights:",
    ASK_SEO_AI_DESC: "Yes — I build SEO automations and experiment with AI-assisted content and tooling.",
    ASK_ODOO_DESC: "I work with Odoo 16 modules (Sales/Inventory/HR) and custom flows.",
    ASK_CERTIFICATES_DESC: "Certificates: TOEIC 835 (ETS, 2024); Google IT Automation with Python (Google/Coursera, 2023).",
    ASK_DEFAULT_QUESTION_PROMPT: "Good question! I can talk about skills, projects, certificates, or how to contact me.",
    ASK_ERROR_MESSAGE: "(Oops) Something went wrong. Try again.",

    // Project descriptions with highlights
    PROJECT_PIZZA_DESC: "Food ordering app with menu browsing, customization, auth, cart, and receipt. Led a <b>3-member team</b>; <b>offline-first</b> mindset with <b>Firestore</b>.",
    PROJECT_STUDENT_PORTAL_DESC: "Academic portal for courses, schedules, and grades. <b>REST APIs (Node.js)</b>, <b>React front-end</b> state management, <b>Agile</b> collaboration.",

    // Skill categories
    SKILLS_LANGUAGES: "Languages",
    SKILLS_FRONTEND: "Frontend",
    SKILLS_BACKEND: "Backend",
    SKILLS_MOBILE: "Mobile",
    SKILLS_TOOLING: "Tooling",
    SKILLS_DOMAIN: "Domain",

    // Experience bullets
    EXP_THANHAN_B1: "Optimized <b>on-page SEO</b> and internal linking for automotive product pages.",
    EXP_THANHAN_B2: "Applied <b>AI-assisted workflows</b> for keyword clustering, content outlines, and performance tracking.",
    EXP_THANHAN_B3: "Monitored <b>Google Search Console & analytics</b> metrics to propose engagement improvements.",

    // Certificate descriptions
    CERT_TOEIC_DESC: "Demonstrates English proficiency for workplace communication.",
    CERT_GOOG_IT_DESC: "<b>Python scripting</b>, <b>Git</b>, troubleshooting, and automation workflows.",
    THEME_DAY: "Day",

    SUGGESTION_1: "What are your strongest skills?",
    SUGGESTION_2: "Tell me about your latest project.",
    SUGGESTION_3: "How can I contact you?",
    SUGGESTION_4: "What are you passionate about?",
  },
  vi: {
    ABOUT: "GIỚI THIỆU",
    PROJECTS: "DỰ ÁN",
    SKILLS: "KỸ NĂNG",
    EXPERIENCE: "KINH NGHIỆM",
    CERTIFICATES: "CHỨNG CHỈ",
    CONTACT: "LIÊN HỆ",
    SETTINGS: "CÀI ĐẶT",

    ABOUT_ME: "GIỚI THIỆU",
    PROJECTS_H: "Dự án",
    SKILLS_H: "Kỹ năng",
    EXPERIENCE_H: "Kinh nghiệm",
    CERTIFICATES_H: "Chứng chỉ",
    CONTACT_H: "Liên hệ",
    SETTINGS_H: "Cài đặt",
    PORTFOLIO: "hồ sơ",

    ASK_PLACEHOLDER: "Hãy hỏi tôi về kỹ năng, dự án, liên hệ...",
    ASK_BTN: "Hỏi",
    START_BTN: "BẮT ĐẦU",

    NAME: "Họ tên",
    EMAIL: "Email",
    PHONE: "Điện thoại",
    FACEBOOK: "Facebook",
    LOCATION: "Địa điểm",
    GITHUB: "GitHub",
    LINKEDIN: "LinkedIn",
    DOWNLOAD_CV: "Tải CV",

    LANGUAGE: "Ngôn ngữ",
    ENGLISH: "Tiếng Anh",
    VIETNAMESE: "Tiếng Việt",

    // New keys for descriptions (Vietnamese translations)
    TAGLINE: "Code. Sáng tạo.",
    SOFTWARE_ENGINEER_TITLE: "Kỹ sư phần mềm",
    PROFILE_CARD_DESCRIPTION: "Xây dựng trải nghiệm web & di động hiện đại được hỗ trợ bởi <b>AI</b>.",
    ABOUT_P1: "Tôi là một <b>Kỹ sư phần mềm</b> đam mê xây dựng các ứng dụng web và di động sạch, dễ bảo trì. Trọng tâm của tôi là <b>TypeScript, React và Flutter</b> cho phát triển giao diện người dùng, và <b>Node.js / Express</b> cho phát triển back-end. Tôi yêu thích việc thiết kế kiến trúc module, cải thiện trải nghiệm nhà phát triển và thử nghiệm các quy trình làm việc <b>hỗ trợ AI</b> để tăng năng suất.",
    ABOUT_P2: "Gần đây, tôi đã làm việc trên các dự án full-stack liên quan đến <b>Firebase, REST APIs và MongoDB</b>. Tôi thích giải quyết logic UI phức tạp, tối ưu hóa hiệu suất ứng dụng và tạo ra trải nghiệm người dùng liền mạch.",

    // New keys for AskMeChat local answers (Vietnamese translations)
    ASK_NAME_PREFIX: "Tôi là",
    ASK_NAME_SUFFIX: "Mọi người gọi tôi là",
    ASK_LOCATION_PREFIX: "Tôi đang ở",
    ASK_EMAIL_PREFIX: "Bạn có thể liên hệ tôi qua",
    ASK_SKILLS_DESC: "Tôi làm việc với TypeScript/React, Node/Express, Flutter/Firebase, PostgreSQL & MongoDB. Tôi cũng tối ưu hóa SEO (JSON-LD, CWV).",
    ASK_PROJECTS_HIGHLIGHTS_PREFIX: "Một số dự án nổi bật:",
    ASK_SEO_AI_DESC: "Vâng — Tôi xây dựng các công cụ tự động hóa SEO và thử nghiệm với các quy trình làm việc và công cụ hỗ trợ AI.",
    ASK_ODOO_DESC: "Tôi làm việc với các module Odoo 16 (Bán hàng/Kho/Nhân sự) và các quy trình tùy chỉnh.",
    ASK_CERTIFICATES_DESC: "Chứng chỉ: TOEIC 835 (ETS, 2024); Google IT Automation with Python (Google/Coursera, 2023).",
    ASK_DEFAULT_QUESTION_PROMPT: "Câu hỏi hay! Tôi có thể nói về kỹ năng, dự án, chứng chỉ, hoặc cách liên hệ với tôi.",
    ASK_ERROR_MESSAGE: "(Ối) Có lỗi xảy ra. Vui lòng thử lại.",

    // Project descriptions (Vietnamese translations)
    PROJECT_PIZZA_DESC: "Ứng dụng đặt đồ ăn với các chức năng duyệt menu, tùy chỉnh, xác thực, giỏ hàng và hóa đơn. Dẫn dắt <b>nhóm 3 thành viên</b>; tư duy <b>offline-first</b> với <b>Firestore</b>.",
    PROJECT_STUDENT_PORTAL_DESC: "Cổng thông tin học tập cho các khóa học, lịch trình và điểm số. <b>REST APIs (Node.js)</b>, quản lý trạng thái <b>front-end React</b>, hợp tác theo <b>Agile</b>.",

    // Skill categories (Vietnamese translations)
    SKILLS_LANGUAGES: "Ngôn ngữ",
    SKILLS_FRONTEND: "Giao diện người dùng",
    SKILLS_BACKEND: "Hệ thống",
    SKILLS_MOBILE: "Di động",
    SKILLS_TOOLING: "Công cụ",
    SKILLS_DOMAIN: "Lĩnh vực",

    // Experience bullets (Vietnamese translations)
    EXP_THANHAN_B1: "Tối ưu hóa <b>SEO on-page</b> và liên kết nội bộ cho các trang sản phẩm ô tô.",
    EXP_THANHAN_B2: "Áp dụng <b>quy trình làm việc có sự hỗ trợ của AI</b> để phân cụm từ khóa, tạo dàn ý nội dung và theo dõi hiệu suất.",
    EXP_THANHAN_B3: "Theo dõi các chỉ số trên <b>Google Search Console & analytics</b> để đề xuất cải thiện tương tác.",

    // Certificate descriptions (Vietnamese translations)
    CERT_TOEIC_DESC: "Chứng tỏ trình độ tiếng Anh để giao tiếp trong môi trường làm việc.",
    CERT_GOOG_IT_DESC: "<b>Viết kịch bản Python</b>, <b>Git</b>, xử lý sự cố và các quy trình tự động hóa.",
    THEME_DAY: "Ban ngày",

    SUGGESTION_1: "Kỹ năng mạnh nhất của bạn là gì?",
    SUGGESTION_2: "Kể tôi nghe về dự án gần đây nhất.",
    SUGGESTION_3: "Làm thế nào để liên hệ với bạn?",
    SUGGESTION_4: "Bạn đam mê điều gì?",
  },
};

// =============================================
// Pixel Portfolio – Single-Page Landing (React)
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
  facebook: "https://www.facebook.com/tghuy/",
  phone: "+84 17174226",
  tagline: "Code. Create.",
};

const PROJECTS: Project[] = [
  {
    title: "Pizza App (Flutter + Firebase) – Team Lead",
    year: "2025",
    description: "PROJECT_PIZZA_DESC",
    tags: ["Flutter", "Firebase", "Auth", "Cart", "Offline-first"],
    github: "",
    store: "",
  },
  {
    title: "Student Management Portal (React + Node)",
    year: "2024",
    description: "PROJECT_STUDENT_PORTAL_DESC",
    tags: ["React", "Node", "REST", "MongoDB"],
    github: "",
    live: "",
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
    urls: ["https://thanhanautocare.com", "https://camerahanhtrinhxeoto.vn"],
    bullets: ["EXP_THANHAN_B1", "EXP_THANHAN_B2", "EXP_THANHAN_B3"],
  },
];

const CERTIFICATES: Certificate[] = [
  {
    title: "TOEIC 520 (Listening & Reading)",
    issuer: "ETS",
    year: "2022",
    desc: "CERT_TOEIC_DESC",
  },
  {
    title: "Google IT Automation with Python",
    issuer: "Google / Coursera",
    year: "2025",
    desc: "CERT_GOOG_IT_DESC",
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
  day: {
    name: "THEME_DAY",
    bg: "#ffffff",
    paper: "#f5f5f5",
    ink: "#111827",
    dim: "#6b7280",
    accent: "#3b82f6",
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

/* ===========================
   Typewriter: HTML-aware (<b>)
   =========================== */
type Token = { text: string; bold: boolean };

// parse "<b>..</b>" into tokens
function toTokens(htmlish: string): Token[] {
  const parts = htmlish.split(/<b>(.*?)<\/b>/g);
  const tokens: Token[] = [];
  for (let i = 0; i < parts.length; i++) {
    const txt = parts[i];
    if (!txt) continue;
    tokens.push({ text: txt, bold: i % 2 === 1 });
  }
  return tokens;
}

function tokensLength(tokens: Token[]) {
  return tokens.reduce((s, t) => s + t.text.length, 0);
}

function sliceTokens(tokens: Token[], n: number): Token[] {
  if (n <= 0) return [];
  const out: Token[] = [];
  let remain = n;
  for (const tk of tokens) {
    if (remain <= 0) break;
    if (tk.text.length <= remain) {
      out.push({ ...tk });
      remain -= tk.text.length;
    } else {
      out.push({ text: tk.text.slice(0, remain), bold: tk.bold });
      remain = 0;
    }
  }
  return out;
}

const TypewriterHTML: React.FC<{
  text: string;
  speed?: number; // chars/sec
  start?: boolean;
  className?: string;
  cursor?: boolean;
  onDone?: () => void;
}> = ({ text, speed = 70, start = true, className, cursor = true, onDone }) => {
  const tokens = useMemo(() => toTokens(text), [text]);
  const total = useMemo(() => tokensLength(tokens), [tokens]);
  const [n, setN] = useState(0);

  useEffect(() => {
    setN(0);
  }, [text, start]);

  useEffect(() => {
    if (!start) return;
    if (n >= total) {
      onDone?.();
      return;
    }
    const dt = 1000 / speed;
    const id = setTimeout(() => setN((v) => Math.min(total, v + 1)), dt);
    return () => clearTimeout(id);
  }, [n, total, speed, start, onDone]);

  const view = sliceTokens(tokens, n);
  return (
    <span className={className}>
      {view.map((tk, i) =>
        tk.bold ? (
          <b key={i} className="highlight-text">
            {tk.text}
          </b>
        ) : (
          <React.Fragment key={i}>{tk.text}</React.Fragment>
        )
      )}
      {cursor && n < total ? <span className="tw-caret">|</span> : null}
    </span>
  );
};

/* quick hook for tab section: toggles typing each time tab changes */
const SectionType: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return <div className="animate-[contentFadeIn_300ms_ease-out]">{children}</div>;
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

// ---- Ask-Me Chat (local rules + optional API) ----
const USE_BACKEND = true;
const API_URL = "/api/ask";

type ChatMsg = { role: "user" | "bot"; text: string; animate?: boolean };

const AskMeChat: React.FC<{ t: (k: string) => string }> = ({ t }) => {
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [msgs, setMsgs] = useState<ChatMsg[]>(
    () => {
      if (typeof window === "undefined") return [];
      try {
        return JSON.parse(localStorage.getItem("askme_chat") || "[]");
      } catch {
        return [];
      }
    }
  );
  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("askme_chat", JSON.stringify(msgs));
  }, [msgs]);

  const pickRandom = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

  const localAnswer = (q: string): string => {
    const s = q.toLowerCase();
    if (/\b(name|who are you|tên)\b/.test(s))
      return pickRandom([
        `${t("ASK_NAME_PREFIX")} ${PROFILE.name}. ${t("ASK_NAME_SUFFIX")} ${PROFILE.handle}.`,
        `You can call me ${PROFILE.handle}. My full name is ${PROFILE.name}.`,
        `${PROFILE.name}, at your service!`,
      ]);
    if (/(where|ở đâu|location|based)/.test(s))
      return pickRandom([
        `${t("ASK_LOCATION_PREFIX")} ${PROFILE.location}.`,
        `I'm currently in ${PROFILE.location}.`,
        `You can find me in sunny ${PROFILE.location}.`,
      ]);
    if (/(email|contact|liên hệ)/.test(s))
      return pickRandom([
        `${t("ASK_EMAIL_PREFIX")} ${PROFILE.email}.`,
        `The best way to reach me is via email: ${PROFILE.email}`,
        `Feel free to send me an email at ${PROFILE.email}.`,
      ]);
    if (/(skills?|tech|stack|kỹ năng)/.test(s))
      return pickRandom([
        t("ASK_SKILLS_DESC"),
        `My main tools are React, Node, and Flutter. I'm also into SEO and AI tooling.`,
        `I'm proficient in the MERN stack and have strong experience with Flutter for mobile development.`,
      ]);
    if (/(project|dự án|portfolio)/.test(s))
      return `${t("ASK_PROJECTS_HIGHLIGHTS_PREFIX")} ${PROJECTS.map((p) => p.title + " (" + p.year + ")")
        .slice(0, 3)
        .join("; ")}.`;
    if (/(seo|ai)/.test(s)) return t("ASK_SEO_AI_DESC");
    if (/odoo/.test(s)) return t("ASK_ODOO_DESC");
    if (/(certificate|chứng chỉ|toeic|coursera|google)/.test(s)) return t("ASK_CERTIFICATES_DESC");
    return pickRandom([
      t("ASK_DEFAULT_QUESTION_PROMPT"),
      "Ask me about my tech stack, past projects, or anything else!",
      "I'm ready for your questions.",
    ]);
  };

  const ask = async (question?: string) => {
    const q = (question || input).trim();
    if (!q) return;
    setInput("");
    setMsgs((m) => [...m, { role: "user", text: q }]);
    if (question) setBusy(true);
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
        if (r.ok) {
          const j = await r.json();
          if (j?.answer) answer = j.answer;
        }
      }
      // push bot message with animate flag
      setMsgs((m) => [...m, { role: "bot", text: answer, animate: true }]);
    } catch (error) {
      setMsgs((m) => [...m, { role: "bot", text: t("ASK_ERROR_MESSAGE") }]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className="relative h-auto min-h-[180px] md:min-h-[220px] lg:min-h-[260px] max-h-[60vh] border border-[var(--ink-dim)] p-2 flex flex-col"
      style={{ minHeight: "clamp(180px, 25vh, 320px)", maxHeight: "60vh" }}
    >
      <div className="flex-1 overflow-auto space-y-1 pr-1">
        {msgs.length === 0 && (
          <div className="text-[10px] text-[var(--ink-dim)]">{t("ASK_PLACEHOLDER")}</div>
        )}
        {msgs.map((m, i) => {
          const isLast = i === msgs.length - 1 && m.role === "bot" && m.animate;
          return (
            <div
              key={i}
              className={`text-[12px] ${m.role === "user" ? "text-[var(--accent)]" : "text-[var(--ink)]"}`}
            >
              <span className="opacity-70">{m.role === "user" ? ">" : "•"}</span>{" "}
              {isLast ? (
                <TypewriterHTML
                  text={m.text}
                  speed={90}
                  start={true}
                  cursor
                  onDone={() => {
                    // freeze: remove animate flag so caret disappears
                    setMsgs((all) => {
                      const clone = [...all];
                      const last = clone[clone.length - 1];
                      if (last && last.role === "bot") last.animate = false;
                      return clone;
                    });
                  }}
                />
              ) : (
                <span>{m.text}</span>
              )}
            </div>
          );
        })}
      </div>
      <div className="mt-2 mb-2 text-[10px] text-[var(--ink-dim)]">
        <div className="flex flex-wrap gap-2">
          {[t("SUGGESTION_1"), t("SUGGESTION_2"), t("SUGGESTION_3"), t("SUGGESTION_4")].map((s) => (
            <button
              key={s}
              onClick={() => ask(s)}
              disabled={busy}
              className="px-2 py-1 border border-[var(--ink-dim)] text-[var(--ink)] hover:bg-[var(--ink)]/10 disabled:opacity-50"
            >
              {s}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-2 flex items-center gap-2">
        <input
          className="flex-1 bg-transparent border border-[var(--ink-dim)] px-2 py-1 text-sm outline-none"
          placeholder={t("ASK_PLACEHOLDER")}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !busy) ask();
          }}
        />
        <button
          onClick={() => ask()}
          disabled={busy}
          className="px-3 py-1 bg-[var(--accent)] text-black text-sm font-bold disabled:opacity-60 transition-transform hover:scale-105 active:scale-100"
        >
          {t("ASK_BTN")}
        </button>
      </div>
    </div>
  );
};

/**
 * Mini game: PIXEL DODGE
 */
const MiniDodgeGame: React.FC<{ startLabel: string }> = ({ startLabel }) => {
  const ref = React.useRef<HTMLCanvasElement | null>(null);
  const [running, setRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [hi, setHi] = useState<number>(() => {
    if (typeof window === "undefined") return 0;
    return Number(localStorage.getItem("pd_hi") || 0);
  });

  useEffect(() => {
    const canvas = ref.current!;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const DPR = window.devicePixelRatio || 1;
      canvas.width = Math.max(1, Math.floor(rect.width * DPR));
      canvas.height = Math.max(1, Math.floor(rect.height * DPR));
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      return { w: rect.width, h: rect.height };
    };

    let raf = 0,
      last = 0;
    let { w: W, h: H } = resizeCanvas();

    const onResize = () => {
      const wh = resizeCanvas();
      W = wh.w;
      H = wh.h;
    };
    window.addEventListener("resize", onResize);

    const ship = { x: W - 40, y: H - 18, w: 12, h: 8, vx: 0 } as any;
    const keys = new Set<string>();
    const blocks: { x: number; y: number; w: number; h: number; v: number; bad: boolean }[] = [];

    const spawn = () => {
      const bad = Math.random() < 0.7;
      const w = bad ? 10 + Math.random() * 20 : 6;
      blocks.push({
        x: Math.random() * Math.max(10, W - w),
        y: -10,
        w,
        h: bad ? 8 + Math.random() * 10 : 6,
        v: 28 + Math.random() * 40,
        bad,
      });
    };

    let acc = 0;
    const collide = (a: any, b: any) =>
      !(a.x + a.w < b.x || b.x + b.w < a.x || a.y + a.h < b.y || b.y + b.h < a.y);

    const step = (ms: number) => {
      const dt = Math.min(0.033, (ms - last) / 1000 || 0);
      last = ms;
      if (!running) {
        raf = requestAnimationFrame(step);
        return;
      }
      acc += dt;
      ship.vx =
        keys.has("ArrowLeft") || keys.has("a")
          ? -85
          : keys.has("ArrowRight") || keys.has("d")
          ? 85
          : 0;
      ship.x = Math.max(2, Math.min(W - ship.w - 2, ship.x + ship.vx * dt));

      if (blocks.length < 24 && acc > 0.08) {
        spawn();
        acc = 0;
      }

      for (let i = blocks.length - 1; i >= 0; i--) {
        const b = blocks[i];
        b.y += b.v * dt;
        if (b.y > H + 20) blocks.splice(i, 1);
      }

      blocks.forEach((b, i) => {
        if (collide(ship, b)) {
          if (b.bad) {
            setHi((h) => Math.max(h, score));
            setScore(0);
            ship.x = W - 40;
            blocks.splice(0, blocks.length);
            setRunning(false);
          } else {
            setScore((s) => s + 1);
            blocks.splice(i, 1);
          }
        }
      });

      ctx.clearRect(0, 0, W, H);

      blocks.forEach((b) => {
        ctx.fillStyle = b.bad
          ? getComputedStyle(document.documentElement).getPropertyValue("--ink")
          : getComputedStyle(document.documentElement).getPropertyValue("--accent");
        if (b.bad) ctx.fillRect(b.x, b.y, b.w, b.h);
        else {
          ctx.beginPath();
          ctx.moveTo(b.x, b.y + b.h);
          ctx.lineTo(b.x + b.w / 2, b.y);
          ctx.lineTo(b.x + b.w, b.y + b.h);
          ctx.closePath();
          ctx.fill();
        }
      });

      ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue("--ink");
      ctx.fillRect(ship.x, ship.y, ship.w, ship.h);
      ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue("--accent");
      ctx.beginPath();
      ctx.moveTo(ship.x + ship.w / 2, ship.y + ship.h);
      ctx.lineTo(ship.x + ship.w / 2 - 4, ship.y + ship.h + 8);
      ctx.lineTo(ship.x + ship.w / 2 + 4, ship.y + ship.h + 8);
      ctx.closePath();
      ctx.fill();

      raf = requestAnimationFrame(step);
    };

    const down = (e: KeyboardEvent) => {
      keys.add(e.key);
    };
    const up = (e: KeyboardEvent) => {
      keys.delete(e.key);
    };
    const vis = () => {
      if (document.hidden) setRunning(false);
    };

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
      className="relative h-auto min-h-[140px] md:min-h-[180px] lg:min-h-[220px] max-h-[55vh]"
      style={{ minHeight: "clamp(140px, 20vh, 260px)", maxHeight: "55vh" }}
    >
      <canvas ref={ref} className="w-full h-full block" />
      <div className="absolute left-2 top-2 px-2 py-1 border border-[var(--ink-dim)] bg-[var(--paper)]/30 backdrop-blur-[1px] text-[10px]">
        <span className="mr-3">
          score <b>{score}</b>
        </span>
        <span>hi {Math.max(hi, score)}</span>
      </div>
      <div className="absolute inset-x-0 bottom-1 flex items-center justify-between px-2 text-[10px] text-[var(--ink-dim)]">
        <span>◄ ► / A D to move</span>
        <span>avoid ■ collect ▽</span>
      </div>
      {!running && (
        <button
          onClick={() => setRunning(true)}
          className="absolute inset-0 m-auto h-8 w-28 bg-[var(--accent)] text-black font-bold transition-transform hover:scale-105 active:scale-100"
        >
          {startLabel}
        </button>
      )}
    </div>
  );
};

// ---- Panels with typewriter ---------------------------------
const About: React.FC<{ t: (k: string) => string }> = ({ t }) => (
  <SectionType>
    <div className="text-[var(--ink-dim)] uppercase text-xs mb-2 tracking-wider">{t("ABOUT_ME")}</div>

    <p className="leading-relaxed text-lg">
      <TypewriterHTML text={t("ABOUT_P1")} speed={90} start cursor />
    </p>

    <p className="leading-relaxed text-lg mt-2">
      <TypewriterHTML text={t("ABOUT_P2")} speed={90} start cursor />
    </p>

    <ul className="mt-4 grid grid-cols-2 gap-2 text-sm">
      {["TypeScript / React","Node / Express","Flutter / Firebase","PostgreSQL / MongoDB","TailwindCSS / Vite","REST / JSON / API Design"].map((s, i) => (
        <li key={i} className="opacity-80">
          <TypewriterHTML text={s} speed={150} start />
        </li>
      ))}
    </ul>
  </SectionType>
);

const Projects: React.FC<{ t: (k: string) => string }> = ({ t }) => (
  <SectionType>
    <div className="text-[var(--ink-dim)] uppercase text-xs mb-4 tracking-wider">{t("PROJECTS_H")}</div>
    <div className="space-y-4">
      {PROJECTS.map((p) => (
        <a
          key={p.title}
          href={p.url || p.live || p.github || "#"}
          className="block group border border-[var(--ink-dim)] p-3 hover:border-[var(--accent)]"
          target={p.url || p.live || p.github ? "_blank" : undefined}
          rel={p.url || p.live || p.github ? "noreferrer" : undefined}
        >
          <div className="flex items-start justify-between">
            <h3 className="font-bold group-hover:text-[var(--accent)]">{p.title}</h3>
            <span className="text-xs text-[var(--ink-dim)]">{p.year}</span>
          </div>
          <p className="text-sm opacity-90 mt-1">
            <TypewriterHTML text={t(p.description)} speed={110} start cursor />
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {p.tags.map((tg) => (
              <span key={tg} className="text-[10px] px-2 py-[2px] border border-[var(--ink-dim)]">
                {tg}
              </span>
            ))}
          </div>
        </a>
      ))}
    </div>
  </SectionType>
);

const Skills: React.FC<{ t: (k: string) => string }> = ({ t }) => (
  <SectionType>
    <div className="text-[var(--ink-dim)] uppercase text-xs mb-4 tracking-wider">{t("SKILLS_H")}</div>
    <div className="grid sm:grid-cols-2 gap-3 text-sm">
      {[
        { label: t("SKILLS_LANGUAGES"), items: SKILLS.languages },
        { label: t("SKILLS_FRONTEND"), items: SKILLS.frontend },
        { label: t("SKILLS_BACKEND"), items: SKILLS.backend },
        { label: t("SKILLS_MOBILE"), items: SKILLS.mobile },
        { label: t("SKILLS_TOOLING"), items: SKILLS.tooling },
        { label: t("SKILLS_DOMAIN"), items: SKILLS.domain },
      ].map((grp) => (
        <div key={grp.label}>
          <div className="text-[var(--ink-dim)] text-xs uppercase">{grp.label}</div>
          <div className="flex flex-wrap gap-2 mt-1">
            {grp.items.map((s) => (
              <span key={s} className="text-[10px] px-2 py-[2px] border border-[var(--ink-dim)]">
                <TypewriterHTML text={s} speed={180} start />
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  </SectionType>
);

const Experience: React.FC<{ t: (k: string) => string }> = ({ t }) => (
  <SectionType>
    <div className="text-[var(--ink-dim)] uppercase text-xs mb-4 tracking-wider">{t("EXPERIENCE_H")}</div>
    <div className="space-y-3">
      {EXPERIENCE.map((e) => (
        <div key={e.role + e.company} className="p-3 border border-[var(--ink-dim)]">
          <div className="flex items-start justify-between">
            <div className="font-semibold">
              {e.role} · <span className="opacity-90">{e.company}</span>
            </div>
            <div className="text-xs text-[var(--ink-dim)]">{e.period}</div>
          </div>
          <ul className="mt-1 list-disc list-inside text-sm opacity-90">
            {e.bullets.map((b, i) => (
              <li key={i}>
                <TypewriterHTML text={t(b)} speed={120} start cursor />
              </li>
            ))}
          </ul>

          {Array.isArray(e.urls) && e.urls.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {e.urls.map((u, i) => (
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
  </SectionType>
);

const Certificates: React.FC<{ t: (k: string) => string }> = ({ t }) => (
  <SectionType>
    <div className="text-[var(--ink-dim)] uppercase text-xs mb-4 tracking-wider">{t("CERTIFICATES_H")}</div>
    <div className="space-y-3">
      {CERTIFICATES.map((c) => (
        <div key={c.title} className="p-3 border border-[var(--ink-dim)]">
          <div className="flex items-start justify-between">
            <div className="font-semibold">
              {c.title} <span className="opacity-60 text-xs">· {c.issuer}</span>
            </div>
            <div className="text-xs text-[var(--ink-dim)]">{c.year}</div>
          </div>
          <div className="text-sm opacity-90 mt-1">
            {c.desc ? <TypewriterHTML text={t(c.desc)} speed={110} start cursor /> : ""}
          </div>
        </div>
      ))}
    </div>
  </SectionType>
);

const Contact: React.FC<{ t: (k: string) => string }> = ({ t }) => {
  return (
    <SectionType>
      <div className="text-[var(--ink-dim)] uppercase text-xs mb-3 tracking-wider">{t("CONTACT_H")}</div>
      <div className="space-y-4 max-w-md text-sm">
        <div>
          <div className="text-xs opacity-80">{t("NAME")}</div>
          <div className="font-semibold">{PROFILE.name}</div>
        </div>

        <div>
          <div className="text-xs opacity-80">{t("EMAIL")}</div>
          <a className="underline break-words" href={`mailto:${PROFILE.email}`}>
            {PROFILE.email}
          </a>
        </div>

        <div>
          <div className="text-xs opacity-80">{t("PHONE")}</div>
          <a className="underline" href={`tel:${PROFILE.phone}`}>
            {PROFILE.phone}
          </a>
        </div>

        <div>
          <div className="text-xs opacity-80">{t("FACEBOOK")}</div>
          <a className="underline break-words" href={PROFILE.facebook} target="_blank" rel="noreferrer">
            {PROFILE.facebook.replace(/^https?:\/\//, "")}
          </a>
        </div>

        <div>
          <div className="text-xs opacity-80">{t("LOCATION")}</div>
          <div>{PROFILE.location}</div>
        </div>

        <div>
          <div className="text-xs opacity-80">{t("GITHUB")}</div>
          <a className="underline break-words" href={PROFILE.github} target="_blank" rel="noreferrer">
            {PROFILE.github.replace(/^https?:\/\//, "")}
          </a>
        </div>

        <div>
          <div className="text-xs opacity-80">{t("LINKEDIN")}</div>
          <a className="underline break-words" href={PROFILE.linkedin} target="_blank" rel="noreferrer">
            {PROFILE.linkedin.replace(/^https?:\/\//, "")}
          </a>
        </div>

        <div className="mt-3">
          <a
            href="/CV_Tran_Gia_Huy.pdf"
            download="CV_Tran_Gia_Huy.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-3 py-2 bg-[var(--accent)] text-black font-semibold text-sm rounded"
          >
            {t("DOWNLOAD_CV")}
          </a>
        </div>
      </div>
    </SectionType>
  );
};

const Settings: React.FC<{
  themeKey: keyof typeof THEMES;
  setThemeKey: (k: keyof typeof THEMES) => void;
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (k: string) => string;
}> = ({ themeKey, setThemeKey, lang, setLang, t }) => (
  <SectionType>
    <div className="text-[var(--ink-dim)] uppercase text-xs mb-3 tracking-wider">{t("SETTINGS_H")}</div>

    {/* Language switch */}
    <div className="mb-4 flex items-center gap-3">
      <span className="text-sm">{t("LANGUAGE")}:</span>
      <button
        onClick={() => setLang(lang === "en" ? "vi" : "en")}
        className="relative inline-flex items-center h-7 rounded-full border border-[var(--ink-dim)] px-2 transition-transform hover:scale-105 active:scale-100"
        aria-label="Toggle language"
        title="Toggle language"
      >
        <span className={`text-xs mr-2 ${lang === "en" ? "font-semibold" : "opacity-70"}`}>{t("ENGLISH")}</span>
        <span className={`w-9 h-4 rounded-full transition-colors ${lang === "vi" ? "bg-[var(--accent)]" : "bg-transparent border border-[var(--ink-dim)]"}`} />
        <span className={`text-xs ml-2 ${lang === "vi" ? "font-semibold" : "opacity-70"}`}>{t("VIETNAMESE")}</span>
      </button>
    </div>

    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {Object.entries(THEMES).map(([key, tTheme]) => (
        <button
          key={key}
          onClick={() => setThemeKey(key as keyof typeof THEMES)}
          className={`p-3 border text-left ${themeKey === key ? "border-[var(--accent)]" : "border-[var(--ink-dim)]"}`}
        >
          <div className="flex items-center gap-2">
            <span className="inline-block w-4 h-4" style={{ background: tTheme.accent }} />
            <span className="font-semibold">{t(tTheme.name)}</span>
          </div>
          <div className="mt-2 flex gap-1">
            <span className="w-6 h-4" style={{ background: tTheme.bg }} />
            <span className="w-6 h-4" style={{ background: tTheme.paper }} />
            <span className="w-6 h-4" style={{ background: tTheme.ink }} />
          </div>
        </button>
      ))}
    </div>
  </SectionType>
);

// ---- Style Injector (pixel vibe & variables) ----------------
const StyleInjector: React.FC = () => (
  <style>{`
    @keyframes stars {
      from { background-position: 0 0; }
      to { background-position: -10000px 5000px; }
    }
    @keyframes flicker {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.95; }
    }
    @keyframes contentFadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .tw-caret {
      display:inline-block;
      margin-left:2px;
      animation: twblink 1s steps(2, start) infinite;
    }
    @keyframes twblink {
      to { visibility: hidden; }
    }

    * { box-sizing: border-box; }
    body {
      color: var(--ink);
      font-family: 'Pixelify Sans', sans-serif;
    }
    .pixel-border {
      border-style: double;
      border-width: 3px;
      border-color: var(--accent);
    }
    .highlight-text {
      color: var(--accent);
      transition: color 0.2s, background-color 0.2s;
    }
    .highlight-text:hover {
      background-color: var(--accent-dim);
    }
    a.underline:hover {
      color: var(--accent);
    }
  `}</style>
);

// ---- Main ----------------------------------------------------
export default function App() {
  const [themeKey, setThemeKey] = useState<keyof typeof THEMES>("day");
  const theme = THEMES[themeKey];

  const [lang, setLang] = useState<Lang>("en");
  const t = (k: string) => I18N[lang][k] ?? k;

  const [tab, setTab] = useState<
    "ABOUT" | "PROJECTS" | "SKILLS" | "EXPERIENCE" | "CERTIFICATES" | "CONTACT" | "SETTINGS"
  >("ABOUT");
  const menuItems = useMemo(
    () => ["ABOUT", "PROJECTS", "SKILLS", "EXPERIENCE", "CERTIFICATES", "CONTACT", "SETTINGS"],
    []
  );
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

  useEffect(() => {
    if (typeof document !== "undefined") document.title = PROFILE.handle;
  }, []);

  // Smoke tests (silent)
  useEffect(() => {
    try {
      const asserts: Array<[boolean, string]> = [
        [typeof (AskMeChat as any) === "function", "AskMeChat defined"],
        [typeof (MiniDodgeGame as any) === "function", "MiniDodgeGame defined"],
      ];
      const failed = asserts.filter(([ok]) => !ok).map(([, msg]) => msg);
      if (failed.length) throw new Error("Smoke tests failed: " + failed.join(", "));
    } catch (e) {
      console.error("[smoke] test failed:", e);
    }
  }, []);

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: "var(--bg)",
        backgroundImage:
          "radial-gradient(var(--ink-dim) 1px, transparent 1px), radial-gradient(var(--ink-dim) 1px, transparent 1px)",
        backgroundSize: "40px 40px, 40px 40px",
        animation: "stars 240s linear infinite",
        backgroundPosition: "0 0, 20px 20px",
      }}
    >
      {/* Top frame */}
      <div className="h-1 w-full bg-[var(--ink)] opacity-20" />

      {/* Content */}
      <div className="w-full max-w-7xl mx-auto px-4 lg:px-8 py-6 flex flex-col lg:grid items-start lg:grid-cols-[1.25fr_0.95fr] gap-8">
        {/* Right: Terminal Panel (order-1 on mobile) */}
        <section className="pixel-border relative bg-[var(--paper)] shadow-[0_0_0_2px_var(--paper)] min-h-0 overflow-auto order-1 lg:order-2">
          {/* title bar */}
          <div className="flex items-center gap-2 px-3 py-2 border-b border-[var(--ink-dim)]">
            <div className="w-2 h-2 rounded-sm bg-[var(--accent)] shadow-[0_0_8px_var(--accent)]" />
            <div className="text-[var(--ink-dim)] text-xs">{PROFILE.handle}</div>
            <div className="ml-auto text-[10px] text-[var(--ink-dim)]">↑/↓ to navigate • Enter ▶</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[160px_1fr]">
            {/* menu */}
            <nav className="border-b md:border-b-0 md:border-r border-[var(--ink-dim)] p-3">
              {menuItems.map((m, i) => (
                <button
                  key={m}
                  onClick={() => {
                    setTab(m as any);
                    setIndex(i);
                  }}
                  className={`block w-full text-left px-2 py-1 text-sm tracking-wider uppercase transition-all duration-150 hover:scale-105 active:scale-100 ${
                    i === index ? "bg-[var(--accent)] text-black font-bold" : "text-[var(--ink)] hover:bg-[var(--ink)]/10"
                  }`}
                >
                  {t(m)}
                </button>
              ))}
            </nav>

            {/* content */}
            <div key={tab} className="p-4 lg:p-6 text-[var(--ink)] content-panel">
              {tab === "ABOUT" && <About t={t} />}
              {tab === "PROJECTS" && <Projects t={t} />}
              {tab === "SKILLS" && <Skills t={t} />}
              {tab === "EXPERIENCE" && <Experience t={t} />}
              {tab === "CERTIFICATES" && <Certificates t={t} />}
              {tab === "CONTACT" && <Contact t={t} />}
              {tab === "SETTINGS" && <Settings themeKey={themeKey} setThemeKey={setThemeKey} lang={lang} setLang={setLang} t={t} />}
            </div>
          </div>

          {/* status bar */}
          <div className="border-t border-[var(--ink-dim)] px-3 py-2 text-[10px] text-[var(--ink-dim)] flex items-center gap-3">
            <span className="flex items-center gap-2">
              <PixelCat /> tran-gia-huy portfolio v1.0
            </span>
            <span className="ml-auto">{PROFILE.handle}</span>
          </div>
        </section>

        {/* Left: Pixel Room (order-2 on mobile) */}
        <section className="pixel-border relative p-4 lg:p-6 bg-[var(--paper)] shadow-[0_0_0_2px_var(--paper)] min-h-0 overflow-auto order-2 lg:order-1">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[var(--ink-dim)] text-[10px] uppercase tracking-widest">{t("TAGLINE")}</div>
            </div>
            <div className="text-[var(--ink-dim)] text-[10px]">{PROFILE.location}</div>
          </div>

          <div className="mt-6 flex flex-col md:grid md:grid-cols-3 gap-4">
            {/* Profile card (order-1 on mobile) */}
            <div className="order-1 md:order-2 col-span-1 md:col-span-1 border border-[var(--ink-dim)] p-4 flex flex-col justify-between min-h-0">
              <div>
                <div className="text-[var(--ink-dim)] text-xs uppercase">{t("PORTFOLIO")}</div>
                <h1 className="text-4xl font-black leading-tight mt-1 text-[var(--accent)] transition-all duration-300 hover:tracking-wide hover:drop-shadow-[0_0_4px_var(--accent)]">
                  {PROFILE.name}
                </h1>
                <p className="text-[var(--ink-dim)] text-sm mt-1">{t("SOFTWARE_ENGINEER_TITLE")}</p>
                <p className="text-[var(--ink)] text-sm mt-3 opacity-90">
                  <TypewriterHTML text={t("PROFILE_CARD_DESCRIPTION")} speed={120} start cursor />
                </p>
                {/* Links */}
                <div className="mt-4 flex flex-col items-start gap-2">
                  <div className="flex flex-col gap-1 text-base">
                    <a className="underline text-[var(--ink)]/90" href={PROFILE.github} target="_blank" rel="noreferrer">
                      GitHub
                    </a>
                    <a className="underline text-[var(--ink)]/90" href={PROFILE.linkedin} target="_blank" rel="noreferrer">
                      LinkedIn
                    </a>
                    <a className="underline text-[var(--ink)]/90" href={`mailto:${PROFILE.email}`}>
                      Email
                    </a>
                  </div>
                  <a
                    href="/CV_Tran_Gia_Huy.pdf"
                    download="CV_Tran_Gia_Huy.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Download CV_Tran_Gia_Huy.pdf (PDF)"
                    className="mt-2 inline-block px-3 py-2 bg-[var(--accent)] text-black font-semibold text-sm rounded transition-transform hover:scale-105 active:scale-100"
                  >
                    {t("DOWNLOAD_CV")}
                  </a>
                </div>
              </div>
              <div />
            </div>

            {/* Main content (order-2 on mobile) */}
            <div className="order-2 md:order-1 col-span-1 md:col-span-2 space-y-4">
              {/* Chat */}
              <AskMeChat t={t} />

              {/* Mini game */}
              <div className="relative border border-[var(--ink-dim)] p-3">
                <MiniDodgeGame startLabel={t("START_BTN")} />
              </div>

              {/* posters */}
              <div className="grid grid-cols-3 gap-2">
                <Poster title="Python" />
                <Poster title="JavaScript" />
                <Poster title="Flutter" subtitle="Mobile" />
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Bottom frame */}
      <div className="h-1 w-full bg-[var(--ink)] opacity-20" />

      <StyleInjector />
    </div>
  );
}
