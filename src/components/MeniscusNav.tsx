import React, { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useSpring, animate } from "motion/react";
import { 
  Home, 
  Calendar, 
  CheckSquare, 
  BookOpen, 
  MapPin, 
  GraduationCap, 
  SlidersHorizontal,
  Bell,
  CreditCard,
  Layers,
  Sparkles,
  MousePointer2
} from "lucide-react";
import { ActiveTab, AttendanceRecord, Announcement, FeeItem } from "../types";

interface MeniscusNavProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  attendance?: AttendanceRecord[];
  announcements?: Announcement[];
  fees?: FeeItem;
  onOpenCopilot?: () => void;
  className?: string;
  showSubtitle?: boolean;
}

interface NavTabItem {
  id: ActiveTab | "more";
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
}

export const MeniscusNav: React.FC<MeniscusNavProps> = ({
  activeTab,
  setActiveTab,
  attendance = [],
  announcements = [],
  fees,
  onOpenCopilot,
  className = "",
  showSubtitle = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Determine low attendance or unread counts
  const lowAttendanceCount = attendance.filter((a) => (a.attended / a.total) * 100 < 75).length;
  const unreadAnnouncementsCount = announcements.filter((a) => !a.read).length;

  const tabs: NavTabItem[] = [
    { id: "today", label: "Today", icon: Home },
    { id: "schedule", label: "Schedule", icon: Calendar },
    { id: "tasks", label: "Tasks", icon: CheckSquare },
    { id: "notes", label: "Notes", icon: BookOpen },
    { id: "campus", label: "Campus", icon: MapPin },
    { 
      id: "attendance", 
      label: "Attendance", 
      icon: GraduationCap,
      badge: lowAttendanceCount > 0 ? "!" : undefined
    },
    { 
      id: "more", 
      label: "Settings", 
      icon: SlidersHorizontal,
      badge: unreadAnnouncementsCount > 0 ? unreadAnnouncementsCount : undefined
    },
  ];

  // Map activeTab to tab index
  const getActiveIndex = (tab: ActiveTab): number => {
    if (tab === "today") return 0;
    if (tab === "schedule") return 1;
    if (tab === "tasks") return 2;
    if (tab === "notes") return 3;
    if (tab === "campus") return 4;
    if (tab === "attendance") return 5;
    // Exams, Announcements, Fees map to Settings / More (tab 6)
    return 6;
  };

  const activeIndex = getActiveIndex(activeTab);

  // Sizing and layout math
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkWidth = () => {
      setIsMobile(typeof window !== "undefined" && window.innerWidth < 440);
    };
    checkWidth();
    window.addEventListener("resize", checkWidth);
    return () => window.removeEventListener("resize", checkWidth);
  }, []);

  const tabWidth = isMobile ? 42 : 48;
  const paddingX = isMobile ? 14 : 22;
  const totalTabs = tabs.length;
  const dockWidth = totalTabs * tabWidth + paddingX * 2; // ~322px on mobile, ~380px on desktop
  const dockHeight = isMobile ? 50 : 54;
  const yTop = isMobile ? 16 : 18; // clearance for notch dip and bead
  const cornerRadius = isMobile ? 20 : 24;
  const beadSize = isMobile ? 38 : 44;
  const beadRadius = beadSize / 2;

  // Notch parameters based on the Meniscus math from screenshot:
  // const reach = (s, rb, by) => Math.sqrt((s+rb)**2 - (s-by)**2);
  const by = isMobile ? 10 : 12; // depth of the bowl dip
  const s = isMobile ? 12 : 14;  // shoulder radius
  const rb = isMobile ? 18 : 22; // bowl radius
  const reach = Math.round(Math.sqrt(Math.pow(s + rb, 2) - Math.pow(s - by, 2))); // ~30-36px

  // Center coordinate for a given tab index
  const getTabCenterX = (idx: number) => paddingX + idx * tabWidth + tabWidth / 2;

  // Target X for the active tab
  const targetX = getTabCenterX(activeIndex);

  // Motion values for smooth fluid bead & socket tracking
  const beadX = useMotionValue(targetX);
  const smoothBeadX = useSpring(beadX, {
    stiffness: 420,
    damping: 32,
    mass: 0.75,
  });

  // State to force re-render of parametric SVG path during animation
  const [currentSocketX, setCurrentSocketX] = useState(targetX);

  useEffect(() => {
    if (!isDragging) {
      const controls = animate(beadX, targetX, {
        type: "spring",
        stiffness: 420,
        damping: 32,
        mass: 0.75,
      });
      return controls.stop;
    }
  }, [targetX, isDragging, beadX]);

  useEffect(() => {
    const unsubscribe = smoothBeadX.on("change", (latest) => {
      setCurrentSocketX(latest);
    });
    return () => unsubscribe();
  }, [smoothBeadX]);

  // Generate SVG parametric path for the Meniscus dock plate
  const generateDockPath = (cx: number) => {
    const x0 = Math.max(cornerRadius * 0.75, cx - reach);
    const x2 = Math.min(dockWidth - cornerRadius * 0.75, cx + reach);
    const halfReachLeft = cx - x0;
    const halfReachRight = x2 - cx;

    // Cubic bezier control points tangent to horizontal top edge and bottom bowl
    const cp1x = x0 + halfReachLeft * 0.46;
    const cp1y = yTop;
    const cp2x = cx - halfReachLeft * 0.42;
    const cp2y = yTop + by;

    const cp3x = cx + halfReachRight * 0.42;
    const cp3y = yTop + by;
    const cp4x = x2 - halfReachRight * 0.46;
    const cp4y = yTop;

    return [
      `M ${cornerRadius},${yTop}`,
      `L ${x0},${yTop}`,
      `C ${cp1x},${cp1y} ${cp2x},${cp2y} ${cx},${yTop + by}`,
      `C ${cp3x},${cp3y} ${cp4x},${cp4y} ${x2},${yTop}`,
      `L ${dockWidth - cornerRadius},${yTop}`,
      `A ${cornerRadius},${cornerRadius} 0 0,1 ${dockWidth},${yTop + cornerRadius}`,
      `L ${dockWidth},${yTop + dockHeight - cornerRadius}`,
      `A ${cornerRadius},${cornerRadius} 0 0,1 ${dockWidth - cornerRadius},${yTop + dockHeight}`,
      `L ${cornerRadius},${yTop + dockHeight}`,
      `A ${cornerRadius},${cornerRadius} 0 0,1 0,${yTop + dockHeight - cornerRadius}`,
      `L 0,${yTop + cornerRadius}`,
      `A ${cornerRadius},${cornerRadius} 0 0,1 ${cornerRadius},${yTop}`,
      `Z`
    ].join(" ");
  };

  const handleTabClick = (tabItem: NavTabItem) => {
    if (tabItem.id === "more") {
      setSettingsOpen(!settingsOpen);
    } else {
      setSettingsOpen(false);
      setActiveTab(tabItem.id as ActiveTab);
    }
  };

  // Find active tab info
  const activeTabItem = tabs[activeIndex] || tabs[0];
  const ActiveIcon = activeTabItem.icon;

  // Active label text
  const getActiveLabel = () => {
    if (activeTab === "exams") return "Exams";
    if (activeTab === "announcements") return "Announcements";
    if (activeTab === "fees") return "Fees";
    return activeTabItem.label;
  };

  return (
    <div className={`relative flex flex-col items-center select-none ${className}`}>
      {/* Settings / More Dropdown Popover */}
      {settingsOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setSettingsOpen(false)} 
          />
          <div 
            className="absolute bottom-full mb-4 w-72 bg-[#171422]/95 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl shadow-black/70 p-3 z-50 animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-3 py-2 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-200 uppercase tracking-wider">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#ff4f70]" />
                <span>More Navigation</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">College Copilot</span>
            </div>

            <div className="space-y-1 mt-2">
              <motion.button
                id="meniscus-subtab-exams"
                type="button"
                whileHover={{ scale: 1.02, x: 2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  setActiveTab("exams");
                  setSettingsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs font-medium transition-colors cursor-pointer ${
                  activeTab === "exams" 
                    ? "bg-[#ff4f70] text-white shadow-lg shadow-[#ff4f70]/30" 
                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Layers className="w-4 h-4" />
                  <span>Exams & Weightage</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-slate-300">
                  Nov '26
                </span>
              </motion.button>

              <motion.button
                id="meniscus-subtab-announcements"
                type="button"
                whileHover={{ scale: 1.02, x: 2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  setActiveTab("announcements");
                  setSettingsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs font-medium transition-colors cursor-pointer ${
                  activeTab === "announcements" 
                    ? "bg-[#ff4f70] text-white shadow-lg shadow-[#ff4f70]/30" 
                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Bell className="w-4 h-4" />
                  <span>Announcements</span>
                </div>
                {unreadAnnouncementsCount > 0 && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                    {unreadAnnouncementsCount} New
                  </span>
                )}
              </motion.button>

              <motion.button
                id="meniscus-subtab-fees"
                type="button"
                whileHover={{ scale: 1.02, x: 2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  setActiveTab("fees");
                  setSettingsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs font-medium transition-colors cursor-pointer ${
                  activeTab === "fees" 
                    ? "bg-[#ff4f70] text-white shadow-lg shadow-[#ff4f70]/30" 
                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <CreditCard className="w-4 h-4" />
                  <span>Semester Fees</span>
                </div>
                {fees && fees.status === "pending" && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30">
                    {fees.daysRemaining}d left
                  </span>
                )}
              </motion.button>

              {onOpenCopilot && (
                <motion.button
                  id="meniscus-subtab-copilot"
                  type="button"
                  whileHover={{ scale: 1.02, x: 2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    onOpenCopilot();
                    setSettingsOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs font-medium text-slate-300 hover:bg-indigo-600/20 hover:text-indigo-300 border border-indigo-500/20 mt-2 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                    <span>Ask AI Copilot</span>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
                </motion.button>
              )}
            </div>
          </div>
        </>
      )}

      {/* Meniscus Dock Container */}
      <div 
        ref={containerRef}
        className="relative"
        style={{ width: dockWidth, height: dockHeight + yTop }}
      >
        {/* SVG Plate with Parametric Socket */}
        <svg 
          className="absolute inset-0 w-full h-full overflow-visible pointer-events-none"
          viewBox={`0 0 ${dockWidth} ${dockHeight + yTop}`}
        >
          <defs>
            {/* Dark plate gradient matching screenshot: #181524 to #0c0a13 */}
            <linearGradient id="mnPlate" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#191626" />
              <stop offset="60%" stopColor="#120f1c" />
              <stop offset="100%" stopColor="#0b0a12" />
            </linearGradient>

            {/* Rim specular gradient */}
            <linearGradient id="mnRim" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(255, 255, 255, 0.25)" />
              <stop offset="40%" stopColor="rgba(255, 255, 255, 0.08)" />
              <stop offset="100%" stopColor="rgba(255, 255, 255, 0.02)" />
            </linearGradient>

            {/* Soft shadow */}
            <filter id="mnShadow" x="-10%" y="-10%" width="120%" height="150%">
              <feDropShadow dx="0" dy="16" stdDeviation="16" floodColor="#000000" floodOpacity="0.65" />
            </filter>
          </defs>

          {/* Meniscus Skin Path */}
          <path 
            id="skinFill"
            d={generateDockPath(currentSocketX)}
            fill="url(#mnPlate)"
            stroke="url(#mnRim)"
            strokeWidth="1.2"
            filter="url(#mnShadow)"
            className="transition-colors duration-150"
          />
        </svg>

        {/* Tab Buttons Container (Inside Dock) */}
        <div 
          role="tablist"
          className="absolute inset-x-0 bottom-0 flex items-center justify-between"
          style={{ 
            height: dockHeight, 
            paddingLeft: paddingX, 
            paddingRight: paddingX 
          }}
        >
          {tabs.map((tab, idx) => {
            const isTabActive = activeIndex === idx;
            const TabIcon = tab.icon;

            return (
              <button
                key={tab.id}
                id={`meniscus-tab-${tab.id}`}
                role="tab"
                aria-selected={isTabActive}
                aria-label={tab.label}
                onClick={() => handleTabClick(tab)}
                className="relative flex items-center justify-center transition-all cursor-pointer group"
                style={{ width: tabWidth, height: dockHeight }}
              >
                {/* Inactive Icon with hover glow - fades out when active bead is over it */}
                <div 
                  className={`transition-all duration-200 flex items-center justify-center ${
                    isTabActive ? "opacity-0 scale-75" : "opacity-75 group-hover:opacity-100 group-hover:scale-110 text-slate-400 group-hover:text-white"
                  }`}
                >
                  <TabIcon className="w-5 h-5 stroke-[1.8]" />
                </div>

                {/* Subtle notification dot for alerts */}
                {tab.badge && !isTabActive && (
                  <span className="absolute top-2.5 right-2 w-1.5 h-1.5 rounded-full bg-[#ff4f70] shadow-sm shadow-[#ff4f70]/80" />
                )}
              </button>
            );
          })}
        </div>

        {/* The Elevated Bead: Glowing Pink / Coral Bead */}
        <motion.div
          className="absolute top-0 z-20 cursor-grab active:cursor-grabbing flex items-center justify-center rounded-full"
          style={{
            x: smoothBeadX,
            y: yTop - (isMobile ? 12 : 14), // Elevated above the dock socket
            marginLeft: -beadRadius, // Center the bead on cx
            width: beadSize,
            height: beadSize,
          }}
          drag="x"
          dragConstraints={{
            left: getTabCenterX(0),
            right: getTabCenterX(totalTabs - 1),
          }}
          dragElastic={0.08}
          onDragStart={() => setIsDragging(true)}
          onDrag={(_, info) => {
            // Update beadX directly during drag
            beadX.set(smoothBeadX.get() + info.delta.x);
          }}
          onDragEnd={(_, info) => {
            setIsDragging(false);
            const currentX = smoothBeadX.get() + info.offset.x;
            // Snap to the closest tab
            let closestIdx = 0;
            let minDistance = Infinity;

            tabs.forEach((_, idx) => {
              const tabX = getTabCenterX(idx);
              const dist = Math.abs(currentX - tabX);
              if (dist < minDistance) {
                minDistance = dist;
                closestIdx = idx;
              }
            });

            handleTabClick(tabs[closestIdx]);
          }}
        >
          {/* Outer radial glow bloom */}
          <div 
            className="absolute inset-0 rounded-full pointer-events-none blur-md opacity-90"
            style={{
              background: "radial-gradient(circle, rgba(255, 75, 114, 0.8) 0%, rgba(255, 75, 114, 0) 70%)",
              transform: "scale(1.7)",
            }}
          />

          {/* Bead Body with Inner Bevel & Rich Coral Gradient */}
          <div 
            className="relative w-full h-full rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95"
            style={{
              background: "radial-gradient(circle at 35% 30%, #ff7393 0%, #ff4b72 55%, #e12753 100%)",
              boxShadow: "0 0 24px rgba(255, 75, 114, 0.75), 0 0 45px rgba(255, 75, 114, 0.35), inset 0 1.5px 2px rgba(255, 255, 255, 0.55), inset 0 -2px 4px rgba(0, 0, 0, 0.25)",
            }}
          >
            <ActiveIcon className="w-5 h-5 text-white stroke-[2.2] drop-shadow-sm" />
          </div>
        </motion.div>
      </div>

      {/* Label and Mouse Pointer Underneath the Dock (Matching Screenshot!) */}
      <div 
        className="relative w-full flex items-center justify-center mt-2.5 text-center pointer-events-none"
        style={{ width: dockWidth, height: 28 }}
      >
        <motion.div
          className="absolute flex items-center gap-1 text-xs font-bold tracking-wide transition-all"
          style={{
            x: smoothBeadX,
            marginLeft: -24,
            color: "#ff4f70",
          }}
        >
          <MousePointer2 className="w-3.5 h-3.5 fill-[#ff4f70] text-[#ff4f70] rotate-[-15deg] drop-shadow-sm" />
          <span className="font-semibold tracking-tight">{getActiveLabel()}</span>
        </motion.div>
      </div>

      {/* Prompt / Subtitle (Matching Screenshot: "Tap a tab — or drag the bead along the bar.") */}
      {showSubtitle && (
        <p className="text-[11px] font-medium text-slate-400/80 mt-1.5 text-center tracking-tight">
          Tap a tab — or <span className="underline decoration-dotted decoration-slate-500/60">drag the bead</span> along the bar.
        </p>
      )}
    </div>
  );
};
