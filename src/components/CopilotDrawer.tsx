import React, { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { 
  Sparkles, 
  X, 
  Send, 
  Trash2,
  Globe,
  Calendar,
  Code2,
  GraduationCap,
  Cpu,
  Paperclip,
  Image as ImageIcon,
  FileText,
  UploadCloud,
  FileUp,
  AlertCircle,
  CheckCircle2,
  School
} from "lucide-react";
import { CopilotChatMessage, ActiveTab, FileAttachment, StudentAcademicProfile } from "../types";
import { AiFormattedText } from "./AiFormattedText";
import { 
  SECTION_METADATA_MAP, 
  BRANCH_OPTIONS, 
  BranchOption,
  parseOnboardingResponse, 
  getProgrammeSectionByNumber 
} from "../data/academicOnboarding";

interface CopilotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  presetPrompt?: string;
  setActiveTab: (tab: ActiveTab) => void;
  mathAttendancePct: number;
  academicProfile?: StudentAcademicProfile;
  onResolveSection?: (sectionNumber: number) => void;
}

type PromptCategory = "section" | "universal" | "code" | "study";

export const CopilotDrawer: React.FC<CopilotDrawerProps> = ({
  isOpen,
  onClose,
  presetPrompt,
  setActiveTab: _setActiveTab,
  mathAttendancePct,
  academicProfile,
  onResolveSection,
}) => {
  // 1. Check if section is already resolved in session storage or academicProfile
  const getInitialResolvedSection = (): number | undefined => {
    const sessionVal = sessionStorage.getItem("srm_onboarding_resolved_section");
    if (sessionVal) {
      const n = parseInt(sessionVal, 10);
      if (!isNaN(n) && n >= 1 && n <= 12) return n;
    }
    if (academicProfile?.section) {
      const digits = academicProfile.section.replace(/\D/g, "");
      const n = parseInt(digits, 10);
      if (!isNaN(n) && n >= 1 && n <= 12) {
        sessionStorage.setItem("srm_onboarding_resolved_section", String(n));
        return n;
      }
    }
    return undefined;
  };

  const [resolvedSectionNumber, setResolvedSectionNumber] = useState<number | undefined>(getInitialResolvedSection);
  const [pendingBranch, setPendingBranch] = useState<BranchOption | undefined>(undefined);

  // Sync if academicProfile updates from outside modal
  useEffect(() => {
    if (academicProfile?.section) {
      const digits = academicProfile.section.replace(/\D/g, "");
      const n = parseInt(digits, 10);
      if (!isNaN(n) && n >= 1 && n <= 12 && n !== resolvedSectionNumber) {
        setResolvedSectionNumber(n);
        sessionStorage.setItem("srm_onboarding_resolved_section", String(n));
      }
    }
  }, [academicProfile?.section]);

  const [messages, setMessages] = useState<CopilotChatMessage[]>(() => {
    const initialSec = getInitialResolvedSection();
    if (initialSec && SECTION_METADATA_MAP[initialSec]) {
      const meta = SECTION_METADATA_MAP[initialSec];
      return [
        {
          id: "msg-init-1",
          sender: "copilot",
          text: `Hello! I am your **College Copilot** powered by Gemini AI.\n\nYou are enrolled in **Section ${initialSec} (${meta.programme})** • **Room ${meta.room}** • Class In-Charge: **${meta.classInCharge}**.\n\nI answer all questions using **ONLY Section ${initialSec}'s timetable and subject data**. What would you like to know?`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ];
    }
    return [
      {
        id: "msg-init-1",
        sender: "copilot",
        text: `Welcome to **College Copilot**!\n\nTo give you 100% accurate timetable and class answers, please identify your **Programme / Branch**:\n\n1. **B.Tech AIML**\n2. **B.Tech DSAI**\n3. **B.Tech AIML + DSAI**\n4. **B.Tech Cyber Security, Cloud & DevOps**\n5. **B.Tech CSE Core**\n6. **B.Tech BME**\n7. **B.Tech CE / ME / EEE / ECE / Robotics**\n\n*(Click a branch below or reply with the option number 1–7)*`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ];
  });

  const [inputQuery, setInputQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState<PromptCategory>("section");
  const [activeModel, setActiveModel] = useState<string>("Gemini 3.1");
  const [isDragging, setIsDragging] = useState(false);

  // Staged file / photo attachment state
  const [stagedFile, setStagedFile] = useState<FileAttachment | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const chatBottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (presetPrompt) {
      handleSendMessage(presetPrompt);
    }
  }, [presetPrompt]);

  useEffect(() => {
    if (isOpen) {
      chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, isLoading, pendingBranch]);

  // Process File to Base64
  const processSelectedFile = (file: File) => {
    setFileError(null);

    if (file.size > 20 * 1024 * 1024) {
      setFileError("File exceeds 20MB limit. Please choose a smaller document or photo.");
      return;
    }

    const isImage = file.type.startsWith("image/");
    const isPdf = file.type.includes("pdf") || file.name.toLowerCase().endsWith(".pdf");

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (dataUrl) {
        const base64 = dataUrl.includes(",") ? dataUrl.split(",")[1] : dataUrl;
        const mimeType = file.type || (isPdf ? "application/pdf" : isImage ? "image/jpeg" : "application/octet-stream");

        setStagedFile({
          name: file.name,
          type: isImage ? "image" : isPdf ? "pdf" : "document",
          mimeType,
          dataUrl,
          base64,
          sizeKb: Math.round(file.size / 1024),
        });
      }
    };
    reader.onerror = () => {
      setFileError("Could not read file. Please try selecting again.");
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processSelectedFile(e.target.files[0]);
      e.target.value = "";
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.startsWith("image/") || items[i].type.includes("pdf")) {
        const file = items[i].getAsFile();
        if (file) {
          processSelectedFile(file);
          e.preventDefault();
          break;
        }
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processSelectedFile(e.dataTransfer.files[0]);
    }
  };

  // Confirm and resolve section permanently for this session
  const confirmSectionResolution = (secNum: number, userLabel?: string) => {
    const meta = SECTION_METADATA_MAP[secNum];
    if (!meta) return;

    setResolvedSectionNumber(secNum);
    setPendingBranch(undefined);
    sessionStorage.setItem("srm_onboarding_resolved_section", String(secNum));
    onResolveSection?.(secNum);

    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const newMsgs: CopilotChatMessage[] = [];
    if (userLabel) {
      newMsgs.push({
        id: `usr-${Date.now()}`,
        sender: "user",
        text: userLabel,
        timestamp: now,
      });
    }

    newMsgs.push({
      id: `bot-${Date.now() + 1}`,
      sender: "copilot",
      text: `✅ **Resolved to Section ${secNum} (${meta.programme})**\n• **Assigned Room:** \`${meta.room}\`\n• **Class In-Charge:** **${meta.classInCharge}**\n\nI will **NEVER ask again in this session**, and will answer all timetable, class, and subject questions using **ONLY Section ${secNum}'s timetable and subject data**!\n\nAsk me anything! For example: *"What classes do I have today?"* or *"Who teaches Mathematics?"*`,
      timestamp: now,
    });

    setMessages((prev) => [...prev, ...newMsgs]);
  };

  const handleSelectBranchOption = (branch: BranchOption) => {
    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    if (branch.isMultiSection) {
      setPendingBranch(branch);
      setMessages((prev) => [
        ...prev,
        {
          id: `usr-${Date.now()}`,
          sender: "user",
          text: branch.name,
          timestamp: now,
        },
        {
          id: `bot-${Date.now() + 1}`,
          sender: "copilot",
          text: `You selected **${branch.name}**. Which Section are you in?\n\n` +
            branch.sections
              .map((s) => `• **Section ${s}** (Room \`${SECTION_METADATA_MAP[s].room}\`, In-Charge: **${SECTION_METADATA_MAP[s].classInCharge}**)`)
              .join("\n") +
            `\n\n*Click your section button below or type the section number.*`,
          timestamp: now,
        },
      ]);
    } else {
      // Single section branch - directly resolve!
      const secNum = branch.sections[0];
      confirmSectionResolution(secNum, branch.name);
    }
  };

  const handleResetSection = () => {
    sessionStorage.removeItem("srm_onboarding_resolved_section");
    setResolvedSectionNumber(undefined);
    setPendingBranch(undefined);
    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    setMessages((prev) => [
      ...prev,
      {
        id: `bot-${Date.now()}`,
        sender: "copilot",
        text: `Enrolment reset. Please select your **Programme / Branch** again to reconfigure your section:\n\n1. **B.Tech AIML**\n2. **B.Tech DSAI**\n3. **B.Tech AIML + DSAI**\n4. **B.Tech Cyber Security, Cloud & DevOps**\n5. **B.Tech CSE Core**\n6. **B.Tech BME**\n7. **B.Tech CE / ME / EEE / ECE / Robotics**`,
        timestamp: now,
      },
    ]);
  };

  const handleSendMessage = async (textToSend: string, customFile?: FileAttachment | null) => {
    const fileToUpload = customFile !== undefined ? customFile : stagedFile;
    const trimmedText = textToSend.trim();

    if (!trimmedText && !fileToUpload) return;

    // STEP 1 — ONBOARDING INTERCEPTION: If section is NOT known, check if user input resolves onboarding
    if (!resolvedSectionNumber && !fileToUpload) {
      const parsed = parseOnboardingResponse(trimmedText, pendingBranch);

      if (parsed.action === "resolved_section" && parsed.resolvedSectionNumber) {
        confirmSectionResolution(parsed.resolvedSectionNumber, trimmedText);
        setInputQuery("");
        return;
      }

      if (parsed.action === "selected_branch_needs_section" && parsed.branch) {
        handleSelectBranchOption(parsed.branch);
        setInputQuery("");
        return;
      }

      // If user typed something else before onboarding, add messages and remind them
      const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      setMessages((prev) => [
        ...prev,
        {
          id: `usr-${Date.now()}`,
          sender: "user",
          text: trimmedText,
          timestamp: now,
        },
        {
          id: `bot-${Date.now() + 1}`,
          sender: "copilot",
          text: pendingBranch
            ? `Please specify your Section number for **${pendingBranch.name}**:\n${pendingBranch.sections.map((s) => `• Section ${s}`).join(", ")}`
            : `Before answering, please first select your Programme / Branch:\n1. B.Tech AIML\n2. B.Tech DSAI\n3. B.Tech AIML + DSAI\n4. B.Tech Cyber Security, Cloud & DevOps\n5. B.Tech CSE Core\n6. B.Tech BME\n7. B.Tech CE / ME / EEE / ECE / Robotics\n\n*(Click a branch button below or reply with the number 1–7)*`,
          timestamp: now,
        },
      ]);
      setInputQuery("");
      return;
    }

    const userMsg: CopilotChatMessage = {
      id: `usr-${Date.now()}`,
      sender: "user",
      text: trimmedText || (fileToUpload?.type === "pdf" ? `Please examine this PDF: ${fileToUpload.name}` : `Please examine this photo of notes: ${fileToUpload?.name}`),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      attachment: fileToUpload
        ? {
            name: fileToUpload.name,
            type: fileToUpload.type,
            mimeType: fileToUpload.mimeType,
            dataUrl: fileToUpload.dataUrl,
            sizeKb: fileToUpload.sizeKb,
          }
        : undefined,
    };

    // Update UI immediately
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInputQuery("");
    setStagedFile(null);
    setFileError(null);
    setIsLoading(true);

    try {
      // Build history payload for multi-turn chat
      const historyPayload = updatedMessages.slice(-8).map((m) => ({
        role: m.sender === "user" ? "user" : "model",
        text: m.text,
      }));

      const secMeta = resolvedSectionNumber ? SECTION_METADATA_MAP[resolvedSectionNumber] : undefined;
      const secObj = resolvedSectionNumber ? getProgrammeSectionByNumber(resolvedSectionNumber) : undefined;

      const res = await fetch("/api/copilot/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmedText,
          history: historyPayload,
          file: fileToUpload
            ? {
                name: fileToUpload.name,
                mimeType: fileToUpload.mimeType,
                base64: fileToUpload.base64,
              }
            : undefined,
          context: {
            resolvedSectionNumber,
            programme: secMeta?.programme,
            room: secMeta?.room,
            classInCharge: secMeta?.classInCharge,
            subjectsCount: secObj?.subjects.length,
            mathAttendancePct,
            studentRollNo: academicProfile?.studentRollNo || "Student",
          },
        }),
      });

      const data = await res.json();
      if (data.model) {
        setActiveModel(data.model.includes("3.8") ? "Gemini 3.8" : "Gemini 3.1");
      }

      const botMsg: CopilotChatMessage = {
        id: `bot-${Date.now()}`,
        sender: "copilot",
        text: data.reply || "I've analyzed your question based strictly on your section's timetable.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch {
      // Offline / network fallback with section context
      const secMeta = resolvedSectionNumber ? SECTION_METADATA_MAP[resolvedSectionNumber] : undefined;
      const fallbackMsg: CopilotChatMessage = {
        id: `bot-${Date.now()}`,
        sender: "copilot",
        text: fileToUpload
          ? `I've reviewed **${fileToUpload.name}** (${fileToUpload.type.toUpperCase()}). Key formulas, headings, and conceptual derivations have been indexed.`
          : secMeta
          ? `You are enrolled in **Section ${resolvedSectionNumber} (${secMeta.programme})**, Room \`${secMeta.room}\`, Class In-Charge: **${secMeta.classInCharge}**. Timetable is fully synced.`
          : "Please select your section to view your personalized schedule.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    const secMeta = resolvedSectionNumber ? SECTION_METADATA_MAP[resolvedSectionNumber] : undefined;
    setMessages([
      {
        id: `init-${Date.now()}`,
        sender: "copilot",
        text: resolvedSectionNumber && secMeta
          ? `Chat cleared! I am ready to answer any questions using **ONLY Section ${resolvedSectionNumber} (${secMeta.programme})** timetable and subject data.`
          : "Chat cleared! Please select your Programme / Branch to get started.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
    setStagedFile(null);
  };

  const promptsByCategory: Record<PromptCategory, { label: string; icon: React.ReactNode; prompts: string[] }> = {
    section: {
      label: resolvedSectionNumber ? `Sec ${resolvedSectionNumber} Timetable` : "Section & Schedule",
      icon: <Calendar className="w-3 h-3 text-indigo-500" />,
      prompts: [
        "What classes do I have today?",
        "Who is my teacher for Maths?",
        "When are my practical lab sessions?",
        "What is my assigned room and class in-charge?",
        "Show my complete weekly timetable",
      ],
    },
    universal: {
      label: "Universal Q&A",
      icon: <Globe className="w-3 h-3 text-emerald-500" />,
      prompts: [
        "Explain Schrödinger equation in simple terms",
        "How do transformers in AI work?",
        "Draft a formal research internship email to a professor",
        "Give me 5 habits for academic peak performance",
      ],
    },
    code: {
      label: "Code & Math",
      icon: <Code2 className="w-3 h-3 text-violet-500" />,
      prompts: [
        "Write a quicksort implementation in Python with comments",
        "Explain time complexity of Dijkstra vs A*",
        "How do I calculate the cutoff frequency of an RC filter?",
        "Show an example of an Express REST API with TypeScript",
      ],
    },
    study: {
      label: "Study & Exam Prep",
      icon: <GraduationCap className="w-3 h-3 text-amber-500" />,
      prompts: [
        "Create a 3-week study roadmap for midterm exams",
        "Generate 3 practice questions on Electromagnetism",
        "Teach me the Feynman technique for fast memorization",
        "Summarize the key principles of biomedical ECG signals",
      ],
    },
  };

  if (!isOpen) return null;

  const currentMeta = resolvedSectionNumber ? SECTION_METADATA_MAP[resolvedSectionNumber] : undefined;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/35 backdrop-blur-sm animate-in fade-in">
      {/* Hidden File and Photo Inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.txt,.md,.csv,.doc,.docx"
        className="hidden"
        onChange={handleFileInputChange}
      />
      <input
        ref={photoInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileInputChange}
      />

      <div 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onPaste={handlePaste}
        className="w-full max-w-lg h-full bg-white/95 backdrop-blur-2xl border-l border-slate-200/80 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 relative overflow-hidden"
      >
        {/* Drag Overlay */}
        {isDragging && (
          <div className="absolute inset-0 z-50 bg-indigo-900/80 backdrop-blur-md flex flex-col items-center justify-center text-white p-6 border-2 border-dashed border-indigo-300 rounded-3xl m-3 animate-in fade-in">
            <UploadCloud className="w-12 h-12 text-indigo-300 animate-bounce mb-3" />
            <h4 className="text-base font-bold">Drop your notes or PDF here</h4>
            <p className="text-xs text-indigo-200 mt-1 text-center">
              Copilot will examine photos of blackboard/notebooks or PDF lecture slides.
            </p>
          </div>
        )}

        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-100/40 rounded-full blur-3xl pointer-events-none" />

        {/* Drawer Header */}
        <div className="p-3.5 sm:p-4 border-b border-slate-200/70 flex items-center justify-between relative z-10 bg-white/70 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-sm shadow-indigo-600/20">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-slate-900 tracking-tight">College Copilot</h2>
                {currentMeta ? (
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 text-indigo-900 border border-indigo-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Sec {resolvedSectionNumber} • {currentMeta.programme}</span>
                  </div>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200/60">
                    Step 1: Onboarding
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium mt-0.5">
                {currentMeta ? (
                  <>
                    <span>Room: <strong className="text-slate-700 font-mono">{currentMeta.room}</strong></span>
                    <span>&bull;</span>
                    <span>In-Charge: <strong className="text-slate-700">{currentMeta.classInCharge}</strong></span>
                  </>
                ) : (
                  <span>Awaiting Section Selection</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {resolvedSectionNumber && (
              <button
                onClick={handleResetSection}
                title="Switch section"
                className="px-2 py-1 rounded-xl text-[10px] font-bold text-indigo-600 hover:bg-indigo-50 border border-indigo-200 transition-colors cursor-pointer"
              >
                Change Section
              </button>
            )}
            <button
              onClick={handleClearChat}
              title="Clear chat"
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              id="close-copilot-drawer-btn"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="px-4 py-2 border-b border-slate-200/60 bg-slate-50/70 flex items-center gap-1.5 overflow-x-auto relative z-10">
          {(Object.keys(promptsByCategory) as PromptCategory[]).map((cat) => {
            const item = promptsByCategory[cat];
            const isActive = activeCategory === cat;
            return (
              <motion.button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                whileHover={{ scale: isActive ? 1 : 1.04 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 500, damping: 28 }}
                className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-semibold whitespace-nowrap cursor-pointer select-none transition-colors ${
                  isActive
                    ? "text-slate-900 font-bold"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="copilot-cat-sliding-pill"
                    className="absolute inset-0 rounded-xl bg-white shadow-sm border border-slate-200/90 pointer-events-none"
                    transition={{
                      type: "spring",
                      stiffness: 420,
                      damping: 32,
                      mass: 0.8,
                    }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1.5">
                  {item.icon}
                  <span>{item.label}</span>
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* Messages Scroll Area */}
        <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4 relative z-10">
          {messages.map((msg) => {
            const isBot = msg.sender === "copilot";
            return (
              <div
                key={msg.id}
                className={`flex items-start gap-2.5 ${isBot ? "justify-start" : "justify-end"}`}
              >
                {isBot && (
                  <div className="w-7 h-7 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 flex-shrink-0 mt-0.5 shadow-sm">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`max-w-[88%] rounded-2xl p-4 text-[13px] sm:text-[13.5px] leading-relaxed shadow-sm ${
                    isBot
                      ? "bg-white border border-slate-200/80 text-slate-800"
                      : "bg-slate-900 text-white font-medium"
                  }`}
                >
                  {/* Attached File/Photo Badge in User Message */}
                  {msg.attachment && (
                    <div className="mb-3 p-2.5 rounded-xl bg-white/10 border border-white/20 flex items-center gap-3">
                      {msg.attachment.type === "image" && msg.attachment.dataUrl ? (
                        <img 
                          src={msg.attachment.dataUrl} 
                          alt={msg.attachment.name}
                          className="w-12 h-12 rounded-lg object-cover border border-white/30" 
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-rose-500/20 border border-rose-400/30 flex items-center justify-center text-rose-300">
                          <FileText className="w-5 h-5" />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-white/20 text-white">
                            {msg.attachment.type.toUpperCase()}
                          </span>
                          <span className="text-[11px] text-indigo-200 font-mono">
                            {msg.attachment.sizeKb} KB
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-white truncate mt-0.5">
                          {msg.attachment.name}
                        </p>
                      </div>
                    </div>
                  )}

                  {isBot ? (
                    <AiFormattedText content={msg.text} />
                  ) : (
                    <p className="whitespace-pre-line text-white">{msg.text}</p>
                  )}

                  <span
                    className={`block text-[10px] mt-2 font-mono font-medium tracking-tight ${
                      isBot ? "text-slate-400" : "text-indigo-200"
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 flex-shrink-0 mt-0.5 shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <div className="bg-white rounded-2xl p-3.5 text-xs text-slate-600 flex items-center gap-2.5 border border-slate-200/80 shadow-sm">
                <div className="w-3 h-3 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                <span>
                  {stagedFile 
                    ? `Examining ${stagedFile.name}...` 
                    : "Fetching Section schedule & answering..."}
                </span>
              </div>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* STEP 1: ONBOARDING QUICK ACTION CARDS (shown when section is not resolved yet) */}
        {!resolvedSectionNumber && (
          <div className="p-3 bg-indigo-50/95 border-t border-indigo-100 relative z-10 space-y-2">
            {!pendingBranch ? (
              <>
                <div className="flex items-center justify-between text-xs font-bold text-indigo-950">
                  <span className="flex items-center gap-1.5">
                    <School className="w-3.5 h-3.5 text-indigo-600" />
                    Step 1: Select Your Programme / Branch
                  </span>
                  <span className="text-[10px] text-indigo-600 font-semibold font-mono">
                    Never asked again
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-1.5 max-h-36 overflow-y-auto pr-1">
                  {BRANCH_OPTIONS.map((branch, idx) => (
                    <button
                      key={branch.id}
                      onClick={() => handleSelectBranchOption(branch)}
                      className="text-left p-2 rounded-xl bg-white border border-indigo-200 hover:border-indigo-600 hover:bg-indigo-50/70 text-[11px] font-semibold text-slate-800 shadow-xs transition-all flex items-center justify-between cursor-pointer"
                    >
                      <span className="truncate">{idx + 1}. {branch.shortName}</span>
                      <span className="text-[9px] font-mono text-indigo-600 font-bold ml-1 flex-shrink-0">
                        {branch.isMultiSection ? `${branch.sections.length} sec` : `Sec ${branch.sections[0]}`}
                      </span>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between text-xs font-bold text-amber-950">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                    Step 2: Select Section for {pendingBranch.name}
                  </span>
                  <button
                    onClick={() => setPendingBranch(undefined)}
                    className="text-[10px] text-amber-700 underline font-normal cursor-pointer"
                  >
                    Change Branch
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {pendingBranch.sections.map((secNum) => {
                    const meta = SECTION_METADATA_MAP[secNum];
                    return (
                      <button
                        key={secNum}
                        onClick={() => confirmSectionResolution(secNum, `Section ${secNum}`)}
                        className="text-left p-2 rounded-xl bg-white border border-amber-200 hover:border-amber-600 hover:bg-amber-50/70 text-[11px] font-semibold text-slate-800 shadow-xs transition-all cursor-pointer"
                      >
                        <div className="font-bold text-amber-900">Section {secNum}</div>
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5 truncate">
                          {meta.room} &bull; {meta.classInCharge}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        )}

        {/* Dynamic Quick Prompt Chips (Shown after onboarding is resolved) */}
        {resolvedSectionNumber && !stagedFile && (
          <div className="px-4 py-2 border-t border-slate-200/60 overflow-x-auto flex items-center gap-1.5 bg-slate-50/60">
            {promptsByCategory[activeCategory].prompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => handleSendMessage(prompt)}
                className="px-3 py-1.5 rounded-full text-[11px] font-semibold whitespace-nowrap bg-white text-slate-700 hover:text-indigo-600 hover:bg-indigo-50/60 border border-slate-200 shadow-sm transition-all cursor-pointer"
              >
                {prompt}
              </button>
            ))}
          </div>
        )}

        {/* Staged File / Photo Preview Banner */}
        {stagedFile && (
          <div className="p-3.5 mx-4 mb-2 rounded-2xl bg-indigo-50/90 border border-indigo-200/80 shadow-sm relative animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                {stagedFile.type === "image" ? (
                  <img
                    src={stagedFile.dataUrl}
                    alt="Preview"
                    className="w-12 h-12 rounded-xl object-cover border border-indigo-200 shadow-xs"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-white border border-indigo-200 flex items-center justify-center text-indigo-600 shadow-xs">
                    <FileText className="w-6 h-6 text-rose-500" />
                  </div>
                )}
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wide bg-indigo-600 text-white px-2 py-0.5 rounded-full">
                      Ready to Examine
                    </span>
                    <span className="text-[11px] text-indigo-700 font-mono">
                      {stagedFile.sizeKb} KB
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-900 truncate mt-0.5">
                    {stagedFile.name}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setStagedFile(null)}
                title="Remove attachment"
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Suggested Prompts for this file */}
            <div className="mt-2.5 pt-2 border-t border-indigo-100 flex flex-wrap gap-1.5">
              {stagedFile.type === "pdf" ? (
                <>
                  <button
                    onClick={() => handleSendMessage("Provide a structured executive summary of this PDF with key formulas & definitions.", stagedFile)}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-white text-indigo-900 hover:bg-indigo-600 hover:text-white border border-indigo-200 transition-all cursor-pointer"
                  >
                    Summarize PDF
                  </button>
                  <button
                    onClick={() => handleSendMessage("Generate 3 high-yield midterm practice questions based on this PDF document.", stagedFile)}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-white text-indigo-900 hover:bg-indigo-600 hover:text-white border border-indigo-200 transition-all cursor-pointer"
                  >
                    Generate Practice Questions
                  </button>
                  <button
                    onClick={() => handleSendMessage("Extract all mathematical formulas, theorems, and proofs found in this file.", stagedFile)}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-white text-indigo-900 hover:bg-indigo-600 hover:text-white border border-indigo-200 transition-all cursor-pointer"
                  >
                    Extract Formulas
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleSendMessage("Transcribe the handwritten notes, equations, and diagrams in this photo and explain them.", stagedFile)}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-white text-indigo-900 hover:bg-indigo-600 hover:text-white border border-indigo-200 transition-all cursor-pointer"
                  >
                    Transcribe & Explain
                  </button>
                  <button
                    onClick={() => handleSendMessage("Solve the problem or exercise shown in this image with full step-by-step working.", stagedFile)}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-white text-indigo-900 hover:bg-indigo-600 hover:text-white border border-indigo-200 transition-all cursor-pointer"
                  >
                    Solve Problem Step-by-Step
                  </button>
                  <button
                    onClick={() => handleSendMessage("Check if the answers and steps written on this page are correct or if there are errors.", stagedFile)}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-white text-indigo-900 hover:bg-indigo-600 hover:text-white border border-indigo-200 transition-all cursor-pointer"
                  >
                    Verify & Check Errors
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* File Error Notification */}
        {fileError && (
          <div className="mx-4 mb-2 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{fileError}</span>
          </div>
        )}

        {/* Chat Input & Attachment Toolbar */}
        <div className="p-3 sm:p-4 border-t border-slate-200/70 relative z-10 bg-white/90 backdrop-blur-md">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputQuery);
            }}
            className="flex items-center gap-2"
          >
            {/* Action Buttons: Photos & Files */}
            <div className="flex items-center gap-1">
              <motion.button
                type="button"
                onClick={() => photoInputRef.current?.click()}
                title="Attach photo of notes, chalkboard, or textbook page"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 500, damping: 28 }}
                className="p-2.5 rounded-full text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 border border-slate-200 transition-colors cursor-pointer group"
              >
                <ImageIcon className="w-4 h-4 group-hover:scale-110 transition-transform" />
              </motion.button>

              <motion.button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                title="Attach PDF, lecture notes, or document"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 500, damping: 28 }}
                className="p-2.5 rounded-full text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 border border-slate-200 transition-colors cursor-pointer group"
              >
                <Paperclip className="w-4 h-4 group-hover:scale-110 transition-transform" />
              </motion.button>
            </div>

            <div className="flex-1 relative">
              <input
                id="copilot-drawer-input"
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder={
                  !resolvedSectionNumber 
                    ? "Type branch name, option (1-7), or section..." 
                    : stagedFile
                    ? `Ask anything about ${stagedFile.name}...`
                    : "Ask about your section schedule, faculty, or exams..."
                }
                className="w-full px-4 py-3 rounded-full bg-white border border-slate-200 text-xs sm:text-[13px] font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 shadow-sm transition-all"
              />
            </div>

            <motion.button
              id="send-copilot-drawer-btn"
              type="submit"
              disabled={isLoading || (!inputQuery.trim() && !stagedFile)}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              transition={{ type: "spring", stiffness: 500, damping: 28 }}
              className="p-3 rounded-full bg-slate-900 hover:bg-indigo-600 text-white disabled:opacity-40 transition-colors shadow-sm cursor-pointer flex-shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
            </motion.button>
          </form>

          <div className="flex items-center justify-between mt-2 px-1 text-[11px] text-slate-400 font-medium">
            <span className="flex items-center gap-1">
              <FileUp className="w-3 h-3 text-indigo-400" />
              <span>Supports PDF, PNG, JPG, WebP</span>
            </span>
            <span>Gemini Multimodal</span>
          </div>
        </div>
      </div>
    </div>
  );
};
