import image_ikang from '@/imports/ikang.jpg'
import { useState, useEffect, useRef, FormEvent } from "react";
import { motion, useInView, AnimatePresence, useScroll, useTransform } from "motion/react";
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
  ::-webkit-scrollbar-track { background: #fef7f9; }
  ::-webkit-scrollbar-thumb { background: #e0a0b4; border-radius: 9px; }
  ::-webkit-scrollbar-thumb:hover { background: #c05c72; }
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

const ROSE_GRAD = "linear-gradient(135deg, #0d9488 0%, #0284c7 100%)";
const ROSE_GRAD_SOFT = "linear-gradient(135deg, #f0fdfa 0%, #e0f2fe 100%)";

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
          borderBottom: "1px solid rgba(13,148,136,0.2)",
          boxShadow: "0 2px 24px rgba(13,148,136,0.06)",
        } : {}}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10 flex items-center justify-between h-[72px]">
          <button onClick={() => goto("#hero")} className="text-left group">
            <p className="text-xl font-semibold tracking-tight text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>Angelica Aljas</p>
            <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground group-hover:text-teal-600 transition-colors">Medical Virtual Assistant</p>
          </button>

          <div className="hidden md:flex items-center gap-7">
            {NAV_LINKS.map((l) => (
              <button key={l.href} onClick={() => goto(l.href)} className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium relative group">
                {l.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-teal-400 group-hover:w-full transition-all duration-300" />
              </button>
            ))}
          </div>

          <button
            onClick={() => goto("#contact")}
            className="hidden md:flex items-center gap-2 px-5 py-2.5 rounded-full text-white text-sm font-medium transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-teal-200/40"
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
            style={{ background: "rgba(255,255,255,0.97)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(13,148,136,0.2)" }}
          >
            {NAV_LINKS.map((l, i) => (
              <motion.button
                key={l.href}
                onClick={() => goto(l.href)}
                className="text-left text-lg font-medium text-foreground hover:text-primary transition-colors py-1 border-b border-teal-50"
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

  // Motion variants for viewport scroll entry & exit animations
  const gridVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
      },
    },
  };

  const copyContainerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const badgeVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const subtitleVariants = {
    hidden: { y: "100%", opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6 } }
  };

  const h1Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7 } }
  };

  const bodyVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const buttonsVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.55 } }
  };

  const statsVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6 } }
  };

  const portraitVariants = {
    hidden: { opacity: 0, scale: 0.92 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: "easeOut" } },
  };

  return (
    <section id="hero" ref={ref} className="relative min-h-screen flex items-center overflow-hidden pt-[72px]"
      style={{ background: "linear-gradient(140deg, #f0fdfa 0%, #f8fafc 45%, #f0f9ff 100%)" }}
    >
      {/* Parallax blobs */}
      <motion.div className="absolute -top-24 -right-24 w-[480px] h-[480px] rounded-full pointer-events-none" style={{ y: blob1Y, background: "radial-gradient(circle, rgba(13,148,136,0.15), transparent 70%)" }} />
      <motion.div className="absolute bottom-0 -left-20 w-[380px] h-[380px] rounded-full pointer-events-none" style={{ y: blob2Y, background: "radial-gradient(circle, rgba(14,165,233,0.12), transparent 70%)" }} />

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
              style={{ background: "rgba(255,255,255,0.8)", borderColor: "rgba(13,148,136,0.3)", boxShadow: "0 2px 12px rgba(13,148,136,0.05)" }}
              variants={badgeVariants}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500" />
              </span>
              <span className="text-xs font-semibold text-teal-600 tracking-wide">Available for Practice Support</span>
            </motion.div>

            <div className="overflow-hidden mb-2">
              <motion.p
                className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-600 mb-5"
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
                style={{ background: "linear-gradient(135deg, #0f766e, #0d9488, #0284c7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
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
                className="group flex items-center gap-2.5 px-8 py-4 rounded-full text-white font-medium text-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-teal-300/30"
                style={{ background: ROSE_GRAD }}
              >
                Schedule a Consultation
                <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform duration-200" />
              </button>
              <button
                onClick={() => scrollTo("#services")}
                className="flex items-center gap-2 px-8 py-4 rounded-full text-sm font-medium border-2 transition-all duration-300 hover:bg-teal-50"
                style={{ borderColor: "#0d9488", color: "#0f766e" }}
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
              <span className="text-muted-foreground flex items-center gap-1.5"><Shield size={14} className="text-teal-600" /> HIPAA Compliant Protocols</span>
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
            <div className="absolute w-[420px] h-[420px] rounded-full border border-dashed" style={{ borderColor: "rgba(13,148,136,0.2)", animation: "orbit-spin 35s linear infinite" }} />
            <div className="absolute w-[350px] h-[350px] rounded-full border" style={{ borderColor: "rgba(14,165,233,0.15)", animation: "orbit-counter 25s linear infinite" }} />

            {/* Gradient border portrait */}
            <div className="relative z-10" style={{ padding: "3px", borderRadius: "28px", background: "linear-gradient(135deg, #0f766e, #0d9488, #0284c7)" }}>
              <div className="w-[280px] h-[360px] rounded-[26px] overflow-hidden" style={{ background: "#f0fdfa" }}>
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
              style={{ background: "rgba(255,255,255,0.92)", backdropFilter: "blur(12px)", borderColor: "rgba(13,148,136,0.3)", boxShadow: "0 4px 20px rgba(13,148,136,0.1)" }}
              animate={{ y: [-8, 8, -8] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Experience</p>
              <p className="text-2xl font-semibold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>5+ Yrs</p>
            </motion.div>

            <motion.div
              className="absolute z-20 -right-12 bottom-20 rounded-2xl px-4 py-3 border flex items-center gap-2"
              style={{ background: "rgba(255,255,255,0.92)", backdropFilter: "blur(12px)", borderColor: "rgba(13,148,136,0.3)", boxShadow: "0 4px 20px rgba(13,148,136,0.1)" }}
              animate={{ y: [8, -8, 8] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            >
              <Shield size={18} className="text-teal-600" />
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
                <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor" className="text-teal-300">
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
          style={{ borderColor: "rgba(13,148,136,0.3)" }}
        >
          <motion.div className="w-1 h-2 rounded-full" style={{ background: "#0d9488" }} animate={{ y: [0, 12, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }} />
        </motion.div>
      </motion.div>
    </section>
  );
}

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
            <div className="absolute inset-0 translate-x-4 translate-y-4 rounded-3xl border-2 border-dashed pointer-events-none" style={{ borderColor: "rgba(13,148,136,0.2)" }} />

            <div className="relative rounded-3xl overflow-hidden aspect-[4/5]" style={{ background: "#f0fdfa", boxShadow: "0 24px 60px rgba(13,148,136,0.14)" }}>
              <img
                src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=640&h=800&fit=crop&auto=format"
                alt="Angelica Aljas — Medical Virtual Assistant"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(13,148,136,0.12) 0%, transparent 55%)" }} />
            </div>

            {/* Floating badge */}
            <div
              className="absolute -bottom-6 right-4 px-6 py-4 rounded-2xl"
              style={{ background: "rgba(255,255,255,0.95)", backdropFilter: "blur(16px)", border: "1px solid rgba(13,148,136,0.5)", boxShadow: "0 8px 32px rgba(13,148,136,0.12)" }}
            >
              <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground mb-1">Experience</p>
              <p className="text-3xl font-semibold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>5+ Years</p>
              <p className="text-xs text-muted-foreground mt-0.5">of dedicated clinical support</p>
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
            <h2 className="text-4xl md:text-5xl font-semibold text-foreground mb-6 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
              Your Behind-the-Scenes <em style={{ color: "#0f766e" }}>Practice Partner</em>
            </h2>
            <p className="text-muted-foreground leading-relaxed text-lg mb-4">
              Hi there! I am Angelica — a dedicated Medical Virtual Assistant specializing in remote administrative and clinical support for private practices, clinics, and healthcare practitioners.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Over the past 5 years, I have supported 50+ providers in managing patient communication, prior authorizations, calendar triaging, and EHR chart preparation. I maintain a strict commitment to HIPAA compliance and patient data privacy.
            </p>

            <div className="mb-8">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground mb-5">Core Expertise</p>
              {SKILLS.map((s) => <SkillBar key={s.name} name={s.name} pct={s.pct} />)}
            </div>

            <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground mb-3">Tools I Work With</p>
            <div className="flex flex-wrap gap-2">
              {TOOLS.map((t) => (
                <span key={t} className="px-3 py-1.5 rounded-full text-xs font-medium border" style={{ background: ROSE_GRAD_SOFT, borderColor: "rgba(13,148,136,0.15)", color: "#0f766e" }}>
                  {t}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// SERVICES
// ─────────────────────────────────────────────



function Services() {
  return (
    <section id="services" className="py-28 relative overflow-hidden" style={{ background: "linear-gradient(180deg, #f0fdfa 0%, #f8fafc 100%)" }}>
      <SparkleField count={5} />
      <div className="max-w-7xl mx-auto px-6 lg:px-10 relative">
        <SectionTitle
          eyebrow="What I Offer"
          title="Clinical & Administrative Support Services"
          sub="From HIPAA-compliant prior authorizations to schedule optimization — specialized remote support that integrates directly into your practice workflows."
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {SERVICES.map((svc, i) => {
            const Icon = svc.icon;
            return (
              <GlassCard key={svc.title} className="p-7 group cursor-default" delay={i * 0.07}>
                {/* Gradient top border */}
                <div className="absolute top-0 left-6 right-6 h-0.5 rounded-b-full opacity-0 group-hover:opacity-100 transition-opacity duration-400" style={{ background: ROSE_GRAD }} />

                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3" style={{ background: ROSE_GRAD_SOFT }}>
                  <Icon size={20} className="text-teal-600" />
                </div>
                <h3 className="font-semibold text-foreground mb-2.5 text-[15px] leading-snug" style={{ fontFamily: "'Playfair Display', serif" }}>{svc.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{svc.desc}</p>
              </GlassCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// PROJECTS
// ─────────────────────────────────────────────

function Projects() {
  return (
    <section id="projects" className="py-28 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <SectionTitle
          eyebrow="Case Studies"
          title="Proven Clinical Impact"
          sub="Every case study demonstrates optimized clinic operations and tangible improvements for practitioners."
        />

        <div className="flex flex-col gap-24">
          {PROJECTS.map((p, i) => (
            <motion.article
              key={p.client}
              className="grid lg:grid-cols-2 gap-12 items-center"
              initial={{ opacity: 0, x: i % 2 === 0 ? -56 : 56 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.72 }}
            >
              {/* Image */}
              <div className={i % 2 === 1 ? "lg:order-2" : ""}>
                <div className="relative rounded-3xl overflow-hidden aspect-video" style={{ background: "#f0fdfa", boxShadow: "0 20px 56px rgba(13,148,136,0.12)" }}>
                  <img src={p.image} alt={p.client} className="w-full h-full object-cover" />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(13,148,136,0.35) 0%, transparent 55%)" }} />

                  {/* Tag chips */}
                  <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
                    {p.services.map((s) => (
                      <span key={s} className="px-3 py-1 rounded-full text-xs font-semibold" style={{ background: "rgba(255,255,255,0.88)", color: "#0f766e", backdropFilter: "blur(8px)" }}>
                        {s}
                      </span>
                    ))}
                  </div>

                  {/* Index badge */}
                  <div className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ background: ROSE_GRAD }}>
                    0{i + 1}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className={i % 2 === 1 ? "lg:order-1" : ""}>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-600 mb-2">{p.type}</p>
                <h3 className="text-3xl md:text-4xl font-semibold text-foreground mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>{p.client}</h3>
                <p className="text-muted-foreground leading-relaxed mb-8">{p.outcome}</p>

                {/* Before / After */}
                <div className="rounded-2xl overflow-hidden border mb-8" style={{ borderColor: "rgba(13,148,136,0.35)" }}>
                  <div className="grid grid-cols-2">
                    <div className="p-5 border-r" style={{ background: "#fafafa", borderColor: "rgba(13,148,136,0.25)" }}>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">Before</p>
                      {p.before.map((b) => (
                        <div key={b.label} className="mb-2.5 last:mb-0">
                          <p className="text-base font-semibold text-muted-foreground">{b.value}</p>
                          <p className="text-[11px] text-muted-foreground/70">{b.label}</p>
                        </div>
                      ))}
                    </div>
                    <div className="p-5" style={{ background: ROSE_GRAD_SOFT }}>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-teal-600 mb-3">After</p>
                      {p.after.map((a) => (
                        <div key={a.label} className="mb-2.5 last:mb-0">
                          <p className="text-base font-bold text-foreground">{a.value}</p>
                          <p className="text-[11px] text-muted-foreground">{a.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="px-5 py-3.5 border-t" style={{ background: ROSE_GRAD, borderColor: "transparent" }}>
                    <p className="text-xs font-semibold text-white">{p.headline}</p>
                  </div>
                </div>

                <button className="group flex items-center gap-2 text-sm font-semibold transition-all duration-200 hover:gap-3" style={{ color: "#0f766e" }}>
                  Read Full Case Study <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// PRICING
// ─────────────────────────────────────────────


function Pricing() {
  const [billing, setBilling] = useState<"monthly" | "hourly">("monthly");

  return (
    <section id="pricing" className="py-28 relative overflow-hidden" style={{ background: "linear-gradient(180deg, #f0fdfa 0%, #f8fafc 100%)" }}>
      <SparkleField count={5} />
      <div className="max-w-7xl mx-auto px-6 lg:px-10 relative">
        <SectionTitle
          eyebrow="Investment"
          title="Transparent Pricing, Zero Surprises"
          sub="Select a HIPAA-compliant support plan that aligns with your practice volume. Scalable options designed for single providers and group clinics."
        />

        {/* Toggle */}
        <div className="flex items-center justify-center gap-4 mb-14">
          <span className={`text-sm font-medium transition-colors ${billing === "monthly" ? "text-foreground" : "text-muted-foreground"}`}>Monthly</span>
          <button
            onClick={() => setBilling(b => b === "monthly" ? "hourly" : "monthly")}
            aria-label="Toggle billing period"
            className="relative w-12 h-6 rounded-full transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300"
            style={{ background: billing === "monthly" ? "#0f766e" : "#93c5fd" }}
          >
            <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all duration-300 ${billing === "monthly" ? "left-0.5" : "left-6"}`} />
          </button>
          <span className={`text-sm font-medium transition-colors ${billing === "hourly" ? "text-foreground" : "text-muted-foreground"}`}>Hourly</span>
        </div>

        <div className="grid md:grid-cols-3 gap-7 items-stretch">
          {PRICING.map((plan, i) => (
            <motion.div
              key={plan.name}
              className="relative flex flex-col rounded-3xl"
              style={plan.popular ? {
                background: "linear-gradient(160deg, #f0fdfa 0%, #e0f2fe 100%)",
                border: "2px solid rgba(13,148,136,0.3)",
                boxShadow: "0 24px 64px rgba(13,148,136,0.18)",
              } : {
                background: "rgba(255,255,255,0.76)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.85)",
                boxShadow: "0 6px 32px rgba(13,148,136,0.07)",
              }}
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.58, delay: i * 0.13 }}
              whileHover={{ scale: 1.025, transition: { duration: 0.22 } }}
            >
              {plan.popular && (
                <div className="absolute -top-4 inset-x-0 flex justify-center">
                  <div className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-white text-xs font-bold" style={{ background: ROSE_GRAD, boxShadow: "0 4px 16px rgba(13,148,136,0.35)" }}>
                    <Sparkles size={11} /> Most Popular
                  </div>
                </div>
              )}

              <div className="p-8 pb-6">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-teal-600 mb-2">{plan.name}</p>
                <div className="flex items-baseline gap-1.5 mb-1">
                  <span className="text-5xl font-bold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {billing === "monthly" ? plan.monthly : plan.hourly}
                  </span>
                  <span className="text-sm text-muted-foreground">{billing === "monthly" ? "/ month" : "/ hour"}</span>
                </div>
                <p className="text-xs font-medium text-teal-600 mb-3">{plan.hrs}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{plan.desc}</p>
              </div>

              <div className="mx-8 border-t" style={{ borderColor: "rgba(13,148,136,0.25)" }} />

              <div className="flex-1 p-8 py-6">
                <ul className="space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm text-foreground/80">
                      <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: ROSE_GRAD_SOFT }}>
                        <Check size={10} className="text-teal-600" />
                      </div>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-8 pt-4">
                <button
                  className={`w-full py-4 rounded-2xl text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 ${plan.popular ? "text-white hover:shadow-xl hover:shadow-teal-300/40" : "border-2 hover:bg-teal-50"}`}
                  style={plan.popular ? { background: ROSE_GRAD } : { borderColor: "#0d9488", color: "#0f766e" }}
                >
                  {plan.cta}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.p
          className="text-center text-sm text-muted-foreground mt-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.45 }}
        >
          Not sure which fits? {" "}
          <button className="font-semibold underline underline-offset-2 hover:opacity-80 transition-opacity" style={{ color: "#0f766e" }} onClick={() => scrollTo("#contact")}>
            Schedule a free 30-min consultation
          </button>{" "}
          and we will figure it out together.
        </motion.p>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// TESTIMONIALS
// ─────────────────────────────────────────────


function Testimonials() {
  const [idx, setIdx] = useState(0);
  const n = TESTIMONIALS.length;

  useEffect(() => {
    const timer = setInterval(() => setIdx(i => (i + 1) % n), 6000);
    return () => clearInterval(timer);
  }, [n]);

  return (
    <section id="testimonials" className="py-28 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <SectionTitle
          eyebrow="Client Love"
          title="What Providers Say"
          sub="Real feedback from providers and practice managers who have experienced the clinical and operational difference."
        />

        {/* Main card */}
        <div className="max-w-3xl mx-auto mb-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.97, filter: "blur(6px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.97, filter: "blur(6px)" }}
              transition={{ duration: 0.42 }}
              className="relative rounded-3xl p-10 md:p-14 overflow-hidden"
              style={{ background: "linear-gradient(145deg, #f0fdfa, #e0f2fe)", border: "1px solid rgba(13,148,136,0.3)", boxShadow: "0 12px 48px rgba(13,148,136,0.1)" }}
            >
              {/* Large quote */}
              <Quote className="absolute top-6 right-8 text-teal-100/50" size={72} fill="currentColor" />

              <div className="flex gap-1 mb-7">
                {[...Array(TESTIMONIALS[idx].rating)].map((_, i) => (
                  <Star key={i} size={18} fill="#f59e0b" className="text-amber-400" />
                ))}
              </div>

              <p className="text-xl md:text-2xl text-foreground leading-relaxed mb-10 relative" style={{ fontFamily: "'Playfair Display', serif" }}>
                &ldquo;{TESTIMONIALS[idx].text}&rdquo;
              </p>

              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0 border-2" style={{ borderColor: "rgba(13,148,136,0.2)", background: "#f0fdfa" }}>
                  <img src={TESTIMONIALS[idx].img} alt={TESTIMONIALS[idx].name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{TESTIMONIALS[idx].name}</p>
                  <p className="text-sm text-muted-foreground">{TESTIMONIALS[idx].role}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Thumbnails row */}
        <div className="flex items-center justify-center gap-4">
          <button onClick={() => setIdx((idx - 1 + n) % n)} className="w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all hover:bg-teal-50" style={{ borderColor: "#0d9488", color: "#0f766e" }} aria-label="Previous">
            <ChevronLeft size={18} />
          </button>

          {TESTIMONIALS.map((t, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className={`transition-all duration-300 rounded-full overflow-hidden border-2 ${i === idx ? "scale-110" : "opacity-50 hover:opacity-75"}`}
              style={{ borderColor: i === idx ? "#0f766e" : "transparent" }}
              aria-label={`Go to testimonial by ${t.name}`}
            >
              <img src={t.img} alt={t.name} className="w-10 h-10 object-cover" />
            </button>
          ))}

          <button onClick={() => setIdx((idx + 1) % n)} className="w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all hover:bg-teal-50" style={{ borderColor: "#0d9488", color: "#0f766e" }} aria-label="Next">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// WHY WORK WITH ME
// ─────────────────────────────────────────────



function WhyMe() {
  return (
    <section className="py-28 relative overflow-hidden" style={{ background: "linear-gradient(180deg, #f0fdfa 0%, #f8fafc 100%)" }}>
      <SparkleField count={4} />
      <div className="max-w-7xl mx-auto px-6 lg:px-10 relative">
        <SectionTitle
          eyebrow="Why Choose Me"
          title="Dedicated to Clinical Excellence"
          sub="Healthcare providers trust me with their daily workflows because I combine clinic operations knowledge with rigorous security standards."
        />

        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              className="rounded-2xl p-7 text-center"
              style={{ background: "rgba(255,255,255,0.76)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.85)", boxShadow: "0 4px 28px rgba(13,148,136,0.07)" }}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.52, delay: i * 0.1 }}
            >
              <p className="text-4xl md:text-5xl font-bold text-foreground mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                <CountUp target={s.val} suffix={s.suf} />
              </p>
              <p className="text-sm text-muted-foreground font-medium">{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Benefits */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {BENEFITS.map((b, i) => {
            const Icon = b.icon;
            return (
              <GlassCard key={b.title} className="p-7 group cursor-default" delay={i * 0.1}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110" style={{ background: ROSE_GRAD_SOFT }}>
                  <Icon size={22} className="text-teal-600" />
                </div>
                <h3 className="font-semibold text-foreground mb-3 text-[15px]" style={{ fontFamily: "'Playfair Display', serif" }}>{b.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{b.desc}</p>
              </GlassCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// CONTACT
// ─────────────────────────────────────────────

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", service: "", message: "" });
  const [sent, setSent] = useState(false);

  const onSubmit = (e: FormEvent) => { e.preventDefault(); setSent(true); };

  const inputCls = "w-full px-4 py-3.5 rounded-xl bg-white/80 border text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 transition-all duration-200";
  const inputStyle = { borderColor: "rgba(224,168,186,0.6)", "--tw-ring-color": "rgba(184,92,110,0.2)" } as React.CSSProperties;

  return (
    <section id="contact" className="py-28 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">

        {/* Banner CTA */}
        <motion.div
          className="relative rounded-3xl p-12 md:p-16 mb-20 text-center overflow-hidden"
          style={{ background: ROSE_GRAD, boxShadow: "0 20px 56px rgba(184,92,110,0.22)" }}
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.65 }}
        >
          <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/10 pointer-events-none" />
          <div className="absolute -bottom-16 -left-8 w-56 h-56 rounded-full bg-white/08 pointer-events-none" />
          <SparkleField count={5} />
          <p className="text-white/75 text-sm font-semibold uppercase tracking-[0.2em] mb-3">Ready to delegate?</p>
          <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Book Your Free Discovery Call
          </h2>
          <p className="text-white/80 max-w-lg mx-auto mb-8 text-lg">
            30 minutes, zero obligation. Just a genuine conversation about your business and how I can help it grow.
          </p>
          <button onClick={() => scrollTo("#contact-form")} className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-sm font-semibold transition-all duration-300 hover:-translate-y-1 hover:shadow-xl" style={{ color: "#b85c6e" }}>
            Let&apos;s Connect <ArrowRight size={15} />
          </button>
        </motion.div>

        {/* Form + Info */}
        <div id="contact-form" className="grid lg:grid-cols-2 gap-16 items-start">

          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.65 }}
          >
            <EyebrowLabel text="Get in Touch" />
            <h2 className="text-4xl md:text-5xl font-semibold text-foreground mb-5 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
              Let&apos;s Build Something <em style={{ color: "#b85c6e" }}>Amazing Together</em>
            </h2>
            <p className="text-muted-foreground leading-relaxed text-lg mb-10">
              Ready to reclaim your time and scale your business? I would love to learn about your goals and show you exactly how I can help.
            </p>

            {[
              { icon: Mail,    label: "Email",         val: "hello@angelicaaljas.com" },
              { icon: Clock,   label: "Response Time", val: "Within 24 hrs, Mon – Fri" },
              { icon: MapPin,  label: "Location",      val: "Philippines — Available Worldwide" },
            ].map(({ icon: Icon, label, val }) => (
              <div key={label} className="flex items-center gap-4 mb-5">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: ROSE_GRAD_SOFT }}>
                  <Icon size={18} className="text-rose-400" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground mb-0.5">{label}</p>
                  <p className="text-sm font-medium text-foreground">{val}</p>
                </div>
              </div>
            ))}

            <div className="flex gap-3 mt-8">
              {[Instagram, Linkedin, Twitter].map((Icon, i) => (
                <a key={i} href="#" className="w-11 h-11 rounded-full flex items-center justify-center border-2 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md" style={{ borderColor: "#e0a8ba", color: "#b85c6e" }}>
                  <Icon size={17} />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Right — Form */}
          <motion.div
            className="rounded-3xl p-8 md:p-10"
            style={{ background: "linear-gradient(145deg, #fef7f9, #fce4ee)", border: "1px solid rgba(232,180,192,0.4)", boxShadow: "0 12px 48px rgba(184,92,110,0.1)" }}
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.65 }}
          >
            {sent ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center text-center py-10"
              >
                <div className="w-16 h-16 rounded-full flex items-center justify-center mb-5" style={{ background: ROSE_GRAD }}>
                  <Heart size={26} fill="white" className="text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-foreground mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>Message Received!</h3>
                <p className="text-muted-foreground leading-relaxed">Thank you, {form.name || "friend"}! I will be in touch within 24 hours. I am so excited to learn about your business.</p>
              </motion.div>
            ) : (
              <form onSubmit={onSubmit} className="flex flex-col gap-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground mb-2">Full Name</label>
                    <input required type="text" placeholder="Jane Smith" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className={inputCls} style={inputStyle} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground mb-2">Email Address</label>
                    <input required type="email" placeholder="jane@company.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className={inputCls} style={inputStyle} />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground mb-2">Service Needed</label>
                  <select value={form.service} onChange={e => setForm({ ...form, service: e.target.value })} className={`${inputCls} cursor-pointer appearance-none`} style={inputStyle}>
                    <option value="">Select a service...</option>
                    {SERVICES.map(s => <option key={s.title} value={s.title}>{s.title}</option>)}
                    <option value="multiple">Multiple Services</option>
                    <option value="unsure">Not Sure Yet</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground mb-2">Tell Me About Your Business</label>
                  <textarea required rows={5} placeholder="Share a bit about your business, the challenges you are facing, and what you need help with..." value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} className={`${inputCls} resize-none`} style={inputStyle} />
                </div>
                <button type="submit" className="group flex items-center justify-center gap-2.5 w-full py-4 rounded-2xl text-white text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-rose-300/40" style={{ background: ROSE_GRAD }}>
                  Send Message <Send size={15} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// FOOTER
// ─────────────────────────────────────────────

function Footer() {
  return (
    <footer className="border-t py-12" style={{ background: "linear-gradient(180deg, #fef8fa, #fdf4f8)", borderColor: "rgba(232,180,192,0.25)" }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid md:grid-cols-3 gap-10 mb-10">
          <div>
            <p className="text-xl font-semibold text-foreground mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>Angelica Aljas</p>
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-4">Virtual Assistant</p>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">Helping businesses stay organized, efficient, and stress-free — one task at a time.</p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground mb-4">Quick Links</p>
            <ul className="flex flex-col gap-2.5">
              {NAV_LINKS.map(l => (
                <li key={l.href}>
                  <button onClick={() => scrollTo(l.href)} className="text-sm text-muted-foreground hover:text-primary transition-colors">{l.label}</button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground mb-4">Connect</p>
            <div className="flex gap-3 mb-4">
              {[Instagram, Linkedin, Twitter].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-200 hover:-translate-y-0.5" style={{ borderColor: "#e0a8ba", color: "#b85c6e" }}>
                  <Icon size={15} />
                </a>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">hello@angelicaaljas.com</p>
          </div>
        </div>
        <div className="border-t pt-8 flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderColor: "rgba(232,180,192,0.2)" }}>
          <p className="text-xs text-muted-foreground">© 2025 Angelica Aljas. All rights reserved.</p>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span>Made with</span>
            <Heart size={12} fill="#b85c6e" className="text-rose-400" />
            <span>for business owners everywhere</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─────────────────────────────────────────────
// APP
// ─────────────────────────────────────────────

export default function App() {
  return (
    <div className="overflow-x-hidden">
      <Nav />
      <main>
        <Hero />
        <About />
        <Services />
        <Projects />
        <Pricing />
        <Testimonials />
        <WhyMe />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
