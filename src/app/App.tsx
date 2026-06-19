import image_ikang from '@/imports/ikang.jpg'
import { useState, useEffect, useRef, FormEvent } from "react";
import { motion, useInView, AnimatePresence, useScroll, useTransform, Variants } from "motion/react";
import {
  Mail, Instagram, Linkedin, Twitter,
  Star, Check, ArrowRight, Menu, X, ChevronLeft, ChevronRight,
  Clock, TrendingUp, Calendar,
  Database, Headphones, BarChart, FileText, Zap, Shield,
  Send, Sparkles, MapPin, Heart, Quote
} from "lucide-react";

// ─────────────────────────────────────────────
// GLOBAL STYLES (keyframes, scrollbar, etc.)
// ─────────────────────────────────────────────
const GLOBAL_CSS = `
  @keyframes sparkle-float {
    0%,100% { transform: translateY(0) rotate(0deg) scale(1); opacity: 0.22; }
    30%      { transform: translateY(-20px) rotate(55deg) scale(1.15); opacity: 0.38; }
    60%      { transform: translateY(-10px) rotate(110deg) scale(0.9); opacity: 0.18; }
  }
  @keyframes blob-drift {
    0%,100% { border-radius: 60% 40% 55% 45% / 50% 60% 40% 50%; }
    50%      { border-radius: 45% 55% 40% 60% / 55% 45% 60% 40%; }
  }
  @keyframes orbit-spin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  @keyframes orbit-counter {
    from { transform: rotate(0deg); }
    to   { transform: rotate(-360deg); }
  }
  .sparkle { animation: sparkle-float var(--dur,6s) ease-in-out infinite; animation-delay: var(--del,0s); }
  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: #fff5f6; }
  ::-webkit-scrollbar-thumb { background: #ffb3c1; border-radius: 9px; }
  ::-webkit-scrollbar-thumb:hover { background: #ff8fa3; }
  html { scroll-behavior: smooth; }
`;

// ─────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────

const NAV_LINKS = [
  { href: "#about", label: "About" },
  { href: "#services", label: "Services" },
  { href: "#projects", label: "Projects" },
  { href: "#pricing", label: "Pricing" },
  { href: "#testimonials", label: "Testimonials" },
  { href: "#contact", label: "Contact" },
];

const SERVICES = [
  { icon: Shield, title: "Prior Authorization Support", desc: "Obtaining timely approvals from insurance providers for medications, procedures, and patient care with minimal friction." },
  { icon: Calendar, title: "Calendar & Schedule Management", desc: "Patient scheduling, clinic calendar triage, and appointment optimization to eliminate gaps and reduce no-shows." },
  { icon: FileText, title: "Chart Preparation & EHR Support", desc: "Pre-visit charting, medical records scanning, and EHR transcription ensuring data accuracy and compliance." },
  { icon: Mail, title: "Email & Digital Fax Triage", desc: "Managing secure professional communications, lab referrals, results distribution, and digital fax workflows." },
  { icon: Headphones, title: "Patient Communication & Phone Support", desc: "Compassionate patient callbacks, clinic inquiries, insurance verification, and pre-appointment details management." },
  { icon: Database, title: "Patient Intake & Registration", desc: "Processing demographic forms, consent collection, and updating records in compliance with clinical workflows." },
];

const PROJECTS = [
  {
    client: "Oakridge Family Practice",
    type: "Family Medicine Clinic",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&h=480&fit=crop&auto=format",
    services: ["Prior Authorization", "EHR Support", "Patient Intake"],
    before: [{ label: "Prior Auth backlog", value: "7 days" }, { label: "Physician charting/day", value: "3.5 hrs" }, { label: "Patient intake delay", value: "30 mins" }],
    after:  [{ label: "Prior Auth backlog", value: "< 24 hrs" }, { label: "Physician charting/day", value: "1 hr" }, { label: "Patient intake delay", value: "< 5 mins" }],
    headline: "60% reduction in prior authorization bottlenecks",
    outcome: "Eliminated clinic administrative backlogs, freeing providers to see 4 more patients daily and reducing overall clinician charting overtime.",
  },
  {
    client: "Apex Cardiology Group",
    type: "Cardiovascular Specialists",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=480&fit=crop&auto=format",
    services: ["Calendar Management", "Phone Support", "Triage"],
    before: [{ label: "Appointment no-shows", value: "18%" }, { label: "Average phone hold time", value: "8 mins" }, { label: "Unresolved referrals", value: "24/week" }],
    after:  [{ label: "Appointment no-shows", value: "3.2%" }, { label: "Average phone hold time", value: "< 45 secs" }, { label: "Unresolved referrals", value: "Zero" }],
    headline: "82% drop in patient appointment no-shows",
    outcome: "Optimized scheduling systems and implemented a multi-channel reminder flow, directly enhancing referral conversions and clinic revenue.",
  },
  {
    client: "Valley Pediatric Care",
    type: "Pediatric Clinic Group",
    image: "https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=800&h=480&fit=crop&auto=format",
    services: ["Chart Preparation", "Digital Fax Triage", "Email Support"],
    before: [{ label: "Chart errors/week", value: "14 errors" }, { label: "Fax sorting time", value: "4 hrs/day" }, { label: "Referral follow-up", value: "48 hrs" }],
    after:  [{ label: "Chart errors/week", value: "0 errors" }, { label: "Fax sorting time", value: "30 mins/day" }, { label: "Referral follow-up", value: "< 3 hrs" }],
    headline: "100% HIPAA-compliant chart readiness",
    outcome: "Built an automated fax-to-EHR triage system that ensured all patient records and lab results were prepped and uploaded before appointments.",
  },
];

