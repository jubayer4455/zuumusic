import React from 'react';
import { DownloadCloud, ShieldCheck, WifiOff, HardDrive, X, Check } from 'lucide-react';
import { useMusic } from '../context/MusicContext';

export const OfflineDownloadPermissionModal = () => {
  const {
    isDownloadPermissionModalOpen,
    setIsDownloadPermissionModalOpen,
    confirmDownloadPermission,
    pendingDownloadTrack
  } = useMusic();

  if (!isDownloadPermissionModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200 select-none">
      <div 
        className="ios-glass-mini text-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-white/20 flex flex-col relative overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-20 bg-emerald-500/20 blur-2xl pointer-events-none rounded-full" />

        {/* Close Button */}
        <button 
          onClick={() => setIsDownloadPermissionModalOpen(false)}
          className="absolute top-5 right-5 p-2 text-neutral-400 hover:text-white rounded-full hover:bg-white/10 transition"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon & Title */}
        <div className="flex flex-col items-center text-center mt-2 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500/30 to-[#00f2fe]/20 border border-[#1ed760]/40 flex items-center justify-center shadow-lg shadow-emerald-500/20 mb-4">
            <DownloadCloud className="w-8 h-8 text-[#1ed760]" />
          </div>
          <h2 className="text-xl font-extrabold text-white tracking-tight">
            Allow Offline Storage?
          </h2>
          <p className="text-xs text-neutral-300 mt-1 max-w-xs leading-relaxed">
            Allow Zuu Music to save songs directly to your device storage for seamless offline listening.
          </p>
        </div>

        {/* Benefits list */}
        <div className="space-y-3 bg-white/[0.04] border border-white/10 rounded-2xl p-4 mb-6 text-xs text-neutral-200">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
              <WifiOff className="w-3.5 h-3.5 text-[#1ed760]" />
            </div>
            <div>
              <p className="font-bold text-white">100% Offline Playback</p>
              <p className="text-neutral-400 text-[11px]">Listen when you have no WiFi or mobile data.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-lg bg-cyan-500/20 flex items-center justify-center shrink-0 mt-0.5">
              <HardDrive className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div>
              <p className="font-bold text-white">Stored Locally in App</p>
              <p className="text-neutral-400 text-[11px]">Plays instantly from internal device storage.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-lg bg-purple-500/20 flex items-center justify-center shrink-0 mt-0.5">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
            </div>
            <div>
              <p className="font-bold text-white">One-Time Permission</p>
              <p className="text-neutral-400 text-[11px]">You will not be asked again after enabling.</p>
            </div>
          </div>
        </div>

        {/* Song preview badge */}
        {pendingDownloadTrack && (
          <div className="flex items-center gap-2.5 bg-neutral-900/80 border border-white/10 rounded-xl p-2.5 mb-5">
            <img 
              src={pendingDownloadTrack.cover} 
              alt={pendingDownloadTrack.title} 
              className="w-10 h-10 rounded-lg object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white truncate">{pendingDownloadTrack.title}</p>
              <p className="text-[11px] text-neutral-400 truncate">{pendingDownloadTrack.artist}</p>
            </div>
            <span className="text-[10px] bg-emerald-500/20 text-[#1ed760] px-2 py-0.5 rounded font-bold">
              Ready
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col gap-2">
          <button
            onClick={confirmDownloadPermission}
            className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#1ed760] to-emerald-500 text-black font-extrabold text-sm hover:scale-[1.02] active:scale-95 transition shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            Allow & Start Download
          </button>

          <button
            onClick={() => setIsDownloadPermissionModalOpen(false)}
            className="w-full py-2.5 rounded-full text-neutral-400 hover:text-white font-semibold text-xs transition cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
