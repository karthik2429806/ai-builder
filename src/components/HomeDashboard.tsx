import React from 'react';
import { UserProfile, WorkoutPlan, CompletedWorkoutLog } from '../types';
import {
  Flame,
  Clock,
  Play,
  Sparkles,
  Droplet,
  MessageSquare,
  Award,
  Calendar,
  ChevronRight,
  Shield,
  Zap,
  Target,
  Dumbbell,
  BookOpen,
} from 'lucide-react';

interface HomeDashboardProps {
  userProfile: UserProfile;
  activePlan: WorkoutPlan;
  history: CompletedWorkoutLog[];
  onStartWorkout: () => void;
  onNavigateTab: (tab: string) => void;
  onOpenAiGenerator: () => void;
  onIncrementWater: () => void;
  onOpenDisclaimer: () => void;
  onOpenMobileShare?: () => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  userProfile,
  activePlan,
  history,
  onStartWorkout,
  onNavigateTab,
  onOpenAiGenerator,
  onIncrementWater,
  onOpenDisclaimer,
  onOpenMobileShare,
}) => {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  const latestHistory = history[0];

  return (
    <div className="space-y-6">
      {/* Welcome Banner & Streak Pill */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              {today}
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-xs text-slate-400">Target: {userProfile.goal}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Ready to train, {userProfile.name}?
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onOpenMobileShare && (
            <button
              onClick={onOpenMobileShare}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-xl font-bold text-xs transition shadow-sm cursor-pointer"
              title="Open App on Mobile via QR code & URL"
            >
              <span>📱 Open on Mobile</span>
            </button>
          )}
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-xl font-bold text-xs shadow-sm">
            <Flame className="w-4 h-4 fill-amber-400" />
            <span>4-Day Consistency Streak</span>
          </div>
        </div>
      </div>

      {/* TODAY'S WORKOUT HERO CARD */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-700/80 shadow-2xl p-6 sm:p-8">
        {/* Glow Accent Ambient Blob */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-60 h-60 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30">
                Today's Focus
              </span>
              {activePlan.isCustomAI && (
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  AI Customized
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
              <span className="flex items-center gap-1 text-slate-200">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                ~{activePlan.estimatedDurationMin} mins
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-slate-200">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                ~{activePlan.estimatedCalories} kcal
              </span>
              <span>•</span>
              <span className="text-emerald-400 font-semibold">{activePlan.difficulty}</span>
            </div>
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {activePlan.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              {activePlan.description}
            </p>
          </div>

          {/* Muscle Focus Pills */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[11px] text-slate-400 font-semibold mr-1">Target Areas:</span>
            {activePlan.targetMuscles.map((muscle) => (
              <span
                key={muscle}
                className="text-[11px] font-semibold px-2.5 py-0.5 rounded-lg bg-slate-800 text-slate-200 border border-slate-700/80"
              >
                {muscle}
              </span>
            ))}
          </div>

          {/* Exercises Preview Summary */}
          <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-2xl grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            {activePlan.exercises.slice(0, 4).map((ex, idx) => (
              <div key={idx} className="p-2 bg-slate-900/60 rounded-xl border border-slate-800/80">
                <div className="font-semibold text-white truncate">{ex.name}</div>
                <div className="text-[10px] text-slate-400">{ex.sets.length} sets • {ex.equipment}</div>
              </div>
            ))}
          </div>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
            <button
              onClick={onStartWorkout}
              className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-black text-sm rounded-2xl transition shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2 group cursor-pointer"
            >
              <Play className="w-5 h-5 fill-slate-950 group-hover:scale-110 transition" />
              <span>Start Workout ({userProfile.defaultRestSeconds || 45}s Lap Rest)</span>
            </button>

            <button
              onClick={onOpenAiGenerator}
              className="px-5 py-3.5 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 text-xs font-bold rounded-2xl transition flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Swap / AI Advanced Mode</span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono pt-1">
            <span className="text-emerald-400 font-bold">⚡ Active Density:</span>
            <span>{userProfile.defaultRestSeconds || 45}s Rest per Lap</span>
            <span>•</span>
            <span className="text-slate-300">Hands-Free Auto-Start Enabled</span>
          </div>
        </div>
      </div>

      {/* QUICK ACTIONS & INTERACTIVE WIDGETS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Widget 1: AI Coach Assistant */}
        <div
          onClick={() => onNavigateTab('coach')}
          className="p-5 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl cursor-pointer transition flex flex-col justify-between group shadow-sm"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <MessageSquare className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
              24/7 Available
            </span>
          </div>
          <div>
            <h3 className="font-bold text-white text-base group-hover:text-emerald-300 transition">
              Chat with Coach Pulse
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Ask questions: "What should I do in 20 min?", "How to fix my form?", nutrition tips.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-emerald-400 font-semibold">
            <span>Open Coach Chat</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </div>
        </div>

        {/* Widget 2: Hydration Quick Tracker */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Droplet className="w-5 h-5" />
            </div>
            <span className="text-xs font-mono font-bold text-cyan-300">
              {userProfile.waterDrankTodayGlasses} / {userProfile.waterIntakeGoalGlasses} Glasses
            </span>
          </div>
          <div>
            <h3 className="font-bold text-white text-base">Hydration Log</h3>
            <p className="text-xs text-slate-400 mt-1">
              Water fuels muscular endurance and speeds up post-workout metabolic recovery.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
            <button
              onClick={onIncrementWater}
              className="w-full py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 active:scale-95"
            >
              +1 Glass Drank
            </button>
          </div>
        </div>

        {/* Widget 3: Exercise Library Shortcut */}
        <div
          onClick={() => onNavigateTab('library')}
          className="p-5 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl cursor-pointer transition flex flex-col justify-between group shadow-sm"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded-full">
              30+ Exercises
            </span>
          </div>
          <div>
            <h3 className="font-bold text-white text-base group-hover:text-purple-300 transition">
              Exercise Library
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Step-by-step form cues, anatomy demos, and common mistakes to avoid.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-purple-400 font-semibold">
            <span>Browse Library</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </div>
        </div>
      </div>

      {/* WEEKLY TRAINING SCHEDULE OVERVIEW */}
      <div className="bg-slate-900 border border-slate-800 p-5 sm:p-6 rounded-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-400" />
              Weekly Training Cadence
            </h3>
            <p className="text-xs text-slate-400">
              Balanced between high-intensity stimulation and neuromuscular recovery
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('settings')}
            className="text-xs text-emerald-400 hover:underline font-semibold"
          >
            Edit Schedule
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {[
            { day: 'Mon', focus: 'Full Body Blast', isRest: false, isToday: false },
            { day: 'Tue', focus: 'Active Recovery', isRest: true, isToday: false },
            { day: 'Wed', focus: 'Upper Armor', isRest: false, isToday: true },
            { day: 'Thu', focus: 'Mobility & Walk', isRest: true, isToday: false },
            { day: 'Fri', focus: 'Lower & Glutes', isRest: false, isToday: false },
            { day: 'Sat', focus: 'HIIT Express', isRest: false, isToday: false },
            { day: 'Sun', focus: 'Full Rest Day', isRest: true, isToday: false },
          ].map((item, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-xl border transition text-center ${
                item.isToday
                  ? 'bg-emerald-500/15 border-emerald-500 text-emerald-300 shadow-sm ring-1 ring-emerald-500'
                  : item.isRest
                  ? 'bg-slate-950/60 border-slate-800/80 text-slate-500'
                  : 'bg-slate-800/50 border-slate-700/80 text-slate-200'
              }`}
            >
              <div className="font-bold text-xs uppercase flex items-center justify-center gap-1">
                {item.day}
                {item.isToday && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
              </div>
              <div className="text-[11px] font-semibold mt-1 truncate">
                {item.focus}
              </div>
              <span className={`text-[9px] uppercase tracking-wider block mt-1 font-mono ${item.isRest ? 'text-slate-500' : 'text-emerald-400'}`}>
                {item.isRest ? 'Rest Day' : 'Workout'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* SAFETY DISCLAIMER FOOTER */}
      <div className="p-4 bg-slate-950/80 border border-slate-800/80 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            <strong>Health Notice</strong>: PulseAI provides general fitness information. If you feel dizzy, nauseous, or pain, stop exercising immediately.
          </span>
        </div>
        <button
          onClick={onOpenDisclaimer}
          className="text-emerald-400 hover:underline font-semibold shrink-0"
        >
          View Full Disclaimer
        </button>
      </div>
    </div>
  );
};
