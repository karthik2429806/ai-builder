export type FitnessLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export type FitnessGoal =
  | 'Weight Loss'
  | 'Muscle Gain'
  | 'Strength'
  | 'Endurance'
  | 'General Fitness';

export type EquipmentOption =
  | 'Bodyweight'
  | 'Dumbbells'
  | 'Barbell & Plates'
  | 'Kettlebell'
  | 'Resistance Bands'
  | 'Pull-up Bar'
  | 'Gym Machines'
  | 'Cardio Equipment';

export type MuscleGroup =
  | 'Chest'
  | 'Back'
  | 'Shoulders'
  | 'Biceps'
  | 'Triceps'
  | 'Legs'
  | 'Glutes'
  | 'Core'
  | 'Cardio'
  | 'Full Body';

export interface UserProfile {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Non-binary' | 'Prefer not to say';
  heightCm: number;
  weightKg: number;
  fitnessLevel: FitnessLevel;
  goal: FitnessGoal;
  equipment: EquipmentOption[];
  preferredDays: string[]; // e.g. ['Mon', 'Wed', 'Fri', 'Sat']
  preferredDuration: number; // in minutes, e.g. 15, 30, 45, 60
  injuries: string;
  unitSystem: 'metric' | 'imperial';
  notificationsEnabled: boolean;
  reminderTime: string; // e.g. "08:00"
  hydrationReminders: boolean;
  waterIntakeGoalGlasses: number;
  waterDrankTodayGlasses: number;
  lastActiveDate: string;
  defaultRestSeconds: 30 | 45 | 60;
  autoStartNextExercise: boolean;
}

export interface Exercise {
  id: string;
  name: string;
  targetMuscle: MuscleGroup;
  secondaryMuscles: MuscleGroup[];
  equipment: EquipmentOption;
  difficulty: FitnessLevel;
  instructions: string[];
  formTips: string[];
  commonMistakes: string[];
  caloriesPerMinute: number;
  demoType: 'upper' | 'lower' | 'core' | 'cardio' | 'compound';
}

export interface WorkoutSet {
  setNumber: number;
  reps: number;
  weightKg: number;
  completed: boolean;
  rpe?: number; // 1-10 rate of perceived exertion
}

export interface WorkoutPlanExercise {
  id: string;
  exerciseId: string;
  name: string;
  targetMuscle: MuscleGroup;
  sets: WorkoutSet[];
  restSeconds: number;
  equipment: EquipmentOption;
  formCues: string;
  tempo?: string;
}

export interface WarmupCooldownItem {
  name: string;
  duration: string;
  instructions: string;
}

export interface WorkoutPlan {
  id: string;
  title: string;
  description: string;
  difficulty: FitnessLevel;
  estimatedDurationMin: number;
  estimatedCalories: number;
  targetMuscles: MuscleGroup[];
  warmup: WarmupCooldownItem[];
  exercises: WorkoutPlanExercise[];
  cooldown: WarmupCooldownItem[];
  coachTips: string;
  isCustomAI?: boolean;
  dayOfWeek?: string; // 'Monday', 'Tuesday', etc.
}

export interface CompletedWorkoutLog {
  id: string;
  workoutPlanId?: string;
  title: string;
  completedAt: string;
  durationSeconds: number;
  caloriesBurned: number;
  totalVolumeKg: number;
  exercisesCompleted: number;
  totalSetsCompleted: number;
  userRating?: number; // 1-5 stars
  feedback?: string;
}

export interface BodyMeasurementLog {
  id: string;
  date: string;
  weightKg: number;
  chestCm?: number;
  waistCm?: number;
  hipsCm?: number;
  armsCm?: number;
  notes?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  iconName: string;
  unlockedAt?: string;
  currentProgress: number;
  targetProgress: number;
  category: 'workouts' | 'streak' | 'volume' | 'habits';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  suggestedWorkout?: WorkoutPlan;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'workout' | 'rest' | 'hydration' | 'motivation' | 'streak';
  timestamp: string;
  read: boolean;
}
