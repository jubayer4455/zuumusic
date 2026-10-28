import React from 'react';
import { X, Keyboard, Command } from 'lucide-react';
import { useMusic } from '../context/MusicContext';

export const KeyboardShortcutsModal = () => {
  const { isShortcutsOpen, setIsShortcutsOpen } = useMusic();

  if (!isShortcutsOpen) return null;

  const shortcuts = [
    { key: 'Space', desc: 'Play / Pause music' },
    { key: 'J / K', desc: 'Previous / Next track' },
    { key: '← / →', desc: 'Seek backward / forward 5 sec' },
    { key: '↑ / ↓', desc: 'Volume up / down by 5%' },
    { key: 'M', desc: 'Mute / Unmute volume' },
    { key: 'L', desc: 'Save to Liked Songs (Heart)' },
    { key: 'S', desc: 'Toggle Shuffle mode' },
    { key: 'R', desc: 'Cycle Repeat (Off / All / One)' },
    { key: 'E', desc: 'Open Studio Equalizer (EQ)' },
    { key: 'V', desc: 'Toggle Video / Canvas mode' },
    { key: '?', desc: 'Show / hide this shortcuts cheat sheet' },
    { key: 'Esc', desc: 'Close any active popup modal' }
  ];

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200 select-none"
      onClick={() => setIsShortcutsOpen(false)}
    >
      <div 
        className="ios-glass-mini border border-white/15 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-gradient-to-r from-emerald-950/40 via-neutral-900 to-indigo-950/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1ed760] to-[#00f2fe] p-0.5 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <div className="w-full h-full bg-neutral-900 rounded-[10px] flex items-center justify-center">
                <Keyboard className="w-5 h-5 text-[#1ed760]" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-white">Keyboard Shortcuts</h3>
              <p className="text-xs text-neutral-400">Control Zuu Music without lifting your hands from the keys</p>
            </div>
          </div>
          <button 
            onClick={() => setIsShortcutsOpen(false)}
            className="p-2 text-neutral-400 hover:text-white rounded-full hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Shortcuts List */}
        <div className="p-6 overflow-y-auto max-h-[60vh] space-y-2.5">
          {shortcuts.map((sc, i) => (
            <div 
              key={i}
              className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-white/5 transition"
            >
              <span className="text-xs sm:text-sm text-neutral-300">{sc.desc}</span>
              <kbd className="px-2.5 py-1 bg-neutral-800 border border-neutral-700 text-[#1ed760] font-mono text-xs font-bold rounded-md shadow shadow-black/50">
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-white/10 bg-black/60 flex items-center justify-between">
          <span className="text-[11px] text-neutral-400">
            Tip: Press <kbd className="px-1.5 py-0.5 bg-neutral-800 rounded text-white font-mono">?</kbd> anytime to open
          </span>
          <button 
            onClick={() => setIsShortcutsOpen(false)}
            className="px-5 py-1.5 rounded-full bg-white text-black font-extrabold text-xs hover:scale-105 active:scale-95 transition"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
