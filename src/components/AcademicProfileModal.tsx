import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  GraduationCap, 
  X, 
  Check, 
  Sparkles, 
  BookOpen, 
  MapPin, 
  UserCheck, 
  Layers,
  ArrowRight,
  School
} from "lucide-react";
import { StudentAcademicProfile } from "../types";
import { 
  ACADEMIC_PROGRAMMES, 
  ACADEMIC_BRANCHES, 
  ACADEMIC_YEARS, 
  ACADEMIC_SEMESTERS, 
  getSectionsForBranch,
  getStudentSubjects
} from "../data/academicCatalog";
import { SECTION_METADATA_MAP } from "../data/academicOnboarding";

interface AcademicProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfile: StudentAcademicProfile;
  onSaveProfile?: (profile: StudentAcademicProfile) => void;
  onSave?: (profile: StudentAcademicProfile) => void;
}

export const AcademicProfileModal: React.FC<AcademicProfileModalProps> = ({
  isOpen,
  onClose,
  currentProfile,
  onSaveProfile,
  onSave,
}) => {
  const [programme, setProgramme] = useState(currentProfile?.programme || "B.Tech");
  const [branch, setBranch] = useState(currentProfile?.branch || "Biomedical Engineering");
  const [year, setYear] = useState(currentProfile?.year || "1st Year");
  const [semester, setSemester] = useState(currentProfile?.semester || "Semester 1");
  const [section, setSection] = useState(currentProfile?.section || "Section A");
  const [rollNo, setRollNo] = useState(currentProfile?.studentRollNo || "RA2611003010042");

  // Keep form fields synchronized whenever the modal opens or currentProfile changes
  React.useEffect(() => {
    if (isOpen && currentProfile) {
      setProgramme(currentProfile.programme || "B.Tech");
      setBranch(currentProfile.branch || "Biomedical Engineering");
      setYear(currentProfile.year || "1st Year");
      setSemester(currentProfile.semester || "Semester 1");
      setSection(currentProfile.section || "Section A");
      setRollNo(currentProfile.studentRollNo || "RA2611003010042");
    }
  }, [isOpen, currentProfile]);

  if (!isOpen) return null;

  // Available branches for current programme
  const availableBranches = ACADEMIC_BRANCHES[programme] || ACADEMIC_BRANCHES["B.Tech"];

  const handleProgrammeChange = (newProg: string) => {
    setProgramme(newProg);
    const branches = ACADEMIC_BRANCHES[newProg] || [];
    if (branches.length > 0 && !branches.includes(branch)) {
      setBranch(branches[0]);
    }
  };

  const availableSections = getSectionsForBranch(branch);

  const handleBranchChange = (newBranch: string) => {
    setBranch(newBranch);
    const validSections = getSectionsForBranch(newBranch);
    if (!validSections.includes(section)) {
      setSection(validSections[0] || "Section 1");
    }
  };

  // Derive resolved section metadata
  const secNumberMatch = section.match(/\d+/);
  const currentSecNumber = secNumberMatch ? parseInt(secNumberMatch[0], 10) : 1;
  const currentSecMeta = SECTION_METADATA_MAP[currentSecNumber] || SECTION_METADATA_MAP[1];

  const previewProfile: StudentAcademicProfile = {
    programme,
    branch,
    year,
    semester,
    section,
    studentRollNo: rollNo,
  };

  const previewSubjects = getStudentSubjects(previewProfile);

  const handleSave = () => {
    const saveFn = onSaveProfile || onSave;
    if (saveFn) {
      saveFn(previewProfile);
    }
    onClose();
  };

  const applyPreset = (presetBranch: string, presetSection: string) => {
    setProgramme("B.Tech");
    setBranch(presetBranch);
    setYear("1st Year");
    setSemester("Semester 1");
    setSection(presetSection);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="bg-white/95 backdrop-blur-2xl border border-white/80 rounded-[32px] max-w-2xl w-full p-6 sm:p-8 shadow-2xl shadow-indigo-950/20 max-h-[92vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="academic-profile-modal-title"
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-200/70">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="academic-profile-modal-title" className="text-xl font-bold text-slate-900">
                  Student Academic Profile
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-bold uppercase tracking-wider border border-indigo-100">
                  Dynamic Timetable
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Select your enrolled programme to automatically load your exact classes, timetable, attendance, and assignments.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Demo Presets */}
        <div className="mt-5">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
            Quick Branch Presets
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <motion.button
              type="button"
              onClick={() => applyPreset("B.Tech AIML", "Section 1")}
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 500, damping: 28 }}
              className={`px-3 py-2 rounded-xl text-left text-xs font-semibold border transition-colors cursor-pointer ${
                branch === "B.Tech AIML" && section === "Section 1"
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                  : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200/80"
              }`}
            >
              <span className="block font-bold">AIML (Sec 1)</span>
              <span className={`text-[10px] block ${branch === "B.Tech AIML" ? "text-indigo-100" : "text-slate-400"}`}>Room EB-101</span>
            </motion.button>

            <motion.button
              type="button"
              onClick={() => applyPreset("B.Tech CSE Core", "Section 8")}
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 500, damping: 28 }}
              className={`px-3 py-2 rounded-xl text-left text-xs font-semibold border transition-colors cursor-pointer ${
                branch === "B.Tech CSE Core" && section === "Section 8"
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                  : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200/80"
              }`}
            >
              <span className="block font-bold">CSE Core (Sec 8)</span>
              <span className={`text-[10px] block ${branch === "B.Tech CSE Core" ? "text-indigo-100" : "text-slate-400"}`}>Room EB-203</span>
            </motion.button>

            <motion.button
              type="button"
              onClick={() => applyPreset("B.Tech DSAI", "Section 6")}
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 500, damping: 28 }}
              className={`px-3 py-2 rounded-xl text-left text-xs font-semibold border transition-colors cursor-pointer ${
                branch === "B.Tech DSAI"
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                  : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200/80"
              }`}
            >
              <span className="block font-bold">DSAI (Sec 6)</span>
              <span className={`text-[10px] block ${branch === "B.Tech DSAI" ? "text-indigo-100" : "text-slate-400"}`}>Room EB-201</span>
            </motion.button>

            <motion.button
              type="button"
              onClick={() => applyPreset("B.Tech Cyber Security, Cloud & DevOps", "Section 7")}
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 500, damping: 28 }}
              className={`px-3 py-2 rounded-xl text-left text-xs font-semibold border transition-colors cursor-pointer ${
                branch === "B.Tech Cyber Security, Cloud & DevOps"
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                  : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200/80"
              }`}
            >
              <span className="block font-bold">Cyber / Cloud</span>
              <span className={`text-[10px] block ${branch.includes("Cyber") ? "text-indigo-100" : "text-slate-400"}`}>Room EB-202</span>
            </motion.button>
          </div>
        </div>

        {/* Form Inputs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
          {/* Programme */}
          <div>
            <label className="text-xs font-bold text-slate-700 mb-1.5 block">
              1. Programme / Course
            </label>
            <select
              id="select-programme"
              value={programme}
              onChange={(e) => handleProgrammeChange(e.target.value)}
              className="w-full px-3 py-2.5 rounded-2xl bg-white border border-slate-200 text-slate-900 text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              {ACADEMIC_PROGRAMMES.map((prog) => (
                <option key={prog} value={prog}>{prog}</option>
              ))}
            </select>
          </div>

          {/* Branch / Specialization */}
          <div>
            <label className="text-xs font-bold text-slate-700 mb-1.5 block">
              2. Branch / Specialization
            </label>
            <select
              id="select-branch"
              value={branch}
              onChange={(e) => handleBranchChange(e.target.value)}
              className="w-full px-3 py-2.5 rounded-2xl bg-white border border-slate-200 text-slate-900 text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              {availableBranches.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          {/* Year */}
          <div>
            <label className="text-xs font-bold text-slate-700 mb-1.5 block">
              3. Academic Year
            </label>
            <select
              id="select-year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full px-3 py-2.5 rounded-2xl bg-white border border-slate-200 text-slate-900 text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              {ACADEMIC_YEARS.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          {/* Semester */}
          <div>
            <label className="text-xs font-bold text-slate-700 mb-1.5 block">
              4. Semester
            </label>
            <select
              id="select-semester"
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              className="w-full px-3 py-2.5 rounded-2xl bg-white border border-slate-200 text-slate-900 text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              {ACADEMIC_SEMESTERS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Section */}
          <div>
            <label className="text-xs font-bold text-slate-700 mb-1.5 block">
              5. Section
            </label>
            <select
              id="select-section"
              value={section}
              onChange={(e) => setSection(e.target.value)}
              className="w-full px-3 py-2.5 rounded-2xl bg-white border border-slate-200 text-slate-900 text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              {availableSections.map((sec) => (
                <option key={sec} value={sec}>{sec}</option>
              ))}
            </select>
          </div>

          {/* Roll Number / Student ID */}
          <div>
            <label className="text-xs font-bold text-slate-700 mb-1.5 block">
              Student Registration No.
            </label>
            <input
              id="input-rollno"
              type="text"
              value={rollNo}
              onChange={(e) => setRollNo(e.target.value)}
              placeholder="e.g. RA2611003010042"
              className="w-full px-3 py-2 rounded-2xl bg-white border border-slate-200 text-slate-900 text-sm font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Live Preview of Academic Mapping */}
        <div className="mt-5 p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
              <School className="w-3.5 h-3.5 text-indigo-600" />
              Active Enrolment Preview
            </span>
            <span className="px-2 py-0.5 rounded-full bg-indigo-200/60 text-indigo-900 text-[10px] font-bold font-mono">
              {previewProfile.programme} • {previewProfile.branch}
            </span>
          </div>

          <div className="text-xs text-slate-700 font-medium">
            <span className="font-bold text-slate-900">
              {previewProfile.programme} {previewProfile.branch}
            </span>{" "}
            &bull; {previewProfile.year} &bull; {previewProfile.semester} &bull; <span className="font-bold text-indigo-700">{previewProfile.section}</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] bg-white/80 p-2.5 rounded-xl border border-indigo-100">
            <div>
              <span className="text-slate-400 block font-semibold">Assigned Room</span>
              <span className="font-bold font-mono text-slate-800">{currentSecMeta.room}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-semibold">Class In-Charge</span>
              <span className="font-bold text-slate-800">{currentSecMeta.classInCharge}</span>
            </div>
          </div>

          {/* Subject list preview */}
          <div>
            <p className="text-[11px] font-semibold text-slate-500 mb-1">
              Mapped Curriculum Subjects ({previewSubjects.length}):
            </p>
            <div className="flex flex-wrap gap-1.5">
              {previewSubjects.slice(0, 5).map((sub) => (
                <span
                  key={sub.code}
                  className="px-2 py-0.5 rounded-md bg-white border border-indigo-200/80 text-[10px] font-medium text-slate-800 shadow-xs"
                >
                  <span className="font-mono font-bold text-indigo-600 mr-1">{sub.code}</span>
                  {sub.name}
                </span>
              ))}
              {previewSubjects.length > 5 && (
                <span className="px-2 py-0.5 rounded-md bg-white/70 border border-dashed border-indigo-200 text-[10px] text-slate-500">
                  +{previewSubjects.length - 5} labs & workshops
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-6 pt-4 border-t border-slate-200/70 flex items-center justify-between gap-3">
          <motion.button
            type="button"
            onClick={onClose}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            className="px-5 py-2.5 rounded-2xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Cancel
          </motion.button>

          <motion.button
            id="save-academic-profile-btn"
            type="button"
            onClick={handleSave}
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.95, y: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 28 }}
            className="px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Apply Academic Profile</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
};
