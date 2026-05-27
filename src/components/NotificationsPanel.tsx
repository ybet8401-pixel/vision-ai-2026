import React from 'react';
import { X, Check, Trash2, Bell, Shield, Sparkles, AlertTriangle } from 'lucide-react';
import { Notification } from '../types';

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
  language: 'en' | 'ar';
}

export default function NotificationsPanel({
  isOpen,
  onClose,
  notifications,
  setNotifications,
  language
}: NotificationsPanelProps) {
  if (!isOpen) return null;
  const isRtl = language === 'ar';

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const toggleRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: !n.read } : n));
  };

  const removeNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-neutral-950/60 backdrop-blur-sm"
      />

      {/* Panel */}
      <div className={`
        relative w-full max-w-md h-full bg-neutral-950 border-l border-neutral-900/80 shadow-2xl flex flex-col z-10
        ${isRtl ? 'order-first' : ''}
      `}>
        {/* Header */}
        <div className="p-6 border-b border-neutral-900/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-white text-lg font-sans">
              {isRtl ? 'الإشعارات الكونية' : 'System Manifests'}
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 bg-neutral-900/60 text-neutral-400 hover:text-white rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar */}
        {notifications.length > 0 && (
          <div className="px-6 py-3 bg-neutral-950/40 border-b border-neutral-900/40 flex justify-between text-xs">
            <button 
              onClick={markAllRead} 
              className="text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              {isRtl ? 'قراءة الكل' : 'Clear Unread Alerts'}
            </button>
            <button 
              onClick={clearAll} 
              className="text-rose-400 hover:text-rose-300 font-medium flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              {isRtl ? 'حذف الكل' : 'Re-initialize logs'}
            </button>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-neutral-900/80 border border-neutral-800/40 flex items-center justify-center">
                <Bell className="w-6 h-6 text-neutral-600" />
              </div>
              <div>
                <p className="text-white text-sm font-semibold">{isRtl ? 'السجل نظيف' : 'Zero Active Alarms'}</p>
                <p className="text-xs text-neutral-500 mt-1">{isRtl ? 'لم يتم ترحيل أي إشعارات جديدة حالياً.' : 'Cognitive state is perfectly synchronized.'}</p>
              </div>
            </div>
          ) : (
            notifications.map(item => (
              <div 
                key={item.id}
                onClick={() => toggleRead(item.id)}
                className={`
                  p-4 rounded-xl border transition-all duration-300 cursor-pointer relative overflow-hidden group
                  ${item.read 
                    ? 'bg-neutral-950/40 border-neutral-900/60 text-neutral-400 opacity-75' 
                    : 'bg-neutral-900/30 border-neutral-800/80 text-white shadow-lg shadow-indigo-500/5'}
                `}
              >
                {!item.read && (
                  <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-cyan-400 rounded-bl-xl" />
                )}

                <div className="flex gap-3">
                  {/* Icon depending on type */}
                  <div className={`mt-0.5 flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center border ${
                    item.type === 'success' ? 'bg-emerald-950/20 border-emerald-800/30 text-emerald-400' :
                    item.type === 'warning' ? 'bg-amber-950/20 border-amber-800/30 text-amber-400' :
                    item.type === 'quantum' ? 'bg-purple-950/20 border-purple-800/30 text-purple-400' :
                    'bg-cyan-950/20 border-cyan-800/30 text-cyan-400'
                  }`}>
                    {item.type === 'success' ? <Check className="w-4 h-4" /> :
                     item.type === 'warning' ? <AlertTriangle className="w-4 h-4" /> :
                     item.type === 'quantum' ? <Sparkles className="w-4 h-4" /> :
                     <Shield className="w-4 h-4" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-semibold ${item.read ? 'text-neutral-400' : 'text-white'}`}>{item.title}</p>
                    <p className="text-xs text-neutral-400 mt-1 font-sans">{item.message}</p>
                    <span className="text-[9px] font-mono text-neutral-600 mt-2 block">{item.time}</span>
                  </div>

                  <button 
                    onClick={(e) => removeNotification(item.id, e)}
                    className="opacity-0 group-hover:opacity-100 p-1 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-neutral-400 hover:text-rose-400 transition flex-shrink-0 align-start self-start"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
