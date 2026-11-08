import { 
  StudentAcademicProfile, 
  ScheduleEvent, 
  SubjectFacultyInfo, 
  AttendanceRecord, 
  Assignment, 
  Exam, 
  Announcement, 
  NoteItem, 
  DayOfWeek,
  ProgrammeSection
} from "../types";
import { allProgrammes, convertProgrammeToScheduleEvents } from "./timetableData";
import { SECTION_METADATA_MAP, getProgrammeSectionByNumber } from "./academicOnboarding";

export const ACADEMIC_PROGRAMMES = ["B.Tech"] as const;

export const ACADEMIC_BRANCHES: Record<string, string[]> = {
  "B.Tech": [
    "B.Tech AIML",
    "B.Tech DSAI",
    "B.Tech AIML + DSAI",
    "B.Tech Cyber Security, Cloud & DevOps",
    "B.Tech CSE Core",
    "B.Tech BME",
    "B.Tech CE / ME / EEE / ECE / Robotics",
  ],
};

export const ACADEMIC_YEARS = [
  "1st Year",
  "2nd Year",
  "3rd Year",
  "4th Year",
] as const;

export const ACADEMIC_SEMESTERS = [
  "Semester 1",
  "Semester 2",
] as const;

export const ACADEMIC_SECTIONS = [
  "Section 1",
  "Section 2",
  "Section 3",
  "Section 4",
  "Section 5",
  "Section 6",
  "Section 7",
  "Section 8",
  "Section 9",
  "Section 10",
  "Section 11",
  "Section 12",
] as const;

export function getSectionsForBranch(branchName: string): string[] {
  const b = branchName.toLowerCase();
  if (b.includes("aiml") && !b.includes("dsai")) {
    return ["Section 1", "Section 2", "Section 3", "Section 4"];
  }
  if (b.includes("cse") || b.includes("core")) {
    return ["Section 8", "Section 9", "Section 10"];
  }
  if (b.includes("aiml") && b.includes("dsai")) {
    return ["Section 5"];
  }
  if (b.includes("dsai")) {
    return ["Section 6"];
  }
  if (b.includes("cyber") || b.includes("cloud") || b.includes("devops")) {
    return ["Section 7"];
  }
  if (b.includes("bme") || b.includes("biomedical")) {
    return ["Section 11"];
  }
  if (b.includes("robotics") || b.includes("ece") || b.includes("eee") || b.includes("ce") || b.includes("me")) {
    return ["Section 12"];
  }
  return ["Section 1"];
}

export const DEFAULT_ACADEMIC_PROFILE: StudentAcademicProfile = {
  programme: "B.Tech",
  branch: "B.Tech AIML",
  year: "1st Year",
  semester: "Semester 1",
  section: "Section 1",
  department: "Department of Computer Science & Engineering",
  studentRollNo: "RA2611003010042",
};

export const LOCAL_STORAGE_PROFILE_KEY = "srm_student_academic_profile_v2";

/**
 * 1. Retrieve current student academic profile
 */
export function getStudentAcademicProfile(): StudentAcademicProfile {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_PROFILE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.programme && parsed.branch) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn("Error reading student academic profile from localStorage:", err);
  }
  return DEFAULT_ACADEMIC_PROFILE;
}

/**
 * Save student academic profile to localStorage
 */
export function saveStudentAcademicProfile(profile: StudentAcademicProfile): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_PROFILE_KEY, JSON.stringify(profile));
  } catch (err) {
    console.warn("Error saving student academic profile to localStorage:", err);
  }
}

// -------------------------------------------------------------
// Realistic academic data registry for each programme + branch
// -------------------------------------------------------------

interface ProgrammeDataSet {
  subjects: SubjectFacultyInfo[];
  scheduleEvents: ScheduleEvent[];
  attendance: AttendanceRecord[];
  assignments: Assignment[];
  exams: Exam[];
  announcements: Announcement[];
  notes: NoteItem[];
}

/**
 * B.Tech Biomedical Engineering Dataset
 */
