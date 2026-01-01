
export interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  image?: {
    data: string;
    mimeType: string;
  };
  timestamp: number;
  replyToId?: string;
  replyToContent?: string;
}

export enum AppTab {
  HOME = 'home',
  CHAT = 'chat',
  TOOLS = 'tools',
  HABITS = 'habits',
  ASSETS = 'assets',
  PRO = 'pro',
  DIARY = 'diary'
}

export interface FinancialItem {
  id: string;
  name: string;
  value: number;
  type: 'asset' | 'liability' | 'income';
}

export interface DiaryEntry {
  id: string;
  mood: string; // emoji or code
  content: string;
  timestamp: number;
  aiResponse?: string;
}

export interface HabitItem {
  id: string;
  task: string;
  completed: boolean;
}

export type SubscriptionTier = 'weekly' | 'monthly' | 'quarterly' | 'yearly';

export interface UserStatus {
  isPro: boolean;
  tier?: SubscriptionTier;
  expiresAt?: number;
}
