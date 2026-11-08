import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  Sparkles, 
  Clock, 
  Calendar, 
  CheckSquare, 
  BookOpen, 
  MapPin, 
  GraduationCap 
} from "lucide-react";
import { ActiveTab, ScheduleEvent, Assignment, AttendanceRecord, NoteItem, CampusLocation, FeeItem, ProgrammeSection, StudentAcademicProfile } from "./types";
import { 
  initialScheduleEvents, 
  initialAssignments, 
  initialAttendance, 
  initialNotes, 
  initialCampusLocations, 
  initialFeeItem, 
  initialAnnouncements 
} from "./data/mockData";
import { allProgrammes, convertProgrammeToScheduleEvents } from "./data/timetableData";
import { SECTION_METADATA_MAP } from "./data/academicOnboarding";
import { 
  DEFAULT_ACADEMIC_PROFILE, 
  getStudentTimetable, 
  getMatchingProgrammeSection, 
  getStudentAttendance,
  getStudentAssignments,
  getStudentNotes,
  getStudentAnnouncements,
  getStudentAcademicProfile,
  saveStudentAcademicProfile
} from "./data/academicCatalog";

import { BackgroundAmbient } from "./components/BackgroundAmbient";
import { HeaderNav } from "./components/HeaderNav";
import { VerticalNav } from "./components/VerticalNav";
import { AuthModal } from "./components/AuthModal";
import { AcademicProfileModal } from "./components/AcademicProfileModal";
import { TodayScreen } from "./components/TodayScreen";
import { ScheduleScreen } from "./components/ScheduleScreen";
import { AttendanceScreen } from "./components/AttendanceScreen";
import { TasksScreen } from "./components/TasksScreen";
import { NotesScreen } from "./components/NotesScreen";
import { CampusMapScreen } from "./components/CampusMapScreen";
import { AnnouncementsScreen } from "./components/AnnouncementsScreen";
import { FeesScreen } from "./components/FeesScreen";
import { CopilotDrawer } from "./components/CopilotDrawer";
import { LandingPage } from "./components/LandingPage";
import { AuthPage } from "./components/AuthPage";
import { OnboardingPage } from "./components/OnboardingPage";
import { AuthProvider, useAuth } from "./firebase/authContext";
import { 
  subscribeAssignments, 
  subscribeNotes, 
  subscribeSchedule, 
  subscribeAttendance,
  syncAssignment,
  syncNote,
  syncScheduleEvent,
  syncAttendanceRecord,
  seedUserDataIfEmpty,
  syncAcademicProfile,
  fetchAcademicProfile
} from "./firebase/firestoreService";

interface MainAppProps {
  initialProfile?: StudentAcademicProfile;
  onNavigateLanding?: () => void;
}

