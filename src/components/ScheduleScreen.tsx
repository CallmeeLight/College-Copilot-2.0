import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Plus, 
  Edit3, 
  Trash2, 
  MapPin, 
  User, 
  Check, 
  AlertCircle,
  X,
  Sparkles,
  LayoutGrid,
  Building2,
  CheckCircle2,
  GraduationCap,
  ChevronRight
} from "lucide-react";
import { ScheduleEvent, DayOfWeek, ClassType, ClassStatus, ActiveTab, ProgrammeSection, StudentAcademicProfile } from "../types";
import { allProgrammes } from "../data/timetableData";
import { OfficialTimetableGrid } from "./OfficialTimetableGrid";

interface ScheduleScreenProps {
  scheduleEvents: ScheduleEvent[];
  onAddEvent: (event: ScheduleEvent) => void;
  onUpdateEvent: (event: ScheduleEvent) => void;
  onDeleteEvent: (id: string) => void;
  onSelectCampusLocation: (room: string) => void;
  setActiveTab: (tab: ActiveTab) => void;
  activeSectionId?: string;
  onApplyProgrammeSchedule?: (section: ProgrammeSection) => void;
  academicProfile?: StudentAcademicProfile;
  onOpenAcademicProfile?: () => void;
}

export const ScheduleScreen: React.FC<ScheduleScreenProps> = ({
  scheduleEvents,
  onAddEvent,
  onUpdateEvent,
  onDeleteEvent,
  onSelectCampusLocation,
  setActiveTab,
  activeSectionId = "sec-1",
  onApplyProgrammeSchedule,
  academicProfile,
  onOpenAcademicProfile,
}) => {
  const [viewMode, setViewMode] = useState<"official" | "timeline">("official");
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>("Monday");
  const [editingEvent, setEditingEvent] = useState<ScheduleEvent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Active programme section being viewed in the grid
  const [viewingSection, setViewingSection] = useState<ProgrammeSection>(() => {
    const found = allProgrammes.find((p) => p.id === activeSectionId);
    return found || allProgrammes[0];
  });

  // Keep viewingSection updated when activeSectionId changes
  React.useEffect(() => {
    const found = allProgrammes.find((p) => p.id === activeSectionId);
    if (found) {
      setViewingSection(found);
    }
  }, [activeSectionId]);

  const days: DayOfWeek[] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  // Form state for creating / editing
  const [formData, setFormData] = useState<Partial<ScheduleEvent>>({
    course: "",
    code: "",
    startTime: "09:00",
    endTime: "09:50",
    room: "Room A-204",
    faculty: "Dr. Robert Chen",
    day: "Monday",
    type: "Lecture",
    status: "normal",
    notes: "",
  });

  const openNewEventModal = () => {
    setEditingEvent(null);
    setFormData({
      course: "",
      code: "MATH201",
      startTime: "09:00",
      endTime: "09:50",
      room: "Room A-204",
      faculty: "Dr. Robert Chen",
      day: selectedDay,
      type: "Lecture",
      status: "normal",
      notes: "",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (ev: ScheduleEvent) => {
    setEditingEvent(ev);
    setFormData({ ...ev });
    setIsModalOpen(true);
  };

  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.course || !formData.startTime || !formData.endTime) return;

    if (editingEvent) {
      onUpdateEvent({
        ...editingEvent,
        course: formData.course || "Untitled Course",
        code: formData.code || "GEN101",
        startTime: formData.startTime,
        endTime: formData.endTime,
        room: formData.room || "TBD",
        faculty: formData.faculty || "Faculty TBD",
        day: formData.day as DayOfWeek,
        type: (formData.type as ClassType) || "Lecture",
        status: (formData.status as ClassStatus) || "normal",
        notes: formData.notes,
      });
    } else {
      const newEv: ScheduleEvent = {
        id: `sch-custom-${Date.now()}`,
        course: formData.course,
        code: formData.code || "GEN101",
        startTime: formData.startTime,
        endTime: formData.endTime,
        room: formData.room || "TBD",
        faculty: formData.faculty || "Faculty TBD",
        day: formData.day as DayOfWeek,
        type: (formData.type as ClassType) || "Lecture",
        status: (formData.status as ClassStatus) || "normal",
        notes: formData.notes,
      };
      onAddEvent(newEv);
    }
    setIsModalOpen(false);
  };

  // Convert "HH:MM" to minutes from 08:00 (day baseline)
  const BASELINE_MINS = 8 * 60; // 08:00 = 480 mins
  const TOTAL_DAY_MINS = 10 * 60; // 08:00 to 18:00 = 600 mins
  const PIXELS_PER_MINUTE = 1.4; // 10 mins = 14px, 50 mins = 70px, 120 mins = 168px

  const timeStringToMins = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };

  // Current simulated time: Monday 10:20 AM
  const isTodayActiveDay = selectedDay === "Monday";
  const currentMins = 10 * 60 + 20;

  // Filter and sort events for selected day
  const dayEvents = scheduleEvents
    .filter((e) => e.day === selectedDay)
    .sort((a, b) => timeStringToMins(a.startTime) - timeStringToMins(b.startTime));

  // Time markers from 08:00 to 17:00
  const timeMarkers = [
    "08:00", "09:00", "10:00", "11:00", "12:00", 
    "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Student Academic Profile Label Banner */}
      <div 
        id="schedule-academic-profile-banner"
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl bg-indigo-50/80 border border-indigo-100 shadow-xs"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-sm">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-white px-2 py-0.5 rounded-full border border-indigo-200">
                Enrolled Timetable
              </span>
              <span className="text-xs font-mono text-slate-500">
                Room: {allProgrammes.find(p => p.id === activeSectionId)?.room || "EB-213"}
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
            id="switch-profile-schedule-banner-btn"
            type="button"
            onClick={onOpenAcademicProfile}
            className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-indigo-700 border border-indigo-200/90 shadow-xs transition-all cursor-pointer flex items-center gap-1.5 self-end sm:self-auto"
          >
            <span>Change Academic Profile</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-slate-200/60">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/60 uppercase tracking-wide">
              SRM University Delhi-NCR
            </span>
            <span className="text-xs text-slate-400 font-medium">Session 2026-27 (Odd Sem)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-light tracking-tight text-slate-900 flex items-center gap-2">
            <span className="font-semibold">Weekly Timetable</span> & Master Schedule
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Active: <strong className="text-slate-800">{allProgrammes.find(p => p.id === activeSectionId)?.programme || "B.Tech. AIML"} (Section {allProgrammes.find(p => p.id === activeSectionId)?.sectionNumber || 1})</strong> &bull; Room {allProgrammes.find(p => p.id === activeSectionId)?.room || "EB-101"}
          </p>
        </div>

        {/* View Mode Toggle & Add Class */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center p-1 bg-slate-200/70 rounded-2xl border border-slate-300/40 text-xs font-semibold relative">
            <motion.button
              id="view-mode-official"
              type="button"
              onClick={() => setViewMode("official")}
              whileHover={{ scale: viewMode === "official" ? 1 : 1.02 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 500, damping: 28 }}
              className={`relative z-10 flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-colors cursor-pointer select-none ${
                viewMode === "official"
                  ? "text-slate-900 font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {viewMode === "official" && (
                <motion.div
                  layoutId="schedule-view-mode-pill"
                  className="absolute inset-0 bg-white rounded-xl shadow-sm shadow-slate-950/10 border border-slate-200/80 -z-10"
                  transition={{ type: "spring", stiffness: 450, damping: 32, mass: 0.8 }}
                />
              )}
              <LayoutGrid className="w-3.5 h-3.5 text-indigo-600" />
              <span>Official Matrix (12 Sections)</span>
            </motion.button>

            <motion.button
              id="view-mode-timeline"
              type="button"
              onClick={() => setViewMode("timeline")}
              whileHover={{ scale: viewMode === "timeline" ? 1 : 1.02 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 500, damping: 28 }}
              className={`relative z-10 flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-colors cursor-pointer select-none ${
                viewMode === "timeline"
                  ? "text-slate-900 font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {viewMode === "timeline" && (
                <motion.div
                  layoutId="schedule-view-mode-pill"
                  className="absolute inset-0 bg-white rounded-xl shadow-sm shadow-slate-950/10 border border-slate-200/80 -z-10"
                  transition={{ type: "spring", stiffness: 450, damping: 32, mass: 0.8 }}
                />
              )}
              <Clock className="w-3.5 h-3.5 text-indigo-600" />
              <span>Daily Timeline</span>
            </motion.button>
          </div>

          <motion.button
            id="add-class-btn"
            type="button"
            onClick={openNewEventModal}
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.96, y: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 28 }}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Class</span>
          </motion.button>
        </div>
      </div>

      {/* Conditional View: Official Timetable Grid vs Timeline View */}
      {viewMode === "official" ? (
        <OfficialTimetableGrid
          selectedSection={viewingSection}
          onSelectSection={(sec) => setViewingSection(sec)}
          onApplyAsActiveSchedule={(sec) => {
            onApplyProgrammeSchedule?.(sec);
          }}
          isActiveSchedule={viewingSection.id === activeSectionId}
          onSelectLocation={onSelectCampusLocation}
        />
      ) : (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Day Selector Tabs in Immersive UI pill style */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none bg-slate-200/70 p-1.5 rounded-full border border-slate-300/50 shadow-inner shadow-slate-900/5 relative">
            {days.map((day) => {
              const isSelected = selectedDay === day;
              const isMondayToday = day === "Monday";
              const count = scheduleEvents.filter((e) => e.day === day).length;

              return (
                <button
                  key={day}
                  id={`day-select-${day.toLowerCase()}`}
                  type="button"
                  onClick={() => setSelectedDay(day)}
                  className={`relative flex-1 min-w-[100px] py-2 px-3.5 rounded-full text-center transition-colors duration-200 cursor-pointer select-none outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 ${
                    isSelected
                      ? "text-slate-900 font-bold"
                      : "text-slate-600 hover:text-slate-950 font-medium"
                  }`}
                >
                  {isSelected && (
                    <motion.div
                      layoutId="schedule-day-active-pill"
                      className="absolute inset-0 rounded-full bg-white shadow-sm shadow-slate-900/10 border border-slate-200/90 pointer-events-none"
                      transition={{
                        type: "spring",
                        stiffness: 450,
                        damping: 35,
                        mass: 0.8,
                      }}
                    >
                      {/* Subtle liquid-glass specular light line along the top of the pill */}
                      <div className="absolute top-0 inset-x-3 h-[1px] bg-gradient-to-r from-transparent via-white to-transparent opacity-80" />
                    </motion.div>
                  )}
                  <div className="relative z-10 flex flex-col items-center justify-center">
                    <div className="text-xs flex items-center justify-center gap-1.5 leading-tight">
                      <span>{day.slice(0, 3)}</span>
                      {isMondayToday && (
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                      )}
                    </div>
                    <span className="text-[10px] opacity-75 font-normal block leading-tight mt-0.5">
                      {count} {count === 1 ? "class" : "classes"}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

      {/* Flexible Continuous Time-Based Timeline Canvas */}
      <div className="bg-white/50 backdrop-blur-md border border-white/80 rounded-[32px] sm:rounded-[40px] p-6 sm:p-8 shadow-sm overflow-hidden">
        {/* Timeline Header Info */}
        <div className="flex items-center justify-between text-xs text-slate-500 mb-6 pb-3 border-b border-slate-200/60">
          <span className="flex items-center gap-1.5 font-medium">
            <Clock className="w-3.5 h-3.5 text-indigo-600" />
            Timeline bounds: 08:00 AM – 06:00 PM (Proportional vertical scale)
          </span>
          <span className="font-mono text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full">
            {dayEvents.length} Sessions scheduled
          </span>
        </div>

        {/* Continuous Scale: Left Time markers column + Right Event flow */}
        <div className="relative flex gap-3 sm:gap-6 min-h-[680px]">
          {/* Left Column: Fixed hourly markers */}
          <div className="w-12 sm:w-16 flex-shrink-0 relative select-none">
            {timeMarkers.map((time) => {
              const markerMins = timeStringToMins(time);
              const topPx = (markerMins - BASELINE_MINS) * PIXELS_PER_MINUTE;
              return (
                <div
                  key={time}
                  className="absolute left-0 right-0 flex items-center gap-1 text-[11px] font-mono text-slate-400 font-medium"
                  style={{ top: `${topPx}px` }}
                >
                  <span>{time}</span>
                  <span className="w-2 h-px bg-slate-300 ml-auto" />
                </div>
              );
            })}
          </div>

          {/* Right Column: Continuous Canvas with horizontal guidelines & dynamically positioned events */}
          <div className="flex-1 relative border-l border-slate-200 min-h-[700px]">
            {/* Horizontal hour grid lines */}
            {timeMarkers.map((time) => {
              const markerMins = timeStringToMins(time);
              const topPx = (markerMins - BASELINE_MINS) * PIXELS_PER_MINUTE;
              return (
                <div
                  key={`line-${time}`}
                  className="absolute left-0 right-0 h-px border-b border-dashed border-slate-200/80 pointer-events-none"
                  style={{ top: `${topPx}px` }}
                />
              );
            })}

            {/* Current simulated time indicator bar (if Today is active) */}
            {isTodayActiveDay && currentMins >= BASELINE_MINS && (
              <div
                className="absolute left-0 right-0 z-20 flex items-center pointer-events-none"
                style={{ top: `${(currentMins - BASELINE_MINS) * PIXELS_PER_MINUTE}px` }}
              >
                <div className="w-3 h-3 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.7)] -ml-[6px] border-2 border-white" />
                <div className="flex-1 h-0.5 bg-indigo-500" />
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 ml-2">
                  10:20 AM NOW
                </span>
              </div>
            )}

            {/* Render dynamically positioned courses */}
            {dayEvents.map((ev) => {
              const startM = timeStringToMins(ev.startTime);
              const endM = timeStringToMins(ev.endTime);
              const durationM = Math.max(endM - startM, 20);

              const topPosition = (startM - BASELINE_MINS) * PIXELS_PER_MINUTE;
              const heightPixels = durationM * PIXELS_PER_MINUTE;

              const isCurrent = isTodayActiveDay && currentMins >= startM && currentMins <= endM;
              const isPast = isTodayActiveDay && currentMins > endM;
              const isCancelled = ev.status === "cancelled";

              return (
                <div
                  key={ev.id}
                  id={`schedule-block-${ev.id}`}
                  className={`absolute left-3 right-2 rounded-2xl p-3 sm:p-4 border transition-all duration-200 group overflow-hidden ${
                    isCurrent
                      ? "bg-white/95 border-indigo-400 shadow-xl shadow-slate-200/60 z-10 ring-2 ring-indigo-500/20"
                      : isCancelled
                      ? "bg-rose-50/50 border-rose-200 opacity-60"
                      : isPast
                      ? "bg-white/40 border-white/60 opacity-60"
                      : "bg-white/80 border-white hover:border-slate-300 hover:shadow-md shadow-sm"
                  }`}
                  style={{
                    top: `${topPosition}px`,
                    height: `${heightPixels - 4}px`, // slight 4px gap
                  }}
                >
                  <div className="flex items-start justify-between gap-2 h-full">
                    <div className="space-y-1 flex-1 min-w-0 flex flex-col justify-between h-full">
                      <div>
                        {/* Time & Badge */}
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-mono font-bold text-slate-800">
                            {ev.startTime} – {ev.endTime}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">
                            ({durationM} mins)
                          </span>
                          {isCurrent && (
                            <span className="inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 animate-pulse">
                              Active
                            </span>
                          )}
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                            ev.type === "Lab"
                              ? "bg-purple-50 text-purple-700 border-purple-200"
                              : ev.type === "Tutorial"
                              ? "bg-sky-50 text-sky-700 border-sky-200"
                              : ev.type === "Free"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-slate-100 text-slate-700 border-slate-200"
                          }`}>
                            {ev.type}
                          </span>
                          {isCancelled && (
                            <span className="text-[9px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                              Cancelled
                            </span>
                          )}
                        </div>

                        {/* Title & Code */}
                        <h4 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight truncate mt-0.5">
                          {ev.course}
                          {ev.code && ev.code !== "BREAK" && (
                            <span className="ml-2 text-xs font-normal font-mono text-slate-400">
                              {ev.code}
                            </span>
                          )}
                        </h4>
                      </div>

                      {/* Location & Faculty footer */}
                      <div className="flex items-center gap-4 text-xs text-slate-500 flex-wrap pt-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectCampusLocation(ev.room);
                            setActiveTab("campus");
                          }}
                          className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-semibold hover:underline"
                        >
                          <MapPin className="w-3 h-3 text-indigo-500" />
                          <span>{ev.room}</span>
                        </button>
                        {ev.faculty && (
                          <span className="flex items-center gap-1 text-slate-400">
                            <User className="w-3 h-3" />
                            <span>{ev.faculty}</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action buttons (Edit / Delete) */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        id={`edit-class-${ev.id}`}
                        onClick={() => openEditModal(ev)}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                        title="Edit course timings or details"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        id={`delete-class-${ev.id}`}
                        onClick={() => onDeleteEvent(ev.id)}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-100 text-slate-600 hover:text-rose-600 transition-colors"
                        title="Delete from schedule"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  )}

      {/* Add / Edit Event Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-white/95 backdrop-blur-xl rounded-[32px] p-6 sm:p-7 shadow-2xl border border-white/90 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200/60">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-600" />
                <span>{editingEvent ? "Edit Course Timings" : "Add New Schedule Event"}</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-800 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEvent} className="mt-4 space-y-4 text-xs">
              {/* Course Title & Code */}
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2 space-y-1">
                  <label className="text-slate-700 font-semibold block">Course Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.course}
                    onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                    placeholder="e.g. Mathematics or BME Laboratory"
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-400 shadow-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-700 font-semibold block">Code</label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    placeholder="MATH201"
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-400 shadow-sm"
                  />
                </div>
              </div>

              {/* Day & Class Type */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-700 font-semibold block">Day *</label>
                  <select
                    value={formData.day}
                    onChange={(e) => setFormData({ ...formData, day: e.target.value as DayOfWeek })}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-slate-200 text-slate-900 focus:outline-none focus:border-indigo-400 shadow-sm"
                  >
                    {days.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-slate-700 font-semibold block">Class Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as ClassType })}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-slate-200 text-slate-900 focus:outline-none focus:border-indigo-400 shadow-sm"
                  >
                    <option value="Lecture">Lecture (Standard)</option>
                    <option value="Lab">Lab (Long Session)</option>
                    <option value="Tutorial">Tutorial / Recitation</option>
                    <option value="Free">Free Window / Break</option>
                  </select>
                </div>
              </div>

              {/* Start Time & End Time (Independent Course Timings) */}
              <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 space-y-2">
                <span className="text-[11px] font-bold text-indigo-900 block">
                  Flexible Course Timings (HH:MM)
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-slate-600 font-medium block">Start Time *</label>
                    <input
                      type="time"
                      required
                      value={formData.startTime}
                      onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 focus:outline-none focus:border-indigo-400 shadow-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-600 font-medium block">End Time *</label>
                    <input
                      type="time"
                      required
                      value={formData.endTime}
                      onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 focus:outline-none focus:border-indigo-400 shadow-sm"
                    />
                  </div>
                </div>
                <p className="text-[10px] text-slate-500">
                  The schedule automatically scales vertical timeline height to match the duration.
                </p>
              </div>

              {/* Room & Faculty */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-700 font-semibold block">Room / Lab</label>
                  <input
                    type="text"
                    value={formData.room}
                    onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                    placeholder="e.g. Room A-204 or Lab 3"
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-400 shadow-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-700 font-semibold block">Faculty Member</label>
                  <input
                    type="text"
                    value={formData.faculty}
                    onChange={(e) => setFormData({ ...formData, faculty: e.target.value })}
                    placeholder="e.g. Dr. Robert Chen"
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-400 shadow-sm"
                  />
                </div>
              </div>

              {/* Status */}
              <div className="space-y-1">
                <label className="text-slate-700 font-semibold block">Status</label>
                <div className="flex items-center gap-3">
                  {(["normal", "cancelled", "rescheduled"] as ClassStatus[]).map((st) => (
                    <label key={st} className="flex items-center gap-1.5 cursor-pointer capitalize text-slate-700 font-medium">
                      <input
                        type="radio"
                        name="status"
                        checked={formData.status === st}
                        onChange={() => setFormData({ ...formData, status: st })}
                        className="text-indigo-600"
                      />
                      <span>{st}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-1">
                <label className="text-slate-700 font-semibold block">Topic / Lecture Note</label>
                <input
                  type="text"
                  value={formData.notes || ""}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="e.g. Bring laboratory record book"
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-400 shadow-sm"
                />
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200/60">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-semibold shadow-sm"
                >
                  {editingEvent ? "Save Changes" : "Create Class"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
