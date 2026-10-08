import React from 'react';
import { AlertTriangle, ShieldCheck, HeartPulse, X } from 'lucide-react';

interface MedicalDisclaimerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MedicalDisclaimerModal: React.FC<MedicalDisclaimerModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl p-6 shadow-2xl text-slate-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Health & Safety Disclaimer</h3>
            <p className="text-xs text-slate-400">Please read carefully before training</p>
          </div>
        </div>

        <div className="space-y-3.5 text-sm text-slate-300 leading-relaxed max-h-[60vh] overflow-y-auto pr-1">
          <div className="p-3.5 bg-slate-800/60 rounded-xl border border-slate-700 text-xs">
            <p className="font-semibold text-amber-300 mb-1 flex items-center gap-1.5">
              <HeartPulse className="w-4 h-4 text-rose-400 shrink-0" />
              PulseAI is for educational & fitness purposes only:
            </p>
            The workouts, guidance, and AI coaching provided in this application are general wellness suggestions and are NOT a replacement for qualified medical advice, physical therapy, or physician consultation.
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-slate-100 text-xs uppercase tracking-wider">
              Immediate Stop Signals
            </h4>
            <p className="text-xs">
              Stop exercising immediately and seek prompt medical attention if you experience:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs text-slate-300">
              <li>Chest tightness, pressure, or irregular heart palpitations</li>
              <li>Lightheadedness, dizziness, fainting, or nausea</li>
              <li>Sharp, sudden, or shooting joint/muscle pain</li>
              <li>Unusual shortness of breath out of proportion to your exertion</li>
            </ul>
          </div>

          <div className="p-3 bg-emerald-950/30 border border-emerald-800/40 rounded-xl flex items-start gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <p className="text-xs text-emerald-200">
              Always listen to your body, warm up adequately, maintain proper hydration, and progress weight loads sensibly according to your current fitness level.
            </p>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-slate-950 font-bold rounded-xl transition shadow-lg shadow-emerald-500/20"
          >
            I Understand & Agree
          </button>
        </div>
      </div>
    </div>
  );
};