const BME_DATA: ProgrammeDataSet = {
  subjects: [
    { code: "26BM101", name: "Human Anatomy & Physiology", faculty: "Dr. Hemant", credits: 4, contactHours: 4 },
    { code: "26BM102", name: "Introduction to Biomedical Engineering", faculty: "Dr. Ananya Sen", credits: 3, contactHours: 3 },
    { code: "26AS101", name: "Engineering Mathematics-I", faculty: "Dr. Preeti Tyagi", credits: 4, contactHours: 4 },
    { code: "26AS102", name: "Applied Biophysics", faculty: "Dr. Rajiv Sharma", credits: 4, contactHours: 4 },
    { code: "26CS101", name: "Python Programming for Bio-Systems", faculty: "Dr. Priya Nair", credits: 3, contactHours: 3 },
    { code: "26BM151", name: "Biomedical Electronics & Instrumentation Lab", faculty: "Dr. Hemant", credits: 2, contactHours: 3 },
    { code: "26BM152", name: "Anatomy & Physiology Lab", faculty: "Dr. Ananya Sen", credits: 1, contactHours: 2 },
  ],
  scheduleEvents: [
    // Monday
    {
      id: "bme-mon-1",
      course: "Human Anatomy & Physiology",
      code: "26BM101",
      startTime: "09:30",
      endTime: "10:30",
      room: "EB-213",
      faculty: "Dr. Hemant",
      day: "Monday",
      type: "Lecture",
      status: "normal",
      notes: "Cardiovascular hemodynamics and electrical conduction system",
    },
    {
      id: "bme-mon-2",
      course: "Applied Biophysics",
      code: "26AS102",
      startTime: "10:30",
      endTime: "11:30",
      room: "EB-213",
      faculty: "Dr. Rajiv Sharma",
      day: "Monday",
      type: "Lecture",
      status: "normal",
      notes: "Membrane resting potential and Nernst equation derivations",
    },
    {
      id: "bme-mon-3",
      course: "Introduction to Biomedical Engineering",
      code: "26BM102",
      startTime: "11:30",
      endTime: "12:30",
      room: "EB-213",
      faculty: "Dr. Ananya Sen",
      day: "Monday",
      type: "Lecture",
      status: "normal",
      notes: "Biocompatibility criteria & implantable electrode biomaterials",
    },
    {
      id: "bme-mon-4",
      course: "Engineering Mathematics-I",
      code: "26AS101",
      startTime: "12:30",
      endTime: "13:30",
      room: "EB-213",
      faculty: "Dr. Preeti Tyagi",
      day: "Monday",
      type: "Lecture",
      status: "normal",
      notes: "Eigenvalues, Cayley-Hamilton theorem and differential modeling",
    },
    {
      id: "bme-mon-5",
      course: "Biomedical Electronics & Instrumentation Lab",
      code: "26BM151",
      startTime: "14:30",
      endTime: "16:30",
      room: "BME Lab 1",
      faculty: "Dr. Hemant",
      day: "Monday",
      type: "Lab",
      status: "normal",
      notes: "Practical implementation of 50Hz active notch filter for ECG telemetry",
    },

    // Tuesday
    {
      id: "bme-tue-1",
      course: "Python Programming for Bio-Systems",
      code: "26CS101",
      startTime: "09:30",
      endTime: "10:30",
      room: "EB-213",
      faculty: "Dr. Priya Nair",
      day: "Tuesday",
      type: "Lecture",
      status: "normal",
    },
    {
      id: "bme-tue-2",
      course: "Human Anatomy & Physiology",
      code: "26BM101",
      startTime: "10:30",
      endTime: "11:30",
      room: "EB-213",
      faculty: "Dr. Hemant",
      day: "Tuesday",
      type: "Lecture",
      status: "normal",
    },
    {
      id: "bme-tue-3",
      course: "Engineering Mathematics-I",
      code: "26AS101",
      startTime: "11:30",
      endTime: "12:30",
      room: "EB-213",
      faculty: "Dr. Preeti Tyagi",
      day: "Tuesday",
      type: "Tutorial",
      status: "normal",
    },
    {
      id: "bme-tue-4",
      course: "Applied Biophysics",
      code: "26AS102",
      startTime: "12:30",
      endTime: "13:30",
      room: "EB-213",
      faculty: "Dr. Rajiv Sharma",
      day: "Tuesday",
      type: "Lecture",
      status: "normal",
    },
    {
      id: "bme-tue-5",
      course: "Anatomy & Physiology Lab",
      code: "26BM152",
      startTime: "14:30",
      endTime: "16:30",
      room: "Bio-Lab",
      faculty: "Dr. Ananya Sen",
      day: "Tuesday",
      type: "Lab",
      status: "normal",
    },

    // Wednesday
    {
      id: "bme-wed-1",
      course: "Introduction to Biomedical Engineering",
      code: "26BM102",
      startTime: "09:30",
      endTime: "10:30",
      room: "EB-213",
      faculty: "Dr. Ananya Sen",
      day: "Wednesday",
      type: "Lecture",
      status: "normal",
    },
    {
      id: "bme-wed-2",
      course: "Engineering Mathematics-I",
      code: "26AS101",
      startTime: "10:30",
      endTime: "11:30",
      room: "EB-213",
      faculty: "Dr. Preeti Tyagi",
      day: "Wednesday",
      type: "Lecture",
      status: "normal",
    },
    {
      id: "bme-wed-3",
      course: "Python Programming for Bio-Systems",
      code: "26CS101",
      startTime: "11:30",
      endTime: "12:30",
      room: "EB-213",
      faculty: "Dr. Priya Nair",
      day: "Wednesday",
      type: "Lecture",
      status: "normal",
    },
    {
      id: "bme-wed-4",
      course: "Applied Biophysics",
      code: "26AS102",
      startTime: "12:30",
      endTime: "13:30",
      room: "EB-213",
      faculty: "Dr. Rajiv Sharma",
      day: "Wednesday",
      type: "Lecture",
      status: "normal",
    },
    {
      id: "bme-wed-5",
      course: "Python Lab for Bio-Systems",
      code: "26CS101",
      startTime: "14:30",
      endTime: "16:30",
      room: "Computing Lab 2",
      faculty: "Dr. Priya Nair",
      day: "Wednesday",
      type: "Lab",
      status: "normal",
    },

    // Thursday
    {
      id: "bme-thu-1",
      course: "Human Anatomy & Physiology",
      code: "26BM101",
      startTime: "09:30",
      endTime: "10:30",
      room: "EB-213",
      faculty: "Dr. Hemant",
      day: "Thursday",
      type: "Lecture",
      status: "normal",
    },
    {
      id: "bme-thu-2",
      course: "Introduction to Biomedical Engineering",
      code: "26BM102",
      startTime: "10:30",
      endTime: "11:30",
      room: "EB-213",
      faculty: "Dr. Ananya Sen",
      day: "Thursday",
      type: "Lecture",
      status: "normal",
    },
    {
      id: "bme-thu-3",
      course: "Engineering Mathematics-I",
      code: "26AS101",
      startTime: "11:30",
      endTime: "12:30",
      room: "EB-213",
      faculty: "Dr. Preeti Tyagi",
      day: "Thursday",
      type: "Lecture",
      status: "normal",
    },
    {
      id: "bme-thu-4",
      course: "Applied Biophysics",
      code: "26AS102",
      startTime: "12:30",
      endTime: "13:30",
      room: "EB-213",
      faculty: "Dr. Rajiv Sharma",
      day: "Thursday",
      type: "Lecture",
      status: "normal",
    },
    {
      id: "bme-thu-5",
      course: "Bio-Instrumentation Seminar",
      code: "26BM102",
      startTime: "14:30",
      endTime: "15:30",
      room: "EB-213",
      faculty: "Dr. Hemant",
      day: "Thursday",
      type: "Seminar",
      status: "normal",
    },

    // Friday
    {
      id: "bme-fri-1",
      course: "Python Programming for Bio-Systems",
      code: "26CS101",
      startTime: "09:30",
      endTime: "10:30",
      room: "EB-213",
      faculty: "Dr. Priya Nair",
      day: "Friday",
      type: "Lecture",
      status: "normal",
    },
    {
      id: "bme-fri-2",
      course: "Applied Biophysics",
      code: "26AS102",
      startTime: "10:30",
      endTime: "11:30",
      room: "EB-213",
      faculty: "Dr. Rajiv Sharma",
      day: "Friday",
      type: "Lecture",
      status: "normal",
    },
    {
      id: "bme-fri-3",
      course: "Human Anatomy & Physiology",
      code: "26BM101",
      startTime: "11:30",
      endTime: "12:30",
      room: "EB-213",
      faculty: "Dr. Hemant",
      day: "Friday",
      type: "Lecture",
      status: "normal",
    },
    {
      id: "bme-fri-4",
      course: "Engineering Mathematics-I",
      code: "26AS101",
      startTime: "12:30",
      endTime: "13:30",
      room: "EB-213",
      faculty: "Dr. Preeti Tyagi",
      day: "Friday",
      type: "Lecture",
      status: "normal",
    },
    {
      id: "bme-fri-5",
      course: "Workshop Practices",
      code: "26ME151",
      startTime: "14:30",
      endTime: "16:30",
      room: "Mechanical Block",
      faculty: "Dr. Bhuvnesh",
      day: "Friday",
      type: "Lab",
      status: "normal",
    },
  ],
  attendance: [
    {
      id: "att-bme-1",
      course: "Human Anatomy & Physiology",
      code: "26BM101",
      attended: 22,
      total: 25,
      minRequiredPct: 75,
      faculty: "Dr. Hemant",
      lastUpdated: "Yesterday",
    },
    {
      id: "att-bme-2",
      course: "Introduction to Biomedical Engineering",
      code: "26BM102",
      attended: 19,
      total: 20,
      minRequiredPct: 75,
      faculty: "Dr. Ananya Sen",
      lastUpdated: "2 days ago",
    },
    {
      id: "att-bme-3",
      course: "Engineering Mathematics-I",
      code: "26AS101",
      attended: 17,
      total: 24,
      minRequiredPct: 75,
      faculty: "Dr. Preeti Tyagi",
      lastUpdated: "Today",
    },
    {
      id: "att-bme-4",
      course: "Applied Biophysics",
      code: "26AS102",
      attended: 21,
      total: 24,
      minRequiredPct: 75,
      faculty: "Dr. Rajiv Sharma",
      lastUpdated: "Today",
    },
    {
      id: "att-bme-5",
      course: "Python Programming for Bio-Systems",
      code: "26CS101",
      attended: 18,
      total: 20,
      minRequiredPct: 75,
      faculty: "Dr. Priya Nair",
      lastUpdated: "3 days ago",
    },
    {
      id: "att-bme-6",
      course: "Biomedical Electronics & Instrumentation Lab",
      code: "26BM151",
      attended: 10,
      total: 10,
      minRequiredPct: 75,
      faculty: "Dr. Hemant",
      lastUpdated: "Yesterday",
    },
  ],
  assignments: [
    {
      id: "asg-bme-1",
      course: "Biomedical Engineering",
      title: "ECG Signal Acquisition & Filtering Analysis Report",
      description: "Analyze 50Hz noise suppression using analog operational amplifiers and digital Butterworth filters.",
      dueDate: "Tomorrow",
      dueTime: "11:59 PM",
      dueCategory: "today",
      completed: false,
      priority: "urgent",
      estimatedMins: 90,
    },
    {
      id: "asg-bme-2",
      course: "Engineering Mathematics-I",
      title: "Differential Modeling in Hemodynamics Problem Set #4",
      description: "Solve eigenvalues and Navier-Stokes approximations for arterial pulsatile flow.",
      dueDate: "Tomorrow",
      dueTime: "09:30 AM",
      dueCategory: "soon",
      completed: false,
      priority: "urgent",
      estimatedMins: 60,
    },
    {
      id: "asg-bme-3",
      course: "Human Anatomy & Physiology",
      title: "Cardiovascular Pressure-Volume Loop Case Study",
      description: "Write an essay explaining left ventricular cardiac output changes during exercise stress.",
      dueDate: "In 3 days",
      dueTime: "05:00 PM",
      dueCategory: "soon",
      completed: false,
      priority: "medium",
      estimatedMins: 45,
    },
    {
      id: "asg-bme-4",
      course: "Python Programming for Bio-Systems",
      title: "DNA Sequence Motif Finder in FASTA format",
      description: "Implement a k-mer sliding window search algorithm in Python 3.11.",
      dueDate: "Next Week",
      dueTime: "11:59 PM",
      dueCategory: "later",
      completed: false,
      priority: "low",
      estimatedMins: 75,
    },
  ],
  exams: [
    {
      id: "ex-bme-1",
      course: "Human Anatomy & Physiology",
      code: "26BM101",
      name: "Mid-Term Examination 1",
      date: "Oct 14, 2026",
      time: "10:00 AM - 12:00 PM",
      venue: "Main Examination Hall A",
      weightage: "25%",
      syllabusTopics: [
        "Cellular Physiology & Homeostasis",
        "Musculoskeletal & Neuromuscular Junctions",
        "Cardiovascular Hemodynamics & Valves",
        "Respiratory Gas Exchange Dynamics",
      ],
    },
    {
      id: "ex-bme-2",
      course: "Introduction to Biomedical Engineering",
      code: "26BM102",
      name: "Mid-Term Examination 1",
      date: "Oct 17, 2026",
      time: "02:00 PM - 04:00 PM",
      venue: "EB-213 Exam Center",
      weightage: "25%",
      syllabusTopics: [
        "Biopotentials & Electrode-Electrolyte Interfaces",
        "Implantable Biomaterials & Host Response",
        "Diagnostic Ultrasound Principles",
      ],
    },
  ],
  announcements: [
    {
      id: "ann-bme-1",
      priority: "important",
      title: "BME Laboratory Calibration Protocol for Pulse Oximeters",
      summary: "All 1st year Biomedical Engineering students must review safety protocols before operating optical sensor test benches.",
      department: "Biomedical Engineering Dept",
      date: "Sep 07, 2026",
      read: false,
    },
    {
      id: "ann-bme-2",
      priority: "reminder",
      title: "Guest Seminar: Wearable Biosensors & Microfluidics",
      summary: "Lecture by Dr. V. Sen from Medtronic Research on modern continuous glucose monitoring devices.",
      department: "Biomedical Engineering Dept",
      date: "Sep 05, 2026",
      read: true,
    },
  ],
  notes: [
    {
      id: "note-bme-1",
      title: "Resting Membrane Potentials & Action Potentials",
      subject: "Human Anatomy & Physiology",
      dateAdded: "Sep 06, 2026",
      type: "text",
      tags: ["Biophysics", "Neurophysiology", "Membrane"],
      content: "Summary of Goldman-Hodgkin-Katz voltage equation and ion channel permeability transitions during cardiac depolarization.",
      summary: "Key ionic concentrations across cellular membranes and phase 0-4 action potential characteristics.",
    },
    {
      id: "note-bme-2",
      title: "Bio-instrumentation Operational Amplifiers Guide",
      subject: "Biomedical Electronics",
      dateAdded: "Sep 04, 2026",
      type: "handwritten",
      tags: ["ECG", "Instrumentation", "Circuits"],
      content: "Three-opamp instrumentation amplifier configuration with driven-right-leg (DRL) circuitry to minimize common-mode interference.",
      summary: "CMRR optimization calculations and 50Hz notch filter schematics.",
    },
  ],
};

