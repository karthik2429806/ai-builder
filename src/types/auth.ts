export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  createdAt: string;
  fitnessLevel?: string;
  goal?: string;
}

export interface AuthSession {
  token: string;
  user: AuthUser;
  expiresAt: string;
  rememberMe: boolean;
}

export type AuthView = 'welcome' | 'signin' | 'signup' | 'forgot-password' | 'reset-password';

export interface PasswordStrengthResult {
  score: number; // 0 to 4
  label: 'Very Weak' | 'Weak' | 'Medium' | 'Strong' | 'Very Strong';
  color: string;
  hasMinLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
}

export function evaluatePasswordStrength(password: string): PasswordStrengthResult {
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/.test(password);

  let score = 0;
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (hasUppercase && hasLowercase) score += 1;
  if (hasNumber && hasSpecialChar) score += 1;

  if (password.length === 0) {
    return {
      score: 0,
      label: 'Very Weak',
      color: 'bg-slate-600',
      hasMinLength,
      hasUppercase,
      hasLowercase,
      hasNumber,
      hasSpecialChar,
    };
  }

  if (score <= 1) {
    return {
      score: 1,
      label: 'Weak',
      color: 'bg-rose-500',
      hasMinLength,
      hasUppercase,
      hasLowercase,
      hasNumber,
      hasSpecialChar,
    };
  }

  if (score === 2) {
    return {
      score: 2,
      label: 'Medium',
      color: 'bg-amber-500',
      hasMinLength,
      hasUppercase,
      hasLowercase,
      hasNumber,
      hasSpecialChar,
    };
  }

  if (score === 3) {
    return {
      score: 3,
      label: 'Strong',
      color: 'bg-emerald-500',
      hasMinLength,
      hasUppercase,
      hasLowercase,
      hasNumber,
      hasSpecialChar,
    };
  }

  return {
    score: 4,
    label: 'Very Strong',
    color: 'bg-emerald-400',
    hasMinLength,
    hasUppercase,
    hasLowercase,
    hasNumber,
    hasSpecialChar,
  };
}
