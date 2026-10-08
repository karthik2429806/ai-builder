import { AuthUser, AuthSession } from '../types/auth';

const TOKEN_KEY = 'pulseai_auth_token';
const USER_KEY = 'pulseai_auth_user';
const REMEMBER_KEY = 'pulseai_auth_remember';

export class AuthService {
  private static currentUser: AuthUser | null = null;
  private static currentToken: string | null = null;

  static init(): { user: AuthUser | null; token: string | null } {
    try {
      const remember = localStorage.getItem(REMEMBER_KEY) === 'true';
      const storage = remember ? localStorage : sessionStorage;

      const token = storage.getItem(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY);
      const userStr = storage.getItem(USER_KEY) || localStorage.getItem(USER_KEY);

      if (token && userStr) {
        this.currentToken = token;
        this.currentUser = JSON.parse(userStr);
        return { user: this.currentUser, token: this.currentToken };
      }
    } catch (e) {
      console.warn('Error reading auth session:', e);
    }
    return { user: null, token: null };
  }

  static getCurrentUser(): AuthUser | null {
    if (!this.currentUser) {
      this.init();
    }
    return this.currentUser;
  }

  static getToken(): string | null {
    if (!this.currentToken) {
      this.init();
    }
    return this.currentToken;
  }

  static isAuthenticated(): boolean {
    return Boolean(this.getToken() && this.getCurrentUser());
  }

  static async register(
    name: string,
    email: string,
    password: string
  ): Promise<{ user: AuthUser; token: string }> {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to register account');
    }

    this.saveSession(data.user, data.token, true);
    return { user: data.user, token: data.token };
  }

  static async login(
    email: string,
    password: string,
    rememberMe = true
  ): Promise<{ user: AuthUser; token: string }> {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, rememberMe }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Invalid email or password');
    }

    this.saveSession(data.user, data.token, rememberMe);
    return { user: data.user, token: data.token };
  }

  static async forgotPassword(
    email: string
  ): Promise<{ success: boolean; message: string; resetCode?: string; email: string }> {
    const res = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to request password reset');
    }

    return data;
  }

  static async resetPassword(
    email: string,
    resetCode: string,
    newPassword: string
  ): Promise<{ success: boolean; message: string }> {
    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, resetCode, newPassword }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to reset password');
    }

    return data;
  }

  static async logout(): Promise<void> {
    const token = this.getToken();
    if (token) {
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (e) {
        console.warn('Server logout call failed (offline or network error):', e);
      }
    }
    this.clearSession();
  }

  static saveSession(user: AuthUser, token: string, rememberMe = true): void {
    this.currentUser = user;
    this.currentToken = token;

    localStorage.setItem(REMEMBER_KEY, rememberMe ? 'true' : 'false');
    const storage = rememberMe ? localStorage : sessionStorage;

    // Clear opposite storage to avoid stale tokens
    const otherStorage = rememberMe ? sessionStorage : localStorage;
    otherStorage.removeItem(TOKEN_KEY);
    otherStorage.removeItem(USER_KEY);

    storage.setItem(TOKEN_KEY, token);
    storage.setItem(USER_KEY, JSON.stringify(user));
  }

  static clearSession(): void {
    this.currentUser = null;
    this.currentToken = null;

    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(REMEMBER_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
  }
}
