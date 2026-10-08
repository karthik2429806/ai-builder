import React, { useState } from 'react';
import { CompletedWorkoutLog } from '../types';
import { History, Calendar, Clock, Flame, Dumbbell, Star, ChevronDown, ChevronUp } from 'lucide-react';

interface WorkoutHistoryViewProps {
  history: CompletedWorkoutLog[];
}

export const WorkoutHistoryView: React.FC<WorkoutHistoryViewProps> = ({ history }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const formatDuration = (sec: number) => {
    const mins = Math.round(sec / 60);
    return `${mins} min`;
  };

  const formatDate = (isoString: string) => {
    const d = new Date(isoString);
    return d.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <History className="w-6 h-6 text-emerald-400" />
            Workout History & Activity Log
          </h2>
          <p className="text-xs text-slate-400">
            {history.length} completed sessions logged
          </p>
        </div>
      </div>

      {history.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center text-slate-400">
          <Dumbbell className="w-10 h-10 text-slate-600 mx-auto mb-2" />
          <p className="font-semibold text-white">No workouts recorded yet</p>
          <p className="text-xs mt-1">Complete your first session from Today's Workout tab!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((log) => {
            const isExpanded = expandedId === log.id;

            return (
              <div
                key={log.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 transition hover:border-slate-700"
              >
                <div
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer"
                  onClick={() => setExpandedId(isExpanded ? null : log.id)}
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        {formatDate(log.completedAt)}
                      </span>
                      {log.userRating && (
                        <div className="flex items-center gap-0.5 text-amber-400">
                          {Array.from({ length: log.userRating }).map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-amber-400" />
                          ))}
                        </div>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-white">{log.title}</h3>
                  </div>

                  {/* Summary Badges */}
                  <div className="flex items-center gap-3 sm:gap-4 text-xs font-mono">
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <Clock className="w-4 h-4 text-emerald-400" />
                      {formatDuration(log.durationSeconds)}
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <Flame className="w-4 h-4 text-amber-400" />
                      ~{log.caloriesBurned} kcal
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <Dumbbell className="w-4 h-4 text-cyan-400" />
                      {log.totalVolumeKg} kg
                    </div>
                    <button className="text-slate-400 hover:text-white p-1">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-3 text-xs">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <div className="bg-slate-800/50 p-2.5 rounded-xl">
                        <span className="text-slate-400 block text-[10px] uppercase">Exercises</span>
                        <span className="font-bold text-white text-sm">{log.exercisesCompleted} Completed</span>
                      </div>
                      <div className="bg-slate-800/50 p-2.5 rounded-xl">
                        <span className="text-slate-400 block text-[10px] uppercase">Sets Total</span>
                        <span className="font-bold text-white text-sm">{log.totalSetsCompleted} Sets</span>
                      </div>
                      <div className="bg-slate-800/50 p-2.5 rounded-xl">
                        <span className="text-slate-400 block text-[10px] uppercase">Pace</span>
                        <span className="font-bold text-white text-sm">
                          {Math.round(log.durationSeconds / (log.totalSetsCompleted || 1))}s / set
                        </span>
                      </div>
                      <div className="bg-slate-800/50 p-2.5 rounded-xl">
                        <span className="text-slate-400 block text-[10px] uppercase">Intensity</span>
                        <span className="font-bold text-emerald-400 text-sm">High Aerobic</span>
                      </div>
                    </div>

                    {log.feedback && (
                      <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-800/80 text-slate-300 italic">
                        "{log.feedback}"
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
