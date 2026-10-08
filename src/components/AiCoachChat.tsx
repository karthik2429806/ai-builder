import React, { useState, useRef, useEffect } from 'react';
import { UserProfile, ChatMessage, WorkoutPlan } from '../types';
import {
  Send,
  Sparkles,
  Bot,
  User,
  Volume2,
  VolumeX,
  ShieldAlert,
  Zap,
  Flame,
  Dumbbell,
  Clock,
  HelpCircle,
  Copy,
  Check,
} from 'lucide-react';

interface AiCoachChatProps {
  userProfile: UserProfile;
  onApplyWorkout?: (plan: WorkoutPlan) => void;
  onOpenDisclaimer?: () => void;
}

const DEEP_EXPLANATION_PROMPTS = [
  { label: '⏱️ Explain 30-45s Rest', query: 'Explain why 30 to 45 seconds rest time between laps/sets is effective and how to use it.' },
  { label: '🏆 Advanced Strength Plan', query: 'Explain and design an Advanced-Level hypertrophy & strength routine for me.' },
  { label: '🦵 Master Pistol Squats', query: 'Explain the step-by-step biomechanics, progression, and joint mobility needed for Pistol Squats.' },
  { label: '📈 Explain Progressive Overload', query: 'Explain progressive overload and RPE (Rate of Perceived Exertion) with actionable examples.' },
  { label: '🥩 Macros & Protein Synthesis', query: 'Explain daily protein, carb, and hydration requirements for my goals.' },
  { label: '⚡ 20-Min High-Intensity Lap', query: 'Explain how to structure an intense 20-minute bodyweight circuit with 30s rest between laps.' },
];

