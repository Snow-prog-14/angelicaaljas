import image_ikang from "../imports/ikang.jpg";
import React, { useState, useEffect, useRef, FormEvent } from "react";
import { motion, useInView, AnimatePresence, useScroll, useTransform } from "motion/react";
import {
  Mail, Instagram, Linkedin, Twitter,
  Star, Check, ArrowRight, Menu, X, ChevronLeft, ChevronRight,
  Clock, TrendingUp, Calendar, FileText, Zap, Shield,
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
// ANIMATION VARIANTS (Enables Scroll Up & Down)
// ─────────────────────────────────────────────
const FADE_UP_VARIANTS = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.6, 0.05, -0.01, 0.9],
    },
  },
} as const;

const STAGGER_CONTAINER = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 }
  }
};

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
  { icon: Shield, title: "Patient Communication & Phone Support", desc: "Compassionate patient callbacks, clinic inquiries, insurance verification, and pre-appointment details management." },
  { icon: FileText, title: "Patient Intake & Registration", desc: "Processing demographic forms, consent collection, and updating records in compliance with clinical workflows." },
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

const TOOLS_AND_SYSTEMS = [
  {
    category: "Communication",
    bsIconClass: "bi bi-chat-dots",
    items: ["Zoom", "WhatsApp", "Discord", "Telegram", "Gmail", "MS Teams"]
  },
  {
    category: "Documentation and Reporting",
    bsIconClass: "bi bi-file-earmark-text",
    items: ["Google Workspace", "Google Mail", "Google Calendar", "Google Drive", "Google Sheets", "Google Meet"]
  },
  {
    category: "Website",
    bsIconClass: "bi bi-laptop",
    items: ["Wix", "WordPress", "Framer", "ManyChat", "Gamma"]
  },
  {
    category: "Social Media Marketing",
    bsIconClass: "bi bi-share",
    items: ["Facebook", "Instagram", "TikTok", "Threads", "LinkedIn"]
  },
  {
    category: "Scheduling & Project Management",
    bsIconClass: "bi bi-calendar-check",
    items: ["Trello"]
  },
  {
    category: "Other Virtual Assistant Tools",
    bsIconClass: "bi bi-lightning-charge",
    items: ["MS Excel", "MS Word", "MS PowerPoint", "Canva", "CapCut", "ChatGPT", "Claude AI", "Photoshop", "Grammarly", "Dropbox"]
  }
];

// ─────────────────────────────────────────────
// HELPERS & THEME VARIABLES
// ─────────────────────────────────────────────
const scrollTo = (href: string) => {
  document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
};

const PINK_GRAD = "linear-gradient(135deg, #ec4899 0%, #be185d 100%)";

// Safe image parser helper to fix Vite development type assertion issues
const resolveImageSrc = (imgAsset: any): string => {
  if (typeof imgAsset === 'string') return imgAsset;
  return imgAsset?.src || '';
};

