export type DayOfWeek = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday";

export type ClassType = "Lecture" | "Lab" | "Tutorial" | "Seminar" | "Break" | "Free";

export type ClassStatus = "normal" | "cancelled" | "rescheduled";

export interface ScheduleEvent {
  id: string;
  course: string;
  code: string;
  startTime: string; // e.g., "09:00"
  endTime: string;   // e.g., "09:50"
  room: string;
  faculty: string;
  day: DayOfWeek;
  type: ClassType;
  status: ClassStatus;
  notes?: string;
}

export interface Assignment {
  id: string;
  course: string;
  title: string;
  description?: string;
  dueDate: string;
  dueTime?: string;
  dueCategory: "today" | "soon" | "later";
  completed: boolean;
  priority: "urgent" | "medium" | "low";
  estimatedMins: number;
}

export interface AttendanceRecord {
  id: string;
  course: string;
  code: string;
  attended: number;
  total: number;
  minRequiredPct: number;
  faculty: string;
  lastUpdated: string;
}

export interface Announcement {
  id: string;
  priority: "important" | "reminder" | "notice";
  title: string;
  summary: string;
  department: string;
  date: string;
  read: boolean;
  link?: string;
}

export interface CampusLocation {
  id: string;
  name: string;
  code: string;
  building: string;
  buildingId: string;
  floor: string;
  wing: string;
  walkingTimeMins: number;
  routeInstructions: string[];
  coordinates: { x: number; y: number };
  category: "labs" | "classrooms" | "library" | "student_hub" | "admin";
}

export interface Exam {
  id: string;
  course: string;
  code: string;
  name: string;
  date: string;
  time: string;
  venue: string;
  weightage: string;
  syllabusTopics: string[];
}

export interface FeeItem {
  id: string;
  title: string;
  amount: number;
  currency: string;
  dueDate: string;
  daysRemaining: number;
  status: "pending" | "paid";
  semester: string;
  breakdown: { item: string; amount: number }[];
}

export interface FileAttachment {
  name: string;
  type: "image" | "pdf" | "document";
  mimeType: string;
  dataUrl: string;
  base64: string;
  sizeKb: number;
}

export interface NoteItem {
  id: string;
  title: string;
  subject: string;
  dateAdded: string;
  type: "pdf" | "image" | "handwritten" | "text";
  tags: string[];
  content: string;
  summary?: string;
  aiExplanation?: string;
  practiceQuestions?: string[];
  attachment?: FileAttachment;
}

export type ActiveTab = 
  | "today" 
  | "schedule" 
  | "tasks" 
  | "notes" 
  | "campus" 
  | "attendance" 
  | "exams" 
  | "announcements" 
  | "fees";

export interface SubjectFacultyInfo {
  code: string;
  name: string;
  faculty: string;
  credits: number;
  contactHours: number;
}

export interface TimetableSlot {
  period: number; // 1 to 6
  timeRange: string; // "9:30-10:30", etc.
  subject: string;
  code?: string;
  faculty?: string;
  room?: string;
  type?: ClassType;
  group?: "G-1" | "G-2" | "Both";
}

export interface DayTimetable {
  day: DayOfWeek;
  slots: TimetableSlot[];
}

export interface StudentAcademicProfile {
  programme: string; // e.g. "B.Tech" or "BBA"
  branch: string;    // e.g. "Biomedical Engineering", "Computer Science & Engineering", etc.
  year: string;      // e.g. "1st Year", "2nd Year", etc.
  semester: string;  // e.g. "1" or "Semester 1"
  section: string;   // e.g. "A" or "Section A"
  studentRollNo?: string;
  department?: string;
}

export interface ProgrammeSection {
  id: string; // e.g. "sec-1"
  sectionNumber: number; // 1 to 12
  programme: string; // e.g. "B.Tech. AIML"
  room: string; // e.g. "EB-101"
  classInCharge: string; // e.g. "Dr. Bhuvnesh"
  semester: string; // "I"
  academicSession: string; // "2026-27 (Odd Sem)"
  subjects: SubjectFacultyInfo[];
  schedule: DayTimetable[];
}

export interface CopilotChatMessage {
  id: string;
  sender: "user" | "copilot";
  text: string;
  timestamp: string;
  attachment?: {
    name: string;
    type: "image" | "pdf" | "document";
    mimeType: string;
    dataUrl?: string;
    sizeKb?: number;
  };
}
