import { useState, type ReactNode } from "react";

/* ------------------------------------------------------------------ */
/*  Content — source of truth: Gia Huy Tran's CVs (Developer +         */
/*  Technical Marketing, 2026). Do not add items that are not in them. */
/* ------------------------------------------------------------------ */

const PROFILE = {
  name: "Gia Huy Tran",
  role: "Full-Stack Developer & Technical Marketer",
  location: "Ho Chi Minh City, VN",
  email: "tghuy141@gmail.com",
  phone: "+84 817 174 226",
  phoneHref: "tel:+84817174226",
  github: "https://github.com/huytr14",
  linkedin: "https://www.linkedin.com/in/tghuy14",
};

/* Opens Gmail's compose window directly (a bare mailto: does nothing on
   devices without a default mail app). */
const GMAIL_COMPOSE = `https://mail.google.com/mail/?view=cm&fs=1&to=${PROFILE.email}&su=${encodeURIComponent(
  "Hello Gia Huy — from your portfolio",
)}`;

const NAV = [
  { n: "01", label: "About", href: "#about" },
  { n: "02", label: "Experience", href: "#experience" },
  { n: "03", label: "Projects", href: "#projects" },
  { n: "04", label: "Contact", href: "#contact" },
];

const HYBRID = [
  {
    title: "Build it",
    text: "Websites and APIs built end to end — .NET Core, C#, PHP and React, from database to interface.",
  },
  {
    title: "Grow it",
    text: "The same products marketed properly — Meta Ads, technical SEO with Schema Markup, and content strategy.",
  },
  {
    title: "Ship faster with AI",
    text: "AI-assisted development with Cursor, Claude Code, Codex and Antigravity to research, build and iterate faster.",
  },
];

const SKILLS: { label: string; items: string[] }[] = [
  {
    label: "Backend",
    items: [".NET Core", "ASP.NET", "Entity Framework", "C#", "PHP", "Node.js", "RESTful API", "JWT Auth", "OOP / SOLID"],
  },
  {
    label: "Frontend",
    items: ["JavaScript", "TypeScript", "React.js", "HTML5 / CSS3"],
  },
  {
    label: "Databases",
    items: ["SQL Server", "PostgreSQL", "MongoDB", "Firebase"],
  },
  {
    label: "Marketing & Growth",
    items: ["Meta Ads", "Technical SEO (Schema Markup)", "Content Strategy", "Lead Quality Tracking"],
  },
  {
    label: "AI-Assisted Development",
    items: ["Cursor", "Claude Code", "Codex", "Antigravity"],
  },
  {
    label: "Tools",
    items: ["Git (GitHub / GitLab)", "Docker", "Postman", "Jira", "Figma", "Visual Studio", "VS Code"],
  },
];

const EXPERIENCE = [
  {
    company: "LYS Travel",
    role: "Website / Digital Marketing & AI Support",
    period: "Apr 2026 — Present",
    url: "https://lystravel.com.vn",
    bullets: [
      "Support and maintain the company website (lystravel.com.vn) and its web and social media workflows.",
      "Plan and optimise Meta Ads campaigns for outbound tours, tracking lead quality and adjusting creatives based on performance.",
      "Use AI tools to speed up research, copywriting, data organisation and customer response preparation.",
    ],
    tags: ["Meta Ads", "Website", "Digital Content", "AI Tools"],
  },
  {
    company: "Fully Protected",
    fullName: "Fully Protected Insurance Agency",
    role: "Website Manager & Marketing",
    period: "Nov 2025 — Jun 2026",
    url: "https://fullyprotectedins.com",
    bullets: [
      "Managed the company website day to day: content updates, performance monitoring and bug fixes (HTML, CSS, PHP, CMS).",
      "Implemented technical SEO (Schema Markup) to improve search visibility and ranking.",
      "Ran ad campaigns and managed content strategy across social media platforms.",
    ],
    tags: ["PHP", "CMS", "Technical SEO", "Content Strategy"],
  },
];

