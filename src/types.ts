export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  model?: string;
  sources?: { title: string; url: string }[];
}

export interface Generation {
  id: string;
  type: 'chat' | 'image' | 'video' | 'voice' | 'music' | 'code' | 'website';
  title: string;
  prompt: string;
  output: string;
  date: string;
  duration?: string;
  resolution?: string;
  aspectRatio?: string;
  modelUsed?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  tier: 'Free Trial' | 'Quantum Pro' | 'Enterprise Cosmic';
  credits: number;
  maxCredits: number;
  avatar: string;
  joinedDate: string;
  streakDays: number;
}

export interface AppSettings {
  language: 'en' | 'ar';
  apiMode: 'live' | 'simulation';
  autoRetry: boolean;
  modelPreference: string;
  soundEffects: boolean;
  quantumGlow: boolean;
}

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'quantum';
  title: string;
  message: string;
  time: string;
  read: boolean;
}
