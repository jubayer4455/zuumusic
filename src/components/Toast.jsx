import React from 'react';
import { useMusic } from '../context/MusicContext';

export const Toast = () => {
  const { toastMessage } = useMusic();

  if (!toastMessage) return null;

  return (
    <div className="fixed top-4 md:top-6 left-1/2 -translate-x-1/2 z-50 ios-glass-mini text-white font-extrabold text-xs sm:text-sm px-5 py-2.5 rounded-full border border-white/20 shadow-[0_12px_36px_rgba(0,0,0,0.7)] flex items-center gap-2.5 animate-in fade-in slide-in-from-top-3 duration-250 select-none">
      <span className="w-2 h-2 rounded-full bg-[#1ed760] animate-pulse shadow-[0_0_8px_#1ed760]" />
      <span className="tracking-tight">{toastMessage}</span>
    </div>
  );
};
