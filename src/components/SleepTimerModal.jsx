import React from 'react';
import { Moon, X, Clock, Check, Power } from 'lucide-react';
import { useMusic } from '../context/MusicContext';

export const SleepTimerModal = () => {
  const { 
    isSleepTimerOpen, 
    setIsSleepTimerOpen, 
    sleepTimerSecondsLeft, 
    isSleepTimerEndOfTrack, 
    setSleepTimer, 
    cancelSleepTimer, 
    formatTime 
  } = useMusic();

  if (!isSleepTimerOpen) return null;

  const timerOptions = [
    { label: '5 minutes', value: 5 },
    { label: '15 minutes', value: 15 },
    { label: '30 minutes', value: 30 },
    { label: '45 minutes', value: 45 },
    { label: '1 hour', value: 60 },
    { label: 'End of track', value: 'end_of_track' }
  ];

  const handleSelectOption = (value) => {
    setSleepTimer(value);
    setIsSleepTimerOpen(false);
  };

  const handleCancelTimer = () => {
    cancelSleepTimer();
    setIsSleepTimerOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <div className="ios-glass-mini text-white w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-white/15 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Moon className="w-4 h-4 fill-current" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Sleep Timer</h3>
              <p className="text-[11px] text-neutral-400">Audio will stop automatically</p>
            </div>
          </div>
          <button 
            onClick={() => setIsSleepTimerOpen(false)}
            className="p-1 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Active Timer Status */}
        {(sleepTimerSecondsLeft !== null || isSleepTimerEndOfTrack) && (
          <div className="mb-4 p-3 bg-gradient-to-r from-indigo-950/80 to-purple-950/80 rounded-xl border border-indigo-500/30 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 animate-ping"></span>
              <div>
                <span className="text-[10px] uppercase font-bold text-indigo-300 block">Active Timer</span>
                <span className="text-base font-black text-white font-mono">
                  {isSleepTimerEndOfTrack 
                    ? "Stopping at end of track" 
                    : `${formatTime(sleepTimerSecondsLeft)} remaining`}
                </span>
              </div>
            </div>

            <button
              onClick={handleCancelTimer}
              className="px-3 py-1 bg-red-600/20 hover:bg-red-600/40 text-red-300 rounded-full text-xs font-bold transition flex items-center gap-1 border border-red-500/30"
            >
              <Power className="w-3 h-3" /> Stop
            </button>
          </div>
        )}

        {/* Options List */}
        <div className="space-y-1.5">
          {timerOptions.map((opt) => {
            const isSelected = opt.value === 'end_of_track' 
              ? isSleepTimerEndOfTrack 
              : sleepTimerSecondsLeft !== null && Math.ceil(sleepTimerSecondsLeft / 60) === opt.value;

            return (
              <button
                key={opt.label}
                onClick={() => handleSelectOption(opt.value)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition text-sm font-semibold ${
                  isSelected
                    ? 'bg-[#1ed760] text-black font-bold'
                    : 'bg-[#2a2a2a] hover:bg-[#333333] text-neutral-200 hover:text-white'
                }`}
              >
                <span>{opt.label}</span>
                {isSelected && <Check className="w-4 h-4" />}
              </button>
            );
          })}
        </div>

        {/* Turn Off Timer Button */}
        {(sleepTimerSecondsLeft !== null || isSleepTimerEndOfTrack) && (
          <button
            onClick={handleCancelTimer}
            className="mt-4 w-full py-2.5 rounded-xl border border-neutral-600 text-neutral-300 hover:text-white hover:border-neutral-400 text-xs font-bold transition"
          >
            Turn off timer
          </button>
        )}
      </div>
    </div>
  );
};
