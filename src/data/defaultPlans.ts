import { WorkoutPlan, UserProfile, FitnessGoal } from '../types';

export const PRESET_WORKOUT_PLANS: WorkoutPlan[] = [
  {
    id: 'plan-fullbody-blast',
    title: 'Full Body Metabolic Blast',
    description: 'High-energy compound training combining strength and cardiovascular endurance for maximum calorie expenditure and muscle activation.',
    difficulty: 'Intermediate',
    estimatedDurationMin: 35,
    estimatedCalories: 340,
    targetMuscles: ['Full Body', 'Chest', 'Legs', 'Back', 'Core'],
    warmup: [
      { name: 'Arm Circles & Hugs', duration: '60s', instructions: 'Loosen shoulders and chest in both clockwise and counter-clockwise rotations.' },
      { name: 'Bodyweight Squat Mobility', duration: '60s', instructions: 'Deep squat hold with torso rotation to mobilize ankles and hips.' },
      { name: 'Jumping Jacks', duration: '60s', instructions: 'Light bounce to elevate core body temperature and heart rate.' }
    ],
    exercises: [
      {
        id: 'e1',
        exerciseId: 'goblet-squat',
        name: 'Goblet Squats',
        targetMuscle: 'Legs',
        equipment: 'Dumbbells',
        restSeconds: 60,
        formCues: 'Chest tall, elbows tucked, break parallel smoothly.',
        sets: [
          { setNumber: 1, reps: 12, weightKg: 12, completed: false },
          { setNumber: 2, reps: 12, weightKg: 14, completed: false },
          { setNumber: 3, reps: 10, weightKg: 16, completed: false }
        ]
      },
      {
        id: 'e2',
        exerciseId: 'push-up',
        name: 'Tempo Push-Ups',
        targetMuscle: 'Chest',
        equipment: 'Bodyweight',
        restSeconds: 45,
        formCues: '2-second descent, explode up, core tight as iron.',
        sets: [
          { setNumber: 1, reps: 15, weightKg: 0, completed: false },
          { setNumber: 2, reps: 12, weightKg: 0, completed: false },
          { setNumber: 3, reps: 10, weightKg: 0, completed: false }
        ]
      },
      {
        id: 'e3',
        exerciseId: 'dumbbell-bent-row',
        name: 'Bent-Over Dumbbell Row',
        targetMuscle: 'Back',
        equipment: 'Dumbbells',
        restSeconds: 60,
        formCues: 'Hinge hips 45 degrees, pull elbows to hip pockets.',
        sets: [
          { setNumber: 1, reps: 12, weightKg: 10, completed: false },
          { setNumber: 2, reps: 12, weightKg: 12, completed: false },
          { setNumber: 3, reps: 10, weightKg: 14, completed: false }
        ]
      },
      {
        id: 'e4',
        exerciseId: 'mountain-climbers',
        name: 'Mountain Climbers',
        targetMuscle: 'Cardio',
        equipment: 'Bodyweight',
        restSeconds: 45,
        formCues: 'Sprint knees with level hips, keep shoulders locked over hands.',
        sets: [
          { setNumber: 1, reps: 30, weightKg: 0, completed: false },
          { setNumber: 2, reps: 30, weightKg: 0, completed: false },
          { setNumber: 3, reps: 30, weightKg: 0, completed: false }
        ]
      },
      {
        id: 'e5',
        exerciseId: 'plank',
        name: 'Forearm Plank Burnout',
        targetMuscle: 'Core',
        equipment: 'Bodyweight',
        restSeconds: 45,
        formCues: 'Squeeze glutes and press floor away through forearms.',
        sets: [
          { setNumber: 1, reps: 45, weightKg: 0, completed: false },
          { setNumber: 2, reps: 45, weightKg: 0, completed: false }
        ]
      }
    ],
    cooldown: [
      { name: 'Cobra to Child’s Pose', duration: '90s', instructions: 'Lengthen abdominal wall, then sit back on heels to release lumbar spine.' },
      { name: 'Standing Quad & Hamstring Stretch', duration: '60s', instructions: '30 seconds per leg focusing on slow nasal breathing.' }
    ],
    coachTips: 'Keep transitions between sets crisp! Drink small sips of water during rest periods, not large gulps.'
  },
  {
    id: 'plan-upper-power',
    title: 'Upper Body Armor & Hypertrophy',
    description: 'Sculpt chest, back, shoulders, and arms with hypertrophy-focused volume and progressive resistance.',
    difficulty: 'Intermediate',
    estimatedDurationMin: 40,
    estimatedCalories: 310,
    targetMuscles: ['Chest', 'Back', 'Shoulders', 'Biceps', 'Triceps'],
    warmup: [
      { name: 'Shoulder Dislocates with Band/Towel', duration: '60s', instructions: 'Smooth rotation overhead to open shoulder capsule.' },
      { name: 'Scapular Push-ups', duration: '45s', instructions: 'Isolate scapular protraction and retraction without bending elbows.' },
      { name: 'Light Arm Swings', duration: '45s', instructions: 'Cross-body dynamic chest openers.' }
    ],
    exercises: [
      {
        id: 'u1',
        exerciseId: 'dumbbell-bench-press',
        name: 'Dumbbell Bench Press',
        targetMuscle: 'Chest',
        equipment: 'Dumbbells',
        restSeconds: 75,
        formCues: 'Retract scapulae into bench, push through chest.',
        sets: [
          { setNumber: 1, reps: 10, weightKg: 14, completed: false },
          { setNumber: 2, reps: 10, weightKg: 16, completed: false },
          { setNumber: 3, reps: 8, weightKg: 18, completed: false },
          { setNumber: 4, reps: 8, weightKg: 18, completed: false }
        ]
      },
      {
        id: 'u2',
        exerciseId: 'pull-up',
        name: 'Pull-Ups / Inverted Rows',
        targetMuscle: 'Back',
        equipment: 'Pull-up Bar',
        restSeconds: 75,
        formCues: 'Initiate by driving elbows down, squeeze lats at peak.',
        sets: [
          { setNumber: 1, reps: 8, weightKg: 0, completed: false },
          { setNumber: 2, reps: 8, weightKg: 0, completed: false },
          { setNumber: 3, reps: 6, weightKg: 0, completed: false }
        ]
      },
      {
        id: 'u3',
        exerciseId: 'dumbbell-overhead-press',
        name: 'Overhead Dumbbell Press',
        targetMuscle: 'Shoulders',
        equipment: 'Dumbbells',
        restSeconds: 60,
        formCues: 'Brace abs, avoid hyperextending lumbar spine.',
        sets: [
          { setNumber: 1, reps: 10, weightKg: 10, completed: false },
          { setNumber: 2, reps: 10, weightKg: 12, completed: false },
          { setNumber: 3, reps: 8, weightKg: 12, completed: false }
        ]
      },
      {
        id: 'u4',
        exerciseId: 'dumbbell-bicep-curl',
        name: 'Incline / Standing Bicep Curls',
        targetMuscle: 'Biceps',
        equipment: 'Dumbbells',
        restSeconds: 45,
        formCues: 'Supinate wrists at top, pin elbows to ribs.',
        sets: [
          { setNumber: 1, reps: 12, weightKg: 8, completed: false },
          { setNumber: 2, reps: 12, weightKg: 9, completed: false },
          { setNumber: 3, reps: 10, weightKg: 10, completed: false }
        ]
      },
      {
        id: 'u5',
        exerciseId: 'overhead-tricep-extension',
        name: 'Overhead Tricep Extension',
        targetMuscle: 'Triceps',
        equipment: 'Dumbbells',
        restSeconds: 45,
        formCues: 'Keep elbows tucked in, full stretch behind head.',
        sets: [
          { setNumber: 1, reps: 12, weightKg: 12, completed: false },
          { setNumber: 2, reps: 12, weightKg: 14, completed: false },
          { setNumber: 3, reps: 10, weightKg: 14, completed: false }
        ]
      }
    ],
    cooldown: [
      { name: 'Doorway Chest Opener', duration: '60s', instructions: 'Forearm against wall, step forward to stretch pec major.' },
      { name: 'Cross-Body Deltoid & Lat Stretch', duration: '60s', instructions: 'Gently pull arm across chest to decompress rear shoulder.' }
    ],
    coachTips: 'Mind-muscle connection is king for hypertrophy. Focus on feeling the muscle stretch and contract rather than just moving the weight.'
  },
  {
    id: 'plan-legs-glutes',
    title: 'Lower Body Strength & Glute Sculpt',
    description: 'Build powerful quads, glutes, and hamstrings while improving hip stability and athletic power.',
    difficulty: 'Intermediate',
    estimatedDurationMin: 35,
    estimatedCalories: 330,
    targetMuscles: ['Legs', 'Glutes', 'Core'],
    warmup: [
      { name: 'Leg Swings (Front/Back & Side)', duration: '60s', instructions: 'Dynamic mobility for hip flexors and adductors.' },
      { name: 'Glute Bridges (Bodyweight Activation)', duration: '60s', instructions: '15 slow reps squeezing glutes hard at the top.' },
      { name: 'Deep Squat Holds', duration: '45s', instructions: 'Pry knees open with elbows.' }
    ],
    exercises: [
      {
        id: 'l1',
        exerciseId: 'romanian-deadlift',
        name: 'Romanian Deadlift',
        targetMuscle: 'Glutes',
        equipment: 'Dumbbells',
        restSeconds: 75,
        formCues: 'Push hips back to wall, feel hamstrings load, keep spine flat.',
        sets: [
          { setNumber: 1, reps: 10, weightKg: 16, completed: false },
          { setNumber: 2, reps: 10, weightKg: 18, completed: false },
          { setNumber: 3, reps: 10, weightKg: 20, completed: false }
        ]
      },
      {
        id: 'l2',
        exerciseId: 'bulgarian-split-squat',
        name: 'Bulgarian Split Squats',
        targetMuscle: 'Legs',
        equipment: 'Dumbbells',
        restSeconds: 60,
        formCues: '80% of weight on front heel, descent straight down.',
        sets: [
          { setNumber: 1, reps: 10, weightKg: 8, completed: false },
          { setNumber: 2, reps: 10, weightKg: 8, completed: false },
          { setNumber: 3, reps: 8, weightKg: 10, completed: false }
        ]
      },
      {
        id: 'l3',
        exerciseId: 'walking-lunges',
        name: 'Weighted Walking Lunges',
        targetMuscle: 'Legs',
        equipment: 'Dumbbells',
        restSeconds: 60,
        formCues: 'Keep torso tall, hover back knee 1 inch above floor.',
        sets: [
          { setNumber: 1, reps: 20, weightKg: 6, completed: false },
          { setNumber: 2, reps: 20, weightKg: 8, completed: false }
        ]
      },
      {
        id: 'l4',
        exerciseId: 'glute-bridge',
        name: 'Elevated Glute Bridge Burner',
        targetMuscle: 'Glutes',
        equipment: 'Bodyweight',
        restSeconds: 45,
        formCues: '2-second isometric hold at top of every single rep.',
        sets: [
          { setNumber: 1, reps: 15, weightKg: 0, completed: false },
          { setNumber: 2, reps: 15, weightKg: 0, completed: false },
          { setNumber: 3, reps: 15, weightKg: 0, completed: false }
        ]
      }
    ],
    cooldown: [
      { name: 'Pigeon Pose', duration: '90s', instructions: '45 seconds per side to release deep glute piriformis tension.' },
      { name: 'Seated Forward Fold Hamstring Stretch', duration: '60s', instructions: 'Hinge forward gently with exhales.' }
    ],
    coachTips: 'Leg workouts demand serious oxygen and energy. Take full deep diaphragmatic breaths between every set!'
  },
  {
    id: 'plan-express-hiit',
    title: 'Express 20-Min Cardio & Core Burner',
    description: 'Time-crunched, high-efficiency workout requiring zero equipment. Torch calories, sweat, and fire up your core.',
    difficulty: 'Beginner',
    estimatedDurationMin: 20,
    estimatedCalories: 210,
    targetMuscles: ['Cardio', 'Core', 'Full Body'],
    warmup: [
      { name: 'High Knees & Butt Kicks', duration: '60s', instructions: 'Alternate 30s high knees and 30s butt kicks in place.' },
      { name: 'Torso Twists & Side Reaches', duration: '60s', instructions: 'Open spine and lateral obliques.' }
    ],
    exercises: [
      {
        id: 'h1',
        exerciseId: 'jumping-jacks',
        name: 'Speed Jumping Jacks',
        targetMuscle: 'Cardio',
        equipment: 'Bodyweight',
        restSeconds: 30,
        formCues: 'Quick cadence, light on balls of feet.',
        sets: [
          { setNumber: 1, reps: 40, weightKg: 0, completed: false },
          { setNumber: 2, reps: 40, weightKg: 0, completed: false },
          { setNumber: 3, reps: 40, weightKg: 0, completed: false }
        ]
      },
      {
        id: 'h2',
        exerciseId: 'burpee',
        name: 'Controlled Burpees',
        targetMuscle: 'Full Body',
        equipment: 'Bodyweight',
        restSeconds: 45,
        formCues: 'Smooth rhythm, explode upwards on jump.',
        sets: [
          { setNumber: 1, reps: 10, weightKg: 0, completed: false },
          { setNumber: 2, reps: 10, weightKg: 0, completed: false },
          { setNumber: 3, reps: 8, weightKg: 0, completed: false }
        ]
      },
      {
        id: 'h3',
        exerciseId: 'bicycle-crunches',
        name: 'Bicycle Crunches',
        targetMuscle: 'Core',
        equipment: 'Bodyweight',
        restSeconds: 30,
        formCues: 'Slow and controlled rotation, do not pull on neck.',
        sets: [
          { setNumber: 1, reps: 24, weightKg: 0, completed: false },
          { setNumber: 2, reps: 24, weightKg: 0, completed: false },
          { setNumber: 3, reps: 24, weightKg: 0, completed: false }
        ]
      },
      {
        id: 'h4',
        exerciseId: 'mountain-climbers',
        name: 'Sprint Mountain Climbers',
        targetMuscle: 'Cardio',
        equipment: 'Bodyweight',
        restSeconds: 30,
        formCues: 'Keep back flat like a tabletop.',
        sets: [
          { setNumber: 1, reps: 30, weightKg: 0, completed: false },
          { setNumber: 2, reps: 30, weightKg: 0, completed: false },
          { setNumber: 3, reps: 30, weightKg: 0, completed: false }
        ]
      }
    ],
    cooldown: [
      { name: 'Cat-Cow Flow', duration: '60s', instructions: 'Gentle spinal flexion and extension synced to slow breathing.' },
      { name: 'Full Body Child’s Pose', duration: '60s', instructions: 'Sink hips back, arms outstretched, slow heart rate down.' }
    ],
    coachTips: 'Short workout doesn’t mean low impact—give 100% effort during the work intervals!'
  },
  {
    id: 'plan-advanced-beast-circuit',
    title: 'Advanced Beast Mode: High-Density Circuit (4 Laps)',
    description: 'Elite calisthenics and unilateral strength circuit. Structured with strict 30-second rest intervals between exercises and 45-second rest between laps to maximize lactate threshold and power.',
    difficulty: 'Advanced',
    estimatedDurationMin: 40,
    estimatedCalories: 450,
    targetMuscles: ['Full Body', 'Legs', 'Back', 'Core', 'Shoulders'],
    warmup: [
      { name: 'Deep Hip Opener & Spiderman Crawls', duration: '90s', instructions: 'Lunge with elbow to instep and thoracic reach.' },
      { name: 'Scapular Pull-ups & Handstand Kick Prep', duration: '60s', instructions: 'Activate serratus anterior and latissimus stabilizers.' },
      { name: 'Fast Feet & Lateral Hops', duration: '60s', instructions: 'Prime central nervous system firing rate.' }
    ],
    exercises: [
      {
        id: 'adv-1',
        exerciseId: 'explosive-pullup',
        name: 'Explosive High Pull-Ups / Chest-to-Bar',
        targetMuscle: 'Back',
        equipment: 'Pull-up Bar',
        restSeconds: 30,
        formCues: 'Maximum upward velocity, pull bar down to upper ribs.',
        sets: [
          { setNumber: 1, reps: 8, weightKg: 0, completed: false },
          { setNumber: 2, reps: 8, weightKg: 0, completed: false },
          { setNumber: 3, reps: 6, weightKg: 0, completed: false },
          { setNumber: 4, reps: 6, weightKg: 0, completed: false }
        ]
      },
      {
        id: 'adv-2',
        exerciseId: 'pistol-squat',
        name: 'Pistol Squats (Unilateral Mastery)',
        targetMuscle: 'Legs',
        equipment: 'Bodyweight',
        restSeconds: 30,
        formCues: 'Descend to full depth on one leg, push through midfoot.',
        sets: [
          { setNumber: 1, reps: 6, weightKg: 0, completed: false },
          { setNumber: 2, reps: 6, weightKg: 0, completed: false },
          { setNumber: 3, reps: 6, weightKg: 0, completed: false },
          { setNumber: 4, reps: 6, weightKg: 0, completed: false }
        ]
      },
      {
        id: 'adv-3',
        exerciseId: 'chest-dips',
        name: 'Chest Dips with Forward Lean',
        targetMuscle: 'Chest',
        equipment: 'Pull-up Bar',
        restSeconds: 30,
        formCues: 'Lean torso 30 degrees, break 90 degrees elbows, power out.',
        sets: [
          { setNumber: 1, reps: 12, weightKg: 0, completed: false },
          { setNumber: 2, reps: 10, weightKg: 0, completed: false },
          { setNumber: 3, reps: 10, weightKg: 0, completed: false },
          { setNumber: 4, reps: 8, weightKg: 0, completed: false }
        ]
      },
      {
        id: 'adv-4',
        exerciseId: 'deficit-bulgarian-squat',
        name: 'Weighted Deficit Bulgarian Split Squats',
        targetMuscle: 'Legs',
        equipment: 'Dumbbells',
        restSeconds: 30,
        formCues: 'Front foot on plate, sink into deep deficit hip stretch.',
        sets: [
          { setNumber: 1, reps: 10, weightKg: 14, completed: false },
          { setNumber: 2, reps: 10, weightKg: 14, completed: false },
          { setNumber: 3, reps: 8, weightKg: 16, completed: false },
          { setNumber: 4, reps: 8, weightKg: 16, completed: false }
        ]
      },
      {
        id: 'adv-5',
        exerciseId: 'dragon-flag',
        name: 'Dragon Flag Core Levers',
        targetMuscle: 'Core',
        equipment: 'Bodyweight',
        restSeconds: 45,
        formCues: 'Torso and legs straight as an arrow, 3-second negative descent.',
        sets: [
          { setNumber: 1, reps: 6, weightKg: 0, completed: false },
          { setNumber: 2, reps: 6, weightKg: 0, completed: false },
          { setNumber: 3, reps: 5, weightKg: 0, completed: false },
          { setNumber: 4, reps: 5, weightKg: 0, completed: false }
        ]
      }
    ],
    cooldown: [
      { name: 'Pigeon Pose to Hip Flexor Release', duration: '90s', instructions: 'Deep diaphragmatic breathing releasing glutes and psoas.' },
      { name: 'Dead Hang Decompression', duration: '60s', instructions: 'Passive dead hang from pull-up bar to lengthen spine.' }
    ],
    coachTips: 'Strict 30-45s rest intervals are non-negotiable! The timer will auto-start your next set—stay locked in!'
  },
  {
    id: 'plan-advanced-iron-overload',
    title: 'Advanced Iron Titan: Strength & Hypertrophy Overload',
    description: 'Heavy compound loads designed for maximum motor unit recruitment. Strict 45s rest density forces rapid metabolic recovery between sets.',
    difficulty: 'Advanced',
    estimatedDurationMin: 45,
    estimatedCalories: 420,
    targetMuscles: ['Back', 'Chest', 'Legs', 'Shoulders', 'Core'],
    warmup: [
      { name: 'Band Pull-Aparts & Dislocates', duration: '60s', instructions: 'Activate posterior delts and rhomboids.' },
      { name: 'Glute Bridge Isometric Holds', duration: '60s', instructions: 'Fire glute medius and hamstrings.' },
      { name: 'Barbell/Dumbbell RDL Mobility', duration: '60s', instructions: 'Hinge patterning with light weight.' }
    ],
    exercises: [
      {
        id: 'titan-1',
        exerciseId: 'dumbbell-bench-press',
        name: 'Heavy Dumbbell Bench Press (RPE 8.5)',
        targetMuscle: 'Chest',
        equipment: 'Dumbbells',
        restSeconds: 45,
        formCues: 'Shoulder blades pinned, press with inward converging squeeze.',
        sets: [
          { setNumber: 1, reps: 8, weightKg: 20, completed: false },
          { setNumber: 2, reps: 8, weightKg: 22, completed: false },
          { setNumber: 3, reps: 6, weightKg: 24, completed: false },
          { setNumber: 4, reps: 6, weightKg: 24, completed: false }
        ]
      },
      {
        id: 'titan-2',
        exerciseId: 'dumbbell-bent-row',
        name: 'Heavy Chest-Supported / Bent-Over Row',
        targetMuscle: 'Back',
        equipment: 'Dumbbells',
        restSeconds: 45,
        formCues: '45-degree hinge, drive elbows toward hip crest.',
        sets: [
          { setNumber: 1, reps: 8, weightKg: 18, completed: false },
          { setNumber: 2, reps: 8, weightKg: 20, completed: false },
          { setNumber: 3, reps: 8, weightKg: 22, completed: false },
          { setNumber: 4, reps: 6, weightKg: 22, completed: false }
        ]
      },
      {
        id: 'titan-3',
        exerciseId: 'handstand-pushup',
        name: 'Pike to Handstand Push-Ups',
        targetMuscle: 'Shoulders',
        equipment: 'Bodyweight',
        restSeconds: 45,
        formCues: 'Hips directly stacked over shoulders, controlled 2s descent.',
        sets: [
          { setNumber: 1, reps: 8, weightKg: 0, completed: false },
          { setNumber: 2, reps: 8, weightKg: 0, completed: false },
          { setNumber: 3, reps: 6, weightKg: 0, completed: false }
        ]
      },
      {
        id: 'titan-4',
        exerciseId: 'romanian-deadlift',
        name: 'Heavy Romanian Deadlift',
        targetMuscle: 'Glutes',
        equipment: 'Dumbbells',
        restSeconds: 45,
        formCues: 'Push hips to back wall, flat spine, explosive lockout.',
        sets: [
          { setNumber: 1, reps: 8, weightKg: 22, completed: false },
          { setNumber: 2, reps: 8, weightKg: 24, completed: false },
          { setNumber: 3, reps: 8, weightKg: 26, completed: false }
        ]
      }
    ],
    cooldown: [
      { name: 'Doorway Chest Opener', duration: '60s', instructions: 'Lengthen pecs and anterior delts.' },
      { name: 'Seated Hamstring & Spinal Twist', duration: '90s', instructions: 'Decompress lumbar facet joints.' }
    ],
    coachTips: 'Every rep should be explosive on the concentric and strict on the eccentric!'
  }
];

export function getRecommendedPlan(profile: UserProfile): WorkoutPlan {
  // Check for Advanced Level priority
  if (profile.fitnessLevel === 'Advanced') {
    if (profile.goal === 'Strength' || profile.goal === 'Muscle Gain') {
      return PRESET_WORKOUT_PLANS[5]; // Advanced Iron Titan
    }
    return PRESET_WORKOUT_PLANS[4]; // Advanced Beast Mode Circuit
  }

  if (profile.preferredDuration <= 20) {
    return PRESET_WORKOUT_PLANS[3]; // Express 20-min
  }

  switch (profile.goal) {
    case 'Muscle Gain':
      return PRESET_WORKOUT_PLANS[1]; // Upper Power & Hypertrophy
    case 'Weight Loss':
    case 'Endurance':
      return PRESET_WORKOUT_PLANS[0]; // Full Body Metabolic Blast
    case 'Strength':
      return PRESET_WORKOUT_PLANS[2]; // Lower & Glutes Strength
    case 'General Fitness':
    default:
      return PRESET_WORKOUT_PLANS[0];
  }
}