const PROJECTS = [
  {
    title: "FullyProtectedIns.com",
    kind: "Insurance Agency Website",
    description:
      "The agency's marketing website, built in PHP — landing pages for its insurance products that guide visitors towards contact and quote requests, plus custom PHP tools that support its marketing workflows. Improved page load speed, fixed front-end and back-end bugs, and added Schema Markup for SEO.",
    tags: ["PHP", "HTML", "CSS", "JavaScript", "SEO", "Schema Markup"],
    url: "https://fullyprotectedins.com",
  },
  {
    title: "NgaKimLe",
    kind: "E-commerce Website",
    description:
      "An online store built in PHP, handling front-end, back-end and hosting independently. Core shopping features — product listing, cart and order handling — developed with AI-assisted coding to iterate on features quickly.",
    tags: ["PHP", "HTML", "CSS", "JavaScript", "AI-Assisted Development"],
    url: null as string | null,
  },
];

/* ------------------------------ UI ------------------------------ */

function Logo() {
  return (
    <a href="#top" className="flex items-center" aria-label="huy — home">
      <span className="flex h-11 w-14 items-center justify-center rounded-md border-2 border-accent font-mono text-sm font-bold text-accent">
        huy
      </span>
    </a>
  );
}

function SectionHeading({ n, title }: { n: string; title: string }) {
  return (
    <div className="mb-10 flex items-center gap-4">
      <h2 className="whitespace-nowrap text-2xl font-bold text-slate-lightest sm:text-3xl">
        <span className="mr-2 font-mono text-lg font-normal text-accent sm:text-xl">{n}.</span>
        {title}
      </h2>
      <span className="h-px w-full max-w-xs bg-navy-lightest" />
    </div>
  );
}

function GithubIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-10 6L2 7" />
    </svg>
  );
}

function ExternalIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="inline-block">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

/* CVs are stored in the repo as base64 text (public/cv/*.pdf.b64) because the
   GitHub connector only pushes UTF-8 files; the browser decodes them back
   into the original PDF on download. */
const CV_FILES = [
  { label: "Developer CV", file: "GiaHuyTran_CV_Developer.pdf" },
  { label: "Technical Marketing CV", file: "GiaHuyTran_CV_TechnicalMarketing.pdf" },
];

