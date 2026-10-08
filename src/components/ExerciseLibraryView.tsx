import React, { useState, useMemo } from 'react';
import { EXERCISE_LIBRARY } from '../data/exercises';
import { Exercise, MuscleGroup, EquipmentOption, FitnessLevel } from '../types';
import { ExerciseIllustration } from './ExerciseIllustration';
import { ExerciseDetailModal } from './ExerciseDetailModal';
import { Search, Filter, BookOpen, ChevronRight, Sparkles } from 'lucide-react';

interface ExerciseLibraryViewProps {
  onStartQuickExercise?: (exercise: Exercise) => void;
}

const MUSCLE_GROUPS: (MuscleGroup | 'All')[] = [
  'All',
  'Chest',
  'Back',
  'Shoulders',
  'Legs',
  'Glutes',
  'Biceps',
  'Triceps',
  'Core',
  'Cardio',
  'Full Body',
];

const EQUIPMENT_FILTERS: (EquipmentOption | 'All')[] = [
  'All',
  'Bodyweight',
  'Dumbbells',
  'Pull-up Bar',
  'Kettlebell',
  'Resistance Bands',
];

export const ExerciseLibraryView: React.FC<ExerciseLibraryViewProps> = ({
  onStartQuickExercise,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState<MuscleGroup | 'All'>('All');
  const [selectedEquipment, setSelectedEquipment] = useState<EquipmentOption | 'All'>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<FitnessLevel | 'All'>('All');
  const [activeModalExercise, setActiveModalExercise] = useState<Exercise | null>(null);

  const filteredExercises = useMemo(() => {
    return EXERCISE_LIBRARY.filter((item) => {
      // Search
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.targetMuscle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.equipment.toLowerCase().includes(searchQuery.toLowerCase());

      // Muscle
      const matchesMuscle =
        selectedMuscle === 'All' ||
        item.targetMuscle === selectedMuscle ||
        item.secondaryMuscles.includes(selectedMuscle as MuscleGroup);

      // Equipment
      const matchesEquipment =
        selectedEquipment === 'All' || item.equipment === selectedEquipment;

      // Difficulty
      const matchesDifficulty =
        selectedDifficulty === 'All' || item.difficulty === selectedDifficulty;

      return matchesSearch && matchesMuscle && matchesEquipment && matchesDifficulty;
    });
  }, [searchQuery, selectedMuscle, selectedEquipment, selectedDifficulty]);

  return (
    <div className="space-y-5">
      {/* Title & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-emerald-400" />
            Exercise Encyclopedia & Form Guide
          </h2>
          <p className="text-xs text-slate-400">
            {EXERCISE_LIBRARY.length} professional exercises with biomechanical cues & animations
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-3">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search exercises by name, muscle (e.g. 'Push-up', 'Chest', 'Dumbbells')..."
            className="w-full bg-slate-800/90 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
          <span className="text-slate-400 font-semibold uppercase text-[10px] shrink-0">Muscle:</span>
          {MUSCLE_GROUPS.map((group) => (
            <button
              key={group}
              onClick={() => setSelectedMuscle(group)}
              className={`shrink-0 px-3 py-1 rounded-lg font-semibold transition ${
                selectedMuscle === group
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              {group}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 text-[11px] font-medium">Equipment:</span>
            <select
              value={selectedEquipment}
              onChange={(e) => setSelectedEquipment(e.target.value as any)}
              className="bg-slate-800 border border-slate-700 text-slate-200 rounded-lg px-2.5 py-1 text-xs focus:outline-none"
            >
              {EQUIPMENT_FILTERS.map((eq) => (
                <option key={eq} value={eq}>{eq}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 text-[11px] font-medium">Difficulty:</span>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value as any)}
              className="bg-slate-800 border border-slate-700 text-slate-200 rounded-lg px-2.5 py-1 text-xs focus:outline-none"
            >
              <option value="All">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          {(selectedMuscle !== 'All' || selectedEquipment !== 'All' || selectedDifficulty !== 'All' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedMuscle('All');
                setSelectedEquipment('All');
                setSelectedDifficulty('All');
                setSearchQuery('');
              }}
              className="text-[11px] text-emerald-400 hover:underline ml-auto"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Exercises Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredExercises.map((exercise) => (
          <div
            key={exercise.id}
            onClick={() => setActiveModalExercise(exercise)}
            className="group bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition cursor-pointer flex flex-col justify-between shadow-sm hover:shadow-lg"
          >
            <div>
              {/* Illustration Thumbnail */}
              <div className="relative">
                <ExerciseIllustration
                  demoType={exercise.demoType}
                  targetMuscle={exercise.targetMuscle}
                  className="w-full h-44 border-b border-slate-800"
                  isAnimated={true}
                  exerciseName={exercise.name}
                />
                <span
                  className={`absolute top-2.5 right-2.5 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    exercise.difficulty === 'Beginner'
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      : exercise.difficulty === 'Intermediate'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  }`}
                >
                  {exercise.difficulty}
                </span>
              </div>

              {/* Info */}
              <div className="p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                    {exercise.targetMuscle}
                  </span>
                  <span className="text-slate-600">•</span>
                  <span className="text-[11px] text-slate-400 truncate">
                    {exercise.equipment}
                  </span>
                </div>

                <h3 className="font-bold text-white text-base group-hover:text-emerald-300 transition">
                  {exercise.name}
                </h3>

                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {exercise.instructions[0]}
                </p>
              </div>
            </div>

            {/* Bottom Action Strip */}
            <div className="p-4 pt-0 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/60 mt-2">
              <span className="text-[11px]">~{exercise.caloriesPerMinute} kcal/min</span>
              <span className="text-emerald-400 font-semibold group-hover:translate-x-1 transition flex items-center gap-0.5">
                View Guide <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {filteredExercises.length === 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
          <BookOpen className="w-10 h-10 text-slate-600 mx-auto mb-2" />
          <p className="font-semibold text-white">No exercises match your filters</p>
          <p className="text-xs mt-1">Try resetting the search terms or equipment selections.</p>
        </div>
      )}

      {/* Modal */}
      <ExerciseDetailModal
        exercise={activeModalExercise}
        onClose={() => setActiveModalExercise(null)}
        onStartAsQuickSet={onStartQuickExercise}
      />
    </div>
  );
};
