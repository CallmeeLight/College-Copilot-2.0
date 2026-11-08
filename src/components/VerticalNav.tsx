import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Clock, 
  Calendar, 
  CheckSquare, 
  BookOpen, 
  MapPin, 
  GraduationCap, 
  Layers, 
  Bell, 
  CreditCard, 
  Sparkles, 
  ChevronRight, 
  MousePointer2, 
  X 
} from "lucide-react";
import { ActiveTab, AttendanceRecord, Announcement, FeeItem, StudentAcademicProfile } from "../types";
import { useAuth } from "../firebase/authContext";
import { PersonPortrait } from "./PersonPortrait";
import { getRealtimeGreeting, getAccountHolderName } from "../utils";

interface VerticalNavProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  attendance?: AttendanceRecord[];
  announcements?: Announcement[];
  fees?: FeeItem;
  onOpenCopilot: (presetPrompt?: string) => void;
  onOpenAuthModal: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
  academicProfile?: StudentAcademicProfile;
  onOpenAcademicProfile?: () => void;
}

interface NavItemConfig {
  id: ActiveTab;
  label: string;
  sublabel?: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  badgeStyle?: string;
}

export const VerticalNav: React.FC<VerticalNavProps> = ({
  activeTab,
  setActiveTab,
  attendance = [],
  announcements = [],
  fees,
  onOpenCopilot,
  onOpenAuthModal,
  isMobileOpen = false,
  onCloseMobile,
  academicProfile,
  onOpenAcademicProfile,
}) => {
  const { user } = useAuth();
  const greeting = getRealtimeGreeting();
  const accountHolder = getAccountHolderName(user);

  // Dynamic alerts
  const lowAttendanceCount = attendance.filter((a) => (a.attended / a.total) * 100 < 75).length;
  const unreadAnnouncementsCount = announcements.filter((a) => !a.read).length;

  const navItems: NavItemConfig[] = [
    { 
      id: "today", 
      label: "Today", 
      sublabel: "Overview & Schedule",
      icon: Clock 
    },
    { 
      id: "schedule", 
      label: "Schedule", 
      sublabel: "Weekly Timetable",
      icon: Calendar 
    },
    { 
      id: "tasks", 
      label: "Tasks", 
      sublabel: "Assignments & Labs",
      icon: CheckSquare 
    },
    { 
      id: "notes", 
      label: "Notes", 
      sublabel: "Smart Study Vault",
      icon: BookOpen 
    },
    { 
      id: "campus", 
      label: "Campus Map", 
      sublabel: "Interactive Venues",
      icon: MapPin 
    },
    { 
      id: "attendance", 
      label: "Attendance", 
      sublabel: "75% Minimum Rule",
      icon: GraduationCap,
      badge: lowAttendanceCount > 0 ? "71% Low" : undefined,
      badgeStyle: "bg-rose-500/20 text-rose-300 border-rose-500/30"
    },
    { 
      id: "exams", 
      label: "Exams", 
      sublabel: "Dates & Syllabus",
      icon: Layers,
      badge: "Nov '26",
      badgeStyle: "bg-white/10 text-slate-300 border-white/10"
    },
    { 
      id: "announcements", 
      label: "Announcements", 
      sublabel: "Official Notices",
      icon: Bell,
      badge: unreadAnnouncementsCount > 0 ? `${unreadAnnouncementsCount} New` : undefined,
      badgeStyle: "bg-amber-500/20 text-amber-300 border-amber-500/30 font-bold"
    },
    { 
      id: "fees", 
      label: "Semester Fees", 
      sublabel: "Dues & Receipts",
      icon: CreditCard,
      badge: fees && fees.status === "pending" ? `${fees.daysRemaining}d left` : undefined,
      badgeStyle: "bg-sky-500/20 text-sky-300 border-sky-500/30"
    },
  ];

  const handleSelectTab = (id: ActiveTab) => {
    setActiveTab(id);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  const navContent = (
    <div className="h-full flex flex-col justify-between text-slate-100 select-none">
      {/* 1. Brand & Header Area (Matching Theme Colors) */}
      <div className="p-5 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-indigo-600/30 text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm tracking-tight text-white">
                  College Copilot
                </span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded-md bg-indigo-500/15 text-indigo-300 border border-indigo-500/25 font-bold">
                  v2.5
                </span>
              </div>
              <span className="block text-[11px] text-slate-400 font-medium mt-0.5">
                {academicProfile ? `${academicProfile.programme} • ${academicProfile.section}` : "Semester 5 • Tech & Bio"}
              </span>
            </div>
          </div>

          {/* Mobile close button with motion animation */}
          {onCloseMobile && (
            <motion.button
              id="sidebar-close-mobile-btn"
              onClick={onCloseMobile}
              whileHover={{ rotate: 90, scale: 1.05 }}
              whileTap={{ scale: 0.9 }}
              className="md:hidden p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 transition-colors cursor-pointer"
              aria-label="Close menu"
            >
              <X className="w-4 h-4" />
            </motion.button>
          )}
        </div>

        {/* Specular divider line */}
        <div className="mt-4 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/25 to-transparent" />
      </div>

      {/* 2. All Navigation Options (Vertical with Names beside Icons and Spring Transitions) */}
      <div className="flex-1 overflow-y-auto px-3.5 py-2 space-y-1.5 custom-scrollbar">
        <div className="px-3 pb-1.5 text-[10px] uppercase tracking-wider font-mono text-slate-400 font-semibold flex items-center justify-between">
          <span>Main Navigation</span>
          <span className="text-indigo-400 font-bold">9 Views</span>
        </div>

        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const ItemIcon = item.icon;

          return (
            <motion.button
              key={item.id}
              id={`vertical-nav-tab-${item.id}`}
              role="tab"
              aria-selected={isActive}
              onClick={() => handleSelectTab(item.id)}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full group relative flex items-center justify-between px-3.5 py-2.5 rounded-2xl transition-all cursor-pointer ${
                isActive
                  ? "text-white"
                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/40"
              }`}
            >
              {/* Active Pill Gliding Background (Spring animated with layoutId) */}
              {isActive && (
                <motion.div
                  layoutId="vertical-nav-active-pill"
                  className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-950/90 via-slate-900/90 to-slate-900/95 border border-indigo-500/40 shadow-lg shadow-indigo-950/60 overflow-hidden"
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 32,
                    mass: 0.8,
                  }}
                >
                  {/* Left glowing indigo socket bead */}
                  <div className="absolute top-1/2 -translate-y-1/2 left-0 w-1.5 h-6 rounded-r-full bg-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.9)]" />
                  {/* Internal ambient indigo sheen */}
                  <div className="absolute -left-4 -top-8 w-24 h-24 bg-indigo-500/15 rounded-full blur-xl pointer-events-none" />
                  {/* Specular top highlight */}
                  <div className="absolute top-0 inset-x-3 h-[1px] bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />
                </motion.div>
              )}

              {/* Left: Icon + Menu Name beside it */}
              <div className="relative z-10 flex items-center gap-3">
                {/* Elevated Indigo Theme Bubble for Active Icon */}
                <motion.div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
                    isActive 
                      ? "shadow-md shadow-indigo-600/40 text-white" 
                      : "text-slate-400 group-hover:text-white group-hover:scale-105"
                  }`}
                  style={
                    isActive ? {
                      background: "radial-gradient(circle at 35% 30%, #818cf8 0%, #6366f1 55%, #4f46e5 100%)",
                      boxShadow: "0 0 16px rgba(99, 102, 241, 0.6), inset 0 1px 2px rgba(255, 255, 255, 0.4)",
                    } : undefined
                  }
                  animate={isActive ? { scale: [1, 1.06, 1] } : { scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <ItemIcon className="w-4 h-4 stroke-[2]" />
                </motion.div>

                {/* Name of the menu beside it */}
                <div className="text-left">
                  <span className={`text-xs block tracking-tight font-semibold transition-colors ${
                    isActive ? "text-white font-bold" : "text-slate-300 group-hover:text-white"
                  }`}>
                    {item.label}
                  </span>
                  <span className="text-[10px] text-slate-500 block leading-tight font-medium">
                    {item.sublabel}
                  </span>
                </div>
              </div>

              {/* Right: Badges or active indicator */}
              <div className="relative z-10 flex items-center gap-2">
                {item.badge && (
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${item.badgeStyle || "bg-white/10 text-slate-300 border-white/10"}`}>
                    {item.badge}
                  </span>
                )}

                {isActive ? (
                  <MousePointer2 className="w-3.5 h-3.5 fill-indigo-400 text-indigo-400 rotate-[-15deg] drop-shadow-sm" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* 3. Bottom Area: Real-Time Greeting, Account Holder, and Person Portrait in Colour */}
      <div className="p-3.5 border-t border-slate-800/90 bg-slate-950/70 backdrop-blur-md">
        {/* Ask Copilot Button in Sidebar - Only rendered when user is authenticated */}
        {user && (
          <motion.button
            id="sidebar-copilot-btn"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              onOpenCopilot();
              if (onCloseMobile) onCloseMobile();
            }}
            className="w-full flex items-center justify-between px-3.5 py-2.5 mb-3 rounded-2xl bg-gradient-to-r from-indigo-900/60 via-indigo-950/70 to-slate-900/80 hover:from-indigo-900/80 hover:to-slate-800/90 border border-indigo-500/30 text-indigo-200 hover:text-white shadow-lg shadow-indigo-950/40 text-xs font-semibold transition-all group cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm shadow-indigo-500/50 group-hover:rotate-12 transition-transform">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <span>Ask AI Copilot</span>
            </div>
          </motion.button>
        )}

        {/* Account Holder Profile / Sign-in Card with Colourful Person Portrait */}
        <motion.button
          id="sidebar-account-btn"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            onOpenAuthModal();
            if (onCloseMobile) onCloseMobile();
          }}
          className="w-full flex items-center justify-between p-2.5 rounded-2xl bg-slate-800/40 hover:bg-slate-800/70 border border-slate-700/50 transition-all cursor-pointer text-left group"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            {/* Person Portrait in Colour */}
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName || "Student"}
                className="w-9 h-9 rounded-full object-cover border border-indigo-500/40 shadow-sm"
              />
            ) : (
              <PersonPortrait size={36} className="border border-indigo-500/30" />
            )}

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] uppercase font-mono tracking-wider text-indigo-400 font-bold">
                  {greeting}
                </span>
              </div>
              <p className="text-xs font-bold text-white truncate group-hover:text-indigo-300 transition-colors">
                {accountHolder}
              </p>
              <span className="text-[10px] text-slate-400 block truncate">
                {user ? (user.email || "Active Session") : "Tap to Sign In"}
              </span>
            </div>
          </div>

          <div className="p-1.5 rounded-xl bg-white/5 text-slate-400 group-hover:text-white group-hover:bg-white/10 transition-colors">
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </motion.button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Vertical Navigation (Fixed on the left side of the screen with matching Slate & Indigo theme) */}
      <aside 
        id="desktop-vertical-nav"
        className="hidden md:flex fixed top-0 left-0 bottom-0 w-64 lg:w-72 z-30 flex-col bg-gradient-to-b from-slate-900 via-[#0f172a] to-[#090d16] border-r border-slate-800/80 shadow-2xl shadow-black/80"
      >
        {/* Top ambient specular line */}
        <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent pointer-events-none" />
        {navContent}
      </aside>

      {/* Mobile Slide-in Drawer Navigation (Animated with hardware-accelerated AnimatePresence slide and fade) */}
      <AnimatePresence>
        {isMobileOpen && (
          <div className="md:hidden fixed inset-0 z-50 flex">
            {/* Backdrop with smooth fade */}
            <motion.div 
              key="mobile-sidebar-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm"
              onClick={onCloseMobile}
            />
            {/* Sliding Vertical Menu Container */}
            <motion.aside
              key="mobile-sidebar-panel"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 360, damping: 33 }}
              className="relative w-80 max-w-[85vw] h-full bg-gradient-to-b from-slate-900 via-[#0f172a] to-[#090d16] border-r border-slate-800/90 shadow-2xl z-10 flex flex-col overflow-hidden"
            >
              {/* Top ambient specular line */}
              <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent pointer-events-none" />
              {navContent}
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
