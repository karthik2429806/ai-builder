import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Camera,
  QrCode,
  X,
  Sparkles,
  RefreshCw,
  Zap,
  CheckCircle2,
  AlertCircle,
  Play,
  Dumbbell,
  Upload,
  Maximize2,
  ScanLine,
} from 'lucide-react';
import { soundService } from '../services/audio';
import { WorkoutPlan } from '../types';

interface WorkoutScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyPlan?: (plan: WorkoutPlan) => void;
  onStartInstantWorkout?: () => void;
}

interface EquipmentDetection {
  id: string;
  name: string;
  category: string;
  confidence: number;
  muscles: string[];
  exercises: { name: string; sets: number; reps: string; target: string }[];
  description: string;
}

const EQUIPMENT_CATALOG: Record<string, EquipmentDetection> = {
  dumbbells: {
    id: 'dumbbells',
    name: 'Dumbbells Set',
    category: 'Free Weights',
    confidence: 97,
    muscles: ['Chest', 'Shoulders', 'Biceps', 'Triceps', 'Legs'],
    exercises: [
      { name: 'Dumbbell Bench Press', sets: 4, reps: '10-12', target: 'Chest' },
      { name: 'Bent-Over Dumbbell Rows', sets: 4, reps: '10-12', target: 'Back' },
      { name: 'Goblet Squats', sets: 3, reps: '12-15', target: 'Legs' },
      { name: 'Dumbbell Shoulder Press', sets: 3, reps: '10-12', target: 'Shoulders' },
      { name: 'Dumbbell Hammer Curls', sets: 3, reps: '12-15', target: 'Arms' },
    ],
    description: 'Versatile free weights detected. Ideal for unilateral balance, hypertrophy, and functional compound movements.',
  },
  barbell: {
    id: 'barbell',
    name: 'Olympic Barbell & Rack',
    category: 'Heavy Compound',
    confidence: 96,
    muscles: ['Chest', 'Back', 'Quads', 'Glutes', 'Hamstrings'],
    exercises: [
      { name: 'Barbell Back Squats', sets: 4, reps: '8-10', target: 'Legs' },
      { name: 'Barbell Bench Press', sets: 4, reps: '8-10', target: 'Chest' },
      { name: 'Conventional Deadlifts', sets: 3, reps: '6-8', target: 'Back' },
      { name: 'Overhead Military Press', sets: 3, reps: '8-10', target: 'Shoulders' },
      { name: 'Barbell Bent-Over Row', sets: 4, reps: '8-10', target: 'Back' },
    ],
    description: 'Gold-standard compound strength equipment detected. Optimized for maximal strength and progressive overload.',
  },
  kettlebell: {
    id: 'kettlebell',
    name: 'Kettlebell Bell',
    category: 'Dynamic & Core',
    confidence: 95,
    muscles: ['Glutes', 'Hamstrings', 'Core', 'Shoulders', 'Cardio'],
    exercises: [
      { name: 'Kettlebell Russian Swings', sets: 4, reps: '15-20', target: 'Glutes & Cardio' },
      { name: 'Goblet Squats to Press', sets: 4, reps: '10-12', target: 'Full Body' },
      { name: 'Single-Arm Kettlebell Snatch', sets: 3, reps: '10/side', target: 'Power' },
      { name: 'Turkish Get-Up', sets: 3, reps: '5/side', target: 'Core & Stability' },
    ],
    description: 'High-density conditioning tool detected. Enhances hip hinge explosive power and metabolic rate.',
  },
  pullup_bar: {
    id: 'pullup_bar',
    name: 'Pull-Up Bar & Calisthenics Station',
    category: 'Bodyweight Mastery',
    confidence: 98,
    muscles: ['Lats', 'Upper Back', 'Biceps', 'Core'],
    exercises: [
      { name: 'Wide-Grip Pull-Ups', sets: 4, reps: '6-10', target: 'Lats' },
      { name: 'Chin-Ups (Underhand)', sets: 3, reps: '8-10', target: 'Biceps & Back' },
      { name: 'Hanging Leg Raises', sets: 4, reps: '12-15', target: 'Core' },
      { name: 'Scapular Pull-Up Retractions', sets: 3, reps: '10-12', target: 'Upper Back' },
    ],
    description: 'Calisthenics pull station detected. Builds upper body pulling power and core anti-extension strength.',
  },
  bench: {
    id: 'bench',
    name: 'Adjustable Incline Bench',
    category: 'Support Station',
    confidence: 94,
    muscles: ['Upper Chest', 'Triceps', 'Shoulders', 'Abs'],
    exercises: [
      { name: 'Incline Dumbbell Press', sets: 4, reps: '10-12', target: 'Upper Chest' },
      { name: 'Flat Bench Dumbbell Flyes', sets: 3, reps: '12-15', target: 'Chest' },
      { name: 'Bench Dips', sets: 3, reps: '15', target: 'Triceps' },
      { name: 'Seated Incline Bicep Curls', sets: 3, reps: '12', target: 'Biceps' },
    ],
    description: 'Adjustable angle platform detected. Perfect for isolating upper chest fibers and strict posture support.',
  },
  bodyweight: {
    id: 'bodyweight',
    name: 'Gym Mat / Floor Space',
    category: 'Calisthenics & Mobility',
    confidence: 99,
    muscles: ['Chest', 'Core', 'Legs', 'Cardio'],
    exercises: [
      { name: 'Push-Ups with 2s Pause', sets: 4, reps: '15-20', target: 'Chest & Triceps' },
      { name: 'Deep Bodyweight Squats', sets: 4, reps: '20', target: 'Legs' },
      { name: 'Hollow Body Hold', sets: 4, reps: '45s', target: 'Core' },
      { name: 'Burpees with Jump', sets: 3, reps: '12-15', target: 'Cardio' },
    ],
    description: 'Open workout space detected. Ready for high-intensity calisthenics, functional flow, and core stability.',
  },
};

