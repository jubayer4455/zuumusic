import React, { useState } from 'react';
import { 
  ChevronDown, 
  MoreVertical, 
  Heart, 
  Shuffle, 
  SkipBack, 
  Play, 
  Pause, 
  SkipForward, 
  Repeat, 
  Repeat1, 
  Share2, 
  Laptop2,
  Mic2,
  ChevronUp,
  Moon,
  Download,
  CheckCircle2,
  Sliders,
  Sparkles
} from 'lucide-react';
import { useMusic } from '../context/MusicContext';
import { AudioVisualizer } from './AudioVisualizer';

export const MobileNowPlayingModal = () => {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    isShuffle,
    repeatMode,
    isLiked,
    isMobileNowPlayingOpen,
    setIsMobileNowPlayingOpen,
    setIsSleepTimerOpen,
    sleepTimerSecondsLeft,
    isSleepTimerEndOfTrack,
    setIsEqualizerOpen,
    setIsDeviceModalOpen,
    connectedDevice,
    eqPreset,
    downloadTrack,
    triggerHaptic,
    isDownloaded,
    togglePlay,
    handleNextTrack,
    handlePrevTrack,
    seekTo,
    toggleShuffle,
    toggleRepeat,
    toggleLike,
    formatTime,
    showToast
  } = useMusic();

  const [showLyricsExpanded, setShowLyricsExpanded] = useState(false);

  if (!isMobileNowPlayingOpen || !currentTrack) return null;

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="md:hidden fixed inset-0 z-50 text-white flex flex-col justify-between p-6 select-none overflow-y-auto animate-in slide-in-from-bottom duration-300 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))]">
      {/* iOS Liquid Glass Dynamic Ambient Background */}
      <div 
        className="absolute inset-0 -z-20 bg-cover bg-center filter blur-3xl opacity-45 scale-125 transition-all duration-1000 pointer-events-none"
        style={{ backgroundImage: `url(${currentTrack.cover})` }}
      />
      <div className="absolute inset-0 -z-10 bg-black/65 backdrop-blur-3xl pointer-events-none" />

      {/* iOS Top Swipe Handle Indicator */}
      <div className="w-12 h-1.5 rounded-full bg-white/25 mx-auto mb-2 shrink-0" />

      {/* 1. Header */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => {
            triggerHaptic('light');
            setIsMobileNowPlayingOpen(false);
          }}
          className="p-2 text-white/80 hover:text-white rounded-full active:scale-90 transition-all"
        >
          <ChevronDown className="w-7 h-7" />
        </button>

        <div className="text-center">
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#00e5ff] block flex items-center justify-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1ed760] animate-pulse"></span>
            Playing On Zuu Music
          </span>
          <span className="text-xs font-bold text-white truncate max-w-[200px] block">
            {currentTrack.album || "Today's Top Hits"}
          </span>
        </div>

        <button 
          onClick={() => {
            triggerHaptic('light');
            showToast("Zuu Master Audio • 320kbps Lossless");
          }}
          className="p-2 text-white/80 hover:text-white rounded-full active:scale-90 transition-all"
        >
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      {/* 2. Center: Large Artwork or Synced Lyrics */}
      <div className="my-auto py-3 flex flex-col items-center">
        {!showLyricsExpanded ? (
          <div className="w-full flex flex-col items-center">
            <div className="w-full aspect-square max-w-sm rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-white/10">
              <img 
                src={currentTrack.cover} 
                alt={currentTrack.title} 
                className="w-full h-full object-cover"
              />
            </div>
            {/* Live dancing visualizer underneath artwork */}
            <div className="w-full max-w-sm mt-4 px-2">
              <AudioVisualizer compact={false} height={28} barCount={28} />
            </div>
          </div>
        ) : (
          <div className="w-full h-80 bg-neutral-900/90 backdrop-blur rounded-2xl p-5 overflow-y-auto space-y-3.5 text-center border border-white/10">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <span className="text-[10px] uppercase font-extrabold tracking-widest text-[#1ed760] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#1ed760] animate-pulse"></span>
                Synced Karaoke Lyrics
              </span>
              <span className="text-[10px] text-neutral-400">Tap to seek</span>
            </div>

            {currentTrack.lyrics && currentTrack.lyrics.length > 0 ? (
              currentTrack.lyrics.map((line, idx) => {
                const totalLines = currentTrack.lyrics.length;
                const lineTime = (duration && duration > 0) ? (duration / totalLines) * idx : idx * 15;
                const nextLineTime = (duration && duration > 0) ? (duration / totalLines) * (idx + 1) : (idx + 1) * 15;
                const isActive = currentTime >= lineTime && (idx === totalLines - 1 || currentTime < nextLineTime);

                return (
                  <div
                    key={idx}
                    onClick={() => {
                      seekTo(lineTime);
                      showToast(`Seeked to verse ${idx + 1} 🎵`);
                    }}
                    className={`cursor-pointer transition-all duration-300 py-2 px-3 rounded-xl select-none ${
                      isActive 
                        ? 'text-white text-base font-black bg-white/15 scale-[1.02] shadow-lg border-l-4 border-[#1ed760]' 
                        : 'text-neutral-400 font-semibold text-sm hover:text-white'
                    }`}
                  >
                    <p className={isActive ? 'text-[#1ed760]' : ''}>{line}</p>
                    {isActive && (
                      <span className="text-[9px] text-[#00f2fe] font-mono tracking-wider block mt-1">
                        Singing Now • {Math.floor(lineTime / 60)}:{(Math.floor(lineTime % 60)).toString().padStart(2, '0')}
                      </span>
                    )}
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-neutral-500 py-12">No lyrics available for this track.</p>
            )}
          </div>
        )}
      </div>

      {/* 3. Bottom Controls Section */}
      <div className="space-y-4">
        {/* Title, Artist, & Like */}
        <div className="flex items-center justify-between">
          <div className="min-w-0 pr-4">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-white truncate">
                {currentTrack.title}
              </h2>
              <span className="text-[10px] px-2 py-0.5 bg-emerald-500/20 text-[#1ed760] border border-[#1ed760]/30 rounded font-bold shrink-0">
                Lossless 320k
              </span>
            </div>
            <p className="text-sm text-neutral-400 truncate mt-0.5">
              {currentTrack.artist}
            </p>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Direct Mobile Download Button */}
            <button 
              onClick={() => downloadTrack(currentTrack)}
              className={`p-2 transition active:scale-95 ${
                isDownloaded(currentTrack.id) ? 'text-[#00e5ff]' : 'text-neutral-400 hover:text-white'
              }`}
              title="Download to Phone"
            >
              {isDownloaded(currentTrack.id) ? (
                <CheckCircle2 className="w-7 h-7 text-[#00e5ff] fill-[#00e5ff]/20" />
              ) : (
                <Download className="w-7 h-7" />
              )}
            </button>

            {/* Like Button */}
            <button 
              onClick={() => toggleLike(currentTrack.id)}
              className={`p-2 transition active:scale-95 ${isLiked(currentTrack.id) ? 'text-[#1ed760]' : 'text-neutral-400'}`}
            >
              <Heart className={`w-7 h-7 ${isLiked(currentTrack.id) ? 'fill-[#1ed760]' : ''}`} />
            </button>
          </div>
        </div>

        {/* Seekbar */}
        <div className="space-y-1.5">
          <div className="relative flex items-center group cursor-pointer h-5">
            <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#1ed760] via-[#00f2fe] to-[#1ed760] shadow-[0_0_10px_#1ed760] transition-all"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <input 
              type="range"
              min="0"
              max={duration || 100}
              value={currentTime}
              onChange={(e) => seekTo(parseFloat(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
          <div className="flex items-center justify-between text-xs text-neutral-400 font-mono">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Action Controls - iOS Liquid Glass Buttons */}
        <div className="flex items-center justify-between px-2 pt-1">
          {/* Shuffle */}
          <button 
            onClick={() => {
              triggerHaptic('light');
              toggleShuffle();
            }}
            className={`p-2.5 rounded-full transition-all active:scale-90 relative ${isShuffle ? 'text-[#1ed760]' : 'text-neutral-400'}`}
          >
            <Shuffle className="w-5 h-5" />
            {isShuffle && <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#1ed760] rounded-full shadow-[0_0_6px_#1ed760]"></span>}
          </button>

          {/* Prev */}
          <button 
            onClick={() => {
              triggerHaptic('medium');
              handlePrevTrack();
            }}
            className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-white flex items-center justify-center hover:scale-105 active:scale-90 transition shadow-md"
          >
            <SkipBack className="w-5 h-5 fill-current" />
          </button>

          {/* Big Play/Pause */}
          <button 
            onClick={() => {
              triggerHaptic('heavy');
              togglePlay();
            }}
            className="w-18 h-18 rounded-full bg-white text-black flex items-center justify-center active:scale-90 transition-all shadow-[0_12px_36px_rgba(255,255,255,0.35)] hover:scale-105"
          >
            {isPlaying ? (
              <Pause className="w-8 h-8 fill-black" />
            ) : (
              <Play className="w-8 h-8 fill-black ml-1" />
            )}
          </button>

          {/* Next */}
          <button 
            onClick={() => {
              triggerHaptic('medium');
              handleNextTrack();
            }}
            className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-white flex items-center justify-center hover:scale-105 active:scale-90 transition shadow-md"
          >
            <SkipForward className="w-5 h-5 fill-current" />
          </button>

          {/* Repeat */}
          <button 
            onClick={() => {
              triggerHaptic('light');
              toggleRepeat();
            }}
            className={`p-2.5 rounded-full transition-all active:scale-90 relative ${repeatMode !== 'off' ? 'text-[#1ed760]' : 'text-neutral-400'}`}
          >
            {repeatMode === 'one' ? (
              <Repeat1 className="w-5 h-5" />
            ) : (
              <Repeat className="w-5 h-5" />
            )}
            {repeatMode !== 'off' && <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#1ed760] rounded-full shadow-[0_0_6px_#1ed760]"></span>}
          </button>
        </div>

        {/* Bottom Bar: Device, EQ, & Lyrics toggle */}
        <div className="flex items-center justify-between pt-3 border-t border-white/10">
          <button 
            onClick={() => {
              triggerHaptic('light');
              setIsDeviceModalOpen(true);
            }}
            className="flex items-center gap-1.5 text-xs text-neutral-400 active:scale-95 transition"
          >
            <Laptop2 className="w-4 h-4 text-[#1ed760]" />
            <span className="text-[#1ed760] font-medium hidden sm:inline">
              {connectedDevice === 'current' ? 'Phone' : connectedDevice}
            </span>
          </button>

          {/* Studio Equalizer Button */}
          <button 
            onClick={() => {
              triggerHaptic('light');
              setIsEqualizerOpen(true);
            }}
            className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-full border transition-all active:scale-90 ${
              eqPreset !== 'flat' 
                ? 'bg-[#1ed760]/25 text-[#1ed760] border-[#1ed760] font-bold shadow-[0_0_10px_rgba(30,215,96,0.3)]' 
                : 'ios-liquid-pill text-white'
            }`}
            title="Studio Equalizer"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>{eqPreset !== 'flat' ? eqPreset.toUpperCase() : 'EQ'}</span>
          </button>

          <button 
            onClick={() => {
              triggerHaptic('light');
              setShowLyricsExpanded(!showLyricsExpanded);
            }}
            className={`flex items-center gap-1 text-xs px-3.5 py-1.5 rounded-full border transition-all active:scale-90 ${
              showLyricsExpanded ? 'bg-[#1ed760] text-black border-[#1ed760] font-extrabold shadow-[0_0_12px_rgba(30,215,96,0.4)]' : 'ios-liquid-pill text-white'
            }`}
          >
            <Mic2 className="w-3.5 h-3.5" />
            <span>Lyrics</span>
          </button>

          <button 
            onClick={() => {
              triggerHaptic('light');
              setIsSleepTimerOpen(true);
            }}
            className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-full border transition-all active:scale-90 ${
              sleepTimerSecondsLeft !== null || isSleepTimerEndOfTrack
                ? 'bg-indigo-600/40 text-indigo-300 border-indigo-500 font-bold'
                : 'ios-liquid-pill text-white'
            }`}
            title="Sleep Timer"
          >
            <Moon className="w-3.5 h-3.5" />
            <span>
              {sleepTimerSecondsLeft !== null 
                ? formatTime(sleepTimerSecondsLeft) 
                : isSleepTimerEndOfTrack ? 'End' : 'Timer'}
            </span>
          </button>

          <button 
            onClick={() => {
              triggerHaptic('light');
              showToast("Link copied to clipboard!");
            }}
            className="p-1.5 text-neutral-400 hover:text-white rounded-full active:scale-90"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