const PRICING = [
  {
    name: "Essential Support",
    monthly: "$597",
    hourly: "$25",
    hrs: "20 hrs / month",
    desc: "Perfect for solo practitioners needing part-time clinic support.",
    features: ["HIPAA-compliant data handling", "Scheduling & calendar coordination", "Basic email & digital fax triage", "Patient record updates", "Prior authorization assistance", "Response within 24 hours"],
    cta: "Schedule a Consultation",
    popular: false,
  },
  {
    name: "Practice Partner",
    monthly: "$1,097",
    hourly: "$35",
    hrs: "40 hrs / month",
    desc: "Ideal for growing clinics seeking dedicated workflow optimization.",
    features: ["Everything in Essential", "Full prior authorization management", "EHR chart preparation & filing", "Phone support & patient callbacks", "Insurance verification support", "Priority response (< 4 hrs)", "Weekly status touchpoints"],
    cta: "Schedule a Consultation",
    popular: true,
  },
  {
    name: "Dedicated Clinical VA",
    monthly: "$1,897",
    hourly: "$45",
    hrs: "80 hrs / month",
    desc: "For busy multi-provider practices needing comprehensive assistance.",
    features: ["Everything in Practice Partner", "Dedicated daily clinic coverage", "EHR management (Epic/Athena)", "Direct physician collaboration", "Urgent request handling (< 1 hr)", "Referral & hospital coordination", "Custom workflow creation"],
    cta: "Schedule a Consultation",
    popular: false,
  },
];

const TESTIMONIALS = [
  {
    name: "Dr. Marcus Vance, MD",
    role: "Lead Physician, Oakridge Family Practice",
    img: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=96&h=96&fit=crop&auto=format",
    text: "Angelica completely revolutionized our administrative workflow. Prior authorizations are now processed within 24 hours instead of taking a week. My stress has decreased, and I can finally focus on direct patient care.",
    rating: 5,
  },
  {
    name: "Sarah Jenkins, MHA",
    role: "Practice Administrator, Apex Cardiology Group",
    img: "https://images.unsplash.com/photo-1594744803329-e58b31de215f?w=96&h=96&fit=crop&auto=format",
    text: "Our appointment no-show rate plummeted after Angelica optimized our scheduling. She is incredibly professional, warm with patients, and handles our EHR tasks with absolute precision and HIPAA compliance.",
    rating: 5,
  },
  {
    name: "Dr. Evelyn Reyes, DDS",
    role: "Owner, Reyes Dental & Specialty Clinic",
    img: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=96&h=96&fit=crop&auto=format",
    text: "Having Angelica support our chart preparation and patient intake has saved us hours of overtime. Her attention to detail and knowledge of medical workflows make her an invaluable partner for our practice.",
    rating: 5,
  },
  {
    name: "David Park, PharmD",
    role: "Clinic Manager, CareFirst Community Pharmacy",
    img: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=96&h=96&fit=crop&auto=format",
    text: "Responsive, secure, and detail-oriented. Angelica managed our patient onboarding and digital faxes without a single error. I highly recommend her to any medical practice searching for top-tier support.",
    rating: 5,
  },
];

const STATS = [
  { val: 15000, suf: "+", label: "Clinical Support Hours" },
  { val: 5, suf: "+", label: "Years Medical Experience" },
  { val: 100, suf: "%", label: "HIPAA Compliant Protocols" },
  { val: 50, suf: "+", label: "Healthcare Providers Supported" },
];

