import express, { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

app.use(express.json({ limit: '10mb' }));

const apiKey = process.env.GEMINI_API_KEY;

let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    hasApiKey: Boolean(apiKey),
    timestamp: new Date().toISOString(),
  });
});

// Helper to build Coach Pulse system instruction
function buildSystemInstruction(userProfile: any): string {
  const profileContext = userProfile
    ? `User Profile Context:
- Name: ${userProfile.name || 'Friend'}
- Age: ${userProfile.age || 'Not specified'}
- Gender: ${userProfile.gender || 'Not specified'}
- Fitness Level: ${userProfile.fitnessLevel || 'Intermediate'}
- Primary Goal: ${userProfile.goal || 'General Fitness'}
- Available Equipment: ${userProfile.equipment?.join(', ') || 'Bodyweight, Dumbbells'}
- Preferred Duration: ${userProfile.preferredDuration || 30} minutes
- Limitations/Injuries: ${userProfile.injuries || 'None'}
- Rest Between Laps/Sets: ${userProfile.defaultRestSeconds || 45} seconds
`
    : 'User profile: Standard adult looking for balanced fitness guidance.';

  return `You are "Coach Pulse", an elite certified personal trainer (CSCS), biomechanist, and sports nutrition specialist.
Your mission is to provide thorough, crystal-clear, scientifically backed, and real-time actionable explanations to EACH AND EVERY query the user asks.

Whether the user asks about:
- General fitness, beginner routines, or ADVANCED-LEVEL bodybuilding & powerlifting
- Biomechanics and muscle recruitment (e.g. quad vs glute bias on squats)
- Why 30 to 45 seconds rest time is optimal for metabolic conditioning, muscular hypertrophy, and lactate clearance
- Form cues, injury prevention, warm-up drills, or cool-down recovery
- Macronutrient calculations, protein synthesis, pre/post workout nutrition
- Overcoming plateaus using progressive overload, drop sets, supersets, and tempo control (e.g. 3-1-1 tempo)

ADAPT TO ADVANCED LEVEL:
If the user is at an Advanced level or asks for advanced work:
- Prescribe advanced exercises (Pistol Squats, Dragon Flags, Barbell Deadlifts, Weighted Deficit Split Squats, Muscle-Ups, Handstand Push-Ups).
- Enforce strict 30 to 45-second rest intervals between sets and laps to develop high-density muscular endurance and cardiovascular power.
- Reference Rate of Perceived Exertion (RPE 8-9.5) and mechanical tension.

FORMATTING FOR MAXIMUM CLARITY:
1. Direct, energizing answer upfront.
2. The Science / "Why It Works" (explained simply).
3. Step-by-Step Practical Application (form cues, sets x reps, rest timing).
4. Pro Coach Tip or Common Mistake to avoid.

CRITICAL SAFETY DIRECTIVE:
PulseAI provides fitness education and sports science guidance, not clinical medical diagnosis. If the user mentions sharp pain, dizziness, palpitations, or acute trauma, instruct them to stop exercising and consult a medical doctor.

${profileContext}`;
}

// Real-Time Streaming Chatbot endpoint (Server-Sent Events)
app.post('/api/gemini/chat-stream', async (req: Request, res: Response) => {
  const { message, history = [], userProfile } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const systemInstruction = buildSystemInstruction(userProfile);
  const formattedContents: Array<{ role: string; parts: Array<{ text: string }> }> = [];

  if (Array.isArray(history)) {
    for (const turn of history.slice(-8)) {
      if (turn.sender === 'user') {
        formattedContents.push({ role: 'user', parts: [{ text: turn.text }] });
      } else if (turn.sender === 'ai') {
        formattedContents.push({ role: 'model', parts: [{ text: turn.text }] });
      }
    }
  }

  formattedContents.push({ role: 'user', parts: [{ text: message }] });

  if (!ai) {
    const fallback = generateFallbackCoachAdvice(message, userProfile);
    res.write(`data: ${JSON.stringify({ text: fallback })}\n\n`);
    res.write('data: [DONE]\n\n');
    return res.end();
  }

  try {
    let stream;
    try {
      stream = await ai.models.generateContentStream({
        model: 'gemini-3.5-flash',
        contents: formattedContents,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });
    } catch {
      stream = await ai.models.generateContentStream({
        model: 'gemini-3.8-flash',
        contents: formattedContents,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });
    }

    for await (const chunk of stream) {
      const text = chunk.text;
      if (text) {
        res.write(`data: ${JSON.stringify({ text })}\n\n`);
      }
    }
    res.write('data: [DONE]\n\n');
    res.end();
  } catch (err) {
    console.warn('Streaming error, sending resilient fallback:', err);
    const fallback = generateFallbackCoachAdvice(message, userProfile);
    res.write(`data: ${JSON.stringify({ text: fallback })}\n\n`);
    res.write('data: [DONE]\n\n');
    res.end();
  }
});

