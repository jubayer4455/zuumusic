import React, { useState } from 'react';
import { X, Sparkles, Check, Crown, Zap, Shield, Music, Sliders } from 'lucide-react';
import { useMusic } from '../context/MusicContext';

export const ZuuVipModal = () => {
  const { isVipModalOpen, setIsVipModalOpen, showToast, triggerHaptic } = useMusic();
  const [selectedPlan, setSelectedPlan] = useState('individual'); // 'individual' | 'family' | 'student'

  if (!isVipModalOpen) return null;

  const handleActivatePlan = (planName) => {
    triggerHaptic('heavy');
    showToast(`Zuu VIP ${planName} Plan Activated! ✨ Enjoy 320kbps Master Audio`);
    setIsVipModalOpen(false);
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200 select-none"
      onClick={() => setIsVipModalOpen(false)}
    >
      <div 
        className="ios-glass-mini text-white w-full max-w-lg rounded-3xl p-6 shadow-2xl border border-white/20 flex flex-col relative overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Specular top reflection line */}
        <div className="absolute top-0 inset-x-8 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />

        {/* Close Button */}
        <button 
          onClick={() => setIsVipModalOpen(false)}
          className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-white rounded-full hover:bg-white/10 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex flex-col items-center text-center mt-1 mb-5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#1ed760] via-[#00f2fe] to-[#ec4899] p-1 shadow-xl shadow-emerald-500/25 flex items-center justify-center mb-3">
            <div className="w-full h-full bg-black/90 rounded-[12px] flex items-center justify-center">
              <Crown className="w-7 h-7 text-[#00f2fe]" />
            </div>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-[#1ed760] border border-emerald-500/30 text-xs font-bold mb-1">
            <Sparkles className="w-3.5 h-3.5 fill-[#1ed760]" />
            <span>Zuu VIP Member Status Active</span>
          </div>
          <h2 className="text-2xl font-black text-white">Experience Zuu Music VIP</h2>
          <p className="text-xs text-neutral-400 mt-1 max-w-sm">
            High-Resolution 320kbps Lossless Audio, Unlimited MP3 Downloads, and Studio Equalizer without limits.
          </p>
        </div>

        {/* Plan Cards Selector */}
        <div className="grid grid-cols-3 gap-2.5 mb-5">
          {/* Individual */}
          <div 
            onClick={() => setSelectedPlan('individual')}
            className={`p-3 rounded-2xl border cursor-pointer transition text-center relative ${
              selectedPlan === 'individual'
                ? 'bg-emerald-500/15 border-[#1ed760] shadow-lg shadow-emerald-500/15'
                : 'bg-white/5 border-white/10 hover:bg-white/10'
            }`}
          >
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#1ed760] block">Popular</span>
            <h4 className="font-bold text-sm text-white mt-0.5">Individual</h4>
            <div className="text-lg font-black text-white mt-1">Free</div>
            <span className="text-[10px] text-neutral-400">1 VIP Account</span>
          </div>

          {/* Family */}
          <div 
            onClick={() => setSelectedPlan('family')}
            className={`p-3 rounded-2xl border cursor-pointer transition text-center relative ${
              selectedPlan === 'family'
                ? 'bg-cyan-500/15 border-[#00f2fe] shadow-lg shadow-cyan-500/15'
                : 'bg-white/5 border-white/10 hover:bg-white/10'
            }`}
          >
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#00f2fe] block">Family</span>
            <h4 className="font-bold text-sm text-white mt-0.5">Family 6x</h4>
            <div className="text-lg font-black text-white mt-1">VIP</div>
            <span className="text-[10px] text-neutral-400">Up to 6 Accounts</span>
          </div>

          {/* Master Studio */}
          <div 
            onClick={() => setSelectedPlan('studio')}
            className={`p-3 rounded-2xl border cursor-pointer transition text-center relative ${
              selectedPlan === 'studio'
                ? 'bg-purple-500/15 border-purple-400 shadow-lg shadow-purple-500/15'
                : 'bg-white/5 border-white/10 hover:bg-white/10'
            }`}
          >
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 block">Audiophile</span>
            <h4 className="font-bold text-sm text-white mt-0.5">Hi-Fi Studio</h4>
            <div className="text-lg font-black text-white mt-1">Pro</div>
            <span className="text-[10px] text-neutral-400">Lossless Master</span>
          </div>
        </div>

        {/* VIP Perks Checklist */}
        <div className="space-y-2.5 mb-5 bg-white/5 rounded-2xl p-4 border border-white/10 text-xs">
          <div className="flex items-center gap-3 text-neutral-200">
            <div className="w-5 h-5 rounded-full bg-[#1ed760]/20 text-[#1ed760] flex items-center justify-center shrink-0">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </div>
            <span><strong>320kbps Master Lossless:</strong> Uncompressed crystal clear acoustics</span>
          </div>
          <div className="flex items-center gap-3 text-neutral-200">
            <div className="w-5 h-5 rounded-full bg-[#1ed760]/20 text-[#1ed760] flex items-center justify-center shrink-0">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </div>
            <span><strong>Offline Unlimited Downloads:</strong> Play music without data or WiFi</span>
          </div>
          <div className="flex items-center gap-3 text-neutral-200">
            <div className="w-5 h-5 rounded-full bg-[#1ed760]/20 text-[#1ed760] flex items-center justify-center shrink-0">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </div>
            <span><strong>Zero Audio Ads:</strong> Uninterrupted music flow from first note</span>
          </div>
          <div className="flex items-center gap-3 text-neutral-200">
            <div className="w-5 h-5 rounded-full bg-[#1ed760]/20 text-[#1ed760] flex items-center justify-center shrink-0">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </div>
            <span><strong>Screen Lock & Background Play:</strong> Never stops when phone sleeps</span>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => handleActivatePlan(selectedPlan.toUpperCase())}
          className="w-full py-3.5 px-4 rounded-full bg-gradient-to-r from-[#1ed760] to-[#00f2fe] text-black font-black text-sm shadow-xl shadow-emerald-500/30 flex items-center justify-center gap-2 active:scale-95 transition-all"
        >
          <Sparkles className="w-4 h-4 fill-black" />
          <span>Apply VIP Privileges (Active)</span>
        </button>
      </div>
    </div>
  );
};
