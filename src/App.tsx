import React, { useState, useEffect } from 'react';
import {
  UserProfile,
  WorkoutPlan,
  CompletedWorkoutLog,
  BodyMeasurementLog,
  Achievement,
  NotificationItem,
  Exercise,
} from './types';
import { StorageService } from './services/storage';
import { NotificationService } from './services/notifications';
import { soundService } from './services/audio';
import { getRecommendedPlan, PRESET_WORKOUT_PLANS } from './data/defaultPlans';
import { EXERCISE_LIBRARY } from './data/exercises';

// Components
import { HomeDashboard } from './components/HomeDashboard';
import { TodayWorkoutView } from './components/TodayWorkoutView';
import { ExerciseLibraryView } from './components/ExerciseLibraryView';
import { AiCoachChat } from './components/AiCoachChat';
import { ProgressDashboard } from './components/ProgressDashboard';
import { WorkoutHistoryView } from './components/WorkoutHistoryView';
import { FitnessProfileSettings } from './components/FitnessProfileSettings';

// Modals
import { WorkoutPlayerModal } from './components/WorkoutPlayerModal';
import { AiWorkoutGeneratorModal } from './components/AiWorkoutGeneratorModal';
import { ExerciseDetailModal } from './components/ExerciseDetailModal';
import { NotificationCenterModal } from './components/NotificationCenterModal';
import { MedicalDisclaimerModal } from './components/MedicalDisclaimerModal';
import { OnboardingModal } from './components/OnboardingModal';
import { MobileShareAppModal } from './components/MobileShareAppModal';

// Icons
import {
  Activity,
  Flame,
  Dumbbell,
  BookOpen,
  Bot,
  TrendingUp,
  History,
  Settings,
  Bell,
  Play,
  Sparkles,
  ShieldAlert,
  Droplet,
  Menu,
  X,
  Smartphone,
  QrCode,
} from 'lucide-react';