// Conversational AI Coach standard endpoint
app.post('/api/gemini/chat', async (req: Request, res: Response) => {
  try {
    const { message, history = [], userProfile } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const systemInstruction = buildSystemInstruction(userProfile);

    // Construct contents for generateContent
    const formattedContents: Array<{ role: string; parts: Array<{ text: string }> }> = [];

    // Add prior dialogue turns
    if (Array.isArray(history)) {
      for (const turn of history.slice(-8)) {
        if (turn.sender === 'user') {
          formattedContents.push({ role: 'user', parts: [{ text: turn.text }] });
        } else if (turn.sender === 'ai') {
          formattedContents.push({ role: 'model', parts: [{ text: turn.text }] });
        }
      }
    }

    // Append latest prompt
    formattedContents.push({ role: 'user', parts: [{ text: message }] });

    if (!ai) {
      const fallbackReply = generateFallbackCoachAdvice(message, userProfile);
      return res.json({ reply: fallbackReply });
    }

    let response;
    try {
      try {
        response = await ai.models.generateContent({
          model: 'gemini-3.5-flash',
          contents: formattedContents,
          config: {
            systemInstruction,
            temperature: 0.7,
          },
        });
      } catch {
        response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: formattedContents,
          config: {
            systemInstruction,
            temperature: 0.7,
          },
        });
      }
    } catch (apiErr) {
      console.warn('Gemini temporary API spike, generating coach guidance fallback:', apiErr);
      const fallbackReply = generateFallbackCoachAdvice(message, userProfile);
      return res.json({ reply: fallbackReply });
    }

    const replyText = response.text || "Keep pushing! You've got what it takes to crush your fitness goals.";
    return res.json({ reply: replyText });
  } catch (err: unknown) {
    console.error('Gemini chat error:', err);
    const errorMessage = err instanceof Error ? err.message : 'Failed to communicate with AI Coach';
    return res.status(500).json({ error: errorMessage });
  }
});

