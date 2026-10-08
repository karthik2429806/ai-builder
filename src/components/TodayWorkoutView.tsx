import React from 'react';
import { WorkoutPlan, UserProfile, Exercise } from '../types';
import { EXERCISE_LIBRARY } from '../data/exercises';
import { ExerciseIllustration } from './ExerciseIllustration';
import {
  Play,
  Clock,
  Flame,
  Dumbbell,
  Sparkles,
  Info,
  CheckCircle2,
  ChevronRight,
  Shield,
} from 'lucide-react';

interface TodayWorkoutViewProps {
  plan: WorkoutPlan;
  userProfile: UserProfile;
  onStartWorkout: () => void;
  onOpenAiGenerator: () => void;
  onSelectExercise: (ex: Exercise) => void;
  onOpenDisclaimer: () => void;
}

export const TodayWorkoutView: React.FC<TodayWorkoutViewProps> = ({
  plan,
  userProfile,
  onStartWorkout,
  onOpenAiGenerator,
  onSelectExercise,
  onOpenDisclaimer,
}) => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Hero Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-3xl relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/25">
              Scheduled Workout
            </span>

            <div className="flex items-center gap-3 text-xs text-slate-300 font-mono">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                ~{plan.estimatedDurationMin} mins
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                ~{plan.estimatedCalories} kcal
              </span>
              <span>•</span>
              <span className="text-emerald-400 font-bold">{plan.difficulty}</span>
            </div>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {plan.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              {plan.description}
            </p>
          </div>

          {/* Coach Insight */}
          {plan.coachTips && (
            <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl text-xs text-slate-300 flex items-start gap-2">
              <span className="text-base shrink-0">💡</span>
              <span className="italic">
                <strong>Coach Pulse:</strong> "{plan.coachTips}"
              </span>
            </div>
          )}

          {/* Primary CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
            <button
              onClick={onStartWorkout}
              className="px-8 py-3.5 bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-black text-sm rounded-2xl transition shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play className="w-5 h-5 fill-slate-950" />
              <span>Start Workout ({userProfile.defaultRestSeconds || 45}s Lap Rest)</span>
            </button>

            <button
              onClick={onOpenAiGenerator}
              className="px-5 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-2xl transition flex items-center justify-center gap-2 border border-slate-700"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Adjust / AI Beast Mode</span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono pt-1">
            <span className="text-emerald-400 font-bold">⚡ Rest Density:</span>
            <span>{userProfile.defaultRestSeconds || 45}s between sets/laps</span>
            <span>•</span>
            <span className="text-slate-300">Auto-Starts next exercise after rest timer</span>
          </div>
        </div>
      </div>

      {/* Warm-Up Section */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            Phase 1: Dynamic Warm-Up ({plan.warmup.length} Movements)
          </h3>
          <span className="text-xs font-mono text-slate-400">~3 mins</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {plan.warmup.map((item, idx) => (
            <div key={idx} className="p-3 bg-slate-800/50 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between text-xs font-bold text-white mb-1">
                <span>{item.name}</span>
                <span className="text-slate-400 font-mono text-[10px]">{item.duration}</span>
              </div>
              <p className="text-[11px] text-slate-400">{item.instructions}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Main Exercises Lineup */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            Phase 2: Main Resistance Sets ({plan.exercises.length} Exercises)
          </h3>
          <span className="text-xs text-slate-400">Click any card to inspect form guide</span>
        </div>

        <div className="space-y-3">
          {plan.exercises.map((ex, idx) => {
            const libraryItem = EXERCISE_LIBRARY.find((e) => e.id === ex.exerciseId);

            return (
              <div
                key={ex.id || idx}
                onClick={() => {
                  if (libraryItem) onSelectExercise(libraryItem);
                }}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 p-4 sm:p-5 rounded-2xl transition cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 font-black text-sm flex items-center justify-center shrink-0">
                    #{idx + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                        {ex.targetMuscle}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {ex.equipment}
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-white group-hover:text-emerald-300 transition">
                      {ex.name}
                    </h4>
                    <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                      {ex.formCues || libraryItem?.formTips[0] || 'Keep core engaged and tempo deliberate.'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono self-end sm:self-center shrink-0">
                  <div className="text-right">
                    <div className="font-bold text-white text-sm">
                      {ex.sets.length} sets × {ex.sets[0]?.reps || 12} reps
                    </div>
                    <div className="text-[10px] text-slate-400">Rest: {ex.restSeconds}s</div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Cool-Down Section */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            Phase 3: Cool-Down & Static Stretches ({plan.cooldown.length} Items)
          </h3>
          <span className="text-xs font-mono text-slate-400">~2 mins</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {plan.cooldown.map((item, idx) => (
            <div key={idx} className="p-3 bg-slate-800/50 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between text-xs font-bold text-white mb-1">
                <span>{item.name}</span>
                <span className="text-slate-400 font-mono text-[10px]">{item.duration}</span>
              </div>
              <p className="text-[11px] text-slate-400">{item.instructions}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Safety Banner */}
      <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Remember to hydrate with water and stop if you experience sharp pain.</span>
        </div>
        <button
          onClick={onOpenDisclaimer}
          className="text-emerald-400 hover:underline font-semibold shrink-0"
        >
          Disclaimer
        </button>
      </div>
    </div>
  );
};
