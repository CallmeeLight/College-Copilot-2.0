import { ScheduleEvent, Assignment, AttendanceRecord, Announcement, CampusLocation, Exam, FeeItem, NoteItem } from "../types";

export const initialScheduleEvents: ScheduleEvent[] = [
  // Monday
  {
    id: "sch-mon-1",
    course: "Mathematics",
    code: "MATH201",
    startTime: "09:00",
    endTime: "09:50",
    room: "Room A-204",
    faculty: "Dr. Robert Chen",
    day: "Monday",
    type: "Lecture",
    status: "normal",
    notes: "Eigenvalues & Differential Equations review",
  },
  {
    id: "sch-mon-2",
    course: "Physics",
    code: "PHY102",
    startTime: "10:00",
    endTime: "10:50",
    room: "Room B-102",
    faculty: "Prof. Elena Rostova",
    day: "Monday",
    type: "Lecture",
    status: "normal",
    notes: "Wave packet propagation & uncertainty",
  },
  {
    id: "sch-mon-3",
    course: "BME Laboratory",
    code: "BME310",
    startTime: "11:15",
    endTime: "13:15",
    room: "Lab 3",
    faculty: "Dr. Marcus Thorne",
    day: "Monday",
    type: "Lab",
    status: "normal",
    notes: "Hardware implementation of 50Hz notch filter for ECG",
  },
  {
    id: "sch-mon-4",
    course: "Free Time & Lunch",
    code: "BREAK",
    startTime: "13:15",
    endTime: "14:00",
    room: "Student Commons",
    faculty: "Self-Study",
    day: "Monday",
    type: "Free",
    status: "normal",
    notes: "Ideal 45-min window to polish Physics homework",
  },
  {
    id: "sch-mon-5",
    course: "Programming",
    code: "CS204",
    startTime: "14:00",
    endTime: "14:50",
    room: "Room C-301",
    faculty: "Prof. Sarah Vance",
    day: "Monday",
    type: "Lecture",
    status: "normal",
    notes: "Dynamic programming state transition equations",
  },

  // Tuesday
  {
    id: "sch-tue-1",
    course: "Biology for Engineers",
    code: "BIO105",
    startTime: "09:30",
    endTime: "10:20",
    room: "Room A-105",
    faculty: "Dr. Arvind Swaminathan",
    day: "Tuesday",
    type: "Lecture",
    status: "normal",
  },
  {
    id: "sch-tue-2",
    course: "Chemistry Laboratory",
    code: "CHEM102",
    startTime: "11:00",
    endTime: "12:50",
    room: "Lab 2",
    faculty: "Dr. Clara Mitchell",
    day: "Tuesday",
    type: "Lab",
    status: "normal",
  },
  {
    id: "sch-tue-3",
    course: "Mathematics",
    code: "MATH201",
    startTime: "14:30",
    endTime: "15:20",
    room: "Room A-204",
    faculty: "Dr. Robert Chen",
    day: "Tuesday",
    type: "Tutorial",
    status: "normal",
  },

  // Wednesday
  {
    id: "sch-wed-1",
    course: "Physics",
    code: "PHY102",
    startTime: "09:00",
    endTime: "09:50",
    room: "Room B-102",
    faculty: "Prof. Elena Rostova",
    day: "Wednesday",
    type: "Lecture",
    status: "normal",
  },
  {
    id: "sch-wed-2",
    course: "Data Structures & Algorithms",
    code: "CS204",
    startTime: "10:00",
    endTime: "11:40",
    room: "Room C-202",
    faculty: "Prof. Sarah Vance",
    day: "Wednesday",
    type: "Lecture",
    status: "normal",
  },
  {
    id: "sch-wed-3",
    course: "Mathematics",
    code: "MATH201",
    startTime: "14:00",
    endTime: "14:50",
    room: "Room A-204",
    faculty: "Dr. Robert Chen",
    day: "Wednesday",
    type: "Lecture",
    status: "normal",
  },

  // Thursday
  {
    id: "sch-thu-1",
    course: "Biomedical Signal Processing",
    code: "BME310",
    startTime: "10:00",
    endTime: "11:50",
    room: "Lab 3",
    faculty: "Dr. Marcus Thorne",
    day: "Thursday",
    type: "Lab",
    status: "normal",
  },
  {
    id: "sch-thu-2",
    course: "Technical Communication",
    code: "ENG201",
    startTime: "13:00",
    endTime: "13:50",
    room: "Room D-101",
    faculty: "Prof. Karen Hayes",
    day: "Thursday",
    type: "Lecture",
    status: "normal",
  },
  {
    id: "sch-thu-3",
    course: "Mathematics",
    code: "MATH201",
    startTime: "14:15",
    endTime: "15:05",
    room: "Room A-204",
    faculty: "Dr. Robert Chen",
    day: "Thursday",
    type: "Lecture",
    status: "normal",
  },

  // Friday
  {
    id: "sch-fri-1",
    course: "Physics Tutorial",
    code: "PHY102",
    startTime: "09:00",
    endTime: "09:50",
    room: "Room B-102",
    faculty: "Prof. Elena Rostova",
    day: "Friday",
    type: "Tutorial",
    status: "normal",
  },
  {
    id: "sch-fri-2",
    course: "Programming Project Lab",
    code: "CS204",
    startTime: "10:15",
    endTime: "12:15",
    room: "Room C-301",
    faculty: "Prof. Sarah Vance",
    day: "Friday",
    type: "Lab",
    status: "normal",
  },
  {
    id: "sch-fri-3",
    course: "Discrete Structures",
    code: "CS210",
    startTime: "14:00",
    endTime: "14:50",
    room: "Room A-204",
    faculty: "Dr. Robert Chen",
    day: "Friday",
    type: "Lecture",
    status: "normal",
  },
];

