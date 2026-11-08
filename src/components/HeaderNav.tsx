import React from "react";
import { motion } from "motion/react";
import { 
  Sparkles, 
  Menu,
  Clock,
  Calendar,
  CheckSquare,
  BookOpen,
  MapPin,
  GraduationCap,
  Layers,
  Bell,
  CreditCard,
  ChevronRight
} from "lucide-react";
import { ActiveTab, AttendanceRecord, Announcement, FeeItem, StudentAcademicProfile } from "../types";
import { useAuth } from "../firebase/authContext";
import { PersonPortrait } from "./PersonPortrait";
import { getRealtimeGreeting, getAccountHolderName } from "../utils";

interface HeaderNavProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenCopilot: (presetPrompt?: string) => void;
  attendance: AttendanceRecord[];
  announcements: Announcement[];
  fees: FeeItem;
  onToggleMobileNav?: () => void;
  academicProfile: StudentAcademicProfile;
  onOpenAcademicProfile: () => void;
  onOpenAuthModal: () => void;
}

const tabTitles: Record<ActiveTab, { title: string; subtitle: string; icon: React.ComponentType<{ className?: string }> }> = {
  today: { title: "Today's Schedule", subtitle: "Overview & Active Priorities", icon: Clock },
  schedule: { title: "Timetable & Calendar", subtitle: "Weekly Class Schedule", icon: Calendar },
  tasks: { title: "Tasks & Assignments", subtitle: "Deadlines & Submissions", icon: CheckSquare },
  notes: { title: "Smart Study Notes", subtitle: "AI Vault & Documents", icon: BookOpen },
  campus: { title: "Campus Map & Venues", subtitle: "Room Finder & Navigation", icon: MapPin },
  attendance: { title: "Attendance Tracker", subtitle: "75% Minimum Criteria Rule", icon: GraduationCap },
  exams: { title: "Exams & Mid-Terms", subtitle: "Dates, Locations & Weights", icon: Layers },
  announcements: { title: "Department Notices", subtitle: "Official Broadcasts", icon: Bell },
  fees: { title: "Semester Fees", subtitle: "Receipts & Installments", icon: CreditCard },
};

