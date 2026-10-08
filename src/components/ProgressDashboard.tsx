import React, { useState } from 'react';
import {
  UserProfile,
  CompletedWorkoutLog,
  BodyMeasurementLog,
  Achievement,
} from '../types';
import { StorageService } from '../services/storage';
import {
  TrendingUp,
  Award,
  Flame,
  Dumbbell,
  Clock,
  Calendar,
  Scale,
  Plus,
  Zap,
  Droplet,
  CheckCircle2,
  ChevronRight,
  Trophy,
} from 'lucide-react';

interface ProgressDashboardProps {
  userProfile: UserProfile;
  history: CompletedWorkoutLog[];
  measurements: BodyMeasurementLog[];
  achievements: Achievement[];
  onAddMeasurement: (log: BodyMeasurementLog) => void;
  onSelectHistoryItem?: (log: CompletedWorkoutLog) => void;
}

export const ProgressDashboard: React.FC<ProgressDashboardProps> = ({
  userProfile,
  history,
  measurements,
  achievements,
  onAddMeasurement,
  onSelectHistoryItem,
}) => {
  const [activeTab, setActiveTab] = useState<'metrics' | 'measurements' | 'achievements'>('metrics');
  const [showLogModal, setShowLogModal] = useState(false);

  // New measurement form state
  const [newWeight, setNewWeight] = useState(userProfile.weightKg.toString());
  const [newChest, setNewChest] = useState('');
  const [newWaist, setNewWaist] = useState('');
  const [newHips, setNewHips] = useState('');
  const [newArms, setNewArms] = useState('');
  const [newNotes, setNewNotes] = useState('');

  // Aggregated analytics
  const totalWorkouts = history.length;
  const totalDurationMinutes = Math.round(
    history.reduce((acc, h) => acc + h.durationSeconds, 0) / 60
  );
  const totalCaloriesBurned = history.reduce((acc, h) => acc + h.caloriesBurned, 0);
  const totalVolumeKg = history.reduce((acc, h) => acc + h.totalVolumeKg, 0);

  // Weekly breakdown (last 7 days)
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const weeklyWorkoutDays = ['Mon', 'Wed', 'Fri', 'Sat']; // Sample active days

  const handleSaveMeasurement = (e: React.FormEvent) => {
    e.preventDefault();
    const w = parseFloat(newWeight);
    if (!w) return;

    const log: BodyMeasurementLog = {
      id: 'm-' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      weightKg: w,
      chestCm: parseFloat(newChest) || undefined,
      waistCm: parseFloat(newWaist) || undefined,
      hipsCm: parseFloat(newHips) || undefined,
      armsCm: parseFloat(newArms) || undefined,
      notes: newNotes.trim() || undefined,
    };

    onAddMeasurement(log);
    setShowLogModal(false);
  };

  // Recent weight delta
  const latestWeight = measurements.length > 0 ? measurements[measurements.length - 1].weightKg : userProfile.weightKg;
  const initialWeight = measurements.length > 0 ? measurements[0].weightKg : userProfile.weightKg;
  const weightDelta = (latestWeight - initialWeight).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Header and Quick Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-emerald-400" />
            Performance & Body Metrics
          </h2>
          <p className="text-xs text-slate-400">
            Track your body composition, consistency streaks, and total volume
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowLogModal(true)}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs rounded-xl transition flex items-center gap-1.5 shadow-md shadow-emerald-500/20 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Log Weight / Size
          </button>
        </div>
      </div>

      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Workouts</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Dumbbell className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white">{totalWorkouts}</div>
          <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
            <Zap className="w-3 h-3" />
            4 this week
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Time Trained</span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white">{totalDurationMinutes} <span className="text-sm font-normal text-slate-400">min</span></div>
          <div className="text-[11px] text-slate-400 mt-1">
            Avg ~34m / session
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Calories Burned</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white">{totalCaloriesBurned.toLocaleString()}</div>
          <div className="text-[11px] text-amber-400 mt-1">
            Energy expended
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Volume Lifted</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white">{(totalVolumeKg / 1000).toFixed(1)}k <span className="text-sm font-normal text-slate-400">kg</span></div>
          <div className="text-[11px] text-purple-400 mt-1">
            Progressive overload
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('metrics')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'metrics'
              ? 'bg-slate-800 text-white border border-slate-700'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Weekly Consistency & Volume
        </button>
        <button
          onClick={() => setActiveTab('measurements')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'measurements'
              ? 'bg-slate-800 text-white border border-slate-700'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Weight & Body Tape ({measurements.length})
        </button>
        <button
          onClick={() => setActiveTab('achievements')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'achievements'
              ? 'bg-slate-800 text-white border border-slate-700'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Badges & Achievements
        </button>
      </div>

      {/* TAB 1: METRICS & CHARTS */}
      {activeTab === 'metrics' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Consistency Matrix */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-400" />
                  Weekly Workout Adherence
                </h3>
                <p className="text-xs text-slate-400">Target: {userProfile.preferredDays.join(', ')}</p>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Flame className="w-3.5 h-3.5" />
                4-Day Streak Active
              </div>
            </div>

            {/* Days Visual Bar */}
            <div className="grid grid-cols-7 gap-2 pt-2">
              {daysOfWeek.map((day) => {
                const isTarget = userProfile.preferredDays.includes(day);
                const isCompleted = weeklyWorkoutDays.includes(day);
                return (
                  <div
                    key={day}
                    className={`p-3 rounded-xl border text-center transition flex flex-col items-center justify-center gap-1.5 ${
                      isCompleted
                        ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                        : isTarget
                        ? 'bg-slate-800/40 border-slate-700/80 text-slate-300'
                        : 'bg-slate-900/60 border-slate-800/60 text-slate-500'
                    }`}
                  >
                    <span className="text-xs font-bold">{day}</span>
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                        isCompleted
                          ? 'bg-emerald-500 text-slate-950 font-bold'
                          : isTarget
                          ? 'border border-dashed border-slate-500 text-slate-400'
                          : 'text-slate-600'
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : '•'}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Simulated Monthly Activity Heatmap row */}
            <div className="pt-2 border-t border-slate-800">
              <div className="text-xs font-semibold text-slate-400 mb-2">Monthly Consistency Rhythm</div>
              <div className="flex gap-1.5 flex-wrap">
                {Array.from({ length: 28 }).map((_, idx) => {
                  const intensity = [0, 1, 2, 3, 2, 0, 1, 3, 2, 1, 0, 3, 2, 2][idx % 14];
                  const bg =
                    intensity === 3
                      ? 'bg-emerald-400'
                      : intensity === 2
                      ? 'bg-emerald-600'
                      : intensity === 1
                      ? 'bg-emerald-900'
                      : 'bg-slate-800';
                  return (
                    <div
                      key={idx}
                      title={`Day ${idx + 1}`}
                      className={`w-3.5 h-3.5 rounded-sm ${bg} hover:ring-2 hover:ring-white transition`}
                    />
                  );
                })}
              </div>
            </div>
          </div>

          {/* Goal & Calorie Balance */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-1">
                <Scale className="w-4 h-4 text-cyan-400" />
                Goal Focus: {userProfile.goal}
              </h3>
              <p className="text-xs text-slate-400">
                Current Level: <strong className="text-white">{userProfile.fitnessLevel}</strong>
              </p>
            </div>

            {/* Weight Progression Card */}
            <div className="p-3.5 bg-slate-800/60 rounded-xl border border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Starting Weight</span>
                <span className="font-mono text-white">{initialWeight} kg</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Current Weight</span>
                <span className="font-mono text-emerald-400 font-bold">{latestWeight} kg</span>
              </div>
              <div className="flex justify-between items-center text-xs pt-1 border-t border-slate-700/60">
                <span className="text-slate-400">Net Change</span>
                <span className={`font-mono font-bold ${parseFloat(weightDelta) <= 0 ? 'text-emerald-400' : 'text-cyan-400'}`}>
                  {parseFloat(weightDelta) > 0 ? `+${weightDelta}` : weightDelta} kg
                </span>
              </div>
            </div>

            {/* Hydration Widget */}
            <div className="p-3.5 bg-cyan-950/20 border border-cyan-800/40 rounded-xl">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                  <Droplet className="w-3.5 h-3.5 text-cyan-400" />
                  Hydration Target
                </span>
                <span className="text-xs font-mono text-cyan-200">
                  {userProfile.waterDrankTodayGlasses} / {userProfile.waterIntakeGoalGlasses} glasses
                </span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-cyan-400 h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(
                      100,
                      (userProfile.waterDrankTodayGlasses / userProfile.waterIntakeGoalGlasses) * 100
                    )}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MEASUREMENTS TABLE & GRAPH */}
      {activeTab === 'measurements' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">Body Circumferences & Weight Logs</h3>
              <p className="text-xs text-slate-400">Recorded measurements over time</p>
            </div>
            <button
              onClick={() => setShowLogModal(true)}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-lg text-slate-200 transition"
            >
              + Add Entry
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Weight (kg)</th>
                  <th className="py-2.5 px-3">Chest (cm)</th>
                  <th className="py-2.5 px-3">Waist (cm)</th>
                  <th className="py-2.5 px-3">Hips (cm)</th>
                  <th className="py-2.5 px-3">Arms (cm)</th>
                  <th className="py-2.5 px-3">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {measurements.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-800/40 text-slate-200 font-mono">
                    <td className="py-2.5 px-3 text-slate-400 font-sans">{m.date}</td>
                    <td className="py-2.5 px-3 font-bold text-white">{m.weightKg}</td>
                    <td className="py-2.5 px-3">{m.chestCm || '-'}</td>
                    <td className="py-2.5 px-3">{m.waistCm || '-'}</td>
                    <td className="py-2.5 px-3">{m.hipsCm || '-'}</td>
                    <td className="py-2.5 px-3">{m.armsCm || '-'}</td>
                    <td className="py-2.5 px-3 font-sans text-slate-400 truncate max-w-xs">{m.notes || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: ACHIEVEMENTS & TROPHIES */}
      {activeTab === 'achievements' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((a) => {
            const isUnlocked = Boolean(a.unlockedAt);
            const percent = Math.min(100, Math.round((a.currentProgress / a.targetProgress) * 100));

            return (
              <div
                key={a.id}
                className={`p-4 rounded-2xl border transition relative overflow-hidden flex flex-col justify-between ${
                  isUnlocked
                    ? 'bg-slate-900 border-emerald-500/30'
                    : 'bg-slate-900/60 border-slate-800 opacity-70'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        isUnlocked
                          ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                          : 'bg-slate-800 text-slate-500'
                      }`}
                    >
                      <Trophy className="w-5 h-5" />
                    </div>
                    {isUnlocked ? (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        Unlocked
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold text-slate-500">
                        {percent}%
                      </span>
                    )}
                  </div>

                  <h4 className="font-bold text-white text-sm">{a.title}</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-snug">{a.description}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800">
                  <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1">
                    <span>Progress</span>
                    <span>
                      {a.currentProgress} / {a.targetProgress}
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        isUnlocked ? 'bg-emerald-400' : 'bg-slate-600'
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* LOG MEASUREMENT MODAL */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl text-slate-100">
            <h3 className="text-lg font-bold text-white mb-1">Log Body Measurement</h3>
            <p className="text-xs text-slate-400 mb-4">
              Enter your latest weigh-in and tape measurements
            </p>

            <form onSubmit={handleSaveMeasurement} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Weight (kg) *</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={newWeight}
                  onChange={(e) => setNewWeight(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Chest (cm)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={newChest}
                    onChange={(e) => setNewChest(e.target.value)}
                    placeholder="e.g. 101"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Waist (cm)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={newWaist}
                    onChange={(e) => setNewWaist(e.target.value)}
                    placeholder="e.g. 82"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Hips (cm)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={newHips}
                    onChange={(e) => setNewHips(e.target.value)}
                    placeholder="e.g. 97"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Arms / Biceps (cm)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={newArms}
                    onChange={(e) => setNewArms(e.target.value)}
                    placeholder="e.g. 36"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Notes</label>
                <input
                  type="text"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="e.g. Morning weigh-in before breakfast"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl transition"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
