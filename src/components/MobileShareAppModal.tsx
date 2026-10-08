import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import {
  Smartphone,
  Copy,
  Check,
  QrCode,
  Share2,
  ExternalLink,
  X,
  Sparkles,
  Download,
  Apple,
  Globe,
  Flame,
} from 'lucide-react';

interface MobileShareAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileShareAppModal: React.FC<MobileShareAppModalProps> = ({
  isOpen,
  onClose,
}) => {
  // Primary public share URL from environment metadata, fallback to current window location
  const publicAppUrl =
    'https://ais-pre-7ltcfuymyhtb6u4pmtdbj5-585520100488.asia-east1.run.app';

  const [activeUrl, setActiveUrl] = useState(publicAppUrl);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'qr' | 'install'>('qr');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // If current host is available and looks like a valid preview or production URL, user can choose
      const current = window.location.href;
      if (current.startsWith('http')) {
        // use public share URL as preferred for external mobile phones
        setActiveUrl(publicAppUrl);
      }
    }
  }, []);

  // Generate QR Code image
  useEffect(() => {
    if (!isOpen || !activeUrl) return;

    QRCode.toDataURL(activeUrl, {
      width: 280,
      margin: 2,
      color: {
        dark: '#020617',
        light: '#ffffff',
      },
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('Failed to generate QR code', err));
  }, [isOpen, activeUrl]);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(activeUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && 'share' in navigator) {
      try {
        await navigator.share({
          title: 'PulseAI - AI Personal Trainer & Workout Coach',
          text: 'Start your personalized AI workouts with real-time video motion and lap rest timing!',
          url: activeUrl,
        });
      } catch {
        // share cancelled
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl text-slate-100 overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Smartphone className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white flex items-center gap-1.5">
                <span>Access on Mobile Phone</span>
                <span className="text-xs bg-emerald-500/15 text-emerald-400 px-2 py-0.5 rounded-full font-mono font-semibold border border-emerald-500/30">
                  Live URL
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Scan QR or share the URL to open PulseAI directly on any smartphone
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 border-b border-slate-800 bg-slate-950/40 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('qr')}
            className={`py-3 flex items-center justify-center gap-2 transition border-b-2 cursor-pointer ${
              activeTab === 'qr'
                ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span>Scan QR & Mobile URL</span>
          </button>

          <button
            onClick={() => setActiveTab('install')}
            className={`py-3 flex items-center justify-center gap-2 transition border-b-2 cursor-pointer ${
              activeTab === 'install'
                ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>Install as App (PWA)</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto max-h-[75vh]">
          {activeTab === 'qr' && (
            <div className="space-y-5 text-center">
              {/* QR Code Container */}
              <div className="inline-block p-4 bg-white rounded-2xl shadow-xl shadow-black/40 border-4 border-slate-800 relative group">
                {qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt="Scan to open PulseAI on mobile"
                    className="w-48 h-48 sm:w-56 sm:h-56 mx-auto rounded-lg"
                  />
                ) : (
                  <div className="w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center text-slate-900 font-mono text-xs">
                    Generating QR code...
                  </div>
                )}
                <div className="absolute inset-0 bg-emerald-500/10 rounded-xl pointer-events-none" />
              </div>

              <div className="space-y-1">
                <div className="text-xs font-bold text-white flex items-center justify-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Point your smartphone camera at the QR code above</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Works instantly on iPhone (iOS Camera) and Android (Google Lens / Camera)
                </p>
              </div>

              {/* Shareable URL Copy Card */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3 sm:p-4 text-left space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-semibold flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-emerald-400" />
                    Mobile App Access Link
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono">Public HTTPS</span>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={activeUrl}
                    className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2 font-mono truncate focus:outline-none select-all"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition flex items-center gap-1.5 shrink-0 shadow-md shadow-emerald-500/20 active:scale-95 cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy URL</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <button
                  onClick={handleNativeShare}
                  className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 border border-slate-700 cursor-pointer"
                >
                  <Share2 className="w-4 h-4 text-cyan-400" />
                  <span>Share via Phone</span>
                </button>

                <a
                  href={activeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-4 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Open URL Directly</span>
                </a>
              </div>
            </div>
          )}

          {activeTab === 'install' && (
            <div className="space-y-4 text-xs text-slate-300">
              <div className="bg-emerald-950/20 border border-emerald-500/30 p-3.5 rounded-2xl flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-500 text-slate-950 font-black flex items-center justify-center shrink-0">
                  <Flame className="w-5 h-5 fill-slate-950" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs">Full Screen Native App Experience</h4>
                  <p className="text-[11px] text-slate-300">
                    PulseAI runs offline-ready, in full screen without browser toolbars, with instant audio cues and workout tracking.
                  </p>
                </div>
              </div>

              {/* iOS Guide */}
              <div className="bg-slate-800/60 border border-slate-800 p-4 rounded-2xl space-y-2.5">
                <div className="flex items-center gap-2 font-bold text-white text-xs">
                  <Apple className="w-4 h-4 text-slate-300" />
                  <span>iPhone & iPad (Safari)</span>
                </div>
                <ol className="list-decimal list-inside space-y-1.5 text-slate-400 text-[11px] leading-relaxed">
                  <li>
                    Open the link <strong className="text-slate-200">in Safari</strong> on your iPhone.
                  </li>
                  <li>
                    Tap the <strong className="text-slate-200">Share icon</strong> (square with arrow pointing up) at the bottom toolbar.
                  </li>
                  <li>
                    Scroll down and tap <strong className="text-emerald-400">Add to Home Screen</strong>.
                  </li>
                  <li>
                    Tap <strong className="text-slate-200">Add</strong> in the top right. PulseAI is now on your home screen!
                  </li>
                </ol>
              </div>

              {/* Android Guide */}
              <div className="bg-slate-800/60 border border-slate-800 p-4 rounded-2xl space-y-2.5">
                <div className="flex items-center gap-2 font-bold text-white text-xs">
                  <Smartphone className="w-4 h-4 text-emerald-400" />
                  <span>Android (Chrome / Samsung Internet)</span>
                </div>
                <ol className="list-decimal list-inside space-y-1.5 text-slate-400 text-[11px] leading-relaxed">
                  <li>
                    Open the link <strong className="text-slate-200">in Chrome</strong> on your Android phone.
                  </li>
                  <li>
                    Tap the <strong className="text-slate-200">three dots menu (⋮)</strong> in the top right corner.
                  </li>
                  <li>
                    Select <strong className="text-emerald-400">Install app</strong> or <strong className="text-emerald-400">Add to Home Screen</strong>.
                  </li>
                  <li>
                    Confirm install. PulseAI will install as a native standalone app!
                  </li>
                </ol>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleCopyLink}
                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95 cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>URL Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy App URL to Send to Phone</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