export const HeaderNav: React.FC<HeaderNavProps> = ({
  activeTab,
  setActiveTab,
  onOpenCopilot,
  attendance,
  announcements,
  fees,
  onToggleMobileNav,
  academicProfile,
  onOpenAcademicProfile,
  onOpenAuthModal,
}) => {
  const { user } = useAuth();

  const greeting = getRealtimeGreeting();
  const accountHolder = getAccountHolderName(user);

  const currentTabInfo = tabTitles[activeTab] || tabTitles.today;
  const TabIcon = currentTabInfo.icon;

  const lowAttendance = attendance.find((a) => (a.attended / a.total) * 100 < 75);
  const unreadAnnouncements = announcements.filter((a) => !a.read).length;

  return (
    <header className="sticky top-0 z-30 w-full px-3 sm:px-6 lg:px-8 py-2.5 backdrop-blur-md bg-[#F2F4F7]/95 border-b border-slate-200/80 shadow-xs transition-colors gpu-accelerated">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Left: Mobile Drawer Toggle & Active Section Breadcrumb */}
        <div className="flex items-center gap-3 min-w-0">
          {/* Mobile Menu Toggle (Opens Left Vertical Drawer) */}
          <motion.button
            id="mobile-nav-toggle-btn"
            type="button"
            onClick={onToggleMobileNav}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.92 }}
            transition={{ type: "spring", stiffness: 500, damping: 28 }}
            className="md:hidden p-2 rounded-2xl bg-white/95 hover:bg-white text-slate-800 border border-slate-200/80 shadow-xs transition-colors cursor-pointer shrink-0"
            aria-label="Open Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </motion.button>

          {/* Desktop & Mobile Current Active Breadcrumb */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100/80 flex items-center justify-center text-indigo-600 shadow-xs hidden sm:flex shrink-0">
              <TabIcon className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-900 tracking-tight truncate">
                  {currentTabInfo.title}
                </span>
                <span className="hidden lg:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-medium border border-emerald-200/60 shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live
                </span>
              </div>
              <span className="text-[11px] text-slate-500 hidden sm:block truncate">
                {currentTabInfo.subtitle}
              </span>
            </div>
          </div>
        </div>

        {/* Center / Status Pills (Desktop) */}
        <div className="hidden xl:flex items-center gap-2 text-xs">
          {lowAttendance && (
            <motion.button
              type="button"
              onClick={() => setActiveTab("attendance")}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 500, damping: 28 }}
              className="flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 shadow-xs transition-colors cursor-pointer"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
              <span className="font-semibold text-[11px]">{lowAttendance.course}: {Math.round((lowAttendance.attended / lowAttendance.total) * 100)}%</span>
            </motion.button>
          )}

          {unreadAnnouncements > 0 && (
            <motion.button
              type="button"
              onClick={() => setActiveTab("announcements")}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 500, damping: 28 }}
              className="flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 shadow-xs transition-colors cursor-pointer"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              <span className="font-semibold text-[11px]">{unreadAnnouncements} Unread Notices</span>
            </motion.button>
          )}
        </div>

        {/* Right Actions: Academic Profile Badge + Real-time Greeting + Person Portrait in Colour + Copilot */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0 min-w-0">
          {/* Dynamic Academic Profile Switcher Badge */}
          <motion.button
            id="header-academic-profile-btn"
            type="button"
            onClick={onOpenAcademicProfile}
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 500, damping: 28 }}
            className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-full bg-white/90 hover:bg-white border border-slate-200/90 text-slate-800 shadow-xs hover:shadow-md transition-colors cursor-pointer group shrink-0"
            title="Click to switch or customize your enrolled academic programme"
          >
            <div className="w-5 h-5 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
              <GraduationCap className="w-3 h-3" />
            </div>
            <div className="text-left leading-none hidden sm:block">
              <span className="text-[9px] uppercase tracking-wider text-indigo-600 font-bold block">
                {academicProfile.programme} • {academicProfile.section}
              </span>
              <span className="text-xs font-bold text-slate-800 truncate max-w-[130px] lg:max-w-[170px] block mt-0.5">
                {academicProfile.branch}
              </span>
            </div>
            <span className="sm:hidden text-xs font-bold text-indigo-600">
              {academicProfile.branch.slice(0, 3)}
            </span>
          </motion.button>

          {/* Ask Copilot Quick Button */}
          <motion.button
            id="header-copilot-btn"
            type="button"
            onClick={() => onOpenCopilot()}
            whileHover={{ scale: 1.04, y: -1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 500, damping: 28 }}
            className="group relative flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-full bg-slate-900 hover:bg-indigo-950 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer border border-indigo-500/30 shrink-0"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <Sparkles className="w-3.5 h-3.5 text-indigo-300 group-hover:rotate-12 transition-transform" />
            <span className="hidden sm:inline">Copilot AI</span>
          </motion.button>

          {/* Account Profile / Sign In Button with Person Portrait in Colour (Elevated to top-level viewport without clipping) */}
          <motion.button
            id="header-profile-badge"
            type="button"
            onClick={onOpenAuthModal}
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 500, damping: 28 }}
            className="flex items-center gap-1.5 sm:gap-2 p-1 sm:pl-3 pr-1.5 rounded-full border shadow-xs transition-colors cursor-pointer bg-white/95 hover:bg-white border-slate-200/90 text-slate-800 hover:shadow-md shrink-0"
            title={user ? `Signed in as ${accountHolder}` : "Sign in to your account"}
          >
            <div className="text-right hidden sm:block">
              <div className="flex items-center justify-end gap-1">
                <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">
                  {greeting}
                </span>
                <span className={`w-1.5 h-1.5 rounded-full ${user ? "bg-emerald-500 animate-pulse" : "bg-indigo-400"}`} />
              </div>
              <p className="text-xs font-bold text-slate-800 truncate max-w-[100px] lg:max-w-[120px]">
                {accountHolder}
              </p>
            </div>

            {/* Person Portrait in Colour */}
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt={accountHolder}
                className="w-7 h-7 rounded-full object-cover border border-indigo-500/40 shadow-xs"
              />
            ) : (
              <PersonPortrait size={28} className="border border-indigo-100" />
            )}
          </motion.button>
        </div>
      </div>
    </header>
  );
};