async function downloadCv(file: string) {
  try {
    const res = await fetch(`/cv/${file}.b64`);
    if (!res.ok) return;
    const b64 = (await res.text()).replace(/\s/g, "");
    const bin = atob(b64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    const url = URL.createObjectURL(new Blob([bytes], { type: "application/pdf" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = file;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 4000);
  } catch {
    /* download failed — visitor can still reach me by email below */
  }
}

function RequestCvButton({ className = "" }: { className?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="rounded border border-accent px-4 py-2 font-mono text-[13px] text-accent transition-colors hover:bg-accent/10"
      >
        Request CV ▾
      </button>
      {open && (
        <div className="absolute right-0 z-50 mt-2 w-72 rounded bg-navy-light p-2 shadow-xl ring-1 ring-navy-lightest">
          {CV_FILES.map((cv) => (
            <button
              key={cv.file}
              type="button"
              onClick={() => {
                setOpen(false);
                void downloadCv(cv.file);
              }}
              className="flex w-full items-center justify-between rounded px-3 py-2.5 text-left text-sm text-slate-lightest transition-colors hover:bg-navy-lightest/50 hover:text-accent"
            >
              <span>
                {cv.label} <span className="font-mono text-xs text-slate">PDF ↓</span>
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* Mail links: a bare mailto looks dead on devices without a default mail
   app, so clicking also copies the address and shows a confirmation. */
function MailCopyLink({
  className = "",
  tooltipSide = "right",
  children,
}: {
  className?: string;
  tooltipSide?: "right" | "left" | "top";
  children: ReactNode;
}) {
  const [copied, setCopied] = useState(false);
  const tooltipPos =
    tooltipSide === "right"
      ? "left-full top-1/2 ml-3 -translate-y-1/2"
      : tooltipSide === "left"
        ? "right-full top-1/2 mr-3 -translate-y-1/2"
        : "bottom-full left-1/2 mb-2 -translate-x-1/2";
  return (
    <span className="relative inline-flex">
      <a
        href={GMAIL_COMPOSE}
        target="_blank"
        rel="noreferrer"
        title={PROFILE.email}
        aria-label={`Email — ${PROFILE.email}`}
        onClick={() => {
          try {
            navigator.clipboard?.writeText(PROFILE.email);
          } catch {
            /* clipboard unavailable — the mailto still fires */
          }
          setCopied(true);
          window.setTimeout(() => setCopied(false), 2200);
        }}
        className={className}
      >
        {children}
      </a>
      {copied && (
        <span className={`absolute z-50 whitespace-nowrap rounded bg-accent px-2 py-1 font-mono text-[11px] font-medium text-navy shadow-lg ${tooltipPos}`}>
          ✓ Email copied
        </span>
      )}
    </span>
  );
}

function ExperienceTabs() {
  const [active, setActive] = useState(0);
  const job = EXPERIENCE[active];
  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:gap-10">
      <div className="flex shrink-0 flex-row overflow-x-auto sm:flex-col sm:overflow-visible" role="tablist" aria-label="Companies">
        {EXPERIENCE.map((j, i) => (
          <button
            key={j.company}
            role="tab"
            aria-selected={i === active}
            onClick={() => setActive(i)}
            className={`whitespace-nowrap border-b-2 px-4 py-3 text-left font-mono text-sm transition-colors sm:border-b-0 sm:border-l-2 ${
              i === active
                ? "border-accent bg-navy-light text-accent"
                : "border-navy-lightest text-slate hover:bg-navy-light/60 hover:text-slate-lightest"
            }`}
          >
            {j.company}
          </button>
        ))}
      </div>
      <div className="min-h-[240px]">
        <h3 className="text-xl font-semibold text-slate-lightest">
          {job.role} <span className="text-accent">@ {job.fullName ?? job.company}</span>
        </h3>
        <p className="mt-1 font-mono text-xs tracking-wide text-slate">{job.period}</p>
        <ul className="mt-4 space-y-3 text-[15px] leading-relaxed text-slate">
          {job.bullets.map((b) => (
            <li key={b} className="relative pl-6">
              <span className="absolute left-0 text-accent">▹</span>
              {b}
            </li>
          ))}
        </ul>
        <div className="mt-5 flex flex-wrap gap-2">
          {job.tags.map((t) => (
            <span key={t} className="rounded-full bg-accent/10 px-3 py-1 font-mono text-xs text-accent">
              {t}
            </span>
          ))}
        </div>
        <a href={job.url} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-1 text-sm text-slate-lightest underline decoration-accent/50 underline-offset-4 hover:text-accent">
          {job.url.replace("https://", "")} <ExternalIcon />
        </a>
      </div>
    </div>
  );
}

/* ---------------------------- Page ---------------------------- */

export default function App() {
  return (
    <div id="top" className="min-h-screen bg-navy font-sans text-slate antialiased selection:bg-accent selection:text-navy">
      {/* Header */}
      <header className="fixed inset-x-0 top-0 z-50 bg-navy/85 backdrop-blur-md">
        <nav className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-6 lg:px-12" aria-label="Main">
          <Logo />
          <ol className="hidden items-center gap-8 md:flex">
            {NAV.map((item) => (
              <li key={item.n}>
                <a href={item.href} className="font-mono text-[13px] text-slate-lightest transition-colors hover:text-accent">
                  <span className="text-accent">{item.n}.</span> {item.label}
                </a>
              </li>
            ))}
            <li>
              <RequestCvButton />
            </li>
          </ol>
          <RequestCvButton className="md:hidden" />
        </nav>
      </header>

      {/* Side rails (desktop) */}
      <div className="fixed bottom-0 left-8 z-10 hidden flex-col items-center gap-6 lg:flex" aria-label="Social links">
        <a href={PROFILE.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="text-slate transition-all hover:-translate-y-0.5 hover:text-accent"><GithubIcon /></a>
        <a href={PROFILE.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="text-slate transition-all hover:-translate-y-0.5 hover:text-accent"><LinkedinIcon /></a>
        <MailCopyLink className="text-slate transition-all hover:-translate-y-0.5 hover:text-accent">
          <MailIcon />
        </MailCopyLink>
        <span className="h-24 w-px bg-slate" />
      </div>
      <div className="fixed bottom-0 right-8 z-10 hidden flex-col items-center gap-6 lg:flex">
        <MailCopyLink
          tooltipSide="left"
          className="font-mono text-xs tracking-widest text-slate transition-all hover:-translate-y-0.5 hover:text-accent"
        >
          <span style={{ writingMode: "vertical-rl" }}>{PROFILE.email}</span>
        </MailCopyLink>
        <span className="h-24 w-px bg-slate" />
      </div>

      <main className="mx-auto max-w-5xl px-6 sm:px-10">
        {/* Hero */}
        <section className="flex min-h-screen flex-col justify-center pt-24">
          <p className="font-mono text-base text-accent">Hi, my name is</p>
          <h1 className="mt-4 text-5xl font-bold leading-tight text-slate-lightest sm:text-6xl lg:text-7xl">{PROFILE.name}.</h1>
          <p className="mt-3 text-3xl font-bold leading-tight text-slate sm:text-5xl lg:text-6xl">
            I build websites — and grow them.
          </p>
          <p className="mt-6 max-w-xl text-base leading-relaxed sm:text-lg">
            I&apos;m a <span className="text-slate-lightest">full-stack developer &amp; technical marketer</span> based in{" "}
            {PROFILE.location}. I build web applications end to end with .NET Core, PHP and React, then grow the same
            products with Meta Ads and technical SEO — using AI-assisted development to ship faster. Currently at{" "}
            <a href="https://lystravel.com.vn" target="_blank" rel="noreferrer" className="text-accent hover:underline">
              LYS Travel
            </a>
            .
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <a href="#projects" className="rounded border border-accent px-7 py-3.5 font-mono text-sm text-accent transition-colors hover:bg-accent/10">
              View my work
            </a>
            <a href="#contact" className="rounded px-7 py-3.5 font-mono text-sm text-slate-lightest transition-colors hover:text-accent">
              Get in touch →
            </a>
          </div>
        </section>

        {/* About */}
        <section id="about" className="scroll-mt-24 py-24">
          <SectionHeading n="01" title="About Me" />
          <div className="space-y-4 text-[15px] leading-relaxed sm:text-base">
            <p>
              I&apos;m a Software Engineering graduate (B.S., HUFLIT, 04/2026) who started working professionally in
              November 2025 — before graduating. My work sits where development and marketing meet: I don&apos;t just
              hand over a website, I can also run the campaigns and the SEO that bring it customers.
            </p>
            <p>
              At LYS Travel I maintain the company website and run Meta Ads for outbound tours. Before that, at Fully
              Protected Insurance Agency, I managed a PHP website day to day and implemented technical SEO (Schema
              Markup) that improved its search visibility.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-3">
            {HYBRID.map((h) => (
              <div key={h.title} className="rounded bg-navy-light p-6 shadow-lg transition-transform hover:-translate-y-1">
                <h3 className="font-mono text-base font-semibold text-accent">{h.title}</h3>
                <p className="mt-3 text-sm leading-relaxed">{h.text}</p>
              </div>
            ))}
          </div>

          <h3 className="mb-6 mt-16 font-mono text-sm uppercase tracking-widest text-slate-lightest">Skills</h3>
          <div className="grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {SKILLS.map((group) => (
              <div key={group.label}>
                <h4 className="mb-3 text-[15px] font-semibold text-slate-lightest">{group.label}</h4>
                <ul className="space-y-1.5">
                  {group.items.map((s) => (
                    <li key={s} className="relative pl-5 font-mono text-[13px]">
                      <span className="absolute left-0 text-accent">▹</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-16 grid gap-10 sm:grid-cols-2">
            <div>
              <h3 className="mb-4 font-mono text-sm uppercase tracking-widest text-slate-lightest">Education</h3>
              <p className="font-semibold text-slate-lightest">HCMC University of Foreign Languages &amp; Information Technology (HUFLIT)</p>
              <p className="mt-1 text-sm">B.S. in Software Engineering · 2022 — 04/2026 · Ho Chi Minh City</p>
              <p className="mt-2 text-sm">Coursework: Data Structures &amp; Algorithms, DBMS, Web Development, Software Engineering.</p>
            </div>
            <div>
              <h3 className="mb-4 font-mono text-sm uppercase tracking-widest text-slate-lightest">Certification</h3>
              <p className="font-semibold text-slate-lightest">Google IT Automation with Python</p>
              <p className="mt-1 text-sm">Google · Coursera</p>
            </div>
          </div>
        </section>

        {/* Experience */}
        <section id="experience" className="scroll-mt-24 py-24">
          <SectionHeading n="02" title="Where I've Worked" />
          <ExperienceTabs />
        </section>

        {/* Projects */}
        <section id="projects" className="scroll-mt-24 py-24">
          <SectionHeading n="03" title="Some Things I've Built" />
          <div className="space-y-6">
            {PROJECTS.map((p) => (
              <article key={p.title} className="group rounded bg-navy-light p-7 shadow-lg transition-transform hover:-translate-y-1 sm:p-8">
                <p className="font-mono text-xs tracking-wide text-accent">{p.kind}</p>
                <h3 className="mt-2 text-2xl font-bold text-slate-lightest">
                  {p.url ? (
                    <a href={p.url} target="_blank" rel="noreferrer" className="transition-colors hover:text-accent">
                      {p.title} <ExternalIcon />
                    </a>
                  ) : (
                    p.title
                  )}
                </h3>
                <p className="mt-3 max-w-3xl text-[15px] leading-relaxed">{p.description}</p>
                <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-2 font-mono text-xs text-slate">
                  {p.tags.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="scroll-mt-24 py-24 text-center">
          <p className="font-mono text-base text-accent">04. What&apos;s Next?</p>
          <h2 className="mt-4 text-4xl font-bold text-slate-lightest sm:text-5xl">Get In Touch</h2>
          <p className="mx-auto mt-5 max-w-md leading-relaxed">
            I&apos;m looking for a full-stack developer or technical marketing role where I can build products and help
            them grow. My inbox is always open — I&apos;ll do my best to get back to you.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a href={GMAIL_COMPOSE} target="_blank" rel="noreferrer" className="rounded border border-accent px-7 py-3.5 font-mono text-sm text-accent transition-colors hover:bg-accent/10">
              Say Hello
            </a>
            <a href={PROFILE.phoneHref} className="font-mono text-sm text-slate-lightest hover:text-accent">
              {PROFILE.phone}
            </a>
          </div>
          <p className="mt-5 font-mono text-sm">
            <a href={GMAIL_COMPOSE} target="_blank" rel="noreferrer" className="text-slate-lightest underline decoration-accent/50 underline-offset-4 hover:text-accent">
              {PROFILE.email}
            </a>
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {CV_FILES.map((cv) => (
              <button
                key={cv.file}
                type="button"
                onClick={() => void downloadCv(cv.file)}
                className="font-mono text-sm text-accent underline decoration-accent/50 underline-offset-4 hover:decoration-accent"
              >
                ↓ {cv.label} (PDF)
              </button>
            ))}
          </div>
          <div className="mt-8 flex items-center justify-center gap-6 lg:hidden">
            <a href={PROFILE.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="text-slate hover:text-accent"><GithubIcon /></a>
            <a href={PROFILE.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="text-slate hover:text-accent"><LinkedinIcon /></a>
            <MailCopyLink tooltipSide="top" className="text-slate hover:text-accent">
              <MailIcon />
            </MailCopyLink>
          </div>
        </section>
      </main>

      <footer className="px-6 pb-8 text-center">
        <p className="font-mono text-xs leading-relaxed text-slate">
          Built by Gia Huy Tran · Design inspired by Brittany Chiang&apos;s portfolio (bchiang7/v4)
        </p>
      </footer>
    </div>
  );
}
