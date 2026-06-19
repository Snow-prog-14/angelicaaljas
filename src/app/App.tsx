import image_ikang from '@/imports/ikang.jpg';
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
  ::-webkit-scrollbar-track { background: #fff5f7; }
  ::-webkit-scrollbar-thumb { background: #fbcfe8; border-radius: 9px; }
  ::-webkit-scrollbar-thumb:hover { background: #ec4899; }
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
// HELPERS & THEME VARIABLES
// ─────────────────────────────────────────────
const scrollTo = (href: string) => {
  document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
};

const PINK_GRAD = "linear-gradient(135deg, #ec4899 0%, #be185d 100%)";

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
      <div className="h-1.5 rounded-full bg-pink-50 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: PINK_GRAD }}
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
    <div className="flex items-center gap-2 mb-4">
      <Sparkles size={12} className="text-pink-400" />
      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-pink-600">{text}</span>
      <Sparkles size={12} className="text-pink-400" />
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
      <div className="flex justify-center">
        <EyebrowLabel text={eyebrow} />
      </div>
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
        boxShadow: "0 4px 28px rgba(236,72,153,0.04)",
        ...style,
      }}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, delay }}
      whileHover={{ y: -6, boxShadow: "0 16px 40px rgba(236,72,153,0.12)", transition: { duration: 0.25 } }}
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
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className="text-pink-300">
        <path d="M12 2 L13.5 9 L20 12 L13.5 15 L12 22 L10.5 15 L4 12 L10.5 9 Z" />
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────
// NAVIGATION
// ─────────────────────────────────────────────
function Nav({ onOpenContact }: { onOpenContact: () => void }) {
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
          borderBottom: "1px solid rgba(236,72,153,0.2)",
          boxShadow: "0 2px 24px rgba(236,72,153,0.06)",
        } : {}}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10 flex items-center justify-between h-[72px]">
          <button onClick={() => goto("#hero")} className="text-left group">
            <p className="text-xl font-semibold tracking-tight text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>Angelica Aljas</p>
            <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground group-hover:text-pink-600 transition-colors">Medical Virtual Assistant</p>
          </button>

          <div className="hidden md:flex items-center gap-7">
            {NAV_LINKS.map((l) => (
              <button key={l.href} onClick={() => goto(l.href)} className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium relative group">
                {l.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-pink-400 group-hover:w-full transition-all duration-300" />
              </button>
            ))}
          </div>

          <button
            onClick={onOpenContact}
            className="hidden md:flex items-center gap-2 px-5 py-2.5 rounded-full text-white text-sm font-medium transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-pink-200/40"
            style={{ background: PINK_GRAD }}
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
            style={{ background: "rgba(255,255,255,0.97)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(236,72,153,0.2)" }}
          >
            {NAV_LINKS.map((l, i) => (
              <motion.button
                key={l.href}
                onClick={() => goto(l.href)}
                className="text-left text-lg font-medium text-foreground hover:text-primary transition-colors py-1 border-b border-pink-50"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                {l.label}
              </motion.button>
            ))}
            <button onClick={() => { setOpen(false); onOpenContact(); }} className="mt-2 px-6 py-3.5 rounded-full text-white text-sm font-medium text-center" style={{ background: PINK_GRAD }}>
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
  const textY  = useTransform(scrollYProgress, [0, 1], [0, 40]);

  return (
    <section id="hero" ref={ref} className="relative min-h-screen flex items-center overflow-hidden pt-[72px]"
      style={{ background: "linear-gradient(140deg, #fff5f7 0%, #f8fafc 45%, #fff1f2 100%)" }}
    >
      <motion.div className="absolute -top-24 -right-24 w-[480px] h-[480px] rounded-full pointer-events-none" style={{ y: blob1Y, background: "radial-gradient(circle, rgba(236,72,153,0.15), transparent 70%)" }} />
      <motion.div className="absolute bottom-0 -left-20 w-[380px] h-[380px] rounded-full pointer-events-none" style={{ y: blob2Y, background: "radial-gradient(circle, rgba(244,63,94,0.12), transparent 70%)" }} />

      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
        {[
          { top: "8%",  left: "5%",  size: 10, dur: 5.5, delay: 0 },
          { top: "15%", left: "92%", size: 7,  dur: 7,   delay: 1.2 },
          { top: "35%", left: "2%",  size: 8,  dur: 6.5, delay: 2.1 },
          { top: "52%", left: "95%", size: 12, dur: 8,   delay: 0.7 },
          { top: "70%", left: "4%",  size: 8,  dur: 6,   delay: 1.8 },
          { top: "85%", left: "88%", size: 10, dur: 7.5, delay: 3.0 },
        ].map((p, i) => <Sparkle key={i} {...p} />)}
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 w-full py-20">
        <motion.div
          style={{ y: textY }}
          className="grid lg:grid-cols-[1fr_auto] gap-16 items-center"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {/* Copy */}
          <div className="max-w-2xl">
            <div
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full mb-8 border"
              style={{ background: "rgba(255,255,255,0.8)", borderColor: "rgba(236,72,153,0.3)", boxShadow: "0 2px 12px rgba(236,72,153,0.05)" }}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500" />
              </span>
              <span className="text-xs font-semibold text-pink-600 tracking-wide">Available for Practice Support</span>
            </div>

            <div className="overflow-hidden mb-2">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-pink-600 mb-5">
                Medical Virtual Assistant &amp; Clinical Support
              </p>
            </div>

            <h1
              className="font-semibold text-foreground leading-[1.1] mb-6"
              style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.5rem, 5vw, 4.2rem)" }}
            >
              Streamlining Medical Operations,{" "}
              <span style={{ background: "linear-gradient(135deg, #be185d, #ec4899, #f43f5e)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Patient Care,
              </span>
              <br />
              and Practice <em>Administration.</em>
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed mb-10 max-w-lg">
              Hi, I am Angelica — a dedicated Medical Virtual Assistant with 5+ years of experience helping healthcare providers, doctors, and clinic administrators optimize operations, minimize documentation fatigue, and ensure HIPAA-compliant management of patient care.
            </p>

            <div className="flex flex-wrap gap-4 mb-12">
              <button
                onClick={() => scrollTo("#contact")}
                className="group flex items-center gap-2.5 px-8 py-4 rounded-full text-white font-medium text-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-pink-300/30"
                style={{ background: PINK_GRAD }}
              >
                Schedule a Consultation
                <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform duration-200" />
              </button>
              <button
                onClick={() => scrollTo("#services")}
                className="flex items-center gap-2 px-8 py-4 rounded-full text-sm font-medium border-2 transition-all duration-300 hover:bg-pink-50"
                style={{ borderColor: "#ec4899", color: "#be185d" }}
              >
                View Medical Services
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="flex">{[...Array(5)].map((_, i) => <Star key={i} size={14} fill="#f59e0b" className="text-amber-400" />)}</div>
                <span className="text-muted-foreground font-medium">5.0 Rated</span>
              </div>
              <span className="h-4 w-px bg-border" />
              <span className="text-muted-foreground flex items-center gap-1.5"><Shield size={14} className="text-pink-600" /> HIPAA Compliant Protocols</span>
              <span className="h-4 w-px bg-border" />
              <span className="text-muted-foreground"><strong className="text-foreground">15k+</strong> support hours</span>
            </div>
          </div>

          {/* Portrait */}
          <div className="hidden lg:flex items-center justify-center relative">
            <div className="absolute w-[420px] h-[420px] rounded-full border border-dashed" style={{ borderColor: "rgba(236,72,153,0.2)", animation: "orbit-spin 35s linear infinite" }} />
            <div className="absolute w-[350px] h-[350px] rounded-full border" style={{ borderColor: "rgba(244,63,94,0.15)", animation: "orbit-counter 25s linear infinite" }} />

            <div className="relative z-10" style={{ padding: "3px", borderRadius: "28px", background: "linear-gradient(135deg, #be185d, #ec4899, #f43f5e)" }}>
              <div className="w-[280px] h-[360px] rounded-[26px] overflow-hidden" style={{ background: "#fff5f7" }}>
                <img
                  src={image_ikang}
                  alt="Angelica Aljas — Medical Virtual Assistant"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <motion.div
              className="absolute z-20 -left-16 top-16 rounded-2xl border px-[16px] py-[12px]"
              style={{ background: "rgba(255,255,255,0.92)", backdropFilter: "blur(12px)", borderColor: "rgba(236,72,153,0.3)", boxShadow: "0 4px 20px rgba(236,72,153,0.1)" }}
              animate={{ y: [-8, 8, -8] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Experience</p>
              <p className="text-2xl font-semibold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>5+ Yrs</p>
            </motion.div>

            <motion.div
              className="absolute z-20 -right-12 bottom-20 rounded-2xl px-4 py-3 border flex items-center gap-2"
              style={{ background: "rgba(255,255,255,0.92)", backdropFilter: "blur(12px)", borderColor: "rgba(236,72,153,0.3)", boxShadow: "0 4px 20px rgba(236,72,153,0.1)" }}
              animate={{ y: [8, -8, 8] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            >
              <Shield size={18} className="text-pink-600" />
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Compliance</p>
                <p className="text-xs font-semibold text-foreground">HIPAA Compliant</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Scroll to explore</p>
        <div className="w-5 h-8 rounded-full border-2 flex items-start justify-center p-1" style={{ borderColor: "rgba(236,72,153,0.3)" }}>
          <motion.div className="w-1 h-2 rounded-full" style={{ background: "#ec4899" }} animate={{ y: [0, 12, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }} />
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// ABOUT & SKILLS
// ─────────────────────────────────────────────
function About() {
  return (
    <section id="about" className="py-28 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -48 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.72 }}
          >
            <div className="absolute inset-0 translate-x-4 translate-y-4 rounded-3xl border-2 border-dashed pointer-events-none" style={{ borderColor: "rgba(236,72,153,0.2)" }} />
            <div className="relative rounded-3xl overflow-hidden aspect-[4/5]" style={{ background: "#fff5f7", boxShadow: "0 24px 60px rgba(236,72,153,0.14)" }}>
              <img src={image_ikang} alt="Angelica Aljas Profile" className="w-full h-full object-cover" />
            </div>
          </motion.div>

          <div>
            <EyebrowLabel text="About My Practice" />
            <h2 className="text-3xl md:text-4xl font-semibold mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
              Bridging the Gap Between Administration and Patient Care
            </h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Medical documentation and operational blockages shouldn't compromise patient face-time. Over the last 5 years, I have embedded myself into clinical environments to construct systematic pathways that absorb everyday backlogs seamlessly.
            </p>

            <div className="mb-8">
              <h3 className="text-sm font-semibold text-pink-600 uppercase tracking-wider mb-4">Core Clinical Strengths</h3>
              {SKILLS.map((sk, idx) => (
                <SkillBar key={idx} name={sk.name} pct={sk.pct} />
              ))}
            </div>

            <div className="border-t border-slate-100 pt-6">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Keep Track Systems</h4>
              <div className="flex flex-wrap gap-2">
                {TOOLS.map((t, i) => (
                  <span key={i} className="text-xs font-medium px-3 py-1 rounded-md bg-slate-50 border border-slate-100 text-slate-600">{t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-24 border-t border-slate-100 pt-16">
          {STATS.map((st, idx) => (
            <div key={idx} className="text-center">
              <p className="text-4xl md:text-5xl font-bold text-pink-600 mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
                <CountUp target={st.val} suffix={st.suf} />
              </p>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{st.label}</p>
            </div>
          ))}
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
    <section id="services" className="py-28" style={{ background: "linear-gradient(180deg, #f8fafc 0%, #fff5f7 100%)" }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <SectionTitle 
          eyebrow="Capabilities" 
          title="Clinical Support Offerings" 
          sub="Tailored workflows crafted to save hours, eliminate charting fatigue, and support your regulatory protocols." 
        />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SERVICES.map((s, idx) => {
            const Icon = s.icon;
            return (
              <GlassCard key={idx} className="p-8 group" delay={idx * 0.05}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-colors duration-300 bg-pink-50 group-hover:bg-pink-600 text-pink-600 group-hover:text-white">
                  <Icon size={22} />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-slate-800">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </GlassCard>
            );
          })}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-20">
          {BENEFITS.map((b, i) => {
            const Icon = b.icon;
            return (
              <div key={i} className="p-6 rounded-2xl bg-white/60 border border-slate-100">
                <Icon size={20} className="text-pink-600 mb-3" />
                <h4 className="font-semibold text-sm mb-1.5">{b.title}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{b.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// CASE STUDIES / PROJECTS
// ─────────────────────────────────────────────
function Projects() {
  const [active, setActive] = useState(0);

  return (
    <section id="projects" className="py-28 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <SectionTitle 
          eyebrow="Case Studies" 
          title="Proven Clinic Transformations" 
          sub="Real metrics detailing clinical operational optimizations and measurable overhead containment timelines." 
        />

        <div className="grid lg:grid-cols-[1fr_1.3fr] gap-12 items-center">
          <div className="flex flex-col gap-4">
            {PROJECTS.map((p, idx) => (
              <button
                key={idx}
                onClick={() => setActive(idx)}
                className="text-left p-6 rounded-2xl border transition-all duration-300"
                style={active === idx ? {
                  borderColor: "rgba(236,72,153,0.3)",
                  background: "rgba(255,245,247,0.7)",
                  boxShadow: "0 4px 20px rgba(236,72,153,0.05)"
                } : {
                  borderColor: "rgba(0,0,0,0.05)",
                  background: "transparent"
                }}
              >
                <span className="text-xs font-semibold text-pink-600 tracking-wider uppercase">{p.type}</span>
                <h3 className="text-xl font-bold mt-1 text-slate-800">{p.client}</h3>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {p.services.slice(0, 2).map((s, i) => (
                    <span key={i} className="text-[10px] bg-white border px-2 py-0.5 rounded-full text-slate-500">{s}</span>
                  ))}
                </div>
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="rounded-3xl border border-slate-100 overflow-hidden shadow-xl bg-white shadow-slate-100"
            >
              <div className="h-56 relative overflow-hidden bg-slate-100">
                <img src={PROJECTS[active].image} alt={PROJECTS[active].client} className="w-full h-full object-cover" />
                <div className="absolute top-4 left-4 bg-pink-600 text-white text-xs px-3 py-1 rounded-full font-medium">
                  {PROJECTS[active].type}
                </div>
              </div>

              <div className="p-8">
                <h4 className="text-xl font-semibold text-pink-700 mb-2">"{PROJECTS[active].headline}"</h4>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">{PROJECTS[active].outcome}</p>

                <div className="grid grid-cols-2 gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-100">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">Before Optimization</span>
                    {PROJECTS[active].before.map((b, i) => (
                      <div key={i} className="text-xs mb-1 text-slate-600">
                        <strong>{b.value}</strong> — {b.label}
                      </div>
                    ))}
                  </div>
                  <div className="border-l border-slate-200 pl-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-pink-600 block mb-2">With Angelica Support</span>
                    {PROJECTS[active].after.map((a, i) => (
                      <div key={i} className="text-xs mb-1 text-pink-700 font-medium flex items-center gap-1.5">
                        <Check size={12} className="text-emerald-500 shrink-0" />
                        <span><strong>{a.value}</strong> — {a.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// PRICING
// ─────────────────────────────────────────────
function Pricing() {
  return (
    <section id="pricing" className="py-28" style={{ background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)" }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <SectionTitle 
          eyebrow="Retainers" 
          title="Transparent Practice Plans" 
          sub="Predictable monthly pricing scales to sync with single clinics or growing multi-provider medical facilities." 
        />

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {PRICING.map((p, idx) => (
            <div
              key={idx}
              className={`rounded-3xl p-8 bg-white border relative transition-all duration-300 ${
                p.popular ? "border-pink-500 lg:scale-[1.03] shadow-xl shadow-pink-500/5" : "border-slate-100"
              }`}
            >
              {p.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-pink-600 text-white text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full">
                  Most Requested Partner tier
                </span>
              )}
              <h3 className="text-xl font-bold text-slate-800 mb-1">{p.name}</h3>
              <p className="text-xs text-muted-foreground mb-6">{p.desc}</p>

              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-4xl font-bold text-slate-900">{p.monthly}</span>
                <span className="text-sm text-muted-foreground">/ month</span>
              </div>
              <div className="text-xs text-pink-600 font-medium mb-6 bg-pink-50/50 inline-block px-2.5 py-1 rounded-md">
                {p.hrs} • approximated at {p.hourly}/hr
              </div>

              <button
                onClick={() => scrollTo("#contact")}
                className="w-full py-3 rounded-xl font-medium text-sm transition-all duration-300 mb-8"
                style={p.popular ? { background: PINK_GRAD, color: "white" } : { border: "1px solid #e2e8f0", backgroundColor: "#f8fafc", color: "#334155" }}
              >
                {p.cta}
              </button>

              <div className="space-y-3.5">
                {p.features.map((f, i) => (
                  <div key={i} className="flex items-start gap-3 text-xs text-slate-600">
                    <Check size={14} className="text-pink-500 shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// TESTIMONIALS
// ─────────────────────────────────────────────
function Testimonials() {
  const [curr, setCurr] = useState(0);

  const next = () => setCurr((prev) => (prev + 1) % TESTIMONIALS.length);
  const prev = () => setCurr((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);

  return (
    <section id="testimonials" className="py-28 bg-white overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 lg:px-10">
        <SectionTitle eyebrow="Endorsements" title="Trusted by Providers" />

        <div className="relative border border-slate-100 p-8 md:p-12 rounded-3xl bg-slate-50/50">
          <Quote size={54} className="text-pink-100 absolute top-6 left-6 pointer-events-none" />

          <AnimatePresence mode="wait">
            <motion.div
              key={curr}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35 }}
              className="relative z-10 text-center md:text-left"
            >
              <p className="text-lg md:text-xl text-slate-700 italic leading-relaxed font-light mb-8">
                "{TESTIMONIALS[curr].text}"
              </p>

              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4 text-left">
                  <img src={TESTIMONIALS[curr].img} alt={TESTIMONIALS[curr].name} className="w-12 h-12 rounded-full object-cover border" />
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">{TESTIMONIALS[curr].name}</h4>
                    <p className="text-xs text-muted-foreground">{TESTIMONIALS[curr].role}</p>
                  </div>
                </div>

                <div className="flex gap-1">
                  {[...Array(TESTIMONIALS[curr].rating)].map((_, i) => (
                    <Star key={i} size={14} fill="#f59e0b" className="text-amber-400" />
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-center md:justify-end gap-2 mt-8 md:mt-4">
            <button onClick={prev} className="p-2 rounded-full border bg-white hover:bg-slate-50 transition-colors" aria-label="Previous testimonial">
              <ChevronLeft size={16} />
            </button>
            <button onClick={next} className="p-2 rounded-full border bg-white hover:bg-slate-50 transition-colors" aria-label="Next testimonial">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// CONTACT FORM (Restored Layout from image_3a28cb.png)
// ─────────────────────────────────────────────
function Contact() {
  const [form, setForm] = useState({ name: "", email: "", service: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSent(true);
    setForm({ name: "", email: "", service: "", message: "" });
  };

  return (
    <section id="contact" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-16 items-start">
          
          {/* Left Column: Content Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="h-px w-4 bg-pink-200 block" />
              <Sparkles size={12} className="text-pink-400" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-pink-600">GET IN TOUCH</span>
              <Sparkles size={12} className="text-pink-400" />
              <span className="h-px w-4 bg-pink-200 block" />
            </div>

            <h2 className="text-5xl lg:text-6xl font-normal text-slate-900 leading-[1.15] mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
              Let's Build Something <br />
              <span className="italic text-pink-600 font-serif">Amazing Together</span>
            </h2>

            <p className="text-base text-slate-500 leading-relaxed mb-12 max-w-lg">
              Ready to reclaim your time and scale your business? I would love to learn about your goals and show you exactly how I can help.
            </p>

            {/* Info Cards Row/Stack */}
            <div className="space-y-6 mb-10">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-full bg-pink-50 flex items-center justify-center text-pink-500 shrink-0">
                  <Mail size={16} />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">EMAIL</p>
                  <p className="text-sm font-medium text-slate-800">hello@angelicaaljas.com</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-full bg-pink-50 flex items-center justify-center text-pink-500 shrink-0">
                  <Clock size={16} />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">RESPONSE TIME</p>
                  <p className="text-sm font-medium text-slate-800">Within 24 hrs, Mon – Fri</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-full bg-pink-50 flex items-center justify-center text-pink-500 shrink-0">
                  <MapPin size={16} />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">LOCATION</p>
                  <p className="text-sm font-medium text-slate-800">Philippines — Available Worldwide</p>
                </div>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 rounded-full border border-pink-200 flex items-center justify-center text-pink-600 hover:bg-pink-50 transition-colors" aria-label="Instagram">
                <Instagram size={14} />
              </a>
              <a href="#" className="w-9 h-9 rounded-full border border-pink-200 flex items-center justify-center text-pink-600 hover:bg-pink-50 transition-colors" aria-label="LinkedIn">
                <Linkedin size={14} />
              </a>
              <a href="#" className="w-9 h-9 rounded-full border border-pink-200 flex items-center justify-center text-pink-600 hover:bg-pink-50 transition-colors" aria-label="Twitter">
                <Twitter size={14} />
              </a>
            </div>
          </div>

          {/* Right Column: Form Box Card */}
          <div className="p-8 md:p-10 rounded-3xl" style={{ backgroundColor: "#FFF0F3" }}>
            {sent ? (
              <div className="text-center py-16">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                  <Check size={24} />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-1">Message Dispatched Securely</h3>
                <p className="text-xs text-muted-foreground">Thank you! I will touch base under 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-pink-700/80 mb-2">FULL NAME</label>
                    <input
                      type="text" required value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-pink-100 bg-white focus:outline-none focus:border-pink-400 text-sm placeholder-slate-300"
                      placeholder="Jane Smith"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-pink-700/80 mb-2">EMAIL ADDRESS</label>
                    <input
                      type="email" required value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-pink-100 bg-white focus:outline-none focus:border-pink-400 text-sm placeholder-slate-300"
                      placeholder="jane@company.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-pink-700/80 mb-2">SERVICE NEEDED</label>
                  <select
                    required value={form.service}
                    onChange={(e) => setForm({ ...form, service: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-pink-100 bg-white focus:outline-none focus:border-pink-400 text-sm text-slate-700 appearance-none bg-no-repeat bg-right"
                    style={{ backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23be185d' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'></polyline></svg>")`, paddingRight: "2.5rem", backgroundPosition: "calc(100% - 12px) center", backgroundSize: "16px" }}
                  >
                    <option value="" disabled>Select a service...</option>
                    <option value="prior-auth">Prior Authorization Support</option>
                    <option value="calendar">Calendar &amp; Schedule Management</option>
                    <option value="ehr">Chart Prep &amp; EHR Support</option>
                    <option value="triage">Email &amp; Digital Fax Triage</option>
                    <option value="full">Comprehensive Support Retainer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-pink-700/80 mb-2">TELL ME ABOUT YOUR BUSINESS</label>
                  <textarea
                    rows={4} required value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-pink-100 bg-white focus:outline-none focus:border-pink-400 text-sm resize-none placeholder-slate-300 leading-relaxed"
                    placeholder="Share a bit about your business, the challenges you are facing, and what you need help with..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl text-white font-medium text-sm transition-all duration-300 flex items-center justify-center gap-2 hover:opacity-95 hover:shadow-lg hover:shadow-pink-400/20"
                  style={{ background: PINK_GRAD }}
                >
                  Send Message <Send size={13} />
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// FOOTER (Restored Layout from image_3a28ea.png)
// ─────────────────────────────────────────────
function Footer() {
  return (
    <footer className="py-16 text-slate-500 border-t" style={{ backgroundColor: "#FFF8F9", borderColor: "rgba(236,72,153,0.08)" }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        
        {/* Main 3-Column Content */}
        <div className="grid md:grid-cols-3 gap-12 md:gap-8 items-start mb-16">
          
          {/* Column 1: Branding Info */}
          <div>
            <h3 className="text-xl font-bold text-slate-800 tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
              Angelica Aljas
            </h3>
            <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-pink-600/70 mb-4">VIRTUAL ASSISTANT</p>
            <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
              Helping businesses stay organized, efficient, and stress-free — one task at a time.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-[10px] font-bold tracking-[0.2em] uppercase text-slate-400 mb-4">QUICK LINKS</h4>
            <div className="flex flex-col gap-3 items-start text-sm">
              {NAV_LINKS.map((l) => (
                <button key={l.href} onClick={() => scrollTo(l.href)} className="hover:text-pink-600 transition-colors">
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          {/* Column 3: Connect socials */}
          <div>
            <h4 className="text-[10px] font-bold tracking-[0.2em] uppercase text-slate-400 mb-4">CONNECT</h4>
            
            <div className="flex gap-2.5 mb-5">
              <a href="#" className="w-8 h-8 rounded-full border border-pink-200 flex items-center justify-center text-pink-600 hover:bg-pink-50 transition-colors" aria-label="Instagram">
                <Instagram size={13} />
              </a>
              <a href="#" className="w-8 h-8 rounded-full border border-pink-200 flex items-center justify-center text-pink-600 hover:bg-pink-50 transition-colors" aria-label="LinkedIn">
                <Linkedin size={13} />
              </a>
              <a href="#" className="w-8 h-8 rounded-full border border-pink-200 flex items-center justify-center text-pink-600 hover:bg-pink-50 transition-colors" aria-label="Twitter">
                <Twitter size={13} />
              </a>
            </div>

            <p className="text-sm text-slate-600 font-medium">hello@angelicaaljas.com</p>
          </div>

        </div>

        {/* Bottom Strip Copyright */}
        <div className="border-t border-pink-100/50 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} Angelica Aljas. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made with <Heart size={11} fill="#ec4899" className="text-pink-500 animate-pulse" /> for business owners everywhere
          </p>
        </div>

      </div>
    </footer>
  );
}

// ─────────────────────────────────────────────
// MAIN APPLICATION ROOT WRAPPER
// ─────────────────────────────────────────────
export default function App() {
  const triggerContactScroll = () => {
    scrollTo("#contact");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased font-sans">
      <Nav onOpenContact={triggerContactScroll} />
      <main>
        <Hero />
        <About />
        <Services />
        <Projects />
        <Pricing />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}