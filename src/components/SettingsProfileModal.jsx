import React, { useState } from 'react';
import { X, User, Sliders, HardDrive, Check, Sparkles, Trash2, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useMusic } from '../context/MusicContext';

export const SettingsProfileModal = () => {
  const { 
    isSettingsModalOpen, 
    setIsSettingsModalOpen, 
    settingsTab, 
    setSettingsTab,
    userProfile, 
    updateUserProfile,
    audioQuality,
    setAudioQuality,
    crossfadeSec,
    setCrossfadeSec,
    normalizeAudio,
    setNormalizeAudio,
    offlineTracks,
    clearOfflineCache,
    triggerHaptic 
  } = useMusic();

  const [nameInput, setNameInput] = useState(userProfile?.name || 'Tanvir Ahmed');
  const [handleInput, setHandleInput] = useState(userProfile?.handle || '@tanvir_music');

  if (!isSettingsModalOpen) return null;

  const handleSaveProfile = (e) => {
    e.preventDefault();
    triggerHaptic('medium');
    updateUserProfile({ name: nameInput, handle: handleInput });
  };

  const estimatedStorageMb = (offlineTracks.length * 5.8).toFixed(1);

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200 select-none"
      onClick={() => setIsSettingsModalOpen(false)}
    >
      <div 
        className="ios-glass-mini text-white w-full max-w-lg rounded-3xl p-6 shadow-2xl border border-white/20 flex flex-col relative overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Specular top reflection line */}
        <div className="absolute top-0 inset-x-8 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />

        {/* Close Button */}
        <button 
          onClick={() => setIsSettingsModalOpen(false)}
          className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-white rounded-full hover:bg-white/10 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title */}
        <h2 className="text-xl font-black text-white mb-4">Settings & Preferences</h2>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-white/5 rounded-2xl border border-white/10 mb-5">
          <button
            onClick={() => setSettingsTab('account')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 ${
              settingsTab === 'account' 
                ? 'bg-white text-black shadow-md' 
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Account</span>
          </button>
          <button
            onClick={() => setSettingsTab('audio')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 ${
              settingsTab === 'audio' 
                ? 'bg-[#1ed760] text-black shadow-md' 
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Audio Quality</span>
          </button>
          <button
            onClick={() => setSettingsTab('storage')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 ${
              settingsTab === 'storage' 
                ? 'bg-[#00f2fe] text-black shadow-md' 
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <HardDrive className="w-3.5 h-3.5" />
            <span>Storage & Cache</span>
          </button>
        </div>

        {/* TAB 1: ACCOUNT & PROFILE */}
        {settingsTab === 'account' && (
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
              <img 
                src={userProfile.avatar} 
                alt={userProfile.name} 
                className="w-16 h-16 rounded-full object-cover border-2 border-[#1ed760]" 
              />
              <div className="flex-1 min-w-0">
                <span className="text-[10px] uppercase font-bold text-[#1ed760] flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 fill-[#1ed760] text-black" /> Zuu VIP Member
                </span>
                <div className="font-extrabold text-base text-white truncate">{userProfile.name}</div>
                <div className="text-xs text-neutral-400">{userProfile.handle}</div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-neutral-300 block mb-1.5">Display Name</label>
                <input 
                  type="text" 
                  value={nameInput} 
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-full bg-white/10 text-white rounded-xl px-3.5 py-2.5 text-sm outline-none border border-white/10 focus:border-[#1ed760]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-300 block mb-1.5">Handle</label>
                <input 
                  type="text" 
                  value={handleInput} 
                  onChange={(e) => setHandleInput(e.target.value)}
                  className="w-full bg-white/10 text-white rounded-xl px-3.5 py-2.5 text-sm outline-none border border-white/10 focus:border-[#1ed760]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-full bg-[#1ed760] text-black font-extrabold text-sm shadow-lg hover:scale-[1.02] active:scale-95 transition"
            >
              Save Profile Changes
            </button>
          </form>
        )}

        {/* TAB 2: AUDIO QUALITY */}
        {settingsTab === 'audio' && (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-neutral-300 block mb-2">Streaming Audio Quality</label>
              <div className="space-y-2">
                {[
                  { id: 'master320', name: 'Master Lossless (320kbps)', desc: 'Full dynamic range, crystal studio master (Recommended)' },
                  { id: 'high256', name: 'High Fidelity (256kbps AAC)', desc: 'Near lossless clarity with balanced data usage' },
                  { id: 'normal160', name: 'Standard Quality (160kbps MP3)', desc: 'Standard clarity for moderate connections' },
                  { id: 'saver96', name: 'Data Saver (96kbps)', desc: 'Low bandwidth consumption' }
                ].map(q => (
                  <div
                    key={q.id}
                    onClick={() => setAudioQuality(q.id)}
                    className={`p-3 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                      audioQuality === q.id 
                        ? 'bg-emerald-500/15 border-[#1ed760]' 
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <div>
                      <div className={`text-xs font-bold ${audioQuality === q.id ? 'text-[#1ed760]' : 'text-white'}`}>
                        {q.name}
                      </div>
                      <div className="text-[11px] text-neutral-400 mt-0.5">{q.desc}</div>
                    </div>
                    {audioQuality === q.id && <Check className="w-4 h-4 text-[#1ed760] shrink-0" />}
                  </div>
                ))}
              </div>
            </div>

            {/* Crossfade Slider */}
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-white">
                <span>Crossfade Transition</span>
                <span className="text-[#1ed760] font-mono">{crossfadeSec}s</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="12" 
                value={crossfadeSec} 
                onChange={(e) => setCrossfadeSec(parseInt(e.target.value, 10))}
                className="w-full accent-[#1ed760] cursor-pointer"
              />
              <p className="text-[10px] text-neutral-400">Blends the end of one song into the start of the next.</p>
            </div>
          </div>
        )}

        {/* TAB 3: STORAGE & CACHE */}
        {settingsTab === 'storage' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-white">Offline Cached Music</h4>
                  <p className="text-xs text-neutral-400 mt-0.5">{offlineTracks.length} tracks saved on this device</p>
                </div>
                <div className="text-right font-mono text-base font-bold text-[#00f2fe]">
                  ~{estimatedStorageMb} MB
                </div>
              </div>

              <div className="w-full h-2 rounded-full bg-neutral-800 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#1ed760] to-[#00f2fe]"
                  style={{ width: `${Math.min(100, (offlineTracks.length / 50) * 100)}%` }}
                />
              </div>
            </div>

            <button
              onClick={clearOfflineCache}
              className="w-full py-3 rounded-full bg-rose-600/20 text-rose-300 border border-rose-500/40 hover:bg-rose-600 hover:text-white font-extrabold text-xs flex items-center justify-center gap-2 transition active:scale-95"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear Offline Storage & Cache</span>
            </button>

            <div className="flex items-center gap-2 text-xs text-neutral-400 justify-center">
              <ShieldCheck className="w-4 h-4 text-[#1ed760]" />
              <span>All cached audio is stored locally in client sandbox.</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
