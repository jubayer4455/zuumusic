import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { ALL_SONGS, PLAYLISTS_META, USER_PROFILE } from '../data/songs';
import { searchYouTubeMusic, fetchTrendingYouTubeMusic } from '../services/youtubeApi';

const MusicContext = createContext(null);

export const MusicProvider = ({ children }) => {
  const [songs, setSongs] = useState(ALL_SONGS);
  const [currentTrack, setCurrentTrack] = useState(ALL_SONGS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(ALL_SONGS[0].durationSec || 165);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState('off'); // 'off' | 'all' | 'one'
  const [currentPlaylist, setCurrentPlaylist] = useState(ALL_SONGS);
  const [activeView, setActiveView] = useState('home'); // 'home' | 'search' | 'library' | 'playlist'
  const [selectedPlaylistId, setSelectedPlaylistId] = useState('top-hits');
  
  // YouTube specific state
  const [isVideoMode, setIsVideoMode] = useState(false);
  const [youtubeTrending, setYoutubeTrending] = useState([]);
  const [youtubeSearchResults, setYoutubeSearchResults] = useState([]);
  const [isSearchingYouTube, setIsSearchingYouTube] = useState(false);

  // Modals & Panels
  const [isMobileNowPlayingOpen, setIsMobileNowPlayingOpen] = useState(false);
  const [isLyricsOpen, setIsLyricsOpen] = useState(false);
  const [isQueueOpen, setIsQueueOpen] = useState(false);
  const [isCreatePlaylistOpen, setIsCreatePlaylistOpen] = useState(false);
  const [isSleepTimerOpen, setIsSleepTimerOpen] = useState(false);
  const [isEqualizerOpen, setIsEqualizerOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [isVisualizerOpen, setIsVisualizerOpen] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [isVipModalOpen, setIsVipModalOpen] = useState(false);
  const [isDeviceModalOpen, setIsDeviceModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [settingsTab, setSettingsTab] = useState('account');
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [connectedDevice, setConnectedDevice] = useState('current');
  const [homeFilter, setHomeFilter] = useState('all');
  const [toastMessage, setToastMessage] = useState(null);

  // User Profile from localStorage
  const [userProfile, setUserProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('zuu_user_profile');
      return saved ? JSON.parse(saved) : USER_PROFILE;
    } catch {
      return USER_PROFILE;
    }
  });

  const updateUserProfile = (newProfile) => {
    setUserProfile(prev => {
      const updated = { ...prev, ...newProfile };
      try {
        localStorage.setItem('zuu_user_profile', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    showToast("Profile updated successfully! ✨");
  };

  // Following Artists from localStorage
  const [followingArtists, setFollowingArtists] = useState(() => {
    try {
      const saved = localStorage.getItem('zuu_following_artists');
      return saved ? JSON.parse(saved) : ['Anupam Roy', 'Sabrina Carpenter'];
    } catch {
      return ['Anupam Roy', 'Sabrina Carpenter'];
    }
  });

  const toggleFollowArtist = (artistName) => {
    setFollowingArtists(prev => {
      const exists = prev.includes(artistName);
      const updated = exists ? prev.filter(a => a !== artistName) : [...prev, artistName];
      try {
        localStorage.setItem('zuu_following_artists', JSON.stringify(updated));
      } catch {}
      showToast(exists ? `Unfollowed ${artistName}` : `Following ${artistName} ✨`);
      return updated;
    });
  };

  const isFollowingArtist = (artistName) => followingArtists.includes(artistName);

  // Audio Quality & Engine Settings
  const [audioQuality, setAudioQualityState] = useState(() => localStorage.getItem('zuu_audio_quality') || 'master320');
  const [crossfadeSec, setCrossfadeSecState] = useState(() => parseInt(localStorage.getItem('zuu_crossfade') || '0', 10));
  const [normalizeAudio, setNormalizeAudio] = useState(true);

  const setAudioQuality = (q) => {
    setAudioQualityState(q);
    try { localStorage.setItem('zuu_audio_quality', q); } catch {}
    const labels = {
      master320: 'Master Lossless 320kbps',
      high256: 'High Fidelity 256kbps AAC',
      normal160: 'Standard 160kbps MP3',
      saver96: 'Data Saver 96kbps'
    };
    showToast(`Audio Quality set to ${labels[q] || q} 🎧`);
  };

  const setCrossfadeSec = (sec) => {
    setCrossfadeSecState(sec);
    try { localStorage.setItem('zuu_crossfade', sec.toString()); } catch {}
  };

  // Notifications State
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Master 320k Lossless Audio Active",
      message: "Studio-grade DSP equalizer and full dynamic 320kbps stream enabled.",
      time: "Just now",
      unread: true,
      tag: "Audio"
    },
    {
      id: 2,
      title: "Offline Storage Ready",
      message: "Direct MP3 file caching enabled. Plays offline without WiFi or mobile data.",
      time: "10m ago",
      unread: true,
      tag: "Offline"
    },
    {
      id: 3,
      title: "Worldwide Top 50 Hits Refreshed",
      message: "Daily global chart-toppers updated with official high-quality masters.",
      time: "2h ago",
      unread: false,
      tag: "Music"
    },
    {
      id: 4,
      title: "Zuu VIP Individual Membership",
      message: "Unlimited downloads, zero ads & lock screen background playback active.",
      time: "1d ago",
      unread: false,
      tag: "VIP"
    }
  ]);

  const markNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
    showToast("All notifications marked as read ✓");
  };

  // History Navigation Stack
  const [navHistory, setNavHistory] = useState([{ view: 'home', playlistId: null }]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const navigateToView = (view, playlistId = null) => {
    setActiveView(view);
    if (playlistId !== undefined) {
      setSelectedPlaylistId(playlistId);
    }
    setNavHistory(prev => {
      const nextHist = prev.slice(0, historyIndex + 1);
      nextHist.push({ view, playlistId: playlistId ?? (view === 'playlist' ? selectedPlaylistId : null) });
      return nextHist;
    });
    setHistoryIndex(prev => prev + 1);
  };

  const goBack = () => {
    if (historyIndex > 0) {
      const target = navHistory[historyIndex - 1];
      setHistoryIndex(prev => prev - 1);
      setActiveView(target.view);
      if (target.playlistId) setSelectedPlaylistId(target.playlistId);
      triggerHaptic('light');
    }
  };

  const goForward = () => {
    if (historyIndex < navHistory.length - 1) {
      const target = navHistory[historyIndex + 1];
      setHistoryIndex(prev => prev + 1);
      setActiveView(target.view);
      if (target.playlistId) setSelectedPlaylistId(target.playlistId);
      triggerHaptic('light');
    }
  };

  const canGoBack = historyIndex > 0;
  const canGoForward = historyIndex < navHistory.length - 1;

  // Equalizer & Audio Engine State
  const [eqPreset, setEqPreset] = useState('flat');
  const [eqGains, setEqGains] = useState([0, 0, 0, 0, 0]);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [isCrossfadeEnabled, setIsCrossfadeEnabled] = useState(true);

  // Web Audio API refs
  const audioCtxRef = useRef(null);
  const analyserNodeRef = useRef(null);
  const eqFiltersRef = useRef([]);

  // Sleep Timer state
  const [sleepTimerSecondsLeft, setSleepTimerSecondsLeft] = useState(null);
  const [isSleepTimerEndOfTrack, setIsSleepTimerEndOfTrack] = useState(false);

  // Downloaded Song IDs from localStorage
  const [downloadedSongIds, setDownloadedSongIds] = useState(() => {
    try {
      const saved = localStorage.getItem('zuu_downloaded_songs');
      return saved ? JSON.parse(saved) : ['song-1', 'song-2'];
    } catch {
      return ['song-1', 'song-2'];
    }
  });

  // Offline / Local Songs State
  const [offlineTracks, setOfflineTracks] = useState(() => {
    try {
      const saved = localStorage.getItem('zuu_offline_cached_tracks');
      return saved ? JSON.parse(saved) : ALL_SONGS.slice(0, 3).map(s => ({ ...s, isOffline: true }));
    } catch {
      return ALL_SONGS.slice(0, 3).map(s => ({ ...s, isOffline: true }));
    }
  });

  // PWA Install Prompt
  const [deferredInstallPrompt, setDeferredInstallPrompt] = useState(null);
  const [isPwaInstalled, setIsPwaInstalled] = useState(false);

  // Search filter query
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState(null);

  // Liked Songs from localStorage
  const [likedSongIds, setLikedSongIds] = useState(() => {
    try {
      const saved = localStorage.getItem('zuu_music_liked_songs') || localStorage.getItem('spotify_liked_songs');
      return saved ? JSON.parse(saved) : ['song-1', 'song-2', 'song-3'];
    } catch {
      return ['song-1', 'song-2', 'song-3'];
    }
  });

  // Custom User Playlists from localStorage
  const [customPlaylists, setCustomPlaylists] = useState(() => {
    try {
      const saved = localStorage.getItem('zuu_music_custom_playlists') || localStorage.getItem('spotify_custom_playlists');
      return saved ? JSON.parse(saved) : [
        {
          id: 'my-favorites-2026',
          title: 'My Bangla & English Mix',
          description: 'Personal handpicked favorites for late nights.',
          cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
          songIds: ['song-1', 'song-3', 'song-8'],
          curator: USER_PROFILE.name
        }
      ];
    } catch {
      return [];
    }
  });

  // Primary Unified Audio Engine
  const audioRef = useRef(new Audio());
  const youtubePlayerRef = useRef(null);

  // User explicitly paused ref
  const userExplicitlyPausedRef = useRef(false);
  const isPlayingRef = useRef(isPlaying);
  const currentTrackRef = useRef(currentTrack);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    currentTrackRef.current = currentTrack;
  }, [currentTrack]);

  // Toast notification helper
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Native Haptic Touch Vibration for PWA Native Mobile Feel
  const triggerHaptic = (style = 'light') => {
    try {
      if (typeof window !== 'undefined' && 'vibrate' in navigator) {
        if (style === 'heavy') {
          navigator.vibrate([15, 35, 15]);
        } else if (style === 'medium') {
          navigator.vibrate(18);
        } else {
          navigator.vibrate(10);
        }
      }
    } catch (e) {}
  };

  // Configure single unified audio element on mount
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.preload = 'auto';
      audio.setAttribute('playsinline', 'true');
      audio.setAttribute('webkit-playsinline', 'true');
      audio.setAttribute('x-webkit-airplay', 'allow');
    }

    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
      setIsPwaInstalled(true);
    }
  }, []);

  // Capture PWA beforeinstallprompt event
  useEffect(() => {
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const triggerInstallApp = () => {
    if (deferredInstallPrompt) {
      deferredInstallPrompt.prompt();
      deferredInstallPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          showToast("Zuu Music installed to Mobile Home Screen! 📱✨");
          setIsPwaInstalled(true);
        }
        setDeferredInstallPrompt(null);
      });
    } else {
      setIsInstallModalOpen(true);
    }
  };

  // Sync liked songs to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('zuu_music_liked_songs', JSON.stringify(likedSongIds));
    } catch (e) {
      console.warn("Could not save to localStorage", e);
    }
  }, [likedSongIds]);

  // Sync custom playlists to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('zuu_music_custom_playlists', JSON.stringify(customPlaylists));
    } catch (e) {
      console.warn("Could not save to localStorage", e);
    }
  }, [customPlaylists]);

  // Sync downloaded songs to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('zuu_downloaded_songs', JSON.stringify(downloadedSongIds));
    } catch (e) {
      console.warn("Could not save downloaded songs to localStorage", e);
    }
  }, [downloadedSongIds]);

  // Fetch YouTube Trending tracks on startup
  useEffect(() => {
    const loadYouTubeTrending = async () => {
      try {
        const trending = await fetchTrendingYouTubeMusic(12);
        if (trending && trending.length > 0) {
          setYoutubeTrending(trending);
        }
      } catch (err) {
        console.error("Failed to load YouTube trending tracks:", err);
      }
    };
    loadYouTubeTrending();
  }, []);

  // Sleep Timer Countdown Tick
  useEffect(() => {
    if (sleepTimerSecondsLeft === null) return;

    if (sleepTimerSecondsLeft <= 0) {
      if (isPlaying) togglePlay();
      setSleepTimerSecondsLeft(null);
      showToast("Sleep timer ended. Goodnight! 🌙😴");
      return;
    }

    const timer = setInterval(() => {
      setSleepTimerSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [sleepTimerSecondsLeft, isPlaying]);

  const setSleepTimer = (val) => {
    if (val === 'end_of_track') {
      setIsSleepTimerEndOfTrack(true);
      setSleepTimerSecondsLeft(null);
      showToast("Sleep timer set: Audio will stop at end of this track 🌙");
    } else {
      setIsSleepTimerEndOfTrack(false);
      setSleepTimerSecondsLeft(val * 60);
      showToast(`Sleep timer set for ${val} minutes 🌙`);
    }
  };

  const cancelSleepTimer = () => {
    setSleepTimerSecondsLeft(null);
    setIsSleepTimerEndOfTrack(false);
    showToast("Sleep timer turned off");
  };

  // -------------------------------------------------------------
  // Studio Equalizer (EQ) & Web Audio Engine
  // -------------------------------------------------------------
  const PRESET_GAINS = {
    flat: [0, 0, 0, 0, 0],
    bass: [8, 5, 1, -1, -2],
    vocal: [-2, -1, 4, 6, 2],
    rock: [5, 3, -1, 3, 5],
    latenight: [3, 2, 0, -3, -6],
    lofi: [4, 2, -2, -4, -5],
  };

  const initWebAudio = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume().catch(() => {});
      }
    } catch (e) {
      console.warn("Web Audio API context:", e);
    }
  };

  const setEqBandGain = (index, value) => {
    setEqGains(prev => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
    setEqPreset('custom');
    if (eqFiltersRef.current && eqFiltersRef.current[index]) {
      try {
        eqFiltersRef.current[index].gain.value = value;
      } catch (e) {}
    }
  };

  const applyEqPreset = (presetId) => {
    const targetGains = PRESET_GAINS[presetId] || [0, 0, 0, 0, 0];
    setEqPreset(presetId);
    setEqGains(targetGains);
    targetGains.forEach((gain, idx) => {
      if (eqFiltersRef.current && eqFiltersRef.current[idx]) {
        try {
          eqFiltersRef.current[idx].gain.value = gain;
        } catch (e) {}
      }
    });
    showToast(`EQ Profile: ${presetId.toUpperCase()} active 🎛️`);
  };

  const resetEq = () => {
    applyEqPreset('flat');
    showToast("EQ reset to Flat / Studio balance");
  };

  const setPlaybackSpeedLevel = (speed) => {
    setPlaybackSpeed(speed);
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
    showToast(`Playback speed: ${speed}x ⚡`);
  };

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        e.target.tagName === 'INPUT' || 
        e.target.tagName === 'TEXTAREA' || 
        e.target.isContentEditable
      ) {
        return;
      }

      if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        seekTo(Math.max(0, audioRef.current.currentTime - 5));
        showToast("⏪ 5s back");
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        seekTo(Math.min(duration, audioRef.current.currentTime + 5));
        showToast("⏩ 5s forward");
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setVolumeLevel(Math.min(1, volume + 0.05));
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setVolumeLevel(Math.max(0, volume - 0.05));
      } else if (e.key.toLowerCase() === 'm') {
        toggleMute();
      } else if (e.key.toLowerCase() === 'l' && currentTrack) {
        toggleLike(currentTrack.id);
      } else if (e.key.toLowerCase() === 's') {
        toggleShuffle();
      } else if (e.key.toLowerCase() === 'r') {
        toggleRepeat();
      } else if (e.key.toLowerCase() === 'j') {
        handlePrevTrack();
      } else if (e.key.toLowerCase() === 'k') {
        handleNextTrack();
      } else if (e.key.toLowerCase() === 'e') {
        setIsEqualizerOpen(prev => !prev);
      } else if (e.key.toLowerCase() === 'v' && currentTrack?.isYouTube) {
        setIsVideoMode(prev => !prev);
      } else if (e.key === '?' || (e.shiftKey && e.key === '/')) {
        setIsShortcutsOpen(prev => !prev);
      } else if (e.key === 'Escape') {
        setIsEqualizerOpen(false);
        setIsShortcutsOpen(false);
        setIsSleepTimerOpen(false);
        setIsCreatePlaylistOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, volume, currentTrack, duration]);

  // Media Session API Setup for Lockscreen & Background Playback
  useEffect(() => {
    if ('mediaSession' in navigator && currentTrack) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: currentTrack.title,
        artist: currentTrack.artist,
        album: currentTrack.album || 'Zuu Music',
        artwork: [
          { src: currentTrack.cover, sizes: '96x96', type: 'image/jpeg' },
          { src: currentTrack.cover, sizes: '128x128', type: 'image/jpeg' },
          { src: currentTrack.cover, sizes: '192x192', type: 'image/jpeg' },
          { src: currentTrack.cover, sizes: '512x512', type: 'image/jpeg' }
        ]
      });

      navigator.mediaSession.setActionHandler('play', () => {
        userExplicitlyPausedRef.current = false;
        const audio = audioRef.current;
        if (audio && audio.paused) {
          audio.play().then(() => setIsPlaying(true)).catch(() => {});
        }
      });
      navigator.mediaSession.setActionHandler('pause', () => {
        userExplicitlyPausedRef.current = true;
        const audio = audioRef.current;
        if (audio && !audio.paused) {
          audio.pause();
          setIsPlaying(false);
        }
      });
      navigator.mediaSession.setActionHandler('previoustrack', () => {
        handlePrevTrack();
      });
      navigator.mediaSession.setActionHandler('nexttrack', () => {
        handleNextTrack();
      });
      navigator.mediaSession.setActionHandler('seekto', (details) => {
        if (details.seekTime !== undefined) {
          seekTo(details.seekTime);
        }
      });
      navigator.mediaSession.setActionHandler('seekbackward', () => {
        seekTo(Math.max(0, currentTime - 10));
      });
      navigator.mediaSession.setActionHandler('seekforward', () => {
        seekTo(Math.min(duration, currentTime + 10));
      });
    }
  }, [currentTrack]);

  // Update Media Session Playback State
  useEffect(() => {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';
    }
  }, [isPlaying]);

  // Live YouTube search debounce effect
  useEffect(() => {
    if (!searchQuery.trim()) {
      setYoutubeSearchResults([]);
      setIsSearchingYouTube(false);
      return;
    }

    setIsSearchingYouTube(true);
    const timeout = setTimeout(async () => {
      try {
        const results = await searchYouTubeMusic(searchQuery, 15);
        setYoutubeSearchResults(results);
      } catch (error) {
        console.error("Search YouTube error:", error);
      } finally {
        setIsSearchingYouTube(false);
      }
    }, 450);

    return () => clearTimeout(timeout);
  }, [searchQuery]);

  // HTML5 Audio setup and listeners
  useEffect(() => {
    const audio = audioRef.current;
    audio.volume = isMuted ? 0 : volume;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      if (audio.duration && !isNaN(audio.duration) && audio.duration > 0) {
        setDuration(audio.duration);
      }
    };

    const handleLoadedMetadata = () => {
      if (audio.duration && !isNaN(audio.duration) && audio.duration > 0) {
        setDuration(audio.duration);
      }
    };

    const handleEnded = () => {
      if (isSleepTimerEndOfTrack) {
        setIsPlaying(false);
        setIsSleepTimerEndOfTrack(false);
        showToast("Sleep timer: Music stopped at end of track. Goodnight! 🌙");
        return;
      }

      if (repeatMode === 'one') {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      } else {
        handleNextTrack();
      }
    };

    const handleAudioError = () => {
      console.warn("Audio element error on src, trying fallbackUrl:", audio.src);
      if (currentTrack?.fallbackUrl && audio.src !== currentTrack.fallbackUrl) {
        audio.src = currentTrack.fallbackUrl;
        audio.load();
        audio.play().then(() => setIsPlaying(true)).catch(() => {});
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleAudioError);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleAudioError);
    };
  }, [repeatMode, currentTrack, isSleepTimerEndOfTrack]);

  // Update volume on both players
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Handle Track Playback Routing
  const playTrack = (track, playlist = null) => {
    if (playlist && playlist.length > 0) {
      setCurrentPlaylist(playlist);
    }

    if (currentTrack?.id === track.id) {
      togglePlay();
      return;
    }

    setCurrentTrack(track);
    setCurrentTime(0);
    setDuration(track.durationSec || 180);
    setIsPlaying(true);
    userExplicitlyPausedRef.current = false;

    initWebAudio();

    // Stream URL: Both YouTube and catalog tracks stream native audio through HTML5 <audio>
    // This enables 100% continuous background & lock screen playback on mobile devices!
    const streamUrl = track.isYouTube ? `/api/stream?id=${track.youtubeId}` : track.audioUrl;

    const audio = audioRef.current;
    if (!audio) return;

    audio.pause();
    audio.playbackRate = playbackSpeed;
    audio.volume = isMuted ? 0 : volume;
    audio.src = streamUrl;

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.warn("Direct audio playback catch, trying fallbackUrl:", err);
        if (track.fallbackUrl && audio.src !== track.fallbackUrl) {
          audio.src = track.fallbackUrl;
          audio.play().then(() => setIsPlaying(true)).catch(() => {});
        }
      });
    }

    // If user is currently in Video Mode, sync the YouTube iframe canvas visually:
    if (isVideoMode && track.youtubeId) {
      const ytPlayer = youtubePlayerRef.current;
      if (ytPlayer && typeof ytPlayer.loadVideoById === 'function') {
        try {
          if (typeof ytPlayer.mute === 'function') ytPlayer.mute();
          ytPlayer.loadVideoById({ videoId: track.youtubeId, startSeconds: 0 });
          ytPlayer.playVideo();
        } catch (e) {}
      }
    }
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    const ytPlayer = youtubePlayerRef.current;

    if (isPlaying) {
      userExplicitlyPausedRef.current = true;
      setIsPlaying(false);
      try { audio.pause(); } catch (e) {}
      if (ytPlayer && typeof ytPlayer.pauseVideo === 'function') {
        try { ytPlayer.pauseVideo(); } catch (e) {}
      }
    } else {
      userExplicitlyPausedRef.current = false;
      setIsPlaying(true);
      initWebAudio();

      audio.playbackRate = playbackSpeed;
      audio.volume = isMuted ? 0 : volume;

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          setIsPlaying(true);
          if (isVideoMode && ytPlayer && typeof ytPlayer.playVideo === 'function') {
            try { ytPlayer.playVideo(); } catch (e) {}
          }
        }).catch((err) => {
          console.warn("Toggle play audio catch, trying fallbackUrl:", err);
          if (currentTrack?.fallbackUrl && audio.src !== currentTrack.fallbackUrl) {
            audio.src = currentTrack.fallbackUrl;
            audio.load();
            audio.play().then(() => setIsPlaying(true)).catch(() => {});
          }
        });
      }
    }
  };

  const handleNextTrack = () => {
    if (isSleepTimerEndOfTrack) {
      setIsPlaying(false);
      setIsSleepTimerEndOfTrack(false);
      showToast("Sleep timer: Track ended, stopping playback. Goodnight! 🌙");
      return;
    }

    if (!currentPlaylist || currentPlaylist.length === 0) return;
    const currentIndex = currentPlaylist.findIndex(t => t.id === currentTrack?.id);
    let nextIndex;

    if (isShuffle) {
      nextIndex = Math.floor(Math.random() * currentPlaylist.length);
      if (nextIndex === currentIndex && currentPlaylist.length > 1) {
        nextIndex = (currentIndex + 1) % currentPlaylist.length;
      }
    } else {
      if (currentIndex === currentPlaylist.length - 1) {
        if (repeatMode === 'all') {
          nextIndex = 0;
        } else {
          setIsPlaying(false);
          return;
        }
      } else {
        nextIndex = currentIndex + 1;
      }
    }

    if (nextIndex >= 0 && nextIndex < currentPlaylist.length) {
      playTrack(currentPlaylist[nextIndex], currentPlaylist);
    }
  };

  const handlePrevTrack = () => {
    if (currentTime > 3) {
      seekTo(0);
      return;
    }
    if (!currentPlaylist || currentPlaylist.length === 0) return;
    const currentIndex = currentPlaylist.findIndex(t => t.id === currentTrack?.id);
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : currentPlaylist.length - 1;
    playTrack(currentPlaylist[prevIndex], currentPlaylist);
  };

  const seekTo = (seconds) => {
    setCurrentTime(seconds);
    const isYt = currentTrack?.isYouTube;
    const ytPlayer = youtubePlayerRef.current;

    if (isYt && ytPlayer && typeof ytPlayer.seekTo === 'function') {
      try {
        ytPlayer.seekTo(seconds, true);
      } catch (e) {}
    } else if (audioRef.current && !isNaN(seconds)) {
      try {
        audioRef.current.currentTime = seconds;
      } catch (e) {}
    }
  };

  const setVolumeLevel = (val) => {
    const newVol = Math.max(0, Math.min(1, val));
    setVolume(newVol);
    if (newVol > 0 && isMuted) {
      setIsMuted(false);
    }
    if (audioRef.current) {
      audioRef.current.volume = newVol;
    }
    const ytPlayer = youtubePlayerRef.current;
    if (ytPlayer && typeof ytPlayer.setVolume === 'function') {
      try {
        ytPlayer.setVolume(Math.round(newVol * 100));
        if (newVol > 0 && typeof ytPlayer.unMute === 'function') {
          ytPlayer.unMute();
        }
      } catch (e) {}
    }
  };

  const toggleMute = () => {
    setIsMuted(prev => {
      const next = !prev;
      if (audioRef.current) {
        audioRef.current.volume = next ? 0 : volume;
      }
      const ytPlayer = youtubePlayerRef.current;
      if (ytPlayer) {
        try {
          if (next) {
            if (typeof ytPlayer.mute === 'function') ytPlayer.mute();
          } else {
            if (typeof ytPlayer.unMute === 'function') ytPlayer.unMute();
            if (typeof ytPlayer.setVolume === 'function') ytPlayer.setVolume(Math.round(volume * 100));
          }
        } catch (e) {}
      }
      return next;
    });
  };

  const toggleShuffle = () => {
    setIsShuffle(!isShuffle);
    showToast(!isShuffle ? "Shuffle on" : "Shuffle off");
  };

  const toggleRepeat = () => {
    if (repeatMode === 'off') {
      setRepeatMode('all');
      showToast("Repeat playlist on");
    } else if (repeatMode === 'all') {
      setRepeatMode('one');
      showToast("Repeat track on");
    } else {
      setRepeatMode('off');
      showToast("Repeat off");
    }
  };

  const toggleLike = (songId) => {
    if (likedSongIds.includes(songId)) {
      setLikedSongIds(likedSongIds.filter(id => id !== songId));
      showToast("Removed from Liked Songs");
    } else {
      setLikedSongIds([...likedSongIds, songId]);
      showToast("Added to Liked Songs");
    }
  };

  const isLiked = (songId) => likedSongIds.includes(songId);

  // Download Track to Mobile Device / Offline Storage
  const downloadTrack = async (track) => {
    if (!track) return;
    showToast(`Downloading "${track.title}" to device... ⬇️`);

    setDownloadedSongIds(prev => {
      const updated = prev.includes(track.id) ? prev : [...prev, track.id];
      try {
        localStorage.setItem('zuu_downloaded_songs', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    setOfflineTracks(prev => {
      if (prev.some(t => t.id === track.id)) return prev;
      const offlineItem = { ...track, isOffline: true, dateAdded: 'Downloaded' };
      const updated = [offlineItem, ...prev];
      try {
        localStorage.setItem('zuu_offline_cached_tracks', JSON.stringify(updated.slice(0, 50)));
      } catch (e) {}
      return updated;
    });

    const targetUrl = track.isYouTube
      ? `/api/stream?id=${track.youtubeId}&download=1`
      : track.audioUrl;

    if (targetUrl && !targetUrl.startsWith('blob:')) {
      try {
        const response = await fetch(targetUrl);
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = `${track.title} - ${track.artist || 'Zuu Music'}.mp3`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
      } catch (err) {
        const a = document.createElement('a');
        a.href = targetUrl;
        a.download = `${track.title}.mp3`;
        a.target = '_blank';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    }

    showToast(`"${track.title}" downloaded! Available in Offline Library ✅`);
  };

  const isDownloaded = (trackId) => downloadedSongIds.includes(trackId);

  // Local MP3 Offline Importer
  const importLocalAudioFiles = (fileList) => {
    if (!fileList || fileList.length === 0) return;

    const newTracks = Array.from(fileList).map((file, idx) => {
      const cleanTitle = file.name.replace(/\.[^/.]+$/, "").replace(/_/g, " ");
      const blobUrl = URL.createObjectURL(file);

      return {
        id: `offline-${Date.now()}-${idx}`,
        title: cleanTitle,
        artist: "Offline Track • Local Device",
        album: "Local Storage",
        duration: "3:30",
        durationSec: 210,
        cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80",
        audioUrl: blobUrl,
        isOffline: true,
        dateAdded: "Imported"
      };
    });

    setOfflineTracks((prev) => [...newTracks, ...prev]);
    showToast(`Imported ${newTracks.length} offline tracks! 🎧`);
    setSelectedPlaylistId('offline');
    setActiveView('playlist');
    if (newTracks.length > 0) {
      playTrack(newTracks[0], [...newTracks, ...offlineTracks]);
    }
  };

  const createPlaylist = (title, description = '') => {
    const newPlaylist = {
      id: 'custom-' + Date.now(),
      title: title.trim() || 'My Playlist #' + (customPlaylists.length + 1),
      description: description || 'Created by ' + USER_PROFILE.name,
      cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
      songIds: [],
      curator: USER_PROFILE.name
    };
    setCustomPlaylists([newPlaylist, ...customPlaylists]);
    showToast(`Playlist "${newPlaylist.title}" created!`);
    setSelectedPlaylistId(newPlaylist.id);
    setActiveView('playlist');
    return newPlaylist;
  };

  const addSongToCustomPlaylist = (playlistId, songId) => {
    setCustomPlaylists(prev => prev.map(pl => {
      if (pl.id === playlistId) {
        if (!pl.songIds.includes(songId)) {
          showToast(`Added to "${pl.title}"`);
          return { ...pl, songIds: [...pl.songIds, songId] };
        } else {
          showToast(`Already in "${pl.title}"`);
          return pl;
        }
      }
      return pl;
    }));
  };

  const formatTime = (timeInSec) => {
    if (isNaN(timeInSec) || timeInSec === undefined) return "0:00";
    const minutes = Math.floor(timeInSec / 60);
    const seconds = Math.floor(timeInSec % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const getSelectedPlaylistData = () => {
    if (selectedPlaylistId === 'offline') {
      return {
        id: 'offline',
        title: 'Offline & Downloaded Tracks',
        description: 'Downloaded and local songs saved on your phone. Plays 100% offline with screen locked!',
        cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
        color: 'from-cyan-900',
        gradient: 'linear-gradient(to bottom, #0e7490, #121212)',
        followers: '1',
        likes: offlineTracks.length,
        curator: 'Phone Storage',
        tracks: offlineTracks
      };
    }

    if (selectedPlaylistId === 'liked') {
      const allKnown = [...ALL_SONGS, ...youtubeTrending, ...youtubeSearchResults, ...offlineTracks];
      const likedTracks = allKnown.filter(s => likedSongIds.includes(s.id));
      return {
        id: 'liked',
        title: 'Liked Songs',
        description: `${USER_PROFILE.name}'s collection of favorite songs.`,
        cover: 'https://misc.scdn.co/liked-songs/liked-songs-640.png',
        color: 'from-indigo-900',
        gradient: 'linear-gradient(to bottom, #4f46e5, #121212)',
        followers: '1',
        likes: likedTracks.length,
        curator: USER_PROFILE.name,
        tracks: likedTracks
      };
    }

    if (selectedPlaylistId === 'yt-trending') {
      return {
        id: 'yt-trending',
        title: 'Global Top 50 Worldwide',
        description: 'Worldwide chart-topping hits streaming directly in Master 320kbps Lossless Audio.',
        cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
        color: 'from-emerald-900',
        gradient: 'linear-gradient(to bottom, #065f46, #121212)',
        followers: '52,109,300',
        likes: '4,102,900',
        curator: 'Zuu Music Master Chart',
        tracks: youtubeTrending
      };
    }

    const custom = customPlaylists.find(p => p.id === selectedPlaylistId);
    if (custom) {
      const allKnown = [...ALL_SONGS, ...youtubeTrending, ...youtubeSearchResults, ...offlineTracks];
      const customTracks = allKnown.filter(s => custom.songIds?.includes(s.id));
      return {
        ...custom,
        color: 'from-teal-900',
        gradient: 'linear-gradient(to bottom, #115e59, #121212)',
        tracks: customTracks
      };
    }

    const meta = PLAYLISTS_META.find(p => p.id === selectedPlaylistId) || PLAYLISTS_META[0];
    const tracks = ALL_SONGS.filter(s => s.playlistId === meta.id);
    return {
      ...meta,
      tracks: tracks.length > 0 ? tracks : ALL_SONGS.slice(0, 5)
    };
  };

  return (
    <MusicContext.Provider value={{
      songs,
      currentTrack,
      isPlaying,
      currentTime,
      duration,
      volume,
      isMuted,
      isShuffle,
      repeatMode,
      currentPlaylist,
      activeView,
      setActiveView,
      selectedPlaylistId,
      setSelectedPlaylistId,
      likedSongIds,
      customPlaylists,
      downloadedSongIds,
      downloadTrack,
      isDownloaded,
      isVideoMode,
      setIsVideoMode,
      youtubeTrending,
      youtubeSearchResults,
      isSearchingYouTube,
      isMobileNowPlayingOpen,
      setIsMobileNowPlayingOpen,
      isLyricsOpen,
      setIsLyricsOpen,
      isQueueOpen,
      setIsQueueOpen,
      isCreatePlaylistOpen,
      setIsCreatePlaylistOpen,
      isSleepTimerOpen,
      setIsSleepTimerOpen,
      isEqualizerOpen,
      setIsEqualizerOpen,
      isShortcutsOpen,
      setIsShortcutsOpen,
      isVisualizerOpen,
      setIsVisualizerOpen,
      isInstallModalOpen,
      setIsInstallModalOpen,
      deferredInstallPrompt,
      setDeferredInstallPrompt,
      eqPreset,
      eqGains,
      setEqBandGain,
      applyEqPreset,
      resetEq,
      playbackSpeed,
      setPlaybackSpeedLevel,
      isCrossfadeEnabled,
      setIsCrossfadeEnabled,
      analyserNodeRef,
      sleepTimerSecondsLeft,
      isSleepTimerEndOfTrack,
      setSleepTimer,
      cancelSleepTimer,
      offlineTracks,
      importLocalAudioFiles,
      triggerInstallApp,
      isPwaInstalled,
      searchQuery,
      setSearchQuery,
      selectedGenre,
      setSelectedGenre,
      toastMessage,
      showToast,
      triggerHaptic,
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
      isLiked,
      createPlaylist,
      addSongToCustomPlaylist,
      formatTime,
      getSelectedPlaylistData,
      youtubePlayerRef,
      userExplicitlyPausedRef,
      setIsPlaying,
      setCurrentTime,
      setDuration,
      userProfile,
      updateUserProfile,
      // Modals & Panels
      isVipModalOpen,
      setIsVipModalOpen,
      isDeviceModalOpen,
      setIsDeviceModalOpen,
      isSettingsModalOpen,
      setIsSettingsModalOpen,
      settingsTab,
      setSettingsTab,
      isNotificationsOpen,
      setIsNotificationsOpen,
      notifications,
      markNotificationsAsRead,
      // Device & History
      connectedDevice,
      setConnectedDevice,
      navHistory,
      navigateToView,
      goBack,
      goForward,
      canGoBack,
      canGoForward,
      homeFilter,
      setHomeFilter,
      // Artist Follow
      followingArtists,
      toggleFollowArtist,
      isFollowingArtist,
      // Audio Settings & Offline Cache
      audioQuality,
      setAudioQuality,
      crossfadeSec,
      setCrossfadeSec,
      normalizeAudio,
      setNormalizeAudio,
      clearOfflineCache: () => {
        const count = offlineTracks.length;
        setOfflineTracks([]);
        setDownloadedSongIds([]);
        try {
          localStorage.removeItem('zuu_offline_cached_tracks');
          localStorage.removeItem('zuu_downloaded_songs');
        } catch {}
        showToast(`Cleared ${count} cached tracks (~${(count * 5.8).toFixed(1)} MB freed) 🧹`);
      },
      downloadAllTracks: async (tracks) => {
        if (!tracks || tracks.length === 0) return;
        showToast(`Downloading ${tracks.length} tracks to offline storage... 📥`);
        for (const tr of tracks.slice(0, 5)) {
          await downloadTrack(tr);
        }
      }
    }}>
      <audio
        ref={audioRef}
        id="zuu-master-audio"
        playsInline
        webkit-playsinline="true"
        x-webkit-airplay="allow"
        preload="auto"
        className="hidden"
      />
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
};