const BENEFITS = [
  { icon: Clock, title: "Reclaim 15+ Clinical Hours Weekly", desc: "Delegate paperwork, fax triage, and scheduler backlogs. Reclaim your focus for direct patient care." },
  { icon: Shield, title: "Strict HIPAA Compliance", desc: "Rigorous patient data security, secure faxes, and professional workflows aligned with clinical compliance." },
  { icon: Zap, title: "Rapid Onboarding Integration", desc: "Experienced with major EHR systems (Epic, Athenahealth), meaning we start providing value on day one." },
  { icon: TrendingUp, title: "Practice Optimization Focus", desc: "Every task handled is geared toward reducing no-shows, patient delays, and doctor documentation fatigue." },
];

const SKILLS = [
  { name: "Prior Authorization Management", pct: 98 },
  { name: "EHR Documentation & Chart Prep (Epic/Athena)", pct: 95 },
  { name: "Patient Scheduling & Calendar Triage", pct: 96 },
  { name: "Clinic Communication & Phone Support", pct: 92 },
  { name: "HIPAA Compliance & Secure Data Handling", pct: 100 },
];

const TOOLS = ["Epic EHR", "Athenahealth", "eClinicalWorks", "SimplePractice", "RingCentral", "Notion", "Slack", "Faxage", "Elation EHR", "Google Workspace"];

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

const scrollTo = (href: string) => {
  document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
};

const ROSE_GRAD = "linear-gradient(135deg, #ff8fa3 0%, #ff758f 100%)";
const ROSE_GRAD_SOFT = "linear-gradient(135deg, #fff5f6 0%, #ffe3e6 100%)";

// ─────────────────────────────────────────────
// SMALL REUSABLE COMPONENTS
// ─────────────────────────────────────────────

function CountUp({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [n, setN] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    const dur = 2400, t0 = Date.now();
    const id = setInterval(() => {
      const p = Math.min((Date.now() - t0) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setN(Math.floor(ease * target));
      if (p >= 1) { setN(target); clearInterval(id); }
    }, 16);
    return () => clearInterval(id);
  }, [inView, target]);
  return <span ref={ref}>{n.toLocaleString()}{suffix}</span>;
}

function SkillBar({ name, pct }: { name: string; pct: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <div ref={ref} className="mb-5">
      <div className="flex justify-between mb-1.5">
        <span className="text-sm font-medium text-foreground">{name}</span>
        <span className="text-sm text-muted-foreground">{pct}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-pink-100 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: ROSE_GRAD }}
          initial={{ width: 0 }}
          animate={{ width: inView ? `${pct}%` : 0 }}
          transition={{ duration: 1.3, ease: "easeOut", delay: 0.25 }}
        />
      </div>
    </div>
  );
}

function EyebrowLabel({ text }: { text: string }) {
  return (
    <div className="flex items-center justify-center gap-3 mb-4">
      <span className="h-px w-6 bg-rose-200 block" />
      <Sparkles size={12} className="text-rose-300" />
      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-400">{text}</span>
      <Sparkles size={12} className="text-rose-300" />
      <span className="h-px w-6 bg-rose-200 block" />
    </div>
  );
}

function SectionTitle({ eyebrow, title, sub }: { eyebrow: string; title: string; sub?: string }) {
  return (
    <motion.div
      className="text-center mb-16 max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.65 }}
    >
      <EyebrowLabel text={eyebrow} />
      <h2
        className="text-4xl md:text-5xl font-semibold text-foreground leading-tight mb-4"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        {title}
      </h2>
      {sub && <p className="text-muted-foreground text-lg leading-relaxed">{sub}</p>}
    </motion.div>
  );
}

function GlassCard({ className = "", children, delay = 0, style = {} }: {
  className?: string; children: React.ReactNode; delay?: number; style?: React.CSSProperties;
}) {
  return (
    <motion.div
      className={`rounded-2xl ${className}`}
      style={{
        background: "rgba(255,255,255,0.72)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.85)",
        boxShadow: "0 4px 28px rgba(184,92,110,0.07)",
        ...style,
      }}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, delay }}
      whileHover={{ y: -6, boxShadow: "0 16px 40px rgba(184,92,110,0.14)", transition: { duration: 0.25 } }}
    >
      {children}
    </motion.div>
  );
}

function Sparkle({ size = 10, delay = 0, dur = 6, top = "50%", left = "50%" }: {
  size?: number; delay?: number; dur?: number; top?: string; left?: string;
}) {
  return (
    <div
      className="sparkle absolute pointer-events-none"
      style={{ top, left, "--dur": `${dur}s`, "--del": `${delay}s` } as React.CSSProperties}
    >
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className="text-rose-300">
        <path d="M12 2 L13.5 9 L20 12 L13.5 15 L12 22 L10.5 15 L4 12 L10.5 9 Z" />
      </svg>
    </div>
  );
}

