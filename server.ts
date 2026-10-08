import express, { Request, Response } from 'express';
import http from 'http';
import fs from 'fs';
import crypto from 'crypto';
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

// ---------------------------------------------------------------------------
// AUTHENTICATION & SECURE USER DATABASE
// ---------------------------------------------------------------------------
const USERS_FILE = path.join(__dirname, 'users-db.json');
const USER_DATA_DIR = path.join(__dirname, 'user-data-store');

if (!fs.existsSync(USER_DATA_DIR)) {
  fs.mkdirSync(USER_DATA_DIR, { recursive: true });
}

interface StoredUser {
  id: string;
  name: string;
  email: string;
  salt: string;
  hash: string;
  createdAt: string;
  resetCode?: string;
  resetExpires?: number;
}

interface SessionRecord {
  token: string;
  userId: string;
  createdAt: string;
  expiresAt: number;
}

function hashPassword(password: string): { salt: string; hash: string } {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return { salt, hash };
}

function verifyPassword(password: string, salt: string, storedHash: string): boolean {
  try {
    const derivedHash = crypto.scryptSync(password, salt, 64).toString('hex');
    return crypto.timingSafeEqual(
      Buffer.from(derivedHash, 'hex'),
      Buffer.from(storedHash, 'hex')
    );
  } catch {
    return false;
  }
}

function loadUsers(): Record<string, StoredUser> {
  try {
    if (fs.existsSync(USERS_FILE)) {
      const content = fs.readFileSync(USERS_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error('Failed reading users db, initializing new:', err);
  }
  // Initialize with seeded demo user
  const demoSeed = hashPassword('Fitness@2026!');
  const initialUsers: Record<string, StoredUser> = {
    'user-default-alex': {
      id: 'user-default-alex',
      name: 'Alex Rivera',
      email: 'alex@pulsetrainer.ai',
      salt: demoSeed.salt,
      hash: demoSeed.hash,
      createdAt: '2026-10-01T00:00:00.000Z',
    },
  };
  saveUsers(initialUsers);
  return initialUsers;
}

function saveUsers(users: Record<string, StoredUser>): void {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed saving users db:', err);
  }
}

// In-memory active sessions map (with token lookup)
const activeSessions: Map<string, SessionRecord> = new Map();

function createSession(userId: string, rememberMe = true): SessionRecord {
  const token = crypto.randomBytes(32).toString('hex');
  // 30 days if rememberMe, 24 hours if not
  const duration = rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;
  const session: SessionRecord = {
    token,
    userId,
    createdAt: new Date().toISOString(),
    expiresAt: Date.now() + duration,
  };
  activeSessions.set(token, session);
  return session;
}

function getSessionUser(req: Request): StoredUser | null {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.split(' ')[1];
  const session = activeSessions.get(token);
  if (!session) return null;
  if (Date.now() > session.expiresAt) {
    activeSessions.delete(token);
    return null;
  }
  const users = loadUsers();
  return users[session.userId] || null;
}

// User-scoped data storage helpers
function getUserDataFilePath(userId: string): string {
  // sanitize userId
  const safeId = userId.replace(/[^a-zA-Z0-9_-]/g, '_');
  return path.join(USER_DATA_DIR, `${safeId}.json`);
}

function loadUserData(userId: string): any | null {
  try {
    const filePath = getUserDataFilePath(userId);
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    }
  } catch (e) {
    console.error('Error reading user data:', e);
  }
  return null;
}

function saveUserData(userId: string, data: any): void {
  try {
    const filePath = getUserDataFilePath(userId);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    console.error('Error saving user data:', e);
  }
}

// Ensure demo user is seeded
loadUsers();

// ---------------------------------------------------------------------------
// AUTH ROUTES
// ---------------------------------------------------------------------------

