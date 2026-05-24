import { useState, useEffect, useRef } from "react";

// ─── Palette ──────────────────────────────────────────────────────
const BG = "#0a0a0a";
const BG_CARD = "#111113";
const BG_ELEVATED = "#18181b";
const BORDER = "#27272a";
const ACCENT = "#22d3ee";
const ACCENT_DIM = "#22d3ee33";
const TEXT = "#fafafa";
const TEXT_MED = "#a1a1aa";
const TEXT_DIM = "#52525b";
const GREEN = "#4ade80";

// ─── Data ─────────────────────────────────────────────────────────
const NAV_LINKS = [
  { label: "#Home", href: "#home" },
  { label: "#Projects", href: "#projects" },
  { label: "#Skills", href: "#skills" },
  { label: "#Contact", href: "#contact" },
];

const SOCIALS = [
  {
    name: "Email", url: "mailto:cherfaouirafk2@gmail.com",
    svg: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="3"/><path d="M2 7l10 7 10-7"/></svg>,
  },
  {
    name: "GitHub", url: "https://github.com/rafikcherfaoui",
    svg: <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.694.825.576C20.565 22.092 24 17.592 24 12.5 24 5.87 18.627.5 12 .5z"/></svg>,
  },
  {
    name: "LinkedIn", url: "https://www.linkedin.com/in/rafik-cherfaoui-6001a4261",
    svg: <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>,
  },
  {
    name: "Phone", url: "tel:+213540809791",
    svg: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>,
  },
];

const SKILLS = [
  { name: "JavaScript", years: 3 },
  { name: "Node.js", years: 2 },
  { name: "Express", years: 2 },
  { name: "MongoDB", years: 2 },
  { name: "Python", years: 3 },
  { name: "HTML & CSS", years: 3 },
  { name: "PHP", years: 2 },
  { name: "Java", years: 2 },
  { name: "SQL", years: 3 },
  { name: "C", years: 3 },
];

const PROJECTS = [
  {
    num: "01",
    title: "DahlabConnect — University Social Platform",
    desc: "Official internship & job platform for Université Saad Dahlab Blida 1. Connects students, teachers, and partner companies. Features institutional accounts, validated companies, and recommendation letters.",
    tags: ["Node.js", "Express", "MongoDB", "JWT"],
    link: "https://stagelink-beta.vercel.app/",
    image: "/dahlab.jpg",
  },
  {
    num: "02",
    title: "Hackathon — Logistics",
    desc: "Built a logistics optimization solution during a competitive hackathon. Developed route planning and delivery management features under tight time constraints with a collaborative team.",
    tags: ["HTML", "CSS", "JavaScript", "Teamwork"],
  },
  {
    num: "03",
    title: "Hackathon — Business",
    desc: "Created a business-oriented web application focused on solving real-world business challenges with practical software solutions, working collaboratively under pressure.",
    tags: ["JavaScript", "Problem Solving", "Agile"],
  },
  {
    num: "04",
    title: "Hackathon — HR Solutions",
    desc: "Developed an HR management tool with features for employee tracking, recruitment workflows, and data visualization in a fast-paced hackathon environment.",
    tags: ["HTML", "CSS", "JavaScript", "SQL"],
  },
  
];

// ─── Hooks ────────────────────────────────────────────────────────
function useInView(threshold = 0.12) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.unobserve(el); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

function FadeIn({ children, delay = 0, style = {} }) {
  const [ref, visible] = useInView();
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(28px)",
      transition: `opacity 0.65s cubic-bezier(.22,1,.36,1) ${delay}s, transform 0.65s cubic-bezier(.22,1,.36,1) ${delay}s`,
      ...style,
    }}>
      {children}
    </div>
  );
}

