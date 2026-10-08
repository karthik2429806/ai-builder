import React, { useState } from 'react';
import { UserProfile, FitnessGoal, FitnessLevel, EquipmentOption } from '../types';
import { NotificationService } from '../services/notifications';
import {
  User,
  Bell,
  Settings,
  Shield,
  Save,
  CheckCircle2,
  Clock,
  Droplet,
  Dumbbell,
  Calendar,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

interface FitnessProfileSettingsProps {
  userProfile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
  onOpenDisclaimer: () => void;
  onRegenerateSchedule: () => void;
}

const ALL_EQUIPMENT: EquipmentOption[] = [
  'Bodyweight',
  'Dumbbells',
  'Barbell & Plates',
  'Kettlebell',
  'Resistance Bands',
  'Pull-up Bar',
  'Gym Machines',
  'Cardio Equipment',
];

const ALL_GOALS: FitnessGoal[] = [
  'Weight Loss',
  'Muscle Gain',
  'Strength',
  'Endurance',
  'General Fitness',
];

const ALL_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const FitnessProfileSettings: React.FC<FitnessProfileSettingsProps> = ({
  userProfile,
  onUpdateProfile,
  onOpenDisclaimer,
  onRegenerateSchedule,
}) => {
  const [formData, setFormData] = useState<UserProfile>(userProfile);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [notifPermissionState, setNotifPermissionState] = useState<string>(
    typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'default'
  );

  const handleToggleEquipment = (eq: EquipmentOption) => {
    const list = formData.equipment;
    if (list.includes(eq)) {
      if (list.length > 1) {
        setFormData({ ...formData, equipment: list.filter((e) => e !== eq) });
      }
    } else {
      setFormData({ ...formData, equipment: [...list, eq] });
    }
  };

  const handleToggleDay = (day: string) => {
    const list = formData.preferredDays;
    if (list.includes(day)) {
      if (list.length > 1) {
        setFormData({ ...formData, preferredDays: list.filter((d) => d !== day) });
      }
    } else {
      setFormData({ ...formData, preferredDays: [...list, day] });
    }
  };

  const handleRequestPushPermission = async () => {
    const granted = await NotificationService.requestPermission();
    setNotifPermissionState(granted ? 'granted' : 'denied');
    if (granted) {
      NotificationService.triggerTestWorkoutReminder();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Settings className="w-6 h-6 text-emerald-400" />
            Profile & Training Preferences
          </h2>
          <p className="text-xs text-slate-400">
            Customize your biometrics, equipment access, reminders, and workout schedule
          </p>
        </div>

        {savedSuccess && (
          <div className="px-3.5 py-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-semibold flex items-center gap-1.5 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4" />
            Profile settings updated!
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Biometrics & Persona */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-2 text-white font-bold text-sm border-b border-slate-800 pb-2">
            <User className="w-4 h-4 text-emerald-400" />
            User Identity & Biometrics
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Full Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Age</label>
              <input
                type="number"
                min="14"
                max="100"
                required
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 25 })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Gender</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Non-binary">Non-binary</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Height (cm)</label>
              <input
                type="number"
                min="100"
                max="240"
                required
                value={formData.heightCm}
                onChange={(e) => setFormData({ ...formData, heightCm: parseInt(e.target.value) || 170 })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Current Weight (kg)</label>
              <input
                type="number"
                step="0.1"
                min="35"
                max="250"
                required
                value={formData.weightKg}
                onChange={(e) => setFormData({ ...formData, weightKg: parseFloat(e.target.value) || 70 })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Unit Display</label>
              <select
                value={formData.unitSystem}
                onChange={(e) => setFormData({ ...formData, unitSystem: e.target.value as any })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="metric">Metric (kg / cm)</option>
                <option value="imperial">Imperial (lbs / in)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Goals & Fitness Level */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-2 text-white font-bold text-sm border-b border-slate-800 pb-2">
            <Dumbbell className="w-4 h-4 text-cyan-400" />
            Fitness Objectives & Experience Level
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-2">Primary Fitness Goal</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                {ALL_GOALS.map((goal) => (
                  <button
                    key={goal}
                    type="button"
                    onClick={() => setFormData({ ...formData, goal })}
                    className={`py-2.5 px-3 rounded-xl font-semibold border text-center transition ${
                      formData.goal === goal
                        ? 'bg-emerald-500/15 border-emerald-500 text-emerald-300 shadow-sm'
                        : 'bg-slate-800/60 border-slate-700/80 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    {goal}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">Experience / Level</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Beginner', 'Intermediate', 'Advanced'] as FitnessLevel[]).map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setFormData({ ...formData, fitnessLevel: level })}
                      className={`py-2 rounded-xl font-bold border transition ${
                        formData.fitnessLevel === level
                          ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                          : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:border-slate-600'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">
                  Target Session Duration: <strong className="text-emerald-400 font-mono">{formData.preferredDuration} min</strong>
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {[15, 20, 30, 45, 60].map((dur) => (
                    <button
                      key={dur}
                      type="button"
                      onClick={() => setFormData({ ...formData, preferredDuration: dur })}
                      className={`py-2 rounded-xl font-mono font-bold border transition ${
                        formData.preferredDuration === dur
                          ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                          : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:border-slate-600'
                      }`}
                    >
                      {dur}m
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Equipment Multi-select */}
            <div>
              <label className="block text-slate-300 font-semibold mb-2">Available Equipment</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {ALL_EQUIPMENT.map((eq) => {
                  const isChecked = formData.equipment.includes(eq);
                  return (
                    <button
                      key={eq}
                      type="button"
                      onClick={() => handleToggleEquipment(eq)}
                      className={`p-2.5 rounded-xl border text-left font-semibold transition flex items-center justify-between ${
                        isChecked
                          ? 'bg-emerald-950/25 border-emerald-500/50 text-emerald-300'
                          : 'bg-slate-800/50 border-slate-700/80 text-slate-400 hover:border-slate-600'
                      }`}
                    >
                      <span className="truncate">{eq}</span>
                      <span className={`w-3.5 h-3.5 rounded-full border ${isChecked ? 'bg-emerald-500 border-emerald-400' : 'border-slate-600'}`} />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Preferred Days */}
            <div>
              <label className="block text-slate-300 font-semibold mb-2 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                Preferred Workout Days ({formData.preferredDays.length} days/week)
              </label>
              <div className="grid grid-cols-7 gap-2">
                {ALL_DAYS.map((day) => {
                  const isDayActive = formData.preferredDays.includes(day);
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => handleToggleDay(day)}
                      className={`py-2 rounded-xl text-xs font-bold border transition ${
                        isDayActive
                          ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                          : 'bg-slate-800/60 border-slate-700/80 text-slate-400 hover:border-slate-600'
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Rest Interval per Lap / Set */}
            <div className="p-4 bg-slate-800/60 rounded-xl border border-slate-700/80 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-white text-xs block">
                    Rest Duration Between Laps / Sets
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Scientifically calibrated rest time before auto-starting next exercise
                  </span>
                </div>
                <span className="font-mono text-emerald-400 font-bold text-sm">
                  {formData.defaultRestSeconds || 45} seconds
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[30, 45, 60].map((sec) => (
                  <button
                    key={sec}
                    type="button"
                    onClick={() => setFormData({ ...formData, defaultRestSeconds: sec as any })}
                    className={`py-2 px-3 rounded-xl border text-center font-bold text-xs transition ${
                      (formData.defaultRestSeconds || 45) === sec
                        ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                        : 'bg-slate-900/60 border-slate-700 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    {sec}s {sec === 30 ? '(Sprint Lap)' : sec === 45 ? '(Circuit Lap)' : '(Heavy)'}
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-700/60">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-200">
                    Auto-Start Next Exercise After Rest Ends
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono">(Hands-Free)</span>
                </div>
                <input
                  type="checkbox"
                  checked={formData.autoStartNextExercise !== false}
                  onChange={(e) => setFormData({ ...formData, autoStartNextExercise: e.target.checked })}
                  className="w-4 h-4 text-emerald-500 rounded bg-slate-900 border-slate-700 focus:ring-0"
                />
              </div>
            </div>

            {/* Limitations / Injuries */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Medical Considerations & Injuries
              </label>
              <input
                type="text"
                value={formData.injuries}
                onChange={(e) => setFormData({ ...formData, injuries: e.target.value })}
                placeholder="e.g. Mild lower back tightness, recovering from left knee sprain"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Push Notifications & Reminders */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <Bell className="w-4 h-4 text-amber-400" />
              Notifications & Coach Reminders
            </div>
            {notifPermissionState !== 'granted' && (
              <button
                type="button"
                onClick={handleRequestPushPermission}
                className="text-xs px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-lg hover:bg-amber-500/30 transition"
              >
                Enable Browser Push
              </button>
            )}
          </div>

          <div className="space-y-3.5 text-xs">
            <div className="flex items-center justify-between p-3.5 bg-slate-800/60 rounded-xl border border-slate-800">
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-emerald-400" />
                <div>
                  <div className="font-semibold text-white">Daily Workout Reminder</div>
                  <div className="text-[11px] text-slate-400">Notifies you on scheduled workout days</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="time"
                  value={formData.reminderTime}
                  onChange={(e) => setFormData({ ...formData, reminderTime: e.target.value })}
                  className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-white font-mono text-xs focus:outline-none"
                />
                <input
                  type="checkbox"
                  checked={formData.notificationsEnabled}
                  onChange={(e) => setFormData({ ...formData, notificationsEnabled: e.target.checked })}
                  className="w-4 h-4 text-emerald-500 rounded bg-slate-900 border-slate-700 focus:ring-0"
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-3.5 bg-slate-800/60 rounded-xl border border-slate-800">
              <div className="flex items-center gap-2.5">
                <Droplet className="w-4 h-4 text-cyan-400" />
                <div>
                  <div className="font-semibold text-white">Hydration Prompts</div>
                  <div className="text-[11px] text-slate-400">Regular water intake check-ins (8 glasses/day)</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={formData.hydrationReminders}
                onChange={(e) => setFormData({ ...formData, hydrationReminders: e.target.checked })}
                className="w-4 h-4 text-cyan-500 rounded bg-slate-900 border-slate-700 focus:ring-0"
              />
            </div>

            {/* Test buttons */}
            <div className="pt-2 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => NotificationService.triggerTestWorkoutReminder()}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 text-xs font-semibold transition"
              >
                🔔 Test Workout Alert
              </button>
              <button
                type="button"
                onClick={() => NotificationService.triggerHydrationReminder()}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 text-xs font-semibold transition"
              >
                💧 Test Water Alert
              </button>
              <button
                type="button"
                onClick={() => NotificationService.triggerMotivation()}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 text-xs font-semibold transition"
              >
                ⚡ Motivation Quote
              </button>
            </div>
          </div>
        </div>

        {/* Section 4: Safety & Disclaimer Link */}
        <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              PulseAI is an educational fitness assistant. Always consult a physician before rigorous training.
            </span>
          </div>
          <button
            type="button"
            onClick={onOpenDisclaimer}
            className="text-emerald-400 hover:underline font-semibold shrink-0"
          >
            Read Medical Disclaimer
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={() => {
              onRegenerateSchedule();
              setSavedSuccess(true);
            }}
            className="w-full sm:w-auto px-5 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
            Recalibrate AI Weekly Routine
          </button>

          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-sm rounded-xl transition shadow-xl shadow-emerald-500/20 active:scale-95 flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Profile & Preferences
          </button>
        </div>
      </form>
    </div>
  );
};