/**
 * B.Tech Computer Science & Engineering Dataset
 */
const CSE_DATA: ProgrammeDataSet = {
  subjects: [
    { code: "26CS102", name: "Data Structures & Algorithms", faculty: "Dr. Sonal", credits: 4, contactHours: 4 },
    { code: "26CS103", name: "Object-Oriented Programming with Java", faculty: "Dr. Nagesha", credits: 4, contactHours: 4 },
    { code: "26AS101", name: "Discrete Mathematical Structures", faculty: "Dr. Preeti Tyagi", credits: 4, contactHours: 4 },
    { code: "26EE102", name: "Digital Logic & Computer Architecture", faculty: "Prof. Ramesh Kumar", credits: 3, contactHours: 3 },
    { code: "26CS104", name: "Principles of Software Engineering", faculty: "Dr. Meenakshi Sundaram", credits: 3, contactHours: 3 },
    { code: "26CS151", name: "Data Structures Lab", faculty: "Dr. Sonal", credits: 2, contactHours: 3 },
    { code: "26CS152", name: "Java Programming Laboratory", faculty: "Dr. Nagesha", credits: 2, contactHours: 3 },
  ],
  scheduleEvents: [
    {
      id: "cse-mon-1",
      course: "Data Structures & Algorithms",
      code: "26CS102",
      startTime: "09:30",
      endTime: "10:30",
      room: "EB-203",
      faculty: "Dr. Sonal",
      day: "Monday",
      type: "Lecture",
      status: "normal",
      notes: "Asymptotic time complexity analysis and Master Theorem for divide-and-conquer",
    },
    {
      id: "cse-mon-2",
      course: "Object-Oriented Programming with Java",
      code: "26CS103",
      startTime: "10:30",
      endTime: "11:30",
      room: "EB-203",
      faculty: "Dr. Nagesha",
      day: "Monday",
      type: "Lecture",
      status: "normal",
      notes: "Abstract classes, interface contracts and runtime polymorphism",
    },
    {
      id: "cse-mon-3",
      course: "Discrete Mathematical Structures",
      code: "26AS101",
      startTime: "11:30",
      endTime: "12:30",
      room: "EB-203",
      faculty: "Dr. Preeti Tyagi",
      day: "Monday",
      type: "Lecture",
      status: "normal",
      notes: "Graph theory: Eulerian circuits and adjacency matrix isomorphisms",
    },
    {
      id: "cse-mon-4",
      course: "Digital Logic & Computer Architecture",
      code: "26EE102",
      startTime: "12:30",
      endTime: "13:30",
      room: "EB-203",
      faculty: "Prof. Ramesh Kumar",
      day: "Monday",
      type: "Lecture",
      status: "normal",
      notes: "Karnaugh map minimization and sequential flip-flop counters",
    },
    {
      id: "cse-mon-5",
      course: "Data Structures Lab",
      code: "26CS151",
      startTime: "14:30",
      endTime: "16:30",
      room: "Computing Lab 4",
      faculty: "Dr. Sonal",
      day: "Monday",
      type: "Lab",
      status: "normal",
      notes: "Implement balanced AVL tree rotations and deletion in C++",
    },

    // Tuesday
    {
      id: "cse-tue-1",
      course: "Principles of Software Engineering",
      code: "26CS104",
      startTime: "09:30",
      endTime: "10:30",
      room: "EB-203",
      faculty: "Dr. Meenakshi Sundaram",
      day: "Tuesday",
      type: "Lecture",
      status: "normal",
    },
    {
      id: "cse-tue-2",
      course: "Data Structures & Algorithms",
      code: "26CS102",
      startTime: "10:30",
      endTime: "11:30",
      room: "EB-203",
      faculty: "Dr. Sonal",
      day: "Tuesday",
      type: "Lecture",
      status: "normal",
    },
    {
      id: "cse-tue-3",
      course: "Discrete Mathematical Structures",
      code: "26AS101",
      startTime: "11:30",
      endTime: "12:30",
      room: "EB-203",
      faculty: "Dr. Preeti Tyagi",
      day: "Tuesday",
      type: "Tutorial",
      status: "normal",
    },
    {
      id: "cse-tue-4",
      course: "Object-Oriented Programming with Java",
      code: "26CS103",
      startTime: "12:30",
      endTime: "13:30",
      room: "EB-203",
      faculty: "Dr. Nagesha",
      day: "Tuesday",
      type: "Lecture",
      status: "normal",
    },
    {
      id: "cse-tue-5",
      course: "Java Programming Laboratory",
      code: "26CS152",
      startTime: "14:30",
      endTime: "16:30",
      room: "Computing Lab 5",
      faculty: "Dr. Nagesha",
      day: "Tuesday",
      type: "Lab",
      status: "normal",
    },
  ],
  attendance: [
    {
      id: "att-cse-1",
      course: "Data Structures & Algorithms",
      code: "26CS102",
      attended: 24,
      total: 26,
      minRequiredPct: 75,
      faculty: "Dr. Sonal",
      lastUpdated: "Today",
    },
    {
      id: "att-cse-2",
      course: "Object-Oriented Programming with Java",
      code: "26CS103",
      attended: 21,
      total: 24,
      minRequiredPct: 75,
      faculty: "Dr. Nagesha",
      lastUpdated: "Yesterday",
    },
    {
      id: "att-cse-3",
      course: "Discrete Mathematical Structures",
      code: "26AS101",
      attended: 16,
      total: 24,
      minRequiredPct: 75,
      faculty: "Dr. Preeti Tyagi",
      lastUpdated: "Today",
    },
    {
      id: "att-cse-4",
      course: "Digital Logic & Computer Architecture",
      code: "26EE102",
      attended: 20,
      total: 22,
      minRequiredPct: 75,
      faculty: "Prof. Ramesh Kumar",
      lastUpdated: "2 days ago",
    },
    {
      id: "att-cse-5",
      course: "Data Structures Lab",
      code: "26CS151",
      attended: 11,
      total: 11,
      minRequiredPct: 75,
      faculty: "Dr. Sonal",
      lastUpdated: "Yesterday",
    },
  ],
  assignments: [
    {
      id: "asg-cse-1",
      course: "Data Structures & Algorithms",
      title: "Red-Black Tree Insertion & Re-balancing Assignment",
      description: "Implement tree rotations and double black resolution in C++ with test vectors.",
      dueDate: "Tomorrow",
      dueTime: "11:59 PM",
      dueCategory: "today",
      completed: false,
      priority: "urgent",
      estimatedMins: 90,
    },
    {
      id: "asg-cse-2",
      course: "Object-Oriented Programming with Java",
      title: "Multithreaded Banking Simulator using synchronized locks",
      description: "Create producer-consumer thread workers with deadlock prevention.",
      dueDate: "In 2 days",
      dueTime: "05:00 PM",
      dueCategory: "soon",
      completed: false,
      priority: "urgent",
      estimatedMins: 60,
    },
    {
      id: "asg-cse-3",
      course: "Discrete Mathematical Structures",
      title: "Combinatorics and Recurrence Relations Problem Sheet",
      description: "Solve homogeneous recurrence relations with initial boundary conditions.",
      dueDate: "In 4 days",
      dueTime: "10:00 AM",
      dueCategory: "soon",
      completed: false,
      priority: "medium",
      estimatedMins: 45,
    },
  ],
  exams: [
    {
      id: "ex-cse-1",
      course: "Data Structures & Algorithms",
      code: "26CS102",
      name: "Mid-Term Examination 1",
      date: "Oct 15, 2026",
      time: "10:00 AM - 12:00 PM",
      venue: "Tech Park Auditorium",
      weightage: "30%",
      syllabusTopics: [
        "Time & Space Complexity",
        "Linked Lists, Stacks, Queues",
        "Trees, Heaps and Priority Queues",
        "Divide and Conquer Sorting",
      ],
    },
  ],
  announcements: [
    {
      id: "ann-cse-1",
      priority: "important",
      title: "ACM Student Chapter Hackathon 2026 Registrations Open",
      summary: "36-hour algorithmic hackathon open to all Computer Science & Engineering students.",
      department: "Computer Science Dept",
      date: "Sep 07, 2026",
      read: false,
    },
  ],
  notes: [
    {
      id: "note-cse-1",
      title: "Dijkstra and A* Shortest Path Algorithms",
      subject: "Data Structures & Algorithms",
      dateAdded: "Sep 05, 2026",
      type: "text",
      tags: ["Graphs", "Algorithms", "Optimization"],
      content: "Priority queue implementation using min-heap for single-source shortest path.",
      summary: "Detailed comparison between greedy Dijkstra and heuristic A* distance functions.",
    },
  ],
};