// ─── Section Header (terminal path style) ─────────────────────────
function SectionPath({ path, title }) {
  return (
    <div style={{ marginBottom: 40 }}>
      <span style={{
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        fontSize: 14, color: ACCENT, fontWeight: 500, letterSpacing: 0.5,
      }}>
        ../{path}
      </span>
      <h2 style={{
        fontFamily: "'Space Grotesk', 'Inter', sans-serif",
        fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 700,
        color: TEXT, margin: "8px 0 0", lineHeight: 1.15,
      }}>
        {title}
      </h2>
    </div>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
      background: scrolled ? "rgba(10,10,10,0.85)" : "transparent",
      backdropFilter: scrolled ? "blur(16px) saturate(180%)" : "none",
      borderBottom: scrolled ? `1px solid ${BORDER}` : "1px solid transparent",
      transition: "all 0.4s ease",
    }}>
      <div style={{
        maxWidth: 1100, margin: "0 auto", padding: "0 28px",
        display: "flex", alignItems: "center", justifyContent: "space-between", height: 64,
      }}>
        <a href="#home" style={{
          fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: 20,
          color: ACCENT, textDecoration: "none", letterSpacing: "-0.5px",
        }}>
          {"rafik.cherfaoui"}
        </a>
        <div style={{ display: "flex", gap: 6 }}>
          {NAV_LINKS.map((l) => (
            <a key={l.label} href={l.href} style={{
              padding: "6px 14px", borderRadius: 6, fontSize: 13, fontWeight: 500,
              fontFamily: "'JetBrains Mono', monospace",
              color: TEXT_MED, textDecoration: "none", transition: "all 0.2s",
            }}
              onMouseEnter={e => { e.currentTarget.style.color = ACCENT; e.currentTarget.style.background = ACCENT_DIM; }}
              onMouseLeave={e => { e.currentTarget.style.color = TEXT_MED; e.currentTarget.style.background = "transparent"; }}
            >
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────
function Hero() {
  const [typed, setTyped] = useState("");
  const full = "An individual who is passionate about software development and web technologies. My journey in tech is driven by a keen interest in coding, problem solving, and staying up-to-date with the latest trends.";
  useEffect(() => {
    let i = 0;
    const iv = setInterval(() => {
      setTyped(full.slice(0, ++i));
      if (i >= full.length) clearInterval(iv);
    }, 12);
    return () => clearInterval(iv);
  }, []);

  return (
    <section id="home" style={{
      minHeight: "100vh", display: "flex", alignItems: "center",
      position: "relative", overflow: "hidden", padding: "120px 28px 80px",
    }}>
      {/* Gradient orbs */}
      <div style={{
        position: "absolute", width: 600, height: 600, borderRadius: "50%",
        background: `radial-gradient(circle, ${ACCENT}12 0%, transparent 65%)`,
        top: "-15%", right: "-10%", filter: "blur(80px)", pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", width: 400, height: 400, borderRadius: "50%",
        background: `radial-gradient(circle, #a78bfa15 0%, transparent 65%)`,
        bottom: "5%", left: "-5%", filter: "blur(60px)", pointerEvents: "none",
      }} />

      <div style={{ maxWidth: 1100, margin: "0 auto", width: "100%", position: "relative", zIndex: 1, display: "grid", gridTemplateColumns: "1fr 380px", gap: 60, alignItems: "center" }}>
        <div>
          <FadeIn>
            <p style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: 14,
              color: TEXT_MED, marginBottom: 12,
            }}>
              Hello, my name is
            </p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1 style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "clamp(36px, 5.5vw, 60px)", fontWeight: 700,
              color: TEXT, lineHeight: 1.08, margin: "0 0 24px",
            }}>
              Rafik Cherfaoui
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p style={{
              fontFamily: "'Inter', sans-serif", fontSize: 16,
              color: TEXT_MED, lineHeight: 1.75, maxWidth: 520, marginBottom: 8,
            }}>
              {typed}<span style={{ animation: "blink 1s step-end infinite", color: ACCENT }}>|</span>
            </p>
            <p style={{
              fontFamily: "'Inter', sans-serif", fontSize: 15,
              color: TEXT_DIM, lineHeight: 1.7, maxWidth: 520, marginTop: 16,
            }}>
              My passion for technology goes beyond personal achievement — it's about leveraging it to solve real-world problems.
            </p>
          </FadeIn>

          <FadeIn delay={0.35}>
            <a href="#contact" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              marginTop: 32, padding: "12px 28px", borderRadius: 8,
              background: ACCENT, color: "#000", fontWeight: 600, fontSize: 14,
              fontFamily: "'Inter', sans-serif", textDecoration: "none",
              transition: "all 0.25s", boxShadow: `0 0 20px ${ACCENT}44`,
            }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 0 30px ${ACCENT}66`; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = `0 0 20px ${ACCENT}44`; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              Contact
            </a>
          </FadeIn>

          <FadeIn delay={0.45}>
            <div style={{ display: "flex", gap: 12, marginTop: 28 }}>
              {SOCIALS.map((s) => (
                <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer" title={s.name}
                  style={{
                    width: 42, height: 42, borderRadius: 10,
                    border: `1px solid ${BORDER}`, background: BG_CARD,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: TEXT_MED, textDecoration: "none", transition: "all 0.25s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = ACCENT; e.currentTarget.style.color = ACCENT; e.currentTarget.style.transform = "translateY(-2px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.color = TEXT_MED; e.currentTarget.style.transform = "translateY(0)"; }}
                >
                  {s.svg}
                </a>
              ))}
            </div>
          </FadeIn>
        </div>

        {/* Profile avatar area */}
        <FadeIn delay={0.3} style={{ display: "flex", justifyContent: "center" }}>
          <div style={{
            width: 320, height: 380, borderRadius: 24,
            background: `linear-gradient(145deg, ${BG_ELEVATED}, ${BG_CARD})`,
            border: `1px solid ${BORDER}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            position: "relative", overflow: "hidden",
          }}>
            {/* Decorative gradient inside */}
            <div style={{
              position: "absolute", bottom: 0, left: 0, right: 0, height: "50%",
              background: `linear-gradient(to top, ${ACCENT}10, transparent)`,
            }} />
            <div style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
              <div style={{
                width: 130, height: 130, borderRadius: "50%", margin: "0 auto 20px",
                background: `linear-gradient(135deg, ${ACCENT}, #a78bfa)`,
                padding: 3,
              }}>
                <img
                  src="/2026-05-09 18.46.12.jpg"
                  alt="Rafik Cherfaoui"
                  style={{
                    width: "100%", height: "100%", borderRadius: "50%",
                    objectFit: "cover", objectPosition: "center top",
                    display: "block",
                  }}
                />
              </div>
              <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, fontWeight: 600, color: TEXT, margin: "0 0 4px" }}>
                Rafik Cherfaoui
              </p>
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: ACCENT }}>
                CS Student · ISIL L3
              </p>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: TEXT_DIM, marginTop: 8 }}>
                I'm from Algeria
              </p>
              <div style={{ display: "flex", gap: 6, justifyContent: "center", marginTop: 14, flexWrap: "wrap", padding: "0 20px" }}>
                {["Arabic", "French", "English"].map(l => (
                  <span key={l} style={{
                    fontSize: 11, padding: "3px 10px", borderRadius: 20,
                    background: ACCENT_DIM, color: ACCENT,
                    fontFamily: "'Inter', sans-serif", fontWeight: 500,
                  }}>{l}</span>
                ))}
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
      <style>{`@keyframes blink { 50% { opacity: 0; } }`}</style>
    </section>
  );
}

