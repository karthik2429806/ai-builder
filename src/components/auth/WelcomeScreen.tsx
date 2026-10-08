import React from 'react';
import {
  Dumbbell,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Activity,
  Flame,
  Timer,
  Bot,
  UserCheck,
} from 'lucide-react';

interface WelcomeScreenProps {
  onNavigateToSignUp: () => void;
  onNavigateToSignIn: () => void;
  onQuickDemoLogin?: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onNavigateToSignUp,
  onNavigateToSignIn,
  onQuickDemoLogin,
}) => {
  return (
    <div className="w-full max-w-lg mx-auto flex flex-col items-center text-center px-4 py-8 sm:py-12 animate-fadeIn">
      {/* Brand Header */}
      <div className="relative mb-6">
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-400 flex items-center justify-center text-slate-950 shadow-2xl shadow-emerald-500/25 ring-8 ring-emerald-500/10 transform transition-transform hover:scale-105 duration-300">
          <Dumbbell className="w-10 h-10 sm:w-12 sm:h-12 transform -rotate-12 stroke-[2.5]" />
        </div>
        <div className="absolute -bottom-2 -right-2 p-1.5 bg-slate-900 border border-slate-700 rounded-xl shadow-md">
          <Sparkles className="w-4 h-4 text-emerald-400" />
        </div>
      </div>

      {/* App Logo & Name */}
      <div className="space-y-2 mb-6">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">
          <Activity className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
          Intelligent Fitness System
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          AI Personal Trainer
        </h1>
        {/* Short Tagline as requested */}
        <p className="text-base sm:text-lg text-slate-300 font-medium max-w-sm mx-auto">
          Your personal fitness coach, anytime.
        </p>
      </div>

      {/* Visual highlights grid */}
      <div className="w-full grid grid-cols-2 gap-2.5 sm:gap-3 mb-8 text-left">
        <div className="p-3 sm:p-3.5 bg-slate-900/80 border border-slate-800 rounded-2xl flex items-start gap-2.5">
          <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl">
            <Flame className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-white">Smart Workouts</div>
            <div className="text-[11px] text-slate-400 leading-tight">Tailored to your equipment & level</div>
          </div>
        </div>

        <div className="p-3 sm:p-3.5 bg-slate-900/80 border border-slate-800 rounded-2xl flex items-start gap-2.5">
          <div className="p-2 bg-cyan-500/10 text-cyan-400 rounded-xl">
            <Timer className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-white">30-45s Rest Timers</div>
            <div className="text-[11px] text-slate-400 leading-tight">High-density conditioning intervals</div>
          </div>
        </div>

        <div className="p-3 sm:p-3.5 bg-slate-900/80 border border-slate-800 rounded-2xl flex items-start gap-2.5">
          <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-white">Video Motion Form</div>
            <div className="text-[11px] text-slate-400 leading-tight">Real-time biomechanics & cues</div>
          </div>
        </div>

        <div className="p-3 sm:p-3.5 bg-slate-900/80 border border-slate-800 rounded-2xl flex items-start gap-2.5">
          <div className="p-2 bg-purple-500/10 text-purple-400 rounded-xl">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-white">Coach Pulse 24/7</div>
            <div className="text-[11px] text-slate-400 leading-tight">Instant audio & sports science chat</div>
          </div>
        </div>
      </div>

      {/* Primary Actions */}
      <div className="w-full space-y-3">
        {/* Create Account button */}
        <button
          onClick={onNavigateToSignUp}
          className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl font-bold text-slate-950 bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 hover:from-emerald-300 hover:to-teal-300 transition-all duration-200 shadow-xl shadow-emerald-500/25 active:scale-[0.99] text-base"
        >
          <span>Create Account</span>
          <ArrowRight className="w-5 h-5" />
        </button>

        {/* Sign In button */}
        <button
          onClick={onNavigateToSignIn}
          className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl font-semibold text-slate-200 bg-slate-800/90 hover:bg-slate-800 hover:text-white border border-slate-700/80 transition-all duration-200 active:scale-[0.99] text-base"
        >
          Sign In
        </button>

        {/* Quick Demo Login Option */}
        {onQuickDemoLogin && (
          <div className="pt-2">
            <button
              onClick={onQuickDemoLogin}
              className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 hover:text-emerald-300 py-1.5 px-3 rounded-lg hover:bg-emerald-500/10 transition-colors"
            >
              <UserCheck className="w-4 h-4" />
              <span>Or Explore with Demo Account (Alex Rivera)</span>
            </button>
          </div>
        )}
      </div>

      {/* Security note */}
      <div className="mt-8 flex items-center gap-1.5 text-xs text-slate-400">
        <ShieldCheck className="w-4 h-4 text-emerald-500" />
        <span>End-to-end encrypted session • Private user metrics</span>
      </div>
    </div>
  );
};
