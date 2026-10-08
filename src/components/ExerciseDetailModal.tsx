import React from 'react';
import { Exercise } from '../types';
import { ExerciseIllustration } from './ExerciseIllustration';
import { X, CheckCircle2, AlertOctagon, Sparkles, Flame, Target } from 'lucide-react';

interface ExerciseDetailModalProps {
  exercise: Exercise | null;
  onClose: () => void;
  onStartAsQuickSet?: (exercise: Exercise) => void;
}

export const ExerciseDetailModal: React.FC<ExerciseDetailModalProps> = ({
  exercise,
  onClose,
  onStartAsQuickSet,
}) => {
  if (!exercise) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl text-slate-100 max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {exercise.targetMuscle}
              </span>
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                {exercise.equipment}
              </span>
              <span
                className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                  exercise.difficulty === 'Beginner'
                    ? 'bg-blue-500/10 text-blue-400'
                    : exercise.difficulty === 'Intermediate'
                    ? 'bg-amber-500/10 text-amber-400'
                    : 'bg-rose-500/10 text-rose-400'
                }`}
              >
                {exercise.difficulty}
              </span>
            </div>
            <h2 className="text-xl font-bold text-white">{exercise.name}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-5 text-sm">
          {/* Visual Demonstration */}
          <ExerciseIllustration
            demoType={exercise.demoType}
            targetMuscle={exercise.targetMuscle}
            className="w-full h-56"
            isAnimated={true}
            exerciseName={exercise.name}
          />

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-800">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                <Target className="w-3.5 h-3.5 text-emerald-400" />
                Primary Muscle
              </div>
              <div className="font-semibold text-white">{exercise.targetMuscle}</div>
            </div>
            <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-800">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                Secondary
              </div>
              <div className="font-semibold text-white truncate">
                {exercise.secondaryMuscles.join(', ') || 'None'}
              </div>
            </div>
            <div className="col-span-2 sm:col-span-1 bg-slate-800/60 p-3 rounded-xl border border-slate-800">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                Est. Calorie Burn
              </div>
              <div className="font-semibold text-white">~{exercise.caloriesPerMinute * 5} kcal / 5m</div>
            </div>
          </div>

          {/* Step-by-Step Instructions */}
          <div>
            <h3 className="font-bold text-white text-base mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              Execution Guide
            </h3>
            <ol className="space-y-2.5">
              {exercise.instructions.map((step, idx) => (
                <li key={idx} className="flex items-start gap-3 text-slate-300">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-800 text-emerald-400 font-bold text-xs flex items-center justify-center border border-slate-700">
                    {idx + 1}
                  </span>
                  <span className="leading-snug pt-0.5">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Form Tips */}
          {exercise.formTips.length > 0 && (
            <div className="p-4 bg-emerald-950/20 border border-emerald-900/40 rounded-xl">
              <h4 className="font-semibold text-emerald-300 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Pro Form Cues
              </h4>
              <ul className="space-y-1.5">
                {exercise.formTips.map((tip, idx) => (
                  <li key={idx} className="text-xs text-emerald-100/90 list-disc pl-4">
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Common Mistakes */}
          {exercise.commonMistakes.length > 0 && (
            <div className="p-4 bg-rose-950/20 border border-rose-900/40 rounded-xl">
              <h4 className="font-semibold text-rose-300 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <AlertOctagon className="w-4 h-4 text-rose-400" />
                Common Mistakes to Avoid
              </h4>
              <ul className="space-y-1.5">
                {exercise.commonMistakes.map((mistake, idx) => (
                  <li key={idx} className="text-xs text-rose-100/90 list-disc pl-4">
                    {mistake}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 flex items-center justify-between gap-3 bg-slate-900/90">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
          >
            Close
          </button>
          {onStartAsQuickSet && (
            <button
              onClick={() => {
                onStartAsQuickSet(exercise);
                onClose();
              }}
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-slate-950 font-bold rounded-xl transition shadow-lg shadow-emerald-500/20"
            >
              Add to Workout
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
