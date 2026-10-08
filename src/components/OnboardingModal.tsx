import React, { useState } from 'react';
import { UserProfile, FitnessGoal, FitnessLevel, EquipmentOption } from '../types';
import { Sparkles, ArrowRight, Check, Dumbbell, Shield, HeartPulse } from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  initialProfile: UserProfile;
  onComplete: (profile: UserProfile) => void;
}

const GOAL_OPTIONS: { title: FitnessGoal; desc: string; icon: string }[] = [
  { title: 'Muscle Gain', desc: 'Build lean mass, density & hypertrophy', icon: '💪' },
  { title: 'Weight Loss', desc: 'Burn calories, accelerate fat metabolism', icon: '🔥' },
  { title: 'Strength', desc: 'Increase raw compound lifting power', icon: '🏋️' },
  { title: 'Endurance', desc: 'Boost VO2 max, stamina & cardiovascular health', icon: '🏃' },
  { title: 'General Fitness', desc: 'Feel energized, healthy, mobile & strong', icon: '⚡' },
];

const EQUIPMENT_OPTIONS: EquipmentOption[] = [
  'Bodyweight',
  'Dumbbells',
  'Barbell & Plates',
  'Kettlebell',
  'Resistance Bands',
  'Pull-up Bar',
  'Gym Machines',
  'Cardio Equipment',
];

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  initialProfile,
  onComplete,
}) => {
  const [step, setStep] = useState<number>(1);
  const [profile, setProfile] = useState<UserProfile>(initialProfile);
  const [agreedToDisclaimer, setAgreedToDisclaimer] = useState<boolean>(true);

  if (!isOpen) return null;

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      onComplete(profile);
    }
  };

  const toggleEquipment = (eq: EquipmentOption) => {
    const list = profile.equipment;
    if (list.includes(eq)) {
      if (list.length > 1) {
        setProfile({ ...profile, equipment: list.filter((e) => e !== eq) });
      }
    } else {
      setProfile({ ...profile, equipment: [...list, eq] });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/90 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl text-slate-100 max-h-[92vh] flex flex-col overflow-hidden">
        {/* Top Progress bar */}
        <div className="w-full bg-slate-800 h-1.5">
          <div
            className="bg-emerald-500 h-full transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-5">
          {/* STEP 1: WELCOME & GOALS */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="text-center space-y-1.5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-slate-950 mx-auto shadow-lg shadow-emerald-500/20 font-black">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-black text-white tracking-tight">
                  Welcome to PulseAI
                </h2>
                <p className="text-xs text-slate-400">
                  Your 24/7 AI Personal Trainer & Precision Workout Coach
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Your Name
                </label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  placeholder="Enter your name"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  What is your primary fitness goal?
                </label>
                <div className="space-y-2">
                  {GOAL_OPTIONS.map((item) => (
                    <div
                      key={item.title}
                      onClick={() => setProfile({ ...profile, goal: item.title })}
                      className={`p-3 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                        profile.goal === item.title
                          ? 'bg-emerald-500/15 border-emerald-500 text-white shadow-sm'
                          : 'bg-slate-800/60 border-slate-700/80 text-slate-300 hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{item.icon}</span>
                        <div>
                          <div className="font-bold text-xs sm:text-sm">{item.title}</div>
                          <div className="text-[11px] text-slate-400">{item.desc}</div>
                        </div>
                      </div>
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          profile.goal === item.title ? 'bg-emerald-500 border-emerald-400' : 'border-slate-600'
                        }`}
                      >
                        {profile.goal === item.title && <Check className="w-3 h-3 text-slate-950 font-bold" />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: BIOMETRICS & FITNESS LEVEL */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="text-center space-y-1">
                <h2 className="text-xl font-black text-white">Your Biometrics & Experience</h2>
                <p className="text-xs text-slate-400">
                  Used to calculate calorie expenditure & optimal resistance volume
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Age</label>
                  <input
                    type="number"
                    value={profile.age}
                    onChange={(e) => setProfile({ ...profile, age: parseInt(e.target.value) || 25 })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Gender</label>
                  <select
                    value={profile.gender}
                    onChange={(e) => setProfile({ ...profile, gender: e.target.value as any })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
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
                    value={profile.heightCm}
                    onChange={(e) => setProfile({ ...profile, heightCm: parseInt(e.target.value) || 175 })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={profile.weightKg}
                    onChange={(e) => setProfile({ ...profile, weightKg: parseFloat(e.target.value) || 70 })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Fitness Experience Level
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Beginner', 'Intermediate', 'Advanced'] as FitnessLevel[]).map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setProfile({ ...profile, fitnessLevel: level })}
                      className={`p-3 rounded-xl border text-center font-bold text-xs transition ${
                        profile.fitnessLevel === level
                          ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                          : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Preferred Session Duration
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[15, 30, 45, 60].map((dur) => (
                    <button
                      key={dur}
                      type="button"
                      onClick={() => setProfile({ ...profile, preferredDuration: dur })}
                      className={`py-2 rounded-xl border text-center font-mono font-bold text-xs transition ${
                        profile.preferredDuration === dur
                          ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                          : 'bg-slate-800 border-slate-700 text-slate-300'
                      }`}
                    >
                      {dur} mins
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: EQUIPMENT & HEALTH DISCLAIMER */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="text-center space-y-1">
                <h2 className="text-xl font-black text-white">Equipment & Final Setup</h2>
                <p className="text-xs text-slate-400">
                  Select what tools you have access to for customized workout generation
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Available Equipment
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {EQUIPMENT_OPTIONS.map((eq) => {
                    const isChecked = profile.equipment.includes(eq);
                    return (
                      <button
                        key={eq}
                        type="button"
                        onClick={() => toggleEquipment(eq)}
                        className={`p-2.5 rounded-xl border text-left font-semibold transition flex items-center justify-between ${
                          isChecked
                            ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-300'
                            : 'bg-slate-800/60 border-slate-700 text-slate-400'
                        }`}
                      >
                        <span className="truncate">{eq}</span>
                        <span
                          className={`w-3.5 h-3.5 rounded-full border ${
                            isChecked ? 'bg-emerald-500 border-emerald-400' : 'border-slate-600'
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Safety Disclaimer Checkbox */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2 text-xs text-slate-300">
                <div className="flex items-start gap-2.5">
                  <Shield className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">Medical & Safety Notice</span>
                    PulseAI provides general fitness information and exercise programming. It is not a substitute for professional medical advice. Always stop if you experience pain or dizziness.
                  </div>
                </div>

                <label className="flex items-center gap-2 pt-2 border-t border-slate-800/80 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreedToDisclaimer}
                    onChange={(e) => setAgreedToDisclaimer(e.target.checked)}
                    className="w-4 h-4 text-emerald-500 rounded bg-slate-900 border-slate-700 focus:ring-0"
                  />
                  <span className="text-[11px] text-slate-300">
                    I have read and agree to exercise safely at my own pace
                  </span>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 text-slate-400 hover:text-white text-xs font-semibold rounded-xl transition"
            >
              Back
            </button>
          ) : (
            <button
              onClick={() => onComplete(profile)}
              className="text-xs text-slate-400 hover:text-slate-200"
            >
              Skip with Defaults
            </button>
          )}

          <button
            onClick={handleNext}
            disabled={step === 3 && !agreedToDisclaimer}
            className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 text-slate-950 font-bold text-xs sm:text-sm rounded-xl transition shadow-lg shadow-emerald-500/20 active:scale-95 flex items-center gap-2"
          >
            {step === 3 ? 'Launch PulseAI' : 'Next Step'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