function MainApp({ initialProfile, onNavigateLanding }: MainAppProps) {
  const [activeTab, setActiveTab] = useState<ActiveTab>("today");
  const { user } = useAuth();

  // Academic Enrolment Profile State (stored per student)
  const [academicProfile, setAcademicProfile] = useState<StudentAcademicProfile>(() => {
    return initialProfile || getStudentAcademicProfile();
  });
  const [isAcademicProfileModalOpen, setIsAcademicProfileModalOpen] = useState(false);

  // Section selection & state
  const [activeSectionId, setActiveSectionId] = useState<string>(() => {
    const prof = getStudentAcademicProfile();
    const matching = getMatchingProgrammeSection(prof);
    return matching.id || "sec-1";
  });

  // Main interactive state - initialized dynamically with student's timetable for active academic profile
  const [scheduleEvents, setScheduleEvents] = useState<ScheduleEvent[]>(() => {
    const prof = getStudentAcademicProfile();
    return getStudentTimetable(prof);
  });
  const [assignments, setAssignments] = useState<Assignment[]>(() => {
    const prof = getStudentAcademicProfile();
    return getStudentAssignments(prof);
  });
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => {
    const prof = getStudentAcademicProfile();
    return getStudentAttendance(prof);
  });
  const [notes, setNotes] = useState<NoteItem[]>(() => {
    const prof = getStudentAcademicProfile();
    return getStudentNotes(prof);
  });
  const [campusLocations] = useState<CampusLocation[]>(initialCampusLocations);
  const [feeItem, setFeeItem] = useState<FeeItem>(initialFeeItem);
  const [announcements, setAnnouncements] = useState(() => {
    const prof = getStudentAcademicProfile();
    return getStudentAnnouncements(prof);
  });

  // Copilot Assistant state
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [copilotPresetPrompt, setCopilotPresetPrompt] = useState<string | undefined>();

  // Mobile navigation and auth modal state
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Campus cross-link selection
  const [selectedCampusCode, setSelectedCampusCode] = useState<string | undefined>("Lab 3");

  // Sync with Firestore when user is authenticated
  useEffect(() => {
    if (!user) return;

    // Fetch remote academic profile if available
    fetchAcademicProfile(user.uid)
      .then((remoteProf) => {
        if (remoteProf) {
          setAcademicProfile(remoteProf);
          saveStudentAcademicProfile(remoteProf);
          const events = getStudentTimetable(remoteProf);
          setScheduleEvents(events);
          const sec = getMatchingProgrammeSection(remoteProf);
          if (sec) {
            setActiveSectionId(sec.id);
            localStorage.setItem("srm_user_section_id", sec.id);
          }
          setAssignments(getStudentAssignments(remoteProf));
          setAttendance(getStudentAttendance(remoteProf));
          setNotes(getStudentNotes(remoteProf));
          setAnnouncements(getStudentAnnouncements(remoteProf));
        } else {
          // When someone logs in and doesn't have an academic profile configured yet, ask on login!
          const askedKey = `academic_profile_onboarding_shown_${user.uid}`;
          if (!localStorage.getItem(askedKey)) {
            localStorage.setItem(askedKey, "true");
            setIsAcademicProfileModalOpen(true);
          }
        }
      })
      .catch((err) => console.warn("Academic profile fetch error:", err));

    // First, seed data if user collection is completely empty
    seedUserDataIfEmpty(user.uid, {
      assignments: initialAssignments,
      notes: initialNotes,
      schedule: initialScheduleEvents,
      attendance: initialAttendance,
    });

    // Subscriptions
    const unsubAssignments = subscribeAssignments(user.uid, (remoteList) => {
      if (remoteList.length > 0) setAssignments(remoteList);
    });

    const unsubNotes = subscribeNotes(user.uid, (remoteList) => {
      if (remoteList.length > 0) setNotes(remoteList);
    });

    const unsubSchedule = subscribeSchedule(user.uid, (remoteList) => {
      if (remoteList.length > 0) setScheduleEvents(remoteList);
    });

    const unsubAttendance = subscribeAttendance(user.uid, (remoteList) => {
      if (remoteList.length > 0) setAttendance(remoteList);
    });

    return () => {
      unsubAssignments();
      unsubNotes();
      unsubSchedule();
      unsubAttendance();
    };
  }, [user]);

  // Handler for Academic Profile changes (Dynamic filtering of timetable & classes)
  const handleSaveAcademicProfile = (newProfile: StudentAcademicProfile) => {
    setAcademicProfile(newProfile);
    saveStudentAcademicProfile(newProfile);

    // 1. Calculate dynamic timetable for the selected programme + branch + year + sem + section
    const dynamicEvents = getStudentTimetable(newProfile);
    setScheduleEvents(dynamicEvents);

    // 2. Map matching official section ID for grid
    const matchingSection = getMatchingProgrammeSection(newProfile);
    if (matchingSection) {
      setActiveSectionId(matchingSection.id);
      localStorage.setItem("srm_user_section_id", matchingSection.id);
    }

    // 3. Dynamically set attendance, assignments, notes, and announcements strictly belonging to the new profile
    const dynamicAttendance = getStudentAttendance(newProfile);
    setAttendance(dynamicAttendance);

    const dynamicAssignments = getStudentAssignments(newProfile);
    setAssignments(dynamicAssignments);

    const dynamicNotes = getStudentNotes(newProfile);
    setNotes(dynamicNotes);

    const dynamicAnnouncements = getStudentAnnouncements(newProfile);
    setAnnouncements(dynamicAnnouncements);

    // 4. Persist to Firestore if user is authenticated
    if (user) {
      syncAcademicProfile(user.uid, newProfile).catch((err) => console.warn(err));
      dynamicEvents.forEach((ev) => syncScheduleEvent(user.uid, ev).catch(console.warn));
      dynamicAttendance.forEach((rec) => syncAttendanceRecord(user.uid, rec).catch(console.warn));
      dynamicAssignments.forEach((task) => syncAssignment(user.uid, task).catch(console.warn));
      dynamicNotes.forEach((n) => syncNote(user.uid, n).catch(console.warn));
    }
  };

  const handleResolveSectionNumber = (sectionNumber: number) => {
    const meta = SECTION_METADATA_MAP[sectionNumber];
    if (!meta) return;

    const newProfile: StudentAcademicProfile = {
      programme: "B.Tech",
      branch: meta.programme,
      year: "1st Year",
      semester: "Semester 1",
      section: `Section ${sectionNumber}`,
      department: `Department of ${meta.programme}`,
      studentRollNo: academicProfile.studentRollNo,
    };

    handleSaveAcademicProfile(newProfile);
    sessionStorage.setItem("srm_onboarding_resolved_section", String(sectionNumber));
  };

  // Event handlers with Cloud Firestore persistence
  const handleAddScheduleEvent = (newEvent: ScheduleEvent) => {
    setScheduleEvents((prev) => [...prev, newEvent]);
    if (user) {
      syncScheduleEvent(user.uid, newEvent).catch((err) => console.warn(err));
    }
  };

  const handleUpdateScheduleEvent = (updated: ScheduleEvent) => {
    setScheduleEvents((prev) => prev.map((ev) => (ev.id === updated.id ? updated : ev)));
    if (user) {
      syncScheduleEvent(user.uid, updated).catch((err) => console.warn(err));
    }
  };

  const handleDeleteScheduleEvent = (id: string) => {
    setScheduleEvents((prev) => prev.filter((ev) => ev.id !== id));
  };

  const handleApplyProgrammeSchedule = (section: ProgrammeSection) => {
    setActiveSectionId(section.id);
    localStorage.setItem("srm_user_section_id", section.id);
    const converted = convertProgrammeToScheduleEvents(section);
    setScheduleEvents(converted);

    // Sync corresponding academic profile
    const meta = SECTION_METADATA_MAP[section.sectionNumber];
    if (meta) {
      const updatedProfile: StudentAcademicProfile = {
        programme: "B.Tech",
        branch: meta.programme,
        year: "1st Year",
        semester: "Semester 1",
        section: `Section ${section.sectionNumber}`,
        department: `Department of ${meta.programme}`,
        studentRollNo: academicProfile.studentRollNo,
      };
      setAcademicProfile(updatedProfile);
      saveStudentAcademicProfile(updatedProfile);
      if (user) {
        syncAcademicProfile(user.uid, updatedProfile).catch(console.warn);
      }
    }

    if (user) {
      converted.forEach((ev) => syncScheduleEvent(user.uid, ev).catch(console.warn));
    }
  };

  const handleToggleTaskComplete = (id: string) => {
    setAssignments((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const updated = { ...t, completed: !t.completed };
          if (user) {
            syncAssignment(user.uid, updated).catch((err) => console.warn(err));
          }
          return updated;
        }
        return t;
      })
    );
  };

  const handleAddAssignment = (task: Assignment) => {
    setAssignments((prev) => [task, ...prev]);
    if (user) {
      syncAssignment(user.uid, task).catch((err) => console.warn(err));
    }
  };

  const handleDeleteAssignment = (id: string) => {
    setAssignments((prev) => prev.filter((t) => t.id !== id));
  };

  const handleAddNote = (note: NoteItem) => {
    setNotes((prev) => [note, ...prev]);
    if (user) {
      syncNote(user.uid, note).catch((err) => console.warn(err));
    }
  };

  const handleUpdateAttendance = (records: AttendanceRecord[]) => {
    setAttendance(records);
    if (user) {
      records.forEach((rec) => {
        syncAttendanceRecord(user.uid, rec).catch((err) => console.warn(err));
      });
    }
  };

  const handlePayFee = () => {
    setFeeItem((prev) => ({ ...prev, status: "paid" }));
  };

  const openCopilotWithPrompt = (prompt?: string) => {
    setCopilotPresetPrompt(prompt);
    setIsCopilotOpen(true);
  };

  // Math attendance percentage for Copilot context
  const mathRecord = attendance.find((a) => a.course === "Mathematics");
  const mathAttendancePct = mathRecord
    ? Math.round((mathRecord.attended / mathRecord.total) * 100)
    : 71;

  return (
    <div className="min-h-screen text-slate-800 bg-[#F2F4F7] relative selection:bg-indigo-500/20 selection:text-indigo-900 font-sans antialiased flex flex-col md:flex-row">
      {/* 1. Immersive Ambient Light Background */}
      <BackgroundAmbient />

      {/* 2. Vertical Navigation Menu on Left Side of Screen */}
      <VerticalNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        attendance={attendance}
        announcements={announcements}
        fees={feeItem}
        onOpenCopilot={() => openCopilotWithPrompt()}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        isMobileOpen={isMobileNavOpen}
        onCloseMobile={() => setIsMobileNavOpen(false)}
        academicProfile={academicProfile}
        onOpenAcademicProfile={() => setIsAcademicProfileModalOpen(true)}
      />

      {/* 3. Main Workspace Area (Offset by Vertical Sidebar on Desktop) */}
      <div className="flex-1 min-w-0 md:pl-64 lg:pl-72 flex flex-col relative z-10">
        {/* Workspace Top Header */}
        <HeaderNav
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenCopilot={() => openCopilotWithPrompt()}
          attendance={attendance}
          announcements={announcements}
          fees={feeItem}
          onToggleMobileNav={() => setIsMobileNavOpen(!isMobileNavOpen)}
          academicProfile={academicProfile}
          onOpenAcademicProfile={() => setIsAcademicProfileModalOpen(true)}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
        />

        {/* Main Content Workspace */}
        <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-20 md:pb-16 relative z-10">
          {activeTab === "today" && (
            <TodayScreen
              scheduleEvents={scheduleEvents}
              assignments={assignments}
              attendance={attendance}
              feeItem={feeItem}
              setActiveTab={setActiveTab}
              onOpenCopilot={openCopilotWithPrompt}
              onSelectCampusLocation={(room) => {
                setSelectedCampusCode(room);
                setActiveTab("campus");
              }}
              onToggleTaskComplete={handleToggleTaskComplete}
              academicProfile={academicProfile}
              onOpenAcademicProfile={() => setIsAcademicProfileModalOpen(true)}
            />
          )}

          {activeTab === "schedule" && (
            <ScheduleScreen
              scheduleEvents={scheduleEvents}
              onAddEvent={handleAddScheduleEvent}
              onUpdateEvent={handleUpdateScheduleEvent}
              onDeleteEvent={handleDeleteScheduleEvent}
              onSelectCampusLocation={(room) => {
                setSelectedCampusCode(room);
                setActiveTab("campus");
              }}
              setActiveTab={setActiveTab}
              activeSectionId={activeSectionId}
              onApplyProgrammeSchedule={handleApplyProgrammeSchedule}
              academicProfile={academicProfile}
              onOpenAcademicProfile={() => setIsAcademicProfileModalOpen(true)}
            />
          )}

          {activeTab === "attendance" && (
            <AttendanceScreen
              attendance={attendance}
              onUpdateAttendance={handleUpdateAttendance}
              onOpenCopilot={openCopilotWithPrompt}
              academicProfile={academicProfile}
              onOpenAcademicProfile={() => setIsAcademicProfileModalOpen(true)}
            />
          )}

          {activeTab === "tasks" && (
            <TasksScreen
              assignments={assignments}
              onToggleComplete={handleToggleTaskComplete}
              onAddAssignment={handleAddAssignment}
              onDeleteAssignment={handleDeleteAssignment}
            />
          )}

          {activeTab === "notes" && (
            <NotesScreen 
              notes={notes} 
              onAddNote={handleAddNote} 
              onOpenCopilot={openCopilotWithPrompt}
            />
          )}

          {activeTab === "campus" && (
            <CampusMapScreen
              locations={campusLocations}
              selectedLocationCode={selectedCampusCode}
              onSelectLocation={(code) => setSelectedCampusCode(code)}
            />
          )}

          {activeTab === "announcements" && (
            <AnnouncementsScreen announcements={announcements} />
          )}

          {activeTab === "fees" && (
            <FeesScreen feeItem={feeItem} onPayFee={handlePayFee} />
          )}
        </main>
      </div>

      {/* 4. Immersive UI Floating Copilot Trigger Button with Futuristic Radiating Glowing Ring Pulse */}
      <motion.button
        id="floating-copilot-btn"
        type="button"
        onClick={() => openCopilotWithPrompt()}
        aria-label="Ask College Copilot AI"
        title="Ask College Copilot AI Anything"
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 500, damping: 28 }}
        className="fixed bottom-6 right-6 sm:right-8 bg-slate-950/90 backdrop-blur-xl text-white hover:bg-slate-900 shadow-2xl shadow-indigo-950/50 hover:shadow-[0_10px_35px_rgba(99,102,241,0.3)] rounded-full px-4 py-3 flex items-center gap-3 group z-40 transition-colors cursor-pointer border border-indigo-500/30 hover:border-indigo-400/60 overflow-visible gpu-accelerated"
      >
        {/* Radiating Glowing Ring Pulse Wrapper */}
        <div className="relative flex items-center justify-center">
          {/* Concentric glowing ring pulse waves radiating outward on hover */}
          <span 
            aria-hidden="true" 
            className="absolute -inset-1 rounded-full pointer-events-none opacity-0 group-hover:opacity-100 group-hover:animate-copilot-ring-1 transition-opacity duration-300 border border-indigo-400/70" 
          />
          <span 
            aria-hidden="true" 
            className="absolute -inset-1 rounded-full pointer-events-none opacity-0 group-hover:opacity-100 group-hover:animate-copilot-ring-2 transition-opacity duration-300 border border-purple-400/60" 
          />
          <span 
            aria-hidden="true" 
            className="absolute -inset-1 rounded-full pointer-events-none opacity-0 group-hover:opacity-100 group-hover:animate-copilot-ring-3 transition-opacity duration-300 border border-indigo-300/40" 
          />
          
          {/* Ambient soft glow aura behind icon badge */}
          <div 
            aria-hidden="true" 
            className="absolute -inset-2 rounded-full bg-gradient-to-r from-indigo-500/40 to-purple-500/40 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" 
          />

          {/* Central Icon Badge */}
          <div className="relative z-10 w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/50 group-hover:shadow-[0_0_18px_rgba(129,140,248,0.7)] group-hover:rotate-12 transition-all duration-300">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
        </div>

        <span className="text-xs font-semibold tracking-tight text-slate-100 group-hover:text-white transition-colors">
          Ask Copilot Anything
        </span>
      </motion.button>

      {/* 5. AI Copilot Drawer */}
      <CopilotDrawer
        isOpen={isCopilotOpen}
        onClose={() => {
          setIsCopilotOpen(false);
          setCopilotPresetPrompt(undefined);
        }}
        presetPrompt={copilotPresetPrompt}
        setActiveTab={setActiveTab}
        mathAttendancePct={mathAttendancePct}
        academicProfile={academicProfile}
        onResolveSection={handleResolveSectionNumber}
      />

      {/* 6. Cloud Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={() => setIsAcademicProfileModalOpen(true)}
      />

      {/* 7. Dynamic Academic Profile Modal */}
      <AcademicProfileModal
        isOpen={isAcademicProfileModalOpen}
        onClose={() => setIsAcademicProfileModalOpen(false)}
        currentProfile={academicProfile}
        onSave={handleSaveAcademicProfile}
        onSaveProfile={handleSaveAcademicProfile}
      />
    </div>
  );
}

