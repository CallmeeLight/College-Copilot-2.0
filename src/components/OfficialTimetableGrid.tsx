import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  Building2, 
  UserCheck, 
  BookOpen, 
  Calendar, 
  GraduationCap, 
  CheckCircle, 
  Clock, 
  Filter, 
  Printer, 
  Sparkles, 
  ChevronRight, 
  Info, 
  MapPin 
} from "lucide-react";
import { ProgrammeSection, DayOfWeek } from "../types";
import { allProgrammes, PERIOD_TIMINGS } from "../data/timetableData";

interface OfficialTimetableGridProps {
  selectedSection: ProgrammeSection;
  onSelectSection: (section: ProgrammeSection) => void;
  onApplyAsActiveSchedule: (section: ProgrammeSection) => void;
  isActiveSchedule: boolean;
  onSelectLocation?: (room: string) => void;
}

export const OfficialTimetableGrid: React.FC<OfficialTimetableGridProps> = ({
  selectedSection,
  onSelectSection,
  onApplyAsActiveSchedule,
  isActiveSchedule,
  onSelectLocation,
}) => {
  const [selectedBatch, setSelectedBatch] = useState<"ALL" | "G-1" | "G-2">("ALL");
  const [highlightedSubject, setHighlightedSubject] = useState<string | null>(null);

  const days: DayOfWeek[] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  // Helper to handle printing or downloading
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* 1. Programme Switcher & Section Toolbar */}
      <div className="bg-white/70 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-5 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/60 uppercase tracking-wide">
                Official SRM Timetable
              </span>
              <span className="text-xs text-slate-400 font-medium">Session 2026-27 (Odd Sem)</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <span>{selectedSection.programme}</span>
              <span className="text-indigo-600 font-mono text-sm px-2 py-0.5 rounded-md bg-indigo-50 border border-indigo-100">
                Section {selectedSection.sectionNumber}
              </span>
            </h2>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <motion.button
              id="apply-schedule-btn"
              type="button"
              onClick={() => onApplyAsActiveSchedule(selectedSection)}
              whileHover={{ scale: 1.025, y: -1 }}
              whileTap={{ scale: 0.96, y: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 28 }}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all shadow-xs cursor-pointer ${
                isActiveSchedule
                  ? "bg-emerald-600 text-white shadow-emerald-600/20"
                  : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20"
              }`}
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>{isActiveSchedule ? "Active in My Schedule" : "Set as My Section"}</span>
            </motion.button>

            <motion.button
              id="print-timetable-btn"
              type="button"
              onClick={handlePrint}
              whileHover={{ scale: 1.025, y: -1 }}
              whileTap={{ scale: 0.96, y: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 28 }}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span>Print / PDF</span>
            </motion.button>
          </div>
        </div>

        {/* 12-Section Quick Selector Pills */}
        <div className="pt-3">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
            Select Programme & Section (Sections 1 – 12):
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {allProgrammes.map((sec) => {
              const isSelected = selectedSection.id === sec.id;
              return (
                <motion.button
                  key={sec.id}
                  id={`select-sec-${sec.sectionNumber}`}
                  type="button"
                  onClick={() => onSelectSection(sec)}
                  whileHover={{ scale: 1.025, y: -1 }}
                  whileTap={{ scale: 0.96, y: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 28 }}
                  className={`flex flex-col text-left p-2.5 rounded-2xl border text-xs transition-all cursor-pointer ${
                    isSelected
                      ? "bg-slate-900 border-slate-900 text-white shadow-md shadow-slate-950/15"
                      : "bg-slate-50/80 hover:bg-white border-slate-200 text-slate-700 hover:border-indigo-300"
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className={`font-mono text-[11px] font-bold ${isSelected ? "text-indigo-300" : "text-indigo-600"}`}>
                      Sec {sec.sectionNumber}
                    </span>
                    <span className={`text-[10px] font-medium ${isSelected ? "text-slate-300" : "text-slate-400"}`}>
                      {sec.room}
                    </span>
                  </div>
                  <span className="font-semibold mt-1 truncate max-w-[130px]">{sec.programme.replace("B.Tech. ", "")}</span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Section Metadata Overview Bar */}
        <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-600 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200/60">
            <Building2 className="w-4 h-4 text-indigo-600 flex-shrink-0" />
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Assigned Room</span>
              <span className="font-semibold text-slate-900">{selectedSection.room}</span>
            </div>
            {onSelectLocation && (
              <button
                onClick={() => onSelectLocation(selectedSection.room)}
                className="ml-auto text-[10px] text-indigo-600 hover:underline font-medium flex items-center gap-0.5"
              >
                <MapPin className="w-3 h-3" /> Map
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 text-slate-600 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200/60">
            <UserCheck className="w-4 h-4 text-indigo-600 flex-shrink-0" />
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Class In-Charge</span>
              <span className="font-semibold text-slate-900">{selectedSection.classInCharge}</span>
            </div>
          </div>

          {/* Batch Filter (All, G-1, G-2) */}
          <div className="flex items-center justify-between gap-2 text-slate-600 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/60">
            <div className="flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-indigo-600" />
              <span className="text-[11px] font-semibold text-slate-700">Lab Batch:</span>
            </div>
            <div className="flex items-center gap-1 p-0.5 bg-white rounded-lg border border-slate-200">
              {(["ALL", "G-1", "G-2"] as const).map((batch) => (
                <button
                  key={batch}
                  onClick={() => setSelectedBatch(batch)}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                    selectedBatch === batch
                      ? "bg-slate-900 text-white"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  {batch}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Official Timetable Grid Table (Exact university institutional layout) */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Table Title Bar */}
        <div className="p-4 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-bold text-sm tracking-wide flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-400" />
              <span>WEEKLY CLASS TIMETABLE &bull; {selectedSection.programme}</span>
            </h3>
            <p className="text-[11px] text-slate-300">
              Room No: <strong className="text-white">{selectedSection.room}</strong> &bull; Class In-Charge: <strong className="text-white">{selectedSection.classInCharge}</strong>
            </p>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-300">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Academic Session: {selectedSection.academicSession}</span>
          </div>
        </div>

        {/* Responsive Timetable Table - 60Hz Smooth Horizontal Scroll */}
        <div className="overflow-x-auto overscroll-x-contain" style={{ WebkitOverflowScrolling: "touch" }}>
          <table className="w-full text-xs border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200 text-center">
                <th className="py-3 px-3 w-28 text-left font-bold text-slate-900 border-r border-slate-200">Day</th>
                <th className="py-3 px-2 border-r border-slate-200">
                  <div className="font-bold text-slate-900">Period 1</div>
                  <div className="text-[10px] text-slate-500 font-normal">9:30 - 10:30</div>
                </th>
                <th className="py-3 px-2 border-r border-slate-200">
                  <div className="font-bold text-slate-900">Period 2</div>
                  <div className="text-[10px] text-slate-500 font-normal">10:30 - 11:30</div>
                </th>
                <th className="py-3 px-2 border-r border-slate-200">
                  <div className="font-bold text-slate-900">Period 3</div>
                  <div className="text-[10px] text-slate-500 font-normal">11:30 - 12:30</div>
                </th>
                <th className="py-3 px-2 border-r border-slate-200">
                  <div className="font-bold text-slate-900">Period 4</div>
                  <div className="text-[10px] text-slate-500 font-normal">12:30 - 1:30</div>
                </th>
                <th className="py-3 px-3 w-20 bg-amber-50/80 text-amber-900 font-bold border-r border-slate-200">
                  <div>LUNCH</div>
                  <div className="text-[9px] text-amber-700 font-normal">1:30 - 2:30</div>
                </th>
                <th className="py-3 px-2 border-r border-slate-200">
                  <div className="font-bold text-slate-900">Period 5</div>
                  <div className="text-[10px] text-slate-500 font-normal">2:30 - 3:30</div>
                </th>
                <th className="py-3 px-2">
                  <div className="font-bold text-slate-900">Period 6</div>
                  <div className="text-[10px] text-slate-500 font-normal">3:30 - 4:30</div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {days.map((day) => {
                const daySchedule = selectedSection.schedule.find((d) => d.day === day);
                const slots = daySchedule?.slots || [];

                // Period mappings
                const p1 = slots.find((s) => s.period === 1);
                const p2 = slots.find((s) => s.period === 2);
                const p3 = slots.find((s) => s.period === 3);
                const p4 = slots.find((s) => s.period === 4);
                const p6 = slots.find((s) => s.period === 6);
                const p7 = slots.find((s) => s.period === 7);

                const renderSlotCell = (slot?: typeof p1) => {
                  if (!slot) {
                    return (
                      <div className="py-3 px-2 text-center text-slate-300 font-mono text-[11px]">—</div>
                    );
                  }

                  const isLab = slot.type === "Lab" || slot.subject.toLowerCase().includes("lab") || slot.subject.toLowerCase().includes("workshop");
                  const isTutorial = slot.type === "Tutorial" || slot.subject.toLowerCase().includes("tutorial");
                  const isFree = slot.type === "Free" || slot.subject.toLowerCase().includes("sports") || slot.subject.toLowerCase().includes("library");
                  const isHighlighted = highlightedSubject && (slot.subject.toLowerCase().includes(highlightedSubject.toLowerCase()) || slot.code === highlightedSubject);

                  // Batch highlight check
                  const isG1Match = slot.subject.includes("G-1");
                  const isG2Match = slot.subject.includes("G-2");
                  const isDimmed = (selectedBatch === "G-1" && isG2Match && !isG1Match) ||
                                   (selectedBatch === "G-2" && isG1Match && !isG2Match);

                  return (
                    <div 
                      className={`p-2 rounded-xl text-left transition-all h-full flex flex-col justify-between ${
                        isHighlighted
                          ? "ring-2 ring-indigo-600 bg-indigo-50/90 shadow-sm"
                          : isDimmed
                          ? "opacity-35 grayscale"
                          : isLab
                          ? "bg-rose-50/70 border border-rose-200/50 hover:bg-rose-100/70 text-rose-950"
                          : isTutorial
                          ? "bg-violet-50/70 border border-violet-200/50 hover:bg-violet-100/70 text-violet-950"
                          : isFree
                          ? "bg-emerald-50/60 border border-emerald-200/50 hover:bg-emerald-100/60 text-emerald-950"
                          : "bg-slate-50 border border-slate-200/60 hover:bg-slate-100/80 text-slate-900"
                      }`}
                    >
                      <div>
                        <div className="font-semibold text-xs leading-snug line-clamp-2">
                          {slot.subject}
                        </div>
                        {slot.code && (
                          <span className="font-mono text-[10px] text-slate-500 font-medium block mt-0.5">
                            {slot.code}
                          </span>
                        )}
                      </div>

                      <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-500">
                        {slot.room && (
                          <span className="bg-white/80 px-1.5 py-0.5 rounded border border-slate-200/50 font-mono text-[9px] font-medium">
                            {slot.room}
                          </span>
                        )}
                        {isLab && (
                          <span className="px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 font-bold text-[9px]">
                            LAB
                          </span>
                        )}
                      </div>
                    </div>
                  );
                };

                return (
                  <tr key={day} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-3 font-bold text-slate-900 border-r border-slate-200 bg-slate-50/50">
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                        <span>{day}</span>
                      </div>
                    </td>
                    <td className="p-1.5 border-r border-slate-200 align-top w-[14%]">{renderSlotCell(p1)}</td>
                    <td className="p-1.5 border-r border-slate-200 align-top w-[14%]">{renderSlotCell(p2)}</td>
                    <td className="p-1.5 border-r border-slate-200 align-top w-[14%]">{renderSlotCell(p3)}</td>
                    <td className="p-1.5 border-r border-slate-200 align-top w-[14%]">{renderSlotCell(p4)}</td>
                    <td className="p-1.5 bg-amber-50/40 border-r border-slate-200 text-center font-bold text-amber-800 align-middle text-[11px]">
                      <div className="rotate-0 sm:rotate-0 tracking-widest text-[10px] opacity-70">
                        LUNCH
                      </div>
                    </td>
                    <td className="p-1.5 border-r border-slate-200 align-top w-[14%]">{renderSlotCell(p6)}</td>
                    <td className="p-1.5 align-top w-[14%]">{renderSlotCell(p7)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Official Subject, Faculty, Credits & Contact Hours Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-600" />
            <h3 className="font-bold text-sm text-slate-900">
              Course Details & Faculty Directory &bull; Section {selectedSection.sectionNumber}
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Department of Applied Science &bull; SRM University
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3 w-12 text-center">SL.</th>
                <th className="py-2.5 px-3 w-28 font-mono">Code</th>
                <th className="py-2.5 px-4">Subject Name</th>
                <th className="py-2.5 px-4">Faculty Name</th>
                <th className="py-2.5 px-3 w-20 text-center">Credits</th>
                <th className="py-2.5 px-3 w-24 text-center">Contact Hrs</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {selectedSection.subjects.map((sub, idx) => {
                const isHovered = highlightedSubject === sub.name || highlightedSubject === sub.code;
                return (
                  <tr 
                    key={sub.code + idx}
                    onMouseEnter={() => setHighlightedSubject(sub.code)}
                    onMouseLeave={() => setHighlightedSubject(null)}
                    className={`transition-colors cursor-pointer ${
                      isHovered ? "bg-indigo-50/70" : "hover:bg-slate-50"
                    }`}
                  >
                    <td className="py-2.5 px-3 text-center text-slate-400 font-mono text-[11px]">{idx + 1}</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-indigo-700 text-[11px]">{sub.code}</td>
                    <td className="py-2.5 px-4 font-semibold text-slate-900">
                      {sub.name}
                    </td>
                    <td className="py-2.5 px-4 font-medium text-slate-700 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                      {sub.faculty}
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-800">{sub.credits}</td>
                    <td className="py-2.5 px-3 text-center font-mono text-slate-600">{sub.contactHours}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Total Summary Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-2">
          <span>
            Total Subjects: <strong className="text-slate-900">{selectedSection.subjects.length}</strong>
          </span>
          <span>
            Total Credits:{" "}
            <strong className="text-slate-900">
              {selectedSection.subjects.reduce((sum, s) => sum + s.credits, 0)}
            </strong>
          </span>
          <span>
            Total Weekly Contact Hours:{" "}
            <strong className="text-slate-900">
              {selectedSection.subjects.reduce((sum, s) => sum + s.contactHours, 0)}
            </strong>
          </span>
        </div>
      </div>
    </div>
  );
};
