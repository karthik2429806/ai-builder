import { StorageService } from './storage';
import { NotificationItem } from '../types';

export class NotificationService {
  static async requestPermission(): Promise<boolean> {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    } catch {
      return false;
    }
  }

  static isPermissionGranted(): boolean {
    if (typeof window === 'undefined' || !('Notification' in window)) return false;
    return Notification.permission === 'granted';
  }

  static send(title: string, message: string, type: NotificationItem['type'] = 'workout') {
    // 1. Save to in-app notification center
    const notif: NotificationItem = {
      id: 'notif-' + Date.now(),
      title,
      message,
      type,
      timestamp: 'Just now',
      read: false,
    };
    StorageService.addNotification(notif);

    // 2. Trigger browser web push notification if granted
    if (this.isPermissionGranted()) {
      try {
        new Notification(title, {
          body: message,
          icon: '/favicon.ico',
          badge: '/favicon.ico',
        });
      } catch {
        // notification blocked or background
      }
    }

    return notif;
  }

  static triggerTestWorkoutReminder() {
    return this.send(
      '🏋️ Workout Reminder: Ready to Sweat?',
      "Coach Pulse: Today's scheduled session is ready! Even 25 minutes will turbocharge your energy.",
      'workout'
    );
  }

  static triggerHydrationReminder() {
    return this.send(
      '💧 Hydration Check!',
      'Drink a cool glass of water to keep your muscles hydrated and endurance high!',
      'hydration'
    );
  }

  static triggerMotivation() {
    const quotes = [
      "“Small disciplines repeated with consistency every day lead to great achievements.”",
      "“Don't count the days, make the days count.”",
      "“Your future self will thank you for today's effort.”",
      "“Progress over perfection. Every rep brings you closer to your goal!”"
    ];
    const quote = quotes[Math.floor(Math.random() * quotes.length)];
    return this.send('⚡ Daily Fitness Motivation', quote, 'motivation');
  }
}
