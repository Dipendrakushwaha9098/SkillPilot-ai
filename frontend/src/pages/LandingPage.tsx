import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Brain, Target, Zap, CheckCircle, Star, ChevronDown, ArrowRight,
  Sparkles, BookOpen, Code2, Palette, Music, TrendingUp, Globe,
  ChevronLeft, ChevronRight,
} from 'lucide-react';
 
// ─── useInView ─────────────────────────────────────────────────────────────
function useInView(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}
 
function FadeIn({ children, delay = 0, className = '', up = true }: {
  children: React.ReactNode; delay?: number; className?: string; up?: boolean;
}) {
  const { ref, visible } = useInView();
  return (
    <div ref={ref} className={className} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'none' : up ? 'translateY(32px)' : 'translateY(0) scale(0.97)',
      transition: `opacity 0.7s cubic-bezier(.22,1,.36,1) ${delay}ms, transform 0.7s cubic-bezier(.22,1,.36,1) ${delay}ms`,
    }}>
      {children}
    </div>
  );
}
 
// ─── Data ──────────────────────────────────────────────────────────────────
const skills = [
  { icon: Code2, label: 'React & Next.js' },
  { icon: BookOpen, label: 'Node & Python Backend' },
  { icon: Brain, label: 'PostgreSQL & MongoDB' },
  { icon: TrendingUp, label: 'Docker & AWS DevOps' },
  { icon: Globe, label: 'REST & GraphQL APIs' },
  { icon: Sparkles, label: 'System Design' },
  { icon: Palette, label: 'Tailwind & Modern UI' },
  { icon: Music, label: 'Microservices & Cloud' },
];
 
const steps = [
  { num: '01', title: 'Tell us your goal', body: 'Pick a skill and describe where you want to be. Senior dev? Fluent in Spanish? We get it.', color: '#d946ef' },
  { num: '02', title: 'AI assesses your level', body: 'A short adaptive quiz pinpoints exactly where you are — no wasted time on things you already know.', color: '#8b5cf6' },
  { num: '03', title: 'Get your roadmap', body: 'A personalised 3-month plan: curated resources, weekly projects, and milestones that actually make sense.', color: '#2dd4bf' },
  { num: '04', title: 'Learn with your AI mentor', body: 'Stuck? Ask anything. Your mentor explains, reviews your work, and evolves the plan as you grow.', color: '#ec4899' },
];

 
const testimonials = [
  {
    name: 'Priya M.', role: 'Junior → Senior Dev in 8 months',
    quote: 'SkillPilot mapped out exactly what I was missing. The mentor answered every question I was afraid to ask Stack Overflow.',
    rating: 5, avatar: 'PM', color: '#3b82f6', image: '/images/learner_success_portrait.jpg'
  },
  {
    name: 'Lucas T.', role: 'Career-changer, now UX Designer',
    quote: 'I tried five different courses and kept stalling. The personalised roadmap finally gave me a clear path I actually stuck to.',
    rating: 5, avatar: 'LT', color: '#8b5cf6', image: '/images/student_learning_laptop.jpg'
  },
  {
    name: 'Aisha K.', role: 'Data Analyst at a Series B startup',
    quote: "From zero Python to landing my first data role. I genuinely don't think I'd have done it without the AI mentor keeping me accountable.",
    rating: 5, avatar: 'AK', color: '#0284c7', image: '/images/developer_workspace_photo.jpg'
  },
  {
    name: 'Marco R.', role: 'Freelance developer, 2× income',
    quote: "The roadmap cut through the noise. Six months in, I doubled my freelance rate and actually understand system design now.",
    rating: 5, avatar: 'MR', color: '#6366f1', image: '/images/learner_success_portrait.jpg'
  },
];

 
const pricing = [
  {
    tier: 'Starter', price: 'Free', sub: 'Forever',
    features: ['1 active roadmap', 'AI assessment', 'Community access', '10 mentor messages/mo'],
    cta: 'Get Started', featured: false,
  },
  {
    tier: 'Pro', price: '$12', sub: 'per month',
    features: ['Unlimited roadmaps', 'Priority AI mentor', 'Weekly progress reports', 'Project feedback', 'Offline access'],
    cta: 'Start Free Trial', featured: true,
  },
  {
    tier: 'Teams', price: '$29', sub: 'per seat / month',
    features: ['Everything in Pro', 'Admin dashboard', 'Team analytics', 'Custom curricula', 'Dedicated support'],
    cta: 'Contact Sales', featured: false,
  },
];
 
