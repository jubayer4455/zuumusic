import React, { useState } from 'react';
import { 
  Home, 
  Search, 
  Library, 
  Plus, 
  ArrowRight, 
  Heart, 
  Music, 
  ListMusic, 
  Disc3,
  Sparkles,
  Radio,
  HardDrive,
  FolderDown,
  UserCheck,
  Mic2
} from 'lucide-react';
import { useMusic } from '../context/MusicContext';
import { PLAYLISTS_META, PODCASTS_DATA } from '../data/songs';
import { ZuuLogo } from './ZuuLogo';

export const Sidebar = () => {
  const { 
    activeView, 
    setActiveView, 
    selectedPlaylistId, 
    setSelectedPlaylistId,
    likedSongIds,
    customPlaylists,
    offlineTracks,
    importLocalAudioFiles,
    setIsCreatePlaylistOpen,
    followingArtists,
    playTrack,
    setHomeFilter
  } = useMusic();

  const [sidebarFilter, setSidebarFilter] = useState('all'); // 'all' | 'playlists' | 'artists' | 'podcasts'
  const fileInputRef = React.useRef(null);

  const handlePlaylistClick = (playlistId) => {
    setSelectedPlaylistId(playlistId);
    setActiveView('playlist');
  };

  return (
    <aside className="hidden md:flex flex-col gap-2 w-72 lg:w-80 h-full p-2 select-none shrink-0 bg-transparent text-neutral-300 text-sm">
      {/* Top Box: Brand & Navigation - iOS Liquid Glass */}
      <div className="bg-white/[0.04] backdrop-blur-2xl border border-white/10 rounded-2xl p-4 flex flex-col gap-5 shadow-xl">
        {/* Zuu Music Logo */}
        <div 
          onClick={() => setActiveView('home')}
          className="flex items-center px-1 cursor-pointer group active:scale-95 transition-transform"
        >
          <ZuuLogo className="w-9 h-9" withText={true} textClassName="text-2xl font-black" />
        </div>

        {/* Main Nav Items */}
        <nav className="flex flex-col gap-1">
          <button
            onClick={() => setActiveView('home')}
            className={`flex items-center gap-4 px-3.5 py-2.5 rounded-xl font-semibold transition-all duration-200 active:scale-95 ${
              activeView === 'home' 
                ? 'text-white bg-white/15 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] font-bold' 
                : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Home className={`w-5 h-5 ${activeView === 'home' ? 'text-[#1ed760]' : ''}`} />
            <span>Home</span>
          </button>

          <button
            onClick={() => setActiveView('search')}
            className={`flex items-center gap-4 px-3.5 py-2.5 rounded-xl font-semibold transition-all duration-200 active:scale-95 ${
              activeView === 'search' 
                ? 'text-white bg-white/15 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] font-bold' 
                : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Search className={`w-5 h-5 ${activeView === 'search' ? 'text-[#00f2fe]' : ''}`} />
            <span>Search</span>
          </button>
        </nav>
      </div>

      {/* Bottom Box: Library & Playlists - iOS Liquid Glass */}
      <div className="bg-white/[0.04] backdrop-blur-2xl border border-white/10 rounded-2xl flex-1 flex flex-col min-h-0 overflow-hidden p-3 shadow-xl">
        {/* Library Header */}
        <div className="flex items-center justify-between px-2 py-1 mb-2">
          <button 
            onClick={() => setActiveView('library')}
            className="flex items-center gap-3 text-neutral-400 hover:text-white transition font-semibold"
          >
            <Library className="w-6 h-6" />
            <span className="text-base">Your Library</span>
          </button>

          <div className="flex items-center gap-1">
            <button 
              onClick={() => setIsCreatePlaylistOpen(true)}
              className="p-1.5 hover:bg-neutral-800 rounded-full text-neutral-400 hover:text-white transition"
              title="Create playlist or folder"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Badges - Interactive */}
        <div className="flex items-center gap-2 px-2 py-1 mb-3 overflow-x-auto no-scrollbar text-xs">
          <button 
            onClick={() => setSidebarFilter(sidebarFilter === 'playlists' ? 'all' : 'playlists')}
            className={`px-3 py-1.5 rounded-full font-medium transition ${
              sidebarFilter === 'playlists' ? 'bg-[#1ed760] text-black font-bold' : 'bg-neutral-800 hover:bg-neutral-700 text-white'
            }`}
          >
            Playlists
          </button>
          <button 
            onClick={() => setSidebarFilter(sidebarFilter === 'artists' ? 'all' : 'artists')}
            className={`px-3 py-1.5 rounded-full font-medium transition ${
              sidebarFilter === 'artists' ? 'bg-[#00f2fe] text-black font-bold' : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-300'
            }`}
          >
            Artists
          </button>
          <button 
            onClick={() => {
              setSidebarFilter(sidebarFilter === 'podcasts' ? 'all' : 'podcasts');
              setHomeFilter('podcasts');
              setActiveView('home');
            }}
            className={`px-3 py-1.5 rounded-full font-medium transition ${
              sidebarFilter === 'podcasts' ? 'bg-purple-500 text-white font-bold' : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-300'
            }`}
          >
            Podcasts
          </button>
        </div>

        {/* Playlists / Artists List (Scrollable) */}
        <div className="flex-1 overflow-y-auto space-y-1 pr-1">
          {/* Artists Filter View */}
          {sidebarFilter === 'artists' ? (
            <div className="space-y-1">
              {followingArtists.map((artist, idx) => (
                <div 
                  key={idx}
                  onClick={() => {
                    setActiveView('search');
                  }}
                  className="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-neutral-800 transition group"
                >
                  <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-white shadow">
                    {artist.charAt(0)}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-semibold text-sm text-white group-hover:text-[#00f2fe] truncate">
                      {artist}
                    </span>
                    <span className="text-xs text-neutral-400 flex items-center gap-1">
                      <UserCheck className="w-3 h-3 text-[#1ed760]" /> Following • Artist
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : sidebarFilter === 'podcasts' ? (
            <div className="space-y-1">
              {PODCASTS_DATA.map((pod) => (
                <div 
                  key={pod.id}
                  onClick={() => {
                    playTrack(pod.latestEpisode);
                  }}
                  className="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-neutral-800 transition group"
                >
                  <img src={pod.cover} alt={pod.title} className="w-11 h-11 rounded-lg object-cover shadow" />
                  <div className="flex flex-col min-w-0">
                    <span className="font-semibold text-sm text-white group-hover:text-purple-400 truncate">
                      {pod.title}
                    </span>
                    <span className="text-xs text-neutral-400 flex items-center gap-1">
                      <Mic2 className="w-3 h-3 text-purple-400" /> {pod.episodesCount} episodes
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {/* Liked Songs Special Item */}
              <div
                onClick={() => handlePlaylistClick('liked')}
                className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                  activeView === 'playlist' && selectedPlaylistId === 'liked'
                    ? 'bg-neutral-800 text-white'
                    : 'hover:bg-[#1f1f1f] text-neutral-300'
                }`}
              >
                <div className="w-12 h-12 rounded-md bg-gradient-to-br from-indigo-600 to-emerald-400 flex items-center justify-center shrink-0 shadow">
                  <Heart className="w-5 h-5 text-white fill-white" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className={`font-semibold text-sm truncate ${
                    activeView === 'playlist' && selectedPlaylistId === 'liked' ? 'text-emerald-400' : 'text-white'
                  }`}>
                    Liked Songs
                  </span>
                  <span className="text-xs text-neutral-400 truncate flex items-center gap-1">
                    <span className="text-emerald-400 font-bold">📌 Pinned</span> • Playlist • {likedSongIds.length} songs
                  </span>
                </div>
              </div>

              {/* Worldwide Top 50 Special Item */}
              <div
                onClick={() => handlePlaylistClick('yt-trending')}
                className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                  activeView === 'playlist' && selectedPlaylistId === 'yt-trending'
                    ? 'bg-neutral-800 text-white'
                    : 'hover:bg-[#1f1f1f] text-neutral-300'
                }`}
              >
                <div className="w-12 h-12 rounded-md bg-gradient-to-br from-emerald-600 to-teal-800 flex items-center justify-center shrink-0 shadow">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className={`font-semibold text-sm truncate ${
                    activeView === 'playlist' && selectedPlaylistId === 'yt-trending' ? 'text-[#1ed760]' : 'text-white'
                  }`}>
                    Global Top 50 Hits
                  </span>
                  <span className="text-xs text-neutral-400 truncate flex items-center gap-1">
                    <span className="text-[#1ed760] font-bold">🔥 Worldwide Chart</span> • Lossless 320k
                  </span>
                </div>
              </div>

          {/* Offline & Local Songs Special Item */}
          <div
            onClick={() => handlePlaylistClick('offline')}
            className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
              activeView === 'playlist' && selectedPlaylistId === 'offline'
                ? 'bg-neutral-800 text-white'
                : 'hover:bg-[#1f1f1f] text-neutral-300'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-12 h-12 rounded-md bg-gradient-to-br from-cyan-600 to-teal-800 flex items-center justify-center shrink-0 shadow">
                <HardDrive className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className={`font-semibold text-sm truncate ${
                  activeView === 'playlist' && selectedPlaylistId === 'offline' ? 'text-cyan-400' : 'text-white'
                }`}>
                  Offline & Local Files
                </span>
                <span className="text-xs text-neutral-400 truncate flex items-center gap-1">
                  <span className="text-cyan-400 font-bold">⚡ Offline</span> • {offlineTracks.length} local files
                </span>
              </div>
            </div>

            {/* Quick Import Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              className="p-1.5 hover:bg-neutral-700 rounded-full text-neutral-400 hover:text-white transition"
              title="Import MP3 files from PC"
            >
              <FolderDown className="w-4 h-4 text-cyan-400" />
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={(e) => importLocalAudioFiles(e.target.files)} 
              multiple 
              accept="audio/*" 
              className="hidden" 
            />
          </div>

          {/* User Custom Playlists */}
          {customPlaylists.map(pl => (
            <div
              key={pl.id}
              onClick={() => handlePlaylistClick(pl.id)}
              className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                activeView === 'playlist' && selectedPlaylistId === pl.id
                  ? 'bg-neutral-800 text-white'
                  : 'hover:bg-[#1f1f1f] text-neutral-300'
              }`}
            >
              <img 
                src={pl.cover} 
                alt={pl.title} 
                className="w-12 h-12 rounded-md object-cover shrink-0 shadow"
              />
              <div className="flex flex-col min-w-0">
                <span className={`font-semibold text-sm truncate ${
                  activeView === 'playlist' && selectedPlaylistId === pl.id ? 'text-emerald-400' : 'text-white'
                }`}>
                  {pl.title}
                </span>
                <span className="text-xs text-neutral-400 truncate">
                  Playlist • {pl.curator || 'You'} • {pl.songIds?.length || 0} tracks
                </span>
              </div>
            </div>
          ))}

          {/* Curated Spotify Playlists */}
          {PLAYLISTS_META.map(pl => (
            <div
              key={pl.id}
              onClick={() => handlePlaylistClick(pl.id)}
              className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                activeView === 'playlist' && selectedPlaylistId === pl.id
                  ? 'bg-neutral-800 text-white'
                  : 'hover:bg-[#1f1f1f] text-neutral-300'
              }`}
            >
              <img 
                src={pl.cover} 
                alt={pl.title} 
                className="w-12 h-12 rounded-md object-cover shrink-0 shadow"
              />
              <div className="flex flex-col min-w-0">
                <span className={`font-semibold text-sm truncate ${
                  activeView === 'playlist' && selectedPlaylistId === pl.id ? 'text-emerald-400' : 'text-white'
                }`}>
                  {pl.title}
                </span>
                <span className="text-xs text-neutral-400 truncate">
                  Playlist • {pl.curator}
                </span>
              </div>
            </div>
          ))}
            </>
          )}
        </div>
      </div>
    </aside>
  );
};