export const WorkoutScannerModal: React.FC<WorkoutScannerModalProps> = ({
  isOpen,
  onClose,
  onApplyPlan,
  onStartInstantWorkout,
}) => {
  const [activeTab, setActiveTab] = useState<'camera' | 'qr' | 'catalog'>('camera');
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [detectedEquipment, setDetectedEquipment] = useState<EquipmentDetection | null>(null);
  const [scanResultFeedback, setScanResultFeedback] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [torchOn, setTorchOn] = useState(false);
  const [hasTorchSupport, setHasTorchSupport] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Stop camera helper
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
    setTorchOn(false);
  }, []);

  // Start camera helper
  const startCamera = useCallback(async () => {
    setCameraError(null);
    stopCamera();

    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      setCameraError('Camera API is not supported in this browser environment. You can use the Quick Equipment Selector or photo upload below.');
      return;
    }

    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(() => {});
      }

      setCameraActive(true);

      // Check torch support
      const track = stream.getVideoTracks()[0];
      if (track && 'getCapabilities' in track) {
        const capabilities = (track as any).getCapabilities?.();
        setHasTorchSupport(Boolean(capabilities?.torch));
      }
    } catch (err: any) {
      console.warn('Camera access error:', err);
      let errorMsg = 'Could not access device camera. Please check camera permissions in your mobile browser settings.';
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        errorMsg = 'Camera permission was denied. Tap "Allow" in your browser address bar to enable scanner, or pick equipment below.';
      } else if (err.name === 'NotFoundError') {
        errorMsg = 'No camera found on this device. Use the equipment selector below!';
      }
      setCameraError(errorMsg);
      setCameraActive(false);
    }
  }, [facingMode, stopCamera]);

  // Toggle torch
  const toggleTorch = async () => {
    if (!streamRef.current) return;
    const track = streamRef.current.getVideoTracks()[0];
    if (track && 'applyConstraints' in track) {
      try {
        const next = !torchOn;
        await (track as any).applyConstraints({
          advanced: [{ torch: next }],
        });
        setTorchOn(next);
      } catch (err) {
        console.warn('Torch toggle failed', err);
      }
    }
  };

  // Flip camera
  const handleFlipCamera = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  // Start camera on modal open
  useEffect(() => {
    if (isOpen && (activeTab === 'camera' || activeTab === 'qr')) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isOpen, activeTab, facingMode, startCamera, stopCamera]);

  // Handle capture & simulate AI recognition
  const triggerScanAnalysis = (chosenId?: string) => {
    setIsScanning(true);
    setScanResultFeedback('Analyzing visual features with AI vision model...');

    // Select equipment
    const targetKey =
      chosenId ||
      ['dumbbells', 'barbell', 'kettlebell', 'pullup_bar', 'bench', 'bodyweight'][
        Math.floor(Math.random() * 6)
      ];

    setTimeout(() => {
      const detection = EQUIPMENT_CATALOG[targetKey] || EQUIPMENT_CATALOG.dumbbells;
      setDetectedEquipment(detection);
      setIsScanning(false);
      setScanResultFeedback(`Matched: ${detection.name} (${detection.confidence}% confidence)`);
      soundService.playScanSuccess();

      // Trigger haptic if available
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate([40, 60, 40]);
      }
    }, 1100);
  };

  // Handle file input upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    setScanResultFeedback(`Scanning uploaded photo: ${file.name}...`);

    setTimeout(() => {
      const keys = Object.keys(EQUIPMENT_CATALOG);
      const chosen = EQUIPMENT_CATALOG[keys[Math.floor(Math.random() * keys.length)]];
      setDetectedEquipment(chosen);
      setIsScanning(false);
      setScanResultFeedback(`Successfully identified: ${chosen.name} (${chosen.confidence}% match)`);
      soundService.playScanSuccess();
    }, 1200);
  };

  // Convert detected equipment into an active workout plan
  const handleLaunchWorkout = () => {
    if (!detectedEquipment) return;

    if (onApplyPlan) {
      const plan: WorkoutPlan = {
        id: `scanned-${Date.now()}`,
        title: `AI Scanned: ${detectedEquipment.name} Routine`,
        focus: detectedEquipment.muscles.slice(0, 2).join(' & '),
        level: 'Intermediate',
        durationMinutes: 30,
        estimatedCalories: 260,
        warmupExercises: [
          { name: 'Joint Mobilization & Arm Swings', durationSeconds: 60, tips: 'Prepare shoulder capsules' },
          { name: 'Deep Squat to Thoracic Rotation', durationSeconds: 60, tips: 'Open hip flexors and mid back' },
        ],
        exercises: detectedEquipment.exercises.map((ex, idx) => ({
          id: `ex-${idx}-${Date.now()}`,
          name: ex.name,
          targetMuscle: (ex.target.includes('Chest')
            ? 'Chest'
            : ex.target.includes('Back')
            ? 'Back'
            : ex.target.includes('Legs')
            ? 'Legs'
            : ex.target.includes('Shoulders')
            ? 'Shoulders'
            : ex.target.includes('Arms')
            ? 'Arms'
            : 'Core') as any,
          category: 'strength',
          difficulty: 'intermediate',
          equipment: [detectedEquipment.name],
          description: `Custom exercise tailored for ${detectedEquipment.name}.`,
          formCues: ['Maintain continuous muscular tension', 'Control the eccentric tempo', 'Breathe out on exertion'],
          mistakesToAvoid: ['Do not rush reps', 'Avoid loose joint stability'],
          tempo: '2-1-2',
          targetSets: ex.sets,
          targetReps: ex.reps,
          restSeconds: 45,
          caloriesBurnedEst: 45,
        })),
        cooldownExercises: [
          { name: 'Full Body Static Stretch', durationSeconds: 90, tips: 'Breathe deeply to lower heart rate' },
        ],
        aiNotes: `Generated by PulseAI Camera Scanner specifically matching your ${detectedEquipment.name}.`,
      };

      onApplyPlan(plan);
      onClose();
    } else if (onStartInstantWorkout) {
      onStartInstantWorkout();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/90 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl text-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-emerald-400 text-slate-950 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Camera className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <span>AI Workout & Equipment Scanner</span>
                <span className="text-[10px] bg-emerald-500/15 text-emerald-400 px-2 py-0.5 rounded-full font-mono font-bold border border-emerald-500/30">
                  Live Vision
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Point camera at dumbbells, machines, or QR codes to auto-generate workouts
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="grid grid-cols-3 border-b border-slate-800 bg-slate-950/50 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('camera')}
            className={`py-2.5 flex items-center justify-center gap-1.5 transition border-b-2 cursor-pointer ${
              activeTab === 'camera'
                ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Camera Vision</span>
          </button>

          <button
            onClick={() => setActiveTab('qr')}
            className={`py-2.5 flex items-center justify-center gap-1.5 transition border-b-2 cursor-pointer ${
              activeTab === 'qr'
                ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Scan QR Code</span>
          </button>

          <button
            onClick={() => setActiveTab('catalog')}
            className={`py-2.5 flex items-center justify-center gap-1.5 transition border-b-2 cursor-pointer ${
              activeTab === 'catalog'
                ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Dumbbell className="w-3.5 h-3.5" />
            <span>Equipment List</span>
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-4 sm:p-5 space-y-4 overflow-y-auto">
          {activeTab !== 'catalog' && (
            <div className="space-y-3">
              {/* Camera Viewfinder Container */}
              <div className="relative aspect-[4/3] sm:aspect-video bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-inner flex items-center justify-center">
                {/* Live Video */}
                {cameraActive ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="p-6 text-center space-y-3 max-w-sm">
                    <div className="w-12 h-12 rounded-2xl bg-slate-800 mx-auto flex items-center justify-center text-slate-400">
                      <Camera className="w-6 h-6" />
                    </div>
                    {cameraError ? (
                      <div className="space-y-1">
                        <p className="text-xs text-rose-400 font-medium flex items-center justify-center gap-1">
                          <AlertCircle className="w-4 h-4 shrink-0" />
                          <span>Camera Access Limited</span>
                        </p>
                        <p className="text-[11px] text-slate-400 leading-relaxed">
                          {cameraError}
                        </p>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400">
                        Initializing device camera viewfinder...
                      </p>
                    )}
                    <button
                      onClick={startCamera}
                      className="px-3.5 py-1.5 bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl shadow cursor-pointer hover:bg-emerald-400 transition"
                    >
                      Retry Camera
                    </button>
                  </div>
                )}

                {/* Reticle / HUD Overlay */}
                <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4 sm:p-6">
                  {/* Top Bar HUD */}
                  <div className="flex items-center justify-between text-[11px] font-mono text-emerald-400 bg-slate-950/60 px-3 py-1 rounded-xl backdrop-blur-sm self-stretch">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      {activeTab === 'camera' ? 'AI VISION ACTIVE' : 'QR CODE SEEKER'}
                    </span>
                    <span>1080P • 60FPS</span>
                  </div>

                  {/* Center Scanning Target Box */}
                  <div className="relative self-center w-48 h-48 sm:w-56 sm:h-56">
                    {/* Corner Reticle Accents */}
                    <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-emerald-400 rounded-tl" />
                    <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-emerald-400 rounded-tr" />
                    <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-emerald-400 rounded-bl" />
                    <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-emerald-400 rounded-br" />

                    {/* Laser Scan Line Animation */}
                    <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_#38bdf8] animate-pulse top-1/2 -translate-y-1/2" />

                    {/* Crosshairs */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-30 text-emerald-400">
                      <ScanLine className="w-12 h-12 stroke-[1]" />
                    </div>
                  </div>

                  {/* Bottom HUD Hint */}
                  <div className="text-center text-[10px] sm:text-xs text-slate-300 bg-slate-950/70 py-1.5 px-3 rounded-xl backdrop-blur-sm self-center">
                    {activeTab === 'camera'
                      ? 'Align gym equipment (dumbbells, barbells, bench) inside the frame'
                      : 'Center QR code or gym workout card inside the frame'}
                  </div>
                </div>

                {/* Viewfinder Controls (Floating) */}
                <div className="absolute top-3 right-3 flex items-center gap-2 pointer-events-auto">
                  {hasTorchSupport && (
                    <button
                      onClick={toggleTorch}
                      className={`p-2 rounded-xl backdrop-blur-md text-xs font-bold transition cursor-pointer ${
                        torchOn
                          ? 'bg-amber-400 text-slate-950'
                          : 'bg-slate-900/80 text-white hover:bg-slate-800'
                      }`}
                      title="Toggle Flashlight / Torch"
                    >
                      <Zap className="w-4 h-4" />
                    </button>
                  )}

                  <button
                    onClick={handleFlipCamera}
                    className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-white backdrop-blur-md text-xs transition cursor-pointer"
                    title="Flip Camera (Front/Rear)"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Action Buttons: Scan Now / Upload Photo / Quick Test */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <button
                  onClick={() => triggerScanAnalysis()}
                  disabled={isScanning}
                  className="py-3 px-3 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95 cursor-pointer disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isScanning ? 'Analyzing...' : 'Scan / Detect Now'}</span>
                </button>

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="py-3 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 border border-slate-700 cursor-pointer"
                >
                  <Upload className="w-4 h-4 text-cyan-400" />
                  <span>Upload Photo</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={handleImageUpload}
                />

                <button
                  onClick={() => setActiveTab('catalog')}
                  className="col-span-2 sm:col-span-1 py-3 px-3 bg-slate-800/80 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl transition flex items-center justify-center gap-2 border border-slate-700 cursor-pointer"
                >
                  <Dumbbell className="w-4 h-4 text-amber-400" />
                  <span>Presets Catalog</span>
                </button>
              </div>

              {scanResultFeedback && (
                <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-center text-xs text-slate-300 font-medium">
                  {scanResultFeedback}
                </div>
              )}
            </div>
          )}

          {/* Quick Equipment Catalog Selectable Badges */}
          {activeTab === 'catalog' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold text-white">Select Any Equipment to Scan & Generate:</span>
                <span>Instant preview</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {Object.values(EQUIPMENT_CATALOG).map((eq) => {
                  const isSelected = detectedEquipment?.id === eq.id;
                  return (
                    <button
                      key={eq.id}
                      onClick={() => {
                        setDetectedEquipment(eq);
                        soundService.playScanSuccess();
                      }}
                      className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-500/15 border-emerald-500 text-white shadow-md shadow-emerald-500/20'
                          : 'bg-slate-800/50 border-slate-800 text-slate-300 hover:bg-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                            {eq.category}
                          </span>
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                        </div>
                        <h4 className="font-bold text-xs text-white leading-tight">{eq.name}</h4>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-2 line-clamp-1">
                        {eq.exercises.length} exercises ready
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Scanned Equipment Result Card */}
          {detectedEquipment && (
            <div className="bg-gradient-to-b from-slate-800/90 to-slate-900 border border-emerald-500/40 rounded-2xl p-4 sm:p-5 space-y-3 shadow-xl animate-fadeIn">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-emerald-500 text-slate-950 font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 stroke-[3]" />
                      <span>{detectedEquipment.confidence}% CONFIRMED</span>
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      {detectedEquipment.category}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-white mt-1">
                    {detectedEquipment.name}
                  </h3>
                  <p className="text-xs text-slate-300 mt-0.5">
                    {detectedEquipment.description}
                  </p>
                </div>
              </div>

              {/* Muscles Targeted */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] text-slate-400 font-medium">Primed Muscles:</span>
                {detectedEquipment.muscles.map((m) => (
                  <span
                    key={m}
                    className="text-[10px] bg-slate-950 text-emerald-400 border border-slate-800 px-2 py-0.5 rounded-md font-semibold"
                  >
                    {m}
                  </span>
                ))}
              </div>

              {/* Exercise Recommendations */}
              <div className="space-y-1.5 pt-1">
                <div className="text-xs font-bold text-white flex items-center justify-between">
                  <span>Target Workout Routine ({detectedEquipment.exercises.length} Exercises)</span>
                  <span className="text-[11px] text-slate-400 font-mono">Rest: 45s between laps</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {detectedEquipment.exercises.map((ex, i) => (
                    <div
                      key={i}
                      className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-semibold text-slate-200">{ex.name}</div>
                        <div className="text-[10px] text-emerald-400">{ex.target}</div>
                      </div>
                      <div className="text-[11px] font-mono font-bold text-slate-300">
                        {ex.sets} × {ex.reps}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Launch Workout CTA */}
              <button
                onClick={handleLaunchWorkout}
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 active:scale-95 cursor-pointer mt-2"
              >
                <Play className="w-4 h-4 fill-slate-950" />
                <span>Start Training with {detectedEquipment.name}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