/**
 * B.Tech Electronics & Communication Engineering Dataset
 */
const ECE_DATA: ProgrammeDataSet = {
  subjects: [
    { code: "26EC101", name: "Network Analysis & Synthesis", faculty: "Dr. R. B. Dubey", credits: 4, contactHours: 4 },
    { code: "26EC102", name: "Semiconductor Devices & Circuits", faculty: "Dr. Monika Verma", credits: 4, contactHours: 4 },
    { code: "26AS101", name: "Engineering Mathematics-I", faculty: "Dr. Preeti Tyagi", credits: 4, contactHours: 4 },
    { code: "26EC103", name: "Signals, Systems & Waveforms", faculty: "Prof. Alok Srivastava", credits: 3, contactHours: 3 },
    { code: "26EC104", name: "Electromagnetic Field Theory", faculty: "Dr. P. Arun", credits: 3, contactHours: 3 },
    { code: "26EC151", name: "Analog Electronics Laboratory", faculty: "Dr. Monika Verma", credits: 2, contactHours: 3 },
    { code: "26EC152", name: "Circuits & Systems Simulation Lab", faculty: "Dr. P. Arun", credits: 2, contactHours: 3 },
  ],
  scheduleEvents: [
    {
      id: "ece-mon-1",
      course: "Network Analysis & Synthesis",
      code: "26EC101",
      startTime: "09:30",
      endTime: "10:30",
      room: "EB-216",
      faculty: "Dr. R. B. Dubey",
      day: "Monday",
      type: "Lecture",
      status: "normal",
      notes: "Thevenin, Norton and Maximum Power Transfer theorems in AC circuits",
    },
    {
      id: "ece-mon-2",
      course: "Semiconductor Devices & Circuits",
      code: "26EC102",
      startTime: "10:30",
      endTime: "11:30",
      room: "EB-216",
      faculty: "Dr. Monika Verma",
      day: "Monday",
      type: "Lecture",
      status: "normal",
      notes: "BJT biasing stability factors and small-signal h-parameter models",
    },
    {
      id: "ece-mon-3",
      course: "Engineering Mathematics-I",
      code: "26AS101",
      startTime: "11:30",
      endTime: "12:30",
      room: "EB-216",
      faculty: "Dr. Preeti Tyagi",
      day: "Monday",
      type: "Lecture",
      status: "normal",
      notes: "Differential equations and Fourier expansion for periodic signals",
    },
    {
      id: "ece-mon-4",
      course: "Signals, Systems & Waveforms",
      code: "26EC103",
      startTime: "12:30",
      endTime: "13:30",
      room: "EB-216",
      faculty: "Prof. Alok Srivastava",
      day: "Monday",
      type: "Lecture",
      status: "normal",
      notes: "Continuous-time convolution integrals and impulse response testing",
    },
    {
      id: "ece-mon-5",
      course: "Analog Electronics Laboratory",
      code: "26EC151",
      startTime: "14:30",
      endTime: "16:30",
      room: "Hardware Lab 3",
      faculty: "Dr. Monika Verma",
      day: "Monday",
      type: "Lab",
      status: "normal",
      notes: "Oscilloscope frequency response measurements of common-emitter amplifiers",
    },
  ],
  attendance: [
    {
      id: "att-ece-1",
      course: "Network Analysis & Synthesis",
      code: "26EC101",
      attended: 21,
      total: 24,
      minRequiredPct: 75,
      faculty: "Dr. R. B. Dubey",
      lastUpdated: "Today",
    },
    {
      id: "att-ece-2",
      course: "Semiconductor Devices & Circuits",
      code: "26EC102",
      attended: 23,
      total: 25,
      minRequiredPct: 75,
      faculty: "Dr. Monika Verma",
      lastUpdated: "Yesterday",
    },
    {
      id: "att-ece-3",
      course: "Engineering Mathematics-I",
      code: "26AS101",
      attended: 16,
      total: 23,
      minRequiredPct: 75,
      faculty: "Dr. Preeti Tyagi",
      lastUpdated: "Today",
    },
  ],
  assignments: [
    {
      id: "asg-ece-1",
      course: "Network Analysis & Synthesis",
      title: "Two-Port Network Parameter Conversion Matrix",
      description: "Convert Z, Y, and ABCD transmission matrices for symmetric T and Pi networks.",
      dueDate: "Tomorrow",
      dueTime: "11:59 PM",
      dueCategory: "today",
      completed: false,
      priority: "urgent",
      estimatedMins: 75,
    },
  ],
  exams: [
    {
      id: "ex-ece-1",
      course: "Semiconductor Devices & Circuits",
      code: "26EC102",
      name: "Mid-Term Examination 1",
      date: "Oct 16, 2026",
      time: "10:00 AM - 12:00 PM",
      venue: "EB-216 Hall",
      weightage: "25%",
      syllabusTopics: [
        "PN Junction Diode Dynamics",
        "Bipolar Junction Transistors",
        "MOSFET V-I Characteristics",
      ],
    },
  ],
  announcements: [
    {
      id: "ann-ece-1",
      priority: "important",
      title: "IEEE Circuits & Systems Workshop on High-Frequency RF",
      summary: "Hands-on session using Keysight Spectrum Analyzers in Hardware Lab 3.",
      department: "ECE Dept",
      date: "Sep 06, 2026",
      read: false,
    },
  ],
  notes: [
    {
      id: "note-ece-1",
      title: "Two-Port Network Parameters Quick Reference",
      subject: "Network Analysis",
      dateAdded: "Sep 04, 2026",
      type: "text",
      tags: ["Circuits", "Z-parameters", "ABCD"],
      content: "Complete formulas for reciprocal and symmetrical passive networks.",
      summary: "Matrix multiplication rules for cascaded transmission two-ports.",
    },
  ],
};

