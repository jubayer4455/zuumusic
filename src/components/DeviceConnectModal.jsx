import React from 'react';
import { X, Laptop, Smartphone, Headphones, Tv, Radio, Check, Volume2 } from 'lucide-react';
import { useMusic } from '../context/MusicContext';

export const DeviceConnectModal = () => {
  const { 
    isDeviceModalOpen, 
    setIsDeviceModalOpen, 
    connectedDevice, 
    setConnectedDevice, 
    showToast,
    triggerHaptic 
  } = useMusic();

  if (!isDeviceModalOpen) return null;

  const devices = [
    {
      id: 'current',
      name: 'This Device (Web Player)',
      type: 'Browser / Native Audio Engine',
      icon: Laptop,
      isCurrent: true
    },
    {
      id: 'iphone',
      name: 'iPhone 15 Pro',
      type: 'AirPlay • iOS Spatial Audio',
      icon: Smartphone
    },
    {
      id: 'airpods',
      name: 'AirPods Pro 2',
      type: 'Bluetooth Lossless • ANC',
      icon: Headphones
    },
    {
      id: 'tv',
      name: 'Living Room Smart TV',
      type: 'Google Cast • 5.1 Surround',
      icon: Tv
    }
  ];

  const handleSelectDevice = (device) => {
    triggerHaptic('medium');
    setConnectedDevice(device.id);
    showToast(`Switched playback output to ${device.name} 🔊`);
    setTimeout(() => {
      setIsDeviceModalOpen(false);
    }, 400);
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200 select-none"
      onClick={() => setIsDeviceModalOpen(false)}
    >
      <div 
        className="ios-glass-mini text-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-white/20 flex flex-col relative overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Specular top reflection line */}
        <div className="absolute top-0 inset-x-8 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />

        {/* Close Button */}
        <button 
          onClick={() => setIsDeviceModalOpen(false)}
          className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-white rounded-full hover:bg-white/10 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-[#1ed760]/20 border border-[#1ed760]/40 flex items-center justify-center text-[#1ed760] shrink-0">
            <Radio className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="text-lg font-black text-white">Connect to a Device</h3>
            <p className="text-xs text-neutral-400">Stream Zuu Music across speakers & headphones</p>
          </div>
        </div>

        {/* Devices List */}
        <div className="space-y-2 mb-4">
          {devices.map((dev) => {
            const Icon = dev.icon;
            const isSelected = connectedDevice === dev.id;

            return (
              <div
                key={dev.id}
                onClick={() => handleSelectDevice(dev)}
                className={`p-3.5 rounded-2xl border cursor-pointer transition flex items-center justify-between active:scale-[0.98] ${
                  isSelected 
                    ? 'bg-emerald-500/15 border-[#1ed760] shadow-lg shadow-emerald-500/10' 
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    isSelected ? 'bg-[#1ed760] text-black' : 'bg-white/10 text-white'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className={`font-bold text-sm truncate ${isSelected ? 'text-[#1ed760]' : 'text-white'}`}>
                      {dev.name}
                    </div>
                    <div className="text-[11px] text-neutral-400 truncate mt-0.5">
                      {dev.type}
                    </div>
                  </div>
                </div>

                {isSelected ? (
                  <div className="flex items-center gap-1 text-[#1ed760] text-xs font-bold shrink-0">
                    <span className="w-2 h-2 rounded-full bg-[#1ed760] animate-pulse"></span>
                    <span>Connected</span>
                  </div>
                ) : (
                  <span className="text-xs text-neutral-400 shrink-0">Connect</span>
                )}
              </div>
            );
          })}
        </div>

        <div className="bg-white/5 rounded-2xl p-3 border border-white/5 text-[11px] text-neutral-400 flex items-center gap-2">
          <Volume2 className="w-4 h-4 text-[#00f2fe] shrink-0" />
          <span>Supports Lossless 320kbps and Dolby Atmos streams.</span>
        </div>
      </div>
    </div>
  );
};
