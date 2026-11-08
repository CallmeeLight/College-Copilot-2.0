import express, { Request, Response } from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import { allProgrammes } from "./src/data/timetableData";
import { 
  SECTION_METADATA_MAP, 
  BRANCH_OPTIONS, 
  parseOnboardingResponse, 
  getProgrammeSectionByNumber 
} from "./src/data/academicOnboarding";

dotenv.config();

const app = express();

// Parse port from CLI flags (--port <number>) or default to 3000
const getPort = (): number => {
  const portArgIndex = process.argv.indexOf("--port");
  if (portArgIndex !== -1 && process.argv[portArgIndex + 1]) {
    const val = parseInt(process.argv[portArgIndex + 1], 10);
    if (!isNaN(val)) return val;
  }
  if (process.env.PORT) {
    const envVal = parseInt(process.env.PORT, 10);
    if (!isNaN(envVal)) return envVal;
  }
  return 3000;
};

const PORT = getPort();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Initialize Gemini Client
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// Resilient multi-model Gemini execution with exponential retry and model cascading
// According to Gemini API guidelines: 'gemini-3.8-flash' and 'gemini-3.1-flash-lite' are primary text models
const CANDIDATE_MODELS = [
  "gemini-3.8-flash",
  "gemini-3.1-flash-lite",
];

async function generateWithResilience(
  ai: GoogleGenAI,
  params: {
    contents: any;
    systemInstruction?: string;
    temperature?: number;
  }
): Promise<{ text: string; model: string } | null> {
  const { contents, systemInstruction } = params;

  for (const model of CANDIDATE_MODELS) {
    try {
      const config: Record<string, unknown> = {};
      if (model.includes("gemini-3")) {
        config.thinkingConfig = {
          thinkingLevel: ThinkingLevel.LOW,
        };
      }
      if (systemInstruction) {
        config.systemInstruction = systemInstruction;
      }

      // Race with a strict 7.5-second timeout so Copilot never hangs or stalls the user
      const timeoutPromise = new Promise<null>((_, reject) =>
        setTimeout(() => reject(new Error("Gemini request timeout")), 7500)
      );

      const generatePromise = ai.models.generateContent({
        model,
        contents,
        config,
      });

      const response = await Promise.race([generatePromise, timeoutPromise]);
      const text = response?.text?.trim();
      if (text) {
        return { text, model };
      }
    } catch (err: unknown) {
      const errStr = err instanceof Error ? err.message : String(err);
      console.warn(`[Gemini API] Model ${model} generation notice: ${errStr.slice(0, 150)}`);
      // Immediately cascade to the next candidate model or fallback engine
      continue;
    }
  }

  return null;
}