/**
 * BBA - Bachelor of Business Administration Dataset
 */
const BBA_DATA: ProgrammeDataSet = {
  subjects: [
    { code: "26BBA101", name: "Principles of Management & Organization", faculty: "Dr. Shalini Kapoor", credits: 3, contactHours: 3 },
    { code: "26BBA102", name: "Financial Accounting & Reporting", faculty: "Prof. Arvind Gupta", credits: 4, contactHours: 4 },
    { code: "26BBA103", name: "Business Microeconomics", faculty: "Dr. Megha Singhal", credits: 3, contactHours: 3 },
    { code: "26BBA104", name: "Corporate Communication & Negotiation", faculty: "Prof. Rajesh Saxena", credits: 3, contactHours: 3 },
    { code: "26BBA105", name: "Marketing Fundamentals & Consumer Behavior", faculty: "Dr. Sunita Sharma", credits: 3, contactHours: 3 },
    { code: "26BBA151", name: "Business Analytics & Spreadsheet Modeling", faculty: "Prof. Arvind Gupta", credits: 2, contactHours: 3 },
  ],
  scheduleEvents: [
    {
      id: "bba-mon-1",
      course: "Principles of Management & Organization",
      code: "26BBA101",
      startTime: "09:30",
      endTime: "10:30",
      room: "MB-101",
      faculty: "Dr. Shalini Kapoor",
      day: "Monday",
      type: "Lecture",
      status: "normal",
      notes: "Fayol's administrative principles and contemporary agile management models",
    },
    {
      id: "bba-mon-2",
      course: "Financial Accounting & Reporting",
      code: "26BBA102",
      startTime: "10:30",
      endTime: "11:30",
      room: "MB-101",
      faculty: "Prof. Arvind Gupta",
      day: "Monday",
      type: "Lecture",
      status: "normal",
      notes: "Double-entry bookkeeping, trial balance and cash flow statements",
    },
    {
      id: "bba-mon-3",
      course: "Business Microeconomics",
      code: "26BBA103",
      startTime: "11:30",
      endTime: "12:30",
      room: "MB-101",
      faculty: "Dr. Megha Singhal",
      day: "Monday",
      type: "Lecture",
      status: "normal",
      notes: "Price elasticity of demand and market equilibrium pricing",
    },
    {
      id: "bba-mon-4",
      course: "Corporate Communication & Negotiation",
      code: "26BBA104",
      startTime: "12:30",
      endTime: "13:30",
      room: "MB-101",
      faculty: "Prof. Rajesh Saxena",
      day: "Monday",
      type: "Lecture",
      status: "normal",
      notes: "Stakeholder pitch decks and non-verbal executive negotiation cues",
    },
    {
      id: "bba-mon-5",
      course: "Business Analytics & Spreadsheet Modeling",
      code: "26BBA151",
      startTime: "14:30",
      endTime: "16:30",
      room: "Management Lab 1",
      faculty: "Prof. Arvind Gupta",
      day: "Monday",
      type: "Lab",
      status: "normal",
      notes: "Financial modeling in Excel: pivot tables, VLOOKUP and sensitivity analysis",
    },
  ],
  attendance: [
    {
      id: "att-bba-1",
      course: "Principles of Management & Organization",
      code: "26BBA101",
      attended: 22,
      total: 24,
      minRequiredPct: 75,
      faculty: "Dr. Shalini Kapoor",
      lastUpdated: "Today",
    },
    {
      id: "att-bba-2",
      course: "Financial Accounting & Reporting",
      code: "26BBA102",
      attended: 18,
      total: 25,
      minRequiredPct: 75,
      faculty: "Prof. Arvind Gupta",
      lastUpdated: "Yesterday",
    },
    {
      id: "att-bba-3",
      course: "Business Microeconomics",
      code: "26BBA103",
      attended: 20,
      total: 22,
      minRequiredPct: 75,
      faculty: "Dr. Megha Singhal",
      lastUpdated: "2 days ago",
    },
    {
      id: "att-bba-4",
      course: "Marketing Fundamentals & Consumer Behavior",
      code: "26BBA105",
      attended: 21,
      total: 22,
      minRequiredPct: 75,
      faculty: "Dr. Sunita Sharma",
      lastUpdated: "Today",
    },
  ],
  assignments: [
    {
      id: "asg-bba-1",
      course: "Financial Accounting & Reporting",
      title: "Comprehensive Corporate Balance Sheet Analysis",
      description: "Analyze working capital ratios and liquidity metrics for a Fortune 500 retailer.",
      dueDate: "Tomorrow",
      dueTime: "11:59 PM",
      dueCategory: "today",
      completed: false,
      priority: "urgent",
      estimatedMins: 60,
    },
    {
      id: "asg-bba-2",
      course: "Marketing Fundamentals",
      title: "Consumer Journey Mapping & Brand Positioning Case",
      description: "Develop a 4P marketing strategy proposal for eco-friendly consumer goods.",
      dueDate: "In 3 days",
      dueTime: "05:00 PM",
      dueCategory: "soon",
      completed: false,
      priority: "medium",
      estimatedMins: 45,
    },
  ],
  exams: [
    {
      id: "ex-bba-1",
      course: "Principles of Management",
      code: "26BBA101",
      name: "Mid-Term Examination 1",
      date: "Oct 13, 2026",
      time: "10:00 AM - 12:00 PM",
      venue: "Management Seminar Hall",
      weightage: "30%",
      syllabusTopics: [
        "Evolution of Management Thought",
        "Strategic Planning & SWOT Analysis",
        "Organizational Structure & Decentralization",
      ],
    },
  ],
  announcements: [
    {
      id: "ann-bba-1",
      priority: "important",
      title: "Annual Business Plan Pitch & Entrepreneurship Summit",
      summary: "Register your team for the SRM E-Cell Venture Competition 2026.",
      department: "School of Management",
      date: "Sep 07, 2026",
      read: false,
    },
  ],
  notes: [
    {
      id: "note-bba-1",
      title: "Financial Accounting Ratios & DuPont Framework",
      subject: "Financial Accounting",
      dateAdded: "Sep 05, 2026",
      type: "text",
      tags: ["Finance", "Accounting", "Ratios"],
      content: "Return on Equity (ROE) decomposition into profit margin, asset turnover, and equity multiplier.",
      summary: "Formulas and interpretation benchmarks for corporate profitability.",
    },
  ],
};

