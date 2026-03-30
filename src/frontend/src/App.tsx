import {
  Download,
  ExternalLink,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Menu,
  Phone,
  Star,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Review } from "./backend.d.ts";
import { useActor } from "./hooks/useActor";

// ===== TYPES =====
interface Experience {
  role: string;
  company: string;
  period: string;
  description: string;
}

interface Project {
  title: string;
  description: string;
  tags: string[];
  accentColor: string;
  thumbnail: string;
  link: string;
}

interface Education {
  degree: string;
  college: string;
  year: string;
}

interface ContactItem {
  icon: React.ReactNode;
  label: string;
  value: string;
  href: string | null;
}

import type React from "react";

// ===== DATA =====
const experiences: Experience[] = [
  {
    role: "Visual Designer",
    company: "RLD Builders",
    period: "Aug 2023 – Present",
    description:
      "Real estate branding, marketing materials, social media creatives. Driving visual consistency across all brand touchpoints.",
  },
  {
    role: "Designer",
    company: "PKC Management Consulting",
    period: "Jan 2023 – Jul 2023",
    description:
      "Corporate branding and presentation designs. Elevated client-facing materials to reflect premium consultancy positioning.",
  },
  {
    role: "Designer & Video Editor",
    company: "SQE One – Free Launching",
    period: "2025 – Present",
    description:
      "Joined SQE One for their free launching phase — handling UI design and video editing to support the brand launch. Produced promotional content and visual assets for the product debut.",
  },
  {
    role: "Freelance Visual Designer",
    company: "Eduvels (Malaysia)",
    period: "2021",
    description:
      "International projects and digital branding. Delivered cross-cultural visual solutions for an EdTech platform.",
  },
  {
    role: "Visual Designer",
    company: "Helios",
    period: "2021 – 2022",
    description:
      "Marketing creatives and digital assets. Built a library of reusable design components to streamline production.",
  },
  {
    role: "UI Designer (Freelance)",
    company: "VSOnline Services",
    period: "2020",
    description:
      "UI layouts for web apps with a focus on usability. Designed clean, user-friendly interfaces from wireframes to final visuals.",
  },
  {
    role: "Freelance Designer",
    company: "ADC Builders",
    period: "2019 – 2020",
    description:
      "Real estate marketing creatives including brochures, banners, and digital campaigns.",
  },
  {
    role: "Creative Director",
    company: "Bigg Boss Tamil (Star Vijay)",
    period: "2017 – 2019",
    description:
      "Led visual direction for a flagship TV production. Designed on-screen graphics and branding, collaborating with production teams to deliver compelling episodic identities.",
  },
];

const designSkills = [
  "UI Design (Web & Mobile)",
  "Visual Design & Branding",
  "Social Media Creatives",
  "Motion Graphics",
  "Logo & Identity Design",
  "Print & Marketing Materials",
  "Typography & Layout",
];

const toolSkills = [
  "Adobe Photoshop",
  "Adobe Illustrator",
  "Adobe After Effects",
  "Adobe Premiere Pro",
  "Figma",
  "Adobe XD",
  "Canva",
  "PowerPoint",
  "Lightroom",
];