export const initialAssignments: Assignment[] = [
  {
    id: "asg-1",
    course: "BME Laboratory",
    title: "ECG Filter Simulation & Bode Plot",
    description: "Submit Matlab / Python plot verifying 50Hz notch attenuation and passband ripple.",
    dueDate: "Today, 11:59 PM",
    dueTime: "23:59",
    dueCategory: "today",
    completed: false,
    priority: "urgent",
    estimatedMins: 45,
  },
  {
    id: "asg-2",
    course: "Physics",
    title: "Homework #4: Wave Packets & Probability Density",
    description: "Solve problems 4.2 to 4.9 on one-dimensional finite potential well.",
    dueDate: "Tomorrow, 09:00 AM",
    dueTime: "09:00",
    dueCategory: "soon",
    completed: false,
    priority: "urgent",
    estimatedMins: 60,
  },
  {
    id: "asg-3",
    course: "Programming",
    title: "Dynamic Programming Memoization Lab",
    description: "Implement 0/1 Knapsack with recursive memoization vs bottom-up tabulation.",
    dueDate: "In 3 days",
    dueTime: "17:00",
    dueCategory: "soon",
    completed: false,
    priority: "medium",
    estimatedMins: 90,
  },
  {
    id: "asg-4",
    course: "Mathematics",
    title: "Problem Set 3: Diagonalization & Quadratic Forms",
    description: "Gram-Schmidt orthogonalization exercises with verification.",
    dueDate: "In 7 days",
    dueTime: "23:59",
    dueCategory: "later",
    completed: false,
    priority: "low",
    estimatedMins: 75,
  },
  {
    id: "asg-5",
    course: "Technical Communication",
    title: "Engineering Feasibility Executive Summary",
    description: "Draft 2-page brief on biomimetic materials.",
    dueDate: "In 10 days",
    dueTime: "12:00",
    dueCategory: "later",
    completed: true,
    priority: "low",
    estimatedMins: 50,
  },
];

