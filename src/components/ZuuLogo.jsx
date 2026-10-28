import React from 'react';

export const ZuuLogo = ({ className = "w-8 h-8", withText = false, textClassName = "text-xl font-black" }) => {
  return (
    <div className="flex items-center gap-2.5 group select-none">
      {/* Dynamic Zuu Brand Icon */}
      <div className={`relative flex items-center justify-center shrink-0 rounded-xl bg-gradient-to-tr from-[#121212] via-[#1a1a1a] to-[#282828] p-1.5 border border-white/10 shadow-lg group-hover:border-[#1ed760]/50 transition-all duration-300 ${className}`}>
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_2px_8px_rgba(30,215,96,0.5)]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="zuuLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1ed760" />
              <stop offset="60%" stopColor="#00e5ff" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
            <linearGradient id="zuuPulseGrad" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#1ed760" />
              <stop offset="100%" stopColor="#00e5ff" />
            </linearGradient>
          </defs>

          {/* Equalizer Wave in Background */}
          <rect x="20" y="42" width="5" height="16" rx="2.5" fill="url(#zuuPulseGrad)" opacity="0.4" />
          <rect x="75" y="38" width="5" height="24" rx="2.5" fill="url(#zuuPulseGrad)" opacity="0.4" />

          {/* Stylized 'Z' Letterform with Soundwave geometry */}
          <path
            d="M26 28 H74 L36 72 H74"
            stroke="url(#zuuLogoGrad)"
            strokeWidth="13"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />

          {/* Neon Sound Pulses */}
          <circle cx="74" cy="28" r="5" fill="#00e5ff" />
          <circle cx="26" cy="72" r="5" fill="#1ed760" />
        </svg>
      </div>

      {/* Brand Name Text if enabled */}
      {withText && (
        <div className="flex items-center gap-1.5">
          <span className={`tracking-tight bg-gradient-to-r from-white via-neutral-100 to-neutral-300 bg-clip-text text-transparent font-black ${textClassName}`}>
            Zuu <span className="bg-gradient-to-r from-[#1ed760] to-[#00e5ff] bg-clip-text text-transparent">Music</span>
          </span>
          <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded-full bg-gradient-to-r from-[#1ed760]/20 to-[#00e5ff]/20 text-[#00e5ff] border border-[#00e5ff]/30">
            VIP
          </span>
        </div>
      )}
    </div>
  );
};
