
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
  PRO = 'pro'
}

export interface FinancialItem {
  id: string;
  name: string;
  value: number;
  type: 'asset' | 'liability';
}

export interface DebtPitfall {
  title: string;
  description: string;
  dangerLevel: 'high' | 'medium';
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
