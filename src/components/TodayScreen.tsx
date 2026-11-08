import React, { useState, useMemo } from "react";
import { motion } from "motion/react";
import { 
  Sparkles, 
  MapPin, 
  AlertTriangle, 
  CheckCircle2, 
  Calendar, 
  ArrowRight, 
  TrendingUp, 
  Compass,
  Zap,
  Info,
  ChevronRight,
  GraduationCap,
  Clock,
  BookOpen
} from "lucide-react";
import { ScheduleEvent, Assignment, AttendanceRecord, FeeItem, ActiveTab, StudentAcademicProfile } from "../types";
import { AiFormattedText } from "./AiFormattedText";
import { useAuth } from "../firebase/authContext";
import { getRealtimeGreeting, getAccountHolderName } from "../utils";
import { FluidCheckbox } from "./FluidControls";

interface TodayScreenProps {
  scheduleEvents: ScheduleEvent[];
  assignments: Assignment[];
  attendance: AttendanceRecord[];
  feeItem: FeeItem;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenCopilot: (presetPrompt?: string) => void;
  onSelectCampusLocation: (codeOrName: string) => void;
  onToggleTaskComplete: (taskId: string) => void;
  academicProfile?: StudentAcademicProfile;
  onOpenAcademicProfile?: () => void;
}