// ─────────────────────────────────────────────
// SMALL REUSABLE COMPONENTS
// ─────────────────────────────────────────────
function CountUp({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [n, setN] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: false, amount: 0.3 });
  
  useEffect(() => {
    if (!inView) {
      setN(0); 
      return;
    }
    const dur = 2000, t0 = Date.now();
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
  const inView = useInView(ref, { once: false, amount: 0.1 });
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
          transition={{ duration: 1.2, ease: "easeOut" }}
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

// ─────────────────────────────────────────────
// MAIN NAVIGATION
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

      <div className="max-w-7xl mx-auto px-6 lg:px-10 w-full py-20">
        <motion.div
          style={{ y: textY }}
          className="grid lg:grid-cols-[1fr_auto] gap-16 items-center"
          variants={STAGGER_CONTAINER}
          initial="hidden"
          animate="visible"
        >
          <div>
            <motion.div
              variants={FADE_UP_VARIANTS}
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full mb-8 border"
              style={{ background: "rgba(255,255,255,0.8)", borderColor: "rgba(236,72,153,0.3)", boxShadow: "0 2px 12px rgba(236,72,153,0.05)" }}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500" />
              </span>
              <span className="text-xs font-semibold text-pink-600 tracking-wide">Available for Practice Support</span>
            </motion.div>

            <motion.p variants={FADE_UP_VARIANTS} className="text-sm font-semibold uppercase tracking-[0.2em] text-pink-600 mb-5">
              Medical Virtual Assistant &amp; Clinical Support
            </motion.p>

            <motion.h1
              variants={FADE_UP_VARIANTS}
              className="font-semibold text-foreground leading-[1.1] mb-6"
              style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.5rem, 5vw, 4.2rem)" }}
            >
              Streamlining Medical Operations,{" "}
              <span style={{ background: "linear-gradient(135deg, #be185d, #ec4899, #f43f5e)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Patient Care,
              </span>
              <br />
              and Practice <em>Administration.</em>
            </motion.h1>

            <motion.p variants={FADE_UP_VARIANTS} className="text-lg text-muted-foreground leading-relaxed mb-10 max-w-lg">
              Hi, I am Angelica — a dedicated Medical Virtual Assistant with 5+ years of experience helping healthcare providers, doctors, and clinic administrators optimize operations, minimize documentation fatigue, and ensure HIPAA-compliant management of patient care.
            </motion.p>

            <motion.div variants={FADE_UP_VARIANTS} className="flex flex-wrap gap-4 mb-12">
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
            </motion.div>
          </div>

          <motion.div variants={FADE_UP_VARIANTS} className="hidden lg:flex items-center justify-center relative">
            <div className="absolute w-[420px] h-[420px] rounded-full border border-dashed" style={{ borderColor: "rgba(236,72,153,0.2)", animation: "orbit-spin 35s linear infinite" }} />
            <div className="absolute w-[350px] h-[350px] rounded-full border" style={{ borderColor: "rgba(244,63,94,0.15)", animation: "orbit-counter 25s linear infinite" }} />

            <div className="relative z-10" style={{ padding: "3px", borderRadius: "28px", background: "linear-gradient(135deg, #be185d, #ec4899, #f43f5e)" }}>
              <div className="w-[280px] h-[360px] rounded-[26px] overflow-hidden" style={{ background: "#fff5f7" }}>
                <img src={resolveImageSrc(image_ikang)} alt="Angelica Aljas" className="w-full h-full object-cover" />
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// ABOUT & SKILLS & TOOLS (Using Bootstrap Icons)
// ─────────────────────────────────────────────
function About() {
  return (
    <section id="about" className="py-28 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-2 gap-20 items-center mb-24">
          <motion.div
            className="relative"
            variants={FADE_UP_VARIANTS}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
          >
            <div className="absolute inset-0 translate-x-4 translate-y-4 rounded-3xl border-2 border-dashed pointer-events-none" style={{ borderColor: "rgba(236,72,153,0.2)" }} />
            <div className="relative rounded-3xl overflow-hidden aspect-[4/5]" style={{ background: "#fff5f7", boxShadow: "0 24px 60px rgba(236,72,153,0.14)" }}>
              <img src={resolveImageSrc(image_ikang)} alt="Angelica Aljas Profile" className="w-full h-full object-cover" />
            </div>
          </motion.div>

          <motion.div
            variants={STAGGER_CONTAINER}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.15 }}
          >
            <motion.div variants={FADE_UP_VARIANTS}><EyebrowLabel text="About My Practice" /></motion.div>
            <motion.h2 variants={FADE_UP_VARIANTS} className="text-3xl md:text-4xl font-semibold mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
              Bridging the Gap Between Administration and Patient Care
            </motion.h2>
            <motion.p variants={FADE_UP_VARIANTS} className="text-muted-foreground mb-8 leading-relaxed">
              Medical documentation and operational blockages shouldn't compromise patient face-time. Over the last 5 years, I have embedded myself into clinical environments to construct systematic pathways that absorb everyday backlogs seamlessly.
            </motion.p>

            <motion.div variants={FADE_UP_VARIANTS} className="mb-4">
              <h3 className="text-sm font-semibold text-pink-600 uppercase tracking-wider mb-4">Core Clinical Strengths</h3>
              {SKILLS.map((sk, idx) => (
                <SkillBar key={idx} name={sk.name} pct={sk.pct} />
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Tools and Systems Grid rendered using Bootstrap Icon Classes */}
        <motion.div 
          className="border-t border-slate-100 pt-16"
          variants={STAGGER_CONTAINER}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.1 }}
        >
          <div className="mb-10 text-center lg:text-left">
            <h3 className="text-2xl font-bold tracking-tight text-slate-800 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Tools and System</h3>
            <p className="text-sm text-muted-foreground">Expert execution across primary modern operational software ecosystems.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TOOLS_AND_SYSTEMS.map((cat, idx) => (
              <motion.div 
                key={idx} 
                variants={FADE_UP_VARIANTS}
                className="p-6 rounded-2xl border border-slate-100 bg-slate-50/40 hover:bg-white transition-colors duration-300 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-lg bg-pink-50 flex items-center justify-center text-pink-600">
                    <i className={`${cat.bsIconClass} text-lg`}></i>
                  </div>
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">{cat.category}</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {cat.items.map((item, i) => (
                    <span 
                      key={i} 
                      className="text-xs font-medium px-3 py-1.5 rounded-lg bg-white border border-slate-100 text-slate-600 hover:border-pink-200 transition-colors"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-24 border-t border-slate-100 pt-16"
          variants={STAGGER_CONTAINER}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
        >
          {STATS.map((st, idx) => (
            <motion.div key={idx} className="text-center" variants={FADE_UP_VARIANTS}>
              <p className="text-4xl md:text-5xl font-bold text-pink-600 mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
                <CountUp target={st.val} suffix={st.suf} />
              </p>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{st.label}</p>
            </motion.div>
          ))}
        </motion.div>
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
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <div className="flex justify-center"><EyebrowLabel text="Capabilities" /></div>
          <h2 className="text-4xl font-semibold text-slate-900 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Clinical Support Offerings</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SERVICES.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div key={idx} className="p-8 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 bg-pink-50 text-pink-600"><Icon size={22} /></div>
                <h3 className="text-xl font-semibold mb-3 text-slate-800">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
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
    <section id="projects" className="py-28 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <div className="flex justify-center"><EyebrowLabel text="Case Studies" /></div>
          <h2 className="text-4xl font-semibold text-slate-900 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Proven Practice Outcomes</h2>
          <p className="text-sm text-muted-foreground">Real-world workflow transformations achieved across partner clinical ecosystems.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {PROJECTS.map((p, idx) => (
            <div key={idx} className="bg-slate-50/60 border border-slate-100 rounded-3xl overflow-hidden shadow-sm flex flex-col justify-between h-full">
              <div>
                <div className="h-48 overflow-hidden relative">
                  <img src={p.image} alt={p.client} className="w-full h-full object-cover" />
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-full text-[11px] font-semibold bg-white/90 backdrop-blur-sm text-pink-600 shadow-sm border border-pink-100">
                    {p.type}
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-800 mb-2">{p.client}</h3>
                  <p className="text-sm font-semibold text-pink-600 mb-4 italic">"{p.headline}"</p>
                  
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {p.services.map((s, i) => (
                      <span key={i} className="text-[10px] uppercase font-semibold bg-white border px-2.5 py-1 rounded-md text-slate-500 tracking-wider">
                        {s}
                      </span>
                    ))}
                  </div>

                  {/* Metrics Container */}
                  <div className="grid grid-cols-2 gap-4 bg-white p-4 rounded-2xl border border-slate-100 mb-4">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-2 tracking-wider">Before Setup</p>
                      {p.before.map((b, i) => (
                        <div key={i} className="mb-1.5 last:mb-0">
                          <p className="text-[11px] text-slate-500 truncate">{b.label}</p>
                          <p className="text-xs font-bold text-rose-500 line-through">{b.value}</p>
                        </div>
                      ))}
                    </div>
                    <div className="border-l border-slate-100 pl-4">
                      <p className="text-[10px] font-bold text-pink-500 uppercase mb-2 tracking-wider">With My Support</p>
                      {p.after.map((a, i) => (
                        <div key={i} className="mb-1.5 last:mb-0">
                          <p className="text-[11px] text-slate-600 truncate">{a.label}</p>
                          <p className="text-xs font-bold text-emerald-600">{a.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-6 pt-0 border-t border-dashed border-slate-200/60 mt-auto bg-slate-100/30">
                <p className="text-xs text-muted-foreground leading-relaxed mt-4">{p.outcome}</p>
              </div>
            </div>
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
  return (
    <section id="pricing" className="py-28 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <div className="flex justify-center"><EyebrowLabel text="Flexible Plans" /></div>
          <h2 className="text-4xl font-semibold text-slate-900 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Predictable Investment</h2>
          <p className="text-sm text-muted-foreground">Select a scalable tiered engagement standard built around specialized healthcare hours.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {PRICING.map((p, idx) => (
            <div 
              key={idx} 
              className={`bg-white rounded-3xl p-8 border relative transition-all duration-300 ${
                p.popular ? 'border-pink-400 shadow-xl ring-2 ring-pink-400/10 lg:-translate-y-4' : 'border-slate-100 shadow-sm'
              }`}
            >
              {p.popular && (
                <span className="absolute -top-3.5 right-6 bg-pink-600 text-white text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full shadow-md">
                  Most Popular Partner
                </span>
              )}
              
              <h3 className="text-lg font-bold text-slate-800 mb-2">{p.name}</h3>
              <p className="text-xs text-muted-foreground mb-6 h-8">{p.desc}</p>
              
              <div className="mb-6 pb-6 border-b border-slate-100">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold tracking-tight text-slate-900">{p.monthly}</span>
                  <span className="text-sm font-semibold text-muted-foreground">/ month</span>
                </div>
                <div className="mt-2 text-xs text-slate-500 font-medium">
                  Equivalent to <span className="text-pink-600 font-bold">{p.hourly}</span> per hour • <span className="underline">{p.hrs}</span>
                </div>
              </div>

              <ul className="space-y-3.5 mb-8">
                {p.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-3 text-xs text-slate-600 leading-relaxed">
                    <Check size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <button 
                onClick={() => scrollTo("#contact")}
                className={`w-full py-3.5 rounded-xl font-medium text-xs tracking-wide transition-all ${
                  p.popular 
                    ? 'text-white shadow-md hover:shadow-lg' 
                    : 'bg-slate-50 text-slate-700 hover:bg-pink-50 hover:text-pink-600 border border-slate-100'
                }`}
                style={p.popular ? { background: PINK_GRAD } : {}}
              >
                {p.cta}
              </button>
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
  return (
    <section id="testimonials" className="py-28 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <div className="flex justify-center"><EyebrowLabel text="References" /></div>
          <h2 className="text-4xl font-semibold text-slate-900 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Physician & Admin Feedback</h2>
          <p className="text-sm text-muted-foreground">Hear what healthcare administrators and lead clinicians say about our integrated coverage.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {TESTIMONIALS.map((t, idx) => (
            <div key={idx} className="bg-slate-50/50 rounded-2xl p-8 border border-slate-100 flex flex-col justify-between h-full relative">
              <Quote className="absolute right-6 top-6 w-10 h-10 text-pink-100/80 pointer-events-none" />
              <div>
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} size={14} className="fill-pink-500 text-pink-500" />
                  ))}
                </div>
                <p className="text-sm text-slate-600 leading-relaxed italic mb-6 relative z-10">
                  "{t.text}"
                </p>
              </div>

              <div className="flex items-center gap-4 pt-4 border-t border-slate-200/40">
                <img src={t.img} alt={t.name} className="w-11 h-11 rounded-full object-cover border border-pink-200 shadow-sm" />
                <div>
                  <h4 className="text-sm font-bold text-slate-800">{t.name}</h4>
                  <p className="text-[11px] text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// CONTACT
// ─────────────────────────────────────────────
function Contact() {
    return (
    <section className="py-20 px-6 lg:px-20 bg-white">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-start">
        
        {/* Left Side: Text and Details */}
        <div>
          <p className="text-pink-600 font-medium tracking-widest text-sm uppercase mb-4">
            ✨ Get in touch ✨
          </p>
          <h2 className="text-5xl md:text-6xl font-serif text-slate-900 mb-6 leading-tight">
            Let's Build Something <span className="text-pink-600 italic">Amazing Together</span>
          </h2>
          <p className="text-slate-600 mb-10 text-lg">
            Ready to reclaim your time and scale your business? I would love to learn about your goals and show you exactly how I can help.
          </p>

          {/* Contact Details List */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-pink-50 text-pink-600 flex items-center justify-center">📧</div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider">Email</p>
                <p className="font-medium">hello@angelicaaljas.com</p>
              </div>
            </div>
            {/* Dagdagan ng katulad na blocks para sa Response Time at Location */}
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="bg-pink-50 p-8 rounded-3xl">
          <form className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-pink-700 uppercase mb-2">Full Name</label>
                <input className="w-full p-3 rounded-lg border-none bg-white shadow-sm" placeholder="Jane Smith" />
              </div>
              <div>
                <label className="block text-xs font-bold text-pink-700 uppercase mb-2">Email Address</label>
                <input className="w-full p-3 rounded-lg border-none bg-white shadow-sm" placeholder="jane@company.com" />
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-bold text-pink-700 uppercase mb-2">Service Needed</label>
              <select className="w-full p-3 rounded-lg border-none bg-white shadow-sm text-slate-500">
                <option>Select a service...</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-pink-700 uppercase mb-2">Tell me about your business</label>
              <textarea className="w-full p-3 rounded-lg border-none bg-white shadow-sm h-32" placeholder="Share a bit about your business..." />
            </div>

            <button className="w-full bg-pink-600 text-white py-4 rounded-xl font-medium hover:bg-pink-700 transition">
              Send Message ✈
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-white py-12 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 flex flex-col md:flex-row justify-between items-center gap-6">
        
        {/* Branding */}
        <div className="text-center md:text-left">
          <p className="text-lg font-semibold tracking-tight text-slate-900" style={{ fontFamily: "'Playfair Display', serif" }}>
            Angelica Aljas
          </p>
          <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground mt-1">
            Medical Virtual Assistant
          </p>
        </div>

        {/* Copyright */}
        <div className="text-[11px] text-slate-400 font-medium">
          © {new Date().getFullYear()} Angelica Aljas. All rights reserved.
        </div>

        {/* Social Links */}
        <div className="flex items-center gap-3">
          {[
            { icon: Instagram, href: "#" },
            { icon: Linkedin, href: "#" },
            { icon: Twitter, href: "#" }
          ].map((social, i) => (
            <a
              key={i}
              href={social.href}
              className="w-9 h-9 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-pink-50 hover:text-pink-600 transition-all duration-300"
            >
              <social.icon size={16} />
            </a>
          ))}
        </div>
        
      </div>
    </footer>
  );
}

// ─────────────────────────────────────────────
// EXPORT SYSTEM MAIN ENTRY
// ─────────────────────────────────────────────
export default function App() {
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css";
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased font-sans">
      <Nav onOpenContact={() => scrollTo("#contact")} />
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