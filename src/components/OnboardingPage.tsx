import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  GraduationCap, 
  ArrowRight, 
  Sparkles, 
  Building2, 
  Layers, 
  BookOpen, 
  Calendar, 
  CheckCircle2, 
  User, 
  Hash, 
  ShieldCheck, 
  Loader2 
} from "lucide-react";
import { useAuth } from "../firebase/authContext";
import { StudentAcademicProfile } from "../types";
import { 
  ACADEMIC_PROGRAMMES, 
  ACADEMIC_BRANCHES, 
  ACADEMIC_YEARS, 
  ACADEMIC_SEMESTERS, 
  getSectionsForBranch,
  getStudentSubjects,
  saveStudentAcademicProfile,
  getMatchingProgrammeSection
} from "../data/academicCatalog";
import { SECTION_METADATA_MAP } from "../data/academicOnboarding";
import { syncAcademicProfile } from "../firebase/firestoreService";

interface OnboardingPageProps {
  onComplete: (profile: StudentAcademicProfile) => void;
  initialProfile?: StudentAcademicProfile;
}

export const OnboardingPage: React.FC<OnboardingPageProps> = ({
  onComplete,
  initialProfile,
}) => {
  const { user } = useAuth();

  // Form fields per user request:
  // Full name, University, Programme, Branch, Academic year, Semester, Section
  const [fullName, setFullName] = useState(user?.displayName || "Alex Morgan");
  const [university, setUniversity] = useState("SRM Institute of Science & Technology");
  const [programme, setProgramme] = useState(initialProfile?.programme || "B.Tech");
  const [branch, setBranch] = useState(initialProfile?.branch || "B.Tech AIML");
  const [academicYear, setAcademicYear] = useState(initialProfile?.year || "1st Year");
  const [semester, setSemester] = useState(initialProfile?.semester || "Semester 1");
  const [section, setSection] = useState(initialProfile?.section || "Section 1");
  const [rollNo, setRollNo] = useState(initialProfile?.studentRollNo || "RA2611003010042");

  const [saving, setSaving] = useState(false);

  // Available branches for selected programme
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

  // Extract section number from selection (e.g. "Section 1" -> 1)
  const secNumberMatch = section.match(/\d+/);
  const currentSecNumber = secNumberMatch ? parseInt(secNumberMatch[0], 10) : 1;
  const sectionMeta = SECTION_METADATA_MAP[currentSecNumber] || SECTION_METADATA_MAP[1];

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const fullProfile: StudentAcademicProfile = {
      programme,
      branch,
      year: academicYear,
      semester,
      section,
      department: `Department of ${branch}`,
      studentRollNo: rollNo || undefined,
    };

    try {
      // 1. Save locally
      saveStudentAcademicProfile(fullProfile);

      // 2. Save to Firestore if user is authenticated
      if (user) {
        await syncAcademicProfile(user.uid, fullProfile);
        localStorage.setItem(`academic_profile_onboarding_completed_${user.uid}`, "true");
      }

      // 3. Complete and redirect into the main application
      onComplete(fullProfile);
    } catch (err) {
      console.warn("Could not save academic profile during onboarding:", err);
      // Proceed gracefully into application with local profile
      onComplete(fullProfile);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Ambient background glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-indigo-600/15 via-purple-600/10 to-transparent blur-[140px] rounded-full" />
        <div className="absolute bottom-[5%] right-[10%] w-[500px] h-[500px] bg-cyan-500/10 blur-[140px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-2xl bg-slate-900/80 backdrop-blur-2xl border border-white/[0.08] rounded-3xl p-6 sm:p-10 shadow-[0_25px_60px_rgba(0,0,0,0.6)] relative z-10"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 mx-auto flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 mb-4">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Academic Profile Setup</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-md mx-auto">
            Configure your enrolled branch, semester, and section so College Copilot loads your exact official timetable and room allocations.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleFormSubmit} className="space-y-6">
          {/* Step 1: Personal & College Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Alex Morgan"
                  className="w-full bg-slate-950/60 border border-white/[0.08] focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors"
                />
                <User className="w-4 h-4 text-slate-500 absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">University / Campus</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                  placeholder="e.g. SRM Institute of Science & Technology"
                  className="w-full bg-slate-950/60 border border-white/[0.08] focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors"
                />
                <Building2 className="w-4 h-4 text-slate-500 absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Step 2: Programme & Branch */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Programme</label>
              <select
                value={programme}
                onChange={(e) => handleProgrammeChange(e.target.value)}
                className="w-full bg-slate-950/60 border border-white/[0.08] focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none transition-colors cursor-pointer"
              >
                {ACADEMIC_PROGRAMMES.map((prog) => (
                  <option key={prog} value={prog} className="bg-slate-900 text-white">
                    {prog}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Branch / Specialization</label>
              <select
                value={branch}
                onChange={(e) => handleBranchChange(e.target.value)}
                className="w-full bg-slate-950/60 border border-white/[0.08] focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none transition-colors cursor-pointer"
              >
                {availableBranches.map((br) => (
                  <option key={br} value={br} className="bg-slate-900 text-white">
                    {br}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Step 3: Year, Semester & Section */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Academic Year</label>
              <select
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                className="w-full bg-slate-950/60 border border-white/[0.08] focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none transition-colors cursor-pointer"
              >
                {ACADEMIC_YEARS.map((yr) => (
                  <option key={yr} value={yr} className="bg-slate-900 text-white">
                    {yr}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Semester</label>
              <select
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="w-full bg-slate-950/60 border border-white/[0.08] focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none transition-colors cursor-pointer"
              >
                {ACADEMIC_SEMESTERS.map((sem) => (
                  <option key={sem} value={sem} className="bg-slate-900 text-white">
                    {sem}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Assigned Section</label>
              <select
                value={section}
                onChange={(e) => setSection(e.target.value)}
                className="w-full bg-slate-950/60 border border-white/[0.08] focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none transition-colors cursor-pointer"
              >
                {availableSections.map((sec) => (
                  <option key={sec} value={sec} className="bg-slate-900 text-white">
                    {sec}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Roll No / Registration ID */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Registration / Roll Number <span className="text-slate-500">(Optional)</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={rollNo}
                onChange={(e) => setRollNo(e.target.value)}
                placeholder="e.g. RA2611003010042"
                className="w-full bg-slate-950/60 border border-white/[0.08] focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors"
              />
              <Hash className="w-4 h-4 text-slate-500 absolute right-3 top-3 pointer-events-none" />
            </div>
          </div>

          {/* Live Section Confirmation Badge */}
          {sectionMeta && (
            <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-xs">
              <div className="flex items-center gap-2 text-indigo-300 font-semibold mb-1">
                <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                <span>Mapped to Official Timetable Section {sectionMeta.sectionNumber}</span>
              </div>
              <div className="text-slate-300 text-[11px] grid grid-cols-2 gap-2 mt-2">
                <div>• Assigned Room: <strong className="text-white">{sectionMeta.room}</strong></div>
                <div>• Class In-Charge: <strong className="text-white">{sectionMeta.classInCharge}</strong></div>
              </div>
            </div>
          )}

          {/* Submit and Launch Button */}
          <button
            type="submit"
            disabled={saving}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-600 to-indigo-600 hover:from-indigo-400 hover:to-purple-500 text-white text-xs sm:text-sm font-semibold tracking-wide shadow-xl shadow-indigo-500/25 transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving Academic Setup...</span>
              </>
            ) : (
              <>
                <span>Save Profile & Launch College Copilot</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};