const faqs = [
  { q: 'How is SkillPilot different from other learning platforms?', a: "Most platforms give you a generic course list. SkillPilot starts with where you actually are and builds a personalised plan around your schedule, goals, and learning style. It adapts as you progress." },
  { q: 'What skills can I learn?', a: "Any skill with a structured learning path — coding, design, data science, languages, music, writing, finance, and more. If your skill isn't listed, request it and we'll build a roadmap." },
  { q: 'How long does it take to see results?', a: "Most learners see meaningful progress within the first 2–3 weeks. The AI assessment ensures you start at exactly the right level." },
  { q: 'Can I cancel my Pro subscription anytime?', a: "Yes. Cancel any time from your account settings — no lock-ins, no awkward cancellation flows. Your data and progress are always yours to export." },
];

const footerLinks = {
  Product: ['Features', 'Pricing', 'Roadmap', 'Changelog'],
  Company: ['About', 'Blog', 'Careers', 'Press'],
  Legal: ['Privacy', 'Terms', 'Security', 'Cookies'],
};

// ─── Theme tokens ──────────────────────────────────────────────────────────
const DARK = {
  bg: 'transparent',
  bgAlt: 'rgba(37, 99, 235, 0.04)',
  surface: 'rgba(15, 23, 42, 0.75)',
  surfaceHover: 'rgba(15, 23, 42, 0.9)',
  border: 'rgba(59, 130, 246, 0.2)',
  borderStrong: 'rgba(59, 130, 246, 0.4)',
  text: '#f8fafc',
  textMuted: '#cbd5e1',
  textFaint: '#94a3b8',
  navBg: 'rgba(10, 15, 29, 0.85)',
  accent: '#3b82f6',
  accentAlt: '#0284c7',
  accentText: '#ffffff',
  cardGrad: 'linear-gradient(135deg, rgba(37, 99, 235, 0.12) 0%, rgba(56, 189, 248, 0.05) 100%)',
  blob1: 'rgba(37, 99, 235, 0.22)',
  blob2: 'rgba(2, 132, 199, 0.18)',
  blob3: 'rgba(99, 102, 241, 0.15)',
};

const LIGHT = {
  bg: 'transparent',
  bgAlt: 'rgba(37, 99, 235, 0.05)',
  surface: 'rgba(255, 255, 255, 0.95)',
  surfaceHover: 'rgba(255, 255, 255, 1)',
  border: 'rgba(37, 99, 235, 0.2)',
  borderStrong: 'rgba(37, 99, 235, 0.4)',
  text: '#0f172a',
  textMuted: '#334155',
  textFaint: '#475569',
  navBg: 'rgba(241, 245, 249, 0.9)',
  accent: '#2563eb',
  accentAlt: '#0284c7',
  accentText: '#ffffff',
  cardGrad: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(239, 246, 255, 0.9) 100%)',
  blob1: 'rgba(37, 99, 235, 0.15)',
  blob2: 'rgba(2, 132, 199, 0.12)',
  blob3: 'rgba(99, 102, 241, 0.1)',
};

 
// ─── FAQ Item ──────────────────────────────────────────────────────────────
function FaqItem({ q, a, theme }: { q: string; a: string; theme: typeof DARK }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: `1px solid ${theme.border}` }} className="last:border-0">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between py-5 text-left gap-4 group" style={{ background: 'none', border: 'none', cursor: 'pointer', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 0', gap: '16px' }}>
        <span style={{ fontSize: '15px', fontWeight: 600, color: theme.text, transition: 'color 0.2s' }}>{q}</span>
        <ChevronDown size={18} style={{ flexShrink: 0, color: theme.textMuted, transition: 'transform 0.3s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }} />
      </button>
      <div style={{ overflow: 'hidden', transition: 'all 0.3s', maxHeight: open ? '300px' : '0', opacity: open ? 1 : 0 }}>
        <p style={{ paddingBottom: '20px', color: theme.textMuted, lineHeight: 1.7, fontSize: '14px' }}>{a}</p>
      </div>
    </div>
  );
}
 
