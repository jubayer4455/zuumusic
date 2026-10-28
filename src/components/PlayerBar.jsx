import React, { useRef } from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Shuffle, 
  Repeat, 
  Repeat1, 
  Heart, 
  Volume2, 
  Volume1, 
  VolumeX, 
  Mic2, 
  ListMusic, 
  Maximize2,
  Laptop2,
  Video,
  Moon,
  Sliders,
  Keyboard
} from 'lucide-react';
import { useMusic } from '../context/MusicContext';
import { AudioVisualizer } from './AudioVisualizer';

export const PlayerBar = () => {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isShuffle,
    repeatMode,
    isLiked,
    isLyricsOpen,
    isQueueOpen,
    isVideoMode,
    setIsVideoMode,
    setIsLyricsOpen,
    setIsQueueOpen,
    setIsSleepTimerOpen,
    sleepTimerSecondsLeft,
    isSleepTimerEndOfTrack,
    setIsEqualizerOpen,
    eqPreset,
    setIsShortcutsOpen,
    setIsDeviceModalOpen,
    connectedDevice,
    playTrack,
    togglePlay,
    handleNextTrack,
    handlePrevTrack,
    seekTo,
    setVolumeLevel,
    toggleMute,
    toggleShuffle,
    toggleRepeat,
    toggleLike,
    formatTime,
    showToast
  } = useMusic();

  if (!currentTrack) return null;

  // Percentage for track progress bar
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const volumePercent = isMuted ? 0 : volume * 100;

  return (
    <footer className="hidden md:flex items-center justify-between h-20 px-6 ios-glass-header border-t border-white/10 select-none text-white z-40 fixed bottom-0 left-0 right-0 shadow-[0_-12px_40px_rgba(0,0,0,0.6)]">
      {/* Top Specular Glass Highlight */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
      {/* ---------------- 1. Left: Track Info & Like ---------------- */}
      <div className="flex items-center gap-3.5 w-1/4 min-w-[200px]">
        <div className="relative group w-14 h-14 rounded-md overflow-hidden bg-neutral-900 shadow shrink-0">
          <img 
            src={currentTrack.cover} 
            alt={currentTrack.title} 
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex flex-col min-w-0 pr-2">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-sm truncate hover:underline cursor-pointer text-white">
              {currentTrack.title}
            </span>
            <span className="text-[8px] px-1.5 py-0.5 bg-emerald-500/20 text-[#1ed760] border border-[#1ed760]/30 rounded font-extrabold shrink-0">
              Master 320k
            </span>
          </div>
          <span className="text-xs text-neutral-400 truncate hover:underline hover:text-white cursor-pointer mt-0.5">
            {currentTrack.artist}
          </span>
        </div>

        <button 
          onClick={() => toggleLike(currentTrack.id)}
          className={`p-1.5 transition hover:scale-110 ${
            isLiked(currentTrack.id) ? 'text-[#1ed760]' : 'text-neutral-400 hover:text-white'
          }`}
          title={isLiked(currentTrack.id) ? "Remove from Liked Songs" : "Save to Liked Songs"}
        >
          <Heart className={`w-5 h-5 ${isLiked(currentTrack.id) ? 'fill-[#1ed760]' : ''}`} />
        </button>

        {/* Compact dancing visualizer next to track info */}
        <div className="hidden xl:flex items-center ml-1">
          <AudioVisualizer compact={true} height={20} barCount={14} />
        </div>
      </div>

      {/* ---------------- 2. Center: Controls & Seekbar ---------------- */}
      <div className="flex flex-col items-center gap-1.5 w-2/4 max-w-xl">
        {/* Buttons Row */}
        <div className="flex items-center gap-5">
          {/* Shuffle */}
          <button 
            onClick={toggleShuffle}
            className={`p-1 transition relative ${
              isShuffle ? 'text-[#1ed760]' : 'text-neutral-400 hover:text-white'
            }`}
            title="Enable shuffle"
          >
            <Shuffle className="w-4 h-4" />
            {isShuffle && <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#1ed760]"></span>}
          </button>

          {/* Previous Track */}
          <button 
            onClick={handlePrevTrack}
            className="text-neutral-400 hover:text-white transition active:scale-95"
            title="Previous"
          >
            <SkipBack className="w-5 h-5 fill-current" />
          </button>

          {/* Play / Pause Main Button */}
          <button 
            onClick={togglePlay}
            className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 active:scale-95 transition shadow-md"
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-black" />
            ) : (
              <Play className="w-4 h-4 fill-black ml-0.5" />
            )}
          </button>

          {/* Next Track */}
          <button 
            onClick={handleNextTrack}
            className="text-neutral-400 hover:text-white transition active:scale-95"
            title="Next"
          >
            <SkipForward className="w-5 h-5 fill-current" />
          </button>

          {/* Repeat */}
          <button 
            onClick={toggleRepeat}
            className={`p-1 transition relative ${
              repeatMode !== 'off' ? 'text-[#1ed760]' : 'text-neutral-400 hover:text-white'
            }`}
            title="Repeat"
          >
            {repeatMode === 'one' ? (
              <Repeat1 className="w-4 h-4" />
            ) : (
              <Repeat className="w-4 h-4" />
            )}
            {repeatMode !== 'off' && <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#1ed760]"></span>}
          </button>
        </div>

        {/* Seekbar & Timestamps */}
        <div className="flex items-center gap-2.5 w-full text-xs text-neutral-400 font-mono">
          <span className="w-9 text-right text-[11px] select-none">{formatTime(currentTime)}</span>
          
          <div className="relative flex-1 flex items-center group cursor-pointer h-3">
            <div className="w-full h-1 bg-neutral-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white group-hover:bg-[#1ed760] transition-colors"
                style={{ width: `${progressPercent}%` }}
              ></div>
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

          <span className="w-9 text-left text-[11px] select-none">{formatTime(duration)}</span>
        </div>
      </div>

      {/* ---------------- 3. Right: Lyrics, Queue, Volume ---------------- */}
      <div className="flex items-center justify-end gap-3 w-1/4 min-w-[200px]">
        {/* Video / Canvas Mode Button (Active when track is YouTube) */}
        {currentTrack.isYouTube && (
          <button 
            onClick={() => {
              setIsVideoMode(!isVideoMode);
              showToast(!isVideoMode ? "Music Video Canvas enabled" : "Video minimized to background audio");
            }}
            className={`p-1.5 transition hover:scale-105 flex items-center gap-1 text-xs rounded-full px-2 py-1 ${
              isVideoMode 
                ? 'bg-rose-600 text-white font-bold' 
                : 'bg-white/10 text-neutral-300 hover:text-white hover:bg-white/20'
            }`}
            title="Toggle Video Canvas"
          >
            <Video className="w-3.5 h-3.5" />
            <span className="hidden xl:inline text-[11px]">Canvas</span>
          </button>
        )}

        {/* Sleep Timer Button */}
        <button 
          onClick={() => setIsSleepTimerOpen(true)}
          className={`p-1.5 transition hover:scale-105 flex items-center gap-1.5 rounded-full px-2 py-1 text-xs ${
            sleepTimerSecondsLeft !== null || isSleepTimerEndOfTrack
              ? 'bg-indigo-600/40 text-indigo-300 border border-indigo-500/40 font-bold'
              : 'text-neutral-400 hover:text-white'
          }`}
          title="Sleep Timer"
        >
          <Moon className={`w-4 h-4 ${sleepTimerSecondsLeft !== null || isSleepTimerEndOfTrack ? 'fill-current' : ''}`} />
          {sleepTimerSecondsLeft !== null && (
            <span className="font-mono text-[11px]">{formatTime(sleepTimerSecondsLeft)}</span>
          )}
          {isSleepTimerEndOfTrack && (
            <span className="text-[10px]">End</span>
          )}
        </button>

        {/* Studio Equalizer (EQ) Button */}
        <button 
          onClick={() => setIsEqualizerOpen(true)}
          className={`p-1.5 transition hover:scale-105 flex items-center gap-1 rounded-full px-2 py-1 text-xs ${
            eqPreset !== 'flat' 
              ? 'bg-[#1ed760]/20 text-[#1ed760] border border-[#1ed760]/40 font-bold' 
              : 'text-neutral-400 hover:text-white'
          }`}
          title="Studio Equalizer (EQ)"
        >
          <Sliders className="w-3.5 h-3.5" />
          <span className="hidden xl:inline text-[10px] uppercase font-bold tracking-wider">{eqPreset}</span>
        </button>

        {/* Keyboard Shortcuts Button */}
        <button 
          onClick={() => setIsShortcutsOpen(true)}
          className="p-1.5 text-neutral-400 hover:text-white transition hidden lg:block"
          title="Keyboard Shortcuts (?)"
        >
          <Keyboard className="w-4 h-4" />
        </button>

        {/* Lyrics Button */}
        <button 
          onClick={() => setIsLyricsOpen(!isLyricsOpen)}
          className={`p-1.5 transition hover:scale-105 ${
            isLyricsOpen ? 'text-[#1ed760]' : 'text-neutral-400 hover:text-white'
          }`}
          title="Lyrics"
        >
          <Mic2 className="w-4 h-4" />
        </button>

        {/* Queue Button */}
        <button 
          onClick={() => setIsQueueOpen(!isQueueOpen)}
          className={`p-1.5 transition hover:scale-105 ${
            isQueueOpen ? 'text-[#1ed760]' : 'text-neutral-400 hover:text-white'
          }`}
          title="Queue"
        >
          <ListMusic className="w-4 h-4" />
        </button>

        {/* Device Connect */}
        <button 
          onClick={() => setIsDeviceModalOpen(true)}
          className={`p-1.5 transition ${connectedDevice !== 'current' ? 'text-[#1ed760]' : 'text-neutral-400 hover:text-white'}`}
          title="Connect to a device"
        >
          <Laptop2 className="w-4 h-4" />
        </button>

        {/* Volume Mute & Slider */}
        <div className="flex items-center gap-2">
          <button 
            onClick={toggleMute}
            className="text-neutral-400 hover:text-white transition p-1"
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-4 h-4 text-rose-500" />
            ) : volume < 0.5 ? (
              <Volume1 className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>

          <div className="relative w-24 flex items-center group cursor-pointer h-3">
            <div className="w-full h-1 bg-neutral-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white group-hover:bg-[#1ed760] transition-colors"
                style={{ width: `${volumePercent}%` }}
              ></div>
            </div>
            <input 
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={(e) => setVolumeLevel(parseFloat(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
        </div>

        {/* Fullscreen Button */}
        <button 
          onClick={() => {
            if (!document.fullscreenElement) {
              document.documentElement.requestFullscreen().catch(() => {});
            } else {
              document.exitFullscreen().catch(() => {});
            }
          }}
          className="p-1.5 text-neutral-400 hover:text-white transition"
          title="Full screen"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>
    </footer>
  );
};
