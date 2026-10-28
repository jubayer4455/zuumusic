import React from 'react';
import { X, Bell, Sparkles, Check, Music, Download, CheckCheck } from 'lucide-react';
import { useMusic } from '../context/MusicContext';

export const NotificationsModal = () => {
  const { 
    isNotificationsOpen, 
    setIsNotificationsOpen, 
    notifications, 
    markNotificationsAsRead,
    triggerHaptic 
  } = useMusic();

  if (!isNotificationsOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200 select-none"
      onClick={() => setIsNotificationsOpen(false)}
    >
      <div 
        className="ios-glass-mini text-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-white/20 flex flex-col relative overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Specular top reflection line */}
        <div className="absolute top-0 inset-x-8 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />

        {/* Close Button */}
        <button 
          onClick={() => setIsNotificationsOpen(false)}
          className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-white rounded-full hover:bg-white/10 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center justify-between mb-4 pr-8">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#1ed760]/20 flex items-center justify-center text-[#1ed760]">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base text-white">Notifications</h3>
              <p className="text-[11px] text-neutral-400">Updates & features on Zuu Music</p>
            </div>
          </div>

          <button
            onClick={() => {
              triggerHaptic('light');
              markNotificationsAsRead();
            }}
            className="text-[11px] font-bold text-[#1ed760] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Mark read</span>
          </button>
        </div>

        {/* Notifications List */}
        <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
          {notifications.map((item) => (
            <div 
              key={item.id}
              className={`p-3.5 rounded-2xl border transition relative ${
                item.unread 
                  ? 'bg-white/10 border-white/20' 
                  : 'bg-white/5 border-white/5 opacity-80'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    item.tag === 'Audio' ? 'bg-emerald-500/20 text-[#1ed760]' :
                    item.tag === 'Offline' ? 'bg-cyan-500/20 text-[#00f2fe]' :
                    item.tag === 'VIP' ? 'bg-purple-500/20 text-purple-300' :
                    'bg-amber-500/20 text-amber-300'
                  }`}>
                    {item.tag}
                  </span>
                  <span className="text-[10px] text-neutral-400">{item.time}</span>
                </div>

                {item.unread && (
                  <span className="w-2 h-2 rounded-full bg-[#1ed760] shadow-[0_0_6px_#1ed760] shrink-0" />
                )}
              </div>

              <h4 className="font-bold text-xs text-white mt-1.5">{item.title}</h4>
              <p className="text-[11px] text-neutral-300 mt-0.5 leading-relaxed">{item.message}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
