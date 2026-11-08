import React from "react";

export const BackgroundAmbient: React.FC = () => {
  return (
    <div 
      className="fixed inset-0 pointer-events-none -z-10 overflow-hidden bg-gradient-to-br from-[#F5F6FB] via-[#EEF2FB] to-[#E9EDFA] gpu-accelerated"
      style={{
        contain: "strict",
        isolation: "isolate",
      }}
    >
      {/* Immersive UI Brand Ambient Blurred Color Blobs (Purple & Indigo Tones) - 60Hz GPU Layered */}
      {/* 1. Top-Left / Greeting & Top Grid Glow */}
      <div 
        className="absolute -top-16 left-[8%] sm:left-[15%] w-[560px] h-[500px] bg-gradient-to-br from-indigo-400/35 via-purple-300/30 to-violet-400/25 rounded-full blur-[100px] opacity-85 animate-ambient-1"
        style={{
          transform: "translate3d(0, 0, 0)",
          backfaceVisibility: "hidden",
          contain: "paint",
        }}
      />

      {/* 2. Top-Right / Quick Status & CTA Tile Radiant Bloom */}
      <div 
        className="absolute top-[4%] right-[-5%] sm:right-[5%] w-[540px] h-[520px] bg-gradient-to-bl from-purple-400/35 via-indigo-300/40 to-blue-300/25 rounded-full blur-[110px] opacity-80 animate-ambient-2"
        style={{
          transform: "translate3d(0, 0, 0)",
          backfaceVisibility: "hidden",
          contain: "paint",
        }}
      />

      {/* 3. Mid-Left / Behind Left Bento Column (Copilot & Vitality Tiles) */}
      <div 
        className="absolute top-[35%] left-[5%] sm:left-[12%] w-[480px] h-[480px] bg-gradient-to-tr from-violet-400/30 via-indigo-300/35 to-sky-200/25 rounded-full blur-[95px] opacity-75 animate-ambient-2"
        style={{
          transform: "translate3d(0, 0, 0)",
          backfaceVisibility: "hidden",
          contain: "paint",
        }}
      />

      {/* 4. Mid-Right / Behind Timeline & Classes Glass Container */}
      <div 
        className="absolute top-[40%] right-[3%] sm:right-[8%] w-[620px] h-[560px] bg-gradient-to-tl from-indigo-300/40 via-purple-300/30 to-violet-400/20 rounded-full blur-[120px] opacity-80 animate-ambient-1"
        style={{
          transform: "translate3d(0, 0, 0)",
          backfaceVisibility: "hidden",
          contain: "paint",
        }}
      />

      {/* 5. Bottom Ambient Base Grounding */}
      <div 
        className="absolute -bottom-28 left-[25%] sm:left-[35%] w-[680px] h-[440px] bg-gradient-to-t from-indigo-300/35 via-purple-200/25 to-transparent rounded-full blur-[110px] opacity-70"
        style={{
          transform: "translate3d(0, 0, 0)",
          backfaceVisibility: "hidden",
          contain: "paint",
        }}
      />

      {/* Subtle organic light grid texture for physical refraction */}
      <div 
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `radial-gradient(rgba(79, 70, 229, 0.45) 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
          contain: "strict",
        }}
      />
    </div>
  );
};


