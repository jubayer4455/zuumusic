import React from 'react';
import { MusicProvider } from './context/MusicContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { MainContent } from './components/MainContent';
import { PlayerBar } from './components/PlayerBar';
import { RightSidebar } from './components/RightSidebar';
import { MobileMiniPlayer } from './components/MobileMiniPlayer';
import { MobileBottomNav } from './components/MobileBottomNav';
import { MobileNowPlayingModal } from './components/MobileNowPlayingModal';
import { CreatePlaylistModal } from './components/CreatePlaylistModal';
import { SleepTimerModal } from './components/SleepTimerModal';
import { EqualizerModal } from './components/EqualizerModal';
import { KeyboardShortcutsModal } from './components/KeyboardShortcutsModal';
import { InstallAppModal } from './components/InstallAppModal';
import { ZuuVipModal } from './components/ZuuVipModal';
import { DeviceConnectModal } from './components/DeviceConnectModal';
import { SettingsProfileModal } from './components/SettingsProfileModal';
import { NotificationsModal } from './components/NotificationsModal';
import { MobileInstallBanner } from './components/MobileInstallBanner';
import { Toast } from './components/Toast';
import { YouTubePlayer } from './components/YouTubePlayer';
import { OfflineDownloadPermissionModal } from './components/OfflineDownloadPermissionModal';
import { useMusic } from './context/MusicContext';

function ZuuMusicApp() {
  const { currentTrack, isVideoMode } = useMusic();

  const getAmbientGlow = () => {
    if (!currentTrack) return 'from-emerald-950/30 via-neutral-900 to-[#121212]';
    if (currentTrack.playlistId === 'lofi-chill' || currentTrack.genre === 'lofi') {
      return 'from-purple-950/40 via-[#181226] to-[#121212]';
    }
    if (currentTrack.playlistId === 'bangla-vibes' || currentTrack.genre === 'acoustic') {
      return 'from-amber-950/40 via-[#221810] to-[#121212]';
    }
    if (currentTrack.playlistId === 'pop-rising' || currentTrack.genre === 'pop') {
      return 'from-rose-950/40 via-[#26101a] to-[#121212]';
    }
    if (currentTrack.playlistId === 'workout-fuel' || currentTrack.genre === 'workout') {
      return 'from-orange-950/40 via-[#261710] to-[#121212]';
    }
    if (currentTrack.playlistId === 'midnight-drive' || currentTrack.genre === 'electronic') {
      return 'from-cyan-950/40 via-[#0e1c26] to-[#121212]';
    }
    return 'from-emerald-950/40 via-[#0d2218] to-[#121212]';
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-black text-white overflow-hidden font-sans select-none">
      {/* Mobile Install App Banner */}
      <MobileInstallBanner />

      {/* Main App Workspace (Sidebar + Main View + Right Drawer) */}
      <div className="flex flex-1 h-[calc(100vh-80px)] md:h-[calc(100vh-80px)] overflow-hidden p-0 md:p-2 md:gap-2">
        {/* Left Desktop Sidebar */}
        <Sidebar />

        {/* Central Content Area (Sticky Header + Scrollable Main Content) with Dynamic Ambient Glow */}
        <div className={`flex-1 flex flex-col h-full bg-gradient-to-b ${getAmbientGlow()} md:rounded-2xl md:border md:border-white/10 overflow-hidden relative shadow-2xl transition-all duration-1000`}>
          <Header />
          <MainContent />
        </div>

        {/* Right Drawer (Now Playing Track Details / Lyrics / Queue) */}
        <RightSidebar />
      </div>

      {/* Persistent Desktop Player Bar (Laptop / Desktop) */}
      <PlayerBar />

      {/* Mobile Floating Mini Player (Phone screens) */}
      <MobileMiniPlayer />

      {/* Mobile Bottom Navigation Bar (Phone screens) */}
      <MobileBottomNav />

      {/* Mobile Fullscreen Now Playing Sheet */}
      <MobileNowPlayingModal />

      {/* Modal: Create Playlist */}
      <CreatePlaylistModal />

      {/* Modal: Sleep Timer */}
      <SleepTimerModal />

      {/* Modal: Equalizer & Audio Engine */}
      <EqualizerModal />

      {/* Modal: Keyboard Shortcuts Cheat Sheet */}
      <KeyboardShortcutsModal />

      {/* Modal: Direct App Install & Download */}
      <InstallAppModal />

      {/* Modal: Zuu VIP Privileges & Plans */}
      <ZuuVipModal />

      {/* Modal: Connect Audio Device Output */}
      <DeviceConnectModal />

      {/* Modal: User Profile & Audio Settings */}
      <SettingsProfileModal />

      {/* Modal: Notifications Center */}
      <NotificationsModal />

      {/* Modal: One-Time Offline Storage Permission */}
      <OfflineDownloadPermissionModal />

      {/* Floating Pill Toast Notification */}
      <Toast />

      {/* Global YouTube Player Engine: Only mounted in Video Mode to protect background audio */}
      {isVideoMode && <YouTubePlayer />}
    </div>
  );
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("Zuu Music caught an error:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-6 text-center select-none">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 flex items-center justify-center mb-4 border border-emerald-500/30">
            <span className="text-2xl">🎵</span>
          </div>
          <h1 className="text-xl font-bold mb-2">Something went wrong</h1>
          <p className="text-neutral-400 text-xs mb-6 max-w-sm">
            Zuu Music encountered an issue while loading. Tap below to reload fresh.
          </p>
          <button
            onClick={() => {
              try {
                if ('caches' in window) {
                  caches.keys().then(keys => keys.forEach(k => caches.delete(k)));
                }
              } catch (e) {}
              window.location.reload();
            }}
            className="px-6 py-2.5 rounded-full bg-[#1ed760] text-black font-bold text-sm hover:scale-105 active:scale-95 transition cursor-pointer"
          >
            Reload App 🔄
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <MusicProvider>
        <ZuuMusicApp />
      </MusicProvider>
    </ErrorBoundary>
  );
}
