import React from 'react';
import { X, ShieldCheck, FileText, Check } from 'lucide-react';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept?: () => void;
}

export const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose, onAccept }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl text-slate-100 flex flex-col max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Terms of Service & Privacy</h3>
              <p className="text-xs text-slate-400">AI Personal Trainer Fitness Platform</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-sm text-slate-300 leading-relaxed">
          <section className="space-y-1.5">
            <h4 className="font-semibold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-400" />
              1. Acceptance of Terms
            </h4>
            <p>
              By creating an account and using AI Personal Trainer ("PulseAI"), you agree to follow these Terms of Service, all applicable sports safety guidelines, and our privacy practices.
            </p>
          </section>

          <section className="space-y-1.5">
            <h4 className="font-semibold text-white">2. Physical Fitness & Medical Clearance</h4>
            <p>
              You acknowledge that engaging in physical exercise involves inherent risks. AI Personal Trainer provides educational, biomechanical, and conditioning guidance for healthy individuals. Always consult a physician prior to starting any new strenuous physical workout program.
            </p>
          </section>

          <section className="space-y-1.5">
            <h4 className="font-semibold text-white">3. Data Privacy & Account Isolation</h4>
            <p>
              Your personal health metrics, body weight, workout logs, and custom plans are strictly isolated to your authenticated account. Passwords are encrypted using cryptographic hashing and are never stored in plain text.
            </p>
          </section>

          <section className="space-y-1.5">
            <h4 className="font-semibold text-white">4. User Conduct</h4>
            <p>
              You are responsible for keeping your credentials confidential. You agree not to attempt unauthorized access to other user accounts or disrupt platform availability.
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-900/95 border-t border-slate-800 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
          >
            Close
          </button>
          {onAccept && (
            <button
              onClick={() => {
                onAccept();
                onClose();
              }}
              className="flex items-center gap-1.5 px-5 py-2 text-sm font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl transition-colors shadow-lg shadow-emerald-500/20"
            >
              <Check className="w-4 h-4" />
              I Agree & Accept
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
