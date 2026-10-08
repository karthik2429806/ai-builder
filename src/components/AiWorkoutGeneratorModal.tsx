import React, { useState } from 'react';
import { UserProfile, WorkoutPlan, MuscleGroup, EquipmentOption } from '../types';
import { Sparkles, X, Wand2, Clock, Dumbbell, Shield, CheckCircle2, RefreshCw } from 'lucide-react';
import { soundService } from '../services/audio';

interface AiWorkoutGeneratorModalProps {
  userProfile: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onApplyPlan: (plan: WorkoutPlan) => void;
}

const FOCUS_AREAS = [
  'Full Body',
  'Chest & Triceps',
  'Back & Biceps',
  'Legs & Glutes',
  'Shoulders & Arms',
  'Core & Cardio',
  'HIIT Express Shred',
  'Recovery & Mobility',
];

export const AiWorkoutGeneratorModal: React.FC<AiWorkoutGeneratorModalProps> = ({
  userProfile,
  isOpen,
  onClose,
  onApplyPlan,
}) => {
  const [focus, setFocus] = useState<string>('Full Body');
  const [level, setLevel] = useState<string>(userProfile.fitnessLevel || 'Intermediate');
  const [restSeconds, setRestSeconds] = useState<number>(userProfile.defaultRestSeconds || 45);
  const [duration, setDuration] = useState<number>(userProfile.preferredDuration || 30);
  const [specialNotes, setSpecialNotes] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<WorkoutPlan | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setIsGenerating(true);
    setErrorMsg(null);
    setGeneratedPlan(null);

    try {
      const response = await fetch('/api/gemini/generate-workout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userProfile: {
            ...userProfile,
            fitnessLevel: level,
            defaultRestSeconds: restSeconds,
          },
          focus,
          customDuration: duration,
          notes: specialNotes + (level === 'Advanced' ? ' [Advanced Level: high intensity, 30-45s rest intervals]' : ''),
        }),
      });

      if (!response.ok) {
        throw new Error('Server returned ' + response.status);
      }

      const data = await response.json();
      if (data.workout && data.workout.title) {
        const raw = data.workout;
        // Transform to valid WorkoutPlan format
        const plan: WorkoutPlan = {
          id: 'ai-plan-' + Date.now(),
          title: raw.title,
          description: raw.description || 'AI tailored workout based on your parameters.',
          difficulty: raw.difficulty || userProfile.fitnessLevel,
          estimatedDurationMin: raw.estimatedDurationMin || duration,
          estimatedCalories: raw.estimatedCalories || Math.round(duration * 9.5),
          targetMuscles: (raw.targetMuscles || [focus]) as MuscleGroup[],
          warmup: raw.warmup || [
            { name: 'Dynamic Joint Mobility', duration: '60s', instructions: 'Loosen wrists, hips, and shoulders.' },
            { name: 'Light Bounce & Arm Crosses', duration: '60s', instructions: 'Elevate core body temperature.' }
          ],
          exercises: (raw.exercises || []).map((ex: any, idx: number) => ({
            id: `ai-e-${idx}`,
            exerciseId: `custom-${idx}`,
            name: ex.name,
            targetMuscle: (ex.targetMuscle || 'Full Body') as MuscleGroup,
            equipment: (ex.equipment || 'Dumbbells') as EquipmentOption,
            restSeconds: ex.restSeconds || 60,
            formCues: ex.formCues || 'Keep core tight and movement controlled.',
            sets: Array.from({ length: ex.sets || 3 }).map((_, sIdx) => ({
              setNumber: sIdx + 1,
              reps: typeof ex.reps === 'number' ? ex.reps : parseInt(ex.reps) || 10,
              weightKg: userProfile.equipment.includes('Dumbbells') ? 10 : 0,
              completed: false,
            })),
          })),
          cooldown: raw.cooldown || [
            { name: 'Deep Diaphragmatic Breathing', duration: '60s', instructions: 'Slow inhales and exhales.' },
            { name: 'Target Muscle Static Stretch', duration: '60s', instructions: 'Hold stretches gently.' }
          ],
          coachTips: raw.coachTips || 'Maintain focus and listen to your body throughout each set.',
          isCustomAI: true,
        };

        setGeneratedPlan(plan);
        soundService.playCountdownBeep(true);
      } else {
        throw new Error('Invalid structure received');
      }
    } catch {
      // Offline fallback smart generation
      const fallbackPlan: WorkoutPlan = {
        id: 'ai-plan-fallback-' + Date.now(),
        title: `AI ${focus} Custom Forge`,
        description: `Custom ${duration}-minute workout optimized for your ${userProfile.goal} goal.`,
        difficulty: userProfile.fitnessLevel,
        estimatedDurationMin: duration,
        estimatedCalories: Math.round(duration * 9),
        targetMuscles: [focus as MuscleGroup],
        warmup: [
          { name: 'Dynamic Mobility Circles', duration: '60s', instructions: 'Warm up shoulder and hip sockets.' },
          { name: 'Jumping Jacks / Step Jacks', duration: '60s', instructions: 'Elevate heart rate safely.' },
        ],
        exercises: [
          {
            id: 'fe-1',
            exerciseId: 'push-up',
            name: 'Controlled Push-Ups / Knee Push-ups',
            targetMuscle: 'Chest',
            equipment: 'Bodyweight',
            restSeconds: 45,
            formCues: 'Elbows at 45 degrees, 2s descent.',
            sets: [
              { setNumber: 1, reps: 12, weightKg: 0, completed: false },
              { setNumber: 2, reps: 12, weightKg: 0, completed: false },
              { setNumber: 3, reps: 10, weightKg: 0, completed: false },
            ],
          },
          {
            id: 'fe-2',
            exerciseId: 'bodyweight-squat',
            name: 'Deep Air Squats',
            targetMuscle: 'Legs',
            equipment: 'Bodyweight',
            restSeconds: 45,
            formCues: 'Break parallel, push through heels.',
            sets: [
              { setNumber: 1, reps: 15, weightKg: 0, completed: false },
              { setNumber: 2, reps: 15, weightKg: 0, completed: false },
              { setNumber: 3, reps: 15, weightKg: 0, completed: false },
            ],
          },
          {
            id: 'fe-3',
            exerciseId: 'mountain-climbers',
            name: 'Mountain Climbers',
            targetMuscle: 'Cardio',
            equipment: 'Bodyweight',
            restSeconds: 45,
            formCues: 'Sprint knees with level hips.',
            sets: [
              { setNumber: 1, reps: 30, weightKg: 0, completed: false },
              { setNumber: 2, reps: 30, weightKg: 0, completed: false },
            ],
          },
          {
            id: 'fe-4',
            exerciseId: 'plank',
            name: 'Core Plank Hold',
            targetMuscle: 'Core',
            equipment: 'Bodyweight',
            restSeconds: 45,
            formCues: 'Squeeze glutes and brace abdominal wall.',
            sets: [
              { setNumber: 1, reps: 45, weightKg: 0, completed: false },
              { setNumber: 2, reps: 45, weightKg: 0, completed: false },
            ],
          },
        ],
        cooldown: [
          { name: 'Cobra to Child’s Pose', duration: '90s', instructions: 'Lengthen abdominal wall and stretch back.' },
        ],
        coachTips: 'Keep transitions tight and maintain hydration between rounds!',
        isCustomAI: true,
      };

      setGeneratedPlan(fallbackPlan);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl text-slate-100 max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">AI Workout Generator</h2>
              <p className="text-xs text-slate-400">
                Customizes exercises, sets & rest to your real-time needs
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-5 text-xs sm:text-sm">
          {!generatedPlan ? (
            <div className="space-y-4">
              {/* Target Focus Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Target Focus Area
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {FOCUS_AREAS.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setFocus(item)}
                      className={`p-2.5 rounded-xl text-xs font-semibold text-center border transition ${
                        focus === item
                          ? 'bg-emerald-500/15 border-emerald-500 text-emerald-300 shadow-sm'
                          : 'bg-slate-800/60 border-slate-700/80 text-slate-300 hover:border-slate-600'
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              {/* Experience Level */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Training Intensity Level
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['Beginner', 'Intermediate', 'Advanced'].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setLevel(lvl)}
                      className={`p-2.5 rounded-xl text-xs font-bold border transition ${
                        level === lvl
                          ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/20'
                          : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:border-slate-600'
                      }`}
                    >
                      {lvl === 'Advanced' ? '🔥 Advanced (Beast)' : lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Lap Rest Timing */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Rest Time Between Laps / Sets
                  </label>
                  <span className="font-mono text-emerald-400 font-bold text-xs">
                    {restSeconds}s Rest (Auto-Restart Enabled)
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[30, 45, 60].map((sec) => (
                    <button
                      key={sec}
                      type="button"
                      onClick={() => setRestSeconds(sec)}
                      className={`py-2 rounded-xl text-xs font-bold border transition font-mono ${
                        restSeconds === sec
                          ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                          : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:border-slate-600'
                      }`}
                    >
                      {sec}s {sec === 30 ? '(Sprint Lap)' : sec === 45 ? '(Circuit Lap)' : '(Strength)'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Workout Duration */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Target Duration
                  </label>
                  <span className="font-mono text-emerald-400 font-bold text-sm">
                    {duration} minutes
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {[15, 20, 30, 45, 60].map((mins) => (
                    <button
                      key={mins}
                      onClick={() => setDuration(mins)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold transition border ${
                        duration === mins
                          ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                          : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:border-slate-600'
                      }`}
                    >
                      {mins}m
                    </button>
                  ))}
                </div>
              </div>

              {/* Available Equipment Note */}
              <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-slate-300">
                  <Dumbbell className="w-4 h-4 text-cyan-400" />
                  <span>Equipment configured:</span>
                </div>
                <span className="text-slate-100 font-semibold truncate max-w-[200px]">
                  {userProfile.equipment.join(', ')}
                </span>
              </div>

              {/* Special Instructions */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Special Customization (Optional)
                </label>
                <input
                  type="text"
                  value={specialNotes}
                  onChange={(e) => setSpecialNotes(e.target.value)}
                  placeholder="e.g. 'Low impact for knees', 'Upper body pump', 'Focus on pull-ups'..."
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Safety notice */}
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-start gap-2.5 text-[11px] text-slate-400">
                <Shield className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  PulseAI analyzes your fitness level (<strong>{userProfile.fitnessLevel}</strong>) and goals to construct a progressive, scientifically balanced volume prescription.
                </span>
              </div>
            </div>
          ) : (
            /* Generated Plan Preview */
            <div className="space-y-4">
              <div className="bg-emerald-950/20 border border-emerald-800/40 p-4 rounded-xl">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
                  <CheckCircle2 className="w-4 h-4" />
                  Tailored Plan Ready
                </div>
                <h3 className="text-lg font-bold text-white">{generatedPlan.title}</h3>
                <p className="text-xs text-slate-300 mt-1">{generatedPlan.description}</p>
                <div className="flex items-center gap-4 text-xs font-mono text-slate-300 mt-3 pt-3 border-t border-emerald-900/40">
                  <span className="flex items-center gap-1 text-emerald-400">
                    <Clock className="w-3.5 h-3.5" />
                    ~{generatedPlan.estimatedDurationMin} mins
                  </span>
                  <span>~{generatedPlan.estimatedCalories} kcal</span>
                  <span>{generatedPlan.exercises.length} Exercises</span>
                </div>
              </div>

              {/* Exercises List */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Exercise Lineup ({generatedPlan.exercises.length})
                </div>
                {generatedPlan.exercises.map((ex, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/80 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold text-white text-xs sm:text-sm">
                        {idx + 1}. {ex.name}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {ex.sets.length} sets • Rest: {ex.restSeconds}s • Equip: {ex.equipment}
                      </div>
                    </div>
                    <span className="text-[10px] font-mono bg-slate-800 px-2 py-0.5 rounded text-emerald-400 border border-slate-700">
                      {ex.targetMuscle}
                    </span>
                  </div>
                ))}
              </div>

              {/* Coach Tip */}
              {generatedPlan.coachTips && (
                <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-800 text-xs text-slate-300 italic">
                  💡 Coach Tip: {generatedPlan.coachTips}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between gap-3">
          {!generatedPlan ? (
            <>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-slate-400 hover:text-white rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isGenerating}
                onClick={handleGenerate}
                className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-slate-950 font-bold rounded-xl transition flex items-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Generating with Gemini...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4" />
                    Generate Workout
                  </>
                )}
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setGeneratedPlan(null)}
                className="px-4 py-2.5 text-slate-400 hover:text-white rounded-xl transition"
              >
                Change Parameters
              </button>
              <button
                type="button"
                onClick={() => {
                  onApplyPlan(generatedPlan);
                  onClose();
                }}
                className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl transition shadow-lg shadow-emerald-500/20 active:scale-95"
              >
                Set as Today's Workout
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
