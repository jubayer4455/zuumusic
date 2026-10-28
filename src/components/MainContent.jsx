import React from 'react';
import { 
  Play, 
  Pause, 
  Heart, 
  Clock3, 
  MoreHorizontal, 
  ArrowDownCircle, 
  Share2, 
  Music2, 
  Volume2,
  Sparkles,
  Check,
  Plus,
  Flame,
  Radio,
  Tv,
  Loader2,
  Video,
  Download,
  CheckCircle2
} from 'lucide-react';
import { useMusic } from '../context/MusicContext';
import { ALL_SONGS, PLAYLISTS_META, CATEGORIES, PODCASTS_DATA } from '../data/songs';

export const MainContent = () => {
  const { 
    activeView, 
    setActiveView, 
    selectedPlaylistId, 
    setSelectedPlaylistId,
    currentTrack, 
    isPlaying, 
    playTrack, 
    togglePlay, 
    isLiked, 
    toggleLike,
    downloadTrack,
    isDownloaded,
    searchQuery,
    setSearchQuery,
    selectedGenre,
    setSelectedGenre,
    formatTime,
    getSelectedPlaylistData,
    showToast,
    setIsCreatePlaylistOpen,
    youtubeTrending,
    youtubeSearchResults,
    isSearchingYouTube,
    isVideoMode,
    setIsVideoMode,
    offlineTracks,
    importLocalAudioFiles,
    homeFilter,
    setHomeFilter,
    downloadAllTracks
  } = useMusic();

  const localFileInputRef = React.useRef(null);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'Shubh Shokal / Good morning 🌅';
    if (hour >= 12 && hour < 17) return 'Shubh Dupur / Good afternoon ☀️';
    if (hour >= 17 && hour < 21) return 'Shubh Shondha / Good evening 🌆';
    return 'Late Night Chill / Shubh Ratri 🌙';
  };

  const filterChips = [
    { id: 'all', label: 'All' },
    { id: 'bangla', label: 'Bangla Acoustic' },
    { id: 'lofi', label: 'Lo-Fi Chill' },
    { id: 'trending', label: 'Trending Worldwide 🔥' },
    { id: 'pop', label: 'Pop Rising' },
    { id: 'podcasts', label: 'Podcasts 🎙️' },
    { id: 'downloaded', label: 'Downloaded MP3s' }
  ];

  const handlePlaylistSelect = (id) => {
    setSelectedPlaylistId(id);
    setActiveView('playlist');
  };

  /* -------------------------------------------------------------------------- */
  /*                             1. HOME VIEW                                   */
  /* -------------------------------------------------------------------------- */
  const renderHomeView = () => {
    const quickPicks = [
      { id: 'liked', title: 'Liked Songs', cover: 'https://misc.scdn.co/liked-songs/liked-songs-640.png', isLiked: true },
      { id: 'offline', title: 'Offline & Local Tracks', cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80', isOffline: true },
      { id: 'yt-trending', title: 'Global Top 50 Hits', cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80', isYt: true },
      ...PLAYLISTS_META.slice(0, 3).map(p => ({ id: p.id, title: p.title, cover: p.cover }))
    ];

    return (
      <div className="space-y-8 pb-32">
        {/* Top Greeting & Quick 6-Grid */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {getGreeting()}
            </h1>

            {/* Global Master Audio Badge */}
            <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/15 text-[#1ed760] border border-[#1ed760]/30 rounded-full text-xs font-bold shadow-[0_0_12px_rgba(30,215,96,0.15)]">
              <span className="w-2 h-2 rounded-full bg-[#1ed760] animate-pulse"></span>
              <span>Global Master 320k</span>
            </div>
          </div>

          {/* Quick Filter Chips (Spotify Human-Engineered Flow) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-3 scrollbar-none mb-3">
            {filterChips.map(chip => (
              <button
                key={chip.id}
                onClick={() => setHomeFilter(chip.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  homeFilter === chip.id
                    ? 'bg-white text-black shadow-md scale-105'
                    : 'bg-white/10 text-neutral-300 hover:bg-white/20 hover:text-white'
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {quickPicks.map((item) => {
              const isCurrentPlayingThis = isPlaying && currentTrack && (
                item.isLiked ? isLiked(currentTrack.id) : 
                item.isYt ? currentTrack.isYouTube :
                currentTrack.playlistId === item.id
              );

              return (
                <div
                  key={item.id}
                  onClick={() => handlePlaylistSelect(item.id)}
                  className="group relative flex items-center ios-glass-card rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 shadow-md active:scale-95"
                >
                  <img
                    src={item.cover}
                    alt={item.title}
                    className="w-16 h-16 sm:w-20 sm:h-20 object-cover shrink-0 shadow-lg"
                  />
                  <div className="flex-1 px-4 font-bold text-sm sm:text-base text-white truncate">
                    {item.title}
                  </div>

                  {/* Play Button on Hover */}
                  <div className="pr-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (item.isLiked) {
                          handlePlaylistSelect('liked');
                        } else if (item.isOffline) {
                          if (offlineTracks.length > 0) {
                            playTrack(offlineTracks[0], offlineTracks);
                          } else {
                            handlePlaylistSelect('offline');
                          }
                        } else if (item.isYt) {
                          if (youtubeTrending.length > 0) {
                            playTrack(youtubeTrending[0], youtubeTrending);
                          } else {
                            handlePlaylistSelect('yt-trending');
                          }
                        } else {
                          const plSongs = ALL_SONGS.filter(s => s.playlistId === item.id);
                          if (plSongs.length > 0) {
                            playTrack(plSongs[0], plSongs);
                          }
                        }
                      }}
                      className="w-11 h-11 rounded-full bg-[#1ed760] text-black flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:scale-105 shadow-xl transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 hover:bg-[#3be477]"
                      title="Play"
                    >
                      {isCurrentPlayingThis ? (
                        <Pause className="w-5 h-5 fill-black" />
                      ) : (
                        <Play className="w-5 h-5 fill-black ml-0.5" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Section: Dedicated Podcasts View when Filter is Podcasts */}
        {homeFilter === 'podcasts' && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  Trending Podcasts & Talk Shows 🎙️
                </h2>
                <p className="text-xs sm:text-sm text-neutral-400 mt-0.5">
                  Top podcasts across science, true horror, tech & mental clarity
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {PODCASTS_DATA.map((pod) => (
                <div 
                  key={pod.id}
                  onClick={() => playTrack(pod.latestEpisode)}
                  className="ios-glass-card p-4 rounded-2xl flex gap-4 cursor-pointer hover:border-purple-500/40 transition group active:scale-95 shadow-xl"
                >
                  <img src={pod.cover} alt={pod.title} className="w-24 h-24 rounded-xl object-cover shrink-0 shadow-lg" />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">{pod.category}</span>
                      <h3 className="font-bold text-white text-base truncate group-hover:text-purple-300 mt-0.5">{pod.title}</h3>
                      <p className="text-xs text-neutral-400 line-clamp-2 mt-1">{pod.description}</p>
                    </div>
                    <div className="flex items-center justify-between text-xs text-neutral-300 pt-2 border-t border-white/5">
                      <span>{pod.episodesCount} episodes • {pod.host}</span>
                      <button className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center shadow hover:scale-110 transition">
                        <Play className="w-4 h-4 fill-white ml-0.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Section: Worldwide Trending Hits */}
        {youtubeTrending.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-bold text-white hover:underline cursor-pointer">
                    Trending Worldwide 🔥
                  </h2>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gradient-to-r from-rose-500 to-amber-500 text-white">
                    TOP 50
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-neutral-400 mt-0.5">
                  The most played songs and viral hits across the globe
                </p>
              </div>
              <button 
                onClick={() => handlePlaylistSelect('yt-trending')}
                className="text-xs sm:text-sm font-bold text-neutral-400 hover:text-white transition"
              >
                Show all
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {youtubeTrending.slice(0, 6).map((track) => {
                const isCurrent = currentTrack?.id === track.id;
                return (
                  <div
                    key={track.id}
                    onClick={() => playTrack(track, youtubeTrending)}
                    className="group relative ios-glass-card p-3 rounded-2xl cursor-pointer transition-all duration-300 flex flex-col shadow-lg active:scale-95"
                  >
                    <div className="relative mb-3 aspect-square rounded-md overflow-hidden bg-neutral-900 shadow-md">
                      <img
                        src={track.cover}
                        alt={track.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute top-2 left-2 bg-black/70 backdrop-blur text-[10px] text-white px-2 py-0.5 rounded-full font-bold">
                        {track.duration}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          playTrack(track, youtubeTrending);
                        }}
                        className={`absolute right-2 bottom-2 w-10 h-10 rounded-full bg-[#1ed760] text-black flex items-center justify-center shadow-xl transition-all duration-300 hover:scale-110 ${
                          isCurrent && isPlaying 
                            ? 'opacity-100 translate-y-0' 
                            : 'opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0'
                        }`}
                      >
                        {isCurrent && isPlaying ? (
                          <Pause className="w-5 h-5 fill-black" />
                        ) : (
                          <Play className="w-5 h-5 fill-black ml-0.5" />
                        )}
                      </button>
                    </div>

                    <h3 className={`font-bold text-sm truncate ${isCurrent ? 'text-[#1ed760]' : 'text-white'}`}>
                      {track.title}
                    </h3>
                    <p className="text-xs text-neutral-400 truncate mt-1">
                      {track.artist}
                    </p>
                    <span className="text-[11px] text-neutral-500 mt-1">
                      {track.plays}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Section: Today's Biggest Hits */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white hover:underline cursor-pointer">
                Today's Biggest Hits
              </h2>
              <p className="text-xs sm:text-sm text-neutral-400 mt-0.5">The most listened tracks right now</p>
            </div>
            <button 
              onClick={() => handlePlaylistSelect('top-hits')}
              className="text-xs sm:text-sm font-bold text-neutral-400 hover:text-white transition"
            >
              Show all
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {ALL_SONGS.slice(0, 5).map((song) => {
              const isCurrent = currentTrack?.id === song.id;
              return (
                <div
                  key={song.id}
                  onClick={() => playTrack(song, ALL_SONGS)}
                  className="group relative ios-glass-card p-3.5 rounded-2xl cursor-pointer transition-all duration-300 flex flex-col shadow-lg hover:shadow-2xl active:scale-95"
                >
                  <div className="relative mb-3 aspect-square rounded-md overflow-hidden bg-neutral-900 shadow-md">
                    <img
                      src={song.cover}
                      alt={song.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        playTrack(song, ALL_SONGS);
                      }}
                      className={`absolute right-2 bottom-2 w-11 h-11 rounded-full bg-[#1ed760] text-black flex items-center justify-center shadow-xl transition-all duration-300 hover:scale-110 hover:bg-[#3be477] ${
                        isCurrent && isPlaying 
                          ? 'opacity-100 translate-y-0' 
                          : 'opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0'
                      }`}
                    >
                      {isCurrent && isPlaying ? (
                        <Pause className="w-5 h-5 fill-black" />
                      ) : (
                        <Play className="w-5 h-5 fill-black ml-0.5" />
                      )}
                    </button>
                  </div>

                  <h3 className={`font-bold text-sm truncate ${isCurrent ? 'text-[#1ed760]' : 'text-white'}`}>
                    {song.title}
                  </h3>
                  <p className="text-xs text-neutral-400 truncate mt-1">
                    {song.artist}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Section: Featured Curated Playlists */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white hover:underline cursor-pointer">
                Popular Playlists
              </h2>
              <p className="text-xs sm:text-sm text-neutral-400 mt-0.5">Handpicked collections for every mood</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {PLAYLISTS_META.map((pl) => (
              <div
                key={pl.id}
                onClick={() => handlePlaylistSelect(pl.id)}
                className="group relative ios-glass-card p-3 rounded-2xl cursor-pointer transition-all duration-300 flex flex-col shadow-lg active:scale-95"
              >
                <div className="relative mb-3 aspect-square rounded-md overflow-hidden bg-neutral-900 shadow-md">
                  <img
                    src={pl.cover}
                    alt={pl.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlaylistSelect(pl.id);
                    }}
                    className="absolute right-2 bottom-2 w-10 h-10 rounded-full bg-[#1ed760] text-black flex items-center justify-center opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 shadow-xl transition-all duration-300 hover:scale-110"
                  >
                    <Play className="w-5 h-5 fill-black ml-0.5" />
                  </button>
                </div>

                <h3 className="font-bold text-sm text-white truncate">
                  {pl.title}
                </h3>
                <p className="text-xs text-neutral-400 line-clamp-2 mt-1 leading-snug">
                  {pl.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Section: Bangla & Acoustic Soul */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white hover:underline cursor-pointer">
                Bangla & Chill Melodies 🇧🇩
              </h2>
              <p className="text-xs sm:text-sm text-neutral-400 mt-0.5">Soothing acoustic tunes and heartfelt nostalgia</p>
            </div>
            <button 
              onClick={() => handlePlaylistSelect('bangla-vibes')}
              className="text-xs sm:text-sm font-bold text-neutral-400 hover:text-white transition"
            >
              See playlist
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {ALL_SONGS.filter(s => s.genre === 'acoustic' || s.genre === 'lofi').map((song) => {
              const isCurrent = currentTrack?.id === song.id;
              return (
                <div
                  key={song.id}
                  onClick={() => playTrack(song, ALL_SONGS)}
                  className="group relative bg-[#181818] hover:bg-[#282828] p-3.5 rounded-lg cursor-pointer transition-all duration-300 flex flex-col shadow-lg"
                >
                  <div className="relative mb-3 aspect-square rounded-md overflow-hidden bg-neutral-900 shadow-md">
                    <img
                      src={song.cover}
                      alt={song.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        playTrack(song, ALL_SONGS);
                      }}
                      className={`absolute right-2 bottom-2 w-11 h-11 rounded-full bg-[#1ed760] text-black flex items-center justify-center shadow-xl transition-all duration-300 hover:scale-110 ${
                        isCurrent && isPlaying 
                          ? 'opacity-100 translate-y-0' 
                          : 'opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0'
                      }`}
                    >
                      {isCurrent && isPlaying ? (
                        <Pause className="w-5 h-5 fill-black" />
                      ) : (
                        <Play className="w-5 h-5 fill-black ml-0.5" />
                      )}
                    </button>
                  </div>

                  <h3 className={`font-bold text-sm truncate ${isCurrent ? 'text-[#1ed760]' : 'text-white'}`}>
                    {song.title}
                  </h3>
                  <p className="text-xs text-neutral-400 truncate mt-1">
                    {song.artist}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    );
  };

  /* -------------------------------------------------------------------------- */
  /*                            2. SEARCH VIEW                                  */
  /* -------------------------------------------------------------------------- */
  const renderSearchView = () => {
    // Local catalog filter
    const localFiltered = ALL_SONGS.filter(song => {
      const matchQuery = !searchQuery.trim() || 
        song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        song.artist.toLowerCase().includes(searchQuery.toLowerCase());
      return matchQuery;
    });

    // Combine local + live YouTube results
    const combinedResults = [...localFiltered, ...youtubeSearchResults];

    return (
      <div className="space-y-6 pb-32">
        {/* Mobile Search Bar */}
        <div className="block sm:hidden">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search songs, artists, albums, or lyrics..."
            className="w-full bg-[#242424] text-white text-sm rounded-lg px-4 py-3 outline-none border border-neutral-700 focus:border-white"
          />
        </div>

        {/* If user is typing query */}
        {searchQuery.trim() ? (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-white">
                Results for <span className="text-[#1ed760]">"{searchQuery}"</span>
              </h2>

              {isSearchingYouTube && (
                <div className="flex items-center gap-2 text-xs text-neutral-400">
                  <Loader2 className="w-4 h-4 animate-spin text-[#1ed760]" />
                  <span>Searching worldwide catalog...</span>
                </div>
              )}
            </div>

            {combinedResults.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Top Result Card */}
                <div className="lg:col-span-1 ios-glass-card p-5 rounded-2xl transition duration-300 relative group flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3 block">
                      Top Result
                    </span>
                    <img 
                      src={combinedResults[0].cover} 
                      alt={combinedResults[0].title} 
                      className="w-28 h-28 rounded-xl object-cover shadow-2xl mb-4"
                    />
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-1 line-clamp-2">
                      {combinedResults[0].title}
                    </h3>
                    <p className="text-sm text-neutral-400">
                      Top Hit • <span className="text-white font-medium">{combinedResults[0].artist}</span>
                    </p>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider bg-emerald-500/20 text-[#1ed760] border border-[#1ed760]/30">
                      Official Master
                    </span>
                    <button
                      onClick={() => playTrack(combinedResults[0], combinedResults)}
                      className="w-12 h-12 rounded-full bg-[#1ed760] text-black flex items-center justify-center shadow-xl hover:scale-105 transition"
                    >
                      <Play className="w-6 h-6 fill-black ml-0.5" />
                    </button>
                  </div>
                </div>

                {/* Matching Songs List */}
                <div className="lg:col-span-2 space-y-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                      Live Tracks & Videos ({combinedResults.length})
                    </span>
                  </div>

                  {combinedResults.map((song) => {
                    const isCurrent = currentTrack?.id === song.id;
                    return (
                      <div
                        key={song.id}
                        onClick={() => playTrack(song, combinedResults)}
                        className={`group flex items-center justify-between p-2.5 rounded-lg cursor-pointer transition ${
                          isCurrent ? 'bg-neutral-800' : 'hover:bg-[#1f1f1f]'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1 pr-2">
                          <img 
                            src={song.cover} 
                            alt={song.title} 
                            className="w-11 h-11 rounded object-cover shadow shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <div className={`font-semibold text-sm truncate ${isCurrent ? 'text-[#1ed760]' : 'text-white'}`}>
                              {song.title}
                            </div>
                            <div className="text-xs text-neutral-400 truncate flex items-center gap-1.5">
                              <span>{song.artist}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2.5 text-xs text-neutral-400">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              downloadTrack(song);
                            }}
                            className={`p-1.5 transition ${
                              isDownloaded(song.id) 
                                ? 'text-[#00e5ff]' 
                                : 'text-neutral-400 hover:text-white opacity-80 md:opacity-0 md:group-hover:opacity-100'
                            }`}
                            title="Download to Phone / Offline"
                          >
                            {isDownloaded(song.id) ? (
                              <CheckCircle2 className="w-4 h-4 text-[#00e5ff]" />
                            ) : (
                              <Download className="w-4 h-4" />
                            )}
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleLike(song.id);
                            }}
                            className={`p-1.5 transition ${
                              isLiked(song.id) ? 'text-[#1ed760]' : 'text-neutral-400 hover:text-white opacity-0 group-hover:opacity-100'
                            }`}
                          >
                            <Heart className={`w-4 h-4 ${isLiked(song.id) ? 'fill-[#1ed760]' : ''}`} />
                          </button>
                          <span className="font-mono">{song.duration || '3:30'}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : isSearchingYouTube ? (
              <div className="py-20 text-center">
                <Loader2 className="w-10 h-10 animate-spin text-[#1ed760] mx-auto mb-3" />
                <p className="text-sm text-neutral-400">Searching worldwide music catalog...</p>
              </div>
            ) : (
              <div className="py-20 text-center">
                <Music2 className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
                <h3 className="text-xl font-bold text-white">No results found for "{searchQuery}"</h3>
                <p className="text-sm text-neutral-400 mt-1">
                  Try searching for a different song or artist name.
                </p>
              </div>
            )}
          </div>
        ) : (
          /* Browse All Categories Grid */
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Browse all</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {CATEGORIES.map((cat) => (
                <div
                  key={cat.id}
                  onClick={() => {
                    setSearchQuery(cat.id === 'all' ? '' : cat.name);
                  }}
                  className={`relative h-44 rounded-xl p-4 overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-[1.02] shadow-lg ${cat.color}`}
                >
                  <h3 className="text-xl sm:text-2xl font-bold text-white leading-tight break-words max-w-[70%]">
                    {cat.name}
                  </h3>
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="absolute -right-3 -bottom-2 w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-md shadow-2xl transform rotate-[25deg] group-hover:rotate-[20deg] transition-transform"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  /* -------------------------------------------------------------------------- */
  /*                           3. PLAYLIST VIEW                                 */
  /* -------------------------------------------------------------------------- */
  const renderPlaylistView = () => {
    const playlist = getSelectedPlaylistData();
    const isCurrentPlaylistActive = isPlaying && currentTrack && playlist.tracks.some(t => t.id === currentTrack.id);

    return (
      <div className="space-y-6 pb-32 -mx-4 sm:-mx-8">
        {/* Hero Header with Dynamic Gradient */}
        <div 
          className="relative px-6 sm:px-8 pt-12 pb-8 flex flex-col md:flex-row items-center md:items-end gap-6 sm:gap-8 transition-colors duration-500"
          style={{ background: playlist.gradient || 'linear-gradient(to bottom, #1e3a8a, #121212)' }}
        >
          {/* Playlist Artwork */}
          <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-lg overflow-hidden shadow-[0_15px_35px_rgba(0,0,0,0.6)] shrink-0 bg-neutral-900">
            <img 
              src={playlist.cover} 
              alt={playlist.title} 
              className="w-full h-full object-cover"
            />
          </div>

          {/* Playlist Metadata */}
          <div className="flex-1 text-center md:text-left min-w-0">
            <span className="text-xs uppercase font-extrabold tracking-wider text-white/90">
              {playlist.id === 'liked' ? 'Playlist' : playlist.id === 'yt-trending' ? 'Worldwide Top 50 Chart' : 'Public Playlist'}
            </span>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white my-2 tracking-tight line-clamp-2">
              {playlist.title}
            </h1>
            <p className="text-sm text-white/80 line-clamp-2 mb-3 max-w-2xl">
              {playlist.description}
            </p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-1.5 text-xs sm:text-sm text-white/90 font-medium">
              <span className="font-bold text-white">{playlist.curator || 'Zuu Music'}</span>
              <span>•</span>
              <span>{playlist.tracks?.length || 0} songs</span>
              <span>•</span>
              <span className="text-white/70">
                about {Math.ceil(((playlist.tracks?.length || 0) * 3))} min
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls Bar */}
        <div className="px-6 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button
              onClick={() => {
                if (playlist.tracks && playlist.tracks.length > 0) {
                  if (isCurrentPlaylistActive) {
                    togglePlay();
                  } else {
                    playTrack(playlist.tracks[0], playlist.tracks);
                  }
                }
              }}
              className="w-14 h-14 rounded-full bg-[#1ed760] text-black flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 hover:bg-[#3be477] transition-all"
              title="Play playlist"
            >
              {isCurrentPlaylistActive ? (
                <Pause className="w-7 h-7 fill-black" />
              ) : (
                <Play className="w-7 h-7 fill-black ml-1" />
              )}
            </button>

            <button
              onClick={() => showToast("Added playlist to your Library! 💚")}
              className="text-neutral-400 hover:text-[#1ed760] transition active:scale-95"
              title="Save to Your Library"
            >
              <Heart className="w-8 h-8" />
            </button>

            <button
              onClick={() => downloadAllTracks(playlist.tracks)}
              className="text-neutral-400 hover:text-[#00e5ff] transition active:scale-95"
              title="Download entire playlist for offline listening"
            >
              <ArrowDownCircle className="w-8 h-8" />
            </button>

            <button
              onClick={() => showToast("Playlist link copied to clipboard! 🔗 Ready to share")}
              className="text-neutral-400 hover:text-white transition active:scale-95"
              title="Share Playlist"
            >
              <MoreHorizontal className="w-8 h-8" />
            </button>
          </div>
        </div>

        {/* Songs Table */}
        <div className="px-6 sm:px-8">
          <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-2 border-b border-white/10 text-xs font-bold uppercase tracking-wider text-neutral-400">
            <div className="col-span-1 text-center">#</div>
            <div className="col-span-5">Title</div>
            <div className="col-span-3">Source / Channel</div>
            <div className="col-span-2">Date Added</div>
            <div className="col-span-1 text-right flex items-center justify-end">
              <Clock3 className="w-4 h-4" />
            </div>
          </div>

          <div className="space-y-1 mt-2">
            {playlist.tracks && playlist.tracks.length > 0 ? (
              playlist.tracks.map((song, index) => {
                const isCurrent = currentTrack?.id === song.id;
                return (
                  <div
                    key={song.id}
                    onClick={() => playTrack(song, playlist.tracks)}
                    className={`group grid grid-cols-1 md:grid-cols-12 gap-4 items-center px-4 py-2.5 rounded-lg cursor-pointer transition ${
                      isCurrent ? 'bg-white/10' : 'hover:bg-white/5'
                    }`}
                  >
                    <div className="hidden md:flex col-span-1 items-center justify-center text-sm font-medium">
                      {isCurrent && isPlaying ? (
                        <div className="flex items-end gap-[2px] h-3.5 w-3.5">
                          <span className="w-1 bg-[#1ed760] rounded-full animate-[bounce_0.8s_ease-in-out_infinite] h-full"></span>
                          <span className="w-1 bg-[#1ed760] rounded-full animate-[bounce_0.6s_ease-in-out_infinite_0.2s] h-2/3"></span>
                          <span className="w-1 bg-[#1ed760] rounded-full animate-[bounce_0.9s_ease-in-out_infinite_0.4s] h-4/5"></span>
                        </div>
                      ) : (
                        <span className={`group-hover:hidden ${isCurrent ? 'text-[#1ed760] font-bold' : 'text-neutral-400'}`}>
                          {index + 1}
                        </span>
                      )}
                      <Play className="w-4 h-4 text-white hidden group-hover:block ml-0.5" />
                    </div>

                    <div className="col-span-5 flex items-center gap-3 min-w-0">
                      <img 
                        src={song.cover} 
                        alt={song.title} 
                        className="w-10 h-10 rounded object-cover shadow shrink-0"
                      />
                      <div className="min-w-0">
                        <div className={`font-semibold text-sm truncate ${isCurrent ? 'text-[#1ed760]' : 'text-white'}`}>
                          {song.title}
                        </div>
                        <div className="text-xs text-neutral-400 truncate hover:underline hover:text-white flex items-center gap-1.5">
                          <span>{song.artist}</span>
                        </div>
                      </div>
                    </div>

                    <div className="hidden md:block col-span-3 text-xs text-neutral-400 truncate hover:text-white">
                      {song.album || song.artist}
                    </div>

                    <div className="hidden md:block col-span-2 text-xs text-neutral-400 truncate">
                      {song.dateAdded || 'Recently'}
                    </div>

                    <div className="col-span-1 flex items-center justify-end gap-2.5 text-xs text-neutral-400">
                      {/* Direct Song Row Download Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          downloadTrack(song);
                        }}
                        className={`p-1 transition ${
                          isDownloaded(song.id) 
                            ? 'text-[#00e5ff]' 
                            : 'text-neutral-400 hover:text-white opacity-80 md:opacity-0 md:group-hover:opacity-100'
                        }`}
                        title="Download to Phone / Offline"
                      >
                        {isDownloaded(song.id) ? (
                          <CheckCircle2 className="w-4 h-4 text-[#00e5ff]" />
                        ) : (
                          <Download className="w-4 h-4" />
                        )}
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLike(song.id);
                        }}
                        className={`p-1 transition ${
                          isLiked(song.id) ? 'text-[#1ed760]' : 'text-neutral-400 hover:text-white opacity-80 md:opacity-0 md:group-hover:opacity-100'
                        }`}
                        title="Save to Liked Songs"
                      >
                        <Heart className={`w-4 h-4 ${isLiked(song.id) ? 'fill-[#1ed760]' : ''}`} />
                      </button>
                      <span className="font-mono">{song.duration}</span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-16 text-center text-neutral-400">
                <p className="text-base font-semibold">
                  {playlist.id === 'offline' 
                    ? 'No offline songs imported yet.' 
                    : 'No songs in this playlist yet.'}
                </p>
                {playlist.id === 'offline' ? (
                  <div className="mt-4">
                    <button
                      onClick={() => localFileInputRef.current?.click()}
                      className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#1ed760] to-[#00f2fe] text-black font-extrabold text-xs hover:scale-105 transition shadow-lg shadow-emerald-500/20"
                    >
                      📁 Import MP3 Files from Device
                    </button>
                    <input 
                      type="file" 
                      ref={localFileInputRef} 
                      onChange={(e) => importLocalAudioFiles(e.target.files)} 
                      multiple 
                      accept="audio/*" 
                      className="hidden" 
                    />
                    <p className="text-xs text-neutral-500 mt-2">
                      Supports MP3, WAV, FLAC, AAC. Plays 100% offline without internet.
                    </p>
                  </div>
                ) : (
                  <button
                    onClick={() => setActiveView('search')}
                    className="mt-3 px-5 py-2 rounded-full bg-white text-black font-bold text-xs hover:scale-105 transition"
                  >
                    Find songs to add
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  /* -------------------------------------------------------------------------- */
  /*                            4. LIBRARY VIEW                                 */
  /* -------------------------------------------------------------------------- */
  const renderLibraryView = () => {
    return (
      <div className="space-y-6 pb-32">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Your Library</h1>
          <button
            onClick={() => setIsCreatePlaylistOpen(true)}
            className="flex items-center gap-2 bg-[#1ed760] text-black px-4 py-2 rounded-full text-xs font-bold hover:scale-105 transition"
          >
            <Plus className="w-4 h-4" /> Create Playlist
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          <div
            onClick={() => handlePlaylistSelect('liked')}
            className="bg-gradient-to-br from-indigo-700 to-emerald-600 p-4 rounded-xl cursor-pointer hover:scale-[1.02] transition shadow-xl col-span-2 flex flex-col justify-end min-h-[160px]"
          >
            <Heart className="w-8 h-8 text-white fill-white mb-auto" />
            <h3 className="text-2xl font-black text-white">Liked Songs</h3>
            <p className="text-xs text-white/80 mt-1">{ALL_SONGS.length} auto-synced songs</p>
          </div>

          <div
            onClick={() => handlePlaylistSelect('yt-trending')}
            className="bg-gradient-to-br from-emerald-700 to-teal-900 p-4 rounded-xl cursor-pointer hover:scale-[1.02] transition shadow-xl col-span-2 sm:col-span-1 flex flex-col justify-end min-h-[160px]"
          >
            <Flame className="w-8 h-8 text-white fill-white mb-auto" />
            <h3 className="text-xl font-black text-white">Global Top 50</h3>
            <p className="text-xs text-white/80 mt-1">Worldwide Chart • Lossless</p>
          </div>

          <div
            onClick={() => handlePlaylistSelect('offline')}
            className="bg-gradient-to-br from-cyan-800 to-teal-900 p-4 rounded-xl cursor-pointer hover:scale-[1.02] transition shadow-xl col-span-2 sm:col-span-1 flex flex-col justify-end min-h-[160px]"
          >
            <span className="text-2xl mb-auto">📁</span>
            <h3 className="text-xl font-black text-white">Offline Tracks</h3>
            <p className="text-xs text-white/80 mt-1">{offlineTracks.length} local files</p>
          </div>

          {PLAYLISTS_META.map(pl => (
            <div
              key={pl.id}
              onClick={() => handlePlaylistSelect(pl.id)}
              className="bg-[#181818] hover:bg-[#282828] p-3 rounded-lg cursor-pointer transition shadow-md"
            >
              <img src={pl.cover} alt={pl.title} className="w-full aspect-square object-cover rounded-md mb-2" />
              <h4 className="font-bold text-sm text-white truncate">{pl.title}</h4>
              <p className="text-xs text-neutral-400 truncate">Playlist • {pl.curator}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <main className="flex-1 h-full overflow-y-auto px-4 sm:px-8 py-4 bg-[#121212] select-none">
      {activeView === 'home' && renderHomeView()}
      {activeView === 'search' && renderSearchView()}
      {activeView === 'playlist' && renderPlaylistView()}
      {activeView === 'library' && renderLibraryView()}
    </main>
  );
};