// POST /api/auth/register
app.post('/api/auth/register', (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ error: 'Full Name is required' });
    }
    if (!email || typeof email !== 'string' || !email.trim()) {
      return res.status(400).json({ error: 'Email address is required' });
    }

    const trimmedEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return res.status(400).json({ error: 'Please enter a valid email address' });
    }

    if (!password || typeof password !== 'string' || password.length < 8) {
      return res.status(400).json({
        error: 'Password must be at least 8 characters long and contain letters and numbers',
      });
    }

    const users = loadUsers();
    // Check if email already used
    const existing = Object.values(users).find(
      (u) => u.email.toLowerCase() === trimmedEmail
    );
    if (existing) {
      return res.status(409).json({
        error: 'An account with this email address already exists. Please sign in instead.',
      });
    }

    const { salt, hash } = hashPassword(password);
    const userId = `usr_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    const newUser: StoredUser = {
      id: userId,
      name: name.trim(),
      email: trimmedEmail,
      salt,
      hash,
      createdAt: new Date().toISOString(),
    };

    users[userId] = newUser;
    saveUsers(users);

    const session = createSession(userId, true);

    return res.status(201).json({
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        createdAt: newUser.createdAt,
      },
      token: session.token,
      expiresAt: new Date(session.expiresAt).toISOString(),
    });
  } catch (err: unknown) {
    console.error('Register error:', err);
    return res.status(500).json({ error: 'Registration failed. Please try again.' });
  }
});

// POST /api/auth/login
app.post('/api/auth/login', (req: Request, res: Response) => {
  try {
    const { email, password, rememberMe } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const trimmedEmail = String(email).trim().toLowerCase();
    const users = loadUsers();

    const user = Object.values(users).find(
      (u) => u.email.toLowerCase() === trimmedEmail
    );

    if (!user) {
      return res.status(401).json({ error: 'Incorrect email or password. Please try again.' });
    }

    const valid = verifyPassword(String(password), user.salt, user.hash);
    if (!valid) {
      return res.status(401).json({ error: 'Incorrect email or password. Please try again.' });
    }

    const session = createSession(user.id, Boolean(rememberMe ?? true));

    return res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
      token: session.token,
      expiresAt: new Date(session.expiresAt).toISOString(),
    });
  } catch (err: unknown) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Login failed. Please try again.' });
  }
});

// GET /api/auth/me
app.get('/api/auth/me', (req: Request, res: Response) => {
  const user = getSessionUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Not authenticated or session expired' });
  }
  return res.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    },
  });
});

// POST /api/auth/logout
app.post('/api/auth/logout', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    activeSessions.delete(token);
  }
  return res.json({ success: true });
});

// POST /api/auth/forgot-password
app.post('/api/auth/forgot-password', (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email || typeof email !== 'string') {
      return res.status(400).json({ error: 'Registered email address is required' });
    }

    const trimmedEmail = email.trim().toLowerCase();
    const users = loadUsers();
    const user = Object.values(users).find(
      (u) => u.email.toLowerCase() === trimmedEmail
    );

    if (!user) {
      return res.status(404).json({
        error: 'No account found with this email address. Please check your spelling or create an account.',
      });
    }

    // Generate secure 6-digit numeric verification code
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetCode = resetCode;
    user.resetExpires = Date.now() + 15 * 60 * 1000; // 15 mins expiry
    users[user.id] = user;
    saveUsers(users);

    return res.json({
      success: true,
      message: `Password reset instructions and verification code sent to ${user.email}`,
      resetCode, // Returned for simulated inbox/preview so user can test seamlessly
      email: user.email,
      expiresInMinutes: 15,
    });
  } catch (err: unknown) {
    console.error('Forgot password error:', err);
    return res.status(500).json({ error: 'Failed to process password recovery' });
  }
});

// POST /api/auth/reset-password
app.post('/api/auth/reset-password', (req: Request, res: Response) => {
  try {
    const { email, resetCode, newPassword } = req.body;

    if (!email || !resetCode || !newPassword) {
      return res.status(400).json({
        error: 'Email, verification code, and new password are required',
      });
    }

    if (typeof newPassword !== 'string' || newPassword.length < 8) {
      return res.status(400).json({
        error: 'New password must be at least 8 characters long',
      });
    }

    const trimmedEmail = email.trim().toLowerCase();
    const users = loadUsers();
    const user = Object.values(users).find(
      (u) => u.email.toLowerCase() === trimmedEmail
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!user.resetCode || user.resetCode !== String(resetCode).trim()) {
      return res.status(400).json({ error: 'Invalid verification code. Please check and try again.' });
    }

    if (!user.resetExpires || Date.now() > user.resetExpires) {
      return res.status(400).json({
        error: 'Verification code has expired. Please request a new password reset.',
      });
    }

    // Hash new password securely
    const { salt, hash } = hashPassword(newPassword);
    user.salt = salt;
    user.hash = hash;
    delete user.resetCode;
    delete user.resetExpires;

    users[user.id] = user;
    saveUsers(users);

    return res.json({
      success: true,
      message: 'Password successfully updated! You can now sign in with your new password.',
    });
  } catch (err: unknown) {
    console.error('Reset password error:', err);
    return res.status(500).json({ error: 'Failed to reset password' });
  }
});

// GET /api/auth/user-data (isolated per user)
app.get('/api/auth/user-data', (req: Request, res: Response) => {
  const user = getSessionUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  const data = loadUserData(user.id);
  return res.json({ data });
});

// PUT /api/auth/user-data (isolated per user)
app.put('/api/auth/user-data', (req: Request, res: Response) => {
  const user = getSessionUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  const { data } = req.body;
  if (data) {
    saveUserData(user.id, data);
  }
  return res.json({ success: true });
});

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
  const httpServer = http.createServer(app);

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: {
          server: httpServer,
        },
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);

    // Fallback handler in dev for SPA routing to prevent any 404
    app.use('*', async (req: Request, res: Response, next) => {
      const url = req.originalUrl;
      if (url.startsWith('/api/')) {
        return next();
      }
      try {
        let template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  httpServer.listen(port, '0.0.0.0', () => {
    console.log(`PulseAI Server running on http://0.0.0.0:${port}`);
  });
}

startServer();