function AppRouter() {
  const [route, setRoute] = useState<string>(() => {
    const path = window.location.pathname;
    if (path === "/auth") return "/auth";
    if (path === "/onboarding") return "/onboarding";
    if (path === "/app" || path === "/dashboard") return "/app";
    // Check if user came via direct entry or landing
    return "/";
  });

  const [onboardedProfile, setOnboardedProfile] = useState<StudentAcademicProfile | undefined>();

  // Sync browser popstate (back/forward button)
  useEffect(() => {
    const handlePopState = () => {
      const p = window.location.pathname;
      if (p === "/auth") setRoute("/auth");
      else if (p === "/onboarding") setRoute("/onboarding");
      else if (p === "/app" || p === "/dashboard") setRoute("/app");
      else setRoute("/");
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const navigateTo = (newRoute: string) => {
    setRoute(newRoute);
    try {
      window.history.pushState({}, "", newRoute);
    } catch {
      // In restricted iframe environments
    }
  };

  const handleOnboardingComplete = (profile: StudentAcademicProfile) => {
    setOnboardedProfile(profile);
    navigateTo("/app");
  };

  if (route === "/auth") {
    return (
      <AuthPage
        onBackToLanding={() => navigateTo("/")}
        onNavigateOnboarding={() => navigateTo("/onboarding")}
        onNavigateApp={() => navigateTo("/app")}
      />
    );
  }

  if (route === "/onboarding") {
    return (
      <OnboardingPage
        initialProfile={onboardedProfile}
        onComplete={handleOnboardingComplete}
      />
    );
  }

  if (route === "/app") {
    return (
      <MainApp
        initialProfile={onboardedProfile}
        onNavigateLanding={() => navigateTo("/")}
      />
    );
  }

  // Default: Landing / Preview page (/)
  return (
    <LandingPage
      onNavigateAuth={() => navigateTo("/auth")}
      onNavigateAppDirect={() => navigateTo("/app")}
    />
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}