function generateFallbackCoachAdvice(query: string, userProfile: any): string {
  const q = (query || '').toLowerCase();
  const name = userProfile?.name || 'Champ';
  const goal = userProfile?.goal || 'General Fitness';

  if (q.includes('30') || q.includes('45') || q.includes('rest') || q.includes('lap')) {
    return `⏱️ **The Exercise Science Behind 30 to 45 Seconds Rest**:
1. **Lactate Threshold & EPOC**: Keeping rest strictly between 30 and 45 seconds maintains high metabolic density. It forces your cardiovascular and anaerobic systems to clear hydrogen ions while preserving peak neuromuscular recruitment.
2. **Hypertrophy & Growth Hormone Surge**: Research demonstrates that short rest intervals (30-45s) maximize cellular swelling, metabolic stress, and acute anabolic hormone response.
3. **Hands-Free Auto-Start Advantage**: In PulseAI, having the app auto-start the exercise right after the 30-45s rest timer hits zero eliminates hesitation or extended downtime, ensuring your average heart rate remains in the target conditioning zone throughout all laps!`;
  }

  if (q.includes('advance') || q.includes('advanced') || q.includes('pistol') || q.includes('beast')) {
    return `🏆 **Advanced Level Strength & Conditioning Protocol**:
To progress beyond intermediate plateaus at an Advanced Level:
1. **Unilateral Mastery**: Implement Pistol Squats and Deficit Split Squats to eliminate muscular imbalances and develop single-leg stabilizer power.
2. **Tempo & Time Under Tension (TUT)**: Utilize a strict **3-1-1 tempo** (3-second eccentric lowering, 1-second pause at maximum stretch, 1-second explosive concentric drive).
3. **High-Density Lap Rest (30-45s)**: Challenge your work capacity by capping rest between laps and exercises strictly to 30-45 seconds.
4. **Mechanical Tension & RPE**: Train within Rate of Perceived Exertion **8.5 to 9.5**, leaving only 1-2 reps in reserve on compound lifts before taking scheduled deloads.`;
  }

  if (q.includes('pushup') || q.includes('push-up') || q.includes('push up')) {
    return `🔥 **Coach Tip for Push-Ups**:
Keep your elbows at roughly a 45-degree angle from your torso (creating an arrow shape rather than a flared T) to protect your rotator cuffs and maximize chest tension. Squeeze your glutes and brace your core so your body moves as one solid unit with 2-second controlled descents!`;
  }

  if (q.includes('chest')) {
    return `🎯 **Chest Workout Guide for ${goal}**:
1. **Controlled Push-ups / Deficit Push-ups**: 3 sets of 10-12 reps (2s lowering, 1s hover)
2. **Dumbbell Bench Press or Floor Press**: 3 sets of 10-12 reps
3. **Incline Press / Chest Dips**: 3 sets of 8-10 reps
*Rest interval*: Enforce 30 to 45 seconds rest between sets to maintain intense metabolic pump.`;
  }

  if (q.includes('20 min') || q.includes('stamina') || q.includes('cardio')) {
    return `⚡ **High-Efficiency Stamina Circuit (20 Minutes)**:
Structure your workout into 4 intense laps, each with 30-45s rest between rounds:
1. Jumping Jacks or High Knees (45s)
2. Bodyweight Deep Squats (45s)
3. Strict Push-ups (45s)
4. Mountain Climbers (45s)
5. Prone Plank Isometric Hold (45s)
*Rest 30 to 45 seconds, then immediately start the next lap!*`;
  }

  return `Hey ${name}! For your goal of **${goal}**, consistency and biomechanically strict execution beat ego-lifting every single time.
Focus on:
1. Controlling your negative (eccentric) phase for 2-3 seconds on every rep
2. Maintaining strict 30 to 45 seconds rest between laps and sets
3. Hydrating with 8+ glasses of water today
4. Hitting your scheduled workouts on your weekly calendar
Keep up the tremendous dedication—every single lap counts!`;
}

