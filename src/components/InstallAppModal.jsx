import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Smartphone, 
  Check, 
  Sparkles, 
  Share2, 
  PlusSquare, 
  ArrowDown, 
  ExternalLink,
  Laptop,
  CheckCircle2,
  FileCode,
  ShieldCheck
} from 'lucide-react';
import { useMusic } from '../context/MusicContext';

export const InstallAppModal = () => {
  const { 
    isInstallModalOpen, 
    setIsInstallModalOpen, 
    deferredInstallPrompt, 
    setDeferredInstallPrompt, 
    setIsPwaInstalled, 
    showToast,
    triggerHaptic 
  } = useMusic();

  const [activeTab, setActiveTab] = useState('direct'); // 'direct' | 'pwa'
  const [showManualSteps, setShowManualSteps] = useState(false);

  if (!isInstallModalOpen) return null;

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  const isAndroid = /Android/.test(navigator.userAgent);

  const handleDownloadApk = () => {
    triggerHaptic('heavy');
    const a = document.createElement('a');
    a.href = '/Zuu-Music.apk';
    a.download = 'Zuu-Music.apk';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast("Downloading Zuu Music Android APK (v2.0)... 📥");
  };

  const handleDownloadLauncher = () => {
    triggerHaptic('medium');
    const a = document.createElement('a');
    a.href = '/Zuu-Music-Launcher.html';
    a.download = 'Zuu-Music-App.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast("Downloaded Zuu Music Standalone Web App! 📥");
  };

  const handleNativePrompt = () => {
    triggerHaptic('heavy');
    if (deferredInstallPrompt) {
      deferredInstallPrompt.prompt();
      deferredInstallPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          showToast("Zuu Music installed to Home Screen! 📱✨");
          setIsPwaInstalled(true);
          setIsInstallModalOpen(false);
        }
        setDeferredInstallPrompt(null);
      });
    } else {
      setShowManualSteps(true);
      showToast("Select 'Add to Home Screen' in your browser menu 👇");
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200 select-none"
      onClick={() => setIsInstallModalOpen(false)}
    >
      <div 
        className="ios-glass-mini text-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-white/20 flex flex-col relative overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Specular top reflection line */}
        <div className="absolute top-0 inset-x-8 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />

        {/* Close Button */}
        <button 
          onClick={() => setIsInstallModalOpen(false)}
          className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-white rounded-full hover:bg-white/10 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Icon & Heading */}
        <div className="flex flex-col items-center text-center mt-2 mb-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#1ed760] via-[#00f2fe] to-[#1ed760] p-1 shadow-xl shadow-emerald-500/25 flex items-center justify-center mb-3">
            <div className="w-full h-full bg-black/90 rounded-[14px] flex items-center justify-center">
              <span className="text-2xl font-black bg-gradient-to-tr from-[#1ed760] to-[#00f2fe] bg-clip-text text-transparent">
                Z
              </span>
            </div>
          </div>
          <h3 className="text-xl font-black text-white">Download & Install Zuu Music</h3>
          <p className="text-xs text-neutral-400 mt-1 max-w-xs">
            Direct download for Android, iOS & PC with full background play & offline playback.
          </p>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-white/5 rounded-2xl border border-white/10 mb-4">
          <button
            onClick={() => setActiveTab('direct')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
              activeTab === 'direct' 
                ? 'bg-gradient-to-r from-[#1ed760] to-[#00f2fe] text-black shadow-md' 
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Direct Download (File)
          </button>
          <button
            onClick={() => setActiveTab('pwa')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
              activeTab === 'pwa' 
                ? 'bg-white text-black shadow-md' 
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            1-Click App Install
          </button>
        </div>

        {/* TAB 1: DIRECT DOWNLOAD OPTION */}
        {activeTab === 'direct' && (
          <div className="space-y-3 mb-4">
            {/* Direct APK Download Button */}
            <button
              onClick={handleDownloadApk}
              className="w-full p-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-sm shadow-xl shadow-emerald-500/25 flex items-center justify-between active:scale-[0.98] transition-all border border-emerald-400/30 group"
            >
              <div className="flex items-center gap-3 text-left">
                <div className="w-10 h-10 rounded-xl bg-black/30 flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition">
                  <Smartphone className="w-5 h-5 text-[#1ed760]" />
                </div>
                <div>
                  <div className="font-black text-sm flex items-center gap-1.5">
                    <span>Direct Download Android APK</span>
                    <span className="text-[9px] px-1.5 py-0.2 bg-black/40 text-emerald-300 rounded font-bold">.apk</span>
                  </div>
                  <div className="text-[11px] text-emerald-100/80 font-normal">
                    Direct installation file • Android & Mobile devices
                  </div>
                </div>
              </div>
              <Download className="w-5 h-5 text-white shrink-0 ml-2" />
            </button>

            {/* Direct Web Launcher Download Button */}
            <button
              onClick={handleDownloadLauncher}
              className="w-full p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold text-sm border border-white/10 flex items-center justify-between active:scale-[0.98] transition-all"
            >
              <div className="flex items-center gap-3 text-left">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/10 flex items-center justify-center text-[#00f2fe] shrink-0">
                  <FileCode className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-xs flex items-center gap-1.5">
                    <span>Download Standalone App File</span>
                    <span className="text-[9px] px-1.5 py-0.2 bg-white/10 text-cyan-300 rounded font-bold">.html</span>
                  </div>
                  <div className="text-[10px] text-neutral-400 font-normal">
                    Opens standalone full-screen player offline
                  </div>
                </div>
              </div>
              <Download className="w-4 h-4 text-neutral-300 shrink-0 ml-2" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-neutral-400 pt-1">
              <ShieldCheck className="w-4 h-4 text-[#1ed760]" />
              <span>100% Safe • Verified Zuu Music Build</span>
            </div>
          </div>
        )}

        {/* TAB 2: PWA 1-CLICK INSTALL */}
        {activeTab === 'pwa' && (
          <div className="space-y-3 mb-4">
            <button
              onClick={handleNativePrompt}
              className="w-full py-4 px-4 rounded-2xl bg-gradient-to-r from-[#1ed760] to-[#00f2fe] text-black font-black text-sm shadow-xl shadow-emerald-500/30 flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <Download className="w-5 h-5 stroke-[2.5]" />
              <span>{deferredInstallPrompt ? "1-Click Direct Install to Device" : "Add App Icon to Home Screen"}</span>
            </button>

            {/* Quick Platform-Specific Guide (Collapsible) */}
            <div className="bg-white/5 rounded-2xl p-3 border border-white/10 text-xs space-y-2">
              <button 
                onClick={() => setShowManualSteps(!showManualSteps)}
                className="w-full flex items-center justify-between text-left font-bold text-[#1ed760] text-[11px]"
              >
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> 
                  {isIOS ? 'iPhone / Safari 1-Step Guide' : 'Chrome / Android 1-Step Guide'}
                </span>
                <span className="text-[10px] text-neutral-400">{showManualSteps ? 'Hide' : 'Show'}</span>
              </button>

              {showManualSteps && (
                <div className="pt-2 border-t border-white/10 text-neutral-300 space-y-2 text-[11px]">
                  {isIOS ? (
                    <>
                      <p className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full bg-white/10 flex items-center justify-center font-bold text-[10px]">1</span>
                        <span>Tap Safari <strong>Share button</strong> <Share2 className="w-3 h-3 inline text-white mx-0.5" />.</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full bg-white/10 flex items-center justify-center font-bold text-[10px]">2</span>
                        <span>Select <strong>"Add to Home Screen"</strong>. Done!</span>
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full bg-white/10 flex items-center justify-center font-bold text-[10px]">1</span>
                        <span>Tap Chrome's <strong>three dots menu (⋮)</strong> at top right.</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full bg-white/10 flex items-center justify-center font-bold text-[10px]">2</span>
                        <span>Tap <strong>"Install app"</strong>. Done!</span>
                      </p>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Features Checklist */}
        <div className="space-y-1.5 bg-white/5 rounded-2xl p-3.5 border border-white/5">
          <div className="flex items-center gap-2 text-[11px] text-neutral-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#1ed760] shrink-0" />
            <span><strong>Screen Lock Play:</strong> Never stops when phone is locked</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-neutral-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#00f2fe] shrink-0" />
            <span><strong>Offline Playback:</strong> Direct MP3 download & caching</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-neutral-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#1ed760] shrink-0" />
            <span><strong>Studio 5-Band Equalizer:</strong> Real-time DSP audio tuning</span>
          </div>
        </div>
      </div>
    </div>
  );
};
