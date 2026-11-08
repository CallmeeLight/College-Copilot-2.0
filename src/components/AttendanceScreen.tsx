import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  GraduationCap, 
  AlertTriangle, 
  CheckCircle, 
  Sparkles, 
  Minus,
  ShieldCheck,
  ChevronRight,
  ArrowRight
} from "lucide-react";
import { AttendanceRecord, StudentAcademicProfile } from "../types";

interface AttendanceScreenProps {
  attendance: AttendanceRecord[];
  onUpdateAttendance: (records: AttendanceRecord[]) => void;
  onOpenCopilot: (prompt?: string) => void;
  academicProfile?: StudentAcademicProfile;
  onOpenAcademicProfile?: () => void;
}

interface CircularAttendanceRingProps {
  id: string;
  percentage: number;
  attended: number;
  total: number;
  size?: number;
  strokeWidth?: number;
  showThresholdMarker?: boolean;
}

export const CircularAttendanceRing: React.FC<CircularAttendanceRingProps> = ({
  id,
  percentage,
  attended,
  total,
  size = 84,
  strokeWidth = 6.5,
  showThresholdMarker = true,
}) => {
  const center = size / 2;
  const radius = center - strokeWidth - 2;
  const circumference = 2 * Math.PI * radius;
  const clampedPct = Math.min(Math.max(percentage, 0), 100);
  const strokeDashoffset = circumference - (clampedPct / 100) * circumference;

  const isBelow75 = percentage < 75.0;
  const isWarning = percentage >= 75.0 && percentage < 80.0;

  // 75% threshold marker coordinates on circumference (starting from top -90deg, 75% is at 180deg)
  const thresholdAngle = (-90 + 0.75 * 360) * (Math.PI / 180);
  const thresholdX = center + radius * Math.cos(thresholdAngle);
  const thresholdY = center + radius * Math.sin(thresholdAngle);

  // Gradient & filter IDs
  const gradientId = `ring-grad-${id.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
  const glowId = `ring-glow-${id.replace(/[^a-zA-Z0-9_-]/g, "-")}`;

  return (
    <div 
      className="relative flex items-center justify-center p-1 rounded-full bg-white/50 backdrop-blur-md border border-white/70 shadow-inner group-hover:scale-105 transition-transform duration-300 gpu-accelerated"
      style={{ width: size + 8, height: size + 8 }}
      title={`Current attendance: ${percentage}% (${attended}/${total} classes)`}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90"
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            {isBelow75 ? (
              <>
                <stop offset="0%" stopColor="#f43f5e" />
                <stop offset="100%" stopColor="#e11d48" />
              </>
            ) : isWarning ? (
              <>
                <stop offset="0%" stopColor="#fbbf24" />
                <stop offset="100%" stopColor="#f97316" />
              </>
            ) : (
              <>
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#06b6d4" />
              </>
            )}
          </linearGradient>

          <filter id={glowId} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Ambient Track Circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="rgba(203, 213, 225, 0.45)"
          strokeWidth={strokeWidth}
        />

        {/* Animated Active Progress Arc */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          filter={`url(#${glowId})`}
          className="transition-all duration-700 ease-out"
        />

        {/* Mandatory 75% Threshold Pin Marker */}
        {showThresholdMarker && (
          <circle
            cx={thresholdX}
            cy={thresholdY}
            r={2.5}
            fill="#e11d48"
            stroke="#ffffff"
            strokeWidth={1}
            className="transform rotate-90 origin-center"
          />
        )}
      </svg>

      {/* Centered Percentage Display */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
        <span 
          className={`font-mono font-bold tracking-tight text-xs sm:text-sm leading-none ${
            isBelow75 ? "text-rose-600" : isWarning ? "text-amber-600" : "text-emerald-700"
          }`}
        >
          {percentage}%
        </span>
        <span className="text-[9px] font-mono text-slate-400 font-semibold tracking-tighter mt-0.5 leading-none">
          {attended}/{total}
        </span>
      </div>
    </div>
  );
};

export const AttendanceScreen: React.FC<AttendanceScreenProps> = ({
  attendance,
  onUpdateAttendance,
  onOpenCopilot,
  academicProfile,
  onOpenAcademicProfile,
}) => {
  // Selected course for "What happens if I miss?" simulation
  const [selectedCourseId, setSelectedCourseId] = useState<string>(attendance[0]?.id || "att-1");

  // Keep selectedCourseId in sync if attendance changes
  React.useEffect(() => {
    if (attendance.length > 0 && !attendance.some(a => a.id === selectedCourseId)) {
      setSelectedCourseId(attendance[0].id);
    }
  }, [attendance, selectedCourseId]);

  const [missCount, setMissCount] = useState<number>(1);
  const [attendCount, setAttendCount] = useState<number>(0);

  const selectedRecord = attendance.find((a) => a.id === selectedCourseId) || attendance[0] || {
    id: "att-default",
    course: "Core Class",
    code: "COR101",
    attended: 20,
    total: 25,
    lastUpdated: "Today",
  };

  // Current calculation
  const currentPct = selectedRecord 
    ? Math.round((selectedRecord.attended / selectedRecord.total) * 1000) / 10 
    : 0;

  // Simulated calculation
  const simAttended = selectedRecord ? selectedRecord.attended + attendCount : 0;
  const simTotal = selectedRecord ? selectedRecord.total + missCount + attendCount : 1;
  const simPct = Math.round((simAttended / simTotal) * 1000) / 10;

  // How many consecutive classes needed to reach 75%?
  const calculateClassesNeededFor75 = (rec: AttendanceRecord) => {
    const needed = Math.ceil(3 * rec.total - 4 * rec.attended);
    return Math.max(0, needed);
  };

  // Quick action: log class today
  const handleQuickLog = (id: string, attendedDelta: number, totalDelta: number) => {
    const updated = attendance.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          attended: Math.max(0, item.attended + attendedDelta),
          total: Math.max(1, item.total + totalDelta),
          lastUpdated: "Just now",
        };
      }
      return item;
    });
    onUpdateAttendance(updated);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Student Academic Profile Label Banner */}
      <div 
        id="attendance-academic-profile-banner"
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl bg-indigo-50/80 border border-indigo-100 shadow-xs"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-sm">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-white px-2 py-0.5 rounded-full border border-indigo-200">
                Course Enrolment
              </span>
              <span className="text-xs font-mono text-slate-500">
                Tracked: {attendance.length} Subjects
              </span>
            </div>
            <p className="text-sm font-bold text-slate-900 mt-0.5">
              {academicProfile 
                ? `${academicProfile.programme} ${academicProfile.branch} • ${academicProfile.year} • ${academicProfile.semester} • ${academicProfile.section}`
                : "B.Tech Biomedical Engineering • 1st Year • Sem 1 • Sec A"
              }
            </p>
          </div>
        </div>

        {onOpenAcademicProfile && (
          <button
            id="switch-profile-attendance-banner-btn"
            type="button"
            onClick={onOpenAcademicProfile}
            className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-indigo-700 border border-indigo-200/90 shadow-xs transition-all cursor-pointer flex items-center gap-1.5 self-end sm:self-auto"
          >
            <span>Change Academic Profile</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/60">
        <div>
          <h1 className="text-3xl sm:text-4xl font-light tracking-tight text-slate-900 flex items-center gap-3">
            <span className="font-semibold">Academic Vitality</span> & Attendance
          </h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            Official 75.0% threshold monitoring &bull; Circular SVG progress rings &bull; What-If consequence simulator
          </p>
        </div>

        <button
          id="ask-copilot-attendance-btn"
          type="button"
          onClick={() => onOpenCopilot(`What happens if I miss my next ${selectedRecord.course} class?`)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 hover:bg-indigo-100/80 border border-indigo-200/80 text-indigo-900 text-xs font-semibold shadow-sm transition-all cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>Ask Copilot about Attendance</span>
        </button>
      </div>

      {/* Main Grid: Subject List + Interactive "What happens if I miss?" Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 7 Cols: Course Attendance Cards with Circular SVG Progress Rings */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs uppercase tracking-[0.2em] font-bold text-slate-400 flex items-center gap-2">
              <span>Enrolled Courses</span>
              <span className="text-[11px] font-mono text-slate-400">({attendance.length} subjects)</span>
            </h2>
            <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
              Red pin indicates mandatory 75% threshold
            </span>
          </div>

          <div className="space-y-3.5">
            {attendance.map((rec) => {
              const pct = Math.round((rec.attended / rec.total) * 1000) / 10;
              const isBelow75 = pct < 75.0;
              const isWarning = pct >= 75.0 && pct < 80.0;
              const isSelected = selectedCourseId === rec.id;
              const classesNeeded = calculateClassesNeededFor75(rec);
              const safeMargin = Math.floor((rec.attended - 0.75 * rec.total) / 0.75);

              return (
                <motion.div
                  key={rec.id}
                  id={`attendance-card-${rec.id}`}
                  onClick={() => setSelectedCourseId(rec.id)}
                  whileHover={{ scale: 1.015, y: -2 }}
                  whileTap={{ scale: 0.985 }}
                  transition={{ type: "spring", stiffness: 500, damping: 28 }}
                  className={`glass-tile rounded-3xl p-5 border transition-all cursor-pointer relative overflow-hidden group gpu-accelerated ${
                    isSelected
                      ? "bg-white/80 border-indigo-300 shadow-lg shadow-indigo-100/50 ring-2 ring-indigo-500/30"
                      : "bg-white/55 border-white/60 hover:bg-white/70 hover:border-slate-300/80 shadow-xs"
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    {/* Course Information & Meta */}
                    <div className="min-w-0 flex-1 space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight truncate max-w-[280px] sm:max-w-none">
                          {rec.course}
                        </h3>
                        <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-lg bg-indigo-50/80 text-indigo-700 border border-indigo-100">
                          {rec.code}
                        </span>
                        {isBelow75 ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200 animate-pulse">
                            <AlertTriangle className="w-3 h-3" />
                            Debarment Risk (&lt;75%)
                          </span>
                        ) : isWarning ? (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                            Borderline
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <ShieldCheck className="w-3 h-3" />
                            Safe
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-500">
                        {rec.faculty} &bull; Updated: {rec.lastUpdated}
                      </p>

                      {/* Threshold Consequence & Consecutive Classes Note */}
                      <div className="text-xs pt-0.5">
                        {isBelow75 ? (
                          <span className="text-rose-600 inline-flex items-center gap-1.5 text-[11px] font-medium bg-rose-50/80 px-2.5 py-1 rounded-xl border border-rose-100">
                            <AlertTriangle className="w-3 h-3 shrink-0 text-rose-500" />
                            <span>Must attend next <strong className="underline font-bold">{classesNeeded} consecutive classes</strong> to restore 75%.</span>
                          </span>
                        ) : (
                          <span className="text-emerald-700 inline-block text-[11px] font-medium bg-emerald-50/80 px-2.5 py-1 rounded-xl border border-emerald-100">
                            Can miss <strong className="font-bold">{safeMargin}</strong> more class{safeMargin === 1 ? "" : "es"} while staying above 75%.
                          </span>
                        )}
                      </div>

                      {/* Actions toolbar */}
                      <div className="flex items-center gap-2 pt-2 border-t border-slate-200/50">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCourseId(rec.id);
                            setMissCount(1);
                            setAttendCount(0);
                          }}
                          className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50/70 hover:bg-indigo-100/70 border border-indigo-100 transition-colors cursor-pointer"
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>Simulate Consequence</span>
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleQuickLog(rec.id, 1, 1);
                          }}
                          className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-900 px-2.5 py-1 rounded-lg bg-emerald-50/70 hover:bg-emerald-100/70 border border-emerald-100 transition-colors cursor-pointer"
                          title="Quick log: Marked attended today"
                        >
                          + Attended Today
                        </button>
                      </div>
                    </div>

                    {/* Right: SVG Circular Progress Ring */}
                    <div className="shrink-0 flex items-center justify-center">
                      <CircularAttendanceRing
                        id={rec.id}
                        percentage={pct}
                        attended={rec.attended}
                        total={rec.total}
                        size={84}
                        strokeWidth={6.5}
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Right 5 Cols: "What happens if I miss my next class?" Interactive Simulator */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-tile rounded-[32px] p-6 sm:p-7 shadow-sm border border-white/80 gpu-accelerated">
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/60">
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
                  <div>
                    <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-slate-400">
                      Consequence Simulator
                    </h3>
                    <p className="text-sm font-semibold text-slate-800">
                      “What happens if I miss my next class?”
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-bold border border-indigo-200">
                  Live
                </span>
              </div>

              {/* Course Selector Dropdown */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 block">Select Course to Simulate:</label>
                <select
                  id="simulator-course-select"
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-slate-200 text-slate-800 text-xs font-semibold focus:outline-none focus:border-indigo-400 shadow-sm"
                >
                  {attendance.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.course} ({Math.round((a.attended / a.total) * 100)}% currently)
                    </option>
                  ))}
                </select>
              </div>

              {/* Scenario Adjusters */}
              <div className="grid grid-cols-2 gap-3">
                {/* Miss Classes Counter */}
                <div className="p-3.5 rounded-2xl bg-rose-50/50 border border-rose-100 space-y-1.5">
                  <span className="text-[11px] font-bold text-rose-700 block">
                    If I miss:
                  </span>
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setMissCount(Math.max(0, missCount - 1))}
                      className="w-7 h-7 rounded-xl bg-white hover:bg-rose-100 text-slate-800 flex items-center justify-center text-xs font-bold border border-slate-200 shadow-sm cursor-pointer"
                    >
                      -
                    </button>
                    <span className="font-mono text-sm font-bold text-slate-800">
                      {missCount} {missCount === 1 ? "class" : "classes"}
                    </span>
                    <button
                      type="button"
                      onClick={() => setMissCount(missCount + 1)}
                      className="w-7 h-7 rounded-xl bg-white hover:bg-rose-100 text-slate-800 flex items-center justify-center text-xs font-bold border border-slate-200 shadow-sm cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Attend Classes Counter */}
                <div className="p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-1.5">
                  <span className="text-[11px] font-bold text-emerald-700 block">
                    If I attend:
                  </span>
                  <div className="flex items-center justify-between">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.88 }}
                      transition={{ type: "spring", stiffness: 600, damping: 25 }}
                      onClick={() => setAttendCount(Math.max(0, attendCount - 1))}
                      className="w-7 h-7 rounded-xl bg-white hover:bg-emerald-100 text-slate-800 flex items-center justify-center text-xs font-bold border border-slate-200 shadow-sm cursor-pointer"
                    >
                      -
                    </motion.button>
                    <span className="font-mono text-sm font-bold text-slate-800">
                      {attendCount} {attendCount === 1 ? "class" : "classes"}
                    </span>
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.88 }}
                      transition={{ type: "spring", stiffness: 600, damping: 25 }}
                      onClick={() => setAttendCount(attendCount + 1)}
                      className="w-7 h-7 rounded-xl bg-white hover:bg-emerald-100 text-slate-800 flex items-center justify-center text-xs font-bold border border-slate-200 shadow-sm cursor-pointer"
                    >
                      +
                    </motion.button>
                  </div>
                </div>
              </div>

              {/* Simulation Result Comparison Box with Circular SVG Rings */}
              <div className={`p-4 sm:p-5 rounded-3xl border transition-all ${
                simPct < 75.0
                  ? "bg-rose-50/70 border-rose-200"
                  : simPct < 80.0
                  ? "bg-amber-50/70 border-amber-200"
                  : "bg-emerald-50/70 border-emerald-200"
              }`}>
                <div className="flex items-center justify-around gap-2">
                  {/* Current Circular Ring */}
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-1.5">
                      Current
                    </span>
                    <CircularAttendanceRing
                      id="sim-current"
                      percentage={currentPct}
                      attended={selectedRecord.attended}
                      total={selectedRecord.total}
                      size={70}
                      strokeWidth={5.5}
                    />
                  </div>

                  {/* Transition arrow with projected delta */}
                  <div className="flex flex-col items-center gap-1 shrink-0">
                    <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-full ${
                      simPct > currentPct 
                        ? "bg-emerald-100 text-emerald-700" 
                        : simPct < currentPct 
                        ? "bg-rose-100 text-rose-700" 
                        : "bg-slate-100 text-slate-600"
                    }`}>
                      {simPct > currentPct 
                        ? `+${(simPct - currentPct).toFixed(1)}%` 
                        : simPct < currentPct 
                        ? `${(simPct - currentPct).toFixed(1)}%` 
                        : "0%"}
                    </span>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </div>

                  {/* Projected Circular Ring */}
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-1.5">
                      Projected
                    </span>
                    <CircularAttendanceRing
                      id="sim-projected"
                      percentage={simPct}
                      attended={simAttended}
                      total={simTotal}
                      size={70}
                      strokeWidth={5.5}
                    />
                  </div>
                </div>

                <div className="mt-3.5 pt-3 border-t border-slate-200/60 text-xs leading-relaxed">
                  {missCount > 0 && simPct < 75.0 ? (
                    <div className="flex items-start gap-2 text-rose-700">
                      <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-600" />
                      <p>
                        <strong>Debarment Alert:</strong> Missing {missCount} {missCount === 1 ? "class" : "classes"} drops you to <strong>{simPct}%</strong>, violating the university's 75% examination eligibility rule.
                      </p>
                    </div>
                  ) : attendCount > 0 && simPct >= 75.0 ? (
                    <div className="flex items-start gap-2 text-emerald-800">
                      <ShieldCheck className="w-4 h-4 flex-shrink-0 mt-0.5 text-emerald-600" />
                      <p>
                        <strong>Recovery Confirmed:</strong> Attending {attendCount} consecutive classes elevates your attendance safely to <strong>{simPct}%</strong>.
                      </p>
                    </div>
                  ) : (
                    <p className="text-slate-600">
                      Adjust the counters above to test any attendance scenario before making a decision.
                    </p>
                  )}
                </div>
              </div>

              {/* Quick Log Buttons (Simulate Attended Today vs Missed Today) */}
              <div className="space-y-2 pt-2 border-t border-slate-200/60">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Log Today's Class:</span>
                <div className="grid grid-cols-2 gap-2">
                  <motion.button
                    id="log-attended-btn"
                    type="button"
                    onClick={() => handleQuickLog(selectedRecord.id, 1, 1)}
                    whileHover={{ scale: 1.03, y: -1 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 500, damping: 28 }}
                    className="py-2.5 px-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer select-none"
                  >
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>I Attended Today</span>
                  </motion.button>

                  <motion.button
                    id="log-missed-btn"
                    type="button"
                    onClick={() => handleQuickLog(selectedRecord.id, 0, 1)}
                    whileHover={{ scale: 1.03, y: -1 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 500, damping: 28 }}
                    className="py-2.5 px-3 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer select-none"
                  >
                    <Minus className="w-3.5 h-3.5 text-rose-600" />
                    <span>I Missed Today</span>
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
