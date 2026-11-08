import React, { useState, useRef } from "react";
import { motion } from "motion/react";
import { 
  BookOpen, 
  Search, 
  Upload, 
  FileText, 
  Sparkles, 
  File, 
  Image as ImageIcon, 
  PenTool, 
  X, 
  Send, 
  HelpCircle, 
  Check, 
  Zap,
  Tag
} from "lucide-react";
import { NoteItem, FileAttachment } from "../types";
import { AiFormattedText } from "./AiFormattedText";

interface NotesScreenProps {
  notes: NoteItem[];
  onAddNote: (note: NoteItem) => void;
  onOpenCopilot?: (prompt?: string) => void;
}

export const NotesScreen: React.FC<NotesScreenProps> = ({ notes, onAddNote, onOpenCopilot }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [activeNote, setActiveNote] = useState<NoteItem | null>(notes[0] || null);

  // AI note assistance states
  const [aiActionLoading, setAiActionLoading] = useState(false);
  const [aiOutput, setAiOutput] = useState<{ action: string; text: string } | null>(null);
  const [customQuestion, setCustomQuestion] = useState("");

  // Upload modal
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState("");
  const [newNoteSubject, setNewNoteSubject] = useState("Mathematics");
  const [newNoteType, setNewNoteType] = useState<"pdf" | "image" | "handwritten" | "text">("pdf");
  const [newNoteContent, setNewNoteContent] = useState("");
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [uploadedAttachment, setUploadedAttachment] = useState<FileAttachment | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const subjects = ["all", ...Array.from(new Set(notes.map((n) => n.subject)))];

  const filteredNotes = notes.filter((n) => {
    const matchesSubject = selectedSubject === "all" || n.subject === selectedSubject;
    const matchesQuery = 
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSubject && matchesQuery;
  });

  const triggerAiAction = async (action: "explain_simple" | "summarize" | "exam_questions" | "ask_custom") => {
    if (!activeNote) return;
    setAiActionLoading(true);
    setAiOutput(null);

    try {
      const res = await fetch("/api/notes/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          noteTitle: activeNote.title,
          content: activeNote.content,
          query: customQuestion,
          file: activeNote.attachment
            ? {
                name: activeNote.attachment.name,
                mimeType: activeNote.attachment.mimeType,
                base64: activeNote.attachment.base64,
              }
            : undefined,
        }),
      });
      const data = await res.json();
      setAiOutput({
        action,
        text: data.result || "Analysis completed.",
      });
    } catch {
      setAiOutput({
        action,
        text: "Could not fetch AI response. Please verify connection.",
      });
    } finally {
      setAiActionLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setUploadedFileName(file.name);
      if (!newNoteTitle) {
        setNewNoteTitle(file.name.replace(/\.[^/.]+$/, ""));
      }

      const isImage = file.type.startsWith("image/");
      const isPdf = file.type.includes("pdf") || file.name.toLowerCase().endsWith(".pdf");
      if (isImage) setNewNoteType("image");
      else if (isPdf) setNewNoteType("pdf");

      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        if (dataUrl) {
          const base64 = dataUrl.includes(",") ? dataUrl.split(",")[1] : dataUrl;
          const mimeType = file.type || (isPdf ? "application/pdf" : isImage ? "image/jpeg" : "application/octet-stream");

          setUploadedAttachment({
            name: file.name,
            type: isImage ? "image" : isPdf ? "pdf" : "document",
            mimeType,
            dataUrl,
            base64,
            sizeKb: Math.round(file.size / 1024),
          });

          if (!newNoteContent) {
            setNewNoteContent(
              isPdf
                ? `Uploaded PDF document: ${file.name} (${Math.round(file.size / 1024)} KB). Contains official syllabus readings, lecture slides, and practice problems ready for Gemini AI examination.`
                : isImage
                ? `Uploaded photo of notes: ${file.name} (${Math.round(file.size / 1024)} KB). Contains blackboard snapshot and handwritten derivations ready for OCR and explanation.`
                : `Uploaded file: ${file.name} (${Math.round(file.size / 1024)} KB).`
            );
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteTitle.trim()) return;

    const newNote: NoteItem = {
      id: `note-${Date.now()}`,
      title: newNoteTitle,
      subject: newNoteSubject,
      dateAdded: "Just now",
      type: newNoteType,
      tags: [newNoteSubject, "Uploaded", newNoteType.toUpperCase()],
      content: newNoteContent || `Document content for ${newNoteTitle}. Topics include core conceptual review and lecture derivations.`,
      summary: `Automated summary for ${newNoteTitle}.`,
      attachment: uploadedAttachment || undefined,
    };

    onAddNote(newNote);
    setActiveNote(newNote);
    setIsUploadModalOpen(false);
    setNewNoteTitle("");
    setNewNoteContent("");
    setUploadedFileName(null);
    setUploadedAttachment(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/60">
        <div>
          <h1 className="text-3xl sm:text-4xl font-light tracking-tight text-slate-900 flex items-center gap-3">
            <span className="font-semibold">Academic Intelligence</span> & Notes
          </h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            Lecture notes repository &bull; AI concept tutor &bull; Exam practice generator
          </p>
        </div>

        <motion.button
          id="upload-notes-modal-btn"
          type="button"
          onClick={() => setIsUploadModalOpen(true)}
          whileHover={{ scale: 1.03, y: -1 }}
          whileTap={{ scale: 0.96, y: 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 28 }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer"
        >
          <Upload className="w-4 h-4" />
          <span>Upload PDF / Handwritten Note</span>
        </motion.button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            id="notes-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notes by keyword, theorem, equation, or topic..."
            className="w-full pl-11 pr-4 py-3 rounded-full bg-white border border-slate-200 text-xs font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-400 shadow-sm"
          />
        </div>

        {/* Subject Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none bg-slate-200/70 p-1.5 rounded-full border border-slate-300/50 shadow-inner shadow-slate-900/5 relative">
          {subjects.map((sub) => {
            const isSelected = selectedSubject === sub;
            return (
              <button
                key={sub}
                id={`subject-filter-${sub}`}
                type="button"
                onClick={() => setSelectedSubject(sub)}
                className={`relative px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap capitalize transition-colors duration-200 cursor-pointer select-none outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 ${
                  isSelected
                    ? "text-slate-900 font-bold"
                    : "text-slate-600 hover:text-slate-950 font-medium"
                }`}
              >
                {isSelected && (
                  <motion.div
                    layoutId="notes-subject-sliding-pill"
                    className="absolute inset-0 rounded-full bg-white shadow-sm shadow-slate-900/10 border border-slate-200/90 pointer-events-none"
                    transition={{
                      type: "spring",
                      stiffness: 450,
                      damping: 35,
                      mass: 0.8,
                    }}
                  >
                    <div className="absolute top-0 inset-x-3 h-[1px] bg-gradient-to-r from-transparent via-white to-transparent opacity-80" />
                  </motion.div>
                )}
                <span className="relative z-10 block leading-tight">
                  {sub === "all" ? "All Subjects" : sub}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main split view: Notes List (Left) + Note Reader & AI Tutor (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Note Cards (4 Cols) */}
        <div className="lg:col-span-4 space-y-3 max-h-[720px] overflow-y-auto pr-1">
          {filteredNotes.length === 0 ? (
            <div className="p-8 text-center bg-white/40 border border-white/80 rounded-[28px] text-xs text-slate-400 font-medium">
              No notes found matching your criteria.
            </div>
          ) : (
            filteredNotes.map((n) => {
              const isSelected = activeNote?.id === n.id;
              return (
                <div
                  key={n.id}
                  id={`note-card-${n.id}`}
                  onClick={() => {
                    setActiveNote(n);
                    setAiOutput(null);
                  }}
                  className={`rounded-[28px] p-4 sm:p-5 border transition-all cursor-pointer ${
                    isSelected
                      ? "bg-white/90 border-indigo-300 shadow-lg shadow-indigo-100/50 ring-2 ring-indigo-500/20"
                      : "bg-white/50 border-white/80 hover:bg-white/70 hover:border-slate-300/80 shadow-sm"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600">
                      {n.type === "pdf" ? (
                        <FileText className="w-4 h-4" />
                      ) : n.type === "image" ? (
                        <ImageIcon className="w-4 h-4" />
                      ) : n.type === "handwritten" ? (
                        <PenTool className="w-4 h-4" />
                      ) : (
                        <File className="w-4 h-4" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[10px] uppercase font-bold text-indigo-700">
                          {n.subject}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {n.dateAdded}
                        </span>
                      </div>

                      <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug line-clamp-2">
                        {n.title}
                      </h3>

                      <p className="text-[11px] text-slate-500 line-clamp-2">
                        {n.summary || n.content}
                      </p>

                      <div className="flex items-center gap-1.5 flex-wrap pt-1">
                        {n.tags.slice(0, 2).map((tag) => (
                          <span key={tag} className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Active Note Reader & AI Knowledge Workspace (8 Cols) */}
        <div className="lg:col-span-8">
          {activeNote ? (
            <div className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-[32px] sm:rounded-[40px] p-6 sm:p-8 space-y-6 shadow-sm">
              {/* Note Header */}
              <div className="space-y-2 pb-4 border-b border-slate-200/60">
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                    {activeNote.subject}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    Added {activeNote.dateAdded}
                  </span>
                  <span className="text-xs text-slate-400 font-mono capitalize">
                    Format: {activeNote.type}
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                  {activeNote.title}
                </h2>
              </div>

              {/* AI Copilot Knowledge Actions Bar */}
              <div className="p-5 rounded-[28px] bg-indigo-50/50 border border-indigo-100 space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    <span className="text-xs font-bold tracking-wide uppercase text-indigo-900">
                      AI Note Comprehension
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold text-indigo-600/70">Powered by Gemini 3.1 & Vision</span>
                    {onOpenCopilot && (
                      <button
                        onClick={() => onOpenCopilot(`I have a question regarding the note "${activeNote.title}": `)}
                        className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 bg-white px-2.5 py-1 rounded-full border border-indigo-200 shadow-xs flex items-center gap-1 cursor-pointer"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>Discuss in Copilot</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Preset AI Action Buttons */}
                <div className="flex flex-wrap items-center gap-2">
                  <motion.button
                    id="ai-explain-simple-btn"
                    type="button"
                    onClick={() => triggerAiAction("explain_simple")}
                    disabled={aiActionLoading}
                    whileHover={{ scale: 1.03, y: -1 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 500, damping: 28 }}
                    className="px-3.5 py-1.5 rounded-full bg-white hover:bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs font-semibold transition-colors disabled:opacity-50 shadow-sm cursor-pointer"
                  >
                    “Explain in simple terms”
                  </motion.button>

                  <motion.button
                    id="ai-summarize-btn"
                    type="button"
                    onClick={() => triggerAiAction("summarize")}
                    disabled={aiActionLoading}
                    whileHover={{ scale: 1.03, y: -1 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 500, damping: 28 }}
                    className="px-3.5 py-1.5 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold transition-colors disabled:opacity-50 shadow-sm cursor-pointer"
                  >
                    “Summarize key points”
                  </motion.button>

                  <motion.button
                    id="ai-exam-questions-btn"
                    type="button"
                    onClick={() => triggerAiAction("exam_questions")}
                    disabled={aiActionLoading}
                    whileHover={{ scale: 1.03, y: -1 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 500, damping: 28 }}
                    className="px-3.5 py-1.5 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold transition-colors disabled:opacity-50 shadow-sm cursor-pointer"
                  >
                    “Generate 3 exam practice questions”
                  </motion.button>
                </div>

                {/* Custom Question input */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    value={customQuestion}
                    onChange={(e) => setCustomQuestion(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && customQuestion.trim()) {
                        triggerAiAction("ask_custom");
                      }
                    }}
                    placeholder="Ask any specific question about these notes..."
                    className="flex-1 px-4 py-2.5 rounded-full bg-white border border-slate-200 text-xs font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-400 shadow-sm"
                  />
                  <button
                    id="ai-ask-custom-btn"
                    onClick={() => triggerAiAction("ask_custom")}
                    disabled={aiActionLoading || !customQuestion.trim()}
                    className="p-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white disabled:opacity-40 transition-colors shadow-sm cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* AI Result Card */}
                {(aiActionLoading || aiOutput) && (
                  <div className="mt-3 p-4 rounded-2xl bg-white border border-indigo-100 space-y-2 animate-in fade-in shadow-sm">
                    <div className="flex items-center justify-between text-xs text-indigo-700 font-bold">
                      <span className="flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-indigo-600" />
                        AI Analysis
                      </span>
                      {aiOutput && (
                        <button
                          onClick={() => setAiOutput(null)}
                          className="text-slate-400 hover:text-slate-700 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {aiActionLoading ? (
                      <div className="flex items-center gap-2 py-3 text-xs text-indigo-700 font-medium">
                        <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                        <span>Synthesizing explanation and generating insights...</span>
                      </div>
                    ) : (
                      <div className="text-[13px] sm:text-sm text-slate-800">
                        <AiFormattedText content={aiOutput?.text || ""} />
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Note Content Viewer */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-slate-400">
                  Lecture Content & Derivations
                </h3>

                {/* Attached File/Photo Preview */}
                {activeNote.attachment && (
                  <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      {activeNote.attachment.type === "image" && activeNote.attachment.dataUrl ? (
                        <img 
                          src={activeNote.attachment.dataUrl} 
                          alt={activeNote.attachment.name} 
                          className="w-14 h-14 rounded-xl object-cover border border-indigo-200 shadow-xs"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-white border border-indigo-200 flex items-center justify-center text-rose-500 shadow-xs">
                          <FileText className="w-6 h-6" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-indigo-600 text-white">
                            {activeNote.attachment.type.toUpperCase()} Attached
                          </span>
                          <span className="text-[11px] text-indigo-700 font-mono">
                            {activeNote.attachment.sizeKb} KB
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-slate-900 truncate mt-0.5">
                          {activeNote.attachment.name}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => triggerAiAction("summarize")}
                      className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors flex-shrink-0 cursor-pointer"
                    >
                      Examine File
                    </button>
                  </div>
                )}

                <div className="p-5 rounded-2xl bg-white/70 border border-slate-200 font-mono text-xs sm:text-sm text-slate-800 whitespace-pre-wrap leading-relaxed max-h-[420px] overflow-y-auto shadow-inner">
                  {activeNote.content}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center bg-white/40 border border-white/80 rounded-[32px] text-slate-400 font-medium">
              Select a note to view and analyze with AI.
            </div>
          )}
        </div>
      </div>

      {/* Upload Notes Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-white/95 backdrop-blur-xl rounded-[32px] p-6 sm:p-7 shadow-2xl border border-white/90 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200/60">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Upload className="w-4 h-4 text-indigo-600" />
                <span>Upload Lecture Notes or Paper</span>
              </h3>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-800 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveUpload} className="mt-4 space-y-4 text-xs">
              {/* File Dropzone / manual picker */}
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    const f = e.dataTransfer.files[0];
                    setUploadedFileName(f.name);
                    if (!newNoteTitle) setNewNoteTitle(f.name.replace(/\.[^/.]+$/, ""));
                  }
                }}
                className="p-6 rounded-2xl border-2 border-dashed border-slate-200 hover:border-indigo-400 bg-slate-50 hover:bg-indigo-50/30 text-center cursor-pointer transition-colors space-y-2"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".pdf,.png,.jpg,.jpeg,.txt,.md"
                  className="hidden"
                />
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mx-auto">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-slate-800">
                    {uploadedFileName ? (
                      <span className="text-indigo-600 font-mono">Selected: {uploadedFileName}</span>
                    ) : (
                      "Click to browse or drag & drop"
                    )}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Supports PDFs, PNG/JPG photos of whiteboards/handwritten pages, Markdown & TXT
                  </p>
                </div>
              </div>

              {/* Title & Subject */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-700 font-semibold block">Note Title *</label>
                  <input
                    type="text"
                    required
                    value={newNoteTitle}
                    onChange={(e) => setNewNoteTitle(e.target.value)}
                    placeholder="e.g. Signal Processing Lecture 7"
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-400 shadow-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-700 font-semibold block">Course Subject</label>
                  <select
                    value={newNoteSubject}
                    onChange={(e) => setNewNoteSubject(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-slate-200 text-slate-900 focus:outline-none focus:border-indigo-400 shadow-sm"
                  >
                    <option value="Mathematics">Mathematics</option>
                    <option value="Physics">Physics</option>
                    <option value="BME Laboratory">BME Laboratory</option>
                    <option value="Programming">Programming</option>
                    <option value="Biology for Engineers">Biology for Engineers</option>
                  </select>
                </div>
              </div>

              {/* Format type */}
              <div className="space-y-1">
                <label className="text-slate-700 font-semibold block">Source Format</label>
                <div className="grid grid-cols-4 gap-2">
                  {(["pdf", "image", "handwritten", "text"] as const).map((fmt) => (
                    <motion.button
                      type="button"
                      key={fmt}
                      onClick={() => setNewNoteType(fmt)}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.94 }}
                      transition={{ type: "spring", stiffness: 500, damping: 28 }}
                      className={`py-2 rounded-xl border uppercase text-[10px] font-bold transition-colors cursor-pointer ${
                        newNoteType === fmt
                          ? "bg-slate-900 border-slate-900 text-white shadow-sm"
                          : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      {fmt}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Content / OCR Text preview */}
              <div className="space-y-1">
                <label className="text-slate-700 font-semibold block">Extracted Text / Custom Notes</label>
                <textarea
                  rows={4}
                  value={newNoteContent}
                  onChange={(e) => setNewNoteContent(e.target.value)}
                  placeholder="Paste lecture notes or equations here..."
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-400 font-mono text-xs shadow-sm"
                />
              </div>

              {/* Submit */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200/60">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-semibold shadow-sm cursor-pointer"
                >
                  Save to Knowledge Base
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