export const AiCoachChat: React.FC<AiCoachChatProps> = ({
  userProfile,
  onApplyWorkout,
  onOpenDisclaimer,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: `Hey ${userProfile.name}! 👋 I'm **Coach Pulse**, your 24/7 real-time AI personal trainer and sports scientist.

I am calibrated to your **${userProfile.fitnessLevel}** level, **${userProfile.goal}** goal, and **${userProfile.defaultRestSeconds || 45}s** lap rest interval.

Ask me to thoroughly explain **any exercise, biomechanics, advanced programming, rest interval physiology, or nutrition questions**!`,
      timestamp: 'Just now',
    },
  ]);

  const [inputText, setInputText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isStreaming]);

  // Clean up speech on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Text-To-Speech function
  const speakText = (text: string, msgId: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (speakingMessageId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
      return;
    }

    window.speechSynthesis.cancel();
    // Clean markdown asterisks and hash marks for natural speech
    const cleanSpeech = text
      .replace(/[*#_~`]/g, '')
      .replace(/https?:\/\/\S+/g, '')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanSpeech);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;

    utterance.onend = () => {
      setSpeakingMessageId(null);
    };
    utterance.onerror = () => {
      setSpeakingMessageId(null);
    };

    setSpeakingMessageId(msgId);
    window.speechSynthesis.speak(utterance);
  };

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Real-Time Streaming Message Handler
  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isStreaming) return;

    const userMsg: ChatMessage = {
      id: 'msg-user-' + Date.now(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const aiMsgId = 'msg-ai-' + Date.now();
    const aiMsgPlaceholder: ChatMessage = {
      id: aiMsgId,
      sender: 'ai',
      text: '',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg, aiMsgPlaceholder]);
    setInputText('');
    setIsStreaming(true);

    try {
      const response = await fetch('/api/gemini/chat-stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: messages.slice(-6),
          userProfile,
        }),
      });

      if (!response.ok || !response.body) {
        throw new Error('Streaming failed, fallback to standard');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let accumulatedText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunkStr = decoder.decode(value, { stream: true });
        const lines = chunkStr.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.slice(6).trim();
            if (dataStr === '[DONE]') break;
            try {
              const parsed = JSON.parse(dataStr);
              if (parsed.text) {
                accumulatedText += parsed.text;
                setMessages((prev) =>
                  prev.map((m) => (m.id === aiMsgId ? { ...m, text: accumulatedText } : m))
                );
              }
            } catch {
              // ignore parse errors
            }
          }
        }
      }

      if (!accumulatedText.trim()) {
        throw new Error('Empty response');
      }

      // If voice enabled, speak the answer
      if (voiceEnabled) {
        speakText(accumulatedText, aiMsgId);
      }
    } catch {
      // Resilient fallback
      const fallbackReply = generateFallbackCoachExplanation(text, userProfile);
      setMessages((prev) =>
        prev.map((m) => (m.id === aiMsgId ? { ...m, text: fallbackReply } : m))
      );
      if (voiceEnabled) {
        speakText(fallbackReply, aiMsgId);
      }
    } finally {
      setIsStreaming(false);
    }
  };

  // Comprehensive fallback explanations
  function generateFallbackCoachExplanation(query: string, profile: UserProfile): string {
    const q = query.toLowerCase();

    if (q.includes('30') || q.includes('45') || q.includes('rest time') || q.includes('rest density')) {
      return `⏱️ **The Science of 30 to 45 Seconds Rest Density**:

### 1. Why 30-45s Rest Works:
Resting 30 to 45 seconds between exercises and laps creates **high metabolic stress** and forces your body into rapid ATP-CP resynthesis. 
- **Lactate Tolerance**: It teaches your muscular cells to buffer lactic acid quickly, dramatically boosting anaerobic stamina.
- **Growth Hormone & Hypertrophy**: Studies in sports physiology show short rest intervals trigger higher acute hormonal surges compared to extended rests.
- **Cardiovascular Density**: Your heart rate remains elevated in the optimal aerobic-anaerobic threshold zone (75-85% Max HR).

### 2. How to Execute Laps & Rest in PulseAI:
1. Complete your exercise set with maximum focus.
2. The **30-45s Lap Rest Timer** automatically counts down with auditory beeps.
3. At 0 seconds, Coach Pulse auto-starts your next movement so you never lose momentum!`;
    }

    if (q.includes('advanced') || q.includes('beast')) {
      return `🏆 **Advanced-Level Training Philosophy & Split**:

As an **Advanced athlete**, progressive overload requires more than just adding weights:
1. **Mechanical Tension & RPE**: Train within RPE 8.5–9.5 (1 to 2 reps in reserve).
2. **Strict Rest Intervals**: Keep rest locked strictly to **30–45 seconds** between superset pairs to induce metabolic adaptation.
3. **Advanced Biomechanical Movements**:
   - **Pistol Squats**: Unilateral quad and ankle stability mastery.
   - **Explosive Pull-Ups / Chest-to-Bar**: Peak rate of force development (RFD).
   - **Deficit Bulgarian Split Squats**: Extreme stretch-mediated hypertrophy.
   - **Dragon Flags**: Maximum anti-extension core lever tension.

Switch your profile to **Advanced Level** to activate our high-volume Beast Mode programs!`;
    }

    if (q.includes('pistol') || q.includes('squat')) {
      return `🦵 **Pistol Squat (Single-Leg Mastery) Deep Dive**:

### The Biomechanics:
The Pistol Squat requires simultaneous ankle dorsiflexion, hip flexor compression, and unilateral quad strength.

### Step-by-Step Execution:
1. **The Setup**: Stand on your right foot, raise left leg straight out in front with toes pointed up.
2. **The Descent**: Hinge slightly at hips, then flex knee forward while reaching both arms straight ahead for counter-balance.
3. **The Bottom Turnaround**: Maintain midfoot contact. Do not let heel lift!
4. **The Drive**: Explode upward pressing the floor away.

### Progressive Steps:
- *Step 1*: Box Pistol Squats (sit to a chair and stand on 1 leg).
- *Step 2*: Counterbalance Pistol Squat (holding a light 5kg plate).
- *Step 3*: Strict Unassisted Pistol Squat.`;
    }

    if (q.includes('progressive overload') || q.includes('rpe')) {
      return `📈 **Mastering Progressive Overload & RPE**:

Progressive overload is the fundamental physiological law of muscle adaptation. You must continuously challenge your neuromuscular system:
1. **Volume Overload**: Adding 1-2 reps per set with the same load.
2. **Intensity Overload**: Increasing weight by 2-5% once target reps are mastered.
3. **Density Overload**: Completing the exact same workout with shorter rest (e.g. cutting rest from 60s down to 30-45s).
4. **Tempo Overload**: Lengthening the eccentric (negative) contraction to 3 full seconds.

**RPE Scale**:
- **RPE 8**: 2 reps left in the tank.
- **RPE 9**: 1 rep left in the tank.
- **RPE 10**: Absolute failure, zero reps remaining.`;
    }

    return `Awesome question! In exercise physiology, every movement is an opportunity for neuromuscular adaptation.
For your goal of **${profile.goal}** at the **${profile.fitnessLevel}** level:
1. Prioritize **eccentric control** (2-3 seconds descent).
2. Rest **30 to 45 seconds** between laps to maintain high metabolic output.
3. Drink 500ml of water pre-training and fuel with 1.6-2.2g of protein per kg of bodyweight daily.

Ask me about any specific muscle group, exercise cue, or training query!`;
  }

  return (
    <div className="flex flex-col h-full bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-800 bg-slate-900/95 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-400 to-teal-500 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-500/20">
              <Bot className="w-5 h-5 stroke-[2.5]" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-slate-900 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-white text-base tracking-tight">Coach Pulse</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                Real-Time AI Trainer
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Biometrics: {userProfile.name} • {userProfile.fitnessLevel} • Rest: {userProfile.defaultRestSeconds || 45}s
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* TTS Audio toggle */}
          <button
            onClick={() => {
              setVoiceEnabled(!voiceEnabled);
              if (voiceEnabled && typeof window !== 'undefined' && 'speechSynthesis' in window) {
                window.speechSynthesis.cancel();
                setSpeakingMessageId(null);
              }
            }}
            className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition ${
              voiceEnabled
                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white'
            }`}
            title={voiceEnabled ? 'Voice Reader Active' : 'Enable Voice Output'}
          >
            {voiceEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden md:inline">{voiceEnabled ? 'Voice On' : 'Voice Off'}</span>
          </button>

          <button
            onClick={onOpenDisclaimer}
            className="text-slate-400 hover:text-amber-400 p-2 rounded-xl hover:bg-slate-800 transition"
            title="Medical Disclaimer"
          >
            <ShieldAlert className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Quick Deep Explanation Prompts Strip */}
      <div className="px-4 py-2.5 border-b border-slate-800/80 bg-slate-950/60 flex items-center gap-2 overflow-x-auto no-scrollbar">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider shrink-0 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-emerald-400" />
          Topics:
        </span>
        {DEEP_EXPLANATION_PROMPTS.map((item, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(item.query)}
            className="shrink-0 text-xs px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/80 transition active:scale-95 whitespace-nowrap font-medium"
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'ai' && (
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 mt-1">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-[88%] sm:max-w-2xl rounded-2xl p-4 sm:p-5 text-xs sm:text-sm leading-relaxed shadow-md ${
                msg.sender === 'user'
                  ? 'bg-emerald-500 text-slate-950 font-semibold rounded-tr-none'
                  : 'bg-slate-800/90 border border-slate-700/80 text-slate-100 rounded-tl-none whitespace-pre-line'
              }`}
            >
              {msg.text || (
                <div className="flex items-center gap-2 text-slate-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce delay-100" />
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce delay-200" />
                  <span className="text-xs">Coach Pulse is breaking down your answer...</span>
                </div>
              )}

              {/* Message Utilities (Copy & Speak) for AI messages */}
              {msg.sender === 'ai' && msg.text && (
                <div className="mt-3 pt-3 border-t border-slate-700/60 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="font-mono text-[10px] text-slate-500">{msg.timestamp}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopyText(msg.text, msg.id)}
                      className="p-1 hover:text-white transition flex items-center gap-1"
                      title="Copy Answer"
                    >
                      {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span className="text-[10px]">{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                    </button>

                    <button
                      onClick={() => speakText(msg.text, msg.id)}
                      className={`p-1 hover:text-white transition flex items-center gap-1 ${
                        speakingMessageId === msg.id ? 'text-emerald-400 font-bold' : ''
                      }`}
                      title="Speak Answer Aloud"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span className="text-[10px]">{speakingMessageId === msg.id ? 'Stop' : 'Listen'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {msg.sender === 'user' && (
              <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0 mt-1">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <div className="p-3 sm:p-4 border-t border-slate-800 bg-slate-900/95">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask any query: biomechanics, advanced sets, 30-45s rest timing, nutrition..."
            className="flex-1 bg-slate-800/90 border border-slate-700 rounded-2xl px-4 py-3.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition shadow-inner"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isStreaming}
            className="p-3.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-slate-950 font-bold rounded-2xl transition shadow-lg shadow-emerald-500/25 active:scale-95 cursor-pointer"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};