function SparkleField({ count = 8 }: { count?: number }) {
  const positions = [
    { top: "8%",  left: "5%",  size: 10, dur: 5.5, delay: 0 },
    { top: "15%", left: "92%", size: 7,  dur: 7,   delay: 1.2 },
    { top: "35%", left: "2%",  size: 8,  dur: 6.5, delay: 2.1 },
    { top: "52%", left: "95%", size: 12, dur: 8,   delay: 0.7 },
    { top: "70%", left: "4%",  size: 8,  dur: 6,   delay: 1.8 },
    { top: "85%", left: "88%", size: 10, dur: 7.5, delay: 3.0 },
    { top: "28%", left: "50%", size: 6,  dur: 9,   delay: 4.0 },
    { top: "60%", left: "48%", size: 7,  dur: 5,   delay: 2.5 },
  ].slice(0, count);
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {positions.map((p, i) => <Sparkle key={i} {...p} />)}
    </div>
  );
}

// ─────────────────────────────────────────────
// NAVIGATION
// ─────────────────────────────────────────────
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 55);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const goto = (href: string) => { scrollTo(href); setOpen(false); };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={scrolled ? {
          background: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          borderBottom: "1px solid rgba(255,143,163,0.25)",
          boxShadow: "0 2px 24px rgba(255,143,163,0.06)",
        } : {}}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10 flex items-center justify-between h-[72px]">
          <button onClick={() => goto("#hero")} className="text-left group">
            <p className="text-xl font-semibold tracking-tight text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>Angelica Aljas</p>
            <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground group-hover:text-primary transition-colors">Medical Virtual Assistant</p>
          </button>

          <div className="hidden md:flex items-center gap-7">
            {NAV_LINKS.map((l) => (
              <button key={l.href} onClick={() => goto(l.href)} className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium relative group">
                {l.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-primary group-hover:w-full transition-all duration-300" />
              </button>
            ))}
          </div>

          <button
            onClick={() => goto("#contact")}
            className="hidden md:flex items-center gap-2 px-5 py-2.5 rounded-full text-white text-sm font-medium transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/40"
            style={{ background: ROSE_GRAD }}
          >
            Schedule Consultation <ArrowRight size={14} />
          </button>

          <button className="md:hidden p-2 text-foreground" onClick={() => setOpen(!open)} aria-label="Toggle menu">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22 }}
            className="fixed top-[72px] left-0 right-0 z-40 p-6 flex flex-col gap-4 md:hidden"
            style={{ background: "rgba(255,255,255,0.97)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,143,163,0.25)" }}
          >
            {NAV_LINKS.map((l, i) => (
              <motion.button
                key={l.href}
                onClick={() => goto(l.href)}
                className="text-left text-lg font-medium text-foreground hover:text-primary transition-colors py-1 border-b border-pink-100"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                {l.label}
              </motion.button>
            ))}
            <button onClick={() => goto("#contact")} className="mt-2 px-6 py-3.5 rounded-full text-white text-sm font-medium" style={{ background: ROSE_GRAD }}>
              Schedule a Consultation
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}


// ─────────────────────────────────────────────
// HERO
// ─────────────────────────────────────────────

