import React, { useState, useEffect, useMemo } from 'react';
import { MuscleGroup } from '../types';
import { Play, Pause, Video, Activity, Sparkles, Wind, Eye, RotateCcw } from 'lucide-react';

interface ExerciseIllustrationProps {
  demoType: 'upper' | 'lower' | 'core' | 'cardio' | 'compound';
  targetMuscle: MuscleGroup;
  className?: string;
  isAnimated?: boolean;
  exerciseName?: string;
}

export const ExerciseIllustration: React.FC<ExerciseIllustrationProps> = ({
  demoType,
  targetMuscle,
  className = 'w-full h-56',
  isAnimated = true,
  exerciseName = '',
}) => {
  // Motion player states
  const [isPlaying, setIsPlaying] = useState<boolean>(isAnimated);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);
  const [viewAngle, setViewAngle] = useState<'profile' | 'front'>('profile');
  const [showAnatomyGlow, setShowAnatomyGlow] = useState<boolean>(true);
  const [repCount, setRepCount] = useState<number>(1);
  const [currentPhase, setCurrentPhase] = useState<'Eccentric (Lowering)' | 'Bottom Hold' | 'Concentric (Drive)' | 'Peak Lockout'>('Concentric (Drive)');
  const [breathCue, setBreathCue] = useState<'Inhale' | 'Exhale'>('Inhale');

  // Categorize specific exercise motion
  const exerciseMotionType = useMemo(() => {
    const name = (exerciseName || '').toLowerCase();
    if (name.includes('pistol')) return 'pistol_squat';
    if (name.includes('squat')) return 'squat';
    if (name.includes('push-up') || name.includes('push up') || name.includes('pushup')) return 'pushup';
    if (name.includes('pull-up') || name.includes('pull up') || name.includes('chin-up') || name.includes('chin up')) return 'pullup';
    if (name.includes('bench press') || name.includes('chest press')) return 'bench_press';
    if (name.includes('lunge') || name.includes('split squat')) return 'lunge';
    if (name.includes('curl')) return 'bicep_curl';
    if (name.includes('shoulder press') || name.includes('overhead press') || name.includes('military press')) return 'shoulder_press';
    if (name.includes('deadlift') || name.includes('romanian')) return 'deadlift';
    if (name.includes('plank')) return 'plank';
    if (name.includes('jumping jack') || name.includes('jacks')) return 'jumping_jacks';
    if (name.includes('burpee') || name.includes('mountain climber') || name.includes('climber')) return 'burpees';
    if (name.includes('dragon flag') || name.includes('crunch') || name.includes('twist') || name.includes('leg raise')) return 'core_crunch';

    // Fallbacks based on demoType
    if (demoType === 'lower') return 'squat';
    if (demoType === 'upper') return 'pushup';
    if (demoType === 'core') return 'core_crunch';
    if (demoType === 'cardio') return 'jumping_jacks';
    return 'deadlift';
  }, [exerciseName, demoType]);

  const cycleDuration = (2.8 / speedMultiplier).toFixed(2);

  // Synced phase and breath loop
  useEffect(() => {
    if (!isPlaying) return;
    const totalCycleMs = (2800 / speedMultiplier);
    const stepDuration = totalCycleMs / 4;
    const phases: Array<'Eccentric (Lowering)' | 'Bottom Hold' | 'Concentric (Drive)' | 'Peak Lockout'> = [
      'Eccentric (Lowering)',
      'Bottom Hold',
      'Concentric (Drive)',
      'Peak Lockout',
    ];
    let step = 0;

    const interval = setInterval(() => {
      step = (step + 1) % 4;
      setCurrentPhase(phases[step]);
      if (step === 0 || step === 1) {
        setBreathCue('Inhale');
      } else {
        setBreathCue('Exhale');
      }
      if (step === 3) {
        setRepCount((prev) => (prev >= 99 ? 1 : prev + 1));
      }
    }, stepDuration);

    return () => clearInterval(interval);
  }, [isPlaying, speedMultiplier]);

  // Colors
  const activeColor = '#10b981'; // emerald-500
  const cyanColor = '#06b6d4'; // cyan-500
  const neutralColor = '#64748b'; // slate-500
  const darkBone = '#1e293b'; // slate-800
  const highlightColor = showAnatomyGlow ? activeColor : neutralColor;

  return (
    <div className={`relative rounded-2xl overflow-hidden flex flex-col items-center justify-center border border-slate-800 bg-slate-950/95 shadow-2xl select-none group ${className}`}>
      {/* Studio Gym Ceiling Spotlight Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-950/30 via-slate-950/60 to-slate-950 pointer-events-none" />

      {/* Top HUD Video Motion Controls */}
      <div className="absolute top-2 left-2 right-2 z-20 flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/90 border border-slate-700/80 backdrop-blur-md shadow-lg">
          <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
          <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-slate-200 flex items-center gap-1">
            <Video className="w-3 h-3 text-emerald-400" />
            Motion Video
          </span>
          <span className="text-slate-600">•</span>
          <span className="text-[10px] text-emerald-400 font-mono font-bold">
            Rep #{repCount}
          </span>
        </div>

        {/* Video Player Controls (Speed, Play/Pause, Glow Toggle) */}
        <div className="flex items-center gap-1 bg-slate-900/90 border border-slate-700/80 rounded-full px-2 py-0.5 backdrop-blur-md shadow-lg">
          <button
            onClick={() => {
              const speeds = [0.75, 1, 1.25];
              const nextIndex = (speeds.indexOf(speedMultiplier) + 1) % speeds.length;
              setSpeedMultiplier(speeds[nextIndex]);
            }}
            className="text-[10px] font-mono font-bold text-slate-300 hover:text-white px-1.5 py-0.5 rounded transition cursor-pointer"
            title="Adjust Motion Speed"
          >
            {speedMultiplier}x
          </button>
          <span className="text-slate-700">|</span>
          <button
            onClick={() => setShowAnatomyGlow(!showAnatomyGlow)}
            className={`p-1 transition cursor-pointer ${showAnatomyGlow ? 'text-emerald-400' : 'text-slate-500'}`}
            title="Toggle Muscle Activation Glow"
          >
            <Sparkles className="w-3 h-3" />
          </button>
          <span className="text-slate-700">|</span>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-1 text-slate-300 hover:text-emerald-400 transition cursor-pointer"
            title={isPlaying ? 'Pause Motion' : 'Play Motion'}
          >
            {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 fill-current text-emerald-400" />}
          </button>
        </div>
      </div>

      {/* Real-Time Animated Kinematic Exercise Video (SVG 60 FPS) */}
      <svg
        viewBox="0 0 280 200"
        className="w-full h-full max-w-[320px] drop-shadow-2xl select-none relative z-10"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="glowPulseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={activeColor} stopOpacity="1" />
            <stop offset="100%" stopColor={cyanColor} stopOpacity="0.8" />
          </linearGradient>

          <linearGradient id="athleteBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#475569" />
            <stop offset="100%" stopColor="#1e293b" />
          </linearGradient>

          <filter id="neonBlur" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {/* DYNAMIC CSS KEYFRAMES FOR EACH WORKOUT MOTION */}
          <style>{`
            /* 1. SQUAT KINEMATICS: Hip & torso descent with knee flexion */
            @keyframes squatTorsoCycle {
              0% { transform: translateY(0px) rotate(0deg); }
              40% { transform: translateY(32px) rotate(8deg); }
              55% { transform: translateY(32px) rotate(8deg); }
              100% { transform: translateY(0px) rotate(0deg); }
            }
            @keyframes squatKneeCycle {
              0% { transform: scaleY(1); }
              40% { transform: scaleY(0.68); }
              55% { transform: scaleY(0.68); }
              100% { transform: scaleY(1); }
            }

            /* 2. PISTOL SQUAT KINEMATICS (ADVANCED SINGLE LEG): Deep single leg compression with forward leg */
            @keyframes pistolTorsoCycle {
              0% { transform: translateY(0px); }
              45% { transform: translateY(42px); }
              55% { transform: translateY(42px); }
              100% { transform: translateY(0px); }
            }
            @keyframes pistolExtendedLeg {
              0% { transform: rotate(0deg); }
              45% { transform: rotate(-22deg); }
              55% { transform: rotate(-22deg); }
              100% { transform: rotate(0deg); }
            }

            /* 3. PUSHUP KINEMATICS: Horizontal body lowering chest to floor */
            @keyframes pushupBodyHinge {
              0% { transform: rotate(0deg); }
              45% { transform: rotate(-14deg); }
              55% { transform: rotate(-14deg); }
              100% { transform: rotate(0deg); }
            }
            @keyframes pushupArmFlex {
              0% { transform: scaleY(1); }
              45% { transform: scaleY(0.5); }
              55% { transform: scaleY(0.5); }
              100% { transform: scaleY(1); }
            }

            /* 4. PULLUP KINEMATICS: Vertical body pulling up until chin clears bar */
            @keyframes pullupBodyTravel {
              0% { transform: translateY(28px); }
              45% { transform: translateY(0px); }
              60% { transform: translateY(0px); }
              100% { transform: translateY(28px); }
            }

            /* 5. BENCH PRESS KINEMATICS: Arms and barbell pressing up from chest */
            @keyframes benchPressArmTravel {
              0% { transform: translateY(22px); }
              45% { transform: translateY(0px); }
              60% { transform: translateY(0px); }
              100% { transform: translateY(22px); }
            }

            /* 6. LUNGE KINEMATICS: Torso lowering into 90-degree split stance */
            @keyframes lungeTorsoDescent {
              0% { transform: translateY(0px); }
              45% { transform: translateY(26px); }
              55% { transform: translateY(26px); }
              100% { transform: translateY(0px); }
            }

            /* 7. BICEP CURL KINEMATICS: Forearms and dumbbells curling up */
            @keyframes bicepForearmCurl {
              0% { transform: rotate(0deg); }
              45% { transform: rotate(-95deg); }
              60% { transform: rotate(-95deg); }
              100% { transform: rotate(0deg); }
            }

            /* 8. SHOULDER PRESS KINEMATICS: Pressing overhead */
            @keyframes shoulderPressTravel {
              0% { transform: translateY(20px); }
              45% { transform: translateY(-16px); }
              60% { transform: translateY(-16px); }
              100% { transform: translateY(20px); }
            }

            /* 9. DEADLIFT KINEMATICS: Hip hinge posterior chain */
            @keyframes deadliftHipHinge {
              0% { transform: rotate(0deg); }
              45% { transform: rotate(-44deg); }
              55% { transform: rotate(-44deg); }
              100% { transform: rotate(0deg); }
            }
            @keyframes deadliftBarTravel {
              0% { transform: translateY(0px); }
              45% { transform: translateY(32px); }
              55% { transform: translateY(32px); }
              100% { transform: translateY(0px); }
            }

            /* 10. PLANK KINEMATICS: Rigid core hold with micro tension breathing */
            @keyframes plankCoreTension {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(-2px); }
            }

            /* 11. JUMPING JACKS KINEMATICS */
            @keyframes jackArms {
              0% { transform: rotate(0deg); }
              50% { transform: rotate(-135deg); }
              100% { transform: rotate(0deg); }
            }
            @keyframes jackLegLeft {
              0% { transform: rotate(0deg); }
              50% { transform: rotate(-24deg); }
              100% { transform: rotate(0deg); }
            }
            @keyframes jackLegRight {
              0% { transform: rotate(0deg); }
              50% { transform: rotate(24deg); }
              100% { transform: rotate(0deg); }
            }

            /* 12. BURPEES / MOUNTAIN CLIMBERS */
            @keyframes burpeeLegSprint1 {
              0% { transform: translateX(0px); }
              50% { transform: translateX(24px) translateY(-12px); }
              100% { transform: translateX(0px); }
            }
            @keyframes burpeeLegSprint2 {
              0% { transform: translateX(24px) translateY(-12px); }
              50% { transform: translateX(0px); }
              100% { transform: translateX(24px) translateY(-12px); }
            }

            /* Muscle activation glow pulse */
            @keyframes activeMusclePulse {
              0%, 100% { opacity: 0.7; filter: drop-shadow(0 0 2px ${activeColor}); }
              50% { opacity: 1; filter: drop-shadow(0 0 8px ${activeColor}); }
            }

            .m-pulse {
              animation: activeMusclePulse ${cycleDuration}s ease-in-out infinite;
              animation-play-state: ${isPlaying ? 'running' : 'paused'};
            }
          `}</style>
        </defs>

        {/* Studio Floor Platform & Grid Depth Guidance */}
        <ellipse cx="140" cy="175" rx="90" ry="12" fill="#030712" opacity="0.8" />
        <line x1="30" y1="175" x2="250" y2="175" stroke="#1e293b" strokeWidth="2" strokeDasharray="5 5" />

        {/* ============================================================ */}
        {/* CASE 1: SQUAT (BODYWEIGHT / GOBLET / JUMP SQUAT)              */}
        {/* ============================================================ */}
        {exerciseMotionType === 'squat' && (
          <g>
            {/* Torso & Head lowering */}
            <g
              style={{
                transformOrigin: '140px 165px',
                animation: `squatTorsoCycle ${cycleDuration}s ease-in-out infinite`,
                animationPlayState: isPlaying ? 'running' : 'paused',
              }}
            >
              {/* Head */}
              <circle cx="130" cy="65" r="14" fill="url(#athleteBodyGrad)" stroke={neutralColor} strokeWidth="2.5" />
              {/* Torso / Spine */}
              <path d="M 130 80 L 142 120" stroke={neutralColor} strokeWidth="9" strokeLinecap="round" />
              {/* Outstretched Arms for Balance */}
              <path d="M 130 85 L 165 92" stroke="#94a3b8" strokeWidth="6" strokeLinecap="round" />
              {/* Core / Glute Glow */}
              <path
                d="M 130 85 L 142 120"
                stroke={highlightColor}
                strokeWidth="9"
                strokeLinecap="round"
                filter={showAnatomyGlow ? 'url(#neonBlur)' : undefined}
                className="m-pulse"
              />
            </g>

            {/* Knees & Quads flexing into 90-degree depth */}
            <g
              style={{
                transformOrigin: '140px 175px',
                animation: `squatKneeCycle ${cycleDuration}s ease-in-out infinite`,
                animationPlayState: isPlaying ? 'running' : 'paused',
              }}
            >
              {/* Quads */}
              <path
                d="M 142 120 L 115 138 L 132 175 L 148 175"
                stroke={highlightColor}
                strokeWidth="9"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter={showAnatomyGlow ? 'url(#neonBlur)' : undefined}
                className="m-pulse"
              />
            </g>

            {/* Depth Guideline Arc */}
            <path d="M 100 138 Q 115 152 140 148" stroke={cyanColor} strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
            <text x="75" y="142" fill="#67e8f9" fontSize="9" fontFamily="monospace" fontWeight="bold">90° DEPTH</text>
          </g>
        )}

        {/* ============================================================ */}
        {/* CASE 2: PISTOL SQUAT (ADVANCED SINGLE LEG)                    */}
        {/* ============================================================ */}
        {exerciseMotionType === 'pistol_squat' && (
          <g>
            <g
              style={{
                transformOrigin: '140px 175px',
                animation: `pistolTorsoCycle ${cycleDuration}s ease-in-out infinite`,
                animationPlayState: isPlaying ? 'running' : 'paused',
              }}
            >
              {/* Head */}
              <circle cx="120" cy="55" r="14" fill="url(#athleteBodyGrad)" stroke={neutralColor} strokeWidth="2.5" />
              {/* Torso */}
              <path d="M 120 70 L 128 115" stroke={neutralColor} strokeWidth="9" strokeLinecap="round" />
              {/* Arms counter-balancing forward */}
              <path d="M 122 75 L 175 75" stroke="#94a3b8" strokeWidth="6" strokeLinecap="round" />

              {/* Standing Working Leg (Deep compression) */}
              <path
                d="M 128 115 L 98 140 L 115 175 L 130 175"
                stroke={highlightColor}
                strokeWidth="9.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter={showAnatomyGlow ? 'url(#neonBlur)' : undefined}
                className="m-pulse"
              />

              {/* Extended Leg (Held horizontally in air) */}
              <g
                style={{
                  transformOrigin: '128px 115px',
                  animation: `pistolExtendedLeg ${cycleDuration}s ease-in-out infinite`,
                  animationPlayState: isPlaying ? 'running' : 'paused',
                }}
              >
                <path d="M 128 115 L 180 120 L 195 125" stroke="#06b6d4" strokeWidth="8" strokeLinecap="round" />
                <circle cx="195" cy="125" r="4" fill="#67e8f9" />
              </g>
            </g>
            <text x="175" y="112" fill="#67e8f9" fontSize="9" fontFamily="monospace" fontWeight="bold">EXTENDED LEG</text>
          </g>
        )}

        {/* ============================================================ */}
        {/* CASE 3: PUSH-UP / CHEST DIPS                                  */}
        {/* ============================================================ */}
        {exerciseMotionType === 'pushup' && (
          <g>
            {/* Ground Push-up Mat */}
            <line x1="40" y1="165" x2="240" y2="165" stroke="#334155" strokeWidth="4" strokeLinecap="round" />

            {/* Whole Body Hinged from Toes (x: 205, y: 162) */}
            <g
              style={{
                transformOrigin: '205px 162px',
                animation: `pushupBodyHinge ${cycleDuration}s ease-in-out infinite`,
                animationPlayState: isPlaying ? 'running' : 'paused',
              }}
            >
              {/* Head */}
              <circle cx="85" cy="118" r="14" fill="url(#athleteBodyGrad)" stroke={neutralColor} strokeWidth="2.5" />
              {/* Torso & Legs Rigid Plank Line */}
              <path
                d="M 98 126 L 150 138 L 205 162"
                stroke={neutralColor}
                strokeWidth="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Active Chest & Triceps Glow */}
              <path
                d="M 98 126 L 140 135"
                stroke={highlightColor}
                strokeWidth="11"
                strokeLinecap="round"
                filter={showAnatomyGlow ? 'url(#neonBlur)' : undefined}
                className="m-pulse"
              />
            </g>

            {/* Arms Flexing from Hands on Ground (x: 105, y: 165) */}
            <g
              style={{
                transformOrigin: '105px 165px',
                animation: `pushupArmFlex ${cycleDuration}s ease-in-out infinite`,
                animationPlayState: isPlaying ? 'running' : 'paused',
              }}
            >
              <path
                d="M 105 165 L 98 135 L 110 125"
                stroke={highlightColor}
                strokeWidth="7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>

            <text x="80" y="185" fill="#a7f3d0" fontSize="9" fontFamily="monospace" fontWeight="bold">CHEST HOVER CUE</text>
          </g>
        )}

        {/* ============================================================ */}
        {/* CASE 4: PULL-UP / CHIN-UP                                    */}
        {/* ============================================================ */}
        {exerciseMotionType === 'pullup' && (
          <g>
            {/* Pull-Up Bar Overhead */}
            <line x1="60" y1="42" x2="220" y2="42" stroke="#94a3b8" strokeWidth="6" strokeLinecap="round" />
            <rect x="50" y="36" width="10" height="12" fill="#475569" rx="2" />
            <rect x="220" y="36" width="10" height="12" fill="#475569" rx="2" />

            {/* Athlete Body Lifting Vertically */}
            <g
              style={{
                animation: `pullupBodyTravel ${cycleDuration}s ease-in-out infinite`,
                animationPlayState: isPlaying ? 'running' : 'paused',
              }}
            >
              {/* Hands Gripping Bar */}
              <circle cx="115" cy="42" r="4.5" fill="#cbd5e1" />
              <circle cx="165" cy="42" r="4.5" fill="#cbd5e1" />

              {/* Arms pulling up */}
              <path d="M 115 42 L 126 62 L 132 72" stroke="#94a3b8" strokeWidth="6" strokeLinecap="round" />
              <path d="M 165 42 L 154 62 L 148 72" stroke="#94a3b8" strokeWidth="6" strokeLinecap="round" />

              {/* Head */}
              <circle cx="140" cy="58" r="14" fill="url(#athleteBodyGrad)" stroke={neutralColor} strokeWidth="2.5" />

              {/* Back / Lats V-Taper (Firing & Glowing) */}
              <path
                d="M 125 72 L 155 72 L 148 115 L 132 115 Z"
                fill={showAnatomyGlow ? 'url(#glowPulseGrad)' : 'url(#athleteBodyGrad)'}
                stroke={highlightColor}
                strokeWidth="2.5"
                filter={showAnatomyGlow ? 'url(#neonBlur)' : undefined}
                className="m-pulse"
              />

              {/* Legs hanging with knees slightly bent */}
              <path d="M 136 115 L 134 155 L 142 165" stroke="#475569" strokeWidth="7" strokeLinecap="round" />
              <path d="M 144 115 L 146 155 L 154 165" stroke="#475569" strokeWidth="7" strokeLinecap="round" />
            </g>
            <text x="105" y="30" fill="#6ee7b7" fontSize="9" fontFamily="monospace" fontWeight="bold">CHIN OVER BAR</text>
          </g>
        )}

        {/* ============================================================ */}
        {/* CASE 5: BENCH PRESS / DUMBBELL PRESS                         */}
        {/* ============================================================ */}
        {exerciseMotionType === 'bench_press' && (
          <g>
            {/* Workout Flat Bench */}
            <rect x="70" y="130" width="140" height="14" rx="4" fill="#334155" />
            <rect x="85" y="144" width="8" height="30" fill="#1e293b" />
            <rect x="185" y="144" width="8" height="30" fill="#1e293b" />

            {/* Supine Athlete Body */}
            <circle cx="95" cy="120" r="13" fill="url(#athleteBodyGrad)" stroke={neutralColor} strokeWidth="2" />
            <path d="M 105 125 L 180 125" stroke={neutralColor} strokeWidth="12" strokeLinecap="round" />
            {/* Feet planted on floor */}
            <path d="M 175 125 L 185 150 L 195 174" stroke="#475569" strokeWidth="6" strokeLinecap="round" />

            {/* Chest Glow */}
            <path
              d="M 115 125 L 145 125"
              stroke={highlightColor}
              strokeWidth="14"
              strokeLinecap="round"
              filter={showAnatomyGlow ? 'url(#neonBlur)' : undefined}
              className="m-pulse"
            />

            {/* Pressing Arms & Barbell Vertical Travel */}
            <g
              style={{
                animation: `benchPressArmTravel ${cycleDuration}s ease-in-out infinite`,
                animationPlayState: isPlaying ? 'running' : 'paused',
              }}
            >
              {/* Left & Right Arm Lines */}
              <path d="M 125 125 L 125 85" stroke="#94a3b8" strokeWidth="6.5" strokeLinecap="round" />
              <path d="M 145 125 L 145 85" stroke="#94a3b8" strokeWidth="6.5" strokeLinecap="round" />

              {/* Barbell Bar */}
              <line x1="80" y1="85" x2="190" y2="85" stroke="#cbd5e1" strokeWidth="4" strokeLinecap="round" />
              {/* Weight Plates */}
              <rect x="76" y="75" width="8" height="20" rx="2" fill="#06b6d4" />
              <rect x="186" y="75" width="8" height="20" rx="2" fill="#06b6d4" />
            </g>
            <text x="110" y="70" fill="#67e8f9" fontSize="9" fontFamily="monospace" fontWeight="bold">CONCENTRIC DRIVE</text>
          </g>
        )}

        {/* ============================================================ */}
        {/* CASE 6: LUNGE / BULGARIAN SPLIT SQUAT                        */}
        {/* ============================================================ */}
        {exerciseMotionType === 'lunge' && (
          <g>
            <g
              style={{
                transformOrigin: '140px 175px',
                animation: `lungeTorsoDescent ${cycleDuration}s ease-in-out infinite`,
                animationPlayState: isPlaying ? 'running' : 'paused',
              }}
            >
              {/* Head */}
              <circle cx="130" cy="65" r="14" fill="url(#athleteBodyGrad)" stroke={neutralColor} strokeWidth="2.5" />
              {/* Upright Torso */}
              <path d="M 130 80 L 130 120" stroke={neutralColor} strokeWidth="9" strokeLinecap="round" />
              {/* Arms on Hips / Holding Dumbbells */}
              <path d="M 130 85 L 120 105 L 128 115" stroke="#94a3b8" strokeWidth="5" strokeLinecap="round" />

              {/* Front Leg (Stepping forward, bending to 90°) */}
              <path
                d="M 130 120 L 165 140 L 162 175 L 175 175"
                stroke={highlightColor}
                strokeWidth="8.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter={showAnatomyGlow ? 'url(#neonBlur)' : undefined}
                className="m-pulse"
              />

              {/* Back Leg (Knee dipping near floor) */}
              <path
                d="M 130 120 L 95 142 L 95 172 L 85 172"
                stroke="#64748b"
                strokeWidth="8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
            <text x="155" y="132" fill="#a7f3d0" fontSize="9" fontFamily="monospace" fontWeight="bold">90° FRONT KNEE</text>
          </g>
        )}

        {/* ============================================================ */}
        {/* CASE 7: BICEP CURL / HAMMER CURL                            */}
        {/* ============================================================ */}
        {exerciseMotionType === 'bicep_curl' && (
          <g>
            {/* Standing Athlete */}
            <circle cx="140" cy="55" r="14" fill="url(#athleteBodyGrad)" stroke={neutralColor} strokeWidth="2.5" />
            {/* Torso */}
            <path d="M 140 70 L 140 125" stroke={neutralColor} strokeWidth="10" strokeLinecap="round" />
            {/* Upper Arm Locked at side */}
            <path d="M 140 75 L 132 105" stroke="#94a3b8" strokeWidth="6" strokeLinecap="round" />
            {/* Bicep Muscle Belly (Glowing on contraction) */}
            <circle
              cx="133"
              cy="95"
              r="7"
              fill={showAnatomyGlow ? activeColor : neutralColor}
              filter={showAnatomyGlow ? 'url(#neonBlur)' : undefined}
              className="m-pulse"
            />

            {/* Forearm & Dumbbell Curling Upwards */}
            <g
              style={{
                transformOrigin: '132px 105px',
                animation: `bicepForearmCurl ${cycleDuration}s ease-in-out infinite`,
                animationPlayState: isPlaying ? 'running' : 'paused',
              }}
            >
              <path d="M 132 105 L 132 138" stroke="#cbd5e1" strokeWidth="5.5" strokeLinecap="round" />
              {/* Dumbbell */}
              <g transform="translate(132, 142)">
                <rect x="-12" y="-5" width="24" height="10" rx="3" fill="#06b6d4" />
                <line x1="-15" y1="0" x2="15" y2="0" stroke="#f1f5f9" strokeWidth="3" />
              </g>
            </g>

            {/* Legs standing stable */}
            <path d="M 135 125 L 128 175 L 120 175" stroke="#475569" strokeWidth="7" strokeLinecap="round" />
            <path d="M 145 125 L 152 175 L 160 175" stroke="#475569" strokeWidth="7" strokeLinecap="round" />
            <text x="145" y="98" fill="#6ee7b7" fontSize="9" fontFamily="monospace" fontWeight="bold">PEAK SQUEEZE</text>
          </g>
        )}

        {/* ============================================================ */}
        {/* CASE 8: SHOULDER PRESS / OVERHEAD PRESS                      */}
        {/* ============================================================ */}
        {exerciseMotionType === 'shoulder_press' && (
          <g>
            <circle cx="140" cy="70" r="14" fill="url(#athleteBodyGrad)" stroke={neutralColor} strokeWidth="2.5" />
            <path d="M 140 85 L 140 135" stroke={neutralColor} strokeWidth="10" strokeLinecap="round" />
            {/* Deltoids Glow */}
            <circle
              cx="124"
              cy="88"
              r="7"
              fill={showAnatomyGlow ? activeColor : neutralColor}
              filter={showAnatomyGlow ? 'url(#neonBlur)' : undefined}
              className="m-pulse"
            />
            <circle
              cx="156"
              cy="88"
              r="7"
              fill={showAnatomyGlow ? activeColor : neutralColor}
              filter={showAnatomyGlow ? 'url(#neonBlur)' : undefined}
              className="m-pulse"
            />

            {/* Arms & Weights Moving Overhead */}
            <g
              style={{
                animation: `shoulderPressTravel ${cycleDuration}s ease-in-out infinite`,
                animationPlayState: isPlaying ? 'running' : 'paused',
              }}
            >
              {/* Left Arm */}
              <path d="M 124 88 L 110 65 L 110 45" stroke="#94a3b8" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
              <rect x="98" y="38" width="24" height="10" rx="3" fill="#06b6d4" />

              {/* Right Arm */}
              <path d="M 156 88 L 170 65 L 170 45" stroke="#94a3b8" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
              <rect x="158" y="38" width="24" height="10" rx="3" fill="#06b6d4" />
            </g>

            {/* Stable Legs */}
            <path d="M 134 135 L 126 175 L 115 175" stroke="#475569" strokeWidth="7" strokeLinecap="round" />
            <path d="M 146 135 L 154 175 L 165 175" stroke="#475569" strokeWidth="7" strokeLinecap="round" />
            <text x="110" y="28" fill="#67e8f9" fontSize="9" fontFamily="monospace" fontWeight="bold">OVERHEAD LOCKOUT</text>
          </g>
        )}

        {/* ============================================================ */}
        {/* CASE 9: DEADLIFT / ROMANIAN DEADLIFT                         */}
        {/* ============================================================ */}
        {exerciseMotionType === 'deadlift' && (
          <g>
            {/* Lower legs / Shin contact */}
            <path d="M 150 115 L 152 145 L 150 175" stroke="#475569" strokeWidth="8" strokeLinecap="round" />

            {/* Hamstrings & Glutes (Posterior Chain Glow) */}
            <path
              d="M 135 110 L 152 145"
              stroke={highlightColor}
              strokeWidth="10"
              strokeLinecap="round"
              filter={showAnatomyGlow ? 'url(#neonBlur)' : undefined}
              className="m-pulse"
            />

            {/* Hinged Upper Torso & Spine */}
            <g
              style={{
                transformOrigin: '135px 110px',
                animation: `deadliftHipHinge ${cycleDuration}s ease-in-out infinite`,
                animationPlayState: isPlaying ? 'running' : 'paused',
              }}
            >
              <circle cx="85" cy="72" r="14" fill="url(#athleteBodyGrad)" stroke={neutralColor} strokeWidth="2.5" />
              <path d="M 95 85 L 135 110" stroke={neutralColor} strokeWidth="9" strokeLinecap="round" />
            </g>

            {/* Hanging Arms & Barbell Vertical Travel */}
            <g
              style={{
                animation: `deadliftBarTravel ${cycleDuration}s ease-in-out infinite`,
                animationPlayState: isPlaying ? 'running' : 'paused',
              }}
            >
              <path d="M 100 88 L 125 145" stroke="#94a3b8" strokeWidth="5.5" strokeLinecap="round" />
              {/* Barbell Weight */}
              <g transform="translate(125, 148)">
                <circle cx="0" cy="0" r="12" fill="#06b6d4" stroke="#ffffff" strokeWidth="2.5" />
                <line x1="-20" y1="0" x2="20" y2="0" stroke="#cbd5e1" strokeWidth="4" />
              </g>
              {/* Trajectory Guide */}
              <line x1="125" y1="120" x2="125" y2="155" stroke={activeColor} strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
            </g>
            <text x="80" y="165" fill="#a7f3d0" fontSize="9" fontFamily="monospace" fontWeight="bold">POSTERIOR HINGE</text>
          </g>
        )}

        {/* ============================================================ */}
        {/* CASE 10: PLANK (CORE ISOMETRIC HOLD)                         */}
        {/* ============================================================ */}
        {exerciseMotionType === 'plank' && (
          <g>
            <line x1="50" y1="165" x2="230" y2="165" stroke="#334155" strokeWidth="3" strokeDasharray="6 4" />
            {/* Forearm Plant on Ground */}
            <path d="M 85 135 L 85 165 L 105 165" stroke="#64748b" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />

            {/* Rigid Body Line */}
            <g
              style={{
                animation: `plankCoreTension 1.2s ease-in-out infinite`,
                animationPlayState: isPlaying ? 'running' : 'paused',
              }}
            >
              <circle cx="70" cy="122" r="13" fill="url(#athleteBodyGrad)" stroke={neutralColor} strokeWidth="2.5" />
              <path d="M 82 130 L 155 142 L 205 165" stroke={neutralColor} strokeWidth="10" strokeLinecap="round" />
              {/* Core Abdominal Wall Pulsing with Tension */}
              <path
                d="M 95 132 L 150 142"
                stroke={highlightColor}
                strokeWidth="11"
                strokeLinecap="round"
                filter={showAnatomyGlow ? 'url(#neonBlur)' : undefined}
                className="m-pulse"
              />
            </g>
            <text x="110" y="122" fill="#6ee7b7" fontSize="9" fontFamily="monospace" fontWeight="bold">RIGID BRACED CORE</text>
          </g>
        )}

        {/* ============================================================ */}
        {/* CASE 11: JUMPING JACKS (CARDIO CALISTHENICS)                 */}
        {/* ============================================================ */}
        {exerciseMotionType === 'jumping_jacks' && (
          <g>
            <circle cx="140" cy="60" r="14" fill="url(#athleteBodyGrad)" stroke={neutralColor} strokeWidth="2.5" />
            <path d="M 140 75 L 140 120" stroke={neutralColor} strokeWidth="9" strokeLinecap="round" />

            {/* Left & Right Jack Arms */}
            <g
              style={{
                transformOrigin: '140px 80px',
                animation: `jackArms ${cycleDuration}s ease-in-out infinite`,
                animationPlayState: isPlaying ? 'running' : 'paused',
              }}
            >
              <path d="M 140 80 L 105 110" stroke="#94a3b8" strokeWidth="6" strokeLinecap="round" />
            </g>
            <g
              style={{
                transformOrigin: '140px 80px',
                animation: `jackArms ${cycleDuration}s ease-in-out infinite reverse`,
                animationPlayState: isPlaying ? 'running' : 'paused',
              }}
            >
              <path d="M 140 80 L 175 110" stroke="#94a3b8" strokeWidth="6" strokeLinecap="round" />
            </g>

            {/* Left & Right Jack Legs */}
            <g
              style={{
                transformOrigin: '140px 120px',
                animation: `jackLegLeft ${cycleDuration}s ease-in-out infinite`,
                animationPlayState: isPlaying ? 'running' : 'paused',
              }}
            >
              <path d="M 140 120 L 125 172 L 115 172" stroke={highlightColor} strokeWidth="7.5" strokeLinecap="round" />
            </g>
            <g
              style={{
                transformOrigin: '140px 120px',
                animation: `jackLegRight ${cycleDuration}s ease-in-out infinite`,
                animationPlayState: isPlaying ? 'running' : 'paused',
              }}
            >
              <path d="M 140 120 L 155 172 L 165 172" stroke={highlightColor} strokeWidth="7.5" strokeLinecap="round" />
            </g>
            <text x="100" y="45" fill="#67e8f9" fontSize="9" fontFamily="monospace" fontWeight="bold">CARDIO EXPLOSION</text>
          </g>
        )}

        {/* ============================================================ */}
        {/* CASE 12: BURPEES / MOUNTAIN CLIMBERS (HIGH-VELOCITY SPRINT)   */}
        {/* ============================================================ */}
        {exerciseMotionType === 'burpees' && (
          <g>
            <line x1="50" y1="170" x2="230" y2="170" stroke="#334155" strokeWidth="3" />
            {/* Athlete Planted Hands */}
            <circle cx="105" cy="115" r="13" fill="url(#athleteBodyGrad)" stroke={neutralColor} strokeWidth="2.5" />
            <path d="M 115 125 L 145 135" stroke={neutralColor} strokeWidth="8" strokeLinecap="round" />
            <path d="M 115 125 L 110 170" stroke="#94a3b8" strokeWidth="6.5" strokeLinecap="round" />

            {/* Alternating Piston Legs Cycling */}
            <g
              style={{
                animation: `burpeeLegSprint1 ${Number(cycleDuration) * 0.45}s ease-in-out infinite`,
                animationPlayState: isPlaying ? 'running' : 'paused',
              }}
            >
              <path
                d="M 145 135 L 120 152 L 135 170"
                stroke={highlightColor}
                strokeWidth="8"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter={showAnatomyGlow ? 'url(#neonBlur)' : undefined}
                className="m-pulse"
              />
            </g>
            <g
              style={{
                animation: `burpeeLegSprint2 ${Number(cycleDuration) * 0.45}s ease-in-out infinite`,
                animationPlayState: isPlaying ? 'running' : 'paused',
              }}
            >
              <path d="M 145 135 L 180 152 L 200 170" stroke="#64748b" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
            </g>
            <text x="140" y="115" fill="#f43f5e" fontSize="9" fontFamily="monospace" fontWeight="bold">ANAEROBIC SPRINT</text>
          </g>
        )}

        {/* ============================================================ */}
        {/* CASE 13: CORE CRUNCH / DRAGON FLAG                           */}
        {/* ============================================================ */}
        {exerciseMotionType === 'core_crunch' && (
          <g>
            <line x1="50" y1="155" x2="230" y2="155" stroke="#334155" strokeWidth="3" strokeDasharray="6 4" />
            {/* Stable Upper Back & Head Base on Floor */}
            <circle cx="85" cy="142" r="13" fill="url(#athleteBodyGrad)" stroke={neutralColor} strokeWidth="2.5" />
            <path d="M 85 148 L 105 148" stroke="#64748b" strokeWidth="8" strokeLinecap="round" />

            {/* Dragon Flag / Crunch Raising Torso & Legs */}
            <g
              style={{
                transformOrigin: '105px 148px',
                animation: `squatTorsoCycle ${cycleDuration}s ease-in-out infinite`,
                animationPlayState: isPlaying ? 'running' : 'paused',
              }}
            >
              {/* Abdominal Wall Active */}
              <path
                d="M 105 148 L 155 132 L 205 120"
                stroke={highlightColor}
                strokeWidth="9"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter={showAnatomyGlow ? 'url(#neonBlur)' : undefined}
                className="m-pulse"
              />
            </g>
            <text x="120" y="110" fill="#6ee7b7" fontSize="9" fontFamily="monospace" fontWeight="bold">ABDOMINAL TENSION</text>
          </g>
        )}

        {/* Active Target Muscle Badge Inside Video Frame */}
        <g transform="translate(12, 22)">
          <rect x="0" y="0" width="85" height="22" rx="11" fill="#0f172a" stroke="#1e293b" strokeWidth="1" />
          <circle cx="10" cy="11" r="4" fill={activeColor} />
          <text x="20" y="15" fill="#f8fafc" fontSize="10" fontWeight="bold" fontFamily="sans-serif">
            {targetMuscle}
          </text>
        </g>
      </svg>

      {/* Bottom Video HUD Telemetry Bar */}
      <div className="absolute bottom-2 left-2 right-2 z-20 flex items-center justify-between text-[10px] font-mono pointer-events-auto">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-900/90 border border-slate-800 backdrop-blur-md text-slate-300">
          <Activity className="w-3 h-3 text-emerald-400" />
          <span>Phase:</span>
          <span className="font-bold text-white uppercase">{currentPhase}</span>
        </div>

        {/* Breathing Guide Cue */}
        <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-900/90 border border-slate-800 backdrop-blur-md text-slate-300">
          <Wind className={`w-3 h-3 ${breathCue === 'Inhale' ? 'text-cyan-400' : 'text-emerald-400'}`} />
          <span className="text-slate-400">Breath:</span>
          <strong className={breathCue === 'Inhale' ? 'text-cyan-300' : 'text-emerald-300'}>
            {breathCue}
          </strong>
        </div>

        <div className="hidden sm:block px-2.5 py-1 rounded-xl bg-slate-900/90 border border-slate-800 backdrop-blur-md text-slate-400">
          Tempo: <strong className="text-emerald-400 font-bold">{cycleDuration}s</strong>
        </div>
      </div>
    </div>
  );
};