export const TodayScreen: React.FC<TodayScreenProps> = ({
  scheduleEvents,
  assignments,
  attendance,
  feeItem,
  setActiveTab,
  onOpenCopilot,
  onSelectCampusLocation,
  onToggleTaskComplete,
  academicProfile,
  onOpenAcademicProfile,
}) => {
  // Current time simulation: Monday at 10:20 AM (Physics/Core class active in standard timetable)
  const simulatedHour = 10;
  const simulatedMinute = 20;
  const simulatedTotalMins = simulatedHour * 60 + simulatedMinute; // 620 mins

  // Helper to calculate total minutes from "HH:MM"
  const getMinutes = (timeStr: string) => {
    const [h, m] = timeStr.split(":").map(Number);
    return h * 60 + m;
  };

  // Filter Monday's events (representing today's actual schedule) and sort chronologically (memoized)
  const todayEvents = useMemo(() => {
    return scheduleEvents.filter((ev) => ev.day === "Monday");
  }, [scheduleEvents]);

  const sortedTodayEvents = useMemo(() => {
    return [...todayEvents].sort(
      (a, b) => getMinutes(a.startTime) - getMinutes(b.startTime)
    );
  }, [todayEvents]);

  // Dynamic Class Calculations (Never hard-coded, memoized)
  const nonBreakEvents = useMemo(() => {
    return sortedTodayEvents.filter(
      (ev) => ev.type !== "Break" && ev.type !== "Free"
    );
  }, [sortedTodayEvents]);

  const currentClass = useMemo(() => {
    return nonBreakEvents.find((ev) => {
      const start = getMinutes(ev.startTime);
      const end = getMinutes(ev.endTime);
      return simulatedTotalMins >= start && simulatedTotalMins <= end;
    });
  }, [nonBreakEvents, simulatedTotalMins]);

  const upcomingClasses = useMemo(() => {
    return nonBreakEvents.filter((ev) => {
      const start = getMinutes(ev.startTime);
      return start > simulatedTotalMins;
    });
  }, [nonBreakEvents, simulatedTotalMins]);

  const completedClasses = useMemo(() => {
    return nonBreakEvents.filter((ev) => {
      const end = getMinutes(ev.endTime);
      return simulatedTotalMins > end;
    });
  }, [nonBreakEvents, simulatedTotalMins]);

  const nextClass = upcomingClasses[0] || null;
  const totalClassesToday = nonBreakEvents.length;
  const remainingClassesCount = upcomingClasses.length;

  // Quick Action AI Answers
  const [activeBriefAction, setActiveBriefAction] = useState<string | null>(null);
  const [briefResponse, setBriefResponse] = useState<string | null>(null);
  const [isBriefLoading, setIsBriefLoading] = useState(false);

  const handleQuickBriefAction = async (actionText: string) => {
    setActiveBriefAction(actionText);
    setIsBriefLoading(true);
    setBriefResponse(null);

    try {
      const res = await fetch("/api/copilot/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: actionText,
          context: {
            screen: "today",
            programme: academicProfile ? `${academicProfile.programme} ${academicProfile.branch}` : "B.Tech",
            section: academicProfile ? academicProfile.section : "A",
            currentClass: currentClass ? `${currentClass.course} (${currentClass.startTime}-${currentClass.endTime} in ${currentClass.room})` : "None in session",
            nextClass: nextClass ? `${nextClass.course} (${nextClass.startTime}-${nextClass.endTime} in ${nextClass.room})` : "None",
            remainingCount: remainingClassesCount,
          },
        }),
      });
      const data = await res.json();
      setBriefResponse(data.reply);
    } catch {
      setBriefResponse(
        nextClass
          ? `Your next class is ${nextClass.course} in ${nextClass.room} with ${nextClass.faculty} at ${nextClass.startTime}. You have ${remainingClassesCount} classes left today.`
          : "You have completed all scheduled classes for today! Review pending assignments or prepare for upcoming exams."
      );
    } finally {
      setIsBriefLoading(false);
    }
  };

  // Lowest attendance check from real dynamic attendance (memoized)
  const { lowestAttendanceRecord, lowestAttendancePct } = useMemo(() => {
    const sorted = [...attendance].sort(
      (a, b) => (a.attended / a.total) - (b.attended / b.total)
    );
    const lowest = sorted[0];
    const pct = lowest 
      ? Math.round((lowest.attended / lowest.total) * 100) 
      : 75;
    return { lowestAttendanceRecord: lowest, lowestAttendancePct: pct };
  }, [attendance]);

  // Due today tasks (memoized)
  const dueTodayTasks = useMemo(() => {
    return assignments.filter((a) => a.dueCategory === "today");
  }, [assignments]);

  const dueSoonTasks = useMemo(() => {
    return assignments.filter((a) => a.dueCategory === "soon");
  }, [assignments]);

  const { user } = useAuth();
  const greeting = getRealtimeGreeting();
  const accountHolderName = getAccountHolderName(user);

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* 0. Student Academic Profile Banner (Dynamic label as requested) */}
      <div 
        id="today-academic-profile-banner"
        className="glass-tile flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5 p-4 rounded-2xl"
      >
        <div className="flex items-center gap-3">
          <div className="tile-icon-badge w-10 h-10 rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/30">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="tile-meta-label text-indigo-700 bg-white/80 px-2 py-0.5 rounded-full border border-indigo-200/70 shadow-2xs">
                Active Enrolment
              </span>
              <span className="text-xs font-mono text-slate-500 font-medium">
                Roll: {academicProfile?.studentRollNo || "RA2611003010042"}
              </span>
            </div>
            <p className="text-sm font-bold text-slate-900 mt-1 tracking-tight">
              {academicProfile 
                ? `${academicProfile.programme} ${academicProfile.branch} • ${academicProfile.year} • ${academicProfile.semester} • ${academicProfile.section}`
                : "B.Tech Biomedical Engineering • 1st Year • Sem 1 • Sec A"
              }
            </p>
          </div>
        </div>

        {onOpenAcademicProfile && (
          <motion.button
            id="switch-profile-today-banner-btn"
            type="button"
            onClick={onOpenAcademicProfile}
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 500, damping: 28 }}
            className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-white/80 hover:bg-white text-indigo-700 border border-indigo-200/90 shadow-2xs transition-colors cursor-pointer flex items-center gap-1.5 self-end sm:self-auto"
          >
            <span>Switch Programme / Section</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </motion.button>
        )}
      </div>

      {/* 1. Greeting Header */}
      <header className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-2">
        <div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-slate-900">
            {greeting}, <span className="font-semibold">{accountHolderName}</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-500 mt-1.5 font-medium">
            {remainingClassesCount > 0 
              ? `You have ${remainingClassesCount} classes remaining today & 4 academic priorities.`
              : `All classes completed for today! Great work.`
            }
          </p>
        </div>

        {/* Quick status pills */}
        <div className="flex flex-wrap items-center gap-3">
          {lowestAttendanceRecord && (
            <button
              id="today-attendance-quick-btn"
              onClick={() => setActiveTab("attendance")}
              className="glass-tile flex items-center gap-3 px-4 py-2 rounded-full cursor-pointer group"
            >
              <div className={`w-2.5 h-2.5 rounded-full ${lowestAttendancePct < 75 ? "bg-rose-500 animate-pulse" : "bg-emerald-500"}`} />
              <div className="text-left">
                <span className="tile-meta-label text-slate-400 block">Attendance</span>
                <span className={`text-xs font-bold tracking-tight ${lowestAttendancePct < 75 ? "text-rose-600" : "text-slate-800"}`}>
                  {lowestAttendanceRecord.course}: {lowestAttendancePct}%
                </span>
              </div>
            </button>
          )}

          <button
            id="today-fee-quick-btn"
            onClick={() => setActiveTab("fees")}
            className="glass-tile flex items-center gap-3 px-4 py-2 rounded-full cursor-pointer group"
          >
            <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
            <div className="text-left">
              <span className="tile-meta-label text-slate-400 block">Next Payment</span>
              <span className="text-xs font-bold tracking-tight text-slate-800">₹{feeItem.amount.toLocaleString()} <span className="text-rose-500 text-[10px] ml-1 font-mono font-bold">{feeItem.daysRemaining}d left</span></span>
            </div>
          </button>
        </div>
      </header>

      {/* Dynamic Class Status Cards (Next Class, Remaining Today, Status, Weekly Timetable) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Tile 1: Next Class Card (Glassmorphism Contextual Tile) */}
        <div className="glass-tile p-5 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="tile-meta-label text-indigo-600">Next Class</span>
            <div className="tile-icon-badge bg-indigo-50/90 text-indigo-600 border border-indigo-100/90">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="my-2.5">
            <h4 className="text-base sm:text-[17px] font-bold text-slate-900 tracking-tight truncate">
              {nextClass ? nextClass.course : "No More Classes"}
            </h4>
            <p className="text-xs text-slate-500 mt-1 font-medium truncate">
              {nextClass ? `${nextClass.startTime} – ${nextClass.endTime} • ${nextClass.room}` : "All classes wrapped up"}
            </p>
          </div>
          {nextClass ? (
            <button
              type="button"
              onClick={() => {
                onSelectCampusLocation(nextClass.room);
                setActiveTab("campus");
              }}
              className="mt-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1.5 transition-colors cursor-pointer group w-fit"
            >
              <MapPin className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
              <span>Route to {nextClass.room}</span>
            </button>
          ) : (
            <span className="text-[11px] text-slate-400 font-medium">Enjoy your evening</span>
          )}
        </div>

        {/* Tile 2: Classes Remaining Today (Glassmorphism Stat / Progress Tile with Varied Layout) */}
        <div className="glass-tile p-5 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="tile-meta-label text-slate-500">Remaining Today</span>
            <div className="tile-icon-badge bg-slate-100/90 text-slate-600 border border-slate-200/70">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="my-2">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900 font-mono tracking-tight">
                {remainingClassesCount}
              </span>
              <span className="text-xs font-semibold text-slate-400">
                of {totalClassesToday} classes
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1 font-medium">
              {completedClasses.length} completed &bull; {remainingClassesCount} left
            </p>
          </div>
          <div className="w-full bg-slate-200/70 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-indigo-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${totalClassesToday > 0 ? (completedClasses.length / totalClassesToday) * 100 : 100}%` }}
            />
          </div>
        </div>

        {/* Tile 3: Current Class Status (Glassmorphism Live Status Tile) */}
        <div className="glass-tile p-5 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="tile-meta-label text-emerald-600">Current Status</span>
            <div className="tile-icon-badge bg-emerald-50/90 text-emerald-600 border border-emerald-200/70">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="my-2">
            <h4 className="text-base sm:text-[17px] font-bold text-slate-900 tracking-tight truncate">
              {currentClass ? currentClass.course : (nextClass ? `Up Next: ${nextClass.course}` : "Session Complete")}
            </h4>
            <p className="text-xs text-slate-500 mt-1 font-medium truncate">
              {currentClass 
                ? `Active in ${currentClass.room} until ${currentClass.endTime}`
                : (nextClass ? `Starts at ${nextClass.startTime}` : "Free for the rest of today")
              }
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-mono font-medium text-slate-500 bg-white/70 px-2 py-0.5 rounded-md border border-slate-200/60 w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Simulated: 10:20 AM</span>
          </div>
        </div>

        {/* Tile 4: Programme Timetable Quick Access (Solid Gradient CTA Tile - NOT Glass for Hierarchy) */}
        <div className="cta-gradient-tile p-5 rounded-2xl text-white flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="tile-meta-label text-indigo-200">Weekly Timetable</span>
            <div className="tile-icon-badge bg-white/20 text-white border border-white/25">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="my-2">
            <h4 className="text-base sm:text-[17px] font-bold text-white tracking-tight truncate">
              Academic Matrix
            </h4>
            <p className="text-xs text-indigo-100/90 mt-1 font-medium truncate">
              {academicProfile?.programme || "B.Tech"} • Section {academicProfile?.section || "A"}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setActiveTab("schedule")}
            className="mt-1 text-xs font-bold text-white hover:text-indigo-100 flex items-center gap-1.5 cursor-pointer group transition-colors w-fit"
          >
            <span>Open Timetable</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* 2. Main Immersive Layout: Left Copilot & Vitality + Right Continuous Timeline */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Left Column (w-full lg:w-5/12 xl:w-4/12 flex flex-col gap-6) */}
        <div className="w-full lg:w-5/12 xl:w-4/12 flex flex-col gap-6">
          {/* Your Copilot Card (Interactive Assistant Glass Tile) */}
          <div className="glass-tile p-6 sm:p-7 rounded-[28px] flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="tile-icon-badge bg-indigo-50/90 text-indigo-600 border border-indigo-100/90 shadow-2xs">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span className="tile-meta-label text-slate-400">
                  Your Copilot
                </span>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            <p className="text-base sm:text-lg leading-relaxed text-slate-800 italic font-normal">
              &ldquo;{nextClass ? `Your next scheduled class is ${nextClass.course} at ${nextClass.startTime} in ${nextClass.room}.` : "You have completed all classes for today."} {lowestAttendanceRecord ? `Your attendance in ${lowestAttendanceRecord.course} is at ${lowestAttendancePct}%, so staying consistent is vital.` : "Keep up your regular attendance."}&rdquo;
            </p>

            <div className="mt-6 flex flex-col gap-3">
              <motion.button
                id="quick-action-plan-my-day"
                type="button"
                onClick={() => handleQuickBriefAction("Plan my day")}
                whileHover={{ scale: 1.015, x: 2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 500, damping: 28 }}
                className="w-full text-left p-3.5 sm:p-4 bg-white/60 hover:bg-white/90 border border-white/80 rounded-2xl text-sm font-medium text-slate-700 shadow-2xs transition-colors cursor-pointer"
              >
                Plan my day
              </motion.button>

              <motion.button
                id="quick-action-focus"
                type="button"
                onClick={() => handleQuickBriefAction("What should I focus on?")}
                whileHover={{ scale: 1.015, x: 2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 500, damping: 28 }}
                className="w-full text-left p-3.5 sm:p-4 bg-white/60 hover:bg-white/90 border border-white/80 rounded-2xl text-sm font-medium text-slate-700 shadow-2xs transition-colors cursor-pointer"
              >
                What should I focus on?
              </motion.button>

              <motion.button
                id="quick-action-miss-maths"
                type="button"
                onClick={() => handleQuickBriefAction("What happens if I miss Maths?")}
                whileHover={{ scale: 1.015, x: 2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 500, damping: 28 }}
                className="w-full text-left p-3.5 sm:p-4 bg-white hover:bg-slate-50/90 border border-slate-200/90 rounded-2xl text-sm font-semibold text-slate-800 shadow-xs flex justify-between items-center group transition-colors cursor-pointer"
              >
                <span>What happens if I miss Maths?</span>
                <span className="opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-indigo-600 font-bold">&rarr;</span>
              </motion.button>

              <motion.button
                id="quick-action-open-copilot-anything"
                type="button"
                onClick={() => onOpenCopilot()}
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 500, damping: 28 }}
                className="w-full p-3.5 sm:p-4 bg-gradient-to-r from-slate-900 to-indigo-950 hover:from-slate-800 hover:to-indigo-900 text-white rounded-2xl text-sm font-semibold shadow-md shadow-indigo-950/25 flex items-center justify-between transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  <span>Ask Copilot Anything...</span>
                </div>
                <span className="text-xs font-mono font-normal text-indigo-300 group-hover:translate-x-1 transition-transform">&rarr;</span>
              </motion.button>
            </div>

            {/* In-place AI Strategy Assessment */}
            {(isBriefLoading || briefResponse) && (
              <div className="mt-5 p-4 rounded-2xl bg-white/90 border border-indigo-100/90 shadow-sm animate-in fade-in">
                <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 mb-1.5">
                  <Zap className="w-3.5 h-3.5" />
                  <span>Strategic Assessment ({activeBriefAction})</span>
                </div>
                {isBriefLoading ? (
                  <div className="flex items-center gap-2 text-xs text-slate-500 py-2">
                    <div className="w-3.5 h-3.5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                    <span>Analyzing timetable, lab schedule, and attendance risk...</span>
                  </div>
                ) : (
                  <div className="text-[13px] sm:text-sm text-slate-700">
                    <AiFormattedText content={briefResponse || ""} />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Academic Vitality Card (Stat / Multi-bar Glass Tile) */}
          <div className="glass-tile p-6 rounded-[28px]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="tile-icon-badge bg-indigo-50/90 text-indigo-600 border border-indigo-100/90">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <span className="tile-meta-label text-slate-400">
                  Academic Vitality
                </span>
              </div>
              <button
                id="vitality-view-all-btn"
                onClick={() => setActiveTab("attendance")}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer"
              >
                Simulate &rarr;
              </button>
            </div>

            {/* Dynamic Attendance Bars for Active Programme */}
            <div className="space-y-3.5">
              {attendance.slice(0, 4).map((rec) => {
                const pct = Math.round((rec.attended / rec.total) * 100);
                const isLow = pct < 75;
                return (
                  <div key={rec.id}>
                    <div className="flex justify-between items-end mb-1">
                      <span className="text-xs font-semibold text-slate-700 truncate max-w-[200px]" title={rec.course}>
                        {rec.course}
                      </span>
                      <span className={`text-xs font-bold font-mono ${isLow ? "text-rose-600" : "text-slate-900"}`}>
                        {pct}%
                      </span>
                    </div>
                    <div className="h-2 bg-slate-200/70 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all ${isLow ? "bg-rose-500" : pct >= 85 ? "bg-emerald-500" : "bg-indigo-600"}`} 
                        style={{ width: `${Math.min(100, pct)}%` }} 
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Due Assignments Action Card (List Glass Tile) */}
          <div className="glass-tile p-6 rounded-[28px] space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
              <div className="flex items-center gap-2.5">
                <div className="tile-icon-badge bg-emerald-50/90 text-emerald-600 border border-emerald-100/90">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <span className="tile-meta-label text-slate-400">
                  Due Assignments
                </span>
              </div>
              <button
                id="today-view-all-tasks-btn"
                onClick={() => setActiveTab("tasks")}
                className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
              >
                All Tasks &rarr;
              </button>
            </div>

            <div className="space-y-2.5 pt-1">
              {dueTodayTasks.map((task) => (
                <div 
                  key={task.id}
                  className={`p-3.5 rounded-2xl border transition-all ${
                    task.completed 
                      ? "bg-slate-100/50 border-slate-200 opacity-50" 
                      : "bg-white/85 border-rose-200/80 hover:border-rose-300 shadow-2xs"
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <FluidCheckbox
                      id={`task-check-${task.id}`}
                      checked={task.completed}
                      onChange={() => onToggleTaskComplete(task.id)}
                    />
                    <div className="space-y-0.5 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono uppercase font-bold text-rose-500">
                          {task.dueDate}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono font-medium">~{task.estimatedMins} mins</span>
                      </div>
                      <p className={`text-xs font-semibold text-slate-800 leading-snug ${task.completed ? "line-through text-slate-400" : ""}`}>
                        {task.title}
                      </p>
                      <span className="text-[11px] text-slate-500 block font-medium">
                        {task.course}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {dueSoonTasks.slice(0, 1).map((task) => (
                <div 
                  key={task.id}
                  className="p-3.5 rounded-2xl bg-white/85 border border-slate-200/80 shadow-2xs"
                >
                  <div className="flex items-start gap-2.5">
                    <FluidCheckbox
                      id={`task-check-${task.id}`}
                      checked={task.completed}
                      onChange={() => onToggleTaskComplete(task.id)}
                    />
                    <div className="space-y-0.5 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono uppercase font-bold text-amber-600">
                          Due Tomorrow
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono font-medium">~{task.estimatedMins} mins</span>
                      </div>
                      <p className={`text-xs font-semibold text-slate-800 leading-snug ${task.completed ? "line-through text-slate-400" : ""}`}>
                        {task.title}
                      </p>
                      <span className="text-[11px] text-slate-500 block font-medium">
                        {task.course}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Campus Wayfinding Card (Wayfinding Glass Tile) */}
          <div className="glass-tile p-6 rounded-[28px] space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="tile-icon-badge bg-indigo-50/90 text-indigo-600 border border-indigo-100/90">
                  <Compass className="w-4 h-4" />
                </div>
                <span className="tile-meta-label text-slate-400">
                  Campus Navigator
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono font-semibold">Smart Wayfinding</span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              {nextClass 
                ? <>Next scheduled venue: <strong className="text-slate-900">{nextClass.room}</strong> for <span className="text-slate-800 font-semibold">{nextClass.course}</span>.</>
                : currentClass 
                ? <>Current venue: <strong className="text-slate-900">{currentClass.room}</strong> for <span className="text-slate-800 font-semibold">{currentClass.course}</span>.</>
                : <>No active classes right now. Head over to the central campus library or cafeteria.</>
              }
            </p>

            <motion.button
              id="today-find-lab3-btn"
              type="button"
              onClick={() => {
                const targetRoom = nextClass?.room || currentClass?.room || "Central Library";
                onSelectCampusLocation(targetRoom);
                setActiveTab("campus");
              }}
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 500, damping: 28 }}
              className="w-full py-2.5 px-4 rounded-2xl bg-indigo-50 hover:bg-indigo-100/90 border border-indigo-200/80 text-xs font-bold text-indigo-900 flex items-center justify-center gap-2 transition-colors shadow-2xs cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5 text-indigo-600" />
              <span>
                {nextClass ? `Navigate to ${nextClass.room} (${nextClass.startTime})` : "View Campus Map"}
              </span>
            </motion.button>
          </div>
        </div>

        {/* Right Column: Immersive UI Timeline Card (Timeline Glass Tile) */}
        <div className="flex-1 w-full glass-tile rounded-[32px] sm:rounded-[40px] p-6 sm:p-8 flex flex-col">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200/60">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Today's Classes</h2>
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold font-mono">
                  {todayEvents.length} Sessions
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">
                {academicProfile ? `${academicProfile.programme} ${academicProfile.branch} (${academicProfile.section})` : "Active Enrolment"} &bull; Monday Schedule
              </p>
            </div>
            
            {/* Day Selector Pill matching the Immersive UI design */}
            <div className="flex bg-slate-200/60 p-1 rounded-full border border-slate-300/40 self-start sm:self-auto">
              <button
                id="timeline-day-mon"
                onClick={() => setActiveTab("schedule")}
                className="px-4 py-1.5 bg-white rounded-full text-xs font-bold text-slate-900 shadow-sm transition-all cursor-pointer"
              >
                Mon (Today)
              </button>
              <button
                id="timeline-day-tue"
                onClick={() => setActiveTab("schedule")}
                className="px-4 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
              >
                Tue
              </button>
              <button
                id="timeline-day-wed"
                onClick={() => setActiveTab("schedule")}
                className="px-4 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
              >
                Wed
              </button>
            </div>
          </div>

          {/* Dynamic "Upcoming Classes" Highlight Panel */}
          {upcomingClasses.length > 0 && (
            <div className="mb-6 p-4 rounded-2xl glass-tile">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-indigo-600" />
                  Upcoming Classes Today ({upcomingClasses.length})
                </span>
                <span className="text-[10px] text-indigo-600 font-semibold font-mono">
                  Auto-calculated from timetable
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {upcomingClasses.map((cls, idx) => (
                  <div 
                    key={cls.id}
                    className="p-3 rounded-xl bg-white/85 border border-indigo-100/90 text-xs shadow-2xs flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700 text-[10px] font-mono font-bold">
                          {cls.startTime} – {cls.endTime}
                        </span>
                        {idx === 0 && (
                          <span className="px-1.5 py-0.2 rounded-full bg-emerald-50 text-emerald-700 text-[9px] font-bold">
                            Next Up
                          </span>
                        )}
                      </div>
                      <p className="font-bold text-slate-900 mt-1 truncate max-w-[170px]">
                        {cls.course}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {cls.room} &bull; {cls.faculty}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        onSelectCampusLocation(cls.room);
                        setActiveTab("campus");
                      }}
                      className="p-2 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition-colors cursor-pointer"
                      title={`Navigate to ${cls.room}`}
                    >
                      <MapPin className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex-1 relative">
            {/* Vertical timeline continuous line matching Design HTML */}
            <div className="absolute left-[4.5rem] top-0 bottom-0 w-px bg-slate-200/80" />

            <div className="space-y-8">
              {sortedTodayEvents.map((ev) => {
                const startMins = getMinutes(ev.startTime);
                const endMins = getMinutes(ev.endTime);
                const durationMins = endMins - startMins;

                const isCompleted = simulatedTotalMins > endMins;
                const isCurrent = simulatedTotalMins >= startMins && simulatedTotalMins <= endMins;
                const isUpcoming = simulatedTotalMins < startMins;
                const isBreak = ev.type === "Free" || ev.type === "Break";

                return (
                  <div
                    key={ev.id}
                    id={`timeline-event-${ev.id}`}
                    className={`content-auto flex items-start gap-10 transition-opacity duration-200 ${
                      isCompleted ? "opacity-50" : isCurrent ? "opacity-100" : "opacity-90"
                    }`}
                  >
                    {/* Time Marker */}
                    <span className={`w-10 text-right text-xs font-bold pt-1.5 ${
                      isCurrent ? "text-indigo-600" : isCompleted ? "text-slate-400" : "text-slate-600"
                    }`}>
                      {ev.startTime}
                    </span>

                    {/* Timeline Node + Card */}
                    <div className="relative flex-1">
                      {/* Node circle on the vertical line */}
                      {isCurrent ? (
                        <div className="absolute -left-[3.25rem] top-2 w-4 h-4 bg-indigo-500 rounded-full border-4 border-white shadow-[0_0_15px_rgba(99,102,241,0.5)] z-10" />
                      ) : isCompleted ? (
                        <div className="absolute -left-[3.25rem] top-2 w-4 h-4 bg-slate-300 rounded-full border-4 border-white z-10" />
                      ) : (
                        <div className="absolute -left-[3.25rem] top-2 w-4 h-4 bg-slate-400 rounded-full border-4 border-white z-10" />
                      )}

                      {/* Event Content Card */}
                      {isCurrent ? (
                        <div className="glass-tile p-5 rounded-2xl shadow-xl shadow-indigo-900/5 max-w-lg border-indigo-200/60">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest font-mono">
                              Happening Now
                            </p>
                            <span className="text-[10px] font-mono text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full font-bold">
                              {ev.startTime} – {ev.endTime}
                            </span>
                          </div>
                          <p className="text-lg font-bold text-slate-900">{ev.course}</p>
                          <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
                            <button
                              onClick={() => {
                                onSelectCampusLocation(ev.room);
                                setActiveTab("campus");
                              }}
                              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                            >
                              <MapPin className="w-3.5 h-3.5" />
                              <span>{ev.room}</span>
                              <span className="text-slate-400 font-normal ml-1">({ev.faculty})</span>
                            </button>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200 font-bold">
                              {ev.type}
                            </span>
                          </div>
                        </div>
                      ) : isBreak ? (
                        <div className="py-2">
                          <p className="text-sm font-bold text-slate-400 italic">
                            {ev.course} • {ev.startTime} – {ev.endTime}
                          </p>
                          {ev.notes && (
                            <p className="text-xs text-slate-400 mt-0.5 italic">{ev.notes}</p>
                          )}
                        </div>
                      ) : (
                        <div className="glass-tile p-4 rounded-2xl transition-all max-w-lg hover:shadow-md">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="text-sm font-bold text-slate-800">{ev.course}</p>
                              <p className="text-xs text-slate-500 mt-0.5 font-medium">
                                {ev.room} &bull; {ev.faculty}
                              </p>
                            </div>
                            <div className="text-right">
                              <span className="text-xs font-mono font-semibold text-slate-700">
                                {ev.startTime} – {ev.endTime}
                              </span>
                              <span className="block text-[10px] text-slate-400 font-mono mt-0.5 font-medium">
                                {ev.type}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