// ─── Skills ───────────────────────────────────────────────────────
function SkillCard({ skill, index }) {
  const [hovered, setHovered] = useState(false);
  return (
    <FadeIn delay={index * 0.05}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          padding: "20px 22px", borderRadius: 14,
          background: hovered ? BG_ELEVATED : BG_CARD,
          border: `1px solid ${hovered ? ACCENT + "44" : BORDER}`,
          transition: "all 0.3s ease",
          transform: hovered ? "translateY(-2px)" : "translateY(0)",
        }}
      >
        <p style={{
          fontFamily: "'Space Grotesk', sans-serif", fontSize: 16,
          fontWeight: 600, color: TEXT, margin: "0 0 6px",
        }}>{skill.name}</p>
        <p style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: 12,
          color: TEXT_DIM, margin: 0,
        }}>
          {skill.years} {skill.years === 1 ? "year" : "years"} of experience
        </p>
      </div>
    </FadeIn>
  );
}

function Skills() {
  return (
    <section id="skills" style={{ padding: "80px 28px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <FadeIn>
          <SectionPath path="skills" title="Knowledge" />
        </FadeIn>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: 16,
        }}>
          {SKILLS.map((s, i) => <SkillCard key={s.name} skill={s} index={i} />)}
        </div>
      </div>
    </section>
  );
}