function Hero() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.15 });

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const blob1Y = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const blob2Y = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const textY   = useTransform(scrollYProgress, [0, 1], [0, 40]);

  // Framer Motion strictly typed variants to resolve type union constraints
  const gridVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
      },
    },
  };

  const copyContainerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const badgeVariants: Variants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const subtitleVariants: Variants = {
    hidden: { y: "100%", opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6 } }
  };

  const h1Variants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7 } }
  };

  const bodyVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const buttonsVariants: Variants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.55 } }
  };

  const statsVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6 } }
  };

  const portraitVariants: Variants = {
    hidden: { opacity: 0, scale: 0.92 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: "easeOut" } },
  };

  return (
    <section id="hero" ref={ref} className="relative min-h-screen flex items-center overflow-hidden pt-[72px]"
      style={{ background: "linear-gradient(140deg, #fff5f6 0%, #ffffff 45%, #ffe3e6 100%)" }}
    >
      {/* Parallax blobs */}
      <motion.div className="absolute -top-24 -right-24 w-[480px] h-[480px] rounded-full pointer-events-none" style={{ y: blob1Y, background: "radial-gradient(circle, rgba(255,143,163,0.15), transparent 70%)" }} />
      <motion.div className="absolute bottom-0 -left-20 w-[380px] h-[380px] rounded-full pointer-events-none" style={{ y: blob2Y, background: "radial-gradient(circle, rgba(255,179,193,0.12), transparent 70%)" }} />

      <SparkleField count={8} />

      <div className="max-w-7xl mx-auto px-6 lg:px-10 w-full py-20">
        <motion.div
          style={{ y: textY }}
          className="grid lg:grid-cols-[1fr_auto] gap-16 items-center"
          variants={gridVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >

          {/* Copy */}
          <motion.div className="max-w-2xl" variants={copyContainerVariants}>
            <motion.div
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full mb-8 border"
              style={{ background: "rgba(255,255,255,0.8)", borderColor: "rgba(255,143,163,0.3)", boxShadow: "0 2px 12px rgba(255,143,163,0.05)" }}
              variants={badgeVariants}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              <span className="text-xs font-semibold text-primary tracking-wide">Available for Practice Support</span>
            </motion.div>

            <div className="overflow-hidden mb-2">
              <motion.p
                className="text-sm font-semibold uppercase tracking-[0.2em] text-primary mb-5"
                variants={subtitleVariants}
              >
                Medical Virtual Assistant &amp; Clinical Support
              </motion.p>
            </div>

            <motion.h1
              className="font-semibold text-foreground leading-[1.1] mb-6"
              style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.5rem, 5vw, 4.2rem)" }}
              variants={h1Variants}
            >
              Streamlining Medical Operations,{" "}
              <span
                style={{ background: "linear-gradient(135deg, #a34858, #ff8fa3, #ff758f)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
              >
                Patient Care,
              </span>
              <br />
              and Practice{" "}
              <em>Administration.</em>
            </motion.h1>

            <motion.p
              className="text-lg text-muted-foreground leading-relaxed mb-10 max-w-lg"
              variants={bodyVariants}
            >
              Hi, I am Angelica — a dedicated Medical Virtual Assistant with 5+ years of experience helping healthcare providers, doctors, and clinic administrators optimize operations, minimize documentation fatigue, and ensure HIPAA-compliant management of patient care.
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-4 mb-12"
              variants={buttonsVariants}
            >
              <button
                onClick={() => scrollTo("#contact")}
                className="group flex items-center gap-2.5 px-8 py-4 rounded-full text-white font-medium text-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/30"
                style={{ background: ROSE_GRAD }}
              >
                Schedule a Consultation
                <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform duration-200" />
              </button>
              <button
                onClick={() => scrollTo("#services")}
                className="flex items-center gap-2 px-8 py-4 rounded-full text-sm font-medium border-2 transition-all duration-300 hover:bg-rose-50"
                style={{ borderColor: "#ff8fa3", color: "#a34858" }}
              >
                View Medical Services
              </button>
            </motion.div>

            <motion.div
              className="flex flex-wrap items-center gap-6 text-sm"
              variants={statsVariants}
            >
              <div className="flex items-center gap-2">
                <div className="flex">{[...Array(5)].map((_, i) => <Star key={i} size={14} fill="#f59e0b" className="text-amber-400" />)}</div>
                <span className="text-muted-foreground font-medium">5.0 Rated</span>
              </div>
              <span className="h-4 w-px bg-border" />
              <span className="text-muted-foreground flex items-center gap-1.5"><Shield size={14} className="text-primary" /> HIPAA Compliant Protocols</span>
              <span className="h-4 w-px bg-border" />
              <span className="text-muted-foreground"><strong className="text-foreground">15k+</strong> support hours</span>
            </motion.div>
          </motion.div>

          {/* Portrait */}
          <motion.div
            className="hidden lg:flex items-center justify-center relative"
            variants={portraitVariants}
          >
            {/* Orbit rings */}
            <div className="absolute w-[420px] h-[420px] rounded-full border border-dashed" style={{ borderColor: "rgba(255,143,163,0.25)", animation: "orbit-spin 35s linear infinite" }} />
            <div className="absolute w-[350px] h-[350px] rounded-full border" style={{ borderColor: "rgba(255,179,193,0.2)", animation: "orbit-counter 25s linear infinite" }} />

            {/* Gradient border portrait */}
            <div className="relative z-10" style={{ padding: "3px", borderRadius: "28px", background: "linear-gradient(135deg, #a34858, #ff8fa3, #ffb3c1)" }}>
              <div className="w-[280px] h-[360px] rounded-[26px] overflow-hidden" style={{ background: "#fff5f6" }}>
                <img
                  src={image_ikang}
                  alt="Angelica Aljas — Medical Virtual Assistant"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Floating chips */}
            <motion.div
              className="absolute z-20 -left-16 top-16 rounded-2xl border px-[16px] py-[12px]"
              style={{ background: "rgba(255,255,255,0.92)", backdropFilter: "blur(12px)", borderColor: "rgba(255,143,163,0.3)", boxShadow: "0 4px 20px rgba(255,143,163,0.1)" }}
              animate={{ y: [-8, 8, -8] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Experience</p>
              <p className="text-2xl font-semibold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>5+ Yrs</p>
            </motion.div>

            <motion.div
              className="absolute z-20 -right-12 bottom-20 rounded-2xl px-4 py-3 border flex items-center gap-2"
              style={{ background: "rgba(255,255,255,0.92)", backdropFilter: "blur(12px)", borderColor: "rgba(255,143,163,0.3)", boxShadow: "0 4px 20px rgba(255,143,163,0.1)" }}
              animate={{ y: [8, -8, 8] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            >
              <Shield size={18} className="text-primary" />
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Compliance</p>
                <p className="text-xs font-semibold text-foreground">HIPAA Compliant</p>
              </div>
            </motion.div>

            {/* Sparkles near portrait */}
            {[
              { t: "4%",  l: "72%", s: 14, d: 0 },
              { t: "88%", l: "68%", s: 10, d: 1.5 },
              { t: "50%", l: "4%",  s: 12, d: 2.3 },
              { t: "10%", l: "10%", s: 8,  d: 0.7 },
            ].map(({ t, l, s, d }, i) => (
              <div key={i} className="sparkle absolute pointer-events-none" style={{ top: t, left: l, "--dur": "5s", "--del": `${d}s`, opacity: 0.4 } as React.CSSProperties}>
                <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor" className="text-rose-300">
                  <path d="M12 2 L13.5 9 L20 12 L13.5 15 L12 22 L10.5 15 L4 12 L10.5 9 Z" />
                </svg>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        animate={{ opacity: isInView ? 1 : 0 }}
        transition={{ duration: 0.5, delay: isInView ? 0.8 : 0 }}
      >
        <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Scroll to explore</p>
        <motion.div
          className="w-5 h-8 rounded-full border-2 flex items-start justify-center p-1"
          style={{ borderColor: "rgba(255,143,163,0.3)" }}
        >
          <motion.div className="w-1 h-2 rounded-full" style={{ background: "#ff8fa3" }} animate={{ y: [0, 12, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }} />
        </motion.div>
      </motion.div>
    </section>
  );
}

// ─────────────────────────────────────────────
// ABOUT
// ─────────────────────────────────────────────

function About() {
  return (
    <section id="about" className="py-28 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-2 gap-20 items-center">

          {/* Photo side */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -48 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.72 }}
          >
            {/* Offset frame accent */}
            <div className="absolute inset-0 translate-x-4 translate-y-4 rounded-3xl border-2 border-dashed pointer-events-none" style={{ borderColor: "rgba(255,143,163,0.25)" }} />

            <div className="relative rounded-3xl overflow-hidden aspect-[4/5]" style={{ background: "#fff5f6", boxShadow: "0 24px 60px rgba(255,143,163,0.14)" }}>
              <img
                src={image_ikang}
                alt="About Angelica Aljas"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>

          {/* Content side */}
          <motion.div
            initial={{ opacity: 0, x: 48 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.72 }}
          >
            <EyebrowLabel text="About Me" />
            <h2 className="text-3xl md:text-4xl font-semibold mb-6 text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>
              Your Trusted Partner in Clinical Workflow Optimization
            </h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              With over half a decade working closely beside providers across various fields—from general medicine to specialized clinical networks—I understand the modern burden of administrative overhead. 
            </p>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              My mission is straightforward: eliminating documentation obstacles and coordinating dynamic patient lines so you can show up fully to your true calling—clinical care.
            </p>

            {/* Profile Skill bars */}
            {SKILLS.map((s, idx) => (
              <SkillBar key={idx} name={s.name} pct={s.pct} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// SERVICES SECTION
// ─────────────────────────────────────────────

function Services() {
  return (
    <section id="services" className="py-28 bg-[#fff5f6]">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <SectionTitle 
          eyebrow="Expertise" 
          title="Comprehensive Medical VA Services" 
          sub="Precision support custom-tailored to minimize friction, lower wait lists, and enhance administrative clarity."
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SERVICES.map((s, i) => (
            <GlassCard key={i} className="p-8 flex flex-col items-start text-left" delay={i * 0.08}>
              <div className="p-4 rounded-2xl mb-6 text-primary bg-pink-50 border border-rose-100">
                <s.icon size={24} />
              </div>
              <h3 className="text-xl font-medium mb-3 text-foreground">{s.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// PROJECTS & CASE STUDIES SECTION
// ─────────────────────────────────────────────

function Projects() {
  return (
    <section id="projects" className="py-28 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <SectionTitle 
          eyebrow="Outcomes" 
          title="Proven Clinic Case Transformations" 
          sub="Real metrics reflecting reduced backlog timelines, accelerated authorization speed, and optimization shifts."
        />

        <div className="space-y-20">
          {PROJECTS.map((p, i) => (
            <motion.div 
              key={i}
              className={`grid lg:grid-cols-2 gap-12 items-center`}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.65 }}
            >
              {/* Image box */}
              <div className={`relative overflow-hidden rounded-3xl border border-rose-100 shadow-xl shadow-rose-100/30 ${i % 2 === 1 ? 'lg:order-2' : ''}`}>
                <img src={p.image} alt={p.client} className="w-full h-auto aspect-[4/3] object-cover" />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-4 py-1.5 rounded-full text-xs font-semibold text-primary border border-rose-100">
                  {p.type}
                </div>
              </div>

              {/* Data and metrics box */}
              <div className={i % 2 === 1 ? 'lg:order-1' : ''}>
                <h3 className="text-2xl font-semibold text-foreground mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>{p.client}</h3>
                <p className="text-primary font-medium text-sm mb-6 flex flex-wrap gap-2">
                  {p.services.map((s, idx) => <span key={idx} className="bg-pink-50 border border-rose-100/60 px-3 py-1 rounded-full text-xs">{s}</span>)}
                </p>
                <h4 className="text-xl font-semibold text-foreground mb-4 leading-snug">{p.headline}</h4>
                <p className="text-muted-foreground mb-8 text-sm leading-relaxed">{p.outcome}</p>

                {/* Metrics Table Comparison */}
                <div className="grid grid-cols-2 gap-4 border-t border-pink-100 pt-6">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Before Support</p>
                    {p.before.map((b, idx) => (
                      <div key={idx} className="mb-2">
                        <p className="text-xs text-muted-foreground">{b.label}</p>
                        <p className="text-sm font-semibold text-rose-700">{b.value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="border-l border-pink-50 pl-6">
                    <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-3">Optimized Result</p>
                    {p.after.map((a, idx) => (
                      <div key={idx} className="mb-2">
                        <p className="text-xs text-muted-foreground">{a.label}</p>
                        <p className="text-sm font-semibold text-emerald-600">{a.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// PRICING SECTION
// ─────────────────────────────────────────────

function Pricing() {
  return (
    <section id="pricing" className="py-28 bg-[#fff5f6]">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <SectionTitle 
          eyebrow="Investment" 
          title="Flexible Practice Retainers" 
          sub="Scalable monthly solutions configured strictly to adapt to individual operational workflows and volume constraints."
        />

        <div className="grid lg:grid-cols-3 gap-8 items-stretch">
          {PRICING.map((p, i) => (
            <motion.div
              key={i}
              className={`rounded-3xl p-8 relative flex flex-col justify-between bg-white border ${p.popular ? 'border-primary shadow-xl shadow-rose-200/40' : 'border-rose-100'}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: i * 0.1 }}
            >
              {p.popular && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-primary text-white text-[11px] font-bold uppercase tracking-widest px-4 py-1 rounded-full shadow-md">
                  Most Popular Partner
                </span>
              )}

              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{p.name}</h3>
                <p className="text-muted-foreground text-xs mb-6 min-h-[32px]">{p.desc}</p>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-4xl font-bold text-foreground">{p.monthly}</span>
                  <span className="text-muted-foreground text-xs">/ month</span>
                </div>
                <p className="text-xs text-primary font-medium mb-6 bg-pink-50 border border-rose-100/50 inline-block px-2.5 py-1 rounded-md">
                  {p.hrs} ({p.hourly}/hr)
                </p>
                <div className="h-px bg-pink-50 w-full mb-6" />
                
                <ul className="space-y-3 mb-8">
                  {p.features.map((f, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-muted-foreground leading-tight">
                      <Check size={14} className="text-primary mt-0.5 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => scrollTo("#contact")}
                className={`w-full py-3.5 rounded-full font-medium text-sm transition-all duration-300 ${p.popular ? 'text-white shadow-lg shadow-primary/20' : 'text-primary bg-pink-50 border border-rose-100 hover:bg-pink-100'}`}
                style={p.popular ? { background: ROSE_GRAD } : {}}
              >
                {p.cta}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// TESTIMONIALS SECTION
// ─────────────────────────────────────────────

function Testimonials() {
  const [active, setActive] = useState(0);

  return (
    <section id="testimonials" className="py-28 bg-white overflow-hidden">
      <div className="max-w-5xl mx-auto px-6">
        <SectionTitle 
          eyebrow="Reviews" 
          title="Endorsed by Clinical Professionals" 
        />

        <div className="relative min-h-[280px] flex flex-col items-center text-center max-w-3xl mx-auto">
          <Quote size={48} className="text-rose-100 mb-6 absolute -top-8 -left-6 opacity-60 pointer-events-none" />
          
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.35 }}
              className="z-10"
            >
              <p className="text-lg md:text-xl text-foreground font-medium leading-relaxed mb-8 italic">
                "{TESTIMONIALS[active].text}"
              </p>
              <div className="flex items-center justify-center gap-4">
                <img src={TESTIMONIALS[active].img} alt={TESTIMONIALS[active].name} className="w-12 h-12 rounded-full border-2 border-primary object-cover" />
                <div className="text-left">
                  <h4 className="font-semibold text-foreground text-sm">{TESTIMONIALS[active].name}</h4>
                  <p className="text-xs text-muted-foreground">{TESTIMONIALS[active].role}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Controls */}
          <div className="flex gap-3 mt-12 z-20">
            <button 
              onClick={() => setActive(prev => (prev === 0 ? TESTIMONIALS.length - 1 : prev - 1))}
              className="p-3 rounded-full border border-rose-100 text-muted-foreground hover:text-primary hover:bg-pink-50 transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <button 
              onClick={() => setActive(prev => (prev === TESTIMONIALS.length - 1 ? 0 : prev + 1))}
              className="p-3 rounded-full border border-rose-100 text-muted-foreground hover:text-primary hover:bg-pink-50 transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// CONTACT SECTION
// ─────────────────────────────────────────────

function Contact() {
  const [formState, setFormState] = useState({ name: "", email: "", clinic: "", note: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 4000);
    setFormState({ name: "", email: "", clinic: "", note: "" });
  };

  return (
    <section id="contact" className="py-28 bg-[#fff5f6] relative">
      <div className="max-w-4xl mx-auto px-6">
        <SectionTitle 
          eyebrow="Connect" 
          title="Initiate a Workflow Triage Session" 
          sub="Let's align your operational constraints with strict HIPAA guidelines to optimize administrative tasks."
        />

        <GlassCard className="p-8 md:p-12 border border-rose-100/60 shadow-2xl shadow-rose-100/40">
          <form onSubmit={handleSubmit} className="space-y-6 text-left">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Provider/Contact Name</label>
                <input 
                  type="text" required 
                  value={formState.name} onChange={e => setFormState({...formState, name: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-rose-100 bg-white/70 focus:outline-none focus:border-primary text-sm transition-colors text-foreground" 
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Secure Practice Email</label>
                <input 
                  type="email" required 
                  value={formState.email} onChange={e => setFormState({...formState, email: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-rose-100 bg-white/70 focus:outline-none focus:border-primary text-sm transition-colors text-foreground" 
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Practice / Clinic Name</label>
              <input 
                type="text" 
                value={formState.clinic} onChange={e => setFormState({...formState, clinic: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-rose-100 bg-white/70 focus:outline-none focus:border-primary text-sm transition-colors text-foreground" 
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Current System Impediments or EHR Setup</label>
              <textarea 
                rows={4} required
                value={formState.note} onChange={e => setFormState({...formState, note: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-rose-100 bg-white/70 focus:outline-none focus:border-primary text-sm transition-colors text-foreground resize-none" 
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-full text-white font-medium text-sm transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:-translate-y-0.5"
              style={{ background: ROSE_GRAD }}
            >
              {sent ? (
                <>Meeting Request Processed <Check size={16} /></>
              ) : (
                <>Request Practice Triage Consultation <Send size={14} /></>
              )}
            </button>
          </form>
        </GlassCard>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// MAIN APP COMPONENT
// ─────────────────────────────────────────────

export default function App() {
  return (
    <div className="bg-[#fff5f6] text-foreground min-h-screen relative antialiased selection:bg-pink-100 selection:text-rose-800">
      <Nav />
      <Hero />
      <About />
      <Services />
      <Projects />
      <Pricing />
      <Testimonials />
      <Contact />

      {/* FOOTER */}
      <footer className="py-12 border-t border-pink-100 bg-white text-sm text-muted-foreground">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <p>© {new Date().getFullYear()} Angelica Aljas. Fully Protected HIPAA Compliant Administrative Ecosystem.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-primary transition-colors"><Linkedin size={16} /></a>
            <a href="#" className="hover:text-primary transition-colors"><Mail size={16} /></a>
          </div>
        </div>
      </footer>
    </div>
  );
}