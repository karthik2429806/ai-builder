import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Smartphone, X, CheckCircle2, Share2 } from 'lucide-react';

interface PWAInstallButtonProps {
  className?: string;
  variant?: 'pill' | 'button' | 'compact';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  className = '',
  variant = 'button',
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running in standalone PWA mode, don't show prompt
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className={`flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-extrabold text-xs transition shadow-md shadow-emerald-500/20 cursor-pointer ${
          variant === 'compact' ? 'px-3 py-1.5' : 'px-4 py-2'
        } ${className}`}
        title="Install PulseAI as native app"
      >
        <Download className="w-4 h-4 stroke-[2.5]" />
        <span>Install App</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className={`flex items-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-bold transition cursor-pointer ${
            variant === 'compact' ? 'px-2.5 py-1' : 'px-3.5 py-1.5'
          } ${className}`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Add to Home Screen</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-fadeIn">
            <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-700 p-6 shadow-2xl text-slate-100 relative">
              <button
                onClick={() => setShowIOSGuide(false)}
                className="absolute top-4 right-4 p-1 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2.5 mb-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Install on iPhone / iPad</h3>
                  <p className="text-xs text-slate-400">Launch in full-screen native mode</p>
                </div>
              </div>

              <div className="space-y-3 text-xs text-slate-300 py-2">
                <div className="flex items-start gap-3 p-3 bg-slate-800/60 rounded-xl border border-slate-800">
                  <span className="w-6 h-6 rounded-full bg-slate-700 text-emerald-400 font-bold flex items-center justify-center shrink-0">
                    1
                  </span>
                  <span>
                    In Safari, tap the <strong>Share</strong> button (box with upward arrow) in the bottom toolbar.
                  </span>
                </div>

                <div className="flex items-start gap-3 p-3 bg-slate-800/60 rounded-xl border border-slate-800">
                  <span className="w-6 h-6 rounded-full bg-slate-700 text-emerald-400 font-bold flex items-center justify-center shrink-0">
                    2
                  </span>
                  <span>
                    Scroll down and tap <strong>Add to Home Screen</strong>.
                  </span>
                </div>

                <div className="flex items-start gap-3 p-3 bg-slate-800/60 rounded-xl border border-slate-800">
                  <span className="w-6 h-6 rounded-full bg-slate-700 text-emerald-400 font-bold flex items-center justify-center shrink-0">
                    3
                  </span>
                  <span>
                    Tap <strong>Add</strong> in the top-right corner. PulseAI will now appear on your home screen!
                  </span>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-4 w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition"
              >
                Got It
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Fallback for browsers that don't trigger beforeinstallprompt (shows generic install modal button)
  return (
    <button
      onClick={() => setShowIOSGuide(true)}
      className={`flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition cursor-pointer ${
        variant === 'compact' ? 'px-2.5 py-1' : 'px-3.5 py-1.5'
      } ${className}`}
      title="Install as mobile app"
    >
      <Download className="w-3.5 h-3.5 text-emerald-400" />
      <span>Install App</span>
    </button>
  );
};