// Structured AI Workout Generator endpoint
app.post('/api/gemini/generate-workout', async (req: Request, res: Response) => {
  try {
    const { userProfile, focus = 'Full Body', customDuration, notes = '' } = req.body;

    if (!ai) {
      return res.status(503).json({
        error: 'Gemini API is not configured. Please ensure GEMINI_API_KEY is provided.',
      });
    }

    const duration = customDuration || userProfile?.preferredDuration || 35;
    const level = userProfile?.fitnessLevel || 'Intermediate';
    const goal = userProfile?.goal || 'General Fitness';
    const equipment = userProfile?.equipment?.length ? userProfile.equipment.join(', ') : 'Bodyweight only, Dumbbells';

    const prompt = `Generate a customized, professional workout plan for:
- Fitness Level: ${level}
- Goal: ${goal}
- Focus Muscle/Area: ${focus}
- Duration: ${duration} minutes
- Equipment Available: ${equipment}
- Special Notes: ${notes || 'Standard safe progression'}

Return a strictly valid JSON object adhering to this schema:
{
  "title": "string (energetic workout title)",
  "description": "string (1-2 sentences on what this workout accomplishes)",
  "difficulty": "Beginner" | "Intermediate" | "Advanced",
  "estimatedDurationMin": number,
  "estimatedCalories": number,
  "targetMuscles": ["string", "string"],
  "warmup": [
    {
      "name": "string",
      "duration": "string (e.g. 60s)",
      "instructions": "string"
    }
  ],
  "exercises": [
    {
      "name": "string",
      "targetMuscle": "string",
      "sets": number,
      "reps": "string (e.g. 10-12 or 45s)",
      "restSeconds": number,
      "equipment": "string",
      "formCues": "string",
      "tempo": "string (e.g. 2-1-2)"
    }
  ],
  "cooldown": [
    {
      "name": "string",
      "duration": "string (e.g. 45s)",
      "instructions": "string"
    }
  ],
  "coachTips": "string (1 actionable tip for hydration, mindset, or recovery)"
}
Do not wrap in backticks or markdown, just return the JSON.`;

    let workoutData;
    try {
      let response;
      try {
        response = await ai.models.generateContent({
          model: 'gemini-3.5-flash',
          contents: prompt,
          config: {
            systemInstruction: 'You are an exercise physiologist and elite fitness coach. Return ONLY clean, valid JSON with balanced, safe, biomechanically sound exercise selections.',
            responseMimeType: 'application/json',
            temperature: 0.6,
          },
        });
      } catch {
        response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            systemInstruction: 'You are an exercise physiologist and elite fitness coach. Return ONLY clean, valid JSON with balanced, safe, biomechanically sound exercise selections.',
            responseMimeType: 'application/json',
            temperature: 0.6,
          },
        });
      }

      const responseText = response.text?.trim() || '{}';
      try {
        workoutData = JSON.parse(responseText);
      } catch {
        const cleaned = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        workoutData = JSON.parse(cleaned);
      }
    } catch (apiErr) {
      console.warn('Gemini generate workout API spike, generating fallback structured routine:', apiErr);
      workoutData = {
        title: `AI ${focus} Power Session`,
        description: `Targeted ${duration}-minute session crafted for ${goal} and balanced progression.`,
        difficulty: level,
        estimatedDurationMin: duration,
        estimatedCalories: Math.round(duration * 9.5),
        targetMuscles: [focus, 'Core'],
        warmup: [
          { name: 'Arm Circles & Hugs', duration: '60s', instructions: 'Open shoulder joint and chest.' },
          { name: 'Hip Openers & Squat Hold', duration: '60s', instructions: 'Mobilize pelvis and ankles.' },
        ],
        exercises: [
          {
            name: focus.includes('Lower') || focus.includes('Legs') ? 'Goblet Squats' : 'Push-Ups with 2s Pause',
            targetMuscle: focus.includes('Lower') ? 'Legs' : 'Chest',
            sets: 3,
            reps: '10-12',
            restSeconds: 60,
            equipment: equipment.includes('Dumbbells') ? 'Dumbbells' : 'Bodyweight',
            formCues: 'Brace core, maintain smooth 2-1-2 tempo.',
            tempo: '2-1-2'
          },
          {
            name: focus.includes('Chest') ? 'Dumbbell Bench Press' : 'Bent-Over Dumbbell Rows',
            targetMuscle: focus.includes('Chest') ? 'Chest' : 'Back',
            sets: 3,
            reps: '10-12',
            restSeconds: 60,
            equipment: 'Dumbbells',
            formCues: 'Drive elbows down, squeeze at peak contraction.',
            tempo: '2-1-2'
          },
          {
            name: 'Core Plank Burnout',
            targetMuscle: 'Core',
            sets: 3,
            reps: '45s',
            restSeconds: 45,
            equipment: 'Bodyweight',
            formCues: 'Keep hips level with shoulders and squeeze glutes.',
            tempo: 'Isometric'
          }
        ],
        cooldown: [
          { name: 'Cobra to Child’s Pose', duration: '60s', instructions: 'Lengthen abdominal wall and stretch lumbar spine.' }
        ],
        coachTips: 'Hydrate well before and after training, and log your weights to track progressive overload!'
      };
    }

    return res.json({ workout: workoutData });
  } catch (err: unknown) {
    console.error('Gemini generate workout error:', err);
    const errorMessage = err instanceof Error ? err.message : 'Failed to generate workout';
    return res.status(500).json({ error: errorMessage });
  }
});

// Setup Vite middleware in development or serve static in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`PulseAI Server running on http://0.0.0.0:${port}`);
  });
}

startServer();
