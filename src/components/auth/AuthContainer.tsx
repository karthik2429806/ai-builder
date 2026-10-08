import React, { useState } from 'react';
import { AuthUser, AuthView } from '../../types/auth';
import { WelcomeScreen } from './WelcomeScreen';
import { SignInView } from './SignInView';
import { SignUpView } from './SignUpView';
import { ForgotPasswordView } from './ForgotPasswordView';
import { AuthService } from '../../services/auth';

interface AuthContainerProps {
  onAuthenticated: (user: AuthUser, isNewRegistration?: boolean) => void;
}

export const AuthContainer: React.FC<AuthContainerProps> = ({ onAuthenticated }) => {
  const [currentView, setCurrentView] = useState<AuthView>('welcome');

  const handleQuickDemo = async () => {
    try {
      const res = await AuthService.login('alex@pulsetrainer.ai', 'Fitness@2026!', true);
      onAuthenticated(res.user, false);
    } catch (e) {
      // If server restart caused cold state, register or fallback
      console.warn('Demo login attempt:', e);
      // Try register if demo user not seeded yet
      try {
        const reg = await AuthService.register('Alex Rivera', 'alex@pulsetrainer.ai', 'Fitness@2026!');
        onAuthenticated(reg.user, false);
      } catch {
        // Fallback demo user
        onAuthenticated(
          {
            id: 'user-default-alex',
            name: 'Alex Rivera',
            email: 'alex@pulsetrainer.ai',
            createdAt: new Date().toISOString(),
          },
          false
        );
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-emerald-500 selection:text-slate-950 relative overflow-x-hidden">
      {/* Athletic background ambient lights */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 -right-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-25" />
      </div>

      {/* Main Card View */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-lg bg-slate-900/90 border border-slate-800/90 rounded-3xl shadow-2xl shadow-emerald-950/40 backdrop-blur-xl overflow-hidden transition-all duration-300">
          {currentView === 'welcome' && (
            <WelcomeScreen
              onNavigateToSignUp={() => setCurrentView('signup')}
              onNavigateToSignIn={() => setCurrentView('signin')}
              onQuickDemoLogin={handleQuickDemo}
            />
          )}

          {currentView === 'signin' && (
            <SignInView
              onSuccess={(user) => onAuthenticated(user, false)}
              onNavigateToSignUp={() => setCurrentView('signup')}
              onNavigateToForgotPassword={() => setCurrentView('forgot-password')}
            />
          )}

          {currentView === 'signup' && (
            <SignUpView
              onSuccess={(user) => onAuthenticated(user, true)}
              onNavigateToSignIn={() => setCurrentView('signin')}
            />
          )}

          {currentView === 'forgot-password' && (
            <ForgotPasswordView
              onNavigateToSignIn={() => setCurrentView('signin')}
            />
          )}
        </div>
      </main>

      {/* Bottom Footer Note */}
      <footer className="relative z-10 py-4 text-center text-xs text-slate-500">
        AI Personal Trainer • High-Density Conditioning & Biomechanics Coach
      </footer>
    </div>
  );
};
