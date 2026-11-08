import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  MapPin, 
  Search, 
  Navigation, 
  Compass, 
  Clock, 
  Layers, 
  CornerDownRight, 
  Building2, 
  ChevronRight, 
  Sparkles 
} from "lucide-react";
import { CampusLocation } from "../types";

interface CampusMapScreenProps {
  locations: CampusLocation[];
  selectedLocationCode?: string;
  onSelectLocation?: (code: string) => void;
}

export const CampusMapScreen: React.FC<CampusMapScreenProps> = ({
  locations,
  selectedLocationCode,
  onSelectLocation,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeLocation, setActiveLocation] = useState<CampusLocation>(
    locations.find((l) => l.code === selectedLocationCode) || locations[0]
  );

  useEffect(() => {
    if (selectedLocationCode) {
      const found = locations.find(
        (l) => l.code.toLowerCase() === selectedLocationCode.toLowerCase() ||
               l.name.toLowerCase().includes(selectedLocationCode.toLowerCase())
      );
      if (found) {
        setActiveLocation(found);
      }
    }
  }, [selectedLocationCode, locations]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const cleanQuery = query.toLowerCase().replace("where is", "").trim();
    if (!cleanQuery) return;

    const matched = locations.find(
      (l) =>
        l.code.toLowerCase().includes(cleanQuery) ||
        l.name.toLowerCase().includes(cleanQuery) ||
        l.building.toLowerCase().includes(cleanQuery)
    );

    if (matched) {
      setActiveLocation(matched);
      if (onSelectLocation) onSelectLocation(matched.code);
    }
  };

  const buildings = [
    { id: "block-a", name: "Block A", subtitle: "Math & Engineering", x: 130, y: 110, w: 140, h: 120 },
    { id: "block-b", name: "Block B", subtitle: "Physics Complex", x: 200, y: 290, w: 150, h: 120 },
    { id: "block-c", name: "Block C", subtitle: "Bio-Eng & CS (Lab 3)", x: 380, y: 130, w: 160, h: 140 },
    { id: "hub-lib", name: "Central Library", subtitle: "Commons & Quiet Study", x: 270, y: 180, w: 120, h: 100 },
    { id: "hub-student", name: "Student Pavilion", subtitle: "Dining & Commons", x: 340, y: 350, w: 140, h: 90 },
    { id: "block-admin", name: "Admin Tower", subtitle: "Finance & Registrar", x: 60, y: 320, w: 110, h: 110 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/60">
        <div>
          <h1 className="text-3xl sm:text-4xl font-light tracking-tight text-slate-900 flex items-center gap-3">
            <span className="font-semibold">Campus</span> Navigator & Map
          </h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            Search classrooms, research laboratories, and administrative centers with indoor walking routes
          </p>
        </div>

        {/* Quick Question Pills */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Frequent:</span>
          {["Where is Lab 3?", "Room A-204", "Room B-102", "Library"].map((q) => (
            <motion.button
              key={q}
              id={`quick-search-${q.toLowerCase().replace(/[^a-z0-9]/g, "-")}`}
              type="button"
              onClick={() => handleSearch(q)}
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 500, damping: 28 }}
              className="px-3 py-1 rounded-full bg-white/70 hover:bg-white text-xs font-semibold text-slate-700 border border-slate-200 shadow-sm transition-colors cursor-pointer"
            >
              {q}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Search Input */}
      <div className="relative w-full">
        <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          id="campus-search-input"
          type="text"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Ask “Where is Lab 3?” or search room, building, or faculty office..."
          className="w-full pl-11 pr-4 py-3.5 rounded-full bg-white border border-slate-200 text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-400 shadow-sm"
        />
      </div>

      {/* Main Vector Map & Wayfinding Panel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Interactive Vector SVG Blueprint (7 Cols) */}
        <div className="lg:col-span-7 bg-white/60 backdrop-blur-xl rounded-[32px] sm:rounded-[40px] p-5 sm:p-7 overflow-hidden relative border border-white/80 shadow-sm">
          <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-200/60 text-xs">
            <span className="flex items-center gap-2 text-slate-700 font-bold">
              <Building2 className="w-4 h-4 text-indigo-600" />
              <span>Campus Quadrangle Architectural Map</span>
            </span>
            <span className="text-[11px] font-mono text-slate-400 font-medium">
              Current Location: Main Plaza Atrium
            </span>
          </div>

          {/* SVG Map Container */}
          <div className="relative w-full aspect-[4/3] bg-slate-100 rounded-2xl overflow-hidden border border-slate-200/80 shadow-inner">
            <svg
              viewBox="0 0 600 480"
              className="w-full h-full select-none"
            >
              <defs>
                {/* Subtle grid pattern */}
                <pattern id="campus-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(148, 163, 184, 0.2)" strokeWidth="1" />
                </pattern>

                {/* Building highlight gradient */}
                <linearGradient id="activeBuildingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgba(99, 102, 241, 0.2)" />
                  <stop offset="100%" stopColor="rgba(56, 189, 248, 0.15)" />
                </linearGradient>

                <linearGradient id="standardBuildingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="100%" stopColor="#f8fafc" />
                </linearGradient>
              </defs>

              {/* Background Grid */}
              <rect width="600" height="480" fill="url(#campus-grid)" />

              {/* Campus Pathways (Walkways) */}
              <g stroke="rgba(203, 213, 225, 0.8)" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" fill="none">
                <path d="M 120 380 L 270 230 L 460 200" />
                <path d="M 200 170 L 330 230 L 410 390" />
                <path d="M 330 230 L 330 350" />
              </g>

              {/* Central Green Quadrangle lawn */}
              <circle cx="280" cy="240" r="45" fill="rgba(16, 185, 129, 0.15)" stroke="rgba(16, 185, 129, 0.4)" strokeWidth="1.5" strokeDasharray="3,3" />
              <text x="280" y="244" textAnchor="middle" fill="#059669" fontSize="9" fontFamily="sans-serif" fontWeight="bold">
                CENTRAL QUAD
              </text>

              {/* Buildings */}
              {buildings.map((b) => {
                const isTarget = activeLocation.buildingId === b.id;
                return (
                  <g
                    key={b.id}
                    onClick={() => {
                      const loc = locations.find((l) => l.buildingId === b.id);
                      if (loc) setActiveLocation(loc);
                    }}
                    className="cursor-pointer group"
                  >
                    <rect
                      x={b.x}
                      y={b.y}
                      width={b.w}
                      height={b.h}
                      rx="14"
                      fill={isTarget ? "url(#activeBuildingGrad)" : "url(#standardBuildingGrad)"}
                      stroke={isTarget ? "#6366f1" : "rgba(203, 213, 225, 0.9)"}
                      strokeWidth={isTarget ? 2.5 : 1}
                      filter="drop-shadow(0 2px 4px rgba(0,0,0,0.04))"
                      className="transition-all duration-300 group-hover:stroke-indigo-400"
                    />

                    <text
                      x={b.x + b.w / 2}
                      y={b.y + b.h / 2 - 4}
                      textAnchor="middle"
                      fill={isTarget ? "#1e1b4b" : "#1e293b"}
                      fontSize="11"
                      fontWeight="700"
                    >
                      {b.name}
                    </text>
                    <text
                      x={b.x + b.w / 2}
                      y={b.y + b.h / 2 + 12}
                      textAnchor="middle"
                      fill={isTarget ? "#4338ca" : "#64748b"}
                      fontSize="8.5"
                      fontFamily="sans-serif"
                      fontWeight="500"
                    >
                      {b.subtitle}
                    </text>
                  </g>
                );
              })}

              {/* Walking Route Path line to active destination */}
              <path
                d={`M 120 420 Q 250 280 ${activeLocation.coordinates.x} ${activeLocation.coordinates.y}`}
                fill="none"
                stroke="#6366f1"
                strokeWidth="2.5"
                strokeDasharray="6,4"
              />

              {/* Start Pin: You are here */}
              <circle cx="120" cy="420" r="5" fill="#10b981" />
              <text x="120" y="440" textAnchor="middle" fill="#059669" fontSize="8" fontWeight="bold">
                YOU ARE HERE
              </text>

              {/* Destination Beacon Pin */}
              <g transform={`translate(${activeLocation.coordinates.x}, ${activeLocation.coordinates.y})`}>
                <circle r="16" fill="rgba(99, 102, 241, 0.25)" className="animate-ping" />
                <circle r="8" fill="#4f46e5" stroke="#ffffff" strokeWidth="2" />
                <text y="-14" textAnchor="middle" fill="#1e1b4b" fontSize="10" fontWeight="bold">
                  {activeLocation.code}
                </text>
              </g>
            </svg>
          </div>
        </div>

        {/* Right Column: Direction Card & Step-by-Step Wayfinding (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white/80 backdrop-blur-xl rounded-[32px] p-6 sm:p-7 border border-white/90 shadow-sm space-y-5">
            {/* Target Destination Card */}
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {activeLocation.category.toUpperCase()}
                </span>
                <span className="text-xs font-mono font-bold text-emerald-700 flex items-center gap-1 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{activeLocation.walkingTimeMins} mins walk</span>
                </span>
              </div>

              <h2 className="text-xl font-bold tracking-tight text-slate-900 mt-2">
                {activeLocation.name}
              </h2>
              <p className="text-xs font-mono text-indigo-700 font-bold mt-0.5">
                {activeLocation.code} &bull; {activeLocation.floor}, {activeLocation.wing}
              </p>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                {activeLocation.building}
              </p>
            </div>

            {/* Step-by-step walking instructions */}
            <div className="space-y-3 pt-3 border-t border-slate-200/60">
              <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-slate-400 flex items-center gap-2">
                <Navigation className="w-3.5 h-3.5 text-indigo-600" />
                <span>Turn-by-Turn Indoor Directions</span>
              </h3>

              <div className="space-y-2.5">
                {activeLocation.routeInstructions.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-xs leading-relaxed">
                    <span className="w-5 h-5 rounded-full bg-slate-900 text-white font-mono text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5 font-bold">
                      {idx + 1}
                    </span>
                    <span className="text-slate-700 font-medium">{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick action buttons */}
            <div className="pt-2 flex items-center gap-2">
              <button
                id="campus-confirm-arrival-btn"
                className="flex-1 py-3 px-5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-sm transition-all text-center cursor-pointer"
              >
                Start Guided Navigation
              </button>
            </div>
          </div>

          {/* Quick List of Common Campus Hubs */}
          <div className="bg-white/60 backdrop-blur-xl rounded-[28px] p-5 border border-white/80 space-y-2.5 shadow-sm">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em] block">
              Quick Landmarks
            </span>
            <div className="grid grid-cols-2 gap-2">
              {locations.map((loc) => (
                <motion.button
                  key={loc.id}
                  id={`landmark-select-${loc.id}`}
                  type="button"
                  onClick={() => setActiveLocation(loc)}
                  whileHover={{ scale: 1.025, y: -1 }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ type: "spring", stiffness: 500, damping: 28 }}
                  className={`p-2.5 rounded-2xl text-left text-xs border transition-colors cursor-pointer ${
                    activeLocation.id === loc.id
                      ? "bg-white border-indigo-300 shadow-sm text-slate-900 font-bold ring-2 ring-indigo-500/10"
                      : "bg-white/40 border-slate-200/60 text-slate-600 hover:text-slate-900 hover:bg-white"
                  }`}
                >
                  <span className="block font-bold truncate">{loc.code}</span>
                  <span className="block text-[10px] text-slate-400 truncate">{loc.building}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