/**
 * Helper to select the exact data set for a given student academic profile
 */
function resolveProgrammeDataSet(profile: StudentAcademicProfile): ProgrammeDataSet {
  // 1. Check if profile specifies a section number or can be resolved to one
  let secNum: number | undefined;

  const secMatch = profile.section.match(/\d+/);
  if (secMatch) {
    secNum = parseInt(secMatch[0], 10);
  } else {
    // deduce from branch
    const b = profile.branch.toLowerCase();
    if (b.includes("aiml") && b.includes("dsai")) secNum = 5;
    else if (b.includes("dsai")) secNum = 6;
    else if (b.includes("cyber") || b.includes("cloud") || b.includes("devops")) secNum = 7;
    else if (b.includes("bme") || b.includes("biomedical")) secNum = 11;
    else if (b.includes("robotics") || b.includes("ece") || b.includes("eee") || b.includes("ce") || b.includes("me")) secNum = 12;
    else if (b.includes("cse") || b.includes("core")) secNum = 8;
    else if (b.includes("aiml")) secNum = 1;
  }

  const section = secNum ? getProgrammeSectionByNumber(secNum) : undefined;

  if (section) {
    const events = convertProgrammeToScheduleEvents(section);

    // Generate realistic attendance tailored to this exact section's real subjects and real faculty
    const attendance: AttendanceRecord[] = section.subjects.map((sub, idx) => {
      const total = 22 + (idx % 5);
      const isMath = sub.name.toLowerCase().includes("math");
      const attended = isMath ? 17 : total - (idx % 3);
      return {
        id: `att-sec-${section.sectionNumber}-${sub.code}`,
        course: sub.name,
        code: sub.code,
        attended,
        total,
        minRequiredPct: 75,
        faculty: sub.faculty,
        lastUpdated: idx % 2 === 0 ? "Today" : "Yesterday",
      };
    });

    const primarySubject = section.subjects[0];
    const secondarySubject = section.subjects[1] || primarySubject;

    const assignments: Assignment[] = [
      {
        id: `asg-sec-${section.sectionNumber}-1`,
        course: primarySubject.name,
        title: `${primarySubject.name} - Problem Set & Lab Work`,
        description: `Complete the assignment worksheet for ${primarySubject.name} under ${primarySubject.faculty}. Submit before Friday.`,
        dueDate: "Tomorrow",
        dueTime: "11:59 PM",
        dueCategory: "today",
        completed: false,
        priority: "urgent",
        estimatedMins: 75,
      },
      {
        id: `asg-sec-${section.sectionNumber}-2`,
        course: secondarySubject.name,
        title: `${secondarySubject.name} - Technical Report`,
        description: `Analyze weekly lecture units with step-by-step documentation. Faculty in charge: ${secondarySubject.faculty}.`,
        dueDate: "Oct 12, 2026",
        dueTime: "05:00 PM",
        dueCategory: "soon",
        completed: false,
        priority: "medium",
        estimatedMins: 60,
      },
    ];

    const exams: Exam[] = [
      {
        id: `ex-sec-${section.sectionNumber}-1`,
        course: primarySubject.name,
        code: primarySubject.code,
        name: "Mid-Term Examination 1",
        date: "Oct 18, 2026",
        time: "10:00 AM - 12:00 PM",
        venue: `${section.room} Hall`,
        weightage: "30%",
        syllabusTopics: [
          "Core Theoretical Foundations",
          "Analytical Derivations & Calculations",
          "Applied System Problems",
        ],
      },
    ];

    const announcements: Announcement[] = [
      {
        id: `ann-sec-${section.sectionNumber}-1`,
        priority: "important",
        title: `Section ${section.sectionNumber} (${section.programme}) Official Schedule`,
        summary: `Section ${section.sectionNumber} is assigned to Room ${section.room}. Class In-Charge is ${section.classInCharge}.`,
        department: section.programme,
        date: "Sep 08, 2026",
        read: false,
      },
    ];

    const notes: NoteItem[] = [
      {
        id: `note-sec-${section.sectionNumber}-1`,
        title: `${primarySubject.name}: Lecture Unit 1 Notes`,
        subject: primarySubject.name,
        dateAdded: "Sep 07, 2026",
        type: "text",
        tags: [primarySubject.code, section.programme, "Lecture Notes"],
        content: `Detailed lecture review for ${primarySubject.name} conducted by ${primarySubject.faculty} in room ${section.room}. Includes formula derivations, core problem sets, and key exam takeaways.`,
        summary: `Essential reference formulas and class takeaways for ${primarySubject.name}.`,
      },
    ];

    return {
      subjects: section.subjects,
      scheduleEvents: events,
      attendance,
      assignments,
      exams,
      announcements,
      notes,
    };
  }

  // Fallback to Section 1
  const defaultSec = allProgrammes[0];
  return {
    subjects: defaultSec.subjects,
    scheduleEvents: convertProgrammeToScheduleEvents(defaultSec),
    attendance: defaultSec.subjects.map((sub, idx) => ({
      id: `att-default-${sub.code}`,
      course: sub.name,
      code: sub.code,
      attended: 20,
      total: 24,
      minRequiredPct: 75,
      faculty: sub.faculty,
      lastUpdated: "Today",
    })),
    assignments: [],
    exams: [],
    announcements: [],
    notes: [],
  };
}