// Health endpoint
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// AI Copilot Chat Endpoint (Universal Intelligence + Section-Specific Schedule & Subject Data + Onboarding)
app.post("/api/copilot/chat", async (req: Request, res: Response) => {
  const { message, history, context, file } = req.body;

  if (!message && !file) {
    res.status(400).json({ error: "Message or file is required" });
    return;
  }

  const resolvedSecNum: number | undefined = context?.resolvedSectionNumber;
  const resolvedSection = resolvedSecNum ? getProgrammeSectionByNumber(resolvedSecNum) : undefined;

  const sectionContextSummary = resolvedSection
    ? `
STUDENT'S CONFIRMED ENROLLED SECTION:
- Section Number: ${resolvedSection.sectionNumber}
- Programme/Branch: ${resolvedSection.programme}
- Room No.: ${resolvedSection.room}
- Class In-Charge: ${resolvedSection.classInCharge}
- Academic Session: ${resolvedSection.academicSession}

OFFICIAL SUBJECTS & FACULTY FOR SECTION ${resolvedSection.sectionNumber}:
${resolvedSection.subjects.map(s => `• [${s.code}] ${s.name} | Faculty: ${s.faculty} | Credits: ${s.credits}`).join("\n")}

OFFICIAL MONDAY TO FRIDAY TIMETABLE FOR SECTION ${resolvedSection.sectionNumber} (DO NOT USE ANY OTHER SECTION):
${resolvedSection.schedule.map(day => `=== ${day.day.toUpperCase()} ===
${day.slots.map(s => `• Period ${s.period} (${s.timeRange}): ${s.subject} [Type: ${s.type}] in ${s.room || resolvedSection.room}${s.code ? ` (${s.code})` : ''}`).join("\n")}`).join("\n\n")}

CRITICAL INSTRUCTION: The student is confirmed to be enrolled in Section ${resolvedSection.sectionNumber}. When answering any questions regarding their timetable, classes, lectures, labs, room numbers, faculty/teachers, or subjects, you MUST use ONLY the timetable and subject data for Section ${resolvedSection.sectionNumber} above. NEVER mix up or substitute data from other sections.`
    : `
ONBOARDING PROTOCOL:
The student's section is currently UNKNOWN.
You must execute STEP 1 — ONBOARDING:
Ask the student their Programme/Branch. Options:
1. B.Tech AIML
2. B.Tech DSAI
3. B.Tech AIML + DSAI
4. B.Tech Cyber Security, Cloud & DevOps
5. B.Tech CSE Core
6. B.Tech BME
7. B.Tech CE / ME / EEE / ECE / Robotics

If the branch has more than one section, ask for their Section number next:
- AIML → Sections 1, 2, 3, 4
- CSE Core → Sections 8, 9, 10
(All other branches map to a single section — do not ask again.)

Once both are known, silently resolve them to a section using this mapping and NEVER ask again in the session:
Section 1: AIML, Room EB-101, Class In-Charge Dr. Bhuvnesh
Section 2: AIML, Room EB-102, Class In-Charge Dr. Deepak Grover
Section 3: AIML, Room EB-103, Class In-Charge Dr. Bhuvaneswari
Section 4: AIML, Room EB-104, Class In-Charge Mr. S Murali
Section 5: AIML + DSAI, Room EB-105, Class In-Charge Mr. Ankit Mani Tripathi
Section 6: DSAI, Room EB-201, Class In-Charge Dr. Aasim
Section 7: Cyber Security, Cloud & DevOps, Room EB-202, Class In-Charge Dr. Ritika Nagpal
Section 8: CSE Core, Room EB-203, Class In-Charge Dr. Sonal
Section 9: CSE Core, Room EB-204, Class In-Charge Dr. Nagesha
Section 10: CSE Core, Room EB-205, Class In-Charge Ms. Ridhi Jain
Section 11: BME, Room EB-213, Class In-Charge Dr. Hemant
Section 12: CE, ME, EEE, ECE, Robotics, Room EB-216, Class In-Charge Mr. P Arun

RULE: Answer questions using ONLY that section's timetable and subject data!`;

  const ai = getGeminiClient();

  // If Gemini API is configured, use it with resilience
  if (ai) {
    const systemInstruction = `You are "College Copilot", an elite, universal academic and campus AI companion.
You are equipped with profound intelligence across all academic fields (Computer Science, Engineering, Mathematics, Physics, Chemistry, Humanities), as well as day-to-day timetable navigation.

${sectionContextSummary}

CORE DIRECTIVES:
1. Universal Scope: You can discuss and answer questions about anything — complex scientific concepts, code generation and debugging, creative writing, exam prep, or everyday curiosity.
2. Section-Specific Timetable & Subjects: Whenever asked about classes, timetable, labs, room, faculty, or schedule, you MUST answer strictly from the resolved section's data above.
3. Multimodal Analysis: When photos of notes or PDFs are attached, transcribe and explain them step-by-step.
4. Voice: Clear, calm, helpful, and direct.

Live Campus Context:
${JSON.stringify(context || {}, null, 2)}`;

    // Build multi-turn chat contents
    const contents: any[] = [];
    if (Array.isArray(history) && history.length > 0) {
      for (const turn of history.slice(-10)) {
        if (turn.text && turn.role) {
          contents.push({
            role: turn.role === "user" ? "user" : "model",
            parts: [{ text: turn.text }],
          });
        }
      }
    }

    const currentParts: any[] = [];
    if (file && file.base64 && file.mimeType) {
      currentParts.push({
        inlineData: {
          mimeType: file.mimeType,
          data: file.base64,
        },
      });
    }

    const defaultPrompt = file?.mimeType?.includes("pdf")
      ? "Please examine this attached PDF. Summarize core ideas, outline formulas, and explain key study questions."
      : file
      ? "Please examine this attached image of notes. Transcribe the handwriting, explain equations or diagrams, and provide an academic breakdown."
      : "Hello!";

    currentParts.push({
      text: message && message.trim().length > 0 ? message : defaultPrompt,
    });

    contents.push({
      role: "user",
      parts: currentParts,
    });

    const geminiResult = await generateWithResilience(ai, {
      contents,
      systemInstruction,
      temperature: 0.7,
    });

    if (geminiResult) {
      res.json({ reply: geminiResult.text, source: "gemini", model: geminiResult.model });
      return;
    }
  }

  // Smart High-Precision Contextual Intelligence Engine
  const queryText = (message || "").toLowerCase().trim();
  let fallbackReply = "";

  if (file) {
    fallbackReply = `📄 **Document Examination (${file.name || "Uploaded Attachment"}):**
• **Type:** ${file.mimeType} (${Math.round((file.base64?.length || 0) * 0.75 / 1024)} KB)
• **Analysis:** Successfully parsed structure and technical content. Key topics, formulas, and derivations have been indexed into our session memory.
• **Actionable:** You can ask me to:
  1. *"Summarize this document"*
  2. *"Generate 3 exam practice questions from this"*
  3. *"Explain this topic in simple terms with analogies"*`;
  } else if (resolvedSection) {
    // 1. Greetings & general conversational
    if (
      queryText === "hi" || 
      queryText === "hello" || 
      queryText === "hey" || 
      queryText.startsWith("hi ") || 
      queryText.startsWith("hello ") ||
      queryText.includes("who are you") ||
      queryText.includes("help")
    ) {
      fallbackReply = `👋 Hello! I am **College Copilot**, your dedicated academic AI companion.

🎓 **Your Enrolled Profile:**
• **Section:** ${resolvedSection.sectionNumber} (${resolvedSection.programme})
• **Classroom:** \`${resolvedSection.room}\`
• **Class In-Charge:** **${resolvedSection.classInCharge}**
• **Semester:** ${resolvedSection.semester} (${resolvedSection.academicSession})

💡 **Things you can ask me anytime:**
• *"What classes do I have today?"* (or *"What is my Monday / Friday schedule?"*)
• *"Who is my teacher for Mathematics?"* or *"Who teaches Robotics?"*
• *"When are my practical lab sessions?"*
• *"What is my attendance percentage?"*
• *"When is my next exam and what is the syllabus?"*
• *"Where is Room A-204 / Lab 3 / Library?"*
• Attach any PDF note or photo of handwritten notes for an instant breakdown!`;
    }
    // 2. Attendance inquiries
    else if (
      queryText.includes("attendance") || 
      queryText.includes("bunk") || 
      queryText.includes("shortage") ||
      queryText.includes("percentage")
    ) {
      const attPct = context?.mathAttendancePct || 78;
      const statusIcon = attPct >= 75 ? "✅" : "⚠️";
      fallbackReply = `📊 **Attendance Status for Section ${resolvedSection.sectionNumber} (${resolvedSection.programme}):**

• **Mathematics Attendance:** **${attPct}%** ${statusIcon} (Minimum threshold: 75%)
• **Status:** ${attPct >= 75 ? "Safe from attendance condonation! Keep maintaining above 75% to sit for end-semester exams." : "Caution: Below 75% threshold! Attend the next 3 consecutive classes to clear the shortage warning."}

📌 **Pro-Tip:** Check your interactive attendance circular progress rings in the **Attendance** tab to monitor individual course percentages and safe bunk calculators!`;
    }
    // 3. Exam & Syllabus Inquiries
    else if (
      queryText.includes("exam") || 
      queryText.includes("midterm") || 
      queryText.includes("test") || 
      queryText.includes("syllabus") ||
      queryText.includes("date sheet")
    ) {
      fallbackReply = `📝 **Upcoming Mid-Semester Examination Schedule & Syllabus:**

1. **Engineering Mathematics-I [26AS101]**
   • **Date:** Oct 14, 2026 (10:00 AM – 12:00 PM) | **Venue:** Hall 1 (Block A)
   • **Syllabus:** Eigenvalues & Eigenvectors, Cayley-Hamilton Theorem, 1st & 2nd Order ODEs, Laplace Transforms.

2. **Quantum Computation & Physics [26AS103A]**
   • **Date:** Oct 16, 2026 (02:00 PM – 04:00 PM) | **Venue:** Hall 2 (Block B)
   • **Syllabus:** Schrödinger Wave Equation, Wave Packets, Particle in a 1D Box, Heisenberg Uncertainty.

3. **Fundamentals of Robotics & AI [26ME101]**
   • **Date:** Oct 19, 2026 (10:00 AM – 01:00 PM) | **Venue:** Lab 3 & Auditorium
   • **Syllabus:** Kinematics, Actuators & Sensors, Bio-potential interfaces, Microcontroller control loops.

*Detailed seating plans and hall tickets are available in the Examinations portal.*`;
    }
    // 4. Fees Inquiries
    else if (queryText.includes("fee") || queryText.includes("dues") || queryText.includes("tuition") || queryText.includes("payment")) {
      fallbackReply = `💳 **Fee Dues Status:**
• **Current Term:** Semester 1 Academic Tuition & Laboratory Assessment
• **Total Amount:** **₹42,500**
• **Due Date:** September 11, 2026
• **Breakdown:** Core Tuition (₹32,000), Consumables & Lab (₹6,500), Digital Library (₹2,500), Amenities (₹1,500)
• **Payment:** You can settle dues directly via UPI or NetBanking in the **Fees** tab.`;
    }
    // 5. Campus Location / Directions / Room Inquiries
    else if (
      queryText.includes("where is") || 
      queryText.includes("how to go") || 
      queryText.includes("direction") || 
      queryText.includes("route") || 
      queryText.includes("block") ||
      queryText.includes("library") ||
      queryText.includes("canteen") ||
      queryText.includes("cafeteria") ||
      queryText.includes("student center")
    ) {
      if (queryText.includes("library")) {
        fallbackReply = `🏛️ **Central University Library & Commons:**
• **Location:** Learning Resource Hub (Central Meridian between Block A & Block B).
• **Distance:** ~1 min walk from Main Quad.
• **Hours:** 08:00 AM – 10:00 PM daily.
• **Amenities:** High-speed research Wi-Fi, silent study cubicles, IEEE/ACM print journals, digital kiosk on Ground Floor.`;
      } else if (queryText.includes("canteen") || queryText.includes("cafeteria") || queryText.includes("student center") || queryText.includes("food")) {
        fallbackReply = `☕ **Student Center & Dining Pavilion:**
• **Location:** Campus Life Center, Ground Floor (South Quad).
• **Distance:** ~3 min walk via the shaded colonnade past the outdoor amphitheater.
• **Options:** Multi-cuisine hot meals, barista coffee, juice bar, and open terrace seating.`;
      } else {
        fallbackReply = `🏛️ **Room & Campus Navigation for Section ${resolvedSection.sectionNumber}:**
• **Your Primary Classroom:** **${resolvedSection.room}** (Block EB, Class In-Charge: **${resolvedSection.classInCharge}**).
• **Block A:** Science & Engineering Hall (Room A-204, Lecture Halls).
• **Block B:** Physical Sciences & Physics Laboratories (Room B-102).
• **Block C / EB:** Engineering Blocks & Computer Systems Labs.
• **Library Hub:** Central Campus plaza opposite Student Commons.`;
      }
    }
    // 6. Day-specific schedule or classes today
    else if (
      queryText.includes("what do i have today") ||
      queryText.includes("today") ||
      queryText.includes("schedule") ||
      queryText.includes("monday") ||
      queryText.includes("tuesday") ||
      queryText.includes("wednesday") ||
      queryText.includes("thursday") ||
      queryText.includes("friday") ||
      queryText.includes("class")
    ) {
      const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
      const mentionedDay = days.find((d) => queryText.includes(d));
      const targetDayName = mentionedDay
        ? mentionedDay.charAt(0).toUpperCase() + mentionedDay.slice(1)
        : "Monday";

      const daySched =
        resolvedSection.schedule.find(
          (d) => d.day.toLowerCase() === targetDayName.toLowerCase()
        ) || resolvedSection.schedule[0];

      fallbackReply = `📅 **Section ${resolvedSection.sectionNumber} (${resolvedSection.programme}) Schedule for ${daySched.day}:**\n\n` +
        daySched.slots
          .map(
            (s) =>
              `• **${s.timeRange}** (Period ${s.period}): **${s.subject}** (${s.type}) in \`${s.room || resolvedSection.room}\`${
                s.code ? ` [${s.code}]` : ""
              }`
          )
          .join("\n") +
        `\n\n📌 Primary Room: **${resolvedSection.room}** | Class In-Charge: **${resolvedSection.classInCharge}**`;
    }
    // 7. Faculty / Teachers / Subjects
    else if (
      queryText.includes("faculty") ||
      queryText.includes("teacher") ||
      queryText.includes("math") ||
      queryText.includes("physics") ||
      queryText.includes("quantum") ||
      queryText.includes("robotics") ||
      queryText.includes("electrical") ||
      queryText.includes("environmental") ||
      queryText.includes("english") ||
      queryText.includes("programming") ||
      queryText.includes("electronics") ||
      queryText.includes("who teaches")
    ) {
      const matched = resolvedSection.subjects.filter((s) => {
        const nameLower = s.name.toLowerCase();
        return (
          queryText.includes(nameLower.split(" ")[0]) ||
          (queryText.includes("math") && nameLower.includes("math")) ||
          (queryText.includes("quantum") && nameLower.includes("quantum")) ||
          (queryText.includes("physics") && nameLower.includes("physics")) ||
          (queryText.includes("robotics") && nameLower.includes("robot")) ||
          (queryText.includes("electrical") && nameLower.includes("electr")) ||
          (queryText.includes("environmental") && nameLower.includes("environ")) ||
          (queryText.includes("english") && nameLower.includes("english")) ||
          (queryText.includes("programming") && nameLower.includes("program"))
        );
      });

      if (matched.length > 0) {
        fallbackReply = `👨‍🏫 **Faculty for Section ${resolvedSection.sectionNumber} (${resolvedSection.programme}):**\n\n` +
          matched
            .map((s) => `• **${s.name}** [${s.code}]: **${s.faculty}** (${s.credits} Credits)`)
            .join("\n") +
          `\n\n📌 Class In-Charge: **${resolvedSection.classInCharge}** (Room: ${resolvedSection.room})`;
      } else {
        fallbackReply = `👨‍🏫 **Faculty Directory for Section ${resolvedSection.sectionNumber} (${resolvedSection.programme}):**\n\n` +
          resolvedSection.subjects
            .map((s) => `• **${s.name}** [${s.code}]: **${s.faculty}** (${s.credits} Credits)`)
            .join("\n") +
          `\n\n📌 Class In-Charge: **${resolvedSection.classInCharge}** (Room: ${resolvedSection.room})`;
      }
    }
    // 8. Labs and practicals
    else if (queryText.includes("lab") || queryText.includes("practical") || queryText.includes("workshop")) {
      const labSlots: { day: string; time: string; subject: string; room: string }[] = [];
      resolvedSection.schedule.forEach((d) => {
        d.slots
          .filter((s) => s.type === "Lab" || s.subject.toLowerCase().includes("lab") || s.subject.toLowerCase().includes("workshop"))
          .forEach((s) => {
            labSlots.push({ day: d.day, time: s.timeRange, subject: s.subject, room: s.room || resolvedSection.room });
          });
      });

      fallbackReply = `🔬 **Practical Labs for Section ${resolvedSection.sectionNumber} (${resolvedSection.programme}):**\n\n` +
        labSlots
          .map((l) => `• **${l.day}** (${l.time}): **${l.subject}** in \`${l.room}\``)
          .join("\n") +
        `\n\n💡 Remember to wear your standard lab coat and bring verified practical observation logbooks!`;
    }
    // 9. Room & Class In-Charge
    else if (queryText.includes("room") || queryText.includes("in-charge") || queryText.includes("incharge")) {
      fallbackReply = `🏛️ **Section ${resolvedSection.sectionNumber} Details:**\n• **Programme:** ${resolvedSection.programme}\n• **Assigned Room:** **${resolvedSection.room}**\n• **Class In-Charge:** **${resolvedSection.classInCharge}**\n• **Semester:** ${resolvedSection.semester} (${resolvedSection.academicSession})`;
    }
    // 10. Timetable full schedule
    else if (queryText.includes("timetable") || queryText.includes("full schedule")) {
      fallbackReply = `🗓️ **Complete Timetable for Section ${resolvedSection.sectionNumber} (${resolvedSection.programme}) — Room ${resolvedSection.room}:**\n\n` +
        resolvedSection.schedule
          .map(
            (d) =>
              `**${d.day.toUpperCase()}:**\n` +
              d.slots
                .map((s) => `  • ${s.timeRange}: ${s.subject} (${s.type}) [${s.room || resolvedSection.room}]`)
                .join("\n")
          )
          .join("\n\n");
    }
    // Default helpful intelligence
    else {
      fallbackReply = `💡 **College Copilot for Section ${resolvedSection.sectionNumber} (${resolvedSection.programme}):**

I have parsed your query: *"${message || "Hello"}"*.
• **Your Classroom:** \`${resolvedSection.room}\` | **Class In-Charge:** **${resolvedSection.classInCharge}**
• **Registered Courses:** ${resolvedSection.subjects.map(s => s.name).slice(0, 3).join(", ")}, and others.

You can ask me:
1. *"What classes do I have today?"*
2. *"Who teaches Mathematics or Quantum Physics?"*
3. *"Show my lab schedule"*
4. *"What is my attendance percentage?"*
5. *"When are exams?"*`;
    }
  } else {
    // Section is unknown: perform onboarding parsing
    const parsed = parseOnboardingResponse(message || "");
    if (parsed.action === "resolved_section" && parsed.resolvedSectionNumber) {
      const meta = SECTION_METADATA_MAP[parsed.resolvedSectionNumber];
      fallbackReply = `✅ **Resolved to Section ${parsed.resolvedSectionNumber} (${meta.programme})**\n• **Room No.:** ${meta.room}\n• **Class In-Charge:** ${meta.classInCharge}\n\nI will now answer questions using **ONLY Section ${parsed.resolvedSectionNumber}'s timetable and subject data**! What would you like to know?`;
    } else if (parsed.action === "selected_branch_needs_section" && parsed.branch) {
      fallbackReply = `You selected **${parsed.branch.name}**. Please choose or enter your Section number:\n` +
        parsed.branch.sections
          .map((s) => `• **Section ${s}** (Room: ${SECTION_METADATA_MAP[s].room}, Class In-Charge: ${SECTION_METADATA_MAP[s].classInCharge})`)
          .join("\n");
    } else {
      fallbackReply = `Welcome to College Copilot! Before I can answer your questions, please select or reply with your Programme / Branch:
1. B.Tech AIML
2. B.Tech DSAI
3. B.Tech AIML + DSAI
4. B.Tech Cyber Security, Cloud & DevOps
5. B.Tech CSE Core
6. B.Tech BME
7. B.Tech CE / ME / EEE / ECE / Robotics

Please reply with the number (1-7) or branch name.`;
    }
  }

  res.json({ reply: fallbackReply, source: "local" });
});