export const initialAttendance: AttendanceRecord[] = [
  {
    id: "att-1",
    course: "Mathematics",
    code: "MATH201",
    attended: 20,
    total: 28,
    minRequiredPct: 75,
    faculty: "Dr. Robert Chen",
    lastUpdated: "Yesterday",
  },
  {
    id: "att-2",
    course: "Physics",
    code: "PHY102",
    attended: 25,
    total: 30,
    minRequiredPct: 75,
    faculty: "Prof. Elena Rostova",
    lastUpdated: "2 days ago",
  },
  {
    id: "att-3",
    course: "BME Laboratory",
    code: "BME310",
    attended: 24,
    total: 27,
    minRequiredPct: 75,
    faculty: "Dr. Marcus Thorne",
    lastUpdated: "3 days ago",
  },
  {
    id: "att-4",
    course: "Programming",
    code: "CS204",
    attended: 31,
    total: 33,
    minRequiredPct: 75,
    faculty: "Prof. Sarah Vance",
    lastUpdated: "Yesterday",
  },
  {
    id: "att-5",
    course: "Biology for Engineers",
    code: "BIO105",
    attended: 19,
    total: 21,
    minRequiredPct: 75,
    faculty: "Dr. Arvind Swaminathan",
    lastUpdated: "4 days ago",
  },
];

export const initialAnnouncements: Announcement[] = [
  {
    id: "ann-1",
    priority: "important",
    title: "Mid-Semester Examination Schedule Released",
    summary: "Examinations commence on October 14th. Seating matrix and hall tickets available in portal.",
    department: "Academic Affairs Controller",
    date: "2 hours ago",
    read: false,
  },
  {
    id: "ann-2",
    priority: "reminder",
    title: "Assignment Submission Deadline Tomorrow",
    summary: "Physics Homework #4 portal closes strictly at 09:00 AM. Late submissions lose 20%.",
    department: "Department of Physics",
    date: "4 hours ago",
    read: false,
  },
  {
    id: "ann-3",
    priority: "notice",
    title: "Annual Hackathon & Tech Symposium 2026",
    summary: "Registrations now open for 36-hour hackathon. Cash prizes up to ₹1,50,000.",
    department: "Student Council & IEEE",
    date: "Yesterday",
    read: true,
  },
  {
    id: "ann-4",
    priority: "notice",
    title: "Central Library Extended Hours During Midterms",
    summary: "Level 2 & 3 quiet study suites will remain open until 02:00 AM on weekdays.",
    department: "University Library",
    date: "3 days ago",
    read: true,
  },
];

export const campusLocations: CampusLocation[] = [
  {
    id: "loc-lab3",
    name: "Biomedical Engineering Laboratory",
    code: "Lab 3",
    building: "Technology & Bio-Engineering Complex (Block C)",
    buildingId: "block-c",
    floor: "2nd Floor",
    wing: "East Wing, Room C-214",
    walkingTimeMins: 3,
    routeInstructions: [
      "From Main Quad, enter Block C through the glass rotunda",
      "Take the central elevator or open staircase to Level 2",
      "Head down the East Corridor past the Microelectronics Bay",
      "Lab 3 (C-214) is on your left with smart card reader",
    ],
    coordinates: { x: 420, y: 190 },
    category: "labs",
  },
  {
    id: "loc-a204",
    name: "Mathematics Lecture Hall A",
    code: "Room A-204",
    building: "Science & Engineering Hall (Block A)",
    buildingId: "block-a",
    floor: "2nd Floor",
    wing: "North Wing",
    walkingTimeMins: 4,
    routeInstructions: [
      "Enter Block A via North Plaza stairs",
      "Proceed up the central atrium stairwell to Level 2",
      "Turn right towards the Mathematics department",
      "Room A-204 is the tiered amphitheater on your right",
    ],
    coordinates: { x: 180, y: 160 },
    category: "classrooms",
  },
  {
    id: "loc-b102",
    name: "Physics Core Amphitheater",
    code: "Room B-102",
    building: "Physical Sciences Complex (Block B)",
    buildingId: "block-b",
    floor: "1st Floor",
    wing: "West Wing",
    walkingTimeMins: 2,
    routeInstructions: [
      "Enter Block B ground reception",
      "Take the wide flight of stairs to Floor 1",
      "Room B-102 is immediately facing the Physics lounge",
    ],
    coordinates: { x: 260, y: 340 },
    category: "classrooms",
  },
  {
    id: "loc-c301",
    name: "Advanced Computer Systems Lab",
    code: "Room C-301",
    building: "Technology & Bio-Engineering Complex (Block C)",
    buildingId: "block-c",
    floor: "3rd Floor",
    wing: "South Tower",
    walkingTimeMins: 4,
    routeInstructions: [
      "Enter Block C and take the express elevators to 3rd Floor",
      "Exit towards Computer Science research wing",
      "Room C-301 is at the end of the glass bridge corridor",
    ],
    coordinates: { x: 460, y: 220 },
    category: "labs",
  },
  {
    id: "loc-library",
    name: "Central University Library & Commons",
    code: "Library",
    building: "Learning Resource Hub",
    buildingId: "hub-lib",
    floor: "Ground to 4th Floor",
    wing: "Central Campus",
    walkingTimeMins: 1,
    routeInstructions: [
      "Located at the central meridian between Block A and Block B",
      "Pass student security scan into ground floor commons",
    ],
    coordinates: { x: 320, y: 240 },
    category: "library",
  },
  {
    id: "loc-student-center",
    name: "Student Center & Dining Pavilion",
    code: "Student Commons",
    building: "Campus Life Center",
    buildingId: "hub-student",
    floor: "Ground Floor",
    wing: "South Quad",
    walkingTimeMins: 3,
    routeInstructions: [
      "Walk south through the shaded colonnade",
      "Entrance past the outdoor amphitheater seating",
    ],
    coordinates: { x: 380, y: 410 },
    category: "student_hub",
  },
  {
    id: "loc-admin",
    name: "Finance Office & Student Registrar",
    code: "Finance",
    building: "Administration Tower",
    buildingId: "block-admin",
    floor: "1st Floor",
    wing: "East Wing",
    walkingTimeMins: 5,
    routeInstructions: [
      "Head to Administration Tower near Main Gate",
      "Counters 4 through 8 on 1st Floor for fee receipts & inquiries",
    ],
    coordinates: { x: 120, y: 400 },
    category: "admin",
  },
];