// -------------------------------------------------------------
// 2. Reusable Functions as requested
// -------------------------------------------------------------

/**
 * Get student's weekly timetable strictly filtered by academic profile
 */
export function getStudentTimetable(profile: StudentAcademicProfile): ScheduleEvent[] {
  const dataset = resolveProgrammeDataSet(profile);
  return dataset.scheduleEvents;
}

/**
 * Parse "HH:MM" to total minutes
 */
function timeToMinutes(timeStr: string): number {
  const [h, m] = timeStr.split(":").map(Number);
  return (h || 0) * 60 + (m || 0);
}

/**
 * Get today's classes and real-time status dynamically calculated from student's timetable
 */
export function getTodaysClasses(
  profile: StudentAcademicProfile,
  dayOfWeek: DayOfWeek = "Monday",
  simulatedMins: number = 620 // 10:20 AM default simulation
) {
  const allEvents = getStudentTimetable(profile);
  const todayEvents = allEvents
    .filter((e) => e.day === dayOfWeek)
    .sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));

  // Determine current class, next class, and remaining
  let currentClass: ScheduleEvent | null = null;
  let nextClass: ScheduleEvent | null = null;
  const upcomingClasses: ScheduleEvent[] = [];

  todayEvents.forEach((ev) => {
    const startMins = timeToMinutes(ev.startTime);
    const endMins = timeToMinutes(ev.endTime);

    if (simulatedMins >= startMins && simulatedMins <= endMins) {
      currentClass = ev;
    } else if (simulatedMins < startMins) {
      if (!nextClass) {
        nextClass = ev;
      }
      upcomingClasses.push(ev);
    }
  });

  return {
    todayEvents,
    currentClass,
    nextClass,
    upcomingClasses,
    remainingCount: upcomingClasses.length,
  };
}

