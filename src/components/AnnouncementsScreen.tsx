import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  Bell, 
  Tag, 
  AlertCircle, 
  FileText, 
  Clock, 
  CheckCircle2, 
  Bookmark,
  Building
} from "lucide-react";
import { Announcement } from "../types";

interface AnnouncementsScreenProps {
  announcements: Announcement[];
}

export const AnnouncementsScreen: React.FC<AnnouncementsScreenProps> = ({ announcements }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);

  const categories = ["all", "academic", "exam", "administrative", "event"];

  const toggleBookmark = (id: string) => {
    setBookmarkedIds((prev) => 
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filtered = announcements.filter((a) => {
    if (selectedCategory === "all") return true;
    return a.category === selectedCategory;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/60">
        <div>
          <h1 className="text-3xl sm:text-4xl font-light tracking-tight text-slate-900 flex items-center gap-3">
            <span className="font-semibold">Campus</span> Bulletins & Notices
          </h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            Verified notices from the Dean, Examination Cell, and Department Faculty
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none bg-slate-200/70 p-1.5 rounded-full border border-slate-300/50 shadow-inner shadow-slate-900/5 relative">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                id={`cat-filter-${cat}`}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`relative px-4 py-2 rounded-full text-xs font-semibold capitalize transition-colors duration-200 cursor-pointer select-none outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 ${
                  isSelected
                    ? "text-slate-900 font-bold"
                    : "text-slate-600 hover:text-slate-950 font-medium"
                }`}
              >
                {isSelected && (
                  <motion.div
                    layoutId="announcements-category-sliding-pill"
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
                  {cat}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {filtered.map((item) => {
          const isBookmarked = bookmarkedIds.includes(item.id);

          return (
            <div
              key={item.id}
              id={`announcement-card-${item.id}`}
              className={`rounded-[28px] sm:rounded-[36px] p-6 sm:p-7 border transition-all ${
                item.pinned
                  ? "bg-white/80 border-indigo-200/90 shadow-md shadow-indigo-100/50"
                  : "bg-white/60 border-white/80 hover:bg-white/80 hover:border-slate-300/80 shadow-sm"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    {item.pinned && (
                      <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                        Pinned Notice
                      </span>
                    )}
                    <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full border ${
                      item.category === "exam"
                        ? "bg-rose-50 text-rose-700 border-rose-200"
                        : item.category === "academic"
                        ? "bg-amber-50 text-amber-700 border-amber-200"
                        : "bg-slate-100 text-slate-700 border-slate-200"
                    }`}>
                      {item.category}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      {item.date}
                    </span>
                    <span className="text-slate-300">&bull;</span>
                    <span className="text-xs text-indigo-700 font-semibold">
                      {item.author}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                    {item.content}
                  </p>

                  {item.attachment && (
                    <div className="pt-2">
                      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-indigo-50 border border-slate-200 text-xs text-slate-700 font-medium cursor-pointer transition-colors">
                        <FileText className="w-3.5 h-3.5 text-indigo-600" />
                        <span className="font-mono">{item.attachment.name}</span>
                        <span className="text-[10px] text-slate-400">({item.attachment.size})</span>
                      </div>
                    </div>
                  )}
                </div>

                <motion.button
                  id={`bookmark-announcement-${item.id}`}
                  type="button"
                  onClick={() => toggleBookmark(item.id)}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.85 }}
                  transition={{ type: "spring", stiffness: 600, damping: 25 }}
                  className={`p-2.5 rounded-full border transition-colors cursor-pointer select-none ${
                    isBookmarked
                      ? "bg-amber-50 border-amber-200 text-amber-600 shadow-sm"
                      : "bg-white border-slate-200 text-slate-400 hover:text-slate-700 hover:border-slate-300"
                  }`}
                  title={isBookmarked ? "Saved" : "Bookmark this notice"}
                >
                  <motion.div
                    animate={{ scale: isBookmarked ? [0.8, 1.2, 1] : 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-current" : ""}`} />
                  </motion.div>
                </motion.button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