const projects: Project[] = [
  {
    title: "Music Broadcast",
    description:
      "Visual design for a music broadcast brand — bold typography, striking layouts, and broadcast-ready graphics.",
    tags: ["Branding", "Visual Design", "Photoshop"],
    accentColor: "linear-gradient(90deg, #1E7BFF, #0D5ECC)",
    thumbnail:
      "https://mir-s3-cdn-cf.behance.net/projects/404/cc71bc246296377.Y3JvcCwxMjU1LDk4MiwyNDgsMA.png",
    link: "https://www.behance.net/gallery/246296377/MUSIC-BROADCAST",
  },
  {
    title: "SQE Project Landing Page",
    description:
      "Landing page UI design for SQE project — clean, structured layout with a strong visual hierarchy.",
    tags: ["UI Design", "Landing Page", "Figma"],
    accentColor: "linear-gradient(90deg, #1FD1A0, #0DA87E)",
    thumbnail:
      "https://mir-s3-cdn-cf.behance.net/projects/404/9b8f5f246270145.Y3JvcCwxMjE0LDk0OSwwLDA.png",
    link: "https://www.behance.net/gallery/246270145/sqe-project-landing-page",
  },
  {
    title: "DLD Website",
    description:
      "Full website design for DLD — professional digital presence with cohesive brand identity.",
    tags: ["Web Design", "UI", "Branding"],
    accentColor: "linear-gradient(90deg, #C8A35A, #E8C87A)",
    thumbnail:
      "https://mir-s3-cdn-cf.behance.net/projects/404/c07379246264307.Y3JvcCwxMzUwLDEwNTUsMCwxNzA3.png",
    link: "https://www.behance.net/gallery/246264307/dld-website",
  },
  {
    title: "SQE Website",
    description:
      "Complete website design for SQE — structured content layout and refined visual system.",
    tags: ["Web Design", "UI", "Photoshop"],
    accentColor: "linear-gradient(90deg, #1E7BFF, #0D5ECC)",
    thumbnail:
      "https://mir-s3-cdn-cf.behance.net/projects/404/f517f1246209947.Y3JvcCwxOTA0LDE0ODksMCww.png",
    link: "https://www.behance.net/gallery/246209947/sqe-website",
  },
  {
    title: "Dashboard UI",
    description:
      "Data dashboard design — clean interface with clear data visualization and intuitive navigation.",
    tags: ["UI Design", "Dashboard", "Figma"],
    accentColor: "linear-gradient(90deg, #1FD1A0, #0DA87E)",
    thumbnail:
      "https://mir-s3-cdn-cf.behance.net/projects/404/0bbf1f245993215.Y3JvcCw4MTMsNjM2LDMxMiwyODI.png",
    link: "https://www.behance.net/gallery/245993215/dashboard",
  },
  {
    title: "Food Ordering Tablet App",
    description:
      "Tablet app UI for food ordering — intuitive layout optimized for touch, with vibrant food visuals.",
    tags: ["UI Design", "Mobile", "App", "Figma"],
    accentColor: "linear-gradient(90deg, #C8A35A, #E8C87A)",
    thumbnail:
      "https://mir-s3-cdn-cf.behance.net/projects/404/18d088245980909.Y3JvcCwxNjY0LDEzMDEsNDA3LDE5Nw.png",
    link: "https://www.behance.net/gallery/245980909/food-ordering-tablet-app",
  },
  {
    title: "Landing Page",
    description:
      "High-converting landing page design — persuasive layout, strong CTA hierarchy, and polished visuals.",
    tags: ["UI Design", "Landing Page", "Web"],
    accentColor: "linear-gradient(90deg, #1E7BFF, #0D5ECC)",
    thumbnail:
      "https://mir-s3-cdn-cf.behance.net/projects/404/9b89d9245978901.Y3JvcCwyNDgwLDE5MzksMCw0NjY.jpg",
    link: "https://www.behance.net/gallery/245978901/landing-page",
  },
  {
    title: "Flyer Design",
    description:
      "Creative flyer design — bold, eye-catching layout built to grab attention in both print and digital.",
    tags: ["Print", "Flyer", "Photoshop", "Illustrator"],
    accentColor: "linear-gradient(90deg, #1FD1A0, #0DA87E)",
    thumbnail:
      "https://mir-s3-cdn-cf.behance.net/projects/404/9f5760244805011.69b9e97c1ec32.jpg",
    link: "https://www.behance.net/gallery/244805011/Flyer",
  },
  {
    title: "Investment Posters",
    description:
      "Series of investment-themed promotional posters — clean financial aesthetics with professional typography.",
    tags: ["Poster", "Branding", "Illustrator"],
    accentColor: "linear-gradient(90deg, #C8A35A, #E8C87A)",
    thumbnail:
      "https://mir-s3-cdn-cf.behance.net/projects/404/d7d70d243774561.69aaed6eab1ef.jpg",
    link: "https://www.behance.net/gallery/243774561/Investment-posters",
  },
  {
    title: "Valentine's Day Posters",
    description:
      "Special Valentine's Day poster series — warm, emotive design with vibrant color palettes.",
    tags: ["Poster", "Social Media", "Photoshop"],
    accentColor: "linear-gradient(90deg, #1E7BFF, #0D5ECC)",
    thumbnail:
      "https://mir-s3-cdn-cf.behance.net/projects/404/44c6d7243774207.6994cc6bad7e6.jpg",
    link: "https://www.behance.net/gallery/243774207/Valentine-day-special-posters",
  },
  {
    title: "Poster Design",
    description:
      "Creative poster design series showcasing strong typographic and visual composition skills.",
    tags: ["Poster", "Visual Design", "Illustrator"],
    accentColor: "linear-gradient(90deg, #1FD1A0, #0DA87E)",
    thumbnail:
      "https://mir-s3-cdn-cf.behance.net/projects/404/622b71243333301.6994cbb8ab7a0.jpg",
    link: "https://www.behance.net/gallery/243333301/Poster-design",
  },
  {
    title: "E-Commerce VIDEO",
    description:
      "Dynamic e-commerce video production showcasing product storytelling, motion design, and visual marketing skills.",
    tags: ["Video", "Motion Design", "E-Commerce"],
    accentColor: "linear-gradient(90deg, #F97316, #EA580C)",
    thumbnail:
      "https://mir-s3-cdn-cf.behance.net/projects/404/cc71bc203160409.png",
    link: "https://www.behance.net/gallery/203160409/E-Commerce-VIDEO",
  },
];

const educations: Education[] = [
  {
    degree: "Master of Computer Applications (MCA)",
    college: "FX Engineering College",
    year: "2017",
  },
  {
    degree: "Bachelor of Computer Applications (BCA)",
    college: "St. John's College",
    year: "2014",
  },
];

const navItems = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Videos", href: "#videos" },
  { label: "Reviews", href: "#reviews" },
  { label: "Contact", href: "#contact" },
];

// ===== HOOKS =====
function useScrollReveal() {
  useEffect(() => {
    const observed = new Set<Element>();

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        }
      },
      { threshold: 0.05, rootMargin: "0px 0px 0px 0px" },
    );

    function observeAll() {
      const elements = document.querySelectorAll(".reveal");
      for (const el of elements) {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          el.classList.add("visible");
          observed.add(el);
        } else if (!observed.has(el)) {
          io.observe(el);
          observed.add(el);
        }
      }
    }

    // Run immediately and at intervals to ensure all visible elements are revealed
    observeAll();
    const t1 = setTimeout(observeAll, 100);
    const t2 = setTimeout(observeAll, 400);
    // Safety net: after 800ms force-reveal everything in viewport
    const t3 = setTimeout(() => {
      for (const el of document.querySelectorAll(".reveal:not(.visible)")) {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight + 100) {
          el.classList.add("visible");
        }
      }
    }, 800);

    const mo = new MutationObserver(observeAll);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);
}