/**
 * Dynamically calculate upcoming classes from student's timetable
 */
export function getUpcomingClasses(
  profile: StudentAcademicProfile,
  count: number = 3,
  simulatedMins: number = 620
): ScheduleEvent[] {
  const { upcomingClasses } = getTodaysClasses(profile, "Monday", simulatedMins);
  return upcomingClasses.slice(0, count);
}

/**
 * Get subjects strictly belonging to the student's selected academic profile
 */
export function getStudentSubjects(profile: StudentAcademicProfile): SubjectFacultyInfo[] {
  const dataset = resolveProgrammeDataSet(profile);
  return dataset.subjects;
}

/**
 * Get attendance records strictly belonging to the student's selected academic profile
 */
export function getStudentAttendance(profile: StudentAcademicProfile): AttendanceRecord[] {
  const dataset = resolveProgrammeDataSet(profile);
  return dataset.attendance;
}

/**
 * Get assignments strictly belonging to the student's selected academic profile
 */
export function getStudentAssignments(profile: StudentAcademicProfile): Assignment[] {
  const dataset = resolveProgrammeDataSet(profile);
  return dataset.assignments;
}

/**
 * Get exams strictly belonging to the student's selected academic profile
 */
export function getStudentExams(profile: StudentAcademicProfile): Exam[] {
  const dataset = resolveProgrammeDataSet(profile);
  return dataset.exams;
}

/**
 * Get announcements strictly belonging to the student's selected academic profile
 */
export function getStudentAnnouncements(profile: StudentAcademicProfile): Announcement[] {
  const dataset = resolveProgrammeDataSet(profile);
  return dataset.announcements;
}

/**
 * Get notes strictly belonging to the student's selected academic profile
 */
export function getStudentNotes(profile: StudentAcademicProfile): NoteItem[] {
  const dataset = resolveProgrammeDataSet(profile);
  return dataset.notes;
}

/**
 * Match academic profile to an existing ProgrammeSection for the official grid view
 */
export function getMatchingProgrammeSection(profile: StudentAcademicProfile): ProgrammeSection {
  // 1. Try section number from profile.section (e.g. "Section 8" -> 8)
  const secMatch = profile.section?.match(/\d+/);
  if (secMatch) {
    const secNum = parseInt(secMatch[0], 10);
    const found = getProgrammeSectionByNumber(secNum);
    if (found) return found;
  }

  // 2. Try deduce from branch
  const b = (profile.branch || "").toLowerCase();
  if (b.includes("aiml") && b.includes("dsai")) return getProgrammeSectionByNumber(5) || allProgrammes[4];
  if (b.includes("dsai")) return getProgrammeSectionByNumber(6) || allProgrammes[5];
  if (b.includes("cyber") || b.includes("cloud") || b.includes("devops")) return getProgrammeSectionByNumber(7) || allProgrammes[6];
  if (b.includes("bme") || b.includes("biomedical")) return getProgrammeSectionByNumber(11) || allProgrammes[10];
  if (b.includes("robotics") || b.includes("ece") || b.includes("eee") || b.includes("ce") || b.includes("me")) return getProgrammeSectionByNumber(12) || allProgrammes[11];
  if (b.includes("cse") || b.includes("core")) return getProgrammeSectionByNumber(8) || allProgrammes[7];
  if (b.includes("aiml")) return getProgrammeSectionByNumber(1) || allProgrammes[0];

  return allProgrammes[0];
}
