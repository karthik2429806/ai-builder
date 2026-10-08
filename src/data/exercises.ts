import { Exercise } from '../types';

export const EXERCISE_LIBRARY: Exercise[] = [
  // CHEST
  {
    id: 'push-up',
    name: 'Push-Up',
    targetMuscle: 'Chest',
    secondaryMuscles: ['Triceps', 'Shoulders', 'Core'],
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    instructions: [
      'Place your hands on the floor slightly wider than shoulder-width apart.',
      'Maintain a rigid plank line from heels to head with your core braced.',
      'Lower your chest until it touches or nearly touches the ground, elbows at 45 degrees.',
      'Drive forcefully through your palms back to the top position.'
    ],
    formTips: [
      'Keep glutes squeezed and neck neutral (look 6 inches ahead of fingers).',
      'Do not flare your elbows 90 degrees out to protect shoulders.'
    ],
    commonMistakes: [
      'Sagging lower back due to loose core.',
      'Half reps failing to touch near chest height.'
    ],
    caloriesPerMinute: 8,
    demoType: 'upper'
  },
  {
    id: 'dumbbell-bench-press',
    name: 'Dumbbell Bench Press',
    targetMuscle: 'Chest',
    secondaryMuscles: ['Triceps', 'Shoulders'],
    equipment: 'Dumbbells',
    difficulty: 'Intermediate',
    instructions: [
      'Lie flat on a workout bench holding dumbbells above your chest with arms extended.',
      'Plant your feet firmly on the ground and pull shoulder blades retracted and down.',
      'Lower dumbbells slowly toward mid-chest level with a 2-second negative.',
      'Press back up, squeezing chest muscles at the peak contraction.'
    ],
    formTips: [
      'Keep your wrists stacked straight over elbows throughout the movement.',
      'Maintain a slight natural arch in lower back, avoiding flat shoulder blades.'
    ],
    commonMistakes: [
      'Clanking dumbbells together at the top, losing tension.',
      'Flaring elbows out horizontally parallel to collarbone.'
    ],
    caloriesPerMinute: 7,
    demoType: 'upper'
  },
  {
    id: 'incline-dumbbell-press',
    name: 'Incline Dumbbell Press',
    targetMuscle: 'Chest',
    secondaryMuscles: ['Shoulders', 'Triceps'],
    equipment: 'Dumbbells',
    difficulty: 'Intermediate',
    instructions: [
      'Set bench to 30-45 degrees.',
      'Hold dumbbells at clavicle height and press upward following a slight converging arc.',
      'Control the descent to feel a stretch across upper pectorals.',
      'Exhale as you press to lockout.'
    ],
    formTips: [
      'Keep the bench incline moderate (30 degrees) to target upper chest rather than front deltoids.'
    ],
    commonMistakes: [
      'Setting bench too steep (above 45 degrees shifts work to shoulders).'
    ],
    caloriesPerMinute: 7,
    demoType: 'upper'
  },
  {
    id: 'chest-dips',
    name: 'Chest Dips',
    targetMuscle: 'Chest',
    secondaryMuscles: ['Triceps', 'Shoulders'],
    equipment: 'Pull-up Bar',
    difficulty: 'Advanced',
    instructions: [
      'Grasp parallel bars, lock arms, and lean torso forward roughly 30 degrees.',
      'Bend elbows and lower your body until elbows hit 90 degrees or a mild chest stretch.',
      'Drive through your palms back up, focusing on pecs contracting.'
    ],
    formTips: ['Maintain forward lean to emphasize chest over triceps.'],
    commonMistakes: ['Going excessively deep if shoulder mobility is restricted.'],
    caloriesPerMinute: 9,
    demoType: 'upper'
  },

  // BACK
  {
    id: 'pull-up',
    name: 'Pull-Up',
    targetMuscle: 'Back',
    secondaryMuscles: ['Biceps', 'Shoulders', 'Core'],
    equipment: 'Pull-up Bar',
    difficulty: 'Advanced',
    instructions: [
      'Grip the pull-up bar with an overhand grip wider than shoulders.',
      'Hang with full arm extension, initiate pull by depressing scapulae downward.',
      'Pull your chest towards the bar until chin clears the bar level.',
      'Lower under control for 2 full seconds back to dead hang.'
    ],
    formTips: [
      'Think of pulling elbows down toward your back pockets.',
      'Engage your abdominal wall to prevent excessive kipping or swinging.'
    ],
    commonMistakes: [
      'Kicking legs violently or swinging forward.',
      'Half-reps without completing full range of motion.'
    ],
    caloriesPerMinute: 9,
    demoType: 'upper'
  },
  {
    id: 'dumbbell-bent-row',
    name: 'Bent-Over Dumbbell Row',
    targetMuscle: 'Back',
    secondaryMuscles: ['Biceps', 'Shoulders', 'Core'],
    equipment: 'Dumbbells',
    difficulty: 'Intermediate',
    instructions: [
      'Hinge at the hips with soft knees until torso is roughly 45 degrees to ground.',
      'Hold dumbbells with neutral or overhand grip letting arms hang straight.',
      'Row dumbbells upward toward your hip crease, squeezing your lats and mid-back.',
      'Lower under control with full lat stretch at bottom.'
    ],
    formTips: [
      'Keep your back neutral and chest proud throughout the entire set.',
      'Do not jerk your upper torso upright to momentum the weight up.'
    ],
    commonMistakes: [
      'Rounding thoracic or lumbar spine.',
      'Pulling too high toward chest rather than hip pocket.'
    ],
    caloriesPerMinute: 7,
    demoType: 'upper'
  },
  {
    id: 'bodyweight-inverted-row',
    name: 'Inverted Row / Australian Pull-up',
    targetMuscle: 'Back',
    secondaryMuscles: ['Biceps', 'Core'],
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    instructions: [
      'Lie under a sturdy bar or table edge at waist height.',
      'Grab bar overhand and keep heels on ground with body in straight plank.',
      'Pull chest up to touch the bar, squeezing shoulder blades.',
      'Lower slowly back to straight arms.'
    ],
    formTips: ['Keep glutes tight and core braced like a reverse push-up.'],
    commonMistakes: ['Dropping hips downward during pull.'],
    caloriesPerMinute: 6,
    demoType: 'upper'
  },
  {
    id: 'resistance-band-lat-pulldown',
    name: 'Resistance Band Lat Pulldown',
    targetMuscle: 'Back',
    secondaryMuscles: ['Biceps', 'Shoulders'],
    equipment: 'Resistance Bands',
    difficulty: 'Beginner',
    instructions: [
      'Anchor band high overhead or hold band taught above head with both hands.',
      'Pull hands down and wide, drawing elbows to sides and pinching latissimus dorsi.',
      'Hold peak contraction for 1 second before controlling release back up.'
    ],
    formTips: ['Keep chest lifted and ribs tucked down.'],
    commonMistakes: ['Letting band snap back quickly.'],
    caloriesPerMinute: 6,
    demoType: 'upper'
  },

  // SHOULDERS
  {
    id: 'dumbbell-overhead-press',
    name: 'Dumbbell Overhead Shoulder Press',
    targetMuscle: 'Shoulders',
    secondaryMuscles: ['Triceps', 'Core'],
    equipment: 'Dumbbells',
    difficulty: 'Intermediate',
    instructions: [
      'Stand tall or sit upright with dumbbells at ear height, palms facing forward or semi-neutral.',
      'Brace core and press dumbbells overhead in a smooth path until arms lock out.',
      'Lower under control back to ear level over 2 seconds.'
    ],
    formTips: [
      'Avoid arching lower back; squeeze glutes and tuck pelvis to protect spine.'
    ],
    commonMistakes: ['Leaning backward excessively.', 'Dropping elbows too low below collarbones.'],
    caloriesPerMinute: 7,
    demoType: 'upper'
  },
  {
    id: 'lateral-raises',
    name: 'Lateral Raises',
    targetMuscle: 'Shoulders',
    secondaryMuscles: ['Back'],
    equipment: 'Dumbbells',
    difficulty: 'Beginner',
    instructions: [
      'Stand with feet shoulder-width apart, holding light dumbbells at sides.',
      'With a slight bend in elbows, raise arms outward until parallel to floor.',
      'Pause for a beat at parallel and lower deliberately.'
    ],
    formTips: [
      'Lead with elbows slightly higher than wrists, pouring a pitcher of water cue.'
    ],
    commonMistakes: ['Using momentum or swinging torso.'],
    caloriesPerMinute: 5,
    demoType: 'upper'
  },
  {
    id: 'pike-push-up',
    name: 'Pike Push-Up',
    targetMuscle: 'Shoulders',
    secondaryMuscles: ['Triceps', 'Core'],
    equipment: 'Bodyweight',
    difficulty: 'Intermediate',
    instructions: [
      'Start in a downward dog or inverted V-shape position with hips piked high.',
      'Lower crown of head diagonally forward between fingertips.',
      'Push firmly back up to top inverted position.'
    ],
    formTips: ['Keep hips high above shoulders to transfer load to deltoids.'],
    commonMistakes: ['Flattening out into standard push-up plank.'],
    caloriesPerMinute: 7,
    demoType: 'upper'
  },

  // LEGS & GLUTES
  {
    id: 'bodyweight-squat',
    name: 'Air Squat / Bodyweight Squat',
    targetMuscle: 'Legs',
    secondaryMuscles: ['Glutes', 'Core'],
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    instructions: [
      'Stand with feet slightly wider than shoulder-width, toes turned 15 degrees out.',
      'Hinge hips back and bend knees, tracking knees outward over toes.',
      'Descend until thighs are parallel or below parallel to the floor.',
      'Drive through mid-foot and heels to stand tall, squeezing glutes.'
    ],
    formTips: [
      'Keep chest tall and gaze forward throughout.',
      'Breathe in on way down, exhale as you power up.'
    ],
    commonMistakes: [
      'Knees collapsing inward (valgus collapse).',
      'Weight shifting forward onto toes lifting heels.'
    ],
    caloriesPerMinute: 8,
    demoType: 'lower'
  },
  {
    id: 'goblet-squat',
    name: 'Goblet Squat',
    targetMuscle: 'Legs',
    secondaryMuscles: ['Glutes', 'Core'],
    equipment: 'Dumbbells',
    difficulty: 'Intermediate',
    instructions: [
      'Hold a dumbbell or kettlebell vertically against your sternum with both hands.',
      'Keep elbows tucked in toward ribs.',
      'Squat deep between knees while maintaining an upright torso.',
      'Drive out of the hole smoothly back to top.'
    ],
    formTips: [
      'The counterweight helps keep your torso more upright than barbell squats.'
    ],
    commonMistakes: ['Letting weight pull upper back into rounding.'],
    caloriesPerMinute: 8,
    demoType: 'lower'
  },
  {
    id: 'walking-lunges',
    name: 'Walking Lunges',
    targetMuscle: 'Legs',
    secondaryMuscles: ['Glutes', 'Core'],
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    instructions: [
      'Step forward with your right leg, lowering hips until both knees form 90 degrees.',
      'Keep back knee hovering an inch off the floor.',
      'Drive through front heel and step forward into next lunge with left leg.'
    ],
    formTips: ['Keep torso perpendicular to ground; do not collapse forward.'],
    commonMistakes: ['Front knee shooting way past toes awkwardly.'],
    caloriesPerMinute: 8,
    demoType: 'lower'
  },
  {
    id: 'romanian-deadlift',
    name: 'Romanian Deadlift (Dumbbell)',
    targetMuscle: 'Glutes',
    secondaryMuscles: ['Legs', 'Back', 'Core'],
    equipment: 'Dumbbells',
    difficulty: 'Intermediate',
    instructions: [
      'Stand holding dumbbells against front of thighs, feet hip-width apart.',
      'With soft knees, push your hips back as if touching a wall behind you.',
      'Slide dumbbells down along shins until you feel a deep hamstring stretch.',
      'Contract glutes and hamstrings to bring hips forward back to starting stance.'
    ],
    formTips: [
      'This is a pure hip hinge, not a squat. Knees remain softly bent at constant angle.'
    ],
    commonMistakes: ['Squatting down rather than hinging.', 'Rounding lower back.'],
    caloriesPerMinute: 7,
    demoType: 'compound'
  },
  {
    id: 'glute-bridge',
    name: 'Glute Bridge / Hip Thrust',
    targetMuscle: 'Glutes',
    secondaryMuscles: ['Legs', 'Core'],
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    instructions: [
      'Lie flat on back with knees bent at 90 degrees and feet flat on floor.',
      'Drive through your heels to elevate hips until hips, knees, and shoulders form a straight line.',
      'Squeeze glutes maximally for 2 seconds at the top before descending.'
    ],
    formTips: ['Tuck your pelvis and avoid hyperextending your lumbar spine at top.'],
    commonMistakes: ['Pushing from toes or overarching lower spine.'],
    caloriesPerMinute: 5,
    demoType: 'lower'
  },
  {
    id: 'bulgarian-split-squat',
    name: 'Bulgarian Split Squat',
    targetMuscle: 'Legs',
    secondaryMuscles: ['Glutes', 'Core'],
    equipment: 'Dumbbells',
    difficulty: 'Advanced',
    instructions: [
      'Elevate your back foot on a bench or sturdy chair roughly knee-height.',
      'Hop front foot forward so you can descend into a deep single-leg squat.',
      'Lower torso until front thigh is parallel, driving back up through front heel.'
    ],
    formTips: ['Lean torso slightly forward to recruit glute max.'],
    commonMistakes: ['Standing too close to bench jamming front knee.'],
    caloriesPerMinute: 8,
    demoType: 'lower'
  },

  // ARMS (BICEPS & TRICEPS)
  {
    id: 'dumbbell-bicep-curl',
    name: 'Dumbbell Bicep Curl',
    targetMuscle: 'Biceps',
    secondaryMuscles: ['Core'],
    equipment: 'Dumbbells',
    difficulty: 'Beginner',
    instructions: [
      'Stand with dumbbells at sides, palms facing inward.',
      'Supinate wrists (turn palms up) as you curl dumbbells toward shoulders.',
      'Squeeze biceps hard at top contraction and lower slowly over 2 seconds.'
    ],
    formTips: ['Keep elbows pinned to ribcage without swinging elbows forward.'],
    commonMistakes: ['Rocking hips to swing weights up.'],
    caloriesPerMinute: 5,
    demoType: 'upper'
  },
  {
    id: 'overhead-tricep-extension',
    name: 'Dumbbell Overhead Tricep Extension',
    targetMuscle: 'Triceps',
    secondaryMuscles: ['Core'],
    equipment: 'Dumbbells',
    difficulty: 'Beginner',
    instructions: [
      'Hold one dumbbell with both hands overhead, arms extended.',
      'Keeping upper arms perpendicular to floor, bend elbows to lower weight behind head.',
      'Press dumbbell back to full lockout, feeling triceps contract.'
    ],
    formTips: ['Keep elbows pointed forward rather than flared wide.'],
    commonMistakes: ['Dropping chin into chest.'],
    caloriesPerMinute: 5,
    demoType: 'upper'
  },
  {
    id: 'bench-dips',
    name: 'Bench Tricep Dips',
    targetMuscle: 'Triceps',
    secondaryMuscles: ['Chest', 'Shoulders'],
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    instructions: [
      'Sit on edge of a chair or bench, hands placed adjacent to hips.',
      'Slide hips off edge with legs straight or bent, bend elbows to 90 degrees.',
      'Press through palms to return to locked elbows.'
    ],
    formTips: ['Keep back skimming close to the bench to protect front shoulders.'],
    commonMistakes: ['Drifting hips too far away from bench.'],
    caloriesPerMinute: 6,
    demoType: 'upper'
  },

  // CORE
  {
    id: 'plank',
    name: 'Forearm Plank',
    targetMuscle: 'Core',
    secondaryMuscles: ['Shoulders', 'Glutes'],
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    instructions: [
      'Place forearms on floor with elbows directly under shoulders.',
      'Extend legs back on toes, body forming a rigid plank.',
      'Draw navel into spine, squeeze glutes, and hold steady while breathing smoothly.'
    ],
    formTips: ['Do not let hips sag or pike high in the air.'],
    commonMistakes: ['Holding breath.'],
    caloriesPerMinute: 5,
    demoType: 'core'
  },
  {
    id: 'bicycle-crunches',
    name: 'Bicycle Crunches',
    targetMuscle: 'Core',
    secondaryMuscles: ['Legs'],
    equipment: 'Bodyweight',
    difficulty: 'Intermediate',
    instructions: [
      'Lie on back with hands lightly behind head and legs lifted at 90 degrees.',
      'Rotate torso bringing right elbow toward left knee while extending right leg.',
      'Alternate sides in a smooth, controlled pedal rhythm without pulling on neck.'
    ],
    formTips: ['Focus on rotating shoulder towards opposite knee, not just elbow.'],
    commonMistakes: ['Yanking neck forward with hands.'],
    caloriesPerMinute: 7,
    demoType: 'core'
  },
  {
    id: 'hanging-knee-raise',
    name: 'Hanging Leg / Knee Raise',
    targetMuscle: 'Core',
    secondaryMuscles: ['Back'],
    equipment: 'Pull-up Bar',
    difficulty: 'Intermediate',
    instructions: [
      'Hang from pull-up bar with arms straight and active shoulders.',
      'Curl knees up toward chest, curling pelvis upward to engage lower abdominals.',
      'Lower legs slowly without letting momentum swing your body.'
    ],
    formTips: ['Focus on posterior pelvic tilt at the top.'],
    commonMistakes: ['Swinging body back and forth like a pendulum.'],
    caloriesPerMinute: 7,
    demoType: 'core'
  },

  // CARDIO & HIIT
  {
    id: 'burpee',
    name: 'Full Burpee',
    targetMuscle: 'Cardio',
    secondaryMuscles: ['Chest', 'Legs', 'Core'],
    equipment: 'Bodyweight',
    difficulty: 'Intermediate',
    instructions: [
      'From standing, drop into a squat and place hands on floor.',
      'Kick feet back into a push-up position, drop chest to floor.',
      'Push up, jump feet forward toward hands, and explosively jump vertically clapping overhead.'
    ],
    formTips: ['Land softly on balls of feet absorbing impact.'],
    commonMistakes: ['Collapsing spine into hyperextension during kick back.'],
    caloriesPerMinute: 12,
    demoType: 'cardio'
  },
  {
    id: 'mountain-climbers',
    name: 'Mountain Climbers',
    targetMuscle: 'Cardio',
    secondaryMuscles: ['Core', 'Shoulders', 'Legs'],
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    instructions: [
      'Hold a solid push-up plank with hands under shoulders.',
      'Drive one knee quickly toward chest, then alternate legs in a running cadence.',
      'Keep hips level with shoulders without bouncing excessively.'
    ],
    formTips: ['Maintain continuous breathing and solid shoulder stability.'],
    commonMistakes: ['Bouncing hips way up into a pike.'],
    caloriesPerMinute: 10,
    demoType: 'cardio'
  },
  {
    id: 'jumping-jacks',
    name: 'Jumping Jacks',
    targetMuscle: 'Cardio',
    secondaryMuscles: ['Legs', 'Shoulders'],
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    instructions: [
      'Stand upright with arms at sides.',
      'Jump feet outward while raising arms overhead until hands touch.',
      'Jump back to starting stance in rhythmic cadence.'
    ],
    formTips: ['Land lightly with knees slightly unlocked.'],
    commonMistakes: ['Stiff-legged heavy landing.'],
    caloriesPerMinute: 8,
    demoType: 'cardio'
  },
  {
    id: 'kettlebell-swing',
    name: 'Kettlebell / Dumbbell Swing',
    targetMuscle: 'Full Body',
    secondaryMuscles: ['Glutes', 'Legs', 'Back', 'Core'],
    equipment: 'Kettlebell',
    difficulty: 'Intermediate',
    instructions: [
      'Hinge at hips with soft knees, holding kettlebell with both hands between legs.',
      'Snap hips forward with explosive glute drive, propelling bell up to chest height.',
      'Let bell guide hips back into hinge for next repetition.'
    ],
    formTips: ['Power comes 100% from hip thrust, not arm lifting.'],
    commonMistakes: ['Squatting instead of hinging.', 'Lifting bell with shoulders.'],
    caloriesPerMinute: 11,
    demoType: 'compound'
  },

  // ADVANCED LEVEL MASTER CLASS
  {
    id: 'pistol-squat',
    name: 'Pistol Squat (Single-Leg Mastery)',
    targetMuscle: 'Legs',
    secondaryMuscles: ['Glutes', 'Core'],
    equipment: 'Bodyweight',
    difficulty: 'Advanced',
    instructions: [
      'Balance on one leg with the opposite leg extended straight forward.',
      'Descend into a full single-leg squat while keeping extended leg hovering off the floor.',
      'Achieve full deep knee flexion, chest forward with arms balancing ahead.',
      'Drive with maximum force through heel and midfoot to ascend cleanly.'
    ],
    formTips: [
      'Keep ankle mobility warm; grip floor with toes for lateral balance.',
      'Squeeze core and extended quad tight to prevent leg from dropping.'
    ],
    commonMistakes: [
      'Heel lifting off ground during bottom turnaround.',
      'Collapsing chest down onto knee.'
    ],
    caloriesPerMinute: 11,
    demoType: 'lower'
  },
  {
    id: 'dragon-flag',
    name: 'Dragon Flag (Bruce Lee Core Lever)',
    targetMuscle: 'Core',
    secondaryMuscles: ['Back', 'Shoulders'],
    equipment: 'Bodyweight',
    difficulty: 'Advanced',
    instructions: [
      'Lie on a sturdy bench and grip bench edges tightly behind head.',
      'Drive entire body vertically upward balancing solely on upper shoulder blades.',
      'Keeping torso, hips, and legs in a locked rigid straight spear line, lower slowly under control.',
      'Hover 2 inches above bench before driving back up using pure anterior core strength.'
    ],
    formTips: [
      'Zero hip bending allowed: body remains straight as a steel rod.',
      'Focus intensely on a 3-second controlled eccentric descent.'
    ],
    commonMistakes: [
      'Bending at waist or piking hips to make the lever easier.'
    ],
    caloriesPerMinute: 10,
    demoType: 'core'
  },
  {
    id: 'handstand-pushup',
    name: 'Handstand Push-Up (Wall or Freestanding)',
    targetMuscle: 'Shoulders',
    secondaryMuscles: ['Triceps', 'Chest', 'Core'],
    equipment: 'Bodyweight',
    difficulty: 'Advanced',
    instructions: [
      'Kick up into a wall handstand with hands placed 6-8 inches from baseboard.',
      'Brace hollow body position with toes pointed and ribs pulled inward.',
      'Lower head diagonally forward toward fingertips creating a tripod position.',
      'Drive powerfully through palms and triceps back to full shoulder lockout overhead.'
    ],
    formTips: [
      'Do not flare elbows wide; angle forearms at 45 degrees like an overhead press.',
      'Maintain active shoulders pushing the floor away at top.'
    ],
    commonMistakes: [
      'Overarching lower back like a banana.',
      'Dropping crown of head flat between hands instead of tripod forward.'
    ],
    caloriesPerMinute: 11,
    demoType: 'upper'
  },
  {
    id: 'barbell-deadlift',
    name: 'Barbell Conventional Deadlift',
    targetMuscle: 'Back',
    secondaryMuscles: ['Legs', 'Glutes', 'Core'],
    equipment: 'Barbell & Plates',
    difficulty: 'Advanced',
    instructions: [
      'Step up to loaded barbell with shins 1 inch away, feet hip-width apart.',
      'Hinge at hips, grip bar just outside knees with overhand or hook grip.',
      'Pull chest proud, engage lats (protect armpits), and take slack out of the bar.',
      'Drive floor away through heels, locking hips and knees simultaneously at the top.'
    ],
    formTips: [
      'Treat the lift as pushing the earth away with your legs, not pulling with arms.',
      'Barbell path must remain strictly vertical skimming shins and thighs.'
    ],
    commonMistakes: [
      'Rounding lumbar spine under load.',
      'Hyperextending and leaning backward excessively at lockout.'
    ],
    caloriesPerMinute: 12,
    demoType: 'compound'
  },
  {
    id: 'deficit-bulgarian-squat',
    name: 'Weighted Deficit Bulgarian Split Squat',
    targetMuscle: 'Legs',
    secondaryMuscles: ['Glutes', 'Core'],
    equipment: 'Dumbbells',
    difficulty: 'Advanced',
    instructions: [
      'Elevate front foot on a 2-4 inch plate and rear foot on a bench.',
      'Hold heavy dumbbells in each hand with proud chest.',
      'Descend deeper than normal floor level, allowing knee to travel past parallel.',
      'Drive through front heel out of the deep deficit stretch.'
    ],
    formTips: [
      'Provides unprecedented glute and adductor stretch and hypertrophy.',
      'Slight forward torso lean (15 degrees) maximizes posterior chain recruitment.'
    ],
    commonMistakes: [
      'Losing balance due to stepping too narrow like a tightrope.'
    ],
    caloriesPerMinute: 10,
    demoType: 'lower'
  },
  {
    id: 'explosive-pullup',
    name: 'Explosive High Pull-Up / Chest-to-Bar',
    targetMuscle: 'Back',
    secondaryMuscles: ['Biceps', 'Shoulders', 'Core'],
    equipment: 'Pull-up Bar',
    difficulty: 'Advanced',
    instructions: [
      'Hang from bar with full extension and hollow body tension.',
      'Pull explosively driving elbows downward and back with maximum velocity.',
      'Accelerate until lower sternum or ribs make contact with the bar.',
      'Control the descent to absorb deceleration forces smoothly.'
    ],
    formTips: [
      'Key foundation for bar muscle-ups and explosive pulling power.',
      'Think of pulling the bar down to your waist in an arcing trajectory.'
    ],
    commonMistakes: [
      'Kipping wildly with excessive swing instead of strict explosive pull.'
    ],
    caloriesPerMinute: 11,
    demoType: 'upper'
  }
];