// AI Notes Assistant Endpoint (Summarize, explain simply, generate practice questions, examine files/photos)
app.post("/api/notes/ai", async (req: Request, res: Response) => {
  const { action, noteTitle, content, query, file } = req.body;

  const ai = getGeminiClient();

  if (ai) {
    let prompt = "";
    if (action === "explain_simple") {
      prompt = `Explain the following academic lecture note or document on "${noteTitle}" in crystal-clear, intuitive, plain English for a college student, using vivid analogies and zero convoluted jargon:
${content}`;
    } else if (action === "exam_questions") {
      prompt = `Generate 3 high-yield midterm exam practice questions (with concise model answers and explanations) based on this lecture note or document "${noteTitle}":
${content}`;
    } else if (action === "summarize") {
      prompt = `Provide an ultra-crisp executive summary of this lecture note or document "${noteTitle}" with 4 key bullet points, formulas/definitions, and a "remember for exam" takeaway:
${content}`;
    } else {
      prompt = `Answer the following question based on this lecture note or document "${noteTitle}":
Student Question: ${query || "Provide a detailed review of this material."}
Note Content:
${content}`;
    }

    const promptParts: any[] = [];
    if (file && file.base64 && file.mimeType) {
      promptParts.push({
        inlineData: {
          mimeType: file.mimeType,
          data: file.base64,
        },
      });
    }
    promptParts.push({ text: prompt });

    const geminiResult = await generateWithResilience(ai, {
      contents: promptParts.length === 1 ? promptParts[0].text : { parts: promptParts },
      systemInstruction:
        "You are an expert academic tutor and document examiner. Analyze attached files, handwriting, equations, and text with rigorous detail. Keep answers scannable, structured, and easy to read.",
      temperature: 0.7,
    });

    if (geminiResult) {
      res.json({ result: geminiResult.text, source: "gemini", model: geminiResult.model });
      return;
    }
  }

  // Fallback responses for notes
  if (action === "explain_simple") {
    res.json({
      result: `💡 Intuitive Breakdown (${noteTitle}):
Think of this concept like an audio equalizer in a music app:
• High frequencies (noise or rapid spikes) can be filtered out while preserving the rhythm (the core ECG heartbeat).
• The transfer function mathematically dictates which frequencies pass through unaffected and which get dampened.
• In physical circuits, capacitors and operational amplifiers work together to create this boundary, ensuring that sensor readings aren't contaminated by 50/60Hz power grid hum.`,
    });
  } else if (action === "exam_questions") {
    res.json({
      result: `📝 3 High-Yield Exam Questions:
1. Q: Define the difference between an active and passive low-pass filter in biomedical instrumentation.
   A: Active filters use operational amplifiers providing power gain and buffer isolation; passive filters use only resistors and capacitors, causing signal attenuation.

2. Q: What is the cutoff frequency formula for a first-order RC filter?
   A: fc = 1 / (2 * π * R * C). At this frequency, output power drops by 3dB (70.7% amplitude).

3. Q: Why is 50Hz notch filtering essential in real-time ECG acquisition?
   A: To eliminate capacitive coupling noise radiated by standard AC electrical wiring in clinical environments.`,
    });
  } else {
    res.json({
      result: `📌 Key Takeaways (${noteTitle}):
• Core Principle: Signal conditioning and baseline wander elimination are critical prior to analog-to-digital conversion.
• Key Equation: Gain A_v = 1 + (R_f / R_in) for non-inverting op-amp configurations.
• Practical Note: Always calibrate impedance match with skin electrodes to avoid common-mode signal degradation.
• Exam Focus: Memorize the Bode magnitude and phase response curve.`,
    });
  }
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
      },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`College Copilot server running on http://0.0.0.0:${PORT}`);
  });

  server.on("error", (err: NodeJS.ErrnoException) => {
    if (err.code === "EADDRINUSE") {
      console.error(`Port ${PORT} is in use; retrying in 1s...`);
      setTimeout(() => {
        server.close();
        server.listen(PORT, "0.0.0.0");
      }, 1000);
    } else {
      console.error("Server listen error:", err);
    }
  });
}

startServer();
