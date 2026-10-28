import React, { useEffect, useRef } from 'react';
import { useMusic } from '../context/MusicContext';
import { X } from 'lucide-react';

export const YouTubePlayer = () => {
  const {
    currentTrack,
    isPlaying,
    setIsPlaying,
    currentTime,
    setCurrentTime,
    duration,
    setDuration,
    volume,
    isMuted,
    isVideoMode,
    setIsVideoMode,
    youtubePlayerRef,
    handleNextTrack
  } = useMusic();

  const containerRef = useRef(null);
  const internalPlayerRef = useRef(null);

  // Initialize YouTube IFrame API
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

    const initPlayer = () => {
      if (!window.YT || !window.YT.Player) return;

      internalPlayerRef.current = new window.YT.Player('yt-iframe-player', {
        height: '100%',
        width: '100%',
        videoId: currentTrack?.youtubeId || 'jfKfPfyJRdk',
        playerVars: {
          autoplay: 0,
          controls: 1,
          disablekb: 0,
          fs: 1,
          modestbranding: 1,
          rel: 0,
          playsinline: 1,
          enablejsapi: 1,
          origin: window.location.origin
        },
        events: {
          onReady: (event) => {
            youtubePlayerRef.current = event.target;
            try {
              if (isMuted) {
                event.target.mute();
              } else {
                event.target.unMute();
                event.target.setVolume(Math.round(volume * 100));
              }
            } catch (e) {}

            if (currentTrack?.isYouTube && currentTrack.youtubeId) {
              if (isPlaying) {
                event.target.loadVideoById({
                  videoId: currentTrack.youtubeId,
                  startSeconds: currentTime || 0
                });
                event.target.playVideo();
              } else {
                event.target.cueVideoById(currentTrack.youtubeId);
              }
            }
          },
          onStateChange: (event) => {
            // YT.PlayerState.ENDED is 0
            if (event.data === 0) {
              handleNextTrack();
            } else if (event.data === 1) { // PLAYING
              setIsPlaying(true);
            } else if (event.data === 2) { // PAUSED
              // Optional sync if user paused natively inside the video iframe
            }
          },
          onError: (err) => {
            console.warn("YouTube player warning/fallback:", err?.data);
          }
        }
      });
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      window.onYouTubeIframeAPIReady = initPlayer;
    }

    return () => {
      if (internalPlayerRef.current && internalPlayerRef.current.destroy) {
        try {
          internalPlayerRef.current.destroy();
        } catch (e) {}
      }
    };
  }, []);

  // Poll current time and duration when YouTube track is playing
  useEffect(() => {
    let interval;
    if (isPlaying && currentTrack?.isYouTube) {
      interval = setInterval(() => {
        const player = youtubePlayerRef.current;
        if (player && typeof player.getCurrentTime === 'function') {
          try {
            const ct = player.getCurrentTime();
            const dur = player.getDuration();
            if (!isNaN(ct) && ct >= 0) {
              setCurrentTime(ct);
            }
            if (!isNaN(dur) && dur > 0) {
              setDuration(dur);
            }
          } catch (e) {}
        }
      }, 500);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, currentTrack?.isYouTube, currentTrack?.id]);

  // Synchronize playback state changes with YouTube player
  useEffect(() => {
    const player = youtubePlayerRef.current;
    if (!player || !currentTrack?.isYouTube) return;

    if (isPlaying) {
      if (typeof player.playVideo === 'function') {
        try {
          if (!isMuted && typeof player.unMute === 'function') player.unMute();
          player.playVideo();
        } catch (e) {}
      }
    } else {
      if (typeof player.pauseVideo === 'function') {
        try {
          player.pauseVideo();
        } catch (e) {}
      }
    }
  }, [isPlaying, currentTrack?.isYouTube]);

  // Sync volume & mute changes to YouTube player
  useEffect(() => {
    const player = youtubePlayerRef.current;
    if (!player) return;
    try {
      if (isMuted) {
        if (typeof player.mute === 'function') player.mute();
      } else {
        if (typeof player.unMute === 'function') player.unMute();
        if (typeof player.setVolume === 'function') {
          player.setVolume(Math.round(volume * 100));
        }
      }
    } catch (e) {}
  }, [volume, isMuted]);

  return (
    <div 
      ref={containerRef}
      className={`transition-all duration-300 shadow-2xl rounded-xl overflow-hidden border border-white/20 bg-black ${
        isVideoMode 
          ? 'fixed bottom-24 right-4 sm:right-6 w-80 sm:w-96 aspect-video opacity-100 scale-100 z-50 pointer-events-auto' 
          : 'fixed -bottom-[999px] -right-[999px] w-[320px] h-[180px] opacity-0 pointer-events-none -z-50'
      }`}
    >
      {isVideoMode && (
        <div className="absolute top-2 right-2 z-10 flex items-center gap-1.5 bg-black/80 backdrop-blur rounded-full px-2.5 py-1">
          <span className="text-[10px] text-white font-bold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            Video Canvas (Live)
          </span>
          <button 
            onClick={() => setIsVideoMode(false)}
            className="text-neutral-400 hover:text-white transition ml-1 cursor-pointer"
            title="Close Video Canvas"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <div id="yt-iframe-player" className="w-full h-full"></div>
    </div>
  );
};
