import React, { useState, useEffect, useRef } from 'react';
import { WorkoutPlan, UserProfile, CompletedWorkoutLog } from '../types';
import { soundService } from '../services/audio';
import { StorageService } from '../services/storage';
import { EXERCISE_LIBRARY } from '../data/exercises';
import { ExerciseIllustration } from './ExerciseIllustration';
import confetti from 'canvas-confetti';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Clock,
  Flame,
  Dumbbell,
  FastForward,
  Award,
  ChevronRight,
  ChevronLeft,
  Star,
  Info,
  Zap,
  Volume2,
  RefreshCw,
  Repeat,
} from 'lucide-react';

interface WorkoutPlayerModalProps {
  plan: WorkoutPlan;
  userProfile: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onWorkoutCompleted: (log: CompletedWorkoutLog) => void;
}

export const WorkoutPlayerModal: React.FC<WorkoutPlayerModalProps> = ({
  plan,
  userProfile,
  isOpen,
  onClose,
  onWorkoutCompleted,
}) => {
  // Session tracking
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  // Phase: 'warmup' | 'workout' | 'cooldown' | 'summary'
  const [currentPhase, setCurrentPhase] = useState<'warmup' | 'workout' | 'cooldown' | 'summary'>('warmup');
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);

  // Circuit Lap / Round Tracker
  const [currentLap, setCurrentLap] = useState(1);
  const totalLaps = plan.difficulty === 'Advanced' ? 4 : 3;

  // Exercises mutable state (sets, reps, weights, completed)
  const [exerciseState, setExerciseState] = useState(plan.exercises);

  // Warmup/Cooldown completion toggles
  const [warmupChecks, setWarmupChecks] = useState<boolean[]>(plan.warmup.map(() => false));
  const [cooldownChecks, setCooldownChecks] = useState<boolean[]>(plan.cooldown.map(() => false));

  // Rest timer: 30 to 45 seconds default
  const [selectedRestOption, setSelectedRestOption] = useState<30 | 45 | 60>(
    userProfile.defaultRestSeconds || 45
  );
  const [restSecondsRemaining, setRestSecondsRemaining] = useState<number | null>(null);
  const [restTotalDuration, setRestTotalDuration] = useState(45);

  // Auto-Start Exercise after Rest (Hands-Free Mode)
  const [autoStartNextExercise, setAutoStartNextExercise] = useState(
    userProfile.autoStartNextExercise !== false
  );

  // Completion summary states
  const [rating, setRating] = useState(5);
  const [notes, setNotes] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  // Live session timer interval
  useEffect(() => {
    if (!isOpen) return;
    let timer: NodeJS.Timeout;
    if (isTimerRunning && currentPhase !== 'summary') {
      timer = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isOpen, isTimerRunning, currentPhase]);

  // Voice announcement helper
  const announceVoice = (text: string) => {
    try {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.1;
        utterance.pitch = 1.0;
        window.speechSynthesis.speak(utterance);
      }
    } catch {
      // ignore
    }
  };

  // Rest timer countdown with automated exercise start
  useEffect(() => {
    if (restSecondsRemaining === null || restSecondsRemaining <= 0) return;

    const interval = setInterval(() => {
      setRestSecondsRemaining((prev) => {
        if (prev === null) return null;

        // 3-2-1 Audio Countdown
        if (prev <= 4 && prev > 1) {
          soundService.playCountdownBeep(prev === 2);
        }

        // Rest completed! Time to automatically start next exercise
        if (prev <= 1) {
          soundService.playRestFinished();

          if (autoStartNextExercise) {
            handleAutoStartNextStep();
          }
          return null;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [restSecondsRemaining, autoStartNextExercise, currentExerciseIndex, exerciseState, currentLap]);

  // Automatically start next exercise or lap when rest time expires
  const handleAutoStartNextStep = () => {
    const currentEx = exerciseState[currentExerciseIndex];
    if (!currentEx) return;

    // Check if current exercise still has uncompleted sets
    const hasMoreSetsInExercise = currentEx.sets.some((s) => !s.completed);

    if (hasMoreSetsInExercise) {
      // Announce next set
      announceVoice(`Rest finished! Starting next set now.`);
    } else if (currentExerciseIndex < exerciseState.length - 1) {
      // Advance to next exercise in the lap
      const nextIndex = currentExerciseIndex + 1;
      setCurrentExerciseIndex(nextIndex);
      const nextExName = exerciseState[nextIndex].name;
      announceVoice(`Rest finished! Starting ${nextExName} now.`);
    } else {
      // Completed all exercises in the current lap!
      if (currentLap < totalLaps) {
        setCurrentLap((prev) => prev + 1);
        setCurrentExerciseIndex(0);
        // Reset sets for next lap
        setExerciseState((prev) =>
          prev.map((ex) => ({
            ...ex,
            sets: ex.sets.map((s) => ({ ...s, completed: false })),
          }))
        );
        announceVoice(`Lap ${currentLap} completed! Starting Lap ${currentLap + 1} now.`);
      } else {
        // Workout complete!
        setCurrentPhase('cooldown');
        announceVoice(`All laps crushed! Proceeding to cool-down.`);
      }
    }
  };

  // Sync exercises on open
  useEffect(() => {
    if (isOpen) {
      setExerciseState(
        plan.exercises.map((ex) => ({
          ...ex,
          sets: ex.sets.map((s) => ({ ...s, completed: false })),
        }))
      );
      setWarmupChecks(plan.warmup.map(() => false));
      setCooldownChecks(plan.cooldown.map(() => false));
      setElapsedSeconds(0);
      setIsTimerRunning(true);
      setCurrentPhase('warmup');
      setCurrentExerciseIndex(0);
      setCurrentLap(1);
      setRestSecondsRemaining(null);
      setIsSaved(false);
    }
  }, [isOpen, plan]);

  if (!isOpen) return null;

  // Real-time calorie computation: MET ~ 7.0 for circuit training with 30-45s rest
  const weightKg = userProfile.weightKg || 70;
  const elapsedMinutes = elapsedSeconds / 60;
  const estimatedCaloriesBurned = Math.round((7.0 * 3.5 * weightKg * elapsedMinutes) / 200);

  // Total volume lifted
  const totalVolumeKg = exerciseState.reduce((acc, ex) => {
    const exerciseVol = ex.sets.reduce((sAcc, s) => {
      return sAcc + (s.completed ? s.reps * s.weightKg : 0);
    }, 0);
    return acc + exerciseVol;
  }, 0);

  const completedSetsCount = exerciseState.reduce((acc, ex) => {
    return acc + ex.sets.filter((s) => s.completed).length;
  }, 0);

  const totalSetsCount = exerciseState.reduce((acc, ex) => acc + ex.sets.length, 0);

  const currentExercise = exerciseState[currentExerciseIndex];
  const libraryItem = EXERCISE_LIBRARY.find((e) => e.id === currentExercise?.exerciseId);
  const nextExercise = exerciseState[currentExerciseIndex + 1];

  // Toggle set completion and trigger 30s to 45s rest timer
  const handleToggleSet = (setIdx: number) => {
    const currentEx = exerciseState[currentExerciseIndex];
    if (!currentEx) return;

    const targetSet = currentEx.sets[setIdx];
    const willComplete = !targetSet.completed;

    const updatedExercises = [...exerciseState];
    updatedExercises[currentExerciseIndex].sets[setIdx].completed = willComplete;
    setExerciseState(updatedExercises);

    if (willComplete) {
      soundService.playSetCompleted();
      // Start 30 to 45 seconds rest timer!
      const restTime = selectedRestOption;
      setRestTotalDuration(restTime);
      setRestSecondsRemaining(restTime);
    }
  };

  // Update reps or weight
  const handleUpdateSet = (setIdx: number, field: 'reps' | 'weightKg', value: number) => {
    const updated = [...exerciseState];
    updated[currentExerciseIndex].sets[setIdx][field] = Math.max(0, value);
    setExerciseState(updated);
  };

  // Skip Rest and Immediately Start Next Exercise
  const handleSkipRestAndStart = () => {
    setRestSecondsRemaining(null);
    soundService.playCountdownBeep(true);
    handleAutoStartNextStep();
  };

  // Finish Workout
  const handleCompleteWorkout = () => {
    setCurrentPhase('summary');
    soundService.playWorkoutFinished();
    try {
      confetti({
        particleCount: 140,
        spread: 90,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore
    }
  };

  // Save Workout Log
  const handleSaveAndExit = () => {
    if (isSaved) {
      onClose();
      return;
    }

    const log: CompletedWorkoutLog = {
      id: 'log-' + Date.now(),
      workoutPlanId: plan.id,
      title: `${plan.title} (${currentLap} Laps)`,
      completedAt: new Date().toISOString(),
      durationSeconds: Math.max(elapsedSeconds, 60),
      caloriesBurned: Math.max(estimatedCaloriesBurned, 30),
      totalVolumeKg,
      exercisesCompleted: exerciseState.filter((e) => e.sets.some((s) => s.completed)).length,
      totalSetsCompleted: completedSetsCount,
      userRating: rating,
      feedback: notes.trim() || undefined,
    };

    StorageService.addWorkoutLog(log);
    onWorkoutCompleted(log);
    setIsSaved(true);
    onClose();
  };

  // Format seconds mm:ss
  const formatTime = (totalSec: number) => {
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/95 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl h-[96vh] sm:h-[92vh] bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl text-slate-100 flex flex-col overflow-hidden">
        {/* Top Header Bar */}
        <div className="px-4 py-3.5 border-b border-slate-800 bg-slate-900/95 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (confirm('Are you sure you want to exit the current workout?')) {
                  onClose();
                }
              }}
              className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
              title="Exit Workout"
            >
              <X className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-extrabold text-white truncate max-w-[170px] sm:max-w-xs">
                  {plan.title}
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  Lap {currentLap}/{totalLaps}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5 font-mono">
                <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                  <Clock className="w-3.5 h-3.5" />
                  {formatTime(elapsedSeconds)}
                </span>
                <span className="flex items-center gap-1 text-amber-400">
                  <Flame className="w-3.5 h-3.5" />
                  ~{estimatedCaloriesBurned} kcal
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
              title={isTimerRunning ? 'Pause Session' : 'Resume Session'}
            >
              {isTimerRunning ? <Pause className="w-4 h-4 text-amber-400" /> : <Play className="w-4 h-4 text-emerald-400" />}
            </button>
            <button
              onClick={handleCompleteWorkout}
              className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition shadow-md shadow-emerald-500/20 active:scale-95"
            >
              Finish
            </button>
          </div>
        </div>

        {/* Phase Navigation Tabs */}
        {currentPhase !== 'summary' && (
          <div className="grid grid-cols-3 border-b border-slate-800 bg-slate-950/40 text-xs text-center font-medium">
            <button
              onClick={() => setCurrentPhase('warmup')}
              className={`py-2.5 transition border-b-2 flex items-center justify-center gap-1.5 ${
                currentPhase === 'warmup'
                  ? 'border-emerald-500 text-emerald-400 font-bold bg-emerald-500/5'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>1. Warm-Up</span>
              <span className="text-[10px] bg-slate-800 px-1.5 py-0.2 rounded-full">
                {warmupChecks.filter(Boolean).length}/{plan.warmup.length}
              </span>
            </button>

            <button
              onClick={() => setCurrentPhase('workout')}
              className={`py-2.5 transition border-b-2 flex items-center justify-center gap-1.5 ${
                currentPhase === 'workout'
                  ? 'border-emerald-500 text-emerald-400 font-bold bg-emerald-500/5'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>2. Lap Workout</span>
              <span className="text-[10px] bg-slate-800 px-1.5 py-0.2 rounded-full">
                {completedSetsCount}/{totalSetsCount}
              </span>
            </button>

            <button
              onClick={() => setCurrentPhase('cooldown')}
              className={`py-2.5 transition border-b-2 flex items-center justify-center gap-1.5 ${
                currentPhase === 'cooldown'
                  ? 'border-emerald-500 text-emerald-400 font-bold bg-emerald-500/5'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>3. Cool-Down</span>
              <span className="text-[10px] bg-slate-800 px-1.5 py-0.2 rounded-full">
                {cooldownChecks.filter(Boolean).length}/{plan.cooldown.length}
              </span>
            </button>
          </div>
        )}

        {/* Lap Rest Timing & Auto-Start Configuration Bar */}
        {currentPhase === 'workout' && (
          <div className="px-4 py-2 bg-slate-950/80 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 text-[11px] font-semibold flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                Lap Rest:
              </span>
              <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700">
                <button
                  onClick={() => setSelectedRestOption(30)}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold transition ${
                    selectedRestOption === 30
                      ? 'bg-emerald-500 text-slate-950 shadow-sm'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  30s Sprint
                </button>
                <button
                  onClick={() => setSelectedRestOption(45)}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold transition ${
                    selectedRestOption === 45
                      ? 'bg-emerald-500 text-slate-950 shadow-sm'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  45s Circuit
                </button>
                <button
                  onClick={() => setSelectedRestOption(60)}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold transition ${
                    selectedRestOption === 60
                      ? 'bg-emerald-500 text-slate-950 shadow-sm'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  60s Heavy
                </button>
              </div>
            </div>

            <label className="flex items-center gap-1.5 cursor-pointer text-slate-300 text-[11px]">
              <input
                type="checkbox"
                checked={autoStartNextExercise}
                onChange={(e) => setAutoStartNextExercise(e.target.checked)}
                className="w-3.5 h-3.5 text-emerald-500 rounded bg-slate-900 border-slate-700 focus:ring-0"
              />
              <span className="font-semibold text-emerald-400">⚡ Auto-Start Next Exercise</span>
            </label>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {/* PHASE 1: WARM-UP */}
          {currentPhase === 'warmup' && (
            <div className="space-y-4 max-w-xl mx-auto">
              <div className="bg-slate-800/40 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-white text-base">Dynamic Warm-Up</h3>
                  <p className="text-xs text-slate-400">
                    Prime joints and elevate heart rate before intense compound sets.
                  </p>
                </div>
                <div className="text-xs font-mono text-emerald-400 bg-emerald-950/40 px-2.5 py-1 rounded-xl border border-emerald-800/40">
                  ~3 Mins
                </div>
              </div>

              <div className="space-y-3">
                {plan.warmup.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      const next = [...warmupChecks];
                      next[idx] = !next[idx];
                      setWarmupChecks(next);
                      if (next[idx]) soundService.playCountdownBeep(true);
                    }}
                    className={`p-4 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
                      warmupChecks[idx]
                        ? 'bg-emerald-950/20 border-emerald-600/50 text-slate-200'
                        : 'bg-slate-800/60 border-slate-700/80 hover:border-slate-600 text-slate-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border mt-0.5 ${
                          warmupChecks[idx]
                            ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                            : 'border-slate-600 bg-slate-800 text-transparent'
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4 fill-current" />
                      </div>
                      <div>
                        <div className="font-semibold text-sm text-white flex items-center gap-2">
                          {item.name}
                          <span className="text-[11px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                            {item.duration}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">{item.instructions}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  onClick={() => setCurrentPhase('workout')}
                  className="w-full sm:w-auto px-7 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-2xl transition flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/20 cursor-pointer"
                >
                  Start Lap 1 Workout
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* PHASE 2: MAIN WORKOUT TRACKING */}
          {currentPhase === 'workout' && currentExercise && (
            <div className="space-y-4 max-w-2xl mx-auto">
              {/* Exercise Selector Carousel with Lap indicator */}
              <div className="flex items-center justify-between bg-slate-800/40 p-3 rounded-2xl border border-slate-800">
                <button
                  disabled={currentExerciseIndex === 0}
                  onClick={() => {
                    setCurrentExerciseIndex((prev) => Math.max(0, prev - 1));
                    setRestSecondsRemaining(null);
                  }}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <div className="text-center">
                  <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center justify-center gap-2">
                    <span>Lap {currentLap} of {totalLaps}</span>
                    <span>•</span>
                    <span>Exercise {currentExerciseIndex + 1}/{exerciseState.length}</span>
                  </div>
                  <div className="font-extrabold text-white text-base sm:text-lg truncate max-w-[200px] sm:max-w-md">
                    {currentExercise.name}
                  </div>
                </div>

                <button
                  disabled={currentExerciseIndex === exerciseState.length - 1}
                  onClick={() => {
                    setCurrentExerciseIndex((prev) => Math.min(exerciseState.length - 1, prev + 1));
                    setRestSecondsRemaining(null);
                  }}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Anatomy Demo & Form Cue */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                <ExerciseIllustration
                  demoType={libraryItem?.demoType || 'upper'}
                  targetMuscle={currentExercise.targetMuscle}
                  className="w-full h-48"
                  isAnimated={isTimerRunning}
                  exerciseName={currentExercise.name}
                />
                <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-800 space-y-2 h-48 flex flex-col justify-center">
                  <div className="flex items-center gap-1.5 text-xs text-amber-400 font-bold uppercase tracking-wider">
                    <Info className="w-4 h-4" />
                    Biomechanical Cue
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed font-medium">
                    "{currentExercise.formCues || libraryItem?.formTips[0] || 'Keep core braced and movements strict.'}"
                  </p>
                  <div className="text-[11px] text-slate-400 flex items-center gap-2 pt-1 font-mono">
                    <span>Equip: <strong className="text-slate-200 font-sans">{currentExercise.equipment}</strong></span>
                    <span>•</span>
                    <span>Rest: <strong className="text-emerald-400">{selectedRestOption}s</strong></span>
                  </div>
                </div>
              </div>

              {/* Set Tracker Table */}
              <div className="bg-slate-800/50 rounded-2xl border border-slate-800 overflow-hidden">
                <div className="grid grid-cols-12 px-4 py-2.5 bg-slate-900 text-xs font-semibold text-slate-400 border-b border-slate-800">
                  <div className="col-span-2 text-center">Set</div>
                  <div className="col-span-4 text-center">Weight ({userProfile.unitSystem === 'imperial' ? 'lbs' : 'kg'})</div>
                  <div className="col-span-4 text-center">Reps</div>
                  <div className="col-span-2 text-center">Done</div>
                </div>

                <div className="divide-y divide-slate-800/80">
                  {currentExercise.sets.map((s, sIdx) => (
                    <div
                      key={sIdx}
                      className={`grid grid-cols-12 px-4 py-3 items-center text-sm transition ${
                        s.completed ? 'bg-emerald-950/20 text-slate-200' : 'hover:bg-slate-800/30'
                      }`}
                    >
                      <div className="col-span-2 text-center font-bold text-slate-400 font-mono">
                        #{s.setNumber}
                      </div>

                      <div className="col-span-4 flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleUpdateSet(sIdx, 'weightKg', s.weightKg - (s.weightKg > 10 ? 2 : 1))}
                          className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          value={s.weightKg}
                          onChange={(e) => handleUpdateSet(sIdx, 'weightKg', parseFloat(e.target.value) || 0)}
                          className="w-14 text-center bg-slate-900 border border-slate-700 rounded py-1 text-sm font-semibold text-white focus:outline-none focus:border-emerald-500 font-mono"
                        />
                        <button
                          onClick={() => handleUpdateSet(sIdx, 'weightKg', s.weightKg + (s.weightKg >= 10 ? 2 : 1))}
                          className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
                        >
                          +
                        </button>
                      </div>

                      <div className="col-span-4 flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleUpdateSet(sIdx, 'reps', s.reps - 1)}
                          className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          value={s.reps}
                          onChange={(e) => handleUpdateSet(sIdx, 'reps', parseInt(e.target.value) || 0)}
                          className="w-12 text-center bg-slate-900 border border-slate-700 rounded py-1 text-sm font-semibold text-white focus:outline-none focus:border-emerald-500 font-mono"
                        />
                        <button
                          onClick={() => handleUpdateSet(sIdx, 'reps', s.reps + 1)}
                          className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
                        >
                          +
                        </button>
                      </div>

                      <div className="col-span-2 flex justify-center">
                        <button
                          onClick={() => handleToggleSet(sIdx)}
                          className={`w-8 h-8 rounded-xl flex items-center justify-center transition cursor-pointer ${
                            s.completed
                              ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30'
                              : 'bg-slate-800 border border-slate-700 text-slate-500 hover:border-slate-500'
                          }`}
                        >
                          <CheckCircle2 className="w-5 h-5 fill-current" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Quick Controls */}
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => {
                    const updated = [...exerciseState];
                    const sets = updated[currentExerciseIndex].sets;
                    const lastSet = sets[sets.length - 1] || { reps: 10, weightKg: 0 };
                    sets.push({
                      setNumber: sets.length + 1,
                      reps: lastSet.reps,
                      weightKg: lastSet.weightKg,
                      completed: false,
                    });
                    setExerciseState(updated);
                  }}
                  className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1 cursor-pointer"
                >
                  + Add Extra Set
                </button>

                {currentExerciseIndex < exerciseState.length - 1 ? (
                  <button
                    onClick={() => {
                      setCurrentExerciseIndex((prev) => prev + 1);
                      setRestSecondsRemaining(null);
                    }}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition flex items-center gap-1 cursor-pointer"
                  >
                    Next Exercise
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : currentLap < totalLaps ? (
                  <button
                    onClick={() => {
                      setCurrentLap((prev) => prev + 1);
                      setCurrentExerciseIndex(0);
                      setExerciseState((prev) =>
                        prev.map((ex) => ({
                          ...ex,
                          sets: ex.sets.map((s) => ({ ...s, completed: false })),
                        }))
                      );
                      setRestSecondsRemaining(null);
                    }}
                    className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 text-xs font-extrabold rounded-xl transition flex items-center gap-1 cursor-pointer shadow-lg shadow-emerald-500/20"
                  >
                    <Repeat className="w-4 h-4" />
                    Start Lap {currentLap + 1}
                  </button>
                ) : (
                  <button
                    onClick={() => setCurrentPhase('cooldown')}
                    className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-xl transition flex items-center gap-1 cursor-pointer"
                  >
                    Proceed to Cool-Down
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* PHASE 3: COOL-DOWN */}
          {currentPhase === 'cooldown' && (
            <div className="space-y-4 max-w-xl mx-auto">
              <div className="bg-slate-800/40 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-white text-base">Cool-Down & Recovery</h3>
                  <p className="text-xs text-slate-400">
                    Lower heart rate, stretch trained muscle fibers, and promote blood flow.
                  </p>
                </div>
                <div className="text-xs font-mono text-cyan-400 bg-cyan-950/40 px-2.5 py-1 rounded-xl border border-cyan-800/40">
                  ~2 Mins
                </div>
              </div>

              <div className="space-y-3">
                {plan.cooldown.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      const next = [...cooldownChecks];
                      next[idx] = !next[idx];
                      setCooldownChecks(next);
                      if (next[idx]) soundService.playCountdownBeep(true);
                    }}
                    className={`p-4 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
                      cooldownChecks[idx]
                        ? 'bg-cyan-950/20 border-cyan-600/50 text-slate-200'
                        : 'bg-slate-800/60 border-slate-700/80 hover:border-slate-600 text-slate-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border mt-0.5 ${
                          cooldownChecks[idx]
                            ? 'bg-cyan-500 border-cyan-400 text-slate-950'
                            : 'border-slate-600 bg-slate-800 text-transparent'
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4 fill-current" />
                      </div>
                      <div>
                        <div className="font-semibold text-sm text-white flex items-center gap-2">
                          {item.name}
                          <span className="text-[11px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                            {item.duration}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">{item.instructions}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  onClick={handleCompleteWorkout}
                  className="w-full sm:w-auto px-7 py-3 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black rounded-2xl transition shadow-xl shadow-emerald-500/25 active:scale-95 cursor-pointer"
                >
                  🎉 Complete & Save Workout
                </button>
              </div>
            </div>
          )}

          {/* PHASE 4: SUMMARY & CELEBRATION */}
          {currentPhase === 'summary' && (
            <div className="space-y-5 max-w-lg mx-auto py-2">
              <div className="text-center space-y-1">
                <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-center mx-auto text-emerald-400 shadow-lg shadow-emerald-500/10">
                  <Award className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black text-white tracking-tight">All Laps Crushed!</h3>
                <p className="text-xs text-slate-400">
                  Outstanding performance! {currentLap} complete laps recorded with high rest density.
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700/80 text-center">
                  <Clock className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                  <div className="text-lg font-bold text-white font-mono">{formatTime(elapsedSeconds)}</div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider">Duration</div>
                </div>
                <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700/80 text-center">
                  <Flame className="w-4 h-4 text-amber-400 mx-auto mb-1" />
                  <div className="text-lg font-bold text-white font-mono">~{estimatedCaloriesBurned}</div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider">Calories</div>
                </div>
                <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700/80 text-center">
                  <Dumbbell className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
                  <div className="text-lg font-bold text-white font-mono">{totalVolumeKg} kg</div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider">Volume</div>
                </div>
                <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700/80 text-center">
                  <CheckCircle2 className="w-4 h-4 text-purple-400 mx-auto mb-1" />
                  <div className="text-lg font-bold text-white font-mono">{completedSetsCount}</div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider">Sets Done</div>
                </div>
              </div>

              {/* Workout Rating */}
              <div className="bg-slate-800/40 p-3.5 rounded-2xl border border-slate-800 text-center space-y-2">
                <span className="text-xs text-slate-300 font-semibold">Rate session intensity & focus</span>
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className="p-1 hover:scale-110 transition cursor-pointer"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-600'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Session Notes */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                  Session Notes (Optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Mastered 30-45s lap rest times, intensity was through the roof!"
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-2xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 resize-none h-20"
                />
              </div>

              <button
                onClick={handleSaveAndExit}
                className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm rounded-2xl transition shadow-xl shadow-emerald-500/20 active:scale-95 cursor-pointer"
              >
                Save to Workout History
              </button>
            </div>
          )}
        </div>

        {/* 30 TO 45 SECONDS REST TIMER DRAWER WITH AUTO-START BANNER */}
        {restSecondsRemaining !== null && currentPhase === 'workout' && (
          <div className="px-4 py-3.5 bg-slate-950 border-t border-emerald-500/30 flex items-center justify-between animate-slideUp">
            <div className="flex items-center gap-3.5">
              <div className="relative w-12 h-12 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-800"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-emerald-400 transition-all duration-1000 ease-linear"
                    strokeDasharray={`${(restSecondsRemaining / restTotalDuration) * 100}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <span className="absolute font-mono font-black text-sm text-white">
                  {restSecondsRemaining}s
                </span>
              </div>
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>Lap Rest Time: {restTotalDuration}s</span>
                  {autoStartNextExercise && (
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.2 rounded font-mono">
                      Auto-Starting Next
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-slate-400">
                  {nextExercise ? (
                    <span>Next: <strong className="text-slate-200">{nextExercise.name}</strong></span>
                  ) : (
                    <span>Next: <strong className="text-slate-200">{currentExercise.name} Next Set</strong></span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setRestSecondsRemaining((prev) => (prev ? prev + 15 : 15))}
                className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition cursor-pointer"
              >
                +15s
              </button>
              <button
                onClick={handleSkipRestAndStart}
                className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold rounded-xl transition shadow-md shadow-emerald-500/20 active:scale-95 cursor-pointer"
              >
                Start Exercise Now
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