export const initialCampusLocations = campusLocations;

export const initialExams: Exam[] = [
  {
    id: "ex-1",
    course: "Mathematics",
    code: "MATH201",
    name: "Mid-Semester Examination",
    date: "Oct 14, 2026",
    time: "10:00 AM – 12:00 PM",
    venue: "Examination Hall 1 (Block A)",
    weightage: "30%",
    syllabusTopics: [
      "Eigenvalues & Eigenvectors",
      "Diagonalization & Cayley-Hamilton Theorem",
      "First & Second Order Differential Equations",
      "Laplace Transforms & Inverses",
    ],
  },
  {
    id: "ex-2",
    course: "Physics",
    code: "PHY102",
    name: "Mid-Semester Examination",
    date: "Oct 16, 2026",
    time: "02:00 PM – 04:00 PM",
    venue: "Examination Hall 2 (Block B)",
    weightage: "30%",
    syllabusTopics: [
      "Wave Mechanics & De Broglie Hypothesis",
      "Schrödinger Wave Equation (Time-Dependent & Independent)",
      "Particle in a 1D Box & Finite Well",
      "Heisenberg Uncertainty & Expectation Values",
    ],
  },
  {
    id: "ex-3",
    course: "Biomedical Engineering",
    code: "BME310",
    name: "Mid-Semester Theory & Practical",
    date: "Oct 19, 2026",
    time: "10:00 AM – 01:00 PM",
    venue: "Lab 3 & Auditorium",
    weightage: "35%",
    syllabusTopics: [
      "Bio-potential Electrodes (Ag/AgCl characteristics)",
      "ECG, EEG, EMG Lead Systems & Standard Placements",
      "Active Filter Design & Common-Mode Rejection Ratio (CMRR)",
      "Safety Isolation & Leakage Currents",
    ],
  },
];

export const initialFeeItem: FeeItem = {
  id: "fee-sem-5",
  title: "Semester 5 Academic Tuition & Lab Assessment",
  amount: 42500,
  currency: "₹",
  dueDate: "Sep 11, 2026",
  daysRemaining: 5,
  status: "pending",
  semester: "Fall 2026 (Semester 5)",
  breakdown: [
    { item: "Core Tuition & Instruction", amount: 32000 },
    { item: "Specialized Laboratory & Consumables Fee", amount: 6500 },
    { item: "Digital Library & Journal Access Subscriptions", amount: 2500 },
    { item: "Campus Health & Recreational Amenities", amount: 1500 },
  ],
};

