import {
  UserProfile,
  WorkoutPlan,
  CompletedWorkoutLog,
  BodyMeasurementLog,
  Achievement,
  NotificationItem,
} from '../types';
import { PRESET_WORKOUT_PLANS } from '../data/defaultPlans';

const STORAGE_KEYS = {
  PROFILE: 'pulseai_user_profile_v1',
  ACTIVE_PLAN: 'pulseai_active_plan_v1',
  HISTORY: 'pulseai_workout_history_v1',
  MEASUREMENTS: 'pulseai_measurements_v1',
  ACHIEVEMENTS: 'pulseai_achievements_v1',
  NOTIFICATIONS: 'pulseai_notifications_v1',
  CHAT_MESSAGES: 'pulseai_chat_messages_v1',
};

export const DEFAULT_PROFILE: UserProfile = {
  id: 'user-default-1',
  name: 'Alex Rivera',
  age: 28,
  gender: 'Male',
  heightCm: 178,
  weightKg: 75.4,
  fitnessLevel: 'Intermediate',
  goal: 'Muscle Gain',
  equipment: ['Bodyweight', 'Dumbbells', 'Pull-up Bar', 'Resistance Bands'],
  preferredDays: ['Mon', 'Wed', 'Fri', 'Sat'],
  preferredDuration: 35,
  injuries: 'None',
  unitSystem: 'metric',
  notificationsEnabled: true,
  reminderTime: '08:00',
  hydrationReminders: true,
  waterIntakeGoalGlasses: 8,
  waterDrankTodayGlasses: 5,
  lastActiveDate: new Date().toISOString().split('T')[0],
  defaultRestSeconds: 45,
  autoStartNextExercise: true,
};

export const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-sweat',
    title: 'First Sweat',
    description: 'Complete your first workout with PulseAI',
    iconName: 'Flame',
    unlockedAt: '2026-10-01',
    currentProgress: 1,
    targetProgress: 1,
    category: 'workouts',
  },
  {
    id: 'iron-will-streak',
    title: '3-Day Momentum',
    description: 'Maintain a 3-day workout consistency streak',
    iconName: 'Zap',
    unlockedAt: '2026-10-04',
    currentProgress: 3,
    targetProgress: 3,
    category: 'streak',
  },
  {
    id: 'century-reps',
    title: 'Century Club',
    description: 'Complete 100 total repetitions in a single session',
    iconName: 'Trophy',
    unlockedAt: '2026-10-05',
    currentProgress: 100,
    targetProgress: 100,
    category: 'workouts',
  },
  {
    id: 'heavy-lifter',
    title: 'Ton of Iron',
    description: 'Lift an aggregate of 2,000 kg volume across your workouts',
    iconName: 'Dumbbell',
    unlockedAt: '2026-10-06',
    currentProgress: 2450,
    targetProgress: 2000,
    category: 'volume',
  },
  {
    id: 'consistency-king',
    title: 'Iron Discipline',
    description: 'Complete 10 scheduled workouts',
    iconName: 'Award',
    currentProgress: 5,
    targetProgress: 10,
    category: 'workouts',
  },
  {
    id: 'hydration-hero',
    title: 'Hydration Master',
    description: 'Hit your 8-glass water goal 5 days in a row',
    iconName: 'Droplet',
    currentProgress: 3,
    targetProgress: 5,
    category: 'habits',
  },
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Workout Time!',
    message: "Coach Pulse: Ready to crush Today's Full Body Metabolic Blast? Hydrate and warm up!",
    type: 'workout',
    timestamp: '1 hour ago',
    read: false,
  },
  {
    id: 'notif-2',
    title: 'Hydration Check',
    message: 'Time for glass #6! Keep muscle hydration and recovery optimal.',
    type: 'hydration',
    timestamp: '3 hours ago',
    read: false,
  },
  {
    id: 'notif-3',
    title: 'Streak Record: 4 Days!',
    message: 'Incredible dedication! You are currently on your longest consistency streak.',
    type: 'streak',
    timestamp: 'Yesterday',
    read: true,
  },
];

export const INITIAL_MEASUREMENTS: BodyMeasurementLog[] = [
  { id: 'm1', date: '2026-09-10', weightKg: 77.2, chestCm: 99, waistCm: 84, hipsCm: 98, armsCm: 35.0 },
  { id: 'm2', date: '2026-09-17', weightKg: 76.8, chestCm: 99.5, waistCm: 83.5, hipsCm: 98, armsCm: 35.2 },
  { id: 'm3', date: '2026-09-24', weightKg: 76.1, chestCm: 100, waistCm: 82.5, hipsCm: 97.5, armsCm: 35.5 },
  { id: 'm4', date: '2026-10-01', weightKg: 75.8, chestCm: 100.5, waistCm: 82, hipsCm: 97, armsCm: 35.8 },
  { id: 'm5', date: '2026-10-07', weightKg: 75.4, chestCm: 101, waistCm: 81.5, hipsCm: 97, armsCm: 36.2, notes: 'Feeling stronger on pull-ups!' },
];

