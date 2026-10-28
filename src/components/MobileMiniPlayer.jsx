import React from 'react';
import { Play, Pause, Heart, Download, CheckCircle2 } from 'lucide-react';
import { useMusic } from '../context/MusicContext';

export const MobileMiniPlayer = () => {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    togglePlay,
    isLiked,
    toggleLike,
    downloadTrack,
    isDownloaded,
    setIsMobileNowPlayingOpen,
    triggerHaptic
  } = useMusic();

  if (!currentTrack) return null;

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleOpen = () => {
    triggerHaptic('light');
    setIsMobileNowPlayingOpen(true);
  };

  return (
    <div 
      onClick={handleOpen}
      className="md:hidden fixed bottom-21 left-3.5 right-3.5 ios-glass-mini text-white rounded-2xl p-2.5 z-40 flex items-center justify-between cursor-pointer overflow-hidden transition-transform duration-150 active:scale-[0.98]"
    >
      {/* Specular top reflection line */}
      <div className="absolute top-0 inset-x-4 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />

      {/* Liquid Progress Bar at bottom */}
      <div 
        className="absolute bottom-0 left-0 h-[2.5px] bg-gradient-to-r from-[#1ed760] via-[#00f2fe] to-[#1ed760] shadow-[0_0_8px_#1ed760] transition-all duration-300"
        style={{ width: `${progressPercent}%` }}
      />

      {/* Left: Thumbnail & Song Name */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className="relative w-11 h-11 rounded-xl overflow-hidden shadow-md shrink-0 border border-white/10">
          <img 
            src={currentTrack.cover} 
            alt={currentTrack.title} 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="min-w-0 pr-2">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-xs truncate text-white">
              {currentTrack.title}
            </span>
          </div>
          <div className="text-[11px] text-neutral-400 truncate mt-0.5">
            {currentTrack.artist}
          </div>
        </div>
      </div>

      {/* Right: Download, Like & Play/Pause */}
      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
        {/* Direct Download Button */}
        <button 
          onClick={() => {
            triggerHaptic('medium');
            downloadTrack(currentTrack);
          }}
          className={`p-1.5 rounded-full transition-all active:scale-90 ${
            isDownloaded(currentTrack.id) ? 'text-[#00e5ff]' : 'text-neutral-400 hover:text-white'
          }`}
          title="Download to Phone"
        >
          {isDownloaded(currentTrack.id) ? (
            <CheckCircle2 className="w-5 h-5 text-[#00e5ff]" />
          ) : (
            <Download className="w-4 h-4" />
          )}
        </button>

        {/* Like Button */}
        <button 
          onClick={() => {
            triggerHaptic('light');
            toggleLike(currentTrack.id);
          }}
          className={`p-1.5 rounded-full transition-all active:scale-90 ${
            isLiked(currentTrack.id) ? 'text-[#1ed760]' : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Heart className={`w-4 h-4 ${isLiked(currentTrack.id) ? 'fill-[#1ed760]' : ''}`} />
        </button>

        {/* Play/Pause Button */}
        <button 
          onClick={() => {
            triggerHaptic('medium');
            togglePlay();
          }}
          className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center shadow-lg active:scale-90 transition-all hover:scale-105"
        >
          {isPlaying ? (
            <Pause className="w-4 h-4 fill-black" />
          ) : (
            <Play className="w-4 h-4 fill-black ml-0.5" />
          )}
        </button>
      </div>
    </div>
  );
};