export const initialNotes: NoteItem[] = [
  {
    id: "note-1",
    title: "Biomedical Instrumentation: ECG Filters & CMRR",
    subject: "BME Laboratory",
    dateAdded: "Yesterday",
    type: "pdf",
    tags: ["ECG", "Op-Amps", "Analog Filters", "Instrumentation"],
    content: `Overview:
Biomedical signals are minute (ECG is typically 0.5mV to 4mV) and originate in high-impedance biological environments surrounded by heavy 50Hz/60Hz capacitive powerline hum.

Key Design Blocks:
1. Differential Instrumentation Amplifier (AD620 or 3-Op-Amp Topology):
   - Very high input impedance (>10^9 Ohms) to avoid loading tissue electrodes.
   - Ultra-high Common Mode Rejection Ratio (CMRR > 100 dB) to strip out identical hum present on both RA and LA electrodes.

2. Bandpass Filtering:
   - Diagnostic ECG Band: 0.05 Hz to 150 Hz.
   - Monitoring ECG Band: 0.5 Hz to 40 Hz (suppresses respiratory motion baseline wander).

3. 50Hz Notch Filter (Twin-T active topology):
   - Q-factor must be calibrated tightly (Q ~ 5 to 8) to selectively excise powerline harmonics without distorting the steep QRS complex gradient.

Key Formulas for Exam:
- Differential Gain: A_d = (1 + 2*R1/R_gain) * (R3/R2)
- Common Mode Gain: A_cm -> 0
- Cutoff frequency: f_c = 1 / (2 * pi * R * C)`,
    summary: "Core principles of high-impedance instrumentation amplifiers, electrode impedance matching, and active 50Hz notch filters for clinical ECG acquisition.",
    practiceQuestions: [
      "Why must the input impedance of an ECG amplifier exceed 10^9 Ohms?",
      "How does a Driven Right Leg (DRL) circuit improve common-mode noise rejection?",
      "Calculate the component values for a 50Hz Twin-T active notch filter with Q=5.",
    ],
  },
  {
    id: "note-2",
    title: "Physics: Quantum Wave Packets & Uncertainty",
    subject: "Physics",
    dateAdded: "3 days ago",
    type: "handwritten",
    tags: ["Quantum", "Wave Mechanics", "Schrödinger", "Heisenberg"],
    content: `Wave Packet Formulation:
A localized particle is modeled mathematically as a superposition of harmonic plane waves with differing wave numbers (k) and frequencies (omega).

Group Velocity vs Phase Velocity:
- Phase velocity: v_p = omega / k
- Group velocity: v_g = d(omega) / d(k)
Physical significance: The envelope of the wave packet propagates at group velocity v_g, which corresponds to the classical velocity of the particle (p / m).

Heisenberg Uncertainty Principle:
Delta_x * Delta_p >= h_bar / 2
Spread in position and momentum are Fourier transform conjugates. Narrowing the spatial envelope Delta_x forces the wavenumber spread Delta_k to broaden.`,
    summary: "Mathematical formulation of localized quantum particles through wave packet dispersion and Fourier conjugate relationships in Heisenberg uncertainty.",
  },
  {
    id: "note-3",
    title: "Mathematics: Eigenvalues & Matrix Diagonalization",
    subject: "Mathematics",
    dateAdded: "Sep 2, 2026",
    type: "text",
    tags: ["Linear Algebra", "Eigenvalues", "Matrix Theory", "Exam Focus"],
    content: `Characteristic Equation:
det(A - lambda * I) = 0
Roots lambda_1, lambda_2, ..., lambda_n are eigenvalues.

Diagonalization Theorem:
An n x n matrix A is diagonalizable if and only if A has n linearly independent eigenvectors.
Then: A = P * D * P^(-1)
where P is the modal matrix containing eigenvectors as columns, and D is the diagonal matrix of eigenvalues.

Practical Computational Application:
Calculating powers of A: A^k = P * D^k * P^(-1). Since D is diagonal, D^k is computed in O(n) instead of O(n^3 * k).`,
    summary: "Conditions for algebraic vs geometric multiplicity equality and fast matrix exponentiation via modal eigenvector decomposition.",
  },
];