export default function App() {
  // Application State
  const [userProfile, setUserProfile] = useState<UserProfile>(() => StorageService.getProfile());
  const [activePlan, setActivePlan] = useState<WorkoutPlan>(() => StorageService.getActivePlan());
  const [history, setHistory] = useState<CompletedWorkoutLog[]>(() => StorageService.getHistory());
  const [measurements, setMeasurements] = useState<BodyMeasurementLog[]>(() => StorageService.getMeasurements());
  const [achievements, setAchievements] = useState<Achievement[]>(() => StorageService.getAchievements());
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => StorageService.getNotifications());

  // Navigation State
  const [currentTab, setCurrentTab] = useState<'home' | 'today' | 'library' | 'coach' | 'progress' | 'history' | 'settings'>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Modals visibility
  const [isWorkoutPlayerOpen, setIsWorkoutPlayerOpen] = useState(false);
  const [isAiGeneratorOpen, setIsAiGeneratorOpen] = useState(false);
  const [selectedExerciseForModal, setSelectedExerciseForModal] = useState<Exercise | null>(null);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [isDisclaimerModalOpen, setIsDisclaimerModalOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isMobileShareOpen, setIsMobileShareOpen] = useState(false);

  // Sync to storage on profile change
  const handleUpdateProfile = (updated: UserProfile) => {
    setUserProfile(updated);
    StorageService.saveProfile(updated);
  };

  // Water increment
  const handleIncrementWater = () => {
    const updated = {
      ...userProfile,
      waterDrankTodayGlasses: userProfile.waterDrankTodayGlasses + 1,
    };
    handleUpdateProfile(updated);
    soundService.playCountdownBeep(true);
    NotificationService.send(
      '💧 Hydration Logged!',
      `Great job! ${updated.waterDrankTodayGlasses} of ${updated.waterIntakeGoalGlasses} glasses completed today.`,
      'hydration'
    );
    setNotifications(StorageService.getNotifications());
  };

  // Workout completed callback
  const handleWorkoutCompleted = (log: CompletedWorkoutLog) => {
    const updatedHistory = StorageService.getHistory();
    const updatedAchievements = StorageService.getAchievements();
    setHistory(updatedHistory);
    setAchievements(updatedAchievements);

    // Trigger completion notification
    NotificationService.send(
      '🎉 Workout Complete!',
      `Awesome job! You burned ~${log.caloriesBurned} kcal and lifted ${log.totalVolumeKg} kg volume!`,
      'workout'
    );
    setNotifications(StorageService.getNotifications());
  };

  // Apply custom plan
  const handleApplyPlan = (plan: WorkoutPlan) => {
    setActivePlan(plan);
    StorageService.saveActivePlan(plan);
    soundService.playCountdownBeep(true);
    setCurrentTab('today');
  };

  // Add measurement
  const handleAddMeasurement = (log: BodyMeasurementLog) => {
    StorageService.addMeasurement(log);
    setMeasurements(StorageService.getMeasurements());
    if (log.weightKg) {
      handleUpdateProfile({ ...userProfile, weightKg: log.weightKg });
    }
  };

  // Recalibrate weekly schedule
  const handleRegenerateSchedule = () => {
    const plan = getRecommendedPlan(userProfile);
    setActivePlan(plan);
    StorageService.saveActivePlan(plan);
  };

  // Mark notifications read
  const handleMarkAllNotificationsRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    StorageService.saveNotifications(updated);
    setNotifications(updated);
  };

  // Trigger test reminder
  const handleTriggerTestReminder = (type: 'workout' | 'hydration' | 'motivation') => {
    if (type === 'workout') {
      NotificationService.triggerTestWorkoutReminder();
    } else if (type === 'hydration') {
      NotificationService.triggerHydrationReminder();
    } else {
      NotificationService.triggerMotivation();
    }
    setNotifications(StorageService.getNotifications());
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-slate-950 pb-20 md:pb-0">
      {/* TOP NAVIGATION HEADER */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo & Brand */}
          <div
            onClick={() => setCurrentTab('home')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 shadow-lg shadow-emerald-500/25 group-hover:scale-105 transition">
              <Activity className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="text-lg font-black tracking-tight text-white flex items-center gap-1.5">
                <span>Pulse</span>
                <span className="text-emerald-400">AI</span>
              </div>
              <div className="text-[10px] text-slate-400 font-medium tracking-wider -mt-1 hidden sm:block">
                Virtual Personal Trainer
              </div>
            </div>
          </div>

          {/* Desktop Nav Tabs */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-950/60 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
            {[
              { id: 'home', label: 'Dashboard', icon: Activity },
              { id: 'today', label: "Today's Workout", icon: Dumbbell },
              { id: 'library', label: 'Exercises', icon: BookOpen },
              { id: 'coach', label: 'AI Coach', icon: Bot, isAi: true },
              { id: 'progress', label: 'Progress', icon: TrendingUp },
              { id: 'history', label: 'History', icon: History },
              { id: 'settings', label: 'Profile', icon: Settings },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setCurrentTab(tab.id as any)}
                  className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'stroke-[2.5]' : tab.isAi ? 'text-emerald-400' : ''}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile App & Phone QR Access */}
            <button
              onClick={() => setIsMobileShareOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
              title="Open App on Mobile Phone (QR Code & URL)"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Phone App</span>
            </button>

            {/* Quick Start Floating Mini CTA */}
            <button
              onClick={() => setIsWorkoutPlayerOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl font-extrabold text-xs transition shadow-md shadow-emerald-500/20 active:scale-95 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-slate-950" />
              <span>Start</span>
            </button>

            {/* Notification Bell */}
            <button
              onClick={() => setIsNotificationModalOpen(true)}
              className="relative p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 text-slate-950 text-[10px] font-black rounded-full flex items-center justify-center animate-pulse">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            {/* Disclaimer Shield */}
            <button
              onClick={() => setIsDisclaimerModalOpen(true)}
              className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-amber-400 transition cursor-pointer"
              title="Health & Medical Disclaimer"
            >
              <ShieldAlert className="w-4 h-4" />
            </button>

            {/* Mobile Hamburger toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white transition"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu (Header accordion) */}
        {mobileMenuOpen && (
          <div className="lg:hidden px-4 py-3 bg-slate-900 border-b border-slate-800 space-y-1 text-xs">
            <button
              onClick={() => {
                setIsMobileShareOpen(true);
                setMobileMenuOpen(false);
              }}
              className="w-full px-3 py-2.5 rounded-xl text-left font-bold flex items-center gap-2.5 text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 mb-2"
            >
              <Smartphone className="w-4 h-4" />
              <span>📱 Open on Mobile Phone (QR & URL)</span>
            </button>
            {[
              { id: 'home', label: 'Dashboard', icon: Activity },
              { id: 'today', label: "Today's Workout", icon: Dumbbell },
              { id: 'library', label: 'Exercise Library', icon: BookOpen },
              { id: 'coach', label: 'AI Coach Pulse', icon: Bot },
              { id: 'progress', label: 'Progress & Charts', icon: TrendingUp },
              { id: 'history', label: 'Workout History', icon: History },
              { id: 'settings', label: 'Profile & Settings', icon: Settings },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setCurrentTab(tab.id as any);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full px-3 py-2.5 rounded-xl text-left font-semibold flex items-center gap-2.5 transition ${
                    isActive
                      ? 'bg-emerald-500 text-slate-950 font-bold'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </header>

      {/* MAIN VIEWPORT CONTAINER */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {currentTab === 'home' && (
          <HomeDashboard
            userProfile={userProfile}
            activePlan={activePlan}
            history={history}
            onStartWorkout={() => setIsWorkoutPlayerOpen(true)}
            onNavigateTab={(tab) => setCurrentTab(tab as any)}
            onOpenAiGenerator={() => setIsAiGeneratorOpen(true)}
            onIncrementWater={handleIncrementWater}
            onOpenDisclaimer={() => setIsDisclaimerModalOpen(true)}
            onOpenMobileShare={() => setIsMobileShareOpen(true)}
          />
        )}

        {currentTab === 'today' && (
          <TodayWorkoutView
            plan={activePlan}
            userProfile={userProfile}
            onStartWorkout={() => setIsWorkoutPlayerOpen(true)}
            onOpenAiGenerator={() => setIsAiGeneratorOpen(true)}
            onSelectExercise={(ex) => setSelectedExerciseForModal(ex)}
            onOpenDisclaimer={() => setIsDisclaimerModalOpen(true)}
          />
        )}

        {currentTab === 'library' && (
          <ExerciseLibraryView
            onStartQuickExercise={(ex) => {
              setSelectedExerciseForModal(ex);
            }}
          />
        )}

        {currentTab === 'coach' && (
          <div className="h-[78vh] sm:h-[82vh]">
            <AiCoachChat
              userProfile={userProfile}
              onApplyWorkout={handleApplyPlan}
              onOpenDisclaimer={() => setIsDisclaimerModalOpen(true)}
            />
          </div>
        )}

        {currentTab === 'progress' && (
          <ProgressDashboard
            userProfile={userProfile}
            history={history}
            measurements={measurements}
            achievements={achievements}
            onAddMeasurement={handleAddMeasurement}
          />
        )}

        {currentTab === 'history' && (
          <WorkoutHistoryView history={history} />
        )}

        {currentTab === 'settings' && (
          <FitnessProfileSettings
            userProfile={userProfile}
            onUpdateProfile={handleUpdateProfile}
            onOpenDisclaimer={() => setIsDisclaimerModalOpen(true)}
            onRegenerateSchedule={handleRegenerateSchedule}
          />
        )}
      </main>

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 px-2 py-2 flex items-center justify-around text-[10px]">
        {[
          { id: 'home', label: 'Home', icon: Activity },
          { id: 'today', label: 'Workout', icon: Dumbbell },
          { id: 'coach', label: 'Coach', icon: Bot, isAi: true },
          { id: 'library', label: 'Library', icon: BookOpen },
          { id: 'progress', label: 'Progress', icon: TrendingUp },
          { id: 'settings', label: 'Profile', icon: Settings },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id as any)}
              className={`flex flex-col items-center gap-1 px-2.5 py-1 rounded-xl transition ${
                isActive
                  ? 'text-emerald-400 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div
                className={`p-1 rounded-lg ${
                  isActive ? 'bg-emerald-500/15' : ''
                }`}
              >
                <Icon className={`w-5 h-5 ${tab.isAi && !isActive ? 'text-emerald-400' : ''}`} />
              </div>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* INTERACTIVE MODALS */}
      {/* 1. Workout Player Tracker */}
      <WorkoutPlayerModal
        isOpen={isWorkoutPlayerOpen}
        plan={activePlan}
        userProfile={userProfile}
        onClose={() => setIsWorkoutPlayerOpen(false)}
        onWorkoutCompleted={handleWorkoutCompleted}
      />

      {/* 2. AI Workout Generator */}
      <AiWorkoutGeneratorModal
        isOpen={isAiGeneratorOpen}
        userProfile={userProfile}
        onClose={() => setIsAiGeneratorOpen(false)}
        onApplyPlan={handleApplyPlan}
      />

      {/* 3. Exercise Detail Modal */}
      <ExerciseDetailModal
        exercise={selectedExerciseForModal}
        onClose={() => setSelectedExerciseForModal(null)}
      />

      {/* 4. Notification Center */}
      <NotificationCenterModal
        isOpen={isNotificationModalOpen}
        notifications={notifications}
        onClose={() => setIsNotificationModalOpen(false)}
        onMarkAllAsRead={handleMarkAllNotificationsRead}
        onTriggerTestReminder={handleTriggerTestReminder}
      />

      {/* 5. Health & Safety Medical Disclaimer */}
      <MedicalDisclaimerModal
        isOpen={isDisclaimerModalOpen}
        onClose={() => setIsDisclaimerModalOpen(false)}
      />

      {/* 6. Onboarding Wizard */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        initialProfile={userProfile}
        onComplete={(newProf) => {
          handleUpdateProfile(newProf);
          setIsOnboardingOpen(false);
        }}
      />

      {/* 7. Mobile Phone App URL & QR Code Modal */}
      <MobileShareAppModal
        isOpen={isMobileShareOpen}
        onClose={() => setIsMobileShareOpen(false)}
      />
    </div>
  );
}