// ─── Projects ─────────────────────────────────────────────────────
function ProjectCard({ project, index }) {
  const [hovered, setHovered] = useState(false);
  const inner = (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: 18,
        background: BG_CARD,
        border: `1px solid ${hovered ? ACCENT + "55" : BORDER}`,
        transition: "all 0.35s cubic-bezier(.22,1,.36,1)",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hovered ? `0 8px 30px ${ACCENT}15` : "none",
        display: "flex", flexDirection: "column", height: "100",
        overflow: "hidden",
        cursor: project.link ? "pointer" : "default",
      }}
    >
      {project.image ? (
        <div style={{ position: "relative", overflow: "hidden", height: 180, flexShrink: 0 }}>
          <img
            src={project.image}
            alt={project.title}
            style={{
              width: "100%", height: "100%", objectFit: "cover", objectPosition: "top",
              transition: "transform 0.4s ease",
              transform: hovered ? "scale(1.04)" : "scale(1)",
              display: "block",
            }}
          />
          <div style={{
            position: "absolute", inset: 0,
            background: `linear-gradient(to bottom, transparent 50%, ${BG_CARD}cc)`,
          }} />
          {project.link && (
            <div style={{
              position: "absolute", top: 12, right: 12,
              background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)",
              border: `1px solid ${ACCENT}44`, borderRadius: 8,
              padding: "4px 10px",
              fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
              color: ACCENT, opacity: hovered ? 1 : 0, transition: "opacity 0.25s",
            }}>
              visit ↗
            </div>
          )}
        </div>
      ) : (
        <div style={{
          width: "100%", height: 4,
          background: `linear-gradient(90deg, ${ACCENT}, #a78bfa)`,
          opacity: hovered ? 1 : 0.4, transition: "opacity 0.3s",
        }} />
      )}

      <div style={{ padding: 28, display: "flex", flexDirection: "column", flex: 1 }}>
        <div style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: 12,
          color: ACCENT, marginBottom: 10, fontWeight: 500,
        }}>
          #{project.num}
        </div>
        <h3 style={{
          fontFamily: "'Space Grotesk', sans-serif", fontSize: 20, fontWeight: 700,
          color: TEXT, margin: "0 0 12px", lineHeight: 1.3,
        }}>
          {project.title}
        </h3>
        <p style={{
          fontFamily: "'Inter', sans-serif", fontSize: 14, color: TEXT_MED,
          lineHeight: 1.7, margin: "0 0 20px", flex: 1,
        }}>
          {project.desc}
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {project.tags.map((t) => (
            <span key={t} style={{
              fontSize: 11, fontWeight: 600, fontFamily: "'JetBrains Mono', monospace",
              padding: "4px 12px", borderRadius: 20,
              background: ACCENT_DIM, color: ACCENT,
            }}>{t}</span>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <FadeIn delay={index * 0.1}>
      {project.link ? (
        <a href={project.link} target="_blank" rel="noopener noreferrer"
          style={{ textDecoration: "none", display: "block", height: "100%" }}>
          {inner}
        </a>
      ) : inner}
    </FadeIn>
  );
}

function Projects() {
  return (
    <section id="projects" style={{ padding: "80px 28px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <FadeIn>
          <SectionPath path="highlights" title="Featured Projects" />
        </FadeIn>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: 24,
        }}>
          {PROJECTS.map((p, i) => <ProjectCard key={p.num} project={p} index={i} />)}
        </div>
      </div>
    </section>
  );
}

// ─── Education ────────────────────────────────────────────────────
function Education() {
  const [hovered, setHovered] = useState(false);
  return (
    <section style={{ padding: "60px 28px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <FadeIn>
          <SectionPath path="education" title="Academic Background" />
        </FadeIn>
        <FadeIn delay={0.1}>
          <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
              padding: 28, borderRadius: 18,
              background: BG_CARD, border: `1px solid ${hovered ? ACCENT + "44" : BORDER}`,
              transition: "all 0.3s", maxWidth: 600,
              display: "flex", gap: 20, alignItems: "flex-start",
            }}
          >
            <div style={{
              width: 52, height: 52, borderRadius: 14, flexShrink: 0,
              background: `linear-gradient(135deg, ${ACCENT}22, #a78bfa22)`,
              border: `1px solid ${BORDER}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 24,
            }}>
                <img
                src="/usdb_logo.png"
                alt="Université Saad Dahlab Blida logo"
                style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }}
              />
            </div>
            <div>
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: ACCENT, margin: "0 0 4px" }}>
                @ Université Saad Dahlab Blida
              </p>
              <h3 style={{
                fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, fontWeight: 700,
                color: TEXT, margin: "0 0 6px",
              }}>
                B.Sc. Computer Science (Licence Informatique)
              </h3>
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: TEXT_DIM, margin: "0 0 12px" }}>
                ISIL L3 · Graduating 2025
              </p>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: TEXT_MED, lineHeight: 1.7, margin: 0 }}>
                Relevant coursework: Web Development, Programming Languages, Database Management, Algorithms. Key strengths in programming, problem analysis, and software logic.
              </p>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

// ─── Contact ──────────────────────────────────────────────────────
function Contact() {
  return (
    <section id="contact" style={{ padding: "80px 28px 100px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <FadeIn>
          <SectionPath path="contact" title="Project in mind? Let's talk." />
        </FadeIn>
        <FadeIn delay={0.15}>
          <div style={{
            padding: 36, borderRadius: 20,
            background: BG_CARD, border: `1px solid ${BORDER}`,
            maxWidth: 560,
          }}>
            <p style={{
              fontFamily: "'Inter', sans-serif", fontSize: 15,
              color: TEXT_MED, lineHeight: 1.7, margin: "0 0 28px",
            }}>
              I'm actively seeking internship and full-time opportunities in software engineering. Feel free to reach out through any of these channels.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                { icon: "✉", label: "cherfaouirafk2@gmail.com", url: "mailto:cherfaouirafk2@gmail.com" },
                { icon: "☎", label: "+213 540 809 791", url: "tel:+213540809791" },
                { icon: "⌂", label: "github.com/rafikcherfaoui", url: "https://github.com/rafikcherfaoui" },
                { icon: "in", label: "linkedin.com/in/rafik-cherfaoui", url: "https://www.linkedin.com/in/rafik-cherfaoui-6001a4261" },
              ].map((c) => (
                <a key={c.label} href={c.url} target="_blank" rel="noopener noreferrer"
                  style={{
                    display: "flex", alignItems: "center", gap: 14,
                    padding: "12px 16px", borderRadius: 10,
                    background: BG_ELEVATED, border: `1px solid ${BORDER}`,
                    textDecoration: "none", transition: "all 0.25s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = ACCENT + "55"; e.currentTarget.style.transform = "translateX(4px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.transform = "translateX(0)"; }}
                >
                  <span style={{
                    width: 36, height: 36, borderRadius: 8,
                    background: ACCENT_DIM,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 16, color: ACCENT, fontWeight: 700,
                    fontFamily: "'JetBrains Mono', monospace", flexShrink: 0,
                  }}>{c.icon}</span>
                  <span style={{
                    fontFamily: "'JetBrains Mono', monospace", fontSize: 13,
                    color: TEXT_MED, fontWeight: 500,
                  }}>{c.label}</span>
                </a>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{
      padding: "24px 28px", textAlign: "center",
      borderTop: `1px solid ${BORDER}`,
    }}>
      <p style={{
        fontFamily: "'JetBrains Mono', monospace", fontSize: 12,
        color: TEXT_DIM, margin: 0,
      }}>
        Made with <span style={{ color: ACCENT }}>♥</span> by <span style={{ fontWeight: 600, color: TEXT_MED }}>Rafik Cherfaoui</span>
      </p>
    </footer>
  );
}

// ─── App ──────────────────────────────────────────────────────────
export default function Portfolio() {
  return (
    <div style={{ background: BG, minHeight: "100vh", overflowX: "hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body { background: ${BG}; }
        ::selection { background: ${ACCENT}44; color: ${TEXT}; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: ${BG}; }
        ::-webkit-scrollbar-thumb { background: ${BORDER}; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: ${TEXT_DIM}; }
      `}</style>
      <Navbar />
      <Hero />
      <Skills />
      <Projects />
      <Education />
      <Contact />
      <Footer />
    </div>
  );
}