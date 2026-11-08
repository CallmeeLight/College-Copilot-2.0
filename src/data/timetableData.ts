import { ProgrammeSection, ScheduleEvent } from "../types";

export const PERIOD_TIMINGS = [
  { period: 1, startTime: "09:30", endTime: "10:30", label: "09:30 - 10:30" },
  { period: 2, startTime: "10:30", endTime: "11:30", label: "10:30 - 11:30" },
  { period: 3, startTime: "11:30", endTime: "12:30", label: "11:30 - 12:30" },
  { period: 4, startTime: "12:30", endTime: "13:30", label: "12:30 - 13:30" },
  { period: 5, startTime: "13:30", endTime: "14:30", label: "13:30 - 14:30 (LUNCH)" },
  { period: 6, startTime: "14:30", endTime: "15:30", label: "14:30 - 15:30" },
  { period: 7, startTime: "15:30", endTime: "16:30", label: "15:30 - 16:30" },
];

export const allProgrammes: ProgrammeSection[] = [
  // Section 1
  {
    id: "sec-1",
    sectionNumber: 1,
    programme: "B.Tech. AIML",
    room: "EB-101",
    classInCharge: "Dr. Bhuvnesh",
    semester: "I",
    academicSession: "2026-27 (Odd Sem)",
    subjects: [
      { code: "26AS101", name: "Engineering Mathematics-I", faculty: "Dr. Preeti Tyagi", credits: 4, contactHours: 4 },
      { code: "26AS103A", name: "Quantum Computation and Communication", faculty: "Dr. Neha Rani", credits: 4, contactHours: 4 },
      { code: "26ME101", name: "Fundamentals of Robotics and AI", faculty: "Dr. Bhuvnesh", credits: 3, contactHours: 3 },
      { code: "26EE101", name: "Basic Electrical Engineering", faculty: "Dr. Ranjit Roy", credits: 3, contactHours: 3 },
      { code: "26ESEB101", name: "Environmental Science", faculty: "Dr Uqab Ali Baba Wazir", credits: 2, contactHours: 2 },
      { code: "26AS153A", name: "Quantum Physics Lab", faculty: "Dr. Neha Rani", credits: 1, contactHours: 2 },
      { code: "26EE151", name: "Basic Electrical Engineering Lab", faculty: "Dr. Monika Verma(G2) / Dr R B Dubey(G1)", credits: 1, contactHours: 2 },
      { code: "26HS151", name: "Communicative English Lab", faculty: "Dr. Mudassir Rahman", credits: 1, contactHours: 2 },
      { code: "26ME151", name: "Workshop Practices", faculty: "Dr. Bhuvnesh", credits: 1, contactHours: 2 },
      { code: "26GP101", name: "Professional Competency-I", faculty: "Dr. Neha Rani", credits: 1, contactHours: 1 },
    ],
    schedule: [
      {
        day: "Monday",
        slots: [
          { period: 1, timeRange: "09:30-10:30", subject: "Engineering Mathematics-I", code: "26AS101", room: "EB-101", type: "Lecture" },
          { period: 2, timeRange: "10:30-11:30", subject: "Quantum Computation and Communication", code: "26AS103A", room: "EB-101", type: "Lecture" },
          { period: 3, timeRange: "11:30-12:30", subject: "Fundamentals of Robotics and AI", code: "26ME101", room: "EB-101", type: "Lecture" },
          { period: 4, timeRange: "12:30-13:30", subject: "Library / Sports", room: "Campus Grounds", type: "Free" },
          { period: 6, timeRange: "14:30-15:30", subject: "Quantum Physics Lab (G-1) / Workshop Practices (G-2)", code: "26AS153A", room: "Lab / LG16", type: "Lab" },
          { period: 7, timeRange: "15:30-16:30", subject: "Quantum Physics Lab (G-1) / Workshop Practices (G-2)", code: "26AS153A", room: "Lab / LG16", type: "Lab" },
        ]
      },
      {
        day: "Tuesday",
        slots: [
          { period: 1, timeRange: "09:30-10:30", subject: "Basic Electrical Engineering", code: "26EE101", room: "EB-101", type: "Lecture" },
          { period: 2, timeRange: "10:30-11:30", subject: "Fundamentals of Robotics and AI", code: "26ME101", room: "EB-101", type: "Lecture" },
          { period: 3, timeRange: "11:30-12:30", subject: "Environmental Science", code: "26ESEB101", room: "EB-101", type: "Lecture" },
          { period: 4, timeRange: "12:30-13:30", subject: "Quantum Computation and Communication", code: "26AS103A", room: "EB-101", type: "Lecture" },
          { period: 6, timeRange: "14:30-15:30", subject: "Basic Electrical Engg Lab (G-1) / Maths Tutorial (G-2)", code: "26EE151", room: "EB-Lab 212", type: "Lab" },
          { period: 7, timeRange: "15:30-16:30", subject: "Basic Electrical Engg Lab (G-1) / Library (G-2)", code: "26EE151", room: "EB-Lab 212", type: "Lab" },
        ]
      },
      {
        day: "Wednesday",
        slots: [
          { period: 1, timeRange: "09:30-10:30", subject: "Basic Electrical Engineering", code: "26EE101", room: "EB-101", type: "Lecture" },
          { period: 2, timeRange: "10:30-11:30", subject: "Engineering Mathematics-I", code: "26AS101", room: "EB-101", type: "Lecture" },
          { period: 3, timeRange: "11:30-12:30", subject: "Quantum Physics Lab (G-2) / Library (G-1)", code: "26AS153A", room: "Physics Lab", type: "Lab" },
          { period: 4, timeRange: "12:30-13:30", subject: "Quantum Physics Lab (G-2) / Library (G-1)", code: "26AS153A", room: "Physics Lab", type: "Lab" },
          { period: 6, timeRange: "14:30-15:30", subject: "Library / Sports", room: "Grounds", type: "Free" },
          { period: 7, timeRange: "15:30-16:30", subject: "Professional Competency-I", code: "26GP101", room: "EB-101", type: "Lecture" },
        ]
      },
      {
        day: "Thursday",
        slots: [
          { period: 1, timeRange: "09:30-10:30", subject: "Basic Electrical Engineering", code: "26EE101", room: "EB-101", type: "Lecture" },
          { period: 2, timeRange: "10:30-11:30", subject: "Quantum Computation and Communication", code: "26AS103A", room: "EB-101", type: "Lecture" },
          { period: 3, timeRange: "11:30-12:30", subject: "Basic Electrical Lab (G-2) / Workshop (G-1)", code: "26EE151", room: "EB-Lab 212 / LG16", type: "Lab" },
          { period: 4, timeRange: "12:30-13:30", subject: "Basic Electrical Lab (G-2) / Workshop (G-1)", code: "26EE151", room: "EB-Lab 212 / LG16", type: "Lab" },
          { period: 6, timeRange: "14:30-15:30", subject: "Communicative English Lab", code: "26HS151", room: "Lab no 4", type: "Lab" },
          { period: 7, timeRange: "15:30-16:30", subject: "Communicative English Lab", code: "26HS151", room: "Lab no 4", type: "Lab" },
        ]
      },
      {
        day: "Friday",
        slots: [
          { period: 1, timeRange: "09:30-10:30", subject: "Engineering Mathematics-I", code: "26AS101", room: "EB-101", type: "Lecture" },
          { period: 2, timeRange: "10:30-11:30", subject: "Environmental Science", code: "26ESEB101", room: "EB-101", type: "Lecture" },
          { period: 3, timeRange: "11:30-12:30", subject: "Fundamentals of Robotics and AI", code: "26ME101", room: "EB-101", type: "Lecture" },
          { period: 4, timeRange: "12:30-13:30", subject: "Quantum Computation and Communication", code: "26AS103A", room: "EB-101", type: "Lecture" },
          { period: 6, timeRange: "14:30-15:30", subject: "Engineering Mathematics-I (Tutorial G-1)", code: "26AS101", room: "EB-101", type: "Tutorial" },
          { period: 7, timeRange: "15:30-16:30", subject: "Library / Sports", room: "Library", type: "Free" },
        ]
      }
    ]
  },

  // Section 2
  {
    id: "sec-2",
    sectionNumber: 2,
    programme: "B.Tech. AIML",
    room: "EB-102",
    classInCharge: "Dr. Deepak Grover",
    semester: "I",
    academicSession: "2026-27 (Odd Sem)",
    subjects: [
      { code: "26AS101", name: "Engineering Mathematics-I", faculty: "Dr. Deepak Grover", credits: 4, contactHours: 4 },
      { code: "26AS103A", name: "Quantum Computation and Communication", faculty: "Dr. Neeti Keswani", credits: 4, contactHours: 4 },
      { code: "26ME101", name: "Fundamentals of Robotics and AI", faculty: "Dr. R. Sankar", credits: 3, contactHours: 3 },
      { code: "26EE101", name: "Basic Electrical Engineering", faculty: "Dr. Deepika Yadav", credits: 3, contactHours: 3 },
      { code: "26ESEB101", name: "Environmental Science", faculty: "Dr Uqab Ali Baba Wazir", credits: 2, contactHours: 2 },
      { code: "26AS153A", name: "Quantum Physics Lab", faculty: "Dr. Neeti Keswani", credits: 1, contactHours: 2 },
      { code: "26EE151", name: "Basic Electrical Engineering Lab", faculty: "Dr. R. B. Dubey", credits: 1, contactHours: 2 },
      { code: "26HS151", name: "Communicative English Lab", faculty: "Dr. Tulika Kakkar", credits: 1, contactHours: 2 },
      { code: "26ME151", name: "Workshop Practices", faculty: "Dr. R. Sankar", credits: 1, contactHours: 2 },
      { code: "26GP101", name: "Professional Competency-I", faculty: "Dr. Neha Rani", credits: 1, contactHours: 1 },
    ],
    schedule: [
      {
        day: "Monday",
        slots: [
          { period: 1, timeRange: "09:30-10:30", subject: "Engineering Mathematics-I", code: "26AS101", room: "EB-102", type: "Lecture" },
          { period: 2, timeRange: "10:30-11:30", subject: "Quantum Computation and Communication", code: "26AS103A", room: "EB-102", type: "Lecture" },
          { period: 3, timeRange: "11:30-12:30", subject: "Basic Electrical Engg Lab (G-1) / Library (G-2)", code: "26EE151", room: "EB-Lab 212", type: "Lab" },
          { period: 4, timeRange: "12:30-13:30", subject: "Basic Electrical Engg Lab (G-1) / Library (G-2)", code: "26EE151", room: "EB-Lab 212", type: "Lab" },
          { period: 6, timeRange: "14:30-15:30", subject: "Fundamentals of Robotics and AI", code: "26ME101", room: "EB-102", type: "Lecture" },
          { period: 7, timeRange: "15:30-16:30", subject: "Professional Competency-I", code: "26GP101", room: "EB-102", type: "Lecture" },
        ]
      },
      {
        day: "Tuesday",
        slots: [
          { period: 1, timeRange: "09:30-10:30", subject: "Quantum Physics Lab (G-1) / Workshop (G-2)", code: "26AS153A", room: "Lab / LG16", type: "Lab" },
          { period: 2, timeRange: "10:30-11:30", subject: "Quantum Physics Lab (G-1) / Workshop (G-2)", code: "26AS153A", room: "Lab / LG16", type: "Lab" },
          { period: 3, timeRange: "11:30-12:30", subject: "Engineering Mathematics-I", code: "26AS101", room: "EB-102", type: "Lecture" },
          { period: 4, timeRange: "12:30-13:30", subject: "Fundamentals of Robotics and AI", code: "26ME101", room: "EB-102", type: "Lecture" },
          { period: 6, timeRange: "14:30-15:30", subject: "Basic Electrical Engineering", code: "26EE101", room: "EB-102", type: "Lecture" },
          { period: 7, timeRange: "15:30-16:30", subject: "Library / Sports", room: "Grounds", type: "Free" },
        ]
      },
      {
        day: "Wednesday",
        slots: [
          { period: 1, timeRange: "09:30-10:30", subject: "Communicative English Lab (Lab no 8, 5th Floor)", code: "26HS151", room: "Lab 8, 5th Fl", type: "Lab" },
          { period: 2, timeRange: "10:30-11:30", subject: "Engineering Mathematics-I", code: "26AS101", room: "EB-102", type: "Lecture" },
          { period: 3, timeRange: "11:30-12:30", subject: "Basic Electrical Engineering", code: "26EE101", room: "EB-102", type: "Lecture" },
          { period: 4, timeRange: "12:30-13:30", subject: "Quantum Computation and Communication", code: "26AS103A", room: "EB-102", type: "Lecture" },
          { period: 6, timeRange: "14:30-15:30", subject: "Quantum Computation and Communication", code: "26AS103A", room: "EB-102", type: "Lecture" },
          { period: 7, timeRange: "15:30-16:30", subject: "Library / Sports", room: "Library", type: "Free" },
        ]
      },
      {
        day: "Thursday",
        slots: [
          { period: 1, timeRange: "09:30-10:30", subject: "Quantum Computation and Communication", code: "26AS103A", room: "EB-102", type: "Lecture" },
          { period: 2, timeRange: "10:30-11:30", subject: "Basic Electrical Engineering", code: "26EE101", room: "EB-102", type: "Lecture" },
          { period: 3, timeRange: "11:30-12:30", subject: "Quantum Physics Lab (G-2) / Tutorial (G-1)", code: "26AS153A", room: "Physics Lab", type: "Lab" },
          { period: 4, timeRange: "12:30-13:30", subject: "Quantum Physics Lab (G-2) / Library (G-1)", code: "26AS153A", room: "Physics Lab", type: "Lab" },
          { period: 6, timeRange: "14:30-15:30", subject: "Environmental Science", code: "26ESEB101", room: "EB-102", type: "Lecture" },
          { period: 7, timeRange: "15:30-16:30", subject: "Library / Sports", room: "Grounds", type: "Free" },
        ]
      },
      {
        day: "Friday",
        slots: [
          { period: 1, timeRange: "09:30-10:30", subject: "Fundamentals of Robotics and AI", code: "26ME101", room: "EB-102", type: "Lecture" },
          { period: 2, timeRange: "10:30-11:30", subject: "Quantum Computation and Communication", code: "26AS103A", room: "EB-102", type: "Lecture" },
          { period: 3, timeRange: "11:30-12:30", subject: "Environmental Science", code: "26ESEB101", room: "EB-102", type: "Lecture" },
          { period: 4, timeRange: "12:30-13:30", subject: "Engineering Mathematics-I (G-2)", code: "26AS101", room: "EB-102", type: "Tutorial" },
          { period: 6, timeRange: "14:30-15:30", subject: "Basic Electrical Lab (G-2) / Workshop (G-1)", code: "26EE151", room: "EB-Lab 212 / LG16", type: "Lab" },
          { period: 7, timeRange: "15:30-16:30", subject: "Basic Electrical Lab (G-2) / Workshop (G-1)", code: "26EE151", room: "EB-Lab 212 / LG16", type: "Lab" },
        ]
      }
    ]
  },

  // Section 3
  {
    id: "sec-3",
    sectionNumber: 3,
    programme: "B.Tech. AIML",
    room: "EB-103",
    classInCharge: "Dr. Bhuvaneswari",
    semester: "I",
    academicSession: "2026-27 (Odd Sem)",
    subjects: [
      { code: "26AS101", name: "Engineering Mathematics-I", faculty: "Dr. Asha Rani", credits: 4, contactHours: 4 },
      { code: "26AS103A", name: "Quantum Computation and Communication", faculty: "Dr. Bhuvaneswari", credits: 4, contactHours: 4 },
      { code: "26ME101", name: "Fundamentals of Robotics and AI", faculty: "Dr A.K.Mishra", credits: 3, contactHours: 3 },
      { code: "26EE101", name: "Basic Electrical Engineering", faculty: "Dr. Monika Verma", credits: 3, contactHours: 3 },
      { code: "26ESEB101", name: "Environmental Science", faculty: "Dr Uqab Ali baba wazir", credits: 2, contactHours: 2 },
      { code: "26AS153A", name: "Quantum Physics Lab", faculty: "Dr. Bhuvaneswari", credits: 1, contactHours: 2 },
      { code: "26EE151", name: "Basic Electrical Engineering Lab", faculty: "Dr. Monika Verma", credits: 1, contactHours: 2 },
      { code: "26HS151", name: "Communicative English Lab", faculty: "Ms. Banani Barman", credits: 1, contactHours: 2 },
      { code: "26ME151", name: "Workshop Practices", faculty: "Dr A.K.Mishra", credits: 1, contactHours: 2 },
      { code: "26GP101", name: "Professional Competency-I", faculty: "Dr. Monika Verma", credits: 1, contactHours: 1 },
    ],
    schedule: [
      {
        day: "Monday",
        slots: [
          { period: 1, timeRange: "09:30-10:30", subject: "Fundamentals of Robotics and AI", code: "26ME101", room: "EB-103", type: "Lecture" },
          { period: 2, timeRange: "10:30-11:30", subject: "Basic Electrical Engineering", code: "26EE101", room: "EB-103", type: "Lecture" },
          { period: 3, timeRange: "11:30-12:30", subject: "Quantum Computation and Communication", code: "26AS103A", room: "EB-103", type: "Lecture" },
          { period: 4, timeRange: "12:30-13:30", subject: "Engineering Mathematics-I (Tutorial G-1)", code: "26AS101", room: "EB-103", type: "Tutorial" },
          { period: 6, timeRange: "14:30-15:30", subject: "Basic Electrical Lab (G-1) / Library (G-2)", code: "26EE151", room: "EB-Lab 212", type: "Lab" },
          { period: 7, timeRange: "15:30-16:30", subject: "Basic Electrical Lab (G-1) / Library (G-2)", code: "26EE151", room: "EB-Lab 212", type: "Lab" },
        ]
      },
      {
        day: "Tuesday",
        slots: [
          { period: 1, timeRange: "09:30-10:30", subject: "Communicative English Lab (Lab no 8)", code: "26HS151", room: "Lab 8", type: "Lab" },
          { period: 2, timeRange: "10:30-11:30", subject: "Engineering Mathematics-I", code: "26AS101", room: "EB-103", type: "Lecture" },
          { period: 3, timeRange: "11:30-12:30", subject: "Environmental Science", code: "26ESEB101", room: "EB-103", type: "Lecture" },
          { period: 4, timeRange: "12:30-13:30", subject: "Engineering Mathematics-I (Tutorial G-2)", code: "26AS101", room: "EB-103", type: "Tutorial" },
          { period: 6, timeRange: "14:30-15:30", subject: "Library / Sports", room: "Grounds", type: "Free" },
          { period: 7, timeRange: "15:30-16:30", subject: "Library / Sports", room: "Grounds", type: "Free" },
        ]
      },
      {
        day: "Wednesday",
        slots: [
          { period: 1, timeRange: "09:30-10:30", subject: "Quantum Physics Lab (G-1) / Workshop (G-2)", code: "26AS153A", room: "Physics Lab / LG16", type: "Lab" },
          { period: 2, timeRange: "10:30-11:30", subject: "Basic Electrical Engineering", code: "26EE101", room: "EB-103", type: "Lecture" },
          { period: 3, timeRange: "11:30-12:30", subject: "Quantum Computation and Communication", code: "26AS103A", room: "EB-103", type: "Lecture" },
          { period: 4, timeRange: "12:30-13:30", subject: "Fundamentals of Robotics and AI", code: "26ME101", room: "EB-103", type: "Lecture" },
          { period: 6, timeRange: "14:30-15:30", subject: "Professional Competency-I", code: "26GP101", room: "EB-103", type: "Lecture" },
          { period: 7, timeRange: "15:30-16:30", subject: "Professional Competency-I", code: "26GP101", room: "EB-103", type: "Lecture" },
        ]
      },
      {
        day: "Thursday",
        slots: [
          { period: 1, timeRange: "09:30-10:30", subject: "Basic Electrical Lab (G-2) / Workshop (G-1)", code: "26EE151", room: "EB-Lab 212 / LG16", type: "Lab" },
          { period: 2, timeRange: "10:30-11:30", subject: "Engineering Mathematics-I", code: "26AS101", room: "EB-103", type: "Lecture" },
          { period: 3, timeRange: "11:30-12:30", subject: "Environmental Science", code: "26ESEB101", room: "EB-103", type: "Lecture" },
          { period: 4, timeRange: "12:30-13:30", subject: "Quantum Computation and Communication", code: "26AS103A", room: "EB-103", type: "Lecture" },
          { period: 6, timeRange: "14:30-15:30", subject: "Library / Sports", room: "Library", type: "Free" },
          { period: 7, timeRange: "15:30-16:30", subject: "Library / Sports", room: "Library", type: "Free" },
        ]
      },
      {
        day: "Friday",
        slots: [
          { period: 1, timeRange: "09:30-10:30", subject: "Engineering Mathematics-I", code: "26AS101", room: "EB-103", type: "Lecture" },
          { period: 2, timeRange: "10:30-11:30", subject: "Basic Electrical Engineering", code: "26EE101", room: "EB-103", type: "Lecture" },
          { period: 3, timeRange: "11:30-12:30", subject: "Fundamentals of Robotics and AI", code: "26ME101", room: "EB-103", type: "Lecture" },
          { period: 4, timeRange: "12:30-13:30", subject: "Quantum Computation and Communication", code: "26AS103A", room: "EB-103", type: "Lecture" },
          { period: 6, timeRange: "14:30-15:30", subject: "Quantum Physics Lab (G-2) / Library (G-1)", code: "26AS153A", room: "Physics Lab", type: "Lab" },
          { period: 7, timeRange: "15:30-16:30", subject: "Quantum Physics Lab (G-2) / Library (G-1)", code: "26AS153A", room: "Physics Lab", type: "Lab" },
        ]
      }
    ]
  },

  // Section 4
  {
    id: "sec-4",
    sectionNumber: 4,
    programme: "B.Tech. AIML",
    room: "EB-104",
    classInCharge: "Mr S Murali",
    semester: "I",
    academicSession: "2026-27 (Odd Sem)",
    subjects: [
      { code: "26AS101", name: "Engineering Mathematics-I", faculty: "Dr Sanjey Kumar", credits: 4, contactHours: 4 },
      { code: "26AS103A", name: "Quantum Computation and Communication", faculty: "Dr Navin Chandra Joshi", credits: 4, contactHours: 4 },
      { code: "26ME101", name: "Fundamentals of Robotics and AI", faculty: "Dr. Deepak Sahani", credits: 3, contactHours: 3 },
      { code: "26EE101", name: "Basic Electrical Engineering", faculty: "Mr. S. Murali", credits: 3, contactHours: 3 },
      { code: "26ESEB101", name: "Environmental Science", faculty: "Dr Deepanshi", credits: 2, contactHours: 2 },
      { code: "26AS153A", name: "Quantum Physics Lab", faculty: "Dr Navin Chandra Joshi", credits: 1, contactHours: 2 },
      { code: "26EE151", name: "Basic Electrical Engineering Lab", faculty: "Mr. S. Murali(G1) / Dr. R. B. Dubey(G2)", credits: 1, contactHours: 2 },
      { code: "26HS151", name: "Communicative English Lab", faculty: "Dr Alka Vishwakarma", credits: 1, contactHours: 2 },
      { code: "26ME151", name: "Workshop Practices", faculty: "Dr. Deepak Sahani(G1) / Mr Rajeev Ranjan(G2)", credits: 1, contactHours: 2 },
      { code: "26GP101", name: "Professional Competency-I", faculty: "Dr. Monika Verma", credits: 1, contactHours: 1 },
    ],
    schedule: [
      {
        day: "Monday",
        slots: [
          { period: 1, timeRange: "09:30-10:30", subject: "Quantum Physics Lab (G-1) / Workshop (G-2)", code: "26AS153A", room: "Lab / LG16", type: "Lab" },
          { period: 2, timeRange: "10:30-11:30", subject: "Fundamentals of Robotics and AI", code: "26ME101", room: "EB-104", type: "Lecture" },
          { period: 3, timeRange: "11:30-12:30", subject: "Quantum Computation and Communication", code: "26AS103A", room: "EB-104", type: "Lecture" },
          { period: 4, timeRange: "12:30-13:30", subject: "Engineering Mathematics-I (Tutorial G-1)", code: "26AS101", room: "EB-104", type: "Tutorial" },
          { period: 6, timeRange: "14:30-15:30", subject: "Professional Competency-I", code: "26GP101", room: "EB-104", type: "Lecture" },
          { period: 7, timeRange: "15:30-16:30", subject: "Professional Competency-I", code: "26GP101", room: "EB-104", type: "Lecture" },
        ]
      },
      {
        day: "Tuesday",
        slots: [
          { period: 1, timeRange: "09:30-10:30", subject: "Engineering Mathematics-I", code: "26AS101", room: "EB-104", type: "Lecture" },
          { period: 2, timeRange: "10:30-11:30", subject: "Basic Electrical Engineering", code: "26EE101", room: "EB-104", type: "Lecture" },
          { period: 3, timeRange: "11:30-12:30", subject: "Communicative English Lab (Lab no 4)", code: "26HS151", room: "Lab 4", type: "Lab" },
          { period: 4, timeRange: "12:30-13:30", subject: "Quantum Physics Lab (G-2) / Library (G-1)", code: "26AS153A", room: "Lab / Library", type: "Lab" },
          { period: 6, timeRange: "14:30-15:30", subject: "Library / Sports", room: "Grounds", type: "Free" },
          { period: 7, timeRange: "15:30-16:30", subject: "Library / Sports", room: "Grounds", type: "Free" },
        ]
      },
      {
        day: "Wednesday",
        slots: [
          { period: 1, timeRange: "09:30-10:30", subject: "Engineering Mathematics-I", code: "26AS101", room: "EB-104", type: "Lecture" },
          { period: 2, timeRange: "10:30-11:30", subject: "Environmental Science", code: "26ESEB101", room: "EB-104", type: "Lecture" },
          { period: 3, timeRange: "11:30-12:30", subject: "Quantum Computation and Communication", code: "26AS103A", room: "EB-104", type: "Lecture" },
          { period: 4, timeRange: "12:30-13:30", subject: "Fundamentals of Robotics and AI", code: "26ME101", room: "EB-104", type: "Lecture" },
          { period: 6, timeRange: "14:30-15:30", subject: "Quantum Computation & Communication", code: "26AS103A", room: "EB-104", type: "Lecture" },
          { period: 7, timeRange: "15:30-16:30", subject: "Engineering Mathematics-I (Tutorial G-2)", code: "26AS101", room: "EB-104", type: "Tutorial" },
        ]
      },
      {
        day: "Thursday",
        slots: [
          { period: 1, timeRange: "09:30-10:30", subject: "Engineering Mathematics-I", code: "26AS101", room: "EB-104", type: "Lecture" },
          { period: 2, timeRange: "10:30-11:30", subject: "Fundamentals of Robotics and AI", code: "26ME101", room: "EB-104", type: "Lecture" },
          { period: 3, timeRange: "11:30-12:30", subject: "Quantum Computation and Communication", code: "26AS103A", room: "EB-104", type: "Lecture" },
          { period: 4, timeRange: "12:30-13:30", subject: "Basic Electrical Engineering", code: "26EE101", room: "EB-104", type: "Lecture" },
          { period: 6, timeRange: "14:30-15:30", subject: "Basic Electrical Lab (G-1) / Library (G-2)", code: "26EE151", room: "EB-Lab 212", type: "Lab" },
          { period: 7, timeRange: "15:30-16:30", subject: "Basic Electrical Lab (G-1) / Library (G-2)", code: "26EE151", room: "EB-Lab 212", type: "Lab" },
        ]
      },
      {
        day: "Friday",
        slots: [
          { period: 1, timeRange: "09:30-10:30", subject: "Basic Electrical Lab (G-2) / Workshop (G-1)", code: "26EE151", room: "EB-Lab 212 / LG16", type: "Lab" },
          { period: 2, timeRange: "10:30-11:30", subject: "Basic Electrical Engineering", code: "26EE101", room: "EB-104", type: "Lecture" },
          { period: 3, timeRange: "11:30-12:30", subject: "Environmental Science", code: "26ESEB101", room: "EB-104", type: "Lecture" },
          { period: 4, timeRange: "12:30-13:30", subject: "Library / Sports", room: "Library", type: "Free" },
          { period: 6, timeRange: "14:30-15:30", subject: "Library / Sports", room: "Library", type: "Free" },
          { period: 7, timeRange: "15:30-16:30", subject: "Library / Sports", room: "Library", type: "Free" },
        ]
      }
    ]
  },

  // Section 5
  {
    id: "sec-5",
    sectionNumber: 5,
    programme: "B.Tech. AIML + DSAI",
    room: "EB-105",
    classInCharge: "Mr. Ankit Mani Tripathi",
    semester: "I",
    academicSession: "2026-27 (Odd Sem)",
    subjects: [
      { code: "26AS101", name: "Engineering Mathematics-I", faculty: "Dr Neelu Chaudhary", credits: 4, contactHours: 4 },
      { code: "26AS103A", name: "Quantum Computation and Communication", faculty: "Dr Anshu", credits: 4, contactHours: 4 },
      { code: "26ME101", name: "Fundamentals of Robotics and AI", faculty: "Mr. Ankit Mani Tripathi", credits: 3, contactHours: 3 },
      { code: "26EE101", name: "Basic Electrical Engineering", faculty: "Dr. Monika Verma", credits: 3, contactHours: 3 },
      { code: "26ESEB101", name: "Environmental Science", faculty: "Dr Deepanshi", credits: 2, contactHours: 2 },
      { code: "26AS153A", name: "Quantum Physics Lab", faculty: "Dr. Anshu", credits: 1, contactHours: 2 },
      { code: "26EE151", name: "Basic Electrical Engineering Lab", faculty: "Dr Monika(G1) / Mr. S. Murali(G2)", credits: 1, contactHours: 2 },
      { code: "26HS151", name: "Communicative English Lab", faculty: "Dr. Pragya", credits: 1, contactHours: 2 },
      { code: "26ME151", name: "Workshop Practices", faculty: "Mr. Ankit Mani Tripathi", credits: 1, contactHours: 2 },
      { code: "26GP101", name: "Professional Competency-I", faculty: "Dr. Monika Verma", credits: 1, contactHours: 1 },
      { code: "26INS101", name: "Industry Session-I", faculty: "Ms Rohini Matta", credits: 1, contactHours: 2 },
    ],
    schedule: [
      {
        day: "Monday",
        slots: [
          { period: 1, timeRange: "09:30-10:30", subject: "Engineering Mathematics-I", code: "26AS101", room: "EB-105", type: "Lecture" },
          { period: 2, timeRange: "10:30-11:30", subject: "Environmental Science", code: "26ESEB101", room: "EB-105", type: "Lecture" },
          { period: 3, timeRange: "11:30-12:30", subject: "Basic Electrical Engineering", code: "26EE101", room: "EB-105", type: "Lecture" },
          { period: 4, timeRange: "12:30-13:30", subject: "Fundamentals of Robotics and AI", code: "26ME101", room: "EB-105", type: "Lecture" },
          { period: 6, timeRange: "14:30-15:30", subject: "Industry Session-I", code: "26INS101", room: "EB-105", type: "Lecture" },
          { period: 7, timeRange: "15:30-16:30", subject: "Industry Session-I", code: "26INS101", room: "EB-105", type: "Lecture" },
        ]
      },
      {
        day: "Tuesday",
        slots: [
          { period: 1, timeRange: "09:30-10:30", subject: "Quantum Computation and Communication", code: "26AS103A", room: "EB-105", type: "Lecture" },
          { period: 2, timeRange: "10:30-11:30", subject: "Basic Electrical Engineering", code: "26EE101", room: "EB-105", type: "Lecture" },
          { period: 3, timeRange: "11:30-12:30", subject: "Quantum Physics Lab (G-1) (Lab 109) / Workshop (G-2)", code: "26AS153A", room: "Lab 109 / LG16", type: "Lab" },
          { period: 4, timeRange: "12:30-13:30", subject: "Quantum Physics Lab (G-1) (Lab 109) / Workshop (G-2)", code: "26AS153A", room: "Lab 109 / LG16", type: "Lab" },
          { period: 6, timeRange: "14:30-15:30", subject: "Engineering Mathematics-I", code: "26AS101", room: "EB-105", type: "Lecture" },
          { period: 7, timeRange: "15:30-16:30", subject: "Library / Sports", room: "Grounds", type: "Free" },
        ]
      },
      {
        day: "Wednesday",
        slots: [
          { period: 1, timeRange: "09:30-10:30", subject: "Fundamentals of Robotics and AI", code: "26ME101", room: "EB-105", type: "Lecture" },
          { period: 2, timeRange: "10:30-11:30", subject: "Quantum Computation and Communication", code: "26AS103A", room: "EB-105", type: "Lecture" },
          { period: 3, timeRange: "11:30-12:30", subject: "Communicative English Lab (Lab no 4)", code: "26HS151", room: "Lab 4", type: "Lab" },
          { period: 4, timeRange: "12:30-13:30", subject: "Communicative English Lab (Lab no 4)", code: "26HS151", room: "Lab 4", type: "Lab" },
          { period: 6, timeRange: "14:30-15:30", subject: "Basic Electrical Lab (G-2) / Workshop (G-1)", code: "26EE151", room: "EB-Lab 212 / LG16", type: "Lab" },
          { period: 7, timeRange: "15:30-16:30", subject: "Basic Electrical Lab (G-2) / Workshop (G-1)", code: "26EE151", room: "EB-Lab 212 / LG16", type: "Lab" },
        ]
      },
      {
        day: "Thursday",
        slots: [
          { period: 1, timeRange: "09:30-10:30", subject: "Quantum Physics Lab (G-2) / Tutorial (G-1)", code: "26AS153A", room: "Lab 109 / EB-105", type: "Lab" },
          { period: 2, timeRange: "10:30-11:30", subject: "Library / Sports (G-1)", room: "Campus", type: "Free" },
          { period: 3, timeRange: "11:30-12:30", subject: "Quantum Computation and Communication", code: "26AS103A", room: "EB-105", type: "Lecture" },
          { period: 4, timeRange: "12:30-13:30", subject: "Fundamentals of Robotics and AI", code: "26ME101", room: "EB-105", type: "Lecture" },
          { period: 6, timeRange: "14:30-15:30", subject: "Basic Electrical Engineering", code: "26EE101", room: "EB-105", type: "Lecture" },
          { period: 7, timeRange: "15:30-16:30", subject: "Professional Competency-I", code: "26GP101", room: "EB-105", type: "Lecture" },
        ]
      },
      {
        day: "Friday",
        slots: [
          { period: 1, timeRange: "09:30-10:30", subject: "Engineering Mathematics-I", code: "26AS101", room: "EB-105", type: "Lecture" },
          { period: 2, timeRange: "10:30-11:30", subject: "Quantum Computation and Communication", code: "26AS103A", room: "EB-105", type: "Lecture" },
          { period: 3, timeRange: "11:30-12:30", subject: "Basic Electrical Lab (G-1) / Tutorial (G-2)", code: "26EE151", room: "EB-Lab 212", type: "Lab" },
          { period: 4, timeRange: "12:30-13:30", subject: "Basic Electrical Lab (G-1) / Library (G-2)", code: "26EE151", room: "EB-Lab 212", type: "Lab" },
          { period: 6, timeRange: "14:30-15:30", subject: "Environmental Science", code: "26ESEB101", room: "EB-105", type: "Lecture" },
          { period: 7, timeRange: "15:30-16:30", subject: "Library / Sports", room: "Grounds", type: "Free" },
        ]
      }
    ]
  },

  // Section 6
  {
    id: "sec-6",
    sectionNumber: 6,
    programme: "B.Tech. DSAI",
    room: "EB-201",
    classInCharge: "Dr Aasim",
    semester: "I",
    academicSession: "2026-27 (Odd Sem)",
    subjects: [
      { code: "26AS101", name: "Engineering Mathematics-I", faculty: "Dr Sonal", credits: 4, contactHours: 4 },
      { code: "26AS103A", name: "Quantum Computation and Communication", faculty: "Dr Asim", credits: 4, contactHours: 4 },
      { code: "26ME101", name: "Fundamentals of Robotics and AI", faculty: "Dr Nageha", credits: 3, contactHours: 3 },
      { code: "26EE101", name: "Basic Electrical Engineering", faculty: "Dr . R.B. Dubey", credits: 3, contactHours: 3 },
      { code: "26ESEB101", name: "Environmental Science", faculty: "Dr Deepanshi", credits: 2, contactHours: 2 },
      { code: "26AS153A", name: "Quantum Physics Lab", faculty: "Dr Asim", credits: 1, contactHours: 2 },
      { code: "26EE151", name: "Basic Electrical Engineering Lab", faculty: "Mr Murali", credits: 1, contactHours: 2 },
      { code: "26HS151", name: "Communicative English Lab", faculty: "Ms. Ridhi Jain", credits: 1, contactHours: 2 },
      { code: "26ME151", name: "Workshop Practices", faculty: "Dr NK Sharma(G1) / Ms Taran(G2)", credits: 1, contactHours: 2 },
      { code: "26GP101", name: "Professional Competency-I", faculty: "Dr. Pawan Sharma", credits: 1, contactHours: 1 },
      { code: "26INS101", name: "Industry Session-I", faculty: "Mr Upendra Pippal", credits: 1, contactHours: 2 },
    ],
    schedule: [
      {
        day: "Monday",
        slots: [
          { period: 1, timeRange: "09:30-10:30", subject: "Engineering Mathematics-I", code: "26AS101", room: "EB-201", type: "Lecture" },
          { period: 2, timeRange: "10:30-11:30", subject: "Fundamentals of Robotics and AI", code: "26ME101", room: "EB-201", type: "Lecture" },
          { period: 3, timeRange: "11:30-12:30", subject: "Quantum Physics Lab (G-2) (Lab 109) / Workshop (G-1)", code: "26AS153A", room: "Lab 109 / LG16", type: "Lab" },
          { period: 4, timeRange: "12:30-13:30", subject: "Quantum Physics Lab (G-2) (Lab 109) / Workshop (G-1)", code: "26AS153A", room: "Lab 109 / LG16", type: "Lab" },
          { period: 6, timeRange: "14:30-15:30", subject: "Communicative English Lab (Lab no 4)", code: "26HS151", room: "Lab 4", type: "Lab" },
          { period: 7, timeRange: "15:30-16:30", subject: "Communicative English Lab (Lab no 4)", code: "26HS151", room: "Lab 4", type: "Lab" },
        ]
      },
      {
        day: "Tuesday",
        slots: [
          { period: 1, timeRange: "09:30-10:30", subject: "Basic Electrical Engineering", code: "26EE101", room: "EB-201", type: "Lecture" },
          { period: 2, timeRange: "10:30-11:30", subject: "Quantum Computation and Communication", code: "26AS103A", room: "EB-201", type: "Lecture" },
          { period: 3, timeRange: "11:30-12:30", subject: "Basic Electrical Lab (G-1) / Tutorial (G-2)", code: "26EE151", room: "EB-Lab 212", type: "Lab" },
          { period: 4, timeRange: "12:30-13:30", subject: "Basic Electrical Lab (G-1) / Library (G-2)", code: "26EE151", room: "EB-Lab 212", type: "Lab" },
          { period: 6, timeRange: "14:30-15:30", subject: "Industry Session-I", code: "26INS101", room: "EB-201", type: "Lecture" },
          { period: 7, timeRange: "15:30-16:30", subject: "Industry Session-I", code: "26INS101", room: "EB-201", type: "Lecture" },
        ]
      },
      {
        day: "Wednesday",
        slots: [
          { period: 1, timeRange: "09:30-10:30", subject: "Basic Electrical Lab (G-2) / Tutorial (G-1)", code: "26EE151", room: "EB-Lab 212", type: "Lab" },
          { period: 2, timeRange: "10:30-11:30", subject: "Library / Sports (G-1)", room: "Grounds", type: "Free" },
          { period: 3, timeRange: "11:30-12:30", subject: "Quantum Computation and Communication", code: "26AS103A", room: "EB-201", type: "Lecture" },
          { period: 4, timeRange: "12:30-13:30", subject: "Fundamentals of Robotics and AI", code: "26ME101", room: "EB-201", type: "Lecture" },
          { period: 6, timeRange: "14:30-15:30", subject: "Environmental Science", code: "26ESEB101", room: "EB-201", type: "Lecture" },
          { period: 7, timeRange: "15:30-16:30", subject: "Professional Competency-I", code: "26GP101", room: "EB-201", type: "Lecture" },
        ]
      },
      {
        day: "Thursday",
        slots: [
          { period: 1, timeRange: "09:30-10:30", subject: "Basic Electrical Engineering", code: "26EE101", room: "EB-201", type: "Lecture" },
          { period: 2, timeRange: "10:30-11:30", subject: "Engineering Mathematics-I", code: "26AS101", room: "EB-201", type: "Lecture" },
          { period: 3, timeRange: "11:30-12:30", subject: "Quantum Computation and Communication", code: "26AS103A", room: "EB-201", type: "Lecture" },
          { period: 4, timeRange: "12:30-13:30", subject: "Library / Sports", room: "Campus", type: "Free" },
          { period: 6, timeRange: "14:30-15:30", subject: "Quantum Physics Lab (G-1) (Lab 109) / Workshop (G-2)", code: "26AS153A", room: "Lab 109 / LG16", type: "Lab" },
          { period: 7, timeRange: "15:30-16:30", subject: "Quantum Physics Lab (G-1) (Lab 109) / Workshop (G-2)", code: "26AS153A", room: "Lab 109 / LG16", type: "Lab" },
        ]
      },
      {
        day: "Friday",
        slots: [
          { period: 1, timeRange: "09:30-10:30", subject: "Engineering Mathematics-I", code: "26AS101", room: "EB-201", type: "Lecture" },
          { period: 2, timeRange: "10:30-11:30", subject: "Environmental Science", code: "26ESEB101", room: "EB-201", type: "Lecture" },
          { period: 3, timeRange: "11:30-12:30", subject: "Fundamentals of Robotics and AI", code: "26ME101", room: "EB-201", type: "Lecture" },
          { period: 4, timeRange: "12:30-13:30", subject: "Basic Electrical Engineering", code: "26EE101", room: "EB-201", type: "Lecture" },
          { period: 6, timeRange: "14:30-15:30", subject: "Quantum Computation and Communication", code: "26AS103A", room: "EB-201", type: "Lecture" },
          { period: 7, timeRange: "15:30-16:30", subject: "Library / Sports", room: "Library", type: "Free" },
        ]
      }
    ]
  },

  // Section 7
  {
    id: "sec-7",
    sectionNumber: 7,
    programme: "B.Tech. Cyber Security, Cloud & DevOps",
    room: "EB-202",
    classInCharge: "Dr. Ritika Nagpal",
    semester: "I",
    academicSession: "2026-27 (Odd Sem)",
    subjects: [
      { code: "26AS101", name: "Engineering Mathematics-I", faculty: "Dr. Asha Rani", credits: 4, contactHours: 4 },
      { code: "26AS105A", name: "Fundamentals of Chemistry & Engg Materials", faculty: "Dr Ritika Nagpal", credits: 4, contactHours: 4 },
      { code: "26EC101", name: "Basic Electronics Engineering", faculty: "Mr. Satyendra Kumar", credits: 3, contactHours: 3 },
      { code: "26CS101", name: "Fundamentals of Computer and C Programming", faculty: "Dr Ajay Sharma", credits: 3, contactHours: 3 },
      { code: "26VAC102", name: "Indian Constitution and Polity", faculty: "Mr. Sooraj", credits: 2, contactHours: 2 },
      { code: "26AS155A", name: "Chemistry & Engg Materials Lab", faculty: "Dr Ritika Nagpal", credits: 1, contactHours: 2 },
      { code: "26EC151", name: "Basic Electronics Engineering Lab", faculty: "Mr Satyendra Kumar", credits: 1, contactHours: 2 },
      { code: "26CS151", name: "C Programming Lab", faculty: "Dr Ajay Sharma", credits: 1, contactHours: 2 },
      { code: "26ME153", name: "Engineering Graphics and Design Lab", faculty: "Mr. Rajeev Ranjan", credits: 1, contactHours: 2 },
      { code: "26HS151", name: "Communicative English Lab", faculty: "Dr Tulika Kakkar", credits: 1, contactHours: 2 },
      { code: "26GP101", name: "Professional Competency-I", faculty: "Dr. Pawan Sharma", credits: 1, contactHours: 1 },
    ],
    schedule: [
      {
        day: "Monday",
        slots: [
          { period: 1, timeRange: "09:30-10:30", subject: "Engg Graphics & Design (G-1) (LG09) / C Lab (G-2)", code: "26ME153", room: "LG09 / Lab", type: "Lab" },
          { period: 2, timeRange: "10:30-11:30", subject: "Engg Graphics & Design (G-1) (LG09) / C Lab (G-2)", code: "26ME153", room: "LG09 / Lab", type: "Lab" },
          { period: 3, timeRange: "11:30-12:30", subject: "Chemistry & Engineering Materials", code: "26AS105A", room: "EB-202", type: "Lecture" },
          { period: 4, timeRange: "12:30-13:30", subject: "Indian Constitution and Polity", code: "26VAC102", room: "EB-202", type: "Lecture" },
          { period: 6, timeRange: "14:30-15:30", subject: "Basic Electronics Engineering", code: "26EC101", room: "EB-202", type: "Lecture" },
          { period: 7, timeRange: "15:30-16:30", subject: "Engineering Mathematics-I (Tutorial G-1)", code: "26AS101", room: "EB-202", type: "Tutorial" },
        ]
      },
      {
        day: "Tuesday",
        slots: [
          { period: 1, timeRange: "09:30-10:30", subject: "Engineering Mathematics-I", code: "26AS101", room: "EB-202", type: "Lecture" },
          { period: 2, timeRange: "10:30-11:30", subject: "Computer & C Programming", code: "26CS101", room: "EB-202", type: "Lecture" },
          { period: 3, timeRange: "11:30-12:30", subject: "Chemistry Lab (G-1) / Electronics Lab (G-2)", code: "26AS155A", room: "Hospital Block", type: "Lab" },
          { period: 4, timeRange: "12:30-13:30", subject: "Chemistry Lab (G-1) / Electronics Lab (G-2)", code: "26AS155A", room: "Hospital Block", type: "Lab" },
          { period: 6, timeRange: "14:30-15:30", subject: "Communicative English Lab (Lab no 8)", code: "26HS151", room: "Lab 8", type: "Lab" },
          { period: 7, timeRange: "15:30-16:30", subject: "Communicative English Lab (Lab no 8)", code: "26HS151", room: "Lab 8", type: "Lab" },
        ]
      },
      {
        day: "Wednesday",
        slots: [
          { period: 1, timeRange: "09:30-10:30", subject: "Basic Electronics Engineering", code: "26EC101", room: "EB-202", type: "Lecture" },
          { period: 2, timeRange: "10:30-11:30", subject: "Computer & C Programming", code: "26CS101", room: "EB-202", type: "Lecture" },
          { period: 3, timeRange: "11:30-12:30", subject: "Chemistry & Engineering Materials", code: "26AS105A", room: "EB-202", type: "Lecture" },
          { period: 4, timeRange: "12:30-13:30", subject: "Engineering Mathematics-I", code: "26AS101", room: "EB-202", type: "Lecture" },
          { period: 6, timeRange: "14:30-15:30", subject: "Chemistry Lab (G-2) / Electronics Lab (G-1)", code: "26AS155A", room: "Hospital Block", type: "Lab" },
          { period: 7, timeRange: "15:30-16:30", subject: "Chemistry Lab (G-2) / Electronics Lab (G-1)", code: "26AS155A", room: "Hospital Block", type: "Lab" },
        ]
      },
      {
        day: "Thursday",
        slots: [
          { period: 1, timeRange: "09:30-10:30", subject: "Engineering Mathematics-I", code: "26AS101", room: "EB-202", type: "Lecture" },
          { period: 2, timeRange: "10:30-11:30", subject: "Computer & C Programming", code: "26CS101", room: "EB-202", type: "Lecture" },
          { period: 3, timeRange: "11:30-12:30", subject: "Chemistry & Engineering Materials", code: "26AS105A", room: "EB-202", type: "Lecture" },
          { period: 4, timeRange: "12:30-13:30", subject: "Library / Sports", room: "Campus", type: "Free" },
          { period: 6, timeRange: "14:30-15:30", subject: "Engineering Mathematics-I (Tutorial G-2)", code: "26AS101", room: "EB-202", type: "Tutorial" },
          { period: 7, timeRange: "15:30-16:30", subject: "Library / Sports", room: "Library", type: "Free" },
        ]
      },
      {
        day: "Friday",
        slots: [
          { period: 1, timeRange: "09:30-10:30", subject: "Chemistry & Engineering Materials", code: "26AS105A", room: "EB-202", type: "Lecture" },
          { period: 2, timeRange: "10:30-11:30", subject: "Indian Constitution and Polity", code: "26VAC102", room: "EB-202", type: "Lecture" },
          { period: 3, timeRange: "11:30-12:30", subject: "Basic Electronics Engineering", code: "26EC101", room: "EB-202", type: "Lecture" },
          { period: 4, timeRange: "12:30-13:30", subject: "Professional Competency-I", code: "26GP101", room: "EB-202", type: "Lecture" },
          { period: 6, timeRange: "14:30-15:30", subject: "Graphics Lab (G-2) (LG09) / C Lab (G-1)", code: "26ME153", room: "LG09 / Lab", type: "Lab" },
          { period: 7, timeRange: "15:30-16:30", subject: "Graphics Lab (G-2) (LG09) / C Lab (G-1)", code: "26ME153", room: "LG09 / Lab", type: "Lab" },
        ]
      }
    ]
  },

  // Section 8
  {
    id: "sec-8",
    sectionNumber: 8,
    programme: "B.Tech. CSE Core",
    room: "EB-203",
    classInCharge: "Dr. Sonal",
    semester: "I",
    academicSession: "2026-27 (Odd Sem)",
    subjects: [
      { code: "26AS101", name: "Engineering Mathematics-I", faculty: "Dr. Sonal", credits: 4, contactHours: 4 },
      { code: "26AS103A", name: "Chemistry & Engineering Materials", faculty: "Dr Prashant", credits: 4, contactHours: 4 },
      { code: "26EC101", name: "Basic Electronics Engineering", faculty: "Dr Pawan Kumar Singh", credits: 3, contactHours: 3 },
      { code: "26CS101", name: "Computer and C Programming", faculty: "Dr Rakesh Ahuja", credits: 3, contactHours: 3 },
      { code: "26VAC102", name: "Indian Constitution and Polity", faculty: "Dr. Paramjit Singh", credits: 2, contactHours: 2 },
      { code: "26AS153A", name: "Chemistry Lab", faculty: "Dr Prashant", credits: 1, contactHours: 2 },
      { code: "26EC151", name: "Basic Electronics Engineering Lab", faculty: "Dr Pawan Kumar Singh", credits: 1, contactHours: 2 },
      { code: "26CS151", name: "C Programming Lab", faculty: "Dr. Pardeep Singh", credits: 1, contactHours: 2 },
      { code: "26ME153", name: "Engineering Graphics and Design Lab", faculty: "Dr Pawan Sharma", credits: 1, contactHours: 2 },
      { code: "26HS151", name: "Communicative English Lab", faculty: "Dr Alka Vishwakarma", credits: 1, contactHours: 2 },
      { code: "26GP101", name: "Professional Competency-I", faculty: "Dr. Pawan Sharma", credits: 1, contactHours: 1 },
    ],
    schedule: [
      {
        day: "Monday",
        slots: [
          { period: 1, timeRange: "09:30-10:30", subject: "Chemistry & Engineering Materials", code: "26AS103A", room: "EB-203", type: "Lecture" },
          { period: 2, timeRange: "10:30-11:30", subject: "Engineering Mathematics-I", code: "26AS101", room: "EB-203", type: "Lecture" },
          { period: 3, timeRange: "11:30-12:30", subject: "Computer & C Programming", code: "26CS101", room: "EB-203", type: "Lecture" },
          { period: 4, timeRange: "12:30-13:30", subject: "Basic Electronics Engineering", code: "26EC101", room: "EB-203", type: "Lecture" },
          { period: 6, timeRange: "14:30-15:30", subject: "Chemistry Lab (G-2) / Electronics Lab (G-1)", code: "26AS153A", room: "Hospital Block", type: "Lab" },
          { period: 7, timeRange: "15:30-16:30", subject: "Chemistry Lab (G-2) / Electronics Lab (G-1)", code: "26AS153A", room: "Hospital Block", type: "Lab" },
        ]
      },
      {
        day: "Tuesday",
        slots: [
          { period: 1, timeRange: "09:30-10:30", subject: "Graphics Lab (G-1) (LG09) / C Lab (G-2)", code: "26ME153", room: "LG09 / Lab", type: "Lab" },
          { period: 2, timeRange: "10:30-11:30", subject: "Graphics Lab (G-1) (LG09) / C Lab (G-2)", code: "26ME153", room: "LG09 / Lab", type: "Lab" },
          { period: 3, timeRange: "11:30-12:30", subject: "Computer & C Programming", code: "26CS101", room: "EB-203", type: "Lecture" },
          { period: 4, timeRange: "12:30-13:30", subject: "Chemistry & Engineering Materials", code: "26AS103A", room: "EB-203", type: "Lecture" },
          { period: 6, timeRange: "14:30-15:30", subject: "Indian Constitution and Polity", code: "26VAC102", room: "EB-203", type: "Lecture" },
          { period: 7, timeRange: "15:30-16:30", subject: "Engineering Mathematics-I (Tutorial G-1)", code: "26AS101", room: "EB-203", type: "Tutorial" },
        ]
      },
      {
        day: "Wednesday",
        slots: [
          { period: 1, timeRange: "09:30-10:30", subject: "Computer & C Programming", code: "26CS101", room: "EB-203", type: "Lecture" },
          { period: 2, timeRange: "10:30-11:30", subject: "Engineering Mathematics-I", code: "26AS101", room: "EB-203", type: "Lecture" },
          { period: 3, timeRange: "11:30-12:30", subject: "Chemistry Lab (G-1) / Electronics Lab (G-2)", code: "26AS153A", room: "Hospital Block", type: "Lab" },
          { period: 4, timeRange: "12:30-13:30", subject: "Chemistry Lab (G-1) / Electronics Lab (G-2)", code: "26AS153A", room: "Hospital Block", type: "Lab" },
          { period: 6, timeRange: "14:30-15:30", subject: "Engineering Mathematics-I (Tutorial G-2)", code: "26AS101", room: "EB-203", type: "Tutorial" },
          { period: 7, timeRange: "15:30-16:30", subject: "Basic Electronics Engineering", code: "26EC101", room: "EB-203", type: "Lecture" },
        ]
      },
      {
        day: "Thursday",
        slots: [
          { period: 1, timeRange: "09:30-10:30", subject: "Engineering Mathematics-I", code: "26AS101", room: "EB-203", type: "Lecture" },
          { period: 2, timeRange: "10:30-11:30", subject: "Chemistry & Engineering Materials", code: "26AS103A", room: "EB-203", type: "Lecture" },
          { period: 3, timeRange: "11:30-12:30", subject: "Communicative English Lab (Lab no 8)", code: "26HS151", room: "Lab 8", type: "Lab" },
          { period: 4, timeRange: "12:30-13:30", subject: "Communicative English Lab (Lab no 8)", code: "26HS151", room: "Lab 8", type: "Lab" },
          { period: 6, timeRange: "14:30-15:30", subject: "Indian Constitution and Polity", code: "26VAC102", room: "EB-203", type: "Lecture" },
          { period: 7, timeRange: "15:30-16:30", subject: "Library / Sports", room: "Campus", type: "Free" },
        ]
      },
      {
        day: "Friday",
        slots: [
          { period: 1, timeRange: "09:30-10:30", subject: "Chemistry & Engineering Materials", code: "26AS103A", room: "EB-203", type: "Lecture" },
          { period: 2, timeRange: "10:30-11:30", subject: "Graphics Lab (G-2) (LG09) / C Lab (G-1)", code: "26ME153", room: "LG09 / Lab", type: "Lab" },
          { period: 3, timeRange: "11:30-12:30", subject: "Graphics Lab (G-2) (LG09) / C Lab (G-1)", code: "26ME153", room: "LG09 / Lab", type: "Lab" },
          { period: 4, timeRange: "12:30-13:30", subject: "Library / Sports", room: "Library", type: "Free" },
          { period: 6, timeRange: "14:30-15:30", subject: "Professional Competency-I", code: "26GP101", room: "EB-203", type: "Lecture" },
          { period: 7, timeRange: "15:30-16:30", subject: "Professional Competency-I", code: "26GP101", room: "EB-203", type: "Lecture" },
        ]
      }
    ]
  },

  // Section 9
  {
    id: "sec-9",
    sectionNumber: 9,
    programme: "B.Tech. CSE Core",
    room: "EB-204",
    classInCharge: "Dr Nagesha",
    semester: "I",
    academicSession: "2026-27 (Odd Sem)",
    subjects: [
      { code: "26AS101", name: "Engineering Mathematics-I", faculty: "Dr. Deepak Grover", credits: 4, contactHours: 4 },
      { code: "26AS103A", name: "Chemistry & Engineering Materials", faculty: "Dr. Deepak Mishra", credits: 4, contactHours: 4 },
      { code: "26EC101", name: "Basic Electronics Engineering", faculty: "Dr Tejbir Singh", credits: 3, contactHours: 3 },
      { code: "26CS101", name: "Computer and C Programming", faculty: "Dr. Pardeep Singh", credits: 3, contactHours: 3 },
      { code: "26VAC102", name: "Indian Constitution and Polity", faculty: "Dr. Paramjit Singh", credits: 2, contactHours: 2 },
      { code: "26AS153A", name: "Chemistry Lab", faculty: "Dr. Deepak Mishra", credits: 1, contactHours: 2 },
      { code: "26EC151", name: "Basic Electronics Engineering Lab", faculty: "Dr Tejbir Singh", credits: 1, contactHours: 2 },
      { code: "26CS151", name: "C Programming Lab", faculty: "Dr. Rakesh Ahuja", credits: 1, contactHours: 2 },
      { code: "26ME153", name: "Engineering Graphics and Design Lab", faculty: "Dr Nagesha", credits: 1, contactHours: 2 },
      { code: "26HS151", name: "Communicative English Lab", faculty: "Dr. Pragya", credits: 1, contactHours: 2 },
      { code: "26GP101", name: "Professional Competency-I", faculty: "Dr. B. P.Sharma", credits: 1, contactHours: 1 },
    ],
    schedule: [
      {
        day: "Monday",
        slots: [
          { period: 1, timeRange: "09:30-10:30", subject: "Communicative English Lab (Lab no 2)", code: "26HS151", room: "Lab 2", type: "Lab" },
          { period: 2, timeRange: "10:30-11:30", subject: "Communicative English Lab (Lab no 2)", code: "26HS151", room: "Lab 2", type: "Lab" },
          { period: 3, timeRange: "11:30-12:30", subject: "Chemistry & Engineering Materials", code: "26AS103A", room: "EB-204", type: "Lecture" },
          { period: 4, timeRange: "12:30-13:30", subject: "Indian Constitution and Polity", code: "26VAC102", room: "EB-204", type: "Lecture" },
          { period: 6, timeRange: "14:30-15:30", subject: "Basic Electronics Engineering", code: "26EC101", room: "EB-204", type: "Lecture" },
          { period: 7, timeRange: "15:30-16:30", subject: "Engineering Mathematics-I (Tutorial G-1)", code: "26AS101", room: "EB-204", type: "Tutorial" },
        ]
      },
      {
        day: "Tuesday",
        slots: [
          { period: 1, timeRange: "09:30-10:30", subject: "Chemistry & Engineering Materials", code: "26AS103A", room: "EB-204", type: "Lecture" },
          { period: 2, timeRange: "10:30-11:30", subject: "Engineering Mathematics-I", code: "26AS101", room: "EB-204", type: "Lecture" },
          { period: 3, timeRange: "11:30-12:30", subject: "Computer & C Programming", code: "26CS101", room: "EB-204", type: "Lecture" },
          { period: 4, timeRange: "12:30-13:30", subject: "Professional Competency-I", code: "26GP101", room: "EB-204", type: "Lecture" },
          { period: 6, timeRange: "14:30-15:30", subject: "Chemistry Lab (G-1) / Electronics Lab (G-2)", code: "26AS153A", room: "Hospital Block", type: "Lab" },
          { period: 7, timeRange: "15:30-16:30", subject: "Chemistry Lab (G-1) / Electronics Lab (G-2)", code: "26AS153A", room: "Hospital Block", type: "Lab" },
        ]
      },
      {
        day: "Wednesday",
        slots: [
          { period: 1, timeRange: "09:30-10:30", subject: "Graphics Lab (G-1) (LG09) / C Lab (G-2)", code: "26ME153", room: "LG09 / Lab", type: "Lab" },
          { period: 2, timeRange: "10:30-11:30", subject: "Graphics Lab (G-1) (LG09) / C Lab (G-2)", code: "26ME153", room: "LG09 / Lab", type: "Lab" },
          { period: 3, timeRange: "11:30-12:30", subject: "Basic Electronics Engineering", code: "26EC101", room: "EB-204", type: "Lecture" },
          { period: 4, timeRange: "12:30-13:30", subject: "Indian Constitution and Polity", code: "26VAC102", room: "EB-204", type: "Lecture" },
          { period: 6, timeRange: "14:30-15:30", subject: "Engineering Mathematics-I", code: "26AS101", room: "EB-204", type: "Lecture" },
          { period: 7, timeRange: "15:30-16:30", subject: "Chemistry & Engineering Materials", code: "26AS103A", room: "EB-204", type: "Lecture" },
        ]
      },
      {
        day: "Thursday",
        slots: [
          { period: 1, timeRange: "09:30-10:30", subject: "Computer & C Programming", code: "26CS101", room: "EB-204", type: "Lecture" },
          { period: 2, timeRange: "10:30-11:30", subject: "Chemistry & Engineering Materials", code: "26AS103A", room: "EB-204", type: "Lecture" },
          { period: 3, timeRange: "11:30-12:30", subject: "Graphics Lab (G-2) (LG09) / C Lab (G-1)", code: "26ME153", room: "LG09 / Lab", type: "Lab" },
          { period: 4, timeRange: "12:30-13:30", subject: "Graphics Lab (G-2) (LG09) / C Lab (G-1)", code: "26ME153", room: "LG09 / Lab", type: "Lab" },
          { period: 6, timeRange: "14:30-15:30", subject: "Basic Electronics Engineering", code: "26EC101", room: "EB-204", type: "Lecture" },
          { period: 7, timeRange: "15:30-16:30", subject: "Library / Sports", room: "Campus", type: "Free" },
        ]
      },
      {
        day: "Friday",
        slots: [
          { period: 1, timeRange: "09:30-10:30", subject: "Engineering Mathematics-I", code: "26AS101", room: "EB-204", type: "Lecture" },
          { period: 2, timeRange: "10:30-11:30", subject: "Computer & C Programming", code: "26CS101", room: "EB-204", type: "Lecture" },
          { period: 3, timeRange: "11:30-12:30", subject: "Chemistry Lab (G-2) / Electronics Lab (G-1)", code: "26AS153A", room: "Hospital Block", type: "Lab" },
          { period: 4, timeRange: "12:30-13:30", subject: "Chemistry Lab (G-2) / Electronics Lab (G-1)", code: "26AS153A", room: "Hospital Block", type: "Lab" },
          { period: 6, timeRange: "14:30-15:30", subject: "Engineering Mathematics-I (Tutorial G-2)", code: "26AS101", room: "EB-204", type: "Tutorial" },
          { period: 7, timeRange: "15:30-16:30", subject: "Library / Sports", room: "Library", type: "Free" },
        ]
      }
    ]
  },

  // Section 10
  {
    id: "sec-10",
    sectionNumber: 10,
    programme: "B.Tech. CSE Core",
    room: "EB-205",
    classInCharge: "Ms Ridhi Jain",
    semester: "I",
    academicSession: "2026-27 (Odd Sem)",
    subjects: [
      { code: "26AS101", name: "Engineering Mathematics-I", faculty: "Dr. Sanjey Kumar", credits: 4, contactHours: 4 },
      { code: "26AS103A", name: "Chemistry & Engineering Materials", faculty: "Dr Ajit Kumar", credits: 4, contactHours: 4 },
      { code: "26EC101", name: "Basic Electronics Engineering", faculty: "Dr. B P. Sharma", credits: 3, contactHours: 3 },
      { code: "26CS101", name: "Computer and C Programming", faculty: "Dr. M. Mohan", credits: 3, contactHours: 3 },
      { code: "26VAC102", name: "Indian Constitution and Polity", faculty: "Ms. Nidhi Mehta", credits: 2, contactHours: 2 },
      { code: "26AS153A", name: "Chemistry Lab", faculty: "Dr Ajit Kumar", credits: 1, contactHours: 2 },
      { code: "26EC151", name: "Basic Electronics Engineering Lab", faculty: "Dr. B.P.Sharma", credits: 1, contactHours: 2 },
      { code: "26CS151", name: "C Programming Lab", faculty: "Dr. M.Mohan", credits: 1, contactHours: 2 },
      { code: "26ME153", name: "Engineering Graphics and Design Lab", faculty: "Ms Taran", credits: 1, contactHours: 2 },
      { code: "26HS151", name: "Communicative English Lab", faculty: "Ms. Ridhi Jain", credits: 1, contactHours: 2 },
      { code: "26GP101", name: "Professional Competency-I", faculty: "Dr. B. P.Sharma", credits: 1, contactHours: 1 },
    ],
    schedule: [
      {
        day: "Monday",
        slots: [
          { period: 1, timeRange: "09:30-10:30", subject: "Engineering Mathematics-I", code: "26AS101", room: "EB-205", type: "Lecture" },
          { period: 2, timeRange: "10:30-11:30", subject: "Basic Electronics Engineering", code: "26EC101", room: "EB-205", type: "Lecture" },
          { period: 3, timeRange: "11:30-12:30", subject: "Chemistry & Engineering Materials", code: "26AS103A", room: "EB-205", type: "Lecture" },
          { period: 4, timeRange: "12:30-13:30", subject: "Computer & C Programming", code: "26CS101", room: "EB-205", type: "Lecture" },
          { period: 6, timeRange: "14:30-15:30", subject: "Graphics Lab (G-1) (LG09) / C Lab (G-2)", code: "26ME153", room: "LG09 / Lab", type: "Lab" },
          { period: 7, timeRange: "15:30-16:30", subject: "Graphics Lab (G-1) (LG09) / C Lab (G-2)", code: "26ME153", room: "LG09 / Lab", type: "Lab" },
        ]
      },
      {
        day: "Tuesday",
        slots: [
          { period: 1, timeRange: "09:30-10:30", subject: "Chemistry Lab (G-1) / Electronics Lab (G-2)", code: "26AS153A", room: "Hospital Block", type: "Lab" },
          { period: 2, timeRange: "10:30-11:30", subject: "Chemistry Lab (G-1) / Electronics Lab (G-2)", code: "26AS153A", room: "Hospital Block", type: "Lab" },
          { period: 3, timeRange: "11:30-12:30", subject: "Computer & C Programming", code: "26CS101", room: "EB-205", type: "Lecture" },
          { period: 4, timeRange: "12:30-13:30", subject: "Chemistry & Engineering Materials", code: "26AS103A", room: "EB-205", type: "Lecture" },
          { period: 6, timeRange: "14:30-15:30", subject: "Indian Constitution and Polity", code: "26VAC102", room: "EB-205", type: "Lecture" },
          { period: 7, timeRange: "15:30-16:30", subject: "Basic Electronics Engineering", code: "26EC101", room: "EB-205", type: "Lecture" },
        ]
      },
      {
        day: "Wednesday",
        slots: [
          { period: 1, timeRange: "09:30-10:30", subject: "Chemistry Lab (G-2) / Electronics Lab (G-1)", code: "26AS153A", room: "Hospital Block", type: "Lab" },
          { period: 2, timeRange: "10:30-11:30", subject: "Chemistry Lab (G-2) / Electronics Lab (G-1)", code: "26AS153A", room: "Hospital Block", type: "Lab" },
          { period: 3, timeRange: "11:30-12:30", subject: "Computer & C Programming", code: "26CS101", room: "EB-205", type: "Lecture" },
          { period: 4, timeRange: "12:30-13:30", subject: "Engineering Mathematics-I (Tutorial G-1)", code: "26AS101", room: "EB-205", type: "Tutorial" },
          { period: 6, timeRange: "14:30-15:30", subject: "Chemistry & Engineering Materials", code: "26AS103A", room: "EB-205", type: "Lecture" },
          { period: 7, timeRange: "15:30-16:30", subject: "Professional Competency-I", code: "26GP101", room: "EB-205", type: "Lecture" },
        ]
      },
      {
        day: "Thursday",
        slots: [
          { period: 1, timeRange: "09:30-10:30", subject: "Graphics Lab (G-1) (LG09) / C Lab (G-2)", code: "26ME153", room: "LG09 / Lab", type: "Lab" },
          { period: 2, timeRange: "10:30-11:30", subject: "Basic Electronics Engineering", code: "26EC101", room: "EB-205", type: "Lecture" },
          { period: 3, timeRange: "11:30-12:30", subject: "Engineering Mathematics-I", code: "26AS101", room: "EB-205", type: "Lecture" },
          { period: 4, timeRange: "12:30-13:30", subject: "Engineering Mathematics-I (Tutorial G-2)", code: "26AS101", room: "EB-205", type: "Tutorial" },
          { period: 6, timeRange: "14:30-15:30", subject: "Library / Sports", room: "Campus", type: "Free" },
          { period: 7, timeRange: "15:30-16:30", subject: "Library / Sports", room: "Campus", type: "Free" },
        ]
      },
      {
        day: "Friday",
        slots: [
          { period: 1, timeRange: "09:30-10:30", subject: "Engineering Mathematics-I", code: "26AS101", room: "EB-205", type: "Lecture" },
          { period: 2, timeRange: "10:30-11:30", subject: "Indian Constitution and Polity", code: "26VAC102", room: "EB-205", type: "Lecture" },
          { period: 3, timeRange: "11:30-12:30", subject: "Communicative English Lab (Lab no 4)", code: "26HS151", room: "Lab 4", type: "Lab" },
          { period: 4, timeRange: "12:30-13:30", subject: "Communicative English Lab (Lab no 4)", code: "26HS151", room: "Lab 4", type: "Lab" },
          { period: 6, timeRange: "14:30-15:30", subject: "Chemistry & Engineering Materials", code: "26AS103A", room: "EB-205", type: "Lecture" },
          { period: 7, timeRange: "15:30-16:30", subject: "Library / Sports", room: "Library", type: "Free" },
        ]
      }
    ]
  },

  // Section 11
  {
    id: "sec-11",
    sectionNumber: 11,
    programme: "B.Tech. BME",
    room: "EB-213",
    classInCharge: "Dr. Hemant",
    semester: "I",
    academicSession: "2026-27 (Odd Sem)",
    subjects: [
      { code: "26AS107 / 25AS109", name: "Mathematics-I (for BME) / Biology (for BME)", faculty: "Ms. Manoranjitham / Dr Anjali Priyadarshani", credits: 2, contactHours: 2 },
      { code: "26AS105C", name: "Chemistry and Biomaterials", faculty: "Dr. Naresh", credits: 4, contactHours: 4 },
      { code: "26EC101", name: "Basic Electronics Engineering", faculty: "Dr. Hemant", credits: 3, contactHours: 3 },
      { code: "26CS101", name: "Fundamentals of Computer and C Programming", faculty: "Dr. Ruchi Kawatra", credits: 3, contactHours: 3 },
      { code: "26VAC102", name: "Indian Constitution and Polity", faculty: "Mr. Sooraj", credits: 2, contactHours: 2 },
      { code: "26AS155C", name: "Chemistry and Biomaterials Lab", faculty: "Dr. Naresh", credits: 1, contactHours: 2 },
      { code: "26EC151", name: "Basic Electronics Engineering Lab", faculty: "Dr. Hemant", credits: 1, contactHours: 2 },
      { code: "26CS151", name: "C Programming Lab", faculty: "Dr. Ruchi Kawatra", credits: 1, contactHours: 2 },
      { code: "26ME153", name: "Engineering Graphics and Design Lab", faculty: "Dr N K Sharma", credits: 1, contactHours: 2 },
      { code: "26HS151", name: "Communicative English Lab", faculty: "Dr. Mudasir Rahman", credits: 1, contactHours: 2 },
      { code: "26GP101", name: "Professional Competency-I", faculty: "Dr. Naresh", credits: 1, contactHours: 1 },
    ],
    schedule: [
      {
        day: "Monday",
        slots: [
          { period: 1, timeRange: "09:30-10:30", subject: "Chemistry & Biomaterials Lab (G-1) / Electronics Lab (G-2)", code: "26AS155C", room: "Hospital Block", type: "Lab" },
          { period: 2, timeRange: "10:30-11:30", subject: "Chemistry & Biomaterials Lab (G-1) / Electronics Lab (G-2)", code: "26AS155C", room: "Hospital Block", type: "Lab" },
          { period: 3, timeRange: "11:30-12:30", subject: "Computer & C Programming", code: "26CS101", room: "EB-213", type: "Lecture" },
          { period: 4, timeRange: "12:30-13:30", subject: "Mathematics-I", code: "26AS107", room: "EB-213", type: "Lecture" },
          { period: 6, timeRange: "14:30-15:30", subject: "Chemistry and Biomaterials", code: "26AS105C", room: "EB-213", type: "Lecture" },
          { period: 7, timeRange: "15:30-16:30", subject: "Professional Competency-I", code: "26GP101", room: "EB-213", type: "Lecture" },
        ]
      },
      {
        day: "Tuesday",
        slots: [
          { period: 1, timeRange: "09:30-10:30", subject: "Basic Electronics Engineering", code: "26EC101", room: "EB-213", type: "Lecture" },
          { period: 2, timeRange: "10:30-11:30", subject: "Biology", code: "25AS109", room: "EB-213", type: "Lecture" },
          { period: 3, timeRange: "11:30-12:30", subject: "Graphics Lab (G-1) (LG09) / C Lab (G-2)", code: "26ME153", room: "LG09 / Lab", type: "Lab" },
          { period: 4, timeRange: "12:30-13:30", subject: "Graphics Lab (G-1) (LG09) / C Lab (G-2)", code: "26ME153", room: "LG09 / Lab", type: "Lab" },
          { period: 6, timeRange: "14:30-15:30", subject: "Computer & C Programming", code: "26CS101", room: "EB-213", type: "Lecture" },
          { period: 7, timeRange: "15:30-16:30", subject: "Library / Sports", room: "Campus", type: "Free" },
        ]
      },
      {
        day: "Wednesday",
        slots: [
          { period: 1, timeRange: "09:30-10:30", subject: "Biology", code: "25AS109", room: "EB-213", type: "Lecture" },
          { period: 2, timeRange: "10:30-11:30", subject: "Chemistry and Biomaterials", code: "26AS105C", room: "EB-213", type: "Lecture" },
          { period: 3, timeRange: "11:30-12:30", subject: "Indian Constitution and Polity", code: "26VAC102", room: "EB-213", type: "Lecture" },
          { period: 4, timeRange: "12:30-13:30", subject: "Library / Sports", room: "Grounds", type: "Free" },
          { period: 6, timeRange: "14:30-15:30", subject: "Graphics Lab (G-2) (LG09) / C Lab (G-1)", code: "26ME153", room: "LG09 / Lab", type: "Lab" },
          { period: 7, timeRange: "15:30-16:30", subject: "Graphics Lab (G-2) (LG09) / C Lab (G-1)", code: "26ME153", room: "LG09 / Lab", type: "Lab" },
        ]
      },
      {
        day: "Thursday",
        slots: [
          { period: 1, timeRange: "09:30-10:30", subject: "Mathematics-I", code: "26AS107", room: "EB-213", type: "Lecture" },
          { period: 2, timeRange: "10:30-11:30", subject: "Basic Electronics Engineering", code: "26EC101", room: "EB-213", type: "Lecture" },
          { period: 3, timeRange: "11:30-12:30", subject: "Indian Constitution and Polity", code: "26VAC102", room: "EB-213", type: "Lecture" },
          { period: 4, timeRange: "12:30-13:30", subject: "Chemistry and Biomaterials", code: "26AS105C", room: "EB-213", type: "Lecture" },
          { period: 6, timeRange: "14:30-15:30", subject: "Chemistry Lab (G-2) / Electronics Lab (G-1)", code: "26AS155C", room: "Hospital Block", type: "Lab" },
          { period: 7, timeRange: "15:30-16:30", subject: "Chemistry Lab (G-2) / Electronics Lab (G-1)", code: "26AS155C", room: "Hospital Block", type: "Lab" },
        ]
      },
      {
        day: "Friday",
        slots: [
          { period: 1, timeRange: "09:30-10:30", subject: "Basic Electronics Engineering", code: "26EC101", room: "EB-213", type: "Lecture" },
          { period: 2, timeRange: "10:30-11:30", subject: "Computer & C Programming", code: "26CS101", room: "EB-213", type: "Lecture" },
          { period: 3, timeRange: "11:30-12:30", subject: "Chemistry and Biomaterials", code: "26AS105C", room: "EB-213", type: "Lecture" },
          { period: 4, timeRange: "12:30-13:30", subject: "Library / Sports", room: "Library", type: "Free" },
          { period: 6, timeRange: "14:30-15:30", subject: "Communicative English Lab (Lab no 312)", code: "26HS151", room: "Lab 312", type: "Lab" },
          { period: 7, timeRange: "15:30-16:30", subject: "Communicative English Lab (Lab no 312)", code: "26HS151", room: "Lab 312", type: "Lab" },
        ]
      }
    ]
  },

  // Section 12
  {
    id: "sec-12",
    sectionNumber: 12,
    programme: "B.Tech. CE, ME, EEE, ECE, Robotics",
    room: "EB-216",
    classInCharge: "Mr. P Arun",
    semester: "I",
    academicSession: "2026-27 (Odd Sem)",
    subjects: [
      { code: "26AS101", name: "Engineering Mathematics-I", faculty: "Dr Neelu Chaudhary", credits: 4, contactHours: 4 },
      { code: "26AS105B", name: "Applied Chemistry & Materials Science", faculty: "Dr. Avinash", credits: 4, contactHours: 4 },
      { code: "26EC101", name: "Basic Electronics Engineering", faculty: "Mr. P Arun", credits: 3, contactHours: 3 },
      { code: "26CS101", name: "Computer and C Programming", faculty: "Dr. Jasminder Kaur Sandhu", credits: 3, contactHours: 3 },
      { code: "26VAC102", name: "Indian Constitution and Polity", faculty: "Ms. Nidhi Mehta", credits: 2, contactHours: 2 },
      { code: "26AS155B", name: "Applied Chemistry Lab", faculty: "Dr Avinash", credits: 1, contactHours: 2 },
      { code: "26EC151", name: "Basic Electronics Engineering Lab", faculty: "Mr P Arun", credits: 1, contactHours: 2 },
      { code: "26CS151", name: "C Programming Lab", faculty: "Dr. Jasminder Kaur Sandhu", credits: 1, contactHours: 2 },
      { code: "26ME153", name: "Engineering Graphics and Design Lab", faculty: "Mr. Ankit Mani Tripathi", credits: 1, contactHours: 2 },
      { code: "26HS151", name: "Communicative English Lab", faculty: "Ms. Banani Barman", credits: 1, contactHours: 2 },
      { code: "26GP101", name: "Professional Competency-I", faculty: "Dr. Naresh", credits: 1, contactHours: 1 },
    ],
    schedule: [
      {
        day: "Monday",
        slots: [
          { period: 1, timeRange: "09:30-10:30", subject: "Computer & C Programming", code: "26CS101", room: "EB-216", type: "Lecture" },
          { period: 2, timeRange: "10:30-11:30", subject: "Applied Chemistry & Materials Science", code: "26AS105B", room: "EB-216", type: "Lecture" },
          { period: 3, timeRange: "11:30-12:30", subject: "Applied Chemistry Lab (G-1) / Electronics Lab (G-2)", code: "26AS155B", room: "Hospital Block", type: "Lab" },
          { period: 4, timeRange: "12:30-13:30", subject: "Applied Chemistry Lab (G-1) / Electronics Lab (G-2)", code: "26AS155B", room: "Hospital Block", type: "Lab" },
          { period: 6, timeRange: "14:30-15:30", subject: "Basic Electronics Engineering", code: "26EC101", room: "EB-216", type: "Lecture" },
          { period: 7, timeRange: "15:30-16:30", subject: "Professional Competency-I", code: "26GP101", room: "EB-216", type: "Lecture" },
        ]
      },
      {
        day: "Tuesday",
        slots: [
          { period: 1, timeRange: "09:30-10:30", subject: "Engineering Mathematics-I", code: "26AS101", room: "EB-216", type: "Lecture" },
          { period: 2, timeRange: "10:30-11:30", subject: "Computer & C Programming", code: "26CS101", room: "EB-216", type: "Lecture" },
          { period: 3, timeRange: "11:30-12:30", subject: "Indian Constitution and Polity", code: "26VAC102", room: "EB-216", type: "Lecture" },
          { period: 4, timeRange: "12:30-13:30", subject: "Basic Electronics Engineering", code: "26EC101", room: "EB-216", type: "Lecture" },
          { period: 6, timeRange: "14:30-15:30", subject: "Graphics Lab (G-1) (LG09) / C Lab (G-2)", code: "26ME153", room: "LG09 / Lab", type: "Lab" },
          { period: 7, timeRange: "15:30-16:30", subject: "Graphics Lab (G-1) (LG09) / C Lab (G-2)", code: "26ME153", room: "LG09 / Lab", type: "Lab" },
        ]
      },
      {
        day: "Wednesday",
        slots: [
          { period: 1, timeRange: "09:30-10:30", subject: "Applied Chemistry & Materials Science", code: "26AS105B", room: "EB-216", type: "Lecture" },
          { period: 2, timeRange: "10:30-11:30", subject: "Basic Electronics Engineering", code: "26EC101", room: "EB-216", type: "Lecture" },
          { period: 3, timeRange: "11:30-12:30", subject: "Engineering Mathematics-I", code: "26AS101", room: "EB-216", type: "Lecture" },
          { period: 4, timeRange: "12:30-13:30", subject: "Library / Sports", room: "Grounds", type: "Free" },
          { period: 6, timeRange: "14:30-15:30", subject: "Communicative English Lab (Lab no 8)", code: "26HS151", room: "Lab 8", type: "Lab" },
          { period: 7, timeRange: "15:30-16:30", subject: "Communicative English Lab (Lab no 8)", code: "26HS151", room: "Lab 8", type: "Lab" },
        ]
      },
      {
        day: "Thursday",
        slots: [
          { period: 1, timeRange: "09:30-10:30", subject: "Computer & C Programming", code: "26CS101", room: "EB-216", type: "Lecture" },
          { period: 2, timeRange: "10:30-11:30", subject: "Indian Constitution and Polity", code: "26VAC102", room: "EB-216", type: "Lecture" },
          { period: 3, timeRange: "11:30-12:30", subject: "Applied Chemistry & Materials Science", code: "26AS105B", room: "EB-216", type: "Lecture" },
          { period: 4, timeRange: "12:30-13:30", subject: "Engineering Mathematics-I", code: "26AS101", room: "EB-216", type: "Lecture" },
          { period: 6, timeRange: "14:30-15:30", subject: "Graphics Lab (G-2) (LG09) / C Lab (G-1)", code: "26ME153", room: "LG09 / Lab", type: "Lab" },
          { period: 7, timeRange: "15:30-16:30", subject: "Graphics Lab (G-2) (LG09) / C Lab (G-1)", code: "26ME153", room: "LG09 / Lab", type: "Lab" },
        ]
      },
      {
        day: "Friday",
        slots: [
          { period: 1, timeRange: "09:30-10:30", subject: "Applied Chemistry Lab (G-2) / Electronics Lab (G-1)", code: "26AS155B", room: "Hospital Block", type: "Lab" },
          { period: 2, timeRange: "10:30-11:30", subject: "Applied Chemistry Lab (G-2) / Electronics Lab (G-1)", code: "26AS155B", room: "Hospital Block", type: "Lab" },
          { period: 3, timeRange: "11:30-12:30", subject: "Applied Chemistry & Materials Science", code: "26AS105B", room: "EB-216", type: "Lecture" },
          { period: 4, timeRange: "12:30-13:30", subject: "Engineering Mathematics-I (Tutorial G-2)", code: "26AS101", room: "EB-216", type: "Tutorial" },
          { period: 6, timeRange: "14:30-15:30", subject: "Engineering Mathematics-I (Tutorial G-1)", code: "26AS101", room: "EB-216", type: "Tutorial" },
          { period: 7, timeRange: "15:30-16:30", subject: "Library / Sports", room: "Library", type: "Free" },
        ]
      }
    ]
  }
];

export function convertProgrammeToScheduleEvents(section: ProgrammeSection): ScheduleEvent[] {
  const events: ScheduleEvent[] = [];

  section.schedule.forEach((daySchedule) => {
    daySchedule.slots.forEach((slot, idx) => {
      const timing = PERIOD_TIMINGS.find((p) => p.period === slot.period);
      const subjectInfo = section.subjects.find((s) => s.code === slot.code || s.name === slot.subject);

      events.push({
        id: `tt-${section.id}-${daySchedule.day.toLowerCase()}-${slot.period}-${idx}`,
        course: slot.subject,
        code: slot.code || subjectInfo?.code || "SRM101",
        startTime: timing?.startTime || "09:30",
        endTime: timing?.endTime || "10:30",
        room: slot.room || section.room,
        faculty: subjectInfo?.faculty || section.classInCharge,
        day: daySchedule.day,
        type: slot.type || "Lecture",
        status: "normal",
        notes: `Section ${section.sectionNumber} • ${section.programme} • Room ${slot.room || section.room}`,
      });
    });
  });

  return events;
}
