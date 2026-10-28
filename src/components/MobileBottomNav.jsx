import React from 'react';
import { Home, Search, Library, Sparkles } from 'lucide-react';
import { useMusic } from '../context/MusicContext';

export const MobileBottomNav = () => {
  const { activeView, setActiveView, showToast, triggerHaptic, setIsVipModalOpen } = useMusic();

  const handleNav = (viewName) => {
    triggerHaptic('light');
    setActiveView(viewName);
  };

  return (
    <div className="md:hidden fixed bottom-3 left-4 right-4 z-40 select-none pb-[env(safe-area-inset-bottom)]">
      {/* iOS Liquid Glass Floating Pill Dock */}
      <nav className="h-16 ios-glass-nav rounded-[24px] flex items-center justify-around px-2 relative overflow-hidden">
        {/* Top subtle light refraction line */}
        <div className="absolute top-0 inset-x-6 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />

        {/* Home Tab */}
        <button
          onClick={() => handleNav('home')}
          className={`flex flex-col items-center justify-center gap-0.5 py-1 px-3.5 rounded-2xl transition-all duration-200 active:scale-90 ${
            activeView === 'home' 
              ? 'text-white bg-white/15 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]' 
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Home className={`w-5 h-5 ${activeView === 'home' ? 'text-[#1ed760] drop-shadow-[0_0_8px_rgba(30,215,96,0.6)]' : ''}`} />
          <span className={`text-[10px] font-bold ${activeView === 'home' ? 'text-white' : ''}`}>Home</span>
        </button>

        {/* Search Tab */}
        <button
          onClick={() => handleNav('search')}
          className={`flex flex-col items-center justify-center gap-0.5 py-1 px-3.5 rounded-2xl transition-all duration-200 active:scale-90 ${
            activeView === 'search' 
              ? 'text-white bg-white/15 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]' 
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Search className={`w-5 h-5 ${activeView === 'search' ? 'text-[#00f2fe] drop-shadow-[0_0_8px_rgba(0,242,254,0.6)]' : ''}`} />
          <span className={`text-[10px] font-bold ${activeView === 'search' ? 'text-white' : ''}`}>Search</span>
        </button>

        {/* Library Tab */}
        <button
          onClick={() => handleNav('library')}
          className={`flex flex-col items-center justify-center gap-0.5 py-1 px-3.5 rounded-2xl transition-all duration-200 active:scale-90 ${
            activeView === 'library' 
              ? 'text-white bg-white/15 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]' 
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Library className={`w-5 h-5 ${activeView === 'library' ? 'text-[#a855f7] drop-shadow-[0_0_8px_rgba(168,85,247,0.6)]' : ''}`} />
          <span className={`text-[10px] font-bold ${activeView === 'library' ? 'text-white' : ''}`}>Library</span>
        </button>

        {/* VIP Tab */}
        <button
          onClick={() => {
            triggerHaptic('medium');
            setIsVipModalOpen(true);
          }}
          className="flex flex-col items-center justify-center gap-0.5 py-1 px-3 rounded-2xl text-neutral-400 hover:text-white transition-all active:scale-90"
        >
          <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-[#1ed760] via-[#00f2fe] to-[#ec4899] flex items-center justify-center text-black font-black text-[9px] shadow-md shadow-emerald-500/20">
            Z
          </div>
          <span className="text-[10px] font-extrabold text-[#00f2fe]">VIP</span>
        </button>
      </nav>
    </div>
  );
};
