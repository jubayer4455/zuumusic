import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  Bell, 
  Users, 
  Download, 
  ExternalLink, 
  CheckCircle, 
  X, 
  LogOut, 
  User, 
  Settings,
  Sparkles
} from 'lucide-react';
import { useMusic } from '../context/MusicContext';
import { ZuuLogo } from './ZuuLogo';

export const Header = () => {
  const { 
    activeView, 
    setActiveView, 
    searchQuery, 
    setSearchQuery, 
    userProfile, 
    showToast,
    triggerInstallApp,
    goBack,
    goForward,
    canGoBack,
    canGoForward,
    setIsVipModalOpen,
    setIsNotificationsOpen,
    notifications,
    setIsSettingsModalOpen,
    setSettingsTab,
    homeFilter,
    setHomeFilter
  } = useMusic();

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 lg:px-8 py-3.5 ios-glass-header gap-4 pt-[max(0.75rem,env(safe-area-inset-top))]">
      {/* Left: Navigation Arrows, Mobile Brand Logo & Inline Search */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        {/* Mobile Brand Logo */}
        <div 
          onClick={() => setActiveView('home')}
          className="flex md:hidden items-center cursor-pointer active:scale-95 transition-transform"
        >
          <ZuuLogo className="w-8 h-8" withText={true} textClassName="text-lg font-black" />
        </div>

        {/* Desktop History Arrows */}
        <div className="hidden md:flex items-center gap-2">
          <button 
            onClick={goBack}
            disabled={!canGoBack}
            className={`w-8 h-8 rounded-full bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center transition active:scale-95 ${
              canGoBack ? 'text-white hover:bg-white/20 cursor-pointer' : 'text-white/30 cursor-not-allowed opacity-50'
            }`}
            title="Go back"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button 
            onClick={goForward}
            disabled={!canGoForward}
            className={`w-8 h-8 rounded-full bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center transition active:scale-95 ${
              canGoForward ? 'text-white hover:bg-white/20 cursor-pointer' : 'text-white/30 cursor-not-allowed opacity-50'
            }`}
            title="Go forward"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Global Search Input Bar */}
        <div className="relative flex-1 hidden sm:block">
          <div className="relative flex items-center">
            <Search className="w-5 h-5 text-neutral-400 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (activeView !== 'search') setActiveView('search');
              }}
              placeholder="What do you want to play on Zuu Music?"
              className="w-full bg-white/[0.08] hover:bg-white/[0.12] focus:bg-white/[0.12] backdrop-blur-xl text-white text-sm rounded-full pl-11 pr-9 py-2.5 outline-none border border-white/15 focus:border-[#1ed760]/60 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] transition-all placeholder:text-neutral-400"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Center Filter Chips (Desktop) */}
      <div className="hidden md:flex items-center gap-2">
        <button 
          onClick={() => {
            setHomeFilter('all');
            setActiveView('home');
          }}
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition ${
            activeView === 'home' && homeFilter !== 'podcasts' ? 'bg-white text-black' : 'bg-neutral-800 text-white hover:bg-neutral-700'
          }`}
        >
          All
        </button>
        <button 
          onClick={() => {
            setHomeFilter('all');
            setActiveView('search');
          }}
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition ${
            activeView === 'search' ? 'bg-white text-black' : 'bg-neutral-800 text-white hover:bg-neutral-700'
          }`}
        >
          Music
        </button>
        <button 
          onClick={() => {
            setHomeFilter('podcasts');
            setActiveView('home');
          }}
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition ${
            activeView === 'home' && homeFilter === 'podcasts' ? 'bg-purple-500 text-white font-black' : 'bg-neutral-800 text-white hover:bg-neutral-700'
          }`}
        >
          Podcasts
        </button>
      </div>

      {/* Right: Zuu VIP, Install, Notification, Profile */}
      <div className="flex items-center gap-3">
        {/* Explore Zuu VIP */}
        <button 
          onClick={() => setIsVipModalOpen(true)}
          className="hidden xl:flex items-center gap-1.5 bg-gradient-to-r from-[#1ed760] to-[#00f2fe] text-black font-extrabold hover:scale-105 active:scale-95 px-4 py-1.5 rounded-full text-xs shadow-lg shadow-emerald-500/20 transition cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 fill-black" />
          <span>Zuu VIP</span>
        </button>

        {/* Install App Button */}
        <button 
          onClick={triggerInstallApp}
          className="hidden lg:flex items-center gap-1.5 bg-black/60 hover:bg-black text-neutral-200 hover:text-white px-3 py-1.5 rounded-full text-xs font-semibold transition border border-white/10 active:scale-95"
        >
          <Download className="w-3.5 h-3.5 text-[#00f2fe]" />
          <span>Download App</span>
        </button>

        {/* Bell Icon */}
        <button 
          onClick={() => setIsNotificationsOpen(true)}
          className="relative w-9 h-9 rounded-full bg-black/60 hover:bg-black flex items-center justify-center text-neutral-300 hover:text-white transition active:scale-95"
          title="What's New"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-[#1ed760] shadow-[0_0_8px_#1ed760]" />
          )}
        </button>

        {/* User Profile Avatar with Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="flex items-center p-0.5 rounded-full bg-black hover:scale-105 transition border-2 border-transparent hover:border-[#1ed760]/60"
            title={userProfile.name}
          >
            <img 
              src={userProfile.avatar} 
              alt={userProfile.name} 
              className="w-8 h-8 rounded-full object-cover"
            />
          </button>

          {/* Profile Dropdown */}
          {isProfileMenuOpen && (
            <div className="absolute right-0 mt-2 w-60 bg-[#242424] rounded-xl shadow-2xl p-1.5 z-50 text-neutral-200 text-sm border border-neutral-700/60 backdrop-blur-xl">
              <div className="px-3 py-2.5 border-b border-neutral-700/60">
                <div className="font-bold text-white truncate">{userProfile.name}</div>
                <div className="text-xs text-[#1ed760] flex items-center gap-1 mt-0.5 font-semibold">
                  <CheckCircle className="w-3.5 h-3.5 fill-[#1ed760] text-black" /> Zuu VIP Member
                </div>
              </div>

              <div className="py-1">
                <button 
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    setSettingsTab('account');
                    setIsSettingsModalOpen(true);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 hover:bg-neutral-700/60 rounded-lg text-left transition"
                >
                  <span className="flex items-center gap-2"><User className="w-4 h-4" /> Account</span>
                  <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
                </button>

                <button 
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    setSettingsTab('audio');
                    setIsSettingsModalOpen(true);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 hover:bg-neutral-700/60 rounded-lg text-left transition"
                >
                  <Settings className="w-4 h-4" /> Settings & Quality
                </button>

                <button 
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    setIsVipModalOpen(true);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 hover:bg-neutral-700/60 rounded-lg text-left transition"
                >
                  <span>Upgrade to Family</span>
                  <Sparkles className="w-3.5 h-3.5 text-[#00f2fe]" />
                </button>
              </div>

              <div className="border-t border-neutral-700/60 pt-1">
                <button 
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    showToast("Switched to Guest Mode");
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 hover:bg-neutral-700/60 rounded-lg text-left text-neutral-300 hover:text-white transition"
                >
                  <LogOut className="w-4 h-4" /> Log out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
