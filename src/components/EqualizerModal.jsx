import React from 'react';
import { X, Sliders, Volume2, Sparkles, RotateCcw, Zap } from 'lucide-react';
import { useMusic } from '../context/MusicContext';

export const EqualizerModal = () => {
  const {
    isEqualizerOpen,
    setIsEqualizerOpen,
    eqGains,
    setEqBandGain,
    eqPreset,
    applyEqPreset,
    resetEq,
    playbackSpeed,
    setPlaybackSpeedLevel,
    isCrossfadeEnabled,
    setIsCrossfadeEnabled,
    showToast
  } = useMusic();

  if (!isEqualizerOpen) return null;

  const presets = [
    { id: 'flat', name: 'Flat / Studio', icon: '🎧', desc: 'Original studio master balance' },
    { id: 'bass', name: 'Bass Boost', icon: '🔊', desc: 'Punchy low-end for EDM & Hip-Hop' },
    { id: 'vocal', name: 'Vocal Clarity', icon: '🎤', desc: 'Crisp speech for Acoustic & Podcasts' },
    { id: 'rock', name: 'Rock & Live', icon: '🎸', desc: 'Dynamic mid-punch and energetic drums' },
    { id: 'latenight', name: 'Late Night', icon: '🌙', desc: 'Softened highs & warm gentle tones' },
    { id: 'lofi', name: 'Lo-Fi Chill', icon: '🌊', desc: 'Analog tape warmth and cozy mids' },
  ];

  const bands = [
    { label: '60 Hz', sub: 'Sub-Bass', index: 0 },
    { label: '250 Hz', sub: 'Bass', index: 1 },
    { label: '1 kHz', sub: 'Mids', index: 2 },
    { label: '4 kHz', sub: 'Upper Mids', index: 3 },
    { label: '14 kHz', sub: 'Treble / Air', index: 4 }
  ];

  const speeds = [0.8, 1.0, 1.25, 1.5, 2.0];

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200 select-none">
      <div 
        className="ios-glass-mini border border-white/15 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-gradient-to-r from-emerald-950/40 via-neutral-900 to-indigo-950/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1ed760] to-[#00f2fe] p-0.5 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <div className="w-full h-full bg-neutral-900 rounded-[10px] flex items-center justify-center">
                <Sliders className="w-5 h-5 text-[#1ed760]" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-extrabold text-white">Zuu Audio Master EQ</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#1ed760]/20 text-[#1ed760] font-bold border border-[#1ed760]/30">
                  DSP 320kbps
                </span>
              </div>
              <p className="text-xs text-neutral-400">Professional 5-Band Studio Equalizer & Audio Engine</p>
            </div>
          </div>
          <button 
            onClick={() => setIsEqualizerOpen(false)}
            className="p-2 text-neutral-400 hover:text-white rounded-full hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Preset Buttons */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#1ed760]" /> Sound Profile Presets
              </span>
              <button 
                onClick={resetEq}
                className="text-xs text-neutral-400 hover:text-[#1ed760] flex items-center gap-1 transition"
                title="Reset all bands to 0 dB"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {presets.map((p) => {
                const isActive = eqPreset === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => applyEqPreset(p.id)}
                    className={`p-2.5 rounded-xl text-left border transition flex flex-col justify-between ${
                      isActive 
                        ? 'bg-gradient-to-br from-[#1ed760]/20 to-emerald-950/40 border-[#1ed760] text-white shadow-md' 
                        : 'bg-white/5 border-white/5 text-neutral-300 hover:bg-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-base">{p.icon}</span>
                      {isActive && <span className="w-2 h-2 rounded-full bg-[#1ed760] animate-pulse"></span>}
                    </div>
                    <div className="mt-2">
                      <div className="text-xs font-bold text-white">{p.name}</div>
                      <div className="text-[10px] text-neutral-400 line-clamp-1">{p.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 5-Band Slider Board */}
          <div className="bg-black/40 rounded-xl p-4 border border-white/5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-neutral-300">Frequency Response Curve</span>
              <span className="text-[11px] font-mono text-[#1ed760]">
                {eqPreset.toUpperCase()} MODE
              </span>
            </div>

            <div className="grid grid-cols-5 gap-2 sm:gap-4 items-end justify-items-center h-48 py-2">
              {bands.map((b) => {
                const gain = eqGains[b.index] || 0;
                return (
                  <div key={b.index} className="flex flex-col items-center h-full justify-between w-full">
                    <span className="text-[10px] font-mono text-neutral-400">
                      {gain > 0 ? `+${gain}` : gain} dB
                    </span>

                    {/* Vertical Slider Wrapper */}
                    <div className="relative h-28 flex items-center justify-center my-1 w-full">
                      {/* Zero line */}
                      <div className="absolute w-full h-[1px] bg-white/20 z-0"></div>

                      <input 
                        type="range"
                        min="-12"
                        max="12"
                        step="1"
                        value={gain}
                        onChange={(e) => setEqBandGain(b.index, parseInt(e.target.value, 10))}
                        className="w-28 -rotate-90 appearance-none bg-neutral-700/80 h-1.5 rounded-full accent-[#1ed760] cursor-pointer"
                      />
                    </div>

                    <div className="text-center mt-2">
                      <div className="text-xs font-bold text-white">{b.label}</div>
                      <div className="text-[9px] text-neutral-400">{b.sub}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Playback Speed & Crossfade Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Speed Selector */}
            <div className="bg-white/5 rounded-xl p-3.5 border border-white/5">
              <span className="text-xs font-bold text-neutral-300 block mb-2">
                Playback Speed: <span className="text-[#1ed760] font-mono">{playbackSpeed}x</span>
              </span>
              <div className="flex items-center gap-1.5">
                {speeds.map((s) => (
                  <button
                    key={s}
                    onClick={() => setPlaybackSpeedLevel(s)}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition ${
                      playbackSpeed === s
                        ? 'bg-[#1ed760] text-black shadow-md'
                        : 'bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {s}x
                  </button>
                ))}
              </div>
            </div>

            {/* Gapless & Crossfade */}
            <div className="bg-white/5 rounded-xl p-3.5 border border-white/5 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white block">Seamless Gapless Audio</span>
                <span className="text-[10px] text-neutral-400">Smooth track transition buffer</span>
              </div>
              <button
                onClick={() => {
                  setIsCrossfadeEnabled(!isCrossfadeEnabled);
                  showToast(!isCrossfadeEnabled ? "Seamless gapless buffer on" : "Gapless buffer off");
                }}
                className={`w-11 h-6 rounded-full transition p-1 flex items-center ${
                  isCrossfadeEnabled ? 'bg-[#1ed760] justify-end' : 'bg-neutral-700 justify-start'
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-black shadow"></div>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-white/10 bg-black/60 flex items-center justify-between">
          <span className="text-[11px] text-neutral-400 flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-[#1ed760]" /> Changes apply in real-time
          </span>
          <button 
            onClick={() => setIsEqualizerOpen(false)}
            className="px-5 py-1.5 rounded-full bg-white text-black font-extrabold text-xs hover:scale-105 active:scale-95 transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
