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

  // Initialize YouTube IFrame API for Video / Canvas Mode
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
        videoId: currentTrack?.youtubeId || 'dQw4w9WgXcQ',
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
            // Always keep video muted so audio exclusively streams through HTML5 audio element
            // This prevents sound doubling and guarantees continuous background audio!
            try {
              event.target.mute();
            } catch (e) {}
            if (currentTrack?.youtubeId) {
              event.target.cueVideoById(currentTrack.youtubeId);
            }
          },
          onStateChange: () => {
            // Note: Background audio is strictly handled by HTML5 <audio> tag.
            // We ignore background OS pauses on the video iframe so music never cuts off!
          },
          onError: (err) => {
            console.warn("YouTube player warning:", err.data);
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
        internalPlayerRef.current.destroy();
      }
    };
  }, []);

  // When video mode is opened and song is playing, sync position and play video
  useEffect(() => {
    const player = youtubePlayerRef.current;
    if (!player || !currentTrack?.isYouTube) return;

    if (isVideoMode) {
      if (typeof player.mute === 'function') player.mute();
      if (typeof player.seekTo === 'function' && currentTime > 0) {
        player.seekTo(currentTime, true);
      }
      if (isPlaying && typeof player.playVideo === 'function') {
        player.playVideo();
      }
    } else {
      if (typeof player.pauseVideo === 'function') {
        player.pauseVideo();
      }
    }
  }, [isVideoMode, isPlaying]);

  // When track changes in Video Mode
  useEffect(() => {
    const player = youtubePlayerRef.current;
    if (player && currentTrack?.isYouTube && currentTrack.youtubeId) {
      if (typeof player.loadVideoById === 'function') {
        if (isVideoMode && isPlaying) {
          player.loadVideoById({
            videoId: currentTrack.youtubeId,
            startSeconds: currentTime || 0
          });
          if (typeof player.mute === 'function') player.mute();
        } else if (typeof player.cueVideoById === 'function') {
          player.cueVideoById(currentTrack.youtubeId);
        }
      }
    }
  }, [currentTrack?.youtubeId]);

  return (
    <div 
      ref={containerRef}
      className={`transition-all duration-300 shadow-2xl rounded-xl overflow-hidden border border-white/20 bg-black ${
        isVideoMode 
          ? 'fixed bottom-24 right-4 sm:right-6 w-80 sm:w-96 aspect-video opacity-100 scale-100 z-50 pointer-events-auto' 
          : 'fixed -top-[9999px] left-0 w-1 h-1 opacity-0 pointer-events-none z-[-100]'
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
