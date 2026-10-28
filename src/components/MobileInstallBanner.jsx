import React, { useState } from 'react';
import { Smartphone, Download, X, Sparkles, CheckCircle } from 'lucide-react';
import { useMusic } from '../context/MusicContext';

export const MobileInstallBanner = () => {
  const { triggerInstallApp, isPwaInstalled } = useMusic();
  const [isDismissed, setIsDismissed] = useState(false);

  // If already installed or dismissed, don't show
  if (isPwaInstalled || isDismissed) return null;

  return (
    <div className="md:hidden sticky top-0 z-40 ios-glass-header px-3.5 py-2.5 border-b border-white/10 flex items-center justify-between text-xs select-none shadow-lg pt-[max(0.6rem,env(safe-area-inset-top))]">
      <div className="flex items-center gap-2.5 min-w-0 pr-2">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#1ed760] to-[#00f2fe] flex items-center justify-center text-black font-black text-xs shrink-0 shadow-md">
          Z
        </div>
        <div className="min-w-0">
          <div className="font-extrabold text-white text-[12px] truncate flex items-center gap-1">
            Install Zuu Native PWA 📱
          </div>
          <p className="text-[10px] text-neutral-300 truncate">
            Ultra-smooth iOS Glass UI • Background audio
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        <button
          onClick={triggerInstallApp}
          className="bg-white text-black font-extrabold px-3.5 py-1.5 rounded-full text-[11px] shadow-lg transition active:scale-95 flex items-center gap-1"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Install</span>
        </button>
        <button
          onClick={() => setIsDismissed(true)}
          className="p-1 text-neutral-400 hover:text-white"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