// ─── Testimonial Carousel ──────────────────────────────────────────────────
function TestimonialCarousel({ theme }: { theme: typeof DARK }) {
  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState(1);
  const [animating, setAnimating] = useState(false);
  const total = testimonials.length;
 
  const go = useCallback((next: number, direction: number) => {
    if (animating) return;
    setDir(direction);
    setAnimating(true);
    setTimeout(() => { setIdx(next); setAnimating(false); }, 320);
  }, [animating]);
 
  const prev = () => go((idx - 1 + total) % total, -1);
  const next = () => go((idx + 1) % total, 1);
 
  useEffect(() => {
    const t = setInterval(() => go((idx + 1) % total, 1), 5000);
    return () => clearInterval(t);
  }, [idx, go, total]);
 
  const t = testimonials[idx];
 
  return (
    <div style={{ position: 'relative', maxWidth: '640px', margin: '0 auto' }}>
      <div style={{
        borderRadius: '24px', padding: '40px', border: `1px solid ${theme.border}`,
        background: theme.cardGrad, backdropFilter: 'blur(12px)',
        position: 'relative', overflow: 'hidden',
        opacity: animating ? 0 : 1,
        transform: animating ? `translateX(${dir * 40}px)` : 'translateX(0)',
        transition: 'opacity 0.32s ease, transform 0.32s ease',
        boxShadow: theme === LIGHT ? '0 8px 40px rgba(59,130,246,0.1)' : 'none',
      }}>
        <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '200px', height: '200px', borderRadius: '50%', background: t.color, opacity: 0.08, filter: 'blur(48px)' }} />
        <div style={{ display: 'flex', gap: '4px', marginBottom: '24px' }}>
          {Array.from({ length: t.rating }).map((_, i) => (
            <Star key={i} size={15} style={{ fill: '#f59e0b', color: '#f59e0b' }} />
          ))}
        </div>
        <p style={{ color: theme.text, fontSize: '17px', lineHeight: 1.7, marginBottom: '32px' }}>"{t.quote}"</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '52px', height: '52px', borderRadius: '16px', overflow: 'hidden', border: `2px solid ${t.color}`, flexShrink: 0, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            {t.image ? (
              <img src={t.image} alt={t.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '13px', background: t.color, color: '#fff' }}>{t.avatar}</div>
            )}
          </div>
          <div>
            <p style={{ fontWeight: 700, color: theme.text }}>{t.name}</p>
            <p style={{ fontSize: '13px', color: theme.textMuted }}>{t.role}</p>
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '24px' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          {testimonials.map((_, i) => (
            <button key={i} onClick={() => go(i, i > idx ? 1 : -1)} style={{
              borderRadius: '999px', border: 'none', cursor: 'pointer',
              width: i === idx ? '24px' : '8px', height: '8px',
              background: i === idx ? theme.accent : theme.border,
              transition: 'all 0.3s',
            }} />
          ))}
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {[prev, next].map((fn, i) => (
            <button key={i} onClick={fn} style={{
              width: '40px', height: '40px', borderRadius: '12px', border: `1px solid ${theme.border}`,
              background: theme.surface, display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: theme.textMuted, transition: 'all 0.2s',
            }}>
              {i === 0 ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
 
// ─── Animated Steps ────────────────────────────────────────────────────────
function AnimatedStep({ step, index, theme }: { step: typeof steps[0]; index: number; theme: typeof DARK }) {
  const { ref, visible } = useInView(0.3);
  return (
    <div ref={ref} style={{
      display: 'flex', gap: '32px', alignItems: 'flex-start',
      opacity: visible ? 1 : 0,
      transform: visible ? 'none' : 'translateX(-24px)',
      transition: `opacity 0.6s ease ${index * 130}ms, transform 0.6s ease ${index * 130}ms`,
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
        <div style={{
          width: '56px', height: '56px', borderRadius: '16px', display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontWeight: 900, fontSize: '17px', zIndex: 10, position: 'relative',
          background: `${step.color}18`, border: `1.5px solid ${step.color}40`, color: step.color,
          transition: 'transform 0.3s',
        }}>{step.num}</div>
        {index < steps.length - 1 && (
          <div style={{
            width: '1px', flex: 1, marginTop: '8px', minHeight: '40px',
            background: `linear-gradient(to bottom, ${step.color}60, transparent)`,
            opacity: visible ? 1 : 0, transition: `opacity 0.6s ease ${index * 130 + 300}ms`,
          }} />
        )}
      </div>
      <div style={{ paddingBottom: '40px', paddingTop: '8px' }}>
        <h3 style={{ fontSize: '17px', fontWeight: 700, color: theme.text, marginBottom: '8px' }}>{step.title}</h3>
        <p style={{ fontSize: '14px', color: theme.textMuted, lineHeight: 1.7, maxWidth: '340px' }}>{step.body}</p>
      </div>
    </div>
  );
}
 
// ─── Animated Headline ─────────────────────────────────────────────────────
const words = ['any skill', 'web dev', 'design', 'data science', 'your goals'];
function AnimatedHeadline({ accent }: { accent: string }) {
  const [word, setWord] = useState(0);
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const t = setInterval(() => {
      setVisible(false);
      setTimeout(() => { setWord(w => (w + 1) % words.length); setVisible(true); }, 400);
    }, 2500);
    return () => clearInterval(t);
  }, []);
  return (
    <span style={{
      display: 'inline-block', color: accent,
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(-12px)',
      transition: 'opacity 0.4s ease, transform 0.4s ease',
    }}>{words[word]}</span>
  );
}
 
 
// ─── Main Component ────────────────────────────────────────────────────────
const LandingPage = () => {
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem("theme");
    if (saved) return saved === "dark";
    return document.documentElement.classList.contains("dark");
  });

  useEffect(() => {
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };

    checkTheme();

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          checkTheme();
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });

    return () => observer.disconnect();
  }, []);

  const theme = isDark ? DARK : LIGHT;

  return (
    <div style={{
      minHeight: '100vh', overflowX: 'hidden',
      background: theme.bg,
      fontFamily: "'Inter', 'Sora', system-ui, sans-serif",
      color: theme.text,
      transition: 'background 0.4s ease, color 0.4s ease',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Sora:wght@700;800&display=swap');
        .font-display { font-family: 'Sora', sans-serif; }
        @keyframes fadeDown {
          from { opacity:0; transform:translateY(-20px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes marquee {
          from { transform:translateX(0); }
          to   { transform:translateX(-33.333%); }
        }
        @keyframes pulse-ring {
          0%   { transform: scale(1);   opacity: 0.5; }
          100% { transform: scale(1.7); opacity: 0; }
        }
        .noise-bg::before {
          content: '';
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
          opacity: 0.02;
        }
        .glow-blue { box-shadow: 0 0 40px rgba(34,211,238,0.25), 0 0 80px rgba(34,211,238,0.1); }
        .hover-lift { transition: transform 0.25s ease, box-shadow 0.25s ease; }
        .hover-lift:hover { transform: translateY(-4px); }
        @media (max-width: 768px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
          .nav-desktop { display: none !important; }
      `}</style>
 
      <div className="noise-bg" />
 
      {/* Ambient blobs */}
      <div style={{ position: 'fixed', inset: 0, zIndex: -1, overflow: 'hidden', pointerEvents: 'none' }}>
        <div className="animate-orb-1" style={{ position: 'absolute', top: '-10%', left: '-5%', width: '600px', height: '600px', borderRadius: '50%', background: `radial-gradient(circle, ${theme.blob1} 0%, transparent 70%)`, filter: 'blur(40px)', transition: 'background 0.4s' }} />
        <div className="animate-orb-2" style={{ position: 'absolute', top: '30%', right: '-10%', width: '500px', height: '500px', borderRadius: '50%', background: `radial-gradient(circle, ${theme.blob2} 0%, transparent 70%)`, filter: 'blur(40px)', transition: 'background 0.4s' }} />
        <div className="animate-orb-1" style={{ position: 'absolute', bottom: '-5%', left: '20%', width: '400px', height: '400px', borderRadius: '50%', background: `radial-gradient(circle, ${theme.blob3} 0%, transparent 70%)`, filter: 'blur(40px)', transition: 'background 0.4s' }} />
      </div>
      {/* ── Hero ── */}
      <header style={{ paddingTop: '160px', paddingBottom: '120px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 24px' }}>
          {/* Badge */}
          <div style={{
            animation: 'fadeDown 0.5s ease both', display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: `${theme.accent}12`, border: `1px solid ${theme.accent}30`,
            borderRadius: '999px', padding: '6px 16px', fontSize: '13px', fontWeight: 600,
            color: theme.accent, marginBottom: '36px', transition: 'all 0.4s',
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: theme.accent, display: 'inline-block', position: 'relative' }}>
              <span style={{ position: 'absolute', inset: '-3px', borderRadius: '50%', border: `1.5px solid ${theme.accent}`, animation: 'pulse-ring 1.8s ease-out infinite' }} />
            </span>
            AI-powered learning paths, built for you
          </div>
 
          {/* Headline */}
          <h1 className="font-display" style={{
            animation: 'fadeDown 0.6s ease 0.1s both',
            fontSize: 'clamp(42px, 8vw, 80px)', fontWeight: 800, lineHeight: 1.05,
            letterSpacing: '-0.03em', color: theme.text, marginBottom: '28px', transition: 'color 0.4s',
          }}>
            Master <AnimatedHeadline accent={theme.accent} />
            <br />
            <span style={{ color: theme.textFaint, transition: 'color 0.4s' }}>with AI precision.</span>
          </h1>
 
          <p style={{
            animation: 'fadeDown 0.6s ease 0.2s both',
            fontSize: 'clamp(16px, 2.5vw, 20px)', color: theme.textMuted,
            lineHeight: 1.7, marginBottom: '44px', maxWidth: '580px', margin: '0 auto 44px',
            transition: 'color 0.4s',
          }}>
            SkillPilot identifies your current level and crafts a personalised roadmap — with resources, projects, and an AI mentor that's always on call.
          </p>
 
          {/* CTAs */}
          <div style={{ animation: 'fadeDown 0.6s ease 0.3s both', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '12px' }}>
            <Link to="/signup" className="glow-blue" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '15px 32px',
              background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentAlt})`,
              color: '#fff', borderRadius: '14px', fontWeight: 700, fontSize: '16px', textDecoration: 'none',
              transition: 'all 0.2s ease', boxShadow: `0 8px 32px ${theme.accent}35`,
            }}>
              Start learning free <ArrowRight size={18} />
            </Link>
            <a href="#how" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '15px 32px', background: theme.surface, color: theme.text,
              border: `1px solid ${theme.border}`, borderRadius: '14px',
              fontWeight: 600, fontSize: '16px', textDecoration: 'none', transition: 'all 0.2s ease',
            }}>
              See how it works
            </a>
          </div>

          {/* Social proof */}
          <div style={{
            animation: 'fadeDown 0.6s ease 0.45s both', marginTop: '52px',
            display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '24px',
            fontSize: '13px', color: theme.textFaint,
          }}>
            {['No credit card required', 'Free plan forever', 'Roadmap in under 2 min'].map(t => (
              <span key={t} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle size={13} color={theme.accent} /> {t}
              </span>
            ))}
          </div>
          <div style={{
            animation: 'fadeDown 0.6s ease 0.55s both', marginTop: '64px',
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px',
            background: theme.border, borderRadius: '20px', overflow: 'hidden',
            border: `1px solid ${theme.border}`, maxWidth: '560px', margin: '64px auto 0',
            transition: 'all 0.4s',
          }}>
            {[['12k+', 'Active learners'], ['94%', 'Completion rate'], ['4.9★', 'Avg. rating']].map(([val, label]) => (
              <div key={label} style={{ padding: '24px 16px', textAlign: 'center', background: theme.surface, transition: 'background 0.4s' }}>
                <div className="font-display" style={{ fontSize: '26px', fontWeight: 800, color: theme.text, letterSpacing: '-0.02em', transition: 'color 0.4s' }}>{val}</div>
                <div style={{ fontSize: '12px', color: theme.textFaint, marginTop: '4px', transition: 'color 0.4s' }}>{label}</div>
              </div>
            ))}
          </div>

          {/* 3D Dashboard Showcase Image */}
          <div style={{ animation: 'fadeDown 0.6s ease 0.65s both', marginTop: '56px', position: 'relative' }}>
            <div className="hover-lift" style={{
              borderRadius: '24px', padding: '12px',
              background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.25) 0%, rgba(56, 189, 248, 0.1) 100%)',
              boxShadow: '0 25px 60px -15px rgba(37, 99, 235, 0.25)',
              border: `1px solid ${theme.borderStrong}`,
            }}>
              <img 
                src="/images/hero_dashboard_mockup.jpg" 
                alt="SkillPilot AI Interactive Dashboard Preview" 
                style={{
                  width: '100%', borderRadius: '18px', display: 'block',
                  boxShadow: '0 10px 35px rgba(0,0,0,0.15)'
                }} 
              />
            </div>
          </div>
        </div>
      </header>

      {/* ── Skills ticker ── */}
      <div style={{ borderTop: `1px solid ${theme.border}`, borderBottom: `1px solid ${theme.border}`, background: theme.bgAlt, padding: '16px 0', overflow: 'hidden', transition: 'all 0.4s' }}>
        <div style={{ display: 'flex', gap: '48px', whiteSpace: 'nowrap', animation: 'marquee 24s linear infinite' }}>
          {[...skills, ...skills, ...skills].map(({ icon: Icon, label }, i) => (
            <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: theme.textMuted, fontSize: '13px', fontWeight: 500 }}>
              <Icon size={15} color={theme.accent} /> {label}
            </span>
          ))}
        </div>
      </div>

      {/* ── Features ── */}
      <section style={{ padding: '100px 24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <FadeIn className="text-center">
            <p style={{ fontSize: '12px', fontWeight: 700, color: theme.accent, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '12px', transition: 'color 0.4s' }}>Why SkillPilot</p>
            <h2 className="font-display" style={{ fontSize: 'clamp(28px,5vw,46px)', fontWeight: 800, color: theme.text, letterSpacing: '-0.02em', transition: 'color 0.4s' }}>Everything you need to actually improve</h2>
          </FadeIn>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginTop: '64px' }}>
            {[
              { icon: Brain, color: '#3b82f6', bg: 'rgba(59,130,246,0.1)', title: 'AI Skill Assessment', body: 'A short adaptive quiz pinpoints exactly where you are. No generic beginner content — your plan starts at your level.', img: '/images/learning_roadmap_preview.jpg' },
              { icon: Target, color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)', title: 'Custom Roadmaps', body: 'A structured 3-month path with curated resources, real projects, and clear milestones, generated in seconds.', img: '/images/hero_dashboard_mockup.jpg' },
              { icon: Zap, color: '#0284c7', bg: 'rgba(2,132,199,0.1)', title: 'AI Mentor 24/7', body: 'Stuck on a concept? Your mentor explains it, reviews your code, and adjusts your plan when life happens.', img: '/images/ai_mentor_avatar.jpg' },
            ].map(({ icon: Icon, color, bg, title, body, img }, i) => (

              <FadeIn key={title} delay={i * 100}>
                <div className="hover-lift" style={{
                  padding: '24px', borderRadius: '24px',
                  background: theme.surface, border: `1px solid ${theme.border}`,
                  transition: 'border-color 0.3s ease, background 0.4s',
                  boxShadow: theme === LIGHT ? '0 4px 20px rgba(59,130,246,0.06)' : 'none',
                  display: 'flex', flexDirection: 'column', height: '100%'
                }}>
                  <div style={{ borderRadius: '16px', overflow: 'hidden', marginBottom: '20px', height: '160px' }}>
                    <img src={img} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                    <Icon size={20} color={color} />
                  </div>
                  <h3 className="font-display" style={{ fontSize: '18px', fontWeight: 700, color: theme.text, marginBottom: '8px', transition: 'color 0.4s' }}>{title}</h3>
                  <p style={{ fontSize: '14px', color: theme.textMuted, lineHeight: 1.6, transition: 'color 0.4s', flex: 1 }}>{body}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Real-World Success & Workspace Showcase ── */}
      <section style={{ padding: '80px 24px', background: theme.bgAlt, borderTop: `1px solid ${theme.border}`, borderBottom: `1px solid ${theme.border}` }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '48px', alignItems: 'center' }}>
            <FadeIn>
              <div className="hover-lift" style={{ borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.15)', border: `1px solid ${theme.borderStrong}` }}>
                <img src="/images/student_learning_laptop.jpg" alt="Developer learning with SkillPilot AI" style={{ width: '100%', display: 'block', height: '360px', objectFit: 'cover' }} />
              </div>
            </FadeIn>
            <FadeIn delay={150}>
              <div>
                <span style={{ fontSize: '12px', fontWeight: 700, color: theme.accent, letterSpacing: '0.12em', textTransform: 'uppercase', display: 'block', marginBottom: '12px' }}>Real-World Experience</span>
                <h2 className="font-display" style={{ fontSize: 'clamp(26px, 4vw, 38px)', fontWeight: 800, color: theme.text, marginBottom: '20px', lineHeight: 1.2 }}>
                  Engineered for real-world developer workflows
                </h2>
                <p style={{ fontSize: '15px', color: theme.textMuted, lineHeight: 1.7, marginBottom: '28px' }}>
                  SkillPilot integrates directly into your daily learning routine. Whether preparing for technical interviews, upskilling in a new stack, or building production apps, our AI mentor keeps you in deep flow state.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div style={{ padding: '20px', borderRadius: '18px', background: theme.surface, border: `1px solid ${theme.border}` }}>
                    <div className="font-display" style={{ fontSize: '28px', fontWeight: 800, color: theme.accent }}>10k+</div>
                    <div style={{ fontSize: '13px', color: theme.textMuted, marginTop: '4px' }}>Active Mentorship Hours</div>
                  </div>
                  <div style={{ padding: '20px', borderRadius: '18px', background: theme.surface, border: `1px solid ${theme.border}` }}>
                    <div className="font-display" style={{ fontSize: '28px', fontWeight: 800, color: theme.accent }}>88%</div>
                    <div style={{ fontSize: '13px', color: theme.textMuted, marginTop: '4px' }}>Career Advancement Rate</div>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
      <section id="how" style={{ padding: '100px 24px', background: theme.bgAlt, transition: 'background 0.4s' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <FadeIn>
            <p style={{ fontSize: '12px', fontWeight: 700, color: theme.accent, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '12px', textAlign: 'center' }}>How it works</p>
            <h2 className="font-display" style={{ fontSize: 'clamp(28px,5vw,46px)', fontWeight: 800, color: theme.text, letterSpacing: '-0.02em', textAlign: 'center', marginBottom: '72px', transition: 'color 0.4s' }}>
              From goal to growth in 4 steps
            </h2>
          </FadeIn>
          {steps.map((step, i) => <AnimatedStep key={step.num} step={step} index={i} theme={theme} />)}
        </div>
      </section>
 
      {/* ── Testimonials ── */}
      <section style={{ padding: '100px 24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <FadeIn className="text-center">
            <p style={{ fontSize: '12px', fontWeight: 700, color: theme.accent, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '12px' }}>Testimonials</p>
            <h2 className="font-display" style={{ fontSize: 'clamp(28px,5vw,46px)', fontWeight: 800, color: theme.text, letterSpacing: '-0.02em', marginBottom: '60px', transition: 'color 0.4s' }}>Learners who levelled up</h2>
          </FadeIn>
          <FadeIn delay={100}>
            <TestimonialCarousel theme={theme} />
          </FadeIn>
        </div>
      </section>
 
      {/* ── Pricing ── */}
      <section id="pricing" style={{ padding: '100px 24px', background: theme.bgAlt, transition: 'background 0.4s' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <FadeIn className="text-center">
            <p style={{ fontSize: '12px', fontWeight: 700, color: theme.accent, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '12px' }}>Pricing</p>
            <h2 className="font-display" style={{ fontSize: 'clamp(28px,5vw,46px)', fontWeight: 800, color: theme.text, letterSpacing: '-0.02em', transition: 'color 0.4s' }}>Simple, honest pricing</h2>
            <p style={{ color: theme.textMuted, marginTop: '12px', fontSize: '15px', marginBottom: '60px' }}>Start free. Upgrade when you're ready.</p>
          </FadeIn>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', alignItems: 'start' }}>
            {pricing.map(({ tier, price, sub, features, cta, featured }, i) => (
              <FadeIn key={tier} delay={i * 100}>
                <div style={{
                  borderRadius: '24px', padding: '32px',
                  background: featured
                    ? `linear-gradient(135deg, ${theme.accent}, ${theme.accentAlt})`
                    : theme.surface,
                  border: featured ? 'none' : `1px solid ${theme.border}`,
                  transform: featured ? 'scale(1.03)' : 'none',
                  boxShadow: featured ? `0 32px 80px ${theme.accent}30` : (theme === LIGHT ? '0 2px 16px rgba(59,130,246,0.06)' : 'none'),
                  transition: 'background 0.4s',
                }}>
                  {featured && <span style={{ display: 'inline-block', background: 'rgba(255,255,255,0.2)', color: '#fff', fontSize: '11px', fontWeight: 700, borderRadius: '999px', padding: '4px 12px', marginBottom: '20px', letterSpacing: '0.05em' }}>MOST POPULAR</span>}
                  <p style={{ fontWeight: 600, fontSize: '13px', marginBottom: '16px', color: featured ? 'rgba(255,255,255,0.7)' : theme.textMuted }}>{tier}</p>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '4px' }}>
                    <span className="font-display" style={{ fontSize: '44px', fontWeight: 800, letterSpacing: '-0.03em', color: featured ? '#fff' : theme.text, transition: 'color 0.4s' }}>{price}</span>
                    {price !== 'Free' && <span style={{ fontSize: '13px', color: featured ? 'rgba(255,255,255,0.6)' : theme.textFaint }}>/mo</span>}
                  </div>
                  <p style={{ fontSize: '12px', marginBottom: '28px', color: featured ? 'rgba(255,255,255,0.6)' : theme.textFaint }}>{sub}</p>
                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {features.map(f => (
                      <li key={f} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: featured ? 'rgba(255,255,255,0.85)' : theme.textMuted }}>
                        <CheckCircle size={15} color={featured ? '#fff' : theme.accent} style={{ flexShrink: 0 }} /> {f}
                      </li>
                    ))}
                  </ul>
                  <Link to="/signup" style={{
                    display: 'block', textAlign: 'center', padding: '13px', borderRadius: '12px', fontWeight: 700, fontSize: '14px', textDecoration: 'none',
                    background: featured ? '#fff' : `linear-gradient(135deg, ${theme.accent}, ${theme.accentAlt})`,
                    color: featured ? theme.accent : '#fff',
                    transition: 'opacity 0.2s',
                  }}>{cta}</Link>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
 
      {/* ── FAQ ── */}
      <section id="faq" style={{ padding: '100px 24px' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <FadeIn className="text-center">
            <p style={{ fontSize: '12px', fontWeight: 700, color: theme.accent, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '12px' }}>FAQ</p>
            <h2 className="font-display" style={{ fontSize: 'clamp(28px,5vw,46px)', fontWeight: 800, color: theme.text, letterSpacing: '-0.02em', marginBottom: '56px', transition: 'color 0.4s' }}>Common questions</h2>
          </FadeIn>
          <FadeIn>
            <div style={{ borderRadius: '20px', background: theme.surface, border: `1px solid ${theme.border}`, padding: '0 32px', transition: 'all 0.4s' }}>
              {faqs.map(({ q, a }) => <FaqItem key={q} q={q} a={a} theme={theme} />)}
            </div>
          </FadeIn>
        </div>
      </section>
 
      {/* ── CTA ── */}
      <section style={{ padding: '80px 24px 100px' }}>
        <FadeIn>
          <div style={{
            maxWidth: '900px', margin: '0 auto', borderRadius: '32px', padding: '80px 48px',
            background: `linear-gradient(135deg, ${theme.accent}15 0%, ${theme.accentAlt}10 50%, ${theme.accent}12 100%)`,
            border: `1px solid ${theme.accent}25`, textAlign: 'center', position: 'relative', overflow: 'hidden',
            transition: 'all 0.4s',
          }}>
            <div style={{ position: 'absolute', top: '-40px', left: '-40px', width: '200px', height: '200px', borderRadius: '50%', background: `${theme.accent}18`, filter: 'blur(60px)' }} />
            <div style={{ position: 'absolute', bottom: '-40px', right: '-40px', width: '200px', height: '200px', borderRadius: '50%', background: `${theme.accentAlt}18`, filter: 'blur(60px)' }} />
            <div style={{ position: 'absolute', inset: 0, opacity: 0.04, backgroundImage: 'linear-gradient(rgba(100,200,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(100,200,255,0.5) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: `${theme.accent}12`, border: `1px solid ${theme.accent}25`, borderRadius: '999px', padding: '6px 16px', fontSize: '13px', color: theme.accent, fontWeight: 600, marginBottom: '28px' }}>
                <Sparkles size={13} /> Join 12,000+ learners today
              </div>
              <h2 className="font-display" style={{ fontSize: 'clamp(32px,6vw,60px)', fontWeight: 800, color: theme.text, letterSpacing: '-0.03em', lineHeight: 1.05, marginBottom: '20px', transition: 'color 0.4s' }}>
                Ready to start<br />building real skills?
              </h2>
              <p style={{ fontSize: '18px', color: theme.textMuted, marginBottom: '40px', maxWidth: '480px', margin: '0 auto 40px', lineHeight: 1.7 }}>
                Your personalised roadmap is 2 minutes away. No credit card. No fluff.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '12px' }}>
                <Link to="/signup" style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  padding: '15px 36px',
                  background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentAlt})`,
                  color: '#fff', borderRadius: '14px', fontWeight: 700, fontSize: '16px', textDecoration: 'none',
                  boxShadow: `0 8px 32px ${theme.accent}35`, transition: 'all 0.2s ease',
                }}>
                  Get started for free <ArrowRight size={18} />
                </Link>
                <Link to="/login" style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  padding: '15px 28px', background: theme.surface, color: theme.text,
                  border: `1px solid ${theme.border}`, borderRadius: '14px',
                  fontWeight: 600, fontSize: '16px', textDecoration: 'none', transition: 'all 0.4s',
                }}>
                  Sign in
                </Link>
              </div>
            </div>
          </div>
        </FadeIn>
      </section>
 
      {/* ── Footer ── */}
      <footer style={{ borderTop: `1px solid ${theme.border}`, padding: '64px 24px 40px', transition: 'border-color 0.4s' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: '2fr repeat(3, 1fr)', gap: '40px', marginBottom: '64px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '9px', background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentAlt})`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Sparkles size={13} color="#fff" />
                </div>
                <span className="font-display" style={{ fontWeight: 800, fontSize: '17px', color: theme.text, transition: 'color 0.4s' }}>SkillPilot</span>
              </div>
              <p style={{ fontSize: '13px', color: theme.textFaint, lineHeight: 1.7, maxWidth: '220px', transition: 'color 0.4s' }}>
                AI-powered learning paths that adapt to you. Build real skills, faster.
              </p>
            </div>
            {Object.entries(footerLinks).map(([col, links]) => (
              <div key={col}>
                <p style={{ fontSize: '12px', fontWeight: 700, color: theme.textMuted, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '16px', transition: 'color 0.4s' }}>{col}</p>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {links.map(l => (
                    <li key={l}>
                      <a href="#" style={{ fontSize: '14px', color: theme.textFaint, textDecoration: 'none', transition: 'color 0.2s' }}>{l}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div style={{ paddingTop: '24px', borderTop: `1px solid ${theme.border}`, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '12px', transition: 'border-color 0.4s' }}>
            <p style={{ fontSize: '13px', color: theme.textFaint }}>© {new Date().getFullYear()} SkillPilot AI. All rights reserved.</p>
            <p style={{ fontSize: '13px', color: theme.textFaint }}>Built with ❤️ for lifelong learners</p>
          </div>
        </div>
      </footer>
 
      <style>{`
        @media (max-width: 768px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
          .nav-desktop { display: none !important; }
          .md-hamburger { display: block !important; }
        }
        @media (min-width: 769px) {
          .md-hamburger { display: none !important; }
          .nav-desktop { display: flex !important; }
        }
      `}</style>
    </div>
  );
};
 
export default LandingPage;
 