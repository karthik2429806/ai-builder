import React from 'react';
import { NotificationItem } from '../types';
import { NotificationService } from '../services/notifications';
import {
  Bell,
  X,
  CheckCheck,
  Flame,
  Droplet,
  Dumbbell,
  Zap,
  Clock,
  Sparkles,
} from 'lucide-react';

interface NotificationCenterModalProps {
  notifications: NotificationItem[];
  isOpen: boolean;
  onClose: () => void;
  onMarkAllAsRead: () => void;
  onTriggerTestReminder: (type: 'workout' | 'hydration' | 'motivation') => void;
}

export const NotificationCenterModal: React.FC<NotificationCenterModalProps> = ({
  notifications,
  isOpen,
  onClose,
  onMarkAllAsRead,
  onTriggerTestReminder,
}) => {
  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'workout':
        return <Dumbbell className="w-4 h-4 text-emerald-400" />;
      case 'hydration':
        return <Droplet className="w-4 h-4 text-cyan-400" />;
      case 'streak':
        return <Flame className="w-4 h-4 text-amber-400" />;
      case 'motivation':
        return <Sparkles className="w-4 h-4 text-purple-400" />;
      default:
        return <Zap className="w-4 h-4 text-emerald-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl text-slate-100 max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-slate-800 rounded-xl text-amber-400">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Notifications & Reminders
                {unreadCount > 0 && (
                  <span className="text-[10px] bg-emerald-500 text-slate-950 px-2 py-0.5 rounded-full font-bold">
                    {unreadCount} new
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-400">Daily workouts, hydration & recovery cues</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={onMarkAllAsRead}
                className="text-xs text-slate-400 hover:text-emerald-400 flex items-center gap-1 transition p-1"
                title="Mark all as read"
              >
                <CheckCheck className="w-4 h-4" />
                <span className="hidden sm:inline">Mark read</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Action Reminders Trigger Strip */}
        <div className="p-3 bg-slate-950/60 border-b border-slate-800 flex items-center gap-2 overflow-x-auto no-scrollbar text-xs">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider shrink-0">
            Send Alert:
          </span>
          <button
            onClick={() => onTriggerTestReminder('workout')}
            className="shrink-0 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 font-semibold transition flex items-center gap-1"
          >
            🏋️ Workout
          </button>
          <button
            onClick={() => onTriggerTestReminder('hydration')}
            className="shrink-0 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 font-semibold transition flex items-center gap-1"
          >
            💧 Hydration
          </button>
          <button
            onClick={() => onTriggerTestReminder('motivation')}
            className="shrink-0 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 font-semibold transition flex items-center gap-1"
          >
            ⚡ Motivation
          </button>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5 text-xs">
          {notifications.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              <Bell className="w-8 h-8 mx-auto mb-2 opacity-40" />
              No notifications yet.
            </div>
          ) : (
            notifications.map((item) => (
              <div
                key={item.id}
                className={`p-3.5 rounded-xl border transition flex items-start gap-3 ${
                  !item.read
                    ? 'bg-slate-800/80 border-slate-700 text-slate-200 shadow-sm'
                    : 'bg-slate-900/60 border-slate-800/80 text-slate-400'
                }`}
              >
                <div className="p-2 rounded-xl bg-slate-800/90 border border-slate-700 shrink-0 mt-0.5">
                  {getIcon(item.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-bold text-white text-xs truncate">{item.title}</span>
                    <span className="text-[10px] text-slate-500 font-mono shrink-0 ml-2">
                      {item.timestamp}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed text-slate-300">{item.message}</p>
                </div>
                {!item.read && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 mt-2" />
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-900/95 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
