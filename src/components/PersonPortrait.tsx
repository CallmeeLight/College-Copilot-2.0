import React from "react";

interface PersonPortraitProps {
  size?: number;
  className?: string;
}

export const PersonPortrait: React.FC<PersonPortraitProps> = ({ size = 36, className = "" }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 48 48" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={`rounded-full shadow-sm overflow-hidden flex-shrink-0 ${className}`}
    >
      <defs>
        <linearGradient id="portraitBgGrad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="50%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#a855f7" />
        </linearGradient>
        <linearGradient id="portraitSkinGrad" x1="20" y1="12" x2="28" y2="30" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#fed7aa" />
          <stop offset="100%" stopColor="#fba979" />
        </linearGradient>
        <linearGradient id="portraitHairGrad" x1="16" y1="8" x2="32" y2="22" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#33241d" />
          <stop offset="100%" stopColor="#1e1410" />
        </linearGradient>
        <linearGradient id="portraitClothesGrad" x1="10" y1="34" x2="38" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ff5c7c" />
          <stop offset="100%" stopColor="#d92049" />
        </linearGradient>
      </defs>

      {/* Colorful backdrop circle */}
      <circle cx="24" cy="24" r="24" fill="url(#portraitBgGrad)" />

      {/* Hair back */}
      <ellipse cx="24" cy="20" rx="11" ry="11" fill="url(#portraitHairGrad)" />

      {/* Neck */}
      <rect x="20" y="27" width="8" height="7" rx="2" fill="#fba979" />

      {/* Shoulders / Shirt in coral matching Meniscus */}
      <path d="M10 46 C10 35, 16 32.5, 24 32.5 C32 32.5, 38 35, 38 46 Z" fill="url(#portraitClothesGrad)" />
      
      {/* Collar / V-neck detail */}
      <path d="M19 33 L24 39 L29 33" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />

      {/* Face */}
      <ellipse cx="24" cy="21" rx="8.5" ry="9.5" fill="url(#portraitSkinGrad)" />

      {/* Hair front / bangs */}
      <path d="M15 19 C15 13, 19 10, 24 10 C29 10, 33 13, 33 18 C31 16, 28 15, 24 16 C20 17, 17 19, 15 19 Z" fill="url(#portraitHairGrad)" />

      {/* Eyebrows */}
      <path d="M18.5 17 Q20.5 16 22 17.5" stroke="#33241d" strokeWidth="1" strokeLinecap="round" />
      <path d="M26 17.5 Q27.5 16 29.5 17" stroke="#33241d" strokeWidth="1" strokeLinecap="round" />

      {/* Eyes */}
      <circle cx="20" cy="20.5" r="1.2" fill="#1e1410" />
      <circle cx="28" cy="20.5" r="1.2" fill="#1e1410" />

      {/* Blush cheeks */}
      <circle cx="18" cy="23.5" r="1.4" fill="#ff7898" opacity="0.5" />
      <circle cx="30" cy="23.5" r="1.4" fill="#ff7898" opacity="0.5" />

      {/* Friendly smile */}
      <path d="M21 25 Q24 28 27 25" stroke="#a1492c" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
};