function useHeaderBehavior() {
  const [isVisible, setIsVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setIsScrolled(currentY > 20);
      if (currentY < 60) {
        setIsVisible(true);
      } else if (currentY < lastScrollY.current) {
        setIsVisible(true);
      } else if (currentY > lastScrollY.current + 5) {
        setIsVisible(false);
      }
      lastScrollY.current = currentY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return { isVisible, isScrolled };
}

// ===== HEADER =====
function Header() {
  const { isVisible, isScrolled } = useHeaderBehavior();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${
        isScrolled ? "header-glass" : ""
      } ${isVisible ? "translate-y-0" : "-translate-y-full"}`}
      data-ocid="header.panel"
    >
      <div
        style={{ maxWidth: "1200px" }}
        className="mx-auto px-6 py-4 flex items-center justify-between"
      >
        {/* Brand */}
        <a
          href="#home"
          className="flex flex-col leading-tight"
          data-ocid="header.link"
        >
          <span
            className="font-display text-sm font-bold tracking-widest uppercase"
            style={{ color: "var(--color-blue)" }}
          >
            K. Rakesh Raja
          </span>
          <span
            className="font-body text-xs font-medium tracking-widest uppercase"
            style={{ color: "var(--color-text-secondary)" }}
          >
            UI &amp; Visual Designer
          </span>
        </a>

        {/* Desktop nav */}
        <nav
          className="hidden md:flex items-center gap-8"
          data-ocid="nav.panel"
        >
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium tracking-wide transition-colors duration-200 hover:text-white"
              style={{ color: "var(--color-text-secondary)" }}
              data-ocid="nav.link"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Mobile menu toggle */}
        <button
          type="button"
          className="md:hidden p-2 rounded-lg transition-colors"
          style={{ color: "var(--color-text-secondary)" }}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          data-ocid="nav.toggle"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile nav dropdown */}
      {menuOpen && (
        <div
          className="md:hidden header-glass"
          style={{ borderTop: "1px solid var(--color-border)" }}
          data-ocid="nav.panel"
        >
          <div className="px-6 py-4 flex flex-col gap-4">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm font-medium py-1 transition-colors hover:text-white"
                style={{ color: "var(--color-text-secondary)" }}
                onClick={() => setMenuOpen(false)}
                data-ocid="nav.link"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

// ===== HERO PROFILE PHOTO =====
function HeroProfilePhoto() {
  return (
    <>
      <div
        className="relative flex items-center justify-center mb-8 lg:mb-0"
        style={{
          width: "clamp(280px, 44vw, 460px)",
          height: "clamp(280px, 44vw, 460px)",
          flexShrink: 0,
          padding: "10%",
        }}
      >
        {/* Dot-grid background pattern */}
        <div
          style={{
            position: "absolute",
            inset: "-30%",
            backgroundImage:
              "radial-gradient(circle, rgba(30,123,255,0.55) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
            opacity: 0.07,
            pointerEvents: "none",
            borderRadius: "50%",
            maskImage: "radial-gradient(circle, black 40%, transparent 75%)",
            WebkitMaskImage:
              "radial-gradient(circle, black 40%, transparent 75%)",
          }}
        />

        {/* Extra gold radial glow */}
        <div
          style={{
            position: "absolute",
            inset: "-15%",
            borderRadius: "50%",
            background:
              "radial-gradient(circle at 60% 40%, rgba(200,163,90,0.13) 0%, transparent 65%)",
            pointerEvents: "none",
          }}
        />
        {/* Extra blue radial glow (deep) */}
        <div
          style={{
            position: "absolute",
            inset: "-20%",
            borderRadius: "50%",
            background:
              "radial-gradient(circle at 40% 60%, rgba(30,123,255,0.22) 0%, transparent 60%)",
            pointerEvents: "none",
          }}
        />

        {/* Outer glow ring */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(30,123,255,0.18) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        {/* Rotating dashed ring (large) */}
        <div
          style={{
            position: "absolute",
            width: "calc(100% + 48px)",
            height: "calc(100% + 48px)",
            top: -24,
            left: -24,
            borderRadius: "50%",
            border: "1.5px dashed rgba(30,123,255,0.45)",
            animation: "spin-slow 22s linear infinite",
            pointerEvents: "none",
          }}
        />
        {/* Rotating dashed ring (gold, reverse) */}
        <div
          style={{
            position: "absolute",
            width: "calc(100% + 72px)",
            height: "calc(100% + 72px)",
            top: -36,
            left: -36,
            borderRadius: "50%",
            border: "1px dashed rgba(200,163,90,0.3)",
            animation: "spin-slow-reverse 34s linear infinite",
            pointerEvents: "none",
          }}
        />

        {/* Orbiting blue dot */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: 10,
            height: 10,
            marginTop: -5,
            marginLeft: -5,
            borderRadius: "50%",
            background: "rgba(30,123,255,1)",
            boxShadow: "0 0 10px 4px rgba(30,123,255,0.7)",
            animation: "orbit 8s linear infinite",
            pointerEvents: "none",
          }}
        />
        {/* Orbiting gold dot */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: 7,
            height: 7,
            marginTop: -3.5,
            marginLeft: -3.5,
            borderRadius: "50%",
            background: "rgba(200,163,90,1)",
            boxShadow: "0 0 8px 3px rgba(200,163,90,0.7)",
            animation: "orbit-reverse 13s linear infinite",
            pointerEvents: "none",
          }}
        />

        {/* Blue ring */}
        <div
          style={{
            position: "absolute",
            width: "calc(100% - 30px)",
            height: "calc(100% - 30px)",
            borderRadius: "50%",
            border: "1.5px solid rgba(30,123,255,0.35)",
            top: 15,
            left: 15,
            animation: "pulse-ring 4s ease-in-out infinite",
            pointerEvents: "none",
          }}
        />
        {/* Gold accent ring */}
        <div
          style={{
            position: "absolute",
            width: "calc(100% + 10px)",
            height: "calc(100% + 10px)",
            borderRadius: "50%",
            border: "1px solid rgba(200,163,90,0.2)",
            top: -5,
            left: -5,
            pointerEvents: "none",
          }}
        />

        {/* Corner bracket — top-left */}
        <div
          style={{
            position: "absolute",
            top: "6%",
            left: "6%",
            width: 18,
            height: 18,
            borderTop: "2px solid rgba(200,163,90,0.8)",
            borderLeft: "2px solid rgba(200,163,90,0.8)",
            pointerEvents: "none",
          }}
        />
        {/* Corner bracket — top-right */}
        <div
          style={{
            position: "absolute",
            top: "6%",
            right: "6%",
            width: 18,
            height: 18,
            borderTop: "2px solid rgba(200,163,90,0.8)",
            borderRight: "2px solid rgba(200,163,90,0.8)",
            pointerEvents: "none",
          }}
        />
        {/* Corner bracket — bottom-left */}
        <div
          style={{
            position: "absolute",
            bottom: "6%",
            left: "6%",
            width: 18,
            height: 18,
            borderBottom: "2px solid rgba(30,123,255,0.8)",
            borderLeft: "2px solid rgba(30,123,255,0.8)",
            pointerEvents: "none",
          }}
        />
        {/* Corner bracket — bottom-right */}
        <div
          style={{
            position: "absolute",
            bottom: "6%",
            right: "6%",
            width: 18,
            height: 18,
            borderBottom: "2px solid rgba(30,123,255,0.8)",
            borderRight: "2px solid rgba(30,123,255,0.8)",
            pointerEvents: "none",
          }}
        />

        {/* Profile photo */}
        <div
          style={{
            width: "calc(100% - 80px)",
            height: "calc(100% - 80px)",
            borderRadius: "50%",
            overflow: "hidden",
            border: "3px solid rgba(30,123,255,0.5)",
            boxShadow:
              "0 0 40px rgba(30,123,255,0.25), 0 0 80px rgba(30,123,255,0.1)",
            position: "relative",
            zIndex: 1,
          }}
        >
          <img
            src="/assets/uploads/2.1-019d39ff-648f-76d8-aac0-35b78a21f9f9-1.png"
            alt="K. Rakesh Raja – UI & Visual Designer"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center top",
            }}
          />
        </div>

        {/* Gold glow dot */}
        <div
          className="glow-dot"
          style={{
            top: "14%",
            right: "14%",
            background: "var(--color-gold)",
            boxShadow: "0 0 12px 4px rgba(200,163,90,0.7)",
          }}
        />
        <div
          className="glow-dot"
          style={{
            bottom: "14%",
            left: "14%",
            animationDelay: "1.5s",
          }}
        />

        {/* Floating skill tag — UI Design */}
        <div
          style={{
            position: "absolute",
            top: "8%",
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(30,123,255,0.12)",
            border: "1px solid rgba(30,123,255,0.45)",
            borderRadius: 999,
            padding: "4px 12px",
            fontSize: 11,
            fontWeight: 600,
            color: "#7eb8ff",
            letterSpacing: "0.08em",
            whiteSpace: "nowrap",
            animation: "float 3s ease-in-out infinite alternate",
            pointerEvents: "none",
            zIndex: 2,
          }}
        >
          UI Design
        </div>
        {/* Floating skill tag — Branding */}
        <div
          style={{
            position: "absolute",
            bottom: "8%",
            right: "10%",
            background: "rgba(200,163,90,0.1)",
            border: "1px solid rgba(200,163,90,0.4)",
            borderRadius: 999,
            padding: "4px 12px",
            fontSize: 11,
            fontWeight: 600,
            color: "#e0c47a",
            letterSpacing: "0.08em",
            whiteSpace: "nowrap",
            animation: "float2 3.5s ease-in-out infinite alternate",
            animationDelay: "0.8s",
            pointerEvents: "none",
            zIndex: 2,
          }}
        >
          Branding
        </div>
        {/* Floating skill tag — 5+ Years */}
        <div
          style={{
            position: "absolute",
            top: "40%",
            left: "-4%",
            transform: "translateY(-50%)",
            background: "rgba(30,123,255,0.08)",
            border: "1px solid rgba(30,123,255,0.35)",
            borderRadius: 999,
            padding: "4px 12px",
            fontSize: 11,
            fontWeight: 600,
            color: "#7eb8ff",
            letterSpacing: "0.08em",
            whiteSpace: "nowrap",
            animation: "float 4s ease-in-out infinite alternate",
            animationDelay: "1.5s",
            pointerEvents: "none",
            zIndex: 2,
          }}
        >
          5+ Years
        </div>
      </div>
    </>
  );
}

// ===== HERO =====
function HeroSection() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center"
      style={{ paddingTop: 100 }}
      data-ocid="hero.section"
    >
      {/* Ambient background glow */}
      <div className="hero-bg-glow" style={{ top: "10%", right: "15%" }} />
      <div
        className="hero-bg-glow"
        style={{
          top: "50%",
          right: "25%",
          width: 300,
          height: 300,
          opacity: 0.5,
        }}
      />

      <div
        style={{ maxWidth: "1200px" }}
        className="mx-auto px-6 w-full py-20 lg:py-0"
      >
        <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-8 lg:gap-12">
          {/* Text content */}
          <div className="flex-1 max-w-2xl">
            <div className="reveal mb-2">
              <span
                className="font-body text-sm font-semibold tracking-[0.25em] uppercase"
                style={{ color: "var(--color-blue)" }}
              >
                Available for opportunities
              </span>
            </div>

            <h1 className="font-display leading-none mb-6">
              <span
                className="reveal reveal-delay-1 block text-6xl lg:text-8xl font-extrabold uppercase tracking-tight"
                style={{ color: "var(--color-blue)" }}
              >
                Hello,
              </span>
              <span
                className="reveal reveal-delay-2 block text-6xl lg:text-8xl font-extrabold uppercase tracking-tight"
                style={{ color: "var(--color-text)", lineHeight: 1 }}
              >
                I Am
              </span>
              <span
                className="reveal reveal-delay-3 block text-6xl lg:text-8xl font-extrabold uppercase tracking-tight"
                style={{ color: "var(--color-text)", lineHeight: 1 }}
              >
                Rakesh.
              </span>
            </h1>

            <div className="reveal reveal-delay-3 mb-4">
              <span
                className="font-display text-xl lg:text-2xl font-bold uppercase tracking-[0.15em]"
                style={{ color: "var(--color-gold)" }}
              >
                UI &amp; Visual Designer
              </span>
            </div>

            <p
              className="reveal reveal-delay-4 font-body text-base lg:text-lg leading-relaxed mb-10 max-w-lg"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Crafting impactful digital experiences through visual
              storytelling, UI design, and creative direction.
            </p>

            <div className="reveal reveal-delay-4 flex flex-wrap gap-4">
              <a
                href="#projects"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-full font-body font-semibold text-sm uppercase tracking-wider transition-all duration-200 hover:opacity-90 hover:scale-105"
                style={{
                  background: "var(--color-blue)",
                  color: "#fff",
                  boxShadow: "0 0 24px rgba(30,123,255,0.35)",
                }}
                data-ocid="hero.primary_button"
              >
                View My Work
              </a>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-full font-body font-semibold text-sm uppercase tracking-wider transition-all duration-200 hover:opacity-90 hover:scale-105"
                style={{
                  background: "transparent",
                  border: "1.5px solid var(--color-gold)",
                  color: "var(--color-gold)",
                }}
                data-ocid="hero.secondary_button"
              >
                Get In Touch
              </a>
              <a
                href="/assets/uploads/rakesh_resume_updated_3-019d3ac0-14ec-76b8-a0de-6d54647ee243-1.pdf"
                download="Rakesh_Raja_Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-full font-body font-semibold text-sm uppercase tracking-wider transition-all duration-200 hover:opacity-90 hover:scale-105"
                style={{
                  background: "transparent",
                  border: "1.5px solid var(--color-blue)",
                  color: "var(--color-blue)",
                }}
                data-ocid="hero.download_button"
              >
                <Download size={16} />
                Download Resume
              </a>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-full font-body font-semibold text-sm uppercase tracking-wider transition-all duration-200 hover:opacity-90 hover:scale-105"
                style={{
                  background: "var(--color-gold)",
                  color: "#0a0f1a",
                }}
                data-ocid="hero.hireme_button"
              >
                Hire Me
              </a>
            </div>
          </div>

          {/* Profile photo */}
          <HeroProfilePhoto />
        </div>
      </div>
    </section>
  );
}

// ===== ABOUT =====
function AboutSection() {
  return (
    <section id="about" className="py-24" data-ocid="about.section">
      <div style={{ maxWidth: "1200px" }} className="mx-auto px-6">
        <div className="reveal mb-3">
          <span
            className="font-body text-xs font-semibold tracking-[0.3em] uppercase"
            style={{ color: "var(--color-blue)" }}
          >
            Who I Am
          </span>
        </div>
        <h2
          className="reveal reveal-delay-1 font-display text-3xl lg:text-4xl font-bold uppercase tracking-widest mb-12"
          style={{ color: "var(--color-text)" }}
        >
          About Me
        </h2>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p
              className="reveal font-body text-base lg:text-lg leading-relaxed mb-6"
              style={{ color: "var(--color-text-secondary)" }}
            >
              I started my design journey with traditional pen and paper,
              building a strong foundation in creativity and visual thinking.
              Over time, I transitioned into digital design, mastering modern
              tools to create high-quality visual experiences.
            </p>
            <p
              className="reveal reveal-delay-1 font-body text-base lg:text-lg leading-relaxed"
              style={{ color: "var(--color-text-secondary)" }}
            >
              With{" "}
              <span style={{ color: "var(--color-blue)", fontWeight: 600 }}>
                5+ years
              </span>{" "}
              of experience in UI and visual design, I specialize in branding,
              digital design, and creative direction. I bring strong
              collaboration, problem-solving, and multitasking abilities to
              every project.
            </p>
          </div>

          <div className="reveal reveal-delay-2 grid grid-cols-2 gap-4">
            {[
              { value: "5+", label: "Years Experience" },
              { value: "3+", label: "Industries Served" },
              { value: "20+", label: "Projects Delivered" },
              { value: "7", label: "Roles & Clients" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl p-6 text-center"
                style={{
                  background: "var(--color-panel)",
                  border: "1px solid var(--color-border)",
                }}
              >
                <div
                  className="font-display text-4xl font-extrabold mb-1"
                  style={{ color: "var(--color-blue)" }}
                >
                  {stat.value}
                </div>
                <div
                  className="font-body text-xs uppercase tracking-widest"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ===== EXPERIENCE =====
function ExperienceSection() {
  return (
    <section
      id="experience"
      className="py-24"
      style={{ background: "var(--color-panel)" }}
      data-ocid="experience.section"
    >
      <div style={{ maxWidth: "1200px" }} className="mx-auto px-6">
        <div className="reveal mb-3">
          <span
            className="font-body text-xs font-semibold tracking-[0.3em] uppercase"
            style={{ color: "var(--color-blue)" }}
          >
            Career Journey
          </span>
        </div>
        <h2
          className="reveal reveal-delay-1 font-display text-3xl lg:text-4xl font-bold uppercase tracking-widest mb-16"
          style={{ color: "var(--color-text)" }}
        >
          Experience
        </h2>

        <div className="relative pl-10">
          <div className="timeline-line" />

          <div className="flex flex-col gap-8">
            {experiences.map((exp, i) => (
              <div
                key={exp.company}
                className={`reveal reveal-delay-${Math.min(i + 1, 4)} flex gap-6`}
                data-ocid={`experience.item.${i + 1}`}
              >
                <div
                  className="timeline-node mt-1"
                  style={{ marginLeft: "-29px" }}
                />
                <div
                  className="flex-1 rounded-xl p-5 transition-colors duration-200"
                  style={{
                    background: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                  }}
                >
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                    <h3
                      className="font-display text-base font-bold"
                      style={{ color: "var(--color-text)" }}
                    >
                      {exp.role}
                    </h3>
                    <span
                      className="font-body text-xs"
                      style={{ color: "var(--color-text-muted)" }}
                    >
                      {exp.period}
                    </span>
                  </div>
                  <div
                    className="font-body text-sm font-semibold mb-3"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    @ {exp.company}
                  </div>
                  <p
                    className="font-body text-sm leading-relaxed"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    {exp.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ===== SKILLS =====
function SkillsSection() {
  return (
    <section id="skills" className="py-24" data-ocid="skills.section">
      <div style={{ maxWidth: "1200px" }} className="mx-auto px-6">
        <div className="reveal mb-3">
          <span
            className="font-body text-xs font-semibold tracking-[0.3em] uppercase"
            style={{ color: "var(--color-blue)" }}
          >
            What I Do
          </span>
        </div>
        <h2
          className="reveal reveal-delay-1 font-display text-3xl lg:text-4xl font-bold uppercase tracking-widest mb-14"
          style={{ color: "var(--color-text)" }}
        >
          Skills & Tools
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {/* Design skills */}
          <div className="reveal">
            <h3
              className="font-body text-xs font-bold uppercase tracking-[0.25em] mb-5"
              style={{ color: "var(--color-text-muted)" }}
            >
              Design
            </h3>
            <div className="flex flex-wrap gap-3">
              {designSkills.map((skill) => (
                <span key={skill} className="skill-pill-blue">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Tool skills */}
          <div className="reveal reveal-delay-1">
            <h3
              className="font-body text-xs font-bold uppercase tracking-[0.25em] mb-5"
              style={{ color: "var(--color-text-muted)" }}
            >
              Tools
            </h3>
            <div className="flex flex-wrap gap-3">
              {toolSkills.map((tool) => (
                <span key={tool} className="skill-pill-gray">
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ===== PROJECTS =====
function ProjectsSection() {
  return (
    <section
      id="projects"
      className="py-24"
      style={{ background: "var(--color-panel)" }}
      data-ocid="projects.section"
    >
      <div style={{ maxWidth: "1200px" }} className="mx-auto px-6">
        <div className="reveal mb-3">
          <span
            className="font-body text-xs font-semibold tracking-[0.3em] uppercase"
            style={{ color: "var(--color-blue)" }}
          >
            My Work
          </span>
        </div>
        <h2
          className="reveal reveal-delay-1 font-display text-3xl lg:text-4xl font-bold uppercase tracking-widest mb-14"
          style={{ color: "var(--color-text)" }}
        >
          Selected Projects
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, i) => (
            <div
              key={project.title}
              className={`project-card reveal reveal-delay-${i + 1} flex flex-col`}
              data-ocid={`projects.item.${i + 1}`}
            >
              {/* Accent band */}
              <div
                className="card-accent-band"
                style={{ background: project.accentColor }}
              />

              {/* Thumbnail */}
              <div
                style={{
                  aspectRatio: "16/9",
                  overflow: "hidden",
                  background: "var(--color-card)",
                }}
              >
                <img
                  src={project.thumbnail}
                  alt={project.title}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                    transition: "transform 0.4s ease",
                  }}
                  className="hover:scale-105"
                />
              </div>

              <div className="p-6 flex flex-col flex-1">
                <h3
                  className="font-display text-base font-bold mb-3 leading-snug"
                  style={{ color: "var(--color-text)" }}
                >
                  {project.title}
                </h3>
                <p
                  className="font-body text-sm leading-relaxed mb-5 flex-1"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {project.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-5">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="font-body text-xs px-2.5 py-1 rounded-full"
                      style={{
                        background: "rgba(38,48,58,0.8)",
                        border: "1px solid var(--color-border)",
                        color: "var(--color-text-muted)",
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 font-body text-sm font-semibold transition-all duration-200 hover:gap-2 self-start"
                  style={{ color: "var(--color-gold)" }}
                  data-ocid={`projects.link.${i + 1}`}
                >
                  View on Behance <ExternalLink size={13} />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Portfolio note */}
        <div
          className="reveal mt-10 rounded-xl p-6 text-center"
          style={{
            background: "rgba(30,123,255,0.06)",
            border: "1px solid rgba(30,123,255,0.2)",
          }}
        >
          <p
            className="font-body text-sm"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Detailed case studies and live project visuals can be presented upon
            request or through{" "}
            <a
              href="https://www.behance.net/rocketrakedae3"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--color-blue)" }}
              className="hover:underline"
            >
              Behance
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  );
}

// ===== EDUCATION =====
function EducationSection() {
  return (
    <section id="education" className="py-24" data-ocid="education.section">
      <div style={{ maxWidth: "1200px" }} className="mx-auto px-6">
        <div className="reveal mb-3">
          <span
            className="font-body text-xs font-semibold tracking-[0.3em] uppercase"
            style={{ color: "var(--color-blue)" }}
          >
            Academic Background
          </span>
        </div>
        <h2
          className="reveal reveal-delay-1 font-display text-3xl lg:text-4xl font-bold uppercase tracking-widest mb-12"
          style={{ color: "var(--color-text)" }}
        >
          Education
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {educations.map((edu, i) => (
            <div
              key={edu.degree}
              className={`reveal reveal-delay-${i + 1} rounded-xl p-7`}
              style={{
                background: "var(--color-card)",
                border: "1px solid var(--color-border)",
              }}
              data-ocid={`education.item.${i + 1}`}
            >
              <div
                className="font-body text-xs font-bold uppercase tracking-widest mb-3"
                style={{ color: "var(--color-blue)" }}
              >
                {edu.year}
              </div>
              <h3
                className="font-display text-lg font-bold mb-2 leading-snug"
                style={{ color: "var(--color-text)" }}
              >
                {edu.degree}
              </h3>
              <p
                className="font-body text-sm"
                style={{ color: "var(--color-text-muted)" }}
              >
                {edu.college}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ===== STAR RATING =====
function StarRating({
  value,
  onChange,
  readOnly = false,
  size = 24,
}: {
  value: number;
  onChange?: (v: number) => void;
  readOnly?: boolean;
  size?: number;
}) {
  const [hovered, setHovered] = useState(0);
  const display = readOnly ? value : hovered || value;

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readOnly}
          onClick={() => !readOnly && onChange?.(star)}
          onMouseEnter={() => !readOnly && setHovered(star)}
          onMouseLeave={() => !readOnly && setHovered(0)}
          style={{
            background: "none",
            border: "none",
            padding: 0,
            cursor: readOnly ? "default" : "pointer",
            color:
              star <= display ? "var(--color-gold)" : "var(--color-border)",
            transition: "color 0.15s",
            lineHeight: 1,
          }}
          aria-label={`${star} star`}
        >
          <Star
            size={size}
            fill={star <= display ? "var(--color-gold)" : "transparent"}
            strokeWidth={1.5}
          />
        </button>
      ))}
    </div>
  );
}

// ===== REVIEWS SECTION =====
function ReviewsSection() {
  const { actor } = useActor();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);

  // Form state
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const fetchReviews = useCallback(async () => {
    if (!actor) return;
    try {
      const data = await actor.getReviews();
      const sorted = [...data].sort(
        (a, b) => Number(b.timestamp) - Number(a.timestamp),
      );
      setReviews(sorted);
    } catch (e) {
      console.error("Failed to fetch reviews", e);
    } finally {
      setLoadingReviews(false);
    }
  }, [actor]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actor) return;
    if (!name.trim() || !reviewText.trim()) {
      setError("Name and review text are required.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      await actor.submitReview(
        name.trim(),
        role.trim(),
        company.trim(),
        reviewText.trim(),
        BigInt(rating),
      );
      setName("");
      setRole("");
      setCompany("");
      setReviewText("");
      setRating(5);
      setSubmitted(true);
      await fetchReviews();
      setTimeout(() => setSubmitted(false), 5000);
    } catch (e) {
      setError("Failed to submit review. Please try again.");
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "var(--color-bg)",
    border: "1px solid var(--color-border)",
    borderRadius: 8,
    padding: "10px 14px",
    color: "var(--color-text)",
    fontSize: "0.875rem",
    fontFamily: "inherit",
    outline: "none",
    transition: "border-color 0.2s",
  };

  return (
    <section
      id="reviews"
      className="py-24"
      style={{ background: "var(--color-panel)" }}
      data-ocid="reviews.section"
    >
      <div style={{ maxWidth: "1200px" }} className="mx-auto px-6">
        {/* Section header */}
        <div className="reveal mb-3">
          <span
            className="font-body text-xs font-semibold tracking-[0.3em] uppercase"
            style={{ color: "var(--color-blue)" }}
          >
            What Clients Say
          </span>
        </div>
        <h2
          className="reveal reveal-delay-1 font-display text-3xl lg:text-4xl font-bold uppercase tracking-widest mb-12"
          style={{ color: "var(--color-text)" }}
        >
          Client Reviews
        </h2>

        {/* Submission form */}
        <div
          className="reveal reveal-delay-1 mb-14"
          style={{
            background: "var(--color-card)",
            border: "1px solid var(--color-border)",
            borderRadius: 12,
            padding: 24,
          }}
          data-ocid="reviews.panel"
        >
          <h3
            className="font-display text-base font-bold mb-6"
            style={{ color: "var(--color-text)" }}
          >
            Leave a Review
          </h3>

          <form onSubmit={handleSubmit}>
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div>
                <label
                  htmlFor="review-name"
                  className="font-body text-xs uppercase tracking-widest mb-1.5 block"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  Your Name *
                </label>
                <input
                  id="review-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  style={inputStyle}
                  required
                  data-ocid="reviews.input"
                />
              </div>
              <div>
                <label
                  htmlFor="review-role"
                  className="font-body text-xs uppercase tracking-widest mb-1.5 block"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  Your Role / Title
                </label>
                <input
                  id="review-role"
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Marketing Manager"
                  style={inputStyle}
                  data-ocid="reviews.input"
                />
              </div>
              <div>
                <label
                  htmlFor="review-company"
                  className="font-body text-xs uppercase tracking-widest mb-1.5 block"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  Company
                </label>
                <input
                  id="review-company"
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Acme Corp"
                  style={inputStyle}
                  data-ocid="reviews.input"
                />
              </div>
            </div>

            <div className="mb-4">
              <label
                htmlFor="review-rating"
                className="font-body text-xs uppercase tracking-widest mb-2 block"
                style={{ color: "var(--color-text-muted)" }}
              >
                Rating
              </label>
              <div id="review-rating">
                <StarRating value={rating} onChange={setRating} size={28} />
              </div>
            </div>

            <div className="mb-5">
              <label
                htmlFor="review-text"
                className="font-body text-xs uppercase tracking-widest mb-1.5 block"
                style={{ color: "var(--color-text-muted)" }}
              >
                Your Review *
              </label>
              <textarea
                id="review-text"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Share your experience working with Rakesh..."
                rows={4}
                style={{ ...inputStyle, resize: "vertical" }}
                required
                data-ocid="reviews.textarea"
              />
            </div>

            {error && (
              <p
                className="font-body text-sm mb-4"
                style={{ color: "#f87171" }}
                data-ocid="reviews.error_state"
              >
                {error}
              </p>
            )}

            {submitted && (
              <div
                className="mb-4 rounded-lg px-4 py-3"
                style={{
                  background: "rgba(31,209,160,0.1)",
                  border: "1px solid rgba(31,209,160,0.3)",
                }}
                data-ocid="reviews.success_state"
              >
                <p className="font-body text-sm" style={{ color: "#1FD1A0" }}>
                  ✓ Thank you! Your review has been submitted.
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting || !actor}
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full font-body font-semibold text-sm uppercase tracking-wider transition-all duration-200 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: "var(--color-blue)",
                color: "#fff",
                boxShadow: "0 0 20px rgba(30,123,255,0.25)",
              }}
              data-ocid="reviews.submit_button"
            >
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        </div>

        {/* Reviews grid */}
        {loadingReviews ? (
          <div
            className="flex justify-center py-12"
            data-ocid="reviews.loading_state"
          >
            <div
              className="w-8 h-8 rounded-full border-2 animate-spin"
              style={{
                borderColor: "var(--color-border)",
                borderTopColor: "var(--color-blue)",
              }}
            />
          </div>
        ) : reviews.length === 0 ? (
          <div
            className="reveal text-center py-12 rounded-xl"
            style={{
              background: "var(--color-card)",
              border: "1px solid var(--color-border)",
            }}
            data-ocid="reviews.empty_state"
          >
            <p
              className="font-body text-sm"
              style={{ color: "var(--color-text-muted)" }}
            >
              No reviews yet — be the first to share your experience!
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((review, i) => (
              <div
                key={String(review.id)}
                className={`reveal reveal-delay-${Math.min(i + 1, 4)} rounded-xl p-6 flex flex-col gap-3`}
                style={{
                  background: "var(--color-card)",
                  border: "1px solid var(--color-border)",
                }}
                data-ocid={`reviews.item.${i + 1}`}
              >
                <StarRating value={Number(review.rating)} readOnly size={18} />
                <p
                  className="font-body text-sm leading-relaxed flex-1"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  &ldquo;{review.reviewText}&rdquo;
                </p>
                <div
                  style={{
                    borderTop: "1px solid var(--color-border)",
                    paddingTop: 12,
                  }}
                >
                  <div
                    className="font-display text-sm font-bold"
                    style={{ color: "var(--color-text)" }}
                  >
                    {review.name}
                  </div>
                  {(review.role || review.company) && (
                    <div
                      className="font-body text-xs mt-0.5"
                      style={{ color: "var(--color-text-muted)" }}
                    >
                      {review.role}
                      {review.role && review.company ? " @ " : ""}
                      {review.company}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ===== CONTACT =====
const contactItems: ContactItem[] = [
  {
    icon: <Mail size={18} />,
    label: "Email",
    value: "rakeshrajamca@gmail.com",
    href: "mailto:rakeshrajamca@gmail.com",
  },
  {
    icon: <Phone size={18} />,
    label: "Phone",
    value: "+91 9500333907",
    href: "tel:+919500333907",
  },
  {
    icon: <MapPin size={18} />,
    label: "Location",
    value: "Chennai, India",
    href: null,
  },
  {
    icon: <ExternalLink size={18} />,
    label: "Behance",
    value: "behance.net/rocketrakedae3",
    href: "https://www.behance.net/rocketrakedae3",
  },
  {
    icon: <Linkedin size={18} />,
    label: "LinkedIn",
    value: "linkedin.com/in/rakesh-raja-a3792816b",
    href: "https://www.linkedin.com/in/rakesh-raja-a3792816b",
  },
  {
    icon: <Instagram size={18} />,
    label: "Instagram",
    value: "@rakesh_raja_filmmaker",
    href: "https://www.instagram.com/rakesh_raja_filmmaker?igsh=MWN0eXJsOHU0cXk5bQ%3D%3D&utm_source=qr",
  },
];

function ContactSection() {
  return (
    <section
      id="contact"
      className="py-24"
      style={{ background: "var(--color-panel)" }}
      data-ocid="contact.section"
    >
      <div style={{ maxWidth: "1200px" }} className="mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          {/* CTA text */}
          <div>
            <div className="reveal mb-3">
              <span
                className="font-body text-xs font-semibold tracking-[0.3em] uppercase"
                style={{ color: "var(--color-blue)" }}
              >
                Say Hello
              </span>
            </div>
            <h2 className="reveal reveal-delay-1 font-display uppercase font-extrabold leading-none mb-6">
              <span
                className="block text-4xl lg:text-5xl"
                style={{ color: "var(--color-text)" }}
              >
                Get In Touch
              </span>
              <span
                className="block text-4xl lg:text-5xl"
                style={{ color: "var(--color-blue)" }}
              >
                Let's
              </span>
              <span
                className="block text-4xl lg:text-5xl"
                style={{ color: "var(--color-text)" }}
              >
                Collaborate.
              </span>
            </h2>
            <p
              className="reveal reveal-delay-2 font-body text-base leading-relaxed"
              style={{ color: "var(--color-text-secondary)" }}
            >
              I'm open to freelance projects, full-time roles, and creative
              collaborations. Let's build something remarkable together.
            </p>
          </div>

          {/* Contact info */}
          <div className="reveal reveal-delay-2 space-y-5">
            {contactItems.map((item, i) => (
              <div
                key={item.label}
                className="flex items-center gap-5 rounded-xl p-5"
                style={{
                  background: "var(--color-card)",
                  border: "1px solid var(--color-border)",
                }}
                data-ocid={`contact.item.${i + 1}`}
              >
                <div
                  className="flex items-center justify-center w-10 h-10 rounded-full flex-shrink-0"
                  style={{
                    background: "rgba(30,123,255,0.15)",
                    color: "var(--color-blue)",
                  }}
                >
                  {item.icon}
                </div>
                <div>
                  <div
                    className="font-body text-xs uppercase tracking-widest mb-0.5"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    {item.label}
                  </div>
                  {item.href ? (
                    <a
                      href={item.href}
                      target={
                        item.href.startsWith("http") ? "_blank" : undefined
                      }
                      rel={
                        item.href.startsWith("http")
                          ? "noopener noreferrer"
                          : undefined
                      }
                      className="font-body text-sm font-medium transition-colors hover:opacity-80"
                      style={{ color: "var(--color-text)" }}
                      data-ocid="contact.link"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <span
                      className="font-body text-sm font-medium"
                      style={{ color: "var(--color-text)" }}
                    >
                      {item.value}
                    </span>
                  )}
                </div>
              </div>
            ))}

            {/* Behance note */}
            <div
              className="rounded-xl p-5 mt-2"
              style={{
                background: "rgba(200,163,90,0.07)",
                border: "1px solid rgba(200,163,90,0.25)",
              }}
            >
              <p
                className="font-body text-sm leading-relaxed"
                style={{ color: "var(--color-text-secondary)" }}
              >
                📁 Detailed case studies and live project visuals can be
                presented upon request or through{" "}
                <a
                  href="https://www.behance.net/rocketrakedae3"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "var(--color-gold)" }}
                  className="hover:underline"
                >
                  Behance
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ===== FOOTER =====
function Footer() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";
  const caffeineUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`;

  return (
    <footer
      className="py-8"
      style={{ borderTop: "1px solid var(--color-border)" }}
      data-ocid="footer.panel"
    >
      <div
        style={{ maxWidth: "1200px" }}
        className="mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4"
      >
        <div
          className="font-body text-xs"
          style={{ color: "var(--color-text-muted)" }}
        >
          © {year} K. Rakesh Raja. All rights reserved.
        </div>
        <div
          className="font-body text-xs"
          style={{ color: "var(--color-text-muted)" }}
        >
          Built with ❤️ using{" "}
          <a
            href={caffeineUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-white"
            style={{ color: "var(--color-blue)" }}
          >
            caffeine.ai
          </a>
        </div>
      </div>
    </footer>
  );
}

// ===== APP =====
export default function App() {
  useScrollReveal();
  return (
    <div style={{ background: "var(--color-bg)", minHeight: "100vh" }}>
      <Header />
      <main>
        <HeroSection />
        <AboutSection />
        <ExperienceSection />
        <SkillsSection />
        <ProjectsSection />
        <EducationSection />
        <ReviewsSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
