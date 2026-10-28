import React from 'react';
import { X, Heart, Play, Music, Sparkles, UserCheck } from 'lucide-react';
import { useMusic } from '../context/MusicContext';

export const RightSidebar = () => {
  const {
    currentTrack,
    currentPlaylist,
    isQueueOpen,
    isLyricsOpen,
    setIsQueueOpen,
    setIsLyricsOpen,
    playTrack,
    isLiked,
    toggleLike,
    showToast,
    currentTime,
    duration,
    seekTo,
    followingArtists,
    toggleFollowArtist
  } = useMusic();

  if (!isQueueOpen && !isLyricsOpen) return null;

  return (
    <aside className="hidden xl:flex flex-col w-80 h-full p-2 select-none shrink-0 bg-transparent text-white text-sm">
      <div className="bg-white/[0.04] backdrop-blur-2xl border border-white/10 rounded-2xl flex-1 flex flex-col min-h-0 overflow-hidden p-4 shadow-xl">
        {/* Header with Title and Close Button */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
          <h3 className="font-bold text-base text-white">
            {isLyricsOpen ? 'Lyrics' : 'Queue & Current Track'}
          </h3>
          <button 
            onClick={() => {
              setIsQueueOpen(false);
              setIsLyricsOpen(false);
            }}
            className="p-1 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content: Synced Lyrics Mode */}
        {isLyricsOpen ? (
          <div className="flex-1 overflow-y-auto space-y-4 pr-1">
            <div className="bg-gradient-to-b from-[#0d2218] via-[#121212] to-[#181818] p-4 rounded-xl border border-emerald-500/20 shadow-lg">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] uppercase font-extrabold tracking-widest text-[#1ed760] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#1ed760] animate-pulse"></span>
                  Synced Karaoke Lyrics
                </span>
                <span className="text-[10px] text-neutral-400">Tap to Jump</span>
              </div>
              <h4 className="font-bold text-white text-base truncate">{currentTrack?.title}</h4>
              <p className="text-xs text-neutral-400 truncate">{currentTrack?.artist}</p>
            </div>

            <div className="space-y-3 pt-2">
              {currentTrack?.lyrics && currentTrack.lyrics.length > 0 ? (
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
                        showToast(`Jumped to verse ${idx + 1} 🎵`);
                      }}
                      className={`cursor-pointer transition-all duration-300 p-2.5 rounded-xl group select-none ${
                        isActive 
                          ? 'bg-white/10 text-white scale-[1.02] border-l-4 border-[#1ed760] shadow-md' 
                          : 'text-neutral-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <p className={`leading-relaxed transition-all ${
                        isActive ? 'text-base font-extrabold text-[#1ed760]' : 'text-sm font-semibold'
                      }`}>
                        {line}
                      </p>
                      {isActive && (
                        <span className="text-[9px] text-[#00f2fe] font-mono tracking-wider block mt-1">
                          Singing Now • {Math.floor(lineTime / 60)}:{(Math.floor(lineTime % 60)).toString().padStart(2, '0')}
                        </span>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-12 text-neutral-500">
                  <p className="text-sm">No lyrics available for this track.</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Content: Queue & Artist Mode */
          <div className="flex-1 overflow-y-auto space-y-5 pr-1">
            {/* Current Song Card */}
            <div>
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider block mb-2">
                Now Playing
              </span>
              <div className="bg-[#181818] p-3 rounded-xl border border-white/5 space-y-3">
                <img 
                  src={currentTrack?.cover} 
                  alt={currentTrack?.title} 
                  className="w-full aspect-square rounded-lg object-cover shadow-lg"
                />
                <div className="flex items-center justify-between">
                  <div className="min-w-0 pr-2">
                    <h4 className="font-bold text-white truncate text-base">{currentTrack?.title}</h4>
                    <p className="text-xs text-neutral-400 truncate mt-0.5">{currentTrack?.artist}</p>
                  </div>
                  <button 
                    onClick={() => toggleLike(currentTrack?.id)}
                    className={isLiked(currentTrack?.id) ? 'text-[#1ed760]' : 'text-neutral-400 hover:text-white'}
                  >
                    <Heart className={`w-5 h-5 ${isLiked(currentTrack?.id) ? 'fill-[#1ed760]' : ''}`} />
                  </button>
                </div>
              </div>
            </div>

            {/* About the Artist Card */}
            <div className="bg-[#181818] p-4 rounded-xl border border-white/5 relative overflow-hidden group">
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider block mb-2">
                About The Artist
              </span>
              <div className="font-bold text-white text-lg">{currentTrack?.artist}</div>
              <div className="text-xs text-neutral-400 mt-1 flex items-center justify-between">
                <span>{currentTrack?.plays || '42,500,000'} monthly listeners</span>
              </div>
              <button 
                onClick={() => toggleFollowArtist(currentTrack?.artist)}
                className={`mt-3 w-full py-1.5 px-4 rounded-full text-xs font-bold transition flex items-center justify-center gap-1.5 active:scale-95 ${
                  followingArtists.includes(currentTrack?.artist)
                    ? 'bg-[#1ed760] text-black shadow-lg shadow-emerald-500/20'
                    : 'border border-white/30 text-white hover:border-white hover:scale-[1.02]'
                }`}
              >
                {followingArtists.includes(currentTrack?.artist) ? (
                  <>
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Following</span>
                  </>
                ) : (
                  <span>Follow</span>
                )}
              </button>
            </div>

            {/* Next in Queue */}
            <div>
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider block mb-2">
                Next In Queue
              </span>
              <div className="space-y-1">
                {currentPlaylist
                  .filter(t => t.id !== currentTrack?.id)
                  .slice(0, 5)
                  .map((track) => (
                    <div
                      key={track.id}
                      onClick={() => playTrack(track, currentPlaylist)}
                      className="group flex items-center justify-between p-2 rounded-lg hover:bg-neutral-800 cursor-pointer transition"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img 
                          src={track.cover} 
                          alt={track.title} 
                          className="w-10 h-10 rounded object-cover shadow shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="font-medium text-xs text-white truncate group-hover:text-[#1ed760]">
                            {track.title}
                          </div>
                          <div className="text-[11px] text-neutral-400 truncate">
                            {track.artist}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs text-neutral-500 font-mono">{track.duration}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
