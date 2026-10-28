import React, { useEffect, useRef } from 'react';
import { useMusic } from '../context/MusicContext';
import { X } from 'lucide-react';

export const YouTubePlayer = () => {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    isVideoMode,
    setIsVideoMode,
    youtubePlayerRef
  } = useMusic();

  const containerRef = useRef(null);
  const internalPlayerRef = useRef(null);

  // Initialize YouTube IFrame API for Video Canvas
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
              // Video is kept muted so sound streams 100% cleanly through HTML5 audio element
              // This guarantees seamless mobile background & lock screen playback without double sound!
              event.target.mute();
            } catch (e) {}

            if (currentTrack?.youtubeId) {
              event.target.cueVideoById(currentTrack.youtubeId);
            }
          },
          onError: (err) => {
            console.warn("YouTube iframe notice:", err?.data);
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

  // When Video Canvas is toggled, sync time and play/pause video
  useEffect(() => {
    const player = youtubePlayerRef.current;
    if (!player || !currentTrack?.youtubeId) return;

    if (isVideoMode) {
      try {
        if (typeof player.mute === 'function') player.mute();
        if (typeof player.seekTo === 'function' && currentTime > 0) {
          player.seekTo(currentTime, true);
        }
        if (isPlaying && typeof player.playVideo === 'function') {
          player.playVideo();
        }
      } catch (e) {}
    } else {
      try {
        if (typeof player.pauseVideo === 'function') {
          player.pauseVideo();
        }
      } catch (e) {}
    }
  }, [isVideoMode, isPlaying, currentTrack?.youtubeId]);

  // When track changes while Video Mode is open
  useEffect(() => {
    const player = youtubePlayerRef.current;
    if (player && currentTrack?.youtubeId) {
      try {
        if (isVideoMode && isPlaying && typeof player.loadVideoById === 'function') {
          player.loadVideoById({
            videoId: currentTrack.youtubeId,
            startSeconds: currentTime || 0
          });
          if (typeof player.mute === 'function') player.mute();
        } else if (typeof player.cueVideoById === 'function') {
          player.cueVideoById(currentTrack.youtubeId);
        }
      } catch (e) {}
    }
  }, [currentTrack?.youtubeId]);

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
            Video Canvas (Sync)
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
