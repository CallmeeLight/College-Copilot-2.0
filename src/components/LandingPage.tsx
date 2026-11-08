import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, 
  ArrowRight, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  BookOpen, 
  FileText, 
  Bot, 
  ShieldCheck, 
  ChevronDown, 
  GraduationCap, 
  MapPin, 
  Zap, 
  Layers, 
  Compass, 
  Award,
  Users,
  Search,
  Check
} from "lucide-react";

interface LandingPageProps {
  onNavigateAuth: () => void;
  onNavigateAppDirect: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigateAuth,
  onNavigateAppDirect,
}) => {
  const [scrolledPastHero, setScrolledPastHero] = useState(false);
  const [activePreviewTab, setActivePreviewTab] = useState<"timetable" | "copilot" | "attendance" | "tasks">("timetable");

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setScrolledPastHero(true);
      } else {
        setScrolledPastHero(false);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToPreview = () => {
    const el = document.getElementById("features-preview");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const features = [
    {
      id: "timetable",
      title: "Smart Timetable",
      badge: "Real-time",
      icon: Calendar,
      color: "from-indigo-500 to-purple-500",
      description: "Official section-accurate schedule mapped room-by-room across all 12 academic sections.",
      highlights: ["Period-by-period tracking", "Lab & lecture distinctions", "Room & faculty locator"]
    },
    {
      id: "attendance",
      title: "Attendance Analytics",
      badge: "Safe-Margin Rings",
      icon: Clock,
      color: "from-emerald-500 to-teal-500",
      description: "Circular progress rings displaying live attendance percentages with margin-to-bunk calculations.",
      highlights: ["75% threshold guard", "Class bunk predictor", "Per-subject breakdown"]
    },
    {
      id: "tasks",
      title: "Assignments & Deadlines",
      badge: "Urgency Radar",
      icon: CheckCircle2,
      color: "from-amber-500 to-orange-500",
      description: "Prioritized task tracking with estimated time budgets, submission countdowns, and completion logs.",
      highlights: ["Due-today alerts", "Time estimation", "Course-linked tags"]
    },
    {
      id: "exams",
      title: "Exam & Syllabus Planner",
      badge: "Weightage Track",
      icon: Award,
      color: "from-rose-500 to-pink-500",
      description: "Comprehensive exam schedules with venue locators, weightage insights, and syllabus checkpoints.",
      highlights: ["Hall venue directory", "Syllabus topic tracker", "Midterm & finals readiness"]
    },
    {
      id: "notes",
      title: "Notes & Document Vault",
      badge: "Smart Reader",
      icon: FileText,
      color: "from-cyan-500 to-blue-500",
      description: "Upload PDFs, exam notes, and lecture materials with instant executive summaries and key equations.",
      highlights: ["PDF & image support", "Equation extractor", "Exam question generator"]
    },
    {
      id: "copilot",
      title: "AI Academic Copilot",
      badge: "Section Aware",
      icon: Bot,
      color: "from-purple-500 to-indigo-600",
      description: "Universal campus intelligence that knows your exact section, faculty, classroom, and semester timetable.",
      highlights: ["Multimodal note solver", "Section-specific answers", "Instant concept analogies"]
    }
  ];

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 font-sans selection:bg-indigo-500/30 selection:text-indigo-200 relative overflow-x-hidden">
      {/* Ambient background glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[900px] h-[550px] bg-gradient-to-b from-indigo-600/15 via-purple-600/10 to-transparent blur-[120px] rounded-full" />
        <div className="absolute top-[35%] left-[-10%] w-[500px] h-[500px] bg-cyan-500/10 blur-[130px] rounded-full" />
        <div className="absolute top-[60%] right-[-10%] w-[600px] h-[600px] bg-purple-600/10 blur-[140px] rounded-full" />
        {/* Subtle grid mesh */}
        <div 
          className="absolute inset-0 opacity-[0.03]" 
          style={{ 
            backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)`, 
            backgroundSize: '32px 32px' 
          }} 
        />
      </div>

      {/* Floating CTA bar when user scrolls down */}
      <AnimatePresence>
        {scrolledPastHero && (
          <motion.div 
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="fixed bottom-6 inset-x-0 mx-auto w-fit z-50 px-4"
          >
            <div className="bg-slate-900/90 backdrop-blur-2xl border border-indigo-500/40 shadow-[0_20px_50px_rgba(79,70,229,0.3)] rounded-full px-5 py-2.5 flex items-center gap-4">
              <div className="flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-medium text-slate-300 hidden sm:inline">Ready to enter your campus hub?</span>
              </div>
              <button
                type="button"
                onClick={onNavigateAuth}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white text-xs font-semibold tracking-wide transition-all duration-300 shadow-md shadow-indigo-500/25 cursor-pointer active:scale-95"
              >
                <span>Enter College Copilot</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navbar */}
      <header className="relative z-20 border-b border-white/[0.06] backdrop-blur-md bg-[#07090E]/60 sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 ring-1 ring-white/20">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base tracking-tight text-white">College Copilot</span>
                <span className="px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  v2.0
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Intelligent Student Academic OS</p>
            </div>
          </div>

          {/* Minimal Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-medium text-slate-300">
            <a href="#features-preview" className="hover:text-white transition-colors">Features</a>
            <a href="#dashboard-preview" className="hover:text-white transition-colors">Interface Preview</a>
            <a href="#academic-branches" className="hover:text-white transition-colors">Supported Branches</a>
          </nav>

          {/* Action buttons */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onNavigateAuth}
              className="text-xs font-medium text-slate-300 hover:text-white px-3.5 py-2 rounded-xl hover:bg-white/[0.05] transition-colors cursor-pointer"
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={onNavigateAuth}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white text-xs font-semibold transition-all duration-300 shadow-md shadow-indigo-500/20 cursor-pointer active:scale-95"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Landing Content */}
      <main className="relative z-10">
        {/* 1. Hero Section */}
        <section className="pt-20 pb-20 sm:pt-28 sm:pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Subtle pill tag */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium mb-8"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Next-Generation Student Academic Companion</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.12]"
          >
            Your Campus. Your Schedule.{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-cyan-300 bg-clip-text text-transparent">
              Your Copilot.
            </span>
          </motion.h1>

          {/* Supporting Text */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed"
          >
            Seamlessly navigate your university life with section-specific Monday–Friday timetables, 
            circular attendance health rings, live task urgency radar, and an AI tutor grounded in your exact classroom data.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
          >
            <button
              type="button"
              onClick={onNavigateAuth}
              className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-600 to-indigo-600 hover:from-indigo-400 hover:to-purple-500 text-white text-sm font-semibold tracking-wide transition-all duration-300 shadow-xl shadow-indigo-500/25 flex items-center gap-2.5 cursor-pointer active:scale-95 group"
            >
              <span>Enter College Copilot</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              type="button"
              onClick={scrollToPreview}
              className="px-6 py-3.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-300 hover:text-white text-sm font-medium transition-all duration-300 flex items-center gap-2 cursor-pointer"
            >
              <span>Explore Features</span>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>
          </motion.div>

          {/* Key Stat Badges */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-16 pt-8 border-t border-white/[0.06] grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
          >
            <div>
              <div className="text-2xl font-bold text-white tracking-tight">12</div>
              <div className="text-xs text-slate-400 mt-1">Official Sections Supported</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white tracking-tight">100%</div>
              <div className="text-xs text-slate-400 mt-1">Room & Faculty Accurate</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white tracking-tight">75%</div>
              <div className="text-xs text-slate-400 mt-1">Attendance Safety Guard</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white tracking-tight">Real-Time</div>
              <div className="text-xs text-slate-400 mt-1">Cloud Sync & Persistence</div>
            </div>
          </motion.div>
        </section>

        {/* 2. Interactive Dashboard Preview Section */}
        <section id="dashboard-preview" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-indigo-400">Interface Preview</h2>
            <p className="mt-2 text-2xl sm:text-3xl font-bold text-white">Experience the Liquid-Glass Student Dashboard</p>
          </div>

          {/* Interactive Window Preview */}
          <div className="rounded-3xl border border-white/[0.1] bg-slate-900/60 backdrop-blur-2xl p-4 sm:p-6 shadow-[0_30px_90px_rgba(0,0,0,0.6)] relative overflow-hidden">
            {/* Top Browser / OS Bar */}
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="ml-3 text-xs font-mono text-slate-400 hidden sm:inline">college-copilot.app/dashboard</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/[0.05] p-1 rounded-xl text-xs">
                {(["timetable", "attendance", "tasks", "copilot"] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActivePreviewTab(tab)}
                    className={`px-3 py-1 rounded-lg font-medium capitalize transition-all cursor-pointer ${
                      activePreviewTab === tab 
                        ? "bg-indigo-600 text-white shadow-xs" 
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Preview Body depending on active tab */}
            <div className="min-h-[380px] bg-slate-950/70 rounded-2xl border border-white/[0.06] p-5 sm:p-6">
              {activePreviewTab === "timetable" && (
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                    <div>
                      <div className="text-xs font-semibold text-indigo-400 uppercase tracking-wide">Today's Class Schedule</div>
                      <div className="text-lg font-bold text-white">Monday • 6 Academic Periods</div>
                    </div>
                    <div className="flex items-center gap-2 text-xs bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-3 py-1.5 rounded-xl">
                      <GraduationCap className="w-3.5 h-3.5" />
                      <span>Section 1 • Room EB-101</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-indigo-500/40 transition-colors">
                      <div className="flex justify-between items-center text-xs text-slate-400 mb-2">
                        <span className="font-mono">09:30 – 10:30</span>
                        <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-semibold text-[10px]">Lecture</span>
                      </div>
                      <div className="font-semibold text-white text-sm">Engineering Mathematics-I</div>
                      <div className="text-xs text-slate-400 mt-1 flex items-center justify-between">
                        <span>Dr. Bhuvnesh</span>
                        <span className="font-mono text-indigo-300">EB-101</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-indigo-500/40 transition-colors">
                      <div className="flex justify-between items-center text-xs text-slate-400 mb-2">
                        <span className="font-mono">10:30 – 11:30</span>
                        <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-semibold text-[10px]">Lab</span>
                      </div>
                      <div className="font-semibold text-white text-sm">Python Programming Lab</div>
                      <div className="text-xs text-slate-400 mt-1 flex items-center justify-between">
                        <span>Dr. Priya Nair</span>
                        <span className="font-mono text-purple-300">Lab 3</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-indigo-500/40 transition-colors">
                      <div className="flex justify-between items-center text-xs text-slate-400 mb-2">
                        <span className="font-mono">11:30 – 12:30</span>
                        <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-semibold text-[10px]">Lecture</span>
                      </div>
                      <div className="font-semibold text-white text-sm">Applied Physics</div>
                      <div className="text-xs text-slate-400 mt-1 flex items-center justify-between">
                        <span>Dr. R. Sharma</span>
                        <span className="font-mono text-indigo-300">EB-101</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activePreviewTab === "attendance" && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wide">Attendance Health Radar</div>
                      <div className="text-lg font-bold text-white">Minimum 75% Requirement Guardian</div>
                    </div>
                    <div className="text-xs text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl font-medium">
                      All Courses in Safe Zone
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center gap-4">
                      {/* Circular ring preview */}
                      <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
                        <svg className="w-14 h-14 -rotate-90">
                          <circle cx="28" cy="28" r="23" stroke="currentColor" strokeWidth="4" className="text-slate-800" fill="transparent" />
                          <circle cx="28" cy="28" r="23" stroke="currentColor" strokeWidth="4" strokeDasharray="144" strokeDashoffset="20" strokeLinecap="round" className="text-emerald-400" fill="transparent" />
                        </svg>
                        <span className="absolute text-xs font-bold text-white">86%</span>
                      </div>
                      <div>
                        <div className="font-semibold text-white text-sm">Engineering Mathematics</div>
                        <div className="text-xs text-slate-400 mt-0.5">24 / 28 Attended</div>
                        <div className="text-[11px] text-emerald-400 font-medium mt-1">+3 classes bunk margin</div>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center gap-4">
                      <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
                        <svg className="w-14 h-14 -rotate-90">
                          <circle cx="28" cy="28" r="23" stroke="currentColor" strokeWidth="4" className="text-slate-800" fill="transparent" />
                          <circle cx="28" cy="28" r="23" stroke="currentColor" strokeWidth="4" strokeDasharray="144" strokeDashoffset="31" strokeLinecap="round" className="text-emerald-400" fill="transparent" />
                        </svg>
                        <span className="absolute text-xs font-bold text-white">78%</span>
                      </div>
                      <div>
                        <div className="font-semibold text-white text-sm">Python Programming</div>
                        <div className="text-xs text-slate-400 mt-0.5">18 / 23 Attended</div>
                        <div className="text-[11px] text-amber-400 font-medium mt-1">Must attend next 2</div>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center gap-4">
                      <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
                        <svg className="w-14 h-14 -rotate-90">
                          <circle cx="28" cy="28" r="23" stroke="currentColor" strokeWidth="4" className="text-slate-800" fill="transparent" />
                          <circle cx="28" cy="28" r="23" stroke="currentColor" strokeWidth="4" strokeDasharray="144" strokeDashoffset="12" strokeLinecap="round" className="text-emerald-400" fill="transparent" />
                        </svg>
                        <span className="absolute text-xs font-bold text-white">91%</span>
                      </div>
                      <div>
                        <div className="font-semibold text-white text-sm">Applied Physics</div>
                        <div className="text-xs text-slate-400 mt-0.5">21 / 23 Attended</div>
                        <div className="text-[11px] text-emerald-400 font-medium mt-1">+4 classes bunk margin</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activePreviewTab === "tasks" && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <div className="text-xs font-semibold text-amber-400 uppercase tracking-wide">Tasks & Assignments</div>
                      <div className="text-lg font-bold text-white">Upcoming Submissions</div>
                    </div>
                    <div className="text-xs text-amber-300 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-xl font-medium">
                      2 Due Today
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-md border border-amber-400/50 bg-amber-400/10 flex items-center justify-center text-amber-400 text-xs">!</div>
                        <div>
                          <div className="font-medium text-white text-sm">Problem Set 4: Eigenvalues & Vectors</div>
                          <div className="text-xs text-slate-400">Engineering Mathematics • Est. 45 mins</div>
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg">Today, 23:59</span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-md border border-indigo-400/50 bg-indigo-400/10 flex items-center justify-center text-indigo-400 text-xs">2</div>
                        <div>
                          <div className="font-medium text-white text-sm">Lab Report 3: Oscilloscope Calibration</div>
                          <div className="text-xs text-slate-400">Physics Lab • Est. 60 mins</div>
                        </div>
                      </div>
                      <span className="text-xs font-medium text-slate-400 bg-white/[0.04] px-2.5 py-1 rounded-lg">Tomorrow</span>
                    </div>
                  </div>
                </div>
              )}

              {activePreviewTab === "copilot" && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white">
                        <Bot className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">College Copilot AI</div>
                        <div className="text-[11px] text-emerald-400">Section 1 Grounded • Online</div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 font-sans text-xs">
                    <div className="bg-indigo-600/20 border border-indigo-500/30 rounded-2xl p-3.5 max-w-md ml-auto text-indigo-100">
                      "What classroom is my Python Lab in today and who is my teacher?"
                    </div>
                    <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-3.5 max-w-lg text-slate-200">
                      <p className="font-semibold text-indigo-300 mb-1">Section 1 Schedule Confirmation:</p>
                      <p>Your Python Programming Lab is held in <strong>Lab 3</strong> from <strong>10:30 AM to 11:30 AM</strong>. Your faculty in-charge is <strong>Dr. Priya Nair</strong>.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 3. Features Section */}
        <section id="features-preview" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-indigo-400">Engineered for Academic Excellence</h2>
            <p className="mt-3 text-3xl sm:text-4xl font-extrabold text-white">Everything You Need To Ace College Life</p>
            <p className="mt-4 text-slate-300 text-sm sm:text-base">
              Say goodbye to scattered WhatsApp PDFs, messy spreadsheets, and missed deadlines.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat) => {
              const IconComp = feat.icon;
              return (
                <div 
                  key={feat.id}
                  className="rounded-3xl p-6 bg-slate-900/50 backdrop-blur-xl border border-white/[0.07] hover:border-indigo-500/40 hover:bg-slate-900/80 transition-all duration-300 group"
                >
                  <div className="flex items-center justify-between mb-5">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${feat.color} flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform`}>
                      <IconComp className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-semibold tracking-wide text-slate-300 bg-white/[0.06] px-2.5 py-1 rounded-full border border-white/[0.08]">
                      {feat.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                    {feat.title}
                  </h3>
                  <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                    {feat.description}
                  </p>

                  <div className="mt-5 pt-4 border-t border-white/[0.05] space-y-2">
                    {feat.highlights.map((h, i) => (
                      <div key={i} className="flex items-center gap-2 text-[11px] text-slate-300">
                        <Check className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 4. Supported Academic Branches */}
        <section id="academic-branches" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-white/[0.08] bg-gradient-to-b from-indigo-950/20 via-slate-900/40 to-slate-950 p-8 sm:p-12 text-center">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-indigo-400">Multi-Programme Ready</h2>
            <h3 className="mt-2 text-2xl sm:text-3xl font-bold text-white">Configured for Your Specific Department</h3>
            <p className="mt-3 text-slate-300 text-xs sm:text-sm max-w-xl mx-auto">
              Whether you are in Artificial Intelligence, Cyber Security, or Biomedical Engineering, College Copilot comes pre-calibrated with your exact room and faculty directories.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5 max-w-4xl mx-auto">
              {[
                "B.Tech AIML (Sec 1-4)",
                "B.Tech DSAI (Sec 6)",
                "B.Tech AIML + DSAI (Sec 5)",
                "Cyber Security & Cloud (Sec 7)",
                "CSE Core (Sec 8-10)",
                "Biomedical Engineering (Sec 11)",
                "CE / ME / EEE / ECE / Robotics (Sec 12)"
              ].map((b, i) => (
                <span 
                  key={i}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-200 bg-white/[0.04] border border-white/[0.08] hover:border-indigo-500/50 hover:bg-indigo-500/10 transition-colors"
                >
                  {b}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* 5. Big Bottom Entry Call-To-Action */}
        <section className="py-20 sm:py-28 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="relative rounded-3xl p-10 sm:p-16 border border-indigo-500/30 bg-gradient-to-b from-indigo-900/30 via-slate-900/80 to-slate-950 overflow-hidden shadow-2xl shadow-indigo-950/50">
            {/* Ambient burst behind CTA */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/20 blur-[90px] rounded-full pointer-events-none" />

            <div className="relative z-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-6 border border-indigo-500/30">
                <Sparkles className="w-3.5 h-3.5" />
                Live Cloud Sync Ready
              </span>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
                Step into a Smarter University Experience
              </h2>
              <p className="mt-4 text-slate-300 text-sm sm:text-base max-w-xl mx-auto">
                Join students already using College Copilot to streamline their schedules, assignments, and academic success.
              </p>

              <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={onNavigateAuth}
                  className="px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-600 to-indigo-600 hover:from-indigo-400 hover:to-purple-500 text-white text-sm font-semibold tracking-wide shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all duration-300 flex items-center gap-3 cursor-pointer active:scale-95 group"
                >
                  <span>Enter College Copilot</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-10 relative z-10 text-xs text-slate-500 text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-indigo-400" />
            <span className="text-slate-400 font-semibold">College Copilot</span>
            <span>— Intelligent Academic Companion</span>
          </div>
          <div>
            Built with modern student focus. Designed for seamless academic productivity.
          </div>
        </div>
      </footer>
    </div>
  );
};