export const INITIAL_HISTORY: CompletedWorkoutLog[] = [
  {
    id: 'h-1',
    title: 'Full Body Metabolic Blast',
    completedAt: '2026-10-06T18:30:00Z',
    durationSeconds: 2180, // 36 mins
    caloriesBurned: 345,
    totalVolumeKg: 980,
    exercisesCompleted: 5,
    totalSetsCompleted: 14,
    userRating: 5,
    feedback: 'Pushed hard on goblet squats, great energy!',
  },
  {
    id: 'h-2',
    title: 'Upper Body Armor & Hypertrophy',
    completedAt: '2026-10-04T17:15:00Z',
    durationSeconds: 2460, // 41 mins
    caloriesBurned: 320,
    totalVolumeKg: 1220,
    exercisesCompleted: 5,
    totalSetsCompleted: 16,
    userRating: 5,
    feedback: 'Felt incredible chest contraction on dumbbell bench press.',
  },
  {
    id: 'h-3',
    title: 'Lower Body Strength & Glute Sculpt',
    completedAt: '2026-10-02T19:00:00Z',
    durationSeconds: 2100, // 35 mins
    caloriesBurned: 335,
    totalVolumeKg: 890,
    exercisesCompleted: 4,
    totalSetsCompleted: 11,
    userRating: 4,
    feedback: 'Bulgarian split squats were tough but rewarding.',
  },
  {
    id: 'h-4',
    title: 'Express 20-Min Cardio & Core Burner',
    completedAt: '2026-09-30T07:45:00Z',
    durationSeconds: 1240, // 20 mins
    caloriesBurned: 215,
    totalVolumeKg: 0,
    exercisesCompleted: 4,
    totalSetsCompleted: 12,
    userRating: 5,
    feedback: 'Quick morning sweat session before work.',
  },
];

export class StorageService {
  static getProfile(): UserProfile {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
      if (data) return JSON.parse(data);
    } catch {
      // fallback
    }
    return DEFAULT_PROFILE;
  }

  static saveProfile(profile: UserProfile): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    } catch (e) {
      console.error('Failed to save profile', e);
    }
  }

  static getActivePlan(): WorkoutPlan {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ACTIVE_PLAN);
      if (data) return JSON.parse(data);
    } catch {
      // fallback
    }
    return PRESET_WORKOUT_PLANS[0];
  }

  static saveActivePlan(plan: WorkoutPlan): void {
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_PLAN, JSON.stringify(plan));
    } catch (e) {
      console.error('Failed to save active plan', e);
    }
  }

  static getHistory(): CompletedWorkoutLog[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.HISTORY);
      if (data) return JSON.parse(data);
    } catch {
      // fallback
    }
    return INITIAL_HISTORY;
  }

  static addWorkoutLog(log: CompletedWorkoutLog): void {
    const history = this.getHistory();
    const updated = [log, ...history];
    try {
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updated));
      // update achievements progress
      this.checkAndUpdateAchievements(log);
    } catch (e) {
      console.error('Failed to save workout log', e);
    }
  }

  static getMeasurements(): BodyMeasurementLog[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MEASUREMENTS);
      if (data) return JSON.parse(data);
    } catch {
      // fallback
    }
    return INITIAL_MEASUREMENTS;
  }

  static addMeasurement(log: BodyMeasurementLog): void {
    const list = this.getMeasurements();
    const updated = [...list, log];
    try {
      localStorage.setItem(STORAGE_KEYS.MEASUREMENTS, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save measurement', e);
    }
  }

  static getAchievements(): Achievement[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
      if (data) return JSON.parse(data);
    } catch {
      // fallback
    }
    return DEFAULT_ACHIEVEMENTS;
  }

  static saveAchievements(achievements: Achievement[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
    } catch (e) {
      console.error('Failed to save achievements', e);
    }
  }

  static getNotifications(): NotificationItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      if (data) return JSON.parse(data);
    } catch {
      // fallback
    }
    return INITIAL_NOTIFICATIONS;
  }

  static saveNotifications(items: NotificationItem[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save notifications', e);
    }
  }

  static addNotification(item: NotificationItem): void {
    const list = this.getNotifications();
    const updated = [item, ...list];
    this.saveNotifications(updated);
  }

  static checkAndUpdateAchievements(newLog: CompletedWorkoutLog): void {
    const list = this.getAchievements();
    const history = this.getHistory();
    const totalCount = history.length;
    const totalVol = history.reduce((acc, h) => acc + h.totalVolumeKg, 0);

    const updated = list.map((a) => {
      if (a.id === 'first-sweat' && !a.unlockedAt && totalCount >= 1) {
        return { ...a, currentProgress: 1, unlockedAt: new Date().toISOString() };
      }
      if (a.id === 'consistency-king') {
        const nextProg = Math.min(a.targetProgress, totalCount);
        return {
          ...a,
          currentProgress: nextProg,
          unlockedAt: nextProg >= a.targetProgress && !a.unlockedAt ? new Date().toISOString() : a.unlockedAt,
        };
      }
      if (a.id === 'heavy-lifter') {
        const nextVol = totalVol;
        return {
          ...a,
          currentProgress: nextVol,
          unlockedAt: nextVol >= a.targetProgress && !a.unlockedAt ? new Date().toISOString() : a.unlockedAt,
        };
      }
      return a;
    });

    this.saveAchievements(updated);
  }
}
